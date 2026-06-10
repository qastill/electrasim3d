/* =====================================================================
   ElectraSim VR 3D — PEMBANGKITAN & RENEWABLE
   Misi: M1 pltu (Start-Up & Sinkronisasi Generator) · M2 gov (Kontrol Frekuensi & Pembebanan)
   Dimuat on-demand oleh index.html lewat ensureMission().
   ===================================================================== */

Object.assign(MISSIONS,{
 pltu:{lvl:'JALUR 07 · PEMBANGKITAN',icon:'🌱',title:'Start-Up & Sinkronisasi Generator',strict:true,
  loc:'📍 PLTU unit 2 · Control room turbin',
  story:'Unit 2 selesai overhaul dan siap kembali ke sistem. Kamu operator turbin. Membawa generator dari diam sampai paralel ke jaringan adalah momen paling menegangkan di pembangkit: menutup breaker di luar fase berarti hentakan torsi raksasa yang bisa memuntir poros. Synchroscope adalah matamu.',
  goal:'Generator sinkron mulus ke jaringan: breaker ditutup TEPAT saat jarum synchroscope di posisi 12, lalu naikkan beban.',
  obj:['Persiapan: pelumas & putaran turbin nominal','Eksitasi ON — bangkitkan tegangan','Tutup breaker tepat saat sinkron, lalu naikkan beban'],
  learn:['Syarat paralel: tegangan sama, frekuensi sama, urutan & sudut fase sama','Synchroscope berputar = beda frekuensi; posisi 12 = sudut fase nol','Menutup breaker di luar fase = arus & torsi kejut yang merusak poros-kopling','Setelah sinkron, governor menaikkan beban MW secara bertahap'],
  next:['Pelajari auto-synchronizer & sync-check relay (proteksi 25)','Dalami kurva kapabilitas generator (P-Q)','Eksplorasi black start: menghidupkan sistem dari nol']},
 gov:{lvl:'JALUR 07 · PEMBANGKITAN · MISI 2',icon:'🎚️',title:'Kontrol Frekuensi & Pembebanan',strict:true,
  loc:'📍 PLTU unit 2 · Shift malam, beban sistem naik',
  story:'Pukul 19:05 — beban sistem melonjak, frekuensi jaringan merosot ke 49,80 Hz. Dispatcher meminta unit 2 menaikkan pembebanan. Frekuensi adalah detak jantung sistem: terlalu rendah, pembangkit lain ikut tumbang. Responmu menentukan.',
  goal:'Frekuensi kembali 50,00 Hz: governor dinaikkan bertahap, tegangan dijaga AVR, kondisi dilaporkan.',
  obj:['Amati penurunan frekuensi & konfirmasi permintaan dispatcher','Naikkan governor bertahap sambil menjaga tegangan','Stabilkan 50 Hz & catat di logsheet'],
  learn:['Frekuensi turun = pembangkitan < beban; naik = sebaliknya. Sesederhana (dan segenting) itu','Governor mengatur MW/frekuensi; AVR mengatur tegangan/MVAr — dua kenop berbeda','Menaikkan beban dihentak = thermal stress turbin; bertahap sesuai ramp rate','Di bawah 49,5 Hz skema UFLS melepas beban otomatis — kamu garis pertahanan sebelum itu'],
  next:['Pelajari speed droop & cara pembangkit berbagi beban','Dalami AGC: kontrol frekuensi otomatis dari pusat','Eksplorasi inertia sistem & tantangan grid tinggi-renewable']},
});

/* =====================================================================
   MISI 12 — PLTU SINKRONISASI (Jalur 07)
   ===================================================================== */
let mpu={};
function buildPLTU(){
  freshScene(0x8aa0b8,0x10181f);
  cam={theta:-.15,phi:1.18,r:9,target:new THREE.Vector3(0,1.8,-.8)};
  const floor=box(20,.1,12,0x39424c);floor.position.y=-.05;scene.add(floor);
  const wall=box(18,4.6,.2,0x4c5862);wall.position.set(0,2.3,-3.6);scene.add(wall);

  /* tangki pelumas */
  mpu.oil=cyl(.5,.5,1.2,0x8a6a3a);mpu.oil.position.set(-6.2,.65,-1.8);scene.add(mpu.oil);
  actMesh(mpu.oil,'OIL');
  scene.add(label('LUBE OIL',.65,'#5fd4ff').translateX(-6.2).translateY(1.55).translateZ(-1.8));
  /* turbin + generator */
  mpu.turb=cyl(.7,.9,2.6,0x9aa7b4);mpu.turb.rotation.z=Math.PI/2;
  mpu.turb.position.set(-2.6,1.2,-1.8);scene.add(mpu.turb);
  actMesh(mpu.turb,'START');
  scene.add(label('TURBIN UAP',.8).translateX(-2.6).translateY(2.4).translateZ(-1.8));
  const gen=cyl(.8,.8,1.8,0x5a7a9a);gen.rotation.z=Math.PI/2;gen.position.set(.4,1.2,-1.8);scene.add(gen);
  scene.add(label('GENERATOR 11kV',.75).translateX(.4).translateY(2.4).translateZ(-1.8));
  mpu.shaft=cyl(.12,.12,.7,0xd8e0e8,12,{metalness:.7});
  mpu.shaft.rotation.z=Math.PI/2;mpu.shaft.position.set(-1.05,1.2,-1.8);scene.add(mpu.shaft);
  /* AVR / eksitasi */
  mpu.avr=box(.5,.7,.3,0x2b3a4a);mpu.avr.position.set(2.0,1.0,-1.8);scene.add(mpu.avr);
  actMesh(mpu.avr,'EKS');
  scene.add(label('AVR/EKSITASI',.6,'#5fd4ff').translateX(2.0).translateY(1.6).translateZ(-1.8));
  /* panel synchroscope + breaker + governor */
  const panel=box(2.6,2.2,.3,0x2b3845);panel.position.set(5.2,1.6,-2.6);scene.add(panel);
  panel.add(label('PANEL SINKRON',.8).translateY(1.4));
  mpu.D=makeDisplay(1.1,1.1,260,260);
  mpu.D.mesh.position.set(4.7,1.9,-2.43);scene.add(mpu.D.mesh);
  mpu.brk=box(.34,.5,.16,0x18242f);mpu.brk.position.set(5.9,1.9,-2.42);scene.add(mpu.brk);
  actMesh(mpu.brk,'SYNC');
  scene.add(label('BREAKER GEN',.5,'#5fd4ff').translateX(5.9).translateY(2.28).translateZ(-2.4));
  mpu.gov=box(.34,.2,.16,0xcc8830);mpu.gov.position.set(5.9,1.2,-2.42);scene.add(mpu.gov);
  actMesh(mpu.gov,'GOV');
  scene.add(label('GOVERNOR',.5,'#5fd4ff').translateX(5.9).translateY(.95).translateZ(-2.4));
  mpu.stat=makeDisplay(1.5,.4,360,96);
  mpu.stat.mesh.position.set(5.2,.55,-2.42);scene.add(mpu.stat.mesh);
  dispText(mpu.stat,['0 RPM · 0 kV · OFFLINE'],['#7d8f84']);

  mpu.rpm=0;mpu.eks=false;mpu.ang=Math.PI;mpu.sync=false;mpu.mw=0;mpu.started=false;
  function drawScope(){
    const g=mpu.D.g,cx=130,cy=130,r=100;
    g.fillStyle='#0c141d';g.fillRect(0,0,260,260);
    g.strokeStyle='#2a3a4c';g.lineWidth=10;
    g.beginPath();g.arc(cx,cy,r,0,Math.PI*2);g.stroke();
    g.fillStyle='#46ff8e';g.beginPath();g.arc(cx,cy-r,9,0,Math.PI*2);g.fill();
    g.fillStyle='#8aa3bd';g.font='600 16px Consolas';g.textAlign='center';
    g.fillText('SYNCHROSCOPE',cx,250);
    if(mpu.eks&&!mpu.sync){
      g.strokeStyle='#ffd23f';g.lineWidth=6;
      g.beginPath();g.moveTo(cx,cy);
      g.lineTo(cx+ (r-14)*Math.sin(mpu.ang), cy-(r-14)*Math.cos(mpu.ang));g.stroke();}
    if(mpu.sync){g.fillStyle='#46ff8e';g.font='700 26px Consolas';g.fillText('SINKRON ✓',cx,cy+8);}
    mpu.D.tex.needsUpdate=true;}
  drawScope();
  moduleTick=(dt)=>{
    if(mpu.started&&mpu.rpm<3000)mpu.rpm=Math.min(3000,mpu.rpm+dt*900);
    if(mpu.started)mpu.shaft.rotation.x+=dt*mpu.rpm*.004;
    if(mpu.eks&&!mpu.sync)mpu.ang+=dt*1.1;
    if(mpu.sync&&mpu.mw<5)mpu.mwShow=true;
    drawScope();
    dispText(mpu.stat,[Math.round(mpu.rpm)+' RPM · '+(mpu.eks?'11 kV':'0 kV')+' · '+(mpu.sync?mpu.mw.toFixed(1)+' MW':'OFFLINE')],
      [mpu.sync?'#46ff8e':'#ffd23f']);};

  startSeq([
   {type:'act',aid:'OIL',done:false,targets:()=>[mpu.oil],
    desc:'Cek sistem PELUMAS turbin (klik tangki lube oil).',
    why:'Bearing turbin mengambang di lapisan film oli setipis rambut. Tanpa tekanan pelumas: logam bertemu logam pada 3000 RPM — kerusakan dalam hitungan detik.',
    fx(){toast('🛢️ Tekanan & suhu pelumas normal ✓','ok',2200);}},
   {type:'act',aid:'START',done:false,targets:()=>[mpu.turb],
    desc:'START turbin — naikkan putaran ke 3000 RPM (klik turbin).',
    why:'3000 RPM = 50 Hz pada generator 2 kutub. Putaran adalah frekuensi; menjaga RPM = menjaga detak jantung sistem.',
    fx(){mpu.started=true;beep(70,1.2,'sawtooth',.06);
      toast('🌀 Turbin berakselerasi menuju 3000 RPM...','ok',2600);}},
   {type:'act',aid:'EKS',done:false,targets:()=>[mpu.avr],
    desc:'Aktifkan EKSITASI — bangkitkan tegangan 11 kV (klik AVR).',
    why:'Arus DC di rotor menciptakan medan magnet; stator memotongnya menjadi tegangan. AVR menjaga 11 kV stabil. Lihat: jarum synchroscope mulai berputar!',
    fx(){mpu.eks=true;
      toast('⚡ Tegangan 11 kV — synchroscope hidup. Amati jarumnya!','ok',2800);}},
   {type:'act',aid:'SYNC',done:false,targets:()=>[mpu.brk],
    check:()=>Math.cos(mpu.ang)>0.93,
    checkFail:'DI LUAR FASE! Tutup breaker HANYA saat jarum tepat di posisi 12 (atas).',
    desc:'Momen kebenaran: klik BREAKER tepat saat jarum di posisi 12!',
    why:'Posisi 12 = sudut fase generator & jaringan berhimpit. Menutup di luar itu = dua sistem "bertabrakan": arus kejut & torsi yang bisa memuntir poros. Sabar... dan tepat.',
    fx(){mpu.sync=true;mpu.mw=0;
      toast('🎯 BREAKER TERTUTUP — generator paralel ke jaringan!','ok',2800);sfx.big();}},
   {type:'act',aid:'GOV',done:false,targets:()=>[mpu.gov],
    desc:'Naikkan beban via GOVERNOR ke 5 MW (klik governor).',
    why:'Setelah sinkron, generator "mengikuti" jaringan. Governor menambah uap → menambah MW yang disumbangkan unit ke sistem. Naikkan bertahap, jangan dihentak.',
    fx(){mpu.mw=5;
      toast('📈 Beban naik bertahap — unit 2 menyumbang 5 MW.','ok',2600);}},
  ],()=>{say('🎉 <b>Unit 2 kembali ke sistem!</b> Kamu baru melewati ritual paling menegangkan di pembangkit — sinkronisasi — dengan timing sempurna.');
    setTimeout(()=>showWin('pltu'),2200);});

  say('VOLTA di sini 🌱 Selamat datang di control room. Hari ini ujian timing terbesar seorang operator: <b>sinkronisasi generator</b>. Kuncinya satu kalimat: <b>breaker hanya ditutup saat jarum synchroscope tepat di posisi 12</b>. Kita mulai dari pelumas.');
  $('#modTitle').textContent='J07 — Start-Up & Sinkronisasi Generator';
  $('#taskHead').textContent='MENUJU PARALEL SISTEM';}

