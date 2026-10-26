import { useState, useEffect, useCallback } from 'react';

export interface MobileAlert {
  id: string;
  title: string;
  body: string;
  ticker?: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
  read?: boolean;
}

export function useMobileNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [alerts, setAlerts] = useState<MobileAlert[]>([
    {
      id: 'init-1',
      title: 'BBRI: Cum Dividen Interim Rp84 Hari Ini',
      body: 'Cum date dividen interim Rp84/saham di pasar reguler. Penutupan sesi 2.',
      ticker: 'BBRI',
      impact: 'HIGH',
      timestamp: '08:12 WIB',
      read: false,
    },
    {
      id: 'init-2',
      title: 'LME Nickel Rebound +1.94%',
      body: 'Katalis penguatan untuk ANTM, INCO, MBMA pada perdagangan sesi pre-opening.',
      ticker: 'ANTM',
      impact: 'HIGH',
      timestamp: '07:30 WIB',
      read: true,
    },
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Web Audio API Synthesizer Chime
  const playChime = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Pleasant high double chime (market opening bell tone)
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now); // A5
      osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.15); // E6

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1760, now + 0.1); // A6
      osc2.frequency.exponentialRampToValueAtTime(2200, now + 0.3);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.08);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.warn('Web Audio chime not permitted or failed', e);
    }
  }, [soundEnabled]);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Browser Anda tidak mendukung Web Notification API.');
      return 'denied';
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      return res;
    } catch {
      return 'denied';
    }
  };

  const dispatchAlert = useCallback(
    (alertData: Omit<MobileAlert, 'id' | 'timestamp' | 'read'>) => {
      const newAlert: MobileAlert = {
        ...alertData,
        id: 'alert-' + Date.now(),
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        read: false,
      };

      setAlerts((prev) => [newAlert, ...prev]);
      playChime();

      // Trigger Native Web Notification if permitted
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          const notification = new Notification(`⚡ IDX ALERT: ${newAlert.title}`, {
            body: newAlert.body,
            icon: '/icon.svg',
            badge: '/icon.svg',
            tag: newAlert.id,
          });

          notification.onclick = () => {
            window.focus();
            notification.close();
          };
        } catch (e) {
          console.warn('Notification display failed', e);
        }
      }

      return newAlert;
    },
    [playChime]
  );

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const unreadCount = alerts.filter((a) => !a.read).length;

  return {
    permission,
    requestPermission,
    soundEnabled,
    setSoundEnabled,
    playChime,
    alerts,
    dispatchAlert,
    markAllAsRead,
    clearAlerts,
    unreadCount,
  };
}
