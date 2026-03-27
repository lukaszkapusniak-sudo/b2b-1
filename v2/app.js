/* ═══ app.js — boot + window exports (v2.3 — magic link + audit) ═══ */
import S from './state.js';
import { _slug } from './utils.js';
import { renderStats, loadFromSupabase, setStatus, saveCompany, saveContact, promptApiKey, updateKeyBtn, cacheGet, cacheSet, cacheInvalidate, withCache } from './api.js';
import { renderList, switchTab as _switchTab, setFilter, onSearch, renderTagPanel, toggleTagPanel, toggleTag, toggleTagEl, clearTags, setTagLogic, matchTags, runAI, clearAI, aiQuick, openCompany, closePanel, coAction, ctAction, bgGenerateAngle, bgFindDMs, bgRefreshIntel, loadRelationsBrief, openBySlug, showCtxSlug, showCtx, openDrawer, closeDrawer, drEmail, drLinkedIn, drGmail, drResearch, promptResearch, promptSimilar, closeModal, submitModal, openClaude, clog, toggleConsole, clearConsole, setSort, quickEnrich, mapSegments, extractIntelRelations } from './hub.js';
import { openComposer, closeComposer, openPanel as mcOpenPanel, mcPickPersona, mcGenerate, mcCopy, mcHint, mcPickContact } from './meeseeks.js';
import { renderTCFList, renderTCFCenter, tcfSelectRow, tcfClearSel, doGVLMatch, promptGVLConfirm, closeGVLConfirm, executeGVLConfirm, loadGVL } from './tcf.js';
import { renderAudiencesPanel, openAudienceModal, audCloseModal, audNew, audEdit, audOpen, audCloseDetail, audSave, audDelete, audToggleCo, audSetSort, audRefreshDetail, audAIBuild, audExportCsv, audFindContacts } from './audiences.js';
import {
  getSession, getAuthToken, getCurrentUser,
  signOut, onAuthStateChange,
  getUserProfile,
  logActivity,
  renderLoginScreen, hideLoginScreen,
  doSignIn,
  renderUserBadge,
} from './auth.js';

