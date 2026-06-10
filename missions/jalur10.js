/* =====================================================================
   ElectraSim VR 3D — PV & SOLAR ENGINEER
   Misi: M1 solar (Wiring PLTS Rooftop On-Grid) · M2 riso (Komisioning & Pengujian PLTS)
   Dimuat on-demand oleh index.html lewat ensureMission().
   ===================================================================== */

Object.assign(MISSIONS,{
 solar:{lvl:'JALUR 10 · PV & SOLAR',icon:'☀️',title:'Wiring PLTS Rooftop On-Grid',strict:false,
  loc:'📍 Atap gudang CV Berkah · 5 kWp, Indramayu',
  story:'CV Berkah memasang PLTS atap 5 kWp untuk memangkas tagihan. Panel sudah terpasang di rel — tinggal wiring DC dan AC. Hati-hati: sisi DC tidak seperti AC, busur api DC tidak padam sendiri, dan polaritas terbalik bisa merusak inverter.',
  goal:'PLTS tersambung benar dari string panel → proteksi DC → inverter → AC breaker → kWh exim, lalu inverter ON dan mulai produksi.',
  obj:['Rangkai sisi DC: string PV → fuse DC → inverter (jaga polaritas!)','Grounding rangka panel','Sisi AC: inverter → breaker → kWh exim, lalu energize'],
  learn:['Arus DC tak punya titik nol → wajib fuse/switch khusus DC','Polaritas DC terbalik = inverter rusak; cek + dan − dua kali','Rangka panel wajib dibumikan (proteksi petir & arus bocor)','kWh exim mencatat dua arah: impor dari PLN & ekspor dari PLTS'],
  next:['Pelajari sizing string: Voc vs tegangan input maks inverter','Dalami komisioning: riso, polaritas, kurva I-V','Lanjut Jalur 12: infrastruktur pengisian EV']},
 riso:{lvl:'JALUR 10 · PV & SOLAR · MISI 2',icon:'🔬',title:'Komisioning & Pengujian PLTS',strict:true,
  loc:'📍 Atap gudang CV Berkah · Hari komisioning',
  story:'Wiring PLTS sudah rapi sejak misi pertama — tapi rapi belum berarti benar. Hari ini hari pembuktian: serangkaian pengukuran yang menentukan apakah sistem layak disinkronkan ke jaringan PLN. Ingat: selama matahari bersinar, string panel ini HIDUP dan tak bisa dimatikan.',
  goal:'PLTS lolos uji komisioning lengkap: Voc aman, polaritas benar, isolasi sehat, parameter grid sesuai — lalu sinkron.',
  obj:['Ukur Voc string & bandingkan dengan batas inverter','Verifikasi polaritas & tahanan isolasi array','Set parameter grid & sinkronkan inverter'],
  learn:['Voc string harus < tegangan input maks inverter — dihitung pada suhu TERDINGIN (Voc naik saat dingin!)','Polaritas dicek dengan multimeter DC sebelum konektor terpasang — terbalik = inverter wafat','Riso array mendeteksi isolasi kabel yang terluka saat instalasi (tertekuk, tergores rel)','Parameter grid (tegangan, frekuensi, anti-islanding) wajib sesuai ketentuan interkoneksi PLN'],
  next:['Pelajari pengukuran kurva I-V untuk deteksi panel bermasalah','Dalami thermal imaging: hotspot & bypass diode','Susun dokumen komisioning untuk pengajuan exim PLN']},
});

/* =====================================================================
   MISI 6 — SOLAR: PLTS ROOFTOP (Jalur 10)
   ===================================================================== */
