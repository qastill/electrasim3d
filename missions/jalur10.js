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

/* =====================================================================
   MISI 3 — O&M PLTS: PRODUKSI TURUN
   ===================================================================== */
Object.assign(MISSIONS,{
 om:{lvl:'JALUR 10 · PV & SOLAR · MISI 3',icon:'🧰',title:'O&M PLTS: Diagnosa Produksi Turun',strict:false,
  loc:'📍 Atap gudang CV Berkah · 6 bulan setelah komisioning',
  story:'Telepon dari CV Berkah: "Tagihan naik lagi — PLTS-nya rusak ya?" Dashboard monitoring menunjukkan produksi turun 18% dibanding bulan-bulan awal. PLTS tidak punya bagian bergerak, tapi ia punya musuh yang sabar: debu, kotoran burung, sel yang retak diam-diam. Saatnya O&M bicara.',
  goal:'Penyebab penurunan ditemukan lewat data & inspeksi (bukan tebakan), diperbaiki, dan produksi kembali normal.',
  obj:['Analisis data monitoring per string','Inspeksi termal & visual di atap','Bersihkan, ganti modul rusak, verifikasi pemulihan'],
  learn:['Monitoring per string menunjuk arah: string yang tertinggal dari saudaranya = ada masalah lokal','Thermal camera melihat yang mata lewatkan: hotspot = sel retak/bypass diode bekerja/kotoran membandel','Soiling (debu+kotoran burung) mencuri 5-15% produksi secara diam — pembersihan terjadwal itu investasi, bukan biaya','Satu modul retak menyeret satu string: sel-sel seri mengikuti arus TERLEMAH'],
  next:['Pelajari analisis PR (performance ratio) bulanan sebagai KPI PLTS','Dalami kurva I-V lapangan untuk diagnosa presisi','Susun kontrak O&M: preventive, corrective, & jaminan availability']},
});
let mom={};
function buildOM(){
  freshScene(0xcfe2f0,0x16242f);
  cam={theta:-.15,phi:1.1,r:8,target:new THREE.Vector3(0,2.4,-1)};
  const ground=boxT(16,.1,12,TEX.concrete());ground.position.y=-.05;scene.add(ground);
  const roof=boxT(9,.15,5.5,TEX.wood());roof.position.set(-1,3.2,-2.5);roof.rotation.x=-.28;scene.add(roof);
  /* 3 string panel */
  mom.panels=[];
  [-3.6,-1.6,.4].forEach((x,i)=>{
    const p=box(1.7,.06,2.3,0x16263e,{roughness:.25,metalness:.5});
    p.position.set(x,3.45,-2.5);p.rotation.x=-.28;scene.add(p);mom.panels.push(p);
    scene.add(label('STRING '+(i+1),.55).translateX(x).translateY(4.35).translateZ(-2.5));});
  /* kotoran burung & retakan di string 3 */
  mom.kotor=new THREE.Mesh(new THREE.SphereGeometry(.16,10,8),
    new THREE.MeshStandardMaterial({color:0xd8d8cc,roughness:.95}));
  mom.kotor.scale.set(1,.25,1);mom.kotor.position.set(.2,3.62,-2.1);scene.add(mom.kotor);
  actMesh(mom.kotor,'VISUAL');
  /* monitoring kiosk */
  mom.D=makeDisplay(1.9,1.2,400,260);
  mom.D.mesh.position.set(3.4,2.0,-2.8);scene.add(mom.D.mesh);
  actMesh(mom.D.mesh,'MON');
  const pole=cyl(.05,.05,1.4,0x666666);pole.position.set(3.4,.7,-2.8);scene.add(pole);
  scene.add(label('MONITORING',.65,'#5fd4ff').translateX(3.4).translateY(2.75).translateZ(-2.8));
  function mon(fix){
    const g=mom.D.g,W=400,H=260;
    g.fillStyle='#0c141d';g.fillRect(0,0,W,H);
    g.font='700 19px Consolas';g.textAlign='left';
    g.fillStyle='#5fd4ff';g.fillText('PRODUKSI PER STRING',16,30);
    const v=fix?[1.62,1.60,1.58]:[1.62,1.60,1.07];
    v.forEach((kw,i)=>{
      g.fillStyle='#8aa3bd';g.font='600 17px Consolas';
      g.fillText('STR'+(i+1),16,72+i*56);
      g.fillStyle=kw<1.4?'#ff5a5a':'#46ff8e';
      g.fillRect(80,56+i*56,kw*150,24);
      g.fillText(kw.toFixed(2)+' kW',80+kw*150+10,74+i*56);});
    g.fillStyle=fix?'#46ff8e':'#ffd23f';g.font='700 16px Consolas';
    g.fillText(fix?'TOTAL 4,80 kW — PULIH ✓':'TOTAL 4,29 kW (-18%)',16,H-18);
    mom.D.tex.needsUpdate=true;}
  mon(false);
  /* thermal camera & alat */
  const tbl=boxT(1.4,.07,.7,TEX.wood());tbl.position.set(4.2,.95,.6);scene.add(tbl);
  const tleg=boxT(.08,.95,.08,TEX.wood());tleg.position.set(4.2,.47,.6);scene.add(tleg);
  mom.cam=box(.26,.2,.16,0x18242f);mom.cam.position.set(3.8,1.1,.6);scene.add(mom.cam);
  actMesh(mom.cam,'THERMAL');
  scene.add(label('THERMAL CAMERA',.55,'#5fd4ff').translateX(3.8).translateY(1.4).translateZ(.6));
  mom.sikat=cyl(.04,.04,1.2,0x2a72c8);mom.sikat.rotation.z=.6;mom.sikat.position.set(4.7,1.15,.6);scene.add(mom.sikat);
  actMesh(mom.sikat,'BERSIH');
  scene.add(label('SIKAT + AIR DEMIN',.55,'#5fd4ff').translateX(4.9).translateY(1.5).translateZ(.6));
  mom.modul=box(1.0,.05,1.4,0x1a2c46,{roughness:.25});mom.modul.position.set(6.0,.6,-.8);scene.add(mom.modul);
  actMesh(mom.modul,'GANTI');
  scene.add(label('MODUL CADANGAN',.55,'#5fd4ff').translateX(6.0).translateY(.95).translateZ(-.8));
  startSeq([
   {type:'act',aid:'MON',done:false,targets:()=>[mom.D.mesh],
    desc:'Buka MONITORING: bandingkan produksi per string (klik layar).',
    why:'String 1 & 2 kompak di 1,6 kW — string 3 terseok di 1,07 kW (-34%). Penurunan total 18% ternyata bukan merata: ia berasal dari SATU string sakit. Data sudah menunjuk arah; tinggal naik ke atap.',
    fx(){toast('📉 String 3 anomali: 1,07 kW vs 1,6 kW saudaranya.','bad',2800);}},
   {type:'act',aid:'THERMAL',done:false,targets:()=>[mom.cam],
    desc:'Scan string 3 dengan THERMAL CAMERA (klik kamera).',
    why:'Layar termal bercerita: satu area panas 78°C di modul tepi (sel retak — bypass diode bekerja keras) + pola hangat tak rata di modul tengah (kotoran tebal). Dua tersangka, satu kamera.',
    fx(){toast('🌡️ Hotspot 78°C modul tepi + pola soiling modul tengah.','bad',2800);}},
   {type:'act',aid:'VISUAL',done:false,targets:()=>[mom.kotor],
    desc:'Inspeksi VISUAL dari dekat: konfirmasi temuan (klik area kotor).',
    why:'Benar: kotoran burung mengeras menutup 3 sel (burung suka tepi atap yang hangat), dan modul tepi menunjukkan retak halus dari mikro-crack yang berkembang. Termal menuduh, mata mengonfirmasi.',
    fx(){toast('🔍 Terkonfirmasi: kotoran keras + retak halus modul tepi.','info',2600);}},
   {type:'act',aid:'BERSIH',done:false,targets:()=>[mom.sikat],
    desc:'BERSIHKAN array: sikat lembut + air demin (klik sikat).',
    why:'Pagi hari saat kaca dingin — air dingin di kaca panas bisa meretakkan. Sikat lembut & air tanpa mineral: bekas sabun justru jadi perekat debu berikutnya. Produksi string 3 langsung merangkak naik.',
    fx(){mom.kotor.visible=false;
      toast('🧽 Array bersih — string 3 naik ke 1,38 kW. Tinggal si retak.','ok',2800);}},
   {type:'act',aid:'GANTI',done:false,targets:()=>[mom.modul],
    desc:'GANTI modul retak dengan cadangan & verifikasi (klik modul).',
    why:'Modul retak diganti spesifikasi setara (arus seri mengikuti yang terlemah!). Sarung tangan, konektor MC4 klik sempurna, lalu cek monitoring: string 3 kembali 1,58 kW — keluarga tiga string rukun kembali.',
    fx(){mon(true);
      toast('🔧 Modul baru terpasang — produksi PULIH 4,80 kW ✓','ok',3000);sfx.big();}},
  ],()=>{say('🎉 <b>Produksi pulih!</b> Data menunjuk string, termal menunjuk modul, mata mengonfirmasi, tangan memperbaiki. PLTS itu rajin — asal pemiliknya rajin merawat.');
    setTimeout(()=>showWin('om'),2200);});
  say('VOLTA di sini 🧰 PLTS-mu enam bulan kemudian: <b>produksi turun 18%</b> dan pelanggan mulai curiga. Jangan menebak — biarkan data per string, kamera termal, dan mata yang memutuskan. Mulai dari monitoring.');
  $('#modTitle').textContent='J10·M3 — O&M PLTS';
  $('#taskHead').textContent='DATA → TERMAL → VISUAL → AKSI';}
