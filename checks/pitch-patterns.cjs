/* Source and rendering contracts for Pitch Protocol patterns; no browser is launched. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist');
const context={window:{CustomEvent:class{constructor(type,options){this.type=type;Object.assign(this,options);}}},document:{createElement:()=>({}),getElementById:()=>({}),head:{append(){}}}};
vm.createContext(context);
for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','avatar.js','spinner.js','chip.js','switch-motion.js','menus.js','pitch-patterns.js','feedback.js','slider.js','prompt-bar.js','ai-response.js','detail-blocks.js','card-patterns.js','prompt-suggestions.js','catalogue.js','previews.js','command-menu.js','guided-popover.js','tooltip.js','file-upload.js','date-picker.js','source-shell.js','source-workspace.js','source-details.js','source-trace.js','source-chat.js','chat-bubble.js','component-contracts.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const F=context.window.Forma,css=fs.readFileSync(path.join(dist,'pitch-patterns.css'),'utf8');
// Keep assertion failures readable without printing bundled demo image payloads.
const renderTable=F.pitchTable;F.pitchTable=c=>renderTable(c).replace(/src="data:[^"]+"/g,'src="data:image/png;base64,AA=="');
assert.match(css,/\.pp-pitch-table-head>div>h3\{[^}]*color:var\(--pp-component-table-text\)/,'Shared result title outspecifies composed response h3 defaults');
const sharedHeader=F.resultCardHeader('Results <test>',{detail:'Context <test>',actions:F.button({variant:'secondary',size:'sm'},'Save','data-save')});
assert.match(sharedHeader,/Results &lt;test&gt;/);assert.match(sharedHeader,/Context &lt;test&gt;/);assert.match(sharedHeader,/data-save/);
for(const id of F.resultCardTokens({detail:true}))assert.ok(F.tokens[id],id);
assert.ok(F.pitchTable({title:'Shared title'}).includes(F.resultCardHeader('Shared title',{actions:F.button({variant:'secondary',size:'sm'},'Save List','data-chat-save-list')})),'Table uses shared result header');
assert.doesNotMatch(F.informationBlock({tags:[]}),/pp-information-tags/,'Empty tags do not create an empty header flex item');
assert.doesNotMatch(F.stackedInformation({tags:[]}),/pp-information-tags/);assert.doesNotMatch(F.informationTable({tags:[]}),/pp-information-tags/);
assert.ok(!F.informationBlockTokens({tags:[]}).some(id=>id.startsWith('component.tag.')));assert.ok(!F.informationTableTokens({tags:[]}).some(id=>id.startsWith('component.tag.')));
let configurations=0;
for(const variant of ['chat'])for(const density of ['comfortable','compact'])for(const selectable of [false,true])for(const header of [false,true]){
 const c={variant,density,selectable,header},html=F.pitchTable(c);
 assert.equal((html.match(/<table\b/g)||[]).length,1);
 assert.equal((html.match(/<tr data-name=/g)||[]).length,5);
 assert.equal((html.match(/type="checkbox"/g)||[]).length,selectable?6:0);
 assert.doesNotMatch(html,/table-search|pp-pitch-table-filters|data-chip-remove/,'Filters remain separate from table specimens');
 assert.equal(html.includes('pp-pitch-table-head'),header);
 assert.match(html,/<caption class="visually-hidden">AI opportunities<\/caption>/);
 assert.match(html,/role="region" tabindex="0" aria-label="AI opportunities table"/);
 assert.match(html,/<button type="button" data-chat-sort="score">/);
 assert.match(html,/aria-sort="descending"/);
 assert.match(html,/class="pp-table-status" role="status"/);
 assert.match(html,/class="pp-pitch-categories"/);
 assert.equal((html.match(/<img src="data:/g)||[]).length,4,'Original working source marks are bundled');
 for(const id of F.pitchTableTokens(c))assert.ok(F.tokens[id],`Missing table token ${id}`);
 configurations++;
}
assert.match(F.pitchTable({rows:[]}),/>0 of 0 items<\/div>/);
assert.equal(F.pitchTable({variant:'standard'}).replace(/pitch-chat-\d+/g,'pitch-chat-id'),F.pitchTable({variant:'chat'}).replace(/pitch-chat-\d+/g,'pitch-chat-id'),'Legacy Standard configuration resolves to the real Chat table');
assert.doesNotMatch(F.pitchTable({variant:'chat',searchable:true,filters:[{label:'Legacy filter'}]}),/table-search|pp-pitch-table-filters|Legacy filter/);
const escapedTable=F.pitchTable({title:'<unsafe>',rows:[{name:'A < B',description:'"<script>"',round:'&',stage:'<none>',score:4}]});
assert.doesNotMatch(escapedTable,/<unsafe>|<script>/);assert.match(escapedTable,/data-name="A &lt; B"/);
const sourceColumnSets={overview:['company','round','score','description'],financial:['company','round','score','revenue','traction'],team:['company','round','team','founderCredibility'],problem:['company','round','score','customerProblem']};
for(const [columnSet,columns]of Object.entries(sourceColumnSets)){
 const c={columnSet},html=F.pitchTable(c),state=F.createPitchTableState(c).snapshot();assert.equal(JSON.stringify(state.columns),JSON.stringify(columns));assert.equal((html.match(/<th scope="col"/g)||[]).length,columns.length);assert.equal(html.includes('pp-pitch-table-natural'),columnSet==='team'||columnSet==='problem');assert.ok(html.includes('data-chat-more '));assert.doesNotMatch(html,/data-notify="List saved/);
 for(const id of F.pitchTableTokens(c))assert.ok(F.tokens[id],id);for(const key of columns)assert.ok(F.pitchTableTokens(c).includes('component.table.column.'+key));configurations++;
}
assert.equal(F.pitchTableCell({revenue:2.45},'revenue'),'$2.5M');assert.equal(F.pitchTableCell({traction:38},'traction'),'38%');assert.equal(F.pitchTableCell({},'traction'),'—');assert.doesNotMatch(F.pitchTableCell({problem:'<script>'},'customerProblem'),/<script>/);
const pageState=F.createPitchTableState({selectable:true});assert.equal(pageState.snapshot().visible,5);assert.equal(pageState.snapshot().total,12);pageState.selectVisible(true);pageState.loadMore();assert.equal(pageState.snapshot().visible,10);assert.equal(pageState.snapshot().selected.length,5);pageState.loadMore();pageState.loadMore();assert.equal(pageState.snapshot().visible,12);assert.equal(new Set(pageState.snapshot().rows.map(row=>row.id)).size,12);
const numericRows=[89,100,84,9,95,86,91].map((score,index)=>({id:'row-'+index,name:String.fromCharCode(65+index)+' company',score,revenue:score/10,team:score,traction:score,round:'Seed',stage:'Live'})),numeric=F.createPitchTableState({rows:numericRows,pageSize:50,columns:['company','score','team','revenue','traction']});
assert.equal(JSON.stringify(numeric.snapshot().rows.map(row=>row.score)),'[100,95,91,89,86,84,9]');numeric.sort('score');assert.equal(JSON.stringify(numeric.snapshot().rows.map(row=>row.score)),'[9,84,86,89,91,95,100]');numeric.sort('score');assert.equal(numeric.snapshot().rows[0].score,100);numeric.sort('revenue');assert.equal(numeric.snapshot().rows[0].revenue,10);numeric.sort('revenue');assert.equal(numeric.snapshot().rows[0].revenue,.9);numeric.select('row-1',true);numeric.sort('team');assert.equal(numeric.snapshot().selected[0],'row-1');
const invalidColumns=F.createPitchTableState({columns:['score','bad','score']}).snapshot();assert.equal(JSON.stringify(invalidColumns.columns),'["score"]');
const ids=new Set();
for(const variant of ['segmented','underline'])for(const active of ['Summary','Details']){
 const html=F.pitchTabs({variant,active});
 assert.equal((html.match(/role="tab"/g)||[]).length,2);
 assert.equal((html.match(/aria-selected="true"/g)||[]).length,1);
 assert.equal((html.match(/role="tabpanel"/g)||[]).length,2);
 assert.match(html,new RegExp(`aria-selected="true"[^>]*>${active}<`));
 assert.equal((html.match(/<button type="button"/g)||[]).length,2);
 const local=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
 for(const id of local){assert.ok(!ids.has(id),'Unique panel IDs across matrices');ids.add(id);}
 for(const [,id]of html.matchAll(/aria-controls="([^"]+)"/g))assert.ok(local.includes(id),'Tab points to a rendered panel');
 for(const id of F.pitchTabsTokens({variant,active}))assert.ok(F.tokens[id],`Missing tabs token ${id}`);
 configurations++;
}
for(const active of ['All','New','Interested','Watching','Passed','Off-Thesis']){
 const html=F.pitchTabs({variant:'counted',active,counts:{all:24,new:8,interested:5,tracking:7,passed:4,'off-thesis':0}});
 assert.equal((html.match(/role="tab"/g)||[]).length,6);assert.equal((html.match(/role="tabpanel"/g)||[]).length,6);assert.equal((html.match(/aria-selected="true"/g)||[]).length,1);
 assert.equal((html.match(/class="pp-pitch-tab-count"/g)||[]).length,6);assert.equal((html.match(/data-hugeicon=/g)||[]).length,6);
 assert.match(html,new RegExp(`aria-selected="true"[^>]*>.*?<span>${active}</span><span class="pp-pitch-tab-count">`));
 for(const [,id]of html.matchAll(/\bid="([^"]+)"/g)){assert.ok(!ids.has(id));ids.add(id);}
 for(const token of F.pitchTabsTokens({variant:'counted'}))assert.ok(F.tokens[token],token);
 configurations++;
}
assert.match(F.pitchTabs({variant:'counted',counts:{new:'<unsafe>',all:-3}}),/class="pp-pitch-tab-count">0</);
for(const [id,value]of Object.entries({'component.tabs.counted.height':'32px','component.tabs.counted.inset':'2px','component.tabs.counted.radius':'10px','component.tabs.counted.font':'14px','component.tabs.counted.icon':'14px','component.tabs.counted.countFont':'12px','component.tabs.counted.gap':'8px'}))assert.equal(F.resolve(id),value,id);
let filterConfigurations=0;
for(const variant of ['toolbar','filter','sort','search'])for(const searchable of [false,true]){
 const config={variant,searchable},html=F.pitchFilterBar(config),hasSearch=variant==='search'||variant==='toolbar'&&searchable;
 assert.equal(html.includes('data-pitch-query'),hasSearch);
 assert.equal(html.includes('data-pitch-filter-toggle'),variant==='toolbar'||variant==='filter');
 assert.equal(html.includes('data-pitch-sort'),variant==='toolbar'||variant==='sort');
 assert.doesNotMatch(html,/<table|<select|<option/,'Standalone controls use shared authored menus and never pretend to filter a table');
 if(variant==='toolbar'||variant==='filter'){assert.equal((html.match(/data-pitch-filter-field=/g)||[]).length,3);assert.equal((html.match(/data-multiple="true"/g)||[]).length,3);assert.match(html,/role="dialog" aria-label="Filters" hidden/);}
 for(const token of F.pitchFilterTokens(config))assert.ok(F.tokens[token],token);
 filterConfigurations++;
}
for(const [id,value]of Object.entries({'component.filter.control.height':'34px','component.filter.control.radius':'10px','component.filter.toolbar.gap':'8px','component.filter.search.width':'206px','component.filter.control.width':'116px','component.filter.control.icon':'16px'}))assert.equal(F.resolve(id),value,id);
assert.match(css,/\.pp-pitch-search>\.pp-button/,'Source control sizing targets the actual shared Button class');
assert.doesNotMatch(css,/\.pp-btn\b/);
const filterState=F.createPitchFilterState({filters:{stage:['Live','Live','<bad>'],round:['Seed']},query:'Luma',sort:'name'});
assert.equal(JSON.stringify(filterState.snapshot().filters.stage),'["Live"]');filterState.filter('stage',['Prototype','Growth']);filterState.filter('bad',['bad']);filterState.sort('unknown');assert.equal(filterState.snapshot().sort,'name');filterState.search('AI');filterState.clear();assert.equal(filterState.snapshot().query,'AI');assert.equal(filterState.snapshot().sort,'name');assert.ok(Object.values(filterState.snapshot().filters).every(values=>!values.length));
const escapedFilters=F.pitchFilterBar({label:'<unsafe>',query:'<script>'});assert.doesNotMatch(escapedFilters,/<unsafe>|<script>/);assert.match(escapedFilters,/&lt;script&gt;/);
for(const variant of ['overview','rows','comparison','list','notes'])for(const tags of [false,true])for(const footer of [false,true])for(const callout of [false,true]){
 const c={variant,tags,footer,callout},html=F.informationBlock(c);
 if(variant==='comparison'){
  assert.equal((html.match(/class="pp-information-case/g)||[]).length,2);
  assert.match(html,/aria-label="Comparison"/);
 }else{
  const heading=html.match(/aria-labelledby="([^"]+)"/)[1];assert.ok(html.includes(`id="${heading}"`));
  assert.equal(html.includes('pp-information-tags'),tags);
  assert.equal(html.includes('pp-information-footer'),footer);
  if(variant==='overview')assert.equal(html.includes('pp-information-callout'),callout);
 }
 for(const id of F.informationBlockTokens(c))assert.ok(F.tokens[id],`Missing information token ${id}`);
 configurations++;
}
const unsafe='<img src=x onerror=alert(1)>';
// The detail tag and assessment are source-derived contracts, not generic outline badges.
const detailOverview=F.informationBlock({tags:['Company overview']});
assert.match(detailOverview,/--tag-height:var\(--pp-component-tag-height\)/);
assert.match(detailOverview,/data-hugeicon="NoteIcon"/,'Assessment uses the registered Hugeicons icon');
for(const [id,value]of Object.entries({
 'component.tag.height':'23px','component.tag.font':'12px','component.tag.line':'15px','component.tag.radius':'6px',
 'component.information.callout.iconSize':'12px','component.information.callout.iconBox':'20px'
}))assert.equal(F.resolve(id),value,id);
for(const [role,primitive]of Object.entries({background:'color.blue.50',heading:'color.blue.900',body:'color.blue.800',icon:'color.blue.500'})){
 const id='component.information.callout.'+role;
 assert.equal(F.chain(id).at(-1),primitive,'Assessment preserves separate surface, heading, body and icon roles');
 assert.ok(F.informationBlockTokens({variant:'overview'}).includes(id));
}
assert.match(css,/\.pp-information-callout h4\{[^}]*color:var\(--pp-component-information-callout-heading\)/);
assert.match(css,/\.pp-information-callout\{[^}]*color:var\(--pp-component-information-callout-body\)/);
for(const indicator of ['none','icon-only']){
 const config={variant:'raised',tone:'neutral',indicator},markup=F.badge(config,'Tag');
 assert.doesNotMatch(markup,/data-smooth-/);
 assert.ok(!F.componentTokens(F.byId.badge,config).some(id=>/smoothing/i.test(id)),'Badges use native radius tokens');
}
for(const html of [
 F.informationBlock({title:unsafe,tags:[unsafe],sections:[{heading:unsafe,body:unsafe}],calloutTitle:unsafe,calloutText:unsafe,footer:unsafe}),
 F.informationBlock({variant:'rows',rows:[{label:unsafe,body:unsafe}]}),
 F.informationBlock({variant:'list',items:[unsafe]}),
 F.informationBlock({variant:'comparison',columns:[{title:unsafe,items:[unsafe]}]})
]){assert.doesNotMatch(html,/<img/);assert.match(html,/&lt;img/);}
// Values are taken from the final source overrides, including the flush switch.
for(const [id,value]of Object.entries({
 'component.tabs.segmented.width':'148px','component.tabs.segmented.height':'32px','component.tabs.segmented.firstWidth':'84px','component.tabs.segmented.lastWidth':'64px','component.tabs.segmented.radius':'8px','component.tabs.segmented.borderWidth':'0.5px',
 'component.table.radius':'16px','component.table.innerRadius':'12px','component.table.inset':'4px','component.table.headerHeight':'40px','component.table.rowHeight':'44px','component.table.cellPaddingX':'12px',
 'component.information.inset':'2px','component.information.padding':'16px','component.information.radius':'12px','component.information.labelWidth':'212px','component.information.shell':'#FAFAFA'
}))assert.equal(F.resolve(id),value,id);
for(const [id,token]of Object.entries(F.tokens).filter(([id])=>/^component\.(table|filter|tabs|information)\./.test(id))){
 assert.match(token.value,/^\{.+\}$/,'Component tokens alias named values');
 for(const ref of F.chain(id).slice(1))assert.equal(F.tokens[ref].type,token.type,`Alias type ${id}`);
}
const variables=new Set(Object.keys(F.tokens).map(F.varName));
for(const [,variable]of css.matchAll(/var\((--pp-[a-zA-Z0-9-]+)/g))assert.ok(variables.has(variable),`Unknown CSS token ${variable}`);
assert.match(css,/\.pp-tabs\.pp-pitch-segmented\{[^}]*gap:0;padding:0/);
assert.match(css,/position:sticky;inset-inline-start:0/,'First table column remains visible while scrolling');
assert.match(css,/grid-template-rows:subgrid/,'Paired comparison rows align');
assert.match(css,/@container\(max-width:520px\)/,'Labels stack in small component containers');
assert.match(css,/@media\(forced-colors:active\)/);
class EventNode{
 constructor(attrs={}){this.attrs={...attrs};this.dataset={};this.queries={};this.events={};this.hidden=false;this.textContent='';this.classList={toggle(){}};}
 getAttribute(key){return this.attrs[key]??null;}
 setAttribute(key,value){this.attrs[key]=String(value);}
 querySelector(key){return this.queries[key]??null;}
 querySelectorAll(){return [];}
 addEventListener(type,handler){(this.events[type]??=[]).push(handler);}
 removeEventListener(type,handler){this.events[type]=(this.events[type]||[]).filter(fn=>fn!==handler);}
 click(){for(const handler of this.events.click||[])handler({target:this,preventDefault(){},stopPropagation(){}});}
}
// Inbox is an independent interactive composition, not a restyled chat table.
let inboxConfigurations=0;
for(const selectable of [false,true])for(const header of [false,true])for(const pageSize of [3,5,7]){
 const config={variant:'inbox',selectable,header,pageSize},html=F.pitchTable(config);
 assert.match(html,/data-pitch-inbox=/);assert.doesNotMatch(html,/class="pp-table\b/,'Inbox must not bind the generic table controller');
 assert.equal((html.match(/<tr data-inbox-row=/g)||[]).length,pageSize);
 assert.equal((html.match(/type="checkbox"/g)||[]).length,selectable?pageSize+1:0);
 assert.doesNotMatch(html,/data-inbox-search|data-inbox-filter|data-inbox-sort|data-inbox-chips/,'Inbox specimen contains only table controls, not the application filter toolbar');assert.equal(html.includes('pp-pitch-inbox-heading'),header);
 for(const heading of ['Company','Industry','Stage','Score','Recommendation','Submitted'])assert.match(html,new RegExp('>'+heading+'</th>'));
 assert.equal((html.match(/data-inbox-row-action=/g)||[]).length,pageSize);
 assert.match(html,/role="status" aria-live="polite"/);
 for(const id of F.pitchTableTokens(config))assert.ok(F.tokens[id],`Missing inbox token ${id}`);
 inboxConfigurations++;
}
for(const [id,value]of Object.entries({'component.table.descriptionPaddingX':'28px','component.table.inbox.rowHeight':'52px','component.table.inbox.headerHeight':'40px','component.table.inbox.borderWidth':'0.5px','component.table.inbox.radius':'16px','component.table.inbox.cellPaddingX':'16px','component.table.inbox.font':'14px','component.table.filter.height':'34px'}))assert.equal(F.resolve(id),value,id);
const selectableChat=F.pitchTable({selectable:true});
assert.doesNotMatch(selectableChat,/pp-table-selection-col/);
assert.match(selectableChat,/<td data-column="company"><span class="pp-pitch-company"><span class="pp-choice-control/,'Checkbox belongs to sticky Company cell');
assert.match(selectableChat,/<td data-column="description">/);
for(const [variant,size,height]of [['chat','sm','18px'],['inbox','md','26px']]){
 const tokens=F.badgeTokens({variant:'category',size,tone:'success'}),markup=F.pitchTable({variant});
 assert.equal(F.resolve(tokens.height),height,'Each source table keeps its actual category-tag size');
 assert.ok(markup.includes('--badge-height:var('+F.varName(tokens.height)+')'),'Table renders the shared Category badge');
 assert.ok(F.pitchTableTokens({variant}).includes(tokens.radius),'Inspector includes the active Category radius alias');
 assert.ok(!F.pitchTableTokens({variant}).some(id=>id.startsWith('component.chip.')),'Table inspector excludes removed filter-chip contracts');
}
assert.match(css,/\[data-column="description"\]\{padding-inline-start:var\(--pp-component-table-descriptionPaddingX\)/);
assert.match(F.pitchTable({variant:'inbox',rows:[]}),/>0–0 of 0 companies</);
const statusRows=F.pitchTable({variant:'inbox',rows:[{id:'recommendation',name:'Recommended',stage:'Live',recommendation:'Take meeting'},{id:'decision',name:'Interested company',stage:'Live',decision:'interested'}]});
assert.match(statusRows,/--badge-height:var\(--pp-component-badge-statusNeutral-height\)/);
assert.match(statusRows,/--badge-height:var\(--pp-component-badge-statusSubtle-height\)/);
assert.match(statusRows,/data-hugeicon="CheckmarkCircle02Icon"/,'Decision badges use the registered Hugeicons status icon');
const unsafeInbox=F.pitchTable({variant:'inbox',title:'<unsafe>',rows:[{id:'"><script>',name:'<script>',industry:'"<img>',stage:'<a>',submitted:'<date>'}]});
assert.doesNotMatch(unsafeInbox,/<unsafe>|<script>|<img>|<date>|<a>/);
// Company navigation is source-backed or explicit, never guessed from an arbitrary demo ID.
const linkedCompany=F.pitchTableCell({id:'application-kestrel-lens',name:'Kestrel Lens'},'company');
assert.match(linkedCompany,/<a class="pp-pitch-company-name" href="https:\/\/pitch-investor-prototype\.vercel\.app\/preview\.html#company\/application-kestrel-lens\/summary"/);
assert.match(linkedCompany,/target="_blank" rel="noopener noreferrer"/);
for(const href of ['javascript:alert(1)','data:text/html,anything','//example.com','https:\\example.com','https://example.com\n/x'])assert.doesNotMatch(F.pitchTableCell({id:'joymore',name:'Unsafe',href},'company'),/<a\b/);
assert.match(F.pitchTableCell({id:'custom',name:'Custom',href:'https://example.com/company?id=1&view=summary'},'company'),/href="https:\/\/example\.com\/company\?id=1&amp;view=summary"/);
assert.doesNotMatch(F.pitchTableCell({id:'demo-luma',name:'Local example'},'company'),/<a\b/);
const unread=F.pitchTable({variant:'inbox',rows:[{id:'joymore',name:'Joymore',opened:false},{id:'cree8',name:'CREE8',opened:true}]});
assert.equal((unread.match(/class="pp-pitch-unopened-dot"/g)||[]).length,1);
assert.equal(F.resolve('component.table.inbox.unopenedSize'),'5px');
assert.match(unread,/aria-label="Unopened"/);assert.doesNotMatch(unread,/Decision for|data-pp-menu="select"/);
// Exercise the state model with cross-page selection and filter-reset invariants.
const state=F.createPitchInboxState({pageSize:5});
assert.equal(state.snapshot().total,12);assert.equal(state.snapshot().pages,3);
state.selectPage(true);assert.equal(state.snapshot().selected.length,5);
state.page(1);state.selectPage(true);assert.equal(state.snapshot().selected.length,10);
state.page(2);state.selectPage(true);assert.equal(state.snapshot().selected.length,12);
state.page(99);assert.equal(state.snapshot().page,2);
state.selectPage(false);assert.equal(state.snapshot().selected.length,10);
state.filter('stage','Prototype');assert.equal(state.snapshot().page,0);assert.equal(state.snapshot().selected.length,0);assert.equal(state.snapshot().total,3);
state.filter('round','Seed');assert.equal(state.snapshot().total,1);assert.equal(state.snapshot().rows[0].name,'ThermoCirca');
state.filter('stage','');assert.equal(state.snapshot().total,5,'Separate filter properties combine with AND');
state.search('not a company');assert.equal(state.snapshot().total,0);assert.equal(state.snapshot().pages,1);
state.clearFilters();state.sort('name');assert.equal(state.snapshot().rows[0].name,'CREE8');
state.sort('recency');assert.equal(state.snapshot().rows[0].name,'Kestrel Lens');
state.sort('score');assert.equal(state.snapshot().rows[0].name,'Luma Ledger');
state.selectPage(true);assert.equal(state.decide('not-valid'),0);assert.equal(state.snapshot().selected.length,5);
assert.equal(state.decide('interested'),5);assert.ok(state.snapshot().rows.every(row=>row.decision==='interested'));assert.equal(state.snapshot().selected.length,0);
assert.ok(state.undo());assert.ok(state.snapshot().rows.every(row=>row.decision===undefined));assert.equal(state.snapshot().canUndo,false);
state.selectPage(true);assert.equal(state.remove(),5);assert.equal(state.snapshot().total,7);state.undo();assert.equal(state.snapshot().total,12);
state.search('luma');state.selectPage(true);state.remove();assert.equal(state.snapshot().total,0);state.undo();assert.equal(state.snapshot().total,1);
state.reset();assert.equal(state.snapshot().total,12);assert.equal(state.snapshot().sort,'score');assert.equal(state.snapshot().canUndo,false);
const blank=F.createPitchInboxState({rows:[]});blank.selectPage(true);blank.page(-1);assert.equal(blank.snapshot().selected.length,0);assert.equal(blank.snapshot().page,0);assert.equal(blank.remove(),0);
const opened=F.createPitchInboxState({rows:[{id:'joymore',name:'Joymore'}]});opened.open('joymore');assert.equal(opened.snapshot().rows[0].opened,true);assert.equal(opened.snapshot().rows[0].unopened,false);assert.equal(opened.snapshot().canUndo,false);opened.reset();assert.equal(opened.snapshot().rows[0].opened,undefined);
// Simulated DOM events run the real delegated controller and its cleanup path.
class InboxNode extends EventNode{
 constructor(attrs={}){super(attrs);this.value='';this.disabled=false;this.checked=false;this.indeterminate=false;this.focusCount=0;for(const [key,value]of Object.entries(attrs))if(key.startsWith('data-'))this.dataset[key.slice(5).replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase())]=value;}
 matches(selector){const match=selector.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);return Boolean(match&&Object.hasOwn(this.attrs,match[1])&&(match[2]===undefined||this.attrs[match[1]]===match[2]));}
 closest(selector){if(selector==='tr')return this.row||null;for(const part of selector.split(','))if(this.matches(part))return this;return this.parent?.closest(selector)||null;}
 focus(){this.focusCount++;}
 removeAttribute(key){delete this.attrs[key];if(key==='open')this.open=false;}
 showModal(){this.open=true;}
 close(){this.open=false;for(const handler of this.events.close||[])handler({target:this});}
}

const inboxMarkup=F.pitchTable({variant:'inbox'}),inboxId=inboxMarkup.match(/data-pitch-inbox="([^"]+)"/)[1];
const host=new InboxNode({'data-pitch-inbox':inboxId}),rootInbox=new InboxNode(),body=new InboxNode(),nodes={};
const node=key=>nodes[key]??=(new InboxNode({[key.replace(/^\[|\]$/g,'')]:''}));
for(const key of ['[data-inbox-body]','[data-inbox-status]','[data-inbox-range]','[data-inbox-page-label]','[data-inbox-empty]','[data-inbox-score-heading]','[data-inbox-dock]','[data-inbox-count]'])host.queries[key]=node(key);
host.queries['[data-inbox-body]']=body;
for(const action of ['previous','next','undo','clear-selection','delete','reset','add-to-list','close-dialog'])host.queries[`[data-inbox-action="${action}"]`]=new InboxNode({'data-inbox-action':action});
const allBox=new InboxNode({'data-inbox-select':'all'});host.queries['[data-inbox-select="all"]']=allBox;
const inboxDialog=new InboxNode(),inboxDialogBody=new InboxNode(),inboxDialogTitle=new InboxNode();host.queries['[data-inbox-dialog]']=inboxDialog;host.queries['[data-inbox-dialog-body]']=inboxDialogBody;host.queries['[data-inbox-dialog-title]']=inboxDialogTitle;inboxDialogBody.contains=()=>true;
const inboxEvents=[];let cancelList=false;host.dispatchEvent=event=>{inboxEvents.push(event);return !(cancelList&&event.type==='forma:add-to-list');};
let rowBoxes=[],rowActions=[];
Object.defineProperty(body,'innerHTML',{set(html){this.html=html.replace(/src="data:[^"]+"/g,'src="data:image/png;base64,AA=="');rowBoxes=[...html.matchAll(/data-inbox-select="([^"]+)"/g)].map(([,id])=>{const box=new InboxNode({'data-inbox-select':id});box.row=new InboxNode();return box;});rowActions=[...html.matchAll(/data-inbox-row-action="([^"]+)"/g)].map(([,id])=>{const wrapper=new InboxNode({'data-inbox-row-action':id}),trigger=new InboxNode({'data-menu-control':''});trigger.parent=wrapper;wrapper.queries['[data-menu-control]']=trigger;return wrapper;});},get(){return this.html||'';}});
rootInbox.querySelectorAll=selector=>selector==='[data-pitch-inbox]'?[host]:[];
host.querySelectorAll=selector=>selector==='[data-inbox-select]'?[allBox,...rowBoxes]:selector==='[data-inbox-row-action]'?rowActions:[];
host.contains=()=>true;
const realWireMenus=F.wireMenus,realWireWorkspace=F.wireSourceWorkspace;let mountedRows=0,disposedRows=0,mountedMembership=0,disposedMembership=0;F.wireSourceWorkspace=()=>{mountedMembership++;return ()=>disposedMembership++;};
F.wireMenus=()=>{mountedRows++;return ()=>disposedRows++;};
let registeredCleanup;F.wirePitchTable(rootInbox,cleanup=>registeredCleanup=cleanup);
const emit=(type,target)=>{for(const handler of host.events[type]||[])handler({target,preventDefault(){}});};
const click=action=>emit('click',host.queries[`[data-inbox-action="${action}"]`]);
assert.equal(host.queries['[data-inbox-range]'].textContent,'1–5 of 12 companies');
click('next');assert.equal(host.queries['[data-inbox-range]'].textContent,'6–10 of 12 companies');
allBox.checked=true;emit('change',allBox);assert.equal(host.queries['[data-inbox-count]'].textContent,'5 selected');assert.equal(host.queries['[data-inbox-dock]'].hidden,false);
click('next');assert.equal(allBox.checked,false);assert.equal(rowBoxes.length,2);allBox.checked=true;emit('change',allBox);assert.equal(host.queries['[data-inbox-count]'].textContent,'7 selected');
rowBoxes[0].checked=false;emit('change',rowBoxes[0]);assert.equal(allBox.indeterminate,true);
click('clear-selection');assert.equal(host.queries['[data-inbox-dock]'].hidden,true);assert.equal(allBox.indeterminate,false);
click('reset');
allBox.checked=true;emit('change',allBox);emit('click',new InboxNode({'data-inbox-decision':'interested'}));assert.match(body.innerHTML,/>Interested</);assert.equal(host.queries['[data-inbox-dock]'].hidden,true);assert.equal(host.queries['[data-inbox-action="undo"]'].hidden,false);
click('undo');assert.doesNotMatch(body.innerHTML,/>Interested<\/span><\/td>/);
allBox.checked=true;emit('change',allBox);click('delete');assert.equal(host.queries['[data-inbox-range]'].textContent,'1–5 of 7 companies');click('undo');assert.equal(host.queries['[data-inbox-range]'].textContent,'1–5 of 12 companies');
// The source row action dialog opens company details or list membership; decisions stay bulk-only.
const companyAction=new InboxNode({'data-inbox-action':'company-actions','data-company-id':'application-kestrel-lens'});
emit('click',companyAction);assert.equal(inboxDialog.open,true);assert.equal(inboxDialogTitle.textContent,'Kestrel Lens');assert.match(inboxDialogBody.innerHTML,/Open company application/);assert.match(inboxDialogBody.innerHTML,/data-inbox-action="add-to-list"/);assert.doesNotMatch(inboxDialogBody.innerHTML,/Decision|Watching|Interested/);
emit('click',new InboxNode({'data-inbox-action':'add-to-list','data-company-id':'application-kestrel-lens'}));assert.equal(inboxDialogTitle.textContent,'Add to list');assert.match(inboxDialogBody.innerHTML,/pp-sw-membership/);assert.equal(mountedMembership,1);assert.deepEqual([...inboxEvents.at(-1).detail.companyIds],['application-kestrel-lens']);
const membershipChange={target:inboxDialogBody,detail:{listId:'watch',state:'true'}};for(const handler of host.events['forma:list-membership-change'])handler(membershipChange);assert.deepEqual([...membershipChange.detail.companyIds],['application-kestrel-lens']);
click('close-dialog');assert.equal(inboxDialog.open,false);assert.equal(companyAction.focusCount,1);assert.equal(disposedMembership,1);
allBox.checked=true;emit('change',allBox);click('add-to-list');assert.equal(inboxEvents.at(-1).detail.companyIds.length,5);assert.equal(mountedMembership,2);click('close-dialog');assert.equal(disposedMembership,2);
cancelList=true;click('add-to-list');assert.equal(mountedMembership,2,'A consuming application can intercept the list action');assert.equal(inboxDialog.open,false);cancelList=false;
const companyLink=new InboxNode({'data-inbox-company-link':'application-kestrel-lens',href:'https://pitch-investor-prototype.vercel.app/preview.html#company/application-kestrel-lens/summary'});emit('click',companyLink);assert.equal(inboxEvents.at(-1).type,'forma:company-open');assert.equal(inboxEvents.at(-1).detail.companyId,'application-kestrel-lens');

click('reset');assert.equal(host.queries['[data-inbox-action="undo"]'].hidden,true);assert.equal(host.queries['[data-inbox-status]'].textContent,'Preview reset');assert.ok(mountedRows>10);assert.equal(disposedRows,mountedRows-1);
registeredCleanup();assert.equal(disposedRows,mountedRows);for(const type of ['change','click'])assert.equal(host.events[type].length,0);
F.wireMenus=realWireMenus;F.wireSourceWorkspace=realWireWorkspace;assert.equal(disposedMembership,mountedMembership);assert.equal(inboxDialog.events.close.length,0);for(const type of ['forma:list-membership-change','forma:collection-save'])assert.equal(host.events[type].length,0);

// The counted variation uses the existing tab keyboard controller, including the count/icon markup.
const countedRoot=new InboxNode(),countedPanels=Array.from({length:6},()=>new InboxNode()),countedTabs=countedPanels.map((panel,index)=>new InboxNode({'aria-controls':'counted-panel-'+index,'aria-selected':String(index===0)}));
countedRoot.querySelectorAll=selector=>selector==='.pp-pitch-tabs-wrap'?[countedRoot]:selector==='[role="tab"]'?countedTabs:[];
countedPanels.forEach((panel,index)=>countedRoot.queries['#counted-panel-'+index]=panel);
// Supply the actual tablist/surface geometry required by the sliding controller.
const countedList=new InboxNode(),countedSurface=new InboxNode(),countedWindow=new InboxNode();
countedList.style={};countedSurface.style={};countedList.classList={contains:name=>name==='pp-pitch-counted'};
countedList.getBoundingClientRect=()=>({left:0,top:0,width:480,height:32});countedList.append=node=>countedList.child=node;
countedSurface.getBoundingClientRect=()=>({left:0,top:0,width:80,height:32});countedSurface.remove=()=>{countedSurface.removed=true;countedList.child=null;};
countedTabs.forEach((tab,index)=>tab.getBoundingClientRect=()=>({left:index*80,top:0,width:80,height:32}));
countedRoot.queries['[role="tablist"]']=countedList;countedRoot.ownerDocument={defaultView:countedWindow,createElement:()=>countedSurface,body:{classList:{contains:()=>false}}};
F.wirePitchTabs(countedRoot,cleanup=>F.previewCleanups.push(cleanup));
assert.equal(countedList.getAttribute('data-sliding-tabs'),'');assert.equal(countedSurface.style.width,'80px');
countedTabs[2].click();assert.equal(countedTabs[2].getAttribute('aria-selected'),'true');assert.ok(countedPanels.every((panel,index)=>panel.hidden===(index!==2)));
for(const [index,key,expected]of [[2,'ArrowRight',3],[3,'End',5],[5,'ArrowRight',0],[0,'Home',0]]){for(const handler of countedTabs[index].events.keydown||[])handler({key,preventDefault(){}});assert.equal(countedTabs[expected].getAttribute('aria-selected'),'true');assert.ok(countedTabs[expected].focusCount>0);assert.ok(countedPanels.every((panel,n)=>panel.hidden===(n!==expected)));}
F.clearPreviews();assert.equal(countedSurface.removed,true);assert.equal(countedList.getAttribute('data-sliding-tabs'),null);assert.equal(countedWindow.events.resize.length,0);for(const tab of countedTabs){assert.equal(tab.events.click.length,0);assert.equal(tab.events.keydown.length,0);}
// Standalone filter controller: report criteria, reuse menu state and clean every listener.
class FilterNode extends InboxNode{
 constructor(attrs={}){super(attrs);this.children=[];this.style={};this.scrollHeight=280;this.hasAttribute=key=>Object.hasOwn(this.attrs,key);this.classNames=new Set();this.classList={toggle:(key,value)=>value?this.classNames.add(key):this.classNames.delete(key)};}
 querySelectorAll(key){const result=this.queries[key];return Array.isArray(result)?result:result?[result]:[];}
 append(child){if(child.parent){child.parent.children=child.parent.children.filter(node=>node!==child);}child.parent=this;child.parentElement=this;this.children.push(child);}
 contains(child){return child===this||this.children.some(node=>node.contains(child));}
 dispatchEvent(event){event.target??=this;(this.events[event.type]||[]).forEach(fn=>fn(event));return true;}
 dispatch(type,props={}){const event={type,preventDefault(){this.defaultPrevented=true;},...props};this.dispatchEvent(event);return event;}
 getBoundingClientRect(){return {left:750,right:866,top:50,bottom:84,width:116,height:34};}
}
let filterInteractions=0;
for(const portal of [false,true]){
 const markup=F.pitchFilterBar({filters:{stage:['Live']}}),id=markup.match(/data-pitch-filters="([^"]+)"/)[1],root=new FilterNode(),host=new FilterNode({'data-pitch-filters':id}),doc=new FilterNode(),win=new FilterNode(),panel=new FilterNode(),fields=new FilterNode(),control=new FilterNode(),toggle=new FilterNode({'data-pitch-filter-toggle':''}),search=new FilterNode(),query=new FilterNode(),clearSearch=new FilterNode({'data-pitch-search-clear':''}),searchToggle=new FilterNode({'data-pitch-search-toggle':''}),close=new FilterNode({'data-pitch-filter-close':''}),clear=new FilterNode({'data-pitch-filter-clear':''}),status=new FilterNode(),counter=new FilterNode();
 root.queries['[data-pitch-filters]']=[host];host.ownerDocument=doc;doc.defaultView=win;doc.body=new FilterNode();win.innerWidth=900;win.innerHeight=700;win.CustomEvent=class{constructor(type,config){this.type=type;Object.assign(this,config);}};doc.getElementById=()=>null;
 host.append(control);host.append(search);control.append(toggle);control.append(panel);panel.append(fields);panel.append(close);panel.append(clear);search.append(query);search.append(clearSearch);search.append(searchToggle);search.dataset.searchPersistent='false';
 if(!portal){panel.showPopover=()=>panel.opened=true;panel.hidePopover=()=>panel.opened=false;}
 const pairs={'[data-pitch-filter-panel]':panel,'[data-pitch-filter-toggle]':toggle,'[data-pitch-filter-fields]':fields,'[data-pitch-search]':search,'[data-pitch-query]':query,'[data-pitch-search-clear]':clearSearch,'[data-pitch-search-toggle]':searchToggle,'[data-pitch-criteria-status]':status,'[data-pitch-filter-count]':counter};Object.assign(host.queries,pairs);panel.queries['[data-pitch-filter-close]']=close;
 let mounts=0,unmounts=0,events=[];F.wireMenus=()=>{mounts++;return ()=>unmounts++;};host.addEventListener('forma:criteria-change',event=>events.push(event.detail));
 const cleanup=F.wirePitchFilterBar(root);F.wirePitchFilterBar(root);assert.equal(mounts,1,'Duplicate wiring does not attach duplicate listeners');assert.equal(counter.textContent,' (1)');
 host.dispatch('click',{target:toggle});assert.equal(toggle.getAttribute('aria-expanded'),'true');assert.equal(panel.hidden,false);assert.ok(Number.parseFloat(panel.style.left)+Number.parseFloat(panel.style.width)<=892,'Right edge uses shared collision-aware placement');assert.equal(close.focusCount,1);if(portal)assert.equal(panel.parent,doc.body);
 const stage=new FilterNode({'data-pitch-filter-field':'stage'}),input=new FilterNode({'data-menu-control':''});stage.append(input);fields.append(stage);input.dataset.values='["Prototype","Growth"]';(portal?panel:host).dispatch('change',{target:input});assert.equal(JSON.stringify(events.at(-1).filters.stage),'["Prototype","Growth"]');assert.equal(counter.textContent,' (2)');assert.match(status.textContent,/Stage: Prototype, Growth/);
 const sort=new FilterNode({'data-pitch-sort':''}),sortInput=new FilterNode({'data-menu-control':''});host.append(sort);sort.append(sortInput);sortInput.dataset.value='recency';host.dispatch('change',{target:sortInput});assert.equal(events.at(-1).sort,'recency');
 query.value='Luma';query.dispatch('input');assert.equal(events.at(-1).query,'Luma');assert.equal(clearSearch.hidden,false);host.dispatch('click',{target:clearSearch});assert.equal(events.at(-1).query,'');assert.equal(clearSearch.hidden,true);assert.equal(query.hidden,false);
 (portal?panel:host).dispatch('click',{target:clear});assert.ok(Object.values(events.at(-1).filters).every(values=>!values.length));assert.equal(mounts,2);assert.equal(unmounts,1);assert.equal(counter.textContent,'');assert.equal(events.at(-1).sort,'recency','Clearing filters preserves the independent sort');
 doc.dispatch('keydown',{target:close,key:'Escape'});assert.equal(panel.hidden,true);assert.equal(toggle.focusCount,1);if(portal)assert.equal(panel.parent,control);
 host.dispatch('click',{target:toggle});doc.dispatch('pointerdown',{target:new FilterNode()});assert.equal(panel.hidden,true);
 host.dispatch('click',{target:toggle});cleanup();cleanup();assert.equal(panel.hidden,true);assert.equal(unmounts,mounts,'Menu cleanup is balanced and idempotent');for(const node of [host,panel,query,doc,win])for(const [type,listeners]of Object.entries(node.events))if(type!=='forma:criteria-change')assert.equal(listeners.length,0,`Leaked filter listener ${type}`);
 F.wireMenus=realWireMenus;filterInteractions+=8;
}

// Managed Chat rows retain selection and source cells as Show more grows the local result set.
const chatHTML=F.pitchTable({columnSet:'financial',selectable:true}),chatId=chatHTML.match(/data-pitch-chat-table="([^"]+)"/)[1],chatRoot=new FilterNode(),chatHost=new FilterNode({'data-pitch-chat-table':chatId}),chatBody=new FilterNode(),chatStatus=new FilterNode(),moreButton=new FilterNode({'data-chat-more':''}),saveButton=new FilterNode({'data-chat-save-list':''}),chatAll=new FilterNode({'data-chat-select':'all'}),chatWindow=new FilterNode();
chatWindow.CustomEvent=class{constructor(type,props){this.type=type;Object.assign(this,props);}};chatHost.ownerDocument={defaultView:chatWindow};chatRoot.queries['.pp-pitch-table-block[data-pitch-chat-table]']=[chatHost];chatHost.queries={'[data-chat-body]':chatBody,'[data-chat-status]':chatStatus,'[data-chat-more]':moreButton};chatHost.append(chatBody);chatHost.append(moreButton);chatHost.append(saveButton);chatHost.append(chatAll);
let chatRows=[],chatBoxes=[],chatHeadings=['score','revenue','traction'].map(key=>new FilterNode({'data-column':key,'aria-sort':key==='score'?'descending':'none'}));
Object.defineProperty(chatBody,'innerHTML',{set(html){this.html=html;chatRows=[...html.matchAll(/<tr data-name="([^"]*)" data-score="([^"]*)" data-chat-row="([^"]*)"/g)].map(([,name,score,id])=>{const row=new FilterNode({'data-chat-row':id});row.dataset.name=name;row.dataset.score=score;return row;});chatBoxes=chatRows.map(row=>{const box=new FilterNode({'data-chat-select':row.dataset.chatRow});box.row=row;return box;});},get(){return this.html;}});
chatHost.querySelectorAll=selector=>selector==='[data-chat-select]'?[chatAll,...chatBoxes]:selector==='[data-chat-row]'?chatRows:selector==='th[aria-sort]'?chatHeadings:[];
let savedList=null;chatHost.addEventListener('forma:save-list',event=>savedList=event.detail);
const disposeChat=F.wirePitchChatTable(chatRoot);F.wirePitchChatTable(chatRoot);assert.equal(chatRows.length,5);assert.equal(chatHost.events.click.length,1);chatAll.checked=true;chatHost.dispatch('change',{target:chatAll});assert.equal(chatStatus.textContent,'5 of 12 items · 5 selected');
chatHost.dispatch('click',{target:moreButton});assert.equal(chatRows.length,10);assert.equal(chatAll.indeterminate,true);assert.equal(chatRows[5].focusCount,1);chatHost.dispatch('click',{target:moreButton});assert.equal(chatRows.length,12);assert.equal(moreButton.hidden,true);assert.equal(chatStatus.textContent,'12 of 12 items · 5 selected');
const revenueSort=new FilterNode({'data-chat-sort':'revenue'});chatHost.append(revenueSort);chatHost.dispatch('click',{target:revenueSort});assert.equal(chatRows[0].dataset.name,'Orbit Assist');assert.equal(chatHeadings[1].getAttribute('aria-sort'),'descending');chatHost.dispatch('click',{target:revenueSort});assert.equal(chatRows[0].dataset.name,'Kite Research');assert.equal(chatHeadings[1].getAttribute('aria-sort'),'ascending');assert.equal(chatBoxes.filter(box=>box.checked).length,5,'Selected IDs survive reordering and load-more');
chatHost.dispatch('click',{target:saveButton});assert.equal(savedList.companyIds.length,12);assert.equal(JSON.stringify(savedList.columns),JSON.stringify(sourceColumnSets.financial));assert.match(chatStatus.textContent,/requested/);assert.doesNotMatch(chatStatus.textContent,/saved/);
disposeChat();disposeChat();assert.equal(chatHost.events.click.length,0);assert.equal(chatHost.events.change.length,0);

console.log(JSON.stringify({filterConfigurations,filterInteractions,countedTabKeyboardActions:5,inboxConfigurations,inboxInteractions:'pagination, selection, decisions, delete, undo, reset, company links/actions, list membership, cleanup',pitchPatternConfigurations:configurations,uniqueTabIds:ids.size,numericSortActions:4,chatControllerActions:6,sourceGeometry:'matched',tokens:'aliased',status:'passed',scope:'markup, token, CSS and simulated event contracts; not browser visual validation'}));

// A portaled filter retains the same atom theme and explicit inner spacing.
const filterMarkup=F.pitchFilterBar({filters:{stage:['Live','Prototype','Growth']}});
assert.match(filterMarkup,/class="pp-theme pp-pitch-filter-panel"/);
assert.equal(F.resolve('component.filter.panel.padding'),'16px');
assert.ok(F.pitchFilterTokens().includes('component.filter.panel.padding'));
assert.match(filterMarkup,/data-hugeicon="FilterIcon" width="16"/);
assert.match(css,/pp-pitch-filter-fields\{[^}]+padding:var\(--pp-component-filter-panel-padding\)/);

// Destructive action uses the supported button variant, never the unknown-variant success fallback.
const inboxDelete=F.pitchTable({variant:'inbox'}).match(/<button[^>]+data-inbox-action="delete"[^>]*>/)?.[0];
assert.ok(inboxDelete,'Inbox delete control exists');
assert.match(inboxDelete,/pp-button destructive/);
assert.match(inboxDelete,/--demo-button-bg:var\(--pp-component-button-danger-background\)/);
assert.match(inboxDelete,/--demo-button-fg:var\(--pp-component-button-danger-foreground\)/);
assert.ok(F.pitchTableTokens({variant:'inbox'}).includes('component.button.danger.background'));

// Inbox row actions retain the source's shared 32px small icon button with no divergent geometry overrides.
const inboxAction=F.pitchTable({variant:'inbox'}).match(/<button[^>]+data-inbox-action="company-actions"[^>]*>/)?.[0];
assert.ok(inboxAction);assert.match(inboxAction,/pp-button ghost size-sm/);
assert.match(inboxAction,/--demo-button-height:var\(--pp-component-control-height-sm\)/);
assert.equal(F.resolve('component.control.height.sm'),'32px');
assert.equal(css.match(/\.pp-pitch-inbox-actions>\.pp-button\{([^}]+)\}/)?.[1],'display:flex');
