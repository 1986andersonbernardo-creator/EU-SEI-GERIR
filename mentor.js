// ==================== SISTEMA DE MENTOR FINANCEIRO ====================

/**
 * Módulo de Educação Financeira Invisível
 * Transforma o app em um mentor que pensa pelo usuário
 */

const MENTOR_CONFIG = {
    reservePercentage: 0.20,
    minimumReserveDays: 30,
    healthScoreWeights: {
        reserve: 0.35,
        bills: 0.25,
        goals: 0.25,
        regularity: 0.15
    }
};

const FINANCIAL_TIPS = {
    reserve: [
        "🛡️ Você está construindo sua rede de segurança. Cada real guardado é um passo contra imprevistos.",
        "💚 A reserva é seu colchão financeiro. Em 6 meses, você terá mais tranquilidade.",
        "🎯 Guardar 20% é um hábito forte. Você está no caminho certo."
    ],
    spending: [
        "💡 Você tem R$ {amount} disponíveis para gastar hoje. Use com consciência.",
        "📊 Lembre-se: primeiro proteja o futuro, depois aproveite o presente.",
        "⭐ Você já garantiu sua reserva. Agora pode gastar o restante sem culpa."
    ],
    goals: [
        "🚀 Faltam R$ {remaining} para sua meta. Continue assim!",
        "💪 Você já está {percent}% mais perto do seu objetivo.",
        "🎉 Cada economia é uma vitória. Você vai chegar lá!"
    ],
    streak: [
        "🔥 Você está criando um hábito poderoso. Continue!",
        "⭐ Consistência é mais importante que valor. Você está arrasando!",
        "💪 Mais um dia, mais um passo rumo à independência financeira."
    ]
};

class FinancialMentor {
    constructor() {
        this.userData = {
            totalIncome: 0,
            totalExpenses: 0,
            totalSaved: 0,
            reserve: 0,
            bills: [],
            goals: [],
            history: []
        };
    }

    /**
     * Processa uma nova receita e retorna recomendações
     */
    processIncome(amount, description = '') {
        this.userData.totalIncome += amount;
        this.userData.history.push({
            type: 'income',
            amount,
            date: new Date(),
            description
        });

        const reserve = amount * MENTOR_CONFIG.reservePercentage;
        const available = amount - reserve;

        return {
            message: this.getWelcomeMessage(amount),
            recommendations: {
                reserve: {
                    amount: reserve,
                    percentage: 20,
                    reason: `Isso representa 20% da sua receita. Em um mês, você terá economizado R$ ${this.formatNumber(reserve * 30)}.`
                },
                bills: {
                    amount: available * 0.5,
                    reason: "Metade do restante para contas essenciais."
                },
                available: {
                    amount: available * 0.5,
                    reason: "Valor disponível para gastos pessoais sem culpa."
                }
            },
            tip: this.getRandomTip('reserve'),
            motivation: this.getMotivationMessage(amount)
        };
    }

    /**
     * Processa uma nova despesa e educa o usuário
     */
    processExpense(amount, category) {
        this.userData.totalExpenses += amount;

        const remaining = this.calculateAvailableBalance();
        
        return {
            message: this.getSpendingMessage(amount, category),
            remainingBalance: remaining,
            tip: remaining < 0 
                ? "⚠️ Atenção: você está gastando mais do que recebe. Vamos revisar seus gastos?"
                : this.getRandomTip('spending', { amount: remaining })
        };
    }

    /**
     * Calcula o Score de Saúde Financeira (0-100)
     */
    calculateHealthScore() {
        const { reserve, bills, goals, regularity } = this.userData;
        
        // 1. Pontuação de Reserva (0-35)
        const reserveScore = Math.min(35, (reserve / (this.userData.totalIncome * 3)) * 35);
        
        // 2. Pontuação de Contas (0-25)
        const billsScore = bills.length === 0 ? 25 : 
            Math.max(0, 25 - (bills.filter(b => b.overdue).length * 5));
        
        // 3. Pontuação de Metas (0-25)
        const goalsScore = goals.length === 0 ? 0 :
            goals.reduce((sum, goal) => sum + (goal.saved / goal.amount) * 25 / goals.length, 0);
        
        // 4. Pontuação de Regularidade (0-15)
        const regularityScore = this.calculateRegularityScore() * 15;
        
        return Math.round(reserveScore + billsScore + goalsScore + regularityScore);
    }

    /**
     * Retorna o status da saúde financeira
     */
    getHealthStatus(score) {
        if (score >= 80) return { level: 'Excelente', color: '#16A34A', emoji: '🟢' };
        if (score >= 60) return { level: 'Bom', color: '#22c55e', emoji: '🟡' };
        if (score >= 40) return { level: 'Regular', color: '#f59e0b', emoji: '🟠' };
        return { level: 'Atenção', color: '#dc2626', emoji: '🔴' };
    }

