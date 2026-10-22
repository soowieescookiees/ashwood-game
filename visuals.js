/* ASHWOOD VISUAL UPGRADE
   Detailed illustrated characters + richer Halloween neighborhood graphics.
*/
(function(){
  const oldInitWorld=window.initWorld;
  window.initWorld=function(){
    oldInitWorld();
    if(window.npcs){
      window.npcs.forEach((n,i)=>{
        n.skin=["#d9a77e","#8f5f45","#c98f6d","#e0b58e"][i%4];
        n.hair=["#3a241d","#151515","#6b4030","#33241e"][i%4];
        n.shirt=["#6d2831","#334b63","#5b3d62","#7a5b32"][i%4];
        n.pants="#25252b";
        n.walkOffset=i*1.7;
      });
    }
    if(window.player){
      window.player.skin="#c98f6d";
      window.player.hair="#241b1b";
      window.player.shirt="#3f4d58";
      window.player.pants="#20242b";
    }
  };

  function rr(x,y,w,h,r){
    const c=window.ctx;
    c.beginPath();c.roundRect(x,y,w,h,r);c.fill();
  }

  window.drawCharacter=function(x,y,color,name,isPlayer){
    const c=window.ctx;
    const t=performance.now()/150;
    const moving=isPlayer && (window.keys.w||window.keys.a||window.keys.s||window.keys.d||window.keys.arrowup||window.keys.arrowdown||window.keys.arrowleft||window.keys.arrowright);
    const bob=moving?Math.sin(t)*2:0;
    const step=moving?Math.sin(t)*4:0;
    const n=window.npcs&&window.npcs.find(q=>q.name===name);
    const skin=isPlayer?(window.player.skin||"#c98f6d"):(n&&n.skin)||"#c98f6d";
    const hair=isPlayer?(window.player.hair||"#241b1b"):(n&&n.hair)||"#33241e";
    const shirt=isPlayer?(window.player.shirt||"#3f4d58"):(n&&n.shirt)||color||"#4d5360";
    const pants=isPlayer?(window.player.pants||"#20242b"):(n&&n.pants)||"#25252b";

    // shadow
    c.fillStyle="rgba(0,0,0,.38)";c.beginPath();c.ellipse(x,y+20,18,7,0,0,Math.PI*2);c.fill();

    // legs + shoes
    c.fillStyle=pants;rr(x-10,y+12+bob,8,18,3);rr(x+2,y+12+bob,8,18,3);
    c.fillStyle="#151619";rr(x-12+step*.35,y+28+bob,11,5,2);rr(x+1-step*.35,y+28+bob,11,5,2);

    // torso / jacket
    c.fillStyle=shirt;rr(x-14,y-3+bob,28,22,7);
    c.fillStyle="rgba(255,255,255,.10)";c.fillRect(x-2,y-1+bob,2,19);
    c.fillStyle="#c7b58b";c.fillRect(x-1,y+1+bob,2,3);

    // arms
    c.strokeStyle=shirt;c.lineWidth=7;c.lineCap="round";
    c.beginPath();c.moveTo(x-11,y+1+bob);c.lineTo(x-18-step*.25,y+17+bob);c.moveTo(x+11,y+1+bob);c.lineTo(x+18+step*.25,y+17+bob);c.stroke();
    c.strokeStyle=skin;c.lineWidth=5;c.beginPath();c.moveTo(x-18-step*.25,y+17+bob);c.lineTo(x-18-step*.25,y+20+bob);c.moveTo(x+18+step*.25,y+17+bob);c.lineTo(x+18+step*.25,y+20+bob);c.stroke();

    // neck
    c.fillStyle=skin;rr(x-4,y-8+bob,8,8,3);

    // face
    c.fillStyle=skin;c.beginPath();c.ellipse(x,y-18+bob,13,15,0,0,Math.PI*2);c.fill();
    // ears
    c.beginPath();c.arc(x-12,y-18+bob,3,0,Math.PI*2);c.arc(x+12,y-18+bob,3,0,Math.PI*2);c.fill();

    // hair / bangs
    c.fillStyle=hair;c.beginPath();c.arc(x,y-25+bob,14,Math.PI,Math.PI*2);c.fill();
    c.beginPath();c.moveTo(x-13,y-25+bob);c.quadraticCurveTo(x-7,y-34+bob,x,y-30+bob);c.quadraticCurveTo(x+7,y-35+bob,x+14,y-24+bob);c.lineTo(x+11,y-18+bob);c.quadraticCurveTo(x+7,y-23+bob,x+3,y-21+bob);c.lineTo(x+1,y-25+bob);c.quadraticCurveTo(x-5,y-20+bob,x-12,y-18+bob);c.closePath();c.fill();

    // eyes + eyebrows + nose + mouth
    c.fillStyle="#211c1c";c.fillRect(x-7,y-19+bob,4,2);c.fillRect(x+3,y-19+bob,4,2);
    c.strokeStyle="#3b2924";c.lineWidth=1.5;c.beginPath();c.moveTo(x-8,y-22+bob);c.lineTo(x-3,y-23+bob);c.moveTo(x+3,y-23+bob);c.lineTo(x+8,y-22+bob);c.stroke();
    c.strokeStyle="#855b4b";c.beginPath();c.moveTo(x,y-17+bob);c.lineTo(x-1,y-13+bob);c.stroke();
    c.strokeStyle="#6d3f3d";c.beginPath();c.moveTo(x-3,y-9+bob);c.quadraticCurveTo(x,y-7+bob,x+3,y-9+bob);c.stroke();

    // name tag
    c.fillStyle="rgba(0,0,0,.62)";rr(x-40,y+37,80,17,5);
    c.fillStyle="#f2ead8";c.font="bold 10px Inter,Arial";c.textAlign="center";c.fillText(name,x,y+49);
  };

  window.draw=function(){
    const c=window.ctx,canvas=window.canvas;
    if(!c||!canvas)return;
    const w=canvas.clientWidth,h=canvas.clientHeight;
    c.clearRect(0,0,w,h);

    // moonlit fall sky / ground
    const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,"#111923");g.addColorStop(.55,"#263228");g.addColorStop(1,"#171b18");c.fillStyle=g;c.fillRect(0,0,w,h);

    // subtle fog
    c.fillStyle="rgba(205,215,196,.035)";for(let i=0;i<7;i++){c.beginPath();c.ellipse(100+i*230,150+(i%3)*170,170,45,0,0,Math.PI*2);c.fill();}

    // road + sidewalks
    c.fillStyle="#202326";c.fillRect(0,285,w,72);c.fillRect(360,0,62,h);
    c.fillStyle="#69665e";c.fillRect(0,298,w,48);c.fillRect(377,0,28,h);
    c.fillStyle="#d5a85c";c.fillRect(0,321,w,2);c.fillRect(390,0,2,h);
    c.fillStyle="#b5a990";for(let x=20;x<w;x+=95){c.fillRect(x,306,50,3);}for(let y=20;y<h;y+=90){c.fillRect(388,y,3,45);}

    // buildings
    (window.buildings||[]).forEach(b=>{
      const isSchool=b.type==="school",isCafe=b.type==="cafe",isPark=b.type==="park";
      if(isPark){
        c.fillStyle="#293b27";rr(b.x,b.y,b.w,b.h,16);
        c.strokeStyle="#55634d";c.lineWidth=3;c.strokeRect(b.x+12,b.y+12,b.w-24,b.h-24);
        c.fillStyle="#c67a2f";c.beginPath();c.arc(b.x+75,b.y+70,18,0,Math.PI*2);c.fill();
        c.fillStyle="#d8b06c";c.fillRect(b.x+50,b.y+88,50,4);
        c.fillStyle="#e7d7ae";c.font="bold 15px Inter,Arial";c.textAlign="center";c.fillText("OLD PARK",b.x+b.w/2,b.y+b.h-18);return;
      }
      c.fillStyle=isSchool?"#4c4140":isCafe?"#594438":"#5b4439";rr(b.x,b.y,b.w,b.h,9);
      // roof
      c.fillStyle=isSchool?"#29272b":"#30252a";c.beginPath();c.moveTo(b.x-12,b.y+5);c.lineTo(b.x+b.w/2,b.y-28);c.lineTo(b.x+b.w+12,b.y+5);c.closePath();c.fill();
      // windows
      for(let xx=b.x+28;xx<b.x+b.w-20;xx+=58){
        c.fillStyle="#e8b86a";rr(xx,b.y+45,25,28,3);c.fillStyle="#503b29";c.fillRect(xx+11,b.y+45,2,28);c.fillRect(xx,b.y+58,25,2);
      }
      c.fillStyle="#19191b";rr(b.x+b.w/2-25,b.y+b.h-48,50,48,4);
      c.fillStyle="#e6d7b3";c.font="bold 13px Inter,Arial";c.textAlign="center";c.fillText(b.name,b.x+b.w/2,b.y+b.h-57);
      if(isCafe){c.fillStyle="#d77b31";for(let p=0;p<3;p++){c.beginPath();c.arc(b.x+35+p*70,b.y+b.h-18,8,0,Math.PI*2);c.fill();}}
    });

    // trees with layered foliage
    (window.trees||[]).forEach(t=>{
      c.fillStyle="#33271f";c.fillRect(t.x-4,t.y,8,25);
      c.fillStyle="#243923";c.beginPath();c.arc(t.x,t.y-8,23,0,Math.PI*2);c.fill();
      c.fillStyle="#4d542c";c.beginPath();c.arc(t.x-9,t.y-12,11,0,Math.PI*2);c.fill();
      c.fillStyle="#9b552c";c.beginPath();c.arc(t.x+10,t.y-4,7,0,Math.PI*2);c.fill();
    });

    // pumpkins along the neighborhood
    for(let i=0;i<9;i++){
      const px=35+i*155,py=260+(i%2)*18;c.fillStyle="#c66d2b";c.beginPath();c.ellipse(px,py,10,8,0,0,Math.PI*2);c.fill();c.beginPath();c.ellipse(px+7,py,7,7,0,0,Math.PI*2);c.fill();c.fillStyle="#4f6a32";c.fillRect(px,py-11,3,5);
    }

    // street lamps
    for(let x=60;x<w;x+=230){c.strokeStyle="#292a2b";c.lineWidth=4;c.beginPath();c.moveTo(x,270);c.lineTo(x,205);c.lineTo(x+15,195);c.stroke();c.fillStyle="rgba(255,218,133,.20)";c.beginPath();c.arc(x+15,197,27,0,Math.PI*2);c.fill();c.fillStyle="#f5d487";c.beginPath();c.arc(x+15,197,7,0,Math.PI*2);c.fill();}

    (window.npcs||[]).forEach(n=>window.drawCharacter(n.x,n.y,n.color,n.name,false));
    if(window.player)window.drawCharacter(window.player.x,window.player.y,"#d9d0bd",window.state.name||"YOU",true);

    const near=window.getNearby&&window.getNearby();
    if(near){c.fillStyle="rgba(0,0,0,.82)";rr(near.x-78,near.y-72,156,28,7);c.fillStyle="#fff1cf";c.font="bold 11px Inter,Arial";c.textAlign="center";c.fillText("E  TALK TO "+near.name.toUpperCase(),near.x,near.y-53);}
  };
})();
