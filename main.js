const electron = require('electron');
const path = require('path');
const url = require('url');

const {app, BrowserWindow} = electron;
let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'main.html'),
        protocol: 'file:',
        slashes:true
    }))
});