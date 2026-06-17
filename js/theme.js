(function () {
    const THEME_KEY = 'ef_theme';
    const DEFAULT_THEME = 'light';
    const root = document.documentElement;

    function getSavedTheme() {
        const savedTheme = getStorageValue(THEME_KEY);
        return savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : DEFAULT_THEME;
    }

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        const toggle = document.querySelector('#themeToggle');

        if (toggle) {
            const isDark = theme === 'dark';
            toggle.setAttribute('aria-pressed', String(isDark));
            toggle.setAttribute('title', isDark ? 'Tema escuro ativo' : 'Tema claro ativo');
            toggle.classList.toggle('is-dark', isDark);
        }
    }

    function saveTheme(theme) {
        setStorageValue(THEME_KEY, theme);
    }

    function toggleTheme() {
        const currentTheme = root.getAttribute('data-theme') || DEFAULT_THEME;
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        saveTheme(nextTheme);
    }

    applyTheme(getSavedTheme());

    document.addEventListener('DOMContentLoaded', () => {
        const toggle = document.querySelector('#themeToggle');
        applyTheme(getSavedTheme());

        if (toggle) {
            toggle.addEventListener('click', toggleTheme);
        }
    });
})();
