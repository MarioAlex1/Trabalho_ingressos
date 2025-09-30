// services/authService.js - Serviço de autenticação com validação automática

export const authService = {
  // Validar se o usuário logado ainda existe no banco
  async validateUserExists() {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!userData || !userData.id) {
      return { valid: false, redirectToLogin: true };
    }
    
    try {
      const response = await fetch(`http://localhost:3001/api/usuarios/${userData.id}`);
      
      if (!response.ok) {
        console.log('⚠️ Usuário não encontrado no banco, fazendo logout automático');
        localStorage.removeItem('user');
        return { valid: false, redirectToLogin: true };
      }
      
      // Atualizar dados do usuário no localStorage com dados do banco
      const usuarioAtual = await response.json();
      localStorage.setItem('user', JSON.stringify(usuarioAtual));
      
      return { valid: true, user: usuarioAtual };
      
    } catch (error) {
      console.error('❌ Erro ao validar usuário no banco:', error);
      localStorage.removeItem('user');
      return { valid: false, redirectToLogin: true, error };
    }
  },
  
  // Obter usuário atual (com validação automática)
  async getCurrentUser() {
    const validation = await this.validateUserExists();
    return validation.valid ? validation.user : null;
  },
  
  // Logout limpo
  logout() {
    localStorage.removeItem('user');
    console.log('🚪 Logout realizado - localStorage limpo');
  },
  
  // Login e salvar no localStorage
  login(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('✅ Login realizado:', userData.nome);
  }
};

export default authService;