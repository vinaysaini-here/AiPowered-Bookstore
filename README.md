📚 AI-Powered Bookstore

«A full-stack intelligent bookstore that combines e-commerce, AI-powered book discovery, personalized recommendations, and an AI-driven learning system into a single platform.»



✨ Overview

AI-Powered Bookstore is more than a traditional online bookstore.

The platform provides a complete digital reading and learning experience where users can:

- 🔐 Create accounts and securely authenticate
- 📚 Browse and purchase books
- 🛒 Manage their shopping cart
- 💳 Complete payments
- 📦 Track their orders and purchases
- 🤖 Interact with an AI bookstore assistant
- 🧠 Get AI-generated book summaries
- 🎯 Receive AI-powered book recommendations
- 🔎 Search books using natural-language queries
- 📖 Access purchased learning material
- 📝 Generate AI-powered quizzes from purchased study material
- 📊 Track quiz performance and learning analytics
- 💡 Get AI-generated explanations for quiz answers

The project also includes an admin dashboard for managing books, users, orders, and reports.

---

🚀 Core Features

👤 Authentication & User Management

- User registration and login
- JWT-based authentication
- Password hashing using "bcryptjs"
- Role-based access control
- User profile management
- Saved purchase history
- Address management

---

📚 Bookstore & E-Commerce

Users can:

- Browse available books
- View detailed book information
- Search and discover books
- Add books to cart
- Update cart quantities
- Remove books from cart
- Checkout
- Purchase books
- View order history
- Access purchased digital learning material

Each book can contain:

- Title
- Author
- Description
- Category
- Price
- Cover image
- Digital file
- Stock information

---

🤖 AI Book Assistant

The application integrates Google Gemini to provide an AI-powered bookstore assistant.

The assistant can use the bookstore catalog as context to answer user questions about available books.

Example queries:

I want a beginner-friendly programming book.

Which books are related to technology?

Suggest something for someone interested in psychology.

The AI service is implemented through dedicated backend AI routes and controllers.

---

🧠 AI-Powered Book Summaries

Users can request an AI-generated summary for a book.

The system sends relevant book information to Gemini and generates a concise explanation instead of requiring users to manually read the entire description.

---

🎯 AI Book Recommendations

Users can provide their interests and receive AI-generated recommendations.

Example:

I like backend development, system design and distributed systems.

The AI analyzes the available catalog and returns recommended books with reasoning for each recommendation.

---

🔎 Natural-Language Book Search

The project includes an AI-assisted semantic search flow.

Instead of relying only on traditional keyword matching, a natural-language query is passed to the AI together with book metadata.

Example:

Find me books that can help me understand programming from the basics.

The AI identifies relevant book IDs and the backend retrieves the corresponding books from MongoDB.

«Note: This is currently an AI-assisted catalog matching implementation, not a production vector-database/RAG pipeline yet.»

---

🎓 AI Learning System

One of the major features of the project is its AI-powered learning system.

Users who purchase digital learning material can use it to generate quizzes and track their learning performance.

Learning Flow

Purchase Book
      ↓
Access Learning Material
      ↓
Extract Study Content
      ↓
Gemini AI
      ↓
Generate Quiz
      ↓
Attempt Quiz
      ↓
Evaluate Answers
      ↓
Store Attempt
      ↓
Update Analytics

---

📝 AI Quiz Generation

The system can extract text from purchased PDF learning material and use Gemini to generate quizzes.

Each generated quiz contains:

- 15 AI-generated questions
- 4 options per question
- Correct answer
- Short explanation
- Subject/topic information

The backend also validates generated questions before storing them.

---

🔐 Purchased-Content Protection

Quiz generation is restricted to learning material that the authenticated user has purchased.

This prevents users from generating quizzes from content they do not own/access.

---

⚡ Quiz Caching

Generated quizzes use a SHA-256 hash of the source content.

This allows the system to detect previously generated quizzes for the same user and learning material instead of unnecessarily generating the same quiz again.

This reduces:

- Duplicate AI requests
- Unnecessary API usage
- Generation latency
- AI costs

---

📊 Learning Analytics

The platform tracks user learning performance.

Analytics include:

