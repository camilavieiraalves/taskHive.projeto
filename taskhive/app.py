from flask import Flask, render_template, request, redirect, url_for, jsonify
import json
import os

app = Flask(__name__)

# Arquivo para simular banco de dados
DB_FILE = "usuarios.json"

# Criar arquivo se não existir
if not os.path.exists(DB_FILE):
    with open(DB_FILE, "w") as f:
        json.dump([], f)

def carregar_usuarios():
    with open(DB_FILE, "r") as f:
        return json.load(f)

def salvar_usuarios(usuarios):
    with open(DB_FILE, "w") as f:
        json.dump(usuarios, f, indent=4)


# ---------- ROTAS ---------- #

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        senha = request.form.get("senha")

        usuarios = carregar_usuarios()

        for user in usuarios:
            if user["email"] == email and user["senha"] == senha:
                return f"<h1>Bem-vindo, {user['nome']}!</h1>"

        return "<h1>Login inválido!</h1>"

    return render_template("login.html")


@app.route("/cadastro", methods=["GET", "POST"])
def cadastro():
    if request.method == "POST":
        nome = request.form.get("nome")
        email = request.form.get("email")
        senha = request.form.get("senha")

        usuarios = carregar_usuarios()

        # Impedir cadastro repetido
        for user in usuarios:
            if user["email"] == email:
                return "<h1>Email já cadastrado!</h1>"

        novo = {
            "nome": nome,
            "email": email,
            "senha": senha
        }

        usuarios.append(novo)
        salvar_usuarios(usuarios)

        return "<h1>Cadastro realizado com sucesso!</h1>"

    return render_template("cadastro.html")


if __name__ == "__main__":
    app.run(debug=True)
