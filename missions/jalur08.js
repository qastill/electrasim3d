/* =====================================================================
   ElectraSim VR 3D — K3 LISTRIK
   Misi: M1 k3 (APD & LOTO Pekerjaan Panel) · M2 rescue (Pertolongan Korban Sengatan Listrik)
   Dimuat on-demand oleh index.html lewat ensureMission().
   ===================================================================== */

Object.assign(MISSIONS,{
 k3:{lvl:'JALUR 08 · K3 LISTRIK',icon:'🦺',title:'APD & LOTO Pekerjaan Panel',strict:true,
  loc:'📍 Workshop industri · Panel LVMDP 380 V',
  story:'Kamu safety officer. Teknisi akan mengganti breaker di panel LVMDP yang masih beroperasi. Sebelum pekerjaan dimulai, pastikan prosedur keselamatan dijalankan TANPA satu pun langkah terlewat: dari izin kerja sampai bukti tegangan nol.',
  goal:'Pekerjaan panel siap dimulai dengan aman: JSA ditandatangani, APD lengkap, panel ter-LOTO, dan tegangan terbukti nol.',
  obj:['Izin kerja & JSA','APD berurutan: helm → sarung tangan → sepatu','LOTO breaker utama & verifikasi tegangan nol'],
  learn:['JSA mengidentifikasi bahaya SEBELUM bekerja, bukan setelah kejadian','APD = pertahanan terakhir setelah eliminasi/substitusi/engineering control','LOTO: gembok + tag pribadi — hanya pemasang yang boleh melepas','"Test before touch": tegangan nol wajib diverifikasi alat ukur'],
  next:['Pelajari hierarki pengendalian risiko 5 level','Dalami kategori arc flash & pemilihan APD per kategori','Lanjut Jalur 10: keselamatan kerja sistem PLTS (DC!)']},
 rescue:{lvl:'JALUR 08 · K3 LISTRIK · MISI 2',icon:'🚨',title:'Pertolongan Korban Sengatan Listrik',strict:true,
  loc:'📍 Workshop industri · Insiden listrik, korban di lantai',
  story:'Teriakan dari workshop: seorang pekerja tergeletak — tangannya masih menempel pada kabel ekstension terkelupas. Naluri pertamamu pasti berlari menolong. TAHAN. Penolong yang menyentuh korban yang masih teraliri akan menjadi korban kedua. Urutan adalah segalanya.',
  goal:'Korban tertolong tanpa korban kedua: sumber diputus, bantuan dipanggil, pertolongan pertama benar, insiden dilaporkan.',
  obj:['Putus sumber listrik SEBELUM menyentuh apapun','Pisahkan korban dengan alat isolasi & panggil bantuan','Cek respons korban, lakukan pertolongan, laporkan insiden'],
  learn:['Aturan emas: JANGAN sentuh korban yang masih kontak listrik — putus sumber dulu','Bila sumber tak terjangkau: gunakan benda isolasi KERING (kayu, plastik) untuk memisahkan','Henti jantung akibat listrik sering reversible — CPR segera melipatgandakan peluang hidup','Setiap insiden wajib dilaporkan & diinvestigasi: near-miss hari ini = fatality besok bila diabaikan'],
  next:['Ikuti pelatihan CPR/BLS bersertifikat — simulasi bukan pengganti','Pelajari efek arus pada tubuh: 1 mA terasa, 30 mA fibrilasi','Susun prosedur tanggap darurat listrik untuk fasilitasmu']},
});

/* =====================================================================
   MISI 5 — K3: APD & LOTO (Jalur 08)
   ===================================================================== */
let mk={};
function buildK3(){
  freshScene(0xb8c6d4,0x141d28);
  cam={theta:-.1,phi:1.2,r:6.5,target:new THREE.Vector3(0,1.6,-1)};
  const Z=room(0x5a5f66,0xccd4cf);
  const line=box(9,.02,.12,0xffd23f,{emissive:0x6b5200,emissiveIntensity:.4});
  line.position.set(0,.02,.6);scene.add(line);

  /* papan JSA */
  const jsa=box(.8,1.0,.06,0xe8e4d8);jsa.position.set(-3.6,2.0,Z);scene.add(jsa);
  jsa.add(label('PAPAN JSA / IZIN KERJA',.78,'#5fd4ff').translateY(.75));
  actMesh(jsa,'JSA');

  /* rak APD: helm, sarung tangan, sepatu */
  const rack=box(1.6,2.0,.12,0x3a444e);rack.position.set(-1.6,1.5,-3.3);scene.add(rack);
  rack.add(label('RAK APD',.7).translateY(1.25));
  mk.helm=new THREE.Mesh(new THREE.SphereGeometry(.17,18,14,0,Math.PI*2,0,Math.PI/2),
    new THREE.MeshStandardMaterial({color:0xffd23f,roughness:.4}));
  mk.helm.position.set(-2.1,2.0,-3.18);scene.add(mk.helm);actMesh(mk.helm,'HELM');
  scene.add(label('HELM',.42).translateX(-2.1).translateY(2.32).translateZ(-3.1));
  mk.glove=box(.2,.3,.05,0xcc6b2c);mk.glove.position.set(-1.6,1.95,-3.2);scene.add(mk.glove);
  actMesh(mk.glove,'GLOVE');
  scene.add(label('SARUNG TGN',.42).translateX(-1.6).translateY(2.32).translateZ(-3.1));
  mk.shoe=box(.3,.16,.14,0x35404c);mk.shoe.position.set(-1.1,1.9,-3.2);scene.add(mk.shoe);
  actMesh(mk.shoe,'SHOE');
  scene.add(label('SEPATU',.42).translateX(-1.1).translateY(2.32).translateZ(-3.1));

  /* panel LVMDP + breaker + gembok */
  const panel=box(1.5,2.2,.35,0x8a96a2);panel.position.set(1.6,1.3,Z-.05);scene.add(panel);
  panel.add(label('PANEL LVMDP 380V',.85).translateY(1.4));
  mk.breaker=box(.3,.42,.12,0x223a55);mk.breaker.position.set(1.6,1.7,Z+.18);scene.add(mk.breaker);
  actMesh(mk.breaker,'LOTO');
  scene.add(label('BREAKER UTAMA + GEMBOK',.6,'#5fd4ff').translateX(1.6).translateY(2.55).translateZ(Z+.1));
  mk.lampPanel=new THREE.Mesh(new THREE.SphereGeometry(.05,12,10),
    new THREE.MeshStandardMaterial({color:0xff8030,emissive:0xff8030,emissiveIntensity:1}));
  mk.lampPanel.position.set(1.2,2.1,Z+.2);scene.add(mk.lampPanel);

  /* tespen / voltage tester di meja kecil */
  const tbl=box(.7,.06,.5,0x6b4f33);tbl.position.set(3.6,1.0,-1.4);scene.add(tbl);
  const tleg=box(.07,1,.07,0x4a3624);tleg.position.set(3.6,.5,-1.4);scene.add(tleg);
  mk.tester=cyl(.035,.05,.34,0xffd23f);mk.tester.rotation.z=.9;mk.tester.position.set(3.6,1.1,-1.4);scene.add(mk.tester);
  actMesh(mk.tester,'TEST');
  scene.add(label('VOLTAGE TESTER',.6,'#5fd4ff').translateX(3.6).translateY(1.45).translateZ(-1.4));

  startSeq([
   {type:'act',aid:'JSA',done:false,targets:()=>[jsa],
    desc:'Baca & tanda tangani JSA + izin kerja (klik PAPAN JSA).',
    why:'JSA (Job Safety Analysis) memetakan bahaya SEBELUM pekerjaan: titik energi, risiko arc flash, jalur evakuasi. Tanda tanganmu = bukti semua orang paham risikonya.',
    fx(){toast('📋 JSA ditandatangani — bahaya teridentifikasi.','ok',2400);}},
   {type:'act',aid:'HELM',done:false,targets:()=>[mk.helm],
    desc:'Kenakan HELM safety (klik helm).',
    why:'Kepala dulu — helm kelas E tahan tegangan melindungi dari benturan & sengatan. APD = pertahanan terakhir setelah eliminasi, substitusi, dan engineering control.',
    fx(){toast('⛑️ Helm terpasang.','ok',1800);}},
   {type:'act',aid:'GLOVE',done:false,targets:()=>[mk.glove],
    desc:'Kenakan SARUNG TANGAN isolasi (klik sarung tangan).',
    why:'Tangan adalah anggota tubuh yang paling sering kontak. Sarung tangan isolasi diuji berkala — periksa sobekan dengan tes gulung udara sebelum dipakai.',
    fx(){toast('🧤 Sarung tangan isolasi OK.','ok',1800);}},
   {type:'act',aid:'SHOE',done:false,targets:()=>[mk.shoe],
    desc:'Kenakan SEPATU safety isolasi (klik sepatu).',
    why:'Sepatu isolasi memutus jalur arus ke tanah lewat tubuh — pasangan kerja sarung tangan dalam mencegah arus melintasi jantung.',
    fx(){toast('🥾 Sepatu isolasi terpasang. APD lengkap!','ok',2000);}},
   {type:'act',aid:'LOTO',done:false,targets:()=>[mk.breaker],
    desc:'Matikan breaker utama & pasang GEMBOK LOTO (klik breaker).',
    why:'Lock Out Tag Out: gembok PRIBADI dengan tag namamu. Aturannya keras: hanya pemasang gembok yang boleh melepasnya — tidak ada pengecualian, bahkan untuk atasan.',
    fx(){mk.breaker.rotation.x=.4;mk.breaker.material.color.setHex(0xb02020);
      mk.lampPanel.material.emissiveIntensity=0;mk.lampPanel.material.color.setHex(0x553322);
      toast('🔒 Breaker OFF + gembok & tag terpasang.','ok',2400);}},
   {type:'act',aid:'TEST',done:false,targets:()=>[mk.tester],
    desc:'TEST BEFORE TOUCH: verifikasi tegangan nol (klik voltage tester).',
    why:'Breaker OFF bukan bukti — bisa ada feeding lain atau breaker gagal. "Test before touch": ukur dulu di titik kerja dengan alat yang juga diuji sebelum & sesudah (live-dead-live).',
    fx(){toast('🔍 0 Volt terverifikasi — panel AMAN dikerjakan.','ok',2600);sfx.big();}},
  ],()=>{say('🎉 <b>Prosedur keselamatan sempurna!</b> Teknisi kini bekerja di panel yang benar-benar mati, terkunci, dan terbukti nol. Begini caranya semua orang pulang dengan selamat.');
    setTimeout(()=>showWin('k3'),2000);});

  say('VOLTA di sini 🦺 Hari ini kamu safety officer. Ingat mantra K3: <b>tidak ada pekerjaan yang begitu penting sehingga layak mengorbankan keselamatan</b>. Jalankan 6 langkah persis berurutan — penanda ▼ menunjukkan langkah aktif.');
  $('#modTitle').textContent='J08 — APD & LOTO Pekerjaan Panel';
  $('#taskHead').textContent='PROSEDUR KESELAMATAN';}

