import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import { FiClock, FiCalendar, FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';
import "react-datepicker/dist/react-datepicker.css";

const BookingCalendar = ({ 
  onComplete, 
  baseRate = 0,
  serviceFeePercentage = 5,
  availability = [],
  timeSlotDuration = 60 // in minutes
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [duration, setDuration] = useState(1); // hours
  const [currentStep, setCurrentStep] = useState(0);
  
  // Calculate total cost
  const totalCost = baseRate * duration;
  const serviceFee = Math.round(totalCost * (serviceFeePercentage / 100));
  const grandTotal = totalCost + serviceFee;
  
  // Generate available time slots for selected date
  const getAvailableTimeSlots = (date) => {
    // Convert date to day string (e.g., "Monday")
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = dayNames[date.getDay()];
    
    // Find availability for the selected day
    const dayAvailability = availability.find(a => a.day === dayName) || { slots: [] };
    
    // Format available slots
    return dayAvailability.slots.filter(slot => slot.isAvailable).map(slot => {
      const [startHour, startMinute] = slot.startTime.split(':').map(Number);
      const [endHour, endMinute] = slot.endTime.split(':').map(Number);
      
      // Generate slots with the specified duration
      const slots = [];
      let currentHour = startHour;
      let currentMinute = startMinute;
      
      while (
        currentHour < endHour || 
        (currentHour === endHour && currentMinute < endMinute)
      ) {
        const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        slots.push(timeString);
        
        // Advance by the time slot duration
        currentMinute += timeSlotDuration;
        if (currentMinute >= 60) {
          currentHour += Math.floor(currentMinute / 60);
          currentMinute = currentMinute % 60;
        }
      }
      
      return slots;
    }).flat();
  };
  
  const timeSlots = getAvailableTimeSlots(selectedDate);
  
  // Handle booking confirmation
  const handleConfirmBooking = () => {
    if (onComplete) {
      onComplete({
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        duration,
        totalCost: grandTotal
      });
    }
  };
  
  // Steps configuration
  const steps = [
    { title: "Select Date", icon: <FiCalendar /> },
    { title: "Choose Time", icon: <FiClock /> },
    { title: "Confirm Details", icon: <FiCheck /> }
  ];
  
  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    },
    exit: { opacity: 0, y: 20 }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      {/* Steps indicator */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center ${
              currentStep >= index ? 'text-primary-600' : 'text-gray-400'
            }`}
          >
            <div className={`flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
              currentStep >= index 
                ? 'bg-primary-100 text-primary-700' 
                : 'bg-gray-100'
            }`}>
              {step.icon}
            </div>
            <span className="text-xs font-medium hidden md:block">{step.title}</span>
          </div>
        ))}
        
        {/* Progress bar */}
        <div className="absolute top-12 left-0 right-0 h-1 flex justify-center">
          <div className="relative w-2/3 bg-gray-200 h-1 rounded-full">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-primary-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
      
      {/* Step content */}
      <div className="mt-8">
        {currentStep === 0 && (
          <motion.div
            key="step1"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            <motion.h3 
              className="text-xl font-medium mb-4 text-gray-800"
              variants={itemVariants}
            >
              Select a Date
            </motion.h3>
            <motion.div variants={itemVariants}>
              <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                minDate={new Date()}
                inline
                calendarClassName="w-full"
              />
            </motion.div>
            <motion.div 
              className="mt-6 flex justify-end"
              variants={itemVariants}
            >
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="btn btn-primary"
                disabled={!selectedDate}
              >
                Next Step
              </button>
            </motion.div>
          </motion.div>
        )}
        
        {currentStep === 1 && (
          <motion.div
            key="step2"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            <motion.div 
              className="flex items-center justify-between mb-4"
              variants={itemVariants}
            >
              <h3 className="text-xl font-medium text-gray-800">
                Choose a Time Slot
              </h3>
              <button 
                onClick={() => setCurrentStep(0)}
                className="text-primary-600 hover:text-primary-800 flex items-center"
              >
                <FiChevronLeft className="mr-1" /> Back
              </button>
            </motion.div>
            
            <motion.div 
              className="mb-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-700" 
              variants={itemVariants}
            >
              <FiCalendar className="inline-block mr-2" />
              Selected date: {selectedDate.toDateString()}
            </motion.div>
            
            <motion.div variants={itemVariants}>
              {timeSlots.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6">
                  {timeSlots.map((time, index) => (
                    <motion.button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTimeSlot(time)}
                      className={`py-3 rounded-lg transition ${
                        selectedTimeSlot === time
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {time}
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No available time slots on this date.
                  <br />
                  Please select another date.
                </div>
              )}
            </motion.div>
            
            {selectedTimeSlot && (
              <motion.div
                className="mt-4" 
                variants={itemVariants}
              >
                <label className="form-label">Session Duration</label>
                <div className="flex items-center mt-1">
                  <button 
                    className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center" 
                    onClick={() => setDuration(Math.max(1, duration - 1))}
                  >
                    -
                  </button>
                  <span className="mx-6 font-medium">{duration} {duration === 1 ? 'hour' : 'hours'}</span>
                  <button 
                    className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"
                    onClick={() => setDuration(Math.min(8, duration + 1))}
                  >
                    +
                  </button>
                </div>
              </motion.div>
            )}
            
            <motion.div 
              className="mt-6 flex justify-end space-x-3"
              variants={itemVariants}
            >
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="btn btn-primary"
                disabled={!selectedTimeSlot}
              >
                Next Step
              </button>
            </motion.div>
          </motion.div>
        )}
        
        {currentStep === 2 && (
          <motion.div
            key="step3"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            <motion.div 
              className="flex items-center justify-between mb-4"
              variants={itemVariants}
            >
              <h3 className="text-xl font-medium text-gray-800">
                Booking Summary
              </h3>
              <button 
                onClick={() => setCurrentStep(1)}
                className="text-primary-600 hover:text-primary-800 flex items-center"
              >
                <FiChevronLeft className="mr-1" /> Back
              </button>
            </motion.div>
            
            <motion.div 
              className="space-y-4 mb-6"
              variants={itemVariants}
            >
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex items-center">
                  <FiCalendar className="text-primary-600 mr-3" />
                  <div>
                    <span className="block font-medium">Date</span>
                    <span className="text-gray-600">{selectedDate.toDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiClock className="text-primary-600 mr-3" />
                  <div>
                    <span className="block font-medium">Time</span>
                    <span className="text-gray-600">{selectedTimeSlot} ({duration} {duration === 1 ? 'hour' : 'hours'})</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Rs. {baseRate.toLocaleString()} x {duration} hours</span>
                  <span>Rs. {totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service fee ({serviceFeePercentage}%)</span>
                  <span>Rs. {serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="mt-6"
            >
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="w-full btn btn-primary py-3"
              >
                Confirm Booking
              </button>
              <p className="text-center text-gray-500 text-sm mt-3">
                You won't be charged until the booking is confirmed
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookingCalendar;
