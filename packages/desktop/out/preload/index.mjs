import { contextBridge, ipcRenderer } from "electron";
const ipcChannels = {
  ping: "app:ping"
};
contextBridge.exposeInMainWorld("mcoda", {
  ping: () => ipcRenderer.invoke(ipcChannels.ping)
});
