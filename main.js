const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1440, height: 920, minWidth: 1050, minHeight: 700,
    backgroundColor: '#f4f7fb',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadFile('index.html');
}
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

ipcMain.handle('export-pdf', async (event, html) => {
  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'Export resume as PDF',
    defaultPath: 'My-Resume.pdf',
    filters: [{ name: 'PDF file', extensions: ['pdf'] }]
  });
  if (canceled || !filePath) return { canceled: true };
  const pdfWindow = new BrowserWindow({ show: false, webPreferences: { sandbox: true } });
  try {
    await pdfWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
    const data = await pdfWindow.webContents.printToPDF({
      printBackground: true, pageSize: 'A4',
      margins: { top: 0.25, bottom: 0.25, left: 0.25, right: 0.25 }
    });
    fs.writeFileSync(filePath, data);
    return { canceled: false, filePath };
  } finally {
    if (!pdfWindow.isDestroyed()) pdfWindow.close();
  }
});
