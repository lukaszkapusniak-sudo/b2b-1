'use strict';
/* ═══════════════════════════════════════════════
   onAudience Sales Intelligence Hub — hub.js v3
   Unified: Dashboard · Battleground · MEESEEKS
═══════════════════════════════════════════════ */

/* ── SEED ── */
const SEED = [
  ['6sense','POC client','poc','Intent Data / ABM','US',null,8,'6sense.com','6sense'],
  ['Adform','integrated partner / DSP Europe','partner','DSP','Europe',838,9,'site.adform.com','adform'],
  ['Admixer','no outreach','nogo','Ad Tech','UA',null,4,'admixer.com','admixer'],
  ['Adobe','partner — DMP integration','partner','DMP / CDP','US',null,7,'adobe.com','adobe'],
  ['Adtonos','client','client','Audio Ad Tech','PL',null,7,'adtonos.com','adtonos'],
  ['Alikeaudience','client','client','Audience Data / DMP','US/APAC',null,10,'alikeaudience.com','alikeaudience'],
  ['Anzu','POC client','poc','In-Game Advertising','US/UK',null,8,'anzu.io','anzu'],
  ['Amazon','partner','partner','DSP / E-Commerce','US',null,8,'amazon.com','amazon'],
  ['Audigent','partner / curation','partner','Data / Curation','US',null,8,'audigent.com','audigent'],
  ['Bango','prospect — via LiveRamp','prospect','Telco Data / Identity','UK',null,7,'bango.com','bango'],
  ['Beintoo','prospect — to continue','prospect','Mobile Data','IT',null,7,'beintoo.com','beintoo'],
  ['Bidtheatre','partner / DSP Scandinavia','partner','DSP','SE',null,7,'bidtheatre.com','bidtheatre'],
  ['Bytedance (TikTok)','client — APAC only','client','Social / DSP','CN/APAC',null,8,'bytedance.com','bytedance'],
  ['Captify UK','client','client','Search Intelligence','UK',null,8,'captify.com','captify'],
  ['Claritas','prospect — to continue','prospect','Data Provider','US',null,7,'claritas.com','claritas'],
  ['Criteo','partner — contact: Adrian','partner','Retargeting / DSP','FR',null,8,'criteo.com','criteo'],
  ['Datonics','client','client','Programmatic Data','US',null,10,'datonics.com','datonics'],
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
  ['Meta','no outreach — via LiveRamp only','nogo','Social DSP','US',null,5,'meta.com','meta'],
  ['Microsoft Advertising (Xandr)','partner','partner','DSP / Search','US',null,9,'microsoft.com','microsoft'],
  ['MNTN','partner / DSP','partner','CTV DSP','US',null,8,'mountain.com','mntn'],
  ['Mobilewalla','client','client','Mobile Data','US',null,8,'mobilewalla.com','mobilewalla'],
  ['Moboost','client','client','Mobile DSP','EU',null,7,'moboost.com',''],
  ['Multilocal','client — Adrian','client','Local DSP','UK',null,8,'multilocal.com',''],
  ['Nexxen','prospect','prospect','CTV / DSP','US',null,8,'nexxen.com','nexxen'],
  ['OpenSignal','client','client','Telco Analytics','UK',null,7,'opensignal.com','opensignal'],
  ['OpenX','prospect','prospect','SSP','US',null,7,'openx.com','openx'],
  ['Permutive','client','client','Publisher DMP','UK',null,9,'permutive.com','permutive'],
  ['Pubmatic','partner','partner','SSP','US',null,7,'pubmatic.com','pubmatic'],
  ['Samba TV','prospect','prospect','CTV / ACR Data','US',null,9,'samba.tv','sambatv'],
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
  ['Stackadapt','prospect','prospect','DSP','CA/US',null,9,'stackadapt.com','stackadapt'],
  ['Weborama','prospect','prospect','Semantic Data','FR',null,7,'weborama.com','weborama'],
  ['Havas Spain','prospect','prospect','Media Agency','ES',null,7,'havas.com','havas'],
  ['Dentsu Thailand','prospect','prospect','Media Agency','TH',null,7,'dentsu.com','dentsu'],
];

/* ── MEESEEKS Personas ── */
const MEESEEKS = [
  {id:'jobs',     icon:'🍎',name:'Steve',   tag:'Visionary', color:'#1A1A1A',
   style:'Visionary, future-first. Makes the prospect feel they are about to miss a defining moment. References transformation, not features.'},
  {id:'obama',    icon:'🎙',name:'Barack',  tag:'Inspiring', color:'#1A4F8A',
   style:'Hopeful, inclusive, builds common ground before the ask. Appeals to shared mission and long-term relationship.'},
  {id:'ogilvy',   icon:'📰',name:'David',   tag:'Research',  color:'#146B3A',
   style:'Opens with a specific, research-backed insight. Proof before promise. Quote-worthy specificity.'},
  {id:'bezos',    icon:'📦',name:'Jeff',    tag:'Metrics',   color:'#CC6600',
   style:'Customer-outcome first. Every claim has a number. Thinks in flywheel effects and compounding returns.'},
  {id:'gary',     icon:'⚡',name:'Gary',    tag:'No-BS',     color:'#CC2222',
   style:'Zero preamble. Direct ask. Respects the recipient time aggressively. No filler words.'},
  {id:'thatcher', icon:'🗝',name:'Maggie',  tag:'Conviction',color:'#7A4200',
   style:'No-nonsense, states the case once, expects a decision. Conviction-led, no soft hedging.'},
  {id:'churchill',icon:'🏛',name:'Winston', tag:'Rallying',  color:'#4B2D9E',
   style:'Rallies around shared stakes. Makes the prospect feel part of something bigger. Grand scale framing.'},
  {id:'elon',     icon:'🚀',name:'Elon',    tag:'Disruptive',color:'#4B4B4B',
   style:'Challenges the status quo. First-principles framing. Makes existing approaches seem outdated.'},
  {id:'maya',     icon:'🌊',name:'Maya',    tag:'Story',     color:'#993556',
   style:'Opens with a human moment or short story. Emotional resonance before logic. Poetic economy of words.'},
  {id:'oprah',    icon:'✨',name:'Oprah',   tag:'Authentic', color:'#8B5E3C',
   style:'Personal, warm, genuine. Makes the recipient feel seen and understood. Deep empathy, no corporate speak.'},
];

const OA_TAXONOMY = `onAudience Audience Segments:
INTEREST: Automotive (Auto Intenders, Luxury, EV), Beauty, Business & Finance (B2B Decision Makers, SMB Owners, C-Suite), Education, Family & Parenting, Food & Drink, Health & Fitness (Gym, Wellness, Pharma), Hobbies, Home & Garden (DIY, Real Estate Intenders), Lifestyle (Eco, Luxury, Value), Personal Finance (Investors, Mortgage, Insurance), Retail & Shopping (eCommerce, Fashion, Electronics), Sports (Football, Basketball, F1, Fitness), Technology (IT Decision Makers, Early Adopters, Gamers), Travel (Business, Luxury, Budget)
CTV: Premium Viewers, Binge Watchers, Sports Viewers, Time-of-Day (Prime Time, Early Morning, Late Fringe), Genre (Drama, Reality, Comedy)
BRAND AFFINITY: 624 brands — Auto (BMW, Mercedes, Tesla), Finance (Amex, Visa), Retail (Amazon, ASOS, Zara), Tech (Apple, Google, Samsung), Travel (Booking.com, Ryanair)
DEMOGRAPHIC: Age (18-24, 25-34, 35-54, 55+), HHI tiers, Homeowners, Parents, Students, Gender
GEOGRAPHIC: EU country-level, US DMA, UK region, APAC market, city-level`;

/* ── Config ── */
const SB_URL = 'https://nyzkkqqjnkctcmxoirdj.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55emtrcXFqbmtjdGNteG9pcmRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzMxMzYsImV4cCI6MjA4OTQ0OTEzNn0.jhAq_C68klOp4iTyj9HmsyyvoxsOI6ACld7t_87TAk0';
const SB_HDR = { 'Content-Type':'application/json', apikey:SB_KEY, Authorization:`Bearer ${SB_KEY}` };
const PROXY  = `${SB_URL}/functions/v1/claude-proxy`;

/* ── State ── */
let companies = SEED.map(([n,note,t,cat,reg,sz,icp,web,li]) => ({
  name:n, note:note||'', type:t||classify(note),
  icp:icp||null, category:cat||null, region:reg||null,
  size:sz||null, website:web||null, linkedin_slug:li||null
}));
let contacts = [];

// Navigation
let activeTab    = 'dashboard';
let leftTab      = 'companies';
let activeFilter = 'all';
let selectedName = null;
let selection    = new Map();

// Battleground
let battlegrounds = [], cur = null, bgDirty = false, originalName = '';
let selectedOpps  = new Set();
let pickerTab     = 'companies';

// MEESEEKS
let selectedMs = null;
let queue = [], queueIdx = 0;
let apiKey = localStorage.getItem('oaApiKey') || '';
let theme  = localStorage.getItem('oaTheme')  || 'light';

