// ==================== EU SEI GERIR - APLICAÇÃO PRINCIPAL ====================
// Fluxo: TRABALHAR → GANHAR → IDENTIFICAR → CALCULAR → GUARDAR → OBJETIVO → EVOLUIR → CORRIGIR → CONTINUAR

// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', () => {
    // Migrar dados antigos se necessário
    StorageManager.migrateOldData();
    
    // Carregar dados locais
    StorageManager.loadState();
    
    // Aplicar tema salvo
    applyTheme(StorageManager.getTheme());
    
    // Configurar interface
    setupNavigation();
    setupEventListeners();
    setupCurrencyInputs();
    
    // Atualizar interface
    updateGreeting();
    renderHomeScreen();
    renderGoalScreen();
    renderEvolutionScreen();
    renderHistoryScreen();
    
    // Restaurar resultado se já houver registros hoje
    restoreTodayResult();
});

// ==================== NAVEGAÇÃO ====================

/**
 * Configura a navegação entre telas.
 */
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const screenId = item.dataset.screen;
            navigateTo(screenId);
        });
    });
}

/**
 * Navega para uma tela específica.
 * 
 * @param {string} screenId - ID da tela
 */
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
        
        // Atualizar conteúdo da tela ao navegar
        if (screenId === 'homeScreen') renderHomeScreen();
        if (screenId === 'goalScreen') renderGoalScreen();
        if (screenId === 'evolutionScreen') renderEvolutionScreen();
        if (screenId === 'historyScreen') renderHistoryScreen();
    }
}

// ==================== TEMA ====================

/**
 * Aplica o tema na página.
 * 
 * @param {string} theme - 'light' ou 'dark'
 */
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

/**
 * Atualiza o ícone do botão de tema.
 * 
 * @param {string} theme - 'light' ou 'dark'
 */
function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

/**
 * Alterna entre tema claro e escuro.
 */
function handleToggleTheme() {
    const newTheme = StorageManager.toggleTheme();
    applyTheme(newTheme);
}

// ==================== SAUDAÇÃO ====================

/**
 * Atualiza a saudação baseada na hora do dia.
 */
function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Boa noite!';
    
    if (hour >= 5 && hour < 12) greeting = 'Bom dia!';
    else if (hour >= 12 && hour < 18) greeting = 'Boa tarde!';
    
    const greetingText = document.getElementById('greetingText');
    if (greetingText) {
        greetingText.textContent = greeting;
    }
}

// ==================== INPUT MONETÁRIO ====================

/**
 * Configura a máscara de entrada monetária para todos os inputs.
 */
function setupCurrencyInputs() {
    // Input principal
    setupCurrencyInput('dailyAmount');
    
    // Input de valor guardado
    setupCurrencyInput('actualSaveAmount');
    
    // Inputs do modal de edição
    setupCurrencyInput('editIncome');
    setupCurrencyInput('editActualSavings');
    
    // Inputs do modal de objetivo
    setupCurrencyInput('goalAmount');
    setupCurrencyInput('goalSaved');
}

/**
 * Configura máscara monetária para um input específico.
 * 
 * @param {string} inputId - ID do input
 */
function setupCurrencyInput(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    input.addEventListener('input', (e) => {
        let value = e.target.value;
        
        // Remove tudo que não for dígito
        let digits = value.replace(/\D/g, '');
        
        if (digits.length === 0) {
            e.target.value = '';
            return;
        }
        
        // Converte para centavos (número inteiro)
        let cents = parseInt(digits, 10);
        
        // Formata como moeda
        const formatted = (cents / 100).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        e.target.value = formatted;
    });
    
    // Enter para calcular (apenas no input principal)
    if (inputId === 'dailyAmount') {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleCalculate();
            }
        });
    }
}

/**
 * Lê o valor de um input monetário e retorna em centavos.
 * 
 * @param {string} inputId - ID do input
 * @returns {number} Valor em centavos
 */
function getInputCentavos(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return 0;
    
    const value = input.value;
    
    // Extrai apenas dígitos
    const digits = value.replace(/\D/g, '');
    
    if (digits.length === 0) return 0;
    
    return parseInt(digits, 10);
}

// ==================== FLUXO PRINCIPAL ====================

/**
 * Processa o valor informado e exibe a distribuição sugerida.
 */
