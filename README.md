npm install

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_HOST=127.0.0.1
REDIS_PORT=6379



npm run dev



API Dökümantasyonu
Kullanıcı Kayıt (Register)
URL: /api/auth/register
Method: POST
Body:
json

{
  "username": "isa",
  "email": "ixayldz@gmail.com",
  "password": "123456"
}


Response:
json

{
  "user": {
    "id": "user_id",
    "username": "isa",
    "email": "ixayldz@gmail.com"
  },
  "token": "jwt_token"
}



Kullanıcı Giriş (Login)
URL: /api/auth/login
Method: POST
Body:
json

{
  "email": "ixayldz@gmail.com",
  "password": "123456"
}
Response:
json

{
  "user": {
    "id": "user_id",
    "username": "isa",
    "email": "ixayldz@gmail.com"
  },
  "token": "jwt_token"
}





Oda Oluşturma (Create Room)
URL: /api/rooms
Method: POST
Headers: Authorization: Bearer <jwt_token>
Body:
json

{
  "name": "room_name",
  "clubId": "club_id",
  "isPublic": true
}
Response:
json

{
  "id": "room_id",
  "name": "room_name",
  "club": "club_id",
  "owner": "user_id",
  "isPublic": true
}





Oda Listesi (Get Rooms)
URL: /api/rooms
Method: GET
Headers: Authorization: Bearer <jwt_token>
Response:
json

[
  {
    "id": "room_id",
    "name": "room_name",
    "club": "club_id",
    "owner": "user_id",
    "isPublic": true
  }
]
