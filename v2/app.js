/* ═══ app.js — boot + window exports ═══ */

import S from './state.js';
import { _slug } from './utils.js';
import { renderStats, loadFromSupabase, setStatus, saveCompany, saveContact, promptApiKey, updateKeyBtn, cacheGet, cacheSet, cacheInvalidate, withCache } from './api.js';
import { renderList, switchTab as _switchTab, setFilter, onSearch, renderTagPanel, toggleTagPanel, toggleTag, toggleTagEl, clearTags, setTagLogic, matchTags, runAI, clearAI, aiQuick, openCompany, closePanel, coAction, ctAction, bgGenerateAngle, bgFindDMs, bgRefreshIntel, loadRelationsBrief, openBySlug, showCtxSlug, showCtx, openDrawer, closeDrawer, drEmail, drLinkedIn, drGmail, drResearch, promptResearch, promptSimilar, closeModal, submitModal, openClaude, clog, toggleConsole, clearConsole, setSort, quickEnrich, mapSegments, extractIntelRelations } from './hub.js';
import { openComposer, closeComposer, openPanel as mcOpenPanel, mcPickPersona, mcGenerate, mcCopy, mcHint, mcPickContact } from './meeseeks.js';
import { renderTCFList, renderTCFCenter, tcfSelectRow, tcfClearSel, doGVLMatch, promptGVLConfirm, closeGVLConfirm, executeGVLConfirm, loadGVL } from './tcf.js';

/* ── Theme ─────────────────────────────────────────────────── */
function applyTheme(t){ document.documentElement.setAttribute('data-theme', t); localStorage.setItem('oaTheme', t); }
function toggleTheme(){ applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); }
applyTheme(localStorage.getItem('oaTheme') || 'dark');

/* ── Tab switch shim ───────────────────────────────────────── */
function switchTab(t){ _switchTab(t); }

/* ── window exports — all functions callable from HTML onclick ── */
Object.assign(window, {
  getCurrentCompany: () => S.selected,
  setTheme: v => applyTheme(v),
  toggleTheme,
  switchTab,
  setFilter,
  onSearch,
  toggleTagPanel,
  toggleTag,
  toggleTagEl,
  clearTags,
  setTagLogic,
  renderTagPanel,
  runAI,
  clearAI,
  aiQuick,
  setSort,
  quickEnrich,
  clog,
  toggleConsole,
  clearConsole,
  mapSegments,
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
  _slug,
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
  promptApiKey,
  openComposer,
  closeComposer,
  mcOpenPanel,
  mcPickPersona,
  mcGenerate,
  mcCopy,
  mcHint,
  mcPickContact,
  renderTCFList,
  renderTCFCenter,
  tcfSelectRow,
  tcfClearSel,
  doGVLMatch,
  promptGVLConfirm,
  closeGVLConfirm,
  executeGVLConfirm,
  loadGVL,
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
