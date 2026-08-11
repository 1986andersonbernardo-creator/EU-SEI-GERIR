// ==================== BANNER DE ANÚNCIO (ADMOB) ====================
// Componente BannerAd — isolado da lógica financeira do aplicativo.
// Preparado para integração com Google AdMob (Cordova/Capacitor) ou
// APIs web equivalentes. Durante o desenvolvimento, utiliza IDs de TESTE.
//
// Nunca usar IDs de produção em ambiente de desenvolvimento.
// O sistema financeiro NUNCA depende do carregamento ou falha do anúncio.

// ==================== CONFIGURAÇÃO DE ANÚNCIOS ====================

const AD_CONFIG = {
    // Master switch — ativar/desativar anúncios globalmente
    showAds: true,

    // Usuários PRO não veem anúncios
    isProUser: false,

    // Estado de desenvolvimento — mostra placeholder visual discreto
    // quando o AdMob não está disponível (navegador web)
    devMode: false,

    // ID de unidade de banner — MODO TESTE (Google AdMob)
    // Este ID é fornecido pelo Google para testes. Nunca usar em produção.
    adUnitId: 'ca-app-pub-3940-6253984401-6268459739',

    // Substituir pelo ID real de produção quando for lançar
    productionAdUnitId: '',

    // Altura mínima do banner em pixels
    bannerMinHeight: 50,

    // Altura máxima do banner em pixels
    bannerMaxHeight: 90,

    // Colapsar banner quando não houver anúncio (evita espaço vazio)
    collapsible: true,

    // Timeout de carregamento em milissegundos
    loadTimeout: 5000
};

// Exportar configuração global
window.AD_CONFIG = AD_CONFIG;

// ==================== COMPONENTE BANNERAD ====================

/**
 * BannerAd — Componente reutilizável para exibição de banners de anúncios.
 *
 * Características:
 * - Isolamento total da lógica financeira
 * - Estados: loading, loaded, error, hidden, dev
 * - Tratamento de erro: sem mensagens ao usuário, colapsa silenciosamente
 * - Responsivo: mobile, tablet, desktop
 * - Suporte a AdMob (Cordova/Capacitor) e fallback para web
 * - IDs de teste separados de IDs de produção
 */
class BannerAd {
    /**
     * @param {string} containerId - ID do elemento container no HTML
     * @param {object} config - Configuração de anúncios (opcional, usa AD_CONFIG por padrão)
     */
    constructor(containerId, config = null) {
        this.containerId = containerId;
        this.config = config || AD_CONFIG;
        this.container = null;
        this.adElement = null;
        this.isLoaded = false;
        this.isLoading = false;
        this.isDestroyed = false;
    }

    // ==================== INICIALIZAÇÃO ====================

    /**
     * Inicializa o banner de anúncios.
     * Verifica configurações (showAds, isProUser) e cria o container DOM.
     *
     * @returns {boolean} true se o banner foi inicializado, false se ocultado
     */
    init() {
        // Verificar se deve mostrar anúncios
        if (!this.config.showAds || this.config.isProUser) {
            this.hide();
            return false;
        }

        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.warn('[BannerAd] Container não encontrado:', this.containerId);
            return false;
        }

        this._createBannerElement();
        this._loadAd();

