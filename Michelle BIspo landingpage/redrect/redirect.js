/**
 * Sistema de Detecção e Redirecionamento Automático
 * Michelle Bispo Imóveis - Aracaju/SE
 * Versão: 1.0
 */

(function() {
    'use strict';
    
    // Configurações
    const CONFIG = {
        desktopPath: '/desktop/index.html',
        mobilePath: '/mobile/index.html',
        mobileBreakpoint: 768,
        enableLogs: false
    };
    
    // Detecção robusta de dispositivo
    function detectDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        // Dispositivos móveis
        const mobileDevices = [
            /android/, /webos/, /iphone/, /ipad/, /ipod/,
            /blackberry/, /windows phone/, /mobile/, /tablet/,
            /samsung/, /huawei/, /xiaomi/, /oppo/, /vivo/,
            /realme/, /oneplus/, /nokia/, /sony/, /lg/
        ];
        
        // Tablets
        const tabletDevices = [
            /ipad/, /tablet/, /kindle/, /silk/
        ];
        
        // Verifica se é mobile por userAgent
        const isMobileByAgent = mobileDevices.some(device => userAgent.match(device));
        
        // Verifica se é tablet
        const isTablet = tabletDevices.some(device => userAgent.match(device));
        
        // Verifica por tamanho de tela (fallback)
        const isMobileBySize = window.innerWidth <= CONFIG.mobileBreakpoint;
        
        // Lógica final de detecção
        if (isMobileByAgent || isTablet || isMobileBySize) {
            return 'mobile';
        }
        
        return 'desktop';
    }
    
    // Redirecionamento suave
    function redirectToVersion() {
        const deviceType = detectDevice();
        const targetPath = deviceType === 'mobile' ? CONFIG.mobilePath : CONFIG.desktopPath;
        
        // Previne flash de conteúdo
        document.documentElement.style.opacity = '0';
        
        if (CONFIG.enableLogs) {
            console.log(`📱 Dispositivo detectado: ${deviceType}`);
            console.log(`🎯 Redirecionando para: ${targetPath}`);
        }
        
        // Redirecionamento
        setTimeout(() => {
            window.location.href = targetPath;
        }, 100);
    }
    
    // Inicialização
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', redirectToVersion);
    } else {
        redirectToVersion();
    }
    
    // Fallback para erros
    window.addEventListener('error', () => {
        setTimeout(() => {
            window.location.href = CONFIG.desktopPath;
        }, 2000);
    });
    
})();