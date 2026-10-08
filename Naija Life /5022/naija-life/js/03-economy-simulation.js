// ===== State & economy =====
function newGame(o){const e=o.edu;S={name:o.name,state:o.state,gender:o.g,trait:o.trait,day:1,slot:0,cash:85e3,bank:120e3,debt:0,credit:600,energy:82,rep:5,pop:0,community:0,edu:e,job:e>=2?3:1,sk:{fin:1,biz:1,pol:1,net:1},biz:[],props:[],hold:{},cost:{},px:{},hist:{},titles:[],pol:0,party:null,approval:50,news:[],ach:{},nwh:[],best:0,crashes:0,viral:0,hitZero:false,posts:0,
econ:{infl:18,rate:22,fuel:850,food:100,house:100,unemp:30,gdp:2.6,conf:50,oil:75,debtgdp:38},log:[],fx:1500};
for(const k in ASSETS){S.px[k]=ASSETS[k][1];S.hist[k]=Array(30).fill(ASSETS[k][1])}
S.nwh=Array(30).fill(nw());addNews('🟢 ECONOMY','Welcome to your new life. Inflation is high; plan carefully.');save();render()}
function hv(){let v=0;for(const k in S.hold)v+=S.hold[k]*S.px[k];return v}
function nw(){return S.cash+S.bank-S.debt+hv()+S.props.reduce((a,p)=>a+PROP[p.t][1]*S.econ.house/100*(window.cProp?cProp():1),0)+S.biz.reduce((a,b)=>a+BIZ[b.t][1]*(1+b.lvl*.5),0)}
function addNews(tag,t){S.news.unshift({tag,t,d:S.day});S.news.length=Math.min(S.news.length,40)}
function pay(n){if(S.cash<n){toast('Not enough cash. Withdraw from your bank first.');return false}S.cash-=n;return true}
function income(){const j=JOBS[S.job][1];return j*(1+S.sk.biz*.02)}
// ===== Daily simulation =====
function endDay(){const E=S.econ;
// macro drift – interconnected
E.oil=CL(E.oil+R(-4,4),30,140);E.infl=CL(E.infl+R(-.4,.4)+(E.fuel-850)/8000+(S.fx-1500)/60000-(E.rate-E.infl)*.01,4,60);
E.fuel=CL(E.fuel*(1+(E.oil-75)/12000+R(-.004,.004)),400,3000);E.food=E.food*(1+E.infl/36500+R(-.001,.002));E.house=E.house*(1+E.infl/50000+R(-.002,.003));
E.conf=CL(E.conf+R(-2,2)-(E.infl-18)*.03+(S.approval-50)*.01,10,90);E.unemp=CL(E.unemp+(50-E.conf)*.01+R(-.2,.2),10,55);E.gdp=CL(E.gdp+(E.conf-50)*.003+R(-.1,.1),-4,9);
S.fx=CL(S.fx*(1+(E.infl-18)/30000+(75-E.oil)/20000+R(-.01,.012)),600,9000);
// markets
for(const k in ASSETS){let v=ASSETS[k][2],d=R(-v,v)+(E.conf-50)*.0002;if(k==='USD')d=(S.fx/S.px.USD-1);S.px[k]=Math.max(10,S.px[k]*(1+d));const h=S.hist[k];h.push(S.px[k]);if(h.length>60)h.shift()}
// salary monthly, rent, loan interest, bank interest
if(S.day%30==0){const sal=income()*(1-.07);S.bank+=sal;if(sal)toast('Salary received: '+N(sal));if(S.pol>0)S.bank+=POL[S.pol][3]*.01;
 S.bank+=S.bank*(E.rate*.35/1200);if(S.debt>0){const i=S.debt*(E.rate+6)/1200;S.debt+=i;}}
// living costs scale with inflation
let live=S.pol*200*E.food/100;S.cash-=live;
// businesses
let bp=0;S.biz.forEach(b=>{const d=BIZ[b.t],rev=d[2]*1.8*(1+b.lvl*.6)*(E.conf/50)*(1+b.mkt*.1)*(1+S.sk.biz*.03)*R(.7,1.3),exp=d[2]*1.2*(1+b.lvl*.6)*(1+(E.infl-18)/100)*(1+b.staff*.02)+b.staff*2500*E.food/100;b.profit=rev-exp;bp+=b.profit;b.rep=CL(b.rep+(b.profit>0?.1:-.2),0,100)});
S.cash+=bp;S.props.forEach(p=>S.cash+=PROP[p.t][2]*S.econ.house/100*(window.cProp?cProp():1)*(E.conf/50)*(p.rented?1:0));
if(S.biz.length&&bp<0&&Math.random()<.05){toast('A business is losing money. Check expenses.')}
if(S.cash<0){S.bank+=S.cash;S.cash=0}if(S.bank<0){S.debt-=S.bank;S.bank=0;S.credit=CL(S.credit-5,300,850)}
if(S.cash+S.bank<500&&nw()<5e5)S.hitZero=true;

if(S.pol>=5)S.approval=CL(S.approval+(E.gdp-2)*.8-(E.infl-15)*.15-(E.unemp-30)*.1+R(-1.5,1.5),0,100);else S.approval=CL(S.approval+(50-E.unemp)*.02+R(-1,1),0,100);
rndEvent();S.day++;S.slot=0;S.nwh.push(nw());if(S.nwh.length>90)S.nwh.shift();S.best=Math.max(S.best,nw());
if(S.day%7==0)addNews('🟡 SOCIETY',PK(['Transport union threatens strike over fuel cost.','Traders say market prices rose again this week.','Power supply improves in several states.','Youths launch tech hub in '+PK(STATES)+'.']));
checkAch();save();render()}
function rndEvent(){if(Math.random()>.45)return;const E=S.econ,ev=[
['🟢 BUSINESS','A client offers you a small contract: +₦'+RI(30,150)*1e3,()=>S.cash+=RI(30,150)*1e3],
['🔴 POWER','Grid collapse – you spend on generator fuel.',()=>S.cash-=RI(5,20)*1e3],
['🟢 JOB','A friend refers you for an extra gig: +₦40,000',()=>S.cash+=40e3],
['🔴 FUEL','Fuel shortage. Pump price jumps.',()=>E.fuel*=1.08],
['🟢 INHERITANCE','A relative sends ₦'+RI(50,300)*1e3+' for family support.',()=>S.bank+=RI(50,300)*1e3],
['🔴 MARKETS','Stock market crash! Shares fall sharply.',()=>{for(const k of['NNB','NTL','GLD','NEN','PAY','NCN'])S.px[k]*=R(.7,.88);S.crashes++}],
['🟢 MARKETS','Investor boom lifts equities.',()=>{for(const k of['NNB','NTL','GLD','NEN','PAY'])S.px[k]*=R(1.05,1.15)}],
['🔴 CURRENCY','Naira slides on forex scarcity.',()=>S.fx*=1.07],
['🟢 OIL','Oil price spikes; government revenue up.',()=>E.oil+=12],
['🔴 HEALTH','Malaria strikes. Hospital bill.',()=>{S.cash-=RI(10,40)*1e3;S.energy-=15}],
['🟡 POLITICS','Public debate on subsidy removal heats up.',()=>S.approval-=2],
['🟢 PROPERTY','Property boom in '+PK(STATES)+'.',()=>E.house*=1.04],
['🔴 FLOOD','Flooding damages stock in your area.',()=>S.biz.forEach(b=>b.rep-=3)]];
const e=PK(ev);e[2]();addNews(e[0],e[1]);if(e[0].startsWith('🔴'))toast(e[1])}
function checkAch(){ACH.forEach(a=>{if(!S.ach[a[0]]&&a[2](S)){S.ach[a[0]]=S.day;toast('🏆 Achievement: '+a[1]);beep(880,.2)}})}
