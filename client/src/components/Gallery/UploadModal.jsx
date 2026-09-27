/**
 * paradu'l — Real Photo Upload & Image Processing Modal
 *
 * Implements real file upload from device, genuine background removal,
 * assisted category and color detection, preview toggle (transparent vs original),
 * and manual metadata editing before saving.
 */

import { useState, useRef } from 'react';
import Modal from '../common/Modal.jsx';
import { removeBackground, detectClothing } from '../../services/imageProcessingService.js';
import { IconUpload, IconSparkles, IconRefresh, IconCheck, IconEye } from '../common/Icons.jsx';

export default function UploadModal({ isOpen, onClose, onSaveItem }) {
  const fileInputRef = useRef(null);

  // Upload & processing pipeline states
  const [selectedFile, setSelectedFile] = useState(null);
  const [processingStep, setProcessingStep] = useState(null); // 'idle' | 'preparing' | 'removing_bg' | 'detecting' | 'ready' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  // Processed image outputs
  const [processedImageUrl, setProcessedImageUrl] = useState('');
  const [originalImageUrl, setOriginalImageUrl] = useState('');
  const [previewMode, setPreviewMode] = useState('processed'); // 'processed' | 'original'
  const [hasTransparentBg, setHasTransparentBg] = useState(false);

  // Metadata form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('top');
  const [color, setColor] = useState('Black');
  const [price, setPrice] = useState(799);
  const [style, setStyle] = useState('Casual');
  const [laundryStatus, setLaundryStatus] = useState('available');
  const [confidence, setConfidence] = useState(null);

  // Reset form when modal closes or opens
  const resetForm = () => {
    setSelectedFile(null);
    setProcessingStep(null);
    setErrorMessage('');
    setProcessedImageUrl('');
    setOriginalImageUrl('');
    setPreviewMode('processed');
    setHasTransparentBg(false);
    setName('');
    setCategory('top');
    setColor('Black');
    setPrice(799);
    setStyle('Casual');
    setLaundryStatus('available');
    setConfidence(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleModalClose = () => {
    resetForm();
    onClose();
  };

  // Run the multi-stage image processing pipeline
  const processImageFile = async (file) => {
    try {
      setErrorMessage('');
      setSelectedFile(file);

      // UX Step 1: Preparing
      setProcessingStep('preparing');
      await new Promise((r) => setTimeout(r, 250));

      // UX Step 2: Removing background
      setProcessingStep('removing_bg');
      const bgResult = await removeBackground(file);
      setProcessedImageUrl(bgResult.imageUrl);
      setOriginalImageUrl(bgResult.originalImageUrl);
      setHasTransparentBg(bgResult.hasTransparentBackground);

      // UX Step 3: Detecting clothing type & color
      setProcessingStep('detecting');
      const detection = await detectClothing(file);
      setCategory(detection.category || 'top');
      setColor(detection.detectedColor || 'Black');
      setConfidence(Math.round((detection.confidence || 0.8) * 100));

      // Auto-suggest name based on detected properties
      const defaultName = `${detection.detectedColor} ${detection.category.charAt(0).toUpperCase() + detection.category.slice(1)}`;
      setName(defaultName);

      // UX Step 4: Ready!
      setProcessingStep('ready');
    } catch (err) {
      console.error('Image processing pipeline error:', err);
      setErrorMessage(
        'Automatic processing encountered an issue. You can still use the original image and enter details manually.'
      );
      setProcessingStep('error');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    }
  };

  const handleUseOriginalImage = () => {
    setPreviewMode('original');
    setProcessingStep('ready');
    setErrorMessage('');
  };

  const handleRetryProcessing = () => {
    if (selectedFile) {
      processImageFile(selectedFile);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please provide an item name.');
      return;
    }

    const finalImageUrl =
      previewMode === 'processed' && processedImageUrl
        ? processedImageUrl
        : originalImageUrl || processedImageUrl;

    const newItem = {
      name: name.trim(),
      imageUrl: finalImageUrl,
      originalImageUrl,
      category,
      color,
      price: Number(price) || 0,
      style,
      laundryStatus,
      laundryUntil: null,
    };

    onSaveItem(newItem);
    handleModalClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Add Clothing to Wardrobe"
      maxWidth="580px"
    >
      {!selectedFile || processingStep === 'idle' ? (
        /* Step A: File picker & drag-and-drop zone */
        <div
          className="upload-dropzone"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png,image/jpeg,image/webp,image/avif"
            style={{ display: 'none' }}
          />
          <div className="upload-icon-circle">
            <IconUpload size={32} />
          </div>
          <h3 className="upload-heading">Upload clothing photo</h3>
          <p className="upload-subtext">
            Drag and drop an image here, or browse from your device
          </p>
          <span className="btn-secondary-medium">Choose Photo</span>
          <p className="upload-hint">Supports JPEG, PNG, WebP • Auto background isolation</p>
        </div>
      ) : processingStep === 'preparing' ||
        processingStep === 'removing_bg' ||
        processingStep === 'detecting' ? (
        /* Step B: Multi-step processing indicator */
        <div className="upload-processing-box" role="status">
          <div className="processing-spinner" />
          <h3 className="processing-title">
            {processingStep === 'preparing' && 'Preparing your clothing photo...'}
            {processingStep === 'removing_bg' && 'Removing background & isolating clothing...'}
            {processingStep === 'detecting' && 'Detecting clothing type and color palette...'}
          </h3>
          <p className="processing-step-note">
            Client-side image analysis in progress
          </p>
          <div className="processing-progress-track">
            <div
              className="processing-progress-bar"
              style={{
                width:
                  processingStep === 'preparing'
                    ? '30%'
                    : processingStep === 'removing_bg'
                    ? '65%'
                    : '90%',
              }}
            />
          </div>
        </div>
      ) : processingStep === 'error' ? (
        /* Step C: Fallback state when processing fails */
        <div className="upload-error-fallback" role="alert">
          <div className="error-alert-banner">
            <p>
              We couldn't automatically isolate this image. You can still use the
              original photo and enter clothing details manually.
            </p>
          </div>
          <div className="error-fallback-actions">
            <button
              type="button"
              className="btn-secondary-medium"
              onClick={handleRetryProcessing}
            >
              <IconRefresh size={14} />
              <span>Try Again</span>
            </button>
            <button
              type="button"
              className="btn-primary-medium"
              onClick={handleUseOriginalImage}
            >
              <span>Use Original Image</span>
            </button>
            <button
              type="button"
              className="btn-ghost-medium"
              onClick={handleModalClose}
            >
              <span>Cancel</span>
            </button>
          </div>
        </div>
      ) : (
        /* Step D: Processed preview + Metadata Form */
        <form className="upload-metadata-form" onSubmit={handleSubmit}>
          {/* Image preview and toggle */}
          <div className="preview-and-toggle-area">
            <div className="processed-image-frame">
              <div className="transparency-checkered-canvas" />
              <img
                src={previewMode === 'processed' ? processedImageUrl : originalImageUrl}
                alt="Uploaded clothing preview"
                className="modal-preview-img"
              />
            </div>

            <div className="preview-mode-switch">
              <button
                type="button"
                className={`mode-toggle-btn ${previewMode === 'processed' ? 'active' : ''}`}
                onClick={() => setPreviewMode('processed')}
              >
                <IconSparkles size={14} />
                <span>Background Removed {hasTransparentBg ? '(Transparent)' : ''}</span>
              </button>
              <button
                type="button"
                className={`mode-toggle-btn ${previewMode === 'original' ? 'active' : ''}`}
                onClick={() => setPreviewMode('original')}
              >
                <IconEye size={14} />
                <span>Original Photo</span>
              </button>
            </div>
          </div>

          {/* Assisted detection notice */}
          {confidence && (
            <div className="assisted-detection-banner" role="status">
              <IconSparkles size={16} />
              <div>
                <strong>Assisted Detection:</strong> We identified a {color}{' '}
                {category.toUpperCase()} ({confidence}% match). Please confirm or edit details
                below.
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="form-error-banner" role="alert">
              {errorMessage}
            </div>
          )}

          {/* Metadata Form Fields */}
          <div className="form-grid-2">
            <div className="form-group full-width">
              <label htmlFor="meta-name">Item Name *</label>
              <input
                id="meta-name"
                type="text"
                placeholder="e.g. White Oversized Shirt"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="meta-category">Category *</label>
              <select
                id="meta-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="top">Top (Shirt, Jacket, Knit)</option>
                <option value="bottom">Bottom (Jeans, Pants, Skirt)</option>
                <option value="shoes">Shoes (Sneakers, Boots, Loafers)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="meta-color">Color *</label>
              <input
                id="meta-color"
                type="text"
                placeholder="e.g. White, Black, Navy"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="meta-price">Price (₱) *</label>
              <input
                id="meta-price"
                type="number"
                min="0"
                step="50"
                placeholder="799"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="meta-style">Style</label>
              <select
                id="meta-style"
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

            <div className="form-group full-width">
              <label htmlFor="meta-laundry">Initial Laundry Status</label>
              <select
                id="meta-laundry"
                value={laundryStatus}
                onChange={(e) => setLaundryStatus(e.target.value)}
              >
                <option value="available">Available (Clean & Ready)</option>
                <option value="in_laundry">In Laundry</option>
              </select>
            </div>
          </div>

          <div className="modal-actions-footer">
            <button
              type="button"
              className="btn-ghost-medium"
              onClick={handleModalClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary-medium"
            >
              <IconCheck size={16} />
              <span>Save to Wardrobe</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
