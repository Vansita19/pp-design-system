F.groups=['Foundations','Atoms','Molecules','Blocks','Motion','Templates'];
F.control=(key,label,options,defaultValue)=>({key,label,type:Array.isArray(options)?'select':options,options:Array.isArray(options)?options:[],default:defaultValue??(Array.isArray(options)?options[0]:options==='toggle'?false:options==='range'?50:'')});
const C=F.control;
const size=()=>C('size','Size',['sm','md','lg'],'md');
const state=(extra=[])=>C('state','State',['default','hover','focus','disabled',...extra]);
const label=(v='Continue')=>C('label','Label','text',v);
const tone=()=>C('tone','Tone',['neutral','blue','success','warning','danger']);
const field=()=>[size(),state(['readonly','invalid','success']),C('placeholder','Placeholder','text','Enter a value'),C('value','Value','text',''),C('label','Label','text','Label')];
const base=[['Overview','overview'],['Types','types'],['Sizes','sizes'],['States','states']];
const items=[];
function item(id,name,group,controls=[],parts=[],tokens=[],extra={}){items.push({id,name,group,controls,parts,tokens,sections:base,source:'extended',...extra});}
for(const [id,name]of [['colors','Colors'],['semantic-tokens','Semantic tokens'],['typography','Typography'],['spacing','Spacing'],['radius','Corner radius'],['shadows','Shadows'],['icons','Icons'],['borders','Borders'],['grids','Grids & breakpoints'],['motion-tokens','Motion tokens'],['layers','Layers']])item(id,name,'Foundations',[],[],[],{sections:[],hidden:['motion-tokens','layers'].includes(id),source:['colors','semantic-tokens','typography','radius'].includes(id)?'existing':'normalized'});
item('button','Button','Atoms',[C('variant','Type',['primary','secondary','ghost','outline','destructive','success','link']),size(),C('state','State',['default','hover','focus','pressed','disabled','loading','success']),C('icon','Icon',['none','leading','trailing','only']),label()],[],['component.control.radius','component.control.font','component.control.weight','component.button.padding','component.control.gap'],{sections:[...base,['Icon placement','icons'],['Icon buttons','icon-buttons'],['Link buttons','link-buttons'],['Button groups','button-groups']],aliases:['icon button','link','button group'],source:'normalized'});
item('icon-button','Icon button','Atoms',[C('variant','Type',['secondary','primary','ghost','destructive']),size(),state(['loading']),C('iconName','Icon',['plus','settings','download','copy','trash']),label('Add item')],[],['component.control.radius','component.control.font'],{source:'normalized'});
item('input','Input','Atoms',[...field(),C('inputType','Input type',['text','email','password','number']),C('icon','Icon',['none','leading'])],[],['component.input.background','component.input.border','component.input.foreground','component.input.placeholder','component.input.radius','component.input.padding','component.input.font'],{source:'existing'});
item('textarea','Textarea','Atoms',[...field(),C('rows','Rows','range',4),C('resize','Resizable','toggle',true)],[],['component.input.background','component.input.border','component.input.foreground','component.input.placeholder','component.input.radius','component.input.padding','component.input.font'],{source:'existing'});
item('checkbox','Checkbox','Atoms',[label('Accept terms'),C('checked','Checked','toggle',true),C('indeterminate','Indeterminate','toggle',false),C('disabled','Disabled','toggle',false)],[],['semantic.action.primary','semantic.border.strong','radius.xs']);
item('radio','Radio','Atoms',[label('Select an option'),C('selected','Selected option',['Standard','Plus','Enterprise'],'Plus'),C('disabled','Disabled','toggle')],[],['semantic.action.primary','semantic.border.strong','radius.full']);
item('switch','Switch','Atoms',[label('Enable notifications'),C('checked','On','toggle',true),C('disabled','Disabled','toggle'),size()],[],['semantic.action.primary','semantic.surface.subtle','radius.full']);
item('badge','Badge','Atoms',[C('status','Status',['pending','failed','success','progress','review','submitted','expired']),C('statusIcon','Status icon','toggle',true),label('Dynamic'),C('tone','Color',['neutral','blue','success','purple','warning','danger'],'purple'),C('variant','Appearance',['soft','outline','solid','category','status-neutral','status-subtle','status']),C('state','State',['default','inactive']),size(),C('categorySize','Size',['sm','md'],'md'),C('indicator','Indicator',['none','dot','icon','icon-trailing','icon-only']),C('iconName','Icon',['check','bolt','info','check-circle-fill','eye-fill','x-circle-fill'])],[],['component.badge.radius','component.badge.font','component.badge.padding','component.badge.height'],{source:'normalized',aliases:['status pill'],sections:[['Overview','overview'],['Types','types'],['Sizes','sizes'],['Colors','colors'],['Indicators','indicators']]});
item('tag','Tag','Atoms',[label('Overview'),C('variant','Appearance',['raised','outline','subtle']),C('tone','Color',['neutral','blue'],'neutral'),size(),C('icon','Show icon','toggle'),C('removable','Removable','toggle'),C('disabled','Disabled','toggle')],[],[],{source:'existing',aliases:['raised tag','content label'],sections:[['Overview','overview'],['Types','types'],['Sizes','sizes'],['States','states']]});
item('chip','Chip / pill','Atoms',[label('Design'),C('variant','Type',['removable','selectable','static','filter']),C('tone','Color',['neutral','blue','success','purple','warning','danger'],'blue'),size(),C('icon','Icon',['none','leading']),C('selected','Selected','toggle',true),C('disabled','Disabled','toggle')],[],['radius.full'],{aliases:['pill','removable chip','filter chip'],source:'normalized',sections:[['Overview','overview'],['Types','types'],['Sizes','sizes'],['Colors','colors'],['States','states']]} );
item('avatar','Avatar','Atoms',[C('variant','Type',['image','text','placeholder']),C('tone','Color',['neutral','warning','blue','sky','purple','danger','success'],'blue'),C('name','Name','text','Alex Morgan'),C('initials','Initials','text','AM'),C('src','Image URL','text',''),size(),C('shape','Shape',['circle','square']),C('badge','Badge',['none','dot','icon']),C('badgeTone','Badge color',['success','blue','purple','warning','danger','neutral'],'success')],[],['component.avatar.size.md'],{source:'normalized',sections:[['Overview','overview'],['Types','types'],['Sizes','sizes'],['Colors','colors'],['Badges','badges']]} );
item('link','Link button','Atoms',[label('View details'),size(),C('external','External icon','toggle',false),C('icon','Icon',['none','leading','trailing']),state()],[],['semantic.text.link','font.size.14'],{source:'existing'});
item('divider','Divider','Atoms',[C('orientation','Orientation',['horizontal','vertical']),C('label','Label','text','')],[],['semantic.border.default','border.width']);
item('spinner','Spinner','Atoms',[C('variant','Style',['ring','segmented']),size(),tone(),label('Loading')],[],['component.spinner.size.md'],{sections:[['Overview','overview'],['Styles','styles'],['Sizes','sizes']]} );
item('progress','Progress','Atoms',[C('value','Progress','range',64),C('showLabel','Show value','toggle',true),C('label','Label','text',''),tone()],[],['semantic.action.primary','semantic.surface.subtle','radius.full'],{source:'normalized'});
item('skeleton','Skeleton','Atoms',[C('variant','Layout',['text','card','avatar']),C('animated','Animated','toggle',true)],[],['semantic.surface.subtle','radius.md','motion.duration.skeleton']);
item('slider','Slider','Atoms',[C('variant','Type',['single','range']),C('value','Value','range',40),C('lower','Minimum value','range',25),C('upper','Maximum value','range',75),C('showLabel','Show label','toggle',true),C('tooltip','Value bubbles','toggle',false),C('disabled','Disabled','toggle'),label('Volume')],[],['semantic.action.primary','semantic.surface.subtle'],{source:'normalized',sections:[['Overview','overview'],['Types','types'],['States','states']]} );
item('kbd','Keyboard key','Atoms',[C('key','Keys','text','⌘ K'),size()],[],['color.transparent','semantic.border.default','radius.md','font.family.mono']);
item('toggle','Toggle','Atoms',[label('Bold'),C('pressed','Pressed','toggle',true),size(),C('disabled','Disabled','toggle')],['button'],['semantic.surface.subtle','component.control.radius']);
item('field','Form field','Molecules',[...field(),C('helper','Helper text','text','Use your work email.'),C('required','Required','toggle',true)],['input'],['component.input.background','component.input.border','component.input.radius','space.8','font.size.14'],{source:'existing'});
item('select','Select','Molecules',[label('Choose an option'),C('value','Selected',['Choose an option','Design','Engineering','Product']),C('icon','Icon',['none','leading']),size(),state(['invalid'])],['input','button'],['component.input.background','component.input.border','component.input.radius','component.control.font'],{source:'normalized'});
item('combobox','Combobox','Molecules',[C('variant','Type',['single','multiple']),C('placeholder','Placeholder','text','Search frameworks…'),C('icon','Leading icon',['none','leading']),C('optionStyle','Options',['plain','icons','grouped']),C('showClear','Clear button','toggle',true),size(),C('disabled','Disabled','toggle'),C('state','State',['default','focus','invalid'])],['input','button','chip'],['component.select.radius','component.menu.radius'],{source:'improved',sections:[['Overview','overview'],['Types','types'],['Options','options'],['Sizes','sizes'],['States','states']]} );
item('multiselect','Multiselect','Molecules',[C('placeholder','Placeholder','text','Choose skills'),C('disabled','Disabled','toggle')],['input','chip','checkbox'],['component.input.border','component.input.radius','space.8']);
item('dropdown','Dropdown menu','Molecules',[label('Options'),C('variant','Trigger',['secondary','ghost','primary']),C('align','Alignment',['start','end']),C('destructive','Destructive option','toggle',true),C('disabled','Disabled','toggle')],['button'],['component.menu.background','component.menu.radius'],{source:'improved'});
item('tooltip','Tooltip','Molecules',[C('content','Content','text','Copy to clipboard'),C('position','Placement',['top','bottom'])],['icon-button'],['semantic.text.inverse','semantic.text.heading','radius.md','space.8','font.size.12'],{source:'improved'});
item('popover','Popover','Molecules',[C('variant','Type',['guided','basic','source','membership','sharing']),label('Open Popover'),C('title','Title','text','Insert Popover'),C('description','Description','text','Insert popover description here. It would look much better as three lines of text.'),C('step','Step',['1','2','3','4']),C('open','Initially open','toggle',true),C('disabled','Disabled','toggle'),C('citationStyle','Citation',['inline','chip']),C('presentation','Presentation',['popover','inline']),C('state','Content',['default','empty'])],['button','input'],['component.menu.background','component.menu.radius','component.menu.shadow','space.16'],{source:'improved',aliases:['citation','source excerpt']});
item('tabs','Tabs','Molecules',[C('variant','Type',['segmented','underline','counted']),C('active','Selected',['Summary','Details']),C('countedActive','Selected',['All','New','Interested','Watching','Passed','Off-Thesis'])],['button'],['component.tabs.segmented.radius','component.tabs.segmented.shadow'],{source:'existing'});
item('breadcrumb','Breadcrumb','Molecules',[C('depth','Depth',['2','3','4'],'3')],['link'],['semantic.text.secondary','font.size.14','space.8'],{source:'existing'});
item('pagination','Pagination','Molecules',[C('page','Page','range',1),C('compact','Compact','toggle',false)],['button','icon-button'],['component.control.radius','semantic.action.primary','space.4']);
item('alert','Alert','Molecules',[C('variant','Style',['standard','soft','icon']),tone(),C('layout','Layout',['detailed','inline']),C('title','Title','text','Your changes have been saved.'),C('description','Description','text','Everything is up to date. You can continue working.'),C('icon','Show icon','toggle',true),C('action','Action',['none','link','button']),C('actionLabel','Action label','text','View details'),C('dismissible','Dismissible','toggle')],['button'],['component.alert.radius','component.alert.padding'],{source:'normalized',sections:[['Overview','overview'],['Types','types'],['Colors','colors'],['Layouts','layouts'],['Actions','actions']]} );
item('button-group','Button group','Molecules',[C('variant','Type',['selection','actions','icons']),C('selected','Selected',['List','Grid'],'Grid'),size(),C('orientation','Orientation',['horizontal','vertical']),C('disabled','Disabled','toggle')],['button'],['component.control.radius','semantic.border.default']);
item('date-picker','Date picker','Molecules',[label('Date'),C('variant','Selection',['single','range']),C('display','Display',['inline','popover']),C('footer','Footer actions','toggle',true),C('presets','Date presets','toggle'),C('disabled','Disabled','toggle')],['button'],[],{source:'normalized'});
item('accordion','Accordion','Molecules',[C('variant','Style',['setup','cards','line','soft']),C('content','Content',['text','steps','details']),C('indicator','Indicator',['chevron','plus']),C('icon','Show icon','toggle',true),C('open','Initially open','toggle',true),C('multiple','Allow multiple','toggle'),C('disabled','Disabled','toggle')],['button','badge','spinner','input'],['component.accordion.radius','component.accordion.padding'],{source:'normalized',sections:[['Overview','overview'],['Types','types'],['Content','content'],['States','states']]} );
item('modal','Modal','Blocks',[C('variant','Type',['basic','decision','form-dialog']),C('dialogKind','Form',['invite','fund','key','role']),C('decisionKind','Decision',['reason','scheduling','choices']),C('destructive','Destructive','toggle'),C('title','Title','text','Edit details'),C('size','Width',['sm','md','lg'],'md'),C('footer','Show footer','toggle',true)],['field','button','icon-button'],['component.modal.background','component.modal.radius','component.modal.padding','component.modal.shadow'],{source:'improved'});
item('alert-dialog','Confirmation dialog','Blocks',[C('title','Title','text','Remove this item?'),C('destructive','Destructive','toggle',true)],['button'],['component.modal.background','component.modal.radius','component.modal.shadow'],{source:'improved'});
item('drawer','Drawer','Blocks',[C('variant','Type',['details','form']),C('side','Side',['right','left']),size(),C('title','Title','text','Item details'),C('footer','Footer actions','toggle',true),C('preview','Show preview','toggle',true)],['field','button'],['component.modal.background','component.modal.padding','component.modal.shadow'],{source:'improved'});
item('card','Card','Blocks',[C('variant','Type',['note','prompt']),C('title','Title','text','Research summary'),C('intent','Prompt',['discover','research','meeting']),C('layout','Layout',['single','group']),C('noteKind','Note preview',['text','table','image']),C('authors','Multiple authors','toggle'),C('stacked','Stacked notes','toggle'),C('disabled','Disabled','toggle')],['button','badge','avatar'],[],{source:'existing',aliases:['prompt suggestions','start here','notes','note cards']});
item('information-block','Information block','Blocks',[C('variant','Layout',['overview','stacked','table','list','text','comparison','evidence','question','profile']),C('title','Title','text',''),C('heading','Heading','toggle'),C('tags','Header badges','toggle',true),C('callout','Assessment','toggle',true),C('footer','Footer','toggle'),C('info','Supporting information','toggle',true),C('divided','Dividers','toggle',true),C('labels','Row labels','toggle'),C('status','Status',['verified','pending']),C('open','Initially open','toggle'),C('excerpt','Source excerpt','toggle',true),C('metrics','Supporting metrics','toggle',true),C('content','History',['experience','education']),C('avatar','Avatar',['text','image','placeholder'])],['badge','avatar','popover','timeline'],['component.information.radius','component.information.padding'],{source:'existing',aliases:['briefing','detail card','content block','text block','list block','evidence','profile','founders','stacked card','information table']});
item('metric-card','Metric cards','Blocks',[C('variant','Type',['metrics','highlights','score']),C('columns','Columns',['2','4'],'4'),C('value','Score','range',84),C('footer','Supporting detail','toggle',true)],['badge'],[],{source:'existing',aliases:['statistics','highlights','score','assessment','metric grid']});
item('timeline','Timeline','Blocks',[C('content','Content',['experience','education'])],['badge'],[],{source:'existing',aliases:['chronology','history','experience','education'],sections:[['Overview','overview'],['Content','types']]});
item('data-table','Data table','Blocks',[C('variant','Style',['chat','inbox']),C('columnSet','Columns',['overview','financial','team','problem']),C('density','Density',['comfortable','compact']),C('header','Header','toggle',true),C('selectable','Selectable rows','toggle',false)],['checkbox','badge','button'],['component.table.radius','component.table.rowHeight'],{source:'existing'});
item('stats-bar','Stats bar','Blocks',[C('framed','Container','toggle',true),C('details','Supporting labels','toggle',true)],[],[],{source:'existing',aliases:['statistics','metrics bar'],sections:[['Overview','overview'],['Types','types']]});
item('suggestion','Suggestion pills','Molecules',[C('layout','Layout',['single','group']),label('Compare by revenue'),C('icon','Show icon','toggle',true),C('disabled','Disabled','toggle')],['button'],[],{source:'existing',aliases:['follow-up prompts','AI suggestions'],sections:[['Overview','overview'],['Types','types'],['States','states']]});
item('file-upload','File upload','Blocks',[C('variant','Type',['upload','preview','logo-upload']),C('fileKind','File',['text','image','pdf','unsupported','unavailable']),C('state','State',['idle','selected','error']),C('multiple','Multiple files','toggle',true),C('disabled','Disabled','toggle')],['button','progress'],['semantic.border.strong','semantic.surface.subtle','radius.xl','space.24'],{source:'normalized'});
item('empty-state','Empty state','Blocks',[C('title','Title','text','Nothing here yet'),C('description','Description','text','Add your first item to get started.'),C('action','Show action','toggle',true)],['button'],['semantic.text.heading','semantic.text.secondary','space.24'],{source:'existing'});
item('toast','Toast','Blocks',[C('tone','Status',['neutral','blue','success','danger','loading'],'success'),C('label','Message','text','Changes saved'),C('action','Undo action','toggle',true),C('count','Visible toasts',['1','2','3'],'3')],['button','spinner'],[],{source:'normalized',sections:[['Overview','overview'],['Types','types'],['States','states']]});
item('command-menu','Command menu','Molecules',[C('state','State',['default','empty']),C('scopes','Search scopes','toggle',true),C('scope','Scope',['all','foundations','components'])],['input','button'],[],{aliases:['command k','quick navigation'],sections:[['Overview','overview'],['States','states']]});
item('action-bar','Action bar','Blocks',[C('variant','Type',['selection','undo']),C('label','Message','text','3 selected')],['button'],[],{aliases:['undo pill','bulk actions','selection toolbar'],sections:[['Overview','overview'],['Types','types']]});
item('filter-bar','Filter controls','Blocks',[C('variant','Type',['toolbar','filter','sort','search','advanced']),C('searchable','Show search','toggle',true)],['input','select','combobox','chip','button'],[],{source:'existing',aliases:['filter bar','search bar','sort'],sections:[['Overview','overview'],['Types','types'],['States','states']]});
item('stepper','Stepper','Blocks',[C('step','Current step',['Details','Preferences','Review'],'Preferences'),C('orientation','Orientation',['horizontal','vertical']),C('variant','Type',['numbered','dots']),C('dotSize','Dot size',['sm','xs']),C('disabled','Disabled','toggle')],['button'],['semantic.action.primary','semantic.border.default','space.24']);
item('chart','Chart','Blocks',[C('variant','Type',['bar','line']),C('showGrid','Grid','toggle',true)],[],['semantic.action.primary','semantic.border.default','font.size.12'],{source:'normalized'});
item('avatar-group','Avatar group','Blocks',[C('variant','Type',['image','text','placeholder']),C('tone','Color',['neutral','warning','blue','sky','purple','danger','success'],'blue'),C('count','Visible people','range',3),C('overflow','Additional people','range',3),C('countStyle','Count style',['number','icon']),size()],['avatar'],['component.avatar.size.md'],{source:'normalized',sections:[['Overview','overview'],['Types','types'],['Sizes','sizes'],['Colors','colors'],['Count','count']]} );
const motionControls=()=>[C('speed','Speed',['0.5×','1×','1.5×','2×'],'1×'),C('playing','Playing','toggle',true)];
item('text-shimmer','Text shimmer','Motion',[C('text','Text','text','Thinking through the details…'),...motionControls()],[],['component.motion.shimmer.foreground','component.motion.shimmer.highlight','component.motion.shimmer.duration'],{source:'existing',sections:[['Overview','overview'],['Animation','animation']]});
item('text-glow','Text glow','Motion',[C('text','Text','text','Making room for what’s next.'),...motionControls()],[],['semantic.action.primary','motion.duration.textGlow'],{sections:[['Overview','overview'],['Animation','animation']]});
item('streaming-text','Streaming text','Motion',[C('text','Text','text','Good design is a series of small, deliberate decisions. Every detail has a purpose.'),...motionControls()],[],['semantic.text.body','font.size.16','motion.duration.streamStep'],{sections:[['Overview','overview'],['Animation','animation']]});
item('ai-loader','AI loader','Motion',[...motionControls()],[],['component.aiLoader.size','component.aiLoader.foreground','component.aiLoader.duration'],{source:'existing',sections:[['Overview','overview'],['Animation','animation']]});
item('thinking-dots','Thinking dots','Motion',[label('Thinking'),...motionControls()],[],['semantic.text.secondary','motion.duration.dots'],{sections:[['Overview','overview'],['Animation','animation']]});
item('waveform','Waveform','Motion',[...motionControls()],[],['semantic.action.primary','motion.duration.dots'],{source:'existing',sections:[['Overview','overview'],['Animation','animation']]});
item('composer','AI prompt bar','Blocks',[C('variant','Type',['home','conversation']),C('state','State',['default','pending','disabled']),C('value','Message','text',''),C('mode','Mode',['none','web','research','thinking']),C('mention','Mentions',['none','company','list','both']),C('attachments','Attachments',['none','files']),C('glow','Glow','toggle',true)],['input','icon-button','dropdown','chip'],[],{source:'existing',aliases:['composer','prompt','chat input','dictation','mentions'],sections:[['Overview','overview'],['Types','types'],['States','states']]});
item('ai-status','AI progress','Motion',[C('variant','Type',['stages','research','search']),C('animate','Animate sequence','toggle',true),C('step','Stage',['Understanding','Exploring','Synthesizing','Complete'],'Exploring'),C('state','State',['complete','thinking']),C('expanded','Expanded','toggle',true),C('stage','Research stage',['auto','reading','calculating','drafting','complete']),C('sourceMode','Sources',['link','popover']),...motionControls()],['badge','spinner','popover'],['semantic.action.primary','semantic.text.secondary','motion.duration.spin'],{source:'normalized',sections:[['Overview','overview'],['Types','types'],['States','states']]});
item('ai-response','AI response','Templates',[C('variant','Type',['text','table','statistics','overview','brief','revenue','market','search']),C('state','State',['complete','thinking']),C('research','Research activity','toggle'),C('followups','Follow-up prompts','toggle',true),C('actions','Message actions','toggle',true),C('focus','Brief focus',['risks','team','traction','problem']),C('format','Text layout',['structured','plain','empty']),C('stage','Research stage',['auto','reading','calculating','drafting','complete']),C('sourceMode','Sources',['link','popover'])],['data-table','badge','avatar','popover','ai-status','information-block'],[],{source:'existing',aliases:['assistant','research response','report'],sections:[['Overview','overview'],['Types','types'],['States','states']]});
item('form-layout','Form layout','Templates',[C('variant','Type',['basic','range','copyable','setup']),C('columns','Columns',['1','2'],'2')],['field','select','button'],['space.24','component.card.radius','component.input.border']);
item('settings-layout','Settings layout','Templates',[C('variant','Type',['basic','settings','invitations','management']),C('settingKind','Settings',['definition','account','scheduling']),C('managementKind','Management',['team','keys'])],['switch','select','button','card'],['space.24','semantic.border.default','component.card.radius']);

