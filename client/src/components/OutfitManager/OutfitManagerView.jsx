/**
 * paradu'l — Outfit Manager View (Wireframe Spec)
 *
 * Implements the Figma wireframe Outfit Manager specification:
 * 1. Page Title Header:
 *    - Title: "Outfit Manager"
 *    - Subtitle: "X saved looks • 3-piece coordinated ensembles"
 *    - Right buttons: "Randomize" (secondary) and "Create Outfit" (primary)
 * 2. 2-to-3 column grid of 3-piece outfit cards
 * 3. Outfit Creator and Randomizer Modal
 */

import { useState, useMemo } from 'react';
import OutfitCard from './OutfitCard.jsx';
import OutfitCreatorModal from './OutfitCreatorModal.jsx';
import { IconPlus, IconSparkles, IconHanger } from '../common/Icons.jsx';

export default function OutfitManagerView({
  outfits,
  clothingItems,
  wearRecords,
  onSaveOutfit,
  onDeleteOutfit,
  onOpenScheduleModal,
}) {
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [editingOutfit, setEditingOutfit] = useState(null);
  const [startWithRandom, setStartWithRandom] = useState(false);

  // Compute wear counts per outfit from wear records
  const wearCountsMap = useMemo(() => {
    const map = new Map();
    for (const record of wearRecords) {
      const key = String(record.outfitId);
      map.set(key, (map.get(key) || 0) + 1);
    }
    return map;
  }, [wearRecords]);

  const handleOpenCreate = () => {
    setEditingOutfit(null);
    setStartWithRandom(false);
    setIsCreatorOpen(true);
  };

  const handleOpenRandomize = () => {
    setEditingOutfit(null);
    setStartWithRandom(true);
    setIsCreatorOpen(true);
  };

  const handleEditOutfit = (outfit) => {
    setEditingOutfit(outfit);
    setStartWithRandom(false);
    setIsCreatorOpen(true);
  };

  return (
    <div className="outfit-manager-wireframe-view">
      {/* 1. Header with Title & Action Buttons */}
      <section className="wireframe-page-heading-row">
        <div className="heading-title-group">
          <h1 className="wireframe-main-title">Outfit Manager</h1>
          <p className="wireframe-main-subtitle">
            {outfits.length} saved {outfits.length === 1 ? 'look' : 'looks'} • 3-piece coordinated ensembles
          </p>
        </div>

        <div className="heading-actions-group">
          <button
            type="button"
            className="btn-wireframe-secondary"
            onClick={handleOpenRandomize}
            title="Randomly pair clean top, bottom, and shoes"
          >
            <span>Randomize</span>
          </button>

          <button
            type="button"
            className="btn-wireframe-primary"
            onClick={handleOpenCreate}
            title="Build a 3-piece coordinated outfit"
          >
            <span>Create Outfit</span>
          </button>
        </div>
      </section>

      {/* 2. Outfits Grid or Empty State */}
      {outfits.length > 0 ? (
        <div className="wireframe-outfits-grid">
          {outfits.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              clothingItems={clothingItems}
              wearCount={wearCountsMap.get(String(outfit.id)) || 0}
              onSchedule={onOpenScheduleModal}
              onEdit={handleEditOutfit}
              onDelete={onDeleteOutfit}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state-card" role="region" aria-label="No outfits created">
          <div className="empty-icon-circle">
            <IconHanger size={36} />
          </div>
          <h2 className="empty-state-title">No outfits created yet</h2>
          <p className="empty-state-desc">
            Assemble your first 3-piece look (Top + Bottom + Shoes), or click Randomize
            to instantly generate a look from your clean clothes.
          </p>
          <div className="empty-state-actions">
            <button
              type="button"
              className="btn-wireframe-primary"
              onClick={handleOpenCreate}
            >
              <IconPlus size={16} />
              <span>Create First Outfit</span>
            </button>
          </div>
        </div>
      )}

      {/* Outfit Creator & Customizer Dialog */}
      <OutfitCreatorModal
        isOpen={isCreatorOpen}
        onClose={() => {
          setIsCreatorOpen(false);
          setStartWithRandom(false);
        }}
        clothingItems={clothingItems}
        onSaveOutfit={onSaveOutfit}
        editingOutfit={editingOutfit}
        startWithRandom={startWithRandom}
      />
    </div>
  );
}