/* ── Helpers ── */
function av(n){const p=[['#9FE1CB30','#0F6E56'],['#B5D4F430','#1A4F8A'],['#FAC77530','#7A4200'],['#C0DD9730','#3B6D11'],['#F4C0D130','#993556']];let h=0;for(let c of n)h=(h*31+c.charCodeAt(0))&0xffff;return p[h%p.length];}
function ini(n){return n.replace(/[^A-Za-z ]/g,'').split(' ').filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase()||'?';}
function tagCls(s){return{client:'tc',partner:'tp',prospect:'tpr',nogo:'tn',poc:'tpo'}[s]||'tpr';}
function tagLbl(s){return{client:'Client',partner:'Partner',prospect:'Prospect',nogo:'No outreach',poc:'Active Deal'}[s]||'Prospect';}
function stars(n){return n?'★'.repeat(Math.min(5,Math.round(n/2)))+'☆'.repeat(Math.max(0,5-Math.min(5,Math.round(n/2)))):'';}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');}
function escJs(s){return String(s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,' ');}
function domainOf(u){try{return new URL(u.includes('://')?u:'https://'+u).hostname.replace('www.','');}catch{return u.replace(/^https?:\/\/(www\.)?/,'').split('/')[0];}}
function classify(n){const s=(n||'').toLowerCase();if(s.includes('no outreach')||s.includes('no fit')||s.includes('no business')||s.includes('internal')||s.includes('closed'))return'nogo';if(s.includes('poc'))return'poc';if(s.includes('client'))return'client';if(s.includes('partner'))return'partner';if(s.includes('prospect')||s.includes('to check')||s.includes('to continue'))return'prospect';return'prospect';}
function fmtTime(iso){if(!iso)return'';const d=new Date(iso),now=new Date(),diff=now-d;if(diff<60000)return'just now';if(diff<3600000)return Math.floor(diff/60000)+'m ago';if(diff<86400000)return Math.floor(diff/3600000)+'h ago';return d.toLocaleDateString('en-GB',{day:'numeric',month:'short'});}
function bgIcon(s){return{draft:'✏️',active:'⚔️',paused:'⏸️',archived:'📦'}[s]||'✏️';}
function catIcon(cat){
  if(!cat)return'';
  const c=cat.toLowerCase();
  if(c.includes('dsp'))return'🖥';
  if(c.includes('ssp'))return'📡';
  if(c.includes('agency')||c.includes('media buy'))return'🏢';
  if(c.includes('data provider')||c.includes('programmatic data'))return'🗄';
  if(c.includes('dmp')||c.includes('cdp'))return'🧩';
  if(c.includes('identity')||c.includes('id5')||c.includes('cookieless'))return'🔑';
  if(c.includes('ctv')||c.includes('connected tv'))return'📺';
  if(c.includes('location')||c.includes('geo'))return'📍';
  if(c.includes('mobile'))return'📱';
  if(c.includes('publisher')||c.includes('ssp'))return'📰';
  if(c.includes('telco'))return'📶';
  if(c.includes('retail')||c.includes('commerce'))return'🛒';
  if(c.includes('b2b'))return'💼';
  if(c.includes('intent'))return'🎯';
  if(c.includes('native'))return'✍️';
  if(c.includes('measurement')||c.includes('analytics'))return'📊';
  if(c.includes('contextual')||c.includes('semantic'))return'🔍';
  return'';
}

/* ── Supabase ── */
async function sbGet(p){const r=await fetch(SB_URL+p,{headers:SB_HDR});if(!r.ok)throw new Error(`sbGet ${r.status}`);return r.json();}
async function sbPost(p,b,ex={}){return fetch(SB_URL+p,{method:'POST',headers:{...SB_HDR,...ex},body:JSON.stringify(b)});}
async function sbPatch(p,b){return fetch(SB_URL+p,{method:'PATCH',headers:SB_HDR,body:JSON.stringify(b)});}
async function sbDel(p){return fetch(SB_URL+p,{method:'DELETE',headers:SB_HDR});}

async function loadAll(){
  setStatus('','Loading…');
  try{
    const [co,ct,bgs]=await Promise.all([
      sbGet('/rest/v1/companies?select=*&order=name.asc'),
      sbGet('/rest/v1/contacts?select=*'),
      sbGet('/rest/v1/battlegrounds?select=*&order=updated_at.desc'),
    ]);
    if(co&&co.length) companies=co.map(r=>({name:r.name||'',note:r.note||'',type:r.type||classify(r.note||''),icp:r.icp||null,category:r.category||null,region:r.region||null,size:r.size||null,website:r.website||null,linkedin_slug:r.linkedin_slug||null}));
    if(ct) contacts=ct;
    if(bgs) battlegrounds=bgs;
    setStatus('live',`● ${companies.length} co · ${contacts.length} ct · ${battlegrounds.length} bg`);
  }catch(e){
    setStatus('err','○ DB error');
    console.error('loadAll:',e);
  }
  updateStats();renderList();
  document.getElementById('ptab-badge-co').textContent=companies.length;
  document.getElementById('ptab-badge-bg').textContent=battlegrounds.length;
  renderBgList();
  if(battlegrounds.length) openBg(battlegrounds[0].id);
  else renderHistoryPanel();
}

function setStatus(mode,txt){
  document.getElementById('statusText').textContent=txt;
  document.getElementById('statusDot').className='status-dot'+(mode==='live'?' live':mode==='err'?' err':mode==='seed'?' seed':'');
}

/* ── Scoring ── */
function contactScore(ct){const f=[{key:'full_name',label:'Name'},{key:'title',label:'Title'},{key:'email',label:'Email'},{key:'linkedin_url',label:'LinkedIn'}];const r=f.map(x=>({label:x.label,has:!!(ct[x.key]&&ct[x.key].trim())}));return{fields:r,pct:Math.round(r.filter(x=>x.has).length/f.length*100)};}
function companyScore(c){const f=['category','region','size','website','linkedin_slug','icp','note'];const r=f.map(x=>({label:x,has:!!c[x]}));r.push({label:'Contacts',has:contactsFor(c.name).length>0});return{fields:r,pct:Math.round(r.filter(x=>x.has).length/r.length*100)};}
function contactsFor(name){const n=name.toLowerCase();return contacts.filter(ct=>{const cn=(ct.company_name||'').toLowerCase();return cn===n||cn.includes(n)||n.includes(cn);});}

/* ── Stats / Filter ── */
function isFresh(c){return c.type==='prospect';}
function getFiltered(){
  const q=(document.getElementById('searchQ').value||'').toLowerCase();
  return companies.filter(c=>{
    if(activeFilter==='fresh'&&!isFresh(c))return false;
    if(activeFilter!=='all'&&activeFilter!=='fresh'&&c.type!==activeFilter)return false;
    if(q){const h=(c.name+c.note+(c.category||'')+(c.region||'')).toLowerCase();if(!h.includes(q))return false;}
    return true;
  });
}
function updateStats(){
  const m=(t)=>companies.filter(c=>c.type===t).length;
  document.getElementById('st-all').textContent=companies.length;
  document.getElementById('st-client').textContent=m('client');
  document.getElementById('st-poc').textContent=m('poc');
  document.getElementById('st-partner').textContent=m('partner');
  document.getElementById('st-prospect').textContent=m('prospect');
  document.getElementById('st-nogo').textContent=m('nogo');
  document.getElementById('st-fresh').textContent=companies.filter(isFresh).length;
  document.getElementById('ptab-badge-co').textContent=companies.length;
}
function setFilter(f){
  activeFilter=f;
  document.querySelectorAll('.lp-sc').forEach(b=>b.classList.remove('active'));
  const sc=document.getElementById('sc-'+f);if(sc)sc.classList.add('active');
  renderList();
}
function setFpActive(el){document.querySelectorAll('.fp').forEach(b=>b.classList.remove('active'));el.classList.add('active');}

/* ── Left panel render ── */
function renderList(){
  const filtered=getFiltered();
  document.getElementById('listMeta').textContent=`${filtered.length} of ${companies.length}`;
  const list=document.getElementById('coList');
  if(!filtered.length){list.innerHTML='<div style="padding:16px;text-align:center;font-family:IBM Plex Mono,monospace;font-size:9px;color:var(--t3);text-transform:uppercase">No results</div>';return;}
  list.innerHTML=filtered.map(c=>{
    const [bg,fg]=av(c.name);
    const sel=c.name===selectedName?' selected':'';
    const cbSel=selection.has(c.name)?' cb-selected':'';
    const enc=encodeURIComponent(c.name);
    const meta=c.category?`${catIcon(c.category)} ${c.category}${c.region?' · '+c.region:''}`:(c.note.slice(0,36)||'—');
    const {pct}=companyScore(c);
    const dotCls=pct>=75?'full':pct>=40?'partial':'empty';
    return `<div class="co-row${sel}${cbSel}" draggable="true"
      ondragstart="startDrag(event,'${enc}','company')"
      onclick="openDetail('${enc}')"
      oncontextmenu="showCtx(event,'${enc}');return false">
      <div class="co-cb${selection.has(c.name)?' checked':''}" onclick="toggleSelect('${enc}','company',event)"></div>
      <div class="av" style="background:${bg};border-color:${fg}30;color:${fg}">${ini(c.name)}</div>
      <div style="flex:1;min-width:0"><div class="rn">${c.name}</div><div class="rno">${meta}</div></div>
      <div class="co-right">
        ${c.icp?`<span class="icp-n">${c.icp}</span>`:''}
        <span class="tag ${tagCls(c.type)}" style="font-size:7px">${tagLbl(c.type).slice(0,3)}</span>
        <div class="ct-dot ${dotCls}" title="${pct}%"></div>
      </div></div>`;
  }).join('');
}

