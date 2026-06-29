// ==================== CONFIGURAÇÕES INICIAIS ====================
const STORAGE_KEY = 'calculadoraGanhos';

// Biblioteca de mensagens motivacionais (300+)
const motivationalMessages = [
    "Cada real economizado hoje aproxima você dos seus sonhos.",
    "Pequenos passos diários constroem grandes conquistas.",
    "Seu futuro financeiro começa com as decisões de hoje.",
    "Disciplina vale mais do que sorte.",
    "Quem controla o dinheiro conquista liberdade.",
    "Você está mais perto da sua meta do que estava ontem.",
    "Persistência transforma metas em realidade.",
    "Economizar hoje é investir na sua tranquilidade de amanhã.",
    "Continue firme. Cada ganho registrado faz diferença.",
    "Grandes resultados nascem de pequenas atitudes diárias.",
    "O dinheiro que você guarda hoje é a segurança de amanhã.",
    "Cada centavo poupado é um passo rumo à independência.",
    "Sonhos não têm preço, mas têm custo. Invista neles!",
    "A riqueza não é sobre ter muito, é sobre precisar de pouco.",
    "Seu esforço de hoje será sua recompensa de amanhã.",
    "Dinário, pequenos hábitos geram grandes transformações.",
    "Você é o protagonista da sua história financeira.",
    "Cada economia é uma semente plantada para o futuro.",
    "O tempo está passando de qualquer forma. Use-o a seu favor.",
    "Quem planeja o amanhã, colhe sucesso no futuro.",
    "Sua meta está mais próxima do que imagina.",
    "A força do hábito é mais poderosa que a força de vontade.",
    "Cada dia é uma nova oportunidade de progredir.",
    "Quem espera o momento perfeito, nunca começa.",
    "O melhor investimento é em você mesmo.",
    "Paciência e persistência são as chaves do sucesso financeiro.",
    "Seus maiores sonhos requerem os maiores esforços.",
    "Não espere para ter dinheiro para começar a economizar.",
    "Cada meta alcançada é uma nova oportunidade.",
    "O segredo do sucesso é começar antes de estar pronto.",
    "Seu esforço de hoje é a garantia do seu futuro.",
    "Quem investe em conhecimento, investe no próprio futuro.",
    "O dinheiro é um ótimo servo, mas um péssimo mestre.",
    "Disciplina é fazer o que precisa ser feito, mesmo quando não quer.",
    "Economizar é a forma mais fácil de multiplicar o seu dinheiro.",
    "Quem não planeja o futuro, não terá futuro.",
    "Investir em você mesmo é o melhor retorno garantido.",
    "O tempo é o seu maior aliado nas finanças.",
    "Cada real investido é um passo para a liberdade financeira.",
    "Quem transforma sonhos em metas, transforma vida em conquistas.",
    "A felicidade não está em gastar, mas em realizar.",
    "Conexões mais fortes do que os obstáculos.",
    "A sua meta financeira está ao seu alcance.",
    "Quem planta economia, colhe tranquilidade.",
    "Comece de onde você está, use o que você tem, faça o que você pode.",
    "Cada conquista financeira é uma vitória pessoal.",
    "O sucesso nasce do esforço diário.",
    "Você não precisa de muito, precisa de constância.",
    "Economizar é um ato de amor próprio.",
    "Quem guarda para o futuro, vive o presente sem preocupações.",
    "O amanhã pertence a quem se prepara hoje.",
    "Cada passo, por menor que seja, é progresso.",
    "Seu dinheiro deve trabalhar para você, não o contrário.",
    "A jornada de mil quilômetros começa com um único passo.",
    "Quem tem clareza de metas, chega mais rápido aos resultados.",
    "O dinheiro que você não gasta hoje é a liberdade de amanhã.",
    "Persista. Todo esforço tem sua recompensa.",
    "A melhor época para economizar foi ontem. A segunda melhor é agora.",
    "Sonhe grande, comece pequeno, mas comece hoje.",
    "Quem investe com sabedoria, colhe com tranquilidade.",
    "Cada graduação financeira vem das pequenas economias diárias.",
    "O controle do dinheiro é o controle da própria vida.",
    "Quem aprende a poupar, aprende a viver melhor.",
    "Sua meta financeira é o seu GPS para o sucesso.",
    "O impossível existe apenas para os desistentes.",
    "Economizar não é só guardar dinheiro, é construir futuro.",
    "Quem tem metas claras, tem caminhos definidos.",
    "A verdadeira riqueza é a paz de espírito.",
    "Cada moeda economizada é uma prova da sua determinação.",
    "Quem planeja, economiza. Quem economiza, conquista.",
    "O dinheiro bem gasto traz felicidade duradoura.",
    "A sua meta está a poucos dias de distância.",
    "Quem investe no próprio futuro, nunca perde.",
    "Cada novo dia é uma chance de se aproximar dos seus sonhos.",
    "O segredo não é ganhar muito, mas gastar bem.",
    "Quem tem dinheiro, tem opções. Quem tem opções, tem liberdade.",
    "Economizar é multiplicar o seu poder de escolha.",
    "A cumplicidade com o dinheiro vem da educação financeira.",
    "Quem resiste aos gastos desnecessários, resiste ao fracasso.",
    "Seu futuro agradece cada economia feita hoje.",
    "Cada oportunidade de economizar é uma dádiva.",
    "Quem investe no futuro, vive o presente com mais intensidade.",
    "O dinheiro poupado cria margem para os imprevistos.",
    "Quem se organiza financeiramente, vive com tranquilidade.",
    "Cada economia é uma declaração de amor ao futuro.",
    "A riqueza material é consequência da riqueza mental.",
    "Quem gerencia bem o dinheiro, gerencia bem a vida.",
    "O melhor momento para economizar é sempre.",
    "Seu esforço de hoje será a sua tranquilidade de amanhã.",
    "Quem não economiza agora, sofre depois.",
    "Cada ano Controle Suas finanças",
    "A prática de economizar traz a arte de viver bem.",
    "Quem tem objetivos definidos tem motivação diária.",
    "O dinheiro gasto com sabedoria gera alegrias duradouras.",
    "Cada meta conquistada fortalece a sua disciplina.",
    "Quem constrói reservas, constrói tranquilidade.",
    "A sua meta está mais perto do que os seus medos dizem.",
    "Economizar é fazer do futuro uma prioridade.",
    "Quem vive de acordo com suas possibilidades, vive melhor.",
    "Cada esforço conta. Por menor que pareça ser.",
    "A melhor garantia que você pode dar a si mesmo é a independência financeira.",
    "Quem guarda uma parte do que ganha, planta tranquilidade.",
    "O dinheiro Briga com quem não o respeita.",
    "O valor do dinheiro está no que ele representa de liberdade.",
    "Quem investe em sonhos, colhe realizações.",
    "Cada mês poupado é um mês a menos de incertezas.",
    "Quem tem disciplina financeira tem paz de espírito.",
    "O tempo é o seu maior aliado para multiplicar sua riqueza.",
    "Cada decisão financeira consciente é uma vitória.",
    "Quem economiza hoje, vive bem amanhã.",
    "O futuro pertence aos preparados.",
    "Economizar é a forma mais simples de ficar mais rico.",
    "Quem define prioridades, não desperdiça oportunidades.",
    "Sua capacidade de economizar define sua velocidade de progresso.",
    "Cada meta alcançada inspira novas conquistas.",
    "Quem tem foco, não se desvia das metas.",
    "O dinheiro é um instrumento, você é o musicista.",
    "Quem aprende a gerenciar, aprende a crescer.",
    "Cada moeda não gasta é um passo adiante no seu caminho.",
    "Quem resiste às tentações de consumo, constrói patrimônio.",
    "O melhor investimento é aquele que você faz em si mesmo.",
    "Quem poupa com sabedoria, vive com tranquilidade.",
    "A sua meta financeira é o seu projeto de vida.",
    "Cada prova de superação é combustível para continuar.",
    "Quem tem metas, tem rumo. Quem tem rumo, chega lá.",
    "Economizar é criar espaço para o que realmente importa.",
    "O dinheiro bem cuidado gera frutos para a vida toda.",
    "Quem domina os gastos, domina o medo do futuro.",
    "Cada conta paga em dia é uma dívida com o futuro quitada.",
    "Quem aprende a esperar, aprende a crescer.",
    "A motivação para economizar vem da clareza dos seus objetivos.",
    "Quem tem objetivos claros, não desperdiça energia com distrações.",
    "A verdadeira riqueza é poder enfrentar imprevistos sem medo.",
    "Cada meta define quem você vai se tornar.",
    "Quem evita dívidas, evita preocupações.",
    "O dinheiro é um recurso finito, use-o com sabedoria.",
    "Quem investe com paciência, multiplica com certeza.",
    "Cada decisão financeira correta é um degrau para o sucesso.",
    "A consistência é mais importante do que a intensidade.",
    "Quem planeja o futuro, vive o presente sem pressa.",
    "O seu crescimento financeiro começa quando você assume o controle.",
    "Quem sabe guardar, sabe investir. Quem sabe investir, sabe viver.",
    "Cada real investido é uma semente de liberdade.",
    "Quem tem persistência, supera qualquer obstáculo financeiro.",
    "A meta mais importante é aquela que você não desiste.",
    "Quem transforma sonhos em metas, transforma medo em ação.",
    "Cada economia diária constrói uma fortaleza de tranquilidade.",
    "Quem respeita o dinheiro, ganha o respeito da vida.",
    "O caminho para a liberdade financeira está no dia a dia.",
    "Quem tem disciplina, chega mais longe do que quem tem talento.",
    "Economizar é a forma mais segura de construir patrimônio.",
    "Quem organiza as finanças, organiza a própria vida.",
    "Cada centavo poupado é um voto de confiança no futuro.",
    "Quem tem metas, tem destino. Quem tem destino, chega lá.",
    "A sua meta financeira desafia os seus limites.",
    "Quem se preocupa com o futuro, vive o presente com mais alegria.",
    "Cada novo mês é uma chance nova de ser mais disciplinado.",
    "Quem domina os impulsos de consumo, domina o próprio destino.",
    "O dinheiro bem investido gera tranquilidade para sempre.",
    "Quem tem reservas, tem segurança. Quem tem segurança, vive melhor.",
    "Cada objetivo financeiro é um convite à disciplina.",
    "Quem espera o dinheiro sobrar, nunca vai ter dinheiro.",
    "O melhor investimento é aquele que você faz agora.",
    "Quem tem clareza financeira, vive com mais leveza.",
    "Economizar é a arte de investir no próprio bem-estar.",
    "Quem constrói patrimônio aos poucos, constrói liberdade rápido.",
    "Cada dia de economia é um dia mais perto da sua realização.",
    "Quem respeita o dinheiro, recebe o respeito da vida.",
    "A felicidade não está no que você compra, mas no que você conquista.",
    "Quem tem resistência emocional frente ao consumo, tem sucesso financeiro.",
    "O melhor presente que você pode dar ao seu eu futuro é a economia de hoje.",
    "Quem acredita no seu potencial financeiro, ultrapassa fronteiras.",
    "Cada meta que você define hoje é um novo horizonte amanhã.",
    "Quem investe no próprio crescimento, cresce financeiramente.",
    "O dinheiro que você guarda é o diploma da sua maturidade.",
    "Quem tem metas, tem esperança. Quem tem esperança, tem futuro.",
    "Cada economia é uma ferramenta para transformar sonhos em realidade.",
    "Quem transforma gastos impulsivos em investimentos, transforma vida.",
    "A disciplina financeira é a ponte entre o querer e o conquistar.",
    "Quem administra bem o dinheiro, administra bem os sentimentos.",
    "O tempo é moeda. Gaste-o com sabedoria e ele retorna multiplicado.",
    "Quem não economiza, não liberta. Quem não liberta, não vive.",
    "Cada objetivo alcançado é uma prova do seu poder de superação.",
    "Quem age hoje sobre o dinheiro, vive amanhã sem medo.",
    "Economizar é um ato de coragem para enfrentar o futuro.",
    "Quem resiste a compras desnecessárias, constrói paz de alma.",
    "A sua meta financeira é o legado que você constrói para si mesmo.",
    "Quem aprende a adiar recompensas, cresce rapidamente.",
    "Cada centavo poupado com consciência é um passo rumo à realização.",
    "Quem transforma rotina em ritual de economia, transforma vida.",
    "O dinheiro Racional é o melhor conselheiro financeiro.",
    "Quem tem metas claras, não se distrai com o supérfluo.",
    "Economizar é a respiração do seu futuro financeiro.",
    "Quem sonha e guarda, tem o poder de viver melhor.",
    "Cada meta é um lembrete de quem você está se tornando.",
    "Quem se compromete com o futuro, vive o presente sem culpa.",
    "O verdadeiro luxo é a liberdade de não ter preocupações.",
    "Quem guarda o dinheiro, garante os seus sonhos.",
    "Cada economia é um voto de confiança em si mesmo.",
    "Quem vive além do orçamento, nunca alcança a liberdade.",
    "A melhor forma de economizar é evitar gastos desnecessários.",
    "Quem respeita os próprios limites financeiros, ganha várias possibilidades.",
    "Cada ano que passa é um ano a mais de experiência financeira.",
    "Quem tem metas, vence. Quem vence, inspira.",
    "O dinheiro não traz felicidade, mas falta de dinheiro traz tristeza.",
    "Quem aprende a poupar, aprende a amar a si mesmo.",
    "A sua meta é o seu farol na jornada financeira.",
    "Quem investe na própria educação financeira, multiplica o próprio futuro.",
    "Cada pequena economia diária transforma o seu destino.",
    "Quem guarda uma parte do ganho, dorme tranquilo sempre.",
    "O sucesso não é destino, é consequência de boas decisões.",
    "Quem tem resistência para não gastar, tem força para conquistar.",
    "Economizar é construir pontes para os seus sonhos.",
    "Quem sabe esperar, sabe colher os melhores frutos.",
    "Cada meta alcançada é uma nova fonte de energia para continuar.",
    "Quem investe no futuro, colhe o hoje com mais tranquilidade.",
    "A jornada financeira não é sobre destino, é sobre direção.",
    "Quem cuida do dinheiro hoje, colhe tranquilidade amanhã.",
    "Cada economia diária é uma prova do seu compromisso com o futuro.",
    "Quem tem metas, tem razão para acordar todos os dias.",
    "O dinheiro é um recurso renovável se bem administrado.",
    "Quem se dedica às metas, se dedica à própria liberdade.",
    "Não espere o dinheiro sobrar. Faça ele sobrar.",
    "Cada meta é um lembrete das suas capacidades.",
    "Quem aprende a dizer não aos gastos, aprende a dizer sim aos sonhos.",
    "Economizar é cultivar o jardim da sua vida financeira.",
    "Quem semeia economia, colhe abundância.",
    "A verdadeira riqueza é poder fazer o que quiser quando quiser.",
    "Quem tem clareza das metas, não se perde no caminho.",
    "Cada mês que você economiza, você se aproxima mais dos seus sonhos.",
    "Quem respeita o dinheiro, ganha o mundo.",
    "O dinheiro gasto com sabedoria vira memória positiva para sempre.",
    "Quem guarda dinheiro, guarda opções.",
    "Economizar é o primeiro passo para transformar sonhos em realidade.",
    "Quem não tem reserva, vive um passo atrás do medo.",
    "A meta de hoje é a realização de amanhã.",
    "Quem investe na educação financeira, investe em si mesmo.",
    "Cada dia de disciplina é um degrau para o sucesso.",
    "Quem sonha grande, começa economizando pequeno.",
    "A sua meta está a apenas alguns dias de distância.",
    "Quem se organiza financeiramente, vive as melhores oportunidades.",
    "Cada real bem investido gera um futuro mais colorido.",
    "Quem respeita o dinheiro, vive com mais propósito.",
    "Economizar é construir o império da sua tranquilidade.",
    "Quem tem metas, tem foco. Quem tem foco, tem sucesso.",
    "O tempo é a moeda mais valiosa. Invista-o planejando.",
    "Quem investe no hoje, garante o amanhã.",
    "Cada meta alcançada é uma nova página de sucesso.",
    "Quem tem determinação, transforma obstáculos em degraus.",
    "Economizar é transformar escassez em abundância.",
    "Quem guarda para o futuro, conquista liberdade no presente.",
    "A melhor garantia contra a incerteza é a economia.",
    "Quem administra gastos, constrói um futuro sólido.",
    "Cada etapa do caminho é importante. Não pare agora.",
    "Quem investe nos seus objetivos, ganha a própria vida.",
    "O dinheiro bem usado traz felicidade para todos ao redor.",
    "Quem economiza com alegria, vive com mais satisfação.",
    "A sua meta está guardada para você alcançar.",
    "Quem sonha sem medo, chega mais longe.",
    "Economizar é escolher entre o prazer de hoje e a paz de amanhã.",
    "Quem tem metas financeiras, vive com tranquilidade emocional.",
    "Cada resistência ao consumo é uma prova do seu crescimento.",
    "Quem respeita suas finanças, respeita a si mesmo.",
    "O futuro começa agora. O que você vai fazer por ele?",
    "Quem aprende a économizar, aprende a ser livre.",
    "Cada meta é o início de uma nova fase de conquistas.",
    "Quem se compromete com as finanças, se compromete com o futuro.",
    "A sua meta é um lembrete diário do que realmente importa.",
    "Quem investe no seu sonho, colhe realizações extraordinárias.",
    "Cada centavo poupado é um ativo para o seu futuro.",
    "Quem organiza as suas contas, organiza a sua vida.",
    "Economizar é garantir que amanhã você terá mais possibilidades.",
    "Quem cresce financeiramente, cresce em todos os aspectos.",
    "O dinheiro é uma ferramenta. Use-a a seu favor.",
    "Quem tem metas claras, tem paciência com o processo.",
    "Cada decisão de economizar é um voto pela sua independência.",
    "Quem investe com sabedoria, vive sem pressa.",
    "A vida é curta para viver com dívidas e preocupações.",
    "Quem aprende a gerir os ganhos, aprende a gerir a felicidade.",
    "Cada nova economia traz uma nova chance de ser mais.",
    "Quem guarda dinheiro, constrói horizontes mais amplos.",
    "O seu esforço de hoje será reconhecido no futuro.",
    "Quem transforma sonhos em economia, transforma ansiedade em realização.",
    "Cada meta alcançada gera novas possibilidades para avançar.",
    "Quem vive com intencionalidade financeira, vive com mais propósito.",
    "Economizar é pilotar o próprio destino financeiro.",
    "Quem assume o controle, nunca mais tem que pedir controle.",
    "Cada mês de disciplina é um degrau rumo à liberdade.",
    "Quem investe no futuro, aposenta o medo.",
    "O dinheiro economizado traz uma felicidade mais duradoura.",
    "Quem tem independência financeira, tem liberdade de escolha.",
    "Cada centavo não gasto é um ato de amor ao seu eu futuro.",
    "Quem gasta com sabedoria, vive com tranquilidade.",
    "A meta é a estrela que guia a sua jornada financeira.",
    "Quem guarda parte do que ganha, dorme com a consciência tranquila.",
    "Cada dia de economia é um dia de vitória sobre o desperdício.",
    "Quem aprende a administrar o dinheiro, aprende a administrar a vida.",
    "Economizar é multiplicar o tempo que você tem para viver.",
    "Quem investe em metas sólidas, constrói uma vida sólida.",
    "A sua meta financeira é a prova do seu caráter.",
    "Quem resiste a tentações de consumo, constrói um futuro próspero.",
    "Cada pequena economia diária acumula grandes liberdades futuras.",
    "Quem tem sonhos, tem metas. Quem tem metas, tem futuro.",
    "O dinheiro bem guardado é o melhor aliado contra a adversidade.",
    "Quem domina os impulsos de consumo, domina a própria vida.",
    "Economizar é fazer do dinheiro um parceiro, não um inimigo.",
    "Quem tem reserva financeira, tem reserva emocional.",
    "Cada meta que você atinge é um passo em direção à melhor versão de si mesmo.",
    "Quem planeja o dinheiro, planeja o futuro. Quem planeja o futuro, vive.",
    "A sua meta não é um sonho, é um objetivo com prazo para acontecer.",
    "Quem investe na poupança, investe na própria paz.",
    "Cada dia que você economiza, está mais perto da realização.",
    "Quem tem foco financeiro, tem liberdade de viver.",
    "Economizar é transformar intenção em ação, e ação em resultado.",
    "Quem constrói um patrimônio, constrói um legado.",
    "A melhor forma de prever o futuro é criá-lo com suas economias.",
    "Quem tem metas, não se perde em distrações.",
    "Cada centavo economizado é um tijolo na sua liberdade financeira.",
    "Quem guarda dinheiro, guarda opções para o futuro.",
    "O esforço de economizar hoje é a prova de que você acredita em si.",
    "Quem transforma presentes em investimentos, transforma a vida.",
    "Cada meta alcançada fortalece a crença no seu potencial.",
    "Quem tem metas financeiras claras, não tem tempo para desperdício.",
    "Economizar é a forma de multiplicar as suas possibilidades.",
    "Quem cuida do dinheiro, cuida do bem mais importante da vida.",
    "O dinheiro é o combustível dos seus maiores projetos.",
    "Quem investe com constância, colhe com tranquilidade.",
    "Cada economia é um passo rumo à sua realização financeira.",
    "Quem planeja, não se surpreende com imprevistos.",
    "A sua meta financeira é o espelho da sua determinação.",
    "Quem tem disciplina, faz o impossível parecer fácil.",
    "Economizar é proteger o que ainda não aconteceu: o seu futuro.",
    "Quem investe no hoje, garante o amanhã.",
    "Cada mês poupado é um passo em direção aos seus maiores sonhos.",
    "Quem define prioridades, não desperdiça energia com futilidades.",
    "O dinheiro gasto com culpa gera apenas arrependimento.",
    "Quem gasta com propósito, vive com mais significado.",
    "Cada meta financeira é um lembrete de quem você quer ser.",
    "Quem respeita o dinheiro, ganha respeito próprio.",
    "Economizar é a base de tudo que você vai construir na vida.",
    "Quem determina metas, direciona a própria vida.",
    "A sua meta é o combustível para o seu desenvolvimento financeiro.",
    "Quem investe em educação financeira, investe em liberdade.",
    "Cada centavo economizado é um ato de fé no seu futuro.",
    "Quem guarda parte do ganho, investe na própria tranquilidade.",
    "Economizar é transformar receio em coragem de viver melhor.",
    "Quem tem metas, não tem desculpas. Quem não tem metas, tem desculpas.",
    "O valor real do dinheiro está em transformar vidas, não em acumular números.",
    "Quem administra o dinheiro com sabedoria, vive com mais leveza.",
    "Cada economia feita com alegria gera um futuro mais promissor.",
    "Quem investe no próprio crescimento financeiro, cresce como pessoa.",
    "A meta é o primeiro passo para a sua transformação financeira.",
    "Quem não desperdiça, multiplica. Quem multiplica, prospera.",
    "Economizar é escolher ser mais hoje, para ser ainda mais amanhã.",
    "Quem afirma metas, afirma o seu lugar no mundo.",
    "Cada passo na sua jornada financeira torna o caminho mais real.",
    "Quem gasta em coisas que duram, colhe felicidade que permanece.",
    "O dinheiro economizado é a melhor ferramenta contra a ansiedade.",
    "Quem tem metas definidas, não tem espaço para a procrastinação.",
    "Economizar é plantar sementes que florescem em tranquilidade.",
    "Quem transforma gastos emocionais em investimentos racionais, transforma o destino.",
    "Cada centavo poupado é uma diretriz que você dá à sua vida.",
    "Quem respeita as metas financeiras, vive com mais dignidade.",
    "A sua meta financeira é a mensagem que você manda para o seu futuro."
];

