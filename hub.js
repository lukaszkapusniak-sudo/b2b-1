/* ============================================================
   onAudience Sales Intelligence Hub — hub.js
   LOGIC ONLY. Change data, business rules, prompts, API here.
   Styling lives in hub.css. Structure lives in index.html.
   ============================================================ */


// ── 1. THEME ───────────────────────────────────────────────
let theme = localStorage.getItem('oaTheme') || 'light';
document.documentElement.setAttribute('data-theme', theme);

function toggleTheme() {
  theme = theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('oaTheme', theme);
  document.getElementById('themeBtn').textContent = theme === 'dark' ? '☀️' : '🌙';
}
document.getElementById('themeBtn').textContent = theme === 'dark' ? '☀️' : '🌙';


// ── 2. SUPABASE CONFIG ─────────────────────────────────────
const SB_URL = 'https://nyzkkqqjnkctcmxoirdj.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55emtrcXFqbmtjdGNteG9pcmRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzMxMzYsImV4cCI6MjA4OTQ0OTEzNn0.jhAq_C68klOp4iTyj9HmsyyvoxsOI6ACld7t_87TAk0';

async function sbFetch(path) {
  const r = await fetch(SB_URL + path, {
    headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY }
  });
  if (!r.ok) throw new Error(r.status);
  return r.json();
}

async function sbUpsert(table, record) {
  const r = await fetch(SB_URL + '/rest/v1/' + table, {
    method: 'POST',
    headers: {
      'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates,return=minimal'
    },
    body: JSON.stringify(record)
  });
  if (!r.ok) throw new Error(r.status);
}


// ── 3. APP STATE ───────────────────────────────────────────
let companies     = [];
let contacts      = [];
let activeFilter  = 'all';
let searchQ       = '';
let activeTab     = 'companies';
let selectedCompany = null;
let planType      = 'pipeline';
let pipeline      = JSON.parse(localStorage.getItem('oaPipeline') || '[]');
let weeklyTasks   = JSON.parse(localStorage.getItem('oaWeekly')   || '[]');
let metrics       = JSON.parse(localStorage.getItem('oaMetrics')  || '{"emails":0,"meetings":0,"proposals":0}');


// ── 4. SEED DATA ───────────────────────────────────────────
// Used when Supabase is unreachable. Edit here to change demo data.

const SEED_COMPANIES = [
  { name:'The Trade Desk', note:'Top DSP prospect', type:'prospect', category:'DSP', region:'US', icp:9, size:'1000+',
    technologies:[{name:'UID2',cat:'adtech'},{name:'OpenPath',cat:'adtech'},{name:'Salesforce',cat:'crm'},{name:'Snowflake',cat:'analytics'},{name:'Segment',cat:'cdp'}] },
  { name:'Xandr', note:'Microsoft DSP — active negotiations', type:'poc', category:'DSP', region:'US', icp:8, size:'500-1000',
    technologies:[{name:'Microsoft Clarity',cat:'analytics'},{name:'Azure',cat:'other'},{name:'AppNexus SDK',cat:'adtech'},{name:'LiveRamp',cat:'cdp'}] },
  { name:'Index Exchange', note:'SSP partner — data enrichment deal', type:'partner', category:'SSP', region:'CA', icp:7, size:'200-500',
    technologies:[{name:'Prebid.js',cat:'adtech'},{name:'OpenRTB',cat:'adtech'},{name:'Google Analytics',cat:'analytics'},{name:'HubSpot',cat:'crm'}] },
  { name:'Magnite', note:'SSP client — annual contract', type:'client', category:'SSP', region:'US', icp:9, size:'500-1000',
    technologies:[{name:'SpotX',cat:'adtech'},{name:'Rubicon',cat:'adtech'},{name:'Google Tag Manager',cat:'analytics'},{name:'Salesforce',cat:'crm'},{name:'DV360',cat:'dsp'}] },
  { name:'PubMatic', note:'SSP — Q2 renewal in progress', type:'client', category:'SSP', region:'US', icp:8, size:'500-1000',
    technologies:[{name:'OpenWrap',cat:'adtech'},{name:'Identity Hub',cat:'cdp'},{name:'AWS',cat:'other'},{name:'Marketo',cat:'crm'}] },
  { name:'Adform', note:'DSP — Warsaw office, warm intro', type:'prospect', category:'DSP', region:'PL', icp:8, size:'200-500',
    technologies:[{name:'ID Fusion',cat:'cdp'},{name:'Flow DSP',cat:'dsp'},{name:'Mixpanel',cat:'analytics'},{name:'HubSpot',cat:'crm'}] },
  { name:'Smart AdServer', note:'French SSP acquired by Equativ', type:'prospect', category:'SSP', region:'FR', icp:6, size:'100-200',
    technologies:[{name:'Equativ Platform',cat:'adtech'},{name:'Prebid.js',cat:'adtech'},{name:'Amplitude',cat:'analytics'}] },
  { name:'Taboola', note:'Native network — no fit for data', type:'nogo', category:'Native', region:'IL', icp:2, size:'1000+',
    technologies:[{name:'Taboola Feed',cat:'adtech'},{name:'Google Analytics',cat:'analytics'},{name:'Salesforce',cat:'crm'}] },
];

