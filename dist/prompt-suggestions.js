/* Live homepage Start here cards, not the older deal/attention cards. */
(() => {
 const F=window.Forma,E=F.escape;
 const templates={
  discover:{title:'Discover companies',description:'Find early-stage companies that fit your thesis.',icon:'search',prompt:'Find seed and pre-seed B2B companies with revenue',selection:'seed and pre-seed'},
  research:{title:'Deep dive into a company',description:'Explore the team, traction, and key risks.',icon:'telescope',prompt:'Review CREE8: its team, traction, and key risks',selection:'CREE8'},
  meeting:{title:'Prep for a meeting',description:'Build a focused list of questions for the founders.',icon:'file',prompt:'Prepare for a meeting with CREE8. What should I ask the founders?',selection:'CREE8'}
 };
 for(const n of [22,38,120,168])if(!F.tokens['size.'+n])F.addToken('size.'+n,'dimension',n+'px','existing');
 for(const [id,value]of Object.entries({'font.line.19':'19px','font.line.22':'22px','border.width.card':'0.6px','size.prompt.home':'900px'}))if(!F.tokens[id])F.addToken(id,'dimension',value,'existing');
 const semantic={background:'semantic.surface.default',foreground:'semantic.text.heading',description:'semantic.text.placeholder',icon:'semantic.text.secondary',border:'semantic.border.default'};
 for(const [role,target]of Object.entries(semantic))F.addToken('semantic.promptSuggestion.'+role,F.tokens[target].type,`{${target}}`,'normalized');
 const aliases={groupWidth:'size.prompt.home',height:'size.168',innerHeight:'size.120',padding:'space.24',gap:'space.24',copyGap:'space.8',groupGap:'space.12',radius:'radius.2xl',borderWidth:'border.width.card',
  iconSize:'size.22',titleFont:'font.size.16',titleLine:'font.line.22',titleWeight:'font.weight.500',descriptionFont:'font.size.13',descriptionLine:'font.line.19',descriptionHeight:'size.38',focus:'shadow.focus'};
 for(const role of Object.keys(semantic))aliases[role]='semantic.promptSuggestion.'+role;
 for(const [role,target]of Object.entries(aliases))F.addToken('component.promptSuggestion.'+role,F.tokens[target].type,`{${target}}`,'normalized');
 F.promptSuggestionTokens=(c={})=>['font.family.sans','font.weight.400',...Object.keys(aliases).map(role=>'component.promptSuggestion.'+role),...(c.disabled?['semantic.text.disabled','semantic.surface.disabled']:[])];
 F.promptSuggestions=(c={})=>{
  const intent=Object.hasOwn(templates,c.intent)?c.intent:'discover',group=c.layout==='group',items=group?Object.entries(templates):[[intent,templates[intent]]];
  return `<div class="pp-prompt-suggestions ${group?'is-group':'is-single'}" data-prompt-suggestions>${group?'<div class="pp-prompt-suggestion-grid" role="group" aria-label="Suggested prompts">':''}${items.map(([key,t])=>`<button type="button" class="pp-prompt-suggestion" data-prompt-suggestion="${key}"${c.targetId?` data-prompt-target="${E(c.targetId)}"`:''}${c.disabled?' disabled':''}><span class="pp-prompt-suggestion-inner">${F.icon(t.icon,parseFloat(F.resolve('component.promptSuggestion.iconSize')))}<span class="pp-prompt-suggestion-copy"><strong>${E(t.title)}</strong><span>${E(t.description)}</span></span></span></button>`).join('')}${group?'</div>':''}<span class="visually-hidden" role="status" aria-live="polite" data-prompt-suggestion-status></span></div>`;
 };
 F.wirePromptSuggestions=(root,registerCleanup=()=>{})=>{
  const click=event=>{
   const button=event.target.closest?.('[data-prompt-suggestion]');if(!button||!root.contains(button)||button.disabled)return;
   const t=templates[button.dataset.promptSuggestion];if(!t)return;
   const doc=button.ownerDocument||document,win=doc.defaultView||window;
   const target=button.dataset.promptTarget?doc.getElementById(button.dataset.promptTarget):button.closest('form')?.querySelector('textarea[name="prompt"],[data-prompt-input]');
   const status=button.closest('[data-prompt-suggestions]').querySelector('[data-prompt-suggestion-status]');
   const start=t.prompt.indexOf(t.selection),range=start>=0?{start,end:start+t.selection.length}:{};
   let filled=false;
   if(target?.matches?.('[data-prompt-input][contenteditable]')&&typeof F.setPromptDraft==='function'){
    filled=F.setPromptDraft(target,t.prompt,range)===true;
   }else if(target?.tagName?.toLowerCase()==='textarea'&&!target.disabled&&!target.readOnly){
    target.value=t.prompt;target.dispatchEvent(new win.Event('input',{bubbles:true}));target.focus({preventScroll:true});
    if(start>=0)target.setSelectionRange(range.start,range.end);filled=true;
   }
   if(filled){status.textContent=t.title+' prompt added.';
   }else{
    status.textContent='Suggested prompt: '+t.prompt;F.notify?.('Suggested prompt: '+t.prompt);
   }
  };
  root.addEventListener('click',click);const cleanup=()=>root.removeEventListener('click',click);registerCleanup(cleanup);return cleanup;
 };
 document.getElementById('project-tokens').textContent=F.tokenCSS();
})();
