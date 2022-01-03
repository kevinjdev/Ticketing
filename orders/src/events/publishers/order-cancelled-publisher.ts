import {
  Subjects,
  Publisher,
  OrderCancelledEvent,
} from '@kjticketsproject/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
