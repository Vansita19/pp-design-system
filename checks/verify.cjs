const vm=require('node:vm');const fs=require('node:fs');const assert=require('node:assert/strict');const path=require('node:path');const root=path.join(__dirname,'../dist');
const context={window:{},document:{createElement:()=>({}),getElementById:()=>({}),head:{append(){}}}};vm.createContext(context);
for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','avatar.js','spinner.js','chip.js','switch-motion.js','menus.js','pitch-patterns.js','feedback.js','layout-system.js','slider.js','prompt-bar.js','ai-response.js','detail-blocks.js','card-patterns.js','prompt-suggestions.js','catalogue.js','previews.js','command-menu.js','guided-popover.js','tooltip.js','file-upload.js','date-picker.js','source-shell.js','source-workspace.js','source-details.js','source-trace.js','source-chat.js','chat-bubble.js','token-display.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
const F=context.window.Forma;
assert.equal(new Set(F.items.map(i=>i.id)).size,F.items.length,'Duplicate component IDs');
for(const id of Object.keys(F.tokens))assert.notEqual(F.resolve(id),undefined);
let variations=0;for(const item of F.items){for(const token of item.tokens)assert.ok(F.tokens[token],`${item.id}: ${token}`);for(const part of item.parts)assert.ok(F.byId[part],`${item.id}: ${part}`);if(item.group==='Foundations')continue;const config=F.defaults(item);assert.ok(F.preview(item,config).length>10,item.id);for(const control of item.controls){for(const value of control.options){assert.ok(F.preview(item,{...config,[control.key]:value}).length>10,`${item.id}: ${control.key} ${value}`);variations++;}}}
const css=['components.css','tag.css','utility-atoms.css','navigation-controls.css','drawer.css','avatar.css','spinner.css','chip.css','variant-matrix.css','switch-motion.css','menus.css','pitch-patterns.css','feedback.css','command-menu.css','guided-popover.css','date-picker.css','file-upload.css','tooltip.css','layout-system.css','slider.css','prompt-bar.css','ai-response.css','detail-blocks.css','card-patterns.css','source-shell.css','source-workspace.css','source-details.css','source-trace.css','source-chat.css','chat-bubble.css','prompt-suggestions.css'].map(file=>fs.readFileSync(path.join(root,file),'utf8')).join('\n');const names=new Set(Object.keys(F.tokens).map(F.varName));for(const [,name]of css.matchAll(/var\((--pp-[\w-]+)/g))assert.ok(names.has(name),'Unknown CSS token '+name);
assert.equal(F.resolve('component.button.primary.background'),'#2563EB');assert.equal(F.resolve('component.control.radius'),'10px');assert.equal(F.resolve('component.control.height.md'),'36px');
F.tokens.bad={value:'{missing}',type:'color'};assert.throws(()=>F.resolve('bad'));delete F.tokens.bad;
F.tokens.cycle={value:'{cycle}',type:'color'};assert.throws(()=>F.resolve('cycle'));delete F.tokens.cycle;
assert.ok(F.preview(F.byId.button,{...F.defaults(F.byId.button),icon:'only',label:'Add item'}).includes('aria-label="Add item"'));
assert.ok(F.preview(F.byId.input,{...F.defaults(F.byId.input),value:'"><script>alert(1)</script>'}).includes('&lt;script&gt;'));
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const [,file]of html.matchAll(/(?:src|href)="([\w.-]+\.(?:js|css))"/g))assert.ok(fs.existsSync(path.join(root,file)),file);
const visible=markup=>markup.replace(/<[^>]*>/g,'');
const primary=F.tokenRow('component.button.primary.background');
assert.match(visible(primary),/action\.primary.*blue\.600/);
assert.doesNotMatch(visible(primary),/#2563EB/i);
assert.match(primary,/background:#2563EB/);
assert.match(primary,/data-copy="\{semantic\.action\.primary\}"/);
assert.match(F.tokenRow('component.control.radius'),/radius\.lg/);
assert.equal(F.resolve('radius.md'),'8px');assert.equal(F.resolve('radius.lg'),'10px');
assert.equal(F.tokens['component.control.height.md'].value,'{space.36}');
assert.equal(F.tokens['component.button.ghost.background'].value,'{color.transparent}');
for(const [id,page]of Object.entries({'component.control.radius':'radius','component.button.padding':'spacing','component.control.font':'typography','component.button.shadow':'shadows','component.motion.shimmer.duration':'motion-tokens','semantic.action.primary':'semantic-tokens','icon.stroke.small':'icons','icon.stroke.large':'icons','color.blue.600':'colors'}))assert.equal(F.tokenPage(id),page);
for(const id of Object.keys(F.tokens)){
 const rendered=visible(F.tokenRow(id));
 assert.doesNotMatch(rendered,/#(?:[a-f\d]{3,8})\b|\b\d+(?:\.\d+)?(?:px|ms)\b|cubic-bezier\(|SF Pro Text/i,`Literal shown in inspector: ${id}`);
}
assert.match(visible(F.tokenRow('color.blue.600',{showPrimitiveValues:true})),/#2563EB/);
assert.match(visible(F.tokenRow('radius.8',{showPrimitiveValues:true})),/8px/);
console.log(JSON.stringify({pages:F.items.length,components:F.items.filter(i=>i.group!=='Foundations').length,tokens:Object.keys(F.tokens).length,variantRenders:variations,status:'passed'}));

assert.equal(F.defaults(F.byId.card).variant,'note');
assert.ok(!F.byId.card.controls.find(c=>c.key==='variant').options.includes('standard'));
assert.equal(F.byId['response-reveal'],undefined);
const searchState=F.byId['ai-status'].controls.find(c=>c.key==='state');assert.ok(F.controlVisible(F.byId['ai-status'],searchState,{variant:'search',animate:true}));
