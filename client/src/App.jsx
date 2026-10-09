/**
 * paradu'l — Main Application Component (App.jsx)
 *
 * Central state orchestration layer connecting:
 * - Mock Authentication session
 * - 4 Main Navigation Views: Gallery, Outfit Manager, Calendar, Analytics
 * - Unified Application Data Store (Clothing, Outfits, Schedules, Wear History)
 * - Automatic 7-Day Laundry transitions on outfit wear
 * - Synchronized updates across all dependent views
 */

import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header.jsx';
import Login from './components/Login.jsx';
import GalleryView from './components/Gallery/GalleryView.jsx';
import OutfitManagerView from './components/OutfitManager/OutfitManagerView.jsx';
import CalendarView from './components/Calendar/CalendarView.jsx';
import AnalyticsView from './components/Analytics/AnalyticsView.jsx';
import ScheduleModal from './components/Calendar/ScheduleModal.jsx';

import {
  listClothing,
  createClothing,
  updateClothing,
  deleteClothing,
  listOutfits,
  createOutfit,
  updateOutfit,
  deleteOutfit,
  listSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  markScheduleWorn,
  listWearRecords,
} from './api/index.js';

import {
  getCurrentSession,
  getActiveUser,
  loginWithEmail,
  signUpWithEmail,
  logout,
  onAuthStateChange,
} from './services/authService.js';
import { toggleItemLaundryStatus } from './services/laundryService.js';
import { IconCheck } from './components/common/Icons.jsx';

