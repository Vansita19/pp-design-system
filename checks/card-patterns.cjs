/* Shared data compositions, alias validity, source geometry and native disclosures. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist'),style={},document={getElementById:()=>style,createElement:()=>style,head:{append(){}}},context={window:{},document};vm.createContext(context);
for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','spinner.js','previews.js','command-menu.js','guided-popover.js','tooltip.js','file-upload.js','date-picker.js','avatar.js','pitch-patterns.js','ai-response.js','detail-blocks.js','card-patterns.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const F=context.window.Forma,css=fs.readFileSync(path.join(dist,'card-patterns.css'),'utf8');
const validate=ids=>{for(const id of ids){assert.ok(F.tokens[id],id);assert.notEqual(F.resolve(id),undefined,id);if(id.startsWith('component.'))assert.match(F.tokens[id].value,/^\{[^}]+\}$/);}};
// Composed identities keep the actual small avatar and avatar-group geometry.
for(const c of [{},{authors:true}])for(const token of ['component.avatar.size.sm','component.avatar.font.sm','component.avatar.radius.square'])assert.ok(F.noteCardTokens(c).includes(token),token);
assert.ok(F.noteCardTokens({authors:true}).includes('component.avatar.group.overlap'));
assert.equal(F.resolve('component.avatar.size.sm'),'24px');assert.equal(F.resolve('component.avatar.font.sm'),'12px');assert.equal(F.resolve('component.avatar.group.overlap'),'8px');
assert.doesNotMatch(css,/--avatar-(?:size|font|radius|overlap):/,'Notes must not disguise smaller custom avatars as shared atoms');
assert.match(F.noteCard({authors:true}),/--avatar-size:var\(--pp-component-avatar-size-sm\)/);
let cases=0;
for(const noteKind of ['text','table','image'])for(const stacked of [false,true]){
 const html=F.noteCard({noteKind,stacked,title:'Notes <title>',author:'Alex & Morgan',company:'A & B'});validate(F.noteCardTokens({noteKind,stacked}));
 assert.equal((html.match(/<summary\b/g)||[]).length,1);assert.equal((html.match(/<details\b/g)||[]).length,1);assert.doesNotMatch(html.match(/<summary[\s\S]*?<\/summary>/)[0],/<button\b/,'Native disclosure has no nested interactive controls');assert.equal((html.match(/data-note-cycle/g)||[]).length,stacked?1:0);
 assert.equal(html.includes('pp-note-paper-table'),noteKind==='table');assert.equal(html.includes('pp-note-paper-image'),noteKind==='image');assert.equal((html.match(/class="pp-note-back /g)||[]).length,stacked?2:0);
 assert.match(html,/Notes &lt;title&gt;/);assert.match(html,/Alex &amp; Morgan/);assert.equal((html.match(/data-slot="avatar"/g)||[]).length,2);cases++;
}
for(const noteKind of ['text','table','image']){
 const html=F.noteCard({noteKind,authors:true});validate(F.noteCardTokens({noteKind,authors:true}));assert.match(html,/data-slot="avatar-group"/);assert.equal((html.match(/data-slot="avatar"/g)||[]).length,4);cases++;
}
for(const details of [false,true])for(const framed of [false,true])for(const variant of ['standalone','statistics']){
 const c={details,framed,variant},html=F.statsBar(c);validate(F.statsBarTokens(c));
 assert.equal((html.match(/<dt>/g)||[]).length,4);assert.doesNotMatch(html,/<\/dd><small>/,'Statistic captions remain in a semantic description');assert.equal((html.match(/class="pp-stats-detail"/g)||[]).length,details?4:0);assert.equal((html.match(/<small>/g)||[]).length,details?4:0);
 assert.equal(html.includes('is-framed'),framed&&variant!=='statistics');assert.equal(html.includes('<section'),variant!=='statistics');
 assert.ok(F.statsBarTokens(c).includes('component.statsBar.borderWidth'),'Vertical dividers remain tokenized without the outer frame');cases++;
}
assert.match(F.statsBar({items:[['Escaped <label>','A&B','Detail']] }),/Escaped &lt;label&gt;/);assert.match(F.statsBar({items:[['Label','A&B']]}),/A&amp;B/);
assert.equal((F.statsBar({items:Array.from({length:20},(_,n)=>['Metric',n])}).match(/<dt>/g)||[]).length,8,'Extremely large sets remain bounded');
for(const tags of [false,true])for(const footer of [false,true]){
 const c={tags,footer},stack=F.stackedInformation(c);validate(F.stackedInformationTokens(c));assert.equal((stack.match(/class="pp-information-stack-item"/g)||[]).length,2);assert.equal(stack.includes('pp-information-tags'),tags);assert.equal(stack.includes('<footer'),footer);
 for(const info of [false,true]){const html=F.informationTable({...c,info});validate(F.informationTableTokens({...c,info}));assert.match(html,/scope="row"/);assert.match(html,/scope="col"/);assert.equal(html.includes('pp-information-table-info'),info);assert.equal(html.includes('<footer'),footer);cases++;}
 cases++;
}
assert.match(F.informationTable({rows:[['<label>','A&B']],infoText:'<test>'}),/&lt;label&gt;/);assert.match(F.stackedInformation({items:[{title:'<title>',description:'A&B'}]}),/&lt;title&gt;/);
for(const [id,value]of Object.entries({'component.noteCard.radius':'16px','component.noteCard.previewRadius':'12px','component.noteCard.previewHeight':'156px','component.noteCard.identityHeight':'48px','component.noteCard.paperIcon':'12px','component.statsBar.valueFont':'22px','component.statsBar.valueLine':'28px','component.informationTable.paddingX':'16px','component.informationTable.paddingY':'8px'}))assert.equal(F.resolve(id),value,id);
const vars=new Set(Object.keys(F.tokens).map(F.varName));for(const [,id]of css.matchAll(/var\((--pp-[\w-]+)/g))assert.ok(vars.has(id),id);
assert.doesNotMatch(css,/#[\da-f]{3,8}\b/i,'Component CSS must use registered color and shadow aliases');
assert.match(css,/prefers-reduced-motion:reduce/);assert.match(css,/preview-paused/);
// Exercise the actual cycle handler without starting a browser.
let cycleListener,createdHTML='',focused=false,eventDetail,timerCleared=0,timer;
const nextButton={focus(){focused=true;}},next={querySelector:()=>nextButton,classList:{add(){},remove(){}},dispatchEvent(e){eventDetail=e.detail;}},holder={firstElementChild:next,set innerHTML(value){createdHTML=value;}},wrap={dataset:{noteCardConfig:JSON.stringify({stacked:true,previewIndex:0})},replaceWith(node){assert.equal(node,next);}},button={closest:()=>wrap};
const view={matchMedia:()=>({matches:false}),setTimeout(fn){timer=fn;return 1;},clearTimeout(){timerCleared++;},CustomEvent:class{constructor(type,c){this.type=type;this.detail=c.detail;}}};
const root={ownerDocument:{defaultView:view,createElement:()=>holder},contains:()=>true,closest:()=>null,addEventListener(type,fn){cycleListener=fn;},removeEventListener(type,fn){assert.equal(fn,cycleListener);cycleListener=null;}};
let cleanup;F.wireCardPatterns(root,fn=>cleanup=fn);const firstListener=cycleListener;F.wireCardPatterns(root);assert.equal(cycleListener,firstListener,'Repeated wiring is idempotent');
cycleListener({target:{closest:()=>button},preventDefault(){},stopPropagation(){},defaultPrevented:false});assert.match(createdHTML,/Meeting notes/);assert.equal(eventDetail.index,1);assert.ok(focused);assert.equal(typeof timer,'function');cleanup();assert.equal(timerCleared,1);assert.equal(cycleListener,null);
console.log(JSON.stringify({cardPatternConfigurations:cases,cycleBehavior:'front-note change, focus, announcement, idempotent mount and timer cleanup',status:'passed',scope:'Markup, source dimensions, reusable atom composition, scoped cycle behavior and token contracts; browser appearance unverified'}));
