:root {
  --bg: #f3f6fb;
  --panel: #ffffff;
  --panel-alt: #f8fafc;
  --border: #dfe7f1;
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --text: #122033;
  --muted: #5f7289;
  --danger: #dc2626;
  --danger-soft: #fee2e2;
  --success: #15803d;
  --success-soft: #dcfce7;
  --warning: #a16207;
  --warning-soft: #fef3c7;
  --gray: #475569;
  --gray-soft: #e2e8f0;
  --shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
}

* {
  box-sizing: border-box;
}

html {
  font-size: 16px;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: Arial, Helvetica, sans-serif;
  background: linear-gradient(180deg, #eef4ff 0%, var(--bg) 100%);
  color: var(--text);
}

button,
input,
select,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

h1,
h2,
h3,
p {
  margin: 0;
}

.app-shell {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 1rem 2rem;
}

.topbar {
  padding: 0.5rem 0 1rem;
}

.eyebrow {
  margin: 0 0 0.25rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary);
}

h1 {
  font-size: clamp(2rem, 4vw, 2.6rem);
}

.layout {
  display: grid;
  gap: 1.25rem;
}

.panel {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: var(--shadow);
  padding: 1rem;
}

.panel-header {
  margin-bottom: 1rem;
}

.panel-header h2 {
  font-size: 1.2rem;
}

#application-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

label {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text);
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: #fff;
  color: var(--text);
  padding: 0.8rem 0.9rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

textarea {
  resize: vertical;
  min-height: 110px;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.primary-button {
  border: none;
  border-radius: 12px;
  background: var(--primary);
  color: #fff;
  font-weight: 700;
  padding: 0.8rem 1.1rem;
  transition: background 0.15s ease, transform 0.15s ease;
}

.primary-button:hover {
  background: var(--primary-dark);
}

.primary-button:active {
  transform: translateY(1px);
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.counter {
  min-width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--primary);
  color: #fff;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
}

.empty-state {
  background: var(--panel-alt);
  border: 1px dashed var(--border);
  border-radius: 14px;
  text-align: center;
  padding: 1.25rem 1rem;
  color: var(--muted);
}

.applications-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.application-item {
  background: var(--panel-alt);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 1rem;
}

.item-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.8rem;
}

.company-name {
  font-size: 1.08rem;
  margin-bottom: 0.2rem;
}

.role-name {
  color: var(--muted);
  font-size: 0.94rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 700;
  padding: 0.32rem 0.7rem;
  white-space: nowrap;
}

.status-Enviado {
  background: var(--gray-soft);
  color: var(--gray);
}

.status-En\ proceso {
  background: var(--warning-soft);
  color: var(--warning);
}

.status-Rechazado {
  background: var(--danger-soft);
  color: var(--danger);
}

.status-Oferta {
  background: var(--success-soft);
  color: var(--success);
}

.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.88rem;
  color: var(--muted);
  margin-bottom: 0.8rem;
}

.meta-row strong {
  color: var(--text);
}

.notes {
  margin: 0 0 0.9rem;
  color: var(--text);
  line-height: 1.5;
  white-space: pre-wrap;
}

.item-actions {
  display: flex;
  justify-content: flex-end;
}

.delete-button {
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--danger);
  font-weight: 700;
  padding: 0.45rem 0.6rem;
}

.delete-button:hover {
  background: var(--danger-soft);
}

@media (min-width: 760px) {
  .layout {
    grid-template-columns: minmax(320px, 420px) minmax(0, 1fr);
    align-items: start;
  }

  .field-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
