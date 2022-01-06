import React, { useRef, useEffect,useState } from 'react'
import opening from './opening.wav'

export default function Visualizer({ audioAnalysis }) {


    console.log(audioAnalysis);

    
   


    let animator = (analyser, canvas, ctx) => {
    
        
        console.log(canvas.width);
        console.log(canvas.height);
        
        
        function animate() {
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
    
    
            const barWidth = canvas.width/bufferLength;
            let barHeight;
           
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            analyser.getByteFrequencyData(dataArray);
            console.log(dataArray);
            
            for(let i=0; i<bufferLength; i++) {
                let  x = 0;
                barHeight = dataArray[i];
                ctx.fillStyle = 'white';
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth;
    
            }
            requestAnimationFrame(animate);
        }
        animate();
    }
   

    const canvasRef = useRef(null)
    useEffect(() => {

        let audio1 = new Audio();
        audio1.src = opening;
        audio1.play();
    
        const audioCtx = new AudioContext();
        let audioSource = audioCtx.createMediaElementSource(audio1);
        let audioAnalyser = audioCtx.createAnalyser();
        audioSource.connect(audioAnalyser);
        audioAnalyser.connect(audioCtx.destination);
        audioAnalyser.fftSize = 128;

        let canvas = canvasRef.current;
        let ctx = canvas.getContext('2d');

        animator(audioAnalyser, canvas, ctx)
        
      }, [])
  

    function playSound() {
       
    }

   
    return <div style={{ height: "100%"  }} onClick={playSound}>
        <canvas ref={canvasRef} style={{ backgroundColor: "black", height: "100%", width: "100%" }}></canvas>
    </div>
}