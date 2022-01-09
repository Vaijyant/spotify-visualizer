import React from 'react'
import { Container } from 'react-bootstrap'
import * as Constants from './constants'

export default function Login() {
    let authUrl = Constants.AUTH_URL + '?client_id=' +   Constants.CLIENT_ID 
    + '&response_type=code&redirect_uri=' + Constants.REDIRECT_URI 
    + '&scope=' + encodeURIComponent(Constants.SCOPE)
    return (
       <Container className="d-flex justify-content-center align-items-center"
       style={{ minHeight: "100vh"}}>
           <a className="btn btn-success btn-lg" href={authUrl}>Login with Spotify</a>
       </Container>
    )
}