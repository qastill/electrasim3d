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
