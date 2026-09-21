import { ProductCard } from "./ProductCard";

export const ProductGrid = ({ products = [], className = "lg:grid-cols-4" }) => (
  <div className={`grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 ${className}`}>
    {products.map((product) => <ProductCard key={product.id} product={product} />)}
  </div>
);
