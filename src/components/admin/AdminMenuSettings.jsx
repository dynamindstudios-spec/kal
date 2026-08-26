import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, Plus, Trash2, Edit2, Check, X, ShieldCheck, 
  Layers, Lock, Sparkles, Image, CheckCircle2, AlertCircle, Video, Globe, Play, Phone, Share2,
  Flame, LayoutGrid, List, Sliders, ToggleLeft, ToggleRight
} from 'lucide-react';
import { adminStore } from '../../services/adminStore';

export default function AdminMenuSettings() {
  const [activeTab, setActiveTab] = useState('prices'); // 'prices' | 'filters' | 'views-scenes' | 'videos' | 'social' | 'table-codes'
  const [dishes, setDishes] = useState(adminStore.getDishes());
  const [categories, setCategories] = useState(adminStore.getCategories());
  const [tableCodes, setTableCodes] = useState(adminStore.getTableSecurityCodes());
  const [heroVideos, setHeroVideos] = useState(adminStore.getHeroVideos());
  const [socialLinks, setSocialLinks] = useState(adminStore.getSocialLinks());
  const [intensityFilters, setIntensityFilters] = useState(adminStore.getIntensityFilters());
  const [tasteFilters, setTasteFilters] = useState(adminStore.getTasteFilters());
  const [viewModesSettings, setViewModesSettings] = useState(adminStore.getViewModesSettings());
  const [scenesSettings, setScenesSettings] = useState(adminStore.getScenesSettings());
  const [loadingScreenEnabled, setLoadingScreenEnabled] = useState(() => adminStore.getLoadingScreenEnabled());

  // Edit / Add Dish Modal State
  const [showDishModal, setShowDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [dishNameEs, setDishNameEs] = useState('');
  const [dishNameEn, setDishNameEn] = useState('');
  const [dishCategory, setDishCategory] = useState('licores');
  const [dishPriceCOP, setDishPriceCOP] = useState(120000);
  const [dishDescEs, setDishDescEs] = useState('');
  const [dishImage, setDishImage] = useState('/licores_sin_fondo/Aguardiente_Amarillo_Manzanares_750ml_Botella.png');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');

  // Inline Price Edit State
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [tempPrice, setTempPrice] = useState(0);

  // Table Codes Local Edit State
  const [localCodes, setLocalCodes] = useState(adminStore.getTableSecurityCodes());
  const [savedCodeMsg, setSavedCodeMsg] = useState('');

  // Hero Video Form State
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoScene, setVideoScene] = useState('drinks');
  const [videoBadge, setVideoBadge] = useState('🍾 MODO VIP 🔞');

  // Social Links Local Form State
  const [socialForm, setSocialForm] = useState(adminStore.getSocialLinks());
  const [socialSavedMsg, setSocialSavedMsg] = useState('');

  // Edit Filter Modal State
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterType, setFilterType] = useState('intensity'); // 'intensity' | 'taste' | 'category'
  const [editingFilterItem, setEditingFilterItem] = useState(null);
  const [filterIcon, setFilterIcon] = useState('🍸');
  const [filterLabelEs, setFilterLabelEs] = useState('');
  const [filterLabelEn, setFilterLabelEn] = useState('');
  const [filterId, setFilterId] = useState('');
  const [filterSavedMsg, setFilterSavedMsg] = useState('');

  // Sync with store
  useEffect(() => {
    const unsubscribe = adminStore.subscribe(() => {
      setDishes(adminStore.getDishes());
      setCategories(adminStore.getCategories());
      setTableCodes(adminStore.getTableSecurityCodes());
      setLocalCodes(adminStore.getTableSecurityCodes());
      setHeroVideos(adminStore.getHeroVideos());
      setSocialLinks(adminStore.getSocialLinks());
      setSocialForm(adminStore.getSocialLinks());
      setIntensityFilters(adminStore.getIntensityFilters());
      setTasteFilters(adminStore.getTasteFilters());
      setViewModesSettings(adminStore.getViewModesSettings());
      setScenesSettings(adminStore.getScenesSettings());
      setLoadingScreenEnabled(adminStore.getLoadingScreenEnabled());
    });
    return unsubscribe;
  }, []);

  const handleOpenAddDish = () => {
    setEditingDish(null);
    setDishNameEs('');
    setDishNameEn('');
    setDishCategory('licores');
    setDishPriceCOP(120000);
    setDishDescEs('');
    setDishImage('/licores_sin_fondo/Aguardiente_Amarillo_Manzanares_750ml_Botella.png');
    setShowDishModal(true);
  };

  const handleOpenEditDish = (dish) => {
    setEditingDish(dish);
    setDishNameEs(dish.name?.es || dish.name || '');
    setDishNameEn(dish.name?.en || '');
    setDishCategory(dish.category || 'licores');
    setDishPriceCOP(dish.priceCOP || 0);
    setDishDescEs(dish.desc?.es || dish.desc || '');
    setDishImage(dish.image || '');
    setShowDishModal(true);
  };

  const handleSaveDish = (e) => {
    e.preventDefault();
    if (!dishNameEs.trim()) return;

    const dishPayload = {
      id: editingDish ? editingDish.id : 'dish-' + Date.now(),
      name: { es: dishNameEs.trim(), en: dishNameEn.trim() || dishNameEs.trim() },
      category: dishCategory,
      priceCOP: Number(dishPriceCOP),
      desc: { es: dishDescEs.trim(), en: dishDescEs.trim() },
      image: dishImage.trim() || '/licores_sin_fondo/Aguardiente_Amarillo_Manzanares_750ml_Botella.png',
      alcoholDegree: editingDish?.alcoholDegree || '29% Alc. Vol.',
      tags: editingDish?.tags || ['VIP', 'Exclusivo']
    };

    adminStore.saveDish(dishPayload);
    setShowDishModal(false);
  };

  const handleDeleteDish = (dishId) => {
    if (window.confirm('¿Deseas eliminar este artículo del menú?')) {
      adminStore.deleteDish(dishId);
    }
  };

  const handleSaveInlinePrice = (dishId) => {
    if (tempPrice > 0) {
      adminStore.updateDishPrice(dishId, tempPrice);
    }
    setEditingPriceId(null);
  };

  const handleSaveTableCode = (tableNum) => {
    const code = localCodes[tableNum];
    if (code && code.trim().length >= 4) {
      adminStore.updateTableSecurityCode(tableNum, code.trim().toUpperCase());
      setSavedCodeMsg(`¡Clave de Mesa #${tableNum} actualizada a "${code.trim().toUpperCase()}"!`);
      setTimeout(() => setSavedCodeMsg(''), 2500);
    }
  };

  // Save Hero Video
  const handleSaveHeroVideo = (e) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;

    adminStore.saveHeroVideo({
      title: videoTitle.trim() || 'Video Hero Personalizado',
      url: videoUrl.trim(),
      scene: videoScene,
      badge: videoBadge.trim() || '🍾 MODO VIP 🔞'
    });

    setShowVideoModal(false);
    setVideoTitle('');
    setVideoUrl('');
  };

  const handleDeleteHeroVideo = (videoId) => {
    if (window.confirm('¿Eliminar este video de fondo del Hero?')) {
      adminStore.deleteHeroVideo(videoId);
    }
  };

  // Save Social Links
  const handleSaveSocialLinks = (e) => {
    e.preventDefault();
    adminStore.saveSocialLinks(socialForm);
    setSocialSavedMsg('¡Enlaces y redes sociales actualizados con éxito!');
    setTimeout(() => setSocialSavedMsg(''), 3000);
  };

  // Open Edit Filter Modal
  const handleOpenEditFilter = (type, item) => {
    setFilterType(type);
    setEditingFilterItem(item);
    setFilterId(item.id || '');
    setFilterIcon(item.icon || '✨');
    setFilterLabelEs(typeof item.label === 'object' ? item.label.es : (item.name?.es || item.label || ''));
    setFilterLabelEn(typeof item.label === 'object' ? (item.label.en || item.label.es) : (item.name?.en || item.label || ''));
    setShowFilterModal(true);
  };

  const handleOpenAddFilter = (type) => {
    setFilterType(type);
    setEditingFilterItem(null);
    setFilterId('');
    setFilterIcon('✨');
    setFilterLabelEs('');
    setFilterLabelEn('');
    setShowFilterModal(true);
  };

  const handleSaveFilter = (e) => {
    e.preventDefault();
    if (!filterLabelEs.trim()) return;

    const targetId = filterId.trim() || ('filter-' + Date.now());

    if (filterType === 'intensity') {
      const current = [...intensityFilters];
      const idx = current.findIndex((f) => f.id === targetId || f.id === editingFilterItem?.id);
      const itemPayload = {
        id: targetId,
        icon: filterIcon.trim() || '🔥',
        label: { es: filterLabelEs.trim(), en: filterLabelEn.trim() || filterLabelEs.trim() }
      };

      if (idx >= 0) {
        current[idx] = itemPayload;
      } else {
        current.push(itemPayload);
      }
      adminStore.saveIntensityFilters(current);
      setFilterSavedMsg('¡Filtro de intensidad de alcohol guardado!');
    } else if (filterType === 'taste') {
      const current = [...tasteFilters];
      const idx = current.findIndex((f) => f.id === targetId || f.id === editingFilterItem?.id);
      const itemPayload = {
        id: targetId,
        icon: filterIcon.trim() || '✨',
        label: { es: filterLabelEs.trim(), en: filterLabelEn.trim() || filterLabelEs.trim() }
      };

      if (idx >= 0) {
        current[idx] = itemPayload;
      } else {
        current.push(itemPayload);
      }
      adminStore.saveTasteFilters(current);
      setFilterSavedMsg('¡Filtro de perfil de sabor guardado!');
    } else if (filterType === 'category') {
      const current = [...categories];
      const idx = current.findIndex((c) => c.id === targetId || c.id === editingFilterItem?.id);
      const itemPayload = {
        id: targetId,
        name: { es: filterLabelEs.trim(), en: filterLabelEn.trim() || filterLabelEs.trim() },
        subtitle: 'Categoría activa en menú'
      };

      if (idx >= 0) {
        current[idx] = itemPayload;
      } else {
        current.push(itemPayload);
      }
      adminStore.saveCategories(current);
      setFilterSavedMsg('¡Categoría del menú guardada!');
    }

    setTimeout(() => setFilterSavedMsg(''), 2500);
    setShowFilterModal(false);
  };

  const handleDeleteFilter = (type, id) => {
    if (!window.confirm('¿Deseas eliminar este filtro/categoría?')) return;

    if (type === 'intensity') {
      const filtered = intensityFilters.filter((f) => f.id !== id);
      adminStore.saveIntensityFilters(filtered);
    } else if (type === 'taste') {
      const filtered = tasteFilters.filter((f) => f.id !== id);
      adminStore.saveTasteFilters(filtered);
    } else if (type === 'category') {
      const filtered = categories.filter((c) => c.id !== id);
      adminStore.saveCategories(filtered);
    }
  };

  // Toggle View Mode
  const handleToggleViewMode = (key) => {
    const nextVal = !viewModesSettings[key];
    adminStore.saveViewModesSettings({ [key]: nextVal });
  };

  // Toggle Scene
  const handleToggleScene = (key) => {
    const nextVal = !scenesSettings[key];
    adminStore.saveScenesSettings({ [key]: nextVal });
  };

  // Toggle Loading Screen
  const handleToggleLoadingScreen = () => {
    const nextVal = adminStore.toggleLoadingScreen();
    setLoadingScreenEnabled(nextVal);
  };

  // Filtered dishes
  const filteredDishes = dishes.filter((d) => {
    const nameStr = typeof d.name === 'object' ? (d.name.es + ' ' + (d.name.en || '')) : d.name;
    const matchesSearch = nameStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCatFilter === 'all' || d.category === selectedCatFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Tab Selector */}
      <div className="flex flex-wrap items-center justify-between p-2 rounded-2xl bg-[#11131c] border border-[#232738] gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'prices', label: 'Artículos & Precios', icon: <DollarSign size={14} /> },
            { id: 'filters', label: 'Categorías & Filtros', icon: <Flame size={14} /> },
            { id: 'views-scenes', label: 'Vistas & Ambientaciones', icon: <Sliders size={14} /> },
            { id: 'videos', label: 'Videos del Hero', icon: <Video size={14} /> },
            { id: 'social', label: 'Redes Sociales', icon: <Globe size={14} /> },
            { id: 'table-codes', label: 'Claves de Mesas', icon: <Lock size={14} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'prices' && (
          <button
            onClick={handleOpenAddDish}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black text-xs hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Plus size={15} />
            <span>Agregar Producto</span>
          </button>
        )}

        {activeTab === 'videos' && (
          <button
            onClick={() => setShowVideoModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black text-xs hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Plus size={15} />
            <span>Subir / Agregar Video</span>
          </button>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* TAB 1: EDIT ARTICLES & PRICES                        */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'prices' && (
        <div className="space-y-4">
          
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-3xl bg-[#11131c] border border-[#232738]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar producto por nombre..."
              className="w-full sm:w-72 px-4 py-2 rounded-xl bg-[#0a0c12] border border-[#232738] text-white text-xs focus:outline-none focus:border-amber-400"
            />

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
              <button
                onClick={() => setSelectedCatFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCatFilter === 'all' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Todos ({dishes.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCatFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedCatFilter === cat.id ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {cat.name?.es || cat.label?.es || cat.label || cat.id}
                </button>
              ))}
            </div>
          </div>

          {/* Dishes Table List */}
          <div className="p-4 rounded-3xl bg-[#11131c] border border-[#232738] space-y-2">
            <div className="grid grid-cols-12 text-[10px] font-black uppercase text-gray-500 px-3 py-2 border-b border-[#232738]">
              <span className="col-span-6 sm:col-span-5">Producto</span>
              <span className="col-span-3 sm:col-span-3">Categoría</span>
              <span className="col-span-3 sm:col-span-2 text-right">Precio COP</span>
              <span className="hidden sm:block sm:col-span-2 text-right">Acciones</span>
            </div>

            {filteredDishes.map((dish) => {
              const isEditingPrice = editingPriceId === dish.id;
              const nameDisplay = typeof dish.name === 'object' ? dish.name.es : dish.name;

              return (
                <div
                  key={dish.id}
                  className="grid grid-cols-12 items-center p-3 rounded-2xl bg-[#161924] border border-[#262a3c] text-xs hover:border-gray-600 transition-all gap-2"
                >
                  {/* Name & Image */}
                  <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
                    <img
                      src={dish.image}
                      alt={nameDisplay}
                      className="w-10 h-10 object-cover rounded-xl bg-black/40 border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="font-extrabold text-white block truncate">{nameDisplay}</span>
                      <span className="text-[10px] text-gray-400 truncate block">
                        {typeof dish.desc === 'object' ? dish.desc.es : dish.desc}
                      </span>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="col-span-3 sm:col-span-3">
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 uppercase">
                      {dish.category}
                    </span>
                  </div>

                  {/* Price (with Inline Edit) */}
                  <div className="col-span-3 sm:col-span-2 text-right">
                    {isEditingPrice ? (
                      <div className="flex items-center justify-end gap-1">
                        <input
                          type="number"
                          step={1000}
                          value={tempPrice}
                          onChange={(e) => setTempPrice(Number(e.target.value))}
                          className="w-24 px-2 py-1 rounded-lg bg-[#0a0c12] border border-amber-500 text-white font-mono text-xs font-bold text-right"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveInlinePrice(dish.id)}
                          className="p-1 rounded bg-emerald-500 text-black cursor-pointer"
                        >
                          <Check size={12} strokeWidth={3} />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setEditingPriceId(dish.id);
                          setTempPrice(dish.priceCOP);
                        }}
                        className="font-black text-amber-400 font-mono text-xs sm:text-sm hover:underline cursor-pointer"
                        title="Toca para editar precio directamente"
                      >
                        ${Number(dish.priceCOP).toLocaleString('es-CO')}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="col-span-12 sm:col-span-2 flex items-center justify-end gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    <button
                      onClick={() => handleOpenEditDish(dish)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all cursor-pointer"
                      title="Editar ficha del producto"
                    >
                      <Edit2 size={13} />
                    </button>

                    <button
                      onClick={() => handleDeleteDish(dish.id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/25 text-red-400 transition-all cursor-pointer"
                      title="Eliminar artículo"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 2: CATEGORIES & FILTERS (ALCOHOL & TASTE)        */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'filters' && (
        <div className="space-y-6">
          
          {filterSavedMsg && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              <span>{filterSavedMsg}</span>
            </motion.div>
          )}

          {/* Section 1: Intensidad de Alcohol */}
          <div className="p-6 rounded-3xl bg-[#11131c] border border-[#232738] space-y-4">
            <div className="flex items-center justify-between border-b border-[#232738] pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Flame size={18} />
                <div>
                  <h3 className="text-base font-black text-white">Intensidad de Alcohol</h3>
                  <span className="text-xs text-gray-400">Filtros de graduación y tipos de licores en la barra lateral</span>
                </div>
              </div>
              <button
                onClick={() => handleOpenAddFilter('intensity')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>Nuevo Filtro</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {intensityFilters.map((f) => {
                const labelText = typeof f.label === 'object' ? f.label.es : f.label;
                return (
                  <div
                    key={f.id}
                    className="p-3.5 rounded-2xl bg-[#161924] border border-[#262a3c] flex items-center justify-between gap-2 hover:border-amber-500/40 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl p-1.5 rounded-xl bg-black/40 border border-white/10 shrink-0">{f.icon}</span>
                      <div className="min-w-0">
                        <span className="font-extrabold text-sm text-white block truncate">{labelText}</span>
                        <span className="text-[10px] text-gray-500 font-mono">ID: {f.id}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditFilter('intensity', f)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all cursor-pointer"
                        title="Editar Emoji & Texto"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteFilter('intensity', f.id)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/25 text-red-400 transition-all cursor-pointer"
                        title="Eliminar Filtro"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Perfil de Sabor */}
          <div className="p-6 rounded-3xl bg-[#11131c] border border-[#232738] space-y-4">
            <div className="flex items-center justify-between border-b border-[#232738] pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Sparkles size={18} />
                <div>
                  <h3 className="text-base font-black text-white">Perfil de Sabor</h3>
                  <span className="text-xs text-gray-400">Filtros de notas de cata (Dulce, Amargo, Seco)</span>
                </div>
              </div>
              <button
                onClick={() => handleOpenAddFilter('taste')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>Nuevo Sabor</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {tasteFilters.map((f) => {
                const labelText = typeof f.label === 'object' ? f.label.es : f.label;
                return (
                  <div
                    key={f.id}
                    className="p-3.5 rounded-2xl bg-[#161924] border border-[#262a3c] flex items-center justify-between gap-2 hover:border-amber-500/40 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl p-1.5 rounded-xl bg-black/40 border border-white/10 shrink-0">{f.icon}</span>
                      <div className="min-w-0">
                        <span className="font-extrabold text-sm text-white block truncate">{labelText}</span>
                        <span className="text-[10px] text-gray-500 font-mono">ID: {f.id}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditFilter('taste', f)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all cursor-pointer"
                        title="Editar Emoji & Texto"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteFilter('taste', f.id)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/25 text-red-400 transition-all cursor-pointer"
                        title="Eliminar Filtro"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Categorías Principales */}
          <div className="p-6 rounded-3xl bg-[#11131c] border border-[#232738] space-y-4">
            <div className="flex items-center justify-between border-b border-[#232738] pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Layers size={18} />
                <div>
                  <h3 className="text-base font-black text-white">Categorías del Menú</h3>
                  <span className="text-xs text-gray-400">Pestañas superiores y clasificación general</span>
                </div>
              </div>
              <button
                onClick={() => handleOpenAddFilter('category')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>Nueva Categoría</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => {
                const labelText = cat.name?.es || cat.label?.es || cat.label || cat.id;
                return (
                  <div
                    key={cat.id}
                    className="p-3.5 rounded-2xl bg-[#161924] border border-[#262a3c] flex items-center justify-between gap-2 hover:border-amber-500/40 transition-all"
                  >
                    <div className="min-w-0">
                      <span className="font-extrabold text-sm text-white block truncate">{labelText}</span>
                      <span className="text-[10px] text-gray-500 font-mono">ID: {cat.id}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditFilter('category', cat)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all cursor-pointer"
                        title="Editar Nombre"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteFilter('category', cat.id)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/25 text-red-400 transition-all cursor-pointer"
                        title="Eliminar Categoría"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 3: VIEW MODES & BACKGROUND SCENES (TOGGLES)      */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'views-scenes' && (
        <div className="space-y-6">
          
          {/* View Modes Activation */}
          <div className="p-6 rounded-3xl bg-[#11131c] border border-[#232738] space-y-5">
            <div className="flex items-center justify-between border-b border-[#232738] pb-3">
              <div>
                <h3 className="text-base font-black text-white">Tipos de Vista de la Carta</h3>
                <span className="text-xs text-gray-400">Habilita o deshabilita los modos de visualización disponibles para los clientes</span>
              </div>
              <LayoutGrid className="text-amber-400" size={20} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: 'cards', title: 'Tarjetas Modernas', desc: 'Diseño visual con tarjetas grandes y efectos 3D', icon: <Layers size={18} /> },
                { key: 'compact', title: 'Modo Compacto', desc: 'Cuadrícula ágil de dos columnas para celular', icon: <LayoutGrid size={18} /> },
                { key: 'basic', title: 'Lista Básica VIP', desc: 'Diseño minimalista rápido y condensado', icon: <List size={18} /> }
              ].map((m) => {
                const isEnabled = viewModesSettings[m.key] !== false;
                return (
                  <div
                    key={m.key}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                      isEnabled ? 'bg-[#161924] border-amber-500/40 shadow-lg shadow-amber-500/5' : 'bg-[#10121a] border-[#222636] opacity-60'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                          {m.icon}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleViewMode(m.key)}
                          className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                            isEnabled ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {isEnabled ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
                          <span>{isEnabled ? 'Habilitado' : 'Deshabilitado'}</span>
                        </button>
                      </div>
                      <h4 className="font-extrabold text-sm text-white">{m.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Background Scenes Activation */}
          <div className="p-6 rounded-3xl bg-[#11131c] border border-[#232738] space-y-5">
            <div className="flex items-center justify-between border-b border-[#232738] pb-3">
              <div>
                <h3 className="text-base font-black text-white">Ambientaciones de Fondo</h3>
                <span className="text-xs text-gray-400">Habilita o deshabilita los temas ambientales que los clientes pueden elegir en la configuración</span>
              </div>
              <Sparkles className="text-amber-400" size={20} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: 'drinks', title: 'Modo Licores VIP', icon: '🍾', desc: 'Botellas, cócteles & copas flotantes' },
                { key: 'party', title: 'Modo Fiesta', icon: '🪩', desc: 'Bola Disco, DJ & Consola neón' },
                { key: 'natura', title: 'Modo Natura', icon: '🌿', desc: 'Cobras exóticas & Jungla VIP' },
                { key: 'serpientes', title: 'Modo Serpientes', icon: '🐍', desc: 'Video inmersivo de serpientes' }
              ].map((s) => {
                const isEnabled = scenesSettings[s.key] !== false;
                return (
                  <div
                    key={s.key}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                      isEnabled ? 'bg-[#161924] border-amber-500/40 shadow-lg shadow-amber-500/5' : 'bg-[#10121a] border-[#222636] opacity-60'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{s.icon}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleScene(s.key)}
                          className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                            isEnabled ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {isEnabled ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
                          <span>{isEnabled ? 'Activo' : 'Inactivo'}</span>
                        </button>
                      </div>
                      <h4 className="font-extrabold text-sm text-white">{s.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Menu Intro Loading Screen Activation */}
          <div className="p-6 rounded-3xl bg-[#11131c] border border-[#232738] space-y-4">
            <div className="flex items-center justify-between border-b border-[#232738] pb-3">
              <div>
                <h3 className="text-base font-black text-white">Pantalla de Carga Inicial</h3>
                <span className="text-xs text-gray-400">Habilita o deshabilita la animación e intro de bienvenida al ingresar al menú</span>
              </div>
              <Sparkles className="text-amber-400" size={20} />
            </div>

            <div className="p-4 rounded-2xl bg-[#161924] border border-[#262a3c] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⏳</span>
                  <h4 className="font-extrabold text-sm text-white">Intro y Pantalla de Carga del Menú</h4>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {loadingScreenEnabled
                    ? 'Activada: Los comensales verán la animación e intro de bienvenida de KAL DISCOBAR antes de entrar a la carta.'
                    : 'Desactivada: Los comensales ingresan directamente a la carta digital de inmediato sin esperas.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleLoadingScreen}
                className={`px-5 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
                  loadingScreenEnabled
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                }`}
              >
                {loadingScreenEnabled ? <Check size={16} strokeWidth={3} /> : <X size={16} strokeWidth={3} />}
                <span>{loadingScreenEnabled ? 'Pantalla de Carga Habilitada' : 'Pantalla de Carga Deshabilitada'}</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 4: HERO BACKGROUND VIDEOS                        */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'videos' && (
        <div className="p-6 rounded-3xl bg-[#11131c] border border-[#232738] space-y-4">
          <div className="flex items-center justify-between border-b border-[#232738] pb-3">
            <div>
              <h3 className="text-base font-black text-white">Videos de Fondo del Hero</h3>
              <span className="text-xs text-gray-400">Personaliza los videos y escenas temáticas de la cabecera</span>
            </div>
            <span className="text-xs font-bold text-amber-400">{heroVideos.length} videos configurados</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {heroVideos.map((vid) => (
              <div
                key={vid.id}
                className="p-4 rounded-2xl bg-[#161924] border border-[#262a3c] space-y-3"
              >
                <div className="relative rounded-xl overflow-hidden bg-black/60 aspect-video border border-white/10">
                  <video
                    src={vid.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-400 border border-amber-500/30">
                    Escena: {vid.scene}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-white">{vid.title}</h4>
                    <span className="text-[11px] text-gray-400 font-mono block truncate max-w-[200px]">
                      {vid.url}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteHeroVideo(vid.id)}
                    className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                    title="Eliminar Video"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 5: SOCIAL MEDIA LINKS & CONTACT CONFIG           */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'social' && (
        <div className="p-6 rounded-3xl bg-[#11131c] border border-[#232738] space-y-5">
          <div className="flex items-center justify-between border-b border-[#232738] pb-3">
            <div>
              <h3 className="text-base font-black text-white">Configuración de Redes Sociales & Contacto</h3>
              <span className="text-xs text-gray-400">Edita los enlaces que se abren en el botón flotante y pie de página</span>
            </div>
            <Share2 className="text-amber-400" size={20} />
          </div>

          {socialSavedMsg && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              <span>{socialSavedMsg}</span>
            </motion.div>
          )}

          <form onSubmit={handleSaveSocialLinks} className="space-y-4 text-xs">
            
            {/* WhatsApp */}
            <div className="p-4 rounded-2xl bg-[#161924] border border-[#262a3c] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-extrabold text-sm">
                  <span className="text-xl">🟢</span>
                  <span>WhatsApp Reservas VIP</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSocialForm({ ...socialForm, whatsappEnabled: socialForm.whatsappEnabled === false ? true : false })}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    socialForm.whatsappEnabled !== false
                      ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {socialForm.whatsappEnabled !== false ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
                  <span>{socialForm.whatsappEnabled !== false ? 'Habilitado' : 'Deshabilitado'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-white/5">
                <div className="space-y-1">
                  <label className="text-gray-300 font-bold block">Número de WhatsApp (con código de país sin +)</label>
                  <input
                    type="text"
                    value={socialForm.whatsappNumber || ''}
                    onChange={(e) => setSocialForm({ ...socialForm, whatsappNumber: e.target.value })}
                    placeholder="573135248660"
                    className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#232738] text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-bold block">Mensaje Predeterminado</label>
                  <input
                    type="text"
                    value={socialForm.whatsappMessage || ''}
                    onChange={(e) => setSocialForm({ ...socialForm, whatsappMessage: e.target.value })}
                    placeholder="¡Hola KAL DISCOBAR! Quiero reservar..."
                    className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#232738] text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Instagram */}
            <div className="p-4 rounded-2xl bg-[#161924] border border-[#262a3c] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-extrabold text-sm">
                  <span className="text-xl">🌸</span>
                  <span>Instagram Oficial</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSocialForm({ ...socialForm, instagramEnabled: socialForm.instagramEnabled === false ? true : false })}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    socialForm.instagramEnabled !== false
                      ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {socialForm.instagramEnabled !== false ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
                  <span>{socialForm.instagramEnabled !== false ? 'Habilitado' : 'Deshabilitado'}</span>
                </button>
              </div>

              <div className="space-y-1 pt-1 border-t border-white/5">
                <label className="text-gray-300 font-bold block">Enlace de Instagram Oficial</label>
                <input
                  type="url"
                  value={socialForm.instagramUrl || ''}
                  onChange={(e) => setSocialForm({ ...socialForm, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/kaldiscobar"
                  className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#232738] text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* TikTok */}
            <div className="p-4 rounded-2xl bg-[#161924] border border-[#262a3c] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-extrabold text-sm">
                  <span className="text-xl">🩵</span>
                  <span>TikTok Oficial</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSocialForm({ ...socialForm, tiktokEnabled: socialForm.tiktokEnabled === false ? true : false })}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    socialForm.tiktokEnabled !== false
                      ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {socialForm.tiktokEnabled !== false ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
                  <span>{socialForm.tiktokEnabled !== false ? 'Habilitado' : 'Deshabilitado'}</span>
                </button>
              </div>

              <div className="space-y-1 pt-1 border-t border-white/5">
                <label className="text-gray-300 font-bold block">Enlace de TikTok Oficial</label>
                <input
                  type="url"
                  value={socialForm.tiktokUrl || ''}
                  onChange={(e) => setSocialForm({ ...socialForm, tiktokUrl: e.target.value })}
                  placeholder="https://tiktok.com/@kaldiscobar"
                  className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#232738] text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Facebook */}
            <div className="p-4 rounded-2xl bg-[#161924] border border-[#262a3c] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-extrabold text-sm">
                  <span className="text-xl">🔵</span>
                  <span>Facebook Oficial</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSocialForm({ ...socialForm, facebookEnabled: socialForm.facebookEnabled === false ? true : false })}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    socialForm.facebookEnabled !== false
                      ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {socialForm.facebookEnabled !== false ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
                  <span>{socialForm.facebookEnabled !== false ? 'Habilitado' : 'Deshabilitado'}</span>
                </button>
              </div>

              <div className="space-y-1 pt-1 border-t border-white/5">
                <label className="text-gray-300 font-bold block">Enlace de Facebook Oficial</label>
                <input
                  type="url"
                  value={socialForm.facebookUrl || ''}
                  onChange={(e) => setSocialForm({ ...socialForm, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/kaldiscobar"
                  className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#232738] text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Phone Call */}
            <div className="p-4 rounded-2xl bg-[#161924] border border-[#262a3c] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-extrabold text-sm">
                  <span className="text-xl">🟡</span>
                  <span>Llamada Directa (Teléfono)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSocialForm({ ...socialForm, phoneEnabled: socialForm.phoneEnabled === false ? true : false })}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    socialForm.phoneEnabled !== false
                      ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {socialForm.phoneEnabled !== false ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
                  <span>{socialForm.phoneEnabled !== false ? 'Habilitado' : 'Deshabilitado'}</span>
                </button>
              </div>

              <div className="space-y-1 pt-1 border-t border-white/5">
                <label className="text-gray-300 font-bold block">Teléfono de Atención (con +)</label>
                <input
                  type="text"
                  value={socialForm.phoneNumber || ''}
                  onChange={(e) => setSocialForm({ ...socialForm, phoneNumber: e.target.value })}
                  placeholder="+573135248660"
                  className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#232738] text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#232738] flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Guardar Redes Sociales
              </button>
            </div>

          </form>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 6: TABLE SECURITY CODES                         */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'table-codes' && (
        <div className="p-6 rounded-3xl bg-[#11131c] border border-[#232738] space-y-4">
          <div className="flex items-center justify-between border-b border-[#232738] pb-3">
            <div>
              <h3 className="text-base font-black text-white">Claves de Seguridad para Mesas (1 al 15)</h3>
              <span className="text-xs text-gray-400">Códigos de 5 caracteres que validan la comanda en la mesa física</span>
            </div>
            <span className="text-xs text-amber-400 font-bold">15 Mesas Asignadas</span>
          </div>

          {savedCodeMsg && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              <span>{savedCodeMsg}</span>
            </motion.div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {Array.from({ length: 15 }, (_, i) => i + 1).map((tableNum) => {
              const currentVal = localCodes[tableNum] || '';
              return (
                <div
                  key={tableNum}
                  className="p-3.5 rounded-2xl bg-[#161924] border border-[#262a3c] space-y-2 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">Mesa #{tableNum}</span>
                    <span className="text-[10px] text-gray-500 font-mono">5 Caracteres</span>
                  </div>

                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      maxLength={5}
                      value={currentVal}
                      onChange={(e) => {
                        setLocalCodes({
                          ...localCodes,
                          [tableNum]: e.target.value.toUpperCase()
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-[#0a0c12] border border-[#262a3c] text-amber-400 font-mono uppercase font-black text-center text-xs focus:outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={() => handleSaveTableCode(tableNum)}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-500 text-black font-black text-xs hover:bg-amber-400 transition-all cursor-pointer shrink-0"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: ADD / EDIT PRODUCT                            */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {showDishModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="w-full max-w-lg bg-[#12141c] border border-[#2a2e3f] rounded-3xl p-6 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#2a2e3f] pb-3">
                <h3 className="text-base font-black text-white">
                  {editingDish ? 'Editar Producto del Menú' : 'Agregar Nuevo Producto'}
                </h3>
                <button onClick={() => setShowDishModal(false)} className="p-1 text-gray-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveDish} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-gray-400 block mb-1 font-bold">Nombre del Producto (Español) *</label>
                  <input
                    type="text"
                    required
                    value={dishNameEs}
                    onChange={(e) => setDishNameEs(e.target.value)}
                    placeholder="Ej: Tequila Don Julio 70"
                    className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#2a2e3f] text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1 font-bold">Nombre del Producto (Inglés)</label>
                  <input
                    type="text"
                    value={dishNameEn}
                    onChange={(e) => setDishNameEn(e.target.value)}
                    placeholder="Ej: Don Julio 70 Tequila"
                    className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#2a2e3f] text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-gray-400 block mb-1 font-bold">Categoría</label>
                    <select
                      value={dishCategory}
                      onChange={(e) => setDishCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#2a2e3f] text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="licores">Licores & Botellas</option>
                      <option value="cocteles">Cócteles de Autor</option>
                      <option value="cervezas">Cervezas</option>
                      <option value="mezcladores">Mezcladores & Bebidas</option>
                      <option value="snacks">Snacks & Comida</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1 font-bold">Precio en Pesos (COP) *</label>
                    <input
                      type="number"
                      step={1000}
                      required
                      value={dishPriceCOP}
                      onChange={(e) => setDishPriceCOP(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#2a2e3f] text-amber-400 font-mono font-black focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1 font-bold">Ruta de Imagen o URL</label>
                  <input
                    type="text"
                    value={dishImage}
                    onChange={(e) => setDishImage(e.target.value)}
                    placeholder="/licores_sin_fondo/..."
                    className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#2a2e3f] text-white focus:outline-none focus:border-amber-400 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1 font-bold">Descripción del Producto</label>
                  <textarea
                    rows={2}
                    value={dishDescEs}
                    onChange={(e) => setDishDescEs(e.target.value)}
                    placeholder="Detalles de la botella, destilado o cóctel..."
                    className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#2a2e3f] text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-3 border-t border-[#2a2e3f] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDishModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#171b26] text-gray-400 font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-black hover:bg-amber-400 shadow"
                  >
                    Guardar Producto
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* MODAL: SUBIR / AGREGAR VIDEO DEL HERO                */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {showVideoModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="w-full max-w-md bg-[#12141c] border border-[#2a2e3f] rounded-3xl p-6 text-white shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#2a2e3f] pb-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <Video size={18} />
                  <h3 className="text-base font-black text-white">Agregar Video de Fondo al Hero</h3>
                </div>
                <button onClick={() => setShowVideoModal(false)} className="p-1 text-gray-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveHeroVideo} className="space-y-3 text-xs">
                <div>
                  <label className="text-gray-400 block mb-1 font-bold">Título o Nombre del Video *</label>
                  <input
                    type="text"
                    required
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Ej: Video DJ Show Nocturno"
                    className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#2a2e3f] text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1 font-bold">Ruta Local o URL de Video (MP4) *</label>
                  <input
                    type="text"
                    required
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="/menu-assets/header licor.mp4 o https://..."
                    className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#2a2e3f] text-white font-mono focus:outline-none focus:border-amber-400 text-[11px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-gray-400 block mb-1 font-bold">Escena / Modo Asociado</label>
                    <select
                      value={videoScene}
                      onChange={(e) => setVideoScene(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#2a2e3f] text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="drinks">Licores VIP (drinks)</option>
                      <option value="bar-show">Fiesta & DJ Show (bar-show)</option>
                      <option value="cobra">Natura VIP (cobra)</option>
                      <option value="serpientes">Serpientes VIP (serpientes)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1 font-bold">Etiqueta Badge</label>
                    <input
                      type="text"
                      value={videoBadge}
                      onChange={(e) => setVideoBadge(e.target.value)}
                      placeholder="🍾 MODO LICORES VIP 🔞"
                      className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#2a2e3f] text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#2a2e3f] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowVideoModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#171b26] text-gray-400 font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-black hover:bg-amber-400 shadow"
                  >
                    Guardar Video
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* MODAL: EDIT FILTER / CATEGORY (EMOJI & TEXT)         */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {showFilterModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="w-full max-w-md bg-[#12141c] border border-[#2a2e3f] rounded-3xl p-6 text-white shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#2a2e3f] pb-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <Flame size={18} />
                  <h3 className="text-base font-black text-white">
                    {editingFilterItem ? 'Editar Filtro / Categoría' : 'Nuevo Filtro'}
                  </h3>
                </div>
                <button onClick={() => setShowFilterModal(false)} className="p-1 text-gray-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveFilter} className="space-y-3 text-xs">
                {filterType !== 'category' && (
                  <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-1 space-y-1">
                      <label className="text-gray-400 block font-bold">Emoji / Ícono</label>
                      <input
                        type="text"
                        value={filterIcon}
                        onChange={(e) => setFilterIcon(e.target.value)}
                        placeholder="🍸"
                        className="w-full p-2.5 text-center text-lg rounded-xl bg-[#0a0c12] border border-[#2a2e3f] text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="col-span-3 space-y-1">
                      <label className="text-gray-400 block font-bold">Identificador Único (ID)</label>
                      <input
                        type="text"
                        value={filterId}
                        onChange={(e) => setFilterId(e.target.value)}
                        placeholder="ej: fuerte, dulce, cocteles"
                        className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#2a2e3f] text-amber-400 font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                )}

                {filterType === 'category' && (
                  <div className="space-y-1">
                    <label className="text-gray-400 block font-bold">ID de Categoría</label>
                    <input
                      type="text"
                      value={filterId}
                      onChange={(e) => setFilterId(e.target.value)}
                      placeholder="ej: licores, cervezas"
                      className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#2a2e3f] text-amber-400 font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-gray-400 block font-bold">Nombre / Etiqueta en Español *</label>
                  <input
                    type="text"
                    required
                    value={filterLabelEs}
                    onChange={(e) => setFilterLabelEs(e.target.value)}
                    placeholder="Ej: Fuerte / Licor (30%+)"
                    className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#2a2e3f] text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 block font-bold">Nombre / Etiqueta en Inglés</label>
                  <input
                    type="text"
                    value={filterLabelEn}
                    onChange={(e) => setFilterLabelEn(e.target.value)}
                    placeholder="Ej: Strong / Spirits (30%+)"
                    className="w-full p-2.5 rounded-xl bg-[#0a0c12] border border-[#2a2e3f] text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-3 border-t border-[#2a2e3f] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFilterModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#171b26] text-gray-400 font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-black hover:bg-amber-400 shadow cursor-pointer"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
