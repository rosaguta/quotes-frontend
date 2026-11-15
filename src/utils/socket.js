import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : process.env.NEXT_PUBLIC_KAHOOT_WS;

export const socket = io(URL,{
  // autoConnect: false
});

const HTTP_URL = URL ? URL.replace(/^ws(s?):\/\//, 'http$1://').replace(/\/+$/, '') : '';

export function mediaUrl(path) {
  if (!path) return null;
  return `${HTTP_URL}${path}`;
}