// Source compositions have distinct jobs; their subpatterns remain focused variations.
item('navigation','Navigation','Blocks',[C('collapsed','Collapsed','toggle')],['avatar','button','dropdown'],[],{source:'existing',aliases:['sidebar','workspace navigation','profile menu'],sections:[['Overview','overview'],['States','states']]});
item('conversation','Chat bubble','Molecules',[C('appearance','Appearance',['primary','secondary','tinted','outline','ghost'],'secondary'),C('align','Alignment',['start','end'],'end'),C('grouping','Grouping',['single','grouped']),C('text','Text','text','Can you summarize the key findings?')],[],[],{source:'normalized',aliases:['conversation','chat message','bubble','sent message'],sections:[['Overview','overview'],['Styles','styles'],['Alignment','alignment'],['Groups','groups']]});
item('evidence-trace','Evidence trace','Blocks',[C('variant','Type',['sidebar','map','confidence','sources']),C('confidence','Confidence',['high','moderate','low'],'moderate'),C('sourceState','Sources',['all','available','pending','missing']),C('expanded','Expanded','toggle',true),C('selected','Selected','toggle')],['popover','badge','button','avatar'],[],{hidden:true,source:'existing',aliases:['research map','lineage','source status'],sections:[['Overview','overview'],['Types','types']]});
item('account-flow','Account flow','Templates',[C('variant','Type',['onboarding','session','directory']),C('onboardingStep','Step',['invitation','workspace','preferences','team'],'workspace')],['form-layout','settings-layout','card','button'],[],{source:'existing',aliases:['sign in','workspace directory','onboarding'],sections:[['Overview','overview'],['Types','types']]});

