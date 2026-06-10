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

/* =====================================================================
   MISI 3 — MENJAWAB TENDER & COMPLIANCE
   ===================================================================== */
Object.assign(MISSIONS,{
 tender:{lvl:'JALUR 09 · SALES & TECHNICAL MARKETING · MISI 3',icon:'📑',title:'Menjawab Tender: Spesifikasi & Compliance',strict:false,
  loc:'📍 Kantor vendor · RFQ panel 20 kV, deadline 5 hari',
  story:'RFQ besar masuk: kawasan industri membutuhkan 8 unit kubikel 20 kV — nilai kontrak miliaran. Banyak vendor gugur bukan karena produknya kalah, tapi karena dokumennya: spek tak terjawab benar, deviasi disembunyikan, atau telat semenit dari deadline. Tender adalah ujian disiplin, bukan hanya harga.',
  goal:'Penawaran lengkap & jujur terkirim sebelum deadline: spek dibedah, deviasi diklarifikasi resmi, compliance sheet rapi.',
  obj:['Bedah dokumen RFQ & spesifikasi teknisnya','Temukan gap spek dan ajukan klarifikasi resmi','Susun compliance sheet & submit lengkap sebelum deadline'],
  learn:['Baca RFQ dua kali: syarat administrasi menggugurkan lebih banyak peserta daripada syarat teknis','Deviasi yang DIUNGKAP + alternatif setara masih bisa menang; deviasi yang disembunyikan = blacklist saat inspeksi','Klarifikasi resmi (aanwijzing) melindungi dua pihak: jawaban tertulis panitia mengikat semua peserta','Compliance sheet: comply / deviasi / alternatif per baris spek — auditor mencintai vendor yang rapi'],
  next:['Pelajari strategi harga: cost breakdown & komponen TKDN','Dalami kontrak: garansi, LD (liquidated damages), terms of payment','Latih presentasi klarifikasi teknis di hadapan panitia tender']},
});
let mtd={};
function buildTender(){
  freshScene(0xc6d2dc,0x18222c);
  cam={theta:0,phi:1.2,r:6.5,target:new THREE.Vector3(0,1.5,-1)};
  const Z=room(0x6b5a45,0xd8d2c4);
  /* meja kerja */
  const desk=boxT(3.4,.08,1.4,TEX.wood());desk.position.set(0,1.0,-.6);scene.add(desk);
  [[-1.5,-1.1],[1.5,-1.1],[-1.5,-.1],[1.5,-.1]].forEach(p=>{
    const l=boxT(.08,1,.08,TEX.wood());l.position.set(p[0],.5,p[1]+0.5);scene.add(l);});
  /* dokumen RFQ tebal */
  mtd.rfq=box(.55,.1,.75,0xe8e4d8);mtd.rfq.position.set(-1.1,1.1,-.6);scene.add(mtd.rfq);
  actMesh(mtd.rfq,'RFQ');
  scene.add(label('DOKUMEN RFQ (84 hal)',.6,'#5fd4ff').translateX(-1.1).translateY(1.45).translateZ(-.6));
  /* layar perbandingan spek */
  mtd.D=makeDisplay(2.6,1.5,520,300);
  mtd.D.mesh.position.set(-2.2,2.4,Z+.08);scene.add(mtd.D.mesh);
  actMesh(mtd.D.mesh,'SPEK');
  scene.add(label('TABEL SPEK: RFQ vs PRODUK',.7,'#5fd4ff').translateX(-2.2).translateY(3.3).translateZ(Z+.1));
  function tabel(hl){
    const g=mtd.D.g,W=520,H=300;
    g.fillStyle='#0c141d';g.fillRect(0,0,W,H);
    g.font='600 17px Consolas';g.textAlign='left';
    const rows=[['ITEM','RFQ','PRODUK',''],
      ['Tegangan','24 kV','24 kV','ok'],['Arus busbar','630 A','630 A','ok'],
      ['Breaking cap.','25 kA','25 kA','ok'],['IP rating','IP4X','IP3X','gap'],
      ['Interlock','mekanik','mekanik','ok']];
    rows.forEach((r,i)=>{
      const y=34+i*44;
      g.fillStyle=i===0?'#8aa3bd':(r[3]==='gap'?(hl?'#ffd23f':'#ff5a5a'):'#eaf2fb');
      g.fillText(r[0],14,y);g.fillText(r[1],210,y);g.fillText(r[2],330,y);
      if(i>0)g.fillText(r[3]==='gap'?(hl?'KLARIF':'✗'):'✓',460,y);});
    mtd.D.tex.needsUpdate=true;}
  tabel(false);
  /* surat klarifikasi + compliance + tombol submit */
  mtd.surat=box(.5,.66,.04,0xf0ead8);mtd.surat.position.set(1.2,2.2,Z+.06);scene.add(mtd.surat);
  actMesh(mtd.surat,'KLARIF');
  scene.add(label('SURAT KLARIFIKASI',.55,'#5fd4ff').translateX(1.2).translateY(2.75).translateZ(Z+.1));
  mtd.comp=box(.5,.66,.04,0xd8e8d8);mtd.comp.position.set(2.4,2.2,Z+.06);scene.add(mtd.comp);
  actMesh(mtd.comp,'COMPLY');
  scene.add(label('COMPLIANCE SHEET',.55,'#5fd4ff').translateX(2.4).translateY(2.75).translateZ(Z+.1));
  mtd.box=box(.7,.5,.5,0x8a6a3a);mtd.box.position.set(3.8,1.3,-.6);scene.add(mtd.box);
  actMesh(mtd.box,'SUBMIT');
  scene.add(label('PAKET PENAWARAN',.6,'#ffd23f').translateX(3.8).translateY(1.75).translateZ(-.6));
  startSeq([
   {type:'act',aid:'RFQ',done:false,targets:()=>[mtd.rfq],
    desc:'Bedah DOKUMEN RFQ halaman demi halaman (klik dokumen).',
    why:'84 halaman dan yang menggugurkan justru sering di bagian membosankan: syarat admin (SIUJK, pengalaman sejenis, dukungan pabrikan) & deadline 5 hari. Kalender mundur dibuat hari ini, bukan H-1.',
    fx(){toast('📑 Spek teknis hal. 31-47 · syarat admin lengkap · deadline H-5.','info',3000);}},
   {type:'act',aid:'SPEK',done:false,targets:()=>[mtd.D.mesh],
    desc:'Bandingkan spek RFQ vs produkmu — temukan GAP (klik tabel).',
    why:'Empat baris hijau, satu merah: RFQ minta IP4X, produk standar IP3X. Vendor amatir pura-pura tidak lihat. Vendor profesional tahu: gap yang ditemukan H-5 adalah peluang, gap yang ditemukan saat inspeksi pabrik adalah bencana.',
    fx(){toast('⚠️ GAP ditemukan: IP rating IP3X vs permintaan IP4X.','bad',2800);}},
   {type:'act',aid:'KLARIF',done:false,targets:()=>[mtd.surat],
    desc:'Ajukan KLARIFIKASI resmi ke panitia (klik surat).',
    why:'Surat resmi: "Apakah IP3X + pintu berkunci dapat diterima, mengingat ruangan panel indoor terkunci?" Jawaban panitia tertulis & mengikat semua peserta. Bertanya itu gratis; berasumsi harganya satu kontrak.',
    fx(){toast('✉️ Jawaban panitia: IP3X DITERIMA untuk ruang indoor terkunci ✓','ok',3000);}},
   {type:'act',aid:'COMPLY',done:false,targets:()=>[mtd.comp],
    desc:'Susun COMPLIANCE SHEET baris per baris (klik lembar hijau).',
    why:'Tiap baris spek dijawab: comply / comply dengan catatan / deviasi + alternatif. Baris IP dilampiri jawaban klarifikasi resmi. Evaluator menilai puluhan penawaran — yang rapi dibaca lebih dulu dan dipercaya lebih cepat.',
    fx(){tabel(true);toast('📋 47 baris: 46 comply + 1 klarifikasi terlampir.','ok',2800);}},
   {type:'act',aid:'SUBMIT',done:false,targets:()=>[mtd.box],
    desc:'Finalkan & SUBMIT paket penawaran (klik paket).',
    why:'Checklist akhir: admin ✓ teknis ✓ harga ✓ tanda tangan ✓ — submit H-1, bukan menit terakhir (sistem e-proc punya kebiasaan tumbang di detik akhir). Sisanya milik evaluasi: kamu sudah memberi dirimu peluang terbaik.',
    fx(){toast('📦 TERKIRIM H-1, lengkap & jujur. Menunggu pengumuman!','ok',3000);sfx.big();}},
  ],()=>{say('🎉 <b>Penawaran profesional terkirim!</b> Spek dibedah, gap diklarifikasi (bukan disembunyikan), dokumen rapi, submit tak menunggu detik akhir. Menang-kalah urusan nanti — reputasi sudah menang duluan.');
    setTimeout(()=>showWin('tender'),2200);});
  say('VOLTA di sini 📑 Tender miliaran di meja. Dengar rahasianya: <b>kebanyakan vendor gugur oleh dokumennya sendiri</b>, bukan produknya. Teliti, jujur soal deviasi, dan jangan pernah berkencan dengan deadline. Mulai dari RFQ.');
  $('#modTitle').textContent='J09·M3 — Menjawab Tender';
  $('#taskHead').textContent='TELITI · KLARIFIKASI · LENGKAP';}
