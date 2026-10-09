/* Browser regression: saved experiments must never replace the actual button design. */
const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url'),{homedir}=require('node:os');
const {chromium}=require(process.env.FORMA_PLAYWRIGHT||path.join(homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const project=path.resolve(__dirname,'..'),target=process.env.FORMA_REVIEW_HTML||path.join(project,'dist/index.html');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.FORMA_CHROMIUM||path.join(homedir(),'Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell')});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const ready=()=>page.waitForFunction(()=>window.Forma?.reviewStudio&&document.querySelector('#live-preview .pp-button'));
  await page.goto(pathToFileURL(target).href+'#button/overview');await ready();
  const button=()=>page.locator('#live-preview .pp-button');
  const radius=()=>button().evaluate(el=>getComputedStyle(el).borderRadius);
  const open=()=>page.locator('[data-review-open="tweak"]').click();
  const close=()=>page.locator('[data-review-action="close"]').click();
  const change=(property,value)=>page.locator('[data-review-field="'+property+'"]').selectOption(value);
  const legacy=await page.evaluate(()=>{
   const F=window.Forma,context=F.reviewContext({componentId:'button',section:'overview',config:F.defaults(F.byId.button)});
   // 20px also looks like a pill on a 36px control and bypassed the 999px-only fix.
   const change={id:'old-pill',context,target:{version:1,kind:'button',index:0},property:'radius',value:'radius.4xl',original:{token:'component.control.radius',resolved:'10px'}};
   const seed=F.createReviewStore({storage:null});seed.putChange(change);seed.addComment({context,text:'Keep my earlier feedback.'});
   const data={...seed.snapshot(),recovery:{id:'button-overview-radius-2026-10-09',changes:[{...change,id:'previous-recovery',value:'radius.full'}]}};
   localStorage.setItem('forma.design-review.v1',JSON.stringify(data));return data;
  });
  await page.reload();await ready();
  assert.equal(await radius(),'10px','Old saved appearance never overrides the normal catalogue');
  await open();await button().click();
  assert.equal(await radius(),'10px','Opening Tweak starts from the original, not the earlier experiment');
  assert.equal(await page.evaluate(()=>Forma.reviewStudio.snapshot().changeCount),0);
  const obsolete=await page.evaluate(()=>{
   const raw=JSON.parse(localStorage.getItem('forma.design-review.v1'));
   raw.changes.push({...raw.changes[0],id:'obsolete-proposal',property:'oldProperty',value:'oldToken'});
   let saved=JSON.stringify(raw);const source=Forma.createReviewStore({temporaryChanges:true,storage:{getItem:()=>saved,setItem:(key,value)=>saved=value}});
   source.addComment({...source.snapshot().comments[0],id:'new-comment',text:'A stale appearance proposal must not erase comments.'});
   return {active:source.snapshot().changes,comments:source.snapshot().comments.length,archive:JSON.parse(saved).changes,recovery:JSON.parse(saved).recovery,warning:source.warning()};
  });
  assert.equal(obsolete.comments,2);assert.deepEqual(obsolete.active,[]);assert.equal(obsolete.warning,'');
  assert.equal(obsolete.archive.at(-1).property,'oldProperty');assert.deepEqual(obsolete.recovery,legacy.recovery);
  assert.equal(await page.locator('[data-review-action="download-earlier"]').count(),1);
  const prior=await page.evaluate(()=>JSON.parse(Forma.reviewStudio.store.exportEarlierJSON()));
  assert.deepEqual(prior.changes,legacy.changes);assert.deepEqual(prior.recovery,legacy.recovery);
  await change('radius','radius.full');assert.equal(await radius(),'999px','A deliberate live preview remains editable');
  await page.locator('[data-review-mode="comments"]').click();
  await page.locator('[data-review-draft]').fill('Keep this new comment, but not my temporary pill.');
  await page.locator('[data-review-action="add-comment"]').click();
  const saved=await page.evaluate(()=>({disk:JSON.parse(localStorage.getItem('forma.design-review.v1')),batch:JSON.parse(Forma.reviewStudio.store.exportJSON())}));
  assert.deepEqual(saved.disk.changes,legacy.changes,'Comment saving does not serialize temporary appearance');
  assert.deepEqual(saved.disk.recovery,legacy.recovery,'Earlier recovery records are preserved');
  assert.equal(saved.disk.comments.length,2);assert.equal(saved.batch.changes[0].value,'radius.full','Current preview is exportable before close');
  await close();assert.equal(await radius(),'10px','Closing restores the original button immediately');
  await open();await button().click();assert.equal(await radius(),'10px');
  assert.equal(await page.evaluate(()=>Forma.reviewStudio.snapshot().changeCount),0);
  await change('radius','radius.sm');assert.equal(await radius(),'6px');
  await page.reload();await ready();assert.equal(await radius(),'10px','Reload drops even an unclosed temporary preview');
  assert.equal(await page.evaluate(()=>Forma.reviewStudio.store.snapshot().comments.length),2);
  assert.equal(await page.evaluate(()=>Forma.reviewStudio.snapshot().changeCount),0);
  await open();await button().click();await change('variant','destructive');
  await page.keyboard.press('Escape');await page.keyboard.press('Escape');
  assert.ok(await button().evaluate(el=>el.classList.contains('primary')),'Escape restores the original button appearance');
  assert.equal(await radius(),'10px');
  await open();await button().click();await change('radius','radius.full');
  const resetImport=await page.evaluate(async()=>{
   const studio=Forma.reviewStudio;
   const input=document.querySelector('[data-review-import]'),source=studio.store.exportJSON();
   let finish;const pending=new Promise(resolve=>finish=resolve);
   Object.defineProperty(input,'files',{value:[{size:source.length,text:()=>pending}]});
   input.dispatchEvent(new Event('change',{bubbles:true}));studio.close();
   finish(source);await new Promise(resolve=>setTimeout(resolve,0));
   return {changes:studio.snapshot().changeCount,importedChanges:JSON.parse(source).changes.length,notice:studio.snapshot().notice,open:studio.snapshot().open};
  });
  assert.equal(resetImport.importedChanges,1);
  assert.equal(resetImport.open,false);assert.equal(resetImport.changes,0);assert.doesNotMatch(resetImport.notice,/merged|opened/i,'A delayed import cannot reopen or repopulate a closed session');
  await page.screenshot({path:path.join(project,'artifacts/button-restored.png')});
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({status:'passed',target,button:{radius:'10px',variant:'primary'},checks:['legacy pill and obsolete proposals never replay','comments and both old archives preserved','comment saving excludes temporary edits','close/reopen/reload/Escape restore original','current session export','late import cancellation'],pageErrors:errors}));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
