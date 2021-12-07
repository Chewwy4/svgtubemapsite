import * as THREE from "./jsm/three.module.js";
import Stats from "./jsm/libs/stats.module.js";

//tween
import { TWEEN } from "./jsm/libs/tween.module.min.js"; 

//Collada Loader


//////PostProcessing
import { EffectComposer } from "./jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "./jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "./jsm/postprocessing/ShaderPass.js";
import { CopyShader } from "./jsm/shaders/CopyShader.js";
import { BrightnessContrastShader } from "./jsm/shaders/BrightnessContrastShader.js";

import { ColorCorrectionShader } from "./jsm/shaders/ColorCorrectionShader.js";


//FXAA Antialiasing
import { FXAAShader } from "./jsm/shaders/FXAAShader.js";  

import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import { KTX2Loader } from './jsm/loaders/KTX2Loader.js';
import { MeshoptDecoder } from './jsm/libs/meshopt_decoder.module.js';


import { RGBELoader } from './jsm/loaders/RGBELoader.js';
import { RoughnessMipmapper } from './jsm/utils/RoughnessMipmapper.js';

let container;
let scene, renderer, composer;
let stats, guimixer;
let swissKnife;
let skyboxGeo, skybox;
const clock = new THREE.Clock();
let mixer;
let camera;
let effectFXAA,
    brightnessContrastPass,
    colorCorrectionPass;

//button action
let POSITION;
let SELECTED;
let PRESSED;



init();
animate();

function init() {
    container = document.getElementById("threecontainer");
  //  document.body.appendChild(threecontainer);

    scene = new THREE.Scene();
   // scene.background = new THREE.Color(0xffffff);
   ;
   
    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444, 0.5 );
    hemiLight.position.set( 0, 100, 0 );
    scene.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
    dirLight.position.set( 0, 100, 100 );
    // dirLight.castShadow = true;
    scene.add( dirLight );

    const light2 = new THREE.SpotLight(0xffffff, 0.4, 1000);
    light2.position.set(-1255, -1000, -1200);
    //light.angle = Math.PI / 9;
    // light2.castShadow = true;
    // light2.shadow.radius = 135;
    // light2.shadow.camera.near = 85;
    // light2.shadow.camera.far = 1000;
    // light2.shadow.mapSize.width = 2048;
    // light2.shadow.mapSize.height = 2048;
    // light2.shadow.bias = 0.0001;
    scene.add(light2);


    
    //Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, precision: 'mediump' });
    //specify render window size
    renderer.setSize(500 , 300);
    // renderer.setSize(w, h);

    container.appendChild(renderer.domElement);
    //renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
   // renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5; 
    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    //renderer.autoClear = false;

//     const environment = new RoomEnvironment();
//     const pmremGenerator = new THREE.PMREMGenerator( renderer );
//  scene.environment = pmremGenerator.fromScene( environment ).texture;

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 10000);
    camera.position.set(0, 150, 150);
    camera.lookAt(new THREE.Vector3(0, 100, 0));

    // Postprocessing

    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    brightnessContrastPass = new ShaderPass(BrightnessContrastShader);
    brightnessContrastPass.uniforms["brightness"].value = 0.02;
    brightnessContrastPass.uniforms["contrast"].value = 0.025;
    composer.addPass(brightnessContrastPass);

    colorCorrectionPass = new ShaderPass(ColorCorrectionShader);
    //colorCorrectionPass.renderToScreen = true;
    colorCorrectionPass.uniforms["powRGB"].value = new THREE.Vector3(
        1.25,
        1.25,
        1.25
    );
    colorCorrectionPass.uniforms["mulRGB"].value = new THREE.Vector3(
        2.5,
        2.5,
        2.5
    );
    composer.addPass(colorCorrectionPass);

    effectFXAA = new ShaderPass(FXAAShader);
    const pixelRatio = renderer.getPixelRatio();
    effectFXAA.material.uniforms[ 'resolution' ].value.x = 1 / ( container.offsetWidth * pixelRatio );
    effectFXAA.material.uniforms[ 'resolution' ].value.y = 1 / ( container.offsetHeight * pixelRatio );
    composer.addPass(effectFXAA);

    stats = new Stats();
    //container.appendChild(stats.dom);
    window.addEventListener("resize", onWindowResize) ;
    }


               

                // loading manager
