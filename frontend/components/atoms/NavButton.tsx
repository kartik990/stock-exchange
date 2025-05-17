export default function NavButton({
  activeTab,
  setActiveTab,
  side,
}: {
  activeTab: string;
  side: "buy" | "sell";
  setActiveTab: any;
}) {
  if (side == "buy")
    return (
      <div
        className={`flex flex-col flex-1 cursor-pointer min-h-[66px] justify-center border-b-2 p-4 ${
          activeTab === "buy"
            ? "border-b-greenBorder bg-greenBackgroundTransparent"
            : "border-b-baseBorderMed hover:border-b-baseBorderFocus"
        }`}
        onClick={() => setActiveTab(side)}
      >
        <p className="text-center font-semibold capitalize text-greenText">
          {side}
        </p>
      </div>
    );

  if (side == "sell")
    return (
      <div
        className={`flex flex-col flex-1 cursor-pointer min-h-[66px]  justify-center border-b-2 p-4 ${
          activeTab === "sell"
            ? "border-b-redBorder bg-redBackgroundTransparent"
            : "border-b-baseBorderMed hover:border-b-baseBorderFocus"
        }`}
        onClick={() => setActiveTab(side)}
      >
        <p className="text-center font-semibold capitalize text-greenText">
          {side}
        </p>
      </div>
    );

  return null;
}
