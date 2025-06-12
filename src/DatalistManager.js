export default class DatalistManager {
    static handleChange(datalistInput) {
        if (!datalistInput) return;

        const inputValue = datalistInput.value;
        const selectedItem = document.querySelector(`option[value="${inputValue}"]`);
        const targetElements = document.querySelectorAll('.datalist_target_element_class');

        if (selectedItem && targetElements.length > 0) {
            const dataValue = selectedItem.dataset.value ?? selectedItem.id;

            targetElements.forEach(target => {
                if (['INPUT', 'SELECT'].includes(target.tagName)) {
                    target.value = dataValue;
                } else {
                    target.innerHTML = dataValue;
                }
            });

            if (datalistInput.dataset.datalist_clear_after_change === 'true') {
                datalistInput.value = '';
            }
        }
    }

    static init() {
        document.addEventListener('change', (event) => {
            const el = event.target;
            if (el.classList.contains('datalist_input_on_change')) {
                DatalistManager.handleChange(el);
            }
        });
    }
}
