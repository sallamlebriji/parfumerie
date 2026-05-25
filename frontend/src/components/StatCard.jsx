const StatCard = ({ icon: Icon, label, value }) => (
  <div className="panel p-6 transition duration-300 hover:-translate-y-1 hover:shadow-luxury">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
      <Icon size={22} />
    </div>
    <p className="mt-5 text-sm font-semibold text-elegantgray">{label}</p>
    <p className="mt-1 text-3xl font-black">{value}</p>
  </div>
);

export default StatCard;
