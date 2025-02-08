#sound effects not working probably fix later on


# Bomb Timer Overlay

A customizable countdown timer overlay application built with Electron.

## Features

- Transparent overlay timer
- Customizable countdown duration
- Keyboard shortcuts for control
- Sound effects for different states
- Cross-platform support (Linux build instructions provided)

## Installation

### Prerequisites

- Docker
- Docker Compose

### Building from Source

1. Clone the repository:
```bash
git clone https://github.com/f0rsakeN-afk/bomb.git
cd bomb
```

2. Build using Docker:
```bash
chmod +x build.sh
./build.sh
```

This will create two packages in the `dist` folder:
- `bomb_1.0.0_amd64.deb` (Debian package)
- `Bomb Timer-1.0.0.AppImage` (Portable AppImage)

### Installation Methods

#### Method 1: Using .deb package
```bash
sudo dpkg -i dist/bomb_1.0.0_amd64.deb
```

#### Method 2: Using AppImage
```bash
chmod +x "dist/Bomb Timer-1.0.0.AppImage"
./dist/Bomb\ Timer-1.0.0.AppImage
```

## Usage

### Keyboard Controls
- `Space` - Start/Stop timer
- `Tab` - Reset timer to initial value
- `Escape` - Close application
- Type numbers directly to set time (when timer is not running)
- `Enter` - Confirm typed time
- `Backspace` - Delete while typing time

### Time Format
- Time is displayed in MM:SS format (minutes:seconds)
- Example: "02:30" for 2 minutes and 30 seconds

## Development

### Project Structure
```
bomb/
├── Dockerfile
├── docker-compose.yml
├── build.sh
├── icon.png
├── main.js
├── package.json
└── src/
    ├── assets/
    │   ├── digital_7_mono.ttf
    │   ├── armbomb.wav
    │   ├── beep.wav
    │   ├── doublebeep.wav
    │   └── explode.wav
    ├── index.html
    ├── index.css
    └── renderer.js
```

### Docker Commands

#### Build and Run
```bash
# Build Docker image
docker-compose build

# Run build process
docker-compose run --rm electron-builder npm run build

# Fix permissions
sudo chown -R $USER:$USER dist/
```

#### Clean Up
```bash
# Remove containers
docker-compose down

# Remove containers and images
docker-compose down --rmi all

# Remove dist folder
rm -rf dist/
```

#### Troubleshooting Docker
```bash
# Check Docker status
sudo systemctl status docker

# Start Docker if not running
sudo systemctl start docker

# View detailed build logs
docker-compose run --rm electron-builder npm run build --verbose
```

### Local Development
```bash
# Install dependencies
npm install

# Start application in development mode
npm start
```

## Cleaning Up

### Remove Built Files
```bash
rm -rf dist/
```

### Remove Docker Resources
```bash
# Remove containers and networks
docker-compose down

# Remove everything including images
docker-compose down --rmi all --volumes --remove-orphans
```

### Complete Cleanup
```bash
# Remove all related Docker resources
docker-compose down --rmi all --volumes --remove-orphans

# Remove dist folder
rm -rf dist/

# Remove node modules (if needed)
rm -rf node_modules/
```

## Notes

- The timer window is draggable across the screen
- Window stays on top of other applications
- Sound effects play at different stages of the countdown
- Background is fully transparent

## Troubleshooting

If the application doesn't start:
1. Check if it's installed correctly
2. Verify all dependencies are installed
3. Check system logs for errors
4. Try running from terminal to see error messages

For permission issues:
```bash
# Fix build script permissions
sudo chmod 777 build.sh

# Fix dist folder permissions
sudo chown -R $USER:$USER dist/
```

## License

ISC License

## Author

f0rsakeN-afk <nar3sh0@gmail.com># bomb-timer
