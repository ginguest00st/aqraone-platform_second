import { Link } from "react-router";
import Badge from "./Badge";
import Button from "./Button";
import { IconStar, IconCart } from "./Icons";
import { useCart } from "../../app/contexts/CartContext";

interface Product {
  id: string;
  name: string;
  umkm: string;
  price: number;
  rating: number;
  stock: number;
  image: string;
  badge?: "hot" | "new";
}

function formatRp(n: number) {
  return "Rp" + n.toLocaleString("id-ID");
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (id: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product.id);
    } else {
      addToCart({
        productId: product.id,
        name: product.name,
        umkm: product.umkm,
        price: product.price,
        image: product.image,
        qty: 1,
      });
    }
  };
  return (
    <div
      data-figma-layer="ProductCard"
      className="bg-white rounded-[18px] overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)]"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #E8E6E1" }}
    >
      {/* Image */}
      <Link to={`/products/${product.id}`} data-figma-layer="ProductImage">
        <div className="relative h-44 bg-[#F5F4F1] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          {product.badge && (
            <div className="absolute top-2.5 left-2.5">
              <Badge variant={product.badge === "hot" ? "hot" : "new"}>
                {product.badge === "hot" ? "Terlaris" : "Baru"}
              </Badge>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4" data-figma-layer="ProductInfo">
        <p className="text-[11px] text-[#C9A227] font-semibold tracking-wide uppercase mb-1.5">{product.umkm}</p>
        <Link to={`/products/${product.id}`}>
          <h4 className="text-[13px] font-semibold text-[#1A1714] hover:text-[#C9A227] transition-colors line-clamp-2 mb-2 leading-snug">{product.name}</h4>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3" data-figma-layer="Rating">
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map((s) => (
              <IconStar
                key={s}
                className="w-3 h-3"
                stroke={s <= Math.round(product.rating) ? "#C9A227" : "#E8E6E1"}
                fill={s <= Math.round(product.rating) ? "#C9A227" : "none"}
                strokeWidth={1}
              />
            ))}
          </div>
          <span className="text-[11px] text-[#7C7770] font-medium">{product.rating}</span>
          <span className="text-[#E8E6E1] text-[11px]">·</span>
          <span className="text-[11px] text-[#ABA9A4]">Stok {product.stock}</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between" data-figma-layer="PriceCTA">
          <span className="text-[15px] font-bold text-[#1A1714]">{formatRp(product.price)}</span>
          <button
            onClick={handleAdd}
            className="w-8 h-8 rounded-[9px] bg-[#FDF6E3] border border-[#E8DDC0] text-[#C9A227] flex items-center justify-center hover:bg-[#C9A227] hover:text-white hover:border-[#C9A227] transition-all duration-200 shadow-sm cursor-pointer"
            title="Tambah ke Keranjang"
          >
            <IconCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export { formatRp };

export function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <IconStar
          key={s}
          className="w-3 h-3"
          stroke={s <= Math.round(rating) ? "#C9A227" : "#E8E6E1"}
          fill={s <= Math.round(rating) ? "#C9A227" : "none"}
          strokeWidth={1}
        />
      ))}
      <span className="text-xs text-[#7C7770] ml-1">{rating}</span>
    </div>
  );
}
