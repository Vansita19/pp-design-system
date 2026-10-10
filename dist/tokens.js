/* Pitch Protocol values: investor-preview/color-tokens.js + onboarding-system.css.
   Semantic normalization and extensions are documented in docs/source-audit.md. */
window.Forma = {};
const F = window.Forma;
F.escape = value => String(value ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
F.tokens = {};
F.addToken = (id,type,value,source='existing') => F.tokens[id]={type,value,source};
F.addToken('icon.stroke.small','dimension','1.25px','improved');
F.addToken('icon.stroke.large','dimension','1.5px','improved');
F.addToken('icon.size.threshold','dimension','16px','improved');
F.palettes={
  gray:{white:'#FFFFFF',50:'#FAFAFA',100:'#F5F5F5',200:'#E5E5E5',300:'#D4D4D4',400:'#A3A3A3',500:'#737373',600:'#525252',700:'#404040',800:'#262626',900:'#171717',950:'#0A0A0A'},
  blue:{50:'#EFF6FF',100:'#DBEAFE',200:'#BFDBFE',300:'#93C5FD',400:'#60A5FA',500:'#3B82F6',600:'#2563EB',700:'#1D4ED8',800:'#1E40AF',900:'#1E3A8A',950:'#172554'},
  green:{50:'#F0FDF4',100:'#DCFCE7',200:'#BBF7D0',300:'#86EFAC',400:'#4ADE80',500:'#22C55E',600:'#16A34A',700:'#15803D',800:'#166534',900:'#14532D',950:'#052E16'},
  red:{50:'#FEF2F2',100:'#FEE2E2',200:'#FECACA',300:'#FCA5A5',400:'#F87171',500:'#EF4444',600:'#DC2626',700:'#B91C1C',800:'#991B1B',900:'#7F1D1D',950:'#450A0A'},
  purple:{50:'#FAF5FF',100:'#F3E8FF',200:'#E9D5FF',300:'#D8B4FE',400:'#C084FC',500:'#A855F7',600:'#9333EA',700:'#7E22CE',800:'#6B21A8',900:'#581C87',950:'#3B0764'},
  amber:{50:'#FFFBEB',100:'#FEF3C7',200:'#FDE68A',300:'#FCD34D',400:'#FBBF24',500:'#F59E0B',600:'#D97706',700:'#B45309',800:'#92400E',900:'#78350F',950:'#451A03'},
  orange:{50:'#FFF7ED',100:'#FFEDD5',200:'#FED7AA',300:'#FDBA74',400:'#FB923C',500:'#F97316',600:'#EA580C',700:'#C2410C',800:'#9A3412',900:'#7C2D12',950:'#431407'},
  sky:{50:'#F0F9FF',100:'#E0F2FE',200:'#BAE6FD',300:'#7DD3FC',400:'#38BDF8',500:'#0EA5E9',600:'#0284C7',700:'#0369A1',800:'#075985',900:'#0C4A6E',950:'#082F49'}
};
// Numeric object keys sort before names; explicitly keep white at the light end.
F.paletteEntries=steps=>Object.entries(steps).sort(([a],[b])=>(a==='white'?-1:a==='black'?Infinity:Number(a))-(b==='white'?-1:b==='black'?Infinity:Number(b)));
for(const [family,steps] of Object.entries(F.palettes))for(const [step,value] of Object.entries(steps)) F.addToken(`color.${family}.${step}`,'color',value,['gray','blue'].includes(family)?'existing':'extended');
const semantic={
 'text.heading':'color.gray.900','text.body':'color.gray.700','text.secondary':'color.gray.600','text.placeholder':'color.gray.500','text.disabled':'color.gray.400','text.inverse':'color.gray.white','text.link':'color.blue.600',
 'surface.canvas':'color.gray.50','surface.default':'color.gray.white','surface.subtle':'color.gray.100','surface.disabled':'color.gray.100',
 'border.default':'color.gray.200','border.strong':'color.gray.300','border.focus':'color.blue.500','border.danger':'color.red.500','border.success':'color.green.500',
 'action.primary':'color.blue.600','action.hover':'color.blue.700','action.pressed':'color.blue.800','action.foreground':'color.gray.white',
 'action.danger.background':'color.red.50','action.danger.foreground':'color.red.800','action.danger.hover':'color.red.100','action.danger.pressed':'color.red.200',
 'action.success.background':'color.green.50','action.success.foreground':'color.green.700','action.success.hover':'color.green.100','action.success.pressed':'color.green.100',
 'status.success':'color.green.700','status.successSubtle':'color.green.50','status.danger':'color.red.600','status.dangerContent':'color.red.700','status.dangerSubtle':'color.red.50','status.warning':'color.amber.700','status.warningSubtle':'color.amber.50','status.info':'color.blue.600','status.infoSubtle':'color.blue.50'
};
for(const [id,v]of Object.entries(semantic)) F.addToken('semantic.'+id,'color','{'+v+'}',['status.success','status.dangerContent','action.hover'].includes(id)?'improved':'existing');
F.badgeTones={neutral:['gray.100','gray.700','gray.500'],blue:['blue.50','blue.700','blue.500'],success:['green.50','green.700','green.500'],purple:['purple.50','purple.600','purple.600'],warning:['amber.50','amber.700','amber.400'],danger:['red.50','red.700','red.500']};
for(const [tone,values] of Object.entries(F.badgeTones))for(const [n,role] of ['background','foreground','indicator'].entries())F.addToken(`semantic.badge.${tone}.${role}`,'color',`{color.${values[n]}}`,'normalized');
for(const [role,target]of Object.entries({background:'color.gray.50',foreground:'color.gray.500',indicator:'color.gray.400'}))F.addToken('semantic.badge.inactive.'+role,'color',`{${target}}`,'normalized');
// User-selected 500 fills with white labels; contrast exceptions are documented.
// Inactive solids deliberately desaturate to the shared neutral pairing.
const badgeFinishes={neutral:['gray.300','gray.500','gray.white'],blue:['blue.200','blue.500','gray.white'],success:['green.200','green.500','gray.white'],purple:['purple.200','purple.500','gray.white'],warning:['amber.200','amber.500','gray.white'],danger:['red.200','red.500','gray.white'],inactive:['gray.200','gray.500','gray.white']};
for(const [tone,values]of Object.entries(badgeFinishes))for(const [n,role]of ['border','solid.background','solid.foreground'].entries())F.addToken(`semantic.badge.${tone}.${role}`,'color',`{color.${values[n]}}`,'normalized');
for(const [tone,target]of Object.entries({neutral:'color.gray.700',blue:'color.blue.600',success:'color.green.500',warning:'color.amber.400',danger:'color.red.500'}))F.addToken('semantic.progress.fill.'+tone,'color',`{${target}}`,'normalized');
F.addToken('semantic.progress.track','color','{semantic.surface.subtle}','normalized');
F.addToken('semantic.progress.label','color','{semantic.text.secondary}','normalized');
// Layout spacing follows a 4px rhythm, with 2px/6px fine steps and zero reset.
F.spacingScale=Object.freeze([0,2,4,6,8,12,16,20,24,28,32,36,40,48,64]);
for(const n of F.spacingScale)F.addToken('space.'+n,'dimension',n+'px','normalized');
// Optical component dimensions are not spacing primitives.
for(const n of [5,7,10,14,18,18.4,23,26,27])F.addToken('size.'+n,'dimension',n+'px','existing');
for(const n of [0,4,5,6,8,10,12,16,18,20,999])F.addToken('radius.'+n,'dimension',n+'px');
F.radiusAliases={none:0,xs:4,sm:6,md:8,lg:10,xl:12,'2xl':16,'3xl':18,'4xl':20,full:999};
for(const [name,n]of Object.entries(F.radiusAliases))F.addToken('radius.'+name,'dimension','{radius.'+n+'}','normalized');
F.addToken('color.transparent','color','transparent','extended');
for(const n of [10,11,12,13,14,16,18,20,22,24,28,32,40,48])F.addToken('font.size.'+n,'dimension',n+'px');
for(const n of [400,500,600,700])F.addToken('font.weight.'+n,'number',n);
for(const n of [14,15,16,18,20,22,24,28,32,40,56])F.addToken('font.line.'+n,'dimension',n+'px');
F.addToken('font.family.sans','fontFamily',"-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif");
F.addToken('font.family.mono','fontFamily',"'SFMono-Regular', Consolas, monospace");
F.addToken('border.width','dimension','1px');
F.addToken('border.width.hairline','dimension','0.5px','existing');
F.addToken('border.width.selection','dimension','1.5px','existing');
F.addToken('color.black.alpha05','color','#0000000d','existing');
F.addToken('shadow.control','shadow','inset 0 1.5px 0 #ffffff33, 0 1px 2px #1717171f');
F.addToken('shadow.focus','shadow','0 0 0 3px color-mix(in srgb, var(--pp-color-blue-500) 20%, transparent)');
F.addToken('shadow.focusDanger','shadow','0 0 0 3px color-mix(in srgb, var(--pp-color-red-500) 20%, transparent)','normalized');
F.addToken('shadow.focusSuccess','shadow','0 0 0 3px color-mix(in srgb, var(--pp-color-green-500) 20%, transparent)','normalized');
F.addToken('shadow.menu','shadow','0 8px 30px #26262614, 0 2px 5px #26262608');
F.addToken('shadow.modal','shadow','0 24px 80px #00000020');
F.addToken('shadow.card','shadow','0 1px 3px #1717170a');
F.addToken('shadow.tag','shadow','0 0 0 1px rgba(0,0,0,.06), 0 1px 2px -1px rgba(0,0,0,.06), 0 2px 4px rgba(0,0,0,.04)','existing');
F.addToken('shadow.checkbox','shadow','0 1px 1px #00000005','existing');
F.addToken('shadow.status','shadow','0 1px 1px rgba(0,0,0,.05)','existing');
F.addToken('shadow.none','shadow','none','existing');
for(const [role,target]of Object.entries({background:'semantic.surface.default',neutralForeground:'color.gray.600',blueForeground:'color.blue.500'}))F.addToken('semantic.badge.raised.'+role,'color',`{${target}}`,'normalized');
for(const [k,v]of Object.entries({fast:160,normal:200,enter:220,slow:320,shimmer:3667,dots:1400,glow:7000,spin:800,skeleton:1800,textGlow:3000,streamStep:40,caret:1000}))F.addToken('motion.duration.'+k,'duration',v+'ms');
F.addToken('motion.easing.standard','cubicBezier','cubic-bezier(.23, 1, .32, 1)');
for(const [k,v]of Object.entries({base:0,dropdown:10,sticky:20,overlay:40,modal:50,toast:60}))F.addToken('layer.'+k,'number',v,'extended');
for(const [k,v]of Object.entries({sm:640,md:768,lg:1024,xl:1280}))F.addToken('breakpoint.'+k,'dimension',v+'px','extended');
const component={
 'checkbox.size':'space.16','checkbox.radius':'radius.5','checkbox.indicator':'space.16','checkbox.shadow':'shadow.checkbox','checkbox.markWidth':'size.7','checkbox.markHeight':'space.4','checkbox.markOffset':'space.4','checkbox.markStroke':'border.width.selection','checkbox.mixedWidth':'space.8','checkbox.mixedThickness':'border.width.selection',
 'radio.size':'space.16','radio.radius':'radius.full','radio.indicator':'space.8',
 'switch.track.off':'semantic.border.default','switch.track.on':'semantic.action.primary','switch.thumb':'semantic.surface.default','switch.radius':'radius.full','switch.focus':'shadow.focus','switch.duration':'motion.duration.fast',
 'switch.width.sm':'space.24','switch.height.sm':'size.14','switch.thumb.sm':'space.12',
 'switch.width.md':'space.32','switch.height.md':'size.18.4','switch.thumb.md':'space.16',
 'switch.width.lg':'space.40','switch.height.lg':'space.24','switch.thumb.lg':'space.20',
 'control.radius':'radius.lg','control.font':'font.size.14','control.weight':'font.weight.500','control.line':'font.line.20','control.gap':'space.8',
 'control.height.sm':'space.32','control.height.md':'space.36','control.height.lg':'space.40',
 'button.primary.background':'semantic.action.primary','button.primary.foreground':'semantic.action.foreground','button.primary.border':'color.blue.700','button.hover.background':'semantic.action.hover','button.pressed.background':'semantic.action.pressed',
 'button.secondary.background':'semantic.surface.default','button.secondary.foreground':'semantic.text.heading','button.secondary.border':'semantic.border.default','button.ghost.background':'color.transparent','button.ghost.foreground':'semantic.text.body',
 'button.danger.background':'semantic.action.danger.background','button.danger.foreground':'semantic.action.danger.foreground','button.danger.hover':'semantic.action.danger.hover','button.danger.pressed':'semantic.action.danger.pressed','button.danger.focus':'shadow.focusDanger',
 'button.success.background':'semantic.action.success.background','button.success.foreground':'semantic.action.success.foreground','button.success.hover':'semantic.action.success.hover','button.success.pressed':'semantic.action.success.pressed','button.success.focus':'shadow.focusSuccess',
 'button.link.foreground':'semantic.text.link','button.link.underlineOffset':'space.4','button.link.underlineWidth':'border.width',
 'button.group.radius':'component.control.radius','button.group.border':'semantic.border.default','button.group.selected.background':'color.blue.50','button.group.selected.foreground':'semantic.action.primary',
 'button.disabled.background':'semantic.surface.disabled','button.disabled.foreground':'semantic.text.disabled','button.padding':'space.12','button.shadow':'shadow.control','button.focus':'shadow.focus',
 'input.background':'semantic.surface.default','input.foreground':'semantic.text.body','input.border':'semantic.border.default','input.placeholder':'semantic.text.placeholder','input.padding':'space.12','input.radius':'radius.lg','input.font':'font.size.14','input.focus':'shadow.focus',
 'progress.track':'semantic.progress.track','progress.label':'semantic.progress.label','progress.height':'space.6','progress.radius':'radius.full','progress.label.font':'font.size.12','progress.label.gap':'space.8',
 'badge.radius':'radius.md','badge.font':'font.size.12','badge.padding':'space.8','badge.height':'space.24','badge.line':'font.line.16','badge.weight':'font.weight.500','badge.gap':'space.6','badge.dot':'space.6','badge.icon':'space.12',
 'badge.raised.background':'semantic.badge.raised.background','badge.raised.neutralForeground':'semantic.badge.raised.neutralForeground','badge.raised.blueForeground':'semantic.badge.raised.blueForeground','badge.raised.radius':'radius.sm','badge.raised.shadow':'shadow.tag','badge.raised.weight':'font.weight.400','badge.raised.height':'size.23','badge.raised.height.sm':'size.18','badge.raised.height.lg':'space.28','badge.raised.font':'font.size.12','badge.raised.font.sm':'font.size.10','badge.raised.font.lg':'font.size.13','badge.raised.line':'font.line.15','badge.raised.line.sm':'font.line.14','badge.raised.line.lg':'font.line.18','badge.raised.padding':'space.8','badge.raised.padding.sm':'space.4','badge.raised.padding.lg':'space.12',
 'badge.status.font':'font.size.14','badge.status.line':'font.line.22','badge.status.weight':'font.weight.500','badge.status.foreground':'semantic.text.heading','badge.status.dot':'space.8','badge.status.icon':'size.14',
 'badge.statusNeutral.height':'size.27','badge.statusNeutral.padding':'space.12','badge.statusNeutral.gap':'space.4','badge.statusNeutral.radius':'radius.2xl','badge.statusNeutral.background':'semantic.surface.default','badge.statusNeutral.border':'color.black.alpha05','badge.statusNeutral.borderWidth':'border.width.hairline','badge.statusNeutral.shadow':'shadow.status',
 'badge.statusSubtle.height':'size.26','badge.statusSubtle.padding':'space.8','badge.statusSubtle.gap':'space.6','badge.statusSubtle.radius':'radius.md','badge.statusSubtle.border':'color.transparent','badge.statusSubtle.borderWidth':'space.0','badge.statusSubtle.shadow':'shadow.none',
 'badge.category.height':'size.26','badge.category.height.sm':'size.18','badge.category.font':'font.size.14','badge.category.font.sm':'font.size.11','badge.category.line':'font.line.22','badge.category.line.sm':'font.line.16','badge.category.padding':'space.8','badge.category.padding.sm':'space.6','badge.category.radius':'radius.md','badge.category.radius.sm':'radius.sm','badge.category.gap':'space.6','badge.category.weight':'font.weight.400',
 'badge.font.sm':'font.size.11','badge.padding.sm':'space.6','badge.height.sm':'space.20',
 'badge.font.lg':'font.size.13','badge.padding.lg':'space.12','badge.height.lg':'space.28',
 'menu.background':'semantic.surface.default','menu.foreground':'semantic.text.body','menu.border':'semantic.border.default','menu.radius':'radius.xl','menu.padding':'space.6','menu.shadow':'shadow.menu',
 'modal.radius':'radius.3xl','modal.padding':'space.20','modal.background':'semantic.surface.default','modal.shadow':'shadow.modal',
 'card.background':'semantic.surface.default','card.radius':'radius.4xl','card.padding':'space.20','card.border':'semantic.border.default','card.shadow':'shadow.card',
 'motion.shimmer.duration':'motion.duration.shimmer','motion.shimmer.foreground':'semantic.text.secondary','motion.shimmer.highlight':'color.gray.200','motion.dots.duration':'motion.duration.dots','motion.dots.foreground':'semantic.action.primary','motion.glow.duration':'motion.duration.glow'
};
for(const type of ['checkbox','radio'])Object.assign(component,{
 [`${type}.background`]:'semantic.surface.default',[`${type}.border`]:'semantic.border.default',
 [`${type}.selected`]:'semantic.action.primary',[`${type}.foreground`]:'semantic.text.inverse',
 [`${type}.focus`]:'shadow.focus',[`${type}.duration`]:'motion.duration.fast'
});
component['checkbox.border']='semantic.border.strong';
for(const tone of [...Object.keys(F.badgeTones),'inactive'])for(const role of ['background','foreground','indicator','border','solid.background','solid.foreground'])component[`badge.${tone}.${role}`]=`semantic.badge.${tone}.${role}`;
for(const tone of [...Object.keys(F.badgeTones),'inactive'])component[`badge.category.background.${tone}`]=tone==='blue'?'color.blue.100':`semantic.badge.${tone}.background`;
for(const [tone,family]of Object.entries({neutral:'gray',blue:'blue',success:'green',purple:'purple',warning:'amber',danger:'red',inactive:'gray'})){
 component[`badge.status.indicator.${tone}`]=`color.${family}.${tone==='inactive'?400:500}`;
 component[`badge.statusSubtle.background.${tone}`]=tone==='warning'?'color.amber.50':`semantic.badge.${tone}.background`;
}
for(const tone of ['neutral','blue','success','warning','danger'])component['progress.fill.'+tone]='semantic.progress.fill.'+tone;
for(const [id,v]of Object.entries(component))if(v)F.addToken('component.'+id,F.tokens[v].type,'{'+v+'}','normalized');
F.resolve=(id,seen=[])=>{if(seen.includes(id))throw Error('Circular token: '+id);const t=F.tokens[id];if(!t)throw Error('Missing token: '+id);return typeof t.value==='string'&&/^\{.+\}$/.test(t.value)?F.resolve(t.value.slice(1,-1),[...seen,id]):t.value;};
F.chain=id=>{let chain=[id];while(/^\{.+\}$/.test(F.tokens[id]?.value)){id=F.tokens[id].value.slice(1,-1);if(chain.includes(id))throw Error('Circular token');chain.push(id);}return chain;};
F.varName=id=>'--pp-'+id.replaceAll('.','-');F.v=id=>`var(${F.varName(id)})`;
/* One badge contract drives every instance and its token inspector. */
F.statusOptions={pending:['Pending','warning','warning'],failed:['Failed','danger','x-circle-fill'],success:['Success','success','check-circle-fill'],progress:['In progress','blue','circle-dashed'],review:['In review','purple','search'],submitted:['Submitted','blue','arrow'],expired:['Expired','neutral','clock']};
F.statusBadgeConfig=(c={})=>{const v=F.statusOptions[c.status]||F.statusOptions.pending;return {...c,variant:'soft',tone:v[1],iconName:v[2],label:v[0],indicator:c.statusIcon===false?'none':'icon'};};
F.badgeTokens=(c={})=>{
 if(c.variant==='status'){const v=F.statusBadgeConfig(c),map=F.badgeTokens(v);map.radius='radius.full';map.border='component.badge.'+v.tone+'.border';return map;}
 const tone=F.badgeTones[c.tone]?c.tone:'neutral',variant=c.variant||'soft',size=['sm','lg'].includes(c.size)?'.'+c.size:'',prefix=`component.badge.${c.state==='inactive'?'inactive':tone}.`;
 const status=['status-neutral','status-subtle'].includes(variant),statusPrefix='component.badge.'+(variant==='status-neutral'?'statusNeutral':'statusSubtle')+'.';
 const map={height:'component.badge.height'+size,font:'component.badge.font'+size,padding:'component.badge.padding'+size,radius:'component.badge.radius',line:'component.badge.line',weight:'component.badge.weight',gap:'component.badge.gap',
  background:variant==='solid'?prefix+'solid.background':variant==='outline'?'color.transparent':prefix+'background',
  foreground:variant==='solid'?prefix+'solid.foreground':prefix+'foreground',border:variant==='outline'?prefix+'border':'color.transparent'};
 if(variant==='raised'){
  for(const role of ['height','font','padding','line'])map[role]='component.badge.raised.'+role+size;
  for(const role of ['radius','weight','shadow','background'])map[role]='component.badge.raised.'+role;
  map.border='color.transparent';map.borderWidth='space.0';
  if(c.state!=='inactive'&&['neutral','blue'].includes(tone))map.foreground='component.badge.raised.'+tone+'Foreground';
 }
 if(status){
  for(const role of ['height','padding','gap','radius','border','borderWidth','shadow'])map[role]=statusPrefix+role;
  for(const role of ['font','line','weight'])map[role]='component.badge.status.'+role;
  map.foreground=c.state==='inactive'?'semantic.text.disabled':'component.badge.status.foreground';
  map.background=statusPrefix+'background'+(variant==='status-subtle'?'.'+(c.state==='inactive'?'inactive':tone):'');
 }
 if(variant==='category'){
  const categorySize=(c.categorySize||c.size)==='sm'?'.sm':'';
  for(const role of ['height','font','line','padding','radius'])map[role]='component.badge.category.'+role+categorySize;
  for(const role of ['weight','gap'])map[role]='component.badge.category.'+role;
  map.background='component.badge.category.background.'+(c.state==='inactive'?'inactive':tone);
  map.border='color.transparent';map.borderWidth='space.0';map.shadow='shadow.none';
 }
 const indicator=c.indicator||(c.dot?'dot':'none');
 if(indicator!=='none'){map.indicator=variant==='raised'?map.foreground:variant==='solid'?prefix+'solid.foreground':prefix+(indicator==='dot'?'indicator':'foreground');map[indicator.startsWith('icon')?'icon':'dot']='component.badge.'+(indicator.startsWith('icon')?'icon':'dot');}
 if(status&&indicator!=='none'){
  map.indicator='component.badge.status.indicator.'+(c.state==='inactive'?'inactive':tone);
  map[indicator.startsWith('icon')?'icon':'dot']='component.badge.status.'+(indicator.startsWith('icon')?'icon':'dot');
 }
 // Circular icon badges and status capsules retain their round radius.
 if(indicator==='icon-only'){map.padding='space.0';map.radius='radius.full';}
 return map;
};
F.selectionTokens=type=>['font.family.sans','font.size.14','semantic.text.body','space.8','border.width','motion.easing.standard',...['size','radius','indicator','background','border','selected','foreground','focus','duration'].map(role=>`component.${type}.${role}`),...(type==='checkbox'?['shadow','markWidth','markHeight','markOffset','markStroke','mixedWidth','mixedThickness'].map(role=>'component.checkbox.'+role):[])];
F.progressTokens=(c={})=>{
 const tone=['neutral','blue','success','warning','danger'].includes(c.tone)?c.tone:'neutral';
 return ['component.progress.fill.'+tone,'component.progress.track','component.progress.height','component.progress.radius',...(c.showLabel?['font.family.sans','component.progress.label','component.progress.label.font','component.progress.label.gap']:[])];
};
F.switchTokens=(c={})=>['font.family.sans','font.size.14','semantic.text.body','space.8','border.width','motion.easing.standard',...['track.off','track.on','thumb','radius','focus','duration',...['width','height','thumb'].map(role=>role+'.'+(c.size||'md'))].map(role=>'component.switch.'+role)];
F.tokenCSS=()=>':root{'+Object.entries(F.tokens).map(([id,t])=>F.varName(id)+':'+(/^\{.+\}$/.test(t.value)?F.v(t.value.slice(1,-1)):t.value)+';').join('')+'}';
const tokenStyle=document.createElement('style');tokenStyle.id='project-tokens';tokenStyle.textContent=F.tokenCSS();document.head.append(tokenStyle);
/* Effective button tokens are shared by rendering and the inspector. */
F.addToken('shadow.secondary','shadow','0 1px 2px #17171708','extended');F.addToken('shadow.none','shadow','none','extended');
// Ghost actions on a dark surface share the same button renderer and state contract.
F.addToken('color.whiteAlpha.10','color','#ffffff1a','improved');
F.addToken('color.whiteAlpha.20','color','#ffffff33','improved');
F.addToken('component.button.inverse.foreground','color','{semantic.text.inverse}','improved');
F.addToken('component.button.inverse.hover','color','{color.whiteAlpha.10}','improved');
F.addToken('component.button.inverse.pressed','color','{color.whiteAlpha.20}','improved');
F.buttonTokens=(c={})=>{
 const variant=c.state==='success'?'success':c.variant||'primary',s=c.state||'default',size=c.size||'md',tone=variant==='destructive'?'danger':variant==='success'?'success':null;
 let bg=variant==='primary'?'component.button.primary.background':variant==='secondary'?'component.button.secondary.background':['ghost','link'].includes(variant)?'color.transparent':variant==='outline'?'semantic.surface.default':`component.button.${tone||'success'}.background`;
 let fg=variant==='primary'?'semantic.text.inverse':tone?`component.button.${tone}.foreground`:variant==='link'?'component.button.link.foreground':variant==='outline'?'semantic.action.primary':variant==='secondary'?'component.button.secondary.foreground':'component.button.ghost.foreground';
 let border=variant==='primary'?'component.button.primary.border':variant==='secondary'?'semantic.border.default':variant==='outline'?'semantic.action.primary':'color.transparent';
 let shadow=variant==='primary'?'component.button.shadow':variant==='secondary'?'shadow.secondary':'shadow.none';
 let hover=variant==='primary'?'component.button.hover.background':tone?`component.button.${tone}.hover`:variant==='link'?'color.transparent':'semantic.surface.subtle';
 let active=variant==='primary'?'component.button.pressed.background':tone?`component.button.${tone}.pressed`:variant==='link'?'color.transparent':'color.gray.200';
 if(c.surface==='inverse'&&variant==='ghost'){fg='component.button.inverse.foreground';hover='component.button.inverse.hover';active='component.button.inverse.pressed';}
 if(s==='hover')bg=hover;if(s==='pressed')bg=active;
 if(s==='disabled'){bg=variant==='link'?'color.transparent':'component.button.disabled.background';fg='component.button.disabled.foreground';border=variant==='link'?'color.transparent':'semantic.border.default';shadow='shadow.none';hover=bg;active=bg;}
 const map={bg,fg,border,shadow,height:'component.control.height.'+size,font:size==='sm'?'font.size.13':'component.control.font',padding:c.icon==='only'||variant==='link'?'space.0':size==='sm'?'space.8':size==='lg'?'space.16':'component.button.padding',radius:'component.control.radius',weight:'component.control.weight',gap:'component.control.gap',line:'component.control.line',hover,active,focus:tone?`component.button.${tone}.focus`:'component.button.focus'};
 if(variant==='link'){map.underlineOffset='component.button.link.underlineOffset';map.underlineWidth='component.button.link.underlineWidth';}
 return map;
};
document.getElementById('project-tokens').textContent=F.tokenCSS();
