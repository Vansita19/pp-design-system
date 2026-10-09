/* Actual Hairline geometry and lifecycle checks; no browser is launched. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {Element,createRuntime,checkScene,renderedBounds,serializeSVG}=require('./hairline.cjs');
const runtime=createRuntime(),{F,HL}=runtime,id='information-block';
const scene=F.coverScene(F.coverRecipes[id]),solids=checkScene(id,scene);
assert.equal(scene.groups.length,3);
assert.ok(scene.parts.length>=35,'Information tray needs its recessed construction details');
const stage=new Element('div'),svg=new Element('svg'),read=new Element('output');
stage.append(svg);svg.setAttribute('viewBox','0 0 400 320');
const handle=F.coverMount(F.coverRecipes[id],{stage,svg,read},1);
const project=HL.proj(runtime.cameras.at(-1));
const pointer=[...runtime.pointers][0].handlers;
const descendants=node=>[node,...node.children.flatMap(descendants)];
const geometry=()=>descendants(svg).map(node=>JSON.stringify(node.attributes)).join('');
const highlight=()=>assert.equal(descendants(svg).filter(node=>node.classes().has('hi')).length,1,'Exactly one highlighted silhouette');
const rest=geometry();let poses=1;
renderedBounds(svg,id+' rest');highlight();
const out=process.argv.find(arg=>arg.startsWith('--export='))?.slice(9);
if(out){fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,id+'.svg'),serializeSVG(svg));}
for(let group=0;group<scene.groups.length;group++){
 handle.set(1.25);pointer.move(project(...scene.groups[group].anchor));
 for(const elapsed of [16,120,400,2000]){runtime.advance(elapsed);renderedBounds(svg,id+' group '+group);highlight();poses++;}
 assert.equal(read.textContent,String(group+1),'Every plate has an independently reachable rest anchor');
 assert.notEqual(geometry(),rest,'The selected plate must move');
 if(out)fs.writeFileSync(path.join(out,id+'-active-'+group+'.svg'),serializeSVG(svg));
}
pointer.leave();runtime.advance(3000);assert.equal(read.textContent,'rest');assert.equal(geometry(),rest);
HL.setReducedMotion(true);handle.set(0);pointer.move(project(...scene.groups[1].anchor));runtime.advance(1);
assert.equal([...runtime.clocks][0].tick(0,Number.MAX_SAFE_INTEGER),false,'Reduced motion settles the shared clock');
handle.destroy();handle.destroy();
assert.equal(svg.children.length,0);assert.equal(runtime.clocks.size,0);assert.equal(runtime.pointers.size,0);
console.log(JSON.stringify({status:'passed',recipe:id,parts:scene.parts.length,solids,groups:scene.groups.length,poses,scope:'actual kernel geometry, frame, highlight, pointer selection, cleanup and reduced motion'}));
