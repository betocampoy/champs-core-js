# Champs Core JS

Champs Core JS é um conjunto modular de utilitários em JavaScript puro (Vanilla JS) para facilitar a construção de aplicações web com recursos interativos, principalmente voltado para projetos que utilizam Bootstrap 5 e componentes AJAX.

## 📦 Estrutura Modular

Cada funcionalidade está separada em seu próprio módulo dentro de `src/`, permitindo fácil reutilização, manutenção e testes isolados.

### ✅ Módulos Disponíveis

| Módulo                | Responsabilidade principal                              |
| --------------------- | ------------------------------------------------------- |
| `Loader.js`           | Exibe/oculta o loader global                            |
| `AjaxForm.js`         | Envio AJAX com tratamento de resposta unificado         |
| `Message.js`          | Exibição de mensagens animadas (sucesso, erro, etc)     |
| `ModalManager.js`     | Gerencia modais nativos e Bootstrap 5                   |
| `CheckboxGroup.js`    | Controle de checkboxes em grupo com contadores          |
| `FormPopulation.js`   | Preenche campos encadeados dinamicamente                |
| `FormFiller.js`       | Preenche campos de formulário a partir de dados JSON    |
| `plugins.js`          | Inicializa TomSelect, Flatpickr, Inputmask, Tooltips    |
| `DatalistManager.js`  | Sincroniza `datalist` com valor real oculto             |
| `ZipcodeSearch.js`    | Busca CEP usando a API ViaCEP                           |
| `VisibilityToggle.js` | Alterna visualização de campos sensíveis (senha, valor) |

---

## 🧩 Documentação por módulo

### `AjaxForm.js`

* **Classes usadas:** `.champs_send_post_on_click`, `.champs_send_post_on_update`
* **Método de ativação:** `init()` ativa listeners globais para clique e mudança
- **data attributes:**
  - `data-route`: endpoint que será chamado
  - `data-with_inputs`: se `true`, envia o formulário associado
  - `data-target_form_name`: nome do formulário a ser enviado
  - `data-confirm`: exibe confirmação antes de enviar

* **Resposta esperada:**

    * `message`, `redirect`, `reload`, `formfiller`, `populate`, `champs_modal`, `champs_modal_bs5`

### `CheckboxGroup.js`

* **Classe pai:** `.champs_checkbox_parent_select`
* **Classe filhos:** `.champs_checkbox_child_select`
* **data attributes:**

    * `data-group`: nome do grupo compartilhado
    * `data-counter_element`: seletor para atualizar contador
    * `data-total_element`: seletor para somar valores
    * `data-value_to_sum`: valor numérico para somar

### `FormPopulation.js`

* **Requisição retorna:** `populate`
* **Estrutura esperada:**

```json
{
  "populate": {
    "data_post": {
      "element_id": "estado",
      "child_selector": "#cidade",
      "group": "local",
      "group_index": 1,
      "jsCustomFunction": "callbackOpcional"
    },
    "data_response": {
      "counter": 2,
      "data": {
        "1": "Campinas",
        "2": "São Paulo"
      }
    }
  }
}
```

### `FormFiller.js`

* **Requisição retorna:** `formfiller`
* **Chaves devem bater com `.classe` dos inputs**
* **Exemplo:**

```json
{
  "formfiller": {
    "nome": "Beto",
    "email": "beto@email.com",
    "jsCustomFunction": "posPreenchimento"
  }
}
```

### `VisibilityToggle.js`

* **Classe do botão:** `.champs_toggle_visibility`
* **data attributes:**

    * `data-hidden_group`: classe comum aos campos a serem alternados
    * `data-icon_show`: emoji ou HTML visível quando campos estiverem ocultos
    * `data-icon_hide`: emoji ou HTML visível quando campos estiverem visíveis

---

## 🧪 Exemplo de uso

Veja `example/index.html` para exemplos práticos de cada funcionalidade em ação.

---

## 🔄 Integração com Bootstrap 5

* Totalmente compatível com layout padrão, `form-control`, `form-floating`, `input-group`, etc.
* Detecção automática de modais, tooltips, e plugins carregados via CDN ou NPM.

---

## 📚 Como utilizar

1. Inclua os arquivos dos módulos desejados no seu projeto
2. Importe-os em `script type="module"`
3. Chame os métodos de `init()` para ativar os listeners
4. Use classes e data-\* attributes conforme a documentação

---

## 🛠 Requisitos para funcionar

* JavaScript ES6+
* Bootstrap 5 (via CDN ou NPM)
* Plugins opcionais: TomSelect, Flatpickr, Inputmask (usados via `plugins.js`)

---

## 💬 Suporte e colaboração

Este projeto é modular e pode ser evoluído com novas funcionalidades conforme as necessidades do frontend. Para sugestões ou melhorias, colabore diretamente no repositório Champs Core JS.

---

Feito com 💻 por Beto
