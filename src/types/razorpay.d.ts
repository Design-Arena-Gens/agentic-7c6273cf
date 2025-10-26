export {};

declare global {
  interface Window {
    Razorpay: new (
      options: {
        key: string;
        order_id: string;
        amount: number;
        currency: string;
        name: string;
        description?: string;
        notes?: Record<string, unknown>;
        prefill?: {
          name?: string;
          email?: string;
          contact?: string;
        };
        theme?: { color?: string };
        handler?: (response: unknown) => void;
      }
    ) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
      close: () => void;
    };
  }
}
