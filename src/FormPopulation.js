export default class FormPopulation {
    static populate(data) {
        const postData = data.data_post;
        const response = data.data_response;

        const parentEl = document.getElementById(postData.element_id);
        const childEl = document.querySelector(postData.child_selector);

        if (!parentEl || !childEl) {
            console.warn('[ChampsCore] Elemento pai ou filho não encontrado.');
            return;
        }

        if (postData.group) {
            FormPopulation.clearGroupSiblings(parentEl, postData.group, postData.group_index);
        }

        FormPopulation.updateChild(childEl, response);

        if (postData.jsCustomFunction && typeof window[postData.jsCustomFunction] === 'function') {
            window[postData.jsCustomFunction]();
        }
    }

    static clearGroupSiblings(parentEl, group, currentIndex) {
        const siblings = parentEl.parentNode.querySelectorAll(`[data-group="${group}"]`);
        siblings.forEach(el => {
            if (parseInt(el.dataset.group_index) > parseInt(currentIndex)) {
                if (el.tagName === 'SELECT') {
                    el.options.length = 0;
                    el.innerHTML = `<option value="" disabled selected>Selecione o menu anterior antes!</option>`;
                }
                if (el.tagName === 'INPUT') {
                    el.value = '';
                }
            }
        });
    }

    static updateChild(childEl, response) {
        const type = childEl.tagName;

        if (type === 'INPUT') {
            if (response.counter > 0) {
                const values = Object.values(response.data);
                childEl.value = values.length > 0 ? values[0] : '';
            } else {
                childEl.value = '';
            }
        }

        if (type === 'SELECT') {
            childEl.options.length = 0;

            if (response.counter === 0) {
                childEl.disabled = true;
                childEl.innerHTML = `<option value="" disabled selected>Não retornou nenhum registro</option>`;
            } else {
                childEl.disabled = false;
                let options = `<option value="" disabled selected>Selecione uma opção</option>`;

                Object.keys(response.data).forEach(key => {
                    options += `<option value="${key}">${response.data[key]}</option>`;
                });

                childEl.innerHTML = options;
            }
        }
    }
}
