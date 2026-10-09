(() => {
  F.coverRecipes ||= {};

  // Swatch decks: separate stepped ramps, with small registration punches.
  F.coverRecipes.colors = S => {
    S.box(-62, -43, 124, 86, 0, 6, 8);
    S.rim(-57, -38, 114, 76, 6.3, 6);
    const decks = [{x:-51,y:-28,z:10},{x:-13,y:-22,z:15},{x:25,y:-15,z:22}];
    for (const [i,d] of decks.entries()) {
      const g = S.group([d.x+14,d.y+25,d.z+6],[0,-3,10]);
      S.box(d.x-2,d.y-4,30,59,7,2,3,g);
      S.box(d.x-1,d.y-2,30,59,d.z-4,2,3,g);
      S.focus(S.box(d.x,d.y,30,59,d.z,3,4,g));
      for (let j=0;j<5;j++) {
        S.rim(d.x+4,d.y+4+j*10,22,7,d.z+3.2,1.8,g);
        for(let k=0;k<j+1;k++) S.dot(d.x+7+k*3.4,d.y+7.5+j*10,d.z+3.3,.48,g);
      }
      S.box(d.x+9,d.y-5,12,7,d.z+1,2,2,g);
      for(let p=0;p<=i;p++) S.dot(d.x+12+p*3,d.y-1.5,d.z+3.3,.6,g);
    }
    S.box(-49,37,98,2,6.5,1.5,1);
  };

  // Reference sockets feed role sockets, which in turn feed assembled controls.
  F.coverRecipes['semantic-tokens'] = S => {
    S.box(-62,-45,124,90,0,5,7);
    for(let i=0;i<3;i++) {
      const x=-42+i*40;
      S.line([[x,-30,6],[x,-11,6],[x+(i===0?19:i===2?-19:0),-3,6],[x+(i===0?19:i===2?-19:0),14,6]],-1,'lo');
      S.line([[x,-30,6],[x,-30,13]],-1,'dash');
    }
    const refs=[[-52,-37,10],[-12,-37,14],[28,-37,8]];
    for(const [i,[x,y,z]] of refs.entries()) {
      const g=S.group([x+12,y+10,z+7],[0,0,8]);
      S.box(x-2,y-2,28,24,5.5,2,4,g);
      S.focus(S.box(x,y,24,20,z,5,4,g));
      for(let k=0;k<=i;k++) S.dot(x+7+k*4,y+10,z+5.2,.8,g);
    }
    for(const [i,x] of [-35,7].entries()) {
      const g=S.group([x+14,2,24],[0,0,10]);
      S.box(x-2,-11,32,25,7,3,4,g);
      S.focus(S.box(x,-9,28,21,17+i*3,5,5,g));
      S.rim(x+5,-4,18,11,22.3+i*3,3,g);
    }
    const g=S.group([2,31,37],[0,0,10]);
    S.box(-40,18,84,25,8,3,5,g);
    S.focus(S.box(-37,20,78,23,29,5,5,g));
    S.box(-29,26,39,7,34,1.5,2,g);
    S.box(18,24,15,13,34,2,3,g);
    S.dot(25.5,30.5,36.2,1,g);
  };

  // A typesetter's composing bed: differing measures and physical line heights.
  F.coverRecipes.typography = S => {
    S.box(-62,-42,124,84,0,7,7);
    S.box(-57,-37,6,73,7,8,2);
    S.box(-49,-37,104,5,7,4,2);
    const lines=[{y:-25,w:88,d:13,z:27},{y:-6,w:72,d:10,z:19},{y:10,w:92,d:8,z:13},{y:25,w:59,d:6,z:10}];
    for(const [i,d] of lines.entries()) {
      const g=S.group([-41+d.w/2,d.y+d.d/2,d.z+4],[0,0,9]);
      S.box(-43,d.y-1,d.w+4,d.d+2,7,2,2,g);
      S.focus(S.box(-41,d.y,d.w,d.d,d.z,4,2.4,g));
      const cells=i===0?7:i===1?8:11, step=(d.w-8)/cells;
      for(let k=1;k<cells;k++) S.line([[-37+k*step,d.y+2,d.z+4.2],[-37+k*step,d.y+d.d-2,d.z+4.2]],g,'lo');
      S.line([[-42,d.y+d.d+3,7.4],[-41+d.w,d.y+d.d+3,7.4]],-1,'lo');
    }
    for(let i=0;i<9;i++) S.line([[-55,-27+i*7,15.2],[-52,-27+i*7,15.2]],-1,'lo');
    S.box(48,24,8,9,7,4,2);
  };

  // Gauge fixtures make the empty intervals tangible; each uses a different gap.
  F.coverRecipes.spacing = S => {
    S.box(-64,-42,128,84,0,6,7);
    const fixtures=[{x:-54,y:-30,w:24,z:11},{x:-21,y:-22,w:31,z:18},{x:19,y:-12,w:36,z:27}];
    for(const [i,d] of fixtures.entries()) {
      const g=S.group([d.x+d.w/2,d.y+25,d.z+7],[0,0,10]);
      S.box(d.x-2,d.y-3,d.w+4,57,6.5,3,3,g);
      S.box(d.x,d.y,5,49,d.z,5,2,g);
      S.box(d.x+d.w-5,d.y,5,49,d.z,5,2,g);
      S.focus(S.box(d.x+3,d.y+11,d.w-6,8,d.z+6,3,2,g));
      S.box(d.x+3,d.y+36,d.w-6,8,d.z+2,3,2,g);
      S.line([[d.x+8,d.y+24,d.z+1],[d.x+d.w-8,d.y+24,d.z+1]],g,'lo');
      for(let k=0;k<=i;k++) S.dot(d.x+d.w/2+(k-i/2)*3.2,d.y+15,d.z+9.2,.7,g);
    }
    S.box(-51,35,101,3,6,2,1);
    for(let i=0;i<13;i++) S.line([[-47+i*7.5,35.2,8.2],[-47+i*7.5,37,8.2]],-1,'lo');
  };

  // Machined corner specimens range from a tight fillet to a fully round puck.
  F.coverRecipes.radius = S => {
    S.box(-62,-43,124,86,0,6,8);
    const pieces=[{x:-51,y:-31,r:2,z:12},{x:5,y:-31,r:7,z:24},{x:-42,y:13,r:11,z:17},{x:10,y:14,r:16,z:31}];
    for(const [i,d] of pieces.entries()) {
      const g=S.group([d.x+16,d.y+16,d.z+7],[0,0,9]);
      S.rim(d.x-3,d.y-3,38,38,6.3,Math.min(18,d.r+3));
      S.box(d.x+3,d.y+3,26,26,7,4,Math.min(12,d.r),g);
      S.focus(S.box(d.x,d.y,32,32,d.z,6,d.r,g));
      S.rim(d.x+5,d.y+5,22,22,d.z+6.2,Math.min(11,d.r),g);
      S.dot(d.x+16,d.y+16,d.z+6.4,1,g);
      if(i<3) S.line([[d.x+16,d.y+8,d.z+6.3],[d.x+16,d.y+12,d.z+6.3]],g,'lo');
    }
  };

  // Elevation samples hover above nested footprints, with discreet registration posts.
  F.coverRecipes.shadows = S => {
    S.box(-65,-44,130,88,0,5,8);
    const pieces=[{x:-52,y:-32,z:13},{x:-10,y:-18,z:25},{x:24,y:5,z:40}];
    for(const d of pieces) {
      S.rim(d.x-4,d.y-4,40,40,5.2,7);
      S.rim(d.x,d.y,32,32,5.3,5);
      S.line([[d.x+16,d.y+16,5],[d.x+16,d.y+16,d.z]],-1,'dash');
      const g=S.group([d.x+16,d.y+16,d.z+5],[0,0,8]);
      S.box(d.x+10,d.y+10,12,12,d.z-5,5,3,g);
      S.focus(S.box(d.x,d.y,32,32,d.z,4,6,g));
      S.rim(d.x+7,d.y+7,18,18,d.z+4.2,4,g);
      S.dot(d.x+16,d.y+16,d.z+4.4,.8,g);
    }
    for(const [x,y] of [[-58,-36],[57,-36],[-58,36],[57,36]]) S.box(x,y,3,3,5,4,1.4);
  };

  // A typecase of symbol dies: individual punched tiles in a divided drawer.
  F.coverRecipes.icons = S => {
    S.box(-59,-42,118,84,0,7,7);
    S.box(-55,-38,110,3,7,9,1.5);
    S.box(-55,-35,3,66,7,9,1.5);
    for(let s=0;s<=5;s++) for(let row=0;row<3;row++) {
      const col=s-row;if(col<0||col>3) continue;
      const x=-45+col*26,y=-29+row*23,z=9+([0,4,1,8,2,12,3,5,7,2,4,1][row*4+col]);
      const g=S.group([x+9,y+8,z+5],[0,0,11]);
      S.rim(x-2,y-2,22,20,7.2,3);
      S.focus(S.box(x,y,18,16,z,4,3,g));
      const punches=(row+col)%4+2;
      for(let k=0;k< punches;k++) S.dot(x+6+(k%2)*6,y+5+Math.floor(k/2)*4,z+4.3,.7,g);
      S.line([[x+4,y+13,z+4.3],[x+14,y+13,z+4.3]],g,'lo');
    }
    S.box(-55,33,110,4,7,9,2);
    S.rim(-13,32,26,5,16.2,2);
  };

  // Edge-gauge samples reveal three different border widths as nested shoulders.
  F.coverRecipes.borders = S => {
    S.box(-63,-43,126,86,0,6,7);
    const pieces=[{x:-52,y:-31,w:31,d:46,b:2,z:12},{x:-12,y:-18,w:31,d:46,b:4,z:23},{x:27,y:-4,w:29,d:41,b:7,z:32}];
    for(const [i,d] of pieces.entries()) {
      const g=S.group([d.x+d.w/2,d.y+d.d/2,d.z+5],[0,0,9]);
      S.rim(d.x-3,d.y-3,d.w+6,d.d+6,6.3,5);
      S.box(d.x+4,d.y+4,d.w-8,d.d-8,7,4,3,g);
      S.focus(S.box(d.x,d.y,d.w,d.d,d.z,4,5,g));
      S.rim(d.x+d.b,d.y+d.b,d.w-2*d.b,d.d-2*d.b,d.z+4.2,Math.max(2,5-d.b/2),g);
      S.rim(d.x+d.b+2,d.y+d.b+2,d.w-2*d.b-4,d.d-2*d.b-4,d.z+4.3,2,g);
      for(let k=0;k<=i;k++) S.dot(d.x+d.w/2+(k-i/2)*3,d.y+d.d-2,d.z+4.4,.45,g);
    }
    S.box(-48,35,47,3,6,2,1);
    for(let i=0;i<6;i++) S.line([[-44+i*7,35.2,8.2],[-44+i*7,37.5,8.2]],-1,'lo');
  };

  // Breakpoint decks retain visible columns, gutters, and device-shaped chassis.
  F.coverRecipes.grids = S => {
    S.box(-63,-44,126,88,0,5,7);
    const decks=[{x:-53,y:-34,w:74,d:48,z:13,n:6},{x:-26,y:-12,w:57,d:47,z:26,n:4},{x:22,y:5,w:28,d:42,z:40,n:2}];
    for(const d of decks) {
      const g=S.group([d.x+d.w/2,d.y+d.d/2,d.z+4],[0,0,8]);
      S.box(d.x+3,d.y+3,d.w-6,d.d-6,d.z-4,2,3,g);
      S.focus(S.box(d.x,d.y,d.w,d.d,d.z,3,5,g));
      S.rim(d.x+4,d.y+5,d.w-8,d.d-10,d.z+3.2,2,g);
      const gap=2,cell=(d.w-12-gap*(d.n-1))/d.n;
      for(let col=0;col<d.n;col++) {
        const x=d.x+6+col*(cell+gap);
        S.box(x,d.y+8,cell,d.d-18,d.z+3.4,1.2,1,g);
        S.line([[x+1,d.y+20,d.z+4.8],[x+cell-1,d.y+20,d.z+4.8]],g,'lo');
      }
      S.dot(d.x+d.w/2,d.y+d.d-2,d.z+3.3,.55,g);
    }
  };
})();
