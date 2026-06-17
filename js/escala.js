function renderScheduleEmployees() {
    const container = document.querySelector('#scheduleEmployeeList');
    if (!container) return;

    const employees = EscalaFacil.employees();
    if (!employees.length) {
        container.innerHTML = '<div class="empty-state">Cadastre funcionários antes de gerar uma escala.</div>';
        return;
    }

    container.innerHTML = employees.map(employee => `
        <label class="select-item">
            <input type="checkbox" name="scheduleEmployee" value="${employee.id}" checked>
            <span><strong>${employee.name}</strong> - ${employee.role}</span>
        </label>
    `).join('');
}

function generateSchedule() {
    // Para cada turno, escolhe o funcionário disponível com maior conectividade.
    const selectedIds = Array.from(document.querySelectorAll('input[name="scheduleEmployee"]:checked')).map(input => input.value);
    const employees = EscalaFacil.employees().filter(employee => selectedIds.includes(employee.id));
    const result = document.querySelector('#scheduleResult');
    const message = document.querySelector('#scheduleMessage');

    if (employees.length < 2) {
        message.textContent = 'Selecione pelo menos dois funcionários para calcular compatibilidades.';
        message.classList.remove('success');
        return;
    }

    const rows = EscalaFacil.availability.map(slot => {
        const available = employees.filter(employee => employee.availability.includes(slot));
        if (!available.length) return null;

        const ranked = available
            .map(employee => ({
                employee,
                score: employees.filter(other => other.id !== employee.id && compatible(employee, other)).length
            }))
            .sort((a, b) => b.score - a.score || a.employee.name.localeCompare(b.employee.name));

        return {
            slot,
            employee: ranked[0].employee,
            score: ranked[0].score
        };
    }).filter(Boolean);

    result.innerHTML = rows.map(row => `
        <tr>
            <td>${row.slot}</td>
            <td><strong>${row.employee.name}</strong><br><span class="muted">${row.employee.role}</span></td>
            <td>${row.score}</td>
        </tr>
    `).join('');

    const schedule = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        employeeNames: employees.map(employee => employee.name),
        connections: countConnections(employees),
        rows
    };
    const schedules = EscalaFacil.schedules();
    schedules.push(schedule);
    saveUserData(RESOURCE_KEYS.escalas, schedules);
    saveUserData(RESOURCE_KEYS.historico, schedules);

    message.textContent = 'Escala gerada e salva no histórico.';
    message.classList.add('success');
    refreshAll();
    result.innerHTML = rows.map(row => `
        <tr>
            <td>${row.slot}</td>
            <td><strong>${row.employee.name}</strong><br><span class="muted">${row.employee.role}</span></td>
            <td>${row.score}</td>
        </tr>
    `).join('');
}

function setupSchedule() {
    const button = document.querySelector('#generateScheduleBtn');
    if (!button) return;
    button.addEventListener('click', generateSchedule);
}

window.renderScheduleEmployees = renderScheduleEmployees;
document.addEventListener('DOMContentLoaded', setupSchedule);
