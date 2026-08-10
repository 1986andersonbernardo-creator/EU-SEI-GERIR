// ==================== CÁLCULOS FINANCEIROS ====================
// Centraliza todos os cálculos monetários.
// Trabalha internamente com centavos (inteiros) para evitar erros de ponto flutuante.

// ==================== CONVERSÃO DE MOEDA ====================

/**
 * Converte um valor em reais (float) para centavos (inteiro).
 * Ex: 200.5 -> 20050
 * @param {number|string} value - Valor em reais
 * @returns {number} Valor em centavos
 */
function reaisToCentavos(value) {
    if (value === null || value === undefined || value === '') return 0;
    
    // Se for string, tenta converter
    if (typeof value === 'string') {
        // Remove "R$", espaços e pontos de milhar
        let cleaned = value.replace(/[R$\s]/g, '');
        // Troca vírgula decimal por ponto
        cleaned = cleaned.replace('.', '').replace(',', '.');
        value = parseFloat(cleaned);
    }
    
    if (isNaN(value) || value < 0) return 0;
    
    // Arredonda para evitar erros de ponto flutuante
    return Math.round(value * 100);
}

/**
 * Converte centavos (inteiro) para reais (float).
 * Ex: 20050 -> 200.5
 * @param {number} centavos - Valor em centavos
 * @returns {number} Valor em reais
 */
function centavosToReais(centavos) {
    return centavos / 100;
}

/**
 * Formata centavos como moeda brasileira.
 * Ex: 20050 -> "R$ 200,50"
 * @param {number} centavos - Valor em centavos
 * @returns {string} Valor formatado
 */
function formatCurrency(centavos) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(centavosToReais(centavos || 0));
}

/**
 * Formata centavos como texto simples sem símbolo.
 * Ex: 20050 -> "200,50"
 * @param {number} centavos - Valor em centavos
 * @returns {string} Valor formatado
 */
function formatNumber(centavos) {
    return centavosToReais(centavos || 0).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// ==================== DISTRIBUIÇÃO 50/30/20 ====================

/**
 * Calcula a distribuição sugerida do ganho diário.
 * Usa a regra 50/30/20 como orientação (não rígida).
 * 
 * @param {number} earnedCentavos - Valor ganho em centavos
 * @returns {object} Distribuição com valores em centavos
 */
function calculateDistribution(earnedCentavos) {
    const p = FINANCIAL_CONFIG.percentages;
    
    // Cálculo com inteiros para precisão
    const needs = Math.round(earnedCentavos * p.needs);
    const wants = Math.round(earnedCentavos * p.wants);
    const save = Math.round(earnedCentavos * p.save);
    
    // Garantir que a soma não ultrapasse o total
    // (pode haver diferença de 1-2 centavos por arredondamento)
    const diff = earnedCentavos - (needs + wants + save);
    
    return {
        total: earnedCentavos,
        needs,
        wants,
        save: save + diff, // Ajuste final para nunca ultrapassar o total
        needsPercent: p.needs,
        wantsPercent: p.wants,
        savePercent: p.save
    };
}

// ==================== PROJEÇÕES ====================

/**
 * Calcula projeções de quanto o usuário pode acumular.
 * Ex: guardando R$ 40/dia -> 7 dias = R$ 280, 30 dias = R$ 1.200...
 * 
 * @param {number} saveCentavos - Valor a guardar por dia em centavos
 * @returns {Array} Lista de projeções { days, value }
 */
function calculateProjections(saveCentavos) {
    return FINANCIAL_CONFIG.projections.map(days => ({
        days,
        value: saveCentavos * days
    }));
}

// ==================== ESTIMATIVA DE OBJETIVO ====================

/**
 * Calcula a estimativa de dias para alcançar o objetivo.
 * Baseado na média diária guardada recente.
 * 
 * @param {number} remainingCentavos - Valor que falta em centavos
 * @param {number} dailyAverageCentavos - Média guardada por dia em centavos
 * @returns {number} Estimativa de dias
 */
function estimateDaysToGoal(remainingCentavos, dailyAverageCentavos) {
    if (remainingCentavos <= 0) return 0;
    if (dailyAverageCentavos <= 0) return Infinity;
    
    return Math.ceil(remainingCentavos / dailyAverageCentavos);
}

/**
 * Formata a estimativa de dias de forma amigável.
 * Ex: 238 -> "aproximadamente 238 dias"
 * Ex: 35 -> "aproximadamente 1 mês"
 * Ex: 7 -> "aproximadamente 1 semana"
 * 
 * @param {number} days - Quantidade de dias
 * @returns {string} Texto formatado
 */
function formatEstimate(days) {
    if (days === Infinity) return 'Registre mais dias de ganho para calcular';
    if (days <= 0) return 'Objetivo alcançado!';
    
    if (days <= 7) {
        return `aproximadamente ${days} ${days === 1 ? 'dia' : 'dias'}`;
    }
    
    if (days < 30) {
        const weeks = Math.ceil(days / 7);
        return `aproximadamente ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
    }
    
    if (days < 365) {
        const months = Math.ceil(days / 30);
        return `aproximadamente ${months} ${months === 1 ? 'mês' : 'meses'}`;
    }
    
    const years = Math.ceil(days / 365);
    return `aproximadamente ${years} ${years === 1 ? 'ano' : 'anos'}`;
}

// ==================== MÉTRICAS DE EVOLUÇÃO ====================

/**
 * Calcula a média guardada por dia considerado apenas dias com registro.
 * O cálculo usará a média diária de quem guardou (exclui dias sem guardar).
 * 
 * @param {Array} records - Lista de registros
 * @returns {number} Média em centavos
 */
function calculateAverageSaved(records) {
    const withSavings = records.filter(r => (r.saved || 0) > 0);
    if (withSavings.length === 0) return 0;
    
    const total = withSavings.reduce((sum, r) => sum + (r.saved || 0), 0);
    return Math.round(total / withSavings.length);
}

/**
 * Calcula o progresso do objetivo em percentual.
 * 
 * @param {object} goal - Objetivo
 * @returns {number} Percentual (0-100)
 */
function calculateGoalProgress(goal) {
    if (!goal || goal.amount <= 0) return 0;
    return Math.min(100, Math.round((goal.saved / goal.amount) * 100));
}

/**
 * Verifica se o objetivo foi alcançado.
 * 
 * @param {object} goal - Objetivo
 * @returns {boolean} True se alcançado
 */
function isGoalReached(goal) {
    return goal && goal.amount > 0 && goal.saved >= goal.amount;
}

// Exportar funções globais
window.Calculations = {
    reaisToCentavos,
    centavosToReais,
    formatCurrency,
    formatNumber,
    calculateDistribution,
    calculateProjections,
    estimateDaysToGoal,
    formatEstimate,
    calculateAverageSaved,
    calculateGoalProgress,
    isGoalReached
};