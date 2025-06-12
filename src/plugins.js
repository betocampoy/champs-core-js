export function initTomSelects() {
    if (typeof TomSelect !== 'function') {
        console.warn('[ChampsCore] TomSelect não disponível. Verifique se foi importado ou incluído via CDN.');
        return;
    }

    document.querySelectorAll('select.tom-select').forEach(el => {
        if (el.dataset.tomselectInitialized === 'true') return;

        new TomSelect(el, {
            create: false,
            allowHtml: true,
            sortField: { field: 'text', direction: 'asc' }
        });

        el.dataset.tomselectInitialized = 'true';
    });
}

export function initDatePickers() {
    if (typeof flatpickr !== 'function') {
        console.warn('[ChampsCore] Flatpickr não disponível. Verifique se foi importado ou incluído via CDN.');
        return;
    }

    document.querySelectorAll('input.datepicker').forEach(el => {
        if (el.dataset.flatpickrInitialized === 'true') return;

        flatpickr(el, {
            dateFormat: "d/m/Y",
            allowInput: true
        });

        el.dataset.flatpickrInitialized = 'true';
    });
}

export function initInputMasks() {
    if (typeof Inputmask !== 'function') {
        console.warn('[ChampsCore] Inputmask não disponível. Verifique se foi importado ou incluído via CDN.');
        return;
    }

    document.querySelectorAll('input[data-mask]').forEach(el => {
        if (el.dataset.maskInitialized === 'true') return;

        Inputmask(el.dataset.mask).mask(el);
        el.dataset.maskInitialized = 'true';
    });
}

export function initTooltips() {
    if (typeof bootstrap === 'undefined' || typeof bootstrap.Tooltip !== 'function') {
        console.warn('[ChampsCore] Bootstrap.Tooltip não disponível.');
        return;
    }

    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
        if (el.dataset.tooltipInitialized === 'true') return;

        new bootstrap.Tooltip(el);
        el.dataset.tooltipInitialized = 'true';
    });
}

export function initAllPlugins() {
    initTomSelects();
    initDatePickers();
    initInputMasks();
    initTooltips();
}
