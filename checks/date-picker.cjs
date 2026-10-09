/* Calendar handlers executed against a small DOM fixture. No browser/server. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist');let document;
class Node{
 constructor(tag='div',attrs={}){this.tagName=tag;this.attrs={...attrs};this.children=[];this.parentNode=null;this.listeners=new Map();this.style={overflow:''};this.value=attrs.value||'';this.open=false;this.disabled='disabled'in attrs;this.scrollTop=0;}
 get dataset(){return Object.fromEntries(Object.entries(this.attrs).filter(([key])=>key.startsWith('data-')).map(([key,value])=>[key.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),value]));}
 get hidden(){return 'hidden'in this.attrs;}set hidden(value){if(value)this.attrs.hidden='';else delete this.attrs.hidden;}get id(){return this.attrs.id;}set id(value){this.attrs.id=value;}get isConnected(){return this===document.body||Boolean(this.parentNode?.isConnected);}
 setAttribute(key,value){this.attrs[key]=String(value);}getAttribute(key){return this.attrs[key]??null;}removeAttribute(key){delete this.attrs[key];}
 append(child){child.parentNode=this;this.children.push(child);}remove(){if(this.parentNode)this.parentNode.children=this.parentNode.children.filter(x=>x!==this);this.parentNode=null;}
 contains(node){return node===this||this.children.some(child=>child.contains(node));}
 matches(selector){if(selector.startsWith('#'))return this.id===selector.slice(1);const attr=selector.match(/^\[([\w-]+)(?:="([^"]*)")?\]$/);return attr?attr[1]in this.attrs&&(attr[2]===undefined||this.attrs[attr[1]]===attr[2]):this.tagName===selector;}
 closest(selector){return this.matches(selector)?this:this.parentNode?.closest(selector)||null;}
 querySelectorAll(selector){return this.children.flatMap(child=>[...(child.matches(selector)?[child]:[]),...child.querySelectorAll(selector)]);}
 querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
 set innerHTML(html){this.html=html;this.children=[];const stack=[this];for(const part of html.match(/<[^>]+>|[^<]+/g)||[]){if(part.startsWith('</')){stack.pop();continue;}if(!part.startsWith('<'))continue;const match=part.match(/^<([\w-]+)(.*?)>/s);if(!match)continue;const attrs={};for(const a of match[2].matchAll(/([\w:-]+)(?:="([^"]*)")?/g))attrs[a[1]]=(a[2]||'').replaceAll('&quot;','"').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&');const node=new Node(match[1],attrs);stack.at(-1).append(node);if(!['input','br','img','hr'].includes(match[1])&&!part.endsWith('/>'))stack.push(node);}}
 get innerHTML(){return this.html;}
 addEventListener(type,fn){if(!this.listeners.has(type))this.listeners.set(type,new Set());this.listeners.get(type).add(fn);}
 removeEventListener(type,fn){this.listeners.get(type)?.delete(fn);}
 emit(type,props={}){const event={target:this,defaultPrevented:false,preventDefault(){this.defaultPrevented=true;},stopPropagation(){this.stopped=true;},...props};for(const fn of this.listeners.get(type)||[])fn(event);return event;}
 focus(){document.activeElement=this;}scrollIntoView(){this.scrolled=true;}
 showModal(){this.open=true;this.modalCalls=(this.modalCalls||0)+1;}
 close(){this.open=false;this.disabled='disabled'in attrs;this.emit('close');}
 showPopover(){this.popoverOpen=true;}hidePopover(){this.popoverOpen=false;}dispatchEvent(event){this.emit(event.type,event);}
 getBoundingClientRect(){return {left:100,right:420,top:100,bottom:140,width:320,height:420};}
}
const window=new Node('window');window.location={hash:'#all'};
document=new Node('document');document.body=new Node('body');document.head=new Node('head');document.append(document.head);document.defaultView=window;document.append(document.body);document.createElement=tag=>new Node(tag);document.getElementById=id=>document.querySelector('#'+id);
window.innerWidth=1000;window.innerHeight=800;window.Event=class{constructor(type,props){this.type=type;Object.assign(this,props);}};
const context={window,document,Date};vm.createContext(context);
for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','previews.js','date-picker.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const F=window.Forma;let checks=0;const test=(name,fn)=>{fn();checks++;console.log('✓ '+name);};
function build(c={}){const root=new Node();document.body.append(root);root.innerHTML=F.datePicker(c);const host=root.querySelector('[data-date-picker]'),panel=host.querySelector('[data-date-panel]'),trigger=host.querySelector('[data-date-open]'),cleanup=F.wireDatePickers(root);return {root,host,panel,trigger,cleanup,day:value=>panel.querySelector('[data-date-day="'+value+'"]'),action:name=>panel.querySelector('[data-date-action="'+name+'"]'),value:host.querySelector('[data-date-value]'),end:host.querySelector('[data-date-end]')};}
test('single/range inline/popover render tokenized accessible grids and isolated IDs',()=>{
 for(const variant of ['single','range'])for(const display of ['inline','popover'])for(const disabled of [false,true]){
  const html=F.datePicker({variant,display,disabled,presets:true});assert.match(html,/role="grid"/);assert.equal((html.match(/role="gridcell"/g)||[]).length,42);assert.match(html,/October 2026/);assert.match(html,/data-date-day="2026-10-09"/);assert.doesNotMatch(html,/type="date"|undefined|NaN/);
  if(display==='popover')assert.match(html,/popover="manual" hidden/);if(variant==='range')assert.match(html,/aria-multiselectable="true"/);if(disabled)assert.doesNotMatch(html,/tabindex="0"/);
  F.datePickerTokens({variant,display,disabled,presets:true}).forEach(id=>{assert.ok(F.tokens[id],id);F.resolve(id);});
 }
 const a=F.datePicker(),b=F.datePicker();const id=a.match(/data-date-id="([^"]+)"/)[1];assert.ok(!b.includes(id));
 const vars=new Set(Object.keys(F.tokens).map(F.varName)),css=fs.readFileSync(path.join(dist,'date-picker.css'),'utf8');for(const [,variable]of css.matchAll(/var\((--pp-[a-zA-Z0-9-]+)/g))assert.ok(vars.has(variable),variable);
});
test('date arithmetic preserves leap days, month lengths, week boundaries and bounds',()=>{
 assert.equal(F.datePickerMove('2024-01-31','PageDown'),'2024-02-29');assert.equal(F.datePickerMove('2023-01-31','PageDown'),'2023-02-28');assert.equal(F.datePickerMove('2024-02-29','PageDown',{shiftKey:true}),'2025-02-28');assert.equal(F.datePickerMove('2026-10-09','Home'),'2026-10-04');assert.equal(F.datePickerMove('2026-10-09','End'),'2026-10-10');assert.equal(F.datePickerMove('1900-01-01','ArrowLeft'),'1900-01-01');assert.equal(F.datePickerMove('2099-12-31','ArrowRight'),'2099-12-31');
 const s=F.datePickerState({value:'2026-02-30',min:'2026-10-05',max:'2026-10-20'});assert.equal(s.start,'2026-10-09');assert.equal(F.datePickerChoose(s,'2026-02-30'),false);assert.equal(F.datePickerChoose(s,'2026-10-25'),false);
});
test('range click model orders reversed picks and restarts after completion',()=>{
 const s=F.datePickerState({variant:'range'});assert.equal(F.datePickerChoose(s,'2026-10-20'),true);assert.equal(s.end,'');F.datePickerChoose(s,'2026-10-11');assert.equal(s.start,'2026-10-11');assert.equal(s.end,'2026-10-20');F.datePickerChoose(s,'2026-10-01');assert.equal(s.start,'2026-10-01');assert.equal(s.end,'');
});
test('actual keyboard handlers move grid focus across months without selecting',()=>{
 const ui=build();const initial=ui.value.value;ui.day('2026-10-09').focus();ui.panel.emit('keydown',{target:ui.day('2026-10-09'),key:'ArrowUp'});assert.equal(document.activeElement.dataset.dateDay,'2026-10-02');assert.equal(ui.value.value,initial);
 ui.panel.emit('keydown',{target:ui.day('2026-10-02'),key:'ArrowLeft'});ui.panel.emit('keydown',{target:ui.day('2026-10-01'),key:'ArrowLeft'});assert.equal(document.activeElement.dataset.dateDay,'2026-09-30');assert.match(ui.panel.innerHTML,/September 2026/);
 ui.panel.emit('click',{target:ui.day('2026-09-30')});assert.equal(ui.value.value,'2026-09-30');ui.cleanup();
});
test('range UI commits ordered values and clear resets both hidden form fields',()=>{
 const ui=build({variant:'range'});let changes=0;ui.value.addEventListener('change',()=>changes++);
 ui.panel.emit('click',{target:ui.day('2026-10-20')});assert.equal(ui.end.value,'');ui.panel.emit('click',{target:ui.day('2026-10-11')});assert.equal(ui.value.value,'2026-10-11');assert.equal(ui.end.value,'2026-10-20');assert.match(ui.panel.innerHTML,/class="is-range/);
 ui.panel.emit('click',{target:ui.action('clear')});assert.equal(ui.value.value,'');assert.equal(ui.end.value,'');assert.equal(changes,3);ui.cleanup();
});
test('month buttons, presets and disabled/min/max states work without mutating invalid dates',()=>{
 const ui=build({variant:'range',presets:true,today:'2026-10-09',min:'2026-10-05',max:'2026-11-03'});assert.equal(ui.action('previous').disabled,true);ui.panel.emit('click',{target:ui.action('previous')});assert.ok(ui.day('2026-10-09'));ui.panel.emit('click',{target:ui.action('next')});assert.match(ui.panel.innerHTML,/November 2026/);assert.equal(ui.action('next').disabled,true);ui.panel.emit('click',{target:ui.action('week')});assert.equal(ui.value.value,'2026-10-09');assert.equal(ui.end.value,'2026-10-15');ui.cleanup();
 const disabled=build({disabled:true});disabled.panel.emit('click',{target:disabled.day('2026-10-10')});assert.equal(disabled.value.value,'2026-10-09');disabled.cleanup();
});
test('native popover restores focus on select and Escape, dismisses outside, cleans up',()=>{
 const ui=build({display:'popover'});ui.trigger.focus();ui.trigger.emit('click');assert.equal(ui.panel.hidden,false);assert.equal(ui.panel.popoverOpen,true);assert.equal(document.activeElement.dataset.dateDay,'2026-10-09');
 ui.panel.emit('keydown',{target:ui.day('2026-10-09'),key:'Escape'});assert.equal(ui.panel.hidden,true);assert.equal(document.activeElement,ui.trigger);ui.trigger.emit('click');ui.panel.emit('click',{target:ui.day('2026-10-10')});assert.equal(ui.value.value,'2026-10-10');assert.equal(ui.panel.hidden,true);assert.equal(document.activeElement,ui.trigger);
 ui.trigger.emit('click');document.emit('pointerdown',{target:document.body});assert.equal(ui.panel.hidden,true);ui.trigger.emit('click');ui.cleanup();assert.equal(ui.panel.hidden,true);assert.equal(ui.trigger.listeners.get('click').size,0);assert.equal(ui.panel.listeners.get('click').size,0);assert.equal(window.listeners.get('resize').size,0);
});
console.log(`${checks} date-picker checks passed; native browser geometry and accessibility unverified.`);
