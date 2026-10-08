
// ===== Utilities =====
const $=s=>document.querySelector(s), R=(a,b)=>a+Math.random()*(b-a), RI=(a,b)=>Math.floor(R(a,b+1)), PK=a=>a[RI(0,a.length-1)], CL=(v,a,b)=>Math.max(a,Math.min(b,v));
function N(v){const s=v<0?'-':'',a=Math.abs(v);if(a>=1e12)return s+'₦'+(a/1e12).toFixed(2)+' trillion';if(a>=1e9)return s+'₦'+(a/1e9).toFixed(2)+' billion';if(a>=1e6)return s+'₦'+(a/1e6).toFixed(2)+' million';return s+'₦'+Math.round(a).toLocaleString('en-NG')}
const SK='ndl_save_v1';let S=null,ST=JSON.parse(localStorage.getItem('ndl_set')||'{"snd":1,"theme":"dark"}'),tab='today',selA='NNB';
document.documentElement.dataset.theme=ST.theme;
// ===== Audio (WebAudio, no files) =====
let AC;function beep(f=520,d=.08){if(!ST.snd)return;try{AC=AC||new AudioContext();const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}}
function toast(t){const d=document.createElement('div');d.textContent=t;$('#toast').append(d);setTimeout(()=>d.remove(),3200);beep(660)}
