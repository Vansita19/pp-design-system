/* Token, semantics, and motion contracts; these do not replace a browser check. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const dist=path.join(__dirname,'../dist');
const document={createElement:()=>({}),getElementById:()=>({}),head:{append(){}}};
const context={window:{},document};vm.createContext(context);
for(const name of ['tokens.js','spinner.js'])vm.runInContext(fs.readFileSync(path.join(dist,name),'utf8'),context,{filename:name});
const F=context.window.Forma,css=fs.readFileSync(path.join(dist,'spinner.css'),'utf8');
let cases=0;
for(const variant of ['ring','segmented'])for(const size of ['sm','md','lg'])for(const tone of ['neutral','blue','success','warning','danger']){
 const html=F.spinner({variant,size,tone,label:'Fetching <items>'});
 assert.equal((html.match(/role="status"/g)||[]).length,1,'One status announcement per indicator');
 assert.match(html,/<span class="visually-hidden">Fetching &lt;items&gt;<\/span>/);
 assert.match(html,/aria-hidden="true"/);
 assert.doesNotMatch(html,/tabindex|<button|<input/,'Loading status must not enter the tab order');
 if(variant==='segmented'){
  assert.equal((html.match(/class="pp-spinner-spoke"/g)||[]).length,8);
  const rotations=[...html.matchAll(/transform="rotate\((\d+)/g)].map(m=>Number(m[1]));
  assert.deepEqual(rotations,[0,45,90,135,180,225,270,315],'Eight evenly distributed radial spokes');
 }else assert.doesNotMatch(html,/<svg|pp-spinner-spoke/);
 for(const token of F.spinnerTokens({variant,size,tone})){
  assert.ok(F.tokens[token],`Missing token ${token}`);
  assert.match(F.tokens[token].value,/^\{.+\}$/,'Component values remain aliases');
  assert.ok(F.resolve(token)!==undefined);
 }
 cases++;
}
assert.match(F.spinner({label:'   '}),/>Loading<\/span>/,'Empty labels retain an accessible fallback');
assert.match(F.spinner({label:'</span><script>x</script>'}),/&lt;script&gt;/);
assert.equal(F.resolve('component.spinner.size.sm'),'12px');
assert.equal(F.resolve('component.spinner.size.md'),'16px');
assert.equal(F.resolve('component.spinner.size.lg'),'24px');
assert.equal(F.resolve('semantic.loading.warning'),'#FF6B18');
assert.equal(F.resolve('semantic.status.warning'),'#B45309','Orange loading color must not change warning text');
assert.equal(F.resolve('component.spinner.duration'),F.resolve('motion.duration.spin'));
const variables=new Set(Object.keys(F.tokens).map(F.varName));
for(const [,variable]of css.matchAll(/var\((--pp-[a-zA-Z0-9-]+)/g))assert.ok(variables.has(variable),`Unresolved CSS token: ${variable}`);
const ringBlock=css.match(/\.pp-spinner\{([^}]+)\}/)[1];
assert.doesNotMatch(ringBlock,/(?:^|;)\s*(?:color|border-color)\s*:/,'Inline button spinners retain currentColor');
assert.match(css,/stroke:currentColor/);
assert.match(css,/animation-delay:calc\(\(var\(--spoke-index\) \/ 8 - 1\)/,'Eight spokes advance through separate animation phases');
assert.match(css,/body\.motion-paused \.pp-spinner-spoke/);
assert.match(css,/\.preview-paused \.pp-spinner-spoke/);
assert.match(css,/@media\(prefers-reduced-motion:reduce\)\{\s*\.pp-spinner,\.pp-spinner-spoke\{animation:none!important\}/);
assert.doesNotMatch(css,/animation:pp-spin[^n]/,'The segmented shape fades spokes rather than rotating the entire icon');
console.log(JSON.stringify({spinnerConfigurations:cases,status:'passed',scope:'token aliases, accessible markup, radial geometry, motion and embedded-color contracts'}));
