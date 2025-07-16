# 🛒 Nodepop

**Nodepop** is a modern frontend SPA built with **React 19**, **Vite**, **TypeScript** and **Tailwind CSS**, serving as an interface for the **Nodepop** classifieds API.  
It allows users to register, log in, and manage ads by filtering by name, price, tags, and other parameters.


## 🚀 Features

✅ User authentication (login and registration)  
✅ Ad listings with filters and advanced search  
✅ Creation and deletion of ads  
✅ Pagination and data fetching from the API  
✅ Session management using JWT tokens  
✅ Form validations with **Zod**  
✅ Responsive and customizable styles with **Tailwind CSS**


## 🧑‍💻 Technologies Used

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Router 7](https://reactrouter.com/en/main)
- [Axios](https://axios-http.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zod](https://zod.dev/) for schema validations
- [clsx](https://github.com/lukeed/clsx) for conditional classNames
- [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) with Tailwind plugin


## ⚙️ Installation Backend **[Nodepop-api](https://github.com/davidjj76/nodepop-api.git)**
For the frontend to work you will need to clone **[Nodepop-api](https://github.com/davidjj76/nodepop-api.git)** beforehand.

Install the dependencies:

```
cd nodepop-api
npm install
```

Initialize it by doing `npm start`

The server will run by default at http://localhost:3001/swagger

Make sure the backend is running properly before using the frontend application.


## ⚙️ Installation Frontend Nodepop

### 1️⃣ Clone the repository

```bash
git clone https://github.com/HLozano87/nodepop-react.git
cd nodepop-react
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure environment variables

### `.env.example` file

To simplify configuration, rename the `.env.example` file to `.env` or create a new `.env` file and write the API URL you want to use:

```env
# Base URL of the Nodepop API
VITE_BASE_URL_API=http://localhost:3001
```

This way, other developers can copy `.env.example` to `.env` and adjust the URL according to their local or production environment.



### 4️⃣ Run the app in development mode

```bash
npm run dev
```

Open your browser at [http://localhost:5173](http://localhost:5173) to see the app.

---

## 🧩 Available scripts

| Script            | Description                                         |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Runs the app in development mode with **Vite**      |
| `npm run build`   | Compiles TypeScript and builds for production       |
| `npm run preview` | Previews the production build                       |
| `npm run lint`    | Runs ESLint code analysis                           |
| `npm run format`  | Formats the entire project with Prettier + Tailwind |

---

## ✅ Project status

> 🚧 **In development:** New features, validations, optimizations, and UI/UX improvements are being added.


## 📜 License

This project is licensed under the **MIT** License.

