// ===== Actions =====
const A={
tab(e){tab=e.dataset.k;render();scrollTo(0,0)},sel(e){selA=e.dataset.k;render()},
act(e){const a=ACTS().filter(a=>!a.c||a.c())[+e.dataset.i];if(S.energy<a.e)return;S.energy-=a.e;beep(500);a.f()},
promo(){const n=S.job+1;if(S.sk.biz+S.sk.fin>=n*1.8+1&&Math.random()<.7){S.job=n;S.rep+=2;toast('Promoted to '+JOBS[n][0]+'!')}else toast('Not ready yet. Build skills and try again.');save();render()},
dep(e){const v=S.cash*+e.dataset.f;S.cash-=v;S.bank+=v;save();render()},wd(e){const v=S.bank*+e.dataset.f;S.bank-=v;S.cash+=v;save();render()},
loan(e){const v=Math.max(0,+e.dataset.v);if(v<1)return toast('Loan limit reached. Improve your credit.');S.debt+=v;S.cash+=v;S.credit=CL(S.credit-8,300,850);toast('Borrowed '+N(v));save();render()},
repay(e){const v=Math.min(S.debt,S.cash*+e.dataset.f);S.cash-=v;S.debt-=v;if(v>0)S.credit=CL(S.credit+Math.ceil(v/5e4)+2,300,850);save();render()},
buy(e){const v=+e.dataset.v;if(!pay(v))return;const k=selA;S.hold[k]=(S.hold[k]||0)+v/S.px[k];beep(700);save();render()},
sell(e){const k=selA,q=(S.hold[k]||0)*+e.dataset.f;S.hold[k]-=q;S.cash+=q*S.px[k];beep(400);save();render()},
bnew(e){const i=+e.dataset.i;if(!pay(BIZ[i][1]))return;S.biz.push({t:i,lvl:0,staff:1,mkt:0,rep:50,profit:0});S.rep+=1;toast('Business opened!');checkAch();save();render()},
bup(e){const b=S.biz[+e.dataset.i],w=e.dataset.w,d=BIZ[b.t],c=w=='lvl'?d[1]*(b.lvl+1)*.6:w=='staff'?3e4:d[2]*10;if(!pay(c))return;b[w]++;save();render()},
bsell(e){const i=+e.dataset.i;confirmBox('Sell this business?',()=>{S.cash+=BIZ[S.biz[i].t][1]*(1+S.biz[i].lvl*.5)*.7;S.biz.splice(i,1);save();render()})},
pbuy(e){const i=+e.dataset.i;if(!pay(PROP[i][1]*S.econ.house/100*(window.cProp?cProp():1)))return;S.props.push({t:i,rented:true});toast('Property purchased!');checkAch();save();render()},
psell(e){const p=S.props.splice(+e.dataset.i,1)[0];S.cash+=PROP[p.t][1]*S.econ.house/100*(window.cProp?cProp():1)*.95;save();render()},
run(){const i=S.pol+1,n=POL[i];if(S.rep<n[1]||S.pop<n[2]||!pay(n[3])){return toast('Requirements not met. Build rep, popularity and funds.')}
 const p=CL(.35+(S.pop-n[2])*.01+(S.rep-n[1])*.005+(S.approval-50)*.004+S.sk.pol*.01-i*.01,.1,.9),won=Math.random()<p;
 modal(won?`<h3>🎉 Victory!</h3><p>You won ${n[0]} with ${(50+p*40).toFixed(1)}% of the vote.</p>`:`<h3>Defeat</h3><p>You lost the ${n[0]} race. Rebuild support and try again.</p>`);if(won){S.pol=i;S.rep+=5;S.approval=60;beep(900,.3);addNews('🔴 POLITICS',S.name+' sworn in as '+n[0]);checkAch()}else S.pop*=.7;save();render()},
pol(e){const E=S.econ,k=e.dataset.k;({sub:()=>{S.approval+=6;E.debtgdp+=2;E.fuel*=.97},edu:()=>{if(!pay(5e8))return;E.gdp+=.4;S.approval+=1;E.debtgdp+=.5},inf:()=>{E.unemp-=1.5;E.gdp+=.3;E.debtgdp+=1.2;S.approval+=2},tax:()=>{E.debtgdp-=2;E.conf-=4;S.approval-=4},rate:()=>{E.rate-=2;E.gdp+=.3;E.infl+=1.5},hike:()=>{E.rate+=2;E.infl-=1.5;E.gdp-=.3;S.approval-=2}})[k]();toast('Policy enacted. Watch the consequences.');save();render()},
title(e){const t=TITLES[+e.dataset.i];if(nw()>=t[1]&&S.rep>=t[2]&&S.community>=t[3]){S.titles.push(t[0]);S.rep+=10;S.pop+=8;toast('👑 You are now '+t[0]+'!');beep(900,.3);checkAch();save();render()}else toast('Requirements not met for '+t[0])},
save(){save();toast('Game saved')},snd(){ST.snd=!ST.snd;save();render()},theme(){ST.theme=ST.theme=='dark'?'light':'dark';document.documentElement.dataset.theme=ST.theme;save();render()},
exp(){const b=new Blob([JSON.stringify(S)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='naija-life-save.json';a.click()},
imp(){const i=document.createElement('input');i.type='file';i.accept='.json';i.onchange=()=>{const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!d.econ||!d.px)throw 0;S=d;save();tab='today';toast('Save imported');render()}catch(x){toast('Invalid save file')}};r.readAsText(i.files[0])};i.click()},
reset(){confirmBox('Delete your save and start over? This cannot be undone.',()=>{localStorage.removeItem(SK);S=null;render()})},
sum(){summary()},menu(){S=null;menu()},close(){modal()},yes(){const f=window._cf;modal();f&&f()},
cred(){modal(credits())},copy(){navigator.clipboard.writeText('0x1B7f1D6AFa15979C40564e7cc66084082c7483C1').then(()=>toast('✓ Address copied!'),()=>toast('Select and copy the address manually'))},
cont(){try{S=JSON.parse(localStorage.getItem(SK));tab='today';render()}catch(x){toast('Save is corrupted')}},
new(){modal(`<h3>New life</h3><input id="nm" placeholder="Your name" maxlength="24"><select id="gd"><option>Male</option><option>Female</option></select><select id="stt">${STATES.map(s=>`<option>${s}</option>`).join('')}</select><select id="ed">${EDU.map((e,i)=>`<option value="${i}">${e[0]}</option>`).join('')}</select><select id="tr"><option>Hustler</option><option>Hardworking</option><option>Charismatic</option><option>Cautious</option></select><button class="btn p" data-a="start">Begin Day 1</button>`)},
start(){const o={name:$('#nm').value.trim()||'Chidi',g:$('#gd').value,state:$('#stt').value,edu:+$('#ed').value,trait:$('#tr').value};modal();tab='today';newGame(o)}};
document.addEventListener('click',e=>{const t=e.target.closest('[data-a]');if(t&&A[t.dataset.a]){beep(420,.04);A[t.dataset.a](t)}});
menu();
