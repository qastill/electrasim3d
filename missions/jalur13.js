/* =====================================================================
   ElectraSim VR 3D — WASTE TO ENERGY
   Misi: M1 wte (Operasi PLTSa (Insinerasi)) · M2 abu (Mass Balance & Pengelolaan Abu)
   Dimuat on-demand oleh index.html lewat ensureMission().
   ===================================================================== */

Object.assign(MISSIONS,{
 wte:{lvl:'JALUR 13 · WASTE TO ENERGY',icon:'♻️',title:'Operasi PLTSa (Insinerasi)',strict:true,
  loc:'📍 PLTSa kapasitas 8 ton/jam · Shift pagi',
  story:'Truk sampah kota sudah mengantre sejak subuh. Kamu operator PLTSa: hari ini mengawal sampah dari jembatan timbang sampai menjadi listrik 1,2 MW — dengan satu angka keramat yang tak boleh dilanggar: suhu ruang bakar minimal 850°C, karena di bawah itu dioksin beracun lolos ke udara kota.',
  goal:'Jalankan rantai operasi lengkap: timbang → umpan → bakar ≥850°C → uap → listrik → emisi memenuhi baku mutu.',
  obj:['Timbang & catat sampah masuk (mass balance)','Operasikan crane & insinerator pada suhu aman','Produksi listrik & verifikasi sistem kontrol emisi'],
  learn:['Suhu ≥850°C (≥2 detik) menguraikan dioksin & furan — angka keramat insinerasi','Mass balance harian: input sampah vs output listrik, abu & emisi','Energi sampah ±8-10 MJ/kg: 8 ton/jam ≈ 1-1,5 MW listrik netto','Scrubber + filter menangkap gas asam & partikulat sebelum cerobong'],
  next:['Bandingkan teknologi: insinerasi vs gasifikasi vs landfill gas','Pelajari pengelolaan fly ash & bottom ash (limbah B3)','Hitung kelayakan PLTSa: tipping fee + jual listrik']},
 abu:{lvl:'JALUR 13 · WASTE TO ENERGY · MISI 2',icon:'🧪',title:'Mass Balance & Pengelolaan Abu',strict:false,
  loc:'📍 PLTSa · Area penanganan abu, akhir shift',
  story:'Listrik sudah mengalir, tapi pekerjaan PLTSa belum selesai: 8 ton sampah pagi tadi kini menjadi abu — dan abu punya aturan mainnya sendiri. Bottom ash relatif jinak; fly ash dari filter adalah limbah B3 yang setiap gramnya harus tercatat sampai ke "kuburannya".',
  goal:'Abu terkelola sesuai aturan: tertimbang, fly ash terkemas B3 + manifest, dan mass balance harian seimbang.',
  obj:['Timbang & catat bottom ash','Kemas fly ash sebagai limbah B3 + uji karakteristik','Manifest elektronik & tutup mass balance harian'],
  learn:['Bottom ash (±20% massa) bisa dimanfaatkan setelah uji; fly ash (±3%) = B3 karena logam berat & dioksin terkonsentrasi','Uji TCLP menentukan apakah abu melepaskan kontaminan — dasar klasifikasi pengelolaan','Manifest elektronik (festronik) melacak B3 dari penghasil sampai pengolah berizin — rantai putus = pidana','Mass balance harian: input = listrik + abu + emisi + air. Selisih besar = ada yang tak tercatat'],
  next:['Pelajari pemanfaatan bottom ash untuk bahan konstruksi','Dalami regulasi limbah B3 (PP 22/2021)','Hitung neraca energi: MJ sampah → kWh netto']},
});

/* =====================================================================
   MISI 15 — PLTSa / WtE (Jalur 13)
   ===================================================================== */
