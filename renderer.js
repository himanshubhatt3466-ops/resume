const $ = id => document.getElementById(id);
const fieldIds = ['resumeName','fullName','jobTitle','email','phone','city','website','summary','experience','education','skills','projects','extras'];
const colors = ['#315efb','#147d92','#6236a8','#b45309','#0f766e','#be3455','#334155','#2563eb','#7c3aed','#0f766e','#1d4ed8','#9f1239'];
const styles = ['Professional','Modern','Fresher','Creative','Simple','Corporate'];
const names = ['Executive','Classic','Elegant','Minimal','Bold','Clean','Studio','Impact','Prime','Horizon','Apex','Focus','Summit','Urban','Essential','Signature','Career','Clarity','Prestige','Next'];
const templates = Array.from({length:120}, (_,i)=>({
 id:i+1, name:`${names[i%names.length]} ${styles[Math.floor(i/20)] || styles[i%6]}`,
 category:styles[Math.floor(i/20)%styles.length], color:colors[i%colors.length], variant:(i%10)+1
}));
let selectedTemplate=templates[0], activeFilter='All', photoData='', currentId=null, toastTimer;
const translations = {
 en:{editor:'Resume Editor',templates:'Templates',saved:'My Resumes',offline:'Works offline. Your data stays on this PC.',workspace:'WORKSPACE',details:'Your details',detailsSub:'You can leave any optional field blank.',resumeName:'Resume name (for your saved list)',personal:'PERSONAL INFORMATION',fullName:'Full name',jobTitle:'Job title',phone:'Phone',city:'City / Address',photo:'Profile photo (optional)',profile:'PROFILE',summary:'Career objective / summary',experience:'EXPERIENCE',experienceLabel:'Experience (one item per line)',education:'EDUCATION',educationLabel:'Education (one item per line)',skills:'SKILLS',skillsLabel:'Skills (comma-separated)',projects:'PROJECTS',projectsLabel:'Projects (one item per line)',extras:'LANGUAGES & CERTIFICATES',languagesLabel:'Languages / certificates / achievements',livePreview:'Live preview',previewSub:'Changes appear instantly',private:'Private on this device',savedTitle:'My saved resumes',savedSub:'Resume files are saved on this computer only.'},
 hi:{editor:'रिज़्यूमे एडिटर',templates:'टेम्पलेट',saved:'मेरे रिज़्यूमे',offline:'ऑफ़लाइन चलता है। आपका डेटा इसी PC पर रहता है।',workspace:'वर्कस्पेस',details:'अपनी जानकारी भरें',detailsSub:'ज़रूरी नहीं वाले फ़ील्ड खाली छोड़ सकते हैं।',resumeName:'रिज़्यूमे का नाम',personal:'व्यक्तिगत जानकारी',fullName:'पूरा नाम',jobTitle:'नौकरी का पद',phone:'फ़ोन',city:'शहर / पता',photo:'प्रोफ़ाइल फ़ोटो (वैकल्पिक)',profile:'प्रोफ़ाइल',summary:'करियर उद्देश्य / परिचय',experience:'अनुभव',experienceLabel:'अनुभव (हर लाइन में एक)',education:'शिक्षा',educationLabel:'शिक्षा (हर लाइन में एक)',skills:'कौशल',skillsLabel:'कौशल (कॉमा से अलग करें)',projects:'प्रोजेक्ट',projectsLabel:'प्रोजेक्ट (हर लाइन में एक)',extras:'भाषाएँ और प्रमाणपत्र',languagesLabel:'भाषाएँ / प्रमाणपत्र / उपलब्धियाँ',livePreview:'लाइव प्रीव्यू',previewSub:'बदलाव तुरंत दिखेंगे',private:'इस डिवाइस पर निजी',savedTitle:'मेरे सेव किए रिज़्यूमे',savedSub:'रिज़्यूमे केवल इसी कंप्यूटर पर सेव होते हैं।'}
};
function t(key){return (translations[$('languageSelect').value]||translations.en)[key]||key}
function escapeHtml(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function val(id){return $(id).value.trim()}
function getData(){const d={};fieldIds.forEach(id=>d[id]=$(id).value);d.photoData=photoData;d.templateId=selectedTemplate.id;return d}
function setData(d={}){fieldIds.forEach(id=>$(id).value=d[id]||'');photoData=d.photoData||'';selectedTemplate=templates.find(x=>x.id===Number(d.templateId))||templates[0];currentId=d.id||null;renderPreview();renderTemplates();$('resumeName').value=d.resumeName||''}
function section(title,body){if(!body)return '';return `<section class="resume-section"><h3>${escapeHtml(title)}</h3>${body}</section>`}
function lines(text){return String(text||'').split('\n').map(x=>x.trim()).filter(Boolean)}
function renderPreview(){
 const d=getData(), accent=selectedTemplate.color, soft=accent+'18';
 const contact=[d.email,d.phone,d.city,d.website].filter(Boolean).map(escapeHtml).join(' &nbsp;•&nbsp; ');
 const photo=d.photoData?`<img class="resume-photo" src="${d.photoData}">`:'';
 const skills=lines(d.skills.replace(/,/g,'\n')).map(x=>`<span class="skill-chip">${escapeHtml(x)}</span>`).join('');
 const exp=lines(d.experience).map(x=>`<li>${escapeHtml(x)}</li>`).join('');
 const edu=lines(d.education).map(x=>`<li>${escapeHtml(x)}</li>`).join('');
 const proj=lines(d.projects).map(x=>`<li>${escapeHtml(x)}</li>`).join('');
 const extras=lines(d.extras).map(x=>`<li>${escapeHtml(x)}</li>`).join('');
 const fallbackName=$('languageSelect').value==='hi'?'आपका नाम':'Your Name';
 $('resumePreview').className=`resume-paper template-${selectedTemplate.variant}`;
 $('resumePreview').style.setProperty('--accent',accent);$('resumePreview').style.setProperty('--soft',soft);$('resumePreview').style.setProperty('--dark','#172033');
 $('resumePreview').innerHTML=`<header class="resume-head">${photo}<div><h2>${escapeHtml(d.fullName||fallbackName)}</h2><div class="job">${escapeHtml(d.jobTitle||'Professional Title')}</div><div class="contact">${contact||'email@example.com • +91 00000 00000'}</div></div></header>
 ${section('PROFILE',`<p>${escapeHtml(d.summary||'Add a short professional summary or career objective to introduce yourself.')}</p>`)}
 ${section('EXPERIENCE',exp?`<ul>${exp}</ul>`:'<p>Add your work experience, internship, or volunteering here.</p>')}
 ${section('EDUCATION',edu?`<ul>${edu}</ul>`:'<p>Add your education, school, board, year, and result.</p>')}
 ${section('SKILLS',`<div class="skill-list">${skills||'<span class="skill-chip">Your skill</span><span class="skill-chip">Communication</span>'}</div>`)}
 ${section('PROJECTS',proj?`<ul>${proj}</ul>`:'<p>Add personal, college, or school projects.</p>')}
 ${section('LANGUAGES & CERTIFICATES',extras?`<ul>${extras}</ul>`:'')}
 <div style="margin-top:28px;font-size:8px;color:#9aa3b2;text-align:right">Created with Resume Maker Pro</div>`;
}
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2400)}
function switchTab(tab){document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));['editor','templates','saved'].forEach(v=>$(v+'View').classList.toggle('hidden',v!==tab));$('pageTitle').textContent=tab==='editor'?'Build your resume':tab==='templates'?'Choose a template':'Your saved resumes';$('pageSubtitle').textContent=tab==='editor'?'Fill in your details and watch your resume update live.':tab==='templates'?'Pick from 120 editable template designs.':'Open a saved resume to continue editing.';if(tab==='saved')renderSaved();if(tab==='templates')renderTemplates()}
function renderTemplates(){
 const query=($('templateSearch').value||'').toLowerCase();
 const filtered=templates.filter(x=>(activeFilter==='All'||x.category===activeFilter)&&(x.name+' '+x.category+' '+x.id).toLowerCase().includes(query));
 $('templateGrid').innerHTML=filtered.map(x=>`<article class="template-card ${x.id===selectedTemplate.id?'selected':''}" data-id="${x.id}"><div class="template-thumb" style="--tc:${x.color}"><div class="thumb-band"></div><div class="thumb-title"></div><div class="thumb-line"></div><div class="thumb-line short"></div><div class="thumb-block"></div><div class="thumb-line"></div><div class="thumb-line short"></div><div class="thumb-block"></div></div><h3>${escapeHtml(x.name)}</h3><p>${x.category} · Template ${String(x.id).padStart(3,'0')}</p><div class="pick">${x.id===selectedTemplate.id?'✓ Selected':'Use this template →'}</div></article>`).join('')||'<p>No templates found. Try another search.</p>';
 $('templateGrid').querySelectorAll('.template-card').forEach(card=>card.addEventListener('click',()=>{selectedTemplate=templates.find(x=>x.id===Number(card.dataset.id));renderPreview();renderTemplates();toast('Template applied!');}));
}
function savedItems(){try{return JSON.parse(localStorage.getItem('rmp-resumes')||'[]')}catch{return []}}
function saveCurrent(){const d=getData();if(!d.fullName.trim()){toast('Please enter your full name first.');$('fullName').focus();return}const all=savedItems();d.id=currentId||Date.now();d.resumeName=d.resumeName.trim()||`${d.fullName} Resume`;d.updatedAt=new Date().toISOString();const idx=all.findIndex(x=>x.id===d.id);if(idx>=0)all[idx]=d;else all.unshift(d);localStorage.setItem('rmp-resumes',JSON.stringify(all));currentId=d.id;$('resumeName').value=d.resumeName;toast('Resume saved on this PC.');renderSaved()}
function renderSaved(){const all=savedItems();$('savedList').innerHTML=all.length?all.map(d=>`<article class="saved-card"><div class="saved-icon">▤</div><div class="saved-info"><strong>${escapeHtml(d.resumeName||d.fullName||'Untitled Resume')}</strong><span>${escapeHtml(d.fullName||'No name')} · Updated ${new Date(d.updatedAt||Date.now()).toLocaleDateString()}</span></div><div class="saved-actions"><button class="btn btn-light" data-open="${d.id}">Edit</button><button class="btn btn-light" data-export="${d.id}">PDF</button><button class="btn btn-light" data-delete="${d.id}">Delete</button></div></article>`).join(''):'<div class="empty-state"><strong>No saved resumes yet</strong>Create a resume and click “Save Resume”. It will appear here.</div>';
 $('savedList').querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{const d=savedItems().find(x=>x.id===Number(b.dataset.open));if(d){setData(d);switchTab('editor')}});
 $('savedList').querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{if(confirm('Delete this saved resume?')){localStorage.setItem('rmp-resumes',JSON.stringify(savedItems().filter(x=>x.id!==Number(b.dataset.delete))));renderSaved();toast('Resume deleted.')}});
 $('savedList').querySelectorAll('[data-export]').forEach(b=>b.onclick=async()=>{const d=savedItems().find(x=>x.id===Number(b.dataset.export));if(d){const backup=getData();setData(d);await exportPdf();setData(backup)}});
}
function newResume(){if(confirm('Start a new resume? Save your current work first if needed.')){fieldIds.forEach(id=>$(id).value='');photoData='';currentId=null;selectedTemplate=templates[0];$('photo').value='';renderPreview();switchTab('editor')}}
function exportHtml(){const paper=$('resumePreview').cloneNode(true);const css=`<style>body{margin:0;padding:24px;font-family:Arial,sans-serif;color:#273247}*{box-sizing:border-box}.resume-paper{background:white;max-width:100%;min-height:0;padding:28px 34px;color:#273247;overflow-wrap:anywhere}.resume-head{display:flex;gap:18px;align-items:center;border-bottom:2px solid var(--accent,#315efb);padding-bottom:20px;margin-bottom:21px}.resume-head h2{font-size:25px;margin:0 0 7px;color:#1b2740}.job{color:var(--accent,#315efb);font-size:12px;font-weight:bold;margin-bottom:9px}.contact{font-size:9px;color:#667085;line-height:1.8}.resume-photo{width:78px;height:88px;object-fit:cover;border-radius:8px}.resume-section{margin:0 0 19px;break-inside:avoid}.resume-section h3{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--accent,#315efb);border-bottom:1px solid #e7eaf0;padding-bottom:7px;margin:0 0 9px}.resume-section p,.resume-section li{font-size:10px;line-height:1.65;margin:0 0 5px;color:#4b5567;white-space:pre-line}.resume-section ul{margin:0;padding-left:16px}.skill-list{display:flex;flex-wrap:wrap;gap:6px}.skill-chip{background:var(--soft,#eef2ff);color:var(--accent,#315efb);padding:5px 8px;border-radius:4px;font-size:9px;font-weight:bold}.template-2 .resume-head,.template-7 .resume-head{background:#f1f4fa;padding:18px;margin:-28px -34px 22px}.template-3 .resume-head{flex-direction:column;align-items:flex-start}.template-4 .resume-head{border-bottom:4px double var(--accent)}.template-5 .resume-head h2{font-family:Georgia,serif}.template-6 .resume-head{border-left:5px solid var(--accent);padding-left:15px}.template-8 .resume-head{border-bottom:1px dashed var(--accent)}.template-9 .resume-section h3{background:var(--soft);padding:7px}.template-10 .resume-photo{border-radius:50%}@page{size:A4;margin:12mm}</style>`;
 return `<!doctype html><html><head><meta charset="utf-8">${css}</head><body>${paper.outerHTML}</body></html>`;
}
async function exportPdf(){try{if(window.resumeApp?.exportPdf){const result=await window.resumeApp.exportPdf(exportHtml());if(!result.canceled)toast('PDF exported successfully!')}else{const w=window.open('','_blank');w.document.write(exportHtml());w.document.close();w.print()}}catch(e){toast('Could not export PDF: '+e.message)}}
document.querySelectorAll('.nav-item').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));
fieldIds.forEach(id=>$(id).addEventListener('input',renderPreview));
$('photo').addEventListener('change',e=>{const file=e.target.files[0];if(!file)return;if(file.size>2*1024*1024){toast('Please use a photo smaller than 2 MB.');e.target.value='';return}const reader=new FileReader();reader.onload=()=>{photoData=reader.result;renderPreview()};reader.readAsDataURL(file)});
$('saveBtn').addEventListener('click',saveCurrent);$('exportBtn').addEventListener('click',exportPdf);$('newResumeBtn').addEventListener('click',newResume);$('newFromSaved').addEventListener('click',newResume);$('chooseTemplateBtn').addEventListener('click',()=>switchTab('templates'));$('templateSearch').addEventListener('input',renderTemplates);
$('templateFilters').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.filter;$('templateFilters').querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));renderTemplates()}));
$('languageSelect').addEventListener('change',()=>{document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));renderPreview()});
function init(){renderPreview();renderTemplates();renderSaved();const existing=savedItems();if(existing.length){/* keep the editor clean for a new resume */}}
init();
