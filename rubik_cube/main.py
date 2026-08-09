"""
Punto de entrada del programa.

Ejecutar desde la terminal integrada de Visual Studio Code:
    python main.py
"""
from rubik import Cube, CubeVisualizer

MOVIMIENTOS_VALIDOS = [base + sufijo for base in "UDLRFB" for sufijo in ("", "'", "2")]

MENU = """
========= CUBO DE RUBIK =========
1) Desordenar (scramble)
2) Ingresar movimientos manualmente (ej: R U R' U')
3) Armar (resolver deshaciendo el historial)
4) Reiniciar cubo resuelto
5) Salir
Movimientos validos: U D L R F B
  sin sufijo = horario, ' = antihorario, 2 = 180 grados
==================================
"""


def main():
    cube = Cube()
    viz = CubeVisualizer(cube)

    while True:
        print(MENU)
        estado = "RESUELTO" if cube.is_solved() else "desordenado"
        print(f"Estado actual: {estado} | movimientos en historial: {len(cube.history)}")
        opcion = input("Elegi una opcion: ").strip()

        if opcion == "1":
            n = input("Cantidad de movimientos (enter = 20): ").strip()
            n = int(n) if n else 20
            moves = cube.scramble(n)
            print("Scramble aplicado:", " ".join(moves))

        elif opcion == "2":
            entrada = input("Movimientos separados por espacio: ").strip().split()
            invalidos = [m for m in entrada if m not in MOVIMIENTOS_VALIDOS]
            if invalidos:
                print("Movimiento(s) invalido(s):", invalidos)
                continue
            cube.apply_sequence(entrada)

        elif opcion == "3":
            deshechos = cube.solve_by_undo()
            print("Movimientos aplicados para armar:", " ".join(deshechos) or "(nada que deshacer)")

        elif opcion == "4":
            cube.reset()

        elif opcion == "5":
            print("Chau!")
            break

        else:
            print("Opcion invalida.")
            continue

        viz.draw()

    viz.show()


if __name__ == "__main__":
    main()
