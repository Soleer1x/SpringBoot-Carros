/* ─────────────────────────────────────────────────────────────────────
   CarroVault — Frontend JS
   Consome a API Spring Boot em /carros
   ───────────────────────────────────────────────────────────────────── */

const API_BASE = 'http://localhost:8080/carros';

// ─── State ────────────────────────────────────────────────────────────
let allCars = [];
let deleteTargetId = null;

// ─── DOM refs ─────────────────────────────────────────────────────────
const grid          = document.getElementById('cars-grid');
const emptyState    = document.getElementById('empty-state');
const emptyMsg      = document.getElementById('empty-msg');
const loadingEl     = document.getElementById('loading');
const headerCount   = document.getElementById('header-count');
const searchInput   = document.getElementById('search-input');

// Modal — form
const modalBackdrop = document.getElementById('modal-backdrop');
const modalTitle    = document.getElementById('modal-title');
const fieldId       = document.getElementById('field-id');
const fieldNome     = document.getElementById('field-nome');
const fieldMont     = document.getElementById('field-montadora');
const fieldMotor    = document.getElementById('field-motor');

// Modal — delete
const deleteBackdrop  = document.getElementById('delete-backdrop');
const deleteNameEl    = document.getElementById('delete-name');

// Toast
const toastEl = document.getElementById('toast');

// ─── Toast ────────────────────────────────────────────────────────────
let toastTimer = null;

function showToast(msg, type = '') {
    toastEl.textContent = msg;
    toastEl.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.className = 'toast'; }, 3000);
}

// ─── Modal helpers ────────────────────────────────────────────────────
function openModal() { modalBackdrop.classList.add('open'); }
function closeModal() { modalBackdrop.classList.remove('open'); clearForm(); }

function openDeleteModal(id, name) {
    deleteTargetId = id;
    deleteNameEl.textContent = name;
    deleteBackdrop.classList.add('open');
}

function closeDeleteModal() {
    deleteTargetId = null;
    deleteBackdrop.classList.remove('open');
}

function clearForm() {
    fieldId.value = '';
    fieldNome.value = '';
    fieldMont.value = '';
    fieldMotor.value = '';
}

// ─── Render ───────────────────────────────────────────────────────────
function renderCars(cars) {
    grid.innerHTML = '';

    if (!cars.length) {
        emptyState.hidden = false;
        return;
    }

    emptyState.hidden = true;

    cars.forEach((car, i) => {
        const card = document.createElement('div');
        card.className = 'car-card';
        card.style.animationDelay = `${i * 55}ms`;

        card.innerHTML = `
      <div class="card-top">
        <div class="card-icon-wrap">
          ${carSVG()}
        </div>
        <span class="card-badge">${escapeHtml(car.montadora || '—')}</span>
      </div>
      <div class="card-name">${escapeHtml(car.nome || 'Sem nome')}</div>
      <div class="card-meta">
        <div class="card-meta-row">
          ${buildingSVG()}
          Montadora: <strong>${escapeHtml(car.montadora || '—')}</strong>
        </div>
        <div class="card-meta-row">
          ${engineSVG()}
          Motor: <strong>${escapeHtml(car.motor || '—')}</strong>
        </div>
      </div>
      <div class="card-divider"></div>
      <div class="card-actions">
        <button class="card-btn-edit" data-id="${car.id}">
          ${editSVG()} Editar
        </button>
        <button class="card-btn-del" data-id="${car.id}" data-name="${escapeHtml(car.nome || 'este veículo')}" aria-label="Excluir">
          ${trashSVG()}
        </button>
      </div>
    `;

        grid.appendChild(card);
    });

    // Delegate click events on cards
    grid.querySelectorAll('.card-btn-edit').forEach(btn => {
        btn.addEventListener('click', () => openEdit(btn.dataset.id));
    });

    grid.querySelectorAll('.card-btn-del').forEach(btn => {
        btn.addEventListener('click', () => openDeleteModal(btn.dataset.id, btn.dataset.name));
    });
}

// ─── SVG helpers ──────────────────────────────────────────────────────
const carSVG = () => `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 20L7 12H25L28 20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  <rect x="2" y="20" width="28" height="7" rx="3" stroke="currentColor" stroke-width="1.8"/>
  <circle cx="8" cy="27" r="2.5" stroke="currentColor" stroke-width="1.5"/>
  <circle cx="24" cy="27" r="2.5" stroke="currentColor" stroke-width="1.5"/>
  <path d="M10 16H22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

const engineSVG = () => `<svg viewBox="0 0 16 16" fill="none">
  <rect x="2" y="5" width="12" height="7" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
  <path d="M5 5V3M8 5V3M11 5V3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M14 8h1M1 8H0" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
</svg>`;

const buildingSVG = () => `<svg viewBox="0 0 16 16" fill="none">
  <rect x="2" y="4" width="12" height="10" rx="1" stroke="currentColor" stroke-width="1.2"/>
  <path d="M5 14v-4h6v4" stroke="currentColor" stroke-width="1.2"/>
  <path d="M5 7h2M9 7h2M5 10h2M9 10h2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M6 1h4l2 3H4L6 1z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
