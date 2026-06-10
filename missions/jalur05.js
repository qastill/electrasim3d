/* =====================================================================
   ElectraSim VR 3D — ENERGY ANALYST & DATA SCIENCE
   Misi: M1 ntl (Investigasi NTL (Susut Non-Teknis)) · M2 beban (Analisis Profil Beban Trafo)
   Dimuat on-demand oleh index.html lewat ensureMission().
   ===================================================================== */

Object.assign(MISSIONS,{
 ntl:{lvl:'JALUR 05 · ENERGY ANALYST',icon:'📊',title:'Investigasi NTL (Susut Non-Teknis)',strict:false,
  loc:'📍 Feeder Cendana · Target analitik ML, Indramayu',
  story:'Model machine learning kantor menandai satu feeder dengan susut tidak wajar. Empat pelanggan jadi kandidat. Tugasmu sebagai analis: baca pola konsumsi di dashboard, tentukan pelanggan paling anomali, lalu verifikasi ke lapangan — karena prediksi model hanyalah hipotesis sampai dibuktikan mata kepala.',
  goal:'Temukan pelanggan dengan bypass meter berdasar data, kumpulkan bukti, dan laporkan ke tim P2TL.',
  obj:['Analisis pola konsumsi 4 pelanggan di dashboard','Identifikasi & datangi pelanggan anomali','Temukan modus bypass, dokumentasi, lapor P2TL'],
  learn:['Penurunan konsumsi drastis tanpa perubahan aktivitas = red flag klasik NTL','Model ML memberi target list — keputusan tetap dari verifikasi lapangan','Modus umum: bypass jumper, meter dibalik, segel palsu, magnet','Bukti = foto + berita acara; analis tidak main hakim sendiri'],
  next:['Bangun model deteksi NTL-mu sendiri (fitur: pola beban, jam nyala)','Pelajari proses P2TL resmi & perhitungan tagihan susulan','Dalami AMI/smart meter: deteksi anomali real-time']},
 beban:{lvl:'JALUR 05 · ENERGY ANALYST · MISI 2',icon:'📈',title:'Analisis Profil Beban Trafo',strict:false,
  loc:'📍 Control room UP3 · Monitoring 3 gardu distribusi',
  story:'Keluhan tegangan drop berdatangan dari perumahan Cendana tiap malam. Di layar SCADA ada tiga trafo distribusi. Tugasmu: baca kurva beban harian, temukan trafo yang menjerit, dan susun rekomendasi berbasis angka — bukan perasaan.',
  goal:'Trafo overload teridentifikasi dari profil beban, terverifikasi pengukuran, dan rekomendasi teknis tersusun.',
  obj:['Baca kurva beban harian 3 trafo di dashboard','Identifikasi trafo overload & verifikasi pengukuran detail','Hitung pembebanan & susun rekomendasi'],
  learn:['Profil beban harian bercerita: puncak 18–21 = beban rumah tangga malam','Trafo dibebani >80% terus-menerus memperpendek umur isolasi; >100% = darurat','Drop tegangan ujung jaringan = gejala khas trafo/penyulang kelebihan beban','Solusi bertingkat: pecah beban → uprating trafo → sisip gardu baru'],
  next:['Pelajari perhitungan losses trafo (beban vs inti)','Dalami forecasting beban dengan data AMI','Eksplorasi optimasi penempatan gardu dengan analisis spasial']},
});

/* =====================================================================
   MISI 10 — NTL INVESTIGASI (Jalur 05)
   ===================================================================== */
