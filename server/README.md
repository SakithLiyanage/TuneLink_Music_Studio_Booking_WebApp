# TuneLink Backend API

A comprehensive Node.js/Express backend for the TuneLink music booking platform.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Complete user CRUD operations with role management
- **Artist Profiles**: Comprehensive artist profiles with media, availability, and ratings
- **Studio Management**: Studio profiles with facilities, equipment, and booking system
- **Booking System**: Complete booking lifecycle with status management
- **Search & Filtering**: Advanced search and filtering capabilities
- **File Upload**: Secure file upload for images and media
- **Security**: Rate limiting, input validation, XSS protection, and more
- **Database**: MongoDB with Mongoose ODM
- **Error Handling**: Comprehensive error handling and logging

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TuneLink/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the server directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   MONGO_URI=mongodb://localhost:27017/tunelink

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
   JWT_EXPIRE=30d

   # Email Configuration (for password reset)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password

   # File Upload Configuration
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/updatedetails` | Update user details | Private |
| PUT | `/api/auth/updatepassword` | Update password | Private |
| POST | `/api/auth/forgotpassword` | Forgot password | Public |
| PUT | `/api/auth/resetpassword/:token` | Reset password | Public |

### Artists Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/artists` | Get all artists | Public |
| GET | `/api/artists/:id` | Get single artist | Public |
| POST | `/api/artists` | Create artist profile | Private (Artist) |
| PUT | `/api/artists/:id` | Update artist profile | Private (Owner/Admin) |
| DELETE | `/api/artists/:id` | Delete artist profile | Private (Owner/Admin) |
| PUT | `/api/artists/:id/media` | Upload artist media | Private (Owner/Admin) |
| POST | `/api/artists/:id/ratings` | Add rating to artist | Private (Client/Admin) |
| GET | `/api/artists/featured` | Get featured artists | Public |
| GET | `/api/artists/search` | Search artists | Public |
| PUT | `/api/artists/:id/availability` | Update availability | Private (Owner/Admin) |

### Studios Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/studios` | Get all studios | Public |
| GET | `/api/studios/:id` | Get single studio | Public |
| POST | `/api/studios` | Create studio profile | Private (Studio) |
| PUT | `/api/studios/:id` | Update studio profile | Private (Owner/Admin) |
| DELETE | `/api/studios/:id` | Delete studio profile | Private (Owner/Admin) |
| PUT | `/api/studios/:id/images` | Upload studio images | Private (Owner/Admin) |
| POST | `/api/studios/:id/ratings` | Add rating to studio | Private (Client/Admin) |
| GET | `/api/studios/featured` | Get featured studios | Public |
| GET | `/api/studios/search` | Search studios | Public |
| PUT | `/api/studios/:id/availability` | Update availability | Private (Owner/Admin) |

### Bookings Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/bookings` | Get all bookings | Private (Admin) |
| GET | `/api/bookings/:id` | Get single booking | Private (Owner/Admin) |
| POST | `/api/bookings` | Create booking | Private (Client) |
| PUT | `/api/bookings/:id` | Update booking | Private (Owner/Admin) |
| DELETE | `/api/bookings/:id` | Delete booking | Private (Owner/Admin) |
| PUT | `/api/bookings/:id/status` | Update booking status | Private (Artist/Studio/Admin) |
| GET | `/api/bookings/me` | Get user bookings | Private |
| GET | `/api/bookings/artist` | Get artist bookings | Private (Artist) |
| GET | `/api/bookings/studio` | Get studio bookings | Private (Studio) |

### Users Endpoints (Admin Only)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/users` | Get all users | Private (Admin) |
| GET | `/api/users/:id` | Get single user | Private (Admin) |
| POST | `/api/users` | Create user | Private (Admin) |
| PUT | `/api/users/:id` | Update user | Private (Admin) |
| DELETE | `/api/users/:id` | Delete user | Private (Admin) |
| GET | `/api/users/role/:role` | Get users by role | Private (Admin) |
| PUT | `/api/users/:id/verify` | Update verification status | Private (Admin) |
| PUT | `/api/users/:id/active` | Update active status | Private (Admin) |
| GET | `/api/users/stats` | Get user statistics | Private (Admin) |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Database Models

### User
- Basic user information
- Role-based access (client, artist, studio, admin)
- Contact information and bio

### Artist
- Extended user profile for musicians
- Instruments, genres, experience
- Media files and audio samples
- Availability and pricing
- Ratings and reviews

### Studio
- Extended user profile for recording studios
- Facilities and equipment
- Services and pricing
- Images and availability
- Ratings and reviews

### Booking
- Client, artist, and studio relationships
- Date, time, and duration
- Services and pricing
- Status and payment tracking
- Ratings and reviews

## 🛡️ Security Features

- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Comprehensive validation using express-validator
- **XSS Protection**: Prevents cross-site scripting attacks
- **NoSQL Injection Protection**: Sanitizes MongoDB queries
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for Express
- **JWT Token Management**: Secure token handling with expiration

## 🚀 Deployment

### Environment Variables
Set the following environment variables for production:

```env
NODE_ENV=production
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
CORS_ORIGIN=your_frontend_domain
```

### PM2 (Recommended)
```bash
npm install -g pm2
pm2 start server.js --name tunelink-api
pm2 save
pm2 startup
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📝 Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm run seed`: Seed database with sample data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@tunelink.com or create an issue in the repository. 