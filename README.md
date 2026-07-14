# SmartLearn – Full-Stack Learning Management System (LMS)

SmartLearn is a **full-stack Learning Management System (LMS)** built for **learning, portfolio, and real-world practice**.  
It allows students to enroll in paid courses, educators to publish structured courses, and admins to monitor platform analytics such as enrollments and earnings.

This project focuses on **clean architecture**, **role-based access control**, **payment integration**, and **production-style deployment**.

## 🚀 Live Demo

- **Deployed Link**: https://lms-mauve-beta.vercel.app/  

### 🧪 Test Credentials

- **Student**: student@gmail.com / student@clerk  
- **Educator**: educator@gmail.com / educator@clerk   

## 🧩 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose

### Authentication & Payments
- **Clerk** – Authentication & user management
- **Stripe (Test Mode)** – One-time course payments
- **Stripe Webhooks** – Secure payment verification

### Media Handling
- **Cloudinary** – Course thumbnails
- **YouTube URLs** – Course video lectures

### Deployment
- **Frontend**: Vercel
- **Backend**: Vercel
- **Database**: MongoDB Atlas

## 🌱 Prisma Migration

A complete migration from **MongoDB (Mongoose)** to **PostgreSQL (Prisma ORM)** has been implemented in the **`prisma`** branch.

### Highlights

- Prisma ORM
- PostgreSQL
- Relational database schema
- Nested relations
- Foreign key constraints
- Database migrations
- Seeding support

> **Note:** The deployed application currently uses the **MongoDB** implementation available on the `main` branch. The Prisma migration is available in the `prisma` branch.


## 👥 User Roles & Features

### 👨‍🎓 Student
- Sign up and login using Clerk
- Browse available courses
- Enroll in paid courses using Stripe
- Watch enrolled course lectures
- Track course progress
- Rate courses


### 👩‍🏫 Educator
- Create and publish courses
- Upload course thumbnails (Cloudinary)
- Add structured course content  
  **(Course → Sections → Lectures)**
- Set course pricing
- Manage own published courses


## 💳 Payment Flow

- One-time payment per course (no subscriptions)
- Secure Stripe Checkout
- Enrollment confirmation via **Stripe Webhooks**
- Prevents duplicate or invalid enrollments


## 🗂️ Project Structure (Monorepo)
SmartLearn/
├── frontend/ # React + Vite client
│ ├── src/
│ └── package.json
├── backend/ # Node + Express API
│ ├── src/
│ └── package.json
└── README.md


## 🔐 Security & Access Control

- Role-based access control (Student / Educator / Admin)
- Protected backend routes
- Secure payment verification using webhooks
- Environment variables for sensitive credentials
- No video files stored directly on the server

## 🧠 Key Learning Outcomes
This project demonstrates hands-on experience with:

- Full-stack application architecture
- Authentication & authorization using Clerk
- Payment integration with Stripe
- Media handling using third-party services
- Database design
- ORM usage with Prisma
- Admin dashboards & analytics
- Real-world deployment workflows
- Error handling and edge-case management


## 📌 Future Improvements

- Replace YouTube URLs with secure video hosting (Cloudinary / AWS S3)
- Add course completion certificates
- Improve analytics and reporting
- Instructor revenue breakdown
- Automated email notifications
- Add unit and integration tests

## 🧑‍💻 Author

**Habeeeba Khatoon**  
Full-Stack Developer (MERN)
