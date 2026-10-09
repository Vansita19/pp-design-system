/* Pagination and step indicators: shared Forma buttons, neutral navigation, local state. */
(() => {
 const F=window.Forma,E=F.escape;
 const aliases={
  'pagination.size':'space.32','pagination.gap':'space.8','pagination.radius':'radius.md','pagination.foreground':'semantic.text.secondary','pagination.current':'semantic.text.heading','pagination.surface':'semantic.surface.default','pagination.selected':'semantic.surface.subtle','pagination.border':'semantic.border.default','pagination.font':'font.size.13','pagination.weight':'font.weight.400',
  'stepper.indicator':'space.20','stepper.gap':'space.16','stepper.labelGap':'space.8','stepper.font':'font.size.13','stepper.line':'font.line.20','stepper.default':'semantic.text.secondary','stepper.active':'semantic.action.primary','stepper.complete':'semantic.status.success','stepper.surface':'semantic.surface.default','stepper.border':'semantic.border.default','stepper.dot':'space.8','stepper.dotSmall':'space.4','stepper.dotInactive':'color.gray.300','stepper.duration':'motion.duration.normal','stepper.easing':'motion.easing.standard'
 };
 for(const [key,target]of Object.entries(aliases))F.addToken('component.'+key,F.tokens[target].type,'{'+target+'}','normalized');
 const tokens=prefix=>Object.keys(aliases).filter(k=>k.startsWith(prefix+'.')).map(k=>'component.'+k);
 const baseTokens=['font.size.11','font.family.sans','border.width','font.weight.400','font.weight.500','radius.full','shadow.focus','semantic.text.heading','semantic.text.inverse','semantic.text.disabled','space.4','space.8','space.12','space.16','space.32','space.40'];
 F.paginationTokens=()=>[...new Set([...baseTokens,...tokens('pagination'),...Object.values(F.buttonTokens({variant:'ghost',size:'sm'})),...Object.values(F.buttonTokens({variant:'ghost',size:'sm',icon:'only'}))])];
 F.stepperTokens=()=>[...new Set([...baseTokens,...tokens('stepper'),...Object.values(F.buttonTokens({variant:'ghost',size:'sm'}))])];
 const bounded=(value,min,max,fallback=min)=>Math.min(max,Math.max(min,Number.isFinite(Number(value))?Math.floor(Number(value)):fallback));
 F.paginationRange=(page,total)=>{
  total=bounded(total,1,999,5);page=bounded(page,1,total);
  if(total<=7)return Array.from({length:total},(_,n)=>n+1);
  const set=new Set([1,total,page-1,page,page+1]);if(page<=3)[2,3,4,5].forEach(n=>set.add(n));if(page>=total-2)[total-4,total-3,total-2,total-1].forEach(n=>set.add(n));
  const values=[...set].filter(n=>n>0&&n<=total).sort((a,b)=>a-b),result=[];
  values.forEach((n,i)=>{const prev=values[i-1];if(i&&n-prev>2)result.push('ellipsis');else if(i&&n-prev===2)result.push(prev+1);result.push(n);});return result;
 };
 const pageButton=(page,current)=>F.button({variant:'ghost',size:'sm'},String(page),`data-pagination-page="${page}" aria-label="Page ${page}"${page===current?' aria-current="page"':''}`);
 const pageItems=(page,total)=>F.paginationRange(page,total).map(n=>n==='ellipsis'?'<span class="pp-pagination-ellipsis" aria-hidden="true">…</span>':pageButton(n,page)).join('');
 F.pagination=(c={})=>{
  const total=bounded(c.total,1,999,5),page=bounded(c.page,1,total),compact=Boolean(c.compact);
  return `<nav class="pp-pagination pp-page-navigation" data-pagination data-total="${total}" data-current="${page}" aria-label="Pagination">${F.button({variant:'ghost',size:'sm',icon:'only',iconName:'chevron',state:page===1?'disabled':'default'},'Previous page','data-pagination-prev')}<div class="pp-pagination-pages" ${compact?'data-pagination-compact':'data-pagination-pages'}>${compact?`<span class="pp-pagination-label">Page ${page} of ${total}</span>`:pageItems(page,total)}</div>${F.button({variant:'ghost',size:'sm',icon:'only',iconName:'chevron',state:page===total?'disabled':'default'},'Next page','data-pagination-next')}<span class="visually-hidden" role="status" data-pagination-status></span></nav>`;
 };
 const defaultSteps=['Details','Preferences','Review'];
 F.stepper=(c={})=>{
  const labels=Array.isArray(c.labels)&&c.labels.length?c.labels.slice(0,8).map(String):defaultSteps,active=labels.includes(c.step)?labels.indexOf(c.step):bounded(c.index,0,labels.length-1,1),dots=c.variant==='dots',vertical=!dots&&c.orientation==='vertical';
  return `<div class="pp-step-navigation ${dots?'is-dots':''} ${vertical?'is-vertical':''} ${c.dotSize==='xs'?'dots-small':''}" data-step-navigation data-current="${active}" aria-label="Progress"><ol class="pp-step-list">${labels.map((label,n)=>{
   const done=n<active,current=n===active,indicator=dots?'':`<span class="pp-step-indicator" data-step-indicator aria-hidden="true">${done?F.icon('check',12):n+1}</span>`,content=indicator+`<span class="pp-step-label">${E(label)}</span>`;
   const button=F.button({variant:'ghost',size:'sm',state:c.disabled?'disabled':'default'},label,`data-step-index="${n}" aria-label="Step ${n+1}: ${E(label)}${done?', completed':''}"${current?' aria-current="step"':''}`).replace('>'+E(label)+'</button>','>'+content+'</button>');
   return `<li data-step-item data-state="${done?'complete':current?'current':'pending'}">${button}${n<labels.length-1&&!dots?`<span class="pp-step-separator" aria-hidden="true">${F.icon('chevron',16)}</span>`:''}</li>`;
  }).join('')}</ol><span class="visually-hidden" data-step-status role="status"></span></div>`;
 };
 F.wireNavigationControls=(root,registerCleanup=()=>{})=>{
  const cleanups=[];
  root.querySelectorAll('[data-pagination]').forEach(host=>{
   const total=Number(host.dataset.total);let current=Number(host.dataset.current);
   const click=event=>{const button=event.target.closest?.('[data-pagination-prev],[data-pagination-next],[data-pagination-page]');if(!button||button.disabled||!host.contains(button))return;
    current=bounded(button.hasAttribute('data-pagination-prev')?current-1:button.hasAttribute('data-pagination-next')?current+1:button.dataset.paginationPage,1,total);host.dataset.current=String(current);
    const pages=host.querySelector('[data-pagination-pages]'),compact=host.querySelector('[data-pagination-compact]'),prev=host.querySelector('[data-pagination-prev]'),next=host.querySelector('[data-pagination-next]');
    if(pages){pages.innerHTML=pageItems(current,total);if(button.hasAttribute('data-pagination-page'))pages.querySelector(`[data-pagination-page="${current}"]`)?.focus();}
    if(compact)compact.textContent=`Page ${current} of ${total}`;
    prev.disabled=current===1;next.disabled=current===total;[prev,next].forEach(b=>{b.classList.toggle('state-disabled',b.disabled);b.classList.toggle('state-default',!b.disabled);});
    if(button.disabled)(pages?.querySelector(`[data-pagination-page="${current}"]`)||(button===prev?next:prev))?.focus();
    host.querySelector('[data-pagination-status]').textContent=`Page ${current} of ${total}`;
   };host.addEventListener('click',click);cleanups.push(()=>host.removeEventListener('click',click));
  });
  root.querySelectorAll('[data-step-navigation]').forEach(host=>{
   const buttons=[...host.querySelectorAll('[data-step-index]')],items=[...host.querySelectorAll('[data-step-item]')];
   const select=index=>{host.dataset.current=String(index);buttons.forEach((button,n)=>{const done=n<index,current=n===index;items[n].dataset.state=done?'complete':current?'current':'pending';if(current)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');const label=button.querySelector('.pp-step-label').textContent;button.setAttribute('aria-label',`Step ${n+1}: ${label}${done?', completed':''}`);const indicator=button.querySelector('[data-step-indicator]');if(indicator)indicator.innerHTML=done?F.icon('check',12):String(n+1);});host.querySelector('[data-step-status]').textContent=`Step ${index+1} of ${buttons.length}: ${buttons[index].querySelector('.pp-step-label').textContent}`;};
   const click=e=>{const b=e.target.closest?.('[data-step-index]');if(b&&!b.disabled&&host.contains(b))select(Number(b.dataset.stepIndex));};
   const key=e=>{const b=e.target.closest?.('[data-step-index]');if(!b||b.disabled)return;const vertical=host.classList.contains('is-vertical'),keys=vertical?['ArrowUp','ArrowDown']:['ArrowLeft','ArrowRight'];if(![...keys,'Home','End'].includes(e.key))return;e.preventDefault();const n=Number(b.dataset.stepIndex),next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(n+(e.key===keys[0]?-1:1)+buttons.length)%buttons.length;if(!buttons[next].disabled){select(next);buttons[next].focus();}};
   host.addEventListener('click',click);host.addEventListener('keydown',key);cleanups.push(()=>{host.removeEventListener('click',click);host.removeEventListener('keydown',key);});
  });
  registerCleanup(()=>cleanups.forEach(fn=>fn()));
 };
 document.getElementById('project-tokens').textContent=F.tokenCSS();
})();
