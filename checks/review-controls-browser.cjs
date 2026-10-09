/* Browser audit: every declared token edit must affect its consuming CSS in real specimens.
   Runs an isolated local-file Chromium context; it never opens a user browser profile. */
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL}=require('node:url');
const {homedir}=require('node:os');
const {chromium}=require(process.env.FORMA_PLAYWRIGHT || path.join(homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const executablePath=process.env.FORMA_CHROMIUM || path.join(homedir(),'Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell');
const project=path.resolve(__dirname,'..');
(async()=>{
 const browser=await chromium.launch({executablePath,headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  await page.goto(pathToFileURL(path.join(project,'dist/index.html')).href+'#command-menu/overview');
  await page.waitForFunction(()=>window.Forma?.reviewStudio && document.querySelector('.pp-command-card'));
  const result=await page.evaluate(()=>{
   const F=window.Forma;F.clearPreviews();F.reviewStudio?.destroy();F.reviewStudio=null;
   document.getElementById('content').innerHTML='';
   const stage=document.createElement('div');stage.className='pp-theme';stage.style.cssText='width:1100px;min-height:500px;position:relative';document.getElementById('content').append(stage);
   const disableMotion=document.createElement('style');disableMotion.textContent='*{animation:none!important;transition:none!important}';document.head.append(disableMotion);
   const failures=[],coverage={},seen=new Set(),tokenCases=[],variantCases=[];let entries=0,properties=0;
   const values=el=>{const s=getComputedStyle(el);return {radius:[s.borderTopLeftRadius,s.borderTopRightRadius,s.borderBottomLeftRadius,s.borderBottomRightRadius].join('|'),padding:[s.paddingTop,s.paddingRight,s.paddingBottom,s.paddingLeft].join('|'),gap:[s.rowGap,s.columnGap,s.display].join('|'),variant:[s.backgroundColor,s.color,s.borderColor].join('|')};};
   const signature=el=>{const names=[];for(let p=el,n=0;p&&p!==stage&&n<5;p=p.parentElement,n++)names.push(p.tagName+'.'+(p.getAttribute('class')||'')+(p.previousElementSibling?'':'[first]')+(p.nextElementSibling?'':'[last]')+(p.hasAttribute('aria-pressed')?'[pressed='+p.getAttribute('aria-pressed')+']':''));return names.join(' / ');};
   for(const item of F.items.filter(x=>x.group!=='Foundations')){
    const specimens=F.variantMatrix(item).entries;for(const entry of specimens){
     entries++;stage.innerHTML=entry.markup;
     F.enhanceSelects?.(stage);
     for(const definition of F.reviewTargets.descriptors){
      if(!definition.selector)continue;
      for(const element of stage.querySelectorAll(definition.selector)){
       const description=F.reviewDescribe(element,stage);if(!description||description.kind!==definition.id)continue;
       const sig=signature(element);
       for(const property of description.properties){
        const key=[description.kind,property.id,sig].join('::');if(seen.has(key))continue;seen.add(key);
        coverage[description.kind]??=new Set();coverage[description.kind].add(property.id);properties++;
        const record={item:item.id,component:entry.itemId,config:entry.config,kind:description.kind,property:property.id,apply:property.apply,signature:sig};
        if(property.type==='token'){
         const old=element.getAttribute('style'),actualKey=property.domain==='radius'?'radius':property.id==='gap'?'gap':'padding';
         const pairs=property.domain==='radius'?['radius.sm','radius.xl']:['space.4','space.24'];
         const available=F.reviewTokenChoices(property).map(x=>x.id);const picked=pairs.filter(x=>available.includes(x));if(picked.length!==2){failures.push({...record,reason:'Audit token pair unavailable'});continue;}
         const valuesAfter=picked.map(token=>{element.style.setProperty(property.apply.name,F.v(token));return values(element)[actualKey];});
         if(old===null)element.removeAttribute('style');else element.setAttribute('style',old);
         tokenCases.push({...record,values:valuesAfter});
         if(valuesAfter[0]===valuesAfter[1])failures.push({...record,values:valuesAfter,reason:'Changing the offered token has no computed CSS effect'});
        } else if(property.type==='enum'&&property.id==='variant'){
         const old=element.getAttribute('style'),oldClass=element.getAttribute('class');
         const states=['primary','destructive'].map(variant=>{for(const [key,id]of Object.entries(F.buttonTokens({...description.config,variant})))if(['bg','fg','border','shadow','hover','active','focus','underlineOffset','underlineWidth'].includes(key))element.style.setProperty('--demo-button-'+key,F.v(id));for(const name of F.reviewTargets.buttonVariants)element.classList.toggle(name,name===variant);return values(element).variant;});
         element.setAttribute('style',old||'');element.setAttribute('class',oldClass||'');variantCases.push({...record,values:states});
         if(states[0]===states[1])failures.push({...record,values:states,reason:'Changing button appearance has no computed CSS effect'});
        }
       }
      }
     }
    }
   }
   // Exercise the real replay engine for every unique Hugeicons asset, not just
   // a copied SVG mutation. Each choice must replace the rendered path and name.
   F.current=F.byId['command-menu'];const config=F.defaults(F.current);stage.innerHTML=F.preview(F.current,config);
   const studio=F.createReviewStudio({store:F.createReviewStore({temporaryChanges:true,storage:null})});const cleanup=studio.register(stage,F.current,config,'Icon browser audit');studio.open();let icons=0;
   for(const icon of F.reviewTargets.icons){
    const glyph=stage.querySelector('.pp-command-search-symbol svg[data-hugeicon]');studio.select(stage,glyph);studio.setValue('icon',icon.id);
    const actual=stage.querySelector('.pp-command-search-symbol svg[data-hugeicon]'),template=document.createElement('template');template.innerHTML=F.icon(icon.id,Number(glyph.getAttribute('width'))||16);
    if(actual?.dataset.hugeicon!==F.icons[icon.id].name||actual.innerHTML!==template.content.firstElementChild.innerHTML)failures.push({kind:'icon',property:'icon',icon:icon.id,reason:'Replay engine did not render the selected icon geometry'});
    icons++;
   }
   cleanup();studio.destroy();
   return {entries,properties,icons,coverage:Object.fromEntries(Object.entries(coverage).map(([k,v])=>[k,[...v]])),failures,tokenCases:tokenCases.length,variantCases:variantCases.length};
  });
  fs.writeFileSync(path.join(project,'checks/review-controls-browser-results.json'),JSON.stringify(result,null,2)+'\n');
  console.log(`${result.entries} rendered All states specimens; ${result.properties} distinct property contexts; ${result.tokenCases} token/CSS edits; ${result.variantCases} appearance edits; ${result.icons} real icon swaps. ${result.failures.length} failures.`);
  if(result.failures.length){console.error(JSON.stringify(result.failures,null,2));process.exitCode=1;}
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
