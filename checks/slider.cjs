/* Native input bounds plus simulated pointer behavior; not a browser audit. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist'),style={};
let focus=null,observers=[];
class Event{constructor(type,options={}){this.type=type;Object.assign(this,options);}}
class ResizeObserver{constructor(fn){this.fn=fn;observers.push(this);}observe(){}disconnect(){this.disconnected=true;}}
const context={window:{},Event,ResizeObserver,getComputedStyle:node=>({direction:node.direction||'ltr'}),document:{createElement:()=>style,getElementById:()=>style,head:{append(){}}}};
vm.createContext(context);
for(const file of ['tokens.js','slider.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const F=context.window.Forma,css=fs.readFileSync(path.join(dist,'slider.css'),'utf8');
let configurations=0,contracts=0;
for(const variant of ['single','range'])for(const tooltip of [false,true])for(const disabled of [false,true])for(const showLabel of [false,true])for(const value of [0,50,100]){
 const c={variant,tooltip,disabled,showLabel,value,lower:25,upper:75,label:'Score <test>'},html=F.slider(c);
 assert.equal((html.match(/type="range"/g)||[]).length,variant==='single'?1:2);
 assert.match(html,/aria-label="Score &lt;test&gt;(?: minimum)?"/);
 assert.equal((html.match(/ disabled/g)||[]).length,disabled?(variant==='single'?1:2):0);
 assert.equal(html.includes('data-slider-value'),showLabel);
 assert.equal(html.includes('data-slider-bubble='),tooltip);
 if(variant==='range'){assert.match(html,/data-slider-input="lower" min="0" max="75"/);assert.match(html,/data-slider-input="upper" min="25" max="100"/);}
 for(const token of F.sliderTokens(c)){assert.notEqual(F.resolve(token),undefined);if(token.startsWith('component.'))assert.match(F.tokens[token].value,/^\{.+\}$/);}
 configurations++;
}
assert.match(F.slider({variant:'range',lower:95,upper:5}),/min="0" max="95" step="1" value="5"/,'Crossed initial values normalize to ascending order');
assert.match(F.slider({value:999}),/max="100" step="1" value="100"/);
assert.match(F.slider({value:'invalid'}),/value="40"/);
const one=F.slider(),two=F.slider();assert.notEqual(one.match(/id="([^"]+)/)[1],two.match(/id="([^"]+)/)[1]);

class Node{
 constructor(dataset={}){this.dataset=dataset;this.events=new Map();this.props={};this.style={setProperty:(name,value)=>this.props[name]=value};this.disabled=false;this.value='0';this.min='0';this.max='100';this.textContent='';this.captured=new Set();}
 addEventListener(type,fn){if(!this.events.has(type))this.events.set(type,new Set());this.events.get(type).add(fn);}
 removeEventListener(type,fn){this.events.get(type)?.delete(fn);}
 dispatchEvent(event){this.events.get(event.type)?.forEach(fn=>fn(event));return true;}
 fire(type,props={}){this.dispatchEvent({type,button:0,isPrimary:true,pointerId:1,preventDefault(){this.defaultPrevented=true;},...props});}
 focus(){focus=this;}getBoundingClientRect(){return {left:0,width:320};}
 setPointerCapture(id){this.captured.add(id);}hasPointerCapture(id){return this.captured.has(id);}releasePointerCapture(id){this.captured.delete(id);}
}
function fixture({variant='range',lower=25,upper=75,value=40,disabled=false,tooltip=true}={}){
 const control=new Node({variant}),stage=new Node(),output=new Node();
 const inputs=variant==='range'?[new Node({sliderInput:'lower'}),new Node({sliderInput:'upper'})]:[new Node({sliderInput:'single'})];
 inputs.forEach(input=>input.disabled=disabled);inputs[0].value=String(variant==='range'?lower:value);if(variant==='range')inputs[1].value=String(upper);
 const bubbles=tooltip?(variant==='range'?['lower','upper','combined']:['single']).map(role=>new Node({sliderBubble:role})):[];
 control.querySelector=selector=>selector==='[data-slider-stage]'?stage:selector==='[data-slider-value]'?output:null;
 control.querySelectorAll=selector=>selector==='[data-slider-input]'?inputs:selector==='[data-slider-bubble]'?bubbles:[];
 let cleanup;F.wireSliders({querySelectorAll:()=>[control]},fn=>cleanup=fn);
 return {control,stage,output,inputs,bubbles,cleanup};
}
const x=value=>10+value*3;
const test=run=>{run();contracts++;};
test(()=>{
 const f=fixture(),[low,high]=f.inputs;
 assert.equal(low.max,'75');assert.equal(high.min,'25');
 low.value='60';low.fire('input');assert.equal(high.min,'60');assert.equal(f.output.textContent,'60 – 75');
 high.value='65';high.fire('input');assert.equal(low.max,'65');
 low.value='90';low.fire('input');assert.equal(low.value,'65','Even synthetic crossing inputs clamp');
 high.value='5';high.fire('input');assert.equal(high.value,'65');
 assert.equal(f.control.dataset.bubblesMerged,'true','Nearby value bubbles combine rather than overlap');
 assert.equal(f.bubbles[2].textContent,'65 – 65');
 assert.ok(!low.events.has('keydown')&&!high.events.has('keydown'),'Native range keyboard semantics remain untouched');
 f.cleanup();
});
test(()=>{
 const f=fixture(),[low,high]=f.inputs;let changes=0;high.addEventListener('change',()=>changes++);
 f.stage.fire('pointerdown',{clientX:x(90)});assert.equal(high.value,'90');assert.equal(focus,high);
 f.stage.fire('pointermove',{clientX:x(60)});assert.equal(high.value,'60');
 f.stage.fire('pointerup',{clientX:x(60)});assert.equal(changes,1);assert.equal(f.control.dataset.dragging,undefined);
 f.stage.fire('pointerdown',{clientX:x(5)});assert.equal(low.value,'5');assert.equal(focus,low);
 f.stage.fire('pointermove',{clientX:x(99)});assert.equal(low.value,'60','The lower pointer thumb cannot cross the upper thumb');
 f.stage.fire('pointercancel',{clientX:x(99)});assert.equal(f.control.dataset.dragging,undefined);
 f.cleanup();
});
test(()=>{
 const f=fixture({lower:50,upper:50}),[low,high]=f.inputs;
 f.stage.fire('pointerdown',{clientX:x(49)});assert.equal(focus,low,'Left half of coincident thumbs selects the lower input');
 f.stage.fire('pointermove',{clientX:x(20)});assert.equal(low.value,'21','Dragging preserves thumb press offset');f.stage.fire('pointerup');
 f.stage.fire('pointerdown',{clientX:x(80)});assert.equal(focus,high);assert.equal(high.value,'80');f.stage.fire('pointerup');
 f.cleanup();
});
test(()=>{
 const f=fixture({disabled:true});f.stage.fire('pointerdown',{clientX:x(90)});
 assert.equal(f.inputs[1].value,'75');assert.equal(f.control.dataset.dragging,undefined);f.cleanup();
 const s=fixture({variant:'single',value:0});s.stage.fire('pointerdown',{clientX:x(100)});assert.equal(s.inputs[0].value,'100');assert.equal(s.output.textContent,'100');s.stage.fire('pointerup');
 s.stage.direction='rtl';s.stage.fire('pointerdown',{clientX:x(0)});assert.equal(s.inputs[0].value,'100','RTL pointer direction matches native range direction');s.stage.fire('pointerup');s.cleanup();
});
test(()=>{
 const f=fixture();f.stage.fire('pointerdown',{clientX:x(30)});assert.equal(f.stage.captured.size,1);f.cleanup();
 assert.equal(f.stage.captured.size,0);assert.equal(f.control.dataset.dragging,undefined);
 for(const node of [f.stage,...f.inputs])assert.equal([...node.events.values()].reduce((n,set)=>n+set.size,0),0,'Unmount removes all listeners');
 assert.ok(observers.every(observer=>observer.disconnected),'Unmount disconnects resize observers');
 const names=new Set(Object.keys(F.tokens).map(F.varName));for(const [,name]of css.matchAll(/var\((--pp-[\w-]+)/g))assert.ok(names.has(name),name);
 assert.match(css,/\.pp-slider-input\{[\s\S]*?pointer-events:none/,'The stacked inputs never steal pointer events from one another');
 assert.match(css,/::-webkit-slider-thumb/);assert.match(css,/::-moz-range-thumb/);assert.match(css,/@media\(forced-colors:active\)/);
});
console.log(JSON.stringify({sliderConfigurations:configurations,interactionContracts:contracts,status:'passed',scope:'aliases, native bounded inputs, pointer selection and dragging, collision-safe bubbles, RTL and cleanup'}));
