import { uploadsUrl } from "../api/axios";

const productImage = (image) => {
  if (!image) return "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=300&q=80";
  if (image.startsWith("http")) return image;
  return `${uploadsUrl}${image.replace("/uploads", "")}`;
};

const AdminProductCell = ({ image, name, meta }) => (
  <div className="flex min-w-[240px] items-center gap-3">
    <img src={productImage(image)} alt={name} className="h-14 w-14 rounded-2xl border border-gold/20 object-cover shadow-soft" />
    <div>
      <p className="font-bold">{name}</p>
      {meta && <p className="mt-1 text-xs font-medium text-elegantgray">{meta}</p>}
    </div>
  </div>
);

export default AdminProductCell;
