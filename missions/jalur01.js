/* =====================================================================
   ElectraSim VR 3D — INSTALASI BANGUNAN
   Misi: M1 rumah (Instalasi Listrik Rumah) · M2 phb (Panel Hubung Bagi & Proteksi RCD)
   Dimuat on-demand oleh index.html lewat ensureMission().
   ===================================================================== */

Object.assign(MISSIONS,{
 rumah:{lvl:'JALUR 01 · INSTALASI BANGUNAN',icon:'🏠',title:'Instalasi Listrik Rumah',strict:false,
  loc:'📍 Rumah Pak Dadang · Griya Indah, Indramayu',
  story:'Pak Dadang baru selesai membangun rumah — dinding sudah dicat tapi listrik masih kosong. Kamu instalatirnya: pasang rangkaian penerangan & kotak-kontak sesuai PUIL.',
  goal:'Lampu menyala dikendalikan saklar & stop kontak bertegangan dengan grounding aman.',
  obj:['Jalur fasa: PLN → MCB → saklar → lampu','Netral & grounding sesuai kode warna','Uji nyala lampu & tes tegangan stop kontak'],
  learn:['Saklar memutus jalur FASA, bukan netral (PUIL)','MCB pengaman pertama — semua fasa wajib melewatinya','Kode warna: merah=fasa, biru=netral, kuning-hijau=grounding','Grounding membuang arus bocor agar manusia tak tersengat'],
  next:['Lanjut Jalur 03: pasang APP/kWh meter pelanggan','Pelajari pembagian grup MCB rumah berbeban banyak','Baca diagram satu garis instalasi gedung']},
 phb:{lvl:'JALUR 01 · INSTALASI BANGUNAN · MISI 2',icon:'🗄️',title:'Panel Hubung Bagi & Proteksi RCD',strict:false,
  loc:'📍 Rumah 2 lantai · Upgrade panel, Indramayu',
  story:'Setelah instalasi dasar, kini naik kelas: rumah 2 lantai butuh Panel Hubung Bagi (PHB) dengan pembagian grup dan satu penjaga nyawa bernama RCD/ELCB 30 mA — perangkat yang merasakan arus bocor sekecil 30 per seribu ampere dan memutus sebelum jantung manusia sempat terganggu.',
  goal:'PHB terangkai: MCB utama → RCD → dua grup beban, lalu RCD terbukti trip saat tombol TEST ditekan.',
  obj:['Rangkai jalur utama: masuk → MCB utama → RCD 30mA','Bagi beban ke Grup 1 (penerangan) & Grup 2 (stop kontak)','Uji fungsi RCD dengan tombol TEST, lalu reset'],
  learn:['Pembagian grup membatasi dampak gangguan: satu grup trip, grup lain tetap menyala','RCD 30 mA memutus dalam <40 ms — di bawah ambang fibrilasi jantung','RCD merasakan SELISIH arus fasa vs netral; selisih = ada arus bocor (mungkin lewat tubuh manusia!)','Tombol TEST menyuntik arus bocor buatan — uji bulanan adalah ritual wajib'],
  next:['Pelajari selektivitas: koordinasi rating MCB utama vs grup','Dalami RCBO (MCB+RCD jadi satu) per sirkit','Rancang PHB 3 fasa untuk rumah dengan daya besar']},
});

/* =====================================================================
   MISI 1 — RUMAH (Jalur 01)
   ===================================================================== */
