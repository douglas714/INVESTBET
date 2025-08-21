from flask import Blueprint, request, jsonify, current_app
import jwt
import datetime
from supabase import create_client

auth_bp = Blueprint("auth", __name__)

def get_supabase_client():
    """Função auxiliar para obter cliente Supabase"""
    if hasattr(current_app, 'supabase') and current_app.supabase:
        return current_app.supabase
    return None

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        # Verificar se é admin (credenciais hardcoded para desenvolvimento)
        if email == "admin@investapp.com" and password == "admin123":
            token = jwt.encode({
                "user_id": "admin",
                "email": email,
                "is_admin": True,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, current_app.config["SECRET_KEY"], algorithm="HS256")

            return jsonify({
                "success": True,
                "token": token,
                "user": {
                    "id": "admin",
                    "name": "Administrador",
                    "email": email,
                    "balance": 50000.00,
                    "monthly_profit": 5.2,
                    "accumulated_profit": 15.8,
                    "is_admin": True
                }
            }), 200

        # Verificar se Supabase está disponível
        supabase = get_supabase_client()
        if not supabase:
            return jsonify({"error": "Serviço de autenticação indisponível"}), 503

        # Tentar fazer login com Supabase
        try:
            response = supabase.auth.sign_in_with_password({"email": email, "password": password})
            
            if not response.user:
                return jsonify({"error": "Credenciais inválidas"}), 401
                
            user_data = response.user

            # Buscar dados adicionais do perfil do usuário na tabela 'profiles'
            try:
                user_profile = supabase.table("profiles").select("*").eq("id", user_data.id).execute()
                if user_profile.data:
                    profile = user_profile.data[0]
                    user_info = {
                        "id": user_data.id,
                        "name": profile.get("name", user_data.email),
                        "username": profile.get("username", user_data.email),
                        "email": user_data.email,
                        "phone": profile.get("phone"),
                        "cpf": profile.get("cpf"),
                        "balance": float(profile.get("balance", 0.00)),
                        "monthly_profit": float(profile.get("monthly_profit", 0.0)),
                        "accumulated_profit": float(profile.get("accumulated_profit", 0.0)),
                        "is_admin": profile.get("is_admin", False),
                        "status": profile.get("status", "active"),
                        "created_at": profile.get("created_at")
                    }
                else:
                    # Criar perfil se não existir
                    new_profile = {
                        "id": user_data.id,
                        "name": user_data.email,
                        "username": user_data.email,
                        "email": user_data.email,
                        "phone": None,
                        "cpf": None,
                        "balance": 0.00,
                        "monthly_profit": 0.0,
                        "accumulated_profit": 0.0,
                        "is_admin": False,
                        "status": "active"
                    }
                    supabase.table("profiles").insert(new_profile).execute()
                    user_info = new_profile
            except Exception as profile_error:
                print(f"Erro ao buscar/criar perfil: {profile_error}")
                user_info = {
                    "id": user_data.id,
                    "name": user_data.email,
                    "username": user_data.email,
                    "email": user_data.email,
                    "balance": 0.00,
                    "monthly_profit": 0.0,
                    "accumulated_profit": 0.0,
                    "is_admin": False,
                    "status": "active"
                }

            return jsonify({
                "success": True,
                "token": token,
                "user": user_info
            }), 200

        except Exception as e:
            print(f"Erro de autenticação Supabase: {e}")
            return jsonify({"error": "Credenciais inválidas"}), 401

    except Exception as e:
        print(f"Erro no login: {e}")
        return jsonify({"error": "Erro interno do servidor"}), 500

@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        phone = data.get("phone")
        cpf = data.get("cpf")
        password = data.get("password")

        print(f"[REGISTER] Dados recebidos: username={username}, email={email}, phone={phone}, cpf={cpf}")

        if not all([username, email, password]):
            print("[REGISTER] Erro: Username, email and password are required")
            return jsonify({"error": "Username, email and password are required"}), 400

        # Verificar se Supabase está disponível
        supabase = get_supabase_client()
        if not supabase:
            print("[REGISTER] Erro: Serviço de registro indisponível (Supabase client is None)")
            return jsonify({"error": "Serviço de registro indisponível"}), 503

        # Registrar usuário no Supabase Auth
        try:
            # Incluir metadados do usuário no registro
            user_metadata = {
                "name": username,
                "username": username,
                "phone": phone,
                "cpf": cpf
            }
            print(f"[REGISTER] Tentando registrar no Supabase Auth com email={email}, metadata={user_metadata}")
            
            response = supabase.auth.sign_up({
                "email": email, 
                "password": password,
                "options": {
                    "data": user_metadata
                }
            })
            
            print(f"[REGISTER] Resposta do Supabase Auth: user={response.user}, error={response.error}")

            if response.error:
                print(f"[REGISTER] Erro do Supabase Auth: {response.error.message}")
                return jsonify({"error": response.error.message}), 500

            if not response.user:
                print("[REGISTER] Erro: Usuário não retornado após sign_up.")
                return jsonify({"error": "Erro ao criar conta. Tente novamente."}), 500
                
            user_data = response.user
            print(f"[REGISTER] Usuário registrado no Supabase Auth: ID={user_data.id}, Email={user_data.email}")

            # Inserir dados adicionais do perfil na tabela 'profiles'
            # O trigger handle_new_user deve criar automaticamente, mas vamos garantir
            try:
                profile_data = {
                    "id": user_data.id,
                    "username": username,
                    "name": username,
                    "email": email,
                    "phone": phone,
                    "cpf": cpf,
                    "balance": 0.00,
                    "monthly_profit": 0.0,
                    "accumulated_profit": 0.0,
                    "is_admin": False,
                    "status": "active"
                }
                print(f"[REGISTER] Tentando buscar perfil existente para ID: {user_data.id}")
                # Verificar se o perfil já foi criado pelo trigger
                existing_profile = supabase.table("profiles").select("*").eq("id", user_data.id).execute()
                print(f"[REGISTER] Perfil existente: {existing_profile.data}, Erro: {existing_profile.error}")
                
                if not existing_profile.data:
                    # Criar perfil se não existir
                    print(f"[REGISTER] Perfil não encontrado, tentando inserir: {profile_data}")
                    insert_response = supabase.table("profiles").insert(profile_data).execute()
                    print(f"[REGISTER] Resposta da inserção do perfil: {insert_response.data}, Erro: {insert_response.error}")
                    if insert_response.error:
                        print(f"[REGISTER] Erro ao inserir perfil: {insert_response.error.message}")
                else:
                    # Atualizar perfil existente com dados completos
                    print(f"[REGISTER] Perfil encontrado, tentando atualizar: {profile_data}")
                    update_response = supabase.table("profiles").update(profile_data).eq("id", user_data.id).execute()
                    print(f"[REGISTER] Resposta da atualização do perfil: {update_response.data}, Erro: {update_response.error}")
                    if update_response.error:
                        print(f"[REGISTER] Erro ao atualizar perfil: {update_response.error.message}")
                    
            except Exception as profile_error:
                print(f"[REGISTER] Erro inesperado ao criar/atualizar perfil: {profile_error}")
                # Continuar mesmo se houver erro no perfil, pois o usuário foi criado no auth

            return jsonify({
                "success": True,
                "message": "User created successfully",
                "user_id": user_data.id
            }), 201

        except Exception as e:
            print(f"[REGISTER] Erro de registro Supabase (geral): {e}")
            error_message = str(e)
            if "already registered" in error_message.lower() or "already exists" in error_message.lower():
                return jsonify({"error": "Este email já está cadastrado"}), 400
            else:
                return jsonify({"error": "Erro ao criar conta. Tente novamente."}), 500

    except Exception as e:
        print(f"[REGISTER] Erro no registro (geral): {e}")
        return jsonify({"error": "Erro interno do servidor"}), 500

@auth_bp.route("/verify", methods=["POST"])
def verify_token():
    try:
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Token is missing"}), 401

        if token.startswith("Bearer "):
            token = token[7:]

        data = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
        
        # Se for admin, retornar dados do admin
        if data.get("user_id") == "admin":
            return jsonify({
                "success": True,
                "user": {
                    "id": "admin",
                    "email": data["email"],
                    "is_admin": True,
                    "name": "Administrador"
                }
            }), 200
        
        # Para usuários normais, buscar dados atualizados do Supabase
        supabase = get_supabase_client()
        if supabase:
            try:
                user_profile = supabase.table("profiles").select("*").eq("id", data["user_id"]).execute()
                if user_profile.data:
                    profile = user_profile.data[0]
                    return jsonify({
                        "success": True,
                        "user": {
                            "id": data["user_id"],
                            "email": data["email"],
                            "is_admin": profile.get("is_admin", False),
                            "name": profile.get("name", data["email"]),
                            "username": profile.get("username", data["email"]),
                            "phone": profile.get("phone"),
                            "cpf": profile.get("cpf"),
                            "balance": float(profile.get("balance", 0.00)),
                            "monthly_profit": float(profile.get("monthly_profit", 0.0)),
                            "accumulated_profit": float(profile.get("accumulated_profit", 0.0)),
                            "status": profile.get("status", "active")
                        }
                    }), 200
            except Exception as e:
                print(f"Erro ao buscar perfil na verificação: {e}")
        
        # Fallback se não conseguir buscar do Supabase
        return jsonify({
            "success": True,
            "user": {
                "id": data["user_id"],
                "email": data["email"],
                "is_admin": data.get("is_admin", False)
            }
        }), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        print(f"Erro na verificação do token: {e}")
        return jsonify({"error": "Erro interno do servidor"}), 500

@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Endpoint para logout (principalmente para limpar sessão do Supabase)"""
    try:
        supabase = get_supabase_client()
        if supabase:
            try:
                supabase.auth.sign_out()
            except Exception as e:
                print(f"Erro ao fazer logout no Supabase: {e}")
        
        return jsonify({
            "success": True,
            "message": "Logout successful"
        }), 200
        
    except Exception as e:
        print(f"Erro no logout: {e}")
        return jsonify({"error": "Erro interno do servidor"}), 500



