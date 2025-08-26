import Loader from './Loader.js';
import Message from './Message.js';
import ModalManager from './ModalManager.js';
import FormPopulation from './FormPopulation.js';
import { initAllPlugins } from './plugins.js';

export async function handleAjaxSend(el) {
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

    Loader.show();

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
        Loader.hide();
        return false;
    }
}

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
            await handleAjaxSend(el);
        }
    });

    document.addEventListener('change', async (event) => {
        const el = event.target.closest('.champs_send_post_on_update');
        if (el) {
            await handleAjaxSend(el);
        }
    });

    document.addEventListener('submit', async (event) => {
        const form = event.target.closest('form.champs_send_form_as_ajax');
        if (form) {
            event.preventDefault();
            await handleAjaxSend(form);
        }
    });
}

export default { init };