- Total quizzes attempted
- Average score
- Topic performance
- Strong topics
- Weak topics
- Performance history
- Quiz attempt statistics

This creates the foundation for a personalized learning experience.

---

🧩 Admin Dashboard

The application includes an admin interface for managing the bookstore.

Admin capabilities include:

- 📚 Book management
- 👥 User management
- 📦 Order management
- 📊 Reports
- 📈 Store analytics
- 🛠️ Book creation and editing

---

💳 Payment Integration

The backend includes Razorpay integration for handling bookstore payments.

The checkout flow is designed around:

Cart
 ↓
Checkout
 ↓
Payment
 ↓
Order Creation
 ↓
Purchase History
 ↓
Learning Access

---

🏗️ Architecture

The project follows a separate frontend/backend architecture.

                    ┌──────────────────────┐
                    │      Next.js UI      │
                    │                      │
                    │  Storefront          │
                    │  Dashboard           │
                    │  Admin Panel         │
                    │  Learning System     │
                    └──────────┬───────────┘
                               │
                               │ HTTP / REST API
                               ▼
                    ┌──────────────────────┐
                    │   Express.js API     │
                    │                      │
                    │ Auth                 │
                    │ Books                │
                    │ Cart                 │
                    │ Orders               │
                    │ Admin                │
                    │ AI                   │
                    │ Learning             │
                    └───────┬───────┬──────┘
                            │       │
                  ┌─────────┘       └──────────┐
                  ▼                            ▼
          ┌───────────────┐           ┌────────────────┐
          │   MongoDB     │           │ Google Gemini  │
          │               │           │                │
          │ Users         │           │ Chat           │
          │ Books         │           │ Summaries      │
          │ Orders        │           │ Recommendations│
          │ Quizzes       │           │ Quiz Generation│
          │ Attempts      │           │ Explanations   │
          │ Analytics     │           └────────────────┘
          └───────────────┘

---

🛠️ Tech Stack

Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand
- Axios
- Framer Motion
- Recharts
- Lucide React
- React Hot Toast

Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Morgan
- Express Async Handler

AI

- Google Gemini
- "@google/generative-ai"
- "@google/genai"
- PDF text extraction
- Structured AI output validation
- Content hashing for quiz caching

Payments

- Razorpay

---

📁 Project Structure

AiPowered-Bookstore/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── admin.controller.js
│   │   │   ├── ai.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── book.controller.js
│   │   │   ├── cart.controller.js
│   │   │   ├── learning.controller.js
│   │   │   └── order.controller.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   └── uploadMiddleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── Analytics.js
│   │   │   ├── Attempt.js
│   │   │   ├── Book.js
│   │   │   ├── Cart.js
│   │   │   ├── Order.js
│   │   │   ├── Quiz.js
│   │   │   └── User.js
│   │   │
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── aiRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── bookRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   ├── learningRoutes.js
│   │   │   └── orderRoutes.js
│   │   │
│   │   └── index.js
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/
│   │   │   ├── books/
│   │   │   ├── cart/
│   │   │   ├── chat/
│   │   │   ├── checkout/
│   │   │   ├── dashboard/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── page.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── book/
│   │   │   ├── dashboard/
│   │   │   ├── layout/
│   │   │   └── learning/
│   │   │
│   │   ├── lib/
│   │   ├── store/
│   │   └── types/
│   │
│   ├── package.json
│   └── ...
│
└── README.md

---

⚙️ Getting Started

1. Clone the repository

git clone https://github.com/vinaysaini-here/AiPowered-Bookstore.git

cd AiPowered-Bookstore

---

2. Setup Backend

cd backend
npm install

Create a ".env" file:

PORT=8000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

Start the backend:

npm run dev

Production:

npm start

---

3. Setup Frontend

Open another terminal:

cd frontend
npm install

Create your environment configuration according to the API URL used by your backend.

Then start the development server:

npm run dev

The frontend will be available at:

http://localhost:3000

---

🔑 Environment Variables

Never commit your ".env" file.

Typical backend configuration:

