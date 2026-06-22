# 📚 StudyNotion — Full Project Documentation

> A full-stack EdTech (Education Technology) platform built with the MERN stack (MongoDB, Express, React, Node.js) that allows students to buy and watch courses, and instructors to create and manage them.

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Environment Variables](#4-environment-variables)
5. [Database Models](#5-database-models)
6. [Backend Architecture](#6-backend-architecture)
7. [API Endpoints](#7-api-endpoints)
8. [Frontend Architecture](#8-frontend-architecture)
9. [Redux State Management](#9-redux-state-management)
10. [Authentication Flow](#10-authentication-flow)
11. [Payment Flow (Razorpay)](#11-payment-flow-razorpay)
12. [File Upload (Cloudinary)](#12-file-upload-cloudinary)
13. [User Roles & Permissions](#13-user-roles--permissions)
14. [Frontend Pages & Routes](#14-frontend-pages--routes)
15. [Known Bugs Fixed](#15-known-bugs-fixed)
16. [Deployment](#16-deployment)
17. [How to Run Locally](#17-how-to-run-locally)

---

## 1. Project Overview

**StudyNotion** is a full-stack EdTech (Education Technology) web application inspired by platforms like Udemy/Coursera. It supports three types of users:

- **Students** — Browse, purchase, and watch courses. Track progress.
- **Instructors** — Create, edit, publish, and delete courses with sections and subsections.
- **Admins** — Manage categories.

### Core Features
- OTP-based email verification for signup
- JWT-based authentication with cookie support
- Razorpay payment gateway integration
- Cloudinary-based image and video uploads
- Course progress tracking per student
- Rating & review system
- Instructor dashboard with revenue analytics
- React-based multi-step course creation form

---

## 2. Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.2.0 | UI Library |
| React Router DOM | 6.22.3 | Client-side routing |
| Redux Toolkit | 2.5.1 | Global state management |
| Tailwind CSS | 3.4.3 | Utility-first CSS |
| Axios | 1.7.9 | HTTP requests |
| React Hook Form | 7.54.2 | Form state & validation |
| React Hot Toast | 2.5.1 | Toast notifications |
| React Icons | 5.1.0 | Icon library |
| React Markdown | 10.1.0 | Render markdown content |
| React Stars / react-rating-stars-component | 2.x | Star rating UI |
| Swiper | 11.2.1 | Carousel / slider |
| Chart.js + react-chartjs-2 | 4.x / 5.x | Instructor analytics charts |
| Video React | 0.16.0 | Video player component |
| react-type-animation | 3.2.0 | Animated text on homepage |
| react-otp-input | 3.1.1 | OTP input boxes |
| react-dropzone | 14.3.8 | Drag & drop file upload |
| jwt-decode | 4.0.0 | Decode JWT on client |
| copy-to-clipboard | 3.3.3 | Copy-to-clipboard utility |
| @ramonak/react-progress-bar | 5.3.0 | Course progress bar |
| concurrently | 8.2.2 | Run client + server together |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | — | JavaScript runtime |
| Express | 4.19.2 | Web framework |
| Mongoose | 8.10.1 | MongoDB ODM |
| bcrypt | 6.0.0 | Password hashing |
| jsonwebtoken | 9.0.2 | JWT auth |
| cookie-parser | 1.4.6 | Cookie parsing |
| cors | 2.8.5 | Cross-origin requests |
| dotenv | 16.4.5 | Environment config |
| express-fileupload | 1.5.1 | Handle file uploads |
| nodemailer | 8.0.7 | Send transactional emails |
| otp-generator | 4.0.1 | Generate OTPs |
| razorpay | 2.9.5 | Payment gateway SDK |
| cloudinary | 2.2.0 | Media storage |
| nodemon | 3.1.0 | Dev server auto-restart |

---

## 3. Project Structure

```
Study_Notion_MERN-stack/
├── package.json                  ← Root package (frontend + concurrently)
├── tailwind.config.js            ← Custom Tailwind color palette & fonts
├── .env                          ← Frontend env variables (REACT_APP_*)
│
├── src/                          ← React frontend
│   ├── index.js                  ← React entry point (Redux + BrowserRouter)
│   ├── App.js                    ← Main router with all route definitions
│   ├── App.css                   ← Global styles
│   │
│   ├── Pages/                    ← Top-level page components
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Catalog.jsx
│   │   ├── CourseDetails.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── VerifyEmail.jsx
│   │   ├── UpdatePassword.jsx
│   │   ├── ViewCourse.jsx
│   │   └── Error.jsx
│   │
│   ├── Components/
│   │   ├── common/               ← Shared components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── IconBtn.jsx
│   │   │   ├── RatingStars.jsx
│   │   │   ├── ReviewSlider.jsx
│   │   │   ├── Tab.jsx
│   │   │   └── confirmationModal.jsx
│   │   │
│   │   ├── contactPage/
│   │   │   └── ContactUsForm.jsx
│   │   │
│   │   └── Core/
│   │       ├── Auth/             ← Auth guard components
│   │       │   ├── PrivateRoute.jsx
│   │       │   ├── OpenRoute.jsx
│   │       │   └── CheckAuth.jsx
│   │       ├── HomePage/         ← Home page sections
│   │       ├── AboutPage/
│   │       ├── Catalog/
│   │       ├── Course/           ← Course detail components
│   │       ├── Dashborad/        ← Dashboard (note: typo in folder name)
│   │       │   ├── AddCourse/    ← Multi-step course creation form
│   │       │   ├── EditCourse/
│   │       │   ├── Cart/
│   │       │   ├── Settings/
│   │       │   ├── InstructorCourses/
│   │       │   │   └── CoursesTable.jsx
│   │       │   ├── InstructorDashboard/
│   │       │   │   └── Instructor.jsx
│   │       │   ├── EnrolledCourses.jsx
│   │       │   ├── MyCourses.jsx
│   │       │   ├── MyProfile.jsx
│   │       │   ├── Sidebar.jsx
│   │       │   ├── SidebarLink.jsx
│   │       │   └── UpdatePassword.jsx
│   │       └── ViewCourse/
│   │           ├── VideoDetails.jsx
│   │           ├── VideoDetailsSidebar.jsx
│   │           └── CourseReviewModal.jsx
│   │
│   ├── services/
│   │   ├── apiconnector.js       ← Axios wrapper
│   │   ├── apis.js               ← All API endpoint URLs
│   │   ├── formatDate.js         ← Date formatter utility
│   │   └── operations/           ← Thunk-based API call functions
│   │       ├── authAPI.js
│   │       ├── courseDetailsAPI.js
│   │       ├── studentFeaturesAPI.js
│   │       ├── profileAPI.js
│   │       ├── SettingsAPI.js
│   │       └── pageAndComponentData.js
│   │
│   ├── slices/                   ← Redux slices
│   │   ├── authSlice.js
│   │   ├── profileSlice.js
│   │   ├── cartSlice.js
│   │   ├── courseSlice.js
│   │   └── viewCourseSlice.js
│   │
│   ├── reducer/
│   │   └── index.js              ← combineReducers root
│   │
│   ├── context/
│   │   └── AuthProvider.jsx      ← React context for auth
│   │
│   ├── hooks/                    ← Custom React hooks
│   ├── utils/
│   │   ├── constants.js          ← ACCOUNT_TYPE, COURSE_STATUS enums
│   │   └── avgRating.js          ← GetAvgRating utility
│   └── data/
│       └── countrycode.json      ← Country codes for phone input
│
└── server/                       ← Node/Express backend
    ├── index.js                  ← Server entry point
    ├── package.json
    ├── vercel.json               ← Vercel deployment config
    ├── .env                      ← Backend secrets
    │
    ├── config/
    │   ├── database.js           ← MongoDB connection
    │   ├── cloudinary.js         ← Cloudinary SDK config
    │   └── razorpay.js           ← Razorpay instance
    │
    ├── models/                   ← Mongoose schemas
    │   ├── User.js
    │   ├── Profile.js
    │   ├── OTP.js
    │   ├── Course.js
    │   ├── Category.js
    │   ├── Section.js
    │   ├── SubSection.js
    │   ├── RatingAndReviews.js
    │   └── CourseProgess.js      ← (note: typo, should be CourseProgress)
    │
    ├── controllers/              ← Business logic handlers
    │   ├── Auth.js
    │   ├── ResetPassword.js
    │   ├── Profile.js
    │   ├── Course.js
    │   ├── Category.js
    │   ├── Section.js
    │   ├── SubSection.js
    │   ├── RatingAndReview.js
    │   ├── CourseProgress.js
    │   └── Payments.js
    │
    ├── middlewares/
    │   ├── Auth.js               ← JWT verify + role guards
    │   └── ResetPassword.js
    │
    ├── routes/
    │   ├── User.js               ← /api/v1/auth/*
    │   ├── Profile.js            ← /api/v1/profile/*
    │   ├── Course.js             ← /api/v1/course/*
    │   └── Payments.js           ← /api/v1/payment/*
    │
    ├── utils/
    │   ├── MailSender.js         ← Nodemailer helper
    │   ├── ImageUploader.js      ← Cloudinary upload helper
    │   └── secToDuration.js      ← Seconds → "1h 30m" converter
    │
    └── mail/
        └── templates/            ← HTML email templates
            ├── emailVerificationTemplate.js
            ├── courseEnrollmentEmail.js
            └── paymentSuccessEmail.js
```

---

## 4. Environment Variables

### Frontend (`/.env`)
```
REACT_APP_BASE_URL=http://localhost:8000
REACT_APP_RAZORPAY_KEY=rzp_test_xxxxxxxxxxxx
```

### Backend (`/server/.env`)
```
MONGODB_URL=mongodb+srv://...
JWT_SECRET=your_jwt_secret
PORT=8000

# Cloudinary
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret
FOLDER_NAME=StudyNotion

# Razorpay
RAZORPAY_KEY=rzp_test_xxxxxxxxxxxx
RAZORPAY_SECRET=your_razorpay_secret

# Nodemailer
MAIL_HOST=smtp.gmail.com
MAIL_USER=your@email.com
MAIL_PASS=your_app_password
```

---

## 5. Database Models

### User
| Field | Type | Notes |
|---|---|---|
| `firstName` | String | Required |
| `lastName` | String | Required |
| `email` | String | Required, unique |
| `password` | String | Hashed with bcrypt |
| `accountType` | String (enum) | `"Student"` / `"Instructor"` / `"Admin"` |
| `additionalDetails` | ObjectId → Profile | Populated profile data |
| `courses` | [ObjectId → Course] | Enrolled/created courses |
| `image` | String | Cloudinary URL or DiceBear avatar |
| `token` | String | Password reset token |
| `resetPasswordExpires` | Date | Token expiry timestamp |
| `courseProgress` | [ObjectId → CourseProgress] | Student progress references |
| `createdAt` | Date | Auto |

### Profile
| Field | Type |
|---|---|
| `gender` | String |
| `dateOfBirth` | String |
| `about` | String |
| `contactNumber` | Number |

### OTP
| Field | Type | Notes |
|---|---|---|
| `email` | String | Recipient |
| `otp` | String | 6-digit OTP |
| `createdAt` | Date | Auto-expires after **5 minutes** |

> OTP model has a **pre-save hook** that automatically sends the verification email via Nodemailer when an OTP document is created.

### Course
| Field | Type | Notes |
|---|---|---|
| `courseName` | String | — |
| `courseDescription` | String | — |
| `instructor` | ObjectId → User | Required |
| `whatYouWillLearn` | String | Markdown content |
| `courseContent` | [ObjectId → Section] | Sections array |
| `ratingAndReviews` | [ObjectId → RatingAndReview] | Reviews |
| `price` | Number | In INR |
| `thumbnail` | String | Cloudinary URL |
| `tag` | [String] | Tags array |
| `category` | ObjectId → Category | Required |
| `studentsEnrolled` | [ObjectId → User] | Enrolled students |
| `instructions` | [String] | Prerequisites |
| `status` | String (enum) | `"Draft"` / `"Published"` |
| `createdAt` | Date | Auto |

### Category
| Field | Type |
|---|---|
| `name` | String |
| `description` | String |
| `courses` | [ObjectId → Course] |

### Section
| Field | Type |
|---|---|
| `sectionName` | String |
| `subSection` | [ObjectId → SubSection] |

### SubSection
| Field | Type |
|---|---|
| `title` | String |
| `timeDuration` | String (in seconds) |
| `description` | String |
| `videoUrl` | String (Cloudinary) |

### RatingAndReview
| Field | Type |
|---|---|
| `user` | ObjectId → User |
| `rating` | Number |
| `review` | String |
| `course` | ObjectId → Course |

### CourseProgress
| Field | Type |
|---|---|
| `courseID` | ObjectId → Course |
| `userId` | ObjectId → User |
| `completedVideos` | [ObjectId → SubSection] |

---

## 6. Backend Architecture

The backend is a standard **Express REST API** following the MVC pattern.

```
Request → Route → Middleware (auth/role) → Controller → Model → Response
```

### Server Entry (`server/index.js`)
- Loads Express, CORS, cookie-parser, express-fileupload
- Connects to MongoDB via `config/database.js`
- Connects to Cloudinary via `config/cloudinary.js`
- Mounts 4 route groups on `/api/v1/`
- Default route on GET `/` returns a hello message
- `PORT` defaults to `8000`

### Middleware Stack
- `express.json()` — parse JSON bodies
- `cookieParser()` — parse cookies (JWT stored in cookie)
- `cors()` — allow cross-origin requests
- `fileUpload({ useTempFiles: true, tempFileDir: "/tmp" })` — handle multipart uploads

### Auth Middleware (`middlewares/Auth.js`)
Extracts JWT from:
1. `req.cookies.token`
2. `req.body.token`
3. `Authorization: Bearer <token>` header

Verifies token with `JWT_SECRET`. Sets `req.user` to decoded payload.

**Role guards:**
- `IsStudent` — rejects if `req.user.accountType !== "Student"`
- `IsInstructor` — rejects if `req.user.accountType !== "Instructor"`
- `Admin` — rejects if `req.user.accountType !== "Admin"`

---

## 7. API Endpoints

### Auth (`/api/v1/auth`)
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/sendotp` | None | Send OTP to email |
| POST | `/signup` | None | Register new user |
| POST | `/login` | None | Login, returns JWT |
| POST | `/changepassword` | ✅ JWT | Change password |
| POST | `/reset-password-token` | None | Send reset link to email |
| POST | `/reset-password` | None | Set new password using token |

### Profile (`/api/v1/profile`)
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/getUserDetails` | ✅ JWT | Get logged-in user details |
| PUT | `/updateProfile` | ✅ JWT | Update profile fields |
| PUT | `/updateDisplayPicture` | ✅ JWT | Upload new profile picture |
| GET | `/getEnrolledCourses` | ✅ JWT | Get student's enrolled courses |
| DELETE | `/deleteProfile` | ✅ JWT | Delete user account |
| GET | `/instructorDashboard` | ✅ JWT + Instructor | Get instructor stats |

### Course (`/api/v1/course`)
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/createCourse` | ✅ Instructor | Create new course |
| POST | `/editCourse` | ✅ Instructor | Edit course fields |
| DELETE | `/deleteCourse` | None* | Delete course & cleanup |
| GET | `/getAllCourses` | None | Get all published courses |
| POST | `/getCourseDetails` | None | Get public course info |
| POST | `/getFullCourseDetails` | ✅ JWT | Get full data (videos) |
| GET | `/getInstructorCourses` | ✅ Instructor | Get instructor's courses |
| POST | `/addSection` | ✅ Instructor | Add section to course |
| POST | `/updateSection` | ✅ Instructor | Edit section |
| POST | `/deleteSection` | ✅ Instructor | Delete section |
| POST | `/addSubSection` | ✅ Instructor | Add lecture |
| POST | `/updateSubSection` | ✅ Instructor | Edit lecture |
| POST | `/deleteSubSection` | ✅ Instructor | Delete lecture |
| POST | `/updateCourseProgress` | ✅ Student | Mark lecture complete |
| POST | `/createCategory` | ✅ Admin | Create category |
| GET | `/showAllCategories` | None | List all categories |
| POST | `/getCategoryPageDetails` | None | Category with courses |
| POST | `/createRating` | ✅ Student | Submit review |
| GET | `/getAverageRating` | None | Average rating for course |
| GET | `/getReviews` | None | All ratings (sorted by ⭐) |

> *Note: `deleteCourse` is missing auth middleware — a known security gap.

### Payments (`/api/v1/payment`)
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/capturePayment` | ✅ Student | Initiate Razorpay order |
| POST | `/verifyPayment` | ✅ Student | Verify signature + enroll |
| POST | `/sendPaymentSuccessEmail` | ✅ Student | Send payment receipt email |

---

## 8. Frontend Architecture

The frontend is a **Create React App** project with React 18.

### Entry Point (`src/index.js`)
Wraps the entire app with:
- `<Provider store={store}>` — Redux
- `<BrowserRouter>` — React Router
- `<AuthProvider>` — Auth context
- `<Toaster />` — Global toast notifications

### App.js — Route Structure
```
/ (Home)
/about
/contact
/catalog/:catalogName
/courses/:courseId          ← Public course details
/login                      ← OpenRoute (redirect if logged in)
/signup                     ← OpenRoute
/forgot-password            ← OpenRoute
/verify-email               ← OpenRoute
/update-password/:id        ← OpenRoute

/dashboard                  ← PrivateRoute + CheckAuth
  my-profile
  settings
  [Instructor only]
    instructor
    add-course
    my-courses
    edit-course/:courseId
    enrolled-courses
  [Student only]
    cart
    enrolled-courses

view-course/:courseId/...   ← PrivateRoute + Student only
  section/:sectionId/sub-section/:subSectionId
```

### Auth Guards
- **`OpenRoute`** — redirects logged-in users away from login/signup
- **`PrivateRoute`** — redirects unauthenticated users to `/login`
- **`CheckAuth`** — additional auth verification layer

### API Connector (`src/services/apiconnector.js`)
A thin wrapper around Axios:
```js
apiConnector(method, url, bodyData, headers, params)
```
All API calls go through this single function.

---

## 9. Redux State Management

Root reducer combines 5 slices:

### `auth` Slice
| State Key | Type | Persisted |
|---|---|---|
| `token` | String \| null | ✅ localStorage |
| `loading` | Boolean | ❌ |
| `signupData` | Object \| null | ❌ |

### `profile` Slice
| State Key | Type | Persisted |
|---|---|---|
| `user` | Object \| null | ✅ localStorage |
| `loading` | Boolean | ❌ |

### `cart` Slice
| State Key | Type | Persisted |
|---|---|---|
| `cart` | Array | ✅ localStorage |
| `total` | Number | ✅ localStorage |
| `totalItems` | Number | ✅ localStorage |

Actions: `addToCart`, `removeFromCart`, `resetCart`

### `course` Slice
| State Key | Type | Notes |
|---|---|---|
| `step` | Number | Multi-step course creation |
| `course` | Object | Course being created/edited |
| `editCourse` | Boolean | Edit mode flag |
| `paymentLoading` | Boolean | Razorpay loading state |

### `viewCourse` Slice
| State Key | Type |
|---|---|
| `courseSectionData` | Array of sections |
| `courseEntireData` | Full course object |
| `completedLectures` | Array of subSection IDs |
| `totalNoOfLectures` | Number |

---

## 10. Authentication Flow

### Signup (OTP-based)
```
1. User fills signup form → clicks "Send OTP"
2. Frontend: POST /api/v1/auth/sendotp { email }
3. Backend: Generates 6-digit OTP → saves to OTP collection
4. OTP model pre-save hook: Sends email via Nodemailer
5. User enters OTP → submits signup form
6. Frontend: POST /api/v1/auth/signup { ...fields, otp }
7. Backend: Finds most recent OTP by email, validates it
8. Creates Profile doc → Creates User doc → Returns 200
9. Frontend: navigates to /login
```

### Login
```
1. User fills email + password
2. Frontend: POST /api/v1/auth/login { email, password }
3. Backend: finds User by email → await bcrypt.compare(password, hash)
4. If match: generates JWT (3h expiry) → sets httpOnly cookie
5. Returns: { token, user } in response body
6. Frontend: stores token + user in localStorage + Redux
7. Navigates to /dashboard/my-profile
```

### JWT Verification (every protected request)
```
Auth middleware reads token from:
  1. req.cookies.token
  2. req.body.token
  3. Authorization: Bearer <token>

→ JWT.verify(token, JWT_SECRET)
→ Sets req.user = decoded { email, id, accountType }
→ Calls next()
```

### Password Reset
```
1. POST /reset-password-token { email }
2. Generates crypto.randomUUID() token
3. Saves token + expiry (5 min) to User document
4. Sends email with link: http://localhost:3000/update-password/{token}
5. User clicks link → POST /reset-password { password, confirmPassword, token }
6. Finds user by token → checks expiry → hashes new password → saves
```

---

## 11. Payment Flow (Razorpay)

```
STUDENT                    FRONTEND                     BACKEND                    RAZORPAY
   │──── Click Buy Now ────►│                              │                          │
   │                        │── POST /capturePayment ─────►│                          │
   │                        │   { course_Id }              │── instance.orders.create►│
   │                        │                              │◄── { orderId, amount } ──│
   │                        │◄── { orderId, amount, ... } ─│                          │
   │                        │                              │                          │
   │                        │─ Opens Razorpay Checkout ───►│                          │
   │◄── Payment Dialog ─────│                              │                          │
   │──── Pays ──────────────►│                              │                          │
   │                        │◄── { razorpay_order_id,      │                          │
   │                        │     razorpay_payment_id,     │                          │
   │                        │     razorpay_signature }     │                          │
   │                        │                              │                          │
   │                        │── POST /verifyPayment ───────►│                          │
   │                        │                              │─ Verify HMAC signature   │
   │                        │                              │─ Enroll student in course│
   │                        │                              │─ Create CourseProgress   │
   │                        │                              │─ Send enrollment email   │
   │                        │◄── { success: true } ────────│                          │
   │                        │                              │                          │
   │◄── Redirect to         │── POST /sendPaymentSuccess   │                          │
   │    enrolled courses ───│   Email ────────────────────►│                          │
```

---

## 12. File Upload (Cloudinary)

All media (course thumbnails, profile pictures, lecture videos) is uploaded to Cloudinary.

**Helper: `server/utils/ImageUploader.js`**
- Uses `express-fileupload` which stores files in `/tmp`
- Calls `cloudinary.uploader.upload(file.tempFilePath, { folder })`
- Returns `secure_url` stored in DB

**Used in:**
- Course creation/edit → thumbnail
- SubSection creation/edit → video
- Profile settings → display picture

---

## 13. User Roles & Permissions

| Feature | Student | Instructor | Admin |
|---|---|---|---|
| Browse courses | ✅ | ✅ | ✅ |
| View course details | ✅ | ✅ | ✅ |
| Purchase courses | ✅ | ❌ | ❌ |
| View enrolled course videos | ✅ | ❌ | ❌ |
| Track progress | ✅ | ❌ | ❌ |
| Submit rating/review | ✅ | ❌ | ❌ |
| Add to cart | ✅ | ❌ | ❌ |
| Create/Edit courses | ❌ | ✅ | ❌ |
| Upload videos | ❌ | ✅ | ❌ |
| View instructor dashboard | ❌ | ✅ | ❌ |
| Create categories | ❌ | ❌ | ✅ |

---

## 14. Frontend Pages & Routes

| Route | Component | Description |
|---|---|---|
| `/` | `Home.jsx` | Landing page with hero, features, course catalog |
| `/about` | `About.jsx` | About page with team and stats |
| `/contact` | `Contact.jsx` | Contact form |
| `/catalog/:catalogName` | `Catalog.jsx` | Courses by category |
| `/courses/:courseId` | `CourseDetails.jsx` | Course info, accordion, buy button |
| `/login` | `Login.jsx` | Login form |
| `/signup` | `Signup.jsx` | Signup form |
| `/forgot-password` | `ForgotPassword.jsx` | Request reset link |
| `/verify-email` | `VerifyEmail.jsx` | OTP input page |
| `/update-password/:id` | `UpdatePassword.jsx` | Set new password |
| `/dashboard/my-profile` | `MyProfile.jsx` | User profile view |
| `/dashboard/settings` | `Settings/` | Update profile, password, photo, delete account |
| `/dashboard/cart` | `Cart/` | Shopping cart (Student) |
| `/dashboard/enrolled-courses` | `EnrolledCourses.jsx` | Student's courses with progress |
| `/dashboard/instructor` | `Instructor.jsx` | Revenue + student charts |
| `/dashboard/add-course` | `AddCourse/` | Multi-step course builder |
| `/dashboard/my-courses` | `MyCourses.jsx` + `CoursesTable.jsx` | Instructor's course list |
| `/dashboard/edit-course/:id` | `EditCourse/` | Edit existing course |
| `/view-course/:id/section/:sid/sub-section/:ssid` | `VideoDetails.jsx` | Video player + progress |
| `*` | `Error.jsx` | 404 page |

### Dashboard Sidebar Links (Dynamic by Role)
**Student:** My Profile, Enrolled Courses, Cart, Settings  
**Instructor:** My Profile, My Courses, Add Course, Instructor Dashboard, Settings

---

## 15. Known Bugs Fixed

During the audit, **21 bugs** were found and fixed across 10 files:

| # | File | Bug Description | Severity |
|---|---|---|---|
| 1 | `middlewares/Auth.js` | `require("dotenv").env` — dotenv never initialized | 🔴 Critical |
| 2-4 | `middlewares/Auth.js` | `err.message` undefined in 3 catch blocks | 🔴 Critical |
| 5 | `controllers/Auth.js` | `bcrypt.compare()` missing `await` — any password worked | 🔴 Security |
| 6 | `controllers/Auth.js` | OTP sort key typo `createAt` → `createdAt` | 🔴 Critical |
| 7 | `controllers/Auth.js` | `recentOTP.length == 0` on single document (not array) | 🔴 Critical |
| 8 | `controllers/Course.js` | `const status` reassignment → TypeError crash | 🔴 Critical |
| 9 | `controllers/Course.js` | `Course({...})` missing `new` keyword | 🔴 Critical |
| 10 | `controllers/ResetPassword.js` | `Uses` undefined — should be `User` | 🔴 Critical |
| 11 | `controllers/ResetPassword.js` | `crypto` not imported | 🔴 Critical |
| 12 | `controllers/Payments.js` | Order failure returned `success: true` | 🔴 Critical |
| 13 | `controllers/Payments.js` | `enrollStudents.email` → should be `enrolledStudent.email` | 🔴 Critical |
| 14 | `controllers/Payments.js` | `error` used out of scope in verifySignature | 🟡 Medium |
| 15 | `controllers/RatingAndReview.js` | `$push: { ratingsAndReviews }` → wrong field, reviews never saved | 🔴 Critical |
| 16 | `controllers/RatingAndReview.js` | `catch` block missing `(error)` parameter | 🔴 Critical |
| 17 | `controllers/Profile.js` | `uploadImageToCloudinary` not imported | 🔴 Critical |
| 18 | `controllers/Profile.js` | `getAllUserDetails` — userDetails never returned in response | 🟡 Medium |
| 19 | `ContactUsForm.jsx` | Country code select had `name="firstname"` (wrong) | 🟡 Medium |
| 20 | `CourseReviewModal.jsx` | Invalid CSS class `resize-x-none` → `resize-none` | 🟢 Minor |
| 21 | `studentFeaturesAPI.js` | Typos in success toast message | 🟢 Minor |

---

## 16. Deployment

### Backend (Vercel)
The server has a `vercel.json` file:
```json
{
  "version": 2,
  "builds": [{ "src": "index.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "/index.js" }]
}
```
All requests are routed to `index.js`.

### Frontend
Standard Create React App — built with `npm run build`.

### Running Both Together
The root `package.json` uses `concurrently`:
```bash
npm run dev
# Runs: React (port 3000) + Express server (port 8000) simultaneously
```

---

## 17. How to Run Locally

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Razorpay test account
- Gmail app password for Nodemailer

### Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd Study_Notion_MERN-stack

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd server
npm install
cd ..

# 4. Configure environment variables
# Create .env in root for frontend (REACT_APP_BASE_URL, REACT_APP_RAZORPAY_KEY)
# Create .env in server/ for backend (MONGODB_URL, JWT_SECRET, Cloudinary, Razorpay, Mail)

# 5. Start both frontend and backend
npm run dev

# Frontend → http://localhost:3000
# Backend  → http://localhost:8000
```

### Useful Commands
| Command | Description |
|---|---|
| `npm run dev` | Start both client + server |
| `npm start` | Start only React frontend |
| `npm run server` | Start only Express backend |
| `npm run build` | Build React for production |
| `cd server && npm run dev` | Start backend with nodemon |

---

## Appendix — Tailwind Custom Color Palette

The app uses a fully custom Tailwind palette (no standard Tailwind colors):

| Scale Name | Usage |
|---|---|
| `richblack-*` | Dark backgrounds, text (main UI) |
| `richblue-*` | Accent blue tones |
| `blue-*` | Link/info colors |
| `caribbeangreen-*` | Success / active states |
| `yellow-*` | Primary CTA buttons |
| `pink-*` | Error / required field indicators |
| `brown-*` | Accent / decorative |
| `pure-greys-*` | Neutral greys |

Custom fonts configured:
- `font-inter` → Inter (primary UI font)
- `font-edu-sa` → Edu SA Beginner (decorative)
- `font-mono` → Roboto Mono (code blocks)

---

*Documentation generated from full source code analysis of the Study Notion MERN Stack project.*
