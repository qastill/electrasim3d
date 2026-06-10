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
