"""
Estructura + logica central del cubo: la clase Cube arma las 26 piezas
en su posicion inicial (resuelto) y aplica movimientos rotando la capa
correspondiente.
"""
import random
from typing import List

import numpy as np

from .cubie import Cubie
from .moves import COLORS, FACE_NORMALS, MOVE_DEFINITIONS, rotation_for, inverse


class Cube:
    def __init__(self):
        self.cubies: List[Cubie] = []
        self.history: List[str] = []
        self.reset()

    # ------------------------------------------------------------------ #
    # Construccion / estado
    # ------------------------------------------------------------------ #
    def reset(self) -> None:
        """Vuelve el cubo a su estado armado (resuelto)."""
        self.cubies = []
        self.history = []
        for x in (-1, 0, 1):
            for y in (-1, 0, 1):
                for z in (-1, 0, 1):
                    if x == 0 and y == 0 and z == 0:
                        continue  # el centro no existe fisicamente
                    stickers = {}
                    for face, normal in FACE_NORMALS.items():
                        nx, ny, nz = normal
                        if (nx and nx == x) or (ny and ny == y) or (nz and nz == z):
                            stickers[normal] = COLORS[face]
                    self.cubies.append(Cubie((x, y, z), stickers))

    def is_solved(self) -> bool:
        for normal in FACE_NORMALS.values():
            colors = {c.stickers[normal] for c in self.cubies if normal in c.stickers}
            if len(colors) != 1:
                return False
        return True

    # ------------------------------------------------------------------ #
    # Movimientos
    # ------------------------------------------------------------------ #
    def apply_move(self, move: str, record: bool = True) -> None:
        axis_letter, layer, matrix = rotation_for(move)
        axis_index = {"x": 0, "y": 1, "z": 2}[axis_letter]

        for cubie in self.cubies:
            if cubie.position[axis_index] != layer:
                continue
            new_pos = tuple(int(round(v)) for v in matrix @ np.array(cubie.position))
            new_stickers = {}
            for direction, color in cubie.stickers.items():
                new_dir = tuple(int(round(v)) for v in matrix @ np.array(direction))
                new_stickers[new_dir] = color
            cubie.position = new_pos
            cubie.stickers = new_stickers

        if record:
            self.history.append(move)

    def apply_sequence(self, moves) -> None:
        for move in moves:
            self.apply_move(move)

    # ------------------------------------------------------------------ #
    # Armar / desarmar
    # ------------------------------------------------------------------ #
    def scramble(self, n: int = 20) -> List[str]:
        faces = list(MOVE_DEFINITIONS.keys())
        suffixes = ["", "'", "2"]
        moves = [random.choice(faces) + random.choice(suffixes) for _ in range(n)]
        self.apply_sequence(moves)
        return moves

    def solve_by_undo(self) -> List[str]:
        """'Arma' el cubo deshaciendo, en orden inverso, todo lo que
        quedo registrado en el historial. No es un solver optimo tipo
        Kociemba/CFOP: es una forma correcta y simple de volver al
        estado resuelto a partir de los movimientos que se aplicaron.
        """
        undo_moves = [inverse(m) for m in reversed(self.history)]
        for move in undo_moves:
            self.apply_move(move, record=False)
        self.history = []
        return undo_moves
