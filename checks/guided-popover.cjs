/* Guided popover contracts and simulated DOM behavior; no browser or server required. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist');
class Element{
 constructor(){this.attrs={};this.dataset={};this.style={};this.events={};this.queries={};this.children=[];this.hidden=false;this.disabled=false;this.isConnected=true;this.textContent='';}
 setAttribute(k,v){this.attrs[k]=String(v);}getAttribute(k){return this.attrs[k]??null;}removeAttribute(k){delete this.attrs[k];}
 addEventListener(k,fn){(this.events[k]??=[]).push(fn);}removeEventListener(k,fn){this.events[k]=(this.events[k]||[]).filter(f=>f!==fn);}
 querySelector(k){const v=this.queries[k];return Array.isArray(v)?v[0]:v||null;}querySelectorAll(k){const v=this.queries[k];return v?(Array.isArray(v)?v:[v]):[];}
 append(child){if(child.parentElement)child.parentElement.children=child.parentElement.children.filter(c=>c!==child);child.parentElement=this;this.children.push(child);}
 contains(child){return child===this||this.children.some(c=>c.contains(child));}focus(){document.activeElement=this;}
 getBoundingClientRect(){return this.rect||{left:80,right:400,top:80,bottom:116,width:320,height:280};}
 showPopover(){this.opened=true;}hidePopover(){this.opened=false;}
 dispatch(type,props={}){const event={type,target:this,preventDefault(){this.prevented=true;},...props};for(const fn of [...(this.events[type]||[])])fn(event);return event;}
 click(){if(!this.disabled)this.dispatch('click');}
}
const document=new Element(),window=new Element();document.body=new Element();document.head={append(){}};document.createElement=()=>new Element();document.getElementById=()=>({});document.defaultView=window;window.innerWidth=800;window.innerHeight=640;window.visualViewport=new Element();Object.assign(window.visualViewport,{width:800,height:640,offsetLeft:0,offsetTop:0});
const context={window,document};vm.createContext(context);
for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','previews.js','guided-popover.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const F=window.Forma,css=fs.readFileSync(path.join(dist,'guided-popover.css'),'utf8');
let checks=0;const test=(name,fn)=>{try{fn();checks++;}catch(error){error.message=name+': '+error.message;throw error;}};
function build({open=false,step=1,native=true,disabled=false}={}){
 const root=new Element(),host=new Element(),panel=new Element(),trigger=new Element();root.append(host);host.append(trigger);host.append(panel);panel.hidden=true;trigger.disabled=disabled;host.ownerDocument=document;
 Object.assign(host.dataset,{initialOpen:String(open),step:String(step),firstTitle:'Insert Popover',firstDescription:'First step description'});root.queries['[data-guided-popover]']=[host];host.queries['[data-guided-trigger]']=trigger;host.queries['[data-guided-panel]']=panel;
 const result={root,host,panel,trigger};
 for(const [key,suffix]of Object.entries({title:'title',description:'description',counter:'step',back:'back',next:'next',dismiss:'close',status:'status'})){const element=new Element();result[key]=element;host.queries['[data-guided-'+suffix+']']=element;(key==='status'?host:panel).append(element);}
 if(!native)panel.showPopover=undefined;
 const cleanups=[];F.wireGuidedPopover(root,fn=>cleanups.push(fn));result.cleanup=()=>cleanups.forEach(fn=>fn());return result;
}
test('Markup and inspector reflect anatomy',()=>{
 for(const step of [1,2,3,4])for(const disabled of [false,true]){
  const html=F.guidedPopover({step,disabled});assert.match(html,/popover="manual" role="dialog" aria-labelledby=/);assert.match(html,new RegExp(`Step ${step} of 4`));assert.equal((html.match(/<button\b/g)||[]).length,4);assert.match(html,/data-hugeicon="UserIcon" width="24"/);assert.match(html,/aria-label="Close popover"/);
  for(const id of F.guidedPopoverTokens({step,disabled})){assert.ok(F.tokens[id],id);F.resolve(id);}
 }
 const html=F.guidedPopover({title:'<script>',description:'<img onerror=x>',label:'<trigger>'});assert.match(html,/&lt;script&gt;/);assert.match(html,/&lt;img onerror=x&gt;/);assert.doesNotMatch(html,/<script>|<img/);
 const one=F.guidedPopover().match(/id="(guided-popover-\d+)"/)[1],two=F.guidedPopover().match(/id="(guided-popover-\d+)"/)[1];assert.notEqual(one,two);
 assert.equal(F.resolve('component.guidedPopover.width'),'320px');assert.equal(F.resolve('component.guidedPopover.icon.container'),'48px');assert.equal(F.resolve('component.guidedPopover.padding'),'20px');assert.equal(F.resolve('component.guidedPopover.footer.paddingY'),'16px');assert.equal(F.resolve('component.guidedPopover.footer.actionGap'),'12px');
 const vars=new Set(Object.keys(F.tokens).map(F.varName));for(const [,variable]of css.matchAll(/var\((--pp-[a-zA-Z0-9-]+)/g))assert.ok(vars.has(variable),variable);
 assert.match(css,/prefers-reduced-motion:reduce/);assert.match(css,/motion-paused/);assert.match(css,/forced-colors:active/);assert.match(css,/overflow-wrap:anywhere/);
});
test('Native open, four steps, Back, Done and focus',()=>{
 const ui=build();assert.equal(ui.panel.hidden,true);ui.trigger.click();assert.equal(ui.panel.opened,true);assert.equal(ui.trigger.getAttribute('aria-expanded'),'true');assert.equal(document.activeElement,ui.title);assert.equal(ui.back.disabled,true);
 ui.next.click();assert.equal(ui.counter.textContent,'Step 2 of 4');assert.equal(ui.back.disabled,false);ui.back.click();assert.equal(ui.counter.textContent,'Step 1 of 4');assert.equal(document.activeElement,ui.next);
 ui.next.click();ui.next.click();ui.next.click();assert.equal(ui.next.textContent,'Done');ui.next.click();assert.equal(ui.panel.hidden,true);assert.equal(ui.trigger.getAttribute('aria-expanded'),'false');assert.equal(document.activeElement,ui.trigger);assert.equal(ui.status.textContent,'Introduction complete.');assert.equal(ui.counter.textContent,'Step 1 of 4');ui.cleanup();
});
test('Escape, close button, outside pointer and focus dismissal',()=>{
 const ui=build();ui.trigger.click();document.dispatch('keydown',{key:'Escape'});assert.equal(ui.panel.hidden,true);assert.equal(document.activeElement,ui.trigger);
 ui.trigger.click();ui.dismiss.click();assert.equal(ui.panel.hidden,true);
 ui.trigger.click();document.dispatch('pointerdown',{target:ui.next});assert.equal(ui.panel.hidden,false);document.dispatch('pointerdown',{target:new Element()});assert.equal(ui.panel.hidden,true);
 ui.trigger.click();const outside=new Element();outside.focus();document.dispatch('focusin',{target:outside});assert.equal(ui.panel.hidden,true);assert.equal(document.activeElement,outside);ui.cleanup();
});
test('Fallback portal returns to its owner and removes external listeners',()=>{
 const before=Object.fromEntries(['keydown','pointerdown','focusin','scroll'].map(k=>[k,(document.events[k]||[]).length]));
 const ui=build({native:false});ui.trigger.click();assert.equal(ui.panel.parentElement,document.body);assert.equal(ui.panel.hidden,false);ui.dismiss.click();assert.equal(ui.panel.parentElement,ui.host);ui.trigger.click();ui.cleanup();assert.equal(ui.panel.parentElement,ui.host);assert.equal(ui.panel.hidden,true);
 for(const key of Object.keys(before))assert.equal(document.events[key].length,before[key],key);for(const target of [ui.trigger,ui.dismiss,ui.back,ui.next,ui.panel])assert.ok(Object.values(target.events).every(list=>list.length===0));ui.trigger.click();assert.equal(ui.panel.hidden,true);
});
test('Initial specimen open does not steal focus, duplicate wiring is safe',()=>{
 const external=new Element();external.focus();const ui=build({open:true,step:3});assert.equal(ui.panel.hidden,false);assert.equal(ui.panel.parentElement,ui.host);assert.equal(ui.panel.getAttribute('data-inline'),'true');assert.equal(ui.panel.opened,undefined);assert.equal(document.activeElement,external);assert.equal(ui.counter.textContent,'Step 3 of 4');F.wireGuidedPopover(ui.root);ui.next.click();assert.equal(ui.counter.textContent,'Step 4 of 4');ui.trigger.click();ui.trigger.click();assert.equal(ui.panel.getAttribute('data-inline'),null);assert.equal(ui.panel.opened,true);ui.cleanup();
 const disabled=build({open:true,disabled:true});assert.equal(disabled.panel.hidden,true);disabled.trigger.click();assert.equal(disabled.panel.hidden,true);disabled.cleanup();
});
test('Instances keep independent progress and restore keyboard navigation',()=>{
 const first=build(),second=build();first.trigger.click();first.next.click();second.trigger.click();assert.equal(second.counter.textContent,'Step 1 of 4');assert.equal(first.counter.textContent,'Step 2 of 4');
 const reverse=second.panel.dispatch('keydown',{key:'Tab',shiftKey:true,target:second.title});assert.equal(reverse.prevented,true);assert.equal(second.panel.hidden,true);assert.equal(document.activeElement,second.trigger);first.cleanup();second.cleanup();
});
test('Viewport fit and placement above low triggers',()=>{
 const ui=build();ui.trigger.rect={left:710,right:780,top:570,bottom:606,width:70,height:36};ui.trigger.click();assert.equal(ui.panel.style.left,'472px');assert.equal(ui.panel.style.top,'282px');
 window.visualViewport.width=280;window.visualViewport.height=220;window.visualViewport.dispatch('resize');assert.equal(ui.panel.style.width,'264px');assert.equal(ui.panel.style.maxHeight,'204px');assert.ok(parseFloat(ui.panel.style.left)>=8);assert.ok(parseFloat(ui.panel.style.top)>=8);Object.assign(window.visualViewport,{width:800,height:640});ui.cleanup();
});
console.log(JSON.stringify({guidedPopoverChecks:checks,status:'passed',scope:'markup, token references, simulated native/fallback events and viewport positioning; browser appearance and assistive technology unverified'}));
