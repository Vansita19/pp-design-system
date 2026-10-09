// The original React/Motion island is mounted separately by spectrum-toast.cjs.
/* Inventory/render integration gate. Source coverage is not a browser parity claim. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),dist=path.join(root,'dist'),docs=path.join(root,'docs');
const manifest=JSON.parse(fs.readFileSync(path.join(docs,'pitch-live-modules.json'),'utf8'));
const source=process.env.PITCH_SOURCE_ROOT||manifest.sourceRoot;
const document={getElementById:()=>({}),head:{append(){}},createElement:()=>({})},context={window:{},document};vm.createContext(context);
const scripts=[...fs.readFileSync(path.join(dist,'index.html'),'utf8').matchAll(/<script src="([\w.-]+\.js)"><\/script>/g)].map(x=>x[1]);
for(const file of scripts.filter(f=>f!=='app.js'&&f!=='spectrum-toast-runtime.js'&&!f.startsWith('cover-')&&!f.startsWith('hairline-')))vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const F=context.window.Forma,modules=new Set(manifest.modules.map(x=>x.file)),buildInputs=new Set((manifest.buildInputs||[]).map(x=>x.file)),coveredModules=new Set(),ids=new Set();
const ledgers=fs.readdirSync(docs).filter(f=>/^audit-(shared|chat|workspace|details|shell|trace)-coverage\.json$/.test(f));
for(const name of ['shared','chat','workspace','details','shell'])assert.ok(ledgers.includes('audit-'+name+'-coverage.json'),'Missing ledger '+name);
let visual=0,nonvisual=0,excluded=0,sourceReferences=0;
// Only these individually documented, user-requested catalogue exclusions bypass routes.
// Retained internal helper rendering is not a claim of public coverage or nonvisual status.
const chatExclusions={
 'CHAT-01':'history','CHAT-02':'history','CHAT-03':'history',
 'CHAT-04':'conversation','CHAT-06':'message','CHAT-07':'conversation',
 'CHAT-08':'empty','CHAT-09':'missing','CHAT-21':'conversation',
 'CHAT-28':'conversation','CHAT-53':'conversation','CHAT-54':'conversation'
};
const catalogueExclusions=new Map([
 ['notifications',{helper:'sourceWorkspace',variant:'notifications'}],
 ...Object.entries(JSON.parse(fs.readFileSync(path.join(docs,'catalogue-removals.json'),'utf8')).patterns),
 ...Object.entries(chatExclusions).map(([id,variant])=>[id,{helper:'sourceChat',variant}])
]),excludedPatterns=new Set(),ledgerRoutes=[];
const resolve=name=>name.replace(/^F\./,'').split('.').reduce((v,k)=>v?.[k],F);
for(const file of ledgers){
 const audit=JSON.parse(fs.readFileSync(path.join(docs,file),'utf8'));
 for(const name of audit.modules){assert.ok(modules.has(name)||buildInputs.has(name),'Non-live module claimed: '+name);coveredModules.add(name);}
 for(const p of audit.patterns){
  assert.ok(!ids.has(p.id),'Duplicate source pattern ID '+p.id);ids.add(p.id);
  assert.ok(['covered','nonvisual','excluded'].includes(p.status),'Unresolved visual source pattern '+p.id+': '+p.status);
  assert.ok(p.note&&p.sources?.length,'Missing disposition/source proof '+p.id);
  for(const ref of p.sources){assert.ok(ref.file&&!ref.file.includes('..')&&Number.isInteger(ref.line)&&ref.line>0,'Invalid source reference '+p.id);if(fs.existsSync(source)){assert.ok(fs.existsSync(path.join(source,ref.file)),'Missing source '+ref.file);assert.ok(ref.line<=fs.readFileSync(path.join(source,ref.file),'utf8').split('\n').length,'Out-of-range source line '+p.id);}sourceReferences++;}
  if(p.status==='nonvisual'){nonvisual++;continue;}
  if(p.status==='excluded'){
   const allowed=catalogueExclusions.get(p.id);
   assert.ok(allowed&&p.helper===allowed.helper&&p.variant===allowed.variant,'Undocumented catalogue exclusion '+p.id);
   assert.equal(p.catalogue,false,'Excluded visual pattern must explicitly have no catalogue route');
   assert.equal(p.exclusion?.reason,'user-request','Catalogue exclusions require an explicit user request');
   assert.equal(p.exclusion?.scope,'catalogue');assert.ok(p.exclusion?.instruction,'Missing exclusion instruction');
   excludedPatterns.add(p.id);excluded++;
  }else{visual++;if(p.catalogue)ledgerRoutes.push([p.id,p.catalogue]);}
  assert.ok(typeof p.helper==='string'&&typeof resolve(p.helper)==='function','Unregistered helper '+p.id+': '+p.helper);
  const name=p.helper.replace(/^F\./,''),c={...(p.variant?{variant:p.variant}:{}),...(p.config||{})};let rendered;
  if(name==='preview'){const item=F.byId[c.itemId||p.variant];assert.ok(item,'Missing preview family '+p.id);rendered=F.preview(item,{...F.defaults(item),...p.config});}
  else if(name==='choiceControl')rendered=F.choiceControl(c.controlType||'checkbox','aria-label="Source checkbox"');
  else rendered=resolve(name)(c);
  assert.ok(rendered!==undefined&&rendered!==null,'No source render '+p.id);
  if(typeof rendered==='string'){assert.ok(rendered.length>10,'Empty source render '+p.id);assert.doesNotMatch(rendered,/\bNaN\b|\bundefined\b/,'Malformed source render '+p.id);}
 }
}
const missing=[...modules].filter(m=>!coveredModules.has(m));assert.deepEqual(missing,[],'Live modules not reviewed');
// Every new module's public visual variation has an actual, reachable catalogue configuration.
const routes={
 sourceShell:{navigation:['navigation',{}],settings:['settings-layout',{variant:'settings'}],invitations:['settings-layout',{variant:'invitations'}],management:['settings-layout',{variant:'management'}],range:['form-layout',{variant:'range'}],copyable:['form-layout',{variant:'copyable'}],setup:['form-layout',{variant:'setup'}],decision:['modal',{variant:'decision'}],'form-dialog':['modal',{variant:'form-dialog'}],'file-preview':['file-upload',{variant:'preview'}],'logo-upload':['file-upload',{variant:'logo-upload'}],session:['account-flow',{variant:'session'}],directory:['account-flow',{variant:'directory'}],onboarding:['account-flow',{variant:'onboarding'}]},
 sourceWorkspace:{'advanced-filter':['filter-bar',{variant:'advanced'}],membership:['popover',{variant:'membership'}],sharing:['popover',{variant:'sharing'}]},
 metricCard:Object.fromEntries(['metrics','highlights','score'].map(v=>[v,['metric-card',{variant:v}]])),
 profileTimeline:{timeline:['timeline',{}]},
 sourceDetails:{},
 // All full-chat/report compositions are retained only as excluded source inventory.
 sourceChat:{},
 chatBubble:Object.fromEntries(['primary','secondary','tinted','outline','ghost'].map(appearance=>[appearance,['conversation',{appearance}]])),
 sourceTrace:{}
};
assert.deepEqual(Object.keys(routes.sourceShell).sort(),[...F.sourceShellVariants].sort());
assert.deepEqual([...excludedPatterns].sort(),[...catalogueExclusions.keys()].sort(),'Explicit exclusion record was removed');
assert.deepEqual([...Object.keys(routes.sourceWorkspace),...new Set([...excludedPatterns].filter(id=>catalogueExclusions.get(id).helper==='sourceWorkspace').map(id=>catalogueExclusions.get(id).variant))].sort(),[...F.sourceWorkspaceVariants].sort(),'Workspace variation lacks a route or documented exclusion');
const internalChatVariants=[...new Set([...catalogueExclusions.values()].filter(x=>x.helper==='sourceChat').map(x=>x.variant))];
for(const id of ['company-report','collection-workspace','note-editor'])assert.ok(!F.byId[id],'Removed catalogue page returned: '+id);
assert.deepEqual([...Object.keys(routes.sourceChat),...internalChatVariants].sort(),[...F.sourceChatVariants].sort(),'Chat variation lacks a real composed route or a specific documented exclusion');
assert.equal(F.isPageVisible('evidence-trace'),false,'Evidence Trace must stay hidden');
assert.equal(F.byId.conversation.group,'Molecules','Chat bubble belongs with focused components');
assert.deepEqual([...F.byId.conversation.controls].map(control=>control.key).sort(),['appearance','align','grouping','text'].sort(),'Chat bubble restored full conversation controls');
assert.ok(!F.byId['information-block'].controls.find(c=>c.key==='variant').options.includes('notifications'),'Excluded notifications returned to Information block');
let routesChecked=0;
const checkRoute=(label,id,c={})=>{
 const item=F.byId[id];assert.ok(F.isPageVisible(id),label+' is not reachable');
 for(const [key,value]of Object.entries(c)){const control=item.controls.find(x=>x.key===key);assert.ok(control,'Unavailable control '+label+'/'+key);if(control.type==='select')assert.ok(control.options.includes(value),'Unavailable configuration '+id+'/'+key+'/'+value);else if(control.type==='toggle')assert.equal(typeof value,'boolean','Invalid toggle '+label+'/'+key);}
 const config={...F.defaults(item),...c},html=F.preview(item,config);assert.ok(html.length>20);for(const token of F.componentTokens(item,config,item.tokens))assert.ok(F.tokens[token],id+': '+token);
};
for(const [helper,variants] of Object.entries(routes))for(const [variant,[id,c]]of Object.entries(variants)){checkRoute(helper+'/'+variant,id,c);routesChecked++;}
for(const [pattern,route]of ledgerRoutes)checkRoute(pattern,route.id,route.config);
if(fs.existsSync(source)){
 const visited=new Set(),walk=file=>{if(visited.has(file))return;visited.add(file);const code=fs.readFileSync(path.join(source,file),'utf8');for(const match of code.matchAll(/(?:from\s*|import\s*)['"](\.\/[^'"]+\.js)['"]/g))walk(path.join(path.dirname(file),match[1]));};walk(manifest.entry);assert.deepEqual([...visited].sort(),[...modules].sort(),'Live import graph changed: refresh inventory');
 for(const m of [...manifest.modules,...(manifest.buildInputs||[])])assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(source,m.file))).digest('hex'),m.sha256,'Source changed since review: '+m.file);
}
console.log(JSON.stringify({liveModules:modules.size,ledgers:ledgers.length,visualPatterns:visual,userExcludedVisualPatterns:excluded,nonvisualDispositions:nonvisual,sourceReferences,composedRoutes:routesChecked,migratedLedgerRoutes:ledgerRoutes.length,status:'passed',scope:'Source inventory, registered helpers, render/token contracts, catalogue reachability and explicit user exclusions; no browser/AT claim'}));
