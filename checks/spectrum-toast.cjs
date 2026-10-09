/* Original registry integrity plus production React island events in happy-dom. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),vendor=path.join(root,'vendor/spectrum-toast');
(async()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(vendor,'source.json'))),registry=JSON.parse(fs.readFileSync(path.join(vendor,'registry.json')));
 for(const file of manifest.files){const bytes=fs.readFileSync(path.join(vendor,file.path));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),file.sha256);assert.equal(bytes.toString(),registry.files.find(item=>item.path===file.path).content);}
 const {default:postcss}=await import(path.join(vendor,'node_modules/postcss/lib/postcss.mjs'));
 const css=postcss.parse(fs.readFileSync(path.join(root,'dist/spectrum-toast-runtime.css'),'utf8'));
 css.walkRules(rule=>{let p=rule.parent,nested=false,keyframe=false;while(p){if(p.type==='rule')nested=true;if(p.type==='atrule'&&p.name.endsWith('keyframes'))keyframe=true;p=p.parent;}if(!nested&&!keyframe)for(const selector of rule.selectors)assert.ok(selector.startsWith('.pp-spectrum-toast-host'),'Unscoped Tailwind selector '+selector);});
 const {Window}=await import(path.join(vendor,'node_modules/happy-dom/lib/index.js'));
 const window=new Window({url:'https://forma.test/'}),document=window.document;
 // happy-dom's incomplete WAAPI rejects normal cancellation; exercise Motion's JS fallback.
 window.Element.prototype.animate=undefined;
 document.body.innerHTML='<style id="project-tokens"></style>';
 const errors=[];window.addEventListener('error',event=>errors.push(event.error));
 window.eval(['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','spinner.js','catalogue.js','previews.js','feedback.js','spectrum-toast-runtime.js'].map(file=>fs.readFileSync(path.join(root,'dist',file),'utf8')).join('\n;\n'));
 const F=window.Forma,intervals=new Map();let serial=0;
 window.setInterval=(fn)=>{const id=++serial;intervals.set(id,fn);return id;};window.clearInterval=id=>intervals.delete(id);
 const tick=async(ms)=>{for(let n=0;n<ms;n+=100){for(const fn of [...intervals.values()])fn();await Promise.resolve();}await settle(30);};
 const settle=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 async function fixture(config){const root=document.createElement('div');root.className='pp-theme';root.innerHTML=F.toastStack(config);document.body.append(root);let dispose;F.wireActionFeedback(root,fn=>dispose=fn);await settle(30);return{root,host:root.querySelector('[data-toast-demo]'),stack:root.querySelector('[data-spectrum-toast-root]'),show:root.querySelector('[data-stack-show]'),dispose(){dispose();root.remove();}};}
 const items=host=>host.querySelectorAll('.pp-spectrum-toast-item'),dismiss=item=>item.querySelector('[aria-label="Dismiss toast"]');
 const assertHugeicons=host=>{const icons=host.querySelectorAll('svg');assert.ok(icons.length);for(const svg of icons){assert.ok(svg.classList.contains('hugeicon'));assert.ok(svg.hasAttribute('data-hugeicon'));assert.equal(svg.getAttribute('viewBox'),'0 0 24 24');const size=Number(svg.getAttribute('width'));assert.equal(Number(svg.getAttribute('stroke-width')),size<=16?1.25:1.5);assert.equal(svg.getAttribute('stroke-linecap'),'round');assert.equal(svg.getAttribute('stroke-linejoin'),'round');for(const shape of svg.querySelectorAll('path,circle,ellipse,line,polyline,polygon,rect'))assert.equal(shape.getAttribute('vector-effect'),'non-scaling-stroke');}};
 const a=await fixture({count:3,label:'Saved'});assertHugeicons(a.host);assert.ok(dismiss(items(a.host)[0]).querySelector('svg.hugeicon[data-hugeicon]'),'Source close is a real canonical Hugeicons SVG');assert.equal(items(a.host).length,3);assert.equal(document.querySelectorAll('body>.pp-spectrum-toast-list').length,0,'Static placement has no portal');
 a.show.click();await settle(800);assert.equal(items(a.host).length,3,'Source maxVisible/limit keeps three after its exit');assert.match(a.stack.textContent,/Saved/);
 a.stack.dispatchEvent(new window.Event('pointerenter'));await tick(7000);assert.equal(items(a.host).length,3);a.stack.dispatchEvent(new window.Event('pointerleave'));
 dismiss(items(a.host)[2]).focus();await tick(7000);assert.equal(items(a.host).length,3);a.show.focus();
 F.paused=true;await tick(7000);assert.equal(items(a.host).length,3);F.paused=false;
 a.root.classList.add('preview-paused');await tick(7000);assert.equal(items(a.host).length,3);a.root.classList.remove('preview-paused');
 await tick(6100);await settle(800);assert.equal(items(a.host).length,2,'New toast lifetime expires through original AnimatePresence');
 const first=dismiss(items(a.host)[0]);first.focus();first.click();assert.notEqual(document.activeElement,first,'Dismiss hands focus to remaining native action');await settle(800);assert.equal(items(a.host).length,1);
 const last=dismiss(items(a.host)[0]);last.focus();last.click();assert.equal(document.activeElement,a.show);await settle(800);assert.equal(items(a.host).length,0);
 a.show.click();await settle(50);a.stack.querySelector('.pp-spectrum-toast-action').click();assert.equal(a.host.querySelector('[data-stack-announcement]').textContent,'Change undone in this preview.');a.dispose();assert.equal(intervals.size,0,'Unmount clears the wrapper timer');assert.equal(a.stack.children.length,0,'Unmount clears original React/Motion tree');a.show.click();assert.equal(intervals.size,0);
 const b=await fixture({count:1,tone:'loading',label:'Changes saved',action:false});assertHugeicons(b.host);b.show.click();await settle(50);assert.match(b.stack.textContent,/Saving changes/);await tick(1900);await settle(800);assert.match(b.stack.textContent,/Changes saved/);assertHugeicons(b.host);assert.equal(b.stack.querySelectorAll('.pp-spectrum-toast-action').length,0);b.dispose();assert.equal(intervals.size,0);
 for(const tone of ['neutral','blue','danger']){const specimen=await fixture({count:1,tone});assertHugeicons(specimen.host);specimen.dispose();}
 assert.deepEqual(errors,[]);window.happyDOM.abort();window.close();
 console.log(JSON.stringify({status:'passed',source:'registry files byte-identical',icons:'all rendered SVGs are Hugeicons Stroke Rounded with canonical size-dependent non-scaling strokes',runtime:'original React island mounting, capacity, pause, expiry, status morph, Undo, focus and cleanup',scope:'happy-dom events; visual spring/swipe appearance not browser-verified'}));
})().catch(error=>{console.error(error);process.exitCode=1;});
