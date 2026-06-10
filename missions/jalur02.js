/* =====================================================================
   ElectraSim VR 3D — INDUSTRI & MANUFAKTUR
   Misi: M1 star (Komisioning Star-Delta Starter) · M2 trip (Troubleshooting Motor Trip)
   Dimuat on-demand oleh index.html lewat ensureMission().
   ===================================================================== */

Object.assign(MISSIONS,{
 star:{lvl:'JALUR 02 · INDUSTRI & MANUFAKTUR',icon:'🏭',title:'Komisioning Star-Delta Starter',strict:false,
  loc:'📍 Pabrik tekstil · Motor blower 22 kW',
  story:'Motor blower 22 kW terlalu besar untuk DOL — arus startnya bisa 7× nominal dan membuat tegangan pabrik anjlok. Solusinya starter star-delta: motor start di hubungan bintang (arus ⅓), lalu otomatis pindah ke delta. Kamu yang mengkomisioning panelnya hari ini.',
  goal:'Motor start mulus di STAR, transisi ke DELTA tepat waktu, dan arus nominal terverifikasi.',
  obj:['Periksa setting timer & kondisi lilitan motor','Start di STAR — amati arus start yang jinak','Eksekusi transisi ke DELTA pada momen yang tepat'],
  learn:['Hubungan bintang memberi tegangan kumparan 1/√3 → arus start hanya ⅓ DOL','Timer star-delta umum diset 5–8 detik (sampai motor mendekati kecepatan nominal)','Transisi terlalu cepat = lonjakan arus; terlalu lama = motor terbebani di star','Motor harus delta-rated pada tegangan jaringan (lihat nameplate: Δ380V)'],
  next:['Pelajari soft starter & VFD — penerus star-delta','Dalami penyebab trip: unbalance, bearing, beban macet','Masuk ke predictive maintenance dengan sensor getaran']},
 trip:{lvl:'JALUR 02 · INDUSTRI & MANUFAKTUR · MISI 2',icon:'🔧',title:'Troubleshooting Motor Trip',strict:false,
  loc:'📍 Pabrik tekstil · Blower line 2 berhenti, 07:40',
  story:'Produksi berhenti: TOR motor blower trip. Supervisor menunggu, tiap menit berhenti = kerugian. Tapi teknisi andal tidak langsung menekan RESET — ia mencari tahu dulu KENAPA trip terjadi, karena overload selalu punya alasan.',
  goal:'Akar masalah ditemukan & diperbaiki, TOR di-reset dengan sah, motor kembali berputar dengan arus seimbang.',
  obj:['Konfirmasi penyebab trip di TOR & periksa fisik motor','Temukan & perbaiki terminal kendor, verifikasi isolasi','Reset, restart, dan buktikan arus 3 fasa seimbang'],
  learn:['TOR trip = gejala; akarnya bisa terminal kendor, unbalance, beban macet, atau bearing aus','Terminal kendor → resistansi kontak naik → panas → arus tak seimbang → trip berulang','Reset tanpa investigasi = mengundang trip berikutnya (atau kebakaran panel)','Selisih arus antar fasa >5% pada motor 3 fasa wajib diinvestigasi'],
  next:['Pelajari pengukuran vibrasi untuk deteksi bearing','Dalami thermography panel: melihat panas sebelum jadi gangguan','Susun program preventive maintenance panel motor']},
});

/* =====================================================================
   MISI 9 — STAR-DELTA (Jalur 02)
   ===================================================================== */
let mst={};
function buildStar(){
  freshScene(0xb0bfcc,0x131c26);
  cam={theta:-.1,phi:1.2,r:7,target:new THREE.Vector3(.4,1.7,-1)};
  const Z=room(0x55606a,0xb9bfc6);
  const panel=box(3.2,2.5,.25,0x9aa5b0);panel.position.set(-1.0,2.0,Z-.04);scene.add(panel);
  panel.add(label('PANEL STAR-DELTA 22kW',.9).translateY(1.55));
  /* timer */
  mst.timerBox=box(.4,.4,.16,0x33404e);mst.timerBox.position.set(-2.2,2.6,Z+.12);scene.add(mst.timerBox);
  actMesh(mst.timerBox,'TIMER');
  scene.add(label('TIMER',.5,'#5fd4ff').translateX(-2.2).translateY(2.95).translateZ(Z+.1));
  /* kontaktor K-main, K-star, K-delta */
  mst.kM=box(.42,.52,.18,0x2b3a4a);mst.kM.position.set(-1.4,2.6,Z+.12);scene.add(mst.kM);
  scene.add(label('K-UTAMA',.45).translateX(-1.4).translateY(2.95).translateZ(Z+.1));
  mst.kY=box(.42,.52,.18,0x2b3a4a);mst.kY.position.set(-.8,2.6,Z+.12);scene.add(mst.kY);
  scene.add(label('K-STAR',.45).translateX(-.8).translateY(2.95).translateZ(Z+.1));
  mst.kD=box(.42,.52,.18,0x2b3a4a);mst.kD.position.set(-.2,2.6,Z+.12);scene.add(mst.kD);
  actMesh(mst.kD,'TRANS');
  scene.add(label('K-DELTA',.45,'#5fd4ff').translateX(-.2).translateY(2.95).translateZ(Z+.1));
  /* display arus */
  mst.D=makeDisplay(1.1,.5,300,140);mst.D.mesh.position.set(.65,2.6,Z+.13);scene.add(mst.D.mesh);
  dispText(mst.D,['— A','STANDBY'],['#5fd4ff','#7d8f84']);
  /* tombol */
  mst.btnStart=cyl(.09,.09,.08,0x2ec06a);mst.btnStart.rotation.x=Math.PI/2;
  mst.btnStart.position.set(-1.7,1.35,Z+.18);scene.add(mst.btnStart);
  actMesh(mst.btnStart,'START');
  scene.add(label('START',.45,'#7af0a8').translateX(-1.7).translateY(1.1).translateZ(Z+.14));
  mst.btnStop=cyl(.09,.09,.08,0xd83a3a);mst.btnStop.rotation.x=Math.PI/2;
  mst.btnStop.position.set(-1.1,1.35,Z+.18);scene.add(mst.btnStop);
  actMesh(mst.btnStop,'STOP');
  scene.add(label('STOP',.45,'#ff9d9d').translateX(-1.1).translateY(1.1).translateZ(Z+.14));
  /* megger di meja */
  const tbl=box(.7,.06,.5,0x6b4f33);tbl.position.set(3.0,.9,-1.2);scene.add(tbl);
  const tleg=box(.07,.9,.07,0x4a3624);tleg.position.set(3.0,.45,-1.2);scene.add(tleg);
  mst.megger=box(.34,.2,.24,0xcc8830);mst.megger.position.set(3.0,1.02,-1.2);scene.add(mst.megger);
  actMesh(mst.megger,'MEGGER');
  scene.add(label('MEGGER',.55,'#5fd4ff').translateX(3.0).translateY(1.32).translateZ(-1.2));
  /* motor */
  const mb=cyl(.36,.36,1.0,0x3a6ea8);mb.rotation.z=Math.PI/2;mb.position.set(1.4,.6,.6);scene.add(mb);
  mst.fan=cyl(.32,.32,.06,0xd8e0e8,18,{metalness:.5});
  mst.fan.rotation.z=Math.PI/2;mst.fan.position.set(2.0,.6,.6);scene.add(mst.fan);
  const bl=box(.55,.05,.04,0x9fb0c0);mst.fan.add(bl);
  const bl2=bl.clone();bl2.rotation.x=Math.PI/2;mst.fan.add(bl2);
  scene.add(label('MOTOR 22 kW Δ380V',.7).translateX(1.6).translateY(1.2).translateZ(.6));

  mst.phase='off';mst.cnt=6;mst.spd=0;
  moduleTick=(dt)=>{
    if(mst.phase==='star'){mst.spd=Math.min(1,mst.spd+dt*.18);mst.cnt-=dt;
      const A=(80*mst.spd<35?80-mst.spd*120:38).toFixed(0);
      dispText(mst.D,[A+' A','STAR · t='+Math.max(0,mst.cnt).toFixed(1)+'s'],
        ['#ffd23f',mst.cnt<=0?'#46ff8e':'#7d8f84']);}
    if(mst.phase==='delta'){mst.spd=Math.min(1.4,mst.spd+dt*.3);
      dispText(mst.D,['41 A','DELTA · NOMINAL'],['#46ff8e','#46ff8e']);}
    if(mst.phase!=='off')mst.fan.rotation.x+=dt*12*mst.spd;};

  startSeq([
   {type:'act',aid:'TIMER',done:false,targets:()=>[mst.timerBox],
    desc:'Periksa setting TIMER star-delta (klik TIMER).',
    why:'Timer menentukan kapan pindah star→delta. Umumnya 5–8 detik: cukup bagi motor mendekati kecepatan nominal. Terlalu cepat = lonjakan arus, terlalu lama = motor merana di star.',
    fx(){toast('⏲️ Timer diset 6 detik ✓','ok',2200);}},
   {type:'act',aid:'MEGGER',done:false,targets:()=>[mst.megger],
    desc:'Megger lilitan motor sebelum start pertama (klik MEGGER).',
    why:'Motor habis overhaul/lama diam bisa lembap. Tahanan isolasi rendah + tegangan penuh = lilitan terbakar di hari pertama. Ukur dulu, selalu.',
    fx(){toast('🔍 Riso lilitan 250 MΩ — sehat ✓','ok',2200);}},
   {type:'act',aid:'START',done:false,targets:()=>[mst.btnStart],
    desc:'Tekan START — motor mengawali di hubungan STAR.',
    why:'Di star, tiap kumparan hanya menerima 220V (380/√3) → arus start cuma ⅓ dibanding DOL. Pabrik tidak berkedip, breaker tidak protes.',
    fx(){mst.phase='star';mst.cnt=6;
      mst.kM.material.color.setHex(0x2e5a8a);mst.kY.material.color.setHex(0x2e8a5a);
      beep(90,.7,'sawtooth',.07);
      toast('🔄 START di STAR — arus jinak, motor berakselerasi.','ok',2600);}},
   {type:'act',aid:'TRANS',done:false,targets:()=>[mst.kD],
    check:()=>mst.cnt<=0,
    checkFail:'Motor belum siap! Tunggu hitungan timer mencapai 0 (lihat display) baru transisi ke DELTA.',
    desc:'Saat timer habis (t=0 di display), klik K-DELTA untuk transisi!',
    why:'Pada kecepatan mendekati nominal, perpindahan ke delta hanya menimbulkan lonjakan kecil. Transisi prematur = motor masih lambat = lonjakan besar, persis yang ingin kita hindari.',
    fx(){mst.phase='delta';
      mst.kY.material.color.setHex(0x2b3a4a);mst.kD.material.color.setHex(0x2e5a8a);
      toast('⚡ TRANSISI KE DELTA — tegangan penuh, torsi penuh!','ok',2600);sfx.big();}},
   {type:'act',aid:'STOP',done:false,targets:()=>[mst.btnStop],
    desc:'Uji pengaman: tekan STOP.',
    why:'Komisioning ditutup dengan uji fungsi berhenti. Panel belum boleh diserahkan sebelum STOP terbukti bekerja.',
    fx(){mst.phase='off';mst.spd=0;
      mst.kM.material.color.setHex(0x2b3a4a);mst.kD.material.color.setHex(0x2b3a4a);
      dispText(mst.D,['0 A','BERHENTI ✓'],['#7d8f84','#46ff8e']);
      toast('⏹ Motor berhenti — komisioning selesai.','ok',2400);}},
  ],()=>{say('🎉 <b>Star-delta lulus komisioning!</b> Kamu baru menjinakkan arus start 7× menjadi sepertiganya — dengan timing yang tepat pula.');
    setTimeout(()=>showWin('star'),2000);});

  say('VOLTA di sini 🏭 Motor 22 kW terlalu garang untuk DOL. Hari ini kita pakai <b>star-delta</b>: start lembut di bintang, lalu pindah ke delta <b>tepat saat timer habis</b> — perhatikan display, timing-mu akan diuji!');
  $('#modTitle').textContent='J02 — Komisioning Star-Delta';
  $('#taskHead').textContent='STAR DULU, DELTA KEMUDIAN';}

