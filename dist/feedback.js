/* Feedback primitives: shadcn Base alert composition and public AlignUI
   accordion geometry, expressed through the Pitch Protocol token graph. */
(function(F){
 'use strict';
 const E=F.escape,ref=(id,target)=>F.addToken(id,F.tokens[target].type,`{${target}}`,'normalized');
 const tones={
  neutral:['semantic.text.heading','semantic.text.secondary','semantic.surface.canvas','semantic.border.default'],
  blue:['semantic.status.info','semantic.status.info','semantic.status.infoSubtle','color.blue.200'],
  success:['semantic.status.success','semantic.status.success','semantic.status.successSubtle','color.green.200'],
  warning:['semantic.status.warning','semantic.status.warning','semantic.status.warningSubtle','color.amber.200'],
  danger:['semantic.status.dangerContent','semantic.status.dangerContent','semantic.status.dangerSubtle','color.red.200']
 };
 for(const [tone,values]of Object.entries(tones))for(const [index,role]of ['foreground','description','background','border'].entries()){
  ref(`semantic.feedback.${tone}.${role}`,values[index]);
  ref(`component.alert.${tone}.${role}`,`semantic.feedback.${tone}.${role}`);
 }
 for(const [tone,target]of Object.entries({neutral:'semantic.badge.neutral.indicator',blue:'semantic.badge.blue.indicator',success:'semantic.badge.success.indicator',warning:'semantic.loading.warning',danger:'semantic.badge.danger.indicator'})){
  ref(`semantic.feedback.${tone}.indicator`,target);ref(`component.alert.${tone}.indicator`,`semantic.feedback.${tone}.indicator`);
 }
 F.addToken('layout.content.feedback','dimension','520px','extended');
 const shared={
  'alert.width':'layout.content.feedback','alert.radius':'radius.xl','alert.padding':'space.12','alert.gap':'space.8','alert.textGap':'space.4',
  'alert.font':'font.size.14','alert.line':'font.line.20','alert.weight':'font.weight.500','alert.icon':'space.16',
  'alert.borderWidth':'border.width','alert.standard.background':'semantic.surface.default','alert.standard.border':'semantic.border.default',
  'alert.close.size':'space.24','alert.close.radius':'radius.sm','alert.close.hover':'semantic.surface.subtle','alert.close.foreground':'semantic.text.placeholder','alert.focus':'shadow.focus',
  'accordion.width':'layout.content.feedback','accordion.radius':'radius.lg','accordion.padding':'space.12','accordion.gap':'space.8',
  'accordion.contentGap':'space.6','accordion.iconGap':'space.8','accordion.icon':'space.20',
  'accordion.indicator.size':'space.16','accordion.indicator.foreground':'color.gray.500',
  'accordion.font':'font.size.14','accordion.line':'font.line.20','accordion.weight':'font.weight.500',
  'accordion.title':'semantic.text.heading','accordion.description':'semantic.text.secondary','accordion.iconColor':'semantic.text.secondary',
  'accordion.borderWidth':'border.width','accordion.border':'semantic.border.default','accordion.background':'semantic.surface.default',
  'accordion.active.background':'semantic.surface.canvas','accordion.active.border':'color.transparent',
  'accordion.soft.background':'semantic.surface.canvas','accordion.soft.active':'semantic.surface.subtle',
  'accordion.disabled':'semantic.text.disabled','accordion.focus':'shadow.focus','accordion.duration':'motion.duration.normal',
  'accordion.easing':'motion.easing.standard','accordion.step.size':'space.24','accordion.step.font':'font.size.12','accordion.step.radius':'radius.full',
  'accordion.details.gap':'space.16','accordion.details.label':'font.size.12','accordion.details.labelLine':'font.line.16',
  'accordion.setup.groupGap':'space.16','accordion.setup.groupTitleGap':'space.8','accordion.setup.ready':'semantic.status.success',
  'accordion.setup.formGap':'space.12','accordion.setup.actionGap':'space.8',
  'accordion.setup.bodyInset':'space.8','accordion.setup.bodyPadding':'space.12','accordion.setup.bodyRadius':'radius.md',
  'accordion.setup.bodyBackground':'semantic.surface.canvas'
 };
 for(const [id,target]of Object.entries(shared))ref('component.'+id,target);
 const alertConfig=(c={})=>({
  tone:Object.hasOwn(tones,c.tone)?c.tone:'neutral',variant:['soft','icon'].includes(c.variant)?c.variant:'standard',
  layout:c.layout==='inline'?'inline':'detailed',icon:c.icon!==false,
  action:['link','button'].includes(c.action)?c.action:'none',dismissible:!!c.dismissible,
  title:String(c.title??'Your changes have been saved.'),description:String(c.description??'Everything is up to date. You can continue working.'),
  actionLabel:String(c.actionLabel??'View details')
 });
 F.alertTokens=(c={})=>{
  const v=alertConfig(c),prefix='component.alert.',roles=['width','radius','padding','gap','textGap','font','line','weight','borderWidth',
   (v.variant==='icon'?'neutral':v.tone)+'.foreground',v.variant==='soft'?v.tone+'.background':'standard.background',v.variant==='soft'?v.tone+'.border':'standard.border'];
  if(v.layout==='detailed'&&v.description)roles.push((v.variant==='icon'?'neutral':v.tone)+'.description');
  if(v.icon)roles.push('icon',v.variant==='icon'?v.tone+'.indicator':v.tone+'.foreground');
  if(v.dismissible)roles.push('close.size','close.radius','close.hover','close.foreground','focus','icon');
  const ids=['font.family.sans','font.weight.400',...roles.map(role=>prefix+role)];
  if(v.action!=='none'&&F.buttonTokens){const mapped=F.buttonTokens({variant:v.action==='link'?'link':v.tone==='danger'?'destructive':'secondary',size:'sm'});if(v.action==='link')mapped.fg='component.alert.'+v.tone+'.foreground';ids.push(...Object.values(mapped));}
  return [...new Set(ids)];
 };
 F.alert=(c={})=>{
  const v=alertConfig(c),icon={neutral:'info',blue:'info',success:'check-circle',warning:'warning',danger:F.icons['warning-circle']?'warning-circle':'warning'}[v.tone];
  const style=['foreground','description','background','border'].map(role=>`--alert-${role}:${F.v('component.alert.'+((role==='background'||role==='border')&&v.variant!=='soft'?'standard':v.variant==='icon'?'neutral':v.tone)+'.'+role)}`).join(';')+`;--alert-link:${F.v('component.alert.'+v.tone+'.foreground')};--alert-indicator:${F.v('component.alert.'+v.tone+(v.variant==='icon'?'.indicator':'.foreground'))}`;
  const action=v.action==='link'?F.link({label:v.actionLabel,size:'sm'}):v.action==='button'?F.button({variant:v.tone==='danger'?'destructive':'secondary',size:'sm'},v.actionLabel,`data-notify="${E(v.actionLabel)} activated"`):'';
  return `<div class="pp-alert pp-feedback-alert ${v.layout} ${v.variant} ${v.icon?'has-icon':''}" role="${v.tone==='danger'?'alert':'status'}" style="${style}" data-feedback-alert>${v.icon?`<span class="pp-alert-symbol" aria-hidden="true">${F.icon(icon,16)}</span>`:''}<div class="pp-alert-copy"><div class="pp-alert-title">${E(v.title)}</div>${v.layout==='detailed'&&v.description?`<div class="pp-alert-description">${E(v.description)}</div>`:''}</div>${action?`<div class="pp-alert-action">${action}</div>`:''}${v.dismissible?`<button type="button" class="pp-feedback-dismiss" data-feedback-dismiss aria-label="Dismiss alert">${F.icon('close',16)}</button>`:''}</div>`;
 };
 const accordionConfig=(c={})=>({
  variant:['cards','line','soft','setup'].includes(c.variant)?c.variant:Array.isArray(c.items)?'cards':'setup',content:['steps','details'].includes(c.content)?c.content:'text',
  indicator:['chevron','plus'].includes(c.indicator)?c.indicator:'chevron',icon:c.icon!==false,open:c.open!==false,multiple:!!c.multiple,disabled:!!c.disabled
 });
 F.accordionTokens=(c={})=>{
  const v=accordionConfig(c),roles=['width','radius','padding','gap','contentGap','iconGap','icon','indicator.size','indicator.foreground','font','line','weight','title','description','iconColor','borderWidth','border','background','active.background','active.border','focus','duration','easing'];
  if(v.variant==='soft')roles.push('soft.background','soft.active');
  if(v.disabled)roles.push('disabled');
  if(v.content==='steps')roles.push('step.size','step.font','step.radius');
  if(v.content==='details')roles.push('details.gap','details.label','details.labelLine');
  const ids=['font.family.sans','font.weight.400',...roles.map(role=>'component.accordion.'+role)];
  if(v.variant==='setup'){
   ids.push(...['groupGap','groupTitleGap','bodyInset','bodyPadding','bodyRadius','bodyBackground',...(v.icon?['ready']:[])].map(role=>'component.accordion.setup.'+role));
   ids.push(...Object.values(F.badgeTokens({tone:'success',size:'sm'})));
   if(v.icon)ids.push(...F.spinnerTokens({variant:'segmented',tone:'warning',size:'sm'}),...F.spinnerTokens({variant:'segmented',tone:'neutral',size:'sm'}));
   if(v.content==='text')ids.push('component.accordion.setup.formGap','component.accordion.setup.actionGap',...['background','foreground','border','placeholder','radius','padding','font','focus'].map(role=>'component.input.'+role),'component.control.height.md','component.accordion.details.label','component.accordion.details.labelLine',...(v.disabled?['semantic.surface.disabled','semantic.text.disabled']:[]),...Object.values(F.buttonTokens({variant:'secondary',size:'md',state:v.disabled?'disabled':'default'})));
  }
  return [...new Set(ids)];
 };
 const exampleSets={
  text:[
   ['What is included?','file','Reusable components, considered foundations, and all the details between.'],
   ['Can I customize it?','settings','Adjust the content and configuration to find the right fit.'],
   ['How do updates work?','layers','Updates follow the shared tokens and component definitions.']
  ],
  steps:[
   ['Set up your workspace','grid',['Create a project and give it a clear name.','Add the people who will be working with you.','Choose the settings that work for your team.']],
   ['Add your content','file',['Import your existing files.','Organize content into sections.','Review what you have added.']],
   ['Share with your team','globe',['Check the access settings.','Copy the project link.','Send the link to your team.']]
  ],
  details:[
   ['Project overview','layers',[['Owner','Alex Morgan'],['Status','In progress'],['Updated','Today'],['Members','8 people']]],
   ['Account details','settings',[['Plan','Standard'],['Workspace','Design team'],['Access','Members'],['Region','Global']]],
   ['Recent activity','file',[['Latest update','Content reviewed'],['Edited by','Sam Lee'],['Items','12 files'],['Next review','Friday']]]
  ]
 };
 let accordionSerial=0;
 const accordionBody=(content,kind)=>kind==='steps'&&Array.isArray(content)?`<ol class="pp-accordion-steps">${content.map(step=>`<li>${E(step)}</li>`).join('')}</ol>`:kind==='details'&&Array.isArray(content)?`<dl class="pp-accordion-details">${content.map(pair=>`<div><dt>${E(pair[0])}</dt><dd>${E(pair[1])}</dd></div>`).join('')}</dl>`:`<p>${E(content)}</p>`;
 const accordionIndicator=v=>{
  const size=Number.parseFloat(F.resolve('component.accordion.indicator.size'));
  return v.indicator==='chevron'?`<span class="pp-accordion-chevron">${F.icon('down',size)}</span>`:`<span class="pp-accordion-plus">${F.icon('plus',size)}</span><span class="pp-accordion-minus">${F.icon('minus',size)}</span>`;
 };
 const setupAccordion=(v,id)=>{
  const groups=[
   ['Set up your online store',[
    ['Add products','ready','Your product catalogue is ready. You can add new items or update existing products at any time.'],
    ['Get the point of sale application','active','Manage your orders and inventory from your phone. Prepare an app link using your email address below.'],
    ['Product price & stock','pending','Review product prices and available inventory before accepting orders.']
   ]],
   ['Store settings',[
    ['Customize your storefront','active','Choose your store name, logo, and appearance. Keep the information your customers need easy to find.']
   ]],
   ['Prepare for launch',[
    ['Set up shipping options','pending','Choose delivery regions and rates for the products you sell.'],
    ['Configure tax settings','pending','Review the tax information required for your store and the regions you serve.']
   ]]
  ];
  let index=0;
  return `<div class="pp-accordion pp-feedback-accordion setup content-${v.content} ${v.icon?'has-icons':''}" data-feedback-accordion data-multiple="${v.multiple}">${groups.map(([groupTitle,items],groupIndex)=>`<section class="pp-accordion-setup-group" aria-labelledby="${id}-heading-${groupIndex}"><h4 id="${id}-heading-${groupIndex}">${E(groupTitle)}${F.icon('info',12)}</h4><div class="pp-accordion-setup-items">${items.map(([title,status,description])=>{
   const number=index++,icon=status==='ready'?`<span class="pp-accordion-ready">${F.icon('check-circle',20)}</span>`:`<span class="${status==='pending'?'preview-paused':''}">${F.spinner({variant:'segmented',size:'sm',tone:status==='active'?'warning':'neutral',label:status==='active'?'In progress':'Not started'})}</span>`;
   const body=v.content==='steps'?accordionBody(['Review the current information.','Make the changes you need.','Save and continue to the next step.'],'steps'):v.content==='details'?accordionBody([['Owner','Alex Morgan'],['Status',status==='ready'?'Ready':status==='active'?'In progress':'Not started'],['Updated','Today']],'details'):number===1?`<p>${E(description)}</p><form class="pp-accordion-form" data-feedback-action><label class="visually-hidden" for="${id}-email">Email address</label><div class="pp-accordion-input-action"><input id="${id}-email" class="pp-input" type="email" placeholder="you@company.com" value="alex@example.com" required ${v.disabled?'disabled':''}>${F.button({variant:'secondary',size:'md',state:v.disabled?'disabled':'default'},'Send link','type="submit"')}</div><output class="pp-accordion-action-result" role="status" aria-live="polite"></output></form>`:accordionBody(description,'text');
   return `<details class="pp-accordion-item setup-${status}" data-feedback-group="${id}-group-${groupIndex}" ${v.multiple?'':`name="${id}-group-${groupIndex}"`} ${status==='active'&&v.open?'open':''}><summary class="pp-accordion-trigger" ${v.disabled?'aria-disabled="true"':''}>${v.icon?`<span class="pp-accordion-symbol">${icon}</span>`:''}<span class="pp-accordion-label">${E(title)}</span>${status==='ready'?F.badge({tone:'success',size:'sm'},'Ready'):''}<span class="pp-accordion-indicator" aria-hidden="true">${accordionIndicator(v)}</span></summary><div class="pp-accordion-content">${body}</div></details>`;
  }).join('')}</div></section>`).join('')}</div>`;
 };
 F.accordion=(c={})=>{
  const v=accordionConfig(c),id='feedback-accordion-'+(++accordionSerial);
  if(v.variant==='setup')return setupAccordion(v,id);
  const items=Array.isArray(c.items)&&c.items.length?c.items:exampleSets[v.content];
  return `<div class="pp-accordion pp-feedback-accordion ${v.variant} content-${v.content} ${v.icon?'has-icons':''}" data-feedback-accordion data-multiple="${v.multiple}">${items.map((entry,index)=>{
   const [title,icon,content]=Array.isArray(entry)?entry:[entry.title,entry.icon||'file',entry.content];
   const body=accordionBody(content,v.content);
   const indicator=accordionIndicator(v);
   return `<details class="pp-accordion-item" ${v.multiple?'':`name="${id}"`} ${index===0&&v.open?'open':''}><summary class="pp-accordion-trigger" ${v.disabled?'aria-disabled="true"':''}>${v.icon?`<span class="pp-accordion-symbol" aria-hidden="true">${F.icon(icon,20)}</span>`:''}<span class="pp-accordion-label">${E(title)}</span><span class="pp-accordion-indicator" aria-hidden="true">${indicator}</span></summary><div class="pp-accordion-content">${body}</div></details>`;
  }).join('')}</div>`;
 };
 // Shared live preference watcher; mounting creates no timers or animation frames.
 F.watchComponentMotion=(root,onQuiet)=>{
  const doc=root.ownerDocument||document,win=doc.defaultView||window,media=win.matchMedia?.('(prefers-reduced-motion: reduce)');
  const quiet=()=>!!(media?.matches||F.paused||root.closest?.('.preview-paused')||doc.body?.classList?.contains('motion-paused'));
  const changed=()=>{if(quiet())onQuiet();};media?.addEventListener?.('change',changed);
  const observer=win.MutationObserver?new win.MutationObserver(changed):null;
  for(let node=root;node;node=node.parentElement)observer?.observe(node,{attributes:true,attributeFilter:['class']});
  return {quiet,dispose(){media?.removeEventListener?.('change',changed);observer?.disconnect();}};
 };
 F.wireFeedback=(root,registerCleanup=()=>{})=>{
  const cleanups=[],listen=(node,type,handler)=>{node.addEventListener(type,handler);cleanups.push(()=>node.removeEventListener(type,handler));};
  let addedTabindex=false;
  root.querySelectorAll('[data-feedback-dismiss]').forEach(button=>listen(button,'click',()=>{
   button.closest('[data-feedback-alert]').hidden=true;
   if(!root.hasAttribute('tabindex')){root.setAttribute('tabindex','-1');addedTabindex=true;}
   root.focus({preventScroll:true});
  }));
  root.querySelectorAll('[data-feedback-action]').forEach(form=>listen(form,'submit',event=>{
   event.preventDefault();const input=form.querySelector('input');if(input.disabled||!form.reportValidity())return;
   form.querySelector('output').textContent='App link prepared for '+input.value+'.';
  }));
  root.querySelectorAll('[data-feedback-accordion]').forEach(accordion=>{
   const details=[...accordion.querySelectorAll('details')];
   const controllers=new Map(),preference=F.watchComponentMotion(accordion,()=>controllers.forEach(control=>control.finish()));
   cleanups.push(()=>{controllers.forEach(control=>control.dispose());preference.dispose();});
   details.forEach(item=>{
    const trigger=item.querySelector('summary');
    const disabled=event=>{if(trigger.getAttribute('aria-disabled')==='true'&&(event.type==='click'||['Enter',' '].includes(event.key)))event.preventDefault();};
    listen(trigger,'click',disabled);listen(trigger,'keydown',disabled);
    if(typeof item.animate==='function'&&typeof item.getBoundingClientRect==='function'){
     const content=item.querySelector('.pp-accordion-content'),name=item.getAttribute('name'),overflow=item.style.overflow,expanded=trigger.getAttribute('aria-expanded'),initialInert=content?.inert;
     let desired=item.open,expected=item.open,animation=null,disposed=false;
     // Own exclusivity while mounted, so native name grouping cannot snap peers shut.
     item.removeAttribute('name');item.setAttribute('data-height-motion','');
     const setOpen=value=>{expected=value;item.open=value;};
     const cancel=()=>{if(animation){animation.onfinish=null;animation.cancel();animation=null;}};
     const finish=()=>{cancel();setOpen(desired);item.style.overflow=overflow;if(content)content.inert=initialInert;trigger.setAttribute('aria-expanded',String(desired));};
     const request=value=>{
      if(disposed)return;const from=item.getBoundingClientRect().height;cancel();desired=value;trigger.setAttribute('aria-expanded',String(value));
      if(!value&&content?.contains((item.ownerDocument||document).activeElement))trigger.focus({preventScroll:true});
      if(preference.quiet()){finish();return;}
      setOpen(value);const to=item.getBoundingClientRect().height;
      if(Math.abs(from-to)<.5){finish();return;}
      setOpen(true);if(content)content.inert=!value;item.style.overflow='hidden';
      const current=item.animate([{height:from+'px'},{height:to+'px'}],{duration:parseFloat(F.resolve('component.accordion.duration')),easing:F.resolve('component.accordion.easing')});animation=current;
      current.onfinish=()=>{if(animation===current&&!disposed)finish();};
     };
     const control={request,finish,get desired(){return desired;},dispose(){finish();disposed=true;item.removeAttribute('data-height-motion');if(name!==null)item.setAttribute('name',name);if(expanded===null)trigger.removeAttribute('aria-expanded');else trigger.setAttribute('aria-expanded',expanded);}};
     controllers.set(item,control);
     listen(trigger,'click',event=>{if(event.defaultPrevented)return;event.preventDefault();const opening=!desired;if(opening&&accordion.getAttribute('data-multiple')!=='true')details.forEach(other=>{if(other!==item&&other.getAttribute('data-feedback-group')===item.getAttribute('data-feedback-group'))controllers.get(other)?.request(false);});request(opening);});
     listen(item,'toggle',()=>{if(item.open!==expected){desired=item.open;finish();if(desired&&accordion.getAttribute('data-multiple')!=='true')details.forEach(other=>{if(other!==item&&other.getAttribute('data-feedback-group')===item.getAttribute('data-feedback-group'))controllers.get(other)?.request(false);});}});
    }else listen(item,'toggle',()=>{if(item.open&&accordion.getAttribute('data-multiple')!=='true')details.forEach(other=>{if(other!==item&&other.getAttribute('data-feedback-group')===item.getAttribute('data-feedback-group'))other.open=false;});});
   });
   listen(accordion,'keydown',event=>{
    if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;
    const triggers=details.map(item=>item.querySelector('summary')).filter(trigger=>trigger.getAttribute('aria-disabled')!=='true'),index=triggers.indexOf(event.target);
    if(index<0)return;
    event.preventDefault();
    triggers[event.key==='Home'?0:event.key==='End'?triggers.length-1:(index+(event.key==='ArrowDown'?1:-1)+triggers.length)%triggers.length].focus();
   });
  });
  registerCleanup(()=>{cleanups.forEach(cleanup=>cleanup());if(addedTabindex)root.removeAttribute('tabindex');});
 };
 // Shared contextual pills and notification stacks, adapted from Spectrum motion.
 F.actionFeedbackTokens=()=>[...new Set(['font.size.14','font.size.12','semantic.status.successSubtle','semantic.status.dangerSubtle','semantic.status.infoSubtle',...Object.values(F.buttonTokens({variant:'ghost',surface:'inverse',size:'sm'})),'font.size.11','semantic.status.success','semantic.status.danger','semantic.status.info','layout.content.feedback','font.family.sans','font.size.13','font.line.20','font.weight.500','radius.full','radius.xl','shadow.menu','semantic.text.heading','semantic.text.inverse','semantic.text.body','semantic.text.secondary','semantic.surface.default','semantic.surface.subtle','semantic.border.default','border.width','space.2','space.4','space.6','space.8','space.12','space.16','space.20','space.24','space.32','space.40','motion.duration.fast','motion.duration.enter','motion.duration.normal','motion.easing.standard',...Object.values(F.buttonTokens({variant:'ghost',size:'sm'})),...Object.values(F.buttonTokens({variant:'secondary',size:'sm'})),...F.spinnerTokens({size:'sm'})])];
 F.createUndoClock=(duration=6000)=>{const total=Math.max(1000,Number(duration)||6000);let remaining=total;return {tick(ms,paused=false){if(!paused)remaining=Math.max(0,remaining-Math.max(0,ms));return remaining;},get remaining(){return remaining;},get progress(){return remaining/total;},reset(){remaining=total;}};};
 const ring=()=>'<span class="pp-undo-clock" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" pathLength="1"/><circle data-undo-ring cx="12" cy="12" r="9" pathLength="1"/></svg><span data-undo-seconds>6</span></span>';
 // The source Undo control is rounded-full; use the shared button's radius input, not a losing CSS override.
 const pillButtons=markup=>markup.replaceAll('--demo-button-radius:'+F.v('component.control.radius'),'--demo-button-radius:'+F.v('radius.full'));
 F.actionPill=(c={})=>`<div class="pp-action-pill ${E(c.className||'')}" role="group" aria-label="${E(c.ariaLabel||'Selection actions')}"><strong ${c.labelAttributes||''}>${E(c.label||'3 selected')}</strong><span class="pp-action-divider" aria-hidden="true"></span>${pillButtons(c.actions||F.button({variant:'ghost',surface:'inverse',size:'sm',icon:'leading',iconName:'trash'},'Delete','data-action-delete')+F.button({variant:'ghost',surface:'inverse',size:'sm',icon:'only',iconName:'close'},'Clear selection','data-action-clear'))}</div>`;
 F.undoPill=(c={})=>`<div class="pp-action-pill pp-undo-pill" data-undo-pill ${c.hidden?'hidden':''} role="group" aria-label="Undo recent action">${ring()}<span data-undo-label>${E(c.label||'3 rows deleted')}</span><span class="pp-action-divider" aria-hidden="true"></span>${pillButtons(F.button({variant:'ghost',surface:'inverse',size:'sm'},'Undo',c.buttonAttributes||'data-pill-undo'))}</div>`;
 F.mountUndoPill=(pill,{onUndo=()=>{},onExpire=()=>{}}={})=>{
  if(!pill)return {start(){},stop(){},dispose(){}};
  const doc=pill.ownerDocument||document,win=doc.defaultView||window,clock=F.createUndoClock();let hovering=false,running=false,disposed=false;
  const off=[],listen=(type,fn)=>{pill.addEventListener(type,fn);off.push(()=>pill.removeEventListener(type,fn));};
  const paint=()=>{const digit=pill.querySelector('[data-undo-seconds]'),arc=pill.querySelector('[data-undo-ring]');if(digit)digit.textContent=String(Math.ceil(clock.remaining/1000));arc?.style.setProperty('stroke-dashoffset',String(1-clock.progress));};
  const undo=()=>{if(!running||disposed)return;running=false;pill.hidden=true;onUndo();};
  listen('pointerenter',()=>hovering=true);listen('pointerleave',()=>hovering=false);
  listen('keydown',event=>{if(event.key==='Escape'&&running){event.preventDefault();event.stopPropagation();undo();}});
  listen('click',event=>{if(event.target.closest?.('[data-pill-undo]'))undo();});
  const timer=win.setInterval?.(()=>{if(!running||disposed)return;const paused=hovering||pill.contains(doc.activeElement)||doc.hidden||F.paused||pill.closest?.('.preview-paused');clock.tick(100,paused);paint();if(!clock.remaining){running=false;pill.hidden=true;onExpire();}},100);
  return {start(label){clock.reset();running=true;pill.hidden=false;if(label)pill.querySelector('[data-undo-label]').textContent=label;paint();},stop(){running=false;pill.hidden=true;},dispose(){disposed=true;if(timer!==undefined)win.clearInterval(timer);off.forEach(fn=>fn());}};
 };
 F.actionBarDemo=(c={})=>`<section class="pp-action-demo" data-action-demo data-label="${E(c.label||'3 selected')}" data-variant="${E(c.variant||'selection')}"><div data-action-stage>${c.variant==='undo'?F.undoPill():F.actionPill({label:c.label})}</div>${F.button({variant:'secondary',size:'sm'},'Select 3 rows','data-action-select')}<span class="visually-hidden" role="status" data-action-status></span></section>`;
 F.toastStack=(c={})=>`<section class="pp-toast-demo pp-spectrum-toast-host" data-toast-demo data-tone="${E(c.tone||'success')}" data-label="${E(c.label||'Changes saved')}" data-count="${Math.min(3,Math.max(1,Number(c.count)||3))}" data-action="${c.action!==false}">${F.button({variant:'secondary',size:'sm'},'Show toast','data-stack-show')}<div class="pp-toast-stack" data-spectrum-toast-root aria-label="Notifications"></div><span class="visually-hidden" role="status" aria-live="polite" data-stack-announcement></span></section>`;
 F.wireActionFeedback=(root,registerCleanup=()=>{})=>{
  const cleanups=[];
  root.querySelectorAll('[data-action-demo]').forEach(host=>{
   const stage=host.querySelector('[data-action-stage]'),status=host.querySelector('[data-action-status]');let undo=null;
   const selection=()=>{undo?.dispose();undo=null;stage.innerHTML=F.actionPill({label:host.dataset.label});};
   const removed=()=>{undo?.dispose();stage.innerHTML=F.undoPill();undo=F.mountUndoPill(stage.querySelector('[data-undo-pill]'),{onUndo(){selection();status.textContent='3 rows restored.';host.querySelector('[data-action-delete]')?.focus();},onExpire(){status.textContent='Undo period ended.';}});undo.start();};
   const click=event=>{if(event.target.closest?.('[data-action-delete]')){removed();stage.querySelector('[data-pill-undo]')?.focus();status.textContent='3 rows deleted.';}else if(event.target.closest?.('[data-action-select]'))selection();else if(event.target.closest?.('[data-action-clear]')){stage.innerHTML='';status.textContent='Selection cleared.';host.querySelector('[data-action-select]')?.focus();}};
   host.addEventListener('click',click);if(host.dataset.variant==='undo')removed();cleanups.push(()=>{undo?.dispose();host.removeEventListener('click',click);});
  });
  root.querySelectorAll('[data-toast-demo]').forEach(host=>{
   if(typeof F.mountSpectrumToast==='function')cleanups.push(F.mountSpectrumToast(host));
  });
  registerCleanup(()=>cleanups.forEach(fn=>fn()));
 };

 document.getElementById('project-tokens').textContent=F.tokenCSS();
})(window.Forma);
