"""
Levanta un servidor local que sirve la carpeta web/ (el cubo visual
en 3D). Correrlo desde la terminal de VS Code:

    python serve.py

En Codespaces, VS Code va a detectar el puerto 8000 y te va a ofrecer
abrirlo en una pestaña del navegador (o mirar la pestaña "PUERTOS").
En una PC normal, abrite http://localhost:8000 manualmente.
"""
import http.server
import functools
import webbrowser
import os

PORT = 8000
WEB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "web")


def main():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=WEB_DIR)
    with http.server.ThreadingHTTPServer(("0.0.0.0", PORT), handler) as httpd:
        url = f"http://localhost:{PORT}"
        print(f"Sirviendo el cubo 3D en {url}  (Ctrl+C para detener)")
        try:
            webbrowser.open(url)
        except Exception:
            pass
        httpd.serve_forever()


if __name__ == "__main__":
    main()
