// paradu'l — Edit Clothing Modal

import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import { IconCheck } from '../common/Icons.jsx';

const CATEGORY_OPTIONS = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'shoes', label: 'Shoes' },
];

const STYLE_OPTIONS = [
  'Casual', 'Formal', 'Business Casual', 'Smart Casual',
  'Streetwear', 'Athleisure', 'Bohemian', 'Minimalist',
  'Preppy', 'Vintage', 'Romantic', 'Sporty',
];

const LAUNDRY_OPTIONS = [
  { value: 'available', label: 'Clean & Available' },
  { value: 'in_laundry', label: 'In Laundry' },
];

export default function EditClothingModal({ item, onClose, onSave }) {
  const [name, setName] = useState(item.name || '');
  const [category, setCategory] = useState(item.category || 'top');
  const [color, setColor] = useState(item.color || '');
  const [price, setPrice] = useState(item.price ?? '');
  const [style, setStyle] = useState(item.style || 'Casual');
  const [laundryStatus, setLaundryStatus] = useState(item.laundryStatus || 'available');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Item name is required.');
      return;
    }
    setError('');
    setIsSaving(true);
    try {
      await onSave({
        name: name.trim(),
        category,
        color: color.trim(),
        price: price !== '' ? Number(price) : undefined,
        style,
        laundryStatus,
      });
    } catch (err) {
      setError(`Failed to save: ${err.message}`);
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Clothing Details">
      <form onSubmit={handleSubmit} className="edit-clothing-form">
        {/* Item preview thumbnail */}
        <div className="edit-form-preview">
          <div className="edit-preview-frame">
            <img src={item.imageUrl} alt={item.name} className="edit-preview-img" />
          </div>
          <p className="edit-preview-hint">
            To change the photo, delete this item and re-upload.
          </p>
        </div>

        {/* Name */}
        <div className="edit-form-group">
          <label className="edit-form-label" htmlFor="edit-name">
            Item Name <span className="required-star">*</span>
          </label>
          <input
            id="edit-name"
            type="text"
            className="edit-form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ivory Linen Blouse"
            required
          />
        </div>

        {/* Category + Style row */}
        <div className="edit-form-row">
          <div className="edit-form-group">
            <label className="edit-form-label" htmlFor="edit-category">Category</label>
            <select
              id="edit-category"
              className="edit-form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="edit-form-group">
            <label className="edit-form-label" htmlFor="edit-style">Style</label>
            <select
              id="edit-style"
              className="edit-form-select"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              {STYLE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Color + Price row */}
        <div className="edit-form-row">
          <div className="edit-form-group">
            <label className="edit-form-label" htmlFor="edit-color">Color</label>
            <input
              id="edit-color"
              type="text"
              className="edit-form-input"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="e.g. Ivory, Navy, Black"
            />
          </div>

          <div className="edit-form-group">
            <label className="edit-form-label" htmlFor="edit-price">Price (₱)</label>
            <input
              id="edit-price"
              type="number"
              min="0"
              step="0.01"
              className="edit-form-input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 1200"
            />
          </div>
        </div>

        {/* Laundry Status */}
        <div className="edit-form-group">
          <label className="edit-form-label" htmlFor="edit-laundry">Laundry Status</label>
          <select
            id="edit-laundry"
            className="edit-form-select"
            value={laundryStatus}
            onChange={(e) => setLaundryStatus(e.target.value)}
          >
            {LAUNDRY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Error message */}
        {error && (
          <p className="edit-form-error" role="alert">{error}</p>
        )}

        {/* Actions */}
        <div className="edit-form-actions">
          <button
            type="button"
            className="btn-wireframe-secondary"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-wireframe-primary"
            disabled={isSaving}
          >
            {isSaving ? (
              <span>Saving…</span>
            ) : (
              <>
                <IconCheck size={15} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
