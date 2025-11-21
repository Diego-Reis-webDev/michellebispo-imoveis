/**
 * Michelle Bispo Imóveis - Script Mobile
 * Design mobile-first exclusivo
 * Otimizado para: 360px, 375px, 390px, 412px
 * Compatível: Chrome Mobile, Safari Mobile, Samsung Browser
 * Versão: 1.0
 */

// ===== CONFIGURAÇÕES MOBILE =====
const CONFIG = {
    performance: {
        lazyLoadThreshold: 0.1,
        debounceDelay: 100,
        throttleDelay: 200
    },
    animations: {
        enabled: true,
        scrollOffset: 50
    },
    touch: {
        swipeThreshold: 50,
        longPressDelay: 500
    }
};

// ===== GERENCIAMENTO DE ESTADO MOBILE =====
const state = {
    isMenuOpen: false,
    scrollPosition: 0,
    touchStart: { x: 0, y: 0 },
    lastClick: 0,
    currentSection: 'home'
};

// ===== INICIALIZAÇÃO MOBILE =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Michelle Bispo Imóveis - Mobile inicializado');
    
    // Inicializar componentes
    initializeMobileComponents();
    
    // Configurar event listeners
    setupMobileEventListeners();
    
    // Otimizações de performance
    optimizeMobilePerformance();
    
    // Analytics e tracking
    setupMobileAnalytics();
});

// ===== INICIALIZAÇÃO DE COMPONENTES MOBILE =====
function initializeMobileComponents() {
    initMobileMenu();
    initSmoothScrolling();
    initLazyLoading();
    initTouchGestures();
    initIntersectionObserver();
    initPerformanceMonitoring();
}

// ===== CONFIGURAÇÃO DE EVENT LISTENERS MOBILE =====
function setupMobileEventListeners() {
    setupClickTracking();
    setupScrollEffects();
    setupOrientationHandler();
    setupNetworkStatus();
    setupBackButtonHandler();
}

// ===== MENU MOBILE =====
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const navOverlay = document.querySelector('.nav-overlay');
    const navClose = document.querySelector('.nav-close');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuToggle || !mobileNav) return;

    function toggleMenu() {
        state.isMenuOpen = !state.isMenuOpen;
        
        // Atualizar ARIA
        menuToggle.setAttribute('aria-expanded', state.isMenuOpen);
        mobileNav.setAttribute('aria-hidden', !state.isMenuOpen);
        
        // Animações
        if (state.isMenuOpen) {
            mobileNav.style.right = '0';
            navOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Adicionar evento de tecla ESC
            document.addEventListener('keydown', handleEscapeKey);
        } else {
            mobileNav.style.right = '-100%';
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Remover evento de tecla ESC
            document.removeEventListener('keydown', handleEscapeKey);
        }
        
        // Prevenir double tap zoom
        preventDoubleTapZoom();
    }

    function handleEscapeKey(e) {
        if (e.key === 'Escape' && state.isMenuOpen) {
            toggleMenu();
        }
    }

    function closeMenuOnLinkClick() {
        if (state.isMenuOpen) {
            toggleMenu();
        }
    }

    // Event listeners
    menuToggle.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);
    navClose.addEventListener('click', toggleMenu);
    
    // Fechar menu ao clicar nos links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenuOnLinkClick);
    });

    // Swipe para fechar
    setupSwipeToClose(mobileNav);
}

// ===== SWIPE TO CLOSE =====
function setupSwipeToClose(element) {
    let startX = 0;
    let currentX = 0;

    element.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        currentX = startX;
    }, { passive: true });

    element.addEventListener('touchmove', (e) => {
        if (!state.isMenuOpen) return;
        
        currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        
        // Swipe para a direita para fechar
        if (diff < -50) {
            document.querySelector('.menu-toggle').click();
        }
    }, { passive: true });
}

// ===== SCROLL SUAVE MOBILE =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
            const targetElement = document.querySelector(href);
            if (!targetElement) return;
            
            e.preventDefault();
            
            // Calcular posição considerando header mobile
            const headerHeight = document.querySelector('.mobile-header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            // Scroll suave com performance
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Atualizar estado da seção atual
            updateCurrentSection(href.substring(1));
        });
    });
}

// ===== LAZY LOADING MOBILE OTIMIZADO =====
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const lazyBackgrounds = document.querySelectorAll('[data-bg]');
    
    // Lazy loading para imagens
    if ('loading' in HTMLImageElement.prototype) {
        // Suporte nativo
        lazyImages.forEach(img => {
            img.classList.add('lazy');
            
            const handleLoad = () => {
                img.classList.add('loaded');
                img.removeEventListener('load', handleLoad);
            };
            
            if (img.complete) {
                handleLoad();
            } else {
                img.addEventListener('load', handleLoad);
            }
        });
    } else {
        // Fallback com Intersection Observer
        const lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    lazyImageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        lazyImages.forEach(img => {
            img.dataset.src = img.src;
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMSAxIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlNWU1Ii8+PC9zdmc+';
            lazyImageObserver.observe(img);
        });
    }
    
    // Lazy loading para backgrounds
    const lazyBackgroundObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.backgroundImage = `url(${entry.target.dataset.bg})`;
                lazyBackgroundObserver.unobserve(entry.target);
            }
        });
    });

    lazyBackgrounds.forEach(bg => {
        lazyBackgroundObserver.observe(bg);
    });
}

