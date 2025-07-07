# TuneLink - Music Booking Platform

A modern, full-stack music booking platform that connects artists, studios, and clients for seamless music production and recording sessions.

## 🎵 Features

### For Clients
- **Browse Artists & Studios**: Discover talented musicians and professional recording studios
- **Advanced Search & Filtering**: Find providers by location, genre, instruments, and availability
- **Real-time Booking**: Book sessions with instant confirmation and payment processing
- **Review System**: Rate and review your experiences
- **Booking Management**: Track your upcoming and past bookings
- **Profile Management**: Update personal information and preferences

### For Artists
- **Professional Profiles**: Showcase your skills, instruments, and portfolio
- **Availability Management**: Set your available time slots and rates
- **Media Upload**: Share audio samples, videos, and photos
- **Booking Dashboard**: Manage incoming booking requests
- **Earnings Tracking**: Monitor your income and session history
- **Verification System**: Get verified to build trust with clients

### For Studios
- **Studio Showcase**: Display your facilities, equipment, and services
- **Image Gallery**: Upload high-quality photos of your studio
- **Service Management**: Define your services and pricing
- **Booking Calendar**: Manage studio reservations efficiently
- **Revenue Analytics**: Track your studio's performance
- **Equipment Listings**: Showcase your professional gear

### For Administrators
- **User Management**: Manage all platform users with role-based access
- **Content Moderation**: Approve/delete reviews and manage content
- **Verification System**: Verify artists and studios
- **Booking Oversight**: Monitor and manage all bookings
- **Analytics Dashboard**: View platform statistics and insights
- **Payment Management**: Handle refunds and payment issues

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **React Icons** - Icon library
- **React DatePicker** - Date selection component
- **React Toastify** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **cors** - Cross-origin resource sharing
- **helmet** - Security middleware
- **express-rate-limit** - Rate limiting

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server
- **Concurrently** - Run multiple commands

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tunelink.git
   cd tunelink
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the server directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/tunelink
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=30d
   EMAIL_FROM=noreply@tunelink.com
   EMAIL_PASSWORD=your-email-password
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the client directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Start the frontend development server**
   ```bash
   npm start
   ```

## 🗄️ Database Setup

### MongoDB Connection
The application uses MongoDB as the primary database. Make sure MongoDB is running on your system.

### Database Models

#### User Model
- Basic user information (name, email, password)
- Role-based access (client, artist, studio, admin)
- Verification status
- Profile images and preferences

#### Artist Model
- Professional information (bio, instruments, genres)
- Hourly rates and availability
- Media uploads (audio samples, videos)
- Verification and featured status

#### Studio Model
- Studio information (name, description, services)
- Location and contact details
- Equipment and facilities
- Image gallery and pricing

#### Booking Model
- Session details (date, time, duration)
- Payment information
- Status tracking (pending, confirmed, completed, cancelled)
- Client and provider references

## 🔐 Authentication & Authorization

### JWT Implementation
- Secure token-based authentication
- Role-based access control
- Token refresh mechanism
- Secure password hashing with bcrypt

### Protected Routes
- Client dashboard routes
- Artist dashboard routes
- Studio dashboard routes
- Admin dashboard routes

## 📱 User Interface

### Modern Design
- Glassmorphism effects
- Gradient backgrounds
- Smooth animations
- Responsive design
- Dark/light theme support

### Components
- **Navigation**: Modern navbar with role-based menus
- **Cards**: Artist and studio profile cards
- **Forms**: User-friendly input forms with validation
- **Modals**: Confirmation and detail modals
- **Tables**: Admin management tables
- **Charts**: Analytics and statistics

## 🎯 Key Features Implementation

### Booking System
1. **Date Selection**: Calendar-based date picker
2. **Time Slot Selection**: Available time slots based on provider availability
3. **Duration Selection**: Flexible booking durations
4. **Payment Processing**: Secure payment integration
5. **Confirmation**: Email notifications and booking confirmations

### Search & Filtering
- **Text Search**: Search by name, description, or services
- **Location Filter**: Filter by city or region
- **Genre Filter**: Filter by music genre
- **Price Range**: Filter by hourly rates
- **Availability**: Filter by available dates

### Review System
- **Rating System**: 1-5 star ratings
- **Comment System**: Detailed review comments
- **Moderation**: Admin approval for reviews
- **Aggregate Ratings**: Average ratings display

### File Upload
- **Image Upload**: Profile pictures and gallery images
- **Audio Upload**: Sample tracks and demos
- **Video Upload**: Performance videos
- **File Validation**: Type and size validation

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Configure MongoDB connection
3. Set up SSL certificates
4. Configure reverse proxy (nginx)
5. Use PM2 for process management

### Frontend Deployment
1. Build the production version
2. Configure environment variables
3. Deploy to CDN or hosting service
4. Set up custom domain

## 🔧 Development

### Code Structure
```
tunelink/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── dashboard/    # Dashboard pages
│   │   ├── contexts/     # React contexts
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
├── server/                # Node.js backend
│   ├── controllers/      # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── config/          # Configuration files
└── README.md
```

### Scripts
```bash
# Backend
npm run dev          # Start development server
npm run start        # Start production server
npm run seed         # Seed database with sample data

# Frontend
npm start            # Start development server
npm run build        # Build for production
npm test             # Run tests
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@tunelink.com or create an issue in the repository.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- MongoDB team for the database
- All contributors who helped build this platform

---

**TuneLink** - Connecting musicians, studios, and clients worldwide! 🎵