let currentMotivationIndex = -1;

// Elementos DOM
const elements = {
    navItems: document.querySelectorAll('.nav-item'),
    screens: document.querySelectorAll('.screen'),
    themeToggle: document.getElementById('themeToggle'),
    totalReceived: document.getElementById('totalReceived'),
    totalDistributed: document.getElementById('totalDistributed'),
    totalSavings: document.getElementById('totalSavings'),
    needsValue: document.getElementById('needsValue'),
    wantsValue: document.getElementById('wantsValue'),
    savingsValue: document.getElementById('savingsValue'),
    activeGoalContent: document.getElementById('activeGoalContent'),
    amount: document.getElementById('amount'),
    incomeType: document.getElementById('incomeType'),
    divisionMethod: document.getElementById('divisionMethod'),
    customInputs: document.getElementById('customInputs'),
    customNeeds: document.getElementById('customNeeds'),
    customWants: document.getElementById('customWants'),
    customSavings: document.getElementById('customSavings'),
    date: document.getElementById('date'),
    description: document.getElementById('description'),
    calculateBtn: document.getElementById('calculateBtn'),
    resultCard: document.getElementById('resultCard'),
    needsValueCard: document.getElementById('needsValueCard'),
    wantsValueCard: document.getElementById('wantsValueCard'),
    savingsValueCard: document.getElementById('savingsValueCard'),
    needsPercent: document.getElementById('needsPercent'),
    wantsPercent: document.getElementById('wantsPercent'),
    savingsPercent: document.getElementById('savingsPercent'),
    needsBar: document.getElementById('needsBar'),
    wantsBar: document.getElementById('wantsBar'),
    savingsBar: document.getElementById('savingsBar'),
    alertContainer: document.getElementById('alertContainer'),
    copyBtn: document.getElementById('copyBtn'),
    whatsappBtn: document.getElementById('whatsappBtn'),
    pdfBtn: document.getElementById('pdfBtn'),
    addGoalBtn: document.getElementById('addGoalBtn'),
    goalsList: document.getElementById('goalsList'),
    totalGoals: document.getElementById('totalGoals'),
    completedGoals: document.getElementById('completedGoals'),
    totalSavedEl: document.getElementById('totalSaved'),
    nextGoal: document.getElementById('nextGoal'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    historyList: document.getElementById('historyList'),
    emergencyGoal: document.getElementById('emergencyGoal'),
    investmentGoal: document.getElementById('investmentGoal'),
    purchaseGoal: document.getElementById('purchaseGoal'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn'),
    goalModal: document.getElementById('goalModal'),
    simulatorModal: document.getElementById('simulatorModal'),
    editGoalModal: document.getElementById('editGoalModal'),
    editModal: document.getElementById('editModal'),
    goalName: document.getElementById('goalName'),
    goalCategory: document.getElementById('goalCategory'),
    goalAmount: document.getElementById('goalAmount'),
    goalDate: document.getElementById('goalDate'),
    goalType: document.getElementById('goalType'),
    goalValue: document.getElementById('goalValue'),
    saveGoalBtn: document.getElementById('saveGoalBtn'),
    cancelGoalBtn: document.getElementById('cancelGoalBtn'),
    simulatorContent: document.getElementById('simulatorContent'),
    closeSimulatorBtn: document.getElementById('closeSimulatorBtn'),
    editGoalName: document.getElementById('editGoalName'),
    editGoalCategory: document.getElementById('editGoalCategory'),
    editGoalAmount: document.getElementById('editGoalAmount'),
    editGoalDate: document.getElementById('editGoalDate'),
    editGoalType: document.getElementById('editGoalType'),
    editGoalValue: document.getElementById('editGoalValue'),
    saveGoalEditBtn: document.getElementById('saveGoalEditBtn'),
    cancelGoalEditBtn: document.getElementById('cancelGoalEditBtn'),
    editAmount: document.getElementById('editAmount'),
    editIncomeType: document.getElementById('editIncomeType'),
    editDescription: document.getElementById('editDescription'),
    saveEditBtn: document.getElementById('saveEditBtn'),
    cancelEditBtn: document.getElementById('cancelEditBtn'),
    monthlyTotal: document.getElementById('monthlyTotal'),
    motivationText: document.getElementById('motivationText'),
    newMotivationBtn: document.getElementById('newMotivationBtn')
};

let currentResult = null;
let editingId = null;
let personalGoals = [];
let editingGoalId = null;
let chart = null;
let lastMotivationIndex = -1;

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    setDefaultDate();
    loadGoals();
    renderHistory();
    loadPersonalGoals();
    updateMonthlyTotal();
    changeMotivation();
    setupEventListeners();
    updateHomeScreen();
});

