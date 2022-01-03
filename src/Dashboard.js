import { useState, useEffect } from 'react'
import useAuth from './useAuth'
import { Container, Form } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResult from './TrackSearchResult'
import Player from './Player'
import axios from 'axios'
import { BFF_URI } from './constants'

const spotifyApi = new SpotifyWebApi({
    clientId: "3161af22a7714180bef6dbfe9a6fec9f"
})

export default function Dashboard({ code }) {
    const accessToken = useAuth(code)
    const [search, setSearch] = useState("")
    const [serachResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()
    const [lyrics, setLyrics] = useState("")

    function chooseTrack(track) {
        setPlayingTrack(track)
        setSearch("")
        setLyrics("")
    }

    useEffect(() => {
        if (!playingTrack) return
        axios.get(BFF_URI + "/lyrics", {
            params: {
                track: playingTrack.title,
                artist: playingTrack.artist
            }
        }).then(res => {
            setLyrics(res.data.lyrics)
        })
    }, [playingTrack])

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])


    useEffect(() => {
        if (!search) return setSearchResults([])
        if (!accessToken) return

        let cancel = false

        spotifyApi.searchTracks(search).then(res => {
            if (cancel) return
            setSearchResults(
                res.body.tracks.items.map(track => {
                    const smalestAlbumImage = track.album.images.reduce((smallest, image) => {
                        if (image.height < smallest.height) return image
                        return smallest
                    }, track.album.images[0])

                    return {
                        artist: track.artists[0].name,
                        title: track.name,
                        uri: track.uri,
                        albumUrl: smalestAlbumImage.url
                    }
                }))
        })

        return () => cancel = true
    }, [search, accessToken])

    return (
        <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
            <Form.Control
                type="search"
                placeholder="Search Songs/Artists"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
                {serachResults.map(track => (
                    <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack} />
                ))}
                {serachResults.length === 0 && (
                    <div className="text-center" style={{ whiteSpace: "pre" }}>
                        {lyrics}
                    </div>
                )}
            </div>
            <div><Player accessToken={accessToken} trackUri={playingTrack?.uri} /></div>
        </Container>












    )
}