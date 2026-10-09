import React, {useEffect, useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {AnimatedToastStack, useAnimatedToastStack, type ToastStatus} from './components/motion/animated-toast-stack';
const F = (window as any).Forma;
const toneStatus: Record<string, ToastStatus> = {neutral:'neutral',blue:'info',success:'success',danger:'error',loading:'loading'};
function ToastIsland({host}: {host: HTMLElement}) {
  const status = toneStatus[host.dataset.tone || 'success'] || 'success';
  const label = host.dataset.label || 'Changes saved';
  const count = Math.min(3,Math.max(1,Number(host.dataset.count)||3));
  const action = host.dataset.action === 'true';
  const announce = (text:string) => {const node=host.querySelector('[data-stack-announcement]');if(node)node.textContent=text;};
  // The original hook owns state. Forma schedules lifetimes to preserve pause.
  const api = useAnimatedToastStack({defaultDuration:0,limit:3,initialToasts:Array.from({length:count},(_,index)=>({id:`initial-${index}`,title:index===count-1?label:['All changes synced','Workspace updated'][index]||label,status,duration:0}))});
  const apiRef = useRef(api);apiRef.current=api;
  const lifetimes = useRef(new Map<string,{remaining:number,morph:number|null}>());
  const dismiss = (id:string,undo=false) => {
    const liveIds=new Set(apiRef.current.toasts.map(toast=>toast.id));
    if(!liveIds.has(id))return;
    const markers=Array.from(host.querySelectorAll<HTMLElement>('[data-spectrum-toast-id]'));
    const item=markers.find(node=>node.dataset.spectrumToastId===id)?.closest('li');
    if(item?.contains(host.ownerDocument.activeElement)) {
      const next=markers.find(node=>node.dataset.spectrumToastId!==id&&liveIds.has(node.dataset.spectrumToastId!))?.closest('li');
      ((next?.querySelector('button[aria-label="Dismiss toast"]') || host.querySelector('[data-stack-show]')) as HTMLElement)?.focus();
    }
    lifetimes.current.delete(id);apiRef.current.dismissToast(id);
    announce(undo?'Change undone in this preview.':'Notification dismissed.');
  };
  const dismissRef=useRef(dismiss);dismissRef.current=dismiss;
  const decorate=(toast:any)=>({...toast,title:<span data-spectrum-toast-id={toast.id}>{toast.title}</span>,action:action?{label:'Undo',onClick:()=>dismissRef.current(toast.id,true)}:undefined});
  useEffect(()=>{
    let hovering=false;
    const stack=host.querySelector('[data-spectrum-toast-root]')!,show=host.querySelector('[data-stack-show]')!;
    const doc=host.ownerDocument,win=doc.defaultView!;
    const enter=()=>{hovering=true;},leave=()=>{hovering=false;};
    const add=()=>{
      const id=apiRef.current.showToast({status,title:status==='loading'?'Saving changes…':label,duration:0});
      lifetimes.current.set(id,{remaining:6000,morph:status==='loading'?1800:null});
      announce(status==='loading'?'Saving changes…':label);
    };
    const timer=win.setInterval(()=>{
      if(hovering||stack.contains(doc.activeElement)||doc.hidden||F.paused||host.closest('.preview-paused'))return;
      const ids=new Set(apiRef.current.toasts.map(toast=>toast.id));
      for(const [id,lifetime] of lifetimes.current){
        if(!ids.has(id)){lifetimes.current.delete(id);continue;}
        if(lifetime.morph!==null){
          lifetime.morph-=100;
          if(lifetime.morph<=0){apiRef.current.updateToast(id,{status:'success',title:label});lifetime.morph=null;announce(label);}
        }else{lifetime.remaining-=100;if(lifetime.remaining<=0)dismissRef.current(id);}
      }
    },100);
    show.addEventListener('click',add);stack.addEventListener('pointerenter',enter);stack.addEventListener('pointerleave',leave);
    return()=>{win.clearInterval(timer);lifetimes.current.clear();show.removeEventListener('click',add);stack.removeEventListener('pointerenter',enter);stack.removeEventListener('pointerleave',leave);};
  },[host,status,label]);
  const glyph=(name:string)=><span aria-hidden="true" className="pp-spectrum-toast-glyph" dangerouslySetInnerHTML={{__html:F.icon(name,14)}}/>;
  return <AnimatedToastStack toasts={api.toasts.map(decorate)} onDismiss={id=>dismiss(id)} maxVisible={3} placement="static" position="bottom-center" icons={{neutral:glyph('info'),info:glyph('info'),loading:glyph('arrows-clockwise'),success:glyph('check'),error:glyph('warning-circle')}} classNames={{root:'pp-spectrum-toast-list',item:'pp-spectrum-toast-item',surface:'pp-spectrum-toast-surface',iconWrap:'pp-spectrum-toast-icon',title:'pp-spectrum-toast-title',description:'pp-spectrum-toast-description',action:'pp-spectrum-toast-action',close:'pp-spectrum-toast-close'}}/>;
}
F.mountSpectrumToast=(host:HTMLElement)=>{
  const root=createRoot(host.querySelector('[data-spectrum-toast-root]')!);
  flushSync(()=>root.render(<ToastIsland host={host}/>));
  let disposed=false;
  return()=>{if(disposed)return;disposed=true;root.unmount();};
};
