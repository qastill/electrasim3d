/* =====================================================================
   ElectraSim VR 3D — DISTRIBUSI
   Misi: M1 app (Pemasangan APP / kWh Meter) · M2 gardu (Manuver Pembebasan Gardu 20 kV)
   Dimuat on-demand oleh index.html lewat ensureMission().
   ===================================================================== */

Object.assign(MISSIONS,{
 app:{lvl:'JALUR 03 · DISTRIBUSI',icon:'🔌',title:'Pemasangan APP / kWh Meter',strict:false,
  loc:'📍 Pasang baru 900 VA · Jl. Veteran, Indramayu',
  story:'Pelanggan baru 900 VA sudah bayar BP. Kabel SR sudah ditarik dari tiang JTR. Sebagai petugas penyambungan, rangkai APP dengan urutan terminal yang benar — salah wiring bisa membuat meter tak mencatat (susut!).',
  goal:'Pelanggan menyala & kWh meter mencatat benar (standar terminal 1-3-4-6).',
  obj:['SR → terminal masuk kWh meter','Fasa keluar meter → MCB pembatas → instalasi','Energize & pastikan register berputar'],
  learn:['Terminal kWh 1 fasa: 1 fasa masuk · 3 keluar · 4 netral masuk · 6 keluar','MCB di APP = PEMBATAS daya kontrak, bukan sekadar pengaman','APP = titik transaksi energi PLN–pelanggan','Wiring meter salah = energi tak tercatat = NTL'],
  next:['Lanjut misi gardu distribusi 20 kV','Pelajari kWh 3 fasa pengukuran langsung & CT','Kaitkan dengan P2TL: modus pelanggaran APP']},
 gardu:{lvl:'JALUR 03 · DISTRIBUSI',icon:'🏭',title:'Manuver Pembebasan Gardu 20 kV',strict:true,
  loc:'📍 Gardu IDR-042 · Penyulang Karang, UP3 Indramayu',
  story:'Tim har akan mengganti terminasi kabel kubikel outgoing. Sebelum mereka menyentuh apapun, kamu wajib MEMBEBASKAN TEGANGAN. Di 20.000 volt tidak ada kesempatan kedua — salah urutan = pelanggaran K2/K3 fatal.',
  goal:'Kubikel outgoing bebas tegangan & aman dikerjakan — 6 langkah SOP urut tanpa pelanggaran.',
  obj:['Izin manuver dispatcher','APD lengkap','Buka CB → bukti tegangan nol → grounding → rambu'],
  learn:['Urutan emas: IZIN → APD → BUKA CB → CEK NOL → GROUNDING → RAMBU','Tegangan nol harus DIBUKTIKAN, bukan diasumsikan','Earthing switch membuang muatan sisa & menahan tegangan balik','LOTO mencegah orang lain mengoperasikan saat tim bekerja'],
  next:['Lanjut Jalur 04: switching bay GI 150 kV','Pelajari manuver PENORMALAN (kebalikannya)','Dalami format komunikasi dispatcher yang baku']},
});

/* =====================================================================
   MISI 2 — APP (Jalur 03)
   ===================================================================== */
let m2={};
function buildApp(){
  freshScene(0xaac4dc,0x10202e);
  cam={theta:0,phi:1.2,r:6,target:new THREE.Vector3(0,2.2,-1)};
  const Z=room(0x55606a,0xb9c4bd);

  const pole=cyl(.09,.12,5.2,0x6f7a84);pole.position.set(-4.6,2.6,-2.2);scene.add(pole);
  scene.add(label('TIANG JTR',.7).translateX(-4.6).translateY(5.0).translateZ(-2.2));
  scene.add(label('SR (Sambungan Rumah)',.8).translateX(-3.1).translateY(4.45).translateZ(Z));
  terminal('SR-F','fasa',-3.2,3.75,Z+.12);
  terminal('SR-N','netral',-2.8,3.75,Z+.12);

  const kwh=box(1.05,1.35,.22,0x2d3a4a);kwh.position.set(-.6,2.7,Z);scene.add(kwh);
  kwh.add(label('kWh METER 1 FASA',.8).translateY(.92));
  m2.lcdC=document.createElement('canvas');m2.lcdC.width=256;m2.lcdC.height=96;
  m2.lcdTex=new THREE.CanvasTexture(m2.lcdC);
  const lcd=new THREE.Mesh(new THREE.PlaneGeometry(.72,.27),
    new THREE.MeshBasicMaterial({map:m2.lcdTex}));
  lcd.position.set(-.6,2.92,Z+.115);scene.add(lcd);
  m2.kwhVal=0;m2.on=false;drawLCD('00000.0','STANDBY');
  const tb=box(.85,.2,.24,0x1c2630);tb.position.set(-.6,2.05,Z);scene.add(tb);
  const tx=[-.93,-.71,-.49,-.27],ids=['T1','T3','T4','T6'],ty=['fasa','fasa','netral','netral'],nm=['1','3','4','6'];
  tx.forEach((x,i)=>{terminal(ids[i],ty[i],x,2.05,Z+.16);
    scene.add(label(nm[i],.38).translateX(x).translateY(1.83).translateZ(Z+.12));});

  const mcb=box(.5,.8,.2,COL.cream);mcb.position.set(1.4,2.7,Z);scene.add(mcb);
  mcb.add(label('MCB PEMBATAS',.7).translateY(.62));
  m2.lever=box(.16,.22,.1,0x2255aa);m2.lever.position.set(1.4,2.7,Z+.16);
  m2.lever.rotation.x=.35;scene.add(m2.lever);
  actMesh(m2.lever,'MCB2'); actMesh(mcb,'MCB2');
  terminal('MCB-IN','fasa',1.4,3.2,Z+.12);
  terminal('MCB-OUT','fasa',1.4,2.2,Z+.12);

  const inst=box(.8,.45,.16,0x3a4a3e);inst.position.set(3.2,1.7,Z);scene.add(inst);
  inst.add(label('KE INSTALASI',.7).translateY(.42));
  terminal('INST-F','fasa',3.0,1.7,Z+.12);
  terminal('INST-N','netral',3.4,1.7,Z+.12);

  terms={};clickables.forEach(c=>{if(c.userData.kind==='terminal')terms[c.userData.id]=c;});
  moduleTick=(dt)=>{if(m2.on){m2.kwhVal+=dt*.8;drawLCD(m2.kwhVal.toFixed(1).padStart(7,'0'),'ON');}};

  startSeq([
   {type:'wire',a:'SR-F',b:'T1',color:COL.fasa,done:false,
    desc:'Sambungkan FASA SR ke TERMINAL 1 kWh meter (fasa masuk).',
    why:'Terminal 1 = pintu masuk fasa ke kumparan arus meter. Semua energi harus "melapor" lewat sini — kalau mem-bypass meter, itulah susut non-teknis (NTL).',
    wrong:'Standar kWh 1 fasa: terminal 1 = fasa MASUK.'},
   {type:'wire',a:'T3',b:'MCB-IN',color:COL.fasa,done:false,
    desc:'Dari TERMINAL 3 (fasa keluar), sambungkan ke IN MCB pembatas.',
    why:'MCB di sini PEMBATAS daya kontrak: pelanggan 900 VA dapat MCB 4A — pakai melebihi kontrak, MCB trip.'},
   {type:'wire',a:'SR-N',b:'T4',color:COL.netral,done:false,
    desc:'Sambungkan NETRAL SR ke TERMINAL 4 (netral masuk).',
    why:'Kumparan tegangan meter butuh referensi netral untuk mengukur 220V. Tanpa ini meter tak bisa menghitung daya.'},
   {type:'wire',a:'T6',b:'INST-N',color:COL.netral,done:false,
    desc:'Dari TERMINAL 6, teruskan netral ke instalasi pelanggan.',
    why:'Lengkap sudah polanya: 1-masuk 3-keluar (fasa), 4-masuk 6-keluar (netral). Hafalkan: ganjil=fasa, genap=netral.'},
   {type:'wire',a:'MCB-OUT',b:'INST-F',color:COL.fasa,done:false,
    desc:'Terakhir: OUT MCB ke fasa instalasi pelanggan.',
    why:'Rantai energi utuh: JTR → SR → kWh meter → MCB → instalasi. Setiap kWh kini melewati alat ukur — adil bagi semua.'},
   {type:'act',aid:'MCB2',done:false,targets:()=>[mcb],
    desc:'ENERGIZE! Klik MCB pembatas untuk ON. Lihat register meter.',
    why:'Momen kebenaran: register berputar = wiring benar. Petugas selalu cek sebelum menyegel.',
    fx(){m2.on=true;m2.lever.rotation.x=-.35;sfx.big();
      toast('⚡ MCB ON — kWh meter mencatat!','ok',2600);}},
  ],()=>{say('🎉 <b>Pelanggan baru resmi menyala!</b> Meter mencatat, segel siap dipasang.');
    setTimeout(()=>showWin('app'),2400);});

  say('VOLTA di sini ⚡ Kita pasang <b>APP — Alat Pembatas & Pengukur</b>. Kunci level ini: hafalan emas terminal kWh 1 fasa = <b>1 · 3 · 4 · 6</b>. Ikuti penanda ▼ dan jangan ON-kan MCB sebelum waktunya!');
  $('#modTitle').textContent='J03 — Pemasangan APP / kWh Meter';
  $('#taskHead').textContent='URUTAN 1-3-4-6';}
function drawLCD(num,status){
  const g=m2.lcdC.getContext('2d');
  g.fillStyle='#0d1a12';g.fillRect(0,0,256,96);
  g.fillStyle='#46ff8e';g.font='700 44px Consolas,monospace';
  g.textAlign='right';g.fillText(num,236,52);
  g.font='600 20px Consolas,monospace';g.textAlign='left';
  g.fillStyle=status==='ON'?'#46ff8e':'#7d8f84';g.fillText(status+' · kWh',16,82);
  m2.lcdTex.needsUpdate=true;}

/* =====================================================================
   MISI 3 — GARDU (Jalur 03)
   ===================================================================== */
