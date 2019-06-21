import React, { Component } from 'react'
import * as THREE from 'three'
import Earth from '../images/earthmap1k.jpg'
import EarthBump from '../images/earthbump1k.jpg'
import canvasCloud from '../images/earthcloudmap.jpg'

class Sphere extends Component {
  constructor(props) {
     super(props)

     this.start = this.start.bind(this)
     this.stop = this.stop.bind(this)
     this.animate = this.animate.bind(this)
   }

   componentDidMount() {


     const scene = new THREE.Scene()
     const camera = new THREE.PerspectiveCamera(
       50,
       500 / 400,
       0.1,
       1000
     )
     const renderer = new THREE.WebGLRenderer()
     renderer.setSize(500, 400);
     const geometry = new THREE.SphereGeometry(0.5, 32, 32)
     const material = new THREE.MeshPhongMaterial()

     material.map = THREE.ImageUtils.loadTexture(Earth)
     material.bumpMap = THREE.ImageUtils.loadTexture(EarthBump)
     material.bumpScale = 0.05

     var geometryCloud   = new THREE.SphereGeometry(0.51, 32, 32)
     var materialCloud  = new THREE.MeshPhongMaterial({
       map         : THREE.ImageUtils.loadTexture(canvasCloud),
       side        : THREE.DoubleSide,
       opacity     : 0.5,
       transparent : true,
       depthWrite  : false,
     })
     var cloudMesh = new THREE.Mesh(geometryCloud, materialCloud)

     const cube = new THREE.Mesh(geometry, material)

     cube.add(cloudMesh)

     camera.position.z = 1.5

     //var controls  = new THREE.OrbitControls(camera, renderer.domElement)
     scene.add(cube)
     var light = new THREE.DirectionalLight( 0xffffff );
     light.position.set( 1, 0, 1).normalize();
     scene.add(light);
     this.scene = scene
     this.camera = camera
     this.renderer = renderer
     this.material = material
     this.cube = cube

     this.mount.appendChild(this.renderer.domElement)
     this.start()
   }

   componentWillUnmount() {
     this.stop()
     this.mount.removeChild(this.renderer.domElement)
   }

   start() {
     if (!this.frameId) {
       this.frameId = requestAnimationFrame(this.animate)
     }
   }

   stop() {
     cancelAnimationFrame(this.frameId)
   }

   animate() {
     this.cube.rotation.y += 0.001

     this.renderScene()
     this.frameId = window.requestAnimationFrame(this.animate)
   }

   renderScene() {
     this.renderer.render(this.scene, this.camera)
   }

   render() {
     return (
       <div
         style={{ width: '500px', height: '500px' }}
         ref={(mount) => { this.mount = mount }}
       />
     )
   }
}
export default Sphere
