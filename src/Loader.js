// champs-core/loader.js
const Loader = (() => {
    const state = {
        template: `
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    `,
        templates: new Map(), // name -> html(string) | function() => string
        currentName: 'default',
    };

    // templates embutidos
    state.templates.set('default', state.template);

    function resolveTemplate(nameOrHtml) {
        if (!nameOrHtml) return state.template;
        if (state.templates.has(nameOrHtml)) {
            const t = state.templates.get(nameOrHtml);
            return (typeof t === 'function') ? t() : t;
        }
        return nameOrHtml; // HTML direto
    }

    function setTemplate(html) {
        state.template = html || state.template;
    }

    function registerTemplate(name, htmlOrFn) {
        if (!name) return;
        state.templates.set(name, htmlOrFn);
    }

    function use(name) {
        if (state.templates.has(name)) {
            state.currentName = name;
            const tpl = resolveTemplate(name);
            setTemplate(tpl);
        } else {
            console.warn(`[Loader] template "${name}" não encontrado, mantendo "${state.currentName}".`);
        }
    }

    function show(target = null, opts = {}) {
        const { template: nameOrHtml } = opts;
        const html = resolveTemplate(nameOrHtml || state.currentName);

        // cria conteúdo
        const el = document.createElement('div');
        el.classList.add('champs-loader');
        el.innerHTML = html;

        if (target) {
            // loader local
            target.classList.add('position-relative');
            el.classList.add('position-absolute', 'top-50', 'start-50', 'translate-middle');
            target.appendChild(el);
        } else {
            // overlay global (comportamento antigo, 100% compatível)
            const overlay = document.createElement('div');
            overlay.classList.add('champs-loader-overlay', 'd-flex', 'justify-content-center', 'align-items-center');
            overlay.style.position = 'fixed';
            overlay.style.inset = 0;
            overlay.style.background = 'rgba(255,255,255,0.7)';
            overlay.style.zIndex = 9999;
            overlay.appendChild(el);
            document.body.appendChild(overlay);
        }
    }

    function hide(target = null) {
        if (target) {
            const loader = target.querySelector('.champs-loader');
            if (loader) loader.remove();
        } else {
            const overlay = document.querySelector('.champs-loader-overlay');
            if (overlay) overlay.remove();
        }
    }

    return {
        // registry
        registerTemplate,
        use,
        setTemplate, // mantém API antiga
        show,
        hide,
        _debug: () => ({ currentName: state.currentName, keys: [...state.templates.keys()] }),
    };
})();

export default Loader;
