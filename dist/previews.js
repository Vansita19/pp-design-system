const E=F.escape,I=F.icon;let serial=0;
F.button=(c={},text,attributes='')=>{const variant=c.variant||'primary',s=c.state||'default',icon=c.icon||'none',only=icon==='only';const mapped=F.buttonTokens(c),inline=Object.entries(mapped).map(([key,id])=>`--demo-button-${key}:${F.v(id)}`).join(';');return `<button ${/\btype\s*=/.test(attributes)?'':'type="button"'} class="pp-button ${variant} size-${c.size||'md'} state-${s} ${only?'icon-only':''}" style="${inline}" ${s==='disabled'||s==='loading'?'disabled':''} ${s==='loading'?'aria-busy="true"':''} ${only?`aria-label="${E(text||c.label||'Add item')}"`:''} ${attributes}>${s==='loading'?'<span class="pp-spinner" aria-hidden="true"></span>':s==='success'?I('check'):['leading','only'].includes(icon)?I(c.iconName||'plus'):''}${only?'':E(text||c.label||'Continue')}${icon==='trailing'?I('chevron'):''}</button>`;};
const row=(...parts)=>`<div class="pp-row">${parts.join('')}</div>`;
F.link=(c={})=>{const mapped=F.buttonTokens({...c,variant:'link'}),inline=Object.entries(mapped).map(([key,id])=>`--demo-button-${key}:${F.v(id)}`).join(';');return `<a class="pp-button link size-${c.size||'md'} state-${c.state||'default'}" style="${inline}" href="#link" data-demo-link ${c.state==='disabled'?'aria-disabled="true" tabindex="-1"':''}>${c.icon==='leading'?I('link'):''}${E(c.label||'View details')}${c.external?I('external'):c.icon==='trailing'?I('chevron'):''}</a>`;};
F.groupKind=(c={})=>c.orientation==='vertical'?'icons':c.variant||'selection';
F.groupButtons=(c={})=>{
 const kind=F.groupKind(c),items=kind==='icons'?[['Zoom in','plus'],['Zoom out','minus'],['Reset zoom','reset']]:kind==='actions'?[['Edit'],['Duplicate'],['Delete']]:[['List','menu'],['Grid','grid']];
 return items.map(([label,icon])=>({label,iconName:icon,icon:icon?(kind==='icons'?'only':'leading'):'none',variant:label==='Delete'?'destructive':'secondary',size:c.size||'md',state:c.disabled?'disabled':'default'}));
};
F.buttonGroup=(c={})=>{
 const kind=F.groupKind(c),selection=kind==='selection',selected=['List','Grid'].includes(c.selected)?c.selected:'Grid';
 return `<div class="pp-button-group ${c.orientation==='vertical'?'vertical':'horizontal'}" role="group" aria-label="${selection?'Content view':kind==='icons'?'Canvas zoom controls':'Record actions'}">${F.groupButtons(c).map(b=>F.button(b,b.label,selection?`aria-pressed="${b.label===selected}" data-group`:`${kind==='icons'?`title="${E(b.label)}" `:''}data-notify="${E(b.label)} activated"`)).join('')}</div>`;
};
F.choiceControl=(type,attributes='')=>`<span class="pp-choice-control pp-${type}-control"><input type="${type}" class="pp-selection-input pp-${type}" ${attributes}><span class="pp-choice-indicator" aria-hidden="true">${type==='checkbox'?`<span class="pp-checkmark">${I('check',14)}</span><span class="pp-mixed-mark"></span>`:'<span class="pp-radio-mark"></span>'}</span></span>`;
F.badge=(c={},label=c.label||'Badge')=>{
 const status=c.variant==='status'?c.status||'pending':null,tokens=F.badgeTokens(c);if(status){c=F.statusBadgeConfig(c);label=c.label;}const indicator=c.indicator||(c.dot?'dot':'none'),style=Object.entries(tokens).map(([key,id])=>`--badge-${key}:${F.v(id)}`).join(';');
 const icon=indicator.startsWith('icon')?`<span class="pp-badge-icon ${status==='progress'?'pp-status-spin':''}" aria-hidden="true">${I(c.iconName||'check',parseFloat(F.resolve(tokens.icon)))}</span>`:'';
 return `<span class="pp-badge ${status?'pp-status-badge':''} ${indicator==='icon-only'?'icon-only':''}" style="${style}" ${indicator==='icon-only'?`role="img" aria-label="${E(label)}"`:''}>${indicator==='dot'?'<span class="pp-dot" aria-hidden="true"></span>':indicator!=='icon-trailing'?icon:''}${indicator==='icon-only'?'':E(label)}${indicator==='icon-trailing'?icon:''}</span>`;
};
F.sourceInformation=(c={})=>{
 if(c.variant==='evidence')return F.informationEvidence(c);
 if(c.variant==='question')return F.evidenceBlock(c);
 if(c.variant==='profile')return F.profileTimeline(c);
 return F.informationBlock(c);
};
F.sourceInformationTokens=(c={})=>{
 if(c.variant==='evidence')return F.informationEvidenceTokens(c);
 if(c.variant==='question')return F.evidenceBlockTokens(c);
 if(c.variant==='profile')return F.profileTimelineTokens(c);
 return F.informationBlockTokens(c);
};
F.preview=(item,c)=>{const id='demo-'+(++serial),disabled=c.disabled||c.state==='disabled',attr=disabled?'disabled':'',fieldState=c.state||'default',fieldAttr=`${attr} ${fieldState==='readonly'?'readonly':''} ${fieldState==='invalid'?'aria-invalid="true"':''}`,inp=(type='text',extra='')=>`<input id="${id}" class="pp-input size-${c.size||'md'} state-${fieldState}" type="${type}" placeholder="${E(c.placeholder||'Enter a value')}" value="${E(c.value||'')}" aria-label="${E(c.label||item.name)}" ${fieldAttr} ${extra}>`,labelled=(html,helper='')=>`<div class="pp-field"><label for="${id}">${E(c.label||item.name)}${c.required?' <span class="pp-required" aria-hidden="true">*</span>':''}</label>${html}${helper?`<small id="${id}-help" class="pp-helper ${fieldState}">${E(helper)}</small>`:''}</div>`,select=(options,extra='')=>`<select class="pp-input" aria-label="${E(c.label||'Select option')}" ${attr} ${extra}>${options.map(x=>`<option ${x===c.value?'selected':''}>${E(x)}</option>`).join('')}</select>`;
 switch(item.id){
 case 'button':return F.button(c);
 case 'icon-button':return F.button({...c,icon:'only'},c.label);
 case 'input':return c.icon==='leading'?`<div class="pp-input-icon">${I(c.inputType==='email'?'mail':'search')}${inp(c.inputType)}</div>`:inp(c.inputType);
 case 'textarea':return `<textarea class="pp-input size-${c.size||'md'} state-${fieldState}" aria-label="${E(c.label||'Textarea')}" rows="${Math.max(2,Math.min(10,Number(c.rows)||4))}" placeholder="${E(c.placeholder||'Write something…')}" ${fieldAttr} style="resize:${c.resize?'vertical':'none'}">${E(c.value)}</textarea>`;
 case 'checkbox':return `<label class="pp-choice">${F.choiceControl('checkbox',`${c.checked?'checked':''} ${attr} ${c.indeterminate?'data-indeterminate':''}`)}${E(c.label)}</label>`;
 case 'radio':return `<fieldset class="pp-choice-group"><legend>${E(c.label)}</legend>${['Standard','Plus','Enterprise'].map(x=>`<label class="pp-choice">${F.choiceControl('radio',`name="${id}" value="${x}" ${x===c.selected?'checked':''} ${attr}`)}${x}</label>`).join('')}</fieldset>`;
 case 'switch':return `<label class="pp-choice"><input type="checkbox" role="switch" class="pp-switch size-${c.size}" ${c.checked?'checked':''} ${attr}>${E(c.label)}</label>`;
 case 'badge':return F.badge(c);
 case 'chip':return F.chip(c);
 case 'avatar':return F.avatar(c);
 case 'link':return F.link(c);
 case 'divider':return `<div class="pp-divider ${c.orientation}" role="separator" aria-orientation="${c.orientation}">${c.label?`<span>${E(c.label)}</span>`:''}</div>`;
 case 'spinner':return F.spinner(c);
 case 'progress':return F.progress(c);
 case 'skeleton':return `<div class="pp-skeleton-block ${c.animated?'animated':''}" aria-label="Loading content" role="status">${c.variant==='avatar'?'<div class="pp-skeleton sk-avatar"></div>':c.variant==='card'?'<div class="pp-skeleton sk-card"></div>':''}<div class="pp-skeleton"></div><div class="pp-skeleton" style="width:75%"></div><div class="pp-skeleton" style="width:50%"></div></div>`;
 case 'slider':return F.slider(c);
 case 'kbd':return F.kbd(c);
 case 'tag':return F.tagDemo(c);
 case 'toggle':return `<button class="pp-button secondary size-${c.size}" aria-pressed="${c.pressed}" data-toggle ${attr}>${E(c.label)}</button>`;
 case 'field':{const helper=fieldState==='invalid'?'Please enter a valid value.':fieldState==='success'?'Looks good.':c.helper;return labelled(inp('text',`${helper?`aria-describedby="${id}-help"`:''} ${c.required?'required':''}`),helper);}
 case 'select':return F.select(c);
 case 'combobox':return F.combobox(c);
 case 'multiselect':return `<fieldset class="pp-multiselect" ${attr}><legend>${E(c.placeholder)}</legend>${['Design','Research','Development','Strategy'].map((x,n)=>`<label class="pp-choice">${F.choiceControl('checkbox',`value="${x}" ${n===0?'checked':''} ${attr}`)}${x}</label>`).join('')}<div class="pp-selection-summary" role="group" aria-label="Selected skills">${F.chip({label:'Design',variant:'removable',tone:'blue',size:'sm',disabled})}</div><span class="visually-hidden" role="status" data-selection-announcement>1 selected</span></fieldset>`;
 case 'dropdown':return F.dropdownMenu(c);
 case 'tooltip':return F.tooltip(c);
 case 'popover':if(c.variant==='guided')return F.guidedPopover(c);if(['membership','sharing'].includes(c.variant))return F.sourceWorkspace(c);if(c.variant==='source')return F.aiCitation({variant:c.citationStyle||'inline',label:'S1',title:'Pitch deck',source:'Pitch deck · Page 4',body:'Recurring revenue increased as more customers adopted the platform.'});return `<div class="pp-popover-wrap">${F.button({variant:'secondary'},c.label,`data-popover-trigger aria-expanded="false" aria-controls="${id}-pop"`)}<div class="pp-popover" id="${id}-pop" hidden><div class="pp-popover-title"><strong>${E(c.title)}</strong><button aria-label="Close popover" class="pp-icon-close">${I('close')}</button></div><label class="pp-field">Width<input class="pp-input" type="number" value="320"></label><label class="pp-field">Height<input class="pp-input" type="number" value="180"></label></div></div>`;
 case 'tabs':return F.pitchTabs({...c,active:c.variant==='counted'?c.countedActive:c.active});
 case 'breadcrumb':return `<nav class="pp-breadcrumb" aria-label="Breadcrumb">${['Home','Library','Components','Button'].slice(0,Number(c.depth)).map((x,n,a)=>`${n?I('chevron',12):''}${n===a.length-1?`<span aria-current="page">${x}</span>`:`<a href="#breadcrumb" data-demo-link>${x}</a>`}`).join('')}</nav>`;
 case 'pagination':return F.pagination(c);
 case 'alert':return F.alert(c);
 case 'button-group':return F.buttonGroup(c);
 case 'date-picker':return F.datePicker(c);
 case 'accordion':return F.accordion(c);
 case 'drawer':return F.drawer(c);
 case 'modal':case 'alert-dialog':if(item.id==='modal'&&['decision','form-dialog'].includes(c.variant))return F.sourceShell(c);return `${F.button({variant:'secondary'},item.id==='alert-dialog'?'Open confirmation':'Open modal','data-dialog-open')}<dialog aria-labelledby="${id}-title" ${item.id==='alert-dialog'?`role="alertdialog" aria-describedby="${id}-description"`:''} class="pp-dialog  width-${c.size||'md'}"><div class="pp-dialog-header"><h3 id="${id}-title">${E(c.title)}</h3><button class="pp-icon-close" aria-label="Close dialog" data-dialog-close>${I('close')}</button></div><div class="pp-dialog-body">${item.id==='alert-dialog'?`<p id="${id}-description">This action will remove the selected item.</p>`:'<label class="pp-field">Name<input class="pp-input" placeholder="Enter a name" autofocus></label><label class="pp-field">Description<textarea class="pp-input" rows="3" placeholder="Add a description"></textarea></label>'}</div>${c.footer!==false?`<div class="pp-dialog-footer">${F.button({variant:'secondary'},'Cancel',`data-dialog-close ${item.id==='alert-dialog'?'autofocus':''}`)}${F.button({variant:item.id==='alert-dialog'&&c.destructive?'destructive':'primary'},item.id==='alert-dialog'?'Remove':'Save changes','data-dialog-save')}</div>`:''}</dialog>`;
 case 'card':return c.variant==='prompt'?F.promptSuggestions(c):F.noteCard(c);
 case 'stats-bar':return F.statsBar(c);
 case 'metric-card':return F.metricCard(c);
 case 'timeline':return F.profileTimeline({...c,variant:'timeline'});
 case 'suggestion':return F.aiFollowups(c);
 case 'information-block':return c.variant==='stacked'?F.stackedInformation(c):c.variant==='table'?F.informationTable(c):F.sourceInformation(c);
 case 'data-table':return F.pitchTable(c);
 case 'file-upload':if(c.variant==='logo-upload')return F.sourceShell(c);if(c.variant==='preview')return F.sourceShell({...c,variant:'file-preview'});return F.fileUpload(c);
 case 'empty-state':return `<div class="pp-empty">${I('layers',32)}<h3>${E(c.title)}</h3><p>${E(c.description)}</p>${c.action?F.button({},'Add item','data-notify="Item added to this preview"'):''}</div>`;
 case 'command-menu':return F.commandMenuPreview(c);
 case 'toast':return F.toastStack(c);
 case 'action-bar':return F.actionBarDemo(c);
 case 'filter-bar':return c.variant==='advanced'?F.sourceWorkspace({...c,variant:'advanced-filter'}):F.pitchFilterBar(c);
 case 'stepper':return F.stepper(c);
 case 'chart':return `<div class="pp-chart"><svg viewBox="0 0 440 210" role="img" aria-label="${c.variant==='bar'?'Bar':'Line'} chart with example values 30, 55, 40, 75, 60, 90"><g fill="none" stroke="var(--pp-semantic-border-default)">${c.showGrid?[40,80,120,160].map(y=>`<path d="M35 ${y}H430"/>`).join(''):''}</g>${c.variant==='bar'?[30,55,40,75,60,90].map((n,i)=>`<rect x="${50+i*62}" y="${180-n*1.6}" width="28" height="${n*1.6}" rx="4" fill="var(--pp-semantic-action-primary)"/>`).join(''):'<path d="M50 132 112 92 174 116 236 60 298 84 360 36" fill="none" stroke="var(--pp-semantic-action-primary)" stroke-width="2.5"/>'}<g fill="var(--pp-semantic-text-secondary)" font-size="11">${['Jan','Feb','Mar','Apr','May','Jun'].map((x,i)=>`<text x="${50+i*62}" y="204">${x}</text>`).join('')}</g></svg></div>`;
 case 'avatar-group':return F.avatarGroup(c);
 case 'text-shimmer':return F.textShimmer(c);
 case 'text-glow':return `<span class="pp-text-glow motion-element">${E(c.text)}</span>`;
 case 'streaming-text':return `<div class="pp-stream" data-text="${E(c.text)}"><span aria-hidden="true"></span><i aria-hidden="true"></i><span class="visually-hidden">${E(c.text)}</span></div>`;
 case 'ai-loader':return `<span role="status" aria-label="Thinking">${F.thinkingGrid(c)}</span>`;
 case 'thinking-dots':return `<div class="pp-row"><span class="pp-thinking-dots motion-element" aria-hidden="true"><i></i><i></i><i></i></span><span>${E(c.label)}</span></div>`;
 case 'waveform':return `<div class="pp-voice-preview" role="img" aria-label="Voice waveform animation">${F.voiceWaveform(c)}</div>`;
 case 'composer':return F.promptBar({...c,state:c.state==='loading'?'pending':c.state});
 case 'ai-response':return F.aiResponse(c);
 case 'ai-status':return c.variant==='research'?F.aiResearchActivity(c):c.variant==='search'?F.aiWebSearch(c):F.aiTaskRows(c);
 case 'form-layout':if(c.variant!=='basic')return F.sourceShell(c);return `<form class="pp-form"><div class="pp-form-grid cols-${c.columns}"><label class="pp-field">First name<input class="pp-input" required name="first" placeholder="First name"></label><label class="pp-field">Last name<input class="pp-input" required name="last" placeholder="Last name"></label><label class="pp-field">Email<input class="pp-input" type="email" required name="email" placeholder="you@example.com"></label><label class="pp-field">Role<select class="pp-input"><option>Designer</option><option>Engineer</option></select></label></div><div class="pp-form-actions">${F.button({variant:'secondary'},'Reset','type="reset"')}${F.button({},'Save profile','type="submit"')}</div><span class="form-result" role="status"></span></form>`;
 case 'settings-layout':if(c.variant!=='basic')return F.sourceShell(c);return `<form class="pp-form"><div class="pp-settings-row"><label for="${id}">Email notifications<small>Receive updates by email.</small></label><input id="${id}" class="pp-switch" type="checkbox" role="switch" checked></div><div class="pp-settings-row"><label for="${id}-2">Language</label><select class="pp-input" id="${id}-2"><option>English</option><option>Hindi</option></select></div><div class="pp-form-actions">${F.button({},'Save preferences','type="submit"')}</div><span class="form-result" role="status"></span></form>`;
 case 'navigation':return F.sourceShell({...c,variant:'navigation'});
 case 'conversation':return F.chatBubble(c);
 case 'evidence-trace':return F.sourceTrace(c);
 case 'account-flow':return F.sourceShell(c);
 default:return '';
 }
};
F.previewCleanups=[];
F.clearPreviews=()=>{F.previewCleanups.forEach(f=>f());F.previewCleanups=[];};
F.wirePreview=(root,item,c,reviewLabel='')=>{
 root.classList.toggle('preview-paused',c.playing===false);
 const q=s=>root.querySelector(s),qa=s=>[...root.querySelectorAll(s)];const listen=(el,type,fn)=>{if(el)el.addEventListener(type,fn);};
 F.wireAvatars(root,cleanup=>F.previewCleanups.push(cleanup));
 F.wireChips(root,cleanup=>F.previewCleanups.push(cleanup));
 F.wireSwitchMotion(root,cleanup=>F.previewCleanups.push(cleanup));
 F.wireMenus(root,cleanup=>F.previewCleanups.push(cleanup));
 F.enhanceSelects(root,cleanup=>F.previewCleanups.push(cleanup));
 F.wireFeedback(root,cleanup=>F.previewCleanups.push(cleanup));
 F.wireTooltip?.(root,cleanup=>F.previewCleanups.push(cleanup));
 F.wireDatePickers?.(root,cleanup=>F.previewCleanups.push(cleanup));
 F.wireFileUpload?.(root,cleanup=>F.previewCleanups.push(cleanup));
 F.wireDrawer?.(root,cleanup=>F.previewCleanups.push(cleanup));
 F.wireTags?.(root,cleanup=>F.previewCleanups.push(cleanup));
 F.wireNavigationControls?.(root,cleanup=>F.previewCleanups.push(cleanup));
 F.wireGuidedPopover?.(root,cleanup=>F.previewCleanups.push(cleanup));
 F.wireActionFeedback?.(root,cleanup=>F.previewCleanups.push(cleanup));
 F.wireSliders(root,cleanup=>F.previewCleanups.push(cleanup));
 F.wirePromptBar(root,cleanup=>F.previewCleanups.push(cleanup));
 F.wireAIResponse(root,cleanup=>F.previewCleanups.push(cleanup));
 F.wireDetailBlocks(root,cleanup=>F.previewCleanups.push(cleanup));
 F.wirePromptSuggestions(root,cleanup=>F.previewCleanups.push(cleanup));
 F.wirePitchTable(root,cleanup=>F.previewCleanups.push(cleanup));
 F.wirePitchFilterBar(root,cleanup=>F.previewCleanups.push(cleanup));
 for(const wire of ['wirePitchChatTable','wireCardPatterns','wireSourceShell','wireSourceWorkspace','wireSourceDetails','wireSourceTrace','wireSourceChat'])F[wire]?.(root,cleanup=>F.previewCleanups.push(cleanup));

 qa('[data-indeterminate]').forEach(x=>x.indeterminate=true);
 qa('[data-notify]').forEach(x=>listen(x,'click',()=>F.notify(x.dataset.notify)));
 qa('[data-demo-link]').forEach(x=>listen(x,'click',e=>{e.preventDefault();if(x.getAttribute('aria-disabled')!=='true')F.notify('Link activated');}));
 qa('[data-toggle]').forEach(x=>listen(x,'click',()=>x.setAttribute('aria-pressed',String(x.getAttribute('aria-pressed')!=='true'))));
 qa('[data-group]').forEach(x=>listen(x,'click',()=>qa('[data-group]').forEach(b=>b.setAttribute('aria-pressed',String(x===b)))));
 qa('[data-dismiss]').forEach(x=>listen(x,'click',()=>{x.parentElement.hidden=true;if(item.id==='toast')q('[data-toast-show]')?.focus();}));

 const pop=q('.pp-popover'),pt=q('[data-popover-trigger]');if(pop&&pt){const close=()=>{pop.hidden=true;pt.setAttribute('aria-expanded','false');};listen(pt,'click',()=>{pop.hidden=!pop.hidden;pt.setAttribute('aria-expanded',String(!pop.hidden));});listen(pop.querySelector('.pp-icon-close'),'click',()=>{close();pt.focus();});listen(root,'keydown',e=>{if(e.key==='Escape'&&!pop.hidden){e.preventDefault();close();pt.focus();}});const outside=e=>{if(!pt.parentElement.contains(e.target))close();};document.addEventListener('pointerdown',outside);F.previewCleanups.push(()=>document.removeEventListener('pointerdown',outside));}
 const mult=q('.pp-multiselect');if(mult){
  const summary=mult.querySelector('.pp-selection-summary'),announcement=mult.querySelector('[data-selection-announcement]'),choices=[...mult.querySelectorAll('input[type="checkbox"]')];
  const update=()=>{const selected=choices.filter(input=>input.checked);summary.innerHTML=selected.length?selected.map(input=>F.chip({label:input.value,variant:'removable',tone:'blue',size:'sm',disabled:input.disabled})).join(''):'<span class="pp-selection-empty">No skills selected</span>';announcement.textContent=selected.length+' selected';};
  listen(mult,'change',update);
  listen(summary,'click',event=>{const remove=event.target.closest('[data-chip-remove]');if(!remove||remove.disabled||mult.disabled)return;const input=choices.find(input=>input.value===remove.dataset.chipValue);if(!input||input.disabled)return;input.checked=false;update();announcement.textContent=input.value+' removed';input.focus();});
 }

 F.wirePitchTabs(root,cleanup=>F.previewCleanups.push(cleanup));
 const dialog=q('dialog'),trigger=q('[data-dialog-open]');if(dialog&&trigger){listen(trigger,'click',()=>{dialog.showModal();dialog.querySelector('[autofocus]')?.focus();});qa('[data-dialog-close]').forEach(b=>listen(b,'click',()=>dialog.close('cancel')));listen(q('[data-dialog-save]'),'click',()=>{dialog.close('confirm');F.notify(item.id==='alert-dialog'?'Item removed in preview':'Changes saved in preview');});listen(dialog,'click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close('cancel');}});listen(dialog,'close',()=>{if(trigger.isConnected)trigger.focus();});}
 const table=q('.pp-table');if(table&&!table.hasAttribute?.('data-pitch-chat-table')){
  const rows=()=>[...table.tBodies[0].rows],all=q('[data-select-all]');
  const updateSelection=()=>{const visible=rows().filter(r=>!r.hidden),boxes=visible.map(r=>r.querySelector('input[type="checkbox"]')).filter(Boolean),selected=boxes.filter(x=>x.checked).length,totalSelected=rows().filter(r=>r.querySelector('input[type="checkbox"]')?.checked).length;if(all){all.checked=boxes.length>0&&selected===boxes.length;all.indeterminate=selected>0&&selected<boxes.length;all.disabled=boxes.length===0;}q('.pp-table-status').textContent=(visible.length?`${visible.length} ${visible.length===1?'item':'items'}`:'No matching items')+(totalSelected?` · ${totalSelected} selected`:'');};
  listen(q('.table-search'),'input',e=>{rows().forEach(r=>r.hidden=!r.dataset.name.toLowerCase().includes(e.target.value.toLowerCase()));updateSelection();});
  const sort=q('[data-sort]');let asc=sort?.parentElement.getAttribute('aria-sort')==='descending';listen(sort,'click',()=>{const numeric=sort.dataset.sortKey==='score';rows().sort((a,b)=>{const comparison=numeric?Number(a.dataset.score)-Number(b.dataset.score):a.dataset.name.localeCompare(b.dataset.name);return asc?comparison:-comparison;}).forEach(r=>table.tBodies[0].append(r));sort.parentElement.setAttribute('aria-sort',asc?'ascending':'descending');asc=!asc;});
  qa('tbody input[type="checkbox"]').forEach(x=>listen(x,'change',updateSelection));listen(all,'change',e=>{rows().filter(r=>!r.hidden).forEach(r=>{const box=r.querySelector('input[type="checkbox"]');if(box)box.checked=e.target.checked;});updateSelection();});updateSelection();
 }
 const filters=q('.pp-filter-block');if(filters){const apply=()=>{const text=q('.filter-search')?.value.toLowerCase()||'',status=q('.filter-status').value;qa('[data-filter-name]').forEach(r=>r.hidden=!r.dataset.filterName.toLowerCase().includes(text)||(status!=='All statuses'&&r.dataset.filterStatus!==status));};listen(q('.filter-search'),'input',apply);listen(q('.filter-status'),'change',apply);listen(q('[data-filter-clear]'),'click',()=>{if(q('.filter-search'))q('.filter-search').value='';q('.filter-status').selectedIndex=0;F.syncSelects(root);apply();});}
 qa('form.pp-form').forEach(form=>listen(form,'submit',e=>{e.preventDefault();form.querySelector('.form-result').textContent='Saved in this preview.';}));

 const stream=q('.pp-stream');if(stream){
  let n=0,timer;const text=stream.dataset.text,span=stream.querySelector('span'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const complete=()=>{span.textContent=text;stream.classList.add('complete');if(timer)clearInterval(timer);};
  const preferenceChanged=()=>{if(reduced.matches)complete();};
  if(reduced.matches||c.playing===false)complete();else{if(F.paused){span.textContent=text;stream.classList.add('complete');}timer=setInterval(()=>{if(F.paused)return;stream.classList.remove('complete');n+=2;span.textContent=text.slice(0,n);if(n>=text.length)complete();},parseFloat(F.resolve('motion.duration.streamStep'))/(parseFloat(c.speed)||1));}
  reduced.addEventListener('change',preferenceChanged);F.previewCleanups.push(()=>{if(timer)clearInterval(timer);reduced.removeEventListener('change',preferenceChanged);});
 }

 const reviewCleanup=F.reviewStudio?.register(root,item,c,reviewLabel);if(reviewCleanup)F.previewCleanups.push(reviewCleanup);

};
