// ==================== CONFIGURAÇÕES DO APLICATIVO ====================
const APP_CONFIG = {
    name: 'Eu Sei Gerir',
    version: '1.0.0',
    url: 'https://eseigerir.app',
    shareMessage: `💰 Estou organizando minha vida financeira usando o Eu Sei Gerir.

Ele ajuda a controlar receitas, despesas, metas financeiras e organizar o dinheiro de forma simples.

Baixe gratuitamente:`,
    icon: 'fa-share-nodes'
};

const APP_KEY = 'euSeiGerir';
const OLD_KEY = 'calculadoraGanhos';

// ==================== ESTADO GLOBAL ====================
let state = {
    transactions: [],
    goals: [],
    wallets: [],
    bills: [],
    settings: {
        theme: localStorage.getItem('theme') || 'light',
        emergencyGoal: 0,
        investmentGoal: 0,
        purchaseGoal: 0
    },
    currentFilter: {
        transactions: 'all',
        history: { period: 'all', type: 'all' }
    }
};

// ==================== SPLASH SCREEN ====================
function initSplashScreen() {
    const splashScreen = document.getElementById('splashScreen');
    const startButton = document.getElementById('startButton');
    
    if (!splashScreen || !startButton) return;
    
    // Verificar se é primeira vez
    const hasSeenSplash = localStorage.getItem('hasSeenSplash');
    
    if (hasSeenSplash) {
        splashScreen.classList.add('hidden');
        return;
    }
    
    startButton.addEventListener('click', () => {
        splashScreen.style.opacity = '0';
        splashScreen.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            localStorage.setItem('hasSeenSplash', 'true');
        }, 300);
    });
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    migrateOldData();
    loadData();
    initTheme();
    initSplashScreen();
    setupNavigation();
    setupEventListeners();
    updateHomeScreen();
    updateWelcomeText();
});

// ==================== MIGRAÇÃO DE DADOS ANTIGOS ====================
function migrateOldData() {
    try {
        const history = JSON.parse(localStorage.getItem(`${OLD_KEY}_history`) || '[]');
        const goals = JSON.parse(localStorage.getItem(`${OLD_KEY}_personalGoals`) || '[]');
        const settings = JSON.parse(localStorage.getItem(`${OLD_KEY}_goals`) || '{}');
        
        if (history.length > 0 || goals.length > 0) {
            // Converter histórico antigo para transações
            const transactions = history.map(item => ({
                id: item.id,
                type: 'income',
                amount: item.amount,
                category: 'other',
                description: item.description || 'Ganho',
                date: item.date,
                wallet: 'main',
                createdAt: new Date().toISOString()
            }));
            
            state.transactions = transactions;
            state.goals = goals.map(g => ({
                id: g.id,
                name: g.name,
                amount: g.amount,
                saved: g.saved || 0,
                date: g.date,
                icon: '💰',
                createdAt: g.createdAt
            }));
            
            if (settings.emergency) state.settings.emergencyGoal = settings.emergency;
            if (settings.investment) state.settings.investmentGoal = settings.investment;
            if (settings.purchase) state.settings.purchaseGoal = settings.purchase;
            
            saveData();
            clearOldData();
            showToast('Dados migrados com sucesso!');
        }
    } catch (e) {
        console.error('Erro na migração:', e);
    }
}

function clearOldData() {
    localStorage.removeItem(`${OLD_KEY}_history`);
    localStorage.removeItem(`${OLD_KEY}_personalGoals`);
    localStorage.removeItem(`${OLD_KEY}_goals`);
}

// ==================== PERSISTÊNCIA DE DADOS ====================
function saveData() {
    localStorage.setItem(`${APP_KEY}_transactions`, JSON.stringify(state.transactions));
    localStorage.setItem(`${APP_KEY}_goals`, JSON.stringify(state.goals));
    localStorage.setItem(`${APP_KEY}_wallets`, JSON.stringify(state.wallets));
    localStorage.setItem(`${APP_KEY}_bills`, JSON.stringify(state.bills));
    localStorage.setItem(`${APP_KEY}_settings`, JSON.stringify(state.settings));
}

function loadData() {
    try {
        state.transactions = JSON.parse(localStorage.getItem(`${APP_KEY}_transactions`) || '[]');
        state.goals = JSON.parse(localStorage.getItem(`${APP_KEY}_goals`) || '[]');
        state.wallets = JSON.parse(localStorage.getItem(`${APP_KEY}_wallets`) || '[]');
        state.bills = JSON.parse(localStorage.getItem(`${APP_KEY}_bills`) || '[]');
        state.settings = { ...state.settings, ...JSON.parse(localStorage.getItem(`${APP_KEY}_settings`) || '{}') };
        
        // Criar carteira padrão se não existir
        if (state.wallets.length === 0) {
            state.wallets = [{ id: 'main', name: 'Principal', icon: '💰', balance: 0 }];
            saveData();
        }
    } catch (e) {
        console.error('Erro ao carregar dados:', e);
    }
}

// ==================== TEMA ====================
function initTheme() {
    document.documentElement.setAttribute('data-theme', state.settings.theme);
    updateThemeIcon();
}

function toggleTheme() {
    state.settings.theme = state.settings.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.settings.theme);
    updateThemeIcon();
    saveData();
}

function updateThemeIcon() {
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = state.settings.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// ==================== NAVEGAÇÃO ====================
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const screenId = item.dataset.screen;
            navigateTo(screenId);
        });
    });
    
    // Navegação para carteiras e contas (no topo direito)
    const walletNavBtn = document.querySelector('[data-screen="walletsScreen"]');
    const billNavBtn = document.querySelector('[data-screen="billsScreen"]');
    
    // Adicionar botões no header (se existirem)
}

