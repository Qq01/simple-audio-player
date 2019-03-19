const template = `
<style>
<style>
@import url('https://www.w3schools.com/w3css/4/w3.css');
@import url('https://www.w3schools.com/lib/w3-colors-flat.css');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
:host {
    display: block;
}
#canvas {
    background-color: black;
    max-width: 100%;
    max-height: 100%;
}
</style>
<canvas id="canvas" ></canvas>
`.trim();
export class QqAudioVisualizer extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode:'open'});
        this.shadowRoot.innerHTML = template;
        this._dom = {};
        this._dom.canvas = this.shadowRoot.getElementById('canvas');
        this._dom.canvas.width = 800;
        this._dom.canvas.height = 600;
        /**
         * @type {CanvasRenderingContext2D}
         */
        this._ctx = this._dom.canvas.getContext('2d');

        this._isOscilatorActive = true;
        this._isFrequencyBarActive = true;
        this._autoUpdate = true;
        this._raf = (time = 0) => {
            if (this._analyserNode) {
                this.update(this._analyserNode);
            }
            if (this._autoUpdate) {
                requestAnimationFrame(this._raf);
            }
        };
        this._raf();
    }
    setAutoUpdate(autoUpdate) {
        if (this._autoUpdate == false && autoUpdate == true) {
            this._autoUpdate = autoUpdate;
            this._raf();
        } else {
            this._autoUpdate = autoUpdate;
        }
    }
    setAnalyserNode(analyserNode) {
        console.log('analyser set', analyserNode);
        this._analyserNode = analyserNode;
    }
    update = (analyserNode) => {
        this._ctx.clearRect(0, 0, this._dom.canvas.width, this._dom.canvas.height);
        if (this._isOscilatorActive) {
            this._updateOscilloscope(analyserNode);
        }
        if (this._isFrequencyBarActive) {
            this._updateFrequencyBar(analyserNode);       
        }
    }
    /**
     * 
     * @param {AnalyserNode} analyserNode 
     */
    _updateOscilloscope(analyserNode) {
        analyserNode.fftSize = 2048;
        let bufferLength = analyserNode.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);
        analyserNode.getByteTimeDomainData(dataArray);
        //draw
        this._ctx.lineWidth = 2;
        this._ctx.strokeStyle = 'rgb(50, 228, 50)';
        this._ctx.beginPath();
        let sliceWidth = this._dom.canvas.width * 1 / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
            let v = dataArray[i] / 128;
            let y = v * this._dom.canvas.height / 2;
            if (i == 0) {
                this._ctx.moveTo(x, y);
            } else {
                this._ctx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        this._ctx.stroke();
    }

    /**
     * 
     * @param {AnalyserNode} analyserNode 
     */
    _updateFrequencyBar(analyserNode) {
        analyserNode.fftSize = 256;
        let bufferLength = analyserNode.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);
        analyserNode.getByteFrequencyData(dataArray);
        //draw
        let barWidth = (this._ctx.canvas.width / bufferLength);
        let barHeight;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;
            this._ctx.fillStyle = `rgb(50, 50, ${barHeight + 100})`;
            this._ctx.fillRect(x, this._dom.canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }
}
customElements.define('qq-audio-visualizer', QqAudioVisualizer);