Variable| Description
"PORT"| Backend server port
"MONGO_URI"| MongoDB connection string
"JWT_SECRET"| Secret used for JWT authentication
"GEMINI_API_KEY"| Google Gemini API key
"RAZORPAY_KEY_ID"| Razorpay public key
"RAZORPAY_KEY_SECRET"| Razorpay secret

---

🔄 AI Request Flow

The current AI architecture follows a backend-controlled approach.

User Request
     │
     ▼
Next.js Frontend
     │
     ▼
Express API
     │
     ├──────────────► MongoDB
     │                    │
     │                    ▼
     │               Book / User Data
     │
     ▼
Gemini API
     │
     ▼
AI Response
     │
     ▼
Express API
     │
     ▼
Next.js UI

This keeps the Gemini API key on the server rather than exposing it directly to the client.

---

🧠 Current AI Capabilities

Capability| Current Implementation
AI Chat Assistant| ✅
AI Book Summaries| ✅
AI Recommendations| ✅
Natural-Language Book Search| ✅
PDF Text Extraction| ✅
AI Quiz Generation| ✅
Quiz Answer Evaluation| ✅
AI Answer Explanation| ✅
Learning Analytics| ✅
Quiz Caching| ✅
Source Content Hashing| ✅
Vector Database| 🔜
Production RAG Pipeline| 🔜
Long-Term Conversation Memory| 🔜
Personalized User Memory| 🔜

---

🚧 Roadmap

The project is designed to evolve from an AI-assisted bookstore into a more complete AI-native commerce and learning platform.

Phase 1 — AI Infrastructure

- [ ] Proper RAG pipeline
- [ ] Embedding generation
- [ ] Vector database integration
- [ ] Semantic retrieval
- [ ] Chunking and metadata filtering
- [ ] Retrieval evaluation

Phase 2 — AI Memory

- [ ] Conversation history
- [ ] Short-term conversation memory
- [ ] Long-term user preferences
- [ ] Personalized recommendations
- [ ] User reading profile
- [ ] Preference extraction

Phase 3 — Intelligent Shopping

- [ ] AI shopping assistant
- [ ] Multi-step book discovery
- [ ] Personalized recommendations
- [ ] Cart-aware AI assistant
- [ ] Order-aware conversations
- [ ] AI-assisted checkout

Phase 4 — Intelligent Learning

- [ ] RAG over purchased books
- [ ] Ask questions directly from a book
- [ ] Citation-based answers
- [ ] Adaptive quizzes
- [ ] Personalized learning paths
- [ ] Weak-topic remediation
- [ ] Learning recommendations

Phase 5 — Production AI

- [ ] Redis caching
- [ ] Rate limiting
- [ ] Background AI jobs
- [ ] AI request observability
- [ ] Prompt/version management
- [ ] Token usage tracking
- [ ] AI evaluation pipeline
- [ ] Model fallback strategy

---

🔐 Security Considerations

The application uses several backend security mechanisms:

- Password hashing with bcrypt
- JWT authentication
- Role-based authorization
- Protected learning resources
- Environment-based secret management
- Server-side AI API integration
- Input validation
- Error-handling middleware

For production deployment, additional hardening such as rate limiting, stricter validation, security headers, request logging, and AI abuse protection should be added.

---

📈 Why This Project?

The goal of this project is to explore how traditional e-commerce can be enhanced with modern AI systems.

Instead of simply adding a chatbot to a bookstore, the long-term direction is to build an intelligent platform where AI understands:

User
 │
 ├── Preferences
 ├── Purchases
 ├── Reading History
 ├── Conversations
 └── Learning Performance
          │
          ▼
     AI Intelligence
          │
          ├── Discovery
          ├── Recommendations
          ├── Search
          ├── Shopping
          └── Learning

---

🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

git checkout -b feature/your-feature

3. Commit your changes

git commit -m "feat: add your feature"

4. Push the branch

git push origin feature/your-feature

5. Open a Pull Request

---

📄 License

This project is currently distributed under the repository's configured license.

---

👨‍💻 Author

Vinay Saini

Full Stack Developer focused on:

- MERN / Full Stack Development
- Backend Engineering
- AI Engineering
- Agentic AI
- System Design
- Cloud & DevOps

---

⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

Repository:
https://github.com/vinaysaini-here/AiPowered-Bookstore
