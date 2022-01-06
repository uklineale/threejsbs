import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { FlyControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/FlyControls.js';
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls, orbitControls, clock, ship, mouseClicked, preOrbitCameraPosition, preOrbitCameraRotation;

const DEBUG_LOGS = false;
const LOG_RATE = 60 * 5; // log every 5 seconds (at 60 fps)

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );

    camera.position.z = 10;
    camera.position.y = 9;
    camera.rotation.z = Math.PI / -2;
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    
    clock = new THREE.Clock();

    initFlyControls();
    initOrbitControls();
    addLights();
    addShip();

    var blockPos = new THREE.Vector3(0,0,0);
    // var block = new CityBlock(blockPos, 10, scene);
    generateBlock(100, 0.1);
}

function initFlyControls() {
    controls = new FlyControls(camera, renderer.domElement);
    controls.movementSpeed = 20;
    controls.domElement = renderer.domElement;
    controls.rollSpeed = Math.PI / 6;
    controls.dragToLook = true;
}

function initOrbitControls() {
    orbitControls = new OrbitControls(camera, renderer.domElement);
}

function addShip() {
    const radius = 1;  // ui: radius
    const height = 2;  // ui: height
    const radialSegments = 16;  // ui: radialSegments
    const shipGeo = new THREE.ConeGeometry(radius, height, radialSegments);
    const shipMat = new THREE.MeshPhongMaterial({ color: '#666'});
    ship = new THREE.Mesh(shipGeo, shipMat);

    scene.add(ship);
}

function generateBlock(length, probability) {
    var objects = [];
    var testPos = new THREE.Vector3();
    var xzLength = 2;
    var yLength = 30;
    var spacingMultiplier = 4;

    for (var i = 0; i < length; i++) {
        var column = Array(length);
        for (var j = 0; j < length; j++) {
            var toGenerate = Math.floor(Math.random() * length);
            if (toGenerate < probability) {
                console.log("Adding block");
                var building = new THREE.BoxGeometry(xzLength, yLength, xzLength);
                var buildingMat = new THREE.MeshPhongMaterial({color: '#8AC'});
                var buildingMesh = new THREE.Mesh(building, buildingMat);
                buildingMesh.position.set(testPos.x + (i * spacingMultiplier), 0, testPos.z + (j * spacingMultiplier));
                column[j] = buildingMesh;
                scene.add(buildingMesh);
            }
        }
        objects.push(column);
    }
    console.log(objects);
}

// function addObjs() {
//     {
//         const cubeSize = 4;
//         const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
//         const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
//         const mesh = new THREE.Mesh(cubeGeo, cubeMat);
//         mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
//         scene.add(mesh);
//     }
//     {
//         const sphereRadius = 3;
//         const sphereWidthDivisions = 32;
//         const sphereHeightDivisions = 16;
//         const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
//         const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
//         const mesh = new THREE.Mesh(sphereGeo, sphereMat);
//         mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
//         scene.add(mesh);
//     }
// }

function addLights() {
    const ambientLight = new THREE.AmbientLight( 0xf0f0f0 );
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight( 0xffffff, 0.7, 20, 2)
    light.position.set(4,4,4);
    light.castShadow = true;
    scene.add(light);
}

var counter = 1;

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    counter++;
    if (counter % LOG_RATE == true && DEBUG_LOGS == true) {
        console.log("Camera position: ", camera.position);
        console.log("Camera rotation: ", camera.rotation);
        
    }

    if ( mouseClicked == 0 ) { // Using fly controls
        ship.position.copy(camera.position);
        ship.rotation.copy(camera.rotation);
        ship.updateMatrix();

        ship.translateZ(-10);
        ship.translateY(-2);
        ship.rotateX(Math.PI/-2);

        controls.update(1 * delta);
    } else { // Using orbit controls
        orbitControls.target = ship.position;
        orbitControls.update();
    }
    

    
    renderer.render(scene, camera);
}

class CityBlock {
    constructor(position, length, scene) {
        this.position = position;
        this.length = length;
        this.buildingXZ = 4;
        this.buildingY = 7;
        this.scene = scene;
        this.density = 0.1; // Chance to generate object
        this.objects = this.generateObjs();
    }

    generateObjs() {
        console.log("Generating block!")
        var objects = [];
        for (var i = 0; i < this.length; i++) {
            var column = Array(this.length);
            for (var j = 0; j < this.length; j++) {
                var toGenerate = Math.floor(Math.random() * this.length);
                if (toGenerate < this.density) {
                    console.log("Adding block");
                    var building = new THREE.BoxGeometry(this.buildingXZ, this.buildingXZ, this.buildingY);
                    var buildingMat = new THREE.MeshPhongMaterial({color: '#8AC'});
                    var buildingMesh = new THREE.Mesh(building, buildingMat);
                    buildingMesh.position.set(this.position + i, this.position + j, 0);
                    column[j] = buildingMesh;
                    scene.add(buildingMesh);
                }
            }
            objects.push(column);
        }
        console.log(objects);
    } 
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

document.body.onmousedown = function(event) {
    mouseClicked = 1;
    preOrbitCameraPosition = camera.position;
    preOrbitCameraRotation = camera.rotation;
}
document.body.onmouseup = function(event) {
    mouseClicked = 0;
    camera.position.copy(preOrbitCameraPosition);
    camera.rotation.copy(preOrbitCameraRotation);

}

window.addEventListener('resize', onWindowResize, false);

init();
animate();