import React, { Component } from 'react';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';
import Clarifai from 'clarifai';


const app = new Clarifai.App({
    apiKey: '1d009cd362b1461a898add23c34e4420'
});



const particlesOptions = {
    particles: {
        number: {
            value: 40,
            density: {
                enable: true,
                value_area: 1500,
            }
        },
        size: {
            value: 0,
            random: true,
        },
        opacity: {
            value: 1,
        },
        line_linked: {
            color: '#EE4B6A'
        },
        move: {
            enable: true,
            speed: 3,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        onresize: {
            density_auto: true
        }
    }
}

const initialState = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
    }
}
class App extends Component {
    constructor() {
        super();
        this.state = initialState;
    }
    loadUser = (data) => {
        this.setState({user: {
            id: data.id,
            name: data.name,
            email: data.email,
            entries: data.entries,
            joined: data.joined
        }})
    }


    calculateFaceLocation = (data) => {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
        }
    }

    displayFaceBox = (box) => {
        this.setState({box: box});
    }

    onInputChange = (event) => {
        this.setState({input: event.target.value});
    }

    onButtonSubmit = () => {
        this.setState({imageUrl: this.state.input});
        /*fetch('https://face-rec-server.herokuapp.com/imageurl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                input: this.state.input
            })
        })*/

        /* Moved to backend. It Predicts the contents of an image by passing in a URL.
        */
        app.models
            .predict(
                Clarifai.FACE_DETECT_MODEL,
                this.state.input)

            .then(response => {
                if (response) {
                    fetch('https://face-rec-server.herokuapp.com/image', {
                        method: 'put',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            id: this.state.user.id
                        })
                    })
                        .then(response => response.json())

                        .then(count => {
                            this.setState(Object.assign(this.state.user, {entries: count}))
                        })
                        .catch(console.log);

                }
                this.displayFaceBox(this.calculateFaceLocation(response))
            })
            .catch(console.log);
    }

    onRouteChange = (route) => {
        if (route === 'signout') {
            this.setState(initialState)
        } else if (route === 'home') {
            this.setState({isSignedIn: true})
        }
        this.setState({route: route});
    }

    render()
    {
        const {isSignedIn, imageUrl, route, box} = this.state;
        return (
            <div className="App">
                <Particles className='particles'
                           params={particlesOptions}
                />

                <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>

                {/*We need both Particles and Navigation to be there no matter what the state is (SignIn or HomePage */}


                {route === 'home'
                    ? <div>
                        <Logo/>
                        <Rank
                            name={this.state.user.name}
                            entries={this.state.user.entries}
                        />
                        <ImageLinkForm
                            onInputChange={this.onInputChange}
                            onButtonSubmit={this.onButtonSubmit}
                        />
                        <FaceRecognition box={box} imageUrl={imageUrl}/>
                    </div>
                    : (
                        route === 'signin'
                            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                    )
                }
            </div>
        );
    }
}

export default App;
