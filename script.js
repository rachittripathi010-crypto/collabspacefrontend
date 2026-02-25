/* STAR BACKGROUND */
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
for (let i = 0; i < 200; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2
  });
}
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}
drawStars();

/* NAVBAR SCROLL EFFECT */
window.addEventListener("scroll", () => {
  const nav = document.getElementById("navbar");
  nav.classList.toggle("scrolled", window.scrollY > 50);
});

/* PRICING TOGGLE */
document.getElementById("priceToggle").addEventListener("change", function () {
  document.querySelectorAll(".price").forEach(price => {
    price.innerText = this.checked
      ? "$" + price.dataset.year
      : "$" + price.dataset.month;
  });
});

/* TESTIMONIAL SLIDER — auto-rotate */
let slideIndex = 0;
const testimonials = document.querySelectorAll(".testimonial");
const dots = document.querySelectorAll(".dot");

function goToSlide(n) {
  testimonials[slideIndex].classList.remove("active");
  dots[slideIndex].classList.remove("active");
  slideIndex = n;
  testimonials[slideIndex].classList.add("active");
  dots[slideIndex].classList.add("active");
}

setInterval(() => {
  goToSlide((slideIndex + 1) % testimonials.length);
}, 3500);

/* SCROLL FADE UP */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("show");
  });
});
document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));


/* ============================================
   AUTH MODAL (Login / Sign Up)
   ============================================ */

function openAuthModal(tab) {
  const modal = document.getElementById("authModal");
  modal.classList.add("auth-modal-open");
  document.body.style.overflow = "hidden";
  switchTab(tab || "login");
  // Reset success message
  document.getElementById("auth-success").style.display = "none";
  document.getElementById("form-login").style.display = "";
  document.getElementById("form-signup").style.display = "";
}

function closeAuthModal() {
  const modal = document.getElementById("authModal");
  modal.classList.remove("auth-modal-open");
  document.body.style.overflow = "auto";
}

/* Switch between Login / Signup tabs */
function switchTab(tab) {
  const loginForm = document.getElementById("form-login");
  const signupForm = document.getElementById("form-signup");
  const tabLogin = document.getElementById("tab-login");
  const tabSignup = document.getElementById("tab-signup");
  const success = document.getElementById("auth-success");

  success.style.display = "none";

  // Clear any previous login error
  const loginErr = document.getElementById('login-error');
  if (loginErr) loginErr.style.display = 'none';

  if (tab === "login") {
    loginForm.classList.remove("auth-form-hidden");
    signupForm.classList.add("auth-form-hidden");
    tabLogin.classList.add("active");
    tabSignup.classList.remove("active");
  } else {
    signupForm.classList.remove("auth-form-hidden");
    loginForm.classList.add("auth-form-hidden");
    tabSignup.classList.add("active");
    tabLogin.classList.remove("active");
  }
}

/* ============================================
   SIGNUP FORM — REAL-TIME FIELD VALIDATION
   ============================================ */

/* Helper: set message and input classes */
function setFieldState(input, msgEl, isValid, validText, invalidText) {
  if (!input || !msgEl) return;
  if (input.value.trim() === '') {
    // Untouched / empty — neutral
    input.classList.remove('input-valid', 'input-invalid');
    msgEl.textContent = '';
    msgEl.className = 'field-msg';
    return;
  }
  input.classList.toggle('input-valid', isValid);
  input.classList.toggle('input-invalid', !isValid);
  msgEl.textContent = isValid ? '✓ ' + validText : '✗ ' + invalidText;
  msgEl.className = 'field-msg ' + (isValid ? 'valid' : 'invalid');
}

