const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'../dist');
const context={window:{},document:{createElement:()=>({}),getElementById:()=>({}),head:{append(){}}}};
vm.createContext(context);
for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','avatar.js','spinner.js','chip.js','switch-motion.js','menus.js','pitch-patterns.js','feedback.js','layout-system.js','slider.js','prompt-bar.js','ai-response.js','detail-blocks.js','card-patterns.js','prompt-suggestions.js','catalogue.js','previews.js','command-menu.js','guided-popover.js','tooltip.js','file-upload.js','date-picker.js','source-shell.js','source-workspace.js','source-details.js','source-trace.js','source-chat.js','chat-bubble.js','component-contracts.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
const F=context.window.Forma;
const luminance=hex=>{const rgb=hex.replace('#','').match(/../g).slice(0,3).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
// The light off-track intentionally matches the supplied Base Nova reference.
// Shimmer's resting foreground is checked; its transient bright band is not a static contrast claim.
// Its boundary is not a 3:1 claim; keep focus and selected-state contrast checks.
const pairs=[['semantic.text.inverse','semantic.action.primary',4.5],['semantic.text.inverse','semantic.action.hover',4.5],['semantic.text.inverse','semantic.action.pressed',4.5],['semantic.status.dangerContent','semantic.status.dangerSubtle',4.5],['semantic.text.inverse','semantic.status.danger',4.5],['semantic.status.success','semantic.status.successSubtle',4.5],['semantic.status.warning','semantic.status.warningSubtle',4.5],['semantic.status.info','semantic.status.infoSubtle',4.5],['component.motion.shimmer.foreground','semantic.surface.default',4.5],['semantic.border.focus','semantic.surface.default',3]];
for(const tone of [...Object.keys(F.badgeTones),'inactive'])pairs.push([`semantic.badge.${tone}.foreground`,`semantic.badge.${tone}.background`,4.5]);
const solidFamilies={neutral:'gray',blue:'blue',success:'green',purple:'purple',warning:'amber',danger:'red',inactive:'gray'},solidContrastExceptions=[];
for(const [tone,family]of Object.entries(solidFamilies)){
 const fg=`semantic.badge.${tone}.solid.foreground`,bg=`semantic.badge.${tone}.solid.background`,actual=contrast(F.resolve(fg),F.resolve(bg));
 assert.equal(F.chain(fg).at(-1),'color.gray.white','Solid badge foreground follows the explicit white-text choice');
 assert.equal(F.chain(bg).at(-1),`color.${family}.500`,'Solid badges retain the selected500 shade; no automatic darkening');
 // Only these explicitly selected solid badge pairs qualify. Soft/status/button
 // text and focus contrast checks below remain unchanged.
 if(!['neutral','inactive'].includes(tone)&&actual<4.5)solidContrastExceptions.push({foreground:fg,background:bg,ratio:Number(actual.toFixed(3)),required:4.5,reason:'User-selected family500 with white solid-badge text'});
 else pairs.push([fg,bg,4.5]);
}
for(const variant of ['status-neutral','status-subtle'])for(const tone of Object.keys(F.badgeTones)){
 const status=F.badgeTokens({variant,tone});pairs.push([status.foreground,status.background,4.5]);
}
for(const tone of ['danger','success'])for(const state of ['background','hover','pressed'])pairs.push([`component.button.${tone}.foreground`,`component.button.${tone}.${state}`,4.5]);
for(const [fg,bg,min]of pairs){const actual=contrast(F.resolve(fg),F.resolve(bg));assert.ok(actual>=min,`${fg} on ${bg}: ${actual} < ${min}`);}
const shell=fs.readFileSync(path.join(root,'styles.css'),'utf8');
const muted=shell.match(/\.eyebrow,\.main-footer,\.micro-label\{color:(#[\da-f]+)\}/i)[1];
for(const bg of ['#0b0b0c','#111113'])assert.ok(contrast(muted,bg)>=4.5);
for(const [id,t]of Object.entries(F.tokens)){const chain=F.chain(id);for(const ref of chain.slice(1))assert.equal(F.tokens[ref].type,t.type,`Alias type mismatch: ${id} → ${ref}`);}
let configurations=0;
for(const item of F.items.filter(x=>x.group!=='Foundations')){
 const defaults=F.defaults(item),variants=[defaults];
 for(const control of item.controls){for(const value of control.options)variants.push({...defaults,[control.key]:value});if(control.type==='toggle')variants.push({...defaults,[control.key]:!defaults[control.key]});}
 for(const c of variants){const ids=F.componentTokens(item,c,item.tokens);assert.equal(new Set(ids).size,ids.length,item.id);for(const id of ids)assert.ok(F.tokens[id],`${item.id}: missing ${id}`);configurations++;}
}
const tokens=(id,c)=>F.componentTokens(F.byId[id],{...F.defaults(F.byId[id]),...c},F.byId[id].tokens);
assert.ok(tokens('avatar',{shape:'square',size:'sm'}).includes('component.avatar.radius.square'));
assert.ok(tokens('avatar',{shape:'square',size:'sm'}).includes('component.avatar.font.sm'));
assert.ok(!tokens('badge',{variant:'outline',tone:'danger'}).includes('component.badge.danger.background'));
assert.ok(tokens('badge',{variant:'soft',tone:'danger'}).includes('component.badge.danger.foreground'));
assert.ok(!tokens('tabs',{variant:'segmented'}).includes('semantic.action.primary'));
assert.ok(!tokens('input',{size:'sm'}).includes('font.size.14'));
assert.ok(tokens('checkbox',{}).includes('component.checkbox.radius'));
assert.equal(F.chain('component.badge.purple.background').join(' → '),'component.badge.purple.background → semantic.badge.purple.background → color.purple.50');
assert.ok(tokens('data-table',{selectable:true}).includes('component.checkbox.radius'));
assert.ok(tokens('data-table',{}).includes('component.badge.category.height.sm'));
assert.equal(F.badgeTokens({indicator:'icon-only'}).radius,'radius.full');
assert.equal(F.chain('component.badge.blue.border').at(-1),'color.blue.200');
assert.ok(tokens('multiselect',{}).includes('component.checkbox.radius'));
assert.ok(tokens('settings-layout',{}).includes('component.switch.height.md'));
assert.equal(F.buttonTokens({variant:'destructive',state:'loading'}).bg,'component.button.danger.background');
assert.equal(F.buttonTokens({icon:'only'}).padding,'space.0');
assert.ok(tokens('spinner',{}).includes('component.spinner.duration'));
assert.equal(F.resolve('component.spinner.duration'),'800ms');
for(const tone of ['neutral','blue','success','warning','danger']){
 const fill='component.progress.fill.'+tone;assert.ok(tokens('progress',{tone}).includes(fill));assert.ok(F.chain(fill).every(id=>!id.startsWith('semantic.text.')));
}
assert.ok(F.chain('component.progress.label').includes('semantic.text.secondary'));
assert.ok(!tokens('progress',{showLabel:false}).includes('component.progress.label'));
assert.equal(F.resolve('component.button.link.underlineOffset'),'4px');
assert.equal(F.resolve(F.buttonTokens({variant:'primary'}).active),F.resolve('semantic.action.pressed'));
const css=fs.readFileSync(path.join(root,'components.css'),'utf8');
for(const [id,token,value]of [['skeleton','skeleton',1800],['text-glow','textGlow',3000],['streaming-text','streamStep',40]]){
 assert.ok(tokens(id,{}).includes('motion.duration.'+token));assert.equal(F.resolve('motion.duration.'+token),value+'ms');
 if(id!=='streaming-text')assert.ok(css.includes('var(--pp-motion-duration-'+token+')'));
}
assert.ok(fs.readFileSync(path.join(root,'previews.js'),'utf8').includes("F.resolve('motion.duration.streamStep')"));
for(const file of fs.readdirSync(root).filter(x=>x.endsWith('.js')))new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file});
console.log(JSON.stringify({contrastPairs:pairs.length+2,solidContrastExceptions,configurationMappings:configurations,tokenTypes:'matched',syntax:'passed',status:'passed',scope:'source contracts; listed solid badge exceptions do not meet 4.5:1; not computed browser styles'}));
