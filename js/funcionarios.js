function availabilityMarkup(selected = []) {
    return EscalaFacil.availability.map(slot => `
        <label class="check-card">
            <input type="checkbox" name="availability" value="${slot}" ${selected.includes(slot) ? 'checked' : ''}>
            <span>${slot}</span>
        </label>
    `).join('');
}

function resetEmployeeForm() {
    document.querySelector('#employeeId').value = '';
    document.querySelector('#employeeName').value = '';
    document.querySelector('#employeeRole').value = '';
    document.querySelector('#employeeFormTitle').textContent = 'Novo funcionário';
    document.querySelector('#availabilityOptions').innerHTML = availabilityMarkup();
    document.querySelector('#employeeMessage').textContent = '';
    document.querySelector('#employeeMessage').classList.remove('success');
}

function getSelectedAvailability() {
    return Array.from(document.querySelectorAll('input[name="availability"]:checked')).map(input => input.value);
}

function renderEmployees() {
    const search = (document.querySelector('#employeeSearch')?.value || '').trim().toLowerCase();
    const employees = EscalaFacil.employees().filter(employee => {
        return employee.name.toLowerCase().includes(search) || employee.role.toLowerCase().includes(search);
    });
    const table = document.querySelector('#employeeTable');
    if (!table) return;

    if (!employees.length) {
        table.innerHTML = '<tr><td colspan="4"><div class="empty-state">Nenhum funcionário encontrado.</div></td></tr>';
        return;
    }

    table.innerHTML = employees.map(employee => `
        <tr>
            <td><strong>${employee.name}</strong></td>
            <td>${employee.role}</td>
            <td><div class="tag-list">${employee.availability.map(slot => `<span class="tag">${slot}</span>`).join('')}</div></td>
            <td>
                <div class="actions">
                    <button class="btn btn-secondary" type="button" onclick="editEmployee('${employee.id}')"><i class="fa-solid fa-pen"></i>Editar</button>
                    <button class="btn btn-danger" type="button" onclick="deleteEmployee('${employee.id}')"><i class="fa-solid fa-trash"></i>Excluir</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function editEmployee(id) {
    const employee = EscalaFacil.employees().find(item => item.id === id);
    if (!employee) return;

    document.querySelector('#employeeId').value = employee.id;
    document.querySelector('#employeeName').value = employee.name;
    document.querySelector('#employeeRole').value = employee.role;
    document.querySelector('#employeeFormTitle').textContent = 'Editar funcionário';
    document.querySelector('#availabilityOptions').innerHTML = availabilityMarkup(employee.availability);
    window.location.hash = '#funcionarios';
}

function deleteEmployee(id) {
    const employees = EscalaFacil.employees().filter(employee => employee.id !== id);
    saveUserData(RESOURCE_KEYS.funcionarios, employees);
    refreshAll();
}

function setupEmployeeForm() {
    // CRUD completo de funcionários com persistência em LocalStorage.
    const form = document.querySelector('#employeeForm');
    if (!form) return;

    document.querySelector('#availabilityOptions').innerHTML = availabilityMarkup();
    document.querySelector('#employeeSearch').addEventListener('input', renderEmployees);
    document.querySelector('#cancelEmployeeEdit').addEventListener('click', resetEmployeeForm);

    form.addEventListener('submit', event => {
        event.preventDefault();
        const id = document.querySelector('#employeeId').value;
        const name = document.querySelector('#employeeName').value.trim();
        const role = document.querySelector('#employeeRole').value.trim();
        const availability = getSelectedAvailability();
        const message = document.querySelector('#employeeMessage');

        if (name.length < 3 || role.length < 2) {
            message.textContent = 'Informe nome e cargo válidos.';
            message.classList.remove('success');
            return;
        }

        if (!availability.length) {
            message.textContent = 'Selecione pelo menos uma disponibilidade.';
            message.classList.remove('success');
            return;
        }

        const employees = EscalaFacil.employees();
        const payload = { id: id || crypto.randomUUID(), name, role, availability };

        if (id) {
            const index = employees.findIndex(employee => employee.id === id);
            employees[index] = payload;
        } else {
            employees.push(payload);
        }

        saveUserData(RESOURCE_KEYS.funcionarios, employees);
        resetEmployeeForm();
        message.textContent = id ? 'Funcionário atualizado com sucesso.' : 'Funcionário cadastrado com sucesso.';
        message.classList.add('success');
        refreshAll();
    });
}

window.renderEmployees = renderEmployees;
window.editEmployee = editEmployee;
window.deleteEmployee = deleteEmployee;

document.addEventListener('DOMContentLoaded', setupEmployeeForm);
