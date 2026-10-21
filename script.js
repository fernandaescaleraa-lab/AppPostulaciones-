const STORAGE_KEY = 'app-postulaciones';
const VALID_STATES = ['Enviado', 'En proceso', 'Rechazado', 'Oferta'];

const form = document.querySelector('#application-form');
const empresaInput = document.querySelector('#empresa');
const rolInput = document.querySelector('#rol');
const fechaInput = document.querySelector('#fecha');
const estadoInput = document.querySelector('#estado');
const notasInput = document.querySelector('#notas');
const list = document.querySelector('#applications-list');
const emptyState = document.querySelector('#empty-state');
const counter = document.querySelector('#counter');

let postulaciones = loadPostulaciones();

function buildValidItem(rawItem) {
  if (!rawItem || typeof rawItem !== 'object') {
    return null;
  }

  const empresa = typeof rawItem.empresa === 'string' ? rawItem.empresa.trim() : '';
  const rol = typeof rawItem.rol === 'string' ? rawItem.rol.trim() : '';
  const fecha = typeof rawItem.fecha === 'string' ? rawItem.fecha : '';
  const estado = VALID_STATES.includes(rawItem.estado) ? rawItem.estado : null;
  const notas = typeof rawItem.notas === 'string' ? rawItem.notas.trim() : '';

  if (!empresa || !rol || !fecha || !estado) {
    return null;
  }

  return {
    id: String(rawItem.id || crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
    empresa,
    rol,
    fecha,
    estado,
    notas: notas || '',
  };
}

function loadPostulaciones() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => buildValidItem(item))
      .filter(Boolean);
  } catch (error) {
    return [];
  }
}

function savePostulaciones() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(postulaciones));
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function renderStatusBadge(estado) {
  const className = `status-${estado}`;
  return `<span class="status-badge ${className}">${estado}</span>`;
}

function renderList() {
  list.innerHTML = '';

  if (postulaciones.length === 0) {
    emptyState.hidden = false;
    counter.textContent = '0';
    return;
  }

  emptyState.hidden = true;
  counter.textContent = String(postulaciones.length);

  postulaciones.forEach((postulacion) => {
    const item = document.createElement('li');
    item.className = 'application-item';

    const notesMarkup = postulacion.notas
      ? `<p class="notes">${escapeHtml(postulacion.notas)}</p>`
      : '';

    item.innerHTML = `
      <div class="item-header">
        <div>
          <h3 class="company-name">${escapeHtml(postulacion.empresa)}</h3>
          <p class="role-name">${escapeHtml(postulacion.rol)}</p>
        </div>
        ${renderStatusBadge(postulacion.estado)}
      </div>

      <div class="meta-row">
        <span>Fecha</span>
        <strong>${formatDate(postulacion.fecha)}</strong>
      </div>

      ${notesMarkup}

      <div class="item-actions">
        <button type="button" class="delete-button" data-id="${postulacion.id}">Eliminar</button>
      </div>
    `;

    list.appendChild(item);
  });
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function resetForm() {
  form.reset();
  empresaInput.focus();
}

function addPostulacion(event) {
  event.preventDefault();

  const empresa = empresaInput.value.trim();
  const rol = rolInput.value.trim();
  const fecha = fechaInput.value;
  const estado = estadoInput.value;
  const notas = notasInput.value.trim();

  if (!empresa || !rol || !fecha || !estado) {
    return;
  }

  const nuevaPostulacion = {
    id: `post-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    empresa,
    rol,
    fecha,
    estado,
    notas,
  };

  postulaciones = [nuevaPostulacion, ...postulaciones];
  savePostulaciones();
  renderList();
  resetForm();
}

function removePostulacion(id) {
  postulaciones = postulaciones.filter((postulacion) => postulacion.id !== id);
  savePostulaciones();
  renderList();
}

form.addEventListener('submit', addPostulacion);

list.addEventListener('click', (event) => {
  const button = event.target.closest('.delete-button');

  if (!button) {
    return;
  }

  const { id } = button.dataset;

  if (id) {
    removePostulacion(id);
  }
});

renderList();
