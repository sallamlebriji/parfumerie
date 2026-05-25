import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

export const ConfirmationDialog = ({ open, title = "Confirmer", text, onConfirm, onClose }) => (
  <Modal open={open} title={title} onClose={onClose}>
    <p className="leading-7 text-[#8A8A8A]">{text}</p>
    <div className="mt-8 flex justify-end gap-3">
      <Button variant="outline" onClick={onClose}>Annuler</Button>
      <Button variant="danger" onClick={onConfirm}>Confirmer</Button>
    </div>
  </Modal>
);
