/* =====================================================================
   ElectraSim VR 3D — KONTROL & OTOMASI
   Misi: M1 motor (Wiring Motor DOL (Direct On Line)) · M2 plc (Ladder PLC Start-Stop Pertamamu)
   Dimuat on-demand oleh index.html lewat ensureMission().
   ===================================================================== */

Object.assign(MISSIONS,{
 motor:{lvl:'JALUR 16 · KONTROL & OTOMASI',icon:'🎛️',title:'Wiring Motor DOL (Direct On Line)',strict:false,
  loc:'📍 Bengkel produksi · Panel kontrol motor pompa',
  story:'Pompa air baku pabrik butuh panel kontrol baru. Kamu merangkai starter DOL klasik: MCB → kontaktor → thermal overload → motor. Inilah rangkaian yang menjadi fondasi semua otomasi industri — sebelum PLC dan VFD, semuanya dimulai dari sini.',
  goal:'Motor berputar saat tombol START ditekan dan berhenti dengan STOP — melalui rangkaian daya MCB-kontaktor-TOR yang benar.',
  obj:['Rangkai daya: sumber → MCB → kontaktor K1 → TOR → motor','Lengkapi jalur netral motor','Uji fungsi: START memutar motor, STOP menghentikan'],
  learn:['Kontaktor = saklar elektromagnetik berdaya besar yang dikendalikan tombol kecil','TOR melindungi MOTOR dari beban lebih; MCB melindungi KABEL dari hubung singkat','DOL menarik arus start 6–8× nominal — hanya untuk motor kecil-menengah','Dari sinilah otomasi naik kelas: kontaktor → relay logic → PLC'],
  next:['Pelajari rangkaian kontrol: holding contact / pengunci','Naik level: star-delta starter untuk motor besar','Masuk dunia PLC: ladder diagram start-stop pertamamu']},
 plc:{lvl:'JALUR 16 · KONTROL & OTOMASI · MISI 2',icon:'📟',title:'Ladder PLC Start-Stop Pertamamu',strict:false,
  loc:'📍 Workshop otomasi · PLC trainer kit',
  story:'Di misi pertama kamu merangkai start-stop dengan kabel dan kontaktor. Sekarang logika yang sama dipindahkan ke tempat ia hidup di industri modern: LADDER DIAGRAM di dalam PLC. Susun anak tangga pertamamu — kontak demi kontak — download, dan saksikan logika menggantikan kabel.',
  goal:'Ladder start-stop dengan self-holding tersusun benar, terdownload ke PLC, dan lolos uji START/STOP di tombol fisik.',
  obj:['Susun rung: kontak NO Start → NC Stop → coil K1','Tambahkan kontak holding (self-latching) paralel Start','Download program & uji fungsi pada tombol fisik'],
  learn:['Ladder = jelmaan rangkaian relay: rel kiri (fasa) → kontak-kontak → coil → rel kanan (netral)','Self-holding: kontak bantu K1 paralel tombol Start "mengunci" coil setelah tombol dilepas','Tombol STOP selalu kontak NC: kabel putus = rangkaian berhenti = fail-safe by design','Logika yang sama, medium berbeda: kabel kemarin, ladder hari ini, function block esok'],
  next:['Tambah timer (TON) untuk star-delta versi PLC','Pelajari input/output addressing & wiring sensor ke PLC','Naik ke HMI: tombol virtual & monitoring real-time']},
});

/* =====================================================================
   MISI 8 — MOTOR DOL (Jalur 16)
   ===================================================================== */
