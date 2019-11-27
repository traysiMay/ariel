// client-side js
// run by the browser each time your view template is loaded

// Extract globals, otherwise linting gets angry
import chroma from 'chroma-js'
import * as THREE from 'three'
import 'three/OrbitControls';
import 'three/SVGLoader';
import {onMouseMove} from './utils.js'
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var click = false;
var loader = new THREE.SVGLoader();
var material_name;

const a = 'https://cdn.glitch.com/af370b6d-3f32-47c5-aa5d-adafb6a739ab%2Farielklevecz4.svg?v=1574731449642'
// load a SVG resource
loader.load(
  // resource URL
  a,
  // called when the resource is loaded
  function(data) {
    var paths = data.paths;
    console.log('cream')
    window.data = data
    var group = new THREE.Group();
    group.scale.multiplyScalar(0.1);
    group.position.x = -20;
    group.position.y = 7;
    group.position.z = -10;
    group.scale.y *= -1;
   
 material_name = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        side: THREE.DoubleSide,
        depthWrite: false
      });
    for (var i = 0; i < paths.length; i++) {
      var path = paths[i];
     

      var shapes = path.toShapes(true);

      for (var j = 0; j < shapes.length; j++) {
        var shape = shapes[j];
        var geometry = new THREE.ShapeBufferGeometry(shape);

        var mesh = new THREE.Mesh(geometry, material_name);
        // mesh.rotation.x = Math.PI / 2;
        group.add(mesh);
      }
    }
    var pgeo = new THREE.PlaneBufferGeometry(1, 1, 1);
    var mesh = new THREE.Mesh(pgeo, material);
    mesh.name = "ariel"
    scene.add(group);
    scene.add(mesh)
  },
  // called when loading is in progresses
  function(xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function(error) {
    console.log("An error happeneda");
  }
);

// Create a scene
var camera, scene, renderer, clock, stats;
var dirLight, spotLight;
var sphere, dirGroup;
var ground;
var material;
init();
animate();
function init() {
  initScene();
  initMisc();

  document.body.appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize, false);
}
function initScene() {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 10, 30);
  scene = new THREE.Scene();
  // scene.fog = new THREE.Fog( 0xCCCCCC, 50, 100 );
  // Lights
  scene.add(new THREE.AmbientLight(0x000000));
  spotLight = new THREE.SpotLight(0xffffff);
  spotLight.name = "Spot Light";
  spotLight.angle = Math.PI / 5;
  spotLight.penumbra = 0.3;
  spotLight.position.set(3, 10, 5);
  spotLight.castShadow = true;
  spotLight.shadow.camera.near = 8;
  spotLight.shadow.camera.far = 200;
  spotLight.shadow.mapSize.width = 256;
  spotLight.shadow.mapSize.height = 256;
  spotLight.shadow.bias = -0.002;
  spotLight.shadow.radius = 4;
  scene.add(spotLight);
  dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.name = "Dir. Light";
  dirLight.position.set(-5, 20, 19);
  dirLight.castShadow = true;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 500;
  dirLight.shadow.camera.right = 17;
  dirLight.shadow.camera.left = -17;
  dirLight.shadow.camera.top = 17;
  dirLight.shadow.camera.bottom = -17;
  dirLight.shadow.mapSize.width = 512;
  dirLight.shadow.mapSize.height = 512;
  dirLight.shadow.radius = 4;
  dirLight.shadow.bias = -0.0005;
  scene.add(dirLight);
  dirGroup = new THREE.Group();
  dirGroup.add(dirLight);
  scene.add(dirGroup);
  // Geometry
  var geometry = new THREE.SphereBufferGeometry(35, 32, 32);
  material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shininess: 0,
    specular: 0x222222
  });
  sphere = new THREE.Mesh(geometry, material);
  sphere.scale.multiplyScalar(1 / 18);
  sphere.position.y = 3;
  sphere.castShadow = true;
  sphere.receiveShadow = false;
  sphere.name = 'chicken'
  scene.add(sphere);

  var geometry = new THREE.PlaneBufferGeometry(10, 10);
  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shininess: 0,
    specular: 0x111111
  });
  ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y -= 1;
  ground.scale.multiplyScalar(3);
  ground.castShadow = true;
  ground.receiveShadow = true;
  // scene.add(ground);
}
function initMisc() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.setClearColor(0xffffff, 1);
  // Mouse control
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 2, 0);
  controls.update();
  clock = new THREE.Clock();
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
  requestAnimationFrame(animate);
  render();
}
function renderScene() {
  renderer.render(scene, camera);
}
function render() {
  var delta = clock.getDelta();
  var time = clock.elapsedTime;
  renderScene();

  if (click) {
    raycaster.setFromCamera(mouse, camera);
    // calculate objects intersecting the picking ray
    // scene.children.map(c => c.material && c.material.color.set(0xFFFFFF))
    var intersects = raycaster.intersectObjects(scene.children);

    for (var i = 0; i < intersects.length; i++) {
      console.log(intersects[i].object.name)
      intersects[i].object.material.color.set(0xff0000);
      if (intersects[i].object.name === 'ariel') material_name.color.set(0x000000)
    }
  }
  mouse = {x:9999,y:-9999}
  sphere.rotation.x += 0.25 * delta;
  sphere.rotation.y += 2 * delta;
  sphere.rotation.z += 1 * delta;
  const randomColor = chroma.random()
  sphere.material.color = new THREE.Color(randomColor.hex());

  // dirGroup.rotation.y += 0.7 * delta;
  // dirLight.position.z = 17 + Math.sin(time*0.001)*5;
}

// window.addEventListener("touchstart",onMouseMove, false);
window.addEventListener("click",(e) => {
const m =  onMouseMove(e, mouse)
click = true
mouse = m
}, false);
