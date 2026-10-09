/* Named, preview-scoped review targets. This is a metadata adapter, not a CSS editor.
   All selectable rules and writable properties are declared here; imported locators
   never become selectors. The review engine owns application, persistence and cleanup. */
(() => {
 'use strict';
 const F=window.Forma;
 const VERSION=1;
 const variants=['primary','secondary','outline','ghost','link','destructive','success'];
 const states=['default','hover','pressed','focus','disabled','loading','success'];
 const identities=['data-source-action','data-date-action','data-inbox-action','data-command-close','data-guided-close','data-drawer-close','data-action-delete','data-action-clear','data-pill-undo','data-menu-clear','data-chip-remove','data-value','name','aria-label'];
 const variable=(id,label,domain,token,name)=>({id,label,type:'token',domain,token,apply:{kind:'variable',name:name||F.varName(token)}});
 const style=(id,label,domain,name,token)=>({id,label,type:'token',domain,token:token||null,apply:{kind:'style',name}});
 const radius=token=>variable('radius','Corner radius','radius',token);
 const padding=token=>variable('padding','Padding','spacing',token);
 const gap=token=>variable('gap','Spacing','spacing',token);
 const definitions=[
  {id:'icon',label:'Icon',family:'icon',selector:'svg.hugeicon[data-hugeicon]',properties:[{id:'icon',label:'Icon',type:'icon',apply:{kind:'icon',name:'icon'}}]},
  {id:'button',label:'Button',family:'button',selector:'button.pp-button[style]',properties:[]},
  {id:'badge',label:'Badge',family:'badge',selector:'.pp-badge',properties:[variable('radius','Corner radius','radius',null,'--badge-radius'),variable('padding','Horizontal padding','spacing',null,'--badge-padding')]},
  {id:'tag',label:'Tag',family:'tag',selector:'.pp-tag',properties:[variable('radius','Corner radius','radius','component.tag.radius','--tag-radius'),variable('padding','Horizontal padding','spacing','component.tag.padding','--tag-padding'),variable('gap','Spacing','spacing','component.tag.gap','--tag-gap')]},
  {id:'chip',label:'Chip',family:'chip',selector:'.pp-chip',properties:[variable('radius','Corner radius','radius','component.chip.radius','--chip-radius'),variable('padding','Horizontal padding','spacing',null,'--chip-padding'),variable('gap','Spacing','spacing','component.chip.gap','--chip-gap')]},
  {id:'inline-input',label:'Inline input',family:'input',selector:'.pp-command-input,.pp-combobox-chips-field>.pp-combobox-input',properties:[style('radius','Corner radius','radius','border-radius','radius.0'),style('padding','Horizontal padding','spacing','padding-inline','space.0')]},
  {id:'combobox-field',label:'Selected values field',family:'combobox',selector:'.pp-combobox-chips-field',surface:true,properties:[radius('component.select.radius'),style('padding','Padding','spacing','padding'),gap('component.combobox.chips.gap')]},
  {id:'select',label:'Select control',family:'select',selector:'.pp-select-trigger',properties:[radius('component.select.radius'),variable('padding','Horizontal padding','spacing','component.select.padding')]},
  {id:'combobox-input',label:'Searchable input',family:'combobox',selector:'.pp-combobox-input',properties:[radius('component.select.radius'),style('padding','Horizontal padding','spacing','padding-inline','component.select.padding')]},
  {id:'input',label:'Input',family:'input',selector:'.pp-input',properties:[style('radius','Corner radius','radius','border-radius','component.input.radius'),style('padding','Horizontal padding','spacing','padding-inline','component.input.padding')]},
  {id:'command-panel',label:'Command menu panel',family:'command-menu',selector:'.pp-command-card',surface:true,properties:[radius('component.command.radius'),style('padding','Panel padding','spacing','padding','space.0')]},
  {id:'command-header',label:'Search header',family:'command-menu',selector:'.pp-command-header',properties:[style('padding','Padding','spacing','padding','space.8'),style('gap','Spacing','spacing','gap','space.12')]},
  {id:'command-scopes',label:'Search scopes',family:'command-menu',selector:'.pp-command-scopes',properties:[style('padding','Padding','spacing','padding','space.16')]},
  {id:'command-row',label:'Destination row',family:'command-menu',selector:'.pp-command-option',properties:[radius('component.command.rowRadius'),style('padding','Padding','spacing','padding','space.8'),gap('component.command.gap')]},
  {id:'command-footer',label:'Keyboard hints',family:'command-menu',selector:'.pp-command-footer',properties:[style('padding','Padding','spacing','padding','space.12'),style('gap','Spacing','spacing','gap','space.16')]},
  {id:'menu-panel',label:'Options panel',family:'menu',selector:'.pp-menu-popup',surface:true,properties:[radius('component.menu.radius'),padding('component.menu.content.padding'),gap('component.menu.content.gap')]},
  {id:'menu-row',label:'Option row',family:'menu',selector:'.pp-menu-option',properties:[radius('component.menu.item.radius'),padding('component.menu.item.padding'),gap('component.menu.item.gap')]},
  {id:'filter-panel',label:'Filter panel',family:'filter',selector:'.pp-pitch-filter-panel',surface:true,properties:[radius('component.filter.panel.radius'),style('padding','Panel padding','spacing','padding','space.0')]},
  {id:'filter-fields',label:'Filter fields',family:'filter',selector:'.pp-pitch-filter-fields',properties:[padding('component.filter.panel.padding'),gap('component.filter.panel.gap')]},
  {id:'guided-popover',label:'Guided popover',family:'guided-popover',selector:'.pp-guided-popover',surface:true,properties:[radius('component.guidedPopover.radius'),padding('component.guidedPopover.padding')]},
  {id:'date-panel',label:'Calendar panel',family:'date-picker',selector:'.pp-date-panel',surface:true,properties:[radius('component.date.radius'),padding('component.date.padding')]},
  {id:'drawer-panel',label:'Drawer panel',family:'drawer',selector:'.pp-drawer-card',surface:true,properties:[style('radius','Corner radius','radius','border-radius','component.drawer.radius'),style('padding','Panel padding','spacing','padding','space.0')]},
  {id:'drawer-body',label:'Drawer content',family:'drawer',selector:'.pp-drawer-body',properties:[padding('component.drawer.padding')]},
  {id:'information-panel',label:'Information panel',family:'information',selector:'.pp-information-card',surface:true,properties:[style('radius','Corner radius','radius','border-radius','component.information.radius'),padding('component.information.inset')]},
  {id:'information-body',label:'Content surface',family:'information',selector:'.pp-information-body,.pp-information-comparison',surface:true,properties:[style('radius','Corner radius','radius','border-radius','component.information.radius'),style('padding','Padding','spacing','padding','component.information.padding')]},
  {id:'information-header',label:'Card header',family:'information',selector:'.pp-information-head',properties:[style('padding','Padding','spacing','padding','component.information.padding'),gap('component.information.headerGap')]},
  {id:'result-card',label:'Result card',family:'data-table',selector:'.pp-pitch-table-card',surface:true,properties:[radius('component.table.radius'),padding('component.table.inset')]},
  {id:'result-scroll',label:'Table surface',family:'data-table',selector:'.pp-pitch-table-scroll',surface:true,properties:[radius('component.table.innerRadius')]},
  {id:'note-card',label:'Note card',family:'card',selector:'.pp-note-card',surface:true,properties:[radius('component.noteCard.radius'),variable('padding','Inset','spacing','component.noteCard.inset')]},
  {id:'alert',label:'Alert',family:'alert',selector:'.pp-feedback-alert',surface:true,properties:[radius('component.alert.radius'),padding('component.alert.padding'),gap('component.alert.gap')]},
  {id:'accordion-item',label:'Accordion item',family:'accordion',selector:'.pp-accordion-item',surface:true,properties:[radius('component.accordion.radius')]},
  {id:'accordion-trigger',label:'Accordion heading',family:'accordion',selector:'.pp-accordion-trigger',properties:[padding('component.accordion.padding'),gap('component.accordion.iconGap')]},
  {id:'popover',label:'Popover',family:'popover',selector:'.pp-popover',surface:true,properties:[radius('component.menu.radius'),style('padding','Padding','spacing','padding','space.16')]},
  {id:'dialog',label:'Dialog',family:'modal',selector:'.pp-dialog,.pp-modal',surface:true,properties:[radius('component.modal.radius'),style('padding','Padding','spacing','padding','space.0')]},
  {id:'card',label:'Card',family:'card',selector:'.pp-card',surface:true,properties:[radius('component.card.radius'),padding('component.card.padding')]},
  {id:'row',label:'Row',family:'layout',selector:'.pp-row,.pp-prompt-actions,.pp-source-form-actions',properties:[style('gap','Spacing','spacing','gap','space.12')]},
  {id:'stack',label:'Stack',family:'layout',selector:'.pp-stack,.pp-source-form,.pp-command-scopes-values',properties:[style('gap','Spacing','spacing','gap','space.12')]},
  // Semantic parts remain commentable even when no proven edit contract exists.
  {id:'semantic-part',label:'Section',family:'composition',selector:'header,footer,section,nav,form,fieldset,[role="group"],[role="listbox"],[role="dialog"]',properties:[]},
  {id:'preview',label:'Preview',family:'preview',selector:null,properties:[]}
 ];
 const byId=new Map(definitions.map(definition=>[definition.id,definition]));
 const matches=(el,selector)=>Boolean(selector&&el?.matches?.(selector));
 const inside=(root,el)=>root===el||Boolean(root?.contains?.(el));
 const all=(root,definition)=>!root?[]:definition.id==='preview'?[root]:[...(matches(root,definition.selector)?[root]:[]),...Array.from(root.querySelectorAll?.(definition.selector)||[])];
 const definitionFor=el=>definitions.find(definition=>matches(el,definition.selector));
 const readStyle=(el,name)=>el.style?.getPropertyValue?.(name)?.trim()||'';
 const computedFor=el=>{try{return el.ownerDocument?.defaultView?.getComputedStyle?.(el)||null;}catch{return null;}};
 const tokenOf=raw=>{const name=String(raw||'').match(/^var\((--pp-[\w-]+)\)$/)?.[1];return name?Object.keys(F.tokens).find(id=>F.varName(id)===name)||null:null;};
 const resolve=token=>{try{return token&&F.tokens[token]?F.resolve(token):null;}catch{return null;}};
 const iconKeys=()=>Object.keys(F.icons||{}).sort((a,b)=>Number(/fill/.test(a))-Number(/fill/.test(b))||a.localeCompare(b));
 const iconKey=name=>iconKeys().find(key=>F.icons[key].name===name)||null;
 const iconLabel=key=>({plus:'Add',close:'Close',chevron:'Chevron right',down:'Chevron down',up:'Chevron up',arrow:'Arrow up',funnel:'Filter',trash:'Delete',reset:'Undo',house:'Home',tray:'Inbox',bell:'Notification','caret-up-down':'Sort','arrows-clockwise':'Refresh',settings:'Adjustments','sliders-horizontal':'Adjustments','arrow-return':'Reply',external:'Open link',telescope:'Research',at:'At sign'}[key]||String(key||'Icon').replace(/-fill$|-filled$/,'').replace(/-/g,' ').replace(/^./,letter=>letter.toUpperCase()));
 const icons=()=>{const seen=new Set();return iconKeys().flatMap(id=>{const name=F.icons[id].name;if(seen.has(name))return [];seen.add(name);return [{id,name,label:iconLabel(id)}];});};
 const short=value=>String(value||'').replace(/\s+/g,' ').trim().slice(0,64);
 const textFor=el=>short(el?.getAttribute?.('aria-label')||el?.getAttribute?.('placeholder')||el?.textContent);
 const partLabel=(el,definition)=>{
  if(definition.id==='icon'){
   const glyph=iconLabel(iconKey(el.getAttribute('data-hugeicon')));
   const owner=el.closest('button,a,.pp-command-option,.pp-command-header,.pp-command-footer,.pp-input-icon,.pp-menu-option,.pp-badge,.pp-chip,.pp-tag,label');
   const ownerDefinition=owner&&definitionFor(owner),name=owner&&(owner.matches('.pp-command-header,.pp-command-footer')?ownerDefinition?.label:textFor(owner));
   return glyph+' icon'+(name?' · '+name:'');
  }
  if(['button','badge','tag','chip','select','input','combobox-input','inline-input','command-row','menu-row','accordion-trigger'].includes(definition.id)){
   const name=textFor(el);return definition.label+(name?' · '+name:'');
  }
  if(definition.id==='semantic-part'){const name=short(el.getAttribute('aria-label')||el.querySelector('h1,h2,h3,legend')?.textContent);return name||definition.label;}
  return definition.label;
 };
 const identityFor=el=>{for(const attribute of identities)if(el.hasAttribute?.(attribute))return {attribute,value:el.getAttribute(attribute)};return null;};
 const equivalent=(el,identity)=>!identity||el.getAttribute?.(identity.attribute)===identity.value;
 const locatorFor=(el,definition,root,anchored=true)=>{
  let scope=root,anchor=null;
  if(anchored)for(let parent=el.parentElement;parent&&inside(root,parent);parent=parent.parentElement){const part=definitionFor(parent);if(part?.surface){anchor=locatorFor(parent,part,root,false);scope=parent;break;}if(parent===root)break;}
  const identity=identityFor(el),candidates=all(scope,definition).filter(candidate=>equivalent(candidate,identity));
  return {version:VERSION,kind:definition.id,...(anchor?{anchor}:{}),...(identity?{identity}:{}),index:candidates.indexOf(el)};
 };
 F.reviewFind=(root,locator)=>{
  if(!root||!locator||locator.version!==VERSION||!byId.has(locator.kind)||!Number.isSafeInteger(locator.index)||locator.index<0)return null;
  if(locator.identity&&(!identities.includes(locator.identity.attribute)||typeof locator.identity.value!=='string'))return null;
  // One named ancestor only; recursive/unbounded imported structures are rejected.
  if(locator.anchor?.anchor)return null;
  const scope=locator.anchor?F.reviewFind(root,locator.anchor):root;if(!scope)return null;
  return all(scope,byId.get(locator.kind)).filter(el=>equivalent(el,locator.identity))[locator.index]||null;
 };
 const buttonConfig=el=>{
  const variant=variants.find(value=>el.classList?.contains(value))||'primary',size=['sm','md','lg'].find(value=>el.classList?.contains('size-'+value))||'md',state=states.find(value=>el.classList?.contains('state-'+value))||'default';
  const svg=el.querySelector?.('svg.hugeicon[data-hugeicon]'),iconName=iconKey(svg?.getAttribute('data-hugeicon'));
  const icon=el.classList?.contains('icon-only')?'only':svg?(Array.from(el.childNodes||[]).slice(0,Array.from(el.childNodes||[]).indexOf(svg)).some(node=>node.nodeType===3&&node.textContent.trim())?'trailing':'leading'):'none';
  return {variant,size,state,icon,...(iconName?{iconName}:{}),...(tokenOf(readStyle(el,'--demo-button-fg'))==='component.button.inverse.foreground'?{surface:'inverse'}:{})};
 };
 const propertiesFor=(el,definition,computed)=>{
  let properties=definition.properties;
  // Composed controls can replace an atom's CSS contract. Only offer edits that
  // the rendered part actually consumes; structural zeros remain commentable.
  if(definition.id==='badge'){
   if(el.classList.contains('icon-only'))properties=properties.filter(property=>property.id!=='padding');
   if(el.classList.contains('pp-task-status'))properties=[style('radius','Corner radius','radius','border-radius','radius.full'),style('padding','Horizontal padding','spacing','padding-inline','space.8')];
  }
  if(definition.id==='chip'&&el.classList.contains('pp-chip-filter'))properties=properties.filter(property=>property.id!=='gap');
  if(definition.id==='inline-input')properties=properties.filter(property=>property.id!=='radius');
  if(definition.id==='menu-panel'&&el.classList.contains('pp-menu-sectioned'))properties=properties.map(property=>property.id==='radius'?radius('component.menu.sectioned.radius'):property);
  if(definition.id==='select'){
   if(el.closest('.pp-pitch-sort'))properties=[radius('component.filter.control.radius'),padding('component.filter.control.padding')];
   else if(el.closest('.pp-source-onboarding-currency,.pp-source-onboarding-role'))properties=properties.map(property=>property.id==='padding'?style('padding','Horizontal padding','spacing','padding-inline',el.closest('.pp-source-onboarding-role')?'space.6':'space.8'):property);
  }
  if(definition.id==='accordion-item'&&el.closest('.pp-feedback-accordion.line,.pp-feedback-accordion.setup'))properties=[];
  if(definition.id==='dialog'&&el.classList.contains('pp-source-decision'))properties=properties.map(property=>property.id==='radius'?radius('component.sourceShell.decision.radius'):property);
  if(definition.id==='information-body'&&el.matches('.pp-information-stack-body,.pp-information-table-body'))properties=properties.filter(property=>property.id!=='padding');
  if(definition.id==='information-header'&&el.classList.contains('pp-evidence-question-head'))properties=properties.map(property=>property.id==='gap'?style('gap','Spacing','spacing','gap','space.8'):property);
  // Reserve the source input's occupied icon/clear/chevron areas. A padding tweak
  // changes only the free text edge when another control occupies the opposite edge.
  if(definition.id==='input'&&matches(el.parentElement,'.pp-input-icon'))properties=properties.map(property=>property.id==='padding'?style('padding','Right text inset','spacing','padding-right','component.input.padding'):property);
  if(definition.id==='combobox-input')properties=matches(el.parentElement,'.has-leading-icon')?properties.filter(property=>property.id!=='padding'):properties.map(property=>property.id==='padding'?style('padding','Left text inset','spacing','padding-inline-start','component.select.padding'):property);
  if(definition.id==='inline-input'&&matches(el,'.pp-combobox-input'))properties=properties.map(property=>property.id==='padding'?{...property,token:'space.4'}:property);
  if(definition.id==='combobox-field')properties=properties.map(property=>property.id==='padding'?padding('component.combobox.chips.padding'+(el.classList.contains('size-sm')?'.sm':el.classList.contains('size-lg')?'.lg':'')):property);
  if(definition.id==='button'){
   const config=buttonConfig(el);let buttonRadius=variable('radius','Corner radius','radius','component.control.radius','--demo-button-radius');
   if(matches(el,'.pp-source-navigation>header>.pp-button'))buttonRadius=radius('component.sourceShell.navigation.toggleRadius');
   else if(matches(el,'.pp-page-navigation .pp-button'))buttonRadius=radius('component.pagination.radius');
   else if(matches(el,'.pp-trace-map-controls .pp-button,.pp-trace-sidebar-heading .pp-button,.pp-step-list .pp-button'))buttonRadius=style('radius','Corner radius','radius','border-radius');
   properties=[buttonRadius,...(config.icon==='only'?[]:[variable('padding','Horizontal padding','spacing',null,'--demo-button-padding')]),{id:'variant',label:'Button appearance',type:'enum',value:config.variant,options:variants,apply:{kind:'button-variant',name:'variant'}},...(config.icon!=='none'?[{id:'icon',label:'Icon',type:'icon',value:config.iconName,apply:{kind:'button-icon',name:'icon'}}]:[])];
   if(el.closest('.pp-button-group'))properties=properties.filter(property=>!['radius','variant'].includes(property.id));
   if(config.state==='disabled'||config.state==='success'||el.disabled||el.closest('.pp-tag,.pp-page-navigation,.pp-step-list'))properties=properties.filter(property=>property.id!=='variant');
   if(el.closest('.pp-page-navigation,.is-dots .pp-step-list'))properties=properties.filter(property=>property.id!=='padding');
   if(el.closest('.pp-step-list')&&!el.closest('.is-dots'))properties=properties.map(property=>property.id==='padding'?style('padding','Horizontal padding','spacing','padding-inline','space.4'):property);
   if(el.closest('.pp-trace-map-controls'))properties=properties.map(property=>property.id==='padding'?style('padding','Horizontal padding','spacing','padding-inline','space.8'):property);
  }
  if(el.childElementCount<2)properties=properties.filter(property=>property.id!=='gap');
  return properties.map(property=>{
   const apply={...property.apply};
   if(property.type!=='token')return {...property,apply,value:property.value??iconKey(el.getAttribute?.('data-hugeicon')),original:{value:property.value??iconKey(el.getAttribute?.('data-hugeicon'))}};
   const inlineValue=readStyle(el,apply.name),computedValue=computed?.getPropertyValue?.(apply.name)?.trim()||'',token=tokenOf(inlineValue)||tokenOf(computedValue)||(F.tokens[property.token]?property.token:null);
   const currentValue=computedValue||inlineValue||resolve(token)||'';
   return {...property,apply,token,value:token,cssVariable:apply.kind==='variable'?apply.name:null,currentValue,original:{token,inlineValue,computedValue:currentValue,resolvedValue:resolve(token),property:apply.name,kind:apply.kind}};
  });
 };
 F.reviewDescribe=(element,previewRoot,{metadataOnly=false}={})=>{
  if(!previewRoot||!element)return null;
  let el=element.nodeType===3?element.parentElement:element;if(!inside(previewRoot,el))return null;
  let definition;
  while(el&&inside(previewRoot,el)){definition=definitionFor(el);if(definition)break;if(el===previewRoot)break;el=el.parentElement;}
  if(!definition){definition=byId.get('preview');el=previewRoot;}
  const breadcrumb=[];
  for(let ancestor=el;ancestor&&inside(previewRoot,ancestor);ancestor=ancestor.parentElement){const part=ancestor===el?definition:definitionFor(ancestor);if(part)breadcrumb.unshift({label:partLabel(ancestor,part),kind:part.id,locator:locatorFor(ancestor,part,previewRoot)});if(ancestor===previewRoot)break;}
  const properties=metadataOnly?[]:propertiesFor(el,definition,computedFor(el));
  const owner={componentId:previewRoot.getAttribute?.('data-review-component')||previewRoot.getAttribute?.('data-component')||previewRoot.closest?.('[data-component]')?.getAttribute('data-component')||null,family:definition.family,part:definition.id};
  return {version:VERSION,id:definition.id,kind:definition.id,label:partLabel(el,definition),element:el,owner,locator:locatorFor(el,definition,previewRoot),breadcrumb,properties,original:Object.fromEntries(properties.map(property=>[property.id,property.original])),...(!metadataOnly&&definition.id==='button'?{config:buttonConfig(el)}:{}),editable:properties.length>0};
 };
 F.reviewTokenChoices=input=>{
  const property=typeof input==='string'?{id:input,domain:['radius','spacing'].includes(input)?input:null}:input||{};
  const domain=property.domain||(['radius','cornerRadius'].includes(property.id)?'radius':['padding','gap','spacing','inset'].includes(property.id)?'spacing':null);
  if(!['radius','spacing'].includes(domain))return [];
  const compatible=id=>{try{const chain=F.chain(id),leaf=chain[chain.length-1];return domain==='radius'?/^radius\./.test(leaf):/^space\.\d+$/.test(leaf);}catch{return false;}};
  return Object.entries(F.tokens).filter(([id,token])=>token.type==='dimension'&&compatible(id)&&(id===property.token||(domain==='radius'?/^radius\./.test(id):/^space\.\d+$/.test(id)))).map(([id,token])=>({id,label:id,value:F.resolve(id),type:token.type}));
 };
 // Imported data is restricted to the same declarative contracts used for live targets.
 F.reviewValidateLocator=(value,anchored=false)=>{
  if(!value||typeof value!=='object'||Array.isArray(value)||value.version!==VERSION||!byId.has(value.kind)||!Number.isSafeInteger(value.index)||value.index<0||value.index>5000)throw Error('Invalid review target.');
  if(Object.keys(value).some(key=>!['version','kind','index','identity','anchor'].includes(key)))throw Error('Unknown review target field.');
  const result={version:VERSION,kind:value.kind,index:value.index};
  if(value.identity!==undefined){const identity=value.identity;if(!identity||typeof identity!=='object'||Array.isArray(identity)||Object.keys(identity).some(key=>!['attribute','value'].includes(key))||!identities.includes(identity.attribute)||typeof identity.value!=='string'||identity.value.length>600)throw Error('Invalid target identity.');result.identity={attribute:identity.attribute,value:identity.value};}
  if(value.anchor!==undefined){if(anchored)throw Error('Nested target anchors are unsupported.');result.anchor=F.reviewValidateLocator(value.anchor,true);if(!byId.get(result.anchor.kind).surface)throw Error('A target anchor must be a named surface.');}
  return result;
 };
 F.reviewValidateChange=(locator,propertyId,value)=>{
  const target=F.reviewValidateLocator(locator),definition=byId.get(target.kind);
  const buttonProperties=[{id:'radius',type:'token',domain:'radius'},{id:'padding',type:'token',domain:'spacing'},{id:'variant',type:'enum',options:variants},{id:'icon',type:'icon'}];
  const property=(target.kind==='button'?buttonProperties:definition.properties).find(entry=>entry.id===propertyId);
  if(!property||typeof value!=='string')throw Error('This property cannot be edited.');
  if(property.type==='icon'){if(!Object.hasOwn(F.icons||{},value))throw Error('Choose an existing Hugeicons icon.');}
  else if(property.type==='enum'){if(!property.options.includes(value))throw Error('Choose an existing button appearance.');}
  else if(property.type==='token'){
   // Compatible registered role aliases are allowed, but never cross-domain dimensions.
   const token=F.tokens[value],chain=token?F.chain(value):[],leaf=chain[chain.length-1];
   if(token?.type!=='dimension'||!(property.domain==='radius'?/^radius\./.test(leaf):/^space\.\d+$/.test(leaf)))throw Error('Choose a compatible system token.');
  }else throw Error('Unsupported review property.');
  return {target,property:propertyId,value};
 };
 F.reviewTargets=Object.freeze({version:VERSION,descriptors:Object.freeze(definitions.map(definition=>Object.freeze({...definition,properties:Object.freeze(definition.properties)}))),buttonVariants:Object.freeze(variants),get icons(){return icons();},identityAttributes:Object.freeze(identities),limitations:Object.freeze(['Named targets only; no arbitrary CSS selectors or freeform property edits.','Token choices are existing radius and canonical spacing primitives.','The host owns edit persistence, DOM listener cleanup.'])});
})();
