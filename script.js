// Super Cayden Heavy - client-only GitHub Pages chatbot
const current = getApiKey();
const key = prompt('Paste your OpenAI API key (it will be stored only in this browser session):', current || '');
if(key){ setApiKey(key.trim()); alert('API key saved for this session.'); }
});


sendBtn.addEventListener('click', sendMessage);
clearBtn.addEventListener('click', ()=>{ inputEl.value=''; });


function addMessage(role, text){
const d = document.createElement('div');
d.className = 'msg ' + (role === 'user' ? 'user' : 'bot');
d.innerHTML = `<div>${escapeHtml(text)}</div>`;
chatEl.appendChild(d);
chatEl.scrollTop = chatEl.scrollHeight;
}


function escapeHtml(s){
return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}


async function sendMessage(){
const text = inputEl.value.trim();
if(!text) return;
addMessage('user', text);
inputEl.value = '';


const key = getApiKey();
if(!key){
alert('No API key set. Click "Set API Key" and paste a valid OpenAI API key (session only).');
return;
}


const model = modelSelect.value;


// show optimistic loading message
const loadingNode = document.createElement('div');
loadingNode.className = 'msg bot';
loadingNode.textContent = 'Super Cayden Heavy is thinking...';
chatEl.appendChild(loadingNode);
chatEl.scrollTop = chatEl.scrollHeight;


try{
const resp = await fetch('https://api.openai.com/v1/chat/completions', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${key}`
},
body: JSON.stringif
