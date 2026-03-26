// prospect.js — Prospect Finder feature for onAudience Hub v2
import { anthropicFetch } from './api.js';
import { esc, _slug, tClass, tLabel, stars } from './utils.js';

/* ─── Entry point ─────────────────────────────────────────── */
export async function openProspectFinder(prefillQuery = '') {
  _renderPanel(prefillQuery);
}

/* ─── Render panel into centerScroll ─────────────────────── */
function _renderPanel(prefillQuery = '') {
  const cs = document.getElementById('centerScroll');
  if (!cs) return;

  // Hide other center content
  ['emptyState','coPanel','tcf-center'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  document.getElementById('prospectPanel')?.remove();

  const div = document.createElement('div');
  div.id = 'prospectPanel';
  div.className = 'prospect-panel';
  cs.appendChild(div);

  div.innerHTML =
    '<div class="prospect-header">' +
      '<div class="prospect-title"><span style="color:var(--g)">&#8853;</span><span>Prospect Finder</span></div>' +
      '<button class="btn" onclick="closeProspectFinder()" style="margin-left:auto">&#10005; Close</button>' +
    '</div>' +
    '<div class="prospect-search-area">' +
      '<textarea id="prospectQuery" class="prospect-textarea" rows="3"' +
        ' placeholder="Describe the companies you\'re looking for&#8230;  e.g. mid-size DSPs in Europe using cookieless, or agencies with programmatic trading desks in CEE">' +
        esc(prefillQuery) +
      '</textarea>' +
      '<div class="prospect-search-row">' +
        '<div class="prospect-chips">' +
          '<button class="btn sm" onclick="prospectChip(\'EU DSPs with cookieless signals\')">EU DSPs cookieless</button>' +
          '<button class="btn sm" onclick="prospectChip(\'CTV / Connected TV platforms\')">CTV platforms</button>' +
          '<button class="btn sm" onclick="prospectChip(\'agencies with programmatic trading desks\')">Programmatic agencies</button>' +
          '<button class="btn sm" onclick="prospectChip(\'data providers or DMPs in Europe\')">Data providers EU</button>' +
          '<button class="btn sm" onclick="prospectChip(\'mid-market AdTech companies in CEE\')">CEE AdTech</button>' +
        '</div>' +
        '<div style="display:flex;gap:8px;align-items:center;flex-shrink:0">' +
          '<label class="prospect-toggle-label">' +
            '<input type="checkbox" id="prospectWebLookup" checked>' +
            '<span>Web lookup</span>' +
          '</label>' +
          '<button class="btn p" id="prospectRunBtn" onclick="runProspectFinder()">&#128269; Find Companies</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div id="prospectResults" class="prospect-results">' +
      '<div class="prospect-empty">' +
        '<div class="prospect-empty-icon">&#9678;</div>' +
        '<div class="prospect-empty-text">Describe what you\'re looking for above</div>' +
        '<div class="prospect-empty-sub">AI will match companies from your database and discover new ones from the web</div>' +
      '</div>' +
    '</div>';

  if (prefillQuery.trim()) setTimeout(() => runProspectFinder(), 100);
}

/* ─── Chip shortcut ──────────────────────────────────────── */
export function prospectChip(text) {
  const ta = document.getElementById('prospectQuery');
  if (ta) ta.value = text;
}

/* ─── Main finder ────────────────────────────────────────── */
export async function runProspectFinder() {
  const query = (document.getElementById('prospectQuery')?.value || '').trim();
  if (!query) return;

  const webLookup = document.getElementById('prospectWebLookup')?.checked ?? true;
  const btn = document.getElementById('prospectRunBtn');
  const resultsEl = document.getElementById('prospectResults');
  if (!resultsEl) return;

  if (btn) { btn.disabled = true; btn.textContent = '…'; }

  resultsEl.innerHTML =
    '<div class="prospect-loading">' +
      '<div class="prospect-spinner"></div>' +
      '<div class="prospect-loading-text" id="prospectLoadingText">Analysing your criteria&#8230;</div>' +
    '</div>';

  window.clog('ai', 'Prospect Finder: "' + query + '"');

  try {
    _setLoadingText('Loading database\u2026');
    const dbCompanies = await _loadAllCompanies();
    window.clog('db', 'Loaded ' + dbCompanies.length + ' companies from DB');

    _setLoadingText('AI matching companies in database\u2026');
    const { criteria, dbMatches, suggestedNames } = await _aiMatch(query, dbCompanies);

    window.clog('ai', 'DB matches: ' + dbMatches.length + ', suggested new: ' + suggestedNames.length);

    _renderResults(resultsEl, criteria, dbMatches, [], true);

    if (webLookup && suggestedNames.length > 0) {
      const webResults = await _webLookupAll(suggestedNames, criteria, resultsEl, dbMatches);
      _renderResults(resultsEl, criteria, dbMatches, webResults, false);
    }

    window.clog('ai', 'Prospect Finder complete');
  } catch (err) {
    console.error('Prospect Finder error:', err);
    resultsEl.innerHTML = '<div class="prospect-error">Error: ' + esc(String(err)) + '</div>';
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '\uD83D\uDD0D Find Companies'; }
  }
}

