/* Pitch Protocol sliders: native keyboard controls and shared pointer geometry.
   Appearance follows the supplied single/range/value-bubble references. */
(() => {
 const F=window.Forma;
 F.addToken('size.slider.width','dimension','320px','extended');
 const aliases={
  width:'size.slider.width',track:'semantic.border.default',fill:'semantic.action.primary',
  'track.height':'space.6',radius:'radius.full','thumb.size':'space.20','thumb.dot':'space.8',
  'thumb.background':'semantic.surface.default','thumb.shadow':'shadow.control',
  'hit.height':'space.32',focus:'shadow.focus',font:'font.size.14',line:'font.line.20',
  foreground:'semantic.text.secondary','label.gap':'space.8',
  'disabled.fill':'semantic.border.strong','disabled.foreground':'semantic.text.disabled',
  'tooltip.background':'semantic.surface.default','tooltip.foreground':'semantic.text.heading',
  'tooltip.border':'semantic.border.default','tooltip.radius':'radius.md','tooltip.shadow':'shadow.card',
  'tooltip.padding.x':'space.8','tooltip.padding.y':'space.4','tooltip.gap':'space.8',
  'tooltip.pointer':'space.8','tooltip.space':'space.40','tooltip.minWidth':'space.32'
 };
 for(const [role,target]of Object.entries(aliases))F.addToken('component.slider.'+role,F.tokens[target].type,`{${target}}`,'normalized');
 const number=(value,fallback)=>Number.isFinite(Number(value))?Math.round(Number(value)):fallback;
 const clamp=(n,min=0,max=100)=>Math.min(max,Math.max(min,n));
 const normalize=c=>{
  let lower=clamp(number(c.lower,25)),upper=clamp(number(c.upper,75));
  if(lower>upper)[lower,upper]=[upper,lower];
  return {variant:c.variant==='range'?'range':'single',value:clamp(number(c.value,40)),lower,upper,
   showLabel:c.showLabel!==false,tooltip:Boolean(c.tooltip),disabled:Boolean(c.disabled),label:String(c.label??'Value').trim()||'Value'};
 };
 F.sliderTokens=(c={})=>{
  const v=normalize(c),ids=['font.family.sans','component.slider.width','component.slider.track','component.slider.track.height','component.slider.radius',
   'component.slider.thumb.size','component.slider.thumb.dot','component.slider.thumb.background','component.slider.thumb.shadow','component.slider.hit.height',
   v.disabled?'component.slider.disabled.fill':'component.slider.fill'];
  if(!v.disabled)ids.push('component.slider.focus');
  if(v.showLabel)ids.push('component.slider.font','component.slider.line','component.slider.label.gap',v.disabled?'component.slider.disabled.foreground':'component.slider.foreground');
  if(v.tooltip)ids.push('border.width','component.slider.font','component.slider.line',...['background','foreground','border','radius','shadow','padding.x','padding.y','gap','pointer','space','minWidth'].map(role=>'component.slider.tooltip.'+role));
  return [...new Set(ids)];
 };
 let serial=0;
 F.slider=(c={})=>{
  const v=normalize(c),id='pp-slider-'+(++serial),range=v.variant==='range',value=range?`${v.lower} – ${v.upper}`:String(v.value);
  const input=(role,current,min,max)=>`<input id="${id}-${role}" class="pp-slider-input" type="range" data-slider-input="${role}" min="${min}" max="${max}" step="1" value="${current}" aria-label="${F.escape(v.label+(range?role==='lower'?' minimum':' maximum':''))}"${v.disabled?' disabled':''}>`;
  const bubbles=v.tooltip?`<div class="pp-slider-bubbles" aria-hidden="true">${range?'<span class="pp-slider-bubble pp-slider-bubble-lower" data-slider-bubble="lower">'+v.lower+'</span><span class="pp-slider-bubble pp-slider-bubble-upper" data-slider-bubble="upper">'+v.upper+'</span><span class="pp-slider-bubble pp-slider-bubble-combined" data-slider-bubble="combined">'+value+'</span>':'<span class="pp-slider-bubble pp-slider-bubble-single" data-slider-bubble="single">'+v.value+'</span>'}</div>`:'';
  return `<div class="pp-slider-control${v.tooltip?' has-tooltip':''}" data-slider data-variant="${v.variant}"${range?` role="group" aria-label="${F.escape(v.label)}"`:''}${v.disabled?' data-disabled="true"':''} style="--slider-lower:${range?v.lower:0};--slider-upper:${range?v.upper:v.value};--slider-value:${v.value}">${v.showLabel?`<div class="pp-slider-heading"><span>${F.escape(v.label)}</span><output data-slider-value aria-hidden="true" for="${id}-${range?'lower '+id+'-upper':'single'}">${value}</output></div>`:''}<div class="pp-slider-stage" data-slider-stage><div class="pp-slider-rail" aria-hidden="true"><span class="pp-slider-fill"></span></div>${bubbles}${range?input('lower',v.lower,0,v.upper)+input('upper',v.upper,v.lower,100):input('single',v.value,0,100)}</div></div>`;
 };
 F.wireSliders=(root,registerCleanup=()=>{})=>{
  const cleanups=[],listen=(el,type,fn)=>{el.addEventListener(type,fn);cleanups.push(()=>el.removeEventListener(type,fn));};
  root.querySelectorAll('[data-slider]').forEach(control=>{
   const stage=control.querySelector('[data-slider-stage]'),inputs=Array.from(control.querySelectorAll('[data-slider-input]'));
   const range=control.dataset.variant==='range',disabled=()=>inputs.every(input=>input.disabled);
   const valueOutput=control.querySelector('[data-slider-value]'),bubbles=Array.from(control.querySelectorAll('[data-slider-bubble]'));
   const thumb=parseFloat(F.resolve('component.slider.thumb.size'));
   let lower=range?clamp(number(inputs[0].value,25)):0,upper=clamp(number(inputs.at(-1).value,range?75:40)),drag=null;
   const bubbleLayout=()=>{
    if(!range||!bubbles.length)return;
    const width=Math.max(0,stage.getBoundingClientRect().width-thumb);
    const minGap=parseFloat(F.resolve('component.slider.tooltip.minWidth'))+parseFloat(F.resolve('component.slider.tooltip.gap'));
    control.dataset.bubblesMerged=String((upper-lower)/100*width<minGap);
   };
   const update=()=>{
    if(range){inputs[0].max=String(upper);inputs[1].min=String(lower);inputs[0].value=String(lower);inputs[1].value=String(upper);}
    else inputs[0].value=String(upper);
    control.style.setProperty('--slider-lower',String(lower));control.style.setProperty('--slider-upper',String(upper));control.style.setProperty('--slider-value',String(upper));
    const text=range?`${lower} – ${upper}`:String(upper);if(valueOutput)valueOutput.textContent=text;
    bubbles.forEach(bubble=>bubble.textContent=bubble.dataset.sliderBubble==='lower'?String(lower):bubble.dataset.sliderBubble==='combined'?text:String(upper));
    bubbleLayout();
   };
   const inputEvent=input=>{
    if(input.disabled)return;
    if(range&&input===inputs[0])lower=clamp(number(input.value,lower),0,upper);
    else upper=clamp(number(input.value,upper),range?lower:0,100);
    update();
   };
   inputs.forEach(input=>listen(input,'input',()=>inputEvent(input)));
   const emit=(input,type)=>input.dispatchEvent(new Event(type,{bubbles:true}));
   const position=event=>{
    const rect=stage.getBoundingClientRect(),width=Math.max(1,rect.width-thumb);
    const rtl=typeof getComputedStyle==='function'&&getComputedStyle(stage).direction==='rtl';
    const start=rect.left+thumb/2,x=clamp((event.clientX-start)/width,0,1);
    return {value:(rtl?1-x:x)*100,width,rtl};
   };
   const move=event=>{
    if(!drag||event.pointerId!==drag.pointerId||disabled())return;
    const p=position(event),value=clamp(Math.round(p.value-drag.offset));
    const next=drag.input===inputs[0]&&range?clamp(value,0,upper):clamp(value,range?lower:0,100);
    if(next!==Number(drag.input.value)){drag.input.value=String(next);inputEvent(drag.input);emit(drag.input,'input');}
   };
   listen(stage,'pointerdown',event=>{
    if(disabled()||event.isPrimary===false||event.button!==0||drag)return;
    const p=position(event);
    const input=!range?inputs[0]:Math.abs(p.value-lower)<Math.abs(p.value-upper)?inputs[0]:Math.abs(p.value-lower)>Math.abs(p.value-upper)?inputs[1]:p.value<=lower?inputs[0]:inputs[1];
    if(input.disabled)return;
    event.preventDefault();input.focus({preventScroll:true});
    const current=Number(input.value),nearThumb=Math.abs(p.value-current)/100*p.width<=thumb/2;
    drag={input,pointerId:event.pointerId,start:Number(input.value),offset:nearThumb?p.value-current:0};
    stage.setPointerCapture?.(event.pointerId);control.dataset.dragging='true';move(event);
   });
   listen(stage,'pointermove',move);
   const finish=event=>{
    if(!drag||event.pointerId!==drag.pointerId)return;
    const last=drag;drag=null;delete control.dataset.dragging;
    if(stage.hasPointerCapture?.(event.pointerId))stage.releasePointerCapture(event.pointerId);
    if(Number(last.input.value)!==last.start)emit(last.input,'change');
   };
   listen(stage,'pointerup',finish);listen(stage,'pointercancel',finish);listen(stage,'lostpointercapture',finish);
   if(typeof ResizeObserver==='function'){const observer=new ResizeObserver(bubbleLayout);observer.observe(stage);cleanups.push(()=>observer.disconnect());}
   cleanups.push(()=>{if(drag&&stage.hasPointerCapture?.(drag.pointerId))stage.releasePointerCapture(drag.pointerId);drag=null;delete control.dataset.dragging;});
   update();
  });
  const cleanup=()=>cleanups.forEach(fn=>fn());registerCleanup(cleanup);return cleanup;
 };
 document.getElementById('project-tokens').textContent=F.tokenCSS();
})();
