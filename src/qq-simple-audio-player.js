import {QqAudioPlayer} from './qq-audio-player.js';
import {QqPlaylist} from './qq-playlist.js';
import { QqAudioVisualizer } from './qq-audio-visualizer.js';
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
    <qq-playlist id="playlist" class="w3-col s12 m6 l3" ></qq-playlist>
    <qq-audio-visualizer id="av" class="w3-col s12 m6 l6 w3-center" ></qq-audio-visualizer>
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
        this._dom.av = this.shadowRoot.getElementById('av');
        this._dom.audioPlayer = this.shadowRoot.getElementById('audio-player');
        this._dom.playlist = this.shadowRoot.getElementById('playlist');
        this._dom.playlist.addEventListener('qq-fileselect', e => {
            this._dom.audioPlayer.setAudioFile(this._dom.playlist.selectedFile);
            // this._dom.playlist.selectedFile.getArrayBuffer().then(arrayBuffer => {
            //     this._dom.audioPlayer.setAudioFile(arrayBuffer);
            // });
        });
        // this._dom.playlist.addEventListener('qq-fileremove', e => {
        //     if (this._dom.playlist.selectedFile == e.detail.removedFile) {
        //         this._dom.playlist.selectNextAudioFile();
        //     }
        // });
        this._dom.audioPlayer.addEventListener('qq-request-next-audio', e => {
            this._dom.playlist.selectNextAudioFile();
        });
        this._dom.audioPlayer.addEventListener('qq-request-previous-audio', e => {
            this._dom.playlist.selectPreviousAudioFile();
        });
        this._dom.audioPlayer.addEventListener('qq-request-random-audio', e => {
            this._dom.playlist.selectRandomAudioFile();
        });

        // this._dom.audioPlayer.addEventListener('qq-analyser-update', e => {
        //     this._dom.av.update(this._dom.audioPlayer.getAnalyser());
        // });
        const init = () => {
            this._dom.audioPlayer.removeEventListener('qq-analyser-update', init);
            this._dom.av.setAnalyserNode(this._dom.audioPlayer.getAnalyser());
        }
        this._dom.audioPlayer.addEventListener('qq-analyser-update', init);
    }
}

customElements.define('qq-simple-audio-player', QqSimpleAudioPlayer);