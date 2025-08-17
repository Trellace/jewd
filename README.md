# Doxxed 

**Doxxed is a globe-based community bulletin board that makes local conversation simple and visual**

By choosing an emoji avatar, anyone can instantly post a note that appears at their location. Whether it’s asking for help, offering something useful, or sharing a quick update, posts are authentic, time-sensitive, and grounded in place. With ephemeral notes that auto-expire, Doxxed keeps the feed fresh, relevant, and focused on what’s happening nearby—fast, lightweight, and real.

---

## Features



<img src="https://github.com/user-attachments/assets/97119943-f245-4c51-b25b-fe48b8fd060a" width="250" height="250"/>



-  **Globe UI** – Spin and zoom to see activity.
-  **Emoji avatar system** – Pick your emoji identity.
-  **Ephemeral posts** – Notes auto-expire, keeping the feed fresh and lightweight.
-  **Anonymous & private** – No personal info, just your emoji.

---

## Tech Stack
- **Frontend:** [Next.js](https://nextjs.org/), React, TailwindCSS
- **Backend:** Node.js / Express + MongoDB
- **APIs/Services:** Mapbox (globe + maps), ipapi (geolocation)

---

## Getting Started

### 1. Clone the repository

git clone (https://github.com/Trellace/jewd.git)

### 2. Install dependencies
Frontend:

```bash
cd frontend
npm install
npm run dev
```
Backend:
```bash
cd backend
npm install
npm run dev
```
### 3. Environment variables
Create a .env file in both frontend/ and backend/ directories:

```bash
# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# MongoDB
MONGODB_URI=your_mongo_uri
```
---

## Usage
- **Start** frontend (npm run dev in /frontend)
- **Start** backend (npm run dev in /backend)
- **Open** http://localhost:3000
- **Select** an emoji avatar
- **Create a post** → it appears on the globe at your city location

---

## Contributing
- This repository is private.
- No external contributions are accepted outside the JEWD team.

---

## License
- Core project: Private (all rights reserved)
- Lucide Icons: MIT License

---

## AI Use
- AI was used as an assistant tool throughout development to help generate boilerplate and bug fixes occasionally.

---

## Credits
- Developed by **JEWD**

---
