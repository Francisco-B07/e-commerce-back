import { createPreference, getMerchantOrder } from "lib/mercadopago";
import { Order } from "models/order";
import { searchProductById } from "./products";
import * as sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_KEY);

type createOrderRes = {
  url: string;
  orderId: string;
};

export async function createOrder(
  userId: string,
  productId: string,
  aditionalInfo
): Promise<createOrderRes> {
  const product = (await searchProductById(productId)) as any;

  if (!product) {
    throw "el producto no existe";
  }

  const order = await Order.createNewOrder({
    aditionalInfo,
    productId,
    userId: userId,
    status: "pending",
  });
  await order.pull();

  const pref = await createPreference({
    items: [
      {
        title: product.object.name,
        description: product.object.description,
        category_id: product.object.type,
        quantity: 1,
        currency_id: "ARS",
        unit_price: product.object.unitCost,
      },
    ],

    back_urls: {
      success:
        "https://e-commerce-front-jmsfc84e4-francisco-b07.vercel.app/thanks",
    },
    external_reference: order.id,
    notification_url:
      "https://e-commerce-back-inky.vercel.app/api/ipn/mercadopago",
  });
  return { url: pref.init_point, orderId: order.id };
}

export async function getOrders(token) {
  const orders = await Order.findOfUser(token.userId);
  if (orders) {
    return orders;
  } else {
    throw "Ordenes no encontradas";
  }
}

export async function getOrderById(orderId) {
  const order = await Order.findById(orderId);
  const data = await order.data();

  if (order) {
    return data;
  } else {
    throw "Orden no encontrada";
  }
}

async function sendEmailComprador(email: string) {
  const msg = {
    to: email as string,
    from: "franciscojburgoa@gmail.com",
    subject: "Compra realizada",
    text: "Compra realizada",
    html: `
      <p>Tu pago fué confirmado</p>
      `,
  };

  try {
    await sgMail.send(msg);
  } catch (err) {
    console.error(err.code, err.message);
  }
}
async function sendEmailVendedor() {
  const msg = {
    to: "franciscojburgoa@gmail.com",
    from: "franciscojburgoa@gmail.com",
    subject: "Un usuario realizo una compra",
    text: "Un usuario realizo una compra",
    html: `
      <p>Un usuario realizo una compra</p>
      `,
  };

  try {
    await sgMail.send(msg);
  } catch (err) {
    console.error(err.code, err.message);
  }
}

export async function completeOperation(topic, id) {
  if (topic == "merchant_order") {
    const order = await getMerchantOrder(id);

    if (order.order_status == "paid") {
      const orderId = order.external_reference;
      const myOrder = new Order(orderId);
      await myOrder.pull();
      myOrder.data.status = "closed";
      myOrder.data.externalOrder = order;
      await myOrder.push();
      // await sendEmailComprador(order.collector.email);
      await sendEmailVendedor();
    }
  }
}
