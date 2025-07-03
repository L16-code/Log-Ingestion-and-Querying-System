# Log Ingestion and Querying System - Backend

This is the backend service for the Log Ingestion and Querying System. It provides RESTful API endpoints for ingesting and querying log data.

## Features

- Ingest log entries via HTTP POST requests
- Query logs with advanced filtering and search capabilities
- Full-text search across log messages
- Filter by log level, resource ID, timestamp range, and more
- Persistent storage using a JSON file
- Request validation and error handling
- Structured logging

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

The application can be configured using environment variables:

- `PORT`: Port number for the server (default: 3000)
- `NODE_ENV`: Environment mode (development/production, default: development)
- `LOG_LEVEL`: Logging level (error, warn, info, http, debug, default: info)

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start the server with nodemon for automatic reloading during development.

### Production Mode

```bash
npm start
```

## API Documentation

### Base URL

All endpoints are prefixed with `/api`.

### Endpoints

#### Ingest Log

- **URL**: `/logs`
- **Method**: `POST`
- **Description**: Create a new log entry
- **Request Body**:
  ```json
  {
    "level": "info",
    "message": "Application started",
    "resourceId": "server-1234",
    "timestamp": "2023-09-15T08:00:00Z",
    "traceId": "abc-xyz-123",
    "spanId": "span-456",
    "commit": "5e5342f",
    "metadata": {
      "parentResourceId": "server-5678"
    }
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "level": "info",
    "message": "Application started",
    "resourceId": "server-1234",
    "timestamp": "2023-09-15T08:00:00.000Z",
    "traceId": "abc-xyz-123",
    "spanId": "span-456",
    "commit": "5e5342f",
    "metadata": {
      "parentResourceId": "server-5678"
    }
  }
  ```

#### Query Logs

- **URL**: `/logs`
- **Method**: `GET`
- **Description**: Retrieve logs with optional filtering
- **Query Parameters**:
  - `level`: Filter by log level (error, warn, info, debug)
  - `message`: Full-text search in log messages (case-insensitive)
  - `resourceId`: Filter by resource ID
  - `timestamp_start`: Filter logs after this timestamp (ISO 8601)
  - `timestamp_end`: Filter logs before this timestamp (ISO 8601)
  - `traceId`: Filter by trace ID
  - `spanId`: Filter by span ID
  - `commit`: Filter by commit hash
- **Example**: `GET /api/logs?level=error&message=database`
- **Success Response**: `200 OK`
  ```json
  [
    {
      "level": "error",
      "message": "Database connection failed",
      "resourceId": "server-1234",
      "timestamp": "2023-09-15T08:05:00.000Z",
      "traceId": "def-uvw-456",
      "spanId": "span-789",
      "commit": "7a8b9c0",
      "metadata": {}
    }
  ]
  ```

#### Health Check

- **URL**: `/health`
- **Method**: `GET`
- **Description**: Check if the service is running
- **Success Response**: `200 OK`
  ```json
  {
    "status": "ok",
    "timestamp": "2023-09-15T08:00:00.000Z"
  }
  ```

## Data Storage

Logs are stored in the `logs/logs.json` file in the project root directory. The file is automatically created when the server starts if it doesn't exist.

## Logging

The application uses Winston for structured logging. Logs are written to both the console and log files in the `logs` directory:

- `combined.log`: All logs
- `error.log`: Error logs only
- `exceptions.log`: Uncaught exceptions
- `rejections.log`: Unhandled promise rejections

## Error Handling

The API returns appropriate HTTP status codes and error messages in the response body when errors occur.

## Testing

To run the test suite:

```bash
npm test
```

## License

MIT
