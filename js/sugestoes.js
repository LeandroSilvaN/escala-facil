emailjs.init({
    publicKey: 'LXU6_7dFI0R1xaY2o'
});

function renderSuggestions() {
    const list = document.querySelector('#suggestionList');
    if (!list) return;

    const suggestions = EscalaFacil.suggestions();
    if (!suggestions.length) {
        list.innerHTML = '<div class="empty-state">Nenhuma sugestão registrada.</div>';
        return;
    }

    list.innerHTML = suggestions.slice().reverse().map(suggestion => `
        <article class="suggestion-card">
            <header>
                <div>
                    <strong>${suggestion.name}</strong>
                    <span class="muted">${new Date(suggestion.createdAt).toLocaleString('pt-BR')}</span>
                </div>
                <button class="btn btn-danger" type="button" onclick="deleteSuggestion('${suggestion.id}')"><i class="fa-solid fa-trash"></i></button>
            </header>
            <p>${suggestion.text}</p>
        </article>
    `).join('');
}

function deleteSuggestion(id) {
    const suggestions = EscalaFacil.suggestions().filter(suggestion => suggestion.id !== id);
    saveUserData(RESOURCE_KEYS.sugestoes, suggestions);
    refreshAll();
}

function setupSuggestions() {
    // Caixa simples de sugestões para registrar feedback da equipe.
    const form = document.querySelector('#suggestionForm');
    if (!form) return;

    form.addEventListener('submit', event => {
        event.preventDefault();
        const name = document.querySelector('#suggestionName').value.trim();
        const text = document.querySelector('#suggestionText').value.trim();
        const message = document.querySelector('#suggestionMessage');

        if (name.length < 3 || text.length < 8) {
            message.textContent = 'Informe nome e sugestão com detalhes suficientes.';
            message.classList.remove('success');
            return;
        }

        const suggestions = EscalaFacil.suggestions();
        suggestions.push({
            id: crypto.randomUUID(),
            name,
            text,
            createdAt: new Date().toISOString()
        });
        
        saveUserData(RESOURCE_KEYS.sugestoes, suggestions);

emailjs.send(
    'service_9aggbyg',
    'template_gni9i6b',
    {
        name: name,
        message: text,
        date: new Date().toLocaleString('pt-BR')
    }
)
.then(() => {

    form.reset();

    message.textContent = 'Sugestão enviada com sucesso.';
    message.classList.add('success');

    refreshAll();

})
.catch(error => {

    console.error(error);

    message.textContent = 'Erro ao enviar a sugestão.';
});
    });
}

window.renderSuggestions = renderSuggestions;
window.deleteSuggestion = deleteSuggestion;
document.addEventListener('DOMContentLoaded', setupSuggestions);
