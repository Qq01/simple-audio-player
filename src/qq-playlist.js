import {QqAudioFile} from './qq-audio-file.js';
const template = `
<style>
@import url('https://www.w3schools.com/w3css/4/w3.css');
@import url('https://www.w3schools.com/lib/w3-colors-flat.css');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>
<label class="w3-btn w3-block w3-flat-wet-asphalt" >
    Add music
    <input id="input-file" type="file" accept="audio/*" style="display:none" multiple >
</label>
<ul id="filelist" class="w3-ul" ></ul>
`.trim();

export class QqPlaylist extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:'open'});
        this.shadowRoot.innerHTML = template;
        this._audioFiles = [];
        this._dom = {};
        this._dom.inputFile = this.shadowRoot.getElementById('input-file');
        this._dom.filelist = this.shadowRoot.getElementById('filelist');
        this.selectedFile = null;

        this._dom.inputFile.addEventListener('input', e => {
            for (let i = 0; i < this._dom.inputFile.files.length; i++) {
                let audioFile = new QqAudioFile();
                audioFile.setFile(this._dom.inputFile.files[i]);
                audioFile.addEventListener('click', e => {
                    this._dom.filelist.querySelectorAll('qq-audio-file').forEach(af => {
                        af.setIsActive(false);
                    });
                    this.selectedFile = audioFile;
                    audioFile.setIsActive(true);
                    this.dispatchEvent(new Event('qq-fileselect'));
                });
                let li = document.createElement('li');
                li.appendChild(audioFile);
                this._dom.filelist.appendChild(li);
            }
        });
    }
}
customElements.define('qq-playlist', QqPlaylist);