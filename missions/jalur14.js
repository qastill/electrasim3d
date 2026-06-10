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

/* =====================================================================
   MISI 5 — LOGISTIK H2: TUBE TRAILER
   ===================================================================== */
Object.assign(MISSIONS,{
 trailer:{lvl:'JALUR 14 · HYDROGEN ENERGY · MISI 5',icon:'🚛',title:'Logistik H₂: Loading Tube Trailer',strict:true,
  loc:'📍 Plant H₂ · Bay loading, pengiriman perdana ke industri',
  story:'Pelanggan industri di kawasan sebelah meneken kontrak: 300 kg H₂ per minggu. Pipa belum ada — jalurnya darat: TUBE TRAILER, truk berisi deretan tabung raksasa 250 bar. Hari ini loading perdana, dan logistik hidrogen punya hukum acaranya sendiri: grounding sebelum selang, leak test sebelum aliran, dokumen sebelum roda berputar.',
  goal:'Tube trailer terisi 300 kg dengan aman: bonding-grounding, leak test, transfer terkontrol dengan pemantauan suhu, dan dokumen pengangkutan B3 lengkap.',
  obj:['Posisikan trailer & bonding-grounding','Sambung selang transfer + leak test','Transfer terkontrol lalu lengkapi dokumen pengangkutan'],
  learn:['Tube trailer = baterai hidrogen beroda: deretan tabung panjang 250 bar — kapasitas dihitung dari selisih tekanan awal-akhir','Transfer gas bertekanan MEMANASKAN tabung penerima (kompresi): laju diatur agar suhu tabung tak melampaui batas desain','Bonding dulu, selang kemudian, leak test sebelum aliran — urutan ritual yang sama di darat maupun stasiun','H₂ di jalan raya = pengangkutan B3: dokumen, placard, rute & sopir bersertifikat — kecelakaan administrasi sama mahalnya dengan kecelakaan fisik'],
  next:['Bandingkan ekonomi tube trailer vs pipa vs liquid H₂ per jarak','Pelajari regulasi pengangkutan B3 & sertifikasi pengemudi','Dalami desain loading bay: zona, ESD, & fire protection']},
});
let mtt={};
function buildTrailer(){
  freshScene(0xa8c4d8,0x0e1a22);
  cam={theta:.2,phi:1.15,r:10,target:new THREE.Vector3(0,1.5,-.8)};
  const ground=boxT(24,.1,14,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  const bay=boxT(8,.04,5,TEX.hazard());bay.position.set(1,.05,-1.5);scene.add(bay);
  /* truk + tube trailer */
  mtt.truk=new THREE.Group();
  const kabin=box(1.2,1.1,1.3,0x2a5a8a);kabin.position.set(-2.2,.85,0);mtt.truk.add(kabin);
  const chasis=box(4.4,.25,1.3,0x444b55);chasis.position.set(.6,.45,0);mtt.truk.add(chasis);
  for(let i=0;i<4;i++){
    const tube=cyl(.22,.22,4.0,0x9aa7b4,16,{metalness:.5});tube.rotation.z=Math.PI/2;
    tube.position.set(.6,.85+Math.floor(i/2)*.5,(i%2)*.55-.27);mtt.truk.add(tube);}
  [[-1.6],[1.2],[2.4]].forEach(o=>{[-.6,.6].forEach(z=>{
    const wh=cyl(.3,.3,.22,0x14181d);wh.rotation.x=Math.PI/2;
    wh.position.set(o[0],.3,z);mtt.truk.add(wh);});});
  mtt.truk.position.set(1,0,-1.5);scene.add(mtt.truk);
  scene.add(label('TUBE TRAILER 250 bar',.8).translateX(1).translateY(2.3).translateZ(-1.5));
  /* kabel bonding */
  mtt.bond=box(.3,.1,.12,0xd8b020);mtt.bond.position.set(-1.4,.35,.8);scene.add(mtt.bond);
  actMesh(mtt.bond,'BOND');
  scene.add(label('KABEL BONDING',.55,'#5fd4ff').translateX(-1.6).translateY(.75).translateZ(1.0));
  /* manifold + selang */
  mtt.mani=boxT(.7,1.2,.5,TEX.metal(),{metalness:.4});mtt.mani.position.set(4.8,.65,-1.5);scene.add(mtt.mani);
  actMesh(mtt.mani,'SELANG');
  scene.add(label('MANIFOLD LOADING + SELANG',.6,'#5fd4ff').translateX(4.8).translateY(1.55).translateZ(-1.5));
  /* display transfer */
  mtt.D=makeDisplay(1.6,.9,360,200);
  mtt.D.mesh.position.set(4.8,2.4,-2.4);scene.add(mtt.D.mesh);
  dispText(mtt.D,['SIAP','0 kg · 20 bar'],['#7d8f84','#8aa3bd']);
  actMesh(mtt.D.mesh,'TRANSFER');
  /* dokumen */
  mtt.dok=box(.5,.66,.04,0xe8e4d8);mtt.dok.position.set(-4.6,1.4,-2.2);scene.add(mtt.dok);
  actMesh(mtt.dok,'DOKUMEN');
  const tiang=cyl(.03,.03,1.4,0x666666);tiang.position.set(-4.6,.7,-2.2);scene.add(tiang);
  scene.add(label('DOKUMEN ANGKUT B3',.6,'#5fd4ff').translateX(-4.6).translateY(2.0).translateZ(-2.2));
  mtt.kg=0;mtt.bar=20;mtt.fill=false;
  moduleTick=(dt)=>{if(mtt.fill&&mtt.kg<300){
    mtt.kg=Math.min(300,mtt.kg+dt*24);mtt.bar=20+(mtt.kg/300)*230;
    dispText(mtt.D,[Math.round(mtt.kg)+' kg · '+Math.round(mtt.bar)+' bar',
      'suhu tabung '+(28+mtt.kg/300*22).toFixed(0)+'°C'+(mtt.kg>=300?' · PENUH ✓':'')],
      [mtt.kg>=300?'#46ff8e':'#5fd4ff','#ffd23f']);}};
  startSeq([
   {type:'act',aid:'BOND',done:false,targets:()=>[mtt.bond],
    desc:'Trailer parkir, mesin MATI, roda diganjal — pasang BONDING (klik kabel).',
    why:'Ritual pembuka yang tak pernah berubah: potensial trailer & plant disamakan SEBELUM benda apa pun saling menyentuh. Truk yang berjalan ratusan kilometer membawa muatan statis — dan di bay loading hidrogen, satu percikan adalah satu berita nasional.',
    fx(){mtt.bond.position.set(2.8,.4,-.6);
      toast('🔗 Mesin off · ganjal ✓ · bonding tersambung.','ok',2800);}},
   {type:'act',aid:'SELANG',done:false,targets:()=>[mtt.mani],
    desc:'Sambung SELANG transfer + LEAK TEST sambungan (klik manifold).',
    why:'Selang high-pressure flex dikunci ke manifold trailer, lalu diuji dengan N₂ & detector sebelum setetes H₂ pun lewat: nol ppm di semua fitting. Breakaway coupling terpasang — bila truk bergerak tak sengaja, sambungan putus aman, bukan robek liar.',
    fx(){toast('🔌 Selang terkunci · leak test 0 ppm · breakaway siap.','ok',2800);}},
   {type:'act',aid:'TRANSFER',done:false,targets:()=>[mtt.D.mesh],
    desc:'Mulai TRANSFER terkontrol — pantau tekanan & SUHU (klik display).',
    why:'Kompresi memanaskan tabung penerima: laju diatur agar suhu tak melewati 65°C — terlalu serakah = transfer dihentikan paksa oleh proteksi termal. 300 kg butuh kesabaran; hidrogen tak pernah menghargai ketergesaan.',
    fx(){mtt.fill=true;beep(200,.6,'sine',.07);
      toast('⛽ Transfer berjalan — perhatikan suhu ikut menanjak.','ok',2800);}},
   {type:'act',aid:'DOKUMEN',done:false,targets:()=>[mtt.dok],
    check:()=>mtt.kg>=300,
    checkFail:'Transfer belum penuh! Tunggu 300 kg tercapai sebelum menutup dokumen.',
    desc:'300 kg penuh: lepas selang (purging), lengkapi DOKUMEN angkut (klik dokumen).',
    why:'Selang di-purge N₂ sebelum dilepas, valve trailer terkunci & tersegel. Dokumen B3: manifes, placard "Gas Mudah Terbakar", rute yang menghindari terowongan, sertifikat sopir, nomor darurat. Truk ini legal sampai ke gerbang pelanggan — administrasi adalah APD-nya perjalanan.',
    fx(){mtt.fill=false;
      toast('📋 300 kg tersegel · dokumen lengkap — trailer BERANGKAT!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Pengiriman perdana berangkat!</b> Bonding dulu, leak test sebelum aliran, suhu dijaga, dokumen menutup ritual. Hidrogenmu kini menempuh jalan raya — dengan semua hukum acaranya terpenuhi.');
    setTimeout(()=>showWin('trailer'),2200);});
  say('VOLTA di sini 🚛 Kontrak 300 kg/minggu — dan jalurnya darat: <b>tube trailer</b>. Logistik H₂ punya hukum acara: grounding sebelum selang, leak test sebelum aliran, dokumen sebelum roda. Trailer sudah parkir. Mulai!');
  $('#modTitle').textContent='J14·M5 — Loading Tube Trailer';
  $('#taskHead').textContent='BOND · TEST · TRANSFER · DOKUMEN';}
MISSIONS.trailer.build=buildTrailer;
Object.assign(REAL,{
 trailer:[
  'Bay loading dirancang dgn zona ATEX, ESD & deteksi api H₂ (UV/IR) — bukan halaman parkir biasa',
  'Periksa sertifikasi tabung trailer (uji periodik) sebelum tiap pengisian — tanggal di pelat itu hukum',
  'Driver wajib pelatihan B3 + APD & detector pribadi; rute disurvei (hindari terowongan & padat)',
  'Prosedur darurat perjalanan disepakati dengan pelanggan: nomor kontak, titik aman, skenario bocor'],
});

/* =====================================================================
   MISI 6 — EFISIENSI STACK: MERAWAT JANTUNG ELEKTROLISER
   ===================================================================== */
Object.assign(MISSIONS,{
 stack:{lvl:'JALUR 14 · HYDROGEN ENERGY · MISI 6',icon:'💓',title:'Efisiensi Stack: Merawat Jantung Elektroliser',strict:false,
  loc:'📍 Plant H₂ · Evaluasi kinerja tahun kedua',
  story:'Dua tahun plant-mu beroperasi, dan akuntan menemukan tren yang mengganggu: biaya listrik per kg H₂ merangkak naik 9%. Listriknya tidak menjadi mahal — STACK-nya yang menua: membran menipis, katalis terkikis, tiap kg hidrogen kini menuntut lebih banyak kWh. Hari ini kamu dokter jantung elektroliser: ukur degradasinya, temukan penyebab yang bisa dilawan, dan putuskan kapan transplantasi.',
  goal:'Kinerja stack terdiagnosis: efisiensi spesifik terukur vs baseline, penyebab degradasi yang reversible tertangani, dan keputusan penggantian terjadwal berbasis ekonomi.',
  obj:['Ukur kWh/kg aktual vs baseline komisioning','Bedah penyebab: kualitas air & suhu operasi','Koreksi yang bisa dikoreksi, jadwalkan yang tidak'],
  learn:['Efisiensi elektroliser diukur satu angka: kWh per kg H₂ — baseline 52, teori 39,4; tiap kenaikan adalah uang dan jejak karbon','Degradasi stack ada dua jenis: reversible (kontaminasi air, suhu salah) dan permanen (membran menipis, katalis larut) — bedakan sebelum memvonis','Kemurnian air umpan adalah nyawa membran PEM: konduktivitas naik sedikit = ion pengotor menempel di katalis — water treatment adalah perawatan jantung juga','Keputusan ganti stack adalah hitungan ekonomi: selisih biaya listrik kumulatif vs harga stack baru — ada titik di mana terus memakai yang tua justru lebih mahal'],
  next:['Pelajari kurva polarisasi: diagnosa elektrokimia yang presisi','Dalami strategi operasi: load factor vs umur stack','Eksplorasi recycling stack: platinum & iridium terlalu mahal untuk dibuang']},
});
let msk={};
function buildStack(){
  freshScene(0xa8c4d8,0x0e1a22);
  cam={theta:-.05,phi:1.17,r:8.5,target:new THREE.Vector3(0,1.6,-.8)};
  const ground=boxT(20,.1,12,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  /* elektroliser stack */
  msk.elc=box(2.2,1.8,1.4,0xd8e0e8);msk.elc.position.set(-3.4,.95,-2);scene.add(msk.elc);
  for(let i=0;i<6;i++){const fin=box(.04,1.6,1.3,0x9aa7b4);fin.position.set(-4.3+i*.36,.95,-2);scene.add(fin);}
  scene.add(label('STACK PEM — tahun ke-2',.8).translateX(-3.4).translateY(2.25).translateZ(-2));
  /* layar kinerja */
  const frame=boxT(3.8,2.2,.16,TEX.metal(),{metalness:.4});frame.position.set(1.2,2.4,-3.0);scene.add(frame);
  frame.add(label('KINERJA: kWh per kg H₂',.8).translateY(1.35));
  msk.D=makeDisplay(3.5,1.9,540,310);
  msk.D.mesh.position.set(1.2,2.4,-2.9);scene.add(msk.D.mesh);
  actMesh(msk.D.mesh,'UKUR');
  function kurva(mode){
    const g=msk.D.g,W=540,H=310;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.strokeStyle='#2a3a4c';g.lineWidth=2;
    g.beginPath();g.moveTo(50,16);g.lineTo(50,H-40);g.lineTo(W-12,H-40);g.stroke();
    g.font='600 14px Consolas';g.textAlign='left';
    g.fillStyle='#8aa3bd';g.fillText('60',16,60);g.fillText('52',16,160);
    const pts=[[0,52],[6,52.8],[12,53.9],[18,55.4],[24,56.7]];
    g.strokeStyle='#ffd23f';g.lineWidth=3;g.beginPath();
    pts.forEach((p,i)=>{const x=50+p[0]*19,y=H-40-(60-p[1])*26;
      i===0?g.moveTo(x,y):g.lineTo(x,y);g.fillStyle='#ffd23f';g.fillRect(x-3,y-3,6,6);});
    g.stroke();
    g.fillStyle='#ffd23f';g.font='700 17px Consolas';
    g.fillText('52 → 56,7 kWh/kg (+9%) dalam 24 bulan',58,34);
    if(mode>=1){g.strokeStyle='#46ff8e';g.setLineDash([6,5]);g.lineWidth=3;
      g.beginPath();g.moveTo(50+24*19,H-40-(60-54.8)*26);g.lineTo(50+25.5*19,H-40-(60-54.6)*26);
      g.stroke();g.setLineDash([]);
      g.fillStyle='#46ff8e';g.fillText('pasca-koreksi: 54,8 (separuh pulih)',58,60);}
    msk.D.tex.needsUpdate=true;}
  kurva(0);
  /* water treatment */
  msk.wt=boxT(1.0,1.2,.7,TEX.metal(),{metalness:.3});msk.wt.position.set(4.4,.65,-2);scene.add(msk.wt);
  actMesh(msk.wt,'AIR');
  scene.add(label('WATER TREATMENT (resin DI)',.6,'#5fd4ff').translateX(4.4).translateY(1.55).translateZ(-2));
  /* sensor suhu / chiller */
  msk.suhu=box(.4,.4,.2,0x2a5a8a);msk.suhu.position.set(-1.0,1.4,-1.2);scene.add(msk.suhu);
  actMesh(msk.suhu,'SUHU');
  scene.add(label('LOOP PENDINGIN STACK',.55,'#5fd4ff').translateX(-1.0).translateY(1.95).translateZ(-1.1));
  /* lembar keputusan ekonomi */
  msk.eco=box(.5,.66,.04,0xe8e4d8);msk.eco.position.set(5.8,2.0,-2.9);scene.add(msk.eco);
  actMesh(msk.eco,'EKONOMI');
  scene.add(label('ANALISIS EKONOMI',.55,'#5fd4ff').translateX(5.8).translateY(2.55).translateZ(-2.9));
  startSeq([
   {type:'act',aid:'UKUR',done:false,targets:()=>[msk.D.mesh],
    desc:'Ukur kinerja: berapa kWh per kg HARI INI vs baseline? (klik layar)',
    why:'Meter listrik ÷ massa H₂ terproduksi pada beban standar: 56,7 kWh/kg — baseline komisioning 52. Kenaikan 9% dalam dua tahun: separuh wajar (membran memang menua), separuh lagi... mencurigakan. Kurva tidak berbohong, tapi ia juga belum menyebut pelakunya.',
    fx(){toast('💓 56,7 kWh/kg (baseline 52) — +9%, sebagian bisa dilawan.','bad',3000);}},
   {type:'act',aid:'AIR',done:false,targets:()=>[msk.wt],
    desc:'Tersangka #1: periksa KUALITAS AIR umpan (klik water treatment).',
    why:'Konduktivitas air umpan: 0,9 µS/cm — spesifikasi menuntut <0,1! Resin deionisasi ternyata jenuh sejak entah kapan, dan ion-ion pengotor pelan-pelan meracuni katalis. Resin diganti, konduktivitas pulih 0,06. Sebagian degradasi itu ternyata bukan takdir — ia kelalaian yang bisa ditebus.',
    fx(){toast('💧 Resin DI jenuh! Diganti → 0,06 µS/cm ✓','bad',3000);}},
   {type:'act',aid:'SUHU',done:false,targets:()=>[msk.suhu],
    desc:'Tersangka #2: audit SUHU operasi stack (klik loop pendingin).',
    why:'Log menunjukkan stack sering beroperasi 49°C — di bawah titik optimal 58°C (sensor chiller terkalibrasi melenceng). Stack terlalu dingin = membran kurang konduktif = tegangan sel naik = boros. Sensor dikalibrasi, setpoint dikembalikan: efisiensi naik tanpa menyentuh stack itu sendiri.',
    fx(){kurva(1);
      toast('🌡️ Setpoint pulih 58°C — kWh/kg turun ke 54,8 (separuh pulih).','ok',3000);}},
   {type:'act',aid:'EKONOMI',done:false,targets:()=>[msk.eco],
    desc:'Sisa degradasi permanen: hitung KAPAN ganti stack (klik analisis).',
    why:'54,8 vs 52: sisa 2,8 kWh/kg adalah penuaan sejati (membran menipis — tak ada obatnya). Proyeksi: pada bulan ke-40, kelebihan biaya listrik kumulatif menyamai harga stack baru — itulah tanggal transplantasi yang rasional. Dipesan sekarang (lead time 6 bulan), diganti tepat sebelum merugi. Stack lama? Di-recycle: iridiumnya lebih berharga dari emas.',
    fx(){toast('📉 Ganti stack terjadwal bln-40 + PO dipesan — ekonomi menang.','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Jantung plant terdiagnosis tuntas!</b> Separuh degradasi ternyata kelalaian yang tertebus (air & suhu), separuhnya penuaan yang dijadwalkan ekonominya. Merawat elektroliser = merawat angka kWh/kg — satu desimal pun berarti.');
    setTimeout(()=>showWin('stack'),2200);});
  say('VOLTA di sini 💓 Akuntan menemukan yang teknisi lewatkan: <b>biaya per kg H₂ naik 9%</b>. Stack-mu menua — tapi berapa persen takdir, berapa persen kelalaian? Hari ini kita jadi dokter jantung. Mulai dari mengukur!');
  $('#modTitle').textContent='J14·M6 — Efisiensi Stack';
  $('#taskHead').textContent='kWh/kg: DETAK YANG DIHITUNG';}
MISSIONS.stack.build=buildStack;
Object.assign(REAL,{
 stack:[
  'Ukur efisiensi pada kondisi standar yang sama (beban, suhu, tekanan) — tren butuh apel-ke-apel',
  'Pantau konduktivitas air umpan online dengan alarm — kontaminasi sehari merusak berbulan-bulan',
  'Simpan kurva polarisasi tahunan per stack — sidik jari degradasi untuk klaim garansi',
  'Kontrak recycling stack sejak pembelian: logam grup platinum wajib pulang ke rantai pasok'],
});

/* =====================================================================
   MISI 7 — AMONIA HIJAU: HIDROGEN YANG BISA BERLAYAR
   ===================================================================== */
Object.assign(MISSIONS,{
 amonia:{lvl:'JALUR 14 · HYDROGEN ENERGY · MISI 7',icon:'🚢',title:'Amonia Hijau: Hidrogen yang Bisa Berlayar',strict:true,
  loc:'📍 Plant H₂ · Modul Haber-Bosch mini, produksi perdana',
  story:'Pembeli dari Jepang tertarik hidrogen hijaumu — tapi mengirim H₂ menyeberangi laut itu mimpi mahal: terlalu ringan, terlalu liar. Solusi industri dunia: kemas hidrogen sebagai AMONIA (NH₃) — tiga hidrogen menumpang satu nitrogen, cair di suhu wajar, dan kapal pengangkutnya sudah berlayar sejak puluhan tahun. Hari ini modul Haber-Bosch mini-mu produksi perdana.',
  goal:'Amonia hijau perdana terproduksi aman: nitrogen dipisahkan dari udara, sintesis berjalan pada rasio & kondisi benar, dan produk tersimpan dengan disiplin toksisitasnya.',
  obj:['Siapkan nitrogen dari air separation & rasio umpan','Jalankan reaktor sintesis pada kondisi operasi','Kondensasikan, simpan & terapkan disiplin NH₃'],
  learn:['Amonia = kurir hidrogen: energi per m³ jauh lebih padat dari H₂ terkompresi, cair di −33°C (atau bertekanan moderat) — logistik kapal sudah matang puluhan tahun','Haber-Bosch menjodohkan N₂ + 3H₂ → 2NH₃ pada tekanan tinggi & katalis besi: reaksi bolak-balik — gas tak bereaksi diputar kembali (recycle loop), bukan dibuang','Nitrogen diambil dari udara (78% gratis!) lewat air separation/PSA — kemurnian penting: oksigen yang lolos meracuni katalis','H₂ mudah terbakar; NH₃ menambah dimensi TOKSIK: bau menusuk justru alarm alami — deteksi, ventilasi & APD berbeda kelas dengan plant H₂ biasa'],
  next:['Pelajari cracking: mengubah amonia kembali jadi H₂ di pelabuhan tujuan','Dalami amonia sebagai bahan bakar kapal langsung (dual-fuel engine)','Eksplorasi sertifikasi hijau rantai NH₃ untuk pasar ekspor']},
});
let mna={};
function buildAmonia(){
  freshScene(0xa8c4d8,0x0e1a22);
  cam={theta:.1,phi:1.16,r:10,target:new THREE.Vector3(0,1.8,-.8)};
  const ground=boxT(24,.1,13,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  /* PSA nitrogen */
  mna.psa=boxT(1.4,1.8,1.0,TEX.metal(),{metalness:.35});mna.psa.position.set(-6.2,.95,-2);scene.add(mna.psa);
  actMesh(mna.psa,'N2');
  scene.add(label('PSA — NITROGEN DARI UDARA',.65,'#5fd4ff').translateX(-6.2).translateY(2.2).translateZ(-2));
  /* mixer rasio */
  mna.mix=box(.8,.8,.6,0x2a5a8a);mna.mix.position.set(-3.6,.85,-2);scene.add(mna.mix);
  actMesh(mna.mix,'RASIO');
  scene.add(label('MIXER N₂:H₂',.6,'#5fd4ff').translateX(-3.6).translateY(1.6).translateZ(-2));
  /* reaktor sintesis */
  mna.reak=cyl(.7,.7,2.6,0x8a6a4a,20,{metalness:.3});mna.reak.position.set(-.8,1.4,-2);scene.add(mna.reak);
  actMesh(mna.reak,'SINTESIS');
  scene.add(label('REAKTOR HABER-BOSCH',.75).translateX(-.8).translateY(3.0).translateZ(-2));
  mna.D=makeDisplay(1.2,.7,300,170);
  mna.D.mesh.position.set(-.8,1.5,-1.28);scene.add(mna.D.mesh);
  dispText(mna.D,['STANDBY','—'],['#7d8f84','#7d8f84']);
  /* kondensor + tangki NH3 */
  mna.kond=box(.9,.7,.6,0x6a8aa8);mna.kond.position.set(1.8,.75,-2);scene.add(mna.kond);
  mna.tank=new THREE.Mesh(new THREE.SphereGeometry(1.1,22,16),
    new THREE.MeshStandardMaterial({color:0xe8edf2,roughness:.35,metalness:.3}));
  mna.tank.position.set(4.6,1.15,-2);scene.add(mna.tank);
  actMesh(mna.tank,'SIMPAN');
  scene.add(label('TANGKI NH₃ −33°C',.7).translateX(4.6).translateY(2.6).translateZ(-2));
  /* deteksi & shower darurat */
  mna.det=box(.2,.3,.1,0x46a06a);mna.det.position.set(3.2,2.2,-1.2);scene.add(mna.det);
  scene.add(label('DETEKTOR NH₃ + SHOWER DARURAT',.55,'#8df0b8').translateX(3.4).translateY(2.65).translateZ(-1.1));
  mna.run=false;
  moduleTick=(dt)=>{if(mna.run){
    dispText(mna.D,['185 bar · 450°C','konversi 16%/pass ↻'],['#46ff8e','#8aa3bd']);}};
  startSeq([
   {type:'act',aid:'N2',done:false,targets:()=>[mna.psa],
    desc:'Nyalakan PSA: panen NITROGEN dari udara (klik unit).',
    why:'Udara = 78% nitrogen gratis — PSA memisahkannya dengan ayakan molekul: N₂ 99,99% mengalir ke buffer. Kemurnian bukan kemewahan: oksigen yang menyusup akan MERACUNI katalis besi di reaktor — pembunuh senyap bernilai miliaran.',
    fx(){toast('🌬️ N₂ 99,99% mengalir — oksigen tertahan di ayakan.','ok',2800);}},
   {type:'act',aid:'RASIO',done:false,targets:()=>[mna.mix],
    desc:'Atur RASIO umpan N₂:H₂ = 1:3 presisi (klik mixer).',
    why:'Stoikiometri adalah resepnya: satu nitrogen menggandeng tiga hidrogen. Flow controller mengunci 1:3,02 (sedikit kelebihan H₂ disengaja) — rasio meleset membuat gas inert menumpuk di loop dan konversi anjlok. Kimia industri dimenangkan di angka desimal.',
    fx(){toast('⚖️ Rasio terkunci 1:3 — resep stoikiometri sah.','ok',2800);}},
   {type:'act',aid:'SINTESIS',done:false,targets:()=>[mna.reak],
    desc:'Panaskan & tekan: jalankan REAKTOR sintesis (klik reaktor).',
    why:'185 bar, 450°C, katalis besi — kondisi yang memaksa dua gas pemalu itu menikah. Konversi hanya ±16% sekali lewat: sisanya TIDAK dibuang melainkan diputar kembali (recycle loop) sampai habis bereaksi. Haber-Bosch: reaksi yang memberi makan separuh umat manusia, kini bekerja untuk energi.',
    fx(){mna.run=true;beep(140,.8,'sine',.08);
      toast('⚗️ Sintesis berjalan: 185 bar · 450°C · loop berputar.','ok',3000);}},
   {type:'act',aid:'SIMPAN',done:false,targets:()=>[mna.tank],
    desc:'Kondensasikan & SIMPAN: amonia cair perdana (klik tangki).',
    why:'Gas keluaran didinginkan — NH₃ mengembun di −33°C menjadi cairan jernih, masuk tangki berinsulasi. Disiplin barunya: NH₃ TOKSIK — detektor ambang ketat, shower darurat teruji, APD respirator untuk pekerjaan sambungan. Bau menusuknya adalah alarm alami: jauh sebelum berbahaya, hidung sudah protes.',
    fx(){toast('🧊 NH₃ cair mengalir ke tangki — disiplin toksik aktif.','ok',3000);}},
   {type:'act',aid:'EKSPOR',done:false,targets:()=>[mna.tank],
    desc:'Tutup hari bersejarah: sampel uji & kontrak EKSPOR (klik tangki).',
    why:'Analisis sampel: NH₃ 99,8%, air <0,2%, jejak hijau terdokumentasi dari PLTS → elektroliser → Haber-Bosch — paspor karbon lengkap. Pembeli Jepang menandatangani LOI: hidrogenmu kini punya kapal untuk berlayar. Dari molekul paling ringan, lahir komoditas ekspor energi baru Indonesia.',
    fx(){toast('🚢 NH₃ 99,8% hijau tersertifikasi — LOI ekspor diteken!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Hidrogen kini bisa berlayar!</b> Nitrogen dipanen dari udara, rasio dijaga desimalnya, loop tak membuang apa pun, dan toksisitas dihormati selayaknya. Amonia hijau: jembatan antara elektrolisermu dan pelabuhan dunia.');
    setTimeout(()=>showWin('amonia'),2200);});
  const s3n=seq.steps[3],of3n=s3n.fx;s3n.fx=()=>{of3n();mna.tank.userData.aid='EKSPOR';};
  say('VOLTA di sini 🚢 Pembeli Jepang mau hidrogenmu — tapi H₂ tak bisa berlayar murah. Solusinya dikemas jadi <b>amonia: 3 hidrogen menumpang 1 nitrogen</b>. Hari ini Haber-Bosch mini produksi perdana. Mulai dari memanen udara!');
  $('#modTitle').textContent='J14·M7 — Amonia Hijau';
  $('#taskHead').textContent='KEMAS H₂, LAYARKAN ENERGI';}
MISSIONS.amonia.build=buildAmonia;
Object.assign(REAL,{
 amonia:[
  'NH₃ adalah B3 toksik: pelajari IDLH, jarak aman & skenario pelepasan sebelum desain plant',
  'Katalis diaktivasi mengikuti prosedur vendor — oksigen & belerang adalah racunnya seumur hidup',
  'Tangki & perpipaan NH₃ punya kode material sendiri (tembaga DILARANG — korosi amonia)',
  'Drill kebocoran NH₃ dengan komunitas sekitar — bau menusuk akan memicu kepanikan publik'],
});

/* =====================================================================
   MISI 8 — FUEL CELL STATIONARY: BACKUP TANPA ASAP
   ===================================================================== */
Object.assign(MISSIONS,{
 fcdc:{lvl:'JALUR 14 · HYDROGEN ENERGY · MISI 8',icon:'🔇',title:'Fuel Cell Stationary: Backup Tanpa Asap',strict:false,
  loc:'📍 Data center daerah · Mengganti genset diesel backup',
  story:'Data center yang pernah diaudit koleganya (PUE!) kini punya masalah citra & emisi: genset diesel backup-nya berisik, beremisi, dan tangki solarnya membusuk pelan. Mereka mendengar plant H₂-mu — dan lahirlah pilot paling elegan: FUEL CELL STATIONARY sebagai backup. Tanpa piston, tanpa asap, tanpa suara — hanya hidrogen, oksigen, dan listrik yang mengalir saat PLN pamit.',
  goal:'Sistem backup fuel cell beroperasi: storage H₂ aman di lokasi urban, fuel cell terintegrasi dgn UPS, dan uji black-building membuktikan transisi tanpa kedip.',
  obj:['Rancang storage H₂ untuk lingkungan data center','Integrasi fuel cell dgn arsitektur UPS existing','Uji transfer: PLN padam → fuel cell memikul'],
  learn:['Fuel cell backup vs genset: tanpa bagian berputar besar — start cepat, nyaris sunyi, emisi hanya air; tantangannya pindah ke LOGISTIK hidrogen','Arsitekturnya bertingkat: UPS baterai menjembatani DETIK pertama, fuel cell bangun dalam puluhan detik & memikul JAM-nya — dua teknologi saling menutupi kelemahan','Storage H₂ di lingkungan urban menuntut disiplin plant-mu: jarak aman, ventilasi atap, deteksi — dipindahkan ke halaman data center','Ketersediaan diuji rutin seperti genset: backup yang tak pernah diuji adalah dekorasi mahal — drill bulanan tetap hukum'],
  next:['Pelajari sizing storage: berapa jam autonomi yang rasional','Dalami paralel fuel cell + baterai + grid (mode peak shaving juga!)','Eksplorasi kontrak pasokan H₂ hijau jangka panjang sebagai layanan']},
});
let mfd={};
function buildFCDC(){
  freshScene(0x9fb6c8,0x0f1820);
  cam={theta:.1,phi:1.16,r:9,target:new THREE.Vector3(0,1.6,-.8)};
  const ground=boxT(22,.1,13,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  /* gedung DC */
  const dc=boxT(3.5,2.8,2.5,TEX.plaster());dc.position.set(-5.5,1.4,-2.5);scene.add(dc);
  dc.add(label('DATA CENTER',.85).translateY(1.85));
  /* genset tua (akan pensiun) */
  mfd.genset=boxT(1.8,1.2,1.0,TEX.metal(),{metalness:.3});mfd.genset.position.set(-1.6,.65,-2.4);scene.add(mfd.genset);
  const asap=new THREE.Mesh(new THREE.SphereGeometry(.2,10,8),
    new THREE.MeshStandardMaterial({color:0x444,transparent:true,opacity:.5}));
  asap.position.set(-2.2,1.7,-2.4);scene.add(asap);
  scene.add(label('GENSET DIESEL (pensiun)',.6,'#8aa3bd').translateX(-1.6).translateY(1.5).translateZ(-2.4));
  /* storage H2 */
  mfd.tank=cyl(.45,.45,1.8,0x9aa7b4,18,{metalness:.4});mfd.tank.position.set(2.2,1.4,-2.6);scene.add(mfd.tank);
  actMesh(mfd.tank,'STORAGE');
  scene.add(label('STORAGE H₂ (urban)',.65,'#5fd4ff').translateX(2.2).translateY(2.6).translateZ(-2.6));
  /* fuel cell unit */
  mfd.fc=boxT(1.4,1.2,.9,TEX.metal(),{metalness:.35});mfd.fc.position.set(4.6,.65,-2.4);scene.add(mfd.fc);
  actMesh(mfd.fc,'INTEGRASI');
  scene.add(label('FUEL CELL 200 kW',.7).translateX(4.6).translateY(1.5).translateZ(-2.4));
  /* layar uji */
  mfd.D=makeDisplay(2.4,1.4,460,270);
  mfd.D.mesh.position.set(.6,2.5,2.4);mfd.D.mesh.rotation.y=Math.PI;scene.add(mfd.D.mesh);
  actMesh(mfd.D.mesh,'UJI');
  scene.add(label('PANEL UJI BLACK-BUILDING',.75,'#5fd4ff').translateX(.6).translateY(3.4).translateZ(2.4));
  mfd.mode=0;
  function layar(){
    dispText(mfd.D,
      mfd.mode===0?['PLN: ON','backup: standby']:
      mfd.mode===1?['PLN: PADAM ⚠','UPS memikul · FC start…']:
      ['FC 200 kW MEMIKUL','UPS recharge · DC aman'],
      [mfd.mode===0?'#46ff8e':(mfd.mode===1?'#ffd23f':'#46ff8e'),'#8aa3bd']);}
  layar();
  startSeq([
   {type:'act',aid:'STORAGE',done:false,targets:()=>[mfd.tank],
    desc:'Rancang STORAGE H₂ untuk halaman urban (klik tangki).',
    why:'Disiplin plant-mu dipindah ke kota: tangki di luar gedung dgn jarak aman terhitung, ventilasi tak terhalang (H₂ lari ke atas — tak ada atap menjebak), deteksi + ESD, pagar & placard. Kapasitas: 8 jam autonomi penuh — dan kontrak refill tube trailer (ilmu logistikmu!) dari plant sendiri. Hidrogen masuk kota dengan sopan santun lengkapnya.',
    fx(){toast('🛢️ Storage urban: jarak ✓ ventilasi ✓ deteksi ✓ · 8 jam autonomi.','ok',3200);}},
   {type:'act',aid:'INTEGRASI',done:false,targets:()=>[mfd.fc],
    desc:'INTEGRASIKAN fuel cell ke arsitektur UPS (klik unit).',
    why:'Pembagian peran yang elegan: saat PLN hilang, UPS baterai memikul DETIK-DETIK pertama (server tak boleh merasakan apa pun), fuel cell bangun ±45 detik lalu mengambil alih JAM-nya — sekaligus me-recharge UPS. Genset butuh peran yang sama; bedanya fuel cell melakukannya tanpa raungan & asap di tengah kota.',
    fx(){toast('🔗 Arsitektur bertingkat: UPS (detik) → FC (jam) tersambung.','ok',3200);}},
   {type:'act',aid:'UJI',done:false,targets:()=>[mfd.D.mesh],
    desc:'Ujian sesungguhnya: BLACK-BUILDING test (klik panel).',
    why:'Breaker PLN dibuka sungguhan — UPS menangkap tanpa satu server berkedip… 42 detik: fuel cell hidup, sunyi seperti lemari es besar, 200 kW mengalir dari hidrogen. Dua jam ditahan di beban penuh: stabil, knalpotnya meneteskan air murni di halaman data center. Backup era baru lulus ujian era lama.',
    fx(){mfd.mode=1;layar();setTimeout(()=>{mfd.mode=2;layar();},1500);
      toast('🔇 PLN padam → 42 dtk → FC memikul 200 kW. Tanpa kedip!','ok',3400);}},
   {type:'act',aid:'SERAH',done:false,targets:()=>[mfd.D.mesh],
    desc:'Serah terima + jadwal drill bulanan (klik panel).',
    why:'Genset diesel resmi pensiun (dijual, tangki solar busuk ikut pergi). Serah terima lengkap: SOP, training operator DC, dan drill bulanan terjadwal — backup yang tak diuji adalah dekorasi. Bonus tak terduga: tim pemasaran DC menjadikan "backup hidrogen hijau" materi jualan ke kliennya. Keandalan bertemu citra — keduanya menang.',
    fx(){toast('📜 Serah terima + drill bulanan — diesel pensiun dgn hormat.','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Backup tanpa asap, tanpa raungan!</b> Storage urban berdisiplin penuh, UPS & fuel cell berbagi peran detik-dan-jam, dan black-building lulus tanpa kedip. Hidrogenmu kini menjaga server kota — pekerjaan paling sunyi dalam portofolionya.');
    setTimeout(()=>showWin('fcdc'),2200);});
  const s2f=seq.steps[2],of2f=s2f.fx;s2f.fx=()=>{of2f();mfd.D.mesh.userData.aid='SERAH';};
  say('VOLTA di sini 🔇 Data center bosan dengan genset: berisik, beremisi, solarnya membusuk. Penggantinya dari plant-mu: <b>fuel cell backup — sunyi, bersih, knalpotnya air</b>. Tapi hidrogen masuk kota harus dengan seluruh sopan santunnya. Mulai dari storage!');
  $('#modTitle').textContent='J14·M8 — Fuel Cell Backup';
  $('#taskHead').textContent='UPS PIKUL DETIK, FC PIKUL JAM';}
MISSIONS.fcdc.build=buildFCDC;
Object.assign(REAL,{
 fcdc:[
  'Kaji izin & jarak aman storage H₂ di kawasan urban dgn pemadam setempat sejak desain',
  'Uji transfer menyeluruh (bukan hanya start FC): UPS handover, recharge, return-to-grid',
  'Kontrak pasokan H₂ dgn SLA — backup tanpa kepastian refill = autonomi palsu',
  'Bandingkan TCO jujur vs genset (capex FC tinggi, opex & emisi rendah) untuk replikasi'],
});
