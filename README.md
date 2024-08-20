<img width="248" alt="image" src="https://github.com/user-attachments/assets/3c0b4727-5766-4997-9359-87651cebeaba">


# Flash Card App

## Overview
The Flash Card App is a web application built with Next.js that allows users to create, edit, and manage flashcards. It leverages Firebase for data storage and Clerk for user authentication.

## Features
- User authentication with Clerk
- Create and manage flashcards
- Edit and delete flashcards
- Dark and light mode toggle
- Responsive design for various screen sizes

## Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- Firebase project setup
- Clerk account for authentication

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/flash-card-app.git
   cd flash-card-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your Firebase and Clerk credentials:
   ```plaintext
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_CLOUDFUNCTIONS_URL=your_cloudfunctions_url
   CLERK_FRONTEND_API=your_clerk_frontend_api
   CLERK_API_KEY=your_clerk_api_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

5. **Open your browser and navigate to** `http://localhost:3000` **to see the application running.**

## Project Structure
- `app/`: Contains the main application code
  - `api/`: API routes
  - `components/`: React components
  - `generate/`: Page for generating flashcards
  - `lib/`: Utility functions
  - `theme/`: Theme configuration for dark and light modes
- `public/`: Static assets

## Usage
- Users can sign up or log in using Clerk.
- Once authenticated, users can create flashcards by providing a topic, number of cards, and extra details.
- Flashcards can be edited or deleted as needed.
- Users can toggle between dark and light modes for better accessibility.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License.
