// clerk.d.ts
declare module '@clerk/nextjs/server' {
    import { User } from '@clerk/nextjs/dist/types';
  
    export function currentUser(): Promise<User | null>;
  }
  