import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: '/api/payments/',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => {
      router.push('/orders');
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000); // don't use parentheses because we don't want to call the function, we want to pass
    // a reference to the function to setInterval

    // this function is called if a user navigates away from the page
    return () => {
      clearInterval(timerId);
    };
  }, [order]); // only run once by setting empty brackets

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }
  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51KBj5aFNyDGhkpbHC5HRzhOlob5i0TI1BP5sBfnOqFHVh0d5YvTBhpDdWKV91tomDCKv1mobtDIZMloPS5JRqMAD00S151WVvj"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  console.log('get initial props ordershow');
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
