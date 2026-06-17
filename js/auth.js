function setMessage(element, text, success = false) {
    if (!element) return;
    element.textContent = text;
    element.classList.toggle('success', success);
}

function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setupLogin() {
    // Valida credenciais salvas no LocalStorage e cria a sessão por usuário.
    const form = document.querySelector('#loginForm');
    if (!form) return;

    form.addEventListener('submit', event => {
        event.preventDefault();
        const email = document.querySelector('#loginEmail').value.trim().toLowerCase();
        const password = document.querySelector('#loginPassword').value.trim();
        const message = document.querySelector('#loginMessage');

        if (!validEmail(email) || !password) {
            setMessage(message, 'Informe um e-mail válido e a senha.');
            return;
        }

        const user = getUsers().find(item => item.email === email && item.senha === password);
        if (!user) {
            setMessage(message, 'E-mail ou senha inválidos.');
            return;
        }

        setUsuarioLogado(user);
        migrateAutomaticDataToAdmin();
        window.location.href = 'dashboard.html';
    });
}

function setupRegister() {
    // Cadastra novos usuários sem backend, mantendo tudo no navegador.
    const form = document.querySelector('#registerForm');
    if (!form) return;

    form.addEventListener('submit', event => {
        event.preventDefault();
        const name = document.querySelector('#registerName').value.trim();
        const email = document.querySelector('#registerEmail').value.trim().toLowerCase();
        const password = document.querySelector('#registerPassword').value.trim();
        const confirmPassword = document.querySelector('#confirmPassword').value.trim();
        const message = document.querySelector('#registerMessage');

        if (name.length < 3) {
            setMessage(message, 'Informe um nome com pelo menos 3 caracteres.');
            return;
        }

        if (!validEmail(email)) {
            setMessage(message, 'Informe um e-mail válido.');
            return;
        }

        if (password.length < 6) {
            setMessage(message, 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            setMessage(message, 'As senhas não conferem.');
            return;
        }

        const users = getUsers();
        if (users.some(user => user.email === email)) {
            setMessage(message, 'Este e-mail já está cadastrado.');
            return;
        }

        users.push(normalizeUser({
            id: createUserId(),
            nome: name,
            email,
            senha: password
        }));
        saveUsers(users);
        setMessage(message, 'Cadastro realizado com sucesso. Redirecionando...', true);

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 900);
    });
}

ensureDefaultUser();
migrateAutomaticDataToAdmin();
setupLogin();
setupRegister();
