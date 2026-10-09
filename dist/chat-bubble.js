/* Reusable message surfaces only. Geometry retains PP's 9px / 6px / 12px
   bubble dimensions; appearances and grouping adapt the supplied Bubble reference. */
(() => {
 'use strict';
 const F=window.Forma,E=F.escape;
 if(!F.tokens['radius.9'])F.addToken('radius.9','dimension','9px','existing');
 const geometry={radius:'radius.9',paddingX:'space.12',paddingY:'space.6',font:'font.size.13',line:'font.line.20',weight:'font.weight.400',gap:'space.4',borderWidth:'border.width'};
 const appearances={
  primary:{background:'semantic.action.primary',foreground:'semantic.text.inverse',border:'color.transparent'},
  secondary:{background:'semantic.surface.subtle',foreground:'semantic.text.body',border:'color.transparent'},
  tinted:{background:'color.blue.50',foreground:'color.blue.800',border:'color.transparent'},
  outline:{background:'semantic.surface.default',foreground:'semantic.text.body',border:'semantic.border.default'},
  ghost:{foreground:'semantic.text.body'}
 };
 const ref=(id,target)=>F.addToken(id,F.tokens[target].type,`{${target}}`,'normalized');
 for(const [role,target]of Object.entries(geometry))ref('component.chatBubble.'+role,target);
 for(const [appearance,roles]of Object.entries(appearances))for(const [role,target]of Object.entries(roles))ref(`component.chatBubble.${appearance}.${role}`,target);
 const config=c=>({appearance:Object.hasOwn(appearances,c.appearance)?c.appearance:'primary',align:c.align==='end'?'end':'start',grouping:c.grouping==='grouped'?'grouped':'single'});
 F.chatBubbleTokens=(c={})=>{
  const {appearance,grouping}=config(c),framed=appearance!=='ghost';
  return ['font.family.sans',...['font','line','weight',...(framed?['radius','paddingX','paddingY']:[]),...(appearance==='outline'?['borderWidth']:[]),...(grouping==='grouped'?['gap']:[])].map(role=>'component.chatBubble.'+role),...Object.keys(appearances[appearance]).map(role=>`component.chatBubble.${appearance}.${role}`)];
 };
 F.chatBubble=(c={})=>{
  const {appearance,align,grouping}=config(c),text=c.text===undefined?'Could you summarize the key findings?':String(c.text),messages=grouping==='grouped'?[text,'Please include the most important details.']:[text];
  const variables=Object.keys(appearances[appearance]).map(role=>`--chat-bubble-${role}:${F.v(`component.chatBubble.${appearance}.${role}`)}`).join(';');
  return `<div class="pp-chat-bubble-group" data-slot="bubble-group" data-grouping="${grouping}">${messages.map(message=>`<div class="pp-chat-bubble" data-slot="bubble" data-appearance="${appearance}" data-align="${align}" style="${variables}"><p data-slot="bubble-content">${E(message)}</p></div>`).join('')}</div>`;
 };
 document.getElementById('project-tokens').textContent=F.tokenCSS();
})();