</svg>`;

const editSVG = () => `<svg viewBox="0 0 14 14" fill="none">
  <path d="M9.5 2.5l2 2L5 11H3V9l6.5-6.5z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
</svg>`;

const trashSVG = () => `<svg viewBox="0 0 14 14" fill="none">
  <path d="M2 4h10M5 4V2.5h4V4M5.5 6.5v4M8.5 6.5v4M3 4l.8 8h6.4L11 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── API calls ────────────────────────────────────────────────────────
async function loadCars() {
    loadingEl.hidden = false;
    emptyState.hidden = true;
    grid.innerHTML = '';

    try {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        allCars = await res.json();
        headerCount.textContent = allCars.length;
        applySearch();
    } catch (err) {
        console.error(err);
        showToast('Erro ao carregar veículos.', 'error');
        emptyMsg.textContent = 'Não foi possível conectar à API.';
        emptyState.hidden = false;
    } finally {
        loadingEl.hidden = true;
    }
}

async function saveCar() {
    const id    = fieldId.value.trim();
    const nome  = fieldNome.value.trim();
    const mont  = fieldMont.value.trim();
    const motor = fieldMotor.value.trim();

    if (!nome) {
        fieldNome.focus();
        fieldNome.style.borderColor = 'var(--danger)';
        setTimeout(() => { fieldNome.style.borderColor = ''; }, 1500);
        return;
    }

    const body = { nome, montadora: mont, motor };
    const url    = id ? `${API_BASE}/${id}` : API_BASE;
    const method = id ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        closeModal();
        showToast(id ? 'Veículo atualizado!' : 'Veículo cadastrado!', 'success');
        await loadCars();
    } catch (err) {
        console.error(err);
        showToast('Erro ao salvar veículo.', 'error');
    }
}

async function deleteCar(id) {
    try {
        const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        closeDeleteModal();
        showToast('Veículo removido.', 'success');
        await loadCars();
    } catch (err) {
        console.error(err);
        showToast('Erro ao excluir veículo.', 'error');
    }
}

function openEdit(id) {
    const car = allCars.find(c => c.id === id);
    if (!car) return;
    fieldId.value    = car.id;
    fieldNome.value  = car.nome || '';
    fieldMont.value  = car.montadora || '';
    fieldMotor.value = car.motor || '';
    modalTitle.textContent = 'Editar Veículo';
    openModal();
}

// ─── Search / Filter ──────────────────────────────────────────────────
function applySearch() {
    const q = searchInput.value.toLowerCase();
    const filtered = q
        ? allCars.filter(c =>
            (c.nome       || '').toLowerCase().includes(q) ||
            (c.montadora  || '').toLowerCase().includes(q) ||
            (c.motor      || '').toLowerCase().includes(q)
        )
        : allCars;

    if (!filtered.length && q) {
        emptyMsg.textContent = `Nenhum resultado para "${q}".`;
    } else {
        emptyMsg.textContent = 'Cadastre o primeiro veículo da sua garagem.';
    }

    renderCars(filtered);
}

// ─── Event Listeners ──────────────────────────────────────────────────
document.getElementById('btn-novo').addEventListener('click', () => {
    modalTitle.textContent = 'Novo Veículo';
    clearForm();
    openModal();
});

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('btn-cancel').addEventListener('click', closeModal);

modalBackdrop.addEventListener('click', e => {
    if (e.target === modalBackdrop) closeModal();
});

document.getElementById('btn-save').addEventListener('click', saveCar);

// Allow Enter to save
[fieldNome, fieldMont, fieldMotor].forEach(el => {
    el.addEventListener('keydown', e => { if (e.key === 'Enter') saveCar(); });
});

document.getElementById('btn-delete-cancel').addEventListener('click', closeDeleteModal);

deleteBackdrop.addEventListener('click', e => {
    if (e.target === deleteBackdrop) closeDeleteModal();
});

document.getElementById('btn-delete-confirm').addEventListener('click', () => {
    if (deleteTargetId) deleteCar(deleteTargetId);
});

searchInput.addEventListener('input', applySearch);

document.getElementById('btn-delete-all-cancel').addEventListener('click', () => {
    document.getElementById('delete-all-backdrop').classList.remove('open');
});

document.getElementById('delete-all-backdrop').addEventListener('click', e => {
    if (e.target === document.getElementById('delete-all-backdrop'))
        document.getElementById('delete-all-backdrop').classList.remove('open');
});

document.getElementById('btn-delete-all').addEventListener('click', () => {
    if (!allCars.length) { showToast('Nenhum veículo para deletar.', ''); return; }
    document.getElementById('delete-all-backdrop').classList.add('open');
});

document.getElementById('btn-delete-all-confirm').addEventListener('click', async () => {
    try {
        const res = await fetch(API_BASE, { method: 'DELETE' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        document.getElementById('delete-all-backdrop').classList.remove('open');
        showToast('Todos os veículos foram removidos.', 'success');
        await loadCars();
    } catch (err) {
        console.error(err);
        showToast('Erro ao deletar todos os veículos.', 'error');
    }
});

// ─── Init ─────────────────────────────────────────────────────────────
loadCars();