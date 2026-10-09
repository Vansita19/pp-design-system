/* Deterministic feedback interaction checks. Simulated DOM; no browser or server. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist');
const bootDoc={createElement:()=>({}),getElementById:()=>({}),head:{append(){}}};
const context={window:{},document:bootDoc,Intl};vm.createContext(context);
for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','spinner.js','catalogue.js','previews.js','feedback.js','ai-response.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const F=context.window.Forma;

// Time advances explicitly, including delayed removals; no real timer can leak.
class TimerView{
 constructor(){this.now=0;this.next=0;this.jobs=new Map();}
 setInterval(fn,delay){return this.add(fn,delay,true);}
 setTimeout(fn,delay){return this.add(fn,delay,false);}
 add(fn,delay,repeat){const id=++this.next;this.jobs.set(id,{fn,delay,repeat,at:this.now+delay});return id;}
 clearInterval(id){this.jobs.delete(id);}
 clearTimeout(id){this.jobs.delete(id);}
 advance(ms){const end=this.now+ms;for(;;){const next=[...this.jobs].filter(([,job])=>job.at<=end).sort((a,b)=>a[1].at-b[1].at||a[0]-b[0])[0];if(!next)break;const [id,job]=next;this.now=job.at;if(job.repeat)job.at+=job.delay;else this.jobs.delete(id);job.fn();}this.now=end;}
}
class Node{
 constructor(doc,tag='div',attrs={}){
  this.ownerDocument=doc;this.tagName=tag.toUpperCase();this.attrs={...attrs};this.children=[];this.parentNode=null;this.events={};this.textContent='';this.hidden=Object.hasOwn(attrs,'hidden');this.dataset={};
  for(const [key,value]of Object.entries(attrs))if(key.startsWith('data-'))this.dataset[key.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=value;
  const classes=new Set((attrs.class||'').split(/\s+/).filter(Boolean));this.classList={contains:c=>classes.has(c),add:c=>classes.add(c),remove:c=>classes.delete(c)};
  this.style={setProperty:(key,value)=>this.style[key]=value};
 }
 append(node){node.parentNode=this;this.children.push(node);return node;}
 remove(){if(this.parentNode){this.parentNode.children=this.parentNode.children.filter(n=>n!==this);this.parentNode=null;}if(this.contains(this.ownerDocument.activeElement))this.ownerDocument.activeElement=null;}
 get firstElementChild(){return this.children[0]||null;}
 get lastElementChild(){return this.children.at(-1)||null;}
 hasAttribute(key){return Object.hasOwn(this.attrs,key);}
 matches(selector){return selector.split(',').some(part=>{part=part.trim();if(part.startsWith('.'))return this.classList.contains(part.slice(1));const m=part.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);return m?this.hasAttribute(m[1])&&(m[2]===undefined||this.attrs[m[1]]===m[2]):this.tagName.toLowerCase()===part;});}
 closest(selector){for(let node=this;node;node=node.parentNode)if(node.matches(selector))return node;return null;}
 querySelectorAll(selector){return this.children.flatMap(node=>[...(node.matches(selector)?[node]:[]),...node.querySelectorAll(selector)]);}
 querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
 contains(node){return this===node||this.children.some(child=>child.contains(node));}
 focus(){this.ownerDocument.activeElement=this;}
 addEventListener(type,fn){(this.events[type]??=[]).push(fn);}
 removeEventListener(type,fn){this.events[type]=(this.events[type]||[]).filter(other=>other!==fn);}
 fire(type,extra={}){const chain=[];for(let node=this;node;node=node.parentNode)chain.push(node);const event={type,target:this,preventDefault(){this.defaultPrevented=true;},stopPropagation(){this.stopped=true;},...extra};for(const node of chain){for(const fn of [...(node.events[type]||[])])fn(event);if(event.stopped||type==='pointerenter'||type==='pointerleave')break;}return event;}
 set innerHTML(html){for(const node of [...this.children])node.remove();for(const node of parse(html,this.ownerDocument))this.append(node);this.html=html;}
 get innerHTML(){return this.html||'';}
 insertAdjacentHTML(where,html){assert.equal(where,'afterbegin');const nodes=parse(html,this.ownerDocument);nodes.forEach(node=>node.parentNode=this);this.children.unshift(...nodes);}
}
// Parse real generated markup instead of constructing component-specific query maps.
function parse(html,doc){
 const root=new Node(doc),stack=[root];
 for(const token of html.match(/<[^>]+>|[^<]+/g)||[]){
  if(token.startsWith('</')){stack.pop();continue;}
  if(token.startsWith('<')){const tag=token.match(/^<([\w-]+)/)?.[1];if(!tag)continue;const attrs={};for(const match of token.slice(tag.length+1,-1).matchAll(/([^\s=/>]+)(?:="([^"]*)"|='([^']*)')?/g))attrs[match[1]]=match[2]??match[3]??'';const node=stack.at(-1).append(new Node(doc,tag,attrs));if(!/\/$/.test(token.slice(0,-1))&&!['input','img','br','hr','meta','link'].includes(tag))stack.push(node);
  }else stack.at(-1).textContent+=token;
 }
 return root.children;
}
function fixture(html){const view=new TimerView(),doc={defaultView:view,hidden:false,activeElement:null},root=new Node(doc);root.innerHTML=html;return {root,doc,view};}
const listeners=node=>Object.values(node.events).reduce((sum,list)=>sum+list.length,0);

// Pure countdown: pausing preserves elapsed time, expiry clamps, reset restarts.
const clock=F.createUndoClock();assert.equal(clock.remaining,6000);assert.equal(clock.progress,1);
assert.equal(clock.tick(2000),4000);assert.equal(clock.tick(9000,true),4000);assert.equal(clock.tick(-10),4000);
assert.equal(clock.tick(9000),0);assert.equal(clock.progress,0);clock.reset();assert.equal(clock.remaining,6000);
assert.equal(F.createUndoClock(5).remaining,1000);

// Mounted undo: each independent pause reason must preserve the countdown.
{
 const {root,doc,view}=fixture(F.undoPill({hidden:true})),pill=root.querySelector('[data-undo-pill]'),button=pill.querySelector('[data-pill-undo]'),digit=pill.querySelector('[data-undo-seconds]');let undone=0,expired=0;
 const mount=F.mountUndoPill(pill,{onUndo:()=>undone++,onExpire:()=>expired++});mount.start('One row removed');
 assert.equal(pill.hidden,false);assert.equal(pill.querySelector('[data-undo-label]').textContent,'One row removed');view.advance(1000);assert.equal(digit.textContent,'5');
 pill.fire('pointerenter');view.advance(7000);assert.equal(digit.textContent,'5');pill.fire('pointerleave');
 button.focus();view.advance(7000);assert.equal(digit.textContent,'5');doc.activeElement=null;
 F.paused=true;view.advance(7000);assert.equal(digit.textContent,'5');F.paused=false;
 doc.hidden=true;view.advance(7000);assert.equal(digit.textContent,'5');doc.hidden=false;
 root.classList.add('preview-paused');view.advance(7000);assert.equal(digit.textContent,'5');root.classList.remove('preview-paused');
 view.advance(5000);assert.equal(expired,1);assert.equal(pill.hidden,true);view.advance(1000);assert.equal(expired,1,'Expiry fires once');
 mount.start();assert.equal(digit.textContent,'6');button.fire('click');assert.equal(undone,1);assert.equal(pill.hidden,true);view.advance(7000);assert.equal(expired,1);
 mount.start();const escape=button.fire('keydown',{key:'Escape'});assert.equal(escape.defaultPrevented,true);assert.equal(undone,2);
 mount.start();mount.stop();view.advance(7000);assert.equal(expired,1);assert.equal(pill.hidden,true);
 mount.start();mount.dispose();assert.equal(view.jobs.size,0);assert.equal(listeners(pill),0);button.fire('click');view.advance(7000);assert.equal(undone,2);assert.equal(expired,1);
}

// Delete/Undo uses actual generated buttons and preserves the custom label.
{
 const {root,doc,view}=fixture(F.actionBarDemo({label:'Selected companies'}));let cleanup;F.wireActionFeedback(root,fn=>cleanup=fn);
 root.querySelector('[data-action-delete]').focus();root.querySelector('[data-action-delete]').fire('click');
 const undo=root.querySelector('[data-pill-undo]');assert.equal(doc.activeElement,undo,'Delete moves keyboard focus to Undo');view.advance(7000);assert.equal(root.querySelector('[data-undo-pill]').hidden,false,'Focused Undo does not expire');
 undo.fire('click');assert.equal(doc.activeElement,root.querySelector('[data-action-delete]'),'Undo restores focus to Delete');assert.match(root.querySelector('[data-action-stage]').innerHTML,/Selected companies/);assert.equal(view.jobs.size,0,'Restoring selection disposes its clock');
 root.querySelector('[data-action-clear]').fire('click');assert.equal(doc.activeElement,root.querySelector('[data-action-select]'));root.querySelector('[data-action-select]').fire('click');assert.match(root.querySelector('[data-action-stage]').innerHTML,/Selected companies/);
 root.querySelector('[data-action-delete]').fire('click');const host=root.querySelector('[data-action-demo]');cleanup();assert.equal(listeners(host),0);assert.equal(view.jobs.size,0);
}

// The native wrapper delegates to the installed React island and owns cleanup.
{
 const {root}=fixture(F.toastStack({count:3,label:'Saved'}));let mounts=0,disposed=0,cleanup;
 F.mountSpectrumToast=host=>{mounts++;assert.equal(host.dataset.count,'3');assert.ok(host.querySelector('[data-spectrum-toast-root]'));return()=>disposed++;};
 F.wireActionFeedback(root,fn=>cleanup=fn);assert.equal(mounts,1);cleanup();assert.equal(disposed,1);delete F.mountSpectrumToast;
}

// Activity model pauses at a boundary and holds Complete before its next loop.
const sequence=F.createActivitySequence();assert.equal(sequence.tick(0),0);assert.equal(sequence.tick(1499),0);assert.equal(sequence.tick(10000,true),0);assert.equal(sequence.tick(1),1);assert.equal(sequence.tick(1500),2);assert.equal(sequence.tick(1500),3);assert.equal(sequence.tick(2999),3);assert.equal(sequence.tick(1),0);
console.log(JSON.stringify({undo:'clock, all pause reasons, expiry, reset, undo, Escape and disposal',actionDemo:'Delete/Undo focus and custom label',toast:'installed island mount and disposal (runtime behavior in spectrum-toast.cjs)',sequence:'progression, pause and loop',status:'passed',scope:'simulated DOM and timers; no browser validation'}));

// Dark-surface action buttons must not inherit the light ghost hover/foreground.
for(const state of ['default','hover','pressed']){
 const tokens=F.buttonTokens({variant:'ghost',surface:'inverse',size:'sm',state});
 assert.equal(F.resolve(tokens.fg),'#FFFFFF');
 assert.equal(F.resolve(tokens.hover),'#ffffff1a');
 if(state==='hover')assert.equal(F.resolve(tokens.bg),'#ffffff1a');
}
assert.match(F.actionPill(),/--demo-button-fg:var\(--pp-component-button-inverse-foreground\)/);
assert.match(F.undoPill(),/--demo-button-hover:var\(--pp-component-button-inverse-hover\)/);

// Source rounded Undo and composed action buttons feed the shared radius variable.
for(const [markup,count]of [[F.actionPill(),2],[F.undoPill(),1],[F.actionPill({actions:F.button({variant:'secondary',size:'sm'},'Add to list')+F.button({variant:'destructive',size:'sm',icon:'only',iconName:'trash'},'Delete')}),2]]){
 assert.equal((markup.match(/--demo-button-radius:var\(--pp-radius-full\)/g)||[]).length,count);
 assert.doesNotMatch(markup,/--demo-button-radius:var\(--pp-component-control-radius\)/);
}
assert.match(F.button({variant:'secondary',size:'sm'},'Outside pill'),/--demo-button-radius:var\(--pp-component-control-radius\)/);
assert.ok(F.actionFeedbackTokens().includes('radius.full'));
const pillCSS=fs.readFileSync(path.join(dist,'feedback.css'),'utf8');
assert.equal(pillCSS.match(/\.pp-action-pill \.pp-button\{([^}]+)\}/)?.[1],'flex-shrink:0');
