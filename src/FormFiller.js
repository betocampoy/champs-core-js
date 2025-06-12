export default class FormFiller {
    static fill(data) {
        if (!data || typeof data !== 'object') return;

        const clonedData = { ...data };
        const jsCustomFunction = clonedData.jsCustomFunction;
        delete clonedData.jsCustomFunction;

        for (const key in clonedData) {
            if (!Object.prototype.hasOwnProperty.call(clonedData, key)) continue;

            const selector = '.' + key;
            const elements = document.querySelectorAll(selector);
            if (elements.length === 0) continue;

            let value = clonedData[key];

            // Suporte ao formato { counter, data } vindo do backend
            if (typeof value === 'object' && value.counter !== undefined && value.data !== undefined) {
                const values = Object.values(value.data);
                value = values.length > 0 ? values[0] : '';
            }

            elements.forEach(el => {
                if (['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) {
                    el.value = value;
                } else {
                    el.innerHTML = value;
                }
            });
        }

        if (jsCustomFunction && typeof window[jsCustomFunction] === 'function') {
            window[jsCustomFunction]();
        }
    }
}