    /**
     * Gera recomendações personalizadas
     */
    getPersonalizedRecommendations() {
        const recommendations = [];
        const score = this.calculateHealthScore();
        
        // Análise de reserva
        if (this.userData.reserve < this.userData.totalIncome * 0.5) {
            recommendations.push({
                priority: 'high',
                icon: '🛡️',
                title: 'Construa sua reserva',
                description: `Você tem R$ ${this.formatNumber(this.userData.reserve)} guardados. O ideal é ter 3 meses de gastos.`,
                action: 'Guarde 20% da próxima receita'
            });
        } else {
            recommendations.push({
                priority: 'success',
                icon: '✅',
                title: 'Reserva saudável',
                description: `Parabéns! Você tem R$ ${this.formatNumber(this.userData.reserve)} guardados.`
            });
        }
        
        // Análise de gastos
        const expenseRatio = this.userData.totalExpenses / (this.userData.totalIncome || 1);
        if (expenseRatio > 0.8) {
            recommendations.push({
                priority: 'warning',
                icon: '⚠️',
                title: 'Gastos altos',
                description: `Você está gastando ${(expenseRatio * 100).toFixed(0)}% da sua renda. Tente reduzir para 70%.`,
                action: 'Revisar gastos não essenciais'
            });
        }
        
        // Análise de metas
        if (this.userData.goals.length === 0) {
            recommendations.push({
                priority: 'info',
                icon: '🎯',
                title: 'Crie sua primeira meta',
                description: 'Metas ajudam a manter o foco. Que tal começar com R$ 500 de reserva?',
                action: 'Criar meta'
            });
        }
        
        return recommendations;
    }

    /**
     * Cálculo de quanto o usuário pode gastar hoje
     */
    calculateDailyBudget() {
        const totalIncome = this.userData.totalIncome;
        const totalExpenses = this.userData.totalExpenses;
        const reserve = totalIncome * MENTOR_CONFIG.reservePercentage;
        const available = totalIncome - reserve - totalExpenses;
        
        const daysUntilNextIncome = this.estimateDaysUntilNextIncome();
        const dailyBudget = available / (daysUntilNextIncome || 30);
        
        return {
            daily: dailyBudget,
            weekly: dailyBudget * 7,
            monthly: dailyBudget * 30,
            reserve: reserve,
            available: available
        };
    }

    /**
     * Estimativa de dias até próxima receita
     */
    estimateDaysUntilNextIncome() {
        if (this.userData.history.length < 2) return 30;
        
        const incomes = this.userData.history
            .filter(h => h.type === 'income')
            .sort((a, b) => b.date - a.date);
        
        if (incomes.length < 2) return 30;
        
        const avgDays = this.calculateAverageGap(incomes);
        const lastIncome = new Date(incomes[0].date);
        const nextExpected = new Date(lastIncome.getTime() + avgDays * 24 * 60 * 60 * 1000);
        const today = new Date();
        
        return Math.max(0, Math.ceil((nextExpected - today) / (24 * 60 * 60 * 1000)));
    }

    calculateAverageGap(incomes) {
        if (incomes.length < 2) return 30;
        
        let totalGap = 0;
        for (let i = 0; i < incomes.length - 1; i++) {
            const gap = (new Date(incomes[i].date) - new Date(incomes[i + 1].date)) / (24 * 60 * 60 * 1000);
            totalGap += gap;
        }
        
        return totalGap / (incomes.length - 1);
    }

    calculateRegularityScore() {
        if (this.userData.history.length < 2) return 0;
        
        const incomes = this.userData.history.filter(h => h.type === 'income');
        if (incomes.length < 2) return 0;
        
        const avgGap = this.calculateAverageGap(incomes);
        const variance = this.calculateVariance(incomes, avgGap);
        
        // Menor variância = maior regularidade
        return Math.max(0, 1 - (variance / 30));
    }

    calculateVariance(incomes, avg) {
        let sumSquares = 0;
        for (let i = 0; i < incomes.length - 1; i++) {
            const gap = (new Date(incomes[i].date) - new Date(incomes[i + 1].date)) / (24 * 60 * 60 * 1000);
            sumSquares += Math.pow(gap - avg, 2);
        }
        return Math.sqrt(sumSquares / (incomes.length - 1));
    }

    // ==================== HELPERS ====================

    getWelcomeMessage(amount) {
        const hour = new Date().getHours();
        let greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
        
        return `${greeting}! Você recebeu R$ ${this.formatNumber(amount)}.`;
    }

    getSpendingMessage(amount, category) {
        const categories = {
            food: '🍽️',
            transport: '🚗',
            house: '🏠',
            health: '💊',
            leisure: '🎮',
            education: '📚',
            other: '📦'
        };
        
        const emoji = categories[category] || '💳';
        return `${emoji} Gasto registrado: R$ ${this.formatNumber(amount)}.`;
    }

