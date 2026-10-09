/* Official Hairline recipes: seven physical instruments with readable rest poses.
   Rounded opaque mechanisms, fittings and grooves; no icons, text or custom paint.
   The existing adapter owns rest-anchor hit tests, one focus, stagger and disposal. */
(function(F){
 const R=F.coverRecipes||(F.coverRecipes={});
 const dots=(S,x,y,z,n,g=-1)=>{for(let i=0;i<n;i++)S.dot(x+i*4,y,z,.7,g);};
 const disk=(S,x,y,d,z,h,g=-1)=>S.box(x,y,d,d,z,h,d/2,g);
 const base=(S,x,y,w,d,h=6)=>{S.box(x,y,w,d,0,h,10);S.rim(x+5,y+5,w-10,d-10,h+.2,6);for(const [u,v]of [[x+8,y+8],[x+w-8,y+8],[x+8,y+d-8],[x+w-8,y+d-8]])S.dot(u,v,h+.4,.7);};
 const leaf=(S,x,y,w,d,z,g)=>{const p=S.box(x,y,w,d,z,1.6,3,g);S.rim(x+4,y+4,w-8,d-8,z+1.8,2,g);return p;};
 const grooves=(S,x,y,w,z,n,g)=>{for(let i=0;i<n;i++)S.line([[x,y+i*6,z],[x+w-(i%3)*5,y+i*6,z]],g);};
 R.conversation=S=>{
  // Telephone exchange: receiver bells, finger dial and a bank of line keys.
  base(S,-62,-45,124,94,9);S.box(-51,-37,102,10,9,4,4);
  for(const x of [-43,-21,1,23])S.rim(x,-34,13,4,13.2,2);
  const receiver=S.group([0,-25,33],[0,0,8]);
  const bridge=S.box(-41,-31,82,14,25,7,7,receiver);
  for(const x of [-52,30]){S.box(x,-37,22,27,21,9,9,receiver);S.rim(x+4,-32,14,17,30.2,6,receiver);for(const y of [-27,-22])dots(S,x+7,y,30.4,3,receiver);}
  const dial=S.group([-25,14,24],[0,0,5]),platter=disk(S,-49,-10,47,12,6,dial);
  S.rim(-44,-5,37,37,18.2,18.5,dial);disk(S,-33,6,15,18.4,3,dial);S.rim(-29,10,7,7,21.6,3.5,dial);
  for(let i=0;i<9;i++){const a=i*Math.PI*2/10;S.dot(-25.5+17*Math.cos(a),13.5+17*Math.sin(a),18.5,1.15,dial);}
  const keys=S.group([30,18,18],[0,0,6]),bank=S.box(8,-4,45,43,10,4,6,keys);
  for(let r=0;r<3;r++)for(let c=0;c<3;c++){const x=14+c*12,y=2+r*11;S.box(x,y,8,7,14.3,2.2,2,keys);S.line([[x+2,y+3,16.7],[x+6,y+3,16.7]],keys);}
  S.rim(17,35,26,2,14.3,1,keys);S.focus(bridge);S.focus(platter);S.focus(bank);
 };
 if(F.isPageVisible?.('evidence-trace'))R['evidence-trace']=S=>{
  // Examination carriage: a specimen slide, concentric lens mount and reference cassette.
  base(S,-67,-38,134,80);for(const y of [-29,25])S.box(-59,y,118,5,6,4,2);
  for(const x of [-53,-37,-21,-5,11,27,43])S.line([[x,-28,10.2],[x,-25,10.2]]);
  const specimen=S.group([-31,0,17],[0,0,5]),slide=S.box(-56,-17,47,36,10,4,5,specimen);
  S.rim(-51,-13,37,28,14.2,4,specimen);S.box(-45,-8,25,18,14.4,1.5,4,specimen);S.rim(-41,-5,17,12,16.1,5,specimen);dots(S,-47,13,14.5,5,specimen);
  S.box(40,-12,8,30,6,12,3);
  const lens=S.group([24,2,30],[0,0,7]);S.box(1,-23,49,50,18,3,6,lens);
  const glass=disk(S,6,-18,40,21,4,lens);S.rim(12,-12,28,28,25.2,14,lens);S.rim(16,-8,20,20,25.4,10,lens);
  for(const [x,y]of [[6,-19],[43,-19],[6,23],[43,23]])S.dot(x,y,21.3,.7,lens);
  const reference=S.group([-6,37,20],[0,3,5]),rack=S.box(-44,29,76,20,13,4,5,reference);
  for(let i=0;i<5;i++){S.rim(-38+i*13,33,9,12,17.2,2,reference);S.box(-36+i*13,36,5,6,17.4,1,2,reference);}
  S.focus(glass);S.focus(slide);S.focus(rack);
 };
 R.navigation=S=>{
  // Indexing turntable: a bearing platter, bridge rail, detent saddle and release lever.
  disk(S,-57,-57,114,0,7);S.rim(-51,-51,102,102,7.2,51);
  for(let i=0;i<16;i++){const a=i*Math.PI/8;S.dot(48*Math.cos(a),48*Math.sin(a),7.4,.75);}
  const table=S.group([0,0,24],[0,0,6]),platter=disk(S,-43,-43,86,10,6,table);
  S.rim(-36,-36,72,72,16.2,36,table);S.box(-35,-7,70,14,16.4,4,6,table);S.rim(-30,-3,60,6,20.6,3,table);disk(S,-9,-9,18,21,4,table);S.rim(-5,-5,10,10,25.2,5,table);
  const stop=S.group([-34,32,18],[0,0,5]),saddle=S.box(-50,22,33,22,11,5,6,stop);
  S.rim(-45,26,23,14,16.2,4,stop);S.box(-42,30,17,6,16.4,2.5,3,stop);dots(S,-39,32.5,19.1,3,stop);
  const release=S.group([34,-28,18],[0,0,7]),lever=S.box(19,-43,30,24,10,5,6,release);
  S.rim(23,-39,22,16,15.2,4,release);S.box(28,-34,12,29,15.4,4,5,release);S.rim(31,-29,6,17,19.6,3,release);
  S.focus(platter);S.focus(saddle);S.focus(lever);
 };
 R['account-flow']=S=>{
  // Access-card reader: an inserted contact card, raised scan head and mechanical latch.
  base(S,-49,-47,98,98,10);S.rim(-31,-39,62,71,10.2,7);S.box(-37,-26,74,6,10,5,3);
  const card=S.group([0,-25,23],[0,-5,4]);leaf(S,-24,-45,48,51,16,card);
  const pass=S.box(-23,-43,46,48,18,1.8,5,card);S.rim(-18,-37,13,16,20,3,card);for(const x of [-15,-11])S.line([[x,-34,20.2],[x,-24,20.2]],card);for(const y of [-31,-27])S.line([[-17,y,20.2],[-6,y,20.2]],card);grooves(S,1,-35,14,20,3,card);dots(S,-15,-7,20,7,card);
  const scan=S.group([0,4,33],[0,0,7]),head=S.box(-39,-10,78,27,25,6,8,scan);
  S.rim(-32,-5,64,15,31.2,5,scan);S.box(-27,-1,54,6,31.4,2,3,scan);for(const x of [-31,31])S.dot(x,4,31.5,.8,scan);
  const latch=S.group([0,35,19],[0,4,5]),lock=S.box(-25,25,50,19,12,5,6,latch);
  S.rim(-19,29,38,11,17.2,4,latch);S.box(-12,32,24,5,17.4,3,2.5,latch);S.rim(-7,33.5,14,2,20.6,1,latch);
  disk(S,30,30,12,10,5);S.rim(33,33,6,6,15.2,3);S.focus(pass);S.focus(head);S.focus(lock);
 };
})(window.Forma);
