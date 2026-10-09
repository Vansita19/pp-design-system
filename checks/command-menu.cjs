/* Actual command-menu handlers executed against a small DOM fixture. No browser/server. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist');let document;
class Node{
 constructor(tag='div',attrs={}){this.tagName=tag;this.attrs={...attrs};this.children=[];this.parentNode=null;this.listeners=new Map();this.style={overflow:''};this.value=attrs.value||'';this.open=false;this.scrollTop=0;}
 get dataset(){return Object.fromEntries(Object.entries(this.attrs).filter(([key])=>key.startsWith('data-')).map(([key,value])=>[key.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),value]));}
 get hidden(){return 'hidden'in this.attrs;}set hidden(value){if(value)this.attrs.hidden='';else delete this.attrs.hidden;}get id(){return this.attrs.id;}set id(value){this.attrs.id=value;}get isConnected(){return this===document.body||Boolean(this.parentNode?.isConnected);}
 setAttribute(key,value){this.attrs[key]=String(value);}getAttribute(key){return this.attrs[key]??null;}removeAttribute(key){delete this.attrs[key];}
 append(child){child.parentNode=this;this.children.push(child);}remove(){if(this.parentNode)this.parentNode.children=this.parentNode.children.filter(x=>x!==this);this.parentNode=null;}
 contains(node){return node===this||this.children.some(child=>child.contains(node));}
 matches(selector){if(selector.startsWith('#'))return this.id===selector.slice(1);const attr=selector.match(/^\[([^\]]+)\]$/);return attr?attr[1]in this.attrs:this.tagName===selector;}
 closest(selector){return this.matches(selector)?this:this.parentNode?.closest(selector)||null;}
 querySelectorAll(selector){return this.children.flatMap(child=>[...(child.matches(selector)?[child]:[]),...child.querySelectorAll(selector)]);}
 querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
 set innerHTML(html){this.html=html;this.children=[];const stack=[this];for(const part of html.match(/<[^>]+>|[^<]+/g)||[]){if(part.startsWith('</')){stack.pop();continue;}if(!part.startsWith('<'))continue;const match=part.match(/^<([\w-]+)(.*?)>/s);if(!match)continue;const attrs={};for(const a of match[2].matchAll(/([\w:-]+)(?:="([^"]*)")?/g))attrs[a[1]]=a[2]||'';const node=new Node(match[1],attrs);stack.at(-1).append(node);if(!['input','br','img','hr'].includes(match[1])&&!part.endsWith('/>'))stack.push(node);}}
 get innerHTML(){return this.html;}
 addEventListener(type,fn){if(!this.listeners.has(type))this.listeners.set(type,new Set());this.listeners.get(type).add(fn);}
 removeEventListener(type,fn){this.listeners.get(type)?.delete(fn);}
 emit(type,props={}){const event={target:this,defaultPrevented:false,preventDefault(){this.defaultPrevented=true;},stopPropagation(){this.stopped=true;},...props};for(const fn of this.listeners.get(type)||[])fn(event);return event;}
 focus(){document.activeElement=this;}scrollIntoView(){this.scrolled=true;}
 showModal(){this.open=true;this.modalCalls=(this.modalCalls||0)+1;}
 close(){this.open=false;this.emit('close');}
 getBoundingClientRect(){return {left:100,right:660,top:100,bottom:600};}
}
const window=new Node('window');window.location={hash:'#all'};
document=new Node('document');document.body=new Node('body');document.head=new Node('head');document.append(document.head);document.defaultView=window;document.append(document.body);document.createElement=tag=>new Node(tag);document.getElementById=id=>document.querySelector('#'+id);
const context={window,document};vm.createContext(context);
for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','chip.js','previews.js','catalogue.js','command-menu.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const F=window.Forma;
let assertions=0;const test=(name,fn)=>{fn();assertions++;console.log('✓ '+name);};
test('all targets are live visible routes; search supports aliases and multiple words',()=>{
 const entries=F.commandMenuItems();assert.equal(entries[0].href,'#all');for(const item of entries.slice(1)){assert.ok(F.isPageVisible(item.id));assert.equal(item.href,F.pageHref(item.id));assert.ok(!F.pageAliases[item.id]);}
 assert.ok(F.commandMenuItems('button atoms').some(x=>x.id==='button'));assert.ok(F.commandMenuItems('ICON BUTTON').some(x=>x.id==='button'));assert.equal(F.commandMenuItems('completely missing name').length,0);
 const groups=entries.map(x=>x.group).filter((x,n,a)=>n===0||x!==a[n-1]);assert.equal(new Set(groups).size,groups.length,'Arrow order matches contiguous visual groups');
});
test('preview has isolated IDs, accessible empty state and fully resolvable tokens',()=>{
 const first=F.commandMenuPreview(),second=F.commandMenuPreview();const ids=[...first.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);assert.ok(ids.length);ids.forEach(id=>assert.ok(!second.includes('id="'+id+'"')));
 assert.match(first,/inert/);assert.match(first,/data-command-menu-open/);assert.match(first,/role="combobox"/);assert.match(first,/role="listbox"/);assert.match(first,/Navigate/);assert.match(first,/ESC/);
 assert.match(F.commandMenuPreview({state:'empty'}),/No results found/);assert.doesNotMatch(F.commandMenuPreview({state:'empty'}),/aria-activedescendant/);assert.doesNotMatch(F.commandMenuPreview({state:'unselected'}),/aria-activedescendant/);
 assert.doesNotMatch(F.commandMenuPreview({query:'"><script>alert(1)<\/script>'}),/<script>/);F.commandMenuTokens().forEach(id=>{assert.ok(F.tokens[id],id);F.resolve(id);});
});
const trigger=new Node('button',{'data-command-menu-open':''});document.body.append(trigger);trigger.focus();
const controller=F.wireCommandMenu(document),dialog=document.querySelector('dialog'),input=dialog.querySelector('[data-command-input]'),results=dialog.querySelector('[data-command-results]'),closeButton=dialog.querySelector('[data-command-close]');
const key=(key,extra={})=>document.emit('keydown',{key,target:document.activeElement,...extra});
test('Cmd/Ctrl K uses native modal, focuses search, locks scroll and mounts once',()=>{
 assert.equal(F.wireCommandMenu(document),controller);key('k',{metaKey:true});assert.equal(dialog.open,true);assert.equal(dialog.modalCalls,1);assert.equal(document.activeElement,input);assert.equal(document.body.style.overflow,'hidden');assert.equal(input.getAttribute('aria-activedescendant'),results.querySelector('[data-command-index]').id);
 key('K',{ctrlKey:true});assert.equal(dialog.open,false);assert.equal(document.activeElement,trigger);assert.equal(document.body.style.overflow,'');document.emit('click',{target:trigger});assert.equal(dialog.open,true);
});
test('arrows change active descendant without leaving input; Enter navigates',()=>{
 key('ArrowDown');const rows=results.querySelectorAll('[data-command-index]');assert.equal(input.getAttribute('aria-activedescendant'),rows[1].id);assert.equal(rows[0].getAttribute('aria-selected'),'false');assert.equal(rows[1].getAttribute('aria-selected'),'true');assert.equal(document.activeElement,input);
 key('ArrowUp');key('ArrowUp');assert.equal(input.getAttribute('aria-activedescendant'),rows.at(-1).id);key('ArrowDown');assert.equal(input.getAttribute('aria-activedescendant'),rows[0].id);
 input.value='Button Atoms';input.emit('input');assert.ok(results.querySelector('[data-command-index]'));key('Enter');assert.equal(window.location.hash,F.pageHref('button'));assert.equal(dialog.open,false);assert.equal(document.activeElement,trigger);
});
test('empty results remove active descendant and cannot navigate; typing recovers',()=>{
 controller.open();input.value='zz-no-results';input.emit('input');assert.equal(input.getAttribute('aria-activedescendant'),null);assert.equal(dialog.querySelector('[data-command-status]').textContent,'No results found');const hash=window.location.hash;key('ArrowDown');key('Enter');assert.equal(window.location.hash,hash);assert.equal(dialog.open,true);
 input.value='colors';input.emit('input');assert.match(input.getAttribute('aria-activedescendant'),/-option-0$/);assert.equal(dialog.querySelector('[data-command-status]').textContent,'1 result');
});
test('focus is trapped in both directions; Escape restores focus and scroll',()=>{
 const last=dialog.querySelectorAll('button').at(-1);key('Tab',{shiftKey:true});assert.equal(document.activeElement,last);key('Tab');assert.equal(document.activeElement,input);key('Tab');assert.equal(document.activeElement,closeButton);
 document.emit('focusin',{target:trigger});assert.equal(document.activeElement,input);const event=key('Escape');assert.equal(event.defaultPrevented,true);assert.equal(dialog.open,false);assert.equal(document.activeElement,trigger);assert.equal(document.body.style.overflow,'');
});
test('close button receives Enter normally; pointer selection navigates; backdrop closes',()=>{
 controller.open();closeButton.focus();assert.equal(key('Enter').defaultPrevented,false);closeButton.emit('click');assert.equal(dialog.open,false);
 controller.open();input.value='accordion';input.emit('input');const row=results.querySelector('[data-command-index]');results.emit('pointermove',{target:row});results.emit('click',{target:row});assert.equal(window.location.hash,F.pageHref('accordion'));assert.equal(dialog.open,false);
 controller.open();dialog.emit('click',{clientX:200,clientY:200});assert.equal(dialog.open,true);dialog.emit('click',{clientX:50,clientY:50});assert.equal(dialog.open,false);
});
test('IME keys do not activate commands and native cancel restores focus',()=>{
 controller.open();key('Enter',{isComposing:true});assert.equal(dialog.open,true);key('Escape',{isComposing:true});assert.equal(dialog.open,true);dialog.emit('cancel');assert.equal(dialog.open,false);assert.equal(document.activeElement,trigger);
});
test('shared scope chip removal filters actual results, all scopes restores them, empty scopes recover',()=>{
 controller.open();const scopeHost=dialog.querySelector('[data-command-scopes]');
 const remove=scope=>scopeHost.querySelectorAll('[data-chip-remove]').find(button=>button.dataset.chipValue===scope);
 scopeHost.emit('click',{target:remove('components')});input.value='button';input.emit('input');assert.equal(results.querySelectorAll('[data-command-index]').length,0);
 input.value='colors';input.emit('input');assert.equal(results.querySelectorAll('[data-command-index]').length,1);
 scopeHost.emit('click',{target:remove('foundations')});assert.equal(results.querySelectorAll('[data-command-index]').length,0);assert.equal(input.getAttribute('aria-activedescendant'),null);
 scopeHost.emit('click',{target:scopeHost.querySelector('[data-command-reset-scopes]')});assert.equal(results.querySelectorAll('[data-command-index]').length,1);assert.equal(scopeHost.querySelectorAll('[data-chip-remove]').length,2);assert.equal(document.activeElement,input);controller.close();
 assert.ok(F.commandMenuItems('', ['foundations']).every(item=>item.group==='Foundations'));assert.ok(F.commandMenuItems('', ['components']).every(item=>item.group!=='Foundations'));
 assert.match(F.commandMenuPreview({scope:'foundations'}),/Remove Foundations/);assert.doesNotMatch(F.commandMenuPreview({scope:'foundations'}),/Remove Components/);assert.doesNotMatch(F.commandMenuPreview({scopes:false}),/data-command-scopes>/);
 assert.ok(F.commandMenuTokens().some(id=>id.startsWith('component.chip.')));assert.ok(!F.commandMenuTokens({scopes:false}).some(id=>id.startsWith('component.chip.')));
});
test('BFCache close keeps the shortcut; destruction removes portal and all listeners',()=>{
 controller.open();window.emit('pagehide',{persisted:true});assert.equal(dialog.open,false);key('k',{ctrlKey:true});assert.equal(dialog.open,true);window.emit('pagehide',{persisted:false});assert.equal(document.querySelector('dialog'),null);assert.equal(document.body.style.overflow,'');key('k',{ctrlKey:true});assert.equal(document.querySelector('dialog'),null);assert.equal(document.listeners.get('keydown').size,0);assert.equal(window.listeners.get('pagehide').size,0);
 const replacement=F.wireCommandMenu(document);assert.notEqual(replacement,controller);replacement.destroy();replacement.destroy();
});
console.log(`${assertions} command-menu checks passed (simulated DOM; visual/browser accessibility unverified).`);

test('narrow search header spacing keeps enough specificity to override its base rule',()=>{
 const css=fs.readFileSync(path.join(dist,'command-menu.css'),'utf8');
 assert.match(css,/@media\(max-width:480px\)\{[^\n]*\.pp-command-card \.pp-command-header\{gap:var\(--pp-space-8\)\}/);
});
