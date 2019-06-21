import React, { Component } from 'react'
import Sphere from '../objects/Sphere'

class Home extends Component {
  render() {
    return (
      <div>
        <header>
          <h1>Evan's World Travel Simulation</h1>
        </header>
          <Sphere />
      </div>
    )
  }
}

export default Home
