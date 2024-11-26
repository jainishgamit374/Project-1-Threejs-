import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Orbit controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.02; 



function animate() {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
  spheres.rotation.y += 0.004;

}

animate();