# 📚 Knowledge Workspace

A modern, full-stack document management system with an immersive Kindle-like reading experience. Built with React, TypeScript, and FastAPI.

![Knowledge Workspace](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 📖 Document Management
- **Upload & Organize**: Support for PDF and Markdown documents
- **Taxonomy System**: Create categories and subcategories for better organization
- **Search & Filter**: Quickly find documents by category or metadata
- **CRUD Operations**: Full create, read, update, delete capabilities

### 🎨 Kindle-Style Reader
- **Immersive Reading**: Distraction-free, full-screen reading experience
- **4 Reading Themes**: Sepia (warm), Light, Silver, and Dark themes
- **Smart Controls**:
  - PDF Zoom: 50% to 300% with 25% increments
  - Font Size Adjustment: For Markdown documents (14-28px)
  - Single/Double Page View: View PDFs one page at a time or side-by-side
- **Adaptive Interface**: Controls automatically adjust based on document type

### 👨‍💼 Admin Panel
- **Dashboard**: Overview of documents, categories, and subcategories
- **Document Management**: Upload, edit, view, and delete documents
- **Taxonomy Management**: Create and manage categories with nested subcategories
- **User Management**: (Coming soon)

### 🔐 Authentication & Security
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected API endpoints
- Session management

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **PDF.js** - PDF rendering
- **React Markdown** - Markdown rendering with syntax highlighting

### Backend
- **FastAPI** - Modern Python web framework
- **SQLModel** - SQL database ORM with type hints
- **SQLite** - Lightweight database
- **Pydantic** - Data validation
- **JWT** - Token-based authentication

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/knowledge-workspace.git
cd knowledge-workspace
```

2. **Set up the Backend**
```bash
cd backend
pip install -r requirements.txt
```

3. **Set up the Frontend**
```bash
cd ..
npm install
```

4. **Configure Environment**
Create a `.env.local` file in the root directory:
```env
VITE_API_URL=http://localhost:8000
```

### Running the Application

1. **Start the Backend Server**
```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

2. **Start the Frontend Development Server**
```bash
npm run dev
```

3. **Access the Application**
- Frontend: `http://localhost:3000`
- Backend API Docs: `http://localhost:8000/docs`

## 📁 Project Structure

```
knowledge-workspace/
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── models.py            # Database models
│   ├── database.py          # Database configuration
│   ├── auth.py              # Authentication logic
│   └── requirements.txt     # Python dependencies
├── components/
│   ├── documents/
│   │   └── UploadModal.tsx  # Document upload component
│   ├── layout/
│   │   ├── Header.tsx       # Application header
│   │   └── Sidebar.tsx      # Navigation sidebar
│   └── reader/
│       ├── PdfViewer.tsx    # PDF rendering component
│       └── MarkdownViewer.tsx # Markdown rendering component
├── pages/
│   ├── Admin.tsx            # Admin panel
│   ├── LoginPage.tsx        # Login page
│   ├── Reader.tsx           # Document reader
│   └── Workspace.tsx        # Main workspace
├── services/
│   └── api.ts               # API client
├── context/
│   └── AppContext.tsx       # Global state management
├── App.tsx                  # Main application component
├── index.tsx                # Application entry point
└── types.ts                 # TypeScript type definitions
```

## 🎯 Key Features Explained

### Document Reader
The document reader provides a premium reading experience similar to Kindle:

- **Theme Switching**: Choose from 4 carefully designed themes
- **Zoom Controls**: For PDF documents, zoom from 50% to 300%
- **Page View Modes**: View PDFs in single or double-page layout
- **Font Customization**: Adjust text size for Markdown documents
- **Responsive Design**: Works seamlessly on all screen sizes

### Category Management
Organize your documents with a flexible taxonomy:

- Create top-level categories
- Add unlimited subcategories to each category
- View document counts per category
- Edit and delete with confirmation prompts

## 🔑 Default Credentials

For testing purposes, you can create a user account or use demo credentials if provided in the database.

## 📝 API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation powered by Swagger UI.

### Key Endpoints

#### Authentication
- `POST /token` - Login and get JWT token
- `POST /users/` - Register new user

#### Documents
- `GET /documents/` - Get all documents
- `POST /documents/` - Upload new document
- `GET /documents/{id}` - Get document by ID
- `PUT /documents/{id}` - Update document
- `DELETE /documents/{id}` - Delete document

#### Categories
- `GET /categories/` - Get all categories with subcategories
- `POST /categories/` - Create new category
- `PUT /categories/{id}` - Update category
- `DELETE /categories/{id}` - Delete category

#### Subcategories
- `POST /subcategories/` - Create new subcategory
- `PUT /subcategories/{id}` - Update subcategory
- `DELETE /subcategories/{id}` - Delete subcategory

## 🎨 UI Themes

### Sepia (Default)
Warm, eye-friendly theme perfect for long reading sessions
- Background: `#F4ECD8`
- Text: `#2C2416`

### Light
Clean, bright theme for daytime reading
- Background: `#FFFFFF`
- Text: `#1F2937`

### Silver
Soft gray theme, easy on the eyes
- Background: `#E8E8E8`
- Text: `#1F2937`

### Dark
Dark mode for night-time reading
- Background: `#1A1A1A`
- Text: `#E5E7EB`

## 🚧 Roadmap

- [ ] User profile management
- [ ] Document sharing and collaboration
- [ ] Full-text search
- [ ] Document annotations and highlights
- [ ] Export functionality
- [ ] Mobile app
- [ ] Cloud storage integration
- [ ] Advanced permissions system

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern web framework for Python
- [React](https://react.dev/) - JavaScript library for building user interfaces
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF rendering library
- [Phosphor Icons](https://phosphoricons.com/) - Beautiful icon family

## 📞 Support

For support, email your.email@example.com or create an issue in the GitHub repository.

---

Made with ❤️ by [Your Name]
