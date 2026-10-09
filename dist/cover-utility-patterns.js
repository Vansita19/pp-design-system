/* Hairline utility patterns: a measuring console and an action-ticket dispenser.
   Official rounded solids, recessed fittings and mechanical seams carry identity;
   there are no glyphs, labels, bespoke paint or independent animation loops.
   The unchanged shared adapter supplies fixed rest anchors, distance-staggered
   700ms lifts, exactly one highlight, reduced motion and complete disposal. */
(function(F){
 const R=F.coverRecipes||(F.coverRecipes={});
 const punches=(S,x,y,z,n,g=-1)=>{for(let i=0;i<n;i++)S.dot(x+i*4,y,z,.7,g);};
 const base=(S,x,y,w,d)=>{
  S.box(x,y,w,d,0,6,9);
  S.rim(x+5,y+5,w-10,d-10,6.2,6);
  for(const [u,v]of [[x+8,y+8],[x+w-8,y+8],[x+8,y+d-8],[x+w-8,y+d-8]])S.dot(u,v,6.4,.7);
 };
 R['stats-bar']=S=>{
  // A three-bay measuring console. Dividing ribs, inset scale channels,
  // travelling value saddles and differing rest heights form a complete object.
  base(S,-65,-33,130,70);
  S.box(-55,-25,110,5,6,4,2);
  for(const x of [-23,20])S.box(x,-19,3,42,6,4,1.5);
  const faces=[];
  for(const [i,x,z]of [[0,-58,13],[1,-15,22],[2,28,16]]){
   S.rim(x+2,-17,27,43,6.4,4);
   const g=S.group([x+15.5,4,z+5],[0,0,i===1?8:6]);
   const face=S.box(x,-20,31,47,z,5,5,g);faces.push(face);
   // A dark recessed measuring channel, inset calibrations and a solid saddle.
   S.rim(x+5,-15,21,28,z+5.2,3,g);
   S.box(x+13,-11,5,21,z+5.3,1.5,2,g);
   for(const y of [-10,-4,2,8])S.line([[x+7,y,z+5.4],[x+10,y,z+5.4]],g);
   const saddleY=[1,-8,-3][i];
   S.box(x+8,saddleY,15,6,z+6.8,3,2.5,g);
   S.rim(x+11,saddleY+1.8,9,2.4,z+10,1.2,g);
   // Separate registration plate and punch code, held within each meter housing.
   S.box(x+6,18,19,4,z+5.3,1.5,1.8,g);
   punches(S,x+9,20,z+7,i+1,g);
  }
  // The shared front rail joins the three bays without merging their mechanisms.
  S.box(-55,29,110,4,6,4,2);
  S.rim(-20,30,40,2,10.2,1);
  S.focus(faces[1]);S.focus(faces[0]);S.focus(faces[2]);
 };
 R.suggestion=S=>{
  // A ticket dispenser: two compact choices above one broad follow-up ticket.
  // Recessed feed slots, perforated ends and a raised feed roller distinguish
  // these actionable slips from the removable capsule tags of the Chip cover.
  base(S,-60,-43,120,90);
  S.box(-51,-34,102,7,6,7,3.5);
  S.rim(-46,-32,92,3,13.2,1.5);
  const tickets=[];
  for(const p of [
   {x:-50,y:-19,w:46,d:23,z:15,lift:6,n:2},
   {x:3,y:-19,w:47,d:23,z:22,lift:8,n:3},
   {x:-41,y:17,w:91,d:22,z:12,lift:6,n:4}
  ]){
   // Each opaque feed seat is painted before the ticket it receives.
   S.rim(p.x+1,p.y+2,p.w-2,p.d-4,6.3,5);
   S.box(p.x+5,p.y+5,p.w-10,p.d-10,6.5,2,3);
   const g=S.group([p.x+p.w/2,p.y+p.d/2,p.z+4],[0,2,p.lift]);
   tickets.push(S.box(p.x,p.y,p.w,p.d,p.z,4,7,g));
   S.rim(p.x+4,p.y+4,p.w-8,p.d-8,p.z+4.2,4,g);
   // A physical end fitting and a long inset impression on the ticket face.
   S.box(p.x+7,p.y+7,8,8,p.z+4.3,1.8,3,g);
   S.rim(p.x+9,p.y+9,4,4,p.z+6.3,2,g);
   S.line([[p.x+20,p.y+8,p.z+4.4],[p.x+p.w-9,p.y+8,p.z+4.4]],g);
   punches(S,p.x+20,p.y+14,p.z+4.4,p.n,g);
   S.box(p.x+p.w-16,p.y+p.d-1,9,3,p.z+3.7,1.5,1.5,g);
  }
  S.box(-51,41,102,3,6,4,1.5);
  S.focus(tickets[1]);S.focus(tickets[0]);S.focus(tickets[2]);
 };
})(window.Forma);
