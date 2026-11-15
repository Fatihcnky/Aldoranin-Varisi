'use strict';
// ===== SES VE MÜZİK (WebAudio ile üretilir, dosya gerekmez) =====
const AUD={ctx:null,muted:false,master:null,mus:null,sfxG:null,last:{},mood:'calm',nextNote:0};
try{AUD.muted=localStorage.getItem('ky_mute')==='1';}catch(e){}
function audInit(){
 if(AUD.ctx){if(AUD.ctx.state==='suspended')AUD.ctx.resume();return;}
 const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
 try{
  AUD.ctx=new C();
  AUD.master=AUD.ctx.createGain();AUD.master.gain.value=AUD.muted?0:0.9;AUD.master.connect(AUD.ctx.destination);
  AUD.sfxG=AUD.ctx.createGain();AUD.sfxG.gain.value=0.5;AUD.sfxG.connect(AUD.master);
  AUD.mus=AUD.ctx.createGain();AUD.mus.gain.value=0.16;const lp=AUD.ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1800;AUD.mus.connect(lp);lp.connect(AUD.master);
  // basit yankı
  const d=AUD.ctx.createDelay(1);d.delayTime.value=0.33;const fb=AUD.ctx.createGain();fb.gain.value=0.22;d.connect(fb);fb.connect(d);lp.connect(d);d.connect(AUD.master);
 }catch(e){AUD.ctx=null;}
}
function audToggle(){
 AUD.muted=!AUD.muted;try{localStorage.setItem('ky_mute',AUD.muted?'1':'0');}catch(e){}
 audInit();if(AUD.master)AUD.master.gain.value=AUD.muted?0:0.9;
}
function tone(f,t0,dur,type,vol,dest,slide){
 const c=AUD.ctx;if(!c)return;
 const o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t0);
 if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,slide),t0+dur);
 g.gain.setValueAtTime(0.0001,t0);g.gain.exponentialRampToValueAtTime(vol,t0+(dest===AUD.mus?Math.min(0.6,dur/3):Math.min(0.03,dur/3)));g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
 o.connect(g);g.connect(dest||AUD.sfxG);o.start(t0);o.stop(t0+dur+0.05);
}
function noise(t0,dur,vol,freq){
 const c=AUD.ctx;if(!c)return;
 const n=Math.floor(c.sampleRate*dur),buf=c.createBuffer(1,n,c.sampleRate),d=buf.getChannelData(0);
 for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);
 const s=c.createBufferSource();s.buffer=buf;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=freq||1200;
 const g=c.createGain();g.gain.value=vol;s.connect(f);f.connect(g);g.connect(AUD.sfxG);s.start(t0);
}
function sfx(n){
 if(AUD.muted||!AUD.ctx)return;
 const c=AUD.ctx,t=c.currentTime,lim={click:0.05,hit:0.12,arrow:0.12,coin:0.2,build:0.3,death:0.25,horn:2,bell:0.5,fan:2,hurt:0.4,heal:0.6};
 if(AUD.last[n]&&t-AUD.last[n]<(lim[n]||0.1))return;AUD.last[n]=t;
 switch(n){
  case 'click':tone(520,t,0.06,'triangle',0.25);break;
  case 'build':tone(180,t,0.09,'square',0.18);noise(t,0.08,0.3,900);tone(260,t+0.1,0.09,'square',0.15);break;
  case 'hit':noise(t,0.09,0.55,700);tone(120,t,0.08,'sawtooth',0.15,null,60);break;
  case 'arrow':noise(t,0.12,0.25,3000);tone(900,t,0.1,'sine',0.08,null,300);break;
  case 'coin':tone(1318,t,0.08,'sine',0.2);tone(1760,t+0.07,0.14,'sine',0.2);break;
  case 'death':tone(200,t,0.35,'sawtooth',0.2,null,60);break;
  case 'hurt':tone(330,t,0.25,'triangle',0.25,null,180);break;
  case 'heal':tone(660,t,0.1,'sine',0.2);tone(880,t+0.1,0.16,'sine',0.2);break;
  case 'horn':tone(147,t,0.9,'sawtooth',0.22);tone(147*1.5,t,0.9,'sawtooth',0.12);tone(196,t+1,0.9,'sawtooth',0.22);tone(196*1.5,t+1,0.9,'sawtooth',0.12);break;
  case 'bell':tone(880,t,1.2,'sine',0.25);tone(1320,t,0.9,'sine',0.12);break;
  case 'fan':[523,659,784,1047].forEach((f,i)=>tone(f,t+i*0.14,0.4,'triangle',0.22));break;
 }
}
// ---- üretken müzik: mevsime ve tehlikeye göre ----
const SCALES={calm:[0,2,4,7,9],tense:[0,3,5,7,10],winter:[0,2,3,7,8]};
const ROOT={calm:196,tense:147,winter:174.6};
function audMood(){
 if(!S)return'calm';
 if(S.units.some(u=>u.team==='b'&&u.st==='raid'&&!u.dead))return'tense';
 return seas()===3?'winter':'calm';
}
function audMusic(){
 if(!AUD.ctx||AUD.muted||AUD.ctx.state!=='running')return;
 const c=AUD.ctx,t=c.currentTime;
 if(t<AUD.nextNote)return;
 const m=audMood(),sc=SCALES[m],r=ROOT[m];
 const deg=sc[Math.floor(Math.random()*sc.length)],oct=Math.random()<0.3?2:1;
 const f=r*Math.pow(2,deg/12)*oct;
 const len=m==='tense'?0.9:2.2;
 tone(f,t+0.02,len,m==='tense'?'sawtooth':'triangle',m==='tense'?0.25:0.4,AUD.mus);
 if(Math.random()<0.35)tone(f*1.5,t+0.25,len,'sine',0.25,AUD.mus);
 AUD.nextNote=t+(m==='tense'?0.55+Math.random()*0.5:1.2+Math.random()*1.8);
}
setInterval(()=>{try{audMusic();}catch(e){}},250);
['pointerdown','keydown','touchstart'].forEach(ev=>document.addEventListener(ev,audInit,{passive:true}));
// ---- oyun olaylarına bağlan ----
(function hook(){
 const _ul=uiLog;
 uiLog=function(t,x,y){
  _ul(t,x,y);
  if(/BASKIN|saldırıyor|saldırıya|Savaş ilan/i.test(t))sfx('horn');
  else if(/hazır|tamamlandı|taşındı|kuruldu/i.test(t))sfx('build');
  else if(/yaralandı/.test(t))sfx('hurt');
  else if(/iyileşti/.test(t))sfx('heal');
  else if(/yıkıldı|ganimet|Ganimet|ödendi/.test(t))sfx('coin');
  else if(/öldü|kaybı|terk/.test(t))sfx('death');
  else if(/yanıyor|🔥/.test(t))sfx('horn');
  else sfx('bell');
 };
 const _sm=showModal;showModal=function(a,b,c){sfx('bell');return _sm(a,b,c);};
 const _h=hit;hit=function(a,e){_h(a,e);const dx=Math.abs(a.x-S.cam.x),dy=Math.abs(a.y-S.cam.y);if(dx<12&&dy<9&&(a.team==='p'||a.team==='a'||e.team==='p'))sfx(UT[a.t]&&UT[a.t].ranged?'arrow':'hit');};
})();
document.addEventListener('pointerup',e=>{if(e.target.closest&&e.target.closest('[data-a]'))sfx('click');},true);
