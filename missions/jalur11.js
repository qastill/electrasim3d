/* =====================================================================
   ElectraSim VR 3D — SUSTAINABILITY & CARBON
   Misi: M1 carbon (Inventarisasi GHG Scope 1-2-3) · M2 reduksi (Roadmap Reduksi Menuju Net Zero)
   Dimuat on-demand oleh index.html lewat ensureMission().
   ===================================================================== */

Object.assign(MISSIONS,{
 carbon:{lvl:'JALUR 11 · SUSTAINABILITY & CARBON',icon:'🌍',title:'Inventarisasi GHG Scope 1-2-3',strict:false,
  loc:'📍 PT Maju Plastik · Penyusunan baseline emisi',
  story:'Buyer Eropa meminta PT Maju Plastik melaporkan jejak karbon — tanpa itu, kontrak ekspor melayang. Kamu carbon analyst pertama mereka. Langkah awal semua perjalanan net zero sama: inventarisasi. Keliling pabrik, identifikasi setiap sumber emisi, dan klasifikasikan dengan benar menurut GHG Protocol.',
  goal:'Klasifikasikan sumber emisi ke Scope 1, 2, 3 dengan benar, hitung total baseline, dan tetapkan strategi reduksi pertama.',
  obj:['Identifikasi emisi langsung (Scope 1)','Identifikasi emisi listrik (Scope 2) & rantai nilai (Scope 3)','Hitung baseline & pilih quick-win reduksi'],
  learn:['Scope 1 = pembakaran langsung milik sendiri (genset, boiler, kendaraan dinas)','Scope 2 = listrik yang dibeli; grid Jawa ±0,77 kg CO₂e per kWh','Scope 3 = rantai nilai (pemasok, logistik, produk) — biasanya porsi terbesar & tersulit','Tanpa baseline tak ada target; tanpa target tak ada net zero'],
  next:['Pelajari GHG Protocol & ISO 14064 lebih dalam','Susun roadmap reduksi: efisiensi → PLTS → REC/offset','Eksplorasi carbon pricing & perdagangan karbon Indonesia']},
 reduksi:{lvl:'JALUR 11 · SUSTAINABILITY & CARBON · MISI 2',icon:'📉',title:'Roadmap Reduksi Menuju Net Zero',strict:false,
  loc:'📍 PT Maju Plastik · Rapat strategi dekarbonisasi',
  story:'Baseline 1.240 tCO₂e sudah di tangan — kini direksi berpesan: "turunkan, tapi jangan bangkrutkan kami." Di hadapanmu empat kartu strategi. Urutannya bukan selera: ada hierarki mitigasi yang membuat tiap rupiah per ton CO₂e paling efisien.',
  goal:'Empat strategi tersusun dalam hierarki yang benar: efisiensi → energi terbarukan → REC → offset, lalu roadmap final.',
  obj:['Mulai dari efisiensi (biaya per ton termurah, bahkan negatif)','Lanjut PLTS atap & REC untuk listrik sisa','Offset hanya untuk residual, lalu kunci roadmap bertarget'],
  learn:['Hierarki mitigasi: KURANGI dulu (efisiensi), ganti sumber (renewable), klaim hijau (REC), offset TERAKHIR','Efisiensi punya biaya per ton negatif — hemat energi = hemat uang = turun emisi','REC membeli atribut hijau listrik; offset membayar penyerapan di tempat lain — keduanya bukan pengganti reduksi nyata','Roadmap kredibel punya target tahunan terukur, bukan sekadar "net zero 2050"'],
  next:['Pelajari Science Based Targets initiative (SBTi)','Susun marginal abatement cost curve (MACC) proyekmu','Dalami pasar karbon Indonesia: IDXCarbon & pajak karbon']},
});

/* =====================================================================
   MISI 14 — CARBON SCOPE 1-2-3 (Jalur 11)
   ===================================================================== */
