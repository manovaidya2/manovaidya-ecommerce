// app/Pages/healing-orders/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { getData } from "@/app/services/FetchNodeServices";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FaEye, 
  FaCalendarAlt, 
  FaRupeeSign, 
  FaCheckCircle, 
  FaClock,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaShoppingBag,
  FaCreditCard,
  FaWhatsapp,
  FaDownload,
  FaShare,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import Swal from "sweetalert2";

export default function HealingOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("User_data");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchUserOrders(parsedUser._id);
    } else {
      Swal.fire({
        title: "Login Required",
        text: "Please login to view your orders",
        icon: "warning",
        confirmButtonText: "Login"
      }).then(() => {
        router.push("/Pages/Login");
      });
    }
  }, []);

  const fetchUserOrders = async (userId) => {
    try {
      setLoading(true);
      const response = await getData(`api/razorpay/get-user-orders/${userId}`);
      console.log("Healing orders response:", response);
      
      if (response.success) {
        setOrders(response.orders);
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to fetch your orders",
          icon: "error"
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      setModalLoading(true);
      const response = await getData(`api/razorpay/get-order/${orderId}`);
      console.log("Order details response:", response);
      
      if (response.success && response.order) {
        setSelectedOrder(response.order);
        setShowModal(true);
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to fetch order details",
          icon: "error"
        });
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong while fetching order details",
        icon: "error"
      });
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewDetails = (orderId) => {
    fetchOrderDetails(orderId);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f59e0b",
      processing: "#3b82f6",
      shipped: "#8b5cf6",
      delivered: "#10b981",
      cancelled: "#ef4444"
    };
    return colors[status] || "#6b7280";
  };

  const getPaymentStatusColor = (status) => {
    return status === 'success' ? '#10b981' : status === 'failed' ? '#ef4444' : '#f59e0b';
  };

  const getStatusIcon = (status) => {
    if (status === "delivered") return <FaCheckCircle style={{ color: "#10b981" }} />;
    if (status === "processing") return <FaClock style={{ color: "#3b82f6" }} />;
    if (status === "cancelled") return <FaClock style={{ color: "#ef4444" }} />;
    return <FaClock style={{ color: "#f59e0b" }} />;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const shareOrderDetails = () => {
    if (selectedOrder) {
      const shareText = `My Healing Order - ${selectedOrder.planDetails?.planName}\nOrder ID: ${selectedOrder.orderId}\nAmount: ₹${selectedOrder.planDetails?.amount}\nStatus: ${selectedOrder.orderStatus}`;
      if (navigator.share) {
        navigator.share({
          title: 'Healing Order Details',
          text: shareText,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(shareText);
        Swal.fire({
          title: "Copied!",
          text: "Order details copied to clipboard",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      }
    }
  };

  const downloadOrderReceipt = () => {
    // Create receipt content
    const receiptContent = `
      MANOVAIDYA HEALING ORDER RECEIPT
      ================================
      
      Order ID: ${selectedOrder.orderId}
      Order Date: ${formatDate(selectedOrder.createdAt)}
      
      PLAN DETAILS
      ------------
      Plan: ${selectedOrder.planDetails?.planName}
      Duration: ${selectedOrder.planDetails?.duration}
      Amount: ₹${selectedOrder.planDetails?.amount}
      
      CUSTOMER DETAILS
      ----------------
      Name: ${selectedOrder.userDetails?.name}
      Email: ${selectedOrder.userDetails?.email}
      Phone: ${selectedOrder.userDetails?.phone || 'N/A'}
      
      PAYMENT DETAILS
      ---------------
      Payment Status: ${selectedOrder.paymentStatus}
      Payment ID: ${selectedOrder.razorpayPaymentId || 'N/A'}
      Paid On: ${selectedOrder.paidAt ? formatDate(selectedOrder.paidAt) : 'N/A'}
      
      Thank you for choosing ManoVaidya!
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order_${selectedOrder.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    Swal.fire({
      title: "Downloaded!",
      text: "Receipt downloaded successfully",
      icon: "success",
      timer: 2000,
      showConfirmButton: false
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <div className="spinner"></div>
        <p>Loading your healing orders...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: "1200px", 
      margin: "0 auto", 
      padding: "20px",
      background: "#f5f5f5",
      minHeight: "100vh"
    }}>
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ color: "#722f7f", fontSize: "clamp(24px, 5vw, 32px)" }}>My Healing Orders</h1>
        <p style={{ fontSize: "clamp(14px, 4vw, 16px)" }}>Track your healing journey orders</p>
      </div>

      {orders.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "50px 20px", 
          background: "white", 
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <p style={{ fontSize: "16px", marginBottom: "20px" }}>You haven't placed any healing orders yet.</p>
          <Link href="/Pages/healing-duration" style={{ 
            display: "inline-block", 
            padding: "12px 24px", 
            background: "#722f7f", 
            color: "white", 
            textDecoration: "none", 
            borderRadius: "8px",
            fontWeight: "500"
          }}>
            Start Your Healing Journey
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {orders.map((order) => (
            <div key={order._id} style={{ 
              border: "1px solid #e0e0e0", 
              borderRadius: "12px", 
              padding: "clamp(15px, 4vw, 20px)",
              background: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer",
              ":hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }
            }}>
              <div style={{ 
                display: "flex", 
                flexDirection: window.innerWidth < 768 ? "column" : "row",
                justifyContent: "space-between", 
                alignItems: window.innerWidth < 768 ? "flex-start" : "start", 
                marginBottom: "15px",
                gap: "15px"
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 10px 0", color: "#333", fontSize: "clamp(18px, 5vw, 20px)" }}>
                    {order.planDetails?.planName}
                  </h3>
                  <p style={{ margin: "5px 0", color: "#666", fontSize: "14px", display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" }}>
                    <FaCalendarAlt style={{ marginRight: "5px" }} /> 
                    Order Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p style={{ margin: "5px 0", color: "#666", fontSize: "14px", display: "flex", alignItems: "center", gap: "5px" }}>
                    <FaRupeeSign style={{ marginRight: "5px" }} /> 
                    Amount: ₹{order.planDetails?.amount}
                  </p>
                </div>
                <div style={{ textAlign: window.innerWidth < 768 ? "left" : "right", width: window.innerWidth < 768 ? "100%" : "auto" }}>
                  <div style={{ 
                    display: "inline-flex", 
                    alignItems: "center", 
                    gap: "5px", 
                    padding: "4px 12px", 
                    borderRadius: "20px",
                    background: getStatusColor(order.orderStatus) + "20",
                    color: getStatusColor(order.orderStatus),
                    marginBottom: "8px",
                    fontSize: "12px"
                  }}>
                    {getStatusIcon(order.orderStatus)}
                    <span style={{ fontWeight: "bold" }}>{order.orderStatus?.toUpperCase()}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: "11px", color: "#666", display: "block" }}>Order ID: {order.orderId}</span>
                  </div>
                </div>
              </div>
              
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginTop: "15px",
                paddingTop: "15px",
                borderTop: "1px solid #e0e0e0",
                flexWrap: "wrap",
                gap: "10px"
              }}>
                <div>
                  <span style={{ color: "#666", fontSize: "14px" }}>Duration: </span>
                  <strong style={{ fontSize: "14px" }}>{order.planDetails?.duration}</strong>
                </div>
                <button
                  onClick={() => handleViewDetails(order._id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 20px",
                    background: "#722f7f",
                    color: "white",
                    borderRadius: "8px",
                    transition: "all 0.3s",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    width: window.innerWidth < 480 ? "100%" : "auto",
                    justifyContent: "center"
                  }}
                  onMouseEnter={(e) => e.target.style.background = "#5a2364"}
                  onMouseLeave={(e) => e.target.style.background = "#722f7f"}
                >
                  <FaEye /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mobile Responsive Modal Popup */}
      {showModal && selectedOrder && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          padding: "10px",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch"
        }} onClick={closeModal}>
          <div style={{
            background: "white",
            borderRadius: "16px",
            maxWidth: "90%",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            animation: "slideUp 0.3s ease"
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header - Sticky */}
            <div style={{
              background: "linear-gradient(135deg, #722f7f 0%, #5a2364 100%)",
              color: "white",
              padding: "clamp(15px, 4vw, 20px)",
              borderRadius: "16px 16px 0 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "sticky",
              top: 0,
              zIndex: 10,
              flexWrap: "wrap",
              gap: "10px"
            }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontSize: "clamp(18px, 5vw, 24px)" }}>Order Details</h2>
                <p style={{ margin: "5px 0 0 0", opacity: 0.9, fontSize: "clamp(11px, 3vw, 12px)" }}>
                  Order ID: {selectedOrder.orderId}
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={shareOrderDetails}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.3s"
                  }}
                  onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.3)"}
                  onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
                >
                  <FaShare size={16} />
                </button>
                <button
                  onClick={downloadOrderReceipt}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.3s"
                  }}
                  onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.3)"}
                  onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
                >
                  <FaDownload size={16} />
                </button>
                <button
                  onClick={closeModal}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.3s"
                  }}
                  onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.3)"}
                  onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
                >
                  <FaTimes size={18} />
                </button>
              </div>
            </div>

            {modalLoading ? (
              <div style={{ textAlign: "center", padding: "50px" }}>
                <div className="spinner"></div>
                <p style={{ marginTop: "15px", color: "#666" }}>Loading order details...</p>
              </div>
            ) : (
              <div style={{ padding: "clamp(15px, 4vw, 25px)" }}>
                {/* Success Message */}
                {selectedOrder.isPaid && selectedOrder.paymentStatus === 'success' && (
                  <div style={{
                    background: "#d4edda",
                    color: "#155724",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "14px",
                    flexWrap: "wrap"
                  }}>
                    <FaCheckCircle size={18} />
                    <div style={{ flex: 1 }}>
                      <strong>Payment Successful!</strong>
                      <p style={{ margin: "5px 0 0 0", fontSize: "12px" }}>Your healing journey has been confirmed.</p>
                    </div>
                  </div>
                )}

                {/* Mobile Responsive Layout - Single Column on Mobile */}
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column",
                  gap: "15px"
                }}>
                  
                  {/* Plan Details Card */}
                  <div style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "12px",
                    padding: "15px",
                    background: "#fafafa"
                  }}>
                    <h3 style={{ 
                      margin: "0 0 12px 0", 
                      color: "#722f7f",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "clamp(16px, 4vw, 18px)"
                    }}>
                      <FaShoppingBag /> Plan Details
                    </h3>
                    
                    <div>
                      <h4 style={{ margin: "0 0 8px 0", color: "#333", fontSize: "clamp(16px, 4vw, 18px)" }}>
                        {selectedOrder.planDetails?.planName}
                      </h4>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
                        <span style={{ 
                          background: "#e0e0e0", 
                          padding: "4px 10px", 
                          borderRadius: "20px",
                          fontSize: "12px"
                        }}>
                          Duration: {selectedOrder.planDetails?.duration}
                        </span>
                        {selectedOrder.planDetails?.savings > 0 && (
                          <span style={{ 
                            background: "#d4edda", 
                            color: "#155724", 
                            padding: "4px 10px", 
                            borderRadius: "20px",
                            fontSize: "12px"
                          }}>
                            Saved ₹{selectedOrder.planDetails?.savings}
                          </span>
                        )}
                      </div>
                      
                      {selectedOrder.planDetails?.description && (
                        <p style={{ color: "#666", fontSize: "13px", marginBottom: "10px", lineHeight: "1.5" }}>
                          {selectedOrder.planDetails.description}
                        </p>
                      )}
                      
                      {selectedOrder.planDetails?.features && selectedOrder.planDetails.features.length > 0 && (
                        <div>
                          <strong style={{ fontSize: "13px", display: "block", marginBottom: "8px" }}>Features:</strong>
                          <ul style={{ margin: "0", paddingLeft: "20px", fontSize: "12px", color: "#666" }}>
                            {selectedOrder.planDetails.features.slice(0, 3).map((feature, index) => (
                              <li key={index} style={{ marginBottom: "4px" }}>{feature}</li>
                            ))}
                            {selectedOrder.planDetails.features.length > 3 && (
                              <li style={{ color: "#722f7f" }}>+{selectedOrder.planDetails.features.length - 3} more features</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div style={{ 
                      borderTop: "1px solid #e0e0e0", 
                      marginTop: "12px",
                      paddingTop: "12px"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "5px" }}>
                        <span>Subtotal:</span>
                        <span>₹{selectedOrder.planDetails?.originalAmount}</span>
                      </div>
                      {selectedOrder.planDetails?.savings > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#10b981" }}>
                          <span>Discount:</span>
                          <span>-₹{selectedOrder.planDetails?.savings}</span>
                        </div>
                      )}
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        marginTop: "8px",
                        paddingTop: "8px",
                        borderTop: "1px solid #e0e0e0",
                        fontWeight: "bold",
                        fontSize: "clamp(14px, 4vw, 16px)"
                      }}>
                        <span>Total:</span>
                        <span style={{ color: "#722f7f" }}>₹{selectedOrder.planDetails?.amount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details Card */}
                  <div style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "12px",
                    padding: "15px",
                    background: "#fafafa"
                  }}>
                    <h3 style={{ 
                      margin: "0 0 12px 0", 
                      color: "#722f7f",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "clamp(16px, 4vw, 18px)"
                    }}>
                      <FaCreditCard /> Payment Details
                    </h3>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", flexWrap: "wrap", gap: "5px" }}>
                      <span>Payment Status:</span>
                      <span style={{ 
                        color: getPaymentStatusColor(selectedOrder.paymentStatus),
                        fontWeight: "bold",
                        textTransform: "capitalize"
                      }}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                    {selectedOrder.razorpayPaymentId && (
                      <div style={{ marginBottom: "6px", fontSize: "11px", color: "#666", wordBreak: "break-all" }}>
                        <strong>Payment ID:</strong> {selectedOrder.razorpayPaymentId}
                      </div>
                    )}
                    {selectedOrder.paidAt && (
                      <div style={{ fontSize: "11px", color: "#666" }}>
                        <strong>Paid On:</strong> {formatDate(selectedOrder.paidAt)}
                      </div>
                    )}
                  </div>

                  {/* Customer Details Card */}
                  <div style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "12px",
                    padding: "15px",
                    background: "#fafafa"
                  }}>
                    <h3 style={{ 
                      margin: "0 0 12px 0", 
                      color: "#722f7f",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "clamp(16px, 4vw, 18px)"
                    }}>
                      <FaUser /> Customer Details
                    </h3>
                    <div style={{ marginBottom: "8px", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <FaUser style={{ color: "#722f7f", fontSize: "12px" }} />
                      <strong>{selectedOrder.userDetails?.name}</strong>
                    </div>
                    <div style={{ marginBottom: "8px", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", wordBreak: "break-all" }}>
                      <FaEnvelope style={{ color: "#722f7f", fontSize: "12px" }} />
                      <span>{selectedOrder.userDetails?.email}</span>
                    </div>
                    {selectedOrder.userDetails?.phone && (
                      <div style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <FaPhone style={{ color: "#722f7f", fontSize: "12px" }} />
                        <span>{selectedOrder.userDetails?.phone}</span>
                        <a 
                          href={`https://wa.me/${selectedOrder.userDetails?.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#25D366",
                            marginLeft: "auto",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "12px",
                            textDecoration: "none"
                          }}
                        >
                          <FaWhatsapp /> Chat
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Order Status Card */}
                  <div style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "12px",
                    padding: "15px",
                    background: "#fafafa"
                  }}>
                    <h3 style={{ 
                      margin: "0 0 12px 0", 
                      color: "#722f7f",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "clamp(16px, 4vw, 18px)"
                    }}>
                      <FaBoxOpen /> Order Status
                    </h3>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "13px", flexWrap: "wrap", gap: "5px" }}>
                      <span>Current Status:</span>
                      <span style={{ 
                        color: getStatusColor(selectedOrder.orderStatus),
                        fontWeight: "bold",
                        textTransform: "capitalize",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}>
                        {getStatusIcon(selectedOrder.orderStatus)}
                        {selectedOrder.orderStatus}
                      </span>
                    </div>
                    <div style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <FaCalendarAlt style={{ color: "#722f7f" }} />
                      <span>Order Date: {formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    
                    {/* Mobile Timeline */}
                    <div style={{ marginTop: "15px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", position: "relative", flexWrap: "wrap" }}>
                        {['pending', 'processing', 'delivered'].map((status, index) => {
                          const statusIndex = ['pending', 'processing', 'delivered'].indexOf(selectedOrder.orderStatus);
                          const isCompleted = index <= statusIndex;
                          
                          return (
                            <div key={status} style={{ 
                              textAlign: "center", 
                              flex: 1,
                              minWidth: "80px"
                            }}>
                              <div style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                background: isCompleted ? "#10b981" : "#e0e0e0",
                                margin: "0 auto 5px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "12px"
                              }}>
                                {isCompleted && <FaCheckCircle size={12} />}
                              </div>
                              <div style={{ fontSize: "10px", textTransform: "capitalize" }}>
                                {status}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address Card - Mobile Optimized */}
                  {selectedOrder.shippingAddress && Object.keys(selectedOrder.shippingAddress).length > 0 && (
                    <div style={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "12px",
                      padding: "15px",
                      background: "#fafafa"
                    }}>
                      <h3 style={{ 
                        margin: "0 0 12px 0", 
                        color: "#722f7f",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "clamp(16px, 4vw, 18px)"
                      }}>
                        <FaMapMarkerAlt /> Shipping Address
                      </h3>
                      {selectedOrder.shippingAddress.fullName && (
                        <p style={{ margin: "0 0 5px 0", fontSize: "13px", fontWeight: "bold" }}>
                          {selectedOrder.shippingAddress.fullName}
                        </p>
                      )}
                      {selectedOrder.shippingAddress.addressLine1 && (
                        <p style={{ margin: "5px 0", fontSize: "12px", color: "#666" }}>
                          {selectedOrder.shippingAddress.addressLine1}
                        </p>
                      )}
                      {selectedOrder.shippingAddress.addressLine2 && (
                        <p style={{ margin: "5px 0", fontSize: "12px", color: "#666" }}>
                          {selectedOrder.shippingAddress.addressLine2}
                        </p>
                      )}
                      {(selectedOrder.shippingAddress.city || selectedOrder.shippingAddress.state) && (
                        <p style={{ margin: "5px 0", fontSize: "12px", color: "#666" }}>
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.pinCode}
                        </p>
                      )}
                      {selectedOrder.shippingAddress.country && (
                        <p style={{ margin: "5px 0", fontSize: "12px", color: "#666" }}>
                          {selectedOrder.shippingAddress.country}
                        </p>
                      )}
                      {selectedOrder.shippingAddress.phone && (
                        <p style={{ margin: "5px 0", fontSize: "12px", display: "flex", alignItems: "center", gap: "5px" }}>
                          <FaPhone style={{ fontSize: "10px" }} /> {selectedOrder.shippingAddress.phone}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons - Mobile Optimized */}
                <div style={{ 
                  marginTop: "20px", 
                  paddingTop: "15px",
                  borderTop: "1px solid #e0e0e0",
                  display: "flex",
                  gap: "10px",
                  flexDirection: window.innerWidth < 480 ? "column" : "row",
                  justifyContent: "flex-end"
                }}>
                  <button
                    onClick={closeModal}
                    style={{
                      padding: "12px 20px",
                      background: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "background 0.3s",
                      fontSize: "14px",
                      fontWeight: "500",
                     
                      width: window.innerWidth < 280 ? "100%" : "auto"
                    }}
                    onMouseEnter={(e) => e.target.style.background = "#5a6268"}
                    onMouseLeave={(e) => e.target.style.background = "#6c757d"}
                  >
                    Close
                  </button>
                  <Link 
                    href={`/Pages/order-confirmation/${selectedOrder._id}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "12px 20px",
                      background: "#722f7f",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "8px",
                      transition: "background 0.3s",
                      fontSize: "14px",
                      fontWeight: "500",
                      width: window.innerWidth < 480 ? "100%" : "auto"
                    }}
                    onMouseEnter={(e) => e.target.style.background = "#5a2364"}
                    onMouseLeave={(e) => e.target.style.background = "#722f7f"}
                  >
                    <FaEye /> View Full Page
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add CSS Animation */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @media (max-width: 768px) {
          .order-card {
            margin: 10px;
          }
        }
      `}</style>
    </div>
  );
}