# Docker Setup for Monopoly Dashboard

This project has been dockerized for easy deployment and development. You can run the application using Docker in both production and development modes.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Quick Start

### Production Mode

To run the application in production mode:

```bash
# Build and start the production container
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

The application will be available at `http://localhost:3010`

### Development Mode

To run the application in development mode with hot reloading:

```bash
# Build and start the development container
docker-compose -f docker-compose.dev.yml up --build

# Or run in detached mode
docker-compose -f docker-compose.dev.yml up -d --build
```

## Docker Commands

### Building the Image

```bash
# Build production image
docker build -t monopoly-app .

# Build development image
docker build -f Dockerfile.dev -t monopoly-app-dev .
```

### Running Containers

```bash
# Run production container
docker run -p 3010:3010 monopoly-app

# Run development container
docker run -p 3010:3010 -v $(pwd):/app monopoly-app-dev
```

### Managing Containers

```bash
# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Remove containers and images
docker-compose down --rmi all
```

## Docker Files Explained

### Dockerfile
- Multi-stage build for optimized production image
- Uses Node.js 18 Alpine for smaller image size
- Implements security best practices with non-root user
- Enables Next.js standalone output for better performance

### Dockerfile.dev
- Single-stage build for development
- Includes all dependencies for development
- Mounts source code for hot reloading

### docker-compose.yml
- Production configuration
- Includes health checks
- Automatic restart policy

### docker-compose.dev.yml
- Development configuration
- Volume mounts for hot reloading
- Development server command

## Environment Variables

The following environment variables are set in the Docker containers:

- `NODE_ENV`: Set to `production` or `development`
- `NEXT_TELEMETRY_DISABLED`: Disabled for privacy
- `PORT`: Set to 3010
- `HOSTNAME`: Set to "0.0.0.0" for container networking

## Troubleshooting

### Port Already in Use
If port 3010 is already in use, you can change the port mapping in the docker-compose files:

```yaml
ports:
  - "3011:3011"  # Maps host port 3011 to container port 3011
```

### Permission Issues
If you encounter permission issues, ensure Docker has the necessary permissions to access your project directory.

### Build Failures
If the build fails, try:
1. Clear Docker cache: `docker system prune -a`
2. Rebuild without cache: `docker-compose build --no-cache`

## Production Deployment

For production deployment, consider:

1. Using a reverse proxy (nginx) in front of the Next.js app
2. Setting up proper environment variables
3. Implementing proper logging and monitoring
4. Using Docker volumes for persistent data if needed

## Security Notes

- The production container runs as a non-root user (nextjs)
- Only necessary files are copied to the container
- Dependencies are installed in a separate stage to reduce attack surface
- Telemetry is disabled for privacy 