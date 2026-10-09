/* Bounded visual comparisons of supported component configurations.
   Rendering and interaction remain owned by the same preview components. */
(function(F){
 'use strict';
 const E=F.escape;
 const title=value=>({sm:'Small',md:'Medium',lg:'Large',none:'Plain',only:'Icon only',readonly:'Read only'}[value]||String(value).replaceAll('-',' ').replace(/\b\w/g,c=>c.toUpperCase()));
 const choice=(label,config={},itemId)=>({label,config,itemId});
 const axis=(key,values)=>values.map(value=>choice(title(value),{[key]:value}));
 const keyOf=(itemId,config)=>itemId+':'+JSON.stringify(Object.fromEntries(Object.entries(config).sort(([a],[b])=>a.localeCompare(b))));
 const compactBlocks=new Set(['avatar-group']);
 const fields=new Set(['input','textarea','field','select','combobox','multiselect','radio','date-picker','slider','progress']);
 const wide=new Set(['dropdown','tooltip','popover','tabs','breadcrumb','pagination','alert','button-group']);
 const excludedAxes=new Set(['inputType','value']);
 const booleanAxes=controls=>controls.map(control=>axis(control.key,[false,true]).map(entry=>({...entry,label:control.label+' · '+(entry.config[control.key]?'on':'off')})));
 const product=axes=>axes.reduce((all,values)=>all.flatMap(a=>values.map(b=>choice([a.label,b.label].filter(Boolean).join(' · '),{...a.config,...b.config}))),[choice('',{})]);
 F.variantMatrix=item=>{
  const entries=[],sections=[],seen=new Set(),defaults=F.defaults(item);
  const options=(key,id=item.id)=>F.byId[id].controls.find(control=>control.key===key)?.options||[];
  const configuration=(id,values)=>({...F.defaults(F.byId[id]),...values});
  const unseen=(id,values)=>!seen.has(keyOf(id,configuration(id,values)));
  const density=id=>fields.has(id)?'field':wide.has(id)||(['Blocks','Templates','Motion'].includes(F.byId[id].group)&&!compactBlocks.has(id))?'wide':'compact';
  const cell=(id,values)=>{
   const config=configuration(id,values),key=keyOf(id,config);
   if(seen.has(key))return '<td class="matrix-repeat" aria-label="Already shown">—</td>';
   seen.add(key);const index=entries.length,markup=F.preview(F.byId[id],config);
   entries.push({itemId:id,config,markup});
   return `<td><div class="pp-theme variant-matrix-cell ${config.playing===false?'preview-paused':''}" data-variant-index="${index}" style="--speed:${parseFloat(config.speed)||1}">${markup}</div></td>`;
  };
  const table=(label,rows,columns,{itemId=item.id,base={},rowLabel='Variant',groups=[],size=density(itemId)}={})=>{
   if(!rows.length||!columns.length)return;
   const grouped=groups.length?`<tr><th scope="col" rowspan="2">${E(rowLabel)}</th>${groups.map(group=>`<th scope="colgroup" colspan="${group.span}">${E(group.label)}</th>`).join('')}</tr><tr>${columns.map(column=>`<th scope="col">${E(column.label)}</th>`).join('')}</tr>`:`<tr><th scope="col">${E(rowLabel)}</th>${columns.map(column=>`<th scope="col">${E(column.label)}</th>`).join('')}</tr>`;
   sections.push(`<section class="matrix-section matrix-size-${size}" data-component="${E(itemId)}"><h3>${E(label)}</h3><div class="matrix-scroll" role="region" aria-label="${E(item.name+' · '+label)}" tabindex="0"><table class="variant-matrix-table"><thead>${grouped}</thead><tbody>${rows.map(row=>`<tr><th scope="row">${E(row.label)}</th>${columns.map(column=>cell(column.itemId||row.itemId||itemId,{...base,...row.config,...column.config})).join('')}</tr>`).join('')}</tbody></table></div></section>`);
  };
  const list=(label,examples,{itemId=item.id,size=density(itemId)}={})=>{
   const unique=examples.filter(example=>unseen(example.itemId||itemId,example.config));
   table(label,unique,[choice('Preview')],{itemId,rowLabel:'Configuration',size});
  };
  const buttonGroups=()=>{
   table('Button groups',options('variant','button-group').map(variant=>choice({selection:'List / grid view',actions:'Record actions',icons:'Canvas zoom'}[variant],{variant})),axis('size',options('size','button-group')),{itemId:'button-group',size:'field',rowLabel:'Type'});
   list('Group options',[
    ...options('selected','button-group').filter(value=>value!==F.defaults(F.byId['button-group']).selected).map(selected=>choice('Selected · '+selected,{selected})),
    choice('Canvas zoom · vertical',{variant:'icons',orientation:'vertical'}),choice('Disabled',{disabled:true})
   ],{itemId:'button-group',size:'field'});
  };
  const links=()=>{
   table('Link buttons',axis('size',options('size','link')),[...axis('icon',options('icon','link')),choice('External icon',{external:true})],{itemId:'link',rowLabel:'Size'});
   list('Link states',options('state','link').filter(state=>state!=='default').map(state=>choice(title(state),{state})),{itemId:'link'});
  };
  switch(item.id){
   case 'navigation':list('Navigation',[choice('Expanded',{collapsed:false}),choice('Collapsed',{collapsed:true})]);break;
   case 'conversation':
    table('Single bubbles',axis('appearance',options('appearance')),axis('align',options('align')),{base:{grouping:'single'},rowLabel:'Appearance',size:'wide'});
    list('Consecutive bubbles',options('align').map(align=>choice(title(align),{appearance:'secondary',align,grouping:'grouped'})),{size:'wide'});break;
   case 'evidence-trace':list('Trace patterns',axis('variant',options('variant')));list('Confidence',['high','low'].map(confidence=>choice(title(confidence),{variant:'confidence',confidence})));list('Source availability',['available','pending','missing'].map(sourceState=>choice(title(sourceState),{variant:'sources',sourceState})));list('Trace states',[choice('Collapsed',{expanded:false}),choice('Selected',{selected:true}),choice('Selected map',{variant:'map',selected:true})]);break;
   case 'account-flow':list('Onboarding',options('onboardingStep').map(onboardingStep=>choice(title(onboardingStep),{onboardingStep})));list('Access',[choice('Session',{variant:'session'}),choice('Directory',{variant:'directory'})]);break;
   case 'settings-layout':list('Settings',[choice('Preferences',{variant:'basic'}),choice('Fund definition',{variant:'settings'}),choice('Account',{variant:'settings',settingKind:'account'}),choice('Scheduling',{variant:'settings',settingKind:'scheduling'}),choice('Invitations',{variant:'invitations'}),choice('Team',{variant:'management'}),choice('API keys',{variant:'management',managementKind:'keys'})]);break;
   case 'form-layout':list('Forms',axis('variant',options('variant')));list('Layout',[choice('Single column',{columns:'1'})]);break;
   case 'date-picker':list('Calendar',[choice('Single date',{variant:'single'}),choice('Date range',{variant:'range'}),choice('Presets',{variant:'range',presets:true}),choice('Popover',{display:'popover'}),choice('Disabled',{disabled:true}),choice('Without footer',{footer:false})],{size:'wide'});break;
   case 'file-upload':list('Workspace logo',[choice('Logo upload',{variant:'logo-upload'})]);list('Upload',[choice('Multiple files'),choice('Single file',{multiple:false}),choice('Selected files',{state:'selected'}),choice('File error',{state:'error'}),choice('Disabled',{disabled:true})]);list('File previews',options('fileKind').map(fileKind=>choice(title(fileKind),{variant:'preview',fileKind})));break;
   case 'pagination':list('Pagination',[choice('First page',{page:1}),choice('Middle page',{page:3}),choice('Last page',{page:5}),choice('Compact',{compact:true,page:2}),choice('Long range',{page:8,total:16})]);break;
   case 'stepper':list('Steppers',[choice('Horizontal',{variant:'numbered'}),choice('Vertical',{variant:'numbered',orientation:'vertical'}),choice('Dots',{variant:'dots'}),choice('Small dots',{variant:'dots',dotSize:'xs'}),...options('step').filter(step=>step!=='Preferences').map(step=>choice(step,{step})),choice('Disabled',{disabled:true})]);break;
   case 'drawer':list('Drawer',[choice('Details',{variant:'details'}),choice('Edit form',{variant:'form'}),choice('Left side',{side:'left'}),choice('No footer',{footer:false}),choice('Wide',{size:'lg'})],{size:'wide'});break;
   case 'modal':list('Forms',['invite','fund','key','role'].map(dialogKind=>choice(title(dialogKind),{variant:'form-dialog',dialogKind})));list('Decision choices',[choice('Change decision',{variant:'decision',decisionKind:'choices'})]);list('Modal',[...axis('size',options('size')),choice('No footer',{footer:false})]);list('Decisions',[choice('Reason',{variant:'decision'}),choice('Destructive',{variant:'decision',destructive:true}),choice('Scheduling',{variant:'decision',decisionKind:'scheduling'})]);break;

   case 'tag':list('Tag appearances',options('variant').map(variant=>choice(title(variant),{variant})));list('Tag sizes',options('size').filter(size=>size!=='md').map(size=>choice(title(size),{size})));list('Tag content',[choice('Leading icon',{icon:true}),choice('Removable',{removable:true}),choice('Disabled',{removable:true,disabled:true}),choice('Blue label',{tone:'blue'})]);break;
   case 'badge':{
    list('Icon status badges',Object.keys(F.statusOptions).map(status=>choice(F.statusOptions[status][0],{variant:'status',status})));
    const appearances=options('variant').filter(variant=>variant!=='category'&&variant!=='status'&&!variant.startsWith('status-')),statuses=options('variant').filter(variant=>variant.startsWith('status-')),indicators=options('indicator');
    const rows=[...axis('tone',options('tone')),...(options('state').includes('inactive')?[choice('Inactive',{tone:'neutral',state:'inactive'})]:[])];
    const indicatorLabel=indicator=>({'none':'Plain','dot':'Dot','icon':'Leading icon','icon-trailing':'Trailing icon','icon-only':'Icon only'}[indicator]||title(indicator));
    for(const size of options('size'))table(title(size),rows,appearances.flatMap(variant=>indicators.map(indicator=>choice(indicatorLabel(indicator),{variant,indicator}))),{
     base:{size},rowLabel:'Color',groups:appearances.map(variant=>({label:title(variant),span:indicators.length}))
    });
    table('Status badges',rows,statuses.flatMap(variant=>indicators.map(indicator=>choice(indicatorLabel(indicator),{variant,indicator}))),{
     base:{size:'md',iconName:'check-circle-fill'},rowLabel:'Color',groups:statuses.map(variant=>({label:title(variant),span:indicators.length}))
    });
    for(const categorySize of ['sm','md'])table('Category · '+title(categorySize),rows,indicators.map(indicator=>choice(indicatorLabel(indicator),{indicator})),{base:{variant:'category',categorySize,size:'md'},rowLabel:'Color'});
    break;
   }
   case 'chip':
    for(const size of options('size'))table(title(size)+' chips',axis('tone',options('tone')),options('variant').filter(variant=>variant!=='filter').flatMap(variant=>options('icon').map(icon=>choice(icon==='none'?'Plain':'Leading icon',{variant,icon}))),{
     base:{size},rowLabel:'Color',groups:options('variant').filter(variant=>variant!=='filter').map(variant=>({label:title(variant),span:options('icon').length}))
    });
    table('Filter chips',axis('tone',options('tone')),axis('icon',options('icon')),{base:{variant:'filter',size:'md'},rowLabel:'Color'});
    list('Selection and disabled states',[
     choice('Unselected',{variant:'selectable',selected:false}),
     choice('Disabled · removable',{variant:'removable',disabled:true}),
     choice('Disabled · selected',{variant:'selectable',selected:true,disabled:true}),
     choice('Disabled · unselected',{variant:'selectable',selected:false,disabled:true})
    ]);
    break;
   case 'button':
    for(const size of options('size'))table(title(size)+' buttons',axis('variant',options('variant').filter(variant=>variant!=='link')),axis('icon',options('icon')),{base:{size},rowLabel:'Type'});
    table('Button states',[choice('Primary')],axis('state',options('state').filter(state=>state!=='default')),{rowLabel:'Type'});
    links();buttonGroups();break;
   case 'link':links();break;
   case 'button-group':buttonGroups();break;
   case 'input':
    for(const size of options('size'))table(title(size)+' inputs',axis('state',options('state')),axis('icon',options('icon')),{base:{size},rowLabel:'State'});
    break;
   case 'textarea':case 'field':case 'select':
    table('Sizes and states',axis('state',options('state')),axis('size',options('size')),{rowLabel:'State'});
    if(item.id==='textarea')list('Resize',[choice('Fixed height',{resize:false})]);
    if(item.id==='select')list('Leading icon',[choice('With icon',{icon:'leading',value:'Design'})]);
    if(item.id==='field')list('Label options',[choice('Optional',{required:false}),choice('Without helper',{helper:''})]);
    break;
   case 'combobox':
    for(const variant of options('variant'))table(title(variant)+' selection',axis('optionStyle',options('optionStyle')),axis('size',options('size')),{base:{variant},rowLabel:'Options',size:'field'});
    list('Icons and clearing',options('variant').flatMap(variant=>[
     choice(title(variant)+' · leading icon',{variant,icon:'leading',optionStyle:'icons'}),
     choice(title(variant)+' · without clear',{variant,showClear:false})
    ]));
    list('Field states',options('variant').flatMap(variant=>[
     choice(title(variant)+' · focus',{variant,state:'focus'}),
     choice(title(variant)+' · invalid',{variant,state:'invalid'}),
     choice(title(variant)+' · disabled',{variant,disabled:true})
    ]));break;
   case 'checkbox':
    table('Selection states',[
     choice('Unchecked',{checked:false,indeterminate:false}),choice('Checked',{checked:true,indeterminate:false}),choice('Indeterminate',{checked:false,indeterminate:true})
    ],[choice('Enabled',{disabled:false}),choice('Disabled',{disabled:true})],{rowLabel:'Selection',size:'field'});break;
   case 'radio':
    table('Selection states',axis('selected',options('selected')),[choice('Enabled',{disabled:false}),choice('Disabled',{disabled:true})],{rowLabel:'Selected option'});break;
   case 'switch':
    table('Sizes and states',axis('size',options('size')),[choice('Off',{checked:false,disabled:false}),choice('On',{checked:true,disabled:false}),choice('Disabled · off',{checked:false,disabled:true}),choice('Disabled · on',{checked:true,disabled:true})],{rowLabel:'Size',size:'field'});break;
   case 'avatar':
    for(const shape of options('shape'))table(title(shape)+' avatars',axis('size',options('size')),options('variant').flatMap(variant=>options('badge').map(badge=>choice(title(badge),{variant,badge}))),{
     base:{shape},rowLabel:'Size',groups:options('variant').map(variant=>({label:title(variant),span:options('badge').length}))
    });
    table('Initials and placeholder colors',axis('tone',options('tone').filter(tone=>tone!==defaults.tone)),axis('variant',['text','placeholder']),{base:{size:'md',shape:'circle',badge:'none'},rowLabel:'Color'});
    table('Other badge colors',options('badgeTone').filter(badgeTone=>badgeTone!==defaults.badgeTone).map(badgeTone=>choice(title(badgeTone),{badgeTone})),axis('badge',['dot','icon']),{base:{variant:'image',size:'md',shape:'circle'},rowLabel:'Color'});
    break;
   case 'avatar-group':
    for(const variant of options('variant'))table(title(variant)+' groups',axis('size',options('size')),[choice('No count',{overflow:0}),choice('Number',{countStyle:'number',overflow:3}),choice('Icon',{countStyle:'icon',overflow:3})],{base:{variant},rowLabel:'Size',size:'field'});
    list('Initials colors',axis('tone',options('tone').filter(tone=>tone!==defaults.tone)).map(entry=>({...entry,config:{...entry.config,variant:'text'}})),{size:'field'});
    break;
   case 'alert':
    table('Colors and styles',axis('tone',options('tone')),axis('variant',options('variant')),{base:{layout:'inline',action:'link',dismissible:true},rowLabel:'Color'});
    list('Content and actions',[
     choice('Title and description',{variant:'standard',layout:'detailed'}),
     choice('Detailed destructive action',{variant:'soft',layout:'detailed',tone:'danger',action:'button'}),
     choice('Simple icon with link',{variant:'icon',layout:'inline',tone:'blue',action:'link'}),
     choice('Without icon',{variant:'standard',layout:'inline',icon:false}),
     choice('Dismissible',{variant:'standard',layout:'detailed',dismissible:true})
    ]);break;
   case 'accordion':
    table('Styles and content',options('variant').map(variant=>choice(title(variant),{variant,indicator:variant==='setup'?'chevron':defaults.indicator})),axis('content',options('content')),{rowLabel:'Style',size:'wide'});
    list('Interaction options',[
     choice('Closed',{open:false}),choice('Disabled',{disabled:true}),
     choice('Chevron',{indicator:'chevron'}),choice('Without icons',{icon:false}),choice('Multiple open',{multiple:true})
    ],{size:'wide'});break;
   case 'slider':
    table('Single value',[0,25,50,75,100].map(value=>choice(value+'%',{value})),[choice('Plain',{tooltip:false}),choice('Value bubble',{tooltip:true})],{base:{variant:'single'},rowLabel:'Value',size:'field'});
    table('Range',[[0,100],[0,25],[25,50],[50,75],[75,100],[0,50],[25,75],[50,100]].map(([lower,upper])=>choice(lower+'–'+upper,{lower,upper})),[choice('Plain',{tooltip:false}),choice('Value bubbles',{tooltip:true})],{base:{variant:'range'},rowLabel:'Range',size:'field'});
    list('Disabled',[choice('Single',{variant:'single',disabled:true}),choice('Range',{variant:'range',disabled:true})],{size:'field'});break;
   case 'spinner':
    for(const variant of options('variant'))table(title(variant),axis('tone',options('tone')),axis('size',options('size')),{base:{variant},rowLabel:'Color'});
    break;
   case 'composer':
    table('Placement and states',axis('variant',['home','conversation']),axis('state',['default','pending','disabled']),{base:{value:'Find promising seed-stage companies.',mode:'none',attachments:'none'},rowLabel:'Placement',size:'wide'});
    list('Tools, mentions and attachments',[
     ...['web','research','thinking'].map(mode=>choice({web:'Search the web',research:'Deep research',thinking:'Think longer'}[mode],{variant:'conversation',state:'default',mode,value:'Review the available evidence.'})),
     choice('Attached files',{variant:'conversation',attachments:'files',state:'default'}),
     choice('Company mention',{variant:'home',mention:'company',state:'default'}),
     choice('List mention',{variant:'conversation',mention:'list',state:'default'}),
     choice('Company and list',{variant:'home',mention:'both',state:'default'}),
     choice('Empty prompt',{variant:'home',state:'default',value:''}),
     choice('Without glow',{variant:'home',state:'default',glow:false,value:''})
    ],{size:'wide'});break;
   case 'ai-response':
    list('Source content',[choice('Plain response',{variant:'text',format:'plain'}),choice('Empty response',{variant:'text',format:'empty'})]);
    list('Response formats',options('variant').map(variant=>choice(title(variant),{variant,state:'complete',research:false,followups:false})),{size:'wide'});
    list('Response details',[
     choice('Follow-up suggestions',{variant:'text',state:'complete',research:false,followups:true}),
     choice('Research activity',{variant:'text',state:'complete',research:true,followups:false}),
     choice('Thinking',{variant:'text',state:'thinking',research:true,followups:false}),
     choice('Team brief',{variant:'brief',focus:'team',state:'complete',research:false,followups:false})
    ],{size:'wide'});break;
   case 'information-block':
    list('Content layouts',['overview','stacked','table','list','text'].map(variant=>choice(title(variant),{variant})),{size:'wide'});
    list('Comparison',[choice('Without heading',{variant:'comparison',heading:false}),choice('With heading',{variant:'comparison',heading:true,title:'Comparison'})],{size:'wide'});
    list('List options',[choice('Plain list',{variant:'list',divided:false}),choice('Labeled rows',{variant:'list',labels:true,divided:true}),choice('Plain labeled rows',{variant:'list',labels:true,divided:false})],{size:'wide'});
    list('Questions and evidence',[
     choice('Research evidence',{variant:'evidence',status:'verified',open:true,excerpt:true,metrics:true}),
     choice('Evidence awaiting review',{variant:'evidence',status:'pending',open:false,excerpt:false,metrics:false}),
     choice('Answered question',{variant:'question',status:'verified',open:false}),
     choice('Question context',{variant:'question',status:'verified',open:true}),
     choice('Unanswered question',{variant:'question',status:'pending',open:false})
    ],{size:'wide'});
    list('Founder profiles',[choice('Founders',{variant:'profile',avatar:'text',open:false}),choice('Expanded experience',{variant:'profile',content:'experience',avatar:'text',open:true}),choice('Education and portraits',{variant:'profile',content:'education',avatar:'image',open:true})],{size:'wide'});
    list('Supporting information',[
     choice('Simple overview',{variant:'overview',tags:false,callout:false}),choice('Overview with footer',{variant:'overview',footer:true}),
     choice('Stacked with footer',{variant:'stacked',footer:true}),choice('Table with footer',{variant:'table',footer:true}),choice('Table without supporting note',{variant:'table',info:false})
    ],{size:'wide'});break;
   case 'metric-card':
    list('Metrics',[choice('Four columns',{variant:'metrics',columns:'4'}),choice('Two columns',{variant:'metrics',columns:'2'}),choice('Without detail',{variant:'metrics',footer:false}),choice('Highlights',{variant:'highlights'}),choice('Highlights without detail',{variant:'highlights',footer:false})],{size:'wide'});
    list('Score',[... [35,64,84].map(value=>choice('Score '+value,{variant:'score',value})),choice('Score without detail',{variant:'score',footer:false})],{size:'wide'});break;
   case 'timeline':
    list('History',['experience','education'].map(content=>choice(title(content),{content})),{size:'wide'});break;
   case 'card':
    list('Note details',[choice('Image note',{variant:'note',noteKind:'image'}),choice('Multiple authors',{variant:'note',authors:true})]);
    table('Note cards',axis('noteKind',['text','table']),[choice('Single',{stacked:false}),choice('Stacked',{stacked:true})],{base:{variant:'note',title:'Research notes'},rowLabel:'Preview',size:'wide'});
    list('Prompt suggestions',[
     ...['discover','research','meeting'].map(intent=>choice(title(intent),{variant:'prompt',intent,layout:'single'})),
     choice('Suggestion group',{variant:'prompt',intent:'discover',layout:'group'})
    ],{size:'wide'});break;
   case 'stats-bar':
    table('Statistics',[choice('Framed',{framed:true}),choice('Open',{framed:false})],[choice('Supporting labels',{details:true}),choice('Values only',{details:false})],{rowLabel:'Container',size:'wide'});break;
   case 'suggestion':
    table('Suggestion pills',axis('layout',['single','group']),[choice('With icon',{icon:true}),choice('Text only',{icon:false}),choice('Disabled',{icon:true,disabled:true})],{rowLabel:'Layout',size:'wide'});break;
   case 'filter-bar':
    list('Advanced criteria',[choice('Property and value picker',{variant:'advanced'})]);
    list('Reusable controls',options('variant').map(variant=>choice(title(variant),{variant})),{size:'wide'});
    list('Toolbar options',[choice('Without search',{variant:'toolbar',searchable:false})],{size:'wide'});break;
   case 'tabs':
    table('Tabs',axis('variant',['segmented','underline']),axis('active',['Summary','Details']),{rowLabel:'Style',size:'wide'});
    list('Icons and counts',options('countedActive').map(countedActive=>choice(countedActive,{variant:'counted',countedActive})),{size:'wide'});break;
   case 'popover':
    list('Workspace popovers',[choice('Membership',{variant:'membership'}),choice('Membership inline',{variant:'membership',presentation:'inline'}),choice('Empty membership',{variant:'membership',state:'empty'}),choice('Sharing',{variant:'sharing'}),choice('Sharing inline',{variant:'sharing',presentation:'inline'})]);
    list('Popover content',[
     choice('Guided steps',{variant:'guided',open:true}),choice('Last step',{variant:'guided',step:'4',open:true}),choice('Display options',{variant:'basic'}),choice('Inline citation',{variant:'source',citationStyle:'inline'}),choice('Source chip',{variant:'source',citationStyle:'chip'})
    ]);break;
   case 'action-bar':list('Action pills',[choice('Selected rows',{variant:'selection'}),choice('Undo deletion',{variant:'undo'})]);break;
   case 'command-menu':list('Command menu',[choice('Default',{state:'default'}),choice('Empty',{state:'empty'})],{size:'wide'});break;
   case 'toast':list('Stack status',['neutral','blue','success','danger','loading'].map(tone=>choice(title(tone),{tone,count:'3'})));break;
   case 'ai-status':
    list('Search results',[choice('Reading',{variant:'search',state:'thinking'}),choice('Complete',{variant:'search',state:'complete'})],{size:'wide'});
    list('Research stages',[...['calculating','drafting','complete'].map(stage=>choice(title(stage),{variant:'research',stage,animate:false,state:stage==='complete'?'complete':'thinking'})),choice('Sources in popover',{variant:'research',sourceMode:'popover'})]);
    list('Progress stages',options('step').map(step=>choice(step,{variant:'stages',step,animate:false})),{size:'wide'});
    table('Research activity',axis('state',['thinking','complete']),[choice('Collapsed',{expanded:false}),choice('Expanded',{expanded:true})],{base:{variant:'research',animate:false},rowLabel:'State',size:'wide'});
    list('Playback',[

     ...(item.controls.some(control=>control.key==='playing')?[choice('Paused',{variant:'stages',playing:false})]:[])
    ],{size:'wide'});break;
   case 'data-table':
    list('Chat columns',['financial','team','problem'].map(columnSet=>choice(title(columnSet),{variant:'chat',columnSet}))); 
    table('Table layouts',axis('variant',options('variant').filter(variant=>variant!=='inbox')),axis('density',options('density')),{base:{header:true},rowLabel:'Style',size:'wide'});
    list('Table options',[
     choice('Without header',{variant:'chat',header:false}),
     choice('Row selection',{variant:'chat',selectable:true}),
     choice('Inbox',{variant:'inbox',density:'comfortable',selectable:true}),
     choice('Inbox without selection',{variant:'inbox',density:'comfortable',selectable:false})
    ],{size:'wide'});break;
   default:{
    const motion=item.group==='Motion',selects=item.controls.filter(control=>control.type==='select'&&!excludedAxes.has(control.key)&&control.key!=='speed');
    const toggles=item.controls.filter(control=>control.type==='toggle'&&control.key!=='playing');
    const axes=[...selects.map(control=>({key:control.key,label:control.label,values:axis(control.key,control.options)})),...toggles.map((control,index)=>({key:control.key,label:control.label,values:booleanAxes(toggles)[index]}))];
    const primary=axes.shift(),limit=motion?8:16;let columns=[choice('Preview')],rowLabel='Configuration',rows=[choice('Default')];
    if(primary){rows=primary.values;rowLabel=primary.label;let width=1,used=0;for(const next of axes){if(rows.length*width*next.values.length>limit)break;width*=next.values.length;used++;}if(used)columns=product(axes.splice(0,used).map(next=>next.values));}
    table('Configurations',rows,columns,{rowLabel});
    for(const remaining of axes)list(remaining.label,remaining.values.filter(value=>value.config[remaining.key]!==defaults[remaining.key]));
    if(motion){
     const speeds=options('speed').filter(speed=>speed!==defaults.speed).map(speed=>choice(speed,{speed}));
     list('Playback',[...speeds,...(item.controls.some(control=>control.key==='playing')?[choice('Paused',{playing:false})]:[])]);
    }
   }
  }
  return {html:`<section class="variant-matrices" aria-label="${E(item.name)} combinations"><div class="section-title"><h2>All states</h2><small>${entries.length} examples</small></div>${sections.join('')}</section>`,entries};
 };
})(window.Forma);
