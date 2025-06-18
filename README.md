# Project : Greenlight
---
### Team name : ChatSeek
### Team ID : 34
---
## Chosen problem statement:
 Theme 2 Problem statement 2

---
Greenlight is a remote learning app that enables digital user learning. Emphasis on collaborative tools serve to enable the human touch during remote sessions.

---
## Project details

The functions built into greenlight seeks to create an interactive environment, the features included can be summarised below
- User registration
- User login
- Breakout Room creation (accessible only by teacher accounts)
- Video call hosting (accessible only by teacher accounts)
- Video conferencing
- Live quizzes
- Shared whiteboard screen
- Post lesson peer feedback (accessible only by student accounts)

## Built with:

## How we built it
Frontend: React + TypeScript with Vite for fast development.

Styling: TailwindCSS to build clean UI components quickly.

Video Calls: Daily.co's prebuilt iframe API for seamless video sessions.

Data: Firebase Realtime Database to store class info, room URLs, and quiz states.

Routing: React Router for navigation between main, class, and video call pages.

Whiteboard: LiveBlocks for collaborative whiteboard integration
> npx create-liveblocks-app@latest --init --framework react

We designed it so that creating a class automatically generates a persistent video room behind the scenes. When a teacher clicks into the class, the room is ready to go.

---

## How to Run

Follow the steps below to install dependencies and start the development server:

```bash
# Install dependencies in the root project
npm install

# Navigate to the whiteboard sub-repository and install its dependencies
cd nextjs-whiteboard-advanced && npm install

# Create env file and include secret key
code .env.local 
# LIVEBLOCKS_SECRET_KEY=sk_dev_nmGIFjT4ZgyeiFVAsbErUUHDzzBeKTxQNb1f-UMuoue4vnujBoylGn9kEc5b0BaN

# Start the development server
cd - && npm run dev
```

---
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