let mwt={};
function buildWtE(){
  freshScene(0xa8b8a8,0x101a14);
  cam={theta:.2,phi:1.2,r:11,target:new THREE.Vector3(0,2,-1)};
  const ground=box(26,.1,14,0x4a524c);ground.position.y=-.05;scene.add(ground);

  /* jembatan timbang */
  mwt.scale=box(2.6,.12,1.6,0x6a7a6a);mwt.scale.position.set(-8.5,.08,1.2);scene.add(mwt.scale);
  actMesh(mwt.scale,'TIMBANG');
  scene.add(label('JEMBATAN TIMBANG',.7,'#5fd4ff').translateX(-8.5).translateY(.7).translateZ(1.2));
  /* bunker + crane */
  const bunker=box(2.6,1.8,2.2,0x5a665e);bunker.position.set(-5.0,.9,-1.6);scene.add(bunker);
  const trash=box(2.2,.5,1.8,0x7a6a4a);trash.position.set(-5.0,1.5,-1.6);scene.add(trash);
  scene.add(label('BUNKER SAMPAH',.7).translateX(-5.0).translateY(2.3).translateZ(-1.6));
  const ctow=box(.2,3.2,.2,0x8a8a8a);ctow.position.set(-3.2,1.6,-1.6);scene.add(ctow);
  mwt.crane=box(1.8,.15,.15,0xcc8830);mwt.crane.position.set(-4.0,3.1,-1.6);scene.add(mwt.crane);
  const grab=box(.35,.4,.35,0x666666);grab.position.set(-4.8,2.6,-1.6);scene.add(grab);
  actMesh(mwt.crane,'CRANE'); actMesh(grab,'CRANE');
  scene.add(label('CRANE',.6,'#5fd4ff').translateX(-4.0).translateY(3.5).translateZ(-1.6));
  /* insinerator + display suhu */
  mwt.furn=box(2.6,2.6,2.2,0x8a5a3a);mwt.furn.position.set(-.4,1.3,-1.8);scene.add(mwt.furn);
  actMesh(mwt.furn,'BURN');
  scene.add(label('INSINERATOR',.8).translateX(-.4).translateY(2.95).translateZ(-1.8));
  mwt.D=makeDisplay(1.3,.55,300,130);
  mwt.D.mesh.position.set(-.4,1.6,-.68);scene.add(mwt.D.mesh);
  dispText(mwt.D,['120 °C','STANDBY'],['#7d8f84','#7d8f84']);
  /* boiler-turbin-generator */
  mwt.turb=cyl(.5,.6,1.8,0x9aa7b4);mwt.turb.rotation.z=Math.PI/2;
  mwt.turb.position.set(2.8,1.1,-1.8);scene.add(mwt.turb);
  actMesh(mwt.turb,'STEAM');
  scene.add(label('TURBIN-GEN 1,2 MW',.7,'#5fd4ff').translateX(2.8).translateY(1.95).translateZ(-1.8));
  /* scrubber + cerobong */
  mwt.scrub=box(.9,2.2,.9,0x7a8a9a);mwt.scrub.position.set(5.4,1.1,-1.8);scene.add(mwt.scrub);
  actMesh(mwt.scrub,'SCRUB');
  const stack=cyl(.22,.3,3.4,0xb8b0a8);stack.position.set(6.6,1.7,-1.8);scene.add(stack);
  scene.add(label('SCRUBBER+FILTER',.65,'#5fd4ff').translateX(5.4).translateY(2.5).translateZ(-1.8));

  mwt.temp=120;mwt.burn=false;
  moduleTick=(dt)=>{if(mwt.burn&&mwt.temp<880){mwt.temp+=dt*140;
    dispText(mwt.D,[Math.round(mwt.temp)+' °C',mwt.temp>=850?'≥850 AMAN ✓':'PEMANASAN'],
      [mwt.temp>=850?'#46ff8e':'#ffd23f',mwt.temp>=850?'#46ff8e':'#7d8f84']);}};

  startSeq([
   {type:'act',aid:'TIMBANG',done:false,targets:()=>[mwt.scale],
    desc:'Timbang truk sampah masuk (klik jembatan timbang).',
    why:'Mass balance dimulai di sini: tiap kg yang masuk harus terlacak menjadi listrik, abu, atau emisi. Tanpa timbangan, tak ada akuntabilitas operasi.',
    fx(){toast('⚖️ Tercatat: 8,2 ton sampah kota.','ok',2200);}},
   {type:'act',aid:'CRANE',done:false,targets:()=>[mwt.crane],
    desc:'Operasikan CRANE — umpan sampah ke hopper (klik crane).',
    why:'Operator crane juga "koki": mengaduk sampah di bunker agar kadar air merata. Sampah basah tak merata = suhu pembakaran naik-turun liar.',
    fx(){toast('🏗️ Sampah teraduk & terumpan ke hopper.','ok',2200);}},
   {type:'act',aid:'BURN',done:false,targets:()=>[mwt.furn],
    desc:'Nyalakan INSINERATOR — kawal suhu naik melewati 850°C.',
    why:'Angka keramat: ≥850°C selama ≥2 detik menguraikan dioksin & furan. Di bawah itu, racun lolos ke udara kota. Burner bantu menjaga suhu saat sampah terlalu basah.',
    fx(){mwt.burn=true;mwt.furn.material.emissive=new THREE.Color(0x662200);
      mwt.furn.material.emissiveIntensity=.5;
      toast('🔥 Pembakaran dimulai — suhu menanjak...','ok',2600);}},
   {type:'act',aid:'STEAM',done:false,targets:()=>[mwt.turb],
    check:()=>mwt.temp>=850,
    checkFail:'Suhu belum 850°C! Menyalurkan uap sekarang = pembakaran tak sempurna. Tunggu display hijau.',
    desc:'Setelah suhu ≥850°C: alirkan uap ke TURBIN (klik turbin).',
    why:'Panas → boiler → uap → turbin → 1,2 MW listrik. Dari gunungan masalah kota menjadi energi — tapi hanya jika suhunya benar.',
    fx(){toast('⚡ Turbin berputar — 1,2 MW mengalir ke jaringan!','ok',2600);sfx.big();}},
   {type:'act',aid:'SCRUB',done:false,targets:()=>[mwt.scrub],
    desc:'Verifikasi sistem kontrol emisi (klik SCRUBBER).',
    why:'Scrubber menetralkan gas asam (HCl, SOx), filter menangkap partikulat & logam berat. CEMS memantau cerobong real-time — PLTSa modern hidup-mati oleh data emisinya.',
    fx(){toast('🌫️ Emisi cerobong: memenuhi baku mutu ✓','ok',2600);}},
  ],()=>{say('🎉 <b>Shift sempurna!</b> 8 ton masalah kota → 1,2 MW listrik, dengan dioksin terurai & emisi terjaga. Begitulah sampah pensiun dengan terhormat.');
    setTimeout(()=>showWin('wte'),2200);});

  say('VOLTA di sini ♻️ Selamat datang di PLTSa. Satu angka yang menentukan apakah fasilitas ini pahlawan atau masalah: <b>850°C</b>. Kawal suhu itu — dan jangan alirkan uap sebelum tercapai!');
  $('#modTitle').textContent='J13 — Operasi PLTSa';
  $('#taskHead').textContent='SAMPAH → 850°C → LISTRIK';}

