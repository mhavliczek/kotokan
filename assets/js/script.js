/* =============================
   Club Judo Kotokan - JavaScript
   ============================= */

// ======================================
// 1. Configuración y Estado Global
// ======================================
const AppState = {
    isMobileMenuOpen: false,
    currentSection: 'inicio',
    scrollY: 0,
    isScrolling: false
};

// ======================================
// 2. Inicialización de la Aplicación
// ======================================
document.addEventListener('DOMContentLoaded', () => {
    initMobileNavigation();
    initScrollEffects();
    initSmoothScrolling();
    initScrollAnimations();
    initFormHandling();
    initNavigationHighlight();
    console.log('🏋️ Club Judo Kotokan - Landing page inicializada correctamente');
});

// ======================================
// 3. Navegación Móvil
// ======================================
function initMobileNavigation() {
    const menuToggle = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    if (!menuToggle || !navList) return;
    
    menuToggle.addEventListener('click', () => {
        toggleMobileMenu(menuToggle, navList);
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (AppState.isMobileMenuOpen) {
                toggleMobileMenu(menuToggle, navList);
            }
        });
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && AppState.isMobileMenuOpen) {
            toggleMobileMenu(menuToggle, navList);
        }
    });
    
    document.addEventListener('click', (event) => {
        if (AppState.isMobileMenuOpen && 
            !navList.contains(event.target) && 
            !menuToggle.contains(event.target)) {
            toggleMobileMenu(menuToggle, navList);
        }
    });
}

function toggleMobileMenu(menuToggle, navList) {
    AppState.isMobileMenuOpen = !AppState.isMobileMenuOpen;
    
    menuToggle.setAttribute('aria-expanded', AppState.isMobileMenuOpen);
    navList.classList.toggle('active', AppState.isMobileMenuOpen);
    document.body.style.overflow = AppState.isMobileMenuOpen ? 'hidden' : '';
}

// ======================================
// 4. Efectos de Scroll
// ======================================
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    }, { passive: true });
}

// ======================================
// 5. Scroll Suave (Enhanced)
// ======================================
function initSmoothScrolling() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (!targetElement) return;
            
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
            const targetPosition = targetElement.offsetTop - navbarHeight - 12;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            history.pushState(null, null, targetId);
        });
    });
}

// ======================================
// 6. Animaciones al Hacer Scroll (Intersection Observer)
// ======================================
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animationObserver.unobserve(entry.target); // Anima solo una vez
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        animationObserver.observe(element);
    });
}

// ======================================
// 7. Resaltar Navegación Activa
// ======================================
function initNavigationHighlight() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.id;
                AppState.currentSection = currentId;
                
                // Actualizar clase activa en navegación
                navLinks.forEach(link => {
                    const linkHref = link.getAttribute('href');
                    link.classList.toggle('active', linkHref === `#${currentId}`);
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// ======================================
// 8. Manejo del Formulario de Contacto
// ======================================
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    try {
        // Mostrar estado de carga
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <span style="display: inline-flex; align-items: center; gap: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                </svg>
                Enviando...
            </span>
        `;
        
        // Simular envío (en producción, reemplazar con fetch/axios real)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mostrar éxito
        showNotification('¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.', 'success');
        form.reset();
        
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        showNotification('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.', 'error');
    } finally {
        // Restaurar botón
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}

// ======================================
// 9. Sistema de Notificaciones
// ======================================
function showNotification(message, type = 'info') {
    // Eliminar notificaciones existentes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Crear nueva notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    // Estilos en línea para asegurar que funcione independientemente del CSS
    const bgColor = type === 'success' ? '#2f855a' : type === 'error' ? '#c53030' : '#1a365d';
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background-color: ${bgColor};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 9999;
        max-width: 400px;
        transform: translateX(150%);
        transition: transform 0.3s ease-out;
        font-weight: 500;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animar entrada
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ======================================
// 10. Lazy Loading para Imágenes
// ======================================
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // El navegador soporta lazy loading nativo
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback para navegadores que no soportan loading="lazy"
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Inicializar lazy loading si hay imágenes que lo necesiten
if (document.querySelector('img[loading="lazy"]')) {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
}

// ======================================
// 11. Utilidades de Rendimiento
// ======================================
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
    };
}

// Optimizar eventos de scroll con throttle
window.addEventListener('scroll', throttle(() => {
    // Código que se ejecuta máximo cada 100ms durante el scroll
}, 100), { passive: true });

// ======================================
// 12. Exportar para uso en consola (debug)
// ======================================
window.ClubKotokan = {
    state: AppState,
    notify: showNotification,
    scrollToSection: (sectionId) => {
        const element = document.querySelector(sectionId);
        if (element) {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
            window.scrollTo({
                top: element.offsetTop - headerHeight,
                behavior: 'smooth'
            });
        }
    }
};