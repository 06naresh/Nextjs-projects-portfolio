import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import Navigation from "@/components/navigation";
import CartSidebar from "@/components/cart-sidebar";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Star, Heart, Share, Truck, RotateCcw, Shield, Minus, Plus } from "lucide-react";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", id],
    enabled: !!id,
  });

  if (!id) {
    return <div>Invalid product ID</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <div className="bg-gray-200 rounded-lg h-96 mb-4"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-lg h-20"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-200 h-8 rounded w-3/4"></div>
                <div className="bg-gray-200 h-6 rounded w-1/2"></div>
                <div className="bg-gray-200 h-10 rounded w-1/4"></div>
                <div className="bg-gray-200 h-32 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4" data-testid="text-not-found">Product not found</h1>
            <Link href="/products">
              <Button data-testid="button-back-to-products">Back to Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = [
    product.imageUrl || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    "https://images.unsplash.com/photo-1587831990711-23ca6441447b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  ];

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  const increaseQuantity = () => setQuantity(q => q + 1);
  const decreaseQuantity = () => setQuantity(q => Math.max(1, q - 1));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <CartSidebar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb" data-testid="nav-breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <Link href="/" className="text-muted-foreground hover:text-foreground" data-testid="link-home">
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />
            </li>
            <li>
              <Link href="/products" className="text-muted-foreground hover:text-foreground" data-testid="link-products">
                Products
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />
            </li>
            <li className="text-foreground font-medium" data-testid="text-current-product">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full rounded-lg shadow-lg mb-4 object-cover h-96"
              data-testid="img-product-main"
            />
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className={`w-full h-20 object-cover rounded-lg cursor-pointer border-2 ${
                    selectedImage === index ? "border-primary" : "border-border"
                  }`}
                  onClick={() => setSelectedImage(index)}
                  data-testid={`img-product-thumb-${index}`}
                />
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div>
            <h1 className="text-3xl font-bold mb-4" data-testid="text-product-name">
              {product.name}
            </h1>
            
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-muted-foreground" data-testid="text-reviews">(124 reviews)</span>
            </div>
            
            <div className="text-3xl font-bold text-primary mb-6" data-testid="text-product-price">
              ${product.price}
            </div>

            {product.category && (
              <Badge variant="secondary" className="mb-4" data-testid="badge-category">
                {product.category}
              </Badge>
            )}
            
            {product.description && (
              <div className="prose max-w-none mb-6">
                <p className="text-muted-foreground" data-testid="text-product-description">
                  {product.description}
                </p>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock && product.stock > 0 ? (
                <Badge variant="outline" className="text-green-600 border-green-600" data-testid="badge-in-stock">
                  In Stock ({product.stock} available)
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-600 border-red-600" data-testid="badge-out-of-stock">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  data-testid="button-decrease-quantity"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-lg font-medium min-w-[2rem] text-center" data-testid="text-quantity">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={increaseQuantity}
                  disabled={!product.stock || quantity >= product.stock}
                  data-testid="button-increase-quantity"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-6">
              <Button
                onClick={handleAddToCart}
                disabled={!product.stock || product.stock <= 0}
                className="flex-1"
                data-testid="button-add-to-cart"
              >
                Add to Cart
              </Button>
              <Button variant="outline" size="icon" data-testid="button-wishlist">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" data-testid="button-share">
                <Share className="w-5 h-5" />
              </Button>
            </div>

            {/* Shipping Info */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center" data-testid="div-shipping-info">
                    <Truck className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm">Free shipping on orders over $500</span>
                  </div>
                  <div className="flex items-center" data-testid="div-return-info">
                    <RotateCcw className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm">30-day return policy</span>
                  </div>
                  <div className="flex items-center" data-testid="div-warranty-info">
                    <Shield className="w-5 h-5 text-purple-500 mr-2" />
                    <span className="text-sm">2-year warranty included</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
