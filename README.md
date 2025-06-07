# 🏡 Real Estate Web Platform

A full-stack web application enabling individuals and real estate agencies to list, manage, and discover properties for sale or rent.

## 📌 Project Overview

This platform addresses inefficiencies in property listing and discovery by centralizing listings from individuals and agencies. Users can:

* Create and manage profiles
* List properties with detailed info and photos
* Filter and search listings by type, location, and price
* Schedule property tours with agencies
* Communicate via a built-in messaging system

## 🚀 Features

### 🧑‍💼 For Individuals

* Register/login with secure authentication
* Add, edit, or remove property listings
* Browse all available properties
* Request tours and message owners
* use the integrated messaging system 

### 🏢 For Agencies

* Create agency profiles
* Manage multiple property listings
* View and respond to tour requests
* Track listing performance
* use the integrated messaging system

### 🛠 Admin Features

* Monitor users and listings
* Remove flagged or inappropriate content
* Approve or reject new agency registrations
* View and manage reported messages or tour requests
* Access dashboard with user and property statistics

## 🛠 Tech Stack

**Frontend:** React
**Backend:** Node.js + Express
**Database:** MySQL (via Prisma ORM)
**Authentication:** JWT

## 📂 Folder Structure

```plaintext
client/             # React frontend
  └── src/
      └── components/
      └── context/
      └── routes/

Api/             # Node.js backend
  └── controllers/
  └── lib/
  └── middleware/
  └── prisma/
  └── routes/

Socket/             # socket.io
└── App.js
```

## 🧪 How to Run Locally

### 1. Clone the Repository

```bash
git clone "----"
cd real-estate-platform
```

### 2. Start Backend

```bash
cd server
npm install
npx prisma generate
nodemone App.js
```

### 3. Start Frontend

```bash
cd client
npm install
npm run dev
```

### 3. socket.io server 

```bash
cd socket
npm install
nodemone App.js

## 📌 Future Improvements

* AI-powered recommendations
* Payment module for premium listings
* Multi-language support (Arabic/French)

## 🧑‍🎓 Author

**Fares Tinakiche**
3rd Year Computer Science Student, Higher Institute of Sciences
Supervised by: Prof. Kheira Lakhdari
Erasmus+ Alumni | Passionate about solving real-world problems with code

