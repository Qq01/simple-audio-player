const template = `
<style>
@import url('https://www.w3schools.com/w3css/4/w3.css');
@import url('https://www.w3schools.com/lib/w3-colors-flat.css');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>
<div>
    <div style="width:30px;display:inline-block;" ><i class="material-icons" id="play-arrow" style="display:none;" >pause</i></div>
    <div style="width:calc(100% - 100px);display:inline-block;" id="filename" class="w3-btn buffering" ></div>
    <div id="btn-remove" class="w3-btn" ><i class="material-icons w3-text-light-grey" >clear</i></div>    
</div>
`.trim();
/**
 * 
 * @param {File} file 
 */
function readFileAsArrayBuffer(file, stateCallback) {
    return new Promise(function(resolve, reject) {
        const fileReader = new FileReader();
        fileReader.onload = function() {
            resolve(fileReader.result);
        };
        fileReader.onerror = function() {
            reject();
        };
        if (stateCallback) {
            fileReader.onprogress = stateCallback;
        }
        fileReader.readAsArrayBuffer(file);
    })
}
export class QqAudioFile extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:'open'});
        this.shadowRoot.innerHTML = template;

        this._name = '';
        this._file = null;
        this._isActive = false;
        this._playPauseState = 'pause';
        this._audioBuffer = null;

        this._dom = {};
        this._dom.filename = this.shadowRoot.getElementById('filename');
        this._dom.playArrow = this.shadowRoot.getElementById('play-arrow');
        this._dom.remove = this.shadowRoot.getElementById('btn-remove');

        this._dom.remove.addEventListener('click', e => {
            this.dispatchEvent(new Event('qq-request-remove'));
        })
    }
    setIsActive = (isActive) => { 
        this._isActive = isActive;
        this._dom.playArrow.style.display = isActive ? null : 'none';
    }
    getIsActive = () => {
        return this._isActive;
    }
    setPlayPauseState = (state) => {
        if (state == 'play') {
            this._playPauseState = state;
            this._dom.playArrow.innerText = 'play_arrow';
        } else if (state == 'pause') {
            this._playPauseState = state;
            this._dom.playArrow.innerText = 'pause';
        }
    }
    /**
     * @param {File} file
     */
    setFile = (file) => {
        this._setName(file.name);
        this._arrayBuffer = null;
        this._file = file;
    }
    getArrayBuffer = async () => {
            let arrayBuffer = await readFileAsArrayBuffer(this._file, data => {
                console.log('loading', data);
            });
            console.log(arrayBuffer);
        return arrayBuffer;
    }
    getAudioBuffer = async (audioContext) => {
        if (this._audioBuffer == null) {
            let arrayBuffer = await this.getArrayBuffer();
            this._audioBuffer = audioContext.decodeAudioData(arrayBuffer);
        }
        return this._audioBuffer;
    }
    /**
     * @param {string} name
     */
    _setName = (name) => {
        this._name = name;
        this._dom.filename.innerText = name;
        this._dom.filename.title = name;
    }

}
customElements.define('qq-audio-file', QqAudioFile);