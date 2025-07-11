import React, { useEffect, useState } from 'react';
import { studiosAPI } from '../../services/api';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiEdit, FiStar, FiCheckCircle } from 'react-icons/fi';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const StudioProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ description: '', hourlyRate: '', location: '', availability: '' });
  const [saving, setSaving] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await studiosAPI.getById('me');
        setProfile(res.data.data);
        setForm({
          description: res.data.data.longDescription || '',
          hourlyRate: res.data.data.hourlyRate || '',
          location: res.data.data.location?.city || '',
          availability: JSON.stringify(res.data.data.availability || [])
        });
        setReviews(res.data.data.ratings || []);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await studiosAPI.update(profile._id, {
        longDescription: form.description,
        hourlyRate: Number(form.hourlyRate),
        location: { city: form.location },
        availability: JSON.parse(form.availability)
      });
      setSuccess(true);
      setError('');
    } catch (err) {
      setError('Failed to update profile');
      setSuccess(false);
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[300px]">
      <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>
  );
  if (error && !profile) return <div className="text-red-600 text-center py-10">{error}</div>;

  return (
    <div className="pt-28 pb-20 bg-gradient-to-br from-primary-50 via-accent-100 to-light min-h-screen overflow-hidden">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          className="bg-glass/80 rounded-3xl shadow-glass p-10 md:p-14 border border-primary-100 backdrop-blur-xs mb-12"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center mb-8 gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-accent-400 flex items-center justify-center text-white text-3xl font-bold shadow-md">
              <FiHome />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-primary-700 mb-1">Studio Profile</h1>
              <p className="text-dark/60 text-lg">Update your studio information</p>
            </div>
          </div>
          <form onSubmit={handleSave} className="space-y-7">
            <motion.div variants={itemVariants}>
              <label className="block font-semibold mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-3 rounded-2xl border border-primary-100 bg-white/70 focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all" rows={3} />
            </motion.div>
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-1">Hourly Rate (LKR)</label>
                <input name="hourlyRate" type="number" value={form.hourlyRate} onChange={handleChange} className="w-full p-3 rounded-2xl border border-primary-100 bg-white/70 focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Location (City)</label>
                <input name="location" value={form.location} onChange={handleChange} className="w-full p-3 rounded-2xl border border-primary-100 bg-white/70 focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all" />
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <label className="block font-semibold mb-1">Availability</label>
              <Link to="/dashboard/studio/availability" className="inline-block px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all shadow-glass">Manage Availability</Link>
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <button type="submit" className="btn btn-primary flex items-center gap-2 px-6 py-3 rounded-xl text-lg font-semibold shadow-glass hover:scale-105 transition-all" disabled={saving}>
                <FiEdit /> {saving ? 'Saving...' : 'Save Changes'}
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
                    <FiCheckCircle /> Profile updated!
                  </motion.div>
                )}
              </AnimatePresence>
              {error && <div className="text-red-600 ml-4">{error}</div>}
            </motion.div>
          </form>
        </motion.div>
        {/* Animated Reviews Section */}
        <motion.div
          className="bg-glass/80 rounded-3xl shadow-glass p-8 border border-primary-100 backdrop-blur-xs"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold mb-6 text-primary-700 flex items-center gap-2">
            <FiStar className="text-amber-400" /> Reviews
          </h2>
          <AnimatePresence>
            {reviews.length === 0 ? (
              <motion.div key="noreviews" className="text-dark/60 text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>No reviews yet.</motion.div>
            ) : (
              <motion.ul
                className="divide-y divide-primary-50"
                variants={listVariants}
                initial="hidden"
                animate="visible"
              >
                {reviews.map((r, idx) => (
                  <motion.li key={idx} className="py-4" variants={itemVariants}>
                    <div className="flex items-center mb-1 gap-2">
                      <span className="font-semibold text-primary-700">{r.user?.name || 'Client'}</span>
                      <span className="text-amber-500 text-lg">{'★'.repeat(r.rating)}</span>
                    </div>
                    <div className="text-dark/80 mb-1">{r.review}</div>
                    <div className="text-xs text-dark/40">{new Date(r.date).toLocaleDateString()}</div>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default StudioProfile;