export default function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState(() => getCurrentSession());

  // Active top navigation tab (Requirement #7: Gallery, Outfit Manager, Calendar, Analytics)
  const [activeTab, setActiveTab] = useState('gallery');

  // Application Data Store
  const [clothingItems, setClothingItems] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [wearRecords, setWearRecords] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Global schedule modal (can be opened from Outfit Manager or Calendar)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [schedulingOutfit, setSchedulingOutfit] = useState(null);

  // User-facing feedback toast
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? '' : current));
    }, 3500);
  };

  /**
   * Refreshes all application data from the unified API layer
   */
  const loadAppData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [itemsData, outfitsData, schedulesData, wearData] = await Promise.all([
        listClothing(),
        listOutfits(),
        listSchedules(),
        listWearRecords(),
      ]);

      setClothingItems(itemsData);
      setOutfits(outfitsData);
      setSchedules(schedulesData);
      setWearRecords(wearData);
    } catch (err) {
      console.error('Failed to load wardrobe data:', err);
      showToast('Error loading wardrobe data.');
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Restore active Supabase session on mount and subscribe to auth changes
  useEffect(() => {
    let isMounted = true;
    getActiveUser().then((user) => {
      if (isMounted && user) {
        setCurrentUser(user);
      }
    });

    const unsubscribe = onAuthStateChange((user) => {
      if (isMounted) {
        setCurrentUser(user);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadAppData();
    }
  }, [currentUser, loadAppData]);

  // ==========================================================================
  // AUTHENTICATION HANDLERS (Requirement #4)
  // ==========================================================================

  const handleLogin = async (email, password, rememberMe) => {
    const user = await loginWithEmail(email, password, rememberMe);
    setCurrentUser(user);
    setActiveTab('gallery');
    showToast(`Welcome back, ${user.name}!`);
  };

  const handleSignUp = async (email, password, name) => {
    const user = await signUpWithEmail(email, password, name);
    setCurrentUser(user);
    setActiveTab('gallery');
    showToast(`Account created! Welcome to paradu'l, ${user.name}!`);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    showToast('Signed out of paradu\'l.');
  };

  // ==========================================================================
  // CLOTHING INVENTORY HANDLERS
  // ==========================================================================

  const handleAddClothing = async (itemInput) => {
    try {
      const created = await createClothing(itemInput);
      setClothingItems((prev) => [created, ...prev]);
      showToast(`Added "${created.name}" to your wardrobe!`);
    } catch (err) {
      showToast(`Error adding item: ${err.message}`);
    }
  };

  const handleToggleLaundry = async (item) => {
    try {
      const toggledUpdates = toggleItemLaundryStatus(item);
      const updated = await updateClothing(item.id, toggledUpdates);
      setClothingItems((prev) =>
        prev.map((c) => (String(c.id) === String(updated.id) ? updated : c))
      );

      const statusDesc =
        updated.laundryStatus === 'in_laundry'
          ? 'sent to laundry (7 days)'
          : 'marked clean and available';
      showToast(`"${updated.name}" is now ${statusDesc}.`);
    } catch (err) {
      showToast(`Failed to update laundry status: ${err.message}`);
    }
  };

  const handleDeleteClothing = async (id) => {
    if (!window.confirm('Are you sure you want to remove this piece from your wardrobe?')) {
      return;
    }
    try {
      await deleteClothing(id);
      setClothingItems((prev) => prev.filter((c) => String(c.id) !== String(id)));
      showToast('Piece removed from wardrobe.');
    } catch (err) {
      showToast(`Error deleting piece: ${err.message}`);
    }
  };

  const handleEditClothing = async (id, updates) => {
    try {
      const updated = await updateClothing(id, updates);
      setClothingItems((prev) =>
        prev.map((c) => (String(c.id) === String(updated.id) ? updated : c))
      );
      showToast(`"${updated.name}" updated successfully!`);
    } catch (err) {
      showToast(`Error updating item: ${err.message}`);
      throw err; // re-throw so modal can show error
    }
  };


  // ==========================================================================
  // OUTFIT MANAGER HANDLERS
  // ==========================================================================

  const handleSaveOutfit = async (outfitInput) => {
    try {
      if (outfitInput.id) {
        const updated = await updateOutfit(outfitInput.id, outfitInput);
        setOutfits((prev) =>
          prev.map((o) => (String(o.id) === String(updated.id) ? updated : o))
        );
        showToast(`Outfit "${updated.name}" updated!`);
      } else {
        const created = await createOutfit(outfitInput);
        setOutfits((prev) => [created, ...prev]);
        showToast(`Outfit "${created.name}" saved!`);
      }
    } catch (err) {
      showToast(`Error saving outfit: ${err.message}`);
    }
  };

  const handleDeleteOutfit = async (id) => {
    if (!window.confirm('Delete this outfit? (Individual clothing items will NOT be deleted).')) {
      return;
    }
    try {
      await deleteOutfit(id);
      setOutfits((prev) => prev.filter((o) => String(o.id) !== String(id)));
      showToast('Outfit deleted.');
    } catch (err) {
      showToast(`Error deleting outfit: ${err.message}`);
    }
  };

  const handleOpenScheduleForOutfit = (outfit) => {
    setSchedulingOutfit(outfit);
    setIsScheduleModalOpen(true);
  };

  // ==========================================================================
  // CALENDAR & LAUNDRY WEAR HANDLERS (Requirements #30-#35)
  // ==========================================================================

  const handleSaveSchedule = async (scheduleInput) => {
    try {
      if (scheduleInput.id) {
        const updated = await updateSchedule(scheduleInput.id, scheduleInput);
        setSchedules((prev) =>
          prev.map((s) => (String(s.id) === String(updated.id) ? updated : s))
        );
        showToast('Calendar schedule updated.');
      } else {
        const created = await createSchedule(scheduleInput);
        setSchedules((prev) => [created, ...prev]);
        showToast('Outfit scheduled on calendar!');
      }
    } catch (err) {
      showToast(`Error scheduling outfit: ${err.message}`);
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm('Remove this event from calendar?')) return;
    try {
      await deleteSchedule(id);
      setSchedules((prev) => prev.filter((s) => String(s.id) !== String(id)));
      showToast('Calendar event removed.');
    } catch (err) {
      showToast(`Error removing schedule: ${err.message}`);
    }
  };

  /**
   * CRITICAL BUSINESS LOGIC:
   * When user clicks [ Mark as Worn ] on a scheduled outfit:
   * 1. Status flips to 'worn'
   * 2. Wear record created (persisted in wearRecords -> reflects immediately in Analytics)
   * 3. Top and Bottom enter automatic 7-day laundry period
   * 4. Shoes remain unaffected
   */
  const handleMarkWorn = async (scheduleId) => {
    try {
      const result = await markScheduleWorn(scheduleId);

      // 1. Update schedules state
      setSchedules((prev) =>
        prev.map((s) => (String(s.id) === String(scheduleId) ? result.schedule : s))
      );

      // 2. Append new wear record for analytics
      setWearRecords((prev) => [result.wearRecord, ...prev]);

      // 3. Update clothing catalog with items sent to 7-day laundry
      if (result.updatedClothing && result.updatedClothing.length > 0) {
        setClothingItems(result.updatedClothing);
      }

      showToast('Outfit marked as worn! Top and Bottom sent to 7-day laundry.');
    } catch (err) {
      showToast(`Error recording wear: ${err.message}`);
    }
  };

  // If user is not authenticated, show the login view
  if (!currentUser) {
    return <Login onLoginSuccess={handleLogin} onSignUpSuccess={handleSignUp} />;
  }

  return (
    <div className="app-container">
      {/* Top Brand Header & 4 Primary Navigation Tabs */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="main-content-layout">
        {isLoadingData ? (
          <div className="upload-processing-box" style={{ padding: '4rem 1rem' }}>
            <div className="processing-spinner" />
            <h3 className="processing-title">Loading your digital wardrobe...</h3>
          </div>
        ) : (
          <>
            {activeTab === 'gallery' && (
              <GalleryView
                clothingItems={clothingItems}
                outfits={outfits}
                wearRecords={wearRecords}
                onAddItem={handleAddClothing}
                onToggleLaundry={handleToggleLaundry}
                onDeleteItem={handleDeleteClothing}
                onEditItem={handleEditClothing}
                onNavigateToTab={setActiveTab}
              />
            )}

            {activeTab === 'outfits' && (
              <OutfitManagerView
                outfits={outfits}
                clothingItems={clothingItems}
                wearRecords={wearRecords}
                onSaveOutfit={handleSaveOutfit}
                onDeleteOutfit={handleDeleteOutfit}
                onOpenScheduleModal={handleOpenScheduleForOutfit}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                schedules={schedules}
                outfits={outfits}
                clothingItems={clothingItems}
                onSaveSchedule={handleSaveSchedule}
                onDeleteSchedule={handleDeleteSchedule}
                onMarkWorn={handleMarkWorn}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView
                clothingItems={clothingItems}
                outfits={outfits}
                wearRecords={wearRecords}
                onNavigateToTab={setActiveTab}
              />
            )}
          </>
        )}
      </main>

      {/* Global Schedule Modal (invoked from Outfit Manager) */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setSchedulingOutfit(null);
        }}
        outfits={outfits}
        clothingItems={clothingItems}
        initialOutfit={schedulingOutfit}
        onSaveSchedule={handleSaveSchedule}
      />

      {/* Feedback Toast */}
      {toastMessage && (
        <div className="toast-notification" role="status">
          <IconCheck size={16} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}