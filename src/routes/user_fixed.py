from flask import Blueprint, jsonify, request, current_app
import jwt

user_bp = Blueprint("user", __name__)

def get_supabase_client():
    """Função auxiliar para obter cliente Supabase"""
    if hasattr(current_app, 'supabase') and current_app.supabase:
        return current_app.supabase
    return None

def verify_token():
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
        supabase = get_supabase_client()
        if not supabase:
            return jsonify({"error": "Database service unavailable"}), 503

        # Buscar todos os usuários da tabela 'profiles' no Supabase
        try:
            response = supabase.table("profiles").select("*").order("created_at", desc=True).execute()
            users = response.data
            
            # Converter valores decimais para float para serialização JSON
            for user in users:
                if user.get("balance"):
                    user["balance"] = float(user["balance"])
                if user.get("monthly_profit"):
                    user["monthly_profit"] = float(user["monthly_profit"])
                if user.get("accumulated_profit"):
                    user["accumulated_profit"] = float(user["accumulated_profit"])
            
            return jsonify(users)
        except Exception as e:
            print(f"Erro ao buscar usuários no Supabase: {e}")
            return jsonify({"error": "Error fetching users from database"}), 500
            
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
        supabase = get_supabase_client()
        if not supabase:
            return jsonify({"error": "Database service unavailable"}), 503

        data = request.json
        
        # Validar dados obrigatórios
        if not data.get("email"):
            return jsonify({"error": "Email is required"}), 400
            
        # Preparar dados para inserção
        profile_data = {
            "username": data.get("username", data.get("email")),
            "name": data.get("name", data.get("username", data.get("email"))),
            "email": data.get("email"),
            "phone": data.get("phone"),
            "cpf": data.get("cpf"),
            "balance": float(data.get("balance", 0.00)),
            "monthly_profit": float(data.get("monthly_profit", 0.0)),
            "accumulated_profit": float(data.get("accumulated_profit", 0.0)),
            "is_admin": data.get("is_admin", False),
            "status": data.get("status", "active")
        }
        
        # Inserir dados na tabela 'profiles'
        try:
            response = supabase.table("profiles").insert(profile_data).execute()
            if response.data:
                created_user = response.data[0]
                # Converter valores decimais para float
                if created_user.get("balance"):
                    created_user["balance"] = float(created_user["balance"])
                if created_user.get("monthly_profit"):
                    created_user["monthly_profit"] = float(created_user["monthly_profit"])
                if created_user.get("accumulated_profit"):
                    created_user["accumulated_profit"] = float(created_user["accumulated_profit"])
                    
                return jsonify(created_user), 201
            else:
                return jsonify({"error": "Failed to create user"}), 500
        except Exception as e:
            print(f"Erro ao criar usuário no Supabase: {e}")
            return jsonify({"error": "Error creating user in database"}), 500
            
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
        supabase = get_supabase_client()
        if not supabase:
            return jsonify({"error": "Database service unavailable"}), 503

        # Buscar usuário por ID na tabela 'profiles'
        try:
            response = supabase.table("profiles").select("*").eq("id", user_id).execute()
            if response.data:
                user = response.data[0]
                # Converter valores decimais para float
                if user.get("balance"):
                    user["balance"] = float(user["balance"])
                if user.get("monthly_profit"):
                    user["monthly_profit"] = float(user["monthly_profit"])
                if user.get("accumulated_profit"):
                    user["accumulated_profit"] = float(user["accumulated_profit"])
                    
                return jsonify(user)
            return jsonify({"error": "User not found"}), 404
        except Exception as e:
            print(f"Erro ao buscar usuário no Supabase: {e}")
            return jsonify({"error": "Error fetching user from database"}), 500
            
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
        supabase = get_supabase_client()
        if not supabase:
            return jsonify({"error": "Database service unavailable"}), 503

        data = request.json
        
        # Preparar dados para atualização (remover campos que não devem ser atualizados)
        update_data = {}
        allowed_fields = ["username", "name", "phone", "cpf", "balance", "monthly_profit", "accumulated_profit", "status"]
        
        # Apenas admins podem alterar is_admin
        if user_data.get("is_admin", False):
            allowed_fields.append("is_admin")
        
        for field in allowed_fields:
            if field in data:
                if field in ["balance", "monthly_profit", "accumulated_profit"]:
                    update_data[field] = float(data[field])
                else:
                    update_data[field] = data[field]
        
        if not update_data:
            return jsonify({"error": "No valid fields to update"}), 400
        
        # Atualizar usuário na tabela 'profiles'
        try:
            response = supabase.table("profiles").update(update_data).eq("id", user_id).execute()
            if response.data:
                updated_user = response.data[0]
                # Converter valores decimais para float
                if updated_user.get("balance"):
                    updated_user["balance"] = float(updated_user["balance"])
                if updated_user.get("monthly_profit"):
                    updated_user["monthly_profit"] = float(updated_user["monthly_profit"])
                if updated_user.get("accumulated_profit"):
                    updated_user["accumulated_profit"] = float(updated_user["accumulated_profit"])
                    
                return jsonify(updated_user)
            return jsonify({"error": "User not found"}), 404
        except Exception as e:
            print(f"Erro ao atualizar usuário no Supabase: {e}")
            return jsonify({"error": "Error updating user in database"}), 500
            
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
        supabase = get_supabase_client()
        if not supabase:
            return jsonify({"error": "Database service unavailable"}), 503

        # Verificar se o usuário existe antes de deletar
        try:
            existing_user = supabase.table("profiles").select("*").eq("id", user_id).execute()
            if not existing_user.data:
                return jsonify({"error": "User not found"}), 404
        except Exception as e:
            print(f"Erro ao verificar usuário: {e}")
            return jsonify({"error": "Error checking user existence"}), 500

        # Deletar usuário da tabela 'profiles'
        try:
            response = supabase.table("profiles").delete().eq("id", user_id).execute()
            return jsonify({"message": "User deleted successfully"}), 200
        except Exception as e:
            print(f"Erro ao deletar usuário no Supabase: {e}")
            return jsonify({"error": "Error deleting user from database"}), 500
            
    except Exception as e:
        print(f"Erro ao deletar usuário: {e}")
        return jsonify({"error": "Internal server error"}), 500

@user_bp.route("/users/stats", methods=["GET"])
def get_user_stats():
    """Endpoint para obter estatísticas dos usuários (apenas para admins)"""
    try:
        # Verificar autenticação
        user_data, error = verify_token()
        if error:
            return jsonify({"error": error}), 401

        # Verificar se é admin
        if not user_data.get("is_admin", False):
            return jsonify({"error": "Access denied. Admin privileges required."}), 403

        # Verificar se Supabase está disponível
        supabase = get_supabase_client()
        if not supabase:
            return jsonify({"error": "Database service unavailable"}), 503

        try:
            # Buscar estatísticas básicas
            all_users = supabase.table("profiles").select("*").execute()
            users = all_users.data
            
            total_users = len(users)
            active_users = len([u for u in users if u.get("status") == "active"])
            admin_users = len([u for u in users if u.get("is_admin") == True])
            total_balance = sum([float(u.get("balance", 0)) for u in users])
            
            return jsonify({
                "total_users": total_users,
                "active_users": active_users,
                "admin_users": admin_users,
                "total_balance": total_balance,
                "inactive_users": total_users - active_users
            })
            
        except Exception as e:
            print(f"Erro ao buscar estatísticas: {e}")
            return jsonify({"error": "Error fetching user statistics"}), 500
            
    except Exception as e:
        print(f"Erro ao obter estatísticas: {e}")
        return jsonify({"error": "Internal server error"}), 500

