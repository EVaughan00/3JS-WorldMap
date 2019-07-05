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
     this.rotateAroundWorldAxis = this.rotateAroundWorldAxis.bind(this)
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


     var targetRotationX = 0.5;
                 var targetRotationOnMouseDownX = 0;

                 var targetRotationY = 0.2;
                 var targetRotationOnMouseDownY = 0;

                 var mouseX = 0;
                 var mouseXOnMouseDown = 0;

                 var mouseY = 0;
                 var mouseYOnMouseDown = 0;

                 var windowHalfX = window.innerWidth / 2;
                 var windowHalfY = window.innerHeight / 2;

                 var slowingFactor = 0.25;
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

     this.targetRotationX = targetRotationX;
     this.targetRotationOnMouseDownX = targetRotationOnMouseDownX;

     this.targetRotationY = targetRotationY;
     this.targetRotationOnMouseDownY = targetRotationOnMouseDownY;
     this.mouseX = mouseX;
     this.mouseXOnMouseDown = mouseXOnMouseDown;

     this.mouseY = mouseY;
     this.mouseYOnMouseDown = mouseYOnMouseDown;

     this.windowHalfX = windowHalfX;
     this.windowHalfY = windowHalfY;

     this.slowingFactor =  slowingFactor;


     document.addEventListener('mousedown', onDocumentMouseDown, false)


     function onDocumentMouseDown( event ) {

                     event.preventDefault();

                     document.addEventListener( 'mousemove', onDocumentMouseMove, false );
                     document.addEventListener( 'mouseup', onDocumentMouseUp, false );
                     document.addEventListener( 'mouseout', onDocumentMouseOut, false );

                     mouseXOnMouseDown = event.clientX - windowHalfX;
                     targetRotationOnMouseDownX = targetRotationX;

                     mouseYOnMouseDown = event.clientY - windowHalfY;
                     targetRotationOnMouseDownY = targetRotationY;

                 }

                 function onDocumentMouseMove( event ) {

                mouseX = event.clientX - windowHalfX;

                targetRotationX = (mouseX - mouseXOnMouseDown ) * 0.00025;

                mouseY = event.clientY - windowHalfY;

                targetRotationY = ( mouseY - mouseYOnMouseDown ) * 0.00025;

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
     // this.cube.rotation.y += 0.001
     // this.cloudMesh.rotation.y += 0.001
     // this.mesh.rotation.y -= 0.001


     //this.camera.lookAt( this.scene.position )

     this.renderScene()
     this.frameId = window.requestAnimationFrame(this.animate)
   }

   renderScene() {
     console.log(this.targetRotationX)

     this.rotateAroundWorldAxis(this.cube, new THREE.Vector3(0, 1, 0), this.targetRotationX);
     this.rotateAroundWorldAxis(this.cube, new THREE.Vector3(1, 0, 0), this.targetRotationY);

     this.targetRotationY = this.targetRotationY * (1 - this.slowingFactor);
     this.targetRotationX = this.targetRotationX * (1 - this.slowingFactor);
     this.renderer.render(this.scene, this.camera)
   }

   rotateAroundWorldAxis( object, axis, radians) {

              var rotationMatrix = new THREE.Matrix4();

              rotationMatrix.makeRotationAxis( axis.normalize(), radians );
              rotationMatrix.multiply( object.matrix );                       // pre-multiply
              object.matrix = rotationMatrix;
              object.rotation.setFromRotationMatrix( object.matrix );
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
