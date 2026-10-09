/* Atom covers: rounded mechanical assemblies, painted from their bases forward. */
(()=>{
 const R=F.coverRecipes||(F.coverRecipes={});

 R.button=S=>{
  const cap=S.group([0,0,39],[0,0,10]),stem=S.group([0,0,20],[0,0,5]),socket=S.group([0,0,7],[0,0,2]);
  const foot=S.box(-48,-28,96,56,0,7,9,socket);
  S.rim(-40,-21,80,42,7.2,7,socket);
  for(const [x,y] of [[-40,-20],[40,-20],[-40,20],[40,20]])S.dot(x,y,7.4,1,socket);
  S.box(-31,-16,62,32,7,5,6,socket);
  S.rim(-24,-11,48,22,12.2,4,socket);
  const piston=S.box(-12,-9,24,18,16,12,4,stem);
  S.rim(-8,-5,16,10,28.2,2,stem);
  const key=S.box(-39,-22,78,44,34,8,8,cap);
  S.rim(-30,-14,60,28,42.2,5,cap);
  S.line([[-19,0,42.4],[19,0,42.4]],cap);
  S.focus(key);S.focus(piston);S.focus(foot);
 };

 R['icon-button']=S=>{
  const cap=S.group([0,0,32],[0,0,4]),bezel=S.group([0,0,9],[0,0,3]),pin=S.group([0,0,45],[0,0,5]);
  const base=S.box(-36,-36,72,72,0,8,18,bezel);
  for(const [x,y] of [[-26,-26],[26,-26],[-26,26],[26,26]])S.dot(x,y,8.3,1,bezel);
  S.box(-29,-29,58,58,8,5,29,bezel);
  S.rim(-23,-23,46,46,13.2,23,bezel);
  S.box(-13,-13,26,26,17,7,13,cap);
  const face=S.box(-26,-26,52,52,27,7,26,cap);
  S.rim(-20,-20,40,40,34.2,20,cap);
  for(const [x,y] of [[0,-16],[-16,0],[16,0],[0,16]])S.dot(x,y,34.4,.9,cap);
  const centre=S.box(-7,-7,14,14,39,5,7,pin);
  S.rim(-3.5,-3.5,7,7,44.2,3.5,pin);
  S.focus(face);S.focus(base);S.focus(centre);
 };

 R.input=S=>{
  const insert=S.group([-8,0,17],[9,0,6]),cursor=S.group([28,0,29],[0,0,9]),frame=S.group([0,0,7],[0,0,2]);
  const base=S.box(-60,-24,120,48,0,6,8,frame);
  S.rim(-53,-17,106,34,6.2,5,frame);
  S.box(-55,-20,110,6,6,6,3,frame);
  S.box(-55,-14,7,30,6,6,3,frame);
  const strip=S.box(-43,-10,85,23,11,5,4,insert);
  S.line([[-32,-3,16.3],[15,-3,16.3]],insert);
  S.line([[-32,4,16.3],[2,4,16.3]],insert);
  S.dot(-36,-3,16.3,.7,insert);
  S.box(48,-14,7,30,6,6,3,frame);
  S.box(-48,16,96,5,6,5,2.5,frame);
  const stop=S.box(27,-11,6,25,23,7,2,cursor);
  S.rim(28.5,-7,3,17,30.2,1,cursor);
  S.focus(strip);S.focus(stop);S.focus(base);
 };

 R.textarea=S=>{
  const sheet=S.group([1,2,26],[0,0,4]),lower=S.group([-5,-3,14],[-3,-3,4]),clip=S.group([-37,-20,36],[0,0,7]);
  S.box(-52,-40,104,80,0,6,8);
  S.rim(-45,-33,90,66,6.2,6);
  S.box(-48,-36,96,5,6,5,2.5);
  const pageBack=S.box(-41,-28,79,57,10,3,4,lower);
  S.line([[-32,-17,13.2],[25,-17,13.2]],lower);
  const page=S.box(-34,-24,80,58,21,3,4,sheet);
  for(const [y,end] of [[-13,34],[-3,34],[7,34],[17,20]])S.line([[-23,y,24.3],[end,y,24.3]],sheet);
  S.line([[32,25,24.3],[39,25,24.3],[39,18,24.3]],sheet);
  const clasp=S.box(-43,-28,13,20,30,5,3,clip);
  S.rim(-39,-23,5,10,35.2,2,clip);
  S.box(-48,34,96,5,6,5,2.5);
  S.focus(page);S.focus(pageBack);S.focus(clasp);
 };

 R.checkbox=S=>{
  S.box(-44,-38,88,76,0,6,8);
  S.rim(-39,-33,78,66,6.2,5);
  const keys=[];
  for(const [x,y,z] of [[-31,-27,17],[-31,9,12],[7,-27,11],[7,9,25]]){
   const g=S.group([x+12,y+11,z+6],[0,0,9]);
   S.box(x-3,y-3,30,28,6,3,5);
   S.rim(x,y,24,22,9.2,4);
   S.box(x+7,y+6,10,10,z-5,5,2,g);
   const key=S.box(x,y,24,22,z,6,4,g);
   S.rim(x+5,y+5,14,12,z+6.2,2,g);
   S.dot(x+12,y+11,z+6.3,1,g);
   keys.push(key);
  }
  S.focus(keys[3]);keys.slice(0,3).forEach(p=>S.focus(p));
 };

 R.radio=S=>{
  S.box(-60,-24,120,48,0,7,16);
  S.rim(-53,-17,106,34,7.2,13);
  const buttons=[];
  for(const [x,z] of [[-38,14],[0,26],[38,17]]){
   const g=S.group([x,0,z+5],[0,0,9]);
   S.box(x-16,-16,32,32,7,3,16);
   S.rim(x-11,-11,22,22,10.3,11);
   S.box(x-6,-6,12,12,z-5,5,6,g);
   const button=S.box(x-12,-12,24,24,z,5,12,g);
   S.rim(x-8,-8,16,16,z+5.2,8,g);
   S.box(x-3,-3,6,6,z+5,2,3,g);
   buttons.push(button);
  }
  S.focus(buttons[1]);S.focus(buttons[0]);S.focus(buttons[2]);
 };

 R.switch=S=>{
  const puck=S.group([23,0,23],[-25,0,4]),contact=S.group([-34,0,11],[6,0,4]),shell=S.group([0,0,7],[0,0,2]);
  const body=S.box(-58,-26,116,52,0,8,26,shell);
  S.rim(-51,-19,102,38,8.2,19,shell);
  S.rim(-44,-13,88,26,8.3,13,shell);
  S.line([[-30,-7,8.4],[35,-7,8.4]],shell);
  S.line([[-30,7,8.4],[35,7,8.4]],shell);
  const pad=S.box(-43,-9,19,18,10,3,9,contact);
  S.dot(-33.5,0,13.3,1.3,contact);
  S.box(6,-17,34,34,11,5,17,puck);
  const head=S.box(2,-21,42,42,19,7,21,puck);
  S.rim(8,-15,30,30,26.2,15,puck);
  for(const x of [18,23,28])S.line([[x,-6,26.3],[x,6,26.3]],puck);
  S.focus(head);S.focus(pad);S.focus(body);
 };

 R.tag=S=>{const label=S.group([0,0,8],[0,0,6]),mark=S.group([-30,-2,11],[-2,0,5]);S.box(-49,-20,98,40,0,3,7);const plate=S.box(-45,-16,90,32,5,5,6,label),symbol=S.box(-37,-9,14,14,10,2,4,mark);S.line([[-14,-2,10.1],[31,-2,10.1]],label);S.line([[-14,5,10.1],[19,5,10.1]],label);S.focus(plate);S.focus(symbol);};
 R.badge=S=>{
  const plate=S.group([5,0,26],[0,0,4]),signal=S.group([-30,0,34],[0,0,6]),mount=S.group([0,0,7],[0,0,3]);
  const bracket=S.box(-42,-18,84,36,0,6,8,mount);
  S.rim(-34,-11,68,22,6.2,5,mount);
  S.box(-29,-7,9,14,6,8,3,mount);
  S.box(23,-7,9,14,6,8,3,mount);
  const face=S.box(-45,-16,96,32,20,5,16,plate);
  S.rim(-38,-10,82,20,25.2,10,plate);
  S.line([[-11,-4,25.3],[34,-4,25.3]],plate);
  S.line([[-11,3,25.3],[19,3,25.3]],plate);
  S.dot(39,0,25.3,.8,plate);
  const bead=S.box(-37,-7,14,14,29,5,7,signal);
  S.rim(-33,-3,6,6,34.2,3,signal);
  S.focus(face);S.focus(bead);S.focus(bracket);
 };

 R.avatar=S=>{
  const portrait=S.group([0,0,22],[0,0,8]),medal=S.group([0,0,8],[0,0,2]),status=S.group([28,24,19],[0,0,9]);
  const disc=S.box(-36,-36,72,72,0,7,36,medal);
  S.rim(-30,-30,60,60,7.3,30,medal);
  S.box(-25,-25,50,50,10,3,25,portrait);
  S.rim(-21,-21,42,42,13.2,21,portrait);
  const head=S.box(-8,-18,16,16,17,7,8,portrait);
  const shoulders=S.box(-16,3,32,16,15,7,8,portrait);
  S.rim(-10,7,20,8,22.2,4,portrait);
  S.box(19,15,21,21,8,3,10.5,status);
  const bead=S.box(23,19,13,13,16,5,6.5,status);
  S.dot(29.5,25.5,21.3,1,status);
  S.focus(head);S.focus(disc);S.focus(bead);
 };

 R.link=S=>{
  const back=S.group([-24,-13,15],[-8,-4,2]),joint=S.group([0,0,27],[0,0,8]),front=S.group([24,16,11],[8,4,4]);
  S.box(-54,-30,58,7,5,8,3.5,back);
  S.box(-54,-23,7,26,5,8,3.5,back);
  const left=S.box(-54,3,58,7,5,8,3.5,back);
  S.line([[-43,6.5,13.3],[-16,6.5,13.3]],back);
  S.box(-3,-23,7,26,5,8,3.5,back);
  S.box(-5,-8,58,7,15,8,3.5,front);
  S.box(-5,-1,7,26,15,8,3.5,front);
  const right=S.box(-5,25,58,7,15,8,3.5,front);
  S.line([[9,28.5,23.3],[36,28.5,23.3]],front);
  S.box(46,-1,7,26,15,8,3.5,front);
  const pin=S.box(-7,-7,14,14,29,6,7,joint);
  S.rim(-3.5,-3.5,7,7,35.2,3.5,joint);
  S.focus(right);S.focus(left);S.focus(pin);
 };

 R.divider=S=>{
  const left=S.group([-28,0,10],[-7,0,4]),rib=S.group([0,0,24],[0,0,9]),right=S.group([28,0,15],[7,0,4]);
  S.box(-55,-37,110,74,0,5,7);
  S.rim(-48,-30,96,60,5.2,4);
  const far=S.box(-48,-29,42,58,8,5,5,left);
  S.rim(-41,-22,28,44,13.2,3,left);
  for(const y of [-14,0,14])S.line([[-35,y,13.3],[-19,y,13.3]],left);
  const partition=S.box(-2.5,-34,5,68,9,21,2.5,rib);
  S.line([[0,-25,30.3],[0,25,30.3]],rib);
  const near=S.box(7,-29,42,58,13,5,5,right);
  S.rim(14,-22,28,44,18.2,3,right);
  for(const y of [-14,0,14])S.line([[20,y,18.3],[36,y,18.3]],right);
  S.focus(partition);S.focus(far);S.focus(near);
 };

 R.spinner=S=>{
  S.box(-38,-38,76,76,0,5,38);
  S.rim(-31,-31,62,62,5.2,31);
  const blades=[];let bearing;
  for(const [x,y,w,d,z] of [[-11,-33,22,12,10],[-33,-11,12,22,17],[0,0,0,0,14],[21,-11,12,22,13],[-11,21,22,12,24]]){
   if(!w){const hub=S.group([0,0,16],[0,0,5]);S.box(-11,-11,22,22,5,6,11,hub);bearing=S.box(-6,-6,12,12,14,5,6,hub);S.rim(-3,-3,6,6,19.2,3,hub);continue;}
   const g=S.group([x+w/2,y+d/2,z+4],[0,0,8]);
   S.box(x+3,y+3,w-6,d-6,5,3,3);
   const blade=S.box(x,y,w,d,z,5,6,g);
   S.rim(x+3,y+3,w-6,d-6,z+5.2,3,g);
   blades.push(blade);
  }
  S.focus(blades[3]);S.focus(bearing);blades.slice(0,3).forEach(p=>S.focus(p));
 };

 R.progress=S=>{
  const shell=S.group([0,0,6],[0,0,2]);
  const rail=S.box(-61,-22,122,44,0,6,9,shell);
  S.rim(-54,-15,108,30,6.2,6,shell);
  for(const x of [-51,-27,-3,21])S.rim(x,-11,20,22,6.3,4,shell);
  const blocks=[];
  for(const [x,z] of [[-50,9],[-26,13],[-2,19]]){
   const g=S.group([x+9,0,z+5],[0,0,8]);
   const block=S.box(x,-10,18,20,z,5,4,g);
   S.rim(x+4,-5,10,10,z+5.2,2,g);
   S.dot(x+9,0,z+5.4,.9,g);
   blocks.push(block);
  }
  S.box(52,-15,5,30,6,7,2.5,shell);
  S.focus(blocks[2]);S.focus(blocks[0]);S.focus(blocks[1]);S.focus(rail);
 };

 R.skeleton=S=>{
  S.box(-50,-39,100,78,0,6,7);
  S.rim(-43,-32,86,64,6.2,5);
  const portrait=S.group([-25,-17,17],[0,0,7]);
  const token=S.box(-37,-29,24,24,11,6,12,portrait);
  S.rim(-32,-24,14,14,17.2,7,portrait);
  const bars=[];
  for(const [x,y,w,z] of [[-4,-28,39,15],[-4,-10,28,22],[-35,13,69,12]]){
   const g=S.group([x+w/2,y+6,z+4],[0,0,9]);
   S.rim(x,y,w,12,6.3,4);
   const block=S.box(x,y,w,12,z,5,4,g);
   S.line([[x+6,y+6,z+5.2],[x+w-6,y+6,z+5.2]],g);
   bars.push(block);
  }
  S.focus(token);bars.forEach(p=>S.focus(p));
 };

 R.slider=S=>{
  const carriage=S.group([4,0,22],[21,0,4]),left=S.group([-51,0,10],[0,0,3]),right=S.group([51,0,10],[0,0,5]);
  S.box(-61,-20,122,40,0,5,8);
  S.rim(-54,-13,108,26,5.2,4);
  S.box(-50,-4,100,8,5,6,4);
  for(const x of [-38,-26,-14,-2,10,22,34])S.line([[x,10,5.3],[x,14,5.3]]);
  const endA=S.box(-56,-11,10,22,7,5,4,left);
  S.dot(-51,0,12.3,1,left);
  S.box(-5,-8,18,16,12,6,3,carriage);
  const sled=S.box(-11,-16,30,32,19,7,7,carriage);
  S.rim(-5,-10,18,20,26.2,4,carriage);
  for(const x of [0,4,8])S.line([[x,-5,26.3],[x,5,26.3]],carriage);
  const endB=S.box(46,-11,10,22,7,5,4,right);
  S.dot(51,0,12.3,1,right);
  S.focus(sled);S.focus(endA);S.focus(endB);
 };

 R.kbd=S=>{
  S.box(-57,-37,114,74,0,6,8);
  S.rim(-50,-30,100,60,6.2,5);
  const keys=[];
  for(const [x,y,w,z] of [[-48,-27,27,14],[-14,-27,27,19],[-48,5,42,16],[20,-27,27,12],[1,5,46,25]]){
   const g=S.group([x+w/2,y+11,z+6],[0,0,8]);
   S.rim(x-1,y-1,w+2,26,6.3,5);
   S.box(x+w/2-5,y+7,10,10,z-5,5,3,g);
   const key=S.box(x,y,w,24,z,6,5,g);
   S.rim(x+5,y+5,w-10,14,z+6.2,3,g);
   S.dot(x+8,y+8,z+6.4,.8,g);
   keys.push(key);
  }
  S.focus(keys[4]);keys.slice(0,4).forEach(p=>S.focus(p));
 };

 R.toggle=S=>{
  const rocker=S.group([0,0,31],[0,0,9]),axle=S.group([0,0,18],[0,0,4]),housing=S.group([0,0,7],[0,0,2]);
  const base=S.box(-47,-31,94,62,0,7,10,housing);
  S.rim(-40,-24,80,48,7.2,7,housing);
  S.box(-38,-13,12,26,7,9,6,housing);
  S.box(-30,-4,60,8,15,5,4,axle);
  const pivot=S.box(-7,-7,14,14,18,5,7,axle);
  S.rim(-3,-3,6,6,23.2,3,axle);
  S.box(26,-13,12,26,7,9,6,housing);
  const paddle=S.box(-27,-22,54,44,28,7,9,rocker);
  S.rim(-21,-16,42,32,35.2,6,rocker);
  S.line([[-18,0,35.4],[18,0,35.4]],rocker);
  S.box(-6,6,12,6,35,2,3,rocker);
  S.dot(0,-9,35.3,1.2,rocker);
  S.focus(paddle);S.focus(pivot);S.focus(base);
 };
})();
