/* AI response source, data, semantics and interaction contracts. No browser is launched. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist');
const doc={createElement:()=>({}),getElementById:()=>({}),head:{append(){}}};
const context={window:{},document:doc,Intl,CustomEvent:class{constructor(type,options){this.type=type;Object.assign(this,options);}}};vm.createContext(context);
for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','avatar.js','spinner.js','chip.js','menus.js','pitch-patterns.js','ai-response.js','card-patterns.js','catalogue.js','previews.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const F=context.window.Forma,css=fs.readFileSync(path.join(dist,'ai-response.css'),'utf8');
assert.deepEqual(Array.from(F.aiResponseVariants),['text','table','statistics','overview','brief','revenue','market','search']);
assert.deepEqual(Array.from(F.byId['ai-response'].controls.find(control=>control.key==='variant').options),Array.from(F.aiResponseVariants));assert.equal(F.byId['ai-response'].controls.some(control=>control.key==='metric'),false);
for(const variant of ['comparison','meeting'])assert.doesNotMatch(F.aiResponse({variant,actions:false,followups:false}),/pp-ai-comparison|pp-ai-meeting|Overall scores|Can you show a recent customer/);
for(const variant of ['statistics','overview','brief']){
 const rendered=F.aiResponse({variant,actions:false,followups:false});assert.match(rendered,/class="pp-pitch-table-card pp-ai-card/);assert.match(rendered,/class="pp-pitch-table-head"/);assert.match(rendered,/class="pp-pitch-table-icon"/);assert.ok(rendered.includes(F.icon('grid',14))); assert.match(rendered,/class="pp-ai-card-inner/);
 for(const token of F.resultCardHeaderTokens({detail:variant!=='brief'}))assert.ok(F.aiResponseTokens({variant}).includes(token),variant+' header token '+token);
}
assert.match(F.aiResponse({variant:'statistics'}),/<h3>Workspace opportunities<\/h3>/);
for(const format of ['structured','plain','empty']){const rendered=F.aiResponse({variant:'text',format});assert.ok(rendered.indexOf('class="pp-ai-followups"')<rendered.indexOf('class="pp-ai-message-actions"'),'Suggestion pills precede the reserved action row');}
assert.match(css,/\.pp-ai-followups\{[^}]*margin-top:var\(--pp-space-16\)/);assert.doesNotMatch(css,/\.pp-ai-overview>header\{|\.pp-ai-brief>header\{/);
assert.doesNotMatch(css,/\.pp-ai-projection svg\{/);assert.match(css,/\.pp-ai-projection>svg,\.pp-ai-projection figure>svg\{display:block;width:100%/);
for(const [variant,key]of [['revenue','coins'],['market','globe']]){const rendered=F.aiResponse({variant,actions:false,followups:false});assert.ok(rendered.includes(`<span class="pp-ai-projection-symbol">${F.icon(key,16)}</span>`),variant+' keeps its source16px glyph inside the28px tile');assert.match(F.icon(key,16),/stroke-width="1.25"/);}
assert.deepEqual(Array.from(F.componentParts(F.byId['ai-response'],{variant:'text',format:'plain',followups:false,actions:false})),[]);assert.deepEqual(Array.from(F.componentParts(F.byId['ai-response'],{variant:'statistics',followups:false,actions:false})),['stats-bar']);
let configurations=0;const ids=new Set();
for(const variant of F.aiResponseVariants)for(const research of [false,true])for(const followups of [false,true]){
 const c={variant,research,followups},html=F.aiResponse(c);
 assert.match(html,/<article class="pp-ai-response" aria-label="Assistant response">/);
 assert.equal(html.includes('class="pp-ai-research"'),research);
 assert.equal(html.includes('class="pp-ai-followups"'),followups);
 assert.doesNotMatch(html,/undefined|NaN|Infinity/);
 for(const [,id]of html.matchAll(/\bid="([^"]+)"/g)){assert.ok(!ids.has(id),`Duplicate ID ${id}`);ids.add(id);}
 for(const token of F.aiResponseTokens(c)){assert.ok(F.tokens[token],`Missing ${variant} token ${token}`);F.resolve(token);}
 const buttons=html.match(/<button\b[^>]*>/g)||[];assert.ok(buttons.every(button=>/type="button"/.test(button)),'No accidental form submission');
 if(variant==='table'){assert.match(html,/pp-pitch-table/);assert.match(html,/data-chat-sort="score"/);}
 if(variant==='statistics'){assert.equal((html.match(/<dt>/g)||[]).length,4);assert.ok(html.includes(F.statsBar({variant:'statistics'})),'Response reuses the same stats strip as its standalone page');}
 if(variant==='overview'){assert.match(html,/pp-ai-overview-narrative/);assert.match(html,/<th scope="row">Industry/);}
 if(variant==='revenue')assert.equal((html.match(/class="pp-ai-revenue-point" tabindex="0"/g)||[]).length,9);
 if(variant==='market')assert.equal((html.match(/class="pp-ai-market-segment tone-/g)||[]).length,3);
 configurations++;
}
for(const focus of ['risks','team','traction','problem']){const html=F.aiResponse({variant:'brief',focus,followups:false});assert.equal((html.match(/<h4>/g)||[]).length,3);configurations++;}
for(const research of [false,true]){
 const html=F.aiResponse({state:'thinking',research});assert.doesNotMatch(html,/pp-ai-response-content|pp-ai-followups/);
 assert.match(html,research?/aria-busy="true"/:/role="status"/);configurations++;
}
// One source-backed text shimmer powers both documentation and assistant thinking.
assert.match(F.aiResponse({state:'thinking'}),/pp-shimmer/,'Thinking reuses the shared shimmer');
assert.equal(F.preview(F.byId['text-shimmer'],{text:'Thinking'}),F.textShimmer({text:'Thinking'}));
assert.equal(F.resolve('component.motion.shimmer.highlight'),F.resolve('color.gray.200'));
const motionCSS=fs.readFileSync(path.join(dist,'components.css'),'utf8');
assert.match(motionCSS,/linear-gradient\(90deg,var\(--pp-component-motion-shimmer-foreground\) 40%,var\(--pp-component-motion-shimmer-highlight\) 50%,var\(--pp-component-motion-shimmer-foreground\) 60%\)/);
assert.match(motionCSS,/@keyframes pp-text-shimmer\{from\{background-position:100% 0\}to\{background-position:-100% 0\}\}/);
assert.match(motionCSS,/-webkit-text-fill-color:transparent/);
assert.match(motionCSS,/@media\(prefers-reduced-motion:reduce\)[\s\S]*?\.pp-shimmer\{[^}]*-webkit-text-fill-color:var\(--pp-component-motion-shimmer-foreground\)/);
assert.match(motionCSS,/@media\(forced-colors:active\)\{\.pp-shimmer\{[^}]*-webkit-text-fill-color:CanvasText/);
assert.match(motionCSS,/body\.motion-paused \.pp-theme/);
for(const layout of ['single','group'])for(const icon of [false,true])for(const disabled of [false,true]){
 const html=F.aiFollowups({layout,icon,disabled,label:'A < B'});assert.equal((html.match(/data-ai-followup=/g)||[]).length,layout==='single'?1:4);assert.equal(html.includes('pp-followup-icon'),icon);assert.equal(html.includes(' disabled'),disabled);assert.doesNotMatch(html,/aria-pressed/);if(layout==='single')assert.match(html,/A &lt; B/);for(const token of F.aiFollowupTokens({icon,disabled}))assert.ok(F.tokens[token],token);
}
const citation=F.aiCitation({label:'Q1',status:'Recorded',title:'Founder answer',body:'A < B & C',source:'Application'});
const control=citation.match(/aria-controls="([^"]+)"/)[1];assert.ok(citation.includes(`id="${control}"`));assert.match(citation,/popover="auto" role="dialog"/);assert.match(citation,/aria-expanded="false"/);assert.match(citation,/A &lt; B &amp; C/);assert.match(citation,/hidden/);
// Inline citations reuse the raised tag surface while retaining their compact text geometry.
for(const [role,shared]of Object.entries({radius:'radius',background:'background',shadow:'shadow',weight:'weight',font:'font.sm',line:'line.sm',foreground:'blueForeground'})){
 assert.equal(F.tokens['component.citation.'+role].value,'{component.tag.'+shared+'}','Citation '+role+' stays in the shared raised family');
}
assert.equal(F.resolve('component.citation.radius'),'6px');assert.equal(F.resolve('component.citation.font'),'10px');assert.equal(F.resolve('component.citation.line'),'14px');
assert.equal(F.chain('component.citation.shadow').at(-1),'shadow.tag');
assert.match(citation,/class="pp-ai-citation"/);assert.doesNotMatch(citation,/data-smooth-/);
assert.match(css,/button\.pp-ai-citation\{[^}]*min-height:var\(--pp-size-18\)/);
assert.match(css,/button\.pp-ai-citation:focus-visible\{border-radius:var\(--pp-component-citation-radius\)\}/,'Keyboard focus retains the citation radius instead of the generic 4px radius');
for(const html of [F.aiResponse({text:'<img src=x onerror=1>'}),F.aiResponse({variant:'brief',company:{name:'<script>',problem:'<svg>'},focus:'problem'}),F.aiCitation({title:'<script>',body:'<img>'}),F.aiFollowups({suggestions:['<script>']})])assert.doesNotMatch(html,/<script>|<img src=x|<svg>/);
const series=F.aiRevenueSeries({baseline:100,rate:10,horizon:12});assert.equal(series.length,5);assert.ok(Math.abs(series.at(-1).value-146.41)<.00001);assert.equal(series.at(-1).month,12);
assert.ok(F.aiRevenueSeries({baseline:-1,rate:-9,horizon:0}).every(point=>Number.isFinite(point.value)&&point.value>=0));
for(const config of [{},{total:100,reachable:500,target:600},{total:0,reachable:-5,target:-2}]){
 const segments=F.aiMarketSegments(config),sum=segments.reduce((n,segment)=>n+segment.value,0);
 assert.ok(segments.every(segment=>segment.value>=0));assert.equal(sum,config.total===undefined?10000:Math.max(1,config.total));
}
const vars=new Set(Object.keys(F.tokens).map(F.varName));for(const [,name]of css.matchAll(/var\((--pp-[\w-]+)/g))assert.ok(vars.has(name),`Missing CSS token ${name}`);
for(const [id,token]of Object.entries(F.tokens).filter(([id])=>/^component\.(response|research|citation|sourcePopover)\./.test(id))){assert.match(token.value,/^\{.+\}$/);for(const ref of F.chain(id).slice(1))assert.equal(F.tokens[ref].type,token.type);}
assert.equal(F.resolve('component.sourcePopover.width'),'365px');assert.equal(F.resolve('component.sourcePopover.radius'),'16px');assert.equal(F.resolve('component.response.overview.padding'),'36px');assert.equal(F.resolve('component.response.brief.inset'),'6px');assert.equal(F.resolve('component.research.indent'),'24px');
assert.match(css,/\.pp-ai-market-target\{grid-column:1;grid-row:2/,'Final market override puts the headline below the icon');
assert.match(css,/\.pp-ai-market-legend\{grid-column:2;grid-row:2/,'Legend stays below the chart, per final source override');
assert.match(css,/@container\(max-width:400px\)/);assert.match(css,/@media\(forced-colors:active\)/);

// Exercise actual citation and follow-up event handlers with a small DOM harness.
class Node{
 constructor(attrs={}){this.attrs={...attrs};this.events={};this.queries={};this.dataset={};this.hidden=true;this.isConnected=true;this.open=false;this.textContent='';this.children=[];this.style={setProperty:(key,value)=>{this.style[key]=value;}};}
 hasAttribute(key){return key in this.attrs;}getAttribute(key){return this.attrs[key]??null;}setAttribute(key,value){this.attrs[key]=String(value);}
 querySelector(key){const value=this.queries[key];return Array.isArray(value)?value[0]||null:value||null;}
 querySelectorAll(key){const value=this.queries[key];return value?(Array.isArray(value)?value:[value]):[];}
 addEventListener(type,fn){(this.events[type]??=[]).push(fn);}removeEventListener(type,fn){this.events[type]=(this.events[type]||[]).filter(handler=>handler!==fn);}
 dispatch(type,data={}){const event={target:this,preventDefault(){this.prevented=true;},stopPropagation(){},...data};for(const handler of this.events[type]||[])handler(event);return event;}
 dispatchEvent(event){this.dispatched=event;return true;}contains(node){return this===node||this.children.includes(node);}matches(selector){return selector===':popover-open'&&this.open;}
 showPopover(){this.open=true;}hidePopover(){this.open=false;this.dispatch('toggle',{newState:'closed'});}focus(){eventDoc.activeElement=this;}
}
const eventDoc=new Node(),view=new Node();view.innerWidth=1024;view.innerHeight=768;eventDoc.defaultView=view;
const root=new Node(),trigger=new Node({'aria-controls':'source-example','aria-expanded':'false'}),pop=new Node(),closeButton=new Node();
root.ownerDocument=eventDoc;root.queries={'[data-ai-source-trigger]':[trigger],'#source-example':pop};pop.queries={'[data-ai-source-close]':closeButton};pop.children=[closeButton];pop.offsetWidth=365;pop.offsetHeight=250;trigger.getBoundingClientRect=()=>({left:990,top:720,width:20,bottom:740});
let cleanup;F.wireAIResponse(root,fn=>cleanup=fn);trigger.dispatch('click');assert.equal(pop.open,true);assert.equal(trigger.getAttribute('aria-expanded'),'true');assert.equal(eventDoc.activeElement,pop);assert.equal(pop.style.left,'647px');assert.equal(pop.style.top,'458px');assert.equal(pop.dataset.side,'above');
eventDoc.dispatch('keydown',{key:'Escape'});assert.equal(pop.hidden,true);assert.equal(pop.open,false);assert.equal(trigger.getAttribute('aria-expanded'),'false');assert.equal(eventDoc.activeElement,trigger);
trigger.dispatch('click');eventDoc.dispatch('pointerdown',{target:new Node()});assert.equal(pop.hidden,true,'Outside click dismisses');
trigger.dispatch('click');trigger.dispatch('pointerdown');pop.hidePopover();trigger.dispatch('click');assert.equal(pop.hidden,true,'Native light dismissal must not reopen on the same trigger click');
trigger.dispatch('click');cleanup();assert.equal(pop.hidden,true);assert.ok(Object.values(eventDoc.events).every(handlers=>handlers.length===0));assert.ok(Object.values(view.events).every(handlers=>handlers.length===0));assert.equal(trigger.events.click.length,0);
const followRoot=new Node(),group=new Node(),status=new Node(),first=new Node(),second=new Node();followRoot.ownerDocument=eventDoc;followRoot.queries={'[data-ai-followup]':[first,second]};group.queries={'[data-ai-followup]':[first,second]};group.nextElementSibling=status;first.closest=second.closest=()=>group;first.dataset.aiFollowup='Compare by revenue';second.dataset.aiFollowup='Review the evidence';
let clearFollow;F.wireAIResponse(followRoot,fn=>clearFollow=fn);second.dispatch('click');assert.equal(first.getAttribute('aria-pressed'),null);assert.equal(second.getAttribute('aria-pressed'),null,'A follow-up is an action, not a toggle');assert.equal(status.textContent,'Selected follow-up: Review the evidence');assert.equal(followRoot.dispatched.type,'forma:followup');assert.equal(followRoot.dispatched.detail.text,'Review the evidence');second.disabled=true;status.textContent='Untouched';followRoot.dispatched=null;second.dispatch('click');assert.equal(status.textContent,'Untouched');assert.equal(followRoot.dispatched,null);clearFollow();assert.equal(second.events.click.length,0);
// Source variations from the complete live-module inventory.
for(const [focus,labels]of [['team',['Team score','Founders','Stage']],['traction',['Revenue','Funding','Runway']]]){
 const html=F.aiResponse({variant:'brief',focus,followups:false});for(const label of labels)assert.ok(html.includes('<dt>'+label+'</dt>'));assert.doesNotMatch(html,/<dt>Ask<\/dt>/);
}
for(const stage of ['reading','calculating','drafting','complete'])for(const sourceMode of ['link','popover']){
 const c={stage,sourceMode},html=F.aiResearchActivity(c);assert.ok(html.includes('data-research-stage="'+stage+'"'));assert.equal(html.includes('Reading 2 files'),stage==='reading');assert.equal(html.includes('aria-busy="true"'),stage!=='complete');assert.equal(html.includes('data-ai-source-trigger'),sourceMode==='popover');assert.equal(html.includes('<a class="pp-ai-source-chip"'),sourceMode==='link');for(const token of F.aiResearchActivityTokens(c))assert.ok(F.tokens[token],token);
}
assert.equal((F.thinkingGrid().match(/<path/g)||[]).length,25);assert.equal((F.thinkingGrid().match(/class="pp-thinking-pulse"/g)||[]).length,5);assert.match(css,/pp-thinking-pulse/);
for(const format of ['plain','empty']){const html=F.aiResponse({variant:'text',format,followups:false});assert.doesNotMatch(html,/pp-ai-citation|<ul>|pp-ai-response-intro/);assert.match(html,/<p>[^<]+<\/p>/);}
assert.match(F.aiResponse({variant:'brief'}),/<a[^>]*href="https:\/\/pitch-investor-prototype/);assert.doesNotMatch(F.aiResponse({variant:'brief',company:{href:'javascript:alert(1)'}}),/href="javascript:/);
assert.match(F.aiResponse({variant:'revenue',rate:20,horizon:12,baseline:1000000}),/over 12 months/);
assert.equal(F.aiResearchActivityTokens({state:'thinking',stage:'complete'}).includes('component.motion.shimmer.highlight'),false);
assert.equal(F.aiResponseTokens({state:'thinking',research:true,stage:'complete'}).includes('component.motion.shimmer.highlight'),false);
assert.equal(F.aiResearchActivityTokens({state:'complete',stage:'reading'}).includes('component.motion.shimmer.highlight'),true);

// Compact AI composition contracts.
assert.equal(typeof F.aiTaskRows,'function');
assert.equal(typeof F.aiWebSearch,'function');
const tasks=F.aiTaskRows({step:'Exploring'});
assert.equal((tasks.match(/data-ai-task-trigger/g)||[]).length,4);assert.match(tasks,/<ul class="pp-ai-task-rows/);
assert.match(tasks,/running/);assert.match(tasks,/queued/);assert.match(tasks,/data-hugeicon="CircleDashedIcon"/);assert.doesNotMatch(tasks,/data-hugeicon="Clock01Icon"/);assert.doesNotMatch(tasks,/<ol|<small/);
assert.equal(F.resolve('component.taskRows.width'),'480px');assert.equal(F.resolve('component.taskRows.icon'),'20px');assert.equal(F.resolve('component.taskRows.check'),'12px');assert.equal(F.resolve('component.taskRows.rowGap'),'10px');assert.equal(F.resolve('component.taskRows.paddingY'),'10px');assert.equal(F.resolve('component.taskRows.expandDuration'),'240ms');
for(const token of F.aiTaskRowsTokens())assert.ok(F.tokens[token],token);
const customTasks=F.aiTaskRows({tasks:[{title:'Queued',status:'queued',detail:'2 files'},{title:'Running',status:'running',note:'Inspect records'},{title:'Completed',status:'completed',note:'Done'},{title:'Failed',status:'failed',note:'Try again'}]});
assert.match(customTasks,/pp-ai-task-detail/);assert.match(customTasks,/data-phase-state="failed"/);assert.match(customTasks,/data-hugeicon="Tick02Icon" width="12"/);assert.match(customTasks,/data-hugeicon="CircleDashedIcon" width="20"/);assert.match(customTasks,/--spinner-size:var\(--pp-component-taskRows-icon\)/);assert.match(customTasks,/data-hugeicon="ArrowDown01Icon" width="12"/);assert.match(F.aiTaskRows({variant:'Compact'}),/is-compact/);assert.doesNotMatch(F.aiTaskRows({variant:'Compact'}),/aria-expanded|data-ai-task-note/);assert.equal((F.aiTaskRows({variant:'Compact'}).match(/ disabled/g)||[]).length,4);
assert.match(css,/pp-task-pop\{0%\{opacity:0;transform:scale\(\.85\)/);assert.match(css,/grid-template-rows var\(--pp-component-taskRows-expandDuration\)/);assert.match(css,/aria-expanded=true\]>svg:last-child\{transform:rotate\(180deg\)/);
// The public page and research messages share exactly one native-size 25-dot SVG helper.
assert.equal(F.preview(F.byId['ai-loader'],{}),`<span role="status" aria-label="Thinking">${F.thinkingGrid({})}</span>`);assert.equal(F.byId['ai-loader'].controls.some(control=>control.key==='grid'),false);assert.equal(F.resolve('component.aiLoader.size'),'16px');assert.equal(F.resolve('component.aiLoader.duration'),'3667ms');
const ppLoader='/Users/vansitaaddanki/pp-admin/investor-preview/assets/thinking-grid.svg';
if(fs.existsSync(ppLoader)){
 const source=fs.readFileSync(ppLoader,'utf8'),rendered=F.thinkingGrid();
 const sourcePaths=[...source.matchAll(/<path\b([^>]+)>/g)].map(([,attrs])=>({d:attrs.match(/\bd="([^"]+)"/)[1],opacity:Number(attrs.match(/(?:fill-)?opacity="([^"]+)"/)?.[1]||1),pulse:attrs.includes('class="pulse"')}));
 const livePaths=[...rendered.matchAll(/<path\b([^>]+)>/g)].map(([,attrs])=>({d:attrs.match(/\bd="([^"]+)"/)[1],opacity:Number(attrs.match(/opacity="([^"]+)"/)[1]),pulse:attrs.includes('class="pp-thinking-pulse"')}));assert.deepEqual(livePaths,sourcePaths,'All path coordinates, opacities and pulse memberships match actual source');
 for(const [,percent,opacity]of source.matchAll(/([\d.]+)% \{ opacity: ([\d.]+); \}/g))assert.ok(css.includes(`${percent}%{opacity:${opacity}}`),'Source pulse timing '+percent);
 const module=fs.readFileSync(path.join(path.dirname(ppLoader),'../research-activity.js'),'utf8'),winning=fs.readFileSync(path.join(path.dirname(ppLoader),'../styles.css'),'utf8');assert.match(module,/assets\/thinking-grid\.svg" width="16" height="16"/);assert.match(winning,/\.thinking-grid \{ width:16px;height:16px;flex:0 0 16px/);
}
// One open note at a time, with native buttons and cleanup; sequence redraw uses the same icon helper.
const taskRoot=new Node(),taskHost=new Node(),taskButtons=[new Node({'aria-expanded':'false','aria-controls':'task-one'}),new Node({'aria-expanded':'false','aria-controls':'task-two'})],taskNotes=[new Node(),new Node()];taskRoot.ownerDocument=eventDoc;taskRoot.queries={'[data-ai-task-rows]':[taskHost]};taskHost.queries={'[data-ai-task-trigger]':taskButtons,'#task-one':taskNotes[0],'#task-two':taskNotes[1]};let disposeTasks;F.wireAIResponse(taskRoot,fn=>disposeTasks=fn);taskButtons[0].dispatch('click');assert.equal(taskButtons[0].getAttribute('aria-expanded'),'true');assert.equal(taskNotes[0].inert,false);taskButtons[1].dispatch('click');assert.equal(taskButtons[0].getAttribute('aria-expanded'),'false');assert.equal(taskNotes[0].inert,true);assert.equal(taskButtons[1].getAttribute('aria-expanded'),'true');taskButtons[1].dispatch('click');assert.equal(taskButtons[1].getAttribute('aria-expanded'),'false');disposeTasks();assert.ok(taskButtons.every(button=>button.events.click.length===0));
eventDoc.hidden=false;
const sequenceRoot=new Node(),sequenceHost=new Node(),sequenceRow=new Node(),sequenceIcon=new Node(),sequenceBadge=new Node();sequenceRoot.ownerDocument=eventDoc;sequenceRoot.queries={'[data-ai-sequence]':[sequenceHost]};sequenceHost.dataset.aiSequence='stages';sequenceRow.dataset.phase='0';sequenceRow.classList={toggle(){}};sequenceRow.queries={'[data-phase-icon]':sequenceIcon,'[data-phase-badge]':sequenceBadge};sequenceHost.queries={'[data-phase]':[sequenceRow]};let tick,cleared=false;view.setInterval=fn=>{tick=fn;return 1;};view.clearInterval=()=>cleared=true;let disposeSequence;F.wireAIResponse(sequenceRoot,fn=>disposeSequence=fn);assert.match(sequenceIcon.innerHTML,/--spinner-size:var\(--pp-component-taskRows-icon\)/);for(let n=0;n<15;n++)tick();assert.equal(sequenceRow.dataset.phaseState,'completed');assert.match(sequenceIcon.innerHTML,/data-hugeicon="Tick02Icon" width="12"/);assert.doesNotMatch(sequenceIcon.innerHTML,/width="14"|width="16"/);disposeSequence();assert.equal(cleared,true);delete view.setInterval;delete view.clearInterval;

assert.doesNotMatch(F.aiResearchActivity({}),/Review the available records, calculate headline/);
const search=F.aiWebSearch({sources:[{title:'A < B',href:'javascript:alert(1)'},{title:'Docs',href:'https://example.com'}]});
assert.match(search,/A &lt; B/);assert.doesNotMatch(search,/href="javascript:/);assert.match(search,/href="https:\/\/example.com"/);
assert.match(F.aiResponse({}),/data-message-action="copy"/);
const actionMarkup=F.aiMessageActions();
for(const glyph of ['copy','check','arrows-clockwise','thumbs-up','thumbs-up-fill','thumbs-down','thumbs-down-fill'])assert.match(actionMarkup,new RegExp(`data-hugeicon="${F.icons[glyph].name}" width="14"`));
assert.equal((actionMarkup.match(/<button type="button"/g)||[]).length,4,'All four actions reuse native shared buttons');
assert.match(actionMarkup,/--demo-button-height:var\(--pp-component-response-actions-size\)/);
assert.match(actionMarkup,/role="group" aria-label="Message actions"/,'A native button group does not invent a toolbar keyboard model');
for(const role of ['size','icon','gap','radius','duration','copyDuration','retryDuration','selected','success'])assert.ok(F.aiCompactTokens().includes('component.response.actions.'+role),role);
assert.match(css,/@media\(hover:hover\)/);assert.match(css,/\.pp-ai-response:focus-within \.pp-ai-message-actions\{opacity:1\}/);
assert.match(css,/data-copied=true\] \.pp-message-confirmation\{opacity:1;filter:blur\(0\)\}/);
assert.match(css,/data-spinning=true\] \.pp-message-glyph>svg\{transform:rotate\(180deg\)\}/);
assert.match(css,/prefers-reduced-motion:reduce\)\{\.pp-ai-message-actions,\.pp-ai-message-actions \*\{transition:none!important/);
assert.doesNotMatch(F.aiResponse({state:'thinking'}),/data-message-action/);
assert.match(F.voiceWaveform({}),/aria-hidden="true"/);


const textNode=text=>({nodeType:3,textContent:text});
const element=(nodeName,...childNodes)=>({nodeType:1,nodeName,childNodes});
const copyContent=element('DIV',element('P',textNode('Introduction.')),element('P',textNode('Summary.')),element('UL',element('LI',textNode('First')),element('LI',textNode('Second'))),element('TABLE',element('TR',element('TH',textNode('Company')),element('TH',textNode('Score'))),element('TR',element('TD',textNode('Acme')),element('TD',textNode('90')))));
assert.equal(F.aiMessageText(copyContent),'Introduction.\n\nSummary.\n\nFirst\nSecond\n\nCompany\tScore\nAcme\t90');
for(const token of ['space.28','space.32','border.width','semantic.border.default','font.weight.400'])assert.ok(F.aiResearchActivityTokens({}).includes(token),token);
assert.ok(F.aiCompactTokens().includes('component.response.width'));
// Action state is local, ratings are exclusive, clipboard reports actual outcome.
(async()=>{
 const actionRoot=new Node(),actionGroup=new Node(),actionStatus=new Node(),host=new Node();
 actionRoot.ownerDocument=eventDoc;
 const actions=['copy','retry','positive','negative'].map(action=>{const b=new Node();b.dataset.messageAction=action;b.closest=()=>host;return b;});
 actionGroup.queries={'[data-message-status]':actionStatus,'[data-message-action]':actions};actionRoot.queries={'.pp-ai-message-actions':[actionGroup]};
 host.queries={'.pp-ai-response-content':{cloneNode:()=>({textContent:'Example response',querySelectorAll:()=>[]})}};
 let copied=null;view.navigator={clipboard:{writeText:async value=>{copied=value;}}};
 let now=0,nextTimer=0;const timers=new Map();
 view.setTimeout=(fn,delay)=>{const id=++nextTimer;timers.set(id,{fn,at:now+delay});return id;};view.clearTimeout=id=>timers.delete(id);
 const advance=ms=>{const end=now+ms;for(;;){const hit=[...timers].filter(([,job])=>job.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!hit)break;const [id,job]=hit;timers.delete(id);now=job.at;job.fn();}now=end;};
 let disposeActions;F.wireAIResponse(actionRoot,fn=>disposeActions=fn);
 actions[2].dispatch('click');assert.equal(actions[2].getAttribute('aria-pressed'),'true');assert.equal(host.dispatched.type,'forma:feedback');
 actions[3].dispatch('click');assert.equal(actions[2].getAttribute('aria-pressed'),'false');assert.equal(actions[3].getAttribute('aria-pressed'),'true');
 actions[3].dispatch('click');assert.equal(host.dispatched.detail.rating,null);
 actions[1].dispatch('click');assert.equal(host.dispatched.type,'forma:regenerate');
 assert.equal(actions[1].dataset.spinning,'true');advance(250);actions[1].dispatch('click');assert.equal(timers.size,1,'Repeated retry resets one scoped timer');advance(499);assert.equal(actions[1].dataset.spinning,'true');advance(1);assert.equal(actions[1].dataset.spinning,'false');
 await actions[0].events.click[0]();assert.equal(copied,'Example response');assert.equal(actionStatus.textContent,'Response copied.');
 assert.equal(actions[0].dataset.copied,'true');assert.equal(actions[0].getAttribute('title'),'Response copied');advance(1599);assert.equal(actions[0].dataset.copied,'true');advance(1);assert.equal(actions[0].dataset.copied,'false');assert.equal(actions[0].getAttribute('aria-label'),'Copy response');
 await actions[0].events.click[0]();assert.equal(timers.size,1);advance(800);await actions[0].events.click[0]();assert.equal(timers.size,1,'Repeated copy cancels its earlier reset');advance(800);assert.equal(actions[0].dataset.copied,'true');
 view.navigator.clipboard.writeText=async()=>{throw Error('Denied');};await actions[0].events.click[0]();assert.match(actionStatus.textContent,/Could not copy/);
 assert.equal(actions[0].dataset.copied,'false');assert.equal(actions[0].disabled,false);assert.equal(timers.size,0,'Failure does not leave a success reset pending');
 actions[1].dispatch('click');let resolveCopy;view.navigator.clipboard.writeText=()=>new Promise(resolve=>resolveCopy=resolve);const pendingCopy=actions[0].events.click[0]();const beforeDispose=actionStatus.textContent;
 disposeActions();assert.ok(actions.every(button=>button.events.click.length===0));
 assert.equal(timers.size,0,'Disposal clears retry and copy timers');resolveCopy();await pendingCopy;assert.equal(actionStatus.textContent,beforeDispose,'Late clipboard completion cannot update a disposed preview');assert.equal(actions[0].dataset.copied,'false');advance(5000);
 console.log(JSON.stringify({compactActions:'copy success/failure and reset, paired icons, exclusive filled votes, retry reset, pending copy and timer cleanup',status:'passed',scope:'simulated DOM; no browser validation'}));
})().catch(error=>{console.error(error);process.exitCode=1;});
console.log(JSON.stringify({responseConfigurations:configurations,uniqueIds:ids.size,sourcePopoverInteractions:5,followupEvents:1,projectionMath:'bounded and correct',tokens:'aliased',status:'passed',scope:'source geometry, markup, data and simulated events; no browser validation'}));
