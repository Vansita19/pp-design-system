/* Actual review controls and persistence in happy-dom; no browser or server. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
const reviews=['review-targets.js','review-store.js','review-panel.js','review-studio.js'];
async function fixture(){
 const {Window}=await import(path.join(root,'vendor/spectrum-toast/node_modules/happy-dom/lib/index.js'));
 const window=new Window({url:'https://forma.test/#command-menu/overview'}),document=window.document;
 document.body.innerHTML='<style id="project-tokens"></style><main id="content"></main><div id="review-root"></div>';
 const errors=[];window.addEventListener('error',event=>errors.push(event.error));
 const scripts=[...fs.readFileSync(path.join(dist,'index.html'),'utf8').matchAll(/<script src="([\w.-]+\.js)"><\/script>/g)].map(match=>match[1]).filter(file=>file!=='app.js'&&file!=='spectrum-toast-runtime.js'&&!file.startsWith('cover-')&&!file.startsWith('hairline-')&&!reviews.includes(file));
 window.eval([...scripts,...reviews].map(file=>fs.readFileSync(path.join(dist,file),'utf8')).join('\n;\n'));
 const F=window.Forma;
 const click=node=>{assert.ok(node,'Expected an actionable control');if(typeof node.click==='function')node.click();else node.dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true}));};
 const change=(node,value)=>{assert.ok(node,'Expected a configuration input');node.value=value;node.dispatchEvent(new window.Event('change',{bubbles:true}));};
 const input=(node,value)=>{assert.ok(node,'Expected a text input');node.value=value;node.dispatchEvent(new window.Event('input',{bubbles:true}));};
 const key=(node,key)=>{const event=new window.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true});node.dispatchEvent(event);return event;};
 const stage=(html,id='example')=>{const node=document.createElement('section');node.className='preview-stage pp-theme';node.dataset.reviewExample=id;node.innerHTML=html;document.querySelector('#content').append(node);return node;};
 return{window,document,F,errors,click,change,input,key,stage,async close(){assert.deepEqual(errors,[]);await window.happyDOM.abort();window.close();}};
}
const clone=value=>JSON.parse(JSON.stringify(value));
const jsonEqual=(actual,expected,message)=>assert.deepEqual(clone(actual),clone(expected),message);
async function run(){
 const env=await fixture();
 try{
  const {F,document}=env;
  const command=env.stage(F.commandMenuPreview(F.defaults(F.byId['command-menu'])));
  const card=command.querySelector('.pp-command-card');assert.ok(card,'Real command-menu fixture renders a panel');
  const cardTarget=F.reviewDescribe(card,command);assert.equal(cardTarget.kind,'command-panel');
  const radius=cardTarget.properties.find(property=>property.id==='radius');assert.equal(radius.apply.name,'--pp-component-command-radius');assert.ok(F.reviewTokenChoices(radius).some(choice=>choice.id==='radius.2xl'));assert.ok(F.reviewTokenChoices(radius).every(choice=>F.chain(choice.id).at(-1).startsWith('radius.')));
  const icon=card.querySelector('svg.hugeicon'),iconTarget=F.reviewDescribe(icon.querySelector('path')||icon,command);assert.equal(iconTarget.kind,'icon');assert.ok(iconTarget.breadcrumb.some(part=>part.kind==='command-panel'),'Nested glyph has a meaningful panel ancestor');
  const savedLocator=clone(cardTarget.locator);command.innerHTML=F.commandMenuPreview(F.defaults(F.byId['command-menu']));assert.equal(F.reviewFind(command,savedLocator),command.querySelector('.pp-command-card'),'Named locator survives rerender-generated ID changes');
  const outside=document.createElement('button');assert.equal(F.reviewDescribe(outside,command),null,'Unrelated page controls are not review targets');
  const actionStage=env.stage(F.button({variant:'secondary',size:'sm',icon:'leading',iconName:'plus'},'Add item','data-source-action="add-item"'),'action');
  const action=actionStage.querySelector('button'),actionTarget=F.reviewDescribe(action,actionStage);assert.equal(actionTarget.kind,'button');assert.ok(actionTarget.properties.some(property=>property.id==='variant'));assert.ok(actionTarget.properties.some(property=>property.id==='icon'));assert.equal(F.reviewFind(actionStage,actionTarget.locator),action);
  const tokensBefore=JSON.stringify(F.tokens);
  const context=F.reviewContext({componentId:'command-menu',section:'overview',config:F.defaults(F.byId['command-menu'])});
  const base=F.createReviewStore({storage:null});
  assert.ok(base.warning(),'Unavailable storage has an explicit warning');
  const comment=base.addComment({context,target:null,targetLabel:'Whole example',text:'Tighten the header.'});
  assert.equal(comment.context.componentId,'command-menu');assert.equal(comment.context.section,'overview');assert.ok(comment.context.exampleKey);assert.equal(base.snapshot().comments.length,1);
  const restored=F.createReviewStore({storage:null});restored.importJSON(base.exportJSON());jsonEqual(restored.snapshot(),base.snapshot(),'Valid review JSON round-trips through its schema');
  const validChange={context,target:cardTarget.locator,targetLabel:cardTarget.label,property:'radius',value:'radius.2xl',original:{token:'component.command.radius',value:F.resolve('component.command.radius')}};
  base.putChange(validChange);const changesRoundtrip=F.createReviewStore({storage:null});changesRoundtrip.importJSON(base.exportJSON());jsonEqual(changesRoundtrip.snapshot(),base.snapshot(),'Named target changes survive JSON export/import');
  const invalidBackup=mutate=>{const value=JSON.parse(base.exportJSON());mutate(value.changes[0]);return JSON.stringify(value);};
  for(const [name,mutate]of [
   ['unknown token',entry=>entry.value='radius.unregistered'],
   ['code value',entry=>entry.value='url(javascript:window.__reviewExecuted=true)'],
   ['arbitrary property',entry=>entry.property='background-image'],
   ['unknown target',entry=>entry.target.kind='body'],
   ['arbitrary selector',entry=>entry.target.selector='body, script'],
   ['negative target index',entry=>entry.target.index=-1],
   ['unknown component',entry=>entry.context.componentId='not-a-component']
  ]){const before=changesRoundtrip.snapshot();assert.throws(()=>changesRoundtrip.importJSON(invalidBackup(mutate)),undefined,'Reject '+name);jsonEqual(changesRoundtrip.snapshot(),before,'Rejected '+name+' is atomic');}
  assert.equal(env.window.__reviewExecuted,undefined,'Import never evaluates supplied strings');
  const snapshot=restored.snapshot();assert.throws(()=>restored.importJSON('{"schema":"unknown","version":1,"project":"pitch-protocol","comments":[],"changes":[]}'));
  assert.throws(()=>restored.importJSON('not JSON'));assert.throws(()=>restored.importJSON('x'.repeat(2000001)));jsonEqual(restored.snapshot(),snapshot,'Rejected input does not partially mutate stored data');
  let writes=0;const failing=F.createReviewStore({temporaryChanges:true,storage:{getItem(){return null;},setItem(){writes++;throw Error('Quota');}}});
  failing.addComment({context,text:'Keep this note in memory.'});assert.equal(writes,1);assert.equal(failing.snapshot().comments.length,1);assert.match(failing.warning(),/memory/i);
  const dangerous='</textarea><img src=x onerror="window.__reviewExecuted=true"><script>window.__reviewExecuted=true</script>';
  const panel=document.createElement('div');panel.innerHTML=F.reviewPanelHTML({open:true,mode:'comments',componentName:'Command menu',draft:dangerous,comments:[{id:'untrusted',text:dangerous,targetLabel:dangerous,componentName:'Command menu'}],storageWarning:failing.warning(),durable:false});document.body.append(panel);
  assert.equal(panel.querySelectorAll('script,img').length,0,'Comments and labels remain escaped text');assert.equal(env.window.__reviewExecuted,undefined);assert.match(panel.textContent,/memory/i);panel.remove();
  assert.equal(JSON.stringify(F.tokens),tokensBefore,'Descriptor and store operations never mutate canonical tokens');
  // Exercise the actual controller through its rendered controls and captured DOM events.
  const studio=F.createReviewStudio({document,store:F.createReviewStore({temporaryChanges:true,storage:env.window.localStorage})});
  F.current=F.byId['command-menu'];
  let unregisterCommand=studio.register(command,F.current,F.defaults(F.current),'Command');
  const commandTwin=env.stage(F.commandMenuPreview(F.defaults(F.current)),'untouched');
  const toolbar=document.createElement('div');toolbar.innerHTML=F.reviewToolbar();document.body.prepend(toolbar);
  const launch=toolbar.querySelector('[data-review-open="tweak"]');launch.focus();env.click(launch);
  assert.equal(studio.snapshot().open,true);assert.equal(document.activeElement.getAttribute('data-review-action'),'pick','Opening focuses the visible picker control');assert.equal(document.body.classList.contains('review-open'),true,'Opening reserves space for the drawer');
  const ui=selector=>document.querySelector('#review-studio-host '+selector);
  const control=id=>ui('[data-review-field="'+id+'"]');
  const actionControl=id=>ui('[data-review-action="'+id+'"]');
  let currentCard=command.querySelector('.pp-command-card');
  env.click(currentCard);assert.equal(studio.snapshot().selected.kind,'command-panel');
  assert.equal(ui('[data-review-details="parts"]').open,false,'Long part list stays out of the primary flow');
  assert.equal(ui('[data-review-details="more"]').open,false,'Backup controls start collapsed');
  ui('[data-review-details="parts"]').open=true;ui('[data-review-details="more"]').open=true;
  env.change(control('radius'),'radius.2xl');
  assert.equal(ui('[data-review-details="parts"]').open,true,'Changing appearance keeps part-list disclosure state');assert.equal(ui('[data-review-details="more"]').open,true,'Changing appearance keeps advanced disclosure state');
  assert.equal(currentCard.style.getPropertyValue('--pp-component-command-radius'),F.v('radius.2xl'));
  assert.equal(commandTwin.querySelector('.pp-command-card').style.getPropertyValue('--pp-component-command-radius'),'');
  assert.equal(JSON.stringify(F.tokens),tokensBefore,'Live tweak changes only the selected specimen');
  env.click(actionControl('compare'));assert.equal(currentCard.style.getPropertyValue('--pp-component-command-radius'),'');
  env.click(actionControl('compare'));assert.equal(currentCard.style.getPropertyValue('--pp-component-command-radius'),F.v('radius.2xl'));
  env.click(currentCard.querySelector('svg.hugeicon'));
  assert.equal(studio.snapshot().selected.kind,'icon');
  const parentIndex=studio.snapshot().selected.breadcrumb.findIndex(part=>part.kind==='command-panel');
  env.click(ui('[data-review-ancestor="'+parentIndex+'"]'));assert.equal(studio.snapshot().selected.kind,'command-panel');
  env.change(ui('[data-review-width]'),'320');assert.equal(studio.snapshot().previewWidth,320);
  env.click(ui('[data-review-mode="comments"]'));
  env.input(ui('[data-review-draft]'),'Use the larger corner token.');
  assert.equal(actionControl('add-comment').disabled,false,'Typing enables Add comment without losing the draft');
  env.click(actionControl('add-comment'));
  const saved=studio.store.snapshot().comments.at(-1);assert.equal(saved.text,'Use the larger corner token.');
  jsonEqual(saved.target,savedLocator);assert.equal(saved.context.componentId,'command-menu');assert.equal(saved.context.previewWidth,320);assert.equal(saved.context.route,context.route);jsonEqual(saved.context.config,context.config);
  const reloaded=F.createReviewStore({temporaryChanges:true,storage:env.window.localStorage});jsonEqual(reloaded.snapshot().comments,studio.store.snapshot().comments,'Comments survive a new store instance');
  assert.equal(reloaded.snapshot().changes.length,0,'Saving a comment does not persist temporary appearance changes');assert.ok(studio.store.snapshot().changes.length,'The open editor retains its active changes');assert.ok(JSON.parse(studio.store.exportJSON()).changes.length,'Active changes remain available in an explicit handoff export');
  const savedContext=clone(saved.context);
  env.click(ui('[data-review-action="resolve-comment"]'));assert.equal(studio.store.snapshot().comments.at(-1).resolved,true);
  jsonEqual(studio.store.snapshot().comments.at(-1).context,savedContext,'Resolving preserves precise comment context');
  env.click(ui('[data-review-mode="tweak"]'));
  unregisterCommand();assert.equal(command.style.width,'','Unregister restores preview width');assert.equal(command.style.marginInline,'','Unregister restores preview margins');command.innerHTML=F.commandMenuPreview(F.defaults(F.current));
  unregisterCommand=studio.register(command,F.current,F.defaults(F.current),'Command');studio.pageChanged();
  currentCard=command.querySelector('.pp-command-card');assert.equal(currentCard.style.getPropertyValue('--pp-component-command-radius'),F.v('radius.2xl'),'Scoped draft replays after route render');
  env.click(currentCard);env.click(actionControl('reset-part'));assert.equal(currentCard.style.getPropertyValue('--pp-component-command-radius'),'');
  // Existing atom nodes and listeners survive variant and icon changes.
  const buttonItem=F.byId.button;F.current=buttonItem;env.window.location.hash='#button/overview';
  const buttonConfig={...F.defaults(buttonItem),variant:'secondary',size:'sm',icon:'leading',iconName:'plus'};
  const unregisterAction=studio.register(actionStage,buttonItem,buttonConfig,'Action');studio.pageChanged();
  let clicks=0;action.addEventListener('click',()=>clicks++);
  env.click(action);assert.equal(clicks,0,'Picker consumes specimen activation while enabled');assert.equal(studio.snapshot().selected.kind,'button');
  const styleMap=element=>Object.fromEntries(Array.from({length:element.style.length},(_,i)=>{const name=element.style.item(i);return[name,element.style.getPropertyValue(name)];}));
  const originalActionStyle=styleMap(action),originalIcon=action.querySelector('svg');
  env.change(control('variant'),'destructive');assert.equal(actionStage.querySelector('button'),action);assert.ok(action.classList.contains('destructive'));
  assert.equal(control('icon'),null,'Icon selection uses identifiable glyph buttons rather than a second ambiguous list');
  const iconChoice=name=>ui('[data-review-icon-choice="'+name+'"]');
  assert.ok(iconChoice('search').querySelector('svg.hugeicon'),'Icon choices show the actual library glyph');
  assert.notEqual(iconChoice('search').getAttribute('aria-label'),iconChoice('close').getAttribute('aria-label'),'Different glyphs have different accessible names');
  env.input(ui('[data-review-icon-search]'),'search');
  assert.equal(iconChoice('search').hidden,false);assert.equal(iconChoice('close').hidden,true,'Search filters the grid without replacing its input');
  env.click(iconChoice('search'));assert.equal(action.querySelector('svg').dataset.hugeicon,F.icons.search.name);assert.equal(actionStage.querySelector('button'),action);assert.equal(iconChoice('search').getAttribute('aria-pressed'),'true','The visible icon choice agrees with the changed specimen');
  assert.equal(ui('[data-review-icon-search]').value,'search','An applied choice preserves the current icon search');
  env.input(ui('[data-review-icon-search]'),'does-not-exist');assert.ok(Array.from(document.querySelectorAll('[data-review-icon-choice]')).every(choice=>choice.hidden));assert.equal(ui('[data-review-icon-empty]').hidden,false);
  env.input(ui('[data-review-icon-search]'),'');env.click(iconChoice('close'));assert.equal(action.querySelector('svg').dataset.hugeicon,F.icons.close.name,'The same selected icon can be changed repeatedly');
  env.click(iconChoice('search'));assert.equal(action.querySelector('svg').dataset.hugeicon,F.icons.search.name);
  env.click(action.querySelector('svg'));assert.equal(studio.snapshot().selected.kind,'icon');
  env.input(ui('[data-review-icon-search]'),'');env.click(iconChoice('check'));assert.equal(action.querySelector('svg').dataset.hugeicon,F.icons.check.name,'A nested glyph edit replaces the button-level proposal');
  assert.equal(studio.store.snapshot().changes.filter(change=>change.property==='icon').length,1,'One glyph has one coalesced proposal');
  env.click(action);assert.equal(studio.snapshot().selected.kind,'button');
  env.click(actionControl('pick'));env.click(action);assert.equal(clicks,1,'Normal click listener survives review changes');
  const offKey=env.key(action,'Enter');assert.equal(offKey.defaultPrevented,false,'Keyboard events pass through when picker is off');
  env.click(actionControl('pick'));action.focus();const pickKey=env.key(action,'Enter');assert.equal(pickKey.defaultPrevented,true);assert.equal(studio.snapshot().selected.kind,'button');
  env.click(actionControl('reset-part'));jsonEqual(styleMap(action),originalActionStyle);assert.equal(action.querySelector('svg'),originalIcon,'Reset restores the original glyph node');assert.ok(action.classList.contains('secondary'));
  env.change(control('variant'),'primary');
  const otherConfig={...buttonConfig,size:'lg'},otherStage=env.stage(F.button(otherConfig,'Other button'),'other-config');
  const unregisterOther=studio.register(otherStage,buttonItem,otherConfig,'Other');assert.ok(otherStage.querySelector('button').classList.contains('secondary'),'Another config does not inherit draft');
  env.click(actionControl('compare'));env.click(actionControl('reset-all'));assert.equal(actionControl('compare').disabled,false,'Compare remains escapable after the last draft is reset');env.click(actionControl('compare'));assert.equal(studio.snapshot().compare,false);assert.equal(studio.store.snapshot().changes.length,0);assert.ok(action.classList.contains('secondary'));
  env.change(control('variant'),'destructive');env.change(control('radius'),'radius.full');env.input(ui('[data-review-icon-search]'),'');env.click(iconChoice('search'));
  assert.ok(action.classList.contains('destructive'));assert.equal(action.querySelector('svg').dataset.hugeicon,F.icons.search.name);
  const stopPicking=env.key(action,'Escape');assert.equal(stopPicking.defaultPrevented,true);assert.equal(studio.snapshot().picking,false);assert.equal(studio.snapshot().open,true,'Escape stops picking without hiding edits');
  assert.ok(studio.store.snapshot().changes.length,'Stopping the picker preserves the open preview');
  const escape=env.key(action,'Escape');assert.equal(escape.defaultPrevented,true);assert.equal(studio.snapshot().open,false);assert.equal(document.body.classList.contains('review-open'),false,'Closing returns the preview to its full width');assert.equal(document.activeElement,launch,'Closing restores launcher focus');
  assert.equal(studio.store.snapshot().changes.length,0,'Closing discards temporary appearance changes');jsonEqual(styleMap(action),originalActionStyle,'Closing restores every changed inline style');assert.ok(action.classList.contains('secondary'),'Closing restores the original button variant');assert.equal(action.querySelector('svg'),originalIcon,'Closing restores the original icon node');assert.equal(studio.store.snapshot().comments.length,1,'Closing preserves saved comments');
  env.click(launch);assert.equal(studio.store.snapshot().changes.length,0,'A fresh editor session starts without appearance changes');assert.ok(action.classList.contains('secondary'));assert.equal(action.querySelector('svg'),originalIcon);env.click(actionControl('close'));
  env.click(action);assert.equal(clicks,2,'Closed studio does not intercept events');
  assert.equal(JSON.stringify(F.tokens),tokensBefore,'All interactive changes leave canonical tokens unchanged');
  unregisterOther();unregisterAction();unregisterCommand();studio.destroy();
  assert.equal(document.querySelector('#review-studio-host'),null);assert.equal(document.querySelector('[data-review-selected]'),null);assert.ok(!document.body.classList.contains('review-picking'));
  env.click(launch);assert.equal(document.querySelector('#review-studio-host'),null,'Destroyed launcher handler stays detached');env.click(action);assert.equal(clicks,3);
  // Invalid contracts are rejected before a stylesheet or executable string is created.
  assert.throws(()=>F.reviewValidateChange(savedLocator,'radius','space.8'));
  assert.throws(()=>F.reviewValidateChange(savedLocator,'padding','radius.8'));
  assert.throws(()=>F.reviewValidateLocator({...savedLocator,anchor:{version:1,kind:'icon',index:0}}));
  assert.throws(()=>F.reviewValidateLocator({...savedLocator,anchor:{...savedLocator,anchor:savedLocator}}));
  const trailingStage=env.stage(F.button({...buttonConfig,icon:'trailing'},'Trailing'));
  assert.equal(F.reviewDescribe(trailingStage.querySelector('button'),trailingStage).config.icon,'trailing');
  const inputStage=env.stage('<span class="pp-input-icon">'+F.icon('search',16)+'<input class="pp-input"></span>');
  assert.equal(F.reviewDescribe(inputStage.querySelector('input'),inputStage).properties.find(x=>x.id==='padding').apply.name,'padding-right');
  assert.throws(()=>F.reviewValidateChange(actionTarget.locator,'variant','invented'));
  assert.throws(()=>F.reviewValidateChange(actionTarget.locator,'icon','unregistered-icon'));
  F.current=F.byId['command-menu'];env.window.location.hash='#command-menu/overview';
  const warningStudio=F.createReviewStudio({document,store:failing});warningStudio.register(command,F.byId['command-menu'],F.defaults(F.byId['command-menu']));warningStudio.open('comments');assert.match(document.querySelector('#review-studio-host').textContent,/memory/i);
  const importedFile=new env.window.File([base.exportJSON()],'review.json',{type:'application/json'});
  const importControl=document.querySelector('#review-studio-host [data-review-import]');
  Object.defineProperty(importControl,'files',{configurable:true,value:[importedFile]});
  importControl.dispatchEvent(new env.window.Event('change',{bubbles:true}));
  await new Promise(resolve=>setTimeout(resolve,0));
  assert.ok(failing.snapshot().changes.some(change=>change.value==='radius.2xl'),'File import control merges a valid backup');
  assert.equal(command.querySelector('.pp-command-card').style.getPropertyValue('--pp-component-command-radius'),F.v('radius.2xl'),'Valid file import replays a named token change');
  const beforeInvalidFile=failing.snapshot(),maliciousFile=new env.window.File([invalidBackup(entry=>entry.target.selector='body')],'invalid.json',{type:'application/json'});
  Object.defineProperty(document.querySelector('#review-studio-host [data-review-import]'),'files',{configurable:true,value:[maliciousFile]});
  document.querySelector('#review-studio-host [data-review-import]').dispatchEvent(new env.window.Event('change',{bubbles:true}));
  await new Promise(resolve=>setTimeout(resolve,0));jsonEqual(failing.snapshot(),beforeInvalidFile,'Invalid UI file import is atomic');assert.equal(env.window.__reviewExecuted,undefined);
  // A slow file read from the previous editor session must not revive changes.
  const pendingFile=new env.window.File([base.exportJSON()],'pending.json',{type:'application/json'});let finishImport;
  Object.defineProperty(pendingFile,'text',{value:()=>new Promise(resolve=>{finishImport=resolve;})});
  const pendingControl=document.querySelector('#review-studio-host [data-review-import]');Object.defineProperty(pendingControl,'files',{configurable:true,value:[pendingFile]});pendingControl.dispatchEvent(new env.window.Event('change',{bubbles:true}));
  assert.equal(typeof finishImport,'function');warningStudio.close();warningStudio.open('comments');finishImport(base.exportJSON());await new Promise(resolve=>setTimeout(resolve,0));
  assert.equal(failing.snapshot().changes.length,0,'An import finishing after close cannot repopulate a fresh session');assert.equal(command.querySelector('.pp-command-card').style.getPropertyValue('--pp-component-command-radius'),'');
  warningStudio.destroy();assert.equal(command.querySelector('.pp-command-card').style.getPropertyValue('--pp-component-command-radius'),'','Destroy restores imported styles');
  // Saved proposals with changed source baselines remain visible as pending data.
  for(const [label,original]of [['token',{token:'radius.xl',resolved:F.resolve('radius.xl')}],['resolved value',{token:'component.command.radius',resolved:'999px'}]]){
   const staleStore=F.createReviewStore({temporaryChanges:true,storage:null});staleStore.putChange({...validChange,original});
   const staleStudio=F.createReviewStudio({document,store:staleStore});staleStudio.register(command,F.current,F.defaults(F.current));staleStudio.open();
   assert.equal(staleStudio.snapshot().pendingCount,1,'Changed '+label+' baseline stays pending');
   assert.equal(command.querySelector('.pp-command-card').style.getPropertyValue('--pp-component-command-radius'),'','Changed '+label+' baseline is not silently overwritten');
   assert.equal(staleStore.snapshot().changes.length,1,'Pending change remains exportable');assert.match(document.querySelector('#review-studio-host').textContent,/1 unavailable/);staleStudio.destroy();
  }
  F.current=buttonItem;env.window.location.hash='#button/overview';
  const buttonContext=F.reviewContext({componentId:'button',section:'overview',config:buttonConfig});
  for(const [property,value,originalValue]of [['variant','destructive','primary'],['icon','check','search']]){
   const staleStore=F.createReviewStore({temporaryChanges:true,storage:null});staleStore.putChange({context:buttonContext,target:actionTarget.locator,property,value,original:{value:originalValue}});
   const staleStudio=F.createReviewStudio({document,store:staleStore});staleStudio.register(actionStage,buttonItem,buttonConfig);staleStudio.open();
   assert.equal(staleStudio.snapshot().pendingCount,1,'Changed '+property+' baseline stays pending');assert.ok(action.classList.contains('secondary'));assert.equal(action.querySelector('svg'),originalIcon);staleStudio.destroy();
  }
 }finally{await env.close();}
}
async function applicationRun(){
 const {Window}=await import(path.join(root,'vendor/spectrum-toast/node_modules/happy-dom/lib/index.js'));
 const window=new Window({url:'https://forma.test/#command-menu/overview',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true}}),document=window.document;
 const html=fs.readFileSync(path.join(dist,'index.html'),'utf8'),errors=[];
 window.addEventListener('error',event=>errors.push(event.error));
 // DOM simulation uses Motion's JS fallback; happy-dom's WAAPI cancel implementation
 // rejects finished promises even during normal React/Motion cleanup.
 window.Element.prototype.animate=undefined;
 document.documentElement.innerHTML=html.replace(/<!doctype[^>]*>/i,'').replace(/<script[\s\S]*?<\/script>/g,'').replace(/<link[^>]*>/g,'');
 const css=[...html.matchAll(/<link rel="stylesheet" href="([\w.-]+\.css)">/g)].map(match=>fs.readFileSync(path.join(dist,match[1]),'utf8')).join('\n');
 const style=document.createElement('style');style.textContent=css;document.head.append(style);
 const scripts=[...html.matchAll(/<script src="([\w.-]+\.js)"><\/script>/g)].map(match=>match[1]);
 try{
  window.eval(scripts.map(file=>fs.readFileSync(path.join(dist,file),'utf8')).join('\n;\n'));
  const F=window.Forma,studio=F.reviewStudio;assert.ok(studio,'Real app mounts review studio before initial route wiring');
  assert.equal(F.current.id,'command-menu');
  const launch=document.querySelector('[data-review-open="tweak"]');assert.ok(launch);launch.click();
  assert.ok(studio.snapshot().targets.length,'Initial page wired its real preview roots');
  let card=document.querySelector('#live-preview .pp-command-card');assert.ok(card);const originalRadius=window.getComputedStyle(card).borderRadius;card.click();
  const radius=document.querySelector('[data-review-field="radius"]');assert.ok(radius);radius.value='radius.2xl';radius.dispatchEvent(new window.Event('change',{bubbles:true}));
  assert.equal(card.style.getPropertyValue('--pp-component-command-radius'),F.v('radius.2xl'));
  assert.equal(window.getComputedStyle(card).borderRadius,F.resolve('radius.2xl'),'Actual loaded stylesheet consumes the scoped token');
  const navigate=async hash=>{window.location.hash=hash;await new Promise(resolve=>setTimeout(resolve,35));};
  await navigate('#button/overview');assert.equal(F.current.id,'button');assert.ok(document.querySelector('#live-preview .pp-button'));assert.ok(studio.snapshot().targets.length);
  await navigate('#command-menu/overview');assert.equal(F.current.id,'command-menu');card=document.querySelector('#live-preview .pp-command-card');
  assert.equal(card.style.getPropertyValue('--pp-component-command-radius'),F.v('radius.2xl'),'App hash router retains a temporary change while the editor stays open');
  assert.equal(window.getComputedStyle(card).borderRadius,F.resolve('radius.2xl'));
  document.querySelector('[data-review-action="close"]').click();assert.equal(studio.snapshot().open,false);
  assert.equal(card.style.getPropertyValue('--pp-component-command-radius'),'','Closing removes the scoped override in the real app');assert.equal(window.getComputedStyle(card).borderRadius,originalRadius,'The actual stylesheet returns to its source radius');assert.equal(studio.store.snapshot().changes.length,0);
  document.querySelector('[data-review-open="tweak"]').click();assert.equal(window.getComputedStyle(card).borderRadius,originalRadius,'Reopening starts from the source appearance');assert.equal(studio.store.snapshot().changes.length,0);document.querySelector('[data-review-action="close"]').click();
  assert.deepEqual(errors,[],'Full index script order and app events produce no uncaught errors');
 }finally{window.Forma?.clearPreviews?.();window.Forma?.clearCovers?.();window.Forma?.reviewStudio?.destroy();await window.happyDOM.abort();window.close();}
}
run().then(applicationRun).then(()=>console.log(JSON.stringify({status:'passed',scope:'drawer controls, visual icon grid and search, repeated scoped edits, details/focus lifecycle, persistence, validated import, comments and full index/router/CSS integration (happy-dom; browser verified separately)'}))).catch(error=>{console.error(error);process.exitCode=1;});
