/**
 * 应象堂中医养生馆 - 主要JavaScript功能
 * 包含：移动端导航菜单切换、平滑滚动等
 */



/**
 * 移动端导航菜单功能
 * 点击汉堡菜单按钮时切换导航菜单的显示/隐藏
 */
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // 如果页面中没有导航菜单元素，直接返回
    if (!navToggle || !navMenu) return;
    
    // 点击菜单按钮时切换菜单状态
    navToggle.addEventListener('click', function() {
        // 切换按钮的active状态（用于改变汉堡图标为X）
        navToggle.classList.toggle('active');
        // 切换菜单的显示/隐藏
        navMenu.classList.toggle('active');
    });
    
    // 点击菜单项后自动关闭菜单（移动端）
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            // 只在移动端（菜单处于active状态时）关闭菜单
            if (navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // 点击页面其他区域关闭菜单
    document.addEventListener('click', function(event) {
        // 如果点击的不是导航区域，且菜单处于打开状态
        if (!event.target.closest('.navbar') && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

/**
 * 平滑滚动功能
 * 点击导航链接时平滑滚动到对应区域
 */
function initSmoothScroll() {
    // 获取所有以#开头的链接（锚点链接）
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            
            // 如果链接只是#，不处理
            if (href === '#') return;
            
            // 获取目标元素
            const target = document.querySelector(href);
            
            if (target) {
                event.preventDefault();
                
                // 计算目标位置（减去导航栏高度）
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                // 平滑滚动到目标位置
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 导航栏滚动效果
 * 页面滚动时添加阴影效果，增强视觉层次
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    // 监听页面滚动事件
    window.addEventListener('scroll', function() {
        // 如果页面滚动超过10px，添加阴影效果
        if (window.scrollY > 10) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
}

/**
 * 图片懒加载功能（可选）
 * 当图片进入视口时才加载，提高页面性能
 */
function initLazyLoad() {
    // 检查浏览器是否支持IntersectionObserver
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // 将data-src的值赋给src，加载图片
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    // 停止观察该图片
                    observer.unobserve(img);
                }
            });
        });
        
        // 观察所有带有data-src属性的图片
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    }
}

/**
 * 返回顶部功能（可选）
 * 页面滚动一定距离后显示返回顶部按钮
 */
function initBackToTop() {
    // 创建返回顶部按钮
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #9D654C;
        color: #fff;
        border: none;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 999;
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // 监听页面滚动
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // 点击返回顶部
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 鼠标悬停效果
    backToTopBtn.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#7D8C7A';
        this.style.transform = 'translateY(-3px)';
    });
    
    backToTopBtn.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#9D654C';
        this.style.transform = 'translateY(0)';
    });
}

/**
 * 图片轮播功能
 * 实现自动轮播、手动切换、指示器等功能
 */
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    
    const items = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    
    let currentIndex = 0;
    let interval;
    
    // 显示指定幻灯片
    function showSlide(index) {
        // 隐藏所有幻灯片
        items.forEach(item => {
            item.classList.remove('active');
        });
        
        // 隐藏所有指示器
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // 显示当前幻灯片和指示器
        items[index].classList.add('active');
        indicators[index].classList.add('active');
        
        currentIndex = index;
    }
    
    // 下一张
    function nextSlide() {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= items.length) {
            nextIndex = 0;
        }
        showSlide(nextIndex);
    }
    
    // 上一张
    function prevSlide() {
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = items.length - 1;
        }
        showSlide(prevIndex);
    }
    
    // 自动轮播
    function startAutoSlide() {
        interval = setInterval(nextSlide, 3000);
    }
    
    // 停止自动轮播
    function stopAutoSlide() {
        clearInterval(interval);
    }
    
    // 事件监听
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });
    }
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            stopAutoSlide();
            showSlide(index);
            startAutoSlide();
        });
    });
    
    // 鼠标悬停时停止自动轮播
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
    
    // 初始化
    showSlide(0);
    startAutoSlide();
}

/**
 * 返回顶部按钮功能
 * 页面滚动一定距离后显示返回顶部按钮
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;
    
    // 滚动事件监听
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // 点击返回顶部
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * FAQ手风琴效果
 * 点击问题时展开/收起答案
 */
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (!faqQuestions.length) return;
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('span');
            
            // 切换当前FAQ的状态
            answer.classList.toggle('active');
            
            // 切换箭头图标
            if (answer.classList.contains('active')) {
                icon.textContent = '▲';
            } else {
                icon.textContent = '▼';
            }
        });
    });
}

// 初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化移动端导航菜单
    initMobileNav();
    
    // 初始化平滑滚动
    initSmoothScroll();
    
    // 初始化导航栏滚动效果
    initNavbarScroll();
    
    // 初始化图片轮播
    initCarousel();
    
    // 初始化返回顶部按钮
    initBackToTop();
    
    // 初始化FAQ手风琴效果
    initFAQAccordion();
});
