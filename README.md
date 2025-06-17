# Lockout

**Lockout** is a minimalist web application designed to help users regain control over their digital habits and password security. It serves two primary purposes:

- **Password Management**: Generate and securely store passwords.
- **Digital Self-Control**: Temporarily lock yourself out of distracting apps or websites by generating passwords that are hidden and time-locked for a minimum of 7 hours.

---

## Tech Stack

- **Frontend**: SolidJS (with solid-router), Vite
- **Backend**: AWS Lambda (Java, AWS SDK v2)
- **Database**: Amazon DynamoDB
- **Authentication**: Cookie-based session management

---

## How It Works

### Architecture Overview

- **Frontend**:
  - Built using SolidJS and bundled with Vite.
  - Uses reactive signals for state, with no external state management library needed.
  - Interacts directly with AWS Lambda function URLs (no API Gateway used).

- **Backend**:
  - Java AWS Lambda functions handle business logic.
  - Raw HTTP requests are parsed by a custom `LambdaInput` class.
  - Routing is handled manually using a `Router` class.
  - Each route maps to a `UserRequest` handler that constructs a `User` object.
  - High-level operations (e.g., user registration, password generation, reveal requests) are encapsulated in the `User` class.
  - All data persistence is done via the `DbOps` class, which wraps DynamoDB SDK calls.

### DynamoDB Schema

- **Partition Key**: `email` (User identifier)
- **Attributes**:
  - `password`: hashed user password
  - `userdata`: List of secrets (each with):
    - `description`
    - `obfuscatedPassword` (with random chars + backspace hints)
    - `rawPassword`
    - `lastRevealRequestTime`
    - `cooldownHours` (default: 7 hours)

---

## Features

- Create accounts and manage sessions with strict expiration policies.
- Add new secrets that can only be revealed after a cooldown.
- Protect access to time-wasting applications by locking their passwords temporarily.
- Secrets are stored with both obfuscation and encryption for added difficulty in bypassing.

---

## Local Development

### Prerequisites

- Java 17+
- Node.js 18+
- AWS CLI configured with access to Lambda and DynamoDB

### Setup

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend (Java AWS Lambda)
cd backend
./gradlew build
# Deploy the Lambda and use function URLs directly
```

> DynamoDB tables and Lambda function deployments should be provisioned manually or using scripts (e.g., AWS CLI or Terraform).

---

## Roadmap

- [ ] Add testing framework for backend logic
- [ ] Improve UI/UX for secret reveal process
- [ ] Add user-configurable cooldown windows

---

## Contributing

Pull requests are welcome. Please open an issue first to discuss proposed changes.

---

## License

MIT
