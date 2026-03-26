/* ═══ app.js — boot + window exports ═══ */

import S from './state.js';
import { _slug } from './utils.js';
import { renderStats, loadFromSupabase, setStatus, saveCompany, saveContact, promptApiKey, updateKeyBtn, cacheGet, cacheSet, cacheInvalidate, withCache } from './api.js';
import { renderList, switchTab as _switchTab, setFilter, onSearch, renderTagPanel, toggleTagPanel, toggleTag, toggleTagEl, clearTags, setTagLogic, matchTags, runAI, clearAI, aiQuick, openCompany, closePanel, coAction, ctAction, bgGenerateAngle, bgFindDMs, bgRefreshIntel, loadRelationsBrief, openBySlug, showCtxSlug, showCtx, openDrawer, closeDrawer, drEmail, drLinkedIn, drGmail, drResearch, promptResearch, promptSimilar, closeModal, submitModal, openClaude, clog, toggleConsole, clearConsole, setSort, quickEnrich, mapSegments } from './hub.js';
import { openComposer, closeComposer, openPanel as mcOpenPanel, pickPersona as mcPickPersona, generate as mcGenerate, copy as mcCopy, hint as mcHint, pickContact as mcPickContact } from './meeseeks.js';
import { renderTCFList, renderTCFCenter, tcfSelectRow, tcfClearSel, doGVLMatch, promptGVLConfirm, closeGVLConfirm, executeGVLConfirm, loadGVL } from './tcf.js';
import { openProspectFinder, runProspectFinder, prospectChosen, closeProspectFinder } from './hub.js';

/* ── Theme ─────────────────────────────────────────────────── */
function applyTheme(t){ document.documentElement.setAttribute('data-theme', t); localStorage.setItem('oaTheme', t); }
function toggleTheme(){ applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); }
applyTheme(localStorage.getItem('oaTheme') || 'dark');

/* ── Tab switch shim ───────────────────────────────────────── */
function switchTab(t){ _switchTab(t); }

/* ── window exports — all functions callable from HTML onclick ── */
Object.assign(window, {
  /* state access */
  getCurrentCompany: () => S.selected,
  setTheme: v => applyTheme(v),

  /* theme */
  toggleTheme,

  /* nav */
  switchTab,
  setFilter,
  onSearch,

  /* tags */
  toggleTagPanel,
  toggleTag,
  toggleTagEl,
  clearTags,
  setTagLogic,
  renderTagPanel,

  /* AI */
  runAI,
  clearAI,
  aiQuick,

  /* sort + enrich + console */
  setSort,
  quickEnrich,
  clog,
  toggleConsole,
  clearConsole,
  mapSegments,

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
  _slug,

  /* drawer */
  openDrawer,
  closeDrawer,
  drEmail,
  drLinkedIn,
  drGmail,
  drResearch,

  /* modals */
  promptResearch,
  promptSimilar,
  closeModal,
  submitModal,
  openClaude,

  /* API key */
  promptApiKey,

  /* composer / Meeseeks */
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

  /* prospect finder */
  openProspectFinder,
  runProspectFinder,
  prospectChosen,
  closeProspectFinder,

  /* ── cache API — exposed for hub.js, skills, console debugging ── */
  cacheGet,
  cacheSet,
  cacheInvalidate,
  withCache,
});

/* ── Boot ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  updateKeyBtn();
  await loadFromSupabase(renderStats, renderList, renderTagPanel);
});
