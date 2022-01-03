import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from '@kjticketsproject/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
