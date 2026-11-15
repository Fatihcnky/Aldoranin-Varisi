'use strict';
// ===== HİKAYE: Aldora'nın Son Varisi =====
// Görevlere ek olarak, ilerlemeye bağlı anlatı sahneleri ve seçimler.
const BEATS=[
 {id:'p0',ok:()=>S.founded,t:'📜 Aldora Küller İçinde',x:'Üç ay önce, Aldora Krallığı\'nın başkenti bir gecede düştü. Tahtı gasp eden Lord Maldric, kralın bütün soyunu avlattı. Ateşin arasından senin küçük kafilen sağ çıkabildi: birkaç aile, bir ihtiyar danışman ve babanın mühürlü yüzüğü.\nİhtiyar Bertram eğilip fısıldıyor: "Ayakta kalan son varis sensin. Bu toprakta bir köy kur, güçlen... ve bir gün tacını geri al."'},
 {id:'p1',ok:()=>S.founded&&S.day>=4,t:'🧓 Bertram\'ın Öğüdü',x:'Danışman Bertram ocağın başında konuşuyor:\n"Krallıklar kılıçla değil, ambarla ayakta kalır. Önce kışı atlat. Sonra surlar, sonra ittifaklar. Maldric\'in casusları her yerde; acele edersen gözüne batarsın."',b:[{t:'Dinledim'}]},
 {id:'w1',ok:()=>S.day>=YEARD,t:'❄ İlk Kışın Ardından',x:'Karlar eridi. Köylüler seni artık yalnızca bir sürgün değil, bir lider olarak görüyor. Bir kervan ihtiyarı Bertram\'a bir mektup bırakıp gitti:\n"Maldric, kayıp varisi arıyor. Sürgündeki bir köyün adını duydu."',b:[{t:'Sessiz kal (halk huzurlu)',fn:()=>{S.happy=Math.min(100,S.happy+3);}},{t:'Gözcü tut (40 💰)',fn:()=>{if(S.res.gold>=40){S.res.gold-=40;log('👁 Yeni gözcüler sınırı izliyor.');}else S.happy=Math.max(0,S.happy-2);}}]},
 {id:'c1',ok:()=>(S.stats.camps||0)>=1,t:'🗡 Mühürlü Mektup',x:'Yıkılan haydut kampının reisinin üzerinden kanlı bir mühür ve mektup çıktı: "Köyü aç bırak, ekinleri yak. — M." Bu haydutlar sıradan eşkıyalar değil; Maldric\'in gizli paralı askerleri.\nHalk ilk kez bu savaşın sadece hayatta kalmak olmadığını anlıyor.',b:[{t:'Intikam yemini et',fn:()=>{addRes('gold',60);S.happy=Math.min(100,S.happy+4);}}]},
 {id:'a1',ok:()=>S.age>=1,t:'⚔ Sadık Şövalye',x:'Bronz çağının ilk günlerinde, kapıya yaralı bir atlı dayanıyor: Sör Aldric, babanın eski muhafızı. "Efendim... yaşıyorsunuz!" diye diz çöküyor. Yanında üç sadık asker getirmiş.',b:[{t:'Hoş geldin Sör Aldric',fn:()=>{const tc=mainTC();if(tc)for(let i=0;i<3;i++){const p=spawnPos(tc);mkUnit('kilic','p',p.x,p.y,{});}log('⚔ Sör Aldric ve üç asker saflarına katıldı.');}}]},
 {id:'k1',ok:()=>S.kings.some(k=>k.pact),t:'🕊 Komşuların Gözü',x:'Elçilik sayesinde komşu krallıklarla yazışıyorsun. Bertram uyarıyor: "Maldric onlara da elçi gönderdi. Kimi korkutacak, kimi satın alacak. Dostlarını hediyelerle ve sözünle yanında tut."',b:[{t:'Anladım'}]},
 {id:'r2',ok:()=>S.rank>=2,t:'🦅 Maldric\'in Elçisi',x:'Şehir ilan edince Maldric\'in elçisi kapıda: "Lord Maldric büyük gönüllüdür. Tacı bırakıp sessiz bir ömür sürmeni ister. Karşılığında 400 altın ve dokunulmazlık."',b:[{t:'Reddet — "Aldora\'nın varisi pazarlık yapmaz"',fn:()=>{S.sf.refused=1;S.happy=Math.min(100,S.happy+8);log('🔥 Elçi öfkeyle ayrıldı. Maldric\'in gazabı yaklaşıyor.');S.raidAt=Math.min(S.raidAt,S.day+3);}},{t:'Kabul et (+400 💰, halk küsüyor)',fn:()=>{addRes('gold',400);S.happy=Math.max(0,S.happy-18);S.sf.bribed=1;log('💰 Altın aldın ama halkın gözünde değerin düştü.');}}]},
 {id:'a3',ok:()=>S.age>=3,t:'🌑 Karanlık Bir Haber',x:'Orta Çağ\'a girdin ve gece nöbetçileri dağlardan gelen meşaleleri sayıyor. Casuslar fısıldıyor: "Maldric büyük bir ordu topluyor. Hedefi Aldora\'yı geri alan değil, onu doğuran köy."\nSurlarını sağlamlaştır, kapıları kapat; kapılar yalnızca halkın için açılır.',b:[{t:'Hazırlan'}]},
 {id:'l3',ok:()=>S.rank>=3,t:'🏰 Aldora\'nın Halkı',x:'Lordluk ilan edilince haber Aldora\'ya ulaştı. Maldric\'in zulmünden kaçan yüzlerce kişi yollara düştü. Dağın ardından uzun bir kafile geliyor: "Tacın sahibi yaşıyor!"',b:[{t:'Kapıları aç',fn:()=>{const tc=mainTC();if(tc){for(let i=0;i<6;i++){const p=spawnPos(tc);mkUnit('koylu','p',p.x,p.y,{});}}S.happy=Math.min(100,S.happy+6);log('👨‍👩‍👧 Aldora\'dan 6 kişi köye sığındı.');}}]},
 {id:'b4',ok:()=>S.age>=4,t:'💥 Barut Çağı',x:'Ateş tozu savaşın yüzünü değiştiriyor. Bertram yaşlı gözleriyle toplara bakıyor: "Babanın surları kılıçlara karşı yapılmıştı. Maldric\'in kaleleri şimdi senin toplarının önünde duracak."',b:[{t:'Toplar hazır'}]},
 {id:'f5',ok:()=>S.rank>=4,t:'👑 Taç Senin',x:'Halk meydanda toplandı. Bertram, gözyaşları içinde babanın yüzüğünü uzatıyor: "Aldora ölmedi... Aldora sensin."\nMaldric\'in gölgesi toprağını terk etti; haydut yuvaları sönüyor. Artık sen hem bir hükümdar hem de yeni bir hanedanın atasısın.\nKrallığın yolu bitti, ama krallığın hikayesi yeni başlıyor.',b:[{t:'Sonsuza dek yaşasın krallık!',fn:()=>{addRes('gold',500);S.happy=Math.min(100,S.happy+10);}}]}
];
function storyCheck(){
 if(!S||!S.founded)return;
 S.sf=S.sf||{};
 for(const b of BEATS){
  if(S.sf[b.id]||!b.ok())continue;
  S.sf[b.id]=1;
  showModal(b.t,b.x,b.b);
  break;
 }
}
(function(){
 const _od=onDay;onDay=function(){_od.apply(null,arguments);try{storyCheck();}catch(e){}};
 const _fv=foundVillage;foundVillage=function(x,y){const r=_fv(x,y);if(r)try{storyCheck();}catch(e){}return r;};
})();
