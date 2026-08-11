// ==================== GERENCIAMENTO DE ARMAZENAMENTO LOCAL ====================
// Centraliza toda a persistência de dados no localStorage.
// Sem dependência de servidor, banco remoto ou conta de usuário.

const STORAGE_KEY = 'euSeiGerir_v2';

// ==================== ESTRUTURA DE DADOS ====================
// 
// state = {
//     records: [                    // Registros de ganho (múltiplos por dia)
//         {
//             id: 'rec_1723300000000',  // ID único
//             date: '2026-08-10',       // Data no formato YYYY-MM-DD
//             income: 22000,            // Valor ganho em centavos (inteiro)
//             incomeSource: 'Freelance', // Origem do ganho (texto livre)
//             suggestedSavings: 4400,   // Valor sugerido para guardar (centavos)
//             actualSavings: 4400,      // Valor efetivamente guardado (centavos)
//             createdAt: '2026-08-10T12:00:00.000Z',
//             updatedAt: '2026-08-10T12:00:00.000Z'
//         }
//     ],
//     goal: {                       // Objetivo financeiro (opcional)
//         name: 'Comprar minha moto',
//         amount: 1000000,          // Valor total em centavos
//         saved: 50000,             // Valor já guardado em centavos
//         icon: '🏍️',
//         createdAt: '2026-08-10T12:00:00.000Z'
//     },
//     settings: {
//         theme: 'light'            // 'light' | 'dark'
//     },
//     usedMessages: {               // Histórico de mensagens exibidas
//         first: ['first_001'],
//         small_save: [],
//         medium_save: [],
//         large_save: [],
//         above_suggestion: [],
//         streak: [],
//         near_goal: [],
//         goal_reached: [],
//         not_today: [],
//         same_day: []
//     }
// }

// ==================== ESTADO GLOBAL ====================

let state = {
    records: [],
    goal: null,
    settings: {
        theme: 'light'
    },
    usedMessages: {}
};

// ==================== FUNÇÕES DE PERSISTÊNCIA ====================

/**
 * Salva o estado atual no localStorage.
 */
function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error('Erro ao salvar dados:', e);
    }
}

/**
 * Carrega o estado do localStorage.
 * Se não existir, cria um estado vazio.
 */
function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            
            // Mesclar com estado padrão para garantir estrutura correta
            state = {
                records: parsed.records || [],
                goal: parsed.goal || null,
                settings: {
                    theme: parsed.settings?.theme || 'light'
                },
                usedMessages: parsed.usedMessages || {}
            };
        }
    } catch (e) {
        console.error('Erro ao carregar dados:', e);
        // Se houver erro, começa com estado vazio
        state = {
            records: [],
            goal: null,
            settings: { theme: 'light' },
            usedMessages: {}
        };
    }
}

/**
 * Limpa todos os dados do aplicativo.
 */
function clearAllData() {
    localStorage.removeItem(STORAGE_KEY);
    state = {
        records: [],
        goal: null,
        settings: { theme: 'light' },
        usedMessages: {}
    };
}

// ==================== FUNÇÕES DE ACESSO A DADOS ====================

/**
 * Retorna todos os registros de um dia específico.
 * @param {string} date - Data no formato YYYY-MM-DD
 * @returns {Array} Lista de registros do dia
 */
function getRecordsByDate(date) {
    return state.records.filter(r => r.date === date);
}

/**
 * Retorna todos os registros de hoje.
 * @returns {Array} Lista de registros de hoje
 */
function getTodayRecords() {
    const today = new Date().toISOString().split('T')[0];
    return getRecordsByDate(today);
}

/**
 * Retorna o total ganho em um dia específico.
 * @param {string} date - Data no formato YYYY-MM-DD
 * @returns {number} Total em centavos
 */
function getDayTotalEarned(date) {
    return getRecordsByDate(date).reduce((sum, r) => sum + (r.income || 0), 0);
}

/**
 * Retorna o total guardado em um dia específico.
 * @param {string} date - Data no formato YYYY-MM-DD
 * @returns {number} Total em centavos
 */
function getDayTotalSaved(date) {
    return getRecordsByDate(date).reduce((sum, r) => sum + (r.actualSavings || 0), 0);
}

