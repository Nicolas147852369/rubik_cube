# Cubo de Rubik en Python

Simulador visual e interactivo de un cubo de Rubik 3x3, pensado para
abrirse y ejecutarse como proyecto en **Visual Studio Code**.

## Estructura del proyecto

```
rubik_cube/
├── main.py              # Punto de entrada (menu por consola)
├── requirements.txt
└── rubik/
    ├── __init__.py
    ├── cubie.py          # ESTRUCTURA: clase Cubie (una pieza del cubo)
    ├── moves.py           # LOGICA: matrices de rotacion y notacion (U, D, L, R, F, B)
    ├── cube.py            # LOGICA: clase Cube (26 piezas + aplicar movimientos)
    └── visualizer.py       # VISUAL: dibuja el cubo en 3D con matplotlib
```

Cada archivo tiene una responsabilidad separada, tal como se pidio:

- **`cubie.py`** define la estructura minima de una pieza: su posicion
  (x, y, z) y sus pegatinas de color.
- **`moves.py`** contiene toda la logica matematica de los giros: cada
  movimiento (`R`, `U`, `F`...) es una rotacion de 90 grados alrededor
  de un eje, aplicada solo a las piezas de esa capa.
- **`cube.py`** arma las 26 piezas en su posicion inicial y ofrece la
  logica de alto nivel: `apply_move`, `scramble`, `solve_by_undo`,
  `is_solved`.
- **`visualizer.py`** es la unica parte que sabe dibujar: convierte el
  estado del cubo en cuadrados de colores en un grafico 3D de
  matplotlib.
- **`main.py`** conecta todo con un menu simple por consola.

## Como correrlo en VS Code

1. Abrir la carpeta `rubik_cube/` en VS Code.
2. Crear un entorno virtual (opcional pero recomendado):
   ```bash
   python -m venv .venv
   .venv\Scripts\activate      # Windows
   source .venv/bin/activate   # Mac/Linux
   ```
3. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```
4. Ejecutar:
   ```bash
   python main.py
   ```
   Se va a abrir una ventana con el cubo en 3D, y en la terminal
   aparece un menu para desordenarlo, mover caras a mano o armarlo.

## Notacion de movimientos

`U D L R F B` (Up, Down, Left, Right, Front, Back). Cada letra puede
llevar un sufijo:

- sin sufijo → giro horario (ej. `R`)
- `'` (prima) → giro antihorario (ej. `R'`)
- `2` → giro de 180 grados (ej. `R2`)

Ejemplo de secuencia manual: `R U R' U'`

## Sobre "armar" el cubo

La opcion **3) Armar** no es un solver optimo tipo Kociemba/CFOP (eso
requeriria un algoritmo bastante mas complejo). Lo que hace es
deshacer, en orden inverso, exactamente los movimientos que se
aplicaron (scramble + movimientos manuales), lo cual siempre devuelve
el cubo al estado resuelto. Es una base solida sobre la que despues se
puede construir un solver real si se quiere ir mas alla.

## Verificacion de la logica

La logica de rotacion (`rubik/moves.py` + `rubik/cube.py`) fue
probada con:
- 4 giros seguidos de una misma cara vuelven al cubo resuelto.
- La secuencia `(R U R' U')` repetida 6 veces vuelve al cubo resuelto
  (propiedad conocida del cubo de Rubik).
- Un scramble seguido de `solve_by_undo()` siempre resuelve el cubo.