function _setLoadingText(txt) {
  const el = document.getElementById('prospectLoadingText');
  if (el) el.textContent = txt;
}

/* ─── DB load ────────────────────────────────────────────── */
async function _loadAllCompanies() {
  const { SB_URL, SB_KEY } = await import('./config.js');
  const res = await fetch(
    SB_URL + '/rest/v1/companies?select=id,name,type,note,category,region,icp,size,hq_city,tech_stack,outreach_angle,description,website&order=name.asc',
    { headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY } }
  );
  if (!res.ok) throw new Error('DB load failed');
  return res.json();
}

/* ─── AI match ───────────────────────────────────────────── */
async function _aiMatch(query, companies) {
  const compactList = companies
    .filter(c => c.name && c.type !== 'nogo')
    .map(c => ({
      id: c.id,
      name: c.name,
      type: c.type,
      cat: c.category || '',
      region: c.region || '',
      note: (c.note || '').slice(0, 100),
      size: c.size || '',
      icp: c.icp || '',
      desc: (c.description || '').slice(0, 80)
    }));

  const prompt =
    'You are a B2B sales intelligence assistant for onAudience, a European audience data company.\n\n' +
    'USER QUERY: "' + query + '"\n\n' +
    'DATABASE (' + compactList.length + ' companies):\n' +
    JSON.stringify(compactList) + '\n\n' +
    'Tasks:\n' +
    '1. Extract structured ICP criteria from the query\n' +
    '2. Score each DB company 0-100 for fit — only include score >= 40\n' +
    '3. Suggest 6-8 REAL company names NOT in this DB that match the criteria (real ad-tech companies only)\n\n' +
    'Respond ONLY with valid JSON, no markdown:\n' +
    '{"criteria":{"verticals":[],"regions":[],"signals":[],"size":"","summary":""},' +
    '"dbMatches":[{"id":"","score":0,"reason":""}],' +
    '"suggestedNames":[]}';

  const data = await anthropicFetch({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }]
  });

  const raw = (data.content[0]?.text || '{}').replace(/```json|```/g, '').trim();
  let parsed;
  try { parsed = JSON.parse(raw); } catch { parsed = { criteria: {}, dbMatches: [], suggestedNames: [] }; }

  const coMap = Object.fromEntries(companies.map(c => [c.id, c]));
  const enrichedMatches = (parsed.dbMatches || [])
    .filter(m => coMap[m.id])
    .map(m => ({ ...coMap[m.id], _score: m.score, _reason: m.reason }))
    .sort((a, b) => b._score - a._score);

  return {
    criteria: parsed.criteria || {},
    dbMatches: enrichedMatches,
    suggestedNames: (parsed.suggestedNames || []).slice(0, 8)
  };
}

/* ─── Web lookup ─────────────────────────────────────────── */
async function _webLookupAll(names, criteria, resultsEl, dbMatches) {
  const results = [];
  for (let i = 0; i < names.length; i++) {
    _setLoadingText('Researching ' + (i + 1) + '/' + names.length + ': ' + names[i] + '\u2026');
    try {
      const info = await _webResearch(names[i], criteria);
      if (info) {
        results.push(info);
        _renderResults(resultsEl, criteria, dbMatches, results, true);
      }
    } catch (e) { console.warn('Lookup failed for ' + names[i], e); }
  }
  return results;
}

