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



//Resizing 
window.addEventListener('resize' , () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.aspectRatio = window.innerWidth / window.innerHeight
    
    // Update camera
    camera.aspect = sizes.aspectRatio
    camera.updateProjectionMatrix()

    //Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})


/**********
 ** SCENE**  
***********/


// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('gray')

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
scene.add (camera)
camera.position.set(0, 12, -20)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)

//COntrols
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


/***********
** LIGHTS **
************/
//Directional Light
const directionalLight = new THREE.DirectionalLight(0x404040, 100)
scene.add(directionalLight)
directionalLight.position.set(5, 15, 5)


/************
 ** MESHES **
 ***********/

//cube geometry
const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

const drawCube = (height, params, index = 0) =>
{
    //create cube material
    const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(params.color)
    })

    if(params.wireframe)
    {
        material.wireframe = true
    }

    //Create cube
    const cube = new THREE.Mesh(cubeGeometry, material)

    //Position cube
    if (params === uiObj.term3) {
        // GRID LOGIC
        const gridSize = Math.ceil(Math.sqrt(params.nCubes))
        const spacing = params.diameter / gridSize

        const row = Math.floor(index / gridSize)
        const col = index % gridSize

        cube.position.x = (col - (gridSize - 1) / 2) * spacing
        cube.position.z = (row - (gridSize - 1) / 2) * spacing
    } else {
        // DEFAULT RANDOM
        cube.position.x = (Math.random() - 0.5) * params.diameter
        cube.position.z = (Math.random() - 0.5) * params.diameter
    }

    cube.position.y = height - 10

    cube.userData.baseX = cube.position.x
    cube.userData.baseZ = cube.position.z
    cube.userData.isTerm1 = (params === uiObj.term1)
    cube.userData.isTerm2 = (params === uiObj.term2)
    cube.userData.offset = Math.random() * Math.PI * 2

    //Scale Cube
    cube.scale.x = params.scale
    cube.scale.y = params.scale
    cube.scale.z = params.scale

    //Randomize cube rotation
    if(params.randomized){
        cube.rotation.x = Math.random() * 2 * Math.PI
        cube.rotation.z = Math.random() * 2 * Math.PI
        cube.rotation.y = Math.random() * 2 * Math.PI
    }

    // Add cube to scene
    params.group.add(cube)
}



//drawCube(0, 'red')
//drawCube(1, 'green')
//drawCube(2, 'yellow')
//drawCube(3, 'blue')

/******
 * UI *
 ******/
//UI
const ui = new dat.GUI()

let preset = {}

// Groups

const group1 = new THREE.Group()
scene.add(group1)
const group2 = new THREE.Group()
scene.add(group2)
const group3 = new THREE.Group()
scene.add(group3)

const uiObj = {
    sourceText: "",
    saveSourceText() {
        saveSourceText()
    },
    term1: {
        term: 'sam' ,
        color: '#00c3ff',
        group: group1,
        diameter: 5,
        nCubes: 25,
        randomized: true,
        scale: 1.6,
        wireframe: false
    },
    term2: {
        term: 'clu' ,
        color: '#ff8800',
        group: group2,
        diameter: 15,
        nCubes: 50,
        randomized: false,
        scale: 1,
        wireframe: false
    },
    term3: {
        term: 'grid' ,
        color: '#ffffff',
        group: group3,
        diameter: 20,
        nCubes: 100,
        randomized: false,
        scale: 1.3,
        wireframe: true
    },
    saveTerms() {
        saveTerms()
    },
    rotateCamera: false

}

// UI Functions
const saveSourceText = () =>
{
    // UI
    preset = ui.save()
    textFolder.hide()
    termsFolder.show()
    visualizeFolder.show()

    // Text Analysis
    tokenizeSourceText(uiObj.sourceText)

}

const saveTerms = () =>
{
    // UI
    preset = ui.save
    visualizeFolder.hide()
    cameraFolder.show()
    
    //Text Analysis
    findSearchTermInTokenizedText(uiObj.term1)
    findSearchTermInTokenizedText(uiObj.term2)
    findSearchTermInTokenizedText(uiObj.term3)

}

