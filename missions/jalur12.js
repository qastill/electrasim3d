/* =====================================================================
   ElectraSim VR 3D — EV & EV CHARGING
   Misi: M1 ev (Komisioning SPKLU) · M2 evfix (Troubleshooting SPKLU Error)
   Dimuat on-demand oleh index.html lewat ensureMission().
   ===================================================================== */

Object.assign(MISSIONS,{
 ev:{lvl:'JALUR 12 · EV & EV CHARGING',icon:'🚗',title:'Komisioning SPKLU',strict:false,
  loc:'📍 SPKLU baru · Rest Area KM 158 Tol Cipali',
  story:'Unit SPKLU 25 kW baru tiba di rest area KM 158. Tugasmu: sambungkan suplai dari panel ke unit, lalu jalankan prosedur komisioning sampai mobil listrik pertama berhasil mengisi daya. Grounding di sini bukan formalitas — charger memeriksa pembumian sebelum mau bekerja.',
  goal:'SPKLU tersambung, lolos uji komisioning, dan sukses mengisi daya kendaraan pertama.',
  obj:['Wiring suplai: sumber → MCCB → unit SPKLU + grounding','Uji isolasi & pembumian sebelum energize','ON MCCB → autentikasi kartu → colok gun → charging!'],
  learn:['Charger menolak beroperasi tanpa pembumian baik (proteksi arus bocor DC)','Urutan komisioning: uji dulu, energize kemudian — tak pernah terbalik','Alur transaksi SPKLU: autentikasi → handshake gun-kendaraan → charging','Mode 3/4 charging: komunikasi pilot antara EVSE dan kendaraan'],
  next:['Pelajari OCPP: protokol SPKLU ↔ sistem backend','Dalami pemilihan lokasi SPKLU (analisis spasial!)','Lanjut Jalur 16: panel kontrol motor industri']},
 evfix:{lvl:'JALUR 12 · EV & EV CHARGING · MISI 2',icon:'🛠️',title:'Troubleshooting SPKLU Error',strict:false,
  loc:'📍 SPKLU Rest Area KM 158 · Laporan gangguan',
  story:'Laporan masuk: SPKLU yang kamu komisioning menolak mengisi — layar menampilkan ERROR E-07: GROUND FAULT. Pelanggan menumpuk, media sosial menyala. Teknisi panik mengganti suku cadang; teknisi terlatih membaca kode error dan MENGUKUR.',
  goal:'Akar gangguan ditemukan lewat pengukuran, diperbaiki, dan SPKLU kembali melayani charging dengan aman.',
  obj:['Baca & pahami kode error unit','Isolasi unit, ukur pembumian, temukan akar masalah','Perbaiki, energize ulang, dan uji charging'],
  learn:['Kode error = mesin memberi tahu di mana sakitnya — baca manual, jangan menebak','Charger memantau pembumian terus-menerus: resistansi naik = proteksi arus bocor tak andal = unit mengunci diri','Klem & koneksi pembumian luar ruangan rawan korosi/kendor — inspeksi berkala adalah obatnya','Selalu isolasi (MCCB OFF) sebelum membuka kompartemen — beri waktu kapasitor internal discharge'],
  next:['Pelajari diagnosa jarak jauh via OCPP error log','Dalami RCD tipe B & alat uji EVSE khusus','Susun jadwal preventive maintenance SPKLU']},
});

/* =====================================================================
   MISI 7 — EV: KOMISIONING SPKLU (Jalur 12)
   ===================================================================== */
let me={};
function buildEV(){
  freshScene(0x9fb6cc,0x101a26);
  cam={theta:.25,phi:1.18,r:7.5,target:new THREE.Vector3(.5,1.4,-.5)};
  const ground=box(18,.1,12,0x3f454c);ground.position.y=-.05;scene.add(ground);
  const lot=box(5,.02,3,0x4c5660);lot.position.set(2.6,.02,.6);scene.add(lot);
  const mark=box(.12,.025,3,0xd8d8d8);mark.position.set(.4,.03,.6);scene.add(mark);

  /* sumber + MCCB di dinding kecil */
  const wallc=box(2.6,2.6,.2,0x8a96a2);wallc.position.set(-3.4,1.3,-2.4);scene.add(wallc);
  wallc.add(label('PANEL SUPLAI',.75).translateY(1.55));
  terminal('SRC-F','fasa',-4.1,1.9,-2.26);
  terminal('SRC-N','netral',-3.8,1.9,-2.26);
  terminal('SRC-G','ground',-3.5,1.9,-2.26);
  scene.add(label('F',.4,'#ff8d8d').translateX(-4.1).translateY(1.68).translateZ(-2.2));
  scene.add(label('N',.4,'#9cc4ff').translateX(-3.8).translateY(1.68).translateZ(-2.2));
  scene.add(label('G',.4,'#8df0b8').translateX(-3.5).translateY(1.68).translateZ(-2.2));
  const mccb=box(.42,.6,.16,0x223a55);mccb.position.set(-2.8,1.5,-2.28);scene.add(mccb);
  mccb.add(label('MCCB',.55).translateY(.5));
  actMesh(mccb,'MCCB');
  terminal('MCCB-IN','fasa',-2.8,1.92,-2.18);
  terminal('MCCB-OUT','fasa',-2.8,1.08,-2.18);

  /* unit SPKLU */
  const evse=box(.9,2.1,.6,0xe8edf2,{roughness:.4});evse.position.set(0,1.05,-1.6);scene.add(evse);
  const stripe=box(.92,.3,.62,0x18b06a);stripe.position.set(0,1.75,-1.6);scene.add(stripe);
  evse.add(label('SPKLU 25 kW',.8).translateY(1.35));
  me.scrC=document.createElement('canvas');me.scrC.width=256;me.scrC.height=160;
  me.scrTex=new THREE.CanvasTexture(me.scrC);
  me.screen=new THREE.Mesh(new THREE.PlaneGeometry(.5,.32),new THREE.MeshBasicMaterial({map:me.scrTex}));
  me.screen.position.set(0,1.35,-1.29);scene.add(me.screen);
  evScr('OFFLINE','#7d8f84');
  actMesh(me.screen,'RFID'); 
  terminal('EVSE-F','fasa',-.25,.35,-1.28);
  terminal('EVSE-N','netral',0,.35,-1.28);
  terminal('EVSE-G','ground',.25,.35,-1.28);
  /* gun + holster */
  me.gun=box(.12,.3,.12,0x18242f);me.gun.position.set(.55,1.0,-1.28);scene.add(me.gun);
  actMesh(me.gun,'GUN');
  scene.add(label('GUN CCS2',.5,'#5fd4ff').translateX(.62).translateY(1.32).translateZ(-1.2));

  /* tester riso */
  const tbl=box(.7,.06,.5,0x6b4f33);tbl.position.set(-1.5,.8,.3);scene.add(tbl);
  const tleg=box(.07,.8,.07,0x4a3624);tleg.position.set(-1.5,.4,.3);scene.add(tleg);
  me.tester=box(.3,.18,.22,0xffd23f);me.tester.position.set(-1.5,.92,.3);scene.add(me.tester);
  actMesh(me.tester,'RISO');
  scene.add(label('INSULATION TESTER',.58,'#5fd4ff').translateX(-1.5).translateY(1.22).translateZ(.3));

  /* mobil EV */
  const body=box(2.2,.55,1.1,0x2a72c8,{roughness:.35});body.position.set(2.8,.62,.6);scene.add(body);
  const cab=box(1.2,.4,1.0,0x2a72c8,{roughness:.3});cab.position.set(2.7,1.1,.6);scene.add(cab);
  [[-1,-.45],[1,-.45],[-1,.45],[1,.45]].forEach(w=>{
    const wh=cyl(.25,.25,.18,0x14181d);wh.rotation.x=Math.PI/2;
    wh.position.set(2.8+w[0]*.8,.27,.6+w[1]);scene.add(wh);});
  me.chgLamp=new THREE.Mesh(new THREE.SphereGeometry(.06,12,10),
    new THREE.MeshStandardMaterial({color:0x224433,emissive:0x000000}));
  me.chgLamp.position.set(1.95,.85,.25);scene.add(me.chgLamp);
  scene.add(label('EV PELANGGAN',.7).translateX(2.8).translateY(1.6).translateZ(.6));

  terms={};clickables.forEach(c=>{if(c.userData.kind==='terminal')terms[c.userData.id]=c;});
  me.charging=false;
  moduleTick=(dt,T)=>{if(me.charging){
    const p=.5+Math.sin(T*4)*.5;
    me.chgLamp.material.emissive.setHex(0x2ee87a);
    me.chgLamp.material.emissiveIntensity=.4+p;}};

  startSeq([
   {type:'wire',a:'SRC-F',b:'MCCB-IN',color:COL.fasa,done:false,
    desc:'Sambungkan FASA sumber ke MCCB.',
    why:'SPKLU 25 kW menarik arus besar — MCCB (molded case) dipilih karena kapasitas pemutusannya jauh di atas MCB rumah tangga.'},
   {type:'wire',a:'MCCB-OUT',b:'EVSE-F',color:COL.fasa,done:false,
    desc:'Dari MCCB, tarik fasa ke terminal F unit SPKLU.',
    why:'Jalur daya utama charger. Ukuran kabel dihitung dari arus kontinu + faktor koreksi suhu — charger bekerja berjam-jam tanpa henti.'},
   {type:'wire',a:'SRC-N',b:'EVSE-N',color:COL.netral,done:false,
    desc:'Sambungkan NETRAL sumber ke terminal N SPKLU.',
    why:'Elektronika kontrol charger butuh referensi netral yang stabil untuk catu daya internal dan pengukuran.'},
   {type:'wire',a:'SRC-G',b:'EVSE-G',color:COL.ground,done:false,
    desc:'Sambungkan GROUNDING ke terminal G SPKLU.',
    why:'Yang ini bukan opsional: charger MEMERIKSA pembumian saat self-test. Tanpa grounding baik, proteksi arus bocor DC tak berfungsi — unit menolak beroperasi.',
    wrong:'Kuning-hijau hanya ke terminal G — charger akan menolak tanpa grounding.'},
   {type:'act',aid:'RISO',done:false,targets:()=>[me.tester],
    desc:'UJI dulu: insulation test & cek tahanan pembumian (klik TESTER).',
    why:'Komisioning selalu: uji dulu, energize kemudian. Riso memastikan tak ada isolasi kabel terluka saat penarikan; pembumian diukur < nilai standar.',
    fx(){toast('🔍 Riso > 1 MΩ ✓ · Pembumian 1,2 Ω ✓','ok',2600);}},
   {type:'act',aid:'MCCB',done:false,targets:()=>[mccb],
    desc:'ENERGIZE: ON-kan MCCB.',
    why:'Setelah lolos uji, barulah listrik masuk. Charger melakukan boot & self-test — layar berubah dari OFFLINE ke SIAP.',
    fx(){evScr('SIAP\nTAP KARTU','#46ff8e');
      toast('⚡ SPKLU ONLINE — self-test lolos.','ok',2400);}},
   {type:'act',aid:'RFID',done:false,targets:()=>[me.screen],
    desc:'Autentikasi: TAP KARTU pada layar (klik LAYAR).',
    why:'Alur transaksi SPKLU: autentikasi (kartu/aplikasi) → otorisasi backend → siap charging. Protokol OCPP menghubungkan unit ke sistem pusat.',
    fx(){evScr('AUTENTIKASI OK\nCOLOK GUN','#5fd4ff');
      toast('💳 Kartu diterima — silakan colok gun.','ok',2200);}},
   {type:'act',aid:'GUN',done:false,targets:()=>[me.gun],
    desc:'Colokkan GUN ke kendaraan (klik GUN).',
    why:'Saat gun terkunci, EVSE & kendaraan "berjabat tangan" lewat sinyal pilot: menyepakati arus maksimum, cek interlock, baru daya mengalir. Mode 3/4 charging.',
    fx(){me.charging=true;
      drawWire(me.gun,me.chgLamp,0x18b06a);
      evScr('CHARGING\n23,8 kW','#2ee87a');
      toast('🔋 CHARGING! Mobil pertama mengisi 23,8 kW.','ok',2800);sfx.big();}},
  ],()=>{say('🎉 <b>SPKLU KM 158 resmi beroperasi!</b> Pelanggan pertama mengisi daya. Dari wiring sampai transaksi — kamu paham seluruh rantainya sekarang.');
    setTimeout(()=>showWin('ev'),2400);});

  say('VOLTA di sini 🚗⚡ Komisioning SPKLU hari ini! Ingat dua prinsipnya: <b>grounding bukan formalitas</b> (charger memeriksanya!) dan <b>uji dulu, energize kemudian</b>. Ikuti penanda ▼.');
  $('#modTitle').textContent='J12 — Komisioning SPKLU';
  $('#taskHead').textContent='WIRING → UJI → TRANSAKSI';}
