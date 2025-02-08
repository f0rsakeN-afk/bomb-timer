# 1. Build the Docker image
docker-compose build

# 2. Run the build
docker-compose run --rm electron-builder npm run build

# 3. Fix permissions on dist folder
sudo chown -R $USER:$USER dist/

# To clean up (optional)
docker-compose down