let mm={};
function buildMotor(){
  freshScene(0xb0bfcc,0x131c26);
  cam={theta:-.1,phi:1.2,r:6.5,target:new THREE.Vector3(.4,1.6,-1)};
  const Z=room(0x55606a,0xb9bfc6);

  const src=box(.9,.7,.16,COL.dark);src.position.set(-3.8,2.9,Z);scene.add(src);
  src.add(label('SUMBER 220V',.7).translateY(.58));
  terminal('SRC-F','fasa',-4.0,2.55,Z+.12);
  terminal('SRC-N','netral',-3.6,2.55,Z+.12);

  const panel=box(2.6,2.4,.25,0x9aa5b0);panel.position.set(-1.2,2.1,Z-.04);scene.add(panel);
  panel.add(label('PANEL KONTROL MOTOR',.85).translateY(1.5));
  /* MCB */
  const mcb=box(.4,.55,.16,COL.cream);mcb.position.set(-2.1,2.7,Z+.12);scene.add(mcb);
  mcb.add(label('MCB',.5).translateY(.45));
  terminal('MCB-IN','fasa',-2.1,3.05,Z+.2);
  terminal('MCB-OUT','fasa',-2.1,2.35,Z+.2);
  /* Kontaktor */
  mm.k1=box(.5,.6,.2,0x2b3a4a);mm.k1.position.set(-1.2,2.7,Z+.12);scene.add(mm.k1);
  mm.k1.add(label('KONTAKTOR K1',.6).translateY(.5));
  terminal('K1-IN','fasa',-1.2,3.08,Z+.24);
  terminal('K1-OUT','fasa',-1.2,2.32,Z+.24);
  /* TOR */
  const tor=box(.45,.5,.18,0xcc8830);tor.position.set(-.3,2.65,Z+.12);scene.add(tor);
  tor.add(label('TOR',.5).translateY(.42));
  terminal('TOR-IN','fasa',-.3,2.98,Z+.22);
  terminal('TOR-OUT','fasa',-.3,2.32,Z+.22);
  /* tombol start stop */
  mm.btnStart=cyl(.09,.09,.08,0x2ec06a);mm.btnStart.rotation.x=Math.PI/2;
  mm.btnStart.position.set(-1.6,1.4,Z+.18);scene.add(mm.btnStart);
  actMesh(mm.btnStart,'START');
  scene.add(label('START',.45,'#7af0a8').translateX(-1.6).translateY(1.16).translateZ(Z+.14));
  mm.btnStop=cyl(.09,.09,.08,0xd83a3a);mm.btnStop.rotation.x=Math.PI/2;
  mm.btnStop.position.set(-1.0,1.4,Z+.18);scene.add(mm.btnStop);
  actMesh(mm.btnStop,'STOP');
  scene.add(label('STOP',.45,'#ff9d9d').translateX(-1.0).translateY(1.16).translateZ(Z+.14));
  mm.runLamp=new THREE.Mesh(new THREE.SphereGeometry(.05,12,10),
    new THREE.MeshStandardMaterial({color:0x224433,emissive:0x000000}));
  mm.runLamp.position.set(-.4,1.4,Z+.2);scene.add(mm.runLamp);

  /* motor di meja */
  const bench=box(1.6,.1,1.0,0x6b7682);bench.position.set(2.6,.9,-1.6);scene.add(bench);
  const bleg=box(.1,.9,.1,0x4a525c);bleg.position.set(2.0,.45,-1.9);scene.add(bleg);
  const bl2=bleg.clone();bl2.position.set(3.2,.45,-1.9);scene.add(bl2);
  const bl3=bleg.clone();bl3.position.set(2.0,.45,-1.3);scene.add(bl3);
  const bl4=bleg.clone();bl4.position.set(3.2,.45,-1.3);scene.add(bl4);
  const mbody=cyl(.32,.32,.9,0x3a6ea8);mbody.rotation.z=Math.PI/2;
  mbody.position.set(2.5,1.25,-1.6);scene.add(mbody);
  mm.fan=cyl(.3,.3,.06,0xd8e0e8,18,{metalness:.5});
  mm.fan.rotation.z=Math.PI/2;mm.fan.position.set(3.05,1.25,-1.6);scene.add(mm.fan);
  const blade=box(.5,.05,.04,0x9fb0c0);blade.position.set(0,0,0);mm.fan.add(blade);
  const blade2=blade.clone();blade2.rotation.x=Math.PI/2;mm.fan.add(blade2);
  scene.add(label('MOTOR POMPA',.7).translateX(2.6).translateY(1.85).translateZ(-1.6));
  terminal('MTR-F','fasa',2.2,1.0,-1.05);
  terminal('MTR-N','netral',2.9,1.0,-1.05);

  terms={};clickables.forEach(c=>{if(c.userData.kind==='terminal')terms[c.userData.id]=c;});
  mm.run=false;
  moduleTick=(dt)=>{if(mm.run)mm.fan.rotation.x+=dt*14;};

  startSeq([
   {type:'wire',a:'SRC-F',b:'MCB-IN',color:COL.fasa,done:false,
    desc:'Sambungkan FASA sumber ke MCB panel.',
    why:'MCB melindungi KABEL dari hubung singkat. Ingat pembagian tugasnya: MCB jaga kabel, TOR jaga motor.'},
   {type:'wire',a:'MCB-OUT',b:'K1-IN',color:COL.fasa,done:false,
    desc:'Dari MCB, sambungkan ke kontak utama KONTAKTOR K1.',
    why:'Kontaktor = saklar elektromagnetik: koil kecil 220V menarik kontak besar pemikul arus motor. Inilah jembatan antara "tombol kecil" dan "daya besar".'},
   {type:'wire',a:'K1-OUT',b:'TOR-IN',color:COL.fasa,done:false,
    desc:'Keluaran K1 masuk ke THERMAL OVERLOAD RELAY (TOR).',
    why:'TOR berisi bimetal yang melengkung saat arus motor berlebih lama (pompa macet, bearing aus) — memutus rangkaian sebelum lilitan motor terbakar.'},
   {type:'wire',a:'TOR-OUT',b:'MTR-F',color:COL.fasa,done:false,
    desc:'Dari TOR, sambungkan ke terminal FASA motor.',
    why:'Urutan baku rangkaian daya DOL: sumber → MCB → kontaktor → TOR → motor. Hafalkan — ini fondasi semua panel motor industri.'},
   {type:'wire',a:'SRC-N',b:'MTR-N',color:COL.netral,done:false,
    desc:'Lengkapi jalur balik: NETRAL sumber ke motor.',
    why:'Motor 1 fasa butuh netral sebagai jalur balik. (Motor 3 fasa industri tidak — tiga fasanya saling menjadi jalur balik.)'},
   {type:'act',aid:'START',done:false,targets:()=>[mm.btnStart],
    desc:'Tekan tombol START hijau — motor berputar!',
    why:'Saat START ditekan, koil K1 energize, kontak utama menutup, motor menarik arus start 6–8× nominal lalu turun ke nominal. Itulah ciri khas DOL.',
    fx(){mm.run=true;mm.k1.material.color.setHex(0x2e5a8a);
      mm.runLamp.material.emissive.setHex(0x2ee87a);mm.runLamp.material.emissiveIntensity=1;
      beep(110,.6,'sawtooth',.08);beep(220,.5,'sine',.06,.1);
      toast('🔄 MOTOR BERPUTAR — arus start → nominal.','ok',2600);}},
   {type:'act',aid:'STOP',done:false,targets:()=>[mm.btnStop],
    desc:'Uji pengaman: tekan STOP merah untuk menghentikan motor.',
    why:'Tombol STOP selalu jenis NC (normally closed) dan diuji saat komisioning: kalau gagal berhenti, panel tak boleh diserahkan. Keselamatan dulu, produksi kemudian.',
    fx(){mm.run=false;mm.k1.material.color.setHex(0x2b3a4a);
      mm.runLamp.material.emissiveIntensity=0;
      toast('⏹ Motor berhenti — fungsi STOP OK.','ok',2400);sfx.big();}},
  ],()=>{say('🎉 <b>Panel DOL lulus uji!</b> Dari sinilah dunia otomasi dimulai — kontaktor hari ini, ladder PLC besok. Pompa siap melayani produksi.');
    setTimeout(()=>showWin('motor'),2000);});

  say('VOLTA di sini 🎛️ Kita rangkai starter motor paling legendaris: <b>DOL — Direct On Line</b>. Tiga sekawan yang harus kamu kenal: MCB (jaga kabel), Kontaktor (saklar elektromagnetik), TOR (jaga motor). Ikuti penanda ▼!');
  $('#modTitle').textContent='J16 — Wiring Motor DOL';
  $('#taskHead').textContent='RANGKAIAN DAYA DOL';}