MISSIONS.tender.build=buildTender;
Object.assign(REAL,{
 tender:[
  'Buat checklist dokumen dari halaman syarat RFQ & centang fisik — gugur admin itu menyakitkan',
  'Semua komunikasi dengan panitia lewat jalur resmi tertulis; jawaban lisan tidak mengikat',
  'Arsipkan jawaban klarifikasi/aanwijzing — itu bagian sah dari kontrak bila menang',
  'Hitung harga dari cost breakdown nyata + risiko (kurs, delivery) — menang rugi lebih buruk dari kalah'],
});

/* =====================================================================
   MISI 4 — NEGOSIASI & OBJECTION HANDLING
   ===================================================================== */
Object.assign(MISSIONS,{
 nego:{lvl:'JALUR 09 · SALES & TECHNICAL MARKETING · MISI 4',icon:'🗣️',title:'Negosiasi & Objection Handling',strict:false,
  loc:'📍 PT Sinar Logam · Meeting final, direktur hadir',
  story:'Proposal kapasitor bank-mu (misi 1) sampai di meja final — tapi kali ini direktur keuangan ikut duduk, dan ia datang membawa tiga peluru: "kemahalan", "kompetitor lebih murah 30%", dan "tahun depan saja". Sales amatir menurunkan harga saat ditembak; sales engineer menjawab dengan struktur: dengar, akui, jawab dengan angka, konfirmasi.',
  goal:'Tiga keberatan terjawab dengan data tanpa banting harga, dan kesepakatan ditutup dengan syarat yang sehat untuk dua pihak.',
  obj:['Tangani keberatan harga dengan TCO, bukan diskon','Bedah penawaran kompetitor secara objektif','Hitung biaya menunda, lalu tutup kesepakatan'],
  learn:['Keberatan adalah sinyal minat: orang yang tak tertarik tidak repot-repot keberatan — sambut, jangan bertahan','Jawaban harga selalu TCO (total cost of ownership): harga beli + rugi + umur + garansi, bukan angka di kolom paling bawah','Membandingkan kompetitor: jangan menjelekkan — bedah spesifikasi berdampingan & biarkan selisihnya bicara','Biaya MENUNDA adalah angka nyata: denda berjalan tiap bulan adalah diskon yang dibuang'],
  next:['Pelajari teknik klarifikasi keberatan (isolate the objection)','Susun battle card produk vs kompetitor untuk timmu','Latih negosiasi syarat: termin, garansi, retensi — bukan hanya harga']},
});
let mng={};
function buildNego(){
  freshScene(0xc6d2dc,0x18222c);
  cam={theta:0,phi:1.2,r:6.5,target:new THREE.Vector3(0,1.5,-1)};
  const Z=room(0x6b5a45,0xd8d2c4);
  /* meja meeting panjang */
  const desk=boxT(4.2,.08,1.6,TEX.wood());desk.position.set(0,1.0,-.5);scene.add(desk);
  [[-1.9,-1.15],[1.9,-1.15],[-1.9,.15],[1.9,.15]].forEach(p=>{
    const l=boxT(.08,1,.08,TEX.wood());l.position.set(p[0],.5,p[1]+0.35);scene.add(l);});
  /* layar keberatan (dialog) */
  const frame=boxT(4.0,2.2,.16,TEX.metal(),{metalness:.4});frame.position.set(-1.4,2.5,Z+.05);scene.add(frame);
  mng.D=makeDisplay(3.7,1.9,560,300);
  mng.D.mesh.position.set(-1.4,2.5,Z+.15);scene.add(mng.D.mesh);
  actMesh(mng.D.mesh,'DENGAR');
  scene.add(label('RUANG MEETING — DIREKTUR KEUANGAN',.8).translateX(-1.4).translateY(3.85).translateZ(Z+.1));
  function dialog(t1,t2,warna){dispText(mng.D,[t1,t2||''],[warna||'#ff8d8d','#eaf2fb']);}
  dialog('"Proposalmu KEMAHALAN."','— Direktur Keuangan');
  /* tiga kartu jawaban */
  mng.tco=box(.95,.65,.07,0x2a5a8a);mng.tco.position.set(2.2,2.9,Z+.08);scene.add(mng.tco);
  actMesh(mng.tco,'TCO');
  scene.add(label('KARTU TCO',.55,'#9cc4ff').translateX(2.2).translateY(3.45).translateZ(Z+.1));
  mng.comp=box(.95,.65,.07,0x5a8a2a);mng.comp.position.set(3.4,2.9,Z+.08);scene.add(mng.comp);
  actMesh(mng.comp,'BANDING');
  scene.add(label('TABEL BANDING',.55,'#b8e890').translateX(3.4).translateY(3.45).translateZ(Z+.1));
  mng.delay=box(.95,.65,.07,0x8a5a2a);mng.delay.position.set(2.2,1.9,Z+.08);scene.add(mng.delay);
  actMesh(mng.delay,'TUNDA');
  scene.add(label('BIAYA MENUNDA',.55,'#e8c890').translateX(2.2).translateY(1.45).translateZ(Z+.1));
  /* dokumen kontrak */
  mng.deal=box(.5,.02,.7,0xf0ead8);mng.deal.position.set(.9,1.06,-.5);scene.add(mng.deal);
  actMesh(mng.deal,'DEAL');
  scene.add(label('KONTRAK',.55,'#ffd23f').translateX(.9).translateY(1.4).translateZ(-.5));
  startSeq([
   {type:'act',aid:'DENGAR',done:false,targets:()=>[mng.D.mesh],
    desc:'Keberatan #1 meluncur: "KEMAHALAN." — dengarkan utuh dulu (klik layar).',
    why:'Jangan menyela, jangan langsung membela. "Saya paham, Pak — boleh tahu dibandingkan dengan apa?" Klarifikasi membuka isi sebenarnya: ternyata dibanding penawaran kompetitor & anggaran tahun berjalan. Dua keberatan berbeda — dan keduanya bisa dijawab.',
    fx(){dialog('"Mahal dibanding kompetitor','& anggaran tahun ini," — oke, jelas.','#ffd23f');
      toast('👂 Keberatan diklarifikasi — bukan satu, tapi dua isu. Bagus.','ok',3000);}},
   {type:'act',aid:'TCO',done:false,targets:()=>[mng.tco],
    desc:'Jawab dengan KARTU TCO — bukan diskon (klik kartu biru).',
    why:'"Harga kami Rp 110 jt; denda yang hilang Rp 8,4 jt/bulan — sistem ini MEMBAYAR dirinya 13 bulan, lalu menghasilkan Rp 100 jt/tahun selama 10+ tahun umur kapasitor. Pertanyaannya bukan berapa harganya, tapi berapa biayanya bila TIDAK dipasang." Harga turun merusak nilai; TCO menaikkan pemahaman.',
    fx(){dialog('TCO 10 thn: +Rp 890 jt NET','vs tanpa pasang: −Rp 1 M denda','#46ff8e');
      toast('🧮 Direktur mengangguk pelan — bahasa ROI dipahami.','ok',3200);}},
   {type:'act',aid:'BANDING',done:false,targets:()=>[mng.comp],
    desc:'Keberatan #2: "kompetitor 30% lebih murah" — buka TABEL BANDING.',
    why:'Berdampingan tanpa menjelekkan: penawaran murah itu kapasitor polos TANPA detuned reactor — di pabrik penuh VFD ini, resonansi harmonisa bisa meledakkan kapasitor polos dalam setahun. Plus: garansi 1 vs 3 tahun, tanpa kontrak kinerja cosφ. "Murahnya di awal, mahalnya menyusul."',
    fx(){dialog('Banding: reactor ✓vs✗ · garansi 3vs1','kontrak kinerja cosφ ✓vs✗','#46ff8e');
      toast('📊 Selisih 30% kini punya penjelasan teknis yang jujur.','ok',3200);}},
   {type:'act',aid:'TUNDA',done:false,targets:()=>[mng.delay],
    desc:'Keberatan #3: "tahun depan saja" — tunjukkan BIAYA MENUNDA.',
    why:'"Tentu bisa, Pak. Namun denda berjalan terus: menunda 12 bulan = Rp 100 jt melayang — hampir seharga sistemnya. Bila anggaran tahun ini ketat, kami siap termin 3 pembayaran mengikuti penghematan yang masuk." Penundaan diberi harga; jalan keluar diberi pintu.',
    fx(){dialog('Menunda 12 bln = −Rp 100 jt','solusi: termin 3x dari penghematan','#46ff8e');
      toast('⏳ "Termin dari penghematan?" — direktur mencondongkan badan.','ok',3200);}},
   {type:'act',aid:'DEAL',done:false,targets:()=>[mng.deal],
    desc:'Momen menutup: konfirmasi & sodorkan KONTRAK (klik dokumen).',
    why:'"Jadi bila termin disetujui dan kinerja cosφ kami garansi tertulis — apakah ada hal lain yang menahan Bapak?" Hening dua detik. "Tidak ada. Siapkan kontraknya." Ditutup TANPA satu rupiah pun diskon: nilai dipertahankan, hubungan dimulai sehat.',
    fx(){toast('🤝 DEAL — harga utuh, termin sehat, garansi kinerja. Tanda tangan!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Closing tanpa banting harga!</b> Dengar → klarifikasi → jawab dengan angka → beri jalan keluar → konfirmasi. Tiga peluru dijawab tiga kartu — dan nilai produkmu pulang dengan utuh.');
    setTimeout(()=>showWin('nego'),2200);});
  say('VOLTA di sini 🗣️ Meeting final — direktur keuangan membawa tiga keberatan klasik. Ingat strukturnya: <b>dengar utuh, klarifikasi, jawab dengan angka, jangan pernah panik-diskon</b>. Mulai dari mendengarkan.');
  $('#modTitle').textContent='J09·M4 — Negosiasi & Objection';
  $('#taskHead').textContent='DENGAR · ANGKA · TUTUP';}
MISSIONS.nego.build=buildNego;
Object.assign(REAL,{
 nego:[
  'Siapkan battle card sebelum meeting: TCO, tabel banding, biaya menunda — amunisi disiapkan, bukan diimprovisasi',
  'Jangan pernah menjelekkan kompetitor dengan opini — hanya fakta spesifikasi yang bisa diverifikasi',
  'Diskon (bila terpaksa) selalu ditukar konsesi: volume, termin lebih cepat, atau referensi — tidak pernah gratis',
  'Tulis semua kesepakatan verbal ke dalam kontrak hari itu juga — ingatan meeting memudar, dokumen tidak'],
});

/* =====================================================================
   MISI 5 — SITE ACCEPTANCE TEST & SERAH TERIMA
   ===================================================================== */
Object.assign(MISSIONS,{
 sat:{lvl:'JALUR 09 · SALES & TECHNICAL MARKETING · MISI 5',icon:'✅',title:'Site Acceptance Test & Serah Terima',strict:false,
  loc:'📍 PT Sinar Logam · Kapasitor bank terpasang, hari SAT',
  story:'Kontrak yang kamu menangkan lewat negosiasi alot kini terpasang di panel pelanggan — tapi penjualan belum selesai sampai pelanggan MENANDATANGANI bahwa semuanya bekerja. Hari ini SAT: site acceptance test, disaksikan direktur yang dulu hampir memilih kompetitor. Sales engineer sejati tahu: serah terima yang rapi adalah proposal untuk proyek berikutnya.',
  goal:'SAT lulus disaksikan pelanggan: cosφ terbukti naik sesuai garansi kontrak, punch list dituntaskan, BAST ditandatangani — dan pintu proyek berikutnya terbuka.',
  obj:['Jalankan uji kinerja sesuai protokol SAT','Selesaikan punch list temuan kecil','Serah terima: dokumen, training, BAST'],
  learn:['SAT menguji di kondisi NYATA pelanggan (beban asli, jam asli) — FAT di pabrik vendor belum membuktikan apa-apa di lapangan','Protokol uji disepakati SEBELUM hari-H: parameter, alat ukur, kriteria lulus — SAT tanpa kriteria tertulis berakhir debat','Punch list bukan aib: temuan kecil yang dicatat & dituntaskan justru membangun percaya — yang merusak adalah temuan yang disembunyikan','BAST memindahkan kepemilikan & memulai garansi: tanggalnya menentukan hak dua pihak — dokumen kecil berdampak hukum besar'],
  next:['Susun template protokol SAT untuk tiap lini produk','Pelajari masa garansi & SLA respon gangguan sebagai nilai jual','Bangun program QBR (quarterly business review) pasca-serah terima']},
});
let mss={};
function buildSAT(){
  freshScene(0xc6d2dc,0x18222c);
  cam={theta:.05,phi:1.18,r:7,target:new THREE.Vector3(0,1.6,-.8)};
  const Z=room(0x6b5a45,0xd8d2c4);
  /* kapasitor bank terpasang */
  const bank=boxT(1.6,2.0,.8,TEX.metal(),{metalness:.35});bank.position.set(-3.6,1.1,-1.8);scene.add(bank);
  bank.add(label('KAPASITOR BANK 200 kVAr',.65).translateY(1.25));
  const steps=[];for(let i=0;i<3;i++){const s=box(.35,.5,.2,0x8a96a2);
    s.position.set(-4.0+i*.4,1.0,-1.36);scene.add(s);}
  /* panel meter cosφ */
  mss.D=makeDisplay(1.6,1.0,360,220);
  mss.D.mesh.position.set(-1.2,2.2,Z+.08);scene.add(mss.D.mesh);
  dispText(mss.D,['cosφ 0,78','bank OFF — baseline'],['#ff5a5a','#8aa3bd']);
  actMesh(mss.D.mesh,'UJI');
  scene.add(label('METER — DISAKSIKAN DIREKTUR',.7,'#5fd4ff').translateX(-1.2).translateY(2.95).translateZ(Z+.1));
  /* protokol di meja */
  const desk=boxT(2.6,.08,1.2,TEX.wood());desk.position.set(1.6,1.0,-.4);scene.add(desk);
  [[-1.1,-.9],[1.1,-.9],[-1.1,.1],[1.1,.1]].forEach(p=>{
    const l=boxT(.08,1,.08,TEX.wood());l.position.set(1.6+p[0],.5,p[1]-.4+.45);scene.add(l);});
  mss.prot=box(.5,.02,.7,0xf0ead8);mss.prot.position.set(1.0,1.06,-.4);scene.add(mss.prot);
  actMesh(mss.prot,'PROTOKOL');
  scene.add(label('PROTOKOL SAT',.55,'#5fd4ff').translateX(1.0).translateY(1.4).translateZ(-.4));
  /* punch list */
  mss.punch=box(.5,.66,.04,0xffe8c0);mss.punch.position.set(2.4,2.2,Z+.06);scene.add(mss.punch);
  actMesh(mss.punch,'PUNCH');
  scene.add(label('PUNCH LIST',.55,'#ffd23f').translateX(2.4).translateY(2.75).translateZ(Z+.1));
  /* map dokumen + BAST */
  mss.map=box(.6,.1,.8,0x2a5a8a);mss.map.position.set(2.2,1.1,-.4);scene.add(mss.map);
  actMesh(mss.map,'DOKUMEN');
  scene.add(label('PAKET DOKUMEN',.55,'#9cc4ff').translateX(2.3).translateY(1.45).translateZ(-.4));
  mss.bast=box(.5,.66,.04,0xe8d8a0);mss.bast.position.set(4.4,2.2,Z+.06);scene.add(mss.bast);
  actMesh(mss.bast,'BAST');
  scene.add(label('BAST',.6,'#ffd23f').translateX(4.4).translateY(2.7).translateZ(Z+.1));
  startSeq([
   {type:'act',aid:'PROTOKOL',done:false,targets:()=>[mss.prot],
    desc:'Buka PROTOKOL SAT yang disepakati: apa kriteria lulusnya? (klik dokumen)',
    why:'Hitam di atas putih sejak kontrak: cosφ rata-rata ≥ 0,95 pada beban produksi normal, diukur power analyzer terkalibrasi milik netral, durasi 2 jam. Tanpa kriteria tertulis, SAT berubah jadi debat selera — dengan kriteria, ia hanya soal angka.',
    fx(){toast('📋 Kriteria jelas: cosφ ≥ 0,95 · 2 jam · alat terkalibrasi.','ok',2800);}},
   {type:'act',aid:'UJI',done:false,targets:()=>[mss.D.mesh],
    desc:'Jalankan UJI: bank ON, beban produksi nyata, direktur menonton (klik meter).',
    why:'Baseline 0,78 tercatat... bank ON: step kontaktor masuk satu per satu mengikuti beban — cosφ merangkak 0,86... 0,93... 0,96 ✓. Dua jam di beban asli pabrik: rata-rata 0,958. Angka yang dulu kamu janjikan di ruang meeting kini menyala di depan mata orang yang membayarnya.',
    fx(){dispText(mss.D,['cosφ 0,96 ✓','rata2 2 jam: 0,958'],['#46ff8e','#46ff8e']);
      toast('📈 0,78 → 0,958 — MELAMPAUI garansi kontrak!','ok',3200);}},
   {type:'act',aid:'PUNCH',done:false,targets:()=>[mss.punch],
    desc:'Catat & tuntaskan PUNCH LIST temuan kecil (klik daftar).',
    why:'Tiga temuan kecil dicatat TERBUKA: label step 3 belum terpasang, satu baut pintu panel longgar, manual book belum diserahkan. Dituntaskan hari itu juga di depan pelanggan. Vendor yang mencatat kekurangannya sendiri lebih dipercaya daripada yang mengaku sempurna.',
    fx(){toast('🔧 3 item punch list — tuntas hari ini juga ✓','ok',2800);}},
   {type:'act',aid:'DOKUMEN',done:false,targets:()=>[mss.map],
    desc:'Serahkan PAKET DOKUMEN + training singkat operator (klik map).',
    why:'As-built drawing, manual, sertifikat komponen, hasil uji, kartu garansi 3 tahun, jadwal pemeliharaan — plus 30 menit melatih dua operator pelanggan membaca panel & merespons alarm. Sistem yang diserahkan tanpa ilmu pengoperasiannya adalah bom waktu komplain.',
    fx(){toast('📚 Dokumen lengkap + 2 operator terlatih.','ok',2800);}},
   {type:'act',aid:'BAST',done:false,targets:()=>[mss.bast],
    desc:'Puncaknya: tanda tangan BAST (klik dokumen kuning).',
    why:'Direktur menandatangani: kepemilikan berpindah, garansi resmi berjalan. Lalu kalimat yang ditunggu setiap sales engineer: "Pabrik kami yang di Cirebon... bisa disurvei bulan depan?" SAT yang rapi memang bukan akhir penjualan — ia pembuka penjualan berikutnya.',
    fx(){toast('🤝 BAST DITANDATANGANI + undangan survei pabrik ke-2!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Serah terima sempurna — dan proyek baru menghampiri sendiri!</b> Kriteria jelas, bukti di depan mata, kekurangan diakui & dituntaskan, ilmu ikut diserahkan. Begitulah penjualan kedua dimenangkan: di hari serah terima penjualan pertama.');
    setTimeout(()=>showWin('sat'),2200);});
  say('VOLTA di sini ✅ Kontrak yang kamu menangkan kini harus DIBUKTIKAN: hari SAT, disaksikan direktur. Ingat: penjualan belum selesai sampai BAST ditandatangani — dan serah terima terbaik adalah proposal diam-diam untuk proyek berikutnya.');
  $('#modTitle').textContent='J09·M5 — SAT & Serah Terima';
  $('#taskHead').textContent='BUKTIKAN · TUNTASKAN · SERAHKAN';}
MISSIONS.sat.build=buildSAT;
Object.assign(REAL,{
 sat:[
  'Protokol SAT & kriteria lulus dilampirkan di kontrak — bukan disusun mendadak di lokasi',
  'Alat ukur SAT disepakati & sertifikat kalibrasinya ditunjukkan sebelum uji dimulai',
  'Punch list diberi tenggat & penanggung jawab tertulis; BAST bisa bersyarat bila ada item tersisa',
  'Arsipkan seluruh paket SAT — sengketa garansi dimenangkan oleh dokumentasi, bukan ingatan'],
});

/* =====================================================================
   MISI 6 — KEY ACCOUNT & QUARTERLY BUSINESS REVIEW
   ===================================================================== */
Object.assign(MISSIONS,{
 qbr:{lvl:'JALUR 09 · SALES & TECHNICAL MARKETING · MISI 6',icon:'📅',title:'Key Account: Quarterly Business Review',strict:false,
  loc:'📍 PT Sinar Logam · QBR kuartal pertama pasca-instalasi',
  story:'Tiga bulan sejak BAST — dan inilah perbedaan vendor biasa dengan partner: vendor biasa kembali saat ada yang rusak; partner kembali MEMBAWA DATA. QBR pertamamu dengan PT Sinar Logam: bukan kunjungan basa-basi, melainkan rapat berstruktur yang membuktikan nilai, menangkap masalah dini, dan — bila dikerjakan benar — memanen proyek berikutnya.',
  goal:'QBR pertama sukses: kinerja terpasang dilaporkan dengan data, isu kecil ditangkap sebelum membesar, dan dua peluang baru teridentifikasi bersama pelanggan.',
  obj:['Siapkan data kinerja kuartal & agenda','Laporkan nilai yang terealisasi + tangkap isu dini','Gali kebutuhan berikutnya & susun rencana bersama'],
  learn:['QBR adalah ritual partnership: datang berkala MEMBAWA data, bukan menunggu komplain — kursi vendor berubah jadi kursi penasihat','Buka selalu dengan nilai terealisasi vs janji: cosφ, denda hilang, uptime — angka yang dulu di proposal kini di realisasi','Isu kecil yang ditangkap di QBR (step kapasitor sering switching) adalah komplain besar yang dibatalkan tiga bulan lebih awal','Pertanyaan terbaik QBR bukan "ada keluhan?" tapi "apa rencana pabrik 12 bulan ke depan?" — proyek berikutnya bersembunyi di jawaban itu'],
  next:['Susun kalender QBR semua key account + template materi','Pelajari account plan: peta organisasi & roadmap 3 tahun pelanggan','Dalami metrik kesehatan akun: NPS, share of wallet, churn risk']},
});
let mqb={};
function buildQBR(){
  freshScene(0xc6d2dc,0x18222c);
  cam={theta:0,phi:1.18,r:7,target:new THREE.Vector3(0,1.5,-.8)};
  const Z=room(0x6b5a45,0xd8d2c4);
  /* meja QBR */
  const desk=boxT(3.6,.08,1.5,TEX.wood());desk.position.set(0,1.0,-.4);scene.add(desk);
  [[-1.6,-1.0],[1.6,-1.0],[-1.6,.1],[1.6,.1]].forEach(p=>{
    const l=boxT(.08,1,.08,TEX.wood());l.position.set(p[0],.5,p[1]-.4+.4);scene.add(l);});
  /* layar kinerja */
  const frame=boxT(3.8,2.2,.16,TEX.metal(),{metalness:.4});frame.position.set(-1.8,2.5,Z+.05);scene.add(frame);
  frame.add(label('QBR Q1 — KINERJA TERPASANG',.8).translateY(1.35));
  mqb.D=makeDisplay(3.5,1.9,540,310);
  mqb.D.mesh.position.set(-1.8,2.5,Z+.15);scene.add(mqb.D.mesh);
  actMesh(mqb.D.mesh,'DATA');
  function layar(mode){
    const g=mqb.D.g,W=540,H=310;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='700 18px Consolas';g.textAlign='left';
    g.fillStyle='#5fd4ff';g.fillText('REALISASI vs JANJI PROPOSAL',16,32);
    g.font='600 16px Consolas';
    const rows=[['cosφ rata-rata','0,958','janji ≥0,95','#46ff8e'],
      ['denda kVArh','Rp 0','3 bln beruntun','#46ff8e'],
      ['uptime bank','99,7%','—','#46ff8e'],
      ['switching/hari','142x','agak tinggi ⚠','#ffd23f']];
    rows.forEach((r,i)=>{const y=76+i*42;
      g.fillStyle='#8aa3bd';g.fillText(r[0],16,y);
      g.fillStyle=r[3];g.fillText(r[1],240,y);
      g.fillStyle='#5d748c';g.fillText(r[2],360,y);});
    if(mode>=1){g.fillStyle='#ffd23f';g.font='700 15px Consolas';
      g.fillText('isu dini: step 3 switching berlebih → cek setting C/K',16,H-18);}
    mqb.D.tex.needsUpdate=true;}
  layar(0);
  /* direktur & manajer produksi */
  function figur(x,warna,nama){
    const grp=new THREE.Group();
    const badan=cyl(.22,.28,.9,warna);badan.position.y=.72;grp.add(badan);
    const kepala=new THREE.Mesh(new THREE.SphereGeometry(.15,14,12),
      new THREE.MeshStandardMaterial({color:0xd8b090}));kepala.position.y=1.36;grp.add(kepala);
    grp.position.set(x,0,.9);scene.add(grp);
    scene.add(label(nama,.55).translateX(x).translateY(1.85).translateZ(.9));
    return grp;}
  mqb.dir=figur(-1.2,0x2a3a55,'DIREKTUR');
  mqb.prod=figur(1.2,0x4a6a3a,'MGR PRODUKSI');
  actMesh(mqb.prod.children[0],'GALI');
  /* lembar isu & rencana bersama */
  mqb.isu=box(.5,.66,.04,0xffe8c0);mqb.isu.position.set(1.6,2.3,Z+.06);scene.add(mqb.isu);
  actMesh(mqb.isu,'ISU');
  scene.add(label('LEMBAR ISU',.55,'#ffd23f').translateX(1.6).translateY(2.85).translateZ(Z+.1));
  mqb.plan=box(.5,.66,.04,0xd8e8d8);mqb.plan.position.set(3.0,2.3,Z+.06);scene.add(mqb.plan);
  actMesh(mqb.plan,'PLAN');
  scene.add(label('RENCANA BERSAMA',.55,'#8df0b8').translateX(3.0).translateY(2.85).translateZ(Z+.1));
  startSeq([
   {type:'act',aid:'DATA',done:false,targets:()=>[mqb.D.mesh],
    desc:'Buka QBR dengan DATA: realisasi vs janji proposal (klik layar).',
    why:'Slide pertama bukan produk baru — melainkan janji lama yang ditagih sendiri: cosφ 0,958 (janji ≥0,95 ✓), denda kVArh NOL tiga bulan beruntun, uptime 99,7%. Direktur melirik direktur keuangan: angka proposal itu ternyata bukan bualan sales. Kepercayaan = mata uang QBR.',
    fx(){toast('📊 Janji ditagih sendiri: semua KPI hijau — meja mencair.','ok',3000);}},
   {type:'act',aid:'ISU',done:false,targets:()=>[mqb.isu],
    desc:'Jujur duluan: angkat ISU DINI yang kamu temukan (klik lembar isu).',
    why:'Baris kuning itu kamu yang membukanya: step 3 switching 142×/hari — terlalu sering, kontaktornya bisa pendek umur. Penyebab: setting C/K terlalu sensitif; dikoreksi gratis minggu ini. Vendor yang melaporkan masalahnya SENDIRI sebelum pelanggan sadar — itu definisi partner.',
    fx(){layar(1);toast('🔍 Isu diangkat & dijadwalkan koreksi — sebelum jadi komplain.','ok',3000);}},
   {type:'act',aid:'GALI',done:false,targets:()=>[mqb.prod.children[0]],
    desc:'GALI rencana pelanggan: tanya manajer produksi (klik beliau).',
    why:'"Apa rencana pabrik 12 bulan ke depan?" — dan pintu terbuka: line baru kuartal 3 (butuh studi beban + kemungkinan trafo), dan keluhan harmonisa di area CNC. Dua peluang muncul bukan dari brosur — dari pertanyaan yang tepat di kursi yang sudah dipercaya.',
    fx(){toast('🎣 Tertangkap: line baru Q3 + isu harmonisa CNC — dua peluang!','ok',3200);}},
   {type:'act',aid:'PLAN',done:false,targets:()=>[mqb.plan],
    desc:'Tutup dengan RENCANA BERSAMA ber-tanggal (klik lembar hijau).',
    why:'Bukan "nanti kami hubungi": koreksi C/K (minggu ini, gratis) · audit harmonisa CNC (bulan depan, proposal menyusul) · studi beban line baru (Juli) · QBR berikutnya (tanggal terkunci). Empat baris, empat tanggal — akun ini kini punya masa depan yang terjadwal.',
    fx(){toast('🗓️ 4 agenda ber-tanggal — QBR Q2 sudah dinanti pelanggan!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>QBR pertama, standar baru!</b> Janji ditagih sendiri, isu diangkat sebelum dikomplain, peluang digali dari rencana pelanggan. Penjualan terbaik memang tak terasa seperti penjualan — ia terasa seperti kemitraan.');
    setTimeout(()=>showWin('qbr'),2200);});
  say('VOLTA di sini 📅 Tiga bulan pasca-BAST — saatnya <b>QBR</b>: rapat yang membedakan vendor dari partner. Bawa data, jujur soal isu, dan dengarkan rencana mereka. Proyek berikutnya bersembunyi di sana.');
  $('#modTitle').textContent='J09·M6 — Key Account & QBR';
  $('#taskHead').textContent='DATANG MEMBAWA DATA';}
MISSIONS.qbr.build=buildQBR;
Object.assign(REAL,{
 qbr:[
  'Kirim materi QBR H-2 agar pelanggan datang siap — rapat untuk memutuskan, bukan membaca',
  'Undang lapisan operasional DAN pengambil keputusan — dua telinga yang berbeda kebutuhannya',
  'Catat semua komitmen dua arah dengan PIC & tanggal, kirim notulen hari yang sama',
  'Ukur kesehatan akun dari QBR ke QBR (isu turun? peluang naik?) — tren akun = tren bisnismu'],
});

/* =====================================================================
   MISI 7 — MEMBANGUN JARINGAN DISTRIBUTOR
   ===================================================================== */
Object.assign(MISSIONS,{
 mitra:{lvl:'JALUR 09 · SALES & TECHNICAL MARKETING · MISI 7',icon:'🌐',title:'Membangun Jaringan Distributor',strict:false,
  loc:'📍 Kantor regional · Ekspansi: 3 kota tanpa kehadiran',
  story:'Penjualan langsungmu mentok di geografi: Cirebon, Tegal, Pekalongan penuh pabrik — tapi tak ada kakimu di sana. Merekrut sales di tiap kota? Mahal & lambat. Jalan para juara: DISTRIBUTOR — bermitra dengan pemain lokal yang sudah punya gudang, relasi, dan reputasi. Tapi salah pilih mitra lebih buruk dari tak punya: merek-mu ikut tergadai.',
  goal:'Jaringan distributor regional berdiri sehat: mitra terpilih lewat uji kelayakan, dibekali (bukan dilepas), wilayah & aturan main jelas, dan penjualan perdana tervalidasi.',
  obj:['Seleksi kandidat distributor dengan kriteria sehat','Onboarding: training produk & dukungan teknis','Tata wilayah, target & aturan main, lalu validasi'],
  learn:['Distributor menjual banyak merek: pertanyaannya bukan "mau jual produkku?" tapi "produkku dapat PRIORITAS apa di rakmu?"','Kriteria mitra sehat: kesehatan finansial, tim teknis (produk listrik butuh penjelasan!), reputasi pasar — bukan sekadar siapa berani stok besar','Distributor yang dibekali (training, demo unit, dukungan engineer) menjual 3-5x dari yang sekadar dikirimi katalog — channel is built, not signed','Aturan wilayah & harga harus tertulis sejak awal: perang harga antar distributormu sendiri adalah cara tercepat menghancurkan margin semua pihak'],
  next:['Susun program distributor bertingkat (authorized/premier)','Pelajari manajemen konflik channel vs penjualan langsung','Bangun forum tahunan distributor — komunitas, bukan sekadar rantai pasok']},
});
let mmt={};
function buildMitra(){
  freshScene(0xc6d2dc,0x18222c);
  cam={theta:0,phi:1.16,r:8,target:new THREE.Vector3(0,1.8,-.8)};
  const Z=room(0x6b5a45,0xd8d2c4,16,11);
  /* peta wilayah */
  const frame=boxT(3.6,2.2,.16,TEX.metal(),{metalness:.4});frame.position.set(-3.0,2.4,Z+.05);scene.add(frame);
  frame.add(label('PETA EKSPANSI REGIONAL',.8).translateY(1.35));
  mmt.D=makeDisplay(3.3,1.9,500,290);
  mmt.D.mesh.position.set(-3.0,2.4,Z+.15);scene.add(mmt.D.mesh);
  actMesh(mmt.D.mesh,'SELEKSI');
  function peta(mode){
    const g=mmt.D.g,W=500,H=290;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.strokeStyle='#2a3a4c';g.lineWidth=8;
    g.beginPath();g.moveTo(0,200);g.bezierCurveTo(150,180,350,210,W,190);g.stroke();
    const kota=[['CIREBON',110,160],['TEGAL',260,150],['PEKALONGAN',400,165]];
    kota.forEach((k,i)=>{
      g.fillStyle=mode>=1?'#46ff8e':'#8aa3bd';
      g.beginPath();g.arc(k[1],k[2],12,0,7);g.fill();
      g.font='600 14px Consolas';g.textAlign='center';g.fillText(k[0],k[1],k[2]-20);});
    g.textAlign='left';g.font='700 16px Consolas';
    g.fillStyle=mode>=1?'#46ff8e':'#ffd23f';
    g.fillText(mode>=1?'3 wilayah eksklusif — batas & target jelas':'3 kota penuh pabrik, nol kehadiran',20,40);
    mmt.D.tex.needsUpdate=true;}
  peta(0);
  /* 3 kandidat di kursi */
  mmt.kand=[];
  [[-.4,'CV-A'],[1.0,'PT-B'],[2.4,'UD-C']].forEach((o,i)=>{
    const grp=new THREE.Group();
    const badan=cyl(.2,.26,.85,[0x8a5a2a,0x2a5a8a,0x5a8a2a][i]);badan.position.y=.7;grp.add(badan);
    const kepala=new THREE.Mesh(new THREE.SphereGeometry(.14,14,12),
      new THREE.MeshStandardMaterial({color:0xd8b090}));kepala.position.y=1.32;grp.add(kepala);
    grp.position.set(o[0],0,.6);scene.add(grp);mmt.kand.push(grp);
    scene.add(label(o[1],.5).translateX(o[0]).translateY(1.75).translateZ(.6));});
  actMesh(mmt.kand[1].children[0],'PILIH');
  /* ruang training */
  mmt.tr=makeDisplay(1.7,1.0,380,220);
  mmt.tr.mesh.position.set(1.6,2.4,Z+.1);scene.add(mmt.tr.mesh);
  dispText(mmt.tr,['TRAINING CENTER','menunggu mitra…'],['#5fd4ff','#7d8f84']);
  actMesh(mmt.tr.mesh,'BEKAL');
  scene.add(label('ONBOARDING MITRA',.65,'#5fd4ff').translateX(1.6).translateY(3.15).translateZ(Z+.1));
  /* kontrak + PO perdana */
  mmt.po=box(.5,.66,.04,0xe8d8a0);mmt.po.position.set(4.6,2.2,Z+.06);scene.add(mmt.po);
  actMesh(mmt.po,'VALID');
  scene.add(label('PO PERDANA',.6,'#ffd23f').translateX(4.6).translateY(2.75).translateZ(Z+.1));
  startSeq([
   {type:'act',aid:'SELEKSI',done:false,targets:()=>[mmt.D.mesh],
    desc:'Petakan pasar & buka SELEKSI kandidat (klik peta).',
    why:'Tiga kota, ±400 pabrik potensial, nol kehadiran. Iklan kemitraan dibuka — sembilan pelamar disaring jadi tiga finalis. Kriteria di atas meja sejak awal: finansial sehat, PUNYA TIM TEKNIS, reputasi bersih. Stok besar tanpa kemampuan menjelaskan produk hanyalah gudang penuh debu.',
    fx(){toast('🗺️ 9 pelamar → 3 finalis lolos kriteria dasar.','ok',2800);}},
   {type:'act',aid:'PILIH',done:false,targets:()=>[mmt.kand[1].children[0]],
    desc:'Wawancara final: PILIH mitra yang tepat (klik kandidat tengah).',
    why:'CV-A: stok terbesar, tapi nol teknisi — produk akan dijual seperti sembako. UD-C: teknis bagus, finansial rapuh. PT-B: gudang sedang, DUA engineer listrik, reputasi 15 tahun, dan satu jawaban yang menentukan: "kami menolak merek kompetitor X karena tak diberi dukungan teknis." Mitra yang menuntut dukungan = mitra yang berniat serius menjual.',
    fx(){toast('🤝 PT-B terpilih: tim teknis + reputasi + niat serius.','ok',3200);}},
   {type:'act',aid:'BEKAL',done:false,targets:()=>[mmt.tr.mesh],
    desc:'ONBOARDING: training produk, demo unit, jalur dukungan (klik training).',
    why:'Dua minggu intensif: training produk & sizing untuk engineer mereka, demo unit kapasitor + alat ukur dipinjamkan, jalur eskalasi teknis langsung ke engineermu, materi pemasaran lokal. Distributor yang dibekali menjual produkmu seperti miliknya — karena kini ia BISA menjelaskannya.',
    fx(){dispText(mmt.tr,['2 ENGINEER LULUS','demo unit + hotline ✓'],['#46ff8e','#eaf2fb']);
      toast('🎓 PT-B dibekali penuh — bukan dilepas dengan katalog.','ok',3000);}},
   {type:'act',aid:'WILAYAH',done:false,targets:()=>[mmt.D.mesh],
    desc:'Tata ATURAN MAIN: wilayah, harga, target (klik peta lagi).',
    why:'Hitam di atas putih: tiga kota eksklusif PT-B selama target tercapai, harga lantai disepakati (perang diskon = dilarang), proyek besar >Rp 500 jt digarap BERSAMA engineermu, target tahun pertama realistis. Kemitraan yang awet ditulis saat mesra — bukan dinegosiasi saat bertengkar.',
    fx(){peta(1);toast('📜 Wilayah eksklusif + harga lantai + target — tertulis semua.','ok',3000);}},
   {type:'act',aid:'VALID',done:false,targets:()=>[mmt.po],
    desc:'Validasi model: kawal PENJUALAN PERDANA mereka (klik PO).',
    why:'Bulan kedua: engineer PT-B mengendus pabrik tekstil Tegal kena denda kVArh — ilmu dari training-mu! Mereka survey, engineermu membantu sizing via call, PO kapasitor bank pertama ditandatangani. Penjualan yang terjadi TANPA kamu hadir di kota itu: itulah bukti jaringan bekerja.',
    fx(){toast('💼 PO perdana dari Tegal — terjual tanpa kehadiranmu. Jaringan HIDUP!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Kakimu kini ada di tiga kota — tanpa satu karyawan baru!</b> Mitra disaring ketat, dibekali sungguh-sungguh, diikat aturan yang adil. Channel yang sehat menjual saat kamu tidur — dan menjaga nama baikmu saat kamu jauh.');
    setTimeout(()=>showWin('mitra'),2200);});
  const s0m=seq.steps[0],of0m=s0m.fx;s0m.fx=()=>{of0m();mmt.D.mesh.userData.aid='WILAYAH';};
  say('VOLTA di sini 🌐 Penjualanmu mentok di geografi — saatnya <b>membangun jaringan distributor</b>. Ingat hukumnya: mitra yang salah menggadaikan merekmu; mitra yang dibekali menjualkan seperti miliknya. Mulai dari peta!');
  $('#modTitle').textContent='J09·M7 — Jaringan Distributor';
  $('#taskHead').textContent='CHANNEL DIBANGUN, BUKAN DITEKEN';}
MISSIONS.mitra.build=buildMitra;
Object.assign(REAL,{
 mitra:[
  'Due diligence finansial kandidat (laporan keuangan, referensi bank) — piutang macet membunuh kemitraan',
  'Kontrak memuat exit clause yang adil: kinerja di bawah target N kuartal = wilayah dievaluasi',
  'Lindungi harga pasar dengan kebijakan harga lantai tertulis & sanksi pelanggarannya',
  'Kunjungi mitra terjadwal & ukur sell-out (bukan hanya sell-in) — stok menumpuk bukan penjualan'],
});

/* =====================================================================
   MISI 8 — INBOUND MARKETING TEKNIS: DIDATANGI, BUKAN MENGEJAR
   ===================================================================== */
Object.assign(MISSIONS,{
 inbound:{lvl:'JALUR 09 · SALES & TECHNICAL MARKETING · MISI 8',icon:'🧲',title:'Inbound: Didatangi, Bukan Mengejar',strict:false,
  loc:'📍 Kantor regional · Evaluasi: biaya akuisisi makin mahal',
  story:'Rapat penjualan tahunan menyajikan angka yang melelahkan: biaya mendapatkan satu pelanggan baru naik terus — telepon dingin diabaikan, kunjungan ditolak satpam. Lalu satu anomali di data: tiga pelanggan terbaik tahun ini datang SENDIRI… setelah membaca artikel teknismu yang iseng diunggah. Itulah benih strategi baru: INBOUND — jadilah jawaban yang dicari orang, dan biarkan mereka yang menelepon duluan.',
  goal:'Mesin inbound berjalan: konten teknis menjawab pencarian nyata, webinar mengubah pembaca jadi prospek, dan funnel terukur membuktikan biaya akuisisi turun.',
  obj:['Riset pertanyaan nyata pasar & buat konten yang menjawab','Webinar teknis: dari pembaca menjadi prospek','Bangun funnel terukur & buktikan angkanya'],
  learn:['Insinyur tidak suka ditelepon sales — tapi jam 11 malam mereka MENCARI "cara menghilangkan denda kVArh": jadilah jawaban itu, dan kepercayaan terbangun sebelum perkenalan','Konten teknis jujur (kalkulator, panduan, studi kasus dgn angka) mengalahkan brosur: yang membantu diingat, yang menjual di-skip','Webinar adalah jabat tangan massal: 100 pendaftar = 100 prospek yang MENDAFTAR SENDIRI — kualitasnya beda langit dgn daftar telepon dingin','Funnel diukur tiap anak tangga (pembaca→pendaftar→prospek→deal): yang tak diukur tak bisa diperbaiki — ilmu OEE-nya dunia pemasaran'],
  next:['Pelajari SEO teknis: menulis untuk manusia & mesin pencari sekaligus','Bangun email nurture: merawat prospek yang belum siap beli','Dalami atribusi: dari artikel mana deal terbesar berasal'],},
});
let mib={};
function buildInbound(){
  freshScene(0xc6d2dc,0x18222c);
  cam={theta:0,phi:1.16,r:8,target:new THREE.Vector3(0,1.9,-.9)};
  const Z=room(0x6b5a45,0xd8d2c4,16,11);
  /* layar riset keyword */
  const frame=boxT(4.2,2.4,.16,TEX.metal(),{metalness:.4});frame.position.set(-2.6,2.4,Z+.05);scene.add(frame);
  frame.add(label('RISET PERTANYAAN PASAR',.85).translateY(1.5));
  mib.D=makeDisplay(3.9,2.1,560,320);
  mib.D.mesh.position.set(-2.6,2.4,Z+.15);scene.add(mib.D.mesh);
  actMesh(mib.D.mesh,'RISET');
  mib.mode=0;
  function layar(){
    const g=mib.D.g,W=560,H=320;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='600 15px Consolas';g.textAlign='left';
    if(mib.mode===0){
      g.fillStyle='#5fd4ff';g.font='700 17px Consolas';
      g.fillText('YANG DICARI ORANG TIAP BULAN:',16,32);
      g.font='600 15px Consolas';
      [['cara menghilangkan denda kVArh','720x','#46ff8e'],
       ['penyebab listrik pabrik sering jeglek','480x','#46ff8e'],
       ['kapasitor bank adalah','390x','#ffd23f'],
       ['harga kapasitor bank 200 kvar','210x','#ffd23f']].forEach((r,i)=>{
        const y=72+i*40;g.fillStyle='#eaf2fb';g.fillText('"'+r[0]+'"',16,y);
        g.fillStyle=r[2];g.fillText(r[1],460,y);});
      g.fillStyle='#8aa3bd';g.fillText('mereka bertanya tiap malam — siapa yang menjawab?',16,H-18);}
    else{
      g.fillStyle='#5fd4ff';g.font='700 17px Consolas';
      g.fillText('FUNNEL 90 HARI:',16,32);
      const f=[['pembaca artikel','4.218'],['pakai kalkulator','512'],
        ['daftar webinar','118'],['minta survei','22'],['DEAL','5']];
      f.forEach((r,i)=>{const y=70+i*46;const w=380*(1-(i*.21));
        g.fillStyle=i===4?'#46ff8e':'#2a5a8a';
        g.fillRect(90-((380-w)/-2)*0+ (380-w)/2,y-16,w,30);
        g.fillStyle='#eaf2fb';g.fillText(r[0]+': '+r[1],100+(380-w)/2,y+4);});
      g.fillStyle='#46ff8e';g.font='700 15px Consolas';
      g.fillText('CAC turun 58% vs telepon dingin',16,H-16);}
    mib.D.tex.needsUpdate=true;}
  layar();
  /* meja konten + kalkulator */
  mib.art=box(.55,.04,.7,0xf0ead8);mib.art.position.set(1.2,1.06,-.4);scene.add(mib.art);
  actMesh(mib.art,'KONTEN');
  const desk=boxT(2.2,.08,1.1,TEX.wood());desk.position.set(1.2,1.0,-.4);scene.add(desk);
  [[-1,-.4],[1,-.4],[-1,.4],[1,.4]].forEach(p=>{
    const l=boxT(.08,1,.08,TEX.wood());l.position.set(1.2+p[0],.5,-.4+p[1]);scene.add(l);});
  scene.add(label('KONTEN: ARTIKEL + KALKULATOR',.6,'#5fd4ff').translateX(1.2).translateY(1.5).translateZ(-.4));
  /* layar webinar */
  mib.web=makeDisplay(1.7,1.0,380,220);
  mib.web.mesh.position.set(3.2,2.4,Z+.1);scene.add(mib.web.mesh);
  dispText(mib.web,['WEBINAR','—'],['#5fd4ff','#7d8f84']);
  actMesh(mib.web.mesh,'WEBINAR');
  scene.add(label('WEBINAR TEKNIS',.65,'#5fd4ff').translateX(3.2).translateY(3.15).translateZ(Z+.1));
  startSeq([
   {type:'act',aid:'RISET',done:false,targets:()=>[mib.D.mesh],
    desc:'RISET: apa yang sebenarnya dicari pasar tiap malam? (klik layar)',
    why:'Data pencarian membuka mata: 720 orang/bulan mengetik "cara menghilangkan denda kVArh" — persis masalah yang produkmu selesaikan, dan TAK SATU PUN kompetitor menjawabnya dengan baik. Pasarmu sudah bertanya tiap malam ke mesin pencari; selama ini tak ada yang membalas.',
    fx(){toast('🔍 720 pencarian/bln tanpa jawaban bagus — panggung kosong.','ok',3200);}},
   {type:'act',aid:'KONTEN',done:false,targets:()=>[mib.art],
    desc:'Buat KONTEN yang benar-benar menjawab + kalkulator (klik meja).',
    why:'Artikel 2.000 kata yang JUJUR: cara membaca denda di rekening, rumus Q=P(tanφ1−tanφ2) — ilmu misi pertamamu! — kapan TIDAK butuh kapasitor, plus kalkulator online gratis: masukkan data rekening, keluar estimasi penghematan. Tanpa jualan di paragraf pertama: yang membantu akan diingat; yang menjual di-skip.',
    fx(){toast('✍️ Artikel jujur + kalkulator gratis tayang — membantu dulu.','ok',3200);}},
   {type:'act',aid:'WEBINAR',done:false,targets:()=>[mib.web.mesh],
    desc:'Naikkan level: WEBINAR teknis bulanan (klik layar webinar).',
    why:'"Bedah Tagihan Listrik Industri" — 60 menit ilmu murni oleh engineermu, studi kasus nyata (anonim), QnA terbuka. 118 pendaftar: manajer pabrik yang MENDAFTAR SENDIRI, mengorbankan jam makan siangnya. Bandingkan dengan 118 telepon dingin: di sini, merekalah yang datang membawa pertanyaan.',
    fx(){dispText(mib.web,['118 PESERTA','22 minta survei!'],['#46ff8e','#ffd23f']);
      toast('🎙️ 118 peserta · 22 langsung minta survei lokasi!','ok',3200);}},
   {type:'act',aid:'FUNNEL',done:false,targets:()=>[mib.D.mesh],
    desc:'Buktikan dengan angka: baca FUNNEL 90 hari (klik layar).',
    why:'4.218 pembaca → 512 pemakai kalkulator → 118 peserta webinar → 22 survei → 5 DEAL. Biaya akuisisi: turun 58% dibanding cara lama — dan prospek inbound menutup lebih cepat karena datang sudah setengah percaya. Mesin ini kini berjalan saat timmu tidur: artikel tak pernah cuti.',
    fx(){mib.mode=1;layar();
      toast('📊 Funnel terbukti: CAC −58% · 5 deal dari konten!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Dari mengejar menjadi didatangi!</b> Pertanyaan pasar dijawab jujur, kalkulator membantu duluan, webinar menjabat tangan ratusan orang sekaligus — dan funnel membuktikan semuanya dengan angka. Penjualan terbaik dimulai jauh sebelum perkenalan.');
    setTimeout(()=>showWin('inbound'),2200);});
  const s0i=seq.steps[0],of0i=s0i.fx;s0i.fx=()=>{of0i();mib.D.mesh.userData.aid='FUNNEL';};
  say('VOLTA di sini 🧲 Telepon dingin makin dingin, satpam makin galak — tapi tiga pelanggan terbaikmu datang SENDIRI dari satu artikel. Itu bukan kebetulan: itu strategi yang belum dibangun. Namanya <b>inbound</b>. Mulai dari riset!');
  $('#modTitle').textContent='J09·M8 — Inbound Marketing Teknis';
  $('#taskHead').textContent='JADILAH JAWABAN YANG DICARI';}
MISSIONS.inbound.build=buildInbound;
Object.assign(REAL,{
 inbound:[
  'Konten ditulis/direview engineer sungguhan — pembaca teknis mencium konten tukang tulis dalam dua paragraf',
  'Kalkulator & alat gratis minta kontak SETELAH memberi nilai, bukan sebelum (gerbang terlalu dini membunuh trust)',
  'Konsistensi mengalahkan ledakan: 2 artikel bagus/bulan selama setahun > 20 artikel lalu mati',
  'Hubungkan CRM dgn sumber konten — tanpa atribusi, inbound tak akan pernah dapat anggaran'],
});
