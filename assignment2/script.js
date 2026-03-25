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

/************
 ** MESHES **
 ***********/

//cube geometry
const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

const drawCube = (height, params) =>
{
    //create cube material
    const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(params.color)
    })


    //Create cube
    const cube = new THREE.Mesh(cubeGeometry, material)

    //Position cube
    cube.position.x = (Math.random() - 0.5) * params.diameter
    cube.position.z = (Math.random() - 0.5) * params.diameter
    cube.position.y = height - 10

    //Randomize cube rotation
    cube.rotation.x = Math.random() * 2 * Math.PI
    cube.rotation.z = Math.random() * 2 * Math.PI
    cube.rotation.y = Math.random() * 2 * Math.PI

    // Add cube to scene
    scene.add(cube)
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

const uiObj = {
    sourceText: "The quick brown fox jumped over the lazy dog",
    saveSourceText() {
        saveSourceText()
    },
    term1: {
        term: 'fox' ,
        color: '#aa00ff',
        diameter: 10,
        nCubes: 100
    },
    term2: {
        term: 'dog' ,
        color: '#00ffaa',
        diameter: 10,
        nCubes: 100
    },
    term3: {
        term: '' ,
        color: '',
        diameter: 10,
        nCubes: 100
    },
    saveTerms() {
        saveTerms()
    }

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

//Terms and Visualize Folders
const termsFolder = ui.addFolder("Search Terms")
const visualizeFolder = ui.addFolder("Visualize")

termsFolder
    .add(uiObj.term1, 'term')
    .name("Term 1")

termsFolder
    .addColor(uiObj.term1, 'color')
    .name("Term 1 Color")

termsFolder
    .add(uiObj.term2, 'term')
    .name("Term 2")

termsFolder
    .addColor(uiObj.term2, 'color')
    .name("Term 2 Color")

termsFolder
    .add(uiObj.term3, 'term')
    .name("Term 3")

termsFolder
    .addColor(uiObj.term3, 'color')
    .name("Term 3 Color")

visualizeFolder
    .add(uiObj, 'saveTerms')
    .name("Visualize")

// Terms and Visualize folders are hidden by default
termsFolder.hide()
visualizeFolder.hide()


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
            drawCube(height, params)
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

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
}

animation()