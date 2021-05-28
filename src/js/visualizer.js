import '../style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import * as util from './util';
import * as attractors from './attractors';
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MeshLine, MeshLineMaterial } from 'three.meshline';

const SIZES = {
  width: window.innerWidth,
  height: window.innerHeight
}

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, SIZES.width / SIZES.height, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true })

// Loading textures
const loader = new THREE.TextureLoader()
const circle = loader.load('./circle.png')

// Materials
const material = new THREE.PointsMaterial({ size: 0.005, color: 'white' });
const trailMaterial = new MeshLineMaterial({color: 'rgb(186, 253, 255)', lineWidth: 0.1, sizeAttenuation: 1, map: circle})

// Objects
const POINT_COUNT = 200;
const geometry = new THREE.SphereBufferGeometry(.2, 64, 64)

const TRAIL_LENGTH = 40;
var posArray = Array(POINT_COUNT)
for(let i = 0; i < POINT_COUNT; i++)
{
  posArray[i] = Array(TRAIL_LENGTH * 3).fill(0);
}

const lines = Array(POINT_COUNT).fill(null).map(() => new MeshLine())
lines.forEach((line, index) => {
  line.setPoints(posArray[index]);
});

// Mesh
var spheres = generatePoints(POINT_COUNT, -10, 10);
const trailMeshes = Array(POINT_COUNT).fill(null);
trailMeshes.forEach((trail, index) => {
  trail = new THREE.Mesh(lines[index], trailMaterial);
  scene.add(trail);
})

// Controls
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

/**
 * Animate
 */
function tick ()
{
  spheres.forEach((sphere, index) => {
    var newPosition = attractors.lorenzAttractor(sphere.position, 0.01, 1);

    sphere.position.x = newPosition.x;
    sphere.position.y = newPosition.y;
    sphere.position.z = newPosition.z;

    lines[index].advance(newPosition);
  });

  trailMaterial.needsUpdate = true;

  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#000000`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

/**
 * GUI
 */
const datGUI = new dat.GUI({autoPlace: true});
datGUI.domElement.id = 'gui';

datGUI.add()

var trailsFolder = datGUI.addFolder('Trails');
trailsFolder.add(trailMaterial, 'lineWidth', 0, 1, 0.01);
trailsFolder.addColor(trailMaterial, 'color');

init()
tick()
