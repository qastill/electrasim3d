/* =====================================================================
   ElectraSim VR 3D — SALES & TECHNICAL MARKETING
   Misi: M1 sales (Solusi Kapasitor Bank Pelanggan) · M2 survey (Site Survey & Proposal PLTS)
   Dimuat on-demand oleh index.html lewat ensureMission().
   ===================================================================== */

Object.assign(MISSIONS,{
 sales:{lvl:'JALUR 09 · SALES & TECHNICAL MARKETING',icon:'🤝',title:'Solusi Kapasitor Bank Pelanggan',strict:false,
  loc:'📍 PT Sinar Logam · Meeting room pelanggan',
  story:'PT Sinar Logam kena denda kVArh jutaan rupiah tiap bulan karena faktor daya buruk. Kamu technical sales engineer. Bedanya sales biasa dan sales engineer: kamu tidak menjual barang — kamu membaca tagihan, mengukur, menghitung, lalu menjual SOLUSI dengan angka yang tak terbantahkan.',
  goal:'Diagnosis masalah faktor daya dari data nyata, hitung kapasitas kapasitor yang tepat, dan tutup dengan proposal ber-ROI jelas.',
  obj:['Bedah tagihan: temukan komponen denda kVArh','Baca meter: cosφ aktual & beban','Hitung Q = P(tanφ1−tanφ2), pilih bank yang tepat, presentasikan ROI'],
  learn:['Denda kVArh muncul saat cosφ < 0,85 — beban induktif (motor, trafo) penyebabnya','Rumus emas: Q = P × (tanφ1 − tanφ2); 400 kW dari 0,78 → 0,95 butuh ±190 kVAr','Oversize kapasitor = leading & resonansi; undersize = denda tetap jalan','ROI dari penghapusan denda biasanya < 18 bulan — proposal yang menjual dirinya sendiri'],
  next:['Pelajari detuned reactor untuk jaringan berharmonisa','Susun template ROI calculator untuk prospekmu','Latih discovery call: bertanya sebelum menawarkan']},
 survey:{lvl:'JALUR 09 · SALES & TECHNICAL MARKETING · MISI 2',icon:'📐',title:'Site Survey & Proposal PLTS',strict:false,
  loc:'📍 PT Rasa Abadi (pabrik makanan) · Survey atap',
  story:'Lead baru: pabrik makanan bertagihan Rp 38 juta/bulan ingin tahu apakah PLTS atap masuk akal. Sales biasa langsung kirim brosur; kamu naik ke atap. Survey yang teliti hari ini = proposal yang tak terbantahkan minggu depan.',
  goal:'Data survey lengkap (tagihan, atap, beban siang) → sizing tepat → proposal ROI yang menutup deal.',
  obj:['Bedah tagihan & pola konsumsi pelanggan','Ukur area atap efektif & cek beban siang aktual','Sizing kWp, hitung produksi, presentasikan ROI'],
  learn:['PLTS atap paling ekonomis saat produksi siang TERSERAP beban sendiri, bukan diekspor','Area efektif ≠ luas atap: kurangi bayangan, jalur perawatan & arah hadap buruk','Rule of thumb Indonesia: 1 kWp ≈ 6–7 m² atap ≈ 1.300 kWh/tahun','ROI PLTS industri umumnya 4–6 tahun — selebihnya listrik "murah" 20+ tahun'],
  next:['Pelajari simulasi produksi dengan PVsyst/PVWatts','Dalami skema pembiayaan: capex vs leasing vs PPA','Latih handling objection: "bagaimana kalau mendung terus?"']},
});

/* =====================================================================
   MISI 13 — SALES KAPASITOR (Jalur 09)
   ===================================================================== */
