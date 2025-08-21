import os
import sys
<<<<<<< HEAD
from flask import Flask, send_from_directory
=======
from flask import Flask, send_from_directory, make_response
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

<<<<<<< HEAD
# DON'T CHANGE THIS !!!
=======
# DON\'T CHANGE THIS !!!
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Importar blueprints
from src.routes.user import user_bp
from src.routes.auth import auth_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Habilitar CORS para todas as rotas
CORS(app)

# Configuração do Supabase
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        app.supabase = supabase
        print("✅ Supabase conectado com sucesso!")
    except Exception as e:
        print(f"❌ Erro ao conectar com Supabase: {e}")
        app.supabase = None
else:
    print("⚠️  Variáveis SUPABASE_URL e SUPABASE_KEY não encontradas")
    app.supabase = None

# Registrar blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
<<<<<<< HEAD
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

=======
        response = make_response(send_from_directory(static_folder_path, path))
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            response = make_response(send_from_directory(static_folder_path, 'index.html'))
        else:
            return "index.html not found", 404

    # Adicionar Content Security Policy header
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' ws:;"
    return response

>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f

if __name__ == '__main__':
    print("🚀 Iniciando InvestPro Capital Backend...")
    print(f"📁 Pasta static: {app.static_folder}")
<<<<<<< HEAD
    print(f"🔗 Servidor rodando em: http://0.0.0.0:5001")
=======
    print(f"🔗 Servidor rodando em: http://0.0.0.0:5001" )
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
    app.run(host='0.0.0.0', port=5001, debug=True)
