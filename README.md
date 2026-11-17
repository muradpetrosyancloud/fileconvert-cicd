A simple Node.js application that converts CSV to JSON and JSON to CSV. I built this project mainly to practice Docker, GitHub Actions, and automated deployment on Google Cloud.

## Tech Stack

Node.js & Express | Docker | GitHub Actions | Google Cloud Compute Engine | SSH & IAP

## How It Works

The project uses GitHub Actions to automate testing, building, and deployment.

Whenever I push changes to the main branch:

1. **CI:** Installs dependencies, runs automated API tests, and builds a Docker image.
2. **CD:** If all checks pass, GitHub Actions securely connects to my GCP VM through IAP and SSH.
3. **Deployment:** The VM downloads the updated code, rebuilds the Docker image, and replaces the running container.
4. **Verification:** A health check confirms that the application is responding.

This allows me to deploy changes automatically without manually rebuilding or restarting Docker containers on the server.
