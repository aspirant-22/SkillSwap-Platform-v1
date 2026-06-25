# 🚀 SkillSwap – Learn, Teach & Grow Together

![MERN Stack](https://img.shields.io/badge/MERN-FullStack-success)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Node.js](https://img.shields.io/badge/Backend-Node.js-brightgreen)
![Express.js](https://img.shields.io/badge/Framework-Express.js-black)
![Status](https://img.shields.io/badge/Status-Live-success)

> **A community-driven platform where people exchange skills instead of money, making learning accessible, collaborative, and impactful.**

---

## 🌐 Live Demo

🔗 **Deployed Application:**
[SkillSwap Platform](https://skillswap-platform-v1.onrender.com/)

📂 **GitHub Repository:**
https://github.com/aspirant-22/SkillSwap-Platform-v1

---

# 📖 Overview

SkillSwap is a full-stack MERN application designed to solve a real-world challenge: **making quality learning accessible without financial barriers.**

Instead of paying for expensive courses, users can connect with individuals who possess complementary skills and engage in mutually beneficial skill exchanges.

Whether you're a developer wanting to learn UI/UX, a designer interested in Data Science, or a student looking to improve communication skills, SkillSwap helps you find the perfect learning partner.

---

# 🎯 Problem Statement

Millions of learners face challenges such as:

* High course fees
* Lack of personalized mentorship
* Difficulty finding learning partners
* Limited networking opportunities
* Fragmented learning communities

At the same time, skilled individuals are willing to share knowledge but lack a structured platform to connect with learners.

---

# 💡 Solution

SkillSwap creates a collaborative ecosystem where:

✅ Users offer skills they possess

✅ Users request skills they want to learn

✅ Learning partnerships are formed through skill exchange

✅ Communities grow through peer-to-peer mentorship

✅ Education becomes more affordable and accessible

---

# ✨ Key Features

## 👤 User Management

* Secure Authentication
* User Registration & Login
* Public/Private Profiles
* Profile Image Uploads
* Personalized Skill Profiles

## 🎯 Skill Discovery

* Browse Public Profiles
* Search Users by Skills
* Availability Filters
* Discover Relevant Learning Partners

## 🤝 Skill Swap Requests

* Send Swap Requests
* Accept / Reject Requests
* Track Swap Status
* Manage Ongoing Exchanges

## ⭐ Feedback & Ratings

* Leave Ratings
* Provide Feedback
* Build Community Trust
* Improve User Credibility

## 📢 Platform Announcements

* Admin-created announcements
* Platform updates
* Community notices

## 🛡️ Admin Dashboard

* Manage Users
* Ban / Unban Users
* Monitor Swap Requests
* Create Platform Messages
* Generate Reports

## 📊 Reporting System

* User Reports
* Swap Reports
* Feedback Reports
* CSV Export Functionality

---

# 🚀 Unique Selling Points (USPs)

### 🔄 Learn Without Paying

Users exchange skills instead of purchasing costly courses.

### 🌍 Community-Driven Growth

Encourages collaboration and knowledge sharing.

### 🤝 Two-Way Value Creation

Every user can simultaneously be a learner and a mentor.

### ⭐ Trust-Based Ecosystem

Ratings and feedback encourage high-quality interactions.

### 📈 Professional Networking

Build meaningful connections while learning.

### 🎓 Lifelong Learning Platform

Promotes continuous upskilling in an affordable way.

---

# 🏗️ System Architecture

```text
Client (EJS + Bootstrap)
            │
            ▼
     Express.js Server
            │
            ▼
 Authentication Layer
   (Passport.js)
            │
            ▼
      MongoDB Atlas
            │
            ▼
       Cloudinary
   (Profile Images)
```

# 🛠️ Tech Stack

## Frontend

* EJS
* HTML5
* CSS3
* Bootstrap 5
* JavaScript

## Backend

* Node.js
* Express.js

## Database

* MongoDB Atlas
* Mongoose

## Authentication

* Passport.js
* Passport Local Strategy
* Express Session
* Connect Mongo

## Cloud Services

* Cloudinary

## Deployment

* Render / Vercel
* GitHub

---

# 📊 Database Models

### User

* Username
* Email
* Skills Offered
* Skills Wanted
* Availability
* Profile Photo
* Rating
* Role
* Ban Status

### Swap

* Sender
* Receiver
* Offered Skill
* Requested Skill
* Status
* Completion Tracking

### Feedback

* Rating
* Review Message
* Giver
* Receiver

### Admin Message

* Title
* Message Content
* Created By

---

# 🔒 Security Features

* Password Hashing & Salting
* Session-Based Authentication
* Route Protection Middleware
* Role-Based Access Control
* Admin Authorization
* Secure Image Storage

---

# 🌟 Real World Impact

SkillSwap directly contributes to:

* 🎓 Quality Education
* 🤝 Knowledge Sharing
* 📈 Professional Growth
* 🌍 Community Development
* 💼 Career Advancement

By eliminating financial barriers and enabling peer-to-peer learning, SkillSwap democratizes access to education and opportunities.

---

# 🚀 Future Enhancements

* AI-Powered Skill Matching
* Real-Time Chat System
* Video Mentorship Sessions
* Learning Progress Tracking
* Achievement Badges
* Recommendation Engine
* Mobile Application
* Community Discussion Forums
* Skill Verification System
* AI Learning Roadmaps

---

# 📸 Screenshots

## Home Page

<img width="500" height="500" alt="Screenshot 2026-06-25 115903" src="https://github.com/user-attachments/assets/6bf66ccf-4981-4a99-8b11-a703d71a76ae" />


## User Profile

<img width="500" height="500" alt="Screenshot 2026-06-25 120115" src="https://github.com/user-attachments/assets/6165278f-63b4-40d5-ab81-48ebad50a434" />

## Swap Requests

<img width="500" height="500" alt="Screenshot 2026-06-25 120425" src="https://github.com/user-attachments/assets/8bc4848a-9ec1-42e6-975f-be262523ee20" />


## Admin Dashboard

<img width="500" height="500" alt="Screenshot 2026-06-25 120756" src="https://github.com/user-attachments/assets/d6261c88-e01e-4b51-98d9-7d8473e3fe8f" />
<img width="500" height="500" alt="Screenshot 2026-06-25 120736" src="https://github.com/user-attachments/assets/6a96aff9-7cf9-46d4-a929-3a799ff00625" />
<img width="500" height="500" alt="Screenshot 2026-06-25 121456" src="https://github.com/user-attachments/assets/48bc50d9-2ccf-476a-934c-ee67cee74cc8" />


# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/SkillSwap.git
```

## Navigate to Project

```bash
cd SkillSwap
```

## Install Dependencies

```bash
npm install
```

## Configure Environment Variables

Create a `.env` file:

```env
ATLASDB_URL=your_mongodb_connection_string

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

SECRET=your_session_secret
```

## Run Application

```bash
npm start
```

or

```bash
nodemon app.js
```

---

# 👨‍💻 Developer

### Gargi

Full Stack Developer

Built SkillSwap end-to-end, including:

* System Design
* Database Modeling
* Backend Development
* Frontend Development
* Authentication
* Admin Dashboard
* Cloud Integration
* Deployment

---

# 📜 License

This project is licensed under the MIT License.

---

# ⭐ Why SkillSwap?

> **Knowledge grows when shared.**

SkillSwap transforms learning into a collaborative experience where individuals teach, learn, connect, and grow together.

Instead of competing for opportunities, SkillSwap empowers communities to create opportunities through shared knowledge.
