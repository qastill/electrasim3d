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

/* =====================================================================
   MISI 3 — TIMER PLC: STAR-DELTA OTOMATIS
   ===================================================================== */
Object.assign(MISSIONS,{
 ton:{lvl:'JALUR 16 · KONTROL & OTOMASI · MISI 3',icon:'⏱️',title:'Timer PLC: Star-Delta Otomatis',strict:false,
  loc:'📍 Workshop otomasi · PLC trainer + motor 22 kW',
  story:'Dua dunia yang pernah kamu taklukkan kini bertemu: panel star-delta (Jalur 02) dan ladder PLC (misi lalu). Timer mekanik di panel lama sudah aus dan tak presisi — hari ini logikanya pindah ke PLC dengan instruksi TON. Tiga kontaktor, satu timer, nol kabel kontrol tambahan.',
  goal:'Ladder star-delta lengkap: K-utama mengunci, K-star bekerja 6 detik, TON memindah mulus ke K-delta dengan interlock — teruji di motor.',
  obj:['Susun rung utama start-stop dengan self-holding','Tambahkan rung K-star + timer TON 6 detik','Rung K-delta via kontak timer + interlock, lalu uji'],
  learn:['TON (timer on-delay): mulai menghitung saat input ON, kontaknya berpindah setelah preset tercapai','Interlock di ladder: kontak NC K-delta di rung K-star (dan sebaliknya) — keduanya mustahil ON bersamaan','Transisi star→delta diberi jeda sesaat (dead time) agar busur di kontaktor star padam dulu','Logika yang sama dengan panel relay lama — tapi mengubah waktu tunda kini soal mengetik angka, bukan memutar obeng'],
  next:['Tambahkan proteksi: input TOR ke PLC & alarm trip di HMI','Pelajari instruksi TOF & TONR — keluarga timer lainnya','Bangun HMI sederhana: tombol virtual + indikator status motor']},
});
let mto={};
function buildTON(){
  freshScene(0xb0bfcc,0x131c26);
  cam={theta:0,phi:1.18,r:6.5,target:new THREE.Vector3(0,1.9,-1)};
  const floor=boxT(12,.1,9,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(11,4.8,.15,TEX.plaster());wall.position.set(0,2.4,-3);scene.add(wall);
  /* layar ladder */
  const frame=boxT(3.8,2.4,.18,TEX.metal(),{metalness:.4});frame.position.set(-1.2,2.5,-2.9);scene.add(frame);
  mto.L=makeDisplay(3.5,2.1,640,400);
  mto.L.mesh.position.set(-1.2,2.5,-2.79);scene.add(mto.L.mesh);
  frame.add(label('LADDER — STAR DELTA OTOMATIS',.95).translateY(1.5));
  /* slot instruksi */
  mto.slots=[];
  [['RUNG UTAMA','R1',-2.6],['K-STAR+TON','R2',-1.5],['K-DELTA','R3',-.4],['⬇ DOWNLOAD','DL',.7]].forEach(o=>{
    const b=box(.9,.34,.14,0x2b3a4a);b.position.set(o[2],1.1,-2.86);scene.add(b);
    actMesh(b,o[1]);mto.slots.push(b);
    scene.add(label(o[0],.48,'#5fd4ff').translateX(o[2]).translateY(1.42).translateZ(-2.8));});
  /* tombol fisik & motor */
  mto.btn=cyl(.1,.1,.09,0x2ec06a);mto.btn.rotation.x=Math.PI/2;
  mto.btn.position.set(2.4,1.9,-2.84);scene.add(mto.btn);
  actMesh(mto.btn,'UJI');
  scene.add(label('START',.5,'#7af0a8').translateX(2.4).translateY(2.18).translateZ(-2.8));
  const mb=cyl(.3,.3,.85,0x3a6ea8);mb.rotation.z=Math.PI/2;mb.position.set(3.6,.6,-1.0);scene.add(mb);
  mto.fan=cyl(.27,.27,.06,0xd8e0e8,18,{metalness:.5});
  mto.fan.rotation.z=Math.PI/2;mto.fan.position.set(4.1,.6,-1.0);scene.add(mto.fan);
  const bl=box(.45,.05,.04,0x9fb0c0);mto.fan.add(bl);
  const bl2=bl.clone();bl2.rotation.x=Math.PI/2;mto.fan.add(bl2);
  scene.add(label('MOTOR 22 kW',.65).translateX(3.7).translateY(1.2).translateZ(-1.0));
  mto.st={r1:false,r2:false,r3:false,dl:false,run:false,fase:'off',t:0};
  function ladder(){
    const g=mto.L.g,W=640,H=400;
    g.fillStyle='#0c141d';g.fillRect(0,0,W,H);
    g.strokeStyle='#5fd4ff';g.lineWidth=5;
    g.beginPath();g.moveTo(36,26);g.lineTo(36,H-26);g.stroke();
    g.beginPath();g.moveTo(W-36,26);g.lineTo(W-36,H-26);g.stroke();
    g.font='600 18px Consolas';g.textAlign='left';
    function rung(y,txt,on,act){
      g.strokeStyle=act?'#46ff8e':(on?'#8aa3bd':'#2a3a4c');g.lineWidth=4;
      g.beginPath();g.moveTo(36,y);g.lineTo(W-36,y);g.stroke();
      g.fillStyle=act?'#46ff8e':(on?'#eaf2fb':'#3a4a5c');g.fillText(txt,52,y-12);}
    rung(90,'I0.0 START ⊣⊢ I0.1 STOP ⊣/⊢ + hold — ( M-UTAMA )',mto.st.r1,
      mto.st.run);
    rung(180,'M-UTAMA ⊣⊢ K-DELTA ⊣/⊢ — ( K-STAR ) + TON T1 6s',mto.st.r2,
      mto.st.run&&mto.st.fase==='star');
    rung(270,'T1.DN ⊣⊢ K-STAR ⊣/⊢ — ( K-DELTA )',mto.st.r3,
      mto.st.run&&mto.st.fase==='delta');
    g.fillStyle=mto.st.dl?'#46ff8e':'#7d8f84';g.font='600 17px Consolas';
    g.fillText(mto.st.dl?'● ONLINE · RUN MODE':'○ OFFLINE · EDIT',48,H-36);
    if(mto.st.run)g.fillText(mto.st.fase==='star'?('T1: '+mto.st.t.toFixed(1)+'s / 6.0s'):
      'DELTA · NOMINAL',360,H-36);
    mto.L.tex.needsUpdate=true;}
  ladder();
  moduleTick=(dt)=>{
    if(mto.st.run&&mto.st.fase==='star'){mto.st.t+=dt;
      if(mto.st.t>=6){mto.st.fase='delta';sfx.ok();
        toast('⏱️ T1 tuntas → K-STAR lepas, K-DELTA masuk!','ok',2400);}
      ladder();}
    if(mto.st.run)mto.fan.rotation.x+=dt*(mto.st.fase==='delta'?14:7);};
  startSeq([
   {type:'act',aid:'R1',done:false,targets:()=>[mto.slots[0]],
    desc:'Susun RUNG UTAMA: start-stop + self-holding (klik slot 1).',
    why:'Fondasi yang sudah kamu hafal dari misi lalu: NO start, NC stop, holding M-utama. Bedanya kini ia bukan akhir cerita — M-utama akan menjadi induk yang menghidupkan dua rung di bawahnya.',
    fx(){mto.st.r1=true;ladder();
      toast('✓ Rung utama berdiri — M-utama siap jadi induk.','ok',2200);}},
   {type:'act',aid:'R2',done:false,targets:()=>[mto.slots[1]],
    desc:'Rung 2: K-STAR + timer TON 6 detik (klik slot 2).',
    why:'M-utama menghidupkan K-star DAN memulai hitungan TON bersamaan. Perhatikan kontak NC K-delta diseri di rung ini: interlock — selama delta hidup, star tak mungkin kembali. Dua kontaktor itu tak boleh berjabat tangan.',
    fx(){mto.st.r2=true;ladder();
      toast('✓ K-STAR + TON 6s + interlock NC K-delta.','ok',2400);}},
   {type:'act',aid:'R3',done:false,targets:()=>[mto.slots[2]],
    desc:'Rung 3: kontak T1 memanggil K-DELTA (klik slot 3).',
    why:'T1.DN (done) menutup tepat di detik ke-6: K-star gugur (interlock balik NC K-star di sini), sesaat kemudian K-delta masuk. Jeda sekejap itu disengaja — busur di kontaktor star harus padam sebelum delta menjabat.',
    fx(){mto.st.r3=true;ladder();
      toast('✓ Rung delta + interlock dua arah — logika lengkap.','ok',2400);}},
   {type:'act',aid:'DL',done:false,targets:()=>[mto.slots[3]],
    desc:'DOWNLOAD ke PLC (klik ⬇).',
    why:'Compile bersih, transfer, RUN. Timer mekanik tua di panel boleh pensiun dengan hormat — penggantinya menghitung milidetik tanpa pernah aus, dan preset-nya diubah dengan keyboard, bukan obeng.',
    fx(){mto.st.dl=true;ladder();
      toast('⬇ Program di PLC — RUN mode. Saatnya pembuktian!','ok',2400);}},
   {type:'act',aid:'UJI',done:false,targets:()=>[mto.btn],
    desc:'UJI: tekan START — saksikan star 6 detik lalu delta!',
    why:'Tekan... K-star masuk, motor mengalun pelan, T1 menghitung di layar... detik keenam: klak! — delta masuk, motor melaju penuh. Logika tiga rung menggantikan segenggam kabel kontrol. Otomasi selalu menang dengan elegan.',
    fx(){mto.st.run=true;mto.st.fase='star';mto.st.t=0;ladder();
      beep(90,.7,'sawtooth',.07);
      toast('🔄 START — star dulu, hitung sampai 6...','ok',2400);sfx.big();}},
  ],()=>{say('🎉 <b>Star-delta kini otomatis penuh!</b> Tiga rung, satu TON, interlock dua arah. Jalur 02 memberi ototnya, Jalur 16 memberi otaknya — dan kamu yang menyatukan keduanya.');
    setTimeout(()=>showWin('ton'),2200);});
  say('VOLTA di sini ⏱️ Pertemuan dua duniamu: <b>panel star-delta bertemu ladder PLC</b>. Bintang utamanya instruksi TON — timer yang tak pernah aus. Susun tiga rung-nya, lalu buktikan di motor sungguhan.');
  $('#modTitle').textContent='J16·M3 — Timer PLC Star-Delta';
  $('#taskHead').textContent='TIGA RUNG · SATU TIMER';}
MISSIONS.ton.build=buildTON;
Object.assign(REAL,{
 ton:[
  'Interlock K-star/K-delta tetap dipasang juga secara HARDWIRE (mekanik+elektrik) — PLC bukan satu-satunya pagar',
  'Setting waktu star diverifikasi dengan arus aktual motor berbeban, lalu disimpan di dokumentasi program',
  'Beri dead-time transisi (0,1-0,3 dtk) di logika — kontaktor butuh waktu melepas busur',
  'Simpan backup program + komentar rung yang jelas; ladder tanpa komentar = teka-teki bagi teknisi berikutnya'],
});

/* =====================================================================
   MISI 4 — SORTIR KONVEYOR OTOMATIS (gaya Factory I/O)
   ===================================================================== */
Object.assign(MISSIONS,{
 sortir:{lvl:'JALUR 16 · KONTROL & OTOMASI · MISI 4',icon:'📦',title:'Sortir Konveyor Otomatis',strict:false,
  loc:'📍 Gudang distribusi · Line sortir paket baru',
  story:'Gudang distribusi kebanjiran paket: kotak TINGGI harus masuk jalur palet khusus, kotak pendek lurus ke truk. Selama ini dua orang berdiri seharian memindahkan kotak — punggung mereka menyerah duluan. Solusinya berdiri di depanmu: konveyor, sensor fotoelektrik, lengan diverter… dan PLC yang menunggu logikamu.',
  goal:'Line sortir bekerja penuh otomatis: sensor mendeteksi kotak tinggi, diverter mendorongnya ke ramp tepat waktu, counter menghitung — terbukti minimal 3 kotak tersortir benar.',
  obj:['Periksa & sejajarkan sensor fotoelektrik','Susun ladder: sensor → delay → diverter + counter','Download, jalankan line, dan saksikan sortir hidup'],
  learn:['Sensor fotoelektrik through-beam dipasang pada KETINGGIAN selektif: hanya kotak tinggi yang memotong sinar — pemilahan dimulai dari mounting, bukan dari program','Delay (TON) antara deteksi dan dorongan = jarak sensor-diverter dibagi kecepatan belt; salah hitung = mendorong udara atau kotak yang salah','Counter (CTU) memberi mata pada produksi: jumlah tersortir per shift adalah data, bukan kira-kira','Logika di simulasi & kenyataan sama persis — yang berbeda hanya konsekuensi kesalahannya'],
  next:['Tambah sensor kedua untuk verifikasi sortir (reject confirm)','Pelajari pemilahan multi-kriteria: tinggi + berat (load cell)','Naik ke palletizing: robot menyusun kotak hasil sortir']},
});
let mso={};
function buildSortir(){
  freshScene(0xb8c4cc,0x10181e);
  cam={theta:.35,phi:1.1,r:10,target:new THREE.Vector3(0,1.2,-.6)};
  const floor=boxT(26,.1,15,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  /* pagar pengaman belakang (gaya factory) */
  for(let x=-7;x<=7;x+=2.8){
    const post=cyl(.05,.05,1.6,0x2a5a9a);post.position.set(x,.8,-4.2);scene.add(post);}
  const mesh1=box(14.2,1.3,.04,0x9fb6c8,{transparent:true,opacity:.25});
  mesh1.position.set(0,.85,-4.2);scene.add(mesh1);
  /* belt utama */
  const belt=box(12,.22,1.2,0x222a31,{roughness:.85});belt.position.set(0,.85,-1.5);scene.add(belt);
  [-5,-2.5,0,2.5,5].forEach(x=>{
    const leg=boxT(.12,.78,1.0,TEX.metal(),{metalness:.4});leg.position.set(x,.39,-1.5);scene.add(leg);});
  const rail=box(12,.08,.06,0x4a6a8a);rail.position.set(0,1.02,-2.12);scene.add(rail);
  const rail2=rail.clone();rail2.position.z=-.88;scene.add(rail2);
  scene.add(label('LINE SORTIR PAKET',.85).translateY(2.0).translateZ(-1.5));
  /* sensor fotoelektrik */
  const spost=cyl(.04,.04,1.5,0x666666);spost.position.set(1.0,.75,-2.4);scene.add(spost);
  mso.sensor=box(.16,.16,.16,0xd8b020);mso.sensor.position.set(1.0,1.42,-2.3);scene.add(mso.sensor);
  actMesh(mso.sensor,'SENSOR');
  mso.beam=cyl(.015,.015,1.3,0xff5a5a,8,{transparent:true,opacity:.35,emissive:0xff5a5a,emissiveIntensity:.3});
  mso.beam.rotation.x=Math.PI/2;mso.beam.position.set(1.0,1.42,-1.5);scene.add(mso.beam);
  scene.add(label('SENSOR FOTOELEKTRIK',.55,'#5fd4ff').translateX(1.0).translateY(1.85).translateZ(-2.3));
  /* diverter arm */
  mso.arm=box(.9,.3,.14,0xd83a3a,{metalness:.3});
  mso.arm.position.set(2.1,1.1,-2.05);scene.add(mso.arm);
  scene.add(label('DIVERTER',.55,'#5fd4ff').translateX(2.1).translateY(1.6).translateZ(-2.1));
  /* ramp sortir ke depan */
  const ramp=boxT(1.1,.08,2.2,TEX.metal(),{metalness:.5});
  ramp.position.set(2.3,.55,-.15);ramp.rotation.x=.3;scene.add(ramp);
  [-.45,.45].forEach(dx=>{const rr=box(.05,.12,2.2,0x4a6a8a);
    rr.position.set(2.3+dx,.66,-.15);rr.rotation.x=.3;scene.add(rr);});
  scene.add(label('RAMP PALET TINGGI ▼',.6,'#8df0b8').translateX(2.6).translateY(1.15).translateZ(.4));
  /* stack light */
  const lpost=cyl(.035,.035,1.7,0x666666);lpost.position.set(3.4,.85,-2.5);scene.add(lpost);
  mso.lr=cyl(.09,.09,.14,0x552222,12,{emissive:0x000000});mso.lr.position.set(3.4,1.95,-2.5);scene.add(mso.lr);
  mso.ly=cyl(.09,.09,.14,0x554d22,12,{emissive:0xd8b020,emissiveIntensity:.8});mso.ly.position.set(3.4,1.78,-2.5);scene.add(mso.ly);
  mso.lg=cyl(.09,.09,.14,0x225522,12,{emissive:0x000000});mso.lg.position.set(3.4,1.61,-2.5);scene.add(mso.lg);
  /* layar PLC + slot */
  const frame=boxT(2.9,1.9,.16,TEX.metal(),{metalness:.4});frame.position.set(-4.2,2.2,-4.0);scene.add(frame);
  frame.add(label('PLC — LINE SORTIR',.8).translateY(1.2));
  mso.L=makeDisplay(2.6,1.5,460,280);
  mso.L.mesh.position.set(-4.2,2.2,-3.9);scene.add(mso.L.mesh);
  mso.st={rung:false,ctu:false,dl:false};
  function ladder(){
    dispText(mso.L,[
      mso.st.rung?'I0.2─TON 0,55s─(Q0.1)':'rung kosong…',
      mso.st.ctu?'Q0.1↑ → CTU C1':'',
      mso.st.dl?'● RUN':'○ EDIT'],
      [mso.st.rung?'#46ff8e':'#7d8f84',mso.st.ctu?'#46ff8e':'#7d8f84',mso.st.dl?'#46ff8e':'#7d8f84']);}
  ladder();
  mso.slots=[];
  [['RUNG SORTIR','RUNG',-5.4],['COUNTER','CTU',-4.2],['⬇ DOWNLOAD','DL',-3.0]].forEach(o=>{
    const b=box(.95,.34,.14,0x2b3a4a);b.position.set(o[2],1.0,-3.96);scene.add(b);
    actMesh(b,o[1]);mso.slots.push(b);
    scene.add(label(o[0],.48,'#5fd4ff').translateX(o[2]).translateY(1.32).translateZ(-3.9));});
  /* tombol start + counter display */
  mso.btn=cyl(.11,.11,.09,0x2ec06a);mso.btn.rotation.x=Math.PI/2;
  mso.btn.position.set(-6.4,1.1,-1.5);scene.add(mso.btn);
  actMesh(mso.btn,'START');
  scene.add(label('START LINE',.55,'#7af0a8').translateX(-6.4).translateY(1.45).translateZ(-1.5));
  mso.C=makeDisplay(1.2,.6,280,140);
  mso.C.mesh.position.set(4.6,1.7,-2.6);scene.add(mso.C.mesh);
  actMesh(mso.C.mesh,'VERIF');
  function updC(){dispText(mso.C,['SORTIR: '+mso.count,'LOLOS: '+mso.pass],
    [mso.count>=3?'#46ff8e':'#ffd23f','#8aa3bd']);}
  mso.count=0;mso.pass=0;updC();
  scene.add(label('COUNTER',.55,'#5fd4ff').translateX(4.6).translateY(2.15).translateZ(-2.6));
  /* sistem kotak berjalan */
  mso.items=[];mso.run=false;mso.spawnT=1.2;mso.n=0;mso.armT=0;
  function spawnBox(){
    const tall=mso.n%2===0; mso.n++;
    const h=tall?.62:.3;
    const b=box(.52,h,.52,tall?0xc8893a:0x8a6a4a,{roughness:.8});
    b.position.set(-5.7,0.96+h/2,-1.5);scene.add(b);
    mso.items.push({mesh:b,tall,h,flag:false,divert:false,done:false,tDelay:0});}
  moduleTick=(dt)=>{
    if(mso.run){
      mso.spawnT-=dt;
      if(mso.spawnT<=0){mso.spawnT=2.4;spawnBox();}
      mso.lg.material.emissive.setHex(0x2ee87a);mso.lg.material.emissiveIntensity=1;
      mso.ly.material.emissiveIntensity=0;}
    if(mso.armT>0){mso.armT-=dt;
      mso.arm.position.z=-2.05+Math.sin(Math.min(1,(0.5-mso.armT)/.5)*Math.PI)*.5;}
    for(let i=mso.items.length-1;i>=0;i--){
      const b=mso.items[i],p=b.mesh.position;
      if(!b.divert)p.x+=dt*1.1;
      if(b.tall&&mso.st.dl&&!b.flag&&p.x>=1.0){b.flag=true;b.tDelay=.55;
        mso.beam.material.opacity=.9;setTimeout(()=>{mso.beam.material.opacity=.35;},220);}
      if(b.flag&&!b.divert){b.tDelay-=dt;
        if(b.tDelay<=0){b.divert=true;mso.armT=.5;sfx.click();}}
      if(b.divert){p.z+=dt*1.7;p.x+=dt*.15;
        if(p.z>-.9)p.y=Math.max(.35,p.y-dt*1.1);
        if(p.z>.6&&!b.done){b.done=true;mso.count++;updC();spark(p.clone(),0x3ddc84);}}
      if(p.x>5.9){if(!b.done&&!b.tall){mso.pass++;updC();}
        scene.remove(b.mesh);mso.items.splice(i,1);}
      if(p.z>1.6){scene.remove(b.mesh);mso.items.splice(i,1);}}};
  startSeq([
   {type:'act',aid:'SENSOR',done:false,targets:()=>[mso.sensor],
    desc:'Periksa & sejajarkan SENSOR fotoelektrik (klik sensor kuning).',
    why:'Sensor through-beam dipasang pada ketinggian 45 cm: kotak tinggi (60 cm) memotong sinar, kotak pendek (30 cm) lewat di bawahnya tanpa terdeteksi. Pemilahan paling elegan justru terjadi di dudukan baut — sebelum satu baris program pun ditulis.',
    fx(){mso.beam.material.emissiveIntensity=.8;
      toast('📡 Sensor sejajar — sinar bersih ke reflektor, I0.2 siap.','ok',2600);}},
   {type:'act',aid:'RUNG',done:false,targets:()=>[mso.slots[0]],
    desc:'Susun RUNG SORTIR: I0.2 → TON 0,55 s → coil diverter (klik slot).',
    why:'Sensor di x sensor, diverter 1,1 m kemudian; belt 2 m/s? Bukan — belt ini 1,1 m/s, jadi kotak butuh ±0,55 detik untuk tiba di depan lengan. TON menahan dorongan tepat selama itu: matematika sederhana yang membuat lengan mendorong KOTAK, bukan udara.',
    fx(){mso.st.rung=true;ladder();
      toast('✓ Rung: deteksi → tunda 0,55s → DORONG.','ok',2400);}},
   {type:'act',aid:'CTU',done:false,targets:()=>[mso.slots[1]],
    desc:'Tambah COUNTER: tiap dorongan menambah hitungan (klik slot).',
    why:'CTU menghitung sisi naik Q0.1 — satu dorongan, satu hitungan. Di akhir shift angka ini menjadi laporan produksi otomatis; supervisor berhenti menghitung manual, mulai menganalisis.',
    fx(){mso.st.ctu=true;ladder();
      toast('✓ CTU C1 terpasang — produksi kini terhitung.','ok',2400);}},
   {type:'act',aid:'DL',done:false,targets:()=>[mso.slots[2]],
    desc:'DOWNLOAD program ke PLC (klik ⬇).',
    why:'Compile → transfer → RUN. Logika kini men-scan input ribuan kali per detik, jauh lebih rajin dari mata manusia mana pun yang berdiri di samping belt seharian.',
    fx(){mso.st.dl=true;ladder();
      toast('⬇ Program ONLINE — line siap dijalankan.','ok',2400);}},
   {type:'act',aid:'START',done:false,targets:()=>[mso.btn],
    desc:'START LINE — saksikan sortir bekerja sendiri!',
    why:'Kotak mengalir... yang pendek lolos lurus ke truk, yang tinggi: sinar terpotong → 0,55 detik → DORONG → meluncur di ramp. Tidak ada tangan manusia. Inilah momen ketika logika menjadi tenaga kerja.',
    fx(){mso.run=true;beep(110,.5,'sawtooth',.07);
      toast('▶ LINE BERJALAN — perhatikan kotak tinggi di sensor!','ok',2800);sfx.big();}},
   {type:'act',aid:'VERIF',done:false,targets:()=>[mso.C.mesh],
    check:()=>mso.count>=3,
    checkFail:'Belum cukup bukti! Biarkan line bekerja sampai minimal 3 kotak tinggi tersortir (lihat counter).',
    desc:'Setelah 3+ kotak tersortir: VERIFIKASI di counter (klik display).',
    why:'Tiga dorongan, tiga di ramp, nol salah sortir — commissioning lulus dengan data, bukan perasaan. Dua pekerja tadi? Dipromosikan jadi operator line: mengawasi angka, bukan mengangkat kotak.',
    fx(){toast('🏆 SORTIR OTOMATIS TERVERIFIKASI — line diserahterimakan!','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Line sortir hidup!</b> Sensor melihat, TON menghitung, diverter mendorong, counter mencatat — dan kamu yang mengajari semuanya. Selamat datang di level otomasi yang sesungguhnya.');
    setTimeout(()=>showWin('sortir'),2200);});
  say('VOLTA di sini 📦 Misi paling hidup sejauh ini: <b>line sortir otomatis</b>. Kotak akan benar-benar mengalir di belt — tugasmu mengajari PLC memilahnya. Mulai dari sensor: pemilahan lahir di ketinggian pemasangan.');
  $('#modTitle').textContent='J16·M4 — Sortir Konveyor Otomatis';
  $('#taskHead').textContent='DETEKSI · TUNDA · DORONG · HITUNG';}
MISSIONS.sortir.build=buildSortir;
Object.assign(REAL,{
 sortir:[
  'Kecepatan belt diukur aktual (bukan nameplate) untuk menghitung delay sensor-diverter',
  'Sensor diberi mounting kokoh + pelindung — getaran konveyor menggeser alignment pelan-pelan',
  'Diverter pneumatik butuh interlock area: pagar + sensor pintu, lengan yang mendorong tidak memilih sasaran',
  'Sediakan mode MANUAL/BYPASS untuk maintenance — line tak boleh tersandera program'],
});
