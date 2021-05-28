import * as THREE from 'three'
import { Vector3 } from 'three';

export function lorenzAttractor(position, dt, factor)
{
  const SIGMA = 10;
  const BETA = 8.0/3.0;
  const ROH = 28;

  var x = position.x / factor;
  var y = position.y / factor;
  var z = position.z / factor;

  var dx = (SIGMA * (y - x)) * dt;
  var dy = (x * (ROH - z) - y) * dt;
  var dz = (x * y - BETA * z) * dt;

  return new Vector3(position.x + dx, position.y + dy, position.z + dz);
}

export function aizawaAttractor(position, dt, factor)
{
  const ALPHA = 0.95;
  const BETA = 0.7;
  const GAMMA = 0.65;
  const DELTA = 3.5;
  const EPSILON = 0.1;
  const ZETA = 0.25;

  var x = position.x / factor;
  var y = position.y / factor;
  var z = position.z / factor;


  var dx = (x * (z - BETA) - (DELTA * y)) * dt;
  var dy = ((DELTA * x) + y * (z - BETA)) * dt;
  var dz = (GAMMA + (ALPHA * z) - ((z ** 3) / 3) - (x ** 2 + y ** 2) * (1 + ZETA * z) + EPSILON * z * (x ** 3)) * dt;

  return new Vector3(position.x + dx, position.y + dy, position.z + dz);
}

export function halvorsenAttractor(position, dt, factor)
{
  const ALPHA = 1.4;

  var x = position.x / factor;
  var y = position.y / factor;
  var z = position.z / factor;

  var dx = (-(ALPHA * x) - (4 * y) - (4 * z) - (y ** 2)) * dt;
  var dy = (-(ALPHA * y) - (4 * z) - (4 * x) - (z ** 2)) * dt;
  var dz = (-(ALPHA * z) - (4 * x) - (4 * y) - (x ** 2)) * dt;

  return new Vector3(position.x + dx, position.y + dy, position.z + dz);
}