function renderContactsList(){
  const q=(document.getElementById('searchQ').value||'').toLowerCase();
  let list=[...contacts].filter(ct=>!q||(ct.full_name+ct.title+ct.company_name+ct.email+'').toLowerCase().includes(q));
  list.sort((a,b)=>(a.full_name||'').localeCompare(b.full_name||''));
  document.getElementById('ctListMeta').textContent=`${list.length} of ${contacts.length}`;
  const el=document.getElementById('ctList');
  if(!list.length){el.innerHTML='<div style="padding:16px;text-align:center;font-family:IBM Plex Mono,monospace;font-size:9px;color:var(--t3)">No contacts</div>';return;}
  el.innerHTML=list.map(ct=>{
    const {pct}=contactScore(ct);
    const dotCls=pct>=75?'full':pct>=40?'partial':'empty';
    const uid=ct.id||ct.full_name||'';
    const enc=encodeURIComponent(uid);
    const cbSel=selection.has(uid)?' cb-selected':'';
    return `<div class="ct-row${cbSel}" draggable="true" ondragstart="startDrag(event,'${enc}','contact')" onclick="openContactDrawer('${enc}')">
      <div class="co-cb${selection.has(uid)?' checked':''}" onclick="toggleSelect('${enc}','contact',event)"></div>
      <div class="ct-row-av">${ini(ct.full_name||'?')}</div>
      <div class="ct-row-info"><div class="ct-row-name">${ct.full_name||'—'}</div>
      <div class="ct-row-sub">${ct.title||''}${ct.title&&ct.company_name?' · ':''}${ct.company_name?catIcon(companies.find(c=>c.name.toLowerCase()===ct.company_name?.toLowerCase())?.category||'')+' '+ct.company_name:''}</div></div>
      <div class="ct-dot ${dotCls}" title="${pct}%"></div></div>`;
  }).join('');
}

function switchLeftTab(tab){
  leftTab=tab;
  document.querySelectorAll('.lp-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.lp-sub').forEach(s=>s.classList.remove('active'));
  document.getElementById('lptab-'+tab).classList.add('active');
  document.getElementById('lpsub-'+tab).classList.add('active');
  if(tab==='contacts') renderContactsList();
  if(tab!=='companies'){selectedName=null;}
}

/* ── Multi-select ── */
function toggleSelect(enc,kind,event){
  event&&event.stopPropagation();
  const uid=decodeURIComponent(enc);
  if(selection.has(uid)) selection.delete(uid);
  else{
    if(kind==='company'){const c=companies.find(x=>x.name===uid);const cts=c?contactsFor(c.name):[];selection.set(uid,{kind,name:uid,meta:c?.note||'',category:c?.category||'',region:c?.region||'',icp:c?.icp||null,note:c?.note||'',contacts:cts.map(ct=>({name:ct.full_name,title:ct.title,email:ct.email}))});}
    else{const ct=contacts.find(c=>(c.id||c.full_name||'')===uid)||contacts.find(c=>c.full_name===uid);selection.set(uid,{kind,name:ct?.full_name||uid,meta:ct?.title||'',company:ct?.company_name||''});}
  }
  updateSelectionBar();
  renderList();if(leftTab==='contacts')renderContactsList();
}

function clearSelection(){selection.clear();updateSelectionBar();renderList();if(leftTab==='contacts')renderContactsList();}

function updateSelectionBar(){
  const bar=document.getElementById('selBar');
  const count=document.getElementById('selCount');
  if(selection.size===0){bar.classList.remove('vis');return;}
  bar.classList.add('vis');
  const co=[...selection.values()].filter(i=>i.kind==='company').length;
  const ct=[...selection.values()].filter(i=>i.kind==='contact').length;
  const parts=[];if(co)parts.push(`${co} co.`);if(ct)parts.push(`${ct} ct.`);
  count.textContent=`${selection.size} selected (${parts.join(' + ')})`;
}

function sendSelectionToBattleground(){
  if(!selection.size)return;
  switchPageTab('battleground');
  if(!cur)newBg();
  [...selection.values()].forEach(item=>addTarget({uid:item.name,kind:item.kind,name:item.name,meta:item.meta||'',company:item.company||item.name,category:item.category||'',region:item.region||'',icp:item.icp||null,note:item.note||'',contacts:item.contacts||[]}));
}

function sendSelectionToMeeseeks(){
  if(!selection.size)return;
  const payload=[...selection.values()].map(item=>({
    company:item.kind==='company'?item.name:item.company,
    contactName:item.kind==='contact'?item.name:'',
    contactTitle:item.meta||'',
    category:item.category||'',region:item.region||'',icp:item.icp||null,
    description:item.note||'',
  }));
  switchPageTab('meeseeks');
  prefillMeeseeks(payload.length===1?payload[0]:payload);
}

/* ── Drag & drop ── */
function startDrag(e,enc,kind){
  const name=decodeURIComponent(enc);
  const c=kind==='company'?companies.find(x=>x.name===name):null;
  const ct=kind==='contact'?contacts.find(x=>(x.id||x.full_name||'')===name||x.full_name===name):null;
  const cts=c?contactsFor(c.name):[];
  e.dataTransfer.setData('application/json',JSON.stringify({
    uid:name,kind,name,meta:c?.note||ct?.title||'',company:ct?.company_name||name,
    category:c?.category||'',region:c?.region||'',icp:c?.icp||null,
    note:c?.note||'',contacts:cts.map(x=>({name:x.full_name,title:x.title,email:x.email}))
  }));
  e.dataTransfer.effectAllowed='copy';
}

