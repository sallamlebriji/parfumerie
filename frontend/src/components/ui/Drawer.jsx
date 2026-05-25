export const Drawer = ({ open, children, onClose }) => (
  <div className={`fixed inset-0 z-[80] transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
    <button className={`absolute inset-0 bg-black/45 transition ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} aria-label="Fermer" />
    <aside className={`absolute right-0 top-0 h-full w-full max-w-md bg-[#F8F5EF] p-6 shadow-2xl transition duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>{children}</aside>
  </div>
);