/**
 * Retorna o total ganho hoje.
 * @returns {number} Total em centavos
 */
function getTodayTotalEarned() {
    const today = new Date().toISOString().split('T')[0];
    return getDayTotalEarned(today);
}

/**
 * Retorna o total guardado hoje.
 * @returns {number} Total em centavos
 */
function getTodayTotalSaved() {
    const today = new Date().toISOString().split('T')[0];
    return getDayTotalSaved(today);
}

/**
 * Adiciona um novo registro de ganho.
 * Permite múltiplos registros por dia.
 * @param {object} record - Registro a adicionar
 */
function addRecord(record) {
    state.records.push(record);
    
    // Manter ordenado por data (mais recente primeiro)
    sortRecords();
    
    saveState();
}

/**
 * Atualiza um registro existente.
 * Recalcula todos os dados dependentes.
 * @param {string} recordId - ID do registro
 * @param {object} updates - Campos a atualizar
 */
function updateRecord(recordId, updates) {
    const index = state.records.findIndex(r => r.id === recordId);
    if (index === -1) return;
    
    // Atualizar campos
    state.records[index] = {
        ...state.records[index],
        ...updates,
        updatedAt: new Date().toISOString()
    };
    
    // Recalcular sugestão se o ganho mudou
    if (updates.income !== undefined) {
        state.records[index].suggestedSavings = Math.round(updates.income * FINANCIAL_CONFIG.percentages.save);
    }
    
    sortRecords();
    saveState();
}

/**
 * Remove um registro específico.
 * @param {string} recordId - ID do registro
 */
function removeRecord(recordId) {
    state.records = state.records.filter(r => r.id !== recordId);
    saveState();
}

/**
 * Retorna um registro por ID.
 * @param {string} recordId - ID do registro
 * @returns {object|null} Registro ou null
 */
function getRecordById(recordId) {
    return state.records.find(r => r.id === recordId) || null;
}

/**
 * Ordena os registros por data e hora (mais recente primeiro).
 */