/* ── Page navigation ── */
function switchPageTab(tab){
  activeTab=tab;
  document.querySelectorAll('.ptab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
  document.getElementById('ptab-'+tab).classList.add('active');
  document.getElementById('tab-'+tab).classList.add('active');
  if(tab==='meeseeks') buildMsGrid();
}

/* ── Drop zones on page tabs ── */
function setupTabDrop(){
  ['ptab-battleground','ptab-meeseeks'].forEach(id=>{
    const el=document.getElementById(id);if(!el)return;
    el.addEventListener('dragover',e=>{e.preventDefault();el.classList.add('drop-over');});
    el.addEventListener('dragleave',()=>el.classList.remove('drop-over'));
    el.addEventListener('drop',e=>{
      e.preventDefault();el.classList.remove('drop-over');
      let data;try{data=JSON.parse(e.dataTransfer.getData('application/json'));}catch{return;}
      if(id==='ptab-battleground'){switchPageTab('battleground');if(!cur)newBg();addTarget({uid:data.name,kind:data.kind,name:data.name,meta:data.meta||'',company:data.company||data.name,category:data.category||'',region:data.region||'',icp:data.icp||null,note:data.note||'',contacts:data.contacts||[]});}
      else{switchPageTab('meeseeks');prefillMeeseeks({company:data.company||data.name,contactName:data.kind==='contact'?data.name:'',contactTitle:data.meta,description:data.note});}
    });
  });
}

/* ── Dashboard: company detail ── */
function openDetail(enc){
  const name=decodeURIComponent(enc);selectedName=name;renderList();
  const c=companies.find(x=>x.name===name);if(!c)return;
  const [,fg]=av(name);
  const domain=c.website?domainOf(c.website):'';
  const cts=contactsFor(name);
  const {pct:coPct}=companyScore(c);
  const coBar=coPct>=75?'#22C55E':coPct>=50?'var(--prc)':'var(--por)';
  const people=cts.length?cts.map(ct=>{
    const {fields,pct}=contactScore(ct);
    const [,ctFg]=av(ct.full_name||'?');
    const barC=pct>=75?'var(--g)':pct>=50?'var(--prc)':'var(--por)';
    return `<div class="ct-card">
      <div class="ct-top">
        <div class="ct-circ" style="background:${ctFg}18;color:${ctFg};border-color:${ctFg}30">${ini(ct.full_name||'?')}</div>
        <div style="flex:1;min-width:0"><div class="ct-cname">${ct.full_name||'—'}</div><div class="ct-crole">${ct.title||'No title'}</div></div>
        <button class="btn xs" onclick="sendSingleToMeeseeks('${escJs(ct.company_name||'')}','${escJs(ct.full_name||'')}','${escJs(ct.title||'')}','${escJs(ct.email||'')}')">✉</button>
      </div>
      <div class="ct-fields">${fields.map(f=>`<span class="ct-field ${f.has?'has':'miss'}">${f.has?'✓':'○'} ${f.label}</span>`).join('')}</div>
      <div class="ct-completeness"><div class="ct-bar-wrap"><div class="ct-bar" style="width:${pct}%;background:${barC}"></div></div><span class="ct-pct">${pct}%</span></div>
      ${ct.email?`<div style="margin-top:4px;font-family:'IBM Plex Mono',monospace;font-size:8px;color:var(--t3)">${ct.email}</div>`:''}
    </div>`;
  }).join(''):`<div class="ct-no-contacts">No contacts in database yet</div>`;

  document.getElementById('centerPanel').innerHTML=`<div class="co-detail">
    <div class="det-header">
      <div class="det-av" style="background:${fg}">${ini(name)}</div>
      <div style="flex:1;min-width:0">
        <div class="det-name">${name}<span class="tag ${tagCls(c.type)}">${tagLbl(c.type)}</span>${domain?`<a class="ml" href="https://${domain}" target="_blank">${domain} ↗</a>`:''}</div>
        <div class="det-sub">${catIcon(c.category)} ${c.category||''}${c.region?' · '+c.region:''}</div>
        ${c.icp?`<div style="margin-top:3px;font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--g)">${stars(c.icp)} <span style="color:var(--t3)">${c.icp}/10</span></div>`:''}
        <div style="display:flex;align-items:center;gap:7px;margin-top:4px">
          <div style="width:90px;height:3px;background:var(--surf4);border-radius:2px;overflow:hidden"><div style="height:100%;width:${coPct}%;background:${coBar};border-radius:2px"></div></div>
          <span style="font-family:'IBM Plex Mono',monospace;font-size:7px;color:var(--t3)">${coPct}% complete</span>
        </div>
      </div>
      <div class="det-actions">
        <button class="btn p sm" onclick="openClaude('Research ${escJs(name)} — full contact report')">Full report ↗</button>
        <button class="btn sm" onclick="addSingleToBg('${escJs(name)}')">⚔ BG</button>
        <button class="btn sm" onclick="sendSingleToMeeseeks('${escJs(name)}','','','')">✉ MS</button>
      </div>
    </div>
    <div class="section">
      <div class="sec-hdr"><span>🏢</span><span class="sec-lbl">Overview</span></div>
      <div class="sec-body"><table class="info">
        <tr><td>Status</td><td><span class="tag ${tagCls(c.type)}">${tagLbl(c.type)}</span></td></tr>
        ${c.category?`<tr><td>Category</td><td>${catIcon(c.category)} ${c.category}</td></tr>`:''}
        ${c.region?`<tr><td>Region</td><td>📍 ${c.region}</td></tr>`:''}
        ${c.size?`<tr><td>Size</td><td>👥 ${c.size}</td></tr>`:''}
        ${c.icp?`<tr><td>ICP</td><td>${stars(c.icp)} ${c.icp}/10</td></tr>`:''}
        ${c.note?`<tr><td>Note</td><td>${c.note}</td></tr>`:''}
        ${domain?`<tr><td>Website</td><td>🌐 <a class="ml" href="https://${domain}" target="_blank">${domain} ↗</a></td></tr>`:''}
        ${c.linkedin_slug?`<tr><td>LinkedIn</td><td>💼 <a class="ml" href="https://linkedin.com/company/${c.linkedin_slug}" target="_blank">↗ profile</a></td></tr>`:''}
      </table></div>
    </div>
    <div class="section">
      <div class="sec-hdr"><span>👤</span><span class="sec-lbl">People</span>${cts.length?`<span style="font-family:'IBM Plex Mono',monospace;font-size:8px;background:var(--surf3);border:1px solid var(--rule);border-radius:2px;padding:1px 4px;color:var(--t3)">${cts.length}</span>`:''}
        <button class="btn sm" style="margin-left:auto" onclick="openClaude('Find Head of Programmatic or Data Partnerships at ${escJs(name)} — LinkedIn, email')">+ Find</button>
      </div>
      <div class="sec-body" style="padding:7px 9px">${people}</div>
    </div>
    <div class="section">
      <div class="sec-hdr"><span>⚡</span><span class="sec-lbl">Actions</span></div>
      <div class="sec-body"><div class="act-row">
        <button class="btn sm" onclick="openClaude('Research ${escJs(name)} — full contact report, decision makers, ICP fit')">🔍 Full report</button>
        <button class="btn sm" onclick="openClaude('Find decision makers at ${escJs(name)} — LinkedIn, email')">👤 Find DMs</button>
        <button class="btn sm p" onclick="addSingleToBg('${escJs(name)}')">⚔ Battleground</button>
        <button class="btn sm" onclick="sendSingleToMeeseeks('${escJs(name)}','','','')">✉ MEESEEKS</button>
        <button class="btn sm" onclick="openClaude('Find companies similar to ${escJs(name)} — top 10 by ICP fit')">🔗 Similar</button>
        <button class="btn sm" onclick="openClaude('Check Gmail for prior contact with ${escJs(name)}')">📧 Gmail</button>
      </div></div>
    </div>
  </div>`;
}

function addSingleToBg(name){
  const c=companies.find(x=>x.name===name);
  const cts=c?contactsFor(c.name):[];
  switchPageTab('battleground');
  if(!cur)newBg();
  addTarget({uid:name,kind:'company',name,meta:c?.note||'',company:name,category:c?.category||'',region:c?.region||'',icp:c?.icp||null,note:c?.note||'',contacts:cts.map(x=>({name:x.full_name,title:x.title,email:x.email}))});
}

function sendSingleToMeeseeks(company,contactName,contactTitle,email){
  switchPageTab('meeseeks');
  prefillMeeseeks({company,contactName,contactTitle,email,description:'',angle:''});
}

function resetCenter(){
  document.getElementById('centerPanel').innerHTML=`<div class="qa-grid">
    <div class="qa-card" onclick="promptModal('Research a company','Enter company name:','Research [COMPANY] — full contact report, decision makers, ICP fit')"><div class="qa-icon">🔍</div><div class="qa-title">Company Research</div><div class="qa-desc">Full contact report with DMs and ICP fit</div></div>
    <div class="qa-card" onclick="openClaude('Find new DSP, SSP and media agency prospects for onAudience in EMEA')"><div class="qa-icon">🎯</div><div class="qa-title">Find Prospects</div><div class="qa-desc">EMEA focus, strong programmatic signals</div></div>
    <div class="qa-card" onclick="switchPageTab('battleground')"><div class="qa-icon">⚔️</div><div class="qa-title">Battleground</div><div class="qa-desc">Plan outreach, find opportunities</div></div>
    <div class="qa-card" onclick="switchPageTab('meeseeks')"><div class="qa-icon">✉️</div><div class="qa-title">MEESEEKS</div><div class="qa-desc">Compose personalized outreach</div></div>
    <div class="qa-card" onclick="openClaude('Re-engage dormant onAudience prospects — not contacted in 60+ days')"><div class="qa-icon">♻️</div><div class="qa-title">Re-engage</div><div class="qa-desc">Dormant prospects worth reviving</div></div>
    <div class="qa-card" onclick="openClaude('Top 5 highest-priority onAudience prospects this week')"><div class="qa-icon">⭐</div><div class="qa-title">Top Picks</div><div class="qa-desc">Priority prospects this week</div></div>
  </div>`;
}

/* ── Context menu ── */
function showCtx(e,enc){
  e.preventDefault();e.stopPropagation();
  const name=decodeURIComponent(enc);
  const c=companies.find(x=>x.name===name);
  const menu=document.getElementById('ctxMenu');
  const actions=[
    {icon:'🔍',text:'Full contact report',   fn:()=>openClaude(`Research ${name} — full contact report`)},
    {icon:'👤',text:'Find decision makers',   fn:()=>openClaude(`Find Head of Programmatic at ${name} — LinkedIn, email`)},
    {icon:'⚔️',text:'Add to Battleground',    fn:()=>addSingleToBg(name)},
    {icon:'✉️',text:'Open in MEESEEKS',       fn:()=>sendSingleToMeeseeks(name,'','','')},
    {icon:'🔗',text:'Find similar',           fn:()=>openClaude(`Find companies similar to ${name} for onAudience — top 10`)},
    {icon:'📧',text:'Check Gmail',            fn:()=>openClaude(`Check Gmail for prior contact with ${name}`)},
  ];
  if(c?.type==='prospect') actions.push({icon:'🚀',text:'Prioritize',fn:()=>openClaude(`Make the case for prioritizing ${name} this quarter`)});
  menu.innerHTML=`<div class="ctx-lbl">${name}</div><div class="ctx-sep"></div>`+actions.map((a,i)=>`<div class="ctx-item" data-i="${i}"><span class="ctx-ico">${a.icon}</span>${a.text}</div>`).join('');
  menu.querySelectorAll('.ctx-item').forEach((el,i)=>el.addEventListener('click',()=>{menu.style.display='none';actions[i].fn();}));
  const x=Math.min(e.clientX,window.innerWidth-230),y=Math.min(e.clientY,window.innerHeight-actions.length*36-50);
  menu.style.left=x+'px';menu.style.top=y+'px';menu.style.display='block';
}
document.addEventListener('click',()=>document.getElementById('ctxMenu').style.display='none');

/* ── Contact drawer ── */
function openContactDrawer(enc){
  const key=decodeURIComponent(enc);
  const ct=contacts.find(c=>(c.id||c.full_name||'')===key)||contacts.find(c=>c.full_name===key);
  if(!ct) return;
  const {fields,pct}=contactScore(ct);
  const barColor=pct>=75?'#22C55E':pct>=50?'var(--prc)':'var(--por)';
  const [,fg]=av(ct.full_name||'?');
  document.getElementById('drawerAv').style.cssText=`background:${fg}20;color:${fg};border:1px solid ${fg}40;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:700`;
  document.getElementById('drawerAv').textContent=ini(ct.full_name||'?');
  document.getElementById('drawerName').textContent=ct.full_name||'—';
  document.getElementById('drawerRole').textContent=ct.title||'No title';
  document.getElementById('drawerBody').innerHTML=`
    <div style="margin-bottom:9px">
      <div style="display:flex;align-items:center;gap:7px;margin-bottom:4px">
        <div style="flex:1;height:3px;background:var(--surf4);border-radius:2px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${barColor};border-radius:2px"></div></div>
        <span style="font-family:'IBM Plex Mono',monospace;font-size:8px;color:var(--t3)">${pct}% complete</span>
      </div>
      <div style="display:flex;gap:3px;flex-wrap:wrap">${fields.map(f=>`<span class="ct-field ${f.has?'has':'miss'}">${f.has?'✓':'○'} ${f.label}</span>`).join('')}</div>
    </div>
    <table class="info" style="margin-bottom:9px">
      <tr><td>Company</td><td>${ct.company_name||'—'}</td></tr>
      <tr><td>Title</td><td>${ct.title||'—'}</td></tr>
      <tr><td>Email</td><td>${ct.email?`<span style="font-family:'IBM Plex Mono',monospace;font-size:9px">${ct.email}</span>`:'—'}</td></tr>
      <tr><td>LinkedIn</td><td>${ct.linkedin_url?`<a class="ml" href="${ct.linkedin_url}" target="_blank">Profile ↗</a>`:'—'}</td></tr>
      ${ct.notes?`<tr><td>Notes</td><td style="font-size:11px;color:var(--t2)">${ct.notes}</td></tr>`:''}
    </table>
    <div style="display:flex;gap:4px;flex-wrap:wrap">
      <button class="btn p sm" onclick="sendSingleToMeeseeks('${escJs(ct.company_name||'')}','${escJs(ct.full_name||'')}','${escJs(ct.title||'')}','${escJs(ct.email||'')}')">✉ MEESEEKS</button>
      <button class="btn sm" onclick="addSingleToBg('${escJs(ct.company_name||'')}')">⚔ BG</button>
      <button class="btn sm" onclick="openClaude('Check Gmail for prior contact with ${escJs(ct.full_name||'')} at ${escJs(ct.company_name||'')}')">📧 Gmail</button>
    </div>`;
  document.getElementById('ctDrawer').classList.add('open');
  document.getElementById('ctDrawerOverlay').classList.add('vis');
  if(ct.company_name){
    const m=companies.find(c=>c.name.toLowerCase()===ct.company_name.toLowerCase())||companies.find(c=>c.name.toLowerCase().includes(ct.company_name.toLowerCase())||ct.company_name.toLowerCase().includes(c.name.toLowerCase()));
    if(m) openDetail(encodeURIComponent(m.name));
  }
}
function closeDrawer(){document.getElementById('ctDrawer').classList.remove('open');document.getElementById('ctDrawerOverlay').classList.remove('vis');}

/* ══════════════════════════════════
   BATTLEGROUND
══════════════════════════════════ */
function renderBgList(){
  const el=document.getElementById('bgList');
  document.getElementById('ptab-badge-bg').textContent=battlegrounds.length;
  if(!battlegrounds.length){el.innerHTML='<div class="bg-list-empty">No battlegrounds yet</div>';return;}
  el.innerHTML=battlegrounds.map(bg=>`
    <div class="bg-item${cur?.id===bg.id?' active':''}" onclick="openBg('${bg.id}')">
      <span class="bg-item-icon">${bgIcon(bg.status)}</span>
      <div class="bg-item-info">
        <div class="bg-item-name">${bg.name||'Untitled'}</div>
        <div class="bg-item-meta">${(bg.targets||[]).length}t · ${(bg.opportunities||[]).length}op · ${bg.save_count||0}↑</div>
      </div>
      <button class="bg-item-del" onclick="event.stopPropagation();deleteBg('${bg.id}')">✕</button>
    </div>`).join('');
}

function renderHistoryPanel(){
  if(!cur){
    document.getElementById('histName').textContent='No battleground';
    document.getElementById('histName').className='hp-name empty';
    document.getElementById('histChips').innerHTML='';
    document.getElementById('histBody').innerHTML='<div class="hist-empty">No history yet</div>';
    return;
  }
  document.getElementById('histName').textContent=cur.name||'Untitled';
  document.getElementById('histName').className='hp-name';
  document.getElementById('histChips').innerHTML=`
    <span class="hp-chip st-${cur.status||'draft'}">${bgIcon(cur.status)} ${cur.status||'draft'}</span>
    <span class="hp-chip">${cur.targets?.length||0}t</span>
    <span class="hp-chip">${cur.opportunities?.length||0}op</span>
    ${cur.save_count?`<span class="hp-chip">${cur.save_count}↑</span>`:''}`;
  const history=[...(cur.history||[])].reverse();
  if(!history.length){document.getElementById('histBody').innerHTML='<div class="hist-empty">No saves yet</div>';return;}
  document.getElementById('histBody').innerHTML=history.map(h=>`
    <div class="hist-item">
      <div class="hist-dot ${h.action==='created'?'create':'save'}">${h.action==='created'?'★':'↑'}</div>
      <div class="hist-info">
        <div class="hist-action">${h.action==='created'?'Created':'Saved'}</div>
        <div class="hist-time">${fmtTime(h.ts)}</div>
        ${h.targets!==undefined?`<div class="hist-detail">${h.targets}t · ${h.opps||0}op</div>`:''}
      </div>
    </div>`).join('');
}

function newBg(){
  cur={id:null,name:'',goal:'',hook:'',notes:'',targets:[],opportunities:[],selectedOpps:[],status:'draft',history:[],save_count:0};
  originalName='';bgDirty=true;selectedOpps.clear();
  renderBgEditor();renderBgList();renderHistoryPanel();
}

function openBg(id){
  const found=battlegrounds.find(b=>b.id===id);if(!found)return;
  cur=JSON.parse(JSON.stringify(found));
  cur.targets=cur.targets||[];cur.opportunities=cur.opportunities||[];
  cur.selectedOpps=cur.selectedOpps||[];cur.history=cur.history||[];cur.save_count=cur.save_count||0;
  originalName=cur.name||'';bgDirty=false;selectedOpps=new Set(cur.selectedOpps);
  renderBgEditor();renderBgList();renderHistoryPanel();
}

function renderBgEditor(){
  const ed=document.getElementById('bgEditor');
  const actions=document.getElementById('bgActions');
  if(!cur){
    actions.style.display='none';
    ed.classList.add('is-empty');
    ed.innerHTML=`<div class="bg-empty-state"><div class="bg-empty-ico">⚔️</div><div class="bg-empty-txt">No battleground selected</div><div class="bg-empty-sub">Select targets from the left panel and click ⚔ Battleground, or create a new one.</div><button class="btn p" style="margin-top:12px" onclick="newBg()">+ New Battleground</button></div>`;
    return;
  }
  ed.classList.remove('is-empty');
  actions.style.display='flex';
  document.getElementById('statusSel').value=cur.status||'draft';
  updateMeeseeksBtn();

  ed.innerHTML=`
    <div class="bg-section">
      <div class="bg-sec-hdr">
        <span>🎯</span><span class="bg-sec-lbl">Targets</span>
        <span style="font-family:'IBM Plex Mono',monospace;font-size:8px;background:var(--surf3);border:1px solid var(--rule);border-radius:2px;padding:1px 4px;color:var(--t3)" id="bgTargetCount">${cur.targets.length}</span>
        <button class="btn xs" style="margin-left:auto" onclick="openPicker()">+ Add</button>
      </div>
      <div class="bg-sec-body" style="padding:6px">
        <div class="drop-zone" id="bgDropZone"
          ondragover="event.preventDefault();this.classList.add('over')"
          ondragleave="this.classList.remove('over')"
          ondrop="handleBgDrop(event)">
          <div class="drop-hint" id="bgDropHint" ${cur.targets.length?'style="display:none"':''}>Drag from left panel · or click + Add</div>
          ${cur.targets.map((t,i)=>renderTargetChip(t,i)).join('')}
        </div>
      </div>
    </div>

    <div class="bg-section">
      <div class="bg-sec-hdr">
        <span>⚔️</span><span class="bg-sec-lbl">Campaign Identity</span>
        ${cur.targets.length?`<button class="btn xs" style="margin-left:auto;color:var(--g);border-color:var(--gr)" onclick="suggestBgContext()" id="suggestBtn">✦ Suggest from targets</button>`:''}
      </div>
      <div class="bg-sec-body">
        <div class="field"><span class="lbl">🏷 Name</span><input class="inp" id="bgName" value="${esc(cur.name||'')}" placeholder="e.g. EMEA DSP Push Q2" oninput="cur.name=this.value;markBgDirty();syncHistName()"/></div>
        <div class="row2">
          <div class="field"><span class="lbl">🎯 Goal</span><input class="inp" id="bgGoal" value="${esc(cur.goal||'')}" placeholder="e.g. 10 new DSP trials" oninput="cur.goal=this.value;markBgDirty()"/></div>
          <div class="field"><span class="lbl">💡 Hook / Angle</span><input class="inp" id="bgHook" value="${esc(cur.hook||'')}" placeholder="e.g. EU data gap" oninput="cur.hook=this.value;markBgDirty()"/></div>
        </div>
        <div class="field"><span class="lbl">📋 Strategy / Notes</span><textarea class="ta" id="bgNotes" oninput="cur.notes=this.value;markBgDirty()" placeholder="Strategy, context, objections…">${cur.notes||''}</textarea></div>
      </div>
    </div>

    <div class="bg-section">
      <div class="bg-sec-hdr">
        <span>💡</span><span class="bg-sec-lbl">Business Opportunities</span>
        ${apiKey?`<button class="btn xs" id="genBtn" onclick="generateOpportunities()" ${!cur.targets.length?'disabled':''}>✦ Generate</button>`:`<button class="btn xs" onclick="openKeyModal()">🔑 Key needed</button>`}
        ${cur.opportunities.length?`<button class="btn xs" onclick="clearOpps()" style="margin-left:3px">↺</button>`:''}
      </div>
      <div id="oppContainer">${renderOppsInner()}</div>
    </div>`;

  updateBgSaveInd();
}

function renderOppsInner(){
  if(!cur.opportunities.length) return `<div class="opp-empty">Add targets · click ✦ Generate</div>`;
  return `<div class="opp-tiles">${cur.opportunities.map((opp,i)=>`
    <div class="opp-tile${selectedOpps.has(i)?' selected':''}" onclick="toggleOpp(${i})">
      <div class="opp-tile-check">✓</div>
      <div class="opp-tile-icon">${opp.icon||'💡'}</div>
      <div class="opp-tile-title">${opp.title||''}</div>
      <div class="opp-tile-hook">${opp.hook||''}</div>
      <div class="opp-tile-segs">${(opp.segments||[]).map(s=>`<span class="opp-seg">${s}</span>`).join('')}</div>
    </div>`).join('')}</div>`;
}

function toggleOpp(i){
  if(selectedOpps.has(i))selectedOpps.delete(i);else selectedOpps.add(i);
  cur.selectedOpps=[...selectedOpps];markBgDirty();
  document.getElementById('oppContainer').innerHTML=renderOppsInner();
  updateMeeseeksBtn();
}

function clearOpps(){
  cur.opportunities=[];cur.selectedOpps=[];selectedOpps.clear();markBgDirty();
  document.getElementById('oppContainer').innerHTML=renderOppsInner();
  const b=document.getElementById('genBtn');if(b)b.textContent='✦ Generate';
  updateMeeseeksBtn();
}

function syncHistName(){
  const el=document.getElementById('histName');
  if(el&&cur)el.textContent=cur.name||'Untitled';
}

/* ── Smart suggest: derive campaign identity from targets ── */
async function suggestBgContext(){
  if(!apiKey){openKeyModal();return;}
  if(!cur?.targets?.length)return;
  const btn=document.getElementById('suggestBtn');
  if(btn){btn.disabled=true;btn.textContent='✦ Thinking…';}

  const ctx=cur.targets.map(t=>{
    const cts=(t.contacts||[]).map(c=>`${c.name||''} (${c.title||''})`).filter(Boolean);
    return `- ${(t.kind||'?').toUpperCase()}: ${t.name}`
      +`${t.category?' | '+catIcon(t.category)+' '+t.category:''}`
      +`${t.region?' | 📍 '+t.region:''}`
      +`${t.icp?' | ICP '+t.icp+'/10':''}`
      +`${t.note?' | '+t.note:''}`
      +`${cts.length?' | Contacts: '+cts.join(', '):''}`;
  }).join('\n');

  const prompt=`You are a senior sales strategist at onAudience (a data company selling behavioral, demographic, B2B, CTV, and brand-affinity audience segments to programmatic buyers).

These targets have been added to a sales campaign:
${ctx}

Generate a concise campaign identity. Respond ONLY with JSON, no markdown:
{
  "name": "Short campaign name (4-6 words, specific to these targets)",
  "goal": "Concrete measurable goal (e.g. '3 new DSP data integrations in EMEA')",
  "hook": "The single sharpest angle/hook for this target group (e.g. 'EU cookieless data gap on TTD')",
  "notes": "2-3 sentence strategy: why these targets, what pain they have, what onAudience offers them specifically. Reference their categories/roles."
}

Be specific to the actual target companies and their known characteristics. No generic platitudes.`;

  try{
    const res=await fetch(PROXY,{method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${SB_KEY}`,'apikey':SB_KEY,'x-client-api-key':apiKey},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:600,messages:[{role:'user',content:prompt}]})
    });
    if(!res.ok){const t=await res.text();throw new Error(`HTTP ${res.status}: ${t}`);}
    const data=await res.json();
    if(data.error)throw new Error(data.error);
    const raw=(data.content?.[0]?.text||'{}').replace(/```json?|```/g,'').trim();
    const sug=JSON.parse(raw);
    // Only fill empty fields (don't overwrite user's work)
    if(sug.name&&!cur.name){const el=document.getElementById('bgName');if(el){el.value=sug.name;cur.name=sug.name;syncHistName();}}
    if(sug.goal&&!cur.goal){const el=document.getElementById('bgGoal');if(el){el.value=sug.goal;cur.goal=sug.goal;}}
    if(sug.hook&&!cur.hook){const el=document.getElementById('bgHook');if(el){el.value=sug.hook;cur.hook=sug.hook;}}
    if(sug.notes&&!cur.notes){const el=document.getElementById('bgNotes');if(el){el.value=sug.notes;cur.notes=sug.notes;}}
    markBgDirty();
  }catch(err){
    console.error('suggestBgContext:',err);
  }
  if(btn){btn.disabled=false;btn.textContent='✦ Suggest from targets';}
}

function markBgDirty(){
  bgDirty=true;
  const el=document.getElementById('saveInd');
  if(el){el.textContent='● Unsaved';el.className='save-ind dirty';}
}
function updateBgSaveInd(){
  const el=document.getElementById('saveInd');if(!el)return;
  if(bgDirty){el.textContent='● Unsaved';el.className='save-ind dirty';}
  else{el.textContent='✓ Saved';el.className='save-ind clean';}
}
function updateMeeseeksBtn(){
  const b=document.getElementById('meeseeksBtn');
  if(b)b.disabled=!cur||!cur.targets.length||selectedOpps.size===0;
}

/* ── Opportunity generation ── */
async function generateOpportunities(){
  if(!apiKey){openKeyModal();return;}
  if(!cur||!cur.targets.length)return;
  const btn=document.getElementById('genBtn');
  if(btn){btn.disabled=true;btn.textContent='…';}
  document.getElementById('oppContainer').innerHTML=`<div class="opp-loading"><div class="opp-loading-txt">Analyzing targets · matching segments…</div></div>`;

  const ctx=cur.targets.map(t=>{
    const cs=(t.contacts||[]).map(c=>`${c.name||''} (${c.title||''})`).filter(Boolean);
    return `- ${(t.kind||'?').toUpperCase()}: ${t.name} | Cat: ${t.category||'?'} | Region: ${t.region||'?'} | ICP: ${t.icp||'?'} | Note: ${t.note||t.meta||'?'}${cs.length?` | Contacts: ${cs.join(', ')}`:''}`;
  }).join('\n');

  const prompt=`You are a senior sales strategist at onAudience selling audience segments to DSPs, agencies, data platforms.

TARGETS:
${ctx}

Campaign: ${cur.goal||'Data partnership outreach'} | Hook: ${cur.hook||'Not set'}

${OA_TAXONOMY}

Identify 4-6 concrete business opportunities. Respond ONLY with JSON array, no markdown:
[{"icon":"emoji","title":"3-5 word name","hook":"One sentence naming the target and the fit","segments":["Category 1","Category 2"]}]`;

  try{
    const res=await fetch(PROXY,{method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${SB_KEY}`,'apikey':SB_KEY,'x-client-api-key':apiKey},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:2000,messages:[{role:'user',content:prompt}]})
    });
    if(!res.ok){const t=await res.text();throw new Error(`HTTP ${res.status}: ${t}`);}
    const data=await res.json();
    if(data.error)throw new Error(data.error);
    const raw=(data.content?.[0]?.text||'[]').replace(/```json?|```/g,'').trim();
    cur.opportunities=JSON.parse(raw);
    cur.selectedOpps=[];selectedOpps.clear();markBgDirty();
    document.getElementById('oppContainer').innerHTML=renderOppsInner();
    if(btn){btn.disabled=false;btn.textContent='✦ Regen';}
    updateMeeseeksBtn();
  }catch(err){
    document.getElementById('oppContainer').innerHTML=`<div class="opp-empty" style="color:#CC2222">Error: ${err.message}</div>`;
    if(btn){btn.disabled=false;btn.textContent='✦ Generate';}
  }
}

