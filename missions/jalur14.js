/* =====================================================================
   ElectraSim VR 3D — HYDROGEN ENERGY
   Misi: M1 h2 (Start-Up Green Hydrogen Plant) · M2 fcell (Refueling H₂ & Fuel Cell Bus)
   Dimuat on-demand oleh index.html lewat ensureMission().
   ===================================================================== */

Object.assign(MISSIONS,{
 h2:{lvl:'JALUR 14 · HYDROGEN ENERGY',icon:'💧',title:'Start-Up Green Hydrogen Plant',strict:true,
  loc:'📍 Pilot plant elektroliser PEM 1 MW',
  story:'Pilot plant hidrogen hijau pertama daerahmu siap produksi perdana. Kamu operatornya. Hidrogen adalah gas menakjubkan sekaligus menuntut respek penuh: tak berwarna, tak berbau, terbakar pada rentang konsentrasi 4–75%. Di sini, urutan safety bukan formalitas — ia satu-satunya pagar.',
  goal:'Produksi H₂ pertama yang benar-benar hijau & aman: listrik terbukti dari PLTS, area terbukti bebas bocor, purity memenuhi syarat fuel cell.',
  obj:['Verifikasi sumber listrik terbarukan (definisi "hijau"!)','Safety check kebocoran SEBELUM start','Start elektroliser, verifikasi purity, kompresi ke storage'],
  learn:['"Hijau"-nya hidrogen ditentukan sumber listriknya — elektroliser + listrik batubara = hidrogen abu-abu','H₂ flammable 4–75% konsentrasi, tak terdeteksi indra — leak detector adalah hidungmu','Fuel cell menuntut purity 99,97% (ISO 14687)','Elektrolisis PEM: air + listrik → H₂ di katoda, O₂ di anoda'],
  next:['Pelajari rantai nilai: produksi → kompresi/penyimpanan → fuel cell','Hitung LCOH (levelized cost of hydrogen) dari LCOE PLTS','Eksplorasi blending H₂ ke jaringan gas & amonia hijau']},
 fcell:{lvl:'JALUR 14 · HYDROGEN ENERGY · MISI 2',icon:'🚌',title:'Refueling H₂ & Fuel Cell Bus',strict:true,
  loc:'📍 Stasiun pengisian H₂ · Bus fuel cell perdana',
  story:'Hidrogen yang kamu produksi kini ditunggu pelanggannya: bus fuel cell kota. Mengisi H₂ 350 bar bukan seperti mengisi bensin — gas bertekanan ekstrem dengan rentang bakar 4–75% menuntut ritual yang tak boleh dilompati satu langkah pun.',
  goal:'Bus terisi penuh dengan aman: bonding terpasang, bebas bocor, dispensing sesuai protokol, fuel cell hidup.',
  obj:['Bonding/grounding kendaraan sebelum apapun','Leak check konektor, baru sambungkan nozzle','Dispensing terkontrol & start fuel cell'],
  learn:['Percikan listrik statis cukup untuk menyulut H₂ — kabel bonding adalah langkah pertama, selalu','Leak check konektor SEBELUM dispensing: detector pada setiap sambungan bertekanan','Protokol pengisian (SAE J2601) mengatur laju & suhu — terlalu cepat = tangki overheat','Fuel cell membalik elektrolisis: H₂ + O₂ → listrik + air murni; knalpotnya meneteskan air'],
  next:['Pelajari beda pengisian 350 bar (bus) vs 700 bar (mobil)','Dalami keselamatan tangki komposit tipe IV','Hitung TCO bus fuel cell vs bus listrik baterai']},
});

/* =====================================================================
   MISI 16 — GREEN HYDROGEN (Jalur 14)
   ===================================================================== */
