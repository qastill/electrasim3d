/* =====================================================================
   ElectraSim VR 3D — BATERAI & BESS
   Misi: M1 bess (Komisioning BESS Peak Shaving) · M2 thermal (Respon Alarm Termal BESS)
   Dimuat on-demand oleh index.html lewat ensureMission().
   ===================================================================== */

Object.assign(MISSIONS,{
 bess:{lvl:'JALUR 15 · BATERAI & BESS',icon:'🔋',title:'Komisioning BESS Peak Shaving',strict:false,
  loc:'📍 Kawasan industri · BESS container 1 MWh',
  story:'Pabrik di kawasan ini membayar mahal beban puncak sore hari. Solusinya berdiri di hadapanmu: kontainer BESS 1 MWh. Tugasmu menyambungkan rack baterai ke PCS dan jaringan, lalu mengaktifkan mode peak shaving — mengisi saat murah, melepas saat mahal.',
  goal:'BESS tersambung benar (DC rack → PCS → trafo → grid), BMS sehat, dan mode peak shaving aktif.',
  obj:['Wiring DC rack ke PCS (jaga polaritas!) + grounding','Verifikasi kesehatan sel via BMS','Energize PCS & aktifkan mode peak shaving'],
  learn:['Arsitektur BESS: sel → modul → rack → DC bus → PCS (inverter dua arah) → trafo → grid','BMS menjaga tiap sel: tegangan, suhu, balancing — penentu umur & keselamatan baterai','PCS dua arah: charging (AC→DC) saat tarif murah, discharging (DC→AC) saat puncak','Peak shaving memangkas biaya beban puncak; use case lain: arbitrase, frekuensi, backup'],
  next:['Pelajari kimia sel: LFP vs NMC (keamanan vs densitas)','Dalami sizing BESS dari profil beban pelanggan','Eksplorasi stacking revenue: peak shaving + regulasi frekuensi']},
 thermal:{lvl:'JALUR 15 · BATERAI & BESS · MISI 2',icon:'🌡️',title:'Respon Alarm Termal BESS',strict:true,
  loc:'📍 Kawasan industri · BESS container, alarm 14:20',
  story:'EMS berbunyi: suhu modul 7 di rack 2 merayap naik — 41°C dan menanjak, justru saat BESS sedang discharge penuh memangkas puncak. Thermal runaway tidak terjadi tiba-tiba; ia selalu mengirim sinyal lebih dulu. Operator yang baik mendengarnya.',
  goal:'Suhu terkendali tanpa drama: alarm dianalisis, pendingin di-boost, daya diturunkan, rack diisolasi pada urutan yang benar.',
  obj:['Analisis alarm di BMS — modul & tren suhu','Boost HVAC & turunkan daya (derate) lebih dulu','Isolasi rack hanya setelah arus turun, lalu catat & lapor'],
  learn:['Thermal runaway punya tangga: panas → venting → api. Intervensi dini = tangga tak pernah dinaiki','Urutan benar: turunkan ARUS dulu (derate), baru buka pemutus rack — memutus DC berbeban penuh = busur api','Satu sel panas memanaskan tetangganya — isolasi dini mencegah penjalaran antar modul','SoC tinggi + suhu tinggi = kombinasi terbahaya; EMS modern auto-derate, operator memverifikasi'],
  next:['Pelajari deteksi off-gas: sinyal paling dini thermal runaway','Dalami desain fire suppression BESS (aerosol, water mist)','Analisis post-mortem data BMS untuk akar penyebab termal']},
});

/* =====================================================================
   MISI 17 — BESS (Jalur 15)
   ===================================================================== */
