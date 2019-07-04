import React, { Component } from 'react'
import Sphere from '../objects/Sphere'
import DragRotate from '../objects/dragRotate'

class Home extends Component {
  render() {
    return (
      <div>
        <header>
          <h1 style={{color: 'white'}}>Evan's World Travel Simulation</h1>
        </header>
          <DragRotate/>
      </div>
    )
  }
}

export default Home
