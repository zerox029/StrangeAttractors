import '../style.css'
import * as THREE from 'three'
import * as util from './util';
import * as attractors from './attractors';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import './menuGUI';
import MenuGUI from './menuGUI';

const SIZES = {
  width: window.innerWidth,
  height: window.innerHeight
}
const OPTIONS = { 
  attractor: 'Lorenz', 
  scale: .3, 
  minVariation: -10, 
  maxVariation: 10, 
  attractorScale: 1, 
  speed: 0.01, 
  count: 200, 
  trailLength: 40 
}

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, SIZES.width / SIZES.height, 0.1, 100000)
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true })

// Loading textures
const loader = new THREE.TextureLoader()
const circle = loader.load('./circle.png')

// Materials
let material = new THREE.PointsMaterial({ color: 'white' });
let trailMaterial = new MeshLineMaterial({color: 'rgb(246, 199, 255)', lineWidth: 0.1, sizeAttenuation: 1, map: circle})

// Objects
let geometry = new THREE.SphereBufferGeometry(OPTIONS.scale, 64, 64)
let lines = generateTails();

// Mesh
let spheres = generatePoints(OPTIONS.count, OPTIONS.minVariation, OPTIONS.maxVariation);

// Controls
const menuGUI = new MenuGUI(material, trailMaterial, OPTIONS, reloadAttractor);
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

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

function generateTails()
{
  //The positions of every point in every trail
  var posArray = Array(OPTIONS.count)
  for(let i = 0; i < OPTIONS.count; i++)
  {
    posArray[i] = Array(OPTIONS.trailLength * 3).fill(0);
  }

  let lines = Array(OPTIONS.count).fill(null).map(() => new MeshLine());
  lines.forEach((line, index) => {
    line.setPoints(posArray[index]);
  });

  //Creating the mesh and adding to the scene
  var trailMeshes = Array(OPTIONS.count).fill(null);
  trailMeshes.forEach((trail, index) => {
    trail = new THREE.Mesh(lines[index], trailMaterial);
    scene.add(trail);
  })
  
  return lines;
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

function reloadAttractor(){
  while(scene.children.length > 0){ 
    scene.remove(scene.children[0]); 
  }

  geometry = new THREE.SphereBufferGeometry(OPTIONS.scale, 64, 64)
  lines = generateTails();
  spheres = generatePoints(OPTIONS.count, OPTIONS.minVariation, OPTIONS.maxVariation);
}

/**
 * Animate
 */
function tick ()
{
  spheres.forEach((sphere, index) => {
    const attractorFunction = attractors.attractorNameToFunction(OPTIONS.attractor)
    var newPosition = attractorFunction(sphere.position, OPTIONS.speed, OPTIONS.attractorScale);

    sphere.position.x = newPosition.x;
    sphere.position.y = newPosition.y;
    sphere.position.z = newPosition.z;

    sphere.scale.x = OPTIONS.scale
    sphere.scale.y = OPTIONS.scale
    sphere.scale.z = OPTIONS.scale

    lines[index].advance(newPosition);
  });

  material.needsUpdate = true;
  trailMaterial.needsUpdate = true;

  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

init()
tick()