/* ── Name validation (letters + spaces only, min 2 chars) ── */
function validateName(inputId, msgId, label) {
  const input = document.getElementById(inputId);
  const msg = document.getElementById(msgId);
  if (!input) return true;
  const val = input.value.trim();
  const valid = val.length >= 2 && /^[A-Za-z\s'-]+$/.test(val);
  setFieldState(input, msg, valid,
    label + ' looks good!',
    label + ' must be at least 2 letters with no numbers.'
  );
  return valid || val === '';
}

/* ── Business name (min 2 chars, any text) ── */
function validateBusiness() {
  const input = document.getElementById('signup-business');
  const msg = document.getElementById('msg-business');
  if (!input) return true;
  const val = input.value.trim();
  const valid = val.length >= 2;
  setFieldState(input, msg, valid,
    'Business name saved.',
    'Please enter your brewery or business name.'
  );
  return valid || val === '';
}

/* ── Email validation ── */
function validateEmail() {
  const input = document.getElementById('signup-email');
  const msg = document.getElementById('msg-email');
  if (!input) return true;
  const val = input.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  setFieldState(input, msg, valid,
    'Valid email address.',
    'Please enter a valid email (e.g. you@brewery.com).'
  );
  return valid || val === '';
}

/* ── Password validation + requirements checklist ── */
function validatePassword() {
  const input = document.getElementById('signup-password');
  const msg = document.getElementById('msg-password');
  if (!input) return true;
  const val = input.value;

  const hasUpper = /[A-Z]/.test(val);
  const hasLower = /[a-z]/.test(val);
  const hasDigit = /[0-9]/.test(val);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(val);
  const allMet = hasUpper && hasLower && hasDigit && hasSpecial && val.length >= 8;

  // Update checklist items
  const toggle = (id, met) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('req-met', met);
  };
  toggle('req-upper', hasUpper);
  toggle('req-lower', hasLower);
  toggle('req-digit', hasDigit);
  toggle('req-special', hasSpecial);

  // Set field state message only when user has started typing
  if (val.length > 0) {
    if (allMet) {
      input.classList.add('input-valid');
      input.classList.remove('input-invalid');
      msg.textContent = '✓ Strong password!';
      msg.className = 'field-msg valid';
    } else {
      input.classList.add('input-invalid');
      input.classList.remove('input-valid');
      msg.textContent = '✗ Must meet all 4 requirements below.';
      msg.className = 'field-msg invalid';
    }
  } else {
    input.classList.remove('input-valid', 'input-invalid');
    msg.textContent = '';
    msg.className = 'field-msg';
  }
  return allMet;
}

/* Attach real-time listeners after DOM is ready */
document.addEventListener('DOMContentLoaded', () => {
  const attach = (id, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', fn);
  };
  attach('signup-fname', () => validateName('signup-fname', 'msg-fname', 'First name'));
  attach('signup-lname', () => validateName('signup-lname', 'msg-lname', 'Last name'));
  attach('signup-business', validateBusiness);
  attach('signup-email', validateEmail);
  attach('signup-password', validatePassword);

  /* Close modal on backdrop click */
  document.getElementById('authModal').addEventListener('click', function (e) {
    if (e.target === this) closeAuthModal();
  });
});

