// ==================== CONFIGURAÇÕES DA MARCA ====================

const BRAND = {
    name: 'Eu Sei Gerir',
    tagline: 'Guarde um pouco todo dia',
    url: 'https://eu-sei-gerir.vercel.app/',
    shareMessage: `💰 Estou usando o Eu Sei Gerir para guardar um pouco todo dia e alcançar meus objetivos.

Ele me ajuda a perceber que pequenas quantias viram grandes conquistas.
 
Baixe gratuitamente:`
};

// ==================== CONFIGURAÇÕES FINANCEIRAS ====================

const FINANCIAL_CONFIG = {
    // Percentuais de orientação (não rígidos)
    percentages: {
        needs: 0.50,   // 50% - necessidades
        wants: 0.30,   // 30% - uso pessoal
        save: 0.20     // 20% - guardar
    },
    
    // Projeções em dias
    projections: [7, 30, 90]
};

// ==================== MENSAGENS POSITIVAS ====================
// Cada mensagem possui um ID único para controle de não-repetição.
// O sistema exibe uma mensagem de cada grupo, sem repetir, até esgotar
// todas as opções disponíveis. Depois, reinicia o ciclo.

const MESSAGES = {
    // Primeiro registro do usuário na vida do app
    first: [
        { id: 'first_001', text: 'Todo objetivo começa com o primeiro passo. Hoje você deu o seu.' },
        { id: 'first_002', text: 'O mais difícil já foi feito: você começou. Cada dia fica mais fácil.' },
        { id: 'first_003', text: 'Esse é o início de uma nova relação com o seu dinheiro. Seja bem-vindo!' },
        { id: 'first_004', text: 'Pequenas decisões hoje criam grandes resultados amanhã. Você acabou de tomar a primeira.' }
    ],

    // Guardou valor pequeno (abaixo de R$ 20)
    small_save: [
        { id: 'small_001', text: 'Pode parecer pouco agora, mas esse valor já está trabalhando a favor do seu futuro.' },
        { id: 'small_002', text: 'Não é o tamanho do valor que importa, é a constância. Você está no caminho certo.' },
        { id: 'small_003', text: 'Cada real guardado é um tijolo na construção do seu objetivo.' },
        { id: 'small_004', text: 'Pouco hoje, muito amanhã. É assim que grandes conquistas acontecem.' }
    ],

    // Guardou valor médio (entre R$ 20 e R$ 100)
    medium_save: [
        { id: 'medium_001', text: 'Ótimo! Esse valor faz diferença no seu progresso.' },
        { id: 'medium_002', text: 'Você está construindo algo sólido, um dia de cada vez.' },
        { id: 'medium_003', text: 'Esse hábito está transformando o seu futuro, um registro por vez.' },
        { id: 'medium_004', text: 'É assim que objetivos viram realidade: com ações como essa.' },
        { id: 'medium_005', text: 'Cada valor guardado hoje é liberdade no futuro.' }
    ],

    // Guardou valor alto (acima de R$ 100)
    large_save: [
        { id: 'large_001', text: 'Que valor expressivo! Você está levando isso a sério.' },
        { id: 'large_002', text: 'Esse é um passo grande rumo ao seu objetivo.' },
        { id: 'large_003', text: 'Sua dedicação está gerando frutos. Continue nesse ritmo!' },
        { id: 'large_004', text: 'Você entendeu o poder de guardar. Isso é transformador.' }
    ],

    // Guardou mais do que a sugestão
    above_suggestion: [
        { id: 'above_001', text: 'Você foi além da sugestão de hoje. Esse esforço pode acelerar seu objetivo.' },
        { id: 'above_002', text: 'Guardar mais do que o sugerido mostra o quanto você está comprometido.' },
        { id: 'above_003', text: 'Esse valor extra vai fazer diferença lá na frente. Orgulhe-se disso.' },
        { id: 'above_004', text: 'Você não só guardou, como foi além. É assim que se acelera um sonho.' }
    ],

    // Sequência de dias guardando (3+ dias seguidos)
    streak: [
        { id: 'streak_001', text: 'Você está criando algo mais importante que uma economia: um hábito.' },
        { id: 'streak_002', text: 'Dias seguidos guardando dinheiro. Isso sim é disciplina na prática.' },
        { id: 'streak_003', text: 'A consistência está do seu lado. Continue mantendo o ritmo.' },
        { id: 'streak_004', text: 'Você está transformando intenção em ação, um dia após o outro.' },
        { id: 'streak_005', text: 'É isso que constrói patrimônio: decisões repetidas todos os dias.' }
    ],

    // Próximo do objetivo (70% ou mais)
    near_goal: [
        { id: 'near_001', text: 'Você está cada vez mais perto. Continue mantendo o ritmo.' },
        { id: 'near_002', text: 'Falta pouco para a linha de chegada. Não se solte agora.' },
        { id: 'near_003', text: 'Seu objetivo está quase alcançado. Que sensação boa, não é?' },
        { id: 'near_004', text: 'A reta final é sempre a parte mais emocionante. Você está nela.' }
    ],

    // Objetivo alcançado
    goal_reached: [
        { id: 'goal_001', text: 'Você conseguiu! O que começou com pequenas quantias virou um objetivo realizado.' },
        { id: 'goal_002', text: 'Objetivo alcançado! Prova de que constância vence qualquer dificuldade.' },
        { id: 'goal_003', text: 'Você provou para si mesmo que consegue. Essa vitória é sua!' },
        { id: 'goal_004', text: 'Realizou! Agora é comemorar e escolher o próximo objetivo.' }
    ],

    // Não conseguiu guardar hoje
    not_today: [
        { id: 'skip_001', text: 'Hoje não deu? Tudo bem. Amanhã você pode continuar.' },
        { id: 'skip_002', text: 'Descansar também faz parte da jornada. O importante é não parar.' },
        { id: 'skip_003', text: 'Nem todo dia precisa ser perfeito. O que importa é seguir em frente.' },
        { id: 'skip_004', text: 'Tudo bem, acontece. O hábito não se perde por um dia.' }
    ],

    // Registro adicional no mesmo dia (substitui registro anterior)
    same_day: [
        { id: 'same_001', text: 'Registro atualizado para hoje. Toda evolução conta.' },
        { id: 'same_002', text: 'Você ajustou o ganho de hoje. O importante é manter o acompanhamento.' },
        { id: 'same_003', text: 'Vale atualizar quando o dia muda. Bom acompanhamento!' }
    ]
};