items.find(entry=>entry.id==='select').controls.find(control=>control.key==='state').options=items.find(entry=>entry.id==='select').controls.find(control=>control.key==='state').options.filter(value=>value!=='readonly');
for(const entry of items){if(entry.sections===base){entry.sections=[["Overview","overview"]];if(entry.controls.some(c=>c.key==="variant"))entry.sections.push(["Types","types"]);if(entry.controls.some(c=>c.key==="size"))entry.sections.push(["Sizes","sizes"]);if(entry.controls.some(c=>c.key==="state"||c.type==="toggle"))entry.sections.push(["States","states"]);}}
for(const entry of items)if(entry.group!=='Foundations'&&!entry.sections.some(([,slug])=>slug==='all-states'))entry.sections.splice(1,0,['All states','all-states']);
F.items=items;F.byId=Object.fromEntries(items.map(i=>[i.id,i]));
F.pageAliases={'icon-button':['button','icon-buttons'],'link':['button','link-buttons'],'button-group':['button','button-groups']};
F.pageRoute=(id,section='overview')=>F.pageAliases[id]||[id,section];
F.pageHref=id=>'#'+F.pageRoute(id).join('/');
F.matchesSearch=(item,query)=>[item.name,item.group,...(item.aliases||[])].some(v=>v.toLowerCase().includes(query));
F.isPageVisible=id=>Boolean(F.byId[id]&&!F.byId[id].hidden);
F.visibleItems=()=>F.items.filter(entry=>!entry.hidden&&!F.pageAliases[entry.id]);
F.defaults=item=>Object.fromEntries(item.controls.map(c=>[c.key,c.default]));

