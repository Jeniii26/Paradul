/**
 * paradu'l — Outfit Manager View
 *
 * Tab dashboard for:
 * - Viewing all saved outfits
 * - Creating outfits manually (Top + Bottom + Shoes)
 * - Randomizing outfits
 * - Editing and deleting outfits
 * - Triggering calendar scheduling directly from outfit cards
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
    setIsCreatorOpen(true);
  };

  const handleEditOutfit = (outfit) => {
    setEditingOutfit(outfit);
    setIsCreatorOpen(true);
  };

  return (
    <div className="outfit-manager-view">
      {/* Header bar */}
      <section className="view-header">
        <div>
          <h1 className="view-title">Outfit Manager</h1>
          <p className="view-subtitle">
            {outfits.length} saved {outfits.length === 1 ? 'look' : 'looks'} • 3-piece coordinated ensembles
          </p>
        </div>

        <div className="view-header-actions">
          <button
            type="button"
            className="btn-secondary-medium"
            onClick={handleOpenCreate}
            title="Randomize or build a new look"
          >
            <IconSparkles size={16} />
            <span>Randomize Look</span>
          </button>

          <button
            type="button"
            className="btn-primary-medium"
            onClick={handleOpenCreate}
          >
            <IconPlus size={16} />
            <span>Create Outfit</span>
          </button>
        </div>
      </section>

      {/* Outfits Grid or Empty State */}
      {outfits.length > 0 ? (
        <div className="outfits-grid">
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
            Combine a top, bottom, and shoes to craft your first coordinated look, or let
            the randomizer build one instantly from your available clean clothes.
          </p>
          <div className="empty-state-actions">
            <button
              type="button"
              className="btn-primary-medium"
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
        onClose={() => setIsCreatorOpen(false)}
        clothingItems={clothingItems}
        onSaveOutfit={onSaveOutfit}
        editingOutfit={editingOutfit}
      />
    </div>
  );
}
