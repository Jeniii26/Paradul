// paradu'l — Calendar & Outfit Planner View

import { useState, useMemo } from 'react';
import ScheduleModal from './ScheduleModal.jsx';
import {
  IconPlus,
  IconCheck,
  IconEdit,
  IconTrash,
  IconShirt,
  IconPants,
  IconShoes,
  IconCalendar,
} from '../common/Icons.jsx';

export default function CalendarView({
  schedules,
  outfits,
  clothingItems,
  onSaveSchedule,
  onDeleteSchedule,
  onMarkWorn,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'scheduled' | 'worn'

  // Lookup maps
  const outfitMap = new Map(outfits.map((o) => [String(o.id), o]));
  const clothingMap = new Map(clothingItems.map((c) => [String(c.id), c]));

  // Filtered schedules sorted chronologically
  const filteredSchedules = useMemo(() => {
    return schedules
      .filter((s) => {
        if (statusFilter === 'all') return true;
        return s.status === statusFilter;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [schedules, statusFilter]);

  const scheduledCount = schedules.filter((s) => s.status === 'scheduled').length;
  const wornCount = schedules.filter((s) => s.status === 'worn').length;

  const handleOpenAdd = () => {
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sched) => {
    setEditingSchedule(sched);
    setIsModalOpen(true);
  };

  return (
    <div className="calendar-wireframe-view">
      <section className="wireframe-page-heading-row">
        <div className="heading-title-group">
          <h1 className="wireframe-main-title">Outfit Planner & Calendar</h1>
          <p className="wireframe-main-subtitle">
            {scheduledCount} upcoming planned • {wornCount} confirmed worn
          </p>
        </div>

        <div className="heading-actions-group">
          <button
            type="button"
            className="btn-wireframe-primary"
            onClick={handleOpenAdd}
            disabled={outfits.length === 0}
            title={outfits.length === 0 ? 'Create an outfit first in Outfit Manager' : 'Schedule Outfit'}
          >
            <span>Schedule Outfit</span>
          </button>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="wireframe-category-pills-row" aria-label="Filter calendar events">
        <button
          type="button"
          className={`wireframe-category-pill ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          All Events
        </button>
        <button
          type="button"
          className={`wireframe-category-pill ${statusFilter === 'scheduled' ? 'active' : ''}`}
          onClick={() => setStatusFilter('scheduled')}
        >
          Scheduled
        </button>
        <button
          type="button"
          className={`wireframe-category-pill ${statusFilter === 'worn' ? 'active' : ''}`}
          onClick={() => setStatusFilter('worn')}
        >
          Confirmed Worn
        </button>
      </section>

      {/* Schedule Event Cards */}
      {filteredSchedules.length > 0 ? (
        <div className="wireframe-calendar-events-list">
          {filteredSchedules.map((schedule) => {
            const outfit = outfitMap.get(String(schedule.outfitId));
            const topItem = outfit ? clothingMap.get(String(outfit.topId)) : null;
            const bottomItem = outfit ? clothingMap.get(String(outfit.bottomId)) : null;
            const shoesItem = outfit ? clothingMap.get(String(outfit.shoesId)) : null;
            const isWorn = schedule.status === 'worn';

            // Uppercase piece names summary
            const piecesSummary = [
              topItem?.name || 'TOP',
              bottomItem?.name || 'BOTTOM',
              shoesItem?.name || 'SHOES',
            ]
              .join(' • ')
              .toUpperCase();

            return (
              <article
                key={schedule.id}
                className={`wireframe-calendar-card ${isWorn ? 'is-worn' : 'is-scheduled'}`}
              >
                {/* Left Date Block */}
                <div className={`wireframe-date-badge ${isWorn ? 'badge-worn' : 'badge-scheduled'}`}>
                  <span className="badge-month">{formatMonth(schedule.date)}</span>
                  <span className="badge-day">{formatDay(schedule.date)}</span>
                  <span className="badge-year">{formatYear(schedule.date)}</span>
                  <span className="badge-status-pill">
                    {isWorn ? 'Worn' : 'Scheduled'}
                  </span>
                </div>

                {/* 3 Piece Thumbnail Frames */}
                <div className="calendar-outfit-trio-thumbnails">
                  <div className="mini-thumbnail-box" title={`Top: ${topItem?.name || 'Top'}`}>
                    <div className="transparency-checkered-canvas" />
                    {topItem ? (
                      <img src={topItem.imageUrl} alt="" className="mini-thumbnail-img" />
                    ) : (
                      <IconShirt size={16} />
                    )}
                  </div>

                  <div className="mini-thumbnail-box" title={`Bottom: ${bottomItem?.name || 'Bottom'}`}>
                    <div className="transparency-checkered-canvas" />
                    {bottomItem ? (
                      <img src={bottomItem.imageUrl} alt="" className="mini-thumbnail-img" />
                    ) : (
                      <IconPants size={16} />
                    )}
                  </div>

                  <div className="mini-thumbnail-box" title={`Shoes: ${shoesItem?.name || 'Shoes'}`}>
                    <div className="transparency-checkered-canvas" />
                    {shoesItem ? (
                      <img src={shoesItem.imageUrl} alt="" className="mini-thumbnail-img" />
                    ) : (
                      <IconShoes size={16} />
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="calendar-event-details">
                  <h3 className="calendar-event-outfit-title">
                    {outfit?.name || 'Custom Outfit'}
                  </h3>
                  <p className="calendar-pieces-summary">{piecesSummary}</p>
                  {schedule.occasion && (
                    <span className="calendar-occasion-tag">{schedule.occasion}</span>
                  )}
                  {schedule.notes && (
                    <p className="calendar-event-notes">{schedule.notes}</p>
                  )}
                </div>

                {/* Right Actions */}
                <div className="calendar-card-right-actions">
                  {!isWorn ? (
                    <button
                      type="button"
                      className="btn-wireframe-mark-worn"
                      onClick={() => onMarkWorn(schedule.id)}
                      title="Confirm wear: changes status to Worn and places Top & Bottom into 7-day laundry"
                    >
                      <span>Mark as worn</span>
                    </button>
                  ) : (
                    <span className="calendar-worn-recorded-label">
                      Worn Recorded
                    </span>
                  )}

                  <div className="calendar-aux-buttons-group">
                    <button
                      type="button"
                      className="btn-wireframe-icon-square"
                      onClick={() => handleOpenEdit(schedule)}
                      title="Edit schedule details"
                      aria-label="Edit schedule"
                    >
                      <IconEdit size={14} />
                    </button>

                    <button
                      type="button"
                      className="btn-wireframe-icon-square danger"
                      onClick={() => onDeleteSchedule(schedule.id)}
                      title="Remove from calendar"
                      aria-label="Delete schedule"
                    >
                      <IconTrash size={14} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state-card" role="region" aria-label="No outfits scheduled">
          <div className="empty-icon-circle">
            <IconCalendar size={36} />
          </div>
          <h2 className="empty-state-title">No outfits scheduled</h2>
          <p className="empty-state-desc">
            Plan your outfits ahead on your calendar. Once worn, click "Mark as worn"
            to automatically record usage in your Wardrobe Analytics.
          </p>
          {outfits.length > 0 ? (
            <button
              type="button"
              className="btn-wireframe-primary"
              onClick={handleOpenAdd}
            >
              <IconPlus size={16} />
              <span>Schedule Outfit</span>
            </button>
          ) : (
            <p className="empty-sub-hint">
              Create an outfit in Outfit Manager first before scheduling.
            </p>
          )}
        </div>
      )}

      {/* Schedule Outfit Modal */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        outfits={outfits}
        clothingItems={clothingItems}
        onSaveSchedule={onSaveSchedule}
        editingSchedule={editingSchedule}
      />
    </div>
  );
}

function formatMonth(dateStr) {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short' });
  } catch {
    return 'Month';
  }
}

function formatDay(dateStr) {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.getDate();
  } catch {
    return '8';
  }
}

function formatYear(dateStr) {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.getFullYear();
  } catch {
    return 'Year';
  }
}
