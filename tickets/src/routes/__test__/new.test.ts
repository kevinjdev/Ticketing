import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({})
    //@ts-ignore
    .set('Cookie', global.signin());

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  // empty string for title
  await request(app)
    .post('/api/tickets')
    //@ts-ignore
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  // null title
  await request(app)
    .post('/api/tickets')
    //@ts-ignore
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  // empty string for title
  await request(app)
    .post('/api/tickets')
    //@ts-ignore
    .set('Cookie', global.signin())
    .send({
      title: 'kjddfa',
      price: -10,
    })
    .expect(400);
  // null title
  await request(app)
    .post('/api/tickets')
    //@ts-ignore
    .set('Cookie', global.signin())
    .send({
      title: 'kadsfl',
    })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  // add in a check to make sure a ticket was saved
  await request(app)
    .post('/api/tickets')
    //@ts-ignore
    .set('Cookie', global.signin())
    .send({
      title: 'ticket1',
      price: 20,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual('ticket1');
});

it('published an event', async () => {
  // add in a check to make sure a ticket was saved
  await request(app)
    .post('/api/tickets')
    //@ts-ignore
    .set('Cookie', global.signin())
    .send({
      title: 'ticket1',
      price: 20,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