function evScr(txt,color){
  const g=me.scrC.getContext('2d');
  g.fillStyle='#0c141d';g.fillRect(0,0,256,160);
  g.fillStyle=color;g.font='700 30px Consolas,monospace';g.textAlign='center';
  txt.split('\n').forEach((l,i)=>g.fillText(l,128,66+i*40));
  me.scrTex.needsUpdate=true;}

/* =====================================================================
   MISI 29 — TROUBLESHOOTING SPKLU (Jalur 12 · Misi 2)
   ===================================================================== */
let mev={};
function buildEvfix(){
  freshScene(0x9fb6cc,0x101a26);
  cam={theta:.2,phi:1.18,r:7,target:new THREE.Vector3(.3,1.4,-.5)};
  const ground=boxT(18,.1,12,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  /* unit SPKLU error */
  const evse=boxT(.9,2.1,.6,TEX.metal(),{metalness:.3});evse.position.set(0,1.05,-1.6);scene.add(evse);
  const stripe=box(.92,.3,.62,0xb02020);stripe.position.set(0,1.75,-1.6);scene.add(stripe);
  evse.add(label('SPKLU 25 kW',.8).translateY(1.35));
  mev.S=makeDisplay(.55,.36,260,170);
  mev.S.mesh.position.set(0,1.35,-1.29);scene.add(mev.S.mesh);
  dispText(mev.S,['ERROR E-07','GROUND FAULT'],['#ff5a5a','#ff5a5a']);
  actMesh(mev.S.mesh,'SCREEN');
  mev.gun=box(.12,.3,.12,0x18242f);mev.gun.position.set(.55,1.0,-1.28);scene.add(mev.gun);
  actMesh(mev.gun,'GUN');
  scene.add(label('GUN CCS2',.5,'#5fd4ff').translateX(.62).translateY(1.32).translateZ(-1.2));
  /* panel MCCB */
  const wallc=boxT(2.2,2.4,.2,TEX.metal(),{metalness:.3});wallc.position.set(-3.2,1.2,-2.4);scene.add(wallc);
  wallc.add(label('PANEL SUPLAI',.75).translateY(1.45));
  mev.mccb=box(.42,.6,.16,0x223a55);mev.mccb.position.set(-3.2,1.4,-2.28);scene.add(mev.mccb);
  actMesh(mev.mccb,'MCCB');
  scene.add(label('MCCB',.55,'#5fd4ff').translateX(-3.2).translateY(1.95).translateZ(-2.2));
  /* earth tester + batang pembumian */
  const tbl=boxT(.8,.06,.5,TEX.wood());tbl.position.set(2.4,.8,.4);scene.add(tbl);
  const tleg=boxT(.07,.8,.07,TEX.wood());tleg.position.set(2.4,.4,.4);scene.add(tleg);
  mev.et=box(.32,.2,.24,0xd8b020);mev.et.position.set(2.4,.93,.4);scene.add(mev.et);
  actMesh(mev.et,'ETEST');
  scene.add(label('EARTH TESTER',.55,'#5fd4ff').translateX(2.4).translateY(1.25).translateZ(.4));
  mev.rod=cyl(.04,.04,.8,0x6a8a5a);mev.rod.position.set(1.3,.35,-2.3);scene.add(mev.rod);
  mev.klem=box(.16,.12,.14,0x8a5a2a);mev.klem.position.set(1.3,.72,-2.3);scene.add(mev.klem);
  actMesh(mev.klem,'KLEM');
  scene.add(label('KLEM PEMBUMIAN',.55,'#5fd4ff').translateX(1.3).translateY(1.05).translateZ(-2.2));
  /* mobil menunggu */
  const body=box(2.2,.55,1.1,0xc83a3a,{roughness:.35});body.position.set(3.6,.62,1.4);scene.add(body);
  const cab=box(1.2,.4,1.0,0xc83a3a,{roughness:.3});cab.position.set(3.5,1.1,1.4);scene.add(cab);
  [[-1,-.45],[1,-.45],[-1,.45],[1,.45]].forEach(w=>{
    const wh=cyl(.25,.25,.18,0x14181d);wh.rotation.x=Math.PI/2;
    wh.position.set(3.6+w[0]*.8,.27,1.4+w[1]);scene.add(wh);});
  scene.add(label('PELANGGAN MENUNGGU…',.65,'#ffd23f').translateX(3.6).translateY(1.6).translateZ(1.4));

  startSeq([
   {type:'act',aid:'SCREEN',done:false,targets:()=>[mev.S.mesh],
    desc:'Baca KODE ERROR di layar unit (klik layar).',
    why:'E-07 = ground fault: unit mendeteksi pembumian di luar batas dan MENGUNCI diri — by design, karena tanpa bumi yang baik proteksi arus bocor DC tak bisa diandalkan. Mesin sudah memberi tahu; tinggal didengar.',
    fx(){toast('📟 E-07: resistansi pembumian di luar batas — unit lockout.','info',3000);}},
   {type:'act',aid:'MCCB',done:false,targets:()=>[mev.mccb],
    desc:'Sebelum membuka apapun: ISOLASI unit — MCCB OFF.',
    why:'Troubleshooting pada unit hidup = mengundang E-07 versi manusia. MCCB OFF + tunggu kapasitor internal discharge (lampu indikator padam) — baru kompartemen boleh dibuka.',
    fx(){mev.mccb.rotation.x=.4;dispText(mev.S,['OFFLINE','—'],['#7d8f84','#7d8f84']);
      mev.mccb.userData.aid='MCCB2'; /* klik berikutnya = energize ulang */
      toast('🔌 MCCB OFF — unit terisolasi, aman dikerjakan.','ok',2400);}},
   {type:'act',aid:'ETEST',done:false,targets:()=>[mev.et],
    desc:'UKUR pembumian dengan EARTH TESTER (klik alat).',
    why:'Jangan menebak — ukur. Hasil: 8,4 Ω, padahal komisioning dulu 1,2 Ω dan standar <5 Ω. Sesuatu memburuk di jalur pembumian dalam 6 bulan terakhir.',
    fx(){toast('📏 Pembumian: 8,4 Ω (dulu 1,2 Ω) — ada yang memburuk!','bad',2800);}},
   {type:'act',aid:'KLEM',done:false,targets:()=>[mev.klem],
    desc:'Telusuri jalurnya: periksa KLEM di batang pembumian.',
    why:'Tersangka utama koneksi luar ruangan: korosi. Benar — klem berkarat & kendor dimakan cuaca rest area. Bersihkan, beri vaselin konduktif, kencangkan. Ukur ulang: 1,3 Ω ✓',
    fx(){mev.klem.material.color.setHex(0xd8a020);
      toast('🔧 Klem dibersihkan & dikencangkan → ukur ulang: 1,3 Ω ✓','ok',3000);}},
   {type:'act',aid:'MCCB2',done:false,targets:()=>[mev.mccb],
    desc:'Energize ulang: MCCB ON — perhatikan layar unit.',
    why:'Unit boot & mengulang self-test pembumiannya. Kali ini 1,3 Ω lolos — lockout terangkat otomatis. Error yang dipahami akarnya tidak akan kembali besok pagi.',
    fx(){mev.mccb.rotation.x=0;dispText(mev.S,['SIAP','TAP KARTU'],['#46ff8e','#5fd4ff']);
      toast('⚡ Self-test LOLOS — E-07 hilang, unit SIAP.','ok',2600);}},
   {type:'act',aid:'GUN',done:false,targets:()=>[mev.gun],
    desc:'Uji akhir: colok GUN ke mobil pelanggan.',
    why:'Perbaikan belum selesai sebelum transaksi nyata berhasil. Handshake pilot → charging 24,1 kW. Catat di laporan: akar masalah, perbaikan, hasil ukur — bekal preventive maintenance berikutnya.',
    fx(){dispText(mev.S,['CHARGING','24,1 kW'],['#2ee87a','#2ee87a']);
      toast('🔋 CHARGING 24,1 kW — pelanggan tersenyum!','ok',3000);sfx.big();}},
  ],()=>{say('🎉 <b>Gangguan tuntas lewat pengukuran!</b> Kode error → isolasi → ukur → akar (klem korosi) → bukti. Tanpa satu pun suku cadang diganti sia-sia.');
    setTimeout(()=>showWin('evfix'),2200);});

  say('VOLTA di sini 🛠️ SPKLU-mu mogok dengan <b>ERROR E-07</b> dan antrean memanjang. Teknisi panik mengganti parts; kita membaca kode & MENGUKUR. Mulai dari layar unit.');
  $('#modTitle').textContent='J12·M2 — Troubleshooting SPKLU';
  $('#taskHead').textContent='BACA KODE · UKUR · PERBAIKI';}

MISSIONS.ev.build=buildEV;
MISSIONS.evfix.build=buildEvfix;

Object.assign(REAL,{
 ev:[
  'Ikuti checklist komisioning pabrikan + uji proteksi arus bocor DC (RCD tipe B) dengan alat uji EVSE',
  'Verifikasi koneksi OCPP ke backend & lakukan uji transaksi end-to-end sebelum serah terima',
  'Ukur tahanan pembumian & loop impedance — charger modern menolak start bila pembumian buruk',
  'Siapkan SOP gangguan: fungsi emergency stop & prosedur pelepasan gun saat listrik padam'],
 evfix:[
  'Selalu mulai dari error log unit & backend OCPP — banyak gangguan terdiagnosa tanpa ke lokasi',
  'Tunggu waktu discharge kapasitor sesuai manual sebelum membuka kompartemen daya',
  'Ukur pembumian dengan earth tester terkalibrasi metode 3-titik, catat tren tiap inspeksi',
  'Tutup perbaikan dengan uji transaksi end-to-end & laporan akar masalah ke pemilik aset'],
});

/* =====================================================================
   MISI 3 — SITE SELECTION SPKLU
   ===================================================================== */
Object.assign(MISSIONS,{
 site:{lvl:'JALUR 12 · EV & EV CHARGING · MISI 3',icon:'🗺️',title:'Site Selection SPKLU Baru',strict:false,
  loc:'📍 Kota Indramayu · Studi lokasi SPKLU ke-2',
  story:'SPKLU rest area-mu sukses — utilisasi 38% dan naik terus. Investor minta lokasi kedua di dalam kota. Tapi SPKLU yang salah tempat adalah besi mahal yang menganggur: dari empat kandidat lokasi, hanya satu yang layak. Kali ini kamu bukan teknisi — kamu perencana.',
  goal:'Lokasi terbaik terpilih berbasis data (trafik, daya, akses), terverifikasi kapasitas listriknya, dan proposal ber-skor diajukan.',
  obj:['Analisis peta trafik & pola pergerakan EV','Verifikasi kapasitas trafo & rencana layout di kandidat terkuat','Susun proposal lokasi dengan skor multi-kriteria'],
  learn:['SPKLU hidup dari LOKASI: trafik EV, durasi parkir alami (mall/kuliner), & akses masuk-keluar mudah','Kapasitas listrik = penentu biaya: dekat trafo longgar berarti hemat ratusan juta biaya penyambungan','Skor multi-kriteria (trafik, daya, sewa, kompetitor) membuat keputusan bisa dipertanggungjawabkan — bukan firasat','Layout menentukan pengalaman: mundur-parkir mudah, kabel sampai port kiri & kanan mobil'],
  next:['Pelajari analisis spasial GIS untuk jaringan SPKLU se-kota','Dalami model bisnis: utilisasi break-even & skema sewa lahan','Hitung dampak SPKLU ke trafo distribusi (studi pembebanan)']},
});
let msl={};
function buildSite(){
  freshScene(0x9fb6cc,0x101a26);
  cam={theta:0,phi:1.15,r:8.5,target:new THREE.Vector3(0,1.8,-1)};
  const floor=boxT(18,.1,11,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(16,4.4,.2,TEX.plaster());wall.position.set(0,2.2,-3.2);scene.add(wall);
  /* peta besar di dinding */
  mslMap();
  function mslMap(){
    const frame=boxT(4.6,2.6,.16,TEX.metal(),{metalness:.4});frame.position.set(-2.4,2.4,-3.1);scene.add(frame);
    frame.add(label('PETA KOTA — KANDIDAT LOKASI',.9).translateY(1.6));
    msl.D=makeDisplay(4.3,2.3,600,330);
    msl.D.mesh.position.set(-2.4,2.4,-3.0);scene.add(msl.D.mesh);
    actMesh(msl.D.mesh,'PETA');}
  function peta(mode){
    const g=msl.D.g,W=600,H=330;
    g.fillStyle='#0e1822';g.fillRect(0,0,W,H);
    g.strokeStyle='#2a3a4c';g.lineWidth=10;
    g.beginPath();g.moveTo(0,160);g.lineTo(W,150);g.stroke();
    g.beginPath();g.moveTo(300,0);g.lineTo(310,H);g.stroke();
    if(mode>=1){g.strokeStyle='#d8a02080';g.lineWidth=16;
      g.beginPath();g.moveTo(0,160);g.lineTo(W,150);g.stroke();}
    const cand=[['A · pasar lama',90,60,'#8aa3bd'],['B · mall+kuliner',430,210,mode>=1?'#46ff8e':'#8aa3bd'],
      ['C · pinggir kota',520,60,'#8aa3bd'],['D · gang sempit',150,260,'#8aa3bd']];
    cand.forEach(c=>{g.fillStyle=c[3];g.beginPath();g.arc(c[1],c[2],13,0,7);g.fill();
      g.font='600 16px Consolas';g.textAlign='left';g.fillText(c[0],c[1]+18,c[2]+5);});
    g.fillStyle='#ffd23f';g.font='700 16px Consolas';
    if(mode>=1)g.fillText('Trafik EV tertinggi: koridor timur → B unggul',14,H-16);
    if(mode>=2){g.fillStyle='#46ff8e';g.fillText('B: trafo 400kVA beban 52% — SIAP',14,28);}
    msl.D.tex.needsUpdate=true;}
  peta(0);
  /* gardu dekat kandidat B */
  msl.gardu=boxT(1.0,1.1,.8,TEX.metal(),{metalness:.3});msl.gardu.position.set(2.2,.6,-1.4);scene.add(msl.gardu);
  actMesh(msl.gardu,'TRAFO');
  scene.add(label('GARDU DEKAT LOKASI B',.65,'#5fd4ff').translateX(2.2).translateY(1.45).translateZ(-1.4));
  /* maket layout */
  msl.maket=boxT(1.8,.08,1.2,TEX.concrete());msl.maket.position.set(4.6,1.0,-.6);scene.add(msl.maket);
  const slot=box(.5,.02,.9,0x2a72c8);slot.position.set(4.3,1.06,-.6);scene.add(slot);
  actMesh(msl.maket,'LAYOUT');
  scene.add(label('MAKET LAYOUT',.6,'#5fd4ff').translateX(4.6).translateY(1.4).translateZ(-.6));
  /* proposal */
  msl.prop=box(.55,.7,.05,0xe8e4d8);msl.prop.position.set(6.2,1.6,-1.4);scene.add(msl.prop);
  actMesh(msl.prop,'PROP');
  scene.add(label('PROPOSAL LOKASI',.6,'#5fd4ff').translateX(6.2).translateY(2.15).translateZ(-1.4));
  startSeq([
   {type:'act',aid:'PETA',done:false,targets:()=>[msl.D.mesh],
    desc:'Analisis PETA: trafik & pola gerak EV kota (klik peta).',
    why:'Data backend SPKLU-mu sendiri adalah emas: 70% pelanggan datang dari koridor timur, jam ramai 17–21 — jam orang makan & belanja. Kandidat B (mall+kuliner) duduk persis di persilangan pola itu. A ramai tapi parkir 5 menit; D bahkan susah dimasuki.',
    fx(){peta(1);toast('🗺️ Koridor timur dominan → kandidat B unggul sementara.','ok',3000);}},
   {type:'act',aid:'TRAFO',done:false,targets:()=>[msl.gardu],
    desc:'Verifikasi KAPASITAS LISTRIK di kandidat B (klik gardu).',
    why:'Lokasi bagus tanpa daya = proyek molor setahun. Gardu terdekat: trafo 400 kVA berbeban 52% — ruang cukup untuk 2 charger 25 kW + rencana ekspansi. Jarak tarikan kabel 40 m. Biaya sambung: ringan. B makin kokoh.',
    fx(){peta(2);toast('⚡ Trafo 400kVA · beban 52% · tarikan 40m — LAYAK.','ok',2800);}},
   {type:'act',aid:'LAYOUT',done:false,targets:()=>[msl.maket],
    desc:'Rancang LAYOUT parkir & unit di maket (klik maket).',
    why:'Dua slot parkir mundur yang lega, unit di antara keduanya agar satu charger melayani port kiri & kanan, kanopi hujan, dan jalur kabel tak memotong pejalan. Pengalaman pelanggan dirancang di maket — bukan ditambal setelah jadi.',
    fx(){toast('📐 Layout: 2 slot + unit tengah + kanopi — ergonomis.','ok',2600);}},
   {type:'act',aid:'PROP',done:false,targets:()=>[msl.prop],
    desc:'Susun PROPOSAL ber-skor & ajukan ke investor (klik proposal).',
    why:'Matriks 4 lokasi × 5 kriteria berbobot: B menang telak (84 vs 61, 58, 39). Proyeksi: utilisasi 25% tahun pertama, break-even bulan ke-30. Investor tidak membeli lokasi — ia membeli ANALISIS yang bisa dia percaya.',
    fx(){toast('📊 Lokasi B skor 84/100 — investor setuju, lanjut perizinan!','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Lokasi kedua terpilih dengan kepala dingin!</b> Trafik dianalisis, daya diverifikasi, layout dirancang, skor bicara. SPKLU yang ramai lahir di atas kertas kerja seperti ini.');
    setTimeout(()=>showWin('site'),2200);});
  say('VOLTA di sini 🗺️ Naik jabatan: dari teknisi menjadi <b>perencana</b>. Empat kandidat lokasi, satu keputusan mahal. Senjatamu: data trafik, kapasitas trafo, dan matriks skor. Mulai dari peta.');
  $('#modTitle').textContent='J12·M3 — Site Selection SPKLU';
  $('#taskHead').textContent='TRAFIK · DAYA · LAYOUT · SKOR';}
MISSIONS.site.build=buildSite;
Object.assign(REAL,{
 site:[
  'Minta data resmi rencana jaringan & kapasitas ke PLN setempat — asumsi kapasitas adalah jebakan termahal',
  'Survei lokasi di jam ramai NYATA (sore-malam), bukan hanya siang saat sepi',
  'Perjanjian lahan jangka panjang dengan klausul listrik & akses 24 jam — sewa setahun untuk aset 10 tahun itu keliru',
  'Cek rencana kompetitor & peta SPKLU existing (aplikasi resmi) sebelum memutuskan'],
});

/* =====================================================================
   MISI 4 — MANAJEMEN BEBAN DINAMIS SPKLU
   ===================================================================== */
Object.assign(MISSIONS,{
 loadmgmt:{lvl:'JALUR 12 · EV & EV CHARGING · MISI 4',icon:'⚖️',title:'Manajemen Beban Dinamis SPKLU',strict:false,
  loc:'📍 SPKLU lokasi B · 4 charger, 1 trafo, jam sibuk',
  story:'Lokasi keduamu sukses — terlalu sukses: empat charger kini sering penuh bersamaan, dan total tarikannya mengancam trafo 197 kVA yang tersedia. Membayar uprating trafo? Setahun antre & ratusan juta. Atau... mengajari para charger BERBAGI dengan cerdas: dynamic load management — kecerdasan yang lebih murah dari tembaga.',
  goal:'Empat charger melayani bersamaan tanpa pernah melampaui batas daya: DLM aktif, prioritas adil, dan uji beban penuh lolos.',
  obj:['Hitung anggaran daya & batas aman trafo','Konfigurasi DLM: alokasi dinamis & prioritas','Uji skenario 4 mobil serentak — batas tak pernah jebol'],
  learn:['Static limit membagi rata & menyia-nyiakan: 4 charger dipatok 12 kW selamanya walau hanya 1 mobil mengisi','Dynamic load management membaca keadaan tiap detik: 1 mobil = dapat penuh; 4 mobil = dibagi adil — kapasitas selalu terpakai optimal','Charger berkomunikasi via OCPP smart charging profile: pusat menetapkan, unit menaati','First-come priority vs equal share: kebijakan bisnis menentukan algoritma — teknologi mengikuti niat'],
  next:['Pelajari OCPP 2.0.1 smart charging & ISO 15118 (plug & charge)','Gabungkan DLM dengan PLTS atap lokasi: charging mengikuti matahari','Dalami V2G: mobil sebagai baterai cadangan gedung']},
});
let mlm={};
function buildLoadMgmt(){
  freshScene(0x9fb6cc,0x101a26);
  cam={theta:.15,phi:1.15,r:9,target:new THREE.Vector3(0,1.5,-.8)};
  const ground=boxT(20,.1,12,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  /* 4 charger berjejer */
  mlm.units=[];mlm.kw=[0,0,0,0];mlm.cars=[false,false,false,false];
  [-4.5,-1.5,1.5,4.5].forEach((x,i)=>{
    const u=boxT(.8,1.9,.55,TEX.metal(),{metalness:.3});u.position.set(x,.95,-2.2);scene.add(u);
    const st=box(.82,.26,.57,0x18b06a);st.position.set(x,1.6,-2.2);scene.add(st);
    const D=makeDisplay(.5,.3,220,130);
    D.mesh.position.set(x,1.25,-1.91);scene.add(D.mesh);
    dispText(D,['IDLE','0 kW'],['#7d8f84','#7d8f84']);
    mlm.units.push({mesh:u,D});
    actMesh(u,'CAR'+i);
    scene.add(label('CP-'+(i+1),.6).translateX(x).translateY(2.25).translateZ(-2.2));});
  /* gardu trafo */
  const trf=boxT(1.3,1.3,1.0,TEX.metal(),{metalness:.3});trf.position.set(-7.4,.7,-2.2);scene.add(trf);
  scene.add(label('TRAFO 197 kVA tersedia',.65).translateX(-7.4).translateY(1.7).translateZ(-2.2));
  /* layar DLM pusat */
  const frame=boxT(2.8,1.8,.16,TEX.metal(),{metalness:.4});frame.position.set(0,2.6,-4.2);scene.add(frame);
  frame.add(label('DLM CONTROLLER',.8).translateY(1.15));
  mlm.D=makeDisplay(2.5,1.5,460,280);
  mlm.D.mesh.position.set(0,2.6,-4.1);scene.add(mlm.D.mesh);
  actMesh(mlm.D.mesh,'BUDGET');
  function panel(){
    const g=mlm.D.g,W=460,H=280;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    const tot=mlm.kw.reduce((a,b)=>a+b,0);
    g.font='700 18px Consolas';g.textAlign='left';
    g.fillStyle='#5fd4ff';g.fillText('BUDGET: 100 kW'+(mlm.dlm?' · DLM ON':''),16,30);
    mlm.kw.forEach((k,i)=>{
      const y=66+i*44;
      g.fillStyle='#8aa3bd';g.fillText('CP-'+(i+1),16,y);
      g.fillStyle=k>0?'#46ff8e':'#3a4a5c';
      g.fillRect(90,y-16,k*5.2,22);
      g.fillText(k.toFixed(0)+' kW',90+k*5.2+10,y);});
    g.fillStyle=tot>100?'#ff5a5a':'#ffd23f';g.font='700 19px Consolas';
    g.fillText('TOTAL: '+tot.toFixed(0)+' kW '+(tot>100?'⚠ LEBIH!':'✓'),16,H-18);
    mlm.D.tex.needsUpdate=true;}
  mlm.dlm=false;panel();
  function alok(){ /* alokasi DLM */
    const aktif=mlm.cars.map((c,i)=>c?i:-1).filter(i=>i>=0);
    mlm.kw=[0,0,0,0];
    if(!aktif.length){panel();return;}
    if(!mlm.dlm){aktif.forEach(i=>mlm.kw[i]=50);} /* tanpa DLM: rakus */
    else{const share=Math.min(50,100/aktif.length);
      aktif.forEach(i=>mlm.kw[i]=share);}
    aktif.forEach(i=>{dispText(mlm.units[i].D,['CHARGING',mlm.kw[i].toFixed(0)+' kW'],
      ['#2ee87a','#2ee87a']);});
    mlm.units.forEach((u,i)=>{if(!mlm.cars[i])dispText(u.D,['IDLE','0 kW'],['#7d8f84','#7d8f84']);});
    panel();}
  startSeq([
   {type:'act',aid:'BUDGET',done:false,targets:()=>[mlm.D.mesh],
    desc:'Hitung ANGGARAN DAYA dari kapasitas trafo (klik layar DLM).',
    why:'Trafo menyisakan 197 kVA; dikurangi beban lain & margin keamanan → anggaran charger: 100 kW. Empat charger 50 kW = potensi 200 kW: dua kali anggaran. Tanpa manajemen, jam sibuk = trafo menjerit. Angka 100 inilah konstitusi lokasi ini.',
    fx(){toast('🧮 Anggaran daya: 100 kW untuk 4 charger (potensi 200).','info',3000);}},
   {type:'act',aid:'CAR0',done:false,targets:()=>[mlm.units[0].mesh],
    desc:'Mobil pertama datang — colok di CP-1 (klik charger 1).',
    why:'Satu mobil sendirian: CP-1 memberi 50 kW PENUH — tidak ada alasan berhemat saat anggaran longgar. Inilah keunggulan dinamis atas statis: kapasitas tidak disandera oleh kemungkinan.',
    fx(){mlm.cars[0]=true;mlm.dlm=true;alok();
      toast('🚗 CP-1: 50 kW penuh — anggaran masih lega.','ok',2600);}},
   {type:'act',aid:'CAR1',done:false,targets:()=>[mlm.units[1].mesh],
    desc:'Mobil kedua masuk CP-2 (klik charger 2).',
    why:'Dua mobil × 50 = 100 kW — tepat di garis anggaran. DLM membiarkan keduanya kencang: pemakaian 100% kapasitas tanpa selembar pun terlewat. Statis-12kW akan menyuruh keduanya merangkak — di sinilah uang berbeda.',
    fx(){mlm.cars[1]=true;alok();
      toast('🚗🚗 2×50 kW = 100 kW — pas di garis, masih aman.','ok',2600);}},
   {type:'act',aid:'CAR2',done:false,targets:()=>[mlm.units[2].mesh],
    desc:'Jam sibuk dimulai: mobil ketiga di CP-3!',
    why:'Tiga mobil meminta 150 — anggaran tetap 100. DLM menghitung ulang dalam sekejap: 33 kW per mobil, adil rata. Tiap pengisian sedikit melambat; trafo tidak pernah tahu ada yang berubah. Pengorbanan kecil yang tak terasa, menggantikan bencana yang pasti terasa.',
    fx(){mlm.cars[2]=true;alok();
      toast('🚗×3 → DLM membagi: 33 kW/mobil — total tetap 100 ✓','ok',2800);}},
   {type:'act',aid:'CAR3',done:false,targets:()=>[mlm.units[3].mesh],
    desc:'Uji puncak: mobil KEEMPAT — semua slot penuh!',
    why:'Empat mobil, 25 kW masing-masing, total persis 100 — trafo bernafas normal di jam tersibuk dalam sejarah lokasi. Tanpa DLM hari ini berakhir dengan trafo trip & empat pelanggan marah; dengan DLM, hanya statistik bagus di laporan bulanan.',
    fx(){mlm.cars[3]=true;alok();
      toast('🏁 4 mobil · 25 kW/unit · total 100 — TRAFO AMAN SEMPURNA!','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Kecerdasan mengalahkan tembaga!</b> Tanpa uprating, tanpa antre setahun: empat charger berbagi 100 kW secara dinamis dan adil. Software yang baik adalah trafo kedua yang tak terlihat.');
    setTimeout(()=>showWin('loadmgmt'),2200);});
  say('VOLTA di sini ⚖️ Lokasimu laris — dan trafonya mulai ketar-ketir. Solusi termurah bukan tembaga baru, tapi <b>dynamic load management</b>: ajari charger berbagi. Mulai dari menghitung anggaran daya.');
  $('#modTitle').textContent='J12·M4 — Manajemen Beban Dinamis';
  $('#taskHead').textContent='BERBAGI 100 kW DENGAN ADIL';}
MISSIONS.loadmgmt.build=buildLoadMgmt;
Object.assign(REAL,{
 loadmgmt:[
  'Anggaran daya disepakati tertulis dengan PLN/pengelola gedung — bukan asumsi internal',
  'Uji failsafe: bila komunikasi DLM putus, charger wajib fallback ke batas aman rendah',
  'Pantau kurva beban trafo nyata bulan pertama — validasi DLM bekerja di dunia nyata',
  'Sosialisasikan ke pelanggan (app/stiker): kecepatan bisa turun di jam ramai — ekspektasi dikelola'],
});

/* =====================================================================
   MISI 5 — INSTALASI HOME CHARGING (WALLBOX)
   ===================================================================== */
Object.assign(MISSIONS,{
 wallbox:{lvl:'JALUR 12 · EV & EV CHARGING · MISI 5',icon:'🏠',title:'Instalasi Home Charging (Wallbox)',strict:false,
  loc:'📍 Rumah Bu Rina · Mobil listrik baru, garasi lama',
  story:'Bu Rina baru mengambil mobil listrik pertamanya — dan malam pertama, charger bawaan dicolok ke stop kontak biasa: hangat mencurigakan setelah dua jam. Keputusannya tepat: panggil profesional. Tugasmu memasang wallbox 7,4 kW dengan benar: dari cek kapasitas daya rumah, jalur kabel dedicated, sampai proteksi yang memahami DC.',
  goal:'Wallbox terpasang aman & tersertifikasi: daya rumah dinaikkan sesuai kebutuhan, sirkit dedicated dengan proteksi lengkap, dan pengisian perdana terverifikasi.',
  obj:['Audit daya rumah & ajukan kenaikan daya','Tarik sirkit dedicated + proteksi RCD yang tepat','Pasang & komisioning wallbox, uji pengisian'],
  learn:['Stop kontak rumah tidak dirancang untuk arus 10-16 A selama 8 jam nonstop — hangat itu peringatan, kebakaran itu kelanjutannya','Wallbox 7,4 kW butuh daya rumah memadai: audit beban dulu — kenaikan daya & penyesuaian MCB adalah bagian instalasi, bukan opsi','Charger mobil bisa membocorkan arus DC yang membutakan RCD tipe AC biasa — wajib RCD tipe A + DC 6mA (atau tipe B) di sirkit EV','Sirkit DEDICATED dari panel: berbagi jalur dengan beban lain = nominasi kebakaran — kabel dihitung untuk arus kontinu'],
  next:['Pelajari smart charging rumah: jadwal tarif & integrasi PLTS atap','Dalami standar instalasi EV residensial & sertifikasinya','Tawarkan paket survei+instalasi ke dealer mobil listrik — pasar deras'],},
});
let mwb={};
function buildWallbox(){
  freshScene(0xa8c0d4,0x141e2a);
  cam={theta:.1,phi:1.15,r:7.5,target:new THREE.Vector3(0,1.6,-.8)};
  const floor=boxT(14,.1,10,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(13,4.2,.15,TEX.plaster());wall.position.set(0,2.1,-3);scene.add(wall);
  const Z=-2.86;
  /* mobil EV di garasi */
  const body=box(2.4,.6,1.2,0x3a8a6a,{roughness:.35});body.position.set(2.8,.65,.4);scene.add(body);
  const cab=box(1.3,.45,1.1,0x3a8a6a,{roughness:.3});cab.position.set(2.7,1.15,.4);scene.add(cab);
  [[-1,-.5],[1,-.5],[-1,.5],[1,.5]].forEach(w=>{
    const wh=cyl(.26,.26,.2,0x14181d);wh.rotation.x=Math.PI/2;
    wh.position.set(2.8+w[0]*.85,.28,.4+w[1]);scene.add(wh);});
  scene.add(label('MOBIL BU RINA',.65).translateX(2.8).translateY(1.75).translateZ(.4));
  /* panel rumah */
  const phb=boxT(.9,1.2,.2,TEX.metal(),{metalness:.35});phb.position.set(-4.6,2.0,Z);scene.add(phb);
  phb.add(label('PANEL RUMAH',.6).translateY(.85));
  actMesh(phb,'AUDIT');
  /* stop kontak gosong */
  const skk=box(.3,.3,.1,0xcfae90);skk.position.set(.6,1.2,Z+.08);scene.add(skk);
  const gosong=box(.12,.12,.04,0x2a1c10);gosong.position.set(.6,1.2,Z+.14);scene.add(gosong);
  scene.add(label('stop kontak biasa (hangat!)',.5,'#ff8d8d').translateX(.6).translateY(1.6).translateZ(Z+.1));
  /* jalur kabel dedicated */
  mwb.jalur=cyl(.035,.035,4.4,0xd8d8d8);mwb.jalur.rotation.z=Math.PI/2;
  mwb.jalur.position.set(-2.2,3.2,Z+.06);mwb.jalur.visible=false;scene.add(mwb.jalur);
  mwb.rol=box(.4,.35,.3,0x2a72c8);mwb.rol.position.set(-2.6,.9,.8);scene.add(mwb.rol);
  actMesh(mwb.rol,'SIRKIT');
  scene.add(label('KABEL 3x6mm² + RCD A/DC6mA',.55,'#5fd4ff').translateX(-2.6).translateY(1.35).translateZ(.8));
  /* wallbox */
  mwb.box=box(.5,.7,.22,0xe8edf2,{roughness:.4});mwb.box.position.set(.2,1.6,Z+.05);
  mwb.box.visible=false;scene.add(mwb.box);
  actMesh(mwb.box,'UJI');
  mwb.boxBtn=box(.5,.7,.22,0xe8edf2,{roughness:.4});mwb.boxBtn.position.set(-1.0,.45,1.4);scene.add(mwb.boxBtn);
  actMesh(mwb.boxBtn,'PASANG');
  scene.add(label('WALLBOX 7,4 kW (dus)',.55,'#ffd23f').translateX(-1.0).translateY(1.0).translateZ(1.4));
  mwb.lampu=new THREE.Mesh(new THREE.SphereGeometry(.05,12,10),
    new THREE.MeshStandardMaterial({color:0x224433,emissive:0x000000}));
  mwb.lampu.position.set(.2,1.95,Z+.18);mwb.lampu.visible=false;scene.add(mwb.lampu);
  startSeq([
   {type:'act',aid:'AUDIT',done:false,targets:()=>[phb],
    desc:'AUDIT daya rumah: cukupkah untuk 7,4 kW tambahan? (klik panel)',
    why:'Rumah 5.500 VA, beban malam existing ±3.000 W — wallbox 7,4 kW jelas tak muat. Dua jalur: naik daya ke 13.200 VA (dipilih, mobil diisi malam saat beban rendah pun butuh ruang) ATAU wallbox diset 3,7 kW. Matematika dulu, pemasangan kemudian.',
    fx(){toast('🧮 5.500 VA tak cukup → pengajuan naik daya 13.200 VA disetujui.','ok',3000);}},
   {type:'act',aid:'SIRKIT',done:false,targets:()=>[mwb.rol],
    desc:'Tarik SIRKIT DEDICATED dari panel + proteksi khusus EV (klik rol).',
    why:'Kabel 3×6 mm² langsung dari panel (arus kontinu 32 A butuh napas panjang), MCB 40 A khusus, dan bintang utamanya: RCD tipe A + deteksi DC 6 mA — kebocoran DC dari elektronika mobil membutakan RCD biasa; tipe inilah yang tetap melek.',
    fx(){mwb.jalur.visible=true;
      toast('🔌 Sirkit dedicated + RCD A/DC6mA terpasang — jalur VIP mobil.','ok',3000);}},
   {type:'act',aid:'PASANG',done:false,targets:()=>[mwb.boxBtn],
    desc:'PASANG wallbox di dinding garasi (klik dus wallbox).',
    why:'Tinggi 1,2 m (jauh dari genangan & jangkauan anak), kabel charging menjangkau port mobil tanpa melintasi jalur jalan kaki, dudukan ke dinding bata dengan fischer berat. Konfigurasi arus diset 32 A sesuai sirkit — wallbox pintar tapi tetap patuh kabel.',
    fx(){mwb.box.visible=true;mwb.boxBtn.visible=false;mwb.lampu.visible=true;
      toast('🔧 Wallbox terpasang rapi — konfigurasi 32 A.','ok',2800);}},
   {type:'act',aid:'UJI',done:false,targets:()=>[mwb.box],
    desc:'KOMISIONING: uji proteksi & pengisian perdana (klik wallbox).',
    why:'Tes RCD trip ✓, pembumian 1,4 Ω ✓, lalu colok: handshake, 7,2 kW mengalir — stop kontak gosong itu resmi pensiun. Bu Rina dapat penjelasan 5 menit: isi malam hari, jangan pakai sambungan rol kabel, dan tombol darurat ada di sini. Instalasi selesai saat pemilik paham.',
    fx(){mwb.lampu.material.color.setHex(0x2ee87a);mwb.lampu.material.emissive.setHex(0x2ee87a);
      mwb.lampu.material.emissiveIntensity=1;
      toast('🔋 7,2 kW mengalir — penuh dalam 6 jam, AMAN selamanya.','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Garasi naik kelas!</b> Daya dihitung, jalur dedicated, RCD yang paham DC, dan pemilik yang teredukasi. Jutaan mobil listrik akan datang — dan tiap garasinya butuh tangan seperti tanganmu.');
    setTimeout(()=>showWin('wallbox'),2200);});
  say('VOLTA di sini 🏠 Kasus yang akan kamu temui ribuan kali dekade ini: <b>mobil listrik baru, instalasi rumah lama</b>. Stop kontak biasa sudah memberi peringatan hangat. Tiga kunci: audit daya, sirkit dedicated, RCD yang paham DC. Mulai dari panel!');
  $('#modTitle').textContent='J12·M5 — Home Charging Wallbox';
  $('#taskHead').textContent='DAYA · DEDICATED · DC-AWARE';}
MISSIONS.wallbox.build=buildWallbox;
Object.assign(REAL,{
 wallbox:[
  'Survei beban aktual rumah (bukan hanya daya kontrak) sebelum menjanjikan kapasitas wallbox',
  'RCD tipe A + DC 6mA (atau tipe B) adalah syarat mutlak sirkit EV — verifikasi datasheet wallbox',
  'Uji jatuh tegangan ujung kabel saat arus penuh — jalur panjang ke garasi sering diremehkan',
  'Beri label sirkit EV di panel & edukasi pemilik: dilarang ekstensi/rol kabel untuk charging'],
});

/* =====================================================================
   MISI 6 — KOMISIONING DC FAST CHARGER 150 kW
   ===================================================================== */
Object.assign(MISSIONS,{
 dcfc:{lvl:'JALUR 12 · EV & EV CHARGING · MISI 6',icon:'⚡',title:'Komisioning DC Fast Charger 150 kW',strict:true,
  loc:'📍 Rest area KM 158 · Upgrade: ultra fast charging',
  story:'Rest area pertamamu naik kelas: unit DC 150 kW tiba — enam kali lebih besar dari yang dulu, dengan kabel berpendingin cairan dan tegangan kerja sampai 920 VDC. Di level ini charger bukan lagi kotak elektronik: ia gardu mini yang bicara langsung ke baterai mobil. Komisioningnya pun naik kelas: HV-DC menuntut hormat dua kali lipat.',
  goal:'DC fast charger 150 kW beroperasi: suplai & proteksi terverifikasi, sistem pendingin sehat, insulasi HV-DC lolos, dan sesi 150 kW pertama tercatat.',
  obj:['Verifikasi suplai, proteksi & pembumian unit','Komisioning sistem pendingin kabel & power module','Uji insulasi HV-DC lalu sesi pengisian penuh'],
  learn:['DC fast charging memindahkan konverter dari mobil ke charger: unit menyuapi baterai langsung dengan DC tegangan tinggi — 400-920 V sesuai permintaan BMS mobil','Kabel 150 kW tanpa pendingin akan setebal lengan: liquid cooling membuatnya tetap bisa diangkat manusia — dan menjadikan pompa & coolant bagian dari keselamatan','Insulation monitoring HV-DC bekerja TERUS MENERUS: di tegangan ini kebocoran kecil tak diberi kesempatan kedua','Handshake CCS sesungguhnya: mobil & charger bernegosiasi tegangan-arus tiap detik — BMS mobil yang memimpin, charger yang melayani'],
  next:['Pelajari arsitektur power module & redundansinya (N+1)','Dalami manajemen antrian & pricing ultra fast charging','Eksplorasi megawatt charging (MCS) untuk truk listrik']},
});
let mdc={};
function buildDCFC(){
  freshScene(0x9fb6cc,0x101a26);
  cam={theta:.15,phi:1.16,r:8,target:new THREE.Vector3(0,1.6,-.6)};
  const ground=boxT(20,.1,12,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  /* unit DC besar */
  const unit=boxT(1.6,2.3,.9,TEX.metal(),{metalness:.35});unit.position.set(0,1.15,-2.2);scene.add(unit);
  const stripe=box(1.62,.4,.92,0x18b06a);stripe.position.set(0,2.0,-2.2);scene.add(stripe);
  unit.add(label('DC FAST 150 kW · 920 VDC',.8).translateY(1.5));
  mdc.scr=makeDisplay(.8,.5,260,160);
  mdc.scr.mesh.position.set(0,1.5,-1.74);scene.add(mdc.scr.mesh);
  dispText(mdc.scr,['OFFLINE','—'],['#7d8f84','#7d8f84']);
  actMesh(mdc.scr.mesh,'SESI');
  /* panel suplai */
  const pnl=boxT(1.2,1.6,.4,TEX.metal(),{metalness:.35});pnl.position.set(-3.8,.85,-2.4);scene.add(pnl);
  pnl.add(label('PANEL 200 kVA',.65).translateY(1.05));
  actMesh(pnl,'SUPLAI');
  /* radiator pendingin */
  mdc.cool=boxT(.9,.7,.4,TEX.metal(),{metalness:.4});mdc.cool.position.set(1.6,.4,-2.3);scene.add(mdc.cool);
  actMesh(mdc.cool,'COOL');
  scene.add(label('LIQUID COOLING UNIT',.6,'#5fd4ff').translateX(1.8).translateY(1.0).translateZ(-2.2));
  /* insulation tester */
  mdc.meg=box(.34,.22,.26,0xcc6020);mdc.meg.position.set(3.4,1.05,.4);scene.add(mdc.meg);
  actMesh(mdc.meg,'INSUL');
  const tbl=boxT(1.0,.07,.6,TEX.wood());tbl.position.set(3.4,.92,.4);scene.add(tbl);
  const tleg=boxT(.08,.92,.08,TEX.wood());tleg.position.set(3.4,.46,.4);scene.add(tleg);
  scene.add(label('INSULATION TESTER 1kV',.55,'#5fd4ff').translateX(3.4).translateY(1.35).translateZ(.4));
  /* mobil premium */
  const body=box(2.5,.6,1.2,0x222a31,{roughness:.3,metalness:.4});body.position.set(-2.6,.65,1.2);scene.add(body);
  const cab=box(1.4,.45,1.1,0x222a31,{roughness:.25,metalness:.4});cab.position.set(-2.7,1.15,1.2);scene.add(cab);
  [[-1,-.5],[1,-.5],[-1,.5],[1,.5]].forEach(w=>{
    const wh=cyl(.27,.27,.2,0x14181d);wh.rotation.x=Math.PI/2;
    wh.position.set(-2.6+w[0]*.9,.28,1.2+w[1]);scene.add(wh);});
  scene.add(label('EV 800V — siap uji',.65).translateX(-2.6).translateY(1.75).translateZ(1.2));
  mdc.kw=0;mdc.on=false;
  moduleTick=(dt)=>{if(mdc.on&&mdc.kw<150){mdc.kw=Math.min(150,mdc.kw+dt*30);
    dispText(mdc.scr,[mdc.kw.toFixed(0)+' kW',(mdc.kw>=150?'FULL POWER ✓':'ramping…')+' · 805V'],
      [mdc.kw>=150?'#46ff8e':'#5fd4ff','#8aa3bd']);}};
  startSeq([
   {type:'act',aid:'SUPLAI',done:false,targets:()=>[pnl],
    desc:'Verifikasi SUPLAI 200 kVA: proteksi, pembumian, urutan fasa (klik panel).',
    why:'150 kW DC butuh ±170 kVA AC di sisi masuk: breaker 250 A, pembumian terukur 0,9 Ω, urutan fasa benar (power module tiga fasa peka urutan). Ilmu komisioning lamamu tetap fondasi — hanya angkanya yang membesar enam kali.',
    fx(){toast('🔌 Suplai ✓ pembumian 0,9Ω ✓ urutan fasa R-S-T ✓','ok',2800);}},
   {type:'act',aid:'COOL',done:false,targets:()=>[mdc.cool],
    desc:'Komisioning LIQUID COOLING: coolant, pompa, alarm (klik unit pendingin).',
    why:'Kabel 150 kW hanya seukuran lengan bayi BERKAT cairan yang mengalir di dalamnya — coolant diisi sesuai spesifikasi, pompa di-priming, aliran terverifikasi, dan alarm suhu/aliran diuji: pendingin gagal = charger wajib menurunkan daya SENDIRI. Di sini pendingin adalah keselamatan, bukan kenyamanan.',
    fx(){toast('🧊 Coolant ✓ pompa ✓ alarm derating teruji ✓','ok',2800);}},
   {type:'act',aid:'INSUL',done:false,targets:()=>[mdc.meg],
    desc:'Uji INSULASI jalur HV-DC sampai konektor (klik tester).',
    why:'920 VDC tak mengenal ampun: insulasi diuji 1 kV dari power module sampai pin gun — 480 MΩ ✓. Lalu fungsi pengawal permanennya diuji: insulation monitoring device disimulasikan bocor — unit memutus dalam 80 ms. Penjaga yang terbukti bangun, bukan dipercaya tidur.',
    fx(){toast('🔍 Insulasi 480MΩ ✓ IMD trip 80ms ✓ — HV-DC terkawal.','ok',3000);}},
   {type:'act',aid:'SESI',done:false,targets:()=>[mdc.scr.mesh],
    desc:'Momen 150 kW: colok EV 800V & saksikan FULL POWER (klik layar).',
    why:'Handshake CCS: mobil meminta 805 V / 187 A, charger menyanggupi... daya menanjak — 50, 100, 150 kW PENUH: 10-80% dalam 18 menit, kabel tetap hangat-ramah berkat coolant yang bekerja. Rest area-mu kini melayani kelas tercepat di jalan tol.',
    fx(){mdc.on=true;beep(160,.7,'sine',.08);
      toast('⚡ 150 kW FULL — 10-80% hanya 18 menit. Naik kelas resmi!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Ultra fast charging beroperasi!</b> Suplai besar dihormati, pendingin diperlakukan sebagai keselamatan, HV-DC dikawal monitor yang terbukti sigap. Dari 25 kW ke 150 kW: jalur EV-mu tumbuh secepat industrinya.');
    setTimeout(()=>showWin('dcfc'),2200);});
  say('VOLTA di sini ⚡ Barang besar datang: <b>DC fast charger 150 kW, 920 VDC, kabel berpendingin cairan</b>. Di level ini charger adalah gardu mini — dan komisioningnya menuntut hormat dua kali lipat. Mulai dari panel suplai!');
  $('#modTitle').textContent='J12·M6 — DC Fast Charger 150 kW';
  $('#taskHead').textContent='HV-DC MENUNTUT HORMAT GANDA';}
MISSIONS.dcfc.build=buildDCFC;
Object.assign(REAL,{
 dcfc:[
  'Ikuti prosedur komisioning pabrikan HV: urutan energize power module & kalibrasi IMD spesifik tiap merek',
  'Coolant memakai spesifikasi pabrikan (umumnya glikol khusus) — salah cairan = korosi loop pendingin',
  'Uji interoperabilitas dengan beberapa model EV — handshake CCS punya dialek antar pabrikan',
  'Sediakan SOP penanganan kabel & gun: drop test, inspeksi pin berkala — konektor adalah titik aus utama'],
});

/* =====================================================================
   MISI 7 — DEPO BUS LISTRIK: ORKESTRASI CHARGING MALAM
   ===================================================================== */
Object.assign(MISSIONS,{
 depo:{lvl:'JALUR 12 · EV & EV CHARGING · MISI 7',icon:'🚌',title:'Depo Bus Listrik: Orkestrasi Charging Malam',strict:false,
  loc:'📍 Depo TransKota · 30 bus listrik, 12 charger, 1 malam',
  story:'Kota meluncurkan 30 bus listrik — dan depo ini rumahnya. Tiap malam, tantangan matematika yang sama: 30 bus pulang dengan sisa baterai berbeda, 12 charger, daya terbatas, dan SEMUA harus penuh sebelum jadwal pagi yang berbeda-beda. Charging asal colok = tagihan WBP membengkak & bus pagi tak siap. Orkestrasi adalah segalanya.',
  goal:'Sistem manajemen depo beroperasi: charging terjadwal dari prioritas keberangkatan & SoC, beban malam rata di bawah batas daya, dan 30/30 bus siap pagi.',
  obj:['Data masuk: SoC tiap bus & jadwal keberangkatannya','Susun strategi: prioritas & smart charging semalam','Jalankan & validasi: 30 bus siap, biaya optimal'],
  learn:['Masalah depo = penjadwalan dengan kendala: total energi yang dibutuhkan vs daya tersedia × jam tersedia — matematika dulu, kabel kemudian','Prioritas bukan siapa pulang duluan: bus berangkat 04:30 dengan SoC 20% adalah antrian pertama, bus berangkat 07:00 boleh menunggu giliran tengah malam','Meratakan beban (valley filling) menghindari puncak baru: 12 charger menyala serentak jam 22:00 menciptakan WBP-nya sendiri','Preconditioning terjadwal (panaskan/dinginkan kabin saat masih dicolok) menghemat baterai di jalan — energi dari grid lebih murah dari energi baterai'],
  next:['Pelajari integrasi jadwal depo dengan sistem operasional armada','Dalami opportunity charging (pantograf di ujung rute) vs depot charging','Eksplorasi V2G depo: 30 bus = BESS 3 MWh yang parkir tiap malam']},
});
let mdp={};
function buildDepo(){
  freshScene(0x1d2a3a,0x0a121c);
  cam={theta:.1,phi:1.15,r:10,target:new THREE.Vector3(0,1.6,-.8)};
  const ground=boxT(26,.1,14,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  /* deretan bus */
  mdp.bus=[];
  for(let i=0;i<4;i++){
    const b=box(3.0,1.1,1.0,[0x2a8a6a,0x2a8a6a,0xd8a020,0xd83a3a][i],{roughness:.4});
    b.position.set(-6+i*3.4,.85,-2.4);scene.add(b);mdp.bus.push(b);
    scene.add(label(['B-12 · 65% · 06:30','B-07 · 48% · 05:45','B-21 · 31% · 05:00','B-03 · 18% · 04:30'][i],.5)
      .translateX(-6+i*3.4).translateY(1.8).translateZ(-2.4));}
  scene.add(label('30 BUS PULANG (4 contoh)',.8).translateY(2.6).translateZ(-2.4));
  actMesh(mdp.bus[3],'PRIORITAS');
  /* layar manajemen depo */
  const frame=boxT(4.6,2.6,.16,TEX.metal(),{metalness:.4});frame.position.set(0,2.5,2.6);frame.rotation.y=Math.PI;scene.add(frame);
  mdp.D=makeDisplay(4.3,2.3,580,330);
  mdp.D.mesh.position.set(0,2.5,2.5);mdp.D.mesh.rotation.y=Math.PI;scene.add(mdp.D.mesh);
  actMesh(mdp.D.mesh,'DATA');
  scene.add(label('DEPOT MANAGEMENT SYSTEM',.85,'#5fd4ff').translateY(4.0).translateZ(2.5));
  mdp.mode=0;
  function layar(){
    const g=mdp.D.g,W=580,H=330;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='700 17px Consolas';g.textAlign='left';
    if(mdp.mode===0){g.fillStyle='#5fd4ff';
      g.fillText('MALAM INI: 30 bus · butuh 4.860 kWh',16,34);
      g.fillStyle='#8aa3bd';g.font='600 15px Consolas';
      g.fillText('daya tersedia: 800 kW · jam: 21:00-04:00',16,66);
      g.fillText('teori: 5.600 kWh tersedia — CUKUP, asal rapi',16,98);
      g.fillStyle='#ff8d3a';g.fillText('asal colok: puncak 1.380 kW = JEBOL',16,140);}
    else{ /* kurva beban rapi */
      g.strokeStyle='#2a3a4c';g.lineWidth=2;
      g.beginPath();g.moveTo(40,20);g.lineTo(40,H-40);g.lineTo(W-12,H-40);g.stroke();
      g.strokeStyle='#7a2a2a';g.setLineDash([6,5]);
      g.beginPath();g.moveTo(40,80);g.lineTo(W-12,80);g.stroke();g.setLineDash([]);
      g.fillStyle='#ff8d8d';g.font='600 14px Consolas';g.fillText('batas 800 kW',46,72);
      g.strokeStyle='#46ff8e';g.lineWidth=3;g.beginPath();
      for(let h=0;h<=7;h+=.25){
        const v=mdp.mode===2?.93:.6+Math.abs(Math.sin(h*2))*.55;
        const x=40+h/7*(W-70),y=H-40-Math.min(1.05,v)*(H-80)*.9;
        h===0?g.moveTo(x,y):g.lineTo(x,y);}
      g.stroke();
      g.fillStyle=mdp.mode===2?'#46ff8e':'#ffd23f';g.font='700 16px Consolas';
      g.fillText(mdp.mode===2?'rata 745 kW — di bawah batas semalaman ✓':'masih bergerigi — ratakan!',46,36);}
    mdp.D.tex.needsUpdate=true;}
  layar();
  /* charger row */
  for(let i=0;i<4;i++){const c=boxT(.5,1.3,.4,TEX.metal(),{metalness:.35});
    c.position.set(-6+i*3.4,.7,-.9);scene.add(c);}
  scene.add(label('12 CHARGER 150 kW (4 tampak)',.6,'#5fd4ff').translateY(.2).translateZ(-.3));
  /* tombol jalankan & laporan pagi */
  mdp.run=box(.6,.34,.14,0x2a5a8a);mdp.run.position.set(3.2,1.5,2.55);mdp.run.rotation.y=Math.PI;scene.add(mdp.run);
  actMesh(mdp.run,'JALAN');
  scene.add(label('JALANKAN JADWAL',.55,'#9cc4ff').translateX(3.2).translateY(1.95).translateZ(2.5));
  startSeq([
   {type:'act',aid:'DATA',done:false,targets:()=>[mdp.D.mesh],
    desc:'Baca DATA malam ini: kebutuhan vs ketersediaan (klik layar).',
    why:'30 bus pulang membawa PR 4.860 kWh; depo punya 800 kW × 7 jam = 5.600 kWh — CUKUP, tapi tanpa margin untuk kebodohan: simulasi "asal colok semua jam 21:00" menembus 1.380 kW. Matematika malam ini bukan soal cukup energi — soal cukup DISIPLIN.',
    fx(){toast('🧮 Butuh 4.860 / tersedia 5.600 kWh — cukup ASAL rapi.','info',3000);}},
   {type:'act',aid:'PRIORITAS',done:false,targets:()=>[mdp.bus[3]],
    desc:'Tetapkan PRIORITAS: siapa minum duluan? (klik bus merah)',
    why:'Skor antrian = jam berangkat dikurangi jam selesai-charging yang dibutuhkan: B-03 (18%, berangkat 04:30) memimpin antrian walau bukan yang pertama pulang; B-12 (65%, berangkat 06:30) dengan santai antre paling akhir. Yang genting dilayani, yang longgar menunggu — keadilan ala depo.',
    fx(){toast('🥇 Antrian by deadline: B-03 duluan, B-12 sabar.','ok',3000);}},
   {type:'act',aid:'RATAKAN',done:false,targets:()=>[mdp.D.mesh],
    desc:'Susun SMART CHARGING: ratakan beban semalam (klik layar).',
    why:'DLM ilmu lokasi B dipakai skala depo: daya dibagi dinamis, sesi digeser mengisi lembah, dan preconditioning kabin dijadwalkan 30 menit sebelum tiap keberangkatan — kabin dingin dari listrik grid, bukan dari baterai di jalan. Kurva mulai melandai... tapi masih bergerigi di pergantian gelombang.',
    fx(){mdp.mode=1;layar();toast('📊 Gelombang tersusun — sedikit lagi rata.','ok',2800);}},
   {type:'act',aid:'JALAN',done:false,targets:()=>[mdp.run],
    desc:'Finalisasi & JALANKAN jadwal malam (klik tombol).',
    why:'Optimasi terakhir menumpulkan gerigi: rata 745 kW stabil semalaman — di bawah batas, tanpa puncak baru, dan tiap bus mencapai 100% TEPAT sebelum slot preconditioning-nya. Algoritma tidur, charger bekerja, dan kota belum tahu betapa rapinya malam ini.',
    fx(){mdp.mode=2;layar();
      toast('🌙 Jadwal berjalan: 745 kW rata · semua deadline terkunci.','ok',3000);}},
   {type:'act',aid:'PAGI',done:false,targets:()=>[mdp.D.mesh],
    desc:'04:30 — laporan PAGI: semua siap? (klik layar)',
    why:'B-03 keluar gerbang 04:30 dengan 100% & kabin sejuk... disusul 29 saudaranya sesuai jadwal masing-masing. Biaya energi semalam: 11% lebih murah dari minggu lalu (puncak terhindar), dan KPI paling penting kota: NOL bus terlambat karena baterai. Orkestrasi yang sukses memang tak terlihat penumpang.',
    fx(){toast('🌅 30/30 bus siap · biaya −11% · nol keterlambatan!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Simfoni 30 bus semalam suntuk!</b> Deadline jadi dirigen, daya dibagi adil, lembah terisi rata — dan pagi menjemput armada yang penuh semua. Elektrifikasi transportasi dimenangkan di depo, saat kota tertidur.');
    setTimeout(()=>showWin('depo'),2200);});
  const s0d=seq.steps[0],of0d=s0d.fx;s0d.fx=()=>{of0d();mdp.D.mesh.userData.aid='RATAKAN';};
  const s3d=seq.steps[3],of3d=s3d.fx;s3d.fx=()=>{of3d();mdp.D.mesh.userData.aid='PAGI';};
  say('VOLTA di sini 🚌 Tantangan matematika tiap malam: <b>30 bus, 12 charger, daya terbatas, deadline berbeda-beda</b>. Asal colok = jebol & telat. Orkestrasi = semua penuh & hemat. Mulai dari data!');
  $('#modTitle').textContent='J12·M7 — Depo Bus Listrik';
  $('#taskHead').textContent='DEADLINE ADALAH DIRIGEN';}
MISSIONS.depo.build=buildDepo;
Object.assign(REAL,{
 depo:[
  'Integrasikan data SoC real armada (telematika) ke sistem depo — input manual pasti bolong',
  'Sediakan margin daya & charger cadangan: satu charger rusak tak boleh menggagalkan pagi',
  'Latih skenario gangguan: PLN padam jam 01:00 — bus mana yang dikorbankan, siapa memutuskan?',
  'Evaluasi mingguan: bus dgn konsumsi/km menyimpang = kandidat pemeriksaan (ban, AC, gaya mengemudi)'],
});

/* =====================================================================
   MISI 8 — V2G: MOBIL YANG MENJUAL LISTRIK
   ===================================================================== */
Object.assign(MISSIONS,{
 v2g:{lvl:'JALUR 12 · EV & EV CHARGING · MISI 8',icon:'🔄',title:'V2G: Mobil yang Menjual Listrik',strict:false,
  loc:'📍 Gedung perkantoran · Pilot vehicle-to-grid 10 mobil',
  story:'Pemikiran yang mengubah segalanya: mobil pribadi parkir 95% hidupnya — dan di kolong gedung ini, sepuluh mobil listrik karyawan adalah BESS 500 kWh yang menganggur tiap jam kerja. Pilot V2G-mu menguji mimpi itu: mobil mengisi saat murah, MENJUAL kembali ke gedung saat tarif puncak — dengan satu janji yang tak boleh diingkari: baterai pemilik aman & mobil selalu siap pulang.',
  goal:'Pilot V2G beroperasi: charger bidirectional terpasang, kontrak win-win dengan pemilik disepakati, discharge saat puncak terbukti memangkas tagihan gedung, dan SoC pulang terjamin.',
  obj:['Pasang charger bidirectional & verifikasi standar','Rancang kontrak: insentif, batas SoC, jaminan pulang','Uji discharge saat puncak & validasi tiga pihak menang'],
  learn:['V2G butuh tiga kesiapan sekaligus: mobil yang mendukung discharge, charger bidirectional bersertifikat, dan IZIN pemilik — teknologi termudah dari ketiganya','Kekhawatiran pemilik adalah degradasi & kepastian pulang: kontrak menjawab dgn batas siklus, jendela SoC (mis. tak pernah di bawah 60%), & jaminan penuh jam 17:00','Discharge 10×7 kW = 70 kW memangkas beban puncak gedung — tagihan demand turun, pemilik dapat insentif, jaringan lega: tiga pihak menang dari mobil yang tadinya cuma parkir','Smart charging (V1G) adalah gerbang masuknya: menggeser jam charging saja sudah bernilai — V2G adalah kelanjutannya saat ekosistem siap'],
  next:['Pelajari standar charger bidirectional & dukungan tiap pabrikan mobil','Dalami perhitungan degradasi siklus V2G vs nilai insentifnya','Eksplorasi agregasi V2G lintas-gedung sebagai virtual power plant']},
});
let mvg={};
function buildV2G(){
  freshScene(0x9fb6cc,0x101a26);
  cam={theta:.1,phi:1.15,r:9.5,target:new THREE.Vector3(0,1.6,-.8)};
  const ground=boxT(24,.1,13,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  /* gedung */
  const gedung=boxT(4,4.5,3,TEX.plaster());gedung.position.set(-6,2.25,-3);scene.add(gedung);
  for(let f=0;f<4;f++)for(let c=0;c<3;c++){
    const j=box(.6,.6,.06,0x224,{roughness:.2,metalness:.4});
    j.position.set(-7+c*1,1+f*1.05,-1.46);scene.add(j);}
  scene.add(label('GEDUNG — beban puncak 17:00',.8).translateX(-6).translateY(4.9).translateZ(-3));
  /* deretan mobil + charger bidirectional */
  mvg.cars=[];
  for(let i=0;i<3;i++){
    const b=box(2.0,.5,1.0,[0x2a72c8,0x3a8a6a,0x8a8a92][i],{roughness:.35});
    b.position.set(-1.5+i*3,.55,-1.5);scene.add(b);
    const cab=box(1.1,.35,.95,[0x2a72c8,0x3a8a6a,0x8a8a92][i]);cab.position.set(-1.6+i*3,.95,-1.5);scene.add(cab);
    [[-0.7,-.45],[0.7,-.45],[-0.7,.45],[0.7,.45]].forEach(w=>{
      const wh=cyl(.22,.22,.16,0x14181d);wh.rotation.x=Math.PI/2;
      wh.position.set(-1.5+i*3+w[0],.24,-1.5+w[1]);scene.add(wh);});
    mvg.cars.push(b);
    const ch=boxT(.4,1.1,.3,TEX.metal(),{metalness:.35});ch.position.set(-1.5+i*3,.6,-2.5);scene.add(ch);}
  scene.add(label('10 EV KARYAWAN (3 tampak) ≈ BESS 500 kWh parkir',.7).translateY(1.9).translateZ(-1.5));
  actMesh(mvg.cars[0],'CHARGER');
  /* layar energi gedung */
  const frame=boxT(3.8,2.2,.16,TEX.metal(),{metalness:.4});frame.position.set(3.4,2.5,2.6);frame.rotation.y=Math.PI;scene.add(frame);
  mvg.D=makeDisplay(3.5,1.9,540,310);
  mvg.D.mesh.position.set(3.4,2.5,2.5);mvg.D.mesh.rotation.y=Math.PI;scene.add(mvg.D.mesh);
  actMesh(mvg.D.mesh,'UJI');
  scene.add(label('ENERGI GEDUNG REAL-TIME',.8,'#5fd4ff').translateX(3.4).translateY(3.8).translateZ(2.5));
  mvg.mode=0;
  function layar(){
    const g=mvg.D.g,W=540,H=310;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.strokeStyle='#2a3a4c';g.lineWidth=2;
    g.beginPath();g.moveTo(40,16);g.lineTo(40,H-36);g.lineTo(W-12,H-36);g.stroke();
    g.strokeStyle='#7a2a2a';g.setLineDash([6,5]);
    g.beginPath();g.moveTo(40,70);g.lineTo(W-12,70);g.stroke();g.setLineDash([]);
    g.fillStyle='#ff8d8d';g.font='600 13px Consolas';g.textAlign='left';
    g.fillText('demand kontrak',44,64);
    g.strokeStyle=mvg.mode===0?'#ffd23f':'#46ff8e';g.lineWidth=3;g.beginPath();
    for(let h=7;h<=20;h+=.25){
      let v=.4+.45*Math.exp(-Math.pow(h-16.5,2)/4);
      if(mvg.mode>=1&&h>15.5&&h<18.5)v-=.22; /* dipangkas V2G */
      const x=40+(h-7)/13*(W-66),y=H-36-v*(H-80);
      h===7?g.moveTo(x,y):g.lineTo(x,y);}
    g.stroke();
    g.font='700 16px Consolas';
    g.fillStyle=mvg.mode===0?'#ffd23f':'#46ff8e';
    g.fillText(mvg.mode===0?'puncak 17:00 menembus demand kontrak':'puncak terpangkas 70 kW oleh 10 mobil ✓',46,38);
    mvg.D.tex.needsUpdate=true;}
  layar();
  /* kontrak */
  mvg.kontrak=box(.5,.66,.04,0xe8d8a0);mvg.kontrak.position.set(6.6,1.6,-1.5);scene.add(mvg.kontrak);
  actMesh(mvg.kontrak,'KONTRAK');
  scene.add(label('KONTRAK PEMILIK',.6,'#ffd23f').translateX(6.6).translateY(2.15).translateZ(-1.5));
  startSeq([
   {type:'act',aid:'CHARGER',done:false,targets:()=>[mvg.cars[0]],
    desc:'Pasang charger BIDIRECTIONAL & cek kesiapan mobil (klik mobil).',
    why:'Sepuluh wallbox bidirectional terpasang (ilmu instalasimu: sirkit dedicated, RCD tepat — kini DUA arah). Dari 14 mobil karyawan, 10 model mendukung discharge — handshake diuji: mobil bersedia mengalirkan balik atas perintah & izin. Sisi teknis ternyata yang termudah; dua langkah berikutnya soal manusia & uang.',
    fx(){toast('🔌 10 charger 2-arah aktif · 10 mobil kompatibel ✓','ok',3000);}},
   {type:'act',aid:'KONTRAK',done:false,targets:()=>[mvg.kontrak],
    desc:'Rancang KONTRAK yang menjawab kekhawatiran pemilik (klik kontrak).',
    why:'Dua ketakutan dijawab hitam di atas putih: (1) degradasi — maksimal 1 siklus parsial/hari, jendela SoC 60-90% saja (zona ternyaman baterai), kompensasi Rp 450 rb/bulan; (2) kepastian — jam 17:00 SoC DIJAMIN ≥80%, tombol opt-out kapan pun tanpa penalti. Delapan dari sepuluh langsung teken; dua menyusul setelah melihat tetangganya gajian. V2G dimenangkan di kontrak, bukan di konverter.',
    fx(){toast('📜 8/10 teken: insentif + SoC 60-90% + jaminan pulang 80%.','ok',3200);}},
   {type:'act',aid:'UJI',done:false,targets:()=>[mvg.D.mesh],
    desc:'Momen pembuktian: DISCHARGE saat puncak 17:00 (klik layar).',
    why:'16:00 — sistem memberi aba-aba: sepuluh mobil serempak mengalir balik 7 kW masing-masing. Kurva gedung yang biasanya menembus demand kontrak kini terpangkas 70 kW rata — selama tiga jam termahal. Mobil-mobil itu, yang kemarin hanya menyusut nilainya di parkiran, sore ini bekerja.',
    fx(){mvg.mode=1;layar();
      toast('🔄 10 mobil → 70 kW ke gedung — puncak terpangkas!','ok',3200);}},
   {type:'act',aid:'TIGA',done:false,targets:()=>[mvg.D.mesh],
    desc:'Tutup bulan: validasi TIGA PIHAK menang (klik layar).',
    why:'Rekap 30 hari: gedung hemat Rp 14 jt (demand charge turun), tiap pemilik mengantongi insentif dgn degradasi terukur <0,1% (jendela SoC bekerja!), dan jam 17:00 SEMUA mobil selalu ≥80% — janji tak sekali pun diingkari. Tiga pihak menang dari aset yang tadinya hanya parkir: itulah tanda tangan masa depan energi.',
    fx(){toast('🏆 Gedung −Rp14jt · pemilik +insentif · SoC janji 100% ditepati!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Mobil-mobil itu kini punya pekerjaan sampingan!</b> Charger dua arah, kontrak yang menjawab ketakutan, dan tiga jam termahal yang dipangkas tiap sore. V2G bukan teknologi masa depan — ia kontrak win-win yang akhirnya ditandatangani.');
    setTimeout(()=>showWin('v2g'),2200);});
  const s2v=seq.steps[2],of2v=s2v.fx;s2v.fx=()=>{of2v();mvg.D.mesh.userData.aid='TIGA';};
  say('VOLTA di sini 🔄 Sepuluh mobil karyawan = <b>BESS 500 kWh yang menganggur</b> di kolong gedung. Pilot V2G hari ini: ajari mereka menjual listrik saat mahal — tanpa mengingkari satu janji pun ke pemiliknya. Mulai dari charger!');
  $('#modTitle').textContent='J12·M8 — V2G Pilot';
  $('#taskHead').textContent='ASET PARKIR JADI PEMBANGKIT';}
MISSIONS.v2g.build=buildV2G;
Object.assign(REAL,{
 v2g:[
  'Verifikasi garansi baterai pabrikan terhadap penggunaan V2G — beberapa merek punya klausul khusus',
  'Metering dua arah per charger yang akurat = dasar pembayaran insentif yang adil',
  'Interkoneksi discharge ke instalasi gedung mengikuti ketentuan paralel (anti-islanding dll.)',
  'Mulai dari armada perusahaan (jadwal terprediksi) sebelum mobil pribadi — pelajaran lebih murah'],
});
