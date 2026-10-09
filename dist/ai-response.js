/* Pitch Protocol assistant-response templates. These render local example data.
   Source: conversations.js, research-activity.js, company-brief.js, projections.js,
   and the final styles.css / detail-pages.css rules. No AI service is connected. */
(() => {
 'use strict';
 const F=window.Forma,E=F.escape,I=(name,size=16)=>F.icon(name,size),unique=list=>[...new Set(list)];
 for(const n of [7,10,14,18,42,44,110,150,170,365,520,780])if(!F.tokens['size.'+n])F.addToken('size.'+n,'dimension',n+'px','existing');
 const seed=(id,type,value)=>{if(!F.tokens[id])F.addToken(id,type,value,'existing');};
 for(const n of [9,15,26,27,31])seed('font.size.'+n,'dimension',n+'px');
 for(const n of [21,23,26,31,34])seed('font.line.'+n,'dimension',n+'px');
 seed('radius.3','dimension','3px');
 seed('shadow.response','shadow','0 1px 3px #00000003');
 seed('shadow.responseSuggestion','shadow','0 1px 1px rgb(24 28 36 / 3%)');
 seed('color.suggestionHover','color','#414141');
 seed('motion.duration.copyFeedback','duration','1600ms');
 seed('motion.duration.regenerate','duration','500ms');
 seed('shadow.responseOverview','shadow','0 2px 5px #00000005');
 seed('shadow.sourcePopover','shadow','0 12px 28px #00000014, 0 3px 8px #0000000a, 0 1px 2px #0000000a');
 const semantic={
  'response.body':'semantic.text.body','response.heading':'semantic.text.heading','response.secondary':'semantic.text.secondary',
  'response.surface':'semantic.surface.default','response.subtle':'semantic.surface.canvas','response.border':'semantic.border.default',
  'response.chart.blue':'color.blue.500','response.chart.warm':'color.orange.500','response.chart.purple':'color.purple.400','response.chart.green':'color.green.600',
  'response.chart.blueSubtle':'color.blue.50','response.chart.warmSubtle':'color.amber.50','response.chart.greenSubtle':'color.green.50'
 };
 for(const [role,target]of Object.entries(semantic))F.addToken('semantic.'+role,F.tokens[target].type,`{${target}}`,'normalized');
 const components={
  'response.actions.size':'space.28','response.actions.icon':'size.14','response.actions.gap':'space.2','response.actions.radius':'radius.sm','response.actions.color':'semantic.text.secondary','response.actions.selected':'semantic.text.heading','response.actions.success':'semantic.status.success','response.actions.duration':'motion.duration.normal','response.actions.easing':'motion.easing.standard','response.actions.copyDuration':'motion.duration.copyFeedback','response.actions.retryDuration':'motion.duration.regenerate','response.actions.blur':'space.2',
  'response.width':'size.780','response.font':'font.size.14','response.line':'font.line.24','response.gap':'space.24','response.body':'semantic.response.body','response.heading':'semantic.response.heading','response.secondary':'semantic.response.secondary',
  'response.card.radius':'radius.xl','response.card.border':'semantic.response.border','response.card.background':'semantic.response.surface','response.card.shadow':'shadow.response','response.card.headerPaddingX':'space.16','response.card.headerPaddingY':'space.12',
  'response.followup.radius':'radius.2xl','response.followup.paddingX':'space.12','response.followup.paddingY':'space.6','response.followup.gap':'space.6','response.followup.font':'font.size.13','response.followup.line':'font.line.18','response.followup.shadow':'shadow.responseSuggestion',
  'response.stat.font':'font.size.22','response.stat.line':'font.line.28','response.chart.rowHeight':'size.42','response.chart.labelWidth':'size.150','response.chart.labelWidthCompact':'size.110','response.chart.trackHeight':'size.18',
  'response.overview.radius':'radius.2xl','response.overview.padding':'space.36','response.overview.shadow':'shadow.responseOverview','response.overview.statFont':'font.size.26','response.overview.statLine':'font.line.34',
  'response.brief.radius':'radius.4xl','response.brief.inset':'space.6','response.brief.innerRadius':'radius.2xl','response.brief.padding':'space.20',
  'response.projection.width':'size.520','response.projection.radius':'radius.2xl','response.projection.labelWidth':'size.170','response.projection.valueFont':'font.size.31','response.projection.valueLine':'font.line.31',
  'research.font':'font.size.13','research.line':'font.line.20','research.gap':'space.12','research.rowGap':'space.8','research.indent':'space.24','research.branch':'semantic.response.border','research.note.background':'semantic.response.subtle','research.note.radius':'radius.sm','research.note.padding':'space.8',
  'citation.radius':'component.tag.radius','citation.font':'component.tag.font.sm','citation.line':'component.tag.line.sm','citation.foreground':'component.tag.blueForeground','citation.background':'component.tag.background','citation.shadow':'component.tag.shadow','citation.weight':'component.tag.weight',
  'sourcePopover.width':'size.365','sourcePopover.radius':'radius.2xl','sourcePopover.borderWidth':'border.width.hairline','sourcePopover.border':'semantic.response.border','sourcePopover.background':'semantic.response.surface','sourcePopover.shadow':'shadow.sourcePopover','sourcePopover.paddingX':'space.16','sourcePopover.paddingY':'space.16','sourcePopover.font':'font.size.13','sourcePopover.line':'font.line.20'
 };
 seed('font.line.14','dimension','14px');
 for(const [role,target]of Object.entries(components))F.addToken('component.'+role,F.tokens[target].type,`{${target}}`,'normalized');
 // Exact TaskRows reference dimensions; only status colors/icons use system normalization.
 seed('size.480','dimension','480px');
 for(const value of [9.5,10.5,12.5])seed('font.size.'+value,'dimension',value+'px');
 for(const value of [14.25,15.75,18.75,19.2,19.5])seed('font.line.'+value,'dimension',value+'px');
 seed('layout.taskRows.rowGap','dimension','10px');seed('layout.taskRows.paddingY','dimension','10px');
 seed('font.tracking.taskStatus','dimension','0.475px');
 seed('color.black.alpha07','color','#00000012');seed('color.black.alpha02','color','#00000005');
 seed('motion.duration.taskHover','duration','150ms');seed('motion.duration.taskExpand','duration','240ms');seed('motion.easing.taskExpand','cubicBezier','cubic-bezier(0.32,0.72,0,1)');
 const taskAliases={width:'size.480',radius:'radius.2xl',background:'semantic.surface.default',border:'color.black.alpha07',divider:'color.black.alpha05',shadow:'shadow.secondary',hover:'color.black.alpha02',rowGap:'layout.taskRows.rowGap',paddingX:'space.12',paddingY:'layout.taskRows.paddingY',compactPaddingY:'space.8',icon:'space.20',queuedIcon:'space.20',check:'space.12',chevron:'space.12',font:'font.size.13',compactFont:'font.size.12.5',line:'font.line.19.5',compactLine:'font.line.18.75',detailFont:'font.size.10.5',detailLine:'font.line.15.75',badgeFont:'font.size.9.5',badgeLine:'font.line.14.25',badgeTracking:'font.tracking.taskStatus',noteFont:'font.size.12',noteLine:'font.line.19.2',foreground:'color.gray.800',muted:'color.gray.500',subtle:'color.gray.400',queued:'color.gray.300',duration:'motion.duration.normal',expandDuration:'motion.duration.taskExpand',hoverDuration:'motion.duration.taskHover',easing:'motion.easing.standard',expandEasing:'motion.easing.taskExpand'};
 for(const [role,target]of Object.entries(taskAliases))F.addToken('component.taskRows.'+role,F.tokens[target].type,'{'+target+'}','normalized');
 F.addToken('component.aiLoader.size','dimension','{space.16}','existing');F.addToken('component.aiLoader.foreground','color','{semantic.action.primary}','existing');F.addToken('component.aiLoader.duration','duration','{motion.duration.shimmer}','existing');
 const keys=prefix=>Object.keys(components).filter(id=>id.startsWith(prefix+'.')).map(id=>'component.'+id);
 const researchStage=c=>['reading','calculating','drafting','complete'].includes(c.stage)?c.stage:(c.state==='thinking'||c.pending===true?'reading':'complete');
 // Shared source shimmer: imported once, used by its page and assistant thinking.
 seed('font.tracking.thinking','dimension','-0.14px');
 F.addToken('component.motion.shimmer.tracking','dimension','{font.tracking.thinking}','existing');
 F.textShimmerTokens=()=>['font.family.sans','font.size.14','font.line.20','font.weight.500','component.motion.shimmer.tracking','component.motion.shimmer.foreground','component.motion.shimmer.highlight','component.motion.shimmer.duration'];
 F.textShimmer=(c={})=>`<span class="pp-shimmer motion-element"${c.decorative?' aria-hidden="true"':''}${c.playing===false?' data-playing="false"':''}>${E(c.text??'Thinking')}</span>`;
 const baseTokens=['font.family.sans','component.response.width','component.response.font','component.response.line','component.response.gap','component.response.body','component.response.heading','component.response.secondary','semantic.response.surface','semantic.response.subtle','semantic.response.border','border.width','font.weight.500','space.8','space.12','space.16','space.20','space.24'];
 F.aiResponseVariants=['text','table','statistics','overview','brief','revenue','market','search'];
 F.aiSourceTokens=()=>unique([...keys('citation'),...keys('sourcePopover'),'font.family.sans','font.size.15','font.size.12','font.line.21','semantic.text.heading','semantic.text.secondary','space.2','space.4','space.8','space.12','space.16','size.10','size.18','size.44','radius.sm','shadow.focus',...Object.values(F.badgeTokens({tone:'neutral',size:'sm'})),...Object.values(F.buttonTokens({variant:'ghost',icon:'only',size:'sm'}))]);
 F.aiResearchActivityTokens=(c={})=>unique([...F.spinnerTokens({size:'sm',tone:'blue'}),'space.28','space.32','border.width','semantic.border.default','font.weight.400','motion.duration.enter','motion.easing.standard',...F.thinkingGridTokens(),...(c.animate||researchStage(c)!=='complete'?F.textShimmerTokens():[]),...keys('research'),...(c.sourceMode==='popover'?F.aiSourceTokens():['semantic.text.link','semantic.surface.canvas','semantic.surface.subtle','radius.sm','font.size.13','font.line.18']),'semantic.text.body','semantic.text.secondary','semantic.text.placeholder','space.4','space.6','space.8','size.14','space.16','space.24','radius.xs','shadow.focus']);
 F.aiFollowupTokens=(c={})=>unique(['color.suggestionHover','color.gray.500','color.gray.200','color.gray.100','space.32','font.family.sans','font.weight.400',...keys('response.followup'),'space.16',...(c.icon===false?[]:['size.14']),'border.width','semantic.response.border','semantic.response.surface','semantic.response.subtle','semantic.text.secondary','semantic.text.body','shadow.focus',...(c.disabled?['semantic.text.disabled','semantic.surface.disabled']:[])]);
 F.aiResponseTokens=(c={})=>{
  if(c.state==='thinking')return unique([...baseTokens,...(c.research?F.aiResearchActivityTokens(c):[...F.textShimmerTokens(),...F.thinkingGridTokens()])]);
  const variant=F.aiResponseVariants.includes(c.variant)?c.variant:'text';
  const tokens=[...baseTokens,...(c.actions===false?[]:F.aiCompactTokens()),...(variant==='search'?F.aiCompactTokens():[]),...(c.research?F.aiResearchActivityTokens(c):[]),...(c.followups!==false?F.aiFollowupTokens():[])];
  if(variant==='text'&&!['plain','empty'].includes(c.format))tokens.push(...F.aiSourceTokens());
  if(variant==='table')tokens.push(...F.pitchTableTokens({...c,header:true,selectable:false,searchable:false}));
  if(['statistics','overview','brief'].includes(variant))tokens.push(...F.resultCardTokens({detail:variant!=='brief'}));
  if(variant==='statistics')tokens.push(...F.statsBarTokens({variant:'statistics'}),'font.size.11','font.size.12','font.line.16');
  if(['overview','brief'].includes(variant))tokens.push(...F.avatarTokens({variant:'text',shape:'square',size:'md'}),...Object.values(F.badgeTokens({tone:'neutral',size:'sm'})),...Object.values(F.buttonTokens({variant:'secondary',size:'sm'})),'font.size.15','font.line.22','radius.md','radius.xl');
  if(variant==='overview')tokens.push(...['padding','statFont','statLine'].map(role=>'component.response.overview.'+role),'semantic.response.chart.warm','semantic.response.chart.purple','semantic.response.chart.blue','font.size.13','font.line.20','font.line.23','space.20','space.28','space.32');
  if(variant==='brief')tokens.push('component.response.brief.padding','font.size.20','font.line.26','space.6','space.12','size.14');
  if(['revenue','market'].includes(variant))tokens.push(...keys('response.projection'),'semantic.response.chart.warm','semantic.response.chart.warmSubtle','semantic.response.chart.blue','semantic.response.chart.blueSubtle','semantic.response.chart.green','semantic.response.chart.greenSubtle','font.size.27','font.size.9','font.size.10','font.size.11','font.size.12','font.line.16','space.6','space.8','space.12','space.16','space.20','space.28','size.7','radius.md');
  return unique(tokens);
 };
 let serial=0;
 const sourceRecord={label:'S1',status:'Application record',title:'Workspace application',body:'The application describes the product, customer workflow, and reported operating figures. This is a local example record; the figures have not been independently verified.',source:'Local prototype record'};
 F.aiSourcePopover=(c={})=>{
  const v={...sourceRecord,...c},id=c.id||'ai-source-'+(++serial);
  return `<span class="pp-ai-source" id="${E(id)}" popover="auto" role="dialog" aria-labelledby="${E(id)}-title" tabindex="-1" hidden><span class="pp-ai-source-head"><span>${E(v.label)}</span>${F.badge({tone:'neutral',size:'sm'},v.status)}${F.button({variant:'ghost',size:'sm',icon:'only',iconName:'close'},'Close source','data-ai-source-close')}</span><span class="pp-ai-source-content"><strong id="${E(id)}-title">${E(v.title)}</strong><span>${E(v.body)}</span><small>${E(v.source)}</small></span></span>`;
 };
 F.aiCitation=(c={})=>{
  const id='ai-source-'+(++serial),label=c.label||'S1',chip=c.variant==='chip';
  return `<span class="pp-ai-source-entry"><button type="button" class="${chip?'pp-ai-source-chip':'pp-ai-citation'}" data-ai-source-trigger  aria-haspopup="dialog" aria-expanded="false" aria-controls="${id}" aria-label="Read source: ${E(c.title||label)}">${chip?I('file',14):''}<span>${E(c.triggerLabel??(chip?(c.title||'Application record'):label))}</span></button>${F.aiSourcePopover({...c,id})}</span>`;
 };
 const companyDefault={team:91,founderCount:2,href:'https://pitch-investor-prototype.vercel.app/preview.html#company/application-astergrid/summary',name:'AsterGrid',initials:'AG',description:'Grid forecasting for distributed renewables',round:'Seed',stage:'Live',score:87,ask:'$2M',runway:'18 months',revenue:'$0.8M',funding:'$1.2M',founders:'Maya Patel · Daniel Brooks',industry:'Energy',problem:'Operators reconcile forecasts and asset data across disconnected tools.',solution:'A shared forecasting workflow combines operating data, exceptions, and reporting.'};
 const company=c=>{const v={...companyDefault,...(c.company||{})};if(c.company?.name&&c.company.name!==companyDefault.name&&!Object.prototype.hasOwnProperty.call(c.company,'href'))v.href='';return v;};
 const identity=v=>`<div class="pp-ai-identity">${F.avatar({variant:'text',shape:'square',size:'md',initials:v.initials,name:v.name})}<div><h3>${E(v.name)}</h3><p>${E(v.description)}</p></div>${F.badge({tone:'neutral',size:'sm'},v.round)}</div>`;
 const safeHref=value=>/^https?:\/\/|^#[a-zA-Z0-9]/.test(String(value||''))?String(value):'';
 const openAction=v=>`<div class="pp-ai-company-action">${safeHref(v.href)?F.button({variant:'secondary',size:'sm'},'Open company',`href="${E(safeHref(v.href))}"${safeHref(v.href).startsWith('http')?' target="_blank" rel="noopener noreferrer"':''}`).replace('<button type="button"','<a').replace('</button>','</a>'):F.button({variant:'secondary',size:'sm'},'Open company',`data-ai-open-record="${E(v.name)}"`)}</div>`;
 const intro=(variant,v)=>({search:'Sources for this response.',text:'Here is a concise summary of the available information.',table:'Here are the matching opportunities, ranked by their current score.',statistics:'Here is a snapshot of the companies in this result set.',overview:`Here is a closer look at ${v.name}, based on its application.`,brief:`Here are the areas to validate for ${v.name}.`,revenue:`At 10% quarterly growth, ${v.name}’s reported revenue would follow the scenario below.`,market:`Here is a simple view of the potential market for ${v.name}.`}[variant]);
 F.thinkingGridTokens=()=>['component.aiLoader.size','component.aiLoader.foreground','component.aiLoader.duration'];
 // Exact path geometry/opacity from the live PP assets/thinking-grid.svg; only fill is tokenized.
 const thinkingDots=[["M0.988092 1.75304C1.41056 1.75304 1.75304 1.41056 1.75304 0.988092C1.75304 0.565623 1.41056 0.223145 0.988092 0.223145C0.565623 0.223145 0.223145 0.565623 0.223145 0.988092C0.223145 1.41056 0.565623 1.75304 0.988092 1.75304Z",0.05,false],["M4.49395 1.75304C4.91642 1.75304 5.2589 1.41056 5.2589 0.988092C5.2589 0.565623 4.91642 0.223145 4.49395 0.223145C4.07148 0.223145 3.729 0.565623 3.729 0.988092C3.729 1.41056 4.07148 1.75304 4.49395 1.75304Z",0.1,false],["M8.0003 1.75304C8.42277 1.75304 8.76525 1.41056 8.76525 0.988092C8.76525 0.565623 8.42277 0.223145 8.0003 0.223145C7.57783 0.223145 7.23535 0.565623 7.23535 0.988092C7.23535 1.41056 7.57783 1.75304 8.0003 1.75304Z",0.3,false],["M11.5057 1.75304C11.9281 1.75304 12.2706 1.41056 12.2706 0.988092C12.2706 0.565623 11.9281 0.223145 11.5057 0.223145C11.0832 0.223145 10.7407 0.565623 10.7407 0.988092C10.7407 1.41056 11.0832 1.75304 11.5057 1.75304Z",0.5,false],["M15.012 1.75304C15.4345 1.75304 15.777 1.41056 15.777 0.988092C15.777 0.565623 15.4345 0.223145 15.012 0.223145C14.5895 0.223145 14.2471 0.565623 14.2471 0.988092C14.2471 1.41056 14.5895 1.75304 15.012 1.75304Z",1,true],["M0.988092 5.25939C1.41056 5.25939 1.75304 4.91691 1.75304 4.49444C1.75304 4.07197 1.41056 3.72949 0.988092 3.72949C0.565623 3.72949 0.223145 4.07197 0.223145 4.49444C0.223145 4.91691 0.565623 5.25939 0.988092 5.25939Z",0.1,false],["M4.49395 5.25939C4.91642 5.25939 5.2589 4.91691 5.2589 4.49444C5.2589 4.07197 4.91642 3.72949 4.49395 3.72949C4.07148 3.72949 3.729 4.07197 3.729 4.49444C3.729 4.91691 4.07148 5.25939 4.49395 5.25939Z",0.3,false],["M8.0003 5.25939C8.42277 5.25939 8.76525 4.91691 8.76525 4.49444C8.76525 4.07197 8.42277 3.72949 8.0003 3.72949C7.57783 3.72949 7.23535 4.07197 7.23535 4.49444C7.23535 4.91691 7.57783 5.25939 8.0003 5.25939Z",0.5,false],["M11.5057 5.25939C11.9281 5.25939 12.2706 4.91691 12.2706 4.49444C12.2706 4.07197 11.9281 3.72949 11.5057 3.72949C11.0832 3.72949 10.7407 4.07197 10.7407 4.49444C10.7407 4.91691 11.0832 5.25939 11.5057 5.25939Z",1,true],["M15.012 5.25939C15.4345 5.25939 15.777 4.91691 15.777 4.49444C15.777 4.07197 15.4345 3.72949 15.012 3.72949C14.5895 3.72949 14.2471 4.07197 14.2471 4.49444C14.2471 4.91691 14.5895 5.25939 15.012 5.25939Z",0.5,false],["M0.988092 8.76525C1.41056 8.76525 1.75304 8.42277 1.75304 8.0003C1.75304 7.57783 1.41056 7.23535 0.988092 7.23535C0.565623 7.23535 0.223145 7.57783 0.223145 8.0003C0.223145 8.42277 0.565623 8.76525 0.988092 8.76525Z",0.3,false],["M4.49395 8.76525C4.91642 8.76525 5.2589 8.42277 5.2589 8.0003C5.2589 7.57783 4.91642 7.23535 4.49395 7.23535C4.07148 7.23535 3.729 7.57783 3.729 8.0003C3.729 8.42277 4.07148 8.76525 4.49395 8.76525Z",0.5,false],["M8.0003 8.76525C8.42277 8.76525 8.76525 8.42277 8.76525 8.0003C8.76525 7.57783 8.42277 7.23535 8.0003 7.23535C7.57783 7.23535 7.23535 7.57783 7.23535 8.0003C7.23535 8.42277 7.57783 8.76525 8.0003 8.76525Z",1,true],["M11.5057 8.76525C11.9281 8.76525 12.2706 8.42277 12.2706 8.0003C12.2706 7.57783 11.9281 7.23535 11.5057 7.23535C11.0832 7.23535 10.7407 7.57783 10.7407 8.0003C10.7407 8.42277 11.0832 8.76525 11.5057 8.76525Z",0.5,false],["M15.012 8.76525C15.4345 8.76525 15.777 8.42277 15.777 8.0003C15.777 7.57783 15.4345 7.23535 15.012 7.23535C14.5895 7.23535 14.2471 7.57783 14.2471 8.0003C14.2471 8.42277 14.5895 8.76525 15.012 8.76525Z",0.2,false],["M0.988092 12.2706C1.41056 12.2706 1.75304 11.9281 1.75304 11.5057C1.75304 11.0832 1.41056 10.7407 0.988092 10.7407C0.565623 10.7407 0.223145 11.0832 0.223145 11.5057C0.223145 11.9281 0.565623 12.2706 0.988092 12.2706Z",0.5,false],["M4.49395 12.2706C4.91642 12.2706 5.2589 11.9281 5.2589 11.5057C5.2589 11.0832 4.91642 10.7407 4.49395 10.7407C4.07148 10.7407 3.729 11.0832 3.729 11.5057C3.729 11.9281 4.07148 12.2706 4.49395 12.2706Z",1,true],["M8.0003 12.2706C8.42277 12.2706 8.76525 11.9281 8.76525 11.5057C8.76525 11.0832 8.42277 10.7407 8.0003 10.7407C7.57783 10.7407 7.23535 11.0832 7.23535 11.5057C7.23535 11.9281 7.57783 12.2706 8.0003 12.2706Z",0.5,false],["M11.5057 12.2706C11.9281 12.2706 12.2706 11.9281 12.2706 11.5057C12.2706 11.0832 11.9281 10.7407 11.5057 10.7407C11.0832 10.7407 10.7407 11.0832 10.7407 11.5057C10.7407 11.9281 11.0832 12.2706 11.5057 12.2706Z",0.2,false],["M15.012 12.2706C15.4345 12.2706 15.777 11.9281 15.777 11.5057C15.777 11.0832 15.4345 10.7407 15.012 10.7407C14.5895 10.7407 14.2471 11.0832 14.2471 11.5057C14.2471 11.9281 14.5895 12.2706 15.012 12.2706Z",0.1,false],["M0.988092 15.7765C1.41056 15.7765 1.75304 15.434 1.75304 15.0115C1.75304 14.5891 1.41056 14.2466 0.988092 14.2466C0.565623 14.2466 0.223145 14.5891 0.223145 15.0115C0.223145 15.434 0.565623 15.7765 0.988092 15.7765Z",1,true],["M4.49395 15.7765C4.91642 15.7765 5.2589 15.434 5.2589 15.0115C5.2589 14.5891 4.91642 14.2466 4.49395 14.2466C4.07148 14.2466 3.729 14.5891 3.729 15.0115C3.729 15.434 4.07148 15.7765 4.49395 15.7765Z",0.5,false],["M8.0003 15.7765C8.42277 15.7765 8.76525 15.434 8.76525 15.0115C8.76525 14.5891 8.42277 14.2466 8.0003 14.2466C7.57783 14.2466 7.23535 14.5891 7.23535 15.0115C7.23535 15.434 7.57783 15.7765 8.0003 15.7765Z",0.2,false],["M11.5057 15.7765C11.9281 15.7765 12.2706 15.434 12.2706 15.0115C12.2706 14.5891 11.9281 14.2466 11.5057 14.2466C11.0832 14.2466 10.7407 14.5891 10.7407 15.0115C10.7407 15.434 11.0832 15.7765 11.5057 15.7765Z",0.1,false],["M15.012 15.7765C15.4345 15.7765 15.777 15.434 15.777 15.0115C15.777 14.5891 15.4345 14.2466 15.012 14.2466C14.5895 14.2466 14.2471 14.5891 14.2471 15.0115C14.2471 15.434 14.5895 15.7765 15.012 15.7765Z",0.05,false]];
 F.thinkingGrid=(c={})=>`<svg class="pp-thinking-grid motion-element"${c.playing===false?' data-playing="false"':''} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">${thinkingDots.map(([d,opacity,pulse])=>`<path${pulse?' class="pp-thinking-pulse"':''} d="${d}" opacity="${opacity}"/>`).join('')}</svg>`;
 F.aiResearchActivity=(c={})=>{
  const stage=researchStage(c),pending=stage!=='complete',expanded=c.expanded!==false;
  const sources=Array.isArray(c.sources)?c.sources:[{title:'AsterGrid · Application',href:companyDefault.href},{title:'Luma Ledger · Application',href:'https://pitch-investor-prototype.vercel.app/preview.html#company/demo-luma/summary'}];
  const sourceMarkup=sources.map((source,n)=>{if(c.sourceMode==='popover')return F.aiCitation({...source,label:source.label||'S'+(n+1),variant:'chip'});const href=safeHref(source.href)||(source.id?'https://pitch-investor-prototype.vercel.app/preview.html#company/'+encodeURIComponent(source.id)+'/summary':'');return `<${href?'a':'span'} class="pp-ai-source-chip"${href?` href="${E(href)}" target="_blank" rel="noopener noreferrer"`:''}>${I('file',14)}<span>${E(source.title||'Application record')}</span></${href?'a':'span'}>`;}).join('');
  const phases=['reading','calculating','drafting'],active=stage==='complete'?3:phases.indexOf(stage);
  const labels=[`${stage==='reading'?'Reading':'Read'} ${sources.length} ${sources.length===1?'file':'files'}`,'Checking reported figures',pending?'Drafting brief':'Brief drafted'];
  return `<section class="pp-ai-research" data-source-count="${sources.length}" data-research-stage="${stage}" ${c.animate===true?'data-ai-sequence="research"':''} aria-label="Research activity" ${pending?'aria-busy="true"':''}><details ${expanded?'open':''}><summary>${F.thinkingGrid({playing:pending})}<span data-sequence-title>${pending?F.textShimmer({text:'Thinking'}):'Thought process'}</span>${I('chevron',12)}</summary><ul class="pp-ai-reasoning-steps">${labels.map((label,n)=>{
   const current=n===active,done=n<active,indicator=done?I('check',14):current?F.thinkingGrid():I('clock',14);
   const row=`<span data-phase-icon>${indicator}</span><span data-phase-label class="pp-ai-row-title" title="${E(label)}">${current?F.textShimmer({text:label}):E(label)}</span>`;
   return `<li data-phase="${n}" style="--step-order:${n}" class="${done?'is-complete':current?'is-current':'is-queued'}">${n===0?`<details><summary>${row}${I('chevron',12)}</summary><div class="pp-ai-research-branch pp-ai-source-list">${sourceMarkup}</div></details>`:`<div class="pp-ai-reasoning-row">${row}</div>`}</li>`;
  }).join('')}</ul></details></section>`;
 };

 // Compact activity patterns: Spectrum-inspired motion, composed from Forma atoms.
 F.voiceWaveform=(c={})=>`<span class="pp-voice-wave motion-element" aria-hidden="true"${c.playing===false?' data-playing="false"':''}>${Array.from({length:25},(_,n)=>`<i style="--level:${(.22+Math.abs(Math.sin(n*1.7))*.78).toFixed(2)};--phase:${-n*83}ms;--tempo:${(.64+((n*131)%420)/1000).toFixed(3)}"></i>`).join('')}</span>`;
 F.voiceWaveformTokens=()=>['space.2','space.24','space.4','semantic.action.primary','radius.full','motion.duration.dots'];
 const taskStatus=status=>['queued','running','completed','failed'].includes(status)?status:'queued';
 const taskIcon=status=>status==='completed'?I('check',12):status==='failed'?I('close',12):status==='running'?F.spinner({size:'md',tone:'blue'}).replace(F.v('component.spinner.size.md'),F.v('component.taskRows.icon')):I('circle-dashed',20);
 const taskBadge=status=>F.badge({variant:'soft',tone:{queued:'neutral',running:'blue',completed:'success',failed:'danger'}[status],size:'sm'},status).replace('class="pp-badge ','class="pp-badge pp-task-status ');
 F.aiTaskRowsTokens=(c={})=>unique([...Object.keys(taskAliases).map(role=>'component.taskRows.'+role),'font.family.sans','font.family.mono','font.weight.500','border.width','space.2','space.8','space.12','radius.full','semantic.border.focus','semantic.status.success','semantic.status.successSubtle','semantic.status.dangerContent','semantic.status.dangerSubtle',...['neutral','blue','success','danger'].flatMap(tone=>Object.values(F.badgeTokens({variant:'soft',tone,size:'sm'}))),...F.spinnerTokens({size:'md',tone:'blue'})]);
 F.aiTaskRows=(c={})=>{
  const labels=['Understanding','Exploring','Synthesizing','Complete'],active=Math.max(0,labels.indexOf(c.step||'Exploring')),compact=c.taskVariant==='Compact'||c.variant==='Compact'||c.compact===true;
  const notes=['Identify the request and relevant context.','Review sources and collect evidence.','Connect findings and check the conclusion.','The response is ready to review.'];
  const tasks=Array.isArray(c.tasks)?c.tasks:labels.map((title,n)=>({title,note:notes[n],status:c.step==='Complete'||n<active?'completed':n===active?'running':'queued'})),id='ai-task-'+ ++serial;
  return `<ul class="pp-ai-task-rows${compact?' is-compact':''}" data-ai-task-rows ${c.animate===true?'data-ai-sequence="stages"':''} aria-label="Task progress">${tasks.map((task,n)=>{const status=taskStatus(task.status),expandable=!compact&&Boolean(task.note);return `<li data-phase="${n}" data-phase-state="${status}"><button type="button" class="pp-ai-task-trigger" data-ai-task-trigger${expandable?` aria-expanded="false" aria-controls="${id}-note-${n}"`:' disabled'}><span data-phase-icon aria-hidden="true">${taskIcon(status)}</span><span class="pp-ai-row-title" title="${E(task.title)}">${E(task.title)}</span>${task.detail?`<span class="pp-ai-task-detail">${E(task.detail)}</span>`:''}<span data-phase-badge>${taskBadge(status)}</span>${expandable?I('down',12):''}</button>${expandable?`<div class="pp-ai-task-note" id="${id}-note-${n}" data-ai-task-note aria-hidden="true" inert><div><p>${E(task.note)}</p></div></div>`:''}</li>`;}).join('')}</ul>`;
 };
 F.aiWebSearch=(c={})=>{
  const sources=Array.isArray(c.sources)?c.sources:[{title:'Spectrum UI · AI assistants',href:'https://ui.spectrumhq.in/blocks/ai-assistants'},{title:'shadcn/ui · Component library',href:'https://ui.shadcn.com/docs'},{title:'Hugeicons · Stroke Rounded icons',href:'https://hugeicons.com/icons/stroke-rounded'}];
  return `<section class="pp-ai-web-search" aria-label="Search results"><div class="pp-ai-search-heading">${I('search',16)}<span>Search results</span></div><div role="list">${sources.map((source,n)=>{const href=safeHref(source.href),reading=c.state==='thinking'&&n===0;return `<div role="listitem"><${href?'a':'span'} class="pp-ai-search-row"${href?` href="${E(href)}" target="_blank" rel="noopener noreferrer"`:''} title="${E(source.title||'Untitled source')}">${I('globe',16)}<span class="pp-ai-row-title">${E(source.title||'Untitled source')}</span>${reading?`<span class="pp-ai-reading">${F.textShimmer({text:'Reading'})}</span>`:I('chevron',14)}</${href?'a':'span'}></div>`;}).join('')||'<p class="pp-ai-search-empty">No sources found.</p>'}</div></section>`;
 };

 // Detached elements have no layout-based innerText. Keep semantic boundaries explicitly.
 F.aiMessageText=node=>{
  const visit=element=>{
   if(element.nodeType===3)return element.textContent||'';
   const tag=element.nodeName||'';
   if(tag==='BR')return '\n';
   const children=Array.from(element.childNodes||[]),text=children.length?children.map(visit).join(''):element.textContent||'';
   return text+(/^(TD|TH)$/.test(tag)?'\t':/^(TR|LI)$/.test(tag)?'\n':/^(P|DIV|SECTION|ARTICLE|H[1-6]|UL|OL|TABLE|DL|BLOCKQUOTE)$/.test(tag)?'\n\n':'');
  };
  return visit(node).replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
 };
 const messageGlyph=(action,icon)=>`<span class="pp-message-glyph" aria-hidden="true">${action==='copy'?`<span class="pp-message-default">${I('copy',14)}</span><span class="pp-message-confirmation">${I('check',14)}</span>`:['positive','negative'].includes(action)?`<span class="pp-message-default">${I(icon,14)}</span><span class="pp-message-selected">${I(icon+'-fill',14)}</span>`:I(icon,14)}</span>`;
 F.aiMessageActions=()=>`<div class="pp-ai-message-actions" role="group" aria-label="Message actions">${[['copy','Copy response','copy'],['retry','Regenerate response','arrows-clockwise'],['positive','Good response','thumbs-up'],['negative','Poor response','thumbs-down']].map(([action,label,icon])=>{
  const html=F.button({variant:'ghost',size:'sm',icon:'only',iconName:icon},label,`data-message-action="${action}" title="${label}"${['positive','negative'].includes(action)?' aria-pressed="false"':''}`);
  return html.replace(/style="([^"]*)"/,(_,style)=>`style="${style};--demo-button-height:${F.v('component.response.actions.size')};--demo-button-radius:${F.v('component.response.actions.radius')};--demo-button-fg:${F.v('component.response.actions.color')}"`).replace(/(<button\b[^>]*>)[\s\S]*(<\/button>)/,(_,start,end)=>start+messageGlyph(action,icon)+end);
 }).join('')}<span class="visually-hidden" role="status" data-message-status></span></div>`;
 F.aiCompactTokens=()=>unique([...keys('response.actions'),'size.520','radius.2xl','shadow.response','semantic.surface.default','semantic.status.success','semantic.status.successSubtle','component.response.width','font.family.sans','font.size.13','font.line.20','space.4','space.8','space.12','space.16','space.24','space.28','space.32','space.36','space.40','space.48','border.width','font.weight.400','semantic.border.focus','semantic.action.primary','semantic.text.placeholder','semantic.text.body','semantic.text.secondary','semantic.border.default','semantic.surface.subtle','radius.sm','motion.duration.enter','motion.easing.standard',...F.textShimmerTokens(),...Object.values(F.badgeTokens({tone:'neutral',size:'sm'})),...Object.values(F.badgeTokens({tone:'blue',size:'sm'})),...Object.values(F.badgeTokens({tone:'success',size:'sm'})),...Object.values(F.buttonTokens({variant:'ghost',size:'sm',icon:'only'})),...F.spinnerTokens({size:'sm'})]);
 F.aiFollowups=(c={})=>{
  const defaults=['Show only the ones performing well','Rank these by team score','How’s the team?','Tell me more about Luma Ledger'];
  const suggestions=c.layout==='single'?[c.label||defaults[0]]:Array.isArray(c.suggestions)?c.suggestions:defaults;
  return `<div class="pp-ai-followups" role="group" aria-label="Suggested follow-up questions">${suggestions.map(text=>`<button type="button" data-ai-followup="${E(text)}"${c.disabled?' disabled':''}>${c.icon===false?'':I('arrow-return',14).replace('class="hugeicon"','class="hugeicon pp-followup-icon"')}<span>${E(text)}</span></button>`).join('')}</div><span class="visually-hidden" data-ai-followup-status role="status" aria-live="polite"></span>`;
 };
 const cardShell=(kind,title,body,{detail='',footer=''}={})=>`<section class="pp-pitch-table-card pp-ai-card pp-ai-${kind}">${F.resultCardHeader(title,{detail})}<div class="pp-ai-card-inner${kind==='brief'?' pp-ai-brief-inner':''}">${body}</div>${footer}</section>`;
 const statistics=()=>cardShell('statistics','Workspace opportunities',`${F.statsBar({variant:'statistics'})}<footer class="pp-ai-card-footnote">Application data · Revenue periods may differ between companies</footer>`,{detail:'At a glance'});
 const overview=v=>cardShell('overview','Company overview',`<div class="pp-ai-overview-body">${identity(v)}<p class="pp-ai-overview-intro">${E(v.solution)}</p><div class="pp-ai-overview-stats">${[['Score',`${v.score}/100`,'Workspace assessment','chart'],['Funding ask',v.ask,'Current round','coins'],['Runway',v.runway,'Reported runway','clock']].map(([label,value,caption,icon],n)=>`<div class="pp-ai-overview-stat tone-${n}">${I(icon,18)}<strong>${E(value)}</strong><span>${label}</span><small>${caption}</small></div>`).join('')}</div><div class="pp-ai-overview-narrative"><section><h3>The problem</h3><p>${E(v.problem)}</p></section><section><h3>The approach</h3><p>${E(v.solution)}</p></section></div><div class="pp-ai-facts"><table><thead><tr><th scope="col">Company details</th><th scope="col">From the application</th></tr></thead><tbody>${[['Industry',v.industry],['Stage',v.stage],['Funding round',v.round],['Funding raised',v.funding],['Founders',v.founders]].map(([label,value])=>`<tr><th scope="row">${label}</th><td>${E(value)}</td></tr>`).join('')}</tbody></table></div>${openAction(v)}</div>`,{detail:v.name+' · Application snapshot'});
 const brief=(v,focus='risks')=>{
  const sections={
   risks:[['Customer adoption','Verify repeat usage, renewals, and outcomes with customer references.'],['Revenue quality','Confirm the reporting period, recurring share, and concentration.'],['Financing','Connect the funding ask and runway to specific milestones.']],
   team:[['Founders',v.founders],['Team assessment','Confirm ownership of product, engineering, and customer delivery.'],['What to verify','Review operating experience and relevant references.']],
   traction:[['Commercial evidence','Review customer cohorts, retention, and recurring revenue.'],['Capital position',`${v.funding} raised · ${v.ask} current ask · ${v.runway} runway.`],['Next evidence','Request a monthly breakdown before drawing growth conclusions.']],
   problem:[['Problem',v.problem],['Approach',v.solution],['Next evidence','Validate the workflow and outcomes with target users.']]
  };
  const metrics=focus==='team'?[['Team score',`${v.team}/100`],['Founders',v.founderCount],['Stage',v.stage]]:focus==='traction'?[['Revenue',v.revenue],['Funding',v.funding],['Runway',v.runway]]:[['Score',`${v.score}/100`],['Ask',v.ask],['Runway',v.runway]];
  const title={risks:'Risks to validate',team:'Team overview',traction:'Traction and funding',problem:'Problem and approach'}[focus]||'Risks to validate';
  return cardShell('brief','Diligence brief',`${identity(v)}<dl class="pp-ai-brief-metrics">${metrics.map(([label,value])=>`<div><dt>${label}</dt><dd>${E(value)}</dd></div>`).join('')}</dl><section class="pp-ai-brief-answer"><h3>${title}</h3><p>Areas to investigate using the current application and supporting evidence.</p><div class="pp-ai-brief-sections">${(sections[focus]||sections.risks).map(([title,text],n)=>`<section><h4>${I(['info','grid','check'][n],16)}${title}</h4><p>${E(text)}</p></section>`).join('')}</div></section>`,{footer:openAction(v)});
 };
 const number=(v,fallback,min=0,max=1e12)=>Number.isFinite(Number(v))?Math.min(max,Math.max(min,Number(v))):fallback;
 const money=value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',notation:'compact',maximumFractionDigits:1}).format(value);
 F.aiRevenueSeries=(c={})=>{const horizon=number(c.horizon,24,3,36),baseline=number(c.baseline,800000),rate=number(c.rate,10,0,50);return Array.from({length:Math.floor(horizon/3)+1},(_,i)=>({month:i*3,value:baseline*(1+rate/100)**i}));};
 const revenue=(c={})=>{
  const series=F.aiRevenueSeries(c),horizon=series.at(-1).month,last=series.at(-1).value,first=series[0].value,lower=Math.min(first,last)*.9,spread=Math.max(1,last-lower),id='ai-revenue-wash-'+(++serial);
  const x=month=>7+month/horizon*286,y=value=>90-(value-lower)/spread*57;
  const rate=number(c.rate,10,0,50),curve=Array.from({length:horizon+1},(_,month)=>({month,value:first*(1+rate/100)**(month/3)}));
  const value=money(last),parts=value.match(/^(.*?)(\.\d+)?([KMBT])?$/),major=parts?.[1]||value,minor=(parts?.[2]||'')+(parts?.[3]||'');
  const points=curve.map(p=>`${x(p.month).toFixed(2)},${y(p.value).toFixed(2)}`).join(' ');
  return `<section class="pp-ai-projection pp-ai-revenue"><div class="pp-ai-projection-copy"><span class="pp-ai-projection-symbol">${I('coins',16)}</span><div><h3>Revenue growth</h3><strong aria-label="${E(value)}">${E(major)}<span>${E(minor)}</span></strong></div></div><figure><svg viewBox="0 0 300 122" role="group" aria-label="Illustrative modeled revenue from ${E(money(first))} to ${E(money(last))} over ${horizon} months"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" class="pp-ai-revenue-stop" stop-opacity=".26"/><stop offset="100%" class="pp-ai-revenue-stop" stop-opacity="0"/></linearGradient></defs>${Array.from({length:9},(_,n)=>`<line class="pp-ai-projection-grid" x1="${7+n/8*286}" x2="${7+n/8*286}" y1="14" y2="98"/>`).join('')}<polygon fill="url(#${id})" points="7,98 ${points} 293,98"/><polyline class="pp-ai-projection-line" points="${points}"/>${series.map((p,n)=>{const px=x(p.month),py=y(p.value),tx=Math.max(43,Math.min(257,px)),from=n?((x(series[n-1].month)+px)/2):0,to=n===series.length-1?300:(px+x(series[n+1].month))/2;return `<g class="pp-ai-revenue-point" tabindex="0" role="img" aria-label="${E(money(p.value))} at ${p.month} months"><rect class="pp-ai-projection-hit" x="${from}" y="0" width="${to-from}" height="102"/><g class="pp-ai-revenue-readout"><line x1="${px}" x2="${px}" y1="${py}" y2="98"/><circle cx="${px}" cy="${py}" r="3.5"/><rect x="${tx-41}" y="1" width="82" height="23" rx="5"/><text x="${tx}" y="16" text-anchor="middle">${E(money(p.value))} · ${p.month===0?'Now':p.month+' mo'}</text></g></g>`;}).join('')}${[0,.25,.5,.75,1].map(f=>`<text class="pp-ai-projection-tick" x="${7+f*286}" y="115" text-anchor="${f===0?'start':f===1?'end':'middle'}">${f===0?'Now':f*horizon+' mo'}</text>`).join('')}</svg><figcaption class="visually-hidden">Illustrative projection, using ${number(c.rate,10,0,50)}% quarterly growth.</figcaption></figure></section>`;
 };
 F.aiMarketSegments=(c={})=>{const total=Math.max(1,number(c.total,10000)),reachable=Math.min(total,number(c.reachable,2500)),target=Math.min(reachable,number(c.target,250));return [{label:'Outside reach',value:total-reachable,tone:'warm'},{label:'Other reachable',value:reachable-target,tone:'blue'},{label:'Initial target',value:target,tone:'green'}];};
 const market=(c={})=>{
  const segments=F.aiMarketSegments(c),total=segments.reduce((n,s)=>n+s.value,0),target=segments[2].value;
  const point=(r,a)=>`${150+r*Math.cos(a)} ${108+r*Math.sin(a)}`;
  const band=(start,end)=>{const o=88,i=68,k=Math.min(9,(end-start)*i*.4);return `M ${point(o,start+k/o)} A ${o} ${o} 0 ${end-start-2*k/o>Math.PI?1:0} 1 ${point(o,end-k/o)} Q ${point(o,end)} ${point(o-k,end)} L ${point(i+k,end)} Q ${point(i,end)} ${point(i,end-k/i)} A ${i} ${i} 0 ${end-start-2*k/i>Math.PI?1:0} 0 ${point(i,start+k/i)} Q ${point(i,start)} ${point(i+k,start)} L ${point(o-k,start)} Q ${point(o,start)} ${point(o,start+k/o)} Z`;};
  let angle=-Math.PI/2;
  const paths=segments.map(s=>{const sweep=s.value/total*Math.PI*2,gap=Math.min(.055,sweep*.22),start=angle+gap,end=angle+sweep-gap;angle+=sweep;return !s.value?'':`<g class="pp-ai-market-segment tone-${s.tone}" tabindex="0" role="img" aria-label="${s.label}: ${s.value.toLocaleString('en-US')} accounts"><path class="pp-ai-market-band" d="${band(start,end)}"/><path class="pp-ai-market-edge" d="M ${point(88,start)} A 88 88 0 ${end-start>Math.PI?1:0} 1 ${point(88,end)}"/><g class="pp-ai-market-readout"><text class="pp-ai-market-value" x="150" y="106" text-anchor="middle">${s.value.toLocaleString('en-US')}</text><text x="150" y="127" text-anchor="middle">${s.label}</text></g></g>`;}).join('');
  return `<section class="pp-ai-projection pp-ai-market"><span class="pp-ai-projection-symbol">${I('globe',16)}</span><div class="pp-ai-market-target"><h3>Initial market target</h3><strong>${target.toLocaleString('en-US')}</strong><small>accounts</small></div><svg viewBox="0 0 300 218" role="group" aria-label="Illustrative market opportunity in accounts"><g class="pp-ai-market-default"><text class="pp-ai-market-value" x="150" y="106" text-anchor="middle">${total.toLocaleString('en-US')}</text><text x="150" y="127" text-anchor="middle">Total accounts</text></g>${paths}</svg><div class="pp-ai-market-legend">${segments.map(s=>`<div class="tone-${s.tone}"><span><i></i>${s.label}</span><strong>${s.value.toLocaleString('en-US')}</strong></div>`).join('')}</div></section>`;
 };
 F.aiResponse=(c={})=>{
  const variant=F.aiResponseVariants.includes(c.variant)?c.variant:'text',v=company(c),thinking=c.state==='thinking';
  const activity=c.research?F.aiResearchActivity(c):'';
  if(thinking)return `<article class="pp-ai-response" aria-label="Assistant response">${activity||`<div class="pp-ai-thinking" role="status" aria-label="Thinking">${F.thinkingGrid()}${F.textShimmer({text:'Thinking',decorative:true})}${I('chevron',12)}</div>`}</article>`;
  const body=variant==='search'?F.aiWebSearch(c):variant==='table'?F.pitchTable({...c,variant:'chat',header:true,selectable:false,searchable:false}):variant==='statistics'?statistics():variant==='overview'?overview(v):variant==='brief'?brief(v,c.focus):variant==='revenue'?revenue(c):variant==='market'?market(c):['plain','empty'].includes(c.format)?`<div class="pp-ai-prose"><p>${E(c.text||(c.format==='empty'?'No companies in the workspace match those filters.':'Which company would you like to explore over time?'))}</p></div>`:`<div class="pp-ai-prose"><p>${E(c.text||'The application describes a focused workflow with a clear customer problem. The next step is to validate repeat usage, deployment effort, and customer outcomes.')} ${F.aiCitation({title:v.name+' · Application'})}</p><ul><li>Separate reported results from assumptions.</li><li>Connect each conclusion to supporting evidence.</li><li>Keep unresolved questions visible for the next review.</li></ul></div>`;
  return `<article class="pp-ai-response" aria-label="Assistant response">${activity}<div class="pp-ai-response-content">${variant==='text'&&['plain','empty'].includes(c.format)?'':`<p class="pp-ai-response-intro">${E(c.intro||(variant==='revenue'?`At ${number(c.rate,10,0,50)}% quarterly growth, ${v.name}’s reported revenue could reach ${money(F.aiRevenueSeries(c).at(-1).value)} over ${F.aiRevenueSeries(c).at(-1).month} months in this illustrative scenario.`:intro(variant,v)))}</p>`}${body}${c.followups===false?'':F.aiFollowups(c)}${c.actions===false?'':F.aiMessageActions()}</div><span class="visually-hidden" data-ai-action-status role="status" aria-live="polite"></span></article>`;
 };
 F.createActivitySequence=()=>{let elapsed=0;return {tick(ms,paused=false){if(!paused)elapsed=(elapsed+ms)%7500;return Math.min(3,Math.floor(elapsed/1500));}};};
 F.wireAIResponse=(root,registerCleanup=()=>{})=>{
  const cleanups=[],listen=(node,type,fn,options)=>{node?.addEventListener(type,fn,options);cleanups.push(()=>node?.removeEventListener(type,fn,options));};
  let active=null,origin=null,closingTrigger=null;
  const view=root.ownerDocument?.defaultView||window,doc=root.ownerDocument||document;
  const close=(restore=false)=>{const pop=active,trigger=origin;active=null;origin=null;if(pop){if(typeof pop.hidePopover==='function'&&pop.matches?.(':popover-open'))pop.hidePopover();pop.hidden=true;delete pop.dataset.open;}trigger?.setAttribute('aria-expanded','false');if(restore&&trigger?.isConnected)trigger.focus({preventScroll:true});};
  const position=()=>{
   if(!active||!origin)return;if(!origin.isConnected){close();return;}
   const box=origin.getBoundingClientRect(),w=active.offsetWidth,h=active.offsetHeight,vw=view.innerWidth||1024,vh=view.innerHeight||768;
   const above=box.top-h-12>=12,left=Math.max(12,Math.min(vw-w-12,box.left+box.width/2-w*.72)),top=Math.max(12,Math.min(vh-h-12,above?box.top-h-12:box.bottom+12));
   active.style.left=left+'px';active.style.top=top+'px';active.dataset.side=above?'above':'below';active.style.setProperty('--source-pointer',Math.max(20,Math.min(w-20,box.left+box.width/2-left))+'px');
  };
  const citationTriggers=root.querySelectorAll('[data-ai-source-trigger]');
  citationTriggers.forEach(trigger=>{
   const pop=root.querySelector('#'+trigger.getAttribute('aria-controls'));if(!pop)return;
   listen(trigger,'pointerdown',()=>{closingTrigger=active===pop?trigger:null;});
   listen(trigger,'click',()=>{if(active===pop||closingTrigger===trigger){closingTrigger=null;close(true);return;}close();active=pop;origin=trigger;pop.hidden=false;pop.dataset.open='true';if(typeof pop.showPopover==='function')pop.showPopover();trigger.setAttribute('aria-expanded','true');position();pop.focus({preventScroll:true});});
   listen(pop,'toggle',event=>{if(event.newState==='closed'&&active===pop)close(false);});
   const closeButton=pop.querySelector('[data-ai-source-close]');listen(closeButton,'click',()=>close(true));
  });
  if(citationTriggers.length){
  listen(doc,'pointerdown',event=>{if(active&&!active.contains(event.target)&&!origin?.contains(event.target))close(false);});
  listen(doc,'keydown',event=>{if(event.key==='Escape'&&active){event.preventDefault();event.stopPropagation();close(true);}});
  listen(view,'resize',position);listen(doc,'scroll',position,true);
  }
  root.querySelectorAll('[data-ai-followup]').forEach(button=>listen(button,'click',()=>{
   if(button.disabled)return;const group=button.closest('.pp-ai-followups');
   const text=button.dataset.aiFollowup,status=group.nextElementSibling;if(status)status.textContent='Selected follow-up: '+text;
   if(typeof CustomEvent==='function')root.dispatchEvent(new CustomEvent('forma:followup',{bubbles:true,detail:{text}}));
  }));
  root.querySelectorAll('[data-ai-open-record]').forEach(button=>listen(button,'click',()=>{
   const host=button.closest('.pp-ai-response'),status=host?.querySelector('[data-ai-action-status]');if(status)status.textContent='Company record selected in this template preview.';
   if(typeof CustomEvent==='function')root.dispatchEvent(new CustomEvent('forma:open-record',{bubbles:true,detail:{name:button.dataset.aiOpenRecord}}));
  }));

  root.querySelectorAll('[data-ai-task-rows]').forEach(host=>{
   const triggers=host.querySelectorAll('[data-ai-task-trigger]');
   triggers.forEach(button=>listen(button,'click',()=>{
    if(button.disabled)return;const open=button.getAttribute('aria-expanded')!=='true';
    triggers.forEach(trigger=>{if(!trigger.hasAttribute('aria-controls'))return;const expanded=trigger===button&&open,panel=host.querySelector('#'+trigger.getAttribute('aria-controls'));trigger.setAttribute('aria-expanded',String(expanded));if(panel){panel.dataset.open=String(expanded);panel.setAttribute('aria-hidden',String(!expanded));panel.inert=!expanded;}});
   }));
  });

  root.querySelectorAll('[data-ai-sequence]').forEach(host=>{
   if(!view.setInterval)return;const sequence=F.createActivitySequence(),reduced=view.matchMedia?.('(prefers-reduced-motion: reduce)');let last=-1;
   const update=()=>{const paused=F.paused||doc.hidden||host.closest?.('.preview-paused')||host.contains(doc.activeElement);const step=reduced?.matches?3:sequence.tick(100*(Number.parseFloat(host.closest?.('[style]')?.style.getPropertyValue('--speed'))||1),paused);if(step===last)return;last=step;
    host.dataset.researchStage=['reading','calculating','drafting','complete'][step];host.setAttribute('aria-busy',String(step<3));
    host.querySelectorAll('[data-phase]').forEach(row=>{const index=Number(row.dataset.phase),done=step===3||index<step,current=!done&&index===step;const tasks=host.dataset.aiSequence==='stages',status=done?'completed':current?'running':'queued';row.dataset.phaseState=tasks?status:done?'done':current?'running':'queued';
     const icon=row.querySelector('[data-phase-icon]');if(icon)icon.innerHTML=tasks?taskIcon(status):done?I('check',14):current?F.spinner({size:'sm',tone:'blue'}):I('clock',14);
     const phaseLabel=row.querySelector('[data-phase-label]');if(phaseLabel&&host.dataset.aiSequence==='research'){if(index===0)phaseLabel.textContent=(step===0?'Reading ':'Read ')+host.dataset.sourceCount+' files';if(index===2)phaseLabel.textContent=step===3?'Brief drafted':'Drafting brief';}
     const badge=row.querySelector('[data-phase-badge]');if(badge)badge.innerHTML=tasks?taskBadge(status):F.badge({tone:done?'success':current?'blue':'neutral',size:'sm'},done?'Done':current?'Running':'Queued');
     row.classList.toggle('is-current',current);row.classList.toggle('is-complete',done);row.classList.toggle('is-queued',!done&&!current);
    });
    const grid=host.querySelector('summary .pp-thinking-grid');if(grid)grid.dataset.playing=String(step<3);
    const title=host.querySelector('[data-sequence-title]');if(title)title.innerHTML=step<3?F.textShimmer({text:'Thinking'}):'Thought process';
   };update();const timer=view.setInterval(update,100);cleanups.push(()=>{view.clearInterval(timer);});
  });
  let disposed=false;
  root.querySelectorAll('.pp-ai-message-actions').forEach(group=>{
   const status=group.querySelector('[data-message-status]'),buttons=group.querySelectorAll('[data-message-action]');
   const announce=text=>{if(!disposed&&status)status.textContent=text;};
   const timers=new Map(),clear=button=>{const timer=timers.get(button);if(timer!==undefined){view.clearTimeout(timer);timers.delete(button);}},later=(button,fn,duration)=>{clear(button);if(!view.setTimeout)return;const timer=view.setTimeout(()=>{timers.delete(button);if(!disposed)fn();},duration);timers.set(button,timer);};
   const copied=(button,value)=>{button.dataset.copied=String(value);button.setAttribute('aria-label',value?'Response copied':'Copy response');button.setAttribute('title',value?'Response copied':'Copy response');};
   cleanups.push(()=>{timers.forEach(timer=>view.clearTimeout(timer));timers.clear();});
   buttons.forEach(button=>listen(button,'click',async()=>{
    if(disposed||button.disabled)return;
    const action=button.dataset.messageAction,host=button.closest('.pp-ai-response');
    if(action==='copy'){
     const content=host?.querySelector('.pp-ai-response-content')?.cloneNode(true);
     content?.querySelectorAll('.pp-ai-message-actions,.pp-ai-followups,[data-ai-followup-status],.pp-ai-source').forEach(node=>node.remove());
     const text=content?F.aiMessageText(content):'';
     clear(button);copied(button,false);button.disabled=true;
     try{if(!view.navigator?.clipboard?.writeText)throw new Error('Clipboard unavailable');await view.navigator.clipboard.writeText(text);if(disposed)return;copied(button,true);announce('Response copied.');later(button,()=>copied(button,false),parseFloat(F.resolve('component.response.actions.copyDuration')));}
     catch{announce('Could not copy. Select the response text to copy it.');}
     finally{if(!disposed)button.disabled=false;}
    }else if(action==='positive'||action==='negative'){
     const selected=button.getAttribute('aria-pressed')!=='true';
     buttons.forEach(other=>{if(['positive','negative'].includes(other.dataset.messageAction))other.setAttribute('aria-pressed',String(other===button&&selected));});
     announce(selected?'Feedback saved for this preview.':'Feedback cleared.');
     if(typeof CustomEvent==='function')host?.dispatchEvent(new CustomEvent('forma:feedback',{bubbles:true,detail:{rating:selected?action:null}}));
    }else if(action==='retry'){
     button.dataset.spinning='true';later(button,()=>button.dataset.spinning='false',parseFloat(F.resolve('component.response.actions.retryDuration')));
     announce('Regeneration requested in this preview.');
     if(typeof CustomEvent==='function')host?.dispatchEvent(new CustomEvent('forma:regenerate',{bubbles:true}));
    }
   }));
  });
  registerCleanup(()=>{disposed=true;close();cleanups.forEach(dispose=>dispose());});
 };
 document.getElementById('project-tokens').textContent=F.tokenCSS();
})();
