// src/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    log: (message: string) => console.log(message),
    ipcRenderer: {
        on: (channel: string, listener: Electron.IpcRendererEventListener) => ipcRenderer.on(channel, listener),
        send: (channel: string, data: any) => ipcRenderer.send(channel, data)
    }
});
