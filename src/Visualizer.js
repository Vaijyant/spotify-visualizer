import { useEffect } from 'react'
import axios from 'axios'

export default function Visualizer({ audioAnalysis }) {

    console.log(audioAnalysis)
    return <div>{JSON.stringify(audioAnalysis)}</div>
}