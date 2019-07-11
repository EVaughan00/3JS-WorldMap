import React, { Component } from 'react'
import * as THREE from 'three'
import Earth from '../images/earthmap1k.jpg'
import EarthBump from '../images/worldel.jpg'
import canvasCloud from '../images/earthcloudmap.jpg'
import Galaxy from '../images/galaxy_starfield1.png'
var OrbitControls = require('three-orbit-controls')(THREE)

class DragRotateZoom extends Component {
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
       1062 / 850,
       0.1,
       1000
     )
     const renderer = new THREE.WebGLRenderer()
     renderer.setSize(1062, 850);
     const geometry = new THREE.SphereGeometry(0.5, 60, 60)
     const material = new THREE.MeshPhongMaterial()

     material.map = THREE.ImageUtils.loadTexture(Earth)
     material.bumpMap = THREE.ImageUtils.loadTexture(EarthBump)
     material.bumpScale = 0.03

     var geometryCloud   = new THREE.SphereGeometry(0.51, 32, 32)
     var materialCloud  = new THREE.MeshPhongMaterial({
       map         : THREE.ImageUtils.loadTexture(canvasCloud),
       side        : THREE.DoubleSide,
       opacity     : 0.3,
       transparent : true,
       depthWrite  : false,
     })
     var cloudMesh = new THREE.Mesh(geometryCloud, materialCloud)

     const cube = new THREE.Mesh(geometry, material)

     cube.add(cloudMesh)

     camera.position.z = 1.5

     var geometryStars  = new THREE.SphereGeometry(90, 40, 40)
     // create the material, using a texture of startfield
     var materialStars  = new THREE.MeshBasicMaterial({
       transparent: true
     })
     materialStars.map   = THREE.ImageUtils.loadTexture(Galaxy)
     materialStars.side  = THREE.BackSide
     // create the mesh based on geometry and material
     var mesh  = new THREE.Mesh(geometryStars, materialStars)


     cube.rotation.x = Math.PI/4;
     cube.rotation.y = Math.PI/4;

     cube.add(mesh)

     var isDragging = false;
     var isTouch = false;
     var isZoomed = false;
     var previousMousePosition = {
         x: 0,
         y: 0
     };

     var mX = 0;
     var mY = 0;
     var startmX = 0;
     var startmY = 0;
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
     this.isZoomed = isZoomed


     var quarter = {x: 0.12455425453259228, y: 0.035089862385512365, z: 0.05541988674897867, w: 0.9900422088922909}

     var mouse = {x:0, y:0}

     function toRadians(angle) {
      	return angle * (Math.PI / 180);
     }

      function toDegrees(angle) {
      	return angle * (180 / Math.PI);
      }

     document.addEventListener('keydown', function(e) {
       if (e.keyCode == 82) {
         cube.quaternion.set(quarter.x, quarter.y, quarter.z, quarter.w)
       }
     })

     document.addEventListener('mousedown', function(e) {
         isDragging = true;
     })

     document.addEventListener('touchstart', function(e) {
         isDragging = true;
         isTouch = true;
     })

     document.addEventListener('mousemove', function(e) {

         handleMouseMove(e)

     }, false)
     document.addEventListener('touchmove', function(e) {
       handleMouseMove(e)
     }, false)

    function handleMouseMove(e) {

    e.preventDefault()
        var deltaMove = {}
        if (isTouch) {
           deltaMove = {
             x: e.touches[0].clientX-previousMousePosition.x,
             y: e.touches[0].clientY-previousMousePosition.y
           }
        } else {
          deltaMove = {
             x: e.offsetX-previousMousePosition.x,
             y: e.offsetY-previousMousePosition.y
         }
        }

          if(isDragging) {
              var deltaRotationQuaternion = new THREE.Quaternion()
                  .setFromEuler(new THREE.Euler(
                      toRadians(deltaMove.y * 1),
                      toRadians(deltaMove.x * 1),
                      0,
                      'XYZ'
                  ));

              cube.quaternion.multiplyQuaternions(deltaRotationQuaternion, cube.quaternion);
            }
         if (isTouch) {
          previousMousePosition = {
              x: e.touches[0].clientX,
              y: e.touches[0].clientY
          }
          } else {
          previousMousePosition = {
              x: e.offsetX,
              y: e.offsetY
          };
        }

    }

    document.addEventListener('mouseup', function(e) {
        isDragging = false;
    });
    document.addEventListener('touchend', function(e) {
        isDragging = false;
        isTouch = false;
    });

    //var controls = new OrbitControls( camera, renderer.domElement );

    document.addEventListener('dblclick', async function(e) {
      mX = ( e.pageX / window.innerWidth ) * 2 - 1;
      mY = - ( e.pageY / window.innerHeight ) * 2 + 1;
      var i = 0
      var transitionRatio = 15;
      var zoomValue = 0.8;
      if (!isZoomed) {
        for (i = 0; i < transitionRatio; i++) {
          var vector = new THREE.Vector3(mX, mY, 1 );
          vector.unproject(camera);
          vector.sub(camera.position);
          camera.position.addVectors(camera.position,vector.setLength(zoomValue/transitionRatio));
          await sleep(10)
        }
        startmX = mX
        startmY = mY
        //controls.target.addVectors(controls.target,vector.setLength(0.6));
        isZoomed = true;
      } else {
        for (i = 0; i < transitionRatio; i++) {
          var vector1 = new THREE.Vector3(startmX, startmY, 1 );
          vector1.unproject(camera);
          vector1.sub(camera.position);
          camera.position.addVectors(camera.position,vector1.setLength(-zoomValue/transitionRatio));
          await sleep(10)
        }
        // controls.target.addVectors(controls.target,vector1.setLength(0.6));
        isZoomed = false;
      }
    })

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
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

     this.renderScene()
     this.frameId = window.requestAnimationFrame(this.animate)
   }

   renderScene() {
     this.renderer.render(this.scene, this.camera)
   }

   render() {
     return (
       <div
         style={{ width: '100%', marginRight: 'auto', marginLeft: 'auto', touchAction: 'none'}}
         ref={(mount) => { this.mount = mount }}
       />
     )
   }
}
export default DragRotateZoom