/* ── Theme ──────────────────────────────────────────────────── */
function applyTheme(t){ document.documentElement.setAttribute('data-theme',t); localStorage.setItem('oaTheme',t); }
function toggleTheme(){ applyTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark'); }
applyTheme(localStorage.getItem('oaTheme')||'dark');

/* ── Auth token injection ───────────────────────────────────────
   Intercept all Supabase REST fetches and inject the live session
   JWT instead of the static anon key. Anon key stays in headers as
   apikey (required by PostgREST), but Authorization carries the JWT
   so RLS sees the authenticated user.
   ─────────────────────────────────────────────────────────────── */
const _origFetch = window.fetch.bind(window);
window.fetch = async function(url, opts={}) {
  if (typeof url==='string' && url.includes('nyzkkqqjnkctcmxoirdj.supabase.co')) {
    const token = await getAuthToken();
    if (token) {
      opts = { ...opts, headers: { ...(opts.headers||{}), Authorization: `Bearer ${token}` } };
    }
  }
  return _origFetch(url, opts);
};

/* ── Audit trail helpers ────────────────────────────────────────
   Thin wrappers that add context then call logActivity().
   Call these AFTER any successful DB write in hub.js / api.js.
   Since we can't easily patch hub.js internals, we expose them
   on window so the existing hub code can call window.oaLog*().
   ─────────────────────────────────────────────────────────────── */
function oaLogCompany(action, company, diff=null) {
  logActivity({
    action,
    entity_type: 'company',
    entity_id:   company?.id || _slug(company?.name||''),
    entity_name: company?.name || company?.id || '?',
    diff,
  }).catch(()=>{});
}

function oaLogContact(action, contact, diff=null) {
  logActivity({
    action,
    entity_type: 'contact',
    entity_id:   contact?.id || _slug(contact?.full_name||''),
    entity_name: contact?.full_name || contact?.id || '?',
    diff,
  }).catch(()=>{});
}

function oaLogAudience(action, audience, diff=null) {
  logActivity({
    action,
    entity_type: 'audience',
    entity_id:   audience?.id,
    entity_name: audience?.name || audience?.id || '?',
    diff,
  }).catch(()=>{});
}

/* ── Tab switch ─────────────────────────────────────────────── */
function switchTab(t) {
  _switchTab(t);
  const audPanel   = document.getElementById('audiencesPanel');
  const listScroll = document.getElementById('listScroll');
  const leftSearch = document.getElementById('leftSearch');
  const filtersRow = document.getElementById('filtersRow');
  const listMeta   = document.getElementById('listMeta');
  const sortBar    = document.getElementById('sortBar');
  const aiBar      = document.getElementById('aiBar');
  const tagPanel   = document.getElementById('tagPanel');
  const tabAud     = document.getElementById('tabAud');

  if (t==='audiences') {
    if (audPanel)   audPanel.style.display   = 'flex';
    if (listScroll) listScroll.style.display = 'none';
    if (leftSearch) leftSearch.style.display = 'none';
    if (filtersRow) filtersRow.style.display = 'none';
    if (listMeta)   listMeta.style.display   = 'none';
    if (sortBar)    sortBar.style.display    = 'none';
    if (aiBar)      aiBar.style.display      = 'none';
    if (tagPanel)   tagPanel.style.display   = 'none';
    if (tabAud)     tabAud.classList.add('active');
    renderAudiencesPanel();
  } else {
    if (audPanel)   audPanel.style.display   = 'none';
    if (listScroll) listScroll.style.display = '';
    if (leftSearch) leftSearch.style.display = '';
    if (listMeta)   listMeta.style.display   = '';
    if (sortBar)    sortBar.style.display    = '';
    if (tabAud)     tabAud.classList.remove('active');
  }
}

/* ── Prospect finder shim ───────────────────────────────────── */
function openProspectFinder(q) {
  openClaude(q
    ? `Find companies matching: ${q} — for onAudience data partnerships`
    : 'Find 10 high-priority prospect companies for onAudience data partnerships — DSPs, SSPs, agencies, data providers not yet in our CRM');
}

/* ── Sign out ───────────────────────────────────────────────── */
async function oaSignOut() {
  if (!confirm('Sign out?')) return;
  await signOut();
}

/* ── window exports ─────────────────────────────────────────── */
Object.assign(window, {
  /* theme */
  getCurrentCompany: () => S.currentCompany,
  setTheme:    v => applyTheme(v),
  toggleTheme,

  /* auth */
  oaSignIn: doSignIn,
  oaSignOut,

  /* audit (callable from hub.js, api.js, meeseeks etc.) */
  oaLogCompany,
  oaLogContact,
  oaLogAudience,
  logActivity,

  /* tabs / filter / search */
  switchTab, setFilter, onSearch,
  toggleTagPanel, toggleTag, toggleTagEl, clearTags, setTagLogic, renderTagPanel,

  /* AI bar */
  runAI, clearAI, aiQuick,

  /* sort / utils */
  setSort, quickEnrich, clog, toggleConsole, clearConsole, mapSegments, _slug,

  /* company detail */
  openCompany, closePanel, coAction, ctAction,
  openBySlug, showCtxSlug, showCtx,
  bgGenerateAngle, bgFindDMs, bgRefreshIntel,
  loadRelationsBrief, extractIntelRelations,

  /* drawers / modals */
  openDrawer, closeDrawer,
  drEmail, drLinkedIn, drGmail, drResearch,
  promptResearch, promptSimilar,
  closeModal, submitModal,
  openClaude, openProspectFinder,

  /* API key */
  promptApiKey,

  /* Meeseeks */
  openComposer, closeComposer, mcOpenPanel,
  mcPickPersona, mcGenerate, mcCopy, mcHint, mcPickContact,

  /* TCF */
  renderTCFList, renderTCFCenter, tcfSelectRow, tcfClearSel,
  doGVLMatch, promptGVLConfirm, closeGVLConfirm, executeGVLConfirm, loadGVL,

  /* Cache */
  cacheGet, cacheSet, cacheInvalidate, withCache,

  /* Audiences */
  renderAudiencesPanel, openAudienceModal, audCloseModal,
  audNew, audEdit, audOpen, audCloseDetail, audSave, audDelete,
  audToggleCo, audSetSort, audRefreshDetail, audAIBuild, audExportCsv, audFindContacts,
});

/* ── Boot ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {

  // Auth state machine
  onAuthStateChange(async (event, session) => {
    if ((event==='SIGNED_IN'||event==='INITIAL_SESSION') && session) {
      hideLoginScreen();
      // Load profile → nav badge
      const profile = await getUserProfile(session.user.id).catch(()=>null);
      if (profile) {
        S.currentUserProfile = profile;
        renderUserBadge(profile);
        clog('info', `Signed in as <b>${profile.full_name||session.user.email}</b> · ${profile.active_role}`);
      }
      // Boot hub
      updateKeyBtn();
      await loadFromSupabase(renderStats, renderList, renderTagPanel);
    } else if (event==='SIGNED_OUT') {
      S.currentUserProfile = null;
      renderLoginScreen();
    }
  });

  // Check for existing session
  const session = await getSession();
  if (!session) renderLoginScreen();
  // If session exists, INITIAL_SESSION fires above ↑
});
