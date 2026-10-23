import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { 
  Search, 
  LayoutGrid, 
  MapPin, 
  ChevronRight, 
  Heart, 
  MessageCircle, 
  Phone, 
  PlusCircle, 
  CheckCircle2, 
  Filter, 
  Tag, 
  Sparkles, 
  Sprout, 
  Fish, 
  Apple, 
  Wheat, 
  Egg, 
  Package, 
  MoreHorizontal,
  X,
  Share2,
  Calendar,
  ShieldCheck,
  Check,
  SlidersHorizontal,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Product, 
  INITIAL_PRODUCTS, 
  MARKET_CATEGORIES, 
  MARKET_LOCATIONS 
} from "@/data/marketProducts";
import { calculateCommission, recordMarketTransaction, formatPeso } from "@/lib/commission";
import heroBannerImg from "@/assets/images/market-hero-banner.jpg";

const categoryIcons: Record<string, React.ElementType> = {
  "All Products": Sprout,
  "Vegetables & Fruits": Apple,
  "Rice & Grains": Wheat,
  "Livestock & Poultry": Egg,
  "Fish & Seafood": Fish,
  "Processed Products": Package,
  "Others": MoreHorizontal,
};

const ITEMS_PER_PAGE = 8;

const Market = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("cat") || "All Products";

  // Catalog State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("kaani_market_products");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with initial products to guarantee all 8 standard items exist
          const existingIds = new Set(parsed.map((p: Product) => p.id));
          const missing = INITIAL_PRODUCTS.filter(p => !existingIds.has(p.id));
          return [...parsed, ...missing];
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PRODUCTS;
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState<string>("All Locations");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("kaani_market_favs");
      return saved ? JSON.parse(saved) : ["prod-1", "prod-4"];
    } catch {
      return ["prod-1"];
    }
  });

  // Modals
  const [contactProduct, setContactProduct] = useState<Product | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [sellSuccess, setSellSuccess] = useState(false);

  // Contact Form State
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [orderQty, setOrderQty] = useState("1");
  const [buyerMessage, setBuyerMessage] = useState("");

  // Sell Form State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    category: "Vegetables & Fruits",
    type: "Farm Product",
    price: 50,
    unit: "kg",
    availableStock: 25,
    stockUnit: "kg",
    location: "Catbalogan City, Samar",
    seller: "",
    sellerPhone: "",
    description: "",
    image: "/assets/images/market/vegetables-bundle.jpg",
  });

  // Update URL params
  useEffect(() => {
    if (searchParams.get("action") === "sell") {
      setIsSellModalOpen(true);
    }
  }, [searchParams]);

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem("kaani_market_favs", JSON.stringify(updated));
      return updated;
    });
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category match
      if (activeCategory !== "All Products" && prod.category !== activeCategory) {
        return false;
      }
      // Location match
      if (selectedLocation !== "All Locations" && prod.location !== selectedLocation) {
        return false;
      }
      // Product Type match
      if (selectedType !== "All" && prod.type !== selectedType) {
        return false;
      }
      // Price match
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      if (!isNaN(min) && prod.price < min) return false;
      if (!isNaN(max) && prod.price > max) return false;

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesSeller = prod.seller.toLowerCase().includes(q);
        const matchesLocation = prod.location.toLowerCase().includes(q);
        const matchesDesc = prod.description.toLowerCase().includes(q);
        if (!matchesName && !matchesSeller && !matchesLocation && !matchesDesc) {
          return false;
        }
      }
      return true;
    });
  }, [products, activeCategory, selectedLocation, selectedType, minPrice, maxPrice, searchQuery]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === "newest") {
      // Keep natural order or initial
      return list;
    } else if (sortBy === "price-low") {
      return list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      return list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "stock") {
      return list.sort((a, b) => b.availableStock - a.availableStock);
    } else if (sortBy === "name") {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [filteredProducts, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (category === "All Products") next.delete("cat");
      else next.set("cat", category);
      return next;
    });
  };

  const handleApplyPriceFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setActiveCategory("All Products");
    setSelectedLocation("All Locations");
    setSelectedType("All");
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setNewProduct((prev) => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone || !contactProduct) return;

    // Record idempotent market transaction with 5% platform commission
    const totalAmount = (contactProduct.price || 0) * (Math.max(1, parseInt(orderQty) || 1));
    recordMarketTransaction({
      productId: contactProduct.id,
      productName: contactProduct.name,
      sellerName: contactProduct.seller,
      buyerName: buyerName.trim(),
      price: totalAmount,
    });

    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactProduct(null);
      setBuyerName("");
      setBuyerPhone("");
      setBuyerMessage("");
    }, 2200);
  };

  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.seller) return;

    const created: Product = {
      id: `custom-${Date.now()}`,
      name: newProduct.name || "Local Harvest",
      category: (newProduct.category as any) || "Vegetables & Fruits",
      type: (newProduct.type as any) || "Farm Product",
      seller: newProduct.seller || "Local Farmer",
      sellerPhone: newProduct.sellerPhone || "+63 900 000 0000",
      location: newProduct.location || "Catbalogan City, Samar",
      price: Number(newProduct.price) || 50,
      unit: newProduct.unit || "kg",
      availableStock: Number(newProduct.availableStock) || 20,
      stockUnit: newProduct.stockUnit || "kg",
      image: newProduct.image || "/assets/images/market/vegetables-bundle.jpg",
      description: newProduct.description || "Freshly harvested and locally grown with care.",
      harvestDate: "Just listed",
      rating: 5.0,
      isFeatured: true,
      createdAt: new Date().toISOString(),
    };

    const updatedList = [created, ...products];
    setProducts(updatedList);
    try {
      localStorage.setItem("kaani_market_products", JSON.stringify(updatedList));
    } catch (err) {
      console.error(err);
    }

    setSellSuccess(true);
    setTimeout(() => {
      setSellSuccess(false);
      setIsSellModalOpen(false);
      setNewProduct({
        name: "",
        category: "Vegetables & Fruits",
        type: "Farm Product",
        price: 50,
        unit: "kg",
        availableStock: 25,
        stockUnit: "kg",
        location: "Catbalogan City, Samar",
        seller: "",
        sellerPhone: "",
        description: "",
        image: "/assets/images/market/vegetables-bundle.jpg",
      });
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      <Header />

      {/* Main Hero Banner Matching Reference Image */}
      <section className="relative overflow-hidden bg-emerald-950 text-white min-h-[260px] md:min-h-[300px] lg:min-h-[320px] flex items-center">
        {/* Scenic Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
          style={{ backgroundImage: `url(${heroBannerImg})` }}
          role="img"
          aria-label="Philippine farmer and coastal fishery view"
        />

        {/* Gradient Overlay for crystal clear typography */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/75 to-transparent sm:via-emerald-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-black/20" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10 py-8 md:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left Content */}
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/90 text-white shadow-sm ring-1 ring-white/30">
                  <Sprout className="h-5 w-5 text-emerald-100" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-heading text-white">
                  Kaani Market
                </h1>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-snug">
                Fresh from our farms and waters.
              </h2>

              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-xl">
                Discover local agricultural and fisheries products from farmers and fisherfolk. Supporting local livelihoods and sustainable food security.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => setIsSellModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-4 py-2 text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  List Your Harvest
                </Button>
                <a
                  href="#featured-products"
                  className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-white/15 hover:bg-white/25 text-white backdrop-blur-xs border border-white/20 transition-all"
                >
                  Browse Catalog &darr;
                </a>
              </div>
            </div>

            {/* Right Side Script Accent */}
            <div className="hidden md:flex flex-col items-end justify-center pr-4">
              <div className="rotate-[-2deg] text-right">
                <span className="font-script text-3xl lg:text-4xl xl:text-5xl text-emerald-100 font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] leading-tight block">
                  Support Local
                </span>
                <span className="font-script text-3xl lg:text-4xl xl:text-5xl text-emerald-200 font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] leading-tight block">
                  Farmers and Fisherfolk
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Marketplace Area */}
      <main id="featured-products" className="container mx-auto px-4 lg:px-8 py-8 md:py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR FILTERS (3 cols on desktop) */}
          <aside className="lg:col-span-3 space-y-6">
            
            {/* Categories Card */}
            <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-emerald-100/80">
                <LayoutGrid className="h-5 w-5 text-emerald-700" />
                <h3 className="font-extrabold text-base font-heading text-slate-800">
                  Categories
                </h3>
              </div>

              <div className="space-y-1.5">
                {MARKET_CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  const Icon = categoryIcons[cat] || Sprout;
                  const count = cat === "All Products" 
                    ? products.length 
                    : products.filter(p => p.category === cat).length;

                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                        isActive
                          ? "bg-[#0d533a] text-white shadow-xs font-bold"
                          : "text-slate-700 hover:text-emerald-900 hover:bg-emerald-50/70"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-emerald-200" : "text-emerald-700"}`} />
                        <span className="truncate">{cat}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          isActive ? "bg-emerald-900/50 text-emerald-100" : "bg-slate-100 text-slate-500"
                        }`}>
                          {count}
                        </span>
                        <ChevronRight className={`h-4 w-4 ${isActive ? "text-emerald-200" : "text-slate-400"}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location Filter Card */}
            <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm font-heading">
                <MapPin className="h-4.5 w-4.5 text-emerald-700" />
                <span>Location</span>
              </div>
              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#f8faf9] border border-emerald-200 text-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
              >
                {MARKET_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter Card */}
            <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm font-heading">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  &#8369;
                </span>
                <span>Price Range</span>
              </div>

              <form onSubmit={handleApplyPriceFilter} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Min (&#8369;)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full bg-[#f8faf9] border border-emerald-200 rounded-xl px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Max (&#8369;)</label>
                    <input
                      type="number"
                      placeholder="1000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-[#f8faf9] border border-emerald-200 rounded-xl px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    type="submit"
                    className="flex-1 bg-[#0d533a] hover:bg-[#093c2a] text-white font-bold rounded-xl py-2 text-xs shadow-xs"
                  >
                    Apply Filters
                  </Button>
                  {(minPrice || maxPrice || activeCategory !== "All Products" || selectedLocation !== "All Locations" || searchQuery) && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResetFilters}
                      className="px-2.5 rounded-xl border-emerald-200 text-slate-600 text-xs hover:bg-rose-50 hover:text-rose-600"
                      title="Reset all filters"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </form>
            </div>

            {/* Seller Producer CTA Box */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-emerald-800 to-teal-900 text-white space-y-3 shadow-md">
              <div className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-emerald-300" />
                <h4 className="font-extrabold text-sm font-heading">Are You a Producer?</h4>
              </div>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Connect directly with consumers, restaurants, and cooperatives. Free listing for smallholder farmers and coastal fisherfolk.
              </p>
              <Button
                onClick={() => setIsSellModalOpen(true)}
                className="w-full bg-white text-emerald-950 hover:bg-emerald-50 font-bold rounded-xl py-2 text-xs shadow-xs"
              >
                + Post Your Produce
              </Button>
            </div>
          </aside>

          {/* MAIN CONTENT AREA (9 cols on desktop) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Top Search Bar */}
            <div className="bg-white rounded-2xl p-2.5 border border-emerald-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-emerald-700" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search for products (e.g. tilapia, tomatoes, rice...)"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8faf9] border border-emerald-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button
                  onClick={() => setCurrentPage(1)}
                  className="bg-[#0d533a] hover:bg-[#093c2a] text-white font-bold rounded-xl px-6 py-2.5 text-sm shrink-0 shadow-xs"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Horizontal Category Quick Pills */}
            <div className="overflow-x-auto pb-1 -mx-2 px-2 scrollbar-none">
              <div className="flex items-center gap-2 min-w-max">
                {MARKET_CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  const Icon = categoryIcons[cat] || Sprout;
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-2xs ${
                        isActive
                          ? "bg-[#0d533a] text-white font-bold shadow-xs scale-102"
                          : "bg-white text-slate-700 border border-emerald-100/90 hover:bg-emerald-50 hover:text-emerald-900"
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${isActive ? "text-emerald-200" : "text-emerald-700"}`} />
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section Header: Featured Products & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-b border-emerald-100/80 pb-3">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 font-heading">
                  Featured Products
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Showing {sortedProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, sortedProducts.length)} of {sortedProducts.length} local items
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Sector filter */}
                <div className="flex items-center bg-white border border-emerald-100 rounded-xl p-1 text-xs font-semibold text-slate-600">
                  <button
                    onClick={() => { setSelectedType("All"); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${selectedType === "All" ? "bg-emerald-800 text-white" : "hover:text-emerald-800"}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => { setSelectedType("Farm Product"); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${selectedType === "Farm Product" ? "bg-emerald-800 text-white" : "hover:text-emerald-800"}`}
                  >
                    Farms
                  </button>
                  <button
                    onClick={() => { setSelectedType("Fishery Product"); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${selectedType === "Fishery Product" ? "bg-emerald-800 text-white" : "hover:text-emerald-800"}`}
                  >
                    Fisheries
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <span className="hidden sm:inline">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-emerald-200 text-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="stock">Highest Stock</option>
                    <option value="name">Product Name (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PRODUCT GRID (4 columns on lg/xl desktop) */}
            {paginatedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-emerald-100 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No products found</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  We couldn't find any products matching your current filters. Try selecting a different category or clearing your search.
                </p>
                <Button
                  onClick={handleResetFilters}
                  className="bg-[#0d533a] hover:bg-[#093c2a] text-white font-bold rounded-xl px-5"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {paginatedProducts.map((prod) => {
                  const isFav = favorites.includes(prod.id);
                  const isFarm = prod.type === "Farm Product";
                  const isFishery = prod.type === "Fishery Product";

                  return (
                    <div
                      key={prod.id}
                      onClick={() => setDetailProduct(prod)}
                      className="group bg-white rounded-2xl border border-emerald-100/90 overflow-hidden shadow-[0_4px_16px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_-6px_rgba(13,83,58,0.12)] hover:border-emerald-300 transition-all duration-300 flex flex-col cursor-pointer"
                    >
                      {/* Product Image & Badges */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-emerald-50/50">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/assets/images/market/vegetables-bundle.jpg";
                          }}
                        />

                        {/* Verified Direct Trade Badge */}
                        <div className="absolute bottom-2 right-2 bg-emerald-950/75 backdrop-blur-xs text-emerald-200 text-[9px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                          <ShieldCheck className="h-3 w-3 text-emerald-400" />
                          <span>95% Seller Direct</span>
                        </div>

                        {/* Top-Left Category Badge */}
                        <div className="absolute top-2.5 left-2.5">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide shadow-xs ${
                              isFarm
                                ? "bg-emerald-700 text-white"
                                : isFishery
                                ? "bg-sky-600 text-white"
                                : "bg-teal-700 text-white"
                            }`}
                          >
                            {prod.type}
                          </span>
                        </div>

                        {/* Top-Right Favorite Heart Button */}
                        <button
                          onClick={(e) => toggleFavorite(prod.id, e)}
                          className="absolute top-2.5 right-2.5 w-7.5 h-7.5 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-rose-600 flex items-center justify-center shadow-sm transition-all active:scale-90"
                          title={isFav ? "Remove from favorites" : "Save to favorites"}
                          aria-label="Favorite"
                        >
                          <Heart
                            className={`h-4 w-4 transition-colors ${
                              isFav ? "fill-rose-500 text-rose-500" : "text-slate-500"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          {/* Title */}
                          <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                            {prod.name}
                          </h3>

                          {/* Producer & Location Meta */}
                          <div className="space-y-1 mt-1.5 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              <span className="font-medium text-slate-700 truncate">{prod.seller}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500 truncate">
                              <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
                              <span className="truncate">{prod.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 space-y-2.5">
                          {/* Price & Available Stock */}
                          <div className="flex items-baseline justify-between">
                            <div className="flex items-baseline gap-1">
                              <span className="text-base font-black text-emerald-800">
                                &#8369; {prod.price.toFixed(2)}
                              </span>
                              <span className="text-[11px] font-semibold text-slate-500">
                                / {prod.unit}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 font-medium">
                              Available: {prod.availableStock} {prod.stockUnit}
                            </span>
                          </div>

                          {/* Contact Seller Button */}
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setContactProduct(prod);
                            }}
                            className="w-full bg-[#0d533a] hover:bg-[#093c2a] text-white font-bold rounded-xl py-2 text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            Contact Seller
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Matching Reference Layout */}
            {totalPages > 1 && (
              <div className="pt-6 pb-2 flex items-center justify-center gap-1.5 text-sm">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-emerald-100 text-slate-600 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs"
                >
                  &larr; Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      currentPage === page
                        ? "bg-[#0d533a] text-white shadow-xs"
                        : "text-slate-700 hover:bg-emerald-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-emerald-100 text-slate-600 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs"
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* CONTACT SELLER MODAL */}
      <Dialog open={!!contactProduct} onOpenChange={(open) => !open && setContactProduct(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white border border-emerald-100 shadow-2xl">
          {contactProduct && (
            <div>
              <DialogHeader className="pb-3 border-b border-emerald-100 text-left">
                <DialogTitle className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-emerald-700" />
                  Contact Local Producer
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Direct connection with the farmer or fisherfolk. No middleman markups.
                </DialogDescription>
              </DialogHeader>

              {contactSuccess ? (
                <div className="py-8 text-center space-y-3 animate-in fade-in zoom-in-95">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Inquiry Sent Successfully!</h4>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto">
                    {contactProduct.seller} will receive your message and order details shortly.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 pt-4">
                  {/* Item Summary Card */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                    <img
                      src={contactProduct.image}
                      alt={contactProduct.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-900 truncate">{contactProduct.name}</p>
                      <p className="text-xs text-slate-600 truncate">{contactProduct.location}</p>
                      <p className="text-xs font-bold text-emerald-800">
                        &#8369; {contactProduct.price.toFixed(2)} / {contactProduct.unit}
                      </p>
                    </div>
                  </div>

                  {/* Seller Direct Info */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-500 uppercase font-semibold">Producer</span>
                        <p className="text-sm font-bold text-slate-800">{contactProduct.seller}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="h-3 w-3" />
                        Verified
                      </span>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <a
                        href={`tel:${contactProduct.sellerPhone}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-50 transition-colors shadow-2xs"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        Call ({contactProduct.sellerPhone})
                      </a>
                      <a
                        href={`sms:${contactProduct.sellerPhone}?body=Hello ${encodeURIComponent(contactProduct.seller)}, I saw your ${encodeURIComponent(contactProduct.name)} on Kaani Web.`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-colors shadow-2xs"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Send SMS
                      </a>
                    </div>
                  </div>

                  {/* Message inquiry form */}
                  <form onSubmit={handleContactSubmit} className="space-y-3 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Your Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Juan Dela Cruz"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-emerald-200 bg-[#f8faf9] focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Contact Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="0917-000-0000"
                          value={buyerPhone}
                          onChange={(e) => setBuyerPhone(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-emerald-200 bg-[#f8faf9] focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Quantity Needed ({contactProduct.stockUnit})
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={contactProduct.availableStock}
                        value={orderQty}
                        onChange={(e) => setOrderQty(e.target.value)}
                        className="w-full text-xs p-2 rounded-xl border border-emerald-200 bg-[#f8faf9] focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Message / Inquiries</label>
                      <textarea
                        rows={2}
                        placeholder="Hi! Is this available for delivery or pickup in town?"
                        value={buyerMessage}
                        onChange={(e) => setBuyerMessage(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-emerald-200 bg-[#f8faf9] focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    {/* Order & Commission Breakdown */}
                    {contactProduct && (() => {
                      const qty = Math.max(1, parseInt(orderQty) || 1);
                      const subtotal = (contactProduct.price || 0) * qty;
                      const comm = calculateCommission(subtotal);
                      return (
                        <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs space-y-1.5">
                          <div className="flex justify-between items-center text-slate-700">
                            <span>Estimated Total ({qty} {contactProduct.unit}):</span>
                            <span className="font-bold text-slate-900">{formatPeso(subtotal)}</span>
                          </div>
                          <div className="flex justify-between items-center text-emerald-800 text-[11px]">
                            <span>5% Sustainable Community Fee (included):</span>
                            <span className="font-semibold">{formatPeso(comm.platformFee)}</span>
                          </div>
                          <div className="flex justify-between items-center text-emerald-950 font-bold pt-1 border-t border-emerald-200/60">
                            <span>Direct Payout to {contactProduct.seller}:</span>
                            <span className="text-emerald-900 font-extrabold">{formatPeso(comm.sellerNet)} (95%)</span>
                          </div>
                        </div>
                      );
                    })()}

                    <Button
                      type="submit"
                      className="w-full bg-[#0d533a] hover:bg-[#093c2a] text-white font-bold rounded-xl py-2.5 text-xs shadow-sm transition-all active:scale-98"
                    >
                      Submit In-App Inquiry & Reserve
                    </Button>
                  </form>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* PRODUCT DETAILS MODAL */}
      <Dialog open={!!detailProduct} onOpenChange={(open) => !open && setDetailProduct(null)}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-6 bg-white border border-emerald-100 shadow-2xl">
          {detailProduct && (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={detailProduct.image}
                  alt={detailProduct.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-lg bg-emerald-800 text-white shadow-sm">
                  {detailProduct.type}
                </span>
                <span className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-lg bg-white/90 text-slate-800 shadow-sm backdrop-blur-xs">
                  {detailProduct.category}
                </span>
              </div>

              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold font-heading text-slate-900">
                      {detailProduct.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-emerald-700" />
                      {detailProduct.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-emerald-800">
                      &#8369; {detailProduct.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500 font-semibold">per {detailProduct.unit}</p>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Available Quantity:</span>
                    <span className="font-bold text-slate-800">{detailProduct.availableStock} {detailProduct.stockUnit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Harvest / Catch Info:</span>
                    <span className="font-bold text-slate-800">{detailProduct.harvestDate || "Fresh Batch"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Registered Producer:</span>
                    <span className="font-bold text-emerald-900">{detailProduct.seller}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Product Description
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {detailProduct.description}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <Button
                  onClick={() => {
                    const prod = detailProduct;
                    setDetailProduct(null);
                    setContactProduct(prod);
                  }}
                  className="flex-1 bg-[#0d533a] hover:bg-[#093c2a] text-white font-bold rounded-xl py-2.5 text-sm shadow-xs flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact {detailProduct.seller}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDetailProduct(null)}
                  className="rounded-xl border-slate-200"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* SELL PRODUCE MODAL (For farmers & fisherfolk) */}
      <Dialog open={isSellModalOpen} onOpenChange={setIsSellModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-6 bg-white border border-emerald-100 shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-3 border-b border-emerald-100 text-left">
            <DialogTitle className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-emerald-700" />
              List Your Produce / Catch
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Promote and sell your agriculture or fisheries products directly to buyers.
            </DialogDescription>
          </DialogHeader>

          {sellSuccess ? (
            <div className="py-8 text-center space-y-3 animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Check className="h-8 w-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Your Harvest is Live!</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Your product has been added to the Kaani Market catalog for buyers to browse.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSellSubmit} className="space-y-3.5 pt-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Red Tilapia, Native Tomatoes, Organic Saba..."
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-emerald-200 bg-[#f8faf9] focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Category *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded-xl border border-emerald-200 bg-[#f8faf9] focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                  >
                    {MARKET_CATEGORIES.filter(c => c !== "All Products").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Product Type *
                  </label>
                  <select
                    value={newProduct.type}
                    onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded-xl border border-emerald-200 bg-[#f8faf9] focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                  >
                    <option value="Farm Product">Farm Product</option>
                    <option value="Fishery Product">Fishery Product</option>
                    <option value="Processed Product">Processed Product</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Price (&#8369;) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    placeholder="50"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                    className="w-full text-xs p-2 rounded-xl border border-emerald-200 bg-[#f8faf9]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Unit</label>
                  <select
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    className="w-full text-xs p-2 rounded-xl border border-emerald-200 bg-[#f8faf9]"
                  >
                    <option value="kg">kg</option>
                    <option value="pack">pack</option>
                    <option value="sack">sack</option>
                    <option value="bottle">bottle</option>
                    <option value="piece">piece</option>
                    <option value="tali">tali / bundle</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    placeholder="50"
                    value={newProduct.availableStock}
                    onChange={(e) => setNewProduct({ ...newProduct, availableStock: parseInt(e.target.value) })}
                    className="w-full text-xs p-2 rounded-xl border border-emerald-200 bg-[#f8faf9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Mang Juan"
                    value={newProduct.seller}
                    onChange={(e) => setNewProduct({ ...newProduct, seller: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-emerald-200 bg-[#f8faf9]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+63 917 000 0000"
                    value={newProduct.sellerPhone}
                    onChange={(e) => setNewProduct({ ...newProduct, sellerPhone: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-emerald-200 bg-[#f8faf9]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Location *</label>
                <select
                  value={newProduct.location}
                  onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-emerald-200 bg-[#f8faf9]"
                >
                  {MARKET_LOCATIONS.filter(l => l !== "All Locations").map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Produce Photo Upload & Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Product Photo *
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative w-20 h-16 rounded-xl overflow-hidden border border-emerald-200 bg-slate-100 shrink-0">
                    <img 
                      src={newProduct.image || "/assets/images/market/vegetables-bundle.jpg"} 
                      alt="Product preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/assets/images/market/vegetables-bundle.jpg";
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 cursor-pointer transition-colors">
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>Upload Photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageFileChange} 
                        className="hidden" 
                      />
                    </label>
                    <p className="text-[10px] text-slate-500">
                      Upload from phone/camera or pick a preset below:
                    </p>
                  </div>
                </div>

                {/* Quick Preset Photo Picker */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[
                    { label: "Vegetables", src: "/assets/images/market/vegetables-bundle.jpg" },
                    { label: "Tilapia", src: "/assets/images/market/fresh-tilapia.jpg" },
                    { label: "Shrimp", src: "/assets/images/market/fresh-shrimp.jpg" },
                    { label: "Rice", src: "/assets/images/market/sinandomeng-rice.jpg" },
                    { label: "Mud Crab", src: "/assets/images/market/mud-crab.jpg" },
                    { label: "Chicken", src: "/assets/images/market/native-chicken.jpg" },
                    { label: "Banana", src: "/assets/images/market/saba-banana.jpg" },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setNewProduct((prev) => ({ ...prev, image: preset.src }))}
                      className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all ${
                        newProduct.image === preset.src
                          ? "bg-emerald-800 text-white border-emerald-800 font-bold"
                          : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5% Market Commission Live Calculator Preview */}
              {(() => {
                const priceVal = Number(newProduct.price) || 0;
                const comm = calculateCommission(priceVal);
                return (
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-teal-50/60 border border-emerald-200/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-emerald-700" />
                        5% Community Trade Model
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                        95% Seller Direct
                      </span>
                    </div>

                    <div className="space-y-1 text-slate-600 text-[11px] pt-1 border-t border-emerald-200/50">
                      <div className="flex justify-between">
                        <span>Listing Price (Buyer pays):</span>
                        <span className="font-semibold text-slate-800">{formatPeso(comm.grossPrice)}</span>
                      </div>
                      <div className="flex justify-between text-emerald-800">
                        <span>5% Sustainable Platform & Compliance Fee:</span>
                        <span className="font-semibold">-{formatPeso(comm.platformFee)}</span>
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-emerald-200/70 flex justify-between items-center text-slate-900 font-bold">
                      <span className="text-emerald-950">Your Direct Net Take-Home (95%):</span>
                      <span className="text-sm font-extrabold text-emerald-900 bg-white/80 px-2 py-0.5 rounded-lg border border-emerald-200">
                        {formatPeso(comm.sellerNet)}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 italic leading-snug">
                      The 5% fee helps maintain municipal fisheries compliance, seller verification, and local direct trade logistics.
                    </p>
                  </div>
                );
              })()}

              <Button
                type="submit"
                className="w-full bg-[#0d533a] hover:bg-[#093c2a] text-white font-bold rounded-xl py-2.5 text-xs shadow-md transition-all active:scale-98"
              >
                Publish to Marketplace
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Market;
