/* Forma's figure compositions. Geometry, projection, solids and motion use the unchanged Hairline kernel. */
(() => {
// FIGURE CORE START
function coverScene(recipe) {
  const parts = [], groups = []; let focusOrder=0;
  const add = p => { parts.push(p); return p; };
  const S = {
    group(anchor, delta = [0, 0, 10]) { groups.push({anchor, delta}); return groups.length - 1; },
    box(x,y,w,d,z,h,r=4,g=-1) { return add({kind:'box',x,y,w,d,z,h,r,g}); },
    rim(x,y,w,d,z,r=3,g=-1) { return add({kind:'rim',x,y,w,d,z,r,g}); },
    line(points,g=-1,cls='lo') { return add({kind:'line',points,g,cls}); },
    dot(x,y,z,r=1,g=-1) { return add({kind:'dot',x,y,z,r,g}); },
    focus(p) { p.focal = true; p.focusOrder=focusOrder++; return p; }
  };
  recipe(S);
  return {parts, groups};
}
function coverMount(recipe, {stage, svg, read}, value) {
  const {Cam,fit,proj,facing,rrect,rings,prism,ringAt,poly,open,clamp,
    mk,solid,put,flatDot,place,tween,tset,tval,tdone,register,pointer,disposer} = HL;
  const {parts,groups} = coverScene(recipe), bag = disposer(), bounds = [];
  for (const p of parts) {
    const xyz = p.kind === 'line' ? p.points : p.kind === 'dot' ? [[p.x-p.r,p.y-p.r,p.z],[p.x+p.r,p.y+p.r,p.z]] :
      [0,p.w].flatMap(dx=>[0,p.d].flatMap(dy=>[0,p.h||0].map(dz=>[p.x+dx,p.y+dy,p.z+dz])));
    const delta = groups[p.g]?.delta || [0,0,0];
    xyz.forEach(v => { bounds.push(v, v.map((n,i)=>n+delta[i]*1.25)); });
  }
  const testP = proj(Cam(45,.5,1)), projected = bounds.map(p=>testP(...p));
  const span = axis => Math.max(...projected.map(p=>p[axis]))-Math.min(...projected.map(p=>p[axis]));
  const C = Cam(45,.5,Math.min(2.12,310/span(0),238/span(1)));
  fit(C,bounds,200,162);
  const P = proj(C), front = facing(C), root = mk('g',{},svg);
  const tracks = groups.map(g=>({...g,tw:tween(0),last:NaN,hit:P(...g.anchor)}));
  const resting = parts.filter(p=>p.focal).sort((a,b)=>a.focusOrder-b.focusOrder)[0]?.g ?? -1;
  let active = -1, intensity = clamp(value,0,1.25), lastActive = null;
  for (const p of parts) {
    p.drawn = NaN;
    if (p.kind === 'box' || p.kind === 'rim') {
      const inset = Math.min(1.3, p.w*.12, p.d*.12);
      if (p.r >= Math.min(p.w,p.d)/2) {
        p.ring = rrect(p.x,p.y,p.x+p.w,p.y+p.d,p.r,14);
        p.inner = rrect(p.x+inset,p.y+inset,p.x+p.w-inset,p.y+p.d-inset,Math.max(0,p.r-inset),14);
      } else [p.ring,p.inner] = rings(p.x,p.y,p.x+p.w,p.y+p.d,p.r,inset);
    }
    p.el = p.kind === 'box' ? solid(root) : p.kind === 'dot' ? flatDot(root,C,p.r,'dot m') : mk('path',{class:'nf '+(p.cls||'lo')},root);
  }
  function draw(now) {
    tracks.forEach(t=>{t.last=clamp(tval(t.tw,now),0,1.25);});
    const selected = active < 0 ? resting : active;
    for (const p of parts) {
      const track=tracks[p.g], v=track?.last||0;
      if (v !== p.drawn) {
        p.drawn=v;
        const d=track ? track.delta.map(n=>n*v) : [0,0,0];
        const Q=(x,y,z)=>P(x+d[0],y+d[1],z+d[2]);
        if (p.kind==='box') put(p.el,prism(Q,front,p.ring,p.inner,p.z,p.z+p.h));
        else if (p.kind==='rim') p.el.setAttribute('d',poly(ringAt(Q,p.ring,p.z)));
        else if (p.kind==='line') p.el.setAttribute('d',open(p.points.map(v=>Q(...v))));
        else place(p.el,Q(p.x,p.y,p.z));
      }
      if (p.focal && selected!==lastActive) p.el.sil.classList.toggle('hi',p.g===selected);
    }
    lastActive=selected;
  }
  draw(performance.now());
  const clock=register(stage,(_,now)=>{draw(now);return tracks.some(t=>!tdone(t.tw,now));});
  bag.add(clock.unregister);
  function choose(index) {
    if (index===active) return;
    active=index;
    const now=performance.now();
    tracks.forEach((t,i)=>tset(t.tw,index<0?0:i===index?intensity:intensity*.18,now,index<0?i*30:Math.abs(i-index)*40));
    read.textContent=index<0?'rest':String(index+1);
    clock.wake();
  }
  bag.add(pointer(stage,{
    move(p) {
      let nearest=-1, distance=82;
      tracks.forEach((t,i)=>{const d=Math.hypot(p[0]-t.hit[0],p[1]-t.hit[1]);if(d<distance){distance=d;nearest=i;}});
      choose(nearest);
    },
    leave(){choose(-1);}
  }));
  read.textContent='rest';
  bag.add(()=>svg.replaceChildren());
  return {set(v){intensity=clamp(v,0,1.25);if(active>=0){const before=active;active=-1;choose(before);}},destroy:bag.dispose};
}
// FIGURE CORE END
F.coverRecipes = {};
F.coverScene = coverScene;
F.coverMount = coverMount;
})();
