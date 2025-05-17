export const BidTable = ({
  bids,
  selected,
}: {
  bids: [string, string][];
  selected: boolean;
}) => {
  let currentTotal = 0;

  const relevantBids = bids.slice(0, selected ? 20 : 10);

  const bidsWithTotal: [string, string, number][] = relevantBids.map(
    ([price, quantity]) => [price, quantity, (currentTotal += Number(quantity))]
  );
  const maxTotal = relevantBids.reduce(
    (acc, [_, quantity]) => acc + Number(quantity),
    0
  );

  return (
    <div>
      {bidsWithTotal?.map(([price, quantity, total]) => (
        <Bid
          maxTotal={maxTotal}
          total={total}
          key={price}
          price={price}
          quantity={quantity}
        />
      ))}
    </div>
  );
};

function Bid({
  price,
  quantity,
  total,
  maxTotal,
}: {
  price: string;
  quantity: string;
  total: number;
  maxTotal: number;
}) {
  const lightWidth = (total / maxTotal) * 100;
  const darkWidth = (+quantity / maxTotal) * 100;
  return (
    <div className="space-y-1 text-sm pt-1">
      <div className="relative flex justify-between px-2">
        <div
          className="absolute right-0 top-0 h-full bg-green-900 opacity-35"
          style={{ width: `${lightWidth}%` }}
        />
        <div
          className="absolute right-0 top-0 h-full bg-green-900 opacity-90"
          style={{ width: `${darkWidth}%` }}
        />
        <span className="text-green-400 z-10">{Number(price).toFixed(2)}</span>
        <span className="z-10">{Number(quantity).toFixed(2)}</span>
        <span className="z-10">{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
