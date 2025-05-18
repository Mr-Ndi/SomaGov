# 🏛️ SomaGov

SomaGov is a citizen engagement platform that enables the public to submit feedback or complaints to government agencies. It categorizes, routes, and tracks tickets while allowing administrators to respond effectively — tailored specifically for use in Rwanda.

---

## ✨ Features

- 🔐 User registration and login
- 🏢 Agency and category management
- 📩 Submit and track complaints
- 📁 Upload attachments
- 🗂️ Role-based access (Admin, Agency Staff, Citizen)
- 🧠 AI-powered complaint categorization, translation, and sentiment analysis
- 🧭 RESTful API with JWT authentication
- 📦 Built with Go + Gin + PostgreSQL + GORM

### Translation Service
The platform includes a powerful translation service that can translate text between different languages. This feature is particularly useful for:
- Translating official documents
- Making government services accessible to non-native speakers
- Supporting multilingual communication

To use the translation service, you'll need to:
1. Set up your OpenAI API key in the environment variables
2. Make a request to the translation endpoint

Example translation request:
```json
{
    "text": "Hello, how can I help you?",
    "from_lang": "English",
    "to_lang": "Somali"
}
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/SomaBackend.git
cd SomaBackend
```

### 2. Setup environment variables

Create a `.env` file:

```env
DATABASE_URL=postgres://<user>:<password>@<host>/<dbname>?sslmode=require
HUGGINGFACE_TOKEN=your_huggingface_api_token
OPENAI_API_KEY=your_openai_api_key
```

Or use individual values if preferred:

```env
DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
DB_SSLMODE=require
HUGGINGFACE_TOKEN=your_huggingface_api_token
OPENAI_API_KEY=your_openai_api_key
```

> 💡 `HUGGINGFACE_TOKEN` is used for AI features like complaint categorization and sentiment analysis.
> 💡 `OPENAI_API_KEY` is used for the translation service.

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
├── controllers/   # Route handlers (auth, complaints, admin, etc.)
├── middleware/    # Auth, logging
├── models/        # GORM models (User, Complaint, etc.)
├── routes/        # API route definitions grouped by module
│   ├── auth.go
│   ├── complaint.go
│   ├── admin.go
│   └── ...
├── services/      # Business logic (including AI integration)
├── uploads/       # File uploads
├── utils/         # Helper functions
├── main.go        # Entry point
└── .env           # Environment config
```

---

## 📘 How to Get Your AI API Keys

### 1. 🔐 Hugging Face API Token

- Go to: [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
- Click **"New token"**
- Give it a name (e.g., `somagov-ai`)
- Set role: **"Read"**
- Copy the token and add it to your `.env` file as:

```env
HUGGINGFACE_TOKEN=your_generated_token_here
```

### 2. 🗣 OpenAI API Key

- Go to: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Click **"Create new secret key"**
- Give it a name (e.g., `somagov-translation`)
- Copy the key and add it to your `.env` file as:

```env
OPENAI_API_KEY=your_generated_key_here
```

### 3. 🗣 LibreTranslate

You're using a public instance:

```
https://translate.argosopentech.com/translate
```

If you want to **self-host** LibreTranslate:

- Docker Image: [https://github.com/LibreTranslate/LibreTranslate](https://github.com/LibreTranslate/LibreTranslate)
- Replace the URL in your `.env` or `ai_service.go` config.

---

## 🧪 API Endpoints (Sample)

* `POST   /api/register` – Register a user
* `POST   /api/login` – Login and get JWT token
* `POST   /api/complaints/` – Submit a complaint
* `GET    /api/complaints/mine` – List my complaints
* `GET    /api/complaints/:id` – View a complaint
* `GET    /api/agencies` – List agencies
* `GET    /api/categories` – List categories
* `POST   /api/ai/translate` – Translate text between languages

---

## 🇷🇼 Localization

SomaGov is designed with Rwanda in mind. Agencies, categories, and complaint logic can be easily customized for other governments or use cases.

---

## 📜 License

Under development

---

## 👨‍💻 Author

**Mr-Ndi** – [https://www.linkedin.com/in/mr-ndi/](#)