// ===== GESTOS TOUCH =====
function initTouchGestures() {
    // Prevenir zoom duplo rápido
    let lastTouchEnd = 0;
    
    document.addEventListener('touchend', function(e) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
    
    // Swipe entre seções (opcional)
    setupHorizontalSwipes();
}

function setupHorizontalSwipes() {
    let startX = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Apenas considerar swipe horizontal significativo
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > CONFIG.touch.swipeThreshold) {
            if (diffX > 0) {
                // Swipe left - próxima seção
                navigateSections('next');
            } else {
                // Swipe right - seção anterior
                navigateSections('prev');
            }
        }
        
        startX = 0;
        startY = 0;
    }, { passive: true });
}

function navigateSections(direction) {
    const sections = ['home-mobile', 'services-mobile', 'about-mobile', 'featured-mobile', 'contact-mobile'];
    const currentIndex = sections.indexOf(state.currentSection);
    
    let nextIndex;
    if (direction === 'next') {
        nextIndex = currentIndex < sections.length - 1 ? currentIndex + 1 : 0;
    } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : sections.length - 1;
    }
    
    const nextSection = document.getElementById(sections[nextIndex]);
    if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
        updateCurrentSection(sections[nextIndex]);
    }
}

// ===== OBSERVADOR DE INTERSEÇÃO MOBILE =====
function initIntersectionObserver() {
    if (!CONFIG.animations.enabled) return;
    
    const observerOptions = {
        threshold: CONFIG.performance.lazyLoadThreshold,
        rootMargin: `0px 0px ${CONFIG.animations.scrollOffset}px 0px`
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animar elementos quando entram na viewport
                animateOnScroll(entry.target);
                
                // Atualizar seção atual para navegação
                if (entry.target.id) {
                    updateCurrentSection(entry.target.id);
                }
            }
        });
    }, observerOptions);

    // Observar seções e elementos animáveis
    const sections = document.querySelectorAll('section');
    const animatedElements = document.querySelectorAll('.service-card, .property-card, .contact-card');
    
    sections.forEach(section => observer.observe(section));
    animatedElements.forEach(el => observer.observe(el));
}

function animateOnScroll(element) {
    element.style.animation = 'fadeInUp 0.6s ease-out forwards';
}

function updateCurrentSection(sectionId) {
    state.currentSection = sectionId;
    
    // Atualizar links ativos no menu
    updateActiveMenuLink(sectionId);
}

function updateActiveMenuLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    const cleanSectionId = sectionId.replace('-mobile', '');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href').replace('#', '');
        if (href === cleanSectionId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ===== OTIMIZAÇÕES DE PERFORMANCE MOBILE =====
function optimizeMobilePerformance() {
    // Preload de recursos críticos
    preloadCriticalResources();
    
    // Otimizar animações
    optimizeAnimations();
    
    // Gerenciamento de memória
    setupMemoryManagement();
}

function preloadCriticalResources() {
    const criticalImages = [
        'img/logo-michelle.png',
        'img/MIchelle.png'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

function optimizeAnimations() {
    // Forçar hardware acceleration
    const animatedElements = document.querySelectorAll('.service-card, .property-card, .btn');
    animatedElements.forEach(el => {
        el.style.transform = 'translateZ(0)';
    });
}

function setupMemoryManagement() {
    // Cleanup de event listeners quando necessário
    window.addEventListener('beforeunload', () => {
        // Cleanup resources
        const observers = [];
        observers.forEach(observer => observer.disconnect());
    });
}

// ===== MONITORAMENTO DE PERFORMANCE =====
function initPerformanceMonitoring() {
    // Monitorar Core Web Vitals
    monitorCoreWebVitals();
    
    // Monitorar interações do usuário
    monitorUserInteractions();
}

function monitorCoreWebVitals() {
    // LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('📊 LCP:', lastEntry.startTime);
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
            const delay = entry.processingStart - entry.startTime;
            console.log('📊 FID:', delay);
        });
    });
    fidObserver.observe({ type: 'first-input', buffered: true });
}

// ===== TRACKING DE INTERAÇÕES =====
function setupClickTracking() {
    // Track WhatsApp clicks
    const whatsappButtons = document.querySelectorAll('.btn-whatsapp, .whatsapp-float');
    
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonContext = this.closest('section')?.id || 'floating';
            trackWhatsAppClick(buttonContext);
        });
    });
    
    // Track property interest
    const propertyButtons = document.querySelectorAll('.property-contact');
    propertyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const propertyTitle = this.closest('.property-card')?.querySelector('.property-title')?.textContent;
            trackPropertyInterest(propertyTitle);
        });
    });
}

