# Logly - AI Coding Guidelines

📋 **Technical Specification: Web Application for Logging Actions and Habits**

### 1. General Idea

The application helps users track their own actions (e.g., habits or events). A user can create “items” (e.g., _Smoking_, _Workout_), log each occurrence of the action, and then analyze statistics in the form of lists and charts.

---

### 2. Target Audience

- Primary use: personal.
- Multi-user support: each user can only see their own data.

---

### 3. Core Features

**Users**

- Sign-in via Firebase Authentication (Google OAuth).
- Profile page (name, email from Google profile, theme switch).

**Items**

- View a list of all user’s items.
- Add a new item (title, description, category — optional).
- Edit and delete items.

**Action Logs**

- Quick log entry (one-click).
- Detailed log entry (with action date selection and comment).
- Each log stores:
    - creation date,
    - last edit date,
    - action date,
    - optional comment.

- View all logs for an item (list).
- View a single log (edit, delete).

**Analytics**

- Chart of actions count per day for a selected item.
- Visualization: line or bar chart.

---

### 4. Interface (Pages)

- **Home page** – list of items + quick log option.
- **Item logs page** – list + chart.
- **Log entry page** – view/edit entry.
- **Profile page** – user data + theme switch (light/dark).

UI must be responsive (mobile-friendly).
The app must be a PWA (offline mode, installable on mobile).

---

### 5. Technologies

- **Language**: TypeScript (strict typing for all data, models, props, and API responses).
- **Frontend**: React (with Vite).
- **UI library**: @mui/material.
- **Icons**: @mui/icons-material.
- **Charts**: @mui/x-charts.
- **Styling**: plain CSS or CSS modules (no Tailwind or other CSS frameworks).
- **PWA**: Vite PWA plugin.
- **Firebase**: Firestore + Authentication (Google OAuth).

**Constraints**

- Use the minimum number of third-party packages — only essential ones (@mui/material, Firebase SDK, @mui/x-charts).
- All Firebase calls (auth, firestore) must be moved into a separate layer (hooks + services) and isolated from business logic and components.
- Project architecture must follow **Feature-Sliced Design (FSD)**:
    - **app** – app configuration (router, providers, themes).
    - **pages** – pages (profile, logs, home, record).
    - **widgets** – large UI blocks (navigation, item list, chart).
    - **features** – functional modules (auth, add-log, edit-item, etc.).
    - **entities** – entities (user, item, log).
    - **shared** – utilities, hooks, types, UI components.

---

### 6. Non-Functional Requirements

- Strict typing for all data (Log, Item, User).
- All hooks working with Firebase (e.g., `useAuth`, `useItems`, `useLogs`) must be located in a separate layer (`shared/api/firebase` or `shared/lib/firebase`) and be reusable.
- No direct Firebase calls inside components.
- Dark/light theme support (via MUI theme provider).
- No index.ts files with reexports.

---

### 7. User Story

“As a user, I want to log in with Google, create an item ‘Smoking’, and add entries with one click. I want to see the list of these entries, edit individual entries, and analyze the statistics with a daily chart.”

---

Хочешь, я сделаю более «формальное» ТЗ в стиле документа для программиста (с четкими требованиями к API, структуре данных и пользовательским сценариям)?

## Architecture Overview

This is a habit tracking app using **Feature-Sliced Design (FSD)** architecture:

- `src/app/` - Application shell (router, providers, layout)
- `src/pages/` - Page components with business logic
- `src/shared/` - Reusable utilities, API, types, UI components
- `src/widgets/` - Composite UI blocks (charts, lists)

## Tech Stack & Patterns

- **Frontend**: React 18 + TypeScript (strict mode)
- **Build**: Vite with HMR
- **Styling**: MUI (Material-UI) components
- **Backend**: Firebase (Auth + Firestore)
- **Routing**: React Router v6
- **State**: React hooks + Firebase real-time listeners

## Key Conventions

### Component Structure

```tsx
// Page components in src/pages/[feature]/page-[name].tsx
export const PageName = () => {
    // Business logic hooks
    const { data, loading } = useFirebaseHook();

    // UI rendering
    return <Component />;
};
```

### Firebase Integration

```tsx
// Custom hooks in src/shared/api/firebase/
export function useItems(userId: UserId | null) {
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        if (!userId) return;
        const q = query(collection, orderBy("field"));
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setItems(data);
        });
        return unsub;
    }, [userId]);

    return { items, loading };
}
```

### Type Definitions

```tsx
// src/shared/types/index.ts
export interface Item {
    id: string;
    userId: string;
    title: string;
    position: number; // For custom ordering
    // ... other fields
}
```

### MUI Usage

- Use MUI components with theme integration
- Prefer `sx` prop for custom styling
- Follow responsive design patterns (`xs`, `sm`, `md` breakpoints)

## Development Workflow

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run typecheck` - TypeScript validation
- Firebase rules in `firestore.rules`

## Common Patterns

- **Data fetching**: Firebase hooks with real-time updates
- **Error handling**: Try-catch in async functions
- **Loading states**: `loading` boolean from hooks
- **Navigation**: `useNavigate` from React Router
- **Forms**: Controlled components with `useState`

## File Organization

- Keep components focused and single-responsibility
- Extract reusable logic to custom hooks
- Use absolute imports with `../../../shared/`
- Group related files in feature directories

## File Requirements

- The file name must be in camelCase, for example: `pageProfile.tsx`.
- The file name should start with the FSD type (such as `page`, `widget`, `feature`, `entity`, `shared`), followed by the component name.

## Component Structure

1. The props interface must be declared separately, named `<ComponentName>Props`, and exported.
2. The component itself should be exported as `export const <ComponentName> = (props: <ComponentName>Props) => { ... }`.
3. Do not use default exports.
4. Do not use re-exports or `index` files.

## Example

### File name

`page-profile.tsx`

### Component code

```tsx
import { FC } from "react";

export interface PageProfileProps {
    userId: string;
}

export const PageProfile: FC<PageProfileProps> = (props) => {
    return <div>User ID: {props.userId}</div>;
};
```

When importing from .ts or .tsx files, always specify the .js extension.

All callbacks passed to components must be declared separately and use useCallback.
