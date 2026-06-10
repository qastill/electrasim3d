/* =====================================================================
   ElectraSim VR 3D — TRANSMISI
   Misi: M1 transmisi (Switching Bay Penghantar GI 150 kV) · M2 normal (Penormalan Bay GI 150 kV)
   Dimuat on-demand oleh index.html lewat ensureMission().
   ===================================================================== */

Object.assign(MISSIONS,{
 transmisi:{lvl:'JALUR 04 · TRANSMISI',icon:'🗼',title:'Switching Bay Penghantar GI 150 kV',strict:true,
  loc:'📍 GI 150 kV Kosambi · Bay Penghantar arah Sukamandi',
  story:'Hasil inspeksi: isolator string penghantar arah Sukamandi retak dan harus diganti hari ini. Kamu operator GI. Bebaskan bay penghantar dengan urutan switching yang benar — di sini ada dua jenis pemutus dengan kemampuan SANGAT berbeda: PMT dan PMS.',
  goal:'Bay penghantar bebas tegangan: PMT & PMS dioperasikan pada urutan yang benar (PMS tak pernah memutus beban!).',
  obj:['Izin dispatcher (UIT/P2B)','Buka PMT lebih dulu (pemutus berbeban)','Buka PMS line & bus, masuk PMS tanah, rambu'],
  learn:['PMT punya peredam busur api → satu-satunya yang boleh memutus arus beban','PMS hanya pemisah visual — dioperasikan SETELAH PMT membuka (tanpa beban)','Urutan buka: PMT → PMS line → PMS bus; menutup kebalikannya','PMS tanah mengamankan dari tegangan induksi penghantar paralel'],
  next:['Pelajari interlocking PMT–PMS pada sistem kontrol GI','Dalami proteksi penghantar: distance relay zona 1-2-3','Lanjut Jalur 08: budaya K3 pekerjaan listrik']},
 normal:{lvl:'JALUR 04 · TRANSMISI · MISI 2',icon:'🔄',title:'Penormalan Bay GI 150 kV',strict:true,
  loc:'📍 GI 150 kV Kosambi · Bay Sukamandi, pukul 16:30',
  story:'Penggantian isolator selesai. Tim sudah turun dari tower, peralatan sudah dihitung, grounding lokal sudah dilepas. Kini bagian yang sama menegangkannya dengan pembebasan: PENORMALAN — mengembalikan 150.000 volt ke penghantar. Urutannya kebalikan persis dari pembebasan, dan PMT tetap memegang peran pamungkas.',
  goal:'Bay kembali bertegangan dengan selamat: clearance dipastikan, PMS ditutup TANPA beban, dan PMT menutup TERAKHIR.',
  obj:['Pastikan clearance: tim, alat & grounding lokal sudah bebas','Cabut PMS tanah, tutup PMS bus & line (kondisi tanpa beban)','Tutup PMT paling akhir, lapor normal ke dispatcher'],
  learn:['Penormalan = cermin pembebasan: yang dibuka terakhir, ditutup pertama... kecuali satu hal','PMT selalu TERAKHIR menutup — hanya ia yang sanggup memikul lonjakan arus saat kontak bertemu','Menutup PMS lebih dulu aman KARENA PMT masih terbuka (tak ada arus mengalir)','Clearance dari pengawas pekerjaan adalah gerbang mutlak — tak ada penormalan selama satu orang pun masih di area'],
  next:['Pelajari prosedur switching ganda: transfer bus tanpa padam','Dalami sinkronisasi check pada PMT penghantar (synchro-check 25)','Bandingkan filosofi interlock elektrik vs mekanik'],},
});

/* =====================================================================
   MISI 4 — TRANSMISI: SWITCHING GI 150 kV (Jalur 04)
   ===================================================================== */
let mt={};
function buildTransmisi(){
  freshScene(0x7f9cc0,0x0d1726);
  cam={theta:.2,phi:1.15,r:11,target:new THREE.Vector3(0,2.6,-1)};
  const ground=box(26,.1,18,0x4a4f56);ground.position.y=-.05;scene.add(ground);
  const gravel=box(12,.04,8,0x5a6068);gravel.position.set(0,.02,-1);scene.add(gravel);

  /* menara sederhana kiri-kanan */
  [-8,8].forEach(x=>{
    const t1=box(.25,7,.25,0x8d99a6);t1.position.set(x-.6,3.5,-3);scene.add(t1);
    const t2=t1.clone();t2.position.x=x+.6;scene.add(t2);
    const cross=box(2.4,.2,.2,0x8d99a6);cross.position.set(x,6.6,-3);scene.add(cross);});
  /* busbar atas */
  const bus=cyl(.05,.05,16,0xb9c4cf);bus.rotation.z=Math.PI/2;bus.position.set(0,5.6,-3);scene.add(bus);
  scene.add(label('BUSBAR 150 kV',.9).translateY(6.1).translateZ(-3));

  /* panel kontrol (radio/izin) */
  const ctrl=box(.9,1.5,.5,0x2b3a4a);ctrl.position.set(-5.2,.75,1.6);scene.add(ctrl);
  ctrl.add(label('PANEL KONTROL',.7,'#5fd4ff').translateY(1.05));
  actMesh(ctrl,'IZIN');

  /* PMS BUS - frame dengan lengan */
  function pms(x,name,key){
    const base=box(.9,.18,.5,0x6f7a84);base.position.set(x,2.0,-3);scene.add(base);
    const p1=cyl(.06,.08,1.9,0xc9b08a);p1.position.set(x-.3,1.05,-3);scene.add(p1);
    const p2=p1.clone();p2.position.x=x+.3;scene.add(p2);
    const arm=box(.7,.07,.07,0xd8e0e8,{metalness:.6});arm.position.set(x,2.12,-3);scene.add(arm);
    actMesh(arm,key); actMesh(base,key);
    scene.add(label(name,.62,'#5fd4ff').translateX(x).translateY(2.55).translateZ(-3));
    return arm;}
  mt.pmsBus=pms(-2.4,'PMS BUS','PMSB');
  /* PMT - tabung besar */
  const pmtBody=cyl(.4,.45,1.6,0x9aa7b4);pmtBody.position.set(0,1.6,-3);scene.add(pmtBody);
  const bush1=cyl(.09,.12,1.1,0xc9b08a);bush1.position.set(-.22,2.9,-3);scene.add(bush1);
  const bush2=bush1.clone();bush2.position.x=.22;scene.add(bush2);
  actMesh(pmtBody,'PMT');
  mt.pmtInd=new THREE.Mesh(new THREE.SphereGeometry(.07,14,12),
    new THREE.MeshStandardMaterial({color:0xff3b3b,emissive:0xff3b3b,emissiveIntensity:1}));
  mt.pmtInd.position.set(0,1.0,-2.6);scene.add(mt.pmtInd);
  scene.add(label('PMT (CB 150kV)',.72,'#5fd4ff').translateY(3.8).translateZ(-3));
  /* PMS LINE */
  mt.pmsLine=pms(2.4,'PMS LINE','PMSL');
  /* PMS tanah */
  mt.earth=box(.45,.12,.12,0xffd23f);mt.earth.position.set(2.4,.55,-2.5);mt.earth.rotation.z=.5;scene.add(mt.earth);
  actMesh(mt.earth,'EARTH');
  scene.add(label('PMS TANAH',.55,'#5fd4ff').translateX(2.4).translateY(.3).translateZ(-2.4));
  /* rambu */
  mt.sign=box(.7,.45,.04,0xd8d8d8);mt.sign.position.set(4.6,1.1,.4);scene.add(mt.sign);
  const sp=cyl(.03,.03,1.0,0x666666);sp.position.set(4.6,.5,.4);scene.add(sp);
  mt.sign.add(label('RAMBU',.55,'#ff8d8d').translateY(.42));
  actMesh(mt.sign,'RAMBU'); actMesh(sp,'RAMBU');
  /* kawat penghantar ke arah PMS line */
  const span=cyl(.025,.025,7,0x3c4754);span.rotation.z=Math.PI/2;span.position.set(5.5,5.0,-3);scene.add(span);
  scene.add(label('→ ARAH SUKAMANDI',.7).translateX(6.4).translateY(4.5).translateZ(-3));

  startSeq([
   {type:'act',aid:'IZIN',done:false,targets:()=>[ctrl],
    desc:'Minta IZIN SWITCHING ke dispatcher UIT/P2B (klik PANEL KONTROL).',
    why:'Penghantar 150 kV adalah aset sistem interkoneksi. Membukanya mengubah aliran daya se-region — hanya dispatcher yang tahu apakah sistem siap kehilangan satu sirkit.',
    fx(){toast('📻 "GI Kosambi, izin pembebasan bay Sukamandi — DISETUJUI."','ok',2800);}},
   {type:'act',aid:'PMT',done:false,targets:()=>[pmtBody],
    desc:'BUKA PMT terlebih dahulu (klik tabung PMT).',
    why:'PMT (pemutus tenaga) punya media peredam busur api (gas SF6/vakum) — satu-satunya peralatan yang mampu memutus arus beban & hubung singkat dengan selamat.',
    fx(){mt.pmtInd.material.color.setHex(0x36e07a);mt.pmtInd.material.emissive.setHex(0x36e07a);
      toast('🔓 PMT TERBUKA — arus beban terputus aman.','ok',2400);}},
   {type:'act',aid:'PMSL',done:false,targets:()=>[mt.pmsLine],
    desc:'Buka PMS LINE (klik lengan pemisah sisi penghantar).',
    why:'PMS TIDAK punya peredam busur — membukanya saat berbeban menciptakan busur api yang tak padam. PMS hanya boleh dioperasikan SETELAH PMT membuka. Inilah pelajaran terpenting GI.',
    fx(){mt.pmsLine.rotation.y=.9;toast('PMS LINE terbuka (tanpa beban ✓)','ok',2200);}},
   {type:'act',aid:'PMSB',done:false,targets:()=>[mt.pmsBus],
    desc:'Buka PMS BUS (klik lengan pemisah sisi busbar).',
    why:'Dengan PMS bus terbuka, bay terlihat terpisah secara VISUAL dari busbar — fungsi PMS memang pemisah yang bisa dilihat mata, untuk keyakinan pekerja.',
    fx(){mt.pmsBus.rotation.y=.9;toast('PMS BUS terbuka — bay terisolasi visual.','ok',2200);}},
   {type:'act',aid:'EARTH',done:false,targets:()=>[mt.earth],
    desc:'Masukkan PMS TANAH (klik tuas kuning).',
    why:'Penghantar paralel menginduksikan tegangan ke sirkit yang dikerjakan — bisa puluhan kV walau "mati". PMS tanah mengalirkan induksi itu ke bumi, bukan ke tubuh pekerja.',
    fx(){mt.earth.rotation.z=0;mt.earth.position.y=.65;toast('⏚ PMS TANAH MASUK.','ok',2200);}},
   {type:'act',aid:'RAMBU',done:false,targets:()=>[mt.sign],
    desc:'Pasang rambu & lockout pada bay (klik RAMBU).',
    why:'Switching belum sah tanpa pengaman administratif: tagging di lapangan + update ke dispatcher, agar tak seorang pun menormalkan bay selagi tim di atas tower.',
    fx(){mt.sign.material.color.setHex(0xffd23f);
      mt.sign.add(label('BAY DIKERJAKAN!',.55,'#b02020').translateZ(.06));
      toast('🚧 Bay aman — tim pemeliharaan dipersilakan naik.','ok',2600);}},
  ],()=>{say('🎉 <b>Switching sempurna!</b> Kamu baru menjalankan urutan paling sakral di GI: PMT dulu, baru PMS. Tak pernah terbalik, selamanya.');
    setTimeout(()=>showWin('transmisi'),2000);});

  say('VOLTA di sini ⚡ Selamat datang di switchyard 150 kV. Hari ini satu pelajaran yang menyelamatkan nyawa operator GI turun-temurun: <b>PMT mampu memutus beban, PMS tidak</b>. Urutan adalah segalanya. Ikuti penanda ▼.');
  $('#modTitle').textContent='J04 — Switching Bay GI 150 kV';
  $('#taskHead').textContent='SOP SWITCHING BAY';}

