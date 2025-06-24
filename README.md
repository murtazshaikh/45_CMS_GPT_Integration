# 📘 CMS GPT Integration

This is a backend-only CMS enhancement project that integrates OpenAI's GPT API to auto-generate SEO metadata and perform efficient bulk content updates. Built with Next.js API routes, MongoDB, JWT authentication, and OpenAI GPT-3.5 Turbo.

---

## 🚀 Features

- ✅ Auto-generate `meta_title`, `meta_description`, and `keywords` for any CMS page
- ✅ Bulk update multiple pages using a shared GPT prompt to reduce token usage
- ✅ Auth system with access + refresh JWT tokens
- ✅ MongoDB cloud database integration
- ✅ OpenAI fallback handling for API stability

---

## 🛠 Tech Stack

- Next.js (API Routes only, no frontend)
- MongoDB (Cloud)
- JWT Authentication
- OpenAI API (gpt-3.5-turbo)
- Postman for API testing

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/murtazshaikh/45_CMS_GPT_Integration.git
cd 45_CMS_GPT_Integration
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root with the following:

```
MONGODB_URI=your_mongo_connection_string
OPENAI_API_KEY=your_openai_key
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

### 4. Start the Development Server

```bash
npm run dev
```

Server runs at: [http://localhost:3000](http://localhost:3000)

---

## 🔐 API Endpoints

### ✅ Auth

| Method | Endpoint               | Description            |
|--------|------------------------|------------------------|
| POST   | `/api/auth/register`   | Register a new user    |
| POST   | `/api/auth/login`      | Login & get tokens     |

### 📄 CMS Pages

| Method | Endpoint                            | Description                                 |
|--------|-------------------------------------|---------------------------------------------|
| POST   | `/api/pages/create`                 | Create a new CMS page                       |
| POST   | `/api/pages/:id/seo/generate`       | Generate metadata using GPT for one page    |
| POST   | `/api/pages/bulk-update`            | Update multiple pages using a shared prompt |

---

## 📬 Example Payloads

### `/api/pages/create`

```json
{
  "title": "Top 10 Things to Do in Bali",
  "content": "Temples, beaches, and travel tips.",
  "category": "Travel"
}
```

### `/api/pages/bulk-update`

```json
{
  "ids": ["<pageId1>", "<pageId2>"],
  "prompt": "Improve SEO and simplify content"
}
```

---

## 🧪 Postman Collection

You can import the included `postman_collection.json` file in Postman to test all endpoints.

---

## 📎 Notes

- This project uses OpenAI in token-efficient batch mode for bulk updates.
- It includes fallback handling for GPT failures or invalid responses.
- All routes are protected using `Authorization: Bearer <accessToken>` headers.

---

## 💬 GPT Chat Reference

Chat link used while building:  
👉 https://chatgpt.com/c/685abd9c-a2f8-8005-85d6-c789e1cb3500

---

## 📁 Directory Structure

```
cms-gpt-backend/
│
├── pages/
│   └── api/
│       ├── auth/
│       │   ├── login.js
│       │   └── register.js
│       └── pages/
│           ├── create.js
│           ├── bulk-update.js
│           └── [id]/seo/generate.js
│
├── models/
│   └── Page.js
│   └── User.js
│
├── lib/
│   └── dbConnect.js
│   └── auth.js
│   └── protect.js
│
├── .env.local
├── README.md
└── postman_collection.json
```

---

## ✅ Author & Credits

Built with ❤️ as part of the CMS GPT Integration.
