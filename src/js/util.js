const { Vector3 } = require("three")

export function randomInRange(min, max)
{
  return Math.random() * (max - min) + min
}

export function generateRandomPoint(min, max)
{
  var x = randomInRange(min, max)
  var y = randomInRange(min, max)
  var z = randomInRange(min, max)

  return new Vector3(x, y, z);
}