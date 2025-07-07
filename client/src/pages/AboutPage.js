import React from 'react';
import { motion } from 'framer-motion';
import { FiMusic, FiUsers, FiAward, FiHeart, FiClock, FiGlobe } from 'react-icons/fi';

const AboutPage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="pt-28 bg-gradient-to-br from-primary-50 via-accent-100 to-light min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-accent-400 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              About TuneLink Sri Lanka
            </motion.h1>
            <motion.p 
              className="text-2xl leading-relaxed text-primary-100 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Connecting musicians, studios, and music lovers across the island to create harmonious collaborations.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-extrabold mb-8 text-primary-700">Our Story</h2>
              <div className="prose prose-lg max-w-none">
                <p className="mb-6 text-lg text-dark/70 font-medium">
                  TuneLink was founded in 2023 with a simple mission: to make music production and collaboration accessible to everyone in Sri Lanka.
                </p>
                <p className="mb-6 text-lg text-dark/70 font-medium">
                  We noticed that talented musicians often struggled to find appropriate recording spaces, while studios had difficulty reaching potential clients. At the same time, clients looking for musical talent had limited options to discover artists.
                </p>
                <p className="text-lg text-dark/70 font-medium">
                  TuneLink bridges these gaps by providing a comprehensive platform where studios, artists, and clients can connect, collaborate, and create amazing music together.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600"
                alt="Studio Recording"
                className="rounded-3xl shadow-glass w-full border border-primary-100"
              />
              {/* Decorative elements */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary-100 rounded-full -z-10 blur-sm"></div>
              <div className="absolute -top-8 -left-8 w-40 h-40 bg-accent-100 rounded-full -z-10 blur-sm"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-glass/80 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold mb-6 text-primary-700">Our Mission & Values</h2>
            <p className="text-xl text-dark/70 font-medium">Guided by our passion for music and community, we're committed to these core principles</p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-glass/80 p-8 rounded-3xl shadow-glass border border-primary-100 backdrop-blur-xs"
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary-700 to-accent-400 text-white rounded-2xl flex items-center justify-center mb-6 shadow-glass">
                <FiHeart size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary-700">Passion for Music</h3>
              <p className="text-lg text-dark/70 font-medium">
                We're music enthusiasts committed to supporting Sri Lanka's vibrant music ecosystem and helping artists thrive.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-glass/80 p-8 rounded-3xl shadow-glass border border-primary-100 backdrop-blur-xs"
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary-700 to-accent-400 text-white rounded-2xl flex items-center justify-center mb-6 shadow-glass">
                <FiUsers size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary-700">Community Building</h3>
              <p className="text-lg text-dark/70 font-medium">
                Creating meaningful connections between artists, studios, and clients to foster collaboration and creativity.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-glass/80 p-8 rounded-3xl shadow-glass border border-primary-100 backdrop-blur-xs"
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary-700 to-accent-400 text-white rounded-2xl flex items-center justify-center mb-6 shadow-glass">
                <FiAward size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary-700">Quality First</h3>
              <p className="text-lg text-dark/70 font-medium">
                We maintain high standards for our platform, ensuring reliable connections and exceptional music experiences.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-glass/80 shadow-glass rounded-3xl p-10 md:p-16 border border-primary-100 backdrop-blur-xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="text-primary-700 mb-4">
                  <FiUsers size={48} className="mx-auto" />
                </div>
                <div className="text-5xl font-extrabold mb-2 text-primary-700">500+</div>
                <div className="text-lg text-dark/70 font-semibold">Artists</div>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-primary-700 mb-4">
                  <FiMusic size={48} className="mx-auto" />
                </div>
                <div className="text-5xl font-extrabold mb-2 text-primary-700">100+</div>
                <div className="text-lg text-dark/70 font-semibold">Studios</div>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-primary-700 mb-4">
                  <FiClock size={48} className="mx-auto" />
                </div>
                <div className="text-5xl font-extrabold mb-2 text-primary-700">5000+</div>
                <div className="text-lg text-dark/70 font-semibold">Bookings</div>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="text-primary-700 mb-4">
                  <FiGlobe size={48} className="mx-auto" />
                </div>
                <div className="text-5xl font-extrabold mb-2 text-primary-700">25+</div>
                <div className="text-lg text-dark/70 font-semibold">Cities</div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-600">The passionate people behind TuneLink working to connect Sri Lanka's music community</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/*
              { name: 'Amal Fernando', role: 'Founder & CEO', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
              { name: 'Priya Mendis', role: 'Head of Operations', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
              { name: 'Dinesh Kumar', role: 'Lead Developer', image: 'https://randomuser.me/api/portraits/men/68.jpg' },
              { name: 'Tharushi Silva', role: 'Marketing Director', image: 'https://randomuser.me/api/portraits/women/65.jpg' },
            */}
            {/*
              .map((member, index) => (
                <motion.div 
                  key={index} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-primary-600">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            */}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-primary rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
              Have questions about TuneLink? We'd love to hear from you and help answer any queries.
            </p>
            <button className="btn bg-white text-primary-700 hover:bg-blue-50 px-8 py-3 rounded-lg shadow-lg">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
