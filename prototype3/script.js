import * as THREE from 'three';
import * as dat from "lil-gui"
import {OrbitControls} from "OrbitControls"


/*********
 * SETUP *
 ********/

//Sizes
const sizes ={
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}



/**********
 ** SCENE**  
***********/


// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('black')

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
scene.add (camera)
camera.position.set(10, 2, 7.5)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/***********
 ** MESHES**
 ***********/

//Cave
const caveGeometry = new THREE.PlaneGeometry(15.5,7.5)
const caveMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('white'),
    side: THREE.DoubleSide
})
const cave = new THREE.Mesh(caveGeometry, caveMaterial)
cave.rotation.y = Math.PI * 0.5
cave.receiveShadow = true
scene.add(cave)

//Objects
// Sphere Geometry
const sphereGeometry = new THREE.SphereGeometry(0.75, 32, 32)
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 'orange' })

// Left Sphere
const sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere1.position.set(6, 1, -1)
sphere1.castShadow = true
scene.add(sphere1)

// Right Sphere
const sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere2.position.set(6, 1, 1)
sphere2.castShadow = true
scene.add(sphere2)


// Cylinder Geometry
const cylinderGeometry = new THREE.CylinderGeometry(0.25, 0.25, 2, 32)
const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 'gray' })

const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
cylinder.position.set(6, -1, 0)
cylinder.rotation.x = Math.PI * 0.5
cylinder.castShadow = true
scene.add(cylinder)

/***********
 ** LIGHTS**
 ***********/
//Ambient Light
//const ambientLight = new THREE.AmbientLight(0x404040)
//const ambientLight = new THREE.AmbientLight(
    //new THREE.Color ('white')
//)
    //scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(
        new THREE.Color('white'),
        0.5
    )
    scene.add(directionalLight)
    directionalLight.position.set(20, 4.1, 0)
    directionalLight.target = cave
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048

    //Directional Light Helper
    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
    //scene.add(directionalLightHelper)


/******
 * UI *
 ******/
//UI
const ui = new dat.GUI()

const lightPositionFolder = ui.addFolder ('Light Position')

lightPositionFolder
    .add(directionalLight.position, 'y')
    .min(-10)
    .max(10)
    .step(0.1)
    .name('y')

lightPositionFolder
    .add(directionalLight.position, 'z')
    .min(-10)
    .max(10)
    .step(0.1)
    .name('z')


/******************
** ANIMATION LOOP**
*******************/

const clock = new THREE.Clock()

const animation = () =>
{
    //Return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    //Animate Objects
    sphere1.rotation.y = elapsedTime
    sphere2.rotation.y = elapsedTime
    cylinder.rotation.y = elapsedTime

    //Update directionalLightHelper
    directionalLightHelper.update()

    //Update OrbitControls
    controls.update()

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
}

animation()