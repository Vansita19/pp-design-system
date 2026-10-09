/* AlignUI-inspired calendar composition, implemented with native date arithmetic and Forma atoms. */
(() => {
 const F=window.Forma,E=F.escape,mounted=new WeakMap();let serial=0;
 const aliases={background:'semantic.surface.default',foreground:'semantic.text.body',muted:'semantic.text.secondary',outside:'semantic.text.disabled',border:'semantic.border.default',radius:'radius.xl',padding:'space.16',gap:'space.8',daySize:'space.36',dayRadius:'radius.md',font:'font.size.13',line:'font.line.20',caption:'semantic.surface.canvas',hover:'semantic.surface.subtle',selected:'semantic.action.primary',selectedText:'semantic.text.inverse',range:'color.blue.50',rangeText:'color.blue.700',focus:'semantic.border.focus',shadow:'shadow.menu'};
 for(const [role,target]of Object.entries(aliases))F.addToken('component.date.'+role,F.tokens[target].type,`{${target}}`,'normalized');
 F.addToken('layout.content.calendar','dimension','320px','extended');F.addToken('component.date.width','dimension','{layout.content.calendar}','normalized');
 const date=(year,month,day)=>new Date(Date.UTC(year,month,day,12));
 const iso=d=>`${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;
 const parse=value=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(String(value)))return null;const [y,m,d]=value.split('-').map(Number),v=date(y,m-1,d);return y>=1900&&y<=2099&&iso(v)===value?v:null;};
 const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
 const addDays=(value,n)=>{const d=parse(value);d.setUTCDate(d.getUTCDate()+n);return iso(d);};
 const addMonths=(value,n)=>{const d=parse(value),last=date(d.getUTCFullYear(),d.getUTCMonth()+n+1,0).getUTCDate();return iso(date(d.getUTCFullYear(),d.getUTCMonth()+n,Math.min(d.getUTCDate(),last)));};
 const monthOf=value=>value.slice(0,7);
 const labelOf=value=>parse(value)?.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'})||'';
 const clamp=(value,min,max)=>value<min?min:value>max?max:value;
 F.datePickerState=(c={})=>{
  let min=parse(c.min)?c.min:'1900-01-01',max=parse(c.max)?c.max:'2099-12-31';if(min>max)[min,max]=[max,min];
  const variant=c.variant==='range'?'range':'single',seed=clamp('2026-10-09',min,max);
  let start=c.start===''||c.value===''?'':clamp(parse(c.start||c.value)?c.start||c.value:seed,min,max),end=variant==='range'?(c.end===''?'':clamp(parse(c.end)?c.end:addDays(start||seed,6),min,max)):'';
  if(!start)end='';if(end&&end<start)[start,end]=[end,start];
  return {variant,display:c.display==='popover'?'popover':'inline',footer:c.footer!==false,presets:Boolean(c.presets),disabled:Boolean(c.disabled),label:String(c.label||'Date'),name:String(c.name||'date'),min,max,start,end,focus:start||seed,month:monthOf(start||seed),today:parse(c.today)?c.today:today()};
 };
 F.datePickerMove=(value,key,{min='1900-01-01',max='2099-12-31',shiftKey=false}={})=>{
  const weekday=parse(value).getUTCDay();let result=value;
  if(key==='ArrowLeft')result=addDays(value,-1);if(key==='ArrowRight')result=addDays(value,1);if(key==='ArrowUp')result=addDays(value,-7);if(key==='ArrowDown')result=addDays(value,7);
  if(key==='Home')result=addDays(value,-weekday);if(key==='End')result=addDays(value,6-weekday);
  if(key==='PageUp')result=addMonths(value,shiftKey?-12:-1);if(key==='PageDown')result=addMonths(value,shiftKey?12:1);
  return clamp(result,min,max);
 };
 F.datePickerChoose=(state,value)=>{
  if(state.disabled||!parse(value)||value<state.min||value>state.max)return false;
  if(state.variant==='single'){state.start=value;state.end='';}
  else if(!state.start||state.end){state.start=value;state.end='';}else{state.end=value;if(state.end<state.start)[state.start,state.end]=[state.end,state.start];}
  state.focus=value;state.month=monthOf(value);return true;
 };
 F.datePickerTokens=(c={})=>[...Object.keys(F.tokens).filter(id=>id.startsWith('component.date.')&&((c.variant==='range')||!['component.date.range','component.date.rangeText'].includes(id))),'font.family.sans','font.weight.500','border.width','space.4','space.8','space.12','space.16','space.32','font.size.12','radius.sm',...Object.values(F.buttonTokens({variant:'ghost',size:'sm',icon:'only',state:c.disabled?'disabled':'default'})),...(c.display==='popover'?Object.values(F.buttonTokens({variant:'secondary',size:'md',state:c.disabled?'disabled':'default'})):[]),...(c.footer!==false||c.presets?Object.values(F.buttonTokens({variant:'ghost',size:'sm',state:c.disabled?'disabled':'default'})):[])];
 const summary=s=>s.start?(s.variant==='range'?labelOf(s.start)+(s.end?' – '+labelOf(s.end):' – Choose end date'):labelOf(s.start)):'Select '+(s.variant==='range'?'a date range':'a date');
 const button=(s,label,action,icon)=>F.button({variant:'ghost',size:'sm',state:s.disabled?'disabled':'default',...(icon?{icon:'only',iconName:icon}:{})},label,`data-date-action="${action}"`);
 function calendar(s,id){
  const first=parse(s.month+'-01'),start=date(first.getUTCFullYear(),first.getUTCMonth(),1-first.getUTCDay()),monthLabel=first.toLocaleDateString('en-US',{month:'long',year:'numeric',timeZone:'UTC'}),days=[];
  for(let i=0;i<42;i++){
   const d=date(start.getUTCFullYear(),start.getUTCMonth(),start.getUTCDate()+i),value=iso(d),outside=monthOf(value)!==s.month,disabled=s.disabled||value<s.min||value>s.max,selected=value===s.start||value===s.end,middle=Boolean(s.end&&value>s.start&&value<s.end),current=value===s.today;
   days.push(`<td role="gridcell" aria-selected="${selected||middle}" class="${middle?'is-range ':''}${s.end&&value===s.start?'is-start ':''}${s.end&&value===s.end?'is-end':''}"><button type="button" class="pp-date-day ${outside?'is-outside ':''}${selected?'is-selected ':''}${current?'is-today':''}" data-date-day="${value}" aria-label="${E(d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric',timeZone:'UTC'}))}"${current?' aria-current="date"':''} tabindex="${!disabled&&value===s.focus?'0':'-1'}"${disabled?' disabled':''}>${d.getUTCDate()}</button></td>`);
  }
  const previous=s.month===s.min.slice(0,7),next=s.month===s.max.slice(0,7);
  return `<div class="pp-date-caption">${button({...s,disabled:s.disabled||previous},'Previous month','previous','chevron')}<strong id="${id}-month" aria-live="polite">${monthLabel}</strong>${button({...s,disabled:s.disabled||next},'Next month','next','chevron')}</div>${s.presets?`<div class="pp-date-presets" aria-label="Date presets">${button({...s,disabled:s.disabled||s.today<s.min||s.today>s.max},'Today','today')}${s.variant==='range'?button(s,'Next 7 days','week'):''}</div>`:''}<table class="pp-date-grid" role="grid" aria-labelledby="${id}-month"${s.variant==='range'?' aria-multiselectable="true"':''}><thead><tr>${['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map(day=>`<th scope="col" abbr="${day}">${day.slice(0,2)}</th>`).join('')}</tr></thead><tbody>${Array.from({length:6},(_,i)=>'<tr>'+days.slice(i*7,i*7+7).join('')+'</tr>').join('')}</tbody></table>${s.footer?`<footer class="pp-date-footer">${button({...s,disabled:s.disabled||s.today<s.min||s.today>s.max},'Today','today')}${button(s,'Clear','clear')}</footer>`:''}`;
 }
 F.datePicker=(c={})=>{
  const s=F.datePickerState(c),id='pp-date-'+(++serial),popup=s.display==='popover';
  return `<div class="pp-date-picker" data-date-picker data-date-id="${id}" data-date-config="${E(JSON.stringify(s))}"${s.disabled?' data-disabled="true"':''}><span class="pp-date-label" id="${id}-label">${E(s.label)}</span>${popup?F.button({variant:'secondary',state:s.disabled?'disabled':'default',icon:'leading',iconName:'calendar'},summary(s),`data-date-open aria-haspopup="dialog" aria-expanded="false" aria-controls="${id}-panel"`):`<output class="pp-date-selection" data-date-summary>${E(summary(s))}</output>`}<div class="pp-date-panel pp-theme" id="${id}-panel" data-date-panel${popup?' role="dialog" aria-modal="false" aria-labelledby="'+id+'-label" popover="manual" hidden':''}>${calendar(s,id)}</div><input type="hidden" data-date-value name="${E(s.name)}" value="${E(s.start)}"${s.disabled?' disabled':''}>${s.variant==='range'?`<input type="hidden" data-date-end name="${E(s.name)}End" value="${E(s.end)}"${s.disabled?' disabled':''}>`:''}<span class="visually-hidden" role="status" aria-live="polite" data-date-status></span></div>`;
 };
 F.wireDatePickers=(root,registerCleanup=()=>{})=>{
  const cleanups=[];
  root.querySelectorAll('[data-date-picker]').forEach(host=>{
   if(mounted.has(host)){cleanups.push(mounted.get(host));return;}
   const doc=host.ownerDocument||document,win=doc.defaultView||window,s=JSON.parse(host.dataset.dateConfig),id=host.dataset.dateId,panel=host.querySelector('[data-date-panel]'),trigger=host.querySelector('[data-date-open]'),value=host.querySelector('[data-date-value]'),end=host.querySelector('[data-date-end]'),output=host.querySelector('[data-date-summary]'),status=host.querySelector('[data-date-status]');
   const initial={...s},listeners=[];let opened=false,topLayer=false;
   const on=(node,type,fn,options)=>{node.addEventListener(type,fn,options);listeners.push(()=>node.removeEventListener(type,fn,options));};
   const position=()=>{if(!opened)return;const r=trigger.getBoundingClientRect(),width=Math.min(parseFloat(F.resolve('component.date.width')),win.innerWidth-16),height=panel.getBoundingClientRect().height,below=win.innerHeight-r.bottom-8;panel.style.width=width+'px';panel.style.left=Math.max(8,Math.min(r.left,win.innerWidth-width-8))+'px';panel.style.top=Math.max(8,height>below?r.top-height-8:r.bottom+8)+'px';panel.style.maxHeight=(win.innerHeight-16)+'px';};
   const close=(restore=false)=>{if(!opened)return;opened=false;if(topLayer){try{panel.hidePopover();}catch{}topLayer=false;}panel.hidden=true;trigger.setAttribute('aria-expanded','false');if(restore&&trigger.isConnected)trigger.focus({preventScroll:true});};
   const render=(focusTarget)=>{panel.innerHTML=calendar(s,id);if(output)output.textContent=summary(s);if(trigger){const text=trigger.querySelector('[data-date-trigger-label]');if(text)text.textContent=summary(s);else{const icon=F.icon('calendar',16);trigger.innerHTML=icon+'<span data-date-trigger-label>'+E(summary(s))+'</span>';}}position();if(focusTarget){const target=panel.querySelector(focusTarget),fallback=panel.querySelector('[data-date-day="'+s.focus+'"]');(target&&!target.disabled?target:fallback)?.focus({preventScroll:true});}};
   const announce=()=>{value.value=s.start;if(end)end.value=s.end;status.textContent=summary(s);value.dispatchEvent(new win.Event('change',{bubbles:true}));};
   const open=()=>{if(s.disabled||opened)return;opened=true;panel.hidden=false;try{if(panel.showPopover){panel.showPopover();topLayer=true;}}catch{}trigger.setAttribute('aria-expanded','true');position();panel.querySelector('[data-date-day="'+s.focus+'"]')?.focus({preventScroll:true});};
   if(trigger)on(trigger,'click',()=>opened?close(true):open());
   on(panel,'click',event=>{
    const day=event.target.closest('[data-date-day]'),action=event.target.closest('[data-date-action]');if(s.disabled||day?.disabled||action?.disabled)return;
    if(day){if(!F.datePickerChoose(s,day.dataset.dateDay))return;render('[data-date-day="'+s.focus+'"]');announce();if(trigger&&(s.variant==='single'||s.end))close(true);return;}
    if(!action)return;const name=action.dataset.dateAction;
    if(name==='previous'||name==='next'){s.focus=F.datePickerMove(s.focus,name==='previous'?'PageUp':'PageDown',s);s.month=monthOf(s.focus);render('[data-date-action="'+name+'"]');return;}
    if(name==='clear'){s.start='';s.end='';}
    if(name==='today'||name==='week'){const start=clamp(s.today,s.min,s.max);s.start=start;s.end=s.variant==='range'?(name==='week'?clamp(addDays(start,6),s.min,s.max):start):'';s.focus=start;s.month=monthOf(start);}
    render('[data-date-day="'+s.focus+'"]');announce();
   });
   on(panel,'keydown',event=>{if(s.disabled||event.isComposing)return;const day=event.target.closest('[data-date-day]');if(day&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown'].includes(event.key)){event.preventDefault();s.focus=F.datePickerMove(day.dataset.dateDay,event.key,{...s,shiftKey:event.shiftKey});s.month=monthOf(s.focus);render('[data-date-day="'+s.focus+'"]');}else if(event.key==='Escape'&&opened){event.preventDefault();event.stopPropagation();close(true);}});
   on(doc,'pointerdown',event=>{if(opened&&!host.contains(event.target))close();});on(doc,'focusin',event=>{if(opened&&!host.contains(event.target))close();});
   on(win,'resize',position);on(doc,'scroll',event=>{if(!panel.contains(event.target))position();},true);
   const form=host.closest('form');if(form)on(form,'reset',()=>{Object.assign(s,initial);close();render();value.value=s.start;if(end)end.value=s.end;status.textContent='';});
   const cleanup=()=>{close();listeners.splice(0).forEach(remove=>remove());mounted.delete(host);};mounted.set(host,cleanup);cleanups.push(cleanup);
  });
  const cleanup=()=>cleanups.forEach(fn=>fn());registerCleanup(cleanup);return cleanup;
 };
 document.getElementById('project-tokens').textContent=F.tokenCSS();
})();