let mnl={};
function buildNTL(){
  freshScene(0x9fb8d0,0x121e2c);
  cam={theta:.1,phi:1.18,r:9,target:new THREE.Vector3(0,1.6,-.5)};
  const ground=box(20,.1,12,0x4c5660);ground.position.y=-.05;scene.add(ground);
  const road=box(20,.02,2.2,0x39424c);road.position.set(0,.02,1.8);scene.add(road);

  /* 4 rumah pelanggan */
  mnl.houses=[];mnl.meters=[];
  const hx=[-6,-2,2,6],names=['A','B','C','D'];
  hx.forEach((x,i)=>{
    const h=box(2.2,1.7,1.8,[0xc8b89a,0xa8c0b0,0xc0a8b8,0xb0b8c8][i]);
    h.position.set(x,.9,-1.5);scene.add(h);
    const roof=box(2.5,.5,2.1,0x7a5a44);roof.position.set(x,1.95,-1.5);scene.add(roof);
    actMesh(h,'H'+(i+1));mnl.houses.push(h);
    scene.add(label('PELANGGAN '+names[i],.72).translateX(x).translateY(2.5).translateZ(-1.5));
    const mtr=box(.3,.42,.12,0x2d3a4a);mtr.position.set(x+.7,1.1,-.58);scene.add(mtr);
    actMesh(mtr,'M'+(i+1));mnl.meters.push(mtr);});

  /* dashboard kiosk */
  const kios=box(.15,1.6,1.1,0x2b3a4a);kios.position.set(-8.2,1.1,1.0);scene.add(kios);
  mnl.D=makeDisplay(1.0,1.3,300,380);
  mnl.D.mesh.position.set(-8.1,1.25,1.0);mnl.D.mesh.rotation.y=Math.PI/2;scene.add(mnl.D.mesh);
  const g=mnl.D.g;
  g.fillStyle='#0c141d';g.fillRect(0,0,300,380);
  g.fillStyle='#5fd4ff';g.font='700 22px Consolas';g.textAlign='left';
  g.fillText('DASHBOARD NTL — kWh/bln',12,30);
  const rows=[['PLG','LALU','KINI','Δ'],['A','452','447','-1%'],['B','308','315','+2%'],['C','726','174','-76%'],['D','158','166','+5%']];
  rows.forEach((r,i)=>{g.fillStyle=i===0?'#8aa3bd':(r[0]==='C'?'#ff5a5a':'#eaf2fb');
    g.font=(i===0?'600 18px':'700 22px')+' Consolas';
    g.fillText(r[0],14,70+i*44);g.fillText(r[1],70,70+i*44);
    g.fillText(r[2],150,70+i*44);g.fillText(r[3],225,70+i*44);});
  g.fillStyle='#ffd23f';g.font='600 16px Consolas';
  g.fillText('ML score anomali: C=0.94',12,300);
  mnl.D.tex.needsUpdate=true;
  actMesh(mnl.D.mesh,'DASH'); actMesh(kios,'DASH');
  scene.add(label('DASHBOARD ANALITIK',.75,'#5fd4ff').translateX(-8.2).translateY(2.2).translateZ(1.0));

  /* jumper bypass tersembunyi di meter C */
  mnl.jumper=new THREE.Mesh(new THREE.TorusGeometry(.14,.03,8,20),
    new THREE.MeshStandardMaterial({color:0xd83a3a,emissive:0xd83a3a,emissiveIntensity:.5}));
  mnl.jumper.position.set(2.7,1.1,-.5);mnl.jumper.visible=false;
  mnl.jumper.userData={kind:'act',aid:'JUMP'};scene.add(mnl.jumper);

  /* kamera & radio di tangan (meja kecil) */
  const tbl=box(.7,.06,.5,0x6b4f33);tbl.position.set(8.4,.8,1.2);scene.add(tbl);
  const tleg=box(.07,.8,.07,0x4a3624);tleg.position.set(8.4,.4,1.2);scene.add(tleg);
  mnl.cam=box(.26,.18,.16,0x18242f);mnl.cam.position.set(8.25,.92,1.2);scene.add(mnl.cam);
  actMesh(mnl.cam,'FOTO');
  scene.add(label('KAMERA',.5,'#5fd4ff').translateX(8.25).translateY(1.2).translateZ(1.2));
  mnl.radio=box(.14,.28,.09,0x141a20,{emissive:0x06303d,emissiveIntensity:.5});
  mnl.radio.position.set(8.6,.95,1.2);scene.add(mnl.radio);
  actMesh(mnl.radio,'LAPOR');
  scene.add(label('RADIO',.5,'#5fd4ff').translateX(8.6).translateY(1.25).translateZ(1.2));

  startSeq([
   {type:'act',aid:'DASH',done:false,targets:()=>[mnl.D.mesh],
    desc:'Buka DASHBOARD analitik — pelajari pola konsumsi 4 pelanggan.',
    why:'Analis bekerja dari data dulu, lapangan kemudian. Cari yang turun drastis tanpa alasan: pelanggan pindah? renovasi? atau... sesuatu yang lain.',
    fx(){toast('📊 Data terbaca. Satu pelanggan turun -76%...','info',2800);}},
   {type:'act',aid:'H3',done:false,targets:()=>[mnl.houses[2]],
    desc:'Identifikasi pelanggan paling anomali, lalu klik RUMAH-nya.',
    why:'Pelanggan C: konsumsi anjlok 726→174 kWh (-76%), padahal skor aktivitas normal & ML menandai 0,94. A, B, D fluktuasi wajar ±5%. Data sudah menunjuk — saatnya verifikasi.',
    fx(){toast('🏠 Pelanggan C — aktivitas rumah tampak normal. Mencurigakan.','info',2600);}},
   {type:'act',aid:'M3',done:false,targets:()=>[mnl.meters[2]],
    desc:'Periksa METER pelanggan C dari dekat (klik meter).',
    why:'Verifikasi lapangan: cek fisik meter, segel, dan sekeliling APP. Model ML hanya berhipotesis — mata terlatihmu yang memutuskan.',
    fx(){mnl.jumper.visible=true;clickables.push(mnl.jumper);
      toast('🔍 Ada kabel mencurigakan melingkar di belakang meter...','info',2800);}},
   {type:'act',aid:'JUMP',done:false,targets:()=>[mnl.jumper],
    desc:'Periksa kabel merah itu (klik kabel).',
    why:'Jumper bypass: fasa dilangsungkan melewati meter sehingga sebagian besar pemakaian tak tercatat. Modus klasik — dan persis pola yang membuat konsumsi "resmi" anjlok 76%.',
    fx(){toast('🚨 TERKONFIRMASI: jumper bypass meter!','bad',2800);}},
   {type:'act',aid:'FOTO',done:false,targets:()=>[mnl.cam],
    desc:'Dokumentasikan temuan (klik KAMERA).',
    why:'Tanpa bukti, temuan = opini. Foto kondisi asli SEBELUM apapun disentuh: posisi jumper, segel, nomor meter. Bukti kuat = tagihan susulan yang tak terbantah.',
    fx(){spark(worldPos(mnl.jumper),0xffffff);
      toast('📸 Bukti terdokumentasi: 4 foto + video.','ok',2400);}},
   {type:'act',aid:'LAPOR',done:false,targets:()=>[mnl.radio],
    desc:'Laporkan ke tim P2TL (klik RADIO). Jangan bertindak sendiri!',
    why:'Analis menemukan; penertiban tetap wewenang tim P2TL resmi (dengan berita acara, saksi, bila perlu APH). Konfrontasi sendirian = bahaya & cacat hukum.',
    fx(){toast('📻 Tim P2TL menuju lokasi — target terverifikasi.','ok',2800);}},
  ],()=>{say('🎉 <b>Investigasi sukses!</b> Dari skor model ML sampai bukti lapangan — beginilah analitik memangkas susut. Satu jumper ini saja menyelamatkan ±550 kWh/bulan.');
    setTimeout(()=>showWin('ntl'),2200);});

  say('VOLTA di sini 📊 Misi favoritku: <b>berburu susut non-teknis</b>. Model ML sudah memberi sinyal — tapi ingat prinsip analis: <b>data menunjuk, lapangan membuktikan</b>. Mulai dari dashboard di sebelah kiri.');
  $('#modTitle').textContent='J05 — Investigasi NTL';
  $('#taskHead').textContent='DATA → VERIFIKASI → BUKTI';}

