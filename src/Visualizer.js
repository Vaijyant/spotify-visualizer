import React, { useRef, useEffect, useState } from 'react'
import opening from './opening.wav'

export default function Visualizer({ audioAnalysis }) {

    const [audioData, setAudioData] = useState();
    const [visualizer, setVisualizer] = useState();

    console.log(audioAnalysis);


    let animator = (analyser, canvas, ctx) => {

        function animate() {
            const bufferLength = analyser.frequencyBinCount;
            console.log("Buffer: " + bufferLength);
            const dataArray = new Uint8Array(bufferLength);


            const barWidth = canvas.width / bufferLength;
            let barHeight;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            analyser.getByteFrequencyData(dataArray);

            let x = 0;
            visualize(canvas, ctx, x, bufferLength, barHeight, barWidth, dataArray)
            requestAnimationFrame(animate);
        }

        animate();


    }

    function visualize(canvas, ctx, x, bufferLength, barHeight, barWidth, dataArray) {
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] * 3;
            const red = i  * barHeight / 20;
            const green = i * 4;
            const blue = barHeight /2 ;
            ctx.fillStyle = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth;

        }
    }


    const canvasRef = useRef(null)
    useEffect(() => {
        if (!audioData || !visualizer) return;

        let canvas = canvasRef.current;
        let canvasContext = canvas.getContext('2d');

        let audio = new Audio();
        audio.src = audioData;
        audio.play();


        let audioContext = new AudioContext();
        let audioSource = audioContext.createMediaElementSource(audio);

        let audioAnalyser = audioContext.createAnalyser();
        audioSource.connect(audioAnalyser);
        audioAnalyser.connect(audioContext.destination);
        audioAnalyser.fftSize = 1024;

        visualizer(audioAnalyser, canvas, canvasContext)

    }, [audioData, visualizer])


    function playSound() {
        setAudioData(opening)
        setVisualizer(() => animator)
    }


    return <div style={{ backgroundColor: "black", height: "100%" }} onClick={playSound}>
        <canvas ref={canvasRef} style={{ backgroundColor: "black" }} width="800px" height="820px"></canvas>
    </div>
}