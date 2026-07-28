// ==================== CONFIGURAÇÕES DA MARCA ====================

const BRAND = {
    name: 'Eu Sei Gerir',
    tagline: 'Pequenas decisões hoje criam uma vida financeira melhor amanhã.',
    positioning: 'Mentor financeiro pessoal',
    colors: {
        primary: '#3B82F6',        // Azul moderno - confiança, evolução
        primaryDark: '#2563EB',    // Azul mais escuro
        primaryLight: '#DBEAFE',   // Azul claro
        success: '#10B981',        // Verde - crescimento, conquista
        successDark: '#059669',
        successLight: '#D1FAE5',
        warning: '#F59E0B',        // Amarelo - atenção
        error: '#EF4444',          // Vermelho - erro
        info: '#6366F1',           // Índigo - informação
        
        // Neutros
        textPrimary: '#1F2937',
        textSecondary: '#6B7280',
        textTertiary: '#9CA3AF',
        bgPrimary: '#FFFFFF',
        bgSecondary: '#F9FAFB',
        bgTertiary: '#F3F4F6',
        border: '#E5E7EB',
        borderLight: '#F3F4F6'
    },
    
    // Cores do tema escuro
    darkColors: {
        textPrimary: '#F9FAFB',
        textSecondary: '#9CA3AF',
        textTertiary: '#6B7280',
        bgPrimary: '#0F172A',
        bgSecondary: '#1E293B',
        bgTertiary: '#334155',
        border: '#374151',
        borderLight: '#1E293B'
    }
};

// ==================== CONFIGURAÇÕES DO MENTOR ====================

const MENTOR_CONFIG = {
    // Porcentagens padrão da divisão
    reservePercentage: 0.20,      // 20% para reserva
    billsPercentage: 0.40,        // 40% para contas
    availablePercentage: 0.40,    // 40% disponível para gastos
    
    // Limites e alertas
    minimumReserveMonths: 3,      // Meta: 3 meses de gastos guardados
    healthScoreWeights: {
        reserve: 0.35,
        bills: 0.25,
        goals: 0.25,
        regularity: 0.15
    },
    
    // Mensagens do mentor (tom humano e motivador)
    messages: {
        income: {
            congratulations: [
                "🎉 Parabéns pela conquista!",
                "⭐ Mais uma vitória!",
                "💪 Você está evoluindo!"
            ],
            main: [
                "Antes de gastar, vamos proteger seu futuro.",
                "Vamos organizar esse dinheiro juntos?",
                "Primeiro eu cuido de mim, depois eu gasto."
            ],
            reserve: {
                title: "💚 Guardar para você",
                reason: "Guardando {amount} hoje, você cria uma proteção para os dias em que o dinheiro não entrar."
            },
            bills: {
                title: "🏠 Contas importantes",
                reason: "Metade do restante para garantir que nada atrase."
            },
            available: {
                title: "🍽️ Você pode usar",
                reason: "O restante para gastar sem culpa. Você merece!"
            }
        },
        
        expense: {
            warning: "⚠️ Você está gastando mais do que recebe. Vamos revisar juntos?",
            success: "✅ Gasto registrado. Continue assim!",
            tip: "💡 Lembre-se: pequenas mudanças geram grandes resultados."
        },
        
        streak: [
            "🔥 Você está criando um hábito poderoso!",
            "⭐ Consistência é mais importante que valor.",
            "💪 Mais um dia rumo à independência financeira."
        ],
        
        goals: [
            "🚀 Você está {percent}% mais perto do seu objetivo!",
            "💪 Faltam R$ {remaining} para conquistar seu sonho.",
            "🎯 Continue assim, você vai chegar lá!"
        ],
        
        achievements: {
            firstIncome: {
                title: "Primeiro Passo",
                description: "Registrou sua primeira receita!",
                icon: "👣"
            },
            firstReserve: {
                title: "Construtor de Segurança",
                description: "Criou sua primeira reserva de R$ 500",
                icon: "🛡️"
            },
            discipline: {
                title: "Disciplina",
                description: "Guardou dinheiro por 30 dias consecutivos",
                icon: "🔥"
            },
            goalAchieved: {
                title: "Sonhador",
                description: "Alcançou sua primeira meta",
                icon: "⭐"
            },
            healthImprovement: {
                title: "Evolução",
                description: "Melhorou seu Score de Saúde Financeira",
                icon: "📈"
            }
        }
    },
    
    // Dicas financeiras contextualizadas
    tips: {
        reserve: [
            "🛡️ Você está construindo sua rede de segurança. Cada real guardado é um passo contra imprevistos.",
            "💚 A reserva é seu colchão financeiro. Em 6 meses, você terá mais tranquilidade.",
            "🎯 Guardar 20% é um hábito forte. Você está no caminho certo."
        ],
        spending: [
            "💡 Você tem R$ {amount} disponíveis. Use com consciência.",
            "📊 Lembre-se: primeiro proteja o futuro, depois aproveite o presente.",
            "⭐ Você já garantiu sua reserva. Agora pode gastar o restante sem culpa."
        ],
        goals: [
            "🚀 Continue assim, cada economia é uma vitória!",
            "💪 Você está no caminho certo. Continue focado!",
            "🎉 Seus sonhos estão mais perto do que imagina."
        ]
    }
};

// ==================== CONQUISTAS (GAMIFICAÇÃO) ====================

