/* Source-pattern recipes use the real shared Hairline geometry/clock tests.
   No browser is opened. Visual judgment remains a separate manual step. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createRuntime,checkScene,Element,renderedBounds,serializeSVG}=require('./hairline.cjs');
const {F,HL,clocks,pointers,cameras,advance}=createRuntime();
const ids=['ai-response'];
const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'dist/cover-source-patterns.js'),'utf8');
assert.doesNotMatch(source,/setInterval|setTimeout|requestAnimationFrame|addEventListener|stroke-width|<text/);
assert.ok(source.split('\n').length<=200,'Recipes should remain concise');
const signatures=new Set();let poses=0;
for(const id of ids){
 const recipe=F.coverRecipes[id];assert.equal(typeof recipe,'function');
 const scene=F.coverScene(recipe);checkScene(id,scene);
 assert.equal(scene.groups.length,3,id+' must contain three independently selectable assemblies');
 assert.equal(scene.parts.filter(part=>part.focal).length,3);
 assert.ok(scene.parts.filter(part=>part.kind==='box').length>=12,id+' needs real multipart construction');
 assert.ok(scene.parts.some(part=>part.kind==='rim')&&scene.parts.some(part=>part.kind==='line')&&scene.parts.some(part=>part.kind==='dot'));
 const signature=JSON.stringify(scene.parts);assert.ok(!signatures.has(signature));signatures.add(signature);
 const svg=new Element('svg'),stage=new Element('div'),read={textContent:''};stage.append(svg);
 const handle=F.coverMount(recipe,{svg,stage,read},1),pointer=[...pointers][0].handlers,project=HL.proj(cameras.at(-1));
 renderedBounds(svg,id+' rest');assert.equal(read.textContent,'rest');poses++;
 for(const [index,group]of scene.groups.entries()){
  pointer.move(project(...group.anchor));
  for(const elapsed of [16,120,400,2000]){advance(elapsed);renderedBounds(svg,id+' pose '+index);poses++;}
  assert.equal(read.textContent,String(index+1),id+' has an unreachable group');
 }
 pointer.leave();advance(3000);assert.equal(read.textContent,'rest');
 if(process.env.COVER_EXPORT_DIR){fs.mkdirSync(process.env.COVER_EXPORT_DIR,{recursive:true});fs.writeFileSync(path.join(process.env.COVER_EXPORT_DIR,id+'.svg'),serializeSVG(svg));}
 handle.destroy();assert.equal(svg.children.length,0);assert.equal(clocks.size,0);assert.equal(pointers.size,0);
}
console.log(JSON.stringify({sourcePatternCovers:ids.length,poses,status:'passed',scope:'Original geometry, fixed hit anchors, finite frame bounds and lifecycle; not looked at in a browser'}));
