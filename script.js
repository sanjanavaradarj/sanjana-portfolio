/**
 * PORTFOLIO CLIENT INTERACTION SCRIPT - SANJANA
 * Handles:
 * 1. Night Mode / Light Mode toggle with CSS media query detection & sync
 * 2. Vertical Navigation Bar (Desktop fixed / Mobile off-canvas drawer)
 * 3. ScrollSpy active highlighting for all vertical links
 * 4. Interactive Pixel Terminal Chat with prompt chips & instant replies
 * 5. Contact form handling & dynamic copyright year
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. NIGHT MODE / LIGHT MODE THEME CONTROLLER
  // -------------------------------------------------------------------------
  const sidebarThemeToggleBtn = document.getElementById('sidebar-theme-toggle');
  const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');
  const heroThemeToggleBtn = document.getElementById('pixel-hero-theme-toggle');
  const sidebarModeLabel = document.getElementById('sidebar-mode-label');
  const heroModeLabel = document.getElementById('pixel-mode-label');
  const htmlElement = document.documentElement;
  const STORAGE_KEY = 'portfolio_theme';

  const mediaQueryDark = window.matchMedia('(prefers-color-scheme: dark)');

  const updateToggleUI = (theme) => {
    const isDark = theme === 'dark';

    // Update Hero Button
    if (heroModeLabel) {
      heroModeLabel.textContent = isDark ? 'NIGHT MODE' : 'DAY MODE';
    }
    if (heroThemeToggleBtn) {
      const icon = heroThemeToggleBtn.querySelector('.pixel-mode-icon');
      if (icon) {
        icon.innerHTML = isDark ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
      }
    }

    // Update Sidebar Button
    if (sidebarModeLabel) {
      sidebarModeLabel.textContent = isDark ? 'NIGHT' : 'DAY';
    }
    if (sidebarThemeToggleBtn) {
      const icon = sidebarThemeToggleBtn.querySelector('.sidebar-theme-icon');
      if (icon) {
        icon.innerHTML = isDark ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
      }
    }

    // Update Mobile Topbar Button
    if (mobileThemeToggleBtn) {
      const sun = mobileThemeToggleBtn.querySelector('.icon-sun');
      const moon = mobileThemeToggleBtn.querySelector('.icon-moon');
      if (sun && moon) {
        sun.style.display = isDark ? 'none' : 'block';
        moon.style.display = isDark ? 'block' : 'none';
      }
    }
  };

  const applyTheme = (theme, save = true) => {
    htmlElement.setAttribute('data-theme', theme);
    if (save) {
      localStorage.setItem(STORAGE_KEY, theme);
    }
    updateToggleUI(theme);
  };

  // Determine initial theme:
  // 1. Stored user choice -> 2. Default browser scheme via CSS media query
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme) {
    applyTheme(savedTheme, false);
  } else {
    const defaultTheme = mediaQueryDark.matches ? 'dark' : 'light';
    applyTheme(defaultTheme, false);
  }

  // Listen to OS/browser theme changes automatically
  mediaQueryDark.addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const newTheme = e.matches ? 'dark' : 'light';
      applyTheme(newTheme, false);
    }
  });

  const toggleTheme = () => {
    const currentTheme = htmlElement.getAttribute('data-theme') || (mediaQueryDark.matches ? 'dark' : 'light');
    const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(targetTheme, true);
  };

  if (sidebarThemeToggleBtn) sidebarThemeToggleBtn.addEventListener('click', toggleTheme);
  if (mobileThemeToggleBtn) mobileThemeToggleBtn.addEventListener('click', toggleTheme);
  if (heroThemeToggleBtn) heroThemeToggleBtn.addEventListener('click', toggleTheme);

  // -------------------------------------------------------------------------
  // 2. VERTICAL NAVBAR: MOBILE OFF-CANVAS DRAWER HANDLING
  // -------------------------------------------------------------------------
  const sidebar = document.getElementById('vertical-navbar');
  const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const navBackdrop = document.getElementById('nav-backdrop');
  const sidebarNavLinks = document.querySelectorAll('.sidebar-nav-link');

  const openSidebar = () => {
    if (sidebar) sidebar.classList.add('is-open');
    if (navBackdrop) navBackdrop.classList.add('is-open');
    if (sidebarToggleBtn) sidebarToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeSidebar = () => {
    if (sidebar) sidebar.classList.remove('is-open');
    if (navBackdrop) navBackdrop.classList.remove('is-open');
    if (sidebarToggleBtn) sidebarToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', () => {
      const isOpen = sidebar && sidebar.classList.contains('is-open');
      if (isOpen) closeSidebar();
      else openSidebar();
    });
  }

  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
  if (navBackdrop) navBackdrop.addEventListener('click', closeSidebar);

  // Close drawer when any link is clicked on mobile
  sidebarNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        closeSidebar();
      }
    });
  });

  // Close drawer on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('is-open')) {
      closeSidebar();
    }
  });

  // -------------------------------------------------------------------------
  // 3. SCROLLSPY (ACTIVE LINK HIGHLIGHTING)
  // -------------------------------------------------------------------------
  const trackedSections = document.querySelectorAll('section[id]');

  const onScroll = () => {
    const scrollY = window.pageYOffset;

    trackedSections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 150;
      const sectionId = section.getAttribute('id');
      const navItem = document.querySelector(`.sidebar-nav-link[data-nav="${sectionId}"]`) || 
                      document.querySelector(`.sidebar-nav-link[href*="${sectionId}"]`);

      if (navItem) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navItem.classList.add('active');
          navItem.setAttribute('aria-current', 'page');
        } else {
          navItem.classList.remove('active');
          navItem.removeAttribute('aria-current');
        }
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on page load

  // -------------------------------------------------------------------------
  // 4. INTERACTIVE PIXEL TERMINAL CHAT
  // -------------------------------------------------------------------------
  const chatForm = document.getElementById('pixel-chat-form');
  const chatInputField = document.getElementById('chat-input-field');
  const chatWindow = document.getElementById('chat-messages-window');
  const promptChips = document.querySelectorAll('.pixel-prompt-chip');

  const botResponses = {
    stack: "My core stack includes <strong>Java</strong> (OOP, Backend Workflows), <strong>Python</strong> (Data Science & Scripting), Data Structures & Algorithms, Operating Systems, and <strong>Arduino</strong> embedded hardware.",
    availability: "I am actively seeking <strong>Software Engineering Internships</strong> and entry-level full-time roles starting immediately! I am based in Karnataka and open to remote or on-site opportunities.",
    projects: "I have engineered two major capstone projects:<br>1. <strong>Digital Money Transition</strong> (Java, Python) - secure digital financial ledger workflow.<br>2. <strong>Driver Drowsiness Detection System</strong> (Arduino, Sensors) - real-time road safety alert system.",
    contact: "You can reach me directly at <strong>sanjanavaradarj@gmail.com</strong>, call <strong>+91 9901611394</strong>, or connect on LinkedIn at <strong>sanjana-v</strong>!",
    resume: "You can view or download my complete resume via the <a href='resume.pdf' target='_blank' style='color:#38bdf8;text-decoration:underline;'>Resume Download Link</a>.",
    default: "Thank you for connecting! I'm Sanjana, an aspiring Software Engineer & Data Science student. Feel free to explore my projects or drop me a direct message via the contact form below!"
  };

  const appendChatMessage = (sender, message, isUser = false) => {
    if (!chatWindow) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${isUser ? 'user-msg' : 'bot-msg'}`;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    msgDiv.innerHTML = `
      <div class="chat-msg-avatar">
        ${isUser ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>'}
      </div>
      <div class="chat-bubble">
        <span class="chat-sender">${sender}:</span>
        <p>${message}</p>
        <span class="chat-time">${now}</span>
      </div>
    `;

    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  };

  const handleUserMessage = async (text) => {
    if (!text.trim()) return;

    // Append the visitor message immediately
    appendChatMessage('Visitor', text, true);

    // Basic rule-based reply as a fast fallback
    const query = text.toLowerCase();
    let reply = botResponses.default;

    if (query.includes('stack') || query.includes('skill') || query.includes('java') || query.includes('python')) {
      reply = botResponses.stack;
    } else if (query.includes('avail') || query.includes('job') || query.includes('intern') || query.includes('hire') || query.includes('role')) {
      reply = botResponses.availability;
    } else if (query.includes('project') || query.includes('money') || query.includes('drowsiness') || query.includes('arduino')) {
      reply = botResponses.projects;
    } else if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('call')) {
      reply = botResponses.contact;
    } else if (query.includes('resume') || query.includes('cv')) {
      reply = botResponses.resume;
    }

    // --- Optional: Call an AI API (OpenAI) here for dynamic responses ---
    // Example (server-side proxy recommended):
    // try {
    //   const res = await fetch('/api/openai', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ prompt: text })
    //   });
    //   const data = await res.json();
    //   if (data && data.reply) reply = data.reply; // override fallback
    // } catch (err) {
    //   // network or API error: keep the local fallback reply
    // }

    // Simulate typing latency and then append the reply
    setTimeout(() => {
      appendChatMessage('Sanjana.bot', reply, false);
    }, 450);
  };

  if (chatForm && chatInputField) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userText = chatInputField.value;
      chatInputField.value = '';
      handleUserMessage(userText);
    });
  }

  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const promptText = chip.getAttribute('data-prompt') || chip.textContent.trim();
      handleUserMessage(promptText);
    });
  });

  // -------------------------------------------------------------------------
  // 5. CONTACT FORM SUBMISSION DEMO
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('contact-submit-btn');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = '<i class="fa-solid fa-check-circle"></i> Thank you! Your message has been sent. I will get back to you shortly.';

        contactForm.reset();

        setTimeout(() => {
          formFeedback.style.display = 'none';
          formFeedback.className = 'form-feedback';
        }, 5000);
      }, 800);
    });
  }

  // -------------------------------------------------------------------------
  // 6. DYNAMIC CURRENT YEAR
  // -------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------------------------
  // 7. ABOUT ME: AVATAR / PHOTO TOGGLE
  // -------------------------------------------------------------------------
  const toggleAvatarBtn = document.getElementById('toggle-avatar-style-btn');
  const aboutDisplayImg = document.getElementById('about-display-img');
  const avatarToggleText = document.getElementById('avatar-toggle-text');

  if (toggleAvatarBtn && aboutDisplayImg && avatarToggleText) {
    let isPixelAvatar = true;
    toggleAvatarBtn.addEventListener('click', () => {
      isPixelAvatar = !isPixelAvatar;
      if (isPixelAvatar) {
        aboutDisplayImg.src = 'pixel_avatar.png';
        aboutDisplayImg.alt = 'Sanjana - Pixel Software Engineer Avatar';
        avatarToggleText.textContent = 'VIEW PHOTO';
      } else {
        aboutDisplayImg.src = 'profile pic.jpeg';
        aboutDisplayImg.alt = 'Sanjana - Software Engineer Photo';
        avatarToggleText.textContent = 'VIEW AVATAR';
      }
    });
  }

  // -------------------------------------------------------------------------
  // 8. SKILLS SECTION: CATEGORY FILTERING & DYNAMIC PROGRESS BARS
  // -------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.pixel-filter-btn');
  const skillCards = document.querySelectorAll('.pixel-skill-card');
  const progressFills = document.querySelectorAll('.pixel-progress-fill');

  // Filter skills by category
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');

      // Update active state on buttons
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Show/Hide matching skill cards with entry animation
      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('is-hidden');
          // Re-trigger animation
          card.style.animation = 'none';
          card.offsetHeight; // trigger reflow
          card.style.animation = 'pixelCardPop 0.35s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards';
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  // Intersection Observer to smoothly animate progress bars on scroll
  if ('IntersectionObserver' in window) {
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            progressFills.forEach(fill => {
              const targetWidth = fill.style.width || (fill.getAttribute('aria-valuenow') + '%');
              fill.style.width = '0%';
              setTimeout(() => {
                fill.style.width = targetWidth;
              }, 100);
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      skillsObserver.observe(skillsSection);
    }
  }
  // -------------------------------------------------------------------------
  // 9. TIMELINE SECTION: TAB SWITCHING & SCROLL-IN ANIMATION
  // -------------------------------------------------------------------------
  const tlTabs       = document.querySelectorAll('.tl-tab');
  const tlTracks     = document.querySelectorAll('.tl-track');
  const tlEvents     = document.querySelectorAll('.tl-event');

  // Tab switcher — show/hide the Education vs Projects panel
  tlTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tl-tab');

      // Update active tab button state
      tlTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Show/hide the matching track
      tlTracks.forEach(track => {
        if (track.id === `tl-${target}`) {
          track.classList.remove('tl-track--hidden');
          // Trigger animations for newly visible events
          track.querySelectorAll('.tl-event').forEach((ev, i) => {
            ev.style.transitionDelay = `${i * 80}ms`;
            setTimeout(() => ev.classList.add('tl-visible'), 20);
          });
        } else {
          track.classList.add('tl-track--hidden');
          // Reset so they re-animate next time
          track.querySelectorAll('.tl-event').forEach(ev => {
            ev.classList.remove('tl-visible');
            ev.style.transitionDelay = '';
          });
        }
      });
    });
  });

  // Intersection Observer — animate cards as they scroll into view
  if ('IntersectionObserver' in window) {
    const tlObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('tl-visible');
          tlObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    // Stagger initial Education track events on load
    tlEvents.forEach((ev, i) => {
      ev.style.transitionDelay = `${i * 90}ms`;
      tlObserver.observe(ev);
    });
  } else {
    // Fallback: make all visible immediately if no IntersectionObserver
    tlEvents.forEach(ev => ev.classList.add('tl-visible'));
  }
});

