/* Native avatar contracts: offline imagery, accessible identity, image lifecycle,
   and group overflow. Simulated image events; this is not a browser visual audit. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const dist=path.join(__dirname,'../dist');
const style={};
const context={window:{},document:{createElement:()=>style,getElementById:()=>style,head:{append(){}}}};
vm.createContext(context);
for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','avatar.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const F=context.window.Forma;
const occurrences=(text,value)=>text.split(value).length-1;
let assertions=0;
function test(name,run){run();assertions++;}

test('text and image variants expose one accessible identity and escape user text',()=>{
 const text=F.avatar({variant:'text',initials:'va',name:'Vansita Addanki'});
 assert.match(text,/role="img" aria-label="Vansita Addanki"/);
 assert.match(text,/aria-hidden="true">VA<\/span>/);
 assert.doesNotMatch(text,/<img /);
 const photo=F.avatar({variant:'image',name:'Vansita Addanki',initials:'VA'});
 assert.equal(occurrences(photo,'role="img"'),1);
 assert.match(photo,/<img [^>]*src="data:image\/(?:jpeg|png);base64,/);
 assert.match(photo,/<img [^>]*alt="" aria-hidden="true"/);
 assert.doesNotMatch(photo,/onload=|onerror=/);
 assert.match(F.avatar({variant:'text',initials:'<x',name:'A "test"'}),/aria-label="A &quot;test&quot;"/);
 assert.match(F.avatar({variant:'text',initials:'<x'}),/&lt;X/);
 assert.doesNotMatch(F.avatar({variant:'image',src:'javascript:alert(1)'}),/<img /);
});
test('badges preserve their meaning in the accessible identity',()=>{
 assert.match(F.avatar({name:'Alex',badge:'dot',badgeTone:'success'}),/aria-label="Alex, Online"/);
 assert.match(F.avatar({name:'Alex',badge:'icon',iconName:'check'}),/aria-label="Alex, Verified"/);
 assert.match(F.avatar({name:'Alex',badge:'dot',badgeLabel:'Busy'}),/aria-label="Alex, Busy"/);
});
test('group members, overflow and icon count remain accessible at every size',()=>{
 for(const size of ['sm','md','lg'])for(const variant of ['text','image']){
  const markup=F.avatarGroup({count:4,overflow:3,size,variant});
  assert.equal(occurrences(markup,'data-slot="avatar"'),4);
  assert.equal(occurrences(markup,'data-slot="avatar-group-count"'),1);
  assert.match(markup,/aria-label="3 more people"/);
  assert.match(markup,/>\+3<\/span>/);
  assert.equal(occurrences(markup,'data-slot="avatar-image"'),variant==='image'?4:0);
 }
 assert.doesNotMatch(F.avatarGroup({count:2,overflow:0}),/data-slot="avatar-group-count"/);
 assert.match(F.avatarGroup({count:2,overflow:1,countStyle:'icon'}),/aria-label="1 more person"><span aria-hidden="true"><svg /);
 assert.equal(occurrences(F.avatarGroup({count:100,overflow:3}),'data-slot="avatar"'),8);
});

function imageFixture(complete=false,naturalWidth=0){
 const events=new Map(),avatar={dataset:{imageState:'loading'}};
 const img={complete,naturalWidth,closest:()=>avatar,
  addEventListener:(type,fn)=>{if(!events.has(type))events.set(type,new Set());events.get(type).add(fn);},
  removeEventListener:(type,fn)=>events.get(type)?.delete(fn),
  dispatch:type=>events.get(type)?.forEach(fn=>fn())};
 return {img,avatar,root:{querySelectorAll:()=>[img]},events};
}
test('image load and failure switch the fallback, with cleanup on unmount',()=>{
 const fixture=imageFixture();let cleanup;
 F.wireAvatars(fixture.root,fn=>cleanup=fn);
 assert.equal(fixture.avatar.dataset.imageState,'loading');
 fixture.img.dispatch('load');assert.equal(fixture.avatar.dataset.imageState,'loaded');
 fixture.img.dispatch('error');assert.equal(fixture.avatar.dataset.imageState,'fallback');
 cleanup();fixture.img.dispatch('load');assert.equal(fixture.avatar.dataset.imageState,'fallback');
 assert.equal(fixture.events.get('load').size,0);assert.equal(fixture.events.get('error').size,0);
});
test('already cached successful and failed images resolve immediately',()=>{
 for(const [width,state]of [[96,'loaded'],[0,'fallback']]){
  const fixture=imageFixture(true,width);F.wireAvatars(fixture.root);
  assert.equal(fixture.avatar.dataset.imageState,state);
 }
});
test('sizes and all color/geometry contracts resolve through shared aliases',()=>{
 const expected={sm:'24px',md:'32px',lg:'40px'};
 for(const [size,value]of Object.entries(expected))assert.equal(F.resolve('component.avatar.size.'+size),value);
 for(const size of ['sm','md','lg'])for(const shape of ['circle','square'])for(const badge of ['none','dot','icon'])for(const badgeTone of Object.keys(F.badgeTones)){
  for(const id of F.avatarTokens({size,shape,badge,badgeTone}))assert.notEqual(F.resolve(id),undefined,id);
 }
 for(const id of Object.keys(F.tokens).filter(id=>id.startsWith('component.avatar.'))){
  assert.match(F.tokens[id].value,/^\{.+\}$/,'Avatar component tokens must be aliases: '+id);
  assert.notEqual(F.resolve(id),undefined,id);
 }
 const variables=new Set(Object.keys(F.tokens).map(F.varName));
 const css=fs.readFileSync(path.join(dist,'avatar.css'),'utf8');
 for(const [,name]of css.matchAll(/var\((--pp-[\w-]+)/g))assert.ok(variables.has(name),name);
 assert.match(css,/margin-inline-start/);assert.match(css,/inset-inline-end/);
 assert.match(style.textContent,/--pp-component-avatar-size-sm:var\(--pp-space-24\)/);
});
test('icon indicators share vivid dot colors and stay distinguishable',()=>{
 const luminance=hex=>hex.slice(1).match(/../g).map(pair=>parseInt(pair,16)/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4).reduce((sum,value,index)=>sum+value*[.2126,.7152,.0722][index],0);
 for(const tone of Object.keys(F.badgeTones)){
  assert.equal(F.resolve(`component.avatar.badge.${tone}.icon.background`),F.resolve(`component.avatar.badge.${tone}.background`),'Dot and icon colors differ: '+tone);
  const bg=luminance(F.resolve(`component.avatar.badge.${tone}.background`)),fg=luminance(F.resolve(`component.avatar.badge.${tone}.foreground`));
  assert.ok((Math.max(bg,fg)+.05)/(Math.min(bg,fg)+.05)>=3,'Icon contrast: '+tone);
 }
 assert.equal(F.resolve('component.avatar.badge.icon.size.lg'),'16px');
 assert.equal(F.resolve('component.avatar.badge.mark.lg'),'12px');
 assert.equal(F.resolve('component.avatar.badge.mark.md'),'10px');
 assert.doesNotMatch(fs.readFileSync(path.join(dist,'avatar.css'),'utf8'),/\.pp-avatar-root\[data-size="sm"\][^{]+\{display:none\}/);
});
test('the supplied portrait is preserved and used across every image demo',()=>{
 const source=markup=>[...markup.matchAll(/data-slot="avatar-image" src="([^"]+)"/g)].map(match=>match[1]);
 const portrait=source(F.avatar({variant:'image'}))[0];assert.ok(portrait.startsWith('data:image/png;base64,'));
 const bytes=Buffer.from(portrait.split(',')[1],'base64');
 assert.equal(bytes.length,230991,'The original PNG must not be resized or recompressed');
 assert.equal(new Set(source(F.avatarGroup({variant:'image',count:8}))).size,1,'Group avatars should use the same supplied portrait');
 assert.ok(source(F.avatarGroup({variant:'image',count:8})).every(src=>src===portrait));
 assert.match(F.avatar({variant:'image'}),/pp-avatar-photo sample-portrait/);
 assert.doesNotMatch(F.avatar({variant:'image',src:'https://example.com/avatar.png'}),/pp-avatar-photo sample-portrait/);
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),'becfa0442201e376ae7955b2477800daa93ba80594bba1d2b54eefacb36b26ee','Original portrait bytes changed');
});
test('colored text and profile placeholders share the existing token system',()=>{
 assert.equal(F.resolve('component.avatar.blue.background'),F.resolve('color.blue.200'));
 assert.equal(F.resolve('component.avatar.blue.foreground'),F.resolve('color.blue.900'));
 assert.equal(F.resolve('component.avatar.purple.background'),'#E9D5FF');
 for(const tone of Object.keys(F.avatarTones))for(const variant of ['text','placeholder']){
  const markup=F.avatar({tone,variant,name:'Alex',initials:'AM'});
  assert.match(markup,new RegExp('--avatar-background:var\\(--pp-component-avatar-'+tone+'-background\\)'));
  for(const token of F.avatarTokens({tone,variant}))assert.notEqual(F.resolve(token),undefined);
  if(variant==='placeholder'){assert.match(markup,/data-hugeicon="UserIcon"/);assert.doesNotMatch(markup,/>AM<\/span>/);}
 }
});
console.log(JSON.stringify({avatarContracts:assertions,status:'passed',scope:'Token aliases, markup and simulated image loading'}));
