import * as THREE from 'three'
import { Vector3 } from 'three';

const SIGMA = 10;
const BETA = 8.0/3.0;
const ROH = 28;
const dt = 0.01;

export default function lorenzAttractor(position)
{
  var dx = (SIGMA * (position.y - position.x)) * dt;
  var dy = (position.x * (ROH - position.z) - position.y) * dt;
  var dz = (position.x * position.y - BETA * position.z) * dt;

  return new Vector3(position.x + dx, position.y + dy, position.z + dz);
}