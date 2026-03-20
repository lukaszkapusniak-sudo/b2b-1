/* ── onAudience Sales Intelligence Hub · hub.js ── */

// ── SUPABASE ──────────────────────────────────────────────────────────────────
const SB_URL = 'https://nyzkkqqjnkctcmxoirdj.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55emtrcXFqbmtjdGNteG9pcmRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzMxMzYsImV4cCI6MjA4OTQ0OTEzNn0.jhAq_C68klOp4iTyj9HmsyyvoxsOI6ACld7t_87TAk0';
const SB_H = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` };
const SB_W = { ...SB_H, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' };

// ── SEED ──────────────────────────────────────────────────────────────────────
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

// ── STATE ─────────────────────────────────────────────────────────────────────
// var (not let) so companies/contacts are window properties — needed by inline onclick handlers
var companies = [], contacts = [];
let activeFilter = 'all', activeTab = 'companies';
let selectedCompany = null, dataSource = 'seed';
window._cts = []; // contact lookup by index — avoids JSON-in-onclick encoding bugs

// ── HELPERS ───────────────────────────────────────────────────────────────────
function classify(n) {
  const s = (n||'').toLowerCase();
  if (s.includes('no outreach')||s.includes('no fit')||s.includes('no business')||
      s.includes('internal')||s.includes('closed')||s.includes('unwanted')) return 'nogo';
  if (s==='poc'||s.includes('poc client')||s.includes('active deal')) return 'poc';
  if (s==='client'||s.includes('client')) return 'client';
  if (s==='partner'||s.includes('partner')) return 'partner';
  if (s==='prospect'||s.includes('prospect')||s.includes('to check')||s.includes('to continue')) return 'prospect';
  return 'prospect';
}
function tagCls(s){return{client:'tc',partner:'tp',prospect:'tpr',nogo:'tn',poc:'tpo'}[s]||'tpr'}
function tagLbl(s){return{client:'Client',partner:'Partner',prospect:'Prospect',nogo:'No outreach',poc:'POC'}[s]||s}

function av(n) {
  const p=[['#9FE1CB30','#0F6E56'],['#B5D4F430','#1A4F8A'],['#FAC77530','#7A4200'],
           ['#C0DD9730','#3B6D11'],['#F4C0D130','#993556']];
  let h=0; for(let c of n) h=(h*31+c.charCodeAt(0))&0xffff;
  return p[h%p.length];
}
function ini(n){return n.replace(/[^A-Za-z ]/g,'').split(' ').filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase()||'?'}
function stars(n){const s=Math.round((n||0)/2);return'★'.repeat(Math.min(s,5))+'☆'.repeat(Math.max(0,5-s))}
function esc(s){return(s||'').replace(/'/g,"\\'")}
function slug(n){return n.toLowerCase().replace(/[^a-z0-9]/g,'-')}

// ── SEED LOAD ─────────────────────────────────────────────────────────────────
function loadSeed() {
  companies = SEED.map(([name, note]) => ({
    id: slug(name), name, note: note||'', type: classify(note),
    icp: null, category: null, region: null, website: null, size: null, linkedin_slug: null
  }));
  dataSource = 'seed';
  setStatus('', `○ Seed · ${companies.length}`);
  updateStats(); renderList();
}

// ── SKOWYT ────────────────────────────────────────────────────────────────────
async function skowyt() {
  const btn = document.getElementById('skowytBtn');
  const ic = document.getElementById('skowytIc');
  const lbl = document.getElementById('skowytLbl');

  btn.classList.add('loading');
  ic.textContent = '↻'; lbl.textContent = 'Pulling…';
  setStatus('loading', '● Pulling…');

  try {
    const [coRes, ctRes] = await Promise.all([
      fetch(`${SB_URL}/rest/v1/companies?select=*&order=name.asc`, { headers: SB_H, signal: AbortSignal.timeout(8000) }),
      fetch(`${SB_URL}/rest/v1/contacts?select=*&order=full_name.asc`, { headers: SB_H, signal: AbortSignal.timeout(8000) })
    ]);
    if (!coRes.ok) throw new Error(`companies HTTP ${coRes.status}`);
    const dbCos = await coRes.json();
    contacts = ctRes.ok ? await ctRes.json() : [];

    if (!dbCos?.length) throw new Error('Empty companies');

    const sbMap = new Map(dbCos.map(r => [r.name.toLowerCase(), r]));
    const seedNames = new Set(SEED.map(([n])=>n.toLowerCase()));
    const merged = dbCos.map(r => ({
      id: r.id||slug(r.name), name: r.name, note: r.note||'',
      type: r.type||classify(r.note||''),
      icp: r.icp||null, category: r.category||null, region: r.region||null,
      website: r.website||null, size: r.size||null, linkedin_slug: r.linkedin_slug||null,
      fresh: !seedNames.has(r.name.toLowerCase()) // 🥩 not in hardcoded seed
    }));
    for (const [sName, sNote] of SEED) {
      if (!sbMap.has(sName.toLowerCase()))
        merged.push({id:slug(sName),name:sName,note:sNote||'',type:classify(sNote),icp:null,category:null,region:null,website:null,size:null,linkedin_slug:null,fresh:false});
    }
    merged.sort((a,b)=>a.name.localeCompare(b.name));
    companies = merged;
    dataSource = 'live';

    setStatus('live', `● Live · ${dbCos.length} co / ${contacts.length} ct`);
    showToast(`✓ Skowyt — ${dbCos.length} companies, ${contacts.length} contacts`, 'ok');
    updateStats(); renderList();
    if (selectedCompany) {
      const updated = companies.find(c=>c.name===selectedCompany.name);
      if (updated) openCompanyPanel(updated);
    }
  } catch(e) {
    setStatus('error', `○ Error: ${e.message}`);
    showToast(`✗ Skowyt failed: ${e.message}`, 'err');
    if (!companies.length) loadSeed();
  } finally {
    btn.classList.remove('loading');
    ic.textContent = '↓'; lbl.textContent = 'Skowyt';
  }
}

// ── STATUS ────────────────────────────────────────────────────────────────────
function setStatus(state, text) {
  const dot = document.getElementById('statusDot');
  dot.className = 'status-dot ' + (state||'');
  document.getElementById('statusText').textContent = text;
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
let _tt;
function showToast(msg, type='ok') {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = `toast ${type} show`;
  clearTimeout(_tt); _tt = setTimeout(()=>t.classList.remove('show'), 3500);
}

// ── STATS ─────────────────────────────────────────────────────────────────────
function updateStats() {
  document.getElementById('stAll').textContent = companies.length;
  document.getElementById('stClient').textContent = companies.filter(c=>c.type==='client'||c.type==='poc').length;
  document.getElementById('stPartner').textContent = companies.filter(c=>c.type==='partner').length;
  document.getElementById('stProspect').textContent = companies.filter(c=>c.type==='prospect').length;
  document.getElementById('stNogo').textContent = companies.filter(c=>c.type==='nogo').length;
  document.getElementById('stPoc').textContent = companies.filter(c=>c.type==='poc').length;
  document.getElementById('stFresh').textContent = companies.filter(c=>c.fresh).length;
}

// ── TABS ──────────────────────────────────────────────────────────────────────
function switchTab(tab) {
  activeTab = tab;
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active', t.dataset.tab===tab));
  document.getElementById('coPanel').style.display = tab==='companies'?'flex':'none';
  document.getElementById('ctPanel').style.display = tab==='contacts'?'flex':'none';
  if (tab==='contacts') renderContacts();
}

// ── FILTER ────────────────────────────────────────────────────────────────────
function setFilter(f, el) {
  activeFilter = f;
  document.querySelectorAll('.sc,.fp').forEach(b=>b.classList.remove('active'));
  if (el) el.classList.add('active');
  document.querySelectorAll(`[data-f="${f}"]`).forEach(b=>b.classList.add('active'));
  renderList();
}

// ── RENDER COMPANIES ──────────────────────────────────────────────────────────
function renderList() {
  const q = (document.getElementById('coSearch').value||'').toLowerCase();
  const filtered = companies.filter(c => {
    if (activeFilter==='fresh' && !c.fresh) return false;
    if (activeFilter!=='all' && activeFilter!=='fresh' && c.type!==activeFilter) return false;
    if (q) {
      const hay = (c.name+(c.note||'')+(c.category||'')+(c.region||'')).toLowerCase();
      return hay.includes(q);
    }
    return true;
  });
  document.getElementById('coMeta').textContent = `${filtered.length} of ${companies.length}`;
  const list = document.getElementById('coList');
  if (!filtered.length) {
    list.innerHTML='<div class="empty-list"><div class="empty-big">∅</div><div class="empty-sub">No matches</div></div>';
    return;
  }
  list.innerHTML = filtered.map(c=>{
    const [bg,fg]=av(c.name), enc=encodeURIComponent(c.name);
    const note = (c.category&&c.region) ? `${c.category} · ${c.region}` : (c.note||'').slice(0,55)||'—';
    const icp = c.icp ? `<span class="icp-num">${c.icp}</span>` : '';
    const freshTag = c.fresh ? `<span class="tag tf" title="New — from DB, not in seed">🥩</span>` : '';
    const sel = selectedCompany?.name===c.name;
    return `<div class="co-row${sel?' selected':''}" onclick="openCompanyPanel(companies.find(x=>x.name===decodeURIComponent('${enc}')))" oncontextmenu="showCtx(event,'${enc}','${c.type}',${c.fresh});return false">
      <div class="co-av" style="background:${bg};border-color:${fg}30;color:${fg}">${ini(c.name)}</div>
      <div class="co-info"><div class="co-name">${c.name}${c.fresh?' <span style="font-size:9px">🥩</span>':''}</div><div class="co-note-sm">${note}</div></div>
      <div class="co-right">${icp}<span class="tag ${tagCls(c.type)}">${tagLbl(c.type)}</span></div>
    </div>`;
  }).join('');
}

// ── RENDER CONTACTS ───────────────────────────────────────────────────────────
function renderContacts() {
  const q = (document.getElementById('ctSearch').value||'').toLowerCase();
  const filtered = contacts.filter(c=>{
    if (!q) return true;
    return (c.full_name+(c.title||'')+(c.company_name||'')).toLowerCase().includes(q);
  });
  document.getElementById('ctMeta').textContent = `${filtered.length} of ${contacts.length}`;
  const list = document.getElementById('ctList');
  if (!filtered.length) {
    list.innerHTML='<div class="empty-list"><div class="empty-big">∅</div><div class="empty-sub">No contacts</div></div>';
    return;
  }
  // Store filtered contacts in global lookup — safe index-based onclick
  window._cts = filtered;
  list.innerHTML = filtered.map((c,i)=>
    `<div class="ct-row" onclick="openDrawerByIdx(${i})">
      <div class="ct-av">${ini(c.full_name)}</div>
      <div class="ct-info"><div class="ct-name">${c.full_name}</div><div class="ct-title-sm">${c.title||''} ${c.company_name?'· '+c.company_name:''}</div></div>
    </div>`
  ).join('');
}

// ── COMPANY PANEL ─────────────────────────────────────────────────────────────
function openCompanyPanel(c) {
  if (!c) return;
  selectedCompany = c;
  renderList();
  const [bg,fg]=av(c.name);
  // Case-insensitive match on both company_name and company_id
  const cNameLow = c.name.toLowerCase();
  const cos = contacts.filter(ct=>
    (ct.company_name||'').toLowerCase()===cNameLow ||
    ct.company_id===c.id
  );
  // Store cos in global for index-based onclick
  window._cosCts = cos;
  const coHtml = cos.length
    ? cos.map((ct,i)=>`<div class="dp-ct-row" onclick="openDrawerFromPanel(${i})">
        <div class="dp-ct-av">${ini(ct.full_name)}</div>
        <div><div class="dp-ct-name">${ct.full_name}</div><div class="dp-ct-title">${ct.title||''}</div></div>
      </div>`).join('')
    : `<div class="no-contacts">No contacts yet</div><button class="btn sm" onclick="openClaude('Find Head of Programmatic or Data Partnerships at ${esc(c.name)} — LinkedIn, email, background')">Find contacts ↗</button>`;

  const angle = {
    client: `${c.name} is an active client. Focus on retention and upsell — propose adjacent segment categories or new geo coverage.`,
    poc: `POC in progress. Push toward renewal — summarize wins so far, address open blockers, propose 90-day extension.`,
    partner: `Co-sell / GTM angle. Explore joint activation campaigns, shared segment bundles, or marketplace co-listing.`,
    prospect: `Cold activation — TTD Marketplace hook: "Our segments are pre-integrated on TTD. Your traders can activate tomorrow, zero friction."`,
    nogo: `⚠️ Marked no outreach. Check notes for reason before proceeding. Do not contact without reviewing history.`
  }[c.type] || 'Review notes and define outreach angle.';

  document.getElementById('centerPanel').innerHTML = `
    <div class="detail-panel">
      <div class="dp-head">
        <div class="dp-av" style="background:${bg};border-color:${fg}30;color:${fg}">${ini(c.name)}</div>
        <div class="dp-info">
          <div class="dp-name">${c.name} <span class="tag ${tagCls(c.type)}">${tagLbl(c.type)}</span></div>
          <div class="dp-sub">${[c.category,c.region].filter(Boolean).join(' · ')||c.note||'—'}</div>
          ${c.icp?`<div class="dp-stars">${stars(c.icp)} <span style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--t3)">${c.icp}/10 ICP</span></div>`:''}
        </div>
        <button class="dp-close" onclick="closePanel()">✕</button>
      </div>
      <div class="dp-grid">
        <div class="dp-field"><div class="dp-label">Category</div><div class="dp-val">${c.category||'—'}</div></div>
        <div class="dp-field"><div class="dp-label">Region</div><div class="dp-val">${c.region||'—'}</div></div>
        <div class="dp-field"><div class="dp-label">Size</div><div class="dp-val">${c.size?c.size+' employees':'—'}</div></div>
        <div class="dp-field"><div class="dp-label">ICP score</div><div class="dp-val">${c.icp?c.icp+'/10':'—'}</div></div>
        <div class="dp-field"><div class="dp-label">Website</div><div class="dp-val">${c.website?`<a href="https://${c.website}" target="_blank">${c.website} ↗</a>`:'—'}</div></div>
        <div class="dp-field"><div class="dp-label">LinkedIn</div><div class="dp-val">${c.linkedin_slug?`<a href="https://linkedin.com/company/${c.linkedin_slug}" target="_blank">Profile ↗</a>`:'—'}</div></div>
      </div>
      ${c.note?`<div class="dp-note">${c.note}</div>`:''}
      <div class="ps open">
        <div class="ps-head" onclick="toggleSection(this)">
          <span class="ps-title">💡 Outreach angle</span>
          <span class="ps-chevron">▾</span>
        </div>
        <div class="ps-body"><div class="angle-text">${angle}</div></div>
      </div>
      <div class="ps open">
        <div class="ps-head" onclick="toggleSection(this)">
          <span class="ps-title">⚡ Actions</span>
          <span class="ps-chevron">▾</span>
        </div>
        <div class="ps-body">
          <div class="actions-grid">
            <button class="btn sm" onclick="openClaude('Research ${esc(c.name)} — full contact report with decision makers, outreach angle, and ICP fit score')">Full report ↗</button>
            <button class="btn sm" onclick="openClaude('Find Head of Programmatic or Data Partnerships at ${esc(c.name)} — LinkedIn, email, background')">Find DMs ↗</button>
            <button class="btn sm" onclick="openClaude('Draft personalized outreach email to ${esc(c.name)} — value-led and curiosity variants')">Draft email ↗</button>
            <button class="btn sm" onclick="openClaude('Draft LinkedIn connection note and InMail for ${esc(c.name)} — short, personalized')">LinkedIn msg ↗</button>
            <button class="btn sm" onclick="openClaude('Find companies similar to ${esc(c.name)} for onAudience outreach — top 10 by ICP fit')">Find similar ↗</button>
            <button class="btn sm" onclick="openClaude('Check Gmail for prior contact with ${esc(c.name)} — summarize relationship history')">Gmail history ↗</button>
          </div>
        </div>
      </div>
      <div class="ps open">
        <div class="ps-head" onclick="toggleSection(this)">
          <span class="ps-title">👤 Contacts</span>
          <span class="ps-count">${cos.length||''}</span>
          <span class="ps-chevron">▾</span>
        </div>
        <div class="ps-body">${coHtml}</div>
      </div>
    </div>`;
}

function closePanel() {
  selectedCompany = null;
  renderList();
  document.getElementById('centerPanel').innerHTML = emptyState();
}

function toggleSection(head) {
  head.closest('.ps').classList.toggle('open');
}

function emptyState() {
  return `<div class="qa-grid">
    <div class="qa-card" onclick="openModal('Research a company','Enter company name:','Research [COMPANY] — full contact report with decision makers, outreach angle, and ICP fit score')"><div class="qa-icon">🔍</div><div class="qa-title">Company research</div><div class="qa-desc">Full contact report</div></div>
    <div class="qa-card" onclick="openClaude('Find new DSP, SSP, and media agency prospects for onAudience in EMEA — not in our database, strong programmatic data buying signals, ranked by ICP fit')"><div class="qa-icon">🎯</div><div class="qa-title">Find prospects</div><div class="qa-desc">New accounts</div></div>
    <div class="qa-card" onclick="openClaude('Show me the top 5 highest-priority prospects in the onAudience database that we should contact this week')"><div class="qa-icon">⭐</div><div class="qa-title">Top picks</div><div class="qa-desc">This week\'s focus</div></div>
    <div class="qa-card" onclick="openModal('Find similar companies','Enter a reference company:','Find companies similar to [COMPANY] for onAudience programmatic data outreach — ranked by ICP fit')"><div class="qa-icon">🔗</div><div class="qa-title">Find similar</div><div class="qa-desc">Lookalike discovery</div></div>
    <div class="qa-card" onclick="openClaude('Find onAudience contacts that went dark in the last 6 months — suggest re-engagement angles')"><div class="qa-icon">♻️</div><div class="qa-title">Re-engage</div><div class="qa-desc">Dormant accounts</div></div>
    <div class="qa-card" onclick="openClaude('Draft a short LinkedIn outreach template for onAudience — data partnerships angle, curiosity-first, under 100 words')"><div class="qa-icon">✉</div><div class="qa-title">LinkedIn template</div><div class="qa-desc">Quick draft</div></div>
  </div>`;
}

// ── CONTACT DRAWER ────────────────────────────────────────────────────────────
// Index-based helpers (avoid JSON-in-onclick encoding bugs)
function openDrawerByIdx(i) { openDrawer(window._cts[i]); }
function openDrawerFromPanel(i) { openDrawer(window._cosCts[i]); }

function openDrawer(ct) {
  if (!ct) return;
  document.getElementById('drawerAv').textContent = ini(ct.full_name);
  document.getElementById('drawerName').textContent = ct.full_name;
  document.getElementById('drawerTitle').textContent = [ct.title, ct.company_name].filter(Boolean).join(' · ');
  document.getElementById('drawerBody').innerHTML = `
    <table class="info-table">
      <tr><td>Email</td><td>${ct.email?`<a href="mailto:${ct.email}" style="color:var(--g)">${ct.email}</a>`:'—'}</td></tr>
      <tr><td>LinkedIn</td><td>${ct.linkedin_url?`<a href="${ct.linkedin_url}" target="_blank" style="color:var(--g)">Profile ↗</a>`:'—'}</td></tr>
      <tr><td>Company</td><td>${ct.company_name||'—'}</td></tr>
      <tr><td>Notes</td><td style="font-size:10px;color:var(--t2);line-height:1.6">${ct.notes||'—'}</td></tr>
    </table>
    <div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:5px">
      <button class="btn sm" onclick="openClaude('Draft personalized outreach email to ${esc(ct.full_name)} at ${esc(ct.company_name||'')} for onAudience data partnership')">Draft email ↗</button>
      <button class="btn sm" onclick="openClaude('Draft LinkedIn message to ${esc(ct.full_name)} — short, personalized for onAudience data partnership')">LinkedIn ↗</button>
      <button class="btn sm" onclick="openClaude('Check Gmail for prior contact with ${esc(ct.full_name)} — summarize history')">Gmail ↗</button>
      <button class="btn sm" onclick="openClaude('Research ${esc(ct.full_name)} at ${esc(ct.company_name||'')} — background, LinkedIn, recent activity')">Research ↗</button>
    </div>
    <div style="margin-top:10px">
      <button class="btn p full" onclick="openClaude('Full contact report for ${esc(ct.full_name)} at ${esc(ct.company_name||'')} — decision maker profile, background, outreach angle')">Full contact report ↗</button>
    </div>`;
  document.getElementById('drawerOverlay').classList.add('vis');
  document.getElementById('drawer').classList.add('open');
}
function closeDrawer() {
  document.getElementById('drawerOverlay').classList.remove('vis');
  document.getElementById('drawer').classList.remove('open');
}

// ── CONTEXT MENU ──────────────────────────────────────────────────────────────
function showCtx(e, enc, type, isFresh) {
  e.preventDefault(); e.stopPropagation();
  const name = decodeURIComponent(enc);
  const menu = document.getElementById('ctxMenu');
  const actions = [
    { icon:'🔍', text:'Full contact report', prompt:`Research ${name} — full contact report with decision makers, outreach angle, and ICP fit score` },
    { icon:'👤', text:'Find decision makers', prompt:`Find Head of Programmatic or Data Partnerships at ${name} — LinkedIn, email, background` },
    { icon:'✉',  text:'Draft outreach email', prompt:`Draft personalized outreach email to ${name} — value-led and curiosity variants` },
    { icon:'💬', text:'LinkedIn message', prompt:`Draft LinkedIn connection note and InMail for ${name} — short, personalized` },
    { icon:'🔗', text:'Find similar', prompt:`Find companies similar to ${name} for onAudience outreach — top 10 by ICP fit` },
    { icon:'📧', text:'Check email history', prompt:`Check Gmail for prior contact with ${name} — summarize relationship history` },
  ];
  if (type==='nogo') actions.push({icon:'⚠',text:'Why no outreach?',prompt:`Explain why ${name} is marked no-outreach in onAudience database`});
  if (type==='prospect') actions.push({icon:'🚀',text:'Prioritize',prompt:`Build prioritization case for ${name} — why onAudience should focus on this account now`});
  if (isFresh) actions.push({icon:'🥩',text:'Why fresh meat?',prompt:`Explain why ${name} was added to onAudience database as a new prospect — what is the opportunity?`});

  menu.innerHTML = `<div class="ctx-lbl">${name}${isFresh?' 🥩':''}</div><div class="ctx-sep"></div>`
    + actions.map((a,i)=>`<div class="ctx-item" data-i="${i}"><span class="ctx-ico">${a.icon}</span>${a.text}</div>`).join('');
  // Use replaceWith to avoid duplicate listeners
  menu.querySelectorAll('.ctx-item').forEach((el,i)=>{
    const fresh = el.cloneNode(true);
    el.parentNode.replaceChild(fresh,el);
    fresh.addEventListener('click',()=>{menu.style.display='none';openClaude(actions[i].prompt);});
  });
  menu.style.left = Math.min(e.clientX, window.innerWidth-230)+'px';
  menu.style.top  = Math.min(e.clientY, window.innerHeight-300)+'px';
  menu.style.display = 'block';
}
document.addEventListener('click', ()=>document.getElementById('ctxMenu').style.display='none');

// ── MODAL ─────────────────────────────────────────────────────────────────────
let _mt='';
function openModal(title, desc, template) {
  _mt = template;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalDesc').textContent = desc;
  document.getElementById('modalInput').value = '';
  document.getElementById('overlay').classList.add('vis');
  setTimeout(()=>document.getElementById('modalInput').focus(),50);
}
function closeModal(){document.getElementById('overlay').classList.remove('vis');}
function submitModal(){
  const v = document.getElementById('modalInput').value.trim();
  if (!v) return; closeModal();
  openClaude(_mt.replace('[COMPANY]', v));
}

// ── CLAUDE ────────────────────────────────────────────────────────────────────
function openClaude(prompt) {
  window.open('https://claude.ai/new?q='+encodeURIComponent(prompt),'_blank');
}
function doResearch() {
  const q = document.getElementById('coSearch').value.trim();
  if (q) openClaude(`Research ${q} — full contact report with decision makers, outreach angle, and ICP fit score`);
  else openModal('Research a company','Enter company name:','Research [COMPANY] — full contact report with decision makers, outreach angle, and ICP fit score');
}

// ── THEME ─────────────────────────────────────────────────────────────────────
let theme = localStorage.getItem('oaTheme')||'light';
document.documentElement.setAttribute('data-theme', theme);
function toggleTheme(){
  theme = theme==='light'?'dark':'light';
  document.documentElement.setAttribute('data-theme',theme);
  localStorage.setItem('oaTheme',theme);
  document.getElementById('themeBtn').textContent = theme==='dark'?'☀️':'🌙';
}

// ── PUBLIC API ────────────────────────────────────────────────────────────────
window.oaDB = {
  async saveCompany(r){
    const res = await fetch(`${SB_URL}/rest/v1/companies`,{method:'POST',headers:SB_W,body:JSON.stringify(r)});
    if(res.ok){await skowyt();showToast(`✓ Saved: ${r.name}`,'ok');}
    else showToast(`✗ Save failed: ${await res.text()}`,'err');
    return res.ok;
  },
  async saveContact(r){
    const res = await fetch(`${SB_URL}/rest/v1/contacts`,{method:'POST',headers:SB_W,body:JSON.stringify(r)});
    if(res.ok){await skowyt();showToast(`✓ Saved: ${r.full_name}`,'ok');}
    else showToast(`✗ Save failed: ${await res.text()}`,'err');
    return res.ok;
  },
  reload: skowyt
};

// ── KEYBOARD ──────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e=>{
  if(e.key==='Escape'){
    closeModal();
    closeDrawer();
    document.getElementById('ctxMenu').style.display='none';
    if(selectedCompany) closePanel();
  }
});

// ── DOMContentLoaded ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', ()=>{
  // theme button
  document.getElementById('themeBtn').textContent = theme==='dark'?'☀️':'🌙';
  // modal enter key
  document.getElementById('modalInput').addEventListener('keydown', e=>{
    if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submitModal();}
  });
  // center empty state
  document.getElementById('centerPanel').innerHTML = emptyState();
  // boot
  loadSeed();
  skowyt();
});
