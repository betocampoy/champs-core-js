export default class ZipcodeSearch {
    static init() {
        document.addEventListener('change', (event) => {
            const el = event.target;
            if (el.classList.contains('champs_zipcode_search')) {
                ZipcodeSearch.handle(el);
            }
        });
    }

    static async handle(zipInput) {
        const raw = zipInput.value.replace(/\D/g, '');
        const isValid = /^[0-9]{8}$/.test(raw);

        const street = document.querySelectorAll('.champs_zipcode_search_street');
        const neighborhood = document.querySelectorAll('.champs_zipcode_search_neighborhood');
        const city = document.querySelectorAll('.champs_zipcode_search_city');
        const state = document.querySelectorAll('.champs_zipcode_search_state');
        const complement = document.querySelectorAll('.champs_zipcode_search_complement');
        const stateName = document.querySelectorAll('.champs_zipcode_search_state_name');
        const region = document.querySelectorAll('.champs_zipcode_search_region');
        const ddd = document.querySelectorAll('.champs_zipcode_search_ddd');

        const error = document.querySelectorAll('.champs_zipcode_search_error');
        const jsonResult = document.querySelectorAll('.champs_zipcode_search_result_json');



        ZipcodeSearch.fillFields(street, '');
        ZipcodeSearch.fillFields(neighborhood, '');
        ZipcodeSearch.fillFields(city, '');
        ZipcodeSearch.fillFields(state, '');
        ZipcodeSearch.fillFields(complement, '');
        ZipcodeSearch.fillFields(stateName, '');
        ZipcodeSearch.fillFields(region, '');
        ZipcodeSearch.fillFields(ddd, '');

        ZipcodeSearch.fillFields(error, '');
        ZipcodeSearch.fillFields(jsonResult, '');

        if (!isValid) {
            ZipcodeSearch.fillFields(error, 'CEP inválido. Digite 8 números.');
            zipInput.focus();
            return;
        }

        try {
            const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
            const data = await res.json();

            if (data.erro) throw new Error('CEP não encontrado');

            ZipcodeSearch.fillFields(street, data.logradouro || '');
            ZipcodeSearch.fillFields(neighborhood, data.bairro || '');
            ZipcodeSearch.fillFields(city, data.localidade || '');
            ZipcodeSearch.fillFields(state, data.uf || '');
            ZipcodeSearch.fillFields(complement, data.complemento || '');
            ZipcodeSearch.fillFields(stateName, data.estado || '');
            ZipcodeSearch.fillFields(region, data.regiao || '');
            ZipcodeSearch.fillFields(ddd, data.ddd || '');
            ZipcodeSearch.fillFields(jsonResult, JSON.stringify(data, null, 2));

        } catch (e) {
            ZipcodeSearch.fillFields(error, 'CEP não encontrado.');
            zipInput.focus();
            console.warn('[ZipcodeSearch] Erro ao buscar CEP:', e);
        }
    }

    static fillFields(elements, value) {
        if (!elements || elements.length === 0) return;
        elements.forEach(el => {
            if (['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)) {
                el.value = value;
            } else {
                el.textContent = value;
            }
        });
    }
}
