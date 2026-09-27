/**
 * paradu'l — Calendar & Outfit Planner View
 *
 * Implements:
 * - Schedule planner: calendar dates and scheduled events
 * - Clear distinction between "scheduled" (intent) and "worn" (confirmed wear)
 * - Prominent "[ Mark as Worn ]" action which triggers 7-day automatic laundry for Top & Bottom
 * - Add, edit, and delete scheduled calendar events
 * - Filter by status (All, Upcoming Scheduled, Worn History)
 */

import { useState, useMemo } from 'react';
import ScheduleModal from './ScheduleModal.jsx';
import {
  IconCalendar,
  IconPlus,
  IconCheck,
  IconEdit,
  IconTrash,
  IconShirt,
  IconPants,
  IconShoes,
  IconLaundry,
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
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

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
    <div className="calendar-view">
      {/* Header bar */}
      <section className="view-header">
        <div>
          <h1 className="view-title">Outfit Planner & Calendar</h1>
          <p className="view-subtitle">
            {scheduledCount} upcoming planned • {wornCount} confirmed worn
          </p>
        </div>

        <div className="view-header-actions">
          <button
            type="button"
            className="btn-primary-medium"
            onClick={handleOpenAdd}
            disabled={outfits.length === 0}
            title={outfits.length === 0 ? 'Create an outfit first before scheduling' : 'Schedule Outfit'}
          >
            <IconPlus size={16} />
            <span>Schedule Outfit</span>
          </button>
        </div>
      </section>

      {/* Distinction Explanation Banner */}
      <section className="calendar-concept-banner">
        <div className="concept-pill scheduled-pill">
          <strong>Scheduled</strong> = Planning what to wear
        </div>
        <span className="concept-arrow">➔</span>
        <div className="concept-pill worn-pill">
          <strong>Worn</strong> = Confirmed worn (automatically triggers 7-day laundry for tops & bottoms)
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="category-tabs-bar" aria-label="Filter calendar events">
        <button
          type="button"
          className={`category-pill ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          All Events ({schedules.length})
        </button>
        <button
          type="button"
          className={`category-pill ${statusFilter === 'scheduled' ? 'active' : ''}`}
          onClick={() => setStatusFilter('scheduled')}
        >
          <IconCalendar size={14} />
          <span>Scheduled ({scheduledCount})</span>
        </button>
        <button
          type="button"
          className={`category-pill ${statusFilter === 'worn' ? 'active' : ''}`}
          onClick={() => setStatusFilter('worn')}
        >
          <IconCheck size={14} />
          <span>Confirmed Worn ({wornCount})</span>
        </button>
      </section>

      {/* Events List */}
      {filteredSchedules.length > 0 ? (
        <div className="schedule-events-list">
          {filteredSchedules.map((schedule) => {
            const outfit = outfitMap.get(String(schedule.outfitId));
            const topItem = outfit ? clothingMap.get(String(outfit.topId)) : null;
            const bottomItem = outfit ? clothingMap.get(String(outfit.bottomId)) : null;
            const shoesItem = outfit ? clothingMap.get(String(outfit.shoesId)) : null;
            const isWorn = schedule.status === 'worn';

            return (
              <article
                key={schedule.id}
                className={`schedule-card ${isWorn ? 'is-worn-card' : 'is-scheduled-card'}`}
              >
                {/* Date indicator block */}
                <div className="schedule-date-block">
                  <span className="date-month">
                    {formatMonth(schedule.date)}
                  </span>
                  <span className="date-day">
                    {formatDay(schedule.date)}
                  </span>
                  <span className="date-year">{formatYear(schedule.date)}</span>
                  <span className={`status-pill ${isWorn ? 'status-worn' : 'status-scheduled'}`}>
                    {isWorn ? 'Worn' : 'Scheduled'}
                  </span>
                </div>

                {/* Outfit preview thumbnail trio */}
                <div className="schedule-outfit-preview">
                  <div className="mini-tier" title={`Top: ${topItem?.name || ''}`}>
                    <div className="transparency-checkered-canvas" />
                    {topItem ? <img src={topItem.imageUrl} alt="" /> : <IconShirt size={14} />}
                  </div>
                  <div className="mini-tier" title={`Bottom: ${bottomItem?.name || ''}`}>
                    <div className="transparency-checkered-canvas" />
                    {bottomItem ? <img src={bottomItem.imageUrl} alt="" /> : <IconPants size={14} />}
                  </div>
                  <div className="mini-tier" title={`Shoes: ${shoesItem?.name || ''}`}>
                    <div className="transparency-checkered-canvas" />
                    {shoesItem ? <img src={shoesItem.imageUrl} alt="" /> : <IconShoes size={14} />}
                  </div>
                </div>

                {/* Event Information */}
                <div className="schedule-details">
                  <div className="schedule-name-row">
                    <h3 className="schedule-outfit-title">
                      {outfit?.name || 'Outfit not found'}
                    </h3>
                    {schedule.occasion && (
                      <span className="schedule-occasion-tag">{schedule.occasion}</span>
                    )}
                  </div>

                  <p className="schedule-pieces-summary">
                    {topItem?.name || 'Top'} • {bottomItem?.name || 'Bottom'} • {shoesItem?.name || 'Shoes'}
                  </p>

                  {schedule.notes && <p className="schedule-notes">{schedule.notes}</p>}

                  {isWorn && (
                    <div className="wear-confirmed-notice">
                      <IconCheck size={13} />
                      <span>Wear recorded for Analytics • Top and Bottom entered 7-day laundry</span>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="schedule-actions-column">
                  {!isWorn ? (
                    <button
                      type="button"
                      className="btn-mark-worn"
                      onClick={() => onMarkWorn(schedule.id)}
                      title="Confirm you wore this outfit today. Top and Bottom will enter 7-day laundry."
                    >
                      <IconCheck size={15} />
                      <span>Mark as Worn</span>
                    </button>
                  ) : (
                    <span className="worn-confirmed-badge">
                      <IconCheck size={14} />
                      <span>Worn Recorded</span>
                    </span>
                  )}

                  <div className="schedule-aux-buttons">
                    <button
                      type="button"
                      className="btn-action-icon"
                      onClick={() => handleOpenEdit(schedule)}
                      title="Edit schedule details"
                      aria-label="Edit schedule"
                    >
                      <IconEdit size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn-action-icon danger"
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
            Schedule an outfit to plan your week ahead. Once worn, click "Mark as Worn"
            to track real clothing usage in your analytics.
          </p>
          {outfits.length > 0 ? (
            <button
              type="button"
              className="btn-primary-medium"
              onClick={handleOpenAdd}
            >
              <IconPlus size={16} />
              <span>Schedule an Outfit</span>
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
    return d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  } catch {
    return 'DATE';
  }
}

function formatDay(dateStr) {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.getDate();
  } catch {
    return '01';
  }
}

function formatYear(dateStr) {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.getFullYear();
  } catch {
    return '2026';
  }
}
