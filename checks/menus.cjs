/* Menu markup, viewport placement and keyboard/form event contracts. No browser is launched. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist'),timers=new Map();let timerId=0;
class Element{
 constructor(attrs={}){this.attrs={...attrs};this.events={};this.queries={};this.children=[];this.dataset={};this.style={};this.hidden=false;this.disabled=false;this.isConnected=true;this.value='';this.textContent='';this.scrollWidth=220;this.scrollHeight=160;const classes=new Set();this.classList={add:className=>classes.add(className),remove:className=>classes.delete(className),contains:className=>classes.has(className),toggle:(name,enabled)=>{enabled??=!classes.has(name);enabled?classes.add(name):classes.delete(name);return enabled;}};}
 setAttribute(key,value){this.attrs[key]=String(value);}getAttribute(key){return this.attrs[key]??null;}hasAttribute(key){return key in this.attrs;}removeAttribute(key){delete this.attrs[key];}
 addEventListener(key,fn){(this.events[key]??=[]).push(fn);}removeEventListener(key,fn){this.events[key]=(this.events[key]||[]).filter(f=>f!==fn);}
 querySelector(selector){const found=this.queries[selector];return Array.isArray(found)?found[0]:found||null;}
 querySelectorAll(selector){const found=this.queries[selector];return found?Array.isArray(found)?found:[found]:[];}
 append(child){if(child.parentElement)child.parentElement.children=child.parentElement.children.filter(el=>el!==child);child.parentElement=this;this.children.push(child);}
 contains(child){return child===this||this.children.some(el=>el.contains(child));}
 closest(selector){if(['[data-option]','[data-chip-remove]','[data-menu-clear]'].includes(selector)&&this.hasAttribute(selector.slice(1,-1)))return this;if(selector==='form')return this.form||null;if(selector==='.pp-theme,.pp-dialog')return this.light?{}:null;return this.parentElement?.closest(selector)||null;}
 matches(selector){return selector===':popover-open'?Boolean(this.opened):selector===':disabled'?this.disabled:false;}
 getBoundingClientRect(){return this.rect||{left:40,right:260,top:80,bottom:116,width:220,height:36};}
 focus(){document.activeElement=this;}scrollIntoView(){}showPopover(){this.opened=true;}hidePopover(){this.opened=false;}
 dispatchEvent(event){event.target??=this;event.preventDefault??=()=>{event.prevented=true;};event.stopPropagation??=()=>{};(this.events[event.type]||[]).slice().forEach(fn=>fn(event));return !event.prevented;}
 dispatch(type,props={}){const event={type,...props};this.dispatchEvent(event);return event;}
 click(){if(!this.disabled)this.dispatch('click');}
 after(child){this.afterElement=child;if(this.parentElement)this.parentElement.append(child);}
 remove(){this.removed=true;if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(el=>el!==this);}
 set innerHTML(markup){this.markup=markup;if(!markup.includes('data-pp-menu="select"'))return;const id=markup.match(/aria-controls="([^"]+)"/)?.[1],value=markup.match(/data-menu-control data-value="([^"]*)"/)?.[1]||'';const options=Array.from(markup.matchAll(/id="([^"]+)" class="pp-menu-option" role="option" aria-selected="([^"]+)"[^>]*data-value="([^"]*)" data-label="([^"]*)"/g)).map(match=>({label:match[4],value:match[3],id:match[1]}));const built=build('select',options,value);built.popup.id=id;this.append(built.host);this.firstElementChild=built.host;}
 get innerHTML(){return this.markup||'';}
}
const document=new Element(),window=new Element();document.body=new Element();document.createElement=()=>new Element();document.getElementById=()=>({});document.head={append(){}};document.defaultView=window;window.innerWidth=800;window.innerHeight=600;window.setTimeout=fn=>{timers.set(++timerId,fn);return timerId;};window.clearTimeout=id=>timers.delete(id);window.requestAnimationFrame=fn=>window.setTimeout(fn);window.cancelAnimationFrame=window.clearTimeout;window.Event=class{constructor(type,props={}){this.type=type;Object.assign(this,props);}};
const context={window,document};vm.createContext(context);
for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','avatar.js','chip.js','menus.js','previews.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const F=window.Forma;F.notify=()=>{};
function build(kind='select',values=['Alpha','Beta','Gamma'],value='Alpha'){
 const root=new Element(),host=new Element(),trigger=new Element(),popup=new Element(),status=new Element(),label=new Element(),empty=new Element();host.dataset.ppMenu=kind;trigger.dataset.value=value;trigger.value=value;popup.hidden=true;popup.id='options';host.append(trigger);host.append(popup);root.append(host);host.queries={'[data-menu-control]':trigger,'.pp-menu-popup':popup,'[data-menu-status]':status,'[data-select-label]':label};root.queries['[data-pp-menu]']=[host];root.queries.select=[];
 const options=values.map((item,index)=>{const v=typeof item==='string'?{label:item,value:item}:item,option=new Element({'data-option':'','aria-selected':String(v.value===value),...(v.disabled?{'aria-disabled':'true'}:{})});option.dataset={value:v.value,label:v.label};option.id=v.id||'option-'+index;option.disabled=Boolean(v.disabled);popup.append(option);return option;});popup.queries={'[data-option]':options,'[data-menu-empty]':empty};options.forEach(option=>option.queries['.pp-menu-check']=new Element());return {root,host,trigger,popup,options,status,label,empty};
}
function multipleUI(values=['Alpha','Gamma']){
 const ui=build('combobox'),chips=new Element(),field=new Element(),clear=new Element({'data-menu-clear':''});ui.host.dataset.multiple='true';ui.trigger.dataset.values=JSON.stringify(values);ui.trigger.value='';ui.host.append(chips);ui.host.append(clear);ui.host.queries['[data-combobox-chips]']=chips;ui.host.queries['[data-combobox-field]']=field;ui.host.queries['[data-menu-clear]']=clear;ui.options.forEach(option=>option.setAttribute('aria-selected',String(values.includes(option.dataset.value))));return {...ui,chips,field,clear};
}
let checks=0;const test=(name,run)=>{run();checks++;};
test('all three controls use custom accessible popup markup and escaped values',()=>{
 for(const html of [F.select({label:'Test <field>'}),F.combobox({placeholder:'Search <name>'}),F.dropdownMenu({destructive:true})]){assert.match(html,/popover="manual" hidden/);assert.match(html,/aria-controls="pp-/);assert.doesNotMatch(html,/<select\b|<option\b/);assert.doesNotMatch(html,/onclick=/);}
 assert.match(F.select({label:'Test <field>'}),/Test &lt;field&gt;/);assert.match(F.combobox({placeholder:'Search <name>'}),/Search &lt;name&gt;/);
 assert.match(F.dropdownMenu({destructive:true}),/is-destructive/);assert.match(F.dropdownMenu({disabled:true}),/disabled/);assert.match(F.select({state:'invalid'}),/aria-invalid="true"/);
 for(const c of [{},{size:'sm',state:'focus'},{size:'lg',disabled:true},{state:'invalid',destructive:true}])for(const kind of ['select','combobox','dropdown'])for(const token of F.menuTokens(kind,c)){assert.ok(F.tokens[token],token);F.resolve(token);}
 const variables=new Set(Object.keys(F.tokens).map(F.varName)),css=fs.readFileSync(path.join(dist,'menus.css'),'utf8');for(const [,variable]of css.matchAll(/var\((--pp-[a-zA-Z0-9-]+)/g))assert.ok(variables.has(variable),variable);
 assert.match(css,/position:fixed/);assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);assert.match(css,/@media\(forced-colors:active\)/);
});
test('sectioned menus compose real navigation groups and optional avatar/badge identity',()=>{
 const html=F.dropdownMenu();assert.match(html,/pp-menu-sectioned/);assert.match(html,/role="group" aria-labelledby=/);assert.match(html,/Browse/);assert.match(html,/Components/);assert.match(html,/<a href="#colors\/overview"/);assert.match(html,/role="separator"/);assert.doesNotMatch(html,/pp-menu-identity/);
 const identity=F.dropdownMenu({identityHeader:true});assert.match(identity,/data-slot="avatar"/);assert.match(identity,/class="pp-badge/);assert.match(identity,/Component library/);
 const basic=F.dropdownMenu({appearance:'basic'});assert.doesNotMatch(basic,/pp-menu-sectioned|role="group"/);assert.match(basic,/Duplicate/);
 for(const token of F.menuTokens('dropdown',{identityHeader:true})){assert.ok(F.tokens[token],token);F.resolve(token);}
 const custom=F.dropdownMenu({items:[{label:'Bad <target>',href:'javascript:alert(1)',group:'Test <group>'},{label:'Disabled link',href:'#colors/overview',disabled:true}]});assert.doesNotMatch(custom,/href="javascript:/);assert.match(custom,/Test &lt;group&gt;/);assert.match(custom,/disabled aria-disabled="true"/);
});
test('menu links work by keyboard and pointer while disabled links remain inactive',()=>{
 const ui=build('menu',[{label:'Colors',value:'Colors'},{label:'Typography',value:'Typography',disabled:true}]);window.location={hash:'#all'};ui.options[0].dataset.menuHref='#colors/overview';ui.options[1].dataset.menuHref='#typography/overview';ui.host.dataset.menuAppearance='sectioned';
 const cleanup=F.wireMenus(ui.root);ui.trigger.click();assert.equal(ui.popup.style.width,'280px');ui.popup.dispatch('keydown',{key:'Enter'});assert.equal(window.location.hash,'#colors/overview');assert.equal(ui.popup.hidden,true);assert.equal(document.activeElement,ui.trigger);
 window.location.hash='#all';ui.trigger.click();ui.popup.dispatch('click',{target:ui.options[1]});assert.equal(window.location.hash,'#all');ui.popup.dispatch('click',{target:ui.options[0]});assert.equal(window.location.hash,'#colors/overview');cleanup();
});
test('viewport collision moves right-edge menu left and bottom-edge menu above',()=>{
 const p=F.menuPlacement({left:740,right:790,top:540,bottom:576},{width:240,height:180},{width:800,height:600});assert.equal(p.left,552);assert.equal(p.top,352);assert.equal(p.side,'top');assert.ok(p.left+p.width<=792);
 const tiny=F.menuPlacement({left:2,right:98,top:2,bottom:30},{width:300,height:400},{width:160,height:140});assert.equal(tiny.width,144);assert.equal(tiny.left,8);assert.ok(tiny.top+Math.min(400,tiny.maxHeight)<=132);
 const shifted=F.menuPlacement({left:0,right:20,top:100,bottom:136},{width:300,height:80},{width:400,height:250,left:10,top:40});assert.equal(shifted.left,18);assert.ok(shifted.top>=48);
});
test('AlignUI proportions retain PP tokens, optional leading icons and an inset chevron',()=>{
 assert.equal(F.resolve('component.select.icon'),'20px');assert.equal(F.resolve('component.select.chevron'),'16px');assert.equal(F.resolve('component.control.chevron'),'16px');assert.equal(F.resolve('component.menu.icon'),'20px');assert.equal(F.resolve('component.menu.content.padding'),'8px');assert.equal(F.resolve('component.menu.item.height'),'36px');assert.equal(F.resolve('component.menu.item.font'),'14px');assert.equal(F.resolve('component.menu.gap'),'8px');assert.equal(F.resolve('component.select.radius'),'10px');assert.equal(F.resolve('component.menu.radius'),'12px');
 for(const size of ['sm','md','lg']){assert.equal(F.resolve('component.select.paddingEnd.'+size),{sm:'6px',md:'8px',lg:'12px'}[size]);for(const kind of ['select','combobox']){const tokens=F.menuTokens(kind,{size,state:'hover',icon:'leading'});assert.ok(tokens.includes(size==='sm'?'font.size.13':'component.input.font'));assert.ok(tokens.includes('semantic.border.strong'));if(size==='sm')assert.ok(!tokens.includes('component.input.font'));}}
 assert.match(F.select({icon:'leading'}),/pp-select-leading/);assert.match(F.select(),/pp-select-arrow/);assert.match(F.combobox({icon:'leading'}),/has-leading-icon/);assert.doesNotMatch(F.select(),/pp-select-leading/);const css=fs.readFileSync(path.join(dist,'menus.css'),'utf8');assert.match(css,/\.pp-select-arrow[^}]+flex:0 0 var\(--pp-component-control-chevron\)/);assert.match(css,/\[data-select-label\][^}]+min-width:0/);
});
test('small multiselect reserves air around chips and keeps the common utility icon contract',()=>{
 assert.equal(F.resolve('component.combobox.chips.padding.sm'),'4px');
 assert.equal(F.resolve('component.select.icon.foreground'),F.resolve('semantic.text.secondary'));
 const html=F.combobox({variant:'multiple',size:'sm',values:['Alpha'],options:['Alpha'],showClear:true});
 assert.match(html,/pp-combobox-chips-field size-sm/);assert.match(html,/data-hugeicon="ArrowDown01Icon" width="16"/);assert.match(html,/data-hugeicon="Cancel01Icon" width="16"/);
 assert.ok(F.menuTokens('combobox',{variant:'multiple',size:'sm'}).includes('component.combobox.chips.padding.sm'));
});
test('selection keyboard opens, skips disabled rows, commits and restores focus',()=>{
 const ui=build('select',[{label:'Alpha',value:'Alpha'},{label:'Beta',value:'Beta',disabled:true},{label:'Gamma',value:'Gamma'}]);let changes=0;ui.trigger.addEventListener('change',()=>changes++);const cleanup=F.wireMenus(ui.root);
 ui.trigger.dispatch('keydown',{key:'ArrowDown'});assert.equal(ui.popup.hidden,false);assert.equal(ui.trigger.getAttribute('aria-expanded'),'true');ui.trigger.dispatch('keydown',{key:'ArrowDown'});assert.equal(ui.trigger.getAttribute('aria-activedescendant'),'option-2');ui.trigger.dispatch('keydown',{key:'Enter'});assert.equal(ui.trigger.dataset.value,'Gamma');assert.equal(ui.label.textContent,'Gamma');assert.equal(ui.popup.hidden,true);assert.equal(changes,1);assert.equal(document.activeElement,ui.trigger);assert.equal(ui.options[0].getAttribute('aria-selected'),'false');assert.equal(ui.options[2].getAttribute('aria-selected'),'true');cleanup();
});
test('Home, End, typeahead and Escape preserve selected value',()=>{
 const ui=build();const cleanup=F.wireMenus(ui.root);ui.trigger.click();ui.trigger.dispatch('keydown',{key:'End'});assert.equal(ui.trigger.getAttribute('aria-activedescendant'),'option-2');ui.trigger.dispatch('keydown',{key:'Home'});assert.equal(ui.trigger.getAttribute('aria-activedescendant'),'option-0');ui.trigger.dispatch('keydown',{key:'b'});assert.equal(ui.trigger.getAttribute('aria-activedescendant'),'option-1');ui.trigger.dispatch('keydown',{key:'Escape'});assert.equal(ui.popup.hidden,true);assert.equal(ui.trigger.dataset.value,'Alpha');cleanup();
});
test('combobox filters, announces empty state, selects without focus loss',()=>{
 const ui=build('combobox');const cleanup=F.wireMenus(ui.root);ui.trigger.focus();ui.trigger.dispatch('focus');ui.trigger.value='be';ui.trigger.dispatch('input');assert.equal(ui.options[0].hidden,true);assert.equal(ui.options[1].hidden,false);assert.equal(ui.status.textContent,'1 result available');ui.trigger.dispatch('keydown',{key:'Enter'});assert.equal(ui.trigger.value,'Beta');assert.equal(ui.trigger.dataset.value,'Beta');ui.trigger.value='zzz';ui.trigger.dispatch('input');assert.equal(ui.empty.hidden,false);assert.equal(ui.status.textContent,'No results found.');assert.equal(ui.trigger.getAttribute('aria-activedescendant'),null);ui.trigger.dispatch('keydown',{key:'Escape'});assert.equal(ui.trigger.value,'Beta');assert.equal(ui.popup.hidden,true);cleanup();
});
test('dropdown menu keyboard and Tab release focus to the trigger',()=>{
 const ui=build('menu');let selected='';F.notify=text=>selected=text;const cleanup=F.wireMenus(ui.root);ui.trigger.click();assert.equal(document.activeElement,ui.options[0]);ui.popup.dispatch('keydown',{key:'End'});assert.equal(document.activeElement,ui.options[2]);ui.popup.dispatch('keydown',{key:'Enter'});assert.equal(selected,'Gamma selected');assert.equal(document.activeElement,ui.trigger);ui.trigger.click();ui.popup.dispatch('keydown',{key:'Tab'});assert.equal(ui.popup.hidden,true);assert.equal(document.activeElement,ui.trigger);cleanup();
});
test('disabled triggers and disabled options do not mutate',()=>{
 const ui=build('select',[{label:'Alpha',value:'Alpha'},{label:'Beta',value:'Beta',disabled:true}]);const cleanup=F.wireMenus(ui.root);ui.trigger.disabled=true;ui.trigger.click();assert.equal(ui.popup.hidden,true);ui.trigger.disabled=false;ui.trigger.click();ui.popup.dispatch('click',{target:ui.options[1]});assert.equal(ui.trigger.dataset.value,'Alpha');assert.equal(ui.popup.hidden,false);cleanup();
});
test('only one popup stays open and outside pointer closes it',()=>{
 const first=build(),second=build();const c1=F.wireMenus(first.root),c2=F.wireMenus(second.root);first.trigger.click();second.trigger.click();assert.equal(first.popup.hidden,true);assert.equal(second.popup.hidden,false);document.dispatch('pointerdown',{target:new Element()});assert.equal(second.popup.hidden,true);c1();c2();
});
test('uncommitted combobox text is restored on outside dismissal',()=>{
 const ui=build('combobox');const cleanup=F.wireMenus(ui.root);ui.trigger.dispatch('focus');ui.trigger.value='gam';ui.trigger.dispatch('input');document.dispatch('pointerdown',{target:new Element()});assert.equal(ui.trigger.value,'Alpha');assert.equal(ui.trigger.dataset.value,'Alpha');assert.equal(ui.popup.hidden,true);cleanup();
});
test('portal fallback escapes clipping and cleanup restores DOM and listeners',()=>{
 const ui=build();ui.popup.showPopover=undefined;const before=(document.events.pointerdown||[]).length,cleanup=F.wireMenus(ui.root);ui.trigger.click();assert.equal(ui.popup.parentElement,document.body);assert.equal(ui.popup.style.left,'40px');cleanup();assert.equal(ui.popup.parentElement,ui.host);assert.equal(ui.popup.hidden,true);assert.equal((document.events.pointerdown||[]).length,before);assert.equal(ui.trigger.events.keydown.length,0);
});
test('enhanced native select dispatches form changes, syncs reset, and restores labels on disposal',()=>{
 const root=new Element(),select=new Element({'aria-label':'Team','id':'team'}),label=new Element({'for':'team'}),form=new Element();select.id='team';label.htmlFor='team';select.labels=[label];select.options=[{value:'Alpha',label:'Alpha'},{value:'Beta',label:'Beta'}];select.value='Alpha';select.form=form;root.append(select);root.queries.select=[select];let changed=0;select.addEventListener('change',()=>changed++);const cleanup=F.enhanceSelects(root),holder=select.afterElement,host=holder.firstElementChild,trigger=host.querySelector('[data-menu-control]'),popup=host.querySelector('.pp-menu-popup');assert.equal(select.hidden,true);assert.equal(select.getAttribute('aria-hidden'),'true');assert.equal(label.htmlFor,trigger.id);assert.ok(host.classList.contains('pp-menu-dark'));trigger.click();trigger.dispatch('keydown',{key:'ArrowDown'});trigger.dispatch('keydown',{key:'Enter'});assert.equal(select.value,'Beta');assert.equal(changed,1);select.value='Alpha';form.dispatch('reset');for(const fn of timers.values())fn();timers.clear();assert.equal(trigger.dataset.value,'Alpha');select.disabled=true;F.syncSelects(root);assert.equal(trigger.disabled,true);cleanup();assert.equal(select.hidden,false);assert.equal(select.getAttribute('aria-hidden'),null);assert.equal(label.htmlFor,'team');assert.equal(holder.removed,true);
});
test('combobox variants compose system chips, icons, clear actions and labelled groups',()=>{
 let rendered=0;
 for(const variant of ['single','multiple'])for(const optionStyle of ['plain','icons','grouped'])for(const size of ['sm','md','lg'])for(const disabled of [false,true]){
  const config={variant,optionStyle,size,disabled,icon:'leading',showClear:true},html=F.combobox(config);assert.match(html,/pp-combobox-leading/);assert.match(html,/data-menu-clear/);if(variant==='multiple'){assert.match(html,/aria-multiselectable="true"/);assert.match(html,/data-combobox-chips/);assert.equal((html.match(/data-chip-remove/g)||[]).length,2);assert.match(html,/data-chip-value="React"/);assert.match(html,/data-chip-value="Svelte"/);if(optionStyle==='icons')assert.match(html,/pp-chip-icon/);}else assert.doesNotMatch(html,/data-chip-remove|aria-multiselectable/);
  if(optionStyle==='grouped'){assert.equal((html.match(/data-menu-group/g)||[]).length,2);assert.match(html,/role="group" aria-labelledby=/);}if(optionStyle==='icons')assert.match(html,/data-icon="code"/);
  if(disabled)assert.match(html,/data-menu-clear[^>]+disabled/);for(const token of F.menuTokens('combobox',config)){assert.ok(F.tokens[token],token);F.resolve(token);}rendered++;
 }
 assert.equal(rendered,36);assert.match(F.combobox({showClear:true}),/data-menu-clear[^>]+ hidden/);assert.doesNotMatch(F.combobox({showClear:false}),/data-menu-clear/);
});
test('multiple selections toggle independently while the popup stays open',()=>{
 const ui=multipleUI();let changes=0;ui.trigger.addEventListener('change',()=>changes++);const cleanup=F.wireMenus(ui.root);ui.trigger.dispatch('focus');ui.trigger.dispatch('keydown',{key:'Enter'});assert.deepEqual(JSON.parse(ui.trigger.dataset.values),['Gamma']);assert.equal(ui.options[0].getAttribute('aria-selected'),'false');assert.equal(ui.options[2].getAttribute('aria-selected'),'true');assert.equal(ui.popup.hidden,false);ui.popup.dispatch('click',{target:ui.options[1]});assert.deepEqual(JSON.parse(ui.trigger.dataset.values),['Gamma','Beta']);assert.equal(ui.options[1].getAttribute('aria-selected'),'true');assert.match(ui.chips.innerHTML,/data-chip-value="Beta"/);assert.equal(ui.trigger.value,'');assert.equal(ui.popup.hidden,false);assert.equal(changes,2);cleanup();
});
test('multiple Backspace and chip removal sync selection and return focus to input',()=>{
 const ui=multipleUI();const cleanup=F.wireMenus(ui.root);ui.trigger.dispatch('keydown',{key:'Backspace'});assert.deepEqual(JSON.parse(ui.trigger.dataset.values),['Alpha']);assert.equal(ui.options[2].getAttribute('aria-selected'),'false');const remove=new Element({'data-chip-remove':''});remove.dataset.chipValue='Alpha';ui.host.append(remove);ui.host.dispatch('click',{target:remove});assert.deepEqual(JSON.parse(ui.trigger.dataset.values),[]);assert.equal(ui.options[0].getAttribute('aria-selected'),'false');assert.equal(document.activeElement,ui.trigger);assert.equal(ui.clear.hidden,true);cleanup();
});
test('clear actions preserve disabled guards and reset restores initial multiple choices',()=>{
 const ui=multipleUI(),form=new Element();ui.trigger.form=form;const cleanup=F.wireMenus(ui.root);ui.trigger.disabled=true;ui.host.dispatch('click',{target:ui.clear});assert.deepEqual(JSON.parse(ui.trigger.dataset.values),['Alpha','Gamma']);ui.trigger.disabled=false;ui.host.dispatch('click',{target:ui.clear});assert.deepEqual(JSON.parse(ui.trigger.dataset.values),[]);assert.equal(ui.clear.hidden,true);assert.equal(ui.popup.hidden,false);form.dispatch('reset');for(const fn of timers.values())fn();timers.clear();assert.deepEqual(JSON.parse(ui.trigger.dataset.values),['Alpha','Gamma']);assert.equal(ui.clear.hidden,false);assert.equal(ui.popup.hidden,true);cleanup();
 const single=build('combobox'),clear=new Element({'data-menu-clear':''});single.host.append(clear);single.host.queries['[data-menu-clear]']=clear;const dispose=F.wireMenus(single.root);single.host.dispatch('click',{target:clear});assert.equal(single.trigger.value,'');assert.equal(single.trigger.dataset.value,'');assert.equal(single.options[0].getAttribute('aria-selected'),'false');assert.equal(clear.hidden,true);dispose();
});
test('group headings disappear when all their options are filtered out',()=>{
 const ui=build('combobox'),one=new Element(),two=new Element();one.queries['[data-option]']=[ui.options[0],ui.options[1]];two.queries['[data-option]']=[ui.options[2]];ui.popup.queries['[data-menu-group]']=[one,two];const cleanup=F.wireMenus(ui.root);ui.trigger.value='gam';ui.trigger.dispatch('input');assert.equal(one.hidden,true);assert.equal(two.hidden,false);ui.trigger.value='zzz';ui.trigger.dispatch('input');assert.equal(one.hidden,true);assert.equal(two.hidden,true);assert.equal(ui.empty.hidden,false);ui.trigger.dispatch('focus');assert.equal(one.hidden,false);assert.equal(two.hidden,false);cleanup();
});
assert.equal(F.menuNext(['a','b'],null,'ArrowUp'),'b');assert.equal(F.menuNext([],null,'ArrowDown'),null);
console.log(JSON.stringify({checks,placement:'viewport collision + portal fallback',interaction:'keyboard, selection, filtering, disabled, native form sync and cleanup'}));
