/* Raised content tags have their own source, renderer and public token contract. */
(() => {
 const F=window.Forma,E=F.escape;
 // Preserve the existing PP raised geometry while giving it the correct family name.
 for(const [id,token]of Object.entries(F.tokens).filter(([id])=>id.startsWith('component.badge.raised.'))){
  const next=id.replace('component.badge.raised.','component.tag.');
  F.addToken(next,token.type,token.value.replace('semantic.badge.raised.','semantic.tag.'),'existing');
  F.addToken(id,token.type,'{'+next+'}','normalized');
 }
 for(const [role,target]of Object.entries({background:'semantic.surface.default',neutralForeground:'color.gray.600',blueForeground:'color.blue.500'}))F.addToken('semantic.tag.'+role,'color','{'+target+'}','existing');
 const aliases={gap:'space.6',icon:'space.12',dot:'space.6',border:'semantic.border.default',disabled:'semantic.text.disabled',subtle:'semantic.surface.subtle'};
 for(const [role,target]of Object.entries(aliases))F.addToken('component.tag.'+role,F.tokens[target].type,'{'+target+'}','normalized');
 F.tagTokens=(c={})=>{
  const suffix=['sm','lg'].includes(c.size)?'.'+c.size:'',tone=F.badgeTones[c.tone]?c.tone:'neutral';
  const map={};for(const role of ['height','font','padding','line'])map[role]='component.tag.'+role+suffix;
  for(const role of ['radius','weight','gap','shadow','background'])map[role]='component.tag.'+role;
  map.foreground=c.disabled||c.state==='inactive'?'component.tag.disabled':['neutral','blue'].includes(tone)?'component.tag.'+tone+'Foreground':'semantic.badge.'+tone+'.foreground';
  if(c.variant==='outline'){map.shadow='shadow.none';map.border='component.tag.border';}else if(c.variant==='subtle'){map.shadow='shadow.none';map.background='component.tag.subtle';}
  if(c.icon||String(c.indicator||'').startsWith('icon'))map.icon='component.tag.icon';if(c.indicator==='dot')map.dot='component.tag.dot';
  return map;
 };
 F.tag=(c={},label=c.label||'Overview')=>{
  const t=F.tagTokens(c),style=Object.entries(t).map(([key,id])=>`--tag-${key}:${F.v(id)}`).join(';'),icon=c.icon||String(c.indicator||'').startsWith('icon');
  return `<span class="pp-tag" data-tag style="${style}"${c.disabled?' aria-disabled="true"':''}>${c.indicator==='dot'?'<span class="pp-tag-dot" aria-hidden="true"></span>':icon?F.icon(c.iconName||'file',12):''}<span>${E(label)}</span>${c.removable?F.button({variant:'ghost',size:'sm',icon:'only',iconName:'close',state:c.disabled?'disabled':'default'},'Remove '+label,'data-tag-remove'):''}</span>`;
 };
 F.tagContract=(c={})=>[...new Set(['font.family.sans','border.width','space.16','shadow.focus',...Object.values(F.tagTokens(c)),...(c.removable?Object.values(F.buttonTokens({variant:'ghost',size:'sm',icon:'only',state:c.disabled?'disabled':'default'})):[])])];
 F.tagDemo=(c={})=>`<div class="pp-tag-demo">${F.tag(c)}<span role="status" class="visually-hidden" data-tag-status></span></div>`;
 F.wireTags=(root,registerCleanup=()=>{})=>{const click=e=>{const button=e.target.closest?.('[data-tag-remove]');if(!button||button.disabled||!root.contains(button))return;const tag=button.closest('[data-tag]'),host=tag.parentElement,status=host.querySelector('[data-tag-status]');if(status)status.textContent=button.getAttribute('aria-label').replace(/^Remove /,'')+' removed.';const next=tag.nextElementSibling?.querySelector?.('button')||tag.previousElementSibling?.querySelector?.('button');tag.remove();if(next)next.focus();else{host.tabIndex=-1;host.focus?.();}};root.addEventListener('click',click);registerCleanup(()=>root.removeEventListener('click',click));};
 document.getElementById('project-tokens').textContent=F.tokenCSS();
})();
