import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';

const app = new Clarifai.App({
 apiKey: 'ac49a62b74da4a91a3390332ca0f4686'
});

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

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: ''
    };
  }
  
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  
  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
    app.models.predict("a403429f2ddf4b49b307e318f00e528b", this.state.input).then(
      function(response) {
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      },
      function(err) {
        // there was an error
      }
    );
  }
  
  render() {
    return (
      <div className="App">
        <Particles className='particles' params={particlesOption}/>
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition imageURL={this.state.imageURL}/>
      </div>
    );
  }
}

export default App;
