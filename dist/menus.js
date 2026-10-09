/* Authored dropdown, select and combobox controls. Visual references: AlignUI Select/Dropdown
   (https://www.alignui.com/docs/v1.2/ui/select, /dropdown) and shadcn Base Nova combobox.
   Native selects remain as form values only; their platform menu is never exposed. */
(() => {
 const F=window.Forma,E=F.escape;
 let serial=0,openControl=null;
 const mounted=new WeakMap(),enhanced=new WeakMap();
 const aliases={
  'menu.item.radius':'radius.md','menu.item.height':'space.36','menu.item.padding':'space.8',
  'menu.item.gap':'space.8','menu.item.font':'font.size.14','menu.item.line':'font.line.20',
  'menu.item.foreground':'semantic.text.heading','menu.item.highlight':'semantic.surface.canvas','menu.item.disabled':'semantic.text.disabled',
  'menu.item.destructive':'semantic.status.dangerContent','menu.item.destructiveHighlight':'semantic.status.dangerSubtle',
  'menu.label':'semantic.text.secondary','menu.gap':'space.8','menu.icon':'space.20','menu.content.padding':'space.8','menu.content.gap':'space.4',
  'menu.sectioned.radius':'radius.2xl','menu.identity.gap':'space.12','menu.identity.padding':'space.8','menu.identity.font':'font.size.14','menu.identity.line':'font.line.20',
  'menu.focus':'shadow.focus','menu.duration':'motion.duration.fast',
  'select.background':'component.input.background','select.foreground':'component.input.foreground',
  'select.border':'component.input.border','select.radius':'component.input.radius','select.padding':'component.input.padding',
  'control.chevron':'space.16','select.chevron':'component.control.chevron','select.focus':'component.input.focus','select.icon':'space.20','select.icon.foreground':'semantic.text.secondary',
  'select.paddingEnd.sm':'space.6','select.paddingEnd.md':'space.8','select.paddingEnd.lg':'space.12',
  'select.shadow':'shadow.secondary','select.hover.background':'semantic.surface.canvas',
  'combobox.chips.padding':'space.4','combobox.chips.padding.sm':'space.4','combobox.chips.padding.lg':'space.6','combobox.chips.gap':'space.4','combobox.clear.size':'space.24','combobox.clear.radius':'radius.sm'
 };
 for(const [role,target]of Object.entries(aliases))F.addToken('component.'+role,F.tokens[target].type,'{'+target+'}','normalized');
 F.addToken('layout.content.dropdown','dimension','280px','extended');
 F.addToken('component.menu.sectioned.width','dimension','{layout.content.dropdown}','normalized');
 const normalizedOptions=options=>(options||[]).map(option=>typeof option==='string'?{label:option,value:option}:{...option,label:String(option.label??option.value??''),value:String(option.value??option.label??'')});
 const optionsHTML=(options,id,value)=>{
  const selected=new Set(Array.isArray(value)?value:[value]),groups=new Map();
  normalizedOptions(options).forEach((option,index)=>{const group=option.group||'';if(!groups.has(group))groups.set(group,[]);groups.get(group).push(`<div id="${id}-${index}" class="pp-menu-option" role="option" aria-selected="${String(selected.has(option.value))}" ${option.disabled?'aria-disabled="true"':''} data-option data-value="${E(option.value)}" data-label="${E(option.label)}"${option.icon?` data-icon="${E(option.icon)}"`:''}>${option.icon?F.icon(option.icon,20):''}<span>${E(option.label)}</span><span class="pp-menu-check" aria-hidden="true">${F.icon('check',20)}</span></div>`);});
  return Array.from(groups,([name,items],index)=>name?`<div class="pp-menu-group" role="group" aria-labelledby="${id}-group-${index}" data-menu-group><div class="pp-menu-label" id="${id}-group-${index}">${E(name)}</div>${items.join('')}</div>`:items.join('')).join('');
 };
 const panel=(id,label,options,value,multiple=false)=>`<div class="pp-menu-popup" id="${id}" role="listbox" aria-label="${E(label)}"${multiple?' aria-multiselectable="true"':''} popover="manual" hidden>${optionsHTML(options,id,value)}<div class="pp-menu-empty" data-menu-empty role="presentation" ${options.length?'hidden':''}>No results found.</div></div>`;
 const stateAttrs=c=>`${c.disabled||c.state==='disabled'?' disabled':''}${c.state==='invalid'?' aria-invalid="true"':''}`;
 F.select=(c={})=>{
  const id='pp-select-'+(++serial),options=normalizedOptions(c.options||['Choose an option','Design','Engineering','Product']),selected=options.find(option=>option.value===c.value)||options[0],label=c.label||'Select option';
  return `<div class="pp-select" data-pp-menu="select"><button type="button" class="pp-select-trigger size-${c.size||'md'} state-${c.state||'default'}" role="combobox" aria-label="${E(label)}" aria-expanded="false" aria-haspopup="listbox" aria-controls="${id}" data-menu-control data-value="${E(selected?.value||'')}"${stateAttrs(c)}>${c.icon==='leading'?`<span class="pp-select-leading" aria-hidden="true">${F.icon(c.iconName||'layers',20)}</span>`:''}<span data-select-label>${E(selected?.label||c.placeholder||'Choose an option')}</span><span class="pp-select-arrow" aria-hidden="true">${F.icon('down',parseFloat(F.resolve('component.select.chevron')))}</span></button>${panel(id,label,options,selected?.value)}<span class="visually-hidden" role="status" aria-atomic="true" data-menu-status></span></div>`;
 };
 const comboOptions=c=>normalizedOptions(c.options||['React','Vue','Svelte','Angular','Solid']).map((option,index)=>({...option,...(c.optionStyle==='icons'?{icon:option.icon||['code','layers','bolt','grid','globe'][index%5]}:{}),...(c.optionStyle==='grouped'?{group:option.group||(index<2?'Popular':'More frameworks')}:{})}));
 const chipsHTML=(options,values,disabled)=>values.map(value=>{const option=options.find(option=>option.value===value);return option?F.chip({label:option.label,value:option.value,variant:'removable',tone:'neutral',size:'sm',icon:option.icon?'leading':'none',iconName:option.icon,disabled:disabled||option.disabled}):'';}).join('');
 F.combobox=(c={})=>{
  const id='pp-combobox-'+(++serial),options=comboOptions(c),label=c.label||'Framework',value=c.value||'',multiple=c.variant==='multiple',values=multiple?[...new Set(c.values||['React','Svelte'])].filter(value=>options.some(option=>option.value===value)):[],disabled=c.disabled||c.state==='disabled';
  const input=`<input class="pp-combobox-input size-${c.size||'md'} state-${c.state||'default'}" role="combobox" aria-label="${E(label)}" aria-expanded="false" aria-controls="${id}" aria-autocomplete="list" autocomplete="off" placeholder="${E(c.placeholder||'Search frameworks…')}" value="${E(multiple?'':value)}" data-value="${E(value)}"${multiple?` data-values="${E(JSON.stringify(values))}"`:''} data-menu-control${stateAttrs(c)}>`;
  const clear=c.showClear?`<button type="button" class="pp-combobox-clear" data-menu-clear aria-label="${multiple?'Clear all selections':'Clear selection'}"${disabled?' disabled':''}${multiple?values.length?'':' hidden':value?'':' hidden'}>${F.icon('close',16)}</button>`:'';
  const leading=c.icon==='leading'?`<span class="pp-combobox-leading" aria-hidden="true">${F.icon(c.iconName||'search',20)}</span>`:'';
  const field=multiple?`<div class="pp-combobox-chips-field size-${c.size||'md'} state-${c.state||'default'}" data-combobox-field${disabled?' data-disabled="true"':''}>${leading}<div class="pp-combobox-chip-values" data-combobox-chips role="group" aria-label="Selected ${E(label.toLowerCase())}">${chipsHTML(options,values,disabled)}</div>${input}${clear}<span class="pp-combobox-chevron" aria-hidden="true">${F.icon('down',parseFloat(F.resolve('component.select.chevron')))}</span></div>`:`<div class="pp-combobox-input-wrap ${c.icon==='leading'?'has-leading-icon':''} ${c.showClear?'has-clear-button':''}">${leading}${input}${clear}<span class="pp-combobox-chevron" aria-hidden="true">${F.icon('down',parseFloat(F.resolve('component.select.chevron')))}</span></div>`;
  return `<div class="pp-combobox-control ${multiple?'is-multiple':''}" data-pp-menu="combobox"${multiple?' data-multiple="true"':''}>${field}${panel(id,label,options,multiple?values:value,multiple)}<span class="visually-hidden" role="status" aria-atomic="true" data-menu-status></span></div>`;
 };
 F.dropdownItems=(c={})=>c.items||(c.appearance==='basic'?[{label:'Edit',icon:'settings'},{label:'Duplicate',icon:'copy'},{label:'Download',icon:'download'}]:[
  {label:'All components',icon:'grid',href:'#all',group:'Browse'},
  {label:'Colors',icon:'circle',href:'#colors/overview',group:'Browse'},
  {label:'Typography',icon:'file',href:'#typography/overview',group:'Browse'},
  {label:'Button',icon:'plus',href:'#button/overview',group:'Components'},
  {label:'Input',icon:'search',href:'#input/overview',group:'Components'},
  {label:'Modal',icon:'layers',href:'#modal/overview',group:'Components'}
 ]).concat(c.destructive?[{separator:true},{label:'Delete',icon:'trash',destructive:true}]:[]);
 F.dropdownMenu=(c={})=>{
  const id='pp-dropdown-'+(++serial),items=F.dropdownItems(c),sectioned=c.appearance!=='basic';
  const trigger=F.button({variant:c.variant||'secondary',size:c.size||'md',state:c.disabled?'disabled':'default'},c.label||'Open menu',`data-menu-control aria-haspopup="menu" aria-expanded="false" aria-controls="${id}"`).replace('</button>',`<span class="pp-dropdown-chevron" aria-hidden="true">${F.icon('down',parseFloat(F.resolve('component.control.chevron')))}</span></button>`);
  const option=(item,index)=>{
   if(item.separator)return '<div class="pp-menu-separator" role="separator"></div>';
   const href=typeof item.href==='string'&&/^#[a-z0-9-]+(?:\/[a-z0-9-]+)?$/i.test(item.href)?item.href:null,tag=href&&!item.disabled?'a':'button';
   return `<${tag} ${tag==='a'?`href="${E(href)}"`:'type="button"'} class="pp-menu-option ${item.destructive?'is-destructive':''}" id="${id}-${index}" role="menuitem" tabindex="-1" data-option data-value="${E(item.value||item.label)}" data-label="${E(item.label)}"${href?` data-menu-href="${E(href)}"`:''}${item.disabled?' disabled aria-disabled="true"':''}>${item.icon?F.icon(item.icon,20):''}<span>${E(item.label)}</span>${item.shortcut?`<span class="pp-menu-shortcut">${E(item.shortcut)}</span>`:''}</${tag}>`;
  };
  let lastGroup='',groupOpen=false,body='';
  items.forEach((item,index)=>{const group=sectioned&&!item.separator?item.group||'':'';
   if(group!==lastGroup||item.separator){if(groupOpen){body+='</div>';groupOpen=false;}if(group){if(body)body+='<div class="pp-menu-separator" role="separator"></div>';body+=`<div class="pp-menu-group" role="group" aria-labelledby="${id}-group-${index}"><div class="pp-menu-label" id="${id}-group-${index}">${E(group)}</div>`;groupOpen=true;}lastGroup=group;}
   body+=option(item,index);
  });if(groupOpen)body+='</div>';
  const identity=c.identityHeader?`<div class="pp-menu-identity">${F.avatar({size:'md',initials:'DS',name:'Design system',color:'neutral'})}<div class="pp-menu-identity-copy"><strong>Design system</strong><span>Component library</span></div>${F.badge({variant:'soft',tone:'neutral',size:'sm'},'Local')}</div><div class="pp-menu-separator" role="separator"></div>`:'';
  return `<div class="pp-dropdown-control" data-pp-menu="menu" data-align="${c.align==='end'?'end':'start'}"${sectioned?' data-menu-appearance="sectioned"':''}>${trigger}<div class="pp-menu-popup ${sectioned?'pp-menu-sectioned':''}${c.identityHeader?' pp-theme':''}" id="${id}" role="menu" aria-label="${E(c.label||'Actions')}" popover="manual" hidden>${identity}${c.heading?`<div class="pp-menu-label" role="presentation">${E(c.heading)}</div>`:''}${body}</div></div>`;
 };
 F.menuTokens=(kind,c={})=>{
  const ids=['font.family.sans','border.width','component.menu.background','component.menu.foreground','component.menu.border','component.menu.radius','component.menu.content.padding','component.menu.content.gap','component.menu.shadow','component.control.chevron',...['item.radius','item.height','item.padding','item.gap','item.font','item.line','item.foreground','item.highlight','item.disabled','label','gap','icon','focus','duration'].map(role=>'component.menu.'+role)];
  if((kind==='dropdown'||kind==='menu')&&c.appearance!=='basic')ids.push('component.menu.sectioned.width','component.menu.sectioned.radius');
  if((kind==='dropdown'||kind==='menu')&&c.identityHeader)ids.push('component.menu.identity.gap','component.menu.identity.padding','component.menu.identity.font','component.menu.identity.line','font.size.12','font.weight.500','font.weight.400',...F.avatarTokens({size:'md',initials:'DS',color:'neutral'}),...Object.values(F.badgeTokens({variant:'soft',tone:'neutral',size:'sm'})));
  if(kind==='dropdown'||kind==='menu')ids.push(...Object.values(F.buttonTokens({variant:c.variant||'secondary',size:c.size||'md',state:c.disabled?'disabled':'default'})),...(c.destructive?['component.menu.item.destructive','component.menu.item.destructiveHighlight']:[]));
  else ids.push(...['background','foreground','border','radius','padding','focus','icon','chevron','icon.foreground','shadow','hover.background'].map(role=>'component.select.'+role),'component.select.paddingEnd.'+(c.size||'md'),'component.control.height.'+(c.size||'md'),c.size==='sm'?'font.size.13':'component.input.font','component.input.placeholder','semantic.surface.disabled','semantic.text.disabled',...(c.state==='invalid'?['semantic.border.danger']:[]),...(c.state==='focus'?['semantic.border.focus']:[]),...(c.state==='hover'?['semantic.border.strong']:[]),...(kind==='combobox'?['space.36',...(c.icon==='leading'?['space.40']:[])]:[]));
  if(kind==='combobox'&&c.variant==='multiple')ids.push('component.combobox.chips.padding'+(['sm','lg'].includes(c.size)?'.'+c.size:''),'component.combobox.chips.gap',...F.chipTokens({variant:'removable',tone:'neutral',size:'sm',icon:c.optionStyle==='icons'?'leading':'none',disabled:c.disabled||c.state==='disabled'}));
  if(kind==='combobox'&&c.showClear)ids.push('component.combobox.clear.size','component.combobox.clear.radius','space.16','space.64');
  return [...new Set(ids)];
 };
 /* Pure placement calculation shared by top-layer and portal renderers. */
 F.menuPlacement=(rect,popup,viewport,align='start')=>{
  const inset=8,gap=parseFloat(F.resolve('component.menu.gap')),vx=viewport.left||0,vy=viewport.top||0,width=Math.max(0,Math.min(popup.width,viewport.width-inset*2)),below=vy+viewport.height-inset-rect.bottom-gap,above=rect.top-vy-inset-gap;
  const side=popup.height>below&&above>below?'top':'bottom',maxHeight=Math.max(0,side==='top'?above:below),height=Math.min(popup.height,maxHeight),preferred=align==='end'?rect.right-width:rect.left;
  return {left:Math.max(vx+inset,Math.min(preferred,vx+viewport.width-inset-width)),top:side==='top'?Math.max(vy+inset,rect.top-gap-height):Math.max(vy+inset,rect.bottom+gap),width,maxHeight,side};
 };
 F.menuNext=(items,current,key)=>!items.length?null:key==='Home'?items[0]:key==='End'?items[items.length-1]:items.indexOf(current)<0?items[key==='ArrowUp'?items.length-1:0]:items[(items.indexOf(current)+(key==='ArrowUp'?-1:1)+items.length)%items.length];
 function mount(host,onChange){
  if(mounted.has(host))return mounted.get(host);
  const trigger=host.querySelector('[data-menu-control]'),popup=host.querySelector('.pp-menu-popup');
  if(!trigger||!popup)return ()=>{};
  const doc=host.ownerDocument||document,win=doc.defaultView||window,type=host.dataset.ppMenu,combo=type==='combobox',menu=type==='menu',multiple=combo&&host.dataset.multiple==='true',status=host.querySelector('[data-menu-status]'),label=host.querySelector('[data-select-label]'),chips=host.querySelector('[data-combobox-chips]'),field=host.querySelector('[data-combobox-field]'),clearButton=host.querySelector('[data-menu-clear]');
  const options=()=>Array.from(popup.querySelectorAll('[data-option]')),available=()=>options().filter(option=>!option.hidden&&!option.disabled&&option.getAttribute('aria-disabled')!=='true');
  let active=null,opened=false,portal=false,topLayer=false,disposed=false,typeahead='',typeTimer,frame,initial=trigger.dataset.value||'';
  let selectedValues=new Set();try{const parsed=JSON.parse(trigger.dataset.values||'[]');if(Array.isArray(parsed))selectedValues=new Set(parsed.filter(value=>options().some(option=>option.dataset.value===value)));}catch{}
  const initialValues=[...selectedValues];
  const removers=[],listen=(el,type,fn,opts)=>{el.addEventListener(type,fn,opts);removers.push(()=>el.removeEventListener(type,fn,opts));};
  const position=()=>{
   if(!opened||!trigger.isConnected)return;
   const rect=(multiple?field||host:trigger).getBoundingClientRect(),viewport=win.visualViewport,view={width:viewport?.width||win.innerWidth,height:viewport?.height||win.innerHeight,left:viewport?.offsetLeft||0,top:viewport?.offsetTop||0};
   popup.style.maxHeight='none';const desired=menu?Math.max(host.dataset.menuAppearance==='sectioned'?parseFloat(F.resolve('component.menu.sectioned.width')):208,popup.scrollWidth):Math.max(180,rect.width);
   popup.style.width=Math.min(desired,view.width-16)+'px';
   const p=F.menuPlacement(rect,{width:desired,height:Math.min(popup.scrollHeight,320)},view,host.dataset.align||'start');
   Object.assign(popup.style,{left:p.left+'px',top:p.top+'px',width:p.width+'px',maxHeight:Math.min(320,p.maxHeight)+'px'});popup.dataset.side=p.side;
  };
  const schedulePosition=()=>{if(frame||!opened)return;frame=win.requestAnimationFrame(()=>{frame=null;position();});};
  const highlight=(option,focus=false)=>{
   active=option||null;options().forEach(item=>item.classList.toggle('is-highlighted',item===active));
   if(active){if(!menu)trigger.setAttribute('aria-activedescendant',active.id);if(focus)active.focus({preventScroll:true});active.scrollIntoView?.({block:'nearest'});}
   else trigger.removeAttribute('aria-activedescendant');
  };
  const close=(restore=false)=>{
   if(!opened)return;opened=false;if(openControl===close)openControl=null;
   if(topLayer){try{popup.hidePopover();}catch{}topLayer=false;}popup.hidden=true;popup.removeAttribute('data-open');trigger.setAttribute('aria-expanded','false');highlight(null);if(combo){if(multiple){trigger.value='';resetFilter();}else syncValue(trigger.dataset.value||'');}
   if(portal){host.append(popup);portal=false;}
   if(restore&&trigger.isConnected)trigger.focus({preventScroll:true});
  };
  const open=(edge)=>{
   if(trigger.disabled||disposed)return;if(opened){if(edge)highlight(F.menuNext(available(),active,edge),menu);return;}
   if(openControl&&openControl!==close)openControl();openControl=close;opened=true;popup.hidden=false;popup.dataset.open='true';trigger.setAttribute('aria-expanded','true');
   try{if(typeof popup.showPopover==='function'){popup.showPopover();topLayer=true;}else throw Error('No popover');}catch{doc.body.append(popup);portal=true;}
   position();const selected=available().find(option=>multiple?selectedValues.has(option.dataset.value):option.dataset.value===trigger.dataset.value);highlight(edge==='End'?available().at(-1):selected||available()[0],menu);
  };
  const syncValue=value=>{
   trigger.dataset.value=String(value);const selected=options().find(option=>option.dataset.value===String(value));
   options().forEach(option=>option.setAttribute('aria-selected',String(option===selected)));
   if(combo)trigger.value=selected?.dataset.label||String(value);else if(label)label.textContent=selected?.dataset.label||String(value);
   if(clearButton)clearButton.hidden=!value;
  };
  const optionRecords=()=>options().map(option=>({value:option.dataset.value,label:option.dataset.label,icon:option.dataset.icon,disabled:option.disabled||option.getAttribute('aria-disabled')==='true'}));
  const syncValues=values=>{
   selectedValues=new Set(values);trigger.dataset.values=JSON.stringify([...selectedValues]);
   options().forEach(option=>option.setAttribute('aria-selected',String(selectedValues.has(option.dataset.value))));
   if(chips)chips.innerHTML=chipsHTML(optionRecords(),[...selectedValues],trigger.disabled);
   if(clearButton)clearButton.hidden=selectedValues.size===0;
   position();
  };
  const emitChange=()=>{if(onChange)onChange(multiple?[...selectedValues]:trigger.dataset.value);else trigger.dispatchEvent(new win.Event('change',{bubbles:true}));};
  const resetFilter=()=>{options().forEach(option=>option.hidden=false);popup.querySelectorAll('[data-menu-group]').forEach(group=>group.hidden=false);const empty=popup.querySelector('[data-menu-empty]');if(empty)empty.hidden=available().length>0;};
  const removeValue=value=>{
   const option=options().find(option=>option.dataset.value===value);
   if(trigger.disabled||!option||option.disabled||option.getAttribute('aria-disabled')==='true'||!selectedValues.has(value))return;
   selectedValues.delete(value);syncValues(selectedValues);if(status)status.textContent=`${option.dataset.label} removed. ${selectedValues.size} selected.`;emitChange();trigger.focus({preventScroll:true});
  };
  const choose=option=>{
   if(!option||trigger.disabled||option.hidden||option.disabled||option.getAttribute('aria-disabled')==='true')return;
   if(menu){close(true);if(option.dataset.menuHref)win.location.hash=option.dataset.menuHref;else F.notify?.(option.dataset.label+' selected');return;}
   if(multiple){const removing=selectedValues.has(option.dataset.value);if(removing)selectedValues.delete(option.dataset.value);else selectedValues.add(option.dataset.value);syncValues(selectedValues);trigger.value='';resetFilter();highlight(option);if(status)status.textContent=`${option.dataset.label} ${removing?'removed':'selected'}. ${selectedValues.size} selected.`;emitChange();trigger.focus({preventScroll:true});position();return;}
   syncValue(option.dataset.value);if(status)status.textContent=option.dataset.label+' selected';close(true);
   emitChange();
  };
  const filter=()=>{
   const query=trigger.value.trim().toLocaleLowerCase();options().forEach(option=>option.hidden=!option.dataset.label.toLocaleLowerCase().includes(query));
   popup.querySelectorAll('[data-menu-group]').forEach(group=>group.hidden=!Array.from(group.querySelectorAll('[data-option]')).some(option=>!option.hidden));
   const count=available().length,empty=popup.querySelector('[data-menu-empty]');if(empty)empty.hidden=count>0;
   if(status)status.textContent=count?`${count} ${count===1?'result':'results'} available`:'No results found.';
   open();highlight(available()[0]);position();
  };
  const keydown=event=>{
   if(trigger.disabled||event.isComposing)return;const key=event.key;
   if(key==='Escape'&&opened){event.preventDefault();event.stopPropagation();close(true);return;}
   if(key==='Tab'){close(menu);return;}
   if(multiple&&key==='Backspace'&&!trigger.value){const last=optionRecords().filter(option=>selectedValues.has(option.value)&&!option.disabled).sort((a,b)=>[...selectedValues].indexOf(a.value)-[...selectedValues].indexOf(b.value)).at(-1);if(last){event.preventDefault();removeValue(last.value);}return;}
   if(['ArrowDown','ArrowUp'].includes(key)||opened&&['Home','End'].includes(key)&&(!combo||event.ctrlKey||event.metaKey)){
    event.preventDefault();if(!opened)open(key==='ArrowUp'?'End':'Home');else highlight(F.menuNext(available(),active,key),menu);return;
   }
   if(key==='Enter'||key===' '&&!combo){event.preventDefault();if(opened)choose(active);else open();return;}
   if(!combo&&key.length===1&&!event.ctrlKey&&!event.metaKey&&!event.altKey){
    event.preventDefault();win.clearTimeout(typeTimer);typeahead=typeahead===key.toLocaleLowerCase()?typeahead:typeahead+key.toLocaleLowerCase();typeTimer=win.setTimeout(()=>typeahead='',600);if(!opened)open();
    const list=available(),index=list.indexOf(active),ordered=[...list.slice(index+1),...list.slice(0,index+1)];highlight(ordered.find(option=>option.dataset.label.toLocaleLowerCase().startsWith(typeahead))||active,menu);
   }
  };
  listen(trigger,'keydown',keydown);listen(trigger,'click',()=>combo?open():opened?close():open());
  if(combo){listen(trigger,'input',filter);listen(trigger,'focus',()=>{resetFilter();open();});}
  if(combo){listen(host,'click',event=>{
   const remove=event.target.closest?.('[data-chip-remove]'),clear=event.target.closest?.('[data-menu-clear]');
   if(multiple&&remove&&host.contains(remove)){event.preventDefault();if(!remove.disabled)removeValue(remove.dataset.chipValue);}
   else if(clear&&host.contains(clear)&&!trigger.disabled&&!clear.disabled){event.preventDefault();if(multiple){syncValues(optionRecords().filter(option=>option.disabled&&selectedValues.has(option.value)).map(option=>option.value));trigger.value='';}else syncValue('');resetFilter();if(status)status.textContent=multiple&&selectedValues.size?`${selectedValues.size} selected.`:'Selection cleared.';emitChange();trigger.focus({preventScroll:true});open();}
   else if(field&&event.target===field)trigger.focus({preventScroll:true});
  });}
  if(menu)listen(popup,'keydown',keydown);
  listen(popup,'pointerdown',event=>{if(!menu&&event.target.closest?.('[data-option]'))event.preventDefault();});
  listen(popup,'pointermove',event=>{const option=event.target.closest?.('[data-option]');if(option&&available().includes(option))highlight(option);});
  listen(popup,'click',event=>{const option=event.target.closest?.('[data-option]');if(option){if(option.dataset.menuHref)event.preventDefault();choose(option);}});
  listen(doc,'pointerdown',event=>{if(opened&&!host.contains(event.target)&&!popup.contains(event.target))close();});
  listen(doc,'focusin',event=>{if(opened&&!host.contains(event.target)&&!popup.contains(event.target))close();});
  listen(win,'resize',schedulePosition);listen(doc,'scroll',event=>{if(!popup.contains(event.target))schedulePosition();},true);
  if(win.visualViewport){listen(win.visualViewport,'resize',schedulePosition);listen(win.visualViewport,'scroll',schedulePosition);}
  const form=trigger.closest?.('form');if(form&&!onChange)listen(form,'reset',()=>win.setTimeout(()=>{if(multiple){syncValues(initialValues);trigger.value='';}else syncValue(initial);close();},0));
  const cleanup=()=>{disposed=true;close();removers.forEach(remove=>remove());win.clearTimeout(typeTimer);if(frame)win.cancelAnimationFrame(frame);mounted.delete(host);};
  cleanup.sync=value=>{syncValue(value);if(trigger.disabled)close();};mounted.set(host,cleanup);return cleanup;
 }
 F.wireMenus=(root,registerCleanup)=>{
  const clean=Array.from(root.querySelectorAll('[data-pp-menu]')).map(host=>mount(host));
  const cleanup=()=>clean.forEach(fn=>fn());if(registerCleanup)registerCleanup(cleanup);return cleanup;
 };
 F.enhanceSelects=(root,registerCleanup)=>{
  const clean=[];
  for(const select of root.querySelectorAll('select')){
   if(enhanced.has(select)||select.multiple||select.size>1)continue;
   const doc=select.ownerDocument||document,win=doc.defaultView||window,id='pp-enhanced-'+(++serial),holder=doc.createElement('span'),labels=Array.from(select.labels||[]),light=Boolean(select.closest('.pp-theme,.pp-dialog'));
   const accessibleName=select.getAttribute('aria-label')||labels.map(label=>Array.from(label.childNodes||[]).filter(node=>node.nodeType===3).map(node=>node.textContent).join(' ').trim()||label.querySelector('span')?.textContent||label.textContent).join(' ').trim()||'Select option';
   const opts=Array.from(select.options).map(option=>({value:option.value,label:option.label,disabled:option.disabled||option.parentElement?.disabled}));
   holder.className='pp-enhanced-select';holder.innerHTML=F.select({label:accessibleName,options:opts,value:select.value,size:select.classList.contains('size-sm')?'sm':select.classList.contains('size-lg')?'lg':'md',state:select.getAttribute('aria-invalid')==='true'?'invalid':select.classList.contains('state-focus')?'focus':select.classList.contains('state-hover')?'hover':'default',disabled:select.disabled});
   const host=holder.firstElementChild,trigger=host.querySelector('[data-menu-control]'),popup=host.querySelector('.pp-menu-popup');trigger.id=id;
   if(!light){host.classList.add('pp-menu-dark');popup.classList.add('pp-menu-dark');}
   for(const attr of ['aria-describedby','aria-labelledby','aria-required'])if(select.hasAttribute(attr))trigger.setAttribute(attr,select.getAttribute(attr));
   if(select.required)trigger.setAttribute('aria-required','true');
   const previous={hidden:select.hidden,tabindex:select.getAttribute('tabindex'),ariaHidden:select.getAttribute('aria-hidden')};
   select.hidden=true;select.setAttribute('aria-hidden','true');select.tabIndex=-1;select.setAttribute('data-custom-native','');select.after(holder);
   const relabelled=labels.map(label=>({label,htmlFor:label.getAttribute('for')}));relabelled.forEach(({label})=>label.htmlFor=id);
   const dispose=mount(host,value=>{select.value=value;select.dispatchEvent(new win.Event('input',{bubbles:true}));select.dispatchEvent(new win.Event('change',{bubbles:true}));});
   const sync=()=>{trigger.disabled=select.disabled||select.matches(':disabled');trigger.setAttribute('aria-invalid',select.getAttribute('aria-invalid')||'false');dispose.sync(select.value);};
   const onReset=()=>win.setTimeout(sync,0);select.addEventListener('change',sync);select.addEventListener('input',sync);select.form?.addEventListener('reset',onReset);
   const observer=typeof win.MutationObserver==='function'?new win.MutationObserver(sync):null;observer?.observe(select,{attributes:true,attributeFilter:['disabled','aria-invalid']});
   const cleanup=()=>{dispose();observer?.disconnect();select.removeEventListener('change',sync);select.removeEventListener('input',sync);select.form?.removeEventListener('reset',onReset);relabelled.forEach(({label,htmlFor})=>{if(htmlFor===null)label.removeAttribute('for');else label.htmlFor=htmlFor;});holder.remove();select.hidden=previous.hidden;select.removeAttribute('data-custom-native');for(const [attr,value]of [['tabindex',previous.tabindex],['aria-hidden',previous.ariaHidden]])if(value===null)select.removeAttribute(attr);else select.setAttribute(attr,value);enhanced.delete(select);};
   enhanced.set(select,{sync,cleanup});clean.push(cleanup);sync();
  }
  const cleanup=()=>clean.forEach(fn=>fn());if(registerCleanup)registerCleanup(cleanup);return cleanup;
 };
 F.syncSelects=root=>root.querySelectorAll('select').forEach(select=>enhanced.get(select)?.sync());
 document.getElementById('project-tokens').textContent=F.tokenCSS();
})();
