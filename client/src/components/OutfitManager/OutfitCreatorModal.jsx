// paradu'l — Outfit Creator & Customizer Modal

import { useState, useEffect, useMemo } from 'react';
import Modal from '../common/Modal.jsx';
import {
  IconSparkles,
  IconCheck,
  IconShirt,
  IconPants,
  IconShoes,
  IconRefresh,
} from '../common/Icons.jsx';

export default function OutfitCreatorModal({
  isOpen,
  onClose,
  clothingItems,
  onSaveOutfit,
  editingOutfit = null,
  startWithRandom = false,
}) {
  const [selectedTopId, setSelectedTopId] = useState('');
  const [selectedBottomId, setSelectedBottomId] = useState('');
  const [selectedShoesId, setSelectedShoesId] = useState('');
  const [name, setName] = useState('');
  const [style, setStyle] = useState('Casual');
  const [colorTheme, setColorTheme] = useState('');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState('');

  // Segregate clothing catalog by primary category
  const tops = useMemo(
    () => clothingItems.filter((i) => i.category === 'top'),
    [clothingItems]
  );
  const bottoms = useMemo(
    () => clothingItems.filter((i) => i.category === 'bottom'),
    [clothingItems]
  );
  const shoes = useMemo(
    () => clothingItems.filter((i) => i.category === 'shoes'),
    [clothingItems]
  );

  // Only clean items are eligible for outfit creation and randomization
  const availableTops = useMemo(
    () => tops.filter((i) => i.laundryStatus !== 'in_laundry'),
    [tops]
  );
  const availableBottoms = useMemo(
    () => bottoms.filter((i) => i.laundryStatus !== 'in_laundry'),
    [bottoms]
  );
  const availableShoes = useMemo(
    () => shoes.filter((i) => i.laundryStatus !== 'in_laundry'),
    [shoes]
  );

  // Prepopulate form if editing an existing outfit
  useEffect(() => {
    if (editingOutfit) {
      setSelectedTopId(editingOutfit.topId || '');
      setSelectedBottomId(editingOutfit.bottomId || '');
      setSelectedShoesId(editingOutfit.shoesId || '');
      setName(editingOutfit.name || '');
      setStyle(editingOutfit.style || 'Casual');
      setColorTheme(editingOutfit.colorTheme || '');
      setNotes(editingOutfit.notes || '');
      setValidationError('');
    } else {
      setValidationError('');
      if (startWithRandom && availableTops.length > 0 && availableBottoms.length > 0 && availableShoes.length > 0) {
        const randomTop = availableTops[Math.floor(Math.random() * availableTops.length)];
        const randomBottom = availableBottoms[Math.floor(Math.random() * availableBottoms.length)];
        const randomShoes = availableShoes[Math.floor(Math.random() * availableShoes.length)];
        setSelectedTopId(randomTop.id);
        setSelectedBottomId(randomBottom.id);
        setSelectedShoesId(randomShoes.id);
        setName(`Daily ${randomTop.color} & ${randomBottom.color} Fit`);
        setStyle(randomTop.style || 'Casual');
        setColorTheme(`${randomTop.color} / ${randomBottom.color}`);
        setNotes('');
      } else {
        setSelectedTopId('');
        setSelectedBottomId('');
        setSelectedShoesId('');
        setName('');
        setStyle('Casual');
        setColorTheme('');
        setNotes('');
      }
    }
  }, [editingOutfit, isOpen, startWithRandom, availableTops, availableBottoms, availableShoes]);

  // Selected item objects for live preview
  const currentTop = tops.find((i) => String(i.id) === String(selectedTopId));
  const currentBottom = bottoms.find((i) => String(i.id) === String(selectedBottomId));
  const currentShoes = shoes.find((i) => String(i.id) === String(selectedShoesId));

  // Randomly selects 1 clean top, 1 bottom, and 1 pair of shoes
  const handleRandomize = () => {
    setValidationError('');

    if (availableTops.length === 0) {
      setValidationError('No clean tops available for randomization. Please do laundry or add tops.');
      return;
    }
    if (availableBottoms.length === 0) {
      setValidationError('No clean bottoms available for randomization.');
      return;
    }
    if (availableShoes.length === 0) {
      setValidationError('No clean shoes available for randomization.');
      return;
    }

    const randomTop = availableTops[Math.floor(Math.random() * availableTops.length)];
    const randomBottom = availableBottoms[Math.floor(Math.random() * availableBottoms.length)];
    const randomShoes = availableShoes[Math.floor(Math.random() * availableShoes.length)];

    setSelectedTopId(randomTop.id);
    setSelectedBottomId(randomBottom.id);
    setSelectedShoesId(randomShoes.id);

    // Auto-generate a fun fashion name if name is currently blank
    if (!name.trim()) {
      const themes = ['Effortless', 'Signature', 'Urban', 'Daily', 'Refined', 'Weekend'];
      const chosenTheme = themes[Math.floor(Math.random() * themes.length)];
      setName(`${chosenTheme} ${randomTop.color} & ${randomBottom.color} Fit`);
      setColorTheme(`${randomTop.color} / ${randomBottom.color}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    // Validate that all three pieces are selected
    if (!selectedTopId || !selectedBottomId || !selectedShoesId) {
      setValidationError('An outfit requires all 3 pieces: 1 Top, 1 Bottom, and 1 pair of Shoes.');
      return;
    }

    if (!name.trim()) {
      setValidationError('Please give your outfit a name.');
      return;
    }

    const outfitData = {
      ...(editingOutfit ? { id: editingOutfit.id } : {}),
      name: name.trim(),
      topId: selectedTopId,
      bottomId: selectedBottomId,
      shoesId: selectedShoesId,
      style,
      colorTheme: colorTheme.trim() || `${currentTop?.color || ''} / ${currentBottom?.color || ''}`,
      notes: notes.trim(),
    };

    onSaveOutfit(outfitData);
    onClose();
  };

  const isFormComplete = selectedTopId && selectedBottomId && selectedShoesId && name.trim();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingOutfit ? 'Edit Outfit' : 'Create Outfit'}
      maxWidth="780px"
    >
      <div className="outfit-creator-layout">
        {/* Left Column: Live 3-Slot Visual Preview */}
        <div className="creator-preview-column">
          <div className="preview-header-bar">
            <span className="preview-title">Outfit Combination</span>
            <button
              type="button"
              className="btn-randomize-inline"
              onClick={handleRandomize}
              title="Randomly pick 1 available top, 1 bottom, and 1 shoes"
            >
              <IconSparkles size={14} />
              <span>Randomize</span>
            </button>
          </div>

          <div className="creator-visual-stack">
            {/* Top Preview */}
            <div className={`creator-tier-slot ${currentTop ? 'filled' : 'empty'}`}>
              <div className="transparency-checkered-canvas" />
              {currentTop ? (
                <>
                  <img src={currentTop.imageUrl} alt={currentTop.name} className="creator-tier-img" />
                  <div className="tier-caption">
                    <span className="tier-name">{currentTop.name}</span>
                    <span className="tier-badge">{currentTop.color}</span>
                  </div>
                </>
              ) : (
                <div className="slot-empty-prompt">
                  <IconShirt size={26} />
                  <span>Select a Top</span>
                </div>
              )}
            </div>

            {/* Bottom Preview */}
            <div className={`creator-tier-slot ${currentBottom ? 'filled' : 'empty'}`}>
              <div className="transparency-checkered-canvas" />
              {currentBottom ? (
                <>
                  <img src={currentBottom.imageUrl} alt={currentBottom.name} className="creator-tier-img" />
                  <div className="tier-caption">
                    <span className="tier-name">{currentBottom.name}</span>
                    <span className="tier-badge">{currentBottom.color}</span>
                  </div>
                </>
              ) : (
                <div className="slot-empty-prompt">
                  <IconPants size={26} />
                  <span>Select a Bottom</span>
                </div>
              )}
            </div>

            {/* Shoes Preview */}
            <div className={`creator-tier-slot ${currentShoes ? 'filled' : 'empty'}`}>
              <div className="transparency-checkered-canvas" />
              {currentShoes ? (
                <>
                  <img src={currentShoes.imageUrl} alt={currentShoes.name} className="creator-tier-img" />
                  <div className="tier-caption">
                    <span className="tier-name">{currentShoes.name}</span>
                    <span className="tier-badge">{currentShoes.color}</span>
                  </div>
                </>
              ) : (
                <div className="slot-empty-prompt">
                  <IconShoes size={26} />
                  <span>Select Shoes</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Piece Selectors & Form Details */}
        <form className="creator-form-column" onSubmit={handleSubmit}>
          {validationError && (
            <div className="form-error-banner" role="alert">
              {validationError}
            </div>
          )}

          {/* 1. Top Selector */}
          <div className="form-group">
            <label htmlFor="select-top">
              <IconShirt size={14} />
              <span>Choose Top * ({tops.length} available)</span>
            </label>
            <select
              id="select-top"
              value={selectedTopId}
              onChange={(e) => setSelectedTopId(e.target.value)}
              required
            >
              <option value="">-- Choose a Top --</option>
              {tops.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                  disabled={item.laundryStatus === 'in_laundry'}
                >
                  {item.name} ({item.color}) {item.laundryStatus === 'in_laundry' ? '— [In Laundry]' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Bottom Selector */}
          <div className="form-group">
            <label htmlFor="select-bottom">
              <IconPants size={14} />
              <span>Choose Bottom * ({bottoms.length} available)</span>
            </label>
            <select
              id="select-bottom"
              value={selectedBottomId}
              onChange={(e) => setSelectedBottomId(e.target.value)}
              required
            >
              <option value="">-- Choose a Bottom --</option>
              {bottoms.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                  disabled={item.laundryStatus === 'in_laundry'}
                >
                  {item.name} ({item.color}) {item.laundryStatus === 'in_laundry' ? '— [In Laundry]' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Shoes Selector */}
          <div className="form-group">
            <label htmlFor="select-shoes">
              <IconShoes size={14} />
              <span>Choose Shoes * ({shoes.length} available)</span>
            </label>
            <select
              id="select-shoes"
              value={selectedShoesId}
              onChange={(e) => setSelectedShoesId(e.target.value)}
              required
            >
              <option value="">-- Choose Shoes --</option>
              {shoes.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                  disabled={item.laundryStatus === 'in_laundry'}
                >
                  {item.name} ({item.color}) {item.laundryStatus === 'in_laundry' ? '— [In Laundry]' : ''}
                </option>
              ))}
            </select>
          </div>

          <hr className="form-divider" />

          {/* Outfit Name */}
          <div className="form-group">
            <label htmlFor="outfit-name">Outfit Name *</label>
            <input
              id="outfit-name"
              type="text"
              placeholder="e.g. Minimalist Studio Day"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Style & Color Theme */}
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="outfit-style">Style</label>
              <select
                id="outfit-style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                <option value="Casual">Casual</option>
                <option value="Smart Casual">Smart Casual</option>
                <option value="Formal">Formal</option>
                <option value="Streetwear">Streetwear</option>
                <option value="Minimalist">Minimalist</option>
                <option value="Athletic">Athletic</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="outfit-theme">Color Theme</label>
              <input
                id="outfit-theme"
                type="text"
                placeholder="e.g. Earthy Monochrome"
                value={colorTheme}
                onChange={(e) => setColorTheme(e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="outfit-notes">Notes & Occasions</label>
            <textarea
              id="outfit-notes"
              rows={2}
              placeholder="Good for gallery hopping, client talks, dinner..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="modal-actions-footer">
            <button type="button" className="btn-ghost-medium" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary-medium"
              disabled={!isFormComplete}
              title={
                !isFormComplete
                  ? 'Please select Top, Bottom, Shoes, and provide an Outfit Name'
                  : 'Save Outfit'
              }
            >
              <IconCheck size={16} />
              <span>{editingOutfit ? 'Update Outfit' : 'Save Outfit'}</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