function sortRecords() {
    state.records.sort((a, b) => {
        // Primeiro por data
        const dateCompare = b.date.localeCompare(a.date);
        if (dateCompare !== 0) return dateCompare;
        
        // Depois por createdAt
        return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
}

/**
 * Retorna todos os registros ordenados por data (mais recente primeiro).
 * @returns {Array} Lista de registros
 */
function getAllRecords() {
    return [...state.records].sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date);
        if (dateCompare !== 0) return dateCompare;
        return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
}

/**
 * Retorna o total guardado (soma de todos os valores efetivamente guardados).
 * @returns {number} Total em centavos
 */
function getTotalSaved() {
    return state.records.reduce((sum, r) => sum + (r.actualSavings || 0), 0);
}

/**
 * Retorna o total ganho (soma de todos os valores ganhos).
 * @returns {number} Total em centavos
 */
function getTotalEarned() {
    return state.records.reduce((sum, r) => sum + (r.income || 0), 0);
}

/**
 * Retorna a média guardada por dia (considerando dias com registro).
 * @returns {number} Média em centavos
 */
function getAverageSaved() {
    // Agrupar por dia e somar
    const dayTotals = {};
    state.records.forEach(r => {
        if ((r.actualSavings || 0) > 0) {
            if (!dayTotals[r.date]) dayTotals[r.date] = 0;
            dayTotals[r.date] += r.actualSavings;
        }
    });
    
    const days = Object.keys(dayTotals);
    if (days.length === 0) return 0;
    
    const total = days.reduce((sum, d) => sum + dayTotals[d], 0);
    return Math.round(total / days.length);
}

/**
 * Retorna o maior valor guardado em um único registro.
 * @returns {number} Maior valor em centavos
 */
function getBestSaved() {
    return state.records.reduce((max, r) => Math.max(max, r.actualSavings || 0), 0);
}

/**
 * Retorna o maior valor ganho em um único registro.
 * @returns {number} Maior valor em centavos
 */
function getBestEarned() {
    return state.records.reduce((max, r) => Math.max(max, r.income || 0), 0);
}

/**
 * Retorna o número de dias em que o usuário guardou dinheiro.
 * @returns {number} Quantidade de dias
 */
function getSavingDays() {
    const dayTotals = {};
    state.records.forEach(r => {
        if ((r.actualSavings || 0) > 0) {
            dayTotals[r.date] = true;
        }
    });
    return Object.keys(dayTotals).length;
}

/**
 * Calcula a sequência atual de dias guardando (streak).
 * @returns {number} Sequência em dias
 */
function getCurrentStreak() {
    const dayTotals = {};
    state.records.forEach(r => {
        if ((r.actualSavings || 0) > 0) {
            dayTotals[r.date] = true;
        }
    });
    
    const savingDates = Object.keys(dayTotals).sort();
    
    if (savingDates.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Se não guardou hoje, começa a contar de ontem
    let currentDate = new Date(today);
    if (!savingDates.includes(todayStr)) {
        currentDate.setDate(currentDate.getDate() - 1);
    }
    
    while (true) {
        const dateStr = currentDate.toISOString().split('T')[0];
        if (savingDates.includes(dateStr)) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    return streak;
}

/**
 * Retorna a média diária de ganho (para estimativa de objetivo).
 * @returns {number} Média em centavos
 */
function getAverageEarned() {
    // Agrupar por dia e somar
    const dayTotals = {};
    state.records.forEach(r => {
        if ((r.income || 0) > 0) {
            if (!dayTotals[r.date]) dayTotals[r.date] = 0;
            dayTotals[r.date] += r.income;
        }
    });
    
    const days = Object.keys(dayTotals);
    if (days.length === 0) return 0;
    
    const total = days.reduce((sum, d) => sum + dayTotals[d], 0);
    return Math.round(total / days.length);
}

/**
 * Retorna os registros agrupados por dia.
 * @returns {Array} Lista de dias com { date, earned, saved, records }
 */
function getRecordsByDay() {
    const dayMap = {};
    
    state.records.forEach(r => {
        if (!dayMap[r.date]) {
            dayMap[r.date] = {
                date: r.date,
                earned: 0,
                saved: 0,
                records: []
            };
        }
        dayMap[r.date].earned += r.income || 0;
        dayMap[r.date].saved += r.actualSavings || 0;
        dayMap[r.date].records.push(r);
    });
    
    return Object.values(dayMap).sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Recalcula o total guardado no objetivo baseado nos registros.
 * Isso garante que edições/exclusões atualizem o objetivo corretamente.
 */
function recalculateGoalFromRecords() {
    if (!state.goal) return;
    
    // O objetivo guarda o valor inicial + todos os registros
    // O valor inicial é armazenado separadamente
    const initialSaved = state.goal.initialSaved || 0;
    const recordsTotal = getTotalSaved();
    
    state.goal.saved = initialSaved + recordsTotal;
    saveState();
}

// ==================== FUNÇÕES DE OBJETIVO ====================

/**
 * Salva o objetivo financeiro.
 * @param {object} goal - Objetivo a salvar
 */
function saveGoal(goal) {
    // Se for novo objetivo, guardar o valor inicial separadamente
    if (!state.goal) {
        goal.initialSaved = goal.saved || 0;
    }
    state.goal = goal;
    saveState();
}

/**
 * Remove o objetivo financeiro.
 */
function deleteGoal() {
    state.goal = null;
    saveState();
}

/**
 * Adiciona valor guardado ao objetivo.
 * @param {number} amount - Valor em centavos
 */
function addToGoal(amount) {
    if (state.goal) {
        state.goal.saved = (state.goal.saved || 0) + amount;
        saveState();
    }
}

// ==================== FUNÇÕES DE TEMA ====================

/**
 * Retorna o tema atual.
 * @returns {string} 'light' ou 'dark'
 */
function getTheme() {
    return state.settings.theme;
}

/**
 * Alterna o tema.
 * @returns {string} Novo tema
 */
function toggleTheme() {
    state.settings.theme = state.settings.theme === 'light' ? 'dark' : 'light';
    saveState();
    return state.settings.theme;
}

// ==================== FUNÇÕES DE MENSAGENS ====================

/**
 * Registra que uma mensagem foi exibida.
 * @param {string} group - Grupo da mensagem (ex: 'first', 'small_save')
 * @param {string} messageId - ID da mensagem (ex: 'first_001')
 */
function markMessageUsed(group, messageId) {
    if (!state.usedMessages[group]) {
        state.usedMessages[group] = [];
    }
    if (!state.usedMessages[group].includes(messageId)) {
        state.usedMessages[group].push(messageId);
        saveState();
    }
}

/**
 * Retorna as mensagens já utilizadas de um grupo.
 * @param {string} group - Grupo da mensagem
 * @returns {Array} Lista de IDs utilizados
 */
function getUsedMessages(group) {
    return state.usedMessages[group] || [];
}

// ==================== MIGRAÇÃO DE DADOS ANTIGOS ====================

/**
 * Migra dados do formato antigo (v1) para o novo formato (v2).
 * Preserva registros de ganho e metas existentes.
 */
function migrateOldData() {
    try {
        // Verificar se já migrou
        if (localStorage.getItem(STORAGE_KEY)) return;
        
        // Dados antigos
        const oldTransactions = JSON.parse(localStorage.getItem('euSeiGerir_transactions') || '[]');
        const oldGoals = JSON.parse(localStorage.getItem('euSeiGerir_goals') || '[]');
        
        if (oldTransactions.length > 0 || oldGoals.length > 0) {
            // Migrar transações de receita para registros diários
            oldTransactions
                .filter(t => t.type === 'income')
                .forEach(t => {
                    const date = t.date;
                    const income = Math.round(t.amount * 100);
                    const suggestedSavings = Math.round(income * FINANCIAL_CONFIG.percentages.save);
                    
                    state.records.push({
                        id: 'migrated_' + t.id + '_' + Date.now(),
                        date: date,
                        income: income,
                        incomeSource: t.category || 'Outros',
                        suggestedSavings: suggestedSavings,
                        actualSavings: 0,
                        createdAt: t.createdAt || new Date(date + 'T12:00:00.000Z').toISOString(),
                        updatedAt: t.createdAt || new Date(date + 'T12:00:00.000Z').toISOString()
                    });
                });
            
            // Migrar metas para objetivo
            if (oldGoals.length > 0) {
                const firstGoal = oldGoals[0];
                state.goal = {
                    name: firstGoal.name || 'Meu objetivo',
                    amount: Math.round((firstGoal.amount || 0) * 100),
                    saved: Math.round((firstGoal.saved || 0) * 100),
                    initialSaved: Math.round((firstGoal.saved || 0) * 100),
                    icon: firstGoal.icon || '🎯',
                    createdAt: firstGoal.createdAt || new Date().toISOString()
                };
            }
            
            // Ordenar registros
            sortRecords();
            
            saveState();
            
            // Limpar dados antigos
            localStorage.removeItem('euSeiGerir_transactions');
            localStorage.removeItem('euSeiGerir_goals');
            localStorage.removeItem('euSeiGerir_wallets');
            localStorage.removeItem('euSeiGerir_bills');
            localStorage.removeItem('euSeiGerir_settings');
            localStorage.removeItem('euSeiGerir_achievements');
        }
    } catch (e) {
        console.error('Erro na migração de dados:', e);
    }
}

// Exportar funções globais
window.StorageManager = {
    saveState,
    loadState,
    clearAllData,
    getRecordsByDate,
    getTodayRecords,
    getDayTotalEarned,
    getDayTotalSaved,
    getTodayTotalEarned,
    getTodayTotalSaved,
    addRecord,
    updateRecord,
    removeRecord,
    getRecordById,
    getAllRecords,
    getTotalSaved,
    getTotalEarned,
    getAverageSaved,
    getBestSaved,
    getBestEarned,
    getSavingDays,
    getCurrentStreak,
    getAverageEarned,
    getRecordsByDay,
    recalculateGoalFromRecords,
    saveGoal,
    deleteGoal,
    addToGoal,
    getTheme,
    toggleTheme,
    markMessageUsed,
    getUsedMessages,
    migrateOldData,
    get state() { return state; }
};