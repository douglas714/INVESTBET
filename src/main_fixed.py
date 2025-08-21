import os
import sys
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Importar blueprints corrigidos
from src.routes.user_fixed import user_bp
from src.routes.auth_fixed import auth_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'asdf#FGSgvasgf$5$WGT')

# Habilitar CORS para todas as rotas com configurações específicas
CORS(app, 
     origins=["*"],  # Permitir todas as origens em desenvolvimento
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"],
     supports_credentials=True)

# Configuração do Supabase
SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        app.supabase = supabase
        print("✅ Supabase conectado com sucesso!")
        print(f"📍 URL: {SUPABASE_URL}")
    except Exception as e:
        print(f"❌ Erro ao conectar com Supabase: {e}")
        app.supabase = None
else:
    print("⚠️  Variáveis SUPABASE_URL e SUPABASE_KEY não encontradas")
    print(f"SUPABASE_URL: {SUPABASE_URL}")
    print(f"SUPABASE_KEY: {'***' if SUPABASE_KEY else 'None'}")
    app.supabase = None

# Registrar blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')

# Endpoint de health check
@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint para verificar se a API está funcionando"""
    supabase_status = "connected" if app.supabase else "disconnected"
    return jsonify({
        "status": "ok",
        "message": "InvestPro Capital API is running",
        "supabase": supabase_status,
        "version": "1.0.0"
    })

# Endpoint para testar conexão com Supabase
@app.route('/api/test-db', methods=['GET'])
def test_database():
    """Endpoint para testar conexão com o banco de dados"""
    if not app.supabase:
        return jsonify({
            "status": "error",
            "message": "Supabase not configured"
        }), 503
    
    try:
        # Tentar fazer uma consulta simples
        response = app.supabase.table("profiles").select("count", count="exact").execute()
        return jsonify({
            "status": "ok",
            "message": "Database connection successful",
            "user_count": response.count
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Database connection failed: {str(e)}"
        }), 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """Servir arquivos estáticos do frontend"""
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return jsonify({"error": "Static folder not configured"}), 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return jsonify({
                "error": "Frontend not built",
                "message": "Please build the frontend first: cd frontend && npm run build"
            }), 404

# Tratamento de erros global
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

@app.errorhandler(403)
def forbidden(error):
    return jsonify({"error": "Access forbidden"}), 403

@app.errorhandler(401)
def unauthorized(error):
    return jsonify({"error": "Unauthorized access"}), 401

if __name__ == '__main__':
    print("🚀 Iniciando InvestPro Capital Backend...")
    print(f"📁 Pasta static: {app.static_folder}")
    print(f"🔗 Servidor rodando em: http://0.0.0.0:5001")
    print(f"🔧 Modo debug: {os.environ.get('FLASK_ENV') == 'development'}")
    
    # Verificar se o frontend foi buildado
    if app.static_folder and os.path.exists(os.path.join(app.static_folder, 'index.html')):
        print("✅ Frontend encontrado")
    else:
        print("⚠️  Frontend não encontrado - execute 'cd frontend && npm run build'")
    
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=5001, debug=debug_mode)