const SEED_CONTACTS = [
  { full_name:'Sarah Chen', title:'Head of Data Partnerships', company_name:'The Trade Desk',
    email:'s.chen@thetradedesk.com', phone:'+1 310 555 0142', location:'Los Angeles, CA',
    linkedin_url:'https://linkedin.com/in/sarahchen-ttd',
    seniority:'Director', department:'Partnerships',
    last_contacted:'2025-11-12', source:'Cannes Lions 2024',
    notes:'Met at Cannes Lions 2024. Very interested in CTV segments. Prefers async comms — email first, then Zoom. Decision maker for data vendor onboarding.' },
  { full_name:'Mark Johansson', title:'VP Partnerships', company_name:'Magnite',
    email:'m.johansson@magnite.com', phone:'+1 646 555 0298', location:'New York, NY',
    linkedin_url:'https://linkedin.com/in/markjohansson-magnite',
    seniority:'VP', department:'Partnerships',
    last_contacted:'2026-01-22', source:'LinkedIn outreach',
    notes:'Key contact for renewal. Prefers email over LinkedIn. Has final sign-off on data contracts under $500k. Golf enthusiast — mentioned in past call.' },
  { full_name:'Anna Kowalski', title:'Partnership Manager', company_name:'Adform',
    email:'a.kowalski@adform.com', phone:'+48 22 555 0371', location:'Warsaw, PL',
    linkedin_url:'https://linkedin.com/in/anna-kowalski-adform',
    seniority:'Manager', department:'Business Development',
    last_contacted:'2026-02-08', source:'Warsaw AdTech Meetup',
    notes:'Warsaw-based. Speaks Polish. Coffee chat pending. Warm intro from Piotr at IAB Poland. Reports to CRO.' },
];


// ── 5. CONTACT COUNT SNAPSHOTS & DELTAS ────────────────────
// Tracks changes in stored contact counts between page loads.
// Persisted in localStorage under key 'oaCtSnap'.

let prevContactCounts = {};
let contactDeltas = {}; // name → { delta, type:'up'|'down'|'new' }

function slugify(name) {
  return (name || '').toLowerCase().replace(/\s+/g, '-');
}

function snapshotContactCounts() {
  const snap = {};
  companies.forEach(c => {
    snap[slugify(c.name)] = contacts.filter(x =>
      (x.company_name || '').toLowerCase() === c.name.toLowerCase()
    ).length;
  });
  localStorage.setItem('oaCtSnap', JSON.stringify(snap));
}

function computeDeltas() {
  contactDeltas = {};
  companies.forEach(c => {
    const key  = slugify(c.name);
    const curr = contacts.filter(x => (x.company_name || '').toLowerCase() === c.name.toLowerCase()).length;
    const prev = prevContactCounts[key];
    if (prev === undefined) return; // first time — no delta
    const diff = curr - prev;
    if (diff > 0) contactDeltas[c.name] = { delta: diff, type: prev === 0 ? 'new' : 'up' };
    else if (diff < 0) contactDeltas[c.name] = { delta: diff, type: 'down' };
  });
}


// ── 6. LOAD DATA ───────────────────────────────────────────
async function loadData() {
  const dot = document.getElementById('statusDot');
  const txt = document.getElementById('statusText');

  try { prevContactCounts = JSON.parse(localStorage.getItem('oaCtSnap') || '{}'); }
  catch { prevContactCounts = {}; }

  // First visit: seed a fake snapshot so deltas demo immediately
  if (!Object.keys(prevContactCounts).length) {
    prevContactCounts = { 'the-trade-desk': 0, 'magnite': 2, 'adform': 0 };
  }

  try {
    const timer = setTimeout(() => { throw new Error('timeout'); }, 8000);
    const [co, ct] = await Promise.all([
      sbFetch('/rest/v1/companies?select=*&order=name.asc'),
      sbFetch('/rest/v1/contacts?select=*&order=full_name.asc')
    ]);
    clearTimeout(timer);
    companies = co.length ? co : SEED_COMPANIES;
    contacts  = ct.length ? ct : SEED_CONTACTS;
    const src = co.length ? 'Live' : 'Seed';
    dot.className = co.length ? 'live' : 'seed';
    txt.textContent = `● ${src} · ${companies.length}co`;
  } catch (err) {
    companies = SEED_COMPANIES;
    contacts  = SEED_CONTACTS;
    dot.className = 'seed';
    txt.textContent = `○ Seed · ${companies.length}co`;
  }

  computeDeltas();
  snapshotContactCounts();
  updateStats();
  renderList();
  renderPipeline();
  renderWeekly();
  renderMetrics();
  if (activeTab === 'contacts') updateUrgencyCounts();
}


// ── 7. STATS BAR ───────────────────────────────────────────
function updateStats() {
  const counts = { all:0, client:0, poc:0, partner:0, prospect:0, nogo:0 };
  companies.forEach(c => {
    counts.all++;
    if (counts[c.type] !== undefined) counts[c.type]++;
  });
  ['all','client','poc','partner','prospect','nogo'].forEach((k, i) => {
    document.getElementById('sc' + i).textContent = counts[k];
  });
}

function setFilter(f, triggerEl) {
  activeFilter = f;
  document.querySelectorAll('.sc').forEach(el => el.classList.toggle('active', el.dataset.f === f));
  document.querySelectorAll('.lf').forEach(el => el.classList.toggle('active', el.dataset.f === f));
  filterList();
}


