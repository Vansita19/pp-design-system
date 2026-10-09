/* Application adapter: the figure kernel stays unchanged. Covers are decorative inside native card links. */
(() => {
  const handles = new Set(), media = matchMedia('(prefers-reduced-motion: reduce)');
  HL.inject(document);
  F.syncCoverMotion = () => {
    HL.setReducedMotion(Boolean(F.paused || media.matches));
    handles.forEach(handle => handle.set(F.paused || media.matches ? 0 : 1));
  };
  media.addEventListener('change',()=>queueMicrotask(F.syncCoverMotion));
  F.clearCovers = () => { handles.forEach(handle=>handle.destroy()); handles.clear(); };
  F.mountCovers = container => {
    F.syncCoverMotion();
    container.querySelectorAll('[data-cover]').forEach(stage=>{
      const recipe=F.coverRecipes[stage.dataset.cover];
      if(!recipe) throw new Error('Missing Hairline cover: '+stage.dataset.cover);
      stage.setAttribute('data-hairline',stage.dataset.cover);
      const svg=HL.mk('svg',{viewBox:'0 0 400 320','aria-hidden':'true',focusable:'false'},stage);
      const read={textContent:''};
      handles.add(F.coverMount(recipe,{stage,svg,read},F.paused || media.matches ? 0 : 1));
    });
    // The official clock initializes its media preference on its first registration.
    F.syncCoverMotion();
  };
})();
