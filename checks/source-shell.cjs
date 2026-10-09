/* Source shell composition and scoped behavior contracts; no browser is opened. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist');
const style={},document={getElementById:()=>style,head:{append(){}},createElement:()=>({})};
const revoked=[],context={window:{},document,navigator:{clipboard:null},Event:class{constructor(type,init){this.type=type;Object.assign(this,init);}},URL:{createObjectURL:()=> 'blob:local-sample',revokeObjectURL:url=>revoked.push(url)}};vm.createContext(context);
for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','spinner.js','previews.js','command-menu.js','guided-popover.js','tooltip.js','file-upload.js','date-picker.js','avatar.js','chip.js','menus.js','pitch-patterns.js','source-shell.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const F=context.window.Forma,css=fs.readFileSync(path.join(dist,'source-shell.css'),'utf8');
const configs=[...F.sourceShellVariants.map(variant=>({variant})),{variant:'navigation',collapsed:true},{variant:'settings',settingKind:'account'},...['reason','scheduling','choices'].flatMap(decisionKind=>[false,true].map(destructive=>({variant:'decision',decisionKind,destructive}))),...['image','pdf','unsupported','unavailable'].map(fileKind=>({variant:'file-preview',fileKind})),...['invitation','preferences','team'].map(onboardingStep=>({variant:'onboarding',onboardingStep})),...['fund','key','role'].map(dialogKind=>({variant:'form-dialog',dialogKind})),{variant:'management',managementKind:'keys'}];
const ids=new Set();let instances=0;
for(const c of configs){const html=F.sourceShell(c);assert.match(html,/data-source-shell=/);assert.match(html,/data-source-status role="status"/);assert.doesNotMatch(html,/undefined|NaN|&lt;svg/);for(const [,id]of html.matchAll(/\bid="([^"]+)"/g)){assert.ok(!ids.has(id),'Repeated id '+id);ids.add(id);}for(const id of F.sourceShellTokens(c)){assert.ok(F.tokens[id],id);assert.notEqual(F.resolve(id),undefined,id);if(id.startsWith('component.'))assert.match(F.tokens[id].value,/^\{.+\}$/);}instances++;}
const variableNames=new Set(Object.keys(F.tokens).map(F.varName));for(const [,name]of css.matchAll(/var\((--pp-[\w-]+)/g))assert.ok(variableNames.has(name),name);
assert.match(css,/\.pp-source-shell \.pp-source-navigation>header>\.pp-button\{/,'Source navigation geometry wins the shared inline-token button selector');
assert.match(F.sourceShell({variant:'navigation',collapsed:true}),/data-collapsed="true"/);
assert.match(F.sourceShell({variant:'settings'}),/Investment preferences/);
assert.match(F.sourceShell({variant:'invitations'}),/name="email-1"[^>]+type="email"|type="email"[^>]+value=""/);
assert.match(F.sourceShell({variant:'decision',destructive:true}),/name="reason"[^>]+required/);
assert.match(F.sourceShell({variant:'decision',decisionKind:'scheduling'}),/type="url"/);
assert.match(F.sourceShell({variant:'onboarding',onboardingStep:'invitation'}),/readonly/);
assert.equal((F.sourceShell({variant:'onboarding',onboardingStep:'preferences'}).match(/data-source-preferences /g)||[]).length,3);
assert.match(F.sourceShell({variant:'copyable',value:'" onfocus="bad',label:'<script>'}),/&quot; onfocus=&quot;bad/);
assert.match(F.sourceShell({variant:'copyable',label:'<script>'}),/&lt;script&gt;/);
assert.equal(F.resolve('component.sourceShell.navigation.width'),'248px');assert.equal(F.resolve('component.sourceShell.navigation.collapsed'),'80px');assert.equal(F.resolve('component.sourceShell.navigation.row'),'32px');assert.equal(F.resolve('component.sourceShell.navigation.icon'),'16px');
// The complete current source navigation order and compact geometry are retained.
const navigation=F.sourceShell({variant:'navigation'});
const navLabels=[...navigation.matchAll(/data-source-nav="([^"]+)"/g)].map(match=>match[1]);
assert.deepEqual(navLabels,['Home','Inbox','Views','Notes','Notifications','Team','My Settings','About Fund','Integrations','API keys','Fund Index']);
assert.ok(navigation.indexOf('data-source-nav="About Fund"')<navigation.indexOf('pp-source-nav-label">Account'));
assert.ok(navigation.indexOf('pp-source-nav-label">Account')<navigation.indexOf('data-source-nav="Integrations"'));
assert.ok(navigation.indexOf('data-source-nav="API keys"')<navigation.indexOf('pp-source-nav-label">Platform'));
for(const [role,value]of Object.entries({height:'760px',compactRow:'36px',labelHeight:'46px',profileHeight:'65px',title:'15px',header:'82px',toggle:'30px'}))assert.equal(F.resolve('component.sourceShell.navigation.'+role),value);
assert.match(css,/navigation-compactRow\);height:var\(--pp-component-sourceShell-navigation-compactRow\)/);
assert.match(css,/pp-source-profile-avatar-expanded\{display:none\}/);
assert.match(css,/pp-source-profile-avatar-compact\{display:flex\}/);
assert.match(navigation,/pp-source-profile-avatar-expanded"><span[^>]+data-size="sm"/);
assert.match(navigation,/pp-source-profile-avatar-compact"><span[^>]+data-size="md"/);
for(const [values,error]of [[{min:0,max:0},''],[{min:1,max:10},''],[{min:'',max:1},'Enter a minimum'],[{min:5,max:4},'Maximum'],[{min:-1,max:2},'Enter positive'],[{min:'NaN',max:2},'Enter positive'],[{min:0,max:Infinity},'Enter positive'],[{any:true,min:'',max:''},'']]){const result=F.sourceRangeError(values);error?assert.ok(result.startsWith(error)):assert.equal(result,'');}
assert.deepEqual([...F.sourcePreferenceSelection(['Seed'],['Seed','No preference'])],['No preference']);assert.deepEqual([...F.sourcePreferenceSelection(['No preference'],['No preference','Seed'])],['Seed']);assert.deepEqual([...F.sourcePreferenceSelection(['Seed'],[])],[]);
// Onboarding parity is grounded in the live, read-only module and winning stylesheet order.
const workspace=F.sourceShell({variant:'onboarding',onboardingStep:'workspace'}),preferences=F.sourceShell({variant:'onboarding',onboardingStep:'preferences'}),team=F.sourceShell({variant:'onboarding',onboardingStep:'team'});
for(const [html,copy]of [[workspace,['Create Your Workspace','Create a collaboration space for your team.','Fund Name','e.g. Topology Ventures','Thesis summary','Two or three sentences on what this fund invests in and why.','Add Workspace']],[preferences,['Set your investment preferences','Select which companies you would like to see.','Funding rounds','Sectors','Geography','Initial check size','No preference','MIN.','MAX.','Set Preferences']],[team,['Finish Setup','Invite the partners who should see these deals.','Invite team members','partner@example.com','Member','Admin','Add another']]]){
 for(const text of copy)assert.ok(html.includes(text),'Source onboarding copy: '+text);
 assert.match(html,/<aside class="pp-source-onboarding-placeholder" aria-hidden="true"><\/aside>/);
 assert.doesNotMatch(html,/pp-source-art|Workspace preview|data-source-workspace-title|data-source-thesis/);
}
assert.match(workspace,/name="workspace" placeholder="e.g. Topology Ventures" required maxlength="100"/);assert.doesNotMatch(workspace,/name="workspace"[^>]*value=/);assert.match(workspace,/name="thesis"[^>]*><\/textarea>/);
assert.equal((team.match(/data-source-invite="/g)||[]).length,1,'Finish Setup starts with one blank combined row');assert.match(team,/data-hugeicon="UserIcon"/);assert.doesNotMatch(team,/UserFill|user-round|👤|sam@example.com|Save invitations/);assert.match(team,/data-onboarding-remove/);assert.match(team,/pp-source-onboarding-role/);
assert.equal((preferences.match(/data-source-initial="\[\]"/g)||[]).length,3);assert.match(preferences,/pp-source-onboarding-preference-grid/);
assert.equal(F.resolve('component.sourceShell.onboarding.padding'),'40px');assert.equal(F.resolve('component.sourceShell.onboarding.height'),'506px');assert.equal(F.resolve('component.sourceShell.onboarding.title'),'28px');assert.equal(F.resolve('component.sourceShell.onboarding.titleLine'),'33px');assert.equal(F.resolve('component.sourceShell.onboarding.preview'),F.resolve('semantic.surface.subtle'));
assert.match(css,/onboarding-fields>\.pp-button\{margin-top:auto\}/);assert.match(css,/onboarding-invite:focus-within \[data-onboarding-remove\]/);assert.match(css,/@media\(hover:none\)/);
const ppSource='/Users/vansitaaddanki/pp-admin/investor-preview';let liveSourceParity=false;
if(fs.existsSync(path.join(ppSource,'onboarding.js'))){
 const sourceWorkspace=fs.readFileSync(path.join(ppSource,'workspace.js'),'utf8'),sourceStyles=fs.readFileSync(path.join(ppSource,'styles.css'),'utf8'),sourceTrace=fs.readFileSync(path.join(ppSource,'trace.css'),'utf8');
 const sourceNav=sourceWorkspace.slice(sourceWorkspace.indexOf('const nav = ['),sourceWorkspace.indexOf('const mark ='));
 assert.deepEqual([...sourceNav.matchAll(/\['[^']+', '([^']+)'\]/g)].map(match=>match[1]),navLabels);
 assert.match(sourceTrace,/sidebar\.compact \.side-nav a \{ width:36px;height:36px/);assert.match(sourceStyles,/height:46px;min-height:46px/);
 const onboarding=fs.readFileSync(path.join(ppSource,'onboarding.js'),'utf8'),sourcePreferences=fs.readFileSync(path.join(ppSource,'onboarding-preferences.js'),'utf8'),build=fs.readFileSync(path.join(ppSource,'build-preview.mjs'),'utf8'),winningCSS=fs.readFileSync(path.join(ppSource,'onboarding-system.css'),'utf8');
 for(const text of ['Create Your Workspace','Create a collaboration space for your team.','Set your investment preferences','Select which companies you would like to see.','Finish Setup','Invite the partners who should see these deals.','e.g. Topology Ventures','Two or three sentences on what this fund invests in and why.'])assert.ok(onboarding.includes(text)&&[workspace,preferences,team].some(html=>html.includes(text)),text);
 const prefContext={};vm.createContext(prefContext);vm.runInContext(sourcePreferences.replaceAll('export ','')+';this.sourcePreferenceOptions=preferenceOptions;',prefContext);for(const values of Object.values(prefContext.sourcePreferenceOptions))for(const value of values)assert.ok(preferences.includes(F.escape(value)),value);
 assert.ok(build.indexOf("'styles.css'")<build.indexOf("'onboarding-system.css'"));assert.match(winningCSS,/auth-form h1 \{ font-size:28px;line-height:33px/);assert.match(winningCSS,/auth-card \{ max-width:100%;height:506px/);assert.match(onboarding,/invites: \[\{ id: 0, email: '' \}\]/);liveSourceParity=true;
}

// The specimen's delegated behavior uses controlled DOM-shaped fixtures. The
// real menu/atom modules have their own behavior checks; no fake browser claim.
class Node{
 constructor(dataset={}){this.dataset=dataset;this.attrs={};this.map={};this.lists={};this.matchesSet=new Set();this.closestMap={};this.listeners=new Map();this.hidden=false;this.disabled=false;this.isConnected=true;this.textContent='';this.value='';this.style={};}
 querySelector(s){return this.map[s]||null;}querySelectorAll(s){return this.lists[s]||[];}contains(){return true;}
 closest(s){return this.closestMap[s]||s.split(',').map(selector=>this.closestMap[selector]).find(Boolean)||null;}matches(s){return s.split(',').some(x=>this.matchesSet.has(x));}
 hasAttribute(key){return key in this.attrs||key.startsWith('data-')&&key.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase()) in this.dataset;}
 setAttribute(k,v){this.attrs[k]=String(v);}getAttribute(k){return this.attrs[k]??null;}removeAttribute(k){delete this.attrs[k];}
 addEventListener(type,fn){if(!this.listeners.has(type))this.listeners.set(type,new Set());this.listeners.get(type).add(fn);}removeEventListener(type,fn){this.listeners.get(type)?.delete(fn);}
 focus(){this.focused=true;}select(){this.selected=true;}setCustomValidity(text){this.validation=text;}dispatchEvent(){this.dispatched=true;}reportValidity(){return true;}
 async emit(type,target=this,extras={}){for(const fn of this.listeners.get(type)||[])await fn({target,preventDefault(){},...extras});}
 count(){return [...this.listeners.values()].reduce((n,set)=>n+set.size,0);}
}
let nestedMounts=0,nestedCleanups=0;for(const key of ['enhanceSelects','wireMenus','wireAvatars'])F[key]=(_root,register)=>{nestedMounts++;register(()=>nestedCleanups++);};
const button=(action)=>{const b=new Node({sourceAction:action});b.closestMap.button=b;return b;};
function specimen(map={},lists={}){const host=new Node({sourceId:'fixture'}),doc=new Node(),status=new Node();host.ownerDocument=doc;host.map={'[data-source-status]':status,...map};host.lists=lists;const root={querySelectorAll:()=>[host]},registered=[];F.wireSourceShell(root,fn=>registered.push(fn));assert.equal(registered.length,1);F.wireSourceShell(root,fn=>registered.push(fn));assert.equal(registered.length,1,'Mount is idempotent');return{host,doc,status,cleanup:()=>{registered[0]();registered[0]();assert.equal(host.count(),0);assert.equal(doc.count(),0);}};}
(async()=>{
 let behaviors=0;
 const inviteList=new Node(),inviteInput=new Node(),addInvite=button('add-invite'),removeInvite=button('remove-invite'),uploadLogo=button('onboarding-upload'),logoPicker=new Node();
 inviteList.insertAdjacentHTML=(_position,html)=>{inviteList.html=html;inviteList.lastElementChild=new Node();inviteList.lastElementChild.map.input=inviteInput;};logoPicker.click=()=>logoPicker.clicked=true;
 const on=specimen({'.pp-source-onboarding':new Node(),'[data-source-invites]':inviteList,'[data-source-logo]':logoPicker,'[data-source-invite] input':inviteInput});
 await on.host.emit('click',addInvite);assert.match(inviteList.html,/pp-source-onboarding-invite/);assert.match(inviteList.html,/data-hugeicon="UserIcon"/);assert.match(inviteList.html,/name="email-1"/);assert.equal(inviteInput.focused,true);
 const removedRow=new Node();removedRow.remove=()=>removedRow.removed=true;removeInvite.closestMap['[data-source-invite]']=removedRow;await on.host.emit('click',removeInvite);assert.equal(removedRow.removed,true);assert.match(inviteList.html,/name="email-2"/);assert.equal(inviteInput.focused,true);
 await on.host.emit('click',uploadLogo);assert.equal(logoPicker.clicked,true);on.cleanup();behaviors+=3;
 const nav=new Node({collapsed:'false'}),menu=new Node(),profile=button('profile'),collapse=button('collapse'),first=new Node({sourceNav:'Home'}),second=new Node({sourceNav:'Inbox'}),menuItems=[button('profile-item'),button('profile-item')];
 menu.hidden=true;menu.map['[role="menuitem"]']=menuItems[0];menu.lists['[role="menuitem"]']=menuItems;menuItems.forEach(item=>item.closestMap['[data-source-profile-menu]']=menu);first.closestMap.button=first;second.closestMap.button=second;
 const n=specimen({'[data-source-navigation]':nav,'[data-source-profile-menu]':menu,'[data-source-action="profile"]':profile},{'[data-source-nav]':[first,second]});
 await n.host.emit('click',collapse);assert.equal(nav.dataset.collapsed,'true');assert.equal(collapse.attrs['aria-expanded'],'false');
 await n.host.emit('click',profile);assert.equal(menu.hidden,false);assert.equal(menuItems[0].focused,true);
 await n.host.emit('keydown',menuItems[0],{key:'ArrowDown'});assert.equal(menuItems[1].focused,true);
 await n.host.emit('keydown',menuItems[1],{key:'Escape'});assert.equal(menu.hidden,true);assert.equal(profile.focused,true);
 await n.host.emit('click',second);assert.equal(second.attrs['aria-current'],'page');assert.equal(first.attrs['aria-current'],undefined);n.cleanup();behaviors+=5;
 const min=new Node(),max=new Node(),currency=new Node(),any=new Node(),error=new Node(),range=new Node(),form=new Node({sourceForm:'range'});min.value='100';max.value='50';error.id='range-error';range.map={'[data-source-any]':any,'[name="min"]':min,'[name="max"]':max,'[name="currency"]':currency,'[data-source-range-error]':error};form.closestMap['[data-source-form]']=form;min.closestMap['[data-source-range]']=range;any.matchesSet.add('[data-source-any]');
 const r=specimen({'[data-source-range]':range});await r.host.emit('submit',form);assert.equal(error.hidden,false);assert.match(error.textContent,/Maximum/);assert.equal(min.attrs['aria-invalid'],'true');assert.equal(r.status.textContent,'');
 max.value='200';await r.host.emit('input',min);assert.equal(error.hidden,true);await r.host.emit('submit',form);assert.equal(r.status.textContent,'Saved in this preview.');
 any.checked=true;await r.host.emit('change',any);assert.ok(min.disabled&&max.disabled&&currency.disabled);any.checked=false;await r.host.emit('change',any);assert.ok(!min.disabled&&!max.disabled&&!currency.disabled);r.cleanup();behaviors+=4;
 const copy=button('copy'),value=new Node(),copyWrap=new Node();value.value='Sample';copyWrap.map['[data-source-copy-value]']=value;copy.closestMap['.pp-source-copy']=copyWrap;const c=specimen();await c.host.emit('click',copy);assert.ok(value.focused&&value.selected);assert.match(c.status.textContent,/manual copying/);context.navigator.clipboard={writeText:async text=>assert.equal(text,'Sample')};await c.host.emit('click',copy);assert.equal(c.status.textContent,'Copied to clipboard.');c.cleanup();behaviors+=2;
 const setupBody=new Node(),toggle=button('setup-toggle'),client=new Node(),tabs=[new Node({sourceClient:'App'}),new Node({sourceClient:'Code'})];tabs.forEach((tab,index)=>{tab.id='tab-'+index;tab.closestMap.button=tab;tab.closestMap['[data-source-client]']=tab;});const s=specimen({'[data-source-setup-body]':setupBody,'[data-source-client-body]':client},{'[data-source-client]':tabs});await s.host.emit('click',toggle);assert.equal(setupBody.hidden,true);await s.host.emit('click',tabs[1]);assert.equal(tabs[1].attrs['aria-selected'],'true');assert.match(client.innerHTML,/client connect/);await s.host.emit('keydown',tabs[1],{key:'ArrowLeft'});assert.equal(tabs[0].focused,true);s.cleanup();behaviors+=3;
 const open=button('open-decision'),close=button('close-decision'),dialog=new Node(),dialogInput=new Node();dialog.showModal=()=>dialog.open=true;dialog.close=()=>{dialog.open=false;dialog.emit('close');};const d=specimen({'[data-source-dialog]':dialog,'[data-source-dialog] input':dialogInput});await d.host.emit('click',open);assert.equal(dialog.open,true);assert.equal(dialogInput.focused,true);await d.host.emit('click',close);assert.equal(dialog.open,false);assert.equal(open.focused,true);d.cleanup();assert.equal(dialog.count(),0);behaviors+=2;
 const fileInput=new Node(),fileBody=new Node(),download=new Node(),filename=new Node();fileInput.matchesSet.add('[data-source-file]');fileInput.files=[{name:'sample.txt',type:'text/plain',text:async()=>'<img onerror=bad>'}];const f=specimen({'[data-source-file-body]':fileBody,'[data-source-file-download]':download,'[data-source-file-name]':filename});await f.host.emit('change',fileInput);assert.match(fileBody.innerHTML,/&lt;img onerror=bad&gt;/);assert.equal(download.hidden,false);assert.equal(filename.textContent,'sample.txt');f.cleanup();assert.ok(revoked.includes('blob:local-sample'));behaviors+=2;
 assert.equal(nestedCleanups,nestedMounts,'Every nested mount is disposed');
 console.log(JSON.stringify({sourceShellConfigurations:instances,liveSourceParity,behaviorContracts:behaviors,validationContracts:11,status:'passed',scope:'Render/token contracts, navigation/menu focus, grouped form validation, clipboard fallback, setup tabs, native dialog lifecycle, local file escaping and cleanup; no browser visual or assistive-technology review'}));
})().catch(error=>{console.error(error);process.exitCode=1;});

// Source profile menu labels are 13px independently of the 14px navigation rows.
assert.equal(F.resolve('component.sourceShell.navigation.profileMenuFont'),'13px');
assert.ok(F.sourceShellTokens({variant:'navigation'}).includes('component.sourceShell.navigation.profileMenuFont'));
assert.match(css,/\.pp-source-profile-menu\{font-size:var\(--pp-component-sourceShell-navigation-profileMenuFont\)/);
