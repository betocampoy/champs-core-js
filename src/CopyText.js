export default class CopyText {
    static init() {
        document.querySelectorAll('[data-champs-copy-from]').forEach((el) => {
            el.addEventListener('click', () => {
                const targetSelector = el.getAttribute('data-champs-copy-from');
                const target = document.querySelector(targetSelector);

                if (!target) {
                    console.warn(`[Champs] Elemento não encontrado para copiar: ${targetSelector}`);
                    return;
                }

                const text = target.innerText || target.value || '';
                navigator.clipboard.writeText(text.trim()).then(() => {
                    target.classList.add('champs-copied');
                    el.setAttribute('title', 'Copiado!');

                    // ✅ Marcar o checkbox, se indicado
                    const checkboxSelector = el.getAttribute('data-champs-check');
                    if (checkboxSelector) {
                        const checkbox = document.querySelector(checkboxSelector);
                        if (checkbox && checkbox.type === 'checkbox') {
                            checkbox.checked = true;
                        }
                    }

                    setTimeout(() => {
                        target.classList.remove('champs-copied');
                        el.removeAttribute('title');
                    }, 1500);
                }).catch(err => {
                    console.error('[Champs] Erro ao copiar:', err);
                });
            });
        });
    }
}
