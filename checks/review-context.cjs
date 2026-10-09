/* Review context preserves the owning page and the rendered matrix specimen. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
(async()=>{
 const {Window}=await import(path.join(root,'vendor/spectrum-toast/node_modules/happy-dom/lib/index.js'));
 const window=new Window({url:'https://forma.test/#button/all-states'});
 try{
  window.document.body.innerHTML='<style id="project-tokens"></style>';
  const scripts=[...fs.readFileSync(path.join(dist,'index.html'),'utf8').matchAll(/<script src="([\w.-]+\.js)"><\/script>/g)].map(match=>match[1]).filter(file=>file!=='app.js'&&file!=='spectrum-toast-runtime.js'&&!file.startsWith('cover-')&&!file.startsWith('hairline-')&&!file.startsWith('review-'));
  window.eval([...scripts,'review-targets.js','review-store.js','review-panel.js','review-studio.js'].map(file=>fs.readFileSync(path.join(dist,file),'utf8')).join('\n;\n'));
  const F=window.Forma,asJSON=value=>JSON.parse(JSON.stringify(value));
  const child=F.variantMatrix(F.byId.button).entries.find(entry=>entry.itemId==='button-group');
  assert.ok(child,'Button matrix contains composed button-group specimens');
  const context=F.reviewContext({pageId:'button',componentId:child.itemId,section:'all-states',config:child.config,exampleLabel:'Composed actions'});
  assert.equal(context.exampleLabel,'Composed actions');assert.equal(F.reviewContext({...context,exampleLabel:'x'.repeat(200)}).exampleLabel.length,160);
  assert.equal(context.pageId,'button');assert.equal(context.pageName,F.byId.button.name);
  assert.equal(context.componentId,'button-group');assert.equal(context.componentName,F.byId['button-group'].name);
  assert.match(context.route,/^#button\/all-states(?:\?|$)/);
  assert.deepEqual(asJSON(context.config),asJSON(child.config));
  const ownPage=F.reviewContext({...context,pageId:'button-group'});
  assert.notEqual(context.exampleKey,ownPage.exampleKey,'Same child configuration on different pages is independently scoped');
  assert.equal(F.reviewContext({componentId:'button',section:'overview',config:{}}).pageId,'button','Older context records safely default to their component page');
  assert.throws(()=>F.reviewContext({...context,pageId:'unknown'}));
  let count=0;
  for(const item of F.items.filter(item=>item.group!=='Foundations'))for(const entry of F.variantMatrix(item).entries){
   const component=F.byId[entry.itemId]||item;
   const actual=F.reviewContext({pageId:item.id,componentId:component.id,section:'all-states',config:entry.config});
   for(const [key,value]of Object.entries(entry.config))assert.deepEqual(asJSON(actual.config[key]),asJSON(value),`${item.id}/${component.id}: matrix config ${key} retained`);
   count++;
  }
  const pagination=F.reviewContext({pageId:'pagination',componentId:'pagination',section:'all-states',config:{page:8,total:16}});
  assert.equal(pagination.config.total,16);assert.match(pagination.route,/total=16/);
  for(const total of [0,-1,1001,1.5,'16',null])assert.throws(()=>F.reviewContext({...pagination,config:{...pagination.config,total}}),'Only bounded integer supplemental totals are accepted');
  const dropped=F.reviewContext({...context,config:{...context.config,unknown:'url(javascript:run())'}});assert.equal(Object.hasOwn(dropped.config,'unknown'),false);
  const store=F.createReviewStore({storage:null});store.addComment({context,text:'Adjust this composed specimen.'});
  const imported=F.createReviewStore({storage:null});imported.importJSON(store.exportJSON());
  assert.deepEqual(asJSON(imported.snapshot()),asJSON(store.snapshot()),'Owner page, child configuration and example key survive import');
  // Two independently valid backups can name the same glyph via its button and
  // SVG targets. Neither conflicting proposal may be silently reported applied.
  F.current=F.byId.button;
  const stage=window.document.createElement('div');stage.className='pp-theme';window.document.body.append(stage);
  const buttonConfig={...F.defaults(F.current),icon:'leading',iconName:'search'};
  stage.innerHTML=F.button(buttonConfig,'Action');
  const button=stage.querySelector('button'),svg=stage.querySelector('svg');
  const iconContext=F.reviewContext({pageId:'button',componentId:'button',section:'all-states',config:buttonConfig});
  const merged=F.createReviewStore({storage:null});
  for(const [element,value]of [[button,'plus'],[svg,'check']]){
   const branch=F.createReviewStore({storage:null}),description=F.reviewDescribe(element,stage);
   branch.putChange({context:iconContext,target:description.locator,targetLabel:description.label,property:'icon',value,original:{value:'search'}});
   merged.importJSON(branch.exportJSON());
  }
  const conflicted=F.createReviewStudio({document:window.document,store:merged});
  const unregister=conflicted.register(stage,F.current,buttonConfig,'Conflicting imported icons');conflicted.open();
  assert.equal(merged.snapshot().changes.length,2,'Both imported proposals remain in the review batch');
  assert.equal(stage.querySelector('svg').dataset.hugeicon,F.icons.search.name,'Conflicting proposals preserve the original glyph');
  assert.equal(conflicted.snapshot().pendingCount,2,'Both aliases of the conflicting glyph are explicitly pending');
  unregister();conflicted.destroy();stage.remove();
  // Register a real Button All states matrix while the editor is already open.
  // Assert bounded render work, not a machine-dependent timing threshold.
  const matrix=F.variantMatrix(F.current),container=window.document.createElement('div');window.document.body.append(container);
  const examples=matrix.entries.map(entry=>{const node=window.document.createElement('div');node.className='pp-theme';node.innerHTML=entry.markup;container.append(node);return {node,entry};});
  const originalPanel=F.reviewPanelHTML;let renders=0;
  F.reviewPanelHTML=(...args)=>{renders++;return originalPanel(...args);};
  const studio=F.createReviewStudio({document:window.document,store:F.createReviewStore({storage:null})});studio.open();
  renders=0;const started=performance.now();
  const cleanups=examples.map(({node,entry})=>studio.register(node,F.byId[entry.itemId]||F.current,entry.config,'Matrix specimen'));
  assert.equal(renders,0,'Registering specimens queues one panel update instead of rebuilding per specimen');
  await new Promise(resolve=>window.queueMicrotask(resolve));
  assert.equal(renders,1,'A complete route registration batch renders the panel once');
  const target=examples.at(-1).node.querySelector('button.pp-button')||examples.at(-1).node;
  studio.select(examples.at(-1).node,target);
  const snapshot=studio.snapshot();
  assert.equal(snapshot.targets.length,201,'Picked target beyond the bounded 200-entry list remains available');
  assert.equal(snapshot.selectedTarget,'200');assert.ok(snapshot.selected,'Late matrix specimen remains selected');
  const elapsed=Math.round(performance.now()-started);
  cleanups.forEach(cleanup=>cleanup());studio.destroy();F.reviewPanelHTML=originalPanel;container.remove();
  console.log(`Merged icon conflicts stay pending; ${examples.length} All states specimens register with one render; late target remains reachable (${elapsed}ms simulated DOM).`);
  console.log(`${count} matrix contexts preserve all rendered values; owner-page isolation, bounded supplemental config and round-trip checks passed.`);
 }finally{await window.happyDOM.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
