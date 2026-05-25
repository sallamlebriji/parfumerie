import { X } from "lucide-react";
import { Button } from "./Button";

export const Modal = ({ open, title, children, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[28px] border border-[#C8A96A]/25 bg-[#F8F5EF] p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-title text-3xl font-black">{title}</h3>
          <Button variant="ghost" onClick={onClose} className="px-3 py-3"><X size={18} /></Button>
        </div>
        {children}
      </div>
    </div>
  );
};
