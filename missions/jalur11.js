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

/* =====================================================================
   MISI 4 — PERDAGANGAN KARBON & IDXCARBON
   ===================================================================== */
Object.assign(MISSIONS,{
 trading:{lvl:'JALUR 11 · SUSTAINABILITY & CARBON · MISI 4',icon:'💱',title:'Perdagangan Karbon: Dari Reduksi ke Revenue',strict:false,
  loc:'📍 PT Maju Plastik · Setahun setelah roadmap berjalan',
  story:'Kabar baik datang setahun kemudian: PLTS & efisiensi bekerja melebihi target — reduksi nyata 612 tCO₂e, terverifikasi. Direktur bertanya dengan mata berbinar: "Katanya karbon bisa DIJUAL?" Bisa — di bursa karbon. Tapi antara reduksi dan rupiah ada jembatan yang harus dilalui dengan benar: metodologi, verifikasi, registrasi, baru perdagangan.',
  goal:'Kelebihan reduksi menjadi unit karbon yang sah & terjual di bursa: metodologi dipilih, kredit terverifikasi & teregistrasi, transaksi tuntas.',
  obj:['Pahami jenis unit & syarat kelayakan kredit karbon','Registrasi proyek di SRN & verifikasi reduksi','Listing & jual di bursa karbon dengan harga wajar'],
  learn:['Kredit karbon lahir dari reduksi MELEBIHI baseline yang wajib (additionality) — usaha biasa-biasa saja tidak bisa dijual','SRN-PPI adalah buku besar nasional: tanpa registrasi, reduksimu tak punya identitas & rawan dihitung ganda','Satu unit = 1 tCO₂e terverifikasi; vintage (tahun reduksi) & metodologi menentukan harga pasarnya','Penjual yang baik menjual SEBAGIAN: sisakan untuk klaim net zero sendiri — menjual semua = membeli lagi kelak dengan lebih mahal'],
  next:['Pelajari mekanisme NEK: perdagangan emisi, offset, pungutan','Dalami harga karbon global vs domestik & arah regulasinya','Eksplorasi carbon project development sebagai lini bisnis baru']},
});
let mcd={};
function buildTrading(){
  freshScene(0xb8d0c0,0x121d18);
  cam={theta:0,phi:1.18,r:7,target:new THREE.Vector3(0,1.8,-1)};
  const Z=room(0x6b5a45,0xd8d2c4);
  /* papan reduksi */
  const base=box(1.5,1.0,.06,0x2b3a4a);base.position.set(-4.2,2.4,Z);scene.add(base);
  base.add(label('REDUKSI 2027: 612 tCO₂e ✓ verified',.6,'#8df0b8').translateY(.7));
  /* meja + dokumen metodologi */
  const desk=boxT(3.2,.08,1.3,TEX.wood());desk.position.set(-1,1.0,-.5);scene.add(desk);
  [[-1.4,-1.0],[1.4,-1.0],[-1.4,0],[1.4,0]].forEach(p=>{
    const l=boxT(.08,1,.08,TEX.wood());l.position.set(-1+p[0],.5,p[1]+0.45-.5);scene.add(l);});
  mcd.met=box(.5,.02,.7,0xf0ead8);mcd.met.position.set(-1.9,1.06,-.5);scene.add(mcd.met);
  actMesh(mcd.met,'METODE');
  scene.add(label('DOKUMEN METODOLOGI',.55,'#5fd4ff').translateX(-1.9).translateY(1.4).translateZ(-.5));
  /* layar SRN */
  mcd.S=makeDisplay(1.8,1.1,380,230);
  mcd.S.mesh.position.set(-1.4,2.6,Z+.08);scene.add(mcd.S.mesh);
  dispText(mcd.S,['SRN-PPI','belum terdaftar'],['#5fd4ff','#7d8f84']);
  actMesh(mcd.S.mesh,'SRN');
  scene.add(label('SISTEM REGISTRI NASIONAL',.65,'#5fd4ff').translateX(-1.4).translateY(3.35).translateZ(Z+.1));
  /* layar bursa */
  mcd.B=makeDisplay(2.6,1.5,480,280);
  mcd.B.mesh.position.set(2.6,2.5,Z+.08);scene.add(mcd.B.mesh);
  actMesh(mcd.B.mesh,'LISTING');
  scene.add(label('BURSA KARBON',.75,'#ffd23f').translateX(2.6).translateY(3.45).translateZ(Z+.1));
  function bursa(mode){
    const g=mcd.B.g,W=480,H=280;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='700 19px Consolas';g.textAlign='left';
    g.fillStyle='#ffd23f';g.fillText('IDX CARBON — papan perdagangan',16,32);
    g.font='600 16px Consolas';g.fillStyle='#8aa3bd';
    g.fillText('harga terakhir: Rp 58.000 /tCO2e',16,66);
    if(mode>=1){g.fillStyle='#eaf2fb';
      g.fillText('LISTING: 400 unit · vintage 2027',16,110);
      g.fillText('ask: Rp 59.500',16,138);}
    if(mode>=2){g.fillStyle='#46ff8e';g.font='700 18px Consolas';
      g.fillText('MATCHED ✓ 400 unit @ Rp 59.000',16,182);
      g.fillText('total: Rp 23,6 juta',16,210);
      g.fillStyle='#8aa3bd';g.font='600 15px Consolas';
      g.fillText('212 unit disimpan utk klaim sendiri',16,244);}
    mcd.B.tex.needsUpdate=true;}
  bursa(0);
  /* kontrak penjualan */
  mcd.deal=box(.5,.66,.04,0xe8d8a0);mcd.deal.position.set(5.2,2.0,Z+.06);scene.add(mcd.deal);
  actMesh(mcd.deal,'JUAL');
  scene.add(label('EKSEKUSI JUAL',.55,'#ffd23f').translateX(5.2).translateY(2.55).translateZ(Z+.1));
  startSeq([
   {type:'act',aid:'METODE',done:false,targets:()=>[mcd.met],
    desc:'Pilih METODOLOGI & uji kelayakan kredit (klik dokumen).',
    why:'Reduksi 612 t diuji tiga saringan: additionality (melebihi kewajiban? ya — baseline wajib sudah terlampaui), permanence (PLTS beroperasi jangka panjang? ya), MRV (terukur meter exim? ya). Metodologi pembangkit EBT dipilih — 612 t LOLOS jadi kandidat kredit.',
    fx(){toast('📐 Additionality ✓ permanence ✓ MRV ✓ — layak jadi kredit.','ok',3000);}},
   {type:'act',aid:'SRN',done:false,targets:()=>[mcd.S.mesh],
    desc:'REGISTRASI proyek & reduksi di SRN-PPI (klik layar registri).',
    why:'Registri nasional memberi tiap ton identitas unik — nomor seri yang membuatnya mustahil dijual dua kali (double counting, dosa terbesar pasar karbon). Verifikator menandatangani; 612 unit SPE-GRK terbit atas nama perusahaan.',
    fx(){dispText(mcd.S,['TERDAFTAR ✓','612 unit SPE-GRK'],['#46ff8e','#46ff8e']);
      toast('🗂️ 612 unit resmi bernomor seri — tak bisa dihitung ganda.','ok',3000);}},
   {type:'act',aid:'LISTING',done:false,targets:()=>[mcd.B.mesh],
    desc:'LISTING di bursa: berapa unit dijual, berapa disimpan?',
    why:'Keputusan strategis: jual 400, SIMPAN 212 untuk klaim net zero sendiri (ingat roadmap-mu!). Menjual semua = tahun depan membeli punya orang dengan harga lebih mahal demi klaim sendiri. Ask dipasang Rp 59.500 — sedikit di atas pasar, vintage muda pantas premium.',
    fx(){bursa(1);toast('📋 400 unit listed @ Rp 59.500 · 212 disimpan.','ok',3000);}},
   {type:'act',aid:'JUAL',done:false,targets:()=>[mcd.deal],
    desc:'Order masuk — EKSEKUSI penjualan (klik kontrak).',
    why:'Pembeli: perusahaan energi yang butuh offset residualnya. Matched di Rp 59.000 × 400 = Rp 23,6 juta — uang nyata dari udara yang TIDAK jadi kotor. Direktur tersenyum: program hijau kini punya baris pendapatan, bukan hanya baris biaya.',
    fx(){bursa(2);toast('💱 TERJUAL: Rp 23,6 jt — reduksi resmi jadi revenue!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Lingkaran penuh!</b> Dari inventarisasi → reduksi → verifikasi → registrasi → REVENUE. Karbon yang dikelola serius bukan beban kepatuhan — ia lini bisnis. Direkturmu kini penggemar net zero garis keras.');
    setTimeout(()=>showWin('trading'),2200);});
  say('VOLTA di sini 💱 Setahun kerja kerasmu berbuah: reduksi MELEBIHI target — dan kelebihannya bisa dijual. Tapi pasar karbon punya gerbang ketat: metodologi, registri, baru bursa. Satu ton pun tak boleh dihitung dua kali. Mulai!');
  $('#modTitle').textContent='J11·M4 — Perdagangan Karbon';
  $('#taskHead').textContent='REDUKSI → REGISTRI → REVENUE';}
MISSIONS.trading.build=buildTrading;
Object.assign(REAL,{
 trading:[
  'Pelajari regulasi NEK terkini (kepmen & aturan bursa) — pasar karbon Indonesia masih berevolusi cepat',
  'Biaya validasi-verifikasi signifikan: hitung kelayakan proyek sebelum berkomitmen jadi kredit',
  'Vintage & metodologi menentukan likuiditas — konsultasikan permintaan pasar sebelum listing',
  'Pisahkan jelas unit untuk dijual vs klaim sendiri di registri — tumpang tindih klaim = reputasi hancur'],
});

/* =====================================================================
   MISI 5 — CBAM: JEJAK KARBON PRODUK UNTUK EKSPOR
   ===================================================================== */
Object.assign(MISSIONS,{
 cbam:{lvl:'JALUR 11 · SUSTAINABILITY & CARBON · MISI 5',icon:'🛃',title:'CBAM: Jejak Karbon Produk Ekspor',strict:false,
  loc:'📍 PT Logam Jaya · Eksportir baja ringan ke Eropa',
  story:'Klien baru datang panik: pembeli Eropa menagih data CBAM — pajak karbon perbatasan UE. Tanpa angka emisi PER TON PRODUK yang sahih, baja ringan mereka kena tarif default yang mahalnya menyakitkan. Beda dengan inventarisasi pabrik (per perusahaan), kali ini hitunganmu harus menempel ke PRODUK: berapa kg CO₂e yang ikut terkirim dalam tiap ton baja?',
  goal:'Intensitas emisi produk terhitung sesuai metodologi CBAM, lebih rendah dari nilai default, dan laporan siap diserahkan ke importir Eropa.',
  obj:['Tetapkan batasan proses & data produksi','Hitung emisi langsung & tak langsung per ton produk','Bandingkan dengan default & susun laporan CBAM'],
  learn:['CBAM menghitung intensitas: tCO₂e per ton PRODUK — emisi pabrik dibagi output, dengan batasan proses yang ditetapkan aturan','Emisi langsung (bahan bakar proses) & tak langsung (listrik) dihitung terpisah — keduanya diminta pelaporan CBAM','Data aktual yang terdokumentasi hampir selalu MENANG melawan nilai default — default sengaja dibuat konservatif (tinggi)','Dekarbonisasi kini langsung = daya saing harga: tiap ton CO₂e yang dipangkas memangkas tarif produkmu di perbatasan'],
  next:['Ikuti perkembangan periode definitif CBAM & sektor cakupannya','Pelajari PCF (product carbon footprint) ISO 14067 untuk produk lain','Tawarkan jasa pendampingan CBAM — pasar baru profesi karbon']},
});
let mcb={};
function buildCBAM(){
  freshScene(0xb8d0c0,0x121d18);
  cam={theta:.05,phi:1.18,r:8,target:new THREE.Vector3(0,1.7,-.8)};
  const Z=room(0x6b5a45,0xd8d2c4,16,11);
  /* line produksi baja ringan */
  const furnace=boxT(1.6,1.4,1.1,TEX.metal(),{metalness:.3});furnace.position.set(-4.6,.75,-1.8);scene.add(furnace);
  actMesh(furnace,'BATAS');
  scene.add(label('FURNACE GAS',.65).translateX(-4.6).translateY(1.8).translateZ(-1.8));
  const roll=boxT(2.2,.9,.9,TEX.metal(),{metalness:.4});roll.position.set(-1.8,.5,-1.8);scene.add(roll);
  scene.add(label('ROLLING MILL',.65).translateX(-1.8).translateY(1.25).translateZ(-1.8));
  const coil=cyl(.5,.5,.6,0x8a96a2,20,{metalness:.6});coil.rotation.x=Math.PI/2;
  coil.position.set(.8,.5,-1.8);scene.add(coil);
  scene.add(label('PRODUK: BAJA RINGAN',.65,'#ffd23f').translateX(.8).translateY(1.3).translateZ(-1.8));
  /* papan perhitungan */
  const frame=boxT(4.0,2.4,.16,TEX.metal(),{metalness:.4});frame.position.set(3.4,2.4,Z+.05);scene.add(frame);
  frame.add(label('LEMBAR KERJA CBAM',.85).translateY(1.5));
  mcb.D=makeDisplay(3.7,2.1,560,320);
  mcb.D.mesh.position.set(3.4,2.4,Z+.15);scene.add(mcb.D.mesh);
  actMesh(mcb.D.mesh,'HITUNG');
  function lembar(mode){
    const g=mcb.D.g,W=560,H=320;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='600 16px Consolas';g.textAlign='left';
    g.fillStyle='#5fd4ff';g.font='700 18px Consolas';
    g.fillText('PRODUKSI 2027: 12.000 ton baja ringan',16,34);
    if(mode>=1){g.font='600 16px Consolas';g.fillStyle='#eaf2fb';
      g.fillText('LANGSUNG : gas furnace 9.840 tCO2e',16,82);
      g.fillText('T.LANGSUNG: listrik 6,2GWh x FE = 4.770 tCO2e',16,114);}
    if(mode>=2){g.fillStyle='#ffd23f';g.font='700 19px Consolas';
      g.fillText('INTENSITAS = 14.610 / 12.000',16,170);
      g.fillText('           = 1,22 tCO2e/ton',16,204);}
    if(mode>=3){g.fillStyle='#46ff8e';g.font='700 17px Consolas';
      g.fillText('DEFAULT UE: 1,80 → aktualmu 32% LEBIH RENDAH',16,254);
      g.fillStyle='#8aa3bd';g.font='600 14px Consolas';
      g.fillText('selisih tarif: signifikan utk 12.000 ton/tahun',16,286);}
    mcb.D.tex.needsUpdate=true;}
  lembar(0);
  /* dokumen data + laporan */
  mcb.data=box(.55,.1,.75,0xf0ead8);mcb.data.position.set(-1.0,1.06,.6);scene.add(mcb.data);
  actMesh(mcb.data,'DATA');
  const desk=boxT(1.8,.08,1.1,TEX.wood());desk.position.set(-1.0,1.0,.6);scene.add(desk);
  [[-.8,-.4],[.8,-.4],[-.8,.4],[.8,.4]].forEach(p=>{
    const l=boxT(.08,1,.08,TEX.wood());l.position.set(-1.0+p[0],.5,.6+p[1]);scene.add(l);});
  scene.add(label('DATA PRODUKSI & ENERGI',.6,'#5fd4ff').translateX(-1.0).translateY(1.5).translateZ(.6));
  mcb.rep=box(.5,.66,.04,0xe8d8a0);mcb.rep.position.set(5.8,1.1,Z+.06);scene.add(mcb.rep);
  actMesh(mcb.rep,'LAPOR');
  scene.add(label('LAPORAN CBAM',.55,'#ffd23f').translateX(5.8).translateY(1.65).translateZ(Z+.1));
  startSeq([
   {type:'act',aid:'BATAS',done:false,targets:()=>[furnace],
    desc:'Tetapkan BATASAN proses sesuai aturan CBAM (klik furnace).',
    why:'CBAM menentukan proses mana yang masuk hitungan untuk tiap kategori produk: di sini furnace + rolling masuk, kantor & kantin tidak. Batasan yang salah = seluruh hitungan gugur saat diverifikasi importir. Peta dulu, angka kemudian.',
    fx(){toast('🗺️ Batasan ditetapkan: furnace + rolling mill (sesuai kategori).','ok',2800);}},
   {type:'act',aid:'DATA',done:false,targets:()=>[mcb.data],
    desc:'Kumpulkan DATA setahun: produksi, gas, listrik (klik dokumen).',
    why:'12.000 ton produk · faktur gas furnace 12 bulan · rekening listrik 6,2 GWh — semua dari dokumen primer yang bisa diaudit. CBAM menuntut jejak yang sama kerasnya dengan verifikasi GHG yang pernah kamu lalui: pengalamanmu terpakai penuh.',
    fx(){toast('📚 Data primer 12 bulan lengkap & teraudit.','ok',2600);}},
   {type:'act',aid:'HITUNG',done:false,targets:()=>[mcb.D.mesh],
    desc:'HITUNG: emisi langsung + tak langsung (klik lembar kerja).',
    why:'Langsung: pembakaran gas furnace = 9.840 tCO₂e. Tak langsung: listrik 6,2 GWh × faktor grid = 4.770 tCO₂e. Dua jalur dihitung terpisah persis format pelaporan CBAM — penggabungan yang serampangan adalah penolakan yang tertunda.',
    fx(){lembar(1);toast('🧮 Langsung 9.840 + tak langsung 4.770 tCO₂e.','ok',2800);}},
   {type:'act',aid:'INTENS',done:false,targets:()=>[mcb.D.mesh],
    desc:'Bagi ke produk: berapa INTENSITAS per ton?',
    why:'14.610 tCO₂e ÷ 12.000 ton = 1,22 tCO₂e/ton baja ringan. Inilah angka yang menempel di tiap kontainer menuju Rotterdam — paspor karbon produk. Dan pembanding resminya: nilai default UE 1,80.',
    fx(){lembar(2);toast('⚖️ Intensitas: 1,22 tCO₂e/ton produk.','ok',2800);}},
   {type:'act',aid:'LAPOR',done:false,targets:()=>[mcb.rep],
    desc:'Susun LAPORAN CBAM & serahkan ke importir (klik laporan).',
    why:'Aktual 1,22 vs default 1,80: dokumentasimu menghemat 32% beban tarif klien — jutaan rupiah PER KONTAINER. Dan satu insight bonus untuk mereka: pasang PLTS, intensitas turun lagi, tarif ikut turun. Dekarbonisasi kini tertulis di kolom harga.',
    fx(){lembar(3);toast('🛃 Laporan CBAM siap — klien hemat 32% tarif perbatasan!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Paspor karbon produk terbit!</b> Batasan benar, data primer, dua jalur emisi, intensitas 1,22 — jauh di bawah default. Di era CBAM, akuntan karbon adalah bagian dari tim ekspor.');
    setTimeout(()=>showWin('cbam'),2200);});
  const s2=seq.steps[2],of2=s2.fx;s2.fx=()=>{of2();mcb.D.mesh.userData.aid='INTENS';};
  say('VOLTA di sini 🛃 Klien panik: Eropa menagih <b>CBAM</b> — pajak karbon perbatasan. Kali ini hitunganmu menempel ke PRODUK: tCO₂e per ton baja. Kalahkan nilai default, selamatkan daya saing mereka. Mulai dari batasan proses!');
  $('#modTitle').textContent='J11·M5 — CBAM & Jejak Karbon Produk';
  $('#taskHead').textContent='PER TON PRODUK, BUKAN PER PABRIK';}
MISSIONS.cbam.build=buildCBAM;
Object.assign(REAL,{
 cbam:[
  'Ikuti regulasi CBAM terbaru: cakupan sektor, periode pelaporan & metodologi masih berkembang',
  'Importir UE adalah pihak pelapor — eksportir menyuplai data; bangun template komunikasi yang konsisten',
  'Sistem pencatatan energi per line produksi memudahkan alokasi — investasi metering terbayar di tarif',
  'Simulasikan dampak dekarbonisasi (PLTS, efisiensi) langsung ke tarif CBAM — bahasa baru untuk ROI hijau'],
});

/* =====================================================================
   MISI 6 — SCOPE 3: DEKARBONISASI RANTAI PASOK
   ===================================================================== */
Object.assign(MISSIONS,{
 scope3:{lvl:'JALUR 11 · SUSTAINABILITY & CARBON · MISI 6',icon:'🔗',title:'Scope 3: Dekarbonisasi Rantai Pasok',strict:false,
  loc:'📍 PT Maju Plastik · Program supplier engagement',
  story:'Scope 1 & 2 sudah kamu taklukkan — tapi gajah di ruangan bernama Scope 3 masih berdiri: emisi 40 pemasok yang bukan milikmu, tak bisa kamu perintah, namun menempel di laporanmu. Mengirim surat ancaman? Mereka akan diam. Seni dekarbonisasi rantai pasok adalah membuat pemasok MAU — dan itu dimulai dari data, prioritas, dan bantuan nyata.',
  goal:'Program supplier engagement berjalan: hotspot teridentifikasi dari spend analysis, pemasok prioritas terlibat sukarela, dan satu pilot project membuktikan model bisa ditiru.',
  obj:['Petakan emisi pemasok dengan spend analysis','Prioritaskan & dekati pemasok kunci dengan tawaran bantuan','Jalankan pilot & rancang skema insentif berkelanjutan'],
  learn:['Scope 3 dihitung bertingkat: mulai kasar dari spend-based (rupiah × faktor industri), lalu naik presisi ke data primer pemasok prioritas','Hukum pareto rantai pasok: ±20% pemasok menyumbang ±80% emisi — energi engagement difokuskan, bukan disebar rata','Pemasok bergerak karena insentif, bukan ceramah: kontrak lebih panjang, volume, pendampingan teknis gratis — bahasa yang mereka pahami','Satu pilot sukses bernilai lebih dari seratus webinar: pemasok percaya pada tetangganya yang hemat, bukan pada slide-mu'],
  next:['Pelajari supplier scorecard & integrasi kriteria karbon ke procurement','Dalami PCF exchange: pemasok mengirim data produk terverifikasi','Eksplorasi pembiayaan hijau rantai pasok (supply chain finance)']},
});
let ms3={};
function buildScope3(){
  freshScene(0xb8d0c0,0x121d18);
  cam={theta:.05,phi:1.17,r:8,target:new THREE.Vector3(0,1.8,-.8)};
  const Z=room(0x6b5a45,0xd8d2c4,16,11);
  /* layar spend analysis */
  const frame=boxT(4.2,2.4,.16,TEX.metal(),{metalness:.4});frame.position.set(-2.4,2.4,Z+.05);scene.add(frame);
  frame.add(label('PETA EMISI 40 PEMASOK',.85).translateY(1.5));
  ms3.D=makeDisplay(3.9,2.1,560,320);
  ms3.D.mesh.position.set(-2.4,2.4,Z+.15);scene.add(ms3.D.mesh);
  actMesh(ms3.D.mesh,'PETA');
  function peta(mode){
    const g=ms3.D.g,W=560,H=320;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='700 17px Consolas';g.textAlign='left';
    g.fillStyle='#5fd4ff';g.fillText('SPEND ANALYSIS → EMISI (tCO2e/thn)',16,30);
    const bars=[['Resin A (PT Polindo)',420,'#ff5a5a'],['Transportir',180,'#ffd23f'],
      ['Kemasan',95,'#ffd23f'],['Resin B',88,'#ffd23f'],['36 lainnya',117,'#46ff8e']];
    bars.forEach((b,i)=>{const y=66+i*48;
      g.fillStyle='#8aa3bd';g.font='600 14px Consolas';g.fillText(b[0],16,y);
      g.fillStyle=b[2];g.fillRect(220,y-14,b[1]*.62,20);
      g.fillText(b[1]+'',230+b[1]*.62,y);});
    if(mode>=1){g.fillStyle='#ffd23f';g.font='700 15px Consolas';
      g.fillText('4 pemasok = 78% emisi → fokus di sini',16,H-16);}
    ms3.D.tex.needsUpdate=true;}
  peta(0);
  /* figur pemasok */
  ms3.sup=new THREE.Group();
  const badan=cyl(.22,.28,.9,0x6a4a8a);badan.position.y=.72;ms3.sup.add(badan);
  const kepala=new THREE.Mesh(new THREE.SphereGeometry(.15,14,12),
    new THREE.MeshStandardMaterial({color:0xd8b090}));kepala.position.y=1.36;ms3.sup.add(kepala);
  ms3.sup.position.set(2.2,0,.6);scene.add(ms3.sup);
  actMesh(badan,'DEKATI');
  scene.add(label('DIREKTUR PT POLINDO (resin)',.6).translateX(2.2).translateY(1.85).translateZ(.6));
  /* pabrik pemasok mini (pilot) */
  ms3.pab=boxT(1.8,1.2,1.0,TEX.plaster());ms3.pab.position.set(4.8,.65,-1.8);scene.add(ms3.pab);
  ms3.pv=box(1.2,.05,.7,0x16263e,{roughness:.25});ms3.pv.position.set(4.8,1.35,-1.8);
  ms3.pv.rotation.x=-.2;ms3.pv.visible=false;scene.add(ms3.pv);
  actMesh(ms3.pab,'PILOT');
  scene.add(label('PABRIK POLINDO — kandidat pilot',.6,'#5fd4ff').translateX(4.8).translateY(1.95).translateZ(-1.8));
  /* lembar insentif */
  ms3.ins=box(.5,.66,.04,0xd8e8d8);ms3.ins.position.set(1.2,2.3,Z+.06);scene.add(ms3.ins);
  actMesh(ms3.ins,'INSENTIF');
  scene.add(label('SKEMA INSENTIF',.55,'#8df0b8').translateX(1.2).translateY(2.85).translateZ(Z+.1));
  startSeq([
   {type:'act',aid:'PETA',done:false,targets:()=>[ms3.D.mesh],
    desc:'Petakan 40 pemasok dengan SPEND ANALYSIS (klik layar).',
    why:'Belum perlu menyurvei 40 perusahaan: belanja per kategori × faktor emisi industri memberi peta kasar yang cukup untuk MEMILIH medan perang. Hasil: pemasok resin A sendirian menyumbang 420 ton — hampir setengah Scope 3 upstream. Pareto bekerja seperti biasa.',
    fx(){peta(1);toast('🗺️ 4 dari 40 pemasok = 78% emisi — medan dipilih.','ok',3000);}},
   {type:'act',aid:'DEKATI',done:false,targets:()=>[ms3.sup.children[0]],
    desc:'DEKATI pemasok terbesar — dengan tawaran, bukan tuntutan (klik beliau).',
    why:'Kalimat pembukanya menentukan nasib program: bukan "kalian harus lapor emisi" melainkan "kami ingin membantu pabrik Anda hemat energi — gratis, auditor kami yang turun." Direktur Polindo, yang tadinya defensif, bertanya: "gratis... seriusan?" Pintu terbuka oleh nilai, bukan tekanan.',
    fx(){toast('🤝 Polindo setuju walkthrough audit gratis — pintu terbuka.','ok',3000);}},
   {type:'act',aid:'PILOT',done:false,targets:()=>[ms3.pab],
    desc:'Jalankan PILOT: audit + quick win di pabrik Polindo (klik pabrik).',
    why:'Ilmu audit-mu dipinjamkan ke seberang pagar: kompresor bocor, setting chiller, jadwal WBP — hemat 11% tagihan TANPA investasi, emisi turun 46 ton. Polindo senang (biaya turun), kamu senang (Scope 3 turun), dan ceritanya mulai berkeliling ke pemasok lain. Bukti menular.',
    fx(){ms3.pv.visible=true;
      toast('🏭 Pilot sukses: Polindo hemat 11% · Scope 3 −46 t — cerita menyebar.','ok',3200);}},
   {type:'act',aid:'INSENTIF',done:false,targets:()=>[ms3.ins],
    desc:'Lembagakan: rancang SKEMA INSENTIF jangka panjang (klik lembar).',
    why:'Agar tak berhenti di satu cerita: pemasok yang melapor data & punya target reduksi mendapat kontrak 2 tahun (bukan tahunan) + prioritas volume. Procurement memegang kuncinya kini — kriteria karbon resmi masuk scorecard pemasok. Rantai pasok mulai berlomba ke arah yang benar.',
    fx(){toast('📜 Insentif terlembaga: kontrak panjang utk yang bergerak — 9 pemasok mendaftar!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Gajah Scope 3 mulai berjalan!</b> Dipetakan dengan pareto, didekati dengan nilai, dibuktikan dengan pilot, dilembagakan dengan insentif. Rantai pasok tak bisa diperintah — tapi bisa diajak menang bersama.');
    setTimeout(()=>showWin('scope3'),2200);});
  say('VOLTA di sini 🔗 Musuh terakhir akuntansi karbon: <b>Scope 3</b> — emisi orang lain yang menempel di laporanmu. Empat puluh pemasok takkan tunduk pada surat edaran. Senjatamu: pareto, tawaran bantuan, dan satu pilot yang menular.');
  $('#modTitle').textContent='J11·M6 — Dekarbonisasi Rantai Pasok';
  $('#taskHead').textContent='AJAK MENANG, BUKAN PERINTAH';}
MISSIONS.scope3.build=buildScope3;
Object.assign(REAL,{
 scope3:[
  'Mulai spend-based lalu tingkatkan ke data primer untuk pemasok prioritas — presisi bertahap itu sah',
  'Sediakan template pelaporan sederhana — pemasok UKM mundur melihat spreadsheet 14 tab',
  'Lindungi kerahasiaan data pemasok (NDA) — data energi adalah data biaya produksi mereka',
  'Ukur program dengan dua angka: % emisi tercakup data primer & tren intensitas pemasok prioritas'],
});

/* =====================================================================
   MISI 7 — RISIKO IKLIM: AUDIT KETAHANAN ASET
   ===================================================================== */
Object.assign(MISSIONS,{
 risiko:{lvl:'JALUR 11 · SUSTAINABILITY & CARBON · MISI 7',icon:'🌪️',title:'Risiko Iklim: Audit Ketahanan Aset',strict:false,
  loc:'📍 PT Maju Plastik · Permintaan asuransi & bank',
  story:'Surat dari dua arah sekaligus: bank menanyakan eksposur risiko iklim sebelum memperpanjang kredit, dan asuransi menaikkan premi 30% "karena lokasi". Selama ini kamu menghitung dampak pabrik TERHADAP iklim — kini sebaliknya: dampak iklim TERHADAP pabrik. Banjir, gelombang panas, dan angin bukan lagi cerita cuaca; mereka baris risiko finansial yang harus dipetakan, dihitung, dan dilawan.',
  goal:'Profil risiko iklim pabrik tersusun: bahaya fisik teridentifikasi dari data, aset kritis ternilai kerentanannya, dan rencana adaptasi ber-prioritas meyakinkan bank & asuransi.',
  obj:['Identifikasi bahaya iklim lokasi dari data historis & proyeksi','Nilai kerentanan aset kritis terhadap tiap bahaya','Susun adaptasi ber-prioritas & laporkan ke bank'],
  learn:['Risiko iklim fisik = bahaya × paparan × kerentanan: lokasi yang sama bisa berisiko beda tergantung di mana panel listrikmu dipasang','Data bicara dua bahasa: historis (banjir 2021 setinggi 40 cm) & proyeksi (intensitas hujan naik) — adaptasi dirancang untuk masa depan, bukan masa lalu','Aset listrik adalah titik lemah klasik: panel di lantai dasar, trafo di halaman rendah — kerusakan airnya kecil, kerugian STOP PRODUKSInya raksasa','Adaptasi ber-prioritas dari rupiah-risiko: meninggikan panel listrik (puluhan juta) mencegah kerugian miliaran — bahasa yang langsung dipahami bank & asuransi'],
  next:['Pelajari kerangka pelaporan risiko iklim (TCFD/ISSB)','Dalami business continuity plan untuk skenario iklim ekstrem','Tawarkan jasa climate risk assessment — permintaan bank terus naik']},
});
let mrk={};
function buildRisiko(){
  freshScene(0x8a98a8,0x10161e);
  cam={theta:.05,phi:1.15,r:9,target:new THREE.Vector3(0,1.6,-.8)};
  const ground=boxT(22,.1,13,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  /* pabrik + panel listrik rendah + trafo halaman */
  const fab=boxT(5,2.6,3,TEX.plaster());fab.position.set(-2,1.3,-2.5);scene.add(fab);
  fab.add(label('PT MAJU PLASTIK',.85).translateY(1.75));
  mrk.panel=boxT(.9,1.2,.3,TEX.metal(),{metalness:.35});mrk.panel.position.set(.9,.65,-1.2);scene.add(mrk.panel);
  actMesh(mrk.panel,'ASET');
  scene.add(label('PANEL UTAMA — 40 cm dari tanah!',.6,'#ffd23f').translateX(1.4).translateY(1.5).translateZ(-1.0));
  const trafo=boxT(1.1,1.1,.9,TEX.metal(),{metalness:.3});trafo.position.set(3.6,.6,-2.2);scene.add(trafo);
  scene.add(label('TRAFO HALAMAN',.6).translateX(3.6).translateY(1.4).translateZ(-2.2));
  /* layar data iklim */
  const frame=boxT(3.8,2.2,.16,TEX.metal(),{metalness:.4});frame.position.set(-5.6,2.4,-2.4);frame.rotation.y=.5;scene.add(frame);
  mrk.D=makeDisplay(3.5,1.9,520,300);
  mrk.D.mesh.position.set(-5.52,2.4,-2.32);mrk.D.mesh.rotation.y=.5;scene.add(mrk.D.mesh);
  actMesh(mrk.D.mesh,'DATA');
  scene.add(label('DATA IKLIM LOKASI',.75,'#5fd4ff').translateX(-5.6).translateY(3.7).translateZ(-2.3));
  function layar(mode){
    const g=mrk.D.g,W=520,H=300;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='600 15px Consolas';g.textAlign='left';
    g.fillStyle='#5fd4ff';g.font='700 17px Consolas';
    g.fillText('BAHAYA FISIK — LOSARANG',16,32);
    g.font='600 15px Consolas';
    const rows=[['BANJIR','2021: 40cm · proyeksi: naik','#ff5a5a'],
      ['GEL. PANAS','hari >35°C: 12→28/thn','#ffd23f'],
      ['ANGIN','puting beliung 2x/dekade','#ffd23f'],
      ['KEKERINGAN','pasokan air: moderat','#46ff8e']];
    rows.forEach((r,i)=>{const y=72+i*40;
      g.fillStyle=r[2];g.fillText(r[0],16,y);
      g.fillStyle='#8aa3bd';g.fillText(r[1],150,y);});
    if(mode>=1){g.fillStyle='#ff5a5a';g.font='700 15px Consolas';
      g.fillText('risiko terbesar: BANJIR x PANEL 40cm = stop 2-4 minggu',16,H-18);}
    mrk.D.tex.needsUpdate=true;}
  layar(0);
  /* lembar adaptasi + laporan bank */
  mrk.adapt=box(.6,.75,.05,0xd8e8d8);mrk.adapt.position.set(5.8,2.0,-2.4);scene.add(mrk.adapt);
  actMesh(mrk.adapt,'ADAPT');
  scene.add(label('RENCANA ADAPTASI',.6,'#8df0b8').translateX(5.8).translateY(2.6).translateZ(-2.3));
  mrk.bank=box(.5,.66,.04,0xe8d8a0);mrk.bank.position.set(5.8,.9,-2.4);scene.add(mrk.bank);
  actMesh(mrk.bank,'BANK');
  scene.add(label('LAPORAN KE BANK',.55,'#ffd23f').translateX(5.8).translateY(.45).translateZ(-2.3));
  startSeq([
   {type:'act',aid:'DATA',done:false,targets:()=>[mrk.D.mesh],
    desc:'Kumpulkan DATA bahaya: historis + proyeksi lokasi (klik layar).',
    why:'BMKG, peta rawan banjir daerah, dan kesaksian: banjir 2021 masuk 40 cm ke halaman; hari ber-suhu >35°C naik dari 12 ke 28 per tahun (chiller bekerja lebih berat — terhubung audit-mu!). Risiko iklim dimulai dari data lokasi yang jujur, bukan rata-rata nasional yang menenangkan.',
    fx(){toast('🌪️ 4 bahaya terpetakan — banjir & panas naik kelas.','ok',3000);}},
   {type:'act',aid:'ASET',done:false,targets:()=>[mrk.panel],
    desc:'Nilai KERENTANAN aset kritis — temukan titik lemahnya (klik panel).',
    why:'Tur kerentanan: panel listrik utama 40 cm dari tanah (banjir 2021 nyaris menciumnya!), trafo di titik terendah halaman, gudang bahan baku higroskopis di lantai dasar. Matriks bahaya×aset menjerit di satu sel: BANJIR × PANEL = produksi mati 2-4 minggu + Rp 3-5 M. Kerusakan kecil, kelumpuhan raksasa.',
    fx(){layar(1);toast('⚠️ Sel merah: banjir x panel listrik = lumpuh 2-4 minggu.','bad',3200);}},
   {type:'act',aid:'ADAPT',done:false,targets:()=>[mrk.adapt],
    desc:'Susun ADAPTASI ber-prioritas rupiah-risiko (klik rencana).',
    why:'Urut dari pengembalian tertinggi: (1) naikkan panel & MCC ke +1,2 m — Rp 180 jt mencegah Rp 3-5 M; (2) tanggul portabel & SOP banjir (latihan tahunan); (3) kapasitas chiller dievaluasi untuk 28 hari panas; (4) asuransi di-renegosiasi DENGAN bukti adaptasi. Adaptasi bukan biaya — ia diskon premi & kredit yang berlanjut.',
    fx(){toast('🛡️ 4 adaptasi ber-prioritas — Rp 180 jt menjaga Rp 5 M.','ok',3200);}},
   {type:'act',aid:'BANK',done:false,targets:()=>[mrk.bank],
    desc:'Laporkan ke BANK & asuransi dengan kerangka resmi (klik laporan).',
    why:'Laporan ala TCFD: bahaya teridentifikasi, dampak finansial terkuantifikasi, adaptasi terjadwal & teranggarkan. Bank memperpanjang kredit tanpa syarat tambahan; asuransi meninjau ulang premi +30% menjadi +8% "berkat mitigasi terdokumentasi". Risiko yang dipetakan adalah risiko yang bisa dinegosiasikan.',
    fx(){toast('🏦 Kredit lanjut + premi turun — risiko terpetakan = daya tawar.','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Pabrik kini siap menghadapi iklim yang berubah!</b> Bahaya dibaca dari data, titik lemah ditemukan di panel 40 cm, dan Rp 180 juta adaptasi menjaga miliaran. Profesi karbonmu kini lengkap dua arah: mengurangi DAN bertahan.');
    setTimeout(()=>showWin('risiko'),2200);});
  say('VOLTA di sini 🌪️ Selama ini kamu menghitung dampak pabrik ke iklim — kini sebaliknya: <b>dampak iklim ke pabrik</b>. Bank & asuransi menunggu jawabannya. Mulai dari data bahaya lokasi!');
  $('#modTitle').textContent='J11·M7 — Risiko Iklim & Adaptasi';
  $('#taskHead').textContent='BAHAYA × PAPARAN × KERENTANAN';}
MISSIONS.risiko.build=buildRisiko;
Object.assign(REAL,{
 risiko:[
  'Gunakan beberapa skenario iklim (moderat & ekstrem) — masa depan bukan satu garis',
  'Verifikasi elevasi banjir dengan survei topografi lokal, bukan hanya peta nasional kasar',
  'Adaptasi diuji drill (banjir datang jam 2 pagi: siapa berbuat apa?) — rencana di laci tak menyelamatkan',
  'Tinjau ulang tiap 2-3 tahun: data iklim, aset baru & pelajaran kejadian terkini'],
});

/* =====================================================================
   MISI 8 — ESG RATING: SAAT INVESTOR MENILAI RAPORMU
   ===================================================================== */
Object.assign(MISSIONS,{
 esg:{lvl:'JALUR 11 · SUSTAINABILITY & CARBON · MISI 8',icon:'⭐',title:'ESG Rating: Saat Investor Menilai Rapormu',strict:false,
  loc:'📍 PT Maju Plastik · Kuesioner rating ESG dari investor',
  story:'Grup investor calon pembeli saham minoritas mengirim paket yang membuat direksi pucat: kuesioner ESG rating 240 pertanyaan — lingkungan, sosial, tata kelola. Kabar baiknya: kerja kerasmu bertahun-tahun (GHG, ISO, K3, rantai pasok) adalah jawabannya. Kabar buruknya: jawaban tanpa BUKTI dinilai nol, dan skor ini menentukan valuasi. Saatnya merangkai semua kepingan jadi satu rapor.',
  goal:'Kuesioner terjawab dengan bukti tertaut, gap teridentifikasi jujur dengan rencana perbaikan, dan skor rating naik kelas — membuka pintu investasi.',
  obj:['Petakan 240 pertanyaan ke bukti yang sudah ada','Isi jujur: yang ada dibuktikan, yang belum direncanakan','Kawal proses penilaian & tindak lanjuti hasil'],
  learn:['ESG rating menilai BUKTI, bukan niat: kebijakan tanpa data implementasi = skor setengah; "sedang disusun" = nol — arsip rapimu selama ini adalah emasnya','E-S-G saling menumpang: GHG & ISO 50001-mu mengisi E, program K3 & CSMS mengisi S, struktur kebijakan & audit mengisi G — kerja teknis bertahun ternyata sudah membangun rapor','Gap yang diakui + rencana ber-tanggal dinilai LEBIH TINGGI dari gap yang ditutupi — penilai profesional mencium jawaban kosmetik','Skor ESG kini masuk rumus uang sungguhan: biaya bunga, valuasi, akses tender — keberlanjutan resmi pindah dari CSR ke neraca'],
  next:['Pelajari kerangka pelaporan utama (GRI, ISSB) & pemetaannya','Bangun ESG data room permanen — kuesioner berikutnya pasti datang','Dalami double materiality: apa yang penting bagi bisnis & dunia']},
});
let mes={};
function buildESG(){
  freshScene(0xb8d0c0,0x121d18);
  cam={theta:0,phi:1.17,r:7.5,target:new THREE.Vector3(0,1.8,-.8)};
  const Z=room(0x6b5a45,0xd8d2c4,16,11);
  /* tumpukan kuesioner */
  mes.kues=box(.6,.3,.8,0xe8e4d8);mes.kues.position.set(-3.6,1.2,-.4);scene.add(mes.kues);
  actMesh(mes.kues,'PETAKAN');
  const desk=boxT(2.4,.08,1.2,TEX.wood());desk.position.set(-3.6,1.0,-.4);scene.add(desk);
  [[-1,-.4],[1,-.4],[-1,.4],[1,.4]].forEach(p=>{
    const l=boxT(.08,1,.08,TEX.wood());l.position.set(-3.6+p[0],.5,-.4+p[1]);scene.add(l);});
  scene.add(label('KUESIONER ESG — 240 SOAL',.65,'#ffd23f').translateX(-3.6).translateY(1.7).translateZ(-.4));
  /* rak arsip kerja lama */
  mes.rak=box(1.4,1.8,.4,0x8a6a3a);mes.rak.position.set(-.6,1.0,Z+.05);scene.add(mes.rak);
  ['GHG','ISO','K3','CSMS','M&V'].forEach((t,i)=>{
    scene.add(label(t,.4,'#ffd9a0').translateX(-1.1+i*.27).translateY(1.5-(i%2)*.5).translateZ(Z+.3));});
  actMesh(mes.rak,'BUKTI');
  scene.add(label('ARSIP KERJA BERTAHUN-TAHUN',.65,'#5fd4ff').translateX(-.6).translateY(2.25).translateZ(Z+.1));
  /* layar skor */
  const frame=boxT(3.2,2.0,.16,TEX.metal(),{metalness:.4});frame.position.set(2.8,2.4,Z+.05);scene.add(frame);
  frame.add(label('SCORECARD ESG',.8).translateY(1.25));
  mes.D=makeDisplay(2.9,1.7,480,290);
  mes.D.mesh.position.set(2.8,2.4,Z+.15);scene.add(mes.D.mesh);
  actMesh(mes.D.mesh,'GAP');
  function skor(mode){
    const g=mes.D.g,W=480,H=290;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='600 15px Consolas';g.textAlign='left';
    const rows=mode===0?
      [['E — Lingkungan','?','#5d748c'],['S — Sosial','?','#5d748c'],['G — Tata kelola','?','#5d748c']]:
      [['E — Lingkungan',mode>=2?'78 ↑':'72','#46ff8e'],['S — Sosial',mode>=2?'74 ↑':'70','#46ff8e'],
       ['G — Tata kelola',mode>=2?'66 ↑':'58 ⚠','#ffd23f']];
    g.fillStyle='#5fd4ff';g.font='700 17px Consolas';
    g.fillText('SKOR (0-100)',16,30);
    g.font='600 15px Consolas';
    rows.forEach((r,i)=>{const y=72+i*46;
      g.fillStyle='#8aa3bd';g.fillText(r[0],16,y);
      g.fillStyle=r[2];g.fillText(r[1],330,y);});
    if(mode>=2){g.fillStyle='#46ff8e';g.font='700 16px Consolas';
      g.fillText('RATING: BB → A− · investor LANJUT',16,H-20);}
    mes.D.tex.needsUpdate=true;}
  skor(0);
  /* lembar rencana gap */
  mes.plan=box(.5,.66,.04,0xffe8c0);mes.plan.position.set(5.4,2.0,Z+.06);scene.add(mes.plan);
  actMesh(mes.plan,'RENCANA');
  scene.add(label('RENCANA PERBAIKAN GAP',.55,'#ffd23f').translateX(5.4).translateY(2.55).translateZ(Z+.1));
  startSeq([
   {type:'act',aid:'PETAKAN',done:false,targets:()=>[mes.kues],
    desc:'PETAKAN 240 pertanyaan ke kepingan yang sudah ada (klik kuesioner).',
    why:'Dibedah per pilar: pertanyaan E (emisi, energi, air, limbah) — 80% terjawab oleh GHG inventory, ISO 50001, mass balance PLTSa! S (K3, pekerja, komunitas) — CSMS & program heat stress-mu siap pakai. G (kebijakan, audit, anti-korupsi) — sebagian ada… sebagian bolong. Peta selesai: 71% punya jawaban, sisanya jujur diakui.',
    fx(){toast('🗺️ 240 soal terpeta: 71% terjawab arsip lama — sisanya gap.','ok',3200);}},
   {type:'act',aid:'BUKTI',done:false,targets:()=>[mes.rak],
    desc:'Tautkan BUKTI: tiap jawaban menunjuk dokumen (klik rak arsip).',
    why:'Inilah momen arsip rapi membayar dirinya: laporan GHG terverifikasi, sertifikat ISO, scorecard CSMS, log M&V — tiap klaim ditautkan dokumen ber-tanggal. Penilai ESG profesional bekerja seperti verifikator yang pernah kamu hadapi: klaim tanpa lampiran dianggap angan-angan.',
    fx(){toast('📎 168 jawaban tertaut bukti — klaim jadi fakta.','ok',3000);}},
   {type:'act',aid:'GAP',done:false,targets:()=>[mes.D.mesh],
    desc:'Hadapi cermin: baca skor awal & GAP terbesar (klik scorecard).',
    why:'Pra-penilaian: E 72, S 70… G hanya 58 — bolongnya di tata kelola: belum ada kebijakan anti-korupsi formal, whistleblowing channel, & keberlanjutan belum dibahas rutin di rapat direksi. Klasik perusahaan teknik: kuat di lapangan, lupa di ruang rapat. Cermin tak menyenangkan — tapi cermin tak berbohong.',
    fx(){skor(1);toast('🪞 G = 58: kuat di lapangan, bolong di tata kelola.','bad',3200);}},
   {type:'act',aid:'RENCANA',done:false,targets:()=>[mes.plan],
    desc:'Jawab gap dengan RENCANA ber-tanggal, lalu kawal penilaian (klik lembar).',
    why:'Gap G dijawab bukan kosmetik: kebijakan anti-korupsi disahkan direksi (bulan ini), whistleblowing channel pihak ketiga (kuartal ini), agenda ESG tetap di rapat direksi (mulai sekarang) — semua ber-PIC & tanggal. Hasil akhir penilai: E 78, S 74, G 66 → rating BB naik ke A−. Investor lanjut ke tahap berikutnya — dan menyebut "kualitas dokumentasi" sebagai alasannya.',
    fx(){skor(2);toast('⭐ BB → A− — investor lanjut. Arsip rapi = valuasi!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Rapor ESG kelas A−!</b> Kerja teknis bertahun-tahun dirangkai jadi jawaban berbukti, gap diakui dengan rencana ber-tanggal, dan tata kelola akhirnya menyusul lapangan. Keberlanjutan kini resmi bicara bahasa investor — dan kamu penerjemahnya.');
    setTimeout(()=>showWin('esg'),2200);});
  say('VOLTA di sini ⭐ Paket dari investor: <b>kuesioner ESG 240 soal</b> — dan skornya menentukan valuasi. Kabar baik: semua kerja kerasmu adalah jawabannya. Kabar buruk: tanpa bukti tertaut, nilainya nol. Mulai memetakan!');
  $('#modTitle').textContent='J11·M8 — ESG Rating';
  $('#taskHead').textContent='BUKTI, BUKAN NIAT';}
MISSIONS.esg.build=buildESG;
Object.assign(REAL,{
 esg:[
  'Bangun ESG data room permanen dgn pemilik per indikator — kuesioner datang tiap tahun dari arah berbeda',
  'Jangan menjawab melebihi bukti: overclaim yang ketahuan menghancurkan seluruh kredibilitas rapor',
  'Pelajari metodologi penilai spesifik (tiap lembaga beda bobot) sebelum mengisi',
  'Jadikan temuan gap sebagai roadmap tahunan ESG — rating adalah efek samping dari sistem yang sehat'],
});
