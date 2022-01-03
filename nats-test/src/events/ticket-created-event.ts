import { Subjects } from './subjects';

export interface TicketCreatedEvent {
  subject: Subjects.TicketCrated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
