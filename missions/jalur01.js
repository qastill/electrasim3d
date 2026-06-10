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

/* =====================================================================
   MISI 3 — INSTALASI 3 FASA & KESEIMBANGAN BEBAN
   ===================================================================== */
Object.assign(MISSIONS,{
 tiga:{lvl:'JALUR 01 · INSTALASI BANGUNAN · MISI 3',icon:'⚖️',title:'Instalasi 3 Fasa & Keseimbangan Beban',strict:false,
  loc:'📍 Rumah 2 lantai daya 11.000 VA · Indramayu',
  story:'Rumah besar Pak Haji baru naik daya ke 11.000 VA tiga fasa — tapi listriknya aneh: lampu meredup tiap AC menyala, dan MCB fasa R sering trip padahal dua fasa lain nyaris menganggur. Instalatir sebelumnya menumpuk hampir semua beban di satu fasa. Tugasmu menyeimbangkannya.',
  goal:'Beban terbagi rata ke fasa R, S, T — selisih arus antar fasa di bawah 10% dan tidak ada lagi MCB yang trip.',
  obj:['Ukur arus ketiga fasa & buktikan ketimpangan','Pelajari denah beban lalu pindahkan grup ke fasa yang tepat','Ukur ulang & verifikasi keseimbangan'],
  learn:['Beban timpang membuat satu fasa kelebihan (trip, drop tegangan) sementara fasa lain menganggur','Arus netral pada sistem 3 fasa seimbang mendekati NOL — ketimpangan membuat netral bekerja keras','Drop tegangan di fasa yang berat = lampu redup, peralatan elektronik cepat rusak','Pembagian grup 3 fasa direncanakan dari daftar beban, bukan asal sambung'],
  next:['Pelajari perhitungan arus netral dari ketiga fasa (vektor)','Dalami beban 3 fasa sejati (motor) vs beban 1 fasa terdistribusi','Rancang panel 3 fasa gedung dengan diagram satu garis']},
});
let mtg={};
function buildTiga(){
  freshScene(0xa8c0d4,0x141e2a);
  cam={theta:0,phi:1.18,r:6.5,target:new THREE.Vector3(0,2,-1)};
  const floor=boxT(12,.1,9,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(11,4.8,.15,TEX.plaster());wall.position.set(0,2.4,-3);scene.add(wall);
  const Z=-2.86;
  const enc=boxT(4.2,2.4,.3,TEX.metal(),{metalness:.35});enc.position.set(-.6,2.4,Z-.05);scene.add(enc);
  enc.add(label('PANEL 3 FASA 11.000 VA',.95).translateY(1.5));
  /* MCB grup berderet, warna fasa */
  mtg.grups=[];
  [['AC LT.1','R',-2.2],['AC LT.2','R',-1.5],['P.AIR','R',-.8],['W.HEATER','R',-.1],['LAMPU','S',.6],['KOTAK KTK','T',1.3]].forEach((o,i)=>{
    const colr={R:0xd83a3a,S:0xd8b020,T:0x444b55}[o[1]];
    const m=box(.42,.6,.16,COL.cream);m.position.set(o[2],2.7,Z+.14);scene.add(m);
    const ind=box(.3,.12,.05,colr);ind.position.set(o[2],3.08,Z+.2);scene.add(ind);
    actMesh(m,'G'+i);
    scene.add(label(o[0],.42).translateX(o[2]).translateY(2.32).translateZ(Z+.1));
    mtg.grups.push({mesh:m,ind:ind,fasa:o[1]});});
  scene.add(label('merah=R · kuning=S · hitam=T',.6,'#8aa3bd').translateX(-.5).translateY(1.85).translateZ(Z+.1));
  /* display arus */
  mtg.D=makeDisplay(1.6,.8,360,190);
  mtg.D.mesh.position.set(3.0,2.5,Z+.1);scene.add(mtg.D.mesh);
  actMesh(mtg.D.mesh,'UKUR1');
  scene.add(label('METER 3 FASA',.6,'#5fd4ff').translateX(3.0).translateY(3.1).translateZ(Z+.1));
  /* denah di meja */
  const tbl=boxT(1.2,.07,.8,TEX.wood());tbl.position.set(3.4,.95,.4);scene.add(tbl);
  const tleg=boxT(.08,.95,.08,TEX.wood());tleg.position.set(3.4,.47,.4);scene.add(tleg);
  mtg.denah=box(.6,.02,.8,0xf0ead8);mtg.denah.position.set(3.4,1.0,.4);scene.add(mtg.denah);
  actMesh(mtg.denah,'DENAH');
  scene.add(label('DENAH BEBAN',.55,'#5fd4ff').translateX(3.4).translateY(1.3).translateZ(.4));
  function setFasa(i,f){mtg.grups[i].fasa=f;
    mtg.grups[i].ind.material.color.setHex({R:0xd83a3a,S:0xd8b020,T:0x444b55}[f]);}
  function arus(){const a={R:0,S:0,T:0};const w=[9,8,5,6,4,5];
    mtg.grups.forEach((g,i)=>a[g.fasa]+=w[i]);return a;}
  function tampil(){const a=arus();
    dispText(mtg.D,['R '+a.R+'A · S '+a.S+'A · T '+a.T+'A',
      (Math.max(a.R,a.S,a.T)-Math.min(a.R,a.S,a.T))<=3?'SEIMBANG ✓':'TIMPANG ⚠'],
      [(Math.max(a.R,a.S,a.T)-Math.min(a.R,a.S,a.T))<=3?'#46ff8e':'#ff5a5a','#8aa3bd']);}
  tampil();
  startSeq([
   {type:'act',aid:'UKUR1',done:false,targets:()=>[mtg.D.mesh],
    desc:'Baca METER 3 fasa: buktikan ketimpangan arus (klik meter).',
    why:'R = 28 A nyaris penuh, S = 4 A, T = 5 A. Satu fasa memikul rumah, dua fasa menonton. Inilah sumber trip & lampu redup — bukan dayanya kurang, distribusinya yang salah.',
    fx(){toast('📏 R 28A · S 4A · T 5A — timpang berat!','bad',2800);}},
   {type:'act',aid:'DENAH',done:false,targets:()=>[mtg.denah],
    desc:'Pelajari DENAH BEBAN: rencanakan pembagian ulang.',
    why:'Daftar beban: AC lt.1 (9A), AC lt.2 (8A), pompa (5A), water heater (6A), lampu (4A), kotak kontak (5A). Target tiap fasa ±12 A. Rencana di kertas dulu — memindah MCB tanpa rencana = timpang versi baru.',
    fx(){toast('📋 Rencana: R=AC1 · S=AC2+lampu · T=pompa+heater+KK… hampir.','info',3200);}},
   {type:'act',aid:'G1',done:false,targets:()=>[mtg.grups[1].mesh],
    desc:'Pindahkan AC LT.2 dari fasa R ke fasa S (klik MCB AC LT.2).',
    why:'AC adalah beban terbesar — keduanya tak boleh sefasa. AC lt.2 (8A) pindah ke S yang nyaris kosong: sekali pindah, ketimpangan terpangkas sepertiga.',
    fx(){setFasa(1,'S');tampil();toast('🔀 AC LT.2 → fasa S. R turun ke 20A.','ok',2400);}},
   {type:'act',aid:'G3',done:false,targets:()=>[mtg.grups[3].mesh],
    desc:'Pindahkan WATER HEATER dari R ke fasa T.',
    why:'Water heater 6A melengkapi T (pompa sudah akan menyusul). Prinsipnya: beban besar disebar dulu, beban kecil jadi penyeimbang akhir.',
    fx(){setFasa(3,'T');tampil();toast('🔀 Water heater → fasa T.','ok',2200);}},
   {type:'act',aid:'G2',done:false,targets:()=>[mtg.grups[2].mesh],
    desc:'Terakhir: pindahkan POMPA AIR dari R ke fasa T… atau S? Cek meter, lalu putuskan (klik MCB pompa).',
    why:'R kini 9A (AC1), S 12A (AC2+lampu), T 11A (heater+KK). Pompa 5A paling pas menemani R → 14A? Bukan — R+5=14 vs ideal: justru biarkan hitungan menuntun: R 9+5=14, masih tertimpang tipis tapi terbaik yang ada. Keseimbangan sempurna jarang — yang wajib: selisih < 10%.',
    fx(){setFasa(2,'R');tampil();toast('🔀 Pompa → tetap di R: 14/12/11 A.','ok',2600);}},
   {type:'act',aid:'UKUR2',done:false,targets:()=>[mtg.D.mesh],
    desc:'Verifikasi akhir: baca meter — ketiga fasa seimbang.',
    why:'14 / 12 / 11 A — selisih maksimum 3 A (≈9%). Netral kini hampir tak berarus, tegangan rata, MCB tak ada yang menanggung sendirian. Rumah yang sama, instalasi yang jauh lebih sehat.',
    fx(){toast('✅ R 14A · S 12A · T 11A — SEIMBANG. Trip tinggal kenangan.','ok',3000);sfx.big();}},
  ],()=>{say('🎉 <b>Keseimbangan tercapai!</b> Tidak ada kabel baru, tidak ada daya tambahan — hanya distribusi yang benar. Itulah seni instalasi 3 fasa.');
    setTimeout(()=>showWin('tiga'),2200);});
  /* meter dipakai 2x */
  const s0=seq.steps[0],of0=s0.fx;s0.fx=()=>{of0();mtg.D.mesh.userData.aid='UKUR2';};
  say('VOLTA di sini ⚖️ Rumah 11.000 VA tapi lampu redup tiap AC hidup? Klasik: <b>beban menumpuk di satu fasa</b>. Hari ini kita jadi penyeimbang. Mulai dari meter — biarkan angka yang bercerita.');
  $('#modTitle').textContent='J01·M3 — Instalasi 3 Fasa & Balancing';
  $('#taskHead').textContent='UKUR · RENCANA · SEBAR · BUKTIKAN';}
MISSIONS.tiga.build=buildTiga;
Object.assign(REAL,{
 tiga:[
  'Pengukuran keseimbangan dilakukan pada jam beban puncak aktual, bukan siang hari kosong',
  'Setelah pemindahan grup: perbarui label panel & diagram satu garis — dokumen harus mengikuti kenyataan',
  'Ukur juga arus NETRAL sebelum-sesudah: penurunan drastis adalah bukti keberhasilan balancing',
  'Beban 1 fasa besar (AC, heater) dicatat dayanya saat perencanaan — balancing dimulai dari desain'],
});

/* =====================================================================
   MISI 4 — SAKLAR TUKAR & SENSOR GERAK
   ===================================================================== */
Object.assign(MISSIONS,{
 tukar:{lvl:'JALUR 01 · INSTALASI BANGUNAN · MISI 4',icon:'💡',title:'Saklar Tukar & Sensor Gerak',strict:false,
  loc:'📍 Rumah 2 lantai · Instalasi tangga & koridor',
  story:'Keluhan rumah dua lantai yang klasik: lampu tangga hanya bisa dimatikan dari bawah — siapa pun yang naik harus memilih antara gelap atau boros. Jawabannya berumur seabad dan tetap elegan: SAKLAR TUKAR (hotel). Plus bonus modern untuk koridor: sensor gerak PIR yang menyalakan lampu hanya saat dibutuhkan.',
  goal:'Lampu tangga dikendalikan dari DUA tempat (atas & bawah), dan lampu koridor menyala otomatis via sensor PIR.',
  obj:['Rangkai saklar tukar: fasa → SK1 → dua kawat pengantara → SK2 → lampu','Uji nyala-mati dari bawah DAN dari atas','Pasang sensor PIR koridor & uji deteksi'],
  learn:['Saklar tukar (SPDT) punya 1 terminal common + 2 pengantara: posisi tuasnya MEMILIH jalur, bukan memutus','Dua kawat pengantara menghubungkan SK1-SK2: lampu menyala bila kedua saklar memilih jalur yang SAMA — itulah kenapa keduanya bisa membalik keadaan','Sensor PIR mendeteksi perubahan panas inframerah yang bergerak — pasang menjauhi sumber panas (lampu, AC) agar tidak salah picu','Time delay & lux setting PIR diatur: menyala hanya saat gelap, padam 1-3 menit setelah gerakan terakhir'],
  next:['Naik level: saklar silang (3 titik kendali atau lebih)','Pelajari smart relay/timer tangga untuk gedung','Masuk smart home: saklar pintar & integrasi sensor']},
});
let mtk={};
function buildTukar(){
  freshScene(0xa8c0d4,0x141e2a);
  cam={theta:.1,phi:1.15,r:7,target:new THREE.Vector3(0,2.2,-1)};
  const floor=boxT(12,.1,9,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(11,5.2,.15,TEX.plaster());wall.position.set(0,2.6,-3);scene.add(wall);
  const Z=-2.86;
  /* tangga dekoratif */
  for(let i=0;i<5;i++){const st=boxT(1.6,.12,.45,TEX.wood());
    st.position.set(-3.2,.4+i*.42,-1.2-i*.32);scene.add(st);}
  scene.add(label('TANGGA',.6,'#8aa3bd').translateX(-3.2).translateY(2.9).translateZ(-1.8));
  /* sumber */
  const src=box(.9,.7,.16,COL.dark);src.position.set(-4.4,4.0,Z);scene.add(src);
  src.add(label('FASA (dari MCB)',.6).translateY(.55));
  terminal('F','fasa',-4.4,3.6,Z+.12);
  /* SK1 bawah */
  const sk1=box(.45,.45,.16,COL.cream);sk1.position.set(-2.6,1.4,Z);scene.add(sk1);
  sk1.add(label('SK1 · BAWAH',.55).translateY(.45));
  actMesh(sk1,'UJI1');
  terminal('SK1-C','fasa',-2.6,1.75,Z+.12);
  terminal('SK1-A','fasa',-2.85,1.05,Z+.12);
  terminal('SK1-B','fasa',-2.35,1.05,Z+.12);
  scene.add(label('C',.36).translateX(-2.42).translateY(1.78).translateZ(Z+.1));
  /* SK2 atas */
  const sk2=box(.45,.45,.16,COL.cream);sk2.position.set(-.4,3.3,Z);scene.add(sk2);
  sk2.add(label('SK2 · ATAS',.55).translateY(.45));
  actMesh(sk2,'UJI2');
  terminal('SK2-A','fasa',-.65,3.7,Z+.12);
  terminal('SK2-B','fasa',-.15,3.7,Z+.12);
  terminal('SK2-C','fasa',-.4,2.95,Z+.12);
  /* lampu tangga */
  const fit=cyl(.09,.13,.2,0x444444);fit.position.set(1.4,4.3,Z+.1);scene.add(fit);
  mtk.bulbMat=new THREE.MeshStandardMaterial({color:0xfff4c2,roughness:.3,emissive:0x000000});
  mtk.bulb=new THREE.Mesh(new THREE.SphereGeometry(.18,18,14),mtk.bulbMat);
  mtk.bulb.position.set(1.4,4.08,Z+.1);scene.add(mtk.bulb);
  mtk.light=new THREE.PointLight(0xffe9a8,0,7);mtk.light.position.set(1.4,3.9,Z+.7);scene.add(mtk.light);
  scene.add(label('LAMPU TANGGA',.6).translateX(1.4).translateY(4.65).translateZ(Z));
  terminal('L-F','fasa',1.2,3.85,Z+.14);
  /* netral langsung (disederhanakan, sudah tersambung) */
  scene.add(label('(netral lampu sudah tersambung)',.5,'#8aa3bd').translateX(1.7).translateY(3.6).translateZ(Z+.1));
  /* PIR + lampu koridor */
  mtk.pir=new THREE.Mesh(new THREE.SphereGeometry(.14,14,10),
    new THREE.MeshStandardMaterial({color:0xe8edf2,roughness:.4}));
  mtk.pir.position.set(3.6,4.2,Z+.1);scene.add(mtk.pir);
  actMesh(mtk.pir,'PIR');
  scene.add(label('SENSOR PIR',.55,'#5fd4ff').translateX(3.6).translateY(4.6).translateZ(Z));
  mtk.kor=new THREE.Mesh(new THREE.SphereGeometry(.14,16,12),
    new THREE.MeshStandardMaterial({color:0xfff4c2,roughness:.3,emissive:0x000000}));
  mtk.kor.position.set(4.5,4.1,Z+.1);scene.add(mtk.kor);
  actMesh(mtk.kor,'JALAN');
  scene.add(label('LAMPU KORIDOR',.55).translateX(4.5).translateY(4.55).translateZ(Z));
  terms={};clickables.forEach(c=>{if(c.userData.kind==='terminal')terms[c.userData.id]=c;});
  mtk.s1=true;mtk.s2=true;mtk.on=false;
  function lampu(){
    mtk.on=(mtk.s1===mtk.s2);
    mtk.bulbMat.emissive.setHex(mtk.on?0xffd97a:0x000000);
    mtk.bulbMat.emissiveIntensity=mtk.on?1:0;
    mtk.light.intensity=mtk.on?1.4:0;}
  startSeq([
   {type:'wire',a:'F',b:'SK1-C',color:COL.fasa,done:false,
    desc:'Fasa dari MCB masuk ke terminal COMMON SK1 (bawah).',
    why:'Common adalah gerbang masuk-keluar saklar tukar; dua terminal lainnya hanyalah dua jalur pilihan. Salah menaruh fasa di terminal pengantara = rangkaian kacau yang kadang nyala kadang mati tanpa pola.',
    wrong:'Fasa selalu masuk lewat terminal COMMON (C), bukan pengantara.'},
   {type:'wire',a:'SK1-A',b:'SK2-A',color:COL.fasa,done:false,
    desc:'Kawat PENGANTARA pertama: SK1-A ke SK2-A.',
    why:'Inilah jalur pilihan pertama. Bila kedua saklar sama-sama menunjuk jalur A, arus mengalir penuh — lampu menyala.'},
   {type:'wire',a:'SK1-B',b:'SK2-B',color:COL.fasa,done:false,
    desc:'Kawat PENGANTARA kedua: SK1-B ke SK2-B.',
    why:'Jalur pilihan kedua melengkapi pasangannya. Kini tiap saklar bisa membelokkan arus: pindahkan SATU tuas mana pun, keadaan lampu pasti terbalik — matematika sederhana dua pilihan.'},
   {type:'wire',a:'SK2-C',b:'L-F',color:COL.fasa,done:false,
    desc:'Dari COMMON SK2, fasa keluar menuju LAMPU.',
    why:'Rangkaian tukar lengkap: fasa → C1 → (A/B) → C2 → lampu. Netral lampu langsung ke sumber seperti biasa — saklar apa pun tidak pernah memutus netral.'},
   {type:'act',aid:'UJI1',done:false,targets:()=>[sk1],
    desc:'UJI dari BAWAH: klik SK1 — lampu harus berubah keadaan.',
    why:'Tuas SK1 berpindah jalur → keadaan rangkaian terbalik → lampu menyala. Orang di bawah kini berkuasa penuh.',
    fx(){mtk.s1=!mtk.s1;lampu();
      toast(mtk.on?'💡 NYALA dari bawah ✓':'⬛ MATI dari bawah ✓','ok',2200);}},
   {type:'act',aid:'UJI2',done:false,targets:()=>[sk2],
    desc:'UJI dari ATAS: klik SK2 — pastikan lampu berubah lagi.',
    why:'Dan dari atas pun sama berkuasanya. Naik dengan terang, matikan dari atas; turun pagi, nyalakan dari atas. Tidak ada lagi pilihan antara gelap dan boros.',
    fx(){mtk.s2=!mtk.s2;lampu();
      toast(mtk.on?'💡 NYALA dari atas ✓ — saklar tukar bekerja!':'⬛ MATI dari atas ✓ — saklar tukar bekerja!','ok',2600);}},
   {type:'act',aid:'PIR',done:false,targets:()=>[mtk.pir],
    desc:'Pasang & setel SENSOR PIR koridor (klik sensor).',
    why:'PIR membaca panas tubuh yang BERGERAK. Setelan: lux rendah (hanya aktif saat gelap), delay 90 detik. Dipasang menjauhi lampu & AC — sumber panas lain adalah hantu yang menyalakan lampu tengah malam.',
    fx(){toast('⚙️ PIR: lux 10 · delay 90s · arah ke koridor ✓','ok',2600);}},
   {type:'act',aid:'JALAN',done:false,targets:()=>[mtk.kor],
    desc:'UJI: berjalanlah di koridor (klik lampu koridor).',
    why:'Langkah pertama terdeteksi — lampu menyala sendiri; 90 detik setelah koridor sepi, ia pamit sendiri. Energi dipakai persis saat dibutuhkan: otomasi paling sederhana, paling terasa.',
    fx(){mtk.kor.material.emissive.setHex(0xffd97a);mtk.kor.material.emissiveIntensity=1;
      toast('🚶 Gerakan terdeteksi — lampu koridor MENYALA otomatis!','ok',2800);sfx.big();}},
  ],()=>{say('🎉 <b>Instalasi cerdas selesai!</b> Saklar tukar menaklukkan tangga, PIR menjaga koridor. Rumah yang sama, kenyamanan yang naik kelas — dan tagihan yang justru turun.');
    setTimeout(()=>showWin('tukar'),2200);});
  say('VOLTA di sini 💡 Trik kelistrikan paling elegan warisan seabad: <b>saklar tukar</b> — satu lampu, dua tempat kendali. Kuncinya memahami terminal COMMON. Plus bonus modern: sensor gerak PIR. Mulai dari fasa!');
  $('#modTitle').textContent='J01·M4 — Saklar Tukar & Sensor Gerak';
  $('#taskHead').textContent='DUA SAKLAR, SATU LAMPU';}
MISSIONS.tukar.build=buildTukar;
Object.assign(REAL,{
 tukar:[
  'Kawat pengantara diberi warna berbeda dari fasa utama & ditandai di kedua ujung — penyelamat saat perbaikan',
  'Gunakan saklar tukar berkualitas (SNI): kontak SPDT murahan cepat aus karena sering dioperasikan',
  'PIR koridor diuji jalan sungguhan di malam hari: pola jangkauan nyata beda dengan brosur',
  'Untuk 3+ titik kendali, sisipkan saklar silang di antara dua saklar tukar'],
});

/* =====================================================================
   MISI 5 — PENANGKAL PETIR & PEMBUMIAN GEDUNG
   ===================================================================== */
Object.assign(MISSIONS,{
 petir:{lvl:'JALUR 01 · INSTALASI BANGUNAN · MISI 5',icon:'🌩️',title:'Penangkal Petir & Pembumian Gedung',strict:false,
  loc:'📍 Ruko 3 lantai · Indramayu, sebelum musim hujan',
  story:'Ruko tiga lantai milik H. Somad berdiri paling tinggi di blok-nya — dan dua minggu lalu, petir menyambar antena tetangga dua rumah dari situ. Beliau akhirnya sadar: bangunan tertinggi adalah sukarelawan sambaran. Tugasmu memasang sistem proteksi petir eksternal lengkap: dari ujung tombak di atap sampai elektroda di kedalaman tanah.',
  goal:'Sistem proteksi petir terpasang utuh: air terminal menaungi seluruh atap, konduktor turun mulus, dan tahanan pembumian terukur di bawah 5 ohm.',
  obj:['Pasang air terminal & verifikasi zona proteksi','Tarik down conductor dengan rute benar + klem ukur','Tanam elektroda, ukur tahanan, dan bonding ekuipotensial'],
  learn:['Petir memilih jalur termudah ke bumi — proteksi petir tidak menolak sambaran, ia MENYEDIAKAN jalur aman agar arus tak lewat struktur','Zona proteksi air terminal dihitung (sudut proteksi/bola gelinding) — pasang asal tinggi tidak menjamin pojok atap ternaungi','Down conductor menuntut rute selurus mungkin: setiap tikungan tajam adalah titik samping (side flash) karena arus petir benci belokan','Tahanan pembumian < 5 ohm dan bonding ke pembumian listrik — beda potensial antar sistem saat sambaran = percikan di dalam rumah'],
  next:['Pelajari metode bola gelinding (rolling sphere) untuk gedung kompleks','Dalami SPD (surge protective device) — proteksi petir internal','Ukur pembumian musiman: tanah kering mengubah angka']},
});
let mlp={};
function buildPetir(){
  freshScene(0x8aa0c0,0x141c28);
  cam={theta:.15,phi:1.05,r:11,target:new THREE.Vector3(0,3,-1)};
  const ground=boxT(22,.1,14,TEX.gravel());ground.position.y=-.05;scene.add(ground);
  /* ruko 3 lantai */
  const gedung=boxT(4.5,6,3.5,TEX.plaster());gedung.position.set(-1,3,-2);scene.add(gedung);
  [1.2,3.2,5.2].forEach(y=>{[-2.2,-1,0.2].forEach(x=>{
    const j=box(.7,.9,.06,0x224,{roughness:.2,metalness:.4});j.position.set(x-.1,y,-0.22);scene.add(j);});});
  scene.add(label('RUKO 3 LANTAI · H. SOMAD',.9).translateX(-1).translateY(7.1).translateZ(-2));
  /* air terminal */
  mlp.spit=cyl(.025,.05,1.0,0xd8b020,10,{metalness:.7});
  mlp.spit.position.set(-1,6.55,-2);scene.add(mlp.spit);
  actMesh(mlp.spit,'AT');
  scene.add(label('AIR TERMINAL',.6,'#5fd4ff').translateX(-1).translateY(7.6).translateZ(-1.6));
  /* down conductor (muncul setelah dipasang) */
  mlp.dc=cyl(.03,.03,6,0x8a6a3a);mlp.dc.position.set(1.28,3,-1.4);
  mlp.dc.visible=false;scene.add(mlp.dc);
  mlp.dcBtn=box(.3,.4,.1,0x8a6a3a);mlp.dcBtn.position.set(2.4,1.4,-1.0);scene.add(mlp.dcBtn);
  actMesh(mlp.dcBtn,'DC');
  scene.add(label('ROL KONDUKTOR BC 50mm²',.55,'#5fd4ff').translateX(2.6).translateY(1.9).translateZ(-1.0));
  /* bak kontrol + elektroda */
  mlp.bak=boxT(.5,.3,.5,TEX.concrete());mlp.bak.position.set(1.3,.15,-.4);scene.add(mlp.bak);
  actMesh(mlp.bak,'ROD');
  scene.add(label('BAK KONTROL + ELEKTRODA',.55,'#5fd4ff').translateX(1.6).translateY(.7).translateZ(0));
  /* earth tester */
  const tbl=boxT(.9,.07,.6,TEX.wood());tbl.position.set(4.2,.95,.6);scene.add(tbl);
  const tleg=boxT(.08,.95,.08,TEX.wood());tleg.position.set(4.2,.47,.6);scene.add(tleg);
  mlp.et=box(.32,.2,.24,0xd8b020);mlp.et.position.set(4.2,1.08,.6);scene.add(mlp.et);
  actMesh(mlp.et,'UKUR');
  scene.add(label('EARTH TESTER 3 TITIK',.55,'#5fd4ff').translateX(4.2).translateY(1.4).translateZ(.6));
  /* bonding bar */
  mlp.bond=box(.4,.12,.08,0x86c79a);mlp.bond.position.set(-3.6,.6,-.2);scene.add(mlp.bond);
  actMesh(mlp.bond,'BOND');
  scene.add(label('BAR EKUIPOTENSIAL',.55,'#8df0b8').translateX(-3.8).translateY(1.0).translateZ(.1));
  startSeq([
   {type:'act',aid:'AT',done:false,targets:()=>[mlp.spit],
    desc:'Pasang AIR TERMINAL & cek zona proteksinya (klik splitzen).',
    why:'Splitzen tembaga 1 m di titik tertinggi. Tapi tinggi saja belum cukup: dengan sudut proteksi ±45°, payung imajinernya harus menaungi SEMUA pojok atap — pojok timur ternyata di tepi zona, jadi posisi digeser 60 cm. Geometri dulu, baut kemudian.',
    fx(){toast('🌩️ Air terminal terpasang — 4 pojok atap ternaungi ✓','ok',2800);}},
   {type:'act',aid:'DC',done:false,targets:()=>[mlp.dcBtn],
    desc:'Tarik DOWN CONDUCTOR dari atap ke tanah (klik rol konduktor).',
    why:'BC 50 mm² menuruni dinding selurus mungkin — arus petir puluhan kilo-ampere membenci belokan: tikungan tajam memaksa arus melompat ke struktur (side flash). Rute menjauhi pintu & jendela, diklem tiap meter, plus klem ukur di bawah untuk pengujian tahunan.',
    fx(){mlp.dc.visible=true;mlp.dcBtn.visible=false;
      toast('📏 Konduktor turun lurus, jauh dari bukaan, klem ukur siap.','ok',2800);}},
   {type:'act',aid:'ROD',done:false,targets:()=>[mlp.bak],
    desc:'Tanam ELEKTRODA pembumian di bak kontrol (klik bak).',
    why:'Ground rod tembaga 5/8" ditanam tegak sedalam mungkin — lapisan tanah dalam lebih lembap & stabil sepanjang musim. Bak kontrol membuat sambungan bisa diperiksa selamanya: pembumian yang dikubur tanpa akses = pembumian yang dilupakan.',
    fx(){toast('⏚ Elektroda tertanam 6 m — sambungan di bak kontrol.','ok',2600);}},
   {type:'act',aid:'UKUR',done:false,targets:()=>[mlp.et],
    desc:'UKUR tahanan pembumian metode 3 titik (klik earth tester).',
    why:'Spike bantu ditanam 20 m & 40 m, arus uji dialirkan: terukur 3,2 ohm — di bawah 5 ✓. Angka ini diukur saat tanah TIDAK basah hujan: nilai musim kering adalah nilai jujurnya. Kalau di atas 5: tambah rod paralel berjarak ≥ panjang rod.',
    fx(){toast('📏 Tahanan pembumian: 3,2 Ω (< 5 Ω) ✓','ok',2800);}},
   {type:'act',aid:'BOND',done:false,targets:()=>[mlp.bond],
    desc:'Terakhir & sering dilupakan: BONDING ekuipotensial (klik bar hijau).',
    why:'Pembumian petir disatukan dengan pembumian listrik di bar ekuipotensial. Tanpa bonding, saat sambaran terjadi dua sistem berbeda potensial ribuan volt — dan percikan meloncat lewat instalasi DALAM rumah. Satu bar kecil ini mencegah petir masuk lewat pintu belakang.',
    fx(){toast('🔗 Bonding tuntas — sistem proteksi petir UTUH. Musim hujan, silakan datang!','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Ruko terlindungi!</b> Tombak menangkap, konduktor mengantar, bumi menelan — dan bonding memastikan tak ada percikan nyasar di dalam. Petir boleh memilih ruko ini; ia hanya akan lewat di jalur yang kamu siapkan.');
    setTimeout(()=>showWin('petir'),2200);});
  say('VOLTA di sini 🌩️ Bangunan tertinggi di blok = sukarelawan sambaran. Filosofinya menarik: <b>kita tidak melawan petir — kita menyediakan jalan tol baginya</b>. Dari ujung tombak sampai 6 meter di bawah tanah. Mulai dari atap!');
  $('#modTitle').textContent='J01·M5 — Penangkal Petir & Pembumian';
  $('#taskHead').textContent='TANGKAP · ANTAR · TELAN · IKAT';}
MISSIONS.petir.build=buildPetir;
Object.assign(REAL,{
 petir:[
  'Desain mengikuti standar proteksi petir (zona proteksi dihitung, bukan dikira) sesuai kelas bangunan',
  'Sambungan konduktor memakai klem/las exothermic — puntiran kawat akan lepas oleh gaya magnetik arus petir',
  'Pengujian tahanan dilakukan tahunan & setelah ada sambaran — dicatat di kartu inspeksi bak kontrol',
  'Lengkapi dengan SPD bertingkat di panel — proteksi eksternal tanpa internal hanya setengah perlindungan'],
});

/* =====================================================================
   MISI 6 — SMART HOME: OTOMASI RUMAH PINTAR
   ===================================================================== */
Object.assign(MISSIONS,{
 smart:{lvl:'JALUR 01 · INSTALASI BANGUNAN · MISI 6',icon:'📱',title:'Smart Home: Otomasi Rumah Pintar',strict:false,
  loc:'📍 Rumah Pak Dadang (lagi!) · Upgrade rumah pintar',
  story:'Pelanggan pertamamu kembali — kini dengan permintaan zaman baru: "Saya mau lampu bisa dari HP, AC mati otomatis kalau rumah kosong, dan tagihan kelihatan real-time." Smart home bukan soal gadget mahal: ia soal instalasi listrik yang BENAR dipadukan logika yang masuk akal. Wiring rapimu lima misi lalu kini jadi pondasi rumah pintar.',
  goal:'Rumah Pak Dadang menjadi pintar dengan benar: saklar pintar terpasang aman, sensor & skenario logis, monitoring energi berjalan, dan tetap berfungsi saat internet mati.',
  obj:['Pasang modul saklar pintar di titik strategis','Susun skenario otomasi yang masuk akal','Pasang monitoring energi & uji mode offline'],
  learn:['Modul saklar pintar butuh NETRAL di kotak saklar — instalasi lama yang hanya menarik fasa ke saklar harus ditarik ulang: smart home dimulai dari wiring','Skenario yang baik berbasis KEJADIAN nyata (rumah kosong, malam, tarif), bukan sekadar jadwal jam — otomasi yang salah lebih mengganggu daripada manual','Perangkat kritis (lampu, saklar) wajib tetap berfungsi MANUAL saat WiFi/server mati — internet boleh padam, rumah tidak boleh lumpuh','CT clamp monitoring di panel memberi data real-time: penghuni yang MELIHAT konsumsinya rata-rata berhemat 10-15% tanpa disuruh'],
  next:['Pelajari protokol: WiFi vs Zigbee/Thread — kapan butuh hub','Dalami integrasi PLTS atap + baterai ke skenario rumah','Eksplorasi keamanan IoT: jaringan tamu terpisah untuk perangkat'],},
});
let msm={};
function buildSmart(){
  freshScene(0xa8c0d4,0x141e2a);
  cam={theta:.05,phi:1.16,r:7,target:new THREE.Vector3(0,1.8,-.8)};
  const floor=boxT(13,.1,9,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(12,4.4,.15,TEX.plaster());wall.position.set(0,2.2,-3);scene.add(wall);
  const Z=-2.86;
  /* saklar lama → modul pintar */
  msm.sk=box(.4,.4,.14,COL.cream);msm.sk.position.set(-4.2,1.5,Z);scene.add(msm.sk);
  actMesh(msm.sk,'MODUL');
  scene.add(label('SAKLAR RUANG TAMU',.55).translateX(-4.2).translateY(2.0).translateZ(Z+.1));
  /* lampu */
  msm.lampu=new THREE.Mesh(new THREE.SphereGeometry(.16,16,12),
    new THREE.MeshStandardMaterial({color:0xfff4c2,roughness:.3,emissive:0x000000}));
  msm.lampu.position.set(-4.2,3.6,Z+.2);scene.add(msm.lampu);
  /* sensor pintu + PIR */
  msm.pintu=box(.1,.18,.06,0xe8edf2);msm.pintu.position.set(-1.8,2.2,Z+.08);scene.add(msm.pintu);
  scene.add(label('SENSOR PINTU',.5,'#5fd4ff').translateX(-1.8).translateY(2.6).translateZ(Z+.1));
  /* tablet skenario */
  msm.D=makeDisplay(2.4,1.6,460,300);
  msm.D.mesh.position.set(1.2,2.3,Z+.1);scene.add(msm.D.mesh);
  actMesh(msm.D.mesh,'SKEN');
  scene.add(label('APLIKASI RUMAH',.7,'#5fd4ff').translateX(1.2).translateY(3.35).translateZ(Z+.1));
  msm.st={mod:false,sken:false,energi:false,off:false};
  function app(){
    const g=msm.D.g,W=460,H=300;
    g.fillStyle='#101820';g.fillRect(0,0,W,H);
    g.font='700 18px Consolas';g.textAlign='left';
    g.fillStyle='#5fd4ff';g.fillText('RUMAH DADANG',16,30);
    g.font='600 15px Consolas';
    g.fillStyle=msm.st.mod?'#46ff8e':'#5d748c';
    g.fillText((msm.st.mod?'●':'○')+' Lampu tamu — online',16,72);
    g.fillStyle=msm.st.sken?'#46ff8e':'#5d748c';
    g.fillText((msm.st.sken?'●':'○')+' Skenario: pergi/pulang/malam',16,108);
    g.fillStyle=msm.st.energi?'#46ff8e':'#5d748c';
    g.fillText((msm.st.energi?'●':'○')+' Energi: '+(msm.st.energi?'842 W sekarang':'—'),16,144);
    if(msm.st.off){g.fillStyle='#ffd23f';
      g.fillText('⚠ internet OFF — kontrol lokal AKTIF',16,196);}
    if(msm.st.energi){g.strokeStyle='#46ff8e';g.lineWidth=2;g.beginPath();
      for(let x=0;x<200;x+=4)g.lineTo(230+x,250-Math.sin(x*.08)*16-(x>120?10:0));
      g.stroke();}
    msm.D.tex.needsUpdate=true;}
  app();
  /* panel + CT monitoring */
  const phb=boxT(.9,1.2,.2,TEX.metal(),{metalness:.35});phb.position.set(4.2,2.0,Z);scene.add(phb);
  phb.add(label('PANEL',.6).translateY(.85));
  msm.ct=new THREE.Mesh(new THREE.TorusGeometry(.1,.03,10,20),
    new THREE.MeshStandardMaterial({color:0x2a72c8}));
  msm.ct.position.set(4.2,1.6,Z+.16);scene.add(msm.ct);
  actMesh(msm.ct,'ENERGI');
  scene.add(label('CT MONITORING',.55,'#5fd4ff').translateX(4.2).translateY(1.2).translateZ(Z+.1));
  /* router (untuk uji offline) */
  msm.router=box(.4,.1,.3,0x18242f);msm.router.position.set(-.4,1.0,.8);scene.add(msm.router);
  actMesh(msm.router,'OFFLINE');
  const tbl2=boxT(.8,.07,.5,TEX.wood());tbl2.position.set(-.4,.92,.8);scene.add(tbl2);
  const tl2=boxT(.07,.92,.07,TEX.wood());tl2.position.set(-.4,.46,.8);scene.add(tl2);
  scene.add(label('ROUTER WIFI',.5,'#5fd4ff').translateX(-.4).translateY(1.3).translateZ(.8));
  startSeq([
   {type:'act',aid:'MODUL',done:false,targets:()=>[msm.sk],
    desc:'Pasang MODUL saklar pintar di kotak saklar (klik saklar).',
    why:'Buka kotak: untung wiring-mu dulu rapi — tapi modul butuh NETRAL untuk menghidupi otaknya, dan kotak saklar klasik hanya berisi fasa. Satu tarikan netral dari tee-dus terdekat, modul terpasang di belakang saklar asli: dari luar tetap saklar biasa, di dalam sudah berotak.',
    fx(){msm.st.mod=true;app();msm.lampu.material.emissive.setHex(0xffd97a);
      msm.lampu.material.emissiveIntensity=.8;
      toast('📱 Modul online — lampu kini punya dua majikan: saklar & HP.','ok',3000);}},
   {type:'act',aid:'SKEN',done:false,targets:()=>[msm.D.mesh],
    desc:'Susun SKENARIO otomasi yang masuk akal (klik aplikasi).',
    why:'Tiga skenario berbasis kejadian: PERGI (pintu terkunci dari luar + 10 menit tanpa gerakan → semua mati kecuali kulkas), PULANG (pintu terbuka + malam → lampu jalur menyala), MALAM (23:00 → AC kamar saja). Bukan jam-jaman buta: rumah mengikuti penghuninya, bukan sebaliknya.',
    fx(){msm.st.sken=true;app();
      toast('🧠 3 skenario aktif — rumah mulai berpikir.','ok',2800);}},
   {type:'act',aid:'ENERGI',done:false,targets:()=>[msm.ct],
    desc:'Pasang CT MONITORING energi di panel (klik CT).',
    why:'Clamp di fasa utama (panah ke beban — ilmu lama yang sama), data mengalir ke aplikasi: 842 W saat ini, grafik harian, perkiraan tagihan. Pak Dadang bisa MELIHAT water heater-nya menelan 30% tagihan — dan manusia yang melihat angka, berubah sendiri tanpa diceramahi.',
    fx(){msm.st.energi=true;app();
      toast('📊 Monitoring hidup — 842 W real-time di genggaman.','ok',2800);}},
   {type:'act',aid:'OFFLINE',done:false,targets:()=>[msm.router],
    desc:'Ujian terpenting: CABUT internet — rumah harus tetap waras (klik router).',
    why:'Router dimatikan: saklar fisik tetap bekerja ✓, skenario lokal tetap jalan (logika tersimpan di perangkat, bukan di awan) ✓, hanya akses jarak jauh yang pamit. Rumah pintar yang lumpuh tanpa internet bukan pintar — ia manja. Punya Pak Dadang lulus ujian mati gaya.',
    fx(){msm.st.off=true;app();
      toast('🔌 Internet mati — rumah TETAP berfungsi penuh. Lulus!','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Rumah pertamamu kini berpikir!</b> Wiring benar jadi pondasi, skenario masuk akal jadi otak, monitoring jadi mata — dan saat internet padam, ia tetap rumah yang baik. Smart home yang sejati: teknologi yang tak terasa.');
    setTimeout(()=>showWin('smart'),2200);});
  say('VOLTA di sini 📱 Pak Dadang kembali — kali ini minta rumahnya <b>pintar</b>. Rahasia smart home yang baik: wiring benar, skenario masuk akal, dan tetap hidup saat internet mati. Mulai dari saklar ruang tamu!');
  $('#modTitle').textContent='J01·M6 — Smart Home';
  $('#taskHead').textContent='PINTAR TAPI TAK MANJA';}
MISSIONS.smart.build=buildSmart;
Object.assign(REAL,{
 smart:[
  'Pastikan modul tersertifikasi (SNI/CE) & rating arus sesuai beban — modul abal-abal adalah sumber api di kotak saklar',
  'Pisahkan perangkat IoT di jaringan/VLAN tamu — kamera & saklar murah adalah pintu belakang favorit peretas',
  'Dokumentasikan skenario & berikan ke penghuni — otomasi yang tak dipahami akan dimatikan',
  'Pilih perangkat dengan kontrol LOKAL (bukan cloud-only) — layanan cloud bisa tutup, rumah tetap harus jalan'],
});

/* =====================================================================
   MISI 7 — AUDIT INSTALASI LAMA & KELAYAKAN
   ===================================================================== */
Object.assign(MISSIONS,{
 slo:{lvl:'JALUR 01 · INSTALASI BANGUNAN · MISI 7',icon:'🏚️',title:'Audit Instalasi Lama & Kelayakan',strict:false,
  loc:'📍 Rumah warisan 1985 · Calon pembeli minta pemeriksaan',
  story:'Rumah tua 1985 akan berpindah tangan — dan calon pembelinya cerdas: sebelum bayar, ia membayar JASAMU memeriksa instalasinya. Empat dekade adalah waktu yang panjang bagi kabel: isolasi menua, sambungan ditambah-tambah penghuni, dan standar zaman itu bukan standar hari ini. Tugasmu: temukan bahaya tersembunyi & terbitkan laporan kelayakan yang jujur.',
  goal:'Instalasi teraudit menyeluruh: temuan terklasifikasi bahayanya, diuji dengan alat ukur, dan laporan kelayakan ber-prioritas perbaikan terbit.',
  obj:['Inspeksi visual panel & jalur instalasi','Uji isolasi & pembumian dengan alat ukur','Klasifikasi temuan & terbitkan laporan prioritas'],
  learn:['Instalasi menua tidak gagal mendadak — ia menurun pelan: isolasi karet era 80an menggetas, sambungan tambahan menumpuk tanpa tee-dus','Inspeksi visual menemukan 70% masalah: sekring diganjal kawat, sambungan puntir terbuka, kabel tanpa conduit — mata terlatih dulu, alat kemudian','Megger menjawab yang tak terlihat: isolasi 0,1 MΩ artinya kabel sudah bocor ke mana-mana — angka minimal 0,5 MΩ bukan sekadar formalitas','Laporan kelayakan memilah: BAHAYA (perbaiki sebelum dihuni), SEGERA (3 bulan), DISARANKAN — pembeli butuh prioritas, bukan daftar panjang yang menakutkan'],
  next:['Pelajari prosedur SLO & lembaga inspeksi resmi','Dalami estimasi biaya rewiring untuk negosiasi harga rumah','Tawarkan jasa inspeksi pra-jual-beli — pasar yang belum tergarap']},
});
let mlo={};
function buildSLO(){
  freshScene(0xa89878,0x141009);
  cam={theta:.05,phi:1.16,r:7,target:new THREE.Vector3(0,1.7,-.8)};
  const floor=boxT(13,.1,9,TEX.wood());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(12,4.4,.15,TEX.plaster());wall.position.set(0,2.2,-3);scene.add(wall);
  const Z=-2.86;
  /* panel tua dengan sekring diganjal */
  mlo.panel=box(.8,1.0,.2,0x6a5a48);mlo.panel.position.set(-4.2,2.0,Z);scene.add(mlo.panel);
  actMesh(mlo.panel,'VISUAL');
  scene.add(label('PANEL 1985 — sekring keramik',.65,'#ffd23f').translateX(-4.2).translateY(2.8).translateZ(Z+.1));
  /* sambungan puntir terbuka di plafon */
  mlo.puntir=new THREE.Mesh(new THREE.SphereGeometry(.08,10,8),
    new THREE.MeshStandardMaterial({color:0x2a2a2a}));
  mlo.puntir.position.set(-1.4,3.9,Z+.2);scene.add(mlo.puntir);
  const kbl1=cyl(.02,.02,1.6,0x4a4038);kbl1.rotation.z=Math.PI/2;kbl1.position.set(-2.2,3.9,Z+.2);scene.add(kbl1);
  scene.add(label('sambungan puntir terbuka!',.55,'#ff8d8d').translateX(-1.4).translateY(4.3).translateZ(Z+.1));
  /* stop kontak gosong */
  mlo.skk=box(.3,.3,.1,0xcfae90);mlo.skk.position.set(1.2,1.2,Z+.06);scene.add(mlo.skk);
  const gsg=box(.1,.14,.04,0x241a10);gsg.position.set(1.2,1.2,Z+.12);scene.add(gsg);
  /* megger + earth tester di meja */
  const tbl=boxT(1.6,.07,.7,TEX.wood());tbl.position.set(3.2,.95,.2);scene.add(tbl);
  const tleg=boxT(.08,.95,.08,TEX.wood());tleg.position.set(3.2,.47,.2);scene.add(tleg);
  mlo.meg=box(.32,.2,.24,0xcc8830);mlo.meg.position.set(2.8,1.08,.2);scene.add(mlo.meg);
  actMesh(mlo.meg,'MEGGER');
  scene.add(label('MEGGER',.5,'#5fd4ff').translateX(2.8).translateY(1.4).translateZ(.2));
  mlo.et=box(.32,.2,.24,0xd8b020);mlo.et.position.set(3.6,1.08,.2);scene.add(mlo.et);
  actMesh(mlo.et,'EARTH');
  scene.add(label('EARTH TESTER',.5,'#5fd4ff').translateX(3.7).translateY(1.4).translateZ(.2));
  /* papan laporan */
  mlo.rep=box(.6,.75,.05,0xe8e4d8);mlo.rep.position.set(5.2,1.9,Z+.06);scene.add(mlo.rep);
  actMesh(mlo.rep,'LAPOR');
  scene.add(label('LAPORAN KELAYAKAN',.6,'#5fd4ff').translateX(5.2).translateY(2.5).translateZ(Z+.1));
  startSeq([
   {type:'act',aid:'VISUAL',done:false,targets:()=>[mlo.panel],
    desc:'Mulai INSPEKSI VISUAL: buka panel tua itu (klik panel).',
    why:'Empat dekade bercerita sekaligus: sekring keramik diganjal kawat tembaga (proteksi DIMATIKAN diam-diam!), tak ada pembumian sama sekali, dan jalur tambahan era 2000-an dipuntir langsung tanpa kotak sambung. Tiga generasi penghuni, tiga lapis improvisasi.',
    fx(){toast('👁️ Sekring diganjal kawat + tanpa pembumian + sambungan liar.','bad',3200);}},
   {type:'act',aid:'JEJAK',done:false,targets:()=>[mlo.puntir],
    desc:'Telusuri jalur: periksa sambungan PLAFON & stop kontak (klik sambungan).',
    why:'Sambungan puntir terbuka di plafon — tanpa lasdop, tanpa tee-dus, isolasinya tape yang sudah mengelupas; di bawahnya stop kontak menghitam bekas panas. Inilah pasangan maut instalasi tua: sambungan lelah + beban modern (AC, water heater) yang tak pernah dibayangkan tahun 1985.',
    fx(){toast('🔍 Puntiran terbuka + stop kontak gosong — pasangan maut.','bad',3000);}},
   {type:'act',aid:'MEGGER',done:false,targets:()=>[mlo.meg],
    desc:'Yang tak terlihat mata: UJI ISOLASI semua grup (klik megger).',
    why:'Grup depan: 0,8 MΩ (lolos tipis). Grup belakang: 0,09 MΩ — JAUH di bawah 0,5 minimal: isolasi karetnya sudah menggetas, bocor halus ke mana-mana. Kabel ini tampak baik dari luar; megger membongkar usianya yang sebenarnya.',
    fx(){toast('📏 Grup belakang 0,09 MΩ (<0,5) — isolasi tamat usia.','bad',3000);}},
   {type:'act',aid:'EARTH',done:false,targets:()=>[mlo.et],
    desc:'Lengkapi data: ukur PEMBUMIAN... yang ternyata tak ada (klik earth tester).',
    why:'Dicari ke seluruh rumah: tak ada elektroda, tak ada kawat kuning-hijau satu pun — standar era itu memang longgar. Artinya 40 tahun rumah ini hidup tanpa jalur pembuangan arus bocor: setiap kebocoran selama ini memilih jalur lain... termasuk mungkin penghuninya.',
    fx(){toast('⏚ Pembumian: TIDAK ADA — wajib dibangun dari nol.','bad',2800);}},
   {type:'act',aid:'LAPOR',done:false,targets:()=>[mlo.rep],
    desc:'Terbitkan LAPORAN ber-prioritas untuk calon pembeli (klik laporan).',
    why:'Jujur dan terstruktur: BAHAYA (ganti panel+MCB+RCD, rewiring grup belakang, bangun pembumian — Rp 28 jt, sebelum dihuni) · SEGERA (tee-dus semua sambungan) · DISARANKAN (tambah grup). Calon pembeli tidak batal — ia memakai laporanmu menegosiasi harga Rp 40 juta lebih rendah. Informasi adalah daya tawar.',
    fx(){toast('📋 Laporan terbit — pembeli nego turun Rp 40 jt. Jasa terbayar!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Audit kelayakan tuntas!</b> Mata menemukan improvisasi tiga generasi, megger membongkar usia kabel, dan laporan ber-prioritas memberi pembeli kekuatan nego. Instalatir senior tak hanya memasang — ia menilai.');
    setTimeout(()=>showWin('slo'),2200);});
  actMesh(mlo.puntir,'JEJAK');
  say('VOLTA di sini 🏚️ Misi level senior: <b>mengaudit instalasi 40 tahun</b>. Rumah tua tak gagal mendadak — ia menurun diam-diam. Mata dulu, alat kemudian, laporan yang jujur sebagai penutup. Buka panelnya!');
  $('#modTitle').textContent='J01·M7 — Audit Instalasi Lama';
  $('#taskHead').textContent='MATA · ALAT · LAPORAN JUJUR';}
MISSIONS.slo.build=buildSLO;
Object.assign(REAL,{
 slo:[
  'Matikan sumber sebelum membuka panel tua — kondisinya tak terprediksi, perlakukan sebagai bertegangan',
  'Dokumentasikan tiap temuan dengan foto ber-lokasi — laporan tanpa bukti hanyalah opini',
  'Gunakan format klasifikasi bahaya yang konsisten (C1/C2/C3 ala EICR) agar prioritas jelas',
  'Jangan menambal instalasi yang isolasinya tamat — rewiring lebih murah dari kebakaran'],
});

/* =====================================================================
   MISI 8 — DESAIN DIGITAL: GAMBAR DULU, PASANG SEKALI
   ===================================================================== */
Object.assign(MISSIONS,{
 desain:{lvl:'JALUR 01 · INSTALASI BANGUNAN · MISI 8',icon:'📐',title:'Desain Digital: Gambar Dulu, Pasang Sekali',strict:false,
  loc:'📍 Kantor konsultan MEP · Proyek ruko 3 lantai baru',
  story:'Kariermu naik meja: dari memasang instalasi menjadi MENDESAINNYA. Klien membangun ruko 3 lantai dan butuh gambar kerja listrik lengkap — single line diagram, perhitungan beban, jatuh tegangan, sampai BOM material. Di software desain, kabel boleh salah ukur seribu kali tanpa sehelai tembaga pun terbuang. Di lapangan, satu kali saja sudah mahal.',
  goal:'Paket desain lengkap & benar: beban terhitung dengan faktor kebutuhan, SLD tersusun, ukuran kabel & proteksi lolos cek jatuh tegangan, dan BOM siap tender.',
  obj:['Hitung beban per lantai dengan faktor kebutuhan','Susun single line diagram & pembagian grup','Validasi jatuh tegangan & terbitkan BOM'],
  learn:['Desain dimulai dari daftar beban, bukan dari katalog kabel: tiap titik dihitung, lalu faktor kebutuhan diterapkan — tak semua beban menyala serentak','Single line diagram adalah bahasa universal instalasi: satu garis mewakili tiga fasa — pembaca di lapangan & di dinas yang sama-sama paham','Jatuh tegangan maksimal (umumnya ≤4% total) memvonis ukuran kabel: jalur panjang sering butuh kabel lebih besar dari sekadar kuat arusnya','BOM (bill of materials) yang akurat = tender yang adil & proyek tanpa drama "kurang material" — desainer yang baik menghitung sampai klem terakhir'],
  next:['Pelajari software desain profesional & library komponen lokal','Dalami koordinasi proteksi kaskade di desain (selektivitas)','Eksplorasi BIM elektrikal: desain 3D yang mendeteksi tabrakan antar disiplin']},
});
let mds={};
function buildDesain(){
  freshScene(0xa8c0d4,0x141e2a);
  cam={theta:0,phi:1.16,r:7.5,target:new THREE.Vector3(0,2,-1)};
  const floor=boxT(14,.1,9,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(13,4.6,.15,TEX.plaster());wall.position.set(0,2.3,-3);scene.add(wall);
  /* layar workstation besar */
  const frame=boxT(5.0,2.8,.16,TEX.metal(),{metalness:.4});frame.position.set(-1.2,2.4,-2.9);scene.add(frame);
  mds.D=makeDisplay(4.7,2.5,640,360);
  mds.D.mesh.position.set(-1.2,2.4,-2.79);scene.add(mds.D.mesh);
  actMesh(mds.D.mesh,'BEBAN');
  scene.add(label('WORKSTATION DESAIN MEP',.9).translateX(-1.2).translateY(4.05).translateZ(-2.8));
  mds.mode=0;
  function layar(){
    const g=mds.D.g,W=640,H=360;
    g.fillStyle='#f0f2f4';g.fillRect(0,0,W,H); /* CAD putih */
    g.font='600 15px Consolas';g.textAlign='left';
    if(mds.mode===0){g.fillStyle='#222a31';g.font='700 18px Consolas';
      g.fillText('DAFTAR BEBAN — RUKO 3 LANTAI',20,34);
      g.font='600 15px Consolas';
      [['LT.1 toko','penerangan+KK+AC','9.800 VA'],['LT.2 kantor','penerangan+KK+AC','8.400 VA'],
       ['LT.3 gudang','penerangan+KK','4.200 VA'],['Pompa+lift','3 fasa','6.500 VA']].forEach((r,i)=>{
        const y=76+i*38;g.fillStyle='#445';g.fillText(r[0],20,y);
        g.fillText(r[1],180,y);g.fillStyle='#1a6a3a';g.fillText(r[2],440,y);});
      g.fillStyle='#8a2a2a';g.font='700 16px Consolas';
      g.fillText('total terpasang 28,9 kVA → ???',20,H-24);}
    else if(mds.mode>=1){ /* SLD */
      g.strokeStyle='#222a31';g.lineWidth=3;
      g.beginPath();g.moveTo(60,50);g.lineTo(60,300);g.stroke();
      g.fillStyle='#222a31';g.fillText('PLN 23 kVA / 3φ',70,46);
      [['MCB 40A 3φ',80],['LT.1 — 3 grup',140],['LT.2 — 3 grup',190],['LT.3 — 2 grup',240],['Pompa/lift 3φ',290]].forEach((r,i)=>{
        g.strokeStyle='#222a31';g.beginPath();g.moveTo(60,r[1]);g.lineTo(140,r[1]);g.stroke();
        g.strokeRect(140,r[1]-12,26,24);
        g.fillText(r[0],180,r[1]+5);});
      if(mds.mode>=2){g.fillStyle='#1a6a3a';g.font='700 15px Consolas';
        g.fillText('feeder LT.3: 4mm² → ΔV 4,8% ✗ → 6mm² → 3,1% ✓',300,120);
        g.fillText('semua jalur ≤4% ✓',300,160);}
      if(mds.mode>=3){g.fillStyle='#8a5a00';
        g.fillText('BOM: 14 item · NYM 412 m · MCB 11 · panel 4',300,230);
        g.fillText('siap tender ✓',300,266);}}
    mds.D.tex.needsUpdate=true;}
  layar();
  /* kartu langkah */
  mds.cards=[];
  [['FAKTOR','FK',2.4],['SLD','SLD',3.5],['ΔV CEK','DV',2.4],['BOM','BOM',3.5]].forEach((o,i)=>{
    const y=i<2?2.9:1.8;
    const c=box(.9,.5,.08,0x2b3a4a);c.position.set(o[2],y,-2.85);scene.add(c);
    actMesh(c,o[1]);mds.cards.push(c);
    scene.add(label(o[0],.48,'#5fd4ff').translateX(o[2]).translateY(y+.4).translateZ(-2.8));});
  startSeq([
   {type:'act',aid:'BEBAN',done:false,targets:()=>[mds.D.mesh],
    desc:'Susun DAFTAR BEBAN lengkap per lantai (klik layar).',
    why:'Setiap titik lampu, kotak kontak, AC, pompa & lift didata: total terpasang 28,9 kVA. Tapi angka itu BELUM ukuran langganan — tak ada gedung yang menyalakan semuanya serentak. Daftar beban adalah fondasi; faktor kebutuhan adalah kebijaksanaannya.',
    fx(){toast('📋 28,9 kVA terpasang terdata — kini faktor kebutuhan.','ok',2800);}},
   {type:'act',aid:'FK',done:false,targets:()=>[mds.cards[0]],
    desc:'Terapkan FAKTOR KEBUTUHAN per jenis beban (klik kartu).',
    why:'Penerangan 90%, kotak kontak 60% (tak semua dicolok serentak), AC 85%, lift intermiten — total kebutuhan maksimum: 21,4 kVA → langganan 23 kVA 3 fasa, pas tanpa mubazir. Desainer yang melewatkan faktor ini membuat klien membayar daya yang tak pernah dipakai, selamanya.',
    fx(){toast('🧮 Demand 21,4 kVA → langganan 23 kVA 3φ — pas.','ok',3000);}},
   {type:'act',aid:'SLD',done:false,targets:()=>[mds.cards[1]],
    desc:'Gambar SINGLE LINE DIAGRAM & bagi grup (klik kartu).',
    why:'Dari APP turun ke MDP, melahirkan 4 feeder: tiap lantai + 3 fasa khusus pompa/lift. Grup dibagi dengan ilmu lamamu: penerangan terpisah dari kotak kontak, beban 3 fasa diseimbangkan antar fasa (ilmu misi balancing!). Satu garis di kertas = tiga fasa di dunia — bahasa yang dipahami dari kantor dinas sampai tukang di lapangan.',
    fx(){mds.mode=1;layar();toast('📐 SLD tersusun: 4 feeder · 8 grup · fasa seimbang.','ok',3000);}},
   {type:'act',aid:'DV',done:false,targets:()=>[mds.cards[2]],
    desc:'Validasi JATUH TEGANGAN tiap jalur (klik kartu).',
    why:'Software menghitung tiap jalur: feeder lantai 3 (jalur terpanjang, 38 m) dengan 4 mm² jatuh 4,8% — GAGAL batas 4%. Naikkan ke 6 mm²: 3,1% ✓. Kabel itu lolos kuat arus sejak awal — jarak yang menggugurkannya. Inilah kenapa desain dihitung, bukan dikira: kuat arus dan jatuh tegangan adalah dua hakim yang berbeda.',
    fx(){mds.mode=2;layar();toast('📏 LT.3: 4mm²→6mm² karena ΔV — semua jalur ≤4% ✓','ok',3200);}},
   {type:'act',aid:'BOM',done:false,targets:()=>[mds.cards[3]],
    desc:'Terbitkan BOM & paket gambar kerja (klik kartu).',
    why:'Software menjumlah otomatis: NYM 412 meter (per ukuran), 11 MCB (per rating), 4 panel, klem, conduit, sampai lasdop. Paket lengkap: SLD, layout per lantai, detail panel, BOM — kontraktor mana pun bisa menawar adil & memasang tanpa menebak. Desain yang baik membuat lapangan membosankan: semuanya sudah diputuskan di sini.',
    fx(){mds.mode=3;layar();toast('📦 Paket desain terbit: gambar + BOM 14 item — siap tender!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Dari tukang pasang menjadi perancang!</b> Beban dihitung dengan faktor, SLD jadi bahasa bersama, jatuh tegangan memvonis ukuran kabel, dan BOM menghitung sampai klem terakhir. Gambar dulu seribu kali — pasang sekali, benar.');
    setTimeout(()=>showWin('desain'),2200);});
  say('VOLTA di sini 📐 Naik meja: dari MEMASANG ke <b>MENDESAIN</b>. Di software, kesalahan itu gratis; di lapangan, mahal. Empat gerbang menanti: beban, faktor, SLD, jatuh tegangan. Mulai dari daftar beban!');
  $('#modTitle').textContent='J01·M8 — Desain Digital MEP';
  $('#taskHead').textContent='GAMBAR SERIBU KALI, PASANG SEKALI';}
MISSIONS.desain.build=buildDesain;
Object.assign(REAL,{
 desain:[
  'Acu PUIL & SNI terbaru untuk faktor kebutuhan & batas jatuh tegangan per jenis bangunan',
  'Survei lapangan tetap wajib sebelum desain final — as-built bangunan sering beda dari arsitek',
  'Sertakan perhitungan arus hubung singkat untuk pemilihan breaking capacity proteksi',
  'Versi-kan gambar (rev A/B/C) & catat perubahan — gambar kadaluarsa di lapangan = bencana koordinasi'],
});
