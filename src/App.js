import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
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

class App extends Component {
  render() {
    return (
      <div className="App">
        <Particles className='particles' params={particlesOption}/>
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm />
        {/*<FaceRecognition />*/}
      </div>
    );
  }
}

export default App;
