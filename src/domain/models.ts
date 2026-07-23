export interface Client {
  id: string;
  name: string;
  credentials: Record<string, string>;
}

export interface Payment {
  id: string;
  clientId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
}
