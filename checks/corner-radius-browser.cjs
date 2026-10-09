/* Real Chromium family gate for ordinary CSS corners; isolated local-file profile. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url'),{homedir}=require('node:os');
const {chromium}=require(process.env.FORMA_PLAYWRIGHT||path.join(homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const project=path.resolve(__dirname,'..'),target=process.env.FORMA_REVIEW_HTML||path.join(project,'dist/index.html');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.FORMA_CHROMIUM||path.join(homedir(),'Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell')});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(pathToFileURL(target).href+'#command-menu/overview');await page.waitForFunction(()=>window.Forma?.variantMatrix&&document.querySelector('.pp-command-card'));
  const result=await page.evaluate(async()=>{
   const F=window.Forma,failures=[];let specimens=0,elements=0,roundedElements=0;
   // Chromium serializes the standard round keyword as superellipse(1).
   // Compare against a real native round control rather than assuming its spelling.
   const probe=document.createElement('div');probe.style.setProperty('corner-shape','round','important');document.body.append(probe);const nativeShape=getComputedStyle(probe).getPropertyValue('corner-shape').trim();probe.remove();
   const inspect=(root,scope)=>{
    if(root.querySelector('[data-smooth-corner],.pp-smooth-corner-surface'))failures.push({scope,reason:'Obsolete smoothing surface'});
    for(const el of [root,...root.querySelectorAll('*')].filter(el=>el.namespaceURI==='http://www.w3.org/1999/xhtml')){
     const computed=getComputedStyle(el),shape=computed.getPropertyValue('corner-shape').trim();elements++;
     if(shape&&shape!==nativeShape)failures.push({scope,tag:el.tagName,shape,reason:'Non-native corner shape'});
     if(parseFloat(computed.borderTopLeftRadius)>0)roundedElements++;
    }
   };
   inspect(document.body,'organizer');F.clearPreviews();F.reviewStudio?.destroy();F.reviewStudio=null;
   const stage=document.createElement('div');stage.className='pp-theme';stage.style.cssText='width:1100px;position:relative';document.getElementById('content').replaceChildren(stage);
   for(const item of F.items.filter(item=>item.group!=='Foundations')){stage.innerHTML=F.preview(item,F.defaults(item));inspect(stage,item.id);specimens++;if(specimens%10===0)await new Promise(resolve=>setTimeout(resolve,0));}
   const radiusChecks=[];
   for(const [name,markup,selector,expected]of [
    ['Prompt card',F.promptSuggestions({layout:'single'}),'.pp-prompt-suggestion','16px'],
    ['Soft badge',F.badge({variant:'soft'},'Badge'),'.pp-badge','8px'],
    ['Circular badge',F.badge({indicator:'icon-only'},'Badge'),'.pp-badge','999px']
   ]){
    stage.innerHTML=markup;const node=stage.querySelector(selector),actual=node?getComputedStyle(node).borderTopLeftRadius:null;
    radiusChecks.push({name,expected,actual});if(actual!==expected)failures.push({name,expected,actual,reason:'Existing CSS radius changed'});
   }
   return {specimens,elements,roundedElements,nativeShape,radiusChecks,failures,scope:'One default specimen per non-foundation family; all variation markup is covered separately by corner-radius.cjs'};
  });
  assert.deepEqual(errors,[]);assert.equal(result.failures.length,0,JSON.stringify(result.failures.slice(0,8)));assert.ok(result.roundedElements>0,'Removal must preserve rounded elements');
  fs.writeFileSync(path.join(project,'checks/corner-radius-browser-results.json'),JSON.stringify({passed:true,target:path.relative(project,target),...result,pageErrors:errors},null,2)+'\n');
  console.log(`${result.specimens} specimens and ${result.elements} elements: native CSS corner geometry; ${result.roundedElements} rounded elements retained.`);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
