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

/* =====================================================================
   MISI 3 — FORECASTING BEBAN DENGAN REGRESI
   ===================================================================== */
Object.assign(MISSIONS,{
 forecast:{lvl:'JALUR 05 · ENERGY ANALYST · MISI 3',icon:'🔮',title:'Forecasting Beban dengan Regresi',strict:false,
  loc:'📍 Kantor UP3 · Proyek peramalan beban gardu',
  story:'Manajer perencanaan datang membawa pertanyaan klasik: "Gardu mana yang akan overload TAHUN DEPAN?" Menunggu trafo menjerit seperti misi lalu itu reaktif. Hari ini kamu membangun model peramalan: dari data historis dua tahun, fitur yang tepat, sampai prediksi yang bisa dipertanggungjawabkan.',
  goal:'Model regresi terlatih dengan MAPE di bawah 5%, dan daftar gardu berisiko overload tahun depan tersusun berbasis prediksi.',
  obj:['Muat & bersihkan data historis 24 bulan','Pilih fitur yang relevan & latih model','Evaluasi akurasi lalu terjemahkan menjadi rekomendasi'],
  learn:['Model hanya sebaik datanya: missing value & outlier dibersihkan SEBELUM melatih apa pun','Fitur beban klasik: suhu (AC!), hari kerja vs libur, jam, tren pertumbuhan pelanggan','MAPE (mean absolute percentage error) <5% = layak untuk perencanaan; selalu bandingkan dengan baseline naive','Prediksi tanpa rekomendasi = angka mati; analis menerjemahkan ke daftar aksi: uprating, pecah beban, sisip gardu'],
  next:['Naik level: time series modern (SARIMA, Prophet, gradient boosting)','Pelajari backtesting: uji model di data yang belum pernah ia lihat','Gabungkan forecast dengan data cuaca BMKG via API']},
});
let mfo={};
function buildForecast(){
  freshScene(0x9fb8d0,0x121e2c);
  cam={theta:0,phi:1.18,r:7.5,target:new THREE.Vector3(0,1.9,-1)};
  const floor=boxT(16,.1,10,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(14,4.4,.2,TEX.plaster());wall.position.set(0,2.2,-3.2);scene.add(wall);
  /* layar utama: kurva data */
  const frame=boxT(4.2,2.4,.16,TEX.metal(),{metalness:.4});frame.position.set(-2.6,2.4,-3.1);scene.add(frame);
  frame.add(label('WORKSTATION ANALIS',.9).translateY(1.5));
  mfo.D=makeDisplay(3.9,2.1,620,330);
  mfo.D.mesh.position.set(-2.6,2.4,-3.0);scene.add(mfo.D.mesh);
  actMesh(mfo.D.mesh,'DATA');
  function draw(mode){
    const g=mfo.D.g,W=620,H=330;
    g.fillStyle='#0c141d';g.fillRect(0,0,W,H);
    g.strokeStyle='#2a3a4c';g.lineWidth=2;
    g.beginPath();g.moveTo(46,18);g.lineTo(46,H-36);g.lineTo(W-16,H-36);g.stroke();
    g.font='600 15px Consolas';g.textAlign='left';
    function seri(col,off,noise,dash){
      g.strokeStyle=col;g.lineWidth=3;if(dash)g.setLineDash([7,5]);
      g.beginPath();
      for(let m=0;m<=24;m++){
        const tren=.35+m*.009, musim=.1*Math.sin(m/12*Math.PI*2);
        let v=tren+musim+off+(noise?Math.sin(m*7.3)*noise:0);
        const x=46+m/24*(W-78), y=H-36-v*(H-90);
        m===0?g.moveTo(x,y):g.lineTo(x,y);}
      g.stroke();g.setLineDash([]);}
    if(mode>=0){seri('#5fd4ff',0,.06);g.fillStyle='#5fd4ff';g.fillText('DATA AKTUAL 24 BLN',54,34);}
    if(mode>=1){g.fillStyle='#ffd23f';g.fillText('+ outlier dibersihkan · fitur: suhu, hari, tren',54,56);}
    if(mode>=2){seri('#46ff8e',.012,0,true);g.fillStyle='#46ff8e';g.fillText('MODEL (prediksi)',54,78);}
    if(mode>=3){g.fillStyle='#ff5a5a';g.font='700 17px Consolas';
      g.fillText('FORECAST 12 BLN → GD-CENDANA 104% (Jun)',54,H-12);}
    mfo.D.tex.needsUpdate=true;}
  draw(-1);
  /* kartu fitur */
  mfo.cards=[];
  [['SUHU','F1',1.4],['HARI KERJA','F2',2.5],['WARNA CAT GARDU','F3',3.6]].forEach(o=>{
    const c=box(.95,.6,.07,0x2b3a4a);c.position.set(o[2],2.9,-3.05);scene.add(c);
    actMesh(c,o[1]);mfo.cards.push(c);
    scene.add(label(o[0],.5,'#5fd4ff').translateX(o[2]).translateY(3.4).translateZ(-3.0));});
  scene.add(label('PILIH FITUR YANG MASUK AKAL',.65,'#ffd23f').translateX(2.5).translateY(3.85).translateZ(-3.0));
  /* tombol train & papan rekomendasi */
  mfo.train=box(.5,.3,.12,0xcc8830);mfo.train.position.set(1.6,1.9,-3.05);scene.add(mfo.train);
  actMesh(mfo.train,'TRAIN');
  scene.add(label('TRAIN',.5).translateX(1.6).translateY(1.65).translateZ(-3.0));
  mfo.evalb=box(.5,.3,.12,0x2a5a8a);mfo.evalb.position.set(2.5,1.9,-3.05);scene.add(mfo.evalb);
  actMesh(mfo.evalb,'EVAL');
  scene.add(label('EVALUASI',.5).translateX(2.5).translateY(1.65).translateZ(-3.0));
  mfo.rek=box(.85,.6,.05,0xe8e4d8);mfo.rek.position.set(4.6,1.6,-3.08);scene.add(mfo.rek);
  actMesh(mfo.rek,'REKOM');
  scene.add(label('REKOMENDASI',.55,'#5fd4ff').translateX(4.6).translateY(2.1).translateZ(-3.0));
  startSeq([
   {type:'act',aid:'DATA',done:false,targets:()=>[mfo.D.mesh],
    desc:'Muat & BERSIHKAN data beban 24 bulan (klik layar).',
    why:'Ditemukan 3 bulan dengan meter rusak (nilai nol) dan 1 lonjakan ganjil saat kalibrasi. Dibuang atau diimputasi — model yang menelan sampah akan meramal sampah. 80% pekerjaan data science memang di sini.',
    fx(){draw(0);toast('🧹 24 bln dimuat · 4 anomali data dibersihkan.','ok',2800);}},
   {type:'act',aid:'F1',done:false,targets:()=>[mfo.cards[0]],
    desc:'Pilih fitur #1 yang paling berpengaruh: klik kartu yang tepat.',
    why:'SUHU adalah raja fitur beban di iklim tropis: tiap derajat lebih panas, ribuan AC bekerja lebih keras. Korelasinya dengan beban malam mencapai 0,8 — wajib masuk model. (Warna cat gardu? Tentu bukan.)',
    fx(){mfo.cards[0].material.color.setHex(0x2e6a4a);
      toast('🌡️ Fitur SUHU masuk — korelasi 0,8 dengan beban.','ok',2400);}},
   {type:'act',aid:'F2',done:false,targets:()=>[mfo.cards[1]],
    desc:'Tambahkan fitur #2: klik kartu berikutnya yang relevan.',
    why:'HARI KERJA vs akhir pekan membelah profil menjadi dua dunia: industri libur, rumah tangga naik. Plus tren waktu untuk pertumbuhan pelanggan. Tiga fitur sederhana yang menjelaskan — bukan seratus fitur yang membingungkan.',
    fx(){mfo.cards[1].material.color.setHex(0x2e6a4a);draw(1);
      toast('📅 Fitur HARI KERJA + tren masuk. Dataset siap.','ok',2400);}},
   {type:'act',aid:'TRAIN',done:false,targets:()=>[mfo.train],
    desc:'LATIH model regresi (klik TRAIN).',
    why:'Data dibelah: 20 bulan untuk belajar, 4 bulan terakhir DISEMBUNYIKAN untuk ujian. Model yang dinilai di data yang pernah ia lihat = murid yang menilai ujiannya sendiri.',
    fx(){draw(2);toast('🧠 Model terlatih — kurva hijau menempel data. Saatnya ujian.','ok',2600);}},
   {type:'act',aid:'EVAL',done:false,targets:()=>[mfo.evalb],
    desc:'EVALUASI di data uji: layakkah dipakai? (klik EVALUASI)',
    why:'MAPE 4,1% vs baseline naive 11,3% — model mengalahkan tebakan sederhana hampir 3x. Di bawah 5% artinya layak untuk perencanaan investasi. Angka inilah yang membuat manajer percaya.',
    fx(){toast('📐 MAPE 4,1% (naive: 11,3%) — LAYAK untuk perencanaan ✓','ok',2800);}},
   {type:'act',aid:'REKOM',done:false,targets:()=>[mfo.rek],
    desc:'Terjemahkan ke REKOMENDASI: gardu mana, kapan, tindakan apa.',
    why:'Forecast 12 bulan: GD-Cendana menembus 104% pada Juni (musim panas + tren perumahan baru). Rekomendasi: uprating masuk anggaran SEKARANG — pengadaan trafo butuh 5 bulan. Itulah bedanya prediksi dan firasat.',
    fx(){draw(3);toast('📋 GD-Cendana → uprating sebelum Mei. Anggaran diajukan!','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Dari reaktif menjadi prediktif!</b> Data bersih → fitur masuk akal → ujian jujur → rekomendasi beranggaran. Tahun depan tak ada trafo yang menjerit — karena kamu sudah mendengarnya hari ini.');
    setTimeout(()=>showWin('forecast'),2200);});
  say('VOLTA di sini 🔮 Misi analis level berikutnya: <b>meramal beban tahun depan</b>. Ingat mantranya: data bersih dulu, fitur yang masuk akal, dan model selalu diuji di data yang belum pernah ia lihat. Mulai dari layar.');
  $('#modTitle').textContent='J05·M3 — Forecasting Beban';
  $('#taskHead').textContent='BERSIH · FITUR · LATIH · UJI';}
MISSIONS.forecast.build=buildForecast;
Object.assign(REAL,{
 forecast:[
  'Simpan pipeline pembersihan data sebagai kode (bukan edit manual Excel) agar bisa diaudit & diulang',
  'Dokumentasikan asumsi model: periode data, fitur, perlakuan outlier — penerus harus bisa mereproduksi',
  'Re-train berkala: pola beban berubah (EV, PLTS atap, pelanggan baru) dan model membusuk diam-diam',
  'Sajikan interval keyakinan, bukan angka tunggal — keputusan investasi butuh skenario, bukan kepastian palsu'],
});

/* =====================================================================
   MISI 4 — DETEKSI ANOMALI AMI REAL-TIME
   ===================================================================== */
Object.assign(MISSIONS,{
 ami:{lvl:'JALUR 05 · ENERGY ANALYST · MISI 4',icon:'📶',title:'Deteksi Anomali AMI Real-Time',strict:false,
  loc:'📍 Command center AMI · 50.000 smart meter online',
  story:'Era baru telah tiba: 50.000 smart meter melapor tiap 15 menit — manusia mana pun tenggelam membaca semuanya. Maka mesin yang membaca, manusia yang MEMUTUSKAN. Pagi ini dashboard anomali memunculkan tiga alert dengan skor berbeda. Tugas analis modern bukan mencari jarum di jerami; jarum sudah disodorkan — tinggal menentukan mana yang benar-benar tajam.',
  goal:'Tiga alert tertriase benar: satu dieskalasi ke P2TL, satu ke pemeliharaan, satu ditutup sebagai false positive — dengan alasan berbasis data.',
  obj:['Pahami cara kerja deteksi anomali & skornya','Bedah tiga alert satu per satu dari datanya','Triase: eskalasi yang tepat ke tim yang tepat'],
  learn:['Smart meter mengirim interval 15 menit + event (power loss, tutup dibuka, arus balik) — anomali kini terlihat HARI INI, bukan di tagihan bulan depan','Skor anomali = seberapa jauh perilaku menyimpang dari baseline pelanggan itu sendiri & kelompok sejenisnya','Tidak semua anomali = pencurian: meter rusak, pelanggan pindah, atau renovasi juga menyimpang — konteks memutuskan','Triase yang baik menghemat dua arah: P2TL tak diutus ke false positive, dan kasus nyata tak menunggu sebulan'],
  next:['Bangun pipeline streaming (event-driven) untuk alert real-time','Pelajari event tamper meter & kombinasinya dengan pola konsumsi','Ukur presisi/recall model anomali dari hasil lapangan — tutup loop-nya']},
});
let mam={};
function buildAMI(){
  freshScene(0x1d2a3a,0x0a121c);
  cam={theta:0,phi:1.15,r:8,target:new THREE.Vector3(0,2.1,-1)};
  const floor=boxT(16,.1,10,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(14,4.6,.2,TEX.metal(),{metalness:.2});wall.position.set(0,2.3,-3.3);scene.add(wall);
  /* dashboard utama */
  const frame=boxT(5.4,2.8,.16,TEX.metal(),{metalness:.4});frame.position.set(-1.6,2.4,-3.2);scene.add(frame);
  frame.add(label('AMI ANOMALY DASHBOARD',.9).translateY(1.7));
  mam.D=makeDisplay(5.0,2.4,640,330);
  mam.D.mesh.position.set(-1.6,2.4,-3.1);scene.add(mam.D.mesh);
  actMesh(mam.D.mesh,'DASH');
  mam.status=['?','?','?'];
  function dash(detail){
    const g=mam.D.g,W=640,H=330;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='700 19px Consolas';g.textAlign='left';
    g.fillStyle='#5fd4ff';g.fillText('ALERT HARI INI — 50.000 meter · 3 anomali',18,32);
    const rows=[
      ['A · skor 0,96','konsumsi −72% + event TUTUP DIBUKA',mam.status[0]],
      ['B · skor 0,81','kWh kirim=0 sejak 3 hari + comm OK',mam.status[1]],
      ['C · skor 0,64','konsumsi −58% mendadak',mam.status[2]]];
    rows.forEach((r,i)=>{
      const y=78+i*78;
      g.fillStyle='#13202f';g.fillRect(14,y-26,W-28,62);
      g.fillStyle=r[2]==='P2TL'?'#ff5a5a':(r[2]==='HAR'?'#ffd23f':(r[2]==='CLOSE'?'#46ff8e':'#8aa3bd'));
      g.font='700 18px Consolas';g.fillText(r[0]+(r[2]==='?'?'':' → '+r[2]),26,y);
      g.fillStyle='#aebdcc';g.font='600 15px Consolas';g.fillText(r[1],26,y+24);});
    if(detail){g.fillStyle='#ffd23f';g.font='600 15px Consolas';
      g.fillText(detail,18,H-14);}
    mam.D.tex.needsUpdate=true;}
  dash();
  /* tiga tombol kasus */
  mam.bA=box(.6,.34,.14,0x5a2b2b);mam.bA.position.set(2.6,2.9,-3.1);scene.add(mam.bA);
  actMesh(mam.bA,'KA');
  scene.add(label('KASUS A',.55,'#ff8d8d').translateX(2.6).translateY(3.25).translateZ(-3.0));
  mam.bB=box(.6,.34,.14,0x5a4b2b);mam.bB.position.set(2.6,2.2,-3.1);scene.add(mam.bB);
  actMesh(mam.bB,'KB');
  scene.add(label('KASUS B',.55,'#ffe28d').translateX(2.6).translateY(2.55).translateZ(-3.0));
  mam.bC=box(.6,.34,.14,0x2b5a3b);mam.bC.position.set(2.6,1.5,-3.1);scene.add(mam.bC);
  actMesh(mam.bC,'KC');
  scene.add(label('KASUS C',.55,'#8df0b8').translateX(2.6).translateY(1.85).translateZ(-3.0));
  /* tombol kirim laporan */
  mam.send=box(.7,.4,.14,0x2a5a8a);mam.send.position.set(4.2,2.2,-3.1);scene.add(mam.send);
  actMesh(mam.send,'KIRIM');
  scene.add(label('KIRIM TRIASE',.55,'#5fd4ff').translateX(4.2).translateY(2.6).translateZ(-3.0));
  startSeq([
   {type:'act',aid:'DASH',done:false,targets:()=>[mam.D.mesh],
    desc:'Buka DASHBOARD: tiga alert menunggu triase (klik layar).',
    why:'Mesin sudah menyaring 50.000 menjadi 3 — pekerjaan sebulan tim analis lima tahun lalu. Tapi skor hanyalah prioritas antrian, bukan vonis: 0,96 berarti "periksa aku duluan", bukan "aku pasti pencuri".',
    fx(){dash();toast('📶 3 alert terangkat dari 50.000 meter. Mulai dari skor tertinggi.','info',3000);}},
   {type:'act',aid:'KA',done:false,targets:()=>[mam.bA],
    desc:'Bedah KASUS A (skor 0,96): konsumsi anjlok + event tamper.',
    why:'Dua bukti saling menguatkan: konsumsi −72% DAN event "tutup meter dibuka" pukul 02:13 — smart meter melaporkan tangan yang menyentuhnya. Kombinasi pola + event fisik = sinyal terkuat di dunia AMI. Eskalasi: P2TL dengan prioritas.',
    fx(){mam.status[0]='P2TL';dash('A: pola+event fisik = eskalasi P2TL');
      toast('🚨 KASUS A → P2TL (bukti ganda: pola + tamper event).','bad',3000);}},
   {type:'act',aid:'KB',done:false,targets:()=>[mam.bB],
    desc:'Bedah KASUS B (0,81): kWh nol tapi komunikasi sehat.',
    why:'Meter rajin melapor… angka nol terus, tiga hari. Rumah berpenghuni (malam ada beban kecil sebelumnya). Ini bukan pencurian — ini meter SAKIT: register/sensor arusnya wafat. Eskalasi: tim pemeliharaan meter, bukan P2TL.',
    fx(){mam.status[1]='HAR';dash('B: meter rusak = tim pemeliharaan');
      toast('🔧 KASUS B → PEMELIHARAAN (meter rusak, bukan pelanggaran).','ok',3000);}},
   {type:'act',aid:'KC',done:false,targets:()=>[mam.bC],
    desc:'Bedah KASUS C (0,64): konsumsi turun 58% mendadak.',
    why:'Cek data pendukung: ada permohonan PINDAH RUMAH di sistem pelayanan minggu lalu, dan profil sisa = kulkas + standby khas rumah kosong. Anomali? Ya. Pelanggaran? Bukan — kehidupan pelanggan memang berubah. Tutup: false positive, catat untuk pembelajaran model.',
    fx(){mam.status[2]='CLOSE';dash('C: pelanggan pindah = false positive');
      toast('✅ KASUS C → DITUTUP (pindah rumah) — dicatat untuk model.','ok',3000);}},
   {type:'act',aid:'KIRIM',done:false,targets:()=>[mam.send],
    desc:'KIRIM hasil triase ke masing-masing tim (klik kirim).',
    why:'P2TL berangkat membawa bukti kuat, pemeliharaan membawa meter pengganti, dan model belajar dari label barumu. Loop tertutup: lapangan memberi makan model, model menajamkan lapangan. Begitulah analitik yang hidup.',
    fx(){toast('📤 Triase terkirim — tiga tim bergerak dengan tepat sasaran.','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Triase sempurna!</b> Satu ke P2TL, satu ke pemeliharaan, satu ditutup — semua dengan alasan data. Mesin menyaring, kamu memutuskan: itulah analis di era AMI.');
    setTimeout(()=>showWin('ami'),2200);});
  say('VOLTA di sini 📶 Selamat datang di era <b>50.000 meter yang bicara tiap 15 menit</b>. Mesin sudah memilih 3 tersangka — tapi vonis tetap milikmu. Ingat: skor tinggi = periksa duluan, bukan pasti bersalah.');
  $('#modTitle').textContent='J05·M4 — Deteksi Anomali AMI';
  $('#taskHead').textContent='SARING · BEDAH · TRIASE';}
MISSIONS.ami.build=buildAMI;
Object.assign(REAL,{
 ami:[
  'Gabungkan minimal dua sumber bukti sebelum eskalasi P2TL: pola konsumsi + event meter + data pelayanan',
  'Bangun SLA triase: alert skor tinggi wajib diputuskan < 24 jam — antrian basi menurunkan nilai sistem',
  'Label hasil lapangan dikembalikan ke model (terbukti/false) — tanpa umpan balik, model membusuk',
  'Jaga privasi data interval pelanggan: akses berjenjang & audit log siapa membuka data siapa'],
});

/* =====================================================================
   MISI 5 — ENERGY BALANCE: MEMBEDAH SUSUT PENYULANG
   ===================================================================== */
Object.assign(MISSIONS,{
 losses:{lvl:'JALUR 05 · ENERGY ANALYST · MISI 5',icon:'🧮',title:'Energy Balance: Membedah Susut Penyulang',strict:false,
  loc:'📍 Kantor UP3 · Rapat target susut triwulan',
  story:'Angka merah di rapor triwulan: susut penyulang Karang 11,2% — jauh di atas target 7%. Manajer bertanya pertanyaan yang menentukan anggaran: "Berapa yang TEKNIS dan berapa yang NON-TEKNIS?" Salah membedah = salah obat: susut teknis diobati dengan tembaga (rugi jaringan), non-teknis dengan penertiban. Energy balance adalah pisau bedahnya.',
  goal:'Susut 11,2% terurai menjadi komponen teknis & non-teknis dengan perhitungan yang bisa dipertanggungjawabkan, dan dua program perbaikan tepat sasaran terbit.',
  obj:['Susun neraca energi: masuk vs terjual','Hitung susut teknis dari data jaringan','Selisihnya = non-teknis: validasi & program aksi'],
  learn:['Energy balance: kWh masuk penyulang − kWh terjual = susut total; tugas analis memilahnya menjadi teknis vs non-teknis','Susut teknis dihitung (bukan ditebak): I²R jaringan dari profil beban + rugi inti trafo — fisika yang bisa disimulasikan','Non-teknis = susut total − teknis: pencurian, meter rusak, baca meter salah — tiap penyebab punya obat berbeda','Susut teknis tinggi diobati tembaga & tata jaringan (perbesar penampang, pecah beban, geser trafo ke pusat beban); non-teknis diobati penertiban & meter'],
  next:['Pelajari simulasi aliran daya untuk susut teknis presisi','Gabungkan dengan peta NTL (misi M1) untuk target operasi','Susun kurva biaya-manfaat program penurunan susut']},
});
let mls={};
function buildLosses(){
  freshScene(0x9fb8d0,0x121e2c);
  cam={theta:0,phi:1.18,r:7.5,target:new THREE.Vector3(0,1.9,-1)};
  const floor=boxT(16,.1,10,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(14,4.4,.2,TEX.plaster());wall.position.set(0,2.2,-3.2);scene.add(wall);
  /* papan neraca besar */
  const frame=boxT(5.2,2.8,.16,TEX.metal(),{metalness:.4});frame.position.set(-1.4,2.4,-3.1);scene.add(frame);
  frame.add(label('NERACA ENERGI PENYULANG KARANG',.85).translateY(1.7));
  mls.D=makeDisplay(4.8,2.4,640,330);
  mls.D.mesh.position.set(-1.4,2.4,-3.0);scene.add(mls.D.mesh);
  actMesh(mls.D.mesh,'NERACA');
  function papan(mode){
    const g=mls.D.g,W=640,H=330;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='700 18px Consolas';g.textAlign='left';
    g.fillStyle='#5fd4ff';g.fillText('MASUK (kWh meter gardu induk): 2.420.000',20,40);
    g.fillStyle='#eaf2fb';g.fillText('TERJUAL (total rekening plgn) : 2.148.000',20,74);
    g.fillStyle='#ff5a5a';g.fillText('SUSUT TOTAL: 272.000 kWh = 11,2%',20,112);
    if(mode>=1){
      g.fillStyle='#ffd23f';g.fillText('TEKNIS (hitung): I²R jaringan 128.000',20,160);
      g.fillText('               + rugi inti trafo 34.000',20,190);
      g.fillText('               = 162.000 kWh (6,7%)',20,220);}
    if(mode>=2){
      g.fillStyle='#ff8d8d';g.font='700 20px Consolas';
      g.fillText('NON-TEKNIS = 110.000 kWh (4,5%) ⚠',20,266);
      g.font='600 15px Consolas';g.fillStyle='#8aa3bd';
      g.fillText('≈ Rp 159 juta / triwulan menguap',20,296);}
    mls.D.tex.needsUpdate=true;}
  papan(0);
  /* kartu data jaringan */
  mls.jar=box(.9,.6,.07,0x2a5a8a);mls.jar.position.set(2.6,3.0,-3.05);scene.add(mls.jar);
  actMesh(mls.jar,'TEKNIS');
  scene.add(label('DATA JARINGAN',.55,'#9cc4ff').translateX(2.6).translateY(3.5).translateZ(-3.0));
  /* kartu validasi */
  mls.val=box(.9,.6,.07,0x8a5a2a);mls.val.position.set(2.6,2.0,-3.05);scene.add(mls.val);
  actMesh(mls.val,'VALID');
  scene.add(label('VALIDASI LAPANGAN',.55,'#e8c890').translateX(2.6).translateY(2.5).translateZ(-3.0));
  /* papan program */
  mls.prog=box(.6,.7,.05,0xe8e4d8);mls.prog.position.set(4.4,2.4,-3.08);scene.add(mls.prog);
  actMesh(mls.prog,'PROGRAM');
  scene.add(label('PROGRAM AKSI',.55,'#5fd4ff').translateX(4.4).translateY(2.95).translateZ(-3.0));
  startSeq([
   {type:'act',aid:'NERACA',done:false,targets:()=>[mls.D.mesh],
    desc:'Susun NERACA: energi masuk vs terjual (klik papan).',
    why:'Meter gardu induk berkata 2,42 GWh masuk; jumlah seluruh rekening pelanggan: 2,148 GWh. Selisih 272 MWh (11,2%) — itu susut TOTAL, sebuah angka gabungan yang belum boleh disimpulkan apa-apa. Periode meter harus sama persis: neraca beda tanggal = neraca bohong.',
    fx(){papan(0);toast('🧮 Susut total 11,2% — sekarang kita bedah komponennya.','info',2800);}},
   {type:'act',aid:'TEKNIS',done:false,targets:()=>[mls.jar],
    desc:'Hitung SUSUT TEKNIS dari data jaringan (klik kartu data).',
    why:'Fisika dipanggil: panjang & penampang tiap segmen, profil arus per jam → I²R = 128 MWh; rugi inti 14 trafo (tetap, 24 jam) = 34 MWh. Total teknis 6,7% — masuk akal untuk penyulang panjang berbeban berat di ujung. Teknis BUKAN angka karet: ia hasil hitungan yang bisa diaudit.',
    fx(){papan(1);toast('⚡ Teknis terhitung: 6,7% (I²R + inti trafo).','ok',3000);}},
   {type:'act',aid:'SISA',done:false,targets:()=>[mls.D.mesh],
    desc:'Kurangi: berapa NON-TEKNIS-nya? (klik papan lagi)',
    why:'11,2% − 6,7% = 4,5% non-teknis ≈ 110 MWh ≈ Rp 159 juta per triwulan. Inilah angka yang membuat rapat terdiam: bukan kabel yang panas, tapi energi yang tak tercatat — pencurian, meter tua melambat, atau pembacaan yang keliru.',
    fx(){papan(2);toast('🚨 Non-teknis 4,5% = Rp 159 jt/triwulan — target operasi!','bad',3000);}},
   {type:'act',aid:'VALID',done:false,targets:()=>[mls.val],
    desc:'VALIDASI sebelum menuduh: cek kualitas data dulu (klik kartu).',
    why:'Analis yang baik menguji angkanya sendiri: meter GI terkalibrasi ✓, tak ada pelanggan besar yang rekeningnya telat catat ✓, periode sinkron ✓. Sampling 30 meter tua: 6 melambat >3%. Sebagian "non-teknis" ternyata meter renta — bukan semua pencurian. Presisi sebelum penertiban.',
    fx(){toast('🔍 Valid: data sehat · 20% dari NT diduga meter tua.','ok',3000);}},
   {type:'act',aid:'PROGRAM',done:false,targets:()=>[mls.prog],
    desc:'Terbitkan dua PROGRAM tepat sasaran (klik papan program).',
    why:'Obat sesuai penyakit: (1) TEKNIS — perbesar penampang 2 segmen terberat + pecah beban ke T3: proyeksi 6,7→5,1%; (2) NON-TEKNIS — ganti 600 meter tua + operasi P2TL berbasis peta NTL: target 4,5→2%. Total proyeksi: 11,2% → 7,1%. Rapor merah punya jalan pulang.',
    fx(){toast('📋 2 program terbit — proyeksi susut 11,2% → 7,1%!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Susut terbedah tuntas!</b> Teknis dihitung fisika, non-teknis tersisa dari neraca, dan dua obat diresepkan untuk dua penyakit berbeda. Analis tidak menebak — ia menimbang.');
    setTimeout(()=>showWin('losses'),2200);});
  const s0=seq.steps[0],of0=s0.fx;s0.fx=()=>{of0();mls.D.mesh.userData.aid='SISA';};
  say('VOLTA di sini 🧮 Rapor merah: susut 11,2%. Pertanyaan sejutanya: <b>berapa teknis, berapa non-teknis?</b> Salah bedah = salah obat = anggaran terbuang. Pisau bedahnya bernama energy balance. Mulai!');
  $('#modTitle').textContent='J05·M5 — Energy Balance Susut';
  $('#taskHead').textContent='BEDAH DULU, OBATI KEMUDIAN';}
MISSIONS.losses.build=buildLosses;
Object.assign(REAL,{
 losses:[
  'Sinkronkan periode baca meter GI & pelanggan — beda beberapa hari merusak seluruh neraca',
  'Susut teknis dihitung dengan simulasi aliran daya bila datanya ada; rumus pendekatan diberi rentang',
  'Audit sampling meter tua per kelompok umur sebelum menuduh pencurian massal',
  'Pantau susut BULANAN per penyulang sebagai KPI — triwulan terlalu lambat untuk koreksi'],
});
