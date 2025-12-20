import type { PingResponse } from '../shared/ipc';

declare global {
  interface Window {
    mcoda?: {
      ping: () => Promise<PingResponse>;
    };
  }
}

export {};
