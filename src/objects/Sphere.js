import React, { Component } from 'react'
import * as THREE from 'three'
import Earth from '../images/earthmap1k.jpg'
import EarthBump from '../images/earthbump1k.jpg'
import canvasCloud from '../images/earthcloudmap.jpg'
import Galaxy from '../images/galaxy_starfield.jpeg'

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
       90,
       750 / 600,
       0.1,
       1000
     )
     const renderer = new THREE.WebGLRenderer()
     renderer.setSize(750, 600);
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

     var geometryStars  = new THREE.SphereGeometry(80, 32, 32)
     // create the material, using a texture of startfield
     var materialStars  = new THREE.MeshBasicMaterial()
     materialStars.map   = THREE.ImageUtils.loadTexture(Galaxy)
     materialStars.side  = THREE.BackSide
     // create the mesh based on geometry and material
     var mesh  = new THREE.Mesh(geometryStars, materialStars)




    cube.add(mesh)
     //scene.background = bgTexture;
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
     this.cloudMesh = cloudMesh
     this.mesh = mesh

     var mouse = {x:0, y:0}

     document.addEventListener('mousedown', onDocumentMouseDown, false)

     function onDocumentMouseDown( event ) {

                     event.preventDefault();

                     document.addEventListener( 'mousemove', onDocumentMouseMove, false );
                     document.addEventListener( 'mouseup', onDocumentMouseUp, false );
                     document.addEventListener( 'mouseout', onDocumentMouseOut, false );


                 }

                 function onDocumentMouseMove( event ) {

                   mouse.x = (event.clientX / window.innerWidth ) - 0.5
                   mouse.y = (event.clientY / window.innerHeight) - 0.5
                 }

                 function onDocumentMouseUp( event ) {

                     document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
                     document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
                     document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
                 }

                 function onDocumentMouseOut( event ) {

                     document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
                     document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
                     document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
                 }

     this.mouse = mouse




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
     this.cloudMesh.rotation.y += 0.001
     this.mesh.rotation.y -= 0.001

     this.camera.position.x += (this.mouse.x*5 - this.camera.position.x) * 1
     this.camera.position.y += (this.mouse.y*5 - this.camera.position.y) * 1
     this.camera.lookAt( this.scene.position )

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
