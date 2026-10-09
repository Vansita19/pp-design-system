/* Hairline: a selector tray with detachable capsule tags and recessed release
   caps. The middle tag is lifted at rest; pointer choice raises each assembly.
   Uses the unchanged Hairline engine and its existing shared cover adapter. */
(() => {
 const R=F.coverRecipes||(F.coverRecipes={});
 R.chip=S=>{
  const far=S.group([-7,-20,34],[-3,-2,7]);
  const selected=S.group([11,4,29],[3,0,10]);
  const near=S.group([-10,28,21],[-1,4,6]);
  S.box(-57,-41,114,85,0,6,10);
  S.rim(-51,-35,102,73,6.2,7);
  S.box(-49,-32,8,67,6,3,4);
  for(const y of [-22,2,26]){
   S.rim(-47,-26+(y+22),4,8,9.2,2);
   S.line([[-36,y,6.3],[45,y,6.3]],-1,'lo');
  }
  const tags=[];
  for(const [x,y,w,z,g,n]of [[-44,-29,74,29,far,2],[-31,-6,85,23,selected,3],[-45,18,70,16,near,1]]){
   S.box(x+5,y+5,w-10,9,7,3,4.5);
   const tag=S.box(x,y,w,20,z,5,10,g);tags.push(tag);
   S.rim(x+4,y+4,w-8,12,z+5.2,6,g);
   S.line([[x+12,y+8,z+5.4],[x+w-25,y+8,z+5.4]],g);
   for(let i=0;i<n;i++)S.dot(x+12+i*4,y+13,z+5.4,.7,g);
   S.box(x+w-20,y+4,12,12,z+5.3,2.5,6,g);
   S.rim(x+w-17,y+7,6,6,z+8,3,g);
  }
  S.box(-48,38,96,4,6,3,2);
  S.focus(tags[1]);S.focus(tags[0]);S.focus(tags[2]);
 };
})();
