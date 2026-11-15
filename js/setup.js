'use strict';
// ===== KARAKTER OLUŞTURMA =====
const SET={female:false,trait:'bilge',cb:null};
function renderSetup(){
 const el=$('setup');
 const tr=Object.keys(TRAITS).map(k=>'<button class="tr'+(SET.trait===k?' on':'')+'" data-a="strait" data-v="'+k+'"><b>'+TRAITS[k].n+'</b><br><small>'+TRAITS[k].d+'</small></button>').join('');
 el.querySelector('.tl').innerHTML=tr;
 el.querySelector('.gl').innerHTML='<button class="tr'+(!SET.female?' on':'')+'" data-a="sgen" data-v="m">🤴 Lord (erkek)</button><button class="tr'+(SET.female?' on':'')+'" data-a="sgen" data-v="f">👸 Leydi (kadın)</button>';
}
function newGameSetup(after){
 newGame();
 UI.modalOpen=true;
 SET.cb=after||null;SET.female=S.dyn.ruler.female;SET.trait=S.dyn.ruler.trait;
 $('sName').value=S.dyn.ruler.name;$('sHouse').value=S.dyn.house;
 renderSetup();$('setup').style.display='flex';
}
function setupGo(){
 const n=($('sName').value||'').trim().slice(0,14),h=($('sHouse').value||'').trim().slice(0,16);
 const r=S.dyn.ruler;
 if(n)r.name=n;r.female=SET.female;r.trait=SET.trait;if(h)S.dyn.house=h;
 $('setup').style.display='none';UI.modalOpen=false;
 const cb=SET.cb;SET.cb=null;if(cb)cb();
}
(function(){
 const _a=act;
 act=function(a,v,w,el){
  if(a==='sgen'){SET.female=v==='f';renderSetup();return;}
  if(a==='strait'){SET.trait=v;renderSetup();return;}
  if(a==='setupgo'){setupGo();return;}
  return _a(a,v,w,el);
 };
})();