/* =====================================================================
   MISI 26 — PERTOLONGAN KORBAN (Jalur 08 · Misi 2)
   ===================================================================== */
let mrc={};
function buildRescue(){
  freshScene(0xb8c6d4,0x141d28);
  cam={theta:.1,phi:1.22,r:7,target:new THREE.Vector3(.5,1.2,-.5)};
  const Z=room(0x5a5f66,0xccd4cf);
  /* korban tergeletak */
  mrc.body=box(1.5,.28,.5,0x4a6a8a);mrc.body.position.set(1.6,.2,.4);scene.add(mrc.body);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.17,16,12),
    new THREE.MeshStandardMaterial({color:0xd8b090,roughness:.6}));
  head.position.set(2.5,.22,.4);scene.add(head);
  actMesh(mrc.body,'KORBAN');
  scene.add(label('KORBAN ⚠',.8,'#ff8d8d').translateX(1.8).translateY(.95).translateZ(.4));
  /* kabel ekstension menyala */
  mrc.cable=cyl(.03,.03,1.6,0xd83a3a);mrc.cable.rotation.z=1.2;
  mrc.cable.position.set(.6,.3,.5);scene.add(mrc.cable);
  mrc.sparkT=0;
  /* panel MCB di dinding */
  const pnl=boxT(.8,1.0,.2,TEX.metal(),{metalness:.35});pnl.position.set(-3.4,2.0,Z);scene.add(pnl);
  pnl.add(label('PANEL MCB',.7,'#5fd4ff').translateY(.75));
  mrc.mcb=box(.16,.24,.1,0x2255aa);mrc.mcb.position.set(-3.4,2.0,Z+.16);scene.add(mrc.mcb);
  actMesh(mrc.mcb,'MCB'); actMesh(pnl,'MCB');
  /* tongkat kayu di rak */
  mrc.stick=cyl(.035,.035,1.5,0x8a6a3a);mrc.stick.rotation.z=.4;
  mrc.stick.position.set(-1.2,1.4,-3.0);scene.add(mrc.stick);
  actMesh(mrc.stick,'STICK');
  scene.add(label('TONGKAT KAYU KERING',.6,'#5fd4ff').translateX(-1.2).translateY(2.1).translateZ(-2.9));
  /* telepon dinding */
  mrc.tel=box(.26,.4,.12,0xd83a3a);mrc.tel.position.set(3.6,1.9,Z+.08);scene.add(mrc.tel);
  actMesh(mrc.tel,'TELP');
  scene.add(label('TELEPON DARURAT',.6,'#5fd4ff').translateX(3.6).translateY(2.4).translateZ(Z+.1));
  /* papan laporan */
  mrc.rep=box(.7,.5,.05,0xe8e4d8);mrc.rep.position.set(5.0,1.5,Z+.06);scene.add(mrc.rep);
  actMesh(mrc.rep,'LAPOR');
  scene.add(label('FORM INSIDEN',.55,'#5fd4ff').translateX(5.0).translateY(1.95).translateZ(Z+.1));

  mrc.live=true;
  moduleTick=(dt,T)=>{if(mrc.live){mrc.sparkT+=dt;
    if(mrc.sparkT>.55){mrc.sparkT=0;spark(new THREE.Vector3(1.0,.32,.5),0xffd23f);}}};

  startSeq([
   {type:'act',aid:'MCB',done:false,targets:()=>[mrc.mcb],
    desc:'STOP! Jangan sentuh korban — PUTUS SUMBER dulu (klik panel MCB).',
    why:'Korban masih kontak dengan konduktor hidup: tubuhnya bertegangan. Menyentuhnya = arus mengalir lewat DUA tubuh. Penolong mati tidak menolong siapa-siapa.',
    fx(){mrc.live=false;mrc.mcb.rotation.x=.5;mrc.cable.material.color.setHex(0x666666);
      toast('🔌 MCB OFF — sumber listrik terputus.','ok',2600);}},
   {type:'act',aid:'STICK',done:false,targets:()=>[mrc.stick],
    desc:'Singkirkan kabel dari korban memakai TONGKAT KAYU kering.',
    why:'Lapis kedua pertahanan: walau MCB sudah OFF, perlakukan konduktor sebagai hidup sampai terbukti tidak. Kayu/plastik KERING — bahan basah menghantarkan.',
    fx(){mrc.cable.position.set(-.4,.25,1.4);mrc.cable.rotation.z=.2;
      toast('🪵 Kabel tersingkir — korban bebas dari kontak.','ok',2400);}},
   {type:'act',aid:'TELP',done:false,targets:()=>[mrc.tel],
    desc:'Panggil bantuan: telepon 119 & tim ER pabrik.',
    why:'Aktivasi bantuan SEBELUM sibuk sendirian: sebut lokasi persis, jenis insiden (sengatan listrik), kondisi korban. Ambulans yang berangkat sekarang tiba 10 menit lebih cepat.',
    fx(){toast('📞 "Insiden listrik workshop B, korban 1, tidak sadar — kirim medis!"','ok',3000);}},
   {type:'act',aid:'KORBAN',done:false,targets:()=>[mrc.body],
    desc:'Kini aman menyentuh: cek RESPONS & NAPAS korban, mulai pertolongan.',
    why:'Cek respons (panggil, tepuk), cek napas 10 detik. Tidak bernapas = mulai CPR: 30 kompresi : 2 napas, 100–120×/menit. Henti jantung listrik sering bisa kembali — jika CPR datang cepat.',
    fx(){toast('❤️ Korban bernapas lemah → posisi pemulihan, selimuti, dampingi.','ok',3200);}},
   {type:'act',aid:'LAPOR',done:false,targets:()=>[mrc.rep],
    desc:'Setelah korban tertangani: amankan area & isi FORM INSIDEN.',
    why:'Kabel terkelupas itu masih ada — korban berikutnya menunggu bila tak dilaporkan. Investigasi mencari akar: kabel tua? penyalahgunaan? tak ada inspeksi? Sistem yang diperbaiki, bukan orang yang disalahkan.',
    fx(){toast('📋 Insiden terlapor — area di-barikade, investigasi dijadwalkan.','ok',3000);sfx.big();}},
  ],()=>{say('🎉 <b>Penyelamatan tanpa korban kedua.</b> Kamu menahan naluri demi urutan yang benar: putus → pisahkan → panggil → tolong → laporkan. Hafalkan — semoga tak pernah terpakai.');
    setTimeout(()=>showWin('rescue'),2200);});

  say('VOLTA di sini, dan ini serius 🚨 Ada korban tersengat — dan ujian sesungguhnya adalah <b>menahan diri untuk TIDAK langsung menyentuhnya</b>. Putus sumber dulu. Selalu. Mulai!');
  $('#modTitle').textContent='J08·M2 — Pertolongan Korban Sengatan';
  $('#taskHead').textContent='PUTUS → PISAH → PANGGIL → TOLONG';}

MISSIONS.k3.build=buildK3;
MISSIONS.rescue.build=buildRescue;

Object.assign(REAL,{
 k3:[
  'Satu gembok satu orang satu kunci; pekerjaan tim memakai hasp multi-gembok + lock box',
  'Pilih APD berdasarkan kategori arc flash hasil studi (kal/cm²), bukan sekadar "lengkap"',
  'Uji voltage tester dengan metode live-dead-live: cek di sumber hidup → titik kerja → sumber hidup lagi',
  'Toolbox meeting & izin kerja terdokumentasi — audit K3 menelusuri kertas, bukan ingatan'],
 rescue:[
  'Ikuti pelatihan P3K & CPR bersertifikat — keterampilan tangan tak bisa dipelajari dari layar',
  'Hafalkan lokasi panel isolasi & nomor darurat di fasilitasmu SEBELUM insiden terjadi',
  'Korban sengatan wajib evaluasi medis walau tampak pulih — gangguan irama jantung bisa muncul terlambat',
  'Laporkan ke sistem manajemen K3; investigasi mencari akar sistemik, bukan kambing hitam'],
});

/* =====================================================================
   MISI 3 — BEKERJA DI KETINGGIAN
   ===================================================================== */