/* =====================================================================
   MISI 30 — PENGELOLAAN ABU PLTSa (Jalur 13 · Misi 2)
   ===================================================================== */
let mab={};
function buildAbu(){
  freshScene(0xa8b8a8,0x101a14);
  cam={theta:.1,phi:1.2,r:9,target:new THREE.Vector3(0,1.5,-.8)};
  const ground=boxT(22,.1,13,TEX.gravel());ground.position.y=-.05;scene.add(ground);
  /* timbangan + tumpukan bottom ash */
  mab.scale=boxT(2.2,.12,1.4,TEX.metal(),{metalness:.4});mab.scale.position.set(-6.0,.08,.6);scene.add(mab.scale);
  actMesh(mab.scale,'BOTTOM');
  const pile=new THREE.Mesh(new THREE.ConeGeometry(.8,.7,18),
    new THREE.MeshStandardMaterial({color:0x6a655c,roughness:.95}));
  pile.position.set(-6.0,.5,.6);scene.add(pile);
  actMesh(pile,'BOTTOM');
  scene.add(label('BOTTOM ASH + TIMBANGAN',.7,'#5fd4ff').translateX(-6.0).translateY(1.4).translateZ(.6));
  /* drum B3 fly ash */
  mab.drum=cyl(.45,.45,1.0,0xd8b020);mab.drum.position.set(-2.6,.55,-.8);scene.add(mab.drum);
  const dlid=cyl(.46,.46,.06,0x2d2d2d);dlid.position.set(-2.6,1.08,-.8);scene.add(dlid);
  actMesh(mab.drum,'FLY');
  scene.add(label('DRUM B3 — FLY ASH ☣',.7,'#ffd23f').translateX(-2.6).translateY(1.55).translateZ(-.8));
  /* filter housing latar */
  const filt=boxT(1.6,2.4,1.2,TEX.metal(),{metalness:.3});filt.position.set(-2.6,1.2,-3.4);scene.add(filt);
  scene.add(label('BAG FILTER',.7).translateX(-2.6).translateY(2.75).translateZ(-3.4));
  /* lab kit */
  const tbl=boxT(1.6,.07,.8,TEX.wood());tbl.position.set(1.0,.95,.4);scene.add(tbl);
  const tleg=boxT(.08,.95,.08,TEX.wood());tleg.position.set(1.0,.47,.4);scene.add(tleg);
  mab.lab=box(.4,.3,.3,0xe8edf2);mab.lab.position.set(1.0,1.14,.4);scene.add(mab.lab);
  actMesh(mab.lab,'UJI');
  scene.add(label('LAB KIT — TCLP',.6,'#5fd4ff').translateX(1.0).translateY(1.5).translateZ(.4));
  /* tablet manifest */
  mab.tab=box(.34,.5,.04,0x18242f);mab.tab.position.set(3.0,1.5,-1.0);scene.add(mab.tab);
  actMesh(mab.tab,'MANIFEST');
  scene.add(label('FESTRONIK',.6,'#5fd4ff').translateX(3.0).translateY(1.95).translateZ(-1.0));
  /* display mass balance */
  mab.D=makeDisplay(1.8,1.0,400,220);
  mab.D.mesh.position.set(5.6,1.8,-1.6);mab.D.mesh.rotation.y=-.3;scene.add(mab.D.mesh);
  dispText(mab.D,['MASS BALANCE','input 8,2 t · output ?'],['#5fd4ff','#7d8f84']);
  actMesh(mab.D.mesh,'CALC');
  const pole=cyl(.04,.04,1.3,0x666666);pole.position.set(5.6,.65,-1.6);scene.add(pole);

  startSeq([
   {type:'act',aid:'BOTTOM',done:false,targets:()=>[mab.scale],
    desc:'Timbang BOTTOM ASH dari ruang bakar (klik timbangan).',
    why:'8,2 ton sampah menyisakan ±20% bottom ash. Hasil timbang 1,64 t — angka pertama neraca massa. Bottom ash relatif inert; setelah uji bisa jadi agregat jalan.',
    fx(){toast('⚖️ Bottom ash: 1,64 t tercatat.','ok',2400);}},
   {type:'act',aid:'FLY',done:false,targets:()=>[mab.drum],
    desc:'Kemas FLY ASH dari bag filter ke DRUM B3 (klik drum).',
    why:'Fly ash hanya ±3% massa tapi paling berbahaya: logam berat & sisa dioksin terkonsentrasi di partikel halusnya. Wajib kemasan tertutup berlabel B3 + simbol & nomor — tak ada pengecualian.',
    fx(){toast('☣ Fly ash 0,25 t terkemas — label B3 + simbol terpasang.','ok',2800);}},
   {type:'act',aid:'UJI',done:false,targets:()=>[mab.lab],
    desc:'Ambil sampel & jalankan UJI karakteristik (klik lab kit).',
    why:'Uji TCLP menjawab: apakah abu MELEPASKAN kontaminan saat terkena air? Bottom ash lolos = boleh dimanfaatkan; fly ash melebihi baku = tetap jalur B3 ke pengolah berizin.',
    fx(){toast('🧪 TCLP: bottom ash LOLOS (pemanfaatan) · fly ash = B3.','ok',3000);}},
   {type:'act',aid:'MANIFEST',done:false,targets:()=>[mab.tab],
    desc:'Isi MANIFEST elektronik (festronik) untuk fly ash.',
    why:'Festronik melacak B3 dari penghasil → transporter → pengolah berizin, real-time ke KLHK. Drum tanpa manifest = limbah "hantu" — dan pidana bagi penghasilnya.',
    fx(){toast('📲 Manifest terbit: drum F-2206 → PT pengolah berizin, besok 09:00.','ok',3000);}},
   {type:'act',aid:'CALC',done:false,targets:()=>[mab.D.mesh],
    desc:'Tutup shift: hitung MASS BALANCE harian (klik papan).',
    why:'8,2 t masuk = 1,2 MW×jam listrik + 1,64 t bottom + 0,25 t fly + uap air & gas bersih. Neraca seimbang = operasi jujur; selisih besar = ada yang lolos tak tercatat — alarm bagi auditor.',
    fx(){dispText(mab.D,['BALANCE ✓','8,2t → 6,3MWh + 1,89t abu'],['#46ff8e','#eaf2fb']);
      toast('🧮 Mass balance seimbang — shift resmi ditutup.','ok',3000);sfx.big();}},
  ],()=>{say('🎉 <b>Shift tuntas sampai gram terakhir!</b> Listrik mengalir, abu tercatat, B3 termanifest. PLTSa yang baik dinilai bukan saat sampah masuk — tapi saat abunya keluar.');
    setTimeout(()=>showWin('abu'),2200);});

  say('VOLTA di sini 🧪 Listrik sudah dijual, tapi PLTSa belum selesai: <b>abu punya hukumnya sendiri</b>. Bottom ash ditimbang, fly ash diperlakukan sebagai B3 — dan semuanya harus seimbang di neraca. Mulai dari timbangan.');
  $('#modTitle').textContent='J13·M2 — Mass Balance & Pengelolaan Abu';
  $('#taskHead').textContent='TIMBANG · KEMAS · MANIFEST';}

