import { Product } from "@/lib/schema";
import { Link } from "wouter";
import { Star, StarHalf, ShoppingCart, Heart, Eye, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product.id);
  };

  // Function to render rating stars
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-amber-400 text-amber-400" />);
    }

    // Half star
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-amber-400 text-amber-400" />);
    }

    // Empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-amber-400" />);
    }

    return stars;
  };

  // Calculate the discount percentage
  const discountPercentage = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  // Format prices with commas for thousands
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <Card
      className="rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-amber-200 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden relative">
          <img
            src={product.image}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700 filter brightness-[0.98]",
              isHovered ? "scale-110 brightness-95" : "scale-100"
            )}
          />

          {/* Quick action buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full w-9 h-9 bg-white shadow-md text-slate-700 hover:text-amber-500 hover:bg-white hover:shadow-amber-200"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full w-9 h-9 bg-white shadow-md text-slate-700 hover:text-amber-500 hover:bg-white hover:shadow-amber-200"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          {/* Sale badge */}
          {discountPercentage && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-md">
              {discountPercentage}% OFF
            </div>
          )}

          {/* Popular badge */}
          {product.isPopular && !discountPercentage && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-md">
              POPULAR
            </div>
          )}

          {/* Featured badge */}
          {product.isFeatured && !product.isPopular && !discountPercentage && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-slate-700 to-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-md">
              FEATURED
            </div>
          )}

          {/* Hover overlay with quick view button */}
          <div className={cn(
            "absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <Button
              className="bg-white text-slate-800 hover:bg-amber-50 hover:text-amber-600 font-medium rounded-md shadow-lg"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              Quick View
            </Button>
          </div>
        </div>

        <CardContent className="p-5">
          <div className="flex items-center mb-2">
            <div className="flex text-amber-400">
              {renderRatingStars(product.rating || 0)}
            </div>
            <span className="text-slate-500 text-sm ml-1.5">({product.ratingCount || 0})</span>
          </div>

          <h3 className="font-semibold text-slate-800 mb-1.5 group-hover:text-amber-600 transition-colors duration-300 line-clamp-1 text-base">{product.name}</h3>

          <p className="text-slate-500 text-sm mb-4 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {product.oldPrice && (
                <span className="text-slate-400 text-sm line-through">${formatPrice(product.oldPrice)}</span>
              )}
              <span className="text-slate-800 font-bold text-lg">${formatPrice(product.price)}</span>
            </div>

            <div className={cn(
              "text-xs font-medium px-2 py-1 rounded",
              product.stock > 10
                ? "bg-green-50 text-green-600"
                : product.stock > 0
                  ? "bg-amber-50 text-amber-600"
                  : "bg-red-50 text-red-600"
            )}>
              {product.stock > 10
                ? "In Stock"
                : product.stock > 0
                  ? `Only ${product.stock} left`
                  : "Out of Stock"}
            </div>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="px-5 pb-5 pt-0">
        <div className="w-full flex gap-2">
          <Button
            className={cn(
              "flex-1 py-2.5 rounded-md transition-all duration-300 flex items-center justify-center font-medium",
              isHovered
                ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md"
                : "bg-slate-100 hover:bg-amber-500 hover:text-white text-slate-800"
            )}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>

          <Button
            variant="outline"
            className="py-2.5 px-3 rounded-md border-slate-200 text-slate-800 hover:border-amber-200 hover:text-amber-600 hover:bg-amber-50"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
