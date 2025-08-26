const Loader = (() => {
    const state = {
        template: `
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    `,
        templates: new Map(), // name -> html(string) | function() => string|Node
        currentName: 'default',
        attached: new WeakMap(), // Element -> opts persistidas (para showFromEl/hideFromEl)
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

    // --- helpers internos
    function createLoaderNode(html, { color } = {}) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('champs-loader');
        if (color) wrapper.classList.add(`text-${color}`);
        if (typeof html === 'string') {
            wrapper.innerHTML = html;
        } else if (html instanceof Node) {
            wrapper.appendChild(html);
        } else {
            wrapper.innerHTML = state.template;
        }
        return wrapper;
    }

    function show(target = null, opts = {}) {
        // opts: { template, mode: 'overlay'|'inline', color, block }
        const {
            template: nameOrHtml,
            mode,
            color,
            block = true, // overlay/inline bloqueia clique por padrão
        } = opts;

        const html = resolveTemplate(nameOrHtml || state.currentName);

        if (target) {
            // ---- modo local (overlay no elemento OU inline centralizado)
            const chosenMode = mode || (target.className.includes('overlay') ? 'overlay' : 'inline');
            const container = (chosenMode === 'overlay')
                ? document.createElement('div')
                : createLoaderNode(html, { color });

            if (chosenMode === 'overlay') {
                // overlay dentro do target
                target.classList.add('position-relative');
                container.classList.add('champs-loader-overlay', 'd-flex', 'justify-content-center', 'align-items-center');
                container.style.position = 'absolute';
                container.style.inset = 0;
                container.style.background = 'rgba(255,255,255,0.6)';
                if (!block) container.style.pointerEvents = 'none';

                // conteúdo
                const node = createLoaderNode(html, { color });
                node.classList.add('position-absolute', 'top-50', 'start-50', 'translate-middle');
                container.appendChild(node);
                target.appendChild(container);
            } else {
                // inline centralizado no target
                if (block) {
                    // centraliza como “camada” interna mas sem cobrir totalmente
                    target.classList.add('position-relative');
                    container.classList.add('position-absolute', 'top-50', 'start-50', 'translate-middle');
                }
                target.appendChild(container);
            }
            return;
        }

        // ---- overlay global (compatibilidade antiga)
        const el = createLoaderNode(html, { color });
        const overlay = document.createElement('div');
        overlay.classList.add('champs-loader-overlay', 'd-flex', 'justify-content-center', 'align-items-center');
        overlay.style.position = 'fixed';
        overlay.style.inset = 0;
        overlay.style.background = 'rgba(255,255,255,0.7)';
        overlay.style.zIndex = 9999;
        overlay.appendChild(el);
        document.body.appendChild(overlay);
    }

    function hide(target = null) {
        if (target) {
            // remove overlay interno
            const overlay = target.querySelector(':scope > .champs-loader-overlay');
            if (overlay) overlay.remove();
            // remove inline
            const inline = target.querySelector(':scope > .champs-loader');
            if (inline) inline.remove();
        } else {
            const overlay = document.querySelector('.champs-loader-overlay');
            if (overlay) overlay.remove();
        }
    }

    // ---------- API declarativa por data-attributes ----------
    // attach: salva opções no elemento (para showFromEl/hideFromEl)
    function attach(el, opts = {}) {
        if (!el) return;                    // <-- evita null
        state.attached.set(el, {
            template: opts.template ?? el.dataset.loaderTemplate ?? state.currentName,
            mode:
                opts.mode ??
                el.dataset.loaderMode ??
                (el.className.includes('overlay') ? 'overlay' : 'inline'),
            color: opts.color ?? el.dataset.loaderColor ?? null,
            block: (opts.block ?? (el.dataset.loaderBlock !== 'false')), // default true
        });
    }

    // faz o parse do DOM e "prepara" todos que tiverem classe champs_load.*
    function initFromDataAttributes(root = document) {
        const list = root.querySelectorAll('[class*="champs_load"]');
        list.forEach((el) => attach(el, {}));
    }

    function showFromEl(el) {
        if (!el) {                          // <-- suporta overlay global
            return show(null, {});            // usa o template corrente em overlay global
        }
        const opts = state.attached.get(el) ?? {
            template: el.dataset?.loaderTemplate ?? state.currentName,
            mode: el.dataset?.loaderMode ?? (el.className.includes('overlay') ? 'overlay' : 'inline'),
            color: el.dataset?.loaderColor ?? null,
            block: (el.dataset?.loaderBlock !== 'false'),
        };
        return show(el, opts);
    }

    function hideFromEl(el) {
        if (!el) return hide(null);         // <-- suporta overlay global
        return hide(el);
    }

    return {
        // registry
        registerTemplate,
        use,
        setTemplate, // mantém API antiga
        show,
        hide,
        // declarativo
        attach,
        initFromDataAttributes,
        showFromEl,
        hideFromEl,
        // debug
        _debug: () => ({ currentName: state.currentName, keys: [...state.templates.keys()] }),
    };
})();

export default Loader;
