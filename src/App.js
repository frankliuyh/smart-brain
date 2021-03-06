import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import './App.css';

const particlesOption = {
	particles: {
		number: {
		  value: 30,
		  density: {
		    enable: true,
		    value_area: 500
		  }
		}
	}
};

const initialState = {
    input: '',
    imageURL: '',
    boxes: [],
    route: 'signin',
    isSignedIn: false,
    user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
    }
};

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
    }});
  }

  calculateFaceLocations = (data) => {
    return data.outputs['0'].data.regions.map(face => {
      const clarifaiFace = face.region_info.bounding_box
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      };
    });
  }
  
  displayFaceBoxes = (boxes) => {
    this.setState({boxes: boxes});
  }
  
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  
  onButtonSubmit = () => {
    const predict = () => {
      fetch('https://frankliuyh-smart-brain-api.herokuapp.com/imageurl', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageURL: this.state.imageURL
        })
      }).then(response => response.json())
      .then(response => {
        if(response) {
          fetch('https://frankliuyh-smart-brain-api.herokuapp.com/image', {
            method: 'put',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id: this.state.user.id
            })
          }).then(response => response.json()).then(count => {
              this.setState(Object.assign(this.state.user, {entries: count}));
            });
        }
        this.displayFaceBoxes(this.calculateFaceLocations(response));
      })
      .catch(err => console.log(err));
    };
    this.setState({imageURL: this.state.input}, predict);
  }
  
  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState);
    } else if(route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }
  
  render() {
    const {isSignedIn, route, boxes, imageURL} = this.state;
    return (
      <div className="App">
        <Particles className='particles' params={particlesOption}/>
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
        { route === 'home' ?
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition boxes={boxes} imageURL={imageURL}/>
          </div> :
          (route === 'register' ? <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> : <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />)
        }
      </div>
    );
  }
}

export default App;
