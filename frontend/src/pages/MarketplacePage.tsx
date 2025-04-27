import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Plus, Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListItemModal } from "@/components/marketplace/ListItemModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { FilterModal } from "@/components/marketplace/FilterModal";
import { ItemCard } from "@/components/marketplace/ItemCard";
import { ItemDetailsModal } from "@/components/marketplace/ItemDetailsModal";
import { Badge } from "@/components/ui/badge";
import { ChatModal } from "@/components/marketplace/ChatModal";

const items = [
  {
    id: "1",
    title: "Math Textbook (8th Edition)",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    seller: "Alex Johnson",
    condition: "Like New",
    category: "Books",
    postedTime: "2 days ago",
    description: "Barely used calculus textbook for Math 101. No highlights or notes inside. Perfect condition."
  },
  {
    id: "2",
    title: "Scientific Calculator - TI-84 Plus",
    price: 200.00,
    image: "https://www.sitaramstationers.com/wp-content/uploads/2020/07/casio-scientific-calculator-fx-991ms.jpeg",
    seller: "Jordan Smith",
    condition: "Good",
    category: "Electronics",
    postedTime: "5 days ago",
    description: "TI-84 Plus graphing calculator. Works perfectly, minor scratches on the case. Batteries included."
  },
  {
    id: "4",
    title: "Psychology 101 Textbook",
    price: 80.00,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    seller: "Riley Kim",
    condition: "Good",
    category: "Books",
    postedTime: "3 days ago",
    description: "Psychology 101 textbook with minimal highlighting. Cover has slight wear but interior pages are in great condition."
  },
  {
    id: "6",
    title: "15.6\" Laptop Sleeve (Black)",
    price: 180.00,
    image: "https://m.media-amazon.com/images/I/41daZSvWb+L._SR290,290_.jpg",
    seller: "Sam Taylor",
    condition: "New",
    category: "Supplies",
    postedTime: "1 day ago",
    description: "Padded laptop sleeve for 15.6\" laptops. Water-resistant exterior and soft interior lining."
  }
];

export default function MarketplacePage() {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [isItemDetailsOpen, setIsItemDetailsOpen] = useState(false);
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 100000] as [number, number],
    category: "all",
    sortBy: "newest",
    dateFilter: "any"
  });
  const isMobile = useIsMobile();
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<{name: string, image?: string} | null>(null);
  
  const handleListItem = (data: any) => {
    console.log("List item data:", data);
    // Here we would typically submit this data to an API endpoint
    // and then refresh the listings
  };
  
  const handleMessageSeller = (itemId: string) => {
    const item = items.find(item => item.id === itemId);
    if (item) {
      setSelectedSeller({
        name: item.seller,
        image: item.image
      });
      setIsChatModalOpen(true);
    }
  };
  
  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };
  
  const handleSaveItem = (itemId: string) => {
    setSavedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleViewDetails = (itemId: string) => {
    setSelectedItemId(itemId);
    setIsItemDetailsOpen(true);
  };
  
  const selectedItem = items.find(item => item.id === selectedItemId) || null;
  
  const filteredItems = items.filter(item => {
    // Filter by search term
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = filters.category === "all" || 
                           item.category.toLowerCase() === filters.category.toLowerCase();
    
    // Filter by price range
    const price = item.price;
    const matchesPrice = price >= filters.priceRange[0] && price <= filters.priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });
  
  // Apply sorting
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (filters.sortBy) {
      case "price_low":
        return a.price - b.price;
      case "price_high":
        return b.price - a.price;
      case "oldest":
        return a.postedTime.localeCompare(b.postedTime);
      case "newest":
      default:
        return b.postedTime.localeCompare(a.postedTime);
    }
  });

  return (
    <div className="min-h-screen flex bg-taskbuddy-bg dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 flex flex-col ml-0 md:ml-64 transition-all duration-300 pt-16 md:pt-0">
        {/* Header */}
        <header className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
              <h1 className="text-2xl font-bold">Marketplace</h1>
            </div>
            
            <div className="flex gap-2 items-center">
              <div className="relative flex-1 md:w-[240px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 py-2"
                />
              </div>
              
              <FilterModal onApplyFilters={handleApplyFilters} />
              
              <Button 
                onClick={() => setIsListingModalOpen(true)}
                className="whitespace-nowrap"
              >
                <Plus className="h-4 w-4 mr-2" />
                List Item
              </Button>
            </div>
          </div>
          
          {/* Applied filters */}
          {(filters.category !== "all" || filters.priceRange[0] > 0 || filters.priceRange[1] < 100000 || filters.dateFilter !== "any") && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-2">
              <span className="text-xs text-gray-500">Filters:</span>
              {filters.category !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  {filters.category}
                </Badge>
              )}
              {(filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) && (
                <Badge variant="secondary" className="text-xs">
                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </Badge>
              )}
              {filters.dateFilter !== "any" && (
                <Badge variant="secondary" className="text-xs">
                  {filters.dateFilter === "today" ? "Today" : 
                   filters.dateFilter === "week" ? "This week" : 
                   "This month"}
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-6 px-2"
                onClick={() => setFilters({
                  priceRange: [0, 100000],
                  category: "all",
                  sortBy: "newest",
                  dateFilter: "any"
                })}
              >
                Clear All
              </Button>
            </div>
          )}
        </header>
        
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedItems.map((item) => (
              <ItemCard
                key={item.id}
                {...item}
                onViewDetails={handleViewDetails}
                onMessageSeller={handleMessageSeller}
                isSelected={item.id === selectedItemId}
              />
            ))}
            
            {sortedItems.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <p className="text-gray-500 dark:text-gray-400 mb-2">No items found</p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm("");
                  setFilters({
                    priceRange: [0, 100000],
                    category: "all",
                    sortBy: "newest",
                    dateFilter: "any"
                  });
                }}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <ListItemModal 
        open={isListingModalOpen} 
        onOpenChange={setIsListingModalOpen}
        onSubmit={handleListItem}
      />

      <ItemDetailsModal
        item={selectedItem}
        isOpen={isItemDetailsOpen}
        onOpenChange={setIsItemDetailsOpen}
        onMessageSeller={handleMessageSeller}
        onSaveItem={handleSaveItem}
        isSaved={selectedItemId ? savedItems.includes(selectedItemId) : false}
      />
      
      {selectedSeller && (
        <ChatModal 
          isOpen={isChatModalOpen}
          onOpenChange={setIsChatModalOpen}
          sellerName={selectedSeller.name}
          sellerImage={selectedSeller.image}
        />
      )}
    </div>
  );
}
