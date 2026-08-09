"""
Capa visual: dibuja el estado actual del cubo con matplotlib en 3D.
Pensado para ejecutarse localmente (ej. desde la terminal integrada de
Visual Studio Code) con un backend interactivo de matplotlib.
"""
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection

from .cube import Cube

STICKER_SIZE = 0.45  # < 0.5 para dejar una linea negra entre pegatinas
GAP = 0.5             # distancia del centro de la pieza a su cara exterior


def _square_corners(position, direction):
    """Calcula las 4 esquinas 3D de una pegatina, a partir del centro
    de la pieza (position) y la direccion normal (direction) a la que
    pertenece esa pegatina."""
    cx, cy, cz = position
    dx, dy, dz = direction
    center = (cx + dx * GAP, cy + dy * GAP, cz + dz * GAP)
    s = STICKER_SIZE
    if dx != 0:
        offsets = [(0, -s, -s), (0, s, -s), (0, s, s), (0, -s, s)]
    elif dy != 0:
        offsets = [(-s, 0, -s), (s, 0, -s), (s, 0, s), (-s, 0, s)]
    else:
        offsets = [(-s, -s, 0), (s, -s, 0), (s, s, 0), (-s, s, 0)]
    return [(center[0] + ox, center[1] + oy, center[2] + oz) for ox, oy, oz in offsets]


class CubeVisualizer:
    """Ventana interactiva de matplotlib que dibuja un objeto Cube."""

    def __init__(self, cube: Cube):
        self.cube = cube
        self.fig = plt.figure(figsize=(6, 6))
        self.ax = self.fig.add_subplot(111, projection="3d")
        self.draw()

    def draw(self) -> None:
        self.ax.clear()
        self.ax.set_box_aspect((1, 1, 1))
        self.ax.set_xlim(-2, 2)
        self.ax.set_ylim(-2, 2)
        self.ax.set_zlim(-2, 2)
        self.ax.set_axis_off()

        faces, colors = [], []
        for cubie in self.cube.cubies:
            for direction, color in cubie.stickers.items():
                faces.append(_square_corners(cubie.position, direction))
                colors.append(color)

        collection = Poly3DCollection(faces, facecolors=colors, edgecolors="black", linewidths=1)
        self.ax.add_collection3d(collection)
        self.ax.set_title("Cubo resuelto" if self.cube.is_solved() else "Cubo desordenado")
        self.fig.canvas.draw_idle()
        plt.pause(0.001)

    def show(self) -> None:
        plt.show()