// ==================== ORIGENS DE GANHO ====================

const INCOME_SOURCES = {
    'app-driver': { label: 'Motorista de aplicativo', emoji: '🚗' },
    'delivery': { label: 'Entregas', emoji: '🛵' },
    'freelance': { label: 'Freelance', emoji: '💼' },
    'service': { label: 'Prestação de serviço', emoji: '🛠️' },
    'sale': { label: 'Venda', emoji: '🏪' },
    'salary': { label: 'Salário', emoji: '💰' },
    'pix': { label: 'PIX', emoji: '📱' },
    'other': { label: 'Outros', emoji: '📦' }
};

// ==================== SUGESTÕES PARA O OBJETIVO ====================

const GOAL_SUGGESTIONS = [
    'Comprar minha moto',
    'Fazer uma viagem',
    'Comprar um celular',
    'Montar uma reserva',
    'Dar entrada em uma casa',
    'Quitar uma dívida',
    'Comprar um equipamento'
];

// Exportar configurações globais
window.BRAND = BRAND;
window.FINANCIAL_CONFIG = FINANCIAL_CONFIG;
window.MESSAGES = MESSAGES;
window.INCOME_SOURCES = INCOME_SOURCES;
window.GOAL_SUGGESTIONS = GOAL_SUGGESTIONS;