/* =====================================================================
   MISI 23 — PROFIL BEBAN TRAFO (Jalur 05 · Misi 2)
   ===================================================================== */
let mlb={};
function buildBeban(){
  freshScene(0x9fb8d0,0x121e2c);
  cam={theta:.05,phi:1.18,r:8.5,target:new THREE.Vector3(0,1.8,-.8)};
  const floor=boxT(18,.1,11,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(16,4.4,.2,TEX.plaster());wall.position.set(0,2.2,-3.4);scene.add(wall);
  /* dashboard besar kurva beban */
  const frame=boxT(4.4,2.5,.18,TEX.metal(),{metalness:.4});frame.position.set(-3.2,2.4,-3.28);scene.add(frame);
  frame.add(label('SCADA — KURVA BEBAN HARIAN',.9).translateY(1.55));
  mlb.D=makeDisplay(4.0,2.1,640,340);
  mlb.D.mesh.position.set(-3.2,2.4,-3.18);scene.add(mlb.D.mesh);
  actMesh(mlb.D.mesh,'DASH');
  function drawCurves(hl){
    const g=mlb.D.g,W=640,H=340;
    g.fillStyle='#0c141d';g.fillRect(0,0,W,H);
    g.strokeStyle='#2a3a4c';g.lineWidth=2;
    g.beginPath();g.moveTo(50,20);g.lineTo(50,H-40);g.lineTo(W-20,H-40);g.stroke();
    g.strokeStyle='#7a2a2a';g.setLineDash([8,6]);
    g.beginPath();g.moveTo(50,70);g.lineTo(W-20,70);g.stroke();g.setLineDash([]);
    g.fillStyle='#ff5a5a';g.font='600 16px Consolas';g.textAlign='left';g.fillText('100% kapasitas',54,62);
    const cfg=[['T1',0x5fd4ff,'#5fd4ff',.52],['T2',0xffd23f,'#ffd23f',.95],['T3',0x46ff8e,'#46ff8e',.38]];
    cfg.forEach((c,ci)=>{
      g.strokeStyle=c[2];g.lineWidth=(hl===ci)?5:3;g.globalAlpha=(hl===undefined||hl===ci)?1:.35;
      g.beginPath();
      for(let h=0;h<=24;h++){
        const base=.3+ .12*Math.sin(h/24*Math.PI*2-1.2);
        const evening=Math.exp(-Math.pow(h-19,2)/6)*c[3];
        const v=Math.min(1.15,base+evening);
        const x=50+h/24*(W-80), y=H-40-v*(H-110)/1.15*1.0;
        h===0?g.moveTo(x,y):g.lineTo(x,y);}
      g.stroke();g.globalAlpha=1;
      g.fillStyle=c[2];g.font='700 18px Consolas';g.fillText(c[0],W-90+ci*0,40+ci*24);});
    g.fillStyle='#8aa3bd';g.font='600 15px Consolas';g.textAlign='center';
    [0,6,12,18,24].forEach(h=>g.fillText(h+':00',50+h/24*(W-80),H-16));
    mlb.D.tex.needsUpdate=true;}
  drawCurves();
  /* tiga trafo */
  mlb.trafos=[];
  [[-1.5,'T1 · 200 kVA'],[1.5,'T2 · 160 kVA'],[4.5,'T3 · 200 kVA']].forEach((o,i)=>{
    const t=boxT(1.1,1.2,.9,TEX.metal(),{metalness:.3});t.position.set(o[0]+1.5,.65,-1.2);scene.add(t);
    [-.3,0,.3].forEach(dx=>{const fin=box(.05,1.0,.95,0x5a6a7a);fin.position.set(o[0]+1.5+dx,.65,-1.2);scene.add(fin);});
    actMesh(t,'T'+(i+1));mlb.trafos.push(t);
    scene.add(label(o[1],.62).translateX(o[0]+1.5).translateY(1.6).translateZ(-1.2));});
  /* layar detail + papan rekomendasi */
  mlb.det=makeDisplay(1.4,.8,320,190);
  mlb.det.mesh.position.set(6.6,2.2,-3.18);scene.add(mlb.det.mesh);
  dispText(mlb.det,['DETAIL TRAFO','pilih trafo…'],['#5fd4ff','#7d8f84']);
  actMesh(mlb.det.mesh,'DETAIL');
  scene.add(label('LAYAR DETAIL',.6,'#5fd4ff').translateX(6.6).translateY(2.85).translateZ(-3.1));
  mlb.rek=box(.95,.7,.05,0xe8e4d8);mlb.rek.position.set(6.6,1.0,-3.2);scene.add(mlb.rek);
  actMesh(mlb.rek,'REKOM');
  scene.add(label('PAPAN REKOMENDASI',.55,'#5fd4ff').translateX(6.6).translateY(.5).translateZ(-3.1));

  startSeq([
   {type:'act',aid:'DASH',done:false,targets:()=>[mlb.D.mesh],
    desc:'Baca DASHBOARD: bandingkan kurva beban harian tiga trafo.',
    why:'Tiga kurva, tiga cerita. Perhatikan jam 18–21: satu kurva menembus garis merah 100%. Itulah jam keluhan tegangan drop pelanggan masuk — bukan kebetulan.',
    fx(){drawCurves(1);toast('📈 T2 menembus 100% tiap malam. T1 & T3 masih longgar.','info',3000);}},
   {type:'act',aid:'T2',done:false,targets:()=>[mlb.trafos[1]],
    desc:'Identifikasi: klik TRAFO yang overload.',
    why:'T2 160 kVA memikul perumahan yang terus tumbuh — beban puncaknya kini melampaui kapasitas pelat namanya. T1 (52%) dan T3 (38%) justru santai.',
    fx(){toast('🎯 T2 terkonfirmasi: pelanggan bertambah 30% dalam 2 tahun.','ok',2800);}},
   {type:'act',aid:'DETAIL',done:false,targets:()=>[mlb.det.mesh],
    desc:'Verifikasi angka: buka LAYAR DETAIL pengukuran T2.',
    why:'Dashboard memberi pola; detail memberi bukti: pembebanan 108% pada 19:30, tegangan ujung jaringan jatuh ke 198 V (batas bawah 198 V — persis di tepi jurang).',
    fx(){dispText(mlb.det,['T2: 108% ⚠','19:30 · ujung 198V'],['#ff5a5a','#ffd23f']);
      toast('📟 T2: 173 kVA dari 160 kVA — overload 108%.','bad',2800);}},
   {type:'act',aid:'REKOM',done:false,targets:()=>[mlb.rek],
    desc:'Susun REKOMENDASI teknis (klik papan).',
    why:'Analis menutup dengan solusi bertingkat: jangka pendek pecah beban — alihkan 2 jurusan ke T3 yang baru 38%; jangka menengah uprating T2 ke 250 kVA dengan justifikasi tren pertumbuhan.',
    fx(){toast('📋 Rekomendasi: pecah beban ke T3 (cepat) + uprating 250 kVA (2027).','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Analisis tajam!</b> Dari keluhan pelanggan → kurva → angka → rekomendasi bertingkat. Beginilah data menjaga trafo (dan tidur nyenyak manajer area).');
    setTimeout(()=>showWin('beban'),2200);});

  say('VOLTA di sini 📈 Keluhan tegangan drop tiap malam — dan jawabannya tersembunyi di <b>kurva beban harian</b>. Tiga trafo, satu yang menjerit. Mulai dari dashboard SCADA.');
  $('#modTitle').textContent='J05·M2 — Analisis Profil Beban Trafo';
  $('#taskHead').textContent='KURVA → TRAFO → REKOMENDASI';}

MISSIONS.ntl.build=buildNTL;
MISSIONS.beban.build=buildBeban;

Object.assign(REAL,{
 ntl:[
  'Penertiban hanya oleh tim P2TL resmi dengan berita acara, saksi, dan bila perlu pendampingan APH',
  'Dokumentasikan kondisi ASLI sebelum apapun disentuh: foto, video, koordinat, nomor segel',
  'Model analitik (seperti MAGNETO) menghasilkan target list — keputusan final selalu dari verifikasi lapangan',
  'Hitung tagihan susulan sesuai ketentuan yang berlaku, bukan estimasi pribadi'],
 beban:[
  'Validasi data SCADA dengan pengukuran lapangan — sensor juga bisa berbohong (kalibrasi!)',
  'Ukur beban trafo pada jam puncak aktual, lengkap dengan suhu minyak & tegangan ujung',
  'Pecah beban perlu studi aliran daya jaringan, bukan sekadar pindah jurusan',
  'Dokumentasikan tren pertumbuhan beban per gardu sebagai dasar perencanaan investasi'],
});
