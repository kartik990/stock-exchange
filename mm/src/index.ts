import axios from "axios";

const BASE_URL = "http://localhost:3001";
const TOTAL_BIDS = 40;
const TOTAL_ASK = 40;
const MARKET = "TATA_INR";
const USERS = ["1", "2", "3", "4"];
const PRECISION = 2;

let direction = 1;
let deviation = 0;

setInterval(() => {
  deviation += direction * (5 + Math.ceil(Math.random() * 20));

  if (
    deviation > 100 + Math.ceil(Math.random() * 100) ||
    deviation < -40 - Math.ceil(Math.random() * 50)
  )
    direction *= -1;
}, 60 * 1000);

const factor = Math.pow(10, PRECISION);

function getRandomFloat(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * factor) / factor;
}

async function main() {
  const price = getRandomFloat(100.1 + deviation, 101.5 + deviation);

  const randomIndex = Math.floor(Math.random() * USERS.length);
  const USER_ID = USERS[randomIndex];

  const openOrders = await axios.get(
    `${BASE_URL}/api/v1/order/open?userId=${USER_ID}&market=${MARKET}`
  );

  const totalBids = openOrders.data.filter((o: any) => o.side === "buy").length;
  const totalAsks = openOrders.data.filter(
    (o: any) => o.side === "sell"
  ).length;

  const cancelledBids = await cancelBidsMoreThan(openOrders.data, price);
  const cancelledAsks = await cancelAsksLessThan(openOrders.data, price);

  let bidsToAdd = TOTAL_BIDS - totalBids - cancelledBids;
  let asksToAdd = TOTAL_ASK - totalAsks - cancelledAsks;

  while (bidsToAdd > 0 || asksToAdd > 0) {
    const quantity = getRandomFloat(10, 50);

    if (bidsToAdd > 0) {
      const orderPrice = getRandomFloat(100.1 + deviation, 101.5 + deviation);
      await axios.post(`${BASE_URL}/api/v1/order`, {
        market: MARKET,
        price: orderPrice,
        quantity: quantity,
        side: "buy",
        userId: USER_ID,
      });
      bidsToAdd--;

      console.log("buy", USER_ID, quantity, orderPrice);
    }

    if (asksToAdd > 0) {
      const orderPrice = getRandomFloat(100.1 + deviation, 101.5 + deviation);

      await axios.post(`${BASE_URL}/api/v1/order`, {
        market: MARKET,
        price: orderPrice,
        quantity: quantity,
        side: "sell",
        userId: USER_ID,
      });
      asksToAdd--;

      console.log("sell", USER_ID, quantity, orderPrice);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 100));

  main();
}

async function cancelBidsMoreThan(openOrders: any[], price: number) {
  let promises: any[] = [];
  openOrders.map((o) => {
    if (o.side === "buy" && o.price > price && Math.random() < 0.33) {
      promises.push(
        axios.delete(`${BASE_URL}/api/v1/order`, {
          data: {
            orderId: o.orderId,
            market: MARKET,
          },
        })
      );
    }
  });
  await Promise.all(promises);
  return promises.length;
}

async function cancelAsksLessThan(openOrders: any[], price: number) {
  let promises: any[] = [];
  openOrders.map((o) => {
    if (o.side === "sell" && o.price < price && Math.random() < 0.33) {
      promises.push(
        axios.delete(`${BASE_URL}/api/v1/order`, {
          data: {
            orderId: o.orderId,
            market: MARKET,
          },
        })
      );
    }
  });

  await Promise.all(promises);
  return promises.length;
}

main();
