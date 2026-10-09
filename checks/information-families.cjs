// The original React/Motion island is mounted separately by spectrum-toast.cjs.
/* Family boundaries, saved-link migration, and configuration-aware composition. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const dist=path.join(__dirname,'../dist'),document={getElementById:()=>({}),createElement:()=>({}),head:{append(){}}};
const context={window:{},document,URLSearchParams};vm.createContext(context);
for(const [,file]of fs.readFileSync(path.join(dist,'index.html'),'utf8').matchAll(/<script src="([\w.-]+\.js)"><\/script>/g))if(file!=='app.js'&&file!=='spectrum-toast-runtime.js'&&!file.startsWith('cover-')&&!file.startsWith('hairline-'))vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const F=context.window.Forma,info=F.byId['information-block'],metrics=F.byId['metric-card'],timeline=F.byId.timeline;
const options=item=>Array.from(item.controls.find(c=>c.key==='variant')?.options||[]);
assert.deepEqual(options(info),['overview','stacked','table','list','text','comparison','evidence','question','profile']);
assert.deepEqual(options(metrics),['metrics','highlights','score']);assert.ok(F.isPageVisible('timeline'));
for(const removed of ['rows','notes','metrics','highlights','score','timeline','notifications'])assert.ok(!options(info).includes(removed));
let configurations=0;
for(const item of [info,metrics,timeline])for(const entry of F.variantMatrix(item).entries){
 for(const token of F.componentTokens(item,entry.config,item.tokens))assert.ok(F.tokens[token],token);
 for(const child of F.componentParts(item,entry.config))assert.ok(F.isPageVisible(child),child);
 configurations++;
}
const parts=config=>Array.from(F.componentParts(info,config));
assert.deepEqual(parts({variant:'overview',tags:true}),['tag']);
assert.deepEqual(parts({variant:'overview',tags:false}),[]);
assert.deepEqual(parts({variant:'comparison',heading:false}),[]);
assert.deepEqual(parts({variant:'comparison',heading:true,tags:true}),['tag']);
assert.deepEqual(parts({variant:'question'}),['badge']);
assert.deepEqual(parts({variant:'profile',open:false}),['avatar','badge','timeline']);
assert.deepEqual(parts({variant:'profile',open:true}),['avatar','badge','timeline']);
for(const variant of options(info))assert.ok(!parts({variant}).includes('progress'));
for(const config of [{variant:'metrics'},{variant:'highlights'},{variant:'score',footer:false}])assert.deepEqual(Array.from(F.componentParts(metrics,config)),[]);
assert.deepEqual(Array.from(F.componentParts(metrics,{variant:'score',footer:true})),['badge']);
const render=config=>F.preview(info,{...F.defaults(info),...config});
for(const labels of [false,true])for(const divided of [false,true]){
 const html=render({variant:'list',labels,divided});assert.match(html,/pp-information-card/);assert.match(html,/pp-information-body/);
 assert.equal(html.includes('<dl'),labels);assert.equal(html.includes('is-undivided'),!divided);
}
assert.match(render({variant:'profile'}),/>Founders<\/h3>/,'Hidden generic title must not replace Founders');
assert.match(render({variant:'question'}),/pp-information-card[\s\S]*pp-information-body/);
assert.match(render({variant:'evidence'}),/pp-information-card[\s\S]*pp-information-body/);
const text=render({variant:'text'});assert.match(text,/pp-information-text/);assert.doesNotMatch(text,/<ul|pp-information-notes/);
assert.doesNotMatch(render({variant:'comparison',heading:false}),/pp-information-card|pp-information-head/);
assert.match(render({variant:'comparison',heading:true}),/pp-information-card[\s\S]*pp-information-head[\s\S]*pp-information-comparison/);
for(const variant of ['metrics','highlights','score']){
 const next=F.migrateRoute('information-block','overview','variant='+variant+'&footer=false');
 assert.equal(next.id,'metric-card');assert.equal(new URLSearchParams(next.query).get('variant'),variant);assert.equal(new URLSearchParams(next.query).get('footer'),'false');
}
const history=F.migrateRoute('information-block','overview','variant=timeline&content=education');assert.equal(history.id,'timeline');assert.equal(history.query,'content=education');
const rows=new URLSearchParams(F.migrateRoute('information-block','overview','variant=rows').query);assert.equal(rows.get('variant'),'list');assert.equal(rows.get('labels'),'true');assert.equal(rows.get('divided'),'true');
assert.equal(F.migrateRoute('information-block','overview','variant=notes').query,'variant=text');assert.equal(F.migrateRoute('information-block','overview','variant=notifications').id,'all');
assert.deepEqual(JSON.parse(JSON.stringify(F.migrateRoute('icon-button','overview','size=sm'))),{id:'button',section:'icon-buttons',query:'size=sm'});
assert.equal(F.migrateRoute('','overview','').id,'all');assert.equal(F.migrateRoute('unknown','overview','').id,'all');assert.equal(F.migrateRoute('information-block','states','variant=timeline').section,'overview');
const excerpt=info.controls.find(c=>c.key==='excerpt');assert.equal(F.controlLabel(info,excerpt,{variant:'question'}),'Assessment');assert.equal(F.controlVisible(info,excerpt,{variant:'question',status:'pending'}),false);assert.equal(F.controlLabel(info,excerpt,{variant:'evidence'}),'Source excerpt');
const app=fs.readFileSync(path.join(dist,'app.js'),'utf8');assert.match(app,/showComposition\(entries\)/);assert.match(app,/showComposition\(\[\{config:F.config\}\]\)/);
console.log(JSON.stringify({configurations,families:3,migratedLinks:11,status:'passed',scope:'Catalogue boundaries, token references, selected composition, nested markup and saved-link migration; not browser appearance'}));
