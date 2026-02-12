type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = 'Confirmar',
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div 
      className="
        fixed inset-0 z-50 flex items-center justify-center 
        bg-black/30"
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-sm
        shadow-lg"
      >
        <h2 className="text-h3 mb-2">{title}</h2>

        {description && (
          <p className="text-sm text-text-muted mb-4">
            {description}
          </p>
        )}

        <div
          className="flex justify-end gap-3"
        >
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-xl bg-surface
              hover:bg-border" 
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-4 text-sm rounded-xl bg-danger
            text-white hover:opacity-90"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}