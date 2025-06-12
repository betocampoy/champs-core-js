export default class Message {
    static messageContainerClass = 'champs_post_response';
    static messageClass = 'champs_message';
    static timeBarClass = 'champs_message_time';
    static secondsToFadeout = 5;

    static show(text, type = 'success') {
        const container = Message.ensureContainer();
        const el = document.createElement('div');
        el.className = `${Message.messageClass} champs_${type}`;
        el.innerHTML = `${text}<div class="${Message.timeBarClass}"></div>`;

        container.appendChild(el);

        Message.animate(el);
    }

    static animate(el) {
        const bar = el.querySelector(`.${Message.timeBarClass}`);
        if (!bar) return;

        const ms = Message.secondsToFadeout * 1000;
        bar.animate([{ width: "100%" }, { width: "0%" }], ms);

        setTimeout(() => {
            el.style.display = 'none';
        }, ms);
    }

    static ensureContainer() {
        let container = document.querySelector(`.${Message.messageContainerClass}`);
        if (!container) {
            container = document.createElement("div");
            container.className = Message.messageContainerClass;
            document.body.insertBefore(container, document.body.firstChild);
        }
        return container;
    }
}
