/* =========================================================
   فروش‌یار — توابع مشترک
   ========================================================= */

/**
 * تبدیل ارقام فارسی و عربی به ارقام انگلیسی
 */
function faToEnDigits(str) {
  if (str === null || str === undefined) return '';
  const persian = '۰۱۲۳۴۵۶۷۸۹';
  const arabic = '٠١٢٣٤٥٦٧٨٩';
  return String(str).replace(/[۰-۹]/g, (d) => String(persian.indexOf(d)))
                     .replace(/[٠-٩]/g, (d) => String(arabic.indexOf(d)));
}

/**
 * تبدیل یک رشته ورودی (با ویرگول، فاصله، ارقام فارسی و...) به عدد صحیح یا اعشاری
 * بازمی‌گرداند NaN اگر مقدار قابل تبدیل نباشد
 */
function parseFlexibleNumber(input) {
  if (input === null || input === undefined) return NaN;
  let s = faToEnDigits(String(input)).trim();
  if (s === '') return NaN;
  // حذف جداکننده‌های هزارگان (کاما، فاصله، ممیز عربی هزارگان)
  s = s.replace(/[,٬\s]/g, '');
  // ممیز اعشاری عربی به نقطه
  s = s.replace(/٫/g, '.');
  if (!/^-?\d+(\.\d+)?$/.test(s)) return NaN;
  return parseFloat(s);
}

/**
 * قالب‌بندی عدد به‌صورت مبلغ تومان با جداکننده هزارگان فارسی
 */
function formatToman(num) {
  const n = Math.round(Number(num) || 0);
  return n.toLocaleString('fa-IR') + ' تومان';
}

/**
 * قالب‌بندی عدد ساده با جداکننده هزارگان فارسی
 */
function formatNumber(num) {
  return (Number(num) || 0).toLocaleString('fa-IR');
}

/**
 * نمایش خطای یک فیلد فرم
 */
function setFieldError(fieldEl, message) {
  if (!fieldEl) return;
  fieldEl.classList.add('has-error');
  const errEl = fieldEl.querySelector('.field-error');
  if (errEl) errEl.textContent = message;
}

/**
 * پاک‌کردن خطای یک فیلد
 */
function clearFieldError(fieldEl) {
  if (!fieldEl) return;
  fieldEl.classList.remove('has-error');
  const errEl = fieldEl.querySelector('.field-error');
  if (errEl) errEl.textContent = '';
}

/**
 * پاک‌کردن همه خطاهای یک فرم
 */
function clearAllErrors(formEl) {
  formEl.querySelectorAll('.field.has-error').forEach((f) => clearFieldError(f));
}

/**
 * نمایش پیام Toast (موفقیت یا خطا)
 */
let toastTimer = null;
function showToast(message, type) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = 'toast show' + (type === 'error' ? ' error' : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

/**
 * کپی متن در کلیپ‌بورد و نمایش پیام موفقیت
 */
async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const tmp = document.createElement('textarea');
      tmp.value = text;
      tmp.style.position = 'fixed';
      tmp.style.opacity = '0';
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand('copy');
      document.body.removeChild(tmp);
    }
    showToast('با موفقیت کپی شد ✓');
    return true;
  } catch (e) {
    showToast('کپی انجام نشد، لطفاً به‌صورت دستی کپی کنید', 'error');
    return false;
  }
}

/**
 * قرار دادن امن متن کاربر در یک عنصر (بدون innerHTML)
 */
function setSafeText(el, text) {
  if (!el) return;
  el.textContent = text;
}

/* ---------- ذخیره‌سازی محلی ---------- */
const STORAGE_PREFIX = 'foroshyar:';

function saveLocal(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) { /* localStorage در دسترس نیست */ }
}

function loadLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

/* ---------- کمک برای اعتبارسنجی ---------- */

/**
 * اعتبارسنجی یک فیلد عددی الزامی و غیرمنفی
 * options: { allowZero: bool, label: 'قیمت' }
 */
function validatePositiveNumberField(inputEl, fieldEl, options) {
  options = options || {};
  const raw = inputEl.value;
  if (raw === null || String(raw).trim() === '') {
    setFieldError(fieldEl, `لطفاً ${options.label || 'مقدار'} را وارد کنید.`);
    return null;
  }
  const num = parseFlexibleNumber(raw);
  if (isNaN(num) || num < 0 || (!options.allowZero && num === 0)) {
    setFieldError(fieldEl, 'مقدار واردشده معتبر نیست.');
    return null;
  }
  clearFieldError(fieldEl);
  return num;
}

function validateRequiredTextField(inputEl, fieldEl, label) {
  const val = (inputEl.value || '').trim();
  if (val === '') {
    setFieldError(fieldEl, `لطفاً ${label} را وارد کنید.`);
    return null;
  }
  clearFieldError(fieldEl);
  return val;
                                                      }
