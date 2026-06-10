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

/* =====================================================================
   MISI 4 — LINE RDF: SAMPAH JADI BAHAN BAKAR
   ===================================================================== */
Object.assign(MISSIONS,{
 rdf:{lvl:'JALUR 13 · WASTE TO ENERGY · MISI 4',icon:'🧱',title:'Line RDF: Sampah Jadi Bahan Bakar',strict:false,
  loc:'📍 Fasilitas RDF · Kontrak perdana pabrik semen',
  story:'PLTSa-mu kini punya saudara: line RDF (refuse derived fuel) — sampah dipilah, dicacah, dikeringkan menjadi bahan bakar padat untuk tanur semen. Pabrik semen membayar per ton, TAPI dengan spesifikasi galak: kalor minimal 18 MJ/kg, kadar air < 15%, klorin < 0,8%. Hari ini batch perdana menentukan kontrak setahun.',
  goal:'Batch RDF perdana lolos spesifikasi pembeli: pemilahan bersih, cacahan seragam, kering sesuai target, dan uji lab hijau.',
  obj:['Pilah: singkirkan PVC, logam & inert dari umpan','Cacah ke ukuran seragam & keringkan ke target','Uji lab batch & kirim dengan sertifikat analisis'],
  learn:['RDF = sampah yang naik kelas jadi komoditas — dan komoditas tunduk pada spesifikasi, bukan belas kasihan','PVC adalah musuh nomor satu: klorinnya merusak tanur semen & membentuk dioksin — pemilahan PVC menentukan nasib kontrak','Kadar air adalah pencuri kalor: tiap persen air menurunkan nilai bakar — pengeringan adalah pabrik nilai tambah','Nilai kalor 18+ MJ/kg ≈ batubara muda: tanur semen mengganti batubara dengan sampahmu, emisi fosil turun dua pihak'],
  next:['Pelajari co-processing semen: kenapa tanur 1450°C ideal bagi RDF','Dalami neraca bisnis RDF: tipping fee + harga jual vs olah','Eksplorasi SRF kualitas tinggi untuk industri lain']},
});
let mrf={};
function buildRDF(){
  freshScene(0xa8b8a8,0x101a14);
  cam={theta:.15,phi:1.18,r:10,target:new THREE.Vector3(0,1.6,-.8)};
  const ground=boxT(24,.1,13,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  /* umpan sampah */
  const pile=new THREE.Mesh(new THREE.ConeGeometry(1.1,1.0,16),
    new THREE.MeshStandardMaterial({color:0x6a6a52,roughness:.95}));
  pile.position.set(-7.0,.55,-1.6);scene.add(pile);
  scene.add(label('UMPAN SAMPAH KOTA',.7).translateX(-7.0).translateY(1.5).translateZ(-1.6));
  /* stasiun pilah: magnet + manual */
  mrf.sort=boxT(1.8,1.2,1.0,TEX.metal(),{metalness:.3});mrf.sort.position.set(-4.2,.65,-1.6);scene.add(mrf.sort);
  actMesh(mrf.sort,'PILAH');
  const mag=cyl(.3,.3,.5,0x8a3a3a);mag.rotation.z=Math.PI/2;mag.position.set(-4.2,1.7,-1.6);scene.add(mag);
  scene.add(label('PEMILAHAN (magnet+manual+NIR)',.6,'#5fd4ff').translateX(-4.2).translateY(2.3).translateZ(-1.6));
  /* shredder */
  mrf.shred=boxT(1.5,1.4,1.1,TEX.metal(),{metalness:.35});mrf.shred.position.set(-1.4,.75,-1.6);scene.add(mrf.shred);
  actMesh(mrf.shred,'CACAH');
  scene.add(label('SHREDDER',.7,'#5fd4ff').translateX(-1.4).translateY(1.75).translateZ(-1.6));
  /* dryer drum */
  mrf.dry=cyl(.7,.7,2.6,0x8a6a4a,20,{metalness:.2});mrf.dry.rotation.z=Math.PI/2;
  mrf.dry.position.set(1.8,.9,-1.6);scene.add(mrf.dry);
  actMesh(mrf.dry,'KERING');
  scene.add(label('ROTARY DRYER',.7,'#5fd4ff').translateX(1.8).translateY(1.95).translateZ(-1.6));
  /* lab + display */
  mrf.lab=box(.4,.3,.3,0xe8edf2);mrf.lab.position.set(4.4,1.1,-.2);scene.add(mrf.lab);
  actMesh(mrf.lab,'LAB');
  const tbl=boxT(1.2,.07,.7,TEX.wood());tbl.position.set(4.4,.95,-.2);scene.add(tbl);
  const tleg=boxT(.08,.95,.08,TEX.wood());tleg.position.set(4.4,.47,-.2);scene.add(tleg);
  scene.add(label('LAB UJI BATCH',.6,'#5fd4ff').translateX(4.4).translateY(1.55).translateZ(-.2));
  mrf.D=makeDisplay(1.8,1.0,400,220);
  mrf.D.mesh.position.set(4.6,2.4,-2.4);scene.add(mrf.D.mesh);
  dispText(mrf.D,['SPEC PEMBELI','≥18 MJ · ≤15% air · ≤0,8% Cl'],['#ffd23f','#8aa3bd']);
  /* truk kirim */
  const tbody=box(2.2,.9,1.0,0xc8c8c8);tbody.position.set(7.2,.85,-1.4);scene.add(tbody);
  const tcab=box(.8,.7,.95,0x2a6a3a);tcab.position.set(5.9,.75,-1.4);scene.add(tcab);
  [[6.4,-.9],[7.8,-.9],[6.4,-1.9],[7.8,-1.9]].forEach(w=>{
    const wh=cyl(.22,.22,.16,0x14181d);wh.rotation.x=Math.PI/2;
    wh.position.set(w[0],.28,w[1]);scene.add(wh);});
  actMesh(tbody,'KIRIM');
  scene.add(label('TRUK → PABRIK SEMEN',.65).translateX(6.8).translateY(1.7).translateZ(-1.4));
  startSeq([
   {type:'act',aid:'PILAH',done:false,targets:()=>[mrf.sort],
    desc:'Jalankan PEMILAHAN: buang PVC, logam, inert (klik stasiun).',
    why:'Magnet menarik besi, sensor NIR mengenali PVC dari pantulan inframerahnya, tangan terlatih menyapu sisanya. PVC HARUS keluar di sini: klorin yang lolos hari ini menjadi penalti kontrak bulan depan — dan dioksin di tanur orang lain.',
    fx(){toast('🧲 Pilah: −6% logam · −2% PVC · −9% inert → umpan bersih.','ok',2800);}},
   {type:'act',aid:'CACAH',done:false,targets:()=>[mrf.shred],
    desc:'CACAH ke ukuran seragam <50 mm (klik shredder).',
    why:'Tanur semen menyukai keseragaman: potongan 30-50 mm terbakar tuntas mengambang di kiln. Bonus fisika: cacahan kecil = luas permukaan besar = pengeringan lebih cepat di tahap berikutnya. Satu mesin, dua kebaikan.',
    fx(){beep(85,.9,'sawtooth',.08);
      toast('🔪 Cacahan seragam 40 mm — siap masuk dryer.','ok',2600);}},
   {type:'act',aid:'KERING',done:false,targets:()=>[mrf.dry],
    desc:'KERINGKAN di rotary dryer: kejar kadar air <15%.',
    why:'Masuk 38% air, target <15%. Drum berputar pelan, udara panas (dipanaskan sebagian oleh PLTSa sendiri!) menyapu cacahan. Tiap persen air yang menguap = nilai kalor naik — pengeringan bukan biaya, ia pabrik nilai tambah.',
    fx(){toast('♨️ Kadar air 38% → 12% — kalor melonjak naik.','ok',2800);}},
   {type:'act',aid:'LAB',done:false,targets:()=>[mrf.lab],
    desc:'UJI LAB batch perdana: lolos spec? (klik lab kit)',
    why:'Bom kalorimeter & analisis: kalor 19,4 MJ/kg (≥18 ✓) · air 12% (≤15 ✓) · klorin 0,5% (≤0,8 ✓). Tiga lampu hijau — angka yang lahir dari pemilahan yang jujur di hulu. Sertifikat analisis dicetak: paspor batch ini.',
    fx(){dispText(mrf.D,['19,4 MJ · 12% · 0,5%Cl','LOLOS SPEC ✓✓✓'],['#46ff8e','#46ff8e']);
      toast('🧪 LOLOS semua parameter — sertifikat analisis terbit!','ok',3000);}},
   {type:'act',aid:'KIRIM',done:false,targets:()=>[tbody],
    desc:'KIRIM batch perdana ke pabrik semen (klik truk).',
    why:'24 ton RDF berangkat — di tanur 1450°C sana ia menggantikan batubara. Sampah kota yang dulu jadi gunung kini jadi invoice: tipping fee DAN harga jual, dua arah pendapatan dari benda yang semua orang buang.',
    fx(){toast('🚛 24 ton terkirim — kontrak setahun AMAN. Sampah = komoditas!','ok',3200);sfx.big();}},
  ],()=>{say('🎉 <b>Batch perdana lolos!</b> Pilah jujur, cacah seragam, kering disiplin — dan sampah kota resmi naik kelas jadi bahan bakar industri. PLTSa membakar, RDF menjual: dua jurus satu fasilitas.');
    setTimeout(()=>showWin('rdf'),2200);});
  say('VOLTA di sini 🧱 Bisnis baru: <b>mengubah sampah jadi bahan bakar bersertifikat</b>. Pembelinya pabrik semen, dan mereka tidak menerima alasan — hanya spesifikasi. Musuh utamamu bernama PVC. Mulai dari pemilahan!');
  $('#modTitle').textContent='J13·M4 — Line RDF';
  $('#taskHead').textContent='PILAH · CACAH · KERING · LOLOS';}
MISSIONS.rdf.build=buildRDF;
Object.assign(REAL,{
 rdf:[
  'Sampling uji per batch mengikuti standar (komposit, bukan sejumput) — pembeli menguji ulang di tanur',
  'Kontrak memuat formula harga terikat kualitas: bonus kalor tinggi, penalti klorin/air lebih',
  'Debu line RDF mudah terbakar: housekeeping ketat + deteksi panas di shredder & dryer',
  'Jaga konsistensi pasokan: tanur semen benci kejutan kualitas — blending umpan adalah kuncinya'],
});

/* =====================================================================
   MISI 5 — LANDFILL GAS: MENAMBANG METANA TPA
   ===================================================================== */
Object.assign(MISSIONS,{
 biogas:{lvl:'JALUR 13 · WASTE TO ENERGY · MISI 5',icon:'🫧',title:'Landfill Gas: Menambang Metana TPA',strict:true,
  loc:'📍 TPA lama Pecuk · Proyek landfill gas 1 MW',
  story:'TPA lama itu sudah ditutup bertahun-tahun — tapi di perutnya, sampah organik terus mencerna diri menjadi METANA: gas rumah kaca 28 kali lebih ganas dari CO₂, yang selama ini bocor cuma-cuma ke langit. Proyekmu menambangnya: sumur gas, jaringan pipa vakum, lalu genset gas 1 MW. Satu proyek, dua kemenangan: listrik mengalir, metana berhenti lolos.',
  goal:'Sistem landfill gas beroperasi: sumur tertanam, kualitas gas terverifikasi aman, genset menyala — dan flare siaga membakar kelebihan gas.',
  obj:['Tanam sumur vertikal & jaringan pengumpul','Uji kualitas gas: CH₄, O₂, H₂S','Operasikan blower-genset & flare cadangan'],
  learn:['Sampah organik terdekomposisi anaerob → biogas TPA: ±50% metana — energi yang membocorkan dirinya sendiri bila tak ditangkap','O₂ dalam gas TPA adalah alarm ganda: kebocoran sistem & risiko campuran mudah meledak DI DALAM pipa — vakum berlebihan menyedot udara masuk','H₂S harus dipantau: korosif bagi mesin genset & mematikan bagi manusia di konsentrasi rendah','Flare bukan hiasan: saat genset berhenti, metana tetap diproduksi perut TPA — dibakar di flare (jadi CO₂, 28x lebih ringan dampaknya) jauh lebih baik daripada lolos'],
  next:['Pelajari estimasi produksi gas TPA (model first-order decay)','Dalami gas treatment: dehumidifier & penyaring H₂S/siloksan','Eksplorasi kredit karbon dari pembakaran metana — pendapatan ketiga']},
});
let mbg={};
function buildBiogas(){
  freshScene(0x9ab088,0x121a10);
  cam={theta:.15,phi:1.12,r:11,target:new THREE.Vector3(0,1.5,-1)};
  const ground=boxT(26,.1,15,TEX.gravel());ground.position.y=-.05;scene.add(ground);
  /* gundukan TPA tertutup */
  const bukit=new THREE.Mesh(new THREE.SphereGeometry(6,24,16,0,Math.PI*2,0,Math.PI/2),
    new THREE.MeshStandardMaterial({color:0x5a7a4a,roughness:.95}));
  bukit.scale.set(1,.28,.8);bukit.position.set(-3,0,-2);scene.add(bukit);
  scene.add(label('TPA LAMA (ditutup) — pabrik metana alami',.8).translateX(-3).translateY(2.6).translateZ(-2));
  /* sumur gas */
  mbg.sumur=[];
  [[-5.5,-2.5],[-3,-1],[-1,-3]].forEach((o,i)=>{
    const s=cyl(.09,.09,1.4,0x8a96a2);s.position.set(o[0],1.1,o[1]);s.visible=false;scene.add(s);
    mbg.sumur.push(s);});
  mbg.rig=box(.5,.9,.5,0xcc8830);mbg.rig.position.set(-5.5,.6,-2.5);scene.add(mbg.rig);
  actMesh(mbg.rig,'SUMUR');
  scene.add(label('RIG BOR SUMUR GAS',.6,'#5fd4ff').translateX(-5.5).translateY(1.55).translateZ(-2.5));
  /* stasiun blower + analyzer */
  mbg.blow=boxT(1.2,.9,.8,TEX.metal(),{metalness:.35});mbg.blow.position.set(1.8,.5,-1.6);scene.add(mbg.blow);
  scene.add(label('BLOWER STATION',.65).translateX(1.8).translateY(1.25).translateZ(-1.6));
  mbg.ana=box(.3,.4,.2,0xd8b020);mbg.ana.position.set(1.8,1.3,-1.0);scene.add(mbg.ana);
  actMesh(mbg.ana,'GASLAB');
  scene.add(label('GAS ANALYZER',.55,'#5fd4ff').translateX(1.8).translateY(1.8).translateZ(-1.0));
  /* genset gas + display */
  mbg.gen=boxT(2.0,1.3,1.0,TEX.metal(),{metalness:.3});mbg.gen.position.set(4.8,.7,-1.8);scene.add(mbg.gen);
  actMesh(mbg.gen,'GENSET');
  scene.add(label('GENSET GAS 1 MW',.7).translateX(4.8).translateY(1.65).translateZ(-1.8));
  mbg.D=makeDisplay(1.3,.7,300,170);
  mbg.D.mesh.position.set(4.8,2.3,-1.8);scene.add(mbg.D.mesh);
  dispText(mbg.D,['OFFLINE','—'],['#7d8f84','#7d8f84']);
  /* flare */
  mbg.flare=cyl(.14,.18,2.8,0x8a8a8a);mbg.flare.position.set(7.6,1.4,-2.6);scene.add(mbg.flare);
  actMesh(mbg.flare,'FLARE');
  mbg.api=new THREE.Mesh(new THREE.ConeGeometry(.2,.6,10),
    new THREE.MeshStandardMaterial({color:0xff8030,emissive:0x000000,transparent:true,opacity:.85}));
  mbg.api.position.set(7.6,3.1,-2.6);scene.add(mbg.api);
  scene.add(label('FLARE',.6,'#5fd4ff').translateX(7.6).translateY(3.7).translateZ(-2.6));
  startSeq([
   {type:'act',aid:'SUMUR',done:false,targets:()=>[mbg.rig],
    desc:'Bor & tanam SUMUR GAS vertikal + jaringan pengumpul (klik rig).',
    why:'Pipa HDPE berlubang turun ke perut sampah, dikelilingi gravel, dengan kepala sumur ber-valve untuk menyetel hisapan tiap titik. Tiga sumur menjangkau zona gas terkaya — TPA tua ini diperkirakan masih bernafas metana 15 tahun lagi.',
    fx(){mbg.sumur.forEach(s=>s.visible=true);
      toast('🕳️ 3 sumur tertanam + manifold pengumpul tersambung.','ok',2800);}},
   {type:'act',aid:'GASLAB',done:false,targets:()=>[mbg.ana],
    desc:'UJI kualitas gas sebelum apa pun menyala (klik analyzer).',
    why:'CH₄ 52% (bagus, genset mau), O₂ 0,8% (aman — di atas 3% artinya kebocoran menyedot udara & risiko campuran meledak DALAM pipa), H₂S 180 ppm (perlu filter, terpasang). Vakum disetel justru KONSERVATIF: serakah menyedot = mengundang oksigen.',
    fx(){toast('🧪 CH₄ 52% · O₂ 0,8% · H₂S terfilter — gas LAYAK.','ok',3000);}},
   {type:'act',aid:'GENSET',done:false,targets:()=>[mbg.gen],
    desc:'Start BLOWER lalu GENSET GAS — listrik dari perut TPA (klik genset).',
    why:'Blower menarik gas lembut dari manifold, dehumidifier menyaring embun, genset menyalak hidup... 0,9 MW mengalir ke jaringan. Bahan bakarnya: sampah yang dibuang kota ini sepuluh tahun lalu. Masa lalu yang membayar listrik masa kini.',
    fx(){beep(80,1.0,'sawtooth',.08);
      dispText(mbg.D,['0,9 MW','CH₄ 52% · stabil'],['#46ff8e','#46ff8e']);
      toast('⚡ Genset ONLINE 0,9 MW — TPA resmi jadi pembangkit!','ok',3000);}},
   {type:'act',aid:'FLARE',done:false,targets:()=>[mbg.flare],
    desc:'Uji FLARE siaga: simulasi genset berhenti (klik flare).',
    why:'Genset disimulasikan trip — perut TPA tak ikut berhenti memproduksi. Dalam 30 detik flare menyala otomatis: metana terbakar jadi CO₂, dampak iklimnya terpangkas 28 kali. Membakar percuma terdengar sayang — melepas mentah jauh lebih mahal bagi planet.',
    fx(){mbg.api.material.emissive.setHex(0xff8030);mbg.api.material.emissiveIntensity=1;
      toast('🔥 Flare auto-start 28 dtk ✓ — metana tak pernah lolos mentah.','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Tambang metana beroperasi!</b> Gas yang dulu meracuni langit kini menyalakan kota — dan saat genset istirahat, flare berjaga. Satu TPA tua, dua kemenangan iklim, tiga sumber pendapatan. Sampah memang tak pernah benar-benar selesai bercerita.');
    setTimeout(()=>showWin('biogas'),2200);});
  say('VOLTA di sini 🫧 TPA tua itu bukan gunung diam — ia <b>pabrik metana</b> yang bocor ke langit bertahun-tahun. Hari ini kita tambang: sumur, pipa, genset. Dan ingat: O₂ dalam pipa gas adalah alarm paling serius. Mulai mengebor!');
  $('#modTitle').textContent='J13·M5 — Landfill Gas TPA';
  $('#taskHead').textContent='TAMBANG GAS, SELAMATKAN IKLIM';}
MISSIONS.biogas.build=buildBiogas;
Object.assign(REAL,{
 biogas:[
  'Pengeboran di TPA pakai prosedur khusus: gas pocket & amblesan — rig & kru berpengalaman landfill',
  'Pantau O₂ kontinu dengan trip otomatis blower — campuran metana-udara dalam pipa adalah bom',
  'H₂S & siloksan merusak genset: program treatment & analisis oli mesin lebih ketat dari genset biasa',
  'Manfaatkan skema kredit karbon destruksi metana — sering lebih bernilai dari listriknya sendiri'],
});

/* =====================================================================
   MISI 6 — ANAEROBIC DIGESTER: BIOGAS TERKENDALI
   ===================================================================== */
Object.assign(MISSIONS,{
 digester:{lvl:'JALUR 13 · WASTE TO ENERGY · MISI 6',icon:'🍲',title:'Anaerobic Digester: Biogas Terkendali',strict:false,
  loc:'📍 Pasar induk · Digester 20 ton/hari sampah organik',
  story:'Landfill gas mengajarimu menambang metana liar — kini level berikutnya: MEMBUATNYA dengan sengaja. Sampah organik pasar induk (sayur busuk, sisa buah) masuk reaktor anaerob: tangki raksasa berisi triliunan mikroba yang harus dijaga seperti memelihara makhluk hidup — karena memang begitu adanya. pH-nya, suhunya, jadwal makannya: digester adalah peternakan tak kasat mata.',
  goal:'Digester beroperasi stabil: umpan tercampur benar, mikroba terjaga (pH & suhu), gangguan asam tertangani, dan biogas menggerakkan genset plus pupuk cair sebagai bonus.',
  obj:['Siapkan umpan: sortir & rasio campuran','Jaga kondisi mikroba: suhu mesofilik & pH','Tangani gangguan overfeeding & panen ganda'],
  learn:['Digester = peternakan mikroba: bakteri metanogen bekerja TANPA oksigen, mengubah organik menjadi CH₄ 55-65% — lebih kaya dari landfill gas','Suhu mesofilik 35-38°C dijaga stabil: mikroba benci kejutan — perubahan 2°C lebih berbahaya daripada nilai yang sedikit melenceng','Overfeeding adalah penyakit #1: terlalu banyak umpan → asam menumpuk → pH jatuh → metanogen mogok. Obatnya menahan diri, bukan menambah','Digestate (ampas) adalah produk kedua: pupuk organik cair — digester yang baik tak menyisakan limbah, hanya produk'],
  next:['Pelajari rasio C/N umpan & co-digestion (campur kotoran ternak)','Dalami desulfurisasi H₂S sebelum genset','Eksplorasi bio-CNG: memurnikan biogas jadi setara gas alam']},
});
let mdi={};
function buildDigester(){
  freshScene(0x9ab088,0x121a10);
  cam={theta:.1,phi:1.15,r:10,target:new THREE.Vector3(0,1.8,-.8)};
  const ground=boxT(24,.1,14,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  /* digester tank besar + kubah gas */
  const tank=cyl(2.2,2.4,2.8,0x4a6a4a,28,{roughness:.6});tank.position.set(-2,1.4,-2.5);scene.add(tank);
  mdi.dome=new THREE.Mesh(new THREE.SphereGeometry(2.2,24,14,0,Math.PI*2,0,Math.PI/2),
    new THREE.MeshStandardMaterial({color:0x8a96a2,roughness:.5,metalness:.2}));
  mdi.dome.position.set(-2,2.8,-2.5);mdi.dome.scale.set(1,.5,1);scene.add(mdi.dome);
  scene.add(label('DIGESTER 1.200 m³ · 37°C',.9).translateX(-2).translateY(4.4).translateZ(-2.5));
  /* hopper umpan */
  mdi.hop=boxT(1.4,1.0,1.0,TEX.metal(),{metalness:.3});mdi.hop.position.set(-6.2,.55,-1.6);scene.add(mdi.hop);
  actMesh(mdi.hop,'UMPAN');
  scene.add(label('HOPPER UMPAN + SORTIR',.65,'#5fd4ff').translateX(-6.2).translateY(1.4).translateZ(-1.6));
  /* panel kondisi */
  mdi.D=makeDisplay(1.9,1.1,400,230);
  mdi.D.mesh.position.set(1.4,2.4,-3.0);scene.add(mdi.D.mesh);
  actMesh(mdi.D.mesh,'KONDISI');
  scene.add(label('PANEL KONDISI BIOLOGI',.7,'#5fd4ff').translateX(1.4).translateY(3.15).translateZ(-3.0));
  mdi.ph=7.2;mdi.suhu=37;mdi.gas=58;mdi.sakit=false;
  function panel(){
    dispText(mdi.D,['pH '+mdi.ph.toFixed(1)+' · '+mdi.suhu.toFixed(0)+'°C',
      'CH₄ '+mdi.gas.toFixed(0)+'%'+(mdi.sakit?' ⚠ ASAM!':' · sehat')],
      [mdi.sakit?'#ff5a5a':'#46ff8e',mdi.sakit?'#ffd23f':'#8aa3bd']);}
  panel();
  /* genset + pupuk */
  mdi.gen=boxT(1.4,1.0,.9,TEX.metal(),{metalness:.3});mdi.gen.position.set(4.6,.55,-2.2);scene.add(mdi.gen);
  actMesh(mdi.gen,'PANEN');
  scene.add(label('GENSET BIOGAS 250 kW',.65).translateX(4.6).translateY(1.35).translateZ(-2.2));
  mdi.pupuk=cyl(.4,.4,.8,0x6a5a2a);mdi.pupuk.position.set(6.4,.45,-.8);scene.add(mdi.pupuk);
  scene.add(label('DIGESTATE → PUPUK CAIR',.6,'#8df0b8').translateX(6.4).translateY(1.1).translateZ(-.8));
  startSeq([
   {type:'act',aid:'UMPAN',done:false,targets:()=>[mdi.hop],
    desc:'Siapkan UMPAN harian: sortir & atur rasio (klik hopper).',
    why:'Sampah pasar disortir (plastik kresek = musuh pengaduk), dicacah, dicampur air resirkulasi sampai bubur 10% padatan. Jadwal makan mikroba dijaga: 20 ton dibagi merata sepanjang hari — mikroba menyukai rutinitas seperti bayi menyukai jam menyusu.',
    fx(){toast('🥬 Umpan siap: tersortir, tercacah, terjadwal merata.','ok',2800);}},
   {type:'act',aid:'KONDISI',done:false,targets:()=>[mdi.D.mesh],
    desc:'Periksa KONDISI biologi: suhu, pH, kualitas gas (klik panel).',
    why:'37°C stabil (pemanas dari genset sendiri — sirkular!), pH 7,2 netral nyaman, CH₄ 58%: triliunan ternak tak kasat mata sedang bekerja sehat. Operator digester membaca panel ini seperti dokter membaca tanda vital — tiap hari, tanpa absen.',
    fx(){toast('🌡️ 37°C · pH 7,2 · CH₄ 58% — koloni bahagia.','ok',2800);}},
   {type:'act',aid:'KRISIS',done:false,targets:()=>[mdi.D.mesh],
    desc:'Hari ke-40, pasar banjir kiriman: pH mulai TURUN — baca alarmnya.',
    why:'Truk ekstra kemarin menggoda operator menaikkan umpan 30% — dan kini tagihannya: asam lemak menumpuk lebih cepat dari yang bisa dimakan metanogen, pH merosot 6,4, CH₄ anjlok 41%. Digester sedang "masuk angin" — dan penyebabnya klasik: terlalu bersemangat memberi makan.',
    fx(){mdi.sakit=true;mdi.ph=6.4;mdi.gas=41;panel();
      toast('🤢 pH 6,4 · CH₄ 41% — overfeeding! Koloni mogok.','bad',3000);}},
   {type:'act',aid:'OBATI',done:false,targets:()=>[mdi.hop],
    desc:'OBATI dengan benar: puasakan & pulihkan perlahan (klik hopper).',
    why:'Naluri awam: tambah umpan biar gas naik — itu memperparah. Resep yang benar: STOP umpan 2 hari (puasa), resirkulasi diperbanyak, sedikit kapur menyangga pH... hari keempat pH merangkak 7,0, CH₄ pulih 56%. Mikroba memaafkan — asal diberi waktu, bukan dipaksa.',
    fx(){mdi.sakit=false;mdi.ph=7.0;mdi.gas=56;panel();
      toast('💊 Puasa 2 hari + buffer — koloni pulih, pelajaran tercatat.','ok',3200);}},
   {type:'act',aid:'PANEN',done:false,targets:()=>[mdi.gen],
    desc:'PANEN ganda: genset menyala & digestate jadi pupuk (klik genset).',
    why:'Biogas (H₂S tersaring) menggerakkan genset 250 kW — pasar induk kini menyalakan lampunya dengan sayur busuknya sendiri. Dan ampasnya: pupuk organik cair yang diantri petani sekitar. Nol limbah: semua keluaran adalah produk. Ekonomi sirkular bukan jargon di sini — ia neraca harian.',
    fx(){beep(80,1.0,'sawtooth',.08);
      toast('🍲 250 kW dari sampah pasar + pupuk utk petani — panen ganda!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Peternakan mikroba beroperasi!</b> Diberi makan terjadwal, dijaga suhunya, diobati saat masuk angin — dan membayar dengan listrik plus pupuk. Digester yang dirawat seperti makhluk hidup akan bekerja seperti mesin.');
    setTimeout(()=>showWin('digester'),2200);});
  const s1d=seq.steps[1],of1d=s1d.fx;s1d.fx=()=>{of1d();mdi.D.mesh.userData.aid='KRISIS';};
  const s2d=seq.steps[2],of2d=s2d.fx;s2d.fx=()=>{of2d();mdi.hop.userData.aid='OBATI';};
  say('VOLTA di sini 🍲 Level baru dunia sampah: <b>membuat metana dengan sengaja</b>. Reaktor ini berisi triliunan makhluk hidup yang harus dijaga jadwal makan, suhu, dan pH-nya. Dan satu pantangan besar: jangan memberi makan berlebihan!');
  $('#modTitle').textContent='J13·M6 — Anaerobic Digester';
  $('#taskHead').textContent='PETERNAKAN TAK KASAT MATA';}
MISSIONS.digester.build=buildDigester;
Object.assign(REAL,{
 digester:[
  'Pantau rasio FOS/TAC (asam vs buffer) mingguan — indikator dini sebelum pH jatuh',
  'Sortir umpan ketat: plastik & pasir mengendap merusak pengaduk dan menyita volume reaktor',
  'H₂S wajib desulfurisasi sebelum genset — korosi mesin biogas itu cepat dan mahal',
  'Digestate diuji & diizinkan sebagai pupuk sesuai regulasi sebelum diedarkan ke petani'],
});

/* =====================================================================
   MISI 7 — OVERHAUL INSINERATOR: REFRACTORY & GRATE
   ===================================================================== */
Object.assign(MISSIONS,{
 overhaul:{lvl:'JALUR 13 · WASTE TO ENERGY · MISI 7',icon:'🧱',title:'Overhaul Insinerator: Refractory & Grate',strict:true,
  loc:'📍 PLTSa · Annual shutdown 14 hari',
  story:'Setahun penuh ruang bakar itu menelan 850°C tanpa mengeluh — kini giliran ia dirawat. Annual shutdown: 14 hari, satu insinerator dingin, dan daftar pekerjaan yang tak menerima molor (sampah kota tak ikut libur!). Dua pasien utama: REFRACTORY — dinding bata tahan api yang mulai terkikis, dan GRATE — lantai besi bergerak tempat sampah terbakar sambil berjalan.',
  goal:'Overhaul tuntas tepat waktu: pendinginan terkendali, inspeksi menyeluruh terdokumentasi, refractory & grate diperbaiki dengan benar, dan curing dijalani tanpa tergesa.',
  obj:['Cooling down terkendali & isolasi energi total','Inspeksi: petakan kerusakan refractory & keausan grate','Perbaiki, lalu curing pemanasan bertahap'],
  learn:['Pendinginan insinerator diatur gradiennya seperti pemanasannya: refractory yang didinginkan tergesa retak oleh kejut termal — kesabaran dua arah','Masuk ruang bakar = ruang terbatas PLUS: gas sisa, debu abu, suhu — semua izin ruang terbatasmu berlaku ganda di sini','Refractory diperbaiki sesuai peta kerusakan: terkikis tipis cukup patching, area kritis dibongkar-pasang — dan material baru WAJIB curing (pemanasan bertahap mengusir air) sebelum kerja penuh','Grate bar yang aus mengubah aliran udara primer — pembakaran tak rata: penggantian per zona dengan clearance yang diukur, bukan dikira'],
  next:['Pelajari thermal imaging dinding luar untuk deteksi dini refractory tipis','Dalami manajemen shutdown: critical path & koordinasi puluhan pekerjaan','Eksplorasi material refractory generasi baru (umur lebih panjang)']},
});
let mov={};
function buildOverhaul(){
  freshScene(0xa8b8a8,0x101a14);
  cam={theta:.1,phi:1.16,r:9,target:new THREE.Vector3(0,1.7,-.8)};
  const ground=boxT(22,.1,13,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  /* insinerator terbuka (manhole) */
  mov.furn=boxT(3.2,2.8,2.4,TEX.metal(),{metalness:.2});mov.furn.position.set(-2.4,1.4,-2);scene.add(mov.furn);
  const manhole=cyl(.5,.5,.1,0x1a1410,20);manhole.rotation.x=Math.PI/2;
  manhole.position.set(-2.4,1.2,-.78);scene.add(manhole);
  scene.add(label('INSINERATOR — shutdown H-1',.85).translateX(-2.4).translateY(3.1).translateZ(-2));
  actMesh(mov.furn,'COOL');
  /* display suhu */
  mov.D=makeDisplay(1.3,.7,300,170);
  mov.D.mesh.position.set(-2.4,2.2,-.76);scene.add(mov.D.mesh);
  dispText(mov.D,['612 °C','cooling…'],['#ffd23f','#8aa3bd']);
  /* peta kerusakan */
  const frame=boxT(2.8,1.9,.16,TEX.metal(),{metalness:.4});frame.position.set(2.0,2.3,-2.9);scene.add(frame);
  frame.add(label('PETA INSPEKSI',.75).translateY(1.2));
  mov.M=makeDisplay(2.5,1.6,440,280);
  mov.M.mesh.position.set(2.0,2.3,-2.8);scene.add(mov.M.mesh);
  actMesh(mov.M.mesh,'INSPEKSI');
  function petaKerusakan(mode){
    const g=mov.M.g,W=440,H=280;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.strokeStyle='#2a3a4c';g.lineWidth=2;g.strokeRect(40,30,W-80,H-90);
    g.font='600 14px Consolas';g.textAlign='left';
    if(mode>=1){
      g.fillStyle='#ffd23f';g.fillRect(70,60,90,60);g.fillText('aus 30%',74,96);
      g.fillStyle='#ff5a5a';g.fillRect(220,120,110,70);g.fillText('KRITIS 70%',226,160);
      g.fillStyle='#46ff8e';g.fillText('sisa: sehat',60,H-26);
      g.fillStyle='#8aa3bd';g.fillText('grate: 14 bar aus zona pembakaran',150,H-26);}
    else{g.fillStyle='#5d748c';g.fillText('menunggu inspeksi…',60,H/2);}
    mov.M.tex.needsUpdate=true;}
  petaKerusakan(0);
  /* bata & grate bar baru */
  mov.bata=box(.7,.4,.4,0xb86a4a);mov.bata.position.set(5.0,.95,-.8);scene.add(mov.bata);
  actMesh(mov.bata,'PERBAIKI');
  const tbl=boxT(1.6,.07,.8,TEX.wood());tbl.position.set(5.2,.82,-.8);scene.add(tbl);
  const tleg=boxT(.08,.82,.08,TEX.wood());tleg.position.set(5.2,.41,-.8);scene.add(tleg);
  mov.bar=box(.9,.12,.18,0x6a7682,{metalness:.5});mov.bar.position.set(5.7,.95,-.8);scene.add(mov.bar);
  scene.add(label('REFRACTORY + GRATE BAR BARU',.6,'#5fd4ff').translateX(5.3).translateY(1.4).translateZ(-.8));
  startSeq([
   {type:'act',aid:'COOL',done:false,targets:()=>[mov.furn],
    desc:'Mulai COOLING DOWN terkendali + isolasi energi total (klik insinerator).',
    why:'Umpan berhenti, suhu dituntun turun mengikuti kurva — dinding yang setahun hidup di 850°C tak boleh dikagetkan udara dingin: kejut termal meretakkan refractory yang justru mau diselamatkan. Sambil menunggu 3 hari: LOTO total — burner, crane, fan, hidrolik grate: semua energi dikunci.',
    fx(){dispText(mov.D,['82 °C ✓','LOTO 12 titik'],['#46ff8e','#8aa3bd']);
      toast('❄️ 3 hari cooling terkendali + 12 titik LOTO — siap masuk.','ok',3200);}},
   {type:'act',aid:'INSPEKSI',done:false,targets:()=>[mov.M.mesh],
    desc:'Masuk (izin ruang terbatas!) & PETAKAN kerusakan (klik peta).',
    why:'Gas test, ventilasi, attendant — ritual ruang terbatasmu berlaku penuh. Di dalam: dinding dipetakan jengkal demi jengkal dengan palu inspeksi & meteran tebal — satu zona terkikis 30%, satu zona KRITIS tinggal 30% tebal (di seberang burner — selalu di sana), dan 14 grate bar zona pembakaran aus melewati batas. Peta ini adalah seluruh rencana 10 hari ke depan.',
    fx(){petaKerusakan(1);
      toast('🗺️ Terpetakan: 1 zona kritis + 14 grate bar — rencana terkunci.','ok',3200);}},
   {type:'act',aid:'PERBAIKI',done:false,targets:()=>[mov.bata],
    desc:'Eksekusi PERBAIKAN: bongkar-pasang zona kritis & ganti grate (klik bata).',
    why:'Zona kritis dibongkar sampai anchor, dipasang ulang bata demi bata dengan mortar yang tepat & expansion joint yang dihormati (refractory perlu ruang memuai!); zona 30% cukup patching. Grate: 14 bar diganti dengan clearance diukur feeler gauge — celah terlalu rapat macet saat memuai, terlalu longgar membocorkan udara primer.',
    fx(){toast('🧱 Zona kritis terpasang ulang + 14 bar ber-clearance ukur.','ok',3200);}},
   {type:'act',aid:'CURING',done:false,targets:()=>[mov.furn],
    desc:'Pekerjaan terakhir & paling diuji kesabarannya: CURING (klik insinerator).',
    why:'Refractory baru menyimpan air — dipanaskan tergesa, air itu menjadi uap yang MELEDAKKAN bata dari dalam. Kurva curing: 50°C/jam, tahan di 150°C, tahan di 350°C, baru merangkak ke operasi — dua hari penuh menahan diri. Hari ke-14: insinerator menyala kembali, dindingnya muda lagi, dan jadwal ditepati tanpa satu hari molor.',
    fx(){dispText(mov.D,['850 °C ✓','curing tuntas · ONLINE'],['#46ff8e','#46ff8e']);
      toast('🔥 Curing 2 hari tuntas — ONLINE tepat hari ke-14!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Overhaul tepat waktu, tanpa cedera, tanpa retak!</b> Didinginkan dengan sabar, dipetakan dengan teliti, diperbaiki dengan ukuran, dan di-curing dengan menahan diri. Insinerator siap menelan 850°C setahun lagi — karena dua minggu ini tak ada yang tergesa.');
    setTimeout(()=>showWin('overhaul'),2200);});
  const s0o=seq.steps[0],of0o=s0o.fx;s0o.fx=()=>{of0o();mov.furn.userData.aid='CURING';};
  say('VOLTA di sini 🧱 Setahun menelan 850°C — kini giliran insinerator dirawat: <b>annual shutdown 14 hari</b>. Dua pasien: dinding refractory & lantai grate. Dan satu musuh dua arah: kejut termal. Mulai dari pendinginan!');
  $('#modTitle').textContent='J13·M7 — Overhaul Insinerator';
  $('#taskHead').textContent='SABAR DUA ARAH: DINGIN & PANAS';}
MISSIONS.overhaul.build=buildOverhaul;
Object.assign(REAL,{
 overhaul:[
  'Susun critical path shutdown: pekerjaan refractory (curing!) hampir selalu jadi jalur kritisnya',
  'Foto & ukur tebal refractory tiap zona jadi baseline — tren tahunan memprediksi overhaul berikutnya',
  'Material refractory disimpan kering & dipasang oleh aplikator tersertifikasi',
  'Jangan pernah memotong kurva curing demi jadwal — bata meledak menulis ulang seluruh jadwalmu'],
});

/* =====================================================================
   MISI 8 — CMMS: PLTSa YANG INGAT SEGALANYA
   ===================================================================== */
Object.assign(MISSIONS,{
 cmms:{lvl:'JALUR 13 · WASTE TO ENERGY · MISI 8',icon:'🗃️',title:'CMMS: PLTSa yang Ingat Segalanya',strict:false,
  loc:'📍 PLTSa · Proyek digitalisasi pemeliharaan',
  story:'Pak Harun, teknisi paling senior, pensiun bulan depan — dan bersama beliau pergi pula "database" terlengkap PLTSa: ingatannya. Kapan bearing fan terakhir diganti? "Tanya Pak Harun." Riwayat crane? "Pak Harun hafal." Krisis ini melahirkan proyekmu: CMMS — computerized maintenance management system: memindahkan ingatan organisasi dari kepala manusia ke sistem yang tak bisa pensiun.',
  goal:'CMMS hidup & dipakai: aset terdaftar hirarkis, PM terjadwal otomatis, work order mengalir dari lapangan, dan analisis pertama membongkar aset paling rakus biaya.',
  obj:['Bangun register aset & hirarkinya','Migrasi jadwal PM & pengetahuan Pak Harun','Jalankan work order digital & analisis biaya per aset'],
  learn:['CMMS adalah ingatan organisasi: aset, riwayat, suku cadang, jadwal — yang tak tercatat akan terlupa, dan yang terlupa akan rusak mendadak','Hirarki aset (plant→sistem→equipment→komponen) menentukan kualitas analisis: biaya dicatat di level yang bisa ditindaklanjuti','Wawancara purna-bakti adalah migrasi data paling berharga: trik & gejala khas tiap mesin dari kepala senior masuk ke catatan aset — warisan yang tak menguap','Work order menutup siklus: keluhan→perintah→eksekusi→catatan→analisis — dan dari analisis lahir pertanyaan emas: aset mana yang termahal dirawat & layak diganti?'],
  next:['Integrasi CMMS dgn sensor IoT: work order otomatis dari kondisi','Pelajari manajemen suku cadang: min-max & kritikalitas','Dalami reliability engineering: MTBF/MTTR dari data CMMS-mu sendiri']},
});
let mcc={};
function buildCMMS(){
  freshScene(0xa8b8a8,0x101a14);
  cam={theta:.05,phi:1.16,r:8.5,target:new THREE.Vector3(0,1.7,-.8)};
  const Z=room(0x55606a,0xc4cdd6,16,11);
  /* Pak Harun */
  mcc.harun=new THREE.Group();
  const badan=cyl(.22,.28,.9,0x6a5a48);badan.position.y=.72;mcc.harun.add(badan);
  const kepala=new THREE.Mesh(new THREE.SphereGeometry(.15,14,12),
    new THREE.MeshStandardMaterial({color:0xc8a888}));kepala.position.y=1.38;mcc.harun.add(kepala);
  const rambut=new THREE.Mesh(new THREE.SphereGeometry(.155,14,10,0,Math.PI*2,0,Math.PI/2),
    new THREE.MeshStandardMaterial({color:0xd8d8d8}));rambut.position.y=1.42;mcc.harun.add(rambut);
  mcc.harun.position.set(-4.6,0,.4);scene.add(mcc.harun);
  actMesh(badan,'WARISAN');
  scene.add(label('PAK HARUN (pensiun bln depan)',.6).translateX(-4.6).translateY(1.95).translateZ(.4));
  /* layar CMMS */
  const frame=boxT(4.4,2.6,.16,TEX.metal(),{metalness:.4});frame.position.set(-.4,2.5,Z+.05);scene.add(frame);
  frame.add(label('CMMS — SISTEM PEMELIHARAAN',.85).translateY(1.6));
  mcc.D=makeDisplay(4.1,2.3,580,330);
  mcc.D.mesh.position.set(-.4,2.5,Z+.15);scene.add(mcc.D.mesh);
  actMesh(mcc.D.mesh,'ASET');
  mcc.mode=0;
  function layar(){
    const g=mcc.D.g,W=580,H=330;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='600 15px Consolas';g.textAlign='left';
    if(mcc.mode===0){g.fillStyle='#5fd4ff';g.font='700 17px Consolas';
      g.fillText('REGISTER ASET (kosong)',16,32);
      g.fillStyle='#5d748c';g.fillText('PLTSa > ??? — semuanya di kepala Pak Harun',16,80);}
    else if(mcc.mode===1){g.fillStyle='#5fd4ff';g.font='700 17px Consolas';
      g.fillText('HIRARKI: 412 ASET TERDAFTAR',16,32);
      g.font='600 14px Consolas';
      ['PLTSa','├ Insinerator (38 aset)','│ ├ Grate · burner · refractory','├ Boiler & turbin (64)','├ Flue gas & CEMS (41)','└ Crane & umpan (29)…'].forEach((t,i)=>{
        g.fillStyle=i===0?'#eaf2fb':'#8aa3bd';g.fillText(t,16,70+i*32);});}
    else{g.fillStyle='#5fd4ff';g.font='700 17px Consolas';
      g.fillText('BIAYA HAR 12 BLN / ASET (top 3)',16,32);
      [['ID-FAN B','Rp 184 jt','7x rusak ⚠','#ff5a5a'],
       ['Crane grab','Rp 92 jt','aus normal','#ffd23f'],
       ['Conveyor abu','Rp 61 jt','korosi','#ffd23f']].forEach((r,i)=>{
        const y=80+i*48;g.fillStyle='#8aa3bd';g.fillText(r[0],16,y);
        g.fillStyle=r[3];g.fillText(r[1],200,y);g.fillText(r[2],360,y);});
      g.fillStyle='#46ff8e';g.font='700 15px Consolas';
      g.fillText('ID-FAN B: biaya 2thn rusak-perbaiki > harga baru → GANTI',16,H-20);}
    mcc.D.tex.needsUpdate=true;}
  layar();
  /* tablet teknisi */
  mcc.tab=box(.3,.42,.05,0x18242f);mcc.tab.position.set(3.2,1.1,.4);scene.add(mcc.tab);
  actMesh(mcc.tab,'WO');
  scene.add(label('TABLET TEKNISI — WORK ORDER',.6,'#5fd4ff').translateX(3.2).translateY(1.6).translateZ(.4));
  startSeq([
   {type:'act',aid:'ASET',done:false,targets:()=>[mcc.D.mesh],
    desc:'Bangun REGISTER ASET hirarkis — tulang punggung sistem (klik layar).',
    why:'Tiga minggu menyisir plant: 412 aset terdaftar dalam hirarki plant→sistem→equipment→komponen, ber-kode & ber-QR di fisiknya. Hirarki bukan kosmetik: kelak biaya tercatat di level yang BISA ditindak — "boiler mahal" tak bisa ditindak; "ID-fan B boros bearing" bisa.',
    fx(){mcc.mode=1;layar();toast('🗂️ 412 aset ber-hirarki + QR — kerangka berdiri.','ok',3000);}},
   {type:'act',aid:'WARISAN',done:false,targets:()=>[mcc.harun.children[0]],
    desc:'Migrasi paling berharga: WAWANCARAI Pak Harun (klik beliau).',
    why:'Empat sesi bersama kopi: jadwal PM tiap mesin dari ingatannya, trik ("crane grab harus digrease sebelum shift, bukan sesudah — debu abu mengunci nipple"), gejala khas ("ID-fan B kalau mau rusak, dengung naik dua hari sebelumnya"). Semua masuk catatan aset & jadwal PM. Pak Harun tersenyum: "akhirnya saya boleh pensiun dengan tenang."',
    fx(){toast('🎓 30 thn pengalaman → PM & catatan aset. Warisan aman.','ok',3400);}},
   {type:'act',aid:'WO',done:false,targets:()=>[mcc.tab],
    desc:'Hidupkan siklus: WORK ORDER digital dari lapangan (klik tablet).',
    why:'Operator melihat kebocoran kecil → scan QR aset → foto + keluhan → WO terbit otomatis ke planner → teknisi eksekusi & mencatat suku cadang + jam kerja → riwayat menempel di aset selamanya. Bulan pertama: 86 WO mengalir — dan untuk pertama kalinya, TAK ADA pekerjaan yang hidup hanya di ingatan atau sobekan kertas.',
    fx(){toast('📲 86 WO bulan pertama — semua tercatat, nol kertas hilang.','ok',3200);}},
   {type:'act',aid:'ANALISIS',done:false,targets:()=>[mcc.D.mesh],
    desc:'Panen pertama: ANALISIS biaya per aset (klik layar).',
    why:'Data 12 bulan (dimigrasi dari arsip + WO baru) menjawab pertanyaan yang dulu mustahil: ID-Fan B menelan Rp 184 jt — tujuh kali rusak, dan biaya dua tahunnya MELEBIHI harga unit baru. Keputusan berbasis data pertama CMMS: ganti, jangan rawat. Pak Harun mengangguk dari kursi pensiunnya: "sudah saya bilang dari dulu" — kini sistemlah yang bilang.',
    fx(){mcc.mode=2;layar();
      toast('💡 ID-Fan B: rawat > beli baru — keputusan data pertama!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Ingatan organisasi tak lagi bisa pensiun!</b> 412 aset terdaftar, 30 tahun pengalaman termigrasi, work order mengalir, dan keputusan pertama berbasis data sudah lahir. CMMS: cara terbaik menghormati senior — mengabadikan ilmunya.');
    setTimeout(()=>showWin('cmms'),2200);});
  const s0c=seq.steps[0],of0c=s0c.fx;s0c.fx=()=>{of0c();mcc.D.mesh.userData.aid='ANALISIS';};
  say('VOLTA di sini 🗃️ Krisis terbesar PLTSa bulan depan: <b>Pak Harun pensiun — bersama seluruh "database" di kepalanya</b>. Proyekmu: CMMS, ingatan organisasi yang tak bisa pensiun. Mulai dari register aset!');
  $('#modTitle').textContent='J13·M8 — CMMS Digital';
  $('#taskHead').textContent='INGATAN YANG TAK PENSIUN';}
MISSIONS.cmms.build=buildCMMS;
Object.assign(REAL,{
 cmms:[
  'Mulai dari hirarki & PM aset kritis — CMMS gagal paling sering karena input awal terlalu ambisius',
  'Buat WO semudah mungkin di lapangan (QR + foto) — sistem yang merepotkan akan dilewati teknisi',
  'Jadwalkan wawancara pengetahuan SEMUA senior, bukan hanya yang mau pensiun',
  'Review KPI bulanan (backlog, rasio PM:korektif) — CMMS adalah cermin, manajemen yang harus berkaca'],
});