// ==================== NAVEGAÇÃO ====================
function setupEventListeners() {
    elements.navItems.forEach(item => {
        item.addEventListener('click', () => {
            navigateTo(item.dataset.screen);
        });
    });
    
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.divisionMethod.addEventListener('change', (e) => {
        e.target.value === 'custom' ? 
            elements.customInputs.classList.remove('hidden') : 
            elements.customInputs.classList.add('hidden');
    });
    
    elements.calculateBtn.addEventListener('click', calculate);
    elements.copyBtn.addEventListener('click', copyResult);
    elements.whatsappBtn.addEventListener('click', shareWhatsApp);
    elements.pdfBtn.addEventListener('click', exportPDF);
    elements.clearHistoryBtn.addEventListener('click', clearHistory);
    elements.newMotivationBtn.addEventListener('click', changeMotivation);
    
    elements.addGoalBtn.addEventListener('click', () => elements.goalModal.classList.remove('hidden'));
    elements.cancelGoalBtn.addEventListener('click', () => {
        elements.goalModal.classList.add('hidden');
        clearGoalForm();
    });
    elements.saveGoalBtn.addEventListener('click', savePersonalGoal);
    elements.closeSimulatorBtn.addEventListener('click', () => elements.simulatorModal.classList.add('hidden'));
    elements.cancelGoalEditBtn.addEventListener('click', () => elements.editGoalModal.classList.add('hidden'));
    elements.saveGoalEditBtn.addEventListener('click', saveGoalEdit);
    elements.saveSettingsBtn.addEventListener('click', saveSettings);
    elements.cancelEditBtn.addEventListener('click', () => elements.editModal.classList.add('hidden'));
    elements.saveEditBtn.addEventListener('click', saveEdit);
    
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'SELECT') calculate();
    });
}

