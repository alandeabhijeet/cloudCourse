

# 🧠 cloudCourse

cloudCourse is a full-stack course selling web application with user authentication, course management, secure payments using Razorpay, and buyer/owner dashboards.

---

## 🏗️ Project Structure

```
cloudCourse/
│
├── backend/
│   ├── auth/        # User authentication & authorization
│   ├── course/      # Course creation, listing, ownership, and purchase
│   ├── payment/     # Razorpay payment integration
│
└── frontend/        # React frontend
```

---

## 🚀 Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Payments**: Razorpay
- **Authentication**: JWT, bcrypt

---

## 📦 Backend Microservices

### 1️⃣ Auth Service (`/api/auth`)

Handles user authentication, role verification, course assignments.

**Routes:**

| Method | Endpoint                         | Description                          |
|--------|----------------------------------|--------------------------------------|
| POST   | `/signup`                        | Register a new user                  |
| POST   | `/login`                         | Login and receive a JWT              |
| POST   | `/logout`                        | Logout user (blacklist JWT)          |
| GET    | `/checkowner`                    | Check if user owns any courses       |
| GET    | `/checkbuyer`                    | Check if user bought any courses     |
| DELETE | `/deleteowneridfromuser`         | Remove a course from owned list      |
| GET    | `/sendcoursebuyerid`             | Get all courses bought by user       |
| GET    | `/sendcourseownerid`             | Get all courses owned by user        |
| GET    | `/verify-token`                  | Check if token is valid              |
| POST   | `/add-owner-course`              | Add course ID to user as owner       |
| POST   | `/add-buy-course`                | Add course ID to user as buyer       |

### Models:

- **User**
  ```js
  {
    username: String,
    password: String,
    buy_course: [ObjectId],
    owner: [ObjectId]
  }
  ```

- **BlacklistToken**
  ```js
  {
    token: String,
    expires: 24h
  }
  ```

---

### 2️⃣ Course Service (`/api/course`)

Manages course creation, retrieval, updates, and filtering by role.

**Routes:**

| Method | Endpoint               | Description                             |
|--------|------------------------|-----------------------------------------|
| GET    | `/items`              | Get all available courses               |
| GET    | `/item/:id`           | Get details of a course by ID           |
| POST   | `/item`               | Create a new course                     |
| PUT    | `/item/:id`           | Update a course                         |
| DELETE | `/item/:id`           | Delete a course                         |
| GET    | `/items/buy`          | List all courses bought by user         |
| GET    | `/items/owner`        | List all courses owned by user          |

### Model:

- **Course**
  ```js
  {
    title: String,
    details: String,
    category: String,
    available: Boolean
  }
  ```

---

### 3️⃣ Payment Service (`/api/payment`)

Handles Razorpay orders and verification.

**Routes:**

| Method | Endpoint             | Description                          |
|--------|----------------------|--------------------------------------|
| POST   | `/create-order`     | Create a Razorpay order              |
| GET    | `/verify-payment`   | Verify Razorpay payment signature    |

---

## 🧑‍💻 Frontend

Frontend is built using **React.js** and communicates with backend via:

- `/api/auth`
- `/api/course`
- `/api/payment`

Key Features:

- User signup, login, and logout
- Role-based UI for buyers and owners
- Add and manage courses (owners)
- Buy courses (buyers)
- Payment UI with Razorpay integration
- View purchased/owned courses

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/alandeabhijeet/cloudCourse.git
cd cloudCourse
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

Run the backend:

```bash
npm start
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

---

## 📌 API Prefixes

| Service   | Path Prefix     |
|-----------|-----------------|
| Auth      | `/api/auth`     |
| Course    | `/api/course`   |
| Payment   | `/api/payment`  |

---

## 📮 Contact

For any issues or improvements, feel free to create an [issue](https://github.com/alandeabhijeet/cloudCourse/issues) or submit a PR!

---