/* ── Launch from battleground → MEESEEKS ── */
function launchFromBattleground(){
  if(!cur||!selectedOpps.size)return;
  const selOpps=[...selectedOpps].map(i=>cur.opportunities[i]).filter(Boolean);
  const payload=cur.targets.map(t=>({
    company:t.kind==='company'?t.name:t.company,
    contactName:t.kind==='contact'?t.name:'',
    contactTitle:t.meta||'',
    category:t.category||'',region:t.region||'',icp:t.icp||null,
    description:[t.note||t.meta||'',`Category: ${t.category||''}`,`Region: ${t.region||''}`,
      t.contacts?.length?`Contacts: ${t.contacts.map(c=>`${c.name} (${c.title})`).join(', ')}`:''].filter(Boolean).join(' | '),
    angle:selOpps.map(o=>`${o.title}: ${o.hook}`).join(' · '),
    opportunities:selOpps,
    campaignGoal:cur.goal||'',campaignHook:cur.hook||'',
  }));
  switchPageTab('meeseeks');
  prefillMeeseeks(payload.length===1?payload[0]:payload);
}

/* ── Targets ── */
function renderTargetChip(t,i){
  const [bg,fg]=av(t.name||'?');
  const icon=t.kind==='contact'?'👤':(catIcon(t.category)||'🏢');
  const meta=t.category?`${catIcon(t.category)} ${t.category}${t.region?' · '+t.region:''}`:t.meta||'';
  return `<div class="target-chip">
    <div class="target-av" style="background:${bg};color:${fg}">${ini(t.name||'?')}</div>
    <div class="target-info"><div class="target-name">${t.name||'?'}</div>${meta?`<div class="target-meta">${meta}</div>`:''}</div>
    <span class="target-kind ${t.kind||'company'}">${t.kind==='contact'?'👤 ct':'🏢 co'}</span>
    <button class="target-del" onclick="removeBgTarget(${i})">✕</button>
  </div>`;
}