function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        window.scrollTo(0, 0);
        
        // Atualizar navegação ativa
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.screen === screenId);
        });
        
        // Atualizar conteúdo da tela
        switch(screenId) {
            case 'homeScreen':
                updateHomeScreen();
                break;
            case 'transactionsScreen':
                updateTransactionsList();
                break;
            case 'goalsScreen':
                updateGoalsList();
                break;
            case 'historyScreen':
                updateHistoryList();
                break;
            case 'healthScreen':
                updateHealthScreen();
                break;
            case 'achievementsScreen':
                updateAchievementsScreen();
                break;
        }
    }
}

// ==================== BOAS-VINDAS ====================
function updateWelcomeText() {
    const hour = new Date().getHours();
    let greeting = 'Boa noite!';
    
    if (hour >= 5 && hour < 12) greeting = 'Bom dia!';
    else if (hour >= 12 && hour < 18) greeting = 'Boa tarde!';
    
    const welcomeText = document.getElementById('welcomeText');
    if (welcomeText) {
        welcomeText.textContent = greeting;
    }
}

// ==================== DASHBOARD HOME ====================
function updateHomeScreen() {
    const monthlyData = calculateMonthlyData();
    
    // Atualizar cards de estatísticas
    setValue('monthIncome', formatCurrency(monthlyData.income));
    setValue('monthExpenses', formatCurrency(monthlyData.expense));
    setValue('monthProfit', formatCurrency(monthlyData.income - monthlyData.expense));
    setValue('monthSavings', formatCurrency(monthlyData.savings));
    
    // Atualizar patrimônio total
    const totalWealth = calculateTotalWealth();
    setValue('totalWealth', formatCurrency(totalWealth));
    setValue('availableBalance', formatCurrency(totalWealth - calculateTotalBills()));
    
    // Atualizar meta principal
    updatePrimaryGoal();
    
    // Atualizar contas próximas
    updateBillsSummary();
    
    // Atualizar últimos lançamentos
    updateRecentTransactions();
    
    // Atualizar gráfico
    updateFinanceChart();
}

function calculateMonthlyData() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let income = 0;
    let expense = 0;
    let savings = 0;
    
    state.transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        if (transactionDate.getMonth() === currentMonth && 
            transactionDate.getFullYear() === currentYear) {
            if (transaction.type === 'income') {
                income += transaction.amount;
            } else {
                expense += transaction.amount;
            }
        }
    });
    
    // Calcular economia baseada nas metas
    state.goals.forEach(goal => {
        savings += goal.saved || 0;
    });
    
    return { income, expense, savings };
}

function calculateTotalWealth() {
    let total = 0;
    
    state.transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            total += transaction.amount;
        } else {
            total -= transaction.amount;
        }
    });
    
    return total;
}

function calculateTotalBills() {
    return state.bills.reduce((sum, bill) => sum + (bill.amount || 0), 0);
}

function updatePrimaryGoal() {
    const primaryGoalContent = document.getElementById('primaryGoalContent');
    if (!primaryGoalContent) return;
    
    if (state.goals.length === 0) {
        primaryGoalContent.innerHTML = '<p class="no-goal-message">Nenhuma meta definida. Crie sua primeira meta!</p>';
        return;
    }
    
    // Pegar a meta com maior valor ou mais próxima de ser concluída
    const primaryGoal = state.goals.reduce((best, goal) => {
        const progress = goal.saved / goal.amount;
        const bestProgress = best.saved / best.amount;
        return progress > bestProgress ? goal : best;
    }, state.goals[0]);
    
    const progress = (primaryGoal.saved / primaryGoal.amount) * 100;
    const remaining = primaryGoal.amount - primaryGoal.saved;
    
    primaryGoalContent.innerHTML = `
        <div class="primary-goal-info">
            <div class="primary-goal-header">
                <span class="primary-goal-icon">${primaryGoal.icon || '🎯'}</span>
                <h3>${primaryGoal.name}</h3>
            </div>
            <div class="primary-goal-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                </div>
                <div class="progress-info">
                    <span>${formatCurrency(primaryGoal.saved)} / ${formatCurrency(primaryGoal.amount)}</span>
                    <span>${progress.toFixed(1)}%</span>
                </div>
            </div>
            <p class="primary-goal-remaining">Faltam: ${formatCurrency(remaining)}</p>
        </div>
    `;
}

function updateBillsSummary() {
    const billsContent = document.getElementById('billsContent');
    if (!billsContent) return;
    
    if (state.bills.length === 0) {
        billsContent.innerHTML = '<p class="no-bills-message">Nenhuma conta cadastrada</p>';
        return;
    }
    
    // Mostrar próximas 3 contas
    const upcomingBills = state.bills
        .map(bill => ({
            ...bill,
            daysUntilDue: getDaysUntilDue(bill.dueDate)
        }))
        .sort((a, b) => a.daysUntilDue - b.daysUntilDue)
        .slice(0, 3);
    
    billsContent.innerHTML = upcomingBills.map(bill => {
        const statusClass = bill.daysUntilDue < 0 ? 'overdue' : 
                           bill.daysUntilDue <= 7 ? 'pending' : 'upcoming';
        return `
            <div class="bill-item-summary">
                <div class="bill-summary-info">
                    <h4>${bill.name}</h4>
                    <p>Vence em ${Math.abs(bill.daysUntilDue)} dias</p>
                </div>
                <span class="bill-summary-amount ${statusClass}">
                    ${formatCurrency(bill.amount)}
                </span>
            </div>
        `;
    }).join('');
}

