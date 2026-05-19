# 🏥 MidLink Healthcare Platform

An enterprise-level, intelligent digital healthcare ecosystem tailored for modern medical service delivery. **MidLink** seamlessly bridges the gap between patients, verified medical professionals, and administrators by uniting advanced real-time scheduling, secure WebRTC consultations, AI-powered triage, and rigorous credential verification within a single, high-performance platform.

---

## 🚀 Key Features Matrix

### 🔐 1. Role-Based Access Control & Security

- **Multi-Tier Identity Management:** Dedicated dashboards and completely isolated linear workflows for **Patients**, **Doctors**, and **System Administrators**.
- **Secure Authentication:** Token-based authentication powered by `JSON Web Tokens (JWT)` and `bcrypt` password hashing, securely transported via stateful, `HttpOnly` cross-site cookies.

### 👨‍⚕️ 2. Bulletproof Doctor Onboarding & Admin Verification

- **Mandatory CV Validation (Backend Firewall):** A secure document upload pipeline using `Multer`. Doctors cannot complete registration without providing a valid medical license/CV in PDF format—validated strictly at both frontend and database controller levels.
- **Administrative Credentials Review:** A professional dashboard for administrators to view pending applications, inspect uploaded PDF certificates instantly via custom tab view portals, and toggle verification flags (`Verify` / `Revoke Access`).
- **Automated Mailing Workflow:** Triggered back-end notifications via `Nodemailer` that dynamically send official confirmation or update emails to doctors upon admin review.

### ⏳ 3. Smart Cancellation Lifecycle & Automated Waiting List (Real-Time)

- **The 24-Hour Rule Policy:** Calculated precisely via a timezone-aware time engine. If a patient cancels a booking more than 24 hours in advance, the slot is instantly freed with full eligibility for a refund. Inside the 24-hour window, the interface triggers a high-visibility warning indicating non-refundable terms.
- **Atomic DB Operations (ACID Transactions):** Seamlessly executes status updates across multiple interrelated entities—marking appointments as `CANCELLED`, freeing the slot in `doctor_availability` (`is_booked = FALSE`), and recording financial updates in a single workflow.
- **WebSocket Waiting List Pull:** The moment a slot is freed, a real-time reactive trigger queries the `waiting_list` table and immediately broadcasts a `Socket.io` notification update exclusively to rooms belonging to waitlisted patients, enabling them to grab the slot instantly.

### 🧠 4. AI-Powered Medical Triage & Symptom Checker

- **Natural Language Processing (NLP) Intake:** Patients can freely describe their clinical complaints in plain Arabic or English text.
- **Intelligent Specialist Routing:** Powered by an integrated AI model framework (`aiController.js`) that analyzes symptoms, intercepts medical emergencies to display high-priority warning screens, and auto-recommends the most accurate clinical specialty to eliminate misbooking overhead.

### 📊 5. Interactive Medical Workspace & Dashboards

- **Doctor Clinical Overview:** Real-time metrics showing total daily bookings, total revenue, and cumulative rating aggregates. Includes interactive glassmorphism analytical graphs drawn using `Recharts (AreaChart)`.
- **Patient Health Passport:** A robust dashboard containing vitals (blood group, allergies, chronic conditions) alongside a historical tabular log of all consultations.
- **Digital Medical Invoicing & Prescriptions:** Automatically generates and processes custom clinical documents exported directly as beautifully structured PDFs via `jsPDF` for patients upon session completion.

### 💬 6. Threaded Q&A and Feedback System

- Fully integrated interactive discussion review boards on doctor profiles allowing patients to leave multi-criteria structured reviews and submit questions. Doctors receive instant push updates and can reply directly in a nested thread structure.

---

## 🛠️ Tech Stack & Architecture

### Frontend Layer

- **Core Framework:** React.js (Single Page Application architecture)
- **State Management:** Redux Toolkit (Slices for asynchronous authentication and appointments pipeline)
- **Styling Framework:** Tailwind CSS (Highly modern sleek glassmorphic UI design)
- **Real-time Engine:** Socket.io-client
- **Icons & Animation:** Lucide React & Framer Motion

### Backend Layer

- **Runtime Environment:** Node.js (v20+ execution)
- **Application Framework:** Express.js (Modular architectural controllers & routing)
- **Database Engine:** PostgreSQL (Relational multi-table normalization)
- **Real-time Gateway:** Socket.io WebSockets Integration
- **Mail Server Gateway:** Nodemailer SMTP Integration

---

## 🏁 Getting Started

### 📋 Prerequisites

Ensure you have the following installed on your target deployment machine:

- **Node.js** (v20 or higher)
- **npm** (v10 or higher)
- **PostgreSQL Server** (v15 or higher)