const ACHIEVEMENTS = {
    FIRST_INCOME: {
        id: 'first_income',
        ...MENTOR_CONFIG.messages.achievements.firstIncome,
        condition: (state) => state.transactions.filter(t => t.type === 'income').length >= 1
    },
    FIRST_RESERVE_500: {
        id: 'first_reserve_500',
        ...MENTOR_CONFIG.messages.achievements.firstReserve,
        condition: (state) => {
            const totalSaved = state.goals.reduce((sum, g) => sum + (g.saved || 0), 0);
            return totalSaved >= 500;
        }
    },
    DISCIPLINE_30_DAYS: {
        id: 'discipline_30_days',
        ...MENTOR_CONFIG.messages.achievements.discipline,
        condition: (state) => calculateStreakDays(state) >= 30
    },
    FIRST_GOAL: {
        id: 'first_goal',
        ...MENTOR_CONFIG.messages.achievements.goalAchieved,
        condition: (state) => state.goals.some(g => g.amount <= g.saved)
    },
    HEALTH_IMPROVEMENT: {
        id: 'health_improvement',
        ...MENTOR_CONFIG.messages.achievements.healthImprovement,
        condition: (state) => calculateHealthScore(state) >= 70
    }
};

// ==================== FUNÇÕES UTILITÁRIAS ====================

function calculateStreakDays(state) {
    // Lógica simplificada: conta dias únicos com receitas
    const incomeDates = new Set(
        state.transactions
            .filter(t => t.type === 'income')
            .map(t => t.date)
    );
    return incomeDates.size;
}

function calculateHealthScore(state) {
    // Implementação simplificada do score
    let score = 0;
    
    // 1. Reserva (35 pontos)
    const totalSaved = state.goals.reduce((sum, g) => sum + (g.saved || 0), 0);
    const reserveScore = Math.min(35, (totalSaved / 1000) * 35);
    score += reserveScore;
    
    // 2. Contas em dia (25 pontos)
    const overdueBills = state.bills.filter(b => {
        const daysUntilDue = getDaysUntilDue(b.dueDate);
        return daysUntilDue < 0 && !b.paid;
    }).length;
    const billsScore = state.bills.length === 0 ? 25 : Math.max(0, 25 - (overdueBills * 5));
    score += billsScore;
    
    // 3. Metas (25 pontos)
    const goalsScore = state.goals.length === 0 ? 0 :
        state.goals.reduce((sum, goal) => sum + (goal.saved / goal.amount) * 25 / state.goals.length, 0);
    score += goalsScore;
    
    // 4. Regularidade (15 pontos)
    const regularityScore = Math.min(15, calculateStreakDays(state) / 2);
    score += regularityScore;
    
    return Math.round(score);
}

function getHealthStatus(score) {
    if (score >= 80) return { level: 'Excelente', emoji: '🟢', color: BRAND.colors.success };
    if (score >= 60) return { level: 'Bom', emoji: '🟡', color: '#F59E0B' };
    if (score >= 40) return { level: 'Regular', emoji: '🟠', color: '#F97316' };
    return { level: 'Atenção', emoji: '🔴', color: BRAND.colors.error };
}

function getDaysUntilDue(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// ==================== TEXTO AMIGÁVEL ====================

function getCategoryEmoji(category) {
    const emojis = {
        // Receitas
        uber: '🚗',
        '99': '🚖',
        freelance: '💼',
        service: '🛠️',
        sale: '🏪',
        salary: '💰',
        pix: '📱',
        transfer: '🏦',
        
        // Despesas
        house: '🏠',
        fuel: '⛽',
        market: '🛒',
        food: '🍽️',
        health: '💊',
        college: '📚',
        leisure: '🎮',
        internet: '🌐',
        tools: '🔧',
        taxes: '📋',
        phone: '📞',
        installments: '💳'
    };
    return emojis[category] || '📦';
}

function getCategoryLabel(category) {
    const labels = {
        uber: 'Uber',
        '99': '99',
        freelance: 'Freelance',
        service: 'Serviço',
        sale: 'Venda',
        salary: 'Salário',
        pix: 'PIX',
        transfer: 'Transferência',
        house: 'Casa',
        fuel: 'Combustível',
        market: 'Mercado',
        food: 'Alimentação',
        health: 'Saúde',
        college: 'Faculdade',
        leisure: 'Lazer',
        internet: 'Internet',
        tools: 'Ferramentas',
        taxes: 'Impostos',
        phone: 'Telefone',
        installments: 'Parcelas',
        other: 'Outros'
    };
    return labels[category] || category;
}

// Salvar no localStorage
function saveAchievement(achievementId) {
    const unlocked = JSON.parse(localStorage.getItem(`${APP_KEY}_achievements`) || '[]');
    if (!unlocked.includes(achievementId)) {
        unlocked.push(achievementId);
        localStorage.setItem(`${APP_KEY}_achievements`, JSON.stringify(unlocked));
        return true; // Nova conquista
    }
    return false; // Já tinha
}

function getUnlockedAchievements() {
    return JSON.parse(localStorage.getItem(`${APP_KEY}_achievements`) || '[]');
}

// Exportar configurações globais
window.BRAND = BRAND;
window.MENTOR_CONFIG = MENTOR_CONFIG;
window.ACHIEVEMENTS = ACHIEVEMENTS;
window.calculateHealthScore = calculateHealthScore;
window.getHealthStatus = getHealthStatus;
window.saveAchievement = saveAchievement;
window.getUnlockedAchievements = getUnlockedAchievements;
window.getCategoryEmoji = getCategoryEmoji;
window.getCategoryLabel = getCategoryLabel;