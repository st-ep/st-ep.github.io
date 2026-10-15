/* CV strata: the CV painted as a Monet chalk cliff at Etretat. Layers are chapters; papers, talks and awards are artifacts. */
(function(){
function mount(wrap){
const DP=Math.min(2,window.devicePixelRatio||1),W=680,H=812,cv=document.createElement('canvas'),lab=document.createElement('div');cv.setAttribute('aria-hidden','true');lab.className='strata-lab';lab.setAttribute('aria-hidden','true');wrap.appendChild(cv);wrap.appendChild(lab);cv.width=W*DP;cv.height=H*DP;const x=cv.getContext('2d');
let sd=11;const R=()=>{sd|=0;sd=sd+0x6D2B79F5|0;let t=Math.imul(sd^sd>>>15,1|sd);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
const pk=a=>a[Math.floor(R()*a.length)],cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const X0=46,SEA=790;
const B=[{y0:62,y1:198,p:['#F2DDAA','#EBCF94','#F6E6BE','#E2C283','#F0D6A0'],t:'UC Berkeley',s:'Ph.D. Robotics, 2026 to present',st:'World models for robots that handle soft, unruly matter.'},
{y0:198,y1:470,p:['#E8C9A0','#DDB98C','#EFD5B0','#D6AE80','#E4C298'],t:'UT Austin',s:'M.S. Engineering, 2024 to 2026',st:'Operators learned on point clouds, then the weak form.'},
{y0:470,y1:SEA+20,p:['#EFE6D2','#E6D9BE','#F3ECDD','#DCCBA8','#E9DCC2'],t:'Moscow State University',s:'B.S. Geology with Honours, 2019 to 2024',st:'Sand, and the moment it yields.'}];
const LENS=[{cx:470,cy:612,rx:125,ry:13,p:['#EEDDE0','#E2CBD0','#F4E9EA','#D9C2C8'],tx:360,ty:590,tag:'Gazprom Geotechnology, 2023: salt mechanics',tip:'Chief Expert, Geology Department, Gazprom Geotechnology, summer 2023. Salt mechanics tests, Abaqus models, bischofite site report.'},
{cx:470,cy:722,rx:120,ry:13,p:['#D9B98A','#CFA874','#E0C39A'],tx:380,ty:740,tag:'Kurgan, 2021: field and lab technician',tip:'Geological technician, Kurgan, 2021. Soil lab tests, field geology, and a Python tool that automated direct simple-shear test processing.'}];
const AR=[
['P',420,162,'FORM, 2026','FORM: Robot Manipulation through Direct Material Law Identification. Lead author. arXiv 2609.38105.'],
['N',420,118,'Now: real-robot experiments','Hardware experiments with RGB-D capture and wrist force-torque sensing.'],
['T',380,228,'USNC-TAM, Pasadena, 2026','Oral: Learning Generalizable Neural Operators for Inverse Problems. USNC-TAM26, Pasadena, June 2026.'],
['T',520,262,'EMI, Boulder, 2026','Oral: Toward Foundation-Ready Operator Surrogates in Mechanics. EMI 2026, Boulder, June 2026.'],
['P',380,302,'Physically Viable World Models, 2026','Physically Viable World Models: A Case for Query-Conditioned Embodied AI. Co-first author. arXiv 2605.30542.'],
['P',110,318,'Operators for control, 2026','Neural Operators for Multi-Task Control and Adaptation. arXiv 2604.03449.'],
['P',380,360,'Inverse operators, 2025','Learning Generalizable Neural Operators for Inverse Problems. arXiv 2512.18120.'],
['T',120,380,'MaGIC, Madison, 2025','Poster: SetONet. Machine-Ground Interaction Consortium, UW-Madison, September 2025.'],
['T',500,410,'USNCCM18, Chicago, 2025','Oral: Robust Operator Learning via the Basis-to-Basis Framework. USNCCM18, Chicago, July 2025.'],
['P',300,432,'SetONet, 2025','SetONet: A Set-Based Operator Network for Solving PDEs with Variable-Input Sampling. Lead author. arXiv 2505.04738.'],
['A',90,450,'Graduate Fellowship, 2024 to 2025','Cockrell School of Engineering and UT Austin Graduate School Fellowship, 2024 to 2025.'],
['T',480,502,'Lomonosov-2024, Moscow','Oral and poster, Lomonosov-2024 forum, Moscow, April 2024.'],
['P',392,522,'Thesis, 2024','B.S. thesis: deformation and strength properties of sand soil for deformation plasticity theory.'],
['P',500,540,'Sandy soil model, 2024','Identification of parameters and verification of a model of water-saturated sandy soil. GISS 2024.'],
['A',410,636,'Increased stipend, 2023 to 2024','Lomonosov MSU increased stipend for academic, research and community work, 2023 to 2024.'],
['A',110,576,'MCFAM grant, 2023','Grant, Moscow Center for Fundamental and Applied Mathematics, 2023.'],
['T',480,566,'VMSPPS, Divnomorskoe, 2023','Poster: nonlinear coupled consolidation model. VMSPPS 2023, Divnomorskoe, September 2023.'],
['P',110,604,'Nonlinear consolidation, 2023','Mathematical model of nonlinear soil consolidation and determination of its parameters. Sergeev Readings, 2023.'],
['P',110,632,'Consolidation model, 2023','Identification of parameters and verification of a nonlinear coupled consolidation model. VMSPPS 2023 proceedings.'],
['T',460,662,'Mechanics Congress, 2023','Oral: nonlinear consolidation model and parameter identification. XIII All-Russian Congress on Theoretical and Applied Mechanics, St Petersburg, August 2023.'],
['T',110,676,'GISS, St Petersburg, 2023','Oral: parameters of a model of water-saturated sandy soil. Geological International Student Summit, April 2023.'],
['A',300,668,'2nd Prize, GISS 2023','2nd Prize for a presentation, Geological International Student Summit, 2023.'],
['T',110,694,'Lomonosov-2023, Moscow','Two orals: an elastoplastic sandy soil model, and a snow and freezing-depth survey. Lomonosov-2023, Moscow.'],
['A',100,772,'Full scholarship, 2019 to 2024','Lomonosov Moscow State University Full Funding Scholarship, 2019 to 2024.'],
['A',330,776,'Physics Olympiad, 2019','1st Prize, regional stage of the All-Russian Physics Olympiad, 2019.']
].map(a=>({k:a[0],x:a[1],y:a[2],tag:a[3],tip:a[4],ph:R()*6.28,r:R()*3}));
const SHADE=['#B9A9C4','#A99BBB','#C4B6CC','#9E93B4'],FLINT=['#4E5A6E','#5E6A80','#3E4A5E'];
const off=document.createElement('canvas');off.width=W*DP;off.height=H*DP;const oc=off.getContext('2d');oc.setTransform(DP,0,0,DP,0,0);oc.lineCap='round';
const S=[];
for(let i=0,N=Math.round((W-X0)*(SEA+20-62)/11);i<N;i++){const px=X0+R()*(W-X0),py=62+R()*(SEA+20-62);if(py>SEA&&R()>(SEA+20-py)/20)continue;const L=B.find(b=>py>=b.y0&&py<b.y1);let c=pk(L.p);for(const e of LENS){if(((px-e.cx)/e.rx)**2+((py-e.cy)/e.ry)**2<1)c=pk(e.p);}if(R()<.05||(L.y1-py<14&&R()<.3))c=pk(SHADE);S.push({x:px,y:py,a:(R()-.5)*.25,l:8+R()*7,w:3.6,c,k:(H-py)/H+R()*.04});}
for(const b of B){for(let y=b.y0+38+R()*10;y<b.y1-20;y+=34+R()*22){for(let px=X0+R()*20;px<W;px+=14+R()*26)if(R()<.7)S.push({x:px,y:y+(R()-.5)*2,a:(R()-.5)*.5,l:3+R()*2.5,w:3,c:pk(['#8E96A6','#9AA0B0','#7E889A']),k:(H-y)/H+R()*.02});}}
for(const b of [SEA,470,198]){for(let px=X0+R()*6;px<W;px+=6+R()*9)S.push({x:px,y:b+(R()-.5)*3,a:(R()-.5)*.6,l:4+R()*3,w:4.2,c:pk(FLINT),k:(H-b)/H+.03+R()*.01});}
for(let i=0,N=Math.round((W-X0)*44/14);i<N;i++)S.push({x:X0+R()*(W-X0),y:4+R()*38,a:(R()-.5)*.6+.1,l:9+R()*6,w:4,c:R()<.25?pk(['#F6F3EA','#EEF0EC']):pk(['#A9C8E4','#B9D4EA','#C9DCEC','#8FB6D9']),k:1.05+R()*.05});
S.sort((a,b)=>a.k-b.k);
const G=[];for(let i=0,N=Math.round((W-X0)*28/9);i<N;i++)G.push({x:X0+R()*(W-X0),y:40+R()*26,a:-1.1+(R()-.5)*.9,l:6+R()*5,w:3.2,c:pk(['#7FA34E','#9DBB62','#6E9A4A','#B9C46A','#D9C25A','#8DB35A']),ph:R()*6.28});
function ds(c,s,dx,da){const a=s.a+(da||0),ex=Math.cos(a)*s.l/2,ey=Math.sin(a)*s.l/2,px=s.x+(dx||0);c.strokeStyle=s.c;c.lineWidth=s.w;c.beginPath();c.moveTo(px-ex,s.y-ey);c.lineTo(px+ex,s.y+ey);c.stroke();}
function amm(a){x.strokeStyle='#8E6A4A';x.lineWidth=1.8;x.beginPath();for(let q=0;q<4*Math.PI;q+=.25){const r=1+q*.55,px=a.x+Math.cos(q+a.r)*r,py=a.y+Math.sin(q+a.r)*r;q?x.lineTo(px,py):x.moveTo(px,py);}x.stroke();}
function shell(a){x.strokeStyle='#6E5F8E';x.lineWidth=1.8;x.beginPath();for(let i=0;i<5;i++){const q=-Math.PI*(.85-i*.175);x.moveTo(a.x,a.y+5);x.lineTo(a.x+Math.cos(q)*9,a.y+5+Math.sin(q)*9);}x.stroke();}
function flint(a,t){x.save();x.translate(a.x,a.y);x.rotate(a.r);x.fillStyle='#3E4A5E';x.beginPath();x.ellipse(0,0,6,4,0,0,7);x.fill();x.restore();x.globalAlpha*=.35+.65*Math.max(0,Math.sin(t*1.4+a.ph));x.strokeStyle='#F2C46A';x.lineWidth=2;x.beginPath();x.moveTo(a.x-2,a.y-1);x.lineTo(a.x+2,a.y-2);x.stroke();}
function now(a,t){x.fillStyle='#C8553D';x.globalAlpha*=.55+.45*Math.sin(t*2+a.ph);x.beginPath();x.arc(a.x,a.y,4,0,7);x.fill();}
const pl='background:rgba(251,245,232,0.84);border-radius:3px;padding:1px 5px';
const yr=(y,s)=>`<div style="position:absolute;left:6px;top:${y-7}px;font-family:'IBM Plex Mono',monospace;font-size:11px;color:#6B5E52">${s}</div><div style="position:absolute;left:36px;top:${y}px;width:8px;border-top:1px solid #9A8C7E"></div>`;
let h=yr(62,'now')+yr(198,'2026')+yr(470,'2024')+yr(SEA,'2019');
for(const b of B)h+=`<div style="position:absolute;left:58px;top:${b.y0+14}px;width:282px;${pl};padding:6px 9px"><div style="font-family:Fraunces,serif;font-size:17px;line-height:1.2">${b.t}</div><div style="font-size:12.5px;color:#6B5E52;margin-top:2px;white-space:nowrap">${b.s}</div><div style="font-size:13px;font-style:italic;margin-top:3px;line-height:1.4;max-width:250px">${b.st}</div></div>`;
for(const a of AR)h+=`<div class="tg" style="position:absolute;left:${a.x+11}px;top:${a.y-9}px;font-family:'IBM Plex Mono',monospace;font-size:11px;white-space:nowrap;opacity:0;transition:opacity .6s;${pl}">${a.tag}</div>`;
for(const e of LENS)h+=`<div class="tg" style="position:absolute;left:${e.tx}px;top:${e.ty-9}px;font-size:12px;font-style:italic;color:#6B5E52;white-space:nowrap;opacity:0;transition:opacity .6s;${pl}">${e.tag}</div>`;
h+=`<div class="strata-tip" style="position:absolute;display:none;width:300px;background:rgba(251,245,232,0.97);border:0.6px solid #C9B6A2;border-radius:4px;padding:6px 9px;font-size:12px;line-height:1.4"></div>`;
lab.innerHTML=h;const tip=lab.querySelector('.strata-tip');
let hov=null;const pick=e=>{const b=cv.getBoundingClientRect(),sc=b.width/W,mx=(e.clientX-b.left)/sc,my=(e.clientY-b.top)/sc;hov=AR.find(a=>Math.hypot(a.x-mx,a.y-my)<11/Math.min(1,sc))||LENS.find(l=>((mx-l.cx)/l.rx)**2+((my-l.cy)/l.ry)**2<1)||null;cv.style.cursor=hov?'pointer':'default';if(hov){const hx=hov.x!==undefined?hov.x:hov.cx,hy=hov.y!==undefined?hov.y:hov.cy;tip.textContent=hov.tip;tip.style.display='block';tip.style.left=cl(hx+14,6,W-322)+'px';tip.style.top=(hy+90>H?hy-70:hy+16)+'px';}else tip.style.display='none';if(still)go();};cv.addEventListener('pointermove',pick);cv.addEventListener('pointerdown',pick);cv.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){hov=null;tip.style.display='none';}});
let k=0,shown=false,t0=null,raf=0,vis=false,acc=0,lastTs=null;const still=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function wrapTxt(s,mw){x.font='12px "Source Serif 4",Georgia,serif';const w=s.split(' '),L=[];let c='';for(const q of w){const tt=c?c+' '+q:q;if(x.measureText(tt).width>mw&&c){L.push(c);c=q;}else c=tt;}if(c)L.push(c);return L;}
function frame(ts){raf=0;if(lastTs!==null)acc+=Math.min(.1,(ts-lastTs)/1000);lastTs=ts;const t=still?6+acc:(window.__QA?6+acc:acc),n=Math.floor(S.length*cl(t/3.2,0,1));while(k<n)ds(oc,S[k++]);
x.setTransform(DP,0,0,DP,0,0);x.clearRect(0,0,W,H);x.globalAlpha=1;x.drawImage(off,0,0,W,H);x.lineCap='round';
if(t>3){const f=cl((t-3)/.8,0,1);if(!shown){shown=true;lab.querySelectorAll('.tg').forEach(d=>d.style.opacity=1);}
x.globalAlpha=f;for(const g of G)ds(x,g,0,Math.sin(t*1.3+g.ph+g.x*.02)*.2);
for(const a of AR){x.globalAlpha=f;if(a.k==='P')amm(a);else if(a.k==='T')shell(a);else if(a.k==='A')flint(a,t);else now(a,t);if(a===hov){x.globalAlpha=1;x.strokeStyle='#C8553D';x.lineWidth=1;x.beginPath();x.arc(a.x,a.y,11,0,7);x.stroke();}}x.globalAlpha=1;}
if(!still)go();}
function go(){if(!raf&&vis&&!document.hidden)raf=requestAnimationFrame(frame);}function halt(){if(raf)cancelAnimationFrame(raf);raf=0;lastTs=null;}
if('IntersectionObserver' in window)new IntersectionObserver(es=>{vis=es[0].isIntersecting;vis?go():halt();},{threshold:.15}).observe(wrap);else{vis=true;go();}
document.addEventListener('visibilitychange',()=>{document.hidden?halt():go();});
}
function fit(box){var wrap=box.querySelector('.strata');if(!wrap)return;function f(){var s=Math.min(1,box.clientWidth/680);wrap.style.transform=s<1?'scale('+s+')':'';}f();if('ResizeObserver' in window)new ResizeObserver(f).observe(box);else window.addEventListener('resize',f);}
window.Strata={mount:function(box){var wrap=box.querySelector('.strata');fit(box);mount(wrap);}};
})();
