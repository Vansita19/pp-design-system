/* Registry and rendered foundation contracts; not a browser layout audit. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'../dist');
const main={innerHTML:'',querySelector:()=>null,querySelectorAll:()=>[]};
const context={window:{},document:{createElement:()=>({}),getElementById:()=>({}),head:{append(){}},querySelector:()=>null},__main:main};vm.createContext(context);
for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','avatar.js','spinner.js','chip.js','switch-motion.js','menus.js','pitch-patterns.js','feedback.js','layout-system.js','slider.js','prompt-bar.js','ai-response.js','detail-blocks.js','card-patterns.js','prompt-suggestions.js','catalogue.js','previews.js','command-menu.js','guided-popover.js','tooltip.js','file-upload.js','date-picker.js','source-shell.js','source-workspace.js','source-details.js','source-trace.js','source-chat.js','chat-bubble.js','token-display.js','component-contracts.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
const F=context.window.Forma,scale=[0,2,4,6,8,12,16,20,24,28,32,36,40,48,64],allowed=new Set(scale);
assert.deepEqual(Array.from(F.spacingScale),scale);
assert.deepEqual(Object.keys(F.tokens).filter(id=>id.startsWith('space.')).sort(),scale.map(n=>'space.'+n).sort(),'Only spacing steps belong in space.*; component geometry belongs in size.*');
let spacingRoles=0;
for(const id of Object.keys(F.tokens)){
 if(id.startsWith('space.'))assert.equal(F.resolve(id),id.slice(6)+'px');
 if(id.startsWith('component.')&&/padding|gap|gutter|margin/i.test(id)){
  // The user explicitly requested the supplied TaskRows geometry, including its 10px gap/padding.
  const sourceExactTaskRows=['component.taskRows.rowGap','component.taskRows.paddingY'].includes(id)&&F.resolve(id)==='10px';
  assert.ok(sourceExactTaskRows||allowed.has(Number.parseFloat(F.resolve(id))),`${id} resolves off scale: ${F.resolve(id)}`);spacingRoles++;
 }
}
let spacingDeclarations=0;
for(const file of fs.readdirSync(root).filter(file=>file.endsWith('.css'))){
 const css=fs.readFileSync(path.join(root,file),'utf8').replace(/\/\*[\s\S]*?\*\//g,'');
 for(const [,property,value]of css.matchAll(/(?:^|[;{])\s*((?:padding|margin)(?:-(?:top|right|bottom|left|block|inline)(?:-(?:start|end))?)?|(?:row-|column-)?gap)\s*:\s*([^;}]+)/g)){
  spacingDeclarations++;
  for(const [,raw]of value.matchAll(/(-?\d*\.?\d+)px\b/g)){
   const n=Number(raw);
   // ±1px is an existing border seam / visually-hidden utility. Larger composed
   // dimensions may exceed the scale but must remain multiples of four.
   assert.ok(Math.abs(n)===1||allowed.has(Math.abs(n))||n%4===0,`${file}: ${property}: ${value}`);
  }
 }
}
F.clearPreviews=()=>{};
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
vm.runInContext("const main=__main;const titleCase=s=>String(s).replaceAll('-',' ').replace(/\\b\\w/g,c=>c.toUpperCase());"+app.slice(app.indexOf('function clearConfigurationControls('),app.indexOf('function controlsHTML(')),context);
F.current=F.byId.spacing;vm.runInContext('foundation(F.current)',context);
assert.deepEqual([...main.innerHTML.matchAll(/<code>space\.(\d+)<\/code>/g)].map(m=>Number(m[1])),scale,'Spacing page must not include arbitrary control widths/heights');
for(const n of scale)assert.ok(main.innerHTML.includes(`data-copy="${n}px"`),'Capping the sample must preserve the value copied');
const styles=fs.readFileSync(path.join(root,'styles.css'),'utf8');
assert.match(styles,/\.space-row>span\{[^}]*min-width:0;[^}]*overflow:hidden/,'Flexible sample track must be shrinkable and clipped');
assert.match(styles,/\.space-row i\{[^}]*max-width:100%/,'Sample cannot extend beyond its track');
F.current=F.byId.borders;vm.runInContext('foundation(F.current)',context);
const examples=main.innerHTML.indexOf('class="border-examples"'),tokens=main.innerHTML.indexOf('Tokens used');
assert.ok(examples>=0&&tokens>examples,'Borders must show specimens above their token section');
assert.ok(main.innerHTML.indexOf('class="token-table-wrap"')>tokens);
for(const [state,family]of Object.entries({focus:'blue',invalid:'red',success:'green'})){
 const role='semantic.border.'+({invalid:'danger'}[state]||state);
 assert.equal(F.tokens[role].value,`{color.${family}.500}`);
 for(const id of ['input','textarea','field'])assert.ok(F.componentTokens(F.byId[id],{...F.defaults(F.byId[id]),state}).includes(role),`${id}/${state}: inspector must match the rendered border`);
}
console.log(JSON.stringify({spacingSteps:scale.length,spacingRoles,spacingDeclarations,foundationContracts:'bounded samples, unchanged copy values, preview before tokens',inputStateBorders:'family500',status:'passed',scope:'registry, CSS and actual template rendering; browser appearance unverified'}));
