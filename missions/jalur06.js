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

/* =====================================================================
   MISI 5 — AUDIT SISTEM CHILLER & PENDINGIN
   ===================================================================== */
Object.assign(MISSIONS,{
 chiller:{lvl:'JALUR 06 · ENERGY AUDITOR · MISI 5',icon:'❄️',title:'Audit Sistem Chiller & Pendingin',strict:false,
  loc:'📍 Mall Indramayu Plaza · Ruang chiller basement',
  story:'Klien barumu sebuah mall: 60% tagihan listriknya dimakan sistem pendingin. Di basement, dua chiller raksasa bekerja — dan tak seorang pun tahu apakah mereka bekerja EFISIEN atau sekadar bekerja. Auditor membawa satu angka sakti yang meringkas segalanya: kW/TR — berapa listrik dibayar untuk tiap ton pendinginan.',
  goal:'Kinerja chiller terukur (kW/TR), tiga pemborosan ditemukan & dikoreksi, dan penghematan terverifikasi tanpa mengorbankan kenyamanan.',
  obj:['Ukur kinerja: kW/TR aktual vs desain','Periksa approach temperature kondensor & evaporator','Koreksi: setpoint, kondensor kotor, & jadwalkan sequencing'],
  learn:['kW/TR = listrik per ton pendinginan: 0,6 = sehat, 0,9 = bermasalah — satu angka untuk menilai seluruh mesin','Approach temperature (selisih suhu refrigeran vs air) adalah stetoskop heat-exchanger: approach membesar = permukaan kotor/fouling','Chilled water setpoint dinaikkan 1°C ≈ hemat 2-3% — kenyamanan diukur dari ruangan, bukan dari angka air sedingin mungkin','Dua chiller 50% lebih boros dari satu chiller 90% — sequencing yang benar memilih kombinasi paling efisien'],
  next:['Pelajari variable primary flow & pompa VSD pada plant pendingin','Dalami cooling tower: wet bulb approach & water treatment','Hitung IPLV/NPLV — efisiensi part-load yang sebenarnya']},
});
let mch={};
function buildChiller(){
  freshScene(0x9fb6c8,0x0f1820);
  cam={theta:.1,phi:1.18,r:8.5,target:new THREE.Vector3(0,1.6,-.8)};
  const Z=room(0x55606a,0xb9c4bd,16,11);
  /* dua chiller */
  mch.ch1=boxT(2.6,1.6,1.2,TEX.metal(),{metalness:.35});mch.ch1.position.set(-3.4,.85,-1.8);scene.add(mch.ch1);
  scene.add(label('CHILLER-1 · 300 TR',.7).translateX(-3.4).translateY(1.95).translateZ(-1.8));
  mch.ch2=boxT(2.6,1.6,1.2,TEX.metal(),{metalness:.35});mch.ch2.position.set(.4,.85,-1.8);scene.add(mch.ch2);
  actMesh(mch.ch2,'APPROACH');
  scene.add(label('CHILLER-2 · 300 TR',.7).translateX(.4).translateY(1.95).translateZ(-1.8));
  /* pipa header */
  const pipa1=cyl(.14,.14,9,0x2a6a9a);pipa1.rotation.z=Math.PI/2;pipa1.position.set(-1.5,2.4,-2.3);scene.add(pipa1);
  const pipa2=cyl(.14,.14,9,0x9a4a2a);pipa2.rotation.z=Math.PI/2;pipa2.position.set(-1.5,2.7,-2.3);scene.add(pipa2);
  /* panel meter chiller */
  mch.D=makeDisplay(2.2,1.3,440,260);
  mch.D.mesh.position.set(4.2,2.2,-2.6);scene.add(mch.D.mesh);
  actMesh(mch.D.mesh,'KWTR');
  scene.add(label('PANEL KINERJA PLANT',.7,'#5fd4ff').translateX(4.2).translateY(3.0).translateZ(-2.6));
  function panel(mode){
    const g=mch.D.g,W=440,H=260;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='700 18px Consolas';g.textAlign='left';
    if(mode===0){g.fillStyle='#ff5a5a';
      g.fillText('CH-1: 142 kW / 158 TR = 0,90 kW/TR',16,48);
      g.fillText('CH-2: 138 kW / 149 TR = 0,93 kW/TR',16,84);
      g.fillStyle='#8aa3bd';g.font='600 15px Consolas';
      g.fillText('desain: 0,62 kW/TR — boros 45%!',16,120);
      g.fillText('CHWS 5,5°C · dua unit @50% beban',16,150);}
    else{g.fillStyle='#46ff8e';
      g.fillText('CH-1: 168 kW / 262 TR = 0,64 kW/TR',16,48);
      g.fillStyle='#8aa3bd';g.font='600 15px Consolas';
      g.fillText('CH-2: STANDBY (sequencing)',16,84);
      g.fillText('CHWS 7,0°C · kondensor bersih',16,114);
      g.fillStyle='#46ff8e';g.font='700 17px Consolas';
      g.fillText('hemat ±Rp 38 jt/bulan ✓',16,160);}
    mch.D.tex.needsUpdate=true;}
  panel(0);
  /* setpoint controller */
  mch.set=box(.5,.4,.16,0x2b3a4a);mch.set.position.set(-5.8,1.8,-2.4);scene.add(mch.set);
  actMesh(mch.set,'SETP');
  scene.add(label('CHW SETPOINT',.55,'#5fd4ff').translateX(-5.8).translateY(2.3).translateZ(-2.4));
  /* sikat kondensor */
  mch.sikat=cyl(.04,.04,1.4,0x2a72c8);mch.sikat.rotation.z=.6;
  mch.sikat.position.set(2.6,1.0,.4);scene.add(mch.sikat);
  actMesh(mch.sikat,'BERSIH');
  scene.add(label('TUBE CLEANING KIT',.55,'#5fd4ff').translateX(2.9).translateY(1.5).translateZ(.4));
  startSeq([
   {type:'act',aid:'KWTR',done:false,targets:()=>[mch.D.mesh],
    desc:'Baca angka sakti: kW/TR kedua chiller (klik panel).',
    why:'CH-1: 0,90 · CH-2: 0,93 — desainnya 0,62. Mall membayar 45% lebih untuk tiap ton dingin. Dan satu kejanggalan mencolok: DUA chiller masing-masing jalan 50% — seperti dua sopir menyetir satu mobil.',
    fx(){toast('📏 0,90-0,93 kW/TR (desain 0,62) — boros 45%!','bad',3000);}},
   {type:'act',aid:'APPROACH',done:false,targets:()=>[mch.ch2],
    desc:'Stetoskop heat exchanger: cek APPROACH kondensor (klik CH-2).',
    why:'Approach kondensor terukur 6,8°C — komisioning dulu 1,5°C. Diagnosa: tube kondensor berkerak (air cooling tower tanpa treatment baik). Kompresor terpaksa memompa ke tekanan lebih tinggi — kerja ekstra yang dibayar tagihan tiap jam.',
    fx(){toast('🩺 Approach 6,8°C (normal 1,5) — kondensor BERKERAK.','bad',2800);}},
   {type:'act',aid:'BERSIH',done:false,targets:()=>[mch.sikat],
    desc:'Koreksi #1: TUBE CLEANING kondensor (klik kit).',
    why:'Brushing + chemical cleaning terjadwal malam (mall tutup). Pagi harinya approach kembali 1,9°C — tekanan kondensasi turun, kompresor bernafas lega. Satu malam menyikat = poin efisiensi yang kembali setiap jam operasional.',
    fx(){toast('🧹 Approach 6,8 → 1,9°C — kompresor lega.','ok',2800);}},
   {type:'act',aid:'SETP',done:false,targets:()=>[mch.set],
    desc:'Koreksi #2: naikkan CHILLED WATER SETPOINT 5,5 → 7°C.',
    why:'Air 5,5°C itu warisan setting "biar pasti dingin" — padahal ruangan mall nyaman dengan air 7°C. Tiap derajat lebih hangat ≈ 2-3% hemat kompresor. Kenyamanan diverifikasi sensor ruangan: tetap 23-24°C. Tak ada pengunjung yang tahu; hanya tagihan yang berubah.',
    fx(){toast('🌡️ Setpoint 7°C — ruangan tetap nyaman, kompresor hemat 4%.','ok',2800);}},
   {type:'act',aid:'SEQ',done:false,targets:()=>[mch.D.mesh],
    desc:'Koreksi #3: terapkan SEQUENCING — satu chiller penuh, satu standby.',
    why:'Beban aktual 260 TR cukup dilayani SATU chiller di 87% (zona efisiensi terbaiknya) daripada dua unit terengah di 50%. CH-2 jadi standby bergilir mingguan. Hasil akhir terbaca di panel: 0,64 kW/TR — dan Rp 38 juta sebulan pulang ke kas mall.',
    fx(){panel(1);toast('🔁 Sequencing aktif: 0,64 kW/TR — hemat Rp 38 jt/bln!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Plant pendingin kembali ke khitahnya!</b> Kondensor bersih, setpoint masuk akal, satu chiller bekerja di zona terbaiknya. kW/TR 0,90 → 0,64 — dan tak satu pun pengunjung merasa lebih gerah.');
    setTimeout(()=>showWin('chiller'),2200);});
  const s0=seq.steps[0],of0=s0.fx;s0.fx=()=>{of0();mch.D.mesh.userData.aid='SEQ';};
  say('VOLTA di sini ❄️ Klien baru: mall yang 60% tagihannya dimakan pendingin. Satu angka akan membuka semuanya: <b>kW/TR</b> — listrik per ton dingin. Turun ke basement, kita timbang chiller-nya.');
  $('#modTitle').textContent='J06·M5 — Audit Chiller';
  $('#taskHead').textContent='kW/TR: SATU ANGKA SEJUTA MAKNA';}
MISSIONS.chiller.build=buildChiller;
Object.assign(REAL,{
 chiller:[
  'Pengukuran TR butuh flow meter & sensor suhu terkalibrasi di chilled water — jangan percaya display unit saja',
  'Bandingkan dengan kurva kinerja pabrikan pada kondisi ECWT yang sama — apel dengan apel',
  'Program water treatment cooling tower adalah pengawal approach — audit kimianya juga',
  'Pasang sub-meter listrik per chiller permanen: kW/TR harian jadi KPI operator, bukan temuan auditor'],
});

/* =====================================================================
   MISI 6 — M&V: MEMBUKTIKAN PENGHEMATAN (IPMVP)
   ===================================================================== */
Object.assign(MISSIONS,{
 mnv:{lvl:'JALUR 06 · ENERGY AUDITOR · MISI 6',icon:'⚖️',title:'M&V: Membuktikan Penghematan',strict:false,
  loc:'📍 PT Maju Plastik · Setahun pasca-proyek efisiensi',
  story:'Semua rekomendasimu telah dieksekusi — VFD, tarif, boiler, chiller. Tagihan turun... tapi direktur keuangan menatap angka dengan curiga: "Produksi kami juga berubah. Cuaca beda. DARI MANA kalian tahu ini hasil proyek, bukan kebetulan?" Pertanyaan yang adil — dan jawabannya adalah disiplin bernama M&V: measurement & verification.',
  goal:'Penghematan terbukti secara metodologis: baseline ternormalisasi terbangun, penyesuaian sah diterapkan, dan laporan M&V meyakinkan direktur keuangan yang paling skeptis.',
  obj:['Bangun model baseline dari data pra-proyek','Normalisasi terhadap produksi & variabel cuaca','Hitung penghematan terverifikasi & laporkan'],
  learn:['Penghematan tidak bisa DIUKUR langsung — ia selisih antara konsumsi nyata dan dunia paralel "seandainya proyek tak ada": baseline yang dinormalisasi','Baseline = model regresi pra-proyek (kWh vs produksi, suhu): konsumsi diprediksi pada kondisi SEKARANG memakai perilaku DULU','Penyesuaian itu sah dan wajib: produksi naik bukan kegagalan hemat — model menghitung berapa seharusnya kWh pada produksi itu','Tanpa M&V, proyek efisiensi selamanya dianggap kebetulan — dengan M&V, ia baris yang bisa diaudit di laporan keuangan'],
  next:['Pelajari opsi IPMVP A/B/C/D & kapan masing-masing dipakai','Dalami uji statistik model baseline (R², CV-RMSE)','Eksplorasi kontrak ESCO: pembayaran dari penghematan terverifikasi']},
});
let mmv={};
function buildMnV(){
  freshScene(0xb8c6d4,0x141d28);
  cam={theta:0,phi:1.17,r:7.5,target:new THREE.Vector3(0,1.9,-1)};
  const floor=boxT(16,.1,10,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  const wall=boxT(14,4.4,.2,TEX.plaster());wall.position.set(0,2.2,-3.2);scene.add(wall);
  /* layar baseline */
  const frame=boxT(4.8,2.6,.16,TEX.metal(),{metalness:.4});frame.position.set(-1.6,2.4,-3.1);scene.add(frame);
  frame.add(label('M&V — BASELINE vs AKTUAL',.85).translateY(1.6));
  mmv.D=makeDisplay(4.5,2.3,600,330);
  mmv.D.mesh.position.set(-1.6,2.4,-3.0);scene.add(mmv.D.mesh);
  actMesh(mmv.D.mesh,'BASE');
  function grafik(mode){
    const g=mmv.D.g,W=600,H=330;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.strokeStyle='#2a3a4c';g.lineWidth=2;
    g.beginPath();g.moveTo(46,16);g.lineTo(46,H-40);g.lineTo(W-12,H-40);g.stroke();
    g.font='600 14px Consolas';g.textAlign='left';
    /* titik scatter baseline */
    g.fillStyle='#5fd4ff';
    [[20,.42],[35,.55],[48,.66],[60,.76],[75,.9],[42,.6],[55,.71],[68,.82]].forEach(p=>{
      g.fillRect(46+p[0]*6-3,H-40-p[1]*(H-90)-3,6,6);});
    if(mode>=1){g.strokeStyle='#5fd4ff';g.lineWidth=2;g.setLineDash([2,4]);
      g.beginPath();g.moveTo(46+15*6,H-40-.36*(H-90));g.lineTo(46+80*6,H-40-.95*(H-90));
      g.stroke();g.setLineDash([]);
      g.fillStyle='#5fd4ff';g.fillText('BASELINE: kWh = 41.000 + 9,2/ton (R² 0,93)',54,30);}
    if(mode>=2){g.fillStyle='#46ff8e';
      [[58,.58],[66,.65],[74,.72],[80,.77]].forEach(p=>{
        g.beginPath();g.arc(46+p[0]*6,H-40-p[1]*(H-90),5,0,7);g.fill();});
      g.fillText('AKTUAL pasca-proyek (produksi LEBIH TINGGI)',54,54);
      g.fillStyle='#ffd23f';g.font='700 16px Consolas';
      g.fillText('celah vertikal = PENGHEMATAN ternormalisasi',54,82);}
    g.fillStyle='#8aa3bd';g.font='600 13px Consolas';g.textAlign='center';
    g.fillText('produksi (ton/bulan) →',W/2,H-14);
    mmv.D.tex.needsUpdate=true;}
  grafik(0);
  /* kartu penyesuaian + laporan + direktur */
  mmv.adj=box(.95,.6,.07,0x8a5a2a);mmv.adj.position.set(2.4,2.9,-3.05);scene.add(mmv.adj);
  actMesh(mmv.adj,'NORMAL');
  scene.add(label('NORMALISASI',.55,'#e8c890').translateX(2.4).translateY(3.4).translateZ(-3.0));
  mmv.rep=box(.6,.7,.05,0xe8e4d8);mmv.rep.position.set(2.4,1.7,-3.07);scene.add(mmv.rep);
  actMesh(mmv.rep,'LAPOR');
  scene.add(label('LAPORAN M&V',.55,'#5fd4ff').translateX(2.4).translateY(2.25).translateZ(-3.0));
  mmv.dir=new THREE.Group();
  const badan=cyl(.22,.28,.9,0x2a3a55);badan.position.y=.72;mmv.dir.add(badan);
  const kepala=new THREE.Mesh(new THREE.SphereGeometry(.16,14,12),
    new THREE.MeshStandardMaterial({color:0xd8b090}));kepala.position.y=1.38;mmv.dir.add(kepala);
  mmv.dir.position.set(4.8,0,-1.4);scene.add(mmv.dir);
  actMesh(badan,'SKEPTIS');
  scene.add(label('DIREKTUR KEUANGAN (skeptis)',.6).translateX(4.8).translateY(1.9).translateZ(-1.4));
  startSeq([
   {type:'act',aid:'BASE',done:false,targets:()=>[mmv.D.mesh],
    desc:'Bangun MODEL BASELINE dari 12 bulan pra-proyek (klik layar).',
    why:'Data lama (logger-mu dulu!) di-regresi: kWh = 41.000 + 9,2 × ton produksi, R² 0,93 — perilaku energi pabrik LAMA kini terawetkan dalam rumus. Inilah mesin dunia-paralel: berapa pabrik versi lama akan mengonsumsi, pada kondisi apa pun.',
    fx(){grafik(1);toast('📐 Baseline: 41.000 + 9,2/ton · R² 0,93 — sah.','ok',3000);}},
   {type:'act',aid:'NORMAL',done:false,targets:()=>[mmv.adj],
    desc:'NORMALISASI: produksi naik 18% — hitung yang seharusnya (klik kartu).',
    why:'Tanpa normalisasi, kenaikan produksi MENYEMBUNYIKAN penghematan: kWh aktual hanya turun 4%. Tapi masukkan produksi sekarang ke rumus baseline: pabrik LAMA akan butuh 612 MWh — aktualnya 514 MWh. Apel dibandingkan dengan apel di keranjang yang sama.',
    fx(){grafik(2);toast('⚖️ Baseline @produksi kini: 612 MWh vs aktual 514 MWh.','ok',3000);}},
   {type:'act',aid:'HEMAT',done:false,targets:()=>[mmv.D.mesh],
    desc:'Baca celahnya: berapa PENGHEMATAN terverifikasi?',
    why:'612 − 514 = 98 MWh/bulan = 16% ternormalisasi ≈ Rp 137 juta/bulan — pada produksi yang justru LEBIH TINGGI. Titik hijau menggantung di bawah garis biru: tiap milimeter celah itu adalah uang yang dulu menguap dan kini tidak.',
    fx(){toast('💰 Terverifikasi: 16% = Rp 137 jt/bln, di produksi +18%.','ok',3200);}},
   {type:'act',aid:'LAPOR',done:false,targets:()=>[mmv.rep],
    desc:'Susun LAPORAN M&V lengkap dengan batas ketidakpastian (klik laporan).',
    why:'Metodologi (opsi whole-facility), model & statistiknya, penyesuaian yang diambil, dan kejujuran terakhir: penghematan 16% ± 2,1% pada keyakinan 90%. Rentang ketidakpastian bukan kelemahan — ia tanda tangan seorang profesional yang tahu batas datanya.',
    fx(){toast('📋 Laporan M&V: 16% ±2,1% @90% — siap diaudit siapa pun.','ok',3000);}},
   {type:'act',aid:'SKEPTIS',done:false,targets:()=>[mmv.dir.children[0]],
    desc:'Hadapi sang skeptis: presentasikan ke DIREKTUR KEUANGAN (klik beliau).',
    why:'Beliau menguji: "kalau produksi turun tahun depan?" — model menjawab. "Kalau cuaca?" — variabel suhu sudah di dalam. Hening... lalu: "Baik. Masukkan penghematan ini ke laporan keuangan, dan audit energi jadi program tahunan." Skeptis yang terjawab adalah sekutu terkuat.',
    fx(){toast('🤝 Direktur keuangan MENERIMA — efisiensi resmi masuk pembukuan!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Penghematan yang tahan digugat!</b> Baseline mengawetkan masa lalu, normalisasi mengadilkan perbandingan, dan ketidakpastian diakui dengan kepala tegak. M&V: bedanya "kayaknya hemat" dengan "terbukti hemat".');
    setTimeout(()=>showWin('mnv'),2200);});
  const s1m=seq.steps[1],of1m=s1m.fx;s1m.fx=()=>{of1m();mmv.D.mesh.userData.aid='HEMAT';};
  say('VOLTA di sini ⚖️ Pertanyaan paling adil dari direktur keuangan: <b>"dari mana kalian tahu ini hasil proyek, bukan kebetulan?"</b> Jawabannya disiplin bernama M&V. Bangun dunia-paralelnya: baseline.');
  $('#modTitle').textContent='J06·M6 — M&V Penghematan';
  $('#taskHead').textContent='BUKTIKAN, JANGAN KLAIM';}
MISSIONS.mnv.build=buildMnV;
Object.assign(REAL,{
 mnv:[
  'Rencana M&V disepakati SEBELUM proyek dimulai — baseline tak bisa dibangun mundur dengan jujur',
  'Uji kualitas model: R² > 0,75 & CV-RMSE dalam batas — model lemah = klaim lemah',
  'Catat penyesuaian non-rutin (mesin baru, shift berubah) dengan bukti — bukan dikira-kira',
  'Untuk kontrak ESCO: pihak ketiga independen melakukan M&V — pembayar dan penghitung dipisah'],
});

/* =====================================================================
   MISI 7 — ISO 50001: MEMBANGUN SISTEM MANAJEMEN ENERGI
   ===================================================================== */
Object.assign(MISSIONS,{
 iso:{lvl:'JALUR 06 · ENERGY AUDITOR · MISI 7',icon:'🏛️',title:'ISO 50001: Membangun Sistem Manajemen Energi',strict:false,
  loc:'📍 PT Maju Plastik · Persiapan sertifikasi EnMS',
  story:'Semua kemenanganmu di pabrik ini — audit, logger, tarif, boiler, M&V — selama ini bertumpu pada SATU orang: kamu. Direktur sadar risikonya: "Kalau auditor kita pergi, apakah hematnya ikut pergi?" Jawabannya ISO 50001: mengubah keahlian perorangan menjadi SISTEM yang hidup sendiri — kebijakan, baseline, indikator, audit internal, dan siklus yang tak pernah berhenti.',
  goal:'EnMS berdiri & teruji: kebijakan energi terbit, EnPI & baseline terdefinisi, audit internal menemukan ketidaksesuaian yang ditindak, dan management review menutup siklus PDCA pertama.',
  obj:['Susun kebijakan, tim & significant energy uses','Tetapkan EnPI & baseline per area','Audit internal, tindak temuan, management review'],
  learn:['ISO 50001 memindahkan hemat energi dari pahlawan ke SISTEM: kebijakan, peran, prosedur — perusahaan tetap hemat walau pahlawannya pindah','SEU (significant energy uses) memfokuskan sistem: 4-6 pengguna terbesar dipantau ketat — bukan birokrasi merata untuk semua colokan','EnPI (indikator kinerja energi) harus ternormalisasi (kWh/ton, kW/TR) — ilmu M&V-mu kini jadi bahasa rutin manajemen','Audit internal mencari ketidaksesuaian SISTEM (prosedur tak dijalankan), bukan mencari orang salah — dan management review adalah jantung PDCA: pimpinan memutuskan, siklus berputar lagi'],
  next:['Pelajari proses sertifikasi & surveilans tahunan badan sertifikasi','Integrasi EnMS dengan ISO 9001/14001 (sistem terpadu)','Bangun karier lead auditor ISO 50001 tersertifikasi']},
});
let mio={};
function buildISO(){
  freshScene(0xb8c6d4,0x141d28);
  cam={theta:0,phi:1.17,r:7.5,target:new THREE.Vector3(0,1.8,-.8)};
  const Z=room(0x6b5a45,0xd8d2c4,16,11);
  /* papan kebijakan */
  mio.pol=box(.7,.9,.05,0xe8e4d8);mio.pol.position.set(-4.4,2.3,Z+.06);scene.add(mio.pol);
  actMesh(mio.pol,'POLICY');
  scene.add(label('KEBIJAKAN ENERGI',.6,'#5fd4ff').translateX(-4.4).translateY(3.0).translateZ(Z+.1));
  /* layar EnPI */
  const frame=boxT(3.6,2.2,.16,TEX.metal(),{metalness:.4});frame.position.set(-.8,2.4,Z+.05);scene.add(frame);
  frame.add(label('PAPAN EnPI PABRIK',.8).translateY(1.35));
  mio.D=makeDisplay(3.3,1.9,520,310);
  mio.D.mesh.position.set(-.8,2.4,Z+.15);scene.add(mio.D.mesh);
  actMesh(mio.D.mesh,'ENPI');
  function papan(mode){
    const g=mio.D.g,W=520,H=310;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='700 17px Consolas';g.textAlign='left';
    g.fillStyle='#5fd4ff';g.fillText('SEU & EnPI',16,30);
    g.font='600 15px Consolas';
    const rows=[['Extruder','kWh/ton','9,2 → target 8,8'],['Boiler','efisiensi','83,5% → ≥83%'],
      ['Chiller','kW/TR','0,64 → ≤0,68'],['Kompresor','kWh/m³','0,11 → ≤0,12']];
    rows.forEach((r,i)=>{const y=70+i*40;
      g.fillStyle='#8aa3bd';g.fillText(r[0],16,y);
      g.fillStyle='#eaf2fb';g.fillText(r[1],160,y);
      g.fillStyle='#46ff8e';g.fillText(r[2],280,y);});
    if(mode>=1){g.fillStyle='#ffd23f';g.font='700 15px Consolas';
      g.fillText('semua ternormalisasi & ber-baseline (ilmu M&V)',16,H-18);}
    mio.D.tex.needsUpdate=true;}
  papan(0);
  /* meja audit internal */
  mio.audit=box(.55,.7,.05,0xffe8c0);mio.audit.position.set(2.4,2.3,Z+.06);scene.add(mio.audit);
  actMesh(mio.audit,'AUDIT');
  scene.add(label('AUDIT INTERNAL',.55,'#ffd23f').translateX(2.4).translateY(2.9).translateZ(Z+.1));
  /* ruang management review */
  const desk=boxT(2.8,.08,1.3,TEX.wood());desk.position.set(3.6,1.0,-.4);scene.add(desk);
  [[-1.2,-1.0],[1.2,-1.0],[-1.2,.1],[1.2,.1]].forEach(p=>{
    const l=boxT(.08,1,.08,TEX.wood());l.position.set(3.6+p[0],.5,p[1]-.4+.4);scene.add(l);});
  mio.mr=box(.5,.66,.04,0xd8e8d8);mio.mr.position.set(3.6,1.06,-.4);mio.mr.rotation.x=-Math.PI/2;scene.add(mio.mr);
  actMesh(mio.mr,'REVIEW');
  scene.add(label('MANAGEMENT REVIEW',.6,'#8df0b8').translateX(3.6).translateY(1.5).translateZ(-.4));
  startSeq([
   {type:'act',aid:'POLICY',done:false,targets:()=>[mio.pol],
    desc:'Susun fondasi: KEBIJAKAN energi, tim, & tetapkan SEU (klik papan).',
    why:'Kebijakan ditandatangani direktur (komitmen pimpinan = pasal pertama ISO), tim energi lintas-departemen dibentuk, dan dari data logger-mu SEU dipilih: extruder, boiler, chiller, kompresor = 81% konsumsi. Sistem yang fokus pada yang besar — bukan birokrasi untuk semua colokan.',
    fx(){toast('🏛️ Kebijakan terbit · tim terbentuk · 4 SEU terkunci (81%).','ok',3000);}},
   {type:'act',aid:'ENPI',done:false,targets:()=>[mio.D.mesh],
    desc:'Tetapkan EnPI & BASELINE tiap SEU (klik papan EnPI).',
    why:'Tiap SEU diberi indikator ternormalisasi: kWh/ton extruder, kW/TR chiller — plus baseline & target tahunan. Ilmu M&V-mu kini bukan proyek sesekali: ia metabolisme bulanan yang dibaca manajemen seperti laporan keuangan.',
    fx(){papan(1);toast('📐 4 EnPI ber-baseline & target — metabolisme terpasang.','ok',3000);}},
   {type:'act',aid:'AUDIT',done:false,targets:()=>[mio.audit],
    desc:'Jalankan AUDIT INTERNAL pertama — cari celah sistem (klik lembar).',
    why:'Auditor internal (yang kamu latih) menemukan dua ketidaksesuaian: log boiler tak diisi 2 minggu (prosedur ada, eksekusi bolong) & satu sensor EnPI belum terkalibrasi. Temuan = hadiah: sistem yang menemukan celahnya sendiri sebelum badan sertifikasi datang.',
    fx(){toast('🔎 2 temuan internal → tindakan korektif ber-tenggat.','ok',3000);}},
   {type:'act',aid:'REVIEW',done:false,targets:()=>[mio.mr],
    desc:'Tutup siklus: MANAGEMENT REVIEW dengan direksi (klik dokumen).',
    why:'Direksi membaca: EnPI tercapai 3 dari 4, temuan audit tertutup, dan memutuskan: anggaran metering line baru + target lebih ambisius tahun depan. PDCA berputar penuh — dan inilah jawabannya: bila kamu pergi besok, sistem ini tetap berdetak. Itulah warisan auditor sejati.',
    fx(){toast('🔄 PDCA siklus 1 tertutup — sistem hidup tanpa pahlawan. SIAP SERTIFIKASI!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Dari pahlawan menjadi sistem!</b> Kebijakan, SEU, EnPI, audit internal, management review — hemat energi kini DNA perusahaan, bukan jasa perorangan. ISO 50001: cara pensiun yang anggun bagi seorang auditor.');
    setTimeout(()=>showWin('iso'),2200);});
  say('VOLTA di sini 🏛️ Pertanyaan direktur menohok: <b>"kalau kamu pergi, hematnya ikut pergi?"</b> Jawabannya ISO 50001 — mengubah keahlianmu menjadi sistem yang berdetak sendiri. Bangun dari kebijakan!');
  $('#modTitle').textContent='J06·M7 — ISO 50001 EnMS';
  $('#taskHead').textContent='SISTEM, BUKAN PAHLAWAN';}
MISSIONS.iso.build=buildISO;
Object.assign(REAL,{
 iso:[
  'Komitmen pimpinan adalah pasal hidup-mati EnMS — tanpa direksi, ISO 50001 hanya map di lemari',
  'Mulai dari SEU & data yang sudah ada — sistem yang terlalu ambisius di awal mati oleh beratnya sendiri',
  'Auditor internal dilatih & independen dari area yang diauditnya',
  'Siapkan bukti objektif (log, kalibrasi, notulen) — sertifikasi menilai jejak, bukan niat'],
});

/* =====================================================================
   MISI 8 — AUDIT DATA CENTER: MEMBURU PUE
   ===================================================================== */
Object.assign(MISSIONS,{
 pue:{lvl:'JALUR 06 · ENERGY AUDITOR · MISI 8',icon:'🖥️',title:'Audit Data Center: Memburu PUE',strict:false,
  loc:'📍 DC perusahaan daerah · 120 rak, tagihan menggila',
  story:'Klien era baru: data center 120 rak yang tagihannya menyalip pabrik. Dunia ini punya metrik kebangsawanannya sendiri: PUE — power usage effectiveness: total listrik gedung dibagi listrik yang BENAR-BENAR sampai ke server. PUE 2,0 artinya tiap watt komputasi dikawal satu watt "pengawal" (pendingin, UPS, lampu). Auditor terbaik dunia menurunkannya mendekati 1: hari ini giliranmu berburu.',
  goal:'PUE terukur benar, tiga pemboros khas DC terbongkar (aliran udara, suhu setpoint, UPS), dan PUE turun terverifikasi tanpa satu server pun overheat.',
  obj:['Ukur PUE aktual dengan batas pengukuran yang benar','Bongkar aliran udara: hot/cold aisle & kebocoran','Naikkan setpoint sesuai standar & optimasi UPS'],
  learn:['PUE = total fasilitas ÷ daya IT: 2,1 = boros, 1,5 = rata-rata, <1,3 = kelas dunia — satu angka yang merangkum seluruh "pengawal"','Musuh #1 DC tropis: udara dingin & panas yang BERCAMPUR — server menghisap udara panas tetangganya, pendingin bekerja dua kali untuk hasil setengah','Standar termal modern (ASHRAE) mengizinkan suhu masuk server sampai 27°C — DC yang membeku di 18°C membakar uang demi kekhawatiran era 1990','UPS punya kurva efisiensi: beban 20% bisa hanya 85% efisien — konsolidasi & mode eco mengembalikan persen-persen yang diam-diam hilang'],
  next:['Pelajari containment penuh & economizer untuk iklim tropis','Dalami WUE & metrik air — pendingin juga minum','Eksplorasi liquid cooling: era chip yang tak bisa lagi didinginkan udara']},
});
let mpe={};
function buildPUE(){
  freshScene(0x9fb6c8,0x0f1820);
  cam={theta:.05,phi:1.16,r:8.5,target:new THREE.Vector3(0,1.6,-.8)};
  const Z=room(0x39424c,0xc4cdd6,16,11);
  /* deretan rak server */
  mpe.raks=[];
  for(let i=0;i<4;i++){
    const r=box(.8,2.0,1.0,0x18242f);r.position.set(-4.4+i*1.3,1.05,-1.8);scene.add(r);
    for(let j=0;j<6;j++){const led=box(.7,.04,.02,0x2a72c8,{emissive:0x2a72c8,emissiveIntensity:.6});
      led.position.set(-4.4+i*1.3,.4+j*.3,-1.28);scene.add(led);}
    mpe.raks.push(r);}
  scene.add(label('120 RAK (4 tampak) — lorong campur aduk',.75).translateX(-3).translateY(2.6).translateZ(-1.8));
  actMesh(mpe.raks[1],'AISLE');
  /* CRAC unit */
  mpe.crac=boxT(1.2,2.0,.8,TEX.metal(),{metalness:.35});mpe.crac.position.set(-.4,1.05,-2.2);scene.add(mpe.crac);
  actMesh(mpe.crac,'SUHU');
  scene.add(label('CRAC — setpoint 18°C ❄',.65,'#9cc4ff').translateX(-.4).translateY(2.4).translateZ(-2.2));
  /* UPS room */
  mpe.ups=boxT(1.4,1.6,.9,TEX.metal(),{metalness:.35});mpe.ups.position.set(2.2,.85,-2.2);scene.add(mpe.ups);
  actMesh(mpe.ups,'UPS');
  scene.add(label('2x UPS 300 kVA',.65).translateX(2.2).translateY(2.0).translateZ(-2.2));
  /* layar PUE */
  mpe.D=makeDisplay(2.2,1.3,440,260);
  mpe.D.mesh.position.set(5.0,2.3,-2.2);scene.add(mpe.D.mesh);
  actMesh(mpe.D.mesh,'UKUR');
  scene.add(label('METER PUE',.75,'#5fd4ff').translateX(5.0).translateY(3.1).translateZ(-2.2));
  function layar(p,note,col){
    dispText(mpe.D,['PUE '+p,note||''],[col||'#ff5a5a','#8aa3bd']);}
  layar('?','belum terukur','#7d8f84');
  startSeq([
   {type:'act',aid:'UKUR',done:false,targets:()=>[mpe.D.mesh],
    desc:'Ukur PUE dengan batas yang benar: total vs daya IT (klik meter).',
    why:'Meter utama: 740 kW masuk gedung; meter PDU (yang benar-benar dimakan server): 352 kW → PUE 2,10 — tiap watt komputasi mengongkosi 1,1 watt pengawal. Batas ukur menentukan kejujuran angka: PUE yang "bagus" karena salah meter adalah kebohongan yang menjalar ke semua keputusan.',
    fx(){layar('2,10','740 kW total · 352 kW IT');
      toast('📏 PUE 2,10 — separuh tagihan untuk para pengawal.','bad',3000);}},
   {type:'act',aid:'AISLE',done:false,targets:()=>[mpe.raks[1]],
    desc:'Bongkar pemborosan #1: ALIRAN UDARA lorong (klik rak).',
    why:'Termal kamera & asap uji bercerita: rak menghadap arah campur aduk — buangan panas rak A langsung dihisap rak B (resirkulasi 31%!), slot kosong tanpa blanking panel jadi jalan pintas udara. Solusi murah meriah: susun hot/cold aisle, pasang 240 blanking panel, tutup celah kabel. Udara diatur seperti lalu lintas — bukan dibiarkan berkerumun.',
    fx(){toast('🌬️ Hot/cold aisle + blanking → resirkulasi 31%→6%.','ok',3200);}},
   {type:'act',aid:'SUHU',done:false,targets:()=>[mpe.crac],
    desc:'Pemborosan #2: setpoint 18°C era 1990 — naikkan dengan ilmu (klik CRAC).',
    why:'Standar termal modern: server sehat dengan udara masuk sampai 27°C. Dengan aliran udara yang kini rapi, setpoint dinaikkan bertahap 18→24°C sambil memantau suhu masuk tiap rak: semua hijau. Tiap derajat ≈ 3-4% hemat pendingin — DC yang membeku ternyata hanya membakar uang demi kekhawatiran kuno.',
    fx(){toast('🌡️ 18→24°C bertahap — semua inlet rak aman <27°C ✓','ok',3200);}},
   {type:'act',aid:'UPS',done:false,targets:()=>[mpe.ups],
    desc:'Pemborosan #3: dua UPS setengah menganggur (klik UPS).',
    why:'Dua UPS 300 kVA masing-masing berbeban 25% — zona terburuk kurva efisiensinya (86%). Konsolidasi ke konfigurasi yang tetap redundan namun berbeban sehat + mode eco tervalidasi: efisiensi naik ke 95%. Sembilan persen dari ratusan kW, 24 jam, 365 hari — para pengawal kini ikut berhemat.',
    fx(){toast('🔋 UPS 86→95% efisien — redundansi tetap utuh.','ok',3000);}},
   {type:'act',aid:'VERIF',done:false,targets:()=>[mpe.D.mesh],
    desc:'Sebulan kemudian: VERIFIKASI PUE baru (klik meter).',
    why:'PUE 2,10 → 1,58: dari 740 kW menjadi 556 kW untuk daya IT yang sama — hemat ±Rp 2,4 miliar setahun, tanpa satu server pun melambat atau memanas. Dan ilmu M&V-mu memastikan klaim ini tahan audit. DC ini belum kelas dunia — tapi sudah berhenti jadi kelas boros.',
    fx(){layar('1,58','556 kW · −Rp 2,4 M/thn ✓','#46ff8e');
      toast('🏆 PUE 2,10 → 1,58 — Rp 2,4 M/thn pulang!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Para pengawal berhasil dirampingkan!</b> Udara diatur seperti lalu lintas, suhu dinaikkan dengan ilmu, UPS keluar dari zona malasnya. PUE 1,58 — dan server-server itu bahkan tak menyadari ada yang berubah.');
    setTimeout(()=>showWin('pue'),2200);});
  const s0e=seq.steps[0],of0e=s0e.fx;s0e.fx=()=>{of0e();mpe.D.mesh.userData.aid='VERIF';};
  say('VOLTA di sini 🖥️ Klien zaman baru: <b>data center yang tagihannya menyalip pabrik</b>. Metrik buruannya: PUE — berapa watt pengawal per watt komputasi. Tiga pemboros klasik menunggu. Ukur dulu!');
  $('#modTitle').textContent='J06·M8 — Audit Data Center';
  $('#taskHead').textContent='BURU PUE MENDEKATI 1';}
MISSIONS.pue.build=buildPUE;
Object.assign(REAL,{
 pue:[
  'Sepakati batas pengukuran PUE tertulis (kategori pengukuran) — perbandingan antar waktu wajib apel-ke-apel',
  'Perubahan suhu/airflow dilakukan bertahap dgn pemantauan inlet per rak — uptime adalah KPI #1 klien DC',
  'Validasi mode eco UPS terhadap kebutuhan ride-through beban IT kritis sebelum diaktifkan',
  'PUE dipantau kontinu bulanan (musiman!) — angka sekali ukur menipu di iklim tropis'],
});