let mcn={};
function buildCarbon(){
  freshScene(0xb8d0c0,0x121d18);
  cam={theta:.1,phi:1.18,r:9,target:new THREE.Vector3(0,1.6,-.8)};
  const ground=box(20,.1,12,0x55605a);ground.position.y=-.05;scene.add(ground);
  const fab=box(7,3,4,0xb8c0b4);fab.position.set(-2,1.5,-3.5);scene.add(fab);
  fab.add(label('PT MAJU PLASTIK',.95).translateY(1.95));

  /* genset (scope 1) */
  mcn.gen=box(1.4,1.0,.9,0x8a6a3a);mcn.gen.position.set(-6.0,.55,-.8);scene.add(mcn.gen);
  const exh=cyl(.07,.07,.8,0x444444);exh.position.set(-6.4,1.4,-.8);scene.add(exh);
  actMesh(mcn.gen,'S1');
  scene.add(label('GENSET DIESEL',.65).translateX(-6.0).translateY(1.45).translateZ(-.8));
  /* meter PLN (scope 2) */
  mcn.mtr=box(.4,.55,.16,0x2d3a4a);mcn.mtr.position.set(-2.0,1.3,-1.45);scene.add(mcn.mtr);
  actMesh(mcn.mtr,'S2');
  scene.add(label('METER PLN',.6).translateX(-2.0).translateY(1.75).translateZ(-1.4));
  /* truk pemasok (scope 3) */
  const tbody=box(2.4,.9,1.0,0xc8c8c8);tbody.position.set(4.2,.85,.4);scene.add(tbody);
  const tcab=box(.8,.7,.95,0xd83a3a);tcab.position.set(2.7,.75,.4);scene.add(tcab);
  [[-.7,-.55],[.7,-.55],[-.7,.55],[.7,.55],[2.7-3.5,-.55],[2.7-3.5,.55]].forEach(()=>{});
  [[3.4,-.1],[4.9,-.1],[3.4,.9],[4.9,.9],[2.6,-.1],[2.6,.9]].forEach(w=>{
    const wh=cyl(.22,.22,.16,0x14181d);wh.rotation.x=Math.PI/2;
    wh.position.set(w[0],.28,w[1]);scene.add(wh);});
  actMesh(tbody,'S3'); actMesh(tcab,'S3');
  scene.add(label('TRUK PEMASOK',.65).translateX(3.6).translateY(1.7).translateZ(.4));
  /* papan kalkulasi */
  mcn.D=makeDisplay(1.4,.9,320,220);
  mcn.D.mesh.position.set(7.0,1.7,-1.5);mcn.D.mesh.rotation.y=-.4;scene.add(mcn.D.mesh);
  dispText(mcn.D,['INVENTARISASI GHG','— tCO2e'],['#5fd4ff','#7d8f84']);
  const pole=cyl(.04,.04,1.3,0x666666);pole.position.set(7.0,.65,-1.5);scene.add(pole);
  actMesh(mcn.D.mesh,'CALC');
  /* panel PLTS rencana */
  mcn.pv=box(1.6,.06,1.0,0x16263e,{roughness:.25});mcn.pv.position.set(-2,3.1,-2.6);
  mcn.pv.rotation.x=-.3;scene.add(mcn.pv);
  actMesh(mcn.pv,'RED');
  scene.add(label('RENCANA PLTS ATAP',.65,'#8df0b8').translateX(-2).translateY(3.6).translateZ(-2.4));

  startSeq([
   {type:'act',aid:'S1',done:false,targets:()=>[mcn.gen],
    desc:'SCOPE 1 — identifikasi emisi LANGSUNG. Klik sumbernya!',
    why:'Scope 1 = pembakaran di aset milik sendiri: genset diesel ini membakar solar di lokasi → CO₂ keluar dari knalpot perusahaan sendiri. (Boiler & mobil dinas juga masuk sini.)',
    fx(){toast('🏭 Genset → SCOPE 1: 96 tCO₂e/tahun (solar 36.000 L).','ok',2800);}},
   {type:'act',aid:'S2',done:false,targets:()=>[mcn.mtr],
    desc:'SCOPE 2 — emisi dari LISTRIK YANG DIBELI. Klik sumbernya!',
    why:'Pabrik tak membakar apapun untuk listrik PLN — pembangkitnya yang membakar. Emisinya "menempel" lewat faktor emisi grid: Jawa ±0,77 kg CO₂e/kWh.',
    fx(){toast('🔌 Listrik PLN 1,3 GWh → SCOPE 2: 1.001 tCO₂e/tahun.','ok',2800);}},
   {type:'act',aid:'S3',done:false,targets:()=>[tbody],
    desc:'SCOPE 3 — emisi RANTAI NILAI. Klik sumbernya!',
    why:'Truk pemasok bukan milik pabrik, tapi beroperasi demi pabrik — itulah Scope 3: hulu (bahan baku, logistik masuk) & hilir (distribusi, pemakaian produk). Biasanya porsi terbesar.',
    fx(){toast('🚚 Logistik & pemasok → SCOPE 3: ±143 tCO₂e/tahun (estimasi).','ok',2800);}},
   {type:'act',aid:'CALC',done:false,targets:()=>[mcn.D.mesh],
    desc:'Hitung BASELINE total (klik papan kalkulasi).',
    why:'Baseline = titik nol perjalanan net zero. Tanpa angka awal, "turun 30%" tak bermakna. Tahun baseline & metodologi harus konsisten untuk pelaporan tahun-tahun berikutnya.',
    fx(){dispText(mcn.D,['1.240 tCO2e/thn','S1:96 S2:1001 S3:143'],['#ffd23f','#eaf2fb']);
      toast('🧮 Baseline 2026: 1.240 tCO₂e — Scope 2 dominan 81%!','ok',3000);}},
   {type:'act',aid:'RED',done:false,targets:()=>[mcn.pv],
    desc:'Pilih QUICK-WIN reduksi: klik rencana PLTS atap.',
    why:'Data menunjuk: Scope 2 = 81% total. Strategi paling berdampak: efisiensi + PLTS atap (pangkas pembelian listrik grid) — sebelum bicara offset, kurangi dulu yang nyata.',
    fx(){toast('☀️ PLTS 500 kWp → potensi −540 tCO₂e/thn (−44%)!','ok',3000);sfx.big();}},
  ],()=>{say('🎉 <b>Baseline berdiri: 1.240 tCO₂e!</b> Scope terklasifikasi benar, strategi reduksi berbasis data. Kontrak ekspor Eropa? Aman.');
    setTimeout(()=>showWin('carbon'),2200);});

  say('VOLTA di sini 🌍 Misi karbon pertamamu. Hafalkan triloginya: <b>Scope 1 = bakar sendiri, Scope 2 = listrik dibeli, Scope 3 = rantai nilai</b>. Klik sumber emisi sesuai urutan scope — jangan tertukar!');
  $('#modTitle').textContent='J11 — Inventarisasi GHG Scope 1-2-3';
  $('#taskHead').textContent='SCOPE 1 → 2 → 3 → BASELINE';}