function navigateTo(screenId) {
    elements.screens.forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    elements.navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.screen === screenId);
    });
    window.scrollTo(0, 0);
}

// ==================== TEMA ====================
function loadTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

function toggleTheme() {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    elements.themeToggle.querySelector('i').className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function setDefaultDate() {
    elements.date.value = new Date().toISOString().split('T')[0];
}

// ==================== MENSAGENS MOTIVACIONAIS ====================
function changeMotivation() {
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * motivationalMessages.length);
    } while (newIndex === lastMotivationIndex && motivationalMessages.length > 1);
    
    lastMotivationIndex = newIndex;
    const message = motivationalMessages[newIndex];
    
    const textElement = elements.motivationText;
    textElement.style.animation = 'none';
    setTimeout(() => {
        textElement.textContent = message;
        textElement.style.animation = 'fadeIn 0.5s ease';
    }, 50);
}

// ==================== TOTAL MENSAL ====================
function updateMonthlyTotal() {
    const history = getHistory();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    let monthlyTotal = 0;
    
    history.forEach(item => {
        const itemDate = new Date(item.date);
        if (itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear) {
            monthlyTotal += item.amount || 0;
        }
    });
    
    elements.monthlyTotal.textContent = formatCurrency(monthlyTotal);
}

// ==================== CÁLCULO PRINCIPAL ====================
function calculate() {
    const amount = parseFloat(elements.amount.value);
    if (!amount || amount <= 0) {
        alert('Insira um valor válido!');
        return;
    }
    
    let needsPercent, wantsPercent, savingsPercent;
    const method = elements.divisionMethod.value;
    
    switch (method) {
        case '50-30-20': needsPercent=50; wantsPercent=30; savingsPercent=20; break;
        case '60-20-20': needsPercent=60; wantsPercent=20; savingsPercent=20; break;
        case '70-20-10': needsPercent=70; wantsPercent=20; savingsPercent=10; break;
        case 'custom':
            needsPercent = parseFloat(elements.customNeeds.value) || 50;
            wantsPercent = parseFloat(elements.customWants.value) || 30;
            savingsPercent = parseFloat(elements.customSavings.value) || 20;
    }
    
    if (needsPercent + wantsPercent + savingsPercent > 100) {
        alert('Soma dos percentuais não pode ultrapassar 100%!');
        return;
    }
    
    const needsValue = (amount * needsPercent) / 100;
    const wantsValue = (amount * wantsPercent) / 100;
    const savingsValue = (amount * savingsPercent) / 100;
    const totalDistributed = needsValue + wantsValue + savingsValue;
    const remaining = amount - totalDistributed;
    
    const incomeTypeMap = {daily:'Diário',weekly:'Semanal',biweekly:'Quinzenal',monthly:'Mensal',other:'Outro'};
    const divisionMethodMap = {
        '50-30-20':'50/30/20','60-20-20':'60/20/20','70-20-10':'70/20/10',
        'custom':`Personalizado (${needsPercent}/${wantsPercent}/${savingsPercent})`
    };
    
    currentResult = {
        id: Date.now(),
        date: elements.date.value,
        amount,
        incomeType: incomeTypeMap[elements.incomeType.value],
        divisionMethod: divisionMethodMap[method],
        needsPercent, wantsPercent, savingsPercent,
        needsValue, wantsValue, savingsValue,
        totalDistributed, remaining,
        description: elements.description.value
    };
    
    displayResults(currentResult);
    saveToHistory(currentResult);
    updateGoals();
    updateGoalProgress();
    updateMonthlyTotal();
    changeMotivation();
    updateHomeScreen();
    generateAlerts(currentResult);
    
    elements.resultCard.classList.remove('hidden');
    setTimeout(() => elements.resultCard.scrollIntoView({behavior:'smooth'}), 100);
}