Object.assign(MISSIONS,{
 tinggi:{lvl:'JALUR 08 · K3 LISTRIK · MISI 3',icon:'🪜',title:'Bekerja di Ketinggian: Panjat Tower',strict:true,
  loc:'📍 Tower SUTT 150 kV · Penggantian lampu aviasi',
  story:'Lampu aviasi di puncak tower 40 meter mati — pesawat latih sering melintas, ini harus diganti hari ini. Statistik tidak berbohong: jatuh dari ketinggian adalah pembunuh nomor satu pekerja konstruksi & ketenagalistrikan. Dan hampir semua korbannya punya satu kesamaan: SEDANG tidak terkait saat jatuh.',
  goal:'Pekerjaan di puncak tower selesai dengan disiplin 100% tie-off: dari inspeksi alat, harness benar, sampai positioning di atas.',
  obj:['Izin kerja & inspeksi alat pelindung jatuh','Kenakan full body harness dengan benar','Panjat dengan 100% tie-off & bekerja dengan work positioning'],
  learn:['100% tie-off: dua lanyard berpindah bergantian — SELALU ada minimal satu yang terkait, tanpa jeda sedetik pun','Harness diinspeksi sebelum TIAP pemakaian: jahitan, webbing, hook — alat yang pernah menahan jatuh harus pensiun','Anchor point harus di ATAS kepala & mampu menahan beban kejut (minimal 15 kN) — bukan sekadar tempat nyantol','Alat kerja diikat (tool lanyard): kunci 0,5 kg yang jatuh 40 meter tiba di bawah seperti peluru'],
  next:['Pelajari perhitungan fall clearance: jarak aman di bawah pekerja','Dalami rencana penyelamatan: korban menggantung wajib diturunkan < 15 menit (suspension trauma)','Sertifikasi TKBT/TKPK — bekerja di ketinggian wajib kompetensi resmi']},
});
let mti={};
function buildTinggi(){
  freshScene(0x9fc0dc,0x12202e);
  cam={theta:.1,phi:1.05,r:12,target:new THREE.Vector3(0,4,-1)};
  const ground=boxT(24,.1,16,TEX.gravel());ground.position.y=-.05;scene.add(ground);
  /* tower */
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(o=>{
    const kaki=boxT(.18,9,.18,TEX.metal(),{metalness:.5});
    kaki.position.set(o[0]*(1.2),4.5,-2+o[1]*1.2);kaki.rotation.z=o[0]*-.04;scene.add(kaki);});
  [2,4,6,8].forEach(y=>{
    const palang=boxT(2.6,.12,.12,TEX.metal(),{metalness:.5});palang.position.set(0,y,-.85);scene.add(palang);
    const palang2=palang.clone();palang2.position.z=-3.15;scene.add(palang2);});
  scene.add(label('TOWER SUTT · 40 m',.9).translateY(9.6).translateZ(-2));
  /* lampu aviasi mati di puncak */
  mti.lamp=new THREE.Mesh(new THREE.SphereGeometry(.16,14,12),
    new THREE.MeshStandardMaterial({color:0x553322,emissive:0x000000}));
  mti.lamp.position.set(0,9.1,-2);scene.add(mti.lamp);
  actMesh(mti.lamp,'KERJA');
  scene.add(label('LAMPU AVIASI (MATI)',.6,'#ff8d8d').translateY(8.7).translateZ(-1.8));
  /* meja alat: papan izin, harness, lanyard */
  const tbl=boxT(2.6,.08,.9,TEX.wood());tbl.position.set(-5.2,.95,1.6);scene.add(tbl);
  const tleg=boxT(.08,.95,.08,TEX.wood());tleg.position.set(-5.2,.47,1.6);scene.add(tleg);
  mti.permit=box(.5,.66,.04,0xe8e4d8);mti.permit.position.set(-6.0,1.35,1.4);scene.add(mti.permit);
  actMesh(mti.permit,'IZIN');
  scene.add(label('IZIN KERJA KETINGGIAN',.55,'#5fd4ff').translateX(-6.0).translateY(1.85).translateZ(1.4));
  mti.harness=box(.4,.5,.12,0xd87a20);mti.harness.position.set(-5.2,1.1,1.6);scene.add(mti.harness);
  actMesh(mti.harness,'CEK');
  scene.add(label('FULL BODY HARNESS',.55,'#5fd4ff').translateX(-5.2).translateY(1.7).translateZ(1.6));
  mti.lanyard=new THREE.Mesh(new THREE.TorusGeometry(.16,.04,10,22),
    new THREE.MeshStandardMaterial({color:0xd8b020,roughness:.5}));
  mti.lanyard.position.set(-4.4,1.15,1.6);scene.add(mti.lanyard);
  actMesh(mti.lanyard,'PAKAI');
  scene.add(label('DOUBLE LANYARD',.55,'#5fd4ff').translateX(-4.3).translateY(1.6).translateZ(1.6));
  /* anchor point di tower */
  mti.anchor=new THREE.Mesh(new THREE.TorusGeometry(.14,.035,10,20),
    new THREE.MeshStandardMaterial({color:0x46a06a,metalness:.5}));
  mti.anchor.position.set(0,5.2,-.85);scene.add(mti.anchor);
  actMesh(mti.anchor,'PANJAT');
  scene.add(label('ANCHOR POINT (di atas kepala)',.6,'#8df0b8').translateX(1.8).translateY(5.3).translateZ(-.8));
  startSeq([
   {type:'act',aid:'IZIN',done:false,targets:()=>[mti.permit],
    desc:'Urus IZIN KERJA ketinggian + cek cuaca (klik dokumen).',
    why:'Izin ketinggian memeriksa: kompetensi TKBT pemanjat, rencana penyelamatan, dan CUACA — angin di atas 25 km/jam atau awan petir = pekerjaan ditunda. Tower selalu bisa menunggu; nyawa tidak bisa diulang.',
    fx(){toast('📋 Izin terbit · angin 12 km/jam · cerah — GO.','ok',2600);}},
   {type:'act',aid:'CEK',done:false,targets:()=>[mti.harness],
    desc:'INSPEKSI harness & lanyard sebelum dipakai (klik harness).',
    why:'Telusuri jengkal demi jengkal: webbing tak tersayat, jahitan utuh, D-ring tak berkarat, hook mengunci mantap, absorber masih tersegel. Alat yang gagal di tanah hanya mengecewakan; yang gagal di 40 meter, membunuh.',
    fx(){toast('🔍 Webbing ✓ jahitan ✓ hook ✓ absorber tersegel ✓','ok',2600);}},
   {type:'act',aid:'PAKAI',done:false,targets:()=>[mti.lanyard],
    desc:'Kenakan harness + double lanyard dengan benar (klik lanyard).',
    why:'Tali dada sejajar dada, tali paha pas dua jari, D-ring punggung tepat di antara belikat — harness yang kendor membuat tubuh terlepas saat menggantung terbalik. Dua lanyard terpasang di sisi pinggang, siap bergantian.',
    fx(){mti.harness.material.color.setHex(0x46a06a);
      toast('🦺 Harness terpasang pas + double lanyard siap.','ok',2400);}},
   {type:'act',aid:'PANJAT',done:false,targets:()=>[mti.anchor],
    desc:'Panjat dengan 100% TIE-OFF: kaitkan lanyard ke anchor (klik anchor hijau).',
    why:'Ritme panjat yang benar: kait lanyard A di atas → naik → kait lanyard B lebih tinggi → LEPAS A → naik. Selalu ada satu yang menggenggam tower. Detik tanpa kaitan adalah detik di mana statistik mencari nama baru.',
    fx(){toast('🧗 Tie-off A → naik → tie-off B → lepas A... 40 meter dengan selamat.','ok',3000);}},
   {type:'act',aid:'KERJA',done:false,targets:()=>[mti.lamp],
    desc:'Di puncak: work positioning, alat terikat, ganti LAMPU AVIASI.',
    why:'Work positioning belt menahan tubuh agar KEDUA tangan bebas bekerja — menggantung di lanyard sambil kerja itu bukan teknik, itu kelelahan. Kunci & lampu diikat tool lanyard: di bawah ada rekan kerjamu.',
    fx(){mti.lamp.material.color.setHex(0xff3b3b);mti.lamp.material.emissive.setHex(0xff3b3b);
      mti.lamp.material.emissiveIntensity=1;
      toast('🔴 Lampu aviasi MENYALA — pesawat melihat tower lagi!','ok',3000);sfx.big();}},
  ],()=>{say('🎉 <b>Turun dengan jumlah anggota tubuh yang sama seperti saat naik — itulah definisi sukses bekerja di ketinggian.</b> 100% tie-off bukan slogan: ia kebiasaan yang menua bersamamu.');
    setTimeout(()=>showWin('tinggi'),2200);});
  say('VOLTA di sini 🪜 Hari ini musuh kita bukan listrik — tapi <b>gravitasi</b>, pembunuh nomor satu di industri ini. Satu hukum yang tak bisa ditawar: <b>100% tie-off, selalu ada satu kaitan</b>. Mulai dari izin kerja.');
  $('#modTitle').textContent='J08·M3 — Bekerja di Ketinggian';
  $('#taskHead').textContent='100% TIE-OFF, TANPA JEDA';}
MISSIONS.tinggi.build=buildTinggi;
Object.assign(REAL,{
 tinggi:[
  'Wajib sertifikat TKBT/TKPK sesuai jenis akses — bukan sekadar pernah ikut briefing',
  'Rencana penyelamatan disiapkan SEBELUM naik: korban menggantung di harness wajib turun <15 menit',
  'Harness yang pernah menahan jatuh atau melewati masa pakai pabrikan langsung dimusnahkan',
  'Area di bawah diberi barikade & rambu — kepala di bawah tidak memilih kapan kunci jatuh'],
});

/* =====================================================================
   MISI 4 — IZIN KERJA RUANG TERBATAS
   ===================================================================== */
