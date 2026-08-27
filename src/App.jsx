import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, LayoutGrid, List } from 'lucide-react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import SidebarFilter from './components/SidebarFilter';
import CategoryFilter from './components/CategoryFilter';
import DishCard from './components/DishCard';
import CompactDishGrid from './components/CompactDishGrid';
import BasicDishList from './components/BasicDishList';
import DishModal from './components/DishModal';
import BuildYourOwn from './components/BuildYourOwn';
import CartDrawer from './components/CartDrawer';
import FloatingCart from './components/FloatingCart';
import SettingsDrawer from './components/SettingsDrawer';
import FlyingPlateAnimation from './components/FlyingPlateAnimation';
import FloatingFoodBackground from './components/FloatingFoodBackground';
import FooterSection from './components/FooterSection';
import SpotlightTour from './components/SpotlightTour';
import ReservationModal from './components/ReservationModal';
import LoadingScreen from './components/LoadingScreen';
import { DISHES, UI_TEXT, RESTAURANT_DATA, MENU_CATEGORIES } from './data/menuData';
import { adminStore } from './services/adminStore';
import { getSubscriptionStatus } from './services/api';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import WaiterApp from './components/waiter/WaiterApp';
import WaiterLogin from './components/waiter/WaiterLogin';
import FloatingSocialButton from './components/FloatingSocialButton';
import PublicLockoutScreen from './components/PublicLockoutScreen';

