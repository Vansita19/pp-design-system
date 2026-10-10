/* Loading indicators share the existing spacing, color, and motion scales.
   The segmented shape follows the supplied eight-spoke reference. */
(() => {
 const F=window.Forma;
 F.addToken('border.width.spinner','dimension','1.7px','existing');
 const tones={neutral:'color.gray.400',blue:'color.blue.600',success:'color.green.500',warning:'color.orange.500',danger:'color.red.500'};
 for(const [tone,token] of Object.entries(tones))F.addToken(`semantic.loading.${tone}`,'color',`{${token}}`,'normalized');
 const component={
  'size.sm':'space.12','size.md':'space.16','size.lg':'space.24',
  stroke:'border.width.spinner',radius:'radius.full',duration:'motion.duration.spin',
  'segment.canvas':'space.24','segment.start':'space.2','segment.end':'space.6','segment.stroke':'space.2'
 };
 for(const [role,token] of Object.entries(component))F.addToken(`component.spinner.${role}`,F.tokens[token].type,`{${token}}`,'normalized');
 for(const tone of Object.keys(tones))F.addToken(`component.spinner.${tone}.foreground`,'color',`{semantic.loading.${tone}}`,'normalized');
 const config=c=>({
  variant:c.variant==='segmented'?'segmented':'ring',
  size:['sm','lg'].includes(c.size)?c.size:'md',
  tone:Object.hasOwn(tones,c.tone)?c.tone:'neutral',
  label:String(c.label??'').trim()||'Loading'
 });
 F.spinnerTokens=(c={})=>{
  const v=config(c);
  return [`component.spinner.size.${v.size}`,`component.spinner.${v.tone}.foreground`,'component.spinner.duration',
   ...(v.variant==='segmented'?['canvas','start','end','stroke'].map(key=>'component.spinner.segment.'+key):['component.spinner.stroke','component.spinner.radius'])];
 };
 F.spinner=(c={})=>{
  const v=config(c),style=`--spinner-size:${F.v('component.spinner.size.'+v.size)};--spinner-color:${F.v('component.spinner.'+v.tone+'.foreground')}`;
  let visual;
  if(v.variant==='segmented'){
   const dimension=role=>parseFloat(F.resolve('component.spinner.segment.'+role)),canvas=dimension('canvas'),center=canvas/2;
   visual=`<svg class="pp-spinner-segmented" viewBox="0 0 ${canvas} ${canvas}" aria-hidden="true" focusable="false">${Array.from({length:8},(_,index)=>`<line class="pp-spinner-spoke" x1="${center}" y1="${dimension('start')}" x2="${center}" y2="${dimension('end')}" transform="rotate(${index*45} ${center} ${center})" style="--spoke-index:${index}"></line>`).join('')}</svg>`;
  }else visual='<span class="pp-spinner pp-spinner-ring" aria-hidden="true"></span>';
  return `<span class="pp-spinner-status" role="status" aria-live="polite" aria-atomic="true" style="${style}">${visual}<span class="visually-hidden">${F.escape(v.label)}</span></span>`;
 };
 document.getElementById('project-tokens').textContent=F.tokenCSS();
})();