MISSIONS.om.build=buildOM;
Object.assign(REAL,{
 om:[
  'Bekerja di atap = bahaya ganda: DC hidup + ketinggian. Gunakan prosedur keduanya sekaligus',
  'Jadwalkan pembersihan dari data soiling loss lokasi (musim kemarau vs hujan), bukan kalender buta',
  'Modul pengganti harus kompatibel arus/tegangan dengan string existing — beda generasi = mismatch',
  'Catat semua temuan & penggantian di logbook O&M — klaim garansi modul butuh riwayat'],
});

/* =====================================================================
   MISI 4 — PLTS HYBRID OFF-GRID + BATERAI
   ===================================================================== */
Object.assign(MISSIONS,{
 hybrid:{lvl:'JALUR 10 · PV & SOLAR · MISI 4',icon:'🏝️',title:'PLTS Hybrid Off-Grid + Baterai',strict:false,
  loc:'📍 Pulau Karang Jaya · Desa nelayan tanpa jaringan PLN',
  story:'Tiga ratus kepala keluarga, genset tua yang minum solar mahal kiriman kapal, dan listrik hanya 6 jam semalam. Proyekmu mengubah semuanya: PLTS + baterai + genset cadangan dalam satu sistem hybrid off-grid. Tak ada jaringan PLN untuk bersandar — di pulau ini, sistemmu ADALAH jaringannya.',
  goal:'Sistem hybrid beroperasi dengan prioritas benar: surya dulu, baterai kemudian, genset hanya saat terdesak — listrik 24 jam pertama dalam sejarah desa.',
  obj:['Rangkai arsitektur: PV → MPPT → bus baterai → inverter','Set prioritas sumber & ambang genset di hybrid controller','Uji skenario: siang, malam, dan mendung panjang'],
  learn:['Off-grid berarti inverter membentuk jaringannya sendiri (grid-forming): ialah yang menetapkan 230V/50Hz, bukan mengikuti','Prioritas energi termurah: surya (gratis) → baterai (tersimpan) → genset (mahal) — controller mengeksekusinya otomatis','Ambang genset diset dari SoC baterai (mis. start di 30%, stop di 80%) — genset bekerja singkat & efisien, bukan menyala semalaman','Autonomi baterai dihitung untuk hari mendung (1,5-2 hari) — pulau tidak punya rencana B'],
  next:['Pelajari sizing autonomi & solar charge controller MPPT vs PWM','Dalami genset auto-start (AMF) & sinkronisasi dengan inverter','Eksplorasi mini-grid komunal: smart meter prabayar desa']},
});
let mhy={};
function buildHybrid(){
  freshScene(0xcfe8f0,0x14242c);
  cam={theta:-.1,phi:1.12,r:9,target:new THREE.Vector3(0,1.6,-.8)};
  const ground=boxT(22,.1,13,TEX.gravel());ground.position.y=-.05;scene.add(ground);
  /* laut dekoratif */
  const laut=box(22,.04,3,0x2a6a9a,{roughness:.2,metalness:.3});laut.position.set(0,.02,5);scene.add(laut);
  /* array PV */
  mhy.pv=box(3.2,.08,2.0,0x16263e,{roughness:.25,metalness:.5});
  mhy.pv.position.set(-5.4,1.5,-2.0);mhy.pv.rotation.x=-.25;scene.add(mhy.pv);
  [[-1.2,0],[1.2,0]].forEach(o=>{const leg=cyl(.06,.06,1.4,0x8a8a8a);
    leg.position.set(-5.4+o[0],.7,-2.0);scene.add(leg);});
  actMesh(mhy.pv,'PV');
  scene.add(label('ARRAY PV 40 kWp',.75).translateX(-5.4).translateY(2.4).translateZ(-2.0));
  /* MPPT + bank baterai */
  mhy.mppt=box(.6,.8,.3,0x2a5a8a);mhy.mppt.position.set(-2.8,1.2,-2.2);scene.add(mhy.mppt);
  actMesh(mhy.mppt,'MPPT');
  scene.add(label('MPPT CHARGER',.6,'#5fd4ff').translateX(-2.8).translateY(1.85).translateZ(-2.2));
  const rak=boxT(1.8,1.2,.8,TEX.metal(),{metalness:.3});rak.position.set(-.6,.65,-2.2);scene.add(rak);
  rak.add(label('BANK BATERAI LFP 120 kWh',.6).translateY(.95));
  /* inverter hybrid + display */
  mhy.inv=boxT(1.0,1.3,.5,TEX.metal(),{metalness:.35});mhy.inv.position.set(1.8,.7,-2.2);scene.add(mhy.inv);
  mhy.inv.add(label('HYBRID INVERTER 30 kW',.6).translateY(.95));
  actMesh(mhy.inv,'NYALA');
  mhy.D=makeDisplay(.85,.55,260,160);
  mhy.D.mesh.position.set(1.8,.85,-1.93);scene.add(mhy.D.mesh);
  dispText(mhy.D,['OFFLINE','—'],['#7d8f84','#7d8f84']);
  actMesh(mhy.D.mesh,'CFG');
  /* genset */
  mhy.gen=boxT(1.4,1.0,.9,TEX.metal(),{metalness:.3});mhy.gen.position.set(4.2,.55,-2.2);scene.add(mhy.gen);
  actMesh(mhy.gen,'UJIN');
  scene.add(label('GENSET CADANGAN 25 kVA',.6).translateX(4.2).translateY(1.35).translateZ(-2.2));
  /* desa */
  [[6.4,.6],[7.4,.2]].forEach((o,i)=>{
    const r=boxT(.9,.7,.8,TEX.plaster());r.position.set(o[0],.4,o[1]);scene.add(r);
    const atap=box(1.05,.3,.95,0x8a5a40);atap.position.set(o[0],.9,o[1]);scene.add(atap);});
  mhy.lampDesa=new THREE.Mesh(new THREE.SphereGeometry(.09,12,10),
    new THREE.MeshStandardMaterial({color:0x553322,emissive:0x000000}));
  mhy.lampDesa.position.set(6.9,1.5,.4);scene.add(mhy.lampDesa);
  scene.add(label('DESA · 300 KK',.7).translateX(6.9).translateY(2.0).translateZ(.4));
  startSeq([
   {type:'act',aid:'PV',done:false,targets:()=>[mhy.pv],
    desc:'Verifikasi ARRAY 40 kWp: string, polaritas, grounding (klik panel).',
    why:'Ilmu misi-misi sebelumnya dipakai semua: Voc tiap string, polaritas dua kali cek, rangka dibumikan. Di pulau, kesalahan instalasi tak bisa menelepon vendor — kapal berikutnya dua minggu lagi.',
    fx(){toast('☀️ 8 string ✓ polaritas ✓ grounding ✓ — array siap.','ok',2600);}},
   {type:'act',aid:'MPPT',done:false,targets:()=>[mhy.mppt],
    desc:'Sambung & set MPPT charger ke bank baterai.',
    why:'MPPT memburu titik daya maksimum panel sepanjang hari — 15-30% lebih banyak panen daripada charger PWM murah. Profil charging diset khas LFP: absorption 56,8 V, tanpa equalization. Baterai adalah jantung pulau; charger adalah dokternya.',
    fx(){toast('🔋 MPPT aktif: profil LFP · panen maksimal sepanjang hari.','ok',2600);}},
   {type:'act',aid:'CFG',done:false,targets:()=>[mhy.D.mesh],
    desc:'Set PRIORITAS & ambang genset di hybrid controller (klik display).',
    why:'Aturan main pulau ditulis di sini: surya melayani beban + mengisi baterai; malam = baterai; genset auto-start hanya bila SoC < 30% dan berhenti di 80%. Energi termahal dipakai paling akhir, paling singkat — solar kiriman kapal itu emas cair.',
    fx(){dispText(mhy.D,['PV>BAT>GEN','gen: SoC 30-80%'],['#46ff8e','#eaf2fb']);
      toast('⚙️ Prioritas terkunci: surya → baterai → genset (darurat).','ok',2800);}},
   {type:'act',aid:'UJIN',done:false,targets:()=>[mhy.gen],
    desc:'Uji skenario MENDUNG: paksa SoC rendah — genset harus bangun sendiri.',
    why:'Simulasi tiga hari mendung: SoC menyentuh 30% → AMF menghidupkan genset otomatis, inverter sinkron, baterai terisi ke 80% → genset pamit sendiri. Total kerja: 2,5 jam — bukan semalaman seperti dulu. Sistem lulus ujian hari terburuknya.',
    fx(){beep(75,1.0,'sawtooth',.07);
      toast('🌧️ SoC 30% → genset auto-start → 80% → auto-stop ✓','ok',3000);}},
   {type:'act',aid:'NYALA',done:false,targets:()=>[mhy.inv],
    desc:'Momen bersejarah: ON-kan sistem — listrik 24 jam pertama desa!',
    why:'Inverter membentuk 230V/50Hz-nya sendiri — jaringan mini lahir di pulau ini. Lampu-lampu rumah menyala dan TIDAK akan padam jam 9 malam. Kulkas pertama, pompa air pertama, anak-anak belajar malam pertama. Listrik mengubah desa; kamu yang membawanya.',
    fx(){mhy.lampDesa.material.color.setHex(0xffd97a);mhy.lampDesa.material.emissive.setHex(0xffd97a);
      mhy.lampDesa.material.emissiveIntensity=1;
      toast('🏝️ DESA MENYALA 24 JAM — sejarah baru Karang Jaya!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Mini-grid pulau beroperasi!</b> Surya bekerja siang, baterai berjaga malam, genset hanya tamu darurat. Tak ada PLN di sini — sistemmu lah PLN-nya. Dan 300 keluarga tidur dengan lampu menyala.');
    setTimeout(()=>showWin('hybrid'),2200);});
  say('VOLTA di sini 🏝️ Misi paling bermakna: <b>melistriki pulau tanpa jaringan</b>. Tiga sumber, satu aturan: yang gratis dulu, yang mahal paling akhir. Mulai dari array — dan ingat, kapal sparepart datang dua minggu sekali.');
  $('#modTitle').textContent='J10·M4 — PLTS Hybrid Off-Grid';
  $('#taskHead').textContent='SURYA → BATERAI → GENSET';}
MISSIONS.hybrid.build=buildHybrid;
Object.assign(REAL,{
 hybrid:[
  'Sizing autonomi memakai data radiasi bulan TERBURUK lokasi, bukan rata-rata tahunan',
  'Latih operator lokal: sistem terbaik mati oleh ketiadaan orang yang paham di pulau',
  'Stok suku cadang kritis di lokasi (fuse, MC4, satu MPPT cadangan) — logistik pulau tak kenal darurat',
  'Manajemen beban komunal disepakati desa (jam beban besar bergiliran) — sosial menentukan teknis'],
});

/* =====================================================================
   MISI 5 — PLTS TERAPUNG (FLOATING SOLAR)
   ===================================================================== */
Object.assign(MISSIONS,{
 apung:{lvl:'JALUR 10 · PV & SOLAR · MISI 5',icon:'🌊',title:'PLTS Terapung (Floating Solar)',strict:false,
  loc:'📍 Waduk irigasi Cipancuh · Pilot 1 MWp terapung',
  story:'Lahan makin mahal, tapi waduk irigasi itu luas dan menganggur di permukaannya. Proyek barumu: PLTS TERAPUNG 1 MWp — panel di atas ponton HDPE, angkur ke dasar waduk, kabel menyelam ke darat. Air memberi bonus pendinginan alami (+5-10% produksi), tapi menagih harga: semuanya bergerak, mengapung, dan menuntut hormat pada korosi.',
  goal:'Array terapung beroperasi: ponton terangkur benar mengikuti pasang-surut, wiring tahan gerak & air, dan produksi perdana dengan bonus pendinginan terverifikasi.',
  obj:['Rakit & posisikan ponton apung','Pasang angkur dengan kelonggaran pasang-surut','Wiring tahan gerak + ikuti uji & energize'],
  learn:['Air mendinginkan panel alami: suhu sel turun belasan derajat = produksi naik 5-10% dibanding darat — bonus yang menutup biaya ponton','Angkur harus mengizinkan GERAK: level waduk naik-turun meteran — angkur kaku akan menenggelamkan ponton atau putus saat surut','Kabel di sistem terapung hidup dengan gerakan: jalur diberi service loop, jenis kabel tahan tekuk & air (bukan kabel darat biasa)','Korosi & biofouling adalah penyewa tetap: material marine-grade & jadwal inspeksi ponton adalah bagian desain, bukan tambahan'],
  next:['Pelajari studi evaporasi: PLTS terapung juga menghemat air waduk','Dalami desain angkur untuk variasi level ekstrem (waduk PLTA)','Eksplorasi hibrida: floating PV + PLTA existing berbagi interkoneksi']},
});
let mfl={};
function buildApung(){
  freshScene(0xa8d0e0,0x10242e);
  cam={theta:.1,phi:1.1,r:10,target:new THREE.Vector3(0,1,-1)};
  /* air waduk */
  const air=box(26,.06,16,0x1d5a7a,{roughness:.15,metalness:.4});air.position.y=0;scene.add(air);
  const darat=boxT(6,.5,16,TEX.gravel());darat.position.set(-10,.2,0);scene.add(darat);
  scene.add(label('WADUK CIPANCUH',.9).translateY(3.4).translateZ(-4));
  /* ponton + panel */
  mfl.ponton=new THREE.Group();
  for(let r=0;r<2;r++)for(let c=0;c<3;c++){
    const p=box(1.5,.18,1.1,0xe8edf2,{roughness:.6});
    p.position.set(c*1.6-1.6,.12,r*1.2-.6);mfl.ponton.add(p);
    const pv=box(1.4,.05,1.0,0x16263e,{roughness:.25,metalness:.5});
    pv.position.set(c*1.6-1.6,.28,r*1.2-.6);pv.rotation.x=-.1;mfl.ponton.add(pv);}
  mfl.ponton.position.set(8,2,-1);scene.add(mfl.ponton); /* mulai "di darat/crane" */
  actMesh(mfl.ponton.children[1],'PONTON');
  scene.add(label('MODUL PONTON (siap luncur)',.7,'#ffd23f').translateX(8).translateY(3.2).translateZ(-1));
  /* angkur */
  mfl.angkur=box(.4,.3,.3,0x556570);mfl.angkur.position.set(4.4,.3,1.6);scene.add(mfl.angkur);
  actMesh(mfl.angkur,'ANGKUR');
  scene.add(label('ANGKUR + RANTAI',.6,'#5fd4ff').translateX(4.4).translateY(.85).translateZ(1.6));
  /* kabel laut */
  mfl.kabel=cyl(.05,.05,3.2,0x18242f);mfl.kabel.rotation.z=1.25;
  mfl.kabel.position.set(-3.8,.3,-1);mfl.kabel.visible=false;scene.add(mfl.kabel);
  mfl.kabelBtn=box(.4,.3,.3,0x18242f);mfl.kabelBtn.position.set(-6.8,.7,1.4);scene.add(mfl.kabelBtn);
  actMesh(mfl.kabelBtn,'KABEL');
  scene.add(label('ROL KABEL MARINE',.6,'#5fd4ff').translateX(-6.8).translateY(1.2).translateZ(1.4));
  /* inverter darat + display */
  mfl.inv=boxT(1.0,1.3,.6,TEX.metal(),{metalness:.35});mfl.inv.position.set(-9.4,1.1,-1);scene.add(mfl.inv);
  mfl.inv.add(label('INVERTER DARAT 1 MW',.6).translateY(.95));
  mfl.D=makeDisplay(.85,.5,260,150);
  mfl.D.mesh.position.set(-9.4,1.3,-.68);scene.add(mfl.D.mesh);
  dispText(mfl.D,['STANDBY','—'],['#7d8f84','#7d8f84']);
  actMesh(mfl.D.mesh,'ON');
  mfl.t=0;mfl.on=false;
  moduleTick=(dt,T)=>{
    if(mfl.launched){mfl.ponton.position.y=.0+Math.sin(T*.8)*.05;
      mfl.ponton.rotation.z=Math.sin(T*.6)*.012;}
    if(mfl.on)dispText(mfl.D,[(0.92+Math.sin(T*.7)*.05).toFixed(2)+' MW','+8% vs darat ✓'],
      ['#46ff8e','#46ff8e']);};
  startSeq([
   {type:'act',aid:'PONTON',done:false,targets:()=>[mfl.ponton.children[1]],
    desc:'Luncurkan & rakit modul PONTON di air (klik ponton).',
    why:'HDPE marine-grade dirakit di tepi lalu ditarik perahu ke posisi — pin penghubung memberi sendi antar ponton agar array bisa BERGELOMBANG bersama air, bukan melawannya. Struktur kaku di air adalah struktur yang patah.',
    fx(){mfl.launched=true;mfl.ponton.position.set(1.5,0,-1);
      toast('🌊 Array mengapung di posisi — bergoyang sehat bersama riak.','ok',2800);}},
   {type:'act',aid:'ANGKUR',done:false,targets:()=>[mfl.angkur],
    desc:'Pasang ANGKUR dengan kelonggaran pasang-surut (klik angkur).',
    why:'Blok beton ke dasar + rantai dengan scope cukup: level waduk irigasi ini berayun 2,5 m antar musim. Angkur terlalu kencang = ponton tertarik tenggelam saat air naik; terlalu kendor = array berkelana menabrak tepi. Empat titik silang menjaga orientasi.',
    fx(){toast('⚓ 4 angkur terpasang — siap surut 2,5 m & angin musiman.','ok',2800);}},
   {type:'act',aid:'KABEL',done:false,targets:()=>[mfl.kabelBtn],
    desc:'Tarik KABEL MARINE dari array ke darat (klik rol kabel).',
    why:'Kabel tahan air & tekuk dinamis, diberi pelampung kecil + service loop di sambungan ponton-darat: tiap goyangan array diserap lengkungan, bukan tarikan. Kabel darat biasa di sini umurnya hitungan bulan — laut kecil pun tetap laut.',
    fx(){mfl.kabel.visible=true;mfl.kabelBtn.visible=false;
      toast('🔌 Kabel marine tertarik — service loop di tiap transisi.','ok',2800);}},
   {type:'act',aid:'ON',done:false,targets:()=>[mfl.D.mesh],
    desc:'Uji isolasi (basah!) lalu ENERGIZE (klik display).',
    why:'Riso diuji justru saat lembap — kondisi terjujur sistem terapung: 1,1 MΩ ✓. Inverter sinkron... 0,94 MW pada irradiance yang sama dengan referensi darat 0,87 MW: bonus pendinginan air +8% TERBUKTI. Panel ternyata suka berenang.',
    fx(){mfl.on=true;
      toast('☀️ 0,94 MW — +8% berkat pendinginan air. TERAPUNG & PRODUKTIF!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>PLTS terapung beroperasi!</b> Mengapung tapi terangkur, bergoyang tapi tersambung, basah tapi terisolasi — dan lebih produktif 8% dari saudaranya di darat. Permukaan waduk yang dulu menganggur kini bekerja.');
    setTimeout(()=>showWin('apung'),2200);});
  say('VOLTA di sini 🌊 Proyek paling segar: <b>PLTS di atas air</b>. Air memberi bonus pendinginan — tapi menagih hormat: semua bergerak, semua lembap. Tiga kunci: ponton bersendi, angkur longgar terukur, kabel marine. Luncurkan!');
  $('#modTitle').textContent='J10·M5 — PLTS Terapung';
  $('#taskHead').textContent='MENGAPUNG · TERANGKUR · PRODUKTIF';}
MISSIONS.apung.build=buildApung;
Object.assign(REAL,{
 apung:[
  'Studi bathymetri & variasi level waduk multi-tahun SEBELUM desain angkur — data, bukan perkiraan',
  'Koordinasi izin dengan pengelola waduk: fungsi irigasi/PLTA tetap prioritas pertama',
  'Jadwalkan inspeksi ponton & sambungan berkala (biofouling, UV, fatigue pin penghubung)',
  'Perhatikan keselamatan kerja di atas air: pelampung wajib, perahu standby, tak bekerja sendirian'],
});

/* =====================================================================
   MISI 6 — PLTS UTILITY-SCALE & POWER PLANT CONTROLLER
   ===================================================================== */
Object.assign(MISSIONS,{
 utility:{lvl:'JALUR 10 · PV & SOLAR · MISI 6',icon:'🏜️',title:'PLTS Utility-Scale & Power Plant Controller',strict:true,
  loc:'📍 PLTS 50 MWp · Ruang kontrol, hari interkoneksi',
  story:'Dari atap 5 kWp ke ladang 50 MWp: hamparan panel sejauh mata memandang, 12 inverter sentral, dan satu otak bernama PPC — power plant controller. Di skala ini PLTS bukan lagi "pemasang panel": ia PEMBANGKIT yang tunduk pada grid code, menerima perintah dispatcher, dan harus bisa menahan diri. Hari ini: uji interkoneksi disaksikan pengelola jaringan.',
  goal:'PLTS 50 MWp lulus uji interkoneksi: PPC mengendalikan seluruh inverter sebagai satu pembangkit, merespons setpoint daya & tegangan, dan lolos uji curtailment.',
  obj:['Verifikasi komunikasi PPC ke 12 inverter','Uji respons setpoint daya aktif (curtailment)','Uji kontrol reaktif & laporkan kelulusan'],
  learn:['PPC membuat 12 inverter tampil sebagai SATU pembangkit di titik interkoneksi — dispatcher bicara pada satu pintu, bukan dua belas','Curtailment adalah syarat naik kelas: pembangkit besar harus mau DIKURANGI outputnya saat sistem meminta — matahari gratis bukan alasan membangkang','PLTS modern menyumbang tegangan: inverter menyuntik/menyerap daya reaktif sesuai setpoint — ladang panel merangkap kapasitor raksasa','Grid code menguji semua itu sebelum COD: respons setpoint, ramp rate, ride-through — kelulusannya adalah akta lahir pembangkit'],
  next:['Pelajari grid code interkoneksi pembangkit EBT skala besar','Dalami forecasting produksi harian untuk dispatcher (day-ahead)','Eksplorasi PLTS + BESS utility: dispatchable solar plant']},
});
let muy={};
function buildUtility(){
  freshScene(0xe8d8b0,0x1a1812);
  cam={theta:.1,phi:1.1,r:12,target:new THREE.Vector3(0,1.5,-1)};
  const ground=boxT(30,.1,16,TEX.gravel());ground.position.y=-.05;scene.add(ground);
  /* ladang panel */
  for(let r=0;r<3;r++)for(let c=0;c<6;c++){
    const p=box(2.2,.05,1.0,0x16263e,{roughness:.25,metalness:.5});
    p.position.set(-9+c*2.6,.8,-5+r*1.6);p.rotation.x=-.3;scene.add(p);}
  scene.add(label('50 MWp — 110.000 PANEL',1.0).translateX(-2.5).translateY(2.6).translateZ(-4));
  /* inverter station */
  muy.inv=boxT(2.0,1.4,1.2,TEX.metal(),{metalness:.35});muy.inv.position.set(4.6,.75,-3.5);scene.add(muy.inv);
  scene.add(label('INVERTER STATION (1 dari 12)',.65).translateX(4.6).translateY(1.7).translateZ(-3.5));
  /* ruang kontrol + layar PPC */
  const frame=boxT(4.6,2.6,.16,TEX.metal(),{metalness:.4});frame.position.set(0,2.6,2.4);frame.rotation.y=Math.PI;scene.add(frame);
  muy.D=makeDisplay(4.3,2.3,580,330);
  muy.D.mesh.position.set(0,2.6,2.3);muy.D.mesh.rotation.y=Math.PI;scene.add(muy.D.mesh);
  actMesh(muy.D.mesh,'KOMUNIKASI');
  scene.add(label('POWER PLANT CONTROLLER',.85,'#5fd4ff').translateY(4.1).translateZ(2.3));
  muy.p=42.6;muy.set=50;muy.q=0;muy.curtail=false;
  function ppc(){
    const g=muy.D.g,W=580,H=330;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='700 19px Consolas';g.textAlign='left';
    g.fillStyle='#5fd4ff';g.fillText('PPC — 12/12 INVERTER ONLINE',16,34);
    g.fillStyle='#46ff8e';g.font='800 44px Consolas';
    g.fillText(muy.p.toFixed(1)+' MW',16,96);
    g.font='600 16px Consolas';g.fillStyle='#8aa3bd';
    g.fillText('setpoint: '+muy.set+' MW · Q: '+muy.q.toFixed(1)+' MVAr',16,128);
    g.fillText('irradiance 880 W/m² · ramp <10%/mnt',16,156);
    if(muy.curtail){g.fillStyle='#ffd23f';g.font='700 17px Consolas';
      g.fillText('CURTAILMENT AKTIF: dispatcher minta 30 MW',16,200);
      g.fillText('PPC membagi rata ke 12 inverter…',16,228);}
    msgBar(g,W,H);
    function msgBar(g,W,H){g.fillStyle='#13202f';g.fillRect(0,H-44,W,44);
      g.fillStyle='#8aa3bd';g.font='600 14px Consolas';
      g.fillText('uji disaksikan pengelola jaringan — log terekam',16,H-16);}
    muy.D.tex.needsUpdate=true;}
  ppc();
  moduleTick=(dt)=>{
    const target=muy.curtail?30:Math.min(muy.set,42.6);
    muy.p+=(target-muy.p)*dt*.5;
    if(Math.abs(muy.p-target)>.05)ppc();};
  /* panel uji dispatcher */
  muy.tes1=box(.6,.34,.14,0x8a5a2a);muy.tes1.position.set(-3.2,1.5,2.35);muy.tes1.rotation.y=Math.PI;scene.add(muy.tes1);
  actMesh(muy.tes1,'CURTAIL');
  scene.add(label('UJI CURTAILMENT',.55,'#e8c890').translateX(-3.2).translateY(1.95).translateZ(2.3));
  muy.tes2=box(.6,.34,.14,0x2a5a8a);muy.tes2.position.set(3.2,1.5,2.35);muy.tes2.rotation.y=Math.PI;scene.add(muy.tes2);
  actMesh(muy.tes2,'REAKTIF');
  scene.add(label('UJI DAYA REAKTIF',.55,'#9cc4ff').translateX(3.2).translateY(1.95).translateZ(2.3));
  startSeq([
   {type:'act',aid:'KOMUNIKASI',done:false,targets:()=>[muy.D.mesh],
    desc:'Verifikasi PPC ↔ 12 inverter: satu otak, dua belas otot (klik layar).',
    why:'Heartbeat tiap inverter hijau, latensi komunikasi <100 ms, failover diuji (satu link diputus — cadangan mengambil alih). PPC kini benar-benar memegang kendali: perintah satu titik, eksekusi serempak dua belas stasiun di ladang seluas 60 lapangan bola.',
    fx(){toast('📡 12/12 online · latensi 40ms · failover lolos.','ok',2800);}},
   {type:'act',aid:'CURTAIL',done:false,targets:()=>[muy.tes1],
    desc:'Dispatcher menguji: "turunkan ke 30 MW" — eksekusi CURTAILMENT.',
    why:'Matahari sedang murah hati (42,6 MW tersedia) tapi sistem sedang surplus — dispatcher meminta 30. PPC membagi pengurangan rata ke 12 inverter, output meluncur turun sesuai ramp rate... 30,0 MW, presisi. Membuang energi gratis terasa aneh? Itulah harga menjadi pembangkit dewasa.',
    fx(){muy.curtail=true;ppc();
      toast('📉 42,6 → 30,0 MW dalam ramp terkendali — dispatcher puas.','ok',3200);}},
   {type:'act',aid:'REAKTIF',done:false,targets:()=>[muy.tes2],
    desc:'Uji kedua: setpoint DAYA REAKTIF +8 MVAr untuk dukung tegangan.',
    why:'Tegangan titik interkoneksi sedikit rendah — pengelola meminta dukungan: inverter menggeser sudut arusnya, ladang panel menyuntik 8 MVAr seperti kapasitor bank raksasa. Tegangan terangkat 0,4 kV. PLTS modern menjual dua barang: energi DAN kualitas tegangan.',
    fx(){muy.q=8;ppc();
      toast('⚡ +8 MVAr tersuntik — tegangan interkoneksi terangkat ✓','ok',3000);}},
   {type:'act',aid:'LULUS',done:false,targets:()=>[muy.D.mesh],
    desc:'Semua uji hijau: tanda tangani BERITA ACARA kelulusan (klik layar).',
    why:'Respons setpoint ✓ ramp rate ✓ reaktif ✓ ride-through (diuji simulator) ✓ — pengelola jaringan menandatangani: PLTS 50 MWp resmi LULUS uji interkoneksi, COD pekan depan. Dari atap CV Berkah sampai ladang 50 MW: jalur surya-mu kini selengkap kurikulumnya.',
    fx(){toast('🏜️ LULUS GRID CODE — COD pekan depan. Pembangkit resmi lahir!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Pembangkit 50 MWp lulus ujian dewasa!</b> Dua belas inverter satu suara, curtailment dipatuhi, tegangan ikut dijaga. Di skala ini, kerendahan hati pada grid code adalah kekuatan yang sesungguhnya.');
    setTimeout(()=>showWin('utility'),2200);});
  const s0u=seq.steps[0],of0u=s0u.fx;s0u.fx=()=>{of0u();muy.D.mesh.userData.aid='LULUS';};
  say('VOLTA di sini 🏜️ Selamat datang di liga utama: <b>50 MWp, 12 inverter, satu PPC</b>. Hari ini pengelola jaringan datang menguji satu hal: bisakah pembangkit besarmu MENAHAN DIRI saat diminta? Buktikan dari layar PPC.');
  $('#modTitle').textContent='J10·M6 — PLTS Utility & PPC';
  $('#taskHead').textContent='SATU OTAK, DUA BELAS OTOT';}
MISSIONS.utility.build=buildUtility;
Object.assign(REAL,{
 utility:[
  'Pelajari grid code setempat sejak fase desain — retrofit kemampuan kontrol jauh lebih mahal',
  'Uji interkoneksi disaksikan & ditandatangani pengelola jaringan dengan rekaman data lengkap',
  'Siapkan forecasting produksi day-ahead untuk dispatcher — kewajiban operasional harian',
  'SCADA plant & PPC diberi redundansi + UPS: kehilangan kontrol = pembangkit liar di mata sistem'],
});

/* =====================================================================
   MISI 7 — AGRIVOLTAIK: PANEN GANDA SATU LAHAN
   ===================================================================== */
Object.assign(MISSIONS,{
 agri:{lvl:'JALUR 10 · PV & SOLAR · MISI 7',icon:'🌾',title:'Agrivoltaik: Panen Ganda Satu Lahan',strict:false,
  loc:'📍 Lahan pertanian Losarang · Pilot agrivoltaik 2 MWp',
  story:'Konflik klasik energi surya: PLTS butuh lahan, petani butuh lahan — dan biasanya yang kalah adalah sawah. Pilot project-mu menantang dikotomi itu: AGRIVOLTAIK, panel surya yang ditinggikan & dijarangkan agar cahaya tetap turun ke tanaman di bawahnya. Listrik di atas, cabai & kangkung di bawah, dan petani sebagai mitra — bukan korban pembebasan lahan.',
  goal:'Pilot agrivoltaik beroperasi dua panen: desain tinggi-jarak panel tepat untuk tanaman, instalasi tak merusak lahan, dan musim pertama membuktikan listrik + hasil tani berjalan bersama.',
  obj:['Desain geometri: tinggi & jarak antar baris untuk cahaya tanaman','Instalasi berpondasi minimal-gangguan + jalur traktor','Tanam, panen listrik & validasi hasil tani musim pertama'],
  learn:['Agrivoltaik bermain dengan cahaya: panel dijarangkan (GCR lebih rendah) & ditinggikan 3-4 m — tanaman menerima 60-80% cahaya, cukup bagi banyak komoditas','Tak semua tanaman cocok: sayuran daun & cabai toleran naungan parsial justru bisa LEBIH baik (kurang heat stress); padi & jagung penuh matahari kurang ideal','Pondasi & layout menghormati pertanian: jalur traktor antar baris, tiang di pematang, kabel udara/kedalaman aman bajak','Model kemitraan menentukan keberlanjutan: sewa lahan + petani tetap menggarap + bagi hasil listrik = tiga pendapatan di lahan yang sama'],
  next:['Pelajari riset kombinasi tanaman-GCR untuk iklim tropis','Dalami panel semi-transparan & tracker untuk agrivoltaik','Eksplorasi pendanaan: skema KUR tani + IPP kecil']},
});
let mag={};
function buildAgri(){
  freshScene(0xcfe8d0,0x14241a);
  cam={theta:.1,phi:1.1,r:10,target:new THREE.Vector3(0,1.8,-1)};
  /* lahan hijau */
  const lahan=box(26,.08,15,0x3a6a2a,{roughness:.95});lahan.position.y=0;scene.add(lahan);
  /* bedengan tanaman */
  for(let r=0;r<4;r++){const bed=box(10,.18,.8,0x4a3a22,{roughness:.95});
    bed.position.set(-1,.12,-3.5+r*1.9);scene.add(bed);}
  /* panel tinggi berjarak */
  mag.panels=[];
  for(let c=0;c<3;c++){
    const tiang1=cyl(.07,.07,3.4,0x8a8a8a);tiang1.position.set(-4+c*4,1.7,-3.2);scene.add(tiang1);
    const tiang2=tiang1.clone();tiang2.position.z=.6;scene.add(tiang2);
    const pv=box(2.6,.06,1.4,0x16263e,{roughness:.25,metalness:.5});
    pv.position.set(-4+c*4,3.4,-1.3);pv.rotation.x=-.18;scene.add(pv);mag.panels.push(pv);}
  actMesh(mag.panels[1],'DESAIN');
  scene.add(label('PANEL +3,5 m · BARIS JARANG',.8).translateY(4.4).translateZ(-1.3));
  /* traktor mini */
  const trak=box(1.0,.5,.7,0xd83a3a);trak.position.set(3.4,.45,.6);scene.add(trak);
  [[-.35,-.4],[.35,-.4],[-.35,.4],[.35,.4]].forEach(w=>{
    const wh=cyl(.2,.2,.14,0x14181d);wh.rotation.x=Math.PI/2;
    wh.position.set(3.4+w[0],.24,.6+w[1]);scene.add(wh);});
  scene.add(label('JALUR TRAKTOR',.55).translateX(3.4).translateY(1.1).translateZ(.6));
  /* petani mitra */
  mag.tani=new THREE.Group();
  const badan=cyl(.2,.26,.85,0x2a6a3a);badan.position.y=.7;mag.tani.add(badan);
  const kepala=new THREE.Mesh(new THREE.SphereGeometry(.14,14,12),
    new THREE.MeshStandardMaterial({color:0xc89878}));kepala.position.y=1.3;mag.tani.add(kepala);
  const caping=new THREE.Mesh(new THREE.ConeGeometry(.26,.14,14),
    new THREE.MeshStandardMaterial({color:0xc8a868}));caping.position.y=1.45;mag.tani.add(caping);
  mag.tani.position.set(-3.4,0,1.2);scene.add(mag.tani);
  actMesh(badan,'MITRA');
  scene.add(label('PAK TANI (mitra)',.6).translateX(-3.4).translateY(1.85).translateZ(1.2));
  /* tanaman cabai (tumbuh nanti) */
  mag.cabai=[];
  for(let i=0;i<6;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(.12,.4,8),
    new THREE.MeshStandardMaterial({color:0x2e7a2e,roughness:.9}));
    c.position.set(-3.5+i*1.1,.35,-2.55);c.visible=false;scene.add(c);mag.cabai.push(c);}
  /* display produksi ganda */
  mag.D=makeDisplay(1.9,1.1,400,230);
  mag.D.mesh.position.set(5.4,2.2,-2.6);scene.add(mag.D.mesh);
  dispText(mag.D,['PANEN GANDA','menunggu musim…'],['#5fd4ff','#7d8f84']);
  actMesh(mag.D.mesh,'PANEN');
  const pole=cyl(.04,.04,1.6,0x666666);pole.position.set(5.4,.8,-2.6);scene.add(pole);
  startSeq([
   {type:'act',aid:'DESAIN',done:false,targets:()=>[mag.panels[1]],
    desc:'Validasi DESAIN: tinggi & jarak baris vs kebutuhan cahaya (klik panel).',
    why:'Geometri adalah kontraknya: tinggi 3,5 m (traktor & orang lewat nyaman), GCR diturunkan — simulasi bayangan menunjukkan tanah menerima ±70% cahaya tahunan, merata karena bayangan BERGERAK sepanjang hari. Cabai & kangkung menyukai angka itu; kapasitas listrik memang turun per hektar — tapi lahannya kini berbuah dua.',
    fx(){toast('📐 +3,5 m · 70% cahaya ke tanah — kontrak dua panen sah.','ok',3200);}},
   {type:'act',aid:'MITRA',done:false,targets:()=>[mag.tani.children[0]],
    desc:'Teken KEMITRAAN dengan petani penggarap (klik Pak Tani).',
    why:'Bukan pembebasan, tapi perjodohan: sewa lahan dibayar + petani TETAP menggarap di bawah panel + bonus bagi hasil listrik kecil. Pak Tani awalnya curiga ("nanti sawahku gelap?") — simulasi cahaya & kunjungan ke pilot lain menjawabnya. Proyek energi yang berkelanjutan selalu punya tetangga yang tersenyum.',
    fx(){toast('🤝 Kemitraan: sewa + garap + bagi hasil — Pak Tani tersenyum.','ok',3200);}},
   {type:'act',aid:'TANAM',done:false,targets:()=>[mag.tani.children[0]],
    desc:'Instalasi selesai minim-gangguan — kini MUSIM TANAM dimulai.',
    why:'Tiang dipancang di pematang (bukan tengah bedengan), kabel digantung di ketinggian aman, dan tanah tak diaspal sejengkal pun. Cabai ditanam di bawah panel, kangkung di baris terbuka — eksperimen dua zona cahaya yang akan dijawab musim ini.',
    fx(){mag.cabai.forEach(c=>c.visible=true);
      toast('🌱 Tanam perdana: cabai di naungan, kangkung di terbuka.','ok',3000);}},
   {type:'act',aid:'PANEN',done:false,targets:()=>[mag.D.mesh],
    desc:'Musim pertama usai: baca hasil PANEN GANDA (klik display).',
    why:'Listrik: 2 MWp × profil tropis = sesuai proyeksi ✓. Tani: kangkung normal, cabai justru +8% (naungan parsial mengurangi stress panas & penguapan — kejutan yang juga ditemukan riset dunia). Satu lahan, dua panen, tiga pendapatan: dikotomi sawah-vs-surya hari ini resmi dibantah.',
    fx(){dispText(mag.D,['LISTRIK ✓ proyeksi','CABAI +8% 🌶'],['#46ff8e','#46ff8e']);
      toast('🌾 Panen ganda TERBUKTI — cabai malah +8%. Pilot sukses!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>Lahan yang menolak memilih!</b> Panel meninggi memberi jalan cahaya, petani jadi mitra bukan korban, dan cabai di bawah panel justru lebih subur. Agrivoltaik: masa depan di negeri yang tanahnya sempit dan mataharinya murah hati.');
    setTimeout(()=>showWin('agri'),2200);});
  const s1a=seq.steps[1],of1a=s1a.fx;s1a.fx=()=>{of1a();mag.tani.children[0].userData.aid='TANAM';};
  say('VOLTA di sini 🌾 Konflik klasik: PLTS butuh lahan, petani butuh lahan. Pilot hari ini membantahnya: <b>agrivoltaik — listrik di atas, cabai di bawah</b>. Kuncinya geometri cahaya & kemitraan yang adil. Mulai dari desain!');
  $('#modTitle').textContent='J10·M7 — Agrivoltaik';
  $('#taskHead').textContent='SATU LAHAN, DUA PANEN';}
MISSIONS.agri.build=buildAgri;
Object.assign(REAL,{
 agri:[
  'Uji komoditas bertahap musim demi musim — respons tanaman lokal terhadap naungan harus dibuktikan, bukan diasumsikan',
  'Perhatikan regulasi alih fungsi lahan pertanian — desain agrivoltaik justru argumen mempertahankan fungsi tani',
  'Struktur lebih tinggi = beban angin lebih besar: hitung pondasi & sertifikasi strukturnya',
  'Libatkan dinas pertanian & kelompok tani sejak desain — adopsi sosial menentukan umur proyek'],
});

/* =====================================================================
   MISI 8 — DRONE & AI: INSPEKSI PLTS DARI LANGIT
   ===================================================================== */
Object.assign(MISSIONS,{
 drone:{lvl:'JALUR 10 · PV & SOLAR · MISI 8',icon:'🚁',title:'Drone & AI: Inspeksi PLTS dari Langit',strict:false,
  loc:'📍 PLTS 50 MWp · Inspeksi tahunan 110.000 panel',
  story:'Ladang 50 MWp-mu punya 110.000 panel — inspeksi manual dengan thermal kamera genggam butuh tiga bulan dan sepasang lutut baja. Era baru tiba di kotak peli-case: DRONE thermal + AI. Satu penerbangan memotret ribuan panel; algoritma menandai yang demam. Tapi seperti semua alat hebat: hasilnya hanya sebaik perencanaan terbang & validasi manusianya.',
  goal:'Inspeksi udara tuntas: rencana terbang & izin benar, kondisi pemotretan valid, AI menandai anomali, divalidasi lapangan, dan laporan per-panel terbit dgn prioritas perbaikan.',
  obj:['Rencanakan misi: izin, jalur, parameter thermal','Terbang pada kondisi valid & kumpulkan data','Validasi temuan AI di darat & terbitkan prioritas'],
  learn:['Thermal udara valid hanya pada kondisinya: irradiance tinggi (>600 W/m²), langit cerah, sudut kamera benar — terbang asal = ribuan foto cantik tanpa makna diagnostik','AI mengklasifikasi pola panas: hotspot sel, string mati (sejajar dingin), diode bypass, soiling — ribuan panel tersaring jadi puluhan tersangka dalam semalam','AI menandai, manusia memvonis: validasi sampel di darat mengukur false positive — laporan tanpa validasi adalah daftar tebakan yang rapi','Hasil per-panel masuk peta digital aset: inspeksi tahun depan membandingkan panel yang SAMA — degradasi jadi cerita berseri, bukan potret lepas'],
  next:['Pelajari regulasi penerbangan drone komersial & sertifikasi pilot','Dalami radiometric thermal: membaca suhu absolut, bukan sekadar warna','Eksplorasi inspeksi otomatis terjadwal: drone-in-a-box']},
});
let mdr={};
function buildDrone(){
  freshScene(0xcfe2f0,0x16242f);
  cam={theta:.1,phi:1.1,r:11,target:new THREE.Vector3(0,2,-1)};
  const ground=boxT(28,.1,15,TEX.gravel());ground.position.y=-.05;scene.add(ground);
  /* ladang panel */
  for(let r=0;r<3;r++)for(let c=0;c<6;c++){
    const p=box(2.0,.05,1.0,0x16263e,{roughness:.25,metalness:.5});
    p.position.set(-8+c*2.5,.75,-4+r*1.7);p.rotation.x=-.28;scene.add(p);}
  scene.add(label('50 MWp · 110.000 PANEL',.9).translateX(-2).translateY(2.4).translateZ(-3));
  /* drone */
  mdr.drone=new THREE.Group();
  const bodyD=box(.4,.12,.4,0x18242f);mdr.drone.add(bodyD);
  [[-.3,-.3],[.3,-.3],[-.3,.3],[.3,.3]].forEach(o=>{
    const arm=box(.25,.04,.04,0x444b55);arm.position.set(o[0]*.6,.05,o[1]*.6);mdr.drone.add(arm);
    const rotor=cyl(.14,.14,.02,0x8aa3bd,10,{transparent:true,opacity:.5});
    rotor.position.set(o[0],.1,o[1]);mdr.drone.add(rotor);});
  const gimbal=box(.12,.12,.12,0xd8b020);gimbal.position.y=-.12;mdr.drone.add(gimbal);
  mdr.drone.position.set(5.5,.8,1.5);scene.add(mdr.drone);
  actMesh(bodyD,'TERBANG');
  scene.add(label('DRONE THERMAL',.65,'#5fd4ff').translateX(5.5).translateY(1.5).translateZ(1.5));
  /* ground station */
  mdr.gs=box(.6,.42,.08,0x2b3a4a);mdr.gs.position.set(7,1.0,.2);scene.add(mdr.gs);
  actMesh(mdr.gs,'RENCANA');
  const tbl=boxT(1.0,.07,.6,TEX.wood());tbl.position.set(7,.92,.2);scene.add(tbl);
  const tleg=boxT(.08,.92,.08,TEX.wood());tleg.position.set(7,.46,.2);scene.add(tleg);
  scene.add(label('GROUND STATION',.6,'#5fd4ff').translateX(7).translateY(1.5).translateZ(.2));
  /* layar AI hasil */
  const frame=boxT(3.4,2.0,.16,TEX.metal(),{metalness:.4});frame.position.set(0,2.6,3.2);frame.rotation.y=Math.PI;scene.add(frame);
  mdr.D=makeDisplay(3.1,1.7,520,300);
  mdr.D.mesh.position.set(0,2.6,3.1);mdr.D.mesh.rotation.y=Math.PI;scene.add(mdr.D.mesh);
  actMesh(mdr.D.mesh,'AI');
  scene.add(label('AI ANALYTICS',.8,'#5fd4ff').translateY(3.85).translateZ(3.1));
  mdr.mode=0;mdr.fly=false;mdr.t=0;
  function layar(){
    const g=mdr.D.g,W=520,H=300;
    g.fillStyle='#0a1018';g.fillRect(0,0,W,H);
    g.font='600 15px Consolas';g.textAlign='left';
    if(mdr.mode===0){g.fillStyle='#5d748c';g.font='700 16px Consolas';
      g.fillText('menunggu data penerbangan…',20,H/2);}
    else{
      /* mosaic thermal */
      for(let i=0;i<60;i++){
        const x=20+(i%12)*40,y=40+Math.floor(i/12)*40;
        const anom=[7,23,38,38,51].includes(i);
        g.fillStyle=anom?'#ff8d3a':'#2a4a6a';
        g.fillRect(x,y,34,30);}
      g.fillStyle='#ffd23f';g.font='700 16px Consolas';
      g.fillText(mdr.mode===1?'AI: 64 anomali dari 110.000 panel':'TERVALIDASI: 58 nyata · laporan terbit',20,26);
      if(mdr.mode===2){g.fillStyle='#46ff8e';g.font='600 14px Consolas';
        g.fillText('hotspot 31 · string mati 2 · diode 11 · soiling 14',20,H-16);}}
    mdr.D.tex.needsUpdate=true;}
  layar();
  moduleTick=(dt,T)=>{if(mdr.fly){mdr.t+=dt;
    mdr.drone.position.x=-6+((mdr.t*2.5)%14);
    mdr.drone.position.y=3.2;mdr.drone.position.z=-4+Math.floor((mdr.t*2.5)/14)%3*1.7;
    mdr.drone.children.forEach((c,i)=>{if(i>=5&&i<9)c.rotation.y+=dt*40;});}};
  startSeq([
   {type:'act',aid:'RENCANA',done:false,targets:()=>[mdr.gs],
    desc:'RENCANAKAN misi: izin, jalur, parameter thermal (klik ground station).',
    why:'Izin kawasan udara diurus, pilot bersertifikat, lalu parameter yang menentukan validitas: ketinggian 40 m (resolusi 3 cm/piksel — cukup melihat satu sel), overlap 70%, kamera tegak lurus panel, dan JADWAL: jam 11-13 saat irradiance >600 W/m² — panel bermasalah hanya "demam" saat bekerja keras. Misi thermal direncanakan seperti operasi: salah jam = data sia-sia.',
    fx(){toast('🗺️ Izin ✓ jalur 40m ✓ jadwal irradiance tinggi ✓','ok',3200);}},
   {type:'act',aid:'TERBANG',done:false,targets:()=>[mdr.drone.children[0]],
    desc:'TERBANGKAN: 32 menit untuk 110.000 panel (klik drone).',
    why:'Langit cerah, 870 W/m² — GO. Drone menyusuri jalur otomatis: dua kamera (thermal + visual) memotret serempak, RTK menandai posisi tiap frame presisi sentimeter. Tiga bulan kerja lutut manusia terselesaikan dalam setengah jam terbang — tapi ingat: ini baru pengumpulan; kecerdasan datang setelah mendarat.',
    fx(){mdr.fly=true;
      toast('🚁 4.180 pasang foto thermal+visual ber-RTK terkumpul.','ok',3200);}},
   {type:'act',aid:'AI',done:false,targets:()=>[mdr.D.mesh],
    desc:'Proses semalam: baca temuan AI (klik layar).',
    why:'Algoritma memilah pola panas: 64 anomali tertanda — hotspot sel (titik panas tunggal), 2 string DINGIN sejajar (mati — tak bekerja sama sekali!), diode bypass aktif (sepertiga panel hangat), dan pola soiling. Dari 110.000 menjadi 64: AI bukan menggantikan inspektor — ia membuang 99,9% pekerjaan membosankannya.',
    fx(){mdr.fly=false;mdr.mode=1;layar();
      toast('🤖 64 tersangka dari 110.000 panel — saatnya validasi.','ok',3200);}},
   {type:'act',aid:'VALID',done:false,targets:()=>[mdr.D.mesh],
    desc:'AI menandai, manusia memvonis: VALIDASI sampel di darat (klik layar).',
    why:'20 sampel didatangi dgn thermal genggam & IV-tracer: 18 benar, 2 false positive (pantulan awan tipis) — akurasi 90%, bias diketahui. Laporan final: 58 temuan nyata ber-prioritas (2 string mati = rugi terbesar, perbaiki minggu ini!), tiap panel ber-ID & koordinat, masuk peta aset untuk dibandingkan tahun depan. Dari langit ke spreadsheet ke obeng: lingkaran inspeksi modern.',
    fx(){mdr.mode=2;layar();
      toast('📋 58 valid ber-prioritas — 2 string mati dieksekusi dulu!','ok',3400);sfx.big();}},
  ],()=>{say('🎉 <b>110.000 panel terperiksa dalam sehari!</b> Misi direncanakan seperti operasi, drone memotret saat panel "berkeringat", AI menyaring, manusia memvonis. Inspeksi modern: lutut diganti baling-baling, kebosanan diganti algoritma — dan keputusan tetap milik engineer.');
    setTimeout(()=>showWin('drone'),2200);});
  const s2d=seq.steps[2],of2d2=s2d.fx;s2d.fx=()=>{of2d2();mdr.D.mesh.userData.aid='VALID';};
  say('VOLTA di sini 🚁 110.000 panel vs sepasang lutut manusia — tidak adil. Era baru di peli-case: <b>drone thermal + AI</b>. Tapi ingat: data hanya valid bila terbangnya benar. Rencanakan dulu!');
  $('#modTitle').textContent='J10·M8 — Drone & AI Inspeksi';
  $('#taskHead').textContent='AI MENANDAI, MANUSIA MEMVONIS';}
MISSIONS.drone.build=buildDrone;
Object.assign(REAL,{
 drone:[
  'Patuh regulasi penerbangan drone (izin wilayah, ketinggian, sertifikasi pilot) — legalitas dulu',
  'Catat kondisi saat terbang (irradiance, suhu, angin) di metadata — interpretasi thermal bergantung padanya',
  'Bangun baseline: inspeksi pertama adalah pembanding seumur hidup aset — konsistensi parameter penting',
  'Gabungkan dgn data inverter/string monitoring — anomali thermal + data listrik = vonis paling kuat'],
});
