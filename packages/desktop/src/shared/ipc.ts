export const ipcChannels = {
  ping: 'app:ping'
} as const;

export type PingResponse = {
  ok: true;
  message: string;
  appVersion: string;
};
