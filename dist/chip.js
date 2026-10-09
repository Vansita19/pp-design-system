/* Chips represent selected values and optional actions; badges remain labels. */
(() => {
 const F=window.Forma;
 if(!F.tokens['size.22'])F.addToken('size.22','dimension','22px','existing');
 const geometry={radius:'radius.full',gap:'space.6',weight:'font.weight.400',focus:'shadow.focus',duration:'motion.duration.fast',
  'height.sm':'space.24','height.md':'space.28','height.lg':'space.32',
  'font.sm':'font.size.12','font.md':'font.size.13','font.lg':'font.size.14',
  'line.sm':'font.line.16','line.md':'font.line.20','line.lg':'font.line.20',
  'padding.sm':'space.8','padding.md':'space.12','padding.lg':'space.12',
  'icon.sm':'space.12','icon.md':'size.14','icon.lg':'space.16',
  'remove.size.sm':'space.20','remove.size.md':'space.24','remove.size.lg':'space.28',
  'filter.height':'size.22','filter.font':'font.size.13','filter.line':'font.line.18','filter.padding':'space.6','filter.radius':'radius.md','filter.gap':'space.4','filter.icon':'space.12','filter.removeSize':'space.16','filter.removeGap':'space.4',
  'remove.icon':'space.16','remove.inset':'space.2','remove.background':'color.transparent',
  'unselected.background':'semantic.surface.default','unselected.foreground':'semantic.text.body','unselected.border':'semantic.border.default',
  'disabled.background':'semantic.surface.disabled','disabled.foreground':'semantic.text.disabled','disabled.border':'semantic.border.default'};
 for(const [role,token]of Object.entries(geometry))F.addToken(`component.chip.${role}`,F.tokens[token].type,`{${token}}`,'normalized');
 for(const tone of Object.keys(F.badgeTones))for(const role of ['background','foreground'])F.addToken(`component.chip.${tone}.${role}`,'color',`{semantic.badge.${tone}.${role}}`,'normalized');
 const normalize=c=>({
  label:String(c.label??'').trim()||'Label',value:String(c.value??c.label??'Label'),
  variant:['selectable','static','filter'].includes(c.variant)?c.variant:'removable',
  tone:Object.hasOwn(F.badgeTones,c.tone)?c.tone:'neutral',size:c.variant==='filter'?'md':['sm','lg'].includes(c.size)?c.size:'md',
  selected:c.selected!==false,disabled:Boolean(c.disabled),icon:c.icon==='leading'?'leading':'none',
  iconName:Object.hasOwn(F.icons,c.iconName)?c.iconName:'check'
 });
 const tokenMap=v=>({
  height:`component.chip.height.${v.size}`,font:`component.chip.font.${v.size}`,line:`component.chip.line.${v.size}`,
  padding:`component.chip.padding.${v.size}`,radius:'component.chip.radius',gap:'component.chip.gap',weight:'component.chip.weight',
  background:`component.chip.${v.disabled?'disabled':v.tone}.background`,foreground:`component.chip.${v.disabled?'disabled':v.tone}.foreground`,
  border:v.disabled?'component.chip.disabled.border':'color.transparent',
  ...(v.icon==='leading'||['removable','filter'].includes(v.variant)?{icon:`component.chip.icon.${v.size}`}:{ }),
  ...(v.variant==='filter'?Object.fromEntries(['height','font','line','padding','radius','gap','icon'].map(role=>[role,'component.chip.filter.'+role])):{}),
  ...(v.variant==='filter'?{borderWidth:'space.0'}:{})
 });
 F.chipTokens=(c={})=>{
  const v=normalize(c),ids=['font.family.sans',...(v.variant==='filter'?[]:['border.width']),...Object.values(tokenMap(v))];
  if(v.variant==='selectable')ids.push('component.chip.unselected.background','component.chip.unselected.foreground','component.chip.unselected.border');
  if(['removable','filter'].includes(v.variant))ids.push('component.chip.remove.icon');
  if(v.variant==='removable')ids.push(`component.chip.remove.size.${v.size}`,'component.chip.remove.inset','component.chip.remove.background');
  if(v.variant==='filter')ids.push('component.chip.filter.removeSize','component.chip.filter.removeGap','component.chip.remove.background');
  if(v.variant!=='static')ids.push('component.chip.focus','component.chip.duration');
  return [...new Set(ids)];
 };
 F.chip=(c={})=>{
  const v=normalize(c),map=tokenMap(v),style=Object.entries(map).map(([key,id])=>`--chip-${key}:${F.v(id)}`).join(';')+`;--chip-remove-size:${F.v(v.variant==='filter'?'component.chip.filter.removeSize':'component.chip.remove.size.'+v.size)}`;
  const common=`class="pp-chip pp-chip-${v.variant}${v.variant==='filter'?' pp-chip-removable':''}" style="${style}" data-chip data-chip-value="${F.escape(v.value)}"${v.disabled?' data-disabled="true"':''}`;
  const content=`${v.icon==='leading'?`<span class="pp-chip-icon" aria-hidden="true">${F.icon(v.iconName,Number.parseFloat(F.resolve(map.icon)))}</span>`:''}<span class="pp-chip-label">${F.escape(v.label)}</span>`;
  if(v.variant==='selectable')return `<button type="button" ${common} data-chip-select aria-pressed="${v.selected}"${v.disabled?' disabled':''}>${content}</button>`;
  const remove=['removable','filter'].includes(v.variant)?`<button type="button" class="pp-chip-remove" data-chip-remove data-chip-value="${F.escape(v.value)}" aria-label="Remove ${F.escape(v.label)}"${v.disabled?' disabled':''}>${F.icon('close',Number.parseFloat(F.resolve('component.chip.remove.icon')))}</button>`:'';
  return `<span ${common}>${content}${remove}</span>`;
 };
 F.wireChips=(root,registerCleanup)=>{
  let addedTabIndex=false;
  const handler=event=>{
   if(event.defaultPrevented)return;
   const button=event.target.closest?.('[data-chip-remove],[data-chip-select]');
   if(!button||!root.contains(button)||(button.closest('.pp-multiselect')||button.closest('[data-pp-menu="combobox"]')||button.closest('[data-pitch-inbox]')||button.closest('[data-pitch-chat]'))||button.disabled)return;
   if(button.hasAttribute('data-chip-select')){
    button.setAttribute('aria-pressed',String(button.getAttribute('aria-pressed')!=='true'));
    return;
   }
   const chip=button.closest('[data-chip]');if(!chip)return;
   const actions=Array.from(root.querySelectorAll('[data-chip-remove],[data-chip-select]')).filter(el=>!el.disabled&&!el.closest('.pp-multiselect')&&!el.closest('[data-pp-menu="combobox"]')&&!el.closest('[data-pitch-inbox]')&&!el.closest('[data-pitch-chat]'));
   const index=actions.indexOf(button),next=actions[index+1]||actions[index-1];
   chip.remove();
   if(next)next.focus({preventScroll:true});
   else{
    if(!root.hasAttribute('tabindex')){root.setAttribute('tabindex','-1');addedTabIndex=true;}
    root.focus({preventScroll:true});
   }
  };
  root.addEventListener('click',handler);
  const cleanup=()=>{root.removeEventListener('click',handler);if(addedTabIndex&&root.getAttribute('tabindex')==='-1')root.removeAttribute('tabindex');};
  if(typeof registerCleanup==='function')registerCleanup(cleanup);
  return cleanup;
 };
 document.getElementById('project-tokens').textContent=F.tokenCSS();
})();
