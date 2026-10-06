# 👶 Baby Tracker

A modern, responsive, privacy-focused online web application for parents and caregivers to track diaper changes, feedings, sleep routines, growth milestones, and health events. Built for multi-child households with granular co-parenting permissions, live stopwatches, and zero email dependencies.

---

## ✨ Features

- **👶 Multi-Child Architecture**: Switch between siblings or twins instantly with isolated logs, daily summaries, and health history.
- **🔐 Granular Co-Parenting & Roles**:
  - Grant access to one, several, or all children.
  - Three distinct roles: **Parent** (full control), **Caregiver** (logging & viewing), and **Viewer** (read-only for grandparents/family).
- **📋 Manual Invite Links (WhatsApp/SMS)**:
  - Generate one-click shareable links without configuring SMTP or sending emails.
  - Supports inviting co-parents to existing children OR allowing new users to create their own baby profile during onboarding.
- **⏱️ Live Active Timers**:
  - **Breastfeeding**: Left vs. right breast stopwatch with one-tap side switching.
  - **Sleep**: Real-time sleep duration tracker.
- **⚡ One-Tap Quick Logs**:
  - 🍼 Bottle intake (volume & milk type)
  - 🧷 Diapers (wet/dirty/both, rash alerts)
  - 🤱 Nursing (manual or timer)
  - 💤 Sleep (manual or timer)
  - 🥛 Pumping volume
  - 🥣 Solids & first foods
  - 🌡️ Temperature & medications (dosage & timestamps)
  - 📏 Growth metrics & milestones (with confetti celebrations!)
- **📊 Analytics & Trends**: 7-day trend visualizations for sleep, milk intake, and diapers using Recharts.
- **🛡️ Admin Dashboard (`/admin`)**: System-wide user management, password resets, and permission auditing.
- **📱 Mobile First**: Responsive layout designed for phones, tablets, and desktops.
- **📅 Standardized Dates**: Consistent `DD/MM/YYYY` formatting across the entire app.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts & Canvas-Confetti
- **Deployment**: Docker, GHCR, Portainer, Nginx Proxy Manager

---

## 🐳 Docker & Portainer Deployment

### Docker Compose

```yaml
version: '3.8'

services:
  baby-tracker:
    image: ghcr.io/yosefxk/baby-tracker:latest
    container_name: baby-tracker
    restart: unless-stopped
    ports:
      - "3103:3000"
    environment:
      - PORT=3000
      - NODE_ENV=production
      - APP_URL=https://your-domain.example.com
      - NEXT_PUBLIC_APP_URL=https://your-domain.example.com
    volumes:
      - baby_tracker_data:/app/data

volumes:
  baby_tracker_data:
    name: baby_tracker_data
```

### Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Container internal listening port | `3000` |
| `NODE_ENV` | Runtime environment | `production` |
| `APP_URL` | Canonical public URL used for invite links | `http://localhost:3103` |
| `NEXT_PUBLIC_APP_URL` | Client-accessible canonical public URL | `http://localhost:3103` |

---

## 💻 Local Development

```bash
git clone https://github.com/yosefxk/baby-tracker.git
cd baby-tracker
npm install
npm run dev
```

Visit [http://localhost:3103](http://localhost:3103) in your browser.