MISSIONS.wte.build=buildWtE;
MISSIONS.abu.build=buildAbu;

Object.assign(REAL,{
 wte:[
  'Regulasi insinerasi: suhu ≥850°C dengan waktu tinggal gas ≥2 detik — pantau & rekam terus-menerus',
  'CEMS (Continuous Emission Monitoring System) online ke regulator untuk parameter cerobong',
  'Fly ash & bottom ash dikelola sebagai limbah sesuai ketentuan (uji karakteristik, manifest)',
  'Mass balance harian: ton masuk vs kWh keluar vs abu — KPI utama operasi PLTSa'],
 abu:[
  'Pengelolaan fly ash mengikuti regulasi B3 (PP 22/2021): kemasan, simbol, TPS berizin, manifest',
  'Uji karakteristik dilakukan laboratorium terakreditasi — bukan uji kira-kira di lapangan',
  'Pekerja penanganan abu wajib APD pernapasan (respirator) — partikel halus adalah bahayanya',
  'Rekonsiliasi neraca massa bulanan dengan log timbangan & faktur pengangkutan B3'],
});

/* =====================================================================
   MISI 3 — GANGGUAN OPERASI: SUHU DROP & EMISI NAIK
   ===================================================================== */
Object.assign(MISSIONS,{
 cems:{lvl:'JALUR 13 · WASTE TO ENERGY · MISI 3',icon:'📟',title:'Gangguan Operasi: Suhu Drop, Emisi Naik',strict:true,
  loc:'📍 PLTSa · Musim hujan, shift siang 13:15',
  story:'Musim hujan mengirim musuh lama PLTSa: sampah basah kuyup. Suhu ruang bakar merosot ke 790°C, CEMS mulai berkedip — CO naik, tanda pembakaran tak sempurna. Di bawah 850°C, dioksin tidak terurai. Kamu punya beberapa menit untuk mengembalikan angka keramat itu, atau unit harus diturunkan bebannya.',
  goal:'Suhu kembali di atas 850°C dan CEMS normal — lewat burner bantu, pengaturan udara, dan pengadukan sampah yang benar.',
  obj:['Baca alarm CEMS & diagnosa penyebab','Nyalakan burner bantu & atur udara pembakaran','Aduk umpan basah-kering & verifikasi pemulihan'],
  learn:['Sampah basah menyerap panas untuk menguapkan airnya dulu — nilai kalor anjlok, suhu ikut anjlok','CO tinggi = pembakaran tak sempurna; ia muncul SEBELUM dioksin lolos — alarm dini yang harus dihormati','Burner bantu (solar/gas) adalah jaring pengaman suhu: biaya bahan bakar < denda emisi + reputasi','Pencampuran umpan basah:kering di bunker adalah resep koki insinerasi — crane operator menentukan'],
  next:['Pelajari pengeringan sampah: bunker management & waste drying','Dalami parameter CEMS lain: SO2, NOx, HCl, partikulat, dioksin sampling','Eksplorasi kontrol otomatis suhu (burner & udara) berbasis PID']},
});
let mcm={};
function buildCEMS(){
  freshScene(0x5a6a78,0x0d141a); /* mendung gelap */
  cam={theta:.15,phi:1.2,r:10,target:new THREE.Vector3(0,2,-1)};
  const ground=boxT(24,.1,14,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  /* bunker + crane */
  const bunker=boxT(2.6,1.8,2.2,TEX.metal(),{metalness:.25});bunker.position.set(-6.0,.9,-1.6);scene.add(bunker);
  const basah=box(1.1,.5,1.8,0x4a4438);basah.position.set(-6.5,1.5,-1.6);scene.add(basah);
  const kering=box(1.1,.5,1.8,0x7a6a4a);kering.position.set(-5.4,1.5,-1.6);scene.add(kering);
  scene.add(label('BUNKER: BASAH | KERING',.65).translateX(-6.0).translateY(2.3).translateZ(-1.6));
  const ctow=box(.2,3.2,.2,0x8a8a8a);ctow.position.set(-4.2,1.6,-1.6);scene.add(ctow);
  mcm.crane=box(1.8,.15,.15,0xcc8830);mcm.crane.position.set(-5.0,3.1,-1.6);scene.add(mcm.crane);
  actMesh(mcm.crane,'ADUK');
  scene.add(label('CRANE',.6,'#5fd4ff').translateX(-5.0).translateY(3.5).translateZ(-1.6));
  /* insinerator + burner */
  mcm.furn=boxT(2.6,2.6,2.2,TEX.metal(),{metalness:.2});mcm.furn.position.set(-.8,1.3,-1.8);scene.add(mcm.furn);
  mcm.furn.material.emissive=new THREE.Color(0x331100);mcm.furn.material.emissiveIntensity=.4;
  scene.add(label('INSINERATOR',.8).translateX(-.8).translateY(2.95).translateZ(-1.8));
  mcm.burner=cyl(.16,.2,.7,0xd83a3a);mcm.burner.rotation.z=Math.PI/2;
  mcm.burner.position.set(-2.3,1.0,-1.0);scene.add(mcm.burner);
  actMesh(mcm.burner,'BURNER');
  scene.add(label('BURNER BANTU',.6,'#5fd4ff').translateX(-2.5).translateY(.65).translateZ(-.8));
  /* damper udara */
  mcm.damper=box(.5,.4,.16,0x8a96a2);mcm.damper.position.set(.8,1.9,-.66);scene.add(mcm.damper);
  actMesh(mcm.damper,'UDARA');
  scene.add(label('DAMPER UDARA SEKUNDER',.55,'#5fd4ff').translateX(.8).translateY(2.4).translateZ(-.6));
  /* layar CEMS */
  const frame=boxT(2.4,1.7,.16,TEX.metal(),{metalness:.4});frame.position.set(4.0,2.1,-2.9);scene.add(frame);
  frame.add(label('CEMS — EMISI REAL-TIME',.75).translateY(1.1));
  mcm.D=makeDisplay(2.1,1.4,420,280);
  mcm.D.mesh.position.set(4.0,2.1,-2.8);scene.add(mcm.D.mesh);
  actMesh(mcm.D.mesh,'CEK');
  mcm.t=790;mcm.co=210;mcm.burnerOn=false;mcm.airOk=false;mcm.mixed=false;
  function layar(){
    dispText(mcm.D,[Math.round(mcm.t)+'°C · CO '+Math.round(mcm.co),
      mcm.t>=850&&mcm.co<100?'BAKU MUTU ✓':'⚠ DI BAWAH STANDAR'],
      [mcm.t>=850?'#46ff8e':'#ff5a5a',mcm.t>=850&&mcm.co<100?'#46ff8e':'#ffd23f']);}
  layar();
  moduleTick=(dt)=>{
    let target=790;
    if(mcm.burnerOn)target+=35;if(mcm.airOk)target+=15;if(mcm.mixed)target+=25;
    mcm.t+=(target-mcm.t)*dt*.25;
    const coT=mcm.t>=850?(mcm.airOk?45:90):210;
    mcm.co+=(coT-mcm.co)*dt*.25;layar();};
  startSeq([
   {type:'act',aid:'CEK',done:false,targets:()=>[mcm.D.mesh],
    desc:'Baca ALARM CEMS: pahami apa yang terjadi (klik layar).',
    why:'790°C dan CO 210 mg/Nm3 — dua angka yang bercerita satu hal: api kekurangan tenaga karena umpan basah kuyup. CO adalah kenari di tambang: ia berteriak sebelum dioksin lolos.',
    fx(){toast('📟 790°C · CO 210 — pembakaran tak sempurna, bergerak!','bad',2800);}},
   {type:'act',aid:'BURNER',done:false,targets:()=>[mcm.burner],
    desc:'Nyalakan BURNER BANTU — dorong suhu naik (klik burner).',
    why:'Inilah fungsi burner bantu dilahirkan: menyuntik panas saat sampah tak sanggup. Biaya solarnya terasa? Bandingkan dengan dioksin lolos ke kota — burner adalah opsi termurah di ruangan ini.',
    fx(){mcm.burnerOn=true;mcm.furn.material.emissiveIntensity=.8;
      beep(90,.8,'sawtooth',.07);
      toast('🔥 Burner bantu MENYALA — suhu mulai merangkak.','ok',2600);}},
   {type:'act',aid:'UDARA',done:false,targets:()=>[mcm.damper],
    desc:'Atur DAMPER udara sekunder (klik damper).',
    why:'CO tinggi = ada bahan bakar yang tak bertemu oksigen. Udara sekunder menambah turbulensi di atas api — campuran lebih rata, CO terbakar tuntas. Tapi jangan kebablasan: udara berlebih justru mendinginkan ruang bakar.',
    fx(){mcm.airOk=true;
      toast('💨 Udara sekunder +15% — turbulensi naik, CO mulai turun.','ok',2600);}},
   {type:'act',aid:'ADUK',done:false,targets:()=>[mcm.crane],
    desc:'Perintahkan CRANE: aduk umpan basah dengan stok kering (klik crane).',
    why:'Solusi akar masalah: sampah basah dicampur stok kering tandon kemarau dengan rasio 1:1. Burner mengobati gejala; pencampuran mengobati penyebab. Bunker management adalah dapur PLTSa.',
    fx(){mcm.mixed=true;
      toast('🏗️ Umpan campur 1:1 basah-kering mengalir ke hopper.','ok',2600);}},
   {type:'act',aid:'VERIF',done:false,targets:()=>[mcm.D.mesh],
    check:()=>mcm.t>=850&&mcm.co<100,
    checkFail:'Belum pulih! Tunggu suhu menembus 850°C dan CO turun di bawah 100 (lihat layar CEMS).',
    desc:'Saat layar hijau: VERIFIKASI pemulihan di CEMS.',
    why:'862°C · CO 48 — baku mutu kembali dipeluk. Catat kronologi di log: jam alarm, tindakan, waktu pulih. Regulator membaca CEMS-mu online; log inilah ceritamu versi resmi.',
    fx(){toast('✅ 862°C · CO 48 — BAKU MUTU PULIH. Log tercatat.','ok',3000);sfx.big();}},
  ],()=>{say('🎉 <b>Krisis musim hujan terkendali!</b> Burner menambal, udara menyempurnakan, pengadukan menyembuhkan. Operator PLTSa sejati menjaga 850°C seperti menjaga nama baik kotanya.');
    setTimeout(()=>showWin('cems'),2200);});
  const s0=seq.steps[0],of0=s0.fx;s0.fx=()=>{of0();mcm.D.mesh.userData.aid='VERIF';};
  say('VOLTA di sini 📟 Musim hujan menguji PLTSa: <b>sampah basah, suhu 790°C, CO meninggi</b>. Kamu tahu angka keramatnya — 850. Tiga senjata menunggu: burner, udara, dan crane. Mulai dari layar CEMS.');
  $('#modTitle').textContent='J13·M3 — Gangguan Suhu & Emisi';
  $('#taskHead').textContent='KEMBALIKAN 850°C';}
MISSIONS.cems.build=buildCEMS;
Object.assign(REAL,{
 cems:[
  'Di bawah suhu minimum berkepanjangan: SOP umumnya menghentikan umpan sampah, bukan memaksakan',
  'Data CEMS terekam & terkirim online ke regulator — jangan pernah ada pikiran mengakali sensor',
  'Stok sampah kering/RDF disiapkan sebelum musim hujan — mitigasi dimulai dari perencanaan bunker',
  'Kalibrasi berkala CEMS oleh pihak terakreditasi; sensor melenceng = keputusan operasi melenceng'],
});
