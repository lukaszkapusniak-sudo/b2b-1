'use strict';
/* ═══════════════════════════════════════════════
   onAudience Sales Intelligence Hub — hub.js
   SEED · Supabase · All logic · Panel registry
═══════════════════════════════════════════════ */

/* ── SEED data ── */
const SEED = [
  ['6sense','POC client','poc','Intent Data / ABM','US',null,8,'6sense.com','6sense'],
  ['Adform','integrated partner / DSP Europe','partner','DSP','Europe',838,9,'site.adform.com','adform'],
  ['Admixer','no outreach','nogo','Ad Tech','UA',null,4,'admixer.com','admixer'],
  ['Adobe','partner — DMP integration','partner','DMP / CDP','US',null,7,'adobe.com','adobe'],
  ['Adtonos','client','client','Audio Ad Tech','PL',null,7,'adtonos.com','adtonos'],
  ['Alikeaudience','client','client','Audience Data / DMP','US/APAC',null,10,'alikeaudience.com','alikeaudience'],
  ['Aniview','no outreach — failed deal','nogo','Video Ad Tech','IL',null,3,'aniview.com','aniview'],
  ['Anzu','POC client','poc','In-Game Advertising','US/UK',null,8,'anzu.io','anzu'],
  ['Amazon','partner','partner','DSP / E-Commerce','US',null,8,'amazon.com','amazon'],
  ['Audigent','partner / curation','partner','Data / Curation','US',null,8,'audigent.com','audigent'],
  ['Bango','prospect — via LiveRamp','prospect','Telco Data / Identity','UK',null,7,'bango.com','bango'],
  ['Beintoo','prospect — to continue','prospect','Mobile Data','IT',null,7,'beintoo.com','beintoo'],
  ['Belogic TR','partner','partner','DSP / Turkey','TR',null,6,'belogic.com','belogic'],
  ['Bidtheatre','partner / DSP Scandinavia','partner','DSP','SE',null,7,'bidtheatre.com','bidtheatre'],
  ['Bright Mountain Media','prospect — to continue','prospect','Media / Data','US',null,6,'brightmountainmedia.com',''],
  ['Bytedance (TikTok)','client — APAC only','client','Social / DSP','CN/APAC',null,8,'bytedance.com','bytedance'],
  ['Captify UK','client','client','Search Intelligence','UK',null,8,'captify.com','captify'],
  ['Claritas','prospect — to continue','prospect','Data Provider','US',null,7,'claritas.com','claritas'],
  ['Criteo','partner — contact: Adrian','partner','Retargeting / DSP','FR',null,8,'criteo.com','criteo'],
  ['Datonics','client','client','Programmatic Data','US',null,10,'datonics.com','datonics'],
  ['Dynata','no outreach — former client','nogo','Market Research','US',null,4,'dynata.com','dynata'],
  ['Echo Analytics','POC client','poc','Location Data','FR',null,8,'echo-analytics.io',''],
  ['Entity X','client — Adrian','client','Data / Identity','US',null,8,'entityx.com',''],
  ['Epsilon','partner — Matt deal','partner','Data / CRM / DSP','US',null,8,'epsilon.com','epsilon'],
  ['Equativ','partner / SSP curation','partner','SSP','FR',null,8,'equativ.com','equativ'],
  ['Experian','prospect — Karo/Maciek','prospect','Credit / Data','UK',null,8,'experian.com','experian'],
  ['Eyeota','partner','partner','Data Marketplace','SG/US',null,8,'eyeota.com','eyeota'],
  ['Foursquare','partner','partner','Location Data','US',null,7,'foursquare.com','foursquare'],
  ['Fyllo','partner','partner','Data / Compliance','US',null,7,'fyllo.com','fyllo'],
  ['Google','partner','partner','DSP / DMP','US',null,8,'google.com','google'],
  ['Havas PL','client / agency','client','Media Agency','PL',null,8,'havas.com','havas'],
  ['Hybrid','partner','partner','DSP / CEE','PL',null,8,'hybrid.ai','hybrid'],
  ['ID5','partner / cookieless product','partner','Identity','FR',null,9,'id5.io','id5'],
  ['Intuizi','client — Adrian','client','Telco Data','US',null,8,'intuizi.com',''],
  ['Kochava','partner / data provider','partner','Mobile / Attribution','US',null,7,'kochava.com','kochava'],
  ['LiveRamp','partner / marketplace','partner','Data Connectivity','US',null,9,'liveramp.com','liveramp'],
  ['Madhive','prospect / DSP — Karolina','prospect','CTV / DSP','US',null,9,'madhive.com','madhive'],
  ['Mastercard','partner','partner','Payment Data','US',null,8,'mastercard.com','mastercard'],
  ['MediaWallah','partner / data exchange','partner','Identity / Data','US',null,7,'mediawallah.com',''],
  ['MeMob','client','client','Mobile Advertising','US',null,7,'memob.com',''],
  ['Meta','no outreach — via LiveRamp only','nogo','Social DSP','US',null,5,'meta.com','meta'],
  ['Microsoft Advertising (Xandr)','partner','partner','DSP / Search','US',null,9,'microsoft.com','microsoft'],
  ['Mindvalley','POC client — no renewal','poc','EdTech','MY/US',null,5,'mindvalley.com','mindvalley'],
  ['MNTN','partner / DSP','partner','CTV DSP','US',null,8,'mountain.com','mntn'],
  ['Mobilewalla','client','client','Mobile Data','US',null,8,'mobilewalla.com','mobilewalla'],
  ['Moboost','client','client','Mobile DSP','EU',null,7,'moboost.com',''],
  ['Multilocal','client — Adrian','client','Local DSP','UK',null,8,'multilocal.com',''],
  ['Nexxen','prospect','prospect','CTV / DSP','US',null,8,'nexxen.com','nexxen'],
  ['Nielsen','no outreach','nogo','Measurement','US',null,4,'nielsen.com','nielsen'],
  ['OpenSignal','client','client','Telco Analytics','UK',null,7,'opensignal.com','opensignal'],
  ['OpenX','prospect','prospect','SSP','US',null,7,'openx.com','openx'],
  ['Oracle','no outreach — closed ad division','nogo','Tech / Data','US',null,3,'oracle.com','oracle'],
  ['Permutive','client','client','Publisher DMP','UK',null,9,'permutive.com','permutive'],
  ['Pubmatic','partner','partner','SSP','US',null,7,'pubmatic.com','pubmatic'],
  ['RTB House','no business','nogo','Retargeting DSP','PL',null,4,'rtbhouse.com','rtbhouse'],
  ['Samba TV','prospect','prospect','CTV / ACR Data','US',null,9,'samba.tv','sambatv'],
  ['Scoota','prospect','prospect','DOOH / Programmatic','UK',null,7,'scoota.com',''],
  ['Semantec','client','client','Contextual Data','EU',null,7,'semantec.com',''],
  ['Semasio','partner — acquired by Fyllo','partner','Contextual / Data','DE',null,7,'semasio.com','semasio'],
  ['Sharethrough','partner / data exchange','partner','Native / SSP','US',null,7,'sharethrough.com','sharethrough'],
  ['Sovrn','client — Adrian','client','Publisher Monetization','US',null,8,'sovrn.com','sovrn'],
  ['Sportradar','prospect — Karolina','prospect','Sports Data','CH',null,8,'sportradar.com','sportradar'],
  ['Taboola','prospect — via MSFT Curate','prospect','Native / DSP','US/IL',null,7,'taboola.com','taboola'],
  ['TheTradeDesk','partner','partner','DSP','US',null,10,'thetradedesk.com','thetradedesk'],
  ['TikTok','partner — via Bytedance','partner','Social DSP','US/CN',null,8,'tiktok.com','tiktok'],
  ['True Data','client','client','Retail / Purchase Data','JP',null,8,'true-data.co.jp',''],
  ['VentiveIQ','prospect — Maciek + Adrian','prospect','Identity / Data','US',null,8,'ventiveiq.com',''],
  ['VistarMedia (T-Mobile)','prospect','prospect','DOOH DSP','US',null,8,'vistarmedia.com','vistarmedia'],
  ['Wowcher','client','client','E-Commerce / Vouchers','UK',null,7,'wowcher.co.uk',''],
  ['Zeotap','client','client','CDP / Identity','DE',null,9,'zeotap.com','zeotap'],
  ['Beklever','prospect','prospect','DSP / CEE','EU',null,7,'beklever.com',''],
  ['Havas Spain','prospect','prospect','Media Agency','ES',null,7,'havas.com','havas'],
  ['Dentsu Thailand','prospect','prospect','Media Agency','TH',null,7,'dentsu.com','dentsu'],
  ['OMD Thailand','prospect','prospect','Media Agency','TH',null,7,'omd.com','omd'],
  ['Splicky DSP','prospect','prospect','Mobile DSP','DE',null,7,'splicky.com',''],
  ['Stackadapt','prospect','prospect','DSP','CA/US',null,9,'stackadapt.com','stackadapt'],
  ['Weborama','prospect','prospect','Semantic Data','FR',null,7,'weborama.com','weborama'],
];

