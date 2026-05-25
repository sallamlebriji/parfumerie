const LoadingSpinner = ({ label = "Chargement..." }) => (
  <div className="flex min-h-48 items-center justify-center gap-3 text-elegantgray">
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-gold border-t-transparent" />
    <span className="text-sm font-semibold">{label}</span>
  </div>
);

export default LoadingSpinner;
