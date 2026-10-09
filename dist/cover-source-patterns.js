/* Hairline source-pattern cover: a physical assembly, never a flat icon.
   Drawn with the unchanged official kernel through Forma's shared scene adapter.
   Response: printing platen, binding clamp, receipt tray.
   Three resting hit anchors and one moving focus.
   Geometry has no text, logos, custom paint, timers, or independent animation. */
(function(F){
 const R=F.coverRecipes||(F.coverRecipes={});
 const rule=(S,x,y,w,z,g=-1)=>S.line([[x,y,z],[x+w,y,z]],g);
 const punches=(S,x,y,z,n,g=-1)=>{for(let i=0;i<n;i++)S.dot(x+i*4,y,z,.65,g);};
 const deck=(S,x,y,w,d)=>{
  S.box(x,y,w,d,0,5,8);
  S.rim(x+5,y+5,w-10,d-10,5.2,5);
  for(const [u,v]of [[x+8,y+8],[x+w-8,y+8],[x+8,y+d-8],[x+w-8,y+d-8]])S.dot(u,v,5.35,.65);
 };
 const sheet=(S,x,y,w,d,z,g)=>{
  const page=S.box(x,y,w,d,z,1.8,3.5,g);
  S.rim(x+4,y+4,w-8,d-8,z+2,2,g);
  return page;
 };
 R['ai-response']=S=>{
  // A printing platen: ruled output sheets held by a binding clamp, a receipt emerging below.
  deck(S,-55,-45,110,92);
  S.box(-48,-37,6,74,5,6,2);
  S.box(43,-37,6,74,5,6,2);
  for(const y of [-29,-9,11,31]){
   S.rim(-46,y,2.5,6,11.2,1.2);
   S.rim(44.5,y,2.5,6,11.2,1.2);
  }
  for(const x of [-28,28])S.line([[x,22,5.3],[x,22,16]],-1,'dash');

  const platen=S.group([0,-3,20],[0,0,6]);
  sheet(S,-37,-31,78,66,9,platen);
  sheet(S,-39,-34,78,64,13,platen);
  const output=sheet(S,-40,-37,78,62,17,platen);
  S.box(-30,-27,32,4,19.1,1.4,1.5,platen);
  punches(S,21,-25,19.4,3,platen);
  for(const [y,w]of [[-15,56],[-8,49],[-1,54],[6,38]])rule(S,-30,y,w,19.25,platen);
  S.rim(-30,12,20,6,19.3,2,platen);
  rule(S,-3,15,22,19.3,platen);

  const binding=S.group([-36,-28,30],[-4,-1,8]);
  S.box(-48,-36,24,18,22,3,4,binding);
  const clasp=S.box(-45,-33,18,12,26,4,4,binding);
  S.rim(-41,-30,10,6,30.2,2,binding);
  S.box(-41,-24,10,3,30.4,2,1.5,binding);
  punches(S,-41,-35,25.3,3,binding);

  const receipt=S.group([22,33,31],[3,5,8]);
  S.box(-4,22,51,23,24,3,4,receipt);
  const ticket=sheet(S,-1,24,46,21,28,receipt);
  rule(S,6,31,25,30.2,receipt);
  rule(S,6,36,18,30.2,receipt);
  S.rim(34,30,5,9,30.2,2,receipt);
  S.box(7,42,23,3,30.4,1.5,1.5,receipt);
  S.focus(output);S.focus(clasp);S.focus(ticket);
 };
})(window.Forma);
