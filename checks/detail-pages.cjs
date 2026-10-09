/* Detail renderer regression checks. Actual templates, simulated DOM bindings; not a browser audit. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'../dist'),nodes=new Map();
const node=()=>({innerHTML:'',textContent:'',dataset:{},style:{setProperty(){}},classList:{toggle(){}},addEventListener(){},querySelectorAll:()=>[]});
const main=node();main.querySelectorAll=()=>[];
main.querySelector=selector=>{
 if(!selector.startsWith('#')||!main.innerHTML.includes(`id="${selector.slice(1)}"`))return null;
 if(!nodes.has(selector))nodes.set(selector,node());return nodes.get(selector);
};
const document={head:{append(){}},createElement:node,getElementById:node,querySelector:main.querySelector};
const context={window:{},document,__main:main};vm.createContext(context);
for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','avatar.js','spinner.js','chip.js','switch-motion.js','menus.js','pitch-patterns.js','feedback.js','layout-system.js','slider.js','prompt-bar.js','ai-response.js','detail-blocks.js','card-patterns.js','prompt-suggestions.js','catalogue.js','previews.js','command-menu.js','guided-popover.js','tooltip.js','file-upload.js','date-picker.js','source-shell.js','source-workspace.js','source-details.js','source-trace.js','source-chat.js','chat-bubble.js','token-display.js','component-contracts.js','variant-matrix.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
const F=context.window.Forma;F.clearPreviews=()=>{};F.wirePreview=()=>{};
const source=fs.readFileSync(path.join(root,'app.js'),'utf8');
vm.runInContext("const main=__main;let routeSection='overview';const titleCase=s=>String(s).replaceAll('-',' ').replace(/\\b\\w/g,c=>c.toUpperCase());function iconFor(){return 'grid';}"+source.slice(source.indexOf('function clearConfigurationControls('),source.indexOf('function syncConfigurationURL(')),context);
let pages=0;
for(const item of F.items.filter(x=>x.group!=='Foundations'))for(const [,section]of item.sections){
 nodes.clear();F.current=item;F.config=F.defaults(item);
 vm.runInContext(`routeSection=${JSON.stringify(section)};renderDetail(F.current);`,context);
 const html=main.innerHTML;
 if(section==='overview'){
  assert.ok(html.includes('id="live-preview"'),`${item.id}: missing Overview preview`);
  if(item.controls.length)assert.ok(html.includes('class="configuration"'),`${item.id}: missing Overview configuration`);
 }else{
  assert.ok(!html.includes('id="live-preview"'),`${item.id}/${section}: repeats Overview preview`);
  assert.ok(!html.includes('class="configuration"'),`${item.id}/${section}: repeats Overview configuration`);
  assert.ok(html.includes('data-variant-index="0"'),`${item.id}/${section}: no examples`);
  assert.ok(html.indexOf('data-variant-index="0"')<html.indexOf('class="primitives-section"'),`${item.id}/${section}: examples not first`);
  if(item.id==='button'&&section==='types')assert.equal((html.match(/data-variant-index=/g)||[]).length,7);
  if(item.id==='button'&&section==='sizes')assert.equal((html.match(/data-variant-index=/g)||[]).length,3);
 }
 if(item.id==='button'&&section==='link-buttons'){assert.ok(html.includes('data-demo-link'));assert.ok(nodes.get('#token-list').innerHTML.includes('component.button.link.underlineOffset'));}
 if(item.id==='button'&&section==='button-groups'){assert.ok(html.includes('aria-label="Record actions"'));assert.ok(nodes.get('#token-list').innerHTML.includes('component.button.group.radius'));}
 if(item.id==='spinner'&&section==='styles')assert.ok(html.includes('pp-spinner-spoke'));
 pages++;
}
console.log(JSON.stringify({detailPages:pages,status:'passed',scope:'Actual template rendering and tab content; simulated DOM bindings'}));
