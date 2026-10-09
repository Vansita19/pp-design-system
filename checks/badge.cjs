/* Shared badge rendering contracts; no browser/pixel-equivalence claim. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist'),context={window:{},document:{createElement:()=>({}),getElementById:()=>({}),head:{append(){}}}};
vm.createContext(context);
for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','previews.js','command-menu.js','guided-popover.js','tooltip.js','file-upload.js','date-picker.js','component-contracts.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const F=context.window.Forma;
const luminance=hex=>{const channels=hex.slice(1).match(/../g).map(c=>parseInt(c,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;};
const solidFamilies={neutral:'gray',blue:'blue',success:'green',purple:'purple',warning:'amber',danger:'red'},solidContrastExceptions=new Map();
let configurations=0;
for(const variant of ['soft','outline','solid','raised','category','status-neutral','status-subtle'])for(const tone of Object.keys(F.badgeTones))for(const state of ['default','inactive'])for(const size of ['sm','md','lg'])for(const indicator of ['none','dot','icon-leading','icon-trailing','icon-only']){
 const c={variant,tone,state,size,indicator},tokens=F.badgeTokens(c),html=F.badge(c,'Safe <label>'),inspector=F.componentTokens({id:'badge'},c);
 assert.doesNotMatch(html,/data-smooth-/);
 assert.ok(!Object.keys(tokens).some(id=>/smoothing/i.test(id)));
 assert.ok(!inspector.some(id=>/smoothing/i.test(id)));
 assert.ok(inspector.includes(tokens.radius));
 if(indicator==='icon-only'){assert.equal(F.resolve(tokens.radius),'999px');assert.match(html,/role="img" aria-label="Safe &lt;label&gt;"/);}
 if(variant==='solid'){
  assert.equal(F.resolve(tokens.foreground),'#FFFFFF',`${tone}/${state} solid label is white`);
  const family=state==='inactive'?'gray':solidFamilies[tone],primitive=`color.${family}.500`,ratio=1.05/(luminance(F.resolve(tokens.background))+.05);
  assert.equal(F.chain(tokens.background).at(-1),primitive,'Solid fill preserves the explicitly requested family500 shade');
  assert.equal(F.chain(tokens.foreground).at(-1),'color.gray.white');
  // Explicit user exception: the selected colored500/white pairs stay as chosen.
  // Neutral/inactive and every unrelated text pairing retain their normal gate.
  if(state==='default'&&tone!=='neutral'&&ratio<4.5)solidContrastExceptions.set(tone,{foreground:'color.gray.white',background:primitive,ratio:Number(ratio.toFixed(3)),required:4.5,reason:'User requested family500 with white solid-badge text'});
  else assert.ok(ratio>=4.5,`${tone}/${state} is not an allowed low-contrast exception`);
  if(indicator!=='none')assert.equal(F.resolve(tokens.indicator),'#FFFFFF','Solid indicators follow white foreground');
 }
 if(['soft','outline','solid'].includes(variant)&&indicator!=='icon-only')assert.equal(F.resolve(tokens.radius),'8px');
 assert.doesNotMatch(html,/<label>/,'Plain badge text stays escaped');
 for(const token of Object.values(tokens)){assert.ok(F.tokens[token],token);F.resolve(token);}
 configurations++;
}
// Source-derived geometries remain distinct from the generic radius adjustment.
for(const [c,expected]of [[{variant:'raised'},'6px'],[{variant:'category',size:'sm'},'6px'],[{variant:'category'},'8px'],[{variant:'status-subtle'},'8px'],[{variant:'status-neutral'},'16px']])assert.equal(F.resolve(F.badgeTokens(c).radius),expected);
console.log(JSON.stringify({configurations,solidText:'user-selected family500 with white text',solidContrastExceptions:Object.fromEntries(solidContrastExceptions),corners:'ordinary CSS radius; native circles/capsules',status:'passed',scope:'render/token contracts; listed contrast exceptions do not meet 4.5:1'}));
