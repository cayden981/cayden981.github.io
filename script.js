// Super Cayden Heavy - client-only GitHub Pages chatbot
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
body: JSON.stringify({
model: model,
messages: [{ role: 'user', content: text }],
max_tokens: 800,
temperature: 0.2
})
});


if(!resp.ok){
const err = await resp.text();
throw new Error('API Error: ' + err);
}


const data = await resp.json();
const reply = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || JSON.stringify(data);


// replace loading
loadingNode.remove();
addMessage('bot', reply);
}catch(err){
loadingNode.remove();
addMessage('bot', 'Error: '+err.message);
console.error(err);
}
}


// small welcome message
addMessage('bot', 'Hey — I\'m Super Cayden Heavy. Select a model, paste your OpenAI API key via "Set API Key", and ask me anything.');
