import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

const scene = new THREE.Scene();

// camara y parametros
let aspect = window.innerWidth / window.innerHeight;
const viewSize = 10;

const camera = new THREE.OrthographicCamera(
  -viewSize * aspect / 2,
   viewSize * aspect / 2,
   viewSize / 2,
  -viewSize / 2,
  0.1,
  100
);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

//luces
const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(2, 5, 5);
scene.add(light);

//geometrias
const size = 1;

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(size, size, size),
  new THREE.MeshPhongMaterial({ color: 0x00ffff })
);

scene.add(cube);

//movimiento del cubo
let direction = new THREE.Vector3(1, 0.7, 0).normalize();
let speed = 5;

const clock = new THREE.Clock();

function getBounds() {
  return {
    x: camera.right - size / 2,
    y: camera.top - size / 2
  };
}

function randomColor() {
  cube.material.color.setHex(Math.random() * 0xffffff);
}

//confeti yipiii ^^
let particles = [];

function spawnConfetti(position) {
  const count = 40;

  for (let i = 0; i < count; i++) {
    const p = new THREE.Mesh(
      new THREE.PlaneGeometry(0.15, 0.15),
      new THREE.MeshBasicMaterial({
        color: Math.random() * 0xffffff,
        side: THREE.DoubleSide
      })
    );

    p.position.copy(position);

    p.userData.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4,
      0
    );

    p.userData.life = 1.5 + Math.random();

    scene.add(p);
    particles.push(p);
  }
}

function updateConfetti(delta) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    p.position.addScaledVector(p.userData.velocity, delta);
    p.rotation.z += delta * 5;
    p.userData.life -= delta;

    if (p.userData.life <= 0) {
      scene.remove(p);
      particles.splice(i, 1);
    }
  }
}

// animaciones
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const bounds = getBounds();

  cube.position.addScaledVector(direction, speed * delta);

  let hitX = false;
  let hitY = false;

  if (cube.position.x > bounds.x || cube.position.x < -bounds.x) {
    direction.x *= -1;
    hitX = true;
    randomColor();
  }

  if (cube.position.y > bounds.y || cube.position.y < -bounds.y) {
    direction.y *= -1;
    hitY = true;
    randomColor();
  }

    // golpea la esquina

  if (hitX && hitY) spawnConfetti(cube.position.clone());

  cube.rotation.x += delta * 0.8;
  cube.rotation.y += delta * 0.8;

  updateConfetti(delta);

  renderer.render(scene, camera);
}

// responsive
function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width, height);

  aspect = width / height;

  camera.left = -viewSize * aspect / 2;
  camera.right = viewSize * aspect / 2;
  camera.top = viewSize / 2;
  camera.bottom = -viewSize / 2;

  camera.updateProjectionMatrix();
}

window.addEventListener("resize", resize);

resize();
animate();