import { Injectable, computed, signal } from '@angular/core';
import { Call, StreamVideoClient, User } from '@stream-io/video-client';

@Injectable({
  providedIn: 'root',
})
export class CallService {
  callId = signal<string | undefined>(undefined);
  call = computed<Call | undefined>(() => {
    const currentCallId = this.callId();
    if (currentCallId !== undefined) {
      const call = this.client.call('default', currentCallId);

      (async () => {
        try {
          await call.join({ create: true });
          await call.camera.enable();
          await call.microphone.enable();
        } catch (error) {
          console.error('Error joining or enabling devices:', error);
        }
      })();

      return call;
    } else {
      return undefined;
    }
  });

  client: StreamVideoClient;

  constructor() {
    const apiKey = '6z9r95ahppyg';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiQW5vdGhlclVzZXJJZCJ9.-jZILaLPDyN9qkTjiNkUnZURGg8w4PJ8x9vlT4Zo5Pw'; // Replace this with a secure token fetching method
    const user: User = { id: 'AnotherUserId' };
    this.client = new StreamVideoClient({ apiKey, user, token });
  }

  setCallId(callId: string | undefined) {
    if (callId === undefined) {
      this.call()?.leave();
    }
    this.callId.set(callId);
  }
}
