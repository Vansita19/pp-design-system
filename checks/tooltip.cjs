/* Tooltip handlers exercised with simulated events/time; no browser/server. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const animations=[],observers=[];let now=0,next=0;const timers=new Map();
class Node{
 constructor(attrs={}){this.attrs=attrs;this.events={};this.children=[];this.queries={};this.hidden=false;this.ownerDocument=doc;this.classList={contains:className=>(this.attrs.class||'').split(' ').includes(className)};}
 addEventListener(type,fn){(this.events[type]??=[]).push(fn);}removeEventListener(type,fn){this.events[type]=(this.events[type]||[]).filter(other=>other!==fn);}
 fire(type,props={}){const event={type,target:this,preventDefault(){this.defaultPrevented=true;},...props};for(const fn of [...(this.events[type]||[])])fn(event);return event;}
 querySelector(selector){return this.queries[selector]||null;}querySelectorAll(selector){const found=this.queries[selector];return found?[found]:[];}
 closest(selector){return selector==='.preview-paused'&&this.paused?this:this.parentElement?.closest(selector)||null;}
 animate(frames,options){const a={frames,options,onfinish:null,cancelled:false,cancel(){this.cancelled=true;},finish(){this.onfinish?.();}};animations.push(a);return a;}
}
let doc={};const win=new Node();doc=new Node();doc.body=new Node();doc.defaultView=win;doc.getElementById=()=>({});doc.head={append(){}};doc.createElement=()=>({});
win.setTimeout=(fn,delay)=>{const id=++next;timers.set(id,{fn,at:now+delay});return id;};win.clearTimeout=id=>timers.delete(id);
function advance(ms){const end=now+ms;for(;;){const hit=[...timers].filter(([,job])=>job.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!hit)break;const [id,job]=hit;now=job.at;timers.delete(id);job.fn();}now=end;}
const media=new Node();media.matches=false;win.matchMedia=()=>media;win.MutationObserver=class{constructor(fn){this.fn=fn;observers.push(this);}observe(){}disconnect(){this.disconnected=true;}};
const context={window:win,document:doc};vm.createContext(context);const dist=path.join(__dirname,'../dist');for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','spinner.js','previews.js','feedback.js','tooltip.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});const F=win.Forma;
function fixture(bottom=false){const root=new Node(),host=new Node({class:bottom?'bottom':'top'}),trigger=new Node(),tip=new Node();host.ownerDocument=doc;host.parentElement=root;root.parentElement=doc.body;tip.hidden=true;root.queries['[data-tooltip-host]']=host;host.queries={'[data-tooltip-trigger]':trigger,'[data-tooltip-content]':tip};let cleanup;F.wireTooltip(root,fn=>cleanup=fn);return {root,host,trigger,tip,cleanup};}
for(const position of ['top','bottom']){const html=F.tooltip({position,content:'Copy <this>'});assert.match(html,/role="tooltip"/);assert.match(html,/type="button"/);assert.match(html,/Copy &lt;this&gt;/);const id=html.match(/aria-describedby="([^"]+)"/)[1];assert.ok(html.includes('id="'+id+'"'));for(const token of F.tooltipTokens())assert.ok(F.tokens[token],token);}
{
 const ui=fixture();ui.host.fire('pointerenter');advance(299);assert.equal(ui.tip.hidden,true);advance(1);assert.equal(ui.tip.hidden,false);assert.equal(animations.at(-1).frames[0].transform,'translate(-50%, 4px) scale(.95)');animations.at(-1).finish();
 ui.host.fire('pointerleave');advance(50);ui.tip.fire('pointerenter');advance(200);assert.equal(ui.tip.hidden,false,'Pointer can cross gap into tooltip');ui.tip.fire('pointerleave');advance(100);const exiting=animations.at(-1);assert.equal(ui.tip.hidden,false,'Exit remains visible through animation');exiting.finish();assert.equal(ui.tip.hidden,true);
 ui.trigger.fire('focus');assert.equal(ui.tip.hidden,false,'Keyboard focus opens immediately');animations.at(-1).finish();ui.trigger.fire('blur');advance(100);const closing=animations.at(-1),stale=closing.onfinish;ui.trigger.fire('focus');assert.equal(closing.cancelled,true);stale();assert.equal(ui.tip.hidden,false,'Stale exit cannot hide reopened tooltip');animations.at(-1).finish();
 const escape=doc.fire('keydown',{key:'Escape'});assert.equal(escape.defaultPrevented,true);animations.at(-1).finish();assert.equal(ui.tip.hidden,true);ui.host.fire('pointerenter');advance(500);assert.equal(ui.tip.hidden,true,'Escape suppresses reopening while focused');ui.host.fire('pointerleave');ui.trigger.fire('blur');ui.trigger.fire('focus');assert.equal(ui.tip.hidden,false,'New focus interaction may reopen');
 media.matches=true;media.fire('change');assert.equal(animations.at(-1).cancelled,true);const count=animations.length;ui.trigger.fire('blur');advance(100);assert.equal(ui.tip.hidden,true);ui.trigger.fire('focus');assert.equal(ui.tip.hidden,false);assert.equal(animations.length,count);media.matches=false;
 ui.trigger.fire('blur');advance(100);ui.root.paused=true;observers.forEach(observer=>{if(!observer.disconnected)observer.fn();});assert.equal(ui.tip.hidden,true,'Live pause settles exit');ui.root.paused=false;
 ui.host.fire('pointerenter');assert.equal(timers.size,1);ui.cleanup();assert.equal(timers.size,0);advance(1000);assert.equal(ui.tip.hidden,true);assert.ok(observers.every(o=>o.disconnected));for(const node of [ui.host,ui.tip,ui.trigger,doc])assert.ok(Object.values(node.events).every(list=>list.length===0));
}
{
 const ui=fixture(true);ui.trigger.fire('focus');const a=animations.at(-1);assert.equal(a.frames[0].transform,'translate(-50%, -4px) scale(.95)');const stale=a.onfinish;ui.cleanup();assert.equal(a.cancelled,true);stale();assert.equal(ui.tip.hidden,true);
}
{
 const ui=fixture();ui.host.fire('pointerenter');advance(100);ui.host.fire('pointerleave');assert.equal(timers.size,0,'Leaving before delay cancels opening');advance(1000);assert.equal(ui.tip.hidden,true);ui.cleanup();
}
console.log(JSON.stringify({tooltip:'delayed hover, immediate focus, hover persistence, exit/reversal, Escape, reduced motion, live pause, timer/animation/listener cleanup',status:'passed',scope:'simulated DOM and animation; browser appearance unverified'}));
