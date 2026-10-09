/* Comparison coverage and native-preview identity contracts. No browser needed. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const dist=path.join(__dirname,'../dist');
const context={window:{},document:{createElement:()=>({}),getElementById:()=>({}),head:{append(){}}}};
vm.createContext(context);
// Follow the product's actual source-module ordering, stopping before app UI setup.
const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
const sources=[...html.matchAll(/<script src="([\w.-]+\.js)"><\/script>/g)].map(match=>match[1]);
const required=new Set(['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','avatar.js','spinner.js','catalogue.js','previews.js','command-menu.js','guided-popover.js','tooltip.js','file-upload.js','date-picker.js','source-shell.js','source-workspace.js','source-details.js','source-trace.js','source-chat.js','chat-bubble.js','token-display.js','component-contracts.js','variant-matrix.js','chip.js','switch-motion.js','menus.js','pitch-patterns.js','feedback.js','layout-system.js','slider.js','prompt-bar.js','prompt-suggestions.js','ai-response.js','detail-blocks.js','card-patterns.js']);
for(const name of sources.filter(name=>required.has(name)))vm.runInContext(fs.readFileSync(path.join(dist,name),'utf8'),context,{filename:name});
if(!context.window.Forma.variantMatrix)vm.runInContext(fs.readFileSync(path.join(dist,'variant-matrix.js'),'utf8'),context,{filename:'variant-matrix.js'});
const F=context.window.Forma;
const results=new Map();let total=0;
const controls=(id,key)=>F.byId[id].controls.find(control=>control.key===key)?.options||[];
const normalKey=entry=>entry.itemId+':'+JSON.stringify(Object.fromEntries(Object.entries(entry.config).sort(([a],[b])=>a.localeCompare(b))));
for(const item of F.items.filter(item=>item.group!=='Foundations')){
 const result=F.variantMatrix(item);results.set(item.id,result);total+=result.entries.length;
 assert.ok(result.entries.length>0,item.id+' has no specimens');
 assert.ok(result.entries.every(entry=>entry.markup.length>10),item.id+' has empty previews');
 assert.equal(new Set(result.entries.map(normalKey)).size,result.entries.length,item.id+' repeats a configuration');
 assert.doesNotMatch(result.html,/matrix-repeat/,item.id+' left duplicate cells');
 assert.equal((result.html.match(/data-variant-index="\d+"/g)||[]).length,result.entries.length,item.id+' matrix-to-entry indexing');
 assert.match(result.html,/role="region"[^>]+tabindex="0"/);
 assert.match(result.html,/<th scope="col"/);assert.match(result.html,/<th scope="row"/);
 result.entries.forEach((entry,index)=>{
  assert.ok(result.html.includes(`data-variant-index="${index}"`),item.id+' missing cell index '+index);
  const source=F.byId[entry.itemId||item.id];assert.ok(source,'Unknown matrix source');
  for(const token of F.componentTokens(source,entry.config,source.tokens))assert.notEqual(F.resolve(token),undefined,item.id+': '+token);
 });
 const ids=result.entries.flatMap(entry=>[...entry.markup.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]));
 assert.equal(new Set(ids).size,ids.length,item.id+' repeats DOM identifiers');
 if(item.group==='Motion')assert.ok(result.entries.length<=(item.id==='ai-status'?16:12),item.id+' has too many simultaneous motion specimens');
 else if(item.id==='avatar-group')assert.ok(result.entries.length<=40,'Avatar group has an unbounded product');
 else if(!['badge','chip','button','input','avatar','spinner'].includes(item.id))assert.ok(result.entries.length<=32,item.id+' has an unbounded product');
}
const badge=results.get('badge'),indicators=controls('badge','indicator'),badgeStates=controls('badge','state');
const badgeSizes=variant=>variant==='category'?['sm','md']:variant.startsWith('status-')?['md']:controls('badge','size');
const badgeSizeVariants=controls('badge','variant').filter(v=>v!=='status').reduce((n,variant)=>n+badgeSizes(variant).length,0);
const badgeCount=(controls('badge','tone').length+(badgeStates.includes('inactive')?1:0))*badgeSizeVariants*indicators.length;
assert.equal(badge.entries.length,badgeCount+7,'Badge covers every supported color/appearance/size/indicator without repeating fixed status sizes');
for(const entry of badge.entries)assert.ok(['default','inactive',undefined].includes(entry.config.state),'Badges must not invent behavior states');
for(const tone of controls('badge','tone'))for(const variant of controls('badge','variant').filter(v=>v!=='status'))for(const size of badgeSizes(variant))for(const indicator of indicators){
 assert.ok(badge.entries.some(entry=>entry.config.tone===tone&&entry.config.variant===variant&&(variant==='category'?entry.config.categorySize:entry.config.size)===size&&entry.config.indicator===indicator&&entry.config.state!=='inactive'));
}
if(badgeStates.includes('inactive')){
 const inactive=badge.entries.filter(entry=>entry.config.state==='inactive');
 assert.equal(inactive.length,badgeSizeVariants*indicators.length);
 assert.ok(inactive.every(entry=>entry.config.tone==='neutral'),'Inactive repeats once per row, not per color');
}
const button=results.get('button').entries;
for(const variant of controls('button','variant').filter(value=>value!=='link'))for(const size of controls('button','size'))for(const icon of controls('button','icon')){
 assert.ok(button.some(entry=>entry.itemId==='button'&&entry.config.variant===variant&&entry.config.size===size&&entry.config.icon===icon&&entry.config.state==='default'));
}
assert.ok(button.some(entry=>entry.itemId==='link'&&entry.markup.startsWith('<a ')));
assert.ok(button.some(entry=>entry.itemId==='button-group'&&entry.config.variant==='actions'));
for(const state of controls('button','state').filter(value=>value!=='default'))assert.equal(button.filter(entry=>entry.itemId==='button'&&entry.config.state===state).length,1,'Button state repeated across all variants');
for(const id of ['input','textarea','field','select'])for(const state of controls(id,'state'))for(const size of controls(id,'size')){
 assert.ok(results.get(id).entries.some(entry=>entry.config.state===state&&entry.config.size===size),id+' omits '+state+'/'+size);
}
assert.ok(results.get('input').entries.some(entry=>entry.config.state==='readonly'&&/\sreadonly\s/.test(entry.markup)));
assert.ok(results.get('field').entries.some(entry=>entry.config.state==='invalid'&&/aria-invalid="true"/.test(entry.markup)));
assert.ok(!results.get('select').entries.some(entry=>entry.config.state==='readonly'),'Native selects do not support readonly');
const combos=results.get('combobox').entries;
for(const variant of controls('combobox','variant'))for(const optionStyle of controls('combobox','optionStyle'))for(const size of controls('combobox','size'))assert.ok(combos.some(entry=>entry.config.variant===variant&&entry.config.optionStyle===optionStyle&&entry.config.size===size),'Combobox comparison coverage');
assert.ok(combos.some(entry=>entry.config.variant==='multiple'&&/aria-multiselectable="true"/.test(entry.markup)&&/data-chip-remove/.test(entry.markup)),'Multiple examples must render working shared chips');
assert.ok(combos.some(entry=>entry.config.icon==='leading'&&/pp-combobox-leading/.test(entry.markup)),'Combobox needs a leading icon example');
assert.equal(results.get('checkbox').entries.length,6);
assert.equal(results.get('switch').entries.length,12);
const radios=results.get('radio').entries.map(entry=>[...entry.markup.matchAll(/type="radio"[^>]*name="([^"]+)"/g)].map(match=>match[1]));
assert.ok(radios.every(names=>names.length===3&&new Set(names).size===1));
assert.equal(new Set(radios.map(names=>names[0])).size,radios.length,'Radio examples must not select across cells');
if(results.has('chip')){
 const chip=results.get('chip').entries;
 const chipSizeVariants=controls('chip','variant').reduce((n,variant)=>n+(variant==='filter'?1:controls('chip','size').length),0);
 assert.equal(chip.length,chipSizeVariants*controls('chip','tone').length*controls('chip','icon').length+4);
 assert.ok(chip.filter(entry=>entry.config.variant==='filter').every(entry=>entry.config.size==='md'),'Fixed filter geometry must appear only once');
 assert.ok(chip.filter(entry=>entry.config.selected===false).every(entry=>entry.config.variant==='selectable'),'Only selectable chips have unselected behavior');
 assert.ok(chip.filter(entry=>entry.config.disabled===true).every(entry=>entry.config.variant!=='static'),'Static chips must not invent disabled behavior');
}
assert.equal(results.get('avatar').entries.length,controls('avatar','variant').length*controls('avatar','size').length*controls('avatar','shape').length*controls('avatar','badge').length+(controls('avatar','badgeTone').length-1)*2+(controls('avatar','tone').length-1)*2);
assert.equal(results.get('avatar-group').entries.length,controls('avatar-group','variant').length*controls('avatar-group','size').length*3+controls('avatar-group','tone').length-1);
assert.equal(results.get('spinner').entries.length,30);
for(const id of ['avatar','avatar-group','spinner'])assert.ok(results.get(id).entries.every(entry=>entry.config.state===undefined),'Presentation elements must not invent interaction states');
assert.ok(results.get('data-table').html.includes('matrix-size-wide'),'Full blocks need wide, horizontally scrollable specimens');
const css=fs.readFileSync(path.join(dist,'variant-matrix.css'),'utf8');
assert.match(css,/\.matrix-scroll\{[^}]*overflow:auto/);
assert.match(css,/\.matrix-size-wide\{--matrix-min:440px/);
console.log(JSON.stringify({matrixPages:results.size,matrixSpecimens:total,badgeSpecimens:badge.entries.length,status:'passed',scope:'Supported combinations, bounded rendering, token references and unique native input identities'}));
