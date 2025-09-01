
# AI Form Generator - Backend

This is the backend for the **AI Form Generator** project. It provides APIs for authentication, form creation, submission, and integration with AI (Google Generative AI).  
The project is built using **Node.js**, **Express**, **TypeScript**, and **MongoDB**.

---

## 🚀 Project Setup

### 1. Clone the Repository
```bash
git clone https://github.com/mayankbhatt01/AI-Form-Generator-Backend.git
cd AI-Form-Generator-Backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root of the project and add the following:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GOOGLE_API_KEY=your_google_api_key
```

⚠️ Replace the values with your own credentials.

### 4. Run the Project in Development
```bash
npm run dev
```
This will start the server using `nodemon` and `ts-node`.

### 5. Build the Project
```bash
npm run build
```

### 6. Run in Production
```bash
npm start
```
The build will be generated inside the `dist/` folder.

---

## 📂 Project Structure
```
server/
 └── src/
     ├── index.ts        # Entry point
     ├── routes/         # API routes
     ├── controllers/    # Business logic
     ├── models/         # Mongoose models
     └── middleware/     # Authentication, validation, etc.
```

---

## 🌐 Frontend & Backend Links

- **Frontend GitHub URL:** [AI-Form-Generator-Frontend](https://github.com/mayankbhatt01/AI-Form-Generator-Frontend)  
- **Frontend Deployed URL:** [https://ai-form-generator-frontend.vercel.app/](https://ai-form-generator-frontend.vercel.app/)  
- **Backend GitHub URL:** [AI-Form-Generator-Backend](https://github.com/mayankbhatt01/AI-Form-Generator-Backend)  
- **Backend Deployed URL:** [https://ai-form-generator-backend.onrender.com/](https://ai-form-generator-backend.onrender.com/)  

⚠️ Important Note: The backend is deployed on Render, so the first request may take 2-3 minutes to respond (cold start). After that, performance will be smooth.

---

## 🛠️ Tech Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Cloudinary (for file uploads)
- Google Generative AI (for AI form generation)
- JWT Authentication
- Multer (file handling)