/* =====================================================================
   MISI 25 — KONTROL FREKUENSI (Jalur 07 · Misi 2)
   ===================================================================== */
let mgv={};
function buildGov(){
  freshScene(0x32404e,0x0c1218); /* malam */
  cam={theta:0,phi:1.2,r:7.5,target:new THREE.Vector3(0,1.8,-1)};
  const floor=boxT(16,.1,10,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(14,4.2,.2,TEX.metal(),{metalness:.25});wall.position.set(0,2.1,-3.2);scene.add(wall);
  /* layar frekuensi besar */
  const frame=boxT(2.8,1.8,.16,TEX.metal(),{metalness:.4});frame.position.set(-2.4,2.5,-3.1);scene.add(frame);
  frame.add(label('FREKUENSI SISTEM',.8).translateY(1.15));
  mgv.F=makeDisplay(2.5,1.5,420,260);
  mgv.F.mesh.position.set(-2.4,2.5,-3.0);scene.add(mgv.F.mesh);
  actMesh(mgv.F.mesh,'FREQ');
  /* panel governor & AVR */
  mgv.gv=box(.5,.34,.2,0xcc8830);mgv.gv.position.set(.6,2.2,-3.05);scene.add(mgv.gv);
  actMesh(mgv.gv,'GOV');
  scene.add(label('GOVERNOR ▲',.6,'#5fd4ff').translateX(.6).translateY(2.6).translateZ(-3.0));
  mgv.avr=box(.5,.34,.2,0x2b3a4a);mgv.avr.position.set(1.6,2.2,-3.05);scene.add(mgv.avr);
  actMesh(mgv.avr,'AVR');
  scene.add(label('AVR',.6,'#5fd4ff').translateX(1.6).translateY(2.6).translateZ(-3.0));
  /* layar MW & tegangan */
  mgv.M=makeDisplay(1.6,.6,360,140);
  mgv.M.mesh.position.set(1.1,1.45,-3.0);scene.add(mgv.M.mesh);
  /* logsheet */
  mgv.logb=box(.5,.66,.05,0xe8e4d8);mgv.logb.position.set(3.4,1.8,-3.08);scene.add(mgv.logb);
  actMesh(mgv.logb,'LOG');
  scene.add(label('LOGSHEET',.55,'#5fd4ff').translateX(3.4).translateY(2.35).translateZ(-3.0));
  /* turbin di latar */
  const turb=cyl(.55,.7,2.2,0x9aa7b4);turb.rotation.z=Math.PI/2;turb.position.set(-4.8,1.0,-.6);scene.add(turb);
  scene.add(label('UNIT 2 · ONLINE',.7).translateX(-4.8).translateY(1.9).translateZ(-.6));

  mgv.f=49.80;mgv.mw=56;mgv.kv=11.0;mgv.raise=false;mgv.avrOk=false;
  function drawF(){
    dispText(mgv.F,[mgv.f.toFixed(2)+' Hz',mgv.f>=49.99?'NORMAL ✓':'⚠ DI BAWAH NOMINAL'],
      [mgv.f>=49.99?'#46ff8e':'#ff5a5a',mgv.f>=49.99?'#46ff8e':'#ffd23f']);
    dispText(mgv.M,[mgv.mw.toFixed(1)+' MW · '+mgv.kv.toFixed(1)+' kV'],
      [mgv.avrOk?'#46ff8e':'#eaf2fb']);}
  drawF();
  moduleTick=(dt)=>{
    if(mgv.raise&&mgv.f<50.0){mgv.f=Math.min(50.0,mgv.f+dt*.022);
      mgv.mw=Math.min(62,mgv.mw+dt*.7);
      if(!mgv.avrOk)mgv.kv=Math.max(10.7,mgv.kv-dt*.03);
      drawF();}};

  startSeq([
   {type:'act',aid:'FREQ',done:false,targets:()=>[mgv.F.mesh],
    desc:'Amati LAYAR FREKUENSI: konfirmasi kondisi & perintah dispatcher.',
    why:'49,80 Hz: seluruh sistem kekurangan pembangkitan. Dispatcher: "Unit 2, naikkan pembebanan 6 MW." Operator tak menebak — ia mengonfirmasi angka & perintah sebelum menyentuh apapun.',
    fx(){toast('📻 "Unit 2, naikkan 6 MW — frekuensi sistem 49,80." SIAP LAKSANAKAN.','info',3000);
      mgv.F.mesh.userData.aid='STAB';}},
   {type:'act',aid:'GOV',done:false,targets:()=>[mgv.gv],
    desc:'Naikkan setpoint GOVERNOR bertahap (klik panel governor).',
    why:'Governor membuka katup uap → turbin menyumbang MW lebih → frekuensi sistem merangkak naik. Bertahap sesuai ramp rate: logam turbin butuh waktu memuai merata.',
    fx(){mgv.raise=true;beep(140,.5,'sine',.07);
      toast('🎚️ Setpoint +6 MW — uap bertambah, perhatikan frekuensi naik…','ok',2800);}},
   {type:'act',aid:'AVR',done:false,targets:()=>[mgv.avr],
    desc:'Beban naik menyeret tegangan — jaga 11 kV via AVR.',
    why:'Saat MW naik, kebutuhan eksitasi ikut berubah. AVR menambah arus medan agar tegangan terminal tetap 11 kV. MW dan MVAr dijaga dua kenop berbeda — keduanya tanggung jawabmu.',
    fx(){mgv.avrOk=true;mgv.kv=11.0;drawF();
      toast('⚡ Eksitasi disesuaikan — tegangan kembali 11,0 kV.','ok',2600);}},
   {type:'act',aid:'STAB',done:false,targets:()=>[mgv.F.mesh],
    check:()=>mgv.f>=49.99,
    checkFail:'Frekuensi belum pulih! Tunggu jarum mencapai 50,00 Hz sebelum melapor stabil.',
    desc:'Saat layar menunjukkan 50,00 Hz: klik layar untuk verifikasi STABIL.',
    why:'Verifikasi bukan formalitas: melapor "normal" saat masih 49,9 = data palsu bagi dispatcher yang sedang menyeimbangkan se-pulau Jawa.',
    fx(){toast('🎯 50,00 Hz — sistem kembali setimbang. Unit 2: 62 MW.','ok',2800);sfx.big();}},
   {type:'act',aid:'LOG',done:false,targets:()=>[mgv.logb],
    desc:'Tutup dengan LOGSHEET: catat kronologi & lapor dispatcher.',
    why:'Jam, perintah, respon, parameter akhir — logsheet adalah memori pembangkit. Saat audit atau gangguan berikutnya, catatan inilah yang bicara.',
    fx(){toast('📓 Logsheet terisi — "Unit 2 stabil 62 MW, frekuensi 50,00."','ok',2800);}},
  ],()=>{say('🎉 <b>Respon sempurna!</b> Frekuensi adalah detak jantung sistem — dan malam ini kamu yang menjaganya tetap 50,00. Dispatcher mencatat namamu dengan senyum.');
    setTimeout(()=>showWin('gov'),2200);});

  say('VOLTA di sini 🎚️ Malam-malam frekuensi merosot ke <b>49,80 Hz</b> — sistem kekurangan daya dan dispatcher memanggil unitmu. Ingat: governor = MW, AVR = tegangan. Mulai dari layar frekuensi.');
  $('#modTitle').textContent='J07·M2 — Kontrol Frekuensi & Pembebanan';
  $('#taskHead').textContent='JAGA DETAK 50 Hz';}

MISSIONS.pltu.build=buildPLTU;
MISSIONS.gov.build=buildGov;

Object.assign(REAL,{
 pltu:[
  'Sinkronisasi nyata memakai auto-synchronizer + sync-check relay (ANSI 25); manual hanya backup terlatih',
  'Syarat paralel diperiksa eksplisit: selisih tegangan, slip frekuensi kecil, urutan fasa benar',
  'First sync setelah overhaul disaksikan komisioning engineer & direkam parameternya',
  'Ikuti SOP vendor turbin & P&ID unit — tiap pembangkit punya urutan start-up spesifik'],
 gov:[
  'Operasi unit nyata mengikuti SOP pabrikan & instruksi dispatcher (komunikasi terekam, read-back)',
  'Perhatikan ramp rate MW sesuai batas thermal stress turbin — bukan kecepatan tanganmu',
  'Pahami mode kontrol unit: droop, isochronous, atau AGC remote dari pusat pengatur',
  'Latih skenario gangguan frekuensi di simulator unit sebelum menghadapi yang sungguhan'],
});

/* =====================================================================
   MISI 3 — SHUTDOWN TERENCANA & TURNING GEAR
   ===================================================================== */
Object.assign(MISSIONS,{
 shutdown:{lvl:'JALUR 07 · PEMBANGKITAN · MISI 3',icon:'🌙',title:'Shutdown Terencana & Turning Gear',strict:true,
  loc:'📍 PLTU unit 2 · Jadwal inspeksi tahunan, 22:00',
  story:'Setelah setahun beroperasi, unit 2 dijadwalkan inspeksi tahunan. Menghidupkan unit kamu sudah bisa — kini seni yang sebaliknya: MEMATIKANNYA dengan benar. Turbin ratusan ton yang panas tidak boleh sekadar dimatikan: poros yang berhenti dalam keadaan panas akan melengkung oleh beratnya sendiri.',
  goal:'Unit berhenti dengan selamat: beban diturunkan bertahap, breaker dibuka tanpa beban, uap ditutup, dan turning gear menjaga poros tetap lurus.',
  obj:['Izin dispatcher & turunkan beban bertahap ke nol','Buka breaker generator hanya saat beban mendekati nol','Tutup uap & aktifkan turning gear untuk pendinginan'],
  learn:['Urutan shutdown = kebalikan start-up: beban dulu turun, breaker kemudian, uap terakhir','Membuka breaker saat masih berbeban = unit tiba-tiba kehilangan lawan → overspeed berbahaya','Poros panas yang diam melengkung oleh beratnya sendiri (shaft bow) — turning gear memutarnya pelan berjam-jam','Pendinginan turbin diatur gradien suhunya: logam tebal yang didinginkan terburu-buru akan retak'],
  next:['Pelajari jenis shutdown: normal, forced, emergency trip — dan bedanya','Dalami prosedur cooldown boiler & perawatan saat unit standby','Eksplorasi start-up panas vs dingin (hot/warm/cold start)']},
});
let msd={};
function buildShutdown(){
  freshScene(0x1d2a3a,0x0a121c); /* malam */
  cam={theta:-.1,phi:1.18,r:9,target:new THREE.Vector3(0,1.8,-.8)};
  const floor=boxT(20,.1,12,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(18,4.6,.2,TEX.metal(),{metalness:.25});wall.position.set(0,2.3,-3.6);scene.add(wall);
  /* turbin-generator */
  msd.turb=cyl(.7,.9,2.6,0x9aa7b4);msd.turb.rotation.z=Math.PI/2;
  msd.turb.position.set(-3.2,1.2,-1.6);scene.add(msd.turb);
  scene.add(label('TURBIN UAP',.8).translateX(-3.2).translateY(2.4).translateZ(-1.6));
  const gen=cyl(.8,.8,1.8,0x5a7a9a);gen.rotation.z=Math.PI/2;gen.position.set(-.2,1.2,-1.6);scene.add(gen);
  scene.add(label('GENERATOR',.75).translateX(-.2).translateY(2.4).translateZ(-1.6));
  msd.shaft=cyl(.12,.12,.7,0xd8e0e8,12,{metalness:.7});
  msd.shaft.rotation.z=Math.PI/2;msd.shaft.position.set(-1.65,1.2,-1.6);scene.add(msd.shaft);
  /* turning gear motor kecil */
  msd.tg=box(.5,.4,.4,0xcc8830);msd.tg.position.set(-1.65,.4,-1.0);scene.add(msd.tg);
  actMesh(msd.tg,'TG');
  scene.add(label('TURNING GEAR',.6,'#5fd4ff').translateX(-1.65).translateY(.1).translateZ(-.8));
  /* katup uap */
  msd.valve=cyl(.22,.22,.3,0xd83a3a);msd.valve.position.set(-5.2,2.2,-1.6);scene.add(msd.valve);
  const pipa=cyl(.18,.18,2.2,0x8a96a2);pipa.rotation.z=.5;pipa.position.set(-5.6,1.4,-1.6);scene.add(pipa);
  actMesh(msd.valve,'STEAM');
  scene.add(label('MAIN STEAM VALVE',.6,'#5fd4ff').translateX(-5.2).translateY(2.7).translateZ(-1.6));
  /* panel kontrol */
  const panel=boxT(2.6,2.2,.3,TEX.metal(),{metalness:.4});panel.position.set(4.2,1.6,-2.8);scene.add(panel);
  panel.add(label('PANEL KONTROL UNIT',.8).translateY(1.4));
  msd.D=makeDisplay(1.7,.8,380,180);
  msd.D.mesh.position.set(3.7,2.0,-2.63);scene.add(msd.D.mesh);
  actMesh(msd.D.mesh,'IZIN');
  msd.gov=box(.34,.2,.16,0xcc8830);msd.gov.position.set(5.1,2.2,-2.62);scene.add(msd.gov);
  actMesh(msd.gov,'GOV');
  scene.add(label('GOVERNOR ▼',.5,'#5fd4ff').translateX(5.1).translateY(2.5).translateZ(-2.6));
  msd.brk=box(.34,.5,.16,0x18242f);msd.brk.position.set(5.1,1.4,-2.62);scene.add(msd.brk);
  actMesh(msd.brk,'BRK');
  scene.add(label('BREAKER GEN',.5,'#5fd4ff').translateX(5.1).translateY(1.05).translateZ(-2.6));
  msd.mw=62;msd.rpm=3000;msd.unload=false;msd.open=false;msd.steamOff=false;msd.tgOn=false;
  function tampil(){dispText(msd.D,[msd.mw.toFixed(1)+' MW · '+Math.round(msd.rpm)+' RPM',
    msd.tgOn?'TURNING GEAR · 3 RPM':(msd.open?'BREAKER TERBUKA':'ONLINE')],
    [msd.mw>1?'#ffd23f':'#46ff8e',msd.tgOn?'#46ff8e':'#8aa3bd']);}
  tampil();
  moduleTick=(dt)=>{
    if(msd.unload&&msd.mw>0){msd.mw=Math.max(0,msd.mw-dt*4.5);tampil();}
    if(msd.steamOff&&msd.rpm>3&&!msd.tgOn){msd.rpm=Math.max(3,msd.rpm-dt*420);tampil();}
    if(msd.rpm>5)msd.shaft.rotation.x+=dt*msd.rpm*.004;
    else if(msd.tgOn)msd.shaft.rotation.x+=dt*.35;};
  startSeq([
   {type:'act',aid:'IZIN',done:false,targets:()=>[msd.D.mesh],
    desc:'Lapor dispatcher: izin melepas unit dari sistem (klik layar).',
    why:'62 MW yang akan hilang harus digantikan unit lain — dispatcher mengatur penggantinya dulu. Unit yang pamit tanpa izin membuat frekuensi sistem terjun: dosa besar dunia pembangkitan.',
    fx(){toast('📻 "Unit 2 izin shutdown terjadwal — beban pengganti SIAP."','ok',2800);}},
   {type:'act',aid:'GOV',done:false,targets:()=>[msd.gov],
    desc:'Turunkan beban BERTAHAP via governor (klik governor).',
    why:'Dari 62 MW merosot landai sesuai ramp rate — logam turbin melepas panas secara merata. Beban diturunkan, tapi putaran tetap 3000 RPM: generator masih menggenggam jaringan.',
    fx(){msd.unload=true;
      toast('📉 Unloading... amati MW merosot perlahan ke nol.','ok',2600);}},
   {type:'act',aid:'BRK',done:false,targets:()=>[msd.brk],
    check:()=>msd.mw<=1.5,
    checkFail:'Masih berbeban! Membuka breaker sekarang = unit kehilangan lawan mendadak → overspeed. Tunggu MW mendekati nol.',
    desc:'Saat MW ≈ 0: buka BREAKER generator (klik breaker).',
    why:'Tanpa beban, membuka breaker hanyalah perpisahan damai: generator lepas dari jaringan tanpa hentakan. Synchroscope yang dulu menyatukan, malam ini diam menyaksikan perpisahan.',
    fx(){msd.open=true;tampil();
      toast('🔌 Breaker TERBUKA — unit resmi berpisah dari sistem.','ok',2600);}},
   {type:'act',aid:'STEAM',done:false,targets:()=>[msd.valve],
    desc:'Tutup MAIN STEAM VALVE — biarkan turbin coast down.',
    why:'Uap berhenti mendorong; turbin melambat oleh gesekannya sendiri dari 3000 RPM menuju nol — proses berjam-jam yang tidak boleh dipercepat. Dengarkan: dengung yang memudar itu suara logam beristirahat.',
    fx(){msd.steamOff=true;beep(220,1.2,'sine',.06);
      toast('🌫️ Uap tertutup — coast down dimulai, RPM merosot.','ok',2600);}},
   {type:'act',aid:'TG',done:false,targets:()=>[msd.tg],
    check:()=>msd.rpm<=10,
    checkFail:'Putaran masih tinggi! Turning gear hanya boleh masuk saat poros hampir berhenti (lihat RPM).',
    desc:'Saat putaran hampir nol: aktifkan TURNING GEAR (klik motor oranye).',
    why:'Inilah penjaga malam: motor kecil memutar poros ratusan ton dengan 3 RPM selama berjam-jam, agar logam panas mendingin MERATA. Tanpanya, poros melengkung oleh beratnya sendiri — dan start berikutnya berakhir dengan getaran maut.',
    fx(){msd.tgOn=true;msd.rpm=3;tampil();
      toast('🌙 Turning gear AKTIF — poros berputar 3 RPM hingga dingin.','ok',3000);sfx.big();}},
  ],()=>{say('🎉 <b>Unit tertidur dengan benar!</b> Beban turun landai, breaker terbuka tanpa beban, dan turning gear berjaga semalaman. Inspeksi tahunan menanti — dan poros yang lurus sempurna.');
    setTimeout(()=>showWin('shutdown'),2200);});
  say('VOLTA di sini 🌙 Kamu sudah bisa membangunkan unit — kini belajar <b>menidurkannya</b>. Urutannya kebalikan start-up, dan ada penjaga terakhir bernama turning gear. Satu pantangan: <b>breaker tak pernah dibuka saat berbeban</b>.');
  $('#modTitle').textContent='J07·M3 — Shutdown & Turning Gear';
  $('#taskHead').textContent='UNLOAD → BREAKER → UAP → TG';}
MISSIONS.shutdown.build=buildShutdown;
Object.assign(REAL,{
 shutdown:[
  'Ikuti kurva cooldown pabrikan: gradien suhu logam dipantau, bukan dikira-kira',
  'Turning gear berjalan berjam-jam (bahkan lebih dari sehari) — jangan dihentikan sebelum suhu logam aman',
  'Eccentricity & getaran poros dipantau saat coast down — anomali dicatat untuk inspeksi',
  'Sistem pelumas TETAP beroperasi selama turning gear — bearing tanpa oli rusak walau 3 RPM'],
});

/* =====================================================================
   MISI 4 — BLACK START: MENGHIDUPKAN SISTEM DARI NOL
   ===================================================================== */
Object.assign(MISSIONS,{
 blackstart:{lvl:'JALUR 07 · PEMBANGKITAN · MISI 4',icon:'🌑',title:'Black Start: Menghidupkan Sistem dari Nol',strict:true,
  loc:'📍 PLTU unit 2 · Blackout regional, 03:30',
  story:'Mimpi buruk sistem tenaga menjadi nyata: blackout regional — jaringan mati total, dan PLTU-mu ikut gelap karena pemakaian sendirinya bergantung pada jaringan yang kini tiada. Tapi unitmu ditunjuk sebagai BLACK START UNIT: di halaman belakang ada genset diesel besar yang bisa hidup tanpa bantuan siapa pun. Dari percikan kecil itulah, satu provinsi akan menyala kembali.',
  goal:'Unit hidup kembali dari nol: genset black start → pemakaian sendiri → boiler & turbin → generator membangun tegangan → siap memberi tegangan ke jaringan mati.',
  obj:['Hidupkan genset black start (sumber mandiri)','Energize pemakaian sendiri & start auxiliary kritis','Bangun uap, putar turbin, bangkitkan tegangan ke jaringan'],
  learn:['Pembangkit besar tak bisa menghidupkan dirinya: pompa & fan raksasanya butuh listrik — telur-ayam yang dipecahkan genset black start','Urutan pemakaian sendiri ada prioritasnya: pelumas & kontrol dulu, lalu pompa air umpan, fan, baru sisanya — kapasitas genset terbatas','Energize jaringan mati = soft energize: tegangan dibangun bertahap, beban dipanggil sedikit demi sedikit agar genset muda tak tumbang lagi','Black start dilatih rutin lewat drill — saat blackout nyata bukan waktunya membaca manual'],
  next:['Pelajari skema pemulihan sistem: jalur black start regional','Dalami cold-load pickup: beban mati menarik arus lebih besar saat dinyalakan','Eksplorasi grid-forming inverter: black start era baterai']},
});
let mbk={};
function buildBlackstart(){
  freshScene(0x0e131c,0x05080d); /* gelap total */
  cam={theta:-.1,phi:1.18,r:9.5,target:new THREE.Vector3(0,1.8,-.8)};
  const floor=boxT(20,.1,12,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  /* genset black start */
  mbk.gen=boxT(1.8,1.2,1.0,TEX.metal(),{metalness:.3});mbk.gen.position.set(-6.4,.65,-1.6);scene.add(mbk.gen);
  actMesh(mbk.gen,'GENSET');
  scene.add(label('GENSET BLACK START 2 MW',.7,'#5fd4ff').translateX(-6.4).translateY(1.6).translateZ(-1.6));
  /* panel pemakaian sendiri */
  const aux=boxT(1.4,2.0,.4,TEX.metal(),{metalness:.35});aux.position.set(-3.6,1.0,-2.4);scene.add(aux);
  aux.add(label('PANEL PS (pemakaian sendiri)',.6).translateY(1.3));
  mbk.psb=box(.3,.4,.14,0x18242f);mbk.psb.position.set(-3.6,1.2,-2.18);scene.add(mbk.psb);
  actMesh(mbk.psb,'PS');
  mbk.lampPS=new THREE.Mesh(new THREE.SphereGeometry(.06,12,10),
    new THREE.MeshStandardMaterial({color:0x553322,emissive:0x000000}));
  mbk.lampPS.position.set(-3.6,1.75,-2.16);scene.add(mbk.lampPS);
  /* boiler + turbin + generator */
  mbk.blr=boxT(2.0,2.4,1.6,TEX.metal(),{metalness:.2});mbk.blr.position.set(-.8,1.2,-2.0);scene.add(mbk.blr);
  actMesh(mbk.blr,'BOILER');
  scene.add(label('BOILER',.7).translateX(-.8).translateY(2.7).translateZ(-2.0));
  mbk.turb=cyl(.6,.75,2.2,0x9aa7b4);mbk.turb.rotation.z=Math.PI/2;
  mbk.turb.position.set(2.2,1.1,-2.0);scene.add(mbk.turb);
  actMesh(mbk.turb,'TURBIN');
  scene.add(label('TURBIN-GEN',.7).translateX(2.2).translateY(2.2).translateZ(-2.0));
  /* layar status + breaker jaringan */
  mbk.D=makeDisplay(1.9,1.0,400,220);
  mbk.D.mesh.position.set(5.2,2.1,-2.4);scene.add(mbk.D.mesh);
  dispText(mbk.D,['BLACKOUT','semua hitam…'],['#ff5a5a','#7d8f84']);
  const pole=cyl(.04,.04,1.5,0x666666);pole.position.set(5.2,.75,-2.4);scene.add(pole);
  mbk.brk=box(.4,.55,.16,0x18242f);mbk.brk.position.set(5.2,1.0,-2.36);scene.add(mbk.brk);
  actMesh(mbk.brk,'GRID');
  scene.add(label('BREAKER KE JARINGAN',.55,'#5fd4ff').translateX(5.2).translateY(.6).translateZ(-2.3));
  mbk.rpm=0;mbk.steam=false;mbk.spin=false;
  moduleTick=(dt)=>{
    if(mbk.spin&&mbk.rpm<3000){mbk.rpm=Math.min(3000,mbk.rpm+dt*700);
      dispText(mbk.D,[Math.round(mbk.rpm)+' RPM',mbk.rpm>=3000?'siap eksitasi':'rolling…'],
        ['#ffd23f',mbk.rpm>=3000?'#46ff8e':'#8aa3bd']);}};
  startSeq([
   {type:'act',aid:'GENSET',done:false,targets:()=>[mbk.gen],
    desc:'Hidupkan GENSET BLACK START — satu-satunya yang bisa hidup sendiri.',
    why:'Mesin diesel dengan baterai start sendiri: tak butuh jaringan, tak butuh siapa pun. 2 MW kedengaran kecil untuk PLTU 100 MW — tapi cukup untuk membangunkan organ vitalnya. Setiap kebangkitan besar berawal dari percikan kecil.',
    fx(){beep(70,1.2,'sawtooth',.08);
      toast('🔦 Genset MENYALA — satu titik terang di tengah blackout.','ok',2800);}},
   {type:'act',aid:'PS',done:false,targets:()=>[mbk.psb],
    desc:'Energize PEMAKAIAN SENDIRI — hidupkan auxiliary sesuai prioritas.',
    why:'2 MW dibagi dengan disiplin: pelumas & DC kontrol dulu (nyawa), pompa air umpan & FD fan kemudian (pernafasan), penerangan secukupnya. Melebihi kapasitas genset = blackout kedua yang lebih memalukan.',
    fx(){mbk.lampPS.material.color.setHex(0x2ee87a);mbk.lampPS.material.emissive.setHex(0x2ee87a);
      mbk.lampPS.material.emissiveIntensity=1;
      toast('💡 PS hidup: pelumas ✓ kontrol ✓ feedwater ✓ fan ✓','ok',2800);}},
   {type:'act',aid:'BOILER',done:false,targets:()=>[mbk.blr],
    desc:'Nyalakan BOILER — bangun tekanan uap perlahan.',
    why:'Burner menyala dari bahan bakar cadangan, drum mulai mendesis. Tak bisa diburu-buru: logam tebal boiler menuntut kurva pemanasan — memaksanya cepat hari ini berarti merawat retakan bertahun-tahun.',
    fx(){mbk.steam=true;
      toast('🔥 Boiler menyala — tekanan merangkak menuju nominal.','ok',2800);}},
   {type:'act',aid:'TURBIN',done:false,targets:()=>[mbk.turb],
    desc:'Alirkan uap: ROLL TURBIN menuju 3000 RPM.',
    why:'Uap perdana mendorong sudu — turbin bangun dari tidur panjangnya melalui kecepatan kritis yang dilewati tanpa berhenti (resonansi tak suka ditunggangi). Menuju 3000: detak jantung 50 Hz yang akan ditawarkan pada provinsi yang gelap.',
    fx(){mbk.spin=true;
      toast('🌀 Turbin rolling… pantau RPM di layar.','ok',2600);}},
   {type:'act',aid:'GRID',done:false,targets:()=>[mbk.brk],
    check:()=>mbk.rpm>=3000,
    checkFail:'Belum 3000 RPM! Generator harus di kecepatan nominal sebelum membangkitkan tegangan ke jaringan.',
    desc:'Di 3000 RPM: eksitasi ON & TUTUP breaker — beri tegangan ke jaringan mati.',
    why:'Tak ada sinkronisasi kali ini — jaringannya MATI: generatormu satu-satunya nada di keheningan. Tegangan dibangun, breaker menutup ke jalur transmisi kosong, lalu dispatcher memanggil beban kota sedikit demi sedikit. Dari genset 2 MW, provinsi menyala kembali.',
    fx(){dispText(mbk.D,['150 kV SIAP','jalur pemulihan AKTIF'],['#46ff8e','#46ff8e']);
      toast('🌅 TEGANGAN MENGALIR — pemulihan sistem dimulai dari unitmu!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Dari gelap gulita menjadi pemberi cahaya!</b> Genset kecil membangunkan raksasa, raksasa membangunkan provinsi. Black start: prosedur paling jarang dipakai, paling menentukan saat dipakai.');
    setTimeout(()=>showWin('blackstart'),2200);});
  say('VOLTA di sini, dan dunia sedang gelap 🌑 <b>Blackout total</b> — dan unitmu adalah black start unit. Pecahkan paradoks telur-ayam: pembangkit butuh listrik untuk membuat listrik. Jawabannya menunggu di halaman belakang.');
  $('#modTitle').textContent='J07·M4 — Black Start';
  $('#taskHead').textContent='DARI NOL MENJADI 150 kV';}
MISSIONS.blackstart.build=buildBlackstart;
Object.assign(REAL,{
 blackstart:[
  'Unit black start diuji berkala (drill nyata sampai PS hidup dari genset) — kontrak ancillary menuntutnya',
  'Bahan bakar genset & cadangan boiler dijaga levelnya: blackout tidak memberi tahu jadwalnya',
  'Koordinasi pemulihan dipimpin pusat pengatur: jalur energize & urutan beban sudah tertulis di skema',
  'Baterai DC station diuji kapasitasnya — kontrol & proteksi hidup dari DC saat semuanya mati'],
});

/* =====================================================================
   MISI 5 — UNIT TRIP: RESPON & INVESTIGASI
   ===================================================================== */
Object.assign(MISSIONS,{
 unittrip:{lvl:'JALUR 07 · PEMBANGKITAN · MISI 5',icon:'🚨',title:'Unit Trip: Respon & Investigasi',strict:true,
  loc:'📍 PLTU unit 2 · 14:47, alarm membanjir',
  story:'Tanpa peringatan: BUMM — breaker generator terbuka sendiri, turbin trip, dan layar alarm menjadi pohon natal. Unit 2 lepas 62 MW dari sistem dalam sekejap. Dua tugas menantimu dengan urutan yang tak boleh terbalik: AMANKAN dulu unitnya, INVESTIGASI kemudian. Operator panik memencet; operator terlatih membaca.',
  goal:'Unit aman pasca-trip (auxiliary terjaga, turning gear masuk), akar penyebab ditemukan dari first-out alarm, dan unit kembali start dengan izin.',
  obj:['Verifikasi kondisi aman pasca-trip: auxiliary & turbin','Baca first-out alarm: mana penyebab, mana akibat','Temukan akar, perbaiki, dan restart dengan izin'],
  learn:['Pasca-trip prioritasnya MENGAMANKAN: pelumas jalan?, turbin coast down normal?, boiler aman? — investigasi menunggu, kerusakan lanjutan tidak','First-out alarm adalah saksi kunci: dari 47 alarm yang membanjir, sistem mencatat siapa yang berteriak PERTAMA — sisanya hanyalah efek domino','Trip oleh proteksi adalah proteksi yang BEKERJA: jangan pernah di-bypass agar bisa start — temukan kenapa ia bekerja','Restart pasca-trip butuh izin & checklist: akar dipahami, proteksi di-reset benar, dispatcher mengetahui'],
  next:['Pelajari trip logic diagram unit: pohon penyebab trip turbin-generator','Dalami analisis data historian (DCS) untuk investigasi presisi','Susun SOP komunikasi darurat unit trip ke dispatcher & manajemen']},
});
let mut={};
function buildUnitTrip(){
  freshScene(0x2a1d1d,0x0c0a0a);
  cam={theta:0,phi:1.16,r:8.5,target:new THREE.Vector3(0,1.9,-1)};
  const floor=boxT(18,.1,11,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(16,4.6,.2,TEX.metal(),{metalness:.2});wall.position.set(0,2.3,-3.4);scene.add(wall);
  /* layar alarm membanjir */
  const frame=boxT(4.6,2.6,.16,TEX.metal(),{metalness:.4});frame.position.set(-2.2,2.5,-3.3);scene.add(frame);
  frame.add(label('ALARM SUMMARY — 47 AKTIF',.85,'#ff8d8d').translateY(1.6));
  mut.D=makeDisplay(4.3,2.3,580,330);
  mut.D.mesh.position.set(-2.2,2.5,-3.2);scene.add(mut.D.mesh);
  actMesh(mut.D.mesh,'FIRSTOUT');
  function alarmScr(mode){
    const g=mut.D.g,W=580,H=330;
    g.fillStyle='#180c0c';g.fillRect(0,0,W,H);
    g.font='600 15px Consolas';g.textAlign='left';
    const rows=mode===0?
     [['14:47:02.114','GEN BREAKER OPEN','#ff5a5a'],['14:47:02.108','TURBINE TRIP','#ff5a5a'],
      ['14:47:02.095','LOW VACUUM TRIP','#ff5a5a'],['14:47:01.870','VACUUM LOW ALARM','#ffd23f'],
      ['14:46:58.220','CW PUMP-A TRIP ◄ FIRST OUT','#ff8d3a'],['14:47:02.300','FW FLOW LOW','#ffd23f'],
      ['14:47:02.410','DRUM LEVEL HIGH','#ffd23f'],['...42 alarm lain (akibat)','','#7d8f84']]:
     [['AKAR: CW PUMP-A TRIP 14:46:58','','#ff8d3a'],['→ vakum kondensor merosot 4 detik','','#ffd23f'],
      ['→ LOW VACUUM TRIP turbin (proteksi benar)','','#ffd23f'],['→ generator ikut lepas (sequence normal)','','#8aa3bd'],
      ['CW-B gagal AUTO-START: selector di MANUAL','','#ff5a5a'],['(ditinggal posisi salah usai pemeliharaan)','','#ff5a5a']];
    rows.forEach((r,i)=>{g.fillStyle=r[2];g.fillText(r[0],14,34+i*36);
      if(r[1])g.fillText(r[1],300,34+i*36);});
    mut.D.tex.needsUpdate=true;}
  alarmScr(0);
  /* panel auxiliary */
  mut.aux=makeDisplay(1.7,1.0,380,220);
  mut.aux.mesh.position.set(2.0,2.4,-3.25);scene.add(mut.aux.mesh);
  dispText(mut.aux,['AUX STATUS','cek sekarang!'],['#ffd23f','#7d8f84']);
  actMesh(mut.aux.mesh,'AMANKAN');
  scene.add(label('PANEL AUXILIARY',.65,'#5fd4ff').translateX(2.0).translateY(3.15).translateZ(-3.2));
  /* selector CW pump */
  mut.sel=box(.4,.4,.18,0x2b3a4a);mut.sel.position.set(4.6,2.0,-3.25);scene.add(mut.sel);
  actMesh(mut.sel,'FIX');
  scene.add(label('SELECTOR CW PUMP-B',.55,'#5fd4ff').translateX(4.6).translateY(2.5).translateZ(-3.2));
  /* tombol start + logsheet */
  mut.btn=cyl(.1,.1,.09,0x2ec06a);mut.btn.rotation.x=Math.PI/2;
  mut.btn.position.set(4.6,1.2,-3.22);scene.add(mut.btn);
  actMesh(mut.btn,'RESTART');
  scene.add(label('RESTART SEQ',.5,'#7af0a8').translateX(4.6).translateY(.9).translateZ(-3.2));
  startSeq([
   {type:'act',aid:'AMANKAN',done:false,targets:()=>[mut.aux.mesh],
    desc:'JANGAN sentuh alarm dulu — AMANKAN unit: cek auxiliary (klik panel aux).',
    why:'Refleks pertama yang benar: pelumas turbin JALAN (bearing selamat), turning gear standby menunggu coast down, boiler masuk tekanan aman, pemakaian sendiri pindah ke suplai cadangan. Unit yang trip itu kecelakaan; unit trip yang rusak karena diabaikan itu kelalaian.',
    fx(){dispText(mut.aux,['LUBE ✓ TG ✓ PS ✓','unit AMAN terkendali'],['#46ff8e','#46ff8e']);
      toast('🛡️ Auxiliary terjaga — unit aman, sekarang boleh berpikir.','ok',3000);}},
   {type:'act',aid:'FIRSTOUT',done:false,targets:()=>[mut.D.mesh],
    desc:'Kini investigasi: cari FIRST-OUT di banjir alarm (klik layar).',
    why:'47 alarm, tapi cap waktu tak berbohong: paling awal 14:46:58 — CW PUMP-A TRIP, empat detik SEBELUM turbin lepas. Pompa pendingin kondensor mati → vakum runtuh → proteksi low vacuum membanting turbin. 46 alarm lainnya hanyalah gema. Saksi kunci ditemukan.',
    fx(){toast('🔍 FIRST-OUT: CW Pump-A trip — 4 detik sebelum turbin!','bad',3000);}},
   {type:'act',aid:'AKAR',done:false,targets:()=>[mut.D.mesh],
    desc:'Satu lapis lagi: kenapa pompa CADANGAN tidak menyelamatkan?',
    why:'CW-B seharusnya auto-start menggantikan — tapi diam. Penelusuran: selector-nya tertinggal di posisi MANUAL sejak pemeliharaan minggu lalu. Akar sejati bukan pompa A yang trip (overload sesaat, bisa terjadi) — tapi CADANGAN yang dilumpuhkan oleh satu selector terlupakan.',
    fx(){alarmScr(1);
      toast('🎯 AKAR: selector CW-B di MANUAL — cadangan tak bisa menolong.','bad',3200);}},
   {type:'act',aid:'FIX',done:false,targets:()=>[mut.sel],
    desc:'Perbaiki: kembalikan SELECTOR ke AUTO + tutup celah prosedurnya.',
    why:'Selector diputar ke AUTO, CW-B diuji start — sehat. Tapi perbaikan sejati di prosedur: checklist pasca-pemeliharaan kini wajib memverifikasi SEMUA selector kembali AUTO, ditandatangani dua orang. Satu klik hari ini, satu aturan untuk selamanya.',
    fx(){toast('🔧 Selector AUTO ✓ uji start ✓ + checklist baru terbit.','ok',3000);}},
   {type:'act',aid:'RESTART',done:false,targets:()=>[mut.btn],
    desc:'Akar tuntas: minta izin & RESTART unit (klik tombol).',
    why:'Laporan ke dispatcher: akar ditemukan & dikoreksi, proteksi TIDAK di-bypass, unit siap. Izin turun — start-up sequence yang kamu kuasai dari misi-misi lalu berjalan: 6 jam kemudian unit 2 kembali memikul 62 MW. Trip yang dipahami akarnya tak akan mengetuk dua kali.',
    fx(){toast('🌅 Unit 2 SINKRON kembali — trip ditutup dengan pelajaran.','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Trip ditangani seperti profesional!</b> Amankan dulu, baca first-out, gali sampai selector yang terlupa, perbaiki prosedurnya — baru restart. 47 alarm hanya bising; kamu menemukan satu yang bernyanyi duluan.');
    setTimeout(()=>showWin('unittrip'),2200);});
  const s1=seq.steps[1],of1=s1.fx;s1.fx=()=>{of1();mut.D.mesh.userData.aid='AKAR';};
  say('VOLTA di sini, dan sirine masih meraung 🚨 <b>Unit trip — 47 alarm membanjir!</b> Hukum pertama: amankan unit SEBELUM menganalisis. Hukum kedua: dari semua alarm, hanya FIRST-OUT yang bercerita jujur. Bergerak!');
  $('#modTitle').textContent='J07·M5 — Unit Trip & Investigasi';
  $('#taskHead').textContent='AMANKAN · FIRST-OUT · AKAR';}
MISSIONS.unittrip.build=buildUnitTrip;
Object.assign(REAL,{
 unittrip:[
  'Data historian (DCS) di-freeze & diekspor segera — bukti detik-detik kejadian jangan tertimpa',
  'Investigasi formal melibatkan operator shift, har & engineer — bukan mencari kambing hitam tapi celah sistem',
  'Proteksi yang bekerja TIDAK pernah di-bypass demi kejar start — itu garis merah industri pembangkitan',
  'Tindak lanjut prosedural (checklist, label selector) diverifikasi audit berikutnya — kertas harus jadi budaya'],
});

/* =====================================================================
   MISI 6 — KIMIA AIR BOILER: MUSUH TAK KASAT MATA
   ===================================================================== */
Object.assign(MISSIONS,{
 kimia:{lvl:'JALUR 07 · PEMBANGKITAN · MISI 6',icon:'🧪',title:'Kimia Air: Musuh Tak Kasat Mata',strict:false,
  loc:'📍 PLTU unit 2 · Laboratorium kimia, shift pagi',
  story:'Turbin & boiler yang kamu rawat lewat misi-misi sebelumnya punya musuh yang tak pernah tidur: AIR-nya sendiri. Silika menyelinap menjadi kerak di sudu turbin, oksigen menggigiti pipa dari dalam, pH yang melenceng melarutkan logam pelan-pelan. Hari ini kamu petugas kimia: penjaga yang perangnya dimenangkan dalam satuan ppb — part per billion.',
  goal:'Parameter kimia air terjaga: sampling benar, anomali oksigen terdeteksi & akarnya ditemukan, dosing dikoreksi, dan blowdown diatur seimbang.',
  obj:['Sampling & analisis parameter kunci','Diagnosa anomali DO tinggi sampai akarnya','Koreksi dosing & atur continuous blowdown'],
  learn:['Air boiler tekanan tinggi dituntut kemurnian ekstrem: silika ppb-level — di tekanan tinggi silika MENGUAP bersama uap & mengerak di sudu turbin','Dissolved oxygen (DO) adalah penggigit pipa: deaerator membuang mayoritas, oxygen scavenger menghabisi sisanya — DO naik = ada yang bocor di rantai itu','pH dijaga sedikit basa (AVT): terlalu rendah melarutkan besi, terlalu tinggi menyerang tembaga — keseimbangan, bukan maksimum','Blowdown adalah pajak kemurnian: membuang air pekat menjaga TDS, tapi tiap liter buangan membawa energi — diatur, bukan dimaksimalkan'],
  next:['Pelajari rezim kimia AVT vs OT untuk boiler bertekanan tinggi','Dalami analisis kerak & deposit (turbine deposit analysis)','Eksplorasi online chemistry monitoring & alarm otomatis']},
});
let mkm={};
function buildKimia(){
  freshScene(0x8aa0b8,0x10181f);
  cam={theta:.05,phi:1.17,r:8,target:new THREE.Vector3(0,1.6,-.8)};
  const Z=room(0x55606a,0xc4cdd6,16,11);
  /* panel sampling (deretan keran) */
  const rack=boxT(2.6,1.8,.3,TEX.metal(),{metalness:.4});rack.position.set(-4.2,1.3,Z-.02);scene.add(rack);
  rack.add(label('SAMPLE PANEL',.75).translateY(1.2));
  mkm.keran=[];
  [['FW','-5.0'],['DRUM','-4.2'],['UAP','-3.4']].forEach((o,i)=>{
    const k=cyl(.05,.05,.18,0xd83a3a);k.rotation.x=Math.PI/2;
    k.position.set(parseFloat(o[1]),1.3,Z+.18);scene.add(k);mkm.keran.push(k);
    scene.add(label(o[0],.42).translateX(parseFloat(o[1])).translateY(1.0).translateZ(Z+.14));});
  actMesh(mkm.keran[0],'SAMPEL');
  /* meja lab + alat */
  const tbl=boxT(2.4,.08,.9,TEX.wood());tbl.position.set(-.6,.95,-.6);scene.add(tbl);
  [[-1,.3],[1,.3],[-1,-.3],[1,-.3]].forEach(o=>{
    const l=boxT(.08,.95,.08,TEX.wood());l.position.set(-.6+o[0],.47,-.6+o[1]*.8);scene.add(l);});
  mkm.alat=box(.4,.3,.3,0xe8edf2);mkm.alat.position.set(-.6,1.15,-.6);scene.add(mkm.alat);
  actMesh(mkm.alat,'ANALISA');
  scene.add(label('FOTOMETER + DO METER',.6,'#5fd4ff').translateX(-.6).translateY(1.55).translateZ(-.6));
  /* layar hasil */
  mkm.D=makeDisplay(2.6,1.5,480,290);
  mkm.D.mesh.position.set(2.6,2.4,Z+.1);scene.add(mkm.D.mesh);
  actMesh(mkm.D.mesh,'DIAG');
  scene.add(label('LOG KIMIA AIR',.75,'#5fd4ff').translateX(2.6).translateY(3.35).translateZ(Z+.1));
  function hasil(mode){
    const g=mkm.D.g,W=480,H=290;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='600 16px Consolas';g.textAlign='left';
    const rows=[['pH','9,1','9,0-9,6','#46ff8e'],['Silika','12 ppb','<20','#46ff8e'],
      ['DO','28 ppb','<7','#ff5a5a'],['Konduktivitas','x','batas','#46ff8e']];
    g.fillStyle='#5fd4ff';g.font='700 18px Consolas';
    g.fillText('FEEDWATER — 08:00',16,32);
    g.font='600 16px Consolas';
    rows.forEach((r,i)=>{const y=72+i*38;
      g.fillStyle='#8aa3bd';g.fillText(r[0],16,y);
      g.fillStyle=r[3];g.fillText(r[1],170,y);
      g.fillStyle='#5d748c';g.fillText('('+r[2]+')',300,y);});
    if(mode>=1){g.fillStyle='#ffd23f';g.font='700 15px Consolas';
      g.fillText('DO 4x batas → telusur: deaerator? dosing? bocor?',16,H-46);}
    if(mode>=2){g.fillStyle='#46ff8e';
      g.fillText('AKAR: pompa dosing scavenger kehabisan — DO pulih 5 ppb',16,H-18);}
    mkm.D.tex.needsUpdate=true;}
  hasil(0);
  /* pompa dosing + blowdown valve */
  mkm.dos=box(.5,.6,.4,0x2a5a8a);mkm.dos.position.set(5.4,.35,-1.6);scene.add(mkm.dos);
  actMesh(mkm.dos,'DOSING');
  scene.add(label('POMPA DOSING SCAVENGER',.6,'#5fd4ff').translateX(5.4).translateY(1.0).translateZ(-1.6));
  mkm.bd=cyl(.08,.08,.3,0xcc8830);mkm.bd.rotation.z=Math.PI/2;
  mkm.bd.position.set(5.4,1.8,-1.6);scene.add(mkm.bd);
  actMesh(mkm.bd,'BLOWDOWN');
  scene.add(label('CONTINUOUS BLOWDOWN',.55,'#5fd4ff').translateX(5.4).translateY(2.2).translateZ(-1.6));
  startSeq([
   {type:'act',aid:'SAMPEL',done:false,targets:()=>[mkm.keran[0]],
    desc:'Ambil SAMPEL rutin tiga titik: feedwater, drum, uap (klik keran).',
    why:'Ritual pagi yang menjaga aset miliaran: alirkan dulu sampai segar (air mati di pipa sampling berbohong), suhu sampel dikondisikan, botol khusus per parameter. Sampling buruk membuat lab menebak — dan boiler tak punya waktu untuk tebakan.',
    fx(){toast('🧴 3 titik tersampling segar — menuju meja analisa.','ok',2800);}},
   {type:'act',aid:'ANALISA',done:false,targets:()=>[mkm.alat],
    desc:'ANALISIS parameter kunci di lab (klik alat).',
    why:'pH 9,1 ✓, silika 12 ppb ✓, konduktivitas ✓... tapi dissolved oxygen 28 ppb — EMPAT KALI batas. Di tekanan tinggi, oksigen sebanyak itu adalah ribuan gigitan kecil di dinding pipa tiap jam. Angka kecil, musuh besar.',
    fx(){hasil(1);toast('🧪 DO 28 ppb (batas <7) — pitting corrosion mengintai!','bad',3000);}},
   {type:'act',aid:'DIAG',done:false,targets:()=>[mkm.D.mesh],
    desc:'TELUSUR akarnya: deaerator, dosing, atau kebocoran? (klik log)',
    why:'Deaerator: tekanan & venting normal — bukan dia. Seal pompa kondensat: tak ada tanda vakum bocor. Tangki oxygen scavenger... nyaris KERING, dan pompa dosingnya menghisap udara sejak semalam. Akar ketemu: bukan sistem yang rusak, logistik kimia yang lengah.',
    fx(){toast('🔍 Tangki scavenger kering — dosing macet sejak semalam!','bad',3000);}},
   {type:'act',aid:'DOSING',done:false,targets:()=>[mkm.dos],
    desc:'KOREKSI: isi tangki, priming pompa, kalibrasi laju dosing (klik pompa).',
    why:'Tangki diisi, pompa di-priming sampai bebas udara, laju dikalibrasi ulang terhadap aliran feedwater. Dua jam kemudian DO merosot ke 5 ppb ✓. Plus satu perbaikan sistemik: alarm level rendah tangki kimia — kelengahan yang sama tak boleh dapat kesempatan kedua.',
    fx(){hasil(2);toast('💉 Dosing pulih — DO 28 → 5 ppb + alarm level dipasang.','ok',3000);}},
   {type:'act',aid:'BLOWDOWN',done:false,targets:()=>[mkm.bd],
    desc:'Tutup ronde: atur CONTINUOUS BLOWDOWN seimbang (klik valve).',
    why:'TDS drum merayap naik mendekati batas — blowdown dinaikkan dari 1,2% ke 1,8%: cukup menjaga kemurnian, tak berlebihan membuang energi (tiap liter blowdown membawa panas yang sudah dibayar). Kimia air selalu soal keseimbangan, tak pernah soal maksimum.',
    fx(){toast('🌊 Blowdown 1,8% — TDS terjaga, energi tak terbuang sia-sia.','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Perang ppb dimenangkan hari ini!</b> Oksigen tertangkap di angka 28, akar ditemukan di tangki kering, dan keseimbangan blowdown dijaga. Boiler & turbin menua pelan — karena petugas kimianya tak pernah lengah.');
    setTimeout(()=>showWin('kimia'),2200);});
  say('VOLTA di sini 🧪 Musuh hari ini tak terlihat dan terlarut: <b>oksigen, silika, pH</b>. Perangnya dimenangkan dalam part-per-billion. Ambil botol sampelmu — boiler menunggu diagnosa paginya.');
  $('#modTitle').textContent='J07·M6 — Kimia Air Boiler';
  $('#taskHead').textContent='PERANG DALAM SATUAN PPB';}
MISSIONS.kimia.build=buildKimia;
Object.assign(REAL,{
 kimia:[
  'Ikuti batas kimia sesuai tekanan boiler & rezim (AVT/OT) dari pabrikan dan standar pembangkit',
  'Kalibrasi alat analisa & verifikasi silang dengan lab eksternal berkala',
  'Tren-kan parameter di log digital — kimia air adalah permainan tren, bukan snapshot',
  'Kelola stok & alarm level bahan kimia — kerusakan jutaan dolar bisa berawal dari tangki kosong'],
});

/* =====================================================================
   MISI 7 — KONDENSOR & VAKUM: PEMBUNUH EFISIENSI SENYAP
   ===================================================================== */
Object.assign(MISSIONS,{
 kondensor:{lvl:'JALUR 07 · PEMBANGKITAN · MISI 7',icon:'🌬️',title:'Kondensor & Vakum: Pembunuh Efisiensi Senyap',strict:false,
  loc:'📍 PLTU unit 2 · Heat rate naik misterius',
  story:'Laporan bulanan mengganjal: heat rate unit naik 2,3% — bahan bakar lebih banyak untuk MW yang sama, miliaran rupiah setahun. Boiler sehat, turbin halus... tersangka tersisa bersembunyi di ruang paling sunyi: KONDENSOR. Vakumnya memburuk pelan — dan setiap milibar vakum yang hilang adalah uap yang pulang bekerja setengah hati.',
  goal:'Akar penurunan vakum terdiagnosis sistematis (air masuk? tube kotor? ejector?), dikoreksi, dan heat rate kembali — dengan angka rupiah yang bisa dilaporkan.',
  obj:['Baca penurunan vakum & dampak heat rate','Diagnosa sistematis: kebocoran udara vs fouling','Koreksi & verifikasi pemulihan kinerja'],
  learn:['Vakum kondensor menentukan "punggung" turbin: makin dalam vakum, makin besar energi yang bisa diperas dari uap — vakum buruk = uap pensiun dini','Dua musuh utama vakum: UDARA bocor masuk (gland, sambungan) yang menyelimuti tube, dan FOULING tube (lumut/kerak air pendingin) yang menghalangi perpindahan panas','Diagnosanya elegan: udara bocor → ejector kewalahan & subcooling naik; fouling → TTD (terminal temperature difference) membesar — dua sidik jari yang berbeda','Helium leak test menemukan bocor udara seperti hidung anjing pelacak: semprot helium di luar, detektor mengendus di ejector'],
  next:['Pelajari kurva koreksi heat rate vs tekanan kondensor','Dalami online tube cleaning (sistem bola sponge)','Eksplorasi monitoring TTD & subcooling sebagai KPI harian']},
});
let mkd={};
function buildKondensor(){
  freshScene(0x8aa0b8,0x10181f);
  cam={theta:.05,phi:1.17,r:8.5,target:new THREE.Vector3(0,1.6,-.8)};
  const Z=room(0x55606a,0xc4cdd6,16,11);
  /* kondensor besar di bawah "turbin" */
  const turb=cyl(.5,.6,1.8,0x9aa7b4);turb.rotation.z=Math.PI/2;turb.position.set(-2.6,2.6,-1.8);scene.add(turb);
  scene.add(label('TURBIN (exhaust ke bawah)',.6).translateX(-2.6).translateY(3.4).translateZ(-1.8));
  mkd.kond=boxT(2.8,1.4,1.3,TEX.metal(),{metalness:.3});mkd.kond.position.set(-2.6,1.0,-1.8);scene.add(mkd.kond);
  actMesh(mkd.kond,'BACA');
  scene.add(label('KONDENSOR',.75).translateX(-2.6).translateY(.2).translateZ(-1.1));
  /* layar kinerja */
  mkd.D=makeDisplay(2.4,1.4,460,270);
  mkd.D.mesh.position.set(1.2,2.4,Z+.1);scene.add(mkd.D.mesh);
  actMesh(mkd.D.mesh,'DIAG');
  scene.add(label('KINERJA VAKUM',.75,'#5fd4ff').translateX(1.2).translateY(3.3).translateZ(Z+.1));
  function layar(mode){
    const g=mkd.D.g,W=460,H=270;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='600 16px Consolas';g.textAlign='left';
    if(mode===0){g.fillStyle='#ff5a5a';g.font='700 19px Consolas';
      g.fillText('vakum: 92 → 86 kPa (3 bulan)',16,44);
      g.fillStyle='#ffd23f';g.font='600 15px Consolas';
      g.fillText('heat rate +2,3% ≈ Rp 2,1 M/tahun',16,80);
      g.fillStyle='#8aa3bd';
      g.fillText('TTD: 8,4°C (desain 4) ⚠',16,124);
      g.fillText('subcooling: 1,1°C (normal)',16,156);
      g.fillText('ejector load: normal',16,188);}
    else{g.fillStyle='#46ff8e';g.font='700 19px Consolas';
      g.fillText('vakum pulih: 91,6 kPa ✓',16,44);
      g.font='600 15px Consolas';
      g.fillText('TTD: 4,3°C ✓ · heat rate −2,1%',16,80);
      g.fillText('pemulihan ≈ Rp 1,9 M/tahun',16,116);}
    mkd.D.tex.needsUpdate=true;}
  layar(0);
  /* helium kit + tube cleaner */
  mkd.he=cyl(.14,.14,.5,0xd8b020);mkd.he.position.set(3.6,.95,-.6);scene.add(mkd.he);
  actMesh(mkd.he,'HELIUM');
  const tbl=boxT(1.4,.07,.7,TEX.wood());tbl.position.set(3.9,.82,-.6);scene.add(tbl);
  const tleg=boxT(.08,.82,.08,TEX.wood());tleg.position.set(3.9,.41,-.6);scene.add(tleg);
  scene.add(label('HELIUM LEAK KIT',.55,'#5fd4ff').translateX(3.5).translateY(1.35).translateZ(-.6));
  mkd.bola=new THREE.Mesh(new THREE.SphereGeometry(.12,12,10),
    new THREE.MeshStandardMaterial({color:0x46a06a,roughness:.8}));
  mkd.bola.position.set(4.3,.95,-.6);scene.add(mkd.bola);
  actMesh(mkd.bola,'BERSIH');
  scene.add(label('SPONGE BALL CLEANING',.55,'#5fd4ff').translateX(4.5).translateY(1.3).translateZ(-.4));
  startSeq([
   {type:'act',aid:'BACA',done:false,targets:()=>[mkd.kond],
    desc:'Baca gejala: vakum memburuk & berapa harganya (klik kondensor).',
    why:'Vakum merosot 92→86 kPa dalam tiga bulan — turbin kehilangan "tarikan punggung"-nya: heat rate naik 2,3% ≈ Rp 2,1 miliar setahun terbakar diam-diam. Pembunuh efisiensi paling senyap di pembangkit selalu bersembunyi di tempat yang paling tak bergerak.',
    fx(){toast('📉 Vakum −6 kPa = Rp 2,1 M/thn menguap senyap.','bad',3000);}},
   {type:'act',aid:'DIAG',done:false,targets:()=>[mkd.D.mesh],
    desc:'Diagnosa sidik jari: udara bocor atau tube kotor? (klik layar)',
    why:'Baca tiga saksi: subcooling normal & ejector santai (bukan udara bocor) — tapi TTD membengkak 8,4°C dari desain 4°C: panas tertahan tak bisa menyeberang dinding tube. Vonis: FOULING — air pendingin musim ini membawa lumut & lumpur lebih dari biasanya.',
    fx(){toast('🔍 TTD 8,4°C + ejector normal = fouling tube, bukan bocor.','ok',3000);}},
   {type:'act',aid:'HELIUM',done:false,targets:()=>[mkd.he],
    desc:'Tetap tuntaskan: HELIUM TEST memastikan tak ada bocor ganda (klik kit).',
    why:'Diagnosa baik tak berhenti di tersangka pertama: helium disemprot ke sambungan & gland sementara detektor mengendus di ejector — satu bocor KECIL ketemu di gasket manhole, dicatat untuk dikencangkan. Bukan akar utama, tapi musuh tak diberi tempat bersembunyi.',
    fx(){toast('🎈 1 bocor kecil ketemu (gasket) — dikencangkan sekalian.','ok',2800);}},
   {type:'act',aid:'BERSIH',done:false,targets:()=>[mkd.bola],
    desc:'Eksekusi: ONLINE TUBE CLEANING dengan bola sponge (klik bola).',
    why:'Ribuan bola sponge sedikit lebih besar dari diameter tube disirkulasikan bersama air pendingin: tiap bola menggosok dinding tube dari dalam — UNIT TETAP BEROPERASI. Dua hari sirkulasi + perbaikan klorinasi air masuk: lumut kehilangan rumahnya.',
    fx(){toast('🟢 Bola sponge bersirkulasi — tube digosok tanpa shutdown.','ok',3000);}},
   {type:'act',aid:'VERIF',done:false,targets:()=>[mkd.D.mesh],
    desc:'Verifikasi pemulihan: baca ulang kinerja (klik layar).',
    why:'TTD turun ke 4,3°C, vakum merangkak pulih 91,6 kPa, heat rate kembali −2,1%: Rp 1,9 miliar setahun pulang ke neraca — dan TTD kini resmi jadi KPI harian operator: pembunuh senyap hanya bisa dilawan oleh pengawasan yang tak pernah tidur.',
    fx(){layar(1);toast('✅ Vakum pulih · Rp 1,9 M/thn kembali — TTD jadi KPI harian.','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Pembunuh senyap tertangkap!</b> Sidik jari TTD membedakan kotor dari bocor, helium menuntaskan keraguan, bola sponge menggosok tanpa padam. Efisiensi pembangkit dijaga di tempat yang paling jarang ditengok.');
    setTimeout(()=>showWin('kondensor'),2200);});
  const s1k=seq.steps[1],of1k=s1k.fx;s1k.fx=()=>{of1k();mkd.D.mesh.userData.aid='VERIF';};
  say('VOLTA di sini 🌬️ Heat rate naik misterius — boiler & turbin tak bersalah. Tersangka terakhir bersembunyi di ruang paling sunyi: <b>kondensor</b>. Dua kemungkinan, dua sidik jari berbeda. Mulai membaca gejalanya!');
  $('#modTitle').textContent='J07·M7 — Kondensor & Vakum';
  $('#taskHead').textContent='TTD: SIDIK JARI SANG PEMBUNUH';}
MISSIONS.kondensor.build=buildKondensor;
Object.assign(REAL,{
 kondensor:[
  'Pantau TTD, subcooling & beban ejector sebagai trio harian — diagnosa dini dari pola, bukan krisis',
  'Helium/ultrasonic leak test dilakukan berkala terjadwal, bukan hanya saat vakum sudah jatuh',
  'Kualitas air pendingin (klorinasi, side-stream filter) adalah pertahanan pertama melawan fouling',
  'Hitung dampak rupiah tiap kPa vakum untuk justifikasi investasi perbaikan'],
});

/* =====================================================================
   MISI 8 — CO-FIRING BIOMASSA: BATUBARA BERBAGI TUNGKU
   ===================================================================== */
Object.assign(MISSIONS,{
 cofiring:{lvl:'JALUR 07 · PEMBANGKITAN · MISI 8',icon:'🌿',title:'Co-Firing Biomassa: Batubara Berbagi Tungku',strict:false,
  loc:'📍 PLTU unit 2 · Program co-firing 5% serbuk kayu',
  story:'Mandat transisi tiba di unitmu: co-firing — mencampur biomassa (serbuk kayu) ke batubara, memangkas emisi tanpa membangun pembangkit baru. Terdengar sesederhana mencampur kopi… sampai kamu tahu detailnya: biomassa lebih ringan, lebih basah, kalornya beda, dan abunya bisa LENGKET di dinding boiler. Co-firing yang asal campur merusak boiler; yang berilmu, menyelamatkan target emisi.',
  goal:'Co-firing 5% beroperasi stabil: kualitas biomassa terverifikasi, pencampuran & mill aman, pembakaran ditala ulang, dan dampak (emisi turun, boiler sehat) tervalidasi.',
  obj:['Uji kualitas biomassa: kalor, moisture, kandungan abu','Atur rasio campuran & kewaspadaan mill','Tala ulang pembakaran & pantau slagging'],
  learn:['Co-firing 5% serbuk kayu ≈ memangkas emisi CO₂ fosil 5% TANPA pembangkit baru — biomassa dianggap netral karbon dalam siklusnya','Biomassa bukan batubara muda: moisture tinggi mencuri kalor, dan abunya kaya alkali — di suhu boiler bisa MELELEH & menempel (slagging) di dinding','Mill (penggiling) adalah titik rawan: serbuk kayu lebih mudah terbakar di dalam mill — suhu keluaran mill diturunkan & dipantau ketat','Tiap rasio baru = pembakaran ditala ulang: udara, kehalusan, suhu — boiler tua diajari menu baru pelan-pelan, bukan dipaksa'],
  next:['Pelajari rantai pasok biomassa: kontinuitas adalah tantangan terbesarnya','Dalami uji abu (ash fusion temperature) untuk vonis slagging','Eksplorasi rasio lebih tinggi & torrefied biomass']},
});
let mcf={};
function buildCofiring(){
  freshScene(0x8aa0b8,0x10181f);
  cam={theta:.1,phi:1.16,r:9,target:new THREE.Vector3(0,1.7,-.8)};
  const ground=boxT(20,.1,12,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  /* dua gunungan: batubara & biomassa */
  const coal=new THREE.Mesh(new THREE.ConeGeometry(1.2,1.0,16),
    new THREE.MeshStandardMaterial({color:0x1a1a1c,roughness:.95}));
  coal.position.set(-6.4,.55,-1.6);scene.add(coal);
  scene.add(label('BATUBARA',.65).translateX(-6.4).translateY(1.4).translateZ(-1.6));
  mcf.bio=new THREE.Mesh(new THREE.ConeGeometry(1.0,.85,16),
    new THREE.MeshStandardMaterial({color:0xb8945a,roughness:.95}));
  mcf.bio.position.set(-4.2,.48,-1.6);scene.add(mcf.bio);
  actMesh(mcf.bio,'UJI');
  scene.add(label('SERBUK KAYU (sawdust)',.65,'#ffd23f').translateX(-4.2).translateY(1.3).translateZ(-1.6));
  /* conveyor blending + mill */
  const belt=box(4.5,.2,.9,0x222a31);belt.position.set(-2.6,1.3,-2.6);scene.add(belt);
  mcf.blend=box(.7,.5,.5,0x2a5a8a);mcf.blend.position.set(-2.6,1.9,-2.6);scene.add(mcf.blend);
  actMesh(mcf.blend,'RASIO');
  scene.add(label('BLENDING 5%',.6,'#5fd4ff').translateX(-2.6).translateY(2.5).translateZ(-2.6));
  mcf.mill=cyl(.6,.7,1.2,0x6a7682,18,{metalness:.4});mcf.mill.position.set(-.2,.65,-2.4);scene.add(mcf.mill);
  actMesh(mcf.mill,'MILL');
  scene.add(label('MILL — suhu dijaga!',.65,'#ffd23f').translateX(-.2).translateY(1.6).translateZ(-2.4));
  /* boiler + layar */
  const blr=boxT(2.2,2.8,1.6,TEX.metal(),{metalness:.2});blr.position.set(2.6,1.45,-2.2);scene.add(blr);
  scene.add(label('BOILER',.75).translateX(2.6).translateY(3.1).translateZ(-2.2));
  mcf.D=makeDisplay(1.9,1.1,400,230);
  mcf.D.mesh.position.set(5.6,2.2,-2.2);scene.add(mcf.D.mesh);
  actMesh(mcf.D.mesh,'TALA');
  scene.add(label('PEMBAKARAN & SLAGGING',.7,'#5fd4ff').translateX(5.6).translateY(2.95).translateZ(-2.2));
  function layar(mode){
    dispText(mcf.D,
      mode===0?['CO-FIRING OFF','batubara 100%']:
      mode===1?['BIO 5% ⚠','O2 & suhu perlu tala']:
      ['BIO 5% STABIL ✓','slagging: aman · CO₂ −5%'],
      [mode===2?'#46ff8e':'#ffd23f','#8aa3bd']);}
  layar(0);
  startSeq([
   {type:'act',aid:'UJI',done:false,targets:()=>[mcf.bio],
    desc:'UJI dulu kiriman biomassa: kalor, moisture, abu (klik gunungan).',
    why:'Lab cepat: kalor 16,8 MJ/kg (batubara 21), moisture 28% (agak basah — disepakati pengeringan oleh pemasok jadi <20%), dan UJI ABU: titik leleh abunya 1.190°C — di bawah suhu sebagian dinding boiler: kandidat slagging! Rasio & lokasi pembakar harus memperhitungkan ini. Bahan bakar baru selalu diinterogasi sebelum diberi makan ke boiler tua.',
    fx(){toast('🧪 16,8 MJ/kg · moisture deal <20% · abu leleh 1.190°C ⚠','ok',3400);}},
   {type:'act',aid:'RASIO',done:false,targets:()=>[mcf.blend],
    desc:'Atur BLENDING 5% energi — konsisten, bukan asal tumpah (klik blender).',
    why:'5% berbasis ENERGI (bukan berat — kalor beda!): feeder biomassa terkalibrasi menyuapi conveyor batubara dengan rasio terkunci. Campuran yang berfluktuasi membuat pembakaran bergelombang — boiler menyukai menu yang konsisten lebih dari menu yang enak.',
    fx(){toast('⚖️ 5% energi terkunci di feeder — campuran konsisten.','ok',3000);}},
   {type:'act',aid:'MILL',done:false,targets:()=>[mcf.mill],
    desc:'Kewaspadaan MILL: turunkan suhu keluaran & siagakan inerting (klik mill).',
    why:'Serbuk kayu menyala jauh lebih mudah dari batubara di dalam mill yang panas: suhu keluaran diturunkan 77→62°C, sensor CO dipasang di mill (deteksi bara dini), dan sistem inerting siaga. Co-firing gagal paling sering bukan di boiler — tapi terbakar duluan di penggiling.',
    fx(){toast('🌡️ Mill 62°C + sensor CO + inerting — titik rawan dijaga.','ok',3200);}},
   {type:'act',aid:'TALA',done:false,targets:()=>[mcf.D.mesh],
    desc:'Campuran masuk: TALA ULANG pembakaran (klik layar).',
    why:'Boiler mencicipi menu baru: O₂ ditala ulang (biomassa butuh udara beda), distribusi pembakar disesuaikan agar zona terpanas menjauhi dinding rawan-slagging, soot blower dijadwalkan lebih rapat di minggu-minggu pertama. Flame scanner stabil, steam temperatur terjaga — boiler tua menerima menu barunya.',
    fx(){layar(1);toast('🔥 O2 & burner ditala — pembakaran stabil di menu baru.','ok',3200);}},
   {type:'act',aid:'VALID',done:false,targets:()=>[mcf.D.mesh],
    desc:'Dua minggu beroperasi: VALIDASI dampaknya (klik layar).',
    why:'Inspeksi & data bicara: dinding boiler bersih (strategi anti-slagging bekerja), efisiensi turun hanya 0,3% (tertukar adil), dan emisi CO₂ fosil −5% = ±28.000 ton setahun — setara menanam hutan kecil, dari serbuk kayu yang dulu limbah gergajian. Unit tua, trik baru, planet sedikit lega.',
    fx(){layar(2);toast('🌿 CO₂ fosil −5% (≈28 rb ton/thn) · boiler tetap sehat ✓','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Batubara resmi berbagi tungku!</b> Biomassa diinterogasi dulu, mill dijaga dari baranya sendiri, pembakaran ditala ulang, dan dinding boiler tetap bersih. Transisi energi nyata kadang tak gemerlap — ia berdebu serbuk kayu dan penuh perhitungan.');
    setTimeout(()=>showWin('cofiring'),2200);});
  const s3c=seq.steps[3],of3c=s3c.fx;s3c.fx=()=>{of3c();mcf.D.mesh.userData.aid='VALID';};
  say('VOLTA di sini 🌿 Mandat transisi: <b>co-firing 5% serbuk kayu</b>. Terdengar seperti mencampur kopi — padahal abunya bisa lengket di boiler & serbuknya bisa terbakar di mill. Interogasi dulu bahan barunya!');
  $('#modTitle').textContent='J07·M8 — Co-Firing Biomassa';
  $('#taskHead').textContent='MENU BARU UNTUK BOILER TUA';}
MISSIONS.cofiring.build=buildCofiring;
Object.assign(REAL,{
 cofiring:[
  'Kontrak biomassa memuat spesifikasi (kalor, moisture, abu) + sanksi — kualitas kiriman pasti berfluktuasi',
  'Uji ash fusion temperature tiap sumber biomassa baru — slagging lebih murah dicegah daripada dipahat',
  'Pantau mill (suhu, CO) dgn alarm — riwayat kebakaran mill co-firing di industri itu panjang',
  'Dokumentasikan baseline vs co-firing (efisiensi, emisi) untuk pelaporan program transisi'],
});
