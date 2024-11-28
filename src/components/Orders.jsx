import { useState, useEffect } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Retrieve orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    // Sort orders by date in descending order
    const sortedOrders = savedOrders.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    // Get the 3 most recent orders
    setOrders(sortedOrders);
  }, []);

  return (
    <div className="mt-10 bg-white shadow-lg rounded-lg p-6 ">
      <h2 className="text-3xl font-bold text-gray-800 ">Recent Orders</h2>
      {orders.length > 0 ? (
        <div className="">
          {orders.map((order, index) => (
            <div
              key={index}
              className="border-b border-gray-200 py-4 last:border-b-0 flex justify-between"
            >
              <div>
                <h3 className="text-gray-800 font-medium mb-2">
                  Ordered Items
                </h3>
                {order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center mb-2">
                    <img
                      src={item.image}
                      alt={`Item ${itemIndex + 1}`}
                      className="w-16 h-16 object-contain mr-4 rounded"
                    />
                    <div>
                      <p className="text-gray-600 text-base">{item.title}</p>
                      <p className="text-gray-600 text-base">
                        Quantity:{" "}
                        <span className="font-medium">{item.quantity}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-20">
                <p className="text-gray-600 text-base">
                  Order ID: <span className="font-medium">{order.orderId}</span>
                </p>
                <p className="text-gray-600 text-base">
                  Payment ID:{" "}
                  <span className="font-medium">{order.paymentId}</span>
                </p>
                <p className="text-gray-600 text-base">
                  Amount:{" "}
                  <span className="font-medium">
                    ${order.amount.toFixed(2)}
                  </span>
                </p>
                <p className="text-gray-600 text-base">
                  Date:{" "}
                  <span className="font-medium">
                    {new Date(order.date).toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-base">No recent orders found.</p>
      )}
    </div>
  );
};

export default Orders;
