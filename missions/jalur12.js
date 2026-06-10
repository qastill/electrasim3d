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
