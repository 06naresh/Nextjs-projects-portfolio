import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Search, ShoppingCart, User, ChevronDown, LogOut, Package, Settings } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      //Implement search functionality
      console.log("Search:", searchTerm);
    }
  };

  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "U";

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-primary flex items-center" data-testid="link-home">
              <ShoppingBag className="mr-2" />
              ShopNext
            </Link>
            {isAuthenticated && (
              <div className="hidden md:flex space-x-6">
                <Link 
                  href="/" 
                  className={`transition-colors ${location === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  data-testid="link-nav-home"
                >
                  Home
                </Link>
                <Link 
                  href="/products" 
                  className={`transition-colors ${location === "/products" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  data-testid="link-nav-products"
                >
                  Products
                </Link>
                {user?.isAdmin && (
                  <Link 
                    href="/admin" 
                    className={`transition-colors ${location === "/admin" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    data-testid="link-nav-admin"
                  >
                    Admin
                  </Link>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <>
                {/* Search */}
                <form onSubmit={handleSearch} className="hidden md:flex relative">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-64"
                      data-testid="input-search"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  </div>
                </form>
                
                {/* Cart */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-2"
                  data-testid="button-cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span 
                      className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                      data-testid="text-cart-count"
                    >
                      {cartCount}
                    </span>
                  )}
                </Button>
                
                {/* User Menu */}
                <div className="relative" ref={menuRef}>
                  <Button
                    variant="ghost"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2"
                    data-testid="button-user-menu"
                  >
                    {user?.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {userInitials}
                      </div>
                    )}
                    <span className="hidden md:inline">
                      {user?.firstName || user?.email || "User"}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-popover rounded-lg shadow-lg border border-border z-50">
                      <div className="py-1">
                        <Link href="/profile">
                          <button 
                            className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center"
                            onClick={() => setIsUserMenuOpen(false)}
                            data-testid="link-profile"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Profile
                          </button>
                        </Link>
                        <Link href="/orders">
                          <button 
                            className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center"
                            onClick={() => setIsUserMenuOpen(false)}
                            data-testid="link-orders"
                          >
                            <Package className="w-4 h-4 mr-2" />
                            Order History
                          </button>
                        </Link>
                        {user?.isAdmin && (
                          <Link href="/admin">
                            <button 
                              className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center"
                              onClick={() => setIsUserMenuOpen(false)}
                              data-testid="link-admin-panel"
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              Admin Panel
                            </button>
                          </Link>
                        )}
                        <hr className="border-border my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted flex items-center"
                          data-testid="button-logout"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
