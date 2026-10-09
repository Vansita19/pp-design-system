/* Physical construction, real kernel geometry and lifecycle; no browser access. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createRuntime,checkScene,Element,renderedBounds,serializeSVG}=require('./hairline.cjs');
const {F,HL,clocks,pointers,cameras,advance}=createRuntime();
const ids=['stats-bar','suggestion'];
const source=fs.readFileSync(path.join(__dirname,'../dist/cover-utility-patterns.js'),'utf8');
assert.doesNotMatch(source,/setInterval|setTimeout|requestAnimationFrame|addEventListener|stroke-width|<text/);
assert.ok(source.split('\n').length<=200);
const signatures=new Set();let poses=0;
for(const id of ids){
 const recipe=F.coverRecipes[id];assert.equal(typeof recipe,'function');
 const scene=F.coverScene(recipe);checkScene(id,scene);
 assert.equal(scene.groups.length,3);assert.equal(scene.parts.filter(p=>p.focal).length,3);
 assert.ok(scene.parts.filter(p=>p.kind==='box').length>=15,'Physical housing plus attached fittings');
 assert.ok(scene.parts.some(p=>p.kind==='rim')&&scene.parts.some(p=>p.kind==='dot')&&scene.parts.some(p=>p.kind==='line'));
 assert.ok(new Set(scene.groups.map(g=>g.anchor[2])).size>1,'Composed, uneven rest pose');
 const signature=JSON.stringify(scene.parts);assert.ok(!signatures.has(signature));signatures.add(signature);
 const svg=new Element('svg'),stage=new Element('div'),read={textContent:''};stage.append(svg);
 const handle=F.coverMount(recipe,{svg,stage,read},1.25),pointer=[...pointers][0].handlers,project=HL.proj(cameras.at(-1));
 const descendants=node=>[node,...node.children.flatMap(descendants)];
 const highlighted=()=>descendants(svg).filter(node=>node.classList.contains('hi')).length;
 renderedBounds(svg,id+' rest');assert.equal(read.textContent,'rest');assert.equal(highlighted(),1);poses++;
 for(const [index,group]of scene.groups.entries()){
  pointer.move(project(...group.anchor));
  for(const elapsed of [16,120,400,2000]){advance(elapsed);renderedBounds(svg,id+' pose '+index);assert.equal(highlighted(),1);poses++;}
  assert.equal(read.textContent,String(index+1),'Fixed rest anchor reaches its own assembly');
 }
 pointer.leave();advance(3000);assert.equal(read.textContent,'rest');assert.equal(highlighted(),1);
 if(process.env.COVER_EXPORT_DIR){fs.mkdirSync(process.env.COVER_EXPORT_DIR,{recursive:true});fs.writeFileSync(path.join(process.env.COVER_EXPORT_DIR,id+'.svg'),serializeSVG(svg));}
 handle.destroy();assert.equal(svg.children.length,0);assert.equal(clocks.size,0);assert.equal(pointers.size,0);
}
console.log(JSON.stringify({utilityPatternCovers:ids.length,poses,status:'passed',scope:'Official geometry, fixed hit anchors, one focus, finite bounds and cleanup; not looked at in a browser'}));