function trackWhatsAppClick(context) {
    const eventData = {
        event: 'whatsapp_click',
        context: context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`
    };
    
    console.log('📱 WhatsApp Click:', eventData);
    
    // Aqui você pode enviar para Google Analytics ou outro sistema
    if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', eventData);
    }
}

function trackPropertyInterest(propertyTitle) {
    const eventData = {
        event: 'property_interest',
        property: propertyTitle,
        timestamp: new Date().toISOString()
    };
    
    console.log('🏠 Property Interest:', eventData);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'property_interest', eventData);
    }
}

// ===== EFEITOS DE SCROLL =====
function setupScrollEffects() {
    let ticking = false;
    
    function updateOnScroll() {
        const header = document.querySelector('.mobile-header');
        const scrollY = window.scrollY;
        
        // Header background on scroll
        if (scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
        }
        
        // Parallax effect no hero
        const hero = document.querySelector('.mobile-hero');
        if (hero && scrollY < window.innerHeight) {
            const scrolled = scrollY / window.innerHeight;
            hero.style.transform = `translateY(${scrolled * 50}px)`;
        }
        
        ticking = false;
    }
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
}

// ===== MANIPULADOR DE ORIENTAÇÃO =====
function setupOrientationHandler() {
    window.addEventListener('orientationchange', function() {
        // Aguardar a rotação completar
        setTimeout(() => {
            console.log('🔄 Orientation changed:', screen.orientation.type);
            
            // Ajustar layouts específicos se necessário
            adjustLayoutForOrientation();
        }, 300);
    });
}

function adjustLayoutForOrientation() {
    const isLandscape = window.innerWidth > window.innerHeight;
    
    if (isLandscape) {
        document.body.classList.add('landscape');
    } else {
        document.body.classList.remove('landscape');
    }
}

// ===== STATUS DA REDE =====
function setupNetworkStatus() {
    function updateNetworkStatus() {
        const isOnline = navigator.onLine;
        
        if (!isOnline) {
            showOfflineMessage();
        } else {
            hideOfflineMessage();
        }
    }
    
    function showOfflineMessage() {
        // Implementar mensagem offline se necessário
        console.log('📶 Offline mode');
    }
    
    function hideOfflineMessage() {
        console.log('📶 Online mode');
    }
    
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    updateNetworkStatus();
}

// ===== MANIPULADOR DE BOTÃO VOLTAR =====
function setupBackButtonHandler() {
    let backButtonPressed = false;
    
    function handleBackButton(e) {
        if (state.isMenuOpen) {
            e.preventDefault();
            document.querySelector('.menu-toggle').click();
            backButtonPressed = true;
            
            setTimeout(() => {
                backButtonPressed = false;
            }, 1000);
        }
    }
    
    // Para Android
    document.addEventListener('backbutton', handleBackButton, false);
    
    // Para navegadores mobile
    window.addEventListener('popstate', function(e) {
        if (state.isMenuOpen && !backButtonPressed) {
            e.preventDefault();
            document.querySelector('.menu-toggle').click();
        }
    });
}

// ===== ANALYTICS MOBILE =====
function setupMobileAnalytics() {
    // Pageview virtual para SPA-like behavior
    trackVirtualPageview();
    
    // Performance metrics
    trackPerformanceMetrics();
}

function trackVirtualPageview() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'id') {
                const sectionId = mutation.target.id;
                if (sectionId && sectionId.includes('-mobile')) {
                    console.log('📄 Virtual Pageview:', sectionId);
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('config', 'GA_MEASUREMENT_ID', {
                            page_title: sectionId,
                            page_location: window.location.href + '#' + sectionId
                        });
                    }
                }
            }
        });
    });
    
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section, { attributes: true });
    });
}

function trackPerformanceMetrics() {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            const domReady = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
            
            console.log('⚡ Performance Metrics:', {
                loadTime: `${loadTime}ms`,
                domReady: `${domReady}ms`,
                memory: performance.memory ? `${Math.round(performance.memory.usedJSHeapSize / 1048576)}MB` : 'N/A'
            });
        }, 0);
    });
}

// ===== UTILITÁRIOS MOBILE =====
function preventDoubleTapZoom() {
    let lastTap = 0;
    
    document.addEventListener('touchend', function(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < 500 && tapLength > 0) {
            e.preventDefault();
        }
        
        lastTap = currentTime;
    }, { passive: false });
}

function monitorUserInteractions() {
    let interactionStart = Date.now();
    
    document.addEventListener('touchstart', () => {
        interactionStart = Date.now();
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
        const interactionTime = Date.now() - interactionStart;
        
        if (interactionTime > 1000) {
            console.log('⏱️ Long interaction:', interactionTime + 'ms');
        }
    }, { passive: true });
}

// ===== SERVICE WORKER PARA OFFLINE SUPPORT =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw-mobile.js')
            .then(function(registration) {
                console.log('✅ ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('❌ ServiceWorker registration failed');
            });
    });
}

// ===== EXPORTAÇÕES PARA DEBUG =====
window.MichelleBispoMobile = {
    state,
    CONFIG,
    trackWhatsAppClick,
    trackPropertyInterest
};

console.log('🚀 Michelle Bispo Mobile carregado com sucesso!');