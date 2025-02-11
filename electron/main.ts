import { app, BrowserWindow, Tray, Menu } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;
let tray: Tray | null;

function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 150,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    maximizable: false,
    backgroundColor: "#00000000",
    focusable: true,
    skipTaskbar: true,
    icon: path.join(__dirname, "../public/icons/icon.png"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  tray = new Tray(path.join(__dirname, "../public/icon-tray.png"));

  // Tray Menu
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show",
      click: () => {
        win?.show();
      },
    },
    {
      label: "Quit",
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip("Electron Tray App");
  tray.setContextMenu(contextMenu);

  // Ensure window stays on top
  win.setAlwaysOnTop(true, "screen-saver");
  win.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true,
  });

  win.moveTop();
  win.setFullScreenable(false);

  win.on("minimize", (event: Event) => {
    event.preventDefault();
    win?.restore();
  });

  win.on("blur", () => {
    win?.setAlwaysOnTop(true);
  });

  win.on("maximize", () => {
    win?.unmaximize();
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });
}

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.whenReady().then(createWindow);

  app.on("second-instance", () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
      win = null;
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}
