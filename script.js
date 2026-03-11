/* =====================================================
   RAMA Tuitions – Landing Page Scripts
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ─────── Page Loader ───────
  const pageLoader = document.getElementById('pageLoader');
  window.addEventListener('load', () => {
    setTimeout(() => pageLoader.classList.add('loaded'), 600);
  });

  // ─────── Navbar scroll effect ───────
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  const backToTop = document.getElementById('backToTop');
  const allNavLinks = navLinks.querySelectorAll('a');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar shrink
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top visibility
    if (scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Update active nav link
    updateActiveNav();
  });

  // Mobile hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Back to top
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Active nav link updater
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    allNavLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // ─────── Typing Effect ───────
  const typingEl = document.getElementById('heroTyping');
  const phrases = [
    'Spark curiosity',
    'Build confidence',
    'Shape bright futures'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingEl.innerHTML = currentPhrase.substring(0, charIndex - 1) + '<span class="cursor">|</span>';
      charIndex--;
      typingSpeed = 40;
    } else {
      typingEl.innerHTML = currentPhrase.substring(0, charIndex + 1) + '<span class="cursor">|</span>';
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2200; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before next word
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // Start typing after loader
  setTimeout(typeEffect, 1200);

  // ─────── Scroll Reveal Animations ───────
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Don't unobserve so we can re-animate
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ─────── Animated Counters ───────
  const counters = document.querySelectorAll('.stat-number[data-target]');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
        }
      });
    },
    { threshold: 0.3 }
  );

  const trustSection = document.getElementById('trust');
  if (trustSection) counterObserver.observe(trustSection);

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const suffix = counter.getAttribute('data-suffix') || '';
      const isDecimal = counter.getAttribute('data-decimal') === 'true';
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);

        let current = Math.round(eased * target);

        if (isDecimal && progress >= 1) {
          counter.textContent = target + suffix;
        } else {
          counter.textContent = current + (progress >= 1 ? suffix : '');
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // ─────── Steps Line Animation ───────
  const stepsLineFill = document.getElementById('stepsLineFill');
  if (stepsLineFill) {
    const stepsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            stepsLineFill.style.width = '100%';
          }
        });
      },
      { threshold: 0.3 }
    );
    stepsObserver.observe(stepsLineFill.parentElement);
  }

  // ─────── Reviews Slider ───────
  const reviewsTrack = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('prevReview');
  const nextBtn = document.getElementById('nextReview');
  const dotsContainer = document.getElementById('reviewsDots');
  const reviewCards = reviewsTrack ? reviewsTrack.querySelectorAll('.review-card') : [];

  let currentSlide = 0;
  let slidesVisible = getSlidesVisible();
  let totalDots = Math.max(1, reviewCards.length - slidesVisible + 1);
  let autoplayInterval;

  function getSlidesVisible() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function createDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    totalDots = Math.max(1, reviewCards.length - slidesVisible + 1);
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goToSlide(index) {
    currentSlide = Math.max(0, Math.min(index, totalDots - 1));
    updateSlider();
  }

  function updateSlider() {
    if (!reviewsTrack || reviewCards.length === 0) return;
    const card = reviewCards[0];
    const cardStyles = getComputedStyle(card);
    const trackStyles = getComputedStyle(reviewsTrack);
    const gap = parseInt(trackStyles.gap) || 24;
    const cardWidth = card.offsetWidth + parseInt(cardStyles.marginRight || 0) + gap;
    reviewsTrack.style.transform = `translateX(-${currentSlide * cardWidth}px)`;

    // Update dots
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalDots;
    updateSlider();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalDots) % totalDots;
    updateSlider();
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });

  // Touch / Swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  if (reviewsTrack) {
    reviewsTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    reviewsTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
      startAutoplay();
    }, { passive: true });
  }

  // Init slider
  createDots();
  startAutoplay();

  // Recalculate on resize
  window.addEventListener('resize', () => {
    slidesVisible = getSlidesVisible();
    createDots();
    goToSlide(Math.min(currentSlide, totalDots - 1));
  });

  // ─────── Parallax Effect on Scroll ───────
  const heroShapes = document.querySelectorAll('.hero-bg-shapes .shape');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    heroShapes.forEach((shape, i) => {
      const speed = (i + 1) * 0.03;
      shape.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });

  // ─────── Smooth Scroll for Anchor Links ───────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ─────── Button Ripple Effect ───────
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        border-radius: 50%;
        background: rgba(255,255,255,0.3);
        transform: scale(0);
        animation: rippleAnim 0.6s ease-out forwards;
        pointer-events: none;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Inject ripple animation CSS
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(4); opacity: 0; }
    }
  `;
  document.head.appendChild(rippleStyle);

  // ─────── Micro Interaction: Card Tilt ───────
  document.querySelectorAll('.program-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ─────── Intersection animation for about points ───────
  const aboutPoints = document.querySelectorAll('.about-point');
  aboutPoints.forEach((point, index) => {
    point.style.opacity = '0';
    point.style.transform = 'translateX(-20px)';
    point.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
  });

  const aboutObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const points = entry.target.querySelectorAll('.about-point');
          points.forEach(point => {
            point.style.opacity = '1';
            point.style.transform = 'translateX(0)';
          });
        }
      });
    },
    { threshold: 0.2 }
  );

  const aboutSection = document.querySelector('.about-points');
  if (aboutSection) aboutObserver.observe(aboutSection);

  // ─────── Step cards stagger animation ───────
  const stepCards = document.querySelectorAll('.step-card');
  stepCards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`;
  });

  const approachObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.step-card');
          cards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        }
      });
    },
    { threshold: 0.2 }
  );

  const stepsContainer = document.querySelector('.steps-container');
  if (stepsContainer) approachObserver.observe(stepsContainer);

  // ─────── Lazy loading fallback ───────
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img').forEach(img => {
      if (!img.getAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
  }
});
