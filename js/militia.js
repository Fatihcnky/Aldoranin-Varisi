'use strict';
// ===== MİLİS: halk, hükümdar savaştayken silahlanıp orduya katılır =====
function militia(){return S.units.filter(u=>u.t==='milis'&&!u.dead&&u.team==='p');}
function milCap(){return Math.floor(popNow()*(S.techs&&S.techs.milis?0.4:0.25));}
function milReason(){
 if(!S.dyn||!heroOf('ruler'))return 'Hükümdar savaş için kaleden çıkmamış (Hanedan sekmesi → Orduya çağır)';
 if(S.happy<50)return 'Halk mutluluğu 50\'nin altında ('+Math.round(S.happy)+')';
 if(S.fest>0)return 'Şenlik sürüyor, bitmesini bekle ('+S.fest+' gün)';
 return '';
}
function callMilitia(){
 const why=milReason();if(why){log('⛔ Milis çağrılamaz: '+why);return 0;}
 let room=milCap()-militia().length;if(room<=0){log('⛔ Milis sınırına ulaşıldı.');return 0;}
 const pool=S.units.filter(u=>u.team==='p'&&u.t==='koylu'&&!u.dead&&!u.wnd&&u.st!=='sleep');
 let n=0,arm=0,sh=0;const m=fxm('milis');
 for(const u of pool){
  if(room<=0)break;
  let atkB=0,ab=0,hp=30;
  if(S.res.silah>=1){S.res.silah--;atkB+=6;arm++;}
  if(S.res.zirh>=1){S.res.zirh--;ab=2;hp+=20;sh++;}
  const r=u.hp/u.mhp;
  u.t='milis';u.wasJob=u.job;u.job=null;u.st='idle';u.path=null;u.tg=0;u.carry=0;u.wb=0;u.sb=0;
  u.atkB=(3+atkB)*m-3;u.ab=ab;u.mhp=Math.round(hp*m);u.hp=Math.max(1,Math.round(u.mhp*r));
  room--;n++;
 }
 if(n)log('🛡 '+n+' köylü milis olarak silah başına çağrıldı'+(arm||sh?' ('+arm+' silahlı, '+sh+' kalkanlı)':' (silah/zırh yok: sade halk gücünde)')+'.');
 else log('Çağrılacak boşta köylü yok.');
 return n;
}
function releaseMilitia(why){
 const ms=militia();if(!ms.length)return;
 for(const u of ms){u.t='koylu';u.job=u.wasJob||null;u.st='idle';u.path=null;u.tg=0;u.atkB=0;u.ab=0;u.mhp=30;u.hp=Math.min(u.hp,30);u.gx=undefined;}
 log('🏠 '+ms.length+' milis işine döndü'+(why?' ('+why+')':'')+'.');
}
{const _od=onDay;onDay=function(){_od();if(militia().length&&(!S.dyn||!heroOf('ruler')))releaseMilitia('hükümdar savaştan döndü');};}
{const _dh=dismissHero;dismissHero=function(w){_dh(w);if(w==='ruler')releaseMilitia('hükümdar saraya döndü');};}
function milPanel(){
 const ms=militia(),why=milReason();
 let h='<h4>🛡 Milis: '+ms.length+' / '+milCap()+'</h4>';
 h+='<div class="row">'+btn('📯 Milis çağır','callmil',null,!!why||ms.length>=milCap())+(ms.length?btn('🏠 Milisi dağıt','relmil'):'')+'<small>'+(why?'🔒 '+why:'Boştaki köylüler silahlanır. Demirhanede üretilmiş her 🗡 silah +saldırı, her 🛡 zırh +can ve +zırh verir (stok: 🗡'+Math.floor(S.res.silah)+' 🛡'+Math.floor(S.res.zirh)+').')+(S.techs.milis?'':'<br>Araştırma: Milis Kuvvetleri → daha güçlü ve daha çok milis.')+'</small></div>';
 return h;
}
