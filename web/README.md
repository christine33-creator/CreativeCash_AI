# CreativeCash Web App

This is the web application for CreativeCash, a financial management tool for creative professionals.

## Features

- Income tracking and management
- Expense tracking and categorization
- Budget planning and monitoring
- Financial reports and analytics
- Tax estimation and planning
- Smart notifications

## Prerequisites

- Node.js 16 or higher
- npm 7 or higher
- Docker and Docker Compose (for containerized deployment)

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/creativecash.git
cd creativecash/web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will be available at http://localhost:3000

## Testing

Run the test suite:
```bash
npm test
```

## Building for Production

Build the production version:
```bash
npm run build
```

## Deployment

### Docker Deployment

1. Build and deploy using the deployment script:
```bash
./deploy.sh
```

2. Or manually build and deploy:
```bash
# Build the Docker image
docker build -t creativecash-web .

# Deploy using docker-compose
docker-compose up -d
```

### Manual Deployment

1. Build the production version:
```bash
npm run build
```

2. The built files will be in the `build` directory

3. Deploy the contents of the `build` directory to your web server

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_API_URL=http://localhost:3000/api
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 