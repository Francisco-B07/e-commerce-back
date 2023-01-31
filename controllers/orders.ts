import { createPreference } from "lib/mercadopago";
import { Order } from "models/order";

type createOrderRes = {
  url: string;
};

const products = {
  1234: {
    title: "termo",
    price: 1000,
  },
};

export async function createOrder(
  userId: string,
  productId: string,
  aditionalInfo
): Promise<createOrderRes> {
  const product = products[productId];
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
        title: product.title,
        description: "Dummy description",
        picture_url: "http://www.myapp.com/myimage.jpg",
        category_id: "car_electronics",
        quantity: 1,
        currency_id: "ARS",
        unit_price: product.price,
      },
    ],

    back_urls: {
      success:
        "https://apx.school/player/dwf/ecommerce-backend/f914b78b-59eb-4799-9b2f-4eb759c4ec1e",
    },
    external_reference: order.id,
    notification_url:
      "https://e-commerce-back-inky.vercel.app/api/webhooks/mercadopago",
  });
  return { url: pref.init_point };
}
