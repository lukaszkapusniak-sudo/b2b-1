// ── THEME ────────────────────────────────────────────────
let theme=localStorage.getItem('oaTheme')||'light';
document.documentElement.setAttribute('data-theme',theme);
function toggleTheme(){theme=theme==='light'?'dark':'light';document.documentElement.setAttribute('data-theme',theme);localStorage.setItem('oaTheme',theme);document.getElementById('themeBtn').textContent=theme==='dark'?'☀️':'🌙'}
document.getElementById('themeBtn').textContent=theme==='dark'?'☀️':'🌙';

// ── SUPABASE ─────────────────────────────────────────────
const SB_URL='https://nyzkkqqjnkctcmxoirdj.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55emtrcXFqbmtjdGNteG9pcmRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzMxMzYsImV4cCI6MjA4OTQ0OTEzNn0.jhAq_C68klOp4iTyj9HmsyyvoxsOI6ACld7t_87TAk0';
const SBH={'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,'Content-Type':'application/json','Prefer':'resolution=merge-duplicates,return=minimal'};

// ── SEED DATA ────────────────────────────────────────────
// [name, note, type, category, region, size, icp, website, li_slug, signals[], social{}]
const SEED=[
  ['6sense','POC client','poc','Intent Data / ABM','US',null,8,'6sense.com','6sense',['intent'],{li:'6sense',tw:'6senseInc'}],
  ['Adform','integrated partner / DSP Europe','partner','DSP','Europe',null,8,'adform.com','adform',['DSP'],{li:'adform',tw:'AdformHQ'}],
  ['Adobe','partner — DMP integration','partner','DMP','US',null,7,'adobe.com','adobe',['DMP'],{li:'adobe',tw:'Adobe'}],
  ['Adtonos','client','client','Audio AdTech','UK',null,7,'adtonos.com','adtonos',[],{}],
  ['AlikeAudience','client','client','Audience Data / DMP','APAC',null,10,'alikeaudience.com','alikeaudience',['TTD','DV360'],{li:'alikeaudience',tw:'AlikeAudience'}],
  ['Amazon','partner','partner','DSP / Marketplace','US',null,7,'amazon.com','amazon',['DSP'],{li:'amazon',tw:'AmazonAds'}],
  ['Anzu','POC client','poc','In-game AdTech','UK',null,7,'anzu.io','anzu-io',[],{}],
  ['Audigent','partner / curation','partner','Data Curation','US',null,8,'audigent.com','audigent',['curation','TTD'],{li:'audigent',tw:'Audigent'}],
  ['Bango','prospect — via LiveRamp','prospect','Data / Identity','UK',null,7,'bango.com','bango',['LiveRamp'],{li:'bango'}],
  ['Beintoo','prospect — to continue','prospect','Mobile Data','Italy',null,6,'beintoo.com','beintoo',[],{}],
  ['Bidtheatre','partner / DSP Scandinavia','partner','DSP','Scandinavia',null,7,'bidtheatre.com','bidtheatre',['DSP'],{li:'bidtheatre'}],
  ['Bright Mountain Media','prospect — to continue','prospect','Media / AdTech','US',null,6,'brightmountainmedia.com','bright-mountain-media',[],{}],
  ['Bytedance (TikTok)','client — APAC only','client','Social / DSP','APAC',null,7,'bytedance.com','bytedance',[],{li:'bytedance',tw:'TikTokBusiness'}],
  ['Captify UK','client','client','Search Intelligence','UK',null,8,'captify.co.uk','captify',['contextual'],{li:'captify',tw:'CaptifySearch'}],
  ['Claritas','prospect — to continue','prospect','Data Provider','US',null,7,'claritas.com','claritas-llc',['data'],{li:'claritas-llc',tw:'ClaritasLLC'}],
  ['Criteo','partner — contact: Adrian','partner','DSP / Retargeting','Global',null,7,'criteo.com','criteo',['DSP'],{li:'criteo',tw:'Criteo'}],
  ['Datonics','client','client','Data Provider','US',null,10,'datonics.com','datonics',['data','TTD','DV360'],{li:'datonics',tw:'Datonics'}],
  ['Echo Analytics','POC client','poc','Location Data','France',null,8,'echo-analytics.eu','echo-analytics',[],{}],
  ['Entity X','client — Adrian','client','AdTech','US',null,7,'entityx.com','entityx',[],{}],
  ['Epsilon','partner — Matt deal','partner','Data / DMP','US',null,8,'epsilon.com','epsilon-data-management',['data','DMP'],{li:'epsilon-data-management',tw:'EpsilonMktg'}],
  ['Equativ','partner / SSP curation','partner','SSP','Europe',null,8,'equativ.com','equativ',['SSP'],{li:'equativ',tw:'Equativ_'}],
  ['Experian','prospect — Karo/Maciek','prospect','Data Provider','UK',null,7,'experian.com','experian',['data'],{li:'experian',tw:'Experian_PLC'}],
  ['Eyeota','partner','partner','Data Provider','APAC/Global',null,7,'eyeota.com','eyeota',['data'],{li:'eyeota',tw:'Eyeota'}],
  ['Foursquare','partner','partner','Location Data','US',null,7,'foursquare.com','foursquare',['location'],{li:'foursquare',tw:'Foursquare'}],
  ['Fyllo','partner','partner','Data / Compliance','US',null,7,'fyllo.com','fyllo',['data'],{li:'fyllo'}],
  ['Google','partner','partner','DSP / DMP','US',null,7,'google.com','google',['DSP','DMP'],{li:'google',tw:'Google'}],
  ['Havas PL','client / agency','client','Media Agency','Poland',null,8,'havas.com','havas',['agency'],{li:'havas',tw:'Havas'}],
  ['Hybrid','partner','partner','Programmatic','Poland',null,7,'hybrid.ai','hybrid-agency',[],{}],
  ['ID5','partner / cookieless product','partner','Identity','Europe',null,9,'id5.io','id5-io',['identity','cookieless'],{li:'id5-io',tw:'ID5tech'}],
  ['Intuizi','client — Adrian','client','Mobile Data','US',null,7,'intuizi.com','intuizi',[],{}],
  ['Kochava','partner / data provider','partner','MMP / Data','US',null,7,'kochava.com','kochava',['data','mobile'],{li:'kochava',tw:'Kochava'}],
  ['LiveRamp','partner / marketplace','partner','Identity / Marketplace','US',null,9,'liveramp.com','liveramp',['identity','marketplace','TTD'],{li:'liveramp',tw:'LiveRamp'}],
  ['Madhive','prospect / DSP — Karolina','prospect','DSP / CTV','US',null,9,'madhive.com','madhive',['DSP','CTV'],{li:'madhive',tw:'MadHive_IO'}],
  ['Mastercard','partner','partner','Data / Finance','US',null,7,'mastercard.com','mastercard',['data'],{li:'mastercard',tw:'Mastercard'}],
  ['MediaWallah','partner / data exchange','partner','Identity / Data Exchange','US',null,7,'mediawallah.com','mediawallah',['identity'],{li:'mediawallah'}],
  ['MeMob','client','client','Mobile AdTech','Poland',null,7,'memob.com','memob',[],{}],
  ['Microsoft Advertising (Xandr)','partner','partner','DSP','US',null,8,'microsoft.com','microsoft',['DSP'],{li:'microsoft',tw:'MSAdvertising'}],
  ['MNTN','partner / DSP','partner','CTV DSP','US',null,8,'mountain.com','mntn-inc',['DSP','CTV'],{li:'mntn-inc',tw:'MNTNtech'}],
  ['Mobilewalla','client','client','Mobile Data','US',null,7,'mobilewalla.com','mobilewalla',[],{li:'mobilewalla',tw:'Mobilewalla'}],
  ['Moboost','client','client','Mobile AdTech','Poland',null,7,'moboost.com','moboost',[],{}],
  ['Multilocal','client — Adrian','client','Local Programmatic','UK',null,7,'multilocal.com','multilocal',[],{}],
  ['Nexxen','prospect','prospect','DSP / CTV','US/Israel',null,8,'nexxen.com','nexxen',['DSP','CTV'],{li:'nexxen',tw:'NexxenHQ'}],
  ['OpenSignal','client','client','Mobile Analytics','UK',null,7,'opensignal.com','opensignal',[],{}],
  ['OpenX','prospect','prospect','SSP','US',null,7,'openx.com','openx',['SSP'],{li:'openx',tw:'OpenX'}],
  ['Permutive','client','client','Cookieless DMP','UK',null,8,'permutive.com','permutive',['cookieless','DMP'],{li:'permutive',tw:'Permutive'}],
  ['Pubmatic','partner','partner','SSP','US',null,7,'pubmatic.com','pubmatic',['SSP'],{li:'pubmatic',tw:'PubMatic'}],
  ['Samba TV','prospect','prospect','CTV Data','US',null,8,'samba.tv','samba-tv',['CTV','data'],{li:'samba-tv',tw:'SambaTV'}],
  ['Semantec','client','client','Data Provider','Poland',null,7,'semantec.pl','semantec',[],{}],
  ['Semasio','partner — acquired by Fyllo','partner','Contextual Data','Germany',null,7,'semasio.com','semasio',['contextual'],{li:'semasio'}],
  ['Sharethrough','partner / data exchange','partner','SSP / Native','US',null,7,'sharethrough.com','sharethrough',['SSP'],{li:'sharethrough',tw:'Sharethrough'}],
  ['Sovrn','client — Adrian','client','Publisher Platform','US',null,7,'sovrn.com','sovrn',['data'],{li:'sovrn',tw:'sovrn'}],
  ['Sportradar','prospect — Karolina','prospect','Sports Data','Switzerland',null,8,'sportradar.com','sportradar',['data','sports'],{li:'sportradar',tw:'Sportradar'}],
  ['Stackadapt','prospect','prospect','DSP','Canada',null,8,'stackadapt.com','stackadapt',['DSP'],{li:'stackadapt',tw:'StackAdapt'}],
  ['Taboola','prospect — via MSFT Curate','prospect','Native / Curation','US',null,7,'taboola.com','taboola',['native'],{li:'taboola',tw:'taboola'}],
  ['TheTradeDesk','partner','partner','DSP','US',null,9,'thetradedesk.com','thetradedesk',['DSP'],{li:'thetradedesk',tw:'TheTradeDesk'}],
  ['TikTok','partner — via Bytedance','partner','Social / DSP','APAC/Global',null,7,'tiktok.com','tiktok',[],{li:'tiktok',tw:'TikTokBusiness'}],
  ['True Data','client','client','Data Provider','Japan',null,7,'true-data.co.jp','truedata',[],{}],
  ['VentiveIQ','prospect — Maciek + Adrian','prospect','Identity / Data','US',null,8,'ventiveiq.com','ventiveiq',['identity'],{li:'ventiveiq'}],
  ['VistarMedia (T-Mobile)','prospect','prospect','DOOH / CTV DSP','US',null,8,'vistarmedia.com','vistarmedia',['CTV','DOOH','DSP'],{li:'vistarmedia',tw:'VistarMedia'}],
  ['Weborama','prospect','prospect','Contextual / DMP','France',null,7,'weborama.com','weborama',['contextual'],{li:'weborama',tw:'Weborama'}],
  ['Wowcher','client','client','E-commerce','UK',null,7,'wowcher.co.uk','wowcher',[],{}],
  ['Zeotap','client','client','CDP / Identity','Germany',null,8,'zeotap.com','zeotap',['CDP','identity'],{li:'zeotap',tw:'zeotap'}],
  ['Beklever','prospect','prospect','AdTech','Spain',null,6,'beklever.com','beklever',[],{}],
  ['Havas Spain','prospect','prospect','Media Agency','Spain',null,7,'havas.com','havas',['agency'],{li:'havas'}],
  ['Dentsu Thailand','prospect','prospect','Media Agency','Thailand',null,6,'dentsu.com','dentsu',['agency'],{li:'dentsu'}],
  ['OMD Thailand','prospect','prospect','Media Agency','Thailand',null,6,'omd.com','omd',['agency'],{li:'omd'}],
  ['Splicky DSP','prospect','prospect','DSP / Mobile','Germany',null,7,'splicky.com','splicky',['DSP'],{li:'splicky'}],
  ['Synthesi','partner — to be','partner','Data','France',null,6,'synthesi.fr','synthesi',[],{}],
  ['Admixer','no outreach','nogo','AdTech','Ukraine',null,null,'admixer.com','admixer',[],{}],
  ['Aniview','no outreach — failed deal','nogo','Video AdTech','US',null,null,'aniview.com','aniview',[],{}],
  ['Bidscube','no outreach — former client','nogo','DSP / White Label','India',null,null,'bidscube.com','bidscube',[],{}],
  ['Dynata','no outreach — former client','nogo','Research / Data','US',null,null,'dynata.com','dynata',[],{li:'dynata',tw:'Dynata'}],
  ['Eskimi','no outreach — bad timing','nogo','Mobile DSP','Lithuania',null,null,'eskimi.com','eskimi',[],{}],
  ['Lifesight','no outreach — unwanted','nogo','CDP','Singapore',null,null,'lifesight.io','lifesight',[],{}],
  ['Lotame','no outreach — contract ended','nogo','DMP','US',null,null,'lotame.com','lotame',[],{li:'lotame',tw:'Lotame'}],
  ['Meta','no outreach — via LiveRamp only','nogo','Social / DSP','US',null,null,'meta.com','facebook',[],{li:'facebook',tw:'Meta'}],
  ['Nielsen','no outreach','nogo','Measurement','US',null,null,'nielsen.com','nielsen',[],{li:'nielsen',tw:'Nielsen'}],
  ['Oracle','no outreach — closed ad division','nogo','AdTech','US',null,null,'oracle.com','oracle',[],{li:'oracle',tw:'Oracle'}],
  ['RTB House','no business','nogo','DSP / Retargeting','Poland',null,null,'rtbhouse.com','rtb-house',[],{li:'rtb-house',tw:'RTBHouse'}],
];

const SEED_CONTACTS=[
  {id:'gianluca-leotta-audiencerate',full_name:'Gianluca Leotta',title:'Commercial / Partnerships',company_name:'AudienceRate',email:'gl@audiencerate.com',linkedin_url:'https://linkedin.com/in/gianlucaleotta',twitter:'',notes:'Active deal — DV360 tests running. Last reply Apr 29.',activity:[{platform:'li',text:'Microsoft partnership expansion — scaling CDP to DACH and Nordics 🚀',date:'2d ago',tags:['signal','hot']},{platform:'li',text:'Commented on "The future of addressability in Europe" by IAB Europe',date:'5d ago',tags:[]}]},
  {id:'santi-darmandrail-retargetly',full_name:'Santi Darmandrail',title:'MD, Retargetly Data',company_name:'Retargetly',email:'santi@retargetly.com',linkedin_url:'https://linkedin.com/in/santidarmandrail',twitter:'@santidarmandrail',notes:'Prior 2019 TTD/BlueKai partnership. Warm re-engagement opportunity.',activity:[{platform:'li',text:'Shared: How Epsilon is transforming LatAm data partnerships',date:'1w ago',tags:[]},{platform:'x',text:'Cookie deprecation moved again. Third-party data still alive 🍪',date:'3d ago',tags:['signal']}]},
  {id:'filip-hromek-cpex',full_name:'Filip Hromek',title:'Executive Director',company_name:'Czech Publisher Exchange (CPEx)',email:'filip.hromek@cpex.cz',linkedin_url:'https://linkedin.com/in/filiphromek',twitter:'',notes:'New director since Jan 2025. Czech Ad ID expansion focus.',activity:[{platform:'li',text:'Czech Ad ID hits 50M monthly profiles — cookieless milestone for Czech publishers',date:'4d ago',tags:['signal','hot']}]},
  {id:'jeremy-ryvicker-alikeaudience',full_name:'Jeremy Ryvicker',title:'VP Data Partnerships',company_name:'AlikeAudience',email:'jeremy.ryvicker@alikeaudience.com',linkedin_url:'https://linkedin.com/in/jeremyryvicker',twitter:'',notes:'Key contact for upsell — APAC and EU segment expansion.',activity:[{platform:'li',text:'AI-first audience segmentation is redefining programmatic buying in APAC',date:'3d ago',tags:['signal']}]},
  {id:'filippo-gramigna-audiencerate',full_name:'Filippo Gramigna',title:'CEO',company_name:'AudienceRate',email:'filippo.gramigna@audiencerate.com',linkedin_url:'https://linkedin.com/in/filippogramigna',twitter:'',notes:'CEO — escalate if Gianluca unresponsive.',activity:[]},
];

const FEED_ALL=[
  {who:'Gianluca Leotta',co:'AudienceRate',platform:'li',text:'Microsoft partnership expansion — CDP scaling to DACH and Nordics 🚀',date:'2h ago',tags:['signal','hot']},
  {who:'Filip Hromek',co:'CPEx',platform:'li',text:'Czech Ad ID now at 50M+ monthly profiles — cookieless gaining traction across CZ publishers',date:'4h ago',tags:['signal']},
  {who:'Santi Darmandrail',co:'Retargetly',platform:'x',text:'Third-party data is not dead. Just needs a new home. Epsilon is building that.',date:'1d ago',tags:[]},
  {who:'TheTradeDesk',co:'TheTradeDesk',platform:'li',text:'New whitepaper: The case for audience data in cookieless programmatic',date:'1d ago',tags:['signal']},
  {who:'Madhive',co:'Madhive',platform:'li',text:'We are hiring: Director of Data Partnerships (EMEA) — join us scaling data buying in Europe',date:'2d ago',tags:['hot','signal']},
  {who:'Nexxen',co:'Nexxen',platform:'x',text:'Q1 earnings beat — CTV revenue +42% YoY. Scaling data buying significantly.',date:'3d ago',tags:['hot']},
  {who:'Samba TV',co:'Samba TV',platform:'li',text:'Launching new EU audience segments for CTV — European footprint expansion Q2 2026',date:'3d ago',tags:['signal']},
  {who:'Sportradar',co:'Sportradar',platform:'li',text:'New programmatic data product for sports publishers — seeking DSP integration partners',date:'5d ago',tags:['signal','hot']},
  {who:'Jeremy Ryvicker',co:'AlikeAudience',platform:'li',text:'AI-first audience segmentation is redefining programmatic buying in APAC — great Q1 results',date:'3d ago',tags:['signal']},
  {who:'VentiveIQ',co:'VentiveIQ',platform:'li',text:'Proud to announce our $12M Series A — building the identity graph for EMEA and APAC',date:'1w ago',tags:['hot']},
  {who:'VistarMedia',co:'VistarMedia',platform:'x',text:'DOOH + CTV convergence is the next frontier for audience data. Our stack is ready.',date:'1w ago',tags:[]},
  {who:'ID5',co:'ID5',platform:'li',text:'ID5 ID now available on 15 additional DSPs — cookieless coverage expanding across EMEA',date:'1w ago',tags:['signal']},
];

const GROUPS=[
  {ico:'💼',name:'Programmatic Advertising Professionals',platform:'LinkedIn Group',members:'42K',activity:'High',url:'https://www.linkedin.com/groups/2403690/'},
  {ico:'📺',name:'Connected TV & Streaming Advertising',platform:'LinkedIn Group',members:'31K',activity:'High',url:'https://www.linkedin.com/groups/'},
  {ico:'💬',name:'AdOps Slack Community',platform:'Slack',members:'12K',activity:'Very High',url:'https://adops.com/slack'},
  {ico:'🔬',name:'MeasureCamp',platform:'Slack',members:'5K',activity:'High',url:'https://measurecamp.org/'},
  {ico:'📊',name:'Data Partnerships & Monetisation',platform:'LinkedIn Group',members:'18K',activity:'Medium',url:'https://www.linkedin.com/groups/'},
  {ico:'🏷️',name:'r/adtech',platform:'Reddit',members:'28K',activity:'Medium',url:'https://reddit.com/r/adtech'},
  {ico:'🔗',name:'IAB Europe Programmatic Committee',platform:'LinkedIn Group',members:'8K',activity:'Low',url:'https://www.linkedin.com/groups/'},
  {ico:'🎙️',name:'AdExchanger Community',platform:'Web',members:'—',activity:'Medium',url:'https://adexchanger.com/'},
  {ico:'📰',name:'AdTechGod',platform:'Slack',members:'3K',activity:'High',url:'https://adtechgod.com/'},
];

// ── STATE ────────────────────────────────────────────────
let companies=[],contacts=[],selCo=null,selCt=null;
let activeFilter='all',activeTab='co',feedTab='all';
let _mTpl='',_mMode='';

// ── UTILS ────────────────────────────────────────────────
function pal(n){const p=[['#9FE1CB30','#0F6E56'],['#B5D4F430','#1A4F8A'],['#FAC77530','#7A4200'],['#C0DD9730','#3B6D11'],['#F4C0D130','#993556']];let h=0;for(let c of n)h=(h*31+c.charCodeAt(0))&0xffff;return p[h%p.length]}
function ini(n){return(n||'').replace(/[^A-Za-z ]/g,'').split(' ').filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase()||'?'}
function tc(s){return{client:'tc',partner:'tp',prospect:'tpr',nogo:'tn',poc:'tpo'}[s]||'tpr'}
function tl(s){return{client:'Client',partner:'Partner',prospect:'Prospect',nogo:'No outreach',poc:'Active Deal'}[s]||''}
function stars(n){if(!n)return'';const f=Math.min(5,Math.round(n/2));return'★'.repeat(f)+'☆'.repeat(5-f)}
function pico(p){return{li:'🔗',x:'𝕏',tw:'𝕏'}[p]||'💬'}
function esc(s){return(s||'').replace(/'/g,"\\'")}
function openClaude(p){window.open('https://claude.ai/new?q='+encodeURIComponent(p),'_blank')}

// ── window.oaDB ──────────────────────────────────────────
window.oaDB={
  async load(){
    const dot=document.getElementById('ndot'),st=document.getElementById('nstat');
    dot.className='ndot';st.textContent='Loading…';
    try{
      const [cr,rr]=await Promise.all([
        fetch(`${SB_URL}/rest/v1/companies?select=*&order=name.asc`,{headers:SBH}),
        fetch(`${SB_URL}/rest/v1/contacts?select=*&order=full_name.asc`,{headers:SBH}),
      ]);
      if(!cr.ok||!rr.ok)throw new Error('HTTP '+cr.status);
      const dbCo=await cr.json();
      const dbCt=await rr.json();
      companies=dbCo.length?dbCo.map(r=>{const s=SEED.find(x=>x[0].toLowerCase()===r.name?.toLowerCase());return{...r,signals:s?s[9]:[],social:s?s[10]:{}}}):seedCo();
      contacts=dbCt.length?dbCt.map(r=>{const s=SEED_CONTACTS.find(x=>x.id===r.id||x.email===r.email);return{...r,activity:s?s.activity:[]}}):SEED_CONTACTS.map(x=>({...x}));
      dot.className='ndot live';st.textContent=`● Live · ${companies.length}co · ${contacts.length}ct`;
    }catch(e){
      companies=seedCo();contacts=SEED_CONTACTS.map(x=>({...x}));
      dot.className='ndot err';st.textContent=`○ Seed · ${companies.length}co`;
    }
    updateStats();renderCo();renderCt();renderFeed();renderGrp();
  },
  reload(){this.load()},
  async saveCompany(r){
    try{await fetch(`${SB_URL}/rest/v1/companies`,{method:'POST',headers:SBH,body:JSON.stringify(r)})}catch(e){}
    await this.load();
  },
  async saveContact(r){
    try{await fetch(`${SB_URL}/rest/v1/contacts`,{method:'POST',headers:SBH,body:JSON.stringify(r)})}catch(e){}
    await this.load();
  },
};

function seedCo(){return SEED.map(([name,note,type,cat,reg,sz,icp,web,li,signals,social])=>({name,note:note||'',type:type||'prospect',category:cat||null,region:reg||null,size:sz||null,icp:icp||null,website:web||null,linkedin_slug:li||null,signals:signals||[],social:social||{}}))}

// ── STATS ────────────────────────────────────────────────
function updateStats(){
  document.getElementById('st-all').textContent=companies.length;
  document.getElementById('st-client').textContent=companies.filter(c=>c.type==='client').length;
  document.getElementById('st-poc').textContent=companies.filter(c=>c.type==='poc').length;
  document.getElementById('st-partner').textContent=companies.filter(c=>c.type==='partner').length;
  document.getElementById('st-prospect').textContent=companies.filter(c=>c.type==='prospect').length;
  document.getElementById('st-nogo').textContent=companies.filter(c=>c.type==='nogo').length;
  document.getElementById('ctbadge').textContent=contacts.filter(c=>c.company_name!=='onAudience').length;
}

// ── FILTER ───────────────────────────────────────────────
function setFilter(f,el){
  activeFilter=f;
  document.querySelectorAll('.sc').forEach(b=>b.classList.remove('active'));
  const sc=document.getElementById('sc-'+f);if(sc)sc.classList.add('active');
  document.querySelectorAll('#fr .fp').forEach(b=>b.classList.remove('active'));
  if(el?.classList)el.classList.add('active');
  renderCo();
}

// ── RENDER CO ────────────────────────────────────────────
function renderCo(){
  const q=(document.getElementById('coQ').value||'').toLowerCase();
  const list=companies.filter(c=>{
    if(activeFilter!=='all'&&c.type!==activeFilter)return false;
    if(q){const h=(c.name+c.note+(c.signals||[]).join(' ')+(c.category||'')+(c.region||'')).toLowerCase();if(!h.includes(q))return false}
    return true;
  });
  document.getElementById('colm').textContent=`${list.length} of ${companies.length}`;
  document.getElementById('coList').innerHTML=list.map(c=>{
    const [bg,fg]=pal(c.name);
    const sigs=(c.signals||[]).slice(0,2).map(s=>`<span class="sp">${s}</span>`).join('');
    return `<div class="co${c.name===selCo?' sel':''}${c.type==='nogo'?' dead':''}"
      onclick="openCo('${encodeURIComponent(c.name)}')"
      oncontextmenu="showCtx(event,'${encodeURIComponent(c.name)}','${c.type}');return false;">
      <div class="av" style="background:${bg};border-color:${fg}40;color:${fg}">${ini(c.name)}</div>
      <div class="ci"><div class="cn">${c.name}</div><div class="cno">${c.note||'—'}</div></div>
      <div class="cr">${sigs}<span class="tag ${tc(c.type)}">${tl(c.type)}</span></div>
    </div>`;
  }).join('');
}

// ── RENDER CT ────────────────────────────────────────────
function renderCt(){
  const q=(document.getElementById('ctQ')?.value||'').toLowerCase();
  const list=contacts.filter(c=>{
    if(c.company_name==='onAudience')return false;
    if(q){const h=(c.full_name+c.title+c.company_name).toLowerCase();if(!h.includes(q))return false}
    return true;
  });
  document.getElementById('ctlm').textContent=`${list.length} contacts`;
  document.getElementById('ctList').innerHTML=list.map(c=>{
    const hasA=(c.activity||[]).length>0;
    const hot=hasA&&c.activity.some(a=>a.tags?.includes('hot'));
    return`<div class="ctr${c.id===selCt?' sel':''}" onclick="openDw('${c.id}')">
      <div class="ctav">${ini(c.full_name)}</div>
      <div class="ctif"><div class="ctnm">${c.full_name}</div><div class="ctsb">${c.title} · ${c.company_name}</div></div>
      <div style="display:flex;gap:2px;flex-shrink:0">
        ${c.twitter?`<span style="font-size:10px;opacity:.5">𝕏</span>`:''}
        ${hasA?`<span style="font-size:10px;opacity:${hot?1:.4}">⚡</span>`:''}
      </div>
    </div>`;
  }).join('');
}

// ── RENDER FEED ──────────────────────────────────────────
function renderFeed(){
  let items=FEED_ALL;
  if(feedTab==='li')items=items.filter(i=>i.platform==='li');
  if(feedTab==='x')items=items.filter(i=>i.platform==='x'||i.platform==='tw');
  if(feedTab==='hot')items=items.filter(i=>i.tags?.some(t=>['signal','hot'].includes(t)));
  document.getElementById('feedList').innerHTML=items.map(i=>{
    const tH=(i.tags||[]).map(t=>`<span class="ftag${t==='hot'?' hot':t==='signal'?' sig':''}">${t==='hot'?'🔥':t==='signal'?'📡 sig':t}</span>`).join('');
    return`<div class="fi"><div class="fiav">${ini(i.who)}</div><div class="fib"><div class="fiw">${i.who} <span style="font-weight:400;color:var(--t3)">· ${i.co}</span></div><div class="fit">${pico(i.platform)} ${i.text}</div><div class="fim">${i.date} ${tH}</div></div></div>`;
  }).join('');
}
function setFeedTab(t,el){feedTab=t;document.querySelectorAll('#feedtabs .atab').forEach(b=>b.classList.remove('active'));el.classList.add('active');renderFeed()}

// ── RENDER GRP ───────────────────────────────────────────
function renderGrp(){
  document.getElementById('grpList').innerHTML=GROUPS.map(g=>{
    const hot=['High','Very High'].includes(g.activity);
    return`<div class="gr" onclick="window.open('${g.url}','_blank')"><div class="gri">${g.ico}</div><div class="grinf"><div class="grt">${g.name}</div><div class="grm">${g.platform} · ${g.members} members</div></div><span class="grb${hot?' hot':''}">${g.activity}</span></div>`;
  }).join('');
}

// ── TAB SWITCH ───────────────────────────────────────────
function showTab(t){
  activeTab=t;
  ['co','ct','feed','grp'].forEach(p=>{
    document.getElementById(`pane-${p}`).style.display=p===t?'flex':'none';
    document.getElementById(`tab-${p}`)?.classList.toggle('active',p===t);
  });
}

// ── OPEN CO ──────────────────────────────────────────────
function openCo(enc){
  const name=decodeURIComponent(enc);selCo=name;
  const c=companies.find(x=>x.name===name);if(!c)return;
  renderCo();
  const [bg,fg]=pal(name);
  const coCts=contacts.filter(ct=>ct.company_name===name);
  const soc=c.social||{};

  const socH=[
    soc.li?`<a class="soca" href="https://www.linkedin.com/company/${soc.li}" target="_blank">🔗 LinkedIn</a>`:'',
    soc.tw?`<a class="soca" href="https://twitter.com/${soc.tw}" target="_blank">𝕏 @${soc.tw}</a>`:'',
    `<a class="soca" href="https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(name+' Head Programmatic Data Partnerships')}" target="_blank">👤 Find DMs</a>`,
    `<a class="soca" href="https://www.crunchbase.com/textsearch?q=${encodeURIComponent(name)}" target="_blank">📊 Crunchbase</a>`,
    `<a class="soca" href="https://builtwith.com/?${encodeURIComponent((c.website||'').replace(/https?:\/\/(www\.)?/,'').split('/')[0])}" target="_blank">🔧 BuiltWith</a>`,
    `<a class="soca" href="https://www.google.com/search?q=${encodeURIComponent(name+' programmatic data partnerships 2025 2026')}" target="_blank">🌐 News</a>`,
  ].filter(Boolean).join('');

  const sigH=(c.signals||[]).map(s=>`<span class="sp" style="font-size:9px;padding:2px 6px">${s}</span>`).join('');

  const ctH=coCts.length?coCts.map(ct=>`<div class="cc" onclick="openDw('${ct.id}')">
    <div class="cctop">
      <div class="ccav">${ini(ct.full_name)}</div>
      <div style="flex:1"><div class="ccnm">${ct.full_name}</div><div class="ccrl">${ct.title}</div></div>
      ${ct.twitter?`<a class="soca" href="https://twitter.com/${ct.twitter}" target="_blank" onclick="event.stopPropagation()">𝕏</a>`:''}
      ${ct.linkedin_url?`<a class="soca" href="${ct.linkedin_url}" target="_blank" onclick="event.stopPropagation()">🔗</a>`:''}
    </div>
    ${ct.email?`<span class="ccem">${ct.email}</span>`:''}
    ${ct.notes?`<div style="font-size:11px;color:var(--t2);margin-top:5px">${ct.notes}</div>`:''}
  </div>`).join(''):`<div class="al-none">No contacts researched yet</div>`;

  const ctAct=coCts.flatMap(ct=>(ct.activity||[]).map(a=>({...a,who:ct.full_name})));
  const actH=ctAct.length?ctAct.map(a=>{
    const tH=(a.tags||[]).map(t=>`<span class="ftag${t==='hot'?' hot':t==='signal'?' sig':''}">${t==='hot'?'🔥':t==='signal'?'📡':t}</span>`).join('');
    return`<div class="fi"><div class="fib"><div class="fiw">${a.who}</div><div class="fit">${pico(a.platform)} ${a.text}</div><div class="fim">${a.date} ${tH}</div></div></div>`;
  }).join(''):`<div style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--t3)">No tracked activity — follow contacts to populate feed</div>`;

  const angles={
    client:`<strong>${name}</strong> is an active client. Review current segment usage and identify upsell — adjacent categories, new geos, or new verticals. Check contract renewal timing.`,
    partner:`<strong>${name}</strong> is an integrated partner. Explore joint go-to-market, co-marketing, or expanding integration scope. Look for referral pipeline opportunities.`,
    prospect:`<strong>${name}</strong> is a strong ICP fit. Lead with the TTD Data Marketplace angle — zero integration needed for their traders. Reference a similar client case study as proof.`,
    poc:`<strong>${name}</strong> is in active POC. Follow up on test results, remove blockers, and push toward a 90-day non-exclusive revenue-share agreement.`,
    nogo:`⚠️ <strong>${name}</strong> is flagged for no outreach. Check notes carefully before proceeding — prior failed deal or relationship issue may apply.`,
  };

  const gridRows=[
    ['Category',c.category||'—'],['Region',c.region||'—'],
    ['Size',c.size?c.size+' employees':'—'],
    ['ICP Score',c.icp?stars(c.icp)+` ${c.icp}/10`:'—'],
    c.website?['Website',`<a class="ml" href="https://${c.website}" target="_blank">${c.website} ↗</a>`]:null,
    c.linkedin_slug?['LinkedIn',`<a class="ml" href="https://linkedin.com/company/${c.linkedin_slug}" target="_blank">Company page ↗</a>`]:null,
  ].filter(Boolean);

  document.getElementById('es').style.display='none';
  document.getElementById('dp').style.display='block';
  document.getElementById('dp').innerHTML=`<div class="dp">

  <div class="banner">
    <div class="b-av" style="background:${bg};border:2px solid ${fg}40;color:${fg}">${ini(name)}</div>
    <div class="b-inf">
      <div class="b-nm">${name} <span class="tag ${tc(c.type)}">${tl(c.type)}</span></div>
      <div class="b-sub">${c.note||'—'}</div>
      <div class="b-meta">${sigH}${c.icp?`<span style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--g)">${stars(c.icp)}</span>`:''}</div>
      <div class="socrow">${socH}</div>
    </div>
    <div class="b-acts">
      <button class="btn p" onclick="openClaude('Research ${esc(name)} — full contact report: decision makers, tech stack, activation path, outreach angle, ICP fit for onAudience data partnership')">Full report ↗</button>
      <button class="btn" onclick="openClaude('Draft personalized outreach email to ${esc(name)} for onAudience data partnership — value-led and curiosity variants')">Draft email ↗</button>
      <button class="btn" onclick="closeCo()" style="color:var(--t3)">✕ Close</button>
    </div>
  </div>

  <div class="ps">
    <div class="ph" onclick="togglePs(this)"><span>🏢</span><span class="pl">Company Details</span><span class="chev open">▾</span></div>
    <div class="pb"><table class="inf">${gridRows.map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table></div>
  </div>

  <div class="ps">
    <div class="ph" onclick="togglePs(this)"><span>💡</span><span class="pl">Outreach Angle</span><span class="chev open">▾</span></div>
    <div class="pb">
      <div style="font-size:12px;color:var(--t2);line-height:1.7">${angles[c.type]||angles.prospect}</div>
      <div class="bgrid">
        <button class="btn p" onclick="openClaude('Draft outreach email to ${esc(name)} for onAudience — value-led and curiosity variants')">Draft email ↗</button>
        <button class="btn" onclick="openClaude('Draft LinkedIn InMail for ${esc(name)} — short, personalized for data partnership')">LinkedIn msg ↗</button>
        <button class="btn" onclick="openClaude('Find companies similar to ${esc(name)} for onAudience programmatic outreach — top 10 by ICP fit with reasons')">Find similar ↗</button>
        <button class="btn" onclick="openClaude('Check Gmail for any prior contact with ${esc(name)} — summarize relationship history')">Gmail history ↗</button>
        <button class="btn" onclick="openClaude('Research ${esc(name)} tech stack — DSPs, DMPs, data marketplaces, BuiltWith signals, job listings. What is the easiest activation path for onAudience?')">Tech stack ↗</button>
        <button class="btn" onclick="openClaude('Find recent news, LinkedIn posts, press releases about ${esc(name)} in last 90 days — hiring signals, product launches, partnership announcements, funding')">Recent news ↗</button>
      </div>
    </div>
  </div>

  <div class="ps">
    <div class="ph" onclick="togglePs(this)">
      <span>👤</span><span class="pl">Contacts</span><span class="pct">${coCts.length}</span>
      <button class="btn sm" style="margin-left:auto" onclick="event.stopPropagation();openClaude('Find Head of Programmatic or Data Partnerships at ${esc(name)} — LinkedIn, email, background, recent activity')">Find contacts ↗</button>
      <span class="chev open">▾</span>
    </div>
    <div class="pb">${ctH}</div>
  </div>

  <div class="ps">
    <div class="ph" onclick="togglePs(this)"><span>⚡</span><span class="pl">Contact Activity Feed</span><span class="pct">${ctAct.length}</span><span class="chev open">▾</span></div>
    <div class="pb">${actH}</div>
  </div>

  <div class="ps">
    <div class="ph" onclick="togglePs(this)"><span>🎯</span><span class="pl">Discovery Actions</span><span class="chev open">▾</span></div>
    <div class="pb">
      <div class="bgrid">
        <button class="btn" style="height:auto;padding:8px 10px;text-align:left;text-transform:none;font-size:11px;letter-spacing:0" onclick="openClaude('Find all known clients, case studies, and partnerships of ${esc(name)} — compile a full client registry with campaign types, platforms used, and results')"><div style="font-family:'IBM Plex Mono',monospace;font-size:8px;color:var(--t3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px">Client Registry</div>Research their clients &amp; case studies</button>
        <button class="btn" style="height:auto;padding:8px 10px;text-align:left;text-transform:none;font-size:11px;letter-spacing:0" onclick="openClaude('Research ${esc(name)} job listings — find programmatic, data, or partnerships roles that signal stack or buying intent. Which DSPs, DMPs, or data tools are mentioned?')"><div style="font-family:'IBM Plex Mono',monospace;font-size:8px;color:var(--t3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px">Hiring Signals</div>Scan job listings for stack clues</button>
        <button class="btn" style="height:auto;padding:8px 10px;text-align:left;text-transform:none;font-size:11px;letter-spacing:0" onclick="openClaude('Find people who recently joined ${esc(name)} in last 90 days in programmatic, data, or partnerships roles — new hires often build new vendor relationships')"><div style="font-family:'IBM Plex Mono',monospace;font-size:8px;color:var(--t3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px">New Hires</div>Recent joiners building their stack</button>
        <button class="btn" style="height:auto;padding:8px 10px;text-align:left;text-transform:none;font-size:11px;letter-spacing:0" onclick="openClaude('Find recent funding, M&A, or major announcements about ${esc(name)} in 2025–2026 — are they in growth mode? Any signal to time our outreach?')"><div style="font-family:'IBM Plex Mono',monospace;font-size:8px;color:var(--t3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px">Funding / M&amp;A</div>Growth signals &amp; timing triggers</button>
      </div>
    </div>
  </div>

  </div>`;
}

function closeCo(){selCo=null;document.getElementById('es').style.display='grid';document.getElementById('dp').style.display='none';renderCo()}

function togglePs(hdr){
  const body=hdr.nextElementSibling;
  const chev=hdr.querySelector('.chev');
  if(!body)return;
  const h=body.classList.toggle('hide');
  if(chev)chev.classList.toggle('open',!h);
}

// ── DRAWER ───────────────────────────────────────────────
function openDw(id){
  selCt=id;const c=contacts.find(x=>x.id===id);if(!c)return;renderCt();
  document.getElementById('dwh').innerHTML=`
    <div class="dav">${ini(c.full_name)}</div>
    <div class="dinf"><div class="dnm">${c.full_name}</div><div class="drl">${c.title} · ${c.company_name}</div></div>
    <button class="btn sm" onclick="closeDw()">✕</button>`;
  const actH=(c.activity||[]).length?(c.activity||[]).map(a=>{
    const tH=(a.tags||[]).map(t=>`<span class="ftag${t==='hot'?' hot':t==='signal'?' sig':''}">${t==='hot'?'🔥':t==='signal'?'📡':t}</span>`).join('');
    return`<div class="fi"><div class="fib"><div class="fit">${pico(a.platform)} ${a.text}</div><div class="fim">${a.date} ${tH}</div></div></div>`;
  }).join(''):`<div style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--t3)">No activity tracked yet</div>`;
  document.getElementById('dwb').innerHTML=`
    <div class="ps" style="margin-bottom:8px">
      <div class="ph" onclick="togglePs(this)"><span>📋</span><span class="pl">Contact Details</span><span class="chev open">▾</span></div>
      <div class="pb"><table class="inf">
        ${c.email?`<tr><td>Email</td><td><a class="ml" href="mailto:${c.email}">${c.email}</a></td></tr>`:''}
        ${c.linkedin_url?`<tr><td>LinkedIn</td><td><a class="ml" href="${c.linkedin_url}" target="_blank">Profile ↗</a></td></tr>`:''}
        ${c.twitter?`<tr><td>Twitter / X</td><td><a class="ml" href="https://twitter.com/${c.twitter}" target="_blank">${c.twitter}</a></td></tr>`:''}
        <tr><td>Company</td><td>${c.company_name}</td></tr>
        ${c.notes?`<tr><td>Notes</td><td style="font-size:11px;color:var(--t2)">${c.notes}</td></tr>`:''}
      </table></div>
    </div>
    <div class="ps" style="margin-bottom:8px">
      <div class="ph" onclick="togglePs(this)"><span>⚡</span><span class="pl">Activity Feed</span><span class="pct">${(c.activity||[]).length}</span><span class="chev open">▾</span></div>
      <div class="pb">${actH}</div>
    </div>
    <div class="ps" style="margin-bottom:8px">
      <div class="ph" onclick="togglePs(this)"><span>⚡</span><span class="pl">Actions</span><span class="chev open">▾</span></div>
      <div class="pb"><div class="bgrid">
        <button class="btn" onclick="openClaude('Draft outreach email to ${esc(c.full_name)} at ${esc(c.company_name)} for onAudience data partnership')">Draft email ↗</button>
        <button class="btn" onclick="openClaude('Draft LinkedIn message to ${esc(c.full_name)} at ${esc(c.company_name)} — short and personalized')">LinkedIn ↗</button>
        <button class="btn" onclick="openClaude('Check Gmail for prior contact with ${esc(c.full_name)} at ${esc(c.company_name)}')">Gmail ↗</button>
        <button class="btn" onclick="openClaude('Research ${esc(c.full_name)} at ${esc(c.company_name)} — background, recent posts, interests, best outreach angle')">Research ↗</button>
      </div></div>
    </div>
    <button class="btn p" style="width:100%" onclick="openClaude('Full contact report for ${esc(c.full_name)} at ${esc(c.company_name)} — background, social activity, email draft, outreach angle')">Full contact report in Claude ↗</button>`;
  document.getElementById('dw').classList.add('open');
  document.getElementById('dov').classList.add('vis');
}
function closeDw(){document.getElementById('dw').classList.remove('open');document.getElementById('dov').classList.remove('vis');selCt=null;renderCt()}

// ── CTX MENU ─────────────────────────────────────────────
function showCtx(e,enc,type){
  e.preventDefault();e.stopPropagation();
  const name=decodeURIComponent(enc);
  const menu=document.getElementById('ctx');
  const items=[
    {ic:'🔍',tx:'Full contact report',pr:`Research ${name} — full contact report: decision makers, tech stack, activation path, outreach angle, ICP fit for onAudience`},
    {ic:'👤',tx:'Find decision makers',pr:`Find Head of Programmatic or Data Partnerships at ${name} — LinkedIn, email, background, recent activity`},
    {ic:'✉',tx:'Draft outreach email',pr:`Draft personalized outreach email to ${name} — value-led and curiosity variants for onAudience data partnership`},
    {ic:'💬',tx:'LinkedIn message',pr:`Draft LinkedIn connection note and InMail for ${name} — short, personalized for data partnership`},
    {ic:'🔗',tx:'Find similar',pr:`Find companies similar to ${name} for onAudience programmatic data outreach — top 10 ranked by ICP fit`},
    {ic:'📧',tx:'Gmail history',pr:`Check Gmail for any previous contact with ${name} — summarize relationship history and prior deals`},
    {ic:'🔧',tx:'Tech stack & signals',pr:`Research ${name} tech stack — DSPs, DMPs, data marketplaces, BuiltWith data, job listing signals. Fastest activation path for onAudience?`},
    {ic:'📰',tx:'Recent news & posts',pr:`Find recent news, LinkedIn posts, press releases about ${name} in last 90 days — hiring, product launches, partnerships, funding`},
  ];
  if(type==='nogo')items.push({ic:'⚠',tx:'Why no outreach?',pr:`Explain why ${name} is marked no-outreach in onAudience database and what happened`});
  if(type==='prospect')items.push({ic:'🚀',tx:'Prioritize this week',pr:`Build prioritization case for reaching out to ${name} this week — ICP fit, timing signals, best outreach angle`});
  menu.innerHTML=`<div class="ctx-l">${name}</div><div class="ctx-s"></div>`+items.map((it,i)=>`<div class="ctx-i" data-i="${i}"><span class="ctx-ic">${it.ic}</span>${it.tx}</div>`).join('');
  menu.querySelectorAll('.ctx-i').forEach((el,i)=>{el.addEventListener('click',()=>{menu.style.display='none';openClaude(items[i].pr)})});
  const x=Math.min(e.clientX,window.innerWidth-240),y=Math.min(e.clientY,window.innerHeight-340);
  menu.style.left=x+'px';menu.style.top=y+'px';menu.style.display='block';
}
document.addEventListener('click',()=>document.getElementById('ctx').style.display='none');

// ── MODAL ────────────────────────────────────────────────
const MODS={
  research:{title:'Research a company',desc:'Enter company name to generate a full contact report with decision makers, tech stack, and outreach angle.',ph:'e.g. Madhive',tpl:'Research [COMPANY] — full contact report: decision makers, tech stack, activation path, outreach angle, ICP fit for onAudience data partnership'},
  discover:{title:'Find new prospects',desc:'Describe what you need — industry, region, size, tech stack, or a reference company for lookalike discovery.',ph:'e.g. "DSPs in EMEA with TTD integration, 50–500 employees" or "similar to Madhive"',tpl:'Find new prospects for onAudience data partnerships matching: [COMPANY]. Use Crunchbase, LinkedIn, conference exhibitor lists, and programmatic ecosystem signals. Rank by ICP fit.'},
  similar:{title:'Find similar companies',desc:'Enter a reference company — find lookalikes by vertical, tech stack, and ICP fit.',ph:'e.g. Datonics',tpl:'Find companies similar to [COMPANY] for onAudience programmatic data outreach — top 10 ranked by ICP fit, with reason for each'},
  outreach:{title:'Draft outreach',desc:'Enter contact name & company to draft personalized email and LinkedIn message.',ph:'e.g. John Smith at Madhive',tpl:'Draft personalized outreach for [COMPANY] — email and LinkedIn message, value-led and curiosity variants, tailored to role and recent company signals'},
};
function openModal(mode){
  _mMode=mode;const cfg=MODS[mode]||MODS.research;_mTpl=cfg.tpl;
  document.getElementById('mt').textContent=cfg.title;
  document.getElementById('md').textContent=cfg.desc;
  document.getElementById('mi').placeholder=cfg.ph;
  document.getElementById('mi').value='';
  document.getElementById('ov').classList.add('vis');
  setTimeout(()=>document.getElementById('mi').focus(),60);
}
function closeModal(){document.getElementById('ov').classList.remove('vis')}
function submitModal(){const v=document.getElementById('mi').value.trim();if(!v)return;closeModal();openClaude(_mTpl.replace('[COMPANY]',v))}
function doResearch(){const q=document.getElementById('coQ').value.trim();if(q)openClaude(`Research ${q} — full contact report: decision makers, tech stack, activation path, outreach angle, ICP fit for onAudience data partnership`);else openModal('research')}

// ── KEYBOARD ─────────────────────────────────────────────
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeDw();document.getElementById('ctx').style.display='none'}});
document.addEventListener('DOMContentLoaded',()=>{
  const mi=document.getElementById('mi');
  if(mi)mi.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submitModal()}});
});

// ── BOOT ─────────────────────────────────────────────────
oaDB.load();
