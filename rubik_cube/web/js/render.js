// ============================================================
// VISUAL: escena 3D con Three.js. Dibuja el cubo a partir del
// modelo (cube.js) y anima cada movimiento girando la capa
// correspondiente en vez de simplemente "saltar" al estado final.
// ============================================================
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FACE_NORMALS, rotationFor } from './cube.js';

const GAP = 1.05;   // separacion entre piezas
const SIZE = 0.94;  // tamaño de cada mini-cubo
const BLACK = 0x161616;
const FACE_ORDER = ['R', 'L', 'U', 'D', 'F', 'B']; // orden de materiales de BoxGeometry: +x,-x,+y,-y,+z,-z
const AXIS_VECTORS = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) };

export class CubeRenderer {
  constructor(canvas, cube) {
    this.cube = cube;
    this.animating = false;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x14151a);

    this.camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    this.camera.position.set(6.5, 6, 7.5);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.resize();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;

    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(6, 10, 8);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.4);
    fill.position.set(-6, -4, -8);
    this.scene.add(fill);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    this.pivot = new THREE.Group();
    this.scene.add(this.pivot);

    this.meshes = new Map();
    this.buildMeshes();

    window.addEventListener('resize', () => this.resize());
    this._tick();
  }

  resize() {
    const canvas = this.renderer.domElement;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  // Reconstruye las 26 mallas desde cero, leyendo el estado actual del modelo
  buildMeshes() {
    for (const mesh of this.meshes.values()) this.scene.remove(mesh);
    this.meshes.clear();

    for (const cubie of this.cube.cubies) {
      const geometry = new THREE.BoxGeometry(SIZE, SIZE, SIZE);
      const materials = FACE_ORDER.map((face) => {
        const normal = FACE_NORMALS[face];
        const sticker = cubie.stickers.find(
          (s) => s.dir[0] === normal[0] && s.dir[1] === normal[1] && s.dir[2] === normal[2]
        );
        return new THREE.MeshLambertMaterial({ color: sticker ? sticker.color : BLACK });
      });
      const mesh = new THREE.Mesh(geometry, materials);
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry),
        new THREE.LineBasicMaterial({ color: 0x000000 })
      );
      mesh.add(edges);
      mesh.position.set(cubie.position[0] * GAP, cubie.position[1] * GAP, cubie.position[2] * GAP);
      mesh.userData.id = cubie.id;
      this.scene.add(mesh);
      this.meshes.set(cubie.id, mesh);
    }
  }

  // Anima un movimiento: gira solo las piezas de la capa afectada
  // alrededor del eje correspondiente y, al terminar, aplica el
  // movimiento al modelo y reconstruye las mallas (queda exacto).
  playMove(move, { duration = 250, record = true } = {}) {
    if (this.animating) return Promise.resolve();
    this.animating = true;

    const { axis, layer, degrees } = rotationFor(move);
    const idx = { x: 0, y: 1, z: 2 }[axis];
    const affected = this.cube.cubies.filter((c) => c.position[idx] === layer);
    const axisVec = AXIS_VECTORS[axis];

    this.pivot.rotation.set(0, 0, 0);
    this.pivot.updateMatrixWorld();
    for (const cubie of affected) {
      const mesh = this.meshes.get(cubie.id);
      this.scene.remove(mesh);
      this.pivot.add(mesh);
    }

    const targetRad = THREE.MathUtils.degToRad(degrees);
    const start = performance.now();

    return new Promise((resolve) => {
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubico
        this.pivot.setRotationFromAxisAngle(axisVec, targetRad * eased);
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          this.cube.applyMove(move, record);
          for (const mesh of [...this.pivot.children]) this.pivot.remove(mesh);
          this.buildMeshes();
          this.animating = false;
          resolve();
        }
      };
      requestAnimationFrame(step);
    });
  }

  _tick = () => {
    requestAnimationFrame(this._tick);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}
