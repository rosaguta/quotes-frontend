'use server'
import {cookies} from 'next/headers'

export default async function setcookie(token) {
    cookies().set('token', token)
}