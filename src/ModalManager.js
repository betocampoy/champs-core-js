import { initAllPlugins } from './plugins.js';

export default class ModalManager {
    static ensureStructure() {
        if (!document.getElementById('champs_modal')) {
            const modal = document.createElement('div');
            modal.id = 'champs_modal';
            modal.classList.add('hide');
            document.body.insertBefore(modal, document.body.firstChild);
        }

        if (!document.getElementById('champs_modal_fade')) {
            const fade = document.createElement('div');
            fade.id = 'champs_modal_fade';
            fade.classList.add('hide');
            document.body.insertBefore(fade, document.body.firstChild);
        }

        if (!document.getElementById('champs_parent_bs5_modal')) {
            const bs5 = document.createElement('div');
            bs5.id = 'champs_parent_bs5_modal';
            document.body.insertBefore(bs5, document.body.firstChild);
        }
    }

    static showBasicModal(html) {
        ModalManager.ensureStructure();

        const modal = document.getElementById('champs_modal');
        const fade = document.getElementById('champs_modal_fade');

        modal.innerHTML = html;
        modal.classList.remove('hide');
        fade.classList.remove('hide');
    }

    static closeBasicModal() {
        document.getElementById('champs_modal')?.classList.add('hide');
        document.getElementById('champs_modal_fade')?.classList.add('hide');
    }

    static async showBS5Modal(modalId, modalHtml, jsFunction = null) {
        ModalManager.ensureStructure();

        const container = document.getElementById('champs_parent_bs5_modal');
        container.innerHTML = modalHtml;

        const modalEl = document.getElementById(modalId);
        if (!modalEl) {
            console.error(`[ChampsCore] Modal #${modalId} não encontrado no HTML.`);
            return;
        }

        let ModalClass;

        // Verifica se Bootstrap via CDN está presente
        if (typeof bootstrap !== 'undefined' && typeof bootstrap.Modal === 'function') {
            ModalClass = bootstrap.Modal;
        } else {
            try {
                const bootstrapModule = await import('bootstrap');
                ModalClass = bootstrapModule.Modal;
            } catch (err) {
                console.error('[ChampsCore] Bootstrap 5 não encontrado. Verifique se foi importado corretamente.');
                return;
            }
        }

        const modal = new ModalClass(modalEl, {
            backdrop: true,
            keyboard: true,
            focus: true
        });

        modal.show();
        initAllPlugins();

        if (jsFunction && typeof window[jsFunction] === 'function') {
            window[jsFunction]();
        }
    }

    static async closeAllBS5Modals() {
        let ModalClass;

        if (typeof bootstrap !== 'undefined' && typeof bootstrap.Modal === 'function') {
            ModalClass = bootstrap.Modal;
        } else {
            try {
                const bootstrapModule = await import('bootstrap');
                ModalClass = bootstrapModule.Modal;
            } catch (err) {
                console.warn('[ChampsCore] Bootstrap 5 não disponível. Nenhum modal será fechado.');
                return;
            }
        }

        document.querySelectorAll('.modal.show').forEach((el) => {
            const instance = ModalClass.getInstance(el);
            instance?.hide();
        });
    }
}