let m3={};
function buildGardu(){
  freshScene(0x6e87a3,0x0c151f);
  cam={theta:.15,phi:1.22,r:7.5,target:new THREE.Vector3(.4,1.5,-.5)};
  const floor=box(14,.1,10,0x39424c);floor.position.y=-.05;scene.add(floor);
  const wall=box(13,4.2,.2,0x55626e);wall.position.set(0,2.1,-3.4);scene.add(wall);
  const line=box(10,.02,.12,0xffd23f,{emissive:0x6b5200,emissiveIntensity:.4});
  line.position.set(0,.02,.9);scene.add(line);

  const desk=box(1.3,.08,.7,0x6b4f33);desk.position.set(-3.6,1.0,-1.2);scene.add(desk);
  const leg=box(.08,1,.08,0x4a3624);leg.position.set(-4.15,.5,-1.5);scene.add(leg);
  const l2=leg.clone();l2.position.x=-3.05;scene.add(l2);
  const l3=leg.clone();l3.position.set(-4.15,.5,-.9);scene.add(l3);
  const l4=leg.clone();l4.position.set(-3.05,.5,-.9);scene.add(l4);
  m3.radio=box(.18,.34,.1,0x141a20,{emissive:0x06303d,emissiveIntensity:.5});
  m3.radio.position.set(-3.6,1.22,-1.2);scene.add(m3.radio);
  actMesh(m3.radio,'RADIO');
  scene.add(label('RADIO HT',.7,'#5fd4ff').translateX(-3.6).translateY(1.75).translateZ(-1.2));

  const rack=box(.9,1.6,.12,0x3a444e);rack.position.set(-1.9,1.5,-3.3);scene.add(rack);
  m3.helm=new THREE.Mesh(new THREE.SphereGeometry(.18,18,14,0,Math.PI*2,0,Math.PI/2),
    new THREE.MeshStandardMaterial({color:0xffd23f,roughness:.4}));
  m3.helm.position.set(-1.9,1.85,-3.2);scene.add(m3.helm);
  actMesh(m3.helm,'APD'); actMesh(rack,'APD');
  scene.add(label('RAK APD',.7,'#5fd4ff').translateX(-1.9).translateY(2.5).translateZ(-3.2));

  const names=['INCOMING','METERING','OUTGOING PENYULANG'];
  [-0.2,1.2,2.6].forEach((x,i)=>{
    const k=box(1.15,2.3,.9,0x9aa7b4);k.position.set(x,1.15,-2.8);scene.add(k);
    k.add(label(names[i],.78).translateY(1.45));});
  const KX=2.6,KZ=-2.3;
  m3.cbInd=new THREE.Mesh(new THREE.SphereGeometry(.06,14,12),
    new THREE.MeshStandardMaterial({color:0xff3b3b,emissive:0xff3b3b,emissiveIntensity:1}));
  m3.cbInd.position.set(KX-.3,1.95,KZ);scene.add(m3.cbInd);
  m3.handle=box(.1,.42,.1,0x18242f,{emissive:0x000000});
  m3.handle.position.set(KX+.25,1.45,KZ);scene.add(m3.handle);
  actMesh(m3.handle,'CB');
  scene.add(label('TUAS CB',.5,'#5fd4ff').translateX(KX+.25).translateY(1.78).translateZ(KZ));
  m3.vlamps=[];
  [-.14,0,.14].forEach(dx=>{
    const l=new THREE.Mesh(new THREE.SphereGeometry(.035,10,8),
      new THREE.MeshStandardMaterial({color:0xff8030,emissive:0xff8030,emissiveIntensity:1}));
    l.position.set(KX+dx,1.05,KZ);scene.add(l);actMesh(l,'VOLT');m3.vlamps.push(l);});
  scene.add(label('INDIKATOR TEGANGAN',.55).translateX(KX).translateY(.85).translateZ(KZ));
  m3.earth=box(.3,.1,.1,0xffd23f);
  m3.earth.position.set(KX-.25,.5,KZ);m3.earth.rotation.z=.5;scene.add(m3.earth);
  actMesh(m3.earth,'EARTH');
  scene.add(label('EARTHING SW',.5,'#5fd4ff').translateX(KX-.25).translateY(.28).translateZ(KZ));
  m3.sign=box(.7,.45,.04,0xd8d8d8);m3.sign.position.set(4.1,1.2,-1.6);scene.add(m3.sign);
  const sp2=cyl(.03,.03,1.1,0x666666);sp2.position.set(4.1,.55,-1.6);scene.add(sp2);
  m3.sign.add(label('RAMBU K3',.6,'#ff8d8d').translateY(.45));
  actMesh(m3.sign,'RAMBU'); actMesh(sp2,'RAMBU');
  const pl=new THREE.PointLight(0xbfd6ea,.5,12);pl.position.set(0,3.6,0);scene.add(pl);

  startSeq([
   {type:'act',aid:'RADIO',done:false,targets:()=>[m3.radio],
    desc:'Lapor & minta IZIN MANUVER ke dispatcher (klik RADIO HT).',
    why:'Dispatcher melihat keseluruhan jaringan — tanpa izinnya, manuvermu bisa bertabrakan dengan operasi lain dan membahayakan tim di lokasi berbeda.',
    fx(){toast('📻 "IDR-042, izin manuver pembebasan — DISETUJUI."','ok',2800);}},
   {type:'act',aid:'APD',done:false,targets:()=>[m3.helm],
    desc:'Kenakan APD lengkap: helm, sarung tangan 20kV, sepatu isolasi.',
    why:'Arc flash di tegangan menengah mencapai ribuan derajat sekejap. APD dipakai SEBELUM mendekati kubikel, bukan setelahnya.',
    fx(){toast('🦺 APD lengkap terpasang!','ok',2200);}},
   {type:'act',aid:'CB',done:false,targets:()=>[m3.handle],
    desc:'BUKA CB kubikel outgoing penyulang (klik TUAS CB).',
    why:'CB dirancang memutus arus beban penuh dengan aman — peredam busurnya menelan percikan. Satu-satunya alat yang boleh memutus rangkaian berbeban.',
    fx(){m3.cbInd.material.color.setHex(0x36e07a);m3.cbInd.material.emissive.setHex(0x36e07a);
      m3.handle.rotation.z=.6;toast('🔓 CB TERBUKA — indikator merah → hijau.','ok',2400);}},
   {type:'act',aid:'VOLT',done:false,targets:()=>[m3.vlamps[1]],
    desc:'BUKTIKAN tegangan NOL pada indikator (klik lampu indikator).',
    why:'Aturan keramat: "anggap bertegangan sampai terbukti tidak". CB terbuka bukan jaminan — bisa ada tegangan balik dari sisi lain.',
    fx(){m3.vlamps.forEach(l=>{l.material.emissiveIntensity=0;l.material.color.setHex(0x553322);});
      toast('🔍 Indikator PADAM — tegangan terbukti NOL.','ok',2400);}},
   {type:'act',aid:'EARTH',done:false,targets:()=>[m3.earth],
    desc:'Masukkan EARTHING SWITCH / pentanahan (klik tuas kuning).',
    why:'Kabel 20kV menyimpan muatan kapasitif walau diputus — seperti kapasitor raksasa. Earthing membuang muatan sisa & menahan tegangan tiba-tiba.',
    fx(){m3.earth.rotation.z=0;m3.earth.position.y=.62;
      toast('⏚ EARTHING MASUK.','ok',2200);}},
   {type:'act',aid:'RAMBU',done:false,targets:()=>[m3.sign],
    desc:'Pasang RAMBU "JANGAN DIOPERASIKAN" + lockout.',
    why:'LOTO melindungi tim dari "orang ketiga" — operator lain yang tak tahu ada pekerjaan. Gembok + rambu = komunikasi yang tak bisa diabaikan.',
    fx(){m3.sign.material.color.setHex(0xffd23f);
      m3.sign.add(label('JANGAN DIOPERASIKAN!',.62,'#b02020').translateZ(.06));
      toast('🚧 AREA KERJA AMAN.','ok',2400);}},
  ],()=>{say('🎉 <b>Manuver pembebasan TUNTAS!</b> "Dispatcher, penyulang Karang bebas tegangan, tim har dipersilakan bekerja."');
    setTimeout(()=>showWin('gardu'),2000);});

  say('VOLTA di sini, dan kali ini aku serius ⚡ Kamu memegang gardu 20.000 volt. <b>Ikuti 6 langkah SOP persis berurutan</b> — salah urutan = pelanggaran berat. Tarik napas, kita mulai.');
  $('#modTitle').textContent='J03 — Manuver Pembebasan Gardu 20 kV';
  $('#taskHead').textContent='SOP MANUVER PEMBEBASAN';}

MISSIONS.app.build=buildApp;
MISSIONS.gardu.build=buildGardu;

Object.assign(REAL,{
 app:[
  'Bekerja atas Perintah Kerja resmi, material kWh meter & segel keluar dari gudang tercatat',
  'Selalu cek diagram di tutup terminal meter — tiap merek bisa berbeda, jangan hafalan buta',
  'Setelah energize: uji putaran/impuls dengan beban, pasang segel metrologi, foto dokumentasi',
  'Catat nomor meter, stand awal & ID pelanggan ke sistem sebelum meninggalkan lokasi'],
 gardu:[
  'Gunakan komunikasi baku dengan dispatcher: sebut identitas gardu & peralatan, lalu read-back perintah',
  'Pembuktian tegangan nol pakai voltage detector 20 kV yang diuji sebelum & sesudah pemakaian',
  'Setiap langkah manuver dicatat di formulir manuver + working permit dengan cap waktu',
  'Pastikan sertifikat kompetensi (serkom) & hasil uji APD (sarung tangan 20 kV) masih berlaku'],
});

/* =====================================================================
   MISI 3 — PELACAKAN GANGGUAN PENYULANG 20 kV
   ===================================================================== */
