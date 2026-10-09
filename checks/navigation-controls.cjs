/* Pagination and stepper handlers executed against a small DOM fixture. No browser/server. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist');let document;
class Node{
 constructor(tag='div',attrs={}){this.tagName=tag;this.attrs={...attrs};this.children=[];this.parentNode=null;this.listeners=new Map();this.style={overflow:''};this.value=attrs.value||'';this.open=false;this.disabled='disabled'in attrs;this.scrollTop=0;}
 get dataset(){const node=this;return new Proxy({}, {get(_,key){return node.attrs['data-'+String(key).replace(/[A-Z]/g,c=>'-'+c.toLowerCase())];},set(_,key,value){node.attrs['data-'+String(key).replace(/[A-Z]/g,c=>'-'+c.toLowerCase())]=String(value);return true;}});}
 get classList(){const node=this;return {contains:name=>(node.attrs.class||'').split(/\s+/).includes(name),toggle(name,on){const names=new Set((node.attrs.class||'').split(/\s+/).filter(Boolean));if(on??!names.has(name))names.add(name);else names.delete(name);node.attrs.class=[...names].join(' ');}};}
 hasAttribute(name){return name in this.attrs;}
 get textContent(){return this.tagName==='#text'?this.text||'':this.children.map(child=>child.textContent).join('');}
 set textContent(value){const child=new Node('#text');child.text=String(value);this.children=[];this.append(child);}

 get hidden(){return 'hidden'in this.attrs;}set hidden(value){if(value)this.attrs.hidden='';else delete this.attrs.hidden;}get id(){return this.attrs.id;}set id(value){this.attrs.id=value;}get isConnected(){return this===document.body||Boolean(this.parentNode?.isConnected);}
 setAttribute(key,value){this.attrs[key]=String(value);}getAttribute(key){return this.attrs[key]??null;}removeAttribute(key){delete this.attrs[key];}
 append(child){child.parentNode=this;this.children.push(child);}remove(){if(this.parentNode)this.parentNode.children=this.parentNode.children.filter(x=>x!==this);this.parentNode=null;}
 contains(node){return node===this||this.children.some(child=>child.contains(node));}
 matches(selector){if(selector.includes(','))return selector.split(',').some(part=>this.matches(part));if(selector.startsWith('.'))return this.classList.contains(selector.slice(1));if(selector.startsWith('#'))return this.id===selector.slice(1);const attr=selector.match(/^\[([\w-]+)(?:="([^"]*)")?\]$/);return attr?attr[1]in this.attrs&&(attr[2]===undefined||this.attrs[attr[1]]===attr[2]):this.tagName===selector;}
 closest(selector){return this.matches(selector)?this:this.parentNode?.closest(selector)||null;}
 querySelectorAll(selector){return this.children.flatMap(child=>[...(child.matches(selector)?[child]:[]),...child.querySelectorAll(selector)]);}
 querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
 set innerHTML(html){this.html=html;this.children=[];const stack=[this];for(const part of html.match(/<[^>]+>|[^<]+/g)||[]){if(part.startsWith('</')){stack.pop();continue;}if(!part.startsWith('<')){const text=new Node('#text');text.text=part.replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&');stack.at(-1).append(text);continue;}const match=part.match(/^<([\w-]+)(.*?)>/s);if(!match)continue;const attrs={};for(const a of match[2].matchAll(/([\w:-]+)(?:="([^"]*)")?/g))attrs[a[1]]=(a[2]||'').replaceAll('&quot;','"').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&');const node=new Node(match[1],attrs);stack.at(-1).append(node);if(!['input','br','img','hr'].includes(match[1])&&!part.endsWith('/>'))stack.push(node);}}
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
const context={window,document};vm.createContext(context);
for(const file of ['tokens.js','hugeicons-icons.js','previews.js','navigation-controls.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const F=window.Forma;let checks=0;const test=(name,fn)=>{fn();checks++;console.log('✓ '+name);};
function build(kind,c={}){const root=new Node();document.body.append(root);root.innerHTML=F[kind](c);let cleanup;F.wireNavigationControls(root,fn=>cleanup=fn);const host=root.querySelector(kind==='pagination'?'[data-pagination]':'[data-step-navigation]');return {root,host,cleanup,find:s=>host.querySelector(s),click:target=>host.emit('click',{target}),key:(target,key)=>host.emit('keydown',{target,key})};}
test('pagination windows stay bounded, ordered, unique and include current plus both edges',()=>{
 for(const total of [1,2,5,7,8,9,10,20,100,999])for(let page=1;page<=total;page++){
  const range=F.paginationRange(page,total),numbers=range.filter(Number.isInteger);assert.equal(numbers[0],1);assert.equal(numbers.at(-1),total);assert.ok(numbers.includes(page));assert.equal(new Set(numbers).size,numbers.length);assert.ok(numbers.every((n,i)=>n>=1&&n<=total&&(!i||n>numbers[i-1])));assert.ok(range.length<=9);assert.notEqual(range[0],'ellipsis');assert.notEqual(range.at(-1),'ellipsis');for(let i=1;i<range.length;i++)assert.ok(range[i]!=='ellipsis'||range[i-1]!=='ellipsis');
 }
 assert.deepEqual(Array.from(F.paginationRange(-10,5)),[1,2,3,4,5]);assert.equal(F.paginationRange(2000,5000).at(-1),999);assert.deepEqual(Array.from(F.paginationRange(NaN,NaN)),[1,2,3,4,5]);
});
test('navigation markup and token references cover selected, compact, dots and disabled states',()=>{
 for(const config of [{},{page:5},{page:500,total:999},{compact:true},{total:1}]){const html=F.pagination(config);assert.match(html,/aria-label="Pagination"/);assert.match(html,/data-pagination-status/);assert.doesNotMatch(html,/NaN|undefined/);if(config.compact)assert.match(html,/Page 1 of 5/);else assert.equal((html.match(/aria-current="page"/g)||[]).length,1);}
 for(const c of [{},{variant:'dots',dotSize:'xs'},{orientation:'vertical'},{disabled:true},{labels:['Only']},{labels:['A < B','C & D'],index:0}]){const html=F.stepper(c);assert.match(html,/<ol/);assert.equal((html.match(/aria-current="step"/g)||[]).length,1);assert.doesNotMatch(html,/NaN|undefined/);if(c.disabled)assert.equal((html.match(/ disabled/g)||[]).length,3);}
 assert.match(F.stepper({labels:['A < B','C & D']}),/A &lt; B/);assert.match(F.stepper({labels:Array.from({length:10},(_,i)=>'Step '+i)}),/data-step-index="7"/);assert.doesNotMatch(F.stepper({labels:Array.from({length:10},(_,i)=>'Step '+i)}),/data-step-index="8"/);
 for(const id of [...F.paginationTokens(),...F.stepperTokens()]){assert.ok(F.tokens[id],id);F.resolve(id);}
 const vars=new Set(Object.keys(F.tokens).map(F.varName));for(const [,id]of fs.readFileSync(path.join(dist,'navigation-controls.css'),'utf8').matchAll(/var\((--pp-[a-zA-Z0-9-]+)/g))assert.ok(vars.has(id),id);
});
test('pagination boundary buttons reject clicks, navigate and preserve reachable focus',()=>{
 const ui=build('pagination',{page:1,total:3}),prev=ui.find('[data-pagination-prev]'),next=ui.find('[data-pagination-next]');assert.equal(prev.disabled,true);ui.click(prev);assert.equal(ui.host.dataset.current,'1');next.focus();ui.click(next);assert.equal(ui.host.dataset.current,'2');assert.equal(prev.disabled,false);assert.equal(document.activeElement,next);ui.click(next);assert.equal(ui.host.dataset.current,'3');assert.equal(next.disabled,true);assert.equal(document.activeElement.dataset.paginationPage,'3');assert.equal(ui.find('[data-pagination-status]').textContent,'Page 3 of 3');ui.click(next);assert.equal(ui.host.dataset.current,'3');prev.focus();ui.click(prev);ui.click(prev);assert.equal(prev.disabled,true);assert.equal(document.activeElement.dataset.paginationPage,'1');ui.cleanup();
});
test('numeric page jumps rerender large ranges and restore focus to the new current button',()=>{
 const ui=build('pagination',{page:1,total:100});const target=ui.find('[data-pagination-page="100"]');target.focus();ui.click(target);assert.equal(ui.host.dataset.current,'100');assert.notEqual(document.activeElement,target);assert.equal(document.activeElement.getAttribute('aria-current'),'page');assert.equal(document.activeElement.dataset.paginationPage,'100');assert.ok(ui.find('[data-pagination-page="99"]'));ui.click(ui.find('[data-pagination-page="1"]'));assert.equal(document.activeElement.dataset.paginationPage,'1');ui.cleanup();
});
test('compact pagination updates text and moves focus to enabled opposite boundary control',()=>{
 const ui=build('pagination',{compact:true,total:2}),prev=ui.find('[data-pagination-prev]'),next=ui.find('[data-pagination-next]');next.focus();ui.click(next);assert.equal(ui.find('[data-pagination-compact]').textContent,'Page 2 of 2');assert.equal(document.activeElement,prev);ui.click(prev);assert.equal(document.activeElement,next);assert.equal(ui.find('[data-pagination-compact]').textContent,'Page 1 of 2');ui.cleanup();
 const single=build('pagination',{total:1,compact:true});assert.equal(single.find('[data-pagination-prev]').disabled,true);assert.equal(single.find('[data-pagination-next]').disabled,true);single.click(single.find('[data-pagination-next]'));assert.equal(single.host.dataset.current,'1');single.cleanup();
});
test('numbered step selection updates state, completion labels and live announcement',()=>{
 const ui=build('stepper',{index:0});ui.click(ui.find('[data-step-index="2"]'));assert.equal(ui.host.dataset.current,'2');assert.deepEqual(ui.host.querySelectorAll('[data-step-item]').map(n=>n.dataset.state),['complete','complete','current']);assert.equal(ui.find('[data-step-index="0"]').getAttribute('aria-label'),'Step 1: Details, completed');assert.equal(ui.find('[data-step-index="2"]').getAttribute('aria-current'),'step');assert.equal(ui.find('[data-step-status]').textContent,'Step 3 of 3: Review');ui.click(ui.find('[data-step-index="0"]'));assert.deepEqual(ui.host.querySelectorAll('[data-step-item]').map(n=>n.dataset.state),['current','pending','pending']);assert.equal(ui.find('[data-step-index="1"]').getAttribute('aria-label'),'Step 2: Preferences');ui.cleanup();
});
test('horizontal, vertical and dot keyboard navigation wraps and supports Home/End',()=>{
 for(const c of [{index:0},{index:0,orientation:'vertical'},{index:0,variant:'dots'}]){
  const ui=build('stepper',c),vertical=c.orientation==='vertical',previous=vertical?'ArrowUp':'ArrowLeft',next=vertical?'ArrowDown':'ArrowRight';let button=ui.find('[data-step-index="0"]');button.focus();assert.equal(ui.key(button,previous).defaultPrevented,true);assert.equal(document.activeElement.dataset.stepIndex,'2');ui.key(document.activeElement,next);assert.equal(document.activeElement.dataset.stepIndex,'0');ui.key(document.activeElement,'End');assert.equal(ui.host.dataset.current,'2');ui.key(document.activeElement,'Home');assert.equal(ui.host.dataset.current,'0');assert.equal(ui.key(document.activeElement,vertical?'ArrowRight':'ArrowDown').defaultPrevented,false);ui.cleanup();
 }
});
test('disabled steppers reject pointer/keyboard selection; cleanup removes state mutations',()=>{
 const disabled=build('stepper',{disabled:true,index:0});const button=disabled.find('[data-step-index="1"]');disabled.click(button);disabled.key(button,'End');assert.equal(disabled.host.dataset.current,'0');disabled.cleanup();
 for(const kind of ['pagination','stepper']){const ui=build(kind,{page:1,index:0});ui.cleanup();ui.cleanup();const target=ui.find(kind==='pagination'?'[data-pagination-next]':'[data-step-index="2"]');ui.click(target);assert.equal(ui.host.dataset.current,kind==='pagination'?'1':'0');assert.equal(ui.host.listeners.get('click').size,0);if(kind==='stepper')assert.equal(ui.host.listeners.get('keydown').size,0);}
});
console.log(`${checks} navigation-control checks passed; simulated DOM, no browser appearance claim.`);
