'use strict';
// ===== MINIFOLKS SPRITE ANİMASYONLARI (32x32 kareli sayfalar) =====
// Satırlar: 0 bekle(4), 1 yürü(6), 2 eylem(3: saldırı/çalışma). Atlılarda eylem satırı 3.
const MF={},MFT=new Map();
const MFN=['VillagerMan','VillagerWoman','Peasant','Worker','OldMan','OldWoman','NobleMan','NobleWoman','Princess','Queen','SpearMan','SwordMan','ArcherMan','MountedArcher','CrossBowMan','HalberdMan','ShieldMan','CavalierMan','HorseMan','KingMan','PrinceMan'];
MFN.forEach(n=>{const i=new Image();i.src='img/mf/Mini'+n+'.png';MF[n]=i;});
const MFCNT={MountedArcher:[8,6,3],KingMan:[4,5,6],CavalierMan:[8,6,3],HorseMan:[8,6,3],PrinceMan:[4,6,5]};
const MFVIL=['VillagerMan','VillagerWoman','Peasant','Worker','VillagerMan','VillagerWoman','OldMan','OldWoman'];
const MFSOL={mizrakli:'SpearMan',kilic:'SwordMan',okcu:'ArcherMan',atliokcu:'MountedArcher',atli:'CavalierMan',top:'HalberdMan'};
const MFB={haydut:'SwordMan',haydutokcu:'CrossBowMan',haydutatli:'CavalierMan',haydutreis:'ShieldMan'};
function mfSheet(name,tint,al){
 const im=MF[name];if(!im||!im.complete||!im.naturalWidth)return null;
 if(!tint)return im;
 const k=name+tint+al;let c=MFT.get(k);
 if(!c){c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const x=c.getContext('2d');x.drawImage(im,0,0);x.globalCompositeOperation='source-atop';x.globalAlpha=al;x.fillStyle=tint;x.fillRect(0,0,c.width,c.height);MFT.set(k,c);}
 return c;
}
function mfLook(u){
 // [sayfa, renk, yoğunluk]
 const t=u.t;
 if(u.team==='b'){const n=MFB[t];return n?[n,'#c62828',t==='haydutreis'?0.55:0.4]:null;}
 if(t==='koylu'||t==='fkoylu'){const n=MFVIL[u.id%8];return [n,u.team==='f'&&KINGS[u.kid]?KINGS[u.kid].col:null,0.22];}
 if(t==='kahraman'){
  const per=personOf(u.who),fem=per?per.female:false;
  return [u.who==='ruler'?(fem?'Queen':'KingMan'):(fem?'Princess':'PrinceMan'),null,0];
 }
 const n=MFSOL[t];if(!n)return null;
 if(u.team==='f'&&KINGS[u.kid])return [n,KINGS[u.kid].col,0.35];
 if(u.team==='k'&&KINGS[u.kid])return [n,KINGS[u.kid].col,0.4];
 return [n,null,0];
}
const _drawUnitOld=drawUnit;
function drawCannon(u){
 const dx=u.x-(u.lx==null?u.x:u.lx);if(Math.abs(dx)>0.002)u.fdir=dx<0?-1:1;
 const moved=Math.hypot(dx,u.y-(u.ly==null?u.y:u.ly))>0.002;u.lx=u.x;u.ly=u.y;
 const fire=u.cd>0&&u.cd>(UT.top.rof||2.5)-0.25,rc=fire?-2.5:0;
 const col=u.team==='b'?'#c62828':(u.team==='p'?'#3a6fd8':'#888');
 ctx.fillStyle='#0003';ctx.beginPath();ctx.ellipse(u.x,u.y+0.3,0.36,0.1,0,0,6.3);ctx.fill();
 ctx.save();ctx.translate(u.x,u.y+0.3);if((u.fdir||1)<0)ctx.scale(-1,1);ctx.scale(1/32,1/32);
 const R=(c,x,y,w,h)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
 // namlu
 ctx.save();ctx.translate(rc,0);ctx.rotate(-0.12);
 R('#1d1d24',-9,-17,24,9);R('#3a3a45',-9,-17,24,3);R('#2a2a33',13,-18,5,11);R('#555563',-11,-16,4,7);
 ctx.restore();
 // kızak
 R('#6b4423',-10,-11,22,6);R('#4b2f16',-10,-6,22,2);R(col,-10,-11,4,6);
 // tekerlek
 const rot=moved?S.t*8:0;
 ctx.fillStyle='#4b2f16';ctx.beginPath();ctx.arc(-1,-3,7,0,6.3);ctx.fill();
 ctx.fillStyle='#7a5230';ctx.beginPath();ctx.arc(-1,-3,5,0,6.3);ctx.fill();
 ctx.strokeStyle='#4b2f16';ctx.lineWidth=1.3;for(let k=0;k<3;k++){const a=rot+k*1.047;ctx.beginPath();ctx.moveTo(-1-Math.cos(a)*5,-3-Math.sin(a)*5);ctx.lineTo(-1+Math.cos(a)*5,-3+Math.sin(a)*5);ctx.stroke();}
 ctx.fillStyle='#2a2a33';ctx.beginPath();ctx.arc(-1,-3,1.6,0,6.3);ctx.fill();
 if(fire){ctx.fillStyle='#ffd23c';ctx.beginPath();ctx.arc(22,-14,5,0,6.3);ctx.fill();ctx.fillStyle='#ff7a1a';ctx.beginPath();ctx.arc(21,-14,3,0,6.3);ctx.fill();}
 ctx.restore();
 if(u.hp<u.mhp){const top=u.y-0.35;ctx.fillStyle='#000a';ctx.fillRect(u.x-0.3,top,0.6,0.1);ctx.fillStyle=u.hp/u.mhp>0.4?'#4caf50':'#e53935';ctx.fillRect(u.x-0.3,top,0.6*u.hp/u.mhp,0.1);}
}
drawUnit=function(u){
 if(u.t==='top')return drawCannon(u);
 const lk=mfLook(u),sh=lk?mfSheet(lk[0],lk[1],lk[2]):null;
 if(!sh)return _drawUnitOld(u);
 const name=lk[0],mounted=name==='CavalierMan'||name==='HorseMan'||name==='MountedArcher';
 // yön ve hareket
 const dx=u.x-(u.lx==null?u.x:u.lx);if(Math.abs(dx)>0.002)u.fdir=dx<0?-1:1;
 const moved=Math.hypot(dx,u.y-(u.ly==null?u.y:u.ly))>0.002;u.lx=u.x;u.ly=u.y;
 const cnt=MFCNT[name]||[4,6,3];
 const T=S.t+u.id*0.37;
 let row=0,n=cnt[0],fps=4;
 const attacking=UT[u.t].mil&&u.cd>0&&u.cd>(UT[u.t].rof||1.3)-0.45;
 const working=u.team==='p'&&u.t==='koylu'&&!moved&&(u.st==='gather'||u.st==='work'||u.st==='build'||u.st==='hunt');
 if(u.st==='sleep'||u.wnd){row=0;n=1;}
 else if(attacking||working){row=mounted?3:2;n=cnt[2]||3;fps=6;}
 else if(moved){row=1;n=cnt[1];fps=10;}
 const fr=Math.floor(T*fps)%n;
 const size=mounted?1.9:1.7,fx=(u.fdir||1);
 const px=u.x,py=u.y+0.32-size*(30/32);
 ctx.fillStyle='#0003';ctx.beginPath();ctx.ellipse(u.x,u.y+0.3,0.28,0.1,0,0,6.3);ctx.fill();
 ctx.save();ctx.translate(px,py);if(fx<0)ctx.scale(-1,1);
 ctx.imageSmoothingEnabled=false;
 ctx.drawImage(sh,fr*32,row*32,32,32,-size/2,0,size,size);
 if(u.fl&&S.t-u.fl<0.15){ctx.globalAlpha=0.4;ctx.fillStyle='#fff';ctx.fillRect(-size*0.2,size*0.35,size*0.4,size*0.55);ctx.globalAlpha=1;}
 ctx.restore();
 if(u.st==='sleep')ctx.drawImage(spr('💤'),u.x+0.1,u.y-0.9,0.5,0.5);
 if(u.wnd)ctx.drawImage(spr('🩹'),u.x+0.1,u.y-0.9,0.5,0.5);
 const top=u.y-0.78;
 if(u.hp<u.mhp){ctx.fillStyle='#000a';ctx.fillRect(u.x-0.3,top-0.05,0.6,0.1);ctx.fillStyle=u.hp/u.mhp>0.4?'#4caf50':'#e53935';ctx.fillRect(u.x-0.3,top-0.05,0.6*u.hp/u.mhp,0.1);}
 if(u.team==='p'&&u.t==='koylu'&&S.founded&&u.job){const j=JOBS.find(j=>j.id===u.job);if(j)ctx.drawImage(spr(j.ic),u.x+0.2,u.y-0.95,0.36,0.36);}
 if(u.carry>0.5)ctx.drawImage(spr('📦'),u.x-0.6,u.y-0.15,0.32,0.32);
};

