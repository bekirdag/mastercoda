import { contextBridge, ipcRenderer } from 'electron';
import { ipcChannels, type PingResponse } from '../shared/ipc';

contextBridge.exposeInMainWorld('mcoda', {
  ping: () => ipcRenderer.invoke(ipcChannels.ping) as Promise<PingResponse>
});
