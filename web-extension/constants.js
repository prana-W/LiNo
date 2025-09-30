export const SERVER_URL='http://localhost:8000';
export const socketClientOptions = {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 2000,
    auth: {
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGQ5YWZkOTgyZjFjNjk2YjVjYTQ2ZDgiLCJ1c2VybmFtZSI6InRlc3Q2IiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tNiIsImlhdCI6MTc1OTE1NTgzNCwiZXhwIjoxNzU5NzYwNjM0fQ.rmRmbNRJ3DSzWqmURVEhYeJC07feW3ajPt815VqfJ_U",
    }
}