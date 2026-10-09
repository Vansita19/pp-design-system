/* Core tokens for the configured example, maintained alongside components.css.
   This is a manual list, not an exhaustive computed-style inventory. Components
   without a verified override retain their catalogue list through fallback. */
F.componentTokens=(item,c,fallback=[])=>{
 const unique=ids=>[...new Set(ids)];
 const inherited=()=>typeof fallback==='function'?fallback(item,c):fallback;
 const text=['font.family.sans','font.size.14'];
 const tone=c.tone&&c.tone!=='neutral'?(c.tone==='blue'?'info':c.tone):null;
 const foreground=tone?'semantic.status.'+tone:'semantic.text.body';
 const subtle=tone?'semantic.status.'+tone+'Subtle':'semantic.surface.subtle';
 const button=config=>Object.entries(F.buttonTokens(config)).filter(([key])=>!['hover','active'].includes(key)).map(([,id])=>id);
 let ids;
 const workspace=item.id==='popover'&&['membership','sharing'].includes(c.variant)||item.id==='filter-bar'&&c.variant==='advanced';
 if(workspace)return unique(F.sourceWorkspaceTokens({...c,...(item.id==='filter-bar'?{variant:'advanced-filter'}:{})}));
 if(item.id==='conversation')return F.chatBubbleTokens(c);
 if(item.id==='evidence-trace')return F.sourceTraceTokens(c);
 if(item.id==='navigation'||item.id==='account-flow'||['form-layout','settings-layout'].includes(item.id)&&c.variant!=='basic'||item.id==='file-upload'&&['preview','logo-upload'].includes(c.variant)||item.id==='modal'&&['decision','form-dialog'].includes(c.variant))return F.sourceShellTokens({...c,...(item.id==='navigation'?{variant:'navigation'}:item.id==='file-upload'&&c.variant==='preview'?{variant:'file-preview'}:{})});
 switch(item.id){
  case 'button':case 'icon-button':
   ids=['font.family.sans',...button(item.id==='icon-button'?{...c,icon:'only'}:c)];
   if(c.state==='loading')ids.push('motion.duration.spin');
   break;
  case 'input':case 'textarea':case 'field':{
   const state=c.state||'default';
   const border={focus:'semantic.border.focus',hover:'semantic.border.strong',invalid:'semantic.border.danger',success:'semantic.border.success'}[state]||'component.input.border';
   ids=['font.family.sans','component.input.radius','component.input.padding','border.width','font.line.20',
    c.size==='sm'?'font.size.13':'component.input.font',border,
    state==='disabled'?'semantic.surface.disabled':state==='readonly'?'semantic.surface.canvas':'component.input.background',
    state==='disabled'?'semantic.text.disabled':'component.input.foreground'];
   if(item.id!=='textarea')ids.push('component.control.height.'+(c.size||'md'));
   if(item.id!=='select'&&!c.value)ids.push('component.input.placeholder');
   if(item.id==='input'&&c.icon==='leading')ids.push('semantic.text.placeholder','space.36');
   if(state==='focus')ids.push('component.input.focus');
   if(item.id==='field'){
    ids.push('font.size.14','font.weight.500','semantic.text.heading','space.8');
    if(c.required)ids.push('semantic.status.danger');
    if(c.helper||state==='invalid'||state==='success')ids.push('font.size.12','font.weight.400',state==='invalid'?'semantic.status.danger':state==='success'?'semantic.status.success':'semantic.text.secondary');
   }
   break;
  }
  case 'select':case 'combobox':case 'dropdown':
   ids=F.menuTokens(item.id,c);break;
  case 'accordion':ids=F.accordionTokens(c);break;
  case 'metric-card':ids=F.metricCardTokens(c);break;
  case 'timeline':ids=F.profileTimelineTokens({...c,variant:'timeline'});break;
  case 'information-block':ids=c.variant==='stacked'?F.stackedInformationTokens(c):c.variant==='table'?F.informationTableTokens(c):F.sourceInformationTokens(c);break;
  case 'card':ids=c.variant==='prompt'?F.promptSuggestionTokens(c):F.noteCardTokens(c);break;
  case 'stats-bar':ids=F.statsBarTokens(c);break;
  case 'suggestion':ids=F.aiFollowupTokens(c);break;
  case 'popover':ids=c.variant==='guided'?F.guidedPopoverTokens(c):c.variant==='source'?F.aiSourceTokens(c):inherited();break;
  case 'ai-response':ids=F.aiResponseTokens(c);break;
  case 'slider':ids=F.sliderTokens(c);break;
  case 'badge':
   ids=['font.family.sans',...(['raised','status-neutral','status-subtle','category'].includes(c.variant)?[]:['border.width']),...Object.values(F.badgeTokens(c))];
   if(c.variant==='status'&&c.status==='progress')ids.push('motion.duration.spin');
   if((c.indicator||(c.dot?'dot':'none'))==='dot')ids.push('radius.full');
   break;
  case 'chip':
   ids=F.chipTokens(c);
   break;
  case 'link':
   ids=['font.family.sans',...button({...c,variant:'link'})];
   break;
  case 'button-group':
   ids=['font.family.sans','component.button.group.radius','component.button.group.border','border.width','radius.none','shadow.none',...F.groupButtons(c).flatMap(config=>Object.entries(F.buttonTokens(config)).filter(([key])=>!['hover','active','border','radius','shadow'].includes(key)).map(([,id])=>id))];
   if(F.groupKind(c)==='selection')ids.push('component.button.group.selected.background','component.button.group.selected.foreground');
   break;
  case 'checkbox':case 'radio':
   ids=F.selectionTokens(item.id);
   if(item.id==='radio')ids.push('font.weight.500');
   break;
  case 'switch':
   ids=F.switchTokens(c);
   break;
  case 'avatar':case 'avatar-group':
   ids=item.id==='avatar'?F.avatarTokens(c):F.avatarGroupTokens(c);
   break;
  case 'tabs':
   ids=F.pitchTabsTokens(c);
   break;
  case 'alert':
   ids=F.alertTokens(c);
   break;
  case 'command-menu':ids=F.commandMenuTokens(c);break;
  case 'toast':case 'action-bar':ids=F.actionFeedbackTokens();break;
  case 'data-table':
   ids=F.pitchTableTokens(c);
   break;
  case 'multiselect':
   ids=[...inherited(),...F.selectionTokens('checkbox'),...F.chipTokens({variant:'removable',tone:'blue',size:'sm',disabled:c.disabled})];
   break;
  case 'filter-bar':
   ids=F.pitchFilterTokens(c);
   break;
  case 'form-layout':ids=[...inherited(),...F.menuTokens('select')];break;
  case 'settings-layout':
   ids=[...inherited(),...F.switchTokens(),...F.menuTokens('select')];
   break;
  case 'file-upload':
   ids=F.fileUploadTokens(c);
   break;
  case 'pagination':ids=F.paginationTokens(c);break;
  case 'stepper':ids=F.stepperTokens(c);break;
  case 'drawer':
   ids=F.drawerTokens(c);
   break;
  case 'date-picker':ids=F.datePickerTokens(c);break;
  case 'tooltip':ids=F.tooltipTokens(c);break;
  case 'spinner':
   ids=F.spinnerTokens(c);
   break;
  case 'progress':
   ids=F.progressTokens(c);
   break;
  case 'skeleton':
   ids=['radius.sm'];
   if(c.variant==='avatar')ids.push('radius.full','space.40','space.20');
   if(c.animated)ids.push('motion.duration.skeleton');
   else ids.push('semantic.surface.subtle');
   break;
  case 'tag':ids=F.tagContract(c);break;
  case 'kbd':
   ids=F.kbdTokens(c);break;
  case 'legacy-kbd':
   ids=['font.family.mono','color.transparent','semantic.border.default','semantic.text.body','radius.md','space.8','border.width','font.line.20',c.size==='sm'?'space.24':c.size==='lg'?'space.36':'space.28',c.size==='sm'?'font.size.11':c.size==='lg'?'font.size.16':'font.size.13',...(c.size==='sm'?['space.6']:[])];
   break;
  case 'text-shimmer':
   ids=F.textShimmerTokens(c);
   break;
  case 'text-glow':
   ids=['font.family.sans','font.size.22','font.weight.500','semantic.action.primary','motion.duration.textGlow'];
   break;
  case 'streaming-text':
   ids=['font.family.sans','font.size.16','semantic.text.body','semantic.action.primary','motion.duration.streamStep','motion.duration.caret'];
   break;
  case 'ai-loader':
   ids=F.thinkingGridTokens(c);
   break;
  case 'thinking-dots':
   ids=[...text,'semantic.text.body','semantic.text.secondary','motion.duration.dots','space.4','space.12','radius.full'];
   break;
  case 'waveform':
   ids=[...F.voiceWaveformTokens(),'space.48'];
   break;
  case 'composer':ids=F.promptBarTokens(c);break;
  case 'ai-status':{
   if(c.variant==='research'){ids=F.aiResearchActivityTokens(c);break;}
   ids=c.variant==='search'?F.aiCompactTokens():F.aiTaskRowsTokens(c);
   break;
  }
  default:return inherited();
 }
 return unique(ids);
};