/* =====================================================================
   MISI 28 — ROADMAP REDUKSI (Jalur 11 · Misi 2)
   ===================================================================== */
let mrd={};
function buildReduksi(){
  freshScene(0xb8d0c0,0x121d18);
  cam={theta:0,phi:1.18,r:7,target:new THREE.Vector3(0,1.9,-1)};
  const Z=room(0x6b5a45,0xd8d2c4);
  /* papan baseline */
  const base=box(1.4,.9,.06,0x2b3a4a);base.position.set(-4.3,2.4,Z);scene.add(base);
  base.add(label('BASELINE 1.240 tCO₂e',.7,'#ffd23f').translateY(.65));
  /* 4 kartu strategi di dinding */
  function card(x,txt,color,aid){
    const c=box(1.15,1.0,.08,color);c.position.set(x,2.2,Z+.05);scene.add(c);
    actMesh(c,aid);
    c.add(label(txt,.62).translateY(.7));
    return c;}
  mrd.eff=card(-2.4,'EFISIENSI',0x2e6a4a,'EFF');
  scene.add(label('VFD+LED · −180 t · hemat Rp',.5,'#8df0b8').translateX(-2.4).translateY(1.5).translateZ(Z+.1));
  mrd.pv=card(-1.0,'PLTS ATAP',0x2a5a8a,'PV');
  scene.add(label('500 kWp · −540 t',.5,'#9cc4ff').translateX(-1.0).translateY(1.5).translateZ(Z+.1));
  mrd.rec=card(.4,'REC',0x8a7a2a,'REC');
  scene.add(label('sisa listrik · −280 t',.5,'#ffe28d').translateX(.4).translateY(1.5).translateZ(Z+.1));
  mrd.off=card(1.8,'OFFSET',0x6a4a2a,'OFF');
  scene.add(label('residual · −240 t',.5,'#e8b88d').translateX(1.8).translateY(1.5).translateZ(Z+.1));
  /* roadmap display */
  mrd.D=makeDisplay(2.2,1.2,440,240);
  mrd.D.mesh.position.set(4.2,2.3,Z+.06);scene.add(mrd.D.mesh);
  dispText(mrd.D,['ROADMAP NET ZERO','susun strategi…'],['#5fd4ff','#7d8f84']);
  actMesh(mrd.D.mesh,'ROAD');
  scene.add(label('PAPAN ROADMAP',.7,'#5fd4ff').translateX(4.2).translateY(3.05).translateZ(Z+.1));
  mrd.step=0;
  function mark(c){c.material.emissive=new THREE.Color(0x1a4a2a);c.material.emissiveIntensity=.8;}

  startSeq([
   {type:'act',aid:'EFF',done:false,targets:()=>[mrd.eff],
    desc:'Langkah 1 hierarki: pilih EFISIENSI lebih dulu.',
    why:'Efisiensi (VFD, LED, setpoint) biaya per ton-nya NEGATIF — perusahaan justru hemat sambil menurunkan 180 t. Strategi lain dibeli; yang ini membayar dirinya sendiri. Selalu pertama.',
    fx(){mark(mrd.eff);toast('1️⃣ Efisiensi: −180 tCO₂e + hemat Rp 420 jt/thn.','ok',2800);}},
   {type:'act',aid:'PV',done:false,targets:()=>[mrd.pv],
    desc:'Langkah 2: ganti sumber — PLTS ATAP 500 kWp.',
    why:'Setelah konsumsi diperkecil, baru ganti sumbernya: PLTS memangkas pembelian listrik grid (Scope 2 = 81% baseline!). Mengurangi emisi NYATA di lokasi sendiri.',
    fx(){mark(mrd.pv);toast('2️⃣ PLTS 500 kWp: −540 tCO₂e — potongan terbesar.','ok',2800);}},
   {type:'act',aid:'REC',done:false,targets:()=>[mrd.rec],
    desc:'Langkah 3: listrik grid tersisa → beli REC.',
    why:'Listrik malam tetap dari PLN — atributnya dihijaukan dengan REC (Renewable Energy Certificate). Sah untuk klaim Scope 2 market-based, tapi perhatikan: ini klaim, bukan reduksi fisik.',
    fx(){mark(mrd.rec);toast('3️⃣ REC menutup sisa listrik grid: −280 tCO₂e (market-based).','ok',2800);}},
   {type:'act',aid:'OFF',done:false,targets:()=>[mrd.off],
    desc:'Langkah TERAKHIR: offset untuk residual yang tak terhindarkan.',
    why:'Genset darurat & logistik belum bisa nol — residual inilah yang di-offset (kredit karbon terverifikasi). Offset di awal = greenwashing; offset di akhir = penutup yang jujur.',
    fx(){mark(mrd.off);toast('4️⃣ Offset residual 240 tCO₂e — kredit terverifikasi.','ok',2800);}},
   {type:'act',aid:'ROAD',done:false,targets:()=>[mrd.D.mesh],
    desc:'Kunci ROADMAP: target tahunan di papan (klik papan).',
    why:'1.240 → 1.060 (2027, efisiensi) → 520 (2028, PLTS) → 240 (2029, REC) → net zero operasional 2030. Tiap angka punya proyek, anggaran & penanggung jawab — itulah bedanya roadmap dan slogan.',
    fx(){dispText(mrd.D,['NET ZERO 2030 ✓','1.240→1.060→520→240→0'],['#46ff8e','#eaf2fb']);
      toast('🗺️ Roadmap terkunci — siap dipresentasikan ke direksi & buyer!','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Roadmap kredibel berdiri!</b> Kurangi → ganti sumber → klaim → offset terakhir. Buyer Eropa tak hanya dapat angka — mereka dapat rencana yang bisa diaudit.');
    setTimeout(()=>showWin('reduksi'),2200);});

  say('VOLTA di sini 📉 Baseline sudah, kini strateginya. Ujian hari ini soal <b>URUTAN</b>: empat kartu di dinding hanya benar dalam satu susunan — hierarki mitigasi. Yang termurah per ton selalu duluan.');
  $('#modTitle').textContent='J11·M2 — Roadmap Reduksi Net Zero';
  $('#taskHead').textContent='HIERARKI MITIGASI';}

MISSIONS.carbon.build=buildCarbon;
MISSIONS.reduksi.build=buildReduksi;

Object.assign(REAL,{
 carbon:[
  'Gunakan faktor emisi resmi (Kementerian ESDM / IPCC) dengan tahun publikasi yang konsisten',
  'Ikuti GHG Protocol untuk batasan organisasi & operasional sebelum menghitung',
  'Prioritaskan data primer (meteran, faktur BBM) di atas estimasi sekunder',
  'Pelaporan resmi (CDP, ESG, buyer) membutuhkan verifikasi pihak ketiga'],
 reduksi:[
  'Gunakan kriteria mutu offset: terverifikasi (VCS/Gold Standard), additionality jelas, tidak double-counting',
  'REC harus sesuai pasar & periode vintage yang diklaim — konsultasikan standar pelaporan buyer',
  'Susun MACC (marginal abatement cost curve) agar urutan proyek berbasis Rp/tCO₂e nyata',
  'Tinjau roadmap tiap tahun: faktor emisi grid berubah, teknologi turun harga, target bisa dipercepat'],
});

/* =====================================================================
   MISI 3 — MENGHADAPI VERIFIKASI PIHAK KETIGA
   ===================================================================== */
Object.assign(MISSIONS,{
 verif:{lvl:'JALUR 11 · SUSTAINABILITY & CARBON · MISI 3',icon:'🧾',title:'Menghadapi Verifikasi Pihak Ketiga',strict:false,
  loc:'📍 PT Maju Plastik · Hari verifikasi laporan emisi',
  story:'Buyer Eropa puas dengan baseline & roadmap-mu — kini syarat terakhir: laporan emisi harus DIVERIFIKASI pihak ketiga independen. Verifikator datang pagi ini dengan satu pekerjaan: meragukan setiap angkamu. Laporan yang bagus tidak takut diragukan; ia justru menyiapkan bukti sebelum diminta.',
  goal:'Laporan emisi lolos verifikasi dengan opini reasonable assurance — termasuk menghadapi temuan dengan jujur.',
  obj:['Siapkan paket evidence sebelum verifikator tiba','Dampingi sampling & uji telusur data','Tangani temuan dengan koreksi terbuka, bukan pembelaan'],
  learn:['Verifikasi menguji JEJAK: setiap angka harus bisa ditelusuri mundur sampai dokumen sumber (faktur, logbook, meter)','Temuan bukan musibah — menyembunyikan temuan itulah musibah; koreksi terbuka justru menaikkan kredibilitas','Faktor emisi harus dari sumber resmi dengan tahun publikasi konsisten di seluruh laporan','Opini reasonable assurance = verifikator yakin secara wajar laporan bebas salah saji material'],
  next:['Pelajari ISO 14064-3: prinsip & prosedur verifikasi GHG','Siapkan sistem data emisi otomatis (bukan spreadsheet rapuh)','Dalami materialitas: salah saji berapa persen yang mengubah opini']},
});
let mvr={};
function buildVerif(){
  freshScene(0xb8d0c0,0x121d18);
  cam={theta:0,phi:1.2,r:6.5,target:new THREE.Vector3(0,1.5,-1)};
  const Z=room(0x6b5a45,0xd8d2c4);
  /* meja rapat verifikasi */
  const desk=boxT(3.6,.08,1.5,TEX.wood());desk.position.set(0,1.0,-.5);scene.add(desk);
  [[-1.6,-1.1],[1.6,-1.1],[-1.6,0],[1.6,0]].forEach(p=>{
    const l=boxT(.08,1,.08,TEX.wood());l.position.set(p[0],.5,p[1]+0.45);scene.add(l);});
  /* binder evidence */
  mvr.binder=box(.7,.5,.3,0x2a5a8a);mvr.binder.position.set(-1.3,1.28,-.5);scene.add(mvr.binder);
  actMesh(mvr.binder,'DOK');
  scene.add(label('BINDER EVIDENCE',.6,'#5fd4ff').translateX(-1.3).translateY(1.7).translateZ(-.5));
  /* laptop verifikator */
  const lap=box(.7,.05,.5,0x2b3a4a);lap.position.set(.6,1.08,-.5);scene.add(lap);
  mvr.S=makeDisplay(.66,.42,330,210);
  mvr.S.mesh.position.set(.6,1.38,-.72);mvr.S.mesh.rotation.x=-.15;scene.add(mvr.S.mesh);
  dispText(mvr.S,['SAMPLING','pilih bukti acak…'],['#5fd4ff','#7d8f84']);
  actMesh(mvr.S.mesh,'SAMPLING');
  scene.add(label('LAPTOP VERIFIKATOR',.6,'#5fd4ff').translateX(.6).translateY(1.85).translateZ(-.7));
  /* papan temuan */
  mvr.papan=makeDisplay(2.4,1.3,480,260);
  mvr.papan.mesh.position.set(-2.6,2.4,Z+.08);scene.add(mvr.papan.mesh);
  dispText(mvr.papan,['LEMBAR TEMUAN','—'],['#5fd4ff','#7d8f84']);
  actMesh(mvr.papan.mesh,'TEMUAN');
  scene.add(label('LEMBAR TEMUAN VERIFIKASI',.7,'#5fd4ff').translateX(-2.6).translateY(3.25).translateZ(Z+.1));
  /* dokumen koreksi & sertifikat */
  mvr.rev=box(.5,.66,.04,0xf0ead8);mvr.rev.position.set(2.2,2.2,Z+.06);scene.add(mvr.rev);
  actMesh(mvr.rev,'KOREKSI');
  scene.add(label('REVISI PERHITUNGAN',.55,'#5fd4ff').translateX(2.2).translateY(2.75).translateZ(Z+.1));
  mvr.cert=box(.6,.45,.04,0xe8d8a0);mvr.cert.position.set(3.6,2.2,Z+.06);scene.add(mvr.cert);
  actMesh(mvr.cert,'OPINI');
  scene.add(label('PERNYATAAN VERIFIKASI',.55,'#ffd23f').translateX(3.6).translateY(2.7).translateZ(Z+.1));
  startSeq([
   {type:'act',aid:'DOK',done:false,targets:()=>[mvr.binder],
    desc:'Siapkan paket EVIDENCE sebelum verifikator tiba (klik binder).',
    why:'Satu binder per scope: faktur solar 12 bulan, rekening listrik PLN, logbook genset, sertifikat kalibrasi meter, dan kertas kerja perhitungan. Verifikasi lancar = 80% persiapan, 20% pertemuan.',
    fx(){toast('🗂️ Evidence 3 scope tersusun + kertas kerja terindeks.','ok',2800);}},
   {type:'act',aid:'SAMPLING',done:false,targets:()=>[mvr.S.mesh],
    desc:'Dampingi UJI TELUSUR: verifikator memilih sampel acak (klik laptop).',
    why:'"Angka solar Maret — tunjukkan sumbernya." Dari laporan → kertas kerja → rekap bulanan → faktur fisik No. 0312: cocok. Tiga sampel ditelusuri, tiga sampai ke akar. Inilah jejak audit yang sehat.',
    fx(){dispText(mvr.S,['3 SAMPEL ✓','jejak utuh sampai faktur'],['#46ff8e','#eaf2fb']);
      toast('🔍 Uji telusur LOLOS — laporan→faktur tersambung utuh.','ok',2800);}},
   {type:'act',aid:'TEMUAN',done:false,targets:()=>[mvr.papan.mesh],
    desc:'Verifikator menemukan sesuatu — baca LEMBAR TEMUAN (klik papan).',
    why:'Temuan: faktor emisi grid memakai publikasi 2023, padahal laporan tahun 2026 (tersedia faktor 2025). Selisihnya menaikkan Scope 2 sekitar 3%. Momen ini menentukan: membela diri, atau memperbaiki?',
    fx(){dispText(mvr.papan,['TEMUAN #1','FE grid 2023 → harusnya 2025'],['#ffd23f','#eaf2fb']);
      toast('⚠️ Temuan: faktor emisi kedaluwarsa — Scope 2 kurang saji ~3%.','bad',3000);}},
   {type:'act',aid:'KOREKSI',done:false,targets:()=>[mvr.rev],
    desc:'Tanggapi dengan benar: KOREKSI terbuka (klik revisi).',
    why:'Tanpa drama: faktor diganti publikasi resmi terbaru, Scope 2 naik 1.001→1.031 tCO2e, seluruh dokumen turunan diperbarui, akar masalah dicatat (tak ada prosedur pembaruan FE tahunan — sekarang ada). Kredibilitas justru NAIK.',
    fx(){dispText(mvr.papan,['TEMUAN #1 ✓','dikoreksi & prosedur dibuat'],['#46ff8e','#46ff8e']);
      toast('✏️ Dikoreksi: 1.270 tCO2e total + prosedur update FE tahunan.','ok',3000);}},
   {type:'act',aid:'OPINI',done:false,targets:()=>[mvr.cert],
    desc:'Terima PERNYATAAN VERIFIKASI (klik sertifikat).',
    why:'"Reasonable assurance — laporan bebas salah saji material." Tanda tangan verifikator independen inilah yang dibaca buyer Eropa: bukan janji perusahaan tentang dirinya, tapi kesaksian pihak yang dibayar untuk meragukan.',
    fx(){toast('🏅 OPINI TERBIT: reasonable assurance — kontrak ekspor AMAN!','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Lolos verifikasi dengan kepala tegak!</b> Evidence siap, jejak utuh, dan temuan dijawab dengan koreksi — bukan pembelaan. Laporan karbon yang kredibel dibangun dari keberanian dikoreksi.');
    setTimeout(()=>showWin('verif'),2200);});
  say('VOLTA di sini 🧾 Hari yang menegangkan: <b>verifikator datang untuk meragukan angkamu</b>. Dan justru itu bagus — laporan yang teruji keraguan adalah laporan yang dipercaya dunia. Siapkan binder!');
  $('#modTitle').textContent='J11·M3 — Verifikasi Pihak Ketiga';
  $('#taskHead').textContent='BUKTI · JEJAK · KOREKSI TERBUKA';}
MISSIONS.verif.build=buildVerif;
Object.assign(REAL,{
 verif:[
  'Simpan dokumen sumber minimal sesuai periode retensi standar pelaporan (umumnya 5+ tahun)',
  'Buat prosedur tertulis pembaruan faktor emisi tahunan dengan penanggung jawab jelas',
  'Jangan tanda tangani kontrak verifikasi dengan pihak yang juga konsultan penyusun laporanmu (konflik kepentingan)',
  'Temuan & koreksi didokumentasikan dalam log — verifikasi tahun depan dimulai dari log ini'],
});