const loadingManager = new THREE.LoadingManager(function () {});

                //hrd environment

            new RGBELoader()
					.setPath( './src/textures/equirectangular/' )
					.load( 'royal_esplanade_1k.hdr', function ( texture ) {

						texture.mapping = THREE.EquirectangularReflectionMapping;
						//scene.background = texture;
                        scene.environment = texture;
                        scene.background = new THREE.Color(0xffffff);
                        // scene.add(new THREE.AmbientLight(0x2e2e2e, 0.5));
                    });

                        
    const ktx2Loader = new KTX2Loader()
    .setTranscoderPath( 'js/libs/basis/' )
    .detectSupport( renderer );

    const loader = new GLTFLoader().setPath( 'src/models/' );
    loader.setKTX2Loader( ktx2Loader );
    loader.setMeshoptDecoder( MeshoptDecoder );
    loader.load( 'tubelogoGLTF.glb', function ( gltf ) {
        swissKnife = gltf.scene;
        swissKnife.traverse( function ( child ) {

        if ( child.isMesh ) {
            // let mat = new THREE.MeshPhongMaterial;
            // let color = new THREE.Color(0xaa5511);
            // mat.color = color;
            // mat.wireframe = true;
            //roughnessMipmapper.generateMipmaps( child.material );
            //child.material = mat;
            child.receiveShadow = true;
            child.castShadow = true;
        }

  
   // swissKnife.sortFacesByMaterialIndex();
    swissKnife.scale.x = gltf.scene.scale.y = gltf.scene.scale.z = 120;
    swissKnife.position.y = 15;
    scene.add( swissKnife );

    render();
});  
});


window.addEventListener("load", onLoadFunction);
function onLoadFunction(e){
   
if (window.innerWidth <810 ) {
     camera.position.set(0, 400, 700);
    // swissKnife.position.y = 25;
    renderer.setSize(200, 300);  
 }
// if  (window.innerWidth < 825) {
//     camera.position.set(0, 200, 400);
//     swissKnife.position.y = 65;
//  }
// else if (window.innerHeight <= 600) {
//     camera.position.set(0, 150, 400);
//  }
 else {
swissKnife.position.y = -70;
camera.position.set(0, 150, 350);
 }
}

function onWindowResize() {        
    
    camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(500, 300);    
        const pixelRatio = renderer.getPixelRatio();
        effectFXAA.material.uniforms[ 'resolution' ].value.x = 1 / ( container.offsetWidth * pixelRatio );
        effectFXAA.material.uniforms[ 'resolution' ].value.y = 1 / ( container.offsetHeight * pixelRatio );
    
        if (window.innerWidth < 810) {
        //getElementById('#')
        camera.position.set(0, 1450, 600);
       // swissKnife.position.y = 75;
     }
    // else if (window.innerWidth <= 825) {
    //     swissKnife.position.y = 65; 
    //  }
    // else if (window.innerHeight <= 600) {
    //     camera.position.set(0, 150, 400);
    //     swissKnife.position.y = 30;
    //  }
     else {
        //keep normal camera position
   // swissKnife.position.y = 30;
    camera.position.set(0, 150, 350);
   //FXAA antialiasing
     }
 }

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    render();
    composer.render();
    TWEEN.update();
   
    //rotate Dae
    if (swissKnife !== undefined) {
        
        swissKnife.rotation.y += delta * 0.5;
    }
}
function render() {
    //composer.render();   
    
    renderer.render(scene, camera);
  
}




