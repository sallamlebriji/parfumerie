import LuxuryButton from "./LuxuryButton";

const ConfirmModal = ({ open, title, text, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm">
      <div className="glass-panel max-w-md p-7">
        <h3 className="text-2xl font-black">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-elegantgray">{text}</p>
        <div className="mt-7 flex justify-end gap-3">
          <LuxuryButton variant="outline" onClick={onCancel}>Annuler</LuxuryButton>
          <LuxuryButton variant="gold" onClick={onConfirm}>Confirmer</LuxuryButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
