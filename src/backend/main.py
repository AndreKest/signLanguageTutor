from app.routes import app

app.config["DEBUG"] = False

if __name__ == "__main__":
    app.config["DEBUG"] = True
    app.run(host="0.0.0.0")