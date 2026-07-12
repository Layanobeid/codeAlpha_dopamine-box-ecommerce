# 🎁 Dopamine Box - E-commerce Platform

> A full-featured e-commerce platform for gift boxes, perfumes, mugs, and souvenirs.

![Dopamine Box](https://via.placeholder.com/1200x400/ff6b6b/ffffff?text=Dopamine+Box)

---

## ✨ Features

### 🛍️ User Features
- Browse products with categories & moods
- Add to cart with stock management
- Secure checkout
- Order tracking
- Wishlist
- User authentication (Register/Login)

### 👑 Admin Features
- Dashboard with statistics
- Product management (CRUD)
- Order management with status update
- User management
- Message system

### 🎨 Design
- Shopify-inspired UI
- Responsive design
- Smooth animations
- Premium glass-morphism effects

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Cloud) |
| **Authentication** | JWT, bcryptjs |
| **Real-time** | Socket.io |
| **Frontend** | Vanilla JS, CSS3, HTML5 |
| **Hosting** | Vercel (Frontend), Render (Backend) |

---

## 📂 Project Structure
dopamine-box-ecommerce/
├── client/
│ ├── assets/
│ │ ├── css/ # Styles
│ │ └── js/ # API calls, utilities
│ ├── components/ # Reusable components
│ ├── pages/ # HTML pages
│ └── index.html
├── server/
│ ├── controllers/ # Business logic
│ ├── models/ # MongoDB schemas
│ ├── routes/ # API endpoints
│ ├── services/ # Business services
│ ├── middleware/ # Auth, validation
│ └── scripts/ # Seed, admin creation
├── .env # Environment variables
├── package.json
└── README.md


---

## 🔐 Admin Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@dopaminebox.com` | `Admin@123456` |

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Layanobeid/dopamine-box-ecommerce.git
cd dopamine-box-ecommerce
