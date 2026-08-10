// ==================== SISTEMA DE MENSAGENS POSITIVAS ====================
// Controla o histórico de mensagens exibidas para evitar repetição.
// 
// Fluxo:
// 1. Buscar mensagens compatíveis com o contexto
// 2. Remover as já utilizadas
// 3. Selecionar uma mensagem disponível (aleatória entre as disponíveis)
// 4. Registrar que foi utilizada
// 5. Exibir ao usuário
//
// Quando todas as mensagens de um grupo forem utilizadas,
// o ciclo é reiniciado (após esgotar todas as opções).

/**
 * Seleciona uma mensagem do grupo que ainda não foi utilizada.
 * Verifica o histórico local de mensagens exibidas.
 * 
 * @param {string} group - Grupo de mensagens (ex: 'first', 'small_save', 'streak')
 * @returns {object|null} Mensagem selecionada ou null se o grupo não existir
 */
function selectMessage(group) {
    const messages = MESSAGES[group];
    if (!messages || messages.length === 0) return null;
    
    // 1. Buscar mensagens já utilizadas deste grupo
    const usedMessages = StorageManager.getUsedMessages(group);
    
    // 2. Filtrar mensagens disponíveis (não utilizadas)
    const availableMessages = messages.filter(m => !usedMessages.includes(m.id));
    
    // 3. Se todas foram utilizadas, reiniciar o ciclo
    if (availableMessages.length === 0) {
        return resetAndSelect(group, messages);
    }
    
    // 4. Selecionar aleatoriamente entre as disponíveis
    const randomIndex = Math.floor(Math.random() * availableMessages.length);
    const selected = availableMessages[randomIndex];
    
    // 5. Registrar que foi utilizada
    StorageManager.markMessageUsed(group, selected.id);
    
    return selected;
}

/**
 * Quando todas as mensagens do grupo foram utilizadas, limpa o histórico
 * e seleciona uma mensagem novamente. Isso garante que a não-repetição
 * é priorizada até esgotar todas as opções.
 * 
 * @param {string} group - Grupo de mensagens
 * @param {Array} messages - Lista de mensagens do grupo
 * @returns {object} Mensagem selecionada
 */
function resetAndSelect(group, messages) {
    // Limpar apenas o histórico deste grupo
    const state = StorageManager.state;
    state.usedMessages[group] = [];
    StorageManager.saveState();
    
    // Selecionar aleatoriamente
    const randomIndex = Math.floor(Math.random() * messages.length);
    const selected = messages[randomIndex];
    
    // Registrar como utilizada
    StorageManager.markMessageUsed(group, selected.id);
    
    return selected;
}

/**
 * Determina o contexto da mensagem baseado no comportamento do usuário.
 * 
 * @param {object} context - Contexto do registro
 * @param {boolean} context.isFirst - É o primeiro registro do usuário?
 * @param {number} context.saved - Valor guardado em centavos
 * @param {number} context.suggested - Valor sugerido em centavos
 * @param {number} context.streak - Sequência de dias atuais
 * @param {number} context.goalProgress - Progresso do objetivo (0-100)
 * @param {boolean} context.goalReached - Objetivo foi alcançado?
 * @param {boolean} context.isUpdated - Registro do mesmo dia foi atualizado?
 * @returns {string} Nome do grupo de mensagens
 */
function getMessageContext(context) {
    // Prioridade máxima: objetivo alcançado
    if (context.goalReached) {
        return 'goal_reached';
    }
    
    // Primeiro registro do usuário
    if (context.isFirst) {
        return 'first';
    }
    
    // Registro atualizado no mesmo dia
    if (context.isUpdated) {
        return 'same_day';
    }
    
    // Próximo do objetivo (70%+)
    if (context.goalProgress >= 70) {
        return 'near_goal';
    }
    
    // Guardou mais que a sugestão
    if (context.saved > context.suggested && context.suggested > 0) {
        return 'above_suggestion';
    }
    
    // Sequência de dias (3+)
    if (context.streak >= 3) {
        return 'streak';
    }
    
    // Baseado no valor guardado
    if (context.saved >= 10000) { // R$ 100+
        return 'large_save';
    }
    if (context.saved >= 2000) { // R$ 20+
        return 'medium_save';
    }
    return 'small_save'; // Abaixo de R$ 20
}

/**
 * Seleciona e retorna uma mensagem contextuada.
 * Esta é a função principal usada pela interface.
 * 
 * @param {object} context - Contexto do registro (ver getMessageContext)
 * @returns {object|null} Mensagem selecionada { id, text }
 */
function getContextualMessage(context) {
    const group = getMessageContext(context);
    return selectMessage(group);
}

// Exportar funções globais
window.Messages = {
    selectMessage,
    getContextualMessage,
    getMessageContext
};