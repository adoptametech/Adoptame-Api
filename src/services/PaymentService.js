import axios from 'axios';
import "dotenv/config";

const {
  MERCADOPAGO_ACCESS_TOKEN,
  ULR_DEPLOYED_FRONTEND,
  URL_DEPLOYED_BACKEND,
  APP_ID_MERCADOPAGO
} = process.env;

export const newPreferentialPaymentService = async (dataBody) => {

  const url = "https://api.mercadopago.com/checkout/preferences";

  const {
    items,
    payer,
    metadata
  } = dataBody;

  const body = {
    items,
    payer,
    auto_return: "all", // solo a pagos aprobados
    back_urls: {
      success: `${ULR_DEPLOYED_FRONTEND}/sponsor/confirm`,
      failure: `${ULR_DEPLOYED_FRONTEND}`,
      pending: `${ULR_DEPLOYED_FRONTEND}`
    },
    metadata,
    notification_url: `${URL_DEPLOYED_BACKEND}/api/v1.0/donations?source_news=webhooks`,
    external_reference: APP_ID_MERCADOPAGO
  }
  const { data } = await axios.post(url, body, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
    }
  });

  return data.init_point;
}

export const getPaymentByIdService = async (idPaymet) => {

  const url = `https://api.mercadopago.com/v1/payments/${idPaymet}`;

  const { data } = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
    }
  });

  return data;
}

export const getPaymentsService = async () => {

  const sort = 'date_created'
  const criteria = 'desc'
  const external_reference = APP_ID_MERCADOPAGO

  const url = `https://api.mercadopago.com/v1/payments/search?sort=${sort}&criteria=${criteria}&external_reference=${external_reference}`;

  const { data } = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
    }
  });

  return data.results;
}
