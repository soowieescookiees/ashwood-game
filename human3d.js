(function(){
  const sphereVerts=[]; const sphereIdx=[]; const rings=12, segs=16;
  for(let r=0;r<=rings;r++){const v=r/rings, phi=v*Math.PI; for(let s=0;s<segs;s++){const u=s/segs*2*Math.PI; sphereVerts.push(Math.sin(phi)*Math.cos(u),Math.cos(phi),Math.sin(phi)*Math.sin(u));}}
  for(let r=0;r<rings;r++)for(let s=0;s<segs;s++){const a=r*segs+s,b=r*segs+(s+1)%segs,c=(r+1)*segs+(s+1)%segs,d=(r+1)*segs+s;sphereIdx.push(a,b,d,b,c,d);}
  const cylVerts=[]; const cylIdx=[]; const cs=16;
  for(let y=0;y<=1;y++)for(let s=0;s<cs;s++){const a=s/cs*2*Math.PI;cylVerts.push(Math.cos(a),y-.5,Math.sin(a));}
  for(let s=0;s<cs;s++){const a=s,b=(s+1)%cs,c=cs+(s+1)%cs,d=cs+s;cylIdx.push(a,b,d,b,c,d);}
  function mesh(vs,is){const vb=gl.createBuffer(),ib=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vs),gl.STATIC_DRAW);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(is),gl.STATIC_DRAW);return {vb,ib,n:is.length};}
  let sph=null,cy=null;
  function drawMesh(vp,m,mesh,c){gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vb);const loc=gl.getAttribLocation(program,'aPos');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,mesh.ib);gl.uniformMatrix4fv(uMVP,false,mul(vp,m));gl.uniform3fv(uColor,col(c));gl.drawElements(gl.TRIANGLES,mesh.n,gl.UNSIGNED_SHORT,0);}
  function part(vp,x,y,z,sx,sy,sz,c,ry=0,rx=0,rz=0,kind='sphere'){
    let m=T(x,y,z);m=mul(m,RY(ry));m=mul(m,RX(rx));
    if(rz){const cc=Math.cos(rz),ss=Math.sin(rz),R=I();R[0]=cc;R[1]=ss;R[4]=-ss;R[5]=cc;m=mul(m,R)}
    m=mul(m,S(sx,sy,sz));drawMesh(vp,m,kind==='cyl'?cy:sph,c);
  }
  window.character=function(vp,ch){
    if(!sph){sph=mesh(sphereVerts,sphereIdx);cy=mesh(cylVerts,cylIdx)}
    const w=Math.sin(ch.walk||0)*.55,b=Math.abs(Math.sin(ch.walk||0))*.025,r=ch.rot||0;
    const skin=ch.skin||'#c98d6c', hair=ch.hair||'#2a2020', shirt=ch.shirt||'#384b5a', pants=ch.pants||'#25262c';
    part(vp,ch.x,1.35+b,ch.z,.43,.72,.27,shirt,r,0,0,'sphere');
    part(vp,ch.x,1.86+b,ch.z,.47,.17,.28,shirt,r,0,0,'sphere');
    part(vp,ch.x,1.98+b,ch.z,.13,.16,.13,skin,r,0,0,'cyl');
    part(vp,ch.x,2.32+b,ch.z,.31,.35,.28,skin,r,0,0,'sphere');
    part(vp,ch.x,2.51+b,ch.z,.33,.20,.30,hair,r,0,0,'sphere');
    part(vp,ch.x,2.34+b,ch.z+.08,.29,.30,.22,hair,r,0,0,'sphere');
    const fx=Math.sin(r),fz=Math.cos(r);
    part(vp,ch.x-fx*.105,2.34+b,ch.z-fz*.27,.035,.035,.02,'#171719',r,0,0,'sphere');
    part(vp,ch.x+fx*.105,2.34+b,ch.z+fz*.27,.035,.035,.02,'#171719',r,0,0,'sphere');
    part(vp,ch.x,2.25+b,ch.z-fz*.30,.035,.04,.03,skin,r,0,0,'sphere');
    const sx=Math.cos(r),sz=-Math.sin(r);
    part(vp,ch.x-sx*.43,1.58+b,ch.z-sz*.43,.115,.42,.115,shirt,r,w,0,'cyl');
    part(vp,ch.x+sx*.43,1.58+b,ch.z+sz*.43,.115,.42,.115,shirt,r,-w,0,'cyl');
    part(vp,ch.x-sx*.48,1.18+b,ch.z-sz*.48,.12,.12,.12,skin,r,0,0,'sphere');
    part(vp,ch.x+sx*.48,1.18+b,ch.z+sz*.48,.12,.12,.12,skin,r,0,0,'sphere');
    part(vp,ch.x-.18,.72+b,ch.z,.15,.50,.15,pants,r,-w*.75,0,'cyl');
    part(vp,ch.x+.18,.72+b,ch.z,.15,.50,.15,pants,r,w*.75,0,'cyl');
    part(vp,ch.x-.18,.30+b,ch.z-.07,.17,.10,.30,'#15161a',r,0,0,'sphere');
    part(vp,ch.x+.18,.30+b,ch.z-.07,.17,.10,.30,'#15161a',r,0,0,'sphere');
  };
})();