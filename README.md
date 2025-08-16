# Doxxed 

**Doxxed makes local conversation visual.**  
Choose an emoji avatar, type your note, and it pops up where you are — at **city-level privacy**.  
It’s the fastest way to **ask, offer, and share** — authentic, real, unfiltered, and grounded in place.

---

## Features



<img src="https://github.com/user-attachments/assets/97119943-f245-4c51-b25b-fe48b8fd060a" width="250" height="250"/>



-  **Globe UI** – Spin and zoom to see activity by place (powered by Mapbox).
-  **Emoji avatar system** – Pick your emoji identity with zero sign-up friction.
-  **Ephemeral posts** – Notes auto-expire, keeping the feed fresh and lightweight.
-  **Anonymous & private** – No personal info, just your emoji + city-level location.

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
