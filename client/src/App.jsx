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
  const [currentUser, setCurrentUser] = useState(() => getCurrentSession());
  const [activeTab, setActiveTab] = useState('gallery');

  // Application data store
  const [clothingItems, setClothingItems] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [wearRecords, setWearRecords] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Global schedule modal state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [schedulingOutfit, setSchedulingOutfit] = useState(null);

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? '' : current));
    }, 3500);
  };

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

  // Listen for authentication changes and restore active session
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

  // Auth handlers
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

  // Clothing inventory handlers
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
      throw err;
    }
  };

  // Outfit manager handlers
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

  // Calendar and wear logs
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

  // Mark worn: creates verified wear record and moves top & bottom into a 7-day laundry cycle
  const handleMarkWorn = async (scheduleId) => {
    try {
      const result = await markScheduleWorn(scheduleId);

      setSchedules((prev) =>
        prev.map((s) => (String(s.id) === String(scheduleId) ? result.schedule : s))
      );

      setWearRecords((prev) => [result.wearRecord, ...prev]);

      if (result.updatedClothing && result.updatedClothing.length > 0) {
        setClothingItems(result.updatedClothing);
      }

      showToast('Outfit marked as worn! Top and Bottom sent to 7-day laundry.');
    } catch (err) {
      showToast(`Error recording wear: ${err.message}`);
    }
  };

  if (!currentUser) {
    return <Login onLoginSuccess={handleLogin} onSignUpSuccess={handleSignUp} />;
  }

  return (
    <div className="app-container">
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

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

      {toastMessage && (
        <div className="toast-notification" role="status">
          <IconCheck size={16} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}