/* ── onAudience Sales Intelligence Hub · hub.js ── */

const SB_URL = 'https://nyzkkqqjnkctcmxoirdj.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55emtrcXFqbmtjdGNteG9pcmRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzMxMzYsImV4cCI6MjA4OTQ0OTEzNn0.jhAq_C68klOp4iTyj9HmsyyvoxsOI6ACld7t_87TAk0';
const SB_H  = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` };
const SB_W  = { ...SB_H, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' };

/* ── SEED ──────────────────────────────────────────────────────────────── */
const SEED = [
  ['6sense','POC client'],['Adform','integrated partner / DSP Europe'],['Admixer','no outreach'],
  ['Adobe','partner — DMP integration'],['Adtonos','client'],['Alikeaudience','client'],
  ['Aniview','no outreach — failed deal'],['Anzu','POC client'],['Amazon','partner'],
  ['Audience Network','internal — group company'],['Audigent','partner / curation'],
  ['Bango','prospect — via LiveRamp'],['Beintoo','prospect — to continue'],
  ['Belogic TR','partner'],['Bidberry / Carbon / Clickso','partner'],
  ['Bidscube','no outreach — former client'],['Bidtheatre','partner / DSP Scandinavia'],
  ['Big Village','to check'],['Bright Mountain Media','prospect — to continue'],
  ['Bytedance (TikTok)','client — APAC only'],['Captify UK','client'],
  ['Claritas','prospect — to continue'],['Clue','prospect — to continue'],
  ['Criteo','partner — contact: Adrian'],['Datonics','client'],
  ['Dynata','no outreach — former client'],['Echo Analytics','POC client'],
  ['Entity X','client — Adrian'],['Epsilon','partner — Matt deal'],
  ['Equativ','partner / SSP curation'],['Eskimi','no outreach — bad timing'],
  ['Experian','prospect — Karo/Maciek'],['Eyeota','partner'],['Foursquare','partner'],
  ['Fyllo','partner'],['Synthesi','partner — to be'],
  ['GlobalDataResources','partner — NDR acquisition'],['Google','partner'],
  ['Havas PL','client / agency'],['Hybrid','partner'],
  ['ID5','partner / cookieless product'],['Intuizi','client — Adrian'],
  ['Kochava','partner / data provider'],['Lifesight','no outreach — unwanted'],
  ['LiveRamp','partner / marketplace'],['Lotame','no outreach — contract ended'],
  ['Madhive','prospect / DSP — Karolina'],['Mastercard','partner'],
  ['Medianation','no outreach'],['Mediasmart','no outreach — low revenue'],
  ['MediaWallah','partner / data exchange'],['MeMob','client'],
  ['Meta','no outreach — via LiveRamp only'],['Microsoft Advertising (Xandr)','partner'],
  ['Mindvalley','POC client — no renewal'],['MNTN','partner / DSP'],
  ['Mobilewalla','client'],['Moboost','client'],['Multilocal','client — Adrian'],
  ['National Research Group','to check'],['Nexxen','prospect'],['Nielsen','no outreach'],
  ['OpenSignal','client'],['OpenX','prospect'],
  ['Oracle','no outreach — closed ad division'],['Permutive','client'],
  ['Pubmatic','partner'],['Precisely','no outreach'],['Razorpod','no outreach'],
  ['Roq Ad','no outreach — cross-device'],['RTB House','no business'],
  ['Samba TV','prospect'],['Scoota','prospect'],['Semantec','client'],
  ['Semasio','partner — acquired by Fyllo'],
  ['Sharethrough','partner / data exchange'],['Sovrn','client — Adrian'],
  ['Sportradar','prospect — Karolina'],['Taboola','prospect — via MSFT Curate'],
  ['Tapad','no fit'],['TheTradeDesk','partner'],['TikTok','partner — via Bytedance'],
  ['TL1','internal — our company'],['True Data','client'],
  ['Twitch','no fit'],['Twitter','no fit'],
  ['VentiveIQ','prospect — Maciek + Adrian'],['VistarMedia (T-Mobile)','prospect'],
  ['Wowcher','client'],['Zeotap','client'],
  ['Beklever','prospect'],['Havas Spain','prospect'],['Dentsu Thailand','prospect'],
  ['OMD Thailand','prospect'],['Splicky DSP','prospect'],
  ['Traveldesk Global','prospect'],['Liquid Advertising','prospect'],
  ['Stackadapt','prospect'],['Weborama','prospect'],['Memob','client']
];
const SEED_NAMES = new Set(SEED.map(([n]) => n.toLowerCase()));

/* ── STATE ─────────────────────────────────────────────────────────────── */
// var so onclick attrs can reference these as window properties
var companies  = [];
var contacts   = [];
var _companyRows = [];   // ordered list matching rendered rows
var _contactRows = [];   // ordered list matching rendered contact rows (left panel)
var _panelContacts = []; // contacts in current company panel

let activeFilter   = 'all';
let activeTab      = 'companies';
let selectedCompany = null;

/* ── HELPERS ───────────────────────────────────────────────────────────── */
const classify = n => {
  const s = (n||'').toLowerCase();
  if (/no outreach|no fit|no business|internal|closed|unwanted/.test(s)) return 'nogo';
  if (s === 'poc' || /poc client|active deal/.test(s)) return 'poc';
  if (s === 'client' || s.includes('client')) return 'client';
  if (s === 'partner' || s.includes('partner')) return 'partner';
  if (s === 'prospect' || /prospect|to check|to continue|potential/.test(s)) return 'prospect';
  return 'prospect';
};
const tagCls = s => ({client:'tc',partner:'tp',prospect:'tpr',nogo:'tn',poc:'tpo'}[s]||'tpr');
const tagLbl = s => ({client:'Client',partner:'Partner',prospect:'Prospect',nogo:'No outreach',poc:'POC'}[s]||s);
const av = n => {
  const p=[['#9FE1CB30','#0F6E56'],['#B5D4F430','#1A4F8A'],['#FAC77530','#7A4200'],
           ['#C0DD9730','#3B6D11'],['#F4C0D130','#993556']];
  let h=0; for (const c of n) h=(h*31+c.charCodeAt(0))&0xffff;
  return p[h%p.length];
};
const ini = n => (n||'').replace(/[^A-Za-z ]/g,'').split(' ').filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase()||'?';
const stars = n => { const s=Math.min(Math.round((n||0)/2),5); return '★'.repeat(s)+'☆'.repeat(5-s); };
const slug  = n => n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const h = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

/* ── SEED LOAD ─────────────────────────────────────────────────────────── */
function loadSeed() {
  companies = SEED.map(([name, note]) => ({
    id: slug(name), name, note: note||'', type: classify(note),
    icp: null, category: null, region: null, website: null, size: null,
    linkedin_slug: null, fresh: false
  }));
  _buildCoMap();
  setStatus('', `○ Seed · ${companies.length}`);
  updateStats(); renderList();
}

/* ── SKOWYT ────────────────────────────────────────────────────────────── */
async function skowyt() {
  const btn = document.getElementById('skowytBtn');
  const ic  = document.getElementById('skowytIc');
  const lbl = document.getElementById('skowytLbl');
  btn.classList.add('loading');
  ic.textContent  = '↻';
  lbl.textContent = 'Pulling…';
  setStatus('loading', '● Pulling…');
  try {
    const [coRes, ctRes] = await Promise.all([
      fetch(`${SB_URL}/rest/v1/companies?select=*&order=name.asc`, { headers:SB_H, signal:AbortSignal.timeout(8000) }),
      fetch(`${SB_URL}/rest/v1/contacts?select=*&order=full_name.asc`, { headers:SB_H, signal:AbortSignal.timeout(8000) })
    ]);
    if (!coRes.ok) throw new Error(`HTTP ${coRes.status}`);
    const dbCos = await coRes.json();
    contacts = ctRes.ok ? (await ctRes.json()) : [];
    if (!dbCos?.length) throw new Error('Empty');

    const sbMap = new Map(dbCos.map(r => [r.name.toLowerCase(), r]));
    const merged = dbCos.map(r => ({
      id: r.id||slug(r.name), name:r.name, note:r.note||'',
      type: r.type||classify(r.note||''),
      icp: r.icp||null, category:r.category||null, region:r.region||null,
      website:r.website||null, size:r.size||null, linkedin_slug:r.linkedin_slug||null,
      fresh: !SEED_NAMES.has(r.name.toLowerCase())
    }));
    for (const [sName, sNote] of SEED) {
      if (!sbMap.has(sName.toLowerCase()))
        merged.push({ id:slug(sName), name:sName, note:sNote||'', type:classify(sNote),
          icp:null, category:null, region:null, website:null, size:null, linkedin_slug:null, fresh:false });
    }
    merged.sort((a,b) => a.name.localeCompare(b.name));
    companies = merged;
    _buildCoMap();

    setStatus('live', `● Live · ${dbCos.length} / ${contacts.length}`);
    showToast(`✓ Skowyt — ${dbCos.length} co, ${contacts.length} ct`, 'ok');
    updateStats(); renderList();
    if (activeTab === 'contacts') renderContacts();
    if (selectedCompany) {
      const upd = companies.find(c => c.name === selectedCompany.name);
      if (upd) openCompanyPanel(upd);
    }
  } catch (e) {
    setStatus('error', `○ Error`);
    showToast(`✗ Skowyt: ${e.message}`, 'err');
    if (!companies.length) loadSeed();
  } finally {
    btn.classList.remove('loading');
    ic.textContent  = '↓';
    lbl.textContent = 'Skowyt';
  }
}

/* ── STATUS / TOAST ────────────────────────────────────────────────────── */
function setStatus(state, text) {
  document.getElementById('statusDot').className = 'status-dot ' + (state||'');
  document.getElementById('statusText').textContent = text;
}
let _tt;
function showToast(msg, type='ok') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className   = `toast ${type} show`;
  clearTimeout(_tt);
  _tt = setTimeout(() => t.classList.remove('show'), 3500);
}

/* ── STATS ─────────────────────────────────────────────────────────────── */
function updateStats() {
  document.getElementById('stAll').textContent      = companies.length;
  document.getElementById('stClient').textContent   = companies.filter(c=>c.type==='client'||c.type==='poc').length;
  document.getElementById('stPoc').textContent      = companies.filter(c=>c.type==='poc').length;
  document.getElementById('stPartner').textContent  = companies.filter(c=>c.type==='partner').length;
  document.getElementById('stProspect').textContent = companies.filter(c=>c.type==='prospect').length;
  document.getElementById('stNogo').textContent     = companies.filter(c=>c.type==='nogo').length;
  document.getElementById('stFresh').textContent    = companies.filter(c=>c.fresh).length;
}

/* ── TABS ──────────────────────────────────────────────────────────────── */
function switchTab(tab) {
  activeTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.getElementById('coPanel').style.display = tab === 'companies' ? 'flex' : 'none';
  document.getElementById('ctPanel').style.display = tab === 'contacts'  ? 'flex' : 'none';
  if (tab === 'contacts') renderContacts();
}

/* ── FILTER ────────────────────────────────────────────────────────────── */
function setFilter(f, el) {
  activeFilter = f;
  document.querySelectorAll('.sc, .fp').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  document.querySelectorAll(`[data-f="${f}"]`).forEach(b => b.classList.add('active'));
  renderList();
}

/* ── RENDER COMPANIES ──────────────────────────────────────────────────── */
function renderList() {
  const q = (document.getElementById('coSearch').value||'').toLowerCase();
  const filtered = companies.filter(c => {
    if (activeFilter === 'fresh' && !c.fresh) return false;
    if (activeFilter !== 'all' && activeFilter !== 'fresh' && c.type !== activeFilter) return false;
    if (q) return (c.name+(c.note||'')+(c.category||'')+(c.region||'')).toLowerCase().includes(q);
    return true;
  });
  document.getElementById('coMeta').textContent = `${filtered.length} of ${companies.length}`;
  _companyRows = filtered; // store for event delegation
  const list = document.getElementById('coList');
  if (!filtered.length) {
    list.innerHTML = '<div class="empty-list"><div class="empty-big">∅</div><div class="empty-sub">No matches</div></div>';
    return;
  }
  list.innerHTML = filtered.map((c, i) => {
    const [bg,fg] = av(c.name);
    const note    = (c.category && c.region) ? `${c.category} · ${c.region}` : (c.note||'').slice(0,55)||'—';
    const icp     = c.icp ? `<span class="icp-num">${c.icp}</span>` : '';
    const sel     = selectedCompany?.name === c.name;
    const freshDot = c.fresh ? ' 🥩' : '';
    return `<div class="co-row${sel?' selected':''}" data-co="${i}" data-type="${c.type}" data-fresh="${c.fresh}">
      <div class="co-av" style="background:${bg};border-color:${fg}30;color:${fg}">${ini(c.name)}</div>
      <div class="co-info">
        <div class="co-name">${h(c.name)}${freshDot}</div>
        <div class="co-note-sm">${h(note)}</div>
      </div>
      <div class="co-right">${icp}<span class="tag ${tagCls(c.type)}">${tagLbl(c.type)}</span></div>
    </div>`;
  }).join('');
}

/* ── RENDER CONTACTS (left panel) ──────────────────────────────────────── */
function renderContacts() {
  const q = (document.getElementById('ctSearch').value||'').toLowerCase();
  const filtered = contacts.filter(c => {
    if (!q) return true;
    return (c.full_name+(c.title||'')+(c.company_name||'')).toLowerCase().includes(q);
  });
  document.getElementById('ctMeta').textContent = `${filtered.length} of ${contacts.length}`;
  _contactRows = filtered; // store for event delegation
  const list = document.getElementById('ctList');
  if (!filtered.length) {
    list.innerHTML = '<div class="empty-list"><div class="empty-big">∅</div><div class="empty-sub">No contacts yet — press Skowyt</div></div>';
    return;
  }
  list.innerHTML = filtered.map((c, i) =>
    `<div class="ct-row" data-ct="${i}">
      <div class="ct-av">${ini(c.full_name)}</div>
      <div class="ct-info">
        <div class="ct-name">${h(c.full_name)}</div>
        <div class="ct-title-sm">${h(c.title||'')} ${c.company_name ? '· '+h(c.company_name) : ''}</div>
      </div>
    </div>`
  ).join('');
}

/* ── COMPANY PANEL ─────────────────────────────────────────────────────── */
function openCompanyPanel(c) {
  if (!c) return;
  selectedCompany = c;
  renderList();
  const [bg,fg] = av(c.name);

  // Case-insensitive contact match
  const cLow = c.name.toLowerCase();
  _panelContacts = contacts.filter(ct =>
    (ct.company_name||'').toLowerCase() === cLow || ct.company_id === c.id
  );

  const contactsHtml = _panelContacts.length
    ? _panelContacts.map((ct, i) =>
        `<div class="dp-ct-row" data-pct="${i}">
          <div class="dp-ct-av">${ini(ct.full_name)}</div>
          <div>
            <div class="dp-ct-name">${h(ct.full_name)}</div>
            <div class="dp-ct-title">${h(ct.title||'')}</div>
          </div>
        </div>`).join('')
    : `<div class="no-contacts">No contacts yet — press Skowyt then try again</div>
       <button class="btn sm" data-action="findcontacts">Find contacts ↗</button>`;

  const angle = {
    client:   `${h(c.name)} is an active client. Focus on retention and upsell — propose adjacent segment categories or new geo coverage.`,
    poc:      `POC in progress with ${h(c.name)}. Push toward renewal — summarize wins so far, address open blockers, propose 90-day extension.`,
    partner:  `Co-sell / GTM angle with ${h(c.name)}. Explore joint activation campaigns, shared segment bundles, or marketplace co-listing.`,
    prospect: `Cold activation — TTD Marketplace hook: "Our segments are pre-integrated on TTD. Your traders can activate tomorrow, zero friction."`,
    nogo:     `⚠ Marked no outreach. Check notes before proceeding. Do not contact without reviewing history.`
  }[c.type] || 'Review notes and define outreach angle.';

  document.getElementById('centerPanel').innerHTML = `
    <div class="detail-panel">
      <div class="dp-head">
        <div class="dp-av" style="background:${bg};border-color:${fg}30;color:${fg}">${ini(c.name)}</div>
        <div class="dp-info">
          <div class="dp-name">${h(c.name)} <span class="tag ${tagCls(c.type)}">${tagLbl(c.type)}</span></div>
          <div class="dp-sub">${h([c.category,c.region].filter(Boolean).join(' · '))||h(c.note)||'—'}</div>
          ${c.icp ? `<div class="dp-stars">${stars(c.icp)} <span style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--t3)">${c.icp}/10</span></div>` : ''}
        </div>
        <button class="dp-close" data-action="close">✕</button>
      </div>
      <div class="dp-grid">
        <div class="dp-field"><div class="dp-label">Category</div><div class="dp-val">${h(c.category)||'—'}</div></div>
        <div class="dp-field"><div class="dp-label">Region</div><div class="dp-val">${h(c.region)||'—'}</div></div>
        <div class="dp-field"><div class="dp-label">Size</div><div class="dp-val">${c.size ? h(c.size)+' emp.' : '—'}</div></div>
        <div class="dp-field"><div class="dp-label">ICP</div><div class="dp-val">${c.icp ? c.icp+'/10' : '—'}</div></div>
        <div class="dp-field"><div class="dp-label">Website</div><div class="dp-val">${c.website ? `<a href="https://${h(c.website)}" target="_blank">${h(c.website)} ↗</a>` : '—'}</div></div>
        <div class="dp-field"><div class="dp-label">LinkedIn</div><div class="dp-val">${c.linkedin_slug ? `<a href="https://linkedin.com/company/${h(c.linkedin_slug)}" target="_blank">Profile ↗</a>` : '—'}</div></div>
      </div>
      ${c.note ? `<div class="dp-note">${h(c.note)}</div>` : ''}
      <div class="ps open">
        <div class="ps-head" data-action="toggle"><span class="ps-title">💡 Outreach angle</span><span class="ps-chevron">▾</span></div>
        <div class="ps-body"><div class="angle-text">${angle}</div></div>
      </div>
      <div class="ps open">
        <div class="ps-head" data-action="toggle"><span class="ps-title">⚡ Actions</span><span class="ps-chevron">▾</span></div>
        <div class="ps-body">
          <div class="actions-grid">
            <button class="btn sm" data-action="claude" data-prompt="Research ${slug(c.name)} — full contact report decision makers outreach angle ICP fit">Full report ↗</button>
            <button class="btn sm" data-action="claude" data-prompt="Find Head of Programmatic or Data Partnerships at ${slug(c.name)} LinkedIn email background">Find DMs ↗</button>
            <button class="btn sm" data-action="claude" data-prompt="Draft personalized outreach email to ${slug(c.name)} value-led and curiosity variants">Draft email ↗</button>
            <button class="btn sm" data-action="claude" data-prompt="Draft LinkedIn connection note InMail for ${slug(c.name)} short personalized">LinkedIn msg ↗</button>
            <button class="btn sm" data-action="claude" data-prompt="Find companies similar to ${slug(c.name)} for onAudience outreach top 10 by ICP fit">Find similar ↗</button>
            <button class="btn sm" data-action="claude" data-prompt="Check Gmail for prior contact with ${slug(c.name)} summarize relationship history">Gmail history ↗</button>
          </div>
        </div>
      </div>
      <div class="ps open">
        <div class="ps-head" data-action="toggle">
          <span class="ps-title">👤 Contacts</span>
          <span class="ps-count">${_panelContacts.length||''}</span>
          <span class="ps-chevron">▾</span>
        </div>
        <div class="ps-body" id="panelContactsList">${contactsHtml}</div>
      </div>
    </div>`;

  // Store current company name on center panel for action lookups
  document.getElementById('centerPanel').dataset.company = c.name;
}

function closePanel() {
  selectedCompany = null;
  renderList();
  document.getElementById('centerPanel').innerHTML = emptyState();
  delete document.getElementById('centerPanel').dataset.company;
}

function toggleSection(head) { head.closest('.ps').classList.toggle('open'); }

/* ── COMPANY LOOKUP MAP (built after skowyt) ───────────────────────────── */
// O(1) lookup by both id and lowercase name — rebuilt every time companies updates
let _coMap = new Map();
function _buildCoMap() {
  _coMap = new Map();
  for (const c of companies) {
    if (c.id)   _coMap.set(c.id, c);
    if (c.name) _coMap.set(c.name.toLowerCase(), c);
  }
}

function _findCompany(name, id) {
  if (id   && _coMap.has(id))                   return _coMap.get(id);
  if (name && _coMap.has(name.toLowerCase()))   return _coMap.get(name.toLowerCase());
  return null;
}

/* ── CONTACT DRAWER ────────────────────────────────────────────────────── */
let _drawerOpen        = false;
let _drawerPrevCompany = null;  // center state before first drawer open — restored on close

function openDrawer(ct) {
  if (!ct) { console.warn('[hub] openDrawer: null contact'); return; }

  // Capture the pre-drawer center state only on the FIRST open (not when switching contacts)
  if (!_drawerOpen) {
    _drawerPrevCompany = selectedCompany;
    _drawerOpen = true;
  }

  // ── Switch center panel to this contact's company
  const linked = _findCompany(ct.company_name, ct.company_id);
  if (linked) {
    // Temporarily show company WITHOUT updating _drawerPrevCompany
    _openCompanyPanelSilent(linked);
  } else if (ct.company_name) {
    _showCompanyStub(ct.company_name);
    _fetchAndShowCompany(ct.company_name, ct.company_id);
  } else {
    document.getElementById('centerPanel').innerHTML = emptyState();
  }

  // ── Populate drawer header
  document.getElementById('drawerAv').textContent    = ini(ct.full_name);
  document.getElementById('drawerName').textContent  = ct.full_name;
  document.getElementById('drawerTitle').textContent = [ct.title, ct.company_name].filter(Boolean).join(' · ');

  // Store contact data on drawer element for action buttons via event delegation
  const d = document.getElementById('drawer');
  d.dataset.ctName  = ct.full_name;
  d.dataset.ctCo    = ct.company_name||'';
  d.dataset.ctEmail = ct.email||'';
  d.dataset.ctLi    = ct.linkedin_url||'';
  d.dataset.ctNotes = ct.notes||'';

  // ── Drawer body
  const emailHtml = ct.email
    ? `<a class="fact-email" href="mailto:${h(ct.email)}">${h(ct.email)}</a>`
    : `<span class="fact-empty">No email on file</span>`;

  const liHtml = ct.linkedin_url
    ? `<a class="btn-li" href="${h(ct.linkedin_url)}" target="_blank">LinkedIn profile ↗</a>`
    : `<span class="fact-empty">No LinkedIn</span>`;

  const notesHtml = ct.notes
    ? `<div class="drawer-notes">${h(ct.notes)}</div>`
    : '';

  const coHint = ct.company_name
    ? `<div class="drawer-context-hint">↙ <span class="hint-co">${h(ct.company_name)}</span> · close to restore previous view</div>`
    : '';

  document.getElementById('drawerBody').innerHTML = `
    ${coHint}
    <div class="fact-block">
      <div class="fact-label">Email</div>
      ${emailHtml}
    </div>
    <div class="fact-block" style="margin-top:10px">
      <div class="fact-label">LinkedIn</div>
      ${liHtml}
    </div>
    ${notesHtml ? `<div class="fact-block" style="margin-top:10px"><div class="fact-label">Notes</div>${notesHtml}</div>` : ''}
    <div class="drawer-actions">
      <button class="btn sm" data-action="drawer-claude" data-dprompt="email">Draft email ↗</button>
      <button class="btn sm" data-action="drawer-claude" data-dprompt="linkedin">LinkedIn msg ↗</button>
      <button class="btn sm" data-action="drawer-claude" data-dprompt="gmail">Gmail history ↗</button>
      <button class="btn sm" data-action="drawer-claude" data-dprompt="research">Research ↗</button>
    </div>
    <button class="btn p full" style="margin-top:6px" data-action="drawer-claude" data-dprompt="fullreport">Full contact report ↗</button>`;

  document.getElementById('drawerOverlay').classList.add('vis');
  d.classList.add('open');
}

// Opens a company panel WITHOUT changing _drawerPrevCompany or selected highlight
function _openCompanyPanelSilent(c) {
  // We call openCompanyPanel normally — it sets selectedCompany = c
  // which is fine: we saved _drawerPrevCompany before first open
  openCompanyPanel(c);
}

function closeDrawer() {
  document.getElementById('drawerOverlay').classList.remove('vis');
  document.getElementById('drawer').classList.remove('open');
  _drawerOpen = false;

  // Restore what was in center panel before the drawer was opened
  if (_drawerPrevCompany) {
    openCompanyPanel(_drawerPrevCompany);
  } else {
    selectedCompany = null;
    document.getElementById('centerPanel').innerHTML = emptyState();
    delete document.getElementById('centerPanel').dataset.company;
    renderList(); // clear selection highlight
  }
  _drawerPrevCompany = null;
}

/* Show stub while company fetch is in progress */
function _showCompanyStub(name) {
  const [bg, fg] = av(name);
  document.getElementById('centerPanel').innerHTML = `
    <div class="detail-panel">
      <div class="dp-head">
        <div class="dp-av" style="background:${bg};border-color:${fg}30;color:${fg}">${ini(name)}</div>
        <div class="dp-info">
          <div class="dp-name">${h(name)}</div>
          <div class="dp-sub">Fetching…</div>
        </div>
      </div>
      <div style="padding:20px 16px;font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--t3)">Loading…</div>
    </div>`;
}

/* Fetch company from Supabase when not in local array */
async function _fetchAndShowCompany(name, id) {
  try {
    const q = id
      ? `id=eq.${encodeURIComponent(id)}`
      : `name=ilike.${encodeURIComponent(name)}`;
    const res = await fetch(
      `${SB_URL}/rest/v1/companies?${q}&select=*&limit=1`,
      { headers: SB_H, signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();
    if (rows?.length) {
      const r = rows[0];
      const co = {
        id: r.id||slug(r.name), name:r.name, note:r.note||'',
        type: r.type||classify(r.note||''),
        icp:r.icp||null, category:r.category||null, region:r.region||null,
        website:r.website||null, size:r.size||null, linkedin_slug:r.linkedin_slug||null,
        fresh: !SEED_NAMES.has(r.name.toLowerCase())
      };
      if (!_coMap.has(co.id)) { companies.push(co); _buildCoMap(); }
      // Only update if drawer is still open (user hasn't closed it)
      if (_drawerOpen) _openCompanyPanelSilent(co);
    } else {
      if (_drawerOpen) _showCompanyNotFound(name);
    }
  } catch(e) {
    console.warn('[hub] _fetchAndShowCompany:', e.message);
    if (_drawerOpen) _showCompanyNotFound(name);
  }
}

function _showCompanyNotFound(name) {
  const [bg, fg] = av(name);
  document.getElementById('centerPanel').innerHTML = `
    <div class="detail-panel">
      <div class="dp-head">
        <div class="dp-av" style="background:${bg};border-color:${fg}30;color:${fg}">${ini(name)}</div>
        <div class="dp-info">
          <div class="dp-name">${h(name)}</div>
          <div class="dp-sub">Not in database</div>
        </div>
      </div>
      <div class="ps open">
        <div class="ps-head" data-action="toggle"><span class="ps-title">⚡ Actions</span><span class="ps-chevron">▾</span></div>
        <div class="ps-body">
          <div class="actions-grid">
            <button class="btn sm" data-action="claude" data-prompt="Research ${h(name)} full contact report decision makers outreach angle ICP fit">Full report ↗</button>
            <button class="btn sm" data-action="claude" data-prompt="Find Head of Programmatic or Data Partnerships at ${h(name)} LinkedIn email background">Find DMs ↗</button>
            <button class="btn sm" data-action="claude" data-prompt="Draft personalized outreach email to ${h(name)} value-led and curiosity variants">Draft email ↗</button>
            <button class="btn sm" data-action="claude" data-prompt="Find companies similar to ${h(name)} for onAudience outreach top 10 by ICP fit">Find similar ↗</button>
          </div>
        </div>
      </div>
    </div>`;
}

/* ── EVENT DELEGATION ──────────────────────────────────────────────────── */
// Single delegated listener for entire document — no inline onclick needed
document.addEventListener('click', e => {
  // Close ctx menu on any click
  document.getElementById('ctxMenu').style.display = 'none';

  const tgt = e.target;

  // ── Company row click (left panel list)
  const coRow = tgt.closest('[data-co]');
  if (coRow && !e.ctrlKey && !e.metaKey) {
    const idx = parseInt(coRow.dataset.co);
    openCompanyPanel(_companyRows[idx]);
    return;
  }

  // ── Contact row click (left panel Contacts tab)
  const ctRow = tgt.closest('[data-ct]');
  if (ctRow) {
    const idx = parseInt(ctRow.dataset.ct);
    openDrawer(_contactRows[idx]);
    return;
  }

  // ── Contact row in company panel
  const pctRow = tgt.closest('[data-pct]');
  if (pctRow) {
    const idx = parseInt(pctRow.dataset.pct);
    openDrawer(_panelContacts[idx]);
    return;
  }

  // ── Actions inside center panel
  const action = tgt.dataset.action || tgt.closest('[data-action]')?.dataset.action;
  const actionEl = tgt.closest('[data-action]');

  if (action === 'close') { closePanel(); return; }
  if (action === 'toggle') { toggleSection(actionEl); return; }
  if (action === 'findcontacts') {
    const name = document.getElementById('centerPanel').dataset.company || '';
    openClaude(`Find Head of Programmatic or Data Partnerships at ${name} — LinkedIn, email, background`);
    return;
  }
  if (action === 'claude') {
    // Reconstruct real prompt from data-prompt (which used slug for safety)
    const name = document.getElementById('centerPanel').dataset.company || '';
    const dp   = actionEl.dataset.prompt;
    // Replace slug placeholder with real name
    openClaude(dp.replace(slug(name), name));
    return;
  }

  // ── Drawer action buttons
  if (action === 'drawer-claude') {
    const dr    = document.getElementById('drawer');
    const name  = dr.dataset.ctName  || '';
    const co    = dr.dataset.ctCo    || '';
    const dp    = actionEl.dataset.dprompt;
    const prompts = {
      email:      `Draft personalized outreach email to ${name} at ${co} for onAudience data partnership`,
      linkedin:   `Draft LinkedIn message to ${name} — short, personalized for onAudience data partnership`,
      gmail:      `Check Gmail for prior contact with ${name} at ${co} — summarize history`,
      research:   `Research ${name} at ${co} — background, LinkedIn, recent activity`,
      fullreport: `Full contact report for ${name} at ${co} — decision maker profile, background, outreach angle`
    };
    openClaude(prompts[dp] || `Research ${name}`);
    return;
  }
});

// Right-click context menu (separate listener)
document.addEventListener('contextmenu', e => {
  const coRow = e.target.closest('[data-co]');
  if (!coRow) return;
  e.preventDefault(); e.stopPropagation();
  const idx  = parseInt(coRow.dataset.co);
  const c    = _companyRows[idx];
  if (!c) return;
  showCtx(e, c);
});

/* ── CONTEXT MENU ──────────────────────────────────────────────────────── */
function showCtx(e, c) {
  const menu = document.getElementById('ctxMenu');
  const actions = [
    { icon:'🔍', text:'Full contact report',  prompt:`Research ${c.name} — full contact report with decision makers, outreach angle, ICP fit` },
    { icon:'👤', text:'Find decision makers', prompt:`Find Head of Programmatic or Data Partnerships at ${c.name} — LinkedIn, email, background` },
    { icon:'✉',  text:'Draft outreach email', prompt:`Draft personalized outreach email to ${c.name} — value-led and curiosity variants` },
    { icon:'💬', text:'LinkedIn message',     prompt:`Draft LinkedIn connection note and InMail for ${c.name} — short, personalized` },
    { icon:'🔗', text:'Find similar',         prompt:`Find companies similar to ${c.name} for onAudience outreach — top 10 by ICP fit` },
    { icon:'📧', text:'Check email history',  prompt:`Check Gmail for prior contact with ${c.name} — summarize relationship history` },
  ];
  if (c.type === 'nogo')     actions.push({ icon:'⚠',  text:'Why no outreach?', prompt:`Explain why ${c.name} is marked no-outreach in onAudience database` });
  if (c.type === 'prospect') actions.push({ icon:'🚀', text:'Prioritize',        prompt:`Build prioritization case for ${c.name} — why onAudience should focus now` });
  if (c.fresh)               actions.push({ icon:'🥩', text:'Why fresh meat?',   prompt:`Explain why ${c.name} was added to the database — what is the opportunity for onAudience?` });

  menu.innerHTML = `<div class="ctx-lbl">${h(c.name)}${c.fresh?' 🥩':''}</div><div class="ctx-sep"></div>`
    + actions.map((a,i) => `<div class="ctx-item" data-ctx="${i}"><span class="ctx-ico">${a.icon}</span>${h(a.text)}</div>`).join('');

  menu._actions = actions; // store for click handler
  menu.style.left    = Math.min(e.clientX, innerWidth-230)  + 'px';
  menu.style.top     = Math.min(e.clientY, innerHeight-320) + 'px';
  menu.style.display = 'block';
}

// Context menu item clicks
document.getElementById('ctxMenu').addEventListener('click', e => {
  const item = e.target.closest('[data-ctx]');
  if (!item) return;
  const menu    = document.getElementById('ctxMenu');
  const actions = menu._actions;
  if (actions) openClaude(actions[parseInt(item.dataset.ctx)].prompt);
  menu.style.display = 'none';
});

/* ── EMPTY STATE ───────────────────────────────────────────────────────── */
function emptyState() {
  return `<div class="qa-grid">
    <div class="qa-card" data-action="modal-research"><div class="qa-icon">🔍</div><div class="qa-title">Company research</div><div class="qa-desc">Full contact report</div></div>
    <div class="qa-card" data-action="qa-prospects"><div class="qa-icon">🎯</div><div class="qa-title">Find prospects</div><div class="qa-desc">New EMEA accounts</div></div>
    <div class="qa-card" data-action="qa-picks"><div class="qa-icon">⭐</div><div class="qa-title">Top picks</div><div class="qa-desc">This week</div></div>
    <div class="qa-card" data-action="modal-similar"><div class="qa-icon">🔗</div><div class="qa-title">Find similar</div><div class="qa-desc">Lookalike discovery</div></div>
    <div class="qa-card" data-action="qa-reengage"><div class="qa-icon">♻️</div><div class="qa-title">Re-engage</div><div class="qa-desc">Dormant accounts</div></div>
    <div class="qa-card" data-action="qa-linkedin"><div class="qa-icon">✉</div><div class="qa-title">LinkedIn template</div><div class="qa-desc">Quick draft</div></div>
  </div>`;
}

// QA card clicks (empty state)
document.addEventListener('click', e => {
  const card = e.target.closest('[data-action]');
  if (!card) return;
  const a = card.dataset.action;
  if (a === 'modal-research') openModal('Research a company','Enter company name:','Research [COMPANY] — full contact report with decision makers, outreach angle, ICP fit');
  if (a === 'qa-prospects')   openClaude('Find new DSP, SSP, and media agency prospects for onAudience in EMEA — strong programmatic data buying signals, ranked by ICP fit');
  if (a === 'qa-picks')       openClaude('Show me the top 5 highest-priority prospects in the onAudience database we should contact this week');
  if (a === 'modal-similar')  openModal('Find similar companies','Enter reference company:','Find companies similar to [COMPANY] for onAudience programmatic data outreach — ranked by ICP fit');
  if (a === 'qa-reengage')    openClaude('Find onAudience contacts that went dark in the last 6 months — suggest re-engagement angles');
  if (a === 'qa-linkedin')    openClaude('Draft a short LinkedIn outreach template for onAudience — data partnerships angle, curiosity-first, under 100 words');
});

/* ── MODAL ─────────────────────────────────────────────────────────────── */
let _modalTpl = '';
function openModal(title, desc, tpl) {
  _modalTpl = tpl;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalDesc').textContent  = desc;
  document.getElementById('modalInput').value       = '';
  document.getElementById('overlay').classList.add('vis');
  setTimeout(() => document.getElementById('modalInput').focus(), 50);
}
function closeModal()  { document.getElementById('overlay').classList.remove('vis'); }
function submitModal() {
  const v = document.getElementById('modalInput').value.trim();
  if (!v) return;
  closeModal();
  openClaude(_modalTpl.replace('[COMPANY]', v));
}

/* ── CLAUDE ────────────────────────────────────────────────────────────── */
function openClaude(prompt) {
  window.open('https://claude.ai/new?q=' + encodeURIComponent(prompt), '_blank');
}
function doResearch() {
  const q = document.getElementById('coSearch').value.trim();
  if (q) openClaude(`Research ${q} — full contact report with decision makers, outreach angle, ICP fit`);
  else   openModal('Research a company','Enter company name:','Research [COMPANY] — full contact report with decision makers, outreach angle, ICP fit');
}

/* ── THEME ─────────────────────────────────────────────────────────────── */
let theme = localStorage.getItem('oaTheme') || 'light';
document.documentElement.setAttribute('data-theme', theme);
function toggleTheme() {
  theme = theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('oaTheme', theme);
  document.getElementById('themeBtn').textContent = theme === 'dark' ? '☀️' : '🌙';
}

/* ── PUBLIC API ────────────────────────────────────────────────────────── */
window.oaDB = {
  async saveCompany(r) {
    const res = await fetch(`${SB_URL}/rest/v1/companies`, { method:'POST', headers:SB_W, body:JSON.stringify(r) });
    if (res.ok) { await skowyt(); showToast(`✓ Saved: ${r.name}`, 'ok'); }
    else          showToast(`✗ Save failed`, 'err');
    return res.ok;
  },
  async saveContact(r) {
    const res = await fetch(`${SB_URL}/rest/v1/contacts`, { method:'POST', headers:SB_W, body:JSON.stringify(r) });
    if (res.ok) { await skowyt(); showToast(`✓ Saved: ${r.full_name}`, 'ok'); }
    else          showToast(`✗ Save failed`, 'err');
    return res.ok;
  },
  reload: skowyt
};

/* ── KEYBOARD ──────────────────────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  closeModal();
  closeDrawer();
  document.getElementById('ctxMenu').style.display = 'none';
  if (selectedCompany) closePanel();
});

/* ── INIT ──────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Theme
  document.getElementById('themeBtn').textContent = theme === 'dark' ? '☀️' : '🌙';
  // Modal enter key
  document.getElementById('modalInput').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitModal(); }
  });
  // Modal overlay click outside
  document.getElementById('overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('overlay')) closeModal();
  });
  // Empty state on center panel
  document.getElementById('centerPanel').innerHTML = emptyState();
  // Load seed + pull live
  loadSeed();
  skowyt();
});
