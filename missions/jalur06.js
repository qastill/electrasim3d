/* =====================================================================
   ElectraSim VR 3D — ENERGY AUDITOR
   Misi: M1 audit (Walkthrough Audit Energi Pabrik) · M2 logger (Pemasangan Power Logger)
   Dimuat on-demand oleh index.html lewat ensureMission().
   ===================================================================== */

Object.assign(MISSIONS,{
 audit:{lvl:'JALUR 06 · ENERGY AUDITOR',icon:'📋',title:'Walkthrough Audit Energi Pabrik',strict:false,
  loc:'📍 PT Maju Plastik · Audit energi level 1',
  story:'PT Maju Plastik mengeluh tagihan listrik naik 30% setahun terakhir. Kamu auditor energinya. Hari ini walkthrough audit: berkeliling pabrik dengan mata terlatih, menemukan pemborosan yang bagi orang lain "biasa saja", mengukurnya, dan menyusun rekomendasi yang masuk akal secara bisnis.',
  goal:'Temukan 4 sumber pemborosan, kuantifikasi, dan serahkan laporan potensi penghematan.',
  obj:['Walkthrough sistematis area produksi','Identifikasi pemborosan: pencahayaan, udara tekan, motor, HVAC','Susun laporan dengan potensi penghematan terukur'],
  learn:['Kebocoran udara tekan 3 mm ≈ jutaan rupiah per tahun — musuh tak terlihat pabrik','Lampu menyala siang hari = masalah kontrol & perilaku, solusi termurah','Motor standar IE1 vs IE3 + VFD: selisih efisiensi nyata pada jam operasi panjang','Setiap 1°C setting AC lebih dingin ≈ +6% konsumsi pendinginan'],
  next:['Pelajari pengukuran baseline dengan power logger','Susun audit ISO 50001: siklus Plan-Do-Check-Act','Hitung kelayakan investasi: simple payback & IRR']},
 logger:{lvl:'JALUR 06 · ENERGY AUDITOR · MISI 2',icon:'🔌',title:'Pemasangan Power Logger',strict:false,
  loc:'📍 PT Maju Plastik · Panel utama produksi',
  story:'Walkthrough memberi dugaan; sekarang saatnya BUKTI. Kamu kembali ke pabrik membawa power logger 3 fasa — alat yang merekam tegangan, arus, daya & cosφ tiap 15 menit selama seminggu penuh. Baseline inilah fondasi rekomendasi audit yang kredibel.',
  goal:'Logger terpasang aman di panel, merekam 7 hari penuh, dan profil beban berhasil dibaca.',
  obj:['Persiapan keselamatan sebelum membuka panel','Pasang CT clamp & probe tegangan dengan benar','Konfigurasi, rekam, lalu baca profil beban'],
  learn:['Baseline minimal satu siklus produksi penuh — snapshot sesaat itu menipu','CT clamp punya ARAH (panah ke beban); terbalik = pembacaan daya negatif','Interval 15 menit = standar analisis beban, selaras pengukuran demand PLN','Dari profil mingguan terlihat: beban dasar malam, puncak shift, dan anomali akhir pekan'],
  next:['Pelajari analisis power quality: harmonisa, sag, flicker','Hitung baseline regression (kWh vs produksi) untuk M&V','Susun laporan audit lengkap mengacu ISO 50002']},
});

/* =====================================================================
   MISI 11 — AUDIT ENERGI (Jalur 06)
   ===================================================================== */
