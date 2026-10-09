/* Reproduce official Hairline benches without modifying its kernel or bench. */
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {assemble} from '../vendor/hairline/skills/hairline-create/build.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=process.argv.find(a=>a.startsWith('--out='))?.slice(6)||path.join(os.tmpdir(),'forma-hairline-benches');
fs.mkdirSync(out,{recursive:true});
const F={};const context={F,window:{Forma:F}};vm.createContext(context);
for(const f of ['hairline-scenes.js',...fs.readdirSync(path.join(root,'dist')).filter(f=>/^cover-.*\.js$/.test(f)).sort()])
  vm.runInContext(fs.readFileSync(path.join(root,'dist',f),'utf8'),context,{filename:f});
const core=fs.readFileSync(path.join(root,'dist/hairline-scenes.js'),'utf8').split('// FIGURE CORE START')[1].split('// FIGURE CORE END')[0].trim();
for(const [id,recipe] of Object.entries(context.F.coverRecipes)) {
  const layout=context.F.coverScene(recipe);
  const reconstruct=`const recipe=S=>{layout.groups.forEach(g=>S.group(g.anchor,g.delta));layout.parts.forEach(p=>{let item;
    if(p.kind==='box')item=S.box(p.x,p.y,p.w,p.d,p.z,p.h,p.r,p.g);
    else if(p.kind==='rim')item=S.rim(p.x,p.y,p.w,p.d,p.z,p.r,p.g);
    else if(p.kind==='line')item=S.line(p.points,p.g,p.cls);
    else item=S.dot(p.x,p.y,p.z,p.r,p.g);
    if(p.focal){S.focus(item);item.focusOrder=p.focusOrder;}
  });};`;
  const source=core+'\nconst layout='+JSON.stringify(layout)+';\n'+reconstruct+'\nfunction mount(env,value){return coverMount(recipe,env,value);}\n'+
    `hairline({name:${JSON.stringify(id)},means:${JSON.stringify('A physical study of '+id.replaceAll('-',' ')+', with layered mechanisms that respond to the pointer.')},rules:[1,2,3,4,5,6,7,8,9,10],range:[0,1,1.25],tour:[[140,140],[245,165],[200,210],null],mount});\n`;
  fs.writeFileSync(path.join(out,id+'.js'),source);
  const html=path.join(out,'hairline-'+id+'.html');fs.writeFileSync(html,assemble(source));
  if(process.argv.includes('--validate')) {
    const result=spawnSync(process.execPath,[path.join(root,'vendor/hairline/skills/hairline-create/validate.mjs'),html],{encoding:'utf8'});
    if(result.status!==0){console.error(id+': '+result.stdout+result.stderr);process.exit(1);}
  }
}
console.log(`${Object.keys(context.F.coverRecipes).length} official Hairline benches built${process.argv.includes('--validate')?' and validated':''}: ${out}`);
