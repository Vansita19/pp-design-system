/* Native action, removal focus, palette alias, and cover geometry contracts. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist');
const document={createElement:()=>({}),getElementById:()=>({}),head:{append(){}}};
const context={window:{},document};vm.createContext(context);
for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','chip.js','hairline-scenes.js','cover-chip.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const F=context.window.Forma,css=fs.readFileSync(path.join(dist,'chip.css'),'utf8');
let configurations=0;
for(const variant of ['removable','selectable','static','filter'])for(const tone of Object.keys(F.badgeTones))for(const size of variant==='filter'?['md']:['sm','md','lg'])for(const disabled of [false,true]){
 const c={variant,tone,size,disabled,icon:'leading',label:'Seed & pre-seed'},html=F.chip(c);
 assert.match(html,/Seed &amp; pre-seed/);
 assert.equal((html.match(/<button\b/g)||[]).length,variant==='static'?0:1,'No nested interactive elements');
 if(['removable','filter'].includes(variant)){
  assert.match(html,/^<span\b/);
  assert.match(html,/<button type="button"[^>]*data-chip-remove data-chip-value="Seed &amp; pre-seed" aria-label="Remove Seed &amp; pre-seed"/);
 }else if(variant==='selectable')assert.match(html,/^<button type="button"[^>]*aria-pressed="true"/);
 else assert.doesNotMatch(html,/tabindex|aria-pressed|data-chip-remove/);
 if(disabled&&variant!=='static')assert.match(html,/<button[^>]* disabled/);
 for(const token of F.chipTokens(c)){assert.ok(F.tokens[token],token);F.resolve(token);if(token.startsWith('component.'))assert.match(F.tokens[token].value,/^\{.+\}$/);}
 configurations++;
}
assert.match(F.chip({label:'<img src=x onerror=x>'}),/&lt;img src=x onerror=x&gt;/);
for(const size of ['sm','md','lg'])assert.equal(F.resolve('component.chip.height.'+size),{sm:'24px',md:'28px',lg:'32px'}[size]);
assert.equal(F.resolve('component.chip.radius'),'999px');
for(const [role,value]of Object.entries({height:'22px',radius:'8px',font:'13px',line:'18px',padding:'6px',removeSize:'16px',icon:'12px'}))assert.equal(F.resolve('component.chip.filter.'+role),value);
assert.doesNotMatch(F.chip({variant:'filter'}),/data-smooth-/);assert.ok(!F.chipTokens({variant:'filter'}).some(id=>/smoothing/i.test(id)));
assert.match(css,/@media\(hover:none\)/,'Touch exposes the removal action without hover');assert.match(css,/:focus-within/,'Keyboard focus exposes the removal action');
for(const tone of Object.keys(F.badgeTones))assert.equal(F.resolve('component.chip.'+tone+'.background'),F.resolve('semantic.badge.'+tone+'.background'));
const variables=new Set(Object.keys(F.tokens).map(F.varName));
for(const [,variable]of css.matchAll(/var\((--pp-[a-zA-Z0-9-]+)/g))assert.ok(variables.has(variable),variable);
assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);assert.match(css,/@media\(forced-colors:active\)/);

let focused=null;
class Element{
 constructor(attrs={},parent=null){this.attrs={...attrs};this.parent=parent;this.children=[];this.events={};this.disabled='disabled'in attrs;if(parent)parent.children.push(this);}
 hasAttribute(k){return k in this.attrs;}getAttribute(k){return this.attrs[k]??null;}setAttribute(k,v){this.attrs[k]=String(v);}removeAttribute(k){delete this.attrs[k];}
 matches(selector){return selector.split(',').some(s=>s==='[data-pp-menu="combobox"]'?this.attrs['data-pp-menu']==='combobox':s==='.pp-multiselect'?this.attrs.class==='pp-multiselect':this.hasAttribute(s.slice(1,-1)));}
 closest(selector){return this.matches(selector)?this:this.parent?.closest(selector)||null;}
 contains(el){return el===this||this.children.some(c=>c.contains(el));}
 querySelectorAll(selector){return this.children.flatMap(c=>[...(c.matches(selector)?[c]:[]),...c.querySelectorAll(selector)]);}
 addEventListener(type,fn){this.events[type]=fn;}removeEventListener(type,fn){if(this.events[type]===fn)delete this.events[type];}
 focus(){focused=this;}remove(){this.parent.children=this.parent.children.filter(c=>c!==this);this.parent=null;}
 click(target=this){this.events.click?.({target,defaultPrevented:false});}
}
const removable=(root,disabled=false)=>{const chip=new Element({'data-chip':''},root);return new Element({'data-chip-remove':'',...(disabled?{disabled:''}:{})},chip);};
{
 const root=new Element(),first=removable(root),second=removable(root),third=removable(root),clean=[];
 F.wireChips(root,fn=>clean.push(fn));root.click(second);assert.equal(root.contains(second),false);assert.equal(focused,third,'Removing an item focuses the next available chip');
 root.click(third);assert.equal(focused,first,'Removing the last item focuses the previous chip');
 root.click(first);assert.equal(focused,root,'Removing the only item preserves focus in the preview');assert.equal(root.getAttribute('tabindex'),'-1');
 clean[0]();assert.equal(root.events.click,undefined);assert.equal(root.hasAttribute('tabindex'),false);
}
{
 const root=new Element(),chip=new Element({'data-chip':'','data-chip-select':'','aria-pressed':'false'},root),disabled=removable(root,true);
 F.wireChips(root);root.click(chip);assert.equal(chip.getAttribute('aria-pressed'),'true');root.click(chip);assert.equal(chip.getAttribute('aria-pressed'),'false');
 root.click(disabled);assert.equal(root.contains(disabled),true,'Disabled removal cannot mutate values');
 chip.disabled=true;root.click(chip);assert.equal(chip.getAttribute('aria-pressed'),'false','Disabled selection cannot toggle');
 const multi=new Element({class:'pp-multiselect'},root),owned=removable(multi);root.click(owned);assert.equal(root.contains(owned),true,'Multiselect owns its value synchronization');
 const combo=new Element({'data-pp-menu':'combobox'},root),comboChip=removable(combo);root.click(comboChip);assert.equal(root.contains(comboChip),true,'Combobox owns its value synchronization');
 const chat=new Element({'data-pitch-chat':''},root),filterChip=removable(chat);root.click(filterChip);assert.equal(root.contains(filterChip),true,'Chat owns its active criteria and announcement');
 const inbox=new Element({'data-pitch-inbox':''},root),inboxChip=removable(inbox);root.click(inboxChip);assert.equal(root.contains(inboxChip),true,'Inbox owns its filtering and selection state');
}
const scene=F.coverScene(F.coverRecipes.chip);
require('./hairline.cjs').checkScene('chip',scene);
assert.equal(scene.groups.length,3);assert.ok(scene.parts.filter(p=>p.kind==='box').length>=10,'Cover needs constructed assemblies rather than a flat icon');
console.log(JSON.stringify({chipConfigurations:configurations,focusAndInteractionChecks:11,coverParts:scene.parts.length,status:'passed',scope:'markup, simulated DOM events, token references, and Hairline scene geometry'}));
