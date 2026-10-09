/* Independent Tag family, migrated source headings and compact keyboard/progress contracts. */
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const dist=path.join(__dirname,'../dist'),document={getElementById:()=>({}),createElement:()=>({}),head:{append(){}}},context={window:{},document,URLSearchParams};vm.createContext(context);
for(const name of ['tokens','hugeicons-icons','tag','utility-atoms','previews','catalogue','avatar','pitch-patterns','card-patterns'])vm.runInContext(fs.readFileSync(path.join(dist,name+'.js'),'utf8'),context);
const F=context.window.Forma;
let count=0;
for(const variant of ['raised','outline','subtle'])for(const size of ['sm','md','lg'])for(const tone of ['neutral','blue'])for(const removable of [false,true])for(const disabled of [false,true]){
 const c={variant,size,tone,removable,disabled,label:'A < B',icon:true},html=F.tag(c);
 assert.match(html,/class="pp-tag"/);assert.doesNotMatch(html,/pp-badge/);assert.match(html,/A &lt; B/);assert.equal(html.includes('data-tag-remove'),removable);
 for(const token of F.tagContract(c)){assert.ok(F.tokens[token],token);F.resolve(token);}count++;
}
assert.ok(!F.byId.badge.controls.find(c=>c.key==='variant').options.includes('raised'));
assert.equal(F.migrateRoute('badge','overview','variant=raised').id,'tag');
assert.equal(F.resolve('component.tag.shadow'),F.resolve('shadow.tag'));
assert.equal(F.tokens['component.badge.raised.shadow'].value,'{component.tag.shadow}');
// Check the composed result, allowing one shared header to own the Tag renderer.
for(const render of [F.informationBlock,F.stackedInformation,F.informationTable]){
 const heading=render({tags:['Review']});assert.ok(heading.includes(F.tag({tone:'neutral',variant:'raised'},'Review')),'Header must use the actual Tag atom');
 assert.doesNotMatch(render({tags:[]}),/pp-information-tags/,'Empty tags must not reserve header space');
}
for(const name of ['pitch-patterns','card-patterns'])assert.doesNotMatch(fs.readFileSync(path.join(dist,name+'.js'),'utf8'),/F\.badge\(\{[^{}]*variant:'raised'/);
let click,cleanup,removed=false,focused=false;
const status={textContent:''},host={querySelector:()=>status,focus(){focused=true;}},tag={parentElement:host,remove(){removed=true;}},button={disabled:false,closest:()=>tag,getAttribute:()=> 'Remove Research'};
const root={contains:()=>true,addEventListener(_type,fn){click=fn;},removeEventListener(_type,fn){assert.equal(fn,click);click=null;}};
F.wireTags(root,fn=>cleanup=fn);click({target:{closest:()=>button}});assert.ok(removed);assert.ok(focused);assert.equal(status.textContent,'Research removed.');cleanup();assert.equal(click,null);
const kbd=F.kbd({key:'⌘ K'});assert.equal((kbd.match(/<kbd/g)||[]).length,1);assert.match(kbd,/Command \+ K/);assert.doesNotMatch(kbd,/pp-row/);
for(const value of [-1,50,1000]){const markup=F.progress({value,showLabel:true,label:'Storage'});assert.match(markup,new RegExp('aria-valuenow="'+Math.max(0,Math.min(100,value))+'"'));}
console.log(JSON.stringify({tagConfigurations:count,tagMigration:'separate source, heading renderers, legacy token aliases, saved link',removal:'focus, status, cleanup',utilityAtoms:'one compact keyboard cluster and bounded progress',status:'passed',scope:'Source, markup and simulated events; browser appearance unverified'}));
