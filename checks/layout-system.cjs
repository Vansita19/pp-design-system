/* Layout geometry and control contracts; no browser or source-app mutations. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist'),style={};
const ctx={window:{},document:{createElement:()=>style,getElementById:()=>style,head:{append(){}}}};vm.createContext(ctx);
for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','layout-system.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),ctx,{filename:file});
const F=ctx.window.Forma;let checks=0,geometries=0;
function test(name,fn){try{fn();checks++;}catch(error){error.message=name+': '+error.message;throw error;}}
test('boundaries cover small screens and switch at the documented breakpoint',()=>{
 for(const [width,band,cols,sidebar]of [[320,'base',4,'drawer'],[639,'base',4,'drawer'],[640,'sm',4,'drawer'],[767,'sm',4,'drawer'],[768,'md',8,'drawer'],[1023,'md',8,'drawer'],[1024,'lg',12,'collapsed'],[1279,'lg',12,'collapsed'],[1280,'xl',12,'expanded'],[1920,'xl',12,'expanded']]){
  const s=F.layoutProfile({width});assert.equal(s.band,band);assert.equal(s.columns,cols);assert.equal(s.sidebar,sidebar);
 }
 assert.equal(F.layoutProfile({width:10}).width,320);assert.equal(F.layoutProfile({width:Infinity}).width,1440);assert.equal(F.layoutProfile({width:10000}).width,1920);
});
test('source dimensions and meaningful aliases are retained',()=>{
 const source={sidebar_expanded:248,sidebar_collapsed:80,header_workspace:48,header_review:56,content_review:740,content_reviewWithPanel:680,content_conversation:780,content_details:1000,panel_width:391};
 for(const [key,value]of Object.entries(source)){
  const id='component.appShell.'+key.replace('_','.');assert.equal(parseFloat(F.resolve(id)),value);assert.match(F.tokens[id].value,/^\{semantic\.layout\./);assert.ok(F.chain(id).length>=3);
 }
 for(const id of F.layoutTokens()){assert.ok(F.tokens[id],id);assert.doesNotThrow(()=>F.resolve(id));}
 assert.equal(F.tokens['semantic.layout.sidebar.drawer'].source,'extended');assert.equal(F.tokens['semantic.layout.grid.columns.mobile'].source,'extended');
});
test('all column geometry fits its available content across the range',()=>{
 for(let width=320;width<=1920;width++)for(const profile of ['workspace','review','conversation'])for(const sidebar of ['auto','expanded','collapsed']){
  const s=F.layoutProfile({width,profile,sidebar});geometries++;
  assert.ok(s.columnWidth>0,JSON.stringify(s));
  assert.ok(Math.abs(s.columns*s.columnWidth+(s.columns-1)*s.gutter-s.contentWidth)<.001);
  assert.ok(s.contentX>=s.sidebarWidth);assert.ok(s.contentX+s.contentWidth<=s.width);
  if(s.maxWidth)assert.ok(s.contentWidth<=s.maxWidth);
 }
});
test('sidebar overrides and drawer overlay preserve intended geometry',()=>{
 const expanded=F.layoutProfile({width:1280,sidebar:'expanded',profile:'workspace'}),collapsed=F.layoutProfile({width:1280,sidebar:'collapsed',profile:'workspace'});
 assert.equal(expanded.sidebarWidth,248);assert.equal(collapsed.sidebarWidth,80);assert.equal(collapsed.contentWidth-expanded.contentWidth,168);
 const open=F.layoutProfile({width:834,drawerOpen:true,sidebar:'expanded'}),closed=F.layoutProfile({width:834,drawerOpen:false,sidebar:'collapsed'});
 assert.equal(open.contentWidth,closed.contentWidth);assert.equal(open.contentX,closed.contentX);assert.equal(open.sidebarWidth,0);assert.equal(open.drawerWidth,248);
 assert.equal(F.layoutProfile({width:1440,drawerOpen:true}).drawerOpen,false);
});
test('specimen exposes accessible controls and unique range IDs',()=>{
 const one=F.layoutFoundation(),two=F.layoutFoundation({width:390});
 const id=one.match(/id="(layout-width-\d+)"/)[1];assert.ok(one.includes('for="'+id+'"'));assert.ok(!two.includes('id="'+id+'"'));
 assert.equal((one.match(/data-layout-preset=/g)||[]).length,4);assert.match(one,/aria-label="Desktop navigation"/);assert.match(one,/role="img" aria-label="1440px workspace layout/);
 assert.match(two,/aria-label="390px workspace layout/);assert.match(two,/data-layout-drawer aria-expanded="false" >/);
 // 8px shell inset leaves 1142/1310px content; after eleven 24px gutters,
 // the twelve columns are 73.1667/87.1667px, displayed to one decimal place.
 assert.match(one,/Expanded<\/h3><span>248px sidebar · 73\.2px columns · 24px gutters/);assert.match(one,/Collapsed<\/h3><span>80px sidebar · 87\.2px columns · 24px gutters/);
 assert.match(one,/role="status" aria-live="polite"/);assert.doesNotMatch(one,/<select|on(?:click|input)=|javascript:/);
});

function fixture(){
 const events=new Map(),elements=new Map();
 const element=(dataset={})=>({dataset,disabled:false,hidden:false,value:'1440',attrs:{},classes:new Set(),
  setAttribute(k,v){this.attrs[k]=v;},hasAttribute(k){return Object.hasOwn(this.attrs,k)||Object.hasOwn(this.dataset,k.replace(/^data-/,'').replace(/-([a-z])/g,(_,x)=>x.toUpperCase()));},
  classList:{toggle(){}},focus(){this.focused=true;},closest(){return this;},querySelector(selector){return elements.get(selector);}});
 const root=element(),el=element({layoutWidth:'1440',layoutProfile:'review',layoutSidebar:'auto'}),range=element();
 const presets=['1440','1100','834','390'].map(layoutPreset=>element({layoutPreset})),profiles=['workspace','review','conversation'].map(layoutProfile=>element({layoutProfile})),sides=['auto','expanded','collapsed'].map(layoutSidebar=>element({layoutSidebar}));
 const rows=['base','sm','md','lg','xl'].map(layoutBand=>element({layoutBand}));
 for(const key of ['[data-layout-output]','[data-layout-rule]','[data-layout-diagram]','[data-layout-metrics]','[data-layout-drawer]','[data-layout-grid]','[data-layout-status]','span'])elements.set(key,element());
 elements.set('[data-layout-range]',range);elements.set('[data-layout-foundation]',el);
 el.querySelectorAll=selector=>selector==='[data-layout-preset]'?presets:selector==='button[data-layout-profile]'?profiles:selector==='button[data-layout-sidebar]'?sides:[];
 root.querySelectorAll=()=>rows;el.contains=()=>true;
 el.addEventListener=(key,fn)=>events.set(key,fn);el.removeEventListener=(key,fn)=>{if(events.get(key)===fn)events.delete(key);};
 return {root,el,range,presets,profiles,sides,events,elements,click:b=>events.get('click')({target:b})};
}
test('keyboard-adjustable width, navigation controls, and teardown work',()=>{
 const f=fixture();let cleanup;F.wireLayoutFoundation(f.root,fn=>cleanup=fn);
 f.click(f.presets[3]);assert.equal(f.range.value,'390');assert.equal(f.elements.get('[data-layout-output]').textContent,'390px');assert.ok(f.sides.every(b=>b.disabled));
 const drawer=f.elements.get('[data-layout-drawer]');drawer.dataset.layoutDrawer='';f.click(drawer);assert.equal(drawer.attrs['aria-expanded'],'true');
 f.events.get('keydown')({key:'Escape'});assert.equal(drawer.attrs['aria-expanded'],'false');assert.equal(drawer.focused,true);
 f.click(f.presets[0]);assert.ok(f.sides.every(b=>!b.disabled));f.click(f.sides[2]);assert.equal(f.el.dataset.layoutSidebar,'collapsed');
 f.click(f.profiles[0]);assert.equal(f.el.dataset.layoutProfile,'workspace');
 f.range.value='1023';f.events.get('input')({target:f.range});assert.equal(drawer.hidden,false);f.events.get('change')({target:f.range});assert.match(f.elements.get('[data-layout-status]').textContent,/1023px, 8 columns, drawer closed/);
 cleanup();assert.equal(f.events.size,0);
});
console.log(JSON.stringify({ok:true,checks,geometries,tokens:F.layoutTokens().length}));
