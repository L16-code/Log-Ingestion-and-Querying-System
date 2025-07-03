# Log Ingestion and Querying System

A full-stack application for ingesting, storing, and querying log data with a modern web interface.

## Overview

This system provides a centralized platform for:
- Ingesting log data through a RESTful API
- Storing logs in a file-based JSON format
- Querying and filtering logs through an intuitive web interface
- Visualizing log data with filtering and search capabilities

## Features

- **Log Ingestion**: REST API endpoint for submitting log entries
- **Log Querying**: Advanced filtering and search capabilities
- **Real-time Updates**: Web interface updates in real-time
- **Responsive Design**: Works on desktop and mobile devices
- **Log Levels**: Support for different log levels (info, warn, error, debug)
- **Metadata Support**: Additional context through metadata fields

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Git

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   PORT=3000
   LOG_FILE=./logs/logs.json
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Start the Backend Server

1. From the backend directory:
   ```bash
   npm start
   ```
   The server will start on `http://localhost:3000`

### Start the Frontend Development Server

1. From the frontend directory:
   ```bash
   npm start
   ```
   The application will open in your default browser at `http://localhost:3001`

## API Endpoints

### Ingest Logs
```
POST /api/logs
Content-Type: application/json

{
  "level": "error",
  "message": "Failed to connect to DB",
  "resourceId": "server-1234",
  "timestamp": "2023-09-15T08:00:00Z",
  "traceId": "abc-xyz-123",
  "spanId": "span-456",
  "commit": "5e5342f",
  "metadata": {
    "parentResourceId": "server-0987"
  }
}
```

### Query Logs
```
GET /api/logs?level=error&resourceId=server-1234&search=failed
```

## Design Decisions

### Backend
- **File-based Storage**: Chosen for simplicity and to avoid external database dependencies
- **Express.js**: Lightweight and flexible Node.js web framework
- **In-memory Processing**: For faster query responses with reasonable dataset sizes
- **Structured Logging**: Enforces consistent log format and validation

### Frontend
- **React**: For building a dynamic and responsive user interface
- **Material-UI (MUI)**: For consistent and professional UI components
- **React Query**: For efficient data fetching and state management
- **TypeScript**: For type safety and better developer experience

## Performance Considerations

- **Pagination**: Implemented for handling large log datasets
- **Debounced Search**: Reduces unnecessary API calls during typing
- **Efficient Filtering**: Server-side filtering reduces client-side processing

## Testing

### Backend Tests
Run the test suite:
```bash
cd backend
npm test
```

### Frontend Tests
Run the test suite:
```bash
cd frontend
npm test
```

## Future Improvements

- Add user authentication and authorization
- Implement log rotation for the JSON file
- Add more advanced filtering and aggregation
- Implement log export functionality
- Add support for custom log formats

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request