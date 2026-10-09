/* Source: Pitch Protocol ui.js workspacePrompt, composer-menus.js and final
   styles.css overrides. Submit/files are local demos; speech uses the browser recognition API. */
(() => {
 const F=window.Forma,E=F.escape;
 for(const n of [14,17,18,112,120])if(!F.tokens['size.'+n])F.addToken('size.'+n,'dimension',n+'px','existing');
 const primitives={
  'size.prompt.home':['dimension','900px'],'size.prompt.conversation':['dimension','780px'],
  'font.size.15':['dimension','15px'],
  'border.width.hairline':['dimension','.5px'],
  'color.grayAlpha.10':['color','#0000001a'],'color.grayAlpha.6':['color','#0000000f'],
  'shadow.prompt':['shadow','0 7px 4px #00000003,0 3px 3px #00000005,0 1px 2px #00000005'],
  'shadow.promptSend':['shadow','inset 0 -2px 4px #ffffff33'],
  'color.glow.cyan':['color','#c5f7ff'],'color.glow.purple':['color','#d0c3ff'],
  'color.glow.pink':['color','#ffcced'],'color.glow.amber':['color','#ffefd1'],
  'opacity.glow':['number',.6]
 };
 for(const [id,[type,value]]of Object.entries(primitives))if(!F.tokens[id])F.addToken(id,type,value,'existing');
 const semantic={background:'semantic.surface.default',foreground:'semantic.text.body',placeholder:'semantic.text.placeholder',border:'color.grayAlpha.10',
  'add.border':'color.grayAlpha.6','icon.foreground':'semantic.text.secondary',shadow:'shadow.prompt',
  'send.background':'semantic.action.primary','send.hover':'semantic.action.hover','send.foreground':'semantic.text.inverse','send.shadow':'shadow.promptSend',
  'mode.background':'semantic.badge.blue.background','mode.foreground':'semantic.badge.blue.foreground',
  'mention.foreground':'color.blue.500','list.background':'semantic.surface.default','list.foreground':'semantic.text.body','list.border':'semantic.border.default',
  'glow.cyan':'color.glow.cyan','glow.purple':'color.glow.purple','glow.pink':'color.glow.pink','glow.amber':'color.glow.amber'};
 for(const [role,target]of Object.entries(semantic))F.addToken('semantic.prompt.'+role,F.tokens[target].type,`{${target}}`,'normalized');
 const component={widthHome:'size.prompt.home',widthConversation:'size.prompt.conversation',minHeight:'size.112',radius:'radius.4xl',padding:'space.12',borderWidth:'border.width.hairline',
  font:'font.size.15',line:'font.line.24','input.height':'space.36','input.maxHeight':'size.120','input.padding':'space.8',
  gap:'space.4','control.size':'space.32','control.radius':'radius.lg','control.font':'font.size.13','control.padding':'space.12','control.icon':'size.14',
  'send.size':'space.40','send.radius':'radius.xl','send.icon':'size.17',focus:'shadow.focus',
  'attachment.height':'space.28','attachment.gap':'space.6','attachment.padding':'space.8','attachment.font':'font.size.12','attachment.radius':'radius.full',
  'mention.weight':'font.weight.500','list.radius':'radius.md','list.padding':'space.6','list.gap':'space.4','list.icon':'size.14','list.font':'font.size.13','list.line':'font.line.20',
  'mode.radius':'radius.full','mode.padding':'space.12','glow.inset':'space.20','glow.offset':'space.6','glow.height':'space.28','glow.blur':'size.18','glow.opacity':'opacity.glow'};
 for(const role of Object.keys(semantic))component[role]='semantic.prompt.'+role;
 for(const [role,target]of Object.entries(component))F.addToken('component.prompt.'+role,F.tokens[target].type,`{${target}}`,'normalized');
 const modes={none:null,web:{label:'Search the web',icon:'globe'},research:{label:'Run deep research',icon:'telescope'},thinking:{label:'Think longer',icon:'brain'}};
 const companies=['AsterGrid','Northstar AI','Lumen Health'],lists=['Priority review','AI infrastructure','Recent additions'];
 let serial=0;
 const config=c=>({variant:c.variant==='conversation'?'conversation':'home',state:['pending','disabled'].includes(c.state)?c.state:'default',value:String(c.value??''),
  mode:Object.hasOwn(modes,c.mode)?c.mode:'none',attachments:c.attachments==='files'?'files':'none',mention:['company','list','both'].includes(c.mention)?c.mention:'none',glow:c.glow!==false});
 const icon=(name,role='control.icon')=>F.icon(name,parseFloat(F.resolve('component.prompt.'+role)));
 const mentionHTML=(label,kind)=>`<span class="pp-prompt-mention pp-prompt-mention-${kind}" data-prompt-mention="${kind}" data-prompt-value="${E((kind==='list'?'#':'@')+label)}" contenteditable="false" aria-label="${E((kind==='list'?'List: ':'Company: ')+label)}">${kind==='list'?icon('list','list.icon'):''}<span>${E((kind==='company'?'@':'')+label)}</span></span>`;
 const removable=(label,kind,disabled)=>`<span class="pp-prompt-tag ${kind==='mode'?'pp-prompt-mode-tag':''}">${icon(kind==='mode'?modes[label].icon:'file')}<span>${E(kind==='mode'?modes[label].label:label)}</span><button type="button" data-prompt-remove="${E(kind)}" aria-label="Remove ${E(kind==='mode'?modes[label].label:label)}"${disabled?' disabled':''}>${icon('close')}</button></span>`;
 F.promptBarTokens=(c={})=>{
  const v=config(c),ids=['font.family.sans','border.width','semantic.surface.subtle','semantic.surface.disabled','semantic.text.disabled','semantic.border.default','radius.none','space.4','space.8','space.24','component.control.height.sm',...['border','radius','background','foreground','focus'].map(role=>'component.input.'+role),
   ...Object.keys(component).filter(role=>!role.startsWith('glow.')&&!role.startsWith('width')).map(role=>'component.prompt.'+role),'component.prompt.'+(v.variant==='conversation'?'widthConversation':'widthHome')];
  if(v.glow&&v.state==='default')ids.push(...Object.keys(component).filter(role=>role.startsWith('glow.')).map(role=>'component.prompt.'+role));
  // These are the live action menus, not a separate platform dropdown.
  if(F.menuTokens)ids.push(...F.menuTokens('menu',{variant:'ghost',size:'sm'}));
  ids.push(...Object.values(F.buttonTokens({variant:'secondary',size:'sm',icon:'only',state:v.state==='disabled'?'disabled':'default'})));
  if(F.voiceWaveformTokens)ids.push(...F.voiceWaveformTokens(),'space.64');
  return [...new Set(ids)];
 };
 F.promptBar=(c={})=>{
  const v=config(c),id='pp-prompt-'+(++serial),disabled=v.state==='disabled',attr=disabled?' disabled':'',pending=v.state==='pending';
  const placeholder=v.variant==='conversation'?'Ask a follow-up...':'Ask anything about your dealflow...';
  const attachments=v.attachments==='files'?[['Pitch deck.pdf','files'],['Metrics.csv','files']]:[];
  const mentions=(v.mention==='company'||v.mention==='both'?mentionHTML(companies[0],'company')+' ':'')+(v.mention==='list'||v.mention==='both'?mentionHTML(lists[0],'list')+' ':'');
  const initialValue=v.value+(v.value&&mentions?' ':'')+(v.mention==='company'||v.mention==='both'?'@'+companies[0]+' ':'')+(v.mention==='list'||v.mention==='both'?'#'+lists[0]+' ':'');
  return `<div class="pp-prompt-wrap ${v.glow?'has-glow':''}" data-prompt-wrap data-variant="${v.variant}" data-state="${v.state}"><form class="pp-prompt-bar" data-prompt-bar data-state="${v.state}" data-mode="${v.mode}" aria-label="${v.variant==='conversation'?'Conversation prompt':'Home prompt'}"><div class="pp-prompt-input" data-prompt-input role="textbox" contenteditable="${disabled?'false':'true'}" aria-multiline="true" aria-required="true" aria-haspopup="dialog" aria-expanded="false" aria-controls="${id}-popup" aria-disabled="${disabled}" aria-label="${v.variant==='conversation'?'Conversation message':'Ask about your dealflow'}" aria-placeholder="${placeholder}" data-placeholder="${placeholder}" tabindex="${disabled?'-1':'0'}" spellcheck="true">${E(v.value)}${v.value&&mentions?' ':''}${mentions}</div><input type="hidden" name="prompt" data-prompt-value value="${E(initialValue)}"${attr}><div class="pp-prompt-attachments" data-prompt-attachments role="group" aria-label="Attachments"${attachments.length?'':' hidden'}>${attachments.map(([name,kind])=>removable(name,kind,disabled)).join('')}</div><div class="pp-prompt-actions">${F.button({variant:'secondary',size:'sm',icon:'only',iconName:'plus',state:disabled?'disabled':'default'},'Add context',`data-prompt-open="context" aria-haspopup="dialog" aria-expanded="false" aria-controls="${id}-popup"`).replace('class="pp-button','class="pp-prompt-add pp-button')}<button type="button" class="pp-prompt-tools" data-prompt-open="tools" aria-haspopup="dialog" aria-expanded="false" aria-controls="${id}-popup"${attr}>${icon('sliders-horizontal')}<span>Tools</span></button><span class="pp-prompt-mode" data-prompt-mode>${v.mode==='none'?'':removable(v.mode,'mode',disabled)}</span><span class="pp-prompt-action-spacer"></span><span class="pp-prompt-voice-wave">${F.voiceWaveform?F.voiceWaveform():''}</span><button type="button" class="pp-prompt-mic" data-prompt-voice aria-label="Start voice typing" aria-pressed="false"${attr}>${icon('microphone')}</button><button type="submit" class="pp-prompt-send" data-prompt-send aria-label="${v.variant==='conversation'?'Send message':'Send prompt'}"${disabled||pending?' disabled':''}>${icon('arrow','send.icon')}</button></div><div class="pp-menu-popup pp-prompt-popup" id="${id}-popup" data-prompt-popup popover="manual" role="dialog" aria-label="Add context" hidden></div><span class="visually-hidden" role="status" aria-live="polite" data-prompt-status></span></form></div>`;
 };
 // The rich editor stores only plain text, company mentions and list mentions.
 // Its hidden value is the transport representation; no editable HTML is submitted.
 const nodeText=node=>node.nodeType===3?node.textContent:node.dataset?.promptMention?node.dataset.promptValue:node.nodeName==='BR'?'\n':Array.from(node.childNodes||[]).map(nodeText).join('');
 const textLength=node=>nodeText(node).length;
 const selectionOffsets=(editor,win)=>{
  const selection=win.getSelection?.();if(!selection?.rangeCount)return null;
  const range=selection.getRangeAt(0);if(!editor.contains(range.startContainer)||!editor.contains(range.endContainer))return null;
  const offset=(target,offset)=>{let total=0,found=false;const visit=node=>{if(found)return;if(node===target){total+=node.nodeType===3?offset:Array.from(node.childNodes||[]).slice(0,offset).reduce((n,child)=>n+textLength(child),0);found=true;return;}if(node.nodeType===3||node.dataset?.promptMention||node.dataset?.promptDictation!==undefined||node.nodeName==='BR'){total+=textLength(node);return;}for(const child of node.childNodes||[])visit(child);};visit(editor);return total;};
  return {start:offset(range.startContainer,range.startOffset),end:offset(range.endContainer,range.endOffset)};
 };
 const textPoint=(editor,offset)=>{
  let remaining=Math.max(0,offset),result=null;
  const visit=node=>{if(result)return;const children=Array.from(node.childNodes||[]);for(let index=0;index<children.length;index++){
   const child=children[index],size=textLength(child);
   if(child.dataset?.promptMention||child.dataset?.promptDictation!==undefined||child.nodeName==='BR'){if(remaining<=size){result={node,offset:index+(remaining?1:0)};return;}remaining-=size;}
   else if(child.nodeType===3){if(remaining<=size){result={node:child,offset:remaining};return;}remaining-=size;}
   else visit(child);if(result)return;
  }};visit(editor);return result||{node:editor,offset:editor.childNodes.length};
 };
 const selectOffsets=(editor,win,offsets)=>{
  const doc=editor.ownerDocument||document,selection=win.getSelection?.();if(!selection||!doc.createRange)return;
  const range=doc.createRange(),start=textPoint(editor,offsets.start),end=textPoint(editor,offsets.end);
  range.setStart(start.node,start.offset);range.setEnd(end.node,end.offset);selection.removeAllRanges();selection.addRange(range);return range;
 };
 F.setPromptDraft=(editor,text,selection)=>typeof editor?._ppSetDraft==='function'?editor._ppSetDraft(String(text),selection):false;
 F.wirePromptBar=(root,registerCleanup=()=>{})=>{
  const cleanups=[];
  root.querySelectorAll('[data-prompt-bar]').forEach(form=>{
   const input=form.querySelector('[data-prompt-input]'),valueInput=form.querySelector('input[data-prompt-value]'),popup=form.querySelector('[data-prompt-popup]'),attachments=form.querySelector('[data-prompt-attachments]'),modeNode=form.querySelector('[data-prompt-mode]'),status=form.querySelector('[data-prompt-status]'),mic=form.querySelector('[data-prompt-voice]');
   const doc=form.ownerDocument||document,win=doc.defaultView||window,off=[],listen=(target,type,handler,options)=>{target.addEventListener(type,handler,options);off.push(()=>target.removeEventListener(type,handler,options));};
   let opened=false,origin=null,portal=false,kind='context',typedRange=null,disposed=false,saved={start:textLength(input),end:textLength(input)},recognition=null,dictationNode=null,dictationActive=false;
   const disabled=()=>form.dataset.state==='disabled'||input.getAttribute('contenteditable')==='false';
   const announce=text=>{status.textContent=text;};
   const sync=()=>{const value=nodeText(input);valueInput.value=value;input.dataset.empty=String(!value);if(value.trim())input.removeAttribute('aria-invalid');return value;};
   const resize=()=>{input.style.height=F.resolve('component.prompt.input.height');input.style.height=Math.min(parseFloat(F.resolve('component.prompt.input.maxHeight')),Math.max(parseFloat(F.resolve('component.prompt.input.height')),input.scrollHeight||0))+'px';};
   const remember=()=>{saved=selectionOffsets(input,win)||saved;};
   const select=(start,end=start)=>{saved={start,end};input.focus({preventScroll:true});return selectOffsets(input,win,saved);};
   const replace=(nodes,start=saved.start,end=saved.end)=>{
    const range=selectOffsets(input,win,{start,end});let endOffset=start;
    if(range){range.deleteContents();for(const node of nodes){range.insertNode(node);range.setStartAfter(node);range.collapse(true);endOffset+=textLength(node);}}
    else{input.append(...nodes);endOffset=textLength(input);} // No selection support: append safely.
    sync();resize();select(endOffset);return endOffset;
   };
   const close=(restore=false)=>{
    if(!opened)return;opened=false;try{popup.hidePopover?.();}catch{}popup.hidden=true;origin?.setAttribute('aria-expanded','false');
    if(portal){form.append(popup);portal=false;}if(restore)origin?.focus({preventScroll:true});
   };
   const finishDictation=()=>{
    dictationActive=false;delete form.dataset.voiceActive;mic.setAttribute('aria-pressed','false');mic.setAttribute('aria-label','Start voice typing');
    if(dictationNode?.parentNode){const plain=doc.createTextNode(dictationNode.textContent);dictationNode.replaceWith(plain);sync();resize();}
    dictationNode=null;
   };
   const stopDictation=(abort=false)=>{const current=recognition;recognition=null;if(current){current.onresult=null;current.onend=null;current.onerror=null;current.onstart=null;try{abort?current.abort():current.stop();}catch{}}finishDictation();};
   const position=()=>{
    if(!opened||!origin)return;const rect=origin.getBoundingClientRect(),view=win.visualViewport;
    const p=F.menuPlacement(rect,{width:260,height:Math.min(popup.scrollHeight||240,320)},{width:view?.width||win.innerWidth,height:view?.height||win.innerHeight,left:view?.offsetLeft||0,top:view?.offsetTop||0});
    Object.assign(popup.style,{left:p.left+'px',top:p.top+'px',width:p.width+'px',maxHeight:Math.min(320,p.maxHeight)+'px'});popup.dataset.side=p.side;
   };
   const action=(label,glyph,value,extra='')=>`<button type="button" class="pp-menu-option" data-prompt-action="${value}"${extra}>${icon(glyph)}<span>${E(label)}</span></button>`;
   const choices=query=>(kind==='lists'?lists:companies).filter(label=>label.toLowerCase().includes(query.toLowerCase())).map(label=>action(label,kind==='lists'?'list':'at','insert',` data-prompt-value="${E(label)}" data-prompt-kind="${kind==='lists'?'list':'company'}"`)).join('')||'<div class="pp-menu-empty">No matches found.</div>';
   const render=(query='')=>{
    popup.setAttribute('aria-label',kind==='tools'?'Tools':kind==='lists'?'Link a list':kind==='companies'?'Mention a company':'Add context');
    popup.innerHTML=kind==='context'?action('Attach files','paperclip','attach')+action('Mention a company','at','companies')+action('Link a list','list','lists'):kind==='tools'?Object.entries(modes).filter(([,mode])=>mode).map(([key,mode])=>action(mode.label,mode.icon,'mode',` data-prompt-value="${key}"`)).join(''):
     action('Back','arrow-left','context')+`<input class="pp-input pp-prompt-picker-search" type="search" data-prompt-search aria-label="${kind==='lists'?'Search lists':'Search companies'}" placeholder="${kind==='lists'?'Search lists...':'Search companies...'}" value="${E(query)}"><div data-prompt-results>${choices(query)}</div>`;
   };
   const open=(next,trigger,query='')=>{
    if(disabled()||disposed)return;close();origin=trigger;kind=next;render(query);opened=true;popup.hidden=false;origin.setAttribute('aria-expanded','true');
    try{if(typeof popup.showPopover==='function')popup.showPopover();else{doc.body.append(popup);portal=true;}}catch{doc.body.append(popup);portal=true;}
    position();(popup.querySelector('input')||popup.querySelector('button'))?.focus({preventScroll:true});
   };
   const addAttachment=()=>{
    if(disabled())return;attachments.insertAdjacentHTML('beforeend',removable('Pitch deck.pdf','files',false));attachments.hidden=false;announce('Sample file attached.');select(saved.start,saved.end);
   };
   const voice=()=>{
    if(disabled()||disposed)return;
    if(dictationActive){try{recognition.stop();}catch{stopDictation();}return;}
    const SpeechRecognition=win.SpeechRecognition||win.webkitSpeechRecognition;
    if(!SpeechRecognition){announce('Voice typing is not available in this browser. You can type your prompt instead.');return;}
    close();remember();const voiceRange={...saved},originalDraft=nodeText(input);let prefix='',suffix='';select(saved.start,saved.end);
    // Preserve selected content until real transcript text is available. A denied
    // permission, start error or no-speech result must never erase the draft.
    let current;
    try{current=new SpeechRecognition();recognition=current;dictationActive=true;current.continuous=true;current.interimResults=true;current.lang=doc.documentElement?.lang||win.navigator?.language||'en-US';
     current.onstart=()=>{if(disposed||recognition!==current)return;form.dataset.voiceActive='true';mic.setAttribute('aria-pressed','true');mic.setAttribute('aria-label','Stop voice typing');announce('Listening. Your words appear in the prompt.');};
     current.onresult=event=>{
      if(disposed||recognition!==current)return;
      const words=Array.from(event.results).map(result=>result[0]?.transcript||'').join(' ').trim();if(!words)return;
      if(!dictationNode){
       const draft=nodeText(input),range=draft===originalDraft?voiceRange:(selectionOffsets(input,win)||saved),before=draft.slice(0,range.start),after=draft.slice(range.end);
       prefix=before&&!/\s$/.test(before)?' ':'';suffix=after&&!/^\s|^[,.!?;:)\]}]/.test(after)?' ':'';
       dictationNode=doc.createElement('span');dictationNode.setAttribute('data-prompt-dictation','');dictationNode.setAttribute('contenteditable','false');dictationNode.textContent=prefix+words+suffix;replace([dictationNode],range.start,range.end);
      }else if(dictationNode.parentNode){dictationNode.textContent=prefix+words+suffix;}else{stopDictation(true);return;}sync();resize();
      if(doc.activeElement===input){const spanEnd=(()=>{let offset=0;for(const node of input.childNodes){offset+=textLength(node);if(node===dictationNode)break;}return offset;})();select(spanEnd);}
     };
     current.onerror=event=>{if(disposed||recognition!==current)return;const messages={'not-allowed':'Microphone access was not allowed. You can type your prompt instead.','service-not-allowed':'Voice typing is not available. You can type your prompt instead.','audio-capture':'No microphone is available. You can type your prompt instead.','no-speech':'No speech was detected. Try voice typing again or type your prompt.','network':'Voice typing could not connect. Your draft has been kept.'};announce(messages[event.error]||'Voice typing stopped. Your draft has been kept.');stopDictation(true);};
     current.onend=()=>{if(disposed||recognition!==current)return;recognition=null;current.onresult=null;current.onerror=null;current.onstart=null;current.onend=null;finishDictation();announce('Voice typing stopped.');};current.start();
    }catch{stopDictation(true);announce('Voice typing could not start. You can type your prompt instead.');}
   };
   input._ppSetDraft=(text,selection)=>{
    if(disposed||disabled()||input.readOnly)return false;stopDictation(true);close();input.textContent=text;sync();resize();const start=selection?.start??text.length,end=selection?.end??start;select(Math.min(start,text.length),Math.min(end,text.length));return true;
   };
   listen(form,'click',event=>{
    const trigger=event.target.closest?.('[data-prompt-open]');if(trigger&&form.contains(trigger)){if(disabled())return;remember();typedRange=null;if(opened&&origin===trigger){close(true);return;}open(trigger.dataset.promptOpen,trigger);}
    if(event.target.closest?.('[data-prompt-voice]'))voice();
    const remove=event.target.closest?.('[data-prompt-remove]');if(remove&&!remove.disabled&&!disabled()){
     if(remove.dataset.promptRemove==='mode'){form.dataset.mode='none';modeNode.replaceChildren();announce('Tool removed.');}
     else{const tag=remove.closest('.pp-prompt-tag');tag.remove();attachments.hidden=!attachments.children.length;announce('Attachment removed.');}select(saved.start,saved.end);
    }
   });
   listen(popup,'click',event=>{
    const button=event.target.closest?.('[data-prompt-action]');if(!button||disabled())return;const a=button.dataset.promptAction;
    if(['context','companies','lists'].includes(a)){kind=a;render();position();(popup.querySelector('input')||popup.querySelector('button'))?.focus();return;}
    if(a==='attach'){close();addAttachment();return;}
    if(a==='mode'){const mode=button.dataset.promptValue;if(!modes[mode])return;form.dataset.mode=mode;modeNode.innerHTML=removable(mode,'mode',false);close();announce(modes[mode].label+' selected.');select(saved.start,saved.end);return;}
    if(a==='insert'){
     const label=button.dataset.promptValue,type=button.dataset.promptKind==='list'?'list':'company',holder=doc.createElement('span');holder.innerHTML=mentionHTML(label,type);
     const range=typedRange||saved;replace([holder.firstChild,doc.createTextNode(' ')],range.start,range.end);typedRange=null;close();announce(label+' added.');
    }
   });
   listen(popup,'input',event=>{if(event.target.matches('[data-prompt-search]')){popup.querySelector('[data-prompt-results]').innerHTML=choices(event.target.value);position();}});
   listen(popup,'keydown',event=>{
    if(event.isComposing)return;if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close(true);return;}
    if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)&&!(event.target.matches('input')&&['Home','End'].includes(event.key))){event.preventDefault();F.menuNext(Array.from(popup.querySelectorAll('button')),doc.activeElement,event.key)?.focus();}
   });
   listen(input,'input',event=>{
    sync();resize();remember();if(disabled()||event.isComposing)return;const prefix=nodeText(input).slice(0,saved.start),match=prefix.match(/(?:^|\s)([@/])([^@/\s]*)$/);
    if(match){typedRange={start:prefix.length-match[2].length-1,end:saved.start};open(match[1]==='@'?'companies':'lists',input,match[2]);}
   });
   listen(input,'keydown',event=>{
    if(event.defaultPrevented||event.isComposing||disabled())return;
    if(event.key==='Enter'){event.preventDefault();remember();if(event.shiftKey){replace([doc.createTextNode('\n')]);return;}if(form.dataset.state!=='pending')form.requestSubmit();}
   });
   listen(input,'paste',event=>{if(disabled())return;event.preventDefault();remember();replace([doc.createTextNode(event.clipboardData?.getData('text/plain')||'')]);});
   listen(input,'drop',event=>{event.preventDefault();if(disabled())return;remember();replace([doc.createTextNode(event.dataTransfer?.getData('text/plain')||'')]);});
   listen(doc,'selectionchange',remember);listen(input,'keyup',remember);listen(input,'pointerup',remember);
   listen(form,'submit',event=>{event.preventDefault();if(disabled()||form.dataset.state==='pending')return;if(!sync().trim()){input.setAttribute('aria-invalid','true');announce('Enter a prompt.');input.focus();return;}stopDictation();announce('Prompt sent in this preview.');input.textContent='';sync();resize();close();select(0);});
   listen(doc,'pointerdown',event=>{if(opened&&!popup.contains(event.target)&&!origin?.contains(event.target))close();});
   listen(doc,'focusin',event=>{if(opened&&!popup.contains(event.target)&&event.target!==origin)close();});
   listen(win,'resize',position);listen(doc,'scroll',event=>{if(!popup.contains(event.target))position();},true);
   sync();resize();cleanups.push(()=>{disposed=true;stopDictation(true);close();delete input._ppSetDraft;off.forEach(fn=>fn());});
  });
  const cleanup=()=>cleanups.forEach(fn=>fn());registerCleanup(cleanup);return cleanup;
 };
 document.getElementById('project-tokens').textContent=F.tokenCSS();
})();