/* =====================================================================
   MISI 22 — TROUBLESHOOTING MOTOR TRIP (Jalur 02 · Misi 2)
   ===================================================================== */
let mtp={};
function buildTrip(){
  freshScene(0xb0bfcc,0x131c26);
  cam={theta:-.1,phi:1.2,r:7,target:new THREE.Vector3(.4,1.6,-1)};
  const Z=room(0x55606a,0xb9bfc6);
  const panel=boxT(2.6,2.2,.25,TEX.metal(),{metalness:.35});panel.position.set(-1.6,1.9,Z-.04);scene.add(panel);
  panel.add(label('PANEL MOTOR BLOWER L2',.85).translateY(1.4));
  /* TOR dengan indikator trip + tombol reset */
  mtp.tor=box(.45,.5,.18,0xcc8830);mtp.tor.position.set(-2.3,2.3,Z+.12);scene.add(mtp.tor);
  actMesh(mtp.tor,'TORCHK');
  scene.add(label('TOR',.5,'#5fd4ff').translateX(-2.3).translateY(2.72).translateZ(Z+.1));
  mtp.trip=new THREE.Mesh(new THREE.SphereGeometry(.05,12,10),
    new THREE.MeshStandardMaterial({color:0xff3b3b,emissive:0xff3b3b,emissiveIntensity:1}));
  mtp.trip.position.set(-2.3,2.62,Z+.22);scene.add(mtp.trip);
  mtp.rst=cyl(.05,.05,.06,0x2255aa);mtp.rst.rotation.x=Math.PI/2;
  mtp.rst.position.set(-2.3,2.05,Z+.24);scene.add(mtp.rst);
  actMesh(mtp.rst,'RESET');
  scene.add(label('RESET',.36).translateX(-2.3).translateY(1.9).translateZ(Z+.2));
  /* tombol start + display arus */
  mtp.btn=cyl(.09,.09,.08,0x2ec06a);mtp.btn.rotation.x=Math.PI/2;
  mtp.btn.position.set(-1.5,1.35,Z+.18);scene.add(mtp.btn);
  actMesh(mtp.btn,'START');
  scene.add(label('START',.45,'#7af0a8').translateX(-1.5).translateY(1.1).translateZ(Z+.14));
  mtp.D=makeDisplay(1.1,.5,300,140);mtp.D.mesh.position.set(-.9,2.3,Z+.13);scene.add(mtp.D.mesh);
  dispText(mtp.D,['TRIP ⚠','overload 51 menit lalu'],['#ff5a5a','#7d8f84']);
  /* motor + terminal box */
  const mb=cyl(.34,.34,.95,0x3a6ea8);mb.rotation.z=Math.PI/2;mb.position.set(1.8,.6,-1.2);scene.add(mb);
  mtp.fan=cyl(.3,.3,.06,0xd8e0e8,18,{metalness:.5});
  mtp.fan.rotation.z=Math.PI/2;mtp.fan.position.set(2.38,.6,-1.2);scene.add(mtp.fan);
  const bl=box(.5,.05,.04,0x9fb0c0);mtp.fan.add(bl);
  const bl2=bl.clone();bl2.rotation.x=Math.PI/2;mtp.fan.add(bl2);
  scene.add(label('MOTOR BLOWER 7,5 kW',.7).translateX(1.8).translateY(1.25).translateZ(-1.2));
  mtp.tbox=box(.34,.26,.3,0x2b3a4a);mtp.tbox.position.set(1.5,1.0,-1.2);scene.add(mtp.tbox);
  actMesh(mtp.tbox,'TBOX');
  scene.add(label('TERMINAL BOX',.5,'#5fd4ff').translateX(1.4).translateY(.78).translateZ(-.9));
  /* meja alat: obeng, megger, tang ampere */
  const tbl=boxT(2.0,.07,.6,TEX.wood());tbl.position.set(4.0,.95,-.6);scene.add(tbl);
  const tleg=boxT(.08,.95,.08,TEX.wood());tleg.position.set(4.0,.47,-.6);scene.add(tleg);
  mtp.drv=box(.08,.34,.08,0xd83a3a);mtp.drv.rotation.z=.8;mtp.drv.position.set(3.3,1.06,-.6);scene.add(mtp.drv);
  actMesh(mtp.drv,'OBENG');
  scene.add(label('OBENG TORSI',.5,'#5fd4ff').translateX(3.3).translateY(1.32).translateZ(-.6));
  mtp.meg=box(.32,.2,.24,0xcc8830);mtp.meg.position.set(4.0,1.08,-.6);scene.add(mtp.meg);
  actMesh(mtp.meg,'MEGGER');
  scene.add(label('MEGGER',.5,'#5fd4ff').translateX(4.0).translateY(1.36).translateZ(-.6));
  mtp.amp=box(.18,.3,.1,0xd8b020);mtp.amp.position.set(4.7,1.1,-.6);scene.add(mtp.amp);
  actMesh(mtp.amp,'AMP');
  scene.add(label('TANG AMPERE',.5,'#5fd4ff').translateX(4.7).translateY(1.38).translateZ(-.6));

  mtp.run=false;
  moduleTick=(dt)=>{if(mtp.run)mtp.fan.rotation.x+=dt*12;};

  startSeq([
   {type:'act',aid:'TORCHK',done:false,targets:()=>[mtp.tor],
    desc:'JANGAN langsung reset! Periksa dulu TOR: apa yang membuatnya trip (klik TOR).',
    why:'TOR menyimpan cerita: indikator menunjuk trip kelas overload, bukan hubung singkat. Artinya arus berlebih MENAHUN, bukan ledakan sesaat — dan itu selalu punya akar masalah.',
    fx(){toast('🔎 TOR: trip overload, arus tercatat tinggi di fasa T.','info',2800);}},
   {type:'act',aid:'TBOX',done:false,targets:()=>[mtp.tbox],
    desc:'Telusuri ke motor: buka & periksa TERMINAL BOX (klik kotak terminal).',
    why:'Arus tinggi di satu fasa sering lahir di sambungan: terminal kendor menaikkan resistansi kontak → panas → isolasi memburuk. Mata & hidung teknisi: cari kehitaman dan bau hangus.',
    fx(){toast('🔥 Ditemukan: terminal fasa T kendor & menghitam!','bad',2800);}},
   {type:'act',aid:'OBENG',done:false,targets:()=>[mtp.drv],
    desc:'Perbaiki: bersihkan & kencangkan terminal dengan OBENG TORSI.',
    why:'Kontak dibersihkan dari oksidasi lalu dikencangkan dengan torsi sesuai spesifikasi — terlalu kendor panas lagi, terlalu kencang merusak ulir. Obeng torsi bukan gaya-gayaan.',
    fx(){toast('🔧 Terminal dibersihkan & dikencangkan 2,5 Nm ✓','ok',2400);}},
   {type:'act',aid:'MEGGER',done:false,targets:()=>[mtp.meg],
    desc:'Sebelum restart: MEGGER lilitan motor (klik megger).',
    why:'Panas berkepanjangan bisa melukai isolasi lilitan. Riso 180 MΩ = lilitan selamat. Kalau rendah, restart hanya akan membakar motor — dan reputasi teknisinya.',
    fx(){toast('🔍 Riso lilitan 180 MΩ — isolasi selamat ✓','ok',2400);}},
   {type:'act',aid:'RESET',done:false,targets:()=>[mtp.rst],
    desc:'Sekarang barulah sah: RESET TOR (klik tombol biru).',
    why:'Reset setelah akar masalah dibereskan = pemulihan; reset sebelum itu = perjudian. TOR yang trip berulang juga menua — bimetalnya lelah.',
    fx(){mtp.trip.material.color.setHex(0x36e07a);mtp.trip.material.emissive.setHex(0x36e07a);
      dispText(mtp.D,['READY','siap restart'],['#46ff8e','#7d8f84']);
      toast('✅ TOR di-reset — panel siap.','ok',2200);}},
   {type:'act',aid:'START',done:false,targets:()=>[mtp.btn],
    desc:'Restart motor: tekan START.',
    why:'Momen pembuktian diagnosa. Telinga ikut bekerja: dengungan halus = sehat; geraman kasar = masih ada masalah mekanis.',
    fx(){mtp.run=true;beep(110,.6,'sawtooth',.08);
      dispText(mtp.D,['RUN','—'],['#46ff8e','#7d8f84']);
      toast('🔄 Motor berputar mulus.','ok',2400);}},
   {type:'act',aid:'AMP',done:false,targets:()=>[mtp.amp],
    desc:'Bukti akhir: ukur arus 3 fasa dengan TANG AMPERE.',
    why:'12,1 · 12,3 · 12,2 A — selisih <2%, seimbang sempurna. Sebelum perbaikan fasa T pasti menonjol. Angka inilah penutup laporan troubleshooting yang profesional.',
    fx(){dispText(mtp.D,['12,2 A','R·S·T seimbang ✓'],['#46ff8e','#46ff8e']);
      toast('📏 Arus R-S-T: 12,1 / 12,3 / 12,2 A — SEIMBANG ✓','ok',3000);sfx.big();}},
  ],()=>{say('🎉 <b>Troubleshooting tuntas!</b> Dari gejala (trip) → akar (terminal kendor) → bukti (arus seimbang). Reset tanpa investigasi? Itu bukan gaya kita.');
    setTimeout(()=>showWin('trip'),2200);});

  say('VOLTA di sini 🔧 Motor blower trip dan semua orang menyuruhmu buru-buru. Justru di sinilah bedanya teknisi andal: <b>cari akar masalahnya dulu, reset belakangan</b>. Mulai dari TOR di panel.');
  $('#modTitle').textContent='J02·M2 — Troubleshooting Motor Trip';
  $('#taskHead').textContent='DIAGNOSA SEBELUM RESET';}

MISSIONS.star.build=buildStar;
MISSIONS.trip.build=buildTrip;

