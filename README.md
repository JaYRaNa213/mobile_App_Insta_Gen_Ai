# 📸 InstaGen AI – Mobile App

InstaGen AI is a mobile application built with **React Native + Expo** that allows users to **capture or upload images/videos** and analyze them using an AI-powered backend.  
The app supports camera access, gallery selection, media upload, and viewing AI-generated results.

---

## 🚀 Features
- 📷 **Capture media** using the device camera.
- 🖼 **Select from gallery** with Expo ImagePicker.
- ☁ **Upload media** to the backend API.
- 🤖 **AI Analysis** for uploaded images/videos.
- 📱 **Cross-platform** – works on Android and iOS.

---

## 🛠 Tech Stack
- **Frontend:** React Native, Expo
- **Navigation:** React Navigation
- **State Management:** Zustand
- **API Calls:** Fetch API
- **Media Handling:** Expo ImagePicker

---

## 📂 Project Structure
instaGen/
│── mobile/ # React Native app
│ ├── src/
│ │ ├── screens/ # UI screens (Camera, Preview, Home, etc.)
│ │ ├── services/ # API & media upload services
│ │ ├── store/ # Zustand store
│ │ └── types/ # TypeScript types
│── backend/ # (to be implemented) Node.js/Express backend


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/JaYRaNa213/mobile_App_Insta_Gen_Ai.git
cd mobile_App_Insta_Gen_Ai
2️⃣ Install dependencies
bash
Copy code
cd mobile
npm install
3️⃣ Configure environment variables
Create a .env file in the mobile folder:

env
Copy code
EXPO_PUBLIC_API_URL=http://<your-backend-ip>:5000
⚠ Use your local IP address for testing on a real device.

4️⃣ Start the app
bash
Copy code
npx expo start
Press a for Android

Press i for iOS (Mac only)

Scan the QR code in Expo Go app

🔌 Backend API (To Be Implemented)
The backend will provide:

POST /presign → Get a signed URL for uploading media

POST /media/create → Save uploaded media metadata

GET /media/:id → Fetch media details & AI analysis results

📸 Screenshots
(Add screenshots after running the app)

🤝 Contributing
Fork the project

Create your feature branch (git checkout -b feature/new-feature)

Commit your changes (git commit -m 'Add new feature')

Push to the branch (git push origin feature/new-feature)

Open a Pull Request

📜 License
This project is licensed under the MIT License.

yaml
Copy code

---