let mbs={};
function buildBESS(){
  freshScene(0x9fb0c4,0x101822);
  cam={theta:.15,phi:1.18,r:8.5,target:new THREE.Vector3(.5,1.6,-1)};
  const ground=box(20,.1,12,0x434b54);ground.position.y=-.05;scene.add(ground);

  /* container rack */
  const cont=box(3.2,2.4,1.6,0xe8edf2);cont.position.set(-3.6,1.2,-2.0);scene.add(cont);
  const stripe=box(3.22,.4,1.62,0x18b06a);stripe.position.set(-3.6,2.1,-2.0);scene.add(stripe);
  cont.add(label('BESS 1 MWh · RACK LFP',.95).translateY(1.5));
  terminal('RK+','fasa',-2.6,1.4,-1.18);
  terminal('RK-','netral',-2.6,1.0,-1.18);
  terminal('RKG','ground',-2.6,.6,-1.18);
  scene.add(label('DC+',.4,'#ff8d8d').translateX(-2.3).translateY(1.4).translateZ(-1.15));
  scene.add(label('DC−',.4,'#9cc4ff').translateX(-2.3).translateY(1.0).translateZ(-1.15));
  scene.add(label('PE',.4,'#8df0b8').translateX(-2.3).translateY(.6).translateZ(-1.15));
  /* layar BMS */
  mbs.B=makeDisplay(1.1,.7,280,180);
  mbs.B.mesh.position.set(-4.4,1.4,-1.18);scene.add(mbs.B.mesh);
  dispText(mbs.B,['BMS','SoC 62% · 312 sel'],['#5fd4ff','#7d8f84']);
  actMesh(mbs.B.mesh,'BMS');
  scene.add(label('LAYAR BMS',.55,'#5fd4ff').translateX(-4.4).translateY(1.95).translateZ(-1.15));
  /* PCS */
  mbs.pcs=box(1.2,1.7,.8,0x8a96a2);mbs.pcs.position.set(0,0.9,-2.0);scene.add(mbs.pcs);
  mbs.pcs.add(label('PCS 500 kW',.7).translateY(1.15));
  actMesh(mbs.pcs,'PCSON');
  terminal('PCS+','fasa',-.4,1.3,-1.58);
  terminal('PCS-','netral',-.4,.9,-1.58);
  terminal('PCS-AC','fasa',.4,1.1,-1.58);
  scene.add(label('AC',.4).translateX(.42).translateY(.9).translateZ(-1.55));
  terminal('GND','ground',-.4,.45,-1.58);
  /* trafo */
  const trf=box(1.1,1.2,.9,0x6a7a8a);trf.position.set(2.6,.65,-2.0);scene.add(trf);
  [-.3,0,.3].forEach(dx=>{const fin=box(.05,1.0,.95,0x5a6a7a);
    fin.position.set(2.6+dx,.65,-2.0);scene.add(fin);});
  trf.add(label('TRAFO 0,4/20kV',.65).translateY(.85));
  terminal('TRF','fasa',2.2,1.0,-1.5);
  /* tiang grid */
  const pole=cyl(.08,.1,4.6,0x6f7a84);pole.position.set(4.8,2.3,-2.0);scene.add(pole);
  scene.add(label('KE JARINGAN 20kV',.7).translateX(4.8).translateY(4.8).translateZ(-2.0));
  /* layar mode */
  mbs.M=makeDisplay(1.2,.6,300,150);
  mbs.M.mesh.position.set(1.0,2.3,-2.0);scene.add(mbs.M.mesh);
  dispText(mbs.M,['MODE: —','peak shaving OFF'],['#7d8f84','#7d8f84']);
  actMesh(mbs.M.mesh,'MODE');
  scene.add(label('PANEL EMS',.55,'#5fd4ff').translateX(1.0).translateY(2.75).translateZ(-2.0));

  terms={};clickables.forEach(c=>{if(c.userData.kind==='terminal')terms[c.userData.id]=c;});

  startSeq([
   {type:'wire',a:'RK+',b:'PCS+',color:COL.fasa,done:false,
    desc:'Sambungkan DC+ rack ke terminal + PCS.',
    why:'Tegangan rack LFP ±700-900 VDC — kelas tegangan yang menuntut hormat. Polaritas terbalik di sini bukan sekadar rusak: bisa busur api DC besar.',
    wrong:'DC+ (merah) hanya ke terminal + PCS.'},
   {type:'wire',a:'RK-',b:'PCS-',color:COL.netral,done:false,
    desc:'Sambungkan DC− rack ke terminal − PCS.',
    why:'Sebelum mengencangkan: cek polaritas dengan multimeter & pastikan rack breaker OFF — baterai tidak bisa "dimatikan", energinya selalu ada.'},
   {type:'wire',a:'RKG',b:'GND',color:COL.ground,done:false,
    desc:'Grounding: PE rack ke bar pembumian PCS.',
    why:'Sistem monitoring isolasi (IMD) BESS bergantung pada referensi bumi yang baik untuk mendeteksi kebocoran DC sedini mungkin.'},
   {type:'wire',a:'PCS-AC',b:'TRF',color:COL.fasa,done:false,
    desc:'Sisi AC: keluaran PCS ke TRAFO step-up.',
    why:'PCS bekerja di 400 V; trafo menaikkan ke 20 kV jaringan. Rantai lengkap: sel → rack → PCS (DC↔AC dua arah) → trafo → grid.'},
   {type:'act',aid:'BMS',done:false,targets:()=>[mbs.B.mesh],
    desc:'Verifikasi kesehatan baterai via layar BMS.',
    why:'BMS adalah malaikat penjaga: memantau tegangan & suhu tiap sel, menyeimbangkan (balancing), dan memutus bila ada anomali. Satu sel bermasalah bisa menjalar — thermal runaway.',
    fx(){dispText(mbs.B,['SoC 62% ✓','ΔV sel 8mV · 27°C'],['#46ff8e','#eaf2fb']);
      toast('🔋 312 sel sehat — deviasi 8 mV, suhu merata.','ok',2600);}},
   {type:'act',aid:'PCSON',done:false,targets:()=>[mbs.pcs],
    desc:'Energize PCS — sinkron ke jaringan.',
    why:'PCS = inverter dua arah: malam mengisi (AC→DC) saat tarif murah, sore melepas (DC→AC) memangkas puncak. Saat ON, ia sinkron dulu seperti generator mini.',
    fx(){toast('⚡ PCS sinkron — siap charge/discharge.','ok',2400);}},
   {type:'act',aid:'MODE',done:false,targets:()=>[mbs.M.mesh],
    desc:'Aktifkan MODE PEAK SHAVING di panel EMS.',
    why:'EMS membaca profil beban pabrik: setiap beban melewati ambang (mis. 800 kW), BESS melepas daya menahan puncak. Tagihan beban puncak terpangkas — baterai membayar dirinya sendiri.',
    fx(){dispText(mbs.M,['PEAK SHAVING ON','ambang 800 kW ✓'],['#46ff8e','#46ff8e']);
      toast('📉 Mode aktif — puncak sore siap dipangkas!','ok',2800);sfx.big();}},
  ],()=>{say('🎉 <b>BESS beroperasi!</b> 1 MWh energi yang patuh perintah: mengisi saat murah, melepas saat mahal. Selamat datang di era fleksibilitas grid.');
    setTimeout(()=>showWin('bess'),2200);});

  say('VOLTA di sini 🔋 Komisioning BESS 1 MWh. Ingat sifat uniknya: <b>baterai tidak pernah benar-benar mati</b> — energinya selalu ada, jadi polaritas & grounding bukan basa-basi. Mulai dari sisi DC.');
  $('#modTitle').textContent='J15 — Komisioning BESS';
  $('#taskHead').textContent='DC → PCS → GRID → MODE';}

