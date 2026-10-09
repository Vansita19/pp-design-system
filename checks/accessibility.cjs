/* Targeted markup and event-contract regressions. This is not a browser or assistive-technology audit. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function environment() {
  const timers = new Map();
  const document = {activeElement:null, createElement:()=>({}), getElementById:()=>({}), head:{append(){}}, addEventListener(){}, removeEventListener(){}};
  class Element {
    constructor(attrs={}) { this.attrs={...attrs}; this.events={}; this.queries={}; this.dataset={}; this.value=''; this.textContent=''; this.hidden=false; this.disabled=false; this.checked=false; this.indeterminate=false; this.isConnected=true; const classes=new Set(); this.classList={add:k=>classes.add(k),remove:k=>classes.delete(k),contains:k=>classes.has(k),toggle:(k,on)=>{const use=on===undefined?!classes.has(k):on;use?classes.add(k):classes.delete(k);return use;}}; }
    setAttribute(k,v) { this.attrs[k]=String(v); }
    getAttribute(k) { return this.attrs[k]??null; }
    removeAttribute(k) { delete this.attrs[k]; }
    addEventListener(k,fn) { (this.events[k]??=[]).push(fn); }
    removeEventListener(k,fn) { this.events[k]=(this.events[k]||[]).filter(f=>f!==fn); }
    querySelector(k) { const v=this.queries[k]; return Array.isArray(v)?v[0]??null:v??null; }
    querySelectorAll(k) { const v=this.queries[k]; return v?Array.isArray(v)?v:[v]:[]; }
    dispatch(type,props={}) { const e={target:this,prevented:false,preventDefault(){this.prevented=true;},stopPropagation(){},...props}; (this.events[type]||[]).forEach(f=>f(e)); return e; }
    focus() { document.activeElement=this; }
    scrollIntoView() {}
    click() { if(!this.disabled)this.dispatch('click'); }
  }
  const media=new Element(); media.matches=false;
  const context={window:{},document,matchMedia:()=>media,setInterval:fn=>{const id=timers.size+1;timers.set(id,fn);return id;},clearInterval:id=>timers.delete(id)};
  vm.createContext(context);
  for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','avatar.js','spinner.js','chip.js','switch-motion.js','menus.js','pitch-patterns.js','feedback.js','layout-system.js','slider.js','prompt-bar.js','ai-response.js','detail-blocks.js','card-patterns.js','prompt-suggestions.js','catalogue.js','previews.js','command-menu.js','guided-popover.js','tooltip.js','file-upload.js','date-picker.js','source-shell.js','source-workspace.js','source-details.js','source-trace.js','source-chat.js','chat-bubble.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist',file),'utf8'),context,{filename:file});
  const F=context.window.Forma; F.notify=()=>{}; F.paused=false;
  return {F,Element,document,media,timers,tick:()=>[...timers.values()].forEach(fn=>fn()),render:(id,config={})=>F.preview(F.byId[id],{...F.defaults(F.byId[id]),...config})};
}
const cases=[]; const test=(name,run)=>cases.push({name,run});
const tag=(html,pattern)=>html.match(pattern)?.[0]||'';

test('buttons avoid accidental form submission and retain explicit form actions',()=>{
  const {F,render}=environment();
  assert.match(F.button({},'Continue'),/<button type="button"/);
  assert.equal((F.button({},'Save','type="submit"').match(/\btype=/g)||[]).length,1);
  assert.match(render('form-layout'),/type="reset"/);
  assert.match(render('form-layout'),/type="submit"/);
  assert.match(render('icon-button',{label:'Remove item'}),/aria-label="Remove item"/);
});
test('button family preserves old routes and appears once in search and navigation',()=>{
  const {F}=environment();
  for(const [id,section] of [['icon-button','icon-buttons'],['link','link-buttons'],['button-group','button-groups']]){
    assert.equal(F.pageRoute(id).join('/'),'button/'+section);
    assert.equal(F.pageHref(id),'#button/'+section);
    assert.ok(F.byId[id]);assert.ok(!F.visibleItems().some(item=>item.id===id));
  }
  for(const query of ['link','icon button','button group'])assert.ok(F.matchesSearch(F.byId.button,query));
  assert.ok(F.visibleItems().some(item=>item.id==='button'));
});
test('link variants are anchors and disabled links cannot activate',()=>{
  const {F,Element,render}=environment();
  assert.match(render('link'),/<a [^>]*href="#link"[^>]*data-demo-link/);
  assert.doesNotMatch(render('link'),/role="button"/);
  assert.match(render('link',{state:'disabled'}),/aria-disabled="true" tabindex="-1"/);
  const root=new Element(),link=new Element({'aria-disabled':'true'});root.queries={'[data-demo-link]':link};let notifications=0;F.notify=()=>notifications++;
  F.wirePreview(root,F.byId.link,{state:'disabled'});
  assert.equal(link.dispatch('click').prevented,true);assert.equal(notifications,0);
  link.setAttribute('aria-disabled','false');link.dispatch('click');assert.equal(notifications,1);
});
test('joined actions do not submit forms or pretend to be toggle selections',()=>{
  const {F,Element,render}=environment();
  for(const variant of ['actions','icons']){
    const html=render('button-group',{variant});
    const buttons=html.match(/<button\b[^>]*>/g);assert.equal(buttons.length,3);
    assert.ok(buttons.every(button=>button.includes('type="button"')));
    assert.doesNotMatch(html,/aria-pressed|data-group(?:\s|>)/);
  }
  const root=new Element(),buttons=Array.from({length:3},()=>new Element({'aria-pressed':'false'}));
  root.queries={'[data-group]':buttons};F.wirePreview(root,F.byId['button-group'],{variant:'selection'});
  buttons[2].click();assert.deepEqual(buttons.map(button=>button.getAttribute('aria-pressed')),['false','false','true']);
});
test('fields only describe helper text that exists, preserving readonly and invalid semantics',()=>{
  const {render}=environment();
  assert.doesNotMatch(render('field',{helper:'',state:'default'}),/aria-describedby/);
  const invalid=render('field',{state:'invalid'});
  const help=invalid.match(/aria-describedby="([^"]+)"/)[1];
  assert.ok(invalid.includes(`id="${help}"`));
  assert.match(invalid,/aria-invalid="true"/);
  assert.match(tag(render('input',{state:'readonly'}),/<input\b[^>]*>/),/\breadonly\b/);
  assert.doesNotMatch(tag(render('input',{state:'readonly'}),/<input\b[^>]*>/),/\bdisabled\b/);
});
test('styled selection controls retain native input semantics and decorative indicators',()=>{
  const {render}=environment();
  for(const id of ['checkbox','radio','multiselect','data-table']){
    const html=render(id,{selectable:true}),inputs=html.match(/<input\b[^>]*type="(?:checkbox|radio)"[^>]*>/g)||[];
    assert.ok(inputs.length,`${id}: missing native selection input`);
    for(const input of inputs)assert.match(input,/class="pp-selection-input/);
    assert.equal((html.match(/class="pp-choice-indicator" aria-hidden="true"/g)||[]).length,inputs.length);
  }
  assert.match(tag(render('checkbox',{disabled:true}),/<input\b[^>]*>/),/\bdisabled\b/);
  assert.match(tag(render('switch',{checked:true,disabled:true}),/<input\b[^>]*>/),/role="switch"[^>]*checked[^>]*disabled/);
});
test('radio instances form independent native groups with one selected value',()=>{
  const {render}=environment(),first=render('radio',{selected:'Standard'}),second=render('radio',{selected:'Plus',disabled:true});
  const inputs=html=>html.match(/<input\b[^>]*>/g),names=html=>inputs(html).map(s=>s.match(/name="([^"]+)"/)[1]);
  assert.equal(new Set(names(first)).size,1);assert.equal(new Set(names(second)).size,1);
  assert.notEqual(names(first)[0],names(second)[0]);
  assert.equal(inputs(first).filter(s=>/\bchecked\b/.test(s)).length,1);
  assert.match(inputs(first).find(s=>/\bchecked\b/.test(s)),/value="Standard"/);
  assert.ok(inputs(second).every(s=>/\bdisabled\b/.test(s)));
});
test('checkbox appearance reuses the Inbox control without replacing native behavior',()=>{
  const {F,render}=environment(),css=fs.readFileSync(path.join(__dirname,'../dist/components.css'),'utf8');
  for(const [id,value]of Object.entries({size:'16px',radius:'5px',indicator:'16px',markWidth:'7px',markHeight:'4px',markOffset:'4px',markStroke:'1.5px',mixedWidth:'8px',mixedThickness:'1.5px',shadow:'0 1px 1px #00000005'})){
    const token='component.checkbox.'+id;assert.equal(F.resolve(token),value,token);assert.ok(F.selectionTokens('checkbox').includes(token));
  }
  assert.equal(F.chain('component.checkbox.border').at(-1),'color.gray.300');
  assert.equal(F.chain('component.checkbox.selected').at(-1),'color.blue.600');
  assert.equal(F.chain('component.checkbox.foreground').at(-1),'color.gray.white');
  assert.match(css,/\.pp-checkmark svg\{display:none\}/,'The source tick must not overlap the older decorative icon');
  assert.match(css,/\.pp-checkmark:after\{[^}]*border-left:var\(--pp-component-checkbox-markStroke\) solid currentColor;[^}]*border-bottom:var\(--pp-component-checkbox-markStroke\) solid currentColor/);
  assert.match(css,/\.pp-theme \.pp-selection-input:focus-visible\{[^}]*box-shadow:var\(--selection-focus\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)\{[^}]*\.pp-checkmark[^}]*transition:none/);
  for(const disabled of [false,true]){
    const html=render('checkbox',{checked:true,disabled});assert.equal(/<input\b[^>]*\bdisabled\b/.test(html),disabled);assert.match(html,/<input\b[^>]*type="checkbox"[^>]*\bchecked\b/);
  }
});
test('indeterminate examples set the native mixed property and badges stay noninteractive',()=>{
  const {F,Element,render}=environment(),root=new Element(),mixed=new Element();
  root.queries={'[data-indeterminate]':mixed};F.wirePreview(root,F.byId.checkbox,{indeterminate:true});
  assert.equal(mixed.indeterminate,true);
  for(const indicator of ['none','dot','icon']){
    const html=render('badge',{indicator,label:'Status <test>'});
    assert.doesNotMatch(html,/<button|<a\b|tabindex|role="(?:button|status)"/);
    assert.match(html,/Status &lt;test&gt;/);
    if(indicator!=='none')assert.match(html,/aria-hidden="true"/);
  }
});
test('confirmation dialogs describe the action and initially focus Cancel',()=>{
  const {render}=environment(),html=render('alert-dialog');
  const description=html.match(/<dialog[^>]*aria-describedby="([^"]+)"/)?.[1];
  assert.ok(description,'Confirmation needs a programmatic description');
  assert.ok(html.includes(`id="${description}"`));
  assert.match(html,/<button[^>]*data-dialog-close[^>]*autofocus[^>]*>Cancel<\/button>/);
});
test('source composer disables unavailable actions while keeping pending input editable',()=>{
 const {render}=environment();
 const disabled=render('composer',{state:'disabled'}),pending=render('composer',{state:'pending'});
 assert.match(tag(disabled,/<div[^>]*data-prompt-input[^>]*>/),/contenteditable="false"[^>]*aria-disabled="true"[^>]*tabindex="-1"/);
 assert.match(tag(pending,/<div[^>]*data-prompt-input[^>]*>/),/contenteditable="true"[^>]*aria-disabled="false"/);
 assert.match(disabled,/<input[^>]*type="hidden"[^>]*name="prompt"[^>]*disabled/);
 assert.match(tag(pending,/<button[^>]*data-prompt-send[^>]*>/),/\bdisabled\b/);
});
test('toast stack has a pre-existing polite status region',()=>{
 const {render}=environment();assert.match(render('toast'),/<span[^>]*role="status"[^>]*data-stack-announcement[^>]*><\/span>/);
});
// Source composer keyboard, IME, pending and cleanup contracts live in checks/prompt-bar.cjs.
// Custom-menu keyboard, filtering and disabled contracts live in checks/menus.cjs.
test('table select-all tracks mixed selection and only acts on visible results',()=>{
  const {F,Element}=environment(),root=new Element(),table=new Element(),search=new Element(),all=new Element(),status=new Element();
  const rows=['Alpha','Beta','Gamma'].map(name=>{const row=new Element(),box=new Element();row.dataset.name=name;row.queries={'input':box,'input[type="checkbox"]':box};return row;});
  const boxes=rows.map(row=>row.querySelector('input'));table.tBodies=[{rows}];
  root.queries={'.pp-table':table,'.table-search':search,'[data-select-all]':all,'.pp-table-status':status,'tbody input':boxes,'tbody input[type="checkbox"]':boxes};
  F.wirePreview(root,F.byId['data-table'],{});
  boxes[0].checked=true;boxes[0].dispatch('change');assert.equal(all.indeterminate,true);assert.equal(all.checked,false);
  search.value='Beta';search.dispatch('input');assert.equal(all.indeterminate,false);assert.equal(all.checked,false);
  all.checked=true;all.dispatch('change');assert.equal(boxes[1].checked,true);assert.equal(boxes[2].checked,false);
  search.value='';search.dispatch('input');assert.equal(all.indeterminate,true);
  assert.match(status.textContent,/2 selected/);
  search.value='No match';search.dispatch('input');assert.equal(all.disabled,true);assert.equal(all.checked,false);assert.equal(all.indeterminate,false);
});
test('multiselect chips reflect checked values and removal updates and focuses the checkbox',()=>{
  const {F,Element,document,render}=environment(),root=new Element(),mult=new Element(),summary=new Element(),announcement=new Element();
  const choices=['Design','Research'].map(value=>{const input=new Element();input.value=value;return input;});choices[0].checked=true;
  root.queries={'.pp-multiselect':mult};mult.queries={'.pp-selection-summary':summary,'[data-selection-announcement]':announcement,'input[type="checkbox"]':choices};
  F.wirePreview(root,F.byId.multiselect,{});
  choices[1].checked=true;mult.dispatch('change');assert.match(summary.innerHTML,/data-chip-value="Research"/);assert.equal(announcement.textContent,'2 selected');
  const remove=new Element();remove.dataset.chipValue='Research';remove.closest=selector=>selector==='[data-chip-remove]'?remove:null;
  summary.dispatch('click',{target:remove});assert.equal(choices[1].checked,false);assert.doesNotMatch(summary.innerHTML,/data-chip-value="Research"/);assert.equal(document.activeElement,choices[1]);assert.equal(announcement.textContent,'Research removed');
  choices[1].checked=true;choices[1].disabled=true;summary.dispatch('click',{target:remove});assert.equal(choices[1].checked,true);
  const html=render('multiselect');assert.match(html,/value="Design"/);assert.match(html,/data-chip-remove/);
});
test('streaming text is available without character-by-character announcements',()=>{
  const {render}=environment(),html=render('streaming-text',{text:'Full response'});
  assert.match(html,/<span aria-hidden="true"><\/span>/);
  assert.match(html,/<span class="visually-hidden">Full response<\/span>/);
  assert.doesNotMatch(html,/aria-live/);
});
test('stream honors pause, resumes, reacts to reduced motion, and cleans timers/listeners',()=>{
  const {F,Element,media,timers,tick}=environment(),root=new Element(),stream=new Element(),span=new Element();
  stream.dataset.text='A complete response';stream.queries={'span':span};root.queries={'.pp-stream':stream};
  F.paused=true;F.wirePreview(root,F.byId['streaming-text'],{playing:true,speed:'1×'});const initial=span.textContent;tick();assert.equal(span.textContent,initial);
  F.paused=false;tick();assert.notEqual(span.textContent,initial,'Playing resumes the preview');
  const progress=span.textContent;F.paused=true;tick();assert.equal(span.textContent,progress);
  media.matches=true;media.dispatch('change');assert.equal(span.textContent,stream.dataset.text);assert.equal(stream.classList.contains('complete'),true);
  F.clearPreviews();assert.equal(timers.size,0);assert.equal((media.events.change||[]).length,0);
});
test('a closed popover does not steal focus when Escape is pressed elsewhere',()=>{
  const {F,Element,document}=environment(),root=new Element(),pop=new Element(),trigger=new Element(),other=new Element();
  pop.hidden=true;root.queries={'.pp-popover':pop,'[data-popover-trigger]':trigger};trigger.parentElement={contains:()=>true};
  F.wirePreview(root,F.byId.popover,{});other.focus();root.dispatch('keydown',{key:'Escape'});assert.equal(document.activeElement,other);F.clearPreviews();
});
let failures=0;
for(const {name,run}of cases){try{run();console.log('PASS '+name);}catch(error){failures++;console.error('FAIL '+name+'\n'+error.message);}}
if(failures)process.exitCode=1;else console.log(JSON.stringify({accessibilityChecks:cases.length,status:'passed',scope:'markup and simulated event contracts; browser/AT validation not performed'}));
