import Loader from './Loader.js';
import Message from './Message.js';
import ModalManager from './ModalManager.js';
import FormPopulation from './FormPopulation.js';
import { initAllPlugins } from './plugins.js';

// ---------------- Loader helpers (NOVO) ----------------

function resolveLoaderFor(triggerEl, formEl, submitter) {
    // prioridade: botão > form > auto
    const btn = submitter || (triggerEl.tagName !== 'FORM' ? triggerEl : null);

    // 1) target forçado via seletor CSS
    const btnTarget = btn?.dataset?.ajaxLoaderTarget;
    if (btnTarget && document.querySelector(btnTarget)) {
        return { target: document.querySelector(btnTarget), opts: resolveLoaderOptions(btn, formEl) };
    }
    const formTarget = formEl?.dataset?.ajaxLoaderTarget;
    if (formTarget && document.querySelector(formTarget)) {
        return { target: document.querySelector(formTarget), opts: resolveLoaderOptions(btn, formEl) };
    }

    // 2) escopo relativo via closest
    const btnScope = btn?.dataset?.ajaxLoaderScope;
    if (btnScope?.startsWith('closest:')) {
        const sel = btnScope.replace('closest:', '');
        const el = btn.closest(sel);
        if (el) return { target: el, opts: resolveLoaderOptions(btn, formEl, el) };
    }
    const formScope = formEl?.dataset?.ajaxLoaderScope;
    if (formScope) {
        if (formScope.startsWith('closest:')) {
            const sel = formScope.replace('closest:', '');
            const el = formEl.closest(sel);
            if (el) return { target: el, opts: resolveLoaderOptions(btn, formEl, el) };
        }
        if (document.querySelector(formScope)) {
            return { target: document.querySelector(formScope), opts: resolveLoaderOptions(btn, formEl) };
        }
    }

    // 3) automático: ancestral com classe champs_load.*
    const auto = btn?.closest('[class*="champs_load"]') || formEl?.closest('[class*="champs_load"]');
    if (auto) return { target: auto, opts: resolveLoaderOptions(btn, formEl, auto) };

    // 4) dentro de modal → .modal-content
    const modalContent = btn?.closest('.modal-content') || formEl?.closest('.modal-content');
    if (modalContent) return { target: modalContent, opts: resolveLoaderOptions(btn, formEl, modalContent) };

    // 5) card
    const card = btn?.closest('.card') || formEl?.closest('.card');
    if (card) return { target: card, opts: resolveLoaderOptions(btn, formEl, card) };

    // 6) fallback: overlay global
    return { target: null, opts: resolveLoaderOptions(btn, formEl, null) };
}

function resolveLoaderOptions(btn, formEl, targetEl = null) {
    // pega de botão > form > alvo
    const pick = (k) =>
        btn?.dataset?.[k] ??
        formEl?.dataset?.[k] ??
        (targetEl?.dataset ? targetEl.dataset[k] : null);

    const template = pick('loaderTemplate') || undefined;      // ex.: "wineAnimated"
    const mode     = pick('loaderMode') || undefined;          // "overlay" | "inline"
    const color    = pick('loaderColor') || undefined;         // "primary" | "danger" | ...
    const block    = (pick('loaderBlock') === 'false') ? false : true; // default true

    return { template, mode, color, block };
}

function showLoader(loaderRef) {
    // permite opt-out: data-ajax-loader="off" em botão OU form
    const { target, opts } = loaderRef;
    if (opts?.ajaxLoader === 'off') return;

    // se o Loader novo estiver disponível, usa attach/showFromEl (melhor UX)
    if (Loader.attach && Loader.showFromEl) {
        if (target) Loader.attach(target, opts);
        Loader.showFromEl(target || null);
    } else {
        // compatibilidade com Loader.show/hide antigos
        Loader.show(target || null, opts || {});
    }
}

function hideLoader(loaderRef) {
    const { target } = loaderRef;
    if (Loader.hideFromEl) {
        Loader.hideFromEl(target || null);
    } else {
        Loader.hide(target || null);
    }
}

export async function handleAjaxSend(el, submitter = null) {
    document.querySelector('.modal-backdrop')?.remove();

    el.dataset.element_id = el.id || '';

    const route = getRoute(el);
    if (!route) return false;

    const confirmMessage = getConfirm(el);
    if (!confirmMessage) return false;

    const sendForm = getSendForm(el);
    if (!validateUploads(sendForm)) return false;

    prepareDynamicInputs(el, sendForm);
    const bodyData = buildFormData(sendForm);

    // NOVO: decidir alvo + opções do loader antes de enviar
    const _loader = resolveLoaderFor(el, sendForm, submitter);
    showLoader(_loader);

    try {
        const response = await fetch(route, {
            method: getMethod(el),
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            body: bodyData
        });

        const data = await response.json();
        return handleResponse(el, data);
    } catch (err) {
        console.error(err);
        Message.show("Erro ao enviar requisição.", "error");
        return false;
    } finally {
        hideLoader(_loader); // NOVO: esconde no finally (com sucesso ou erro)
    }
}


// export async function handleAjaxSend(el) {
//     document.querySelector('.modal-backdrop')?.remove();
//
//     el.dataset.element_id = el.id || '';
//
//     const route = getRoute(el);
//     if (!route) return false;
//
//     const confirmMessage = getConfirm(el);
//     if (!confirmMessage) return false;
//
//     const sendForm = getSendForm(el);
//     if (!validateUploads(sendForm)) return false;
//
//     prepareDynamicInputs(el, sendForm);
//     const bodyData = buildFormData(sendForm);
//
//     Loader.show();
//
//     try {
//         const response = await fetch(route, {
//             method: getMethod(el),
//             headers: { 'X-Requested-With': 'XMLHttpRequest' },
//             body: bodyData
//         });
//
//         const data = await response.json();
//         return handleResponse(el, data);
//     } catch (err) {
//         console.error(err);
//         Message.show("Erro ao enviar requisição.", "error");
//         Loader.hide();
//         return false;
//     }
// }

