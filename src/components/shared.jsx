// EDIT: Komponen bersama. Ubah gaya visual di src/styles.css.
// COMMAND: Jalankan npm.cmd run dev; jalankan npm.cmd run build setelah selesai.

export function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button className={`button button-${variant} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function Card({ children, className = '', ...props }) {
  return (
    <section className={`card ${className}`} {...props}>
      {children}
    </section>
  )
}

export function Badge({ children, tone = 'neutral' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={item}>
          {index > 0 && <span className="breadcrumb-separator" aria-hidden="true">/</span>}
          {item}
        </span>
      ))}
    </nav>
  )
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-mark" aria-hidden="true">—</div>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  )
}

export function Modal({ open, title, children, onClose }) {
  if (!open) return null

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button type="button" className="icon-button" aria-label="Tutup" onClick={onClose}>×</button>
        </div>
        {children}
      </section>
    </div>
  )
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  onConfirm,
  onClose,
}) {
  if (!open) return null

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p className="confirm-description">{description}</p>
      <div className="modal-actions">
        <Button type="button" variant="secondary" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button type="button" variant="danger" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}

export function Toast({ children, tone = 'success' }) {
  if (!children) return null
  return (
    <div className={`toast toast-${tone}`} role="status" aria-live="polite">
      {children}
    </div>
  )
}

export function ValidationMessage({ children }) {
  if (!children) return null
  return (
    <p className="validation-message" role="alert">
      {children}
    </p>
  )
}

export function LoadingState({ label = 'Memuat data...' }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
