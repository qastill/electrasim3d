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