Object.assign(REAL,{
 star:[
  'Jangan tertukar urutan terminal U1-V1-W1 / U2-V2-W2 — salah susun = hubung singkat saat masuk delta',
  'Motor harus delta-rated pada tegangan jaringan (nameplate Δ380V untuk grid 380V)',
  'Ukur arus ketiga fasa saat star, transisi, dan delta — ketidakseimbangan >5% perlu investigasi',
  'Setel timer berdasarkan waktu akselerasi aktual motor berbeban, bukan angka default panel'],
 trip:[
  'Sebelum membuka terminal box: isolasi sumber + LOTO + verifikasi tegangan nol',
  'Gunakan thermal camera saat motor beroperasi untuk menemukan titik panas tanpa membongkar',
  'Kencangkan terminal dengan torsi sesuai tabel pabrikan, lalu jadwalkan re-torque berkala',
  'Catat trip di CMMS: tanggal, akar masalah, perbaikan — trip berulang pola = masalah sistemik'],
});

/* =====================================================================
   MISI 3 — KOMISIONING VFD
   ===================================================================== */
Object.assign(MISSIONS,{
 vfd:{lvl:'JALUR 02 · INDUSTRI & MANUFAKTUR · MISI 3',icon:'🎛️',title:'Komisioning VFD (Variable Frequency Drive)',strict:false,
  loc:'📍 Pabrik tekstil · Upgrade blower line 2 ke VFD',
  story:'Setelah dua kali drama (star-delta lalu trip), manajemen akhirnya setuju: blower line 2 di-upgrade ke VFD. Kecepatan bisa diatur sesuai kebutuhan proses, arus start nyaris tanpa lonjakan, dan hemat energi besar — TAPI hanya bila parameternya diisi benar. VFD dengan parameter asal = motor panas diam-diam.',
  goal:'VFD terkomisioning lengkap: parameter motor sesuai nameplate, ramp aman, autotune lolos, dan motor berputar halus di kecepatan proses.',
  obj:['Salin data nameplate motor ke parameter VFD','Set ramp time & jalankan autotune','Uji jalan pada frekuensi proses & verifikasi arus'],
  learn:['VFD mengatur kecepatan lewat frekuensi: 50 Hz = nominal, 35 Hz = 70% kecepatan','Parameter motor (arus, cosφ, rpm) WAJIB sesuai nameplate — proteksi elektronik VFD bergantung padanya','Autotune mengukur karakter motor sebenarnya: resistansi & induktansi lilitan','Hukum afinitas fan/pompa: turun 30% kecepatan ≈ hemat 65% daya — di sinilah VFD membayar dirinya'],
  next:['Pelajari kontrol PID: VFD mengejar setpoint tekanan/aliran otomatis','Dalami harmonisa VFD & kapan butuh line reactor/filter','Hubungkan VFD ke PLC lewat fieldbus (Modbus/Profinet)']},
});
let mvf={};
function buildVFD(){
  freshScene(0xb0bfcc,0x131c26);
  cam={theta:-.1,phi:1.2,r:6.5,target:new THREE.Vector3(.3,1.7,-1)};
  const Z=room(0x55606a,0xb9bfc6);
  /* panel + VFD */
  const panel=boxT(2.4,2.2,.25,TEX.metal(),{metalness:.35});panel.position.set(-1.6,1.9,Z-.04);scene.add(panel);
  panel.add(label('PANEL VFD BLOWER L2',.85).translateY(1.4));
  const vfd=box(.7,.95,.22,0x2b3a4a);vfd.position.set(-2.1,2.2,Z+.12);scene.add(vfd);
  mvf.D=makeDisplay(.55,.34,240,150);
  mvf.D.mesh.position.set(-2.1,2.42,Z+.26);scene.add(mvf.D.mesh);
  dispText(mvf.D,['P-MENU','param kosong'],['#5fd4ff','#7d8f84']);
  actMesh(mvf.D.mesh,'PARAM');
  scene.add(label('VFD 7,5 kW',.6,'#5fd4ff').translateX(-2.1).translateY(2.9).translateZ(Z+.1));
  /* tombol autotune & run */
  mvf.tune=box(.3,.16,.1,0xcc8830);mvf.tune.position.set(-2.1,1.85,Z+.26);scene.add(mvf.tune);
  actMesh(mvf.tune,'TUNE');
  scene.add(label('AUTOTUNE',.42).translateX(-2.1).translateY(1.66).translateZ(Z+.2));
  mvf.knob=cyl(.09,.09,.07,0x2ec06a);mvf.knob.rotation.x=Math.PI/2;
  mvf.knob.position.set(-1.2,1.85,Z+.22);scene.add(mvf.knob);
  actMesh(mvf.knob,'RUN');
  scene.add(label('RUN/SPEED',.45,'#7af0a8').translateX(-1.2).translateY(1.62).translateZ(Z+.18));
  /* layar ramp */
  mvf.R=makeDisplay(.9,.45,260,130);
  mvf.R.mesh.position.set(-1.2,2.45,Z+.14);scene.add(mvf.R.mesh);
  dispText(mvf.R,['RAMP','—'],['#5fd4ff','#7d8f84']);
  actMesh(mvf.R.mesh,'RAMP');
  /* motor + nameplate */
  const mb=cyl(.34,.34,.95,0x3a6ea8);mb.rotation.z=Math.PI/2;mb.position.set(1.8,.6,-1.2);scene.add(mb);
  mvf.fan=cyl(.3,.3,.06,0xd8e0e8,18,{metalness:.5});
  mvf.fan.rotation.z=Math.PI/2;mvf.fan.position.set(2.38,.6,-1.2);scene.add(mvf.fan);
  const bl=box(.5,.05,.04,0x9fb0c0);mvf.fan.add(bl);
  const bl2=bl.clone();bl2.rotation.x=Math.PI/2;mvf.fan.add(bl2);
  mvf.plate=box(.3,.2,.03,0xd8dee4,{metalness:.6});mvf.plate.position.set(1.8,1.0,-.72);scene.add(mvf.plate);
  actMesh(mvf.plate,'PLATE');
  scene.add(label('NAMEPLATE',.5,'#5fd4ff').translateX(1.8).translateY(1.25).translateZ(-.7));
  scene.add(label('MOTOR BLOWER 5,5 kW',.7).translateX(1.8).translateY(1.6).translateZ(-1.2));
  mvf.hz=0;mvf.run=false;
  moduleTick=(dt)=>{if(mvf.run&&mvf.hz<35){mvf.hz=Math.min(35,mvf.hz+dt*3.5);
    dispText(mvf.D,[mvf.hz.toFixed(1)+' Hz',(8.1*mvf.hz/50).toFixed(1)+' A · RUN'],
      ['#46ff8e','#46ff8e']);}
    if(mvf.run)mvf.fan.rotation.x+=dt*mvf.hz*.35;};
  startSeq([
   {type:'act',aid:'PLATE',done:false,targets:()=>[mvf.plate],
    desc:'Mulai dari sumbernya: baca NAMEPLATE motor (klik pelat).',
    why:'Nameplate adalah akta lahir motor: 5,5 kW · Δ380 V · 11,5 A · cosφ 0,84 · 1450 rpm. Semua angka proteksi VFD berasal dari sini — bukan dari ingatan atau perkiraan.',
    fx(){toast('🏷️ 5,5kW · 380V · 11,5A · cosφ 0,84 · 1450 rpm — dicatat.','ok',2800);}},
   {type:'act',aid:'PARAM',done:false,targets:()=>[mvf.D.mesh],
    desc:'Masukkan parameter motor ke VFD (klik layar VFD).',
    why:'Grup parameter motor diisi persis nameplate. Dari sinilah VFD menghitung proteksi termal elektronik — TOR digital yang melindungi motor di segala kecepatan, termasuk kecepatan rendah saat kipas motor sendiri lemah.',
    fx(){dispText(mvf.D,['PARAM ✓','5,5kW 11,5A 1450'],['#46ff8e','#eaf2fb']);
      toast('⚙️ P102=5,5kW · P103=11,5A · P105=1450rpm ✓','ok',2600);}},
   {type:'act',aid:'RAMP',done:false,targets:()=>[mvf.R.mesh],
    desc:'Set RAMP: akselerasi 10 s, deselerasi 15 s (klik layar ramp).',
    why:'Ramp menggantikan hentakan DOL dengan tanjakan landai: arus start nyaris rata. Deselerasi lebih panjang dari akselerasi agar energi balik fan tidak membuat DC bus VFD overvoltage.',
    fx(){dispText(mvf.R,['ACC 10s','DEC 15s ✓'],['#46ff8e','#46ff8e']);
      toast('📈 Ramp diset — tanjakan landai, tanpa hentakan.','ok',2400);}},
   {type:'act',aid:'TUNE',done:false,targets:()=>[mvf.tune],
    desc:'Jalankan AUTOTUNE (klik tombol oranye) — motor diam, VFD belajar.',
    why:'VFD menyuntik sinyal uji & mengukur resistansi serta induktansi lilitan motor SESUNGGUHNYA — bukan teori. Hasilnya: kontrol vektor yang presisi & torsi penuh bahkan di kecepatan rendah.',
    fx(){beep(300,.5,'sine',.06);beep(340,.5,'sine',.06,.5);
      toast('🧠 Autotune selesai: Rs=0,9Ω · Lm OK — model motor tersimpan.','ok',2800);}},
   {type:'act',aid:'RUN',done:false,targets:()=>[mvf.knob],
    desc:'RUN! Putar ke frekuensi proses 35 Hz (klik kenop hijau).',
    why:'35 Hz = 70% kecepatan — kebutuhan aliran proses saat ini. Hukum afinitas: daya ikut pangkat tiga kecepatan, jadi 70% speed ≈ 34% daya. Blower yang sama, tagihan listrik sepertiga.',
    fx(){mvf.run=true;beep(120,.8,'sine',.07);
      toast('🌀 Motor mengalun mulus ke 35 Hz · 5,7 A — hemat 66%!','ok',3000);sfx.big();}},
  ],()=>{say('🎉 <b>VFD beroperasi!</b> Dari DOL yang menghentak, star-delta yang berkompromi, kini kontrol penuh: kecepatan presisi, start selembut sutra, dan penghematan yang terasa di tagihan.');
    setTimeout(()=>showWin('vfd'),2200);});
  say('VOLTA di sini 🎛️ Evolusi terakhir starter motor: <b>VFD</b>. Satu aturan emasnya: <b>parameter = nameplate</b>, bukan perkiraan. Mulai dari pelat kecil di badan motor itu.');
  $('#modTitle').textContent='J02·M3 — Komisioning VFD';
  $('#taskHead').textContent='NAMEPLATE → PARAM → TUNE → RUN';}
MISSIONS.vfd.build=buildVFD;
Object.assign(REAL,{
 vfd:[
  'Jarak kabel VFD-motor panjang butuh output reactor/dV-dt filter — tegangan pantul merusak isolasi motor',
  'Motor lama yang dipasangi VFD perlu dicek kelas isolasinya (inverter-duty) & bearing (arus bearing)',
  'Autotune dinamis (motor berputar) lebih akurat — pastikan beban dilepas & area aman',
  'Simpan backup parameter VFD eksternal; unit pengganti tinggal restore, bukan setting ulang dari nol'],
});