function getRoute(el) {
    const route = el.tagName === 'FORM' ? el.getAttribute('action') : el.dataset.route;
    if (!route) {
        console.error("O atributo data-route é obrigatório!");
        return null;
    }
    return route;
}

function getConfirm(el) {
    const confirmMessage = el.dataset.confirm?.toLowerCase() !== '' ? el.dataset.confirm : false;
    if(confirmMessage){
        return confirm(confirmMessage);
    }
    return true;
}

function getMethod(el) {
    return el.dataset.method?.toUpperCase() === 'DELETE' ? 'DELETE' : 'POST';
}

function getSendForm(el) {
    const withInputs = el.tagName === 'FORM' || el.dataset.with_inputs === 'true';
    const targetForm = el.dataset.target_form_name
        ? document.querySelector(`form[name="${el.dataset.target_form_name}"]`)
        : el.closest("form");

    if (withInputs && targetForm) return targetForm;

    let form = document.getElementById("newForm");
    if (!form) {
        form = document.createElement("form");
        form.id = "newForm";
        document.body.appendChild(form);
    }
    return form;
}

function validateUploads(form) {
    const uploads = form.querySelectorAll("input[type=file]");
    for (const input of uploads) {
        if (input.dataset.upload_required && input.files.length === 0) {
            alert(`Selecione um arquivo no campo ${input.name}`);
            return false;
        }
        if (input.multiple && input.dataset.upload_max_files_limit &&
            input.files.length > input.dataset.upload_max_files_limit) {
            alert(`Máximo de ${input.dataset.upload_max_files_limit} arquivos em ${input.name}`);
            return false;
        }
    }
    return true;
}

function prepareDynamicInputs(el, form) {
    form.querySelectorAll("[data-champs-input-runtime]").forEach(i => i.remove());

    for (const [key, value] of Object.entries(el.dataset)) {
        let input = document.createElement("input");
        input.type = "hidden";
        input.setAttribute("data-champs-input-runtime", "");
        input.name = key;
        input.value = value.startsWith("get_value_of_")
            ? document.querySelector(value.replace("get_value_of_", "")).value
            : value;
        form.appendChild(input);
    }
}

function buildFormData(form) {
    return new FormData(form);
}

function handleResponse(el, data) {
    Loader.hide();
    el.disabled = false;

    if (data.message) {
        const type = data.type ?? 'error';
        Message.show(data.message, type);
        return false;
    }

    if (data.redirect) {
        window.location.href = data.redirect;
        return false;
    }

    if (data.reload) {
        window.location.reload();
        return false;
    }

    if (data.newPage) {
        if (Array.isArray(data.newPage)) {
            data.newPage.forEach(item => {
                let blank = window.open("", "_blank");
                blank.document.write(item.page);
                blank = null;
            });
        } else {
            let target = data.newPage.target ?? "_self";
            let page = window.open("", target);
            page.document.write(data.newPage.page);
        }
        return false;
    }

    if (data.populate) {
        FormPopulation.populate(data.populate);
        return false;
    }

    if (data.formfiller) {
        FormFiller.fill(data.formfiller);
        return false;
    }

    if (data.champs_modal) {
        ModalManager.showBasicModal(data.champs_modal.modal);
        return false;
    }

    if (data.champs_modal_bs5) {
        ModalManager.showBS5Modal(
            data.champs_modal_bs5.id ?? 'modalBS5',
            data.champs_modal_bs5.modal,
            data.champs_modal_bs5.jsCustomFunction
        );
        return false;
    }

    if (data.customFunction) {
        const fn = data.customFunction.function;
        const fnData = data.customFunction.data;
        if (typeof window[fn] === 'function') {
            window[fn](fnData);
        }
        return false;
    }

    Message.show("Nenhuma instrução de resposta processada.", "warning");
    return false;
}

export function init() {
    document.addEventListener('click', async (event) => {
        const el = event.target.closest('.champs_send_post_on_click');
        if (el) {
            event.preventDefault();
            await handleAjaxSend(el, event.target); // passa "quem clicou"
        }
    });

    document.addEventListener('change', async (event) => {
        const el = event.target.closest('.champs_send_post_on_update');
        if (el) {
            await handleAjaxSend(el, event.target);
        }
    });

    document.addEventListener('submit', async (event) => {
        const form = event.target.closest('form.champs_send_form_as_ajax');
        if (form) {
            event.preventDefault();
            await handleAjaxSend(form, event.submitter || null); // <-- NOVO
        }
    });
}

// export function init() {
//     document.addEventListener('click', async (event) => {
//         const el = event.target.closest('.champs_send_post_on_click');
//         if (el) {
//             event.preventDefault();
//             await handleAjaxSend(el);
//         }
//     });
//
//     document.addEventListener('change', async (event) => {
//         const el = event.target.closest('.champs_send_post_on_update');
//         if (el) {
//             await handleAjaxSend(el);
//         }
//     });
//
//     document.addEventListener('submit', async (event) => {
//         const form = event.target.closest('form.champs_send_form_as_ajax');
//         if (form) {
//             event.preventDefault();
//             await handleAjaxSend(form);
//         }
//     });
// }
