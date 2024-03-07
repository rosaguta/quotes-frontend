'use client'

export default async function setcookie(token) {
    document.cookie = `token=${token}; path=/`;
}