// ── 8. TABS ────────────────────────────────────────────────
function switchTab(t) {
  activeTab = t;
  document.getElementById('tabCo').classList.toggle('active', t === 'companies');
  document.getElementById('tabCt').classList.toggle('active', t === 'contacts');
  document.getElementById('coFilters').style.display = t === 'companies' ? '' : 'none';
  document.getElementById('urgencyBar').classList.toggle('visible', t === 'contacts');
  if (t === 'contacts') updateUrgencyCounts();
  filterList();
}


// ── 9. URGENCY CLASSIFIER ──────────────────────────────────
// Edit thresholds here: fresh ≤ 14 days, hot ≤ 21 days, rotten ≥ 60 days.
let activeUrgency = 'all';

function getUrgency(c) {
  const now   = Date.now();
  const dayMs = 86400000;

  const hasEmail = !!(c.email);
  const hasLI    = !!(c.linkedin_url);
  const hasNotes = !!(c.notes && c.notes.length > 10);
  const infoScore = (hasEmail ? 1 : 0) + (hasLI ? 1 : 0) + (hasNotes ? 1 : 0);

  const lastRaw  = c.last_contacted || c.last_contact;
  const lastMs   = lastRaw ? new Date(lastRaw).getTime() : null;
  const daysSince = lastMs ? Math.floor((now - lastMs) / dayMs) : null;

  const addedRaw = c.created_at || c.updated_at;
  const addedMs  = addedRaw ? new Date(addedRaw).getTime() : null;
  const daysOld  = addedMs ? Math.floor((now - addedMs) / dayMs) : null;

  if (infoScore <= 1)                             return 'fog';
  if (daysOld !== null && daysOld <= 14 && !lastMs) return 'fresh';
  if (!lastMs)                                    return 'ghost';
  if (daysSince !== null && daysSince <= 21)      return 'hot';
  if (daysSince !== null && daysSince >= 60)      return 'rotten';
  return 'ghost';
}

function setUrgency(u) {
  activeUrgency = u;
  document.querySelectorAll('.uf').forEach(el => el.classList.toggle('active', el.dataset.u === u));
  filterList();
}

function updateUrgencyCounts() {
  const buckets = { all:0, fresh:0, hot:0, rotten:0, ghost:0, fog:0 };
  contacts.forEach(c => {
    buckets.all++;
    const u = getUrgency(c);
    if (buckets[u] !== undefined) buckets[u]++;
  });
  Object.entries(buckets).forEach(([k, v]) => {
    const el = document.getElementById('uc-' + k);
    if (el) el.textContent = v;
  });
}


// ── 10. LIST RENDERING ─────────────────────────────────────
function filterList() {
  searchQ = document.getElementById('searchInput').value.toLowerCase();
  if (activeTab === 'companies') renderCompanies();
  else renderContacts();
}

function renderCompanies() {
  const filtered = companies.filter(c => {
    const mf = activeFilter === 'all' || c.type === activeFilter;
    const ms = !searchQ || (c.name || '').toLowerCase().includes(searchQ) || (c.note || '').toLowerCase().includes(searchQ);
    return mf && ms;
  });
  document.getElementById('listMeta').textContent = `${filtered.length} of ${companies.length} companies`;
  document.getElementById('listScroll').innerHTML = filtered.length
    ? filtered.map(c => coRow(c)).join('')
    : '<div style="padding:20px;text-align:center;color:var(--t3);font-size:11px">No companies found</div>';
}

function renderContacts() {
  const filtered = contacts.filter(c => {
    const ms = !searchQ
      || (c.full_name    || '').toLowerCase().includes(searchQ)
      || (c.company_name || '').toLowerCase().includes(searchQ)
      || (c.title        || '').toLowerCase().includes(searchQ);
    const mu = activeUrgency === 'all' || getUrgency(c) === activeUrgency;
    return ms && mu;
  });
  document.getElementById('listMeta').textContent = `${filtered.length} of ${contacts.length} contacts`;
  document.getElementById('listScroll').innerHTML = filtered.length
    ? filtered.map(c => ctRow(c)).join('')
    : '<div style="padding:20px;text-align:center;color:var(--t3);font-size:11px">No contacts match</div>';
}

function coRow(c) {
  const [bg, fg] = avatar(c.name);
  const ini  = initials(c.name);
  const [tc, cls] = tagInfo(c.type);
  const note = (c.note || '').length > 48 ? (c.note || '').slice(0, 48) + '…' : (c.note || '');
  const sel  = selectedCompany && selectedCompany.name === c.name ? ' selected' : '';
  const enc  = encodeURIComponent(c.name);
  const ctCount = contacts.filter(x => (x.company_name || '').toLowerCase() === c.name.toLowerCase()).length;

  let ctBadge = '';
  if (ctCount > 0) {
    const d = contactDeltas[c.name];
    let deltaHtml = '';
    if (d) {
      const sign  = d.delta > 0 ? '+' : '';
      const label = d.type === 'new' ? `+${d.delta} new` : `${sign}${d.delta}`;
      deltaHtml = `<span class="ct-delta ${d.type} flash">${label}</span>`;
    }
    ctBadge = `<span class="ct-ticker"><span class="ct-count">👤${ctCount}</span>${deltaHtml}</span>`;
  }

  return `<div class="co-row${sel}" onclick="selectCompany('${enc}')" oncontextmenu="showCtx(event,'${enc}','${c.type}');return false;">
    <div class="av" style="background:${bg};border-color:${fg}40;color:${fg}">${ini}</div>
    <div style="flex:1;min-width:0">
      <div class="rn">${e(c.name)}</div>
      <div class="rno">${e(note) || '—'}</div>
    </div>
    ${ctBadge}
    <span class="tag ${cls}">${tc}</span>
  </div>`;
}

