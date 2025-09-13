# Major Assignment Tasks

## RESTful API Implementation

Implement a set of API endpoints to perform CRUD operations on the following entities:

### REST APIs

#### User Endpoints
- **Create User / Register**: `POST /api/auth/register`
- **Get User**: `GET /api/user/list`
- **Get User Token**: `GET /api/auth/login`

#### Poll Endpoints
- **Create Poll**: `POST /api/poll/create`
- **Get Poll**: `GET /api/poll/list`
- **Get Poll by ID** (Poll Option is Included): `GET /api/poll/id/:id`
- **Update Poll**: `PUT /api/poll/update/:id`

#### Vote Endpoints
- **Cast Vote**: `PUT /api/poll/castVote/:pollId/:optionId`

## Database Design

### User Model
```prisma
model User {
  id           String @id @default(uuid())
  name         String
  email        String @unique
  passwordHash String

  polls Poll[]
  votes Vote[]

  @@index([name, email])
  @@index([name])
  @@index([email])
}
```

### Poll Model
```prisma
model Poll {
  id          Int      @id @default(autoincrement())
  question    String
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  creatorId   Int
  creator     User     @relation(fields: [creatorId], references: [id])

  options PollOption[]

  @@index([question, isPublished])
}
```

### PollOption Model
```prisma
model PollOption {
  id     Int    @id @default(autoincrement())
  text   String

  pollId Int
  poll   Poll   @relation(fields: [pollId], references: [id])

  votes Vote[]
}
```

### Vote Model
```prisma
model Vote {
  id Int @id @default(autoincrement())

  userId   Int
  optionId Int

  user   User       @relation(fields: [userId], references: [id])
  option PollOption @relation(fields: [optionId], references: [id])

  @@unique([userId, optionId])
}
```

## Database Relationships

### One-to-Many Relationships
- A **User** can create many **Polls**, but each **Poll** has only one creator (**User**)
- A **Poll** can have multiple **PollOptions**, but each **PollOption** belongs to only one **Poll**

### Many-to-Many Relationships
- A **User** can vote on many **PollOptions**, and a **PollOption** can be voted on by many **Users**
- This relationship is defined using a Prisma many-to-many relation, which creates a join table (**Vote**)

## WebSocket Implementation

### Live Results
When a **Vote** is cast for a **Poll**, the updated vote counts for all **PollOptions** within that **Poll** should be broadcast to all clients who are currently viewing that specific poll.

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd move37
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgres://postgres:12345678@localhost:5432/move37
   NODE_ENV=development
   PORT=3000
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRES_IN=1h
   SALT_ROUNDS=10
   ```

   **Note:**
   - rename the `.env.example` to `.env` and update the `DATABASE_URL` and good to go with the default values.


4. **Database Setup**

   Initialize and generate Prisma client:
   ```bash
   npx prisma migrate deploy
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Or for production:
   ```bash
   npm start
   ```

### Available Scripts

- `npm run dev` - Start development server with nodemon (auto-restart)
- `npm start` - Start production server

### Project Dependencies

#### Production Dependencies
- **@prisma/client** - Database ORM client
- **bcrypt** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **express** - Web framework
- **jsonwebtoken** - JWT authentication
- **morgan** - HTTP request logger
- **prisma** - Database toolkit
- **socket.io** - Real-time communication
- **winston** - Logging library
- **zod** - Schema validation

#### Development Dependencies
- **nodemon** - Development server with auto-restart

### API Base URL
```
http://localhost:3000
```


### Testing the API

You can test the API endpoints using tools like:

- 📂 **Postman Collection:** [`demo/movie 37 Assignment.postman_collection.json`](./demo/movie%2037%20Assignment.postman_collection.json)  
  Import this collection into Postman to test all endpoints.

- 🎥 **Demo Video:** [`demo/APIs-Demo.mp4`](./demo/APIs-Demo.mp4)  
  Watch a demonstration of the API in action.

- 🗂️ **Logs Directory:** [`demo/demo-logs/`](./demo/demo-logs/)  
  Contains logs generated during the demo or test runs.

![API Demo](./demo/APIs-Demo.mp4)

---

## Task Checklist

- [ ] **REST APIs**
  - [ ] **User**: Create and retrieve users
    - [ ] Create User / Register: `POST /api/auth/register`
    - [ ] Get User: `GET /api/user/list`
    - [ ] Get User Token: `GET /api/auth/login`
  - [ ] **Poll**: Create and retrieve polls, including their options
    - [ ] Create Poll: `POST /api/poll/create`
    - [ ] Get Poll: `GET /api/poll/list`
    - [ ] Get Poll by ID (Poll Option is Included): `GET /api/poll/id/:id`
    - [ ] Update Poll: `PUT /api/poll/update/:id`
  - [ ] **Vote**: Submit a vote for a specific poll option
    - [ ] Cast Vote: `PUT /api/poll/castVote/:pollId/:optionId`
- [ ] **Database Design**
  - [ ] User Model
  - [ ] Poll Model
  - [ ] PollOption Model
  - [ ] Vote Model
  - [ ] One-to-Many relationships implementation
  - [ ] Many-to-Many relationships implementation
- [ ] **WebSocket Implementation**
  - [ ] Live Results broadcasting