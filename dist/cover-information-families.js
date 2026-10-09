/* Hairline: independent instruments for the Metric card and Timeline families.
   Rounded opaque housings, recessed scales and index fittings carry identity.
   The official shared adapter owns motion, fixed hit anchors and disposal. */
(function(F){
 const R=F.coverRecipes||(F.coverRecipes={});
 const disk=(S,x,y,d,z,h,g=-1)=>S.box(x,y,d,d,z,h,d/2,g);
 const punches=(S,x,y,z,n,g=-1)=>{for(let i=0;i<n;i++)S.dot(x+i*4,y,z,.65,g);};
 const base=(S,x,y,w,d)=>{
  S.box(x,y,w,d,0,6,9);S.rim(x+5,y+5,w-10,d-10,6.2,6);
  for(const [u,v]of [[x+8,y+8],[x+w-8,y+8],[x+8,y+d-8],[x+w-8,y+d-8]])S.dot(u,v,6.4,.7);
 };
 R['metric-card']=S=>{
  // A calibrated instrument console: one dial and two removable measure cassettes.
  base(S,-66,-43,132,89);
  S.box(-57,-34,114,5,6,4,2);
  S.box(2,-25,4,60,6,5,2);
  const meter=S.group([-29,1,26],[0,0,7]);
  S.box(-58,-23,56,57,10,4,6,meter);
  const dial=disk(S,-53,-19,46,15,6,meter);
  S.rim(-48,-14,36,36,21.2,18,meter);
  S.rim(-44,-10,28,28,21.4,14,meter);
  // Radial engraved graduations stay attached to the face of the gauge.
  for(let i=0;i<9;i++){
   const a=(i*30+150)*Math.PI/180;
   S.line([[-30+15*Math.cos(a),4+15*Math.sin(a),21.6],[-30+12*Math.cos(a),4+12*Math.sin(a),21.6]],meter);
  }
  S.box(-31,-6,3,13,21.8,1.5,1.5,meter);
  disk(S,-34,0,8,23.5,2,meter);S.rim(-31.5,2.5,3,3,25.7,1.5,meter);
  S.box(-48,27,35,5,14.2,2,2,meter);punches(S,-42,29.5,16.4,5,meter);
  const cassettes=[];
  for(const [i,y,z]of [[0,-23,20],[1,8,12]]){
   S.rim(13,y+2,39,22,6.4,4);
   const g=S.group([32.5,y+13,z+5],[0,0,i===0?8:6]);
   cassettes.push(S.box(10,y,46,26,z,4,5,g));
   S.rim(15,y+4,36,14,z+4.2,3,g);
   // Two tracks with travelling measuring saddles, not chart glyphs.
   for(const [row,dx]of [[0,i===0?12:5],[1,i===0?4:17]]){
    const yy=y+7+row*6;
    S.box(19,yy,28,2,z+4.4,1.2,1,g);
    S.box(19+dx,yy-1,7,4,z+5.8,2,1.6,g);
   }
   punches(S,18,y+22,z+4.3,i+2,g);
   S.box(42,y+21,10,3,z+4.3,1.5,1.5,g);
  }
  S.box(-54,38,108,3,6,4,1.5);
  S.focus(dial);S.focus(cassettes[0]);S.focus(cassettes[1]);
 };
 R.timeline=S=>{
  // An event-index carriage: a continuous rail, three detents and tabbed log plates.
  base(S,-59,-57,116,119);
  S.box(-47,-48,9,99,6,5,4);
  S.rim(-44,-43,3,89,11.2,1.5);
  for(const y of [-40,-32,-6,2,28,36])S.line([[-45,y,11.4],[-40,y,11.4]]);
  const plates=[];
  for(const [i,p]of [
   {y:-44,z:14,w:63,d:25,x:-22,lift:6},
   {y:-10,z:23,w:70,d:27,x:-25,lift:8},
   {y:27,z:11,w:63,d:23,x:-18,lift:6}
  ].entries()){
   // Seats and fixed connecting arms are painted before the detachable assembly.
   S.box(-42,p.y+9,25,5,7,3,2);
   S.rim(p.x+2,p.y+2,p.w-4,p.d-4,6.4,4);
   const g=S.group([p.x+p.w/2,p.y+p.d/2,p.z+5],[0,1,p.lift]);
   S.box(-43,p.y+8,p.x+44,7,p.z,2.5,3,g);
   disk(S,-49,p.y+5,13,p.z,4,g);S.rim(-45.5,p.y+8.5,6,6,p.z+4.2,3,g);
   S.dot(-42.5,p.y+11.5,p.z+4.4,.7,g);
   plates.push(S.box(p.x,p.y,p.w,p.d,p.z,4,5,g));
   S.rim(p.x+4,p.y+4,p.w-8,p.d-8,p.z+4.2,3,g);
   S.box(p.x+7,p.y+7,10,8,p.z+4.4,1.5,2.5,g);
   punches(S,p.x+10,p.y+11,p.z+6.1,1,g);
   S.line([[p.x+23,p.y+8,p.z+4.4],[p.x+p.w-10,p.y+8,p.z+4.4]],g);
   S.line([[p.x+23,p.y+13,p.z+4.4],[p.x+p.w-18,p.y+13,p.z+4.4]],g);
   punches(S,p.x+23,p.y+p.d-6,p.z+4.4,i+1,g);
   S.box(p.x+p.w-15,p.y+p.d-1,10,3,p.z+3.5,2,1.5,g);
  }
  // A capped rail and index stop make the sequence one physical object.
  S.box(-48,48,11,6,11,3,3);S.rim(-45,50,5,2,14.2,1);
  S.focus(plates[1]);S.focus(plates[0]);S.focus(plates[2]);
 };
})(window.Forma);
