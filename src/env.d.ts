/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user?: {
      id: string;
      email: string;
      created_at?: string;
    } | null | undefined;
    session?: {
      user?: {
        id: string;
        email: string;
        created_at?: string;
      };
      access_token?: string;
      expires_in?: number;
      expires_at?: number;
    } | null | undefined;
    authenticated?: boolean;
  }
}