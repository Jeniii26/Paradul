// paradu'l — Schedule Outfit Modal

import { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx';
import { IconCalendar, IconCheck } from '../common/Icons.jsx';

export default function ScheduleModal({
  isOpen,
  onClose,
  outfits,
  clothingItems,
  onSaveSchedule,
  initialOutfit = null,
  editingSchedule = null,
}) {
  const [outfitId, setOutfitId] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [occasion, setOccasion] = useState('Casual');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingSchedule) {
      setOutfitId(editingSchedule.outfitId || '');
      setDate(editingSchedule.date || new Date().toISOString().split('T')[0]);
      setOccasion(editingSchedule.occasion || 'Casual');
      setNotes(editingSchedule.notes || '');
      setError('');
    } else if (initialOutfit) {
      setOutfitId(initialOutfit.id);
      setDate(new Date().toISOString().split('T')[0]);
      setOccasion(initialOutfit.style || 'Casual');
      setNotes('');
      setError('');
    } else {
      setOutfitId(outfits[0]?.id || '');
      setDate(new Date().toISOString().split('T')[0]);
      setOccasion('Casual');
      setNotes('');
      setError('');
    }
  }, [editingSchedule, initialOutfit, outfits, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!outfitId) {
      setError('Please select an outfit to schedule.');
      return;
    }
    if (!date) {
      setError('Please choose a date.');
      return;
    }

    const payload = {
      ...(editingSchedule ? { id: editingSchedule.id, status: editingSchedule.status } : {}),
      outfitId,
      date,
      occasion: occasion.trim(),
      notes: notes.trim(),
    };

    onSaveSchedule(payload);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingSchedule ? 'Edit Scheduled Outfit' : 'Schedule Outfit'}
      maxWidth="500px"
    >
      <form onSubmit={handleSubmit} className="schedule-form">
        {error && (
          <div className="form-error-banner" role="alert">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="schedule-outfit">Select Outfit *</label>
          <select
            id="schedule-outfit"
            value={outfitId}
            onChange={(e) => setOutfitId(e.target.value)}
            required
          >
            <option value="">-- Choose an Outfit --</option>
            {outfits.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} ({o.style || 'Casual'})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="schedule-date">Date *</label>
          <input
            id="schedule-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="schedule-occasion">Occasion</label>
          <input
            id="schedule-occasion"
            type="text"
            placeholder="e.g. Work Meeting, Weekend Brunch, Dinner Date"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="schedule-notes">Notes</label>
          <textarea
            id="schedule-notes"
            rows={2}
            placeholder="Weather forecast, layers, accessories..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="modal-actions-footer">
          <button type="button" className="btn-ghost-medium" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary-medium">
            <IconCheck size={16} />
            <span>{editingSchedule ? 'Update Schedule' : 'Schedule Outfit'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