// Keep each configuration panel limited to controls that affect its selected variation.
F.controlVisible=(item,control,c)=>{
 const key=control.key,variant=c.variant;
 if(item.id==='stepper'&&key==='orientation')return variant!=='dots';
 if(item.id==='stepper'&&key==='dotSize')return variant==='dots';
 if(item.id==='command-menu'&&key==='scope')return c.scopes;
 if(item.id==='dropdown'&&key==='identityHeader')return c.appearance==='sectioned';
 if(item.id==='modal')return key==='variant'||(variant==='decision'?['decisionKind','destructive'].includes(key):variant==='form-dialog'?key==='dialogKind':['title','size','footer'].includes(key));
 if(item.id==='file-upload')return key==='variant'||(variant==='preview'?key==='fileKind':variant==='logo-upload'?false:['multiple','disabled','state'].includes(key));
 if(item.id==='form-layout')return key==='variant'||(variant==='basic'&&key==='columns');
 if(item.id==='settings-layout')return key==='variant'||(variant==='settings'?key==='settingKind':variant==='management'?key==='managementKind':false);
 if(item.id==='account-flow')return key==='variant'||variant==='onboarding';
 if(item.id==='conversation')return true;
 if(item.id==='evidence-trace')return key==='variant'||({sidebar:['expanded','selected'],map:['expanded','selected'],confidence:['confidence'],sources:['sourceState']}[variant]||[]).includes(key);
 if(item.id==='tabs')return key==='countedActive'?variant==='counted':key==='active'?variant!=='counted':true;
 if(item.id==='filter-bar'&&key==='searchable')return variant==='toolbar';
 if(item.id==='data-table'&&key==='columnSet')return variant==='chat';
 if(item.id==='badge'&&['status','statusIcon'].includes(key))return variant==='status';
 if(item.id==='badge'&&variant==='status')return ['variant','size','status','statusIcon'].includes(key);
 if(item.id==='badge')return key==='categorySize'?variant==='category':key==='size'?variant!=='category'&&!String(variant||'').startsWith('status-'):key==='iconName'?(c.indicator||'').startsWith('icon'):true;
 if(item.id==='chip')return key==='size'?variant!=='filter':key==='selected'?variant==='selectable':key==='disabled'?variant!=='static':true;
 if(item.id==='card')return key==='variant'||(variant==='prompt'?['intent','layout','disabled'].includes(key):variant==='note'?['title','noteKind','stacked','authors'].includes(key):['title','description','tone','footer'].includes(key));
 if(item.id==='suggestion'&&key==='label')return c.layout==='single';
 if(item.id==='popover')return key==='variant'||(['membership','sharing'].includes(variant)?['presentation','state'].includes(key):variant==='source'?key==='citationStyle':variant==='guided'?['label','title','description','step','open','disabled'].includes(key):['label','title'].includes(key));
 if(item.id==='ai-response')return key==='focus'?variant==='brief':key==='format'?variant==='text':['stage','sourceMode'].includes(key)?c.research:true;
 if(item.id==='ai-status'&&variant!=='search'&&c.animate&&['step','stage','state'].includes(key))return false;
 if(item.id==='ai-status')return key==='animate'?variant!=='search':key==='variant'||(variant==='search'?['state','speed','playing'].includes(key):variant==='research'?(['expanded','stage','sourceMode','speed','playing'].includes(key)||key==='state'&&c.stage==='auto'):['step','speed','playing'].includes(key));
 if(item.id==='metric-card')return key==='variant'||key==='footer'||(variant==='metrics'?key==='columns':variant==='score'?key==='value':false);
 if(item.id==='information-block'){
  if(key==='variant')return true;
  if(variant==='stacked')return ['title','tags','footer'].includes(key);
  if(variant==='table')return ['title','tags','footer','info'].includes(key);
  if(variant==='list')return ['title','tags','footer','divided','labels'].includes(key);
  if(variant==='text')return ['title','tags','footer'].includes(key);
  if(variant==='comparison')return key==='heading'||c.heading&&['title','tags','footer'].includes(key);
  if(variant==='overview')return ['title','tags','callout','footer'].includes(key);
  if(variant==='evidence')return ['status','open','excerpt','metrics'].includes(key);
  if(variant==='question')return ['status','open'].includes(key)||key==='excerpt'&&c.status!=='pending';
  if(variant==='profile')return ['content','avatar','open'].includes(key);
  return false;
 }
 if(item.id==='data-table'&&key==='density')return variant!=='inbox';
 if(item.id==='button-group'&&key==='selected')return F.groupKind(c)==='selection';
 return true;
};

