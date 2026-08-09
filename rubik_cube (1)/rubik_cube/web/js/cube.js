// ============================================================
// ESTRUCTURA + LOGICA del cubo (equivalente en JS a
// rubik/cubie.py + rubik/moves.py + rubik/cube.py del lado Python).
// No dibuja nada: solo modela el cubo y sus movimientos.
// ============================================================

export const COLORS = {
  U: 0xf7f7f7, // blanco
  D: 0xffd500, // amarillo
  L: 0xff8c00, // naranja
  R: 0xc41e3a, // rojo
  F: 0x009b48, // verde
  B: 0x0051ba, // azul
};

export const FACE_NORMALS = {
  R: [1, 0, 0], L: [-1, 0, 0],
  U: [0, 1, 0], D: [0, -1, 0],
  F: [0, 0, 1], B: [0, 0, -1],
};

const MOVE_DEFINITIONS = {
  R: ['x', 1, -90], L: ['x', -1, 90],
  U: ['y', 1, -90], D: ['y', -1, 90],
  F: ['z', 1, -90], B: ['z', -1, 90],
};

function rotationMatrix(axis, degrees) {
  const t = (degrees * Math.PI) / 180;
  const c = Math.cos(t), s = Math.sin(t);
  if (axis === 'x') return [[1, 0, 0], [0, c, -s], [0, s, c]];
  if (axis === 'y') return [[c, 0, s], [0, 1, 0], [-s, 0, c]];
  return [[c, -s, 0], [s, c, 0], [0, 0, 1]];
}

function applyMatrix(m, v) {
  return [
    Math.round(m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2]),
    Math.round(m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2]),
    Math.round(m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2]),
  ];
}

export function rotationFor(move) {
  const base = move[0];
  const suffix = move.slice(1);
  if (!(base in MOVE_DEFINITIONS)) throw new Error('Movimiento invalido: ' + move);
  let [axis, layer, degrees] = MOVE_DEFINITIONS[base];
  if (suffix === "'") degrees = -degrees;
  else if (suffix === '2') degrees = 180;
  else if (suffix !== '') throw new Error('Movimiento invalido: ' + move);
  return { axis, layer, degrees };
}

export function inverseMove(move) {
  const base = move[0];
  const suffix = move.slice(1);
  if (suffix === "'") return base;
  if (suffix === '2') return move;
  return base + "'";
}

export class Cube {
  constructor() {
    this.reset();
  }

  reset() {
    this.cubies = [];
    this.history = [];
    for (const x of [-1, 0, 1])
      for (const y of [-1, 0, 1])
        for (const z of [-1, 0, 1]) {
          if (x === 0 && y === 0 && z === 0) continue; // el centro no existe
          const stickers = [];
          for (const face in FACE_NORMALS) {
            const [nx, ny, nz] = FACE_NORMALS[face];
            if ((nx && nx === x) || (ny && ny === y) || (nz && nz === z)) {
              stickers.push({ dir: [nx, ny, nz], color: COLORS[face] });
            }
          }
          this.cubies.push({ position: [x, y, z], stickers, id: `${x}_${y}_${z}` });
        }
  }

  isSolved() {
    for (const face in FACE_NORMALS) {
      const n = FACE_NORMALS[face];
      const colors = new Set();
      for (const c of this.cubies)
        for (const s of c.stickers)
          if (s.dir[0] === n[0] && s.dir[1] === n[1] && s.dir[2] === n[2]) colors.add(s.color);
      if (colors.size > 1) return false;
    }
    return true;
  }

  applyMove(move, record = true) {
    const { axis, degrees, layer } = rotationFor(move);
    const idx = { x: 0, y: 1, z: 2 }[axis];
    const m = rotationMatrix(axis, degrees);
    for (const c of this.cubies) {
      if (c.position[idx] !== layer) continue;
      c.position = applyMatrix(m, c.position);
      c.stickers = c.stickers.map((s) => ({ dir: applyMatrix(m, s.dir), color: s.color }));
    }
    if (record) this.history.push(move);
  }

  // Genera una secuencia aleatoria SIN aplicarla (para poder animarla paso a paso)
  randomMoves(n = 20) {
    const faces = Object.keys(MOVE_DEFINITIONS);
    const suffixes = ['', "'", '2'];
    const moves = [];
    for (let i = 0; i < n; i++) {
      moves.push(faces[Math.floor(Math.random() * faces.length)] + suffixes[Math.floor(Math.random() * suffixes.length)]);
    }
    return moves;
  }

  // Devuelve la secuencia que arma el cubo (inversa del historial),
  // SIN aplicarla todavia ni tocar el historial.
  undoSequence() {
    return [...this.history].reverse().map(inverseMove);
  }
}
