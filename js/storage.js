const STORAGE_CONFIG = {
    users: 'ef_users',
    session: 'usuarioLogado',
    legacySession: 'ef_session',
    adminEmail: 'admin@escalafacil.com',
    migrationFlag: 'ef_user_data_migrated'
};

const RESOURCE_KEYS = {
    funcionarios: 'funcionarios',
    escalas: 'escalas',
    historico: 'historico',
    sugestoes: 'sugestoes'
};

function readJSON(key, fallback = null) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        return fallback;
    }
}

function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getStorageValue(key, fallback = null) {
    return localStorage.getItem(key) ?? fallback;
}

function setStorageValue(key, value) {
    localStorage.setItem(key, value);
}

function removeStorageValue(key) {
    localStorage.removeItem(key);
}

function createUserId() {
    if (crypto.randomUUID) {
        return `usr_${crypto.randomUUID().slice(0, 8)}`;
    }
    return `usr_${Date.now().toString(36)}`;
}

function normalizeUser(user) {
    const normalized = {
        id: user.id || createUserId(),
        nome: user.nome || user.name || '',
        email: user.email || '',
        senha: user.senha || user.password || ''
    };

    normalized.name = normalized.nome;
    normalized.password = normalized.senha;
    return normalized;
}

function getUsers() {
    const users = readJSON(STORAGE_CONFIG.users, []);
    return users.map(normalizeUser);
}

function saveUsers(users) {
    writeJSON(STORAGE_CONFIG.users, users.map(normalizeUser));
}

function ensureDefaultUser() {
    const users = getUsers();
    const exists = users.some(user => user.email === STORAGE_CONFIG.adminEmail);

    if (!exists) {
        users.push(normalizeUser({
            id: 'usr_admin',
            nome: 'Administrador',
            email: STORAGE_CONFIG.adminEmail,
            senha: '123456'
        }));
        saveUsers(users);
    } else {
        saveUsers(users);
    }
}

function getAdminUser() {
    ensureDefaultUser();
    return getUsers().find(user => user.email === STORAGE_CONFIG.adminEmail);
}

function setUsuarioLogado(usuario) {
    const sessionUser = normalizeUser(usuario);
    writeJSON(STORAGE_CONFIG.session, {
        id: sessionUser.id,
        nome: sessionUser.nome,
        name: sessionUser.nome,
        email: sessionUser.email,
        loginAt: new Date().toISOString()
    });
    removeStorageValue(STORAGE_CONFIG.legacySession);
}

function getUsuarioLogado() {
    const currentUser = readJSON(STORAGE_CONFIG.session, null);
    if (currentUser?.id) {
        return normalizeUser(currentUser);
    }

    const legacyUser = readJSON(STORAGE_CONFIG.legacySession, null);
    if (legacyUser?.id) {
        const normalized = normalizeUser(legacyUser);
        setUsuarioLogado(normalized);
        return normalized;
    }

    return null;
}

function getStorageKey(nomeRecurso) {
    const usuario = getUsuarioLogado();
    if (!usuario) {
        return null;
    }
    return `${nomeRecurso}_${usuario.id}`;
}

function saveUserData(nomeRecurso, dados) {
    const key = getStorageKey(nomeRecurso);
    if (!key) {
        return;
    }
    writeJSON(key, dados);
}

function getUserData(nomeRecurso) {
    const key = getStorageKey(nomeRecurso);
    if (!key) {
        return [];
    }
    return readJSON(key, []);
}

function hasUserData(nomeRecurso) {
    const key = getStorageKey(nomeRecurso);
    return key ? getStorageValue(key) !== null : false;
}

function saveDataForUser(userId, nomeRecurso, dados) {
    writeJSON(`${nomeRecurso}_${userId}`, dados);
}

function firstLegacyData(keys) {
    for (const key of keys) {
        const data = readJSON(key, null);
        if (Array.isArray(data) && data.length) {
            return data;
        }
    }
    return null;
}

function migrateAutomaticDataToAdmin() {
    if (getStorageValue(STORAGE_CONFIG.migrationFlag)) {
        return;
    }

    const admin = getAdminUser();
    if (!admin) {
        return;
    }

    const migrations = [
        {
            resource: RESOURCE_KEYS.funcionarios,
            legacyKeys: ['funcionarios', 'ef_employees']
        },
        {
            resource: RESOURCE_KEYS.escalas,
            legacyKeys: ['escalas', 'historico', 'ef_schedules']
        },
        {
            resource: RESOURCE_KEYS.historico,
            legacyKeys: ['historico', 'escalas', 'ef_schedules']
        },
        {
            resource: RESOURCE_KEYS.sugestoes,
            legacyKeys: ['sugestoes', 'ef_suggestions']
        }
    ];

    migrations.forEach(({ resource, legacyKeys }) => {
        const targetKey = `${resource}_${admin.id}`;
        const targetData = readJSON(targetKey, []);
        const legacyData = firstLegacyData(legacyKeys);

        if (!targetData.length && legacyData) {
            saveDataForUser(admin.id, resource, legacyData);
        }
    });

    setStorageValue(STORAGE_CONFIG.migrationFlag, 'true');
}

function logoutUsuario() {
    removeStorageValue(STORAGE_CONFIG.session);
    removeStorageValue(STORAGE_CONFIG.legacySession);
}
