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

/* =====================================================================
   MISI 5 — HMI DESIGN: WAJAH UNTUK MESIN
   ===================================================================== */
Object.assign(MISSIONS,{
 hmi:{lvl:'JALUR 16 · KONTROL & OTOMASI · MISI 5',icon:'🖥️',title:'HMI Design: Wajah untuk Mesin',strict:false,
  loc:'📍 Gudang distribusi · Line sortir butuh layar operator',
  story:'Line sortir buatanmu bekerja sempurna — tapi operator barunya mengeluh: "Mesinnya pintar, tapi bisu." Benar: status hanya terbaca lewat laptop engineering. Misi hari ini bukan menambah logika, melainkan memberi line itu WAJAH: layar HMI yang membuat operator paham keadaan dalam tiga detik, dan alarm yang menuntun — bukan menakuti.',
  goal:'HMI line sortir tersusun sesuai prinsip desain: overview jelas, kontrol aman dua langkah, alarm berprioritas, dan trend untuk investigasi — teruji oleh operator sungguhan.',
  obj:['Rancang layar overview dengan hirarki visual','Tambah kontrol aman & halaman alarm berprioritas','Lengkapi trend, lalu uji dengan operator'],
  learn:['HMI terbaik itu membosankan: abu-abu saat normal, warna HANYA untuk abnormal — layar pelangi membuat mata buta terhadap bahaya sungguhan','Aturan 3 detik: operator baru harus paham status line dalam tiga detik — hirarki visual mengalahkan kelengkapan data','Kontrol berbahaya butuh dua langkah (pilih lalu konfirmasi) & umpan balik jelas — sentuhan nyasar tak boleh menghentikan produksi','Alarm berprioritas & ber-instruksi: "CV2 STOP — periksa sensor transfer" menuntun; lampu merah berkedip hanya menakuti'],
  next:['Pelajari standar desain HMI high-performance (ISA-101)','Dalami alarm management: alarm flood & rasionalisasi','Naik ke SCADA: banyak line, satu control room']},
});
let mhm={};
function buildHMI(){
  freshScene(0xb0bfcc,0x131c26);
  cam={theta:0,phi:1.18,r:7,target:new THREE.Vector3(0,1.9,-1)};
  const floor=boxT(14,.1,9,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(13,4.6,.15,TEX.plaster());wall.position.set(0,2.3,-3);scene.add(wall);
  /* layar HMI besar yang sedang dirancang */
  const frame=boxT(4.6,2.8,.18,TEX.metal(),{metalness:.4});frame.position.set(-1.2,2.4,-2.9);scene.add(frame);
  frame.add(label('PANEL HMI 15" — LINE SORTIR',.9).translateY(1.7));
  mhm.D=makeDisplay(4.3,2.5,620,360);
  mhm.D.mesh.position.set(-1.2,2.4,-2.79);scene.add(mhm.D.mesh);
  actMesh(mhm.D.mesh,'OVERVIEW');
  mhm.st={ov:false,ctl:false,alm:false,trd:false};
  function layar(){
    const g=mhm.D.g,W=620,H=360;
    g.fillStyle='#d8dde2';g.fillRect(0,0,W,H); /* abu terang khas high-performance */
    g.font='700 18px Consolas';g.textAlign='left';
    g.fillStyle='#222a31';g.fillText('LINE SORTIR — OVERVIEW',16,30);
    if(mhm.st.ov){
      /* mimic line: belt + status */
      g.fillStyle='#9aa3ab';g.fillRect(60,90,360,16);
      g.fillStyle='#222a31';g.fillRect(430,70,60,50);
      g.font='600 14px Consolas';g.fillStyle='#222a31';
      g.fillText('CV-1  RUN',70,80);g.fillText('SORTIR: 1.284',430,140);
      g.fillStyle='#2a7a3a';g.beginPath();g.arc(45,98,9,0,7);g.fill();}
    if(mhm.st.ctl){g.strokeStyle='#446';g.lineWidth=2;
      g.strokeRect(60,180,120,44);g.font='600 15px Consolas';
      g.fillStyle='#222a31';g.fillText('STOP LINE',74,207);
      g.fillStyle='#667';g.font='600 12px Consolas';
      g.fillText('(tahan 2 dtk + konfirmasi)',60,240);}
    if(mhm.st.alm){g.fillStyle='#fff3cd';g.fillRect(310,180,290,60);
      g.strokeStyle='#b8860b';g.strokeRect(310,180,290,60);
      g.fillStyle='#7a5a00';g.font='600 13px Consolas';
      g.fillText('⚠ P2 | sensor transfer kotor',320,202);
      g.fillText('→ bersihkan lensa, reset di sini',320,224);}
    if(mhm.st.trd){g.strokeStyle='#2a5a8a';g.lineWidth=2;g.beginPath();
      for(let x=0;x<280;x+=4){g.lineTo(60+x,320-Math.sin(x*.05)*18-(x>180?14:0));}
      g.stroke();g.fillStyle='#222a31';g.font='600 13px Consolas';
      g.fillText('TREND: laju sortir/jam (8 jam)',60,275);}
    mhm.D.tex.needsUpdate=true;}
  layar();
  /* kartu prinsip */
  mhm.cards=[];
  [['OVERVIEW','OV',2.2],['KONTROL','CTL',3.3],['ALARM','ALM',2.2],['TREND','TRD',3.3]].forEach((o,i)=>{
    const y=i<2?2.9:1.9;
    const c=box(.95,.6,.07,0x2b3a4a);c.position.set(o[2],y,-2.85);scene.add(c);
    actMesh(c,o[1]);mhm.cards.push(c);
    scene.add(label(o[0],.5,'#5fd4ff').translateX(o[2]).translateY(y+.45).translateZ(-2.8));});
  /* operator figur */
  mhm.op=new THREE.Group();
  const badan=cyl(.2,.26,.85,0x2a5a8a);badan.position.y=.7;mhm.op.add(badan);
  const kepala=new THREE.Mesh(new THREE.SphereGeometry(.15,14,12),
    new THREE.MeshStandardMaterial({color:0xd8b090}));kepala.position.y=1.32;mhm.op.add(kepala);
  mhm.op.position.set(5.2,0,-1.4);scene.add(mhm.op);
  actMesh(badan,'OPTEST');
  scene.add(label('OPERATOR BARU',.6).translateX(5.2).translateY(1.85).translateZ(-1.4));
  startSeq([
   {type:'act',aid:'OV',done:false,targets:()=>[mhm.cards[0]],
    desc:'Rancang halaman OVERVIEW: status line dalam 3 detik (klik kartu).',
    why:'Latar abu netral, mimic line sederhana, SATU indikator besar status, dan angka produksi yang penting saja. Warna disimpan untuk masalah: layar yang tenang saat normal membuat ketidaknormalan MENJERIT dengan sendirinya. Ini ilmu ISA-101, bukan selera.',
    fx(){mhm.st.ov=true;layar();
      toast('🖥️ Overview: tenang, hirarkis, 3 detik paham ✓','ok',2800);}},
   {type:'act',aid:'CTL',done:false,targets:()=>[mhm.cards[1]],
    desc:'Tambah KONTROL yang aman dari sentuhan nyasar (klik kartu).',
    why:'Tombol STOP LINE: tahan 2 detik + dialog konfirmasi — jari yang tersenggol lengan baju tak boleh menghentikan produksi sejam. Tiap aksi memberi umpan balik (tombol berubah, status berganti): operator tak pernah bertanya "tadi kepencet nggak ya?"',
    fx(){mhm.st.ctl=true;layar();
      toast('🎛️ Kontrol 2 langkah + umpan balik — anti sentuhan nyasar.','ok',2800);}},
   {type:'act',aid:'ALM',done:false,targets:()=>[mhm.cards[2]],
    desc:'Susun halaman ALARM berprioritas + instruksi (klik kartu).',
    why:'Tiga kasta: P1 merah (berhenti sekarang), P2 kuning (tindak <1 jam), P3 info. Dan tiap alarm membawa INSTRUKSI: "sensor transfer kotor → bersihkan lensa". Alarm yang menuntun melahirkan operator mandiri; alarm yang hanya berkedip melahirkan telepon tengah malam ke engineer.',
    fx(){mhm.st.alm=true;layar();
      toast('🚨 Alarm berprioritas + instruksi — menuntun, bukan menakuti.','ok',2800);}},
   {type:'act',aid:'TRD',done:false,targets:()=>[mhm.cards[3]],
    desc:'Lengkapi halaman TREND untuk investigasi (klik kartu).',
    why:'Laju sortir per jam, 8 jam ke belakang: penurunan pelan yang tak terasa per menit jadi kasat mata dalam kurva — sensor mulai kotor, belt mulai selip. Trend adalah mesin waktu kecil yang membuat operator bertanya SEBELUM rusak, bukan setelahnya.',
    fx(){mhm.st.trd=true;layar();
      toast('📈 Trend 8 jam — penurunan pelan tak bisa sembunyi lagi.','ok',2800);}},
   {type:'act',aid:'OPTEST',done:false,targets:()=>[mhm.op.children[0]],
    desc:'Ujian sebenarnya: minta OPERATOR BARU memakainya (klik operator).',
    why:'Tiga skenario tanpa bantuan: baca status (2,4 detik ✓), hentikan line dengan aman ✓, respons alarm sensor kotor — ia membaca instruksi, membersihkan lensa, reset sendiri ✓. HMI dinilai bukan oleh yang merancang, tapi oleh yang memakai jam dua pagi nanti.',
    fx(){toast('🧑‍🔧 Operator lulus 3 skenario TANPA bantuan — HMI diterima!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Mesin bisu kini berwajah!</b> Tenang saat normal, menjerit saat tidak, menuntun saat ditanya. Logika PLC-mu hebat — tapi HMI inilah yang membuat manusia mempercayainya. Otomasi lengkap: otak, otot, dan wajah.');
    setTimeout(()=>showWin('hmi'),2200);});
  say('VOLTA di sini 🖥️ Line sortirmu pintar tapi <b>bisu</b> — operator butuh wajahnya. Hari ini kita belajar desain HMI: abu-abu itu emas, warna hanya untuk masalah, dan ujiannya bukan engineer... tapi operator baru. Mulai dari overview!');
  $('#modTitle').textContent='J16·M5 — HMI Design';
  $('#taskHead').textContent='TENANG SAAT NORMAL, JELAS SAAT TIDAK';}
MISSIONS.hmi.build=buildHMI;
Object.assign(REAL,{
 hmi:[
  'Libatkan operator sejak draft pertama — HMI yang dirancang tanpa pemakainya pasti dirombak',
  'Ikuti pedoman high-performance HMI (ISA-101): hirarki layar, abu-abu dasar, warna untuk abnormal',
  'Rasionalisasi alarm berkala: alarm yang selalu aktif & di-acknowledge buta adalah kebisingan berbahaya',
  'Simpan backup project HMI + dokumentasi tag — layar tanpa dokumentasi adalah sandera vendor'],
});

/* =====================================================================
   MISI 6 — PID CONTROL: SENI MENJAGA SETPOINT
   ===================================================================== */
Object.assign(MISSIONS,{
 pid:{lvl:'JALUR 16 · KONTROL & OTOMASI · MISI 6',icon:'🎚️',title:'PID Control: Seni Menjaga Setpoint',strict:false,
  loc:'📍 Gudang distribusi · Tangki air proses + pompa VFD',
  story:'Logika diskrit (ON/OFF, timer, counter) sudah kamu kuasai — kini dunia KONTINU memanggil: tangki air proses yang levelnya harus tetap 60% walau pemakaian naik-turun semaunya. ON/OFF membuat pompa hidup-mati ratusan kali sehari; jawabannya tiga huruf yang menggerakkan separuh industri dunia: PID. Hari ini kamu menjinakkannya — bukan dengan rumus, tapi dengan rasa.',
  goal:'Loop PID level tangki tertala: P-I-D dipahami lewat eksperimen langsung, osilasi dijinakkan, dan level bertahan di setpoint walau beban berubah mendadak.',
  obj:['Rasakan kontrol P murni & kelemahannya','Tambah I untuk menghapus offset, jinakkan osilasi','Uji gangguan beban & validasi respons'],
  learn:['P (proportional) bereaksi sebesar error: cepat tapi selalu menyisakan offset — ia butuh error untuk bekerja, maka error tak pernah benar-benar nol','I (integral) menjumlah error sepanjang waktu: offset terhapus... tapi I yang serakah membuat sistem berayun (overshoot-osilasi)','D (derivative) membaca laju perubahan: rem peredam yang menenangkan ayunan — di proses ber-noise, D dipakai hemat atau tidak sama sekali','Menala PID = kompromi: cepat tapi tenang — naikkan P sampai hampir berosilasi, beri I secukupnya menghapus offset, D seperlunya meredam'],
  next:['Pelajari metode tuning formal: Ziegler-Nichols & lambda tuning','Dalami cascade control: dua PID bertingkat untuk proses lambat','Eksplorasi feedforward: melawan gangguan sebelum terasa']},
});
let mpd={};
function buildPID(){
  freshScene(0xb0bfcc,0x131c26);
  cam={theta:.05,phi:1.16,r:7.5,target:new THREE.Vector3(0,1.8,-.8)};
  const floor=boxT(14,.1,9,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(13,4.6,.15,TEX.plaster());wall.position.set(0,2.3,-3);scene.add(wall);
  /* tangki transparan dengan level */
  const tank=new THREE.Mesh(new THREE.CylinderGeometry(.8,.8,2.4,24,1,true),
    new THREE.MeshStandardMaterial({color:0x9fc4dc,transparent:true,opacity:.3,side:2}));
  tank.position.set(-3.6,1.4,-1.4);scene.add(tank);
  mpd.air=cyl(.76,.76,1.4,0x2a6a9a,24,{transparent:true,opacity:.8});
  mpd.air.position.set(-3.6,.95,-1.4);scene.add(mpd.air);
  scene.add(label('TANGKI PROSES — SP 60%',.75).translateX(-3.6).translateY(3.0).translateZ(-1.4));
  /* pompa VFD */
  const pompa=cyl(.3,.3,.7,0x3a6ea8);pompa.rotation.z=Math.PI/2;pompa.position.set(-5.6,.4,-1.4);scene.add(pompa);
  scene.add(label('POMPA + VFD',.6).translateX(-5.6).translateY(.95).translateZ(-1.4));
  /* layar trend PID */
  const frame=boxT(4.2,2.4,.16,TEX.metal(),{metalness:.4});frame.position.set(1.6,2.4,-2.9);scene.add(frame);
  frame.add(label('TREND: LEVEL vs SETPOINT',.85).translateY(1.5));
  mpd.D=makeDisplay(3.9,2.1,560,330);
  mpd.D.mesh.position.set(1.6,2.4,-2.79);scene.add(mpd.D.mesh);
  /* kartu mode */
  mpd.cards=[];
  [['P SAJA','PMODE',-1.2],['+ INTEGRAL','IMODE',0],['TALA HALUS','TUNE',1.2],['UJI BEBAN','TEST',2.4]].forEach((o,i)=>{
    const c=box(1.0,.4,.1,0x2b3a4a);c.position.set(o[2]+1.2,.9,-2.85);scene.add(c);
    actMesh(c,o[1]);mpd.cards.push(c);
    scene.add(label(o[0],.48,'#5fd4ff').translateX(o[2]+1.2).translateY(1.25).translateZ(-2.8));});
  /* simulasi level */
  mpd.level=40;mpd.sp=60;mpd.mode=0;mpd.hist=[];mpd.t=0;mpd.integ=0;mpd.beban=.30;
  moduleTick=(dt)=>{
    mpd.t+=dt;
    const err=mpd.sp-mpd.level;
    let out=0;
    if(mpd.mode===1)out=err*2.2;                       /* P saja */
    if(mpd.mode===2){mpd.integ+=err*dt*2.4;out=err*2.6+mpd.integ;}  /* PI serakah */
    if(mpd.mode>=3){mpd.integ+=err*dt*.7;out=err*1.8+mpd.integ;}    /* tertala */
    out=Math.max(0,Math.min(100,out+30));
    mpd.level+=(out*.01-mpd.beban)*dt*14;
    mpd.level=Math.max(0,Math.min(100,mpd.level));
    mpd.air.scale.y=Math.max(.05,mpd.level/100*1.7);
    mpd.air.position.y=.25+mpd.level/100*1.7*.7;
    mpd.hist.push(mpd.level);if(mpd.hist.length>180)mpd.hist.shift();
    if((mpd.t*8|0)%2===0)trend();};
  function trend(){
    const g=mpd.D.g,W=560,H=330;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.strokeStyle='#7a2a2a';g.setLineDash([6,5]);g.lineWidth=2;
    const ySP=H-30-(mpd.sp/100)*(H-60);
    g.beginPath();g.moveTo(20,ySP);g.lineTo(W-12,ySP);g.stroke();g.setLineDash([]);
    g.fillStyle='#ff8d8d';g.font='600 14px Consolas';g.textAlign='left';
    g.fillText('SP 60%',24,ySP-8);
    g.strokeStyle='#46ff8e';g.lineWidth=3;g.beginPath();
    mpd.hist.forEach((v,i)=>{const x=20+i*3,y=H-30-(v/100)*(H-60);
      i===0?g.moveTo(x,y):g.lineTo(x,y);});
    g.stroke();
    g.fillStyle='#8aa3bd';g.font='700 16px Consolas';
    const lbl=['MANUAL','P SAJA — offset!','P+I — berayun!','TERTALA ✓','UJI BEBAN'][mpd.mode]||'';
    g.fillText(lbl+' · PV '+mpd.level.toFixed(1)+'%',24,28);
    mpd.D.tex.needsUpdate=true;}
  trend();
  startSeq([
   {type:'act',aid:'PMODE',done:false,targets:()=>[mpd.cards[0]],
    desc:'Eksperimen 1: jalankan kontrol P SAJA — amati trendnya (klik kartu).',
    why:'P bereaksi proporsional: level melesat dari 40% mendekati target... lalu BERHENTI di ±55%, menggantung di bawah setpoint selamanya. Itulah offset bawaan P: ia butuh error agar output-nya cukup melawan beban — maka error tak pernah diizinkan nol. Cepat, tapi tak pernah sampai.',
    fx(){mpd.mode=1;toast('📈 P murni: cepat naik… mandek di 55% — offset abadi.','info',3000);}},
   {type:'act',aid:'IMODE',done:false,targets:()=>[mpd.cards[1]],
    desc:'Eksperimen 2: tambah INTEGRAL (agak serakah) — lihat akibatnya.',
    why:'I menjumlah error dari waktu ke waktu dan terus mendorong sampai nol — offset musnah! Tapi I yang diset serakah punya kelembaman: ia terus mendorong walau sudah sampai... level MELEWATI setpoint, berbalik, melewati lagi — berayun-ayun seperti bandul. Penyakit ini bernama overshoot-osilasi.',
    fx(){mpd.mode=2;mpd.integ=0;toast('🌊 Offset hilang… tapi level BERAYUN — integral terlalu galak.','bad',3000);}},
   {type:'act',aid:'TUNE',done:false,targets:()=>[mpd.cards[2]],
    desc:'TALA HALUS: turunkan gain, jinakkan integral (klik kartu).',
    why:'Resep kompromi: P diturunkan sedikit (reaksi tetap sigap tanpa menyentuh ambang osilasi), I dipangkas ke sepertiga (menghapus offset dengan sabar, bukan rakus). Trend menunjukkan hasilnya: naik mantap, satu overshoot mungil yang sopan, lalu MENEMPEL di garis 60%. Itulah suara loop yang sehat — sunyi.',
    fx(){mpd.mode=3;mpd.integ=0;toast('🎯 Tertala: mantap, overshoot mungil, menempel di SP.','ok',3000);}},
   {type:'act',aid:'TEST',done:false,targets:()=>[mpd.cards[3]],
    desc:'Ujian akhir: GANGGUAN BEBAN — pemakaian air melonjak 60% (klik kartu).',
    why:'Keran proses dibuka lebar mendadak: level terseret turun... P langsung melawan sebesar simpangan, I menambah dorongan yang hilang permanen — dalam setengah menit level merangkak pulang ke 60% dan diam di sana, pada beban yang sama sekali baru. Setpoint dijaga bukan saat dunia tenang — justru saat dunia berubah.',
    fx(){mpd.mode=4;mpd.beban=.48;setTimeout(()=>{mpd.mode=3;},100);
      toast('💪 Beban +60% → level pulih & menempel lagi. LOOP LULUS!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>PID dijinakkan dengan rasa, bukan hafalan!</b> P yang cepat tapi mandek, I yang tuntas tapi berayun, dan talanan yang membuat keduanya berdamai. Setengah industri dunia berdiri di atas loop seperti ini — dan kini kamu bisa menalanya.');
    setTimeout(()=>showWin('pid'),2200);});
  say('VOLTA di sini 🎚️ Selamat datang di dunia kontinu: tangki yang levelnya harus <b>tetap 60%</b> walau pemakaian semaunya. Tiga huruf legendaris menanti dijinakkan: P, I, D — kita pelajari lewat eksperimen, bukan rumus. Mulai dari P saja!');
  $('#modTitle').textContent='J16·M6 — PID Control';
  $('#taskHead').textContent='CEPAT TAPI TENANG';}
MISSIONS.pid.build=buildPID;
Object.assign(REAL,{
 pid:[
  'Kenali prosesmu dulu (cepat/lambat, ada dead time?) — resep tuning berbeda per karakter proses',
  'Ubah satu parameter pada satu waktu & beri proses waktu menjawab — tuning terburu menipu',
  'Catat parameter akhir + alasan di dokumentasi loop — penala berikutnya mewarisi konteks, bukan angka misterius',
  'Waspadai integral windup saat aktuator jenuh — aktifkan anti-windup di blok PID'],
});

/* =====================================================================
   MISI 7 — ROBOT PALLETIZER: LENGAN YANG BELAJAR
   ===================================================================== */
Object.assign(MISSIONS,{
 robot:{lvl:'JALUR 16 · KONTROL & OTOMASI · MISI 7',icon:'🦾',title:'Robot Palletizer: Lengan yang Belajar',strict:true,
  loc:'📍 Gudang distribusi · Ujung line sortir, robot baru tiba',
  story:'Line sortirmu kini menumpuk masalah baru yang menyenangkan: kotak tersortir menggunung lebih cepat dari tenaga manusia menyusunnya ke palet. Solusinya baru saja diturunkan dari truk: ROBOT PALLETIZER 4-axis. Tapi robot industri bukan mainan — ia lengan 300 kg yang bergerak secepat kilat tanpa menoleh. Hari ini kamu mengajarinya menyusun... dan mengajari semua orang menghormatinya.',
  goal:'Robot beroperasi terintegrasi line: safety zone terpasang & teruji DULU, teach points presisi, pola palet tersusun, dan handshake dengan PLC sortir berjalan mulus.',
  obj:['Pasang & uji safety: pagar, kurtain, e-stop','Teach pendant: ajari titik pick & place','Susun pola palet & integrasi handshake PLC'],
  learn:['Keselamatan robot ditegakkan SEBELUM gerakan pertama: pagar + light curtain + e-stop teruji — lengan industri tak bisa melihatmu, jadi sistemlah yang harus','Teach pendant adalah sekolah robot: mode manual kecepatan rendah, titik demi titik (pick, lintasan aman, place) disimpan presisi — dan zona kerjanya dibatasi software (soft limit)','Pola palet adalah matematika: susunan interlock antar lapis membuat tumpukan saling mengunci — robot menghitung ofset tiap kotak dari satu pola master','Robot & PLC berjabat tangan via handshake I/O: "kotak siap" → "robot ambil" → "selesai" — dua otak yang sopan saling menunggu, tak pernah saling menabrak'],
  next:['Pelajari koordinat sistem robot (joint, world, tool) lebih dalam','Dalami collaborative robot (cobot): kapan pagar boleh hilang','Eksplorasi vision system: robot yang akhirnya bisa melihat']},
});
let mrb={};
function buildRobot(){
  freshScene(0xb8c4cc,0x10181e);
  cam={theta:.3,phi:1.12,r:9,target:new THREE.Vector3(0,1.4,-.6)};
  const floor=boxT(22,.1,13,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  /* ujung konveyor sortir */
  const belt=box(5,.22,1.1,0x222a31,{roughness:.85});belt.position.set(-4.5,.85,-1.5);scene.add(belt);
  [-6,-4.5,-3].forEach(x=>{const leg=boxT(.12,.78,.9,TEX.metal(),{metalness:.4});
    leg.position.set(x,.39,-1.5);scene.add(leg);});
  scene.add(label('DARI LINE SORTIR',.65).translateX(-4.5).translateY(1.6).translateZ(-1.5));
  mrb.kotak=box(.5,.4,.5,0xc8893a,{roughness:.8});mrb.kotak.position.set(-2.6,1.16,-1.5);scene.add(mrb.kotak);
  /* robot 4-axis */
  mrb.robot=new THREE.Group();
  const base=cyl(.45,.55,.4,0xd87a20);base.position.y=.2;mrb.robot.add(base);
  mrb.arm1=box(.3,1.4,.3,0xd87a20);mrb.arm1.position.y=1.0;mrb.robot.add(mrb.arm1);
  mrb.arm2=box(1.6,.26,.26,0xe8923a);mrb.arm2.position.set(.7,1.7,0);mrb.robot.add(mrb.arm2);
  mrb.grip=box(.3,.3,.3,0x444b55);mrb.grip.position.set(1.5,1.5,0);mrb.robot.add(mrb.grip);
  mrb.robot.position.set(-.6,0,-1.5);scene.add(mrb.robot);
  actMesh(mrb.arm2,'TEACH');
  scene.add(label('ROBOT PALLETIZER 4-AXIS',.8).translateX(-.6).translateY(2.6).translateZ(-1.5));
  /* palet */
  const palet=boxT(1.4,.14,1.4,TEX.wood());palet.position.set(1.8,.07,-1.5);scene.add(palet);
  mrb.tumpuk=[];
  scene.add(label('PALET',.6).translateX(1.8).translateY(.55).translateZ(-1.5));
  /* pagar + light curtain */
  mrb.pagar=[];
  [[-.6,-3.2,3.6,0],[1.8,-3.2,3.6,0],[-2.4,-1.5,0,3.4],[3.4,-1.5,0,3.4]].forEach(o=>{
    const p=box(o[2]||.06,1.4,o[3]||.06,0xd8b020,{transparent:true,opacity:.5});
    p.position.set(o[0],.7,o[1]);p.visible=false;scene.add(p);mrb.pagar.push(p);});
  mrb.pagarBtn=box(.5,.4,.3,0xd8b020);mrb.pagarBtn.position.set(3.8,.3,.8);scene.add(mrb.pagarBtn);
  actMesh(mrb.pagarBtn,'SAFETY');
  scene.add(label('PAKET SAFETY (pagar+kurtain+e-stop)',.6,'#ffd23f').translateX(3.8).translateY(.85).translateZ(.8));
  /* teach pendant */
  mrb.pend=box(.3,.42,.08,0x2b3a4a);mrb.pend.position.set(-2.6,1.0,.8);scene.add(mrb.pend);
  scene.add(label('TEACH PENDANT',.55,'#5fd4ff').translateX(-2.6).translateY(1.45).translateZ(.8));
  /* layar pola + PLC */
  mrb.D=makeDisplay(1.8,1.1,400,230);
  mrb.D.mesh.position.set(5.4,2.1,-2.2);scene.add(mrb.D.mesh);
  dispText(mrb.D,['POLA PALET','belum tersusun'],['#5fd4ff','#7d8f84']);
  actMesh(mrb.D.mesh,'POLA');
  const pole=cyl(.04,.04,1.6,0x666666);pole.position.set(5.4,.75,-2.2);scene.add(pole);
  mrb.running=false;mrb.t=0;mrb.n=0;
  moduleTick=(dt)=>{
    if(!mrb.running)return;
    mrb.t+=dt;
    const ph=mrb.t%3;
    mrb.robot.rotation.y=ph<1.5?(-.6+ph*.8):(0.6-(ph-1.5)*.8);
    if(ph<.1&&mrb.n<6&&mrb.t>1){
      const k=box(.5,.4,.5,0xc8893a,{roughness:.8});
      const col=mrb.n%2,row=Math.floor(mrb.n/2);
      k.position.set(1.55+col*.52,.35+Math.floor(mrb.n/4)*.42,-1.75+(row%2)*.52);
      scene.add(k);mrb.tumpuk.push(k);mrb.n++;}};
  startSeq([
   {type:'act',aid:'SAFETY',done:false,targets:()=>[mrb.pagarBtn],
    desc:'HUKUM PERTAMA: pasang & uji safety SEBELUM robot bergerak (klik paket).',
    why:'Pagar mengelilingi zona, light curtain menjaga bukaan konveyor (tangan masuk = robot membeku <0,2 detik — diuji dengan tongkat ✓), tiga e-stop teruji semua. Lengan 300 kg ini tak punya mata & tak punya ampun: sistemlah yang melihat untuknya. Tanpa langkah ini, langkah berikutnya tidak ada.',
    fx(){mrb.pagar.forEach(p=>p.visible=true);
      toast('🛡️ Pagar + kurtain (0,18 dtk) + 3 e-stop — zona steril.','ok',3200);}},
   {type:'act',aid:'TEACH',done:false,targets:()=>[mrb.arm2],
    desc:'Sekolah robot: TEACH titik pick, lintasan & place (klik lengan).',
    why:'Mode teach: kecepatan 10%, deadman switch tertekan, lengan dituntun titik demi titik — PICK di ujung konveyor, WAYPOINT aman (melengkung tinggi, menjauhi pagar), PLACE presisi di sudut palet. Soft limit dikunci: di luar amplop ini, software menolak bergerak. Robot kini hafal koreografinya — selamanya, tanpa bosan.',
    fx(){toast('🎓 9 titik tersimpan + soft limit terkunci.','ok',3000);}},
   {type:'act',aid:'POLA',done:false,targets:()=>[mrb.D.mesh],
    desc:'Susun POLA PALET interlock di layar (klik layar).',
    why:'Lapis ganjil & genap disusun saling silang (interlock) — tiap kotak mengunci sambungan lapis bawahnya, tumpukan kokoh tanpa lem & wrapping berlebih. Robot cukup diberi SATU pola master; ofset tiap kotak ia hitung sendiri. Matematika menyusun lebih rapi dari lengan terlatih mana pun.',
    fx(){dispText(mrb.D,['POLA INTERLOCK ✓','2x2 × 2 lapis · silang'],['#46ff8e','#eaf2fb']);
      toast('🧮 Pola interlock terkunci — tumpukan saling mengunci.','ok',3000);}},
   {type:'act',aid:'SHAKE',done:false,targets:()=>[mrb.D.mesh],
    desc:'Integrasi: HANDSHAKE robot ↔ PLC line sortir (klik layar).',
    why:'Dua otak diajari sopan santun: PLC sortir mengangkat sinyal "kotak siap di posisi" → robot menjawab "mengambil" (konveyor menahan kotak berikutnya) → "selesai, kirim lagi". Tanpa handshake, robot mencengkeram udara atau konveyor menabrakkan kotak ke lengan — dua mesin pintar yang tak saling bicara adalah dua mesin bodoh.',
    fx(){toast('🤝 Handshake I/O teruji 20 siklus — dua otak satu bahasa.','ok',3000);}},
   {type:'act',aid:'RUN',done:false,targets:()=>[mrb.arm2],
    desc:'Produksi perdana: RUN otomatis — saksikan lengan menyusun (klik lengan).',
    why:'Kecepatan dinaikkan bertahap 10→50→100%: kotak demi kotak terangkat dari konveyor, melayang di lintasan aman, mendarat presisi milimeter di pola silangnya — 8 detik per kotak, sepanjang shift, tanpa punggung yang pegal. Dua penyusun manual? Kini operator robot & QC — naik kelas bersama mesinnya.',
    fx(){mrb.running=true;
      toast('🦾 RUN! Lengan menyusun palet — presisi & tak kenal lelah.','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Lengan itu kini bekerja untukmu!</b> Safety ditegakkan sebelum gerakan pertama, sembilan titik diajarkan dengan sabar, pola interlock terkunci, dan dua otak berjabat tangan. Line-mu kini lengkap: sensor melihat, PLC berpikir, robot bekerja — dan manusia memimpin.');
    setTimeout(()=>showWin('robot'),2200);});
  const s1r=seq.steps[1],of1r=s1r.fx;s1r.fx=()=>{of1r();mrb.arm2.userData.aid='RUN';};
  const s2r=seq.steps[2],of2r=s2r.fx;s2r.fx=()=>{of2r();mrb.D.mesh.userData.aid='SHAKE';};
  say('VOLTA di sini 🦾 Anggota tim terbaru line-mu: <b>robot palletizer 300 kg</b> yang bergerak secepat kilat tanpa menoleh. Hukum pertamanya bukan program — tapi PAGAR. Safety dulu, baru sekolah. Mulai!');
  $('#modTitle').textContent='J16·M7 — Robot Palletizer';
  $('#taskHead').textContent='PAGAR DULU, PROGRAM KEMUDIAN';}
MISSIONS.robot.build=buildRobot;
Object.assign(REAL,{
 robot:[
  'Risk assessment robot sesuai standar keselamatan mesin SEBELUM instalasi — safety dirancang, bukan ditambal',
  'Hanya personel terlatih memegang teach pendant; mode manual = kecepatan terbatasi & deadman aktif',
  'Validasi pola palet dengan uji transport nyata (getaran truk) — rapi di gudang belum tentu utuh di jalan',
  'Audit berkala fungsi safety (kurtain, e-stop) terjadwal — perangkat keselamatan juga bisa menua'],
});

/* =====================================================================
   MISI 8 — CYBERSECURITY OT: BENTENG DUNIA KONTROL
   ===================================================================== */
Object.assign(MISSIONS,{
 cyber:{lvl:'JALUR 16 · KONTROL & OTOMASI · MISI 8',icon:'🔐',title:'Cybersecurity OT: Benteng Dunia Kontrol',strict:true,
  loc:'📍 Gudang distribusi · Pasca-insiden USB di PC HMI',
  story:'Senin pagi yang mengubah segalanya: teknisi mencolok USB pribadi ke PC HMI "cuma mau ngecas" — antivirus kantor menjerit: malware. Untungnya jinak. Tapi pertanyaannya menggigil: PC itu TERSAMBUNG ke PLC line sortir, robot, dan konveyor. Dunia OT-mu — yang dirancang puluhan tahun dgn asumsi "tak ada orang jahat di jaringan" — baru saja sadar ia telanjang. Saatnya membangun benteng.',
  goal:'Postur keamanan OT terbangun: insiden ditangani benar, jaringan tersegmentasi IT/OT dgn zona, akses & USB terkendali, dan tim terlatih merespons — tanpa menghentikan produksi.',
  obj:['Tangani insiden USB: isolasi, bersihkan, belajar','Segmentasi jaringan: zona & conduit IT/OT','Kendalikan akses & latih respons insiden'],
  learn:['Dunia OT berbeda mazhab dari IT: prioritasnya AVAILABILITY — mematikan server kantor itu wajar, mematikan PLC line = produksi mati: respons insiden OT punya koreografinya sendiri','Segmentasi zona & conduit: kantor (IT) dan kontrol (OT) dipisah firewall industrial, yang boleh lewat hanya yang terdaftar — malware kantor tak boleh bisa "melihat" PLC','PC HMI bukan PC biasa: USB dikunci, tak ada email/browser, patch diuji dulu di staging — kenyamanan kantor adalah pintu masuk bencana kontrol','Manusia tetap firewall pertama & terakhir: pelatihan, kebijakan USB, dan budaya melapor tanpa takut — teknisi yang jujur hari itu adalah pahlawan, bukan tersangka'],
  next:['Pelajari standar keamanan OT (IEC 62443) & asesmen kesenjangannya','Dalami monitoring jaringan OT pasif (tanpa mengganggu kontrol)','Susun rencana respons insiden OT bersama produksi & manajemen']},
});
let mcy={};
function buildCyber(){
  freshScene(0x1d2a3a,0x0a121c);
  cam={theta:.05,phi:1.16,r:8.5,target:new THREE.Vector3(0,1.7,-.8)};
  const Z=room(0x39424c,0xc4cdd6,16,11);
  /* PC HMI dgn USB */
  mcy.pc=box(.7,.5,.1,0x2b3a4a);mcy.pc.position.set(-4.4,1.5,Z+.08);scene.add(mcy.pc);
  actMesh(mcy.pc,'ISOLASI');
  mcy.usb=box(.06,.04,.12,0xd83a3a);mcy.usb.position.set(-4.0,1.3,Z+.14);scene.add(mcy.usb);
  scene.add(label('PC HMI — USB tertancap! ⚠',.65,'#ff8d8d').translateX(-4.4).translateY(2.1).translateZ(Z+.1));
  /* rak PLC & robot controller */
  const rak=boxT(1.6,2.0,.5,TEX.metal(),{metalness:.35});rak.position.set(-1.6,1.05,Z);scene.add(rak);
  rak.add(label('PLC LINE + ROBOT CTRL',.65).translateY(1.3));
  /* firewall industrial (baru) */
  mcy.fw=box(.6,.3,.4,0xd87a20);mcy.fw.position.set(1.2,1.3,Z+.1);mcy.fw.visible=false;scene.add(mcy.fw);
  mcy.fwBtn=box(.6,.4,.4,0xd87a20);mcy.fwBtn.position.set(4.6,.4,.8);scene.add(mcy.fwBtn);
  actMesh(mcy.fwBtn,'SEGMEN');
  scene.add(label('FIREWALL INDUSTRIAL (dus)',.6,'#ffd23f').translateX(4.6).translateY(.95).translateZ(.8));
  /* diagram zona */
  const frame=boxT(3.6,2.2,.16,TEX.metal(),{metalness:.4});frame.position.set(2.4,2.5,Z+.05);scene.add(frame);
  frame.add(label('PETA JARINGAN',.8).translateY(1.35));
  mcy.D=makeDisplay(3.3,1.9,520,300);
  mcy.D.mesh.position.set(2.4,2.5,Z+.15);scene.add(mcy.D.mesh);
  actMesh(mcy.D.mesh,'AKSES');
  mcy.mode=0;
  function peta(){
    const g=mcy.D.g,W=520,H=300;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='600 14px Consolas';g.textAlign='left';
    if(mcy.mode===0){
      g.fillStyle='#ff5a5a';g.font='700 16px Consolas';
      g.fillText('SEBELUM: satu jaringan rata',16,30);
      g.strokeStyle='#5d748c';g.lineWidth=3;
      g.beginPath();g.moveTo(40,90);g.lineTo(480,90);g.stroke();
      ['email','kantor','HMI','PLC','robot'].forEach((t,i)=>{
        g.fillStyle='#13202f';g.fillRect(40+i*92,110,76,40);
        g.fillStyle=i<2?'#8aa3bd':'#ffd23f';g.fillText(t,52+i*92,135);});
      g.fillStyle='#ff8d8d';g.fillText('malware kantor bisa "melihat" PLC — telanjang',16,H-20);}
    else{
      g.fillStyle='#46ff8e';g.font='700 16px Consolas';
      g.fillText('SESUDAH: zona & conduit',16,30);
      g.fillStyle='#13202f';g.fillRect(30,60,200,90);
      g.fillStyle='#8aa3bd';g.fillText('ZONA IT (kantor)',42,82);
      g.fillStyle='#13202f';g.fillRect(290,60,200,90);
      g.fillStyle='#ffd23f';g.fillText('ZONA OT (kontrol)',302,82);
      g.fillStyle='#d87a20';g.fillRect(238,85,46,40);
      g.fillStyle='#0a1018';g.font='700 13px Consolas';g.fillText('FW',250,110);
      g.fillStyle='#46ff8e';g.font='600 14px Consolas';
      g.fillText('hanya 3 aturan lewat: historian, backup, NTP',30,190);
      g.fillText('selebihnya: DITOLAK & dicatat',30,216);
      if(mcy.mode>=2){g.fillStyle='#5fd4ff';
        g.fillText('USB: port terkunci · akses: per-orang + log',30,252);}}
    mcy.D.tex.needsUpdate=true;}
  peta();
  /* ruang drill */
  mcy.drill=box(.5,.66,.04,0xffe8c0);mcy.drill.position.set(5.4,2.0,Z+.06);scene.add(mcy.drill);
  actMesh(mcy.drill,'DRILL');
  scene.add(label('TABLETOP DRILL',.6,'#ffd23f').translateX(5.4).translateY(2.55).translateZ(Z+.1));
  startSeq([
   {type:'act',aid:'ISOLASI',done:false,targets:()=>[mcy.pc],
    desc:'Tangani insiden ala OT: ISOLASI tanpa mematikan produksi (klik PC).',
    why:'Mazhab IT bilang: matikan mesinnya. Mazhab OT bertanya dulu: PC ini mengendalikan apa? Jawab: hanya tampilan — PLC tetap jalan mandiri. Maka: kabel jaringan PC dicabut (bukan power!), line tetap berproduksi, PC di-imaging untuk forensik, HMI cadangan naik. Insiden tertangani; produksi tak kehilangan satu kotak pun.',
    fx(){mcy.usb.visible=false;
      toast('🔌 PC diisolasi dari jaringan — line TETAP berjalan.','ok',3200);}},
   {type:'act',aid:'SEGMEN',done:false,targets:()=>[mcy.fwBtn],
    desc:'Bangun benteng: SEGMENTASI zona IT/OT dgn firewall industrial (klik dus).',
    why:'Jaringan rata dibelah dua zona: kantor (email, browser — dunia liar) dan kontrol (PLC, HMI, robot — dunia steril), dipisah firewall industrial yang hanya melewatkan TIGA aturan terdaftar: data historian keluar, backup, sinkron waktu. Malware kantor kini menatap tembok. Dipasang saat jendela maintenance — produksi tak terinterupsi.',
    fx(){mcy.fw.visible=true;mcy.fwBtn.visible=false;mcy.mode=1;peta();
      toast('🧱 Zona IT|FW|OT berdiri — hanya 3 aturan boleh lewat.','ok',3200);}},
   {type:'act',aid:'AKSES',done:false,targets:()=>[mcy.D.mesh],
    desc:'Kunci pintu-pintu kecil: USB, akun, remote (klik peta).',
    why:'Port USB PC OT dikunci kebijakan + fisik (yang butuh transfer: USB khusus ber-scan di kios transfer), akun bersama "operator/operator" dipecah jadi per-orang ber-log, akses remote vendor lewat jalur khusus yang DINYALAKAN hanya saat diperlukan. Pintu besar sudah berbenteng; pintu kecil inilah yang biasanya dilupakan.',
    fx(){mcy.mode=2;peta();
      toast('🔑 USB terkunci · akun per-orang · remote on-demand ✓','ok',3200);}},
   {type:'act',aid:'DRILL',done:false,targets:()=>[mcy.drill],
    desc:'Benteng butuh penjaga terlatih: TABLETOP DRILL (klik lembar).',
    why:'Skenario di atas meja: "HMI semua line menampilkan ransom note — apa yang kalian lakukan dalam 10 menit pertama?" Tim belajar koreografinya: line bisa jalan manual? siapa memutuskan isolasi? siapa menelepon siapa? Dan satu keputusan budaya: teknisi pelapor USB diberi APRESIASI terbuka — pelapor jujur berikutnya sedang diciptakan hari ini.',
    fx(){toast('🎭 Drill tuntas + pelapor diapresiasi — benteng punya penjaga.','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Dunia kontrolmu tak lagi telanjang!</b> Insiden dijawab tanpa menghentikan produksi, zona berdinding firewall, pintu-pintu kecil terkunci, dan manusianya terlatih plus dihargai kejujurannya. Otomasi yang hebat kini juga otomasi yang berbenteng.');
    setTimeout(()=>showWin('cyber'),2200);});
  say('VOLTA di sini 🔐 Senin pagi: USB "cuma ngecas" + malware + PC yang tersambung ke SEMUA PLC-mu. Dunia OT dirancang dgn asumsi semua orang baik — saatnya tumbuh dewasa. Bangun bentengnya, tanpa mematikan produksi!');
  $('#modTitle').textContent='J16·M8 — Cybersecurity OT';
  $('#taskHead').textContent='AVAILABILITY ADALAH RAJA';}
MISSIONS.cyber.build=buildCyber;
Object.assign(REAL,{
 cyber:[
  'Mulai dari asset inventory OT — tak bisa melindungi yang tak diketahui keberadaannya',
  'Patch OT diuji di staging & dijadwalkan di jendela maintenance — bukan auto-update ala kantor',
  'Monitoring pasif (network TAP) lebih aman dari scanning aktif — perangkat OT tua bisa crash di-scan',
  'Latih drill respons bersama produksi minimal tahunan — keputusan "matikan atau jalan terus" jangan lahir saat panik'],
});
