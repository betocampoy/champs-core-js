// Centralizador dos módulos do Champs Core JS (corrigido)

// AjaxForm NÃO tem export default – exporte nomeado ou em namespace
export * as AjaxForm from './AjaxForm.js';       // -> AjaxForm.init(), AjaxForm.handleAjaxSend()

// Esses têm export default (classes/objetos):
export { default as CheckboxGroup }    from './CheckboxGroup.js';
export { default as CopyText }         from './CopyText.js';
export { default as DatalistManager }  from './DatalistManager.js';
export { default as FormFiller }       from './FormFiller.js';
export { default as FormPopulation }   from './FormPopulation.js';
export { default as Loader }           from './Loader.js';
export { default as Message }          from './Message.js';
export { default as ModalManager }     from './ModalManager.js';
export { default as VisibilityToggle } from './VisibilityToggle.js';
export { default as ZipcodeSearch }    from './ZipcodeSearch.js';

// Templates (são exports nomeados)
export * from './loader.templates.js';

// NavLoader tem export default, mas o arquivo importa Loader com case errado (corrija abaixo)
export { default as NavLoader } from './loader.navigation.js';
