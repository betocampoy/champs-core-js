export default class Loader {
    static createLoader() {
        if (document.querySelector(".champs_load")) return;

        const load = document.createElement("div");
        load.className = "champs_load";
        load.style.zIndex = 2000;
        load.style.display = "none";

        load.innerHTML = `
            <div class="champs_load_box">
                <div class="champs_load_box_circle"></div>
                <p class="champs_load_box_title">Aguarde, carregando...</p>
            </div>
        `;

        document.body.insertBefore(load, document.body.firstChild);
    }

    static show() {
        const loader = document.querySelector(".champs_load");
        if (loader) loader.style.display = "flex";
    }

    static hide() {
        const loader = document.querySelector(".champs_load");
        if (loader) loader.style.display = "none";
    }

    static initOnNavigation() {
        window.addEventListener('beforeunload', (e) => {
            const activeElement = document.activeElement;
            if (activeElement?.closest('.no-loader')) return;
            Loader.show();
        });

        window.addEventListener('unload', Loader.hide);
        window.addEventListener('load', Loader.hide);
    }
}