function getDaysUntilDue(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// ==================== TRANSAÇÕES (RECEITAS E DESPESAS) ====================
function openIncomeModal() {
    document.getElementById('incomeModal').classList.remove('hidden');
    setDefaultDate('incomeDate');
    updateWalletSelects('incomeWallet');
}

function openExpenseModal() {
    document.getElementById('expenseModal').classList.remove('hidden');
    setDefaultDate('expenseDate');
    updateWalletSelects('expenseWallet');
}

function updateWalletSelects(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    select.innerHTML = state.wallets.map(wallet => 
        `<option value="${wallet.id}">${wallet.name}</option>`
    ).join('');
}

function saveIncome() {
    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const category = document.getElementById('incomeCategory').value;
    const wallet = document.getElementById('incomeWallet').value;
    const description = document.getElementById('incomeDescription').value;
    const date = document.getElementById('incomeDate').value;
    
    if (!amount || amount <= 0) {
        showToast('Insira um valor válido!', 'error');
        return;
    }
    
    const transaction = {
        id: Date.now(),
        type: 'income',
        amount,
        category,
        wallet,
        description: description || getCategoryLabel(category),
        date,
        createdAt: new Date().toISOString()
    };
    
    state.transactions.unshift(transaction);
    updateWalletBalance(wallet, amount);
    saveData();
    closeModal('incomeModal');
    
    // Ativar o mentor para educar o usuário
    const mentorAdvice = getMentorAdvice(amount);
    showMentorAdvice(mentorAdvice);
    
    updateHomeScreen();
}

function saveExpense() {
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;
    const wallet = document.getElementById('expenseWallet').value;
    const description = document.getElementById('expenseDescription').value;
    const date = document.getElementById('expenseDate').value;
    
    if (!amount || amount <= 0) {
        showToast('Insira um valor válido!', 'error');
        return;
    }
    
    const transaction = {
        id: Date.now(),
        type: 'expense',
        amount,
        category,
        wallet,
        description: description || getCategoryLabel(category),
        date,
        createdAt: new Date().toISOString()
    };
    
    state.transactions.unshift(transaction);
    updateWalletBalance(wallet, -amount);
    saveData();
    closeModal('expenseModal');
    
    // Verificar se o gasto está adequado
    const remaining = calculateAvailableBalance();
    if (remaining < 0) {
        showToast('Atenção: você está gastando mais do que recebe!', 'error');
    } else {
        showToast('Despesa registrada!');
    }
    
    updateHomeScreen();
}

function updateWalletBalance(walletId, amount) {
    const wallet = state.wallets.find(w => w.id === walletId);
    if (wallet) {
        wallet.balance = (wallet.balance || 0) + amount;
    }
}

function updateTransactionsList() {
    const transactionsList = document.getElementById('transactionsList');
    if (!transactionsList) return;
    
    let transactions = [...state.transactions];
    
    // Aplicar filtro
    if (state.currentFilter.transactions !== 'all') {
        transactions = transactions.filter(t => t.type === state.currentFilter.transactions);
    }
    
    if (transactions.length === 0) {
        transactionsList.innerHTML = '<p class="empty-message">Nenhum lançamento encontrado</p>';
        return;
    }
    
    transactionsList.innerHTML = transactions.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-header">
                <div class="transaction-icon ${transaction.type}">
                    <i class="fas ${transaction.type === 'income' ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
                </div>
                <span class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'} ${formatCurrency(transaction.amount)}
                </span>
            </div>
            <div class="transaction-details">
                <div class="transaction-detail">
                    <span class="transaction-detail-label">Categoria</span>
                    <span class="transaction-detail-value">${getCategoryLabel(transaction.category)}</span>
                </div>
                <div class="transaction-detail">
                    <span class="transaction-detail-label">Data</span>
                    <span class="transaction-detail-value">${formatDate(transaction.date)}</span>
                </div>
                <div class="transaction-detail">
                    <span class="transaction-detail-label">Descrição</span>
                    <span class="transaction-detail-value">${transaction.description}</span>
                </div>
            </div>
            <div class="transaction-actions">
                <button class="btn-goal edit" onclick="editTransaction(${transaction.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-goal delete" onclick="deleteTransaction(${transaction.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `).join('');
}

// ==================== CARTEIRAS ====================
function saveWallet() {
    const name = document.getElementById('walletName').value.trim();
    const icon = document.getElementById('walletIcon').value;
    
    if (!name) {
        showToast('Insira um nome para a carteira!', 'error');
        return;
    }
    
    const wallet = {
        id: 'wallet_' + Date.now(),
        name,
        icon,
        balance: 0
    };
    
    state.wallets.push(wallet);
    saveData();
    closeModal('walletModal');
    showToast('Carteira criada!');
    updateWalletsList();
}

function updateWalletsList() {
    const walletsList = document.getElementById('walletsList');
    if (!walletsList) return;
    
    if (state.wallets.length === 0) {
        walletsList.innerHTML = '<p class="empty-message">Nenhuma carteira cadastrada</p>';
        return;
    }
    
    walletsList.innerHTML = state.wallets.map(wallet => `
        <div class="wallet-card">
            <span class="wallet-icon">${wallet.icon}</span>
            <h3 class="wallet-name">${wallet.name}</h3>
            <p class="wallet-balance">${formatCurrency(wallet.balance || 0)}</p>
        </div>
    `).join('');
}

// ==================== CONTAS ====================
function saveBill() {
    const name = document.getElementById('billName').value.trim();
    const amount = parseFloat(document.getElementById('billAmount').value);
    const dueDate = document.getElementById('billDueDate').value;
    const recurrence = document.getElementById('billRecurrence').value;
    
    if (!name || !amount || !dueDate) {
        showToast('Preencha todos os campos!', 'error');
        return;
    }
    
    const bill = {
        id: Date.now(),
        name,
        amount,
        dueDate,
        recurrence,
        status: 'pending',
        paid: false
    };
    
    state.bills.push(bill);
    saveData();
    closeModal('billModal');
    showToast('Conta cadastrada!');
    updateBillsList();
}

function updateBillsList() {
    const billsList = document.getElementById('billsList');
    if (!billsList) return;
    
    if (state.bills.length === 0) {
        billsList.innerHTML = '<p class="empty-message">Nenhuma conta cadastrada</p>';
        return;
    }
    
    billsList.innerHTML = state.bills.map(bill => {
        const daysUntilDue = getDaysUntilDue(bill.dueDate);
        let status = 'Pendente';
        let statusClass = 'pending';
        
        if (bill.paid) {
            status = 'Paga';
            statusClass = 'paid';
        } else if (daysUntilDue < 0) {
            status = 'Atrasada';
            statusClass = 'overdue';
        }
        
        return `
            <div class="bill-item">
                <div class="bill-info">
                    <h3 class="bill-name">${bill.name}</h3>
                    <div class="bill-details">
                        <span>Vencimento: ${formatDate(bill.dueDate)}</span>
                        <span>${getRecurrenceLabel(bill.recurrence)}</span>
                        <span class="bill-status ${statusClass}">${status}</span>
                    </div>
                </div>
                <span class="bill-amount">${formatCurrency(bill.amount)}</span>
            </div>
        `;
    }).join('');
}

// ==================== METAS ====================
function saveGoal() {
    const name = document.getElementById('goalName').value.trim();
    const amount = parseFloat(document.getElementById('goalAmount').value);
    const date = document.getElementById('goalDate').value;
    const icon = document.getElementById('goalIcon').value;
    
    if (!name || !amount) {
        showToast('Preencha todos os campos!', 'error');
        return;
    }
    
    const goal = {
        id: Date.now(),
        name,
        amount,
        saved: 0,
        date,
        icon,
        createdAt: new Date().toISOString()
    };
    
    state.goals.push(goal);
    saveData();
    closeModal('goalModal');
    showToast('Meta criada!');
    updateGoalsList();
    updateHomeScreen();
}

function addSavingsToGoal(goalId) {
    const amount = prompt('Quanto deseja adicionar? (R$)');
    if (!amount || isNaN(parseFloat(amount))) return;
    
    const goal = state.goals.find(g => g.id === goalId);
    if (goal) {
        goal.saved += parseFloat(amount);
        saveData();
        updateGoalsList();
        updateHomeScreen();
        showToast(`${formatCurrency(parseFloat(amount))} adicionado!`);
    }
}

function deleteGoal(goalId) {
    if (!confirm('Excluir esta meta?')) return;
    state.goals = state.goals.filter(g => g.id !== goalId);
    saveData();
    updateGoalsList();
    updateHomeScreen();
    showToast('Meta excluída!');
}

function updateGoalsList() {
    const goalsList = document.getElementById('goalsList');
    if (!goalsList) return;
    
    if (state.goals.length === 0) {
        goalsList.innerHTML = '<p class="empty-message">Nenhuma meta cadastrada. Crie sua primeira meta!</p>';
        return;
    }
    
    goalsList.innerHTML = state.goals.map(goal => {
        const progress = (goal.saved / goal.amount) * 100;
        const remaining = goal.amount - goal.saved;
        
        return `
            <div class="goal-item">
                <div class="goal-header">
                    <div class="goal-title">
                        <h3><span class="goal-icon">${goal.icon || '🎯'}</span> ${goal.name}</h3>
                    </div>
                </div>
                <div class="goal-info">
                    <div class="goal-info-item">
                        <label>Meta</label>
                        <p>${formatCurrency(goal.amount)}</p>
                    </div>
                    <div class="goal-info-item">
                        <label>Economizado</label>
                        <p>${formatCurrency(goal.saved)}</p>
                    </div>
                    <div class="goal-info-item">
                        <label>Faltam</label>
                        <p>${formatCurrency(remaining)}</p>
                    </div>
                    <div class="goal-info-item">
                        <label>Progresso</label>
                        <p>${progress.toFixed(1)}%</p>
                    </div>
                </div>
                <div class="goal-progress">
                    <div class="goal-progress-bar">
                        <div class="goal-progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                    </div>
                </div>
                <div class="goal-actions-row">
                    <button class="btn-goal add-savings" onclick="addSavingsToGoal(${goal.id})">
                        <i class="fas fa-plus"></i> Economizar
                    </button>
                    <button class="btn-goal delete" onclick="deleteGoal(${goal.id})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Atualizar dashboard
    updateGoalsDashboard();
}

function updateGoalsDashboard() {
    const total = state.goals.length;
    const completed = state.goals.filter(g => g.amount <= g.saved).length;
    const totalSaved = state.goals.reduce((sum, g) => sum + g.saved, 0);
    
    setValue('activeGoalsCount', total);
    setValue('completedGoals', completed);
    setValue('totalGoalsSaved', formatCurrency(totalSaved));
    
    // Calcular próxima meta
    const activeGoals = state.goals.filter(g => g.amount > g.saved);
    if (activeGoals.length > 0) {
        const nearest = activeGoals.reduce((nearest, goal) => {
            const daysNeeded = calculateDaysToComplete(goal);
            return !nearest || daysNeeded < nearest.days ? { goal, days: daysNeeded } : nearest;
        }, null);
        
        if (nearest) {
            setValue('nextGoalTime', `${nearest.days}d`);
        }
    } else {
        setValue('nextGoalTime', '-');
    }
}

function calculateDaysToComplete(goal) {
    const remaining = goal.amount - goal.saved;
    // Estimativa baseada em média de economia mensal (simplificado)
    const monthlySavings = state.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0) * 0.2; // 20% de economia
    
    if (monthlySavings === 0) return 999;
    return Math.ceil(remaining / monthlySavings * 30);
}

// ==================== HISTÓRICO ====================
function updateHistoryList() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    let transactions = [...state.transactions];
    const { period, type } = state.currentFilter.history;
    
    // Filtro por período
    if (period !== 'all') {
        transactions = filterByPeriod(transactions, period);
    }
    
    // Filtro por tipo
    if (type !== 'all') {
        if (type === 'goal') {
            transactions = [];
        } else {
            transactions = transactions.filter(t => t.type === type);
        }
    }
    
    if (transactions.length === 0) {
        historyList.innerHTML = '<p class="empty-message">Nenhum lançamento encontrado</p>';
        return;
    }
    
    historyList.innerHTML = transactions.map(transaction => `
        <div class="history-item">
            <div class="history-info">
                <h4>${formatDate(transaction.date)} - ${getCategoryLabel(transaction.category)}</h4>
                <p><strong>Valor:</strong> ${formatCurrency(transaction.amount)}</p>
                <p><strong>Tipo:</strong> ${transaction.type === 'income' ? 'Receita' : 'Despesa'}</p>
                <p><strong>Descrição:</strong> ${transaction.description}</p>
            </div>
            <div class="history-actions">
                <button class="btn-icon" onclick="editTransaction(${transaction.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon danger" onclick="deleteTransaction(${transaction.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function filterByPeriod(transactions, period) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const diffTime = today - transactionDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        switch(period) {
            case 'today':
                return diffDays === 0;
            case 'week':
                return diffDays >= 0 && diffDays <= 7;
            case 'month':
                return transactionDate.getMonth() === now.getMonth() && 
                       transactionDate.getFullYear() === now.getFullYear();
            case 'year':
                return transactionDate.getFullYear() === now.getFullYear();
            default:
                return true;
        }
    });
}

