/* Pitch Protocol layout: measured desktop geometry + documented responsive extensions.
   Source: investor-preview/styles.css and DESIGN-SYSTEM.md. See docs/layout-system.md. */
(() => {
 const F=window.Forma,E=F.escape;
 const primitive=(id,type,value,source='existing')=>F.addToken(id,type,value,source);
 const alias=(id,target,source='normalized')=>F.addToken(id,F.tokens[target].type,`{${target}}`,source);
 for(const n of [48,56,80,248,391,680,740,780,1000,1180])primitive(`size.${n}`,'dimension',`${n}px`);
 for(const n of [4,8,12])primitive(`grid.columns.${n}`,'number',n,'extended');
 const geometry={
  'sidebar.expanded':'size.248','sidebar.collapsed':'size.80','sidebar.drawer':'size.248',
  'header.workspace':'size.48','header.review':'size.56','shell.inset':'space.8','shell.radius':'radius.4xl',
  'content.review':'size.740','content.reviewWithPanel':'size.680','content.conversation':'size.780','content.details':'size.1000',
  'panel.width':'size.391','page.padding':'space.20','reading.padding':'space.32',
  'grid.columns.mobile':'grid.columns.4','grid.columns.tablet':'grid.columns.8','grid.columns.desktop':'grid.columns.12',
  'grid.gutter.mobile':'space.16','grid.gutter.tablet':'space.20','grid.gutter.desktop':'space.24',
  'grid.margin.mobile':'space.16','grid.margin.tablet':'space.24','grid.margin.desktop':'space.32',
  'breakpoint.widePhone':'breakpoint.sm','breakpoint.tablet':'breakpoint.md','breakpoint.desktop':'breakpoint.lg','breakpoint.expanded':'breakpoint.xl',
  'sidebar.background':'semantic.surface.canvas','content.background':'semantic.surface.default','border':'semantic.border.default',
  'grid.background':'color.purple.200','grid.border':'color.purple.400','label':'semantic.text.secondary'
 };
 for(const [role,target]of Object.entries(geometry))alias('semantic.layout.'+role,target,role.startsWith('grid.')||role.startsWith('breakpoint.')||role==='sidebar.drawer'?'extended':'normalized');
 for(const role of ['sidebar.expanded','sidebar.collapsed','sidebar.drawer','header.workspace','header.review','shell.inset','shell.radius','content.review','content.reviewWithPanel','content.conversation','content.details','panel.width','page.padding','reading.padding'])alias('component.appShell.'+role,'semantic.layout.'+role);
 const number=id=>parseFloat(F.resolve(id));
 const profiles={
  workspace:{label:'Workspace',max:null,padding:'component.appShell.page.padding',header:'component.appShell.header.workspace'},
  review:{label:'Review',max:'component.appShell.content.review',padding:'component.appShell.reading.padding',header:'component.appShell.header.review'},
  conversation:{label:'Chat',max:'component.appShell.content.conversation',padding:'component.appShell.reading.padding',header:'component.appShell.header.workspace'}
 };
 /* Geometry is independent of the organizer viewport and responds to the specimen width. */
 F.layoutProfile=(config={})=>{
  const input=Number(config.width),width=Math.max(320,Math.min(1920,Number.isFinite(input)?Math.round(input):1440));
  const profile=Object.hasOwn(profiles,config.profile)?config.profile:'workspace',p=profiles[profile];
  const tablet=number('semantic.layout.breakpoint.tablet'),desktop=number('semantic.layout.breakpoint.desktop'),expanded=number('semantic.layout.breakpoint.expanded');
  const device=width< tablet?'mobile':width<desktop?'tablet':'desktop';
  const band=width<number('semantic.layout.breakpoint.widePhone')?'base':width<tablet?'sm':width<desktop?'md':width<expanded?'lg':'xl';
  const drawer=width<desktop,preference=['expanded','collapsed'].includes(config.sidebar)?config.sidebar:'auto';
  const sidebar=drawer?'drawer':preference==='auto'?(width<expanded?'collapsed':'expanded'):preference;
  const sidebarWidth=drawer?0:number('component.appShell.sidebar.'+sidebar);
  const drawerOpen=drawer&&Boolean(config.drawerOpen),drawerWidth=number('component.appShell.sidebar.drawer');
  const inset=drawer?0:number('component.appShell.shell.inset'),border=number('border.width');
  const panelWidth=Math.max(0,width-sidebarWidth-inset),innerWidth=panelWidth-2*border;
  const margin=drawer?number('semantic.layout.grid.margin.'+(band==='sm'?'tablet':device)):number(p.padding);
  const columns=number('semantic.layout.grid.columns.'+device),gutter=number('semantic.layout.grid.gutter.'+device);
  const available=Math.max(0,innerWidth-margin*2),contentWidth=Math.min(available,p.max?number(p.max):Infinity);
  const columnWidth=(contentWidth-gutter*(columns-1))/columns;
  return {width,profile,label:p.label,band,device,sidebar,preference,sidebarWidth,drawer,drawerOpen,drawerWidth,inset,margin,columns,gutter,contentWidth,columnWidth,
   contentX:sidebarWidth+border+(innerWidth-contentWidth)/2,header:number(p.header),maxWidth:p.max?number(p.max):null,
   responsive:drawer||width<expanded,source:width<expanded?'Responsive extension':'Desktop source dimensions'};
 };
 F.layoutTokens=()=>[
  ...['sidebar.expanded','sidebar.collapsed','sidebar.drawer','header.workspace','header.review','shell.inset','shell.radius','page.padding','reading.padding','content.review','content.reviewWithPanel','content.conversation','content.details','panel.width'].map(k=>'component.appShell.'+k),
  ...['grid.columns.mobile','grid.columns.tablet','grid.columns.desktop','grid.margin.mobile','grid.margin.tablet','grid.margin.desktop','grid.gutter.mobile','grid.gutter.tablet','grid.gutter.desktop','breakpoint.widePhone','breakpoint.tablet','breakpoint.desktop','breakpoint.expanded'].map(k=>'semantic.layout.'+k)
 ];
 let instance=0;
 const rect=(x,y,w,h,cls,extra='')=>`<rect x="${x}" y="${y}" width="${Math.max(0,w)}" height="${h}" class="${cls}" ${extra}/>`;
 function diagram(s){
  const height=s.device==='mobile'?560:540;
  const grid=Array.from({length:s.columns},(_,n)=>rect(s.contentX+n*(s.columnWidth+s.gutter),0,s.columnWidth,height,'layout-column'));
  const sidebar=width=>rect(0,0,width,height,'layout-sidebar-fill');
  return `<svg class="layout-diagram" style="max-width:${Number((s.width/height*360).toFixed(2))}px" viewBox="0 0 ${s.width} ${height}" role="img" aria-label="${E(`${s.width}px ${s.label.toLowerCase()} layout. ${s.columns} columns, ${s.gutter}px gutters. ${s.drawer?(s.drawerOpen?'248px navigation drawer overlays the page':'Navigation drawer closed'):s.sidebarWidth+'px '+s.sidebar+' sidebar'}. Content width ${Math.round(s.contentWidth)}px.`)}">${s.sidebarWidth?sidebar(s.sidebarWidth):''}<g class="layout-grid-overlay">${grid.join('')}</g>${s.drawerOpen?sidebar(s.drawerWidth):''}</svg>`;
 }

 const button=(attr,value,label,active)=>`<button type="button" ${attr}="${E(value)}" aria-pressed="${active}">${label}</button>`;
 const metrics=s=>[
  ['Columns',s.columns],['Gutter',s.gutter+'px'],['Edge margin',s.margin+'px'],['Content',Math.round(s.contentWidth)+'px'],
  ['Column width',Number(s.columnWidth.toFixed(1))+'px'],['Navigation',s.drawer?'Drawer':s.sidebarWidth+'px']
 ].map(([label,value])=>`<div><dt>${label}</dt><dd>${value}</dd></div>`).join('');
 function measuredGrid(s){
  const y=50,height=225;
  const measure=(x,w,at,color,label)=>`<path d="M ${x} ${at-5} V ${at+5} M ${x} ${at} H ${x+w} M ${x+w} ${at-5} V ${at+5}" class="layout-measure ${color}"/><text x="${x+w/2}" y="${at===32?at-12:at+27}" text-anchor="middle" class="layout-measure-label">${label}</text>`;
  return `<svg class="layout-measured-diagram" viewBox="0 0 ${s.width} 336" role="img" aria-label="${E(`${s.sidebar} sidebar ${s.sidebarWidth}px. Twelve ${Number(s.columnWidth.toFixed(1))}px columns with ${s.gutter}px gutters.`)}">${rect(0,y,s.sidebarWidth,height,'layout-key-sidebar')}${Array.from({length:s.columns},(_,n)=>rect(s.contentX+n*(s.columnWidth+s.gutter),y,s.columnWidth,height,'layout-key-column')).join('')}${measure(0,s.sidebarWidth,32,'layout-stroke-sidebar',s.sidebarWidth+'px')}${measure(s.contentX,s.columnWidth,32,'layout-stroke-column',Number(s.columnWidth.toFixed(1))+'px')}${measure(s.contentX+s.columnWidth,s.gutter,298,'layout-stroke-gutter',s.gutter+'px')}<text x="${s.contentX+s.contentWidth/2}" y="20" text-anchor="middle" class="layout-measure-label">12 columns</text></svg>`;
 }
 function comparison(){
  return `<section class="foundation-section layout-comparison"><div class="section-title"><h2>Sidebar layouts</h2><small>1440px · Workspace</small></div><div class="layout-legend">${[['sidebar','Sidebar'],['column','Column'],['gutter','Gutter']].map(([key,label])=>`<span><i class="layout-key-${key}"></i>${label}</span>`).join('')}</div>${['expanded','collapsed'].map(sidebar=>{const s=F.layoutProfile({width:1440,profile:'workspace',sidebar});return `<div class="layout-comparison-item"><div><h3>${sidebar==='expanded'?'Expanded':'Collapsed'}</h3><span>${s.sidebarWidth}px sidebar · ${Number(s.columnWidth.toFixed(1))}px columns · ${s.gutter}px gutters</span></div><div class="layout-comparison-frame">${measuredGrid(s)}</div></div>`;}).join('')}</section>`;
 }
 function breakpointTable(){
  const bands=[['base','320–639','4','16px','16px','Drawer'],['sm','640–767','4','16px','24px','Drawer'],['md','768–1023','8','20px','24px','Drawer'],['lg','1024–1279','12','24px','20 / 32px','Collapsed'],['xl','1280+','12','24px','20 / 32px','Expanded']];
  return `<section class="foundation-section layout-breakpoints"><div class="section-title"><h2>Breakpoints</h2><small>Responsive extension</small></div><div class="layout-table-scroll" role="region" aria-label="Layout breakpoint rules" tabindex="0"><table class="layout-rule-table"><thead><tr>${['Range','Viewport','Columns','Gutter','Edge margin','Navigation default'].map(x=>`<th scope="col">${x}</th>`).join('')}</tr></thead><tbody>${bands.map(([band,...v])=>`<tr data-layout-band="${band}"><th scope="row">${band}</th>${v.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="layout-footnote">Desktop edges: 20px workspace · 32px reading pages. Columns fill the content area.</p></section>`;
 }
 F.layoutFoundation=(config={})=>{
  const s=F.layoutProfile(config),id='layout-width-'+(++instance);
  return `<section class="layout-foundation" data-layout-foundation data-layout-width="${s.width}" data-layout-profile="${s.profile}" data-layout-sidebar="${s.preference}">
   <div class="layout-demo-controls"><div class="layout-control-group" role="group" aria-label="Viewport preset">${[['1440','Desktop'],['1100','Laptop'],['834','Tablet'],['390','Mobile']].map(([w,label])=>button('data-layout-preset',w,label,s.width===Number(w))).join('')}</div><div class="layout-control-group" role="group" aria-label="Content layout">${Object.entries(profiles).map(([key,p])=>button('data-layout-profile',key,p.label,s.profile===key)).join('')}</div></div>
   <div class="layout-width-control"><label for="${id}">Viewport <output data-layout-output>${s.width}px</output></label><input id="${id}" data-layout-range type="range" min="320" max="1920" step="1" value="${s.width}" aria-valuetext="${s.width} pixels"><span data-layout-rule>${E(s.source)}</span></div>
   <div class="layout-nav-controls"><div class="layout-control-group" role="group" aria-label="Desktop navigation">${['auto','expanded','collapsed'].map(v=>button('data-layout-sidebar',v,v.charAt(0).toUpperCase()+v.slice(1),s.preference===v)).join('')}</div><button type="button" class="layout-drawer-trigger" data-layout-drawer aria-expanded="${s.drawerOpen}" ${s.drawer?'':'hidden'}>${F.icon('menu',16)}<span>${s.drawerOpen?'Close':'Open'} drawer</span></button><button type="button" class="layout-grid-toggle" data-layout-grid aria-pressed="true">${F.icon('grid',16)} Grid</button></div>
   <div class="layout-demo-stage"><div data-layout-diagram>${diagram(s)}</div></div><dl class="layout-metrics" data-layout-metrics>${metrics(s)}</dl><p class="layout-status" role="status" aria-live="polite" data-layout-status></p>
  </section>${comparison()}${breakpointTable()}`;
 };
 F.wireLayoutFoundation=(root,registerCleanup)=>{
  const el=root.querySelector('[data-layout-foundation]');if(!el)return()=>{};
  let config={width:Number(el.dataset.layoutWidth),profile:el.dataset.layoutProfile,sidebar:el.dataset.layoutSidebar,drawerOpen:false},grid=true;
  const range=el.querySelector('[data-layout-range]');
  const render=(announce=false)=>{
   const s=F.layoutProfile(config);config.width=s.width;if(!s.drawer)config.drawerOpen=false;
   el.dataset.layoutWidth=String(s.width);el.dataset.layoutProfile=s.profile;el.dataset.layoutSidebar=s.preference;
   range.value=String(s.width);range.setAttribute('aria-valuetext',s.width+' pixels');
   el.querySelector('[data-layout-output]').textContent=s.width+'px';el.querySelector('[data-layout-rule]').textContent=s.source;
   el.querySelector('[data-layout-diagram]').innerHTML=diagram(s);el.querySelector('[data-layout-diagram]').classList.toggle('layout-grid-hidden',!grid);
   el.querySelector('[data-layout-metrics]').innerHTML=metrics(s);
   for(const b of el.querySelectorAll('[data-layout-preset]'))b.setAttribute('aria-pressed',String(Number(b.dataset.layoutPreset)===s.width));
   for(const b of el.querySelectorAll('button[data-layout-profile]'))b.setAttribute('aria-pressed',String(b.dataset.layoutProfile===s.profile));
   for(const b of el.querySelectorAll('button[data-layout-sidebar]')){b.disabled=s.drawer;b.setAttribute('aria-pressed',String(b.dataset.layoutSidebar===s.preference));}
   const drawer=el.querySelector('[data-layout-drawer]');drawer.hidden=!s.drawer;drawer.setAttribute('aria-expanded',String(s.drawerOpen));drawer.querySelector('span').textContent=(s.drawerOpen?'Close':'Open')+' drawer';
   for(const row of root.querySelectorAll('[data-layout-band]'))row.classList.toggle('is-current',row.dataset.layoutBand===s.band);
   if(announce)el.querySelector('[data-layout-status]').textContent=`${s.width}px, ${s.columns} columns, ${s.drawer?(s.drawerOpen?'drawer open':'drawer closed'):s.sidebar+' sidebar'}.`;
  };
  const onInput=event=>{if(event.target===range){config.width=Number(range.value);render();}};
  const onChange=event=>{if(event.target===range)render(true);};
  const onClick=event=>{
   const b=event.target.closest('button');if(!b||!el.contains(b)||b.disabled)return;
   if(b.hasAttribute('data-layout-preset'))config.width=Number(b.dataset.layoutPreset);
   else if(b.hasAttribute('data-layout-profile'))config.profile=b.dataset.layoutProfile;
   else if(b.hasAttribute('data-layout-sidebar'))config.sidebar=b.dataset.layoutSidebar;
   else if(b.hasAttribute('data-layout-drawer'))config.drawerOpen=!config.drawerOpen;
   else if(b.hasAttribute('data-layout-grid')){grid=!grid;b.setAttribute('aria-pressed',String(grid));}
   else return;
   render(true);
  };
  const onKey=event=>{if(event.key==='Escape'&&config.drawerOpen){config.drawerOpen=false;render(true);el.querySelector('[data-layout-drawer]').focus();}};
  el.addEventListener('input',onInput);el.addEventListener('change',onChange);el.addEventListener('click',onClick);el.addEventListener('keydown',onKey);render();
  const cleanup=()=>{el.removeEventListener('input',onInput);el.removeEventListener('change',onChange);el.removeEventListener('click',onClick);el.removeEventListener('keydown',onKey);};
  if(typeof registerCleanup==='function')registerCleanup(cleanup);return cleanup;
 };
 document.getElementById('project-tokens').textContent=F.tokenCSS();
})();