/* Handle form submission */
function handleAuth(e, type) {
  e.preventDefault();

  /* ── LOGIN: check stored credentials ── */
  if (type === 'login') {
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    // Show or clear inline error
    let loginErr = document.getElementById('login-error');
    if (!loginErr) {
      loginErr = document.createElement('p');
      loginErr.id = 'login-error';
      loginErr.style.cssText = 'color:#f87171;font-size:13px;margin:6px 0 0;text-align:center;';
      document.getElementById('form-login').querySelector('.auth-submit').insertAdjacentElement('beforebegin', loginErr);
    }

    // Look up user in localStorage
    const storedRaw = localStorage.getItem('tl_user_' + email);
    let credValid = false;
    let userData = null;
    if (storedRaw) {
      userData = JSON.parse(storedRaw);
      credValid = userData.password === password;
    }

    if (!credValid) {
      loginErr.textContent = '✗ Invalid email or password. Please try again.';
      loginErr.style.display = 'block';
      const pwInput = document.getElementById('login-password');
      pwInput.classList.add('input-invalid');
      pwInput.focus();
      return;
    }

    // ✅ Valid credentials — store current user and redirect
    loginErr.style.display = 'none';
    localStorage.setItem('tl_current_user', email);
    const loginForm = document.getElementById('form-login');
    const successBox = document.getElementById('auth-success');
    const successText = document.getElementById('auth-success-text');

    loginForm.style.display = 'none';
    successBox.style.display = 'flex';
    successText.textContent = '✅ Welcome back, ' + userData.firstName + '! Redirecting to your dashboard...';

    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
    return;
  }

  /* ── SIGNUP: run full validation before proceeding ── */
  if (type === 'signup') {
    const fnameOk = validateName('signup-fname', 'msg-fname', 'First name');
    const lnameOk = validateName('signup-lname', 'msg-lname', 'Last name');
    const bizOk = validateBusiness();
    const emailOk = validateEmail();
    const passOk = validatePassword();

    // Force-validate all (show errors even if untouched)
    const forceCheck = (inputId, msgId) => {
      const el = document.getElementById(inputId);
      if (el && el.value.trim() === '') {
        const msg = document.getElementById(msgId);
        if (msg) { msg.textContent = '✗ This field is required.'; msg.className = 'field-msg invalid'; }
        if (el) { el.classList.add('input-invalid'); }
      }
    };
    if (!fnameOk || document.getElementById('signup-fname')?.value.trim() === '') forceCheck('signup-fname', 'msg-fname');
    if (!lnameOk || document.getElementById('signup-lname')?.value.trim() === '') forceCheck('signup-lname', 'msg-lname');
    if (!bizOk || document.getElementById('signup-business')?.value.trim() === '') forceCheck('signup-business', 'msg-business');
    if (!emailOk || document.getElementById('signup-email')?.value.trim() === '') forceCheck('signup-email', 'msg-email');
    if (!passOk || document.getElementById('signup-password')?.value === '') {
      const msg = document.getElementById('msg-password');
      if (msg && document.getElementById('signup-password')?.value === '') {
        msg.textContent = '✗ Please create a password.';
        msg.className = 'field-msg invalid';
        document.getElementById('signup-password').classList.add('input-invalid');
      }
    }
    if (!fnameOk || !lnameOk || !bizOk || !emailOk || !passOk) return;
  }

  // Collect signup data and save to localStorage
  const regEmail = document.getElementById('signup-email').value.trim().toLowerCase();
  const regFirst = document.getElementById('signup-fname').value.trim();
  const regLast = document.getElementById('signup-lname').value.trim();
  const regBiz = document.getElementById('signup-business').value.trim();
  const regPass = document.getElementById('signup-password').value;

  const newUser = { firstName: regFirst, lastName: regLast, business: regBiz, email: regEmail, password: regPass, createdAt: Date.now() };
  localStorage.setItem('tl_user_' + regEmail, JSON.stringify(newUser));
  localStorage.setItem('tl_current_user', regEmail);

  // Start 2-day free trial if not already running
  if (!localStorage.getItem('tl_trial_start')) {
    localStorage.setItem('tl_trial_start', Date.now().toString());
    localStorage.setItem('tl_trial_email', regEmail);
  }

  const loginForm = document.getElementById('form-login');
  const signupForm = document.getElementById('form-signup');
  const successBox = document.getElementById('auth-success');
  const successText = document.getElementById('auth-success-text');

  loginForm.style.display = 'none';
  signupForm.style.display = 'none';
  successBox.style.display = 'flex';

  successText.textContent = `🎉 Account created, ${regFirst}! Your 2-day free trial has started. Redirecting to your dashboard...`;
  setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
}

/* Close modal on backdrop click */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("authModal").addEventListener("click", function (e) {
    if (e.target === this) closeAuthModal();
  });
});

/* Close modal on Escape key */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeAuthModal(); closeDemoModal(); }
});

/* ============================================
   DEMO VIDEO MODAL
   ============================================ */

function openDemoModal() {
  const modal = document.getElementById('demoModal');
  const iframe = document.getElementById('demoIframe');
  iframe.src = 'https://www.youtube.com/embed/d8SOYDO4Xwk?autoplay=1';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDemoModal() {
  const modal = document.getElementById('demoModal');
  if (!modal) return;
  const iframe = document.getElementById('demoIframe');
  modal.classList.remove('open');
  iframe.src = '';
  document.body.style.overflow = 'auto';
}