const template = `
<style>
@import url('https://www.w3schools.com/w3css/4/w3.css');
@import url('https://www.w3schools.com/lib/w3-colors-flat.css');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
* {
    box-sizing:border-box;
}
:host {
    display: inline-block;
    width: 100px;
    height: 6px;
}
</style>
<div class="w3-dark-grey" style="width:100%;height:100%;" id="progress-outline" >
  <div id="progress" class=" w3-grey" style="height:100%;width:0%;"></div>
</div>
`.trim();
export class QqProgress extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:'open'});
        this.shadowRoot.innerHTML = template;
        this._dom = {};
        this._dom.progress = this.shadowRoot.getElementById('progress');
        this._dom.progressOutline = this.shadowRoot.getElementById('progress-outline');
        this._dom.progressOutline.addEventListener('click', e => {
            let rect = this._dom.progressOutline.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let width = this._dom.progressOutline.offsetWidth;
            let p = x / width;
            console.log('setvalue', p);
            this.setValue(p);
            this.dispatchEvent(new Event('change'));
        });
        this._value = 0;
    }
    static get observedAttributes() {
        return ['value'];
    }
    attributeChangedCallback(name, oldValue, newValue) { 
        if (name == 'value') {
            this.setValue(Number.parseFloat(newValue));
        }
    }
    setValue(value) {
        this._value = value;
        this._dom.progress.style.width = value * 100 + '%';
    }
    getValue() {
        return this._value;
    }
}
customElements.define('qq-progress', QqProgress);