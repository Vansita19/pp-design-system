/* Geometry and lifecycle checks, plus SVG review exports. No browser or third-party runtime. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const root = path.join(__dirname, '../dist');
const escapeXML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));

class Element {
  constructor(tagName) {
    this.tagName = tagName;
    this.attributes = {};
    this.children = [];
    this.parentNode = null;
    this.textContent = '';
    this.listeners = new Map();
    this.style = {setProperty() {}, removeProperty() {}};
    this.classList = {
      contains: name => this.classes().has(name),
      add: (...names) => this.changeClasses(names, true),
      remove: (...names) => this.changeClasses(names, false),
      toggle: (name, force) => {
        const on = force === undefined ? !this.classes().has(name) : force;
        this.changeClasses([name], on);
        return on;
      }
    };
  }
  classes() { return new Set((this.attributes.class || '').split(/\s+/).filter(Boolean)); }
  changeClasses(names, on) {
    const classes = this.classes();
    names.forEach(name => on ? classes.add(name) : classes.delete(name));
    this.attributes.class = [...classes].join(' ');
  }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  removeAttribute(name) { delete this.attributes[name]; }
  append(...nodes) { nodes.forEach(node => this.appendChild(node)); }
  appendChild(node) { node.parentNode = this; this.children.push(node); return node; }
  replaceChildren(...nodes) {
    this.children.forEach(node => { node.parentNode = null; });
    this.children = [];
    this.append(...nodes);
  }
  remove() {
    if (this.parentNode) this.parentNode.children = this.parentNode.children.filter(node => node !== this);
    this.parentNode = null;
  }
  addEventListener(type, handler) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(handler);
  }
  removeEventListener(type, handler) { this.listeners.get(type)?.delete(handler); }
}

function createRuntime() {
  const head = new Element('head'), styles = new Map(), media = new Element('media');
  media.matches = false;
  const document = {
    head,
    documentElement: new Element('html'),
    createElement: name => new Element(name),
    createElementNS: (_, name) => new Element(name),
    getElementById: id => {
      if (!styles.has(id)) styles.set(id, new Element('style'));
      return styles.get(id);
    }
  };
  const clocks = new Set(), pointers = new Set(), cameras = [];
  let now = 1000;
  const context = {
    window: {}, document, console,
    performance: {now: () => now},
    matchMedia: () => media,
    requestAnimationFrame: () => { throw Error('Uncontrolled animation frame requested'); },
    cancelAnimationFrame() {},
    setTimeout, clearTimeout
  };
  context.window.matchMedia = context.matchMedia;
  vm.createContext(context);
  function load(file) { vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, {filename:file}); }
  ['tokens.js', 'catalogue.js', 'hairline-kernel.js'].forEach(load);
  const official = context.HL;
  context.HL = {
    ...official,
    // Record the actual camera returned by the application while preserving official geometry.
    proj(camera) { cameras.push(camera); return official.proj(camera); },
    register(stage, tick) {
      const record = {stage, tick, wakes:0};
      clocks.add(record);
      return {wake() { record.wakes++; }, unregister() { clocks.delete(record); }};
    },
    pointer(stage, handlers) {
      const record = {stage, handlers};
      pointers.add(record);
      return () => pointers.delete(record);
    }
  };
  load('hairline-scenes.js');
  context.window.Forma.coverRecipes = new Proxy(context.window.Forma.coverRecipes, {
    set(target, id, recipe) {
      assert.ok(!Object.hasOwn(target,id), `Duplicate cover registration: ${String(id)}`);
      assert.equal(typeof recipe,'function', `Cover ${String(id)} must be a recipe`);
      target[id] = recipe;
      return true;
    }
  });
  const recipeFiles = fs.readdirSync(root).filter(file => /^cover-.*\.js$/.test(file)).sort();
  recipeFiles.forEach(load);
  return {
    F:context.window.Forma, HL:official, clocks, pointers, cameras, recipeFiles,
    advance(milliseconds) { now += milliseconds; clocks.forEach(clock => clock.tick(milliseconds / 1000, now)); }
  };
}

function checkScene(id, scene) {
  const finite = (value, name) => assert.ok(Number.isFinite(value), `${id}: non-finite ${name}`);
  const vector = (value, name) => {
    assert.equal(value.length, 3, `${id}: ${name} must have three coordinates`);
    value.forEach((n, i) => finite(n, `${name}[${i}]`));
  };
  assert.ok(scene.parts.length, `${id}: empty cover`);
  assert.ok(scene.groups.length, `${id}: no interactive groups`);
  const solids = scene.parts.filter(p => p.kind === 'box').length;
  assert.ok(solids > 0 && solids < 100, `${id}: expected 1–99 solids, got ${solids}`);
  scene.groups.forEach((group, n) => {
    vector(group.anchor, `group ${n} anchor`);
    vector(group.delta, `group ${n} delta`);
    assert.equal(scene.parts.filter(part=>part.focal && part.g===n).length,1,`${id}: group ${n} needs one focal solid`);
  });
  scene.parts.forEach((p, n) => {
    assert.ok(['box','rim','line','dot'].includes(p.kind), `${id}: unsupported part kind`);
    assert.ok(Number.isInteger(p.g) && p.g >= -1 && p.g < scene.groups.length, `${id}: invalid group for part ${n}`);
    if (p.kind === 'line') {
      assert.ok(p.points.length >= 2, `${id}: line needs two points`);
      p.points.forEach((point, i) => vector(point, `line ${n} point ${i}`));
    } else {
      ['x','y','z','r'].forEach(key => finite(p[key], `part ${n} ${key}`));
      assert.ok(p.r >= 0, `${id}: negative radius`);
      if (p.kind === 'dot') assert.ok(p.r > 0, `${id}: empty dot`);
      else {
        for (const key of ['w','d',...(p.kind === 'box' ? ['h'] : [])]) {
          finite(p[key], `part ${n} ${key}`);
          assert.ok(p[key] > 0, `${id}: non-positive ${key}`);
        }
        const inset = Math.min(1.3, p.w * .12, p.d * .12);
        assert.ok(inset > 0 && inset < Math.min(p.w,p.d)/2, `${id}: inverted inner ring`);
        if (p.focal) {
          assert.equal(p.kind, 'box', `${id}: focal highlight requires a solid`);
          assert.ok(Number.isInteger(p.focusOrder) && p.focusOrder >= 0, `${id}: invalid focus order`);
        }
      }
    }
  });
  return solids;
}

function descendants(node) { return [node, ...node.children.flatMap(descendants)]; }
function checkHighlight(svg, scene, group, label) {
  const focal = scene.parts.filter(part=>part.focal);
  const expected = group === undefined
    ? focal.reduce((first,part)=>part.focusOrder < first.focusOrder ? part : first)
    : focal.find(part=>part.g===group);
  assert.ok(expected,`${label}: no expected focal part`);
  const highlighted = descendants(svg).filter(node=>node.classes().has('hi'));
  assert.equal(highlighted.length,1,`${label}: expected exactly one highlighted silhouette`);
  assert.ok(highlighted[0].classes().has('sil'),`${label}: highlight is not a silhouette`);
  const partElement = svg.children[0].children[scene.parts.indexOf(expected)];
  assert.ok(descendants(partElement).includes(highlighted[0]),`${label}: wrong focal silhouette highlighted`);
}
function geometrySignature(svg) {
  return JSON.stringify(descendants(svg).filter(node => ['path','ellipse','circle'].includes(node.tagName)).map(node => ({
    tag:node.tagName,
    ...Object.fromEntries(Object.entries(node.attributes).filter(([name])=>['d','cx','cy','r','rx','ry','transform'].includes(name)))
  })));
}
function renderedBounds(svg, label) {
  const points = [];
  for (const node of descendants(svg)) {
    for (const [key,value] of Object.entries(node.attributes)) {
      assert.doesNotMatch(value, /(?:NaN|Infinity|undefined)/, `${label}: invalid ${key}`);
      assert.ok(!/^on/i.test(key), `${label}: event attribute ${key}`);
    }
    const d = node.getAttribute('d');
    if (d) {
      assert.ok((d.match(/[a-z]/gi) || []).every(command => ['M','L','Z'].includes(command)), `${label}: unsupported path command (expected M/L/Z)`);
      const numbers = d.match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi)?.map(Number) || [];
      assert.equal(numbers.length % 2, 0, `${label}: unpaired path coordinate`);
      for (let n=0;n<numbers.length;n+=2) points.push([numbers[n],numbers[n+1]]);
    }
    if (node.tagName === 'ellipse' || node.tagName === 'circle') {
      const transform = node.getAttribute('transform') || '';
      const translation = /translate\(\s*([-\d.]+)[ ,]+([-\d.]+)\s*\)/.exec(transform);
      const x = Number(node.getAttribute('cx') || 0) + Number(translation?.[1] || 0);
      const y = Number(node.getAttribute('cy') || 0) + Number(translation?.[2] || 0);
      const radius = Math.max(Number(node.getAttribute('rx') || node.getAttribute('r') || 0),Number(node.getAttribute('ry') || node.getAttribute('r') || 0));
      // The enclosing circle also covers any rotation of a ground-plane ellipse.
      points.push([x-radius,y-radius],[x+radius,y+radius]);
    }
  }
  assert.ok(points.length > 0, `${label}: no drawn geometry`);
  points.forEach(point => point.forEach(n => assert.ok(Number.isFinite(n), `${label}: non-finite drawing`)));
  const bounds = {left:Math.min(...points.map(p=>p[0])),top:Math.min(...points.map(p=>p[1])),right:Math.max(...points.map(p=>p[0])),bottom:Math.max(...points.map(p=>p[1]))};
  assert.ok(bounds.left >= .5 && bounds.top >= .5 && bounds.right <= 399.5 && bounds.bottom <= 319.5, `${label}: geometry or stroke clips viewBox: ${JSON.stringify(bounds)}`);
  return bounds;
}

function serializeSVG(svg) {
  function write(node) {
    const attributes = {...node.attributes};
    if (node.tagName === 'svg') Object.assign(attributes,{xmlns:'http://www.w3.org/2000/svg',viewBox:'0 0 400 320',width:'400',height:'320'});
    if (['path','ellipse','circle','line','polygon'].includes(node.tagName)) {
      const classes = node.classes();
      Object.assign(attributes, {'stroke-width':'.9','stroke-linejoin':'round','stroke-linecap':'round','vector-effect':'non-scaling-stroke','fill':'#171717','stroke':'#575757'});
      if (classes.has('sil')) attributes.stroke = '#969696';
      if (classes.has('lo')) attributes.stroke = '#3c3c3c';
      if (classes.has('hi')) attributes.stroke = '#f5f5f5';
      if (classes.has('nf')) attributes.fill = 'none';
      if (classes.has('fo')) attributes.stroke = 'none';
      if (classes.has('dash')) attributes['stroke-dasharray'] = '1 3';
      if (classes.has('dot')) {
        attributes.fill = classes.has('m') ? '#969696' : classes.has('off') ? '#3c3c3c' : '#f5f5f5';
        attributes.stroke = 'none';
      }
    }
    const attrs = Object.entries(attributes).map(([key,value])=>` ${key}="${escapeXML(value)}"`).join('');
    const background = node.tagName === 'svg' ? '<rect width="400" height="320" fill="#171717"/>' : '';
    return `<${node.tagName}${attrs}>${background}${escapeXML(node.textContent)}${node.children.map(write).join('')}</${node.tagName}>`;
  }
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + write(svg) + '\n';
}

function checkFocusOrder(runtime) {
  // The first focused part is intentionally created second; append order must not win.
  const recipe = S => {
    const a=S.group([-20,0,10]), b=S.group([20,0,10]);
    const first=S.box(-28,-8,16,16,0,10,2,a);
    const second=S.box(12,-8,16,16,0,10,2,b);
    S.focus(second);
    S.focus(first);
  };
  const scene=runtime.F.coverScene(recipe), stage=new Element('div'), svg=new Element('svg');
  const handle=runtime.F.coverMount(recipe,{stage,svg,read:{textContent:''}},1);
  checkHighlight(svg,scene,undefined,'focus-call order regression');
  handle.destroy();
  assert.equal(runtime.clocks.size,0,'Focus-order fixture leaked its clock');
  assert.equal(runtime.pointers.size,0,'Focus-order fixture leaked its pointer');
}

function checkAdapterContract() {
  // Run the real adapter against controlled lifecycle callbacks, not a browser event loop.
  const media=new Element('media'), microtasks=[], records=[];
  media.matches=false;
  let reduced=false, clockInitialized=false;
  const stages=['button','input'].map(id=>{
    const stage=new Element('div');
    stage.dataset={cover:id};
    return stage;
  });
  const F={paused:true,coverRecipes:{button(){},input(){}}};
  const HL={
    inject() {},
    setReducedMotion(value) { reduced=value; },
    mk(tag,attributes,parent) {
      const node=new Element(tag);
      Object.entries(attributes).forEach(([name,value])=>node.setAttribute(name,value));
      parent.append(node);
      return node;
    }
  };
  F.coverMount=(_,elements,value)=>{
    if (!clockInitialized) {
      clockInitialized=true;
      // Model the official clock initializing its OS preference on first registration.
      reduced=media.matches;
      media.addEventListener('change',()=>{reduced=media.matches;});
    }
    const record={value,destroyed:0};
    records.push(record);
    return {set(next){record.value=next;},destroy(){record.destroyed++;elements.svg.replaceChildren();}};
  };
  const context=vm.createContext({F,HL,document:{},matchMedia:()=>media,queueMicrotask:callback=>microtasks.push(callback)});
  vm.runInContext(fs.readFileSync(path.join(root,'hairline-adapter.js'),'utf8'),context,{filename:'hairline-adapter.js'});
  F.mountCovers({querySelectorAll:()=>stages});
  const state=(expected,label)=>{
    assert.equal(reduced,expected,`${label}: wrong reduced-motion state`);
    records.forEach(record=>assert.equal(record.value,expected?0:1,`${label}: wrong cover intensity`));
  };
  const changeOS=matches=>{
    media.matches=matches;
    [...media.listeners.get('change')].forEach(callback=>callback({matches}));
    assert.ok(microtasks.length>0,'Adapter must defer its OS change synchronization');
    while(microtasks.length) microtasks.shift()();
  };
  state(true,'Stored pause after first clock initialization');
  changeOS(true);
  state(true,'Stored pause with OS reduced motion');
  changeOS(false);
  state(true,'Stored pause after OS motion is enabled');
  F.paused=false;
  F.syncCoverMotion();
  state(false,'Unpaused with OS motion enabled');
  changeOS(true);
  state(true,'OS reduced motion while unpaused');
  changeOS(false);
  state(false,'OS motion enabled while unpaused');
  F.clearCovers();
  F.clearCovers();
  records.forEach(record=>assert.equal(record.destroyed,1,'Adapter did not destroy each handle exactly once'));
  assert.equal(microtasks.length,0,'Adapter contract left queued work');
  return {status:'passed',states:6,scope:'Real adapter; simulated first clock registration, ordered media events and microtasks'};
}

function run({exportDirectory, allowPartial = false} = {}) {
  const runtime = createRuntime(), {F,HL} = runtime;
  checkFocusOrder(runtime);
  const adapter=checkAdapterContract();
  const visible = Array.from(F.visibleItems()), expected = visible.map(item=>item.id).sort();
  assert.ok(expected.length>0, 'Visible catalogue must not be empty');
  const recipeIds = Object.keys(F.coverRecipes).sort();
  assert.ok(recipeIds.every(id=>F.byId[id]&&!F.byId[id].hidden), 'Cover recipes include hidden or unknown pages');
  if (!allowPartial) assert.ok(expected.every(id=>recipeIds.includes(id)),'Every visible page needs a cover recipe; consolidated family covers may be retained');
  if (exportDirectory) fs.mkdirSync(exportDirectory,{recursive:true});
  const hashes = new Map(), exports = [];
  let poses = 0, maxSolids = 0;
  for (const id of recipeIds) {
    const recipe = F.coverRecipes[id], scene = F.coverScene(recipe);
    const solids = checkScene(id,scene);
    maxSolids = Math.max(maxSolids,solids);
    // Identity is the physical scene, regardless of focal styling, grouping or append order.
    const physical = scene.parts.map(part => JSON.stringify(Object.fromEntries(Object.entries(part).filter(([key])=>!['g','focal','focusOrder','cls'].includes(key))))).sort();
    const hash = crypto.createHash('sha256').update(JSON.stringify(physical)).digest('hex');
    assert.ok(!hashes.has(hash), `${id}: identical geometry to ${hashes.get(hash)}`);
    hashes.set(hash,id);
    const stage = new Element('div'), svg = new Element('svg'), read = new Element('output');
    stage.append(svg);
    svg.setAttribute('viewBox','0 0 400 320');
    const handle = F.coverMount(recipe,{stage,svg,read},1);
    assert.equal(runtime.clocks.size,1,`${id}: should register one clock`);
    assert.equal(runtime.pointers.size,1,`${id}: should register one pointer handler`);
    const pointer = [...runtime.pointers][0].handlers;
    const project = HL.proj(runtime.cameras.at(-1));
    const initialBounds = renderedBounds(svg,`${id} rest`);
    const restingGeometry = geometrySignature(svg);
    assert.equal(read.textContent,'rest');
    checkHighlight(svg,scene,undefined,`${id} resting focus order`);
    poses++;
    if (exportDirectory) fs.writeFileSync(path.join(exportDirectory,`${id}.svg`),serializeSVG(svg));
    handle.set(1.25);
    let maxBounds = initialBounds;
    for (let group=0;group<scene.groups.length;group++) {
      pointer.move(project(...scene.groups[group].anchor));
      // Test intermediate tween geometry as well as the maximum settled pose.
      for (const elapsed of [16,120,400,2000]) {
        runtime.advance(elapsed);
        maxBounds = renderedBounds(svg,`${id} group ${group} +${elapsed}ms`);
        checkHighlight(svg,scene,group,`${id} group ${group} +${elapsed}ms`);
        poses++;
      }
      assert.equal(read.textContent,String(group+1),`${id}: group ${group} is not independently pointer-reachable`);
      assert.notEqual(geometrySignature(svg),restingGeometry,`${id}: group ${group} does not move geometry`);
      if (exportDirectory && group === 0) fs.writeFileSync(path.join(exportDirectory,`${id}-active.svg`),serializeSVG(svg));
    }
    pointer.leave();
    runtime.advance(3000);
    assert.equal(read.textContent,'rest',`${id}: leave did not reset status`);
    renderedBounds(svg,`${id} leave`);
    checkHighlight(svg,scene,undefined,`${id} leave highlight`);
    assert.equal(geometrySignature(svg),restingGeometry,`${id}: leave did not restore resting geometry`);
    // The adapter stops motion with set(0) under reduced motion; check that public contract.
    HL.setReducedMotion(true);
    handle.set(0);
    pointer.move(project(...scene.groups[0].anchor));
    runtime.advance(1);
    assert.equal(geometrySignature(svg),restingGeometry,`${id}: zero intensity moved the figure`);
    assert.equal([...runtime.clocks][0].tick(0,Number.MAX_SAFE_INTEGER),false,`${id}: reduced-motion clock did not settle`);
    HL.setReducedMotion(false);
    handle.destroy();
    handle.destroy();
    assert.equal(svg.children.length,0,`${id}: destroy left SVG children`);
    assert.equal(runtime.clocks.size,0,`${id}: clock leaked`);
    assert.equal(runtime.pointers.size,0,`${id}: pointer handler leaked`);
    assert.equal(descendants(stage).reduce((sum,node)=>sum+[...node.listeners.values()].reduce((n,list)=>n+list.size,0),0),0,`${id}: DOM listener leaked`);
    exports.push({id,name:F.byId[id].name,group:F.byId[id].group,parts:scene.parts.length,solids,interactiveGroups:scene.groups.length,initialBounds,lastMaximumBounds:maxBounds});
  }
  const report = {status:'passed',coverage:recipeIds.length,expected:expected.length,poses,maxSolids,adapter,recipeFiles:runtime.recipeFiles,figures:exports};
  if (exportDirectory) fs.writeFileSync(path.join(exportDirectory,'manifest.json'),JSON.stringify(report,null,2)+'\n');
  return report;
}

module.exports = {Element,createRuntime,checkScene,renderedBounds,serializeSVG,run};
if (require.main === module) {
  const args=process.argv.slice(2), exportIndex=args.indexOf('--export');
  const report=run({exportDirectory:exportIndex<0?undefined:path.resolve(args[exportIndex+1] || '/tmp/forma-hairline-review'),allowPartial:args.includes('--allow-partial')});
  console.log(JSON.stringify({...report,figures:undefined}));
}
