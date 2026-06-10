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
