/* References remain named here; literal values belong to their foundations. */
F.tokenLabel=id=>id.replace(/^(?:color|semantic)\./,'');
F.tokenPage=id=>{
  if(id.startsWith('semantic.'))return 'semantic-tokens';
  const primitive=F.chain(id).at(-1);
  if(primitive.startsWith('color.'))return 'colors';
  if(primitive.startsWith('font.'))return 'typography';
  if(primitive.startsWith('icon.'))return 'icons';
  if(primitive.startsWith('space.'))return 'spacing';
  if(primitive.startsWith('radius.'))return 'radius';
  if(primitive.startsWith('shape.'))return 'radius';
  if(primitive.startsWith('shadow.'))return 'shadows';
  if(primitive.startsWith('motion.'))return 'motion-tokens';
  if(primitive.startsWith('border.'))return 'borders';
  if(primitive.startsWith('layout.')||primitive.startsWith('size.'))return 'grids';
  if(primitive.startsWith('breakpoint.'))return 'grids';
  if(primitive.startsWith('layer.'))return 'layers';
  return 'semantic-tokens';
};
F.tokenReference=(id,className,label=F.tokenLabel(id))=>{
  const page=F.tokenPage(id),content=`<code>${F.escape(label)}</code>`;
  return F.isPageVisible(page)
    ?`<a class="${className}" href="#${page}" title="${F.escape(id)}">${content}</a>`
    :`<span title="${F.escape(id)}">${content}</span>`;
};
F.tokenRow=(id,{showPrimitiveValues=false}={})=>{
  const token=F.tokens[id],resolved=String(F.resolve(id)),chain=F.chain(id);
  const references=chain.length>1?chain.slice(1):showPrimitiveValues?[]:[id];
  const value=references.length
    ?references.map(ref=>F.tokenReference(ref,'token-reference')).join(`<span class="token-arrow" aria-hidden="true">${F.icon('arrow-right',12)}</span>`)
    :`<code>${F.escape(resolved)}</code>`;
  const copy=references.length?'{'+references[0]+'}':resolved;
  const swatch=token.type==='color'?`<i class="token-swatch" aria-hidden="true" style="background:${F.escape(resolved)}"></i>`:'';
  return `<tr><td>${F.tokenReference(id,'token-link',id)}</td><td><span class="token-value">${swatch}<span class="token-reference-chain">${value}</span></span></td><td><button class="icon-control copy-token" aria-label="Copy ${F.escape(copy)}" data-copy="${F.escape(copy)}">${F.icon('copy',14)}</button></td></tr>`;
};
F.tokenTable=(ids,options={})=>`<div class="token-table-wrap"><table class="token-table"><thead><tr><th scope="col">TOKEN</th><th scope="col">VALUE</th><th scope="col"><span class="visually-hidden">Copy value</span></th></tr></thead><tbody>${[...new Set(ids)].filter(id=>F.tokens[id]).map(id=>F.tokenRow(id,options)).join('')}</tbody></table></div>`;
