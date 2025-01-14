'use client'

export default async function Setcookie(token: string, expirationDate:any) {
    document.cookie = `token=${token}; path=/; expires=${expirationDate}`;
}