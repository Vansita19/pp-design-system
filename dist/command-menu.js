/* Native command dialog; AlignUI-inspired anatomy composed from Forma tokens and atoms. */
(() => {
 const F=window.Forma,E=F.escape,controllers=new WeakMap();
 let serial=0;
 const aliases={background:'semantic.surface.default',foreground:'semantic.text.heading',muted:'semantic.text.secondary',border:'semantic.border.default',selected:'semantic.surface.subtle',radius:'radius.2xl',shadow:'shadow.modal',padding:'space.12',gap:'space.8',rowHeight:'space.40',rowRadius:'radius.md',icon:'space.20',font:'font.size.14',line:'font.line.20',labelFont:'font.size.12',keyHeight:'space.20',keyRadius:'radius.xs',keyFont:'font.size.11',blur:'space.4'};
 for(const [role,target]of Object.entries(aliases))F.addToken('component.command.'+role,F.tokens[target].type,`{${target}}`,'normalized');
 F.addToken('layout.content.command','dimension','560px','extended');
 F.addToken('component.command.width','dimension','{layout.content.command}','normalized');
 F.addToken('component.command.backdrop','color','#52525266','extended');
 F.commandMenuTokens=(c={})=>[...F.kbdTokens(),...Object.keys(F.tokens).filter(id=>id.startsWith('component.command.')),'font.family.sans','font.weight.400','font.weight.500','border.width','space.4','space.8','space.12','space.16','space.20','space.24','space.32','space.48','space.64','radius.xl','semantic.surface.subtle','component.input.placeholder','semantic.border.focus',...Object.values(F.buttonTokens({variant:'ghost',size:'sm',icon:'only'})),...(c.scopes===false?[]:F.chipTokens({variant:'filter',tone:'neutral'}))];
 const groupIcon=group=>({Foundations:'layers',Atoms:'circle',Molecules:'grid',Blocks:'grid',Motion:'bolt',Templates:'file',Library:'grid'}[group]||'file');
 // Resolve from the live catalogue each time, so hidden pages and new families stay in sync.
 F.commandMenuItems=(query='',scopes=['foundations','components'])=>{
  const words=String(query).trim().toLowerCase().split(/\s+/).filter(Boolean);
  const entries=[{id:'all',name:'All components',group:'Library',aliases:['overview','browse'],href:'#all'},...(F.visibleItems?F.visibleItems():(F.items||[]).filter(item=>!item.hidden&&!F.pageAliases?.[item.id])).map(item=>({...item,href:F.pageHref?F.pageHref(item.id):'#'+item.id}))];
  const groups=new Map();
  entries.filter(item=>{if(!scopes.includes(item.group==='Foundations'?'foundations':'components'))return false;const haystack=[item.name,item.group,...(item.aliases||[])].join(' ').toLowerCase();return words.every(word=>haystack.includes(word));}).forEach(item=>{if(!groups.has(item.group))groups.set(item.group,[]);groups.get(item.group).push(item);});
  return [...groups.values()].flat();
 };
 const defaultScopes=['foundations','components'];
 const scopeLabel=scope=>scope==='foundations'?'Foundations':'Components';
 const scopesOf=c=>['foundations','components'].includes(c.scope)?[c.scope]:[...defaultScopes];
 const scopesHTML=scopes=>`<div class="pp-command-scopes-label">Searching in</div><div class="pp-command-scopes-values">${scopes.map(scope=>F.chip({variant:'filter',tone:'neutral',label:scopeLabel(scope),value:scope})).join('')}${scopes.length<defaultScopes.length?'<button type="button" class="pp-command-reset" data-command-reset-scopes>All scopes</button>':''}</div>`;
 const suggestions=items=>items.filter(item=>['all','colors','typography','button','input','badge','dropdown','modal'].includes(item.id));
 const footer=()=>`<footer class="pp-command-footer"><span class="pp-command-hint">${F.kbd({key:'↑'})}${F.kbd({key:'↓'})}<span>Navigate</span></span><span class="pp-command-hint">${F.kbd({key:'↵'})}<span>Select</span></span><span class="pp-command-hint pp-command-close-hint"><span>Close</span>${F.kbd({key:'ESC'})}</span></footer>`;
 function rowsHTML(items,id,selected=0){
  if(!items.length)return '<div class="pp-command-empty">No results found<span>Try another component name.</span></div>';
  const groups=new Map();items.forEach((item,index)=>{if(!groups.has(item.group))groups.set(item.group,[]);groups.get(item.group).push({item,index});});
  return [...groups].map(([group,rows],n)=>`<div class="pp-command-group" role="group" aria-labelledby="${id}-group-${n}"><div class="pp-command-label" id="${id}-group-${n}">${E(group)}</div>${rows.map(({item,index})=>`<div class="pp-command-option" id="${id}-option-${index}" role="option" aria-selected="${index===selected}" data-command-index="${index}"><span class="pp-command-symbol">${F.icon(groupIcon(item.group),20)}</span><span class="pp-command-option-label">${E(item.name)}</span><span class="pp-command-chevron">${F.icon('chevron',16)}</span></div>`).join('')}</div>`).join('');
 }
 function contentHTML(id,items,query='',selected=0,c={}){return `<header class="pp-command-header"><span class="pp-command-search-symbol">${F.icon('search',20)}</span><input class="pp-input pp-command-input" data-command-input role="combobox" aria-label="Search components and pages" aria-autocomplete="list" aria-expanded="true" aria-controls="${id}-results" ${items.length&&selected>=0?`aria-activedescendant="${id}-option-${selected}"`:''} autocomplete="off" spellcheck="false" placeholder="Search or jump to…" value="${E(query)}">${F.kbd({key:'⌘ K'})}${F.button({variant:'ghost',size:'sm',icon:'only',iconName:'close'},'Close command menu','data-command-close')}</header>${c.scopes===false?'':`<div class="pp-command-scopes" data-command-scopes>${scopesHTML(scopesOf(c))}</div>`}<div class="pp-command-result-caption" data-command-caption>${query?'Results':'Suggested destinations'}</div><div class="pp-command-results" id="${id}-results" role="listbox" aria-label="Components and pages" data-command-results>${rowsHTML(items,id,selected)}</div><span class="pp-command-status" role="status" aria-live="polite" aria-atomic="true" data-command-status>${items.length} results</span>${footer()}`;}
 F.commandMenuPreview=(c={})=>{
  const id='command-preview-'+(++serial),query=c.state==='empty'?'No matching component':String(c.query||''),all=F.commandMenuItems(query,c.scopes===false?defaultScopes:scopesOf(c));
  const items=c.state==='empty'?[]:query?all.slice(0,8):suggestions(all);
  const selected=c.state==='unselected'?-1:0;
  return `<div class="pp-command-demo"><div class="pp-command-preview-backdrop"><div class="pp-command-card pp-theme" aria-label="Command menu preview" inert>${contentHTML(id,items,query,selected,c)}</div></div>${F.button({variant:'secondary',icon:'leading',iconName:'search'},'Open command menu',`data-command-menu-open data-command-scopes="${c.scopes!==false}" data-command-scope="${E(c.scope||'all')}"`)}</div>`;
 };
 F.wireCommandMenu=(doc=document)=>{
  if(controllers.has(doc))return controllers.get(doc);
  const view=doc.defaultView||window,id='command-menu-'+(++serial),dialog=doc.createElement('dialog');
  dialog.className='pp-command-dialog pp-command-card pp-theme';dialog.setAttribute('aria-label','Command menu');
  dialog.innerHTML=contentHTML(id,[]);doc.body.append(dialog);
  const input=dialog.querySelector('[data-command-input]'),results=dialog.querySelector('[data-command-results]'),status=dialog.querySelector('[data-command-status]'),closeButton=dialog.querySelector('[data-command-close]');
  const scopeHost=dialog.querySelector('[data-command-scopes]'),caption=dialog.querySelector('[data-command-caption]');
  let scopes=[...defaultScopes],showScopes=true,items=[],selected=-1,returnFocus=null,oldOverflow=null,destroyed=false;
  const listeners=[];
  const on=(target,type,fn,options)=>{target.addEventListener(type,fn,options);listeners.push(()=>target.removeEventListener(type,fn,options));};
  const restore=()=>{
   if(oldOverflow!==null){doc.body.style.overflow=oldOverflow;oldOverflow=null;}
   const target=returnFocus;returnFocus=null;
   if(target?.isConnected&&!target.closest?.('[inert]'))target.focus({preventScroll:true});
  };
  const close=()=>{if(!dialog.open)return;dialog.close();restore();};
  const select=index=>{
   selected=items.length?Math.max(0,Math.min(index,items.length-1)):-1;
   results.querySelectorAll('[data-command-index]').forEach(row=>row.setAttribute('aria-selected',String(Number(row.dataset.commandIndex)===selected)));
   if(selected<0)input.removeAttribute('aria-activedescendant');
   else{const active=id+'-option-'+selected;input.setAttribute('aria-activedescendant',active);doc.getElementById(active)?.scrollIntoView({block:'nearest'});}
  };
  const render=()=>{const matches=F.commandMenuItems(input.value,showScopes?scopes:defaultScopes);items=input.value.trim()?matches:suggestions(matches);caption.textContent=input.value.trim()?'Results':'Suggested destinations';selected=items.length?0:-1;results.innerHTML=rowsHTML(items,id,selected);status.textContent=items.length?`${items.length} result${items.length===1?'':'s'}`:'No results found';results.scrollTop=0;select(selected);};
  const open=(trigger=doc.activeElement)=>{
   if(destroyed)return;
   if(dialog.open){input.focus();return;}
   // showModal supplies native top-layer containment and background inertness.
   returnFocus=trigger;showScopes=trigger?.dataset?.commandScopes!=='false';scopes=scopesOf({scope:trigger?.dataset?.commandScope});scopeHost.hidden=!showScopes;scopeHost.innerHTML=scopesHTML(scopes);input.value='';render();dialog.showModal();oldOverflow=doc.body.style.overflow;doc.body.style.overflow='hidden';input.focus();
  };
  const activate=()=>{const item=items[selected];if(!item)return;close();view.location.hash=item.href;};
  on(input,'input',render);
  on(closeButton,'click',close);
  on(scopeHost,'click',event=>{const remove=event.target.closest?.('[data-chip-remove]'),reset=event.target.closest?.('[data-command-reset-scopes]');if(!remove&&!reset)return;event.preventDefault();scopes=reset?[...defaultScopes]:scopes.filter(scope=>scope!==remove.dataset.chipValue);scopeHost.innerHTML=scopesHTML(scopes);render();input.focus();});
  on(dialog,'cancel',event=>{event.preventDefault();close();});
  on(dialog,'close',()=>{if(!dialog.open)restore();});
  on(dialog,'click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)close();});
  on(results,'pointermove',event=>{const row=event.target.closest('[data-command-index]');if(row)select(Number(row.dataset.commandIndex));});
  on(results,'click',event=>{const row=event.target.closest('[data-command-index]');if(row){select(Number(row.dataset.commandIndex));activate();}});
  on(doc,'click',event=>{const trigger=event.target.closest?.('[data-command-menu-open]');if(trigger){event.preventDefault();open(trigger);}});
  on(doc,'keydown',event=>{
   if(event.defaultPrevented||event.isComposing)return;
   if((event.metaKey||event.ctrlKey)&&!event.altKey&&event.key.toLowerCase()==='k'){event.preventDefault();if(dialog.open)close();else open();return;}
   if(!dialog.open)return;
   if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();return;}
   if(event.key==='Tab'){
    const controls=[input,...dialog.querySelectorAll('button')].filter(button=>!button.disabled&&!button.closest('[hidden]')),current=controls.indexOf(doc.activeElement),next=event.shiftKey?(current<=0?controls.length-1:current-1):(current+1)%controls.length;
    event.preventDefault();controls[next].focus();return;
   }
   if(event.target!==input)return;
   if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();if(items.length)select((selected+(event.key==='ArrowDown'?1:-1)+items.length)%items.length);}
   if(event.key==='Enter'){event.preventDefault();activate();}
  },true);
  // Native dialog normally handles this; retain containment for programmatic focus changes.
  on(doc,'focusin',event=>{if(dialog.open&&!dialog.contains(event.target))input.focus();});
  const destroy=()=>{if(destroyed)return;close();destroyed=true;listeners.splice(0).forEach(remove=>remove());dialog.remove();controllers.delete(doc);};
  // Preserve the controller on BFCache pagehide; the page and its listeners are restored together.
  on(view,'pagehide',event=>{if(event.persisted)close();else destroy();});
  const controller={open,close,destroy};controllers.set(doc,controller);return controller;
 };
 document.getElementById('project-tokens').textContent=F.tokenCSS();
})();