async function _webResearch(name, criteria) {
  const data = await anthropicFetch({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages: [{
      role: 'user',
      content: 'Research "' + name + '" — an ad-tech company. Find: website, HQ city, size (employees), category (DSP/SSP/DMP/Agency/Data Provider/etc), programmatic/audience data signals relevant to: ' + (criteria.signals || []).join(', ') + '.\n\nRespond ONLY with JSON:\n{"name":"' + name + '","website":"","hq":"","size":"","category":"","region":"","description":"2-sentence summary","signals":[],"buyingSignal":"High/Medium/Low","buyingReason":"1-line reason","score":75}'
    }]
  });

  const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    parsed._source = 'web';
    parsed._score = parsed.score || 60;
    return parsed;
  } catch { return null; }
}

/* ─── Render ─────────────────────────────────────────────── */
function _renderResults(el, criteria, dbMatches, webResults, loading) {
  const total = dbMatches.length + webResults.length;
  const tags = [
    ...(criteria.verticals || []),
    ...(criteria.regions || []),
    ...(criteria.signals || [])
  ].map(t => '<span class="prospect-criteria-tag">' + esc(t) + '</span>').join('');

  let html =
    '<div class="prospect-results-header">' +
      '<div class="prospect-criteria-bar">' +
        (criteria.summary ? '<span class="prospect-criteria-text">' + esc(criteria.summary) + '</span>' : '') +
        tags +
      '</div>' +
      '<div class="prospect-count"><span class="prospect-count-num">' + total + '</span> matches' +
        (loading && webResults.length > 0 ? '<span class="prospect-loading-inline">searching\u2026</span>' : '') +
      '</div>' +
    '</div>';

  if (dbMatches.length > 0) {
    html +=
      '<div class="prospect-section-label">' +
        '<span style="color:var(--g)">&#9677;</span> In your database' +
        '<span class="prospect-section-count">' + dbMatches.length + '</span>' +
      '</div>' +
      '<div class="prospect-list">' + dbMatches.map(_dbCard).join('') + '</div>';
  }

  if (webResults.length > 0) {
    html +=
      '<div class="prospect-section-label" style="margin-top:16px">' +
        '<span style="color:var(--gb)">&#9678;</span> Discovered on the web' +
        '<span class="prospect-section-count">' + webResults.length + '</span>' +
        (loading ? '<span class="prospect-loading-inline">fetching more\u2026</span>' : '') +
      '</div>' +
      '<div class="prospect-list">' + webResults.map(_webCard).join('') + '</div>';
  } else if (loading && dbMatches.length > 0) {
    html +=
      '<div class="prospect-section-label" style="margin-top:16px">' +
        '<span style="color:var(--gb)">&#9678;</span> Discovering companies on the web\u2026' +
        '<span class="prospect-spinner-sm"></span>' +
      '</div>';
  }

  el.innerHTML = html;
}

function _scoreColor(score) {
  return score >= 80 ? 'var(--g)' : score >= 60 ? 'var(--gb)' : 'var(--t3)';
}

function _dbCard(c) {
  const score = c._score || 0;
  return '<div class="prospect-card" onclick="openCompany(\'' + esc(c.id) + '\')">' +
    '<div class="prospect-card-top">' +
      '<div class="prospect-card-name">' + esc(c.name) + '</div>' +
      '<div class="prospect-card-score" style="color:' + _scoreColor(score) + '">' + score + '</div>' +
    '</div>' +
    '<div class="prospect-card-meta">' +
      '<span class="tag ' + tClass(c.type) + '">' + tLabel(c.type) + '</span>' +
      (c.category ? '<span class="prospect-meta-item">' + esc(c.category) + '</span>' : '') +
      (c.region ? '<span class="prospect-meta-item">&#128205; ' + esc(c.region) + '</span>' : '') +
      (c.size ? '<span class="prospect-meta-item">&#128101; ' + esc(c.size) + '</span>' : '') +
      (c.icp ? '<span class="prospect-meta-item">' + stars(c.icp) + '</span>' : '') +
    '</div>' +
    (c._reason ? '<div class="prospect-card-reason">' + esc(c._reason) + '</div>' : '') +
    (c.outreach_angle ? '<div class="prospect-card-angle">' + esc(c.outreach_angle.slice(0, 120)) + (c.outreach_angle.length > 120 ? '\u2026' : '') + '</div>' : '') +
    '<div class="prospect-card-actions">' +
      '<button class="btn sm" onclick="event.stopPropagation();openCompany(\'' + esc(c.id) + '\')">View</button>' +
      '<button class="btn sm" onclick="event.stopPropagation();openComposer(\'' + esc(c.id) + '\')">&#9993; Email</button>' +
      '<button class="btn sm" onclick="event.stopPropagation();prospectLinkedIn(\'' + esc(c.name) + '\',\'' + esc(c.website || '') + '\')">&#128100; Find DMs</button>' +
    '</div>' +
  '</div>';
}