let mad={};
function buildAudit(){
  freshScene(0xb8c6d4,0x141d28);
  cam={theta:.1,phi:1.2,r:8.5,target:new THREE.Vector3(0,1.6,-.8)};
  const Z=room(0x55606a,0xb9c4bd,16,11);

  /* clipboard auditor */
  mad.clip=box(.45,.6,.05,0xe8e4d8);mad.clip.position.set(-5.6,1.5,-1.0);
  mad.clip.rotation.y=.6;scene.add(mad.clip);
  actMesh(mad.clip,'WALK');
  scene.add(label('CLIPBOARD AUDIT',.65,'#5fd4ff').translateX(-5.6).translateY(2.0).translateZ(-1.0));

  /* lampu menyala siang */
  mad.lamps=[];
  [-3.4,-2.2,-1.0].forEach(x=>{
    const fit=cyl(.07,.1,.16,0x444444);fit.position.set(x,3.6,-1.5);scene.add(fit);
    const b=new THREE.Mesh(new THREE.SphereGeometry(.13,16,12),
      new THREE.MeshStandardMaterial({color:0xfff4c2,emissive:0xffd97a,emissiveIntensity:1}));
    b.position.set(x,3.42,-1.5);scene.add(b);actMesh(b,'LAMP');mad.lamps.push(b);});
  scene.add(label('LAMPU NYALA SIANG?',.7,'#ffd23f').translateX(-2.2).translateY(3.95).translateZ(-1.5));

  /* kompresor dengan kebocoran */
  const komp=box(1.3,1.0,.8,0x4a6a8a);komp.position.set(1.0,.55,-2.2);scene.add(komp);
  const tank=cyl(.32,.32,1.2,0x6a8aa8);tank.rotation.z=Math.PI/2;tank.position.set(1.0,1.35,-2.2);scene.add(tank);
  actMesh(komp,'KOMP'); actMesh(tank,'KOMP');
  scene.add(label('KOMPRESOR UDARA',.7).translateX(1.0).translateY(2.0).translateZ(-2.2));

  /* motor tua */
  const mb=cyl(.3,.3,.8,0x6a6a5a);mb.rotation.z=Math.PI/2;mb.position.set(3.8,.55,-2.0);scene.add(mb);
  actMesh(mb,'MTR');
  scene.add(label('MOTOR LAMA (IE1)',.65).translateX(3.8).translateY(1.1).translateZ(-2.0));

  /* AC unit */
  const ac=box(1.0,.4,.3,0xe8edf2);ac.position.set(5.6,3.0,Z+.2);scene.add(ac);
  actMesh(ac,'AC');
  scene.add(label('AC · SET 18°C ❄️',.65,'#9cc4ff').translateX(5.6).translateY(3.45).translateZ(Z+.2));

  startSeq([
   {type:'act',aid:'WALK',done:false,targets:()=>[mad.clip],
    desc:'Ambil CLIPBOARD — mulai walkthrough audit (klik clipboard).',
    why:'Audit level 1 dimulai dengan walkthrough sistematis: berjalan dengan rute tetap, mencatat semua yang menyala, bocor, panas, atau berisik. Mata terlatih melihat uang menguap.',
    fx(){toast('📋 Walkthrough dimulai — area produksi.','info',2200);}},
   {type:'act',aid:'LAMP',done:false,targets:()=>[mad.lamps[1]],
    desc:'Temuan #1: lampu menyala di siang bolong (klik lampu).',
    why:'Solusi termurah seluruh dunia audit: matikan yang tak perlu. Akar masalahnya kontrol (tak ada sensor/zonasi) dan perilaku. 3 lampu × 12 jam sia-sia × 365 hari = nyata di tagihan.',
    fx(){mad.lamps.forEach(l=>{l.material.emissiveIntensity=0;});
      toast('💡 Dicatat: pencahayaan tanpa kontrol — rekomendasi sensor & zonasi.','ok',2600);}},
   {type:'act',aid:'KOMP',done:false,targets:()=>[komp],
    desc:'Temuan #2: dengar desisan di KOMPRESOR (klik kompresor).',
    why:'Kebocoran udara tekan adalah musuh tak terlihat: lubang 3 mm pada 7 bar ≈ jutaan rupiah setahun, dan kompresor terus bekerja mengisi kebocoran. Cek dengan ultrasonic leak detector.',
    fx(){toast('💨 Terdeteksi 2 titik bocor — tagging untuk perbaikan.','ok',2600);}},
   {type:'act',aid:'MTR',done:false,targets:()=>[mb],
    desc:'Temuan #3: ukur MOTOR lama dengan power meter (klik motor).',
    why:'Motor IE1 tua berbeban parsial = efisiensi jeblok. Pada jam operasi panjang, upgrade ke IE3 + VFD untuk beban variabel sering balik modal < 2 tahun.',
    fx(){toast('⚙️ Terukur: cosφ 0,71 · beban 45% — kandidat VFD.','ok',2600);}},
   {type:'act',aid:'AC',done:false,targets:()=>[ac],
    desc:'Temuan #4: AC diset 18°C! (klik unit AC).',
    why:'Setiap 1°C lebih dingin dari kebutuhan ≈ +6% konsumsi pendinginan. 18→25°C pada area non-proses = penghematan dua digit tanpa investasi sepeser pun.',
    fx(){toast('❄️ Setpoint dinaikkan ke 25°C + jadwal otomatis.','ok',2600);}},
   {type:'act',aid:'WALK2',done:false,targets:()=>[mad.clip],
    desc:'Kembali ke CLIPBOARD — susun laporan & potensi penghematan.',
    why:'Laporan audit yang baik memisahkan rekomendasi: no-cost (perilaku/setpoint), low-cost (sensor, perbaikan bocor), investasi (VFD, retrofit) — masing-masing dengan payback.',
    fx(){toast('📋 LAPORAN: potensi hemat ±18% (no-cost 7% + investasi 11%).','ok',3000);sfx.big();}},
  ],()=>{say('🎉 <b>Audit selesai — potensi 18%!</b> Empat temuan, empat solusi, dari gratis sampai investasi ber-payback. Begitulah auditor mengubah jalan kaki menjadi uang.');
    setTimeout(()=>showWin('audit'),2200);});
  mad.clip2=mad.clip; mad.clip.userData={kind:'act',aid:'WALK'};
  /* clipboard dipakai 2x: ganti aid setelah langkah pertama */
  const origFx=seq.steps[0].fx;
  seq.steps[0].fx=()=>{origFx();mad.clip.userData.aid='WALK2';};

  say('VOLTA di sini 📋 Hari ini kita jalan kaki menghasilkan uang: <b>walkthrough audit energi</b>. Empat pemborosan bersembunyi di pabrik ini — temukan semuanya. Mulai dari clipboard di kiri.');
  $('#modTitle').textContent='J06 — Walkthrough Audit Energi';
  $('#taskHead').textContent='EMPAT TEMUAN TERSEMBUNYI';}