window.editTransaction = function(id) {
    const transaction = state.transactions.find(t => t.id === id);
    if (!transaction) return;
    
    const newAmount = prompt('Novo valor:', transaction.amount);
    if (!newAmount || isNaN(parseFloat(newAmount))) return;
    
    transaction.amount = parseFloat(newAmount);
    saveData();
    updateHistoryList();
    updateHomeScreen();
    showToast('Transação atualizada!');
};

window.deleteTransaction = function(id) {
    if (!confirm('Excluir esta transação?')) return;
    const transaction = state.transactions.find(t => t.id === id);
    state.transactions = state.transactions.filter(t => t.id !== id);
    saveData();
    updateHistoryList();
    updateHomeScreen();
    
    // Recompensar se estiver criando hábito
    if (transaction && transaction.type === 'income') {
        showToast('Transação excluída. Continue organizando suas finanças!');
    }
};

function clearHistory() {
    if (!confirm('Limpar todo o histórico? Esta ação não pode ser desfeita.')) return;
    state.transactions = [];
    saveData();
    updateHistoryList();
    updateHomeScreen();
    showToast('Histórico limpo!');
}

// ==================== FERRAMENTAS ====================
function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Modals
    document.getElementById('saveIncomeBtn')?.addEventListener('click', saveIncome);
    document.getElementById('cancelIncomeBtn')?.addEventListener('click', () => closeModal('incomeModal'));
    document.getElementById('saveExpenseBtn')?.addEventListener('click', saveExpense);
    document.getElementById('cancelExpenseBtn')?.addEventListener('click', () => closeModal('expenseModal'));
    document.getElementById('saveGoalBtn')?.addEventListener('click', saveGoal);
    document.getElementById('cancelGoalBtn')?.addEventListener('click', () => closeModal('goalModal'));
    document.getElementById('saveBillBtn')?.addEventListener('click', saveBill);
    document.getElementById('cancelBillBtn')?.addEventListener('click', () => closeModal('billModal'));
    document.getElementById('saveWalletBtn')?.addEventListener('click', saveWallet);
    document.getElementById('cancelWalletBtn')?.addEventListener('click', () => closeModal('walletModal'));
    
    // Modais de carteira e conta (abrir)
    document.getElementById('addWalletBtn')?.addEventListener('click', () => {
        document.getElementById('walletModal').classList.remove('hidden');
    });
    
    document.getElementById('addBillBtn')?.addEventListener('click', () => {
        document.getElementById('billModal').classList.remove('hidden');
        setDefaultDate('billDueDate');
    });
    
    // Filtros
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            state.currentFilter.transactions = tab.dataset.filter;
            updateTransactionsList();
        });
    });
    
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentFilter.history.period = btn.dataset.period;
            updateHistoryList();
        });
    });
    
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentFilter.history.type = btn.dataset.type;
            updateHistoryList();
        });
    });
    
    // Clear history
    document.getElementById('clearHistoryBtn')?.addEventListener('click', clearHistory);
    
    // Calculadora de divisão
    document.getElementById('calculateToolBtn')?.addEventListener('click', calculateToolDivision);
    document.getElementById('toolDivision')?.addEventListener('change', (e) => {
        const customInputs = document.getElementById('customToolInputs');
        if (customInputs) {
            customInputs.classList.toggle('hidden', e.target.value !== 'custom');
        }
    });
    
    // Compartilhamento
    window.shareApp = shareApp;
    
    // Quick actions (se existirem)
    // Adicionar listeners para navegação rápida
}