// Text Folder
const textFolder = ui.addFolder("Source Text")

textFolder
    .add(uiObj, 'sourceText')
    .name("Source Text")

textFolder  
    .add(uiObj, 'saveSourceText')
    .name("Save")

//Terms, Visualize and camera Folders
const termsFolder = ui.addFolder("Search Terms")
const visualizeFolder = ui.addFolder("Visualize")
const cameraFolder = ui.addFolder("Camera")


termsFolder
    .add(uiObj.term1, 'term')
    .name("Term 1")

termsFolder
    .add(group1, 'visible')
    .name("Term 1 Visibility")

termsFolder
    .addColor(uiObj.term1, 'color')
    .name("Term 1 Color")

termsFolder
    .add(uiObj.term2, 'term')
    .name("Term 2")

termsFolder
    .add(group2, 'visible')
    .name("Term 2 Visibility")

termsFolder
    .addColor(uiObj.term2, 'color')
    .name("Term 2 Color")

termsFolder
    .add(uiObj.term3, 'term')
    .name("Term 3")

termsFolder
    .add(group3, 'visible')
    .name("Term 3 Visibility")

termsFolder
    .addColor(uiObj.term3, 'color')
    .name("Term 3 Color")

visualizeFolder
    .add(uiObj, 'saveTerms')
    .name("Visualize")

cameraFolder
    .add(uiObj, 'rotateCamera')
    .name("Turntable")

// Terms, Visualize and Camera folders are hidden by default
termsFolder.hide()
visualizeFolder.hide()
cameraFolder.hide()


/****************** 
** TEXT ANALYSIS **
*******************/
//SourceText

//variables
let parsedText, tokenizedText

// Parse and Tokenize sourceText
const tokenizeSourceText = (sourceText) =>
{
    //Strip periods and downcase sourceText
    parsedText = sourceText.replaceAll(".", "").toLowerCase()

    //Tokenize text
    tokenizedText = parsedText.split(/[^\w']+/)
}

// find searchTerm in tokenizedText
const findSearchTermInTokenizedText = (params) =>
{
    // Use a for loop to go through the tokenizedText array
    for (let i=0; i < tokenizedText.length; i++)
    {
        // if tokenizedText[i] matches our searchTerm, then we draw a cube
        if(tokenizedText[i] === params.term) {
            //convert i into height, which is a value between 0 and 20
            const height = (100 / tokenizedText.length) * i * 0.2

            //call drawCube function nCubes times usinf converted height value
            for (let a = 0; a < params.nCubes; a++)
            {
            drawCube(height, params, a)
            }
        }
    }
}

//tokenizeSourceText("Here is my source text")
//findSearchTermInTokenizedText("snake", "green")
//findSearchTermInTokenizedText("the", "blackcd i")
//findSearchTermInTokenizedText("snow", "white")



/******************
** ANIMATION LOOP**
*******************/

const clock = new THREE.Clock()

const animation = () =>
{

    //Return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    //Update OrbitControls
    controls.update()

    //Rotate camera
    if (uiObj.rotateCamera)
    {
        camera.position.x = Math.sin(elapsedTime * 0.1) * 20
        camera.position.z = Math.cos(elapsedTime * 0.1) * 20
        camera.position.y = 5
        camera.lookAt (0,0,0)
    }

    // Animate term2 cubes
        group2.children.forEach((cube) => {
    if (cube.userData.isTerm2) {
        const t = elapsedTime

        const amplitude = 1.5  // how far they move
        const speed = 0.7        // how fast they move

        cube.position.x = cube.userData.baseX + Math.sin(t * speed + cube.userData.offset) * amplitude
        cube.position.z = cube.userData.baseZ + Math.cos(t * speed + cube.userData.offset) * amplitude
    }
})  

    // Animate term1 cube rotation
        group1.children.forEach((cube) => {
    if (cube.userData.isTerm1) {
        const speed = 1.5

        cube.rotation.x += 0.01 * speed
        cube.rotation.y += 0.01 * speed
    }
})

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
}

animation()