function ctRow(c) {
  const [bg, fg] = avatar(c.full_name || '?');
  const ini = initials(c.full_name || '?');
  const enc = encodeURIComponent(c.full_name || '');
  const u   = getUrgency(c);

  // Edit urgency icon/color map here
  const URGENCY_META = {
    fresh:  { icon:'🥩', color:'#146B3A' },
    hot:    { icon:'🔥', color:'#92400E' },
    rotten: { icon:'🍅', color:'#991B1B' },
    ghost:  { icon:'👻', color:'#4C1D95' },
    fog:    { icon:'🌫️', color:'#475569' },
  };
  const um = URGENCY_META[u];
  const urgencyBadge = um
    ? `<span style="font-family:'IBM Plex Mono',monospace;font-size:8px;color:${um.color};flex-shrink:0">${um.icon}</span>`
    : '';

  return `<div class="co-row" onclick="openDrawerByName('${enc}')">
    <div class="av av-round" style="background:${bg};border-color:${fg}40;color:${fg}">${ini}</div>
    <div style="flex:1;min-width:0">
      <div class="rn">${e(c.full_name || '')}</div>
      <div class="rno">${e(c.title || '')}${c.company_name ? ' · ' + e(c.company_name) : ''}</div>
    </div>
    ${urgencyBadge}
  </div>`;
}


// ── 11. COMPANY DETAIL PANEL ────────────────────────────────
function selectCompany(enc) {
  const name = decodeURIComponent(enc);
  const c = companies.find(x => x.name === name);
  if (!c) return;
  selectedCompany = c;
  renderCompanies();
  showCompanyDetail(c);
}

function showCompanyDetail(c) {
  document.getElementById('emptyState').style.display   = 'none';
  document.getElementById('companyDetail').style.display = '';

  const [bg, fg] = avatar(c.name);
  const ini  = initials(c.name);
  const [tc, cls] = tagInfo(c.type);
  const icp  = c.icp || 5;
  const stars = '★'.repeat(Math.min(5, Math.round(icp / 2))) + '☆'.repeat(5 - Math.min(5, Math.round(icp / 2)));

  // Header
  const cpAv = document.getElementById('cpAv');
  cpAv.style.cssText = `background:${bg};border:1px solid ${fg}40;color:${fg};width:40px;height:40px;font-size:13px;font-weight:600;font-family:'IBM Plex Mono',monospace;border-radius:2px;display:flex;align-items:center;justify-content:center;`;
  cpAv.textContent = ini;
  document.getElementById('cpName').textContent  = c.name;
  document.getElementById('cpTag').textContent   = tc;
  document.getElementById('cpTag').className     = 'tag ' + cls;
  document.getElementById('cpStars').textContent = stars + ' ICP ' + icp + '/10';

  // Detail grid
  document.getElementById('cpCat').textContent  = c.category || '—';
  document.getElementById('cpReg').textContent  = c.region   || '—';
  document.getElementById('cpSize').textContent = c.size     || '—';
  document.getElementById('cpUpd').textContent  = c.updated_at ? c.updated_at.slice(0, 10) : '—';

  const web = c.website;
  document.getElementById('cpWeb').innerHTML = web
    ? `<a href="${web}" target="_blank" rel="noopener">${web.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a>`
    : '—';
  const li = c.linkedin_slug;
  document.getElementById('cpLi').innerHTML = li
    ? `<a href="https://linkedin.com/company/${li}" target="_blank" rel="noopener">${li}</a>`
    : '—';

  // Collapsible sections
  document.getElementById('cpAngle').textContent   = getAngle(c);
  document.getElementById('cpNoteText').textContent = c.note || 'No notes.';
  renderTechTags(c);

  // Actions — edit prompt strings here
  const acts = [
    { l:'Full report',  fn:`Research ${c.name} — full contact report with decision makers, outreach angle, ICP fit for onAudience` },
    { l:'Find DMs',     fn:`Find Head of Programmatic or Data Partnerships at ${c.name} — LinkedIn, email, background` },
    { l:'Draft email',  fn:`Draft personalized outreach email to ${c.name} — value-led and curiosity variants` },
    { l:'LinkedIn msg', fn:`Draft LinkedIn connection note for ${c.name} — short, personalized for data partnerships` },
    { l:'Find similar', fn:`Find 10 companies similar to ${c.name} for onAudience outreach — ranked by ICP fit` },
    { l:'Gmail history',fn:`Check Gmail for any previous contact with ${c.name} — summarize relationship history` },
  ];
  document.getElementById('cpActions').innerHTML = acts.map(a =>
    `<button class="btn" onclick="openClaude(${JSON.stringify(a.fn)})">${a.l}</button>`
  ).join('');

  // Contacts list
  const myContacts = contacts.filter(x => (x.company_name || '').toLowerCase() === c.name.toLowerCase());
  document.getElementById('cpContactBadge').textContent = myContacts.length;

  if (!myContacts.length) {
    document.getElementById('cpContactsList').innerHTML = `
      <div style="padding:10px 20px 14px;display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:11px;color:var(--t3)">No contacts yet</span>
        <button class="btn sm" onclick="openClaude('Find Head of Programmatic / Data Partnerships at ${c.name} — name, LinkedIn, email, background')">Find contacts ↗</button>
      </div>`;
  } else {
    document.getElementById('cpContactsList').innerHTML = '<div class="panel-contacts">' +
      myContacts.map(ct => {
        const [cbg, cfg] = avatar(ct.full_name || '?');
        const cini = initials(ct.full_name || '?');
        const cenc = encodeURIComponent(ct.full_name || '');
        return `<div class="panel-contact-row" onclick="openDrawerByName('${cenc}')">
          <div class="pcr-av" style="background:${cbg};border:1px solid ${cfg}40;color:${cfg}">${cini}</div>
          <div style="flex:1;min-width:0">
            <div class="pcr-name">${e(ct.full_name || '')}</div>
            <div class="pcr-title">${e(ct.title || '')}</div>
          </div>
        </div>`;
      }).join('') + '</div>';
  }
}

