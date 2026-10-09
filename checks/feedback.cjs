/* Token and DOM behavior contracts; browser visual review remains separate. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist'),document={createElement:()=>({}),getElementById:()=>({}),head:{append(){}}},context={window:{},document};
vm.createContext(context);
for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','spinner.js','previews.js','command-menu.js','guided-popover.js','tooltip.js','file-upload.js','date-picker.js','feedback.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const F=context.window.Forma,css=fs.readFileSync(path.join(dist,'feedback.css'),'utf8');
let alertConfigurations=0,accordionConfigurations=0;
for(const tone of ['neutral','blue','success','warning','danger'])for(const variant of ['standard','soft','icon'])for(const layout of ['detailed','inline'])for(const action of ['none','link','button'])for(const icon of [false,true]){
 const c={tone,variant,layout,action,icon,dismissible:true,title:'Saved <changes>',description:'Description & details',actionLabel:'View <item>'},html=F.alert(c);
 assert.match(html,/Saved &lt;changes&gt;/);assert.match(html,new RegExp(`role="${tone==='danger'?'alert':'status'}"`));
 assert.equal(html.includes('Description &amp; details'),layout==='detailed');
 assert.equal(html.includes('pp-alert-symbol'),icon);
 if(action==='link'){assert.ok(html.includes('--alert-link:'+F.v('component.alert.'+tone+'.foreground')));assert.match(html,/<a class="pp-button link size-sm/);assert.doesNotMatch(html,/role="button"/);}
 else if(action==='button')assert.match(html,new RegExp(`pp-button ${tone==='danger'?'destructive':'secondary'} size-sm`));
 assert.match(html,/<button type="button" class="pp-feedback-dismiss"[^>]+aria-label="Dismiss alert"/);
 for(const token of F.alertTokens(c)){assert.ok(F.tokens[token],token);F.resolve(token);if(token.startsWith('component.alert.'))assert.match(F.tokens[token].value,/^\{.+\}$/);}
 alertConfigurations++;
}
for(const content of ['text','steps','details'])for(const multiple of [false,true])for(const disabled of [false,true])for(const icon of [false,true])for(const indicator of ['plus','chevron']){
 const c={variant:'setup',content,multiple,disabled,icon,indicator},html=F.accordion(c);
 assert.equal((html.match(/class="pp-accordion-setup-group"/g)||[]).length,3);
 assert.equal((html.match(/<details\b/g)||[]).length,6);
 assert.match(html,/>Ready<\/span>/);
 assert.equal((html.match(/class="pp-accordion-symbol"/g)||[]).length,icon?6:0,'Setup honors the same leading-icon control as simple accordions');
 assert.equal(html.includes('pp-spinner-segmented'),icon);
 assert.equal(html.includes(' has-icons'),icon,'Body indent follows the visible leading icons');
 assert.equal((html.match(/class="pp-accordion-chevron"/g)||[]).length,indicator==='chevron'?6:0);
 assert.equal((html.match(/class="pp-accordion-plus"/g)||[]).length,indicator==='plus'?6:0,'Setup honors the same indicator control as simple accordions');
 assert.equal(F.accordionTokens(c).some(token=>token.startsWith('component.spinner.')),icon,'Hidden status icons do not claim spinner tokens');
 assert.equal(html.includes('type="email"'),content==='text');
 if(content==='text'){assert.match(html,/<form[^>]*data-feedback-action/);assert.match(html,/<button\b[^>]*type="submit"/);}
 for(const token of F.accordionTokens(c)){assert.ok(F.tokens[token],token);F.resolve(token);}
 accordionConfigurations++;
}
assert.equal(F.resolve('component.alert.warning.indicator'),F.resolve('semantic.loading.warning'));
assert.match(F.alert({variant:'icon',tone:'danger'}),/--alert-foreground:var\(--pp-component-alert-neutral-foreground\)/);
const ids=new Set();
for(const variant of ['cards','line','soft'])for(const content of ['text','steps','details'])for(const indicator of ['plus','chevron'])for(const multiple of [false,true])for(const disabled of [false,true]){
 const c={variant,content,indicator,multiple,disabled},html=F.accordion(c);
 assert.equal((html.match(/<details\b/g)||[]).length,3);assert.equal((html.match(/<summary\b/g)||[]).length,3);
 assert.equal((html.match(/\bopen>/g)||[]).length,1);
 assert.equal((html.match(/aria-disabled="true"/g)||[]).length,disabled?3:0);
 assert.doesNotMatch(html,/aria-expanded|role="button"/,'Native details and summary own disclosure semantics');
 if(multiple)assert.doesNotMatch(html,/name="feedback-accordion/);
 else{const names=[...html.matchAll(/name="(feedback-accordion-\d+)"/g)].map(m=>m[1]);assert.equal(new Set(names).size,1);assert.ok(!ids.has(names[0]),'Separate specimens never share a single-open group');ids.add(names[0]);}
 if(content==='steps')assert.match(html,/<ol class="pp-accordion-steps">/);
 if(content==='details')assert.match(html,/<dl class="pp-accordion-details">/);
 for(const token of F.accordionTokens(c)){assert.ok(F.tokens[token],token);F.resolve(token);if(token.startsWith('component.'))assert.match(F.tokens[token].value,/^\{.+\}$/);}
 accordionConfigurations++;
}
assert.match(F.accordion({items:[['Custom <title>','info','Safe <content>']]}),/Custom &lt;title&gt;/);
assert.match(F.accordion({items:[{title:'Account',content:'Custom <content>'}]}),/Custom &lt;content&gt;/);
{
 const setup=F.accordion({variant:'setup'});
 for(const title of ['Set up your online store','Add products','Get the point of sale application','Product price &amp; stock','Store settings','Customize your storefront','Prepare for launch','Set up shipping options','Configure tax settings'])assert.ok(setup.includes(title),title);
 assert.equal((setup.match(/class="pp-accordion-chevron"/g)||[]).length,6,'Setup defaults to the reference chevron indicator');
 assert.equal((setup.match(/\bopen>/g)||[]).length,2,'Each independent section may retain its expanded row');
 assert.equal(new Set([...setup.matchAll(/name="([^"]+)"/g)].map(match=>match[1])).size,3,'Single-open scope belongs to each titled group');
 assert.equal((setup.match(/data-feedback-group=/g)||[]).length,6);
 assert.doesNotMatch(F.accordion({variant:'setup',open:false}),/\bopen>/);
}
// Disclosure controls keep the standard small Hugeicons scale; frames use the
// existing ordinary CSS radius contract.
for(const variant of ['setup','cards','soft','line']){
 const html=F.accordion({variant,indicator:'plus'}),tokens=F.accordionTokens({variant});
 assert.match(html,/class="pp-accordion-plus"><svg[^>]*data-hugeicon="Add01Icon" width="16" height="16"/);
 assert.match(html,/class="pp-accordion-minus"><svg[^>]*data-hugeicon="MinusSignIcon" width="16" height="16"/);
 assert.ok(!tokens.some(id=>/smoothing/i.test(id)));assert.doesNotMatch(html,/data-smooth-/);
 if(variant==='setup'){
  assert.equal((html.match(/class="pp-accordion-setup-items"/g)||[]).length,3);
  assert.equal((html.match(/class="pp-accordion-content"/g)||[]).length,6);
 }else if(variant!=='line')assert.equal((html.match(/class="pp-accordion-item"/g)||[]).length,3);
}
assert.equal(F.resolve('component.accordion.indicator.size'),'16px');
assert.equal(F.resolve('component.accordion.indicator.foreground'),F.resolve('color.gray.500'));

const variables=new Set(Object.keys(F.tokens).map(F.varName));
for(const [,variable]of css.matchAll(/var\((--pp-[a-zA-Z0-9-]+)/g))assert.ok(variables.has(variable),variable);
assert.equal(F.resolve('component.alert.radius'),'12px');assert.equal(F.resolve('component.accordion.radius'),'10px');
assert.equal(F.resolve('component.accordion.padding'),'12px');assert.equal(F.resolve('component.accordion.iconGap'),'8px');
assert.equal(F.resolve('component.alert.danger.foreground'),F.resolve('semantic.status.dangerContent'));
assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);assert.match(css,/@media\(forced-colors:active\)/);
assert.doesNotMatch(css,/#[0-9a-f]{3,8}\b/i,'All colors come from the shared token graph');

let focused;
class Element{
 constructor(tag,attrs={},parent){this.tag=tag;this.attrs={...attrs};this.parent=parent;this.children=[];this.events={};this.open=false;this.hidden=false;if(parent)parent.children.push(this);}
 hasAttribute(key){return key in this.attrs;}getAttribute(key){return this.attrs[key]??null;}setAttribute(key,value){this.attrs[key]=String(value);}removeAttribute(key){delete this.attrs[key];}
 matches(selector){return selector.startsWith('[')?this.hasAttribute(selector.slice(1,-1)):this.tag===selector;}
 closest(selector){return this.matches(selector)?this:this.parent?.closest(selector)||null;}
 querySelectorAll(selector){return this.children.flatMap(child=>[...(child.matches(selector)?[child]:[]),...child.querySelectorAll(selector)]);}
 querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
 addEventListener(type,fn){(this.events[type]??=[]).push(fn);}removeEventListener(type,fn){this.events[type]=(this.events[type]||[]).filter(item=>item!==fn);}
 dispatch(type,extra={}){const event={type,target:this,defaultPrevented:false,preventDefault(){this.defaultPrevented=true;},...extra};for(const fn of this.events[type]||[])fn(event);return event;}
 focus(){focused=this;}
 reportValidity(){return this.valid!==false;}
}
const accordionFixture=(root,{multiple=false,disabled=false}={})=>{const accordion=new Element('div',{'data-feedback-accordion':'','data-multiple':String(multiple)},root);const items=Array.from({length:3},()=>{const details=new Element('details',{},accordion);new Element('summary',disabled?{'aria-disabled':'true'}:{},details);return details;});return {accordion,items,triggers:items.map(item=>item.querySelector('summary'))};};
{
 const root=new Element('div'),{accordion,items,triggers}=accordionFixture(root),clean=[];F.wireFeedback(root,fn=>clean.push(fn));
 items[0].open=true;items[1].open=true;items[1].dispatch('toggle');assert.equal(items[0].open,false);assert.equal(items[1].open,true);
 accordion.dispatch('keydown',{target:triggers[0],key:'ArrowDown'});assert.equal(focused,triggers[1]);
 accordion.dispatch('keydown',{target:triggers[1],key:'End'});assert.equal(focused,triggers[2]);
 accordion.dispatch('keydown',{target:triggers[2],key:'Home'});assert.equal(focused,triggers[0]);
 clean[0]();assert.equal(accordion.events.keydown.length,0);assert.equal(items[0].events.toggle.length,0);
}
{
 const root=new Element('div'),{items}=accordionFixture(root,{multiple:true});F.wireFeedback(root);items[0].open=true;items[1].open=true;items[1].dispatch('toggle');assert.equal(items[0].open,true);
}
{
 const root=new Element('div'),{items}=accordionFixture(root),clean=[];
 items[0].setAttribute('data-feedback-group','store');items[1].setAttribute('data-feedback-group','store');items[2].setAttribute('data-feedback-group','settings');
 F.wireFeedback(root,fn=>clean.push(fn));items.forEach(item=>item.open=true);items[1].dispatch('toggle');
 assert.equal(items[0].open,false);assert.equal(items[1].open,true);assert.equal(items[2].open,true,'Expanding a store step leaves another titled section open');
 clean[0]();assert.equal(items[1].events.toggle.length,0);
}
{
 const root=new Element('div'),{triggers}=accordionFixture(root,{disabled:true});F.wireFeedback(root);
 assert.equal(triggers[0].dispatch('click').defaultPrevented,true);assert.equal(triggers[0].dispatch('keydown',{key:'Enter'}).defaultPrevented,true);assert.equal(triggers[0].dispatch('keydown',{key:' '}).defaultPrevented,true);
}
{
 const root=new Element('div'),alert=new Element('div',{'data-feedback-alert':''},root),button=new Element('button',{'data-feedback-dismiss':''},alert),clean=[];F.wireFeedback(root,fn=>clean.push(fn));
 button.dispatch('click');assert.equal(alert.hidden,true);assert.equal(focused,root);assert.equal(root.getAttribute('tabindex'),'-1');clean[0]();assert.equal(root.hasAttribute('tabindex'),false);assert.equal(button.events.click.length,0);
}
{
 const root=new Element('div'),form=new Element('form',{'data-feedback-action':''},root),input=new Element('input',{},form),output=new Element('output',{},form);input.value='team@example.com';F.wireFeedback(root);
 const submit=form.dispatch('submit');assert.equal(submit.defaultPrevented,true);assert.equal(output.textContent,'App link prepared for team@example.com.');
 output.textContent='';input.disabled=true;form.dispatch('submit');assert.equal(output.textContent,'');
 input.disabled=false;form.valid=false;form.dispatch('submit');assert.equal(output.textContent,'');
}
console.log(JSON.stringify({alertConfigurations,accordionConfigurations,interactionContracts:17,status:'passed',scope:'native semantics, focus recovery, independent setup groups, cleanup, alias resolution, and motion'}));

assert.match(css,/\.pp-feedback-alert\.inline\{padding-block:var\(--pp-space-8\)\}/);
assert.doesNotMatch(css,/\.pp-feedback-alert\.icon \.pp-alert-action>\.pp-button\.link\{color:var\(--pp-component-alert-neutral-foreground\)/);
