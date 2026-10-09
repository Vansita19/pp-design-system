/* Icon provenance, complete catalogue render coverage and source bypass audit; no browser. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const base=path.join(__dirname,'..'),dist=path.join(base,'dist');
const context={window:{},document:{createElement:()=>({}),getElementById:()=>({}),head:{append(){}}}};vm.createContext(context);
const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
assert.match(html,/src="hugeicons-icons\.js"/);assert.doesNotMatch(html,/src="phosphor-icons\.js"/);
const files=[...html.matchAll(/<script src="([\w.-]+\.js)"><\/script>/g)].map(match=>match[1]);
const required=new Set(['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','avatar.js','spinner.js','catalogue.js','previews.js','command-menu.js','guided-popover.js','tooltip.js','file-upload.js','date-picker.js','source-shell.js','source-workspace.js','source-details.js','source-trace.js','source-chat.js','chat-bubble.js','token-display.js','component-contracts.js','variant-matrix.js','chip.js','switch-motion.js','menus.js','pitch-patterns.js','feedback.js','layout-system.js','slider.js','prompt-bar.js','prompt-suggestions.js','ai-response.js','detail-blocks.js','card-patterns.js']);
for(const file of files.filter(file=>required.has(file)))vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const F=context.window.Forma;
assert.strictEqual(F.icons,F.hugeicons);assert.ok(Object.isFrozen(F.icons));assert.ok(Object.keys(F.icons).length>40);
const attribute=(markup,name)=>markup.match(new RegExp('\\b'+name+'="([^"]*)"'))?.[1];
for(const size of [8,10,12,14,16,17,20,24,32,48]){
 const stroke=size<=16?1.25:1.5;assert.equal(F.iconStroke(size),stroke);
 for(const [key,definition]of Object.entries(F.icons)){
  const markup=F.icon(key,size),svg=markup.match(/^<svg\b[^>]*>/)?.[0];assert.ok(svg,key);assert.equal(attribute(svg,'data-hugeicon'),definition.name,key);assert.equal(attribute(svg,'viewBox'),'0 0 24 24',key);assert.equal(attribute(svg,'fill'),'none',key);assert.equal(attribute(svg,'stroke'),'currentColor',key);assert.equal(Number(attribute(svg,'stroke-width')),stroke,key);assert.equal(Number(attribute(svg,'width')),size,key);assert.equal(Number(attribute(svg,'height')),size,key);assert.equal(attribute(svg,'aria-hidden'),'true',key);assert.equal(attribute(svg,'focusable'),'false',key);assert.match(svg,/stroke-linecap="round"/);assert.match(svg,/stroke-linejoin="round"/);
  const children=[...markup.matchAll(/<(?:path|circle|ellipse|rect|line|polyline|polygon)\b[^>]*>/g)].map(match=>match[0]);assert.ok(children.length,key+' needs real geometry');for(const child of children){assert.equal(attribute(child,'vector-effect'),'non-scaling-stroke',key+' preserves actual CSS-pixel stroke');assert.ok(!attribute(child,'fill')||attribute(child,'fill')==='none',key+' is outlined');assert.ok(!attribute(child,'stroke')||attribute(child,'stroke')==='currentColor',key+' shares foreground');assert.ok(!attribute(child,'stroke-width')||Number(attribute(child,'stroke-width'))===stroke,key+' cannot override stroke');}
 }
}
// Exact local package geometry is retained; only paint/stroke defaults are adapted by the shared renderer.
const provenance=JSON.parse(fs.readFileSync(path.join(base,'vendor/hugeicons/source.json'),'utf8')),mapping=JSON.parse(fs.readFileSync(path.join(base,'vendor/hugeicons/mapping.json'),'utf8')),definitions=JSON.parse(fs.readFileSync(path.join(base,'vendor/hugeicons/definitions.json'),'utf8'));
assert.equal(provenance.package,'@hugeicons/core-free-icons');assert.equal(provenance.style,'Stroke Rounded');assert.equal(provenance.viewBox,'0 0 24 24');assert.equal(provenance.verifiedIntegrity,true);assert.match(provenance.integrity,/^sha512-/);assert.match(provenance.reference,/^https:\/\/hugeicons\.com\/icons\/stroke-rounded$/);assert.deepEqual(Object.keys(F.icons).sort(),Object.keys(mapping).sort());
for(const [key,name]of Object.entries(mapping)){
 assert.equal(F.icons[key].name,name,key);assert.ok(definitions[name],name+' has source geometry');
 const geometry=[...F.icon(key,16).matchAll(/<(path|circle|ellipse|rect|line|polyline|polygon)\b([^>]*)>/g)];assert.equal(geometry.length,definitions[name].length,key+' shape count');
 definitions[name].forEach(([tag,attrs],index)=>{assert.equal(geometry[index][1],tag,key);for(const [attr,value]of Object.entries(attrs)){if(['key','stroke','strokeWidth','strokeLinecap','strokeLinejoin'].includes(attr))continue;assert.equal(attribute(geometry[index][0],attr),String(value),key+' source '+attr);}});
}
// Literal calls in less frequently visited paths must resolve, including dynamic-call wrappers named I.
const literalKeys=new Set();for(const file of fs.readdirSync(dist).filter(file=>file.endsWith('.js')&&!['hugeicons-icons.js','phosphor-icons.js','spectrum-toast-runtime.js','hairline-kernel.js'].includes(file))){const code=fs.readFileSync(path.join(dist,file),'utf8');for(const match of code.matchAll(/(?:\bF\.icon|\bI)\(\s*['"]([^'"]+)['"]/g))literalKeys.add(match[1]);for(const match of code.matchAll(/\biconName\s*:\s*['"]([^'"]+)['"]/g))literalKeys.add(match[1]);}
for(const key of literalKeys)assert.ok(F.icons[key],`Unmapped literal icon ${key}`);
// Intercept every dynamic icon used by the supported catalogue combinations; a fallback cannot hide missing keys.
const sharedIcon=F.icon;let iconCalls=0;F.icon=(key,size)=>{assert.ok(F.icons[key],`Unmapped rendered icon ${key}`);iconCalls++;return sharedIcon(key,size);};let specimens=0;
for(const item of F.items.filter(item=>item.group!=='Foundations')){const matrix=F.variantMatrix(item);for(const entry of matrix.entries){specimens++;assert.doesNotMatch(entry.markup,/data-phosphor=|class="lucide|phosphor-icon/,item.id+' mixes UI libraries');}}
assert.match(F.aiFollowups({layout:'single'}),/data-hugeicon=/);assert.doesNotMatch(F.aiFollowups({layout:'single'}),/viewBox="0 0 14 14"|stroke="#51515A"/);
assert.equal(F.resolve('component.avatar.badge.mark.stroke'),F.resolve('icon.stroke.small'));
const avatarCSS=fs.readFileSync(path.join(dist,'avatar.css'),'utf8');assert.doesNotMatch(avatarCSS,/\.pp-avatar-badge>svg path\s*\{/,'Avatar badge must not fatten the shared icon paths');
// Retained inline SVGs are specific data graphics, loading artwork or brand artwork, never alternate UI glyphs.
const inlineAllowlist={
 'ai-response.js':['pp-thinking-grid','viewBox="0 0 300 122"','viewBox="0 0 300 218"'],
 'feedback.js':['pp-undo-clock'],
 'previews.js':['viewBox="0 0 440 210"'],
 'source-trace.js':['pp-trace-confidence-glyph','pp-trace-connectors'],
 'source-details.js':['sr-rings','viewBox="0 0 220 220"'],
 'layout-system.js':['layout-diagram','layout-measured-diagram'],
 'detail-blocks.js':['pp-metric-stripes'],
 'spinner.js':['pp-spinner-segmented']
};
let retainedInlineSVGs=0;for(const file of fs.readdirSync(dist).filter(file=>file.endsWith('.js')&&!['hugeicons-icons.js','phosphor-icons.js','spectrum-toast-runtime.js','hairline-kernel.js'].includes(file))){const code=fs.readFileSync(path.join(dist,file),'utf8');for(const match of code.matchAll(/<svg\b/g)){const context=code.slice(Math.max(0,match.index-120),match.index+250);assert.ok(inlineAllowlist[file]?.some(marker=>context.includes(marker)),`${file}: inline SVG bypasses shared icon API: ${context.slice(0,100)}`);retainedInlineSVGs++;}}
console.log(JSON.stringify({registryIcons:Object.keys(F.icons).length,literalKeys:literalKeys.size,renderedIconCalls:iconCalls,specimens,retainedInlineSVGs,strokePolicy:'1.25px at <=16px; 1.5px above16px; non-scaling on geometry',status:'passed',scope:'registry geometry, source provenance, supported catalogue rendering and source bypass audit; no browser validation'}));