function closeCompany() {
  selectedCompany = null;
  document.getElementById('companyDetail').style.display = 'none';
  document.getElementById('emptyState').style.display    = '';
  renderCompanies();
}

// Edit outreach angle copy per company type here
function getAngle(c) {
  const angles = {
    client:   `${c.name} is an active client. Focus on retention and upsell — explore expanding data usage to new verticals, additional geos, or CTV inventory. Ask about upcoming campaigns and budget cycles.`,
    partner:  `${c.name} is a data partner. Explore co-sell and GTM opportunities — joint case studies, shared pipeline, and bundled data packages for mutual clients. Identify their top 3 client segments.`,
    prospect: `${c.name} is a cold prospect. Lead with the TTD Marketplace angle or onAudience's EMEA cookie-free segments. Find their Head of Data Partnerships and personalize with a recent campaign hook.`,
    poc:      `${c.name} is in POC stage. Push toward a renewal or expansion — highlight the data quality metrics from the trial and propose a deal structure that fits their scale.`,
    nogo:     `${c.name} is currently marked no-go. Review the notes before any outreach — there may be a relationship issue, competitive conflict, or internal policy to address first.`,
  };
  return angles[c.type] || `Research ${c.name} to determine the best outreach approach for onAudience data partnerships.`;
}

function toggleSection(id) {
  const ps      = document.getElementById(id);
  const body    = ps.querySelector('.ps-body');
  const chevron = ps.querySelector('.ps-chevron');
  const open    = body.classList.toggle('open');
  chevron.classList.toggle('open', open);
}


// ── 12. TECH TAGS & SCANNER ────────────────────────────────
// Category → CSS class mapping (classes defined in hub.css)
const TECH_CAT_CLASS = { adtech:'tt-adtech', analytics:'tt-analytics', dsp:'tt-dsp', cdp:'tt-cdp', crm:'tt-crm', other:'tt-other' };
const TECH_CAT_LABEL = { adtech:'AdTech', analytics:'Analytics', dsp:'DSP', cdp:'CDP/ID', crm:'CRM', other:'Infra' };

function renderTechTags(c) {
  const container = document.getElementById('cpTechTags');
  const badge     = document.getElementById('cpTechBadge');
  const techs     = c.technologies || c.tech || [];
  const website   = c.website || '';

  if (!techs.length) {
    badge.textContent = '0';
    container.innerHTML = `
      <span style="font-size:11px;color:var(--t3);flex:1">No tech data yet.</span>
      <button class="tech-scan-btn" id="techScanBtn" onclick="scanTechnologies(${JSON.stringify(c.name)},${JSON.stringify(website)})">⬡ Scan website</button>`;
    return;
  }

  badge.textContent = techs.length;
  const tags = techs.map(t => {
    const cat = t.cat || 'other';
    const cls = TECH_CAT_CLASS[cat] || 'tt-other';
    const lbl = TECH_CAT_LABEL[cat] || 'Other';
    return `<span class="tech-tag ${cls}" title="${lbl}: ${e(t.name)}">${e(t.name)}</span>`;
  }).join('');
  container.innerHTML = tags +
    `<button class="tech-scan-btn" style="margin-left:auto" onclick="scanTechnologies(${JSON.stringify(c.name)},${JSON.stringify(website)})">↺ Re-scan</button>`;
}