Object.assign(MISSIONS,{
 sutm:{lvl:'JALUR 03 · DISTRIBUSI · MISI 3',icon:'🌩️',title:'Pelacakan Gangguan Penyulang 20 kV',strict:true,
  loc:'📍 Penyulang Karang · Hujan badai semalam, 05:40',
  story:'Badai semalam meninggalkan oleh-oleh: sebagian penyulang Karang padam, recloser lockout setelah tiga kali gagal menutup, dan telepon pengaduan tak berhenti berdering. Kamu petugas gangguan pagi ini. Pelanggan menunggu — tapi penyulang yang menyimpan dahan di kawatnya tidak boleh dinormalkan buru-buru.',
  goal:'Penyebab gangguan ditemukan & dibersihkan, fuse link FCO diganti, dan penyulang dinormalkan dengan urutan yang aman.',
  obj:['Baca status recloser & minta izin penelusuran','Patroli jalur: temukan & amankan penyebab gangguan','Ganti fuse link FCO lalu normalkan dengan izin dispatcher'],
  learn:['Recloser menutup ulang otomatis untuk gangguan SEMENTARA; tiga kali gagal = gangguan PERMANEN, ia mengunci (lockout)','Jangan pernah menormalkan sebelum penyebab ditemukan — menutup sirkit ke gangguan = merusak peralatan & membahayakan orang','FCO (fuse cut-out) melindungi percabangan: fuse link putus menunjuk arah lokasi gangguan','Urutan normalisasi selalu dengan izin dispatcher & pemberitahuan regu lain di penyulang yang sama'],
  next:['Pelajari koordinasi proteksi: fuse, recloser, sectionalizer, OCR','Dalami fault indicator & SCADA untuk lokalisasi gangguan cepat','Eksplorasi FDIR/self-healing network pada smart grid']},
});
let msu={};
function buildSUTM(){
  freshScene(0x6b7f99,0x0f1722); /* mendung pagi */
  cam={theta:.15,phi:1.2,r:10,target:new THREE.Vector3(0,2.2,-.5)};
  const ground=boxT(26,.1,14,TEX.gravel());ground.position.y=-.05;scene.add(ground);
  const road=box(26,.02,2.4,0x39424c);road.position.set(0,.02,2.2);scene.add(road);
  /* deretan tiang SUTM */
  msu.poles=[];
  [-9,-3,3,9].forEach(x=>{
    const p=cyl(.09,.12,5.6,0x6f7a84);p.position.set(x,2.8,-1.5);scene.add(p);
    const arm=box(1.4,.1,.1,0x55606a);arm.position.set(x,5.2,-1.5);scene.add(arm);
    msu.poles.push(p);});
  const kawat=cyl(.02,.02,24,0x3c4754);kawat.rotation.z=Math.PI/2;
  kawat.position.set(0,5.3,-1.5);scene.add(kawat);
  scene.add(label('SUTM 20 kV PENYULANG KARANG',.9).translateY(6.0).translateZ(-1.5));
  /* recloser di tiang pertama */
  msu.rec=box(.6,.8,.5,0x8a96a2,{metalness:.3});msu.rec.position.set(-9,3.6,-1.2);scene.add(msu.rec);
  actMesh(msu.rec,'REC');
  msu.recInd=new THREE.Mesh(new THREE.SphereGeometry(.07,12,10),
    new THREE.MeshStandardMaterial({color:0xff3b3b,emissive:0xff3b3b,emissiveIntensity:1}));
  msu.recInd.position.set(-9,3.0,-1.1);scene.add(msu.recInd);
  scene.add(label('RECLOSER (LOCKOUT)',.6,'#ff8d8d').translateX(-9).translateY(4.3).translateZ(-1.1));
  /* radio di mobil */
  const mobil=box(1.9,.7,.95,0xd8a020);mobil.position.set(-6,.55,2.2);scene.add(mobil);
  const kabin=box(.8,.55,.9,0xd8a020);kabin.position.set(-6.6,1.15,2.2);scene.add(kabin);
  msu.radio=box(.16,.3,.1,0x141a20,{emissive:0x06303d,emissiveIntensity:.5});
  msu.radio.position.set(-5.4,1.05,2.2);scene.add(msu.radio);
  actMesh(msu.radio,'RADIO');
  scene.add(label('RADIO HT',.55,'#5fd4ff').translateX(-5.4).translateY(1.4).translateZ(2.2));
  /* dahan di kawat antara tiang 3-4 + FCO putus */
  msu.dahan=cyl(.06,.1,1.8,0x4a3624);msu.dahan.rotation.z=.7;
  msu.dahan.position.set(5.6,4.9,-1.5);scene.add(msu.dahan);
  const daun=new THREE.Mesh(new THREE.SphereGeometry(.5,10,8),
    new THREE.MeshStandardMaterial({color:0x2e5a2e,roughness:.9}));
  daun.position.set(6.1,5.4,-1.5);scene.add(daun);
  actMesh(msu.dahan,'PATROLI');actMesh(daun,'PATROLI');
  msu.fco=box(.12,.5,.12,0xc9b08a);msu.fco.rotation.z=.8;
  msu.fco.position.set(3,4.6,-1.1);scene.add(msu.fco);
  actMesh(msu.fco,'FUSE');
  scene.add(label('FCO — fuse PUTUS (menggantung)',.6,'#ffd23f').translateX(3).translateY(4.0).translateZ(-1.0));
  /* stik teleskopik */
  msu.stik=cyl(.03,.03,2.2,0xd8a020);msu.stik.rotation.z=.5;
  msu.stik.position.set(-4.4,1.1,2.2);scene.add(msu.stik);
  actMesh(msu.stik,'DAHAN');
  scene.add(label('TELESCOPIC STICK 20kV',.55,'#5fd4ff').translateX(-4.2).translateY(2.0).translateZ(2.2));
  startSeq([
   {type:'act',aid:'RADIO',done:false,targets:()=>[msu.radio],
    desc:'Lapor dispatcher: konfirmasi padam & minta IZIN penelusuran.',
    why:'Dispatcher mengonfirmasi: recloser Karang lockout 04:55, ±1.800 pelanggan padam. Izin penelusuran membuat semua pihak tahu ada regu di jalur — tak ada yang akan iseng mencoba menormalkan dari jauh.',
    fx(){toast('📻 "Regu-2 izin telusur penyulang Karang — DICATAT dispatcher."','ok',2800);}},
   {type:'act',aid:'REC',done:false,targets:()=>[msu.rec],
    desc:'Baca status RECLOSER di tiang awal (klik recloser).',
    why:'Log recloser bercerita: trip 04:55, reclose 3 kali, gagal semua → lockout. Pola ini = gangguan permanen di hilir, bukan petir sambaran sesaat. Sesuatu masih MENEMPEL di jaringan.',
    fx(){toast('📟 3x reclose GAGAL → permanen. Penyebab masih di jaringan!','bad',2800);}},
   {type:'act',aid:'PATROLI',done:false,targets:()=>[msu.dahan],
    desc:'Patroli jalur ke arah hilir — temukan penyebabnya (klik objek mencurigakan).',
    why:'Di antara tiang 3 dan 4: dahan besar menyandar di kawat fasa, dan FCO percabangan menggantung putus. Mata patroli membaca dua bukti yang bersesuaian — lokasi gangguan terkonfirmasi.',
    fx(){toast('🌳 KETEMU: dahan di kawat + fuse FCO putus — titik gangguan!','bad',2800);}},
   {type:'act',aid:'DAHAN',done:false,targets:()=>[msu.stik],
    desc:'Singkirkan DAHAN dengan telescopic stick 20 kV (klik stik).',
    why:'Walau penyulang padam, perlakukan kawat sebagai bertegangan — bisa ada arus balik atau induksi. Stik isolasi 20 kV menjaga jarak; tangan kosong tidak pernah jadi pilihan.',
    fx(){msu.dahan.position.y=1.2;msu.dahan.rotation.z=1.4;
      toast('🪵 Dahan diturunkan — kawat bebas.','ok',2400);}},
   {type:'act',aid:'FUSE',done:false,targets:()=>[msu.fco],
    desc:'Ganti FUSE LINK FCO & tutup kembali (klik FCO).',
    why:'Fuse link diganti sesuai rating percabangan (bukan asal kawat!). Menutup FCO memakai stik dengan gerakan mantap satu arah — ragu-ragu di tengah jalan justru memancing busur.',
    fx(){msu.fco.rotation.z=0;msu.fco.position.set(3,4.8,-1.1);
      toast('🔧 Fuse link baru terpasang — FCO tertutup mantap.','ok',2600);}},
   {type:'act',aid:'RADIO2',done:false,targets:()=>[msu.radio],
    desc:'Lapor BERSIH ke dispatcher & saksikan penormalan recloser.',
    why:'"Penyebab ditemukan & dibersihkan, jalur aman." Dispatcher me-reset recloser jarak jauh — tegangan mengalir, 1.800 rumah menyala bersamaan dengan matahari pagi. Itulah bayaran petugas gangguan.',
    fx(){msu.recInd.material.color.setHex(0x36e07a);msu.recInd.material.emissive.setHex(0x36e07a);
      toast('💡 PENYULANG NORMAL — 1.800 pelanggan menyala kembali!','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Gangguan tuntas dengan benar!</b> Lockout dibaca, penyebab dicari (bukan ditebak), dibersihkan, baru dinormalkan. Penyulang yang sehat lahir dari petugas yang tak pernah memotong urutan.');
    setTimeout(()=>showWin('sutm'),2200);});
  const s0=seq.steps[0],of0=s0.fx;s0.fx=()=>{of0();msu.radio.userData.aid='RADIO2';};
  say('VOLTA di sini 🌩️ Badai semalam meninggalkan PR: recloser lockout, ribuan pelanggan gelap. Hukum besi pagi ini: <b>temukan penyebabnya dulu — penyulang tidak pernah dinormalkan ke arah gangguan</b>. Mulai dari radio.');
  $('#modTitle').textContent='J03·M3 — Pelacakan Gangguan Penyulang';
  $('#taskHead').textContent='BACA · TELUSURI · BERSIHKAN · NORMALKAN';}
MISSIONS.sutm.build=buildSUTM;
Object.assign(REAL,{
 sutm:[
  'Patroli gangguan membawa: stik 20kV teruji, voltage detector, grounding lokal, APD lengkap, senter',
  'Foto setiap temuan sebelum dibersihkan — bahan analisis pola gangguan & usulan ROW (right of way)',
  'Fuse link diganti sesuai tabel koordinasi (rating & tipe K/T), bukan sekadar yang tersedia di mobil',
  'Gangguan berulang di titik sama = usulkan perbaikan permanen: rabas pohon, ganti kawat AAAC-S, atau pasang LA'],
});

/* =====================================================================
   MISI 4 — SCADA DISTRIBUSI: MANUVER JARAK JAUH
   ===================================================================== */
Object.assign(MISSIONS,{
 scada:{lvl:'JALUR 03 · DISTRIBUSI · MISI 4',icon:'🖥️',title:'SCADA: Manuver Jarak Jauh & FDIR',strict:true,
  loc:'📍 Control center UP2D · Dispatcher trainee, 14:20',
  story:'Kali ini kamu duduk di kursi yang dulu kamu mintai izin: DISPATCHER. Di layar SCADA, penyulang Karang kembali terganggu — tapi hari ini tak ada yang perlu memanjat tiang dulu: LBS bermotor tersebar di jaringan menunggu perintah jarak jauhmu. Lokalisir gangguan, selamatkan pelanggan sebanyak mungkin, dalam hitungan menit bukan jam.',
  goal:'Seksi yang terganggu terisolasi via LBS remote dan pelanggan sehat dipulihkan dari dua arah — SAIDI terpangkas drastis.',
  obj:['Baca indikasi gangguan & fault indicator di SCADA','Isolasi seksi terganggu dengan dua LBS pengapitnya','Pulihkan seksi sehat dari hulu & dari penyulang tetangga'],
  learn:['SCADA memberi 3 kekuatan: telemetri (membaca), telesinyal (status), telekontrol (mengoperasikan dari jauh)','Fault indicator menunjuk seksi: FI menyala = arus gangguan LEWAT sini; FI padam pertama = gangguan di seksi setelahnya','Isolasi = membuka LBS di KEDUA ujung seksi terganggu; pelanggan di luar seksi itu tidak perlu ikut padam','Backfeed dari penyulang tetangga memulihkan seksi hilir — beban tetangga dicek dulu agar tak ikut tumbang'],
  next:['Pelajari FDIR penuh otomatis (self-healing) tanpa dispatcher','Dalami protokol komunikasi SCADA: IEC 60870 & DNP3','Hitung dampak SAIDI/SAIFI dari otomasi jaringan']},
});
let msc={};
function buildSCADA(){
  freshScene(0x1d2a3a,0x0a121c);
  cam={theta:0,phi:1.15,r:8.5,target:new THREE.Vector3(0,2.2,-1)};
  const floor=boxT(18,.1,11,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(16,4.8,.2,TEX.metal(),{metalness:.2});wall.position.set(0,2.4,-3.4);scene.add(wall);
  /* layar SCADA raksasa */
  const frame=boxT(7.2,3.4,.18,TEX.metal(),{metalness:.4});frame.position.set(0,2.5,-3.3);scene.add(frame);
  msc.D=makeDisplay(6.8,3.0,760,340);
  msc.D.mesh.position.set(0,2.5,-3.2);scene.add(msc.D.mesh);
  actMesh(msc.D.mesh,'BACA');
  scene.add(label('SCADA — PENYULANG KARANG',.95).translateY(4.5).translateZ(-3.2));
  /* meja dispatcher + tombol2 LBS */
  const desk=boxT(5,.08,1.2,TEX.wood());desk.position.set(0,1.0,-.6);scene.add(desk);
  msc.b1=box(.5,.3,.14,0x2b3a4a);msc.b1.position.set(-1.6,1.2,-.6);scene.add(msc.b1);
  actMesh(msc.b1,'LBS2');
  scene.add(label('LBS-2',.5,'#5fd4ff').translateX(-1.6).translateY(1.5).translateZ(-.6));
  msc.b2=box(.5,.3,.14,0x2b3a4a);msc.b2.position.set(-.5,1.2,-.6);scene.add(msc.b2);
  actMesh(msc.b2,'LBS3');
  scene.add(label('LBS-3',.5,'#5fd4ff').translateX(-.5).translateY(1.5).translateZ(-.6));
  msc.b3=box(.5,.3,.14,0x2b3a4a);msc.b3.position.set(.6,1.2,-.6);scene.add(msc.b3);
  actMesh(msc.b3,'CB');
  scene.add(label('CB GARDU',.5,'#5fd4ff').translateX(.6).translateY(1.5).translateZ(-.6));
  msc.b4=box(.5,.3,.14,0x2b3a4a);msc.b4.position.set(1.7,1.2,-.6);scene.add(msc.b4);
  actMesh(msc.b4,'TIE');
  scene.add(label('TIE SW',.5,'#5fd4ff').translateX(1.7).translateY(1.5).translateZ(-.6));
  msc.fase=0; /* 0 awal, 1 dibaca, 2 isolasi1, 3 isolasi2, 4 hulu, 5 backfeed */
  function gambar(){
    const g=msc.D.g,W=760,H=340;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='600 17px Consolas';g.textAlign='center';
    const segs=[['S1',60,250],['S2',250,440],['S3',440,630]];
    const open1=msc.fase>=2, open2=msc.fase>=3, cb=msc.fase>=4, tie=msc.fase>=5;
    function line(x1,x2,y,on){g.strokeStyle=on?'#46ff8e':'#3a4a5c';g.lineWidth=6;
      g.beginPath();g.moveTo(x1,y);g.lineTo(x2,y);g.stroke();}
    /* seksi S1 hulu - S2 fault - S3 hilir */
    line(40,250,150,cb);
    line(250,440,150,false);
    line(440,720,150,tie);
    /* gardu kiri & tie kanan */
    g.fillStyle=cb?'#46ff8e':'#ff5a5a';g.fillRect(20,130,20,40);
    g.fillStyle='#8aa3bd';g.fillText('CB GARDU',60,120);
    g.fillStyle=tie?'#46ff8e':'#5a4a2a';g.fillRect(720,130,20,40);
    g.fillText('TIE (tetangga)',680,120);
    /* LBS simbol */
    function lbs(x,nama,open){g.strokeStyle=open?'#ffd23f':'#8aa3bd';g.lineWidth=5;
      g.beginPath();g.moveTo(x-18,150);
      open?g.lineTo(x+10,128):g.lineTo(x+18,150);g.stroke();
      g.fillStyle='#8aa3bd';g.fillText(nama+(open?' ◊BUKA':' ▪tutup'),x,190);}
    lbs(250,'LBS-2',open1);lbs(440,'LBS-3',open2);
    /* fault indicator + petir */
    if(msc.fase>=1){g.fillStyle='#ff5a5a';g.font='700 26px Consolas';
      g.fillText('⚡ GANGGUAN',345,235);
      g.font='600 16px Consolas';
      g.fillText('FI-1 ✦nyala · FI-2 ✦nyala · FI-3 ○padam',345,265);}
    g.fillStyle='#8aa3bd';g.font='600 15px Consolas';
    g.fillText('S1: 800 plg',150,300);g.fillText('S2: 620 plg',345,300);g.fillText('S3: 510 plg',540,300);
    const pulih=(cb?800:0)+(tie?510:0);
    g.fillStyle=pulih?'#46ff8e':'#ff5a5a';g.font='700 18px Consolas';
    g.fillText('PADAM: '+(1930-pulih-(msc.fase>=3?0:0)-(msc.fase>=5&&msc.fase>=4?620:0)<0?0:1930-pulih)+' → pulih: '+pulih,W/2,330);
    msc.D.tex.needsUpdate=true;}
  gambar();
  startSeq([
   {type:'act',aid:'BACA',done:false,targets:()=>[msc.D.mesh],
    desc:'Baca SCADA: di seksi mana gangguannya? (klik layar)',
    why:'CB gardu trip — 1.930 pelanggan padam. Fault indicator bercerita: FI-1 & FI-2 menyala (arus gangguan lewat), FI-3 padam. Arus berhenti di antara FI-2 dan FI-3 → gangguan di SEKSI 2. Membaca FI = setengah pekerjaan selesai.',
    fx(){msc.fase=1;gambar();
      toast('🔍 FI menunjuk SEKSI 2 — di sanalah gangguannya.','bad',3000);}},
   {type:'act',aid:'LBS2',done:false,targets:()=>[msc.b1],
    desc:'Isolasi sisi hulu: BUKA LBS-2 jarak jauh.',
    why:'Telekontrol bekerja: perintah meluncur lewat radio, motor LBS membuka di tiang sana — 8 detik, tanpa satu orang pun memanjat. Pintu barat seksi gangguan tertutup.',
    fx(){msc.fase=2;gambar();
      toast('📡 LBS-2 TERBUKA (remote) — hulu terisolasi.','ok',2600);}},
   {type:'act',aid:'LBS3',done:false,targets:()=>[msc.b2],
    desc:'Isolasi sisi hilir: BUKA LBS-3.',
    why:'Pintu timur ikut tertutup — seksi 2 kini terkurung sendirian bersama gangguannya. 620 pelanggan di dalamnya menunggu regu lapangan; tapi 1.310 lainnya tidak perlu ikut menunggu.',
    fx(){msc.fase=3;gambar();
      toast('📡 LBS-3 TERBUKA — seksi gangguan terkurung penuh.','ok',2600);}},
   {type:'act',aid:'CB',done:false,targets:()=>[msc.b3],
    desc:'Pulihkan hulu: TUTUP kembali CB gardu — S1 menyala.',
    why:'Dengan seksi 2 terisolasi, CB aman ditutup: 800 pelanggan seksi 1 menyala kembali. Lima menit setelah gangguan — di era patroli manual, menit kelima itu regu bahkan belum naik mobil.',
    fx(){msc.fase=4;gambar();
      toast('💡 S1 PULIH via gardu — 800 pelanggan menyala.','ok',2800);}},
   {type:'act',aid:'TIE',done:false,targets:()=>[msc.b4],
    desc:'Pulihkan hilir: TUTUP TIE SWITCH — backfeed dari penyulang tetangga.',
    why:'Seksi 3 tak bisa disuplai dari gardu sendiri (jalannya lewat seksi 2 yang sakit) — maka pintu belakang dibuka: penyulang tetangga menyuapinya dari arah sebaliknya. Cek dulu: beban tetangga 64%, sanggup. 510 pelanggan menyala dari arah yang tak mereka duga.',
    fx(){msc.fase=5;gambar();
      toast('🔁 BACKFEED aktif — S3 pulih. Padam tersisa: hanya seksi gangguan!','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Manuver jarak jauh tuntas — 1.310 dari 1.930 pelanggan pulih dalam hitungan menit!</b> Seksi sakit terkurung, dua arah suplai bekerja. Begitulah SCADA mengubah jam menjadi menit.');
    setTimeout(()=>showWin('scada'),2200);});
  say('VOLTA di sini 🖥️ Hari ini kamu sang <b>dispatcher</b>: penyulang terganggu dan senjatamu adalah LBS remote di layar SCADA. Mantranya: <b>baca FI → kurung seksinya → pulihkan dua arah</b>. Mulai dari layar.');
  $('#modTitle').textContent='J03·M4 — SCADA & Manuver Jarak Jauh';
  $('#taskHead').textContent='BACA FI · KURUNG · PULIHKAN';}
MISSIONS.scada.build=buildSCADA;
Object.assign(REAL,{
 scada:[
  'Telekontrol tetap pakai komunikasi formal & log: perintah remote tercatat seperti manuver manual',
  'Status LBS diverifikasi ganda (indikasi SCADA + telemetri arus) sebelum langkah berikutnya',
  'Cek kemampuan penyulang tetangga (beban & setting proteksi) SEBELUM backfeed — jangan menulari',
  'Regu lapangan tetap dikirim ke seksi terisolasi — SCADA melokalisir, manusia memperbaiki'],
});

/* =====================================================================
   MISI 5 — PEMASANGAN TRAFO DISTRIBUSI BARU
   ===================================================================== */
Object.assign(MISSIONS,{
 trafo:{lvl:'JALUR 03 · DISTRIBUSI · MISI 5',icon:'🔩',title:'Pemasangan Trafo Distribusi Baru',strict:true,
  loc:'📍 Perumahan baru Griya Asri · Gardu portal 160 kVA',
  story:'Perumahan baru 240 unit siap huni — dan rekomendasi analisis beban (ingat misi J05?) akhirnya cair jadi anggaran: gardu portal baru 160 kVA. Hari ini kamu pengawas pemasangannya: dari trafo digantung crane sampai energize perdana. Trafo distribusi adalah jantung lingkungan — dipasang benar ia diam 30 tahun; dipasang salah, ia berita di grup WhatsApp warga.',
  goal:'Gardu portal beroperasi: trafo terpasang dengan proteksi lengkap (arester, FCO), pembumian terukur, uji lolos, dan energize perdana mulus.',
  obj:['Posisikan trafo & pasang proteksi sisi 20 kV','Kerjakan pembumian: arester, bodi, netral','Uji isolasi & ratio, lalu energize bertahap'],
  learn:['Urutan proteksi dari jaringan: arester (petir) → FCO (hubung singkat) → trafo: dua pengawal sebelum jantung','Tiga pembumian berbeda tugas: arester (buang surja), bodi (arus bocor), netral sekunder (referensi sistem & PE pelanggan)','Sebelum energize selalu: megger HV-LV-bodi, cek ratio & vektor grup — trafo baru pun bisa salah dari pabrik','Energize bertahap: FCO masuk satu-satu, dengar dengungan, ukur tegangan sekunder TANPA beban dulu, baru sambung jurusan'],
  next:['Pelajari penyetelan tap changer sesuai tegangan ujung','Dalami pemilihan rating FCO & koordinasi dengan proteksi penyulang','Hitung pembebanan & umur trafo dari profil beban perumahan']},
});
let mtb={};
function buildTrafo(){
  freshScene(0x9fc0dc,0x12202e);
  cam={theta:.2,phi:1.1,r:10,target:new THREE.Vector3(0,3,-1)};
  const ground=boxT(22,.1,14,TEX.gravel());ground.position.y=-.05;scene.add(ground);
  /* dua tiang portal */
  [-1.2,1.2].forEach(x=>{
    const p=cyl(.11,.14,7.5,0x8a939e);p.position.set(x,3.75,-2);scene.add(p);});
  const palang1=boxT(3.2,.15,.15,TEX.metal(),{metalness:.5});palang1.position.set(0,4.6,-2);scene.add(palang1);
  const palang2=palang1.clone();palang2.position.y=5.2;scene.add(palang2);
  /* SUTM di atas */
  const kawat=cyl(.018,.018,18,0x3c4754);kawat.rotation.z=Math.PI/2;kawat.position.set(0,7.2,-2);scene.add(kawat);
  scene.add(label('SUTM 20 kV',.7).translateY(7.7).translateZ(-2));
  /* trafo menggantung di crane (awal) */
  mtb.trafo=boxT(1.6,1.6,1.1,TEX.metal(),{metalness:.3});mtb.trafo.position.set(3.2,2.2,-2);scene.add(mtb.trafo);
  [-.5,0,.5].forEach(dx=>{const fin=box(.06,1.4,1.0,0x5a6a7a);fin.position.set(3.2+dx,2.2,-2);scene.add(fin);});
  actMesh(mtb.trafo,'PASANG');
  scene.add(label('TRAFO 160 kVA (di crane)',.7,'#ffd23f').translateX(3.2).translateY(3.4).translateZ(-2));
  /* arester & FCO slot */
  mtb.arr=cyl(.07,.09,.7,0x8a6a4a);mtb.arr.position.set(-.7,5.9,-2);mtb.arr.visible=false;scene.add(mtb.arr);
  mtb.fco=box(.12,.55,.12,0xc9b08a);mtb.fco.position.set(.7,5.9,-2);mtb.fco.rotation.z=.15;mtb.fco.visible=false;scene.add(mtb.fco);
  actMesh(mtb.fco,'ON');
  mtb.protBtn=box(.5,.35,.2,0x2a5a8a);mtb.protBtn.position.set(-3.4,1.2,-.6);scene.add(mtb.protBtn);
  actMesh(mtb.protBtn,'PROT');
  scene.add(label('KOTAK ARESTER + FCO',.55,'#5fd4ff').translateX(-3.4).translateY(1.7).translateZ(-.6));
  /* pembumian */
  mtb.gnd=boxT(.45,.28,.45,TEX.concrete());mtb.gnd.position.set(1.8,.14,-.6);scene.add(mtb.gnd);
  actMesh(mtb.gnd,'GND');
  scene.add(label('PEMBUMIAN 3 SISTEM',.55,'#8df0b8').translateX(2.1).translateY(.65).translateZ(-.3));
  /* megger */
  const tbl=boxT(.9,.07,.6,TEX.wood());tbl.position.set(4.8,.95,.8);scene.add(tbl);
  const tleg=boxT(.08,.95,.08,TEX.wood());tleg.position.set(4.8,.47,.8);scene.add(tleg);
  mtb.meg=box(.32,.2,.24,0xcc8830);mtb.meg.position.set(4.8,1.08,.8);scene.add(mtb.meg);
  actMesh(mtb.meg,'UJI');
  scene.add(label('MEGGER + RATIO TESTER',.55,'#5fd4ff').translateX(4.8).translateY(1.4).translateZ(.8));
  startSeq([
   {type:'act',aid:'PASANG',done:false,targets:()=>[mtb.trafo],
    desc:'Pandu crane: dudukkan TRAFO di dudukan portal (klik trafo).',
    why:'1,1 ton menggantung — area steril, tagline dipegang dua orang, dan tak seorang pun berdiri di bawah beban. Trafo duduk di dudukan, baut dikencang silang. Bushing 20 kV menghadap atas: jalur kabel dari FCO sudah terbayang rapi.',
    fx(){mtb.trafo.position.set(0,3.6,-2);
      toast('🏗️ Trafo terpasang di portal — baut silang, posisi presisi.','ok',2800);}},
   {type:'act',aid:'PROT',done:false,targets:()=>[mtb.protBtn],
    desc:'Pasang pengawal sisi 20 kV: ARESTER lalu FCO (klik kotak).',
    why:'Urutan dari jaringan: arester paling hulu (menyambut surja petir sebelum apa pun), FCO setelahnya (memutus saat hubung singkat — fuse link 6,3 A sesuai tabel 160 kVA). Dua pengawal dengan musuh berbeda, berdiri di gerbang yang benar.',
    fx(){mtb.arr.visible=true;mtb.fco.visible=true;mtb.protBtn.visible=false;
      toast('🛡️ Arester + FCO 6,3A terpasang — gerbang dijaga.','ok',2800);}},
   {type:'act',aid:'GND',done:false,targets:()=>[mtb.gnd],
    desc:'Kerjakan PEMBUMIAN tiga sistem & ukur (klik bak).',
    why:'Tiga kawat turun beda tugas: arester (jalur surja — selurus mungkin!), bodi trafo (arus bocor), netral sekunder (referensi 4 kawat ke pelanggan). Terukur: 1,8 Ω gabungan — surja petir nanti punya jalan pulang yang lapang.',
    fx(){toast('⏚ 3 pembumian tuntas — terukur 1,8 Ω ✓','ok',2800);}},
   {type:'act',aid:'UJI',done:false,targets:()=>[mtb.meg],
    desc:'UJI sebelum bertegangan: megger & ratio test (klik alat).',
    why:'Megger HV-LV 2.500 MΩ, HV-bodi 1.800 MΩ — isolasi perawan. Ratio test: 20.000/400 V sesuai pelat, vektor Dyn5 benar. Lima belas menit pengujian ini adalah bedanya "kami yakin" dengan "kami sudah buktikan".',
    fx(){toast('🔍 Megger ✓ ratio ✓ vektor Dyn5 ✓ — siap energize.','ok',2800);}},
   {type:'act',aid:'ON',done:false,targets:()=>[mtb.fco],
    desc:'ENERGIZE perdana: masukkan FCO dengan stik (klik FCO).',
    why:'Izin dispatcher masuk, area bersih, FCO ditutup satu-satu dengan gerakan mantap... dengungan halus 50 Hz — suara trafo sehat. Sekunder terukur 231/400 V tanpa beban ✓. Besok 240 keluarga pindahan; mereka tak akan pernah tahu kerja malam ini — dan justru itulah suksesnya.',
    fx(){mtb.fco.rotation.z=0;spark(new THREE.Vector3(.7,5.9,-2),0x9fd8ff);
      toast('⚡ ENERGIZED — 231/400 V, dengungan sehat. Gardu LAHIR!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Gardu portal beroperasi!</b> Diangkat dengan hormat, dikawal arester & FCO, dibumikan tiga jalur, diuji sebelum dipercaya. Tiga puluh tahun ke depan ia akan diam — karena malam ini kamu tidak diam-diam saja.');
    setTimeout(()=>showWin('trafo'),2200);});
  say('VOLTA di sini 🔩 Rekomendasi analismu jadi nyata: <b>gardu baru untuk 240 keluarga</b>. Trafo masih menggantung di crane — pandu ia duduk, kawal dengan proteksi, bumikan, uji, baru beri tegangan. Urutan adalah segalanya.');
  $('#modTitle').textContent='J03·M5 — Pemasangan Trafo Distribusi';
  $('#taskHead').textContent='PASANG · KAWAL · BUMIKAN · UJI';}
MISSIONS.trafo.build=buildTrafo;
Object.assign(REAL,{
 trafo:[
  'Cek fisik trafo saat terima: level & kebocoran minyak, silica gel, segel — klaim sebelum dipasang',
  'Torsi baut bushing & terminal sesuai spesifikasi; sambungan kendor di 20 kV = titik panas fatal',
  'Setel tap changer berdasarkan tegangan ujung jaringan terukur, bukan posisi default pabrik',
  'Dokumentasikan: nomor seri, hasil uji, setting — kartu gardu adalah riwayat hidup aset 30 tahun'],
});

/* =====================================================================
   MISI 6 — KABEL TANAH 20 kV: MENCARI TITIK GANGGUAN
   ===================================================================== */
Object.assign(MISSIONS,{
 kabel:{lvl:'JALUR 03 · DISTRIBUSI · MISI 6',icon:'🕳️',title:'Kabel Tanah 20 kV: Mencari Titik Gangguan',strict:true,
  loc:'📍 Kawasan kota lama · Penyulang kabel tanah XLPE',
  story:'Penyulang kota lama memakai kabel tanah — rapi tak terlihat, sampai hari ia terganggu: tak ada dahan untuk dilihat, tak ada FCO menggantung. Gangguan bersembunyi di suatu titik sepanjang 3,2 km di bawah aspal. Menggali semua jelas mustahil — maka teknologi yang menunjuk: TDR melempar pulsa, pulsa memantul dari luka, dan pantulan mengaku di meter ke berapa.',
  goal:'Titik gangguan kabel ditemukan presisi (pre-location + pinpointing), penggalian hanya satu lubang, jointing baru terpasang & kabel lolos uji sebelum operasi.',
  obj:['Uji isolasi & pre-location dengan TDR','Pinpoint akustik di atas jalur kabel','Gali satu lubang, jointing, uji & energize'],
  learn:['TDR (time domain reflectometry) melempar pulsa: pantulan dari titik gangguan kembali dalam waktu yang sebanding jarak — kabel mengaku lukanya sendiri','Pre-location memberi perkiraan ±meter; pinpointing akustik (surge generator + geophone) mendengar "dentum" discharge tepat di atas titiknya','Kabel XLPE paling sering terluka oleh PIHAK KETIGA: galian proyek lain — luka kecil bertahun lalu menua menjadi gangguan hari ini','Jointing kabel 20 kV adalah bedah mikro: kebersihan, geometri lapisan semikon, dan tangan tersertifikasi — joint buruk = gangguan berikutnya menunggu'],
  next:['Pelajari uji VLF & partial discharge untuk menilai sisa umur kabel','Dalami pemetaan GIS jaringan kabel + patok rute','Eksplorasi DTS (distributed temperature sensing) di kabel penting']},
});
let mkb={};
function buildKabel(){
  freshScene(0x8a98a8,0x10161e);
  cam={theta:.1,phi:1.14,r:10,target:new THREE.Vector3(0,1,-.5)};
  const ground=boxT(26,.1,14,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  const jalan=box(26,.02,3,0x39424c);jalan.position.set(0,.02,1.5);scene.add(jalan);
  /* marka rute kabel */
  for(let x=-10;x<=10;x+=2.5){
    const m=box(.3,.04,.3,0xd8b020);m.position.set(x,.06,-.8);scene.add(m);}
  scene.add(label('RUTE KABEL TANAH 3,2 km (patok kuning)',.75).translateY(2.2).translateZ(-.8));
  /* gardu ujung */
  const gardu=boxT(1.6,1.8,1.2,TEX.metal(),{metalness:.3});gardu.position.set(-9.5,.95,-.8);scene.add(gardu);
  scene.add(label('GARDU ASAL',.6).translateX(-9.5).translateY(2.2).translateZ(-.8));
  /* mobil uji + TDR */
  const van=box(2.4,1.1,1.1,0xe8edf2);van.position.set(-6.5,.75,2.4);scene.add(van);
  mkb.tdr=box(.4,.3,.3,0xd8b020);mkb.tdr.position.set(-5.2,.95,2.0);scene.add(mkb.tdr);
  actMesh(mkb.tdr,'TDR');
  scene.add(label('UNIT TDR + SURGE GEN',.6,'#5fd4ff').translateX(-5.2).translateY(1.4).translateZ(2.0));
  /* layar TDR */
  mkb.D=makeDisplay(2.6,1.4,480,260);
  mkb.D.mesh.position.set(-2.4,2.4,2.6);mkb.D.mesh.rotation.y=Math.PI;scene.add(mkb.D.mesh);
  const pole=cyl(.04,.04,1.7,0x666666);pole.position.set(-2.4,1.0,2.6);scene.add(pole);
  function tdrScr(mode){
    const g=mkb.D.g,W=480,H=260;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.strokeStyle='#2a3a4c';g.lineWidth=2;
    g.beginPath();g.moveTo(20,H/2);g.lineTo(W-12,H/2);g.stroke();
    g.strokeStyle='#46ff8e';g.lineWidth=3;g.beginPath();g.moveTo(20,H/2);
    for(let x=20;x<W-12;x++){
      let y=H/2;
      if(x>40&&x<52)y=H/2-40;            /* pulsa kirim */
      if(mode>=1&&x>268&&x<284)y=H/2+52; /* pantulan gangguan */
      g.lineTo(x,y);}
    g.stroke();
    g.font='600 15px Consolas';g.textAlign='left';
    g.fillStyle='#5fd4ff';g.fillText('pulsa →',44,60);
    if(mode>=1){g.fillStyle='#ff5a5a';g.fillText('← pantulan negatif',270,H-40);
      g.fillStyle='#ffd23f';g.font='700 17px Consolas';
      g.fillText('JARAK: 1.840 m ±15 m',150,36);}
    mkb.D.tex.needsUpdate=true;}
  tdrScr(0);
  /* titik gangguan (tersembunyi) + geophone */
  mkb.spot=box(.5,.06,.5,0x39424c);mkb.spot.position.set(1.8,.07,-.8);scene.add(mkb.spot);
  actMesh(mkb.spot,'PINPOINT');
  mkb.geo=cyl(.12,.16,.2,0x2a72c8);mkb.geo.position.set(3.4,.2,1.0);scene.add(mkb.geo);
  actMesh(mkb.geo,'GEO');
  scene.add(label('GEOPHONE',.55,'#5fd4ff').translateX(3.4).translateY(.65).translateZ(1.0));
  /* galian + joint */
  mkb.joint=cyl(.09,.09,.8,0x2a2a32);mkb.joint.rotation.z=Math.PI/2;
  mkb.joint.position.set(1.8,.25,-.8);mkb.joint.visible=false;scene.add(mkb.joint);
  startSeq([
   {type:'act',aid:'TDR',done:false,targets:()=>[mkb.tdr],
    desc:'Kabel sudah bebas & dibumikan dua ujung — jalankan TDR (klik unit).',
    why:'Megger dulu: fasa R bocor ke tanah, dua fasa lain sehat — gangguan satu fasa. TDR melempar pulsa nano-detik ke fasa R: layar menunggu gema. Sebelum semua ini: kabel DIPASTIKAN bebas tegangan dua sisi — kabel tanah pun tunduk pada ritual pembebasan.',
    fx(){toast('📡 Megger: R-tanah bocor · TDR siap melempar pulsa…','info',2800);}},
   {type:'act',aid:'BACA',done:false,targets:()=>[mkb.D.mesh],
    desc:'Baca PANTULAN di layar TDR: di meter berapa lukanya?',
    why:'Pantulan negatif muncul di 1.840 m ±15 m dari gardu — luka itu mengaku lewat gema. Dikalikan kecepatan rambat kabel XLPE yang sudah dikalibrasi: pre-location selesai. Dari 3.200 m misteri, tersisa 30 m untuk diburu telinga.',
    fx(){tdrScr(1);toast('🎯 Pre-location: 1.840 m ±15 m dari gardu asal.','ok',3000);}},
   {type:'act',aid:'GEO',done:false,targets:()=>[mkb.geo],
    desc:'Pinpointing: surge generator + GEOPHONE di atas rute (klik geophone).',
    why:'Surge gen mengirim pulsa energi — di titik gangguan, discharge menjeduk seperti detak jantung bawah tanah. Geophone digeser sepatok demi sepatok: dentum paling keras + selisih waktu elektromagnet-akustik terkecil = X marks the spot. Telinga menggantikan ratusan meter galian.',
    fx(){beep(60,.25,'sine',.2);beep(60,.25,'sine',.2,.9);
      toast('🔊 DUK… DUK… terkeras di patok 1.838 m — titik dikunci!','ok',3000);}},
   {type:'act',aid:'PINPOINT',done:false,targets:()=>[mkb.spot],
    desc:'Gali SATU lubang di titik terkunci (klik titik).',
    why:'Galian 2×1 m, hati-hati mendekati kabel — dan tersangka ditemukan: bekas luka galian proyek lama, isolasi tertusuk, menua bertahun-tahun sebelum akhirnya tembus. Satu lubang, bukan tiga kilometer: itulah harga teknologi yang dibayar lunas.',
    fx(){mkb.spot.material.color.setHex(0x6a4a2a);
      toast('⛏️ Luka ditemukan: bekas galian pihak ketiga — isolasi tembus.','bad',3000);}},
   {type:'act',aid:'JOINT',done:false,targets:()=>[mkb.spot],
    desc:'JOINTING: potong bagian luka, sambung dengan joint baru, uji & energize.',
    why:'Bedah mikro dimulai: potong segmen luka, kupas lapisan dengan geometri presisi, joint resin/heat-shrink oleh jointer tersertifikasi — kebersihan setara ruang operasi. Lalu uji VLF lolos, urug, energize: kota lama menyala lagi, dan rute di GIS diberi catatan merah "rawan galian".',
    fx(){mkb.joint.visible=true;
      toast('🔧 Joint terpasang · uji lolos · ENERGIZED — kota menyala!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Gangguan bawah tanah tertangkap presisi!</b> TDR menunjuk meter, geophone menunjuk jengkal, dan satu lubang menggantikan tiga kilometer keraguan. Kabel tanah memang pemalu — tapi ia selalu jujur pada yang tahu cara bertanya.');
    setTimeout(()=>showWin('kabel'),2200);});
  actMesh(mkb.D.mesh,'BACA');
  const s3k=seq.steps[3],of3k=s3k.fx;s3k.fx=()=>{of3k();mkb.spot.userData.aid='JOINT';};
  say('VOLTA di sini 🕳️ Gangguan kali ini <b>tak terlihat</b>: bersembunyi di sepanjang 3,2 km kabel bawah aspal. Senjatanya fisika: pulsa TDR yang memantul dari luka, dan geophone yang mendengar dentumnya. Mulai dari mobil uji!');
  $('#modTitle').textContent='J03·M6 — Fault Location Kabel Tanah';
  $('#taskHead').textContent='PULSA · GEMA · DENTUM · SATU LUBANG';}
MISSIONS.kabel.build=buildKabel;
Object.assign(REAL,{
 kabel:[
  'Kalibrasi velocity factor TDR dengan panjang kabel yang diketahui — salah VF = salah ratusan meter',
  'Koordinasi galian dengan utilitas lain (air, telkom, gas) — peta bawah tanah jarang akurat',
  'Jointer wajib sertifikasi & joint difoto tiap lapisan sebagai dokumentasi mutu',
  'Update GIS dengan posisi joint & temuan — kabel yang terdokumentasi adalah kabel yang cepat sembuh'],
});

/* =====================================================================
   MISI 7 — STUDI ALIRAN DAYA & REKONFIGURASI
   ===================================================================== */
Object.assign(MISSIONS,{
 loadflow:{lvl:'JALUR 03 · DISTRIBUSI · MISI 7',icon:'🧭',title:'Studi Aliran Daya & Rekonfigurasi Jaringan',strict:false,
  loc:'📍 Kantor perencanaan UP3 · Software simulasi jaringan',
  story:'Naik satu meja lagi: kini kamu PERENCANA. Penyulang Karang yang sudah kau selamatkan berkali-kali kini dibedah di software aliran daya — dunia digital tempat jaringan boleh dicoba-coba tanpa satu pelanggan pun berkedip. Misi: temukan konfigurasi normal BARU yang memangkas losses & memperbaiki tegangan ujung, lalu buktikan sebelum dieksekusi nyata.',
  goal:'Konfigurasi jaringan baru tervalidasi simulasi: losses turun, tegangan ujung membaik, pembebanan seimbang — dan rencana eksekusi manuver tersusun.',
  obj:['Bangun & validasi model jaringan terhadap pengukuran','Simulasikan skenario pemindahan titik buka (open point)','Pilih konfigurasi terbaik & susun rencana eksekusi'],
  learn:['Jaringan distribusi radial punya titik buka (open point) antar penyulang — MEMINDAHKANNYA mengubah siapa melayani apa: rekonfigurasi tanpa membangun apa pun','Model harus DIVALIDASI dulu: hasil simulasi dibandingkan pengukuran nyata — model yang melenceng 10% akan merekomendasikan kesalahan dengan percaya diri','Losses jaringan ∝ I²R: memindah beban ke jalur yang lebih pendek/gemuk menurunkan arus di segmen panjang — matematika sederhana, dampak permanen','Konfigurasi terbaik bukan hanya losses terkecil: cek juga tegangan ujung, pembebanan tiap segmen, dan kesiapan proteksi di topologi baru'],
  next:['Pelajari optimal network reconfiguration dengan algoritma','Dalami kontingensi N-1: bagaimana topologi baru saat gangguan','Eksplorasi penempatan kapasitor & PLTS tersebar dalam simulasi']},
});
let mlf={};
function buildLoadflow(){
  freshScene(0x9fb8d0,0x121e2c);
  cam={theta:0,phi:1.16,r:8,target:new THREE.Vector3(0,2,-1)};
  const floor=boxT(16,.1,10,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(14,4.6,.2,TEX.plaster());wall.position.set(0,2.3,-3.2);scene.add(wall);
  /* layar simulasi besar */
  const frame=boxT(5.6,3.0,.16,TEX.metal(),{metalness:.4});frame.position.set(-.8,2.4,-3.1);scene.add(frame);
  mlf.D=makeDisplay(5.2,2.6,680,360);
  mlf.D.mesh.position.set(-.8,2.4,-3.0);scene.add(mlf.D.mesh);
  actMesh(mlf.D.mesh,'MODEL');
  scene.add(label('SOFTWARE ALIRAN DAYA',.9).translateX(-.8).translateY(4.1).translateZ(-3.0));
  mlf.skenario=0; /* 0 existing, 1 alternatif A, 2 final */
  function peta(){
    const g=mlf.D.g,W=680,H=360;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='600 15px Consolas';g.textAlign='left';
    /* dua penyulang dgn open point */
    function jalur(y,nama,beban,warna){
      g.strokeStyle=warna;g.lineWidth=6;
      g.beginPath();g.moveTo(60,y);g.lineTo(520,y);g.stroke();
      g.fillStyle='#13202f';g.fillRect(20,y-16,36,32);
      g.fillStyle='#8aa3bd';g.fillText(nama,20,y-24);
      g.fillText(beban,540,y+6);}
    const opShift=mlf.skenario>=1;
    jalur(110,'KARANG',opShift?'62%':'84%',opShift?'#46ff8e':'#ff8d3a');
    jalur(230,'CENDANA',opShift?'58%':'38%','#46ff8e');
    /* open point */
    const opX=opShift?330:470;
    g.strokeStyle='#ffd23f';g.lineWidth=4;g.setLineDash([8,6]);
    g.beginPath();g.moveTo(opX,110);g.lineTo(opX,230);g.stroke();g.setLineDash([]);
    g.fillStyle='#ffd23f';g.fillText('OPEN POINT'+(opShift?' (baru)':''),opX-40,178);
    g.font='700 17px Consolas';
    if(mlf.skenario===0){g.fillStyle='#ff8d3a';
      g.fillText('losses 6,7% · ujung Karang 198V ⚠ · timpang',60,310);}
    else if(mlf.skenario===1){g.fillStyle='#46ff8e';
      g.fillText('SKEN-B: losses 5,1% · ujung 207V ✓ · seimbang',60,310);}
    else{g.fillStyle='#46ff8e';
      g.fillText('TERVALIDASI — siap eksekusi manuver nyata',60,310);}
    mlf.D.tex.needsUpdate=true;}
  peta();
  /* kartu skenario */
  mlf.cards=[];
  [['SKEN-A','SA',3.2],['SKEN-B','SB',4.3]].forEach((o,i)=>{
    const c=box(.9,.5,.08,0x2b3a4a);c.position.set(o[2],2.9,-3.05);scene.add(c);
    actMesh(c,o[1]);mlf.cards.push(c);
    scene.add(label(o[0],.5,'#5fd4ff').translateX(o[2]).translateY(3.3).translateZ(-3.0));});
  /* lembar rencana manuver */
  mlf.plan=box(.6,.7,.05,0xe8e4d8);mlf.plan.position.set(3.8,1.7,-3.07);scene.add(mlf.plan);
  actMesh(mlf.plan,'PLAN');
  scene.add(label('RENCANA MANUVER',.55,'#5fd4ff').translateX(3.8).translateY(2.25).translateZ(-3.0));
  startSeq([
   {type:'act',aid:'MODEL',done:false,targets:()=>[mlf.D.mesh],
    desc:'Bangun model & VALIDASI terhadap pengukuran nyata (klik layar).',
    why:'Topologi, panjang & jenis kawat, beban per gardu dimasukkan — lalu ujian kejujuran: simulasi vs pengukuran SCADA di 5 titik. Selisih <3% ✓: model boleh dipercaya. Simulasi tanpa validasi adalah fiksi yang berpakaian seperti sains.',
    fx(){toast('🧮 Model tervalidasi: selisih vs ukur <3% di 5 titik.','ok',3000);}},
   {type:'act',aid:'SA',done:false,targets:()=>[mlf.cards[0]],
    desc:'Coba SKENARIO A: pindah open point satu seksi (klik kartu).',
    why:'Open point digeser satu seksi ke barat: Karang melepas 1 gardu ke Cendana. Hasil: losses 6,7→6,1%, ujung 201 V — membaik tapi tanggung, dan satu segmen Cendana naik ke 71%. Simulasi gratis mengajarkan: perbaikan kecil kadang hanya memindah masalah.',
    fx(){toast('📐 SKEN-A: nanggung (6,1% · 201V) — coba lebih berani.','info',3000);}},
   {type:'act',aid:'SB',done:false,targets:()=>[mlf.cards[1]],
    desc:'Coba SKENARIO B: pindah open point dua seksi + tutup tie alternatif.',
    why:'Lebih berani: dua seksi berpindah, tie alternatif jadi jalur normal baru. Hasil: losses 5,1% (turun 1,6 poin ≈ 38 MWh/bulan), ujung Karang 207 V ✓, pembebanan 62%-58% nyaris kembar. Di dunia digital, keberanian tidak menyakiti siapa pun — itu gunanya simulasi.',
    fx(){mlf.skenario=1;peta();
      toast('🏆 SKEN-B: losses 5,1% · 207V · seimbang — kandidat juara.','ok',3200);}},
   {type:'act',aid:'CEK',done:false,targets:()=>[mlf.D.mesh],
    desc:'Uji kelayakan penuh SKEN-B: proteksi & kontingensi (klik layar).',
    why:'Konfigurasi baru diuji kejamnya dunia nyata: arus gangguan tiap titik masih dalam jangkauan setting proteksi ✓, simulasi N-1 (satu seksi hilang) tetap bisa backfeed ✓, tak ada segmen >80% ✓. Konfigurasi yang hanya bagus saat cerah belum layak disebut bagus.',
    fx(){mlf.skenario=2;peta();
      toast('🛡️ Proteksi ✓ N-1 ✓ — SKEN-B lulus uji kejam.','ok',3000);}},
   {type:'act',aid:'PLAN',done:false,targets:()=>[mlf.plan],
    desc:'Terjemahkan ke RENCANA MANUVER nyata (klik lembar).',
    why:'Simulasi menjadi instruksi: urutan switching make-before-break via LBS remote (ilmu SCADA-mu!), jadwal jam beban rendah, titik verifikasi tegangan, dan rencana mundur bila ada kejutan. Minggu depan dispatcher mengeksekusi — dan 38 MWh/bulan berhenti menguap, selamanya.',
    fx(){toast('🗺️ Rencana manuver terbit — eksekusi minggu depan, losses −38 MWh/bln.','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Jaringan dirancang ulang tanpa satu pelanggan pun berkedip — dulu.</b> Model jujur, skenario berani, uji kejam, lalu rencana eksekusi. Perencana yang baik membuat pekerjaan dispatcher membosankan: semuanya sudah terjadi di simulasi.');
    setTimeout(()=>showWin('loadflow'),2200);});
  const s2l=seq.steps[2],of2l=s2l.fx;s2l.fx=()=>{of2l();mlf.D.mesh.userData.aid='CEK';};
  say('VOLTA di sini 🧭 Naik meja: kini kamu <b>perencana jaringan</b>. Di software aliran daya, penyulang boleh dibongkar-pasang tanpa risiko. Satu syarat sebelum percaya simulasi: validasi dulu modelnya!');
  $('#modTitle').textContent='J03·M7 — Studi Aliran Daya';
  $('#taskHead').textContent='COBA DI DIGITAL, EKSEKUSI SEKALI';}
MISSIONS.loadflow.build=buildLoadflow;
Object.assign(REAL,{
 loadflow:[
  'Data beban memakai profil puncak NYATA per gardu (dari AMI/pengukuran), bukan kapasitas terpasang',
  'Validasi model minimal di 5 titik ukur sebelum dipakai mengambil keputusan',
  'Review setting proteksi WAJIB menyertai setiap rekonfigurasi — topologi baru, arus gangguan baru',
  'Dokumentasikan konfigurasi normal baru ke SCADA, GIS & SOP — tiga sistem harus sepakat'],
});

/* =====================================================================
   MISI 8 — PLTS TERSEBAR: SAAT PELANGGAN JADI PEMBANGKIT
   ===================================================================== */
Object.assign(MISSIONS,{
 der:{lvl:'JALUR 03 · DISTRIBUSI · MISI 8',icon:'☀️',title:'PLTS Tersebar: Saat Pelanggan Jadi Pembangkit',strict:false,
  loc:'📍 Penyulang Cendana · 340 PLTS atap & terus bertambah',
  story:'Dunia distribusi terbalik pelan-pelan: 340 pelanggan penyulang Cendana kini PUNYA pembangkit di atapnya — dan siang bolong, arus mengalir MUNDUR ke gardu. Keluhan baru bermunculan: tegangan siang terlalu TINGGI (lampu cepat putus!), dan trafo berdengung aneh jam 11-14. Jaringan yang didesain searah kini hidup dua arah; tugasmu membuatnya rukun.',
  goal:'Penyulang ramah PLTS: tegangan siang kembali normal lewat kombinasi setting inverter, tap trafo & penyeimbangan — tanpa membatasi semangat surya pelanggan.',
  obj:['Diagnosa: petakan tegangan & arus balik siang hari','Terapkan solusi bertingkat: volt-watt inverter & tap','Validasi profil 24 jam & siapkan aturan sambung baru'],
  learn:['Arus balik (reverse flow) membalik logika drop tegangan: ujung penyulang yang dulu paling RENDAH tegangannya kini paling TINGGI saat surya memuncak','Inverter modern punya mode volt-watt/volt-var: saat tegangan lokal naik, ia menahan diri atau menyerap reaktif — pelanggan ikut menjaga jaringan tanpa sadar','Tap trafo yang diset era beban-saja kini harus kompromi dua arah: cukup tinggi untuk malam, tak meledak di siang','Hosting capacity adalah anggaran sambungan PLTS per penyulang — dihitung & dipantau, agar pendaftar baru disambut dengan syarat yang tepat, bukan ditolak buta'],
  next:['Pelajari studi hosting capacity & metode peningkatannya','Dalami smart inverter standard (volt-var, freq-watt, ride-through)','Eksplorasi BESS feeder & trafo OLTC untuk penyulang surya pekat']},
});
let mde={};
function buildDER(){
  freshScene(0xcfe2f0,0x16242f);
  cam={theta:.1,phi:1.15,r:10,target:new THREE.Vector3(0,1.8,-.8)};
  const ground=boxT(24,.1,13,TEX.gravel());ground.position.y=-.05;scene.add(ground);
  /* deretan rumah ber-PLTS */
  for(let i=0;i<5;i++){
    const r=boxT(1.3,1.0,1.1,TEX.plaster());r.position.set(-7+i*2.4,.55,-2.2);scene.add(r);
    const atap=box(1.5,.4,1.3,0x8a5a40);atap.position.set(-7+i*2.4,1.25,-2.2);scene.add(atap);
    const pv=box(1.0,.05,.8,0x16263e,{roughness:.25,metalness:.5});
    pv.position.set(-7+i*2.4,1.55,-2.2);pv.rotation.x=-.2;scene.add(pv);}
  scene.add(label('340 RUMAH BER-PLTS (5 tampak)',.8).translateY(2.4).translateZ(-2.2));
  /* trafo + panah arus balik */
  mde.trafo=boxT(1.1,1.1,.9,TEX.metal(),{metalness:.3});mde.trafo.position.set(4.6,.6,-2.2);scene.add(mde.trafo);
  actMesh(mde.trafo,'TAP');
  scene.add(label('TRAFO — berdengung siang',.65,'#ffd23f').translateX(4.6).translateY(1.5).translateZ(-2.2));
  mde.panah=new THREE.Mesh(new THREE.ConeGeometry(.14,.5,10),
    new THREE.MeshStandardMaterial({color:0xffd23f,emissive:0xffd23f,emissiveIntensity:.5}));
  mde.panah.rotation.z=Math.PI/2;mde.panah.position.set(2.6,1.9,-2.2);scene.add(mde.panah);
  scene.add(label('ARUS BALIK SIANG →GARDU',.6,'#ffd23f').translateX(2.2).translateY(2.3).translateZ(-2.2));
  /* layar profil tegangan */
  const frame=boxT(4.0,2.3,.16,TEX.metal(),{metalness:.4});frame.position.set(-2.2,2.6,2.4);frame.rotation.y=Math.PI;scene.add(frame);
  mde.D=makeDisplay(3.7,2.0,560,320);
  mde.D.mesh.position.set(-2.2,2.6,2.3);mde.D.mesh.rotation.y=Math.PI;scene.add(mde.D.mesh);
  actMesh(mde.D.mesh,'PETA');
  scene.add(label('PROFIL TEGANGAN 24 JAM',.8,'#5fd4ff').translateX(-2.2).translateY(3.95).translateZ(2.3));
  mde.fix=0;
  function profil(){
    const g=mde.D.g,W=560,H=320;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.strokeStyle='#2a3a4c';g.lineWidth=2;
    g.beginPath();g.moveTo(40,16);g.lineTo(40,H-36);g.lineTo(W-12,H-36);g.stroke();
    /* batas atas-bawah */
    g.strokeStyle='#7a2a2a';g.setLineDash([6,5]);
    [70,210].forEach(y=>{g.beginPath();g.moveTo(40,y);g.lineTo(W-12,y);g.stroke();});
    g.setLineDash([]);
    g.fillStyle='#ff8d8d';g.font='600 13px Consolas';g.textAlign='left';
    g.fillText('231V maks',44,64);g.fillText('198V min',44,226);
    g.strokeStyle=mde.fix>=2?'#46ff8e':'#ffd23f';g.lineWidth=3;g.beginPath();
    for(let h=0;h<=24;h++){
      let v=.5-.12*Math.max(0,Math.sin((h-13)/14*Math.PI)); /* malam agak rendah */
      const surya=Math.max(0,Math.sin((h-6)/12*Math.PI));
      v+= (mde.fix>=2? .16 : .34)*surya;       /* siang naik */
      if(mde.fix>=1)v-=.06*surya;
      const x=40+h/24*(W-66),y=210-(v)*(210-70);
      h===0?g.moveTo(x,y):g.lineTo(x,y);}
    g.stroke();
    g.font='700 16px Consolas';
    g.fillStyle=mde.fix>=2?'#46ff8e':'#ff5a5a';
    g.fillText(mde.fix>=2?'ujung: 199-228V — DALAM BATAS 24 jam ✓':'ujung siang: 236V ✗ (lampu cepat putus)',48,36);
    mde.D.tex.needsUpdate=true;}
  profil();
  /* inverter setting & aturan baru */
  mde.inv=box(.5,.6,.2,0xe8edf2);mde.inv.position.set(-7,1.0,-.8);scene.add(mde.inv);
  actMesh(mde.inv,'VOLTWATT');
  scene.add(label('FIRMWARE INVERTER (OTA massal)',.6,'#5fd4ff').translateX(-6.4).translateY(1.55).translateZ(-.6));
  mde.rule=box(.5,.66,.04,0xe8e4d8);mde.rule.position.set(2.2,2.0,2.35);mde.rule.rotation.y=Math.PI;scene.add(mde.rule);
  actMesh(mde.rule,'ATURAN');
  scene.add(label('ATURAN SAMBUNG BARU',.6,'#5fd4ff').translateX(2.2).translateY(2.55).translateZ(2.3));
  startSeq([
   {type:'act',aid:'PETA',done:false,targets:()=>[mde.D.mesh],
    desc:'Diagnosa: PETAKAN tegangan & aliran 24 jam (klik layar).',
    why:'Logger di lima titik bercerita terbalik: jam 12, UJUNG penyulang justru 236 V — surya 340 atap mendorong tegangan dari bawah, arus mengalir mundur 180 kW melewati trafo yang tak pernah diajari mundur. Keluhan lampu putus & dengung trafo kini punya tersangka: matahari yang terlalu bersemangat.',
    fx(){toast('🔍 Siang: ujung 236V + arus balik 180 kW — dunia terbalik.','bad',3200);}},
   {type:'act',aid:'VOLTWATT',done:false,targets:()=>[mde.inv],
    desc:'Solusi #1: aktifkan mode VOLT-WATT inverter via update massal (klik inverter).',
    why:'Firmware 340 inverter diperbarui OTA (kerja sama vendor): bila tegangan lokal >230 V, inverter menahan output bertahap & menyerap sedikit reaktif. Pelanggan kehilangan ±2% produksi setahun — nyaris tak terasa — dan jaringan mendapat 340 penjaga tegangan gratis yang bekerja otomatis tiap siang.',
    fx(){mde.fix=1;profil();toast('⚙️ Volt-watt aktif di 340 inverter — puncak melunak.','ok',3200);}},
   {type:'act',aid:'TAP',done:false,targets:()=>[mde.trafo],
    desc:'Solusi #2: kompromi dua arah — turunkan TAP trafo satu langkah (klik trafo).',
    why:'Tap lama diset tinggi demi malam hari era beban-saja. Diturunkan satu langkah: siang turun ±5 V menjauhi batas atas, malam masih 209 V di ujung — aman dua arah. Plus beban tiga fasa diseimbangkan ulang (ilmu lamamu): netral adem, dengung mereda. Kompromi yang dihitung mengalahkan ekstrem yang nyaman.',
    fx(){mde.fix=2;profil();toast('🔧 Tap −1 + rebalancing: 24 jam dalam batas ✓','ok',3200);}},
   {type:'act',aid:'ATURAN',done:false,targets:()=>[mde.rule],
    desc:'Lembagakan: hitung hosting capacity & ATURAN sambung baru (klik dokumen).',
    why:'Simulasi (ilmu loadflow-mu!): penyulang ini masih sanggup +120 kWp DENGAN syarat inverter ber-volt-watt; lebih dari itu menunggu trafo OLTC/BESS feeder. Pendaftar PLTS baru kini disambut daftar syarat yang jelas — bukan penolakan buta, bukan persetujuan nekat. Energi surya dan jaringan akhirnya satu tim.',
    fx(){toast('📜 Hosting capacity +120 kWp bersyarat — pintu tetap terbuka, jaringan tetap sehat.','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Jaringan dua arah yang rukun!</b> Tegangan dijinakkan oleh 340 inverter yang diajari menahan diri, tap yang berkompromi, dan aturan sambung yang berhitung. Masa depan distribusi bukan melawan atap-atap bersurya — melainkan mengorkestrasinya.');
    setTimeout(()=>showWin('der'),2200);});
  say('VOLTA di sini ☀️ Dunia distribusi terbalik: <b>pelangganmu kini pembangkit</b>, arus mengalir mundur, dan ujung penyulang justru kelebihan tegangan. Jangan lawan matahari — orkestrasi dia. Mulai dari pemetaan!');
  $('#modTitle').textContent='J03·M8 — PLTS Tersebar & Hosting Capacity';
  $('#taskHead').textContent='ORKESTRASI, BUKAN LARANGAN';}
MISSIONS.der.build=buildDER;
Object.assign(REAL,{
 der:[
  'Pantau titik tegangan ujung penyulang ber-PLTS pekat secara permanen (bukan sesaat)',
  'Koordinasikan setting volt-watt/volt-var dengan standar interkoneksi yang berlaku',
  'Hitung ulang hosting capacity tiap penambahan signifikan — anggaran sambungan itu dinamis',
  'Sosialisasikan ke pemasang PLTS lokal: syarat smart inverter sejak penawaran, bukan saat ditolak'],
});