export default function App() {
  // Hash Routing State (e.g. #/dsb)
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || '');
  const [authVersion, setAuthVersion] = useState(0);

  // Store Sync State for dynamic dishes & categories
  const [liveDishes, setLiveDishes] = useState(() => adminStore.getDishes());
  const [liveCategories, setLiveCategories] = useState(() => adminStore.getCategories());

  const isInitiallyAdmin = (window.location.hash || '').toLowerCase().includes('dsb') || 
                           (window.location.hash || '').toLowerCase().includes('admin') ||
                           (window.location.pathname || '').toLowerCase().includes('dsb') ||
                           (window.location.pathname || '').toLowerCase().includes('admin');
  const isInitiallyWaiter = (window.location.hash || '').toLowerCase().includes('mesero') || 
                            (window.location.hash || '').toLowerCase().includes('waiter') ||
                            (window.location.pathname || '').toLowerCase().includes('mesero') ||
                            (window.location.pathname || '').toLowerCase().includes('waiter');
  const initialSubStatus = adminStore.getSubscriptionStatus();
  const initialModules = adminStore.getModules();
  const initialLocked = initialSubStatus === 'unpaid' || initialModules.menu === false || initialModules.catalog === false;

  const [isSiteLocked, setIsSiteLocked] = useState(initialLocked);
  const [isLoading, setIsLoading] = useState(() => !isInitiallyAdmin && !isInitiallyWaiter && !initialLocked && adminStore.getLoadingScreenEnabled());
  const [theme, setTheme] = useState('kall-dark'); // 'kall-dark' | 'kall-neon' | ...
  const [currency, setCurrency] = useState('COP');
  const [lang, setLang] = useState('es');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'compact' | 'basic'
  const [showNutrition, setShowNutrition] = useState(false); // Toggle Details Info
  const [showBackgroundIcons, setShowBackgroundIcons] = useState(true); // Toggle Floating Icons
  const [animateBackgroundIcons, setAnimateBackgroundIcons] = useState(true); // Toggle Background Animation Loop
  const [backgroundScene, setBackgroundScene] = useState('drinks'); // 'drinks' | 'bar-show' | 'cobra' | 'disco'
  const [showSidebarFilters, setShowSidebarFilters] = useState(true); // Toggle Sidebar Filter Panel
  const [isMuted, setIsMuted] = useState(true); // Sound Mute Toggle for Video Background

  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [selectedDishForModal, setSelectedDishForModal] = useState(null);
  const [flyingPlates, setFlyingPlates] = useState([]);

  const t = UI_TEXT[lang] || UI_TEXT.es;

  // Listen to Hash Changes & Admin Store Updates
  useEffect(() => {
    const handleHash = () => {
      const h = (window.location.hash || '').toLowerCase().trim();
      const p = (window.location.pathname || '').toLowerCase().trim();
      setCurrentHash(h || p || '');
      if (h.includes('dsb') || h.includes('admin') || p.includes('dsb') || p.includes('admin') || h.includes('mesero') || p.includes('mesero')) {
        setIsLoading(false);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('popstate', handleHash);

    // Consulta de estado remoto con observabilidad en tiempo real (idéntico a Quimbayas)
    const checkStatus = async () => {
      try {
        const res = await getSubscriptionStatus();
        const locked = res && (res.status === 'unpaid' || res.modules?.menu === false || res.modules?.catalog === false);
        console.log(`🔒 [KALL MONITOR] Estado remoto: ${res?.status || 'desconocido'} | Bloqueado: ${locked}`, res?.modules);
        setIsSiteLocked(Boolean(locked));
        if (locked) {
          adminStore.setSubscriptionStatus('unpaid');
          setIsLoading(false);
        } else if (res?.status === 'active') {
          adminStore.setSubscriptionStatus('active');
        }
        if (res && res.modules && typeof res.modules === 'object') {
          adminStore.setModules(res.modules);
        }
        if (res && res.adminPassword) {
          adminStore.setAdminPassword(res.adminPassword);
        }
      } catch (err) {
        console.warn('[KALL MONITOR] Error verificando estado remoto:', err);
      }
    };

    checkStatus();
    const pollInterval = setInterval(checkStatus, 1200);

    const unsubscribe = adminStore.subscribe(() => {
      setAuthVersion((v) => v + 1);
      setLiveDishes(adminStore.getDishes());
      setLiveCategories(adminStore.getCategories());
      if (!adminStore.getLoadingScreenEnabled()) {
        setIsLoading(false);
      }
    });

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('popstate', handleHash);
      clearInterval(pollInterval);
      unsubscribe();
    };
  }, []);

  // Sync HTML body class with active theme and scene
  useEffect(() => {
    const rawH = (currentHash || window.location.hash || window.location.pathname || '').toLowerCase();
    if (rawH.includes('dsb') || rawH.includes('admin') || rawH.includes('mesero') || rawH.includes('waiter')) {
      document.body.className = 'theme-kall-dark bg-[#08090d]';
    } else {
      document.body.className = `theme-${theme} scene-${backgroundScene}`;
    }
  }, [theme, backgroundScene, currentHash]);

  // Trigger flying plate animation
  const handleTriggerFlyingPlate = ({ x, y }) => {
    const plateId = Date.now() + Math.random();
    setFlyingPlates((prev) => [...prev, { id: plateId, startX: x, startY: y }]);

    setTimeout(() => {
      setFlyingPlates((prev) => prev.filter((p) => p.id !== plateId));
    }, 1200);
  };

  // Add item to cart
  const handleAddToCart = (dish) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { dish, quantity: 1 }];
    });
  };

  // Update quantity in cart
  const handleUpdateQuantity = (dishId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(dishId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.dish.id === dishId ? { ...item, quantity: newQty } : item))
    );
  };

  // Remove item from cart
  const handleRemoveItem = (dishId) => {
    setCartItems((prev) => prev.filter((item) => item.dish.id !== dishId));
  };

  // Filter dishes logic (multi-select alcohol intensity + drink styles + category + search)
  const filteredDishes = liveDishes.filter((dish) => {
    const drinkCategories = ['licores', 'cervezas', 'cocteles', 'mezcladores', 'build-your-own'];

    if (activeCategory === 'bebidas' || activeCategory === 'all-drinks') {
      if (!drinkCategories.includes(dish.category)) return false;
    } else if (activeCategory === 'confiteria' || activeCategory === 'snacks') {
      if (dish.category !== 'snacks') return false;
    } else if (activeCategory !== 'all' && activeCategory !== 'build-your-own' && dish.category !== activeCategory) {
      return false;
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const name = (dish.name[lang] || dish.name.es || '').toLowerCase();
      const desc = (dish.description?.[lang] || dish.description?.es || dish.desc?.es || '').toLowerCase();
      if (!name.includes(query) && !desc.includes(query)) return false;
    }

    if (selectedDietary.length > 0) {
      const hasIntensity = selectedDietary.some((dietId) => dish.tags && dish.tags.includes(dietId));
      if (!hasIntensity) return false;
    }

    if (selectedAllergens.length > 0) {
      const hasStyle = selectedAllergens.some((algId) => dish.styles && dish.styles.includes(algId));
      if (!hasStyle) return false;
    }

    return true;
  });

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const activeCategoryObj = liveCategories.find((c) => c.id === activeCategory);
  const categoryTitle = activeCategoryObj ? (activeCategoryObj.name?.[lang] || activeCategoryObj.label?.es || activeCategoryObj.name?.es) : t.allDishes;

  // ----------------------------------------------------
  // ROUTING: IF HASH OR PATH IS /#/dsb, /dsb, #/admin, etc.
  // ----------------------------------------------------
  const normRoute = (currentHash || window.location.hash || window.location.pathname || '').toLowerCase().trim();
  const isAdminRoute = 
    normRoute.includes('dsb') || 
    normRoute.includes('admin');

  const isWaiterRoute = 
    normRoute.includes('mesero') || 
    normRoute.includes('waiter');

  if (isWaiterRoute) {
    const waiterSession = adminStore.getWaiterAuth();
    if (waiterSession) {
      return (
        <WaiterApp
          waiterSession={waiterSession}
          onLogout={() => {
            setAuthVersion((v) => v + 1);
          }}
          onReturnToMenu={() => {
            window.location.hash = '';
          }}
        />
      );
    }

    return (
      <WaiterLogin
        onLoginSuccess={() => {
          setAuthVersion((v) => v + 1);
        }}
        onReturnToMenu={() => {
          window.location.hash = '';
        }}
      />
    );
  }

  if (isSiteLocked && !isAdminRoute) {
    return (
      <PublicLockoutScreen
        onGoToAdmin={() => {
          window.location.hash = '#/dsb';
        }}
      />
    );
  }

  if (isAdminRoute) {
    const auth = adminStore.getAuth();
    if (auth.isAuthenticated || auth.isSessionRevoked) {
      return (
        <AdminDashboard
          onLogout={() => {
            const a = adminStore.getAuth();
            a.isSessionRevoked = false;
            a.isAuthenticated = false;
            localStorage.setItem('kal_admin_auth', JSON.stringify(a));
            adminStore.logout();
            setAuthVersion((v) => v + 1);
          }}
          onReturnToMenu={() => {
            const a = adminStore.getAuth();
            a.isSessionRevoked = false;
            a.isAuthenticated = false;
            localStorage.setItem('kal_admin_auth', JSON.stringify(a));
            adminStore.logout();
            window.location.hash = '';
            setAuthVersion((v) => v + 1);
          }}
        />
      );
    }

    return (
      <AdminLogin
        onLoginSuccess={() => {
          setAuthVersion((v) => v + 1);
        }}
        onReturnToMenu={() => {
          window.location.hash = '';
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between pb-24 pt-14 relative selection:bg-[var(--accent-color)] selection:text-[var(--accent-on)]">
      
      {/* Full-Screen Video Loading Overlay Screen */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen onFinish={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* FULL-SCREEN VIDEO BACKGROUND LAYER FOR MODO SERPIENTES */}
      {(backgroundScene === 'serpientes' || backgroundScene === 'disco') && (
        <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none bg-black">
          <video
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            key={`serpientes-video-root-${isMuted}`}
            className="fixed inset-0 w-full h-full object-cover z-0 opacity-85 pointer-events-none"
          >
            <source src="/menu-assets/fondo serpientes.mp4" type="video/mp4" />
            <source src="/menu-assets/fondo-serpientes.mp4" type="video/mp4" />
          </video>
          {/* Subtle dark vignette overlay for sharp text contrast */}
          <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/60 pointer-events-none z-10" />
        </div>
      )}

      {/* Floating Parallax SVG Nightclub Background Layer */}
      {showBackgroundIcons && backgroundScene !== 'serpientes' && backgroundScene !== 'disco' && (
        <FloatingFoodBackground
          animateIcons={animateBackgroundIcons}
          scene={backgroundScene}
        />
      )}

      {/* Top Sticky Navbar anchored at root level */}
      <Navbar
        currentLang={lang}
        backgroundScene={backgroundScene}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenReservation={() => setIsReservationOpen(true)}
      />

      <div className="relative z-10 flex-1 w-full">
        
        {/* Video Header with Dynamic Scene Video & KAL DISCOBAR Logo */}
        <HeroSection currentLang={lang} backgroundScene={backgroundScene} />

        {/* Main Content Layout */}
        <main className="w-full max-w-7xl mx-auto px-4 md:px-6 my-8">
          
          <div className="flex flex-col lg:flex-row items-start gap-8">
            
            {/* LEFT COLUMN: Search & Multi-Select Sidebar Filters */}
            {showSidebarFilters && (
              <SidebarFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedDietary={selectedDietary}
                setSelectedDietary={setSelectedDietary}
                selectedAllergens={selectedAllergens}
                setSelectedAllergens={setSelectedAllergens}
                currentLang={lang}
              />
            )}

            {/* RIGHT COLUMN: Categories & Display Modes */}
            <div className="flex-1 w-full min-w-0">
              
              {/* Category Pills Header (Sticky beneath Navbar when scrolling) */}
              <CategoryFilter
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                currentLang={lang}
              />

              {/* View Mode Toggle Header Bar (Modo Tarjetas 3D | Modo Compacto | Modo Básico) */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-[var(--surface-bg)] p-2.5 rounded-2xl border border-[var(--surface-border)] shadow-sm">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-[var(--text-primary)] serif-title leading-none">
                    {categoryTitle}
                  </h2>
                  <p className="text-[11px] text-[var(--text-muted)] font-semibold mt-1">
                    {filteredDishes.length} platillos disponibles
                  </p>
                </div>

                {/* View Mode Selector Buttons */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--pill-bg)] border border-[var(--surface-border)]">
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border ${
                      viewMode === 'cards'
                        ? 'bg-[var(--pill-active)] text-[var(--pill-active-text)] border-[var(--pill-active-border)] shadow-md font-black'
                        : 'bg-transparent text-[var(--text-primary)] border-transparent hover:bg-[var(--card-bg)]'
                    }`}
                    title={t.cardsMode}
                  >
                    <Layers size={14} />
                    <span className="hidden sm:inline">{t.cardsMode}</span>
                  </button>

                  <button
                    onClick={() => setViewMode('compact')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border ${
                      viewMode === 'compact'
                        ? 'bg-[var(--pill-active)] text-[var(--pill-active-text)] border-[var(--pill-active-border)] shadow-md font-black'
                        : 'bg-transparent text-[var(--text-primary)] border-transparent hover:bg-[var(--card-bg)]'
                    }`}
                    title={t.compactMode}
                  >
                    <LayoutGrid size={14} />
                    <span className="hidden sm:inline">{t.compactMode}</span>
                  </button>

                  <button
                    onClick={() => setViewMode('basic')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border ${
                      viewMode === 'basic'
                        ? 'bg-[var(--pill-active)] text-[var(--pill-active-text)] border-[var(--pill-active-border)] shadow-md font-black'
                        : 'bg-transparent text-[var(--text-primary)] border-transparent hover:bg-[var(--card-bg)]'
                    }`}
                    title={t.basicMode}
                  >
                    <List size={14} />
                    <span className="hidden sm:inline">{t.basicMode}</span>
                  </button>
                </div>
              </div>

              {/* RENDER ACTIVE CONTENT */}
              {activeCategory === 'build-your-own' ? (
                <BuildYourOwn
                  currentCurrency={currency}
                  currentLang={lang}
                  onAddToCart={handleAddToCart}
                />
              ) : filteredDishes.length === 0 ? (
                <div className="text-center py-20 text-[var(--text-muted)] glass-panel rounded-3xl border border-[var(--surface-border)]">
                  <p className="text-lg font-semibold">No se encontraron platillos</p>
                  <p className="text-xs mt-1">Prueba quitando algunos filtros o cambiando el término de búsqueda.</p>
                </div>
              ) : viewMode === 'compact' ? (
                <CompactDishGrid
                  dishes={filteredDishes}
                  currentCurrency={currency}
                  currentLang={lang}
                  onAddToCart={handleAddToCart}
                  onSelectDish={(dish) => setSelectedDishForModal(dish)}
                  onTriggerFlyingPlate={handleTriggerFlyingPlate}
                  showNutrition={showNutrition}
                />
              ) : viewMode === 'basic' ? (
                <BasicDishList
                  dishes={filteredDishes}
                  currentCurrency={currency}
                  currentLang={lang}
                  onAddToCart={handleAddToCart}
                  onSelectDish={(dish) => setSelectedDishForModal(dish)}
                  onTriggerFlyingPlate={handleTriggerFlyingPlate}
                />
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-2.5 sm:gap-6"
                >
                  <AnimatePresence>
                    {filteredDishes.map((dish) => (
                      <DishCard
                        key={dish.id}
                        dish={dish}
                        currentCurrency={currency}
                        currentLang={lang}
                        onAddToCart={handleAddToCart}
                        onSelectDish={(dish) => setSelectedDishForModal(dish)}
                        onTriggerFlyingPlate={handleTriggerFlyingPlate}
                        showNutrition={showNutrition}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

            </div>

          </div>

        </main>
      </div>

      {/* Footer with Logo, Location Details & Embedded Interactive Map */}
      <FooterSection currentLang={lang} />

      {/* Bottom Left Floating Social Media Neon Button */}
      <FloatingSocialButton />

      {/* Bottom Right Floating Supermarket Cart */}
      <FloatingCart
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        currentTheme={theme}
      />

      {/* Multi-Stage Flying Plate Animation Layer */}
      <FlyingPlateAnimation flyingPlates={flyingPlates} />

      {/* Slide-Out Settings Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showBackgroundIcons={showBackgroundIcons}
        setShowBackgroundIcons={setShowBackgroundIcons}
        animateBackgroundIcons={animateBackgroundIcons}
        setAnimateBackgroundIcons={setAnimateBackgroundIcons}
        backgroundScene={backgroundScene}
        setBackgroundScene={setBackgroundScene}
        showSidebarFilters={showSidebarFilters}
        setShowSidebarFilters={setShowSidebarFilters}
        currentTheme={theme}
        setTheme={setTheme}
        currentLang={lang}
        setLang={setLang}
      />

      {/* Rich Dish Detail Popup Modal */}
      <DishModal
        dish={selectedDishForModal}
        onClose={() => setSelectedDishForModal(null)}
        currentCurrency={currency}
        currentLang={lang}
        onAddToCart={handleAddToCart}
        onTriggerFlyingPlate={handleTriggerFlyingPlate}
        showNutrition={showNutrition}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
        currentCurrency={currency}
        currentLang={lang}
      />

      {/* First-Load 3-Step Spotlight Guided Tour Overlay */}
      <SpotlightTour
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
      />

      {/* Aesthetic Table Reservation Popup Modal */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        currentLang={lang}
      />

    </div>
  );
}
