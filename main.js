import gsap from "gsap";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"; // Correct import

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.5,
  100
);

camera.position.z = 9;

const loader = new RGBELoader(); // Use RGBELoader correctly
loader.load(
  "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/rosendal_plains_1_2k.hdr",
  function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    // scene.background = texture;
    scene.environment = texture;
  }
);



const radius = 1.3;
const segments = 64;
const OrbitRadius = 4.5;
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
const textures = [
  "./venus/venus.jpg",
  "./Earth/earth.jpg",
  "./Jupiter/jupiter.jpg",
  "./mars/mars.jpg",
]
const spheres = new THREE.Group();

// Star geometry

const starTexture = new THREE.TextureLoader().load("./star2.jpg");
starTexture.colorSpace = THREE.SRGBColorSpace;  
const starGeometry = new THREE.SphereGeometry(50, 64, 64);
const starMaterial = new THREE.MeshStandardMaterial({ map: starTexture, side: THREE.BackSide , transparent: true, opacity: 0.2 });
const starsphere = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starsphere);

const sphereMesh = []

for (let i = 0; i < 4; i++) {

  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(textures[i]);
  texture.colorSpace = THREE.SRGBColorSpace;
  // material.map = texture;

  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const sphere = new THREE.Mesh(geometry, material);

  sphereMesh.push(sphere);

  const angle = (i / 4) * Math.PI * 2;
  sphere.position.x = OrbitRadius * Math.cos(angle);
  sphere.position.z = OrbitRadius * Math.sin(angle);

  spheres.add(sphere);
}

spheres.rotation.x = 0.15;
// spheres.rotation.y = -20.4;
spheres.position.y = -0.6;

scene.add(spheres);

const canvas = document.querySelector("#draw");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

let lastWheelTime = 0;
const throttleDelay = 2000;
let scrollCount = 0;

function throttledWheelHandler(event) {
  const currentTime = Date.now();
  if (currentTime - lastWheelTime >= throttleDelay) {
    lastWheelTime = currentTime;
    const direction = event.deltaY > 0 ? "down" : "up";
    
    scrollCount = (scrollCount + 1) % 4;
    console.log(scrollCount);
    

    const heading = document.querySelectorAll(".heading");
    gsap.to(heading, {
      duration: 1,
      y: `-=${100}%`,
      ease: "power4.inOut",
    });

    gsap.to(spheres.rotation, {
      duration: 1,
      y: `+=${Math.PI / 2}`,
      ease: "power4.inOut",
    })
     

    if(scrollCount == 0){
      gsap.to(heading, {
        duration: 1,
        y: 0,
        ease: "power4.inOut",
      });
    }

    
  }
}

window.addEventListener("wheel" , throttledWheelHandler)

function animate() {
  window.requestAnimationFrame(animate);
  for (let i = 0; i < sphereMesh.length; i++) {
    const sphere = sphereMesh[i];
    sphere.rotation.y += 0.005;
  }
  renderer.render(scene, camera);
}


animate();