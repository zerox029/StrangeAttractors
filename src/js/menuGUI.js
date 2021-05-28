import * as dat from 'dat.gui'

class ColorGUIHelper {
  constructor(object, prop) 
  {
    this.object = object;
    this.prop = prop;
  }

  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }

  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

export default class MenuGUI {
  constructor(pointMaterial, trailMaterial, options, reload) {
    const datGUI = new dat.GUI({autoPlace: true});
    datGUI.domElement.id = 'gui';

    var attractorFolder = datGUI.addFolder('Attractor');
    attractorFolder.add(options, 'attractor', ['Lorenz', 'Aizawa', 'Halvorsen', 'Chen Lee']).name('type').onChange(reload);
    attractorFolder.add(options, 'attractorScale', 0.1, 10, 0.1).name('scale');
    attractorFolder.add(options, 'speed', 0.001, 0.02, 0.001);
    attractorFolder.add(options, 'count', 0, 1000, 1).onChange(reload);

    var pointsFolder = datGUI.addFolder('Points');
    pointsFolder.add(options, 'scale', 0, 2, 0.01);
    pointsFolder.addColor(new ColorGUIHelper(pointMaterial, 'color'), 'value');
    
    var trailsFolder = datGUI.addFolder('Trails');
    trailsFolder.add(trailMaterial, 'lineWidth', 0, 1, 0.01);
    trailsFolder.add(options, 'trailLength', 0, 100, 1).name('length').onChange(reload);
    trailsFolder.addColor(new ColorGUIHelper(trailMaterial, 'color'), 'value');
  }
}