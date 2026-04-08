# Microservices Demo

Minimal NestJS microservices demo with:
- API Gateway
- Users Service
- Email Service
- RabbitMQ event flow

## Services
- Gateway: `http://localhost:3000`
- Users: `http://localhost:3001`
- Email: RabbitMQ consumer (`emails_queue`)

## Install
```bash
npm install
```

## Run
Use one terminal per service:

```bash
npm run start:users
npm run start:email
npm run start:gateway
```

## Notes
- Gateway forwards user requests to Users Service using `micro-requester`.
- Users Service uses `better-sqlite3` with local DB file in `users-service/`.
- Duplicate email returns `409 Conflict` from Users Service and is passed through by Gateway.
