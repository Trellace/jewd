# Doxxed 

**Doxxed is a globe-based community bulletin board that makes local conversation simple and visual**

By choosing an emoji avatar, anyone can instantly post a note that appears at their location. Whether it’s asking for help, offering something useful, or sharing a quick update, posts are authentic, time-sensitive, and grounded in place. With ephemeral notes that auto-expire, Doxxed keeps the feed fresh, relevant, and focused on what’s happening nearby—fast, lightweight, and real.

---

## Features

<table>
  <tr>
    <td align="center" width="300">
      <sub><b>Emoji avatar system</b></sub><br/>
      <img src="https://github.com/user-attachments/assets/e291c86b-9f21-499b-a6ee-0e968175a8ef" width="250" height="250"/>
    </td>
    <td align="center" width="300">
      <sub><b>Satellite switch</b></sub><br/>
      <img src="https://github.com/user-attachments/assets/aae5bf1e-9070-4c5b-8453-7eb0e95ddfa5" width="250" height="250"/>
    </td>
    <td align="center" width="300">
      <sub><b>Recentre to your "Doxxed" Position</b></sub><br/>
      <img src="https://github.com/user-attachments/assets/3e224d97-65af-4187-a3e7-fa28faf48e93" width="250" height="250"/>
    </td>
  </tr>
</table>












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
NEXT_PUBLIC_MONGODB_URI=your_mongo_uri
```
---

## Usage
- **Start** frontend (npm run dev in /frontend)
- **Open** http://localhost:3000
- **Select** an emoji avatar
- **Create a message** → it appears on the globe at your city location

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
