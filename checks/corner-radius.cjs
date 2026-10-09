/* Corners use native CSS border-radius; no custom smoothing code or geometry. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist'),context={window:{},document:{createElement:()=>({}),getElementById:()=>({}),head:{append(){}}}};
vm.createContext(context);
const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
const required=new Set(['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','avatar.js','spinner.js','catalogue.js','previews.js','command-menu.js','guided-popover.js','tooltip.js','file-upload.js','date-picker.js','source-shell.js','source-workspace.js','source-details.js','source-trace.js','source-chat.js','chat-bubble.js','token-display.js','component-contracts.js','variant-matrix.js','chip.js','switch-motion.js','menus.js','pitch-patterns.js','feedback.js','layout-system.js','slider.js','prompt-bar.js','prompt-suggestions.js','ai-response.js','detail-blocks.js','card-patterns.js']);
for(const [,name]of html.matchAll(/<script src="([\w.-]+\.js)"><\/script>/g))if(required.has(name))vm.runInContext(fs.readFileSync(path.join(dist,name),'utf8'),context,{filename:name});
const F=context.window.Forma;
const forbidden=/data-smooth-|pp-smooth-corner|smoothCornerPath|wireSmoothCorners|smoothCornerRefresh|refreshSmoothCorners|corner-shape\s*:|superellipse\s*\(/i;
for(const name of fs.readdirSync(dist).filter(name=>/\.(css|js|html)$/.test(name)))assert.doesNotMatch(fs.readFileSync(path.join(dist,name),'utf8'),forbidden,name+' must use ordinary CSS corner geometry');
for(const name of ['smooth-corners.js','smooth-corners.css','corner-shapes.css'])assert.equal(fs.existsSync(path.join(dist,name)),false,name+' must not be shipped');
for(const id of Object.keys(F.tokens))assert.doesNotMatch(id,/smoothing|^shape\.corner\./i,'No smoothing or corner-shape token is exposed');
for(const name of ['smoothCornerPath','wireSmoothCorners','smoothCornerRefresh','refreshSmoothCorners'])assert.equal(F[name],undefined,name+' must not be registered');
for(const [id,value]of Object.entries({'component.promptSuggestion.radius':'16px','component.information.radius':'12px','component.noteCard.radius':'16px','component.checkbox.radius':'5px','radius.full':'999px'}))assert.equal(F.resolve(id),value,'Keep the existing radius: '+id);
for(const [config,value]of [[{variant:'soft'},'8px'],[{variant:'raised'},'6px'],[{variant:'category',size:'sm'},'6px'],[{variant:'status-subtle'},'8px'],[{variant:'status-neutral'},'16px'],[{indicator:'icon-only'},'999px']])assert.equal(F.resolve(F.badgeTokens(config).radius),value);
let specimens=0;
for(const item of F.items.filter(item=>item.group!=='Foundations'))for(const entry of F.variantMatrix(item).entries){assert.doesNotMatch(entry.markup,forbidden,item.id+' emits obsolete corner markup');specimens++;}
console.log(JSON.stringify({status:'passed',specimens,cornerTreatment:'ordinary CSS border-radius',scope:'Runtime source, registry, rendered matrix markup and retained radius contracts'}));
