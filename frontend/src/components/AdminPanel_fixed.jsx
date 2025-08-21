import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Settings, 
  TrendingUp, 
  Users, 
  BarChart3, 
  DollarSign,
  UserPlus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Save,
  CheckCircle,
  RefreshCw,
  Shield,
  AlertCircle
} from 'lucide-react'
import logoImage from '../assets/investbet-logo.jpg'

const AdminPanel = () => {
  const [newMonthlyProfit, setNewMonthlyProfit] = useState(5.2)
  const [newAccumulatedProfit, setNewAccumulatedProfit] = useState(15.8)
  const [message, setMessage] = useState('')
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [activeTab, setActiveTab] = useState('profits')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    balance: 0,
    monthly_profit: 0,
    accumulated_profit: 0
  })
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    total_balance: 0,
    admin_users: 0
  })
  const [connectionStatus, setConnectionStatus] = useState('checking')
  const navigate = useNavigate()

  useEffect(() => {
    checkConnection()
    if (activeTab === 'users') {
      fetchUsers()
    }
    fetchStats()
  }, [activeTab])

  const checkConnection = async () => {
    try {
      const response = await fetch('/api/health')
      if (response.ok) {
        const data = await response.json()
        setConnectionStatus(data.supabase === 'connected' ? 'connected' : 'disconnected')
      } else {
        setConnectionStatus('disconnected')
      }
    } catch (error) {
      console.error('Erro ao verificar conexão:', error)
      setConnectionStatus('disconnected')
    }
  }

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('investapp_token')
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data)
        setMessage('')
      } else {
        const errorData = await response.json()
        setMessage(`Erro ao carregar usuários: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      setMessage('Erro de conexão ao carregar usuários')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('investapp_token')
      const response = await fetch('/api/users/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    }
  }

  const updateProfits = async () => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('investapp_token')
      
      // Atualizar todos os usuários com os novos valores de lucro
      const updatePromises = users.map(user => 
        fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            monthly_profit: newMonthlyProfit,
            accumulated_profit: newAccumulatedProfit
          })
        })
      )

      const results = await Promise.all(updatePromises)
      const successCount = results.filter(r => r.ok).length
      
      if (successCount === users.length) {
        setMessage(`✅ Lucros atualizados para ${successCount} usuários com sucesso!`)
        fetchUsers() // Recarregar lista de usuários
        fetchStats() // Recarregar estatísticas
      } else {
        setMessage(`⚠️ ${successCount}/${users.length} usuários atualizados. Alguns falharam.`)
      }
    } catch (error) {
      console.error('Erro ao atualizar lucros:', error)
      setMessage('❌ Erro ao atualizar lucros')
    } finally {
      setIsSaving(false)
    }
  }

  const startEditUser = (user) => {
    setEditingUser(user.id)
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      cpf: user.cpf || '',
      balance: user.balance || 0,
      monthly_profit: user.monthly_profit || 0,
      accumulated_profit: user.accumulated_profit || 0
    })
  }

  const saveUserEdit = async () => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('investapp_token')
      const response = await fetch(`/api/users/${editingUser}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      })

      if (response.ok) {
        setMessage('✅ Usuário atualizado com sucesso!')
        setEditingUser(null)
        fetchUsers()
        fetchStats()
      } else {
        const errorData = await response.json()
        setMessage(`❌ Erro ao atualizar usuário: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Erro ao salvar usuário:', error)
      setMessage('❌ Erro de conexão ao salvar usuário')
    } finally {
      setIsSaving(false)
    }
  }

  const deleteUser = async (userId) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return

    try {
      const token = localStorage.getItem('investapp_token')
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setMessage('✅ Usuário deletado com sucesso!')
        fetchUsers()
        fetchStats()
      } else {
        const errorData = await response.json()
        setMessage(`❌ Erro ao deletar usuário: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      setMessage('❌ Erro de conexão ao deletar usuário')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
              <div className="flex items-center space-x-3">
                <img src={logoImage} alt="InvestPro Capital" className="h-8 w-8 rounded" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Painel Administrativo</h1>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      connectionStatus === 'connected' ? 'bg-green-500' : 
                      connectionStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-sm text-gray-500">
                      {connectionStatus === 'connected' ? 'Conectado' : 
                       connectionStatus === 'disconnected' ? 'Desconectado' : 'Verificando...'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={checkConnection}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Atualizar</span>
              </Button>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>Admin</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mensagem de status */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' :
            message.includes('⚠️') ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
            'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              {message.includes('✅') ? <CheckCircle className="h-5 w-5" /> :
               message.includes('⚠️') ? <AlertCircle className="h-5 w-5" /> :
               <AlertCircle className="h-5 w-5" />}
              <span>{message}</span>
            </div>
          </div>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_users}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active_users}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Saldo Total</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.total_balance)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Administradores</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.admin_users}</p>
                </div>
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('profits')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profits'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Gerenciar Lucros</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Gerenciar Usuários</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === 'profits' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Atualizar Lucros Globais</span>
              </CardTitle>
              <CardDescription>
                Defina os novos valores de lucro que serão aplicados a todos os usuários
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="monthly-profit">Lucro Mensal (%)</Label>
                  <Input
                    id="monthly-profit"
                    type="number"
                    step="0.1"
                    value={newMonthlyProfit}
                    onChange={(e) => setNewMonthlyProfit(parseFloat(e.target.value))}
                    placeholder="Ex: 5.2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accumulated-profit">Lucro Acumulado (%)</Label>
                  <Input
                    id="accumulated-profit"
                    type="number"
                    step="0.1"
                    value={newAccumulatedProfit}
                    onChange={(e) => setNewAccumulatedProfit(parseFloat(e.target.value))}
                    placeholder="Ex: 15.8"
                  />
                </div>
              </div>
              <Button
                onClick={updateProfits}
                disabled={isSaving}
                className="w-full md:w-auto"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Atualizar Lucros de Todos os Usuários
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Gerenciar Usuários</span>
              </CardTitle>
              <CardDescription>
                Visualize e edite informações dos usuários cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por nome, email ou username..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos os Status</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>

              {/* Lista de Usuários */}
              {isLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Carregando usuários...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Nenhum usuário encontrado</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                      {editingUser === user.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Nome</Label>
                              <Input
                                value={editForm.name}
                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label>Email</Label>
                              <Input
                                value={editForm.email}
                                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                disabled
                              />
                            </div>
                            <div>
                              <Label>Telefone</Label>
                              <Input
                                value={editForm.phone}
                                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label>CPF</Label>
                              <Input
                                value={editForm.cpf}
                                onChange={(e) => setEditForm({...editForm, cpf: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label>Saldo (R$)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={editForm.balance}
                                onChange={(e) => setEditForm({...editForm, balance: parseFloat(e.target.value)})}
                              />
                            </div>
                            <div>
                              <Label>Lucro Mensal (%)</Label>
                              <Input
                                type="number"
                                step="0.1"
                                value={editForm.monthly_profit}
                                onChange={(e) => setEditForm({...editForm, monthly_profit: parseFloat(e.target.value)})}
                              />
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button onClick={saveUserEdit} disabled={isSaving}>
                              {isSaving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                              Salvar
                            </Button>
                            <Button variant="outline" onClick={() => setEditingUser(null)}>
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <div>
                                <h3 className="font-medium text-gray-900">{user.name || user.username}</h3>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                              <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                                {user.status === 'active' ? 'Ativo' : 'Inativo'}
                              </Badge>
                              {user.is_admin && (
                                <Badge variant="outline" className="text-purple-600 border-purple-600">
                                  Admin
                                </Badge>
                              )}
                            </div>
                            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Saldo:</span>
                                <span className="ml-1 font-medium">{formatCurrency(user.balance)}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Lucro Mensal:</span>
                                <span className="ml-1 font-medium">{user.monthly_profit}%</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Lucro Acumulado:</span>
                                <span className="ml-1 font-medium">{user.accumulated_profit}%</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Cadastro:</span>
                                <span className="ml-1 font-medium">{formatDate(user.created_at)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEditUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteUser(user.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
<<<<<<< HEAD

=======
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