function scanTechnologies(name, website) {
  const container = document.getElementById('cpTechTags');
  const badge     = document.getElementById('cpTechBadge');

  container.innerHTML = `
    <span style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--t3);display:flex;align-items:center;gap:6px;padding:2px 0">
      <span style="display:inline-block;width:8px;height:8px;border:1.5px solid var(--g);border-top-color:transparent;border-radius:50%;animation:spin .7s linear infinite"></span>
      Scanning ${website || name}…
    </span>`;
  badge.textContent = '…';

  // Edit scan prompt here — add/remove technology categories as needed
  const siteRef = website ? `Visit and scan the website ${website}` : `Search for the technology stack of ${name}`;
  const prompt  = `${siteRef}. Your task: identify all 3rd-party advertising, data, and analytics technologies present.

Focus specifically on technologies relevant to onAudience (a data provider / DMP specialising in audience segments for programmatic advertising):

1. DSP integrations (The Trade Desk, DV360, Xandr, Amazon DSP, MediaMath, Adform, etc.)
2. SSP / ad server tags (Prebid.js, GPT, Magnite, PubMatic, Index Exchange, OpenX, etc.)
3. Data / identity solutions (LiveRamp, UID2, ID5, RampID, Lotame, Nielsen, Comscore, etc.)
4. DMPs / CDPs (Adobe Audience Manager, Salesforce DMP, Segment, Tealium, mParticle, etc.)
5. Measurement / attribution (IAS, MOAT, DoubleVerify, Nielsen DAR, Comscore vCE)
6. Analytics (Google Analytics, Adobe Analytics, Mixpanel, Amplitude, Piano)
7. CRM / MAP (Salesforce, HubSpot, Marketo, Pardot)
8. Onboarding / enrichment (Acxiom, Experian, Oracle Data Cloud, Neustar)
9. CTV / video (FreeWheel, SpotX, Innovid, Flashtalking)

Return ONLY a JSON array — no prose, no markdown, no explanation:
[{"name":"Prebid.js","cat":"adtech"},{"name":"LiveRamp","cat":"cdp"},{"name":"Google Analytics","cat":"analytics"}]

Categories: adtech | dsp | cdp | crm | analytics | other
If no relevant technologies are found, return: []`;

  fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: prompt }]
    })
  })
  .then(r => r.json())
  .then(data => {
    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    let techs = [];
    const match = text.match(/\[[\s\S]*?\]/);
    if (match) { try { techs = JSON.parse(match[0]); } catch {} }

    if (selectedCompany) selectedCompany.technologies = techs;

    if (!techs.length) {
      badge.textContent = '0';
      container.innerHTML = `
        <span style="font-size:11px;color:var(--t3);flex:1">No onAudience-relevant tech detected.</span>
        <button class="tech-scan-btn" onclick="scanTechnologies(${JSON.stringify(name)},${JSON.stringify(website)})">↺ Retry</button>`;
      return;
    }

    badge.textContent = techs.length;
    const tags = techs.map(t => {
      const cat = t.cat || 'other';
      const cls = TECH_CAT_CLASS[cat] || 'tt-other';
      const lbl = TECH_CAT_LABEL[cat] || 'Other';
      return `<span class="tech-tag ${cls}" title="${lbl}: ${e(t.name)}">${e(t.name)}</span>`;
    }).join('');
    container.innerHTML = tags +
      `<button class="tech-scan-btn" style="margin-left:auto" onclick="scanTechnologies(${JSON.stringify(name)},${JSON.stringify(website)})">↺ Re-scan</button>`;
  })
  .catch(() => {
    badge.textContent = '!';
    container.innerHTML = `
      <span style="font-size:11px;color:var(--t3);flex:1">Scan failed.</span>
      <button class="tech-scan-btn" onclick="scanTechnologies(${JSON.stringify(name)},${JSON.stringify(website)})">↺ Retry</button>`;
  });
}


// ── 13. CONTACT DRAWER ─────────────────────────────────────
function openDrawerByName(enc) {
  const name = decodeURIComponent(enc);
  const c = contacts.find(x => x.full_name === name);
  if (!c) return;
  openDrawer(c);
}

function openDrawer(c) {
  const [bg, fg] = avatar(c.full_name || '?');
  const ini = initials(c.full_name || '?');

  const av = document.getElementById('drawerAv');
  av.style.cssText = `width:40px;height:40px;font-size:13px;background:${bg};border:1px solid ${fg}40;color:${fg};border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-weight:600;flex-shrink:0`;
  av.textContent = ini;

  document.getElementById('drawerName').textContent       = c.full_name || '';
  document.getElementById('drawerTitleText').textContent  = c.title     || '';
  document.getElementById('drawerMeta').innerHTML =
    (c.seniority  ? `<span class="tag tpo">${e(c.seniority)}</span>`  : '') +
    (c.department ? `<span class="tag tn">${e(c.department)}</span>` : '');

  // Contact details
  document.getElementById('drawerEmail').innerHTML    = c.email        ? `<a href="mailto:${c.email}">${e(c.email)}</a>`                                     : '<span style="color:var(--t3)">—</span>';
  document.getElementById('drawerPhone').innerHTML    = c.phone        ? `<a href="tel:${c.phone}">${e(c.phone)}</a>`                                        : '<span style="color:var(--t3)">—</span>';
  document.getElementById('drawerLI').innerHTML       = c.linkedin_url ? `<a href="${c.linkedin_url}" target="_blank" rel="noopener">View profile ↗</a>`      : '<span style="color:var(--t3)">—</span>';
  document.getElementById('drawerLocation').textContent = c.location || '—';

  // Role & relationship
  document.getElementById('drawerCompany').innerHTML = c.company_name
    ? `<span style="cursor:pointer;color:var(--g)" onclick="closeDrawer();selectCompanyByName(${JSON.stringify(c.company_name)})">${e(c.company_name)} ↗</span>`
    : '<span style="color:var(--t3)">—</span>';
  document.getElementById('drawerDept').textContent      = c.department || '—';
  document.getElementById('drawerSeniority').textContent = c.seniority  || '—';
  document.getElementById('drawerSource').textContent    = c.source     || '—';
  document.getElementById('drawerLastContact').textContent = c.last_contacted
    ? fmtDate(c.last_contacted) : (c.last_contact ? fmtDate(c.last_contact) : '—');
  document.getElementById('drawerAdded').textContent = c.created_at
    ? fmtDate(c.created_at) : (c.updated_at ? fmtDate(c.updated_at) : '—');

  document.getElementById('drawerNotes').textContent = c.notes || c.note || 'No notes yet.';

  // Actions — edit prompt strings here
  const acts = [
    { l:'Draft email',   fn:`Draft personalized outreach email to ${c.full_name} at ${c.company_name || 'their company'} — value-led for onAudience data partnerships` },
    { l:'LinkedIn msg',  fn:`Draft LinkedIn connection note for ${c.full_name}, ${c.title || 'decision maker'} at ${c.company_name || 'their company'}` },
    { l:'Gmail history', fn:`Check Gmail for any email history with ${c.full_name} or ${c.email || c.company_name || 'this contact'}` },
    { l:'Full research', fn:`Research ${c.full_name} at ${c.company_name || 'their company'} — background, priorities, talking points for onAudience outreach` },
  ];
  document.getElementById('drawerActions').innerHTML = acts.map(a =>
    `<button class="btn" onclick="openClaude(${JSON.stringify(a.fn)})">${a.l}</button>`
  ).join('');

  document.getElementById('drawerCTA').textContent = `Full contact report — ${c.full_name} ↗`;
  document.getElementById('drawerCTA').onclick = () => openClaude(
    `Full contact report for ${c.full_name}, ${c.title || ''} at ${c.company_name || ''} — background, best outreach angle, email draft for onAudience`
  );

  document.getElementById('drawerOverlay').style.display = 'block';
  document.getElementById('contactDrawer').classList.add('open');
}