function handleCalculate() {
    const earnedCentavos = getInputCentavos('dailyAmount');
    
    if (earnedCentavos <= 0) {
        showToast('Informe um valor válido.', 'error');
        return;
    }
    
    // Calcular distribuição 50/30/20
    const distribution = Calculations.calculateDistribution(earnedCentavos);
    
    // Preencher campo de valor guardado com a sugestão
    const actualSaveInput = document.getElementById('actualSaveAmount');
    if (actualSaveInput) {
        actualSaveInput.value = (distribution.save / 100).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    // Definir data padrão se não preenchida
    const recordDate = document.getElementById('recordDate');
    if (recordDate && !recordDate.value) {
        recordDate.value = new Date().toISOString().split('T')[0];
    }
    
    // Exibir resultado
    showResultSection(distribution);
    
    // Animação
    const btn = document.getElementById('calculateBtn');
    if (btn) {
        btn.classList.add('pressed');
        setTimeout(() => btn.classList.remove('pressed'), 200);
    }
}

/**
 * Exibe a seção de resultados com a distribuição calculada.
 * 
 * @param {object} distribution - Objeto com valores em centavos
 */
function showResultSection(distribution) {
    const resultSection = document.getElementById('resultSection');
    if (!resultSection) return;
    
    // Atualizar valores
    setText('resultTotal', Calculations.formatCurrency(distribution.total));
    setText('needsValue', Calculations.formatCurrency(distribution.needs));
    setText('wantsValue', Calculations.formatCurrency(distribution.wants));
    setText('saveValue', Calculations.formatCurrency(distribution.save));
    setText('saveActionAmount', Calculations.formatCurrency(distribution.save));
    
    // Projeções
    const projections = Calculations.calculateProjections(distribution.save);
    const projectionMap = {
        7: 'projection7d',
        30: 'projection30d',
        90: 'projection90d'
    };
    projections.forEach(proj => {
        const elementId = projectionMap[proj.days];
        if (elementId) {
            setText(elementId, Calculations.formatCurrency(proj.value));
        }
    });
    
    // Mostrar seção
    resultSection.classList.remove('hidden');
    
    // Scroll para o resultado
    setTimeout(() => {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

/**
 * Restaura o resultado de hoje se já houver registros.
 */
function restoreTodayResult() {
    const todayRecords = StorageManager.getTodayRecords();
    if (todayRecords.length === 0) return;
    
    const todayEarned = StorageManager.getTodayTotalEarned();
    const todaySaved = StorageManager.getTodayTotalSaved();
    
    // Preencher input com o total do dia
    const amountInput = document.getElementById('dailyAmount');
    if (amountInput) {
        const formatted = (todayEarned / 100).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        amountInput.value = formatted;
    }
    
    // Exibir resultado com o total do dia
    const distribution = Calculations.calculateDistribution(todayEarned);
    showResultSection(distribution);
    
    // Se já guardou hoje, mostrar mensagem
    if (todaySaved > 0) {
        showMessageCard('Você já guardou ' + Calculations.formatCurrency(todaySaved) + ' hoje. Se ganhou mais, adicione outro registro.');
    }
}

/**
 * Registra o valor guardado hoje.
 * Adiciona um novo registro (permite múltiplos por dia).
 */
function handleSaveToday() {
    const amountInput = document.getElementById('dailyAmount');
    
    if (!amountInput || !amountInput.value) {
        showToast('Primeiro informe quanto você ganhou.', 'error');
        return;
    }
    
    const earnedCentavos = getInputCentavos('dailyAmount');
    if (earnedCentavos <= 0) {
        showToast('Informe um valor válido.', 'error');
        return;
    }
    
    // Obter valor realmente guardado (permite alteração)
    const actualSaveInput = document.getElementById('actualSaveAmount');
    let actualSavings = getInputCentavos('actualSaveAmount');
    
    // Se não preencheu, usar a sugestão
    if (actualSavings <= 0 && actualSaveInput && actualSaveInput.value === '') {
        const distribution = Calculations.calculateDistribution(earnedCentavos);
        actualSavings = distribution.save;
    }
    
    const distribution = Calculations.calculateDistribution(earnedCentavos);
    const date = document.getElementById('recordDate').value || new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();
    
    // Obter origem e horários
    const incomeSource = document.getElementById('incomeSource').value || 'other';
    const startTime = document.getElementById('startTime').value || '';
    const endTime = document.getElementById('endTime').value || '';
    
    // Verificar se é o primeiro registro do usuário
    const isFirstRecord = StorageManager.getAllRecords().length === 0;
    
    // Adicionar novo registro (múltiplos por dia)
    StorageManager.addRecord({
        id: 'rec_' + Date.now(),
        date: date,
        income: earnedCentavos,
        incomeSource: incomeSource,
        startTime: startTime,
        endTime: endTime,
        suggestedSavings: distribution.save,
        actualSavings: actualSavings,
        createdAt: now,
        updatedAt: now
    });
    
    // Recalcular objetivo
    StorageManager.recalculateGoalFromRecords();
    
    // Atualizar streak
    const streak = StorageManager.getCurrentStreak();
    
    // Obter contexto da mensagem
    const goal = StorageManager.state.goal;
    const goalReached = goal ? Calculations.isGoalReached(goal) : false;
    const goalProgress = goal ? Calculations.calculateGoalProgress(goal) : 0;
    
    // Verificar se já tem registros hoje
    const todayRecords = StorageManager.getTodayRecords();
    const isUpdated = todayRecords.length > 1;
    
    const message = Messages.getContextualMessage({
        isFirst: isFirstRecord,
        saved: actualSavings,
        suggested: distribution.save,
        streak: streak,
        goalProgress: goalProgress,
        goalReached: goalReached,
        isUpdated: isUpdated
    });
    
    if (message) {
        showMessageCard(message.text, true);
    }
    
    // Limpar campos para permitir novo registro
    clearRecordForm();
    
    // Atualizar resumo e objetivo
    renderHomeScreen();
    renderGoalScreen();
    renderEvolutionScreen();
    renderHistoryScreen();
    
    // Feedback visual
    if (goalReached) {
        showToast('🎉 Objetivo alcançado!');
    } else if (actualSavings > 0) {
        showToast('+ ' + Calculations.formatCurrency(actualSavings) + ' guardado!');
    } else {
        showToast('Registro salvo.');
    }
    
    // Feedback háptico (se suportado)
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    // Animar o card do objetivo
    animateGoalCard();
}

/**
 * Limpa o formulário de registro para permitir novo lançamento.
 */
function clearRecordForm() {
    const amountInput = document.getElementById('dailyAmount');
    const actualSaveInput = document.getElementById('actualSaveAmount');
    const startTime = document.getElementById('startTime');
    const endTime = document.getElementById('endTime');
    
    if (amountInput) amountInput.value = '';
    if (actualSaveInput) actualSaveInput.value = '';
    if (startTime) startTime.value = '';
    if (endTime) endTime.value = '';
}

/**
 * Registra que hoje não foi possível guardar.
 * Apenas registra o ganho sem atribuir valor guardado.
 */
function handleSkip() {
    const earnedCentavos = getInputCentavos('dailyAmount');
    
    if (earnedCentavos <= 0) {
        showToast('Informe um valor válido.', 'error');
        return;
    }
    
    const distribution = Calculations.calculateDistribution(earnedCentavos);
    const date = document.getElementById('recordDate').value || new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();
    
    // Obter origem e horários
    const incomeSource = document.getElementById('incomeSource').value || 'other';
    const startTime = document.getElementById('startTime').value || '';
    const endTime = document.getElementById('endTime').value || '';
    
    // Adicionar registro sem valor guardado
    StorageManager.addRecord({
        id: 'rec_' + Date.now(),
        date: date,
        income: earnedCentavos,
        incomeSource: incomeSource,
        startTime: startTime,
        endTime: endTime,
        suggestedSavings: distribution.save,
        actualSavings: 0,
        createdAt: now,
        updatedAt: now
    });
    
    // Recalcular objetivo
    StorageManager.recalculateGoalFromRecords();
    
    // Mostrar mensagem de apoio (sem culpa)
    const message = Messages.selectMessage('not_today');
    if (message) {
        showMessageCard(message.text);
    }
    
    // Limpar campos
    clearRecordForm();
    
    // Atualizar interface
    renderHomeScreen();
    renderEvolutionScreen();
    renderHistoryScreen();
    
    showToast('Tudo bem. Amanhã você continua!');
}

// ==================== MENSAGENS ====================

/**
 * Mostra o card de mensagem positiva.
 * 
 * @param {string} text - Texto da mensagem
 * @param {boolean} isHighlight - Se deve destacar
 */
function showMessageCard(text, isHighlight = false) {
    const messageCard = document.getElementById('messageCard');
    const messageText = document.getElementById('messageText');
    
    if (!messageCard || !messageText) return;
    
    messageText.textContent = text;
    messageCard.classList.remove('hidden');
    
    // Animação
    messageCard.style.animation = 'none';
    messageCard.offsetHeight;
    messageCard.style.animation = '';
    
    if (isHighlight) {
        messageCard.classList.add('highlight');
    }
    
    // Scroll para a mensagem
    setTimeout(() => {
        messageCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);
}

// ==================== RESUMO RÁPIDO ====================

/**
 * Atualiza a tela principal com os dados atuais.
 */
function renderHomeScreen() {
    const totalSaved = StorageManager.getTotalSaved();
    const savingDays = StorageManager.getSavingDays();
    const averageSaved = StorageManager.getAverageSaved();
    const todayEarned = StorageManager.getTodayTotalEarned();
    const todaySaved = StorageManager.getTodayTotalSaved();
    
    // Resumo rápido
    setText('summarySaved', Calculations.formatCurrency(totalSaved));
    setText('summaryDays', savingDays.toString());
    setText('summaryAverage', Calculations.formatCurrency(averageSaved));
    
    // Atualizar saudação com total do dia
    const greetingSubtitle = document.getElementById('greetingSubtitle');
    if (greetingSubtitle) {
        if (todayEarned > 0) {
            greetingSubtitle.textContent = 'Hoje você ganhou ' + Calculations.formatCurrency(todayEarned) + 
                (todaySaved > 0 ? ' e guardou ' + Calculations.formatCurrency(todaySaved) : '');
        } else {
            greetingSubtitle.textContent = 'Quanto você ganhou hoje?';
        }
    }
    
    // Objetivo conectado
    renderGoalConnection();
}

/**
 * Atualiza o card de conexão com o objetivo na tela principal.
 */
function renderGoalConnection() {
    const goal = StorageManager.state.goal;
    const connectionCard = document.getElementById('goalConnectionCard');
    
    if (!connectionCard) return;
    
    if (!goal) {
        setText('goalConnectionName', 'Defina um objetivo');
        setText('goalConnectionProgress', 'Toque em Objetivo para começar');
        setText('goalConnectionPercent', '');
        setText('goalConnectionRemaining', '');
        
        const fill = document.getElementById('goalConnectionFill');
        if (fill) fill.style.width = '0%';
        return;
    }
    
    const progress = Calculations.calculateGoalProgress(goal);
    const remaining = goal.amount - goal.saved;
    
    setText('goalConnectionName', (goal.icon || '🎯') + ' ' + goal.name);
    setText('goalConnectionProgress', Calculations.formatCurrency(goal.saved) + ' / ' + Calculations.formatCurrency(goal.amount));
    setText('goalConnectionPercent', progress + '% concluído');
    
    if (remaining > 0) {
        setText('goalConnectionRemaining', 'Faltam ' + Calculations.formatCurrency(remaining));
    } else {
        setText('goalConnectionRemaining', '🎉 Objetivo alcançado!');
    }
    
    const fill = document.getElementById('goalConnectionFill');
    if (fill) fill.style.width = progress + '%';
}

// ==================== OBJETIVO ====================

/**
 * Atualiza a tela de objetivo.
 */
function renderGoalScreen() {
    const goal = StorageManager.state.goal;
    const noGoalCard = document.getElementById('noGoalCard');
    const goalDetailCard = document.getElementById('goalDetailCard');
    
    if (!goal) {
        if (noGoalCard) noGoalCard.classList.remove('hidden');
        if (goalDetailCard) goalDetailCard.classList.add('hidden');
        return;
    }
    
    if (noGoalCard) noGoalCard.classList.add('hidden');
    if (goalDetailCard) goalDetailCard.classList.remove('hidden');
    
    // Detalhes do objetivo
    const progress = Calculations.calculateGoalProgress(goal);
    const remaining = Math.max(0, goal.amount - goal.saved);
    const averageSaved = StorageManager.getAverageSaved();
    const estimateDays = Calculations.estimateDaysToGoal(remaining, averageSaved);
    
    setText('goalDetailIcon', goal.icon || '🎯');
    setText('goalDetailName', goal.name);
    setText('goalDetailAmount', Calculations.formatCurrency(goal.amount));
    setText('goalDetailSaved', 'Guardado: ' + Calculations.formatCurrency(goal.saved));
    setText('goalDetailPercent', progress + '%');
    setText('goalDetailRemaining', Calculations.formatCurrency(remaining));
    setText('goalDetailEstimate', Calculations.formatEstimate(estimateDays));
    
    // Texto da estimativa
    const estimateText = document.getElementById('goalEstimateText');
    if (estimateText) {
        if (remaining <= 0) {
            estimateText.textContent = '🎉 Você alcançou seu objetivo! Escolha o próximo.';
        } else if (averageSaved <= 0) {
            estimateText.textContent = 'Registre seus ganhos diários para calcular a estimativa.';
        } else {
            estimateText.textContent = 'No ritmo atual, você pode chegar ao objetivo em ' + Calculations.formatEstimate(estimateDays) + '.';
        }
    }
    
    // Barra de progresso
    const fill = document.getElementById('goalDetailFill');
    if (fill) fill.style.width = progress + '%';
}

/**
 * Abre o modal para criar/editar objetivo.
 */
function openGoalModal() {
    const modal = document.getElementById('goalModal');
    const goal = StorageManager.state.goal;
    
    const nameInput = document.getElementById('goalName');
    const amountInput = document.getElementById('goalAmount');
    const savedInput = document.getElementById('goalSaved');
    const iconSelect = document.getElementById('goalIcon');
    
    if (goal) {
        nameInput.value = goal.name || '';
        amountInput.value = (goal.amount / 100).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        savedInput.value = (goal.saved / 100).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        iconSelect.value = goal.icon || '🎯';
    } else {
        nameInput.value = '';
        amountInput.value = '';
        savedInput.value = '';
        iconSelect.value = '🏍️';
    }
    
    modal.classList.remove('hidden');
    setTimeout(() => nameInput.focus(), 300);
}

/**
 * Fecha o modal de objetivo.
 */
function closeGoalModal() {
    document.getElementById('goalModal').classList.add('hidden');
}

/**
 * Salva o objetivo (criar ou editar).
 */
function handleSaveGoal() {
    const name = document.getElementById('goalName').value.trim();
    const amountValue = document.getElementById('goalAmount').value;
    const savedValue = document.getElementById('goalSaved').value;
    const icon = document.getElementById('goalIcon').value;
    
    if (!name) {
        showToast('Dê um nome para seu objetivo.', 'error');
        return;
    }
    
    const amount = Calculations.reaisToCentavos(amountValue);
    const saved = Calculations.reaisToCentavos(savedValue);
    
    if (amount <= 0) {
        showToast('Informe o valor do objetivo.', 'error');
        return;
    }
    
    const existing = StorageManager.state.goal;
    
    StorageManager.saveGoal({
        name: name,
        amount: amount,
        saved: saved > 0 ? saved : (existing ? existing.saved : 0),
        icon: icon,
        createdAt: existing ? existing.createdAt : new Date().toISOString()
    });
    
    closeGoalModal();
    
    renderHomeScreen();
    renderGoalScreen();
    
    showToast('Objetivo salvo! 🎯');
}

/**
 * Exclui o objetivo atual.
 */
function handleDeleteGoal() {
    const goal = StorageManager.state.goal;
    if (!goal) return;
    
    if (!confirm('Excluir o objetivo "' + goal.name + '"?')) return;
    
    StorageManager.deleteGoal();
    
    renderHomeScreen();
    renderGoalScreen();
    
    showToast('Objetivo excluído.');
}

// ==================== EVOLUÇÃO ====================

/**
 * Atualiza a tela de evolução.
 */
function renderEvolutionScreen() {
    const totalSaved = StorageManager.getTotalSaved();
    const savingDays = StorageManager.getSavingDays();
    const averageSaved = StorageManager.getAverageSaved();
    const bestSaved = StorageManager.getBestSaved();
    const streak = StorageManager.getCurrentStreak();
    
    setText('evolutionTotal', Calculations.formatCurrency(totalSaved));
    setText('evolutionDays', savingDays.toString());
    setText('evolutionAverage', Calculations.formatCurrency(averageSaved));
    setText('evolutionBest', Calculations.formatCurrency(bestSaved));
    setText('evolutionStreak', streak + ' ' + (streak === 1 ? 'dia' : 'dias'));
    
    renderRecentRecords();
}

/**
 * Renderiza os últimos registros na tela de evolução.
 */
function renderRecentRecords() {
    const container = document.getElementById('recentRecords');
    if (!container) return;
    
    const days = StorageManager.getRecordsByDay().slice(0, 7);
    
    if (days.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhum registro ainda. Comece hoje!</p>';
        return;
    }
    
    container.innerHTML = days.map(day => {
        const dateStr = formatDateLabel(day.date);
        const savedClass = day.saved > 0 ? 'positive' : 'neutral';
        const savedText = day.saved > 0 
            ? Calculations.formatCurrency(day.saved)
            : '—';
        
        const recordsHtml = day.records.map(record => {
            const source = getSourceLabel(record.incomeSource);
            const timeStr = record.startTime ? record.startTime + (record.endTime ? ' - ' + record.endTime : '') : formatTimeLabel(record.createdAt);
            
            return '' +
                '<div class="record-sub-item">' +
                    '<span class="record-time">' + timeStr + '</span>' +
                    '<span class="record-source">' + source + '</span>' +
                    '<span class="record-sub-earned">' + Calculations.formatCurrency(record.income) + '</span>' +
                    '<span class="record-sub-saved ' + (record.actualSavings > 0 ? 'positive' : 'neutral') + '">' + 
                        (record.actualSavings > 0 ? Calculations.formatCurrency(record.actualSavings) : '—') + 
                    '</span>' +
                '</div>';
        }).join('');
        
        return '' +
            '<div class="recent-record">' +
                '<div class="record-header">' +
                    '<span class="record-date">' + dateStr + '</span>' +
                    '<span class="record-total">' + Calculations.formatCurrency(day.earned) + '</span>' +
                '</div>' +
                '<div class="record-details">' +
                    '<span class="record-saved ' + savedClass + '">Guardou ' + savedText + '</span>' +
                '</div>' +
                '<div class="record-sub-list">' + recordsHtml + '</div>' +
            '</div>';
    }).join('');
}

// ==================== HISTÓRICO ====================

/**
 * Renderiza a tela de histórico com opções de editar e excluir.
 */
function renderHistoryScreen() {
    const container = document.getElementById('historyList');
    if (!container) return;
    
    const days = StorageManager.getRecordsByDay();
    
    if (days.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhum registro ainda. Comece hoje!</p>';
        return;
    }
    
    container.innerHTML = days.map(day => {
        const dateStr = formatDateLabel(day.date);
        const savedClass = day.saved > 0 ? 'positive' : 'neutral';
        const savedText = day.saved > 0 
            ? Calculations.formatCurrency(day.saved)
            : '—';
        
        const recordsHtml = day.records.map(record => {
            const source = getSourceLabel(record.incomeSource);
            const timeStr = record.startTime ? record.startTime + (record.endTime ? ' - ' + record.endTime : '') : formatTimeLabel(record.createdAt);
            
            return '' +
                '<div class="history-record-item">' +
                    '<div class="history-record-info">' +
                        '<span class="history-record-source">' + source + '</span>' +
                        '<span class="history-record-time">' + timeStr + '</span>' +
                        '<span class="history-record-earned">' + Calculations.formatCurrency(record.income) + '</span>' +
                        '<span class="history-record-saved ' + savedClass + '">Guardou ' + (record.actualSavings > 0 ? Calculations.formatCurrency(record.actualSavings) : '—') + '</span>' +
                    '</div>' +
                    '<div class="history-record-actions">' +
                        '<button class="btn-small" onclick="openEditRecordModal(\'' + record.id + '\')">' +
                            '<i class="fas fa-pen"></i>' +
                        '</button>' +
                        '<button class="btn-small danger" onclick="openDeleteConfirm(\'' + record.id + '\')">' +
                            '<i class="fas fa-trash"></i>' +
                        '</button>' +
                    '</div>' +
                '</div>';
        }).join('');
        
        return '' +
            '<div class="history-day-group">' +
                '<div class="history-day-header">' +
                    '<span class="history-day-date">' + dateStr + '</span>' +
                    '<span class="history-day-total">' + Calculations.formatCurrency(day.earned) + '</span>' +
                    '<span class="history-day-saved ' + savedClass + '">' + savedText + '</span>' +
                '</div>' +
                '<div class="history-day-records">' + recordsHtml + '</div>' +
            '</div>';
    }).join('');
}

// ==================== EDITAR REGISTRO ====================

let editingRecordId = null;

/**
 * Abre o modal para editar um registro.
 * 
 * @param {string} recordId - ID do registro
 */
function openEditRecordModal(recordId) {
    const record = StorageManager.getRecordById(recordId);
    if (!record) return;
    
    editingRecordId = recordId;
    
    // Preencher campos
    document.getElementById('editIncome').value = (record.income / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    document.getElementById('editIncomeSource').value = record.incomeSource || 'other';
    document.getElementById('editStartTime').value = record.startTime || '';
    document.getElementById('editEndTime').value = record.endTime || '';
    document.getElementById('editDate').value = record.date;
    document.getElementById('editActualSavings').value = (record.actualSavings / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    document.getElementById('editRecordModal').classList.remove('hidden');
}

/**
 * Fecha o modal de edição.
 */
function closeEditRecordModal() {
    document.getElementById('editRecordModal').classList.add('hidden');
    editingRecordId = null;
}

/**
 * Salva as alterações do registro.
 */
function handleSaveEdit() {
    if (!editingRecordId) return;
    
    const income = getInputCentavos('editIncome');
    if (income <= 0) {
        showToast('Informe um valor válido.', 'error');
        return;
    }
    
    const actualSavings = getInputCentavos('editActualSavings');
    const incomeSource = document.getElementById('editIncomeSource').value;
    const startTime = document.getElementById('editStartTime').value;
    const endTime = document.getElementById('editEndTime').value;
    const date = document.getElementById('editDate').value;
    
    // Atualizar registro
    StorageManager.updateRecord(editingRecordId, {
        income: income,
        incomeSource: incomeSource,
        startTime: startTime,
        endTime: endTime,
        date: date,
        actualSavings: actualSavings
    });
    
    // Recalcular objetivo
    StorageManager.recalculateGoalFromRecords();
    
    closeEditRecordModal();
    
    // Atualizar telas
    renderHomeScreen();
    renderGoalScreen();
    renderEvolutionScreen();
    renderHistoryScreen();
    
    showToast('Registro atualizado!');
}

// ==================== EXCLUIR REGISTRO ====================

let deletingRecordId = null;

/**
 * Abre o modal de confirmação de exclusão.
 * 
 * @param {string} recordId - ID do registro
 */
function openDeleteConfirm(recordId) {
    const record = StorageManager.getRecordById(recordId);
    if (!record) return;
    
    deletingRecordId = recordId;
    
    const dateFormatted = formatDateLabel(record.date);
    const amountFormatted = Calculations.formatCurrency(record.income);
    
    document.getElementById('deleteConfirmText').textContent = 
        'Essa ação removerá o ganho de ' + amountFormatted + ' registrado em ' + dateFormatted + '.';
    
    document.getElementById('deleteConfirmModal').classList.remove('hidden');
}

/**
 * Fecha o modal de confirmação de exclusão.
 */
function closeDeleteConfirm() {
    document.getElementById('deleteConfirmModal').classList.add('hidden');
    deletingRecordId = null;
}

/**
 * Confirma e executa a exclusão do registro.
 */
function handleConfirmDelete() {
    if (!deletingRecordId) return;
    
    StorageManager.removeRecord(deletingRecordId);
    
    // Recalcular objetivo
    StorageManager.recalculateGoalFromRecords();
    
    closeDeleteConfirm();
    
    // Atualizar telas
    renderHomeScreen();
    renderGoalScreen();
    renderEvolutionScreen();
    renderHistoryScreen();
    
    showToast('Registro excluído.');
}

// ==================== UTILITÁRIOS ====================

/**
 * Retorna o label da origem de ganho.
 * 
 * @param {string} sourceKey - Chave da origem
 * @returns {string} Label formatado
 */
function getSourceLabel(sourceKey) {
    const source = INCOME_SOURCES[sourceKey];
    if (source) {
        return source.emoji + ' ' + source.label;
    }
    return '📦 Outros';
}

/**
 * Formata uma data YYYY-MM-DD para exibição amigável.
 * 
 * @param {string} dateStr - Data no formato YYYY-MM-DD
 * @returns {string} Data formatada
 */
function formatDateLabel(dateStr) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (dateStr === today) return 'Hoje';
    if (dateStr === yesterdayStr) return 'Ontem';
    
    const parts = dateStr.split('-');
    return parts[2] + '/' + parts[1];
}

/**
 * Formata um timestamp ISO para hora amigável.
 * 
 * @param {string} isoString - Timestamp ISO
 * @returns {string} Hora formatada
 */
function formatTimeLabel(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
}

/**
 * Define o texto de um elemento por ID.
 * 
 * @param {string} elementId - ID do elemento
 * @param {string|number} text - Texto a definir
 */
function setText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}

/**
 * Exibe um toast de feedback.
 * 
 * @param {string} message - Mensagem
 * @param {string} type - 'success' | 'error'
 */
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Anima o card de conexão com o objetivo após guardar.
 */
function animateGoalCard() {
    const card = document.getElementById('goalConnectionCard');
    if (!card) return;
    
    card.classList.add('pulse-animation');
    setTimeout(() => card.classList.remove('pulse-animation'), 600);
}

// ==================== EVENTOS ====================

/**
 * Configura todos os listeners de eventos da interface.
 */
function setupEventListeners() {
    // Tema
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', handleToggleTheme);
    }
    
    // Calculadora
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', handleCalculate);
    }
    
    const saveTodayBtn = document.getElementById('saveTodayBtn');
    if (saveTodayBtn) {
        saveTodayBtn.addEventListener('click', handleSaveToday);
    }
    
    const skipTodayBtn = document.getElementById('skipTodayBtn');
    if (skipTodayBtn) {
        skipTodayBtn.addEventListener('click', handleSkip);
    }
    
    // Objetivo
    const createGoalBtn = document.getElementById('createGoalBtn');
    if (createGoalBtn) {
        createGoalBtn.addEventListener('click', openGoalModal);
    }
    
    const editGoalBtn = document.getElementById('editGoalBtn');
    if (editGoalBtn) {
        editGoalBtn.addEventListener('click', openGoalModal);
    }
    
    const saveGoalBtn = document.getElementById('saveGoalBtn');
    if (saveGoalBtn) {
        saveGoalBtn.addEventListener('click', handleSaveGoal);
    }
    
    const cancelGoalBtn = document.getElementById('cancelGoalBtn');
    if (cancelGoalBtn) {
        cancelGoalBtn.addEventListener('click', closeGoalModal);
    }
    
    const deleteGoalBtn = document.getElementById('deleteGoalBtn');
    if (deleteGoalBtn) {
        deleteGoalBtn.addEventListener('click', handleDeleteGoal);
    }
    
    // Fechar modal de objetivo ao clicar fora
    const goalModal = document.getElementById('goalModal');
    if (goalModal) {
        goalModal.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                closeGoalModal();
            }
        });
    }
    
    // Editar registro
    const saveEditBtn = document.getElementById('saveEditBtn');
    if (saveEditBtn) {
        saveEditBtn.addEventListener('click', handleSaveEdit);
    }
    
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', closeEditRecordModal);
    }
    
    const editRecordModal = document.getElementById('editRecordModal');
    if (editRecordModal) {
        editRecordModal.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                closeEditRecordModal();
            }
        });
    }
    
    // Excluir registro
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteConfirm);
    }
    
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
    }
    
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    if (deleteConfirmModal) {
        deleteConfirmModal.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                closeDeleteConfirm();
            }
        });
    }
}

// ==================== COMPARTILHAMENTO ====================

/**
 * Compartilha o aplicativo usando Web Share API ou clipboard.
 */
async function shareApp() {
    const shareText = BRAND.name + ' - ' + BRAND.tagline + '\n\n' + BRAND.shareMessage + '\n\n' + BRAND.url;
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: BRAND.name,
                text: shareText,
                url: BRAND.url
            });
            return;
        } catch (e) {
            if (e.name === 'AbortError') return;
        }
    }
    
    try {
        await navigator.clipboard.writeText(shareText);
        showToast('Link copiado! Cole e compartilhe ❤️');
    } catch (e) {
        fallbackCopyToClipboard(shareText);
        showToast('Link copiado! Cole e compartilhe ❤️');
    }
}

/**
 * Copia texto para o clipboard (fallback).
 * 
 * @param {string} text - Texto para copiar
 */
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
    } catch (e) {
        console.error('Fallback copy failed:', e);
    }
    
    document.body.removeChild(textArea);
}

// Exportar funções globais para uso em HTML
window.navigateTo = navigateTo;
window.shareApp = shareApp;
window.openEditRecordModal = openEditRecordModal;
window.openDeleteConfirm = openDeleteConfirm;