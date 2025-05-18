# 🇷🇼 SomaGov Frontend

SomaGov is a citizen engagement platform designed to help Rwandan citizens report public service issues and track their resolution through government agencies. This is the **frontend** built using **Next.js (App Router)** and **Tailwind CSS**, styled in accordance with Rwanda's official web color guidelines (white + blue).

---

## ✨ Features

- 🔐 JWT-based authentication
- 📝 Citizen registration and login
- 📩 Submit and track complaints
- 🏛 Admin & agency dashboard to manage complaints
- 🎨 Clean government-style UI using Tailwind CSS
- 🌐 Responsive design (mobile-friendly)

---

## 📁 Folder Structure

```

somagov-frontend/
├── app/                 # App Router pages (home, login, register, complaints)
│   ├── page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── complaints/
│   │   ├── page.tsx         # List my complaints
│   │   ├── new/page.tsx     # Submit complaint
│   │   └── \[id]/page.tsx    # View single complaint
│   └── admin/
│       └── complaints/page.tsx  # Admin dashboard
├── components/          # Reusable UI components
├── utils/
│   └── api.ts           # API wrapper for calling backend
├── public/              # Static assets
├── styles/
│   └── globals.css
├── tailwind.config.ts
├── tsconfig.json
├── .env.local           # Environment variables
└── README.md

````

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/somagov-frontend.git
cd somagov-frontend
````

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE=http://localhost:8000/api
```

> Replace with your deployed backend API if needed.

### 4. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧠 API Integration

This frontend connects to the SomaGov backend built in Go. It uses:

* `/api/auth/register` – Register a new user
* `/api/auth/login` – Login to get JWT
* `/api/complaints` – Submit complaint
* `/api/complaints/mine` – View my complaints
* `/api/admin/complaints` – Admin view of complaints

All requests use `apiRequest()` from `utils/api.ts`, with optional JWT token.

---

## 🧪 Development Notes

* UI is styled using Tailwind CSS, following Rwandan government aesthetics (white background, blue accents)
* App Router (`app/` directory) is used for routing
* Pages are responsive for mobile and desktop use
* JWT is stored in `localStorage` for simplicity (can be upgraded to cookies or NextAuth)

---

## 📘 License

Under development — intended for public/government service use. Just entendend to serve the public.

---

## 👨‍💻 Author

**Mr-Ndi** – [LinkedIn](https://www.linkedin.com/in/mr-ndi/)

---

## 🤝 Contributions

Suggestions, PRs, or UI improvements welcome! Help make SomaGov better for all.

