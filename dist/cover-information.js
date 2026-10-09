/* Hairline: a briefing tray with a raised title rail and three removable
   information plates. Recessed rules, comparison wells, and pull lips carry
   identity without text or icons. Hover lifts one plate and its fittings. */
(() => {
 const F=window.Forma;
 const R=F.coverRecipes||(F.coverRecipes={});
 R['information-block']=S=>{
  S.box(-59,-48,118,99,0,5,8);
  S.rim(-53,-42,106,87,5.2,5);
  // A fixed title bridge and shallow side runners contain the content plates.
  S.box(-50,-39,100,11,6,5,3);
  S.rim(-44,-36,48,5,11.2,2);
  for(let i=0;i<3;i++)S.dot(32+i*5,-33.5,11.3,.8);
  S.box(-52,-24,4,65,5,5,1.8);
  S.box(48,-24,4,65,5,5,1.8);
  const plates=[
   {x:-44,y:-22,w:88,d:19,z:13,lift:7},
   {x:-41,y:1,w:86,d:23,z:23,lift:9},
   {x:-44,y:29,w:88,d:16,z:11,lift:6}
  ];
  const focus=[];
  for(const [i,p]of plates.entries()){
   // The recessed seat is below its plate, so no guide crosses the opaque face.
   S.rim(p.x+2,p.y+1,p.w-4,p.d-2,5.3,3);
   S.box(p.x+5,p.y+4,p.w-10,p.d-8,6,2,2);
   const g=S.group([p.x+p.w/2,p.y+p.d/2,p.z+4],[0,0,p.lift]);
   focus.push(S.box(p.x,p.y,p.w,p.d,p.z,3.5,4,g));
   S.rim(p.x+4,p.y+4,12,p.d-8,p.z+3.7,2,g);
   for(let n=0;n<=i;n++)S.dot(p.x+8+n*2.3,p.y+p.d/2,p.z+3.9,.6,g);
   const x=p.x+22,y=p.y+5,z=p.z+3.8;
   if(i===1){
    // Two inset comparison wells distinguish the taller middle plate.
    for(const [dx,w]of [[0,24],[28,29]]){
     S.rim(x+dx,y,w,12,z,2,g);
     S.line([[x+dx+4,y+4,z+.1],[x+dx+w-4,y+4,z+.1]],g);
     S.line([[x+dx+4,y+8,z+.1],[x+dx+w-9,y+8,z+.1]],g);
    }
   }else{
    S.line([[x,y,z],[x+41,y,z]],g);
    S.line([[x,y+5,z],[x+(i===0?53:31),y+5,z]],g);
   }
   // A small raised pull lip is part of the plate assembly.
   S.box(p.x+p.w-20,p.y+p.d-2,13,3,p.z+3.5,2,1.4,g);
  }
  S.box(-50,46,100,3,5,4,1.4);
  // The raised middle plate is the first resting accent.
  S.focus(focus[1]);S.focus(focus[0]);S.focus(focus[2]);
 };
})();
