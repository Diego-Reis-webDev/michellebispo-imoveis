/**
 * Michelle Bispo Imóveis - Script Desktop
 * Otimizado para desktops: 1366px, 1440px, 1680px, 1920px
 * Compatível: Chrome, Edge, Firefox
 * Versão: 1.0
 */

// ===== CONFIGURAÇÕES GLOBAIS =====
const CONFIG = {
    carousel: {
        autoSlideInterval: 6000,
        transitionDuration: 800
    },
    animations: {
        enabled: true,
        threshold: 0.1
    }
};

// ===== GERENCIAMENTO DE ESTADO =====
const state = {
    currentSlide: 0,
    totalSlides: 3,
    autoSlideInterval: null,
    isMenuOpen: false,
    scrollPosition: 0
};

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Michelle Bispo Imóveis - Desktop inicializado');
    
    initializeComponents();
    setupEventListeners();
    startAutoSlide();
    
    // Otimização de carregamento
    handleLoadingPerformance();
});

// ===== INICIALIZAÇÃO DE COMPONENTES =====
function initializeComponents() {
    initIntersectionObserver();
    initLazyLoading();
    initSmoothScrolling();
    initHeaderScroll();
}

// ===== CONFIGURAÇÃO DE EVENT LISTENERS =====
function setupEventListeners() {
    setupCarousel();
    setupWhatsAppTracking();
    setupPerformanceMonitoring();
}

// ===== CARROSSEL DESKTOP =====
function setupCarousel() {
    const carouselTrack = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const slides = document.querySelectorAll('.carousel-slide');

    if (!carouselTrack) return;

    function goToSlide(slideIndex) {
        if (slideIndex < 0) slideIndex = state.totalSlides - 1;
        if (slideIndex >= state.totalSlides) slideIndex = 0;
        
        state.currentSlide = slideIndex;
        
        // Transição suave com performance
        carouselTrack.style.transition = `transform ${CONFIG.carousel.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        carouselTrack.style.transform = `translateX(-${state.currentSlide * 100}%)`;
        
        // Atualizar ARIA para acessibilidade
        updateSlideAccessibility();
        
        // Reiniciar animação do conteúdo
        restartSlideAnimation();
    }

    function nextSlide() {
        goToSlide(state.currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(state.currentSlide - 1);
    }

    function updateSlideAccessibility() {
        slides.forEach((slide, index) => {
            const isActive = index === state.currentSlide;
            slide.setAttribute('aria-hidden', !isActive);
            
            if (isActive) {
                slide.removeAttribute('inert');
            } else {
                slide.setAttribute('inert', '');
            }
        });
    }

    function restartSlideAnimation() {
        const currentSlide = slides[state.currentSlide];
        const currentContent = currentSlide.querySelector('.slide-content');
        
        if (currentContent) {
            currentContent.style.animation = 'none';
            // Forçar reflow
            void currentContent.offsetWidth;
            currentContent.style.animation = 'fadeInUp 1s ease-out 0.5s forwards';
        }
    }

    // Event listeners otimizados
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Pausar carrossel no hover
    const carousel = document.querySelector('.banner-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
    }
}

// ===== AUTO SLIDE =====
function startAutoSlide() {
    stopAutoSlide(); // Limpar intervalo existente
    
    state.autoSlideInterval = setInterval(() => {
        const nextSlide = state.currentSlide + 1 >= state.totalSlides ? 0 : state.currentSlide + 1;
        goToSlide(nextSlide);
    }, CONFIG.carousel.autoSlideInterval);
}

function stopAutoSlide() {
    if (state.autoSlideInterval) {
        clearInterval(state.autoSlideInterval);
        state.autoSlideInterval = null;
    }
}

// ===== HEADER SCROLL =====
function initHeaderScroll() {
    const header = document.getElementById('mainHeader');
    let lastScrollY = window.scrollY;
    let ticking = false;

    if (!header) return;

    function updateHeader() {
        const scrolled = window.scrollY > 100;
        
        if (scrolled) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Esconder/mostrar header no scroll
        if (window.scrollY > lastScrollY && window.scrollY > 200) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        
        lastScrollY = window.scrollY;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
}

// ===== SCROLL SUAVE OTIMIZADO =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
            const targetElement = document.querySelector(href);
            if (!targetElement) return;
            
            e.preventDefault();
            
            const headerHeight = document.querySelector('header')?.offsetHeight || 0;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ===== OBSERVADOR DE INTERSEÇÃO PARA ANIMAÇÕES =====
function initIntersectionObserver() {
    if (!CONFIG.animations.enabled) return;
    
    const observerOptions = {
        threshold: CONFIG.animations.threshold,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Otimização: desconectar após animação
                if (entry.target.dataset.animateOnce !== 'false') {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    // Elementos para animar
    const animatedElements = document.querySelectorAll(
        '.service-card, .property-card, .feature-item, .contact-item'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ===== LAZY LOADING AVANÇADO =====
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Navegador suporta lazy loading nativo
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
        // Fallback para Intersection Observer
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    lazyObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            img.dataset.src = img.src;
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMSAxIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlNWU1Ii8+PC9zdmc+';
            lazyObserver.observe(img);
        });
    }
}

// ===== PERFORMANCE E MONITORAMENTO =====
function handleLoadingPerformance() {
    // Remover tela de carregamento
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }
        }, 1000);
    });

    // Preload de recursos críticos
    preloadCriticalResources();
}

function preloadCriticalResources() {
    const criticalImages = [
        'img/logo-michelle.png',
        'img/MIchelle.png',
        'img/compra.png',
        'img/venda.png',
        'img/investidora.png'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

function setupPerformanceMonitoring() {
    // Monitorar CLS (Cumulative Layout Shift)
    let clsValue = 0;
    
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
                clsValue += entry.value;
            }
        }
    });

    observer.observe({ type: 'layout-shift', buffered: true });

    // Log de performance (apenas em desenvolvimento)
    if (window.location.hostname === 'localhost') {
        window.addEventListener('load', () => {
            setTimeout(() => {
                console.log('📊 Performance Metrics:', {
                    cls: clsValue.toFixed(4),
                    ready: document.readyState,
                    loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart
                });
            }, 1000);
        });
    }
}

// ===== WHATSAPP TRACKING =====
function setupWhatsAppTracking() {
    const whatsappButtons = document.querySelectorAll('.btn-whatsapp');
    
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            const buttonContext = this.closest('.service-card, .property-card, .hero-buttons') ? 
                                this.closest('.service-card, .property-card, .hero-buttons').querySelector('h3, h1')?.textContent : 'Geral';
            
            // Aqui você pode integrar com Google Analytics ou outro sistema de tracking
            console.log('📱 WhatsApp Click:', {
                context: buttonContext,
                buttonText: buttonText,
                timestamp: new Date().toISOString()
            });
            
            // O link do WhatsApp já está no HTML, então deixamos o comportamento padrão
        });
    });
}

// ===== UTILITÁRIOS GLOBAIS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== EXPORTAÇÕES PARA USO GLOBAL =====
window.MichelleBispoDesktop = {
    goToSlide,
    startAutoSlide,
    stopAutoSlide,
    config: CONFIG
};

// ===== FALLBACKS E TRATAMENTO DE ERROS =====
window.addEventListener('error', (e) => {
    console.error('❌ Erro capturado:', e.error);
});

// Service Worker para cache (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registrado:', registration);
            })
            .catch(error => {
                console.log('❌ Falha no Service Worker:', error);
            });
    });
}