function _webCard(c) {
  const score = c._score || 60;
  const sigColor = c.buyingSignal === 'High' ? 'var(--g)' : c.buyingSignal === 'Medium' ? 'var(--gb)' : 'var(--t3)';
  const signals = (c.signals || []).map(s => '<span class="prospect-signal-tag">' + esc(s) + '</span>').join('');
  const safeJson = esc(JSON.stringify(c)).replace(/'/g, '&#39;');
  return '<div class="prospect-card prospect-card-web">' +
    '<div class="prospect-card-top">' +
      '<div class="prospect-card-name">' + esc(c.name || '') + ' <span class="prospect-new-badge">NEW</span></div>' +
      '<div class="prospect-card-score" style="color:' + _scoreColor(score) + '">' + score + '</div>' +
    '</div>' +
    '<div class="prospect-card-meta">' +
      '<span class="tag tpr">prospect</span>' +
      (c.category ? '<span class="prospect-meta-item">' + esc(c.category) + '</span>' : '') +
      (c.region ? '<span class="prospect-meta-item">&#128205; ' + esc(c.region) + '</span>' : '') +
      (c.size ? '<span class="prospect-meta-item">&#128101; ' + esc(c.size) + '</span>' : '') +
      (c.hq ? '<span class="prospect-meta-item">' + esc(c.hq) + '</span>' : '') +
    '</div>' +
    (c.description ? '<div class="prospect-card-reason">' + esc(c.description) + '</div>' : '') +
    (c.buyingReason ? '<div class="prospect-card-angle" style="color:' + sigColor + '">&#9889; ' + esc(c.buyingSignal || '') + ' signal \u2014 ' + esc(c.buyingReason) + '</div>' : '') +
    (signals ? '<div class="prospect-card-signals">' + signals + '</div>' : '') +
    '<div class="prospect-card-actions">' +
      (c.website ? '<button class="btn sm" onclick="event.stopPropagation();window.open(\'https://' + esc(c.website) + '\',\'_blank\')">&#8599; Website</button>' : '') +
      '<button class="btn sm" onclick="event.stopPropagation();prospectAddToDB(\'' + safeJson + '\')">&#65291; Add to DB</button>' +
      '<button class="btn sm" onclick="event.stopPropagation();prospectLinkedIn(\'' + esc(c.name || '') + '\',\'' + esc(c.website || '') + '\')">&#128100; Find DMs</button>' +
    '</div>' +
  '</div>';
}

/* ─── Actions ────────────────────────────────────────────── */
export function prospectLinkedIn(name, website) {
  const q = encodeURIComponent(name);
  window.open('https://www.linkedin.com/search/results/people/?keywords=' + q + '&titleKeyword=programmatic+OR+data+OR+partnerships', '_blank');
}

export async function prospectAddToDB(jsonStr) {
  let c;
  try { c = JSON.parse(jsonStr); } catch { return; }
  const { SB_URL, SB_KEY } = await import('./config.js');
  const id = _slug(c.name || '');
  if (!id) return;
  const payload = {
    id,
    name: c.name || '',
    type: 'prospect',
    category: c.category || null,
    region: c.region || null,
    hq_city: c.hq || null,
    description: c.description || null,
    website: c.website || null,
    size: c.size || null,
    note: 'prospect \u2014 added via Prospect Finder'
  };
  const res = await fetch(SB_URL + '/rest/v1/companies', {
    method: 'POST',
    headers: {
      apikey: SB_KEY,
      Authorization: 'Bearer ' + SB_KEY,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal'
    },
    body: JSON.stringify(payload)
  });
  if (res.ok) {
    window.clog('db', 'Added ' + c.name + ' to DB');
    const btn = event?.target;
    if (btn) { btn.textContent = '\u2713 Added'; btn.disabled = true; }
    if (typeof window.oaDB?.reload === 'function') window.oaDB.reload();
  }
}

export function closeProspectFinder() {
  const panel = document.getElementById('prospectPanel');
  if (!panel) return;
  panel.remove();
  // Restore empty state if no company is open
  const coPanel = document.getElementById('coPanel');
  const emptyState = document.getElementById('emptyState');
  if (emptyState && (!coPanel || coPanel.style.display === 'none')) {
    emptyState.style.display = '';
  }
}
