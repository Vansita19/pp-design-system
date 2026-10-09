/* AlignUI-inspired tooltip entrance/exit, preserving Forma's compact surface. */
(() => {
 const F=window.Forma,E=F.escape,mounted=new WeakMap();let serial=0;
 F.addToken('motion.duration.tooltipDelay','duration','300ms','extended');
 F.addToken('motion.duration.tooltipGrace','duration','100ms','extended');
 const aliases={background:'semantic.text.heading',foreground:'semantic.text.inverse',radius:'radius.md',padding:'space.8',gap:'space.8',font:'font.size.12',line:'font.line.16',offset:'space.4',duration:'motion.duration.fast',easing:'motion.easing.standard',delay:'motion.duration.tooltipDelay',grace:'motion.duration.tooltipGrace'};
 for(const [role,target]of Object.entries(aliases))F.addToken('component.tooltip.'+role,F.tokens[target].type,'{'+target+'}','normalized');
 F.tooltipTokens=()=>['font.family.sans',...Object.keys(aliases).map(role=>'component.tooltip.'+role),...Object.values(F.buttonTokens({variant:'secondary',icon:'only'}))];
 F.tooltip=(c={})=>{const id='forma-tooltip-'+ ++serial;return `<div class="pp-tooltip-wrap pp-motion-tooltip ${c.position==='bottom'?'bottom':'top'}" data-tooltip-host>${F.button({variant:'secondary',icon:'only',iconName:'copy'},'Copy',`data-tooltip-trigger aria-describedby="${id}"`)}<div class="pp-tooltip" role="tooltip" id="${id}" data-tooltip-content hidden>${E(c.content||'Copy to clipboard')}</div></div>`;};
 F.wireTooltip=(root,registerCleanup=()=>{})=>{
  const cleanups=[];
  root.querySelectorAll('[data-tooltip-host]').forEach(host=>{
   if(mounted.has(host))return;const doc=host.ownerDocument||document,win=doc.defaultView||window,trigger=host.querySelector('[data-tooltip-trigger]'),tip=host.querySelector('[data-tooltip-content]'),off=[];
   let hovered=false,tipHovered=false,focused=false,suppressed=false,wanted=false,timer=null,animation=null,disposed=false;
   const cancelTimer=()=>{if(timer!==null){win.clearTimeout(timer);timer=null;}};
   const stopAnimation=()=>{if(animation){animation.onfinish=null;animation.cancel();animation=null;}};
   const settle=()=>{stopAnimation();tip.hidden=!wanted;};
   const preference=F.watchComponentMotion(host,settle),listen=(node,type,fn)=>{node.addEventListener(type,fn);off.push(()=>node.removeEventListener(type,fn));};
   const move=show=>{
    if(disposed)return;cancelTimer();const previous=animation&&win.getComputedStyle?win.getComputedStyle(tip):null,from=previous?{opacity:previous.opacity,transform:previous.transform}:null;stopAnimation();wanted=show;
    if(show)tip.hidden=false;if(preference.quiet()||typeof tip.animate!=='function'){settle();return;}
    const offset=parseFloat(F.resolve('component.tooltip.offset'))*(host.classList.contains('bottom')?-1:1),hidden={opacity:0,transform:`translate(-50%, ${offset}px) scale(.95)`},visible={opacity:1,transform:'translate(-50%, 0) scale(1)'};
    const current=tip.animate([from||(show?hidden:visible),show?visible:hidden],{duration:parseFloat(F.resolve('component.tooltip.duration')),easing:F.resolve('component.tooltip.easing')});animation=current;current.onfinish=()=>{if(animation===current&&!disposed)settle();};
   };
   const sync=()=>{
    cancelTimer();if(!hovered&&!tipHovered&&!focused)suppressed=false;
    if((hovered||tipHovered||focused)&&!suppressed){if(wanted)return;if(focused||!tip.hidden)move(true);else timer=win.setTimeout(()=>{timer=null;move(true);},parseFloat(F.resolve('component.tooltip.delay')));}
    else if(wanted)timer=win.setTimeout(()=>{timer=null;move(false);},parseFloat(F.resolve('component.tooltip.grace')));
   };
   listen(host,'pointerenter',()=>{hovered=true;sync();});listen(host,'pointerleave',()=>{hovered=false;sync();});
   listen(tip,'pointerenter',()=>{tipHovered=true;sync();});listen(tip,'pointerleave',()=>{tipHovered=false;sync();});
   listen(trigger,'focus',()=>{focused=true;sync();});listen(trigger,'blur',()=>{focused=false;sync();});
   listen(doc,'keydown',event=>{if(event.key==='Escape'&&(wanted||timer!==null)){event.preventDefault();suppressed=true;cancelTimer();move(false);}});
   const cleanup=()=>{if(disposed)return;disposed=true;cancelTimer();stopAnimation();tip.hidden=true;preference.dispose();off.forEach(fn=>fn());mounted.delete(host);};mounted.set(host,cleanup);cleanups.push(cleanup);
  });
  const cleanup=()=>cleanups.forEach(fn=>fn());registerCleanup(cleanup);return cleanup;
 };
 document.getElementById('project-tokens').textContent=F.tokenCSS();
})();
