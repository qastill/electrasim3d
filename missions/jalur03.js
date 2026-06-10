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