/* =====================================================================
   MISI 19 — PENORMALAN GI (Jalur 04 · Misi 2) — bertekstur
   ===================================================================== */
let mno={};
function buildNormal(){
  freshScene(0xf0b878,0x1a1410); /* langit senja */
  cam={theta:.2,phi:1.15,r:11,target:new THREE.Vector3(0,2.6,-1)};
  const ground=boxT(26,.1,18,TEX.gravel());ground.position.y=-.05;scene.add(ground);
  const pad=boxT(12,.06,8,TEX.concrete());pad.position.set(0,.03,-1);scene.add(pad);

  [-8,8].forEach(x=>{
    const t1=boxT(.25,7,.25,TEX.metal(),{metalness:.5});t1.position.set(x-.6,3.5,-3);scene.add(t1);
    const t2=t1.clone();t2.position.x=x+.6;scene.add(t2);
    const cross=boxT(2.4,.2,.2,TEX.metal(),{metalness:.5});cross.position.set(x,6.6,-3);scene.add(cross);});
  const bus=cyl(.05,.05,16,0xd8c8a8,18,{metalness:.6,roughness:.3});
  bus.rotation.z=Math.PI/2;bus.position.set(0,5.6,-3);scene.add(bus);
  scene.add(label('BUSBAR 150 kV',.9).translateY(6.1).translateZ(-3));

  /* area kerja + tag clearance */
  mno.area=boxT(2.2,.04,2.2,TEX.hazard());mno.area.position.set(2.4,.07,-1.0);scene.add(mno.area);
  mno.tag=box(.5,.35,.04,0xffd23f);mno.tag.position.set(2.4,1.0,-.4);scene.add(mno.tag);
  const tp=cyl(.025,.025,.9,0x666666);tp.position.set(2.4,.45,-.4);scene.add(tp);
  mno.tag.add(label('TAG PEKERJAAN',.5,'#b02020').translateY(.36));
  actMesh(mno.tag,'CLEAR'); actMesh(mno.area,'CLEAR');
  /* panel kontrol */
  const ctrl=boxT(.9,1.5,.5,TEX.metal(),{metalness:.4});ctrl.position.set(-5.2,.75,1.6);scene.add(ctrl);
  ctrl.add(label('PANEL KONTROL',.7,'#5fd4ff').translateY(1.05));
  actMesh(ctrl,'IZIN');
  /* PMS + PMT (mulai pada posisi TERBUKA, earth MASUK) */
  function pms2(x,name,key,open){
    const base=boxT(.9,.18,.5,TEX.metal(),{metalness:.4});base.position.set(x,2.0,-3);scene.add(base);
    const p1=cyl(.06,.08,1.9,0xc9b08a);p1.position.set(x-.3,1.05,-3);scene.add(p1);
    const p2=p1.clone();p2.position.x=x+.3;scene.add(p2);
    const arm=box(.7,.07,.07,0xd8e0e8,{metalness:.6});arm.position.set(x,2.12,-3);
    if(open)arm.rotation.y=.9;scene.add(arm);
    actMesh(arm,key);actMesh(base,key);
    scene.add(label(name,.62,'#5fd4ff').translateX(x).translateY(2.55).translateZ(-3));
    return arm;}
  mno.pmsBus=pms2(-2.4,'PMS BUS','PMSB',true);
  const pmtBody=cyl(.4,.45,1.6,0x9aa7b4,20,{metalness:.3});pmtBody.position.set(0,1.6,-3);scene.add(pmtBody);
  const bu1=cyl(.09,.12,1.1,0xc9b08a);bu1.position.set(-.22,2.9,-3);scene.add(bu1);
  const bu2=bu1.clone();bu2.position.x=.22;scene.add(bu2);
  actMesh(pmtBody,'PMT');
  mno.pmtInd=new THREE.Mesh(new THREE.SphereGeometry(.07,14,12),
    new THREE.MeshStandardMaterial({color:0x36e07a,emissive:0x36e07a,emissiveIntensity:1}));
  mno.pmtInd.position.set(0,1.0,-2.6);scene.add(mno.pmtInd);
  scene.add(label('PMT (CB 150kV)',.72,'#5fd4ff').translateY(3.8).translateZ(-3));
  mno.pmsLine=pms2(2.4,'PMS LINE','PMSL',true);
  mno.earth=box(.45,.12,.12,0xffd23f);mno.earth.position.set(2.4,.65,-2.5);scene.add(mno.earth);
  actMesh(mno.earth,'EARTH');
  scene.add(label('PMS TANAH (MASUK)',.55,'#5fd4ff').translateX(2.4).translateY(.32).translateZ(-2.4));
  const span=cyl(.025,.025,7,0x3c4754);span.rotation.z=Math.PI/2;span.position.set(5.5,5.0,-3);scene.add(span);
  scene.add(label('→ ARAH SUKAMANDI',.7).translateX(6.4).translateY(4.5).translateZ(-3));

  startSeq([
   {type:'act',aid:'CLEAR',done:false,targets:()=>[mno.tag],
    desc:'Pastikan CLEARANCE: tim turun, alat lengkap, grounding lokal dilepas — cabut TAG (klik tag).',
    why:'Inilah gerbang mutlak penormalan: pengawas pekerjaan menyatakan area BEBAS — orang & alat dihitung satu per satu. Memberi tegangan saat satu orang masih di tower = tak terampunkan.',
    fx(){mno.tag.material.color.setHex(0x8a9aa8);
      toast('✅ Clearance diterima: "Pekerjaan selesai, semua personel & grounding bebas."','ok',3000);}},
   {type:'act',aid:'IZIN',done:false,targets:()=>[ctrl],
    desc:'Minta IZIN PENORMALAN ke dispatcher (klik panel kontrol).',
    why:'Dispatcher menyiapkan sistem menerima kembali sirkit: cek aliran daya, proteksi, dan kesiapan GI lawan. Penormalan tanpa koordinasi bisa mengejutkan sistem yang sudah setimbang.',
    fx(){toast('📻 "Izin penormalan bay Sukamandi — DISETUJUI dispatcher."','ok',2800);}},
   {type:'act',aid:'EARTH',done:false,targets:()=>[mno.earth],
    desc:'CABUT PMS TANAH terlebih dahulu (klik tuas kuning).',
    why:'Yang terakhir dipasang, pertama dilepas. Menutup PMS/PMT dengan pentanahan masih masuk = hubung singkat tiga fasa ke tanah yang disengaja — ledakan, bukan penormalan.',
    fx(){mno.earth.rotation.z=.5;mno.earth.position.y=.5;
      toast('⏚ PMS tanah DICABUT — sirkit siap menerima tegangan.','ok',2400);}},
   {type:'act',aid:'PMSB',done:false,targets:()=>[mno.pmsBus],
    desc:'TUTUP PMS BUS (klik lengan pemisah sisi busbar).',
    why:'Aman menutup PMS sekarang KARENA PMT masih terbuka — tak ada arus yang akan mengalir melalui kontak PMS saat bertemu. Logika yang sama dengan pembebasan, dibalik.',
    fx(){mno.pmsBus.rotation.y=0;toast('PMS BUS tertutup (tanpa beban ✓)','ok',2200);}},
   {type:'act',aid:'PMSL',done:false,targets:()=>[mno.pmsLine],
    desc:'TUTUP PMS LINE (klik lengan pemisah sisi penghantar).',
    why:'Jalur kini tersambung penuh secara mekanis dari busbar ke penghantar — tapi belum setetes pun arus mengalir. Semua menunggu satu perangkat yang memang dirancang untuk momen ini.',
    fx(){mno.pmsLine.rotation.y=0;toast('PMS LINE tertutup — jalur lengkap, menunggu PMT.','ok',2200);}},
   {type:'act',aid:'PMT',done:false,targets:()=>[pmtBody],
    desc:'PAMUNGKAS: tutup PMT — 150 kV kembali mengalir!',
    why:'PMT menutup TERAKHIR karena saat kontaknya bertemu, arus charging & beban menerjang seketika — hanya ruang pemadam busur PMT yang dirancang menelan momen itu. PMS akan meleleh.',
    fx(){mno.pmtInd.material.color.setHex(0xff3b3b);mno.pmtInd.material.emissive.setHex(0xff3b3b);
      spark(new THREE.Vector3(0,2.9,-3),0x9fd8ff);
      toast('⚡ PMT TERTUTUP — penghantar Sukamandi BERTEGANGAN!','ok',2800);sfx.big();}},
   {type:'act',aid:'IZIN2',done:false,targets:()=>[ctrl],
    desc:'Lapor NORMAL ke dispatcher (klik panel kontrol).',
    why:'Lingkaran ditutup di tempat ia dibuka: dispatcher mencatat sirkit kembali beroperasi, beban dialirkan, dan log switching hari ini lengkap dari pembebasan sampai penormalan.',
    fx(){toast('📻 "Bay Sukamandi NORMAL, beban mengalir 86 MW." — Log ditutup.','ok',3000);}},
  ],()=>{say('🎉 <b>Siklus lengkap!</b> Pagi membebaskan, senja menormalkan. Kamu kini menguasai DUA arah switching — dan satu prinsip abadi: <b>PMT pertama membuka, terakhir menutup</b>.');
    setTimeout(()=>showWin('normal'),2200);});
  /* dua aksi pada panel kontrol: ganti aid setelah dipakai */
  const s2=seq.steps[1],of=s2.fx;s2.fx=()=>{of();ctrl.userData.aid='IZIN2';};

  say('VOLTA di sini 🔄 Senja di switchyard — pekerjaan selesai, saatnya <b>PENORMALAN</b>. Hafalkan cerminnya: yang terakhir dibuka, pertama ditutup... dengan satu pengecualian sakral: <b>PMT selalu menutup paling akhir</b>.');
  $('#modTitle').textContent='J04·M2 — Penormalan Bay GI 150 kV';
  $('#taskHead').textContent='CERMIN PEMBEBASAN';}

MISSIONS.transmisi.build=buildTransmisi;
MISSIONS.normal.build=buildNormal;

