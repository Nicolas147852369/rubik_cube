"""
Estructura de datos base: representa una mini-pieza (cubie) del cubo de Rubik.
Un cubo de Rubik 3x3 esta formado por 26 de estas piezas (27 posiciones
menos el centro, que no existe fisicamente).
"""
from dataclasses import dataclass, field
from typing import Dict, Tuple

Vector = Tuple[int, int, int]


@dataclass
class Cubie:
    """Una de las 26 piezas que forman el cubo de Rubik.

    position: coordenadas (x, y, z) del centro de la pieza. Cada
              coordenada vale -1, 0 o 1 (posicion dentro de la capa).
    stickers: diccionario {direccion_normal: color}. Solo contiene una
              entrada por cada cara EXTERIOR de la pieza (una pieza de
              esquina tiene 3 pegatinas, una de arista tiene 2, una de
              centro tiene 1).
    """
    position: Vector
    stickers: Dict[Vector, str] = field(default_factory=dict)

    def copy(self) -> "Cubie":
        return Cubie(position=self.position, stickers=dict(self.stickers))
