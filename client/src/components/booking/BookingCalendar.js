import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import { 
  FiClock, 
  FiCalendar, 
  FiChevronLeft, 
  FiChevronRight, 
  FiCheck, 
  FiCreditCard,
  FiUser,
  FiMapPin,
  FiDollarSign,
  FiShield,
  FiStar
} from 'react-icons/fi';
import "react-datepicker/dist/react-datepicker.css";

const BookingCalendar = ({ 
  onComplete, 
  baseRate = 0,
  serviceFeePercentage = 5,
  availability = [],
  timeSlotDuration = 60, // in minutes
  providerInfo = {},
  userInfo = {}
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [duration, setDuration] = useState(1); // hours
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Calculate total cost
  const totalCost = baseRate * duration;
  const serviceFee = Math.round(totalCost * (serviceFeePercentage / 100));
  const grandTotal = totalCost + serviceFee;
  
  // Generate available time slots for selected date
  const getAvailableTimeSlots = (date) => {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = dayNames[date.getDay()];
    
    const dayAvailability = availability.find(a => a.day === dayName) || { slots: [] };
    
    return dayAvailability.slots.filter(slot => slot.isAvailable).map(slot => {
      const [startHour, startMinute] = slot.startTime.split(':').map(Number);
      const [endHour, endMinute] = slot.endTime.split(':').map(Number);
      
      const slots = [];
      let currentHour = startHour;
      let currentMinute = startMinute;
      
      while (
        currentHour < endHour || 
        (currentHour === endHour && currentMinute < endMinute)
      ) {
        const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        slots.push(timeString);
        
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
  const handleConfirmBooking = async () => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onComplete) {
        onComplete({
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          duration,
          totalCost: grandTotal,
          paymentMethod
        });
      }
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Steps configuration
  const steps = [
    { title: "Select Date", icon: <FiCalendar />, description: "Choose your preferred date" },
    { title: "Choose Time", icon: <FiClock />, description: "Pick an available time slot" },
    { title: "Review & Pay", icon: <FiCreditCard />, description: "Confirm details and payment" }
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
    <div className="bg-glass/80 rounded-3xl shadow-glass p-8 border border-primary-100 backdrop-blur-xs">
      {/* Steps indicator */}
      <div className="relative mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center relative z-10 ${
                currentStep >= index ? 'text-primary-600' : 'text-dark/40'
              }`}
            >
              <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-3 transition-all duration-300 ${
                currentStep >= index 
                  ? 'bg-primary-100 text-primary-700 shadow-glass' 
                  : 'bg-white/50 text-dark/40'
              }`}>
                {step.icon}
              </div>
              <div className="text-center">
                <span className="text-sm font-semibold block">{step.title}</span>
                <span className="text-xs text-dark/60 hidden md:block">{step.description}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Progress bar */}
        <div className="absolute top-6 left-0 right-0 h-1 flex justify-center">
          <div className="relative w-2/3 bg-white/50 h-1 rounded-full">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-accent-400 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
      
      {/* Step content */}
      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div
            key="step1"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="space-y-6"
          >
            <motion.h3 
              className="text-2xl font-bold text-primary-700 mb-2"
              variants={itemVariants}
            >
              Select a Date
            </motion.h3>
            <motion.p 
              className="text-dark/60 mb-6"
              variants={itemVariants}
            >
              Choose your preferred date for the booking
            </motion.p>
            <motion.div 
              className="bg-white/80 rounded-2xl p-4 border border-primary-50"
              variants={itemVariants}
            >
              <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                minDate={new Date()}
                inline
                calendarClassName="w-full border-0 shadow-none"
                dayClassName={date => {
                  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                  const dayName = dayNames[date.getDay()];
                  const dayAvailability = availability.find(a => a.day === dayName);
                  return dayAvailability && dayAvailability.slots.length > 0 
                    ? 'bg-primary-50 text-primary-700 hover:bg-primary-100' 
                    : 'text-gray-400';
                }}
              />
            </motion.div>
            <motion.div 
              className="flex justify-end"
              variants={itemVariants}
            >
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="btn-primary"
                disabled={!selectedDate}
              >
                Next Step
                <FiChevronRight className="ml-2" />
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
            className="space-y-6"
          >
            <motion.div 
              className="flex items-center justify-between"
              variants={itemVariants}
            >
              <div>
                <h3 className="text-2xl font-bold text-primary-700 mb-2">
                  Choose a Time Slot
                </h3>
                <p className="text-dark/60">
                  Available times for {selectedDate.toLocaleDateString()}
                </p>
              </div>
              <button 
                onClick={() => setCurrentStep(0)}
                className="text-primary-600 hover:text-primary-800 flex items-center p-2 rounded-xl hover:bg-primary-50 transition-colors"
              >
                <FiChevronLeft className="mr-1" /> Back
              </button>
            </motion.div>
            
            <motion.div 
              className="bg-white/80 rounded-2xl p-4 border border-primary-50"
              variants={itemVariants}
            >
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedTimeSlot === slot
                        ? 'bg-primary-600 text-white shadow-glass'
                        : 'bg-white/50 text-dark hover:bg-primary-50 hover:text-primary-700'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-4 border border-primary-100"
              variants={itemVariants}
            >
              <h4 className="font-semibold text-primary-700 mb-3">Duration</h4>
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map(hours => (
                  <button
                    key={hours}
                    onClick={() => setDuration(hours)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      duration === hours
                        ? 'bg-primary-600 text-white'
                        : 'bg-white/50 text-dark hover:bg-primary-50'
                    }`}
                  >
                    {hours} hour{hours > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="flex justify-between"
              variants={itemVariants}
            >
              <button 
                onClick={() => setCurrentStep(0)}
                className="btn-secondary"
              >
                <FiChevronLeft className="mr-2" />
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="btn-primary"
                disabled={!selectedTimeSlot}
              >
                Next Step
                <FiChevronRight className="ml-2" />
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
            className="space-y-6"
          >
            <motion.div 
              className="flex items-center justify-between"
              variants={itemVariants}
            >
              <div>
                <h3 className="text-2xl font-bold text-primary-700 mb-2">
                  Review & Payment
                </h3>
                <p className="text-dark/60">
                  Confirm your booking details and complete payment
                </p>
              </div>
              <button 
                onClick={() => setCurrentStep(1)}
                className="text-primary-600 hover:text-primary-800 flex items-center p-2 rounded-xl hover:bg-primary-50 transition-colors"
              >
                <FiChevronLeft className="mr-1" /> Back
              </button>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              variants={itemVariants}
            >
              {/* Booking Summary */}
              <div className="bg-white/80 rounded-2xl p-6 border border-primary-50">
                <h4 className="font-semibold text-primary-700 mb-4 flex items-center">
                  <FiCalendar className="mr-2" />
                  Booking Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-dark/60">Date:</span>
                    <span className="font-medium">{selectedDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark/60">Time:</span>
                    <span className="font-medium">{selectedTimeSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark/60">Duration:</span>
                    <span className="font-medium">{duration} hour{duration > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark/60">Rate:</span>
                    <span className="font-medium">Rs. {baseRate.toLocaleString()}/hour</span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-white/80 rounded-2xl p-6 border border-primary-50">
                <h4 className="font-semibold text-primary-700 mb-4 flex items-center">
                  <FiCreditCard className="mr-2" />
                  Payment Details
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-dark/60">Base Cost:</span>
                    <span className="font-medium">Rs. {totalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark/60">Service Fee ({serviceFeePercentage}%):</span>
                    <span className="font-medium">Rs. {serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-primary-100 pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-primary-700">Total:</span>
                      <span className="font-bold text-primary-700">Rs. {grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div 
              className="bg-white/80 rounded-2xl p-6 border border-primary-50"
              variants={itemVariants}
            >
              <h4 className="font-semibold text-primary-700 mb-4">Payment Method</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'card', label: 'Credit/Debit Card', icon: <FiCreditCard /> },
                  { id: 'upi', label: 'UPI Payment', icon: <FiCreditCard /> },
                  { id: 'netbanking', label: 'Net Banking', icon: <FiCreditCard /> }
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-3 ${
                      paymentMethod === method.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 bg-white hover:border-primary-300'
                    }`}
                  >
                    {method.icon}
                    <span className="font-medium">{method.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Security Notice */}
            <motion.div 
              className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 border border-green-200"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-3">
                <FiShield className="text-green-600 text-xl" />
                <div>
                  <p className="font-medium text-green-800">Secure Payment</p>
                  <p className="text-sm text-green-600">Your payment information is encrypted and secure</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="flex justify-between"
              variants={itemVariants}
            >
              <button 
                onClick={() => setCurrentStep(1)}
                className="btn-secondary"
              >
                <FiChevronLeft className="mr-2" />
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="btn-primary"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiCheck className="mr-2" />
                    Confirm Booking
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingCalendar;
