/* Source and simulated DOM checks for drawer contracts; no browser/server. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist');let document;
class Node{
 constructor(tag='div',attrs={}){this.tagName=tag;this.attrs={...attrs};this.children=[];this.parentElement=null;this.listeners=new Map();this.style={overflow:''};this.open=false;this.textContent='';this.value=attrs.value||'';this.classList={contains:name=>(this.attrs.class||'').split(' ').includes(name),add:name=>this.attrs.class=(this.attrs.class||'')+' '+name,remove:name=>this.attrs.class=(this.attrs.class||'').split(' ').filter(c=>c!==name).join(' ')};this.dataset=new Proxy({}, {get:(_,key)=>this.attrs['data-'+key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())],set:(_,key,value)=>{this.attrs['data-'+key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())]=String(value);return true;}});}
 get disabled(){return 'disabled'in this.attrs;}get hidden(){return 'hidden'in this.attrs;}set hidden(v){if(v)this.attrs.hidden='';else delete this.attrs.hidden;}get isConnected(){return this===document.body||Boolean(this.parentElement?.isConnected);}
 setAttribute(k,v){this.attrs[k]=String(v);}getAttribute(k){return this.attrs[k]??null;}removeAttribute(k){delete this.attrs[k];}
 append(child){child.parentElement=this;this.children.push(child);}contains(node){return node===this||this.children.some(c=>c.contains(node));}
 matches(s){if(s.startsWith('.'))return this.classList.contains(s.slice(1));if(s.startsWith('#'))return this.attrs.id===s.slice(1);const a=s.match(/^\[([^\]]+)\]$/);return a?a[1]in this.attrs:this.tagName===s;}
 closest(s){return this.matches(s)?this:this.parentElement?.closest(s)||null;}querySelectorAll(s){return this.children.flatMap(c=>[...(c.matches(s)?[c]:[]),...c.querySelectorAll(s)]);}querySelector(s){return this.querySelectorAll(s)[0]||null;}
 set innerHTML(html){this.html=html;this.children=[];const stack=[this];for(const part of html.match(/<[^>]+>|[^<]+/g)||[]){if(part.startsWith('</')){stack.pop();continue;}if(!part.startsWith('<'))continue;const match=part.match(/^<([\w-]+)(.*?)>/s);if(!match)continue;const attrs={};for(const a of match[2].matchAll(/([\w:-]+)(?:="([^"]*)")?/g))attrs[a[1]]=a[2]||'';const node=new Node(match[1],attrs);stack.at(-1).append(node);if(!['input','br','img','hr'].includes(match[1])&&!part.endsWith('/>'))stack.push(node);}}
 addEventListener(t,fn){if(!this.listeners.has(t))this.listeners.set(t,new Set());this.listeners.get(t).add(fn);}removeEventListener(t,fn){this.listeners.get(t)?.delete(fn);}
 emit(type,props={}){const event={type,target:this,preventDefault(){this.prevented=true;},...props};for(const fn of [...(this.listeners.get(type)||[])])fn(event);return event;}
 focus(){document.activeElement=this;}click(){if(!this.disabled)this.emit('click');}showModal(){this.open=true;}close(){this.open=false;this.emit('close');}reportValidity(){return this.valid!==false;}reset(){this.resetCalled=true;}
 getBoundingClientRect(){return {left:400,right:800,top:0,bottom:600};}
}
const timers=new Map(),observers=[];let timerId=0;
const window=new Node('window'),media=new Node('media');media.matches=false;window.matchMedia=()=>media;window.setTimeout=fn=>{timers.set(++timerId,fn);return timerId;};window.clearTimeout=id=>timers.delete(id);window.MutationObserver=class{constructor(fn){this.fn=fn;this.active=true;observers.push(this);}observe(){}disconnect(){this.active=false;}};
document=new Node('document');document.body=new Node('body');document.head=new Node('head');document.defaultView=window;document.append(document.head);document.append(document.body);document.createElement=tag=>new Node(tag);document.getElementById=id=>document.querySelector('#'+id)||{};
const tokenStyle=new Node('style',{id:'project-tokens'});document.head.append(tokenStyle);
const context={window,document};vm.createContext(context);
for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','avatar.js','previews.js','drawer.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const F=window.Forma,css=fs.readFileSync(path.join(dist,'drawer.css'),'utf8');let checks=0;
const test=(name,fn)=>{try{fn();checks++;}catch(e){e.message=name+': '+e.message;throw e;}};
const flush=()=>{for(const [id,fn]of [...timers]){timers.delete(id);fn();}};
function build(config={}){const root=new Node();document.body.append(root);root.innerHTML=F.drawer(config);const cleanup=F.wireDrawer(root),host=root.querySelector('[data-drawer-demo]'),dialog=root.querySelector('[data-drawer-dialog]'),trigger=root.querySelector('[data-drawer-open]'),preview=root.querySelector('[data-drawer-preview]');return {root,host,dialog,trigger,preview,cleanup};}
test('markup, variants, escaping and all referenced aliases',()=>{
 for(const variant of ['details','form'])for(const side of ['left','right'])for(const size of ['sm','md','lg'])for(const footer of [false,true]){
  const html=F.drawer({variant,side,size,footer});assert.match(html,/<dialog[^>]+aria-labelledby=/);assert.match(html,/data-drawer-preview/);assert.match(html,new RegExp(`data-side="${side}"`));assert.equal((html.match(/class="pp-drawer-footer"/g)||[]).length,footer?2:0);for(const token of F.drawerTokens({variant,side,size,footer})){assert.ok(F.tokens[token],token);F.resolve(token);}
  assert.equal(F.drawerTokens({variant}).some(token=>token.startsWith('component.avatar.')),variant==='details');assert.equal(F.drawerTokens({variant}).includes('component.input.focus'),variant==='form');
 }
 assert.match(F.drawer({title:'<img onerror=x>'}),/&lt;img onerror=x&gt;/);assert.doesNotMatch(F.drawer({preview:false}),/data-drawer-preview(?: |>|=)/);
 const first=F.drawer(),second=F.drawer(),ids=[...first.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);assert.equal(new Set(ids).size,ids.length);ids.forEach(id=>assert.ok(!second.includes(`id="${id}"`)));
 assert.match(first,/data-hugeicon="BubbleChatIcon"/);assert.match(first,/data-hugeicon="Clock01Icon"/);
 const vars=new Set(Object.keys(F.tokens).map(F.varName));for(const [,variable]of css.matchAll(/var\((--pp-[a-zA-Z0-9-]+)/g))assert.ok(vars.has(variable),variable);
 assert.match(css,/\.pp-drawer-body\{[^}]*flex:1;min-height:0;overflow-y:auto/);assert.match(css,/\.pp-drawer-footer\{[^}]*flex-shrink:0/);assert.match(css,/height:100dvh/);assert.match(css,/prefers-reduced-motion:reduce/);assert.match(css,/forced-colors:active/);
});
test('native modal opens only on trigger; focus, exit delay, scroll lock and cleanup',()=>{
 const ui=build();assert.equal(ui.dialog.open,false);ui.trigger.focus();ui.trigger.click();assert.equal(ui.dialog.open,true);assert.equal(document.activeElement,ui.dialog.querySelector('[data-drawer-title]'));assert.equal(document.body.style.overflow,'hidden');assert.equal(ui.trigger.getAttribute('aria-expanded'),'true');
 ui.dialog.querySelector('[data-drawer-close]').click();assert.equal(ui.dialog.open,true);assert.equal(ui.dialog.dataset.phase,'closing');assert.equal(timers.size,1);flush();assert.equal(ui.dialog.open,false);assert.equal(document.activeElement,ui.trigger);assert.equal(document.body.style.overflow,'');ui.cleanup();assert.equal(timers.size,0);
});
test('Escape, backdrop and animation-end share close behavior',()=>{
 const ui=build({side:'left'});ui.trigger.focus();ui.trigger.click();const event=ui.dialog.emit('cancel');assert.equal(event.prevented,true);ui.dialog.emit('animationend',{animationName:'pp-drawer-out'});assert.equal(ui.dialog.open,false);assert.equal(timers.size,0);
 ui.trigger.click();ui.dialog.emit('click',{clientX:600,clientY:100});assert.equal(ui.dialog.dataset.phase,'opening');ui.dialog.emit('click',{clientX:200,clientY:100});assert.equal(ui.dialog.dataset.phase,'closing');flush();assert.equal(ui.dialog.open,false);ui.cleanup();
});
test('live reduced motion and pause settle pending closes immediately',()=>{
 const ui=build();ui.trigger.click();ui.dialog.querySelector('[data-drawer-close]').click();media.matches=true;media.emit('change');assert.equal(ui.dialog.open,false);assert.equal(timers.size,0);
 ui.trigger.click();assert.equal(ui.dialog.dataset.motion,'off');ui.dialog.querySelector('[data-drawer-close]').click();assert.equal(ui.dialog.open,false);media.matches=false;ui.trigger.click();ui.dialog.querySelector('[data-drawer-close]').click();document.body.classList.add('motion-paused');observers.filter(o=>o.active).forEach(o=>o.fn());assert.equal(ui.dialog.open,false);document.body.classList.remove('motion-paused');ui.cleanup();
});
test('activity rows have local expandable content and reveal all action',()=>{
 const ui=build(),button=ui.preview.querySelector('[data-drawer-activity]'),detail=document.getElementById(button.getAttribute('aria-controls'));assert.equal(detail.hidden,true);button.click();assert.equal(detail.hidden,false);assert.equal(button.getAttribute('aria-expanded'),'true');button.click();assert.equal(detail.hidden,true);
 const all=ui.preview.querySelector('[data-drawer-all]'),extras=ui.preview.querySelectorAll('[data-drawer-extra]');all.click();assert.ok(extras.every(row=>!row.hidden));assert.equal(all.textContent,'Show recent activity');assert.ok(ui.dialog.querySelectorAll('[data-drawer-extra]').every(row=>row.hidden),'Modal and specimen local state stays independent');all.click();assert.ok(extras.every(row=>row.hidden));ui.cleanup();
});
test('form validity and local save/reset',()=>{
 const ui=build({variant:'form'}),form=ui.preview.querySelector('form');form.valid=false;form.emit('submit');assert.equal(form.querySelector('[data-drawer-status]').textContent,'');form.valid=true;assert.equal(form.emit('submit').prevented,true);assert.equal(form.querySelector('[data-drawer-status]').textContent,'Changes saved in this preview.');ui.preview.querySelector('[data-drawer-preview-reset]').click();assert.equal(form.resetCalled,true);
 ui.trigger.focus();ui.trigger.click();const live=ui.dialog.querySelector('form');live.emit('submit');flush();assert.equal(ui.dialog.open,false);assert.equal(document.activeElement,ui.trigger);ui.cleanup();
});
test('repeat mounting, disabled trigger, no dialog fallback and disposal',()=>{
 const ui=build();F.wireDrawer(ui.root);assert.equal(ui.trigger.listeners.get('click').size,1);ui.trigger.click();ui.dialog.querySelector('[data-drawer-close]').click();ui.cleanup();assert.equal(ui.dialog.open,false);assert.equal(timers.size,0);assert.equal(ui.trigger.listeners.get('click').size,0);assert.equal(document.body.style.overflow,'');
 const disabled=build({disabled:true});disabled.trigger.click();assert.equal(disabled.dialog.open,false);disabled.cleanup();const unsupported=build();unsupported.dialog.showModal=undefined;unsupported.trigger.click();assert.match(unsupported.host.querySelector('[data-drawer-announcement]').textContent,/inline preview/);unsupported.cleanup();assert.ok(observers.every(o=>!o.active));assert.equal(media.listeners.get('change').size,0);
});
console.log(JSON.stringify({drawerChecks:checks,status:'passed',scope:'markup, token contracts and simulated native dialog/form/activity/motion/cleanup events; browser rendering and assistive technology unverified'}));
