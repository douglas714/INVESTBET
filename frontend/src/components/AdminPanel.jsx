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
  Shield
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
  const navigate = useNavigate()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
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
        setMessage('Usuários carregados com sucesso!')
      } else {
        setMessage('Erro ao carregar usuários do servidor')
        console.error('Erro ao carregar usuários:', response.statusText)
      }
    } catch (error) {
      console.error('Erro ao conectar com o backend:', error)
      setMessage('Erro de conexão com o servidor')
    } finally {
      setIsLoading(false)
    }
  }

  const updateAllProfits = async () => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('investapp_token')
      const updatePromises = users.map(user => 
        fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...user,
            monthly_profit: newMonthlyProfit,
            accumulated_profit: newAccumulatedProfit
          })
        })
      )

      await Promise.all(updatePromises)
      
      // Recarregar usuários
      await loadUsers()
      setMessage(`Lucros atualizados para todos os usuários: Mensal ${newMonthlyProfit}%, Acumulado ${newAccumulatedProfit}%`)
    } catch (error) {
      console.error('Erro ao atualizar lucros:', error)
      setMessage('Erro ao atualizar lucros dos usuários')
    } finally {
      setIsSaving(false)
    }
  }

  const deleteUser = async (userId) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
      return
    }

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
        await loadUsers()
        setMessage('Usuário excluído com sucesso!')
      } else {
        setMessage('Erro ao excluir usuário')
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error)
      setMessage('Erro de conexão ao excluir usuário')
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

  const saveEditUser = async () => {
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
        await loadUsers()
        setEditingUser(null)
        setMessage('Usuário atualizado com sucesso!')
      } else {
        setMessage('Erro ao atualizar usuário')
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      setMessage('Erro de conexão ao atualizar usuário')
    }
  }

  const cancelEdit = () => {
    setEditingUser(null)
    setEditForm({
      name: '',
      email: '',
      phone: '',
      cpf: '',
      balance: 0,
      monthly_profit: 0,
      accumulated_profit: 0
    })
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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <div className="w-10 h-10 bg-white rounded-full shadow-md overflow-hidden">
                <img 
                  src={logoImage} 
                  alt="InvestPro Capital" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-sm text-gray-500">InvestPro Capital</p>
              </div>
            </div>
            
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Shield className="w-3 h-3 mr-1" />
              Administrador
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                Usuários registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === 'active' || !u.status).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Com status ativo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lucro Mensal Atual</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
<<<<<<< HEAD
                {newMonthlyProfit}%
=======
                {users.length > 0 ? users[0].monthly_profit : newMonthlyProfit}%
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
              </div>
              <p className="text-xs text-muted-foreground">
                Taxa configurada
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lucro Acumulado</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
<<<<<<< HEAD
                {newAccumulatedProfit}%
=======
                {users.length > 0 ? users[0].accumulated_profit : newAccumulatedProfit}%
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
              </div>
              <p className="text-xs text-muted-foreground">
                Taxa configurada
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <p className="text-blue-800">{message}</p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === 'profits' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('profits')}
          >
            Gerenciar Lucros
          </Button>
          <Button
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('users')}
          >
            Usuários Cadastrados
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profits' && (
          <Card>
            <CardHeader>
              <CardTitle>Atualizar Lucros dos Usuários</CardTitle>
              <CardDescription>
                Configure os percentuais de lucro mensal e acumulado para todos os usuários
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="monthlyProfit">Lucro Mensal (%)</Label>
                  <Input
                    id="monthlyProfit"
                    type="number"
                    step="0.1"
                    value={newMonthlyProfit}
                    onChange={(e) => setNewMonthlyProfit(parseFloat(e.target.value) || 0)}
                    className="h-12"
                  />
                  <p className="text-sm text-gray-600">
                    Percentual de lucro mensal para todos os usuários
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accumulatedProfit">Lucro Acumulado (%)</Label>
                  <Input
                    id="accumulatedProfit"
                    type="number"
                    step="0.1"
                    value={newAccumulatedProfit}
                    onChange={(e) => setNewAccumulatedProfit(parseFloat(e.target.value) || 0)}
                    className="h-12"
                  />
                  <p className="text-sm text-gray-600">
                    Percentual de lucro acumulado para todos os usuários
                  </p>
                </div>
              </div>

              <Button 
                onClick={updateAllProfits}
                disabled={isSaving}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Atualizando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Atualizar Todos os Usuários
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Usuários Cadastrados</CardTitle>
                  <CardDescription>
                    Gerencie os usuários registrados na plataforma
                  </CardDescription>
                </div>
                <Button
                  onClick={loadUsers}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por nome, email ou usuário..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="all">Todos os Status</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>

              {/* Users Table */}
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando usuários...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {users.length === 0 ? 'Nenhum usuário encontrado' : 'Nenhum usuário corresponde aos filtros'}
                  </h3>
                  <p className="text-gray-600">
                    {users.length === 0 
                      ? 'Os usuários cadastrados aparecerão aqui automaticamente.' 
                      : 'Tente ajustar os filtros de busca.'
                    }
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuário
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contato
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Saldo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lucros
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.name || user.username || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">
                                @{user.username || 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{user.phone || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingUser === user.id ? (
                              <Input
                                type="number"
                                step="0.01"
                                value={editForm.balance}
                                onChange={(e) => setEditForm({...editForm, balance: parseFloat(e.target.value) || 0})}
                                className="w-24"
                              />
                            ) : (
                              <div className="text-sm font-medium text-gray-900">
                                {formatCurrency(user.balance)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingUser === user.id ? (
                              <div className="space-y-1">
                                <Input
                                  type="number"
                                  step="0.1"
                                  value={editForm.monthly_profit}
                                  onChange={(e) => setEditForm({...editForm, monthly_profit: parseFloat(e.target.value) || 0})}
                                  className="w-20"
                                  placeholder="Mensal"
                                />
                                <Input
                                  type="number"
                                  step="0.1"
                                  value={editForm.accumulated_profit}
                                  onChange={(e) => setEditForm({...editForm, accumulated_profit: parseFloat(e.target.value) || 0})}
                                  className="w-20"
                                  placeholder="Acum."
                                />
                              </div>
                            ) : (
                              <div>
                                <div className="text-sm text-green-600">
                                  M: {(user.monthly_profit || 0).toFixed(2)}%
                                </div>
                                <div className="text-sm text-blue-600">
                                  A: {(user.accumulated_profit || 0).toFixed(2)}%
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={user.status === 'active' || !user.status ? 'default' : 'secondary'}>
                              {user.status || 'active'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {editingUser === user.id ? (
                              <div className="flex gap-2">
                                <Button size="sm" onClick={saveEditUser}>
                                  <Save className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={cancelEdit}>
                                  ✕
                                </Button>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => startEditUser(user)}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => deleteUser(user.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

export default AdminPanel