// ==================== FUNÇÕES UTILITÁRIAS ====================
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        // Limpar formulários
        const inputs = modal.querySelectorAll('input');
        inputs.forEach(input => input.value = '');
    }
}

function setDefaultDate(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.value = new Date().toISOString().split('T')[0];
    }
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    }).format(value || 0);
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

function getCategoryLabel(category) {
    const labels = {
        // Receitas
        uber: 'Uber',
        '99': '99',
        freelance: 'Freelance',
        service: 'Prestação de Serviço',
        sale: 'Venda',
        salary: 'Salário',
        pix: 'PIX',
        transfer: 'Transferência',
        other: 'Outros',
        // Despesas
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
        installments: 'Parcelas'
    };
    return labels[category] || category;
}

function getRecurrenceLabel(recurrence) {
    const labels = {
        monthly: 'Mensal',
        weekly: 'Semanal',
        biweekly: 'Quinzenal',
        yearly: 'Anual'
    };
    return labels[recurrence] || recurrence;
}

function setValue(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== GRÁFICOS ====================
let financeChart = null;

function updateFinanceChart() {
    const ctx = document.getElementById('financeChart');
    if (!ctx) return;
    
    const last6Months = getLast6MonthsData();
    
    if (financeChart) {
        financeChart.destroy();
    }
    
    financeChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: last6Months.labels,
            datasets: [
                {
                    label: 'Receitas',
                    data: last6Months.income,
                    backgroundColor: '#10B981',
                    borderRadius: 8
                },
                {
                    label: 'Despesas',
                    data: last6Months.expense,
                    backgroundColor: '#EF4444',
                    borderRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        padding: 12,
                        font: { size: 11, weight: '600' }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    }
                }
            }
        }
    });
}