let mh2={};
function buildH2(){
  freshScene(0xa8c4d8,0x0e1a22);
  cam={theta:-.1,phi:1.18,r:9,target:new THREE.Vector3(0,1.7,-.8)};
  const ground=box(20,.1,12,0x46505a);ground.position.y=-.05;scene.add(ground);

  /* PLTS sumber */
  mh2.pv=box(2.4,.06,1.6,0x16263e,{roughness:.25});mh2.pv.position.set(-6.4,1.4,-1.4);
  mh2.pv.rotation.x=-.3;scene.add(mh2.pv);
  const pvleg=box(.1,1.2,.1,0x8a8a8a);pvleg.position.set(-6.4,.6,-1.4);scene.add(pvleg);
  actMesh(mh2.pv,'RE');
  scene.add(label('PLTS 1 MW',.7,'#5fd4ff').translateX(-6.4).translateY(2.1).translateZ(-1.2));
  /* leak detector */
  mh2.leak=box(.22,.3,.12,0xffd23f);mh2.leak.position.set(-3.2,1.7,-2.6);scene.add(mh2.leak);
  actMesh(mh2.leak,'LEAK');
  scene.add(label('H2 LEAK DETECTOR',.6,'#5fd4ff').translateX(-3.2).translateY(2.15).translateZ(-2.5));
  /* elektroliser */
  mh2.elc=box(2.2,1.8,1.4,0xd8e0e8);mh2.elc.position.set(-.6,.95,-1.8);scene.add(mh2.elc);
  actMesh(mh2.elc,'ELC');
  scene.add(label('ELEKTROLISER PEM',.8).translateX(-.6).translateY(2.2).translateZ(-1.8));
  mh2.bubble=new THREE.Mesh(new THREE.SphereGeometry(.12,12,10),
    new THREE.MeshStandardMaterial({color:0x9fd8ff,emissive:0x000000,transparent:true,opacity:.85}));
  mh2.bubble.position.set(-.6,1.95,-1.1);scene.add(mh2.bubble);
  /* purity display */
  mh2.D=makeDisplay(1.0,.5,260,130);
  mh2.D.mesh.position.set(-.6,1.2,-1.06);scene.add(mh2.D.mesh);
  dispText(mh2.D,['— %','OFFLINE'],['#7d8f84','#7d8f84']);
  actMesh(mh2.D.mesh,'PURE');
  /* kompresor & storage */
  mh2.comp=box(.9,.8,.7,0x4a6a8a);mh2.comp.position.set(2.2,.45,-1.8);scene.add(mh2.comp);
  actMesh(mh2.comp,'COMP');
  scene.add(label('KOMPRESOR 350 bar',.6,'#5fd4ff').translateX(2.2).translateY(1.15).translateZ(-1.8));
  mh2.tankMat=new THREE.MeshStandardMaterial({color:0x9aa7b4,roughness:.4,emissive:0x000000});
  mh2.tank=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,2.4,20),mh2.tankMat);
  mh2.tank.rotation.z=Math.PI/2;mh2.tank.position.set(5.2,1.0,-1.8);scene.add(mh2.tank);
  scene.add(label('STORAGE H2',.7).translateX(5.2).translateY(1.95).translateZ(-1.8));

  mh2.on=false;
  moduleTick=(dt,T)=>{if(mh2.on){
    mh2.bubble.position.y=1.95+Math.sin(T*5)*.12;
    mh2.bubble.material.emissive.setHex(0x6fc8ff);
    mh2.bubble.material.emissiveIntensity=.4+Math.sin(T*5)*.3;}};

  startSeq([
   {type:'act',aid:'RE',done:false,targets:()=>[mh2.pv],
    desc:'Verifikasi listrik dari PLTS (klik panel surya).',
    why:'Definisi "hijau"-nya hidrogen ada di sumber listriknya. Elektroliser yang sama dengan listrik batubara menghasilkan hidrogen ABU-ABU — lebih kotor dari membakar gasnya langsung.',
    fx(){toast('☀️ Suplai terverifikasi: 100% PLTS, 940 kW tersedia.','ok',2600);}},
   {type:'act',aid:'LEAK',done:false,targets:()=>[mh2.leak],
    desc:'SAFETY DULU: cek leak detector SEBELUM start (klik detektor).',
    why:'H₂ tak berwarna, tak berbau, dan terbakar pada konsentrasi 4–75% — rentang terluas dari semua gas. Detektor terkalibrasi adalah hidungmu; tanpa hijau di sini, tak ada start.',
    fx(){toast('🟢 Area clear: 0 ppm H₂ — aman untuk start.','ok',2600);}},
   {type:'act',aid:'ELC',done:false,targets:()=>[mh2.elc],
    desc:'START elektroliser PEM (klik unit).',
    why:'Di dalam stack: air murni + listrik → H₂ di katoda, O₂ di anoda, dipisahkan membran. 1 kg H₂ butuh ±50 kWh — listrik adalah bahan bakunya, bukan sekadar penggerak.',
    fx(){mh2.on=true;beep(180,.6,'sine',.08);
      toast('💧 Elektrolisis berjalan: 17 Nm³/jam H₂.','ok',2600);}},
   {type:'act',aid:'PURE',done:false,targets:()=>[mh2.D.mesh],
    desc:'Verifikasi PURITY gas (klik display).',
    why:'Fuel cell kendaraan menuntut 99,97% (ISO 14687) — pengotor CO meracuni katalis platinum. Purifier & dryer bekerja setelah stack; angka inilah sertifikat kualitas produkmu.',
    fx(){dispText(mh2.D,['99,97 %','FUEL-CELL GRADE ✓'],['#46ff8e','#46ff8e']);
      toast('🔬 Purity 99,97% — memenuhi grade fuel cell.','ok',2600);}},
   {type:'act',aid:'COMP',done:false,targets:()=>[mh2.comp],
    desc:'Kompresi ke STORAGE 350 bar (klik kompresor).',
    why:'H₂ ringan luar biasa — tanpa kompresi, energinya "encer". 350 bar untuk bus/truk, 700 bar untuk mobil. Kompresi memakan 10-15% energi: bagian dari matematika LCOH.',
    fx(){mh2.tankMat.emissive.setHex(0x2a6a4a);mh2.tankMat.emissiveIntensity=.5;
      toast('🛢️ Storage terisi: 12 kg H₂ @ 350 bar. Produksi perdana!','ok',3000);sfx.big();}},
  ],()=>{say('🎉 <b>Hidrogen hijau perdana!</b> Dari foton matahari → elektron → molekul H₂ fuel-cell grade. Kamu baru menyentuh masa depan energi — dengan urutan safety yang benar.');
    setTimeout(()=>showWin('h2'),2200);});

  say('VOLTA di sini 💧 Produksi perdana hidrogen hijau! Dua hukumnya: <b>(1) hijau ditentukan sumber listrik, (2) safety check SEBELUM start</b> — H₂ tak terlihat dan tak tercium. Mulai dari panel surya.');
  $('#modTitle').textContent='J14 — Start-Up Green Hydrogen';
  $('#taskHead').textContent='HIJAU · AMAN · MURNI';}