    getMotivationMessage(amount) {
        if (amount >= 1000) {
            return "🚀 Parabéns! Sua dedicação está gerando frutos. Continue assim!";
        } else if (amount >= 500) {
            return "💪 Ótimo trabalho! Cada real conta para sua independência financeira.";
        } else if (amount >= 100) {
            return "⭐ Você está construindo um hábito forte. O futuro agradece!";
        }
        return "🌱 Mais um passo. A consistência é mais importante que o valor.";
    }

    getRandomTip(category, params = {}) {
        const tips = FINANCIAL_TIPS[category];
        if (!tips || tips.length === 0) return '';
        
        let tip = tips[Math.floor(Math.random() * tips.length)];
        
        // Replace placeholders
        tip = tip.replace('{amount}', this.formatNumber(params.amount || 0));
        tip = tip.replace('{remaining}', this.formatNumber(params.remaining || 0));
        tip = tip.replace('{percent}', params.percent || 0);
        
        return tip;
    }

    formatNumber(value) {
        return value.toFixed(2).replace('.', ',');
    }

    calculateAvailableBalance() {
        return this.userData.totalIncome - this.userData.totalExpenses - this.userData.reserve;
    }

    /**
     * Atualiza o card do mentor na interface
     */
    updateMentorCard() {
        const messageEl = document.getElementById('mentorMessage');
        const recommendationsEl = document.getElementById('mentorRecommendations');
        
        if (!messageEl || !recommendationsEl) return;
        
        // Se não houver receitas, mostrar mensagem padrão
        if (this.userData.totalIncome === 0) {
            messageEl.textContent = 'Olá! Vou te ajudar a organizar suas finanças. Quando você receber dinheiro, vou te mostrar a melhor forma de usar.';
            recommendationsEl.classList.add('hidden');
            return;
        }
        
        // Calcular recomendação de reserva
        const reserve = this.userData.totalIncome * MENTOR_CONFIG.reservePercentage;
        const available = this.calculateAvailableBalance();
        
        // Atualizar mensagem
        const hour = new Date().getHours();
        let greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
        messageEl.textContent = `${greeting}! Você recebeu R$ ${this.formatNumber(this.userData.totalIncome)}. Vamos juntos organizar isso.`;
        
        // Mostrar recomendações
        recommendationsEl.innerHTML = `
            <div class="recommendation-item">
                <div class="recommendation-icon">🛡️</div>
                <div class="recommendation-content">
                    <p class="recommendation-title">Reserva de Emergência</p>
                    <p class="recommendation-description">Guarde ${formatCurrency(reserve)} para sua segurança. Isso representa 20% da sua receita.</p>
                </div>
                <p class="recommendation-amount">${formatCurrency(reserve)}</p>
            </div>
            <div class="recommendation-item">
                <div class="recommendation-icon">💡</div>
                <div class="recommendation-content">
                    <p class="recommendation-title">Disponível para gastar</p>
                    <p class="recommendation-description">Você tem ${formatCurrency(available)} para gastar sem culpa. Lembre-se: primeiro proteja o futuro!</p>
                </div>
                <p class="recommendation-amount">${formatCurrency(available)}</p>
            </div>
        `;
        
        recommendationsEl.classList.remove('hidden');
    }

    /**
     * Processa uma despesa e retorna feedback educativo
     */
    processExpense(amount, category) {
        this.userData.totalExpenses += amount;
        
        const remaining = this.calculateAvailableBalance();
        
        if (remaining < 0) {
            return {
                type: 'warning',
                message: '⚠️ Atenção',
                detail: `Você está gastando mais do que recebe. Vamos revisar seus gastos?`
            };
        }
        
        return {
            type: 'success',
            message: '✅ Gasto registrado',
            detail: `Você ainda tem ${formatCurrency(remaining)} disponíveis. Continue controlando!`
        };
    }
}

// Exportar instância singleton
const financialMentor = new FinancialMentor();

/**
 * Inicializa o mentor com os dados do usuário
 * (chamado pelo app.js após carregar dados)
 */
function initMentorWithData() {
    if (!financialMentor) return;
    
    financialMentor.userData = {
        totalIncome: state.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0),
        totalExpenses: state.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0),
        totalSaved: state.goals.reduce((sum, g) => sum + (g.saved || 0), 0),
        reserve: 0,
        bills: state.bills,
        goals: state.goals,
        history: state.transactions.map(t => ({
            type: t.type,
            amount: t.amount,
            date: new Date(t.date)
        }))
    };
    
    // Atualizar card do mentor
    financialMentor.updateMentorCard();
}

// Exportar função para uso global
window.initMentorWithData = initMentorWithData;