function getLast6MonthsData() {
    const months = [];
    const income = [];
    const expense = [];
    const labels = [];
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = date.getMonth();
        const year = date.getFullYear();
        
        months.push({ month, year });
        labels.push(date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        
        let monthIncome = 0;
        let monthExpense = 0;
        
        state.transactions.forEach(transaction => {
            const transactionDate = new Date(transaction.date);
            if (transactionDate.getMonth() === month && 
                transactionDate.getFullYear() === year) {
                if (transaction.type === 'income') {
                    monthIncome += transaction.amount;
                } else {
                    monthExpense += transaction.amount;
                }
            }
        });
        
        income.push(monthIncome);
        expense.push(monthExpense);
    }
    
    return { labels, income, expense };
}

// ==================== CALCULADORA DE DIVISÃO (FERRAMENTAS) ====================
function calculateToolDivision() {
    const amount = parseFloat(document.getElementById('toolAmount').value);
    const method = document.getElementById('toolDivision').value;
    
    if (!amount || amount <= 0) {
        showToast('Insira um valor válido!', 'error');
        return;
    }
    
    let needsPercent, wantsPercent, savingsPercent;
    
    switch(method) {
        case '50-30-20':
            needsPercent = 50; wantsPercent = 30; savingsPercent = 20;
            break;
        case '60-20-20':
            needsPercent = 60; wantsPercent = 20; savingsPercent = 20;
            break;
        case '70-20-10':
            needsPercent = 70; wantsPercent = 20; savingsPercent = 10;
            break;
        case 'custom':
            needsPercent = parseFloat(document.getElementById('customNeeds').value) || 50;
            wantsPercent = parseFloat(document.getElementById('customWants').value) || 30;
            savingsPercent = parseFloat(document.getElementById('customSavings').value) || 20;
            break;
    }
    
    if (needsPercent + wantsPercent + savingsPercent > 100) {
        showToast('A soma dos percentuais não pode ultrapassar 100%!', 'error');
        return;
    }
    
    const needsValue = (amount * needsPercent) / 100;
    const wantsValue = (amount * wantsPercent) / 100;
    const savingsValue = (amount * savingsPercent) / 100;
    
    setValue('toolNeedsValue', formatCurrency(needsValue));
    setValue('toolWantsValue', formatCurrency(wantsValue));
    setValue('toolSavingsValue', formatCurrency(savingsValue));
    
    const toolResult = document.getElementById('toolResult');
    if (toolResult) {
        toolResult.classList.remove('hidden');
    }
}

// ==================== COMPARTILHAMENTO ====================
/**
 * Sistema de compartilhamento profissional com fallback em cascata
 * 1. Web Share API (nativo)
 * 2. WhatsApp (se disponível)
 * 3. Clipboard (último recurso)
 */
async function shareApp() {
    const shareUrl = APP_CONFIG.url;
    const shareTitle = APP_CONFIG.name;
    const shareText = APP_CONFIG.shareMessage + '\n\n' + shareUrl;

    // 1. Tentar Web Share API
    if (navigator.share && navigator.canShare) {
        try {
            const shareData = {
                title: shareTitle,
                text: shareText,
                url: shareUrl
            };

            if (navigator.canShare(shareData)) {
                await navigator.share(shareData);
                showToast('Obrigado por compartilhar ❤️');
                return;
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                return; // Usuário cancelou
            }
            // Continuar para próximo fallback
        }
    }

    // 2. Tentar WhatsApp
    try {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile) {
            const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
            
            // Testar se WhatsApp está disponível
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('WhatsApp timeout'));
                }, 2000);

                const img = new Image();
                img.onload = () => {
                    clearTimeout(timeout);
                    resolve();
                };
                img.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error('WhatsApp not available'));
                };
                img.src = 'https://whatsapp.com/favicon.ico?' + Date.now();
            });

            window.open(whatsappUrl, '_blank');
            showToast('Obrigado por compartilhar ❤️');
            return;
        }
    } catch (error) {
        // Continuar para próximo fallback
    }

    // 3. Fallback: Clipboard
    try {
        await navigator.clipboard.writeText(shareText + '\n\n' + shareUrl);
        showToast('Link copiado! Cole e compartilhe ❤️');
    } catch (error) {
        // Fallback final: método antigo
        fallbackCopyToClipboard(shareText + '\n\n' + shareUrl);
        showToast('Link copiado! Cole e compartilhe ❤️');
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
    } catch (error) {
        console.error('Fallback copy failed:', error);
    }
    
    document.body.removeChild(textArea);
}

// ==================== EXPORTAR DADOS ====================
function exportData(format) {
    switch(format) {
        case 'pdf':
            window.print();
            break;
        case 'csv':
            exportCSV();
            break;
        case 'share':
            shareData();
            break;
    }
}

