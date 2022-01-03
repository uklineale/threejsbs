import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, earth;
let cube;

function init() {
    scene = new THREE.Scene();
    const backgroundTexture = new THREE.TextureLoader().load('textures/dark-sky.jpeg');
    scene.background = backgroundTexture;

    camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );

    camera.position.z = 7;
    camera.position.y = 4;
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0,0,0);
    controls.update();

    addLights();
    addEarth();
    // addCube();
}

function addEarth() {
    const geometry = new THREE.SphereGeometry(2);
    const texture = new THREE.TextureLoader().load('textures/earth.jpeg');
    const material = new THREE.MeshPhongMaterial( { map: texture } );
    earth = new THREE.Mesh( geometry, material );
    earth.mass = 1.1;
    scene.add( earth );
}

function addCube() {
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshPhongMaterial( {color: 0x80f0f0} );
    cube = new THREE.Mesh( geometry, material );
    cube.mass = 0.1;
    scene.add( cube );
}

function addLights() {
    const ambientLight = new THREE.AmbientLight( 0xf0f0f0 );
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight( 0xffffff, 0.7, 20, 2)
    light.position.set(4,4,4);
    light.castShadow = true;
    scene.add(light);
}


function animate() {
    requestAnimationFrame(animate);

    earth.rotation.x += 0.001;
    earth.rotation.y += 0.001;
    earth.rotation.z += 0.0001;

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

init();
animate();