/* =====================================================================
   MISI 24 — POWER LOGGER (Jalur 06 · Misi 2)
   ===================================================================== */
let mlg={};
function buildLogger(){
  freshScene(0xb8c6d4,0x141d28);
  cam={theta:-.05,phi:1.18,r:6.5,target:new THREE.Vector3(0,1.7,-1)};
  const Z=room(0x55606a,0xb9c4bd);
  /* panel utama terbuka */
  const panel=boxT(2.4,2.6,.3,TEX.metal(),{metalness:.35});panel.position.set(-1.6,1.7,Z-.05);scene.add(panel);
  panel.add(label('PANEL UTAMA PRODUKSI',.85).translateY(1.6));
  /* busbar 3 fasa */
  mlg.bars=[];
  [['R',0xd83a3a,-2.2],['S',0xd8b020,-1.6],['T',0x2d2d2d,-1.0]].forEach(o=>{
    const b=box(.12,1.6,.06,o[1]);b.position.set(o[2],1.7,Z+.14);scene.add(b);mlg.bars.push(b);
    scene.add(label(o[0],.42).translateX(o[2]).translateY(2.7).translateZ(Z+.1));});
  /* sarung tangan */
  mlg.glove=box(.2,.3,.06,0xcc6b2c);mlg.glove.position.set(-3.6,1.5,Z+.1);scene.add(mlg.glove);
  actMesh(mlg.glove,'APD');
  scene.add(label('SARUNG TANGAN',.55,'#5fd4ff').translateX(-3.6).translateY(1.95).translateZ(Z+.1));
  /* meja + logger + CT clamp + probe + laptop */
  const tbl=boxT(2.6,.08,.9,TEX.wood());tbl.position.set(2.4,.95,-.6);scene.add(tbl);
  const tleg=boxT(.08,.95,.08,TEX.wood());tleg.position.set(2.4,.47,-.6);scene.add(tleg);
  mlg.ct=new THREE.Mesh(new THREE.TorusGeometry(.13,.035,10,22),
    new THREE.MeshStandardMaterial({color:0x2a72c8,roughness:.5}));
  mlg.ct.position.set(1.5,1.12,-.6);scene.add(mlg.ct);
  actMesh(mlg.ct,'CT');
  scene.add(label('CT CLAMP ×3',.55,'#5fd4ff').translateX(1.5).translateY(1.45).translateZ(-.6));
  mlg.probe=box(.1,.3,.08,0xd83a3a);mlg.probe.position.set(2.2,1.1,-.6);scene.add(mlg.probe);
  actMesh(mlg.probe,'VPROBE');
  scene.add(label('PROBE TEGANGAN',.55,'#5fd4ff').translateX(2.3).translateY(1.45).translateZ(-.6));
  mlg.log=box(.46,.3,.3,0x33404e);mlg.log.position.set(3.1,1.12,-.6);scene.add(mlg.log);
  mlg.L=makeDisplay(.4,.22,200,110);
  mlg.L.mesh.position.set(3.1,1.16,-.44);scene.add(mlg.L.mesh);
  dispText(mlg.L,['LOGGER','OFF'],['#5fd4ff','#7d8f84']);
  actMesh(mlg.L.mesh,'CFG');
  mlg.btn=cyl(.05,.05,.06,0xd83a3a);mlg.btn.rotation.x=Math.PI/2;
  mlg.btn.position.set(3.32,1.3,-.5);scene.add(mlg.btn);
  actMesh(mlg.btn,'REC');
  scene.add(label('POWER LOGGER',.55,'#5fd4ff').translateX(3.1).translateY(1.5).translateZ(-.6));
  /* laptop analisis */
  const lap=box(.7,.05,.5,0x2b3a4a);lap.position.set(4.6,1.1,-1.4);scene.add(lap);
  mlg.S=makeDisplay(.66,.42,330,210);
  mlg.S.mesh.position.set(4.6,1.4,-1.62);mlg.S.mesh.rotation.x=-.15;scene.add(mlg.S.mesh);
  dispText(mlg.S,['ANALISIS','menunggu data…'],['#5fd4ff','#7d8f84']);
  actMesh(mlg.S.mesh,'READ');
  scene.add(label('LAPTOP AUDITOR',.6,'#5fd4ff').translateX(4.6).translateY(1.85).translateZ(-1.6));

  startSeq([
   {type:'act',aid:'APD',done:false,targets:()=>[mlg.glove],
    desc:'Panel hidup! Kenakan SARUNG TANGAN isolasi dulu.',
    why:'Logger dipasang pada panel BERTEGANGAN (justru itu tujuannya — merekam operasi nyata). Bekerja dekat busbar hidup tanpa APD = mempertaruhkan nyawa demi data.',
    fx(){toast('🧤 APD terpasang — boleh mendekati panel.','ok',2200);}},
   {type:'act',aid:'CT',done:false,targets:()=>[mlg.ct],
    desc:'Pasang CT CLAMP ke busbar R, S, T (klik clamp).',
    why:'Clamp membuka & memeluk busbar tanpa memutus rangkaian. Perhatikan PANAH arah arus menghadap beban — terbalik berarti daya terbaca negatif dan analisis kacau.',
    fx(){const c2=mlg.ct.clone();c2.position.set(-1.6,1.9,Z+.2);scene.add(c2);
      const c3=mlg.ct.clone();c3.position.set(-1.0,1.9,Z+.2);scene.add(c3);
      mlg.ct.position.set(-2.2,1.9,Z+.2);
      toast('🔗 3 CT terpasang, panah ke arah beban ✓','ok',2600);}},
   {type:'act',aid:'VPROBE',done:false,targets:()=>[mlg.probe],
    desc:'Pasang PROBE TEGANGAN ke tiap fasa + netral.',
    why:'Daya = V × I × cosφ: tanpa referensi tegangan, logger hanya tahu arus. Probe dijepit pada terminal berfuse — perlindungan bila ada gangguan saat pengukuran berhari-hari.',
    fx(){mlg.probe.position.set(-1.3,2.3,Z+.2);
      toast('🔌 Probe tegangan 4 titik terpasang ✓','ok',2400);}},
   {type:'act',aid:'CFG',done:false,targets:()=>[mlg.L.mesh],
    desc:'KONFIGURASI logger: interval & durasi (klik layar logger).',
    why:'Interval 15 menit × 7 hari = 672 titik data per kanal — cukup melihat pola shift, beban dasar malam, dan akhir pekan. Interval terlalu panjang menyembunyikan lonjakan.',
    fx(){dispText(mlg.L,['15 MENIT','7 hari · 3P4W ✓'],['#5fd4ff','#46ff8e']);
      toast('⚙️ Set: 3 fasa 4 kawat · 15 menit · 7 hari.','ok',2600);}},
   {type:'act',aid:'REC',done:false,targets:()=>[mlg.btn],
    desc:'Mulai REKAM (klik tombol merah logger), tutup panel, tinggalkan.',
    why:'Logger kini bekerja sendirian merekam kejujuran pabrik — termasuk saat tak ada yang menonton. Panel ditutup & diberi label "ALAT UKUR TERPASANG — JANGAN DIMATIKAN".',
    fx(){dispText(mlg.L,['● REC','672 titik / kanal'],['#ff5a5a','#7d8f84']);
      toast('⏺ Logging berjalan… (simulasi: 7 hari berlalu)','info',2800);}},
   {type:'act',aid:'READ',done:false,targets:()=>[mlg.S.mesh],
    desc:'Seminggu kemudian: DOWNLOAD & baca profil di laptop.',
    why:'Profil bicara: beban dasar malam 86 kW (kompresor bocor + lampu!), puncak shift 1 = 412 kW, dan Sabtu sore ada beban misterius 120 kW. Tiga temuan baru dari satu grafik.',
    fx(){const g=mlg.S.g;g.fillStyle='#0c141d';g.fillRect(0,0,330,210);
      g.strokeStyle='#46ff8e';g.lineWidth=3;g.beginPath();
      for(let i=0;i<=66;i++){const d=i/66*7;
        const v=.25+.55*Math.max(0,Math.sin((d%1)*Math.PI*1.1))*(d%7<5?1:.45);
        g.lineTo(20+i*4.4,180-v*150);}
      g.stroke();g.fillStyle='#ffd23f';g.font='700 18px Consolas';g.textAlign='left';
      g.fillText('BASE 86kW · PEAK 412kW',20,30);mlg.S.tex.needsUpdate=true;
      toast('💻 Profil 7 hari terbaca — baseline audit SAH!','ok',3000);sfx.big();}},
  ],()=>{say('🎉 <b>Baseline terukur, bukan terkira!</b> 672 titik data menggantikan seribu asumsi. Rekomendasi auditmu kini berdiri di atas bukti.');
    setTimeout(()=>showWin('logger'),2200);});

  say('VOLTA di sini 🔌 Auditor sejati tidak berdebat dengan opini — ia memasang <b>power logger</b> dan membiarkan data bicara. Panel ini hidup, jadi: APD dulu, alat kemudian.');
  $('#modTitle').textContent='J06·M2 — Pemasangan Power Logger';
  $('#taskHead').textContent='PASANG · REKAM · BACA';}

