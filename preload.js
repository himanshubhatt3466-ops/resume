const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('resumeApp', {
  exportPdf: (html) => ipcRenderer.invoke('export-pdf', html)
});
