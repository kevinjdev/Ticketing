import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@kjticketsproject/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