function exportCSV() {
    let csv = 'Data,Descrição,Tipo,Valor,Categoria\n';
    
    state.transactions.forEach(transaction => {
        csv += `${transaction.date},"${transaction.description}",${transaction.type},${transaction.amount},${getCategoryLabel(transaction.category)}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eu-sei-gerir-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('CSV exportado!');
}

function shareData() {
    const data = {
        transactions: state.transactions,
        goals: state.goals,
        exportDate: new Date().toISOString()
    };
    
    const shareText = `EU SEI GERIR - Relatório Financeiro\n\n` +
        `Total de Transações: ${state.transactions.length}\n` +
        `Total de Metas: ${state.goals.length}\n` +
        `Exportado em: ${new Date().toLocaleDateString('pt-BR')}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'EU SEI GERIR',
            text: shareText
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            showToast('Dados copiados!');
        });
    }
}

// ==================== ÚLTIMOS LANÇAMENTOS (HOME) ====================
function updateRecentTransactions() {
    const recentContainer = document.getElementById('recentTransactions');
    if (!recentContainer) return;
    
    const recent = state.transactions.slice(0, 5);
    
    if (recent.length === 0) {
        recentContainer.innerHTML = '<p class="empty-message">Nenhum lançamento ainda</p>';
        return;
    }
    
    recentContainer.innerHTML = recent.map(transaction => `
        <div class="transaction-item" style="margin-bottom: 10px;">
            <div class="transaction-header">
                <div class="transaction-icon ${transaction.type}" style="width: 36px; height: 36px; font-size: 0.9rem;">
                    <i class="fas ${transaction.type === 'income' ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
                </div>
                <div style="flex: 1; margin-left: 12px;">
                    <p style="font-weight: 600; color: var(--text-primary); margin: 0;">
                        ${transaction.description}
                    </p>
                    <p style="font-size: 0.75rem; color: var(--text-secondary); margin: 2px 0 0;">
                        ${formatDate(transaction.date)}
                    </p>
                </div>
                <span class="transaction-amount ${transaction.type}" style="font-size: 1rem;">
                    ${transaction.type === 'income' ? '+' : '-'} ${formatCurrency(transaction.amount)}
                </span>
            </div>
        </div>
    `).join('');
}

// ==================== MENTOR FINANCEIRO ====================
function getMentorAdvice(incomeAmount) {
    if (!financialMentor) return null;
    
    const advice = financialMentor.processIncome(incomeAmount);
    return advice;
}

function showMentorAdvice(advice) {
    if (!advice) return;
    
    const messageEl = document.getElementById('mentorMessage');
    const recommendationsEl = document.getElementById('mentorRecommendations');
    
    if (!messageEl || !recommendationsEl) return;
    
    // Atualizar mensagem
    messageEl.textContent = advice.message;
    
    // Mostrar recomendações
    const reserve = advice.recommendations.reserve;
    const available = advice.recommendations.available;
    
    recommendationsEl.innerHTML = `
        <div class="recommendation-item">
            <div class="recommendation-icon">🛡️</div>
            <div class="recommendation-content">
                <p class="recommendation-title">Reserva de Emergência</p>
                <p class="recommendation-description">${reserve.reason}</p>
            </div>
            <p class="recommendation-amount">${formatCurrency(reserve.amount)}</p>
        </div>
        <div class="recommendation-item">
            <div class="recommendation-icon">💡</div>
            <div class="recommendation-content">
                <p class="recommendation-title">Disponível para gastar</p>
                <p class="recommendation-description">${available.reason}</p>
            </div>
            <p class="recommendation-amount">${formatCurrency(available.amount)}</p>
        </div>
    `;
    
    recommendationsEl.classList.remove('hidden');
    
    // Scroll suave até o mentor
    document.getElementById('mentorCard')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function calculateAvailableBalance() {
    // Calcular baseado em receitas e despesas
    const totalIncome = state.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = state.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    // Considerar 20% de reserva
    const reserve = totalIncome * 0.2;
    
    return totalIncome - reserve - totalExpenses;
}

// ==================== SAÚDE FINANCEIRA ====================
function updateHealthScreen() {
    const score = calculateHealthScore(state);
    const status = getHealthStatus(score);
    
    // Atualizar emoji e cor
    const emojiEl = document.getElementById('healthEmoji');
    const statusEl = document.getElementById('healthStatus');
    const statusTextEl = document.getElementById('healthStatusText');
    const scoreValueEl = document.getElementById('healthScoreValue');
    const messageEl = document.getElementById('healthMessage');
    
    if (emojiEl) emojiEl.textContent = status.emoji;
    if (statusTextEl) statusTextEl.textContent = status.level;
    if (scoreValueEl) scoreValueEl.textContent = score;
    
    if (statusEl) {
        statusEl.style.backgroundColor = status.color + '20';
        statusEl.style.color = status.color;
    }
    
    // Mensagem motivacional
    if (messageEl) {
        if (score >= 80) messageEl.textContent = 'Parabéns! Você tem uma saúde financeira excelente!';
        else if (score >= 60) messageEl.textContent = 'Você está no bom caminho. Continue assim!';
        else if (score >= 40) messageEl.textContent = 'Vamos melhorar! Pequenos passos geram grandes mudanças.';
        else messageEl.textContent = 'Não desanime! Todo começo é difícil. Vamos juntos!';
    }
    
    // Detalhes
    const totalSaved = state.goals.reduce((sum, g) => sum + (g.saved || 0), 0);
    const totalIncome = state.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const reservePercent = totalIncome > 0 ? Math.min(100, Math.round((totalSaved / (totalIncome * 3)) * 100)) : 0;
    const overdueBills = state.bills.filter(b => getDaysUntilDue(b.dueDate) < 0 && !b.paid).length;
    const billsPercent = state.bills.length === 0 ? 100 : Math.max(0, 100 - (overdueBills * 25));
    const goalsPercent = state.goals.length === 0 ? 0 :
        Math.round(state.goals.reduce((sum, g) => sum + (g.saved / g.amount), 0) / state.goals.length * 100);
    const streakDays = calculateStreakDays(state);
    const regularityPercent = Math.min(100, streakDays * 2);
    
    setValue('healthReserve', reservePercent + '%');
    setValue('healthBills', billsPercent + '%');
    setValue('healthGoals', goalsPercent + '%');
    setValue('healthRegularity', regularityPercent + '%');
    
    // Recomendações
    updateHealthRecommendations(score);
}

function updateHealthRecommendations(score) {
    const container = document.getElementById('healthRecommendationsContent');
    if (!container) return;
    
    const recommendations = [];
    
    if (state.goals.length === 0) {
        recommendations.push({
            icon: '🎯',
            title: 'Crie sua primeira meta',
            text: 'Metas ajudam a manter o foco. Que tal começar com R$ 500 de reserva?'
        });
    }
    
    const totalSaved = state.goals.reduce((sum, g) => sum + (g.saved || 0), 0);
    if (totalSaved < 500) {
        recommendations.push({
            icon: '🛡️',
            title: 'Construa sua reserva',
            text: `Você tem R$ ${formatCurrency(totalSaved)} guardados. O ideal é começar com R$ 500.`
        });
    }
    
    const expenseRatio = state.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0) / 
        (state.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) || 1);
    
    if (expenseRatio > 0.8) {
        recommendations.push({
            icon: '⚠️',
            title: 'Gastos altos',
            text: `Você está gastando ${Math.round(expenseRatio * 100)}% da sua renda. Tente reduzir para 70%.`
        });
    }
    
    if (recommendations.length === 0) {
        container.innerHTML = '<p class="empty-message">Ótimo trabalho! Continue mantendo suas finanças organizadas.</p>';
        return;
    }
    
    container.innerHTML = recommendations.map(rec => `
        <div class="alert" style="margin-bottom: 12px;">
            <span style="font-size: 1.5rem;">${rec.icon}</span>
            <div>
                <strong style="display: block; margin-bottom: 4px; color: var(--text-primary);">${rec.title}</strong>
                <span style="font-size: 0.875rem; color: var(--text-secondary);">${rec.text}</span>
            </div>
        </div>
    `).join('');
}