let m1={};
function buildRumah(){
  freshScene(0x9fb8d0,0x121e2c);
  cam={theta:0,phi:1.18,r:6.4,target:new THREE.Vector3(0,2,-1)};
  const Z=room(0x6b5a45,0xcfd8d2);
  const skirt=box(11,.25,.18,0x3d4a55);skirt.position.set(0,.12,-2.96);scene.add(skirt);

  const src=box(1.15,.95,.18,COL.dark);src.position.set(-3.6,3.0,Z);scene.add(src);
  src.add(label('SUMBER PLN',.85).translateY(.72));
  terminal('PLN-F','fasa',-3.95,2.62,Z+.12);
  terminal('PLN-N','netral',-3.6,2.62,Z+.12);
  terminal('PLN-G','ground',-3.25,2.62,Z+.12);
  scene.add(label('F',.45,'#ff8d8d').translateX(-3.95).translateY(2.38).translateZ(Z+.1));
  scene.add(label('N',.45,'#9cc4ff').translateX(-3.6).translateY(2.38).translateZ(Z+.1));
  scene.add(label('G',.45,'#8df0b8').translateX(-3.25).translateY(2.38).translateZ(Z+.1));

  const mcb=box(.5,.8,.2,COL.cream);mcb.position.set(-1.9,2.95,Z);scene.add(mcb);
  mcb.add(label('MCB 6A',.7).translateY(.62));
  terminal('MCB-IN','fasa',-1.9,3.45,Z+.12);
  terminal('MCB-OUT','fasa',-1.9,2.45,Z+.12);
  scene.add(label('IN',.4).translateX(-1.55).translateY(3.45).translateZ(Z+.1));
  scene.add(label('OUT',.4).translateX(-1.5).translateY(2.45).translateZ(Z+.1));

  const sk=box(.42,.42,.16,COL.cream);sk.position.set(.2,1.7,Z);scene.add(sk);
  m1.lever=box(.14,.2,.09,0xc8d2dc);m1.lever.position.set(.2,1.7,Z+.13);scene.add(m1.lever);
  actMesh(m1.lever,'SAKLAR'); actMesh(sk,'SAKLAR');
  sk.add(label('SAKLAR',.62).translateY(.45));
  terminal('SK-IN','fasa',.2,2.12,Z+.12);
  terminal('SK-OUT','fasa',.2,1.28,Z+.12);

  const fit=cyl(.1,.14,.22,0x444444);fit.position.set(2,3.6,Z+.1);scene.add(fit);
  m1.bulbMat=new THREE.MeshStandardMaterial({color:0xfff4c2,roughness:.3,emissive:0x000000});
  m1.bulb=new THREE.Mesh(new THREE.SphereGeometry(.2,20,16),m1.bulbMat);
  m1.bulb.position.set(2,3.36,Z+.1);scene.add(m1.bulb);
  m1.light=new THREE.PointLight(0xffe9a8,0,7);m1.light.position.set(2,3.2,Z+.6);scene.add(m1.light);
  scene.add(label('LAMPU',.62).translateX(2).translateY(3.95).translateZ(Z));
  terminal('L-F','fasa',1.78,3.62,Z+.16);
  terminal('L-N','netral',2.22,3.62,Z+.16);

  const skk=box(.5,.5,.16,COL.cream);skk.position.set(3.1,1.5,Z);scene.add(skk);
  skk.add(label('STOP KONTAK',.62).translateY(.5));
  actMesh(skk,'STOPKONTAK');
  terminal('SKK-F','fasa',2.85,1.18,Z+.12);
  terminal('SKK-N','netral',3.35,1.18,Z+.12);
  terminal('SKK-G','ground',3.1,1.92,Z+.12);

  terms={};clickables.forEach(c=>{if(c.userData.kind==='terminal')terms[c.userData.id]=c;});

  startSeq([
   {type:'wire',a:'PLN-F',b:'MCB-IN',color:COL.fasa,done:false,
    desc:'Sambungkan FASA sumber PLN (merah) ke terminal IN MCB.',
    why:'MCB adalah benteng pertama instalasi: saat korsleting atau beban lebih, ia trip dan memutus arus sebelum kabel terbakar. Karena itu semua fasa wajib lewat MCB.',
    wrong:'Fasa (merah) harus masuk ke MCB dulu, jangan langsung ke beban.'},
   {type:'wire',a:'MCB-OUT',b:'SK-IN',color:COL.fasa,done:false,
    desc:'Dari OUT MCB, tarik fasa ke terminal IN SAKLAR.',
    why:'Saklar wajib memutus FASA, bukan netral (PUIL). Kalau saklar di netral: lampu mati, tapi fitting masih bertegangan — menyetrum saat ganti bohlam!'},
   {type:'wire',a:'SK-OUT',b:'L-F',color:COL.fasa,done:false,
    desc:'Dari OUT SAKLAR, sambungkan ke terminal FASA lampu (L-F).',
    why:'Inilah rangkaian kendali paling dasar: saklar menjadi gerbang fasa menuju lampu. ON = gerbang terbuka = lampu menyala.'},
   {type:'wire',a:'PLN-N',b:'L-N',color:COL.netral,done:false,
    desc:'Sambungkan NETRAL PLN (biru) langsung ke L-N lampu.',
    why:'Netral adalah jalur balik arus dan tidak boleh diputus saklar. Arus: fasa → saklar → lampu → netral → sumber. Tanpa jalur balik, rangkaian tak tertutup.',
    wrong:'Kabel biru (netral) langsung ke lampu, tanpa lewat saklar/MCB.'},
   {type:'wire',a:'MCB-OUT',b:'SKK-F',color:COL.fasa,done:false,
    desc:'Cabangkan fasa dari OUT MCB ke terminal F stop kontak.',
    why:'Stop kontak butuh fasa permanen (tanpa saklar) agar peralatan bisa dicolok kapan saja — tapi tetap dari MCB agar terlindungi.'},
   {type:'wire',a:'PLN-N',b:'SKK-N',color:COL.netral,done:false,
    desc:'Sambungkan netral PLN ke terminal N stop kontak.',
    why:'Jalur balik untuk peralatan yang dicolok — melengkapi rangkaian tertutup.'},
   {type:'wire',a:'PLN-G',b:'SKK-G',color:COL.ground,done:false,
    desc:'Terakhir: GROUNDING (kuning-hijau) PLN ke terminal G stop kontak.',
    why:'Grounding = penyelamat nyawa. Arus bocor ke bodi peralatan langsung dibuang ke tanah — bukan lewat tubuh orang yang menyentuhnya.',
    wrong:'Kabel kuning-hijau khusus grounding, hanya ke terminal G.'},
   {type:'act',aid:'SAKLAR',done:false,targets:()=>[sk],
    desc:'UJI COBA: klik SAKLAR untuk menyalakan lampu!',
    why:'Commissioning test — wiring belum selesai sebelum terbukti berfungsi.',
    fx(){m1.lever.rotation.x=-.4;
      m1.bulbMat.emissive.setHex(0xffd97a);m1.bulbMat.emissiveIntensity=1;m1.light.intensity=1.5;
      toast('💡 LAMPU MENYALA!','ok',2400);sfx.big();}},
   {type:'act',aid:'STOPKONTAK',done:false,targets:()=>[skk],
    desc:'UJI COBA: klik STOP KONTAK untuk tes tegangan dengan tespen.',
    why:'Tespen membuktikan fasa hadir di lubang yang benar & grounding tersambung.',
    fx(){toast('🔍 Tespen menyala: 220V & grounding OK ✓','ok',2400);}},
  ],()=>{say('🎉 <b>Misi tuntas!</b> Rumah Pak Dadang terang & aman sesuai PUIL.');
    setTimeout(()=>showWin('rumah'),1500);});

  say('Halo, aku <b>VOLTA</b> ⚡ Selamat datang di rumah Pak Dadang! Aturan main: <b>klik terminal asal → klik terminal tujuan</b>. Ikuti penanda kuning ▼, dan tekan <b>❓ KENAPA</b> kalau penasaran alasan teknisnya. Ayo mulai!');
  $('#modTitle').textContent='J01 — Instalasi Listrik Rumah';
  $('#taskHead').textContent='DIAGRAM PENYAMBUNGAN';}

