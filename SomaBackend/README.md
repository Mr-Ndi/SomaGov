# 🏛️ SomaGov

SomaGov is a citizen engagement platform that enables the public to submit feedback or complaints to government agencies. It categorizes, routes, and tracks tickets while allowing administrators to respond effectively — tailored specifically for use in Rwanda.

---

## ✨ Features

- 🔐 User registration and login
- 🏢 Agency and category management
- 📩 Submit and track complaints
- 📁 Upload attachments
- 🗂️ Role-based access (Admin, Agency Staff, Citizen)
- 🧭 RESTful API with JWT authentication
- 📦 Built with Go + Gin + PostgreSQL + GORM

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/SomaBackend.git
cd SomaBackend
````

### 2. Setup environment variables

Create a `.env` file:

```env
DATABASE_URL=postgres://<user>:<password>@<host>/<dbname>?sslmode=require
```

Or use individual values if preferred:

```env
DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
DB_SSLMODE=require
```

### 3. Run locally with Air (for development)

Make sure you have [Air](https://github.com/cosmtrek/air) installed.

```bash
air
```

### 4. Or run manually

```bash
go mod tidy
go run main.go
```

---

## 📦 Build for Production

```bash
go build -tags netgo -ldflags "-s -w" -o app
./app
```

For Render, set the following in `render.yaml`:

```yaml
buildCommand: go build -tags netgo -ldflags "-s -w" -o app
startCommand: ./app
```

---

## 📁 Folder Structure

```
SomaBackend/
├── config/        # DB connection and env setup
├── controllers/   # Route handlers
├── middleware/    # Auth, logging
├── models/        # GORM models
├── routes/        # API route definitions
├── services/      # Business logic
├── uploads/       # File uploads
├── utils/         # Helper functions
├── main.go        # Entry point
└── .env           # Environment config
```

---

## 🧪 API Endpoints (Sample)

* `POST   /api/register` – Register a user
* `POST   /api/login` – Login and get JWT token
* `POST   /api/complaints/` – Submit a complaint
* `GET    /api/complaints/mine` – List my complaints
* `GET    /api/complaints/:id` – View a complaint
* `GET    /api/agencies` – List agencies
* `GET    /api/categories` – List categories

---

## 🇷🇼 Localization

SomaGov is designed with Rwanda in mind. Agencies, categories, and complaint logic can be easily customized for other governments or use cases.

---

## 📜 License

MIT License

---

## 👨‍💻 Author

**Mr-Ndi** – [@your-twitter-or-link](#)

```

---

Let me know if you'd like a version that includes badges, Swagger docs, Docker instructions, or if you're planning to open-source it — I can tailor it further.
```