let msa={};
function buildSales(){
  freshScene(0xc6d2dc,0x18222c);
  cam={theta:0,phi:1.2,r:6.5,target:new THREE.Vector3(0,1.5,-1)};
  const Z=room(0x6b5a45,0xd8d2c4);
  /* meja meeting */
  const desk=box(3.2,.08,1.4,0x6b4f33);desk.position.set(0,1.0,-.6);scene.add(desk);
  [[-1.4,-1.1],[1.4,-1.1],[-1.4,-.1],[1.4,-.1]].forEach(p=>{
    const l=box(.08,1,.08,0x4a3624);l.position.set(p[0],.5,p[1]+0.5);scene.add(l);});
  /* tagihan di meja */
  msa.bill=box(.5,.02,.7,0xf0ead8);msa.bill.position.set(-.9,1.06,-.6);scene.add(msa.bill);
  actMesh(msa.bill,'BILL');
  scene.add(label('TAGIHAN LISTRIK',.6,'#5fd4ff').translateX(-.9).translateY(1.35).translateZ(-.6));
  /* panel meter di dinding */
  const pm=box(1.0,1.0,.2,0x2d3a4a);pm.position.set(-3.2,2.2,Z);scene.add(pm);
  msa.D=makeDisplay(.8,.5,260,160);msa.D.mesh.position.set(-3.2,2.25,Z+.12);scene.add(msa.D.mesh);
  dispText(msa.D,['cosφ 0,78','400 kW · 513 kVA'],['#ff5a5a','#eaf2fb']);
  actMesh(msa.D.mesh,'METER'); actMesh(pm,'METER');
  scene.add(label('PANEL METER',.7,'#5fd4ff').translateX(-3.2).translateY(2.95).translateZ(Z));
  /* tiga opsi kapasitor bank */
  msa.opts=[];
  [['100 kVAr','OPT100',2.0],['200 kVAr','OPT200',3.2],['300 kVAr','OPT300',4.4]].forEach(o=>{
    const b=box(.85,1.3,.6,0x8a96a2);b.position.set(o[2],0.75,-2.2);scene.add(b);
    actMesh(b,o[1]);msa.opts.push(b);
    scene.add(label(o[0],.62).translateX(o[2]).translateY(1.7).translateZ(-2.2));});
  scene.add(label('PILIH BANK KAPASITOR',.75,'#ffd23f').translateX(3.2).translateY(2.2).translateZ(-2.2));
  /* papan proposal */
  msa.prop=box(.9,.65,.05,0xe8e4d8);msa.prop.position.set(.9,1.45,Z+.1);scene.add(msa.prop);
  actMesh(msa.prop,'PROP');
  scene.add(label('PROPOSAL',.6,'#5fd4ff').translateX(.9).translateY(1.95).translateZ(Z+.1));

  startSeq([
   {type:'act',aid:'BILL',done:false,targets:()=>[msa.bill],
    desc:'Bedah TAGIHAN pelanggan (klik tagihan di meja).',
    why:'Sales engineer membaca tagihan seperti dokter membaca lab: di sana tertulis denda kelebihan kVArh Rp 8,4 juta/bulan. Itulah "rasa sakit" yang akan kamu sembuhkan.',
    fx(){toast('🧾 Ditemukan: denda kVArh Rp 8,4 jt/bulan, 12 bulan beruntun.','info',2800);}},
   {type:'act',aid:'METER',done:false,targets:()=>[msa.D.mesh],
    desc:'Verifikasi di PANEL METER: cosφ & beban aktual.',
    why:'Jangan menjual dari asumsi. Meter menunjukkan cosφ 0,78 dengan beban 400 kW — beban induktif (motor-motor produksi) menyeret faktor daya ke bawah.',
    fx(){toast('📟 Terverifikasi: 400 kW · cosφ 0,78 · target ≥0,95.','info',2800);}},
   {type:'act',aid:'OPT200',done:false,targets:()=>[msa.opts[1]],
    desc:'Hitung: Q = P×(tanφ₁−tanφ₂) = 400×(0,802−0,329) ≈ 190 kVAr. Pilih bank yang tepat!',
    why:'400 kW dari cosφ 0,78 ke 0,95 butuh ±190 kVAr → bank 200 kVAr (12 step × ~16,7 kVAr) pas. 100 = denda jalan terus; 300 = overcompensation, leading & risiko resonansi.',
    fx(){toast('✅ 200 kVAr — perhitungan tepat, tidak over tidak under.','ok',2800);}},
   {type:'act',aid:'PROP',done:false,targets:()=>[msa.prop],
    desc:'Tutup dengan PROPOSAL ber-ROI (klik papan proposal).',
    why:'Proposal terbaik menghitung dirinya sendiri: investasi ±Rp 110 jt vs denda hilang Rp 8,4 jt/bln → payback ±13 bulan. Setelah itu? Penghematan murni bertahun-tahun.',
    fx(){toast('🤝 DEAL! Payback 13 bulan — pelanggan tanda tangan.','ok',3000);sfx.big();}},
  ],()=>{say('🎉 <b>Closing!</b> Kamu tidak menjual kapasitor — kamu menjual hilangnya denda Rp 100 juta setahun. Itulah technical selling: data → hitungan → solusi.');
    setTimeout(()=>showWin('sales'),2200);});

  say('VOLTA di sini 🤝 Hari ini kita bicara bahasa yang dipahami semua direktur: <b>uang</b>. Pelanggan kena denda kVArh tiap bulan. Baca datanya, hitung dengan rumus Q = P(tanφ₁−tanφ₂), dan biarkan angka yang menjual.');
  $('#modTitle').textContent='J09 — Solusi Kapasitor Bank';
  $('#taskHead').textContent='DATA → HITUNG → CLOSING';}

