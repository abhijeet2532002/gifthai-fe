import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const ProductCard = ({ product }: { product: Product }) => {
  const { add } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    add(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition-smooth hover:-translate-y-1 hover:shadow-elegant"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover transition-smooth group-hover:scale-105"
        />
        {product.compareAt && (
          <Badge className="absolute left-3 top-3 bg-foreground text-background">
            Save ${product.compareAt - product.price}
          </Badge>
        )}
        <button
          onClick={handleAdd}
          className="absolute bottom-3 right-3 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-elegant transition-smooth group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110"
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {product.category}
        </p>
        <h3 className="font-display text-lg font-semibold leading-tight">{product.name}</h3>
        <p className="line-clamp-1 text-sm text-muted-foreground">{product.tagline}</p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-lg font-semibold">${product.price}</span>
          {product.compareAt && (
            <span className="text-sm text-muted-foreground line-through">${product.compareAt}</span>
          )}
        </div>
      </div>
    </Link>
  );
};