let ms={};
function buildSolar(){
  freshScene(0xcfe2f0,0x16242f);
  cam={theta:-.15,phi:1.1,r:7.5,target:new THREE.Vector3(0,2.2,-1)};
  const ground=box(16,.1,12,0x6a7263);ground.position.y=-.05;scene.add(ground);
  /* atap miring */
  const roof=box(8,.15,5,0x8a5a40);roof.position.set(-1.5,3.2,-2.5);roof.rotation.x=-.28;scene.add(roof);
  /* 2 panel surya */
  ms.panels=[];
  [-3.2,-1.4].forEach(x=>{
    const p=box(1.5,.06,2.2,0x16263e,{roughness:.25,metalness:.5});
    p.position.set(x,3.45,-2.5);p.rotation.x=-.28;scene.add(p);ms.panels.push(p);
    const grid=box(1.4,.005,2.1,0x2a4a78);grid.position.set(x,3.49,-2.5);grid.rotation.x=-.28;scene.add(grid);});
  scene.add(label('STRING PV 5 kWp',.85).translateX(-2.3).translateY(4.6).translateZ(-2.5));
  terminal('PV+','fasa',-2.3,2.85,-1.35);
  terminal('PV-','netral',-1.9,2.85,-1.35);
  scene.add(label('DC+',.42,'#ff8d8d').translateX(-2.3).translateY(2.6).translateZ(-1.3));
  scene.add(label('DC−',.42,'#9cc4ff').translateX(-1.9).translateY(2.6).translateZ(-1.3));
  terminal('FRAME','ground',-3.9,2.85,-1.35);
  scene.add(label('RANGKA',.45,'#8df0b8').translateX(-3.9).translateY(2.6).translateZ(-1.3));

  /* dinding peralatan */
  const wall=box(6.5,3.4,.15,0xc8cfc6);wall.position.set(2.6,1.7,-3);scene.add(wall);
  const Z=-2.86;
  /* fuse DC */
  const fdc=box(.45,.6,.18,0x33404e);fdc.position.set(.7,2.5,Z);scene.add(fdc);
  fdc.add(label('FUSE DC',.6).translateY(.5));
  terminal('FDC-IN','fasa',.7,2.92,Z+.12);
  terminal('FDC-OUT','fasa',.7,2.1,Z+.12);
  /* inverter */
  const inv=box(.95,1.1,.25,0xdfe5ea);inv.position.set(2.2,2.3,Z);scene.add(inv);
  inv.add(label('INVERTER 5kW',.75).translateY(.78));
  ms.lcdC=document.createElement('canvas');ms.lcdC.width=256;ms.lcdC.height=96;
  ms.lcdTex=new THREE.CanvasTexture(ms.lcdC);
  const lcd=new THREE.Mesh(new THREE.PlaneGeometry(.6,.22),new THREE.MeshBasicMaterial({map:ms.lcdTex}));
  lcd.position.set(2.2,2.5,Z+.14);scene.add(lcd);
  ms.kw=0;ms.on=false;invLCD('0.00 kW','STANDBY');
  actMesh(inv,'INV');
  terminal('INV+','fasa',1.85,1.85,Z+.14);
  terminal('INV-','netral',2.2,1.85,Z+.14);
  scene.add(label('+',.4,'#ff8d8d').translateX(1.85).translateY(1.66).translateZ(Z+.1));
  scene.add(label('−',.4,'#9cc4ff').translateX(2.2).translateY(1.66).translateZ(Z+.1));
  terminal('INV-AC','fasa',2.55,1.85,Z+.14);
  scene.add(label('AC',.4).translateX(2.57).translateY(1.66).translateZ(Z+.1));
  /* ground bar */
  const gb=box(.45,.14,.1,0x86c79a);gb.position.set(.7,1.2,Z);scene.add(gb);
  gb.add(label('GND BAR',.5,'#8df0b8').translateY(.28));
  terminal('GNDBAR','ground',.7,1.2,Z+.12);
  /* AC breaker */
  const acb=box(.4,.6,.18,COL.cream);acb.position.set(3.6,2.4,Z);scene.add(acb);
  acb.add(label('AC BREAKER',.6).translateY(.5));
  terminal('ACB-IN','fasa',3.6,2.8,Z+.12);
  terminal('ACB-OUT','fasa',3.6,2.0,Z+.12);
  /* kWh exim */
  const exim=box(.6,.8,.2,0x2d3a4a);exim.position.set(4.8,2.3,Z);scene.add(exim);
  exim.add(label('kWh EXIM',.62).translateY(.6));
  terminal('EXIM','fasa',4.8,1.8,Z+.12);

  terms={};clickables.forEach(c=>{if(c.userData.kind==='terminal')terms[c.userData.id]=c;});
  moduleTick=(dt,T)=>{if(ms.on){ms.kw=4.2+Math.sin(T*.7)*.4;
    invLCD(ms.kw.toFixed(2)+' kW','PRODUKSI');}};

  startSeq([
   {type:'wire',a:'PV+',b:'FDC-IN',color:COL.fasa,done:false,
    desc:'Sambungkan DC+ string PV ke FUSE DC (kutub positif dulu).',
    why:'Sisi DC wajib pakai proteksi khusus DC: arus searah tak punya titik nol, sehingga busur api DC tak padam sendiri seperti AC. Fuse AC biasa akan terbakar.',
    wrong:'DC+ (merah) masuk ke fuse DC dulu sebelum ke inverter.'},
   {type:'wire',a:'FDC-OUT',b:'INV+',color:COL.fasa,done:false,
    desc:'Dari fuse DC, sambungkan ke terminal + inverter.',
    why:'Polaritas adalah segalanya di sini: DC+ harus bertemu terminal +. Banyak inverter rusak permanen karena polaritas terbalik saat komisioning.'},
   {type:'wire',a:'PV-',b:'INV-',color:COL.netral,done:false,
    desc:'Sambungkan DC− string PV ke terminal − inverter.',
    why:'Sebelum mengencangkan, teknisi PLTS selalu cek polaritas dua kali dengan multimeter — kebiasaan kecil yang menyelamatkan inverter puluhan juta.',
    wrong:'Perhatikan polaritas: DC− (biru) hanya ke terminal − inverter.'},
   {type:'wire',a:'FRAME',b:'GNDBAR',color:COL.ground,done:false,
    desc:'Bumikan RANGKA panel ke GND BAR (kuning-hijau).',
    why:'Rangka aluminium di atap = penangkap petir tak resmi + jalur arus bocor. Pembumian rangka wajib menurut standar — melindungi orang & sistem dari surja.'},
   {type:'wire',a:'INV-AC',b:'ACB-IN',color:COL.fasa,done:false,
    desc:'Sisi AC: keluaran inverter ke AC BREAKER.',
    why:'Breaker AC = titik isolasi sisi jaringan saat pemeliharaan inverter, sekaligus proteksi arus lebih keluaran.'},
   {type:'wire',a:'ACB-OUT',b:'EXIM',color:COL.fasa,done:false,
    desc:'Dari breaker, sambungkan ke kWh EXIM (ekspor-impor).',
    why:'Meter exim mencatat dua arah: siang hari kelebihan produksi DIEKSPOR ke PLN, malam hari rumah IMPOR seperti biasa. Inilah jantung skema PLTS atap.'},
   {type:'act',aid:'INV',done:false,targets:()=>[inv],
    desc:'ENERGIZE: klik INVERTER untuk ON. Matahari sedang terik!',
    why:'Inverter melakukan self-test (riso, grid voltage, frekuensi) sebelum sinkron ke jaringan — kalau wiring benar, dalam hitungan detik mulai produksi.',
    fx(){ms.on=true;sfx.big();
      toast('☀️ Inverter sinkron — PLTS produksi ±4 kW!','ok',2800);}},
  ],()=>{say('🎉 <b>PLTS CV Berkah resmi berproduksi!</b> Setiap matahari terbit, tagihan listrik mereka terpangkas. Energi bersih, wiring bersih.');
    setTimeout(()=>showWin('solar'),2400);});

  say('VOLTA di sini ☀️ Selamat datang di dunia DC! Dua hukum besinya: <b>(1) polaritas jangan terbalik, (2) proteksi harus khusus DC</b> karena busur api DC tak padam sendiri. Ikuti penanda ▼, mulai dari kutub positif.');
  $('#modTitle').textContent='J10 — Wiring PLTS Rooftop On-Grid';
  $('#taskHead').textContent='DC DULU, BARU AC';}