Object.assign(REAL,{
 transmisi:[
  'Switching GI nyata dipandu SCADA + verifikasi visual lokal; interlocking PMT–PMS membantu, tapi jangan diandalkan buta',
  'Komunikasi tiga pihak terekam: dispatcher — operator GI — pengawas pekerjaan',
  'Tim pemeliharaan memasang grounding lokal tambahan tepat di titik kerja (di tower/konduktor)',
  'Pelajari single line diagram bay sebelum eksekusi — konfigurasi tiap GI berbeda (1,5 breaker, double busbar, dll.)'],
 normal:[
  'Clearance tertulis dari pengawas pekerjaan (bukan lisan) sebelum langkah penormalan apa pun',
  'Hitung kembali personel & grounding lokal dengan checklist — yang terpasang harus sama dengan yang dilepas',
  'Sebelum menutup PMT penghantar antar-GI: pastikan kondisi sinkron atau sirkit mati di sisi lawan (synchro-check)',
  'Catat waktu setiap langkah di log switching — jejak audit operasi GI'],
});

/* =====================================================================
   MISI 3 — TRANSFER BUS TANPA PADAM
   ===================================================================== */
Object.assign(MISSIONS,{
 busbar:{lvl:'JALUR 04 · TRANSMISI · MISI 3',icon:'🔀',title:'Transfer Bus Tanpa Padam (Double Busbar)',strict:true,
  loc:'📍 GI 150 kV Kosambi · Pemeliharaan Bus A terjadwal',
  story:'Bus A akan dipelihara minggu depan — semua bay yang menggantung di Bus A harus pindah ke Bus B HARI INI, tanpa satu pelanggan pun berkedip. Inilah manuver paling elegan di GI: transfer bus. Rahasianya satu prinsip yang terdengar terbalik: sambungkan dulu, baru lepaskan (make before break).',
  goal:'Bay penghantar Sukamandi berpindah dari Bus A ke Bus B tanpa pemadaman: kopel menjembatani, PMS berpindah tanpa memutus arus.',
  obj:['Izin manuver & tutup bus coupler (paralel Bus A-B)','Tutup PMS Bus B DULU, baru buka PMS Bus A (make before break)','Buka kembali kopel & laporkan transfer selesai'],
  learn:['Make before break: jalur baru disambung dulu, jalur lama dilepas kemudian — beban tak pernah kehilangan pijakan','Bus coupler menyamakan tegangan & sudut kedua bus; selama kopel tertutup, PMS boleh pindah karena tak memutus arus (arus lewat kopel)','Membuka PMS Bus A saat kopel TERBUKA = memutus arus beban dengan pisau tanpa peredam — busur api fatal','Interlock elektrik mencegah urutan salah, tapi operator tetap wajib paham LOGIKAnya — interlock bisa rusak'],
  next:['Pelajari konfigurasi busbar: single, double, satu-setengah breaker','Dalami proteksi busbar (busbar differential) & zona-nya','Simulasikan transfer seluruh bay (4 bay berurutan) untuk pemeliharaan total'],},
});
let mbb={};
function buildBusbar(){
  freshScene(0x7f9cc0,0x0d1726);
  cam={theta:.1,phi:1.12,r:12,target:new THREE.Vector3(0,3,-1)};
  const ground=boxT(26,.1,18,TEX.gravel());ground.position.y=-.05;scene.add(ground);
  const pad=boxT(14,.06,9,TEX.concrete());pad.position.set(0,.03,-1);scene.add(pad);
  /* dua busbar sejajar */
  const busA=cyl(.05,.05,18,0xd8c8a8,18,{metalness:.6,roughness:.3});
  busA.rotation.z=Math.PI/2;busA.position.set(0,6.2,-4);scene.add(busA);
  scene.add(label('BUS A (akan dipelihara)',.8,'#ffd23f').translateY(6.7).translateZ(-4));
  const busB=cyl(.05,.05,18,0xb9d8c8,18,{metalness:.6,roughness:.3});
  busB.rotation.z=Math.PI/2;busB.position.set(0,5.0,-2.2);scene.add(busB);
  scene.add(label('BUS B',.8,'#8df0b8').translateY(5.5).translateZ(-2.2));
  /* panel kontrol */
  const ctrl=boxT(.9,1.5,.5,TEX.metal(),{metalness:.4});ctrl.position.set(-6.2,.75,2.0);scene.add(ctrl);
  ctrl.add(label('PANEL KONTROL',.7,'#5fd4ff').translateY(1.05));
  actMesh(ctrl,'IZIN');
  /* bus coupler di tengah */
  mbb.kopel=cyl(.35,.4,1.4,0x9aa7b4,20,{metalness:.3});mbb.kopel.position.set(-4,1.5,-3.1);scene.add(mbb.kopel);
  actMesh(mbb.kopel,'KOPEL');
  mbb.kInd=new THREE.Mesh(new THREE.SphereGeometry(.07,12,10),
    new THREE.MeshStandardMaterial({color:0x36e07a,emissive:0x36e07a,emissiveIntensity:1}));
  mbb.kInd.position.set(-4,.9,-2.7);scene.add(mbb.kInd);
  scene.add(label('BUS COUPLER (PMT)',.65,'#5fd4ff').translateX(-4).translateY(2.6).translateZ(-3.1));
  /* bay Sukamandi: PMS A & PMS B */
  function pms3(x,z,name,key,closed){
    const base=boxT(.8,.16,.45,TEX.metal(),{metalness:.4});base.position.set(x,2.0,z);scene.add(base);
    const p1=cyl(.05,.07,1.9,0xc9b08a);p1.position.set(x-.25,1.05,z);scene.add(p1);
    const p2=p1.clone();p2.position.x=x+.25;scene.add(p2);
    const arm=box(.6,.07,.07,0xd8e0e8,{metalness:.6});arm.position.set(x,2.1,z);
    if(!closed)arm.rotation.y=.9;scene.add(arm);
    actMesh(arm,key);actMesh(base,key);
    scene.add(label(name,.55,'#5fd4ff').translateX(x).translateY(2.5).translateZ(z));
    return arm;}
  mbb.pmsA=pms3(2.5,-4,'PMS BUS A (MASUK)','PMSA',true);
  mbb.pmsB=pms3(2.5,-2.2,'PMS BUS B','PMSB',false);
  /* PMT bay + penghantar */
  const pmt=cyl(.35,.4,1.5,0x9aa7b4,20,{metalness:.3});pmt.position.set(4.5,1.55,-3.1);scene.add(pmt);
  scene.add(label('PMT BAY (TETAP TUTUP)',.6).translateX(4.5).translateY(2.7).translateZ(-3.1));
  const span=cyl(.025,.025,6,0x3c4754);span.rotation.z=Math.PI/2;span.position.set(8,5.4,-3.1);scene.add(span);
  scene.add(label('→ SUKAMANDI · 86 MW MENGALIR',.7).translateX(7.5).translateY(6.0).translateZ(-3.1));
  startSeq([
   {type:'act',aid:'IZIN',done:false,targets:()=>[ctrl],
    desc:'Minta IZIN transfer bus ke dispatcher (klik panel kontrol).',
    why:'Transfer bus mengubah topologi GI — proteksi busbar perlu tahu konfigurasi barunya. Dispatcher juga memastikan tak ada manuver lain yang sedang berjalan di GI lawan.',
    fx(){toast('📻 "Izin transfer bay Sukamandi A→B — DISETUJUI, proteksi disiagakan."','ok',2800);}},
   {type:'act',aid:'KOPEL',done:false,targets:()=>[mbb.kopel],
    desc:'Tutup BUS COUPLER — paralelkan Bus A & Bus B.',
    why:'Kopel adalah jembatan: begitu tertutup, kedua bus menjadi SATU titik listrik dengan tegangan & sudut identik. Di atas jembatan inilah beban akan menyeberang tanpa terjun.',
    fx(){toast('🌉 Kopel TERTUTUP — Bus A & B paralel, jembatan siap.','ok',2600);}},
   {type:'act',aid:'PMSB',done:false,targets:()=>[mbb.pmsB],
    desc:'MAKE dulu: tutup PMS BUS B bay Sukamandi.',
    why:'Inilah jiwa make-before-break: jalur baru disambung SAAT jalur lama masih ada. Aman bagi PMS karena kedua bus setegangan via kopel — kontak bertemu tanpa beda potensial, tanpa busur.',
    fx(){mbb.pmsB.rotation.y=0;
      toast('🔗 PMS Bus B MASUK — bay kini berpegangan dua tangan.','ok',2600);}},
   {type:'act',aid:'PMSA',done:false,targets:()=>[mbb.pmsA],
    desc:'BREAK kemudian: buka PMS BUS A.',
    why:'Arus tidak terputus — ia berpindah lewat kopel ke Bus B persis saat kontak PMS A merenggang. Pisau membuka tanpa memutus apa pun: 86 MW mengalir terus, pelanggan tak merasakan apa-apa.',
    fx(){mbb.pmsA.rotation.y=.9;
      toast('✂️ PMS Bus A LEPAS — beban mulus sepenuhnya di Bus B.','ok',2600);}},
   {type:'act',aid:'KOPEL2',done:false,targets:()=>[mbb.kopel],
    desc:'Tugas jembatan selesai: buka kembali BUS COUPLER.',
    why:'Bay sudah utuh di Bus B; kopel dibuka agar Bus A benar-benar terpisah & siap dibebaskan untuk pemeliharaan. PMT kopel mampu memutus arus penyeimbang — itulah kenapa kopel memakai PMT, bukan PMS.',
    fx(){mbb.kInd.material.color.setHex(0xff3b3b);mbb.kInd.material.emissive.setHex(0xff3b3b);
      toast('🌉 Kopel DIBUKA — Bus A kini sendirian, siap dipelihara.','ok',2600);}},
   {type:'act',aid:'IZIN2',done:false,targets:()=>[ctrl],
    desc:'Lapor TRANSFER SELESAI ke dispatcher.',
    why:'"Bay Sukamandi di Bus B, beban 86 MW normal, Bus A bebas beban." Log switching mencatat manuver tanpa padam — KPI keandalan (SAIDI) hari ini tak bertambah sedetik pun.',
    fx(){toast('📻 Transfer TUNTAS — nol detik padam, dispatcher mencatat.','ok',3000);sfx.big();}},
  ],()=>{say('🎉 <b>Manuver paling elegan di GI — sempurna!</b> 86 MW pindah rumah tanpa berkedip. Make before break: tiga kata yang membedakan operator dari pemain tebak-tebakan.');
    setTimeout(()=>showWin('busbar'),2200);});
  const s0=seq.steps[0],of0=s0.fx;s0.fx=()=>{of0();ctrl.userData.aid='IZIN2';};
  const s1b=seq.steps[1],of1b=s1b.fx;s1b.fx=()=>{of1b();mbb.kopel.userData.aid='KOPEL2';};
  say('VOLTA di sini 🔀 Hari ini kita melakukan sulap kelas GI: <b>memindah beban hidup antar busbar tanpa padam</b>. Mantranya: make before break — sambung dulu, lepas kemudian. Mulai dari izin dispatcher.');
  $('#modTitle').textContent='J04·M3 — Transfer Bus Tanpa Padam';
  $('#taskHead').textContent='MAKE BEFORE BREAK';}
