import React, { useEffect, useState } from 'react';
import { studiosAPI } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiCheckCircle } from 'react-icons/fi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultSlots = [
  { startTime: '10:00', endTime: '13:00' },
  { startTime: '14:00', endTime: '18:00' },
  { startTime: '19:00', endTime: '22:00' }
];

const StudioAvailability = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchAvailability() {
      setLoading(true);
      try {
        const res = await studiosAPI.getById('me');
        setAvailability(res.data.data.availability || daysOfWeek.map(day => ({ day, slots: defaultSlots.map(slot => ({ ...slot, isAvailable: false })) })));
      } catch (err) {
        setError('Failed to load availability');
      } finally {
        setLoading(false);
      }
    }
    fetchAvailability();
  }, []);

  const handleSlotChange = (dayIdx, slotIdx) => {
    setAvailability(prev => prev.map((day, dIdx) =>
      dIdx === dayIdx
        ? { ...day, slots: day.slots.map((slot, sIdx) => sIdx === slotIdx ? { ...slot, isAvailable: !slot.isAvailable } : slot) }
        : day
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await studiosAPI.updateAvailability('me', availability);
      setSuccess(true);
      setError('');
    } catch (err) {
      setError('Failed to update availability');
      setSuccess(false);
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[300px]">
      <LoadingSpinner text="Loading availability..." />
    </div>
  );

  return (
    <div className="pt-28 pb-20 bg-gradient-to-br from-primary-50 via-accent-100 to-light min-h-screen overflow-hidden">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          className="bg-glass/80 rounded-3xl shadow-glass p-10 md:p-14 border border-primary-100 backdrop-blur-xs"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center mb-8 gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-600 to-accent-400 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              <FiClock />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-primary-700 mb-1">Studio Availability</h1>
              <p className="text-dark/60 text-lg">Set your available time slots</p>
            </div>
          </div>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          <div className="space-y-6">
            {availability.map((day, dayIdx) => (
              <motion.div key={day.day} className="mb-2" variants={itemVariants}>
                <div className="font-semibold mb-1 text-primary-700">{day.day}</div>
                <div className="flex gap-4 flex-wrap">
                  {day.slots.map((slot, slotIdx) => (
                    <label
                      key={slotIdx}
                      className={`px-4 py-2 rounded-xl border cursor-pointer shadow-glass transition-all duration-200 text-sm font-medium ${slot.isAvailable ? 'bg-green-200 border-green-500 text-green-900 scale-105' : 'bg-white/70 border-primary-100 text-dark hover:bg-primary-50 hover:text-primary-700'}`}
                    >
                      <input
                        type="checkbox"
                        checked={slot.isAvailable}
                        onChange={() => handleSlotChange(dayIdx, slotIdx)}
                        className="mr-2 accent-primary-600"
                      />
                      {slot.startTime} - {slot.endTime}
                    </label>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div variants={itemVariants} className="flex items-center gap-4 mt-8">
            <button
              onClick={handleSave}
              className="btn btn-primary flex items-center gap-2 px-6 py-3 rounded-xl text-lg font-semibold shadow-glass hover:scale-105 transition-all"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Availability'}
            </button>
            <AnimatePresence>
              {success && (
                <motion.div
                  className="flex items-center text-green-600 font-semibold gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4 }}
                >
                  <FiCheckCircle /> Availability updated!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudioAvailability;
