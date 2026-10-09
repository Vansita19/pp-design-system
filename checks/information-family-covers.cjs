/* Actual Hairline kernel geometry, selection and lifecycle; no browser launched. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createRuntime,checkScene,Element,renderedBounds,serializeSVG}=require('./hairline.cjs');
const runtime=createRuntime(),{F,HL}=runtime;
const ids=['metric-card','timeline'];
const source=fs.readFileSync(path.join(__dirname,'../dist/cover-information-families.js'),'utf8');
assert.doesNotMatch(source,/setInterval|setTimeout|requestAnimationFrame|addEventListener|stroke-width|<text/);
assert.ok(source.split('\n').length<=200);
const signatures=new Set();let poses=0;
for(const id of ids){
 const recipe=F.coverRecipes[id];assert.equal(typeof recipe,'function');
 const scene=F.coverScene(recipe),solids=checkScene(id,scene);
 assert.equal(scene.groups.length,3);assert.equal(scene.parts.filter(p=>p.focal).length,3);
 assert.ok(solids>=12,'Housing and moving assemblies retain physical fittings');
 assert.ok(scene.parts.length>=40,'Detailed construction remains readable at rest');
 assert.ok(scene.parts.some(p=>p.kind==='rim')&&scene.parts.some(p=>p.kind==='dot'));
 assert.equal(new Set(scene.groups.map(g=>g.anchor[2])).size,3,'Rest pose has composed, uneven heights');
 const signature=JSON.stringify(scene.parts);assert.ok(!signatures.has(signature));signatures.add(signature);
 const svg=new Element('svg'),stage=new Element('div'),read={textContent:''};stage.append(svg);
 const handle=F.coverMount(recipe,{svg,stage,read},1.25);
 const pointer=[...runtime.pointers][0].handlers,project=HL.proj(runtime.cameras.at(-1));
 const descendants=node=>[node,...node.children.flatMap(descendants)];
 const highlighted=()=>assert.equal(descendants(svg).filter(node=>node.classList.contains('hi')).length,1);
 renderedBounds(svg,id+' rest');highlighted();assert.equal(read.textContent,'rest');poses++;
 const rest=serializeSVG(svg);
 for(const [index,group]of scene.groups.entries()){
  pointer.move(project(...group.anchor));
  for(const elapsed of [16,120,400,2000]){runtime.advance(elapsed);renderedBounds(svg,id+' group '+index);highlighted();poses++;}
  assert.equal(read.textContent,String(index+1),'Each fixed rest anchor reaches its own assembly');
  assert.notEqual(serializeSVG(svg),rest,'The selected assembly responds to the pointer');
 }
 handle.set(0);runtime.advance(2000);renderedBounds(svg,id+' low intensity');highlighted();poses++;
 handle.set(1.25);runtime.advance(2000);renderedBounds(svg,id+' high intensity');highlighted();poses++;
 pointer.leave();runtime.advance(3000);assert.equal(read.textContent,'rest');assert.equal(serializeSVG(svg),rest);
 HL.setReducedMotion(true);pointer.move(project(...scene.groups[1].anchor));runtime.advance(1);
 assert.equal(read.textContent,'2');renderedBounds(svg,id+' reduced motion');highlighted();
 assert.equal([...runtime.clocks][0].tick(0,Number.MAX_SAFE_INTEGER),false,'Reduced motion settles the clock');
 pointer.leave();runtime.advance(1);assert.equal(serializeSVG(svg),rest);HL.setReducedMotion(false);
 if(process.env.COVER_EXPORT_DIR){fs.mkdirSync(process.env.COVER_EXPORT_DIR,{recursive:true});fs.writeFileSync(path.join(process.env.COVER_EXPORT_DIR,id+'.svg'),rest);}
 handle.destroy();handle.destroy();assert.equal(svg.children.length,0);assert.equal(runtime.clocks.size,0);assert.equal(runtime.pointers.size,0);
}
console.log(JSON.stringify({informationFamilyCovers:ids.length,poses,status:'passed',scope:'Official geometry, fixed anchors, single focus, frame bounds, reduced motion and cleanup; not looked at in a browser'}));
