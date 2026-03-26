/* ═══ app.js — boot + window exports ═══ */
import S from './state.js';
import { _slug } from './utils.js';
import { renderStats, loadFromSupabase, setStatus, saveCompany, saveContact, promptApiKey, updateKeyBtn, cacheGet, cacheSet, cacheInvalidate, withCache } from './api.js';
import { renderList, switchTab as _switchTab, setFilter, onSearch, renderTagPanel, toggleTagPanel, toggleTag, toggleTagEl, clearTags, setTagLogic, matchTags, runAI, clearAI, aiQuick, openCompany, closePanel, coAction, ctAction, bgGenerateAngle, bgFindDMs, bgRefreshIntel, loadRelationsBrief, openBySlug, showCtxSlug, showCtx, openDrawer, closeDrawer, drEmail, drLinkedIn, drGmail, drResearch, promptResearch, promptSimilar, closeModal, submitModal, openClaude, clog, toggleConsole, clearConsole, setSort, quickEnrich, mapSegments, extractIntelRelations } from './hub.js';
import { openComposer, closeComposer, openPanel as mcOpenPanel, mcPickPersona, mcGenerate, mcCopy, mcHint, mcPickContact } from './meeseeks.js';
import { renderTCFList, renderTCFCenter, tcfSelectRow, tcfClearSel, doGVLMatch, promptGVLConfirm, closeGVLConfirm, executeGVLConfirm, loadGVL } from './tcf.js';
import { renderAudiencesPanel, openAudienceModal, audCloseModal, audNew, audEdit, audOpen, audCloseDetail, audSave, audDelete, audToggleCo, audSetSort, audRefreshDetail, audAIBuild, audExportCsv, audFindContacts } from './audiences.js';

/* ── Theme ─────────────────────────────────────────────────── */
function applyTheme(t){ document.documentElement.setAttribute('data-theme', t); localStorage.setItem('oaTheme', t); }
function toggleTheme(){ applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); }
applyTheme(localStorage.getItem('oaTheme') || 'dark');

/* ── Tab switch — extended for audiences ──────────────────── */
function switchTab(t) {
  _switchTab(t);

  const audPanel = document.getElementById('audiencesPanel');
  const listScroll = document.getElementById('listScroll');
  const leftSearch = document.getElementById('leftSearch');
  const filtersRow = document.getElementById('filtersRow');
  const listMeta   = document.getElementById('listMeta');
  const sortBar    = document.getElementById('sortBar');
  const aiBar      = document.getElementById('aiBar');
  const tagPanel   = document.getElementById('tagPanel');
  const tagBtn     = document.getElementById('tagBtn');
  const tabAud     = document.getElementById('tabAud');

  if (t === 'audiences') {
    // Show audiences panel, hide companies/contacts chrome
    if (audPanel) audPanel.style.display = 'flex';
    if (listScroll) listScroll.style.display = 'none';
    if (leftSearch) leftSearch.style.display = 'none';
    if (filtersRow) filtersRow.style.display = 'none';
    if (listMeta)   listMeta.style.display   = 'none';
    if (sortBar)    sortBar.style.display     = 'none';
    if (aiBar)      aiBar.style.display       = 'none';
    if (tagPanel)   tagPanel.style.display    = 'none';
    if (tabAud)     { tabAud.classList.add('active'); }
    renderAudiencesPanel();
  } else {
    // Restore companies/contacts chrome
    if (audPanel) audPanel.style.display = 'none';
    if (listScroll) listScroll.style.display = '';
    if (leftSearch) leftSearch.style.display = '';
    if (listMeta)   listMeta.style.display   = '';
    if (sortBar)    sortBar.style.display     = '';
    if (tabAud)     { tabAud.classList.remove('active'); }
    // filtersRow + aiBar + tagBtn are handled by hub.js _switchTab
  }
}

/* ── Prospect Finder shim ──────────────────────────────────── */
function openProspectFinder(q) {
  openClaude(q
    ? `Find companies matching: ${q} — for onAudience data partnerships`
    : 'Find 10 high-priority prospect companies for onAudience data partnerships — include DSPs, SSPs, agencies, and data providers not yet in our CRM');
}

/* ── window exports ────────────────────────────────────────── */
Object.assign(window, {
  /* theme */
  getCurrentCompany: () => S.selected,
  setTheme: v => applyTheme(v),
  toggleTheme,

  /* tabs / filter / search */
  switchTab,
  setFilter,
  onSearch,
  toggleTagPanel,
  toggleTag,
  toggleTagEl,
  clearTags,
  setTagLogic,
  renderTagPanel,

  /* AI bar */
  runAI,
  clearAI,
  aiQuick,

  /* sort / utils */
  setSort,
  quickEnrich,
  clog,
  toggleConsole,
  clearConsole,
  mapSegments,
  _slug,

  /* company detail */
  openCompany,
  closePanel,
  coAction,
  ctAction,
  openBySlug,
  showCtxSlug,
  showCtx,
  bgGenerateAngle,
  bgFindDMs,
  bgRefreshIntel,
  loadRelationsBrief,
  extractIntelRelations,

  /* drawers / modals */
  openDrawer,
  closeDrawer,
  drEmail,
  drLinkedIn,
  drGmail,
  drResearch,
  promptResearch,
  promptSimilar,
  closeModal,
  submitModal,
  openClaude,
  openProspectFinder,

  /* API key */
  promptApiKey,

  /* Meeseeks */
  openComposer,
  closeComposer,
  mcOpenPanel,
  mcPickPersona,
  mcGenerate,
  mcCopy,
  mcHint,
  mcPickContact,

  /* TCF */
  renderTCFList,
  renderTCFCenter,
  tcfSelectRow,
  tcfClearSel,
  doGVLMatch,
  promptGVLConfirm,
  closeGVLConfirm,
  executeGVLConfirm,
  loadGVL,

  /* Cache */
  cacheGet,
  cacheSet,
  cacheInvalidate,
  withCache,

  /* Audiences */
  renderAudiencesPanel,
  openAudienceModal,
  audCloseModal,
  audNew,
  audEdit,
  audOpen,
  audCloseDetail,
  audSave,
  audDelete,
  audToggleCo,
  audSetSort,
  audRefreshDetail,
  audAIBuild,
  audExportCsv,
  audFindContacts,
});

/* ── Boot ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  updateKeyBtn();
  await loadFromSupabase(renderStats, renderList, renderTagPanel);
});
