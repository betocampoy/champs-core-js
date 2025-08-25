import Loader from './Loader.js';

const NavLoader = (() => {
    let overlayVisible = false;
    let showTimer = null;
    const SHOW_DELAY_MS = 120;
    const SS_KEY = 'champs_loader_visible';

    function forceHideAll() {
        try {
            // remove overlay global
            document.querySelectorAll('.champs-loader-overlay').forEach(n => n.remove());
            // remove loaders locais (caso ficaram presos)
            document.querySelectorAll('.champs-loader').forEach(n => n.remove());
            overlayVisible = false;
            sessionStorage.removeItem(SS_KEY);
        } catch {}
    }

    function safeShow() {
        if (overlayVisible) return;
        clearTimeout(showTimer);
        showTimer = setTimeout(() => {
            overlayVisible = true;
            sessionStorage.setItem(SS_KEY, '1');
            Loader.show(); // overlay global
        }, SHOW_DELAY_MS);
    }

    function safeHide() {
        clearTimeout(showTimer);
        if (!overlayVisible) {
            // mesmo assim, limpa qualquer resíduo
            forceHideAll();
            return;
        }
        overlayVisible = false;
        sessionStorage.removeItem(SS_KEY);
        Loader.hide();
        // limpeza extra (caso tenha múltiplos overlays por algum motivo)
        forceHideAll();
    }

    function shouldBypassForActiveElement() {
        const el = document.activeElement;
        return !!el?.closest('.no-loader');
    }

    function shouldBypassForLinkClick(event) {
        const a = event.target?.closest('a[href]');
        if (!a) return false;
        if (
            a.classList.contains('no-loader') ||
            a.target === '_blank' ||
            a.hasAttribute('download') ||
            event.ctrlKey || event.metaKey || event.shiftKey || event.altKey
        ) {
            return true;
        }
        const href = a.getAttribute('href') || '';
        if (href.startsWith('#') || href.startsWith('javascript:')) return true;
        return false;
    }

    function initOnNavigation() {
        // Failsafe imediato ao carregar o script (caso volte do histórico)
        forceHideAll();

        // 1) Navegação tradicional
        window.addEventListener('beforeunload', () => {
            if (shouldBypassForActiveElement()) return;
            safeShow();
        });

        // 2) Ciclo de vida da página
        window.addEventListener('load', safeHide);

        // iOS/Android: ao voltar do histórico (BFCache) dispara pageshow
        window.addEventListener('pageshow', (e) => {
            // Em mobile, esconda SEMPRE — com ou sem persisted
            // Pequeno delay garante que o DOM final foi reidratado
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    safeHide();
                });
            });
        });

        // Antes de sair (inclusive para BFCache), limpe timers e flags
        window.addEventListener('pagehide', () => {
            clearTimeout(showTimer);
            // não chamamos Loader.hide() aqui para não brigar com o navegador,
            // mas zeramos estado para não “gravar” overlay visível no BFCache
            overlayVisible = false;
            sessionStorage.removeItem(SS_KEY);
        });

        // Algumas engines podem disparar unload: ainda assim, limpe
        window.addEventListener('unload', () => {
            overlayVisible = false;
            sessionStorage.removeItem(SS_KEY);
        });

        // 3) Clique em links
        document.addEventListener('click', (event) => {
            if (shouldBypassForLinkClick(event)) return;
            const a = event.target?.closest('a[href]');
            if (!a) return;
            if (!shouldBypassForActiveElement()) safeShow();
        });

        // 4) Submissão de formulários
        document.addEventListener('submit', (event) => {
            const form = event.target;
            if (form?.classList?.contains('no-loader')) return;
            if (!shouldBypassForActiveElement()) safeShow();
        });

        // 5) Hooks SPA (Turbo/Hotwire)
        window.addEventListener('turbo:visit', () => safeShow());
        window.addEventListener('turbo:load', () => safeHide());
        window.addEventListener('turbo:render', () => safeHide());

        // 6) Histórico (voltar/avançar)
        window.addEventListener('popstate', () => {
            // ao navegar no histórico, garanta overlay off
            safeHide();
        });

        // 7) Visibilidade da aba
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                // se por acaso ficou algo preso, limpa
                safeHide();
            }
        });

        // 8) Fetch opcional com cabeçalho
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
            let hidePlanned = false;
            try {
                const req = args[0];
                const mark = (typeof req === 'string' ? null : req) || null;
                const wantsGlobal =
                    (mark?.headers?.get?.('X-Global-Loader') === '1') ||
                    (mark?.headers && mark.headers['X-Global-Loader'] === '1');
                if (wantsGlobal) {
                    safeShow();
                    hidePlanned = true;
                }
            } catch {}
            try {
                const res = await origFetch(...args);
                return res;
            } finally {
                if (hidePlanned) safeHide();
            }
        };

        // 9) Se por algum motivo o estado ficou salvo (falha anterior), limpa agora
        if (sessionStorage.getItem(SS_KEY) === '1') {
            safeHide();
        }
    }

    return {
        initOnNavigation,
        _debug: () => ({ overlayVisible }),
        _forceHideAll: forceHideAll, // exposto p/ debug manual
    };
})();

export default NavLoader;