function addTarget(item){
  if(!cur)return;
  if(cur.targets.find(t=>t.uid===item.uid&&t.kind===item.kind))return;
  cur.targets.push(item);markBgDirty();refreshBgTargets();
  // Auto-suggest identity context on first target if fields empty and API key set
  if(cur.targets.length===1&&apiKey&&!cur.name&&!cur.goal&&!cur.hook){
    suggestBgContext();
  }
}

function removeBgTarget(idx){cur.targets.splice(idx,1);markBgDirty();refreshBgTargets();}

function refreshBgTargets(){
  const zone=document.getElementById('bgDropZone');
  const hint=document.getElementById('bgDropHint');
  const count=document.getElementById('bgTargetCount');
  if(!zone)return;
  if(hint)hint.style.display=cur.targets.length?'none':'';
  if(count)count.textContent=cur.targets.length;
  zone.querySelectorAll('.target-chip').forEach(c=>c.remove());
  cur.targets.forEach((t,i)=>zone.insertAdjacentHTML('beforeend',renderTargetChip(t,i)));
  const genBtn=document.getElementById('genBtn');if(genBtn)genBtn.disabled=!cur.targets.length;
  // Show/hide the suggest button dynamically
  const secHdr=document.querySelector('#bgEditor .bg-section:nth-child(2) .bg-sec-hdr');
  if(secHdr){
    const existing=secHdr.querySelector('#suggestBtn');
    if(cur.targets.length&&!existing){
      const b=document.createElement('button');
      b.id='suggestBtn';b.className='btn xs';
      b.style.cssText='margin-left:auto;color:var(--g);border-color:var(--gr)';
      b.textContent='✦ Suggest from targets';b.onclick=suggestBgContext;
      secHdr.appendChild(b);
    }else if(!cur.targets.length&&existing){existing.remove();}
  }
  updateMeeseeksBtn();
  renderHistoryPanel();
}

