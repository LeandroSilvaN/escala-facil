function renderMatrix() {
    // Renderiza a representação tabular do grafo de compatibilidade.
    const container = document.querySelector('#matrixContainer');
    if (!container) return;

    const employees = EscalaFacil.employees(); // Retorna apenas funcionários do usuário logado.
    if (!employees.length) {
        container.innerHTML = '<div class="empty-state">Cadastre funcionários para gerar a matriz.</div>';
        return;
    }

    const matrix = buildMatrix(employees);
    container.innerHTML = `
        <table class="matrix-table">
            <thead>
                <tr>
                    <th>Funcionário</th>
                    ${employees.map((employee, index) => `<th data-col="${index}">${employee.name.split(' ')[0]}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${matrix.map((row, rowIndex) => `
                    <tr data-row="${rowIndex}">
                        <th>${employees[rowIndex].name.split(' ')[0]}</th>
                        ${row.map((value, columnIndex) => `<td class="matrix-cell ${value ? 'one' : 'zero'}" data-row="${rowIndex}" data-col="${columnIndex}">${value}</td>`).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    setupMatrixHover(container);
}

function setupMatrixHover(container) {
    const cells = container.querySelectorAll('.matrix-cell');

    cells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            const row = cell.dataset.row;
            const col = cell.dataset.col;

            container.querySelectorAll(`[data-row="${row}"]`).forEach(item => item.classList.add('is-row-highlight'));
            container.querySelectorAll(`[data-col="${col}"]`).forEach(item => item.classList.add('is-col-highlight'));
            cell.classList.add('is-cell-focus');
        });

        cell.addEventListener('mouseleave', () => {
            container.querySelectorAll('.is-row-highlight, .is-col-highlight, .is-cell-focus').forEach(item => {
                item.classList.remove('is-row-highlight', 'is-col-highlight', 'is-cell-focus');
            });
        });
    });
}

function renderGraph() {
    // Distribui os vértices em círculo e desenha arestas compatíveis em SVG.
    const svg = document.querySelector('#graphSvg');
    if (!svg) return;

    const employees = EscalaFacil.employees(); // Mantém o grafo isolado por usuário.
    if (!employees.length) {
        svg.innerHTML = '<text x="450" y="260" class="graph-label">Cadastre funcionários para visualizar o grafo</text>';
        return;
    }

    const width = 900;
    const height = 520;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(310, 120 + employees.length * 18);
    const positions = employees.map((employee, index) => {
        const angle = (Math.PI * 2 * index) / employees.length - Math.PI / 2;
        return {
            id: employee.id,
            name: employee.name,
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * Math.min(radius, 190)
        };
    });
    const matrix = buildMatrix(employees);
    let edges = '';

    matrix.forEach((row, rowIndex) => {
        row.forEach((value, columnIndex) => {
            if (columnIndex > rowIndex && value === 1) {
                const from = positions[rowIndex];
                const to = positions[columnIndex];
                edges += `<line class="graph-edge" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}"></line>`;
            }
        });
    });

    const nodes = positions.map(point => `
        <g class="graph-node-group">
            <circle class="graph-node" cx="${point.x}" cy="${point.y}" r="38"></circle>
            <text class="graph-label" x="${point.x}" y="${point.y + 6}">${point.name.split(' ')[0]}</text>
        </g>
    `).join('');

    svg.innerHTML = `${edges}${nodes}`;
}

window.renderMatrix = renderMatrix;
window.renderGraph = renderGraph;
