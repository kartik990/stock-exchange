import React from "react";

const TableHeader: React.FC = () => {
  return (
    <div className="flex justify-between text-xs px-2">
      <div className="text-white">Price</div>
      <div className="text-slate-400">Size</div>
      <div className="text-slate-400">Total</div>
    </div>
  );
};

export default TableHeader;
