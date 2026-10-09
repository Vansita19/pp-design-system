/* AlignUI-inspired file selection; local files only, without an upload service. */
(() => {
 const F=window.Forma,E=F.escape,mounted=new WeakMap();let serial=0;
 if(!F.tokens['size.480'])F.addToken('size.480','dimension','480px','extended');
 const aliases={width:'size.480',background:'semantic.surface.default',foreground:'semantic.text.heading',muted:'semantic.text.secondary',border:'semantic.border.strong',hover:'semantic.surface.canvas',active:'semantic.border.focus',activeBackground:'color.blue.50',disabled:'semantic.text.disabled',disabledBackground:'semantic.surface.disabled',radius:'radius.xl',padding:'space.32',gap:'space.20',smallGap:'space.4',listGap:'space.8',rowGap:'space.12',rowPadding:'space.12',rowBorder:'semantic.border.default',icon:'space.24',fileIcon:'space.40',font:'font.size.14',line:'font.line.20',smallFont:'font.size.12',smallLine:'font.line.16',weight:'font.weight.500',error:'semantic.status.dangerContent',errorBorder:'semantic.border.danger',errorBackground:'semantic.status.dangerSubtle',formatBackground:'semantic.surface.subtle',formatForeground:'semantic.text.body',formatRadius:'radius.xs',formatFont:'font.size.10',focus:'shadow.focus',duration:'motion.duration.fast'};
 for(const [role,target]of Object.entries(aliases))F.addToken('component.fileUpload.'+role,F.tokens[target].type,'{'+target+'}','normalized');
 const maximum=50000000,formats={jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',pdf:'application/pdf',mp4:'video/mp4'},accept='.jpg,.jpeg,.png,.pdf,.mp4,image/jpeg,image/png,application/pdf,video/mp4';
 const normalize=(c={})=>({multiple:c.multiple!==false,disabled:Boolean(c.disabled),state:['selected','error'].includes(c.state)?c.state:'idle',label:String(c.label||'Choose a file or drag & drop it here.')});
 const extension=name=>String(name||'').split('.').at(-1).toLowerCase();
 const bytes=size=>size>=1000000?`${(size/1000000).toFixed(1).replace(/\.0$/,'')} MB`:size>=1000?`${(size/1000).toFixed(1).replace(/\.0$/,'')} KB`:`${size} B`;
 F.fileUploadValidation=file=>{
  if(!file||!Object.hasOwn(formats,extension(file.name)))return 'Use JPEG, PNG, PDF, or MP4 files.';
  const mime=String(file.type||'').toLowerCase();if(mime&&mime!=='application/octet-stream'&&mime!==formats[extension(file.name)])return 'The file format does not match its extension.';
  if(!Number.isFinite(Number(file.size))||Number(file.size)<0)return 'This file could not be read.';
  if(file.size>maximum)return 'This file is larger than 50 MB.';
  return '';
 };
 const examples=multiple=>[{name:'Pitch deck.pdf',size:2400000,type:'application/pdf',example:true},...(multiple?[{name:'Product overview.png',size:840000,type:'image/png',example:true}]:[])];
 const row=(record,index,disabled)=>`<li class="pp-file-upload-row" data-file-row><span class="pp-file-upload-format" aria-hidden="true">${F.icon('file',40)}<span>${E(extension(record.name).toUpperCase().slice(0,4))}</span></span><span class="pp-file-upload-record"><strong title="${E(record.name)}">${E(record.name)}</strong><small>${bytes(record.size)} · ${record.example?'Example selection':'Selected locally'}</small></span>${F.button({variant:'ghost',size:'sm',icon:'only',iconName:'close',state:disabled?'disabled':'default'},'Remove '+record.name,`data-file-remove="${index}"`)}</li>`;
 F.fileUploadTokens=(c={})=>{
  const v=normalize(c),ids=['font.family.sans','font.weight.400','border.width','space.2','space.4','space.8','space.16','space.20','font.line.14',...Object.keys(aliases).map(role=>'component.fileUpload.'+role),...Object.values(F.buttonTokens({variant:'secondary',size:'sm',state:v.disabled?'disabled':'default'})),...Object.values(F.buttonTokens({variant:'ghost',size:'sm',icon:'only',state:v.disabled?'disabled':'default'}))];
  return [...new Set(ids)];
 };
 F.fileUpload=(c={})=>{
  const v=normalize(c),id='file-upload-'+ ++serial,records=v.state==='selected'?examples(v.multiple):[],error=v.state==='error'?'Example: “Archive.zip” is not supported. Choose JPEG, PNG, PDF, or MP4.':'';
  return `<section class="pp-file-upload" data-file-upload data-multiple="${v.multiple}" data-state="${v.state}"${v.disabled?' data-disabled="true"':''} aria-label="File selection"><div class="pp-file-upload-drop" data-file-drop><span class="pp-file-upload-icon" aria-hidden="true">${F.icon('file',24)}</span><div class="pp-file-upload-copy"><strong id="${id}-title">${E(v.label)}</strong><span id="${id}-help">JPEG, PNG, PDF, and MP4 formats, up to 50 MB.</span></div>${F.button({variant:'secondary',size:'sm',state:v.disabled?'disabled':'default'},v.multiple?'Browse files':'Browse file',`data-file-browse aria-describedby="${id}-help ${id}-error"`)}<input class="visually-hidden" type="file" data-file-input tabindex="-1" aria-invalid="${Boolean(error)}" aria-labelledby="${id}-title" aria-describedby="${id}-help ${id}-error" accept="${accept}" ${v.multiple?'multiple':''} ${v.disabled?'disabled':''}></div><p class="pp-file-upload-error" data-file-error id="${id}-error" ${error?'':'hidden'}>${E(error)}</p><ul class="pp-file-upload-list" data-file-list aria-label="Selected files" ${records.length?'':'hidden'}>${records.map((record,index)=>row(record,index,v.disabled)).join('')}</ul><span class="visually-hidden" role="status" aria-live="polite" aria-atomic="true" data-file-status></span></section>`;
 };
 F.wireFileUpload=(root,registerCleanup)=>{
  const cleanups=[];
  root.querySelectorAll('[data-file-upload]').forEach(host=>{
   if(mounted.has(host))return;
   const input=host.querySelector('[data-file-input]'),browse=host.querySelector('[data-file-browse]'),drop=host.querySelector('[data-file-drop]'),list=host.querySelector('[data-file-list]'),error=host.querySelector('[data-file-error]'),status=host.querySelector('[data-file-status]'),doc=host.ownerDocument||document,win=doc.defaultView||window,multiple=host.dataset.multiple==='true';
   let records=host.dataset.state==='selected'?examples(multiple):[],depth=0,disposed=false;
   const removers=[],listen=(target,type,fn,options)=>{target.addEventListener(type,fn,options);removers.push(()=>target.removeEventListener(type,fn,options));},disabled=()=>input.disabled;
   const emit=()=>{if(typeof win.CustomEvent==='function')host.dispatchEvent(new win.CustomEvent('forma:file-selection',{bubbles:true,detail:{files:records.filter(record=>!record.example)}}));};
   const render=()=>{list.innerHTML=records.map((record,index)=>row(record,index,disabled())).join('');list.hidden=!records.length;host.dataset.state=error.hidden?records.length?'selected':'idle':'error';};
   const resetDrag=()=>{depth=0;drop.removeAttribute('data-dragging');};
   const setError=message=>{error.textContent=message;error.hidden=!message;input.setAttribute('aria-invalid',String(Boolean(message)));};
   const add=files=>{
    if(disposed||disabled())return;const incoming=Array.from(files||[]);if(!incoming.length)return;
    if(!multiple&&incoming.length>1){setError('Choose one file at a time.');status.textContent=error.textContent;render();return;}
    const accepted=[],messages=[];
    for(const file of incoming){const reason=F.fileUploadValidation(file);if(reason)messages.push(`${file.name}: ${reason}`);else accepted.push(file);}
    if(accepted.length){const prior=multiple?records.filter(record=>!record.example):[];records=[...prior];for(const file of accepted)if(!records.some(record=>record.name===file.name&&record.size===file.size&&record.lastModified===file.lastModified))records.push(file);}
    setError(messages.join(' '));render();status.textContent=[accepted.length?`${records.length} ${records.length===1?'file selected':'files selected'} locally.`:'',...messages].filter(Boolean).join(' ');if(accepted.length)emit();
   };
   listen(browse,'click',()=>{if(!disabled())input.click();});
   listen(input,'change',()=>{add(input.files);input.value='';});
   listen(drop,'dragenter',event=>{event.preventDefault();if(disabled())return;depth++;drop.dataset.dragging='true';});
   listen(drop,'dragover',event=>{event.preventDefault();if(event.dataTransfer)event.dataTransfer.dropEffect=disabled()?'none':'copy';});
   listen(drop,'dragleave',event=>{event.preventDefault();depth=Math.max(0,depth-1);if(!depth)drop.removeAttribute('data-dragging');});
   listen(drop,'drop',event=>{event.preventDefault();resetDrag();add(event.dataTransfer?.files);});
   listen(list,'click',event=>{
    const button=event.target.closest?.('[data-file-remove]');if(!button||!list.contains(button)||disabled())return;const index=Number(button.dataset.fileRemove);if(!Number.isInteger(index)||index<0||index>=records.length)return;
    const [removed]=records.splice(index,1);setError('');render();status.textContent=`${removed.name} removed. ${records.length} ${records.length===1?'file remains':'files remain'}.`;emit();const buttons=list.querySelectorAll('[data-file-remove]');(buttons[index]||buttons[index-1]||browse).focus({preventScroll:true});
   });
   const form=host.closest('form');if(form)listen(form,'reset',()=>{records=[];input.value='';setError('');resetDrag();render();status.textContent='File selection cleared.';emit();});
   const cleanup=()=>{if(disposed)return;disposed=true;removers.forEach(remove=>remove());resetDrag();records=[];mounted.delete(host);};mounted.set(host,cleanup);cleanups.push(cleanup);
  });
  const cleanup=()=>cleanups.forEach(fn=>fn());if(typeof registerCleanup==='function')registerCleanup(cleanup);return cleanup;
 };
 document.getElementById('project-tokens').textContent=F.tokenCSS();
})();
