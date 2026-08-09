// ============================================================
// CONTROLADOR: conecta los botones del HTML con el modelo (cube.js)
// y con el renderizador 3D (render.js). No contiene logica del cubo
// ni codigo de dibujo: solo orquesta.
// ============================================================
import { Cube } from './cube.js';
import { CubeRenderer } from './render.js';

const cube = new Cube();
const canvas = document.getElementById('scene');
const renderer = new CubeRenderer(canvas, cube);

const statusEl = document.getElementById('status');
const historyEl = document.getElementById('history-count');
const controls = document.getElementById('controls');

function refreshStatus() {
  const solved = cube.isSolved();
  statusEl.textContent = solved ? 'RESUELTO' : 'desordenado';
  statusEl.className = solved ? 'ok' : 'pending';
  historyEl.textContent = cube.history.length;
}

function setControlsEnabled(enabled) {
  controls.querySelectorAll('button, input').forEach((el) => (el.disabled = !enabled));
}

async function runSequence(moves, opts = {}) {
  setControlsEnabled(false);
  for (const mv of moves) {
    await renderer.playMove(mv, opts);
  }
  refreshStatus();
  setControlsEnabled(true);
}

// Botones de movimientos individuales (U, U', U2, D, D', D2, ...)
document.querySelectorAll('[data-move]').forEach((btn) => {
  btn.addEventListener('click', () => runSequence([btn.dataset.move]));
});

// Movimientos manuales por texto, ej: "R U R' U'"
document.getElementById('btn-run-manual').addEventListener('click', () => {
  const raw = document.getElementById('manual-input').value.trim();
  if (!raw) return;
  const valid = new Set();
  for (const base of ['U', 'D', 'L', 'R', 'F', 'B']) for (const suf of ['', "'", '2']) valid.add(base + suf);
  const moves = raw.split(/\s+/);
  const invalid = moves.filter((m) => !valid.has(m));
  if (invalid.length) {
    alert('Movimiento(s) invalido(s): ' + invalid.join(', '));
    return;
  }
  document.getElementById('manual-input').value = '';
  runSequence(moves);
});

// Desordenar (scramble) animado
document.getElementById('btn-scramble').addEventListener('click', () => {
  const n = parseInt(document.getElementById('scramble-count').value, 10) || 20;
  const moves = cube.randomMoves(n);
  runSequence(moves);
});

// Armar: deshace, en orden inverso, todo el historial acumulado
document.getElementById('btn-solve').addEventListener('click', async () => {
  const undo = cube.undoSequence();
  await runSequence(undo, { record: false });
  cube.history = [];
  refreshStatus();
});

// Reiniciar cubo resuelto (sin animacion, es un reset instantaneo)
document.getElementById('btn-reset').addEventListener('click', () => {
  cube.reset();
  renderer.buildMeshes();
  refreshStatus();
});

refreshStatus();
