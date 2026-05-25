const AdminHeader = ({ title, eyebrow, action }) => (
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div>
      {eyebrow && <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-gold">{eyebrow}</p>}
      <h1 className="mt-2 text-4xl font-black">{title}</h1>
    </div>
    {action}
  </div>
);

export default AdminHeader;
