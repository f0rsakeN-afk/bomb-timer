const { app, BrowserWindow } = require("electron");
const path = require("path");
require("@electron/remote/main").initialize();

global.rootPath = app.isPackaged
    ? path.join(process.resourcesPath, "app")
    : __dirname;

function createWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 150,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        maximizable: false,
        icon: path.join(__dirname, "icon.png"),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
        },
    });
    require("@electron/remote/main").enable(win.webContents);

    win.loadFile("src/index.html");
    win.setAlwaysOnTop(true, "screen-saver");
    win.setVisibleOnAllWorkspaces(true);

    win.on("maximize", () => {
        win.unmaximize();
    });

    win.webContents.on("before-input-event", (event, input) => {
        if (input.key === "Escape") {
            win.close();
        }
    });
}

app.whenReady().then(() => {
    /*   if (process.platform === "linux") {
        app.setIcon(path.join(__dirname, "icon.png"));
      } */
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