MISSIONS.busbar.build=buildBusbar;
Object.assign(REAL,{
 busbar:[
  'Sebelum transfer: pastikan setting proteksi busbar mengikuti perubahan topologi (zona A/B)',
  'Verifikasi posisi setiap PMS secara VISUAL di lapangan, jangan hanya percaya indikasi remote',
  'Transfer banyak bay dilakukan satu per satu dengan log per langkah — tidak pernah borongan',
  'Pahami batas arus kopel: total beban yang dipindah tak boleh melampaui rating bus coupler'],
});

/* =====================================================================
   MISI 4 — PROTEKSI DISTANCE RELAY
   ===================================================================== */
Object.assign(MISSIONS,{
 distance:{lvl:'JALUR 04 · TRANSMISI · MISI 4',icon:'🛡️',title:'Proteksi Distance Relay: Analisis Trip',strict:false,
  loc:'📍 GI 150 kV Kosambi · Pagi setelah badai petir',
  story:'Semalam penghantar Sukamandi trip lalu reclose sukses — sistem hanya berkedip. Pagi ini tugasmu khas engineer proteksi: MEMBACA ulang kejadian itu dari rekaman relay. Distance relay menyimpan cerita lengkap: di kilometer berapa petir menyambar, zona mana yang bekerja, dan berapa milidetik keputusan diambil.',
  goal:'Rekaman gangguan terbaca tuntas: lokasi gangguan dihitung dari impedansi, kerja zona diverifikasi benar, dan laporan analisis terbit.',
  obj:['Baca rekaman DFR & besaran gangguan','Pahami zona proteksi & verifikasi kerja relay','Hitung lokasi gangguan & terbitkan laporan'],
  learn:['Distance relay mengukur IMPEDANSI (V/I) ke titik gangguan — impedansi sebanding jarak, itulah nama "distance"','Zona 1: ±80% panjang saluran, trip SEKETIKA; Zona 2: sampai ~120%, tunda 0,4s — perlambatan yang disengaja demi selektivitas','Gangguan petir bersifat sementara: reclose sukses = isolator sehat kembali setelah busur padam','Fault locator: persen impedansi × panjang saluran = kilometer tiang — regu patroli berangkat ke titik, bukan menyusuri 40 km'],
  next:['Pelajari karakteristik mho/quadrilateral pada bidang R-X','Dalami teleproteksi (PUTT/POTT) yang mempercepat zona 2','Analisis DFR multi-terminal untuk gangguan kompleks']},
});
let mdz={};
function buildDistance(){
  freshScene(0x7f9cc0,0x0d1726);
  cam={theta:0,phi:1.18,r:8,target:new THREE.Vector3(0,1.9,-1)};
  const floor=boxT(16,.1,10,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(14,4.4,.2,TEX.metal(),{metalness:.25});wall.position.set(0,2.2,-3.2);scene.add(wall);
  /* panel relay */
  const panel=boxT(2.2,2.6,.3,TEX.metal(),{metalness:.4});panel.position.set(-4.2,1.6,-2.9);scene.add(panel);
  panel.add(label('RELAY DISTANCE 21',.75).translateY(1.6));
  mdz.R=makeDisplay(1.6,1.0,360,220);
  mdz.R.mesh.position.set(-4.2,1.9,-2.73);scene.add(mdz.R.mesh);
  dispText(mdz.R,['TRIP 02:14:31','Z1 · reclose OK'],['#ff5a5a','#46ff8e']);
  actMesh(mdz.R.mesh,'RELAY');
  /* layar DFR besar */
  const frame=boxT(4.6,2.4,.16,TEX.metal(),{metalness:.4});frame.position.set(.6,2.3,-3.1);scene.add(frame);
  frame.add(label('DFR — REKAMAN GANGGUAN',.85).translateY(1.5));
  mdz.D=makeDisplay(4.3,2.1,620,320);
  mdz.D.mesh.position.set(.6,2.3,-3.0);scene.add(mdz.D.mesh);
  actMesh(mdz.D.mesh,'DFR');
  function dfr(mode){
    const g=mdz.D.g,W=620,H=320;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    /* gelombang arus */
    g.strokeStyle='#5fd4ff';g.lineWidth=2.5;g.beginPath();
    for(let x=0;x<W;x++){
      let a=28;
      if(x>220&&x<320)a=95; /* gangguan */
      if(x>=320)a=4;        /* CB buka */
      if(x>430)a=30;        /* reclose */
      g.lineTo(x,160-Math.sin(x*.22)*a);}
    g.stroke();
    g.font='600 15px Consolas';g.textAlign='center';
    g.fillStyle='#ffd23f';g.fillText('▲ gangguan',270,40);
    g.fillStyle='#ff5a5a';g.fillText('▲ trip 82ms',330,62);
    g.fillStyle='#46ff8e';g.fillText('▲ reclose OK',470,40);
    if(mode>=1){g.fillStyle='#eaf2fb';g.font='700 17px Consolas';g.textAlign='left';
      g.fillText('If = 4,8 kA · V = 61% · Z = 3,1 Ω∠78°',24,290);}
    if(mode>=2){g.fillStyle='#46ff8e';
      g.fillText('Z1 (80% = 4,4Ω): 3,1Ω DI DALAM → trip seketika ✓',24,265);}
    mdz.D.tex.needsUpdate=true;}
  dfr(0);
  /* peta saluran + kalkulator + laporan */
  mdz.M=makeDisplay(2.4,1.0,480,200);
  mdz.M.mesh.position.set(4.6,2.2,-3.05);scene.add(mdz.M.mesh);
  dispText(mdz.M,['SALURAN 40 km','Kosambi ─── Sukamandi'],['#5fd4ff','#8aa3bd']);
  actMesh(mdz.M.mesh,'LOKASI');
  scene.add(label('FAULT LOCATOR',.6,'#5fd4ff').translateX(4.6).translateY(2.95).translateZ(-3.0));
  mdz.rep=box(.55,.7,.05,0xe8e4d8);mdz.rep.position.set(4.6,.9,-3.05);scene.add(mdz.rep);
  actMesh(mdz.rep,'LAPOR');
  scene.add(label('LAPORAN ANALISIS',.55,'#5fd4ff').translateX(4.6).translateY(1.45).translateZ(-3.0));
  startSeq([
   {type:'act',aid:'RELAY',done:false,targets:()=>[mdz.R.mesh],
    desc:'Baca catatan RELAY: apa yang ia putuskan semalam? (klik relay)',
    why:'02:14:31 — trip Zona 1, fasa R-tanah, reclose sukses 0,8 detik kemudian. Relay sudah bekerja; tugas engineer adalah memastikan ia bekerja BENAR. Kepercayaan pada proteksi dibangun dari audit seperti ini.',
    fx(){toast('📟 Trip Z1 · R-N · reclose sukses — mari bedah rekamannya.','info',2800);}},
   {type:'act',aid:'DFR',done:false,targets:()=>[mdz.D.mesh],
    desc:'Buka rekaman DFR: baca besaran gangguannya (klik layar).',
    why:'Gelombang bercerita: arus melonjak 4,8 kA, tegangan terjun ke 61%, lalu senyap 82 ms kemudian — kecepatan yang mustahil bagi manusia, refleks biasa bagi relay. Impedansi terukur: 3,1 Ω∠78°.',
    fx(){dfr(1);toast('📈 If 4,8kA · Z terukur 3,1Ω∠78° — khas sambaran petir.','ok',3000);}},
   {type:'act',aid:'ZONA',done:false,targets:()=>[mdz.D.mesh],
    desc:'Verifikasi kerja ZONA: benarkah Z1 yang seharusnya bekerja?',
    why:'Setting Z1 = 80% × 5,5 Ω saluran = 4,4 Ω. Terukur 3,1 Ω — jelas di dalam Z1 → trip seketika adalah keputusan BENAR. Andai 5,0 Ω (ujung saluran), Z2-lah yang wajib bekerja dengan tundaan — memberi kesempatan relay seberang bertindak dulu.',
    fx(){dfr(2);toast('🛡️ 3,1Ω < 4,4Ω (Z1) — relay bekerja TEPAT sesuai filosofi.','ok',3000);}},
   {type:'act',aid:'LOKASI',done:false,targets:()=>[mdz.M.mesh],
    desc:'Hitung LOKASI gangguan untuk regu patroli (klik fault locator).',
    why:'3,1 ÷ 5,5 = 56% × 40 km = kilometer 22,5 — sekitar tower 57-58. Regu inspeksi tak perlu menyusuri 40 km: langsung ke dua tower itu, cari jejak flashover di isolator. Matematika menghemat satu hari kerja.',
    fx(){dispText(mdz.M,['LOKASI: KM 22,5','tower 57-58 → patroli'],['#46ff8e','#eaf2fb']);
      toast('📍 KM 22,5 (tower 57-58) — regu berangkat terarah.','ok',3000);}},
   {type:'act',aid:'LAPOR',done:false,targets:()=>[mdz.rep],
    desc:'Terbitkan LAPORAN analisis gangguan (klik laporan).',
    why:'Kronologi, besaran, kerja proteksi, lokasi, rekomendasi (cek isolator tower 57-58 + data petir BMKG). Satu gangguan yang dianalisis tuntas mencegah sepuluh berikutnya — itulah nilai engineer proteksi.',
    fx(){toast('📋 Laporan terbit — proteksi terverifikasi, patroli terarah.','ok',3000);sfx.big();}},
  ],()=>{say('🎉 <b>Analisis kelas engineer proteksi!</b> Relay membaca impedansi, kamu membaca relay. Zona benar, lokasi ketemu, laporan terbit — sistem makin bisa dipercaya.');
    setTimeout(()=>showWin('distance'),2200);});
  /* layar DFR dipakai 2x */
  const s1=seq.steps[1],of1=s1.fx;s1.fx=()=>{of1();mdz.D.mesh.userData.aid='ZONA';};
  say('VOLTA di sini 🛡️ Semalam relay memutus dalam <b>82 milidetik</b> — pagi ini kita periksa pekerjaannya. Distance relay mengukur jarak lewat impedansi; ikuti rekamannya dan temukan di tower mana petir menyambar.');
  $('#modTitle').textContent='J04·M4 — Proteksi Distance Relay';
  $('#taskHead').textContent='BACA · VERIFIKASI · TEMUKAN';}
MISSIONS.distance.build=buildDistance;
Object.assign(REAL,{
 distance:[
  'Analisis gangguan memakai rekaman DUA ujung saluran — single-end locator punya error ±2-5%',
  'Verifikasi setting relay berkala terhadap data impedansi saluran terbaru (rekonduktor mengubah Z)',
  'Cocokkan waktu kejadian dengan data lightning detector untuk konfirmasi penyebab',
  'Temuan patroli (jejak flashover) ditutup dalam laporan yang sama — loop analisis-lapangan harus menutup'],
});

/* =====================================================================
   MISI 5 — INSPEKSI JALUR & THERMOVISION
   ===================================================================== */
Object.assign(MISSIONS,{
 thermo:{lvl:'JALUR 04 · TRANSMISI · MISI 5',icon:'🎥',title:'Inspeksi Jalur & Thermovision',strict:false,
  loc:'📍 SUTT 150 kV Kosambi–Sukamandi · Patroli terjadwal',
  story:'Penghantar yang kamu rawat lewat switching kini minta dirawat lewat MATA: patroli jalur terjadwal. Bersenjata teropong, kamera thermovision, dan form inspeksi, kamu menyusuri tower demi tower. Sambungan yang memburuk tak terlihat mata biasa — tapi ia DEMAM, dan demam tak bisa bersembunyi dari kamera infra merah.',
  goal:'Patroli tuntas dengan tiga temuan terdokumentasi: klem panas terukur thermovision, isolator retak, dan pohon mendekati ROW — semua masuk prioritas perbaikan.',
  obj:['Periksa kondisi tower & kelengkapannya','Scan thermovision sambungan & klem berbeban','Periksa isolator, ROW, dan susun laporan prioritas'],
  learn:['Sambungan memburuk = resistansi naik = panas (I²R): thermovision melihat selisih suhu klem vs konduktor — delta-T adalah bahasa diagnosisnya','Delta-T punya kasta: <10°C pantau, 10-35°C rencanakan, >35°C segera — diukur saat beban tinggi agar jujur','Isolator retak/terpolusi terlihat dari pola: flashover mark, korona terdengar mendesis di kelembapan tinggi','ROW (right of way) adalah jarak hidup: pohon tumbuh diam-diam menuju konduktor — patroli adalah alarm tumbuhnya'],
  next:['Pelajari inspeksi drone + AI untuk jalur ratusan kilometer','Dalami corona camera (UV) — kakak ipar thermovision','Susun prioritas anggaran pemeliharaan dari data patroli']},
});
let mpv={};
function buildThermo(){
  freshScene(0x9fc0dc,0x12202e);
  cam={theta:.2,phi:1.08,r:12,target:new THREE.Vector3(0,4,-1)};
  const ground=boxT(26,.1,16,TEX.gravel());ground.position.y=-.05;scene.add(ground);
  /* tower */
  [[-1.1,-1.1],[1.1,-1.1],[-1.1,1.1],[1.1,1.1]].forEach(o=>{
    const kaki=boxT(.16,8.5,.16,TEX.metal(),{metalness:.5});
    kaki.position.set(o[0],4.25,-2+o[1]);kaki.rotation.z=o[0]*-.035;scene.add(kaki);});
  [2.5,4.5,6.5,8].forEach(y=>{
    const pl=boxT(2.4,.1,.1,TEX.metal(),{metalness:.5});pl.position.set(0,y,-1);scene.add(pl);
    const pl2=pl.clone();pl2.position.z=-3;scene.add(pl2);});
  const cross=boxT(5,.18,.18,TEX.metal(),{metalness:.5});cross.position.set(0,7.6,-2);scene.add(cross);
  actMesh(cross,'TOWER');
  scene.add(label('TOWER 57',.8).translateY(8.9).translateZ(-2));
  /* konduktor + klem panas */
  const kw1=cyl(.02,.02,22,0x3c4754);kw1.rotation.z=Math.PI/2;kw1.position.set(0,7.2,-2);scene.add(kw1);
  mpv.klem=box(.16,.12,.12,0x8a939e,{metalness:.5});mpv.klem.position.set(2.3,7.2,-2);scene.add(mpv.klem);
  actMesh(mpv.klem,'SCAN');
  /* isolator string */
  mpv.iso=new THREE.Group();
  for(let i=0;i<5;i++){const disc=cyl(.16,.16,.05,0x9aa7b4,16);disc.position.y=-i*.14;mpv.iso.add(disc);}
  mpv.iso.position.set(-2.3,7.5,-2);scene.add(mpv.iso);
  actMesh(mpv.iso.children[2],'ISO');
  scene.add(label('STRING ISOLATOR',.55,'#5fd4ff').translateX(-2.6).translateY(6.6).translateZ(-2));
  /* pohon di ROW */
  const batang=cyl(.12,.18,2.4,0x4a3624);batang.position.set(5.4,1.2,-2);scene.add(batang);
  mpv.daun=new THREE.Mesh(new THREE.SphereGeometry(1.1,12,10),
    new THREE.MeshStandardMaterial({color:0x2e5a2e,roughness:.9}));
  mpv.daun.position.set(5.4,3.0,-2);scene.add(mpv.daun);
  actMesh(mpv.daun,'ROW');
  scene.add(label('POHON DI TEPI ROW',.6,'#ffd23f').translateX(5.4).translateY(4.4).translateZ(-2));
  /* kamera thermovision + layar */
  mpv.cam=box(.3,.22,.2,0x18242f);mpv.cam.position.set(-4.6,1.1,1.4);scene.add(mpv.cam);
  scene.add(label('THERMOVISION',.55,'#5fd4ff').translateX(-4.6).translateY(1.45).translateZ(1.4));
  const tbl=boxT(1.0,.07,.6,TEX.wood());tbl.position.set(-4.6,.95,1.4);scene.add(tbl);
  const tleg=boxT(.08,.95,.08,TEX.wood());tleg.position.set(-4.6,.47,1.4);scene.add(tleg);
  mpv.D=makeDisplay(1.9,1.1,400,230);
  mpv.D.mesh.position.set(-6.4,2.4,-1.4);mpv.D.mesh.rotation.y=.4;scene.add(mpv.D.mesh);
  dispText(mpv.D,['IR VIEW','arahkan ke objek…'],['#5fd4ff','#7d8f84']);
  const pole2=cyl(.04,.04,1.7,0x666666);pole2.position.set(-6.4,1.0,-1.4);scene.add(pole2);
  /* form laporan */
  mpv.form=box(.5,.66,.04,0xe8e4d8);mpv.form.position.set(-2.8,1.3,1.8);scene.add(mpv.form);
  actMesh(mpv.form,'LAPOR');
  scene.add(label('FORM INSPEKSI',.55,'#5fd4ff').translateX(-2.8).translateY(1.85).translateZ(1.8));
  startSeq([
   {type:'act',aid:'TOWER',done:false,targets:()=>[cross],
    desc:'Mulai dari struktur: periksa TOWER 57 (klik cross-arm).',
    why:'Mata menyapu dari kaki ke pucuk: baut lengkap (pencuri besi tower itu nyata), tidak ada karat parah, pondasi utuh, penghalang panjat & rambu terpasang. Struktur sehat — lanjut ke yang dialiri arus.',
    fx(){toast('🗼 Tower 57: baut ✓ pondasi ✓ rambu ✓ — struktur sehat.','ok',2600);}},
   {type:'act',aid:'SCAN',done:false,targets:()=>[mpv.klem],
    desc:'Arahkan THERMOVISION ke klem & sambungan (klik klem).',
    why:'Layar IR menyala: konduktor 42°C... tapi klem jumper fasa R membara 78°C — delta-T 36°C, kasta SEGERA. Resistansi kontaknya memburuk; dibiarkan sebulan lagi = klem putus berbeban = penghantar jatuh. Demam tertangkap sebelum jadi tumbang.',
    fx(){mpv.klem.material.color.setHex(0xff5a3a);
      dispText(mpv.D,['KLEM R: 78°C ⚠','ΔT 36°C — SEGERA'],['#ff5a5a','#ffd23f']);
      toast('🌡️ Klem fasa R: ΔT 36°C — prioritas SEGERA!','bad',3000);}},
   {type:'act',aid:'ISO',done:false,targets:()=>[mpv.iso.children[2]],
    desc:'Teropong STRING ISOLATOR: ada yang retak? (klik string)',
    why:'Piringan ketiga dari atas: retak rambut + jejak flashover kecoklatan — kemungkinan bekas sambaran yang ditangani relay tempo hari (ingat analisis distance-mu: tower 57-58!). Loop analisis menutup: prediksi kantor, bukti lapangan.',
    fx(){toast('🔍 Isolator #3 retak + jejak flashover — cocok dengan analisis DFR!','bad',2800);}},
   {type:'act',aid:'ROW',done:false,targets:()=>[mpv.daun],
    desc:'Ukur jarak POHON ke konduktor (klik pohon).',
    why:'Laser distance: 4,2 m dari konduktor terdekat — batas aman 150 kV minimal 5 m, dan pohon sengon ini menambah 2 m per tahun. Hari ini aman, enam bulan lagi tidak. Patroli yang baik melihat masa depan dari laju tumbuh.',
    fx(){toast('🌳 Jarak 4,2 m (< 5 m aman) — masuk daftar rabas segera.','bad',2800);}},
   {type:'act',aid:'LAPOR',done:false,targets:()=>[mpv.form],
    desc:'Susun LAPORAN prioritas + foto & koordinat (klik form).',
    why:'Tiga temuan, tiga prioritas: klem (SEGERA — jadwalkan hotline/PDKB), isolator (TINGGI — ganti saat pembebasan berikut), pohon (rabas bulan ini, surati pemilik lahan). Foto + koordinat + delta-T: laporan yang membuat anggaran tak bisa menolak.',
    fx(){toast('📋 3 temuan terdokumentasi — masuk rencana pemeliharaan!','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Patroli yang menyelamatkan penghantar!</b> Klem demam tertangkap IR, isolator retak melengkapi cerita DFR, dan pohon kena tilang sebelum menyentuh. Transmisi andal dirawat oleh kaki yang berjalan dan mata yang melihat panas.');
    setTimeout(()=>showWin('thermo'),2200);});
  say('VOLTA di sini 🎥 Hari patroli! Senjata utamamu kamera <b>thermovision</b>: sambungan yang memburuk itu DEMAM, dan demam tak bisa sembunyi dari infra merah. Tiga hal menunggu ditemukan — mulai dari struktur tower.');
  $('#modTitle').textContent='J04·M5 — Inspeksi & Thermovision';
  $('#taskHead').textContent='LIHAT PANAS SEBELUM PUTUS';}
MISSIONS.thermo.build=buildThermo;
Object.assign(REAL,{
 thermo:[
  'Thermovision diukur saat beban tinggi (>40%) — klem dingin saat beban rendah bisa menipu',
  'Catat emisivitas & jarak ukur di tiap foto IR; angka tanpa parameter = angka yang bisa dibantah',
  'Temuan SEGERA dieksekusi dengan PDKB (pekerjaan dalam keadaan bertegangan) bila padam tak memungkinkan',
  'Bangun database temuan per tower — pola berulang menunjuk masalah desain, bukan kebetulan'],
});

/* =====================================================================
   MISI 6 — DGA: MEMBACA DARAH TRAFO IBT
   ===================================================================== */
Object.assign(MISSIONS,{
 dga:{lvl:'JALUR 04 · TRANSMISI · MISI 6',icon:'🩸',title:'DGA: Membaca Darah Trafo IBT',strict:false,
  loc:'📍 GI 150 kV Kosambi · Trafo IBT 60 MVA, uji tahunan',
  story:'Aset termahal di GI ini bukan PMT atau busbar — melainkan IBT 60 MVA seharga puluhan miliar yang merendam rahasianya dalam puluhan ribu liter minyak. Dan minyak itu seperti darah: setiap gangguan kecil di dalam belitan meninggalkan jejak gas terlarut. Hari ini pengambilan sampel tahunan — dan hasil lab kali ini meminta perhatian lebih.',
  goal:'Sampel minyak terambil benar, hasil DGA terinterpretasi dengan metode standar, dan keputusan operasi yang tepat diambil — tanpa panik, tanpa abai.',
  obj:['Ambil sampel minyak sesuai prosedur','Interpretasi gas terlarut: rasio & tren','Putuskan tindak lanjut operasi yang proporsional'],
  learn:['DGA (dissolved gas analysis) = tes darah trafo: tiap jenis gangguan menghasilkan gas khas — H₂ (partial discharge), C₂H₂ (arcing!), C₂H₄ (panas tinggi), CO/CO₂ (kertas isolasi)','Sampel salah ambil = diagnosis salah: botol gelap kedap udara, dibilas minyak yang sama, tanpa gelembung — udara luar mencemari cerita','TREN mengalahkan angka tunggal: kenaikan 30% dalam 6 bulan lebih berarti daripada nilai absolut yang stabil bertahun-tahun','C₂H₂ (asetilen) adalah garis merah: ia hanya lahir dari busur listrik — kehadirannya walau ppm kecil mengubah jadwal santai jadi rencana serius'],
  next:['Pelajari segitiga Duval untuk klasifikasi gangguan visual','Dalami online DGA monitor untuk trafo kritis','Eksplorasi uji furan: menilai sisa umur kertas isolasi']},
});
let mdg={};
function buildDGA(){
  freshScene(0x7f9cc0,0x0d1726);
  cam={theta:.1,phi:1.16,r:9,target:new THREE.Vector3(0,1.8,-.8)};
  const ground=boxT(20,.1,12,TEX.gravel());ground.position.y=-.05;scene.add(ground);
  /* trafo IBT besar */
  const ibt=boxT(3.6,2.6,2.2,TEX.metal(),{metalness:.3});ibt.position.set(-2.6,1.35,-2);scene.add(ibt);
  [-1.2,0,1.2].forEach(dx=>{const fin=box(.07,2.2,2.1,0x5a6a7a);fin.position.set(-2.6+dx,1.3,-2);scene.add(fin);});
  [-.8,.2].forEach(dx=>{const bush=cyl(.12,.18,1.2,0xc9b08a);bush.position.set(-2.6+dx,3.2,-2);scene.add(bush);});
  scene.add(label('IBT 150/20 kV · 60 MVA',.9).translateX(-2.6).translateY(4.2).translateZ(-2));
  /* valve sampling */
  mdg.valve=cyl(.07,.07,.25,0xd83a3a);mdg.valve.rotation.z=Math.PI/2;
  mdg.valve.position.set(-.7,.6,-1.2);scene.add(mdg.valve);
  actMesh(mdg.valve,'SAMPEL');
  scene.add(label('VALVE SAMPLING BAWAH',.55,'#5fd4ff').translateX(-.4).translateY(.3).translateZ(-.9));
  /* botol sampel + kotak lab */
  mdg.botol=cyl(.08,.08,.22,0x3a2a1a,12,{transparent:true,opacity:.85});
  mdg.botol.position.set(1.2,.95,.6);scene.add(mdg.botol);
  const tbl=boxT(1.0,.07,.6,TEX.wood());tbl.position.set(1.2,.82,.6);scene.add(tbl);
  const tleg=boxT(.08,.82,.08,TEX.wood());tleg.position.set(1.2,.41,.6);scene.add(tleg);
  scene.add(label('BOTOL SAMPEL GELAP',.55,'#5fd4ff').translateX(1.2).translateY(1.35).translateZ(.6));
  /* layar hasil lab */
  const frame=boxT(3.6,2.2,.16,TEX.metal(),{metalness:.4});frame.position.set(4.2,2.3,-2.6);scene.add(frame);
  frame.add(label('HASIL LAB DGA',.8).translateY(1.35));
  mdg.D=makeDisplay(3.3,1.9,520,310);
  mdg.D.mesh.position.set(4.2,2.3,-2.5);scene.add(mdg.D.mesh);
  actMesh(mdg.D.mesh,'LAB');
  function lab(mode){
    const g=mdg.D.g,W=520,H=310;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='600 16px Consolas';g.textAlign='left';
    g.fillStyle='#5fd4ff';g.font='700 18px Consolas';
    g.fillText('GAS TERLARUT (ppm) — vs tahun lalu',16,32);
    const rows=[['H2','38','61','+61%','#ffd23f'],['CH4','22','41','+86%','#ffd23f'],
      ['C2H4','18','52','+189%','#ff5a5a'],['C2H6','14','28','+100%','#ffd23f'],
      ['C2H2','0','0','tetap 0','#46ff8e'],['CO','310','335','+8%','#46ff8e']];
    g.font='600 15px Consolas';
    rows.forEach((r,i)=>{const y=70+i*34;
      g.fillStyle='#8aa3bd';g.fillText(r[0],16,y);g.fillText(r[1],110,y);
      g.fillStyle=r[4];g.fillText(r[2],190,y);g.fillText(r[3],270,y);});
    if(mode>=1){g.fillStyle='#ffd23f';g.font='700 16px Consolas';
      g.fillText('POLA: panas 300-700°C (C2H4 naik, TANPA C2H2)',16,H-44);
      g.fillText('dugaan: kontak tap changer / sambungan memanas',16,H-18);}
    mdg.D.tex.needsUpdate=true;}
  lab(0);
  /* papan keputusan */
  mdg.kep=box(.6,.7,.05,0xe8e4d8);mdg.kep.position.set(7.0,1.6,-2.55);scene.add(mdg.kep);
  actMesh(mdg.kep,'PUTUSKAN');
  scene.add(label('LEMBAR KEPUTUSAN',.55,'#5fd4ff').translateX(7.0).translateY(2.15).translateZ(-2.5));
  startSeq([
   {type:'act',aid:'SAMPEL',done:false,targets:()=>[mdg.valve],
    desc:'Ambil SAMPEL minyak dari valve bawah dengan benar (klik valve).',
    why:'Ritualnya menentukan validitas: buang minyak mati di pipa valve dulu, bilas botol dengan minyak yang sama tiga kali, isi dari dasar tanpa gelembung, tutup kedap, lindungi dari cahaya. Sampel yang tercemar udara akan berbohong di lab — dan kebohongan trafo 60 MVA itu mahal.',
    fx(){toast('🧴 Sampel bersih terambil — tanpa gelembung, terlindung cahaya.','ok',2800);}},
   {type:'act',aid:'LAB',done:false,targets:()=>[mdg.D.mesh],
    desc:'Hasil lab tiba: baca kadar gas vs TAHUN LALU (klik layar).',
    why:'Etilen (C₂H₄) melonjak +189%, metana & hidrogen ikut naik — tapi perhatikan baris kelima: asetilen TETAP NOL. Tren-lah yang bercerita: ada yang MEMANAS di dalam sana, ratusan derajat... tapi belum ada busur api. Garis merah belum terlintasi.',
    fx(){toast('🩸 C2H4 +189% · C2H2 = 0 — panas ya, busur belum.','bad',3000);}},
   {type:'act',aid:'POLA',done:false,targets:()=>[mdg.D.mesh],
    desc:'Interpretasi POLA: gangguan jenis apa ini?',
    why:'Rasio gas mengarah ke gangguan termal 300–700°C — pola khas kontak yang memburuk: tersangka utama kontak tap changer atau sambungan internal yang resistansinya naik. CO hanya naik 8%: kertas isolasi belum ikut terbakar — pasiennya demam, organ vitalnya masih utuh.',
    fx(){lab(1);toast('🔍 Diagnosa: hot spot 300-700°C, kertas belum terlibat.','ok',3000);}},
   {type:'act',aid:'PUTUSKAN',done:false,targets:()=>[mdg.kep],
    desc:'Ambil KEPUTUSAN proporsional (klik lembar keputusan).',
    why:'Bukan panik (C₂H₂ nol, trafo boleh tetap beroperasi), bukan abai (tren +189% itu nyata). Keputusan kelas engineer: resample dipercepat ke 3 bulan, online DGA monitor dipasang, thermovision bushing & tap changer bulanan, dan inspeksi tap changer masuk agenda pemeliharaan terdekat. Aset miliaran dijaga oleh keputusan yang setimbang.',
    fx(){toast('📋 Operasi lanjut + monitor ketat + inspeksi terjadwal — proporsional.','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Darah trafo terbaca tuntas!</b> Sampel jujur, tren ditimbang, pola dikenali, dan keputusan tak panik tak abai. IBT 60 MVA itu kini dijaga bukan oleh harapan — tapi oleh data yang diambil ulang tiap tiga bulan.');
    setTimeout(()=>showWin('dga'),2200);});
  const s1=seq.steps[1],of1=s1.fx;s1.fx=()=>{of1();mdg.D.mesh.userData.aid='POLA';};
  say('VOLTA di sini 🩸 Aset puluhan miliar itu menyimpan rahasianya di <b>minyak</b> — dan minyak adalah darah yang bisa dites. Hari ini DGA tahunan: ambil sampelnya dengan hormat, baca gasnya dengan tenang. C₂H₂ adalah kata kuncinya.');
  $('#modTitle').textContent='J04·M6 — DGA Trafo IBT';
  $('#taskHead').textContent='TREN BICARA, ASETILEN MEMVONIS';}
MISSIONS.dga.build=buildDGA;
Object.assign(REAL,{
 dga:[
  'Gunakan lab terakreditasi & metode konsisten — beda lab beda kalibrasi, tren jadi kacau',
  'Interpretasi dengan beberapa metode sekaligus (rasio Rogers, Duval, IEEE C57.104) — satu metode bisa ambigu',
  'Catat suhu, beban & kejadian saat sampling — gas dipengaruhi kondisi operasi',
  'C2H2 terdeteksi berapa pun = eskalasi serius: konsultasi spesialis & rencana uji lanjutan segera'],
});

/* =====================================================================
   MISI 7 — PDKB: PEKERJAAN DALAM KEADAAN BERTEGANGAN
   ===================================================================== */
Object.assign(MISSIONS,{
 pdkb:{lvl:'JALUR 04 · TRANSMISI · MISI 7',icon:'🧤',title:'PDKB: Menyentuh 150 kV yang Hidup',strict:true,
  loc:'📍 Tower 57 · Ganti isolator TANPA padam',
  story:'Temuan thermovision-mu (isolator retak tower 57) harus dieksekusi — tapi penghantar ini memasok kawasan industri yang menolak padam barang semenit. Jawabannya profesi paling elit di transmisi: PDKB — pekerjaan dalam keadaan bertegangan. Mengganti isolator pada penghantar 150.000 volt YANG HIDUP, dengan ilmu jarak, alat isolasi, dan disiplin yang tak memberi diskon.',
  goal:'String isolator terganti tanpa pemadaman: izin & briefing tuntas, jarak aman terjaga sepanjang pekerjaan, beban string dipindah ke strain stick dengan benar.',
  obj:['Briefing & izin khusus PDKB + cek cuaca','Persiapan alat isolasi & verifikasi jarak minimum','Pindahkan beban string, ganti isolator, kembalikan'],
  learn:['PDKB metode jarak: pekerja TIDAK menyentuh konduktor — semua lewat hot stick fiberglass yang diuji tahanan isolasinya berkala','Jarak minimum approach adalah hukum fisika udara: 150 kV menuntut jarak aman yang TIDAK PERNAH dilanggar walau sedetik — udara adalah isolatormu yang terakhir','Strain stick memikul tarikan mekanis string (ribuan kg) saat isolator dilepas — beban listrik tetap mengalir, beban mekanis yang dipindah','Cuaca adalah anggota tim: kelembapan tinggi/gerimis menurunkan isolasi udara & alat — PDKB dibatalkan tanpa debat saat langit tak bersahabat'],
  next:['Pelajari metode PDKB sentuh (bare hand) dengan bonding ke konduktor','Dalami pengujian berkala alat PDKB (stick, tali, pakaian konduktif)','Eksplorasi robot & drone untuk pekerjaan bertegangan masa depan']},
});
let mpk={};
function buildPDKB(){
  freshScene(0x9fc0dc,0x12202e);
  cam={theta:.15,phi:1.05,r:11,target:new THREE.Vector3(0,4.5,-1)};
  const ground=boxT(24,.1,15,TEX.gravel());ground.position.y=-.05;scene.add(ground);
  /* tower + konduktor hidup */
  [[-1.1,-1.1],[1.1,-1.1],[-1.1,1.1],[1.1,1.1]].forEach(o=>{
    const kaki=boxT(.16,8.5,.16,TEX.metal(),{metalness:.5});
    kaki.position.set(o[0],4.25,-2+o[1]);kaki.rotation.z=o[0]*-.035;scene.add(kaki);});
  const cross=boxT(5.4,.18,.18,TEX.metal(),{metalness:.5});cross.position.set(0,7.6,-2);scene.add(cross);
  const kawat=cyl(.022,.022,22,0x3c4754);kawat.rotation.z=Math.PI/2;kawat.position.set(0,6.3,-2);scene.add(kawat);
  scene.add(label('150 kV — HIDUP & BERBEBAN',.85,'#ff8d8d').translateY(8.6).translateZ(-2));
  /* string isolator retak */
  mpk.iso=new THREE.Group();
  for(let i=0;i<5;i++){const d=cyl(.15,.15,.05,i===2?0x8a6a5a:0x9aa7b4,16);d.position.y=-i*.14;mpk.iso.add(d);}
  mpk.iso.position.set(-2.2,7.4,-2);scene.add(mpk.iso);
  scene.add(label('STRING RETAK (target)',.6,'#ffd23f').translateX(-2.2).translateY(8.0).translateZ(-2));
  /* meja briefing + cuaca */
  mpk.brief=box(.6,.75,.05,0xe8e4d8);mpk.brief.position.set(-6.2,1.5,1.4);scene.add(mpk.brief);
  actMesh(mpk.brief,'BRIEF');
  const bt=cyl(.04,.04,1.4,0x666666);bt.position.set(-6.2,.7,1.4);scene.add(bt);
  scene.add(label('BRIEFING + IZIN PDKB',.6,'#5fd4ff').translateX(-6.2).translateY(2.05).translateZ(1.4));
  /* rak alat: hot stick + strain stick */
  const rak=boxT(2.2,.12,.8,TEX.wood());rak.position.set(-3.4,.7,1.6);scene.add(rak);
  mpk.stick=cyl(.035,.035,2.6,0xd8a020);mpk.stick.rotation.z=.45;
  mpk.stick.position.set(-3.8,1.1,1.6);scene.add(mpk.stick);
  actMesh(mpk.stick,'ALAT');
  scene.add(label('HOT STICK + STRAIN STICK',.6,'#5fd4ff').translateX(-3.4).translateY(1.7).translateZ(1.6));
  /* strain stick terpasang (muncul) */
  mpk.strain=cyl(.04,.04,1.1,0xd8a020);mpk.strain.position.set(-2.2,7.0,-1.6);
  mpk.strain.rotation.x=.25;mpk.strain.visible=false;scene.add(mpk.strain);
  /* pekerja di tower */
  mpk.linesman=new THREE.Group();
  const badan=cyl(.18,.22,.7,0xd87a20);badan.position.y=.5;mpk.linesman.add(badan);
  const kepala=new THREE.Mesh(new THREE.SphereGeometry(.13,12,10),
    new THREE.MeshStandardMaterial({color:0xd8b090}));kepala.position.y=1.0;mpk.linesman.add(kepala);
  const helm=new THREE.Mesh(new THREE.SphereGeometry(.15,12,8,0,Math.PI*2,0,Math.PI/2),
    new THREE.MeshStandardMaterial({color:0xffd23f}));helm.position.y=1.05;mpk.linesman.add(helm);
  mpk.linesman.position.set(-1.1,5.8,-2);mpk.linesman.visible=false;scene.add(mpk.linesman);
  actMesh(badan,'GANTI');
  /* isolator baru */
  mpk.baru=new THREE.Group();
  for(let i=0;i<5;i++){const d=cyl(.15,.15,.05,0xb8c8d8,16);d.position.y=-i*.14;mpk.baru.add(d);}
  mpk.baru.position.set(-5.0,.9,.4);scene.add(mpk.baru);
  scene.add(label('STRING BARU',.55,'#8df0b8').translateX(-5.0).translateY(1.4).translateZ(.4));
  startSeq([
   {type:'act',aid:'BRIEF',done:false,targets:()=>[mpk.brief],
    desc:'BRIEFING PDKB: izin khusus, peran tiap orang, & vonis cuaca (klik dokumen).',
    why:'Izin PDKB berbeda kelasnya: dispatcher mencatat (relay reclose DIMATIKAN — bila trip saat tim bekerja, jaringan tak boleh coba menyala sendiri!), tiap orang tahu perannya, dan stasiun cuaca memvonis: cerah, kelembapan 62%, angin 8 km/jam — DI BAWAH batas semua. Hari ini langit mengizinkan.',
    fx(){toast('📋 Izin ✓ reclose OFF ✓ cuaca LAYAK — PDKB jalan.','ok',3200);}},
   {type:'act',aid:'ALAT',done:false,targets:()=>[mpk.stick],
    desc:'Siapkan & UJI alat isolasi hari itu juga (klik hot stick).',
    why:'Setiap stick dilap bersih (debu+embun = jalur arus!), diuji tahanan isolasinya PAGI INI — bukan mengandalkan stiker uji bulan lalu. Tali serat, strain stick, semua diperlakukan sama: di PDKB, alat adalah perpanjangan nyawa, dan nyawa tak menerima alat kemarin.',
    fx(){toast('🧪 Semua stick lap+uji hari ini: >100 GΩ ✓','ok',2800);}},
   {type:'act',aid:'NAIK',done:false,targets:()=>[mpk.iso.children[1]],
    desc:'Tim naik posisi kerja — verifikasi JARAK MINIMUM (klik string).',
    why:'Linesman memanjat ke cross-arm — ilmu 100% tie-off dari J08 dipakai penuh — dan berhenti di posisi yang dihitung: tubuh & alat konduktif TIDAK PERNAH masuk radius jarak minimum dari konduktor hidup. Pengawas di bawah memegang satu wewenang absolut: meneriakkan STOP.',
    fx(){mpk.linesman.visible=true;
      toast('🧗 Posisi kerja aman — jarak minimum terjaga, pengawas siaga.','ok',3000);}},
   {type:'act',aid:'STRAIN',done:false,targets:()=>[mpk.iso.children[1]],
    desc:'Pasang STRAIN STICK: pindahkan beban mekanis string (klik string).',
    why:'String isolator memikul tarikan konduktor ribuan kilogram — sebelum dilepas, strain stick fiberglass mengambil alih tarikan itu lewat hot stick. Kini isolator retak menggantung tanpa beban: listrik tetap mengalir di konduktor, mekanika sudah pindah ke stick. Dua dunia dipisahkan dengan rapi.',
    fx(){mpk.strain.visible=true;
      toast('🔗 Strain stick memikul beban — string bebas tarikan.','ok',3000);}},
   {type:'act',aid:'GANTI',done:false,targets:()=>[mpk.linesman.children[0]],
    desc:'Momen puncak: GANTI string dengan hot stick — 150 kV tetap mengalir.',
    why:'Lewat ujung stick 3 meter: pin dilepas, string retak diturunkan tali, string baru naik & terpasang, strain stick dilepas perlahan — beban kembali ke pundak isolator baru. Kawasan industri di ujung sana tak tahu apa-apa: pabrik berjalan, dan di atas sini sejarah kecil baru saja dikerjakan tanpa satu volt pun berhenti.',
    fx(){mpk.iso.children[2].material.color.setHex(0xb8c8d8);mpk.strain.visible=false;
      toast('🏆 String terganti — NOL detik padam. Selamat datang di kasta PDKB!','ok',3600);sfx.big();}},
  ],()=>{say('🎉 <b>Menyentuh yang hidup tanpa tersentuh!</b> Izin & cuaca dihormati, alat diuji hari itu, jarak tak pernah dilanggar, beban dipindah dengan ilmu. PDKB: pekerjaan yang membuat pemadaman menjadi pilihan, bukan keharusan.');
    setTimeout(()=>showWin('pdkb'),2200);});
  actMesh(mpk.iso.children[1],'NAIK');
  const s3p=seq.steps[3];
  const of2p=seq.steps[2].fx;seq.steps[2].fx=()=>{of2p();mpk.iso.children[1].userData.aid='STRAIN';};
  say('VOLTA di sini, dan hari ini kita masuk kasta elit 🧤 <b>PDKB: mengganti isolator pada 150 kV yang HIDUP</b>. Tiga sekutu: jarak, alat teruji, dan cuaca. Satu musuh: rasa terburu-buru. Mulai dari briefing!');
  $('#modTitle').textContent='J04·M7 — PDKB 150 kV';
  $('#taskHead').textContent='JARAK ADALAH NYAWA';}
MISSIONS.pdkb.build=buildPDKB;
Object.assign(REAL,{
 pdkb:[
  'PDKB hanya oleh tim tersertifikasi khusus dengan SOP & supervisi ketat — bukan keterampilan otodidak',
  'Alat diuji elektrik berkala di lab DAN diperiksa-lap sebelum tiap pekerjaan',
  'Reclose/penutup balik dinonaktifkan & dikonfirmasi dispatcher sebelum tim mendekat',
  'Batas cuaca (kelembapan, angin, petir) tertulis di SOP — pembatalan bukan kegagalan, itu kedewasaan'],
});

/* =====================================================================
   MISI 8 — PMU & WAMS: MELIHAT DETAK SISTEM SE-PULAU
   ===================================================================== */
Object.assign(MISSIONS,{
 pmu:{lvl:'JALUR 04 · TRANSMISI · MISI 8',icon:'🛰️',title:'PMU & WAMS: Melihat Detak Sistem Se-Pulau',strict:false,
  loc:'📍 GI Kosambi & pusat WAMS · Era pengukuran sinkron',
  story:'SCADA lamamu memotret sistem tiap 2-4 detik — cukup untuk operasi, buta untuk dinamika. Teknologi barunya: PMU (phasor measurement unit) — 50 potret per DETIK, semua GI distempel waktu GPS yang sama, sehingga SUDUT fasa antar kota bisa dibandingkan langsung. Hari ini kamu memasang PMU di Kosambi… dan WAMS pusat segera menangkap sesuatu yang selama ini tak terlihat: sistem berayun pelan, seperti jembatan yang bergoyang.',
  goal:'PMU terpasang & tersinkron GPS, data phasor mengalir ke WAMS, dan osilasi antar-area 0,3 Hz yang selama ini tak kasat terdeteksi & ditindaklanjuti.',
  obj:['Pasang PMU: sumber sinyal CT/PT & antena GPS','Validasi sinkronisasi & aliran data ke WAMS','Analisis: temukan & laporkan osilasi antar-area'],
  learn:['PMU mengukur phasor (besar + SUDUT) 25-50x/detik dengan stempel GPS — sudut tegangan Kosambi vs Surabaya bisa dibandingkan seperti dua jam yang disetel satelit yang sama','Sudut fasa antar bus = "kemiringan" aliran daya: membesar pelan berarti sistem makin tertekan — alarm yang SCADA biasa tak pernah bisa bunyikan','Osilasi antar-area (0,1-0,8 Hz) adalah goyangan kelompok pembangkit barat vs timur: kecil tak berbahaya, membesar bisa memutus pulau — PMU adalah satu-satunya yang melihatnya','Damping diukur: osilasi teredam cepat = sehat; teredam lambat = PSS (power system stabilizer) pembangkit perlu ditala'],
  next:['Pelajari penalaan PSS bersama tim pembangkit','Dalami aplikasi WAMS: pendeteksi pulau, validasi model dinamis','Eksplorasi proteksi wide-area (RAS/SIPS) berbasis phasor']},
});
let mpm={};
function buildPMU(){
  freshScene(0x7f9cc0,0x0d1726);
  cam={theta:.05,phi:1.16,r:8.5,target:new THREE.Vector3(0,1.8,-.8)};
  const Z=room(0x55606a,0xc4cdd6,16,11);
  /* panel relay + slot PMU */
  const panel=boxT(1.6,2.4,.4,TEX.metal(),{metalness:.35});panel.position.set(-4.6,1.3,Z-.02);scene.add(panel);
  panel.add(label('PANEL PROTEKSI GI',.7).translateY(1.5));
  mpm.pmu=box(.6,.3,.3,0x2a5a8a);mpm.pmu.position.set(-4.6,1.4,Z+.22);scene.add(mpm.pmu);
  actMesh(mpm.pmu,'PASANG');
  scene.add(label('UNIT PMU (baru)',.55,'#5fd4ff').translateX(-4.6).translateY(1.0).translateZ(Z+.2));
  /* antena GPS di atap */
  mpm.gps=cyl(.06,.1,.3,0xe8edf2);mpm.gps.position.set(-4.6,3.6,Z+.3);scene.add(mpm.gps);
  actMesh(mpm.gps,'GPS');
  scene.add(label('ANTENA GPS',.55,'#5fd4ff').translateX(-4.6).translateY(4.0).translateZ(Z+.3));
  /* layar WAMS */
  const frame=boxT(4.6,2.6,.16,TEX.metal(),{metalness:.4});frame.position.set(1.2,2.5,Z+.05);scene.add(frame);
  frame.add(label('WAMS — PUSAT PENGATUR',.85).translateY(1.6));
  mpm.D=makeDisplay(4.3,2.3,600,330);
  mpm.D.mesh.position.set(1.2,2.5,Z+.15);scene.add(mpm.D.mesh);
  actMesh(mpm.D.mesh,'SINKRON');
  mpm.mode=0;mpm.t=0;
  function wams(){
    const g=mpm.D.g,W=600,H=330;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='600 15px Consolas';g.textAlign='left';
    if(mpm.mode===0){g.fillStyle='#5d748c';g.font='700 17px Consolas';
      g.fillText('menunggu stream phasor…',24,H/2);}
    else{
      g.fillStyle='#5fd4ff';g.font='700 17px Consolas';
      g.fillText('SUDUT ANTAR-AREA (Kosambi ref)',16,28);
      g.strokeStyle='#46ff8e';g.lineWidth=2.5;g.beginPath();
      for(let x=0;x<W-40;x++){
        const osc=(mpm.mode>=2?Math.sin((x+mpm.t*60)*.06)*Math.exp(0)*14:0);
        g.lineTo(20+x,150-x*.04-osc*(mpm.mode>=2?1:0));}
      g.stroke();
      if(mpm.mode>=2){g.fillStyle='#ffd23f';g.font='700 16px Consolas';
        g.fillText('OSILASI 0,32 Hz · damping 3,8% (lemah!)',16,60);
        g.fillStyle='#8aa3bd';g.font='600 14px Consolas';
        g.fillText('mode antar-area: barat ↔ timur',16,86);}
      if(mpm.mode>=3){g.fillStyle='#46ff8e';g.font='700 16px Consolas';
        g.fillText('pasca tala PSS: damping 9,6% ✓',16,H-24);}}
    mpm.D.tex.needsUpdate=true;}
  wams();
  moduleTick=(dt)=>{if(mpm.mode>=2){mpm.t+=dt;if((mpm.t*10|0)%2===0)wams();}};
  /* laporan */
  mpm.rep=box(.5,.66,.04,0xe8e4d8);mpm.rep.position.set(4.8,1.2,Z+.06);scene.add(mpm.rep);
  actMesh(mpm.rep,'LAPOR');
  scene.add(label('LAPORAN KE PEMBANGKIT',.55,'#5fd4ff').translateX(4.8).translateY(1.75).translateZ(Z+.1));
  startSeq([
   {type:'act',aid:'PASANG',done:false,targets:()=>[mpm.pmu],
    desc:'Pasang UNIT PMU: cabang sinyal dari CT/PT existing (klik unit).',
    why:'PMU menumpang sinyal CT/PT yang sama dengan relay — lewat terminal uji, TANPA mengganggu proteksi (proteksi adalah raja; PMU hanya tamu yang mendengarkan). 50 frame phasor per detik mulai dihitung di dalamnya, menunggu satu hal: waktu yang presisi.',
    fx(){toast('🔌 PMU tersambung via terminal uji — proteksi tak tersentuh.','ok',3000);}},
   {type:'act',aid:'GPS',done:false,targets:()=>[mpm.gps],
    desc:'Pasang ANTENA GPS — jantung sinkronisasi mikrodetik (klik antena).',
    why:'Tanpa GPS, PMU hanyalah meteran cepat. Dengan GPS (presisi <1 µs), stempel waktunya identik dengan PMU di Surabaya, Bandung, di mana pun — dan barulah SUDUT antar kota bermakna. Satu mikrodetik meleset = 0,018° salah baca: presisi waktu adalah segalanya di dunia phasor.',
    fx(){toast('🛰️ GPS lock 11 satelit — stempel waktu <1 µs.','ok',3000);}},
   {type:'act',aid:'SINKRON',done:false,targets:()=>[mpm.D.mesh],
    desc:'Validasi: stream phasor mengalir ke WAMS pusat (klik layar).',
    why:'50 frame/detik mengalir via jaringan khusus ke phasor data concentrator — Kosambi kini satu dari 28 mata sinkron se-pulau. Layar WAMS menggambar sudut antar-area secara LIVE: untuk pertama kalinya, GI-mu bukan hanya melapor besaran, tapi ikut menggambar detak jantung sistem.',
    fx(){mpm.mode=1;wams();toast('📡 Stream 50 fps masuk WAMS — mata ke-28 menyala.','ok',3000);}},
   {type:'act',aid:'OSILASI',done:false,targets:()=>[mpm.D.mesh],
    desc:'WAMS menangkap sesuatu: analisis OSILASI itu (klik layar).',
    why:'Mata baru langsung bekerja: sudut barat-timur berayun 0,32 Hz dengan damping hanya 3,8% — kelompok pembangkit dua area saling bergoyang seperti dua anak di jungkat-jungkit, teredam terlalu lambat. SCADA 2-detik selamanya buta pada ini; gangguan besar di momen yang salah bisa membuatnya membesar. Sistem ternyata sudah lama berbisik — baru hari ini ada yang mendengar.',
    fx(){mpm.mode=2;toast('🌊 Osilasi 0,32 Hz · damping 3,8% — bisikan tertangkap!','bad',3400);}},
   {type:'act',aid:'LAPOR',done:false,targets:()=>[mpm.rep],
    desc:'Tindak lanjut: LAPORKAN untuk penalaan PSS pembangkit (klik laporan).',
    why:'Laporan + rekaman phasor dikirim ke tim pembangkit: PSS dua unit besar area timur ditala ulang berdasar data nyata (bukan model lama). Sebulan kemudian WAMS memvonis: damping 9,6% — ayunan kini teredam dalam hitungan detik. Pengukuran yang lebih tajam melahirkan sistem yang lebih tenang.',
    fx(){mpm.mode=3;wams();
      toast('📤 PSS ditala dari data PMU — damping 3,8→9,6% ✓','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Sistem se-pulau kini punya detak yang terlihat!</b> PMU memotret 50 kali per detik, GPS menyamakan jamnya, dan osilasi yang berbisik bertahun-tahun akhirnya terdengar & diredam. Selamat datang di era pengukuran sinkron.');
    setTimeout(()=>showWin('pmu'),2200);});
  const s2p=seq.steps[2],of2p2=s2p.fx;s2p.fx=()=>{of2p2();mpm.D.mesh.userData.aid='OSILASI';};
  say('VOLTA di sini 🛰️ SCADA memotret tiap 2 detik — cukup untuk operasi, buta untuk dinamika. Teknologi barumu: <b>PMU, 50 potret per detik berstempel GPS</b>. Dan begitu matanya terbuka… sistem ternyata sedang berayun. Pasang!');
  $('#modTitle').textContent='J04·M8 — PMU & WAMS';
  $('#taskHead').textContent='50 POTRET PER DETIK';}
MISSIONS.pmu.build=buildPMU;
Object.assign(REAL,{
 pmu:[
  'Penyambungan sinyal CT/PT lewat terminal uji dengan izin & pengawasan proteksi — relay tak boleh terganggu',
  'Redundansi waktu (GPS + holdover oscillator) — kehilangan sinyal waktu = data phasor tak berarti',
  'Jaringan komunikasi PMU butuh latensi & jitter terjaga — pisahkan dari trafik kantor',
  'Kalibrasi & uji kelas P/M PMU sesuai standar sinkrofasor sebelum dinyatakan andal'],
});
