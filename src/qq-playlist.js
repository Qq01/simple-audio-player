import {QqAudioFile} from './qq-audio-file.js';
const template = `
<style>
@import url('https://www.w3schools.com/w3css/4/w3.css');
@import url('https://www.w3schools.com/lib/w3-colors-flat.css');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
#filelist {
    height: calc(100vh - 200px);
    overflow-y: auto;
}
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
                this._audioFiles.push(audioFile);
                audioFile.setFile(this._dom.inputFile.files[i]);
                audioFile.addEventListener('click', e => {
                    // this._dom.filelist.querySelectorAll('qq-audio-file').forEach(af => {
                    //     af.setIsActive(false);
                    // });
                    // this.selectedFile = audioFile;
                    // audioFile.setIsActive(true);
                    this._selectAudioFile(audioFile);
                    this.dispatchEvent(new Event('qq-fileselect'));
                });
                let li = document.createElement('li');
                li.appendChild(audioFile);
                this._dom.filelist.appendChild(li);
            }
        });
    }
    _selectAudioFile(audioFile) {
        this._dom.filelist.querySelectorAll('qq-audio-file').forEach(af => {
            af.setIsActive(audioFile == af);
        });
        this.selectedFile = audioFile;
    }

    selectNextAudioFile = () => {
        let nextAudioFile;
        if (this.selectedFile) {
            nextAudioFile = this.selectedFile.parentElement.nextElementSibling;
            if (nextAudioFile) {
                nextAudioFile =  nextAudioFile.firstElementChild;
            }
            console.log('selectNextAudioFile', nextAudioFile);
        }
        if (nextAudioFile == null) {
            nextAudioFile = this._dom.filelist.querySelector('qq-audio-file');
        }
        if (nextAudioFile) {
            this._selectAudioFile(nextAudioFile);
            this.dispatchEvent(new Event('qq-fileselect'));
        }
    }
    selectPreviousAudioFile = () => {
        let previousAudioFile;
        if (this.selectedFile) {
            previousAudioFile = this.selectedFile.parentElement.previousElementSibling;
            if (previousAudioFile) {
                previousAudioFile = previousAudioFile.firstElementChild;
            }
            console.log('selectPreviousAudioFile', previousAudioFile);
        }
        if (previousAudioFile == null) {
            previousAudioFile = this._dom.filelist.querySelector('qq-audio-file:last-child');
        }
        if (previousAudioFile) {
            this._selectAudioFile(previousAudioFile);
            this.dispatchEvent(new Event('qq-fileselect'));
        }
    }
    selectRandomAudioFile = () => {
        let randomAudioFile;
        if (this._audioFiles.length) {
            randomAudioFile = this._audioFiles[Math.floor(Math.random() * this._audioFiles.length)];
        }
        if (randomAudioFile) {
            this._selectAudioFile(randomAudioFile);
            this.dispatchEvent(new Event('qq-fileselect'));
        }
    }
}
customElements.define('qq-playlist', QqPlaylist);