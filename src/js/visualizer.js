import '../style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import './attractors/lorenzAttractor';
import * as util from './util';
import lorenzAttractor from './attractors/lorenzAttractor';
import { Vector3 } from 'three';

const SIZES = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Debug
const gui = new dat.GUI()

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, SIZES.width / SIZES.height, 0.1, 100)
const renderer = new THREE.WebGLRenderer({canvas: canvas,alpha: true})

// Materials
const material = new THREE.MeshBasicMaterial();
material.color = new THREE.Color("rgb(145, 242, 255)");

// Objects
const geometry = new THREE.SphereBufferGeometry(.1, 64, 64)

// Mesh
var spheres = generatePoints(5000, -1, 1)

/**
 * Generate the spheres used by the attractor
 */
function generatePoints(count, minimumDeviation, maximumDeviation) {
  var points = [];
  for(var i = 0; i < count; i++)
  {
    const sphere = new THREE.Mesh(geometry, material)
    sphere.position.x = util.randomInRange(minimumDeviation, maximumDeviation);
    sphere.position.y = util.randomInRange(minimumDeviation, maximumDeviation);
    sphere.position.z = util.randomInRange(minimumDeviation, maximumDeviation);

    points.push(sphere)
    scene.add(sphere)
  }

  return points;
}

/**
 * Initialize the visualizer
 */
function init ()
{
  //Setting up camera
  camera.position.x = 0
  camera.position.y = 0
  camera.position.z = 90
  scene.add(camera)

  //Setting up renderer
  renderer.setSize(SIZES.width, SIZES.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.autoClearColor = false;

  window.addEventListener('resize', () =>
  {
      // Update sizes
      SIZES.width = window.innerWidth
      SIZES.height = window.innerHeight
  
      // Update camera
      camera.aspect = SIZES.width / SIZES.height
      camera.updateProjectionMatrix()
  
      // Update renderer
      renderer.setSize(SIZES.width, SIZES.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })
}

/**
 * Animate
 */
function tick ()
{
  spheres.forEach(sphere => {
    var newPosition = lorenzAttractor(sphere.position);

    sphere.position.x = newPosition.x;
    sphere.position.y = newPosition.y;
    sphere.position.z = newPosition.z;
  });

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

init()
tick()