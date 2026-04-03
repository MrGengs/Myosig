/**
 * Myosig i18n — Internationalization Engine
 * Supports English (default) and Indonesian with localStorage persistence.
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'myosig_lang';
    const DEFAULT_LANG = 'en';
    const SUPPORTED = ['en', 'id'];

    // Current language
    let _lang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    if (!SUPPORTED.includes(_lang)) _lang = DEFAULT_LANG;

    /** Get current language */
    window.getLang = function () { return _lang; };

    /**
     * Translate a key.
     * Falls back: current lang -> other lang -> key itself.
     */
    window.t = function (key, replacements) {
        if (typeof TRANSLATIONS === 'undefined') return key;
        const val = (TRANSLATIONS[_lang] && TRANSLATIONS[_lang][key])
            || (TRANSLATIONS[DEFAULT_LANG] && TRANSLATIONS[DEFAULT_LANG][key])
            || key;
        if (!replacements) return val;
        // Simple {0}, {1} or {name} replacement
        return val.replace(/\{(\w+)\}/g, (m, k) => (replacements[k] !== undefined ? replacements[k] : m));
    };

    /**
     * Set language and re-render all data-i18n elements.
     */
    window.setLang = function (lang) {
        if (!SUPPORTED.includes(lang)) return;
        _lang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        document.documentElement.lang = lang;
        applyTranslations();
        updateLangButtons();
    };

    /** Toggle between en <-> id */
    window.toggleLang = function () {
        setLang(_lang === 'en' ? 'id' : 'en');
    };

    /**
     * Apply translations to all elements with data-i18n attributes.
     * Supports:
     *   data-i18n="key"                -> textContent
     *   data-i18n-placeholder="key"    -> placeholder
     *   data-i18n-title="key"          -> title
     *   data-i18n-html="key"           -> innerHTML
     */
    function applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key) el.textContent = t(key);
        });
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            if (key) el.innerHTML = t(key);
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (key) el.placeholder = t(key);
        });
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (key) el.title = t(key);
        });
    }

    /** Update toggle button labels */
    function updateLangButtons() {
        document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
            btn.textContent = _lang === 'en' ? 'ID' : 'EN';
            btn.title = _lang === 'en' ? 'Switch to Indonesian' : 'Ganti ke Bahasa Inggris';
        });
    }

    /** On DOM ready, apply translations */
    document.addEventListener('DOMContentLoaded', function () {
        document.documentElement.lang = _lang;
        applyTranslations();
        updateLangButtons();
    });
})();
