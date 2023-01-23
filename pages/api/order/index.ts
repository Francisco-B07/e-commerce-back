import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { User } from "lib/models/user";
import { Order } from "lib/models/order";
import { authMiddleware } from "lib/middlewares";
import { createPreference } from "lib/mercadopago";

const products = {
  1234: {
    title: "termo",
    price: 1000,
  },
};

async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const { productId } = req.query as any;
  const product = products[productId];
  if (!product) {
    res.status(404).json({ message: "el producto no existe" });
  }
  const order = await Order.createNewOrder({
    aditionalInfo: req.body,
    productId,
    userId: token.userId,
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
  res.send({ url: pref.init_point });
}

const handler = methods({
  post: postHandler,
});

export default authMiddleware(handler);