function closeDrawer() {
  document.getElementById('drawerOverlay').style.display = 'none';
  document.getElementById('contactDrawer').classList.remove('open');
}


// ── 14. CONTEXT MENU ───────────────────────────────────────
// Edit right-click actions and prompt strings here
function showCtx(ev, enc, type) {
  ev.preventDefault(); ev.stopPropagation();
  const name = decodeURIComponent(enc);
  const menu = document.getElementById('ctxMenu');

  const actions = [
    { icon:'🔍', text:'Full contact report', fn:`Research ${name} — full contact report with decision makers, outreach angle, and ICP fit score` },
    { icon:'👤', text:'Find decision makers', fn:`Find Head of Programmatic or Data Partnerships at ${name} — LinkedIn, email, background` },
    { icon:'✉',  text:'Draft outreach email', fn:`Draft a personalized outreach email to ${name} — value-led and curiosity variants` },
    { icon:'💬', text:'LinkedIn message',     fn:`Draft LinkedIn connection note and InMail for ${name} — short, personalized` },
    { icon:'🔗', text:'Find similar',         fn:`Find 10 companies similar to ${name} for onAudience outreach — ranked by ICP fit` },
    { icon:'📧', text:'Check email history',  fn:`Check Gmail for any previous contact with ${name} — summarize relationship history` },
  ];
  if (type === 'nogo')    actions.push({ icon:'⚠️', text:'Why no outreach?', fn:`Explain why ${name} is marked no-outreach in onAudience database` });
  if (type === 'prospect') actions.push({ icon:'🚀', text:'Prioritize',      fn:`Create a prioritization plan for closing ${name} as an onAudience data partner — next 30 days` });

  menu.innerHTML = `<div class="ctx-label">${name}</div><div class="ctx-sep"></div>` +
    actions.map((a, i) => `<div class="ctx-item" data-i="${i}"><span class="ctx-icon">${a.icon}</span>${a.text}</div>`).join('');
  menu.querySelectorAll('.ctx-item').forEach((el, i) => {
    el.addEventListener('click', () => { menu.style.display = 'none'; openClaude(actions[i].fn); });
  });

  const x = Math.min(ev.clientX, window.innerWidth - 230);
  const y = Math.min(ev.clientY, window.innerHeight - (actions.length * 34 + 40));
  menu.style.cssText = `display:block;left:${x}px;top:${y}px`;
}
document.addEventListener('click', ev => {
  if (!document.getElementById('ctxMenu').contains(ev.target))
    document.getElementById('ctxMenu').style.display = 'none';
});


// ── 15. SALES PLANNING ─────────────────────────────────────
// Stage → tag class mapping (tag classes in hub.css)
const STAGE_COLORS = { prospect:'tpr', outreach:'tpr', engaged:'tpo', proposal:'tp', negotiation:'tp', closed:'tc' };

function renderPipeline() {
  document.getElementById('pipeCount').textContent = pipeline.length;
  document.getElementById('pipelineList').innerHTML = pipeline.length
    ? pipeline.map(p => `
      <div class="pipeline-item" onclick="openClaude('Give me a sales strategy for closing ${e(p.name)} in onAudience pipeline — stage: ${p.stage}, notes: ${e(p.notes || '')}')">
        <div class="pi-name">${e(p.name)}<span class="pi-stage tag ${STAGE_COLORS[p.stage] || 'tn'}">${p.stage}</span></div>
        <div class="pi-meta">${p.value ? '€' + Number(p.value).toLocaleString() : 'No est.'}</div>
      </div>`).join('')
    : '<div style="font-size:11px;color:var(--t3);padding:4px 0">No pipeline entries yet</div>';
}

function renderWeekly() {
  const done  = weeklyTasks.filter(t => t.done).length;
  const total = weeklyTasks.length;
  document.getElementById('goalProgress').textContent = `${done}/${total}`;
  document.getElementById('progressFill').style.width = total ? Math.round(done / total * 100) + '%' : '0%';
  document.getElementById('weeklyList').innerHTML = weeklyTasks.length
    ? weeklyTasks.map((t, i) => `
      <div class="weekly-item" onclick="toggleTask(${i})">
        <div class="wi-check${t.done ? ' done' : ''}">${t.done ? '✓' : ''}</div>
        <div class="wi-text${t.done ? ' done' : ''}">${e(t.name)}</div>
      </div>`).join('')
    : '<div style="font-size:11px;color:var(--t3);padding:4px 0">No tasks this week</div>';
}

