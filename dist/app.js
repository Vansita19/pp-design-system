document.querySelectorAll('[data-command-menu-open].search-command-trigger').forEach(button=>button.innerHTML=F.kbd({key:'⌘ K'}));
F.wireCommandMenu(document);
document.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=F.icon(el.dataset.icon,Number(el.dataset.size)||16);});
const main=document.querySelector('#content'),nav=document.querySelector('#navigation'),search=document.querySelector('#search');
F.paused=false;try{F.paused=localStorage.getItem('forma-motion')==='paused';}catch{}F.current=null;F.config={};let category='All',searchTerm='',routeSection='overview',toastTimer,routeFrame=0;
let navigationSearch=null;const navigationGroups=new Map(),navigationSections=new Map();
F.notify=message=>{const t=document.querySelector('#toast');t.textContent=message;t.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('visible'),2300);};
F.copy=async text=>{try{await navigator.clipboard.writeText(text);F.notify('Copied to clipboard');}catch{const area=document.createElement('textarea');area.value=text;document.body.append(area);area.select();const ok=document.execCommand('copy');area.remove();F.notify(ok?'Copied to clipboard':'Copy is unavailable in this browser');}};
const titleCase=s=>String(s).replaceAll('-',' ').replace(/\b\w/g,c=>c.toUpperCase());
function iconFor(group){return {Foundations:'layers',Atoms:'circle',Molecules:'grid',Blocks:'grid',Motion:'bolt',Templates:'file'}[group]||'grid';}
function renderNav(){
 const current=F.current?.id||'',changed=nav.dataset.currentId!==current,scroll=nav.scrollTop;
 // Search temporarily opens matching groups; do not overwrite the normal disclosure preferences.
 if(!navigationSearch)nav.querySelectorAll('[data-nav-group]').forEach(group=>navigationGroups.set(group.dataset.navGroup,group.open));
 nav.querySelectorAll('.nav-sub').forEach(list=>navigationSections.set(list.id,!list.hidden));
 if(changed&&current){navigationGroups.set(F.current.group,true);navigationSections.set('nav-'+current,true);}
 if(navigationSearch!==searchTerm||!nav.querySelector('.nav-item')){
  nav.innerHTML=`<a class="nav-item" href="#all">${I('grid')}All components <span>${F.visibleItems().filter(i=>i.group!=='Foundations').length}</span></a>${F.groups.map(group=>{const filtered=F.visibleItems().filter(i=>i.group===group&&(!searchTerm||F.matchesSearch(i,searchTerm)));if(!filtered.length)return '';const open=searchTerm||(navigationGroups.get(group)??(group==='Foundations'||group==='Atoms'||F.current?.group===group));return `<details class="nav-group" data-nav-group="${E(group)}" ${open?'open':''}><summary>${group}<span>${filtered.length}</span>${I('down',12)}</summary><ul>${filtered.map(item=>`<li><div class="nav-component" data-nav-component="${item.id}"><a href="#${item.id}">${item.name}</a>${item.sections.length?`<button class="nav-disclose" aria-label="${item.name} sections" aria-controls="nav-${item.id}">${I('chevron',11)}</button>`:''}</div>${item.sections.length?`<ul id="nav-${item.id}" class="nav-sub">${item.sections.map(([name,slug])=>`<li><a href="#${item.id}/${slug}">${name}</a></li>`).join('')}</ul>`:''}</li>`).join('')}</ul></details>`;}).join('')}`;
  navigationSearch=searchTerm;
  nav.querySelectorAll('.nav-disclose').forEach(button=>button.onclick=()=>{const list=document.getElementById(button.getAttribute('aria-controls'));list.hidden=!list.hidden;button.setAttribute('aria-expanded',String(!list.hidden));navigationSections.set(list.id,!list.hidden);});
 }
 const active=(link,on,className)=>{link.classList.toggle(className,on);if(on)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');};
 active(nav.querySelector('.nav-item'),!current,'active');
 nav.querySelectorAll('[data-nav-group]').forEach(group=>{if(!searchTerm&&navigationGroups.has(group.dataset.navGroup))group.open=navigationGroups.get(group.dataset.navGroup);});
 nav.querySelectorAll('[data-nav-component]').forEach(component=>{const selected=component.dataset.navComponent===current;component.classList.toggle('current',selected);active(component.querySelector('a'),selected,'active');const button=component.querySelector('.nav-disclose');if(button){const list=document.getElementById(button.getAttribute('aria-controls')),expanded=navigationSections.get(list.id)||false;list.hidden=!expanded;button.setAttribute('aria-expanded',String(expanded));}});
 nav.querySelectorAll('.nav-sub a').forEach(link=>active(link,link.getAttribute('href')==='#'+current+'/'+routeSection,'selected'));
 nav.dataset.currentId=current;nav.scrollTop=scroll;
}
function clearConfigurationControls(){F.configurationCleanup?.();F.configurationCleanup=null;}
function heading(name,group,count){return `<div class="page-heading"><div class="eyebrow">${E(group||'PITCH PROTOCOL')}</div><div class="heading-row"><h1>${E(name)}${count!==undefined?`<span class="count-badge">${count}</span>`:''}</h1>${F.current?`<button class="quiet-button" id="copy-link">${I('link',14)} Copy link</button>`:''}</div></div>`;}
function renderCatalogue(){
 clearConfigurationControls();F.clearCovers();F.current=null;F.clearPreviews();document.title='All components — Pitch Protocol';document.querySelector('#breadcrumbs').innerHTML='Pitch Protocol <span>/</span> Design system <span>/</span> <b>All components</b>';
 const list=F.visibleItems().filter(i=>(category==='All'?i.group!=='Foundations':i.group===category)&&(!searchTerm||F.matchesSearch(i,searchTerm)));
 const content=list.length?`<div class="catalogue">${list.map(item=>`<a class="component-card" href="#${item.id}"><div class="card-art"><div class="hairline-cover" data-cover="${E(item.id)}" aria-hidden="true"></div></div><div class="card-caption"><span>${item.name}</span><small>${item.group}</small></div></a>`).join('')}</div>`:`<div class="empty-catalogue">${I('search',28)}<h3>No components found</h3><p>Try a different name or category.</p><button class="quiet-button" id="clear-search">Clear search</button></div>`;
 let body=main.querySelector('#catalogue-body');
 if(body){body.innerHTML=content;main.querySelector('.page-heading .count-badge').textContent=list.length;}
 else{main.innerHTML=heading('All components','PITCH PROTOCOL',list.length)+`<div class="catalogue-toolbar"><div class="category-tabs" role="group" aria-label="Component category">${['All',...F.groups].map(group=>`<button data-category="${group}">${group}${group==='Motion'?`<span class="new-label">${F.visibleItems().filter(item=>item.group==='Motion').length}</span>`:''}</button>`).join('')}</div></div><div id="catalogue-body">${content}</div>`;body=main.querySelector('#catalogue-body');}
 F.mountCovers(body);main.querySelectorAll('[data-category]').forEach(button=>{button.classList.toggle('active',category===button.dataset.category);button.setAttribute('aria-pressed',String(category===button.dataset.category));button.onclick=()=>{category=button.dataset.category;renderCatalogue();};});
 main.querySelector('#clear-search')?.addEventListener('click',()=>{searchTerm='';search.value='';category='All';renderCatalogue();});renderNav();
}
function tokenTable(ids){return F.tokenTable(ids,{showPrimitiveValues:F.current?.group==='Foundations'});}
function bindCopy(){main.querySelectorAll('[data-copy]').forEach(b=>b.onclick=()=>F.copy(b.dataset.copy));const link=main.querySelector('#copy-link');if(link)link.onclick=()=>F.copy(location.href);}
function foundation(item,{preserveTabs=false}={}){clearConfigurationControls();F.clearPreviews();let content='';const key=item.id,palettePage=['colors','semantic-tokens'].includes(key);
 if(key==='colors'){content=Object.entries(F.palettes).map(([family,steps])=>`<section class="foundation-section" id="palette-${family}"><div class="section-title"><h2>${family==='gray'?'Neutral':family==='blue'?'Primary · Blue':titleCase(family)}</h2><small>${Object.keys(steps).length} tokens</small></div><div class="palette">${Object.entries(steps).map(([step,v])=>`<button class="palette-token" data-copy="${v}" aria-label="Copy ${family} ${step} ${v}"><span style="background:${v}"></span><b>${step}</b><code>${v}</code></button>`).join('')}</div></section>`).join('');}
 else if(key==='semantic-tokens'){const ids=Object.keys(F.tokens).filter(k=>k.startsWith('semantic.'));content=[...new Set(ids.map(id=>id.split('.')[1]))].map(g=>`<section class="foundation-section"><div class="section-title"><h2>${titleCase(g)}</h2></div>${tokenTable(ids.filter(k=>k.startsWith('semantic.'+g+'.')))}</section>`).join('');}
 else if(key==='typography'){content=`<section class="type-intro"><span class="type-specimen">Aa</span><div><h2>System sans</h2><code>SF Pro Text · Helvetica Neue · sans-serif</code><p>400 Regular &nbsp; 500 Medium &nbsp; 600 Semibold</p></div></section><section class="foundation-section">${[48,40,32,28,24,20,18,16,14,13,12].map(n=>`<div class="type-row"><code>${n}px</code><span style="font-size:${n}px;line-height:1.4;font-family:var(--pp-font-family-sans)">${n>24?'Build with intention.':'The details make the difference.'}</span><button class="icon-control" data-copy="${n}px" aria-label="Copy ${n}px">${I('copy',14)}</button></div>`).join('')}</section>`;}
 else if(key==='spacing'){content='<div class="space-list">'+F.spacingScale.map(n=>'space.'+n).map(k=>`<button class="space-row" data-copy="${F.resolve(k)}"><code>${k}</code><span><i style="width:${parseInt(F.resolve(k))*3}px"></i></span><code>${F.resolve(k)}</code></button>`).join('')+'</div>';}
 else if(key==='radius'){content='<div class="foundation-grid">'+Object.keys(F.radiusAliases).map(name=>'radius.'+name).map(k=>`<button class="foundation-card" data-copy="${F.resolve(k)}"><span class="radius-specimen" style="border-radius:${F.resolve(k)}"></span><div><code>${k}</code><small>${F.resolve(k)}</small></div></button>`).join('')+'</div>';}
 else if(key==='shadows'){content='<div class="foundation-grid">'+Object.keys(F.tokens).filter(k=>k.startsWith('shadow.')).map(k=>`<button class="foundation-card" data-copy="${F.resolve(k)}"><span class="shadow-specimen pp-theme"><i style="box-shadow:${F.resolve(k)}"></i></span><div><code>${k}</code></div></button>`).join('')+'</div>'+tokenTable(Object.keys(F.tokens).filter(k=>k.startsWith('shadow.')));}
 else if(key==='icons'){content='<section class="foundation-section"><div class="section-title"><h2>Hugeicons · Stroke Rounded</h2></div><p class="essential-note">Small icons (16px and below): 1.25px stroke. Larger icons: 1.5px stroke.</p></section><div class="icons-grid">'+Object.keys(F.icons).filter((name,index,names)=>names.findIndex(key=>F.icons[key].name===F.icons[name].name)===index).map(n=>`<button data-copy="${E(I(n,24))}" aria-label="Copy ${n} SVG">${I(n,24)}<span>${E(F.icons[n].name.replace(/Icon$/, '').replace(/([a-z])([A-Z])/g,'$1 $2'))}</span></button>`).join('')+'</div>'+tokenTable(['icon.stroke.small','icon.stroke.large','icon.size.threshold']);}
 else if(key==='borders'){content='<div class="border-examples">'+['default','strong','focus'].map(k=>`<div style="border:1px solid ${F.v('semantic.border.'+k)}">${titleCase(k)}</div>`).join('')+'</div><section class="primitives-section"><div class="section-title"><h2>Tokens used</h2></div>'+tokenTable([...Object.keys(F.tokens).filter(id=>id.startsWith('border.')),'semantic.border.default','semantic.border.strong','semantic.border.focus'])+'</section>'; }
 else if(key==='grids'){content=F.layoutFoundation()+tokenTable([...F.layoutTokens(),...Object.keys(F.tokens).filter(id=>id.startsWith('layout.')||id.startsWith('size.'))]);}
 else if(key==='motion-tokens'){content=tokenTable(Object.keys(F.tokens).filter(k=>k.startsWith('motion.')))+`<p class="essential-note">Motion respects reduced-motion preferences. Pause all previews from the top bar.</p>`;}
 else if(key==='layers'){content=tokenTable(Object.keys(F.tokens).filter(k=>k.startsWith('layer.')));}
 if(key==='radius')content+=tokenTable(Object.keys(F.tokens).filter(id=>id.startsWith('shape.')));
 if(key==='typography')content+=['font.family.','font.weight.','font.line.'].map(prefix=>'<section class="foundation-section">'+tokenTable(Object.keys(F.tokens).filter(k=>k.startsWith(prefix)))+'</section>').join('');
 if(key==='colors')content+='<section class="foundation-section"><div class="section-title"><h2>Other colors</h2></div>'+tokenTable(Object.keys(F.tokens).filter(id=>id.startsWith('color.')&&!Object.entries(F.palettes).some(([family,steps])=>Object.keys(steps).some(step=>id===`color.${family}.${step}`))))+'</section>';
 const existingBody=preserveTabs&&palettePage?main.querySelector('#foundation-body'):null;
 if(existingBody){main.querySelector('.page-heading h1').textContent=item.name;existingBody.innerHTML=content;}
 else{const body=palettePage?`<div class="foundation-tabs"><a href="#colors">Primitives</a><a href="#semantic-tokens">Semantic tokens</a></div><div id="foundation-body">${content}</div>`:content;main.innerHTML=heading(item.name,'FOUNDATIONS')+'<div class="foundation-content">'+body+'</div>';}
 if(palettePage)main.querySelectorAll('.foundation-tabs a').forEach(link=>{const selected=link.getAttribute('href')==='#'+key;link.classList.toggle('active',selected);if(selected)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
 if(key==='grids')F.wireLayoutFoundation(main,cleanup=>F.previewCleanups.push(cleanup));bindCopy();}
function controlsHTML(item){return item.controls.map(ctl=>{const value=F.config[ctl.key],id='config-'+ctl.key,hidden=F.controlVisible?.(item,ctl,F.config)===false,wrapper=`data-control-key="${E(ctl.key)}"${hidden?' hidden style="display:none"':''}`;if(ctl.type==='toggle')return `<label class="config-toggle" for="${id}" ${wrapper}><span data-control-label>${E(F.controlLabel(item,ctl,F.config))}</span><input id="${id}" type="checkbox" role="switch" data-config="${ctl.key}" ${value?'checked':''}></label>`;if(ctl.type==='select')return `<label class="config-field" for="${id}" ${wrapper}><span data-control-label>${E(F.controlLabel(item,ctl,F.config))}</span><span class="config-select"><select id="${id}" data-config="${ctl.key}">${ctl.options.map(x=>`<option value="${E(x)}" ${value===x?'selected':''}>${titleCase(x)}</option>`).join('')}</select>${I('down',14)}</span></label>`;if(ctl.type==='range'){const range=ctl.key==='rows'?[2,10]:ctl.key==='page'?[1,5]:ctl.key==='count'?[1,8]:[0,100];return `<label class="config-field" for="${id}" ${wrapper}><span>${ctl.label}<output>${value}</output></span><input type="range" id="${id}" min="${range[0]}" max="${range[1]}" value="${value}" data-config="${ctl.key}"></label>`;}return `<label class="config-field" for="${id}" ${wrapper}><span data-control-label>${E(F.controlLabel(item,ctl,F.config))}</span><input id="${id}" type="text" value="${E(value)}" data-config="${ctl.key}"></label>`;}).join('');}
function updateControlVisibility(item){main.querySelectorAll('[data-control-key]').forEach(wrapper=>{const control=item.controls.find(ctl=>ctl.key===wrapper.dataset.controlKey),hidden=control&&F.controlVisible?.(item,control,F.config)===false;wrapper.hidden=Boolean(hidden);wrapper.style.display=hidden?'none':'';const label=wrapper.querySelector('[data-control-label]');if(label&&control)label.textContent=F.controlLabel(item,control,F.config);});}
function usedTokens(item,c){let ids=[...item.tokens,'font.family.sans','font.size.14'];if(['button','icon-button'].includes(item.id)){ids=Object.values(F.buttonTokens(c)).filter((id,n,a)=>a.indexOf(id)===n);if(c.state==='loading')ids.push('motion.duration.slow');}
 if(['input','textarea','field','select'].includes(item.id)){if(item.id!=='textarea')ids.push('component.control.height.'+(c.size||'md'));if(c.size==='sm')ids=ids.filter(id=>id!=='component.input.font').concat('font.size.13');if(c.state==='focus')ids.push('component.input.focus','semantic.border.focus');if(c.state==='invalid')ids.push('semantic.border.danger');if(c.state==='success')ids.push('semantic.border.success');if(c.state==='disabled')ids.push('semantic.surface.disabled','semantic.text.disabled');}
 if(c.tone){if(c.tone==='neutral')ids.push('semantic.text.body','semantic.surface.subtle');else{let tone=c.tone==='blue'?'info':c.tone;ids.push('semantic.status.'+tone,'semantic.status.'+tone+'Subtle');}}
 return [...new Set(ids)].filter(id=>F.tokens[id]);}
function renderInspector(ids=F.componentTokens(F.current,F.config,usedTokens)){document.querySelector('#token-count').textContent=ids.length;document.querySelector('#token-list').innerHTML=tokenTable(ids);bindCopy();}
function variantConfigs(item,section){
 const defaults=F.defaults(item),keys={types:'variant',styles:'variant',sizes:'size',states:'state',icons:'icon',colors:'tone',indicators:'indicator',badges:'badge',animation:'speed',layouts:'layout',actions:'action',content:'content',options:'optionStyle'};
 const family=(id,label,config)=>({itemId:id,label,config:{...F.defaults(F.byId[id]),...config}});
 const example=(label,config={})=>({label,config:{...defaults,...config}});
 if(item.id==='conversation'&&section==='styles')return item.controls.find(c=>c.key==='appearance').options.map(appearance=>example(titleCase(appearance),{appearance}));
 if(item.id==='conversation'&&section==='alignment')return ['start','end'].map(align=>example(titleCase(align),{align}));
 if(item.id==='conversation'&&section==='groups')return ['start','end'].map(align=>example(titleCase(align)+' · Grouped',{grouping:'grouped',align}));
 if(item.id==='account-flow'&&section==='types')return [...['invitation','workspace','preferences','team'].map(onboardingStep=>example(titleCase(onboardingStep),{variant:'onboarding',onboardingStep})),example('Session',{variant:'session'}),example('Directory',{variant:'directory'})];
 if(item.id==='settings-layout'&&section==='types')return [example('Preferences',{variant:'basic'}),example('Fund definition',{variant:'settings',settingKind:'definition'}),example('Account',{variant:'settings',settingKind:'account'}),example('Scheduling',{variant:'settings',settingKind:'scheduling'}),example('Invitations',{variant:'invitations'}),example('Team',{variant:'management',managementKind:'team'}),example('API keys',{variant:'management',managementKind:'keys'})];
 if(item.id==='file-upload'&&section==='types')return [example('File upload',{variant:'upload'}),example('Workspace logo',{variant:'logo-upload'}),...['text','image','pdf','unsupported','unavailable'].map(fileKind=>example(titleCase(fileKind),{variant:'preview',fileKind}))];
 if(item.id==='modal'&&section==='types')return [...['invite','fund','key','role'].map(dialogKind=>example(titleCase(dialogKind)+' form',{variant:'form-dialog',dialogKind})),example('Basic',{variant:'basic'}),example('Change decision',{variant:'decision',decisionKind:'choices'}),example('Decision reason',{variant:'decision',decisionKind:'reason'}),example('Scheduling',{variant:'decision',decisionKind:'scheduling'})];
 if(item.id==='badge'&&section==='types')return [
  ...['soft','outline','solid'].map(variant=>example(titleCase(variant),{variant})),
  example('Category · compact',{variant:'category',categorySize:'sm',tone:'blue',label:'Series A'}),example('Category · default',{variant:'category',categorySize:'md',tone:'success',label:'Live'}),
  example('Status · neutral',{variant:'status-neutral',tone:'success',indicator:'dot',label:'Recommended'}),
  example('Status · subtle',{variant:'status-subtle',tone:'success',indicator:'icon',iconName:'check-circle-fill',label:'Interested'})];
 if(item.id==='composer'&&section==='types')return [
  example('Home',{variant:'home'}),example('Conversation',{variant:'conversation'}),
  example('Company mention',{variant:'home',mention:'company'}),example('List mention',{variant:'conversation',mention:'list'}),
  example('File attachments',{variant:'home',attachments:'files',value:'Review these materials.'}),
  ...[['web','Web search'],['research','Deep research'],['thinking','Think longer']].map(([mode,label])=>example(label,{variant:'home',mode,value:'Review the available company information.'}))];
 if(item.id==='composer'&&section==='states')return [
  example('Empty',{state:'default',value:''}),example('Ready to send',{state:'default',value:'Find companies that fit my investment thesis.'}),
  example('Response pending',{variant:'conversation',state:'pending',value:'Add a follow-up question.'}),example('Disabled',{state:'disabled',value:'Review these materials.',attachments:'files'})];
 if(item.id==='ai-response'&&section==='types')return [['text','Text with citation'],['table','Company table'],['statistics','Statistics'],['comparison','Score comparison'],['overview','Company overview'],['brief','Diligence brief'],['meeting','Meeting questions'],['revenue','Revenue scenario'],['market','Market sizing']].map(([variant,label])=>example(label,{variant,state:'complete'}));
 if(item.id==='ai-response'&&section==='states')return [example('Plain text',{variant:'text',format:'plain'}),example('Empty response',{variant:'text',format:'empty'}),
  example('Thinking',{state:'thinking',research:false}),example('Research in progress',{state:'thinking',research:true}),
  example('Research complete',{state:'complete',research:true}),example('Without follow-up prompts',{state:'complete',followups:false})];
 if(item.id==='toast'&&section==='types')return ['neutral','blue','success','danger','loading'].map(tone=>example(titleCase(tone),{tone}));
 if(item.id==='toast'&&section==='states')return [example('Single',{count:'1'}),example('Stack',{count:'3'}),example('Without action',{action:false})];
 if(item.id==='command-menu'&&section==='states')return [example('Default',{state:'default'}),example('Empty',{state:'empty'})];
 if(item.id==='popover'&&section==='types')return [example('Guided steps',{variant:'guided',open:true}),example('List membership',{variant:'membership'}),example('Sharing',{variant:'sharing'}),example('Basic',{variant:'basic'}),example('Inline source citation',{variant:'source',citationStyle:'inline'}),example('Source chip',{variant:'source',citationStyle:'chip'})];
 if(item.id==='ai-status'&&section==='types')return [example('Stages',{variant:'stages'}),example('Research activity',{variant:'research',state:'complete',expanded:true,animate:false}),example('Search results',{variant:'search',state:'thinking'})];
 if(item.id==='ai-status'&&section==='states')return [
  ...['Understanding','Exploring','Synthesizing','Complete'].map(step=>example(step,{variant:'stages',step,animate:false})),
  example('Research · in progress',{variant:'research',state:'thinking',expanded:true}),example('Research · complete',{variant:'research',state:'complete',expanded:true,animate:false}),example('Research · collapsed',{variant:'research',state:'complete',expanded:false})];
 if(item.id==='card'&&section==='types')return [...['discover','research','meeting'].map(intent=>example('Prompt · '+titleCase(intent),{variant:'prompt',intent,layout:'single'})),example('Text note',{variant:'note',title:'Research summary',noteKind:'text'}),example('Table note',{variant:'note',title:'Company shortlist',noteKind:'table'}),example('Image note',{variant:'note',title:'Market landscape',noteKind:'image'}),example('Multiple authors',{variant:'note',authors:true}),example('Note stack',{variant:'note',title:'Research summary',stacked:true})];
 if(item.id==='card'&&section==='states')return [example('Prompt · available',{variant:'prompt',intent:'discover',disabled:false}),example('Prompt · disabled',{variant:'prompt',intent:'discover',disabled:true}),example('Single note',{variant:'note',stacked:false}),example('Note stack',{variant:'note',stacked:true})];
 if(item.id==='stats-bar'&&section==='types')return [example('Framed',{framed:true}),example('Open',{framed:false}),example('Values only',{framed:false,details:false})];
 if(item.id==='suggestion'&&section==='types')return [example('Single suggestion',{layout:'single'}),example('Suggestion group',{layout:'group'}),example('Without icon',{layout:'single',icon:false})];
 if(item.id==='suggestion'&&section==='states')return [example('Available',{disabled:false}),example('Disabled',{disabled:true})];
 if(item.id==='filter-bar'&&section==='types')return ['toolbar','filter','sort','search','advanced'].map(variant=>example(titleCase(variant),{variant}));
 if(item.id==='filter-bar'&&section==='states')return [example('All controls',{variant:'toolbar',searchable:true}),example('Filter and sort',{variant:'toolbar',searchable:false})];
 if(item.id==='information-block'&&section==='types')return [
  ...[['overview','Overview'],['stacked','Stacked information'],['table','Table block'],['list','List block'],['text','Text block']].map(([variant,title])=>example(title,{variant,title})),
  example('Comparison · without heading',{variant:'comparison',heading:false}),example('Comparison · with heading',{variant:'comparison',heading:true,title:'Comparison'}),
  example('Evidence',{variant:'evidence',open:true}),example('Questions',{variant:'question',open:false}),example('Founder profiles',{variant:'profile',open:false})];
 if(item.id==='information-block'&&section==='states')return [
  example('List · divided',{variant:'list',divided:true}),example('List · plain',{variant:'list',divided:false}),example('List · with row labels',{variant:'list',labels:true}),
  example('Evidence · verified',{variant:'evidence',status:'verified',open:true}),example('Evidence · pending',{variant:'evidence',status:'pending',open:true}),example('Evidence · collapsed',{variant:'evidence',open:false}),
  example('Question · answered',{variant:'question',status:'verified',open:false}),example('Question · awaiting answer',{variant:'question',status:'pending',open:false}),example('Question · expanded context',{variant:'question',open:true}),
  example('Founders · expanded',{variant:'profile',open:true}),example('Founders · collapsed',{variant:'profile',open:false})];
 if(item.id==='metric-card'&&section==='types')return ['metrics','highlights','score'].map(variant=>example(titleCase(variant),{variant}));
 if(item.id==='metric-card'&&section==='states')return [example('Two columns',{variant:'metrics',columns:'2'}),example('Without supporting detail',{variant:'metrics',footer:false}),example('Highlights',{variant:'highlights'}),... [35,64,84].map(value=>example('Score · '+value,{variant:'score',value}))];
 if(item.id==='timeline'&&section==='types')return ['experience','education'].map(content=>example(titleCase(content),{content}));
 if(item.id==='data-table'&&section==='types')return [...['overview','financial','team','problem'].map(columnSet=>example('Chat · '+titleCase(columnSet),{variant:'chat',columnSet})),example('Inbox',{variant:'inbox',selectable:true})];
 if(item.id==='data-table'&&section==='states')return [example('Chat',{variant:'chat'}),example('Chat · row selection',{variant:'chat',selectable:true}),example('Inbox · row selection',{variant:'inbox',selectable:true}),example('Inbox · without selection',{variant:'inbox',selectable:false})];
 if(item.id==='button'&&section==='icon-buttons')return [
  ...['secondary','primary','ghost','destructive'].map(variant=>family('icon-button',titleCase(variant),{variant,iconName:variant==='destructive'?'trash':'plus',label:variant==='destructive'?'Delete item':'Add item'})),
  ...['sm','lg'].map(size=>family('icon-button',size==='sm'?'Small':'Large',{size})),
  ...['loading','disabled'].map(state=>family('icon-button',titleCase(state),{state}))];
 if(item.id==='button'&&section==='link-buttons')return [
  ...['default','hover','focus','disabled'].map(state=>family('link',titleCase(state),{state})),
  family('link','Leading icon',{icon:'leading'}),family('link','Trailing icon',{icon:'trailing'}),family('link','External icon',{external:true})];
 if(item.id==='button'&&section==='button-groups')return [
  ...[['selection','List / grid view'],['actions','Record actions'],['icons','Canvas zoom · horizontal']].map(([variant,label])=>family('button-group',label,{variant})),
  ...['sm','lg'].map(size=>family('button-group',size==='sm'?'Small':'Large',{size})),
  family('button-group','Canvas zoom · vertical',{variant:'icons',orientation:'vertical'}),family('button-group','Disabled',{disabled:true})];
 if(item.id==='avatar-group'&&section==='count')return [
  {label:'No count',config:{...defaults,overflow:0}},
  {label:'Additional people',config:{...defaults,countStyle:'number',overflow:3}},
  {label:'Count with icon',config:{...defaults,countStyle:'icon',overflow:3}}];
 if(['avatar','avatar-group'].includes(item.id)&&section==='colors')return item.controls.find(c=>c.key==='tone').options.flatMap(tone=>['text','placeholder'].map(variant=>({label:titleCase(tone)+' · '+titleCase(variant),config:{...defaults,tone,variant}})));
 if(item.id==='combobox'&&section==='states')return ['single','multiple'].flatMap(variant=>[...['default','focus','invalid'].map(state=>({label:titleCase(variant)+' · '+titleCase(state),config:{...defaults,variant,state}})),{label:titleCase(variant)+' · Disabled',config:{...defaults,variant,disabled:true}}]);
 if(item.id==='checkbox'&&section==='states')return [
  {label:'Unchecked',config:{...defaults,checked:false,indeterminate:false}},
  {label:'Checked',config:{...defaults,checked:true,indeterminate:false}},
  {label:'Indeterminate',config:{...defaults,checked:false,indeterminate:true}},
  {label:'Disabled · unchecked',config:{...defaults,checked:false,indeterminate:false,disabled:true}},
  {label:'Disabled · checked',config:{...defaults,checked:true,indeterminate:false,disabled:true}}];
 if(item.id==='switch'&&section==='states')return [
  {label:'Off',config:{...defaults,checked:false}},{label:'On',config:{...defaults,checked:true}},
  {label:'Disabled · off',config:{...defaults,checked:false,disabled:true}},{label:'Disabled · on',config:{...defaults,checked:true,disabled:true}}];
 let control=item.controls.find(c=>c.key===keys[section]);
 if(section==='states'&&!control&&item.id==='ai-status')control=item.controls.find(c=>c.key==='step');
 if(item.id==='accordion'&&section==='types')return control.options.map(variant=>({label:titleCase(variant),config:{...defaults,variant,indicator:variant==='setup'?'chevron':defaults.indicator}}));
 if(control?.options.length)return control.options.map(v=>({label:titleCase(v),config:{...defaults,[control.key]:v}}));
 if(section==='states')return [{label:'Default',config:defaults},...item.controls.filter(c=>c.type==='toggle').map(c=>({label:c.label+' · '+(!defaults[c.key]?'on':'off'),config:{...defaults,[c.key]:!defaults[c.key]}}))];
 return [];
}
function renderDetail(item,{preserveFrame=false}={}){
 clearConfigurationControls();F.clearPreviews();
 const overview=routeSection==='overview',matrix=routeSection==='all-states'?F.variantMatrix(item):null,entries=overview?[]:matrix?matrix.entries:variantConfigs(item,routeSection);
 const specimens=entries.map(v=>({...v,markup:v.markup??F.preview(F.byId[v.itemId]||item,v.config)}));
 const sectionLabel=item.sections.find(([,slug])=>slug===routeSection)?.[0]||titleCase(routeSection);
 const variants=matrix?matrix.html:`<section class="variants-section"><div class="section-title"><h2>${E(sectionLabel)}</h2><small>${entries.length} variations</small></div><div class="variant-grid ${item.group==='Motion'||routeSection==='button-groups'?'variant-grid-wide':''} ${['composer','ai-response','information-block','metric-card','timeline','data-table','card','conversation','evidence-trace','account-flow','settings-layout','form-layout','navigation'].includes(item.id)?'variant-grid-source':''}">${specimens.map((v,n)=>`<div class="variant-tile"><div class="pp-theme variant-preview ${v.config.playing===false?'preview-paused':''}" data-variant-index="${n}" style="--speed:${parseFloat(v.config.speed)||1}">${v.markup}</div><span>${E(v.label)}</span></div>`).join('')}</div></section>`;
 const playground=`<section class="preview-frame"><div class="preview-toolbar"><span>PREVIEW</span><div><button class="quiet-button" id="preview-reset">${I('reset',13)} Reset</button>${item.group==='Motion'?`<button class="quiet-button" id="replay">${I('play',13)} Replay</button>`:''}<span class="preview-theme">Light</span></div></div><div id="live-preview" class="pp-theme preview-canvas"></div></section>${item.controls.length?`<section class="configuration"><div class="section-title"><h2>Configuration</h2><span class="micro-label">LIVE CONTROLS</span></div><div class="config-grid">${controlsHTML(item)}</div></section>`:''}`;
 const bodyHTML=`${overview?playground:variants}<section class="primitives-section"><div class="section-title"><h2>Tokens used <span id="token-count" class="count-badge"></span></h2><span class="micro-label">CORE REFERENCES</span></div><div id="token-list"></div></section><section class="composition" id="composition" hidden></section><details class="construction"><summary>${I('code',15)}Construction ${I('down',13)}</summary><div class="code-toolbar"><span>HTML</span><button class="quiet-button" id="copy-source">${I('copy',13)} Copy</button></div><pre id="source-code"></pre></details>`;
 const existingBody=preserveFrame?main.querySelector('#detail-body'):null;
 if(existingBody)existingBody.innerHTML=bodyHTML;
 else main.innerHTML=heading(item.name,item.group.toUpperCase())+`<div class="review-detail-row"><div class="detail-tabs">${item.sections.map(([label,slug])=>`<a href="#${item.id}/${slug}">${label}</a>`).join('')}</div>${F.reviewToolbar?.()||''}</div><div id="detail-body">${bodyHTML}</div>`;
 main.querySelectorAll('.detail-tabs a').forEach(link=>{const selected=link.getAttribute('href')==='#'+item.id+'/'+routeSection;link.classList.toggle('active',selected);if(selected)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
 const showComposition=examples=>{
  const parts=[...new Set(examples.flatMap(v=>F.componentParts(F.byId[v.itemId]||item,v.config)))],section=main.querySelector('#composition');
  section.hidden=!parts.length;section.innerHTML=parts.length?`<div class="section-title"><h2>Composition</h2></div><div class="part-links">${parts.map(id=>`<a href="${F.pageHref(id)}">${I(iconFor(F.byId[id]?.group),14)}${F.byId[id]?.name||id}<small>${F.byId[id]?.group||'Atom'}</small></a>`).join('')}</div>`:'';
 };
 const showSource=source=>{document.querySelector('#source-code').textContent=source;document.querySelector('#copy-source').onclick=()=>F.copy(source);};
 if(!overview){
  main.querySelectorAll('[data-variant-index]').forEach(el=>{const entry=entries[Number(el.dataset.variantIndex)];F.wirePreview(el,F.byId[entry.itemId]||item,entry.config,entry.label);});
  renderInspector([...new Set(entries.flatMap(v=>F.componentTokens(F.byId[v.itemId]||item,v.config,usedTokens)))]);
  showComposition(entries);showSource(specimens.map(v=>v.markup).join('\n\n'));bindCopy();return;
 }
 const preview=document.querySelector('#live-preview');
 function update({cleanup=true}={}){updateControlVisibility(item);if(cleanup)F.clearPreviews();preview.classList.toggle('preview-paused',F.config.playing===false);preview.style.setProperty('--speed',parseFloat(F.config.speed)||1);preview.innerHTML=F.preview(item,F.config);F.wirePreview(preview,item,F.config);renderInspector();showComposition([{config:F.config}]);showSource(preview.innerHTML);}
 main.querySelectorAll('[data-config]').forEach(input=>input.addEventListener(input.type==='text'||input.type==='range'?'input':'change',()=>{F.config[input.dataset.config]=input.type==='checkbox'?input.checked:input.type==='range'?Number(input.value):input.value;if(input.type==='range')input.parentElement.querySelector('output').textContent=input.value;update();syncConfigurationURL();}));
 document.querySelector('#preview-reset').onclick=()=>{F.config=F.defaults(item);syncConfigurationURL();renderDetail(item,{preserveFrame:true});};document.querySelector('#replay')?.addEventListener('click',update);update({cleanup:false});F.configurationCleanup=F.enhanceSelects(main.querySelector('.configuration')||main);bindCopy();
}
function syncConfigurationURL(){const values=new URLSearchParams();const defs=F.defaults(F.current);for(const [k,v]of Object.entries(F.config))if(v!==defs[k])values.set(k,v);history.replaceState(null,'','#'+F.current.id+'/'+routeSection+(values.size?'?'+values:''));}
function route(){
 cancelScheduledRoute();
 const previous=F.current?.id||'all',original=location.hash.slice(1),[path,oldQuery]=original.split('?'),[requestedId,requestedSection]=path.split('/'),{id,section,query}=F.migrateRoute(requestedId,requestedSection||'overview',oldQuery||''),canonical=id==='all'?'all':id+'/'+section+(query?'?'+query:'');
 const sameComponent=previous===id&&id!=='all',samePalette=['colors','semantic-tokens'].includes(previous)&&['colors','semantic-tokens'].includes(id),sameFrame=sameComponent||samePalette,tabsTop=sameFrame?main.querySelector(samePalette?'.foundation-tabs':'.detail-tabs')?.getBoundingClientRect().top:undefined,oldScroll=window.scrollY;
 if(canonical!==original)history.replaceState(null,'','#'+canonical);routeSection=section||'overview';F.current=F.byId[id];
 if(F.current?.hidden){F.current=null;category='All';searchTerm='';search.value='';history.replaceState(null,'','#all');}
 if(!F.current){renderCatalogue();F.reviewStudio?.pageChanged();setMenuOpen(false);if(previous!=='all')window.scrollTo({top:0,left:0,behavior:'instant'});return;}
 if(!sameComponent)F.clearCovers();
 const item=F.current;if(!item.sections.some(x=>x[1]===routeSection))routeSection='overview';F.config=F.defaults(item);const params=new URLSearchParams(query||'');for(const ctl of item.controls){if(!params.has(ctl.key))continue;const val=params.get(ctl.key);if(ctl.type==='select'&&!ctl.options.includes(val))continue;F.config[ctl.key]=ctl.type==='toggle'?val==='true':ctl.type==='range'?Math.max(ctl.key==='rows'?2:ctl.key==='page'||ctl.key==='count'?1:0,Math.min(ctl.key==='rows'?10:ctl.key==='page'?5:ctl.key==='count'?8:100,Number(val)||0)):val.slice(0,600);}
 document.title=item.name+' — Pitch Protocol';if(!sameComponent)document.querySelector('#breadcrumbs').innerHTML=`Pitch Protocol <span>/</span> ${item.group} <span>/</span> <b>${item.name}</b>`;
 if(item.group==='Foundations')foundation(item,{preserveTabs:samePalette});else renderDetail(item,{preserveFrame:sameComponent});renderNav();setMenuOpen(false);F.reviewStudio?.pageChanged();
 if(!sameFrame)window.scrollTo({top:0,left:0,behavior:'instant'});
 else if(Number.isFinite(tabsTop)&&(tabsTop<0||tabsTop>window.innerHeight))window.scrollTo({top:Math.max(0,oldScroll+tabsTop-16),left:0,behavior:'instant'});
}
function cancelScheduledRoute(){if(routeFrame){cancelAnimationFrame(routeFrame);routeFrame=0;}}
function scheduleRoute(){cancelScheduledRoute();routeFrame=requestAnimationFrame(()=>{routeFrame=0;route();});}
window.addEventListener('hashchange',scheduleRoute);
window.addEventListener('pagehide',cancelScheduledRoute);
window.addEventListener('pageshow',event=>{if(event.persisted)scheduleRoute();});
document.querySelector('.skip').addEventListener('click',e=>{e.preventDefault();main.focus();main.scrollIntoView({block:'start'});});
nav.addEventListener('click',e=>{if(e.target.closest('a'))setMenuOpen(false);});
search.addEventListener('input',()=>{searchTerm=search.value.toLowerCase().trim();category='All';if(location.hash&&location.hash!=='#all')history.replaceState(null,'','#all');renderCatalogue();});
document.addEventListener('keydown',e=>{if(!e.defaultPrevented&&e.key==='Escape'){if(document.querySelector('.project-menu'))closeProjects(true);else setMenuOpen(false);}});
function setMenuOpen(open){
 const sidebar=document.querySelector('#sidebar'),mobile=document.querySelector('.mobile-menu'),scrim=document.querySelector('.sidebar-scrim'),compact=matchMedia('(max-width:850px)').matches;
 const closingFocus=!open&&compact&&sidebar.contains(document.activeElement);
 document.body.classList.toggle('menu-open',open);mobile.setAttribute('aria-expanded',String(open));sidebar.inert=compact&&!open;document.querySelector('.workspace').inert=compact&&open;scrim.hidden=!open||!compact;
 if(closingFocus)mobile.focus();
}
document.querySelector('.sidebar-scrim').onclick=()=>setMenuOpen(false);
document.querySelector('.rail-item.selected').addEventListener('click',()=>setMenuOpen(false));
matchMedia('(max-width:850px)').addEventListener('change',()=>setMenuOpen(false));

document.querySelector('.mobile-menu').innerHTML=I('menu',18);document.querySelector('.mobile-menu').onclick=()=>{const open=!document.body.classList.contains('menu-open');setMenuOpen(open);if(open)search.focus();};
const motionButton=document.querySelector('#motion-toggle');function syncMotion(){document.body.classList.toggle('motion-paused',F.paused);motionButton.innerHTML=I(F.paused?'play':'pause',16);motionButton.setAttribute('aria-label','Pause animations');motionButton.title=F.paused?'Play animations':'Pause animations';motionButton.setAttribute('aria-pressed',String(F.paused));F.syncCoverMotion();}motionButton.onclick=()=>{F.paused=!F.paused;try{localStorage.setItem('forma-motion',F.paused?'paused':'playing');}catch{}syncMotion();};syncMotion();
const projectTrigger=document.querySelector('#project-picker');
function closeProjects(restoreFocus=false){document.querySelector('.project-menu')?.remove();projectTrigger.setAttribute('aria-expanded','false');if(restoreFocus)projectTrigger.focus();}
projectTrigger.onclick=()=>{if(document.querySelector('.project-menu')){closeProjects();return;}const menu=document.createElement('div');menu.id='project-menu';menu.className='project-menu';menu.setAttribute('aria-label','Projects');menu.innerHTML=`<span>PROJECTS</span><button type="button" aria-label="Pitch Protocol, current project">${I('check',14)}Pitch Protocol<small>Current</small></button>`;projectTrigger.after(menu);projectTrigger.setAttribute('aria-expanded','true');const current=menu.querySelector('button');current.onclick=()=>closeProjects(true);current.focus();};
document.querySelector('.project-header').addEventListener('focusout',e=>{if(!e.currentTarget.contains(e.relatedTarget))closeProjects();});
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.project-menu')&&!e.target.closest('#project-picker')){document.querySelector('.project-menu')?.remove();document.querySelector('#project-picker').setAttribute('aria-expanded','false');}});
F.mountReviewStudio?.();route();setMenuOpen(false);
if(document.modelContext?.registerTool){const lifecycle=new AbortController();const register=tool=>{try{Promise.resolve(document.modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}};register({name:'list_design_components',description:'List component names, categories and exact IDs in this design system.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({project:'Pitch Protocol',components:F.visibleItems().map(({id,name,group})=>({id,name,group}))})});register({name:'open_design_component',description:'Navigate to a component and show its interactive preview.',inputSchema:{type:'object',properties:{id:{type:'string'}},required:['id'],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>{if(!input||!F.isPageVisible(input.id))throw Error('Unknown component');history.replaceState(null,'','#'+input.id);route();return {id:F.current.id,configuration:F.config};}});register({name:'configure_design_preview',description:'Change valid preview configuration values without changing source tokens.',inputSchema:{type:'object',properties:{values:{type:'object'}},required:['values'],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>{if(!F.current||F.current.group==='Foundations')throw Error('Open a component first');if(!input?.values||Array.isArray(input.values)||typeof input.values!=='object')throw Error('Expected values object');const next={...F.config};for(const [k,v]of Object.entries(input.values)){const ctl=F.current.controls.find(c=>c.key===k);if(!ctl)throw Error('Unknown control: '+k);if(ctl.type==='select'&&!ctl.options.includes(v)||ctl.type==='toggle'&&typeof v!=='boolean'||ctl.type==='text'&&(typeof v!=='string'||v.length>600)||ctl.type==='range'&&(typeof v!=='number'||!Number.isFinite(v)||v<0||v>100))throw Error('Invalid value for '+k);next[k]=v;}F.config=next;syncConfigurationURL();renderDetail(F.current,{preserveFrame:true});return {id:F.current.id,configuration:F.config};}});window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}