        return true;
    }

    // ==================== RENDERIZAÇÃO ====================

    /**
     * Cria o elemento DOM do banner.
     * Estado inicial: loading (mostra placeholder sutil se devMode estiver ativo).
     */
    _createBannerElement() {
        // Limpa conteúdo existente
        this.container.innerHTML = '';

        // Wrapper do banner
        const wrapper = document.createElement('div');
        wrapper.className = 'ad-banner-wrapper';
        wrapper.setAttribute('data-ad-state', 'loading');
        wrapper.setAttribute('role', 'region');
        wrapper.setAttribute('aria-label', 'Espaço para anúncio');

        // Inner — área onde o anúncio é renderizado pelo SDK AdMob
        const adInner = document.createElement('div');
        adInner.className = 'ad-banner-inner';

        wrapper.appendChild(adInner);
        this.container.appendChild(wrapper);

        this.adElement = wrapper;

        // Ativar o container (torna visible com transição)
        this.container.classList.add('ad-banner-container--active');
    }

    // ==================== CARREGAMENTO -------------------

    /**
     * Tenta carregar o anúncio via plugin AdMob ou API web.
     * Detecta o ambiente e escolhe a estratégia apropriada.
     */
    _loadAd() {
        if (this.isLoading || this.isDestroyed) return;
        this.isLoading = true;

        this._setState('loading');

        // Detectar ambiente e escolher estratégia
        if (this._isAdMobAvailable()) {
            this._loadAdMobBanner();
        } else if (this._isAdSenseAvailable()) {
            this._loadAdSenseBanner();
        } else {
            // Web sem SDK de anúncios — estado neutro
            this._handleNoAdAvailable();
        }
    }

    /**
     * Verifica se o plugin AdMob está disponível (Cordova/Capacitor).
     * @returns {boolean}
     */
    _isAdMobAvailable() {
        return (
            typeof window !== 'undefined' &&
            (window.AdMob || window.admob || window.Capacitor)
        );
    }

    /**
     * Verifica se o AdSense está disponível (web).
     * @returns {boolean}
     */
    _isAdSenseAvailable() {
        return (
            typeof window !== 'undefined' &&
            (typeof adsbygoogle !== 'undefined' || window.adsbygoogle)
        );
    }

    /**
     * Carrega banner usando o plugin AdMob nativo.
     */
    _loadAdMobBanner() {
        try {
            const AdMob = window.AdMob || window.admob;
            if (!AdMob) {
                this._handleNoAdAvailable();
                return;
            }

            const adUnitId = this.config.productionAdUnitId || this.config.adUnitId;

            // Usar API do plugin AdMob
            if (typeof AdMob.banner === 'object' && AdMob.banner) {
                // cordova-plugin-admob-free ou similar
                AdMob.banner.prepare({
                    adUnitId: adUnitId
                });
                AdMob.banner.show();

                this._setState('loaded');
                this.isLoaded = true;
            } else if (typeof AdMob.showBanner === 'function') {
                // API mais antiga
                AdMob.showBanner(adUnitId);
                this._setState('loaded');
                this.isLoaded = true;
            } else {
                this._handleNoAdAvailable();
            }
        } catch (e) {
            console.warn('[BannerAd] Erro ao carregar AdMob:', e);
            this._onLoadFailure();
        }
    }

    /**
     * Carrega banner via Google AdSense (web).
     * Usa o carregamento assíncrono padrão do AdSense.
     */
    _loadAdSenseBanner() {
        try {
            const ins = document.createElement('ins');
            ins.className = 'adsbygoogle';
            ins.style.display = 'block';
            ins.style.width = '100%';
            ins.setAttribute('data-ad-client', this.config.adUnitId);
            ins.setAttribute('data-ad-slot', this.config.adUnitId);

            this.adElement.querySelector('.ad-banner-inner').appendChild(ins);

            // Trigger AdSense load
            if (typeof adsbygoogle !== 'undefined') {
                (adsbygoogle = window.adsbygoogle || []).push({});
            }

            this._setState('loaded');
            this.isLoaded = true;
        } catch (e) {
            console.warn('[BannerAd] Erro ao carregar AdSense:', e);
            this._onLoadFailure();
        }
    }

    // ==================== ESTADOS ====================

    /**
     * Define o estado visual do banner.
     * @param {string} state - 'loading' | 'loaded' | 'error' | 'dev'
     */
    _setState(state) {
        if (!this.adElement || this.isDestroyed) return;
        this.adElement.setAttribute('data-ad-state', state);
    }

    /**
     * Manipula o caso onde nenhum SDK de anúncio está disponível.
     * Em devMode, mostra placeholder discreto.
     * Caso contrário, colapsa silenciosamente.
     */
    _handleNoAdAvailable() {
        this.isLoading = false;

        if (this.config.devMode) {
            this._setState('dev');
        } else {
            // Sem SDK disponível — colapsa silenciosamente
            this.hide();
        }
    }

    /**
     * Callback quando o anúncio falha ao carregar.
     * NÃO mostra erro ao usuário — colapsa o espaço silenciosamente.
     */
    _onLoadFailure() {
        this.isLoading = false;
        this.isLoaded = false;

        // Se collapsável, colapsa gradualmente; caso contrário, esconde
        if (this.config.collapsible) {
            this._setState('error');
            setTimeout(() => {
                if (!this.isDestroyed) {
                    this.hide();
                }
            }, 300);
        } else {
            this.hide();
        }
    }

    // ==================== CONTROLE DE VISIBILIDADE ====================

    /**
     * Oculta totalmente o banner e remove o espaço ocupado.
     */
    hide() {
        if (this.container) {
            this.container.classList.remove('ad-banner-container--active');
            this.container.classList.add('ad-banner-container--hidden');
        }
        this.isLoaded = false;
    }

    /**
     * Mostra o banner (usar após hide() ou quando showAds muda para true).
     */
    show() {
        if (this.isDestroyed) return;

        if (!this.container) {
            const c = document.getElementById(this.containerId);
            if (c) {
                c.classList.remove('ad-banner-container--hidden');
                c.classList.add('ad-banner-container--active');
            }
        } else {
            this.container.classList.remove('ad-banner-container--hidden');
            this.container.classList.add('ad-banner-container--active');
        }

        this._loadAd();
    }

    /**
     * Atualiza a configuração (ex: ativar/desativar anúncios, alternar PRO).
     * @param {object} newConfig - Novas configurações a mesclar
     */
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);

        if (!newConfig.showAds || newConfig.isProUser) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Força o recarregamento do anúncio.
     */
    refresh() {
        if (this.isLoaded) {
            this._loadAd();
        }
    }

    /**
     * Destrói o banner e limpa todos os recursos.
     * Chamar quando o componente não for mais necessário.
     */
    destroy() {
        this.isDestroyed = true;
        this.isLoading = false;
        this.isLoaded = false;

        // Remover banner AdMob nativo se existir
        if (window.AdMob && typeof window.AdMob.banner?.remove === 'function') {
            try {
                window.AdMob.banner.remove();
            } catch (e) {
                // Silencioso
            }
        }

        // Limpar container
        if (this.container) {
            this.container.classList.remove('ad-banner-container--active');
            this.container.classList.add('ad-banner-container--hidden');
            this.container.innerHTML = '';
        }

        this.adElement = null;
        this.container = null;
    }
}

// Exportar para uso global (seguindo o padrão do projeto)
window.BannerAd = BannerAd;
