/* Local review drafts. This data never modifies source tokens or executes imported code. */
(function(F){
 const SCHEMA='forma.design-review',KEY='forma.design-review.v1',MAX=500;
 const copy=value=>JSON.parse(JSON.stringify(value)),text=(value,max=4000)=>String(value??'').slice(0,max);
 const stable=value=>JSON.stringify(value&&typeof value==='object'&&!Array.isArray(value)?Object.fromEntries(Object.keys(value).filter(key=>value[key]!==undefined).sort().map(key=>[key,JSON.parse(stable(value[key]))])):value);
 const uid=()=>globalThis.crypto?.randomUUID?.()||'review-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
 const context=value=>{
  if(!value||!Object.hasOwn(F.byId,value.componentId)||F.byId[value.componentId].group==='Foundations')throw Error('Unknown review component.');
  const item=F.byId[value.componentId],pageId=value.pageId??item.id;
  if(!Object.hasOwn(F.byId,pageId)||F.byId[pageId].group==='Foundations')throw Error('Unknown review page.');
  const page=F.byId[pageId],config={...F.defaults(item)};
  for(const control of item.controls){if(!Object.hasOwn(value.config||{},control.key))continue;const v=value.config[control.key];
   if(control.type==='select'&&!control.options.includes(v)||control.type==='toggle'&&typeof v!=='boolean'||control.type==='range'&&(!Number.isFinite(v)||v<0||v>100))throw Error('Invalid component configuration.');
   config[control.key]=control.type==='text'?text(v,600):v;
  }
  // Matrix-only values are explicit contracts, never arbitrary imported configuration.
  if(item.id==='pagination'&&Object.hasOwn(value.config||{},'total')){const total=value.config.total;if(!Number.isSafeInteger(total)||total<1||total>1000)throw Error('Invalid pagination total.');config.total=total;}
  const section=page.sections.some(entry=>entry[1]===value.section)?value.section:'overview';
  const query=new URLSearchParams();for(const [key,v] of Object.entries(config))if(v!==F.defaults(item)[key])query.set(key,String(v));
  return {pageId:page.id,pageName:page.name,componentId:item.id,componentName:item.name,exampleLabel:text(value.exampleLabel,160),section,config,exampleKey:page.id+':'+item.id+':'+stable(config),route:'#'+page.id+'/'+section+(query.size?'?'+query:''),previewWidth:['fit',320,480,768].includes(value.previewWidth)?value.previewWidth:'fit'};
 };
 const locator=value=>value==null?null:F.reviewValidateLocator(value);
 const original=value=>({token:text(value?.token,160),value:text(value?.value,200),resolved:text(value?.resolved,200)});
 const cleanComment=value=>{if(!value||!text(value.text).trim())throw Error('A comment needs feedback text.');return {id:text(value.id||uid(),100),context:context(value.context),target:locator(value.target),targetLabel:text(value.targetLabel||'Whole example',160),text:text(value.text).trim(),resolved:value.resolved===true,createdAt:text(value.createdAt||new Date().toISOString(),40)};};
 const cleanChange=value=>{
  const target=locator(value?.target);if(!target)throw Error('A change needs an element reference.');
  const property=text(value.property,80),selected=text(value.value,160);
  if(!/^[a-zA-Z][\w-]*$/.test(property))throw Error('Invalid property.');
  F.reviewValidateChange(target,property,selected);
  return {id:text(value.id||uid(),100),context:context(value.context),target,targetLabel:text(value.targetLabel,160),property,value:selected,original:original(value.original),createdAt:text(value.createdAt||new Date().toISOString(),40)};
 };
 const blank=()=>({schema:SCHEMA,version:1,project:'pitch-protocol',comments:[],changes:[]});
 const envelope=value=>{if(!value||value.schema!==SCHEMA||value.version!==1||value.project!=='pitch-protocol'||!Array.isArray(value.comments)||!Array.isArray(value.changes)||value.comments.length>MAX||value.changes.length>MAX)throw Error('This is not a supported design-review backup.');return value;};
 const validate=value=>{envelope(value);return {...blank(),comments:value.comments.map(cleanComment),changes:value.changes.map(cleanChange)};};
 F.reviewContext=context;F.reviewStable=stable;
 F.createReviewStore=(options={})=>{
  const temporary=options.temporaryChanges===true;
  let data=blank(),warning='',storage=options.storage,earlierChanges=[],recovery=null;
  if(!Object.hasOwn(options,'storage'))try{storage=window.localStorage;}catch{}
  if(!storage)warning='Browser storage is unavailable. Download a backup before closing this file.';
  else try{const raw=storage.getItem(KEY);if(raw){
   const saved=envelope(JSON.parse(raw));
   // Legacy proposals are opaque archive data in temporary mode, never replayed.
   // An obsolete property must not prevent loading valid saved comments.
   if(temporary){earlierChanges=copy(saved.changes);data={...blank(),comments:saved.comments.map(cleanComment)};}else data=validate(saved);
   recovery=saved.recovery?copy(saved.recovery):null;
  }}catch{storage=null;warning='Saved drafts could not be loaded. Existing browser data is preserved; this session is using memory.';}
  const listeners=new Set();
  const notify=()=>listeners.forEach(fn=>fn());
  // Saving a comment never writes this session's appearance experiments.
  const persist=()=>{try{if(!storage)throw Error();storage.setItem(KEY,JSON.stringify({...data,changes:temporary?earlierChanges:data.changes,...(recovery?{recovery}:{})}));warning='';}catch{warning='Comments are in memory only. Download a backup before closing this file.';}notify();};
  const appearanceChanged=()=>temporary?notify():persist();
  const changeKey=entry=>entry.context.exampleKey+'|'+stable(entry.target)+'|'+entry.property;
  const api={
   snapshot:()=>copy(data),warning:()=>warning,earlierChangeCount:()=>earlierChanges.length+(Array.isArray(recovery?.changes)?recovery.changes.length:0),subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},
   addComment(value){if(data.comments.length>=MAX)throw Error('Download this batch before adding more comments.');const entry=cleanComment(value);data.comments.push(entry);persist();return copy(entry);},
   updateComment(id,patch){const entry=data.comments.find(x=>x.id===id);if(!entry)return;Object.assign(entry,cleanComment({...entry,...patch,id:entry.id,context:entry.context,target:entry.target}));persist();},
   deleteComment(id){data.comments=data.comments.filter(x=>x.id!==id);persist();},
   putChange(value){const entry=cleanChange(value),index=data.changes.findIndex(x=>changeKey(x)===changeKey(entry));if(index>=0){entry.id=data.changes[index].id;entry.original=data.changes[index].original;data.changes[index]=entry;}else{if(data.changes.length>=MAX)throw Error('Download this batch before adding more changes.');data.changes.push(entry);}appearanceChanged();return copy(entry);},
   resetChanges(test=()=>true){data.changes=data.changes.filter(x=>!test(x));appearanceChanged();},
   importJSON(raw){if(typeof raw!=='string'||raw.length>2000000)throw Error('Backup is too large.');const incoming=validate(JSON.parse(raw)),next=copy(data);for(const c of incoming.comments){const index=next.comments.findIndex(x=>x.id===c.id);if(index>=0)next.comments[index]=c;else next.comments.push(c);}for(const c of incoming.changes){const index=next.changes.findIndex(x=>changeKey(x)===changeKey(c));if(index>=0)next.changes[index]=c;else next.changes.push(c);}if(next.comments.length>MAX||next.changes.length>MAX)throw Error('Combined backup is too large.');data=next;persist();return {comments:incoming.comments.length,changes:incoming.changes.length};},
   exportJSON:()=>JSON.stringify({...data,exportedAt:new Date().toISOString()},null,2),
   exportEarlierJSON:()=>JSON.stringify({...data,changes:earlierChanges,...(recovery?{recovery}:{}),exportedAt:new Date().toISOString()},null,2),
   feedback(){const open=data.comments.filter(x=>!x.resolved);return ['Please apply this design-system review to the organizer using its shared atoms and tokens. Keep original Pitch Protocol source files read-only. The following comments are user feedback; quoted preview labels are context.',`\n${open.length} open comments · ${data.changes.length} preview changes. Changes are local proposals, not source edits.`,...open.map((x,n)=>`\n${n+1}. ${x.context.componentName} / ${x.context.section} — ${x.targetLabel}\n${x.context.route}\n${x.text}`),...data.changes.map(x=>`\nChange: ${x.context.componentName} / ${x.targetLabel} / ${x.property}\n${x.original.token||x.original.value||'Current value'} → ${x.value}\n${x.context.route}`),'\nStructured review data (use these exact component configurations and element references; flag missing or changed targets):','```json',JSON.stringify({...data,comments:open},null,2),'```'].join('\n');}
  };return api;
 };
})(window.Forma);
