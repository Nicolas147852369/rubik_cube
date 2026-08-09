"""
Logica de movimientos: matrices de rotacion y definicion de cada
movimiento estandar de notacion de cubo de Rubik (U, D, L, R, F, B,
y sus variantes con ' y 2).
"""
from typing import Dict, Tuple

import numpy as np

Vector = Tuple[int, int, int]

# Colores estandar por cara (esquema de colores occidental)
COLORS = {
    "U": "white",
    "D": "yellow",
    "L": "orange",
    "R": "red",
    "F": "green",
    "B": "blue",
}

# Direccion normal (eje) que define cada cara del cubo
FACE_NORMALS: Dict[str, Vector] = {
    "R": (1, 0, 0),
    "L": (-1, 0, 0),
    "U": (0, 1, 0),
    "D": (0, -1, 0),
    "F": (0, 0, 1),
    "B": (0, 0, -1),
}

# Para cada cara: (eje de rotacion, capa que se mueve, angulo en grados
# que produce un giro "clockwise" segun la notacion estandar del cubo)
MOVE_DEFINITIONS = {
    "R": ("x", 1, -90),
    "L": ("x", -1, 90),
    "U": ("y", 1, -90),
    "D": ("y", -1, 90),
    "F": ("z", 1, -90),
    "B": ("z", -1, 90),
}


def _rot_matrix(axis: str, degrees: float) -> np.ndarray:
    """Matriz de rotacion 3D (regla de la mano derecha) alrededor de un eje."""
    theta = np.radians(degrees)
    c, s = np.cos(theta), np.sin(theta)
    if axis == "x":
        return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])
    if axis == "y":
        return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]])
    if axis == "z":
        return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])
    raise ValueError(f"Eje invalido: {axis}")


def rotation_for(move: str) -> Tuple[str, int, np.ndarray]:
    """Devuelve (eje, capa, matriz_de_rotacion) para un movimiento dado.

    Acepta notacion estandar: 'U' (horario), "U'" (antihorario, prima)
    y 'U2' (180 grados). Lo mismo para D, L, R, F, B.
    """
    base = move[0]
    suffix = move[1:]
    if base not in MOVE_DEFINITIONS:
        raise ValueError(f"Movimiento invalido: {move}")

    axis, layer, degrees = MOVE_DEFINITIONS[base]

    if suffix == "'":
        degrees = -degrees
    elif suffix == "2":
        degrees = 180
    elif suffix != "":
        raise ValueError(f"Movimiento invalido: {move}")

    return axis, layer, _rot_matrix(axis, degrees)


def inverse(move: str) -> str:
    """Devuelve el movimiento inverso, util para 'armar' el cubo
    deshaciendo una secuencia (ver Cube.solve_by_undo)."""
    base = move[0]
    suffix = move[1:]
    if suffix == "'":
        return base
    if suffix == "2":
        return move
    return base + "'"
