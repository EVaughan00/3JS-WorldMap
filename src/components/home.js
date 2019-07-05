import React, { Component } from 'react'
import Sphere from '../objects/Sphere'
import DragRotateZoom from '../objects/dragRotateZoom'

class Home extends Component {
  render() {
    return (
      <div>
        <header>
          <h1 style={{color: 'white'}}>Evan's World Travel Simulation</h1>
        </header>
          <DragRotateZoom/>
      </div>
    )
  }
}

export default Home
