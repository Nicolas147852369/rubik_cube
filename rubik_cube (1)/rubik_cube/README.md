# Cubo de Rubik en Python

Simulador de un cubo de Rubik 3x3, pensado para abrirse y ejecutarse
como proyecto en **Visual Studio Code** (funciona tambien en
**Codespaces**, VS Code en el navegador).

Tiene DOS interfaces sobre la misma logica de base:

1. **`web/`** → cubo 3D real e interactivo (Three.js), se ve en el
   navegador. **Esta es la que conviene usar en Codespaces**, porque
   ahi no hay pantalla local para que matplotlib abra una ventana.
2. **`rubik/` + `main.py`** → version en Python puro con matplotlib,
   pensada para correr en una PC con VS Code de escritorio (con
   pantalla local de verdad).

## Estructura del proyecto

```
rubik_cube/
├── main.py                # Punto de entrada version Python/matplotlib
├── serve.py                # Levanta el servidor de la version web 3D
├── requirements.txt
├── rubik/                   # --- version Python (matplotlib) ---
│   ├── __init__.py
│   ├── cubie.py              # ESTRUCTURA: clase Cubie (una pieza del cubo)
│   ├── moves.py                # LOGICA: matrices de rotacion y notacion
│   ├── cube.py                  # LOGICA: clase Cube (26 piezas + movimientos)
│   └── visualizer.py             # VISUAL: dibuja el cubo en 3D con matplotlib
└── web/                      # --- version navegador (Three.js) ---
    ├── index.html               # ESTRUCTURA: layout de la pagina y controles
    ├── css/style.css             # VISUAL: estilos de la interfaz
    └── js/
        ├── cube.js                # LOGICA: modelo del cubo (igual que rubik/cube.py, en JS)
        ├── render.js                # VISUAL: escena 3D, luces, animacion de giros
        └── app.js                    # controlador: conecta botones con modelo y render
```

## Opcion recomendada para Codespaces: la version web 3D

```bash
python serve.py
```

VS Code va a detectar que se abrio el puerto 8000 y te va a mostrar
un aviso (o anda a la pestaña **PUERTOS**, al lado de TERMINAL) para
abrirlo en una pestaña del navegador. Ahi vas a ver el cubo en 3D
real: **arrastra con el mouse para rotar la camara**, usa scroll
para zoom, y hay botones para cada movimiento (`U`, `U'`, `U2`,
etc.), un boton para desordenar con animacion, uno para armar
(deshace el historial) y uno para reiniciar. Tambien podes escribir
una secuencia manual, por ejemplo `R U R' U'`.

## Version Python + matplotlib (solo con pantalla local)

Si estas en una PC con VS Code de escritorio (no Codespaces):

```bash
python -m venv .venv
source .venv/bin/activate   # o .venv\Scripts\activate en Windows
pip install -r requirements.txt
python main.py
```

Se abre una ventana con el cubo en 3D y en la terminal aparece un
menu para desordenarlo, mover caras a mano o armarlo.

## Notacion de movimientos

`U D L R F B` (Up, Down, Left, Right, Front, Back). Cada letra puede
llevar un sufijo:

- sin sufijo → giro horario (ej. `R`)
- `'` (prima) → giro antihorario (ej. `R'`)
- `2` → giro de 180 grados (ej. `R2`)

## Responsabilidad de cada archivo

- **`cube.py` / `cube.js`**: estructura de las 26 piezas + logica de
  rotacion (matrices, aplicar movimiento, deshacer).
- **`visualizer.py` / `render.js`**: la unica parte que sabe dibujar.
- **`main.py` / `app.js`**: conecta todo (menu o botones) con el
  modelo y con la parte visual.

## Sobre "armar" el cubo

La opcion "Armar" no es un solver optimo tipo Kociemba/CFOP (eso
requeriria un algoritmo bastante mas complejo). Lo que hace es
deshacer, en orden inverso, exactamente los movimientos que se
aplicaron (scramble + movimientos manuales), lo cual siempre
devuelve el cubo al estado resuelto.

## Verificacion de la logica

La logica de rotacion fue probada (en Python y en JS, ambas dan el
mismo resultado) con:
- 4 giros seguidos de una misma cara vuelven al cubo resuelto.
- La secuencia `(R U R' U')` repetida 6 veces vuelve al cubo
  resuelto (propiedad conocida del cubo de Rubik).
- Un scramble seguido de deshacer el historial siempre resuelve el
  cubo.
