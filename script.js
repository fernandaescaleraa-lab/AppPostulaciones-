const STORAGE_KEY = 'postulaciones-app';

const form = document.querySelector('#application-form');
const empresaInput = document.querySelector('#empresa');
const rolInput = document.querySelector('#rol');
const fechaInput = document.querySelector('#fecha');
const estadoInput = document.querySelector('#estado');
const notasInput = document.querySelector('#notas');
const list = document.querySelector('#applications-list');
const emptyState = document.querySelector('#empty-state');
const counter = document.querySelector('#counter');
const summaryTotal = document.querySelector('#summary-total');
const summaryEnviado = document.querySelector('#summary-enviado');
const summaryEnProceso = document.querySelector('#summary-en-proceso');
const summaryRechazado = document.querySelector('#summary-rechazado');
const summaryOferta = document.querySelector('#summary-oferta');
const searchInput = document.querySelector('#search-input');
const filterButtons = document.querySelectorAll('.chip');

let postulaciones = loadPostulaciones();
let currentFilter = 'Todos';
let currentSearch = '';

function loadPostulaciones() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) {
    return [];
  }

  try {
    const parsedData = JSON.parse(savedData);
    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    return [];
  }
}

function savePostulaciones() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(postulaciones));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getStateClassKey(estado) {
  return estado.toLowerCase().replace(/\s+/g, '-');
}

function getStateColor(estado) {
  switch (estado) {
    case 'Enviado':
      return '#475569';
    case 'En proceso':
      return '#a16207';
    case 'Rechazado':
      return '#dc2626';
    case 'Oferta':
      return '#15803d';
    default:
      return '#4f46e5';
  }
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
  const classKey = getStateClassKey(estado);
  return `<span class="status-badge status-${classKey}">${estado}</span>`;
}

function renderStatusOptions(currentEstado) {
  const estados = ['Enviado', 'En proceso', 'Rechazado', 'Oferta'];

  return estados
    .map(
      (estado) =>
        `<option value="${estado}" ${estado === currentEstado ? 'selected' : ''}>${estado}</option>`
    )
    .join('');
}

function renderSummary() {
  const counts = {
    Enviado: 0,
    'En proceso': 0,
    Rechazado: 0,
    Oferta: 0,
  };

  postulaciones.forEach((postulacion) => {
    if (counts[postulacion.estado] !== undefined) {
      counts[postulacion.estado] += 1;
    }
  });

  summaryTotal.textContent = String(postulaciones.length);
  summaryEnviado.textContent = String(counts.Enviado);
  summaryEnProceso.textContent = String(counts['En proceso']);
  summaryRechazado.textContent = String(counts.Rechazado);
  summaryOferta.textContent = String(counts.Oferta);
}

function getFilteredPostulaciones() {
  const query = currentSearch.trim().toLowerCase();

  return postulaciones.filter((postulacion) => {
    const matchesFilter = currentFilter === 'Todos' || postulacion.estado === currentFilter;

    if (!query) {
      return matchesFilter;
    }

    const haystack = `${postulacion.empresa} ${postulacion.rol}`.toLowerCase();
    return matchesFilter && haystack.includes(query);
  });
}

function renderList() {
  const filteredPostulaciones = getFilteredPostulaciones();
  list.innerHTML = '';

  if (postulaciones.length === 0) {
    emptyState.hidden = false;
    emptyState.innerHTML = '<p>No hay postulaciones cargadas.</p>';
    counter.textContent = '0';
    return;
  }

  if (filteredPostulaciones.length === 0) {
    emptyState.hidden = false;
    emptyState.innerHTML = '<p>No se encontraron postulaciones con esos filtros.</p>';
    counter.textContent = '0';
    return;
  }

  emptyState.hidden = true;
  counter.textContent = String(filteredPostulaciones.length);

  filteredPostulaciones.forEach((postulacion) => {
    const item = document.createElement('li');
    item.className = 'application-item';
    item.style.setProperty('--state-color', getStateColor(postulacion.estado));

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

      <div class="item-status-editor">
        <label class="status-label" for="estado-${postulacion.id}">Estado</label>
        <select
          id="estado-${postulacion.id}"
          class="status-select state-${getStateClassKey(postulacion.estado)}"
          data-id="${postulacion.id}"
          aria-label="Cambiar estado de la postulación"
        >
          ${renderStatusOptions(postulacion.estado)}
        </select>
      </div>

      <div class="item-notes-editor">
        <label class="notes-label" for="notas-${postulacion.id}">Notas</label>
        <textarea
          id="notas-${postulacion.id}"
          class="notes-input"
          data-id="${postulacion.id}"
          rows="3"
          placeholder="Agregar nota de seguimiento"
        >${escapeHtml(postulacion.notas || '')}</textarea>
      </div>

      <div class="item-actions">
        <button type="button" class="delete-button" data-id="${postulacion.id}">Eliminar</button>
      </div>
    `;

    list.appendChild(item);
  });
}

function renderFilterChips() {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle('is-active', isActive);
  });
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
  renderSummary();
  renderList();
  resetForm();
}

function removePostulacion(id) {
  postulaciones = postulaciones.filter((postulacion) => postulacion.id !== id);
  savePostulaciones();
  renderSummary();
  renderList();
}

function updateEstado(id, nuevoEstado) {
  const postulacion = postulaciones.find((item) => item.id === id);

  if (!postulacion || !nuevoEstado) {
    return;
  }

  postulacion.estado = nuevoEstado;
  savePostulaciones();
  renderSummary();
  renderList();
}

function updateNotas(id, nuevoTexto) {
  const postulacion = postulaciones.find((item) => item.id === id);

  if (!postulacion) {
    return;
  }

  postulacion.notas = nuevoTexto.trim();
  savePostulaciones();
}

form.addEventListener('submit', addPostulacion);

searchInput.addEventListener('input', (event) => {
  currentSearch = event.target.value;
  renderList();
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    renderFilterChips();
    renderList();
  });
});

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

list.addEventListener('change', (event) => {
  const select = event.target.closest('.status-select');

  if (select) {
    const { id } = select.dataset;

    if (id) {
      updateEstado(id, select.value);
    }
    return;
  }

  const input = event.target.closest('.notes-input');

  if (input) {
    const { id } = input.dataset;

    if (id) {
      updateNotas(id, input.value);
    }
  }
});

list.addEventListener(
  'blur',
  (event) => {
    const input = event.target.closest('.notes-input');

    if (!input) {
      return;
    }

    const { id } = input.dataset;

    if (id) {
      updateNotas(id, input.value);
    }
  },
  true
);

renderSummary();
renderFilterChips();
renderList();

