# CRM Notification Service

A multi-channel notification microservice within the CRM ecosystem that delivers real-time notifications, email alerts, and SMS messages. This service provides a unified notification gateway for the entire CRM platform.

## Overview

The CRM Notification Service acts as the central notification hub, supporting three delivery channels: real-time WebSocket notifications, email via SMTP, and SMS via the Vonage API. It enables other CRM services to trigger instant user notifications across any supported channel through a simple API.

## Key Features

- **Real-Time Notifications** — Push instant notifications to connected clients via Socket.IO
- **Email Delivery** — Send email notifications through SMTP (Nodemailer)
- **SMS Messaging** — Deliver text messages to phone numbers via the Vonage/Nexmo API
- **Multi-Channel Support** — Single service handles all notification channels
- **Event-Driven Architecture** — Socket.IO event system for broadcasting notifications across connected clients
- **MySQL Integration** — Database connectivity for notification persistence and user data

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Real-Time:** Socket.IO
- **Email:** Nodemailer (SMTP)
- **SMS:** Vonage Server SDK (Nexmo)
- **Database:** MySQL
- **Environment Config:** dotenv

## API Endpoints

| Method | Endpoint      | Description                        |
|--------|---------------|------------------------------------|
| GET    | `/`           | Health check — confirms service is running |
| POST   | `/send-email` | Send an email notification         |
| POST   | `/send-sms`   | Send an SMS message via Vonage     |

### WebSocket Events

| Event               | Direction       | Description                                  |
|---------------------|-----------------|----------------------------------------------|
| `send-notification` | Client → Server | Emit a notification payload for broadcasting |
| `new-notification`  | Server → Client | Receive broadcasted notification             |

### Request Payloads

**POST `/send-email`**
```json
{
  "email": "recipient@example.com"
}
```

**POST `/send-sms`**
```json
{
  "text": "Your notification message",
  "number": "+1234567890"
}
```

## Prerequisites

- Node.js (v14 or higher)
- MySQL server with a `crm-system` database
- Vonage/Nexmo API credentials (for SMS)
- SMTP credentials (for email)

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mhmalvi/CRM-Notification-Service.git
   cd CRM-Notification-Service
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Configure environment variables:**

   Copy the example environment file and fill in your values:
   ```bash
   cp example.env .env
   ```

   ```env
   CLIENT_URL=http://your-crm-frontend-url.com
   PORT=5000
   VONAGE_APIKEY=your_vonage_api_key
   VONAGE_APISECRET=your_vonage_api_secret
   EMAIL_USERNAME=your_smtp_username
   EMAIL_PASSWORD=your_smtp_password
   ```

4. **Start the service:**

   Production:
   ```bash
   npm start
   ```

   Development (with auto-reload):
   ```bash
   npm run start-dev
   ```

   The service will start on the configured `PORT` (default: **5000**).

## Architecture

This service is part of a larger **CRM microservices architecture**. It operates as the unified notification gateway that other CRM services (follow-ups, lead management, payments, etc.) depend on to deliver alerts through email, SMS, and real-time WebSocket channels. It can be deployed and scaled independently based on notification volume.

## License

MIT
