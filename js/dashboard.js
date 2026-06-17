const EscalaFacil = {
    availability: [
        'Segunda Manhã', 'Segunda Tarde', 'Segunda Noite',
        'Terça Manhã', 'Terça Tarde', 'Terça Noite',
        'Quarta Manhã', 'Quarta Tarde', 'Quarta Noite',
        'Quinta Manhã', 'Quinta Tarde', 'Quinta Noite',
        'Sexta Manhã', 'Sexta Tarde', 'Sexta Noite'
    ],
    employees() {
        return getUserData(RESOURCE_KEYS.funcionarios);
    },
    schedules() {
        return getUserData(RESOURCE_KEYS.escalas);
    },
    history() {
        return getUserData(RESOURCE_KEYS.historico);
    },
    suggestions() {
        return getUserData(RESOURCE_KEYS.sugestoes);
    },
    session() {
        return getUsuarioLogado();
    }
};

function ensureAuthenticated() {
    const session = getUsuarioLogado();
    if (!session) {
        window.location.href = 'login.html';
        return null;
    }
    return session;
}

function ensureSeedData() {
    // Dados iniciais deixam matriz, grafo e escala prontos para demonstração.
    const session = getUsuarioLogado();
    if (!session) return;

    const isAdmin = session.email === STORAGE_CONFIG.adminEmail;
    if (!hasUserData(RESOURCE_KEYS.funcionarios)) {
        saveUserData(RESOURCE_KEYS.funcionarios, isAdmin ? [
            {
                id: crypto.randomUUID(),
                name: 'João Almeida',
                role: 'Atendente',
                availability: ['Segunda Manhã', 'Terça Tarde', 'Quarta Manhã', 'Sexta Tarde']
            },
            {
                id: crypto.randomUUID(),
                name: 'Maria Santos',
                role: 'Supervisora',
                availability: ['Segunda Manhã', 'Terça Noite', 'Quinta Tarde', 'Sexta Noite']
            },
            {
                id: crypto.randomUUID(),
                name: 'Pedro Costa',
                role: 'Analista',
                availability: ['Segunda Tarde', 'Quarta Manhã', 'Quinta Noite']
            },
            {
                id: crypto.randomUUID(),
                name: 'Ana Ribeiro',
                role: 'Recepcionista',
                availability: ['Terça Tarde', 'Quarta Noite', 'Quinta Tarde', 'Sexta Manhã']
            }
        ] : []);
    }

    if (!hasUserData(RESOURCE_KEYS.escalas)) {
        saveUserData(RESOURCE_KEYS.escalas, []);
    }

    if (!hasUserData(RESOURCE_KEYS.historico)) {
        saveUserData(RESOURCE_KEYS.historico, []);
    }

    if (!hasUserData(RESOURCE_KEYS.sugestoes)) {
        saveUserData(RESOURCE_KEYS.sugestoes, isAdmin ? [
            {
                id: crypto.randomUUID(),
                name: 'Coordenação',
                text: 'Incluir exportação da escala em PDF em uma versão futura.',
                createdAt: new Date().toISOString()
            }
        ] : []);
    }
}

function compatible(employeeA, employeeB) {
    return employeeA.availability.some(slot => employeeB.availability.includes(slot));
}

function buildMatrix(employees = EscalaFacil.employees()) {
    // A matriz usa 1 quando dois funcionários compartilham algum horário.
    return employees.map((employeeA, rowIndex) => employees.map((employeeB, columnIndex) => {
        if (rowIndex === columnIndex) return 0;
        return compatible(employeeA, employeeB) ? 1 : 0;
    }));
}

function countConnections(employees = EscalaFacil.employees()) {
    // Conta apenas uma vez cada aresta do grafo não direcionado.
    const matrix = buildMatrix(employees);
    let total = 0;
    matrix.forEach((row, rowIndex) => {
        row.forEach((value, columnIndex) => {
            if (columnIndex > rowIndex && value === 1) total += 1;
        });
    });
    return total;
}

function updateDashboardStats() {
    const employees = EscalaFacil.employees();
    const schedules = EscalaFacil.schedules();
    const suggestions = EscalaFacil.suggestions();

    document.querySelector('#statEmployees').textContent = employees.length;
    document.querySelector('#statSchedules').textContent = schedules.length;
    document.querySelector('#statSuggestions').textContent = suggestions.length;
    document.querySelector('#statConnections').textContent = countConnections(employees);
}

function renderHistory() {
    const table = document.querySelector('#historyTable');
    if (!table) return;

    const history = EscalaFacil.history();
    if (!history.length) {
        table.innerHTML = '<tr><td colspan="3"><div class="empty-state">Nenhuma escala gerada até o momento.</div></td></tr>';
        return;
    }

    table.innerHTML = history.slice().reverse().map(schedule => `
        <tr>
            <td>${new Date(schedule.createdAt).toLocaleString('pt-BR')}</td>
            <td>${schedule.employeeNames.join(', ')}</td>
            <td>${schedule.connections}</td>
        </tr>
    `).join('');
}

function activateSection(hash) {
    const target = hash || '#inicio';
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.toggle('active', `#${section.id}` === target);
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === target);
    });
}

function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            activateSection(link.getAttribute('href'));
        });
    });

    window.addEventListener('hashchange', () => activateSection(window.location.hash));
    activateSection(window.location.hash || '#inicio');
}

function setupLogout() {
    document.querySelector('#logoutBtn').addEventListener('click', () => {
        logoutUsuario();
        window.location.href = 'login.html';
    });
}

function refreshAll() {
    updateDashboardStats();
    renderHistory();
    if (window.renderEmployees) window.renderEmployees();
    if (window.renderScheduleEmployees) window.renderScheduleEmployees();
    if (window.renderMatrix) window.renderMatrix();
    if (window.renderGraph) window.renderGraph();
    if (window.renderSuggestions) window.renderSuggestions();
}

document.addEventListener('DOMContentLoaded', () => {
    const session = ensureAuthenticated();
    if (!session) return;

    migrateAutomaticDataToAdmin();
    ensureSeedData();
    document.querySelector('#userGreeting').textContent = `Olá, ${session.nome}`;
    setupNavigation();
    setupLogout();
    document.querySelector('#refreshStats').addEventListener('click', refreshAll);
    refreshAll();
});

const menuToggle = document.querySelector('#menuToggle');
const sidebar = document.querySelector('.sidebar');
const menuOverlay = document.querySelector('#menuOverlay');

if (menuToggle && sidebar && menuOverlay) {

    menuToggle.addEventListener('click', () => {

        sidebar.classList.add('open');
        menuOverlay.classList.add('active');


    });

    function closeMenu() {

        sidebar.classList.remove('open');
        menuOverlay.classList.remove('active');



        const icon = menuToggle.querySelector('i');

        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }

    menuOverlay.addEventListener('click', closeMenu);

    sidebar.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}