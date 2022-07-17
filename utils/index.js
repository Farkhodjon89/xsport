export const getPrice = (product) => {
  const normalPrice = product.woocsRegularPrice;
  const salePrice = product.woocsSalePrice;
  return {
    normalPrice,
    salePrice,
  };
};

export const getFormat = (
  number,
  floatingDigits = 0,
  splitBy = 3,
  splitter = " ",
  floatingSplitter = "."
) => {
  const re = `\\d(?=(\\d{${splitBy}})+${floatingDigits > 0 ? "\\D" : "$"})`;
  const num = (typeof number === "number" ? number : parseInt(number)).toFixed(
    Math.max(0, ~~floatingDigits)
  );

  return (floatingSplitter ? num.replace(".", floatingSplitter) : num).replace(
    new RegExp(re, "g"),
    `$&${splitter}`
  );
};

export const getDiscount = (normalPrice, salePrice) =>
  Math.round(
    ((parseInt(normalPrice) - parseInt(salePrice)) * 100) /
      parseInt(normalPrice)
  );

export const chunk = (array, size) => {
  const chunked_arr = [];
  let index = 0;
  while (index < array.length) {
    chunked_arr.push(array.slice(index, size + index));
    index += size;
  }
  return chunked_arr;
};

export const addZero = number =>
  String(number).length === 1 ? `0${number}` : String(number)

export const formatDate = date => {
  const day = addZero(date.getDate())
  const month = addZero(date.getMonth() + 1)
  const year = date.getFullYear()

  return [day, month, year].join('.')
}

export const humanReadableDate=(dateInput)=>{
  const newDate=new Date(dateInput)
  let months = ['Янв','Феб','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
  const year = newDate.getFullYear();
  const month = months[newDate.getMonth()];
  const date = newDate.getDate();
  const hour = newDate.getHours();
  const min = newDate.getMinutes();
  const sec = newDate.getSeconds();
  const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}


export const formatOrder = order => {
  const statusesMap = {
    CANCELLED: 'Отменен',
    COMPLETED: 'Выполнен',
    COURIER: 'Передан курьеру',
    FAILED: 'Не удался',
    ON_HOLD: 'На удержании',
    PAID: 'Оплачено',
    PENDING: 'В ожидании оплаты',
    PROCESS: 'В обработке',
    PROCESSING: 'Обрабатывается',
    REFUNDED: 'Возвращен'
  }

  order.total = order.total.replace('&nbsp;UZS', '').replace(' ', '')

  return {
    id: order.databaseId,
    date: formatDate(new Date(order.date.replace('+00:00', '+05:00'))),
    total: getFormat(order.total || '100000'),
    status: statusesMap[order.status.toUpperCase()] || order.status,
    lineItems: (order.lineItems && order.lineItems.nodes) || [],
    
    subtotal: order.subtotal && formatPrice(reformatPrice(order.subtotal)),
    shippingTotal:
      order.shippingTotal && formatPrice(reformatPrice(order.shippingTotal)),
    firstName: order.billing && order.billing.firstName,
    phone: order.billing && order.billing.phone,
    address: order.shipping && order.shipping.address1,
    customerNote: order.customerNote
  }
}


export const formatPost = (wooPost, slice = false) => ({
  ...wooPost,
  date: new Date(wooPost.date)
    .toLocaleDateString()
    .split('-')
    .reverse()
    .join('.'),
  content: slice
    ? `${wooPost.content.replace(/^\n|\n$/g, '').slice(0, 130)}...`
    : wooPost.content.replace(/^\n|\n$/g, ''),
});