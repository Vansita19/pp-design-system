/* Token-only local review. Preview mutations are restored before replay and never edit F.tokens. */
(function(F){
 F.createReviewStudio=(options={})=>{
  const doc=options.document||document,win=doc.defaultView||window,store=options.store||F.createReviewStore({temporaryChanges:true}),roots=new Map();
  const host=doc.createElement('div');host.id='review-studio-host';doc.body.append(host);
  let open=false,mode='tweak',picking=false,compare=false,selected=null,draft='',notice='',commentFilter='open',focusBack=null,disposed=false,hovered=null,pendingLocate=null,renderQueued=false,session=0;
  const restorations=new Map(),pending=new Set(),listeners=[],inertParts=new Map(),iconSearch={};
  const syncPicking=()=>{for(const [element,value]of inertParts){element.inert=value;inertParts.delete(element);}if(open&&picking)for(const root of roots.keys())for(const element of root.querySelectorAll('[inert]')){inertParts.set(element,element.inert);element.inert=false;}};
  const listen=(node,type,fn,capture=false)=>{node.addEventListener(type,fn,capture);listeners.push(()=>node.removeEventListener(type,fn,capture));};
  const contextOf=root=>roots.get(root)?.context;
  const remember=element=>{if(!restorations.has(element))restorations.set(element,{root:[...roots.keys()].find(root=>root===element||root.contains(element)),styles:new Map(),classes:new Map(),icons:[]});return restorations.get(element);};
  const style=(element,name,value,priority='')=>{const saved=remember(element);if(!saved.styles.has(name))saved.styles.set(name,[element.style.getPropertyValue(name),element.style.getPropertyPriority(name)]);element.style.setProperty(name,value,priority);};
  const className=(element,name,on)=>{const saved=remember(element);if(!saved.classes.has(name))saved.classes.set(name,element.classList.contains(name));element.classList.toggle(name,on);};
  const restore=root=>{for(const [element,saved]of [...restorations].reverse()){if(saved.root!==root&&element!==root&&!root.contains(element)&&!saved.icons.some(x=>root.contains(x.current)))continue;for(const icon of saved.icons)if(icon.current.parentNode)icon.current.replaceWith(icon.original);for(const [name,[value,priority]]of saved.styles){if(value)element.style.setProperty(name,value,priority);else element.style.removeProperty(name);}for(const [name,on]of saved.classes)element.classList.toggle(name,on);restorations.delete(element);}};
  const describe=()=>{const root=selected?.root;if(!root||!roots.has(root))return null;const el=F.reviewFind(root,selected.locator);return el?F.reviewDescribe(el,root):null;};
  const selectedContext=()=>contextOf(selected?.root)||[...roots.values()].find(x=>(x.context.pageId||x.context.componentId)===F.current?.id)?.context||null;
  const sameTarget=(a,b)=>F.reviewStable(a)===F.reviewStable(b);
  const iconChange=(element,key)=>{
   const old=element.matches('svg[data-hugeicon]')?element:element.querySelector('svg[data-hugeicon]');if(!old)throw Error('This element has no editable library icon.');
   const template=doc.createElement('template');template.innerHTML=F.icon(key,Number(old.getAttribute('width'))||16);const next=template.content.firstElementChild;
   for(const name of ['class','style','role','aria-label'])if(old.hasAttribute(name))next.setAttribute(name,old.getAttribute(name));
   const saved=remember(element);old.replaceWith(next);saved.icons.push({original:old,current:next});
  };
  const apply=(element,property,value,description)=>{
   const spec=property.apply;
   if(property.type==='token'){
    F.reviewValidateChange(description.locator,property.id,value);
    style(element,spec.name,F.v(value),spec.priority||'');
   }else if(spec.kind==='button-variant'){
    const config={...(description.config||{}),variant:value};
    config.size=config.size||(['sm','md','lg'].find(x=>element.classList.contains('size-'+x))||'md');
    config.state=config.state||(['disabled','loading','success','hover','pressed','focus'].find(x=>element.classList.contains('state-'+x))||'default');
    config.icon=element.classList.contains('icon-only')?'only':element.querySelector('svg[data-hugeicon]')?'leading':'none';
    if(element.closest('.pp-action-pill'))config.surface='inverse';
    for(const [key,id]of Object.entries(F.buttonTokens(config)))if(['bg','fg','border','shadow','hover','active','focus','underlineOffset','underlineWidth'].includes(key))style(element,'--demo-button-'+key,F.v(id));
    for(const variant of ['primary','secondary','outline','ghost','destructive','success','link'])className(element,variant,variant===value);
   }else if(['icon','button-icon'].includes(spec.kind)||property.type==='icon')iconChange(element,value);
  };
  const replayChanges=root=>{
   restore(root);if(!open||compare)return;
   const ctx=contextOf(root);if(!ctx)return;
   const changes=store.snapshot().changes.filter(x=>x.context.exampleKey===ctx.exampleKey).sort((a,b)=>(a.property==='variant'?-1:0)-(b.property==='variant'?-1:0));
   // Inspect original values before applying any proposals; a changed source stays pending.
   const ready=changes.map(change=>{const element=F.reviewFind(root,change.target),description=element&&F.reviewDescribe(element,root),property=description?.properties.find(x=>x.id===change.property);return {change,element,description,property};});
   const iconCounts=new Map();for(const entry of ready)if(entry.property?.type==='icon'){entry.glyph=entry.element.matches('svg[data-hugeicon]')?entry.element:entry.element.querySelector('svg[data-hugeicon]');if(entry.glyph)iconCounts.set(entry.glyph,(iconCounts.get(entry.glyph)||0)+1);}
   for(const {change,element,description,property,glyph}of ready){
    if(glyph&&iconCounts.get(glyph)>1){pending.add(change.id);continue;}
    if(!element||!property){pending.add(change.id);continue;}
    const original=change.original||{},changedBase=original.token?(property.token!==original.token||(original.resolved&&String(F.resolve(property.token))!==original.resolved)):(original.value&&property.type!=='token'&&property.value!==original.value);
    if(changedBase){pending.add(change.id);continue;}
    try{F.reviewValidateChange(change.target,change.property,change.value);apply(element,property,change.value,description);pending.delete(change.id);}catch{pending.add(change.id);}
   }
  };
  const replay=root=>{
   const observer=roots.get(root)?.observer;observer?.disconnect();
   try{replayChanges(root);}finally{if(roots.has(root))observer?.observe(root,{childList:true,subtree:true});}
  };
  const replayAll=()=>{pending.clear();for(const root of roots.keys())replay(root);markSelected();};
  const markSelected=()=>{doc.querySelectorAll('[data-review-selected]').forEach(el=>el.removeAttribute('data-review-selected'));if(open){const el=selected&&F.reviewFind(selected.root,selected.locator);el?.setAttribute('data-review-selected','true');}};
  const clearHover=()=>{hovered?.removeAttribute('data-review-hover');hovered=null;};
  const targetList=()=>{
   const list=[];const complete=()=>{const d=describe();if(d&&!list.some(x=>x.root===selected.root&&sameTarget(x.description.locator,d.locator)))list.push({root:selected.root,description:d,label:d.label});return list;};for(const [root,entry]of roots){if(F.current&&(entry.context.pageId||entry.context.componentId)!==F.current.id)continue;const seen=new Set();for(const descriptor of F.reviewTargets.descriptors){for(const element of descriptor.selector?[...(root.matches(descriptor.selector)?[root]:[]),...root.querySelectorAll(descriptor.selector)]:[root]){if(element.closest('[hidden]'))continue;const d=F.reviewDescribe(element,root,{metadataOnly:true});if(!d)continue;const key=F.reviewStable(d.locator);if(seen.has(key))continue;seen.add(key);list.push({root,description:d,label:(roots.size>1?entry.label.replace(/^./,letter=>letter.toUpperCase())+' · ':'')+d.label});if(list.length>=200)return complete();}}}return complete();
  };
  const snapshot=()=>{
   const data=store.snapshot(),d=describe(),ctx=selectedContext(),list=targetList();
   const currentChanges=selected?data.changes.filter(x=>x.context.exampleKey===ctx?.exampleKey&&(sameTarget(x.target,selected.locator)||(d?.kind==='button'&&x.property==='icon'&&d.element.contains(F.reviewFind(selected.root,x.target))))):[];
   const fields=(d?.properties||[]).map(property=>({id:property.id,label:property.label,value:currentChanges.find(x=>x.property===property.id)?.value||property.token||property.value||'',options:(property.type==='token'?F.reviewTokenChoices(property):property.type==='icon'?F.reviewTargets.icons:property.options||F.reviewTargets.buttonVariants||[]).map(x=>typeof x==='string'?{value:x,label:x}:{value:x.id??x.value,label:property.type==='token'?(x.label||x.id)+' · '+F.resolve(x.id):x.label||x.name||x.id}),changed:currentChanges.some(x=>x.property===property.id)}));
   return {open,mode,picking,compare,iconSearch:{...iconSearch},componentName:ctx?.componentName||F.current?.name||'Design system',selected:d?{...d,id:d.locator.kind}:null,fields,targets:list.map((x,index)=>({value:String(index),label:x.label})),selectedTarget:String(list.findIndex(x=>x.root===selected?.root&&sameTarget(x.description.locator,selected?.locator))),previewWidth:ctx?.previewWidth||'fit',comments:data.comments.map(x=>({...x,targetLabel:x.targetLabel,contextLabel:(x.context.pageName||x.context.componentName)+' · '+x.context.section+(x.context.exampleLabel?' · '+x.context.exampleLabel:''),status:x.resolved?'resolved':'open'})),draft,commentFilter,notice,storageWarning:store.warning(),durable:!store.warning(),earlierChangeCount:store.earlierChangeCount?.()||0,changeCount:data.changes.length,pendingCount:pending.size,feedback:''};
  };
  const render=()=>{
   if(disposed)return;
   const scroll=host.querySelector('.review-panel-scroll')?.scrollTop||0,gridScroll=host.querySelector('.review-icon-grid')?.scrollTop||0,active=doc.activeElement;
   const focusAttribute=['data-review-field','data-review-target','data-review-icon-search','data-review-icon-choice','data-review-action','data-review-mode','data-review-comment-filter','data-review-draft'].find(name=>host.contains(active)&&active.hasAttribute?.(name)),focusValue=focusAttribute&&active.getAttribute(focusAttribute),commentId=active?.getAttribute?.('data-review-comment'),selection=focusAttribute==='data-review-icon-search'?[active.selectionStart,active.selectionEnd]:null;
   const disclosures=[...host.querySelectorAll('[data-review-details][open]')].map(el=>el.dataset.reviewDetails);
   host.innerHTML=F.reviewPanelHTML(snapshot());
   for(const name of disclosures)host.querySelector('[data-review-details="'+name+'"]')?.setAttribute('open','');
   const scroller=host.querySelector('.review-panel-scroll');if(scroller)scroller.scrollTop=scroll;const grid=host.querySelector('.review-icon-grid');if(grid)grid.scrollTop=gridScroll;
   syncPicking();
   if(focusAttribute){const control=[...host.querySelectorAll('['+focusAttribute+']')].find(el=>el.getAttribute(focusAttribute)===focusValue&&(!commentId||el.getAttribute('data-review-comment')===commentId));control?.focus({preventScroll:true});if(selection&&control?.setSelectionRange&&selection[0]!==null)control.setSelectionRange(...selection);}
   doc.querySelectorAll('[data-review-open]').forEach(button=>{button.setAttribute('aria-expanded',String(open&&button.dataset.reviewOpen===mode));const count=button.querySelector('[data-review-count]');if(count)count.textContent=String(store.snapshot().comments.filter(x=>!x.resolved).length);});
   doc.body.classList.toggle('review-open',open);doc.body.classList.toggle('review-picking',open&&picking);markSelected();
  };
  const scheduleRender=()=>{if(renderQueued)return;renderQueued=true;win.queueMicrotask(()=>{renderQueued=false;if(!disposed)render();});};
  const select=(root,element)=>{const description=F.reviewDescribe(element,root);if(!description)return false;selected={root,locator:description.locator};notice='';clearHover();render();return true;};
  const firstSelection=()=>{if(describe())return;const list=targetList();const preferred=list.filter(x=>F.reviewTargets.descriptors.find(d=>d.id===x.description.kind)?.surface).sort((a,b)=>a.description.breadcrumb.length-b.description.breadcrumb.length)[0]||list.find(x=>x.description.kind==='preview')||list[0];if(preferred)selected={root:preferred.root,locator:preferred.description.locator};};
  const openPanel=(next='tweak')=>{focusBack=doc.activeElement;if(!open)session++;open=true;mode=next;picking=next==='tweak';firstSelection();replayAll();render();(next==='comments'?host.querySelector('[data-review-draft]'):host.querySelector('[data-review-action="pick"]'))?.focus();};
  const close=()=>{session++;open=false;picking=false;compare=false;notice='';store.resetChanges();clearHover();replayAll();for(const [root,entry]of roots){root.style.width=entry.width;root.style.marginInline=entry.margin;entry.context.previewWidth='fit';}render();if(focusBack?.isConnected)focusBack.focus();};
  const iconElement=element=>element?.matches('svg[data-hugeicon]')?element:element?.querySelector('svg[data-hugeicon]');
  const setValue=(id,value)=>{
   if(!open)return;
   if(compare){notice='Return to your draft before changing it.';render();return;}
   const d=describe(),ctx=selectedContext();if(!d||!ctx)return;
   const property=d.properties.find(x=>x.id===id);if(!property)throw Error('Select an editable element.');
   F.reviewValidateChange(d.locator,id,value);
   if(property.type==='icon'&&F.icons[value]?.name===iconElement(d.element)?.getAttribute('data-hugeicon')){notice='This icon is already selected.';render();return;}
   let original={token:property.token||'',value:property.value||'',resolved:property.token?F.resolve(property.token):property.value||''};
   // The same glyph can be reached through its button or directly. Keep one proposal.
   if(property.type==='icon'){
    const glyph=iconElement(d.element),overlaps=store.snapshot().changes.filter(x=>x.context.exampleKey===ctx.exampleKey&&x.property==='icon'&&iconElement(F.reviewFind(selected.root,x.target))===glyph);
    if(overlaps.length){original=overlaps[0].original;const ids=new Set(overlaps.map(x=>x.id));store.resetChanges(x=>ids.has(x.id));}
   }
   store.putChange({context:ctx,target:d.locator,targetLabel:d.label,property:id,value,original});replayAll();const unavailable=store.snapshot().changes.some(change=>change.context.exampleKey===ctx.exampleKey&&sameTarget(change.target,d.locator)&&change.property===id&&pending.has(change.id));notice=unavailable?'This part has changed since it was saved. Reset it and try again.':(property.type==='icon'?'Icon changed in the preview.':property.label+' updated in the preview.');render();
  };
  const download=(earlier=false)=>{const blob=new win.Blob([earlier?store.exportEarlierJSON():store.exportJSON()],{type:'application/json'});if(!win.URL.createObjectURL){notice='Downloads are unavailable here. Use Copy feedback instead.';render();return;}const url=win.URL.createObjectURL(blob),a=doc.createElement('a');a.href=url;a.download='pitch-protocol-'+(earlier?'earlier-drafts-':'review-')+new Date().toISOString().slice(0,10)+'.json';doc.body.append(a);a.click();a.remove();win.setTimeout(()=>win.URL.revokeObjectURL(url),1000);notice=earlier?'Earlier drafts downloaded. They do not change the preview.':'Current preview and comments downloaded.';render();};
  const copyFeedback=async()=>{const value=store.feedback();try{await win.navigator.clipboard.writeText(value);notice='Copied. Paste this batch into your Codex chat.';}catch{const area=doc.createElement('textarea');area.value=value;area.setAttribute('aria-label','Review feedback to copy');doc.body.append(area);area.select();let ok=false;try{ok=doc.execCommand('copy');}catch{}area.remove();notice=ok?'Copied. Paste this batch into your Codex chat.':'Copy is unavailable. Download the JSON backup and attach it to your chat.';}render();};
  const locate=comment=>{
   const root=[...roots.keys()].find(root=>contextOf(root).exampleKey===comment.context.exampleKey);
   if(root){const width=comment.context.previewWidth;roots.get(root).context.previewWidth=width;root.style.width=width==='fit'?'':'min(100%, '+width+'px)';root.style.marginInline='auto';selected=comment.target?{root,locator:comment.target}:null;open=true;mode='comments';if(comment.target&&!F.reviewFind(root,comment.target))notice='This part has changed. Review the saved page and comment before applying it.';render();(comment.target?F.reviewFind(root,comment.target):root)?.scrollIntoView?.({block:'center'});}
   else{pendingLocate=comment;win.location.hash=comment.context.route;}
  };
  const click=event=>{
   const launcher=event.target.closest?.('[data-review-open]');if(launcher){event.preventDefault();openPanel(launcher.dataset.reviewOpen);return;}
   if(!host.contains(event.target))return;
   const modeButton=event.target.closest('[data-review-mode]');if(modeButton){notice='';mode=modeButton.dataset.reviewMode;picking=mode==='tweak';render();return;}
   const iconChoice=event.target.closest('[data-review-icon-choice]');if(iconChoice){try{setValue(iconChoice.dataset.reviewIconProperty||'icon',iconChoice.dataset.reviewIconChoice);}catch(error){notice=error.message;render();}return;}
   const button=event.target.closest('[data-review-action]');if(!button)return;
   try{const action=button.dataset.reviewAction,id=button.dataset.reviewComment;
    if(action==='close')close();else if(action==='pick'){picking=!picking;render();}
    else if(action==='ancestor'){const d=describe(),part=d?.breadcrumb?.[Number(button.dataset.reviewAncestor)];if(part?.locator){selected.locator=part.locator;render();}}
    else if(action==='compare'){notice='';compare=!compare;replayAll();render();}
    else if(action==='reset-part'){const ctx=selectedContext();if(selected&&ctx){const d=describe();store.resetChanges(x=>x.context.exampleKey===ctx.exampleKey&&(sameTarget(x.target,selected.locator)||(d?.kind==='button'&&x.property==='icon'&&d.element.contains(F.reviewFind(selected.root,x.target)))));}notice='This part is back to its original appearance.';replayAll();render();}
    else if(action==='reset-all'){store.resetChanges();notice='All appearance changes have been reset.';replayAll();render();}
    else if(action==='add-comment'){const ctx=selectedContext();if(!ctx)throw Error('Open a component preview first.');store.addComment({context:ctx,target:selected?.locator||null,targetLabel:describe()?.label||'Whole example',text:draft});draft='';notice='Comment saved with its exact page and state.';render();}
    else if(action==='resolve-comment'){const item=store.snapshot().comments.find(x=>x.id===id);if(item)store.updateComment(id,{resolved:!item.resolved});render();}
    else if(action==='delete-comment'){store.deleteComment(id);render();}
    else if(action==='locate-comment'){const item=store.snapshot().comments.find(x=>x.id===id);if(item)locate(item);}
    else if(action==='copy')copyFeedback();else if(action==='download')download();else if(action==='download-earlier')download(true);else if(action==='import')host.querySelector('[data-review-import]')?.click();
   }catch(error){notice=error.message;render();}
  };
  const change=async event=>{const el=event.target;if(!host.contains(el))return;try{
   if(el.hasAttribute('data-review-field'))setValue(el.dataset.reviewField,el.value);
   else if(el.hasAttribute('data-review-target')){const entry=targetList()[Number(el.value)];if(entry){select(entry.root,entry.description.element);entry.description.element.scrollIntoView?.({block:'center',inline:'nearest'});}}
   else if(el.hasAttribute('data-review-width')){const root=selected?.root,value=el.value==='fit'?'fit':Number(el.value);if(root&&['fit',320,480,768].includes(value)){roots.get(root).context.previewWidth=value;root.style.width=value==='fit'?'':'min(100%, '+value+'px)';root.style.marginInline='auto';render();}}
   else if(el.hasAttribute('data-review-comment-filter')){commentFilter=el.value;render();}
   else if(el.hasAttribute('data-review-import')){const file=el.files?.[0];if(!file)return;if(file.size>2000000)throw Error('Backup is too large.');const importSession=session,raw=await file.text();if(disposed||!open||session!==importSession)return;store.importJSON(raw);notice='Backup opened as a temporary preview. Comments are saved separately.';replayAll();render();}
  }catch(error){notice=error.message;render();}};
  const rootFor=element=>[...roots.keys()].find(root=>root.contains(element));
  const pick=event=>{if(!open||!picking||host.contains(event.target))return;const root=rootFor(event.target);if(!root)return;event.preventDefault();event.stopImmediatePropagation();select(root,event.target);};
  const hover=event=>{if(!open||!picking||host.contains(event.target))return;const root=rootFor(event.target),d=root&&F.reviewDescribe(event.target,root);clearHover();if(d?.element){hovered=d.element;hovered.setAttribute('data-review-hover','true');}};
  listen(doc,'click',pick,true);listen(doc,'pointerdown',event=>{if(open&&picking&&rootFor(event.target)){event.preventDefault();event.stopImmediatePropagation();}},true);
  listen(doc,'pointerover',hover);listen(doc,'click',click);listen(host,'change',change);listen(host,'input',event=>{if(event.target.hasAttribute('data-review-icon-search')){const property=event.target.dataset.reviewIconSearch,query=event.target.value;iconSearch[property]=query;const filter=query.toLowerCase().trim();const grid=host.querySelector('.review-icon-grid');if(grid)grid.scrollTop=0;let visible=0;for(const choice of host.querySelectorAll('[data-review-icon-choice]')){if(choice.dataset.reviewIconProperty!==property)continue;choice.hidden=Boolean(filter&&!choice.dataset.reviewIconName.includes(filter));if(!choice.hidden)visible++;}const empty=[...host.querySelectorAll('[data-review-icon-empty]')].find(el=>el.dataset.reviewIconEmpty===property);if(empty)empty.hidden=visible>0;}else if(event.target.hasAttribute('data-review-draft')){draft=event.target.value;const add=host.querySelector('[data-review-action="add-comment"]');if(add)add.disabled=!draft.trim();}});
  listen(doc,'keydown',event=>{if(!open)return;if(event.key==='Escape'&&!event.defaultPrevented){event.preventDefault();if(picking){picking=false;clearHover();render();}else close();}else if(picking&&['Enter',' '].includes(event.key)&&rootFor(event.target))pick(event);},true);
  const api={store,open:openPanel,close,select,setValue,snapshot,copyFeedback,
   register(root,item,c,label=''){const ctx=F.reviewContext({componentId:item.id,pageId:F.current?.id||item.id,section:win.location.hash.split('/')[1]?.split('?')[0]||'overview',config:c,exampleLabel:label});const previousOwner=root.getAttribute('data-review-component'),width=root.style.width,margin=root.style.marginInline;root.setAttribute('data-review-component',item.id);const observer=new win.MutationObserver(()=>{if(disposed||!roots.has(root))return;const hasDraft=store.snapshot().changes.some(change=>change.context.exampleKey===ctx.exampleKey);if(hasDraft)replay(root);if(open&&(hasDraft||selected?.root===root)){markSelected();scheduleRender();}});roots.set(root,{context:ctx,label:label||c.variant||c.state||'Example',width,margin,observer});replay(root);if(pendingLocate&&pendingLocate.context.exampleKey===ctx.exampleKey){const comment=pendingLocate;pendingLocate=null;locate(comment);}if(open){firstSelection();scheduleRender();}return()=>{observer.disconnect();restore(root);root.style.width=width;root.style.marginInline=margin;if(previousOwner===null)root.removeAttribute('data-review-component');else root.setAttribute('data-review-component',previousOwner);for(const [element,value]of inertParts)if(root.contains(element)){element.inert=value;inertParts.delete(element);}roots.delete(root);if(selected?.root===root)selected=null;};},
   pageChanged(){if(selected&&!roots.has(selected.root))selected=null;clearHover();if(open)firstSelection();render();},
   destroy(){if(disposed)return;for(const [root,entry]of roots){entry.observer?.disconnect();restore(root);root.style.width=entry.width;root.style.marginInline=entry.margin;}open=false;picking=false;syncPicking();roots.clear();listeners.forEach(fn=>fn());clearHover();doc.querySelectorAll('[data-review-selected]').forEach(el=>el.removeAttribute('data-review-selected'));doc.body.classList.remove('review-picking','review-open');host.remove();disposed=true;}
  };return api;
 };
 F.reviewToolbar=()=>`<div class="review-toolbar" role="group" aria-label="Review this component"><button type="button" class="quiet-button" data-review-open="tweak" aria-expanded="false">${F.icon('settings',14)}Tweak</button><button type="button" class="quiet-button" data-review-open="comments" aria-expanded="false">${F.icon('chat',14)}Comments <span data-review-count>0</span></button></div>`;
 F.mountReviewStudio=()=>F.reviewStudio||(F.reviewStudio=F.createReviewStudio());
})(window.Forma);
