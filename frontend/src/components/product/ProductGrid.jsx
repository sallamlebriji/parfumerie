import { ProductCard } from "./ProductCard";

export const ProductGrid = ({ products, onQuickView }) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {products.map((product) => <ProductCard key={product.id} product={product} onQuickView={onQuickView} />)}
  </div>
);