/* =====================================================================
   MISI 4 — INTERLOCK KONVEYOR BERURUTAN
   ===================================================================== */
Object.assign(MISSIONS,{
 konveyor:{lvl:'JALUR 02 · INDUSTRI & MANUFAKTUR · MISI 4',icon:'🏭',title:'Interlock Konveyor Berurutan',strict:true,
  loc:'📍 Pabrik pengantongan · Line konveyor CV1 → CV2',
  story:'Dua konveyor seri mengantar karung 50 kg dari mesin pengisi ke gudang. Minggu lalu operator baru menyalakan CV1 (hulu) saat CV2 (hilir) mati — lima karung menumpuk di titik transfer, robek, dan line berhenti dua jam. Hari ini kamu memasang aturan emas konveyor seri ke dalam sistem: urutan bukan saran, ia hukum.',
  goal:'Line beroperasi dengan interlock benar: start dari hilir ke hulu, stop dari hulu ke hilir, dan sensor penumpukan menjaga titik transfer.',
  obj:['Pahami aturan urutan start/stop konveyor seri','Start CV2 (hilir) dulu, baru CV1 (hulu)','Pasang sensor anti-numpuk & uji stop berurutan'],
  learn:['Start selalu dari HILIR ke hulu: penerima siap dulu, baru pengirim mengirim — kebalikannya = tumpukan di transfer','Stop selalu dari HULU ke hilir: pengirim berhenti dulu, hilir menghabiskan muatan (clearing time) baru ikut berhenti','Sensor penumpukan di titik transfer = pagar terakhir saat manusia/logika lalai — ia menghentikan hulu otomatis','Interlock sejenis ini melindungi juga motor: konveyor hilir mati + hulu memaksa = beban macet = TOR trip'],
  next:['Pelajari ladder cascade start-stop untuk N konveyor seri','Tambahkan pull-cord & belt-sway switch (proteksi keselamatan konveyor)','Dalami perhitungan clearing time dari panjang & kecepatan belt']},
});
let mkv={};
function buildKonveyor(){
  freshScene(0xb0bfcc,0x131c26);
  cam={theta:.3,phi:1.12,r:10,target:new THREE.Vector3(0,1.2,-.8)};
  const floor=boxT(26,.1,14,TEX.concrete());floor.position.y=-.05;scene.add(floor);
  /* CV1 (hulu, kiri) dan CV2 (hilir, kanan) */
  function beltUnit(x,w,nama){
    const b=box(w,.22,1.1,0x222a31,{roughness:.85});b.position.set(x,.85,-1.5);scene.add(b);
    [-w/2+.6,0,w/2-.6].forEach(dx=>{
      const leg=boxT(.12,.78,.9,TEX.metal(),{metalness:.4});leg.position.set(x+dx,.39,-1.5);scene.add(leg);});
    scene.add(label(nama,.7).translateX(x).translateY(1.6).translateZ(-1.5));
    return b;}
  beltUnit(-3.4,6,'CV1 · HULU (pengisi)');
  beltUnit(3.2,6,'CV2 · HILIR (gudang)');
  /* mesin pengisi di ujung kiri */
  const filler=boxT(1.4,2.2,1.2,TEX.metal(),{metalness:.3});filler.position.set(-7.0,1.1,-1.5);scene.add(filler);
  scene.add(label('MESIN PENGISI',.6).translateX(-7.0).translateY(2.5).translateZ(-1.5));
  /* titik transfer + sensor numpuk */
  const tpost=cyl(.04,.04,1.4,0x666666);tpost.position.set(-.1,.7,-2.3);scene.add(tpost);
  mkv.sjam=box(.16,.16,.16,0xd8b020);mkv.sjam.position.set(-.1,1.35,-2.2);scene.add(mkv.sjam);
  actMesh(mkv.sjam,'SJAM');
  scene.add(label('TITIK TRANSFER',.55,'#ffd23f').translateX(-.1).translateY(1.85).translateZ(-2.2));
  /* panel kontrol: P&ID display + tombol */
  const panel=boxT(2.6,2.0,.25,TEX.metal(),{metalness:.35});panel.position.set(-4.6,2.0,-4.2);scene.add(panel);
  panel.add(label('PANEL LINE',.8).translateY(1.25));
  mkv.D=makeDisplay(2.2,1.1,420,220);
  mkv.D.mesh.position.set(-4.6,2.2,-4.06);scene.add(mkv.D.mesh);
  actMesh(mkv.D.mesh,'CEK');
  function layar(){
    dispText(mkv.D,['CV1: '+(mkv.cv1?'RUN':'STOP')+' · CV2: '+(mkv.cv2?'RUN':'STOP'),
      mkv.sensorOn?'sensor transfer AKTIF':'sensor transfer: belum',
      'aturan: start 2→1 · stop 1→2'],
      [mkv.cv1&&mkv.cv2?'#46ff8e':'#ffd23f',mkv.sensorOn?'#46ff8e':'#7d8f84','#8aa3bd']);}
  mkv.btn2=cyl(.1,.1,.08,0x2ec06a);mkv.btn2.rotation.x=Math.PI/2;
  mkv.btn2.position.set(-3.9,1.1,-4.05);scene.add(mkv.btn2);
  actMesh(mkv.btn2,'CV2');
  scene.add(label('CV2',.5,'#7af0a8').translateX(-3.9).translateY(1.38).translateZ(-4.0));
  mkv.btn1=cyl(.1,.1,.08,0x2ec06a);mkv.btn1.rotation.x=Math.PI/2;
  mkv.btn1.position.set(-4.6,1.1,-4.05);scene.add(mkv.btn1);
  actMesh(mkv.btn1,'CV1');
  scene.add(label('CV1',.5,'#7af0a8').translateX(-4.6).translateY(1.38).translateZ(-4.0));
  mkv.btnStop=cyl(.1,.1,.08,0xd83a3a);mkv.btnStop.rotation.x=Math.PI/2;
  mkv.btnStop.position.set(-5.3,1.1,-4.05);scene.add(mkv.btnStop);
  actMesh(mkv.btnStop,'STOP1');
  scene.add(label('STOP SEQ',.5,'#ff9d9d').translateX(-5.3).translateY(1.38).translateZ(-4.0));
  /* karung berjalan */
  mkv.items=[];mkv.cv1=false;mkv.cv2=false;mkv.sensorOn=false;mkv.spawnT=1.0;
  mkv.stopping=false;mkv.clearT=0;
  layar();
  moduleTick=(dt)=>{
    if(mkv.cv1){mkv.spawnT-=dt;
      if(mkv.spawnT<=0){mkv.spawnT=2.2;
        const s=new THREE.Mesh(new THREE.SphereGeometry(.3,12,10),
          new THREE.MeshStandardMaterial({color:0xc8b48a,roughness:.9}));
        s.scale.set(1,.66,.8);s.position.set(-6.2,1.18,-1.5);scene.add(s);
        mkv.items.push(s);}}
    for(let i=mkv.items.length-1;i>=0;i--){
      const p=mkv.items[i].position;
      const onCV1=p.x<-.2, onCV2=p.x>=-.2;
      if((onCV1&&mkv.cv1)||(onCV2&&mkv.cv2))p.x+=dt*1.2;
      if(p.x>6.0){scene.remove(mkv.items[i]);mkv.items.splice(i,1);}}
    if(mkv.stopping){mkv.clearT-=dt;
      if(mkv.clearT<=0&&mkv.cv2){mkv.cv2=false;layar();
        toast('⏹ CV2 berhenti — line kosong, stop sequence tuntas.','ok',2600);}}};
  startSeq([
   {type:'act',aid:'CEK',done:false,targets:()=>[mkv.D.mesh],
    desc:'Pelajari ATURAN URUTAN di panel line (klik layar).',
    why:'Tertulis jelas: start 2→1 (hilir dulu), stop 1→2 (hulu dulu). Bukan selera — geometri yang memaksanya: barang mengalir dari 1 ke 2, maka penerima wajib siap sebelum pengirim mengirim.',
    fx(){toast('📋 Aturan dipahami: start dari hilir, stop dari hulu.','ok',2600);}},
   {type:'act',aid:'CV2',done:false,targets:()=>[mkv.btn2],
    desc:'Start CV2 — konveyor HILIR menyala lebih dulu.',
    why:'CV2 berputar kosong sebentar — dan itu benar: jalur pembuangan sudah hidup sebelum satu karung pun dikirim. Seperti membuka pintu sebelum melempar bola.',
    fx(){mkv.cv2=true;layar();beep(100,.5,'sawtooth',.06);
      toast('▶ CV2 RUN — hilir siap menerima.','ok',2400);}},
   {type:'act',aid:'CV1',done:false,targets:()=>[mkv.btn1],
    desc:'Kini giliran CV1 — hulu mulai mengirim karung.',
    why:'Karung mengalir mulus melintasi titik transfer karena hilir sudah menunggu. Urutan terbalik minggu lalu memberi pabrik ini dua jam kerugian — urutan benar hari ini tak memberi apa-apa kecuali kelancaran. Begitulah keandalan: tak terlihat.',
    fx(){mkv.cv1=true;layar();beep(100,.5,'sawtooth',.06);
      toast('▶ CV1 RUN — karung mengalir, transfer mulus.','ok',2600);}},
   {type:'act',aid:'SJAM',done:false,targets:()=>[mkv.sjam],
    desc:'Pasang & aktifkan SENSOR PENUMPUKAN di titik transfer.',
    why:'Pagar terakhir: bila karung tertahan menutupi sensor lebih dari 3 detik, PLC menghentikan CV1 otomatis — tumpukan tak akan pernah lebih dari satu. Interlock manusia bisa lupa; sensor tidak.',
    fx(){mkv.sensorOn=true;layar();
      toast('📡 Sensor anti-numpuk AKTIF — transfer terjaga 24/7.','ok',2600);}},
   {type:'act',aid:'STOP1',done:false,targets:()=>[mkv.btnStop],
    desc:'Uji STOP berurutan: tekan STOP SEQ — perhatikan urutannya.',
    why:'CV1 berhenti seketika; CV2 terus berjalan beberapa detik menghabiskan karung yang masih di atasnya (clearing time), lalu berhenti sendiri. Tidak ada satu karung pun menginap di belt — line bersih, siap shift berikutnya.',
    fx(){mkv.cv1=false;mkv.stopping=true;mkv.clearT=4.5;layar();
      toast('⏹ CV1 stop — CV2 clearing… amati karung terakhir keluar.','ok',3000);sfx.big();}},
  ],()=>{say('🎉 <b>Interlock sempurna!</b> Start dari hilir, stop dari hulu, sensor menjaga titik transfer. Konveyor seri yang dijalankan dengan hukum yang benar tidak pernah jadi berita.');
    setTimeout(()=>showWin('konveyor'),2200);});
  say('VOLTA di sini 🏭 Dua konveyor seri dan satu hukum besi: <b>start dari hilir, stop dari hulu</b>. Minggu lalu hukum itu dilanggar — hari ini kamu menanamkannya ke sistem. Mulai dari panel.');
  $('#modTitle').textContent='J02·M4 — Interlock Konveyor';
  $('#taskHead').textContent='START 2→1 · STOP 1→2';}
