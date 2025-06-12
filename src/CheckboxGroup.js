import { fulfillElements } from './utils.js';

export default class CheckboxGroup {
    static init() {
        document.addEventListener('change', (event) => {
            const el = event.target;

            if (el.classList.contains('champs_checkbox_parent_select')) {
                CheckboxGroup.handleParentCheckbox(el);
            }

            if (el.classList.contains('champs_checkbox_child_select')) {
                CheckboxGroup.handleChildCheckbox(el);
            }
        });
    }

    static handleParentCheckbox(parent) {
        const group = parent.dataset.group;
        if (!group) return;

        const children = document.querySelectorAll(`.champs_checkbox_child_select[data-group="${group}"]`);
        const counterEls = document.querySelectorAll(parent.dataset.counter_element || '.champs_counter_checkbox');
        const totalEls = document.querySelectorAll(parent.dataset.total_element || '.champs_total_checkbox');

        let total = 0;

        children.forEach((child) => {
            child.checked = parent.checked;

            if (child.dataset.value_to_sum) {
                total += parseFloat(child.dataset.value_to_sum.replace(',', '.')) || 0;
            }
        });

        fulfillElements(counterEls, parent.checked ? children.length : 0);
        fulfillElements(totalEls, parent.checked ? total : 0);
    }

    static handleChildCheckbox(child) {
        const group = child.dataset.group;
        if (!group) return;

        const children = document.querySelectorAll(`.champs_checkbox_child_select[data-group="${group}"]`);
        const parent = document.querySelector(`.champs_checkbox_parent_select[data-group="${group}"]`);
        const counterEls = document.querySelectorAll(child.dataset.counter_element || '.champs_counter_checkbox');
        const totalEls = document.querySelectorAll(child.dataset.total_element || '.champs_total_checkbox');

        let count = 0;
        let total = 0;

        children.forEach((c) => {
            if (c.checked) {
                count++;
                if (c.dataset.value_to_sum) {
                    total += parseFloat(c.dataset.value_to_sum.replace(',', '.')) || 0;
                }
            }
        });

        fulfillElements(counterEls, count);
        fulfillElements(totalEls, total);

        if (parent) {
            parent.checked = count === children.length;
        }
    }
}
