'use strict';
// ===== ÖĞRETİCİ: adım adım ipuçları =====
const TUT=[
 {t:'🧭 Haritada parmağını sürükleyerek gez (iki parmakla yakınlaştır). Ağaç, su ve açık arazi olan bir yer bul, sonra alttaki "Köyü Kur" düğmesine bas.',ok:()=>S.founded},
 {t:'🏠 "Yapı" menüsünden 2 Ev kur: evler nüfus kapasitesidir. Haritada yeri seç, ✔ Onayla\'ya bas.',ok:()=>countB('ev',false)>=2},
 {t:'⚒ "Halk" menüsünde ⚖ Otomatik dağıt\'a bas: köylüler çiftlik, odun ve taş işine yerleşir. + ve − ile elle de ayarlayabilirsin.',ok:()=>Object.values(S.jobs).reduce((a,b)=>a+(b||0),0)>=3},
 {t:'🪓 Ormanın yanına Oduncu Kulübesi, tarlaya Çiftlik kur. Kış 3 mevsim sonra gelir; üstteki sarı kutu kışlık odun ve yiyecek ihtiyacını hesaplar.',ok:()=>countB('oduncu',false)>=1&&countB('ciftlik',false)>=1},
 {t:'🏹 Haydut kamplarına yaklaşırsan önce haraç ister, vermezsen saldırırlar. Askerî menüden Kule ve Okçu Ocağı kur; ⚔ Ordu menüsünden asker eğit.',ok:()=>countB('kule',false)>=1},
 {t:'🌟 "İlerleme"den çağ atla, "Araştır"da teknoloji ağacını aç, Elçilik kurup komşu krallarla diplomasi yap. Geceleri halk uyur, yaralılar hastanede iyileşir. İyi oyunlar!',ok:()=>S.age>=1}
];
let tutI=0,tutT=0;
try{const v=localStorage.getItem('ky_tut');tutI=v==null?0:+v;}catch(e){}
function tutSave(){try{localStorage.setItem('ky_tut',String(tutI));}catch(e){}}
function tutSkip(){tutI=TUT.length;tutSave();tutRender();}
function tutNext(){tutI++;tutSave();tutRender();}
function tutRender(){
 const el=$('tut');if(!el)return;
 if(tutI>=TUT.length||!S||UI.tab||(UI.sel&&UI.sel.kind==='b')){el.style.display='none';return;}
 el.innerHTML='<div>'+TUT[tutI].t+'</div><div class="tb2">'+btn('Anladım','tutok')+btn('Öğreticiyi kapat','tutskip')+'<small>'+(tutI+1)+'/'+TUT.length+'</small></div>';
 el.style.display='block';
}
(function(){
 const _h=updHud;
 updHud=function(){
  _h();
  if(tutI<TUT.length&&S){
   tutT-=0.3;
   if(tutT<=0){tutT=0.6;try{if(TUT[tutI].ok()){tutI++;tutSave();}}catch(e){}tutRender();}
   const el=$('tut');tutRender();
  }
 };
})();
