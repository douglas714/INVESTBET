<<<<<<< HEAD
from flask import Blueprint, request, jsonify, current_app
import jwt
import datetime

auth_bp = Blueprint("auth", __name__)

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
            }, current_app.config['SECRET_KEY'], algorithm="HS256")

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
        if not current_app.supabase:
            return jsonify({"error": "Serviço de autenticação indisponível"}), 503

        # Tentar fazer login com Supabase
        try:
            response = current_app.supabase.auth.sign_in_with_password({"email": email, "password": password})
            user_data = response.user.dict()

            token = jwt.encode({
                "user_id": user_data["id"],
                "email": user_data["email"],
                "is_admin": False,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, current_app.config['SECRET_KEY'], algorithm="HS256")

            # Buscar dados adicionais do perfil do usuário na tabela 'profiles'
            try:
                user_profile = current_app.supabase.table("profiles").select("*").eq("id", user_data["id"]).execute()
                if user_profile.data:
                    profile = user_profile.data[0]
                    user_info = {
                        "id": user_data["id"],
                        "name": profile.get("name", user_data["email"]),
                        "username": profile.get("username", user_data["email"]),
                        "email": user_data["email"],
                        "phone": profile.get("phone"),
                        "cpf": profile.get("cpf"),
                        "balance": profile.get("balance", 0.00),
                        "monthly_profit": profile.get("monthly_profit", 0.0),
                        "accumulated_profit": profile.get("accumulated_profit", 0.0),
                        "is_admin": profile.get("is_admin", False),
                        "status": profile.get("status", "active"),
                        "created_at": profile.get("created_at")
                    }
                else:
                    user_info = {
                        "id": user_data["id"],
                        "name": user_data["email"],
                        "username": user_data["email"],
                        "email": user_data["email"],
                        "balance": 0.00,
                        "monthly_profit": 0.0,
                        "accumulated_profit": 0.0,
                        "is_admin": False,
                        "status": "active"
                    }
            except Exception as profile_error:
                print(f"Erro ao buscar perfil: {profile_error}")
                user_info = {
                    "id": user_data["id"],
                    "name": user_data["email"],
                    "username": user_data["email"],
                    "email": user_data["email"],
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

        if not all([username, email, password]):
            return jsonify({"error": "Username, email and password are required"}), 400

        # Verificar se Supabase está disponível
        if not current_app.supabase:
            return jsonify({"error": "Serviço de registro indisponível"}), 503

        # Registrar usuário no Supabase Auth
        try:
            response = current_app.supabase.auth.sign_up({"email": email, "password": password})
            user_data = response.user.dict()

            # Inserir dados adicionais do perfil na tabela 'profiles'
            try:
                current_app.supabase.table("profiles").insert({
                    "id": user_data["id"],
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
                }).execute()
            except Exception as profile_error:
                print(f"Erro ao criar perfil: {profile_error}")
                # Continuar mesmo se houver erro no perfil, pois o usuário foi criado no auth

            return jsonify({
                "success": True,
                "message": "User created successfully"
            }), 201

        except Exception as e:
            print(f"Erro de registro Supabase: {e}")
            error_message = str(e)
            if "already registered" in error_message.lower() or "already exists" in error_message.lower():
                return jsonify({"error": "Este email já está cadastrado"}), 400
            else:
                return jsonify({"error": "Erro ao criar conta. Tente novamente."}), 500

    except Exception as e:
        print(f"Erro no registro: {e}")
        return jsonify({"error": "Erro interno do servidor"}), 500

@auth_bp.route("/verify", methods=["POST"])
def verify_token():
    try:
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Token is missing"}), 401

        if token.startswith("Bearer "):
            token = token[7:]

        data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
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

=======
# CÓDIGO CORRETO E FINAL PARA: src/routes/auth.py

from flask import Blueprint, request, jsonify, current_app
from supabase import Client
import jwt
import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        supabase: Client = current_app.supabase
        response = supabase.auth.sign_up({
            "email": data.get('email'),
            "password": data.get('password'),
            "options": {
                "data": {
                    "fullname": data.get('username'),
                    "phone": data.get('phone'),
                    "cpf": data.get('cpf')
                }
            }
        })
        return jsonify({"success": True, "message": "Registro bem-sucedido."}), 201
    except Exception as e:
        error_message = getattr(e, 'message', str(e))
        return jsonify({"success": False, "error": error_message}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        supabase: Client = current_app.supabase
        res = supabase.auth.sign_in_with_password({"email": email, "password": password})
        
        user = res.user
        is_admin = user.user_metadata.get('is_admin', False)
        
        payload = {
            'sub': user.id,
            'is_admin': is_admin,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }
        app_token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({
            "success": True,
            "token": app_token,
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": "Credenciais inválidas"}), 401

@auth_bp.route('/verify', methods=['POST'])
def verify_token_route():
    """Verifica se o token enviado pelo frontend é válido."""
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        
        return jsonify({
            "success": True,
            "user": { "id": payload.get('sub'), "is_admin": payload.get('is_admin') }
        }), 200
    except Exception:
        return jsonify({"success": False, "error": "Token inválido ou expirado"}), 401
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
