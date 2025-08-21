import { supabase } from '../main';

/**
 * Busca os dados financeiros de um usuário específico
 * @param {string} userId - ID do usuário
 * @returns {Promise<Object>} Dados financeiros do usuário
 */
export const fetchUserFinancialData = async (userId) => {
  try {
    console.log(`[fetchUserFinancialData] Buscando dados para usuário: ${userId}`);
    
    const { data, error } = await supabase
      .from('user_finances')
      .select('balance, monthly_profit, accumulated_profit')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('[fetchUserFinancialData] Erro ao buscar dados financeiros:', error);
      
      // Se o erro for que não encontrou registro, retorna dados padrão
      if (error.code === 'PGRST116') {
        console.log('[fetchUserFinancialData] Nenhum registro encontrado, retornando dados padrão');
        return {
          balance: 0,
          monthly_profit: 0,
          accumulated_profit: 0
        };
      }
      
      throw error;
    }

    // Garantir que os dados têm a estrutura correta
    const validatedData = {
      balance: data?.balance || 0,
      monthly_profit: data?.monthly_profit || 0,
      accumulated_profit: data?.accumulated_profit || 0
    };

    console.log('[fetchUserFinancialData] Dados encontrados:', validatedData);
    return validatedData;

  } catch (err) {
    console.error('[fetchUserFinancialData] Erro na função:', err);
    throw err;
  }
};

/**
 * Atualiza os dados financeiros de um usuário
 * @param {string} userId - ID do usuário
 * @param {Object} financialData - Dados financeiros a serem atualizados
 * @returns {Promise<Object>} Dados atualizados
 */
export const updateUserFinancialData = async (userId, financialData) => {
  try {
    console.log(`[updateUserFinancialData] Atualizando dados para usuário: ${userId}`, financialData);
    
    const { data, error } = await supabase
      .from('user_finances')
      .upsert({
        user_id: userId,
        ...financialData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('[updateUserFinancialData] Erro ao atualizar dados financeiros:', error);
      throw error;
    }

    console.log('[updateUserFinancialData] Dados atualizados com sucesso:', data);
    return data;
  } catch (err) {
    console.error('[updateUserFinancialData] Erro na função:', err);
    throw err;
  }
};

/**
 * Configura uma subscription para mudanças em tempo real na tabela user_finances
 * @param {string} userId - ID do usuário para filtrar as mudanças
 * @param {function} callback - Função a ser chamada quando houver mudanças
 * @returns {Object} Subscription object
 */
export const subscribeToFinancialChanges = (userId, callback) => {
  console.log(`[subscribeToFinancialChanges] Configurando subscription para usuário: ${userId}`);
  
  const subscription = supabase
    .channel(`user_finances_changes_${userId}`)
    .on('postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_finances',
        filter: `user_id=eq.${userId}` // Filtro por usuário específico
      },
      (payload) => {
        console.log(`[subscribeToFinancialChanges] Mudança detectada para usuário ${userId}:`, payload);
        
        if (callback && typeof callback === 'function') {
          // Extrair os dados relevantes do payload
          const newData = payload.new || payload.old;
          if (newData) {
            const financialData = {
              balance: newData.balance || 0,
              monthly_profit: newData.monthly_profit || 0,
              accumulated_profit: newData.accumulated_profit || 0
            };
            callback(financialData);
          }
        }
      }
    )
    .subscribe();

  console.log(`[subscribeToFinancialChanges] Subscription configurada:`, subscription);
  return subscription;
};

/**
 * Verifica se a tabela user_finances existe e tem a estrutura correta
 * @returns {Promise<boolean>} True se a tabela existe e está configurada corretamente
 */
export const checkTableStructure = async () => {
  try {
    console.log('[checkTableStructure] Verificando estrutura da tabela...');
    
    // Tenta fazer uma consulta simples para verificar se a tabela existe
    const { data, error } = await supabase
      .from('user_finances')
      .select('*')
      .limit(1);

    if (error) {
      console.error('[checkTableStructure] Erro ao verificar estrutura da tabela:', error);
      return false;
    }

    console.log('[checkTableStructure] Tabela verificada com sucesso');
    return true;
  } catch (err) {
    console.error('[checkTableStructure] Erro na função:', err);
    return false;
  }
};

/**
 * Cria um registro inicial de dados financeiros para um novo usuário
 * @param {string} userId - ID do usuário
 * @returns {Promise<Object>} Dados criados
 */
