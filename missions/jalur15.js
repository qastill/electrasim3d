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

/* =====================================================================
   MISI 5 — SOLAR SHIFTING: BESS + PLTS CO-LOCATED
   ===================================================================== */
Object.assign(MISSIONS,{
 shift:{lvl:'JALUR 15 · BATERAI & BESS · MISI 5',icon:'🌗',title:'Solar Shifting: BESS + PLTS Co-Located',strict:false,
  loc:'📍 Kawasan industri · PLTS 2 MWp + BESS 1 MWh satu pagar',
  story:'Tetangga BESS-mu kini sebuah PLTS 2 MWp — dan keduanya dijodohkan dalam satu kontrak baru: SOLAR SHIFTING. Masalah abadi tenaga surya: produksi memuncak siang saat tarif murah, lalu pulang tidur tepat ketika beban (dan harga) memuncak sore-malam. Tugas baterai: menculik matahari siang, melepasnya saat senja dihargai mahal.',
  goal:'Mode solar shifting beroperasi: kelebihan produksi siang tersimpan, dilepas di jam puncak sore, dan ramp rate PLTS terhaluskan saat awan lewat.',
  obj:['Analisis profil produksi vs beban & tarif','Set jadwal charge-discharge & smoothing di EMS','Uji sehari penuh: simpan siang, lepas senja'],
  learn:['Solar shifting = arbitrase waktu: energi yang sama bernilai beda tergantung JAM — baterai memindahkan kWh dari jam murah ke jam mahal','Charge dari kelebihan PLTS (bukan grid) menjaga klaim hijau: tiap kWh yang dilepas senja tetap bertanda tangan matahari','Cloud smoothing: awan bikin PLTS terjun ratusan kW dalam detik — baterai mengisi lembahnya, jaringan melihat kurva halus','EMS co-located mengelola SATU titik interkoneksi untuk dua aset: PLTS + BESS tampil ke grid sebagai satu pembangkit yang sopan'],
  next:['Pelajari sizing rasio BESS:PLTS untuk shifting optimal','Dalami clipping recapture: panen energi di atas batas inverter','Eksplorasi kontrak hybrid: shifting + frequency response sekaligus']},
});
let msf={};
function buildShift(){
  freshScene(0xcfe2f0,0x14242c);
  cam={theta:.1,phi:1.15,r:9.5,target:new THREE.Vector3(0,1.6,-.8)};
  const ground=boxT(22,.1,13,TEX.gravel());ground.position.y=-.05;scene.add(ground);
  /* array PLTS */
  for(let r=0;r<2;r++)for(let c=0;c<3;c++){
    const p=box(1.7,.06,1.1,0x16263e,{roughness:.25,metalness:.5});
    p.position.set(-6+c*1.9,1.1+0,-3+r*1.4);p.rotation.x=-.22;scene.add(p);
    const leg=cyl(.05,.05,.9,0x8a8a8a);leg.position.set(-6+c*1.9,.45,-3+r*1.4);scene.add(leg);}
  scene.add(label('PLTS 2 MWp',.8).translateX(-4.1).translateY(2.2).translateZ(-2.4));
  /* BESS container */
  const cont=boxT(2.8,2.0,1.4,TEX.metal(),{metalness:.3});cont.position.set(1.4,1.0,-2.2);scene.add(cont);
  cont.add(label('BESS 1 MWh',.8).translateY(1.3));
  /* layar profil besar */
  const frame=boxT(4.4,2.5,.16,TEX.metal(),{metalness:.4});frame.position.set(5.6,2.3,-2.8);scene.add(frame);
  frame.add(label('PROFIL 24 JAM — PLTS · BEBAN · BESS',.8).translateY(1.55));
  msf.D=makeDisplay(4.1,2.2,600,330);
  msf.D.mesh.position.set(5.6,2.3,-2.7);scene.add(msf.D.mesh);
  actMesh(msf.D.mesh,'PROFIL');
  function grafik(mode){
    const g=msf.D.g,W=600,H=330;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.strokeStyle='#2a3a4c';g.lineWidth=2;
    g.beginPath();g.moveTo(40,16);g.lineTo(40,H-36);g.lineTo(W-12,H-36);g.stroke();
    g.font='600 13px Consolas';g.fillStyle='#8aa3bd';g.textAlign='center';
    [0,6,12,18,24].forEach(h=>g.fillText(h+':00',40+h/24*(W-66),H-16));
    /* zona tarif mahal 17-21 */
    const x17=40+17/24*(W-66),x21=40+21/24*(W-66);
    g.fillStyle='#3a2a1a';g.fillRect(x17,16,x21-x17,H-52);
    g.fillStyle='#ffd23f';g.fillText('TARIF PUNCAK',x17+(x21-x17)/2,30);
    function kurva(col,fn,dash){g.strokeStyle=col;g.lineWidth=3;
      if(dash)g.setLineDash([6,5]);g.beginPath();
      for(let h=0;h<=24;h+=.5){const x=40+h/24*(W-66),y=H-36-fn(h)*(H-80);
        h===0?g.moveTo(x,y):g.lineTo(x,y);}
      g.stroke();g.setLineDash([]);}
    const pv=h=>Math.max(0,Math.sin((h-6)/12*Math.PI))*.95;
    kurva('#ffd23f',pv);
    if(mode>=1){ /* dengan shifting: ekspor terpotong siang, terangkat sore */
      kurva('#46ff8e',h=>{
        if(h>=9&&h<=15)return pv(h)*.55;       /* sebagian masuk baterai */
        if(h>=17&&h<=21)return .42;            /* discharge senja */
        return pv(h);},false);}
    g.font='600 14px Consolas';g.textAlign='left';
    g.fillStyle='#ffd23f';g.fillText('— PLTS mentah',50,30);
    if(mode>=1){g.fillStyle='#46ff8e';g.fillText('— ekspor dgn BESS (shifted)',50,50);}
    if(mode>=2){g.fillStyle='#5fd4ff';g.fillText('cloud smoothing AKTIF: ramp <10%/menit ✓',50,72);}
    msf.D.tex.needsUpdate=true;}
  grafik(0);
  /* EMS panel */
  msf.E=makeDisplay(1.5,.9,340,200);
  msf.E.mesh.position.set(1.4,2.6,-2.2);scene.add(msf.E.mesh);
  dispText(msf.E,['EMS','mode: idle'],['#5fd4ff','#7d8f84']);
  actMesh(msf.E.mesh,'JADWAL');
  scene.add(label('EMS CO-LOCATED',.6,'#5fd4ff').translateX(1.4).translateY(3.25).translateZ(-2.2));
  startSeq([
   {type:'act',aid:'PROFIL',done:false,targets:()=>[msf.D.mesh],
    desc:'Baca PROFIL: di mana matahari & uang tidak bertemu? (klik layar)',
    why:'Kurva kuning memuncak jam 12 — tarif ekspor sedang murah-murahnya. Zona oranye (17–21) bertarif premium... dan di sanalah PLTS sudah nyaris tidur. Dua puncak yang saling merindukan tapi tak pernah bertemu: pekerjaan klasik untuk baterai.',
    fx(){toast('📊 Puncak produksi 12:00 vs puncak harga 17-21 — mismatch jelas.','info',3000);}},
   {type:'act',aid:'JADWAL',done:false,targets:()=>[msf.E.mesh],
    desc:'Set JADWAL di EMS: charge siang dari PLTS, discharge senja (klik EMS).',
    why:'Aturan ditulis: 09–15 serap kelebihan PLTS sampai SoC 95% (charge HANYA dari surya — kWh senja tetap bertanda tangan matahari), 17–21 discharge mengikuti kurva tarif, sisakan 15% untuk cloud smoothing. Baterai kini punya jam kerja.',
    fx(){dispText(msf.E,['SHIFTING SET','chg 9-15 · dis 17-21'],['#46ff8e','#eaf2fb']);
      toast('🗓️ Jadwal terkunci — matahari siang dipesan untuk senja.','ok',2800);}},
   {type:'act',aid:'SMOOTH',done:false,targets:()=>[msf.E.mesh],
    desc:'Aktifkan CLOUD SMOOTHING — jaga ramp rate (klik EMS lagi).',
    why:'Awan tebal bisa menjatuhkan 2 MWp ratusan kW dalam sepuluh detik — jaringan kecil terhuyung oleh hentakan begitu. Mode smoothing: baterai menambal tiap lembah seketika, ekspor berubah maksimal 10% per menit. Grid melihat pembangkit yang berperilaku santun.',
    fx(){grafik(2);toast('☁️ Smoothing ON — awan boleh lewat, kurva tetap halus.','ok',2800);}},
   {type:'act',aid:'UJI',done:false,targets:()=>[msf.D.mesh],
    desc:'Jalankan UJI 24 jam (simulasi dipercepat) — baca hasilnya.',
    why:'Kurva hijau bercerita: siang terpotong rapi (masuk baterai), senja TERANGKAT 420 kW tepat di zona premium. Pendapatan harian naik 31% dari energi matahari yang SAMA — tak ada panel baru, hanya waktu yang dipindahkan. Arbitrase paling elegan: melawan jam, bukan pasar.',
    fx(){grafik(2);
      toast('🌗 Uji lolos: pendapatan +31% dari kWh yang sama!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Matahari berhasil diculik ke senja!</b> Siang menabung, senja memanen, dan awan tak lagi bisa mengejutkan jaringan. PLTS + BESS satu pagar: pembangkit surya yang akhirnya bisa janjian dengan jam mahal.');
    setTimeout(()=>showWin('shift'),2200);});
  const s1=seq.steps[1],of1=s1.fx;s1.fx=()=>{of1();msf.E.mesh.userData.aid='SMOOTH';};
  const s0f=seq.steps[0],of0f=s0f.fx;s0f.fx=()=>{of0f();msf.D.mesh.userData.aid='UJI';};
  say('VOLTA di sini 🌗 Perjodohan baru: <b>PLTS 2 MWp + BESS-mu</b>. Masalah abadi surya: berproduksi saat murah, tidur saat mahal. Solusinya satu kata — shifting. Baca dulu profilnya, lalu ajari baterai jam kerjanya.');
  $('#modTitle').textContent='J15·M5 — Solar Shifting';
  $('#taskHead').textContent='SIMPAN SIANG, PANEN SENJA';}
MISSIONS.shift.build=buildShift;
Object.assign(REAL,{
 shift:[
  'Validasi struktur tarif/PPA aktual — nilai shifting hidup-mati oleh selisih harga antar jam',
  'Charge dari PLTS vs grid punya implikasi kontrak & klaim hijau — atur di EMS dan dokumentasikan',
  'Sisakan headroom SoC untuk smoothing — baterai penuh tak bisa menyerap hentakan awan',
  'Evaluasi bulanan: cuaca berubah musiman, jadwal charge-discharge ikut dikalibrasi ulang'],
});

/* =====================================================================
   MISI 6 — GRID-FORMING: BESS MENGHIDUPKAN MICROGRID
   ===================================================================== */
Object.assign(MISSIONS,{
 gridform:{lvl:'JALUR 15 · BATERAI & BESS · MISI 6',icon:'🏝️',title:'Grid-Forming: BESS Menghidupkan Microgrid',strict:true,
  loc:'📍 Kawasan industri · Blackout area, 19:40',
  story:'Gangguan besar memutus kawasan industri dari jaringan — gelap total. Tapi kawasan ini punya kartu rahasia yang kamu pasang sendiri: BESS dengan inverter GRID-FORMING. Tak seperti inverter biasa yang hanya bisa mengikuti jaringan, ia mampu MENCIPTAKAN jaringan: menetapkan 50 Hz-nya sendiri di tengah kehampaan. Malam ini baterai naik takhta jadi pembangkit utama.',
  goal:'Microgrid hidup dari nol: BESS membentuk tegangan & frekuensi referensi, beban dipanggil bertahap, PLTS bergabung, dan resinkronisasi mulus saat jaringan utama pulih.',
  obj:['Mode grid-forming: bentuk 50 Hz dari kehampaan','Black start microgrid: panggil beban bertahap','Resinkronisasi ke jaringan saat pulih'],
  learn:['Inverter grid-following BUTUH jaringan untuk diikuti; grid-forming MENJADI jaringan: ia sumber tegangan & frekuensi, bukan penumpang','Cold load pickup: beban yang lama padam menarik arus lonjakan saat dinyalakan — dipanggil per blok, dari kritis ke biasa','Selama islanding, BESS menjadi slack bus mini: tiap watt beban & PLTS yang berubah, baterailah yang menyerap selisihnya','Resinkronisasi = ilmu synchroscope yang sama: samakan tegangan-frekuensi-fase microgrid dengan jaringan, tutup breaker di momen nol'],
  next:['Pelajari droop control antar beberapa sumber grid-forming','Dalami proteksi microgrid: setting ganda mode island vs grid','Eksplorasi seamless transfer: islanding tanpa kedip sama sekali']},
});
let mgf={};
function buildGridform(){
  freshScene(0x0e131c,0x05080d);
  cam={theta:.1,phi:1.16,r:9.5,target:new THREE.Vector3(0,1.7,-.8)};
  const ground=boxT(22,.1,13,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  /* BESS + PCS grid-forming */
  const cont=boxT(2.8,2.0,1.4,TEX.metal(),{metalness:.3});cont.position.set(-4.4,1.0,-2.2);scene.add(cont);
  cont.add(label('BESS 1 MWh · GRID-FORMING',.8).translateY(1.3));
  mgf.pcs=boxT(1.1,1.5,.7,TEX.metal(),{metalness:.35});mgf.pcs.position.set(-2.2,.8,-2.2);scene.add(mgf.pcs);
  actMesh(mgf.pcs,'FORM');
  scene.add(label('PCS — mode: ?',.65,'#5fd4ff').translateX(-2.2).translateY(1.8).translateZ(-2.2));
  /* layar microgrid */
  const frame=boxT(3.8,2.2,.16,TEX.metal(),{metalness:.4});frame.position.set(1.4,2.4,-3.0);scene.add(frame);
  frame.add(label('MICROGRID CONTROLLER',.8).translateY(1.35));
  mgf.D=makeDisplay(3.5,1.9,540,310);
  mgf.D.mesh.position.set(1.4,2.4,-2.9);scene.add(mgf.D.mesh);
  actMesh(mgf.D.mesh,'BEBAN');
  mgf.formed=false;mgf.blok=0;mgf.pv=false;mgf.sync=false;mgf.f=0;
  function layar(){
    const g=mgf.D.g,W=540,H=310;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='700 18px Consolas';g.textAlign='left';
    g.fillStyle=mgf.formed?'#46ff8e':'#ff5a5a';
    g.fillText(mgf.formed?mgf.f.toFixed(2)+' Hz · 400 V — ISLAND':'0,00 Hz — GELAP TOTAL',16,38);
    g.font='600 15px Consolas';
    const bloks=[['Blok 1: kritis (panel, IT, lampu)',1],['Blok 2: produksi ringan',2],['Blok 3: umum',3]];
    bloks.forEach((b,i)=>{
      g.fillStyle=mgf.blok>=b[1]?'#46ff8e':'#5d748c';
      g.fillText((mgf.blok>=b[1]?'●':'○')+' '+b[0],16,86+i*36);});
    g.fillStyle=mgf.pv?'#46ff8e':'#5d748c';
    g.fillText((mgf.pv?'●':'○')+' PLTS 2 MWp '+(mgf.pv?'bergabung (following)':'menunggu'),16,196);
    if(mgf.sync){g.fillStyle='#5fd4ff';g.font='700 16px Consolas';
      g.fillText('RESYNC: jaringan pulih — fase disamakan…',16,250);}
    mgf.D.tex.needsUpdate=true;}
  layar();
  moduleTick=(dt)=>{if(mgf.formed&&mgf.f<50){mgf.f=Math.min(50,mgf.f+dt*25);layar();}};
  /* kawasan beban */
  [[3.8,-1.6,'PABRIK A'],[5.6,-2.4,'PABRIK B'],[4.8,.2,'KANTOR']].forEach(o=>{
    const b=boxT(1.2,.9,.9,TEX.plaster());b.position.set(o[0],.5,o[1]);scene.add(b);
    scene.add(label(o[2],.5).translateX(o[0]).translateY(1.25).translateZ(o[1]));});
  mgf.lamp=new THREE.Mesh(new THREE.SphereGeometry(.08,12,10),
    new THREE.MeshStandardMaterial({color:0x553322,emissive:0x000000}));
  mgf.lamp.position.set(4.8,1.7,-1.2);scene.add(mgf.lamp);
  /* PLTS + breaker jaringan */
  mgf.pvm=box(1.6,.05,.9,0x16263e,{roughness:.25});mgf.pvm.position.set(-.2,1.2,.8);
  mgf.pvm.rotation.x=-.25;scene.add(mgf.pvm);
  actMesh(mgf.pvm,'PV');
  scene.add(label('PLTS KAWASAN 2 MWp',.6).translateX(-.2).translateY(1.8).translateZ(.8));
  mgf.brk=box(.4,.55,.2,0x18242f);mgf.brk.position.set(-6.8,1.0,-.4);scene.add(mgf.brk);
  actMesh(mgf.brk,'RESYNC');
  scene.add(label('BREAKER KE JARINGAN UTAMA',.6,'#5fd4ff').translateX(-6.8).translateY(1.6).translateZ(-.4));
  startSeq([
   {type:'act',aid:'FORM',done:false,targets:()=>[mgf.pcs],
    desc:'Aktifkan mode GRID-FORMING: ciptakan 50 Hz dari kehampaan (klik PCS).',
    why:'Inverter berhenti mencari jaringan untuk diikuti — ia MENJADI jaringan: gelombang sinus 400 V / 50 Hz lahir dari firmware dan energi baterai, referensi bagi semua yang akan menyala setelahnya. Di kegelapan kawasan, satu kotak putih ini kini adalah "PLN".',
    fx(){mgf.formed=true;mgf.f=0;beep(110,.8,'sine',.08);
      toast('🌅 Grid-forming AKTIF — 50 Hz tercipta dari baterai.','ok',3000);}},
   {type:'act',aid:'BEBAN',done:false,targets:()=>[mgf.D.mesh],
    desc:'Black start microgrid: panggil BEBAN per blok (klik controller).',
    why:'Cold load pickup mengintai: motor & trafo yang lama padam menyedot lonjakan saat bangun. Blok kritis dulu (200 kW), tunggu stabil... blok produksi (350 kW)... blok umum. Frekuensi bergetar kecil di tiap penutupan — baterai menelan semuanya tanpa mengeluh.',
    fx(){mgf.blok=3;layar();
      mgf.lamp.material.color.setHex(0xffd97a);mgf.lamp.material.emissive.setHex(0xffd97a);
      mgf.lamp.material.emissiveIntensity=1;
      toast('💡 3 blok menyala bertahap — kawasan hidup di pulau sendiri.','ok',3200);}},
   {type:'act',aid:'PV',done:false,targets:()=>[mgf.pvm],
    desc:'Undang PLTS kawasan BERGABUNG ke microgrid (klik panel).',
    why:'Inverter PLTS (grid-following) kini menemukan "jaringan" untuk diikuti — jaringan buatan baterai-mu. Ia sinkron & menyumbang 800 kW; BESS otomatis mundur jadi penyeimbang: mengisi saat surya surplus, menopang saat awan. Pulau kecil ini kini punya dua kaki.',
    fx(){mgf.pv=true;layar();
      toast('☀️ PLTS sinkron ke microgrid — BESS jadi penyeimbang.','ok',3000);}},
   {type:'act',aid:'RESYNC',done:false,targets:()=>[mgf.brk],
    desc:'Jaringan utama PULIH: resinkronisasi & kembali normal (klik breaker).',
    why:'Ilmu synchroscope PLTU-mu terpakai lagi: controller menggeser frekuensi microgrid sehalus rambut sampai fase berhimpit dengan jaringan... breaker menutup di momen nol — TANPA kedip. BESS turun takhta dengan anggun: dari raja pulau kembali jadi penjaga frekuensi. Kawasan bahkan tak sadar pernah dipimpin baterai.',
    fx(){mgf.sync=true;layar();
      toast('🔗 RESYNC mulus — kembali ke jaringan tanpa kedip!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Baterai sempat menjadi PLN — dan tak ada yang menyadarinya!</b> Membentuk 50 Hz dari nol, memanggil beban dengan sabar, mengasuh PLTS, lalu menyerahkan takhta tanpa kedip. Grid-forming: masa depan keandalan ada di firmware.');
    setTimeout(()=>showWin('gridform'),2200);});
  say('VOLTA di sini 🏝️ Kawasan gelap total — tapi BESS-mu menyimpan kemampuan rahasia: <b>grid-forming</b>, mencipta jaringan dari kehampaan. Malam ini baterai naik takhta. Mulai dari PCS!');
  $('#modTitle').textContent='J15·M6 — Grid-Forming Microgrid';
  $('#taskHead').textContent='MENCIPTA 50 Hz DARI NOL';}
MISSIONS.gridform.build=buildGridform;
Object.assign(REAL,{
 gridform:[
  'Skema proteksi butuh setting GANDA: arus hubung singkat mode island jauh lebih kecil dari mode grid',
  'Urutan blok beban & kapasitas pickup diuji drill nyata berkala — bukan hanya di studi',
  'Anti-islanding di inverter PLTS harus dikoordinasikan dengan mode microgrid (izin island terkendali)',
  'Resinkronisasi memakai sync-check relay — fase yang salah menghapus semua kerja baik sebelumnya'],
});

/* =====================================================================
   MISI 7 — KOMISIONING FIRE SAFETY BESS
   ===================================================================== */
Object.assign(MISSIONS,{
 fire:{lvl:'JALUR 15 · BATERAI & BESS · MISI 7',icon:'🧯',title:'Komisioning Fire Safety BESS',strict:true,
  loc:'📍 Site BESS baru 4 MWh · Hari uji proteksi kebakaran',
  story:'Proyek BESS terbesarmu — 4 MWh, empat kontainer — hampir COD. Tapi satu gerbang terakhir menentukan izin operasinya: KOMISIONING FIRE SAFETY, disaksikan damkar kota. Kebakaran baterai litium berbeda mazhab dari api biasa: ia bermula dari dalam sel, tak butuh oksigen luar, dan menyemburkan gas yang bisa meledak. Sistemmu harus membuktikan bisa mendengar, menahan, dan memandu manusia menjauh.',
  goal:'Seluruh rantai fire safety teruji di depan damkar: deteksi off-gas memutus operasi dini, suppression bekerja, ledakan tertunda oleh ventilasi, dan drill gabungan dengan damkar lulus.',
  obj:['Uji deteksi bertingkat: off-gas → asap → panas','Uji suppression & sistem ventilasi anti-deflagrasi','Drill gabungan dengan damkar kota'],
  learn:['Kebakaran litium bermula JAUH sebelum api: sel stres melepas off-gas khas — detektor off-gas adalah telinga paling dini, memutus operasi sebelum tetangga sel ikut demam','Thermal runaway sel tak bisa "dipadamkan" dari luar — strategi BESS: suppression menahan PENJALARAN & mendinginkan, sambil manusia menjauh','Gas venting baterai (H₂, CO, elektrolit) bisa meledak terkumpul di ruang tertutup: ventilasi darurat & panel pelepas ledakan adalah pasal desain, bukan aksesori','Damkar TIDAK menyemprot kontainer baterai seperti rumah: air untuk melindungi sekitar & mendinginkan — drill gabungan menyamakan mazhab sebelum malam kejadian'],
  next:['Pelajari standar keselamatan BESS skala besar & jarak antar kontainer','Dalami analisis deflagrasi & desain ventilasi daruratnya','Susun pre-incident plan bersama damkar untuk tiap site']},
});
let mfr={};
function buildFire(){
  freshScene(0x9fb0c4,0x101822);
  cam={theta:.1,phi:1.15,r:10,target:new THREE.Vector3(0,1.6,-.8)};
  const ground=boxT(24,.1,14,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  /* 4 kontainer berjarak */
  mfr.cont=[];
  for(let i=0;i<4;i++){
    const c=boxT(2.4,2.2,1.3,TEX.metal(),{metalness:.3});
    c.position.set(-6.6+i*4.4,1.1,-2.4);scene.add(c);mfr.cont.push(c);}
  scene.add(label('BESS 4 MWh — 4 KONTAINER BERJARAK',.85).translateY(2.9).translateZ(-2.4));
  actMesh(mfr.cont[1],'DETEKSI');
  /* panel pelepas ledakan di atap */
  for(let i=0;i<4;i++){const v=box(.8,.06,.6,0xd8b020);
    v.position.set(-6.6+i*4.4,2.24,-2.4);scene.add(v);}
  /* layar uji */
  const frame=boxT(3.6,2.2,.16,TEX.metal(),{metalness:.4});frame.position.set(0,2.5,2.4);frame.rotation.y=Math.PI;scene.add(frame);
  mfr.D=makeDisplay(3.3,1.9,520,300);
  mfr.D.mesh.position.set(0,2.5,2.3);mfr.D.mesh.rotation.y=Math.PI;scene.add(mfr.D.mesh);
  actMesh(mfr.D.mesh,'SUPPRESS');
  scene.add(label('PANEL UJI FIRE SAFETY — disaksikan DAMKAR',.8,'#ff9d6a').translateY(3.9).translateZ(2.3));
  mfr.tahap=0;
  function layar(){
    const g=mfr.D.g,W=520,H=300;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='600 15px Consolas';g.textAlign='left';
    const rows=[['1. Deteksi off-gas → trip',1],['2. Asap & panas → alarm zona',1],
      ['3. Suppression release',2],['4. Ventilasi darurat & damper',2],
      ['5. Drill gabungan damkar',3]];
    g.fillStyle='#5fd4ff';g.font='700 17px Consolas';
    g.fillText('CHECKLIST KOMISIONING',16,32);
    g.font='600 15px Consolas';
    rows.forEach((r,i)=>{const y=72+i*42;
      g.fillStyle=mfr.tahap>=r[1]?'#46ff8e':'#5d748c';
      g.fillText((mfr.tahap>=r[1]?'✓ ':'○ ')+r[0],16,y);});
    mfr.D.tex.needsUpdate=true;}
  layar();
  /* damkar figur + truk */
  const truk=box(2.6,1.1,1.1,0xc83a3a);truk.position.set(5.8,.85,1.6);scene.add(truk);
  [[-1,-.6],[1,-.6],[-1,.6],[1,.6]].forEach(w=>{
    const wh=cyl(.28,.28,.2,0x14181d);wh.rotation.x=Math.PI/2;
    wh.position.set(5.8+w[0],.3,1.6+w[1]);scene.add(wh);});
  mfr.dam=new THREE.Group();
  const badan=cyl(.22,.28,.9,0xc83a3a);badan.position.y=.72;mfr.dam.add(badan);
  const kepala=new THREE.Mesh(new THREE.SphereGeometry(.15,14,12),
    new THREE.MeshStandardMaterial({color:0xd8b090}));kepala.position.y=1.36;mfr.dam.add(kepala);
  const helm3=new THREE.Mesh(new THREE.SphereGeometry(.18,14,10,0,Math.PI*2,0,Math.PI/2),
    new THREE.MeshStandardMaterial({color:0xd8d020}));helm3.position.y=1.42;mfr.dam.add(helm3);
  mfr.dam.position.set(4.0,0,.8);scene.add(mfr.dam);
  actMesh(badan,'DRILL');
  scene.add(label('KOMANDAN DAMKAR',.6).translateX(4.0).translateY(1.9).translateZ(.8));
  startSeq([
   {type:'act',aid:'DETEKSI',done:false,targets:()=>[mfr.cont[1]],
    desc:'Uji DETEKSI bertingkat: suntik gas uji ke kontainer 2 (klik kontainer).',
    why:'Gas simulasi off-gas disuntik dekat sensor: 14 detik — alarm tingkat 1 & BESS MEMUTUS OPERASI otomatis (sumber panas berhenti sebelum menjalar); asap uji menyusul: alarm zona ke pusat & damkar. Telinga paling dini terbukti bangun: di dunia litium, menit pertama menentukan segalanya.',
    fx(){mfr.tahap=1;layar();beep(880,.2,'square',.1);beep(880,.2,'square',.1,.35);
      toast('👂 Off-gas 14 dtk → trip otomatis · asap → alarm zona ✓','ok',3200);}},
   {type:'act',aid:'SUPPRESS',done:false,targets:()=>[mfr.D.mesh],
    desc:'Uji SUPPRESSION & ventilasi anti-deflagrasi (klik panel).',
    why:'Aerosol suppression dilepas di kontainer uji (sel dummy): konsentrasi merata <10 detik — tugasnya menahan penjalaran & mendinginkan, bukan "memadamkan" sel yang runaway (itu mustahil dari luar). Lalu skenario gas terkumpul: damper ventilasi darurat membuka, panel atap siap melepas tekanan TANPA meledakkan dinding. Ledakan yang diberi pintu tidak merubuhkan rumah.',
    fx(){mfr.tahap=2;layar();
      toast('🧯 Suppression <10 dtk ✓ · ventilasi & panel pelepas ✓','ok',3200);}},
   {type:'act',aid:'DRILL',done:false,targets:()=>[mfr.dam.children[0]],
    desc:'Puncaknya: DRILL GABUNGAN dengan damkar kota (klik komandan).',
    why:'Skenario malam: alarm kontainer 3 — operator mundur ke titik aman & menyerahkan komando, damkar datang dengan pre-incident plan di tangan: TIDAK menyemprot kontainer, melainkan melindungi kontainer tetangga & memantau termal dari jarak. "Baterai itu kalian biarkan selesai dengan dirinya — tugas kita mengurung," kata komandan. Mazhab tersamakan SEBELUM malam sungguhan.',
    fx(){mfr.tahap=3;layar();
      toast('🚒 Drill gabungan LULUS — mazhab litium dipahami semua pihak.','ok',3400);sfx.big();}},
   {type:'act',aid:'COD',done:false,targets:()=>[mfr.D.mesh],
    desc:'Semua hijau: tanda tangan berita acara — izin operasi (klik panel).',
    why:'Lima baris checklist hijau, disaksikan & ditandatangani damkar + pemilik. BESS 4 MWh resmi boleh beroperasi — bukan karena apinya mustahil, tapi karena setiap menit pertamanya sudah dilatih. Keselamatan baterai bukan janji sistem; ia koreografi manusia & mesin yang sudah di-gladi-resik.',
    fx(){toast('📜 BA fire safety diteken — BESS 4 MWh resmi COD!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Gerbang terakhir terbuka!</b> Off-gas terdengar 14 detik, suppression mengurung, ventilasi memberi pintu pada ledakan, dan damkar satu mazhab denganmu. BESS terbesar dalam karier-mu beroperasi — dengan menit-menit pertamanya yang sudah dihafal semua orang.');
    setTimeout(()=>showWin('fire'),2200);});
  const s1f=seq.steps[1],of1f=s1f.fx;s1f.fx=()=>{of1f();mfr.D.mesh.userData.aid='COD';};
  say('VOLTA di sini 🧯 Proyek 4 MWh-mu menunggu satu gerbang: <b>komisioning fire safety disaksikan damkar</b>. Kebakaran litium bermazhab lain: bermula dari dalam, tak butuh oksigen luar. Buktikan sistemmu mendengar lebih dini dari api. Mulai!');
  $('#modTitle').textContent='J15·M7 — Fire Safety BESS';
  $('#taskHead').textContent='DENGAR · KURUNG · LATIH';}
MISSIONS.fire.build=buildFire;
Object.assign(REAL,{
 fire:[
  'Desain mengikuti standar keselamatan BESS terkini (jarak, ventilasi deflagrasi, deteksi off-gas)',
  'Pre-incident plan disusun BERSAMA damkar & diperbarui saat layout berubah',
  'Air damkar untuk proteksi eksposur — siapkan suplai & akses yang dihitung sejak desain site',
  'Pasca-kejadian sekecil apa pun: sel/modul terdampak dikarantina — reignition berjam-jam kemudian itu nyata'],
});

/* =====================================================================
   MISI 8 — AI BATTERY ANALYTICS: MERAMAL SEL YANG SAKIT
   ===================================================================== */
Object.assign(MISSIONS,{
 twin:{lvl:'JALUR 15 · BATERAI & BESS · MISI 8',icon:'🧠',title:'AI Battery Analytics: Meramal Sel yang Sakit',strict:false,
  loc:'📍 Fleet BESS · 4 site, jutaan titik data BMS per hari',
  story:'Empat site BESS-mu kini menghasilkan jutaan titik data BMS per hari — dan semua hanya jadi arsip. Insiden termal tahun lalu (yang kamu tangani manual) meninggalkan pertanyaan menggoda: data sebelum kejadian itu… apakah sudah BERBISIK? Proyek barumu menjawabnya: AI analytics yang membaca jutaan suhu & tegangan sel, menemukan yang menyimpang dari saudara-saudaranya — berminggu-minggu sebelum alarm konvensional bangun.',
  goal:'Pipeline analitik berjalan: data BMS terpusat & bersih, model anomali tervalidasi terhadap insiden lampau, dan alert pertama tertangkap & terverifikasi di lapangan.',
  obj:['Pusatkan & bersihkan data BMS 4 site','Latih deteksi anomali & uji ke insiden lampau','Operasikan alert & verifikasi temuan pertama'],
  learn:['Sel dalam rack adalah saudara kembar statistik: dirawat sama, dibebani sama — sel yang pelan-pelan MENYIMPANG dari saudaranya adalah bisikan paling dini','Validasi terbaik model: putar ulang data SEBELUM insiden nyata — bila model membunyikan alarm 3 minggu lebih awal, ia layak dipercaya ke depan','Self-discharge naik, delta suhu mikro, tegangan istirahat melenceng: pola-pola yang tenggelam di alarm ambang konvensional, muncul di analitik pembanding','Alert AI dieskalasi berjenjang seperti triase AMI: investigasi data dulu, lapangan kemudian — model menunjuk, manusia memvonis (prinsip yang tak pernah berubah)'],
  next:['Pelajari estimasi SoH per-sel dari data operasional (tanpa capacity test)','Dalami digital twin elektro-termal untuk simulasi skenario','Eksplorasi analitik sebagai layanan untuk pemilik BESS lain — lini bisnis baru']},
});
let mtw={};
function buildTwin(){
  freshScene(0x9fb0c4,0x101822);
  cam={theta:0,phi:1.16,r:8.5,target:new THREE.Vector3(0,1.9,-1)};
  const floor=boxT(18,.1,11,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(16,4.6,.2,TEX.metal(),{metalness:.2});wall.position.set(0,2.3,-3.3);scene.add(wall);
  /* layar analitik besar */
  const frame=boxT(5.2,2.9,.16,TEX.metal(),{metalness:.4});frame.position.set(-1.2,2.4,-3.2);scene.add(frame);
  mtw.D=makeDisplay(4.9,2.6,640,360);
  mtw.D.mesh.position.set(-1.2,2.4,-3.1);scene.add(mtw.D.mesh);
  actMesh(mtw.D.mesh,'DATA');
  scene.add(label('BATTERY ANALYTICS — 4 SITE · 28.800 SEL',.9).translateX(-1.2).translateY(4.05).translateZ(-3.1));
  mtw.mode=0;
  function layar(){
    const g=mtw.D.g,W=640,H=360;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='600 15px Consolas';g.textAlign='left';
    if(mtw.mode===0){g.fillStyle='#5d748c';g.font='700 17px Consolas';
      g.fillText('4 site · data tercecer di tiap BMS lokal…',24,H/2);}
    else{
      /* heatmap sel */
      for(let i=0;i<240;i++){
        const x=20+(i%30)*20,y=50+Math.floor(i/30)*28;
        const anom=(mtw.mode>=2&&(i===67||i===142));
        const warm=(mtw.mode>=2&&i===188);
        g.fillStyle=anom?'#ff5a3a':(warm?'#ffd23f':'#1d3a5a');
        g.fillRect(x,y,16,22);}
      g.fillStyle='#5fd4ff';g.font='700 17px Consolas';
      g.fillText(mtw.mode===1?'data terpusat: 28.800 sel · 2,1 jt titik/hari':
        'ANOMALI: 2 sel menyimpang + 1 waspada',20,32);
      if(mtw.mode>=3){g.fillStyle='#46ff8e';g.font='700 15px Consolas';
        g.fillText('backtest insiden 2027: model alarm H-19 hari ✓',20,H-18);}}
    mtw.D.tex.needsUpdate=true;}
  layar();
  /* kartu langkah */
  mtw.cards=[];
  [['BACKTEST','BACK',2.6],['ALERT LIVE','ALERT',3.7]].forEach((o,i)=>{
    const c=box(.95,.5,.08,0x2b3a4a);c.position.set(o[2],2.4,-3.15);scene.add(c);
    actMesh(c,o[1]);mtw.cards.push(c);
    scene.add(label(o[0],.48,'#5fd4ff').translateX(o[2]).translateY(2.8).translateZ(-3.1));});
  /* teknisi lapangan */
  mtw.tek=new THREE.Group();
  const badan=cyl(.2,.26,.85,0xd87a20);badan.position.y=.7;mtw.tek.add(badan);
  const kepala=new THREE.Mesh(new THREE.SphereGeometry(.14,14,12),
    new THREE.MeshStandardMaterial({color:0xd8b090}));kepala.position.y=1.3;mtw.tek.add(kepala);
  mtw.tek.position.set(4.6,0,-.8);scene.add(mtw.tek);
  actMesh(badan,'VERIF');
  scene.add(label('TEKNISI SITE-2',.6).translateX(4.6).translateY(1.8).translateZ(-.8));
  startSeq([
   {type:'act',aid:'DATA',done:false,targets:()=>[mtw.D.mesh],
    desc:'Pusatkan & bersihkan DATA BMS 4 site (klik layar).',
    why:'Empat BMS lokal beda merek, beda format, beda zona waktu — pipeline menyeragamkan: 28.800 sel, 2,1 juta titik/hari mengalir ke satu rumah, dgn pembersihan (sensor mati, stempel waktu kacau) otomatis. Ilmu lama yang selalu benar: model sehebat apa pun lahir mati di atas data kotor.',
    fx(){mtw.mode=1;layar();toast('🗄️ 4 site → satu rumah data: 2,1 jt titik/hari bersih.','ok',3000);}},
   {type:'act',aid:'BACK',done:false,targets:()=>[mtw.cards[0]],
    desc:'Uji kejujuran model: BACKTEST ke insiden termal lampau (klik kartu).',
    why:'Model pembanding-saudara dilatih, lalu ujian paling adil: data SEBELUM insiden modul 7 tahun lalu diputar ulang TANPA memberi tahu jawabannya. Hasil: model menandai sel itu menyimpang 19 HARI sebelum alarm BMS bangun — self-discharge-nya merayap naik pelan, tenggelam di rata-rata, menonjol di perbandingan. Sel itu memang sudah berbisik; dulu belum ada yang mendengarkan.',
    fx(){mtw.mode=3;layar();toast('🕰️ Backtest: alarm H-19 hari sebelum insiden nyata ✓','ok',3400);}},
   {type:'act',aid:'ALERT',done:false,targets:()=>[mtw.cards[1]],
    desc:'Operasikan: ALERT LIVE dgn eskalasi berjenjang (klik kartu).',
    why:'Model kini berjaga 24/7. Minggu kedua: dua sel site-2 ditandai menyimpang (skor tinggi), satu waspada. Protokol triase berjalan — bukan panik: data didalami dulu (tren 30 hari konsisten ✓, bukan sensor error ✓), baru lapangan diutus. Model menunjuk; manusia tetap yang memvonis.',
    fx(){mtw.mode=2;layar();toast('🚨 2 sel ditandai di site-2 — triase data lolos, utus lapangan.','ok',3200);}},
   {type:'act',aid:'VERIF',done:false,targets:()=>[mtw.tek.children[0]],
    desc:'Vonis lapangan: VERIFIKASI dua sel tersangka (klik teknisi).',
    why:'Teknisi site-2 mengukur langsung: kedua sel benar ber-self-discharge tinggi — indikasi micro-short dini, persis kata model. Modul dikarantina TERJADWAL (bukan darurat tengah malam!), klaim garansi vendor didukung data 30 hari yang rapi. Insiden termal berikutnya baru saja dibatalkan — 19 hari sebelum ia sempat punya nama.',
    fx(){toast('🔬 Terverifikasi: micro-short dini ×2 — karantina terjadwal, garansi cair!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Jutaan data yang dulu jadi arsip kini jadi peramal!</b> Disatukan, diuji ke masa lalu, dan alert pertamanya terbukti di lapangan. Baterai selalu berbisik sebelum sakit — sekarang ada yang mendengarkan, 24 jam, tanpa lelah.');
    setTimeout(()=>showWin('twin'),2200);});
  say('VOLTA di sini 🧠 Empat site, jutaan titik data BMS per hari — semuanya cuma jadi arsip. Pertanyaan menggodanya: insiden termal dulu… <b>apakah datanya sudah berbisik?</b> Bangun pendengarnya. Mulai dari menyatukan data!');
  $('#modTitle').textContent='J15·M8 — AI Battery Analytics';
  $('#taskHead').textContent='DENGARKAN BISIKAN SEL';}
MISSIONS.twin.build=buildTwin;
Object.assign(REAL,{
 twin:[
  'Backtest ke insiden nyata adalah gerbang go/no-go model — tanpa itu, alert hanyalah opini statistik',
  'Kelola false positive dgn target eksplisit — alert yang sering salah akan diabaikan saat benar',
  'Simpan data resolusi penuh insiden & anomali selamanya — bahan latih paling berharga',
  'Selaraskan alert AI dgn SOP eskalasi existing (triase-data-dulu) — jangan bikin jalur panik baru'],
});
