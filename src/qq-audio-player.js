import {QqProgress} from './qq-progress.js';
const template = `
<style>
@import url('https://www.w3schools.com/w3css/4/w3.css');
@import url('https://www.w3schools.com/lib/w3-colors-flat.css');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
:host {
    display: block;
}
</style>
<div class="w3-center" >
    <span id="audio-current-time" >n/a</span>
    <!--<input type="range" id="input-range-progress" style="width:100%;max-width:500px;" value="0" disabled >-->
    <qq-progress id="progress" style="width:100%;max-width:500px;" ></qq-progress>
    <span id="audio-duration" >n/a</span>
</div>
<div class="w3-row w3-padding w3-margin w3-flat-wet-asphalt" >
    <div class="w3-col s3" >&nbsp;</div>
    <div class="w3-col s6 w3-center" >
        <button id="btn-shuffle" class="w3-btn" ><i class="material-icons" >shuffle</i></button>
        <button id="btn-track-previous" class="w3-btn" ><i class="material-icons" >skip_previous</i></button>
        <button id="btn-track-play-pause" class="w3-btn" ><i class="material-icons" >play_arrow</i></button>
        <button id="btn-track-next" class="w3-btn" ><i class="material-icons" >skip_next</i></button>
        <button id="btn-loop" class="w3-btn" ><i class="material-icons" >loop</i></button>
    </div>
    <div class="w3-col s3 w3-right-align" >
        <i class="material-icons" >volume_up</i>
        <qq-progress id="volume" style="width:100px" value="1" ></qq-progress>
        <!--<input type="range" id="input-range-volume" min="0" max="1" step="0.01" value="0.5" >-->
    </div>
</div>
`.trim();
function formatTime(time) {
    let str = '';
    var min = Math.floor(time / 60);
    var sec = (time % 60).toFixed(0);
    str = min + ":" + (sec < 10 ? '0' : '') + sec;
    return str;
}
export class QqAudioPlayer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:'open'});
        this.shadowRoot.innerHTML = template;
        this._audioContext = null; //new AudioContext();
        this._gainNode = null; //this._audioContext.createGain();
        this._currentSource = null;
        this._isPlaying = false;
        this._audioFile = null;

        this._dom = {};
        this._dom.btnTrackPlayPause = this.shadowRoot.getElementById('btn-track-play-pause');
        this._dom.volume = this.shadowRoot.getElementById('volume');
        this._dom.audioCurrentTime = this.shadowRoot.getElementById('audio-current-time');
        this._dom.audioDuration = this.shadowRoot.getElementById('audio-duration');
        this._dom.progress = this.shadowRoot.getElementById('progress');

        this._dom.progress.addEventListener('change', e => {
            this.pause();
            let time = this._dom.progress.getValue() * this._audioBuffer.duration;
            this.play(time);
            this._playbackTime = time;
        });

        this._dom.volume.addEventListener('change', e => {
            this.setVolume(this._dom.volume.getValue());
        });
        this._dom.btnTrackPlayPause.addEventListener('click', e => {
            if (this.getIsPlaying()) {
                this.pause();
            } else {
                this.play(this._playbackTime);
            }
        });
        this._playbackTime = 0;
        let rafPreviousTime = 0;
        let rafDeltaTime = 0;
        const rafUpdate = (time = 0) => {
            rafDeltaTime = time - rafPreviousTime;
            rafPreviousTime = time;
            if (this.getIsPlaying()) {
                if (this._audioBuffer) {
                    this._playbackTime += rafDeltaTime / 1000;
                    this._dom.audioCurrentTime.innerText = formatTime(this._playbackTime);
                    // this._dom.audioCurrentTime.innerText = this._playbackTime;
                    const rate = Math.min(this._playbackTime / this._audioBuffer.duration, 1);
                    if (rate >= 1) {
                        this._setIsPlaying(false);
                        this._playbackTime = 0;
                    }
                    this._dom.progress.setValue(rate);
                }
            }
            requestAnimationFrame(rafUpdate);
        }
        rafUpdate();

        // setInterval(() => {
        //     if (this._isPlaying)
        //     if (this._audioBuffer) {
        //         this._dom.audioDuration.innerText = formatTime(this._audioBuffer.duration);
        //         this._playbackTime = (Date.now() - this._startTime) / 1000;
        //         this._dom.audioCurrentTime.innerText = formatTime(this._playbackTime);
        //         const rate = Math.min(this._playbackTime / this._audioBuffer.duration, 1);
        //         if (rate >= 1) {
        //             this._isPlaying = false;
        //         }
        //         this._dom.progress.setValue(rate);
        //     }
        // }, 500);
    }
    setVolume = (volume) => {
        this._dom.volume.setValue(volume);
        this._gainNode.gain.value = volume;
    }
    getVolume = () => {
        return this._gainNode.gain.value;
    }
    _setIsPlaying(isPlaying) {
        this._isPlaying = isPlaying;
        this._dom.btnTrackPlayPause.querySelector('i').innerText = isPlaying ? 'pause' : 'play_arrow';
        this._audioFile.setPlayPauseState(isPlaying ? 'play' : 'pause');
    }
    getIsPlaying() {
        return this._isPlaying;
    }
    setAudioFile = (audioFile) => {
        if (this.getIsPlaying()) {
            this.pause();
        }
        this._audioFile = audioFile;
        this._audioFile.getArrayBuffer().then(this._setAudioFileArrayBuffer).then(() => {
            if (this.getIsPlaying()) {
                this.play();
            }
        });
    }
    _setAudioFileArrayBuffer = async (audioFileArrayBuffer) => {
        console.log('audio file set', audioFileArrayBuffer);
        this._attachAudioContext();
        this._audioFileArrayBuffer = audioFileArrayBuffer;
        this._audioBuffer = await this._audioContext.decodeAudioData(audioFileArrayBuffer);
        
        this._audioBuffer.onstatechange = function(e) {
            console.log('audio buffer state change', e);
        }
        console.log('audio file decoded', this._audioBuffer);
        this._dom.audioDuration.innerText = formatTime(this._audioBuffer.duration);
    }
    _attachAudioContext = () => {
        if (this._audioContext == null) {
            this._audioContext = new AudioContext();
            this._audioContext.onstatechange = function(e) {
                console.log('audio context state change', e);
            }
            this._gainNode = this._audioContext.createGain();
            this._gainNode.connect(this._audioContext.destination);
            // this._gainNode.gain.value = 1;
        }
    }
    play = (time = 0) => {
        this._dom.btnTrackPlayPause.querySelector('i').innerText = 'pause';
        console.log('plaing sound');
        this._attachAudioContext();
        console.log(this._audioContext.state);
        if (this._audioContext.state == 'suspended') {
            this._audioContext.resume();
        }
        const source = this._audioContext.createBufferSource();
        source.onstatechange = function(e) {
            console.log('source change', e);
        };
        source.buffer = this._audioBuffer;
        source.connect(this._gainNode);
        // source.connect(this._audioContext.destination);
        let track = null;
        source.start(0, time);
        this._currentSource = source;
        this._startTime = Date.now();
        this._setIsPlaying(true);
    }
    stop = () => {
        this._playbackTime = 0;
        this.pause();
    }
    pause = () => {
        this._dom.btnTrackPlayPause.querySelector('i').innerText = 'play_arrow';
        this._setIsPlaying(false);
        if (this._currentSource) {
            this._currentSource.stop(0);
        }
    }
}
customElements.define('qq-audio-player' , QqAudioPlayer);