// ===== ÇİT / KAPI: komşulara göre yön seçimi =====
function wallAt(x,y){
 if(!inMap(x,y))return false;const id=OCC[y*MW+x];if(!id)return false;
 const o=BM.get(id);return !!(o&&(o.t==='duvar'||o.t==='kapi')&&o.team==='p');
}
const _drawBuildingOld=drawBuilding;
drawBuilding=function(b){
 if(b.t!=='duvar'&&b.t!=='kapi'){_drawBuildingOld(b);
  if((b.t==='agil'||b.t==='ahir')&&b.done&&b.team==='p'){
   const an=b.t==='agil'?['🐑','🐑','🐏']:['🐎','🐄','🐎'],T2=(S.t||0)*0.6+b.id;
   an.forEach((e,i)=>{const ax=b.x+b.w*(0.55+0.2*Math.sin(T2+i*2.1))-0.17,ay=b.y+b.h*(0.62+0.12*Math.cos(T2*0.8+i*1.7))-0.17;ctx.drawImage(spr(e),ax,ay,0.34,0.34);});
  }if(b.pri&&!b.done)ctx.drawImage(spr('⭐'),b.x+b.w-0.5,b.y,0.5,0.5);return;}
 const x=b.x,y=b.y,L=wallAt(x-1,y),R=wallAt(x+1,y),U=wallAt(x,y-1),D=wallAt(x,y+1);
 let tags=[];
 if(L||R)tags.push('h');
 if(U||D){if(b.t==='kapi'&&tags.length===0)tags.push('v');else if(b.t!=='kapi')tags.push('v');}
 if(!tags.length){
  const a=wallAt(x-1,y-1),c=wallAt(x+1,y+1),e=wallAt(x+1,y-1),f=wallAt(x-1,y+1);
  if(a||c)tags.push('d1');else if(e||f)tags.push('d2');else tags.push('h');
 }
 ctx.globalAlpha=b.done?1:0.5;
 for(const tg of tags){
  const im=img('s_'+b.t+'_'+tg);
  if(im)ctx.drawImage(im,x-0.125,y-0.125,1.25,1.25);
  else{ctx.fillStyle='#8a5a2a';ctx.fillRect(x+0.1,y+0.1,0.8,0.8);}
 }
 ctx.globalAlpha=1;
 if(b.team==='p'){ctx.fillStyle=TEAMCOL.p;ctx.fillRect(x+0.04,y+0.04,0.16,0.16);}
 if(b.pri){ctx.drawImage(spr('⭐'),x,y,0.45,0.45);}
 if(!b.done){ctx.fillStyle='#000a';ctx.fillRect(x+0.1,y+0.8,0.8,0.14);ctx.fillStyle='#ffd23c';ctx.fillRect(x+0.1,y+0.8,0.8*b.prog,0.14);}
};