function handleBgDrop(e){
  e.preventDefault();e.currentTarget.classList.remove('over');
  let data;try{data=JSON.parse(e.dataTransfer.getData('application/json'));}catch{return;}
  addTarget({uid:data.name||data.uid,kind:data.kind||'company',name:data.name,meta:data.meta||'',company:data.company||'',category:data.category||'',region:data.region||'',icp:data.icp||null,note:data.note||'',contacts:data.contacts||[]});
}

/* ── Bg save ── */
async function saveBg(){
  if(!cur)return;
  cur.name  =document.getElementById('bgName')?.value.trim()||cur.name;
  cur.goal  =document.getElementById('bgGoal')?.value.trim()||cur.goal;
  cur.hook  =document.getElementById('bgHook')?.value.trim()||cur.hook;
  cur.notes =document.getElementById('bgNotes')?.value||cur.notes;
  cur.status=document.getElementById('statusSel')?.value||cur.status;
  const histEntry={action:cur.id?'saved':'created',ts:new Date().toISOString(),name:cur.name,targets:cur.targets.length,opps:cur.opportunities.length};
  cur.history=[...(cur.history||[]),histEntry];cur.save_count=(cur.save_count||0)+1;
  const payload={name:cur.name,goal:cur.goal,hook:cur.hook,notes:cur.notes,targets:cur.targets,opportunities:cur.opportunities,selectedOpps:[...selectedOpps],status:cur.status,history:cur.history,save_count:cur.save_count};
  const nameChanged=cur.name!==originalName&&originalName!=='';
  try{
    if(cur.id&&!nameChanged){
      await sbPatch(`/rest/v1/battlegrounds?id=eq.${cur.id}`,payload);
      const idx=battlegrounds.findIndex(b=>b.id===cur.id);
      if(idx>=0)battlegrounds[idx]={...battlegrounds[idx],...payload,id:cur.id};
    }else{
      const r=await sbPost('/rest/v1/battlegrounds',payload,{Prefer:'return=representation'});
      const d=await r.json();if(d?.[0]?.id)cur.id=d[0].id;
      battlegrounds.unshift({...cur,...payload});
      originalName=cur.name;
    }
    bgDirty=false;updateBgSaveInd();
    renderBgList();renderHistoryPanel();
  }catch(err){console.error('saveBg:',err);alert('Save failed: '+err.message);}
}

async function deleteBg(id){
  if(!confirm('Delete this battleground?'))return;
  await sbDel(`/rest/v1/battlegrounds?id=eq.${id}`);
  battlegrounds=battlegrounds.filter(b=>b.id!==id);
  if(cur?.id===id){cur=null;document.getElementById('bgActions').style.display='none';const ed=document.getElementById('bgEditor');ed.classList.add('is-empty');ed.innerHTML=`<div class="bg-empty-state"><div class="bg-empty-ico">⚔️</div><div class="bg-empty-txt">No battleground</div><button class="btn p" style="margin-top:12px" onclick="newBg()">+ New</button></div>`;renderHistoryPanel();}
  renderBgList();
}

/* ── Picker (for Battleground + Add) ── */
function openPicker(){document.getElementById('pickerModal').classList.add('vis');document.getElementById('pickerQ').value='';renderPicker();}
function closePicker(){document.getElementById('pickerModal').classList.remove('vis');}
function switchPickerTab(t){
  pickerTab=t;
  document.querySelectorAll('.picker-tab').forEach(x=>x.classList.remove('active'));
  document.getElementById('picker-tab-'+(t==='companies'?'co':'ct')).classList.add('active');
  renderPicker();
}
function renderPicker(){
  const q=(document.getElementById('pickerQ').value||'').toLowerCase();
  const list=pickerTab==='companies'?companies:contacts;
  const filtered=list.filter(item=>{
    const hay=pickerTab==='companies'?(item.name||''):((item.full_name||'')+' '+(item.company_name||'')+(item.title||''));
    return !q||hay.toLowerCase().includes(q);
  }).slice(0,60);
  const el=document.getElementById('pickerList');
  el.innerHTML=filtered.map(item=>{
    const name=pickerTab==='companies'?item.name:item.full_name;
    const meta=pickerTab==='companies'?(item.category||item.note||''):(item.title||'')+(item.company_name?' · '+item.company_name:'');
    const [bg,fg]=av(name||'?');
    const added=(cur?.targets||[]).some(t=>t.uid===name);
    return `<div class="picker-item${added?' added':''}" onclick="pickerAdd(${JSON.stringify(name||'')},${JSON.stringify(meta||'')},${JSON.stringify(item.company_name||'')},${JSON.stringify(item.category||'')},${JSON.stringify(item.region||'')},${item.icp||0})">
      <div class="picker-av" style="background:${bg};color:${fg}">${ini(name||'?')}</div>
      <div style="flex:1;min-width:0"><div class="picker-name">${name||'—'}</div><div class="picker-meta">${meta}</div></div>
      ${added?'<span style="color:var(--g);font-size:10px">✓</span>':''}
    </div>`;
  }).join('')||'<div style="padding:14px;text-align:center;font-family:IBM Plex Mono,monospace;font-size:9px;color:var(--t3)">No results</div>';
}
function pickerAdd(name,meta,company,category,region,icp){
  addTarget({uid:name,kind:pickerTab==='companies'?'company':'contact',name,meta,company:company||name,category,region,icp:icp||null,contacts:[]});
  renderPicker();
}

/* ══════════════════════════════════
   MEESEEKS
══════════════════════════════════ */
function buildMsGrid(){
  const el=document.getElementById('msGrid');if(!el)return;
  el.innerHTML=MEESEEKS.map(m=>`
    <div class="ms-card${selectedMs?.id===m.id?' active':''}" id="msc-${m.id}" onclick="selectMs('${m.id}')"
      title="${m.style}" style="${selectedMs?.id===m.id?`border-color:${m.color};color:${m.color}`:''}">
      <div class="ms-icon">${m.icon}</div>
      <div class="ms-name">${m.name}</div>
      <div class="ms-tag">${m.tag}</div>
    </div>`).join('');
}

