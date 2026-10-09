/* Compact keyboard hints and refined progress bars reuse the public atom contracts. */
(() => {
 const F=window.Forma,E=F.escape;
 if(!F.tokens['size.320'])F.addToken('size.320','dimension','320px','normalized');
 for(const [role,target]of Object.entries({gap:'space.2',padding:'space.4',radius:'radius.xs',background:'semantic.surface.default',foreground:'semantic.text.secondary',border:'semantic.border.default',font:'font.size.11',height:'space.20'}))F.addToken('component.kbd.'+role,F.tokens[target].type,'{'+target+'}','normalized');
 F.kbd=(c={})=>{const keys=String(c.key||'⌘ K').trim().split(/\s+/).filter(Boolean);return `<kbd class="pp-key-combination ${c.size==='lg'?'size-lg':c.size==='sm'?'size-sm':''}" aria-label="${E(keys.map(k=>({'⌘':'Command','⌃':'Control','⌥':'Option','⇧':'Shift','↵':'Enter'}[k]||k)).join(' + '))}">${keys.map(key=>`<span>${E(key)}</span>`).join('')}</kbd>`;};
 F.kbdTokens=(c={})=>['font.family.sans','font.weight.500','border.width',...Object.keys(F.tokens).filter(k=>k.startsWith('component.kbd.')),...(c.size==='lg'?['space.28','font.size.13']:c.size==='sm'?['size.18','font.size.10']:[])];
 F.addToken('component.progress.duration','duration','{motion.duration.normal}','normalized');F.addToken('component.progress.easing','cubicBezier','{motion.easing.standard}','normalized');
 const oldProgressTokens=F.progressTokens;
 F.progressTokens=(c={})=>[...oldProgressTokens(c),'component.progress.duration','component.progress.easing','size.320','space.8','font.weight.400',...(c.label?['font.family.sans','component.progress.label','component.progress.label.font']:[])];
 F.progress=(c={})=>{const value=Math.max(0,Math.min(100,Number(c.value)||0)),fill=F.progressTokens(c)[0];return `<div class="pp-progress-block pp-refined-progress ${c.label?'has-heading':''}" style="--progress-fill:${F.v(fill)}">${c.label?`<div class="pp-progress-heading"><span>${E(c.label)}</span>${c.showLabel?`<span>${value}%</span>`:''}</div>`:''}<div class="pp-progress" role="progressbar" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100" aria-label="${E(c.label||'Progress')}"><span style="width:${value}%"></span></div>${c.showLabel&&!c.label?`<small>${value}%</small>`:''}</div>`;};
 document.getElementById('project-tokens').textContent=F.tokenCSS();
})();
