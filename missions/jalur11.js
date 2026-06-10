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
