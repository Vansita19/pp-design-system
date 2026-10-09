/* AlignUI-inspired drawer anatomy, normalized to Forma's shared atoms and thin dividers. */
(() => {
 const F=window.Forma,E=F.escape,mounted=new WeakMap();let serial=0,scrollLocks=0,previousOverflow='';
 for(const n of [320,400,480,560])if(!F.tokens['size.'+n])F.addToken('size.'+n,'dimension',n+'px','extended');
 if(!F.tokens['color.black.alpha40'])F.addToken('color.black.alpha40','color','#00000066','extended');
 const aliases={background:'semantic.surface.default',foreground:'semantic.text.heading',muted:'semantic.text.secondary',border:'semantic.border.default',backdrop:'color.black.alpha40',shadow:'shadow.modal',
  'width.sm':'size.320','width.md':'size.400','width.lg':'size.480',previewHeight:'size.560',radius:'radius.xl',padding:'space.20',gap:'space.16',itemGap:'space.12',smallGap:'space.4',sectionGap:'space.24',rowPadding:'space.8',
  titleFont:'font.size.16',titleLine:'font.line.24',font:'font.size.14',line:'font.line.20',smallFont:'font.size.12',smallLine:'font.line.16',weight:'font.weight.500',icon:'space.20',iconContainer:'space.40',iconRadius:'radius.full',
  hover:'semantic.surface.canvas',detailBackground:'semantic.surface.subtle',duration:'motion.duration.normal',easing:'motion.easing.standard',focus:'shadow.focus'};
 for(const [role,target]of Object.entries(aliases))F.addToken('component.drawer.'+role,F.tokens[target].type,'{'+target+'}','normalized');
 const normalize=(c={})=>({variant:c.variant==='form'?'form':'details',side:c.side==='left'?'left':'right',size:['sm','lg'].includes(c.size)?c.size:'md',title:String(c.title||(c.variant==='form'?'Edit contact':'Contact details')),label:String(c.label||'Open drawer'),footer:c.footer!==false,preview:c.preview!==false,disabled:Boolean(c.disabled)});
 const avatar={variant:'text',initials:'AM',name:'Alex Morgan',size:'lg',tone:'purple',shape:'circle'},badge={variant:'soft',tone:'neutral',label:'Founder',size:'sm'};
 const activities=[['file','Pitch deck updated','AsterGrid · Today','The founder added a new market overview and updated the product roadmap.'],['chat','Product update','AsterGrid · Yesterday','The team shared a summary of their latest product improvements.'],['clock','Intro call scheduled','AsterGrid · Oct 7','A 30-minute introduction with the founding team is on the calendar.'],['check','Profile completed','AsterGrid · Oct 6','Company details and contact information were added to the workspace.'],['users','Added to workspace','AsterGrid · Oct 5','Alex joined this local example workspace as the company founder.']];
 F.drawerTokens=(c={})=>{
  const v=normalize(c),ids=['font.family.sans','font.weight.400','border.width','space.0','space.8','space.12','space.16','space.20','space.32','space.64',...Object.keys(aliases).filter(role=>!role.startsWith('width.')||role==='width.'+v.size).map(role=>'component.drawer.'+role),...Object.values(F.buttonTokens({variant:'secondary',state:v.disabled?'disabled':'default'})),...Object.values(F.buttonTokens({variant:'ghost',size:'sm',icon:'only'}))];
  if(v.footer)for(const variant of ['secondary','primary'])ids.push(...Object.values(F.buttonTokens({variant,size:'md'})));
  if(v.variant==='details')ids.push(...F.avatarTokens(avatar),...Object.values(F.badgeTokens(badge)));
  else ids.push(...['background','foreground','border','placeholder','radius','padding','font','focus'].map(role=>'component.input.'+role),'component.control.height.md','component.control.line','semantic.border.focus','semantic.text.heading','semantic.text.body');
  return [...new Set(ids)];
 };
 const header=(v,id,live)=>`<header class="pp-drawer-header"><h3 id="${id}-title" data-drawer-title tabindex="-1">${E(v.title)}</h3>${live?F.button({variant:'ghost',size:'sm',icon:'only',iconName:'close'},'Close drawer','data-drawer-close'):'<span class="pp-drawer-preview-close" aria-hidden="true">'+F.icon('close',16)+'</span>'}</header>`;
 const details=id=>`<div class="pp-drawer-profile">${F.avatar(avatar)}<div><strong>Alex Morgan</strong><span>Co-founder, AsterGrid</span></div>${F.badge(badge)}</div><section class="pp-drawer-section" aria-labelledby="${id}-information"><h4 id="${id}-information">Information</h4><dl class="pp-drawer-information"><div><dt>Email address</dt><dd>alex@example.com</dd></div><div><dt>Company</dt><dd>AsterGrid</dd></div><div><dt>Location</dt><dd>San Francisco, CA</dd></div></dl></section><section class="pp-drawer-section" aria-labelledby="${id}-activity"><h4 id="${id}-activity">Recent activity</h4><div class="pp-drawer-activity-list">${activities.map(([icon,title,meta,detail],index)=>`<div class="pp-drawer-activity" ${index>2?'data-drawer-extra hidden':''}><button type="button" class="pp-drawer-activity-trigger" data-drawer-activity aria-expanded="false" aria-controls="${id}-activity-${index}"><span class="pp-drawer-activity-icon" aria-hidden="true">${F.icon(icon,20)}</span><span class="pp-drawer-activity-copy"><strong>${E(title)}</strong><small>${E(meta)}</small></span><span class="pp-drawer-chevron" aria-hidden="true">${F.icon('chevron',16)}</span></button><p class="pp-drawer-activity-detail" id="${id}-activity-${index}" hidden>${E(detail)}</p></div>`).join('')}</div></section>`;
 const body=(v,id)=>`<div class="pp-drawer-body" data-drawer-body>${v.variant==='form'?`<label class="pp-field" for="${id}-name">Name<input class="pp-input" id="${id}-name" name="name" value="Alex Morgan" required autocomplete="off"></label><label class="pp-field" for="${id}-description">Description<textarea class="pp-input" id="${id}-description" name="description" rows="5" placeholder="Add a description">Co-founder at AsterGrid.</textarea></label>`:details(id)}<span class="pp-drawer-status" data-drawer-status role="status"></span></div>`;
 const footer=(v,live)=>v.footer?`<footer class="pp-drawer-footer">${F.button({variant:'secondary'},v.variant==='form'?'Cancel':'Close',live?'data-drawer-close':'data-drawer-preview-reset')}${F.button({variant:'primary'},v.variant==='form'?'Save changes':'View all activity',v.variant==='form'?'type="submit"':'data-drawer-all aria-expanded="false"')}</footer>`:'';
 const content=(v,id,live)=>header(v,id,live)+(v.variant==='form'?`<form class="pp-drawer-form" data-drawer-form>${body(v,id)}${footer(v,live)}</form>`:body(v,id)+footer(v,live));
 F.drawer=(c={})=>{
  const v=normalize(c),id='forma-drawer-'+ ++serial,style=`--drawer-width:${F.v('component.drawer.width.'+v.size)}`;
  return `<div class="pp-drawer-demo" data-drawer-demo>${v.preview?`<section class="pp-drawer-card pp-drawer-preview pp-theme" data-drawer-preview data-side="${v.side}" aria-label="${E(v.title)} preview" style="${style}">${content(v,id+'-preview',false)}</section>`:''}${F.button({variant:'secondary',state:v.disabled?'disabled':'default'},v.label,`data-drawer-open aria-haspopup="dialog" aria-controls="${id}" aria-expanded="false"`)}<dialog class="pp-drawer-card pp-drawer-dialog pp-theme" id="${id}" data-drawer-dialog data-side="${v.side}" aria-labelledby="${id}-title" style="${style}">${content(v,id,true)}</dialog><span class="visually-hidden" data-drawer-announcement role="status"></span></div>`;
 };
 F.wireDrawer=(root,registerCleanup)=>{
  const cleanups=[];
  root.querySelectorAll('[data-drawer-demo]').forEach(host=>{
   if(mounted.has(host))return;
   const dialog=host.querySelector('[data-drawer-dialog]'),trigger=host.querySelector('[data-drawer-open]'),announcement=host.querySelector('[data-drawer-announcement]'),doc=host.ownerDocument||document,win=doc.defaultView||window;
   let disposed=false,closing=false,timer=null,restoreTarget=null,scrollLocked=false;
   const removers=[],listen=(target,type,fn,options)=>{target.addEventListener(type,fn,options);removers.push(()=>target.removeEventListener(type,fn,options));};
   const media=win.matchMedia?.('(prefers-reduced-motion: reduce)'),paused=()=>Boolean(media?.matches||doc.body.classList.contains('motion-paused')||host.closest('.preview-paused'));
   const unlockScroll=()=>{if(!scrollLocked)return;scrollLocked=false;if(--scrollLocks===0)doc.body.style.overflow=previousOverflow;};
   const clearTimer=()=>{if(timer!==null){win.clearTimeout(timer);timer=null;}};
   const restore=()=>{const target=restoreTarget?.isConnected?restoreTarget:trigger;if(target.isConnected)target.focus({preventScroll:true});restoreTarget=null;};
   const finishClose=(focus=true)=>{clearTimer();closing=false;dialog.removeAttribute('data-phase');if(dialog.open)dialog.close();trigger.setAttribute('aria-expanded','false');unlockScroll();if(focus&&!disposed&&restoreTarget)restore();};
   const close=()=>{if(!dialog.open||closing)return;closing=true;if(paused()){finishClose();return;}dialog.dataset.phase='closing';timer=win.setTimeout(()=>finishClose(),parseFloat(F.resolve('component.drawer.duration'))+50);};
   const open=()=>{
    if(disposed||trigger.disabled)return;if(dialog.open){if(closing){clearTimer();closing=false;dialog.dataset.phase='opening';}return;}
    restoreTarget=doc.activeElement;dialog.dataset.motion=paused()?'off':'on';dialog.dataset.phase='opening';
    if(typeof dialog.showModal!=='function'){announcement.textContent='This browser does not support the drawer dialog. Use the inline preview.';dialog.removeAttribute('data-phase');return;}
    dialog.showModal();if(!scrollLocked){if(scrollLocks++===0)previousOverflow=doc.body.style.overflow;doc.body.style.overflow='hidden';scrollLocked=true;}trigger.setAttribute('aria-expanded','true');dialog.querySelector('[data-drawer-title]').focus({preventScroll:true});
   };
   const syncMotion=()=>{dialog.dataset.motion=paused()?'off':'on';if(paused()){if(closing)finishClose();else dialog.removeAttribute('data-phase');}};
   listen(trigger,'click',open);
   host.querySelectorAll('[data-drawer-close]').forEach(button=>listen(button,'click',close));
   listen(dialog,'cancel',event=>{event.preventDefault();close();});
   listen(dialog,'click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)close();});
   listen(dialog,'animationend',event=>{if(event.target!==dialog)return;if(closing&&event.animationName==='pp-drawer-out')finishClose();else if(!closing&&event.animationName==='pp-drawer-in')dialog.removeAttribute('data-phase');});
   listen(dialog,'close',()=>{if(dialog.open)return;unlockScroll();clearTimer();closing=false;dialog.removeAttribute('data-phase');trigger.setAttribute('aria-expanded','false');if(!disposed&&restoreTarget)restore();});
   host.querySelectorAll('[data-drawer-activity]').forEach(button=>listen(button,'click',()=>{const expanded=button.getAttribute('aria-expanded')==='true',detail=doc.getElementById(button.getAttribute('aria-controls'));button.setAttribute('aria-expanded',String(!expanded));if(detail)detail.hidden=expanded;}));
   host.querySelectorAll('[data-drawer-all]').forEach(button=>listen(button,'click',()=>{const card=button.closest('.pp-drawer-card'),expanded=button.getAttribute('aria-expanded')==='true';card.querySelectorAll('[data-drawer-extra]').forEach(row=>row.hidden=expanded);button.setAttribute('aria-expanded',String(!expanded));button.textContent=expanded?'View all activity':'Show recent activity';card.querySelector('[data-drawer-status]').textContent=expanded?'Showing 3 recent activities.':'Showing all 5 activities.';}));
   host.querySelectorAll('[data-drawer-form]').forEach(form=>listen(form,'submit',event=>{event.preventDefault();if(!form.reportValidity())return;form.querySelector('[data-drawer-status]').textContent='Changes saved in this preview.';announcement.textContent='Contact changes saved in this preview.';if(dialog.contains(form))close();}));
   host.querySelectorAll('[data-drawer-preview-reset]').forEach(button=>listen(button,'click',()=>{const card=button.closest('.pp-drawer-card'),form=card.querySelector('form');if(form)form.reset();card.querySelectorAll('[data-drawer-extra]').forEach(row=>row.hidden=true);card.querySelectorAll('[data-drawer-activity]').forEach(row=>{row.setAttribute('aria-expanded','false');const detail=doc.getElementById(row.getAttribute('aria-controls'));if(detail)detail.hidden=true;});const all=card.querySelector('[data-drawer-all]');if(all){all.setAttribute('aria-expanded','false');all.textContent='View all activity';}card.querySelector('[data-drawer-status]').textContent=form?'Changes reset.':'Preview reset.';}));
   if(media){if(media.addEventListener)listen(media,'change',syncMotion);else if(media.addListener){media.addListener(syncMotion);removers.push(()=>media.removeListener(syncMotion));}}
   if(win.MutationObserver){const observer=new win.MutationObserver(syncMotion);let parent=host;while(parent){observer.observe(parent,{attributes:true,attributeFilter:['class']});parent=parent.parentElement;}removers.push(()=>observer.disconnect());}
   const cleanup=()=>{if(disposed)return;disposed=true;removers.forEach(remove=>remove());finishClose(false);mounted.delete(host);};
   mounted.set(host,cleanup);cleanups.push(cleanup);
  });
  const cleanup=()=>cleanups.forEach(fn=>fn());if(typeof registerCleanup==='function')registerCleanup(cleanup);return cleanup;
 };
 document.getElementById('project-tokens').textContent=F.tokenCSS();
})();