/* =====================================================================
   MISI 32 — ALARM TERMAL BESS (Jalur 15 · Misi 2)
   ===================================================================== */
let mth={};
function buildThermal(){
  freshScene(0x9fb0c4,0x101822);
  cam={theta:.1,phi:1.18,r:8,target:new THREE.Vector3(0,1.6,-1)};
  const ground=boxT(18,.1,11,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  /* container & rack 2 menyala */
  const cont=boxT(3.6,2.4,1.6,TEX.metal(),{metalness:.3});cont.position.set(-2.6,1.2,-2.0);scene.add(cont);
  cont.add(label('BESS 1 MWh',.95).translateY(1.5));
  mth.rack=box(.9,1.8,.1,0x2b3a4a);mth.rack.position.set(-2.2,1.2,-1.14);scene.add(mth.rack);
  mth.hot=new THREE.Mesh(new THREE.SphereGeometry(.08,14,12),
    new THREE.MeshStandardMaterial({color:0xff8030,emissive:0xff8030,emissiveIntensity:1}));
  mth.hot.position.set(-2.2,1.5,-1.05);scene.add(mth.hot);
  scene.add(label('RACK 2 · MODUL 7',.6,'#ff8d8d').translateX(-2.2).translateY(2.3).translateZ(-1.05));
  /* breaker rack */
  mth.brk=box(.2,.3,.12,0xffd23f);mth.brk.position.set(-3.3,1.0,-1.12);scene.add(mth.brk);
  actMesh(mth.brk,'RACK');
  scene.add(label('DC BREAKER RACK 2',.5,'#5fd4ff').translateX(-3.4).translateY(.65).translateZ(-1.05));
  /* layar BMS alarm */
  mth.B=makeDisplay(1.5,.9,340,210);
  mth.B.mesh.position.set(.4,2.0,-2.0);scene.add(mth.B.mesh);
  dispText(mth.B,['⚠ ALARM','R2-M7: 41,2°C ↑'],['#ff5a5a','#ffd23f']);
  actMesh(mth.B.mesh,'BMS');
  scene.add(label('LAYAR BMS / EMS',.65,'#5fd4ff').translateX(.4).translateY(2.65).translateZ(-2.0));
  /* HVAC unit */
  mth.hvac=box(.9,.6,.5,0xe8edf2);mth.hvac.position.set(-2.6,2.75,-2.0);scene.add(mth.hvac);
  actMesh(mth.hvac,'HVAC');
  scene.add(label('HVAC',.55,'#5fd4ff').translateX(-2.6).translateY(3.25).translateZ(-2.0));
  /* PCS */
  mth.pcs=boxT(1.2,1.7,.8,TEX.metal(),{metalness:.3});mth.pcs.position.set(2.6,.9,-2.0);scene.add(mth.pcs);
  mth.pcs.add(label('PCS 500 kW',.7).translateY(1.15));
  actMesh(mth.pcs,'DERATE');
  mth.P=makeDisplay(.9,.4,260,120);
  mth.P.mesh.position.set(2.6,1.45,-1.58);scene.add(mth.P.mesh);
  dispText(mth.P,['DISCHARGE','500 kW'],['#ffd23f','#eaf2fb']);
  /* logsheet */
  mth.logb=box(.5,.66,.05,0xe8e4d8);mth.logb.position.set(4.6,1.5,-2.04);scene.add(mth.logb);
  actMesh(mth.logb,'LOG');
  scene.add(label('LOG & LAPORAN',.55,'#5fd4ff').translateX(4.6).translateY(2.05).translateZ(-2.0));

  mth.t=41.2;mth.cool=false;mth.derated=false;mth.iso=false;
  moduleTick=(dt)=>{
    if(!mth.cool)mth.t+=dt*.12;
    else mth.t=Math.max(29,mth.t-dt*(mth.derated?(mth.iso?1.4:0.9):0.35));
    if(mth.t<35){mth.hot.material.color.setHex(0x36e07a);mth.hot.material.emissive.setHex(0x36e07a);}
    dispText(mth.B,[mth.t<35?'NORMAL ✓':'⚠ ALARM','R2-M7: '+mth.t.toFixed(1)+'°C'+(mth.cool?' ↓':' ↑')],
      [mth.t<35?'#46ff8e':'#ff5a5a',mth.t<35?'#46ff8e':'#ffd23f']);};

  startSeq([
   {type:'act',aid:'BMS',done:false,targets:()=>[mth.B.mesh],
    desc:'Analisis ALARM di layar BMS: modul mana, tren bagaimana.',
    why:'R2-M7: 41,2°C dan menanjak +0,4°C/menit saat discharge penuh. Tetangganya (M6, M8) ikut hangat. Ini bukan sensor error — pola penjalaran panas nyata. Bertindak SEKARANG, sebelum 55°C.',
    fx(){toast('🌡️ R2-M7 41,2°C ↑ · tetangga ikut hangat — tren nyata.','bad',3000);}},
   {type:'act',aid:'HVAC',done:false,targets:()=>[mth.hvac],
    desc:'Langkah tercepat tanpa risiko: BOOST HVAC (klik unit pendingin).',
    why:'Menambah aliran udara dingin = menahan laju kenaikan tanpa menyentuh operasi. Tapi HVAC hanya membantu — sumber panasnya (arus tinggi) masih bekerja. Lanjut.',
    fx(){mth.cool=true;beep(160,.6,'sine',.07);
      toast('❄️ HVAC mode boost — laju panas tertahan.','ok',2600);}},
   {type:'act',aid:'DERATE',done:false,targets:()=>[mth.pcs],
    desc:'Turunkan sumber panasnya: DERATE daya PCS ke 50%.',
    why:'Panas ∝ I²R: memangkas arus setengah = memangkas panas jadi seperempat. Pelanggan kehilangan sebagian peak shaving sore ini — harga kecil dibanding satu rack terbakar.',
    fx(){mth.derated=true;dispText(mth.P,['DISCHARGE','250 kW (derate)'],['#5fd4ff','#5fd4ff']);
      toast('📉 PCS derate 50% — sumber panas dipangkas.','ok',2600);}},
   {type:'act',aid:'RACK',done:false,targets:()=>[mth.brk],
    desc:'Kini arus sudah rendah: ISOLASI rack 2 (buka DC breaker).',
    why:'Urutan ini disengaja: membuka pemutus DC pada arus penuh = busur api — justru memantik bahaya yang ingin dihindari. Setelah derate, rack dilepas dengan tenang untuk inspeksi.',
    fx(){mth.iso=true;mth.brk.rotation.z=.5;
      toast('🔌 Rack 2 terisolasi — 4 rack lain tetap melayani.','ok',2600);}},
   {type:'act',aid:'LOG',done:false,targets:()=>[mth.logb],
    check:()=>mth.t<35,
    checkFail:'Suhu belum aman! Tunggu BMS menunjukkan <35°C sebelum menutup laporan.',
    desc:'Setelah suhu <35°C: catat kronologi & jadwalkan inspeksi modul.',
    why:'Data BMS sebelum-selama-sesudah adalah bahan post-mortem: balancing buruk? koneksi modul kendor? sel menua? Alarm yang dipahami akarnya tak akan kembali dengan kejutan lebih besar.',
    fx(){toast('📓 Kronologi tercatat — inspeksi R2-M7 besok 08:00.','ok',3000);sfx.big();}},
  ],()=>{say('🎉 <b>Krisis yang tidak pernah jadi berita!</b> Dengar alarmnya, dinginkan, pangkas arusnya, isolasi dengan urutan benar. Begitulah thermal runaway dikalahkan: jauh sebelum ia mulai.');
    setTimeout(()=>showWin('thermal'),2200);});

  say('VOLTA di sini 🌡️ Alarm dari container: <b>modul 7 rack 2 memanas</b> saat discharge penuh. Ingat urutan emasnya: <b>dinginkan → pangkas arus → baru isolasi</b>. Memutus DC berbeban penuh justru memantik busur. Mulai dari layar BMS.');
  $('#modTitle').textContent='J15·M2 — Respon Alarm Termal BESS';
  $('#taskHead').textContent='DINGINKAN · DERATE · ISOLASI';}

MISSIONS.bess.build=buildBESS;
MISSIONS.thermal.build=buildThermal;

Object.assign(REAL,{
 bess:[
  'Komisioning mengikuti grid code: uji anti-islanding, ride-through, dan respon frekuensi',
  'Manajemen termal & jarak antar rack sesuai desain — suhu adalah musuh utama umur sel',
  'SOP kebakaran khusus lithium: deteksi off-gas dini, jangan semprot air langsung ke sel, siapkan akses damkar',
  'Kalibrasi SoC berkala & pantau SoH (state of health) — degradasi menentukan ekonomi proyek'],
 thermal:[
  'Ikuti emergency response plan BESS site: ambang suhu, urutan derate/isolasi, kontak damkar',
  'Jangan pernah membuka pintu container saat alarm off-gas aktif — gas sel = mudah terbakar & toksik',
  'Pasang trending otomatis suhu modul di EMS dengan alarm bertingkat (warning/critical)',
  'Post-mortem tiap alarm termal: data BMS dianalisis untuk akar penyebab, bukan sekadar di-reset'],
});

/* =====================================================================
   MISI 3 — CAPACITY TEST & RENCANA AUGMENTASI
   ===================================================================== */
Object.assign(MISSIONS,{
 soh:{lvl:'JALUR 15 · BATERAI & BESS · MISI 3',icon:'📊',title:'Capacity Test & Rencana Augmentasi',strict:false,
  loc:'📍 BESS container 1 MWh · Tes tahunan, tahun ke-3',
  story:'Kontrak peak shaving menjamin 800 kWh usable setiap sore — selamanya? Tidak. Baterai menua seperti kita semua. Tes kapasitas tahunan hari ini menjawab dua pertanyaan yang ditunggu pemilik: berapa sisa kapasitas SEBENARNYA, dan kapan harus menambah rack baru sebelum kontrak terlanggar.',
  goal:'SoH terukur lewat tes kapasitas penuh, tren degradasi terproyeksikan, dan rencana augmentasi tersusun sebelum kontrak terancam.',
  obj:['Tinjau baseline & siapkan kondisi tes standar','Jalankan full charge-discharge test terukur','Hitung SoH, proyeksikan tren, susun rencana augmentasi'],
  learn:['SoH (state of health) = kapasitas terukur hari ini ÷ kapasitas pelat nama — KPI utama aset baterai','Tes kapasitas butuh kondisi standar (arus, suhu, rentang SoC) agar tahun ke tahun bisa dibandingkan apel-ke-apel','Degradasi normal LFP ±2-3%/tahun; tikungan tajam di kurva = ada masalah (suhu? siklus berlebih?)','Augmentasi direncanakan SEBELUM kontrak terlanggar — pengadaan rack butuh berbulan-bulan'],
  next:['Pelajari degradasi kalender vs siklus — dua jam biologis baterai','Dalami augmentasi: rack baru & lama yang SoH-nya beda harus dikelola PCS terpisah','Eksplorasi second-life battery: kemana rack pensiun pergi']},
});
let msh={};
function buildSoH(){
  freshScene(0x9fb0c4,0x101822);
  cam={theta:.1,phi:1.18,r:8,target:new THREE.Vector3(0,1.6,-1)};
  const ground=boxT(18,.1,11,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  const cont=boxT(3.6,2.4,1.6,TEX.metal(),{metalness:.3});cont.position.set(-2.8,1.2,-2.0);scene.add(cont);
  cont.add(label('BESS 1 MWh · TAHUN KE-3',.95).translateY(1.5));
  /* layar EMS riwayat */
  msh.E=makeDisplay(1.5,.9,340,210);
  msh.E.mesh.position.set(-2.8,1.4,-1.18);scene.add(msh.E.mesh);
  dispText(msh.E,['RIWAYAT','baseline 1.000 kWh'],['#5fd4ff','#7d8f84']);
  actMesh(msh.E.mesh,'BASE');
  scene.add(label('EMS — RIWAYAT ASET',.6,'#5fd4ff').translateX(-2.8).translateY(2.05).translateZ(-1.1));
  /* PCS untuk tes */
  msh.pcs=boxT(1.2,1.7,.8,TEX.metal(),{metalness:.3});msh.pcs.position.set(.4,.9,-2.0);scene.add(msh.pcs);
  msh.pcs.add(label('PCS — MODE TES',.7).translateY(1.15));
  actMesh(msh.pcs,'TEST');
  msh.P=makeDisplay(.9,.5,260,140);
  msh.P.mesh.position.set(.4,1.5,-1.58);scene.add(msh.P.mesh);
  dispText(msh.P,['STANDBY','SoC 100% · 25°C'],['#7d8f84','#8aa3bd']);
  /* layar hasil + kurva tren */
  const frame=boxT(2.8,1.8,.16,TEX.metal(),{metalness:.4});frame.position.set(3.8,2.0,-2.9);scene.add(frame);
  frame.add(label('ANALISIS KAPASITAS',.8).translateY(1.15));
  msh.D=makeDisplay(2.5,1.5,460,290);
  msh.D.mesh.position.set(3.8,2.0,-2.8);scene.add(msh.D.mesh);
  actMesh(msh.D.mesh,'HASIL');
  function kurva(mode){
    const g=msh.D.g,W=460,H=290;
    g.fillStyle='#0c141d';g.fillRect(0,0,W,H);
    g.strokeStyle='#2a3a4c';g.lineWidth=2;
    g.beginPath();g.moveTo(56,16);g.lineTo(56,H-40);g.lineTo(W-14,H-40);g.stroke();
    g.font='600 14px Consolas';g.fillStyle='#8aa3bd';g.textAlign='left';
    g.fillText('100%',8,30);g.fillText('80%',16,H-90);
    /* garis kontrak 80% */
    g.strokeStyle='#7a2a2a';g.setLineDash([7,5]);
    g.beginPath();g.moveTo(56,H-100);g.lineTo(W-14,H-100);g.stroke();g.setLineDash([]);
    g.fillStyle='#ff8d8d';g.fillText('batas kontrak 800 kWh',60,H-106);
    const pts=[[0,100],[1,97.4],[2,94.3],[3,91.2]];
    g.strokeStyle='#46ff8e';g.lineWidth=3;g.beginPath();
    pts.forEach((p,i)=>{const x=56+p[0]/7*(W-90),y=H-40-(p[1]-78)/22*(H-70);
      i===0?g.moveTo(x,y):g.lineTo(x,y);
      g.fillStyle='#46ff8e';g.fillRect(x-3,y-3,6,6);});
    g.stroke();
    if(mode>=1){g.strokeStyle='#ffd23f';g.setLineDash([6,6]);g.beginPath();
      for(let t=3;t<=7;t+=.5){const v=91.2-(t-3)*2.9;
        const x=56+t/7*(W-90),y=H-40-(v-78)/22*(H-70);
        t===3?g.moveTo(x,y):g.lineTo(x,y);}
      g.stroke();g.setLineDash([]);
      g.fillStyle='#ffd23f';g.font='700 16px Consolas';
      g.fillText('Proyeksi: sentuh 80% awal thn ke-7',60,34);}
    if(mode>=2){g.fillStyle='#46ff8e';g.font='700 16px Consolas';
      g.fillText('AUGMENTASI +200 kWh → thn ke-5 ✓',60,58);}
    msh.D.tex.needsUpdate=true;}
  kurva(0);
  /* papan rencana */
  msh.plan=box(.6,.7,.05,0xe8e4d8);msh.plan.position.set(6.4,1.6,-2.0);scene.add(msh.plan);
  actMesh(msh.plan,'PLAN');
  scene.add(label('RENCANA AUGMENTASI',.6,'#5fd4ff').translateX(6.4).translateY(2.15).translateZ(-2.0));
  msh.testing=false;msh.kwh=0;
  moduleTick=(dt)=>{if(msh.testing&&msh.kwh<912){msh.kwh=Math.min(912,msh.kwh+dt*260);
    dispText(msh.P,['DISCHARGE C/4',Math.round(msh.kwh)+' kWh terukur'],
      ['#ffd23f',msh.kwh>=912?'#46ff8e':'#8aa3bd']);}};
  startSeq([
   {type:'act',aid:'BASE',done:false,targets:()=>[msh.E.mesh],
    desc:'Tinjau BASELINE & riwayat tes (klik layar EMS).',
    why:'Komisioning: 1.000 kWh. Tahun 1: 974. Tahun 2: 943. Tanpa angka pembanding, tes hari ini hanyalah angka kesepian — tren-lah yang bercerita. Syarat tes juga dicatat: arus C/4, suhu 25°C, rentang SoC penuh.',
    fx(){toast('📚 Baseline 1.000 → 974 → 943 kWh. Kondisi tes: standar sama.','info',3000);}},
   {type:'act',aid:'TEST',done:false,targets:()=>[msh.pcs],
    desc:'Jalankan FULL DISCHARGE TEST terukur (klik PCS).',
    why:'Dari SoC 100%, discharge arus konstan C/4 sampai batas bawah — meter kelas teliti menghitung tiap kWh yang keluar. Suhu dijaga HVAC: tes di suhu berbeda = membandingkan apel dengan rambutan.',
    fx(){msh.testing=true;beep(160,.6,'sine',.07);
      toast('🔋 Discharge dimulai — saksikan kWh terkumpul di layar PCS.','ok',2800);}},
   {type:'act',aid:'HASIL',done:false,targets:()=>[msh.D.mesh],
    check:()=>msh.kwh>=912,
    checkFail:'Tes belum selesai! Tunggu discharge tuntas (layar PCS menunjukkan hasil akhir).',
    desc:'Tes tuntas: hitung SoH & baca tren (klik layar analisis).',
    why:'912 kWh ÷ 1.000 = SoH 91,2%. Empat titik membentuk garis: degradasi konsisten ±2,9%/tahun — sehat untuk LFP yang bekerja tiap hari. Tidak ada tikungan tajam = tidak ada masalah tersembunyi.',
    fx(){kurva(1);
      toast('📐 SoH 91,2% · degradasi 2,9%/thn — proyeksi menyentuh kontrak thn ke-7.','ok',3200);}},
   {type:'act',aid:'PLAN',done:false,targets:()=>[msh.plan],
    desc:'Susun RENCANA AUGMENTASI sebelum kontrak terancam (klik papan).',
    why:'Proyeksi menyentuh batas 800 kWh awal tahun ke-7 — tapi margin operasional menipis lebih dulu. Rencana: tambah rack 200 kWh di tahun ke-5, anggaran masuk RKAP tahun ke-4. Aset dikelola dengan kalender, bukan dengan kepanikan.',
    fx(){kurva(2);
      toast('🗓️ Augmentasi 200 kWh thn ke-5 — kontrak aman, anggaran terjadwal.','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Kesehatan aset terbaca jernih!</b> SoH 91,2%, tren rapi, dan augmentasi sudah punya tanggal sebelum masalah punya nama. Begitulah baterai dikelola: dengan data, bukan firasat.');
    setTimeout(()=>showWin('soh'),2200);});
  say('VOLTA di sini 📊 Tahun ke-3 BESS-mu — saatnya <b>medical check-up baterai</b>. Tes kapasitas penuh, hitung SoH, dan jawab pertanyaan terpenting pemilik: kapan menambah rack? Mulai dari riwayat di EMS.');
  $('#modTitle').textContent='J15·M3 — Capacity Test & SoH';
  $('#taskHead').textContent='UKUR · TREN · RENCANAKAN';}
MISSIONS.soh.build=buildSoH;
Object.assign(REAL,{
 soh:[
  'Gunakan prosedur tes yang sama persis tiap tahun (arus, suhu, rentang SoC) — komparabilitas adalah segalanya',
  'Meter energi untuk tes harus terkalibrasi; selisih 1% meter = selisih 1% kesimpulan SoH',
  'Bandingkan SoH terukur dengan jaminan degradasi vendor — selisih besar = bahan klaim garansi',
  'Rack augmentasi beda umur tidak diparalel langsung dengan rack lama — perlu manajemen PCS/string terpisah'],
});

/* =====================================================================
   MISI 4 — BESS GRID SERVICE: FREQUENCY RESPONSE
   ===================================================================== */
Object.assign(MISSIONS,{
 freq:{lvl:'JALUR 15 · BATERAI & BESS · MISI 4',icon:'⚡',title:'BESS Grid Service: Frequency Response',strict:false,
  loc:'📍 BESS container · Kontrak layanan frekuensi dimulai',
  story:'BESS-mu naik pangkat: selain peak shaving, kini ia dikontrak sebagai PENJAGA FREKUENSI jaringan. Saat pembangkit besar tersandung dan frekuensi terjun, baterai harus menyuntik daya dalam HITUNGAN MILIDETIK — lebih cepat dari governor pembangkit mana pun berputar. Hari ini kamu mengaktifkan refleks tercepat di sistem tenaga.',
  goal:'Mode frequency response aktif dengan parameter droop benar, dan teruji: BESS merespons gangguan frekuensi otomatis dalam milidetik.',
  obj:['Pahami kontrak layanan & parameter droop','Set deadband, droop & batas SoC di EMS','Uji simulasi gangguan — saksikan respon milidetik'],
  learn:['Inersia sistem menurun saat PLTS/PLTB menggantikan mesin berputar — frekuensi kini jatuh LEBIH CEPAT saat gangguan; baterai mengisi kekosongan refleks itu','Droop control: makin dalam frekuensi jatuh, makin besar daya disuntik — proporsional, otomatis, tanpa menunggu perintah manusia','Deadband (±0,02 Hz) mencegah baterai bereaksi pada riak normal — menghemat siklus untuk gangguan sungguhan','SoC dijaga di tengah (±50%): penjaga frekuensi harus siap mendorong DAN menyerap kapan pun'],
  next:['Pelajari spesifikasi layanan frekuensi & skema kompensasinya','Dalami grid-forming vs grid-following inverter','Eksplorasi virtual power plant: agregasi banyak BESS kecil']},
});
let mfq={};
function buildFreq(){
  freshScene(0x9fb0c4,0x101822);
  cam={theta:.1,phi:1.18,r:8,target:new THREE.Vector3(0,1.7,-1)};
  const ground=boxT(18,.1,11,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  const cont=boxT(3.6,2.4,1.6,TEX.metal(),{metalness:.3});cont.position.set(-3.2,1.2,-2.0);scene.add(cont);
  cont.add(label('BESS 1 MWh · GRID SERVICE',.9).translateY(1.5));
  /* layar kontrak */
  mfq.K=makeDisplay(1.5,.9,340,200);
  mfq.K.mesh.position.set(-3.2,1.4,-1.18);scene.add(mfq.K.mesh);
  dispText(mfq.K,['KONTRAK FR','baca dulu…'],['#ffd23f','#7d8f84']);
  actMesh(mfq.K.mesh,'KONTRAK');
  /* EMS parameter */
  mfq.E=makeDisplay(1.6,1.0,360,220);
  mfq.E.mesh.position.set(0,2.2,-2.9);scene.add(mfq.E.mesh);
  dispText(mfq.E,['EMS — PARAM','belum diset'],['#5fd4ff','#7d8f84']);
  actMesh(mfq.E.mesh,'PARAM');
  scene.add(label('EMS PARAMETER',.65,'#5fd4ff').translateX(0).translateY(2.95).translateZ(-2.9));
  /* layar frekuensi + grafik respon */
  const frame=boxT(3.4,2.0,.16,TEX.metal(),{metalness:.4});frame.position.set(3.8,2.1,-2.9);scene.add(frame);
  frame.add(label('FREKUENSI & RESPON BESS',.8).translateY(1.25));
  mfq.D=makeDisplay(3.1,1.7,520,300);
  mfq.D.mesh.position.set(3.8,2.1,-2.8);scene.add(mfq.D.mesh);
  actMesh(mfq.D.mesh,'UJI');
  mfq.t=0;mfq.event=false;mfq.hist=[];
  function grafik(){
    const g=mfq.D.g,W=520,H=300;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.strokeStyle='#2a3a4c';g.lineWidth=2;
    g.beginPath();g.moveTo(40,20);g.lineTo(40,H-30);g.lineTo(W-10,H-30);g.stroke();
    g.font='600 14px Consolas';g.fillStyle='#8aa3bd';g.textAlign='left';
    g.fillText('50,00',2,84);g.fillText('49,80',2,180);
    g.strokeStyle='#445970';g.setLineDash([5,5]);
    g.beginPath();g.moveTo(40,80);g.lineTo(W-10,80);g.stroke();g.setLineDash([]);
    /* freq line & P line */
    g.strokeStyle='#5fd4ff';g.lineWidth=3;g.beginPath();
    mfq.hist.forEach((h,i)=>{const x=40+i*2.4,y=80+(50-h.f)*500;
      i===0?g.moveTo(x,y):g.lineTo(x,y);});
    g.stroke();
    g.strokeStyle='#46ff8e';g.lineWidth=3;g.beginPath();
    mfq.hist.forEach((h,i)=>{const x=40+i*2.4,y=H-30-h.p*.35;
      i===0?g.moveTo(x,y):g.lineTo(x,y);});
    g.stroke();
    g.fillStyle='#5fd4ff';g.fillText('— frekuensi',60,34);
    g.fillStyle='#46ff8e';g.fillText('— daya BESS (kW)',180,34);
    if(mfq.event&&mfq.hist.length>40){g.fillStyle='#ffd23f';g.font='700 16px Consolas';
      g.fillText('respon: 180 ms · puncak 420 kW',60,H-8);}
    mfq.D.tex.needsUpdate=true;}
  mfq.armed=false;
  moduleTick=(dt)=>{
    mfq.t+=dt;
    let f=50+Math.sin(mfq.t*1.7)*.012;
    let p=0;
    if(mfq.event){
      const te=mfq.t-mfq.t0;
      if(te<6){f=50-.22*Math.exp(-Math.pow((te-1.6),2)/1.4)-(te<1.6?te*.1:.16*Math.exp(-(te-1.6)*.8));
        f=Math.max(49.78,f);
        if(mfq.armed&&f<49.98)p=Math.min(420,(50-f)*2100);}
      else mfq.event=false;}
    mfq.hist.push({f,p});if(mfq.hist.length>195)mfq.hist.shift();
    if((mfq.t*10|0)%2===0)grafik();};
  startSeq([
   {type:'act',aid:'KONTRAK',done:false,targets:()=>[mfq.K.mesh],
    desc:'Baca KONTRAK layanan frekuensi: apa yang dijanjikan? (klik layar)',
    why:'Kontrak: siaga 500 kW, aktif penuh < 1 detik bila frekuensi keluar 49,98–50,02, dibayar per MW-jam KESIAPAN — dibayar untuk berjaga, bukan hanya bekerja. Model bisnis kedua dari aset yang sama: stacking revenue.',
    fx(){dispText(mfq.K,['500 kW · <1 dtk','bayar per kesiapan'],['#46ff8e','#eaf2fb']);
      toast('📜 Kontrak dipahami: refleks 500 kW yang dibayar siaga.','ok',2800);}},
   {type:'act',aid:'PARAM',done:false,targets:()=>[mfq.E.mesh],
    desc:'Set PARAMETER di EMS: deadband, droop, batas SoC.',
    why:'Deadband ±0,02 Hz (riak normal diabaikan — hemat siklus), droop 2% (49,90 Hz = suntik penuh), SoC dijaga 40–60% (siap mendorong DAN menyerap). Tiga angka ini adalah kepribadian sang penjaga: tak gugupan, tapi sigap.',
    fx(){dispText(mfq.E,['db±0,02 · droop2%','SoC 40-60% ✓'],['#46ff8e','#46ff8e']);
      mfq.armed=true;
      toast('⚙️ Parameter terkunci — mode frequency response AKTIF.','ok',2800);}},
   {type:'act',aid:'UJI',done:false,targets:()=>[mfq.D.mesh],
    desc:'UJI: suntikkan gangguan simulasi — pembangkit 100 MW "trip".',
    why:'Frekuensi terjun... dan dalam 180 milidetik garis hijau melonjak: BESS menyuntik hingga 420 kW mengikuti dalamnya jatuh — droop bekerja persis seperti diset. Governor pembangkit lain baru mulai membuka katup ketika baterai sudah selesai menahan jurang.',
    fx(){mfq.event=true;mfq.t0=mfq.t;sfx.click();
      toast('⚡ Gangguan disuntik — saksikan respon milidetik di grafik!','ok',3000);}},
   {type:'act',aid:'LAPOR',done:false,targets:()=>[mfq.K.mesh],
    check:()=>!mfq.event&&mfq.hist.some(h=>h.p>300),
    checkFail:'Tunggu kejadian selesai — biarkan grafik merekam respon penuh dulu.',
    desc:'Kejadian usai: kirim LAPORAN kinerja ke pengelola sistem.',
    why:'Rekaman terkirim otomatis: deteksi 49,97 Hz, respon 180 ms, puncak 420 kW, energi 9,8 kWh — frekuensi pulih tanpa satu pun pelanggan menyadari ada pembangkit tumbang. Laporan ini adalah invoice-mu: bukti kesiapan = bukti bayaran.',
    fx(){toast('📤 Laporan kinerja terkirim — kontrak FR terverifikasi LULUS!','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Refleks tercepat di sistem kini milikmu!</b> 180 milidetik dari deteksi ke ratusan kW — tak ada mesin berputar yang bisa menyaingi. Baterai bukan lagi sekadar penyimpan: ia penjaga detak jantung jaringan.');
    setTimeout(()=>showWin('freq'),2200);});
  const s0=seq.steps[0],of0=s0.fx;s0.fx=()=>{of0();mfq.K.mesh.userData.aid='LAPOR';};
  say('VOLTA di sini ⚡ BESS-mu naik jabatan: <b>penjaga frekuensi jaringan</b>. Saat pembangkit tumbang, kamu punya milidetik — dan baterai adalah satu-satunya yang sanggup. Set droop-nya, lalu kita uji dengan gangguan sungguhan (simulasi).');
  $('#modTitle').textContent='J15·M4 — Frequency Response';
  $('#taskHead').textContent='MILIDETIK YANG MENYELAMATKAN';}
MISSIONS.freq.build=buildFreq;
Object.assign(REAL,{
 freq:[
  'Uji kinerja FR disaksikan & disertifikasi pengelola sistem sebelum kontrak aktif',
  'Telemetri kontinu ke pusat pengatur: kesiapan diaudit dari data, bukan pengakuan',
  'Manajemen SoC harian harus menyeimbangkan FR vs peak shaving — dua kontrak satu baterai perlu prioritas jelas',
  'Hitung degradasi tambahan dari siklus FR dalam ekonomi proyek — refleks juga ada harganya'],
});