let companies = SEED.map(([n,note,t,cat,reg,sz,icp,web,li]) => ({
  name:n, note:note||'', type:t||classify(note),
  icp:icp||null, category:cat||null, region:reg||null,
  size:sz||null, website:web||null, linkedin_slug:li||null
}));
let contacts = [];

/* ── Supabase ── */
const SB_URL = 'https://nyzkkqqjnkctcmxoirdj.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55emtrcXFqbmtjdGNteG9pcmRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzMxMzYsImV4cCI6MjA4OTQ0OTEzNn0.jhAq_C68klOp4iTyj9HmsyyvoxsOI6ACld7t_87TAk0';

function sbFetch(path, opts) {
  return fetch(SB_URL + path, {
    ...opts,
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', ...(opts||{}).headers }
  });
}

async function loadFromSupabase() {
  try {
    const [cRes, ctRes] = await Promise.race([
      Promise.all([sbFetch('/rest/v1/companies?select=*&order=name.asc'), sbFetch('/rest/v1/contacts?select=*')]),
      new Promise((_,r) => setTimeout(() => r(new Error('timeout')), 8000))
    ]);
    if (cRes.ok) {
      const data = await cRes.json();
      if (data && data.length) {
        companies = data.map(r => ({
          name:r.name||'', note:r.note||'', type:r.type||classify(r.note||''),
          icp:r.icp||null, category:r.category||null, region:r.region||null,
          size:r.size||null, website:r.website||null, linkedin_slug:r.linkedin_slug||null
        }));
      }
    }
    if (ctRes && ctRes.ok) { const d = await ctRes.json(); if (d) contacts = d; }
    setStatus('live', `● Live · ${companies.length}`);
  } catch(e) { setStatus('seed', `○ Seed · ${companies.length}`); }
  updateStats(); renderList();
  if (leftTab === 'contacts') renderContactsList();
  document.getElementById('ptab-badge-dashboard').textContent = companies.length;
}

