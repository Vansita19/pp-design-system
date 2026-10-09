/* AlignUI-inspired guided popover, adapted to Forma atoms and local preview state. */
(() => {
 const F=window.Forma,E=F.escape;
 if(!F.tokens['size.320'])F.addToken('size.320','dimension','320px','extended');
 const aliases={width:'size.320',padding:'space.20',radius:'radius.xl',background:'semantic.surface.default',border:'semantic.border.default',shadow:'shadow.menu',
  'icon.size':'space.24','icon.container':'space.48','icon.radius':'radius.full','icon.color':'semantic.text.heading','icon.shadow':'shadow.secondary',
  'title.gap':'space.16','title.font':'font.size.14','title.line':'font.line.20','title.weight':'font.weight.500','title.color':'semantic.text.heading',
  'description.gap':'space.4','description.font':'font.size.14','description.line':'font.line.20','description.color':'semantic.text.secondary',
  'footer.gap':'space.20','footer.paddingX':'space.20','footer.paddingY':'space.16','footer.layoutGap':'space.16','footer.actionGap':'space.12',
  'step.font':'font.size.12','step.line':'font.line.16','step.color':'semantic.text.secondary','close.inset':'space.12','anchor.gap':'space.8','viewport.inset':'space.8',layer:'layer.overlay'};
 for(const [role,target]of Object.entries(aliases))F.addToken('component.guidedPopover.'+role,F.tokens[target].type,'{'+target+'}','normalized');
 const steps=[
  {title:'Insert Popover',description:'Insert popover description here. It would look much better as three lines of text.'},
  {title:'Choose your preferences',description:'Make this space your own. Choose the details that matter to you and adjust them whenever you need.'},
  {title:'Invite your team',description:'Bring your teammates together in one place. Share your workspace so everyone can get started.'},
  {title:'You’re ready to go',description:'Your introduction is complete. Explore your workspace and return to these steps whenever you need.'}
 ];
 const normalize=(c={})=>({label:String(c.label||'Open Popover'),title:String(c.title||steps[0].title),description:String(c.description||steps[0].description),step:Math.min(4,Math.max(1,Math.floor(Number(c.step)||1))),open:c.open===true,disabled:Boolean(c.disabled)});
 const buttonConfigs=[{variant:'secondary',size:'md'},{variant:'ghost',size:'sm',icon:'only',iconName:'close'},{variant:'secondary',size:'sm'},{variant:'primary',size:'sm'}];
 F.guidedPopoverTokens=(c={})=>[...new Set(['font.family.sans','font.weight.400','border.width','semantic.border.focus','space.4',...Object.keys(aliases).map(role=>'component.guidedPopover.'+role),...buttonConfigs.flatMap((config,index)=>Object.values(F.buttonTokens({...config,...(index===0&&c.disabled?{state:'disabled'}:{})})))])];
 let serial=0;
 F.guidedPopover=(c={})=>{
  const v=normalize(c),id='guided-popover-'+ ++serial,current=v.step===1?v:steps[v.step-1];
  return `<div class="pp-guided-popover-host" data-guided-popover data-step="${v.step}" data-initial-open="${v.open}" data-first-title="${E(v.title)}" data-first-description="${E(v.description)}">${F.button({...buttonConfigs[0],state:v.disabled?'disabled':'default'},v.label,`data-guided-trigger aria-haspopup="dialog" aria-expanded="false" aria-controls="${id}"`)}<section class="pp-guided-popover pp-theme" id="${id}" data-guided-panel popover="manual" role="dialog" aria-labelledby="${id}-title" aria-describedby="${id}-description" hidden>${F.button(buttonConfigs[1],'Close popover','data-guided-close')}<span class="pp-guided-popover-icon" aria-hidden="true">${F.icon('user-fill',24)}</span><h3 class="pp-guided-popover-title" id="${id}-title" data-guided-title tabindex="-1">${E(current.title)}</h3><p class="pp-guided-popover-description" id="${id}-description" data-guided-description>${E(current.description)}</p><footer class="pp-guided-popover-footer"><span class="pp-guided-popover-step" data-guided-step aria-live="polite" aria-atomic="true">Step ${v.step} of 4</span><div class="pp-guided-popover-actions">${F.button(buttonConfigs[2],'Back',`data-guided-back${v.step===1?' disabled':''}`)}${F.button(buttonConfigs[3],v.step===4?'Done':'Next','data-guided-next')}</div></footer></section><span class="visually-hidden" data-guided-status role="status"></span></div>`;
 };
 const mounted=new WeakMap();
 F.wireGuidedPopover=(root,registerCleanup)=>{
  const cleanups=[];
  root.querySelectorAll('[data-guided-popover]').forEach(host=>{
   if(mounted.has(host))return;
   const trigger=host.querySelector('[data-guided-trigger]'),panel=host.querySelector('[data-guided-panel]'),title=host.querySelector('[data-guided-title]'),description=host.querySelector('[data-guided-description]'),counter=host.querySelector('[data-guided-step]'),back=host.querySelector('[data-guided-back]'),next=host.querySelector('[data-guided-next]'),dismiss=host.querySelector('[data-guided-close]'),status=host.querySelector('[data-guided-status]');
   const doc=host.ownerDocument||document,win=doc.defaultView||window;
   let step=normalize({step:host.dataset.step}).step,opened=false,inlineOpened=false,portal=false,topLayer=false,disposed=false;
   const removers=[],listen=(target,event,fn,options)=>{target.addEventListener(event,fn,options);removers.push(()=>target.removeEventListener(event,fn,options));};
   const position=()=>{
    if(!opened||inlineOpened||!trigger.isConnected)return;
    const rect=trigger.getBoundingClientRect(),view=win.visualViewport,inset=parseFloat(F.resolve('component.guidedPopover.viewport.inset')),gap=parseFloat(F.resolve('component.guidedPopover.anchor.gap'));
    const left=view?.offsetLeft||0,top=view?.offsetTop||0,width=view?.width||win.innerWidth,height=view?.height||win.innerHeight;
    panel.style.width=Math.min(parseFloat(F.resolve('component.guidedPopover.width')),Math.max(0,width-inset*2))+'px';
    panel.style.maxHeight=Math.max(0,height-inset*2)+'px';
    const size=panel.getBoundingClientRect(),below=rect.bottom+gap,above=rect.top-gap-size.height;
    Object.assign(panel.style,{left:Math.max(left+inset,Math.min(rect.left,left+width-size.width-inset))+'px',top:Math.max(top+inset,Math.min(below+size.height<=top+height-inset?below:above>=top+inset?above:top+inset,top+height-size.height-inset))+'px'});
   };
   const render=()=>{
    const current=step===1?{title:host.dataset.firstTitle,description:host.dataset.firstDescription}:steps[step-1];
    title.textContent=current.title;description.textContent=current.description;counter.textContent=`Step ${step} of 4`;back.disabled=step===1;next.textContent=step===4?'Done':'Next';host.dataset.step=String(step);position();
   };
   const close=(restore=true)=>{
    if(!opened)return;opened=false;
    if(topLayer){try{panel.hidePopover();}catch{}topLayer=false;}
    panel.hidden=true;inlineOpened=false;panel.removeAttribute('data-inline');trigger.setAttribute('aria-expanded','false');
    if(portal){host.append(panel);portal=false;}
    if(restore&&trigger.isConnected)trigger.focus({preventScroll:true});
   };
   const open=(focus=true,inline=false)=>{
    if(disposed||trigger.disabled||opened)return;
    opened=true;panel.hidden=false;trigger.setAttribute('aria-expanded','true');
    inlineOpened=inline;
    if(inline){panel.removeAttribute('popover');panel.setAttribute('data-inline','true');}
    else{
    panel.setAttribute('popover','manual');
    try{if(typeof panel.showPopover!=='function')throw Error('Popover unavailable');panel.showPopover();topLayer=true;}
    catch{panel.removeAttribute('popover');doc.body.append(panel);portal=true;}
    }
    position();if(focus)title.focus({preventScroll:true});
   };
   listen(trigger,'click',()=>opened?close():open());
   listen(dismiss,'click',()=>close());
   listen(back,'click',()=>{if(!opened||back.disabled||step===1)return;step--;render();if(back.disabled)next.focus({preventScroll:true});});
   listen(next,'click',()=>{if(!opened)return;if(step===4){status.textContent='Introduction complete.';close();step=1;render();}else{step++;render();}});
   listen(doc,'keydown',event=>{if(opened&&event.key==='Escape'&&(panel.contains(doc.activeElement)||host.contains(doc.activeElement))){event.preventDefault();close();}});
   listen(doc,'pointerdown',event=>{if(opened&&!panel.contains(event.target)&&!host.contains(event.target))close(panel.contains(doc.activeElement));});
   listen(doc,'focusin',event=>{if(opened&&!panel.contains(event.target)&&!host.contains(event.target))close(false);});
   listen(panel,'keydown',event=>{if(event.key!=='Tab')return;if(event.shiftKey&&(event.target===title||event.target===dismiss)){event.preventDefault();close();}else if(!event.shiftKey&&event.target===next){close();}});
   listen(win,'resize',position);listen(doc,'scroll',position,true);
   if(win.visualViewport){listen(win.visualViewport,'resize',position);listen(win.visualViewport,'scroll',position);}
   const cleanup=()=>{if(disposed)return;disposed=true;close(false);removers.forEach(remove=>remove());mounted.delete(host);};
   mounted.set(host,cleanup);cleanups.push(cleanup);render();if(host.dataset.initialOpen==='true')open(false,true);
  });
  const cleanup=()=>cleanups.forEach(dispose=>dispose());if(typeof registerCleanup==='function')registerCleanup(cleanup);return cleanup;
 };
 document.getElementById('project-tokens').textContent=F.tokenCSS();
})();