MISSIONS.audit.build=buildAudit;
MISSIONS.logger.build=buildLogger;

Object.assign(REAL,{
 audit:[
  'Ukur baseline minimal satu siklus produksi penuh dengan power logger sebelum menyimpulkan',
  'Pisahkan rekomendasi: no-cost (perilaku/setpoint) → low-cost (sensor, perbaikan) → investasi (VFD, retrofit)',
  'Setiap rekomendasi wajib disertai simple payback — bahasa yang dipahami manajemen',
  'ISO 50001 adalah siklus Plan-Do-Check-Act berkelanjutan, bukan laporan sekali jadi'],
 logger:[
  'Pemasangan logger di panel hidup hanya oleh teknisi kompeten dengan APD sesuai kategori arc flash',
  'Pastikan rasio CT clamp & range tegangan sesuai — salah rasio = data sampah seminggu',
  'Foto posisi pemasangan & beri label "alat ukur terpasang" agar tidak dimatikan operator',
  'Sinkronkan jam logger sebelum mulai — analisis multi-titik butuh timestamp yang seragam'],
});

/* =====================================================================
   MISI 3 — ANALISIS TARIF & LOAD SHIFTING
   ===================================================================== */
Object.assign(MISSIONS,{
 tarif:{lvl:'JALUR 06 · ENERGY AUDITOR · MISI 3',icon:'💸',title:'Analisis Tarif & Load Shifting WBP/LWBP',strict:false,
  loc:'📍 PT Maju Plastik · Tindak lanjut audit, ruang produksi',
  story:'Logger sudah bicara, efisiensi teknis sudah berjalan — kini lapisan penghematan yang sering terlewat: STRUKTUR TARIF. Tagihan industri membedakan WBP (waktu beban puncak, 18:00–22:00) yang jauh lebih mahal dari LWBP. Dan profil logger menunjukkan: proses paling rakus justru berjalan di jam termahal.',
  goal:'Beban yang bisa digeser teridentifikasi, jadwal produksi baru tersusun, dan penghematan dihitung tanpa mengurangi output produksi.',
  obj:['Pahami struktur tarif & temukan biaya WBP','Identifikasi proses yang bisa digeser (dan yang tidak)','Susun jadwal baru & hitung penghematan'],
  learn:['Tarif industri: WBP (18–22) bisa ~1,5x LWBP — kWh yang sama, harga berbeda hanya karena JAM','Load shifting menghemat tanpa mengurangi konsumsi: energi sama, waktu berbeda','Yang bisa digeser: proses batch dengan buffer (giling, mixing, charging). Yang tidak: proses kontinu & jam kerja orang','Shifting juga menolong PLN: puncak sistem turun — itulah kenapa struktur tarifnya dibuat demikian'],
  next:['Pelajari tarif premium & captive power: kapan genset/PLTS lebih murah dari WBP','Simulasikan BESS untuk arbitrase tarif di pelanggan industri','Dalami demand response: insentif memangkas beban saat sistem genting']},
});
let mtf={};
function buildTarif(){
  freshScene(0xb8c6d4,0x141d28);
  cam={theta:.05,phi:1.2,r:8,target:new THREE.Vector3(0,1.6,-.8)};
  const Z=room(0x55606a,0xb9c4bd,16,11);
  /* papan tarif + profil */
  mtf.D=makeDisplay(3.4,1.8,560,300);
  mtf.D.mesh.position.set(-3.2,2.3,Z+.08);scene.add(mtf.D.mesh);
  actMesh(mtf.D.mesh,'BILL');
  scene.add(label('STRUKTUR TAGIHAN & PROFIL',.8,'#5fd4ff').translateX(-3.2).translateY(3.4).translateZ(Z+.1));
  function draw(mode){
    const g=mtf.D.g,W=560,H=300;
    g.fillStyle='#0c141d';g.fillRect(0,0,W,H);
    g.strokeStyle='#2a3a4c';g.lineWidth=2;
    g.beginPath();g.moveTo(40,16);g.lineTo(40,H-34);g.lineTo(W-14,H-34);g.stroke();
    /* zona WBP 18-22 */
    const x18=40+18/24*(W-66), x22=40+22/24*(W-66);
    g.fillStyle=mode>=2?'#1c3a2a':'#3a1c1c';g.fillRect(x18,16,x22-x18,H-50);
    g.fillStyle='#ff8d8d';g.font='600 15px Consolas';g.textAlign='center';
    g.fillText('WBP 1,5x',x18+(x22-x18)/2,32);
    g.strokeStyle='#ffd23f';g.lineWidth=3;g.beginPath();
    for(let h=0;h<=24;h++){
      let v=.3+.1*Math.sin(h/24*Math.PI*2-1);
      if(mode<2){if(h>=18&&h<=22)v=.85;}     /* batch malam */
      else{if(h>=1&&h<=5)v=.85;if(h>=18&&h<=22)v=.35;} /* digeser */
      const x=40+h/24*(W-66),y=H-34-v*(H-80);
      h===0?g.moveTo(x,y):g.lineTo(x,y);}
    g.stroke();
    g.fillStyle='#8aa3bd';g.font='600 14px Consolas';
    [0,6,12,18,24].forEach(h=>g.fillText(h+':00',40+h/24*(W-66),H-14));
    g.textAlign='left';g.fillStyle=mode>=2?'#46ff8e':'#ffd23f';g.font='700 16px Consolas';
    g.fillText(mode>=2?'GILINGAN → 01:00-05:00 (LWBP) ✓':'GILINGAN jalan 18-22 = jam TERMAHAL',48,H-44);
    mtf.D.tex.needsUpdate=true;}
  draw(0);
  /* mesin-mesin */
  mtf.giling=boxT(1.6,1.3,1.0,TEX.metal(),{metalness:.3});mtf.giling.position.set(1.2,.7,-1.6);scene.add(mtf.giling);
  actMesh(mtf.giling,'MESIN');
  scene.add(label('GILINGAN PLASTIK 90kW · BATCH',.65,'#ffd23f').translateX(1.2).translateY(1.7).translateZ(-1.6));
  const ext=boxT(2.2,.9,.8,TEX.metal(),{metalness:.3});ext.position.set(4.4,.5,-1.8);scene.add(ext);
  actMesh(ext,'EXT');
  scene.add(label('EXTRUDER · KONTINU 24 JAM',.6).translateX(4.4).translateY(1.25).translateZ(-1.8));
  /* papan jadwal & kalkulator */
  mtf.jadwal=box(.9,.65,.05,0xe8e4d8);mtf.jadwal.position.set(2.4,2.2,Z+.06);scene.add(mtf.jadwal);
  actMesh(mtf.jadwal,'JADWAL');
  scene.add(label('PAPAN JADWAL PRODUKSI',.6,'#5fd4ff').translateX(2.4).translateY(2.75).translateZ(Z+.1));
  mtf.calc=box(.3,.05,.4,0x33404e);mtf.calc.position.set(5.2,1.0,-.2);scene.add(mtf.calc);
  actMesh(mtf.calc,'HITUNG');
  scene.add(label('KALKULATOR',.5,'#5fd4ff').translateX(5.2).translateY(1.3).translateZ(-.2));
  startSeq([
   {type:'act',aid:'BILL',done:false,targets:()=>[mtf.D.mesh],
    desc:'Bedah struktur TAGIHAN: di mana uang menguap? (klik layar)',
    why:'Blok WBP 18:00–22:00 dihargai ~1,5x. Dan lihat kurvanya: gunung beban justru berdiri tegak persis di zona merah itu — 90 kW gilingan menyala di jam termahal, tiap malam, sepanjang tahun.',
    fx(){toast('🧾 38% biaya datang dari 4 jam WBP — gunung di zona merah.','bad',3000);}},
   {type:'act',aid:'MESIN',done:false,targets:()=>[mtf.giling],
    desc:'Identifikasi proses yang BISA digeser (klik mesin yang tepat).',
    why:'Gilingan = proses BATCH dengan silo penampung: hasil gilingan malam ini baru dipakai extruder besok. Ada buffer = bisa pindah jam. Extruder? Kontinu 24 jam, ada operator shift — dia tinggal di tempat.',
    fx(){toast('✅ Gilingan: batch + silo buffer = BISA digeser. Extruder: tetap.','ok',3000);}},
   {type:'act',aid:'JADWAL',done:false,targets:()=>[mtf.jadwal],
    desc:'Susun JADWAL baru bersama kepala produksi (klik papan).',
    why:'Gilingan pindah ke 01:00–05:00 (LWBP terdalam). Kuncinya kolaborasi: kepala produksi memastikan silo cukup & operator shift malam tersedia. Penghematan yang merusak produksi bukan penghematan.',
    fx(){draw(2);toast('📋 Jadwal baru: gilingan 01:00-05:00 — produksi aman.','ok',2800);}},
   {type:'act',aid:'HITUNG',done:false,targets:()=>[mtf.calc],
    desc:'HITUNG penghematannya (klik kalkulator).',
    why:'90 kW × 4 jam × 25 hari = 9.000 kWh/bulan pindah dari tarif WBP ke LWBP. Selisihnya ±Rp 6,5 juta per bulan — Rp 78 juta setahun. Tanpa investasi sepeser pun: hanya memindah JAM.',
    fx(){toast('💸 Hemat ±Rp 6,5 jt/bln (Rp 78 jt/thn) — investasi: NOL.','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Penghematan termurah sedunia: memindah jam!</b> kWh-nya sama, harganya beda. Auditor yang paham tarif melihat uang di tempat orang lain melihat jadwal.');
    setTimeout(()=>showWin('tarif'),2200);});
  say('VOLTA di sini 💸 Lapisan penghematan ketiga: <b>struktur tarif</b>. WBP 18–22 itu mahal — dan tugasmu memindahkan gunung beban keluar dari zona itu tanpa mengganggu produksi. Mulai dari tagihan.');
  $('#modTitle').textContent='J06·M3 — Analisis Tarif & Load Shifting';
  $('#taskHead').textContent='GESER JAM, BUKAN PRODUKSI';}
MISSIONS.tarif.build=buildTarif;
Object.assign(REAL,{
 tarif:[
  'Validasi jam WBP/LWBP & faktor pengali pada tarif yang berlaku di golongan pelanggan tersebut',
  'Libatkan kepala produksi sejak awal — jadwal yang dipaksakan auditor akan dikembalikan diam-diam',
  'Perhitungkan biaya ikutan shift malam: lembur operator, keamanan, pencahayaan — netto tetap harus positif',
  'Pantau 3 bulan pertama dengan logger: pastikan beban benar-benar pindah & penghematan terealisasi'],
});

/* =====================================================================
   MISI 4 — AUDIT EFISIENSI BOILER
   ===================================================================== */
Object.assign(MISSIONS,{
 boiler:{lvl:'JALUR 06 · ENERGY AUDITOR · MISI 4',icon:'🔥',title:'Audit Efisiensi Boiler',strict:false,
  loc:'📍 PT Maju Plastik · Ruang boiler 4 ton/jam',
  story:'Listrik sudah dijinakkan — kini auditormu menengok pemakan energi satunya: boiler gas 4 ton/jam yang menelan 40% biaya energi pabrik. Boiler tua jarang berteriak; ia hanya diam-diam membuang uangmu lewat cerobong. Hari ini kamu membawa flue gas analyzer dan satu pertanyaan: berapa persen rupiah yang terbang jadi asap?',
  goal:'Efisiensi boiler terukur dengan metode tak langsung, dua pemborosan ditemukan & dikoreksi, dan potensi penghematan terhitung.',
  obj:['Ukur gas buang: O2, suhu cerobong, CO','Diagnosa: excess air & kerak — lalu koreksi','Hitung kenaikan efisiensi & nilai rupiahnya'],
  learn:['Efisiensi boiler diukur dari KERUGIANNYA (metode tak langsung): rugi cerobong + radiasi + blowdown — yang tersisa itulah efisiensi','O2 gas buang tinggi = excess air berlebih: udara yang tak ikut bereaksi tetap MINTA dipanaskan lalu kabur lewat cerobong','Suhu cerobong naik dari baseline = kerak/jelaga di pipa: isolator yang menghalangi panas masuk ke air','Aturan praktis: tiap turun 20°C suhu cerobong ≈ efisiensi naik 1%'],
  next:['Pelajari ekonomizer: memanen panas cerobong untuk air umpan','Audit blowdown & TDS control otomatis','Dalami steam trap survey — uap bocor senyap di ratusan trap']},
});
let mbo={};
function buildBoiler(){
  freshScene(0xb8c6d4,0x141d28);
  cam={theta:.1,phi:1.18,r:8,target:new THREE.Vector3(0,1.8,-.8)};
  const Z=room(0x55606a,0xb9c4bd,16,11);
  /* boiler besar */
  mbo.body=cyl(1.1,1.1,3.2,0x8a6a4a,24,{metalness:.25,roughness:.6});
  mbo.body.rotation.z=Math.PI/2;mbo.body.position.set(-2.2,1.5,-1.8);scene.add(mbo.body);
  scene.add(label('BOILER GAS 4 t/j',.85).translateX(-2.2).translateY(3.0).translateZ(-1.8));
  /* burner + damper udara */
  mbo.damper=box(.5,.4,.3,0x8a96a2);mbo.damper.position.set(-4.2,1.5,-1.8);scene.add(mbo.damper);
  actMesh(mbo.damper,'DAMPER');
  scene.add(label('BURNER + DAMPER UDARA',.6,'#5fd4ff').translateX(-4.2).translateY(2.2).translateZ(-1.8));
  /* cerobong + port sampling */
  const stack=cyl(.3,.38,3.6,0xb8b0a8);stack.position.set(0,3.2,-1.8);scene.add(stack);
  mbo.port=cyl(.07,.07,.3,0xd8b020);mbo.port.rotation.z=Math.PI/2;
  mbo.port.position.set(.35,3.6,-1.8);scene.add(mbo.port);
  actMesh(mbo.port,'UKUR');
  scene.add(label('PORT SAMPLING',.55,'#5fd4ff').translateX(1.1).translateY(3.85).translateZ(-1.8));
  /* analyzer di meja */
  const tbl=boxT(1.2,.07,.7,TEX.wood());tbl.position.set(2.6,.95,.4);scene.add(tbl);
  const tleg=boxT(.08,.95,.08,TEX.wood());tleg.position.set(2.6,.47,.4);scene.add(tleg);
  mbo.ana=box(.34,.24,.26,0xd8b020);mbo.ana.position.set(2.6,1.1,.4);scene.add(mbo.ana);
  scene.add(label('FLUE GAS ANALYZER',.55,'#5fd4ff').translateX(2.6).translateY(1.45).translateZ(.4));
  /* display hasil */
  mbo.D=makeDisplay(2.0,1.1,420,240);
  mbo.D.mesh.position.set(4.6,2.2,-1.8);mbo.D.mesh.rotation.y=-.3;scene.add(mbo.D.mesh);
  dispText(mbo.D,['ANALISIS BOILER','menunggu sampel…'],['#5fd4ff','#7d8f84']);
  actMesh(mbo.D.mesh,'HASIL');
  const pole=cyl(.04,.04,1.6,0x666666);pole.position.set(4.6,.8,-1.8);scene.add(pole);
  /* tube cleaning tool */
  mbo.sikat=cyl(.04,.04,1.6,0x2a72c8);mbo.sikat.rotation.z=.5;
  mbo.sikat.position.set(.6,1.0,.6);scene.add(mbo.sikat);
  actMesh(mbo.sikat,'KERAK');
  scene.add(label('TUBE BRUSH',.5,'#5fd4ff').translateX(.9).translateY(1.5).translateZ(.6));
  startSeq([
   {type:'act',aid:'UKUR',done:false,targets:()=>[mbo.port],
    desc:'Masukkan probe analyzer ke PORT SAMPLING cerobong.',
    why:'Hasil: O2 = 9,2% · suhu cerobong 285°C · CO rendah. Dua angka itu adalah dua dakwaan: O2 sebegitu tinggi berarti udara berlebih jauh; 285°C (baseline komisioning: 215°C) berarti ada isolator liar di dalam pipa — kerak.',
    fx(){dispText(mbo.D,['O2 9,2% · 285°C','eff: 78% — ada 2 masalah'],['#ff5a5a','#ffd23f']);
      toast('📏 O2 9,2% & 285°C — efisiensi cuma 78%. Dua tersangka!','bad',3000);}},
   {type:'act',aid:'DAMPER',done:false,targets:()=>[mbo.damper],
    desc:'Koreksi #1: tala DAMPER udara — turunkan excess air.',
    why:'O2 ideal gas alam: 2-3% (excess air ±15%). Damper dirapatkan bertahap sambil mengawasi CO — udara kurang membuat CO meledak naik (bahan bakar tak terbakar tuntas). Berhenti tepat sebelum CO bangun: di sanalah titik manis pembakaran.',
    fx(){dispText(mbo.D,['O2 2,8% ✓ · 282°C','CO aman — udara pas'],['#46ff8e','#ffd23f']);
      toast('💨 O2 turun ke 2,8%, CO tetap rendah — pembakaran pas.','ok',3000);}},
   {type:'act',aid:'KERAK',done:false,targets:()=>[mbo.sikat],
    desc:'Koreksi #2: jadwalkan TUBE CLEANING — buang keraknya.',
    why:'Kerak 1 mm di sisi air bisa mencuri 2-5% efisiensi: panas yang harusnya mendidihkan air malah numpang lewat ke cerobong. Setelah cleaning (dijadwalkan akhir pekan) suhu cerobong diproyeksikan turun 285→225°C ≈ efisiensi +3%.',
    fx(){toast('🧹 Tube cleaning terjadwal — cerobong akan turun ±60°C.','ok',2800);}},
   {type:'act',aid:'HASIL',done:false,targets:()=>[mbo.D.mesh],
    desc:'Hitung HASIL akhir: efisiensi & rupiah (klik layar).',
    why:'Damper: +2,5% · cleaning: +3% → efisiensi 78% → 83,5%. Pada konsumsi gas Rp 320 jt/bulan, tiap persen ≈ Rp 3,8 jt — total hemat ±Rp 21 jt/bulan. Modalnya: satu probe, satu obeng damper, satu sikat. Auditor terbaik memang murah meriah.',
    fx(){dispText(mbo.D,['EFISIENSI 83,5% ✓','hemat ±Rp 21 jt/bln'],['#46ff8e','#46ff8e']);
      toast('💰 78% → 83,5% = Rp 21 jt/bulan kembali dari cerobong!','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Cerobong berhenti membakar uang!</b> O2 ditata, kerak diusir, 5,5% efisiensi pulang kembali. Boiler tak pernah bohong — ia hanya menunggu ditanya dengan alat yang benar.');
    setTimeout(()=>showWin('boiler'),2200);});
  say('VOLTA di sini 🔥 Target audit berikutnya: <b>boiler</b>, pemakan 40% biaya energi pabrik. Dua angka akan membuka semuanya: O2 dan suhu cerobong. Tusukkan probe-mu!');
  $('#modTitle').textContent='J06·M4 — Audit Efisiensi Boiler';
  $('#taskHead').textContent='UKUR ASAP, TEMUKAN UANG';}
MISSIONS.boiler.build=buildBoiler;
Object.assign(REAL,{
 boiler:[
  'Pengukuran gas buang pada beban representatif & stabil (bukan saat start/low fire)',
  'Kalibrasi analyzer sebelum survey; sel O2/CO punya umur & drift',
  'Penalaan damper dilakukan teknisi burner kompeten — CO tinggi berbahaya bagi ruangan',
  'Pasang termometer cerobong permanen: kenaikan suhu = alarm dini kerak, bukan temuan tahunan'],
});
