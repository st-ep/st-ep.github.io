/* Riviera hero: a Monet-style afternoon painted in code, with a robot arm pouring white wine. */
(function(){
function paint(pg,cv,DP){
const W=pg.clientWidth,H=pg.clientHeight,S=W/680;

cv.width=Math.round(W*DP);cv.height=Math.round(H*DP);const X=cv.getContext('2d');
const mb=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
let R=mb(1);const sd=n=>{R=mb(n*7919+13);},pk=a=>a[Math.floor(R()*a.length)],cl=(v,a,b)=>v<a?a:v>b?b:v,lp=(a,b,t)=>a+(b-a)*t,rr=(a,b)=>a+(b-a)*R(),PI=Math.PI,hy=Math.hypot;
const hs=(i,j)=>{let h=Math.imul(i,374761393)+Math.imul(j,668265263)|0;h=Math.imul(h^h>>>13,1274126177);return((h^h>>>16)>>>0)/4294967296;};
const vn=(x,y)=>{const i=Math.floor(x),j=Math.floor(y),u=x-i,v=y-j,a=u*u*(3-2*u),b=v*v*(3-2*v);return lp(lp(hs(i,j),hs(i+1,j),a),lp(hs(i,j+1),hs(i+1,j+1),a),b);};
const fb=(x,y)=>.65*vn(x,y)+.35*vn(x*2.7+5,y*2.7+9),ss=(a,b,x)=>{const t=cl((x-a)/(b-a),0,1);return t*t*(3-2*t);};
const mk=()=>{const o=document.createElement('canvas');o.width=cv.width;o.height=cv.height;const c=o.getContext('2d');c.setTransform(DP*S,0,0,DP*S,0,0);c.lineCap='round';c.lineJoin='round';return[o,c];};
const sp=s=>s.split(' ').map(v=>'#'+v);
const C={sky:sp('8DB6DE 98BEE2 A6C7E6 B4D0EA C2D9EE CEDFEF'),skw:sp('F1E7CF EEDDD0 F4E5C6 E9D9D6 DCE4EC'),cl:sp('FBF5E6 F7EEDC FFF8EA F4ECE0'),cs:sp('D2CCDD C6C8DF DAD0D9 BFC3DC'),ml:sp('E2C3C6 EBCDBE D8BACC E9D2C8 DDBFD0'),ms:sp('8F95C4 9C9CCB 8589BE A5A2CF B1A6CB 979FCB'),
sf:sp('7FA5D6 8FB0DA 9DB4DC A9B2D8 92A8D6'),sm:sp('4A74B6 5680C0 3F69AE 6187C6 5A7EC0 7092CC'),sn:sp('4FA0B8 62B2BE 5E9FC0 4C93B6'),sl:sp('8C8ACB 9A9AD0 7E8EC8'),
gl:sp('B9C46A C9C25E A3BC5E D6C35A 8DB35A E2C866'),gm:sp('7FA34E 6E9A4A 8A9A4E 9AA85A 6E8A4A'),gs:sp('4E7E5A 3E6B5A 4A6E7A 5E6E96 6E7FA0 3E5E5A'),
ep:sp('EBA98E E89A7A F0B4A0 E6A898 F2CBB0 F2C29C'),eo:sp('E8915E E2A070 D97A50 E89A5A D9A855 F0B48A'),es:sp('9A86B4 8A8FC0 A286AE 7E86B8 B48A9E 9B92C2'),st:sp('F4E6D8 EBD8E2 F7EEDF E6D2D8'),
pl:sp('8DB35A 9DBB62 B9C46A A8BE5E'),pm:sp('4E7E45 3E6B3A 5E8A4A 4A7A4E'),ps:sp('2F5A4A 355A5E 3E5A72 4E5A84 2F4E46 3A5A50'),
tl:sp('B97A5E A86E5A C98A62 9E6A5E'),ts:sp('6E5F8E 5E5A86 7A6890 66628E'),
wl:sp('F4E6CC F0DFC0 F6EAD2 EDD8B6 F2E2C6'),ws:sp('BDB6D6 C4BED8 B0AED4 B8B4D6'),
rl:sp('F4E2BC F0D9A8 F6E8C8 EBD3A0 F2DDB4'),rh:sp('FFF6DA FBEFD2 FFF9E8'),rm:sp('DDCFD6 E0D2CA D4CADA DACAD0'),rs:sp('A4A2CE 9EA0CC AAA4D0 9C9ECA'),rd:sp('8A8CC2 8286BE 9088C0 7E86BC'),rw:sp('CDB0C0 D6B4B4 C8A8BC'),rg:sp('A9B8A6 B0BCA8 A2B2AA'),
gy:sp('A6A8BE 9A9CB4 B0B0C4'),gq:sp('7D819E 868AA6 8088A4'),gd:sp('5E6488 636890 575E84'),
bd:sp('24483A 2F5A3A 2A5040'),bm:sp('3E6B3A 355E40 3A6440'),bl:sp('5E8A4A 6E9A4A 5A8648'),br:sp('4E7E6A 5E8A7A 52806E'),wa:sp('FBF5E8 F7EFDF FAF2E4')};
const LX=-.62,LY=-.78,HZ=198;
function B(c,x,y,a,l,w,col,al,bd){const ca=Math.cos(a),sa=Math.sin(a),h=l/2,nx=-sa,ny=ca,q=w/2,b=(bd||0)*l,tx=x-ca*h,ty=y-sa*h,hx=x+ca*h,hy=y+sa*h,mx=x+nx*b,my=y+ny*b;c.globalAlpha=al;c.fillStyle=col;c.beginPath();c.moveTo(tx+nx*q,ty+ny*q);c.quadraticCurveTo(mx+nx*q*1.4,my+ny*q*1.4,hx-ca*q*.3,hy-sa*q*.3);c.quadraticCurveTo(mx-nx*q*1.4,my-ny*q*1.4,tx-nx*q,ty-ny*q);c.quadraticCurveTo(tx-ca*q*1.3,ty-sa*q*1.3,tx+nx*q,ty+ny*q);c.fill();}
function Fb(c,x,y,a,l,w,col,al,bd){const h=l/2,q=w/2,b=(bd||0)*l;c.save();c.translate(x,y);c.rotate(a);c.globalAlpha=al;c.fillStyle=col;c.beginPath();c.moveTo(-h,-q);c.quadraticCurveTo(0,-q+b,h,-q*.75);c.quadraticCurveTo(h+q*.45,0,h,q*.75);c.quadraticCurveTo(0,q+b,-h,q);c.quadraticCurveTo(-h-q*.35,0,-h,-q);c.fill();c.restore();}
function D(c,x,y,a,l,w,col,al){const dx=Math.cos(a)*l/2,dy=Math.sin(a)*l/2;c.globalAlpha=al;c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x-dx,y-dy);c.lineTo(x+dx,y+dy);c.stroke();}
function Ln(c,pts,w,col,al){c.globalAlpha=al;c.strokeStyle=col;c.lineWidth=w;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();}
const ip=(P,x)=>{if(x<=P[0][0])return P[0][1];for(let i=1;i<P.length;i++)if(x<=P[i][0])return lp(P[i-1][1],P[i][1],(x-P[i-1][0])/(P[i][0]-P[i-1][0]));return P[P.length-1][1];};
const MR=[[290,182],[325,166],[362,141],[396,119],[424,106],[441,103],[460,110],[488,122],[518,128],[548,134],[578,131],[606,142],[642,151],[690,158]];
const mY=x=>ip(MR,x)+(vn(x*.09,3)-.5)*4;
const SB=[[290,293],[380,291],[440,290],[485,285],[528,270],[566,252],[606,236],[690,229]];
const sY=x=>ip(SB,x)+(vn(x*.07,8)-.5)*4;
const PC=[[294,292],[304,322],[318,356],[336,392],[360,420],[395,440],[440,452]];
const pcx=y=>ip(PC,y),phw=y=>lp(3,95,Math.pow(cl((y-294)/146,0,1),1.25));
const isE=(x,y)=>{if(y<294)return false;const c=pcx(y),h=phw(y)+(vn(x*.1,y*.1)-.5)*8;if(Math.abs(x-c)<h)return true;return x>c&&y>346+(vn(x*.05,2)-.5)*16;};
const TX=516;
const tsh=(x,y)=>{const dx=(x-TX-60)/82,dy=(y-394)/11;return ss(0,.45,1-dx*dx-dy*dy+(vn(x*.12,y*.2)-.5)*.5);};
const shd=(x,y)=>{const dx=(x-645)/125,dy=(y-372)/66;return Math.max(tsh(x,y),ss(-.15,.35,1-dx*dx-dy*dy+(fb(x*.07,y*.11)-.5)*.7));};
const CN=[[600,64,64,22],[662,56,56,24],[628,36,52,17],[702,74,30,20],[575,46,36,13],[548,90,50,16],[606,90,48,14],[520,100,24,8],[488,94,16,6],[692,36,30,14],[560,68,22,8]];
const TR=[[650,350],[647,300],[640,252],[633,205],[626,160],[618,120],[606,92]];
function under(c){const g=c.createLinearGradient(0,0,0,HZ);g.addColorStop(0,'#A4C6E4');g.addColorStop(.7,'#C3DAEC');g.addColorStop(1,'#EADFCB');c.globalAlpha=1;c.fillStyle=g;c.fillRect(-5,-5,700,HZ+6);
c.save();c.filter='blur('+(6*DP*S)+'px)';c.fillStyle='#B7AACB';c.beginPath();c.moveTo(-5,HZ);for(let x=-5;x<=695;x+=5)c.lineTo(x,mY(x));c.lineTo(695,HZ);c.fill();
c.fillStyle='#A6A65C';c.fillRect(-5,HZ,700,240);c.fillStyle='#5580C0';c.beginPath();c.moveTo(-5,HZ);c.lineTo(695,HZ);for(let x=695;x>=-5;x-=5)c.lineTo(x,sY(x));c.fill();
c.fillStyle='#DF9468';for(let y=294;y<432;y+=3){const p=pcx(y),h=phw(y);c.fillRect(p-h,y,2*h,3.5);if(y>346)c.fillRect(p,y,400,3.5);}
c.globalAlpha=.75;c.fillStyle='#9A8AB4';c.beginPath();c.ellipse(645,378,120,56,0,0,7);c.fill();c.ellipse(TX+60,394,78,9,0,0,7);c.fill();c.globalAlpha=1;
c.fillStyle='#36574A';for(const[x,y,a,b]of CN){c.beginPath();c.ellipse(x,y,a,b,0,0,7);c.fill();}
c.strokeStyle='#8A6A6E';c.lineWidth=10;c.beginPath();TR.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();c.restore();}
function sky(c){sd(11);c.save();c.filter='blur('+(14*DP*S)+'px)';for(const[x,y,a,b,col,al]of[[620,10,160,40,'#86AEDA',.5],[470,20,120,30,'#93B8DF',.35],[430,150,140,30,'#E8DCCF',.4]]){c.globalAlpha=al;c.fillStyle=col;c.beginPath();c.ellipse(x,y,a,b,0,0,7);c.fill();}c.restore();for(let i=0;i<5200;i++){const x=rr(285,695),y=rr(-6,204);if(y>mY(x)+3)continue;const t=cl(y/HZ,0,1),col=R()<cl((t-.6)*1.7,0,.8)?pk(C.skw):C.sky[Math.floor(cl(t*.95+(fb(x*.02,y*.03)-.5)*.5+rr(-.1,.1),0,.99)*6)];
B(c,x,y,-.32+rr(-.3,.3),rr(6,12)*(1.25-t*.5),rr(2.2,3.6)*(1.1-t*.3),col,rr(.35,.6),rr(-.06,.06));}
cloud(c,408,46,72,24,8,12);}
function cloud(c,cx,cy,rx,ry,n,s){sd(s);const pf=[],yb=cy+ry*.45;for(let i=0;i<n;i++){const u=lp(-1,1,i/(n-1))+rr(-.07,.07),r=ry*rr(.5,.72)*(1.2-u*u*.62);pf.push([cx+u*rx,yb-r*rr(.55,.85)-(1-u*u)*ry*.25,r]);}
c.save();c.filter='blur('+(3*DP*S)+'px)';c.globalAlpha=.85;c.fillStyle='#E2DCE6';for(const[x,y,r]of pf){c.beginPath();c.arc(x,y,r,0,7);c.fill();}
c.globalAlpha=.6;c.fillStyle='#FFF6E4';for(const[x,y,r]of pf){c.beginPath();c.arc(x-r*.22,y-r*.3,r*.72,0,7);c.fill();}
c.globalAlpha=.55;c.fillStyle='#C3BFD8';c.beginPath();c.ellipse(cx+rx*.08,yb-ry*.12,rx*.92,ry*.2,0,0,7);c.fill();c.restore();
for(const[px,py,r]of pf)for(let k=0;k<r*1.7;k++){const q=rr(-PI,PI),rd=r*Math.sqrt(R())*.95,x=px+Math.cos(q)*rd,y=py+Math.sin(q)*rd;if(y>yb+2)continue;const lt=(Math.cos(q)*LX*.7+Math.sin(q)*LY)*rd/r-(y-py+r)/(yb-py+r+1)*.45+.3+rr(-.2,.2);
let ta=(q+PI/2)%PI;if(ta>PI/2)ta-=PI;B(c,x,y,ta*.5+rr(-.15,.15),rr(6,12),rr(2.4,3.8),lt>.35?pk(C.cl):lt<-.05?pk(C.cs):pk(sp('EFE6E4 E8E0E6 F2EAE0')),rr(.45,.7));}}
function mtn(c){sd(21);for(let i=0;i<4600;i++){const x=rr(285,695),y=rr(95,HZ);const ry=mY(x);if(y<ry)continue;const d=(y-ry)/(HZ-ry+1),sl=(mY(x+4)-mY(x-4))/8,a=Math.atan(sl)*(1-d*.7)+rr(-.25,.25);
const f=fb(x*.05,y*.08),lit=(x<441?.78:.22)+(f-.5)*.7-(d>.72?.3:0);B(c,x,y,a,rr(2.5,8),rr(1.3,2.8),R()<lit?pk(C.ml):pk(C.ms),rr(.4,.78));}
for(let i=0;i<700;i++){const x=rr(285,695),y=rr(HZ-13,HZ);if(y<mY(x))continue;B(c,x,y,rr(-.1,.1),rr(4,7),rr(1.6,2.2),pk(sp('8E9CC8 7F93C4 9AA8CC 7E9AB0 A7A6CF')),.7);}
for(let i=0;i<120;i++){const x=rr(338,432),y=HZ-rr(2,10)+Math.abs(x-388)*.04;if(fb(x*.12,1.7)<.42)continue;D(c,x,y,PI/2+rr(-.2,.2),rr(1.4,2.6),rr(1.4,2.1),R()<.82?pk(sp('F4E8D4 EBC9B4 EADBB8 F2DED2 FBF1E2')):'#9A94C4',.85);}
for(let x=290;x<695;x+=rr(5,10))D(c,x,HZ+.5,0,rr(4,9),1.2,pk(sp('D9DCEA E6E2EA CFD6EA')),.75);}
function sea(c){sd(31);c.save();c.filter='blur('+(5*DP*S)+'px)';for(let i=0;i<9;i++){c.globalAlpha=.35;c.fillStyle=pk(sp('8FB0DA 6FA8C4 9AA6D6'));c.beginPath();c.ellipse(rr(320,680),rr(HZ+10,262),rr(20,50),rr(3,7),0,0,7);c.fill();}c.restore();for(let i=0;i<5600;i++){const x=rr(285,695),y=rr(HZ,300),sb=sY(x);if(y>sb)continue;const d=(y-HZ)/(sb-HZ),f=fb(x*.04,y*.12);
const col=d<.16?pk(C.sf):d>.78&&R()<.7?pk(C.sn):f>.6&&R()<.4?pk(C.sl):pk(C.sm);B(c,x,y,rr(-.05,.05),lp(5,15,d)*rr(.5,1.6),lp(1.4,3.4,d)*rr(.8,1.2),col,rr(.5,.85));}
for(let i=0;i<110;i++){const x=rr(296,430),y=HZ+3+Math.pow(R(),1.8)*48;if(y>sY(x)-3)continue;const a=[x,y,rr(-.04,.04),rr(3,7),rr(1.1,1.8),pk(sp('F4E9C9 EEF3F2 F8EED4 DDEBF2')),rr(.6,.9)];if(x<354||(x>418&&y>218))B(c,...a);else SPK.push(a);}}
function pine(c){sd(41);for(let s=1;s<TR.length;s++){const[a0,b0]=TR[s-1],[a1,b1]=TR[s],d=hy(a1-a0,b1-b0),tx=(a1-a0)/d,ty=(b1-b0)/d;
for(let i=0;i<d*3;i++){const t=R(),w=lp(13,7,(s-1+t)/(TR.length-1))/2,sx=rr(-1,1),x=lp(a0,a1,t)-ty*sx*w,y=lp(b0,b1,t)+tx*sx*w;B(c,x,y,Math.atan2(ty,tx)+rr(-.1,.1),rr(4,8),rr(1.8,2.8),sx<-.15?pk(C.tl):sx>.35?pk(C.ts):(R()<.5?pk(C.tl):pk(C.ts)),.9);}}
for(const[x0,y0,x1,y1]of[[618,120,568,92],[614,108,652,66],[606,92,588,62],[608,96,540,96]]){for(let k=0;k<3;k++)Ln(c,[[x0,y0],[lp(x0,x1,.5)+rr(-3,3),lp(y0,y1,.5)+rr(-4,0)],[x1,y1]],lp(3.2,1.4,k/2),k?pk(C.tl):pk(C.ts),.85);}
c.save();c.filter='blur('+(2.5*DP*S)+'px)';c.globalAlpha=.9;c.fillStyle='#2F4E46';for(const[x,y,a,b]of CN){c.beginPath();c.ellipse(x,y+2,a*.9,b*.85,0,0,7);c.fill();}c.restore();
for(const[cx,cy,rx,ry]of CN){const n=rx*ry*1.1;for(let i=0;i<n;i++){const u=rr(-1,1),v=rr(-1,1);if(u*u+v*v>1.05)continue;const x=cx+u*rx,y=cy+v*ry,k=(1-v)*.38-.38-u*.08+rr(-.22,.22)-(x>650?.06:0);
B(c,x,y,rr(-.5,.3),rr(3,9),rr(2,3.8),k>.3?pk(C.pl):k>.02?pk(C.pm):pk(C.ps),rr(.8,.95));}
for(let i=0;i<rx*.35;i++){const q=rr(-PI*.92,-PI*.08),x=cx+Math.cos(q)*rx*rr(.8,.98),y=cy+Math.sin(q)*ry*rr(.75,.95);B(c,x,y,q+PI/2+rr(-.3,.3),rr(4,7),rr(2,3),Math.cos(q)<.35?pk(sp('B5B65E C4B866 A8B060 C9BE6E')):pk(C.pm),.85);}}
for(let i=0;i<16;i++){const[cx,cy,rx,ry]=pk(CN),q=rr(0,2*PI),x=cx+Math.cos(q)*rx*rr(.75,.95),y=cy+Math.sin(q)*ry*rr(.6,.9);if(y>cy+ry*.3||rx<30)continue;D(c,x,y,rr(-.3,.3),rr(3,5),rr(2.5,3.5),pk(sp('A6C7E6 B4D0EA 98BEE2')),.7);}}
function shrubs(c){sd(51);const L=[];for(let y=228;y<440;){const t=cl((y-228)/190,0,1),st=lp(7,24,t);for(let x=284;x<700;x+=st*rr(.6,1.3)){const yy=y+rr(-st*.4,st*.4);if(yy<sY(x)-2||isE(x,yy+st*.3))continue;L.push([x,yy,st*rr(.55,1.2),t]);}y+=st*.55;}
L.sort((a,b)=>a[1]-b[1]);for(const[cx,cy,r,t]of L){const sh=Math.max(shd(cx,cy),cx>585&&cy<350?.8:0,ss(320,425,cy)*ss(372,300,cx)*.55),n=Math.round(r*r*.4),ga=-1.25+(vn(cx*.07,cy*.07)-.5)*1.7,ml=(fb(cx*.016+3,cy*.03)-.5)*1.5+(cy<sY(cx)+12?.25:0);
for(let k=0;k<n;k++){const q=R()*2*PI,rd=Math.sqrt(R())*r,x=cx+Math.cos(q)*rd,y=cy+Math.sin(q)*rd*.75,lt=.6*(Math.cos(q)*LX+Math.sin(q)*LY)*rd/r+ml+rr(-.3,.3)-sh*.75-(1-t)*.08;
B(c,x,y,ga+rr(-.45,.45),(rr(.5,1)*r+2)*lp(.8,1.05,t),lp(1.8,5,t)*rr(.8,1.15),lt>.28+(1-t)*.15?pk(C.gl):lt<-.22?pk(C.gs):pk(C.gm),rr(.8,.95));}
if(t>.45&&R()<.08)for(let k=0;k<3;k++)D(c,cx+rr(-r,r)*.7,cy-rr(0,r*.6),0,1,lp(1.6,3.2,t),pk(sp('F2A0A8 F6EEE6 E8C0D0 D8553A')),.9);}}
function earth(c){sd(61);const ec=(x,y,s,j)=>{if((s>.5&&R()>.04)||R()<s*.8)return pk(C.es);const f=fb(x*.02,y*.04)+rr(-j,j);return f<.44?pk(C.ep):f>.57?pk(C.eo):pk(sp('EFA884 E9A07C F0B08E E89C78'));};
for(let i=0;i<1100;i++){const x=rr(284,695),y=rr(290,432);if(!isE(x,y))continue;const t=cl((y-290)/135,0,1),av=Math.atan((296-y)/(300-x||1));B(c,x,y,av*.6+rr(-.3,.3),lp(10,42,t),lp(4,13,t),ec(x,y,shd(x,y),.04),.32,rr(-.1,.1));}
for(let i=0;i<5600;i++){const x=rr(284,695),y=rr(290,432);if(!isE(x,y))continue;const t=cl((y-290)/135,0,1),av=Math.atan((296-y)/(300-x||1));
B(c,x,y,av*.65+rr(-.38,.38),lp(5,26,Math.pow(t,1.2))*rr(.5,1.35),lp(2,7,t)*rr(.6,1.25),ec(x,y,shd(x,y),.08),rr(.62,.9),rr(-.12,.12));}
for(let i=0;i<900;i++){const x=rr(540,695),y=rr(345,430),t=(y-290)/135;if(shd(x,y)<.65||tsh(x,y)>.2||!isE(x,y)||fb(x*.035,y*.07)<.6||R()<.75)continue;B(c,x,y,rr(-.12,.12),lp(6,18,t)*rr(.6,1.2),lp(1.5,3.6,t),pk(sp('EBB894 E8B08C F0BE98 DDA48E')),.7,rr(-.08,.08));}
for(let k=0;k<11;k++){const y=rr(305,420),p=pcx(y),h=phw(y),t=(y-290)/135;for(let j=0;j<3;j++){const x=p+h*rr(.7,1)+rr(-6,6)*t,yy=y+rr(-4,4)*t;if(!isE(x,yy))continue;B(c,x+t*1.5,yy+lp(1,2.5,t),0,lp(3,8,t),lp(1.4,3,t),pk(C.es),.55);B(c,x,yy,rr(-.3,.3),lp(3,8,t),lp(1.6,3.6,t),pk(C.st),.9,rr(-.1,.1));}}}
const QX=524,QY=305,QA=106,QB=17,qe=(x,s)=>QY+s*QB*Math.sqrt(Math.max(0,1-((x-QX)/QA)**2)),CX=554,cb=y=>569-(y-QY)*.28+1.6*Math.sin((y-QY)*.21+.9),dcb=y=>-.28+.336*Math.cos((y-QY)*.21+.9),PX=598,PY=303;
const hem=x=>qe(x,1)+(21+9*Math.exp(-(((x-437)/13)**2))+3.2*Math.sin((x-QX)*.17+.4)+(vn(x*.11,6)-.5)*2.6)*(x<CX-10?1:Math.sqrt(Math.max(0,1-((x-CX+10)/22)**2)));
const LG=[[447,298,443,378],[569,293,571,373],[480,317,477,397],[601,312,604,392]];
const sl=x=>Math.atan((qe(x+1,1)-qe(x-1,1))/2);
function leg(c,x0,y0,x1,y1,w0,w1){c.save();c.beginPath();c.moveTo(x0-w0/2,y0);c.lineTo(x0+w0/2,y0);c.lineTo(x1+w1/2,y1);c.lineTo(x1-w1/2,y1);c.closePath();c.globalAlpha=1;c.fillStyle='#86708E';c.fill();c.clip();
for(let i=0,n=(y1-y0)*w0*.6;i<n;i++){const t=R(),s=rr(-1.1,1.1),y=lp(y0,y1,t),x=lp(x0,x1,t)+s*lp(w0,w1,t)/2,l=-s*.6+t*.5-.15+rr(-.15,.15);B(c,x,y,PI/2+rr(-.05,.05),rr(4,8),rr(1.6,2.6),l>.4?pk(sp('E0A07A D9966C E6AC84 D09068')):l>.05?pk(sp('C08466 B47A62 A87268')):l>-.3?pk(sp('96768A 8A7092 92789A')):pk(sp('7A6890 6E628E')),.9);}c.restore();}
function table(c){sd(171);
for(let i=0;i<800;i++){const x=rr(470,690),y=rr(378,416),dx=(x-590)/88,dy=(y-397)/13,e=1-dx*dx-dy*dy+(vn(x*.09,y*.14)-.5)*.6;if(e<0||!isE(x,y))continue;B(c,x,y,rr(-.1,.1),rr(8,20),rr(2.4,4.5),pk(C.es),.55*ss(0,.35,e),rr(-.1,.1));}
for(const[,,x1,y1]of LG){for(let i=0;i<26;i++){const t=R();B(c,x1+5+t*40+rr(-1,1),y1+1.5+t*5+rr(-1,1),.13,rr(6,10),rr(2,3.2),pk(C.es),.6-.3*t);}c.globalAlpha=.75;c.fillStyle='#6A6496';c.beginPath();c.ellipse(x1+2.5,y1+.6,8.5,2,0,0,7);c.fill();}
leg(c,...LG[0],13.5,11);leg(c,...LG[1],13.5,11);
c.save();c.beginPath();for(let x=CX;x<=QX+QA-6;x+=2)c.lineTo(x,qe(x,1)+4);for(let x=QX+QA-6;x>=CX;x-=2)c.lineTo(x,qe(x,1)+12);c.closePath();c.globalAlpha=1;c.fillStyle='#74628C';c.fill();c.clip();
for(let i=0;i<180;i++){const x=rr(CX,QX+QA),y=qe(x,1)+rr(4,12);B(c,x,y,rr(-.05,.05),rr(5,9),rr(1.6,2.4),pk(sp('7A6890 6E5F8E 866E8E 8A6A7E')),.9);}c.restore();
leg(c,...LG[2],16,13);leg(c,...LG[3],16,13);
c.save();c.beginPath();c.ellipse(QX,QY,QA,QB,0,0,7);c.globalAlpha=1;c.fillStyle='#CF9E88';c.fill();c.clip();
for(let i=0;i<420;i++){const x=rr(560,QX+QA+2),y=rr(QY-QB,QY+QB),u=(x-QX)/QA;B(c,x,y,rr(-.05,.05),rr(6,12),rr(1.8,2.8),R()<.28?pk(sp('C9A8BC C2A4BE D2B4C2')):u>.9?pk(sp('B98872 AE7E72')):pk(sp('DCA88A E2B494 D6A48C E8BC98 D09C86')),.9);}
c.save();c.translate(PX,PY);c.scale(1,.21);c.globalAlpha=.95;c.fillStyle='#6E7296';c.beginPath();c.roundRect(-22,-13,44,44,7);c.fill();c.fillStyle='#A4A6BE';c.beginPath();c.roundRect(-22,-22,44,44,7);c.fill();c.restore();
for(let i=0;i<60;i++)B(c,PX+rr(-20,20),PY+rr(-3.8,3.8),rr(-.05,.05),rr(4,7),rr(1.4,2),pk(sp('B0B2C6 9A9CB4 A6A8BE C4C2D4')),.85);
for(let i=0;i<110;i++){const t=R(),x=lp(PX+6,QX+QA+4,t)+rr(-2,2),y=lp(PY,PY+5,t)+rr(-2.6,2.6)*(1-t*.5);B(c,x,y,.2,rr(4,8),rr(2,3.2),pk(sp('9A86B4 8A8FC0 A286AE 8E86B8')),.55);}
for(const[u,v]of[[-18,-3.5],[18,-3.5],[-18,3.5],[18,3.5]]){c.globalAlpha=.95;c.fillStyle='#3E4468';c.beginPath();c.ellipse(PX+u,PY+v,1.8,1.05,0,0,7);c.fill();c.fillStyle=u>0?'#C8C4DC':'#F2F2F8';c.beginPath();c.arc(PX+u-.5,PY+v-.35,.55,0,7);c.fill();}
c.restore();
c.save();c.beginPath();for(let x=QX-QA;x<=QX+QA;x+=2)c.lineTo(x,qe(x,1));for(let x=QX+QA;x>=QX-QA;x-=2)c.lineTo(x,qe(x,1)+6);c.closePath();c.globalAlpha=1;c.fillStyle='#B97A5E';c.fill();c.clip();
for(let i=0;i<220;i++){const x=rr(CX,QX+QA),dy=rr(0,6),y=qe(x,1)+dy,u=(x-QX)/QA;B(c,x,y,sl(x)+rr(-.05,.05),rr(5,9),rr(1.6,2.4),u>.9?pk(sp('8A6A7E 9E6A5E 866E8E')):dy>4.3?pk(sp('9E6A5E A86E5A 946A6A')):pk(sp('D9966C D09068 E0A47E C98A62')),.92);}c.restore();
for(let x=CX+14;x<QX+QA-6;x+=rr(3,6))D(c,x,qe(x,1)+.3,sl(x),rr(3,5),1.1,'#F2CDA4',.8);
c.save();c.beginPath();c.ellipse(QX,QY,QA,QB,0,0,7);c.clip();c.beginPath();c.moveTo(QX-QA-4,QY-QB-4);for(let y=QY-QB-4;y<=QY+QB+4;y+=1.5)c.lineTo(cb(y),y);c.lineTo(QX-QA-4,QY+QB+4);c.closePath();c.globalAlpha=1;c.fillStyle='#E6DDD8';c.fill();c.clip();
for(let i=0;i<950;i++){const x=rr(QX-QA-4,cb(QY)+8),y=rr(QY-QB-2,QY+QB+2),bk=cl((QY-y)/QB,-1,1),lt=.8-.42*(x-QX+40)/QA-.22*bk+(fb(x*.08,y*.2)-.5)*.35+rr(-.07,.07);B(c,x,y,rr(-.08,.08),rr(7,13),rr(2.4,3.4),lt>.66?pk(C.wl):lt>.46?(bk>.3&&R()<.35?pk(sp('DCE4EC D8E0EC')):pk(sp('E6DCD6 E2D9DC EADFD4'))):lt>.28?pk(sp('D2CADE CCC6DE D8CEDC')):pk(C.ws),.9);}
for(let i=0;i<90;i++){const q=rr(-PI,PI),rd=Math.sqrt(R()),x=536+Math.cos(q)*rd*30,y=313.5+Math.sin(q)*rd*3.6-(x-536)*.04;B(c,x,y,-.04+rr(-.06,.06),rr(5,10),rr(2,3),pk(sp('B4ACD4 A8A2D0 BCB0D6 B0B4DA')),.42*(1-rd*.5));}c.restore();
{const y0=QY-QB+1.5,y1=qe(566,1)-.4,F=(o,w)=>{const p=[];for(let y=y0;y<=y1;y+=1.5)p.push([cb(y)+o+(w?(vn(y*.3,w)-.5)*1.6:0),y]);return p;};c.save();c.beginPath();c.ellipse(QX,QY,QA,QB,0,0,7);c.clip();for(let i=0;i<70;i++){const y=rr(y0,y1),x=cb(y)+rr(.6,4.5),a=Math.atan2(1,dcb(y));B(c,x,y,a+rr(-.08,.08),rr(4,7),rr(1.6,2.4),pk(sp('8E6E90 86709A 7E6A92 9A7896')),.5*(1-(x-cb(y))/5));}for(let i=0;i<120;i++){const y=rr(y0,y1),o=rr(-7.5,-1),x=cb(y)+o;B(c,x,y,Math.atan2(1,dcb(y))+rr(-.06,.06),rr(4,8),rr(1.6,2.4),o<-5.6?pk(sp('D8CEDE D2CADE')):R()<.6?pk(sp('EDE2D6 E8DDD8 F0E6D8')):pk(C.wl),.85);}c.restore();Ln(c,F(-7.4,5),1,'#A69CC8',.55);Ln(c,F(-6.6,5),.8,'#FFF6E4',.6);Ln(c,F(-1.6,0),1.2,'#FFF8EA',.75);Ln(c,F(.2,0),1.2,'#8E84B4',.65);}
for(let i=0;i<46;i++){const t=R(),x=lp(457,492,t),y=lp(313.5,317.3,t)+rr(-1.2,1.2)*(1-t*.4);B(c,x,y,.12,rr(4,7),rr(2,3),pk(sp('A49ACA 9C9CCC 9AA0CC')),.5);}
const xa=QX-QA,xb=CX+13;c.save();c.beginPath();for(let x=xa;x<=xb;x+=1.5)c.lineTo(x,qe(x,1)-.6);for(let x=xb;x>=xa;x-=1.5)c.lineTo(x,hem(x));c.quadraticCurveTo(xa-4.5,hem(xa)-6,xa-1,QY+3);c.closePath();c.globalAlpha=1;c.fillStyle='#CEC6DA';c.fill();c.clip();
for(let i=0;i<1500;i++){const x=rr(xa-5,xb+3),tp=qe(x,1),hb=hem(x),y=rr(tp-1,hb+1),bt=cl((y-tp)/(hb-tp+.1),0,1),fd=Math.sin((x-QX)*.17*(1-.1*bt)+.4+.2*bt),u=(x-QX)/QA,lt=.64-.46*u+.3*fd-.15*bt-.32*ss(CX-16,CX+6,x)+rr(-.08,.08);
B(c,x,y,PI/2+rr(-.07,.07),rr(5,11),rr(2,3.2),bt>.8&&R()<.4?pk(C.rw):lt>.72?pk(C.wl):lt>.46?pk(sp('E2D8DC D8CEDE E6DCD4')):lt>.22?pk(C.ws):pk(sp('A7A0CC 9E9ACA AFA6CE')),.9);}
for(let k=-3;k<2;k++){const x=508.4+36.96*k+rr(-2,2);if(x<xa+6||x>xb-4)continue;const tp=qe(x,1);D(c,x,lp(tp,hem(x),.58),PI/2+rr(-.04,.04),(hem(x)-tp)*.8,1.5,'#8E8CC0',.45);}Ln(c,[[CX+7,qe(CX+7,1)+1.5],[CX+4.5,lp(qe(CX+4,1),hem(CX+4),.5)],[CX+1,hem(CX+1)-2.5]],1.3,'#9A94C4',.5);c.restore();
for(let x=xa;x<=xb;x+=rr(3,6)){const u=(x-QX)/QA;D(c,x,hem(x)-.8,rr(-.2,.2),rr(3,6),1.4,u<-.3?pk(sp('F4E6CC EDE0D6')):pk(sp('9A94C4 8E8CC0 A49ACA')),.7);}
for(let x=xa+4;x<=CX+8;x+=rr(3,7))D(c,x,qe(x,1)+.3,0,rr(3,7),1.2,x<QX+10?'#FFF6DA':'#C4BCDA',.8);}
const L3=[-.72,-.52,.46],RG=sp('E8CC92 EBC98A E4C48E'),RL=sp('C6BCD8 C0B6D4 CDBAD2 BCB4D6'),RK=sp('A6C7E6 B4D0EA 9CC0E2'),RN=sp('A8BC8A 9DB884 B0C496');
const rc=(k,ny,e)=>{const v=k-.07+rr(-.12,.12);if(e>.7&&v<.18&&R()<.4)return ny>.2?pk(RN):pk(RK);if(v>.8)return R()<.35?pk(C.rh):pk(C.rl);if(v>.5)return R()<.38?pk(RG):pk(C.rl);if(v>.38)return R()<.15?pk(C.rl):pk(C.rm);if(v>.22)return R()<.12?pk(RK):pk(RL);if(v>.04)return pk(C.rs);return pk(C.rd);};
const gc=k=>k>.45?pk(C.gy):k>.1?pk(C.gq):pk(C.gd);
const cpt=(ax,ay,bx,by,r1,r2)=>{const d=hy(bx-ax,by-ay),a=Math.atan2(by-ay,bx-ax),o=[],ad=(x,y,q)=>o.push([x,y,Math.cos(q),Math.sin(q)]);
for(let t=0;t<1;t+=2.5/d){const r=lp(r1,r2,t),q=a-PI/2;ad(ax+(bx-ax)*t+Math.cos(q)*r,ay+(by-ay)*t+Math.sin(q)*r,q);}for(let q=-PI/2;q<=PI/2+.01;q+=.28)ad(bx+Math.cos(a+q)*r2,by+Math.sin(a+q)*r2,a+q);
for(let t=1;t>0;t-=2.5/d){const r=lp(r1,r2,t),q=a+PI/2;ad(ax+(bx-ax)*t+Math.cos(q)*r,ay+(by-ay)*t+Math.sin(q)*r,q);}for(let q=PI/2;q<=3*PI/2+.01;q+=.28)ad(ax+Math.cos(a+q)*r1,ay+Math.sin(a+q)*r1,a+q);return o;};
const rag=(c,o)=>{c.beginPath();for(const[x,y,nx,ny]of o){const f=(vn(x*.45+3,y*.45+7)-.5)*1.9;c.lineTo(x+nx*f,y+ny*f);}c.closePath();};
function lk(c,ax,ay,bx,by,r1,r2,sm){const d=hy(bx-ax,by-ay),tx=(bx-ax)/d,ty=(by-ay)/d,nx=-ty,ny=tx,ang=Math.atan2(ty,tx),ln=nx*L3[0]+ny*L3[1],K=s=>s*ln+Math.sqrt(Math.max(0,1-s*s))*L3[2],P=(t,s)=>{const r=lp(r1,r2,cl(t,0,1));return[ax+tx*d*t+nx*s*r,ay+ty*d*t+ny*s*r];},o=cpt(ax,ay,bx,by,r1,r2);
EC.push(...o);c.save();rag(c,o);c.globalAlpha=1;c.fillStyle='#CBC2D8';c.fill();c.clip();
for(let i=0,n=d*(r1+r2)*.55;i<n;i++){const t=rr(-.15,1.15),s=cl(rr(-1.05,1.05),-1,1),[x,y]=P(t,s),cr=R()<.22;B(c,x,y,cr?ang+PI/2+s*.6+rr(-.2,.2):ang+rr(-.08,.08),cr?rr(3,5):rr(5,11),rr(2,3.2),rc(K(s),s*ny,Math.abs(s)),.9);}
for(let i=0,n=d*(r1+r2)*.06;i<n;i++){const t=R(),s=rr(-1,1),[x,y]=P(t,s),k=K(s);B(c,x,y,ang+rr(-.3,.3),rr(2.5,4.5),rr(1.6,2.4),k>.5?pk(sp('F2C8B8 EBC98A F6D6A8')):k>.15?pk(sp('B9C6E6 C8B6DC A8C4D8')):s*ny>0?pk(RN):pk(RK),.8);}
const so=ln/Math.hypot(ln,L3[2]);for(const t0 of sm){for(let s=-1;s<=1.01;s+=.2){const[x,y]=P(t0+rr(-.004,.004)*d/10,s);B(c,x,y,ang+PI/2+rr(-.15,.15),rr(2.5,4),rr(1.8,2.4),gc(K(s)),.8);}Ln(c,[P(t0+2.4/d,so-.35),P(t0+2.4/d,so+.3)],1.1,'#FFF6E0',.75);}
if(K(so)>.7){const t1=rr(.15,.3);Ln(c,[P(t1,so),P(t1+rr(.16,.24),so*1.03)],1.3,'#FFF8E6',.9);}c.restore();}
function cap(c,x,y,r,hl){const o=[];for(let q=0;q<2*PI;q+=2/r)o.push([x+Math.cos(q)*r,y+Math.sin(q)*r,Math.cos(q),Math.sin(q)]);EC.push(...o);c.save();rag(c,o);c.globalAlpha=1;c.fillStyle='#D2CADC';c.fill();c.clip();
for(let i=0;i<r*r*.95;i++){const q=rr(0,2*PI),nn=Math.sqrt(R()),cq=Math.cos(q)*L3[0]+Math.sin(q)*L3[1],be=ss(.66,1,nn)*1.25,k=Math.sin(be)*cq+Math.cos(be)*(.53+.18*nn*cq);B(c,x+Math.cos(q)*nn*r,y+Math.sin(q)*nn*r,q+PI/2+rr(-.25,.25),rr(3,6.5),rr(1.8,2.8),rc(k,Math.sin(q),nn),.9);}c.restore();
c.lineWidth=1.2;for(let j=0;j<3;j++){const q0=-2.7+j*2.1+rr(-.3,.3),q1=q0+rr(.9,1.3),m=(q0+q1)/2;c.globalAlpha=.45;c.strokeStyle=gc(.3+Math.cos(m)*L3[0]+Math.sin(m)*L3[1]);c.beginPath();c.arc(x,y,r*.66,q0,q1);c.stroke();}
if(hl){c.strokeStyle='#FFF8E6';c.lineWidth=1.3;c.globalAlpha=.9;c.beginPath();c.arc(x,y,r*.84,-2.6,-2.05);c.stroke();}}
function base(c){const x0=PX,y0=PY,hb=19.5,ht=14,yt=285,o=[];c.save();c.filter='blur('+(.8*DP*S)+'px)';c.globalAlpha=.6;c.fillStyle='#4A4E74';c.beginPath();c.ellipse(x0+2,y0+.8,hb+2.5,2.6,0,0,7);c.fill();c.restore();for(let y=yt;y<=y0-6;y+=2)for(const s of[-1,1])o.push([x0+s*lp(ht,hb,(y-yt)/(y0-yt)),y,s,0]);EC.push(...o);
c.save();c.beginPath();c.moveTo(x0-hb,y0);c.quadraticCurveTo(x0,y0+3.4,x0+hb,y0);c.lineTo(x0+ht,yt+2);c.quadraticCurveTo(x0+ht,yt-.6,x0+ht-3.5,yt-.9);c.lineTo(x0-ht+3.5,yt-.9);c.quadraticCurveTo(x0-ht,yt-.6,x0-ht,yt+2);c.closePath();c.globalAlpha=1;c.fillStyle='#D0C8DA';c.fill();c.clip();
for(let i=0;i<300;i++){const y=rr(yt-2,y0+3.5),w=lp(ht,hb,(y-yt)/(y0-yt)),s=rr(-1,1),x=x0+s*w,k=s*L3[0]+Math.sqrt(1-s*s)*L3[2];B(c,x,y,PI/2+rr(-.08,.08),rr(4,8),rr(2,3),y>y0-1.6?pk(C.gy):rc(k,.5,Math.abs(s)),.9);}c.restore();
for(let s=-1;s<=1.01;s+=.16)B(c,x0+s*ht,yt+.5,rr(-.1,.1),3.2,2.2,gc(s*L3[0]+Math.sqrt(Math.max(0,1-s*s))*L3[2]),.8);Ln(c,[[x0-10,yt+3.5],[x0-11,y0-4]],1.3,'#FFF8E6',.85);}
const M=[460,249],A=[.866,-.5],BU=(u,v)=>[M[0]+A[0]*u+.5*v,M[1]+A[1]*u+.866*v],UG=37,J6=BU(48,-13),J2=[PX,249];
const J4=(()=>{const l1=70,l2=67,dx=J6[0]-J2[0],dy=J6[1]-J2[1],d=hy(dx,dy),q=Math.atan2(dy,dx)+Math.acos(cl((l1*l1+d*d-l2*l2)/(2*l1*d),-1,1));return[J2[0]+Math.cos(q)*l1,J2[1]+Math.sin(q)*l1];})();
const br=m=>m<2.6?4.6:m<20?3.9+.3*m/20:m<30?4.2+6.6*ss(20,30,m):m<68?10.8:10.8*Math.sqrt(Math.max(0,1-((m-68)/4.3)**2));
function bottle(c){c.save();c.translate(M[0],M[1]);c.rotate(Math.atan2(A[1],A[0]));
c.beginPath();for(let x=0;x<=72;x+=.5)c.lineTo(x,-br(x));for(let x=72;x>=0;x-=.5)c.lineTo(x,br(x));c.closePath();c.globalAlpha=1;c.fillStyle='#2F5A3A';c.fill();c.save();c.clip();
for(let i=0;i<820;i++){const x=rr(-2,74),r=br(x),y=rr(-r,r),s=y/(r+.01),k=.4-.55*s+.15*(1-s*s)+rr(-.12,.12);B(c,x,y,rr(-.05,.05),rr(4,9),rr(1.5,2.4),s>.72&&R()<.55?pk(C.br):k<.25?pk(C.bd):k<.55?pk(C.bm):pk(C.bl),.92);}
c.beginPath();c.rect(51.5,-12,12,24);c.clip();c.globalAlpha=1;c.fillStyle='#E0D2BC';c.fillRect(51.5,-12,12,24);
for(let i=0;i<150;i++){const x=rr(50.5,64.5),y=rr(-11,11),s=y/10.8,k=.5-.55*s+.1*(1-s*s)+rr(-.1,.1);B(c,x,y,rr(-.05,.05),rr(3,6),rr(1.4,2.2),k>.55?pk(sp('F2E4C4 EFDEBA F4E8CC ECDAB4')):k>.3?pk(sp('DDCDB6 D8CAB8 E2D4BC')):pk(sp('B4A8BC ACA2B8 B8ACBE')),.92);}
Ln(c,[[52.8,-10],[52.8,10]],.7,'#C8A860',.5);Ln(c,[[62.2,-10],[62.2,10]],.7,'#C8A860',.5);D(c,57.5,-1.5,0,4.5,1,'#7A6A5A',.45);D(c,57.5,1.8,0,3,.8,'#9A8A70',.4);c.restore();
Ln(c,[[31,-8.6],[40,-9.6],[50.5,-9.6]],1.8,'#B9C46A',.85);Ln(c,[[64,-9.4],[67,-9.2]],1.6,'#B9C46A',.8);Ln(c,[[3,-2.6],[19,-2.9]],1.2,'#B9C46A',.8);Ln(c,[[33,-8],[37,-9]],1.5,'#EEF0C8',.95);
Ln(c,[[.4,-4.6],[.4,4.6]],1.5,'#7E9A5A',.9);Ln(c,[[2.6,-4.4],[2.6,4.4]],.9,'#24483A',.6);c.restore();}
function hand(c,ph){c.save();c.translate(M[0],M[1]);c.rotate(Math.atan2(A[1],A[0]));const u0=UG+1.5,v0=-2.6;
if(!ph){c.save();c.beginPath();c.roundRect(u0-5.2,v0-20,10.4,41,3);c.globalAlpha=1;c.fillStyle='#CFC6DA';c.fill();c.clip();
for(let i=0;i<190;i++){const x=rr(u0-6,u0+6),y=rr(v0-21,v0+19),s=(y-v0)/19,e=(x-u0)/5.2;B(c,x,y,PI/2+rr(-.06,.06),rr(3.5,7),rr(1.6,2.4),rc(.5-.6*s-.12*e,.3,Math.abs(e)),.92);}
for(const y of[v0-12.6,v0+12.6])D(c,u0,y,0,10,1.2,'#7D819E',.75);c.restore();Ln(c,[[u0-3.2,v0-17.5],[u0-3.2,v0-12]],1.2,'#FFF8E6',.9);}
else for(const sg of[-1,1]){const a=sg*8.4,b=sg*15.4,y0=Math.min(a,b),h=Math.abs(b-a);c.save();c.beginPath();c.roundRect(UG-2.7,y0,5.4,h,1.4);c.globalAlpha=1;c.fillStyle='#727694';c.fill();c.clip();
for(let i=0;i<26;i++){const x=rr(UG-3,UG+3),y=rr(y0-.5,y0+h+.5);B(c,x,y,PI/2+rr(-.1,.1),rr(2.5,4.5),rr(1.4,2),sg<0?(x<UG-.8?pk(C.gy):pk(C.gq)):(x<UG-.8?pk(C.gq):pk(C.gd)),.95);}
c.fillStyle='#4E5478';c.globalAlpha=.8;c.fillRect(UG-2.7,sg<0?a-1.6:a,5.4,1.6);c.restore();if(sg<0)Ln(c,[[UG-1.6,b+1],[UG-1.6,a-2]],.8,'#E6E6F0',.85);}
c.restore();}
const DS=DP*S,TW=2*PI/15,SPK=[],WS=[];let BD=null,EC=[],RS=[];
const mkb=(x0,y0,x1,y1)=>{const ox=Math.floor(x0*DS),oy=Math.floor(y0*DS),o=document.createElement('canvas');o.width=Math.ceil(x1*DS)-ox;o.height=Math.ceil(y1*DS)-oy;const c=o.getContext('2d');c.setTransform(DS,0,0,DS,-ox,-oy);c.lineCap='round';c.lineJoin='round';return{o,c,ox,oy};};
function edges(RD,cs,own){const w=cv.width,g=(Q,x,y)=>{const i=(Math.round(y*DS)*w+Math.round(x*DS))*4;return[Q[i],Q[i+1],Q[i+2]];},df=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2]),rg=a=>'rgb('+a+')';let k=0;
EC.forEach(([x,y,nx,ny],i)=>{while(i>=own[k][0])k++;const c=cs[own[k][1]],bo=g(BD,x+nx*3,y+ny*3),ro=g(RD,x+nx*3,y+ny*3),ri=g(RD,x-nx*3,y-ny*3),bi=g(BD,x-nx*3,y-ny*3);if(df(bo,ro)>24||df(ri,bi)<30)return;const sh=nx*LX+ny*LY<-.1,a=Math.atan2(nx,-ny);
if(R()<(sh?.75:.15))B(c,x-nx*rr(0,2),y-ny*rr(0,2),a+rr(-.2,.2),rr(4,9),rr(1.8,3),rg(bo),.75);if(R()<(sh?.35:.3))B(c,x+nx*rr(.3,1.8),y+ny*rr(.3,1.8),a+rr(-.2,.2),rr(3,7),rr(1.4,2.4),rg(ri),sh?.5:.7);});}
const BG=(x,y)=>{const w=cv.width,i=(Math.round(y*DS)*w+Math.round(x*DS))*4;return'rgb('+BD[i]+','+BD[i+1]+','+BD[i+2]+')';};
function robot(c){sd(201);c.save();c.setTransform(1,0,0,1,0,0);BD=c.getImageData(0,0,cv.width,cv.height).data;c.restore();EC=[];
const s1=mkb(534,168,624,274),s2=mkb(474,168,582,234),s3=mkb(444,188,542,268),own=[],mo=k=>own.push([EC.length,k]);
lk(c,PX,292,J2[0],J2[1],11.4,11.4,[]);base(c);mo(0);lk(s1.c,J2[0],J2[1],J4[0],J4[1],11.2,10.4,[.36]);cap(s1.c,J2[0],J2[1],13.8,1);mo(1);
lk(s2.c,J4[0],J4[1],J6[0],J6[1],9.8,8.2,[.5]);cap(s2.c,J4[0],J4[1],12.6,1);mo(2);cap(s3.c,J6[0],J6[1],8.6,1);const F=BU(UG+1.5,-2.6);lk(s3.c,J6[0],J6[1],F[0],F[1],6.4,6.4,[]);hand(s3.c,0);bottle(s3.c);hand(s3.c,1);mo(3);
const[,q]=mk();q.setTransform(1,0,0,1,0,0);q.drawImage(c.canvas,0,0);RS=[s1,s2,s3];for(const s of RS)q.drawImage(s.o,s.ox,s.oy);edges(q.getImageData(0,0,cv.width,cv.height).data,[c,s1.c,s2.c,s3.c],own);}
const GL=(c,k)=>{const g=k?c.createRadialGradient(452,262,4,452,262,70):c.createRadialGradient(330,120,10,330,120,420),a=k?'rgba(255,226,160,':'rgba(255,214,150,';g.addColorStop(0,a+(k?'.7)':'.55)'));g.addColorStop(1,a+'0)');c.fillStyle=g;k?c.fillRect(370,180,170,170):c.fillRect(280,0,420,430);};
const glow=c=>{c.globalCompositeOperation='soft-light';c.globalAlpha=.5;GL(c,0);GL(c,1);c.globalCompositeOperation='source-over';c.globalAlpha=1;};
const glowS=s=>{const t=document.createElement('canvas');t.width=s.o.width;t.height=s.o.height;const c=t.getContext('2d');for(const k of[0,1]){c.setTransform(1,0,0,1,0,0);c.globalCompositeOperation='source-over';c.clearRect(0,0,t.width,t.height);c.setTransform(DS,0,0,DS,-s.ox,-s.oy);c.globalAlpha=.5;GL(c,k);c.globalAlpha=1;c.setTransform(1,0,0,1,0,0);c.globalCompositeOperation='destination-in';c.drawImage(s.o,0,0);s.c.save();s.c.setTransform(1,0,0,1,0,0);s.c.globalCompositeOperation='soft-light';s.c.drawImage(t,0,0);s.c.restore();}};
const gx=452,GB=293,GR=258,Yv=v=>GB-v*(GB-GR),vv=y=>(GB-y)/(GB-GR),hw=v=>(v=cl(v,0,1),12.9*Math.sqrt(Math.max(0,v<.42?1-((.42-v)/.42)**2:1-((v-.42)/1.02)**2))),bowl=c=>{c.beginPath();for(let v=0;v<=1.0001;v+=.025)c.lineTo(gx-hw(v),Yv(v));for(let v=1;v>=-.0001;v-=.025)c.lineTo(gx+hw(v),Yv(v));c.closePath();};
function gback(c){sd(211);const WL=279;
c.globalAlpha=.3;c.fillStyle='#FBF8F0';c.beginPath();c.ellipse(gx,313,10.5,2.2,0,0,7);c.fill();c.lineWidth=1.1;c.strokeStyle='#C8CCDC';c.globalAlpha=.7;c.beginPath();c.ellipse(gx,313,10.5,2.2,0,PI,2*PI);c.stroke();
c.strokeStyle='#FFFBF0';c.globalAlpha=.9;c.lineWidth=1.3;c.beginPath();c.ellipse(gx,313,10.5,2.2,0,.1,PI-.1);c.stroke();
c.globalAlpha=.75;c.fillStyle='#EEF2F4';c.beginPath();c.moveTo(gx-.9,308);c.lineTo(gx+.9,308);c.lineTo(gx+3.6,312.6);c.lineTo(gx-3.6,312.6);c.closePath();c.fill();
Ln(c,[[gx,GB],[gx,309]],1.7,'#E2E8EC',.85);Ln(c,[[gx-.45,GB+2],[gx-.45,308]],.7,'#FFFFFF',.95);c.globalAlpha=.85;c.fillStyle='#E6ECEE';c.beginPath();c.ellipse(gx,GB+.6,2.2,1.3,0,0,7);c.fill();
c.save();bowl(c);c.clip();for(let i=0;i<70;i++){const x=gx+rr(-15,15),y=rr(GR,WL);B(c,x,y,rr(-.1,.1),rr(3,6),rr(1.4,2.2),BG(gx+(x-gx)*1.45,y-3),.7);}
{const r0=R;sd(213);for(let i=0;i<30;i++){const y=rr(WL-2,GB),h=hw(vv(y)),x=gx+rr(-h-1,h+1);B(c,x,y,rr(-.1,.1),rr(3,6),rr(1.4,2.2),BG(gx+(x-gx)*1.45,y-3),.7);}R=r0;}
c.globalAlpha=.12;c.fillStyle='#F4F8FA';c.fillRect(gx-16,GR-3,32,40);c.restore();
const A1=sp('F6E6B0 F2D98A FFF0C8'),A2=sp('E8C65A E0B850 D9B85A'),A3=sp('F2D98A E8C65A F6E6B0'),ws=(a,b)=>{const y=rr(a,b),h=hw(vv(y)),x=gx+rr(-h,h),s=(x-gx)/(h+.1);WS.push([x,y,rr(-.2,.2),rr(3,6),rr(1.2,2),s<-.3?pk(A1):s>.4?pk(A2):pk(A3)]);};
for(let i=0;i<34;i++)ws(WL+1,GB);sd(214);for(let i=0;i<40;i++)ws(256,WL+1);sd(215);for(const w of WS)w.push(rr(0,6.3),1+Math.floor(R()*3));}
const CA=mkb(460,309,484,322);{const c=CA.c;c.filter='blur('+(.8*DS)+'px)';c.globalAlpha=.7;c.fillStyle='#F2D98A';c.beginPath();c.ellipse(472,315.7,6,1.4,.12,0,7);c.fill();c.fillStyle='#FFF6DA';c.beginPath();c.ellipse(471,315.5,2.4,.7,.12,0,7);c.fill();}
const CB=mkb(456,307,490,325);{const c=CB.c;c.filter='blur('+(1.5*DS)+'px)';c.globalAlpha=.55;c.fillStyle='#F4D47A';c.beginPath();c.ellipse(473,316,9.5,2.4,.12,0,7);c.fill();c.globalAlpha=.65;c.fillStyle='#FFF4CC';c.beginPath();c.ellipse(471.5,315.6,4,1.1,.12,0,7);c.fill();}
const F0=Math.atan2(A[1],A[0]),L1=70,L2=67,A10=Math.atan2(J4[1]-J2[1],J4[0]-J2[0]),A20=Math.atan2(J6[1]-J4[1],J6[0]-J4[0]),
PK=[[0,453,222,32],[2.5,459.4,248.2,4],[6,460,249,0],[9,460.4,249.5,-3.5],[10.5,451.6,226.9,26.6],[13.25,451.2,225.7,28.6],[14.2,453,222,32],[15,453,222,32]],
PV=[[0,0,0],[.25,.25,-1.15],[.13,.12,-1.12],[0,0,-.4],[-.2,-.45,1.1],[0,0,0],[0,0,0],[0,0,0]],
hm=(t,j)=>{let i=0;while(t>PK[i+1][0])i++;const a=PK[i],b=PK[i+1],h=b[0]-a[0],s=(t-a[0])/h,s2=s*s,s3=s2*s;return(2*s3-3*s2+1)*a[j]+(s3-2*s2+s)*h*PV[i][j-1]+(3*s2-2*s3)*b[j]+(s3-s2)*h*PV[i+1][j-1];},
rot=(a,x,y)=>[x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a)],
pose=t=>{const d=hm(t,3)*PI/180,m=[hm(t,1),hm(t,2)],j=rot(d,J6[0]-M[0],J6[1]-M[1]),J=[m[0]+j[0],m[1]+j[1]],dx=J[0]-J2[0],dy=J[1]-J2[1],dd=hy(dx,dy),q=Math.atan2(dy,dx)+Math.acos(cl((L1*L1+dd*dd-L2*L2)/(2*L1*dd),-1,1)),l=rot(d,1.4,3.2);return{m,d,f:F0+d,J,j4:[J2[0]+Math.cos(q)*L1,J2[1]+Math.sin(q)*L1],L:[m[0]+l[0],m[1]+l[1]]};};
const VT=[];{let a=0;for(let i=0;i<=400;i++){if(i)a+=(hw(i/400)**2+hw((i-1)/400)**2)/800;VT.push(a);}}
const vOf=V=>{let lo=0,hi=400;if(V<=0)return 0;while(hi-lo>1){const m=(lo+hi)>>1;VT[m]<V?lo=m:hi=m;}return(lo+(V-VT[lo])/(VT[hi]-VT[lo]||1))/400;};
const V0=VT[20],V6=VT[160],G=4265,K=3;
let n=0,PT=[],RP=[],V=V0,zs=0,zv=0,Ve=0,EM=0,pid=0,LL=[0,0],brk=-99,bead=0,LA=-99,LR=-99,XL=gx,QL=0,QN=0,DN=0,LIP=[0,0],FC=0,KB=.09,Q0=48,CE=150,KS=1,QR=12,VR=95,QE=0;
const reset=()=>{PT=[];RP=[];V=V0;zs=zv=Ve=QE=0;EM=0;pid=0;LL=pose(0).L;LIP=LL;brk=-99;bead=0;LA=LR=-99;QL=QN=DN=0;};
function sim(){n++;const st=n%900,t=st/60;if(st===0){reset();return;}if(st===RST)reset();
const P=pose(t),L=P.L,lv=[(L[0]-LL[0])*60,(L[1]-LL[1])*60];LL=L;LIP=L;
for(const p of PT){p.vy+=G/60;p.x+=p.vx/60;p.y+=p.vy/60;}
const d=FC-KB*Ve-P.f*180/PI;QE+=((d>0?Q0*d**1.5:0)-QE)*.15;const Q=QE>.05*QR?QE:0;QN=Q;DN=d;
if(Q>0){if(!EM)pid++;const v=CE*Math.sqrt((Q/Q0)**(2/3)),ax=-Math.cos(P.f),ay=-Math.sin(P.f);for(let j=0;j<K;j++){const a=(K-1-j+.5)/K/60,vx=v*ax+lv[0],vy=v*ay+lv[1];PT.push({x:L[0]+vx*a,y:L[1]+vy*a+G*a*a/2,vx,vy:vy+G*a,q:Q/60/K,id:pid++,b:n-a*60});}Ve+=Q/60;EM=1;}
else if(EM){EM=0;if(t>8)brk=n;}
if(brk>0){const k=n-brk;bead=k>5&&k<24?(k-5)/18:0;if(k===24){PT.push({x:L[0],y:L[1]+1.4,vx:lv[0],vy:lv[1]+15,q:.04,id:-9,b:n,d:1});brk=-99;bead=0;}}
const yl=Yv(vOf(V)),hl=hw(vv(yl));
PT=PT.filter(p=>{const dx=p.x-gx;if(p.y>GR&&p.y<GB){const h=hw(vv(p.y))-.6;if(Math.abs(dx)>h&&Math.abs(dx)<h+4){p.x=gx+Math.sign(dx)*h;p.vx=0;}}
if(p.y>=yl+zs*(p.x-gx)&&Math.abs(p.x-gx)<hl+1){V+=p.q;zv+=KS*(p.d?8:.5*cl((V-V0)/24,0,1))*p.q*p.vy*cl((p.x-gx)/(hl+1),-1,1)/(V+60);XL=p.x;LA=n;QL=p.q;if(p.d||n-LR>13){RP.push({x:p.x,b:n,g:p.d?1:0});LR=n;}return false;}return p.y<335;});
zv+=(-150*zs-1.25*zv)/60;zs+=zv/60;RP=RP.filter(r=>n-r.b<54);}
const runTo=N=>{reset();n=0;let mx=0;for(let i=0;i<N;i++){sim();if(n>=585)mx=Math.max(mx,Math.abs(zs));}return mx;};
const fit=()=>{let a=.07,b=.11;KB=a;runTo(360);let ea=V-V6;KB=b;runTo(360);let eb=V-V6;for(let i=0;i<10&&Math.abs(eb)>1e-4;i++){const c=b-eb*(b-a)/(eb-ea);a=b;ea=eb;b=c;KB=b;runTo(360);eb=V-V6;}};
const calib=()=>{FC=pose(2.35).f*180/PI;fit();CE=VR/Math.sqrt(Math.max(DN,.01));fit();QR=QN;KS=1;const m=runTo(700);KS=m>1e-6?.09/m:1;reset();n=0;};
const GW=mkb(426,226,486,322),GP=document.createElement('canvas');GP.width=GW.o.width;GP.height=GW.o.height;
function wine(c,yl,s,al,t){const h=hw(vv(yl)),k=s;c.save();bowl(c);c.clip();c.beginPath();c.moveTo(gx-16,yl-16*k);c.lineTo(gx+16,yl+16*k);c.lineTo(gx+16,GB+3);c.lineTo(gx-16,GB+3);c.closePath();c.clip();
const g=c.createLinearGradient(gx-14,0,gx+14,0);g.addColorStop(0,'#F6E6B0');g.addColorStop(.45,'#F2D98A');g.addColorStop(1,'#E8C65A');c.globalAlpha=.93*al;c.fillStyle=g;c.fillRect(gx-16,yl-6,32,GB-yl+9);
for(const[x,y,a,l,w,col,p,m]of WS)if(y>yl-3)B(c,x,y,a,l,w,col,.75*al*(.84+.16*Math.sin(TW*m*t+p)));
Ln(c,[[gx-10,yl+3],[gx-9.5,yl+8],[gx-6.5,yl+13]],1.3,'#FFF6DA',.9*al*(.86+.14*Math.sin(TW*3*t)));c.restore();
const ww=h-.6;if(ww<1.2)return;c.save();bowl(c);c.clip();c.translate(gx,yl);c.rotate(Math.atan(k));c.globalAlpha=.95*al;c.fillStyle='#F6E6B0';c.beginPath();c.ellipse(0,0,ww,1.8,0,0,7);c.fill();c.strokeStyle='#FFF6DA';c.lineWidth=1.2;c.beginPath();c.ellipse(0,0,ww-.3,1.6,0,.15,PI-.15);c.stroke();c.strokeStyle='#E8C65A';c.lineWidth=.8;c.beginPath();c.ellipse(0,0,ww-.4,1.5,0,PI+.3,2*PI-.3);c.stroke();c.restore();}
function stream(c,t,ys){const sg=[];let pv=null;
for(const p of PT){if(p.d){c.save();c.translate(p.x,p.y);c.rotate(Math.atan2(p.vy,p.vx));c.globalAlpha=.95;c.fillStyle='#E8C65A';c.beginPath();c.ellipse(0,0,2,1.15,0,0,7);c.fill();c.fillStyle='#FFF6DA';c.beginPath();c.arc(-.3,-.45,.45,0,7);c.fill();c.restore();continue;}
const a=(n-p.b)/60,x=p.x+.32*Math.sin(p.id*.53+t*7.3)*Math.min(1,a*14),w=2.5*Math.sqrt(p.q*60*K/QR)*Math.pow(VR/hy(p.vx,p.vy),.25);if(pv&&p.id===pv[0]+1)sg.push([pv[1],pv[2],x,p.y,(pv[3]+w)/2,a,p.id]);pv=[p.id,x,p.y,w];}
if(EM&&pv&&pv[0]===pid-1)sg.push([pv[1],pv[2],LIP[0],LIP[1],pv[3],0,pid]);
for(const s of sg)Ln(c,[[s[0],s[1]],[s[2],s[3]]],s[4],'#E8C65A',.95);for(const s of sg)Ln(c,[[s[0]-.3,s[1]],[s[2]-.3,s[3]]],s[4]*.6,'#F2D98A',.95);
for(const s of sg)if(s[5]<.07&&(s[6]+Math.floor(t*9))%9)Ln(c,[[s[0]-.7,s[1]],[s[2]-.7,s[3]]],.7,'#FFF6DA',.95*(.75+.25*Math.sin(t*13+s[6]*.4)));
if(n-LA<4){const k=Math.min(1,Math.sqrt(QL*60*K/QR)),e=[XL,ys(XL)],hs=hw(vOf(V));c.save();bowl(c);c.clip();c.strokeStyle='#FFF6DA';c.globalAlpha=.9;c.lineWidth=.8;c.beginPath();c.ellipse(e[0],e[1]+.3,Math.max(.5,Math.min(hs*.7,4.2*k+.3*Math.sin(t*21))),Math.min(1,hs*.2),0,0,7);c.stroke();D(c,e[0]-3+.5*Math.sin(t*17),e[1]-2-.4*Math.sin(t*23),0,.5,1.2,'#FFF6DA',.9*k);D(c,e[0]+2.6+.4*Math.sin(t*19+1),e[1]-1.6-.4*Math.sin(t*29),0,.5,1,'#FFF6DA',.9*k);c.restore();}
if(bead>0){const r=.5+.9*bead;c.globalAlpha=.95;c.fillStyle='#E8C65A';c.beginPath();c.arc(LIP[0],LIP[1]+r*.8,r,0,7);c.fill();c.fillStyle='#FFF6DA';c.beginPath();c.arc(LIP[0]-.3*r,LIP[1]+r*.5,r*.35,0,7);c.fill();}}
function gdraw(t){const c=GW.c;c.setTransform(1,0,0,1,0,0);c.globalCompositeOperation='source-over';c.globalAlpha=1;c.drawImage(GP,0,0);c.setTransform(DS,0,0,DS,-GW.ox,-GW.oy);
const sg=SG(t),sun=1-ss(.05,.95,sg),wa=lp(.58,1,sun),xf=ss(TA,TB,t),vl=vOf(V),yl=Yv(vl),hl=hw(vl),y0=Yv(.05),ge=sun*ss(10.3,10.9,t)*(1-ss(12.1,12.7,t)),kv=v=>.15+.85*Math.pow(cl((v-V0)/(V6-V0),0,1.35),.7),zk=.13*Math.tanh(zs/.13),ys=x=>yl+zk*(x-gx),
kc=sun*lp(kv(V),.15,xf)*(1+.06*Math.sin(TW*5*t)+.7*ge*(.8+.2*Math.sin(t*9)));c.globalAlpha=Math.min(1,kc);const cw=CA.o.width/DS,ch=CA.o.height/DS,cx=CA.ox/DS+18*zk;c.drawImage(CA.o,cx,CA.oy/DS,cw,ch);if(kc>1){c.globalAlpha=Math.min(1,kc-1);c.drawImage(CA.o,cx,CA.oy/DS,cw,ch);}if(ge>.01){c.globalAlpha=ge*(.8+.2*Math.sin(t*6.1+zk*36))*(1-xf);c.drawImage(CB.o,CB.ox/DS+24*zk,CB.oy/DS,CB.o.width/DS,CB.o.height/DS);}
if(xf>0&&V>V0+.5){wine(c,y0,0,wa,t);wine(c,yl,zk,wa*(1-xf),t);}else wine(c,yl,zk,wa,t);
for(const r of RP)for(const o of r.g?[0,.3]:[0]){const a=(n-r.b)/54-o;if(a<=0)continue;const rd=r.g?1.5+8*a:1.2+5*a,ra=(r.g?1:.5)*Math.pow(1-a,.7)*(1-xf)*(o?.6:1),ex=r.x-gx,ey=rd*.34;c.save();bowl(c);c.clip();c.translate(gx,yl);c.rotate(Math.atan(zk));c.beginPath();c.ellipse(0,0,Math.max(.5,hl-.5),Math.min(2.6,hl*.25),0,0,7);c.clip();c.lineWidth=r.g?1:.8;c.globalAlpha=ra;c.strokeStyle='#FFFDF2';c.beginPath();c.ellipse(ex,0,rd,ey,0,.15,PI-.15);c.stroke();c.globalAlpha=ra*.85;c.strokeStyle='#C9A040';c.beginPath();c.ellipse(ex,0,rd,ey,0,PI+.2,2*PI-.2);c.stroke();c.restore();}
if(ge>.01){const x=gx-hl*.36+zk*6,y=yl+1,g=c.createRadialGradient(x,y,0,x,y,4.2);g.addColorStop(0,'rgba(255,253,240,.95)');g.addColorStop(1,'rgba(255,246,218,0)');c.globalAlpha=ge*(.75+.25*Math.sin(t*7.7+zk*24));c.fillStyle=g;c.fillRect(x-5,y-5,10,10);D(c,x,y,-.1,3.8,1,'#FFFFFF',ge*.9);D(c,x+2.6,y+.3,-.1,1.6,.8,'#FFF8E0',ge*.6);}
c.strokeStyle='#E6EEF2';c.globalAlpha=.6;c.lineWidth=.9;c.beginPath();c.ellipse(gx,GR,hw(1),1.4,0,PI,2*PI);c.stroke();stream(c,t,ys);
c.save();bowl(c);c.clip();c.globalAlpha=.12;c.fillStyle='#F4F8FA';c.fillRect(gx-16,GR,32,Math.max(0,lp(yl,y0,xf)-GR));c.restore();
c.strokeStyle='#FFFBF0';c.globalAlpha=.95;c.lineWidth=1.2;c.beginPath();c.ellipse(gx,GR,hw(1),1.4,0,.05,1.35);c.stroke();c.beginPath();c.ellipse(gx,GR,hw(1),1.4,0,1.75,3.1);c.stroke();
const side=(sg,v0,v1,w,col,al)=>{const p=[];for(let v=v0;v<=v1;v+=.03)p.push([gx+sg*(hw(v)-.5),Yv(v)]);Ln(c,p,w,col,al);};
side(-1,.06,.42,1.3,'#FFFBF0',.9);side(-1,.52,.97,1.2,'#FFFBF0',.85);side(1,.08,.4,.9,'#D8E2EC',.7);side(1,.58,.98,.9,'#D8E2EC',.75);side(-1,0,.1,1,'#F4F8FA',.6);side(1,0,.1,1,'#F4F8FA',.6);
Ln(c,[[gx-8.5,GR+6],[gx-9.6,GR+13]],1.5,'#FFFFFF',.95);glow(c);}
function rdraw(P){const a1=Math.atan2(P.j4[1]-J2[1],P.j4[0]-J2[0]),a2=Math.atan2(P.J[1]-P.j4[1],P.J[0]-P.j4[0]),T=[[J2,a1-A10,J2],[P.j4,a2-A20,J4],[P.m,P.d,M]];
RS.forEach((s,i)=>{const[p,r,p0]=T[i];if(Math.abs(r)+Math.abs(p[0]-p0[0])+Math.abs(p[1]-p0[1])<1e-7){X.setTransform(1,0,0,1,0,0);X.drawImage(s.o,s.ox,s.oy);return;}X.setTransform(DS,0,0,DS,0,0);X.translate(p[0],p[1]);X.rotate(r);X.translate(-p0[0],-p0[1]);X.drawImage(s.o,s.ox/DS,s.oy/DS,s.o.width/DS,s.o.height/DS);});}
const TS=document.createElement('canvas');TS.width=W;TS.height=H;const tc=TS.getContext('2d'),FM=document.createElement('canvas');FM.width=W;FM.height=H;
const EW=560,EX=280,EN=document.createElement('canvas'),SF=document.createElement('canvas');EN.width=Math.ceil(EW*S);EN.height=H;SF.width=W;SF.height=H;
const XC=t=>lp(240,740,cl((t-12.5)/2.5,0,1)),EV=t=>ss(12.5,13.25,t)*(1-ss(14.35,15,t)),SGA=[],SAA=[],SG=t=>0;let TA=13.3,TB=14.1,RST=850;
function shadow(t){const e=EV(t);if(t<12.5||e<.01)return;const x0=XC(t)-EX,sx=Math.max(Math.floor(350*S),Math.floor(x0*S)),sw=Math.min(W,Math.ceil((x0+EW)*S))-sx,sy=Math.floor(14*S),sh=H-sy;if(sw<=0)return;tc.setTransform(1,0,0,1,0,0);tc.globalCompositeOperation='source-over';tc.globalAlpha=1;tc.clearRect(sx,sy,sw,sh);tc.save();tc.beginPath();tc.rect(sx,sy,sw,sh);tc.clip();tc.globalAlpha=e;tc.drawImage(EN,x0*S,0);tc.globalAlpha=1;tc.globalCompositeOperation='source-in';tc.drawImage(SF,sx,sy,sw,sh,sx,sy,sw,sh);tc.restore();
X.setTransform(1,0,0,1,0,0);X.globalAlpha=1;X.globalCompositeOperation='multiply';X.drawImage(TS,sx,sy,sw,sh,sx*DP,sy*DP,sw*DP,sh*DP);X.globalCompositeOperation='source-over';}
const wind=(x,y,t)=>(.78+.22*Math.sin(TW*t+1.3))*(.7*Math.sin(TW*4*t-x*.021+y*.006)+.3*Math.sin(TW*7*t-x*.037+2.1));
let Mo,BO,PA=[],SPP=[],SHM=[];
function draw(){const t=(n%900)/60;X.setTransform(1,0,0,1,0,0);X.globalAlpha=1;X.globalCompositeOperation='source-over';X.drawImage(BO,0,0);X.setTransform(DS,0,0,DS,0,0);
for(const[s,x,y,am]of PA)X.drawImage(s.o,s.ox/DS+am*wind(x,y,t),s.oy/DS+.35*am*wind(x+57,y+31,t+1.7),s.o.width/DS,s.o.height/DS);
for(const[a,p,m,q,k]of SPP)B(X,a[0]+.9*Math.sin(TW*k*t+q),a[1],a[2],a[3],a[4],a[5],a[6]*(.58+.42*Math.sin(TW*m*t+p)));
for(const d of SHM){const f=Math.sin(TW*d[8]*t+d[7]);if(f>.05)B(X,d[0]+1.3*Math.sin(TW*2*t+d[9]),d[1],d[2],d[3],d[4],d[5],d[6]*f*Math.sqrt(f));}
gdraw(t);X.setTransform(1,0,0,1,0,0);X.globalAlpha=1;X.drawImage(GW.o,GW.ox,GW.oy);rdraw(pose(t));}
function render(){const[Po,P]=mk();under(P);sky(P);mtn(P);sea(P);pine(P);shrubs(P);earth(P);table(P);robot(P);gback(P);GP.getContext('2d').drawImage(Po,GW.ox,GW.oy,GW.o.width,GW.o.height,0,0,GW.o.width,GW.o.height);
const[mo,Mc]=mk();Mo=mo;Mc.fillStyle='#000';Mc.fillRect(348,-5,400,440);sd(3);for(let i=0;i<1600;i++){const x=rr(299,356),y=rr(-5,430);if(R()>Math.pow(cl((x-299)/50,0,1),1.1))continue;D(Mc,x,y,rr(-.35,.35),rr(10,28),rr(4,9),'#000',1);}
glow(P);P.setTransform(1,0,0,1,0,0);P.globalAlpha=1;P.globalCompositeOperation='destination-in';P.drawImage(Mo,0,0);
const[bo,Bc]=mk();BO=bo;Bc.fillStyle='#FBF5E8';Bc.fillRect(-5,-5,700,440);under(Bc);sd(2);const xe=320;for(let i=0;i<17000;i++){const px=R()*(xe+30);if(px>xe-30&&R()>(xe+30-px)/60)continue;D(Bc,px,R()*425,rr(-.25,.25),rr(14,22),7,pk(C.wa),.92);}
Bc.setTransform(1,0,0,1,0,0);Bc.globalAlpha=1;Bc.drawImage(Po,0,0);RS.forEach(glowS);
{const c=FM.getContext('2d');c.drawImage(Mo,0,0,W,H);c.globalCompositeOperation='destination-in';const g=c.createLinearGradient(352*S,0,410*S,0);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'#000');c.fillStyle=g;c.fillRect(0,0,W,H);const o=document.createElement('canvas');o.width=W;o.height=H;const q=o.getContext('2d');q.scale(S,S);q.filter='blur('+(4*S)+'px)';q.fillStyle=q.strokeStyle='#000';q.globalAlpha=.6;q.beginPath();q.moveTo(280,440);for(let x=280;x<=690;x+=5)q.lineTo(x,mY(x)+2);q.lineTo(690,440);q.fill();q.globalAlpha=.85;for(const[x,y,a,b]of CN){q.beginPath();q.ellipse(x,y,a*.95,b*.9,0,0,7);q.fill();}q.globalAlpha=1;q.fillRect(280,HZ+4,420,240);q.lineWidth=9;q.beginPath();TR.forEach((p,i)=>i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));q.stroke();c.drawImage(o,0,0);}
{const c=EN.getContext('2d');c.scale(S,S);c.filter='blur('+(38*S)+'px)';c.globalAlpha=.6;c.fillStyle='#000';c.beginPath();for(let q=0;q<2*PI;q+=.05){const r=1+(fb(Math.cos(q)*1.6+7,Math.sin(q)*1.6+3)-.5)*.34;c.lineTo(EX+Math.cos(q)*150*r,248+Math.sin(q)*232*r);}c.closePath();c.fill();
const g=SF.getContext('2d');g.scale(S,S);g.lineCap='round';g.fillStyle='#968BC9';g.fillRect(330,0,370,440);sd(401);const cs=sp('8E82C4 8389C2 9C86BE 7A80BC A895C8 8C9CCB A28ABF');for(let i=0;i<2600;i++)B(g,rr(330,695),rr(0,435),-.15+rr(-.25,.25),rr(12,28),rr(5,10),pk(cs),rr(.3,.55));g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation='destination-in';g.drawImage(FM,0,0);
const w=EN.width,pf=(y0,y1,X0)=>{const r0=Math.round(y0*S),nr=Math.round((y1-y0)*S),d=c.getImageData(0,r0,w,nr).data,col=[],pr=[],k=Math.round(12*S);let mx=1e-6;for(let x=0;x<w;x++){let a=0;for(let y=0;y<nr;y++)a+=d[(y*w+x)*4+3];col.push(a/nr);}for(let x=0;x<w;x++){let a=0,m=0;for(let j=-k;j<=k;j++){const q=x+j;if(q>=0&&q<w){a+=col[q];m++;}}pr.push(a/m);mx=Math.max(mx,a/m);}const o=[];for(let i=0;i<=150;i++){const t=12.5+i/60,u=Math.round((X0-XC(t)+EX)*S);o.push(u>=0&&u<w?pr[u]/mx*EV(t):0);}return o;};
SGA.push(...pf(288,324,gx));SAA.push(...pf(200,290,570));const win=(A,th)=>{let a=-1,b=-1;A.forEach((v,i)=>{if(v>=th){if(a<0)a=i;b=i;}});return[12.5+a/60,12.5+b/60];};const[g0]=win(SGA,.6),[,g1]=win(SGA,.9),[a0,a1]=win(SAA,.8);TA=13.0;TB=14.0;RST=Math.round(TB*60)+2;PK[5][0]=12.8;PK[6][0]=14.2;}
sd(301);SPP=SPK.map(a=>[a,rr(0,6.3),3+Math.floor(R()*6),rr(0,6.3),1+Math.floor(R()*2)]);
const trx=y=>ip([[92,606],[120,618],[160,626],[205,633],[252,640],[300,647],[350,650]],y),inGW=(x,y,m)=>x>426-m&&x<486+m&&y>226-m&&y<322+m;
sd(302);const sc=sp('F4E9C9 EEF3F2 F8EED4 DDEBF2'),sb=sp('9DB4DC A9B2D8 B4D0EA');for(let i=0;i<600&&SHM.length<64;i++){const x=rr(362,684),y=rr(HZ+3,300),b=sY(x);if(y>b-4||inGW(x,y,8)||Math.abs(x-trx(y))<12)continue;const d=(y-HZ)/(b-HZ);SHM.push([x,y,rr(-.04,.04),lp(3,9,d)*rr(.7,1.2),lp(1.1,2,d),R()<.6?pk(sc):pk(sb),rr(.55,.9),rr(0,6.3),2+Math.floor(R()*4),rr(0,6.3)]);}
const[EM,Ec]=mk();earth(Ec);const pt=(x,y,rx,ry,am)=>{const s=mkb(x-rx,y-ry,x+rx,y+ry),c=s.c,w=s.o.width,h=s.o.height;c.setTransform(1,0,0,1,0,0);c.drawImage(BO,s.ox,s.oy,w,h,0,0,w,h);c.globalCompositeOperation='destination-out';c.drawImage(EM,s.ox,s.oy,w,h,0,0,w,h);c.globalCompositeOperation='destination-in';c.drawImage(Mo,s.ox,s.oy,w,h,0,0,w,h);c.setTransform(DS*rx,0,0,DS*ry,x*DS-s.ox,y*DS-s.oy);c.globalCompositeOperation='destination-in';const g=c.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,'#000');g.addColorStop(.45,'#000');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(-1,-1,2,2);return[s,x,y,am];};
for(const[x,y,a,b]of CN)PA.push(pt(x,y+1,a+6,b+5,1.1));
sd(303);const Z=[[418,286,632,345],[436,286,616,402],[572,244,624,314],[424,224,488,324]];for(let gy=228;gy<428;gy+=19)for(let gx=330;gx<690;gx+=24){const x=gx+rr(-6,6),y=gy+rr(-5,5),r=rr(15,19),ry=r*.8,k=.7;if(x<332||y-ry*.5<sY(x)||isE(x,y)||Z.some(z=>x+r*k>z[0]&&x-r*k<z[2]&&y+ry*k>z[1]&&y-ry*k<z[3])||(y-ry<sY(x)+4&&Math.abs(x-trx(y))<r+4))continue;PA.push(pt(x,y,r,ry,(.85+.55*cl((y-290)/130,0,1))*ss(318,372,x)));}for(const[x,y,r]of[[526,277,9],[540,274,11],[556,266,11],[556,279,9],[564,262,8]])PA.push(pt(x,y,r,r*.8,.85));}
render();calib();
return{sim:sim,draw:draw};
}
function mount(pg){
  var cv=document.createElement('canvas');
  cv.setAttribute('aria-hidden','true');
  cv.style.opacity=0;cv.style.transition='opacity .6s ease';
  pg.appendChild(cv);
  var hero=null,raf=0,lt=null,ac=0,visible=true,lastW=0;
  var still=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)');
  function build(){
    var w=pg.clientWidth;if(!w)return;lastW=w;
    /* Paint at no more than 2200 device pixels across; the canvas is stretched to fit, so every buffer stays small. */
    var dp=Math.min(2,window.devicePixelRatio||1),cw=Math.min(w,Math.round(2200/dp)),ch=Math.round(pg.clientHeight*cw/w);
    hero=paint({clientWidth:cw,clientHeight:ch},cv,dp);
    if(window.__HARNESS)cv.style.opacity=1;else requestAnimationFrame(function(){cv.style.opacity=1;});
    if(window.__HARNESS){var acc=0;window.__hero={step:function(dt){acc+=dt;while(acc>=1/60-1e-9){hero.sim();acc-=1/60;}},draw:function(){hero.draw();}};return;}
    if(still&&still.matches){for(var i=0;i<360;i++)hero.sim();hero.draw();return;}
    hero.draw();start();
  }
  function loop(ts){
    raf=0;if(!hero)return;
    if(lt===null)lt=ts;ac+=Math.min(.25,(ts-lt)/1000);lt=ts;
    var k=0;while(ac>=1/60&&k<4){hero.sim();ac-=1/60;k++;}if(k===4&&ac>=1/60)ac=0;
    if(k)hero.draw();start();
  }
  function start(){if(!raf&&visible&&!document.hidden&&!window.__HARNESS&&!(still&&still.matches))raf=requestAnimationFrame(loop);}
  function stop(){if(raf)cancelAnimationFrame(raf);raf=0;lt=null;ac=0;}
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){visible=es[0].isIntersecting;visible?start():stop();},{rootMargin:'80px'}).observe(pg);
  document.addEventListener('visibilitychange',function(){document.hidden?stop():start();});
  if(still&&still.addEventListener)still.addEventListener('change',function(){stop();build();});
  var rt=0;
  if('ResizeObserver' in window)new ResizeObserver(function(){var w=pg.clientWidth;if(Math.abs(w-lastW)<2)return;clearTimeout(rt);rt=setTimeout(function(){stop();build();},180);}).observe(pg);
  build();
}
window.Riviera={mount:mount};
})();