function selectMs(id){
  selectedMs=MEESEEKS.find(m=>m.id===id);
  buildMsGrid();
  document.getElementById('msSelLabel').textContent='— '+selectedMs.name;
}

function prefillMeeseeks(payload){
  buildMsGrid();
  if(Array.isArray(payload)){
    setQueue(payload);
  }else{
    setQueue([]);
    document.getElementById('msCompany').value=payload.company||'';
    document.getElementById('msContact').value=payload.contactName||'';
    document.getElementById('msTitle').value=payload.contactTitle||'';
    document.getElementById('msDsp').value=Array.isArray(payload.dsps)?payload.dsps.join(', '):(payload.dsps||'');
    let desc=payload.description||payload.note||'';
    if(payload.opportunities?.length) desc=(desc?desc+'\n\nOpps:\n':'')+payload.opportunities.map(o=>`• ${o.title}: ${o.hook}`).join('\n');
    document.getElementById('msDesc').value=desc;
    document.getElementById('msAngle').value=payload.angle||payload.opportunities?.[0]?.hook||'';
    document.getElementById('msEmail').value=payload.email||'';
  }
}

function setQueue(arr){
  queue=arr;queueIdx=0;
  const strip=document.getElementById('msQueue');
  if(!arr.length){strip.classList.remove('vis');return;}
  strip.classList.add('vis');
  document.getElementById('queueCount').textContent=arr.length;
  renderQueueChips();
  loadFromQueue(0);
}
function renderQueueChips(){
  document.getElementById('qChips').innerHTML=queue.map((item,i)=>
    `<div class="q-chip${i===queueIdx?' active':''}" onclick="loadFromQueue(${i})">${item.company||item.contactName||'—'}</div>`
  ).join('');
}
function loadFromQueue(idx){
  queueIdx=idx;renderQueueChips();
  const item=queue[idx];if(!item)return;
  document.getElementById('msCompany').value=item.company||'';
  document.getElementById('msContact').value=item.contactName||'';
  document.getElementById('msTitle').value=item.contactTitle||'';
  document.getElementById('msDsp').value=Array.isArray(item.dsps)?item.dsps.join(', '):(item.dsps||'');
  let desc=item.description||item.note||'';
  if(item.opportunities?.length) desc=(desc?desc+'\n\nOpps:\n':'')+item.opportunities.map(o=>`• ${o.title}: ${o.hook}`).join('\n');
  document.getElementById('msDesc').value=desc;
  document.getElementById('msAngle').value=item.angle||item.opportunities?.[0]?.hook||'';
  document.getElementById('msEmail').value=item.email||'';
}

async function generateEmail(){
  const company=document.getElementById('msCompany').value.trim();
  if(!company){alert('Company name is required');return;}
  if(!selectedMs){alert('Pick a Meeseek persona first');return;}
  if(!apiKey){openKeyModal();return;}
  const contact=document.getElementById('msContact').value.trim();
  const title  =document.getElementById('msTitle').value.trim();
  const dsp    =document.getElementById('msDsp').value.trim();
  const desc   =document.getElementById('msDesc').value.trim();
  const angle  =document.getElementById('msAngle').value.trim();
  const email  =document.getElementById('msEmail').value.trim();
  document.getElementById('msGenerateBtn').disabled=true;
  document.getElementById('msOutput').innerHTML=`<div class="ms-loading"><div class="ms-loading-txt">Channelling ${selectedMs.name}…</div></div>`;

  const prompt=`You are writing a cold outreach email for onAudience, a data company selling audience segments (behavioral, demographic, B2B, purchase intent, CTV, brand affinity) to programmatic buyers — DSPs, agencies, data platforms.

Writing style: ${selectedMs.name} (${selectedMs.tag}). ${selectedMs.style}

Company: ${company}
${contact?'Contact: '+contact:''}
${title?'Role: '+title:''}
${dsp?'DSP / Platform: '+dsp:''}
${desc?'About them / Context: '+desc:''}
${angle?'Angle / Hook: '+angle:''}

Write a concise cold outreach email (max 150 words). Output EXACTLY in this format:
SUBJECT: [subject line here]
---
[email body here]

Rules:
- Never open with "I hope this finds you well" or a question
- Open with a specific observation about ${company}
- Reference the angle/opportunity if provided — be concrete
- One clear value proposition linked to their context
- Soft call to action
- No generic adtech jargon`;

  try{
    const res=await fetch(PROXY,{method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${SB_KEY}`,'apikey':SB_KEY,'x-client-api-key':apiKey},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,messages:[{role:'user',content:prompt}]})
    });
    if(!res.ok){const t=await res.text();throw new Error(`HTTP ${res.status}: ${t}`);}
    const data=await res.json();
    if(data.error)throw new Error(data.error);
    const text=data.content?.[0]?.text||'';
    renderEmailOutput(text,company,contact,selectedMs);
  }catch(err){
    document.getElementById('msOutput').innerHTML=`<div style="padding:16px;color:#CC2222;font-family:'IBM Plex Mono',monospace;font-size:10px">Error: ${err.message}</div>`;
  }
  document.getElementById('msGenerateBtn').disabled=false;
}

function renderEmailOutput(text,company,contact,ms){
  const parts=text.split('---');
  const subjectRaw=(parts[0]||'').replace('SUBJECT:','').trim();
  const body=(parts[1]||parts[0]||'').trim();
  document.getElementById('msOutput').innerHTML=`
    <div class="ms-output-section">
      <div class="ms-output-hdr">
        <span style="font-size:14px">${ms.icon}</span>
        <span class="ms-output-lbl">${ms.name} · ${company}${contact?' · '+contact:''}</span>
        <button class="btn sm" onclick="copyEmail()">⎘ Copy</button>
        ${queue.length>1?`<button class="btn sm" onclick="nextInQueue()">Next →</button>`:''}
      </div>
      <div class="ms-output-body">
        ${subjectRaw?`<div class="ms-subject">Subject: ${subjectRaw}</div>`:''}
        <div class="ms-email-body" id="msEmailBody">${body}</div>
      </div>
    </div>
    ${queue.length>1?`<div style="font-family:'IBM Plex Mono',monospace;font-size:8px;color:var(--t3);text-transform:uppercase;letter-spacing:.07em;margin-top:4px">${queueIdx+1} of ${queue.length}</div>`:''}`;
}

function copyEmail(){
  const body=document.getElementById('msEmailBody')?.textContent||'';
  navigator.clipboard.writeText(body).then(()=>{const b=document.querySelector('.ms-output-hdr .btn');if(b){b.textContent='✓ Copied';setTimeout(()=>b.textContent='⎘ Copy',1500);}});
}

function nextInQueue(){
  if(queueIdx<queue.length-1){loadFromQueue(queueIdx+1);generateEmail();}
}

/* ── API key ── */
function openKeyModal(){document.getElementById('keyModal').classList.add('vis');document.getElementById('keyInput').value=apiKey;}
function closeKeyModal(){document.getElementById('keyModal').classList.remove('vis');}
function saveKey(){apiKey=document.getElementById('keyInput').value.trim();localStorage.setItem('oaApiKey',apiKey);closeKeyModal();document.getElementById('keyBtn').textContent=apiKey?'🔑 Key ✓':'🔑 API Key';}

/* ── Research modal ── */
let _modalTemplate='';
function promptModal(title,desc,template){
  _modalTemplate=template;
  document.getElementById('modalTitle').textContent=title;
  document.getElementById('modalDesc').textContent=desc;
  document.getElementById('modalInput').value='';
  document.getElementById('overlay').classList.add('vis');
  setTimeout(()=>document.getElementById('modalInput').focus(),50);
}
function closeModal(){document.getElementById('overlay').classList.remove('vis');}
function submitModal(){const v=document.getElementById('modalInput').value.trim();if(!v)return;closeModal();openClaude(_modalTemplate.replace('[COMPANY]',v));}
function doResearch(){
  const q=document.getElementById('searchQ').value.trim();
  if(q) openClaude(`Research ${q} — full contact report with decision makers, outreach angle, ICP fit`);
  else promptModal('Research a company','Enter company name:','Research [COMPANY] — full contact report with decision makers, outreach angle, ICP fit');
}

/* ── Theme ── */
function toggleTheme(){
  theme=theme==='light'?'dark':'light';
  document.documentElement.setAttribute('data-theme',theme);
  localStorage.setItem('oaTheme',theme);
  document.getElementById('themeBtn').textContent=theme==='dark'?'☀️':'🌙';
}

/* ── Utility ── */
function openClaude(prompt){window.open('https://claude.ai/new?q='+encodeURIComponent(prompt),'_blank');}

/* ── Boot ── */
document.addEventListener('DOMContentLoaded',()=>{
  document.documentElement.setAttribute('data-theme',theme);
  document.getElementById('themeBtn').textContent=theme==='dark'?'☀️':'🌙';
  document.getElementById('keyBtn').textContent=apiKey?'🔑 Key ✓':'🔑 API Key';
  document.getElementById('modalInput').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submitModal();}});
  document.getElementById('overlay').addEventListener('click',e=>{if(e.target===document.getElementById('overlay'))closeModal();});
  updateStats();renderList();resetCenter();buildMsGrid();setupTabDrop();
  setStatus('seed',`○ Seed · ${companies.length}`);
  loadAll();
});