Object.assign(MISSIONS,{
 ruang:{lvl:'JALUR 08 · K3 LISTRIK · MISI 4',icon:'🕳️',title:'Ruang Terbatas: Izin & Gas Test',strict:true,
  loc:'📍 Power house · Cable basement (ruang kabel bawah tanah)',
  story:'Kabel feeder di basement harus diperbaiki — dan basement itu adalah RUANG TERBATAS: pintu sempit, ventilasi alami nyaris nol, dan sejarah kelam di industri: mayoritas korban ruang terbatas justru para PENOLONG yang menyusul masuk tanpa prosedur. Udara yang membunuh tidak terlihat; izin kerja dan gas test-lah matanya.',
  goal:'Pekerjaan basement berjalan aman: izin khusus terbit, gas teruji 3 level, ventilasi paksa berjalan, attendant & tripod siaga.',
  obj:['Terbitkan izin kerja ruang terbatas + identifikasi bahaya','Gas test 3 level SEBELUM masuk & ventilasi paksa','Attendant + tripod siaga, komunikasi berkala selama bekerja'],
  learn:['Ruang terbatas membunuh lewat udara: kekurangan O2, gas beracun (H2S, CO), atau gas mudah terbakar — ketiganya tak terlihat','Gas test dilakukan di 3 LEVEL (atas-tengah-bawah): gas ringan berkumpul di atas, yang berat mengendap di bawah','Attendant di luar adalah hukum: ia TIDAK pernah ikut masuk — ia memanggil bantuan & menarik lewat tripod','Statistik kelam: ±60% fatality ruang terbatas adalah calon penyelamat yang masuk tanpa alat — niat baik bukan APD'],
  next:['Pelajari klasifikasi ruang terbatas & non-permit vs permit-required','Latih penyelamatan vertikal dengan tripod & full body harness','Dalami continuous gas monitoring untuk pekerjaan panjang']},
});
let mrg={};
function buildRuang(){
  freshScene(0x8a9aa8,0x10161e);
  cam={theta:.1,phi:1.1,r:8,target:new THREE.Vector3(0,1.0,-.5)};
  const floor=boxT(16,.1,11,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  /* lubang manhole + tangga */
  const rim=new THREE.Mesh(new THREE.TorusGeometry(.75,.1,10,28),
    new THREE.MeshStandardMaterial({color:0xd8b020,roughness:.5}));
  rim.rotation.x=Math.PI/2;rim.position.set(0,.12,-.6);scene.add(rim);
  const hole=cyl(.7,.7,.05,0x05080c);hole.position.set(0,.05,-.6);scene.add(hole);
  scene.add(label('MANHOLE — CABLE BASEMENT',.7,'#ffd23f').translateY(.9).translateZ(-.6));
  /* papan izin */
  mrg.permit=box(.55,.7,.05,0xe8e4d8);mrg.permit.position.set(-3.6,1.5,-2.6);scene.add(mrg.permit);
  actMesh(mrg.permit,'IZIN');
  const ptiang=cyl(.03,.03,1.5,0x666666);ptiang.position.set(-3.6,.75,-2.6);scene.add(ptiang);
  scene.add(label('IZIN RUANG TERBATAS',.6,'#5fd4ff').translateX(-3.6).translateY(2.05).translateZ(-2.6));
  /* gas detector dgn probe panjang */
  mrg.gas=box(.2,.3,.1,0xd8b020);mrg.gas.position.set(-1.8,.9,.6);scene.add(mrg.gas);
  actMesh(mrg.gas,'GAS');
  scene.add(label('GAS DETECTOR + PROBE',.55,'#5fd4ff').translateX(-1.8).translateY(1.3).translateZ(.6));
  /* blower ventilasi + ducting */
  mrg.blow=boxT(.8,.7,.6,TEX.metal(),{metalness:.35});mrg.blow.position.set(1.8,.4,.8);scene.add(mrg.blow);
  actMesh(mrg.blow,'VENT');
  const duct=cyl(.16,.16,1.8,0xd8d040,14);duct.rotation.z=.9;
  duct.position.set(.9,.45,.2);scene.add(duct);
  scene.add(label('BLOWER + DUCTING',.55,'#5fd4ff').translateX(1.8).translateY(1.0).translateZ(.8));
  /* tripod di atas manhole */
  mrg.tripod=new THREE.Group();
  [[-.55,.4],[.55,.4],[0,-.62]].forEach(o=>{
    const kaki=cyl(.035,.035,2.2,0xcc8830);
    kaki.position.set(o[0]/2,1.05,-.6+o[1]/2);kaki.rotation.z=o[0]*.4;kaki.rotation.x=-o[1]*.4;
    mrg.tripod.add(kaki);});
  const winch=box(.2,.16,.14,0x444b55);winch.position.set(0,2.1,-.6);mrg.tripod.add(winch);
  mrg.tripod.visible=false;scene.add(mrg.tripod);
  mrg.tripodBtn=box(.4,.3,.3,0xcc8830);mrg.tripodBtn.position.set(3.6,.3,-.6);scene.add(mrg.tripodBtn);
  actMesh(mrg.tripodBtn,'TRIPOD');
  scene.add(label('TRIPOD (terlipat)',.55,'#5fd4ff').translateX(3.6).translateY(.8).translateZ(-.6));
  /* attendant (figur) + radio */
  mrg.att=new THREE.Group();
  const badan=cyl(.22,.28,.9,0xd87a20);badan.position.y=.75;mrg.att.add(badan);
  const kepala=new THREE.Mesh(new THREE.SphereGeometry(.16,14,12),
    new THREE.MeshStandardMaterial({color:0xd8b090}));kepala.position.y=1.4;mrg.att.add(kepala);
  const helm=new THREE.Mesh(new THREE.SphereGeometry(.18,14,10,0,Math.PI*2,0,Math.PI/2),
    new THREE.MeshStandardMaterial({color:0xffd23f}));helm.position.y=1.46;mrg.att.add(helm);
  mrg.att.position.set(-1.4,-2,-.2);scene.add(mrg.att); /* tersembunyi dulu */
  mrg.attBtn=box(.16,.3,.1,0x141a20,{emissive:0x06303d,emissiveIntensity:.5});
  mrg.attBtn.position.set(5.0,.9,.4);scene.add(mrg.attBtn);
  actMesh(mrg.attBtn,'ATT');
  scene.add(label('RADIO ATTENDANT',.55,'#5fd4ff').translateX(5.0).translateY(1.3).translateZ(.4));
  startSeq([
   {type:'act',aid:'IZIN',done:false,targets:()=>[mrg.permit],
    desc:'Terbitkan IZIN KERJA ruang terbatas + identifikasi bahaya.',
    why:'Izin khusus ini berbeda dari izin biasa: ia mensyaratkan gas test, ventilasi, attendant, alat penyelamat, dan jalur komunikasi — SEMUA tercentang sebelum satu kaki pun turun. Basement kabel menyimpan dua hantu: O2 termakan korosi & gas dari kabel terbakar.',
    fx(){toast('📋 Izin terbit: 7 syarat wajib — belum satu pun boleh dilewati.','ok',2800);}},
   {type:'act',aid:'GAS',done:false,targets:()=>[mrg.gas],
    desc:'GAS TEST dari LUAR: ukur 3 level lewat probe (klik detector).',
    why:'Probe turun tanpa manusia: atas O2 20,9% ✓ · tengah 19,2% ⚠ · bawah 17,8% ✗ (minimum aman 19,5%). Dugaan benar: oksigen di dasar termakan oksidasi. Tanpa probe ini, korban pertama tumbang dalam dua tarikan napas — tanpa bau, tanpa peringatan.',
    fx(){toast('🧪 O2 dasar 17,8% — BELUM AMAN. Ventilasi wajib!','bad',3000);}},
   {type:'act',aid:'VENT',done:false,targets:()=>[mrg.blow],
    desc:'Jalankan VENTILASI PAKSA: blower + ducting sampai dasar.',
    why:'Udara segar dipompa ke titik TERDALAM — mendorong udara mati keluar lewat manhole. 20 menit kemudian tes ulang: 20,8% ✓ merata tiga level. Ventilasi terus berjalan selama pekerjaan: ruang yang sudah aman bisa memburuk lagi diam-diam.',
    fx(){beep(140,1.0,'sawtooth',.06);
      toast('🌬️ Purging 20 menit → tes ulang: O2 20,8% ✓ 3 level.','ok',3000);}},
   {type:'act',aid:'TRIPOD',done:false,targets:()=>[mrg.tripodBtn],
    desc:'Dirikan TRIPOD + winch di atas manhole (klik tripod).',
    why:'Pekerja masuk memakai harness yang TERHUBUNG ke winch tripod sejak sebelum turun. Bila ia tumbang di bawah, attendant memutar winch dari ATAS — penyelamatan tanpa seorang pun ikut masuk. Alat ini mengubah statistik 60% itu menjadi nol.',
    fx(){mrg.tripod.visible=true;mrg.tripodBtn.visible=false;
      toast('🔺 Tripod berdiri — jalur penyelamatan vertikal siap.','ok',2600);}},
   {type:'act',aid:'ATT',done:false,targets:()=>[mrg.attBtn],
    desc:'Tugaskan ATTENDANT & mulai pekerjaan dengan komunikasi berkala.',
    why:'Attendant berdiri di manhole dengan satu sumpah: TIDAK masuk, apa pun yang terjadi — tugasnya menghitung kepala, memanggil bantuan, memutar winch. Komunikasi tiap 5 menit; dua kali tak menjawab = penarikan. Pekerjaan kabel dimulai... dan selesai tanpa cerita seram.',
    fx(){mrg.att.position.set(-1.4,0,-.2);
      toast('🦺 Attendant siaga — pekerja turun, kabel diperbaiki AMAN.','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Ruang terbatas ditaklukkan dengan prosedur, bukan keberanian.</b> Gas diuji, udara dipaksa segar, tripod & attendant berjaga. Pulang lengkap — satu-satunya statistik yang kita rayakan.');
    setTimeout(()=>showWin('ruang'),2200);});
  say('VOLTA di sini 🕳️ Basement kabel menanti — dan ia <b>ruang terbatas</b>: pembunuh paling senyap di industri. Hafalkan urutannya: izin, gas test 3 level, ventilasi, tripod, attendant. Udara tak terlihat; prosedurlah matamu.');
  $('#modTitle').textContent='J08·M4 — Ruang Terbatas & Gas Test';
  $('#taskHead').textContent='UJI UDARA SEBELUM PERCAYA';}
MISSIONS.ruang.build=buildRuang;
Object.assign(REAL,{
 ruang:[
  'Gas detector dikalibrasi & bump test sebelum tiap pemakaian — sensor mati = kepercayaan palsu',
  'Pekerja & attendant wajib pelatihan ruang terbatas tersertifikasi, termasuk drill penyelamatan',
  'Monitoring gas KONTINU selama bekerja (bukan hanya sebelum masuk) untuk pekerjaan > 30 menit',
  'Isolasi energi ke ruang (kabel, pipa) dengan LOTO sebelum masuk — ruang terbatas + energi = ganda bahayanya'],
});

/* =====================================================================
   MISI 5 — INVESTIGASI INSIDEN & ROOT CAUSE ANALYSIS
   ===================================================================== */
Object.assign(MISSIONS,{
 rca:{lvl:'JALUR 08 · K3 LISTRIK · MISI 5',icon:'🔎',title:'Investigasi Insiden: Root Cause Analysis',strict:false,
  loc:'📍 Workshop industri · H+1 near-miss panel terbakar',
  story:'Kemarin sore: percikan api di panel distribusi workshop — teknisi sempat menjauh dua detik sebelum busur kecil menyambar. Tak ada korban, panel rusak ringan. Setengah pabrik bilang "untung", lalu ingin lanjut bekerja. Kamu bilang: near-miss adalah fatality yang datang latihan. Hari ini kamu memimpin investigasinya — mencari akar, bukan kambing hitam.',
  goal:'Akar masalah ditemukan lewat 5-Why yang jujur (bukan berhenti di "human error"), dan tindakan perbaikan sistemik terbit & terjadwal.',
  obj:['Amankan TKP & kumpulkan bukti fisik','Wawancara saksi tanpa menghakimi','Bangun 5-Why sampai akar sistemik & terbitkan tindakan'],
  learn:['Near-miss adalah hadiah: data fatality tanpa air mata — pabrik yang menyia-nyiakannya sedang menabung tragedi','Bukti fisik dikumpulkan SEBELUM cerita: foto, posisi, label, suhu — ingatan manusia menulis ulang dirinya tiap kali diceritakan','5-Why berhenti di "human error" = investigasi gagal: manusia keliru itu gejala; sistem yang membiarkan keliru itu akar','Tindakan perbaikan berkasta: eliminasi/engineering di atas, administratif & APD di bawah — poster keselamatan bukan jawaban untuk terminal kendor'],
  next:['Pelajari metode fishbone & fault tree untuk insiden kompleks','Bangun sistem pelaporan near-miss tanpa-sanksi (just culture)','Dalami hierarchy of control dalam menyusun tindakan']},
});
let mra={};
function buildRCA(){
  freshScene(0xb8c6d4,0x141d28);
  cam={theta:.05,phi:1.18,r:7.5,target:new THREE.Vector3(0,1.6,-.8)};
  const Z=room(0x5a5f66,0xccd4cf);
  /* panel terbakar + garis kuning */
  mra.panel=boxT(1.4,2.0,.35,TEX.metal(),{metalness:.3});mra.panel.position.set(-3.2,1.1,Z-.05);scene.add(mra.panel);
  const gosong=box(.5,.6,.05,0x1a1410);gosong.position.set(-3.4,1.3,Z+.14);scene.add(gosong);
  actMesh(mra.panel,'TKP');
  scene.add(label('PANEL — TKP (digaris)',.65,'#ffd23f').translateX(-3.2).translateY(2.4).translateZ(Z+.1));
  const garis=boxT(2.4,.04,1.6,TEX.hazard());garis.position.set(-3.2,.05,-1.6);scene.add(garis);
  /* kamera bukti */
  mra.cam=box(.26,.18,.16,0x18242f);mra.cam.position.set(-1.2,1.0,.4);scene.add(mra.cam);
  actMesh(mra.cam,'BUKTI');
  const tbl=boxT(1.0,.07,.6,TEX.wood());tbl.position.set(-1.2,.9,.4);scene.add(tbl);
  const tleg=boxT(.08,.9,.08,TEX.wood());tleg.position.set(-1.2,.45,.4);scene.add(tleg);
  scene.add(label('KAMERA + LABEL BUKTI',.55,'#5fd4ff').translateX(-1.2).translateY(1.35).translateZ(.4));
  /* kursi wawancara */
  mra.kursi=box(.5,.5,.5,0x6b4f33);mra.kursi.position.set(1.2,.3,.8);scene.add(mra.kursi);
  actMesh(mra.kursi,'SAKSI');
  scene.add(label('RUANG WAWANCARA',.55,'#5fd4ff').translateX(1.2).translateY(.95).translateZ(.8));
  /* papan 5-why */
  const frame=boxT(3.6,2.2,.16,TEX.metal(),{metalness:.4});frame.position.set(2.6,2.4,Z+.05);scene.add(frame);
  frame.add(label('PAPAN 5-WHY',.8).translateY(1.35));
  mra.D=makeDisplay(3.3,1.9,520,310);
  mra.D.mesh.position.set(2.6,2.4,Z+.15);scene.add(mra.D.mesh);
  actMesh(mra.D.mesh,'WHY');
  function papan(n){
    const g=mra.D.g,W=520,H=310;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='600 15px Consolas';g.textAlign='left';
    const why=[['1. Kenapa busur api?','→ terminal feeder kendor & panas','#eaf2fb'],
      ['2. Kenapa kendor?','→ tak pernah re-torque sejak pasang','#eaf2fb'],
      ['3. Kenapa tak pernah?','→ tidak ada di jadwal pemeliharaan','#ffd23f'],
      ['4. Kenapa tak ada?','→ checklist panel tak memuat torsi','#ffd23f'],
      ['5. Kenapa tak memuat?','→ standar pemeliharaan tak pernah direview sejak 2019','#ff8d3a']];
    g.fillStyle='#5fd4ff';g.font='700 17px Consolas';
    g.fillText('NEAR-MISS: busur api panel WS-2',14,30);
    for(let i=0;i<n&&i<5;i++){
      g.fillStyle='#8aa3bd';g.font='600 15px Consolas';g.fillText(why[i][0],14,70+i*46);
      g.fillStyle=why[i][2];g.fillText(why[i][1],190,70+i*46);}
    if(n>=5){g.fillStyle='#46ff8e';g.font='700 16px Consolas';
      g.fillText('AKAR SISTEMIK: standar har usang — bukan "teknisi ceroboh"',14,H-16);}
    mra.D.tex.needsUpdate=true;}
  papan(0);
  /* papan tindakan */
  mra.act=box(.6,.7,.05,0xe8e4d8);mra.act.position.set(5.6,2.2,Z+.06);scene.add(mra.act);
  actMesh(mra.act,'AKSI');
  scene.add(label('TINDAKAN PERBAIKAN',.55,'#5fd4ff').translateX(5.6).translateY(2.75).translateZ(Z+.1));
  startSeq([
   {type:'act',aid:'TKP',done:false,targets:()=>[mra.panel],
    desc:'Amankan TKP: panel digaris, jangan ada yang "merapikan" (klik panel).',
    why:'Musuh pertama investigasi adalah niat baik: orang ingin membersihkan, memperbaiki, melanjutkan kerja. TKP dibekukan — posisi breaker, jejak jelaga, bau isolasi: semuanya adalah kalimat dalam cerita yang belum dibaca.',
    fx(){toast('🚧 TKP terkunci — tak ada yang berubah sebelum didokumentasi.','ok',2800);}},
   {type:'act',aid:'BUKTI',done:false,targets:()=>[mra.cam],
    desc:'Kumpulkan BUKTI FISIK: foto, label, ukur (klik kamera).',
    why:'Foto menyeluruh→detail, terminal gosong dilabel & difoto makro: tampak jelas baut feeder hanya menggigit setengah ulir, isolasi sekitarnya menua kecoklatan — kepanasan BERBULAN-bulan, bukan kemarin sore. Bukti sudah bercerita sebelum satu saksi pun bicara.',
    fx(){toast('📸 24 foto + 3 bukti dilabel: baut setengah ulir, isolasi menua.','ok',2800);}},
   {type:'act',aid:'SAKSI',done:false,targets:()=>[mra.kursi],
    desc:'WAWANCARA teknisi & saksi — tanpa nada menghakimi (klik kursi).',
    why:'Kalimat pembuka menentukan segalanya: "Kami mencari celah sistem, bukan kesalahanmu." Teknisi pun bercerita jujur: panel itu memang tak pernah masuk jadwal torsi; ia hanya membuka tutup saat menambah beban feeder bulan lalu. Saksi yang merasa aman = data yang jujur.',
    fx(){toast('🗣️ Kesaksian jujur terkumpul — cocok dengan bukti fisik.','ok',2800);}},
   {type:'act',aid:'WHY',done:false,targets:()=>[mra.D.mesh],
    desc:'Bangun rantai 5-WHY — dan JANGAN berhenti di manusia (klik papan).',
    why:'Why 1-2 masih teknis (terminal kendor, tak di-re-torque). Godaan berhenti di why-3 dengan stempel "kelalaian teknisi" — tapi terus gali: jadwal tak memuatnya, checklist tak mencantumkan torsi, dan standar pemeliharaan tak pernah direview sejak 2019. Akar sejati: SISTEM yang menua, bukan tangan yang lalai.',
    fx(){papan(5);toast('🎯 Akar: standar har usang sejak 2019 — sistemik, bukan personal.','ok',3200);}},
   {type:'act',aid:'AKSI',done:false,targets:()=>[mra.act],
    desc:'Terbitkan TINDAKAN berkasta hierarchy of control (klik papan aksi).',
    why:'Dari kasta tertinggi: (1) engineering — re-torque seluruh panel + thermovision tahunan masuk jadwal; (2) administratif — review standar har per 2 tahun, checklist memuat nilai torsi; (3) pelaporan near-miss tanpa sanksi diresmikan. Teknisi kemarin? Diberi apresiasi karena melapor. Begitulah budaya keselamatan dibangun.',
    fx(){toast('📋 5 tindakan terbit & terjadwal — near-miss jadi guru, bukan aib.','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Investigasi kelas dunia!</b> TKP beku, bukti bicara, saksi jujur, 5-Why menembus sampai standar yang usang. Near-miss kemarin baru saja menyelamatkan seseorang lima tahun dari sekarang — dan dia tak akan pernah tahu.');
    setTimeout(()=>showWin('rca'),2200);});
  say('VOLTA di sini 🔎 Kemarin pabrik ini beruntung; hari ini kita pastikan tak butuh keberuntungan lagi. Satu aturan investigasi: <b>cari akar sistemik, bukan kambing hitam</b> — dan jangan pernah berhenti di "human error". Mulai dari TKP.');
  $('#modTitle').textContent='J08·M5 — Investigasi & RCA';
  $('#taskHead').textContent='AKAR, BUKAN KAMBING HITAM';}
MISSIONS.rca.build=buildRCA;
Object.assign(REAL,{
 rca:[
  'Investigasi dimulai < 24 jam — TKP & ingatan saksi terdegradasi per jam',
  'Pisahkan wawancara tiap saksi & hindari pertanyaan menggiring — kesaksian saling mencemari itu nyata',
  'Tindakan perbaikan diberi penanggung jawab + tenggat + verifikasi efektivitas (bukan sekadar "sudah dibuat")',
  'Bagikan pembelajaran lintas departemen tanpa menyebut nama — pelajaran menyebar, aib tidak'],
});

/* =====================================================================
   MISI 6 — HOT WORK: IZIN KERJA PANAS
   ===================================================================== */
Object.assign(MISSIONS,{
 panas:{lvl:'JALUR 08 · K3 LISTRIK · MISI 6',icon:'🔥',title:'Hot Work: Izin Kerja Panas',strict:true,
  loc:'📍 Gudang bahan kimia · Perbaikan rak butuh pengelasan',
  story:'Rak baja di gudang bahan kimia patah dan harus dilas HARI INI — di ruangan yang sama dengan drum pelarut mudah terbakar. Pengelasan menyemburkan percikan 1000°C sejauh meteran; statistik kebakaran industri menempatkan hot work di urutan teratas penyebabnya. Antara tukang las dan bencana, hanya ada satu lembar kertas yang bekerja: izin kerja panas.',
  goal:'Pengelasan tuntas tanpa satu percikan pun menjadi api: area disterilkan, gas diuji, fire watch berjaga sampai 30 menit SETELAH pekerjaan selesai.',
  obj:['Terbitkan izin kerja panas & sterilkan radius percikan','Gas test area & siapkan proteksi api','Las dengan fire watch, dan jaga 30 menit setelahnya'],
  learn:['Percikan las terbang sejauh 10+ meter dan menyusup ke celah — radius disterilkan dari bahan terbakar, yang tak bisa dipindah DITUTUP selimut api','Gas test sebelum & SELAMA kerja di area berpotensi uap: pelarut menguap tak terlihat, dan busur las adalah pemantik sempurna','Fire watch adalah jabatan, bukan formalitas: satu orang, satu APAR, satu tugas — menonton percikan, BUKAN membantu mengelas','Aturan 30 menit: mayoritas kebakaran hot work menyala SETELAH tukang las pulang — bara mengintip di celah, menunggu sepi'],
  next:['Pelajari klasifikasi area & jarak aman hot work per jenis pekerjaan','Dalami alternatif dingin: sambungan mekanik saat las terlalu berisiko','Integrasikan izin panas dengan sistem izin kerja terpadu (PTW)']},
});
let mhw={};
function buildPanas(){
  freshScene(0xb8c6d4,0x141d28);
  cam={theta:.1,phi:1.17,r:7.5,target:new THREE.Vector3(0,1.5,-.8)};
  const Z=room(0x5a5f66,0xccd4cf,16,11);
  /* rak patah */
  mhw.rak=boxT(2.2,2.2,.5,TEX.metal(),{metalness:.5});mhw.rak.position.set(2.6,1.2,-2.2);scene.add(mhw.rak);
  const patah=box(.7,.1,.45,0x8a939e);patah.position.set(2.2,1.0,-1.9);patah.rotation.z=.4;scene.add(patah);
  scene.add(label('RAK PATAH — perlu las',.65,'#ffd23f').translateX(2.6).translateY(2.7).translateZ(-2.2));
  /* drum pelarut */
  mhw.drums=[];
  [[-1.2,-1.6],[-.4,-2.2],[-1.8,-2.4]].forEach(o=>{
    const d=cyl(.32,.32,.8,0xd83a3a);d.position.set(o[0],.45,o[1]);scene.add(d);mhw.drums.push(d);});
  actMesh(mhw.drums[0],'STERIL');
  scene.add(label('DRUM PELARUT ⚠ MUDAH TERBAKAR',.65,'#ff8d8d').translateX(-1.2).translateY(1.4).translateZ(-2.0));
  /* papan izin */
  mhw.permit=box(.55,.7,.05,0xffd8c0);mhw.permit.position.set(-4.6,1.6,Z+.06);scene.add(mhw.permit);
  actMesh(mhw.permit,'IZIN');
  scene.add(label('IZIN KERJA PANAS',.6,'#ff9d6a').translateX(-4.6).translateY(2.15).translateZ(Z+.1));
  /* gas detector + selimut api + APAR */
  mhw.gas=box(.2,.3,.1,0xd8b020);mhw.gas.position.set(-3.0,1.0,.6);scene.add(mhw.gas);
  actMesh(mhw.gas,'GAS');
  const tbl=boxT(.9,.07,.6,TEX.wood());tbl.position.set(-3.0,.92,.6);scene.add(tbl);
  const tleg=boxT(.07,.92,.07,TEX.wood());tleg.position.set(-3.0,.46,.6);scene.add(tleg);
  scene.add(label('GAS DETECTOR',.55,'#5fd4ff').translateX(-3.0).translateY(1.35).translateZ(.6));
  mhw.blanket=box(.8,.06,.8,0x8a6a3a);mhw.blanket.position.set(.6,.5,-.2);scene.add(mhw.blanket);
  scene.add(label('FIRE BLANKET',.5,'#5fd4ff').translateX(.6).translateY(.85).translateZ(-.2));
  /* fire watch + APAR */
  mhw.fw=new THREE.Group();
  const badan=cyl(.22,.28,.9,0xd83a3a);badan.position.y=.72;mhw.fw.add(badan);
  const kepala=new THREE.Mesh(new THREE.SphereGeometry(.15,14,12),
    new THREE.MeshStandardMaterial({color:0xd8b090}));kepala.position.y=1.36;mhw.fw.add(kepala);
  const helm2=new THREE.Mesh(new THREE.SphereGeometry(.17,14,10,0,Math.PI*2,0,Math.PI/2),
    new THREE.MeshStandardMaterial({color:0xd83a3a}));helm2.position.y=1.42;mhw.fw.add(helm2);
  mhw.fw.position.set(4.4,-2.5,-.6);scene.add(mhw.fw); /* tersembunyi */
  mhw.fwBtn=cyl(.12,.14,.5,0xd83a3a);mhw.fwBtn.position.set(4.6,.3,.6);scene.add(mhw.fwBtn);
  actMesh(mhw.fwBtn,'WATCH');
  scene.add(label('APAR + FIRE WATCH',.6,'#5fd4ff').translateX(4.6).translateY(.85).translateZ(.6));
  /* timer 30 menit */
  mhw.D=makeDisplay(1.1,.55,280,140);
  mhw.D.mesh.position.set(4.6,2.3,Z+.1);scene.add(mhw.D.mesh);
  dispText(mhw.D,['PASCA-LAS','—'],['#7d8f84','#7d8f84']);
  actMesh(mhw.D.mesh,'JAGA');
  mhw.las=false;mhw.t30=0;
  moduleTick=(dt,T)=>{
    if(mhw.las){spark(new THREE.Vector3(2.2+Math.random()*.3,1.1,-1.9),0xffd23f);
      if(Math.random()<.05)beep(2000+Math.random()*800,.03,'square',.03);}
    if(mhw.t30>0){mhw.t30-=dt;
      dispText(mhw.D,['PASCA-LAS',Math.max(0,mhw.t30).toFixed(0)+' dtk tersisa'],
        [mhw.t30<=0?'#46ff8e':'#ffd23f','#8aa3bd']);}};
  startSeq([
   {type:'act',aid:'IZIN',done:false,targets:()=>[mhw.permit],
    desc:'Terbitkan IZIN KERJA PANAS — nilai dulu: haruskah dilas DI SINI? (klik izin)',
    why:'Pertanyaan pertama izin panas selalu: bisakah pekerjaan dipindah/diganti metode dingin? Rak tak bisa dipindah, sambungan baut tak memenuhi beban — las disetujui DENGAN syarat berlapis. Izin yang baik dimulai dari mempertanyakan pekerjaannya sendiri.',
    fx(){toast('📋 Izin terbit bersyarat: sterilkan, gas test, fire watch, +30 menit.','ok',3000);}},
   {type:'act',aid:'STERIL',done:false,targets:()=>[mhw.drums[0]],
    desc:'STERILKAN radius 10 m: pindahkan drum, tutup yang tak bisa pindah (klik drum).',
    why:'Tiga drum pelarut digulingkan keluar ruangan; saluran kabel di lantai (celah favorit percikan!) ditutup fire blanket; lantai disapu dari debu & kardus. Percikan 1000°C tak bisa dilarang terbang — tapi bisa dipastikan mendarat di tempat yang tak menjawab.',
    fx(){mhw.drums.forEach(d=>d.position.x-=6);
      toast('🧹 Radius steril: drum keluar, celah tertutup blanket.','ok',3000);}},
   {type:'act',aid:'GAS',done:false,targets:()=>[mhw.gas],
    desc:'GAS TEST area sebelum menyalakan apa pun (klik detector).',
    why:'Uap pelarut bisa bertahan setelah drumnya pergi: detector menyapu lantai (uap pelarut lebih berat dari udara) — 0% LEL ✓. Monitoring menyala TERUS selama pengelasan: pintu gudang yang terbuka bisa mengundang uap kembali tanpa permisi.',
    fx(){toast('🧪 0% LEL ✓ — monitor kontinu menyala selama kerja.','ok',2800);}},
   {type:'act',aid:'WATCH',done:false,targets:()=>[mhw.fwBtn],
    desc:'Tugaskan FIRE WATCH ber-APAR, lalu LAS dimulai (klik APAR).',
    why:'Satu orang, satu APAR teruji, satu tugas tunggal: mata mengikuti tiap percikan jatuh. Ia BUKAN asisten tukang las — ia tidak memegang apa pun selain APAR. Busur menyala... percikan berhamburan... dan setiap satunya ditonton sampai padam.',
    fx(){mhw.fw.position.set(4.4,0,-.6);mhw.las=true;
      toast('🔥 Las berjalan — fire watch tak berkedip.','ok',3000);}},
   {type:'act',aid:'JAGA',done:false,targets:()=>[mhw.D.mesh],
    desc:'Las selesai — mulai JAGA 30 MENIT pasca-kerja (klik timer).',
    why:'Tukang las membereskan alat... fire watch TETAP di tempat: mayoritas kebakaran hot work menyala justru di babak ini — bara kecil di celah menunggu ruangan sepi. Tiga puluh menit kemudian: inspeksi akhir dengan punggung tangan & termal, nol titik panas. Izin ditutup resmi.',
    fx(){mhw.las=false;mhw.t30=30; /* dipersingkat utk simulasi */
      toast('⏱️ Jaga pasca-las berjalan… inspeksi akhir: NOL titik panas ✓','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Pengelasan paling membosankan tahun ini — alias sempurna!</b> Area steril, gas nol, fire watch setia, dan 30 menit kesabaran terakhir. Kebakaran hot work tidak dicegah oleh keberuntungan; ia dicegah oleh kertas izin yang dipatuhi.');
    setTimeout(()=>showWin('panas'),2200);});
  say('VOLTA di sini 🔥 Pengelasan di gudang bahan kimia — kombinasi yang menulis banyak berita buruk. Pemutus rantainya satu lembar: <b>izin kerja panas</b>, dengan pasal paling sering dilupakan: 30 menit SETELAH selesai. Mulai!');
  $('#modTitle').textContent='J08·M6 — Izin Kerja Panas';
  $('#taskHead').textContent='STERIL · GAS · WATCH · +30 MENIT';}
MISSIONS.panas.build=buildPanas;
Object.assign(REAL,{
 panas:[
  'Radius aman & durasi jaga pasca-kerja mengikuti standar/asuransi setempat (umum: 10-11 m, 30-60 menit)',
  'Selalu uji alternatif dingin dulu — izin panas terbaik adalah yang tidak perlu diterbitkan',
  'Fire watch dilatih menggunakan APAR & tahu jalur alarm — bukan sekadar orang yang kebetulan kosong',
  'Di area proses aktif: gas test KONTINU dengan alarm, bukan sekali di awal'],
});

/* =====================================================================
   MISI 7 — CSMS: MENGELOLA KESELAMATAN KONTRAKTOR
   ===================================================================== */
Object.assign(MISSIONS,{
 csms:{lvl:'JALUR 08 · K3 LISTRIK · MISI 7',icon:'📑',title:'CSMS: Mengelola Keselamatan Kontraktor',strict:false,
  loc:'📍 Plant · Proyek overhaul: 80 pekerja kontraktor masuk',
  story:'Overhaul tahunan tiba — dan bersama 80 pekerja dari 5 kontraktor yang tak kamu kenal satu pun. Statistik industri jujur tapi kejam: mayoritas kecelakaan fatal menimpa PEKERJA KONTRAKTOR, bukan karyawan tetap. Mereka tak hafal plant-mu, budayanya beragam, dan tekanannya jadwal. CSMS — contractor safety management system — adalah cara membuat 80 orang asing pulang selamat.',
  goal:'Proyek overhaul berjalan dengan CSMS penuh: kontraktor terprakualifikasi, semua ter-induksi, pekerjaan diawasi berbasis risiko, dan evaluasi akhir menjadi seleksi masa depan.',
  obj:['Prakualifikasi: seleksi kontraktor dari rekam K3','Safety induction & verifikasi kompetensi semua pekerja','Pengawasan berbasis risiko & evaluasi akhir'],
  learn:['CSMS punya siklus penuh: prakualifikasi → seleksi → pra-pekerjaan → pengawasan → evaluasi — kecelakaan kontraktor biasanya lahir dari tahap yang dilompati','Prakualifikasi menyaring DI ATAS KERTAS dulu: statistik kecelakaan, sertifikat tenaga ahli, sistem K3 — harga termurah dari kontraktor buruk K3 adalah harga termahal proyekmu','Induction bukan formalitas tanda tangan: pekerja harus TAHU bahaya spesifik plant-mu (jalur uap, area HV) — diuji, bukan diabsen','Pengawasan dialokasikan berbasis risiko: pekerjaan panas & ketinggian diawasi rapat; evaluasi akhir menentukan siapa boleh kembali tahun depan'],
  next:['Pelajari permit-to-work terpadu untuk multi-kontraktor serentak','Dalami leading indicators: observasi & near-miss kontraktor','Bangun program penghargaan K3 kontraktor — wortel selain tongkat']},
});
let mcs={};
function buildCSMS(){
  freshScene(0xb8c6d4,0x141d28);
  cam={theta:.05,phi:1.17,r:8,target:new THREE.Vector3(0,1.6,-.8)};
  const Z=room(0x5a5f66,0xccd4cf,16,11);
  /* meja prakualifikasi dgn 5 map */
  const desk=boxT(2.8,.08,1.2,TEX.wood());desk.position.set(-4.0,1.0,-.6);scene.add(desk);
  [[-1.2,-.9],[1.2,-.9],[-1.2,.1],[1.2,.1]].forEach(p=>{
    const l=boxT(.08,1,.08,TEX.wood());l.position.set(-4.0+p[0],.5,p[1]-.6+.45);scene.add(l);});
  mcs.maps=[];
  for(let i=0;i<5;i++){const m=box(.34,.05,.46,[0x2a5a8a,0x5a8a2a,0x8a5a2a,0x8a2a2a,0x5a5a8a][i]);
    m.position.set(-5.0+i*.5,1.07,-.6);scene.add(m);mcs.maps.push(m);}
  actMesh(mcs.maps[3],'PRAKUAL');
  scene.add(label('5 BERKAS PRAKUALIFIKASI',.6,'#5fd4ff').translateX(-4.0).translateY(1.5).translateZ(-.6));
  /* ruang induction */
  const layar=boxT(2.0,1.3,.12,TEX.metal(),{metalness:.4});layar.position.set(-.6,2.2,Z+.06);scene.add(layar);
  mcs.ind=makeDisplay(1.8,1.1,400,240);
  mcs.ind.mesh.position.set(-.6,2.2,Z+.14);scene.add(mcs.ind.mesh);
  dispText(mcs.ind,['SAFETY INDUCTION','80 pekerja · 5 sesi'],['#5fd4ff','#8aa3bd']);
  actMesh(mcs.ind.mesh,'INDUKSI');
  scene.add(label('RUANG INDUCTION',.65,'#5fd4ff').translateX(-.6).translateY(3.0).translateZ(Z+.1));
  /* area kerja dgn pengawas */
  mcs.area=boxT(2.2,.04,1.8,TEX.hazard());mcs.area.position.set(2.8,.05,-1.2);scene.add(mcs.area);
  actMesh(mcs.area,'AWASI');
  scene.add(label('AREA KERJA RISIKO TINGGI',.6,'#ffd23f').translateX(2.8).translateY(.6).translateZ(-1.2));
  /* papan skor evaluasi */
  mcs.eval=box(.6,.75,.05,0xe8e4d8);mcs.eval.position.set(5.2,2.0,Z+.06);scene.add(mcs.eval);
  actMesh(mcs.eval,'EVAL');
  scene.add(label('SCORECARD KONTRAKTOR',.6,'#5fd4ff').translateX(5.2).translateY(2.6).translateZ(Z+.1));
  startSeq([
   {type:'act',aid:'PRAKUAL',done:false,targets:()=>[mcs.maps[3]],
    desc:'PRAKUALIFIKASI: bedah 5 berkas — satu berkas merah (klik berkas merah).',
    why:'Empat kontraktor lolos ambang skor. Berkas merah: harga termurah, tapi dua fatality dalam tiga tahun & tak punya petugas K3 tetap. Keputusan tegas: GUGUR — dan inilah pasal CSMS yang paling sering ditawar pengadaan: kontraktor murah ber-K3 buruk adalah utang berbunga nyawa.',
    fx(){toast('📑 4 lolos · 1 gugur (2 fatality/3 thn) — murah ≠ layak.','bad',3200);}},
   {type:'act',aid:'INDUKSI',done:false,targets:()=>[mcs.ind.mesh],
    desc:'SAFETY INDUCTION 80 pekerja + UJI pemahaman (klik layar).',
    why:'Lima sesi: bahaya spesifik plant (jalur uap, ruang HV, zona LOTO), aturan emas, jalur darurat — ditutup KUIS: yang di bawah nilai ambang mengulang, bukan diloloskan. Tujuh orang mengulang sesi sore; kedelapan puluh orang kini tahu plant ini, bukan sekadar menandatangani daftar hadir.',
    fx(){dispText(mcs.ind,['80/80 LULUS UJI','7 via remedial'],['#46ff8e','#8aa3bd']);
      toast('🎓 Induction + uji: 80/80 paham bahaya spesifik plant.','ok',3000);}},
   {type:'act',aid:'AWASI',done:false,targets:()=>[mcs.area],
    desc:'Alokasikan PENGAWASAN berbasis risiko selama pekerjaan (klik area).',
    why:'Matriks sederhana: pekerjaan panas & ketinggian dapat pengawas penuh + izin harian; pekerjaan sedang dapat inspeksi acak; administrasi cukup spot check. Minggu kedua, pengawas menghentikan satu pekerjaan las tanpa fire watch — STOP, perbaiki, lanjut. Sistem yang berani berhenti adalah sistem yang hidup.',
    fx(){toast('👁️ Pengawasan berbasis risiko + 1 stop-work tereksekusi.','ok',3200);}},
   {type:'act',aid:'EVAL',done:false,targets:()=>[mcs.eval],
    desc:'Proyek tuntas: EVALUASI akhir tiap kontraktor (klik scorecard).',
    why:'Skor objektif: kepatuhan izin, temuan inspeksi, near-miss yang DILAPORKAN (melapor = nilai plus, bukan minus!), zero LTI ✓. Dua kontraktor dapat predikat prioritas tahun depan; satu dapat surat pembinaan. Evaluasi hari ini adalah prakualifikasi tahun depan — siklus menutup dirinya.',
    fx(){toast('🏆 Overhaul 38 hari · 80 pekerja · ZERO LTI — siklus CSMS penuh!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>80 orang asing pulang selamat semua!</b> Disaring di kertas, dididik sampai paham, diawasi sesuai risiko, dievaluasi untuk masa depan. CSMS: keselamatan yang tak membeda-bedakan logo di seragam.');
    setTimeout(()=>showWin('csms'),2200);});
  say('VOLTA di sini 📑 Overhaul membawa <b>80 pekerja yang tak kamu kenal</b> — dan statistik kecelakaan kontraktor itu kejam. CSMS adalah jawabannya: saring, didik, awasi, evaluasi. Mulai dari lima berkas di meja!');
  $('#modTitle').textContent='J08·M7 — CSMS Kontraktor';
  $('#taskHead').textContent='ORANG ASING PULANG SELAMAT';}
MISSIONS.csms.build=buildCSMS;
Object.assign(REAL,{
 csms:[
  'Kriteria prakualifikasi & bobot K3 ditetapkan BERSAMA pengadaan sejak dokumen tender',
  'Database kinerja K3 kontraktor dipelihara lintas-proyek — ingatan organisasi mengalahkan ingatan orang',
  'Stop-work authority diberikan eksplisit ke pengawas & pekerja kontraktor tanpa takut sanksi',
  'Audit silang: K3 kontraktor diaudit, tapi fasilitas & izin milikmu juga dievaluasi mereka'],
});

/* =====================================================================
   MISI 8 — HEAT STRESS: BEKERJA DI BAWAH MATAHARI TROPIS
   ===================================================================== */
Object.assign(MISSIONS,{
 heat:{lvl:'JALUR 08 · K3 LISTRIK · MISI 8',icon:'🥵',title:'Heat Stress: Bekerja di Bawah Matahari Tropis',strict:false,
  loc:'📍 Proyek switchyard terbuka · Musim kemarau, 34°C',
  story:'Dua kejadian dalam seminggu: teknisi pusing-mual di switchyard siang, dan operator hampir pingsan di dekat boiler. Bukan kebetulan — gelombang panas + APD lengkap + kerja fisik = HEAT STRESS, bahaya yang tak terlihat di JSA klasik. Kamu diminta membangun program perlindungan panas: dari pengukuran indeks, aklimatisasi, sampai keberanian menjadwal ulang pekerjaan siang.',
  goal:'Program heat stress berjalan: indeks panas terukur & berzona, jadwal kerja-istirahat dihormati, pekerja teraklimatisasi & saling mengawasi, dan kasus minggu itu jadi nol.',
  obj:['Ukur indeks panas (WBGT) & buat zonasi kerja','Terapkan jadwal kerja-istirahat & hidrasi terstruktur','Aklimatisasi pekerja baru & latih deteksi dini gejala'],
  learn:['Tubuh mendingin lewat keringat yang MENGUAP — kelembapan tropis menggagalkannya: suhu 34°C + lembap 70% terasa & berdampak seperti 45°C','WBGT (wet bulb globe temperature) merangkum suhu+lembap+radiasi+angin jadi satu indeks berzona: hijau-kuning-merah menentukan rasio kerja:istirahat','Heat stroke adalah eskalasi cepat: pusing → berhenti berkeringat → kolaps — buddy system menangkap gejala yang korbannya sendiri tak sadari','Aklimatisasi itu fisiologis nyata: pekerja baru/habis cuti butuh 7-14 hari porsi bertahap — tubuh belajar berkeringat lebih efisien'],
  next:['Pelajari pengukuran WBGT & standar ambang per beban kerja','Integrasi prakiraan cuaca ke perencanaan kerja mingguan','Eksplorasi APD penangkal panas: cooling vest & material baru']},
});
let mht={};
function buildHeat(){
  freshScene(0xf0d8a0,0x2a2010);
  cam={theta:.1,phi:1.12,r:9,target:new THREE.Vector3(0,1.6,-.8)};
  const ground=boxT(22,.1,13,TEX.gravel());ground.position.y=-.05;scene.add(ground);
  /* matahari terik */
  const sunM=new THREE.Mesh(new THREE.SphereGeometry(.5,16,12),
    new THREE.MeshBasicMaterial({color:0xffd23f}));
  sunM.position.set(5,6.5,-4);scene.add(sunM);
  /* switchyard mini */
  [[-4,-2],[-1.5,-2],[1,-2]].forEach(o=>{
    const t=boxT(.2,3.2,.2,TEX.metal(),{metalness:.5});t.position.set(o[0],1.6,o[1]);scene.add(t);});
  scene.add(label('SWITCHYARD TERBUKA · 34°C · RH 70%',.85,'#ffd23f').translateY(4.0).translateZ(-2));
  /* alat WBGT */
  mht.wbgt=box(.2,.5,.2,0xe8edf2);mht.wbgt.position.set(-2.6,1.0,.4);scene.add(mht.wbgt);
  const tri=cyl(.03,.03,1.0,0x666666);tri.position.set(-2.6,.5,.4);scene.add(tri);
  actMesh(mht.wbgt,'UKUR');
  scene.add(label('WBGT METER',.6,'#5fd4ff').translateX(-2.6).translateY(1.5).translateZ(.4));
  /* shelter istirahat + hidrasi */
  mht.shelter=boxT(2.4,.12,2.0,TEX.metal(),{metalness:.4});mht.shelter.position.set(3.6,2.0,.8);scene.add(mht.shelter);
  [[-1,-.8],[1,-.8],[-1,.8],[1,.8]].forEach(p=>{
    const t=cyl(.05,.05,2.0,0x8a8a8a);t.position.set(3.6+p[0],1.0,.8+p[1]);scene.add(t);});
  mht.galon=cyl(.18,.18,.45,0x5fd4ff,14,{transparent:true,opacity:.7});
  mht.galon.position.set(3.6,.25,.8);scene.add(mht.galon);
  actMesh(mht.galon,'JADWAL');
  scene.add(label('SHELTER + HIDRASI',.65,'#5fd4ff').translateX(3.6).translateY(2.5).translateZ(.8));
  /* pekerja baru */
  mht.baru=new THREE.Group();
  const badan=cyl(.2,.26,.85,0xd87a20);badan.position.y=.7;mht.baru.add(badan);
  const kepala=new THREE.Mesh(new THREE.SphereGeometry(.14,14,12),
    new THREE.MeshStandardMaterial({color:0xd8b090}));kepala.position.y=1.3;mht.baru.add(kepala);
  mht.baru.position.set(-5.4,0,.8);scene.add(mht.baru);
  actMesh(badan,'AKLIM');
  scene.add(label('PEKERJA BARU (hari ke-2)',.6).translateX(-5.4).translateY(1.8).translateZ(.8));
  /* papan zona */
  mht.D=makeDisplay(1.8,1.0,400,220);
  mht.D.mesh.position.set(.4,2.4,2.4);mht.D.mesh.rotation.y=Math.PI;scene.add(mht.D.mesh);
  dispText(mht.D,['ZONA PANAS','belum diukur'],['#7d8f84','#7d8f84']);
  scene.add(label('PAPAN ZONA HARIAN',.65,'#5fd4ff').translateX(.4).translateY(3.1).translateZ(2.4));
  startSeq([
   {type:'act',aid:'UKUR',done:false,targets:()=>[mht.wbgt],
    desc:'Ukur WBGT di titik kerja — bukan di kantor ber-AC (klik alat).',
    why:'WBGT switchyard jam 13: 31,2°C — untuk kerja sedang ber-APD itu ZONA MERAH: rasio kerja:istirahat wajib 25:75! Termometer biasa bilang "34, biasa saja"; WBGT yang menimbang lembap+radiasi bilang "tubuh kalian sedang dipanggang pelan-pelan". Dua kejadian minggu ini bukan kebetulan — mereka data.',
    fx(){dispText(mht.D,['WBGT 31,2 MERAH','kerja 15mnt : rehat 45'],['#ff5a5a','#ffd23f']);
      toast('🌡️ WBGT 31,2°C = zona merah — bukan hari kerja biasa.','bad',3200);}},
   {type:'act',aid:'JADWAL',done:false,targets:()=>[mht.galon],
    desc:'Terapkan JADWAL kerja-istirahat + hidrasi terstruktur (klik galon).',
    why:'Zona merah dieksekusi: pekerjaan berat digeser ke 06:30-10:00 (PDKB pagi!), siang hanya tugas ringan dgn rotasi 15:45, shelter teduh berkipas + air & elektrolit tiap 20 menit TANPA menunggu haus — haus adalah alarm yang telat. Menjadwal ulang bukan kelemahan proyek; heat stroke-lah yang menghancurkan jadwal.',
    fx(){toast('⏰ Kerja berat → pagi · rotasi 15:45 · hidrasi per 20 mnt.','ok',3200);}},
   {type:'act',aid:'AKLIM',done:false,targets:()=>[mht.baru.children[0]],
    desc:'Lindungi yang paling rentan: AKLIMATISASI pekerja baru (klik pekerja).',
    why:'Statistik kelam heat stroke: mayoritas korban adalah pekerja MINGGU PERTAMA. Fisiologisnya nyata: tubuh butuh 7-14 hari belajar berkeringat efisien. Si baru dapat porsi 20% hari ini, naik bertahap, plus buddy senior yang mengawasi gejalanya — karena korban heat stroke tak pernah sadar dirinya sedang jadi korban.',
    fx(){toast('🌱 Aklimatisasi 20%→100% dalam 10 hari + buddy system.','ok',3200);}},
   {type:'act',aid:'LATIH',done:false,targets:()=>[mht.D.mesh],
    desc:'Tutup program: LATIH deteksi dini & respons darurat (klik papan).',
    why:'Toolbox meeting: kenali tangga gejala (pusing→mual→BERHENTI berkeringat = gawat darurat!), respons: pindah teduh, kompres dingin di leher-ketiak, panggil medis — dan budaya saling menegur "kamu pucat, istirahat". Sebulan berlalu: nol kejadian, produktivitas justru naik — tubuh yang dijaga bekerja lebih lama dari tubuh yang dipaksa.',
    fx(){toast('🎓 Tim terlatih + zona harian rutin — kasus bulan ini: NOL.','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Matahari tropis dijinakkan dengan ilmu!</b> WBGT mengukur yang termometer sembunyikan, jadwal menghormati fisiologi, dan pekerja baru dilindungi di minggu paling rawannya. Bahaya yang tak terlihat di JSA klasik kini punya programnya sendiri.');
    setTimeout(()=>showWin('heat'),2200);});
  actMesh(mht.D.mesh,'LATIH');
  say('VOLTA di sini 🥵 Dua hampir-pingsan dalam seminggu — musuhnya tak terlihat: <b>heat stress</b>. Termometer biasa berbohong di iklim lembap; WBGT yang jujur. Ukur dulu, baru jadwalkan ulang harimu!');
  $('#modTitle').textContent='J08·M8 — Heat Stress';
  $('#taskHead').textContent='HAUS ADALAH ALARM YANG TELAT';}
MISSIONS.heat.build=buildHeat;
Object.assign(REAL,{
 heat:[
  'Gunakan tabel ambang WBGT per beban kerja & koreksi APD dari standar higiene industri',
  'Sediakan pengukuran WBGT di lokasi kerja aktual — indeks dari stasiun cuaca kota bisa menipu',
  'Heat stroke = darurat medis: dinginkan agresif SAMBIL menunggu evakuasi, jangan hanya diangin-angin',
  'Catat & investigasi semua kejadian panas (termasuk ringan) — mereka peta menuju korban berikutnya'],
});
