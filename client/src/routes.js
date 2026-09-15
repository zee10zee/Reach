export const ROUTES = {
  LOGIN: '/login',
  HOME: '/',
  USER: (id) => `/user/${id}`,
  CHAT: (roomId) => `/chat/${roomId}`,
  CALL: (roomId) => `/call/${roomId}`,
}