// ==================== CONQUISTAS ====================
function updateAchievementsScreen() {
    const unlocked = getUnlockedAchievements();
    const countEl = document.getElementById('achievementsCount');
    const listEl = document.getElementById('achievementsList');
    
    if (countEl) {
        countEl.textContent = unlocked.length;
    }
    
    if (!listEl) return;
    
    // Verificar todas as conquistas
    const achievements = [
        {
            id: 'first_income',
            ...MENTOR_CONFIG.messages.achievements.firstIncome,
            unlocked: state.transactions.filter(t => t.type === 'income').length >= 1
        },
        {
            id: 'first_reserve_500',
            ...MENTOR_CONFIG.messages.achievements.firstReserve,
            unlocked: state.goals.reduce((sum, g) => sum + (g.saved || 0), 0) >= 500
        },
        {
            id: 'discipline_30_days',
            ...MENTOR_CONFIG.messages.achievements.discipline,
            unlocked: calculateStreakDays(state) >= 30
        },
        {
            id: 'first_goal',
            ...MENTOR_CONFIG.messages.achievements.goalAchieved,
            unlocked: state.goals.some(g => g.amount <= g.saved)
        },
        {
            id: 'health_improvement',
            ...MENTOR_CONFIG.messages.achievements.healthImprovement,
            unlocked: calculateHealthScore(state) >= 70
        }
    ];
    
    listEl.innerHTML = achievements.map(ach => {
        const isUnlocked = unlocked.includes(ach.id) || ach.unlocked;
        return `
            <div class="goal-item" style="opacity: ${isUnlocked ? '1' : '0.5'}; margin-bottom: 12px;">
                <div class="goal-header">
                    <div class="goal-title">
                        <h3>
                            <span class="goal-icon" style="font-size: 1.5rem; margin-right: 8px;">${ach.icon}</span>
                            ${ach.title}
                        </h3>
                    </div>
                    ${isUnlocked ? '<i class="fas fa-check-circle" style="color: var(--success); font-size: 1.5rem;"></i>' : '<i class="fas fa-lock" style="color: var(--text-tertiary); font-size: 1.5rem;"></i>'}
                </div>
                <p style="color: var(--text-secondary); font-size: 0.9375rem; margin-top: 8px;">
                    ${ach.description}
                </p>
            </div>
        `;
    }).join('');
}

// ==================== VERIFICAR CONQUISTAS ====================
function checkAchievements() {
    const achievementsToCheck = [
        { id: 'first_income', condition: state.transactions.filter(t => t.type === 'income').length >= 1 },
        { id: 'first_reserve_500', condition: state.goals.reduce((sum, g) => sum + (g.saved || 0), 0) >= 500 },
        { id: 'discipline_30_days', condition: calculateStreakDays(state) >= 30 },
        { id: 'first_goal', condition: state.goals.some(g => g.amount <= g.saved) },
        { id: 'health_improvement', condition: calculateHealthScore(state) >= 70 }
    ];
    
    achievementsToCheck.forEach(ach => {
        if (ach.condition && saveAchievement(ach.id)) {
            const achievement = ACHIEVEMENTS[ach.id.toUpperCase()];
            if (achievement) {
                showToast(`🏆 Conquista desbloqueada: ${achievement.title}!`);
            }
        }
    });
}

// ==================== INICIALIZAÇÃO DE ELEMENTOS ====================
function init() {
    updateHomeScreen();
    updateTransactionsList();
    updateGoalsList();
    updateHistoryList();
    updateWalletsList();
    updateBillsList();
    updateGoalsDashboard();
    updateRecentTransactions();
    updateFinanceChart();
    
    // Inicializar mentor com os dados
    if (typeof initMentorWithData === 'function') {
        initMentorWithData();
    }
    
    // Verificar conquistas
    checkAchievements();
}

// Executar após DOM carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
