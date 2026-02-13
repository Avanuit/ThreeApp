import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//luz
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(-1, 2, 4);
scene.add(light);

//cubo
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0x00ffff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

//camara
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

//movimiento del cubo

const limit = 7;
let speed = 3;

const MODE_DIAGONAL = "diagonal";
const MODE_Z_ONLY = "z";

let movementMode = MODE_DIAGONAL;

// dirección inicial en diagonal
let direction = new THREE.Vector3(1, 0, 1).normalize();

function setDiagonalMode() {
  movementMode = MODE_DIAGONAL;

  // asegura diagonal pura
  direction.set(
    Math.sign(direction.x) || 1,
    0,
    Math.sign(direction.z) || 1
  ).normalize();
}

function setZOnlyMode() {
  movementMode = MODE_Z_ONLY;

  //solo eje Z
  direction.set(0, 0, Math.sign(direction.z) || 1);
}
function randomizeSpeed() {
  speed = 2 + Math.random() * 4; 
}

//cambiar entre solo z1 y diagonal
window.addEventListener("keydown", (e) => {
  if (e.key === "1") setDiagonalMode();
  if (e.key === "2") setZOnlyMode();
});

//animacion
const clock = new THREE.Clock();

function animate() {
  const delta = clock.getDelta();

  cube.position.add(direction.clone().multiplyScalar(speed * delta));


  if (movementMode === MODE_DIAGONAL) {

    if (cube.position.x > limit || cube.position.x < -limit) {
      direction.x *= -1;
      randomizeSpeed();
    }
  }

  if (cube.position.z > limit || cube.position.z < -limit) {
    direction.z *= -1;
    randomizeSpeed();
  }

  cube.rotation.x += delta;
  cube.rotation.y += delta;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();