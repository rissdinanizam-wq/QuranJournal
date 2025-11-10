const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// lokasi data tempatan
const dataPath = path.join(app.getPath('userData'), 'journal.json');
function ensureFile() {
  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify({ notes: [] }, null, 2));
}
function readNotes() {
  ensureFile();
  return JSON.parse(fs.readFileSync(dataPath, 'utf8')).notes;
}
function writeNotes(notes) {
  fs.writeFileSync(dataPath, JSON.stringify({ notes }, null, 2));
}

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,  
      nodeIntegration: false,
      sandbox: false            
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// CRUD handlers
ipcMain.handle('notes:read', () => readNotes());
ipcMain.handle('notes:add', (e, note) => {
  const notes = readNotes();
  note.id = Date.now();
  notes.push(note);
  writeNotes(notes);
  return note;
});
ipcMain.handle('notes:update', (e, id, updated) => {
  const notes = readNotes().map(n => (n.id === id ? { ...n, ...updated } : n));
  writeNotes(notes);
  return true;
});
ipcMain.handle('notes:delete', (e, id) => {
  const notes = readNotes().filter(n => n.id !== id);
  writeNotes(notes);
  return true;
});
