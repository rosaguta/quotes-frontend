'use client'

export default function Setcookie(token: string, expirationDate:any) {
    document.cookie = `token=${token}; path=/; expires=${expirationDate}`;
}