// Migrate stored links while keeping the visible catalogue focused on real families.
F.migrateRoute=(id,section='overview',query='')=>{
 if(!id||id!=='all'&&!F.byId[id])id='all';
 const params=new URLSearchParams(query),variant=params.get('variant');
 if(id==='badge'&&variant==='raised'){id='tag';params.set('variant','raised');}
 if(id==='card'&&variant==='standard')params.set('variant','note');
 if(id==='conversation')for(const key of ['variant','state','response','metadata','chart'])params.delete(key);
 if(id==='information-block'){
  if(['metrics','highlights','score'].includes(variant))id='metric-card';
  else if(variant==='timeline'){id='timeline';params.delete('variant');}
  else if(variant==='notifications'){id='all';section='overview';for(const key of [...params.keys()])params.delete(key);}
  else if(variant==='rows'){params.set('variant','list');params.set('labels','true');params.set('divided','true');}
  else if(variant==='notes')params.set('variant','text');
 }
 const [page,tab]=F.pageRoute(id,section),target=F.byId[page],validTab=target?.sections.some(([,slug])=>slug===tab)?tab:'overview';
 return {id:page,section:validTab,query:params.toString()};
};
F.componentParts=(item,c={})=>{
 if(item.id==='conversation')return [];
 if(item.id==='tag')return c.removable?['button']:[];
 if(item.id==='file-upload'&&c.variant==='upload')return ['button'];
 if(item.id==='command-menu')return ['input','button','kbd',...(c.scopes!==false?['chip']:[])];
 if(item.id==='dropdown')return ['button',...(c.appearance!=='basic'&&c.identityHeader?['avatar','badge']:[])];
 if(item.id==='drawer')return c.variant==='form'?['field','button']:['avatar','badge','button','divider'];
 if(item.id==='popover'&&c.variant==='guided')return ['button'];
 if(item.id==='card')return c.variant==='prompt'?['button']:['avatar'];
 if(item.id==='ai-status')return c.variant==='research'?['ai-loader','text-shimmer','spinner',...(c.sourceMode==='popover'?['popover']:[])]:c.variant==='search'?['text-shimmer']:['badge','spinner'];
 if(item.id==='composer')return [...item.parts,'waveform'];
 if(item.id==='ai-response'){
  if(c.state==='thinking')return c.research?['ai-status']:['ai-loader','text-shimmer'];
  const variant=F.aiResponseVariants.includes(c.variant)?c.variant:'text',parts=variant==='table'?['data-table']:variant==='statistics'?['stats-bar']:['overview','brief'].includes(variant)?['avatar','badge','button']:variant==='text'&&!['plain','empty'].includes(c.format)?['popover']:variant==='search'?['text-shimmer']:[];
  return [...new Set([...parts,...(c.research?['ai-status']:[]),...(c.followups!==false?['suggestion']:[]),...(c.actions===false?[]:['button'])])];
 }
 if(item.id==='accordion')return c.variant==='setup'?['badge',...(c.icon!==false?['spinner']:[]),...((c.content||'text')==='text'?['input','button']:[])]:[];
 if(item.id==='information-block'){
  const v=F.informationConfig(c).variant;
  if(v==='profile')return ['avatar','badge','timeline'];
  if(v==='question')return ['badge'];
  if(v==='evidence')return ['badge','popover'];
  return (v!=='comparison'||c.heading)&&c.tags!==false?['tag']:[];
 }
 if(item.id==='metric-card')return c.variant==='score'&&c.footer!==false?['badge']:[];
 if(item.id==='timeline')return ['badge'];
 return item.parts;
};

F.controlLabel=(item,control,c={})=>item.id==='information-block'&&c.variant==='question'&&control.key==='excerpt'?'Assessment':control.label;
