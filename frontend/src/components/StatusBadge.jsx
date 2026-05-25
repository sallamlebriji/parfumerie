const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-gold/10 text-gold",
    confirmed: "bg-blue-50 text-blue-700",
    cancelled: "bg-red-50 text-red-700",
    delivered: "bg-green-50 text-green-700"
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles[status] || styles.pending}`}>{status}</span>;
};

export default StatusBadge;
