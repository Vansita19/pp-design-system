/** Spectrum import adapter: shared Hugeicons SVGs, with no copied icon paths. */
import React, {forwardRef, type SVGProps} from 'react';
type IconProps = SVGProps<SVGSVGElement> & {size?:number};
export type LucideIcon = React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;
const icon = (name:string):LucideIcon => forwardRef<SVGSVGElement,IconProps>(function Hugeicon({className='',size=16,...props},ref){
  const F=(window as any).Forma;
  const template=document.createElement('template');
  template.innerHTML=F.icon(name,size);
  const source=template.content.firstElementChild!;
  const attrs:Record<string,string>={};
  for(const attr of Array.from(source.attributes)){
    const key=attr.name==='class'?'className':attr.name.replace(/-(width|linecap|linejoin)$/,(_,word)=>word[0].toUpperCase()+word.slice(1));
    attrs[key]=attr.value;
  }
  // Geometry and stroke come solely from the canonical renderer. The original
  // component may still supply layout classes, an accessible label and refs.
  return React.createElement('svg',{...props,...attrs,className:[attrs.className,className].filter(Boolean).join(' '),ref,dangerouslySetInnerHTML:{__html:source.innerHTML}});
});
export const Bell=icon('bell');
export const Check=icon('check');
export const Info=icon('info');
export const AlertCircle=icon('warning-circle');
export const CircleAlert=AlertCircle;
export const LoaderCircle=icon('arrows-clockwise');
export const Loader2=LoaderCircle;
export const X=icon('close');