function toggleTask(i) {
  weeklyTasks[i].done = !weeklyTasks[i].done;
  localStorage.setItem('oaWeekly', JSON.stringify(weeklyTasks));
  renderWeekly();
}

function renderMetrics() {
  document.getElementById('mEmails').textContent    = metrics.emails    || 0;
  document.getElementById('mMeetings').textContent  = metrics.meetings  || 0;
  document.getElementById('mProposals').textContent = metrics.proposals || 0;
  document.getElementById('mDeals').textContent     = pipeline.length   || 0;
}

function setPlanType(t) {
  planType = t;
  document.getElementById('planTypePipeline').classList.toggle('p', t === 'pipeline');
  document.getElementById('planTypeTask').classList.toggle('p', t === 'task');
  document.getElementById('planStageField').style.display = t === 'pipeline' ? '' : 'none';
  document.getElementById('planValueField').style.display = t === 'pipeline' ? '' : 'none';
}

function openPlanModal() {
  setPlanType('pipeline');
  document.getElementById('planName').value  = '';
  document.getElementById('planNotes').value = '';
  document.getElementById('planValue').value = '';
  document.getElementById('planOverlay').classList.add('vis');
  setTimeout(() => document.getElementById('planName').focus(), 50);
}

function closePlanModal() { document.getElementById('planOverlay').classList.remove('vis'); }

function savePlanEntry() {
  const name = document.getElementById('planName').value.trim();
  if (!name) return;
  if (planType === 'pipeline') {
    pipeline.push({ name, stage: document.getElementById('planStage').value, value: document.getElementById('planValue').value, notes: document.getElementById('planNotes').value });
    localStorage.setItem('oaPipeline', JSON.stringify(pipeline));
    renderPipeline(); renderMetrics();
  } else {
    weeklyTasks.push({ name, done: false, notes: document.getElementById('planNotes').value });
    localStorage.setItem('oaWeekly', JSON.stringify(weeklyTasks));
    renderWeekly();
  }
  closePlanModal();
}


// ── 16. RESEARCH MODAL ─────────────────────────────────────
let _modalTemplate = '';

function openModal(title, desc, template) {
  _modalTemplate = template;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalDesc').textContent  = desc;
  document.getElementById('modalInput').value       = '';
  document.getElementById('overlay').classList.add('vis');
  setTimeout(() => document.getElementById('modalInput').focus(), 50);
}

function closeModal() { document.getElementById('overlay').classList.remove('vis'); }

function submitModal() {
  const val = document.getElementById('modalInput').value.trim();
  if (!val) return;
  closeModal();
  openClaude(_modalTemplate.replace(/\[COMPANY\]/g, val));
}


// ── 17. HELPERS ────────────────────────────────────────────
function fmtDate(str) {
  if (!str) return '—';
  try { return new Date(str).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }); }
  catch { return str.slice(0, 10); }
}

function selectCompanyByName(name) {
  const c = companies.find(x => x.name === name);
  if (c) { selectedCompany = c; switchTab('companies'); renderCompanies(); showCompanyDetail(c); }
}

// Edit Claude base URL here if routing changes
function openClaude(prompt) {
  window.open('https://claude.ai/new?q=' + encodeURIComponent(prompt), '_blank');
}

function doResearch() {
  const q = document.getElementById('searchInput').value.trim();
  if (q) openClaude(`Research ${q} — full contact report with decision makers, outreach angle, and ICP fit for onAudience data partnerships`);
  else openModal('Research a company', 'Enter the company name to generate a full contact report.', 'Research [COMPANY] — full contact report with decision makers, outreach angle, and ICP fit score');
}

// HTML escape
function e(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Generate 2-letter initials from a name
function initials(name) {
  return (name || '?').replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';
}

// Deterministic color pair from name hash
function avatar(name) {
  const p = ['rgba(23,128,102,.18)','rgba(26,79,138,.15)','rgba(122,66,0,.15)','rgba(75,45,158,.14)','rgba(200,80,80,.14)'];
  const f = ['#0F6E56','#1A4F8A','#7A4200','#4B2D9E','#8B3030'];
  let h = 0; for (const c of (name || '')) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  const i = h % p.length;
  return [p[i], f[i]];
}

// Map type string → [label, CSS class]
function tagInfo(type) {
  return { client:['Client','tc'], partner:['Partner','tp'], prospect:['Prospect','tpr'], nogo:['No outreach','tn'], poc:['POC','tpo'] }[type] || ['Unknown','tn'];
}


// ── 18. KEYBOARD SHORTCUTS ─────────────────────────────────
document.addEventListener('keydown', ev => {
  if (ev.key === 'Escape') {
    closeModal(); closePlanModal(); closeDrawer();
    if (selectedCompany) closeCompany();
  }
});


// ── 19. DOM READY HOOKS ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('modalInput').addEventListener('keydown', ev => {
    if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); submitModal(); }
  });
  document.getElementById('planName').addEventListener('keydown', ev => {
    if (ev.key === 'Enter') savePlanEntry();
  });
});


// ── 20. PUBLIC API ─────────────────────────────────────────
window.oaDB = {
  saveCompany: async (rec) => { await sbUpsert('companies', rec); await loadData(); },
  saveContact: async (rec) => { await sbUpsert('contacts',  rec); await loadData(); },
  reload: loadData,
};


// ── 21. INIT ───────────────────────────────────────────────
loadData();
