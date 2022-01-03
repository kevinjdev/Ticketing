import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    //@ts-ignore
    .set('Cookie', global.signin())
    .send({
      title: 'kjlk',
      price: 20,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    // not authenticated
    .send({
      title: 'kjlk',
      price: 20,
    })
    .expect(401);
});
it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    //@ts-ignore
    .set('Cookie', global.signin())
    .send({
      title: 'adsfs',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    //@ts-ignore
    .set('Cookie', global.signin()) // signing in with a different user
    .send({
      title: 'newstring',
      price: 1000,
    })
    .expect(401); // because this is a different user
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  //@ts-ignore
  const cookie = global.signin();

  // create a ticket
  const response = await request(app)
    .post('/api/tickets')
    //@ts-ignore
    .set('Cookie', cookie)
    .send({
      title: 'adsfs',
      price: 20,
    });

  // invalid title
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  // invalid price
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'ddfdfd',
      price: -1,
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  //@ts-ignore
  const cookie = global.signin();

  // create a ticket
  const response = await request(app)
    .post('/api/tickets')
    //@ts-ignore
    .set('Cookie', cookie)
    .send({
      title: 'adsfs',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'newtitle',
      price: 200,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('newtitle');
  expect(ticketResponse.body.price).toEqual(200);
});

it('publishes an event', async () => {
  //@ts-ignore
  const cookie = global.signin();

  // create a ticket
  const response = await request(app)
    .post('/api/tickets')
    //@ts-ignore
    .set('Cookie', cookie)
    .send({
      title: 'adsfs',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'newtitle',
      price: 200,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
  //@ts-ignore
  const cookie = global.signin();

  // create a ticket
  const response = await request(app)
    .post('/api/tickets')
    //@ts-ignore
    .set('Cookie', cookie)
    .send({
      title: 'adsfs',
      price: 20,
    });

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'newtitle',
      price: 100,
    })
    .expect(400);
});
