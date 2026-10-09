/* Motion-only adaptation of Spectrum UI's documented stretchy switch.
   Native checkbox state, focus, form behavior, dimensions, and colors stay intact. */
(() => {
 const F=window.Forma;
 F.addToken('motion.easing.switchSpring','cubicBezier','cubic-bezier(.22, 1.12, .36, 1)','extended');
 const aliases={
  'motion.press.duration':'motion.duration.fast',
  'motion.release.duration':'motion.duration.slow',
  'motion.press.easing':'motion.easing.standard',
  'motion.release.easing':'motion.easing.switchSpring',
  'motion.stretch.sm':'space.2',
  'motion.stretch.md':'space.4',
  'motion.stretch.lg':'space.4'
 };
 for(const [role,target]of Object.entries(aliases))F.addToken('component.switch.'+role,F.tokens[target].type,`{${target}}`,'normalized');
 const baseTokens=F.switchTokens;
 F.switchTokens=(c={})=>{
  const size=['sm','lg'].includes(c.size)?c.size:'md';
  return [...baseTokens({...c,size}).filter(id=>id!=='motion.easing.standard'),
   ...['press.duration','release.duration','press.easing','release.easing','stretch.'+size].map(role=>'component.switch.motion.'+role)];
 };
 /* Space key press feedback only. The browser owns toggling and change events.
    Pointer feedback uses :active, so releasing outside the control cannot stick. */
 F.wireSwitchMotion=(root,registerCleanup=()=>{})=>{
  const cleanups=[];
  root.querySelectorAll('.pp-switch').forEach(control=>{
   const release=()=>{delete control.dataset.switchPressed;};
   const press=event=>{
    if(event.key===' '&&!control.disabled)control.dataset.switchPressed='true';
    else if(event.key==='Escape')release();
   };
   const keyup=event=>{if(event.key===' ')release();};
   for(const [event,handler]of [['keydown',press],['keyup',keyup],['blur',release]]){
    control.addEventListener(event,handler);
    cleanups.push(()=>control.removeEventListener(event,handler));
   }
   cleanups.push(release);
  });
  const cleanup=()=>cleanups.forEach(fn=>fn());
  registerCleanup(cleanup);
  return cleanup;
 };
 const style=document.getElementById('project-tokens');
 if(style)style.textContent=F.tokenCSS();
})();