// ==================== EXIBIR RESULTADOS ====================
function displayResults(result) {
    elements.needsValueCard.textContent = formatCurrency(result.needsValue);
    elements.wantsValueCard.textContent = formatCurrency(result.wantsValue);
    elements.savingsValueCard.textContent = formatCurrency(result.savingsValue);
    elements.needsPercent.textContent = `${result.needsPercent}%`;
    elements.wantsPercent.textContent = `${result.wantsPercent}%`;
    elements.savingsPercent.textContent = `${result.savingsPercent}%`;
    elements.needsBar.style.width = `${result.needsPercent}%`;
    elements.wantsBar.style.width = `${result.wantsPercent}%`;
    elements.savingsBar.style.width = `${result.savingsPercent}%`;
    updateChart(result);
}

function updateChart(result) {
    const ctx = document.getElementById('pieChart');
    if (!ctx) return;
    
    if (chart) chart.destroy();
    
    chart = new Chart(ctx.getContext('2d'), {
        type: 'pie',
        data: {
            labels: ['Necessidades', 'Desejos', 'Investimentos'],
            datasets: [{
                data: [result.needsValue, result.wantsValue, result.savingsValue],
                backgroundColor: ['#f59e0b', '#8b5cf6', '#10b981'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom', labels: { padding: 12, font: { size: 11 } } }
            }
        }
    });
}

// ==================== HOME SCREEN ====================
function updateHomeScreen() {
    const history = getHistory();
    if (history.length > 0) {
        const last = history[0];
        elements.needsValue.textContent = formatCurrency(last.needsValue);
        elements.wantsValue.textContent = formatCurrency(last.wantsValue);
        elements.savingsValue.textContent = formatCurrency(last.savingsValue);
    }
    
    const activeGoals = personalGoals.filter(g => g.amount - g.saved > 0);
    if (activeGoals.length > 0) {
        const closest = activeGoals.reduce((closest, goal) => {
            const stats = calculateGoalStats(goal);
            if (!closest || stats.daysLeft < closest.daysLeft) return { goal, daysLeft: stats.daysLeft };
            return closest;
        }, null);
        
        if (closest) {
            const progress = (closest.goal.saved / closest.goal.amount) * 100;
            elements.activeGoalContent.innerHTML = `
                <h3>${closest.goal.name}</h3>
                <p>Progresso: ${progress.toFixed(1)}% • Faltam: ${formatCurrency(closest.goal.amount - closest.goal.saved)}</p>
                <div class="goal-progress-bar" style="margin-top:10px">
                    <div class="goal-progress-fill" style="width:${progress}%">${progress.toFixed(0)}%</div>
                </div>
            `;
        }
    } else {
        elements.activeGoalContent.innerHTML = '<p class="empty-message">Nenhuma meta ativa</p>';
    }
}

// ==================== METAS COM CATEGORIAS ====================
function savePersonalGoal() {
    const name = elements.goalName.value.trim();
    const category = elements.goalCategory.value;
    const amount = parseFloat(elements.goalAmount.value);
    const date = elements.goalDate.value;
    const type = elements.goalType.value;
    const value = parseFloat(elements.goalValue.value);
    
    if (!name || !amount || !value) {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }
    
    personalGoals.push({
        id: Date.now(),
        name, category, amount, date, type, value,
        saved: 0,
        createdAt: new Date().toISOString()
    });
    
    savePersonalGoalsToStorage();
    renderPersonalGoals();
    updatePersonalGoalsDashboard();
    updateHomeScreen();
    elements.goalModal.classList.add('hidden');
    clearGoalForm();
    showToast('Meta cadastrada!');
}

function clearGoalForm() {
    elements.goalName.value = '';
    elements.goalCategory.value = 'needs';
    elements.goalAmount.value = '';
    elements.goalDate.value = '';
    elements.goalType.value = 'percentage';
    elements.goalValue.value = '';
}

function deletePersonalGoal(id) {
    if (!confirm('Excluir esta meta?')) return;
    personalGoals = personalGoals.filter(g => g.id !== id);
    savePersonalGoalsToStorage();
    renderPersonalGoals();
    updatePersonalGoalsDashboard();
    updateHomeScreen();
    showToast('Meta excluída!');
}

function addSavingsToGoal(id) {
    const amount = prompt('Quanto já economizou? (R$)');
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return;
    
    const goal = personalGoals.find(g => g.id === id);
    if (!goal) return;
    
    goal.saved += parseFloat(amount);
    savePersonalGoalsToStorage();
    renderPersonalGoals();
    updatePersonalGoalsDashboard();
    updateHomeScreen();
    showToast(`R$ ${formatCurrency(parseFloat(amount))} adicionado!`);
}

window.simulateGoal = function(id) {
    const goal = personalGoals.find(g => g.id === id);
    if (!goal) return;
    
    const remaining = goal.amount - goal.saved;
    if (remaining <= 0) {
        alert('Meta já concluída!');
        return;
    }
    
    let dailyValue;
    if (goal.type === 'percentage') {
        const history = getHistory();
        let categoryAvg = 0;
        let count = 0;
        
        history.forEach(calc => {
            if (goal.category === 'needs') categoryAvg += calc.needsValue || 0;
            else if (goal.category === 'wants') categoryAvg += calc.wantsValue || 0;
            else if (goal.category === 'savings') categoryAvg += calc.savingsValue || 0;
            count++;
        });
        
        categoryAvg = count > 0 ? categoryAvg / count : (goal.category === 'needs' ? 100 : goal.category === 'wants' ? 60 : 40);
        dailyValue = (categoryAvg * goal.value) / 100;
    } else {
        dailyValue = goal.value;
    }
    
    const daysToComplete = Math.ceil(remaining / dailyValue);
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + daysToComplete);
    
    elements.simulatorContent.innerHTML = `
        <div class="simulator-info">
            <h3>🎯 ${goal.name}</h3>
            <p><strong>Meta:</strong> ${formatCurrency(goal.amount)}</p>
            <p><strong>Economizado:</strong> ${formatCurrency(goal.saved)}</p>
            <p><strong>Faltam:</strong> ${formatCurrency(remaining)}</p>
        </div>
        <div class="simulator-results">
            <h4>Com economia atual:</h4>
            <div class="simulation-item"><span>📅 Dias:</span><strong>${daysToComplete} dias</strong></div>
            <div class="simulation-item"><span>📆 Data:</span><strong>${formatDate(completionDate.toISOString().split('T')[0])}</strong></div>
            <div class="simulation-item"><span>💰 Por dia:</span><strong>${formatCurrency(dailyValue)}</strong></div>
        </div>
        <div class="simulator-slider">
            <label>Simule diferentes valores:</label>
            <input type="range" id="simSlider" min="1" max="500" value="${Math.round(dailyValue)}" step="1">
        </div>
        <div class="simulator-results" id="simOutput"></div>
    `;
    
    elements.simulatorModal.classList.remove('hidden');
    
    const slider = document.getElementById('simSlider');
    const output = document.getElementById('simOutput');
    
    function updateSim() {
        const simDaily = parseFloat(slider.value);
        const simDays = Math.ceil(remaining / simDaily);
        const simDate = new Date();
        simDate.setDate(simDate.getDate() + simDays);
        
        output.innerHTML = `
            <div class="simulation-item"><span>💰 Por dia:</span><strong>${formatCurrency(simDaily)}</strong></div>
            <div class="simulation-item"><span>📅 Dias:</span><strong>${simDays} dias</strong></div>
            <div class="simulation-item"><span>📆 Data:</span><strong>${formatDate(simDate.toISOString().split('T')[0])}</strong></div>
        `;
    }
    
    slider.addEventListener('input', updateSim);
    updateSim();
};

window.editPersonalGoal = function(id) {
    const goal = personalGoals.find(g => g.id === id);
    if (!goal) return;
    
    editingGoalId = id;
    elements.editGoalName.value = goal.name;
    elements.editGoalCategory.value = goal.category;
    elements.editGoalAmount.value = goal.amount;
    elements.editGoalDate.value = goal.date || '';
    elements.editGoalType.value = goal.type;
    elements.editGoalValue.value = goal.value;
    elements.editGoalModal.classList.remove('hidden');
};

function saveGoalEdit() {
    if (!editingGoalId) return;
    
    const goal = personalGoals.find(g => g.id === editingGoalId);
    goal.name = elements.editGoalName.value.trim();
    goal.category = elements.editGoalCategory.value;
    goal.amount = parseFloat(elements.editGoalAmount.value);
    goal.date = elements.editGoalDate.value;
    goal.type = elements.editGoalType.value;
    goal.value = parseFloat(elements.editGoalValue.value);
    
    savePersonalGoalsToStorage();
    renderPersonalGoals();
    updatePersonalGoalsDashboard();
    updateHomeScreen();
    elements.editGoalModal.classList.add('hidden');
    editingGoalId = null;
    showToast('Meta atualizada!');
}

function renderPersonalGoals() {
    if (personalGoals.length === 0) {
        elements.goalsList.innerHTML = '<p class="empty-message">Nenhuma meta cadastrada</p>';
        return;
    }
    
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    personalGoals.sort((a, b) => {
        if (a.priority !== b.priority) return priorityOrder[a.priority] - priorityOrder[b.priority];
        return new Date(a.date || '9999-12-31') - new Date(b.date || '9999-12-31');
    });
    
    const categoryLabels = { needs: '🏠 Necessidades', wants: '🎉 Desejos', savings: '💰 Investimentos' };
    const priorityLabels = { high: 'Alta', medium: 'Média', low: 'Baixa' };
    
    elements.goalsList.innerHTML = personalGoals.map(goal => {
        const remaining = goal.amount - goal.saved;
        const progress = (goal.saved / goal.amount) * 100;
        const isCompleted = remaining <= 0;
        const stats = calculateGoalStats(goal);
        
        return `
            <div class="goal-item priority-${goal.priority}">
                <div class="goal-header">
                    <div class="goal-title">
                        <h3>${isCompleted ? '✅' : '🎯'} ${goal.name}</h3>
                        <span style="font-size:0.75rem;color:var(--text-secondary)">${categoryLabels[goal.category]} • ${priorityLabels[goal.priority]}</span>
                    </div>
                    <div class="goal-actions">
                        <button class="btn-goal simulate" onclick="simulateGoal(${goal.id})"><i class="fas fa-calculator"></i></button>
                    </div>
                </div>
                <div class="goal-info">
                    <div class="goal-info-item"><label>Meta</label><p>${formatCurrency(goal.amount)}</p></div>
                    <div class="goal-info-item"><label>Economizado</label><p>${formatCurrency(goal.saved)}</p></div>
                    <div class="goal-info-item"><label>Faltam</label><p>${formatCurrency(remaining)}</p></div>
                    <div class="goal-info-item"><label>Dias</label><p>${isCompleted ? 'Concluída!' : stats.daysLeft > 0 ? `${stats.daysLeft}` : '-'}</p></div>
                </div>
                <div class="goal-progress">
                    <div class="goal-progress-label">
                        <span>${progress.toFixed(1)}%</span>
                        <span>${formatCurrency(goal.saved)} / ${formatCurrency(goal.amount)}</span>
                    </div>
                    <div class="goal-progress-bar">
                        <div class="goal-progress-fill" style="width:${progress}%">${progress >= 100 ? '✓' : `${progress.toFixed(0)}%`}</div>
                    </div>
                </div>
                <div class="goal-actions-row">
                    <button class="btn-goal add-savings" onclick="addSavingsToGoal(${goal.id})"><i class="fas fa-plus"></i> Economia</button>
                    <button class="btn-goal edit" onclick="editPersonalGoal(${goal.id})"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn-goal delete" onclick="deletePersonalGoal(${goal.id})"><i class="fas fa-trash"></i> Excluir</button>
                </div>
            </div>
        `;
    }).join('');
}

function calculateGoalStats(goal) {
    const remaining = goal.amount - goal.saved;
    if (remaining <= 0) return { daysLeft: 0, dailyNeeded: 0 };
    
    let dailyValue;
    if (goal.type === 'percentage') {
        const history = getHistory();
        let categoryAvg = 0;
        let count = 0;
        
        history.forEach(calc => {
            if (goal.category === 'needs') categoryAvg += calc.needsValue || 0;
            else if (goal.category === 'wants') categoryAvg += calc.wantsValue || 0;
            else if (goal.category === 'savings') categoryAvg += calc.savingsValue || 0;
            count++;
        });
        
        categoryAvg = count > 0 ? categoryAvg / count : (goal.category === 'needs' ? 100 : goal.category === 'wants' ? 60 : 40);
        dailyValue = (categoryAvg * goal.value) / 100;
    } else {
        dailyValue = goal.value;
    }
    
    const daysLeft = Math.ceil(remaining / dailyValue);
    return { daysLeft, dailyNeeded: remaining / daysLeft };
}

function updatePersonalGoalsDashboard() {
    const total = personalGoals.length;
    const completed = personalGoals.filter(g => g.amount - g.saved <= 0).length;
    const totalSavedValue = personalGoals.reduce((sum, g) => sum + g.saved, 0);
    
    const activeGoals = personalGoals.filter(g => g.amount - g.saved > 0);
    let nextGoalText = '-';
    
    if (activeGoals.length > 0) {
        const closest = activeGoals.reduce((closest, goal) => {
            const stats = calculateGoalStats(goal);
            if (!closest || stats.daysLeft < closest.daysLeft) return { goal, daysLeft: stats.daysLeft };
            return closest;
        }, null);
        
        if (closest && closest.daysLeft > 0) nextGoalText = `${closest.daysLeft}d`;
    }
    
    elements.totalGoals.textContent = total;
    elements.completedGoals.textContent = completed;
    elements.totalSavedEl.textContent = formatCurrency(totalSavedValue);
    elements.nextGoal.textContent = nextGoalText;
}

// ==================== METAS PADRÃO ====================
function updateGoals() {
    localStorage.setItem(`${STORAGE_KEY}_goals`, JSON.stringify({
        emergency: parseFloat(elements.emergencyGoal.value) || 0,
        investment: parseFloat(elements.investmentGoal.value) || 0,
        purchase: parseFloat(elements.purchaseGoal.value) || 0
    }));
}

function loadGoals() {
    const goals = JSON.parse(localStorage.getItem(`${STORAGE_KEY}_goals`) || '{}');
    if (goals.emergency) elements.emergencyGoal.value = goals.emergency;
    if (goals.investment) elements.investmentGoal.value = goals.investment;
    if (goals.purchase) elements.purchaseGoal.value = goals.purchase;
}

function saveSettings() {
    updateGoals();
    showToast('Configurações salvas!');
}

// ==================== ATUALIZAR PROGRESSO POR CATEGORIA ====================
function updateGoalProgress() {
    const history = getHistory();
    
    personalGoals.forEach(goal => goal.saved = 0);
    
    history.forEach(calculation => {
        personalGoals.forEach(goal => {
            if (goal.type === 'percentage') {
                let categoryValue = 0;
                if (goal.category === 'needs') categoryValue = calculation.needsValue || 0;
                else if (goal.category === 'wants') categoryValue = calculation.wantsValue || 0;
                else if (goal.category === 'savings') categoryValue = calculation.savingsValue || 0;
                
                goal.saved += (categoryValue * goal.value) / 100;
            }
        });
    });
    
    savePersonalGoalsToStorage();
}

// ==================== ALERTAS ====================
function generateAlerts(result) {
    const alerts = [];
    if (result.savingsPercent >= 20) {
        alerts.push({ type: 'success', icon: 'fa-check-circle', message: `Excelente! Economizando ${result.savingsPercent}%` });
    }
    if (result.wantsPercent > 30) {
        alerts.push({ type: 'warning', icon: 'fa-exclamation-triangle', message: 'Gastos com desejos elevados' });
    }
    displayAlerts(alerts);
}

function displayAlerts(alerts) {
    elements.alertContainer.innerHTML = alerts.map(alert => `
        <div class="alert ${alert.type}">
            <i class="fas ${alert.icon}"></i>
            <span>${alert.message}</span>
        </div>
    `).join('');
}

// ==================== HISTÓRICO ====================
function saveToHistory(result) {
    const history = getHistory();
    history.unshift(result);
    localStorage.setItem(`${STORAGE_KEY}_history`, JSON.stringify(history));
    renderHistory();
}

function getHistory() {
    return JSON.parse(localStorage.getItem(`${STORAGE_KEY}_history`) || '[]');
}

function renderHistory() {
    const history = getHistory();
    if (history.length === 0) {
        elements.historyList.innerHTML = '<p class="empty-message">Nenhum cálculo realizado</p>';
        return;
    }
    
    elements.historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-info">
                <h4>${formatDate(item.date)} - ${item.incomeType}</h4>
                <p><strong>Valor:</strong> ${formatCurrency(item.amount)}</p>
                <p><strong>Divisão:</strong> ${item.divisionMethod}</p>
                <p><strong>Necessidades:</strong> ${formatCurrency(item.needsValue)} | <strong>Desejos:</strong> ${formatCurrency(item.wantsValue)} | <strong>Investimentos:</strong> ${formatCurrency(item.savingsValue)}</p>
                ${item.description ? `<p><strong>Descrição:</strong> ${item.description}</p>` : ''}
            </div>
            <div class="history-actions">
                <button class="btn-icon" onclick="editItem(${item.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger" onclick="deleteItem(${item.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

window.editItem = function(id) {
    const item = getHistory().find(h => h.id === id);
    if (!item) return;
    
    editingId = id;
    elements.editAmount.value = item.amount;
    elements.editIncomeType.value = {'Diário':'daily','Semanal':'weekly','Quinzenal':'biweekly','Mensal':'monthly','Outro':'other'}[item.incomeType] || 'monthly';
    elements.editDescription.value = item.description || '';
    elements.editModal.classList.remove('hidden');
};

function saveEdit() {
    if (!editingId) return;
    
    const history = getHistory();
    const index = history.findIndex(h => h.id === editingId);
    history[index].amount = parseFloat(elements.editAmount.value);
    history[index].description = elements.editDescription.value;
    
    elements.amount.value = history[index].amount;
    elements.description.value = history[index].description;
    elements.incomeType.value = {'Diário':'daily','Semanal':'weekly','Quinzenal':'biweekly','Mensal':'monthly','Outro':'other'}[history[index].incomeType] || 'monthly';
    
    calculate();
    localStorage.setItem(`${STORAGE_KEY}_history`, JSON.stringify(history));
    elements.editModal.classList.add('hidden');
    showToast('Cálculo atualizado!');
}

window.deleteItem = function(id) {
    if (!confirm('Excluir este cálculo?')) return;
    const history = getHistory().filter(item => item.id !== id);
    localStorage.setItem(`${STORAGE_KEY}_history`, JSON.stringify(history));
    renderHistory();
    updateHomeScreen();
    updateMonthlyTotal();
};

function clearHistory() {
    if (!confirm('Limpar todo o histórico?')) return;
    localStorage.removeItem(`${STORAGE_KEY}_history`);
    renderHistory();
    updateHomeScreen();
    updateMonthlyTotal();
}

// ==================== EXPORTAR ====================
function copyResult() {
    if (!currentResult) return;
    const text = `📊 DIVISÃO DE GANHOS\n\n💰 Total: ${formatCurrency(currentResult.amount)}\n\n🏠 Necessidades: ${formatCurrency(currentResult.needsValue)} (${currentResult.needsPercent}%)\n🎉 Desejos: ${formatCurrency(currentResult.wantsValue)} (${currentResult.wantsPercent}%)\n💰 Investimentos: ${formatCurrency(currentResult.savingsValue)} (${currentResult.savingsPercent}%)\n\n✅ Distribuído: ${formatCurrency(currentResult.totalDistributed)}${currentResult.remaining > 0 ? `\n💵 Restante: ${formatCurrency(currentResult.remaining)}` : ''}`;
    
    navigator.clipboard.writeText(text).then(() => showToast('Copiado!')).catch(() => alert('Erro ao copiar'));
}

function shareWhatsApp() {
    if (!currentResult) return;
    const text = encodeURIComponent(`📊 *Divisão de Ganhos*\n\n💰 Total: ${formatCurrency(currentResult.amount)}\n\n🏠 Necessidades: ${formatCurrency(currentResult.needsValue)} (${currentResult.needsPercent}%)\n🎉 Desejos: ${formatCurrency(currentResult.wantsValue)} (${currentResult.wantsPercent}%)\n💰 Investimentos: ${formatCurrency(currentResult.savingsValue)} (${currentResult.savingsPercent}%)\n\n✅ Distribuído: ${formatCurrency(currentResult.totalDistributed)}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function exportPDF() {
    if (!currentResult) return;
    showToast('Preparando PDF...');
    setTimeout(() => window.print(), 500);
}

// ==================== UTILITÁRIOS ====================
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#10b981;color:white;padding:12px 24px;border-radius:25px;box-shadow:0 4px 12px rgba(0,0,0,0.3);z-index:10000;animation:slideInRight 0.3s ease;font-weight:600;font-size:0.9rem';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.animation = 'fadeIn 0.3s ease reverse'; setTimeout(() => toast.remove(), 300); }, 2500);
}

// ==================== LOCAL STORAGE ====================
function savePersonalGoalsToStorage() {
    localStorage.setItem(`${STORAGE_KEY}_personalGoals`, JSON.stringify(personalGoals));
}

function loadPersonalGoals() {
    const saved = localStorage.getItem(`${STORAGE_KEY}_personalGoals`);
    personalGoals = saved ? JSON.parse(saved) : [];
    renderPersonalGoals();
    updatePersonalGoalsDashboard();
}

// ==================== PRINT STYLES ====================
const printStyles = document.createElement('style');
printStyles.textContent = `@media print { body { background: white !important; } .bottom-nav, .theme-toggle, .btn-add, .action-buttons, .goal-actions-row, .history-actions { display: none !important; } .screen { display: block !important; } }`;
document.head.appendChild(printStyles);