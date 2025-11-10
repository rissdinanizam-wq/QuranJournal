const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  readNotes: () => ipcRenderer.invoke('notes:read'),
  addNote: (note) => ipcRenderer.invoke('notes:add', note),
  updateNote: (id, data) => ipcRenderer.invoke('notes:update', id, data),
  deleteNote: (id) => ipcRenderer.invoke('notes:delete', id)
});