/* =====================================================================
   MISI 27 — SITE SURVEY PLTS (Jalur 09 · Misi 2)
   ===================================================================== */
let msv={};
function buildSurvey(){
  freshScene(0xcfe2f0,0x16242f);
  cam={theta:-.1,phi:1.12,r:9,target:new THREE.Vector3(0,2.2,-1)};
  const ground=boxT(20,.1,13,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  /* pabrik + atap luas */
  const fab=boxT(8,2.6,5,TEX.plaster());fab.position.set(-2.2,1.3,-2.6);scene.add(fab);
  fab.add(label('PT RASA ABADI',.95).translateY(1.75));
  msv.roof=box(8.4,.12,5.4,0x8a93a0,{roughness:.6});msv.roof.position.set(-2.2,2.72,-2.6);scene.add(msv.roof);
  actMesh(msv.roof,'ROOF');
  scene.add(label('ATAP — KLIK UNTUK MENGUKUR',.75,'#ffd23f').translateX(-2.2).translateY(3.4).translateZ(-2.6));
  /* AC & exhaust di atap (pengurang area) */
  const acu=box(.8,.5,.6,0xe8edf2);acu.position.set(-4.2,3.0,-3.4);scene.add(acu);
  const exh=cyl(.25,.3,.7,0x8a8a8a);exh.position.set(-.4,3.1,-1.6);scene.add(exh);
  /* meja: tagihan */
  const tbl=boxT(1.4,.07,.8,TEX.wood());tbl.position.set(3.4,.95,.8);scene.add(tbl);
  const tleg=boxT(.08,.95,.08,TEX.wood());tleg.position.set(3.4,.47,.8);scene.add(tleg);
  msv.bill=box(.5,.02,.7,0xf0ead8);msv.bill.position.set(3.4,1.0,.8);scene.add(msv.bill);
  actMesh(msv.bill,'BILL');
  scene.add(label('TAGIHAN 12 BULAN',.6,'#5fd4ff').translateX(3.4).translateY(1.35).translateZ(.8));
  /* panel meter */
  const pm=box(.8,.9,.2,0x2d3a4a);pm.position.set(2.6,1.6,-2.0);scene.add(pm);
  msv.D=makeDisplay(.7,.42,260,150);msv.D.mesh.position.set(2.6,1.65,-1.88);scene.add(msv.D.mesh);
  dispText(msv.D,['SIANG 14:00','beban 196 kW'],['#5fd4ff','#eaf2fb']);
  actMesh(msv.D.mesh,'METER'); actMesh(pm,'METER');
  scene.add(label('PANEL METER',.6,'#5fd4ff').translateX(2.6).translateY(2.25).translateZ(-2.0));
  /* kalkulator & proposal */
  msv.calc=box(.3,.05,.4,0x33404e);msv.calc.position.set(4.6,1.0,-.4);scene.add(msv.calc);
  actMesh(msv.calc,'CALC');
  scene.add(label('SIZING TOOL',.55,'#5fd4ff').translateX(4.6).translateY(1.3).translateZ(-.4));
  msv.prop=box(.8,.6,.05,0xe8e4d8);msv.prop.position.set(6.0,1.6,-1.6);scene.add(msv.prop);
  actMesh(msv.prop,'PROP');
  scene.add(label('PROPOSAL',.6,'#5fd4ff').translateX(6.0).translateY(2.1).translateZ(-1.6));

  startSeq([
   {type:'act',aid:'BILL',done:false,targets:()=>[msv.bill],
    desc:'Mulai dari data: bedah TAGIHAN 12 bulan (klik dokumen).',
    why:'Rp 38 jt/bln · 33.000 kWh · operasi 6 hari, shift siang dominan. Profil seperti ini sahabat PLTS: produksi panel & konsumsi pabrik sama-sama memuncak siang hari.',
    fx(){toast('🧾 Rata-rata 33.000 kWh/bln — beban siang dominan ✓','info',2800);}},
   {type:'act',aid:'ROOF',done:false,targets:()=>[msv.roof],
    desc:'Naik & ukur ATAP: hitung area efektif (klik atap).',
    why:'Atap bruto 900 m². Kurangi: AC & exhaust (60 m²), jalur perawatan (90 m²), tepi berbayang (150 m²) → efektif ±600 m². Survey jujur hari ini = tidak ada drama saat instalasi.',
    fx(){toast('📐 Area efektif: ±600 m² · azimuth bagus · struktur kuat ✓','ok',3000);}},
   {type:'act',aid:'METER',done:false,targets:()=>[msv.D.mesh],
    desc:'Verifikasi BEBAN SIANG aktual di panel meter.',
    why:'196 kW pada pukul 14:00 — jauh di atas calon produksi PLTS. Artinya seluruh produksi terserap sendiri (self-consumption 100%), skenario ekonomi terbaik PLTS atap.',
    fx(){toast('📟 Beban siang 180–210 kW — produksi PLTS pasti terserap.','ok',2800);}},
   {type:'act',aid:'CALC',done:false,targets:()=>[msv.calc],
    desc:'SIZING: hitung kapasitas optimal (klik sizing tool).',
    why:'600 m² ÷ 7 m²/kWp ≈ 85 kWp → ambil 84 kWp (modul bulat). Produksi ±110 MWh/tahun ≈ Rp 12,4 jt/bln penghematan — semua terserap karena beban siang 2× produksi.',
    fx(){toast('🧮 Sizing: 84 kWp · ±110 MWh/thn · hemat ±Rp 12,4 jt/bln.','ok',3200);}},
   {type:'act',aid:'PROP',done:false,targets:()=>[msv.prop],
    desc:'Tutup dengan PROPOSAL ber-ROI (klik proposal).',
    why:'Investasi ±Rp 840 jt vs hemat Rp 149 jt/tahun → payback ±5,6 tahun, lalu 20 tahun listrik nyaris gratis + cerita keberlanjutan untuk buyer mereka. Angka yang menjual dirinya sendiri.',
    fx(){toast('🤝 Payback 5,6 tahun — direktur minta jadwal instalasi!','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Deal dari data!</b> Tagihan → atap → beban → sizing → ROI. Survey teliti membuat proposalmu tak terbantahkan. Begitulah sales engineer bekerja.');
    setTimeout(()=>showWin('survey'),2200);});

  say('VOLTA di sini 📐 Lead PLTS baru! Aturan mainnya: <b>ukur dulu, janji belakangan</b>. Tagihan, atap, beban siang — tiga data itu menentukan apakah proposalmu ilmiah atau dongeng. Mulai dari tagihan.');
  $('#modTitle').textContent='J09·M2 — Site Survey & Proposal PLTS';
  $('#taskHead').textContent='UKUR DULU, JANJI BELAKANGAN';}

MISSIONS.sales.build=buildSales;
MISSIONS.survey.build=buildSurvey;

Object.assign(REAL,{
 sales:[
  'Validasi dengan data 12 bulan tagihan + pengukuran sendiri (power quality logger) sebelum sizing',
  'Jaringan dengan banyak VFD/rectifier butuh detuned reactor — kapasitor polos bisa resonansi',
  'Tawarkan kontrak kinerja: garansi cosφ tercapai, bukan sekadar garansi barang',
  'After-sales & monitoring = pintu masuk proyek berikutnya di pelanggan yang sama'],
 survey:[
  'Cek struktur atap dengan ahli sipil untuk beban tambahan panel (±15 kg/m²)',
  'Analisis bayangan sepanjang tahun (sun path), bukan hanya saat survey siang cerah',
  'Minta data interval konsumsi (AMR/AMI) bila ada — profil 15 menit jauh lebih akurat dari tagihan bulanan',
  'Sertakan asumsi degradasi panel (±0,5%/tahun) & biaya O&M dalam perhitungan ROI'],
});
