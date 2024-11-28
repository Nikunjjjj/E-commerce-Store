import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    // Sort orders by date in descending order
    const sortedOrders = savedOrders.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    setOrders(sortedOrders);
  }, []);

  const generatePdfInvoice = (order) => {
    const doc = new jsPDF();

    // Add header
    doc.setFontSize(18);
    doc.text("Order Invoice", 20, 20);

    // Add order details
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.orderId}`, 20, 30);
    doc.text(`Ordered on: ${new Date(order.date).toLocaleDateString()}`, 20, 40);
    doc.text(`Total Amount: $${order.amount.toFixed(2)}`, 20, 50);
    doc.text(`Payment ID: ${order.paymentId}`, 20, 60);

    // Add order items
    doc.text("Order Items:", 20, 80);
    let y = 90;
    order.items.forEach((item) => {
      doc.text(`${item.title} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`, 30, y);
      y += 10;
    });

    // Save the PDF
    doc.save(`Order_${order.orderId}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h2>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      Ordered on{" "}
                      <span className="font-medium text-gray-900">
                        {new Date(order.date).toLocaleDateString()}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Order ID:{" "}
                      <span className="font-medium text-gray-900">
                        {order.orderId}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Total Amount:{" "}
                      <span className="font-semibold text-gray-900">
                        ${order.amount.toFixed(2)}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Payment ID:{" "}
                      <span className="font-medium text-gray-900">
                        {order.paymentId}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Order Items
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-start space-x-4 py-4 border-b border-gray-200 last:border-0"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-24 h-24 object-contain rounded-md border border-gray-200"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-medium text-gray-900 mb-1">
                          {item.title}
                        </h4>
                        <div className="flex items-center space-x-4">
                          <p className="text-sm text-gray-500">
                            Quantity:{" "}
                            <span className="font-medium">{item.quantity}</span>
                          </p>
                          <p className="text-sm text-gray-500">
                            Price:{" "}
                            <span className="font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                <div className="flex space-x-4">
                  <button onClick={() => generatePdfInvoice(order)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    Download Invoice
                  </button>
                </div>
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Delivered
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="mt-2 text-base text-gray-500">
            No recent orders found.
          </p>
          <button
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
