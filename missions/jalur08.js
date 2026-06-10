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
