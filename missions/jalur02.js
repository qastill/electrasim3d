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
