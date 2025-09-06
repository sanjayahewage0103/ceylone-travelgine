import React, { useEffect, useState } from 'react';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import guideBookingService from '../services/guideBookingService';
import GuideSidebar from '../components/guide/GuideSidebar';

// Helper to format date as yyyy-mm-dd
const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const LOCAL_STORAGE_KEY = 'guide_calendar_notes';

const GuideCalendarNotes = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState({});
  const [todo, setTodo] = useState('');

  // Load notes from localStorage (last 30 days)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
    // Only keep last 30 days
    const now = new Date();
    const filtered = Object.fromEntries(
      Object.entries(saved).filter(([date]) => {
        const diff = (now - new Date(date)) / (1000 * 60 * 60 * 24);
        return diff <= 30;
      })
    );
    setNotes(filtered);
  }, []);

  // Fetch accepted bookings
  useEffect(() => {
    const token = window.localStorage.getItem('token');
    guideBookingService.getBookings(token, { status: 'Approved' })
      .then((data) => setBookings(data || []))
      .catch(() => setBookings([]));
  }, []);

  // Update todo when date changes
  useEffect(() => {
    const dateKey = formatDate(selectedDate);
    setTodo(notes[dateKey] || '');
  }, [selectedDate, notes]);

  // Save todo to localStorage
  const handleSave = () => {
    const dateKey = formatDate(selectedDate);
    const updated = { ...notes, [dateKey]: todo };
    // Only keep last 30 days
    const now = new Date();
    const filtered = Object.fromEntries(
      Object.entries(updated).filter(([date]) => {
        const diff = (now - new Date(date)) / (1000 * 60 * 60 * 24);
        return diff <= 30;
      })
    );
    setNotes(filtered);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  };

  // Render booking events on calendar with color coding, only highlight if at least one approved/completed
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const dateKey = formatDate(date);
    const today = new Date();
    // Only consider approved bookings for highlight
    const approved = bookings.find(b => formatDate(b.date) === dateKey && b.status === 'Approved');
    if (!approved) return null;
    const tripDate = new Date(approved.date);
    let bg = '#60a5fa'; // light blue for upcoming
    let color = '#fff';
    if (tripDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      bg = '#fde68a'; // light yellow for completed
      color = '#7c5e00';
    }
    return (
      <div style={{ background: bg, color, borderRadius: 4, margin: '2px 0', fontSize: 10, padding: '0 2px', fontWeight: 500, minHeight: 18 }}>
        {approved.tourPackage?.name || 'Tour'}
      </div>
    );
  };

  // Get next 4 upcoming accepted trips (date >= today, sorted ascending)
  const today = new Date();
  const upcoming = bookings
    .filter(b => new Date(b.date) >= today)
    .sort((a, b2) => new Date(a.date) - new Date(b2.date))
    .slice(0, 4);

  return (
    <div
      className="flex min-h-screen text-cyan-900"
      style={{
        background: `linear-gradient(120deg, rgba(0,212,255,0.13) 0%, rgba(9,121,113,0.10) 100%), url('/Ceylon.png') center/cover no-repeat fixed`,
        backgroundBlendMode: 'overlay',
      }}
    >
      <GuideSidebar />
      <div className="flex-1 flex flex-col md:flex-row gap-8 p-6">
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold mb-4">My Bookings Calendar</h2>
          <div className="rounded-3xl shadow-2xl overflow-hidden relative backdrop-blur-xl bg-white/70 border border-white/30 p-4">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileContent={tileContent}
              calendarType="gregory"
            />
          </div>
          {/* Upcoming Trips Section */}
          <div className="mt-8 rounded-2xl shadow-xl bg-white/80 p-4">
            <h3 className="text-lg font-semibold mb-4">Upcoming {upcoming.length} Trip{upcoming.length !== 1 ? 's' : ''}</h3>
            {upcoming.length === 0 ? (
              <div className="text-gray-400">No upcoming trips.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {upcoming.map(b => (
                  <div key={b._id} className="flex flex-col md:flex-row md:items-center justify-between bg-cyan-50 rounded px-4 py-3">
                    <div>
                      <div className="font-bold text-base text-cyan-900">{b.tourPackage?.name || 'Tour'}</div>
                      <div className="text-cyan-700 text-sm">
                        with {b.user?.name || b.user?.email || 'Tourist'}
                        {b.peopleCount ? ` (${b.peopleCount} people)` : ''}
                      </div>
                    </div>
                    <div className="flex flex-col md:items-end mt-2 md:mt-0">
                      <div className="font-semibold text-cyan-900">{formatDate(b.date)}</div>
                      <div className="text-green-600 text-xs font-bold mt-1">Approved</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="w-full md:w-1/3 mt-8 md:mt-0">
          <div className="rounded-2xl shadow-xl bg-white/80 p-4">
            <h2 className="text-xl font-semibold mb-2">Notes / Todo for {formatDate(selectedDate)}</h2>
            <textarea
              className="w-full h-40 p-2 rounded bg-cyan-50 text-cyan-900 border border-cyan-200"
              value={todo}
              onChange={e => setTodo(e.target.value)}
              placeholder="Write your notes or todos for this day..."
            />
            <button
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
              onClick={handleSave}
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideCalendarNotes;