/* =====================================================================
   MISI 31 — REFUELING H2 & FUEL CELL (Jalur 14 · Misi 2)
   ===================================================================== */
let mfc={};
function buildFcell(){
  freshScene(0xa8c4d8,0x0e1a22);
  cam={theta:-.15,phi:1.18,r:9,target:new THREE.Vector3(0,1.6,-.6)};
  const ground=boxT(20,.1,12,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  /* dispenser */
  const disp=boxT(.8,1.9,.6,TEX.metal(),{metalness:.35});disp.position.set(-3.0,.95,-1.8);scene.add(disp);
  disp.add(label('DISPENSER H₂ 350 bar',.75).translateY(1.25));
  mfc.D=makeDisplay(.6,.4,260,170);
  mfc.D.mesh.position.set(-3.0,1.35,-1.49);scene.add(mfc.D.mesh);
  dispText(mfc.D,['0,0 kg','0 bar · STANDBY'],['#5fd4ff','#7d8f84']);
  actMesh(mfc.D.mesh,'FILL');
  /* nozzle di holster */
  mfc.noz=box(.13,.32,.13,0x18242f);mfc.noz.position.set(-2.55,1.0,-1.5);scene.add(mfc.noz);
  actMesh(mfc.noz,'NOZZLE');
  scene.add(label('NOZZLE',.5,'#5fd4ff').translateX(-2.45).translateY(1.35).translateZ(-1.45));
  /* kabel bonding */
  mfc.bond=box(.3,.1,.12,0xd8b020);mfc.bond.position.set(-3.5,.4,-1.2);scene.add(mfc.bond);
  actMesh(mfc.bond,'BOND');
  scene.add(label('KABEL BONDING',.55,'#5fd4ff').translateX(-3.6).translateY(.75).translateZ(-1.1));
  /* leak detector */
  mfc.leak=box(.2,.3,.1,0xffd23f);mfc.leak.position.set(-1.7,1.0,-.4);scene.add(mfc.leak);
  actMesh(mfc.leak,'LEAK');
  scene.add(label('LEAK DETECTOR',.55,'#5fd4ff').translateX(-1.7).translateY(1.35).translateZ(-.4));
  /* bus fuel cell */
  const bbody=box(4.6,1.5,1.4,0x2a8a6a,{roughness:.4});bbody.position.set(2.2,1.15,-.4);scene.add(bbody);
  const bwin=box(4.0,.45,1.42,0x9fd8ff,{roughness:.2});bwin.position.set(2.2,1.62,-.4);scene.add(bwin);
  [[-1.6,-.7],[1.6,-.7],[-1.6,.7],[1.6,.7]].forEach(w=>{
    const wh=cyl(.32,.32,.2,0x14181d);wh.rotation.x=Math.PI/2;
    wh.position.set(2.2+w[0],.34,-.4+w[1]);scene.add(wh);});
  scene.add(label('BUS FUEL CELL KOTA',.8).translateX(2.2).translateY(2.25).translateZ(-.4));
  mfc.recp=cyl(.07,.07,.1,0x444444);mfc.recp.rotation.z=Math.PI/2;
  mfc.recp.position.set(.1,1.2,.32);scene.add(mfc.recp);
  scene.add(label('RECEPTACLE',.45).translateX(.1).translateY(.9).translateZ(.6));
  actMesh(bbody,'FC');
  mfc.fcLamp=new THREE.Mesh(new THREE.SphereGeometry(.07,12,10),
    new THREE.MeshStandardMaterial({color:0x224433,emissive:0x000000}));
  mfc.fcLamp.position.set(4.0,1.95,-.4);scene.add(mfc.fcLamp);

  mfc.kg=0;mfc.bar=0;mfc.filling=false;
  moduleTick=(dt)=>{if(mfc.filling&&mfc.bar<350){
    mfc.bar=Math.min(350,mfc.bar+dt*70);mfc.kg=Math.min(24,mfc.kg+dt*4.8);
    dispText(mfc.D,[mfc.kg.toFixed(1)+' kg',Math.round(mfc.bar)+' bar · '+(mfc.bar>=350?'PENUH ✓':'MENGISI')],
      [mfc.bar>=350?'#46ff8e':'#5fd4ff',mfc.bar>=350?'#46ff8e':'#ffd23f']);}};

  startSeq([
   {type:'act',aid:'BOND',done:false,targets:()=>[mfc.bond],
    desc:'Pasang KABEL BONDING ke rangka bus SEBELUM apapun.',
    why:'Bus yang berjalan mengumpulkan muatan statis — dan percikan statis sekecil apapun cukup menyulut H₂. Bonding menyamakan potensial dispenser–kendaraan: percikan tak pernah lahir.',
    fx(){mfc.bond.position.set(.0,.5,.5);
      toast('🔗 Bonding terpasang — potensial tersamakan.','ok',2400);}},
   {type:'act',aid:'LEAK',done:false,targets:()=>[mfc.leak],
    desc:'LEAK CHECK: periksa nozzle & receptacle dengan detector.',
    why:'Sambungan bertekanan adalah titik bocor favorit. Detector menyapu konektor: 0 ppm. Di stasiun H₂, leak check bukan sebelum shift — tapi sebelum SETIAP pengisian.',
    fx(){toast('🟢 Konektor bersih: 0 ppm — aman menyambung.','ok',2400);}},
   {type:'act',aid:'NOZZLE',done:false,targets:()=>[mfc.noz],
    desc:'Sambungkan NOZZLE ke receptacle bus (klik nozzle).',
    why:'Nozzle H₂ mengunci mekanis & menjalin komunikasi data (IR) dengan kendaraan: suhu & tekanan tangki dipantau real-time selama pengisian. Tanpa handshake, dispenser menolak mengalirkan.',
    fx(){mfc.noz.position.set(.1,1.2,.5);
      toast('🔌 Nozzle terkunci — handshake data OK.','ok',2400);}},
   {type:'act',aid:'FILL',done:false,targets:()=>[mfc.D.mesh],
    desc:'Mulai DISPENSING (klik layar dispenser) — pantau kg & bar.',
    why:'Protokol SAE J2601 mengatur laju kenaikan tekanan: gas yang dikompresi memanas, dan tangki komposit punya batas suhu. Pengisian benar = cepat TAPI tetap di bawah 85°C.',
    fx(){mfc.filling=true;beep(220,.5,'sine',.07);
      toast('⛽ Dispensing dimulai — target 24 kg @ 350 bar…','ok',2600);}},
   {type:'act',aid:'FC',done:false,targets:()=>[bbody],
    check:()=>mfc.bar>=350,
    checkFail:'Tangki belum penuh! Tunggu display menunjukkan 350 bar sebelum melepas & start.',
    desc:'Setelah 350 bar: lepas nozzle & START fuel cell bus (klik bus).',
    why:'Di dalam stack, elektrolisis berjalan mundur: H₂ + O₂ → listrik + air murni. Motor berdengung halus, dan dari knalpot hanya menetes air. Masa depan transportasi berat baru saja menyala.',
    fx(){mfc.filling=false;mfc.noz.position.set(-2.55,1.0,-1.5);
      mfc.fcLamp.material.emissive.setHex(0x2ee87a);mfc.fcLamp.material.emissiveIntensity=1;
      toast('🚌 FUEL CELL ON — 24 kg H₂, jangkauan ±350 km. Knalpot: air!','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Pengisian perdana sukses!</b> Bonding → leak check → handshake → protokol → fuel cell hidup. Hidrogenmu kini mengangkut penumpang — dengan knalpot meneteskan air murni.');
    setTimeout(()=>showWin('fcell'),2200);});

  say('VOLTA di sini 🚌 Hidrogen produksimu dijemput pelanggan pertama: bus fuel cell! Ritual 350 bar dimulai dengan benda paling sederhana: <b>kabel bonding</b> — karena statis + H₂ = tidak ada kesempatan kedua.');
  $('#modTitle').textContent='J14·M2 — Refueling H₂ & Fuel Cell';
  $('#taskHead').textContent='BOND · CHECK · FILL · DRIVE';}

MISSIONS.h2.build=buildH2;
MISSIONS.fcell.build=buildFcell;

Object.assign(REAL,{
 h2:[
  'Area produksi H₂ diklasifikasi zona ATEX — semua peralatan listrik harus explosion-proof sesuai zonanya',
  'Ventilasi di TITIK TERTINGGI ruangan: H₂ 14× lebih ringan dari udara, berkumpul di atas',
  'Leak detector dikalibrasi berkala; purging dengan N₂ wajib sebelum maintenance sistem',
  'Material pipa & seal khusus H₂ (hydrogen embrittlement merusak baja biasa)'],
 fcell:[
  'Hanya operator terlatih protokol pengisian H₂ (SAE J2601) yang boleh melayani dispensing',
  'Periksa masa sertifikasi tangki & nozzle — komponen bertekanan punya umur layanan',
  'Area dispensing = zona ATEX: dilarang HP/sumber api, kendaraan mati total selama pengisian',
  'Pelajari prosedur emergency shutdown (ESD) stasiun & titik kumpulnya sebelum shift pertama'],
});

/* =====================================================================
   MISI 3 — TANGGAP DARURAT KEBOCORAN H2
   ===================================================================== */
Object.assign(MISSIONS,{
 leak:{lvl:'JALUR 14 · HYDROGEN ENERGY · MISI 3',icon:'🚨',title:'Tanggap Darurat Kebocoran H₂',strict:true,
  loc:'📍 Pilot plant H₂ · Alarm zona kompresor, 10:42',
  story:'Sirine memekik: detektor zona kompresor membaca 8.000 ppm H₂ — 20% menuju batas bawah ledakan dan naik. Hidrogen tak terlihat, tak tercium, dan apinya pun nyaris tak tampak di siang hari. Detik-detik berikutnya menentukan apakah ini catatan insiden... atau berita nasional.',
  goal:'Kebocoran tertangani tanpa penyulutan: ESD aktif, area aman, ventilasi bekerja, sumber bocor ditemukan & diamankan.',
  obj:['Respon alarm TANPA menciptakan sumber api','Aktifkan ESD & evakuasi-amankan area','Pantau konsentrasi turun lalu lacak sumber bocor'],
  learn:['Respon pertama kebocoran gas: JANGAN menyalakan/mematikan apapun di zona — saklar pun bisa memercik','ESD menutup valve sumber & menghentikan kompresor dari titik AMAN di luar zona — itulah gunanya diletakkan di sana','H₂ 14x lebih ringan dari udara: ia lari ke atas — ventilasi atap adalah jalur pelariannya, beri dia jalan','Masuk kembali ke zona hanya setelah konsentrasi jauh di bawah LFL & dengan detector menyala di tangan'],
  next:['Pelajari klasifikasi zona ATEX & pemilihan peralatan Ex-proof','Latih emergency drill rutin — respon yang benar lahir dari latihan, bukan bakat','Dalami deteksi api H₂ (flame detector UV/IR) — api yang tak terlihat mata']},
});
let mlk={};
function buildLeak(){
  freshScene(0xa8c4d8,0x0e1a22);
  cam={theta:-.1,phi:1.18,r:9,target:new THREE.Vector3(0,1.7,-.8)};
  const ground=boxT(20,.1,12,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  /* zona kompresor dgn garis hazard */
  const zona=boxT(5,.04,4,TEX.hazard());zona.position.set(-1.5,.05,-1.5);scene.add(zona);
  mlk.comp=boxT(1.2,1.0,.9,TEX.metal(),{metalness:.35});mlk.comp.position.set(-2.2,.55,-1.8);scene.add(mlk.comp);
  scene.add(label('KOMPRESOR 350 bar',.7).translateX(-2.2).translateY(1.3).translateZ(-1.8));
  const pipa=cyl(.06,.06,2.4,0x8a96a2);pipa.rotation.z=Math.PI/2;pipa.position.set(-.6,1.0,-1.8);scene.add(pipa);
  mlk.fitting=cyl(.09,.09,.18,0xc9b08a);mlk.fitting.rotation.z=Math.PI/2;
  mlk.fitting.position.set(.2,1.0,-1.8);scene.add(mlk.fitting);
  actMesh(mlk.fitting,'SUMBER');
  /* detektor & sirine */
  mlk.det=box(.22,.3,.12,0xffd23f);mlk.det.position.set(-1.5,2.6,-3.0);scene.add(mlk.det);
  actMesh(mlk.det,'ALARM');
  mlk.lampu=new THREE.Mesh(new THREE.SphereGeometry(.09,12,10),
    new THREE.MeshStandardMaterial({color:0xff3b3b,emissive:0xff3b3b,emissiveIntensity:1}));
  mlk.lampu.position.set(-1.5,3.0,-3.0);scene.add(mlk.lampu);
  scene.add(label('DETEKTOR ZONA — ALARM!',.65,'#ff8d8d').translateX(-1.5).translateY(3.4).translateZ(-3.0));
  /* tombol ESD di luar zona */
  const tiang=cyl(.04,.04,1.3,0x666666);tiang.position.set(3.6,.65,1.2);scene.add(tiang);
  mlk.esd=cyl(.14,.14,.1,0xd83a3a);mlk.esd.rotation.x=Math.PI/2;
  mlk.esd.position.set(3.6,1.4,1.2);scene.add(mlk.esd);
  actMesh(mlk.esd,'ESD');
  scene.add(label('ESD (luar zona)',.6,'#ff9d9d').translateX(3.6).translateY(1.8).translateZ(1.2));
  /* barikade + ventilasi atap + handheld detector */
  mlk.barikade=box(.5,.35,.06,0xffd23f);mlk.barikade.position.set(2.2,.9,.6);scene.add(mlk.barikade);
  actMesh(mlk.barikade,'AMANKAN');
  scene.add(label('BARIKADE & RAMBU',.55,'#5fd4ff').translateX(2.2).translateY(1.35).translateZ(.6));
  const atap=boxT(6,.12,4.4,TEX.metal(),{metalness:.4});atap.position.set(-1.5,3.6,-1.5);scene.add(atap);
  mlk.vent=box(.8,.3,.8,0x8a96a2);mlk.vent.position.set(-1.5,3.85,-1.5);scene.add(mlk.vent);
  actMesh(mlk.vent,'VENT');
  scene.add(label('VENTILASI ATAP',.6,'#5fd4ff').translateX(-1.5).translateY(4.3).translateZ(-1.5));
  mlk.hand=box(.18,.26,.1,0xffd23f);mlk.hand.position.set(4.6,1.0,.2);scene.add(mlk.hand);
  actMesh(mlk.hand,'LACAK');
  scene.add(label('HANDHELD DETECTOR',.55,'#5fd4ff').translateX(4.6).translateY(1.35).translateZ(.2));
  mlk.ppm=8000;mlk.esdOn=false;mlk.ventOn=false;
  mlk.D=makeDisplay(1.2,.55,300,140);
  mlk.D.mesh.position.set(-1.5,2.1,-2.94);scene.add(mlk.D.mesh);
  function layar(){dispText(mlk.D,[Math.round(mlk.ppm)+' ppm',
    mlk.ppm>4000?'⚠ EVAKUASI ZONA':(mlk.ppm>800?'TURUN…':'AMAN MASUK')],
    [mlk.ppm>4000?'#ff5a5a':(mlk.ppm>800?'#ffd23f':'#46ff8e'),'#8aa3bd']);}
  layar();
  moduleTick=(dt,T)=>{
    if(mlk.esdOn&&mlk.ventOn)mlk.ppm=Math.max(300,mlk.ppm-dt*900);
    else if(mlk.esdOn)mlk.ppm=Math.max(2500,mlk.ppm-dt*350);
    else mlk.ppm=Math.min(12000,mlk.ppm+dt*220);
    if(mlk.ppm>4000)mlk.lampu.material.emissiveIntensity=.5+Math.sin(T*8)*.5;
    else mlk.lampu.material.emissiveIntensity=.3;
    layar();};
  startSeq([
   {type:'act',aid:'ALARM',done:false,targets:()=>[mlk.det],
    desc:'Baca DETEKTOR dari jarak aman — JANGAN sentuh saklar apapun!',
    why:'8.000 ppm = 20% LFL dan menanjak. Naluri orang panik: matikan lampu, cabut alat — SALAH: setiap saklar adalah pemantik. Membaca situasi dari luar zona adalah tindakan pertama yang benar.',
    fx(){toast('📟 8.000 ppm, naik — zona TIDAK disentuh, bergerak ke ESD.','bad',2800);}},
   {type:'act',aid:'ESD',done:false,targets:()=>[mlk.esd],
    desc:'Tekan ESD — tombol merah di LUAR zona (klik tombol).',
    why:'Satu tekanan: valve sumber menutup, kompresor berhenti, suplai gas terpenggal di hulu. ESD diletakkan jauh dari zona persis untuk momen ini — kamu mengeksekusinya tanpa melangkah ke dalam awan gas.',
    fx(){mlk.esdOn=true;beep(440,.3,'square',.1);beep(440,.3,'square',.1,.4);
      toast('🛑 ESD AKTIF — valve tertutup, kompresor berhenti.','ok',2600);}},
   {type:'act',aid:'AMANKAN',done:false,targets:()=>[mlk.barikade],
    desc:'EVAKUASI & amankan perimeter (klik barikade).',
    why:'Semua personel keluar zona, barikade & rambu terpasang, lalu lintas kendaraan dihentikan — mesin bensin yang lewat adalah korek api berjalan. Hitung kepala: semua lengkap.',
    fx(){toast('🚧 Perimeter aman · personel lengkap · lalu lintas distop.','ok',2600);}},
   {type:'act',aid:'VENT',done:false,targets:()=>[mlk.vent],
    desc:'Pastikan VENTILASI ATAP bekerja maksimal (klik ventilasi).',
    why:'H₂ ingin pergi ke atas — tugasmu hanya membukakan pintu. Exhaust atap mode darurat: gas ringan itu terbang dan terdilusi ke atmosfer. Perhatikan ppm di layar mulai terjun.',
    fx(){mlk.ventOn=true;
      toast('🌬️ Ventilasi maksimal — konsentrasi turun cepat.','ok',2600);}},
   {type:'act',aid:'LACAK',done:false,targets:()=>[mlk.hand],
    check:()=>mlk.ppm<=800,
    checkFail:'Masih terlalu pekat! Tunggu layar menunjukkan konsentrasi jauh turun sebelum masuk melacak.',
    desc:'Setelah ppm rendah: masuk dengan HANDHELD, lacak sumber bocor.',
    why:'Detector menuntun seperti hidung: pembacaan menguat di fitting kompresi outlet kompresor — kendor termakan getaran. Di-tag, di-LOTO, dijadwalkan perbaikan + re-torque seluruh fitting sejenis. Insiden ditutup dengan pelajaran, bukan hanya napas lega.',
    fx(){spark(worldPos(mlk.fitting),0xffd23f);
      toast('🔍 Sumber: fitting outlet kendor — TAG & LOTO terpasang.','ok',3000);sfx.big();}},
  ],()=>{say('🎉 <b>Nol penyulutan, nol korban.</b> Tanpa saklar disentuh, ESD dari titik aman, gas diberi jalan pulang ke langit, dan sumber ditemukan dengan sabar. Begitulah profesional hidrogen menulis cerita yang membosankan — dan membosankan itu sempurna.');
    setTimeout(()=>showWin('leak'),2200);});
  say('VOLTA di sini, tegang sedikit boleh 🚨 <b>Kebocoran H₂ zona kompresor!</b> Aturan emasnya berlawanan dengan naluri: <b>jangan nyalakan atau matikan APAPUN di dalam zona</b>. ESD ada di luar — mulai dari membaca detektor.');
  $('#modTitle').textContent='J14·M3 — Tanggap Darurat H₂';
  $('#taskHead').textContent='TANPA PERCIKAN · ESD · VENTILASI';}
MISSIONS.leak.build=buildLeak;
Object.assign(REAL,{
 leak:[
  'Drill tanggap darurat H₂ dilatih berkala dengan skenario & evaluasi — bukan sekali saat komisioning',
  'Peralatan respon (detector, radio) harus rating Ex/intrinsically safe — alat biasa = pemantik',
  'Investigasi akar: fitting kendor karena getaran → jadwal re-torque & dudukan anti-vibrasi',
  'Laporkan sesuai ketentuan K3: near-miss hari ini adalah data pencegah fatality besok'],
});

/* =====================================================================
   MISI 4 — BLENDING H2 KE JARINGAN GAS
   ===================================================================== */
Object.assign(MISSIONS,{
 blend:{lvl:'JALUR 14 · HYDROGEN ENERGY · MISI 4',icon:'🌀',title:'Blending H₂ ke Jaringan Gas',strict:true,
  loc:'📍 Stasiun blending · Pilot 5% H₂ ke jaringan gas kota',
  story:'Proyek percontohan nasional mendarat di plant-mu: menyuntikkan hidrogen hijau ke jaringan gas kota — mulai 5%. Ribuan kompor & boiler pelanggan di ujung pipa tidak boleh merasakan perubahan apa pun: nyala harus tetap biru, alat tetap aman. Di dunia gas, perubahan harus tak terasa — dan kunci tak terasanya bernama Wobbe Index.',
  goal:'Blending 5% berjalan stabil: kualitas gas dalam batas Wobbe, injeksi termonitor real-time, dan uji nyala pelanggan lolos.',
  obj:['Verifikasi kesiapan & batas kualitas gas campuran','Mulai injeksi bertahap dengan kontrol rasio','Monitor Wobbe Index & uji nyala di titik pelanggan'],
  learn:['Wobbe Index = ukuran kesetaraan panas burner: dua gas ber-Wobbe sama memberi nyala setara di alat yang sama — paspor kualitas gas','H₂ berkalor rendah per m³ tapi ringan: blending kecil menggeser Wobbe sedikit — itulah kenapa dimulai 5%, bukan 20%','Rasio injeksi mengikuti ALIRAN gas utama secara dinamis: aliran turun, injeksi ikut turun — rasio konstan, bukan debit konstan','Material pipa & seal diverifikasi untuk H₂ (embrittlement); pipa polietilen distribusi umumnya lebih toleran dari baja tua'],
  next:['Pelajari dampak blending pada alat pelanggan di rasio lebih tinggi','Dalami deblending & pemisahan H₂ di titik industri','Eksplorasi jaringan H₂ murni: kapan pipa khusus layak dibangun']},
});
let mbl={};
function buildBlend(){
  freshScene(0xa8c4d8,0x0e1a22);
  cam={theta:-.1,phi:1.18,r:9,target:new THREE.Vector3(0,1.7,-.8)};
  const ground=boxT(20,.1,12,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  /* pipa gas utama */
  const pipa=cyl(.22,.22,14,0xd8c23a,18,{metalness:.4});pipa.rotation.z=Math.PI/2;
  pipa.position.set(0,1.0,-2.6);scene.add(pipa);
  scene.add(label('JARINGAN GAS KOTA →',.8).translateY(1.6).translateZ(-2.6));
  /* storage H2 + injector */
  mbl.tank=cyl(.5,.5,2.0,0x9aa7b4,18,{metalness:.4});mbl.tank.position.set(-4.6,1.6,.4);scene.add(mbl.tank);
  scene.add(label('STORAGE H₂ HIJAU',.65).translateX(-4.6).translateY(2.85).translateZ(.4));
  const pipaH=cyl(.08,.08,2.4,0x8a96a2);pipaH.rotation.x=.6;
  pipaH.position.set(-4.6,.9,-.9);scene.add(pipaH);
  mbl.inj=box(.5,.6,.4,0x2a5a8a);mbl.inj.position.set(-4.6,.95,-2.3);scene.add(mbl.inj);
  actMesh(mbl.inj,'INJEKSI');
  scene.add(label('INJECTOR + FLOW CONTROL',.6,'#5fd4ff').translateX(-4.6).translateY(.45).translateZ(-1.9));
  /* analyzer Wobbe */
  mbl.wob=box(.6,.8,.4,0xcc8830);mbl.wob.position.set(-.8,1.0,-1.6);scene.add(mbl.wob);
  actMesh(mbl.wob,'CEKLIST');
  scene.add(label('GAS CHROMATOGRAPH + WOBBE',.6,'#5fd4ff').translateX(-.8).translateY(1.7).translateZ(-1.6));
  /* display monitor */
  mbl.D=makeDisplay(2.2,1.2,440,250);
  mbl.D.mesh.position.set(2.6,2.3,-2.8);scene.add(mbl.D.mesh);
  actMesh(mbl.D.mesh,'MONITOR');
  const pole=cyl(.04,.04,1.7,0x666666);pole.position.set(2.6,.85,-2.8);scene.add(pole);
  mbl.h2=0;mbl.wobbe=51.2;mbl.inject=false;
  function layar(){
    dispText(mbl.D,[mbl.h2.toFixed(1)+'% H₂ · Wobbe '+mbl.wobbe.toFixed(1),
      (mbl.wobbe>=47.5&&mbl.wobbe<=53)?'DALAM BATAS ✓ (47,5-53)':'⚠ LUAR BATAS'],
      [(mbl.wobbe>=47.5&&mbl.wobbe<=53)?'#46ff8e':'#ff5a5a','#8aa3bd']);}
  layar();
  moduleTick=(dt)=>{if(mbl.inject&&mbl.h2<5){mbl.h2=Math.min(5,mbl.h2+dt*.9);
    mbl.wobbe=51.2-mbl.h2*.22;layar();}};
  /* kompor pelanggan */
  const kompor=boxT(.9,.5,.7,TEX.metal(),{metalness:.4});kompor.position.set(6.2,.3,-1.0);scene.add(kompor);
  mbl.api=new THREE.Mesh(new THREE.ConeGeometry(.12,.3,12),
    new THREE.MeshStandardMaterial({color:0x3a8aff,emissive:0x000000,transparent:true,opacity:.85}));
  mbl.api.position.set(6.2,.7,-1.0);scene.add(mbl.api);
  actMesh(kompor,'NYALA');
  scene.add(label('TITIK UJI PELANGGAN',.65).translateX(6.2).translateY(1.2).translateZ(-1.0));
  startSeq([
   {type:'act',aid:'CEKLIST',done:false,targets:()=>[mbl.wob],
    desc:'Verifikasi KESIAPAN: kualitas gas dasar & batas regulasi (klik analyzer).',
    why:'Gas kota saat ini: Wobbe 51,2 MJ/m³ — batas regulasi 47,5–53. Simulasi: tiap persen H₂ menggeser ±0,22 turun, jadi 5% mendarat di 50,1 — masih nyaman di tengah. Material pipa PE distribusi: kompatibel. Lampu hijau ilmiah untuk memulai.',
    fx(){toast('📋 Wobbe 51,2 · proyeksi 5% → 50,1 (aman) · pipa PE ✓','ok',3000);}},
   {type:'act',aid:'INJEKSI',done:false,targets:()=>[mbl.inj],
    desc:'Mulai INJEKSI bertahap — flow control mengikuti aliran utama.',
    why:'Valve membuka perlahan; controller membaca aliran gas utama tiap detik dan menyesuaikan injeksi agar rasio TETAP — malam saat kota memasak sedikit, injeksi ikut mengecil. Rasio konstan adalah janji pada setiap kompor di ujung pipa.',
    fx(){mbl.inject=true;beep(180,.6,'sine',.07);
      toast('🌀 Injeksi dimulai — amati persen H₂ merangkak ke 5%.','ok',2800);}},
   {type:'act',aid:'MONITOR',done:false,targets:()=>[mbl.D.mesh],
    check:()=>mbl.h2>=5,
    checkFail:'Belum stabil di 5%! Tunggu rasio mencapai target di layar monitor.',
    desc:'Saat stabil 5%: verifikasi WOBBE di monitor (klik layar).',
    why:'5,0% H₂ · Wobbe 50,1 — persis seperti proyeksi, dan masih jauh dari kedua tepi batas. Gas chromatograph memeriksa tiap menit, alarm dua tingkat berjaga. Perubahan terbesar di jaringan ini adalah... tidak ada yang berubah.',
    fx(){toast('📊 5% stabil · Wobbe 50,1 DALAM BATAS — pelanggan tak merasakan apa pun.','ok',3000);}},
   {type:'act',aid:'NYALA',done:false,targets:()=>[kompor],
    desc:'Uji pamungkas: NYALAKAN kompor di titik uji pelanggan.',
    why:'Nyala biru stabil, tinggi normal, tanpa flashback — burner tak tahu bahwa 5% dari yang ia bakar lahir dari matahari & air di plant-mu. Tiap m³ H₂ menggantikan gas fosil: dekarbonisasi yang mengalir diam-diam ke ribuan dapur.',
    fx(){mbl.api.material.emissive.setHex(0x3a8aff);mbl.api.material.emissiveIntensity=1;
      toast('🔵 Nyala biru sempurna — pilot blending RESMI beroperasi!','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Hidrogen mengalir ke kota — tanpa ada yang sadar!</b> Wobbe terjaga, rasio terkunci, nyala tetap biru. Begitulah transisi energi terbaik bekerja: revolusioner di hulu, tak terasa di hilir.');
    setTimeout(()=>showWin('blend'),2200);});
  say('VOLTA di sini 🌀 Proyek nasional di tanganmu: <b>menyuntik H₂ 5% ke jaringan gas kota</b>. Hukumnya satu: ribuan kompor di ujung pipa tak boleh merasakan apa pun — dan penjaganya bernama <b>Wobbe Index</b>. Mulai dari analyzer.');
  $('#modTitle').textContent='J14·M4 — Blending H₂ ke Jaringan Gas';
  $('#taskHead').textContent='JAGA WOBBE, JAGA NYALA BIRU';}
MISSIONS.blend.build=buildBlend;
Object.assign(REAL,{
 blend:[
  'Studi dampak ke SEMUA tipe alat pelanggan (kompor, boiler, genset gas) sebelum menaikkan rasio',
  'Gas chromatograph online + alarm dua tingkat pada batas Wobbe — kualitas dipantau, bukan diasumsikan',
  'Inventarisasi material jaringan: segmen baja tua & seal lama diaudit untuk kompatibilitas H₂',
  'Sosialisasi & jalur pengaduan pelanggan disiapkan — kepercayaan publik adalah infrastruktur juga'],
});
