"use client";
import { getOrders } from "@/utils/httpClient";
import { Order } from "@/utils/types";
import React, { useEffect, useState } from "react";

export default function PortfolioPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    getOrders("5").then((rows) => {
      setOrders(rows);
    });
  }, []);

  return (
    <div className="bg-gray-800 p-10 shadow-lg border border-gray-700">
      <div className="w-full bg-gray-700 rounded-xl overflow-auto custom-scroll min-h-[75vh] max-h-[50vh] shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Order List</h2>
        <table className="min-w-full text-sm text-left table-auto">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-2">Market</th>
              <th className="px-4 py-2">Side</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Filled</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-800">
                <td className="px-4 py-2">{order.market}</td>
                <td className="px-4 py-2">
                  <span
                    className={`font-medium ${
                      order.side === "buy" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {order.side.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-2">{order.price.toFixed(2)}</td>
                <td className="px-4 py-2">{order.quantity.toFixed(2)}</td>
                <td className="px-4 py-2">
                  {order.filled_quantity.toFixed(2)}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === "open"
                        ? "bg-blue-100 text-blue-600"
                        : order.status === "partial"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "filled"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {new Date(order.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-500">No orders found.</div>
        )}
      </div>
    </div>
  );
}
