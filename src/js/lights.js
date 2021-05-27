import * as THREE from "three"
import { VideoTexture } from "three";

export class Lights {
  constructor(scene, options)
  {
    this.webgl = webgl;
    this.options = options;
  }

  init()
  {
    const options = this.options;
    
    let curve = new THREE.LineCurve3(new THREE.Vector3(), new THREE.Vector3(0, 0, -1));
    let baseGeometry = new THREE.TubeBufferGeometry(curve, 25, 1, 8, false);
    let material = new THREE.MeshBasicMaterial({color: 0x545454});
    let mesh = new THREE.Mesh(baseGeometry, material);

    this.mesh = mesh;
    this.scene.add(mesh);

    let baseGeometry = new THREE.TubeBufferGeometry(curve, 25, 1, 8, false);
    let instanced = new THREE.InstancedBufferGeometry().copy(geometry);
    instanced.maxInstancedCount = options.nPairs * 2;
  }
}