function setStatus(mode, text) {
  document.getElementById('statusText').textContent = text;
  document.getElementById('statusDot').className = 'status-dot ' + mode;
}

/* ── Helpers ── */
function classify(n) {
  const s = (n||'').toLowerCase();
  if (s.includes('no outreach')||s.includes('no fit')||s.includes('no business')||
      s.includes('internal')||s.includes('closed')||s.includes('unwanted')) return 'nogo';
  if (s.includes('poc')) return 'poc';
  if (s.includes('client')) return 'client';
  if (s.includes('partner')) return 'partner';
  if (s.includes('prospect')||s.includes('to check')||s.includes('to continue')) return 'prospect';
  return 'prospect';
}
function av(n) {
  const p=[['#9FE1CB30','#0F6E56'],['#B5D4F430','#1A4F8A'],['#FAC77530','#7A4200'],['#C0DD9730','#3B6D11'],['#F4C0D130','#993556']];
  let h=0; for (let c of n) h=(h*31+c.charCodeAt(0))&0xffff; return p[h%p.length];
}
function ini(n) { return n.replace(/[^A-Za-z ]/g,'').split(' ').filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase()||'?'; }
function tagCls(s) { return {client:'tc',partner:'tp',prospect:'tpr',nogo:'tn',poc:'tpo'}[s]||'tpr'; }
function tagLbl(s) { return {client:'Client',partner:'Partner',prospect:'Prospect',nogo:'No outreach',poc:'Active Deal'}[s]||'Prospect'; }
function stars(n) { return n?'★'.repeat(Math.min(5,Math.round(n/2)))+'☆'.repeat(Math.max(0,5-Math.min(5,Math.round(n/2)))):'' }
function esc(s) { return (s||'').replace(/'/g,"\\'"); }
function domainOf(url) { try { return new URL(url.includes('://')?url:'https://'+url).hostname.replace('www.',''); } catch { return url.replace(/^https?:\/\/(www\.)?/,'').split('/')[0]; } }

/* ── Scoring ── */
function contactScore(ct) {
  const fields = [{key:'full_name',label:'Name'},{key:'title',label:'Title'},{key:'email',label:'Email'},{key:'linkedin_url',label:'LinkedIn'}];
  const results = fields.map(f => ({label:f.label, has:!!(ct[f.key]&&ct[f.key].trim())}));
  const pct = Math.round(results.filter(r=>r.has).length/fields.length*100);
  return {fields:results, pct};
}
function companyScore(c) {
  const fields = ['category','region','size','website','linkedin_slug','icp','note'];
  const results = fields.map(f => ({label:f, has:!!(c[f])}));
  results.push({label:'Contacts', has: contactsForCompany(c.name).length > 0});
  const pct = Math.round(results.filter(r=>r.has).length/results.length*100);
  return {fields:results, pct};
}
function contactsForCompany(name) {
  const n = name.toLowerCase();
  return contacts.filter(ct => {
    const cn = (ct.company_name||'').toLowerCase();
    return cn === n || cn.includes(n) || n.includes(cn);
  });
}

/* ── Stats / Filter / Render ── */
let activeFilter = 'all', selectedName = null, leftTab = 'companies';

function isFresh(c) { return c.type === 'prospect'; }

function getFiltered() {
  const q = (document.getElementById('searchQ').value||'').toLowerCase();
  return companies.filter(c => {
    if (activeFilter==='fresh' && !isFresh(c)) return false;
    if (activeFilter!=='all' && activeFilter!=='fresh' && c.type!==activeFilter) return false;
    if (q) { const hay=(c.name+c.note+(c.category||'')+(c.region||'')).toLowerCase(); if (!hay.includes(q)) return false; }
    return true;
  });
}

function updateStats() {
  document.getElementById('st-all').textContent = companies.length;
  document.getElementById('st-client').textContent = companies.filter(c=>c.type==='client').length;
  document.getElementById('st-poc').textContent = companies.filter(c=>c.type==='poc').length;
  document.getElementById('st-partner').textContent = companies.filter(c=>c.type==='partner').length;
  document.getElementById('st-prospect').textContent = companies.filter(c=>c.type==='prospect').length;
  document.getElementById('st-nogo').textContent = companies.filter(c=>c.type==='nogo').length;
  document.getElementById('st-fresh').textContent = companies.filter(isFresh).length;
  document.getElementById('ptab-badge-dashboard').textContent = companies.length;
}

function renderList() {
  const filtered = getFiltered();
  document.getElementById('listMeta').textContent = `${filtered.length} of ${companies.length}`;
  const list = document.getElementById('coList');
  if (!filtered.length) { list.innerHTML = '<div style="padding:24px;text-align:center;font-family:IBM Plex Mono,monospace;font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.07em">No results</div>'; return; }
  list.innerHTML = filtered.map(c => {
    const [bg,fg] = av(c.name);
    const sel = c.name===selectedName ? ' selected' : '';
    const enc = encodeURIComponent(c.name);
    const meta = c.category ? `${c.category}${c.region?' · '+c.region:''}` : (c.note.slice(0,40)||'—');
    const {pct} = companyScore(c);
    const dotCls = pct>=75?'full':pct>=40?'partial':'empty';
    return `<div class="co-row${sel}" draggable="true"
      ondragstart="startDrag(event,'${enc}','company')"
      onclick="openDetail('${enc}')"
      oncontextmenu="showCtx(event,'${enc}');return false">
      <div class="av" style="background:${bg};border-color:${fg}30;color:${fg}">${ini(c.name)}</div>
      <div style="flex:1;min-width:0"><div class="rn">${c.name}</div><div class="rno">${meta}</div></div>
      <div class="co-right">
        ${c.icp?`<span class="icp-n">${c.icp}</span>`:''}
        <span class="tag ${tagCls(c.type)}">${tagLbl(c.type)}</span>
        <div class="ct-dot ${dotCls}" title="${pct}% complete"></div>
      </div></div>`;
  }).join('');
}

function setFilter(f) {
  activeFilter = f;
  document.querySelectorAll('.sc').forEach(b=>b.classList.remove('active'));
  const sc = document.getElementById('sc-'+f); if (sc) sc.classList.add('active');
  document.querySelectorAll('.fp').forEach(b=>b.classList.remove('active'));
  renderList();
}
function setFpActive(el) { document.querySelectorAll('.fp').forEach(b=>b.classList.remove('active')); el.classList.add('active'); }

/* ── Left panel tabs ── */
function switchLeftTab(tab) {
  leftTab = tab;
  document.querySelectorAll('.lp-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.lp-sub').forEach(s=>s.classList.remove('active'));
  document.getElementById('lptab-'+tab).classList.add('active');
  document.getElementById('lpsub-'+tab).classList.add('active');
  if (tab==='contacts') renderContactsList();
  if (tab!=='companies') { selectedName=null; resetCenter(); }
}

function renderContactsList() {
  const q = (document.getElementById('searchQ').value||'').toLowerCase();
  let list = contacts.filter(ct => !q || (ct.full_name+ct.title+ct.company_name+ct.email+'').toLowerCase().includes(q));
  list = [...list].sort((a,b)=>(a.full_name||'').localeCompare(b.full_name||''));
  document.getElementById('ctListMeta').textContent = `${list.length} of ${contacts.length}`;
  const el = document.getElementById('ctList');
  if (!list.length) { el.innerHTML='<div style="padding:24px;text-align:center;font-family:IBM Plex Mono,monospace;font-size:10px;color:var(--t3);text-transform:uppercase">No contacts</div>'; return; }
  el.innerHTML = list.map(ct => {
    const {pct} = contactScore(ct);
    const dotCls = pct>=75?'full':pct>=40?'partial':'empty';
    const enc = encodeURIComponent(ct.id||ct.full_name||'');
    return `<div class="ct-row" draggable="true" ondragstart="startDrag(event,'${enc}','contact')" onclick="openContactDrawer('${enc}')">
      <div class="ct-row-av">${ini(ct.full_name||'?')}</div>
      <div class="ct-row-info"><div class="ct-row-name">${ct.full_name||'—'}</div>
      <div class="ct-row-sub">${ct.title||''}${ct.title&&ct.company_name?' · ':''}${ct.company_name||''}</div></div>
      <div class="ct-dot ${dotCls}" title="${pct}% complete"></div></div>`;
  }).join('');
}

/* ── Contact drawer ── */
function openContactDrawer(enc) {
  const key = decodeURIComponent(enc);
  const ct = contacts.find(c=>(c.id||c.full_name||'')===key)||contacts.find(c=>c.full_name===key);
  if (!ct) return;
  const {fields,pct} = contactScore(ct);
  const barColor = pct>=75?'#22C55E':pct>=50?'var(--prc)':'var(--por)';
  const [,fg] = av(ct.full_name||ct.company_name||'?');
  document.getElementById('drawerAv').style.cssText=`background:${fg}20;color:${fg};border:1px solid ${fg}40;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:700`;
  document.getElementById('drawerAv').textContent=ini(ct.full_name||'?');
  document.getElementById('drawerName').textContent=ct.full_name||'—';
  document.getElementById('drawerRole').textContent=ct.title||'No title';
  document.getElementById('drawerBody').innerHTML=`
    <div style="margin-bottom:10px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
        <div style="flex:1;height:4px;background:var(--surf4);border-radius:2px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${barColor};border-radius:2px"></div></div>
        <span style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--t3)">${pct}% complete</span>
      </div>
      <div style="display:flex;gap:4px;flex-wrap:wrap">${fields.map(f=>`<span class="ct-field ${f.has?'has':'miss'}">${f.has?'✓':'○'} ${f.label}</span>`).join('')}</div>
    </div>
    <table class="info" style="margin-bottom:10px">
      <tr><td>Company</td><td>${ct.company_name||'—'}</td></tr>
      <tr><td>Title</td><td>${ct.title||'—'}</td></tr>
      <tr><td>Email</td><td>${ct.email?`<span style="font-family:'IBM Plex Mono',monospace;font-size:10px">${ct.email}</span>`:'—'}</td></tr>
      <tr><td>LinkedIn</td><td>${ct.linkedin_url?`<a class="ml" href="${ct.linkedin_url}" target="_blank">Profile ↗</a>`:'—'}</td></tr>
      ${ct.notes?`<tr><td>Notes</td><td style="font-size:11px;color:var(--t2)">${ct.notes}</td></tr>`:''}
    </table>
    <div style="display:flex;gap:5px;flex-wrap:wrap">
      <button class="btn p sm" onclick="openMeeseeks({company:'${esc(ct.company_name||'')}',contactName:'${esc(ct.full_name||'')}',contactTitle:'${esc(ct.title||'')}',email:'${esc(ct.email||'')}'})">✉ Meeseeks</button>
      <button class="btn sm" onclick="addToBattleground('contact','${esc(ct.full_name||'')}','${esc(ct.title||'')}','${esc(ct.company_name||'')}')">⚔ Battleground</button>
      <button class="btn sm" onclick="openClaude('Check Gmail for prior contact with ${esc(ct.full_name||'')} at ${esc(ct.company_name||'')}')">📧 Gmail</button>
    </div>`;
  document.getElementById('ctDrawer').classList.add('open');
  document.getElementById('ctDrawerOverlay').classList.add('vis');
  if (ct.company_name) {
    const match = companies.find(c=>c.name.toLowerCase()===ct.company_name.toLowerCase())||companies.find(c=>c.name.toLowerCase().includes(ct.company_name.toLowerCase())||ct.company_name.toLowerCase().includes(c.name.toLowerCase()));
    if (match) openDetail(encodeURIComponent(match.name));
  }
}
function closeDrawer() { document.getElementById('ctDrawer').classList.remove('open'); document.getElementById('ctDrawerOverlay').classList.remove('vis'); }

/* ── Contact card renderer ── */
function renderContactCard(ct) {
  const {fields,pct} = contactScore(ct);
  const [,fg] = av(ct.full_name||ct.company_name||'?');
  const barColor = pct>=75?'var(--g)':pct>=50?'var(--prc)':'var(--por)';
  return `<div class="ct-card">
    <div class="ct-top">
      <div class="ct-circ" style="background:${fg}18;color:${fg};border-color:${fg}30">${ini(ct.full_name||'?')}</div>
      <div class="ct-meta"><div class="ct-cname">${ct.full_name||'—'}</div><div class="ct-crole">${ct.title||'No title'}</div></div>
      <button class="btn sm" onclick="openMeeseeks({company:'${esc(ct.company_name||'')}',contactName:'${esc(ct.full_name||'')}',contactTitle:'${esc(ct.title||'')}',email:'${esc(ct.email||'')}'})">✉</button>
    </div>
    <div class="ct-fields">${fields.map(f=>`<span class="ct-field ${f.has?'has':'miss'}">${f.has?'✓':'○'} ${f.label}</span>`).join('')}</div>
    <div class="ct-completeness"><div class="ct-bar-wrap"><div class="ct-bar" style="width:${pct}%;background:${barColor}"></div></div><span class="ct-pct">${pct}% complete</span></div>
    ${ct.email?`<div style="margin-top:5px;font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--t3)">${ct.email}</div>`:''}
  </div>`;
}

/* ── Company detail ── */
function openDetail(enc) {
  const name = decodeURIComponent(enc);
  selectedName = name;
  renderList();
  const c = companies.find(x=>x.name===name); if (!c) return;
  const [,fg] = av(name);
  const domain = c.website ? domainOf(c.website) : '';
  const coContacts = contactsForCompany(name);
  const {pct:coPct} = companyScore(c);
  const coBarColor = coPct>=75?'#22C55E':coPct>=50?'var(--prc)':'var(--por)';
  const peopleHtml = coContacts.length ? coContacts.map(renderContactCard).join('') : '<div class="ct-no-contacts">No contacts in database yet</div>';
  const peopleCount = coContacts.length?`<span style="font-family:'IBM Plex Mono',monospace;font-size:9px;background:var(--surf3);border:1px solid var(--rule);border-radius:2px;padding:1px 5px;color:var(--t3)">${coContacts.length}</span>`:'';

  document.getElementById('centerPanel').innerHTML = `<div class="co-detail">
    <div class="det-header">
      <div class="det-av" style="background:${fg}">${ini(name)}</div>
      <div style="flex:1;min-width:0">
        <div class="det-name">${name}<span class="tag ${tagCls(c.type)}">${tagLbl(c.type)}</span>${domain?`<a class="ml" href="https://${domain}" target="_blank">${domain} ↗</a>`:''}</div>
        <div class="det-sub">${c.category||''}${c.region?' · '+c.region:''}</div>
        ${c.icp?`<div style="margin-top:4px;font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--g)">${stars(c.icp)} <span style="color:var(--t3)">${c.icp}/10 ICP</span></div>`:''}
        <div style="display:flex;align-items:center;gap:8px;margin-top:5px">
          <div style="width:100px;height:3px;background:var(--surf4);border-radius:2px;overflow:hidden"><div style="height:100%;width:${coPct}%;background:${coBarColor};border-radius:2px"></div></div>
          <span style="font-family:'IBM Plex Mono',monospace;font-size:8px;color:var(--t3)">${coPct}% data complete</span>
        </div>
      </div>
      <div class="det-actions">
        <button class="btn p sm" onclick="openClaude('Research ${esc(name)} — full contact report')">Full report ↗</button>
        <button class="btn sm" onclick="openMeeseeks({company:'${esc(name)}',note:'${esc(c.note)}',category:'${esc(c.category||'')}',icp:${c.icp||0}})">✉ Meeseeks</button>
        <button class="btn sm" onclick="addToBattleground('company','${esc(name)}','${esc(c.note)}','')">⚔ Battleground</button>
      </div>
    </div>
    <div class="section">
      <div class="sec-hdr"><span>🏢</span><span class="sec-lbl">Overview</span></div>
      <div class="sec-body"><table class="info">
        <tr><td>Status</td><td><span class="tag ${tagCls(c.type)}">${tagLbl(c.type)}</span></td></tr>
        ${c.category?`<tr><td>Category</td><td>${c.category}</td></tr>`:''}
        ${c.region?`<tr><td>Region</td><td>${c.region}</td></tr>`:''}
        ${c.size?`<tr><td>Size</td><td>${c.size} employees</td></tr>`:''}
        ${c.icp?`<tr><td>ICP Score</td><td>${stars(c.icp)} ${c.icp}/10</td></tr>`:''}
        ${c.note?`<tr><td>Note</td><td>${c.note}</td></tr>`:''}
        ${domain?`<tr><td>Website</td><td><a class="ml" href="https://${domain}" target="_blank">${domain} ↗</a></td></tr>`:''}
        ${c.linkedin_slug?`<tr><td>LinkedIn</td><td><a class="ml" href="https://linkedin.com/company/${c.linkedin_slug}" target="_blank">↗ profile</a></td></tr>`:''}
      </table></div>
    </div>
    <div class="section">
      <div class="sec-hdr"><span>👤</span><span class="sec-lbl">People</span>${peopleCount}
        <button class="btn sm" style="margin-left:auto" onclick="openClaude('Find Head of Programmatic or Data Partnerships at ${esc(name)} — LinkedIn, email, background')">+ Find</button>
      </div>
      <div class="sec-body" style="padding:8px 10px">${peopleHtml}</div>
    </div>
    <div class="section">
      <div class="sec-hdr"><span>⚡</span><span class="sec-lbl">Actions</span></div>
      <div class="sec-body"><div class="act-row">
        <button class="btn sm" onclick="openClaude('Research ${esc(name)} — full contact report, decision makers, ICP fit')">🔍 Full report</button>
        <button class="btn sm" onclick="openClaude('Find decision makers at ${esc(name)} — LinkedIn, email')">👤 Find DMs</button>
        <button class="btn sm p" onclick="openMeeseeks({company:'${esc(name)}',note:'${esc(c.note)}'})">✉ Meeseeks</button>
        <button class="btn sm" onclick="addToBattleground('company','${esc(name)}','${esc(c.note)}','')">⚔ Battleground</button>
        <button class="btn sm" onclick="openClaude('Find companies similar to ${esc(name)} for onAudience outreach — top 10 by ICP fit')">🔗 Similar</button>
        <button class="btn sm" onclick="openClaude('Check Gmail for prior contact with ${esc(name)}')">📧 Gmail</button>
      </div></div>
    </div>
    <div class="section">
      <div class="sec-hdr"><span>🔗</span><span class="sec-lbl">Quick Links</span></div>
      <div class="sec-body"><table class="info">
        <tr><td>People</td><td><a class="ml" href="https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(name+' Head Programmatic Data Partnerships')}" target="_blank">LinkedIn ↗</a></td></tr>
        <tr><td>Research</td><td><a class="ml" href="https://www.google.com/search?q=${encodeURIComponent(name+' programmatic data partnerships')}" target="_blank">Google ↗</a></td></tr>
      </table></div>
    </div>
  </div>`;
}

function resetCenter() {
  document.getElementById('centerPanel').innerHTML = `<div class="qa-grid">
    <div class="qa-card" onclick="promptModal('Research a company','Enter company name:','Research [COMPANY] — full contact report, decision makers, ICP fit')"><div class="qa-icon">🔍</div><div class="qa-title">Company Research</div><div class="qa-desc">Full contact report</div></div>
    <div class="qa-card" onclick="openClaude('Find new DSP, SSP and media agency prospects for onAudience in EMEA — not in database, strong programmatic signals')"><div class="qa-icon">🎯</div><div class="qa-title">Find Prospects</div><div class="qa-desc">EMEA focus</div></div>
    <div class="qa-card" onclick="switchPageTab('meeseeks')"><div class="qa-icon">✉️</div><div class="qa-title">MEESEEKS</div><div class="qa-desc">Open email composer</div></div>
    <div class="qa-card" onclick="switchPageTab('battleground')"><div class="qa-icon">⚔️</div><div class="qa-title">Battleground</div><div class="qa-desc">Plan outreach campaign</div></div>
    <div class="qa-card" onclick="openClaude('Re-engage dormant onAudience prospects — not contacted in 60+ days, ranked by ICP fit')"><div class="qa-icon">♻️</div><div class="qa-title">Re-engage</div><div class="qa-desc">Dormant prospects</div></div>
    <div class="qa-card" onclick="openClaude('Top 5 highest-priority onAudience prospects to contact this week')"><div class="qa-icon">⭐</div><div class="qa-title">Top Picks</div><div class="qa-desc">This week</div></div>
  </div>`;
}

/* ── Context menu ── */
function showCtx(e, enc) {
  e.preventDefault(); e.stopPropagation();
  const name = decodeURIComponent(enc);
  const c = companies.find(x=>x.name===name);
  const menu = document.getElementById('ctxMenu');
  const actions = [
    {icon:'🔍',text:'Full contact report',   fn:()=>openClaude(`Research ${name} — full contact report`)},
    {icon:'👤',text:'Find decision makers',   fn:()=>openClaude(`Find Head of Programmatic at ${name} — LinkedIn, email`)},
    {icon:'✉️',text:'Open in Meeseeks',       fn:()=>openMeeseeks({company:name,note:c?.note,category:c?.category,icp:c?.icp})},
    {icon:'⚔️',text:'Add to Battleground',    fn:()=>addToBattleground('company',name,c?.note||'','')},
    {icon:'🔗',text:'Find similar companies', fn:()=>openClaude(`Find companies similar to ${name} for onAudience outreach — top 10`)},
    {icon:'📧',text:'Check Gmail',            fn:()=>openClaude(`Check Gmail for prior contact with ${name}`)},
  ];
  if (c?.type==='nogo') actions.push({icon:'⚠️',text:'Why no outreach?', fn:()=>openClaude(`Explain why ${name} is marked no-outreach`)});
  if (c?.type==='prospect') actions.push({icon:'🚀',text:'Prioritize',   fn:()=>openClaude(`Make the case for prioritizing ${name} this quarter`)});
  menu.innerHTML=`<div class="ctx-lbl">${name}</div><div class="ctx-sep"></div>`+actions.map((a,i)=>`<div class="ctx-item" data-i="${i}"><span class="ctx-ico">${a.icon}</span>${a.text}</div>`).join('');
  menu.querySelectorAll('.ctx-item').forEach((el,i)=>el.addEventListener('click',()=>{menu.style.display='none';actions[i].fn();}));
  const x=Math.min(e.clientX,window.innerWidth-240), y=Math.min(e.clientY,window.innerHeight-actions.length*38-60);
  menu.style.left=x+'px'; menu.style.top=y+'px'; menu.style.display='block';
}
document.addEventListener('click',()=>document.getElementById('ctxMenu').style.display='none');

/* ── Page tabs ── */
const PANEL_SRCS = { meeseeks: 'meeseeks-composer.html', battleground: 'battleground-panel.html' };
let panelLoaded = {};

function switchPageTab(tab) {
  document.querySelectorAll('.ptab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tab-page').forEach(p=>p.classList.remove('active'));
  document.getElementById('ptab-'+tab).classList.add('active');
  document.getElementById('tab-'+tab).classList.add('active');
  if (PANEL_SRCS[tab]) {
    const iframe = document.getElementById(tab+'-iframe');
    if (!panelLoaded[tab]) {
      iframe.src = PANEL_SRCS[tab];
      panelLoaded[tab] = true;
      iframe.onload = () => syncThemeToPanel(iframe);
    }
  }
}

function syncThemeToPanel(iframe) {
  try { iframe.contentWindow.postMessage({type:'THEME_SYNC',payload:{theme}}, '*'); } catch(e) {}
}

/* ── Panel messaging ── */
function openMeeseeks(payload) {
  switchPageTab('meeseeks');
  const iframe = document.getElementById('meeseeks-iframe');
  const send = () => { try { iframe.contentWindow.postMessage({type:'COMPOSE_PREFILL',payload}, '*'); } catch(e) {} };
  if (panelLoaded.meeseeks && iframe.contentDocument?.readyState==='complete') send();
  else iframe.addEventListener('load', send, {once:true});
}

function addToBattleground(kind, name, meta, company) {
  switchPageTab('battleground');
  const iframe = document.getElementById('battleground-iframe');
  const payload = {uid:name, kind, name, meta, company: company||name};
  const send = () => { try { iframe.contentWindow.postMessage({type:'ADD_TO_BATTLEGROUND',payload}, '*'); } catch(e) {} };
  if (panelLoaded.battleground && iframe.contentDocument?.readyState==='complete') send();
  else iframe.addEventListener('load', send, {once:true});
}

window.addEventListener('message', e => {
  const d = e.data; if (!d||!d.type) return;
  if (d.type === 'LAUNCH_BATTLE') {
    // Battleground launches into Meeseeks with full context
    openMeeseeks(d.payload);
  }
  if (d.type === 'OPEN_URL') { window.open(d.payload?.url, '_blank'); }
});

/* ── Drag & drop ── */
function startDrag(e, enc, kind) {
  const name = decodeURIComponent(enc);
  const data = kind==='company'
    ? { kind, name, meta: companies.find(c=>c.name===name)?.note||'', uid:name }
    : (() => { const ct=contacts.find(c=>(c.id||c.full_name||'')===name||c.full_name===name); return {kind,name,meta:ct?.title||'',company:ct?.company_name||'',uid:name,email:ct?.email||'',linkedin:ct?.linkedin_url||''}; })();
  e.dataTransfer.setData('application/json', JSON.stringify(data));
  e.dataTransfer.effectAllowed = 'copy';
  e.currentTarget.classList.add('dragging');
  e.currentTarget.addEventListener('dragend', ()=>e.currentTarget.classList.remove('dragging'), {once:true});
}

function setupTabDropZones() {
  ['ptab-meeseeks','ptab-battleground'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('dragover', e => { e.preventDefault(); el.classList.add('drop-glow'); });
    el.addEventListener('dragleave', () => el.classList.remove('drop-glow'));
    el.addEventListener('drop', e => {
      e.preventDefault(); el.classList.remove('drop-glow');
      let data; try { data = JSON.parse(e.dataTransfer.getData('application/json')); } catch { return; }
      if (id==='ptab-meeseeks') openMeeseeks({company:data.company||data.name, contactName:data.kind==='contact'?data.name:'', contactTitle:data.meta, description:data.meta});
      else addToBattleground(data.kind, data.name, data.meta, data.company||'');
    });
  });
}

/* ── Modal ── */
let _modalTemplate = '';
function promptModal(title, desc, template) {
  _modalTemplate = template;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalDesc').textContent = desc;
  document.getElementById('modalInput').value = '';
  document.getElementById('overlay').classList.add('vis');
  setTimeout(()=>document.getElementById('modalInput').focus(), 50);
}
function closeModal() { document.getElementById('overlay').classList.remove('vis'); }
function submitModal() {
  const val = document.getElementById('modalInput').value.trim(); if (!val) return;
  closeModal();
  openClaude(_modalTemplate.replace('[COMPANY]', val));
}
function doResearch() {
  const q = document.getElementById('searchQ').value.trim();
  if (q) openClaude(`Research ${q} — full contact report with decision makers, outreach angle, ICP fit`);
  else promptModal('Research a company', 'Enter company name:', 'Research [COMPANY] — full contact report with decision makers, outreach angle, ICP fit');
}

/* ── Theme ── */
let theme = localStorage.getItem('oaTheme')||'light';
document.documentElement.setAttribute('data-theme', theme);
function toggleTheme() {
  theme = theme==='light'?'dark':'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('oaTheme', theme);
  document.getElementById('themeBtn').textContent = theme==='dark'?'☀️':'🌙';
  Object.keys(PANEL_SRCS).forEach(tab => {
    if (panelLoaded[tab]) syncThemeToPanel(document.getElementById(tab+'-iframe'));
  });
}

/* ── Utility ── */
function openClaude(prompt) { window.open('https://claude.ai/new?q='+encodeURIComponent(prompt), '_blank'); }

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('themeBtn').textContent = theme==='dark'?'☀️':'🌙';
  document.getElementById('modalInput').addEventListener('keydown', e=>{
    if (e.key==='Enter'&&!e.shiftKey){e.preventDefault();submitModal();}
  });
  document.getElementById('overlay').addEventListener('click', e=>{
    if (e.target===document.getElementById('overlay')) closeModal();
  });
  updateStats(); renderList(); resetCenter(); setupTabDropZones();
  setStatus('seed', `○ Seed · ${companies.length}`);
  loadFromSupabase();
});
