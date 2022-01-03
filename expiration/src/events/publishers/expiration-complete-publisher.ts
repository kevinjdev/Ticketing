import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@kjticketsproject/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
