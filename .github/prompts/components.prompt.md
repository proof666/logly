# Prompt: Creating React Components

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
