export default class VisibilityToggle {
    static init() {
        document.addEventListener('click', (event) => {
            const el = event.target.closest('.champs_toggle_visibility');
            if (el && el.dataset.hidden_group) {
                VisibilityToggle.toggleGroup(el);
            }
        });
    }

    static toggleGroup(buttonEl) {
        const groupClass = buttonEl.dataset.hidden_group;
        const elements = document.querySelectorAll(`.${groupClass}`);

        let isNowVisible = false;

        elements.forEach(el => {
            if (el.tagName === 'INPUT') {
                const originalType = el.dataset.originalType || el.type;

                if (!el.dataset.originalType) {
                    el.dataset.originalType = originalType;
                }

                if (originalType === 'password') {
                    const newType = el.type === 'password' ? 'text' : 'password';
                    el.type = newType;
                    isNowVisible = newType === 'text';
                } else {
                    el.classList.toggle('d-none');
                    isNowVisible = !el.classList.contains('d-none');
                }
            } else {
                el.classList.toggle('d-none');
                isNowVisible = !el.classList.contains('d-none');
            }
        });

        const iconShow = buttonEl.dataset.icon_show;
        const iconHide = buttonEl.dataset.icon_hide;

        if (iconShow && iconHide) {
            buttonEl.innerHTML = isNowVisible ? iconHide : iconShow;
        }
    }
}
