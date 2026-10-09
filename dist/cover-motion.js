/* Motion and template covers: rounded physical assemblies, painted back to front. */
(function(F){
  const R=F.coverRecipes||(F.coverRecipes={});
  const focus=(S,parts,first=0)=>{
    S.focus(parts[first]);
    parts.forEach((part,i)=>{if(i!==first)S.focus(part);});
  };

  R['ai-loader']=function(S){
    S.box(-43,-43,86,86,0,4,8);
    S.rim(-39,-39,78,78,4.1,6);
    const heights=[
      [5,8,11,7,4],
      [7,14,22,15,6],
      [9,21,32,23,10],
      [6,16,24,17,8],
      [4,8,12,9,5]
    ],parts=[];
    for(let diagonal=0;diagonal<=8;diagonal++){
      for(let row=0;row<5;row++){
        const col=diagonal-row;
        if(col<0||col>4)continue;
        const x=-35+col*15,y=-35+row*15,h=heights[row][col];
        const g=S.group([x+5,y+5,5+h],[0,0,7]);
        const part=S.box(x,y,10,10,5,h,3,g);
        parts.push({part,row,col});
      }
    }
    const peak=parts.findIndex(p=>p.row===2&&p.col===2);
    focus(S,parts.map(p=>p.part),peak);
  };

  R.waveform=function(S){
    S.box(-58,-25,116,50,0,4,8);
    S.rim(-53,-20,106,40,4.1,5);
    const heights=[7,12,21,32,25,14,9,19,37,29,18,11,6];
    const fins=heights.map((h,i)=>({x:-51+i*8,y:-14+(i%3)*2,h,i}));
    fins.sort((a,b)=>(a.x+a.y)-(b.x+b.y));
    const parts=[];
    fins.forEach(({x,y,h,i})=>{
      const g=S.group([x+3,y+11,5+h],[0,0,8]);
      const part=S.box(x,y,6,22,5,h,2.8,g);
      parts.push({part,i});
    });
    focus(S,parts.map(p=>p.part),parts.findIndex(p=>p.i===8));
  };

  R['thinking-dots']=function(S){
    S.box(-56,-21,112,43,0,4,9);
    const pucks=[{x:-44,y:-12,h:8},{x:-10,y:-8,h:18},{x:24,y:-4,h:12}];
    pucks.forEach(({x,y})=>S.rim(x-2,y-2,24,24,4.1,11));
    const parts=[];
    pucks.forEach(({x,y,h})=>{
      const g=S.group([x+10,y+10,8+h],[0,0,9]);
      S.box(x+5,y+5,10,10,5,h-2,4,g);
      parts.push(S.box(x,y,20,20,h+3,5,10,g));
      S.rim(x+4,y+4,12,12,h+8.1,6,g);
    });
    focus(S,parts,1);
  };

  R['streaming-text']=function(S){
    S.box(-59,-35,118,70,0,4,8);
    S.rim(-54,-30,108,60,4.1,6);
    const rows=[[24,19,32],[17,36,19],[32,25],[19,13]],parts=[],words=[];
    rows.forEach((widths,i)=>{
      const y=-25+i*13,z=7+(i%2),longest=widths.indexOf(Math.max(...widths));
      const anchor=-47+widths.slice(0,longest).reduce((sum,w)=>sum+w+5,0)+widths[longest]/2;
      const g=S.group([anchor,y+2.5,z+3],[0,0,5]);
      let x=-47;
      widths.forEach((w,j)=>{
        words.push({x,y,w,z,g,row:i,focal:j===longest,depth:x+w/2+y+2.5});
        x+=w+5;
      });
    });
    const carriage=S.group([-2,16,15],[10,0,3]);
    words.push({carriage:true,depth:14});
    let cursor;
    words.sort((a,b)=>a.depth-b.depth).forEach(word=>{
      if(word.carriage){
        S.rim(-7,8,10,16,7,3,carriage);
        cursor=S.box(-4,10,4,12,8,7,1.8,carriage);
      }else{
        const part=S.box(word.x,word.y,word.w,5,word.z,3,2.4,word.g);
        if(word.focal)parts[word.row]=part;
      }
    });
    S.focus(cursor);
    parts.forEach(part=>S.focus(part));
  };

  R['text-shimmer']=function(S){
    S.box(-57,-35,114,70,0,4,8);
    const widths=[94,72,86,54],parts=[];
    widths.forEach((w,i)=>{
      const y=-25+i*13,z=7+(i%2)*2;
      const g=S.group([-47+w/2,y+3,z+3],[0,0,4]);
      parts.push(S.box(-47,y,w,6,z,3,2.8,g));
    });
    const scan=S.group([21,0,19],[14,0,2]);
    const slice=S.box(18,-30,6,60,14,5,2.6,scan);
    S.line([[21,-23,19.1],[21,23,19.1]],scan);
    S.focus(slice);
    parts.forEach(part=>S.focus(part));
  };

  R['text-glow']=function(S){
    S.box(-56,-28,112,56,0,4,9);
    S.rim(-51,-23,102,46,4.1,8);
    S.box(-48,-20,96,40,5,3,8);
    S.rim(-43,-15,86,30,8.1,7);
    S.box(-42,-12,84,24,10,3,6);
    const bars=[{x:-35,w:23,z:17},{x:-6,w:17,z:22},{x:17,w:20,z:19}],parts=[];
    bars.forEach(({x,w,z})=>{
      const g=S.group([x+w/2,0,z+5],[0,0,8]);
      parts.push(S.box(x,-5,w,10,z,5,4,g));
    });
    focus(S,parts,1);
  };

  R.composer=function(S){
    S.box(-60,-37,120,74,0,5,10);
    S.rim(-56,-33,112,66,5.1,8);
    const field=S.group([0,-8,9],[0,0,5]);
    const plate=S.box(-51,-28,102,39,6,3,7,field);
    S.line([[-43,-17,9.1],[-10,-17,9.1]],field);
    S.line([[-43,-8,9.1],[17,-8,9.1]],field);
    const chips=[];
    [{x:-49,w:24},{x:-19,w:28}].forEach(({x,w},i)=>{
      const g=S.group([x+w/2,24,10],[0,0,6+i]);
      const part=S.box(x,19,w,10,7,3,4,g);
      S.rim(x+3,22,w-6,4,10.1,1.8,g);
      chips.push(part);
    });
    const key=S.group([44.5,24.5,15],[0,0,9]);
    const cap=S.box(36,16,17,17,7,8,5,key);
    S.rim(40,20,9,9,15.1,3,key);
    S.focus(cap);S.focus(plate);chips.forEach(part=>S.focus(part));
  };


  R['ai-status']=function(S){
    S.box(-59,-38,118,78,0,4,9);
    S.line([[-33,-12,4.1],[5,6,4.1],[42,24,4.1]]);
    const stations=[{x:-45,y:-24,h:7},{x:-7,y:-6,h:14},{x:30,y:12,h:22}],parts=[];
    stations.forEach(({x,y,h})=>{
      const g=S.group([x+12,y+12,h+11],[0,0,8]);
      S.box(x,y,24,24,5,h,6,g);
      const cap=S.box(x+3,y+3,18,18,h+7,4,8,g);
      S.rim(x+7,y+7,10,10,h+11.1,5,g);
      parts.push(cap);
    });
    focus(S,parts,1);
  };

  R['form-layout']=function(S){
    S.box(-58,-41,116,82,0,4,9);
    S.rim(-54,-37,108,74,4.1,7);
    const fields=[
      {x:-49,y:-25,z:6},{x:5,y:-25,z:8},
      {x:-49,y:-5,z:8},{x:5,y:-5,z:10}
    ].sort((a,b)=>(a.x+a.y)-(b.x+b.y)),parts=[];
    fields.forEach(({x,y,z},i)=>{
      if(i===2)S.box(-48,23,28,6,6,2,2.8);
      const g=S.group([x+22,y+6,z+3],[0,0,7]);
      const field=S.box(x,y,44,12,z,3,4,g);
      S.rim(x+3,y+3,38,6,z+3.1,2.5,g);
      S.line([[x,y-4,z+3],[x+14,y-4,z+3]],g);
      parts.push(field);
    });
    const submit=S.group([34,26.5,13],[0,0,8]);
    const key=S.box(19,20,30,13,7,6,5,submit);
    S.rim(24,24,20,5,13.1,2,submit);
    focus(S,parts,0);S.focus(key);
  };

  R['settings-layout']=function(S){
    S.box(-58,-40,116,80,0,4,9);
    S.box(-51,-32,22,63,5,3,5);
    [-22,-8,6].forEach(y=>S.line([[-46,y,8.1],[-34,y,8.1]]));
    const rows=[{y:-28,z:6,on:true},{y:-8,z:9,on:false},{y:12,z:7}],parts=[];
    rows.forEach(({y,z,on},i)=>{
      const g=S.group([14.5,y+7.5,z+3],[0,0,6+i]);
      const row=S.box(-20,y,69,15,z,3,5,g);
      S.line([[-14,y+6,z+3.1],[6,y+6,z+3.1]],g);
      if(i<2){
        S.box(22,y+3,21,9,z+3,2,4.4,g);
        S.box(on?34:23,y+4,7,7,z+5,2,3.4,g);
      }else{
        S.box(20,y+3,23,9,z+3,3,3,g);
        S.rim(24,y+5,15,5,z+6.1,2,g);
      }
      parts.push(row);
    });
    focus(S,parts,1);
  };
})(window.Forma);