/* =====================================================================
   MISI 18 — PHB & RCD (Jalur 01 · Misi 2) — bertekstur realistis
   ===================================================================== */
let mph={};
function buildPHB(){
  freshScene(0xa8c0d4,0x141e2a);
  cam={theta:0,phi:1.18,r:6,target:new THREE.Vector3(0,2,-1)};
  const floor=boxT(12,.1,9,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(11,4.8,.15,TEX.plaster());wall.position.set(0,2.4,-3);scene.add(wall);
  const skirt=boxT(11,.22,.18,TEX.wood());skirt.position.set(0,.11,-2.96);scene.add(skirt);
  const Z=-2.86;

  /* masuk dari kWh */
  const inb=boxT(.8,.6,.18,TEX.metal(),{metalness:.4});inb.position.set(-3.8,3.0,Z);scene.add(inb);
  inb.add(label('DARI kWh METER',.72).translateY(.5));
  terminal('IN-F','fasa',-3.95,2.62,Z+.12);
  terminal('IN-N','netral',-3.6,2.62,Z+.12);
  /* enclosure PHB */
  const enc=boxT(3.6,2.2,.3,TEX.metal(),{metalness:.35,roughness:.5});
  enc.position.set(-.4,2.4,Z-.05);scene.add(enc);
  enc.add(label('PANEL HUBUNG BAGI (PHB)',.95).translateY(1.4));
  /* MCB utama */
  const mu=box(.42,.6,.16,COL.cream);mu.position.set(-1.7,2.7,Z+.14);scene.add(mu);
  mu.add(label('MCB UTAMA 16A',.55).translateY(.48));
  terminal('MU-IN','fasa',-1.7,3.12,Z+.22);
  terminal('MU-OUT','fasa',-1.7,2.28,Z+.22);
  /* RCD */
  mph.rcd=box(.6,.65,.18,0xdfe5ea);mph.rcd.position.set(-.7,2.7,Z+.14);scene.add(mph.rcd);
  mph.rcd.add(label('RCD 30mA',.58).translateY(.5));
  mph.lever=box(.13,.2,.08,0x2255aa);mph.lever.position.set(-.82,2.7,Z+.26);
  mph.lever.rotation.x=-.3;scene.add(mph.lever);
  mph.test=cyl(.05,.05,.06,0xd8b020);mph.test.rotation.x=Math.PI/2;
  mph.test.position.set(-.55,2.62,Z+.26);scene.add(mph.test);
  actMesh(mph.test,'TEST'); actMesh(mph.rcd,'RESET');
  scene.add(label('T',.32).translateX(-.55).translateY(2.46).translateZ(Z+.22));
  terminal('RCD-IN','fasa',-.7,3.14,Z+.22);
  terminal('RCD-OUT','fasa',-.7,2.26,Z+.22);
  /* grup 1 & 2 */
  const g1=box(.4,.55,.16,COL.cream);g1.position.set(.4,2.7,Z+.14);scene.add(g1);
  g1.add(label('GRUP 1 · LAMPU',.5).translateY(.45));
  terminal('G1-IN','fasa',.4,3.1,Z+.22);
  const g2=box(.4,.55,.16,COL.cream);g2.position.set(1.0,2.7,Z+.14);scene.add(g2);
  g2.add(label('GRUP 2 · KOTAK KONTAK',.5).translateY(.45));
  terminal('G2-IN','fasa',1.0,3.1,Z+.22);
  /* busbar netral */
  const nb=box(.7,.12,.1,0x4a6ad8);nb.position.set(.7,2.05,Z+.14);scene.add(nb);
  nb.add(label('BUSBAR NETRAL',.5,'#9cc4ff').translateY(-.22));
  terminal('NBAR','netral',.7,2.05,Z+.24);
  /* lampu indikator grup (efek uji) */
  mph.ind=new THREE.Mesh(new THREE.SphereGeometry(.05,12,10),
    new THREE.MeshStandardMaterial({color:0x224433,emissive:0x000000}));
  mph.ind.position.set(1.0,2.32,Z+.24);scene.add(mph.ind);

  terms={};clickables.forEach(c=>{if(c.userData.kind==='terminal')terms[c.userData.id]=c;});
  mph.energized=false;

  startSeq([
   {type:'wire',a:'IN-F',b:'MU-IN',color:COL.fasa,done:false,
    desc:'Fasa dari kWh meter masuk ke MCB UTAMA.',
    why:'MCB utama adalah pemutus seluruh rumah & cadangan terakhir bila MCB grup gagal. Ratingnya dikoordinasikan: utama 16A > grup 10A/6A agar yang trip duluan selalu yang terdekat dengan gangguan (selektivitas).'},
   {type:'wire',a:'MU-OUT',b:'RCD-IN',color:COL.fasa,done:false,
    desc:'Dari MCB utama, fasa masuk ke RCD 30 mA.',
    why:'Posisi RCD di hulu grup membuat SEMUA sirkit terlindungi arus bocor. MCB menjaga dari arus LEBIH; RCD menjaga dari arus BOCOR — dua bahaya berbeda, dua penjaga berbeda.'},
   {type:'wire',a:'RCD-OUT',b:'G1-IN',color:COL.fasa,done:false,
    desc:'Keluaran RCD dicabang ke GRUP 1 (penerangan).',
    why:'Pemisahan grup = pemisahan nasib: korsleting di stop kontak dapur tidak akan menggelapkan lampu tangga. Saat malam gangguan terjadi, kamu masih bisa melihat jalan ke panel.'},
   {type:'wire',a:'RCD-OUT',b:'G2-IN',color:COL.fasa,done:false,
    desc:'Cabang kedua keluaran RCD ke GRUP 2 (kotak kontak).',
    why:'Grup kotak kontak diberi rating & kabel lebih besar (2,5 mm²) karena melayani beban colok yang tak terduga — setrika, dispenser, charger — sementara grup lampu cukup 1,5 mm².'},
   {type:'wire',a:'IN-N',b:'NBAR',color:COL.netral,done:false,
    desc:'Netral masuk ke BUSBAR NETRAL.',
    why:'Semua netral grup berkumpul di satu busbar yang melewati RCD. Justru dari perbandingan arus fasa vs netral inilah RCD "merasakan" kebocoran: selisih 30 mA saja = trip.'},
   {type:'act',aid:'TEST',done:false,targets:()=>[mph.test],
    desc:'ENERGIZE lalu UJI: tekan tombol TEST kuning pada RCD!',
    why:'Tombol TEST menyuntik arus bocor buatan melewati sensor. RCD sehat = trip seketika (<40 ms — lebih cepat dari satu kedipan jantung). RCD yang tak pernah diuji bisa macet diam-diam selama bertahun-tahun.',
    fx(){mph.lever.rotation.x=.4;mph.ind.material.emissive.setHex(0x000000);
      sfx.bad();toast('⚡ KLIK! RCD TRIP dalam 28 ms — proteksi BEKERJA ✓','ok',2800);}},
   {type:'act',aid:'RESET',done:false,targets:()=>[mph.rcd],
    desc:'Kembalikan tuas RCD ke posisi ON (klik RCD).',
    why:'Setelah uji (atau trip sungguhan), reset mengembalikan suplai. Di dunia nyata: bila RCD trip berulang tanpa tombol test, JANGAN dipaksa — ada kebocoran nyata yang harus dicari.',
    fx(){mph.lever.rotation.x=-.3;mph.ind.material.emissive.setHex(0x2ee87a);
      mph.ind.material.emissiveIntensity=1;
      toast('🔋 RCD ON — panel beroperasi, rumah terlindungi.','ok',2600);sfx.big();}},
  ],()=>{say('🎉 <b>PHB modern berdiri!</b> Dua grup terpisah + penjaga 30 mA yang terbukti sigap. Rumah ini kini punya sistem saraf kelistrikan yang sesungguhnya.');
    setTimeout(()=>showWin('phb'),2200);});

  say('VOLTA di sini 🗄️ Naik kelas: <b>Panel Hubung Bagi</b>. Hari ini kamu berkenalan dengan perangkat penyelamat nyawa paling undervalued di rumah: <b>RCD 30 mA</b>. Rangkai dulu, lalu kita BUKTIKAN dia bekerja.');
  $('#modTitle').textContent='J01·M2 — Panel Hubung Bagi & RCD';
  $('#taskHead').textContent='BAGI GRUP · LINDUNGI NYAWA';}

MISSIONS.rumah.build=buildRumah;
MISSIONS.phb.build=buildPHB;

Object.assign(REAL,{
 rumah:[
  'Pakai kabel NYM 3×2,5 mm² untuk stop kontak & 2×1,5 mm² untuk penerangan, di dalam pipa conduit',
  'Sambungan hanya boleh di dalam tee-dus dengan lasdop/konektor — tidak pernah di tengah pipa',
  'Sebelum energize: megger tahanan isolasi ≥ 0,5 MΩ dan ukur tahanan pembumian (target ≤ 5 Ω)',
  'Instalasi baru wajib SLO (Sertifikat Laik Operasi) dari lembaga inspeksi sebelum disambung PLN'],
 phb:[
  'RCD diuji dengan tombol TEST tiap bulan DAN dengan RCD tester terkalibrasi saat instalasi (ukur waktu & arus trip aktual)',
  'Netral tiap grup TIDAK boleh digabung sembarangan — netral harus melewati RCD yang sama dengan fasanya',
  'Koordinasi rating: MCB utama > jumlah pertimbangan grup, dengan kurva selektif',
  'Label setiap grup di pintu panel — penyelamat waktu saat gangguan tengah malam'],
});
