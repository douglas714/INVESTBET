<<<<<<< HEAD
from flask import Blueprint, jsonify, request, current_app
=======
from flask import Blueprint, request, jsonify, current_app
from supabase import Client
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
import jwt

user_bp = Blueprint("user", __name__)

def verify_token():
<<<<<<< HEAD
    """Função auxiliar para verificar token de autenticação"""
    token = request.headers.get("Authorization")
    if not token:
        return None, "Token is missing"

    if token.startswith("Bearer "):
        token = token[7:]

    try:
        data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        return data, None
    except jwt.ExpiredSignatureError:
        return None, "Token has expired"
    except jwt.InvalidTokenError:
        return None, "Invalid token"

@user_bp.route("/users", methods=["GET"])
def get_users():
    try:
        # Verificar autenticação
        user_data, error = verify_token()
        if error:
            return jsonify({"error": error}), 401

        # Verificar se é admin
        if not user_data.get("is_admin", False):
            return jsonify({"error": "Access denied. Admin privileges required."}), 403

        # Verificar se Supabase está disponível
        if not current_app.supabase:
            return jsonify({"error": "Database service unavailable"}), 503

        # Buscar todos os usuários da tabela 'profiles' no Supabase
        response = current_app.supabase.table("profiles").select("*").execute()
        users = response.data
        return jsonify(users)
    except Exception as e:
        print(f"Erro ao buscar usuários: {e}")
        return jsonify({"error": "Internal server error"}), 500

@user_bp.route("/users", methods=["POST"])
def create_user():
    try:
        # Verificar autenticação
        user_data, error = verify_token()
        if error:
            return jsonify({"error": error}), 401

        # Verificar se é admin
        if not user_data.get("is_admin", False):
            return jsonify({"error": "Access denied. Admin privileges required."}), 403

        # Verificar se Supabase está disponível
        if not current_app.supabase:
            return jsonify({"error": "Database service unavailable"}), 503

        data = request.json
        # Inserir dados na tabela 'profiles'
        response = current_app.supabase.table("profiles").insert(data).execute()
        return jsonify(response.data[0]), 201
    except Exception as e:
        print(f"Erro ao criar usuário: {e}")
        return jsonify({"error": "Internal server error"}), 500

@user_bp.route("/users/<string:user_id>", methods=["GET"])
def get_user(user_id):
    try:
        # Verificar autenticação
        user_data, error = verify_token()
        if error:
            return jsonify({"error": error}), 401

        # Usuários podem ver apenas seus próprios dados, admins podem ver qualquer um
        if not user_data.get("is_admin", False) and user_data.get("user_id") != user_id:
            return jsonify({"error": "Access denied"}), 403

        # Verificar se Supabase está disponível
        if not current_app.supabase:
            return jsonify({"error": "Database service unavailable"}), 503

        # Buscar usuário por ID na tabela 'profiles'
        response = current_app.supabase.table("profiles").select("*").eq("id", user_id).execute()
        if response.data:
            return jsonify(response.data[0])
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        print(f"Erro ao buscar usuário: {e}")
        return jsonify({"error": "Internal server error"}), 500

@user_bp.route("/users/<string:user_id>", methods=["PUT"])
def update_user(user_id):
    try:
        # Verificar autenticação
        user_data, error = verify_token()
        if error:
            return jsonify({"error": error}), 401

        # Usuários podem editar apenas seus próprios dados, admins podem editar qualquer um
        if not user_data.get("is_admin", False) and user_data.get("user_id") != user_id:
            return jsonify({"error": "Access denied"}), 403

        # Verificar se Supabase está disponível
        if not current_app.supabase:
            return jsonify({"error": "Database service unavailable"}), 503

        data = request.json
        # Atualizar usuário na tabela 'profiles'
        response = current_app.supabase.table("profiles").update(data).eq("id", user_id).execute()
        if response.data:
            return jsonify(response.data[0])
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        print(f"Erro ao atualizar usuário: {e}")
        return jsonify({"error": "Internal server error"}), 500

@user_bp.route("/users/<string:user_id>", methods=["DELETE"])
def delete_user(user_id):
    try:
        # Verificar autenticação
        user_data, error = verify_token()
        if error:
            return jsonify({"error": error}), 401

        # Apenas admins podem deletar usuários
        if not user_data.get("is_admin", False):
            return jsonify({"error": "Access denied. Admin privileges required."}), 403

        # Verificar se Supabase está disponível
        if not current_app.supabase:
            return jsonify({"error": "Database service unavailable"}), 503

        # Deletar usuário da tabela 'profiles'
        response = current_app.supabase.table("profiles").delete().eq("id", user_id).execute()
        if response.data:
            return jsonify({"message": "User deleted successfully"}), 200
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        print(f"Erro ao deletar usuário: {e}")
        return jsonify({"error": "Internal server error"}), 500
=======
    """Verifica o token customizado da nossa API"""
    token = request.headers.get('Authorization')
    if not token or not token.startswith('Bearer '):
        return None
    
    token = token.split(' ')[1]
    
    try:
        # Decodifica usando a MESMA chave secreta que usamos para criar o token no login
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

@user_bp.route('/users/<string:user_id>', methods=['GET'])
def get_user(user_id):
    """Busca os dados financeiros de um usuário específico."""
    user_data = verify_token()
    if not user_data or (user_data['sub'] != user_id and not user_data.get('is_admin')):
        return jsonify({"error": "Acesso não autorizado"}), 403

    try:
        supabase: Client = current_app.supabase
        # Busca na tabela de finanças, como esperado pelo Dashboard
        response = supabase.table("user_finances").select("*").eq("user_id", user_id).single().execute()
        return jsonify(response.data), 200
    except Exception:
        return jsonify({"error": "Dados financeiros não encontrados"}), 404

# Inclua aqui as outras rotas para o painel de admin se precisar
# Ex: @user_bp.route('/users', methods=['GET']) para listar todos
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