MISSIONS.konveyor.build=buildKonveyor;
Object.assign(REAL,{
 konveyor:[
  'Interlock urutan diwujudkan di logika DAN diuji fisik saat komisioning — bukan dipercaya dari diagram',
  'Lengkapi proteksi keselamatan konveyor: pull-cord sepanjang sisi, belt-sway, & guard titik jepit',
  'Clearing time dihitung dari panjang belt ÷ kecepatan + margin — bukan angka tebakan',
  'Alarm penumpukan dicatat di sistem: transfer yang sering tersumbat = masalah desain, bukan operator'],
});

/* =====================================================================
   MISI 5 — PREDICTIVE MAINTENANCE: ANALISIS VIBRASI
   ===================================================================== */
Object.assign(MISSIONS,{
 vibra:{lvl:'JALUR 02 · INDUSTRI & MANUFAKTUR · MISI 5',icon:'📳',title:'Predictive Maintenance: Analisis Vibrasi',strict:false,
  loc:'📍 Pabrik tekstil · Rute pengukuran bulanan',
  story:'Pabrik ini dulu menganut dua mazhab: perbaiki saat rusak (mahal & mendadak) atau ganti terjadwal (membuang komponen sehat). Kamu membawa mazhab ketiga: DENGARKAN mesinnya. Bearing yang mulai rusak bernyanyi berminggu-minggu sebelum mati — dalam bahasa getaran yang hanya dipahami spektrum. Hari ini rute vibrasi bulanan menemukan sesuatu di pompa P-203.',
  goal:'Kerusakan bearing terdeteksi dini dari spektrum vibrasi, sisa umur diestimasi dari tren, dan penggantian terjadwal TANPA produksi berhenti mendadak.',
  obj:['Ukur vibrasi sesuai rute & titik standar','Baca spektrum: kenali tanda tangan kerusakan bearing','Tren-kan data, putuskan jadwal, eksekusi tanpa kejutan'],
  learn:['Overall vibration (mm/s RMS) adalah termometer; SPEKTRUM adalah diagnosisnya — frekuensi mana yang bergetar menunjuk komponen mana yang sakit','Tiap cacat bearing punya frekuensi khasnya (BPFO/BPFI dari geometri bearing) — puncak di frekuensi itu = vonis yang spesifik','Kerusakan bearing menempuh tahapan berminggu-minggu: ultrasonik → spektrum → terdengar → panas → gagal. Makin dini tertangkap, makin murah','Predictive menang dua arah: tak ada breakdown mendadak, tak ada penggantian komponen yang masih sehat'],
  next:['Pelajari analisis envelope/demodulasi untuk bearing tahap dini','Dalami balancing & alignment — dua akar getaran terbesar','Eksplorasi sensor vibrasi online + IoT untuk aset kritis']},
});
let mvb={};
function buildVibra(){
  freshScene(0xb0bfcc,0x131c26);
  cam={theta:-.1,phi:1.18,r:8,target:new THREE.Vector3(0,1.4,-.8)};
  const Z=room(0x55606a,0xb9bfc6,16,11);
  /* deretan pompa */
  mvb.pumps=[];
  [[-4.5,'P-201'],[-1.5,'P-202'],[1.5,'P-203'],[4.5,'P-204']].forEach((o,i)=>{
    const mtr=cyl(.3,.3,.8,0x3a6ea8);mtr.rotation.z=Math.PI/2;mtr.position.set(o[0]-.5,.6,-1.6);scene.add(mtr);
    const pmp=cyl(.34,.34,.5,0x6a8aa8);pmp.rotation.z=Math.PI/2;pmp.position.set(o[0]+.45,.6,-1.6);scene.add(pmp);
    const base=boxT(1.8,.18,.8,TEX.concrete());base.position.set(o[0],.1,-1.6);scene.add(base);
    actMesh(pmp,'P'+i);mvb.pumps.push(pmp);
    scene.add(label(o[1],.6).translateX(o[0]).translateY(1.25).translateZ(-1.6));});
  /* vibration analyzer */
  const tbl=boxT(1.0,.07,.6,TEX.wood());tbl.position.set(-3.0,.95,1.2);scene.add(tbl);
  const tleg=boxT(.08,.95,.08,TEX.wood());tleg.position.set(-3.0,.47,1.2);scene.add(tleg);
  mvb.ana=box(.3,.22,.2,0xd8b020);mvb.ana.position.set(-3.0,1.1,1.2);scene.add(mvb.ana);
  scene.add(label('VIBRATION ANALYZER',.55,'#5fd4ff').translateX(-3.0).translateY(1.45).translateZ(1.2));
  /* layar spektrum */
  const frame=boxT(3.4,2.0,.16,TEX.metal(),{metalness:.4});frame.position.set(1.4,2.5,Z+.05);scene.add(frame);
  frame.add(label('SPEKTRUM & TREN',.8).translateY(1.25));
  mvb.D=makeDisplay(3.1,1.7,520,300);
  mvb.D.mesh.position.set(1.4,2.5,Z+.15);scene.add(mvb.D.mesh);
  actMesh(mvb.D.mesh,'SPEK');
  function layar(mode){
    const g=mvb.D.g,W=520,H=300;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.strokeStyle='#2a3a4c';g.lineWidth=2;
    g.beginPath();g.moveTo(36,16);g.lineTo(36,H-36);g.lineTo(W-12,H-36);g.stroke();
    g.font='600 14px Consolas';g.textAlign='left';
    if(mode<=1){ /* spektrum */
      const peaks=[[60,.25,'1x'],[120,.12,'2x'],[236,mode===1?.7:.1,'BPFO!'],[472,mode===1?.35:.05,'2xBPFO']];
      peaks.forEach(p=>{
        const x=36+p[0]*.9,h=p[1]*(H-70);
        g.strokeStyle=p[2].includes('BPFO')&&mode===1?'#ff5a5a':'#5fd4ff';g.lineWidth=5;
        g.beginPath();g.moveTo(x,H-36);g.lineTo(x,H-36-h);g.stroke();
        g.fillStyle=g.strokeStyle;g.fillText(p[2],x-12,H-42-h);});
      g.fillStyle='#8aa3bd';g.fillText('frekuensi (Hz) →',W-150,H-14);
      g.fillStyle=mode===1?'#ff5a5a':'#46ff8e';g.font='700 16px Consolas';
      g.fillText(mode===1?'P-203: puncak di BPFO 236 Hz — cacat lintasan luar!':'spektrum normal',40,30);}
    else{ /* tren */
      g.strokeStyle='#ffd23f';g.lineWidth=3;g.beginPath();
      [[0,1.1],[1,1.2],[2,1.3],[3,1.8],[4,2.9],[5,4.6]].forEach((p,i)=>{
        const x=36+p[0]*80,y=H-36-p[1]*42;
        i===0?g.moveTo(x,y):g.lineTo(x,y);g.fillStyle='#ffd23f';g.fillRect(x-3,y-3,6,6);});
      g.stroke();
      g.strokeStyle='#7a2a2a';g.setLineDash([6,5]);
      g.beginPath();g.moveTo(36,H-36-7.1*42+42);g.lineTo(W-12,H-36-7.1*42+42);g.stroke();g.setLineDash([]);
      g.fillStyle='#ff8d8d';g.fillText('batas 7,1 mm/s',40,H-36-7.1*42+36);
      g.fillStyle='#ffd23f';g.font='700 16px Consolas';
      g.fillText('tren 6 bln: proyeksi sentuh batas ±3 minggu',40,28);}
    mvb.D.tex.needsUpdate=true;}
  layar(0);
  /* papan jadwal & bearing baru */
  mvb.jadwal=box(.6,.7,.05,0xe8e4d8);mvb.jadwal.position.set(4.6,2.3,Z+.06);scene.add(mvb.jadwal);
  actMesh(mvb.jadwal,'JADWAL');
  scene.add(label('JADWAL HAR',.55,'#5fd4ff').translateX(4.6).translateY(2.9).translateZ(Z+.1));
  mvb.brg=new THREE.Mesh(new THREE.TorusGeometry(.18,.06,12,24),
    new THREE.MeshStandardMaterial({color:0xd8dee4,metalness:.7,roughness:.3}));
  mvb.brg.position.set(5.4,1.1,.8);scene.add(mvb.brg);
  actMesh(mvb.brg,'GANTI');
  scene.add(label('BEARING BARU 6309',.55,'#5fd4ff').translateX(5.4).translateY(1.5).translateZ(.8));
  startSeq([
   {type:'act',aid:'P2',done:false,targets:()=>[mvb.pumps[2]],
    desc:'Jalankan rute: ukur vibrasi tiap pompa — P-203 terasa beda (klik P-203).',
    why:'Titik ukur selalu sama (bearing housing, arah H-V-A) agar bulan demi bulan bisa dibandingkan. P-201, 202, 204: 1,1–1,4 mm/s, tenang. P-203: 4,6 mm/s — naik dari 2,9 bulan lalu. Termometer sudah bicara; saatnya diagnosis.',
    fx(){toast('📳 P-203: 4,6 mm/s (bulan lalu 2,9) — perlu spektrum!','bad',2800);}},
   {type:'act',aid:'SPEK',done:false,targets:()=>[mvb.D.mesh],
    desc:'Baca SPEKTRUM P-203: frekuensi mana yang berteriak? (klik layar)',
    why:'Puncak menjulang di 236 Hz — bukan 1x putaran (ketidakseimbangan), bukan 2x (misalignment). 236 Hz = persis BPFO bearing 6309 pada 2.950 rpm: cacat di LINTASAN LUAR bearing. Spektrum tak hanya bilang "sakit" — ia menyebut nama penyakitnya.',
    fx(){layar(1);toast('🔍 Puncak BPFO 236 Hz — cacat outer race bearing!','bad',3000);}},
   {type:'act',aid:'TREN',done:false,targets:()=>[mvb.D.mesh],
    desc:'Buka TREN 6 bulan: berapa sisa umurnya?',
    why:'Kurva menanjak makin curam — pola klasik kerusakan bearing tahap 3. Proyeksi menyentuh batas 7,1 mm/s dalam ±3 minggu. Artinya: BUKAN darurat malam ini, tapi tak boleh menunggu overhaul tahunan. Jendela emasnya: shutdown mingguan terdekat.',
    fx(){layar(2);toast('📈 Proyeksi: 3 minggu menuju batas — jadwalkan, jangan panik.','ok',3000);}},
   {type:'act',aid:'JADWAL',done:false,targets:()=>[mvb.jadwal],
    desc:'Putuskan: masukkan penggantian ke JADWAL shutdown mingguan.',
    why:'Inilah buah predictive: penggantian dijadwalkan Sabtu (line memang berhenti), bearing dipesan hari ini, kru disiapkan — produksi TIDAK kehilangan satu menit pun di luar rencana. Bandingkan dengan versi takdir: pecah Rabu jam 2 pagi.',
    fx(){toast('🗓️ Sabtu 09:00 · bearing dipesan · kru siap — tanpa drama.','ok',2800);}},
   {type:'act',aid:'GANTI',done:false,targets:()=>[mvb.brg],
    desc:'Sabtu tiba: GANTI bearing & verifikasi (klik bearing baru).',
    why:'Bearing lama dibuka: lintasan luar benar-benar terkelupas (spalling) — persis kata spektrum. Yang baru dipasang dengan pemanas induksi (bukan dipukul!), lalu diukur ulang: 1,2 mm/s, halus. Mesin kembali bernyanyi nada sehat — dan kamu yang mengajarinya.',
    fx(){toast('🔧 Spalling terkonfirmasi · baru terpasang · 1,2 mm/s ✓','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Kerusakan tertangkap 3 minggu sebelum pecah!</b> Spektrum menyebut nama penyakitnya, tren memberi tanggalnya, jadwal mengeksekusi tanpa kejutan. Itulah predictive maintenance: mendengar sebelum menjerit.');
    setTimeout(()=>showWin('vibra'),2200);});
  const s1v=seq.steps[1],of1v=s1v.fx;s1v.fx=()=>{of1v();mvb.D.mesh.userData.aid='TREN';};
  say('VOLTA di sini 📳 Mesin yang akan rusak selalu <b>bernyanyi lebih dulu</b> — dalam bahasa getaran. Hari ini rute bulanan menemukan nada sumbang di P-203. Ambil analyzer, kita dengarkan bersama.');
  $('#modTitle').textContent='J02·M5 — Analisis Vibrasi';
  $('#taskHead').textContent='DENGAR · DIAGNOSA · JADWALKAN';}
MISSIONS.vibra.build=buildVibra;
Object.assign(REAL,{
 vibra:[
  'Titik & arah pengukuran distandarkan dan ditandai di mesin — konsistensi adalah nyawa trending',
  'Hitung frekuensi cacat (BPFO/BPFI/BSF/FTF) dari geometri bearing & rpm aktual, simpan di database aset',
  'Bearing dipasang dengan pemanas induksi/penekan sleeve — palu adalah pembuat cacat baru',
  'Simpan bearing bekas yang rusak untuk analisis akar (pelumasan? beban? arus bearing dari VFD?)'],
});

/* =====================================================================
   MISI 6 — POWER QUALITY: MEMBURU HARMONISA
   ===================================================================== */
Object.assign(MISSIONS,{
 harmonisa:{lvl:'JALUR 02 · INDUSTRI & MANUFAKTUR · MISI 6',icon:'〰️',title:'Power Quality: Memburu Harmonisa',strict:false,
  loc:'📍 Pabrik tekstil · Pasca-upgrade VFD massal',
  story:'Sukses VFD-mu menular: kini 14 drive terpasang di seluruh pabrik. Tapi sukses itu membawa tamu tak diundang — kapasitor bank tua meledap dua kali, trafo mendengung lebih keras, dan netral panas misterius. Tersangkanya tak terlihat di amperemeter biasa: HARMONISA, arus berfrekuensi tinggi yang ditiupkan elektronika daya ke segala arah.',
  goal:'Harmonisa terukur & teridentifikasi sumbernya, filter terpasang pada tempat yang benar, dan THD turun ke batas aman standar.',
  obj:['Ukur THD tegangan & arus dengan PQ analyzer','Identifikasi orde dominan & sumbernya','Pasang solusi & verifikasi THD turun'],
  learn:['VFD & rectifier menarik arus tidak sinus — pecahannya adalah harmonisa orde 5, 7, 11... yang memanaskan apa pun yang dilaluinya','THD (total harmonic distortion) adalah rapor: arus boleh tinggi di mesin, tapi THD-V di busbar harus tetap di bawah ~5-8% agar tetangga tak ikut menderita','Harmonisa kelipatan-3 (3, 9...) dari beban 1 fasa MENUMPUK di netral — netral panas pada sistem "seimbang" hampir selalu ulahnya','Solusi bertingkat: line reactor per drive → filter pasif tuned → filter aktif; dan kapasitor polos di jaringan berharmonisa = resonansi = ledakan'],
  next:['Pelajari resonansi paralel: kenapa kapasitor + harmonisa = bom','Dalami standar batas harmonisa (IEEE 519) per titik sambung','Eksplorasi drive AFE (active front end) — VFD yang bersih dari lahir']},
});
let mhr={};
function buildHarmonisa(){
  freshScene(0xb0bfcc,0x131c26);
  cam={theta:-.05,phi:1.18,r:8,target:new THREE.Vector3(0,1.7,-.8)};
  const Z=room(0x55606a,0xb9bfc6,16,11);
  /* deretan VFD */
  for(let i=0;i<4;i++){
    const v=box(.5,.7,.2,0x2b3a4a);v.position.set(-5.2+i*.7,2.3,Z+.1);scene.add(v);}
  scene.add(label('14x VFD TERPASANG',.7).translateX(-4.2).translateY(3.1).translateZ(Z+.1));
  /* trafo mendengung & kapasitor bekas ledak */
  const trf=boxT(1.2,1.2,.9,TEX.metal(),{metalness:.3});trf.position.set(-1.4,.65,-1.8);scene.add(trf);
  scene.add(label('TRAFO (mendengung!)',.65,'#ffd23f').translateX(-1.4).translateY(1.55).translateZ(-1.8));
  mhr.cap=box(.7,.9,.5,0x6a6a72);mhr.cap.position.set(.8,.5,-1.8);scene.add(mhr.cap);
  const gosong=box(.3,.3,.05,0x1a1410);gosong.position.set(.8,.7,-1.52);scene.add(gosong);
  actMesh(mhr.cap,'KAPASITOR');
  scene.add(label('KAPASITOR (meledap 2x)',.65,'#ff8d8d').translateX(.8).translateY(1.25).translateZ(-1.8));
  /* PQ analyzer + layar spektrum */
  mhr.pq=box(.34,.24,.26,0xd8b020);mhr.pq.position.set(2.8,1.1,.4);scene.add(mhr.pq);
  actMesh(mhr.pq,'UKUR');
  const tbl=boxT(1.0,.07,.6,TEX.wood());tbl.position.set(2.8,.95,.4);scene.add(tbl);
  const tleg=boxT(.08,.95,.08,TEX.wood());tleg.position.set(2.8,.47,.4);scene.add(tleg);
  scene.add(label('PQ ANALYZER',.55,'#5fd4ff').translateX(2.8).translateY(1.45).translateZ(.4));
  const frame=boxT(3.4,2.0,.16,TEX.metal(),{metalness:.4});frame.position.set(3.2,2.5,Z+.05);scene.add(frame);
  frame.add(label('SPEKTRUM HARMONISA',.8).translateY(1.25));
  mhr.D=makeDisplay(3.1,1.7,520,300);
  mhr.D.mesh.position.set(3.2,2.5,Z+.15);scene.add(mhr.D.mesh);
  function spek(filtered){
    const g=mhr.D.g,W=520,H=300;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.strokeStyle='#2a3a4c';g.lineWidth=2;
    g.beginPath();g.moveTo(36,16);g.lineTo(36,H-40);g.lineTo(W-12,H-40);g.stroke();
    const ords=[[1,1],[5,filtered?.07:.42],[7,filtered?.05:.31],[11,filtered?.03:.14],[13,filtered?.02:.09]];
    ords.forEach(o=>{
      const x=36+o[0]*32,h=o[1]*(H-80);
      g.strokeStyle=o[0]===1?'#5fd4ff':(o[1]>.1?'#ff5a5a':'#46ff8e');g.lineWidth=14;
      g.beginPath();g.moveTo(x,H-40);g.lineTo(x,H-40-h);g.stroke();
      g.fillStyle='#8aa3bd';g.font='600 14px Consolas';g.textAlign='center';
      g.fillText('H'+o[0],x,H-20);});
    g.font='700 17px Consolas';g.textAlign='left';
    g.fillStyle=filtered?'#46ff8e':'#ff5a5a';
    g.fillText(filtered?'THD-I 8% · THD-V 3,1% ✓ (IEEE 519)':'THD-I 38% · THD-V 9,4% — DI ATAS BATAS',44,32);
    mhr.D.tex.needsUpdate=true;}
  spek(false);mhr.D.mesh.visible=true;
  /* filter pasif */
  mhr.filter=boxT(.9,1.1,.7,TEX.metal(),{metalness:.35});mhr.filter.position.set(5.6,.6,-1.8);scene.add(mhr.filter);
  actMesh(mhr.filter,'FILTER');
  scene.add(label('FILTER HARMONISA (baru)',.6,'#8df0b8').translateX(5.6).translateY(1.45).translateZ(-1.8));
  startSeq([
   {type:'act',aid:'UKUR',done:false,targets:()=>[mhr.pq],
    desc:'Pasang PQ ANALYZER di busbar utama — rekam 24 jam (klik alat).',
    why:'Amperemeter biasa buta terhadap bentuk gelombang; PQ analyzer membedahnya per orde. Hasil: THD-I 38%, THD-V 9,4% — tegangan busbar sendiri sudah tercemar. Setiap beban di pabrik ini, bersalah atau tidak, kini meminum listrik yang keruh.',
    fx(){toast('〰️ THD-I 38% · THD-V 9,4% — jauh di atas batas sehat.','bad',3000);}},
   {type:'act',aid:'ORDE',done:false,targets:()=>[mhr.D.mesh],
    desc:'Baca SPEKTRUM: orde mana yang dominan? (klik layar)',
    why:'H5 menjulang 42%, H7 31% — tanda tangan khas rectifier 6-pulsa: keluarga VFD-mu. Bukan kebetulan kapasitor tua yang meledak: impedansinya MENURUN di frekuensi tinggi, jadi ia menelan harmonisa paling rakus sampai kenyang... lalu pecah.',
    fx(){toast('🔍 H5+H7 dominan = rectifier VFD · kapasitor jadi korban resonansi.','bad',3000);}},
   {type:'act',aid:'KAPASITOR',done:false,targets:()=>[mhr.cap],
    desc:'Amankan dulu: lepas KAPASITOR polos dari jaringan (klik kapasitor).',
    why:'Kapasitor polos + jaringan kaya H5 = sirkuit resonansi paralel yang MEMPERKUAT harmonisa, bukan meredam. Sebelum filter terpasang, kapasitor tua ini justru bahan peledak. Dilepas dulu; penggantinya nanti yang ber-detuned reactor.',
    fx(){toast('🔌 Kapasitor polos dilepas — sirkuit resonansi dibubarkan.','ok',2800);}},
   {type:'act',aid:'FILTER',done:false,targets:()=>[mhr.filter],
    desc:'Pasang FILTER harmonisa tuned H5/H7 + reactor per drive besar (klik filter).',
    why:'Dua lapis: line reactor 3% di tiap VFD besar (meredam dari sumbernya) + filter pasif tuned 4,7th di busbar (menyerap sisa H5/H7 ke dirinya, bukan ke trafo). Filter sekaligus menyumbang kVAr — kapasitor tua tergantikan oleh sesuatu yang paham zamannya.',
    fx(){toast('🧲 Reactor + filter tuned terpasang — harmonisa punya rumah baru.','ok',3000);}},
   {type:'act',aid:'VERIF',done:false,targets:()=>[mhr.D.mesh],
    desc:'Ukur ulang: VERIFIKASI THD turun (klik layar).',
    why:'Spektrum baru: H5 tinggal 7%, THD-V 3,1% — di bawah batas IEEE 519 ✓. Dengung trafo melembut, netral mendingin, dan cosφ malah membaik. Listrik pabrik kembali jernih: VFD boleh tetap 14, asalkan ditemani filter yang tepat.',
    fx(){spek(true);
      toast('✅ THD-V 9,4% → 3,1% — jaringan kembali jernih!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Hantu harmonisa tertangkap!</b> Diukur per orde, dilacak ke rectifier, kapasitor korban diamankan, filter dipasang di tempat yang benar. Elektronika daya itu hebat — asal sampahnya dikelola.');
    setTimeout(()=>showWin('harmonisa'),2200);});
  actMesh(mhr.D.mesh,'ORDE');
  const s1h=seq.steps[1],of1h=s1h.fx;s1h.fx=()=>{of1h();mhr.D.mesh.userData.aid='VERIF';};
  say('VOLTA di sini 〰️ Upgrade VFD-mu sukses... terlalu sukses: kapasitor meledap, trafo mendengung, netral panas. Tersangkanya tak terlihat amperemeter biasa: <b>harmonisa</b>. Ambil PQ analyzer — kita buru per orde!');
  $('#modTitle').textContent='J02·M6 — Memburu Harmonisa';
  $('#taskHead').textContent='UKUR ORDE, JANGAN MENEBAK';}
MISSIONS.harmonisa.build=buildHarmonisa;
Object.assign(REAL,{
 harmonisa:[
  'Rekam PQ minimal 1 siklus produksi penuh — harmonisa berubah mengikuti pola beban drive',
  'Desain filter tuned WAJIB studi resonansi jaringan — filter yang salah tala jadi masalah baru',
  'Verifikasi batas THD di titik sambung sesuai IEEE 519 / ketentuan utilitas setempat',
  'Saat menambah drive baru: spesifikasikan line reactor/AFE sejak pengadaan — mencegah lebih murah'],
});

/* =====================================================================
   MISI 7 — GENSET STANDBY & ATS
   ===================================================================== */
Object.assign(MISSIONS,{
 genset:{lvl:'JALUR 02 · INDUSTRI & MANUFAKTUR · MISI 7',icon:'🔌',title:'Genset Standby & ATS: Komisioning Backup',strict:true,
  loc:'📍 Pabrik tekstil · Instalasi genset 500 kVA + ATS',
  story:'Dua kali padam PLN bulan lalu = dua batch produksi gagal = manajemen akhirnya membeli asuransi listrik: genset 500 kVA dengan ATS — automatic transfer switch yang berpindah sendiri saat PLN hilang. Hari ini komisioningnya, dan satu hukum tak boleh dilanggar: PLN dan genset TIDAK BOLEH pernah bertemu — interlock adalah nyawa sistem ini.',
  goal:'Sistem backup beroperasi: genset teruji berbeban, ATS berpindah otomatis dengan interlock terverifikasi, dan uji black-building lolos.',
  obj:['Komisioning genset: start manual & uji berbeban','Verifikasi interlock ATS — dua sumber tak boleh bertemu','Uji transfer otomatis: simulasi PLN padam'],
  learn:['ATS memindah beban antar dua sumber dengan interlock mekanik+elektrik: kontaktor PLN & genset mustahil menutup bersamaan — paralel tak sengaja = arus saling serang yang menghancurkan keduanya','Genset standby diuji BERBEBAN (load bank/beban riil) — genset yang hanya dipanaskan tanpa beban menipu: wet stacking & regulator tak teruji','Urutan transfer otomatis: deteksi PLN hilang → tunda singkat (hindari kedip sesaat) → start genset → pindah saat tegangan-frekuensi stabil','Kembali ke PLN lebih sabar: tunda menit-an memastikan PLN benar-benar pulih, lalu genset cooling down sebelum mati — mesin panas yang langsung dibunuh memendekkan umurnya'],
  next:['Pelajari sizing genset: beban starting motor terbesar menentukan','Dalami AMF controller & setting parameter transfernya','Eksplorasi sinkronisasi genset-PLN untuk soft transfer (peralihan tanpa kedip)']},
});
let mgn={};
function buildGenset(){
  freshScene(0xb0bfcc,0x131c26);
  cam={theta:.1,phi:1.17,r:8.5,target:new THREE.Vector3(0,1.5,-.8)};
  const ground=boxT(18,.1,11,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  /* genset */
  mgn.gen=boxT(2.4,1.5,1.1,TEX.metal(),{metalness:.3});mgn.gen.position.set(-4.2,.8,-2);scene.add(mgn.gen);
  actMesh(mgn.gen,'START');
  const knalpot=cyl(.07,.07,.9,0x444444);knalpot.position.set(-5.2,1.9,-2);scene.add(knalpot);
  scene.add(label('GENSET 500 kVA',.8).translateX(-4.2).translateY(1.95).translateZ(-2));
  /* load bank */
  mgn.lb=boxT(1.2,1.0,.9,TEX.metal(),{metalness:.4});mgn.lb.position.set(-1.4,.55,-2.2);scene.add(mgn.lb);
  actMesh(mgn.lb,'BEBAN');
  scene.add(label('LOAD BANK 400 kW',.65,'#5fd4ff').translateX(-1.4).translateY(1.35).translateZ(-2.2));
  /* panel ATS */
  const ats=boxT(1.4,2.0,.5,TEX.metal(),{metalness:.35});ats.position.set(1.6,1.05,-2.3);scene.add(ats);
  ats.add(label('ATS — AUTOMATIC TRANSFER',.7).translateY(1.3));
  mgn.D=makeDisplay(1.1,.8,300,210);
  mgn.D.mesh.position.set(1.6,1.35,-2.04);scene.add(mgn.D.mesh);
  actMesh(mgn.D.mesh,'INTERLOCK');
  mgn.src='PLN';mgn.genOn=false;mgn.kw=0;
  function layar(){
    dispText(mgn.D,['SUMBER: '+mgn.src,
      mgn.genOn?('genset '+mgn.kw+' kW'):'genset standby',
      'interlock: MEKANIK+ELEKTRIK'],
      [mgn.src==='PLN'?'#5fd4ff':'#ffd23f',mgn.genOn?'#46ff8e':'#7d8f84','#8aa3bd']);}
  layar();
  /* tombol simulasi padam */
  mgn.padam=cyl(.12,.12,.09,0xd83a3a);mgn.padam.rotation.x=Math.PI/2;
  mgn.padam.position.set(4.2,1.4,-2.2);scene.add(mgn.padam);
  actMesh(mgn.padam,'PADAM');
  scene.add(label('SIMULASI PLN PADAM',.6,'#ff9d9d').translateX(4.2).translateY(1.8).translateZ(-2.1));
  /* lampu pabrik */
  mgn.lamp=new THREE.Mesh(new THREE.SphereGeometry(.09,12,10),
    new THREE.MeshStandardMaterial({color:0xffd97a,emissive:0xffd97a,emissiveIntensity:.9}));
  mgn.lamp.position.set(4.2,2.8,-2.6);scene.add(mgn.lamp);
  scene.add(label('BEBAN PABRIK',.6).translateX(4.2).translateY(3.2).translateZ(-2.6));
  startSeq([
   {type:'act',aid:'START',done:false,targets:()=>[mgn.gen],
    desc:'Komisioning mesin: START manual genset, periksa parameter (klik genset).',
    why:'Sebelum dipercaya otomatis, ia harus terbukti manual: oli, coolant, solar ✓ — start... 1.500 rpm, 400 V, 50 Hz stabil dalam 8 detik. Mesin sehat. Tapi tegangan tanpa beban itu baru setengah cerita.',
    fx(){mgn.genOn=true;layar();beep(70,1.0,'sawtooth',.08);
      toast('🔧 Start manual ✓ — 400V · 50Hz · 8 detik ke nominal.','ok',2800);}},
   {type:'act',aid:'BEBAN',done:false,targets:()=>[mgn.lb],
    desc:'Uji BERBEBAN: hubungkan load bank bertahap ke 80% (klik load bank).',
    why:'Load bank menyuntik beban resistif murni: 25%... 50%... 80% (400 kW) — frekuensi dip sesaat lalu pulih, regulator tegangan bekerja, suhu & tekanan oli stabil satu jam penuh. Genset yang tak pernah diuji berbeban adalah janji yang belum pernah ditagih.',
    fx(){mgn.kw=400;layar();
      toast('🔥 80% beban 1 jam: freq ✓ volt ✓ suhu ✓ — janji tertagih.','ok',3000);}},
   {type:'act',aid:'INTERLOCK',done:false,targets:()=>[mgn.D.mesh],
    desc:'Hukum tertinggi: verifikasi INTERLOCK ATS (klik panel ATS).',
    why:'Diuji dengan niat jahat: kontaktor PLN ditahan tutup, lalu genset dipaksa masuk — interlock mekanik MENOLAK bergerak, interlock elektrik memutus perintah. Dua lapis, dua-duanya bekerja. Paralel tak sengaja antara dua sumber tak sinkron = ledakan arus yang menghabisi keduanya — dan hari ini itu mustahil.',
    fx(){toast('🔒 Interlock teruji dua lapis — PLN & genset mustahil bertemu.','ok',3000);}},
   {type:'act',aid:'PADAM',done:false,targets:()=>[mgn.padam],
    desc:'Ujian sesungguhnya: SIMULASI PLN PADAM — saksikan ATS bekerja (klik tombol).',
    why:'Breaker PLN dibuka... lampu padam... 3 detik (tunda anti-kedip) → genset start otomatis → 8 detik mencapai nominal → ATS berpindah: lampu MENYALA kembali. Total gelap: 11 detik, tanpa satu tangan manusia pun. Itulah asuransi yang baru saja terbukti polisnya.',
    fx(){mgn.src='GENSET';layar();
      mgn.lamp.material.emissiveIntensity=0;
      setTimeout(()=>{mgn.lamp.material.emissiveIntensity=.9;},1800);
      beep(70,.9,'sawtooth',.08,.6);
      toast('⚡ PLN hilang → 11 detik → pabrik hidup dari genset. OTOMATIS!','ok',3400);sfx.big();}},
   {type:'act',aid:'BALIK',done:false,targets:()=>[mgn.D.mesh],
    desc:'PLN pulih: amati transfer balik yang SABAR (klik panel).',
    why:'PLN kembali... ATS tidak buru-buru: menunggu 5 menit memastikan pulih sungguhan (PLN suka PHP sesaat), pindah balik mulus, lalu genset cooling down 3 menit sebelum tidur — turbo & mesin panas tak boleh dibunuh mendadak. Sistem yang sabar adalah sistem yang berumur panjang.',
    fx(){mgn.src='PLN';mgn.genOn=false;mgn.kw=0;layar();
      toast('🔁 Balik ke PLN + cooldown 3 menit — komisioning TUNTAS.','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Asuransi listrik pabrik aktif!</b> Genset teruji berbeban, interlock mustahil ditembus, dan transfer otomatis 11 detik terbukti. Padam PLN berikutnya hanya akan jadi catatan kecil di log — bukan batch yang gagal.');
    setTimeout(()=>showWin('genset'),2200);});
  const s3g=seq.steps[3],of3g=s3g.fx;s3g.fx=()=>{of3g();mgn.D.mesh.userData.aid='BALIK';};
  say('VOLTA di sini 🔌 Dua padam, dua batch gagal — manajemen membeli <b>genset 500 kVA + ATS</b>. Hukum tertingginya satu: PLN dan genset TIDAK BOLEH bertemu. Komisioning dimulai dari mesin!');
  $('#modTitle').textContent='J02·M7 — Genset Standby & ATS';
  $('#taskHead').textContent='DUA SUMBER TAK BOLEH BERTEMU';}
MISSIONS.genset.build=buildGenset;
Object.assign(REAL,{
 genset:[
  'Uji beban berkala (bulanan 30% / tahunan mendekati penuh) — genset standby mati justru karena jarang bekerja',
  'Solar disirkulasi & diuji kualitas (microbial growth) — tangki diam bertahun adalah sarang masalah',
  'Battery starter genset di-monitoring & diganti terjadwal — penyebab gagal start nomor satu',
  'Dokumentasikan setting AMF (tunda, ambang tegangan) & latih operator membaca alarm-nya'],
});

/* =====================================================================
   MISI 8 — IIoT & OEE: PABRIK YANG BERBICARA DATA
   ===================================================================== */
Object.assign(MISSIONS,{
 iot:{lvl:'JALUR 02 · INDUSTRI & MANUFAKTUR · MISI 8',icon:'📡',title:'IIoT & OEE: Pabrik yang Berbicara Data',strict:false,
  loc:'📍 Pabrik tekstil · Proyek digitalisasi line produksi',
  story:'Rapat produksi selalu sama: "line 2 sering berhenti" — "berapa lama?" — "yaa... sering, Pak." Tak ada angka, hanya perasaan. Proyek barumu mengubah itu: sensor IIoT di tiap mesin, data mengalir real-time, dan satu metrik yang menyatukan semuanya: OEE — overall equipment effectiveness. Pabrik yang tak terukur tak bisa diperbaiki; mulai hari ini, ia bicara data.',
  goal:'Line 2 termonitor real-time: sensor terpasang & tervalidasi, data mengalir ke dashboard OEE, dan temuan pertama (pencuri kapasitas tersembunyi) terbongkar angka.',
  obj:['Pasang sensor status, counter & arus per mesin','Validasi data: sensor vs kenyataan lantai produksi','Baca OEE & bongkar pencuri kapasitas terbesar'],
  learn:['OEE = availability × performance × quality: tiga pencuri kapasitas (berhenti, lambat, cacat) dalam satu angka jujur','Sensor paling sederhana sering paling berharga: status run/stop dari arus motor + counter produk — tak perlu menunggu proyek AI untuk mulai terukur','Data WAJIB divalidasi lapangan: counter yang menghitung dobel membuat seluruh dashboard jadi fiksi yang rapi','Micro-stoppage adalah pencuri paling licin: berhenti 2-3 menit puluhan kali sehari tak pernah masuk laporan manual — sensor menangkap semuanya'],
  next:['Pelajari protokol IIoT (MQTT, OPC-UA) & arsitektur edge-cloud','Hubungkan OEE dengan andon & eskalasi otomatis','Naik ke predictive: data arus yang sama bisa memprediksi gangguan'],},
});
let mit={};
function buildIoT(){
  freshScene(0xb0bfcc,0x131c26);
  cam={theta:.05,phi:1.16,r:8.5,target:new THREE.Vector3(0,1.7,-.8)};
  const Z=room(0x55606a,0xb9bfc6,16,11);
  /* 3 mesin line 2 */
  mit.mesin=[];
  [[-4.2,'TENUN-A'],[-1.2,'TENUN-B'],[1.8,'FINISHING']].forEach((o,i)=>{
    const m=boxT(1.8,1.4,1.1,TEX.metal(),{metalness:.3});m.position.set(o[0],.75,-1.8);scene.add(m);
    mit.mesin.push(m);
    scene.add(label(o[1],.6).translateX(o[0]).translateY(1.8).translateZ(-1.8));});
  actMesh(mit.mesin[1],'SENSOR');
  /* sensor kit */
  const tbl=boxT(1.2,.07,.7,TEX.wood());tbl.position.set(4.2,.95,.4);scene.add(tbl);
  const tleg=boxT(.08,.95,.08,TEX.wood());tleg.position.set(4.2,.47,.4);scene.add(tleg);
  mit.kit=box(.4,.25,.3,0x2a72c8);mit.kit.position.set(4.2,1.12,.4);scene.add(mit.kit);
  scene.add(label('KIT: CT + COUNTER + GATEWAY',.55,'#5fd4ff').translateX(4.2).translateY(1.5).translateZ(.4));
  /* dashboard OEE */
  const frame=boxT(3.8,2.2,.16,TEX.metal(),{metalness:.4});frame.position.set(4.4,2.6,Z+.05);scene.add(frame);
  frame.add(label('DASHBOARD OEE — LINE 2',.8).translateY(1.35));
  mit.D=makeDisplay(3.5,1.9,540,300);
  mit.D.mesh.position.set(4.4,2.6,Z+.15);scene.add(mit.D.mesh);
  actMesh(mit.D.mesh,'OEE');
  function dash(mode){
    const g=mit.D.g,W=540,H=300;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='600 15px Consolas';g.textAlign='left';
    if(mode===0){g.fillStyle='#5d748c';g.font='700 17px Consolas';
      g.fillText('menunggu data sensor…',24,H/2);}
    else{
      g.fillStyle='#5fd4ff';g.font='700 18px Consolas';
      g.fillText('OEE LINE 2 (minggu ini)',18,30);
      const bars=[['Availability','71%','#ff8d3a'],['Performance','84%','#ffd23f'],['Quality','97%','#46ff8e']];
      bars.forEach((b,i)=>{const y=68+i*44;
        g.fillStyle='#8aa3bd';g.font='600 15px Consolas';g.fillText(b[0],18,y);
        g.fillStyle=b[2];g.fillRect(150,y-15,parseInt(b[1])*2.6,22);
        g.fillText(b[1],160+parseInt(b[1])*2.6,y);});
      g.fillStyle='#ff5a5a';g.font='800 30px Consolas';
      g.fillText('OEE 58%',18,H-60);
      g.fillStyle='#8aa3bd';g.font='600 14px Consolas';
      g.fillText(mode>=2?'pencuri #1: micro-stop TENUN-B (212x ≈ 9 jam/mgg!)':'dunia kelas: 85% — banyak ruang',18,H-28);}
    mit.D.tex.needsUpdate=true;}
  dash(0);
  /* tablet validasi */
  mit.tab=box(.3,.42,.05,0x18242f);mit.tab.position.set(-2.8,1.1,.6);scene.add(mit.tab);
  actMesh(mit.tab,'VALID');
  scene.add(label('TABLET VALIDASI',.55,'#5fd4ff').translateX(-2.8).translateY(1.55).translateZ(.6));
  startSeq([
   {type:'act',aid:'SENSOR',done:false,targets:()=>[mit.mesin[1]],
    desc:'Pasang SENSOR di tiap mesin: status, counter, arus (klik mesin).',
    why:'Tanpa membedah PLC mesin tua: CT clamp di motor utama (run/stop & beban dari pola arus), sensor proximity menghitung produk lewat, gateway mengirim via MQTT tiap 5 detik. Retrofit yang sopan — mesin 15 tahun pun bisa diajari bicara tanpa operasi besar.',
    fx(){toast('📡 3 mesin tersensor: status + counter + arus → gateway.','ok',3000);}},
   {type:'act',aid:'VALID',done:false,targets:()=>[mit.tab],
    desc:'VALIDASI: cocokkan data sensor vs kenyataan 2 jam (klik tablet).',
    why:'Dua jam berdiri di lantai mencocokkan: counter FINISHING menghitung dobel saat kain bergetar — bracket digeser, beres. Status TENUN-A telat 40 detik — threshold arus ditala. Ritual membosankan yang menentukan segalanya: dashboard dari data kotor lebih berbahaya dari tak ada dashboard.',
    fx(){toast('✅ 2 koreksi (dobel & telat) — data kini = kenyataan.','ok',3000);}},
   {type:'act',aid:'OEE',done:false,targets:()=>[mit.D.mesh],
    desc:'Seminggu mengalir: baca OEE pertama line 2 (klik dashboard).',
    why:'Availability 71% × performance 84% × quality 97% = OEE 58% — dunia kelas itu 85%. Angka yang menyakitkan tapi MEMBEBASKAN: untuk pertama kalinya rapat produksi punya fakta yang sama. "Sering berhenti, Pak" kini punya pengganti: tujuh puluh satu persen.',
    fx(){dash(1);toast('📊 OEE perdana: 58% — kini rapat bicara angka.','ok',3000);}},
   {type:'act',aid:'BONGKAR',done:false,targets:()=>[mit.D.mesh],
    desc:'Drill down: BONGKAR pencuri kapasitas terbesar (klik dashboard).',
    why:'Pareto downtime: bukan breakdown besar yang sesekali — melainkan micro-stop TENUN-B: 212 kali × 2,5 menit = 9 JAM seminggu, tak pernah tercatat laporan manual karena "cuma sebentar". Penyebab: benang putus di stasiun 4. Satu perbaikan tension guide ≈ +6 poin OEE. Pencuri paling licin selalu yang mengaku "cuma sebentar".',
    fx(){dash(2);toast('🕵️ Micro-stop 212x = 9 jam/mgg — pencuri tertangkap angka!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Pabrik mulai bicara data!</b> Sensor sederhana, validasi jujur, OEE yang menyakitkan tapi membebaskan, dan pencuri 9 jam seminggu yang akhirnya tertangkap. Digitalisasi bukan soal teknologi mewah — soal berhenti menebak.');
    setTimeout(()=>showWin('iot'),2200);});
  const s2i=seq.steps[2],of2i=s2i.fx;s2i.fx=()=>{of2i();mit.D.mesh.userData.aid='BONGKAR';};
  say('VOLTA di sini 📡 Rapat produksi tanpa angka adalah debat perasaan. Proyek hari ini: <b>sensor IIoT + satu metrik sakti bernama OEE</b>. Pasang, validasi, lalu biarkan angka membongkar pencurinya. Mulai!');
  $('#modTitle').textContent='J02·M8 — IIoT & OEE';
  $('#taskHead').textContent='YANG TAK TERUKUR TAK TERPERBAIKI';}
MISSIONS.iot.build=buildIoT;
Object.assign(REAL,{
 iot:[
  'Mulai dari 1 line pilot & metrik sederhana — proyek IIoT gagal paling sering karena terlalu rakus scope',
  'Definisikan OEE secara tertulis (apa masuk planned downtime?) — beda definisi antar shift = perang angka',
  'Pisahkan jaringan OT dari IT (VLAN/firewall) sejak hari pertama — sensor murah jangan jadi pintu peretas',
  'Tampilkan OEE di lantai produksi (layar andon) — data yang disembunyikan di kantor tak mengubah perilaku'],
});
