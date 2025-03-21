// src/preload.ts
import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    log: (message: string) => console.log(message),
});
