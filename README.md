# 🐾 PawPrints

**PawPrints** (available [here](https://rdas1.github.io/PawPrints/)) is a portfolio project designed to demonstrate how I would approach designing and building a full-stack CRUD application for veterinary professionals and animal care teams.

## ✨ Features

- 🐶 Manage animal records and metadata
- ➕ Add and edit animal types inline within dropdowns
- 🔍 Powerful filtering, sorting, and pagination tools
- 📱 Mobile-friendly, responsive interface
- ✏️ Inline modals for creation and editing
- 🎨 Whimsical, polished visuals with cozy colors and a themed UI
- 💤 Lottie animations for loading and ambiance
- ✅ Toasts for feedback on actions like pet creation, updates, and deletions
- ⚠️ Error handling and field validation (e.g. required fields, invalid input)

## 🛠️ Tech Stack

### Frontend:
- **React** (with Vite)
- **TypeScript**
- **Tailwind CSS** (with custom theming)
- **ShadCn UI** (headless UI primitives)
- **react-select** (for select inputs)
- **Lottie-react** (for animations)
- **Sonner** (for toast notifications)

### Backend:
- **Node.js** with **Express**
- **SQLite** for a lightweight, file-based database
- **RESTful API**
- **Hosted on AWS EC2** using `pm2`

## 🚀 Deployment

- **Frontend** is deployed via **GitHub Pages**.
- **Backend** runs on an **Amazon EC2 instance**, and is currently deployed manually using SSH + `git pull` + `pm2 restart`. (Automatic deployment is forthcoming.)

## 📸 Demo

You can try the live app here:  
👉 [**https://rajrishi.github.io/PawPrints**](https://rajrishi.github.io/PawPrints/)

## 📂 Project Structure

```bash
PawPrints/
├── backend/               # Express server + SQLite DB
├── frontend/              # React app (Vite, Tailwind, etc.)
│   ├── src/
│   ├── public/
│   └── index.css
├── package.json
└── README.md              # ← You are here!
```
## 🤝 Acknowledgements

- Designed and developed by [**Rajrishi Das**](https://github.com/rdas1)
- Fonts: [**Fredoka**](https://fonts.google.com/specimen/Fredoka)
- Animations: [**LottieFiles**](https://lottiefiles.com)
- Icon set: [**Lucide**](https://lucide.dev/)

---

Thanks for checking out **PawPrints**!  
Feel free to explore my other projects — I'm especially proud of [this bus time tracker](https://github.com/rdas1/bus-time), which I built to help my neighbors catch their buses on time. 🚌

If you're a hiring manager, educator, or technologist working on something impactful — I’d love to connect.

<br/>

— **Rajrishi Das** 🐾
