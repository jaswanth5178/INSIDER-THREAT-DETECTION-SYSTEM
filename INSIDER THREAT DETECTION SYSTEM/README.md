# 🚀 Insider Threat Detection System

A full-stack machine learning system to detect insider threats using anomaly detection, behavioral analytics, and risk scoring.

---

## 🧠 Features
- 🔍 Anomaly Detection using Isolation Forest
- 📊 Risk Score (0–100) with LOW / MEDIUM / HIGH levels
- 🧠 Temporal + Peer Behavior Analysis
- 🖥️ Admin Dashboard (React)
- 🚫 Block / Unblock Employees
- 📩 Assign to Analyst (Email Notification)
- 🔐 JWT Authentication

---

## 🛠️ Tech Stack
- Backend: FastAPI
- Frontend: React + Tailwind CSS
- Database: MySQL
- Machine Learning: Scikit-learn

---

## 📁 Project Structure

```
backend/
frontend/
```

---

## ⚙️ Setup Instructions

### 🔹 1. Extract Project

```bash
unzip INSIDER THREAT DETECTION SYSTEM.zip
cd INSIDER THREAT DETECTION SYSTEM
```

---

## 🖥️ Backend Setup

### 🔹 2. Create Virtual Environment

```bash
python -m venv venv
venv\Scripts\activate
```

---

### 🔹 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

### 🔹 4. Setup Environment Variables

Create `.env` file using `.env.example`

Example:

```
DB_URL=mysql+pymysql://root:password@localhost:3306/insider_threat_database
SECRET_KEY=your_secret_key

ADMIN_EMAIL=your_email@gmail.com
ADMIN_PASS=your_app_password
ANALYST_EMAIL=analyst_email@gmail.com
```

---

### 🔹 5. Setup Database

```sql
CREATE DATABASE insider_threat_database;
```

Import dump:

```bash
mysql -u root -p insider_threat_database < insider_threat.sql
```

---

### 🔹 6. Run Backend

```bash
uvicorn app:app --reload
```

👉 Backend running at: http://localhost:8000

---

## 🎨 Frontend Setup

### 🔹 7. Go to frontend

```bash
cd frontend
```

---

### 🔹 8. Install Dependencies

```bash
npm install
```

---

### 🔹 9. Run Frontend

```bash
npm run dev
```

👉 Frontend running at: http://localhost:5173

---

## 🔐 Demo Credentials

```
username: admin
password: admin1243
```

---

## 🔁 Alternative (Without DB Dump)

If database is empty, run:

```bash
python merge_data.py
python clean_data.py
python temporal_features.py
python peer_features.py
python base_features.py
python predict_anomaly.py
```

---

## 🧠 System Flow

```
Raw Logs → Clean Data → Feature Engineering → ML Model → Risk Score → Dashboard
```

---

## 📌 Notes
- Ensure MySQL is running
- Update `.env` file correctly
- Use DB dump for faster setup

---

## 👨‍💻 Authors
Jaswanth, Azfar, Vishnu, Mahamood

---

## 💡 Interview Highlight

"I designed a modular insider threat detection system with a hybrid risk scoring engine combining anomaly detection, temporal behavior, and peer analysis."
