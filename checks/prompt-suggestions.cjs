/* Source suggestion content, geometry and local native-button interactions. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist'),style={},window={Event:class{constructor(type,options){this.type=type;Object.assign(this,options);}}},document={createElement:()=>style,getElementById:()=>style,head:{append(){}},defaultView:window};
const context={window,document};vm.createContext(context);
for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','prompt-suggestions.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const F=window.Forma;let configurations=0;
for(const intent of ['discover','research','meeting'])for(const layout of ['single','group'])for(const disabled of [false,true]){
 const c={intent,layout,disabled},html=F.promptSuggestions(c),count=layout==='group'?3:1;
 assert.equal((html.match(/<button type="button"/g)||[]).length,count);assert.equal((html.match(/ disabled/g)||[]).length,disabled?count:0);
 assert.match(html,/data-prompt-suggestion-status/);assert.doesNotMatch(html,/<form|href=|type="submit"/);
 for(const id of F.promptSuggestionTokens(c)){assert.notEqual(F.resolve(id),undefined);if(id.startsWith('component.'))assert.match(F.tokens[id].value,/^\{.+\}$/);}
 configurations++;
}
for(const [role,value]of Object.entries({height:'168px',innerHeight:'120px',padding:'24px',radius:'16px',groupGap:'12px',iconSize:'22px',titleFont:'16px',titleLine:'22px',descriptionFont:'13px',descriptionLine:'19px',descriptionHeight:'38px'}))assert.equal(F.resolve('component.promptSuggestion.'+role),value);
assert.match(F.promptSuggestions({targetId:'" onclick="bad'}),/data-prompt-target="&quot; onclick=&quot;bad"/);
const css=fs.readFileSync(path.join(dist,'prompt-suggestions.css'),'utf8'),tokens=new Set(Object.keys(F.tokens).map(F.varName));for(const [,id]of css.matchAll(/var\((--pp-[\w-]+)/g))assert.ok(tokens.has(id),id);
let listener,removed=false,announcement='',focused=false,inputEvents=0,selection;
const status={},wrapper={querySelector:()=>status},target={tagName:'TEXTAREA',value:'',dispatchEvent:event=>{assert.equal(event.type,'input');inputEvents++;},focus:()=>focused=true,setSelectionRange:(start,end)=>selection=[start,end]};
const form={querySelector:()=>target},button={disabled:false,dataset:{promptSuggestion:'discover'},closest:s=>s==='[data-prompt-suggestion]'?button:s==='form'?form:wrapper};
const root={contains:node=>node===button,addEventListener:(_,fn)=>listener=fn,removeEventListener:(_,fn)=>removed=fn===listener};F.notify=text=>announcement=text;
const cleanup=F.wirePromptSuggestions(root);
listener({target:button});assert.equal(target.value,'Find seed and pre-seed B2B companies with revenue');assert.equal(inputEvents,1);assert.equal(focused,true);assert.equal(target.value.slice(...selection),'seed and pre-seed');assert.equal(status.textContent,'Discover companies prompt added.');
button.dataset.promptSuggestion='research';listener({target:button});assert.equal(target.value.slice(...selection),'CREE8');
button.disabled=true;target.value='Protected';listener({target:button});assert.equal(target.value,'Protected');button.disabled=false;
target.readOnly=true;listener({target:button});assert.equal(target.value,'Protected');assert.match(announcement,/Suggested prompt: Review CREE8/);
button.dataset.promptTarget='external';document.getElementById=id=>{assert.equal(id,'external');return target;};target.readOnly=false;listener({target:button});assert.match(target.value,/Review CREE8/);
delete button.dataset.promptTarget;const editor={matches:selector=>selector==='[data-prompt-input][contenteditable]'};form.querySelector=()=>editor;
let updatedDraft;F.setPromptDraft=(node,text,range)=>{assert.equal(node,editor);updatedDraft={text,range};return true;};
listener({target:button});assert.equal(updatedDraft.text.slice(updatedDraft.range.start,updatedDraft.range.end),'CREE8');assert.equal(status.textContent,'Deep dive into a company prompt added.');
F.setPromptDraft=()=>false;listener({target:button});assert.match(status.textContent,/^Suggested prompt: Review CREE8/);assert.doesNotMatch(status.textContent,/prompt added/);
cleanup();assert.equal(removed,true);
assert.doesNotMatch(F.promptSuggestions({layout:'group'}),/data-smooth-/);
console.log(JSON.stringify({suggestionConfigurations:configurations,interactionContracts:7,status:'passed',scope:'Source content/dimensions, ordinary CSS radius, editable prompt helper, external textarea fill and listener cleanup; browser appearance unverified'}));
