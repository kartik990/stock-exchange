export const AskTable = ({
  asks,
  selected,
}: {
  asks: [string, string][];
  selected: boolean;
}) => {
  let currentTotal = 0;
  const relevantAsks = asks.slice(0, selected ? 20 : 10);

  const asksWithTotal: [string, string, number][] = relevantAsks.map(
    ([price, quantity]) => [price, quantity, (currentTotal += Number(quantity))]
  );
  const maxTotal = relevantAsks.reduce(
    (acc, [_, quantity]) => acc + Number(quantity),
    0
  );

  asksWithTotal.reverse();

  return (
    <div>
      {asksWithTotal.map(([price, quantity, total]) => (
        <Ask
          maxTotal={maxTotal}
          key={price}
          price={price}
          quantity={quantity}
          total={total}
        />
      ))}
    </div>
  );
};

function Ask({
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
          className="absolute right-0 top-0 h-full bg-red-900 opacity-30"
          style={{ width: `${lightWidth}%` }}
        />
        <div
          className="absolute right-0 top-0 h-full bg-red-900 opacity-60"
          style={{ width: `${darkWidth}%` }}
        />
        <span className="text-red-400 z-10">{Number(price).toFixed(2)}</span>
        <span className="z-10">{Number(quantity).toFixed(2)}</span>
        <span className="z-10">{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
