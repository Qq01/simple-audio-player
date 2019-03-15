import {QqAudioPlayer} from './qq-audio-player.js';
import {QqPlaylist} from './qq-playlist.js';
const template = `
<style>
@import url('https://www.w3schools.com/w3css/4/w3.css');
@import url('https://www.w3schools.com/lib/w3-colors-flat.css');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
:host {
    display: block;
}
</style>
<div class="w3-row" >
    <qq-playlist id="playlist" class="w3-col s3" ></qq-playlist>
</div>
<qq-audio-player id="audio-player"></qq-audio-player>
`.trim();

export class QqSimpleAudioPlayer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:'open'});
        this.shadowRoot.innerHTML = template;
        this._audioFiles = [];
        this._dom = {};
        this._dom.audioPlayer = this.shadowRoot.getElementById('audio-player');
        this._dom.playlist = this.shadowRoot.getElementById('playlist');
        this._dom.playlist.addEventListener('qq-fileselect', e => {
            this._dom.audioPlayer.setAudioFile(this._dom.playlist.selectedFile);
            // this._dom.playlist.selectedFile.getArrayBuffer().then(arrayBuffer => {
            //     this._dom.audioPlayer.setAudioFile(arrayBuffer);
            // });
        });
    }
}

customElements.define('qq-simple-audio-player', QqSimpleAudioPlayer);