function invLCD(num,status){
  const g=ms.lcdC.getContext('2d');
  g.fillStyle='#101822';g.fillRect(0,0,256,96);
  g.fillStyle='#5fd4ff';g.font='700 40px Consolas,monospace';
  g.textAlign='right';g.fillText(num,240,50);
  g.font='600 20px Consolas,monospace';g.textAlign='left';
  g.fillStyle=status==='PRODUKSI'?'#46ff8e':'#7d8f84';g.fillText(status,16,82);
  ms.lcdTex.needsUpdate=true;}

/* =====================================================================
   MISI 20 — KOMISIONING PLTS (Jalur 10 · Misi 2) — bertekstur
   ===================================================================== */
let mri={};
function buildRiso(){
  freshScene(0xcfe2f0,0x16242f);
  cam={theta:-.15,phi:1.1,r:7.5,target:new THREE.Vector3(0,2.2,-1)};
  const ground=boxT(16,.1,12,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  const roof=boxT(8,.15,5,TEX.wood());roof.position.set(-1.5,3.2,-2.5);roof.rotation.x=-.28;scene.add(roof);
  [-3.2,-1.4].forEach(x=>{
    const p=box(1.5,.06,2.2,0x16263e,{roughness:.22,metalness:.55});
    p.position.set(x,3.45,-2.5);p.rotation.x=-.28;scene.add(p);});
  scene.add(label('STRING PV 5 kWp — HIDUP!',.85,'#ffd23f').translateX(-2.3).translateY(4.6).translateZ(-2.5));
  /* meja alat ukur */
  const tbl=boxT(2.4,.08,.9,TEX.wood());tbl.position.set(2.4,1.0,.4);scene.add(tbl);
  [[-1,.3],[1,.3],[-1,-.3],[1,-.3]].forEach(o=>{
    const l=boxT(.08,1,.08,TEX.wood());l.position.set(2.4+o[0],.5,.4+o[1]*.9);scene.add(l);});
  mri.mm=box(.3,.16,.4,0xd8b020);mri.mm.position.set(1.6,1.1,.4);scene.add(mri.mm);
  actMesh(mri.mm,'VOC');
  scene.add(label('MULTIMETER DC',.55,'#5fd4ff').translateX(1.6).translateY(1.4).translateZ(.4));
  mri.probe=box(.22,.14,.3,0xd83a3a);mri.probe.position.set(2.4,1.1,.4);scene.add(mri.probe);
  actMesh(mri.probe,'POL');
  scene.add(label('CEK POLARITAS',.55,'#5fd4ff').translateX(2.4).translateY(1.4).translateZ(.4));
  mri.meg=box(.34,.2,.3,0xcc6020);mri.meg.position.set(3.2,1.12,.4);scene.add(mri.meg);
  actMesh(mri.meg,'RISO');
  scene.add(label('INSULATION TESTER',.55,'#5fd4ff').translateX(3.2).translateY(1.4).translateZ(.4));
  /* inverter + display */
  const wall=boxT(5,3.2,.15,TEX.plaster());wall.position.set(2.6,1.6,-3);scene.add(wall);
  const inv=boxT(.95,1.1,.25,TEX.metal(),{metalness:.4});inv.position.set(2.2,2.1,-2.86);scene.add(inv);
  inv.add(label('INVERTER 5kW',.75).translateY(.78));
  mri.D=makeDisplay(.7,.3,260,110);
  mri.D.mesh.position.set(2.2,2.32,-2.71);scene.add(mri.D.mesh);
  dispText(mri.D,['STANDBY'],['#7d8f84']);
  actMesh(mri.D.mesh,'GRID'); actMesh(inv,'SYNC');

  mri.on=false;
  moduleTick=(dt,T)=>{if(mri.on)dispText(mri.D,[(4.1+Math.sin(T*.8)*.3).toFixed(2)+' kW'],['#46ff8e']);};

  startSeq([
   {type:'act',aid:'VOC',done:false,targets:()=>[mri.mm],
    desc:'Ukur Voc string dengan MULTIMETER DC (klik multimeter).',
    why:'Terukur 412 VDC — aman di bawah input maks inverter 600 V. Tapi ingat: Voc NAIK saat dingin (~-0,3%/°C). Perhitungan sizing selalu memakai suhu terdingin lokasi, bukan siang terik.',
    fx(){toast('📏 Voc string: 412 VDC < 600 V maks inverter ✓','ok',2800);}},
   {type:'act',aid:'POL',done:false,targets:()=>[mri.probe],
    desc:'Verifikasi POLARITAS kedua kutub (klik probe merah).',
    why:'Probe merah ke konektor +, hitam ke −: pembacaan POSITIF = polaritas benar. Negatif = string terbalik. Tiga detik pemeriksaan ini lebih murah dari inverter pengganti.',
    fx(){toast('🔴⚫ Pembacaan +412 V — polaritas BENAR ✓','ok',2600);}},
   {type:'act',aid:'RISO',done:false,targets:()=>[mri.meg],
    desc:'Uji tahanan ISOLASI array (klik insulation tester).',
    why:'Kabel PV bisa terluka diam-diam saat penarikan: tertekuk di rel, tergores klem. Riso 1,2 MΩ (>1 MΩ standar) = isolasi sehat; nilai rendah = bocor ke rangka, bahaya & rugi produksi.',
    fx(){toast('🔍 Riso array: 1,2 MΩ — isolasi sehat ✓','ok',2600);}},
   {type:'act',aid:'GRID',done:false,targets:()=>[mri.D.mesh],
    desc:'Set parameter GRID di inverter (klik display).',
    why:'230 V / 50 Hz / anti-islanding AKTIF: saat PLN padam, inverter wajib berhenti dalam 2 detik — melindungi petugas yang mengira jaringan mati. Ini syarat mutlak interkoneksi.',
    fx(){dispText(mri.D,['GRID SET ✓'],['#5fd4ff']);
      toast('⚙️ 230V·50Hz·anti-islanding ON — sesuai ketentuan PLN.','ok',2800);}},
   {type:'act',aid:'SYNC',done:false,targets:()=>[inv],
    desc:'Semua uji LOLOS — sinkronkan inverter (klik inverter)!',
    why:'Self-test internal mengulang semua yang barusan kamu ukur (riso, grid, polaritas) — lalu sinkron. Dokumen hasil uji hari ini menjadi lampiran pengajuan meter exim ke PLN.',
    fx(){mri.on=true;
      toast('☀️ SINKRON — produksi 4,1 kW. Komisioning LOLOS!','ok',2800);sfx.big();}},
  ],()=>{say('🎉 <b>Komisioning lengkap!</b> Voc ✓ polaritas ✓ isolasi ✓ grid ✓ — empat tanda tangan keselamatan sebelum satu watt pun mengalir. Begitulah profesional menyalakan PLTS.');
    setTimeout(()=>showWin('riso'),2200);});

  say('VOLTA di sini 🔬 Wiring rapi ≠ wiring benar — hari ini kita BUKTIKAN dengan alat ukur. Empat pengujian menanti, dan ingat selalu: <b>selama matahari bersinar, string ini hidup</b>.');
  $('#modTitle').textContent='J10·M2 — Komisioning & Pengujian PLTS';
  $('#taskHead').textContent='UKUR · BUKTIKAN · SINKRON';}

MISSIONS.solar.build=buildSolar;
MISSIONS.riso.build=buildRiso;

Object.assign(REAL,{
 solar:[
  'Panel tak bisa "dimatikan" selama ada cahaya — ukur Voc & polaritas tiap string dengan multimeter DC sebelum menyentuh',
  'Gunakan konektor MC4 satu merek + crimping tool khusus; sambungan beda merek = titik panas',
  'Komisioning: uji riso array, kurva I-V bila ada alatnya, set parameter grid inverter sesuai PLN (230 V / 50 Hz)',
  'PLTS atap on-grid wajib izin & perjanjian ekspor-impor dengan PLN sebelum operasi paralel'],
 riso:[
  'Ukur Voc SETIAP string sebelum paralel ke combiner — string beda panjang/orientasi tak boleh diparalel langsung',
  'Riso diukur pada tegangan uji sesuai standar (umumnya 1000 VDC) antara konduktor dan rangka/bumi',
  'Hitung Voc desain pada suhu terdingin lokasi: Voc_stc × (1 + |koef| × ΔT)',
  'Dokumentasi hasil uji menjadi lampiran wajib pengajuan meter exim & SLO PLTS'],
});