export const createInitialFinancialRecord = async (userId) => {
  console.log(`[createInitialFinancialRecord] Tentando criar registro financeiro inicial para o usuário: ${userId}`);
  
  try {
    const initialData = {
      user_id: userId,
      balance: 0,
      monthly_profit: 0,
      accumulated_profit: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_finances')
      .insert(initialData)
      .select()
      .single();

    if (error) {
      console.error('[createInitialFinancialRecord] Erro ao criar registro financeiro inicial:', error);
      throw error;
    }

    console.log('[createInitialFinancialRecord] Registro financeiro inicial criado com sucesso:', data);
    
    // Retornar apenas os dados financeiros relevantes
    return {
      balance: data.balance || 0,
      monthly_profit: data.monthly_profit || 0,
      accumulated_profit: data.accumulated_profit || 0
    };
    
  } catch (err) {
    console.error('[createInitialFinancialRecord] Erro na função:', err);
    throw err;
  }
};

/**
 * Função utilitária para verificar se o usuário tem dados financeiros
 * @param {string} userId - ID do usuário
 * @returns {Promise<boolean>} True se o usuário tem dados financeiros
 */
export const userHasFinancialData = async (userId) => {
  try {
    console.log(`[userHasFinancialData] Verificando se usuário ${userId} tem dados financeiros`);
    
    const { data, error } = await supabase
      .from('user_finances')
      .select('user_id')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[userHasFinancialData] Erro ao verificar dados:', error);
      return false;
    }

    const hasData = !!data;
    console.log(`[userHasFinancialData] Usuário ${userId} ${hasData ? 'tem' : 'não tem'} dados financeiros`);
    return hasData;
    
  } catch (err) {
    console.error('[userHasFinancialData] Erro na função:', err);
    return false;
  }
};

/**
 * Busca o perfil (nome) do usuário na tabela de perfis
 * Observação: Se sua tabela não for 'profiles', altere o nome da constante PROFILE_TABLE abaixo
 */
const PROFILE_TABLE = 'profiles';

export const fetchUserProfile = async (userId) => {
  try {
    console.log(`[fetchUserProfile] Buscando perfil para usuário: ${userId}`);

    // Seleciona todas as colunas para evitar erro caso alguns campos não existam
    const { data, error } = await supabase
      .from(PROFILE_TABLE)
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('[fetchUserProfile] Nenhum perfil encontrado para o usuário');
        return null;
      }
      console.error('[fetchUserProfile] Erro ao buscar perfil:', error);
      throw error;
    }

    // Tenta determinar o melhor nome disponível
    const name = data.full_name || data.name || data.display_name || data.username || data.first_name || data.last_name || null;

    const profile = {
      id: data.id,
      email: data.email || null,
      name,
      raw: data,
    };

    console.log('[fetchUserProfile] Perfil encontrado:', profile);
    return profile;
  } catch (err) {
    console.error('[fetchUserProfile] Erro na função:', err);
    return null;
  }
};

/**
 * Atualiza o perfil do usuário na tabela de perfis
 * @param {string} userId - ID do usuário
 * @param {Object} profileData - Dados do perfil a serem atualizados (ex: { full_name: 'Novo Nome' })
 * @returns {Promise<Object>} Dados do perfil atualizados
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    console.log(`[updateUserProfile] Atualizando perfil para usuário: ${userId}`, profileData);

    const { data, error } = await supabase
      .from(PROFILE_TABLE)
      .upsert({
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('[updateUserProfile] Erro ao atualizar perfil:', error);
      throw error;
    }

    console.log('[updateUserProfile] Perfil atualizado com sucesso:', data);
    return data;
  } catch (err) {
    console.error('[updateUserProfile] Erro na função:', err);
    throw err;
  }
};

/**
 * Subscription para mudanças no perfil do usuário (nome atualizado em tempo real)
 */
export const subscribeToProfileChanges = (userId, callback) => {
  console.log(`[subscribeToProfileChanges] Configurando subscription para perfil do usuário: ${userId}`);

  const subscription = supabase
    .channel(`user_profile_changes_${userId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: PROFILE_TABLE,
      filter: `id=eq.${userId}`,
    }, (payload) => {
      const row = payload.new || payload.old || {};
      const name = row.full_name || row.name || row.display_name || row.username || row.first_name || row.last_name || null;
      const profile = {
        id: row.id,
        email: row.email || null,
        name,
        raw: row,
      };
      console.log('[subscribeToProfileChanges] Mudança detectada no perfil:', profile);
      if (callback) callback(profile);
    })
    .subscribe();

  return subscription;
};
