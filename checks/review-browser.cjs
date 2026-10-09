/* Real user-path verification in an isolated Chromium profile. No source edits or user browser data. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url'),{homedir}=require('node:os');
const {chromium}=require(process.env.FORMA_PLAYWRIGHT||path.join(homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const project=path.resolve(__dirname,'..'),target=process.env.FORMA_REVIEW_HTML||path.join(project,'dist/index.html');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.FORMA_CHROMIUM||path.join(homedir(),'Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell')});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];page.on('pageerror',error=>errors.push(error.message));
  // Capture the actual copy payload; keep clipboard writes inside this isolated context.
  await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.__reviewCopied=value;}}}));
  const go=async route=>{await page.goto(pathToFileURL(target).href+'#'+route);await page.waitForFunction(()=>window.Forma?.reviewStudio&&document.querySelector('[data-review-open="tweak"]'));};
  const q=selector=>page.locator('#review-studio-host '+selector),action=name=>q('[data-review-action="'+name+'"]');
  const change=(id,value)=>q('[data-review-field="'+id+'"]').selectOption(value);
  const open=()=>page.locator('[data-review-open="tweak"]').click();
  const geometry=()=>page.evaluate(()=>{const w=document.querySelector('.workspace').getBoundingClientRect(),d=document.querySelector('.review-studio').getBoundingClientRect();return {workspace:{right:w.right,bottom:w.bottom},drawer:{left:d.left,top:d.top,right:d.right,bottom:d.bottom},width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth};});
  const noOverlap=async()=>{const g=await geometry();assert.ok(g.width>1050?g.workspace.right<=g.drawer.left+.5:g.workspace.bottom<=g.drawer.top+.5,JSON.stringify(g));assert.ok(g.overflow<=g.width+1,JSON.stringify(g));return g;};
  await go('command-menu/all-states');await open();await noOverlap();
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.reviewAction),'pick');
  const glyph=()=>page.locator('.pp-command-search-symbol svg').first();
  await glyph().click();assert.match(await q('.review-selected-label').textContent(),/Search icon.*Search header/);
  const labels=await q('[data-review-target] option').allTextContents();assert.ok(!labels.some(text=>/^Default · Icon$/.test(text)));assert.ok(labels.some(text=>/Chevron right icon.*All components/.test(text)),'Repeated icon labels include their actual destination');
  await q('[data-review-icon-search]').fill('add');await q('[data-review-icon-choice="plus"]').click();
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.reviewIconChoice),'plus','Icon choice retains keyboard focus');assert.equal(await glyph().getAttribute('data-hugeicon'),'Add01Icon');assert.equal(await q('[data-review-icon-search]').inputValue(),'add');
  await q('[data-review-icon-search]').fill('close');await q('[data-review-icon-choice="close"]').click();assert.equal(await glyph().getAttribute('data-hugeicon'),'Cancel01Icon');
  await action('compare').click();assert.equal(await glyph().getAttribute('data-hugeicon'),'Search01Icon');await action('compare').click();assert.equal(await glyph().getAttribute('data-hugeicon'),'Cancel01Icon');
  await action('reset-part').click();assert.equal(await glyph().getAttribute('data-hugeicon'),'Search01Icon');
  const secondGlyph=page.locator('.pp-command-search-symbol svg').nth(1);await secondGlyph.click();await q('[data-review-icon-search]').fill('add');await q('[data-review-icon-choice="plus"]').click();assert.equal(await secondGlyph.getAttribute('data-hugeicon'),'Add01Icon');assert.equal(await glyph().getAttribute('data-hugeicon'),'Search01Icon','A second state does not edit its neighbour');await action('reset-part').click();await glyph().click();
  await q('[data-review-icon-search]').fill('search');await q('[data-review-icon-choice="search"]').click();
  const parent=q('[data-review-action="ancestor"]').filter({hasText:'Command menu panel'}).first();await parent.click();
  const card=()=>page.locator('.pp-command-card').first();const originalCard=await card().evaluate(el=>({radius:getComputedStyle(el).borderTopLeftRadius,padding:getComputedStyle(el).paddingLeft}));await change('radius','radius.4');assert.equal(await card().evaluate(el=>getComputedStyle(el).borderTopLeftRadius),'4px');
  await change('padding','space.12');assert.equal(await card().evaluate(el=>getComputedStyle(el).paddingLeft),'12px');
  await q('[data-review-mode="comments"]').click();await q('[data-review-draft]').fill('Keep the close control aligned with the search row.');await action('add-comment').click();
  assert.equal(await q('.review-comment').count(),1);await action('locate-comment').click();await action('copy').click();
  const copied=await page.evaluate(()=>window.__reviewCopied);assert.match(copied,/Keep the close control/);assert.match(copied,/command-menu\/all-states/);assert.match(copied,/radius.4/);
  await page.screenshot({path:path.join(project,'artifacts/review-editor-comments.png')});
  await action('resolve-comment').click();assert.equal(await q('.review-comment').count(),0);await q('[data-review-comment-filter]').selectOption('resolved');await action('resolve-comment').click();await q('[data-review-comment-filter]').selectOption('open');assert.equal(await q('.review-comment').count(),1);
  await action('close').click();assert.deepEqual(await card().evaluate(el=>({radius:getComputedStyle(el).borderTopLeftRadius,padding:getComputedStyle(el).paddingLeft})),originalCard,'Closing restores source radius and spacing');assert.equal(await page.evaluate(()=>Forma.reviewStudio.store.snapshot().changes.length),0,'Closing clears temporary appearance changes');await page.reload();await page.waitForFunction(()=>window.Forma?.reviewStudio);assert.deepEqual(await card().evaluate(el=>({radius:getComputedStyle(el).borderTopLeftRadius,padding:getComputedStyle(el).paddingLeft})),originalCard,'Reload shows the canonical source appearance');
  await open();await q('[data-review-mode="comments"]').click();assert.equal(await q('.review-comment').count(),1,'Comments survive reload');await action('delete-comment').click();await q('[data-review-mode="tweak"]').click();
  assert.equal(await page.evaluate(()=>Forma.reviewStudio.store.snapshot().changes.length),0,'Reopening starts a fresh appearance preview');await glyph().click();await parent.click();await change('radius','radius.4');
  await q('[data-review-details="more"] summary').click();await action('reset-all').click();assert.equal(await q('[data-review-details="more"]').getAttribute('open'),'');
  await q('[data-review-details="more"] summary').click();await glyph().click();await q('[data-review-icon-search]').fill('');
  // Leave a recognisable changed glyph in the proof image; restore before testing the next page.
  await q('[data-review-icon-search]').fill('add');await q('[data-review-icon-choice="plus"]').click();await q('[data-review-icon-search]').fill('');
  await page.screenshot({path:path.join(project,'artifacts/review-editor-desktop.png')});
  await action('reset-part').click();await page.keyboard.press('Escape');assert.equal(await q('[data-review-panel]').count(),1);assert.equal(await action('pick').getAttribute('aria-pressed'),'false');await page.keyboard.press('Escape');assert.equal(await q('[data-review-panel]').count(),0);
  await go('button/overview');await open();const button=page.locator('.preview-canvas button.pp-button').first();await button.click();await page.mouse.move(0,0);await page.waitForTimeout(250);const original=await button.evaluate(el=>getComputedStyle(el).backgroundColor);await change('variant','destructive');await page.waitForTimeout(250);assert.notEqual(await button.evaluate(el=>getComputedStyle(el).backgroundColor),original);await action('reset-part').click();await page.waitForTimeout(250);assert.equal(await button.evaluate(el=>getComputedStyle(el).backgroundColor),original);
  await change('variant','destructive');await action('close').click();await page.waitForTimeout(250);assert.equal(await button.evaluate(el=>getComputedStyle(el).backgroundColor),original,'Closing restores the original button appearance');await go('command-menu/overview');await open();
  const widths=[];for(const width of [1440,1100,1000,900,768,390]){await page.setViewportSize({width,height:1000});await page.waitForTimeout(60);widths.push(await noOverlap());
   await glyph().click();await q('[data-review-icon-search]').fill('check');await q('[data-review-icon-choice="check"]').click();assert.equal(await glyph().getAttribute('data-hugeicon'),'Tick02Icon','Icon edits work at '+width);await action('reset-part').click();
   if(width===390)await page.screenshot({path:path.join(project,'artifacts/review-editor-compact.png')});
  }
  // A running component replaces its badge nodes. Live drafts must follow the
  // named part while the drawer is open, then return to source on close.
  await page.setViewportSize({width:1440,height:1000});await page.emulateMedia({reducedMotion:'no-preference'});await go('ai-status/overview');await open();
  const badge=()=>page.locator('.preview-canvas .pp-task-status').first();await badge().click();await change('radius','radius.4');assert.equal(await badge().evaluate(el=>getComputedStyle(el).borderRadius),'4px');
  const initialStatus=await badge().textContent();await page.waitForFunction(initial=>document.querySelector('.preview-canvas .pp-task-status')?.textContent!==initial,initialStatus,{timeout:12000});
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.preview-canvas .pp-task-status')).borderRadius==='4px');
  assert.equal(await page.evaluate(()=>Forma.reviewStudio.snapshot().pendingCount),0);await action('close').click();assert.equal(await badge().evaluate(el=>getComputedStyle(el).borderRadius),'999px','Closing restores animated component source styles');await open();assert.equal(await badge().evaluate(el=>getComputedStyle(el).borderRadius),'999px','Reopening does not reactivate an old preview');assert.equal(await page.evaluate(()=>Forma.reviewStudio.store.snapshot().changes.length),0);
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(project,'checks/review-browser-results.json'),JSON.stringify({passed:true,target:path.relative(project,target),viewports:widths,checks:['Docked geometry and no page overflow','Identifiable target labels','Visible icon grid/filter, repeated swaps and separate-state isolation','Radius and padding changes','Original comparison and reset','Button appearance','Comment create/locate/resolve/reopen/delete/copy','Comments persist while appearance resets on close/reopen/reload','Escape stops picking then closes','Real click editing at six viewport widths','Animated component redraw preserves the open preview and restores on close','Icon choice preserves keyboard focus'],pageErrors:errors},null,2)+'\n');
  console.log('Browser user paths passed: live icons/tokens/appearance, compare/reset, comments/copy, reload, Escape and six viewport widths.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