/* =====================================================================
   MISI 21 — LADDER PLC (Jalur 16 · Misi 2) — bertekstur
   ===================================================================== */
let mpl={};
function buildPLC(){
  freshScene(0xb0bfcc,0x131c26);
  cam={theta:0,phi:1.18,r:6.2,target:new THREE.Vector3(0,1.9,-1)};
  const floor=boxT(12,.1,9,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(11,4.8,.15,TEX.plaster());wall.position.set(0,2.4,-3);scene.add(wall);
  /* layar ladder besar */
  const frame=boxT(3.6,2.3,.18,TEX.metal(),{metalness:.4});frame.position.set(-.9,2.5,-2.9);scene.add(frame);
  mpl.L=makeDisplay(3.3,2.0,660,400);
  mpl.L.mesh.position.set(-.9,2.5,-2.79);scene.add(mpl.L.mesh);
  frame.add(label('PLC TRAINER — LADDER EDITOR',.95).translateY(1.45));
  /* slot elemen (toolbox) */
  mpl.slots=[];
  [['-| |- START','NOSTART',-2.3],['-|/|- STOP','NCSTOP',-1.4],['-| |- K1 HOLD','HOLD',-.5],['-( )- COIL K1','COIL',.4],['⬇ DOWNLOAD','DL',1.4]].forEach(o=>{
    const b=box(.8,.34,.14,0x2b3a4a);b.position.set(o[2],1.15,-2.86);scene.add(b);
    actMesh(b,o[1]);mpl.slots.push(b);
    scene.add(label(o[0],.5,'#5fd4ff').translateX(o[2]).translateY(1.45).translateZ(-2.8));});
  /* tombol fisik & lampu run */
  mpl.btnStart=cyl(.1,.1,.09,0x2ec06a);mpl.btnStart.rotation.x=Math.PI/2;
  mpl.btnStart.position.set(2.6,1.9,-2.84);scene.add(mpl.btnStart);
  actMesh(mpl.btnStart,'TSTART');
  scene.add(label('START',.5,'#7af0a8').translateX(2.6).translateY(2.18).translateZ(-2.8));
  mpl.btnStop=cyl(.1,.1,.09,0xd83a3a);mpl.btnStop.rotation.x=Math.PI/2;
  mpl.btnStop.position.set(3.3,1.9,-2.84);scene.add(mpl.btnStop);
  actMesh(mpl.btnStop,'TSTOP');
  scene.add(label('STOP',.5,'#ff9d9d').translateX(3.3).translateY(2.18).translateZ(-2.8));
  mpl.run=new THREE.Mesh(new THREE.SphereGeometry(.07,14,12),
    new THREE.MeshStandardMaterial({color:0x224433,emissive:0x000000}));
  mpl.run.position.set(2.95,2.5,-2.84);scene.add(mpl.run);
  scene.add(label('RUN',.45).translateX(2.95).translateY(2.72).translateZ(-2.8));

  mpl.st={start:false,stop:false,hold:false,coil:false,dl:false,power:false};
  function drawLadder(){
    const g=mpl.L.g,W=660,H=400;
    g.fillStyle='#0c141d';g.fillRect(0,0,W,H);
    g.strokeStyle='#5fd4ff';g.lineWidth=5;
    g.beginPath();g.moveTo(40,30);g.lineTo(40,H-30);g.stroke();
    g.beginPath();g.moveTo(W-40,30);g.lineTo(W-40,H-30);g.stroke();
    const on=mpl.st.power, wc=on?'#46ff8e':'#8aa3bd';
    const Y=140;
    g.strokeStyle=wc;g.lineWidth=4;g.font='600 22px Consolas';g.textAlign='center';
    function seg(x1,x2,y){g.beginPath();g.moveTo(x1,y);g.lineTo(x2,y);g.stroke();}
    if(mpl.st.start){seg(40,170,Y);
      g.strokeRect(170,Y-22,44,44);g.fillStyle=wc;g.fillText('I0.0',192,Y-32);
      g.fillStyle='#8aa3bd';g.fillText('START',192,Y+44);
      seg(214,300,Y);}
    if(mpl.st.stop){g.strokeRect(300,Y-22,44,44);
      g.beginPath();g.moveTo(300,Y+22);g.lineTo(344,Y-22);g.stroke();
      g.fillStyle=wc;g.fillText('I0.1',322,Y-32);
      g.fillStyle='#8aa3bd';g.fillText('STOP',322,Y+44);
      seg(344,480,Y);}
    if(mpl.st.coil){g.beginPath();g.arc(505,Y,24,0,Math.PI*2);g.stroke();
      g.fillStyle=wc;g.fillText('Q0.0',505,Y-34);
      g.fillStyle='#8aa3bd';g.fillText('K1',505,Y+46);
      seg(529,W-40,Y);}
    if(mpl.st.hold){const Y2=240;
      seg(40,170,Y2);g.strokeRect(170,Y2-22,44,44);
      g.fillStyle=wc;g.fillText('Q0.0',192,Y2-32);
      g.fillStyle='#8aa3bd';g.fillText('HOLD',192,Y2+44);
      seg(214,260,Y2);
      g.beginPath();g.moveTo(260,Y2);g.lineTo(260,Y);g.stroke();}
    g.fillStyle=mpl.st.dl?'#46ff8e':'#7d8f84';g.font='600 18px Consolas';g.textAlign='left';
    g.fillText(mpl.st.dl?'● ONLINE · PROGRAM DI PLC':'○ OFFLINE · EDIT MODE',50,H-44);
    if(on){g.fillStyle='#46ff8e';g.textAlign='right';g.fillText('Q0.0 = TRUE ⚡',W-50,H-44);}
    mpl.L.tex.needsUpdate=true;}
  drawLadder();

  startSeq([
   {type:'act',aid:'NOSTART',done:false,targets:()=>[mpl.slots[0]],
    desc:'Pasang kontak NO "START" di awal rung (klik slot -| |-).',
    why:'Kontak Normally Open I0.0: terbuka saat tombol diam, menutup saat ditekan — gerbang masuk "izin jalan". Di ladder, arus logika mengalir dari rel kiri ke kanan seperti fasa ke netral.',
    fx(){mpl.st.start=true;drawLadder();
      toast('✓ Kontak NO START (I0.0) terpasang.','ok',2200);}},
   {type:'act',aid:'NCSTOP',done:false,targets:()=>[mpl.slots[1]],
    desc:'Seri-kan kontak NC "STOP" (klik slot -|/|-).',
    why:'Normally Closed I0.1: TERTUTUP saat tombol diam (logika lewat), TERBUKA saat ditekan (putus). Bonus tersembunyi: kabel tombol putus = rangkaian berhenti sendiri. Fail-safe by design.',
    fx(){mpl.st.stop=true;drawLadder();
      toast('✓ Kontak NC STOP (I0.1) terpasang — fail-safe.','ok',2200);}},
   {type:'act',aid:'COIL',done:false,targets:()=>[mpl.slots[3]],
    desc:'Akhiri rung dengan COIL K1 (klik slot -( )-).',
    why:'Coil Q0.0 = keluaran: saat logika rung "mengalir", coil energize → output fisik PLC menarik kontaktor motor. Inilah titik temu dunia logika dan dunia tembaga.',
    fx(){mpl.st.coil=true;drawLadder();
      toast('✓ Coil K1 (Q0.0) terpasang — rung utama lengkap.','ok',2200);}},
   {type:'act',aid:'HOLD',done:false,targets:()=>[mpl.slots[2]],
    desc:'Rahasianya: tambahkan kontak HOLDING Q0.0 paralel START.',
    why:'Tanpa ini, motor mati begitu jarimu lepas dari START. Kontak bantu K1 paralel tombol = begitu coil hidup, ia "memegang dirinya sendiri" lewat jalur kedua. Self-latching — pola paling fundamental seluruh otomasi.',
    fx(){mpl.st.hold=true;drawLadder();
      toast('✓ Holding contact terpasang — rangkaian mengunci diri.','ok',2400);}},
   {type:'act',aid:'DL',done:false,targets:()=>[mpl.slots[4]],
    desc:'DOWNLOAD program ke PLC (klik ⬇).',
    why:'Compile → transfer → RUN mode. Logika yang tadinya gambar kini hidup men-scan input-output ribuan kali per detik. Di industri nyata: download ke PLC berjalan perlu prosedur MOC!',
    fx(){mpl.st.dl=true;drawLadder();
      toast('⬇ Program di PLC — mode RUN. Saatnya uji!','ok',2400);}},
   {type:'act',aid:'TSTART',done:false,targets:()=>[mpl.btnStart],
    desc:'UJI: tekan tombol fisik START!',
    why:'Tekan-lepas: I0.0 menutup sekejap, Q0.0 energize, holding mengunci — dan tetap hidup setelah jarimu pergi. Persis perilaku panel kontaktor kemarin, kini tanpa satu kabel kontrol pun.',
    fx(){mpl.st.power=true;drawLadder();
      mpl.run.material.emissive.setHex(0x2ee87a);mpl.run.material.emissiveIntensity=1;
      toast('⚡ Q0.0 TRUE — output mengunci. Self-holding bekerja!','ok',2600);sfx.big();}},
   {type:'act',aid:'TSTOP',done:false,targets:()=>[mpl.btnStop],
    desc:'UJI: tekan STOP — pastikan logika berhenti.',
    why:'NC terbuka → aliran logika putus → coil drop → holding ikut lepas. Sistem kembali menunggu START berikutnya. Start-stop-latch: tiga kata yang akan kamu pakai seumur karier otomasi.',
    fx(){mpl.st.power=false;drawLadder();
      mpl.run.material.emissiveIntensity=0;
      toast('⏹ Q0.0 FALSE — berhenti sempurna. Ladder LULUS uji!','ok',2600);}},
  ],()=>{say('🎉 <b>Anak tangga pertamamu hidup!</b> Kemarin kabel & kontaktor, hari ini I0.0—I0.1—Q0.0. Logika yang sama, dunia yang baru. Selamat datang di otomasi modern.');
    setTimeout(()=>showWin('plc'),2200);});

  say('VOLTA di sini 📟 Hari bersejarah: <b>ladder diagram pertamamu</b>. Kita pindahkan rangkaian start-stop kemarin ke dalam PLC — susun elemennya di layar besar, download, lalu buktikan di tombol fisik!');
  $('#modTitle').textContent='J16·M2 — Ladder PLC Start-Stop';
  $('#taskHead').textContent='SUSUN · DOWNLOAD · UJI';}

MISSIONS.motor.build=buildMotor;
MISSIONS.plc.build=buildPLC;

Object.assign(REAL,{
 motor:[
  'Setting arus TOR = arus nominal motor di nameplate (bukan diputar maksimum!)',
  'Sebelum start pertama: megger lilitan motor & jog test untuk cek arah putaran',
  'Kencangkan semua terminal dengan torsi sesuai spesifikasi — terminal kendor = panas = kebakaran panel',
  'Motor ≥ 7,5 kW umumnya tidak lagi DOL: gunakan star-delta, soft starter, atau VFD'],
 plc:[
  'Di plant berjalan, download program mengikuti prosedur MOC (management of change) + backup program lama',
  'Alamat I/O didokumentasikan dalam I/O list — tanpa itu, troubleshooting = menebak',
  'Emergency stop TIDAK boleh hanya lewat PLC — wajib jalur hardwired terpisah (kategori safety)',
  'Simulasi/forcing I/O hanya saat komisioning dengan izin — forcing yang tertinggal adalah bom waktu'],
});
