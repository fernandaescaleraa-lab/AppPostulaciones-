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

let postulaciones = loadPostulaciones();

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

    const classKey = getStateClassKey(postulacion.estado);

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

      <div class="item-status-editor">
        <label class="status-label" for="estado-${postulacion.id}">Estado</label>
        <select
          id="estado-${postulacion.id}"
          class="status-select state-${classKey}"
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

function updateEstado(id, nuevoEstado) {
  const postulacion = postulaciones.find((item) => item.id === id);

  if (!postulacion || !nuevoEstado) {
    return;
  }

  postulacion.estado = nuevoEstado;
  savePostulaciones();
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

list.addEventListener('blur', (event) => {
  const input = event.target.closest('.notes-input');

  if (!input) {
    return;
  }

  const { id } = input.dataset;

  if (id) {
    updateNotas(id, input.value);
  }
}, true);

renderList();
