/* Motion contracts and native event ownership; not a browser animation audit. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const dist=path.join(__dirname,'../dist'),style={};
const context={window:{},document:{createElement:()=>style,getElementById:()=>style,head:{append(){}}}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(dist,'tokens.js'),'utf8'),context);
const F=context.window.Forma;
const original=Object.fromEntries(Object.keys(F.tokens).filter(id=>id.startsWith('component.switch.')).map(id=>[id,F.resolve(id)]));
vm.runInContext(fs.readFileSync(path.join(dist,'switch-motion.js'),'utf8'),context);
const css=fs.readFileSync(path.join(dist,'switch-motion.css'),'utf8');
let contracts=0;
const test=run=>{run();contracts++;};

test(()=>{
 for(const [token,value]of Object.entries(original))assert.equal(F.resolve(token),value,`Existing switch token changed: ${token}`);
 for(const size of ['sm','md','lg']){
  const tokens=F.switchTokens({size});
  assert.ok(tokens.includes('component.switch.motion.stretch.'+size));
  assert.ok(tokens.includes('component.switch.motion.release.easing'));
  for(const token of tokens)assert.notEqual(F.resolve(token),undefined);
  const width=parseFloat(F.resolve('component.switch.width.'+size));
  const thumb=parseFloat(F.resolve('component.switch.thumb.'+size));
  const stretch=parseFloat(F.resolve('component.switch.motion.stretch.'+size));
  const border=parseFloat(F.resolve('border.width'));
  assert.ok(thumb+stretch<width-2*border,'Held thumb fits inside the original track');
 }
 for(const [id,token]of Object.entries(F.tokens).filter(([id])=>id.startsWith('component.switch.motion.')))assert.match(token.value,/^\{.+\}$/,'Motion component values are aliases: '+id);
 assert.equal(F.resolve('component.switch.motion.press.duration'),'160ms');
 assert.equal(F.resolve('component.switch.motion.release.duration'),'320ms');
 assert.match(style.textContent,/--pp-component-switch-motion-release-easing/);
});

const fixture=(disabled=false)=>{
 const events=new Map(),control={disabled,dataset:{},
  addEventListener:(name,fn)=>events.set(name,fn),
  removeEventListener:(name,fn)=>{if(events.get(name)===fn)events.delete(name);}};
 Object.defineProperty(control,'checked',{get:()=>true,set:()=>{throw Error('Motion must not toggle the native input');}});
 return {control,events,root:{querySelectorAll:()=>[control]},dispatch:(name,key)=>events.get(name)?.({key,preventDefault:()=>{throw Error('Motion must not prevent native events');}})};
};
test(()=>{
 const f=fixture();let registered;
 const cleanup=F.wireSwitchMotion(f.root,fn=>registered=fn);
 assert.equal(cleanup,registered);
 f.dispatch('keydown',' ');assert.equal(f.control.dataset.switchPressed,'true');
 f.dispatch('keyup',' ');assert.equal(f.control.dataset.switchPressed,undefined);
 f.dispatch('keydown','Enter');assert.equal(f.control.dataset.switchPressed,undefined);
 f.dispatch('keydown',' ');f.dispatch('blur');assert.equal(f.control.dataset.switchPressed,undefined);
 f.dispatch('keydown',' ');f.dispatch('keydown','Escape');assert.equal(f.control.dataset.switchPressed,undefined);
 f.dispatch('keydown',' ');cleanup();assert.equal(f.control.dataset.switchPressed,undefined);
 assert.equal(f.events.size,0,'Unmount removes all listeners');
});
test(()=>{
 const f=fixture(true);F.wireSwitchMotion(f.root);
 f.dispatch('keydown',' ');assert.equal(f.control.dataset.switchPressed,undefined);
 assert.match(css,/\.pp-switch:not\(:disabled\):is\(:active,\[data-switch-pressed="true"\]\)/);
});
test(()=>{
 const names=new Set(Object.keys(F.tokens).map(F.varName));
 for(const [,name]of css.matchAll(/var\((--pp-[\w-]+)/g))assert.ok(names.has(name),'Missing CSS token '+name);
 assert.doesNotMatch(css,/(?:^|[;{])\s*(?:background|color|border-radius|height)\s*:/,'The motion layer must not replace visual design');
 assert.match(css,/body\.motion-paused \.pp-switch/);
 assert.match(css,/\.preview-paused \.pp-switch/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.equal((css.match(/--switch-thumb-current:var\(--switch-thumb\)!important/g)||[]).length,2,'Paused and reduced motion suppress held deformation');
 assert.match(css,/width var\(--switch-motion-duration\) var\(--switch-motion-easing\),transform var\(--switch-motion-duration\) var\(--switch-motion-easing\)/,'Width and position share timing, keeping the held thumb aligned');
});
console.log(JSON.stringify({switchMotionContracts:contracts,status:'passed',scope:'native event ownership, unchanged design tokens, motion aliases and preferences'}));
