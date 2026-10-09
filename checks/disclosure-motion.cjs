/* Real motion handlers with deterministic layout/animation fakes; no browser/server. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const animations=[],observers=[];
class Node{
 constructor(tag='div',attrs={}){this.tag=tag;this.attrs={...attrs};this.children=[];this.events={};this.style={};this.open=false;this.inert=false;this.ownerDocument=doc;this.rect={left:0,top:0,width:100,height:32};const classes=new Set((attrs.class||'').split(' '));this.classList={contains:c=>classes.has(c),add:c=>classes.add(c),remove:c=>classes.delete(c)};}
 append(node){this.children.push(node);node.parentElement=this;return node;}
 remove(){this.parentElement.children=this.parentElement.children.filter(node=>node!==this);this.parentElement=null;}
 setAttribute(key,value){this.attrs[key]=String(value);}getAttribute(key){return this.attrs[key]??null;}hasAttribute(key){return Object.hasOwn(this.attrs,key);}removeAttribute(key){delete this.attrs[key];}
 matches(selector){if(selector.startsWith('.'))return this.classList.contains(selector.slice(1));if(selector.startsWith('#'))return this.getAttribute('id')===selector.slice(1);const m=selector.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);return m?this.hasAttribute(m[1])&&(m[2]===undefined||this.attrs[m[1]]===m[2]):selector===this.tag;}
 querySelectorAll(selector){return this.children.flatMap(node=>[...(node.matches(selector)?[node]:[]),...node.querySelectorAll(selector)]);}querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
 closest(selector){return this.matches(selector)?this:this.parentElement?.closest(selector)||null;}contains(node){return this===node||this.children.some(child=>child.contains(node));}
 addEventListener(type,fn){(this.events[type]??=[]).push(fn);}removeEventListener(type,fn){this.events[type]=(this.events[type]||[]).filter(other=>other!==fn);}
 fire(type,props={}){const event={type,target:this,defaultPrevented:false,preventDefault(){this.defaultPrevented=true;},...props};for(const fn of [...(this.events[type]||[])])fn(event);return event;}
 focus(){doc.activeElement=this;}
 getBoundingClientRect(){if(this.tag==='details')return {...this.rect,height:this.visualHeight??(this.open?this.fullHeight:40)};if(this.className==='pp-pitch-tab-surface'){const [left,top]=(this.style.transform||'translate(0px, 0px)').match(/-?[\d.]+/g).map(Number);return {left,top,width:parseFloat(this.style.width)||0,height:parseFloat(this.style.height)||0};}return this.rect;}
 animate(frames,options){const node=this,animation={node,frames,options,cancelled:false,onfinish:null,cancel(){this.cancelled=true;delete node.visualHeight;},finish(){this.onfinish?.();}};animations.push(animation);return animation;}
}
let doc={};const win=new Node('window');doc=new Node('document');doc.defaultView=win;doc.body=new Node('body');doc.append(doc.body);doc.createElement=tag=>new Node(tag);doc.head={append(){}};doc.getElementById=()=>({});
const media=new Node('media');media.matches=false;win.matchMedia=()=>media;
class Observer{constructor(fn){this.fn=fn;this.disconnected=false;observers.push(this);}observe(){}disconnect(){this.disconnected=true;}fire(){if(!this.disconnected)this.fn();}}
win.MutationObserver=Observer;win.ResizeObserver=Observer;
const context={window:win,document:doc};vm.createContext(context);const dist=path.join(__dirname,'../dist');
for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','spinner.js','pitch-patterns.js','previews.js','feedback.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});const F=win.Forma;
const changes=()=>observers.forEach(observer=>observer.fire());
function accordion(multiple=false){const root=doc.body.append(new Node()),group=root.append(new Node('div',{'data-feedback-accordion':'','data-multiple':String(multiple)})),items=[];for(let n=0;n<3;n++){const item=group.append(new Node('details',{name:'group','data-feedback-group':n===2?'other':'same'}));item.fullHeight=180+n*30;const summary=item.append(new Node('summary')),content=item.append(new Node('div',{class:'pp-accordion-content'}));items.push({item,summary,content});}let cleanup;F.wireFeedback(root,fn=>cleanup=fn);return {root,group,items,cleanup};}
{
 const ui=accordion(),[first,second,third]=ui.items;
 assert.equal(first.item.getAttribute('name'),null,'Native group is scoped by controller during animation');
 assert.equal(first.summary.fire('click').defaultPrevented,true);let opening=animations.at(-1);assert.deepEqual(JSON.parse(JSON.stringify(opening.frames)),[{height:'40px'},{height:'180px'}]);assert.equal(opening.options.duration,200);assert.equal(first.item.open,true);opening.finish();assert.equal(first.item.style.overflow,undefined);
 first.content.focus();first.summary.fire('click');let closing=animations.at(-1);assert.deepEqual(JSON.parse(JSON.stringify(closing.frames)),[{height:'180px'},{height:'40px'}]);assert.equal(first.item.open,true,'Content remains laid out while closing');assert.equal(first.content.inert,true);assert.equal(doc.activeElement,first.summary);closing.finish();assert.equal(first.item.open,false);assert.equal(first.content.inert,false);
 // Reversal begins at the current rendered height and stale completions do nothing.
 first.summary.fire('click');opening=animations.at(-1);const stale=opening.onfinish;first.item.visualHeight=95;first.summary.fire('click');closing=animations.at(-1);assert.equal(opening.cancelled,true);assert.equal(closing.frames[0].height,'95px');stale();assert.equal(first.item.open,true);closing.finish();assert.equal(first.item.open,false);
 first.summary.fire('click');animations.at(-1).finish();third.summary.fire('click');animations.at(-1).finish();second.summary.fire('click');assert.equal(first.summary.getAttribute('aria-expanded'),'false','Same group closes');assert.equal(third.item.open,true,'Other setup groups stay open');animations.filter(a=>!a.cancelled).forEach(a=>a.finish());assert.equal(first.item.open,false);assert.equal(second.item.open,true);
 second.summary.setAttribute('aria-disabled','true');const count=animations.length;assert.equal(second.summary.fire('click').defaultPrevented,true);assert.equal(animations.length,count);
 first.summary.fire('click');const running=animations.at(-1);media.matches=true;media.fire('change');assert.equal(running.cancelled,true);assert.equal(first.item.open,true);const reducedCount=animations.length;first.summary.fire('click');assert.equal(first.item.open,false);assert.equal(animations.length,reducedCount);media.matches=false;
 first.summary.fire('click');ui.root.classList.add('preview-paused');changes();assert.equal(animations.at(-1).cancelled,true);assert.equal(first.item.open,true);ui.root.classList.remove('preview-paused');
 first.summary.fire('click');F.paused=true;doc.body.classList.add('motion-paused');changes();assert.equal(first.item.open,false);assert.equal(animations.at(-1).cancelled,true);F.paused=false;doc.body.classList.remove('motion-paused');
 first.summary.fire('click');const abandoned=animations.at(-1).onfinish;ui.cleanup();abandoned();assert.equal(first.item.open,true);assert.equal(first.item.getAttribute('name'),'group');assert.equal(first.summary.getAttribute('aria-expanded'),null);assert.equal(first.item.style.overflow,undefined);assert.equal(first.summary.events.click.length,0);assert.ok(observers.every(o=>o.disconnected));
}
{
 const ui=accordion(true);ui.items[0].summary.fire('click');animations.at(-1).finish();ui.items[1].summary.fire('click');animations.at(-1).finish();assert.equal(ui.items[0].item.open,true);assert.equal(ui.items[1].item.open,true);ui.cleanup();
}
// Programmatic native changes settle immediately and cannot be undone by stale completion.
{
 const ui=accordion(),first=ui.items[0];first.summary.fire('click');const animation=animations.at(-1),stale=animation.onfinish;first.item.open=false;first.item.fire('toggle');stale();assert.equal(first.item.open,false);assert.equal(animation.cancelled,true);ui.cleanup();
}
function tabs(){const root=doc.body.append(new Node()),wrap=root.append(new Node('div',{class:'pp-pitch-tabs-wrap'})),list=wrap.append(new Node('div',{role:'tablist',class:'pp-tabs pp-pitch-segmented'})),buttons=[],panels=[];for(let n=0;n<3;n++){const tab=list.append(new Node('button',{role:'tab','aria-selected':String(n===0),'aria-controls':'panel-'+n}));tab.rect={left:n*80,top:0,width:80+n*10,height:32};buttons.push(tab);panels.push(wrap.append(new Node('div',{id:'panel-'+n,role:'tabpanel'})));}let cleanup;F.wirePitchTabs(root,fn=>cleanup=fn);return {root,wrap,list,buttons,panels,cleanup};}
{
 const before=animations.length,ui=tabs(),[first,second,third]=ui.buttons;assert.equal(animations.length,before,'Mount does not animate');const surface=ui.list.children.at(-1);assert.equal(surface.style.width,'80px');second.fire('click');let animation=animations.at(-1);assert.equal(animation.options.duration,300);assert.equal(animation.options.easing,'cubic-bezier(.65, 0, .35, 1)');assert.equal(surface.style.width,'90px');assert.equal(surface.style.transform,'translate(80px, 0px)');assert.equal(ui.panels[0].hidden,true);assert.equal(ui.panels[1].hidden,false);assert.equal(first.tabIndex,-1);assert.equal(second.tabIndex,0);
 const stale=animation.onfinish;third.fire('click');assert.equal(animation.cancelled,true);stale();assert.equal(surface.style.width,'100px');third.fire('keydown',{key:'Home'});assert.equal(doc.activeElement,first);assert.equal(first.getAttribute('aria-selected'),'true');
 second.disabled=true;first.fire('keydown',{key:'ArrowRight'});assert.equal(doc.activeElement,third,'Keyboard skips disabled tabs');third.fire('keydown',{key:'ArrowRight'});assert.equal(doc.activeElement,first,'Keyboard wraps');
 media.matches=true;media.fire('change');assert.equal(animations.at(-1).cancelled,true);const count=animations.length;third.fire('click');assert.equal(animations.length,count);assert.equal(surface.style.width,'100px');media.matches=false;
 first.fire('click');doc.body.classList.add('motion-paused');changes();assert.equal(animations.at(-1).cancelled,true);doc.body.classList.remove('motion-paused');
 first.rect.width=115;win.fire('resize');assert.equal(surface.style.width,'115px','Resize remeasures the selected surface');third.fire('click');const running=animations.at(-1);ui.cleanup();assert.equal(running.cancelled,true);assert.equal(ui.list.children.length,3);assert.equal(ui.list.hasAttribute('data-sliding-tabs'),false);assert.ok(observers.every(o=>o.disconnected));assert.equal(first.events.click.length,0);assert.equal(win.events.resize.length,0);
}
console.log(JSON.stringify({accordion:'open/close measured height, reversal, stale completion, native state, groups, focus, disabled, live motion preference, cleanup',tabs:'moving/resizing selection, keyboard and panels, disabled, live motion preference, resize and cleanup',status:'passed',scope:'simulated DOM/layout/WAAPI; browser visuals unverified'}));
