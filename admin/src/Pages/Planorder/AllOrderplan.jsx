import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getData } from '../../services/FetchNodeServices';
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
  FaShare
} from 'react-icons/fa';

const AllOrderplan = () => {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filterOption, setFilterOption] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    // Fetch all orders (admin view) - no login required
    useEffect(() => {
        fetchAllOrders();
        
        // Clean up any Bootstrap modal backdrops if they exist
        return () => {
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
            document.body.style.overflow = '';
            document.body.classList.remove('modal-open');
        };
    }, []);

    // Fetch all orders
    const fetchAllOrders = async () => {
        try {
            setLoading(true);
            const response = await getData(`api/razorpay/get-all-orders`);
            console.log('All orders response:', response);
            
            if (response?.success === true) {
                setOrders(response.orders || []);
                setFilteredOrders(response.orders || []);
            } else {
                toast.error(response?.message || "Failed to fetch orders");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to fetch orders.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch order details for modal
    const fetchOrderDetails = async (orderId) => {
        try {
            setModalLoading(true);
            const response = await getData(`api/razorpay/get-order/${orderId}`);
            console.log("Order details response:", response);
            
            if (response?.success === true && response?.order) {
                setSelectedOrder(response.order);
                setShowModal(true);
                // Prevent body scroll when modal is open
                document.body.style.overflow = 'hidden';
            } else {
                toast.error("Failed to fetch order details");
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
            toast.error("Something went wrong while fetching order details");
        } finally {
            setModalLoading(false);
        }
    };

    // Search orders
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = orders.filter(order =>
            order.orderId?.toLowerCase().includes(query) ||
            order.planDetails?.planName?.toLowerCase().includes(query) ||
            order.userDetails?.name?.toLowerCase().includes(query)
        );
        setFilteredOrders(filtered);
        setCurrentPage(1);
    };

    // Filter orders based on selected option
    const handleFilterChange = (e) => {
        setFilterOption(e.target.value);
        setCurrentPage(1);
    };

    // Handle filtering by date range
    useEffect(() => {
        let filtered = [...orders];

        if (filterOption === 'today') {
            const today = new Date();
            filtered = filtered.filter(order => new Date(order.createdAt).toDateString() === today.toDateString());
        } else if (filterOption === 'yesterday') {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            filtered = filtered.filter(order => new Date(order.createdAt).toDateString() === yesterday.toDateString());
        } else if (filterOption === 'thisWeek') {
            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            filtered = filtered.filter(order => new Date(order.createdAt) >= startOfWeek);
        } else if (filterOption === 'thisMonth') {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            filtered = filtered.filter(order => new Date(order.createdAt) >= startOfMonth);
        } else if (filterOption === 'thisYear') {
            const startOfYear = new Date();
            startOfYear.setMonth(0, 1);
            filtered = filtered.filter(order => new Date(order.createdAt) >= startOfYear);
        }

        setFilteredOrders(filtered);
    }, [filterOption, orders]);

    // Helper functions
    const getStatusColor = (status) => {
        const colors = {
            pending: "#f59e0b",
            processing: "#3b82f6",
            shipped: "#8b5cf6",
            delivered: "#10b981",
            cancelled: "#ef4444"
        };
        return colors[status?.toLowerCase()] || "#6b7280";
    };

    const getPaymentStatusColor = (status) => {
        return status === 'success' ? '#10b981' : status === 'failed' ? '#ef4444' : '#f59e0b';
    };

    const getStatusIcon = (status) => {
        const lowerStatus = status?.toLowerCase();
        if (lowerStatus === "delivered") return <FaCheckCircle style={{ color: "#10b981" }} />;
        if (lowerStatus === "processing") return <FaClock style={{ color: "#3b82f6" }} />;
        if (lowerStatus === "cancelled") return <FaTimes style={{ color: "#ef4444" }} />;
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

    const closeModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
        // Restore body scroll
        document.body.style.overflow = '';
        // Remove any lingering Bootstrap modal classes
        document.body.classList.remove('modal-open');
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
    };

    const shareOrderDetails = () => {
        if (selectedOrder) {
            const shareText = `Healing Order - ${selectedOrder.planDetails?.planName}\nOrder ID: ${selectedOrder.orderId}\nAmount: ₹${selectedOrder.planDetails?.amount}\nStatus: ${selectedOrder.orderStatus}`;
            if (navigator.share) {
                navigator.share({
                    title: 'Healing Order Details',
                    text: shareText,
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(shareText);
                toast.success("Order details copied to clipboard");
            }
        }
    };

    const downloadOrderReceipt = () => {
        if (selectedOrder) {
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
            
            toast.success("Receipt downloaded successfully");
        }
    };

    const handleViewDetails = (orderId) => {
        fetchOrderDetails(orderId);
    };

    // Pagination
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading healing orders...</p>
            </div>
        );
    }

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Healing Orders</h4>
                    <p>Total Orders: {orders.length}</p>
                </div>
            </div>

            <div className="filteration">
                <div className="selects">
                    <select onChange={handleFilterChange} value={filterOption}>
                        <option value="">All Orders</option>
                        <option value="today">Today's Orders</option>
                        <option value="yesterday">Yesterday's Orders</option>
                        <option value="thisWeek">This Week's Orders</option>
                        <option value="thisMonth">This Month's Orders</option>
                        <option value="thisYear">This Year's Orders</option>
                    </select>
                </div>
                <div className="search">
                    <label htmlFor="search">Search</label>&nbsp;
                    <input
                        type="text"
                        name="search"
                        id="search"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search by order ID, plan name, or customer name..."
                    />
                </div>
            </div>

            <section className="main-table">
                <div className="table-responsive">
                    <table className="table table-bordered table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Sr.No.</th>
                                <th scope="col">Order ID</th>
                                <th scope="col">Customer Name</th>
                                <th scope="col">Plan Name</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Order Status</th>
                                <th scope="col">Payment Status</th>
                                <th scope="col">Order Date</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.length > 0 ? (
                                currentOrders.map((order, index) => (
                                    <tr key={order._id}>
                                        <th scope="row">{indexOfFirstOrder + index + 1}</th>
                                        <td>
                                            <Link to="#" onClick={(e) => {
                                                e.preventDefault();
                                                handleViewDetails(order._id);
                                            }}>
                                                {order.orderId}
                                            </Link>
                                        </td>
                                        <td>{order.userDetails?.name || 'N/A'}</td>
                                        <td>{order.planDetails?.planName || 'N/A'}</td>
                                        <td>₹{order.planDetails?.amount || 0}</td>
                                        <td>
                                            <span style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "5px",
                                                padding: "4px 12px",
                                                borderRadius: "20px",
                                                background: getStatusColor(order.orderStatus) + "20",
                                                color: getStatusColor(order.orderStatus)
                                            }}>
                                                {getStatusIcon(order.orderStatus)}
                                                {order.orderStatus?.toUpperCase() || 'PENDING'}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{
                                                color: getPaymentStatusColor(order.paymentStatus),
                                                fontWeight: "bold"
                                            }}>
                                                {order.paymentStatus?.toUpperCase() || 'PENDING'}
                                            </span>
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                className="bt edit"
                                                onClick={() => handleViewDetails(order._id)}
                                                style={{ marginRight: '8px' }}
                                            >
                                                <FaEye /> Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredOrders.length > ordersPerPage && (
                    <div className="pagination-container" style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        marginTop: '20px',
                        gap: '5px',
                        flexWrap: 'wrap'
                    }}>
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{
                                padding: '8px 12px',
                                background: currentPage === 1 ? '#ccc' : '#722f7f',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => paginate(index + 1)}
                                style={{
                                    padding: '8px 12px',
                                    background: currentPage === index + 1 ? '#722f7f' : '#f0f0f0',
                                    color: currentPage === index + 1 ? 'white' : '#333',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            style={{
                                padding: '8px 12px',
                                background: currentPage === totalPages ? '#ccc' : '#722f7f',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Next
                        </button>
                    </div>
                )}
            </section>

            {/* Order Details Modal - Custom Modal (No Bootstrap) */}
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
                    zIndex: 9999,
                    padding: "10px",
                    overflowY: "auto"
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
                        
                        {/* Modal Header */}
                        <div style={{
                            background: "linear-gradient(135deg, #722f7f 0%, #5a2364 100%)",
                            color: "white",
                            padding: "20px",
                            borderRadius: "16px 16px 0 0",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            position: "sticky",
                            top: 0,
                            zIndex: 10
                        }}>
                            <div>
                                <h2 style={{ margin: 0 }}>Order Details</h2>
                                <p style={{ margin: "5px 0 0 0", opacity: 0.9 }}>
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
                                        borderRadius: "8px"
                                    }}
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
                                        borderRadius: "8px"
                                    }}
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
                                        borderRadius: "50%"
                                    }}
                                >
                                    <FaTimes size={18} />
                                </button>
                            </div>
                        </div>

                        {modalLoading ? (
                            <div style={{ textAlign: "center", padding: "50px" }}>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p style={{ marginTop: "15px", color: "#666" }}>Loading order details...</p>
                            </div>
                        ) : (
                            <div style={{ padding: "25px" }}>
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
                                        gap: "10px"
                                    }}>
                                        <FaCheckCircle size={18} />
                                        <div>
                                            <strong>Payment Successful!</strong>
                                            <p style={{ margin: "5px 0 0 0", fontSize: "12px" }}>The healing journey has been confirmed.</p>
                                        </div>
                                    </div>
                                )}

                                <div style={{ display: "grid", gap: "20px" }}>
                                    {/* Plan Details */}
                                    <div style={{
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "12px",
                                        padding: "15px",
                                        background: "#fafafa"
                                    }}>
                                        <h3 style={{ margin: "0 0 12px 0", color: "#722f7f", display: "flex", alignItems: "center", gap: "8px" }}>
                                            <FaShoppingBag /> Plan Details
                                        </h3>
                                        <h4 style={{ margin: "0 0 8px 0" }}>{selectedOrder.planDetails?.planName}</h4>
                                        <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                                            <span style={{ background: "#e0e0e0", padding: "4px 10px", borderRadius: "20px", fontSize: "12px" }}>
                                                Duration: {selectedOrder.planDetails?.duration}
                                            </span>
                                            {selectedOrder.planDetails?.savings > 0 && (
                                                <span style={{ background: "#d4edda", color: "#155724", padding: "4px 10px", borderRadius: "20px", fontSize: "12px" }}>
                                                    Saved ₹{selectedOrder.planDetails?.savings}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ borderTop: "1px solid #e0e0e0", marginTop: "12px", paddingTop: "12px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "5px" }}>
                                                <span>Subtotal:</span>
                                                <span>₹{selectedOrder.planDetails?.originalAmount}</span>
                                            </div>
                                            {selectedOrder.planDetails?.savings > 0 && (
                                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#10b981" }}>
                                                    <span>Discount:</span>
                                                    <span>-₹{selectedOrder.planDetails?.savings}</span>
                                                </div>
                                            )}
                                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid #e0e0e0", fontWeight: "bold" }}>
                                                <span>Total:</span>
                                                <span style={{ color: "#722f7f" }}>₹{selectedOrder.planDetails?.amount}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Details */}
                                    <div style={{
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "12px",
                                        padding: "15px",
                                        background: "#fafafa"
                                    }}>
                                        <h3 style={{ margin: "0 0 12px 0", color: "#722f7f", display: "flex", alignItems: "center", gap: "8px" }}>
                                            <FaCreditCard /> Payment Details
                                        </h3>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                            <span>Payment Status:</span>
                                            <span style={{ color: getPaymentStatusColor(selectedOrder.paymentStatus), fontWeight: "bold" }}>
                                                {selectedOrder.paymentStatus?.toUpperCase()}
                                            </span>
                                        </div>
                                        {selectedOrder.razorpayPaymentId && (
                                            <div style={{ marginBottom: "6px", fontSize: "12px", color: "#666", wordBreak: "break-all" }}>
                                                <strong>Payment ID:</strong> {selectedOrder.razorpayPaymentId}
                                            </div>
                                        )}
                                        {selectedOrder.paidAt && (
                                            <div style={{ fontSize: "12px", color: "#666" }}>
                                                <strong>Paid On:</strong> {formatDate(selectedOrder.paidAt)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Customer Details */}
                                    <div style={{
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "12px",
                                        padding: "15px",
                                        background: "#fafafa"
                                    }}>
                                        <h3 style={{ margin: "0 0 12px 0", color: "#722f7f", display: "flex", alignItems: "center", gap: "8px" }}>
                                            <FaUser /> Customer Details
                                        </h3>
                                        <div style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                                            <FaUser style={{ color: "#722f7f" }} />
                                            <strong>{selectedOrder.userDetails?.name}</strong>
                                        </div>
                                        <div style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px", wordBreak: "break-all" }}>
                                            <FaEnvelope style={{ color: "#722f7f" }} />
                                            <span>{selectedOrder.userDetails?.email}</span>
                                        </div>
                                        {selectedOrder.userDetails?.phone && (
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                                <FaPhone style={{ color: "#722f7f" }} />
                                                <span>{selectedOrder.userDetails?.phone}</span>
                                                <a href={`https://wa.me/${selectedOrder.userDetails?.phone}`} target="_blank" rel="noopener noreferrer" style={{ color: "#25D366", marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", textDecoration: "none" }}>
                                                    <FaWhatsapp /> Chat
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Status */}
                                    <div style={{
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "12px",
                                        padding: "15px",
                                        background: "#fafafa"
                                    }}>
                                        <h3 style={{ margin: "0 0 12px 0", color: "#722f7f", display: "flex", alignItems: "center", gap: "8px" }}>
                                            <FaBoxOpen /> Order Status
                                        </h3>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                            <span>Current Status:</span>
                                            <span style={{ color: getStatusColor(selectedOrder.orderStatus), fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}>
                                                {getStatusIcon(selectedOrder.orderStatus)}
                                                {selectedOrder.orderStatus?.toUpperCase()}
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <FaCalendarAlt style={{ color: "#722f7f" }} />
                                            <span>Order Date: {formatDate(selectedOrder.createdAt)}</span>
                                        </div>
                                    </div>

                                    {/* Shipping Address (if available) */}
                                    {selectedOrder.shippingAddress && Object.keys(selectedOrder.shippingAddress).length > 0 && (
                                        <div style={{
                                            border: "1px solid #e0e0e0",
                                            borderRadius: "12px",
                                            padding: "15px",
                                            background: "#fafafa"
                                        }}>
                                            <h3 style={{ margin: "0 0 12px 0", color: "#722f7f", display: "flex", alignItems: "center", gap: "8px" }}>
                                                <FaMapMarkerAlt /> Shipping Address
                                            </h3>
                                            {selectedOrder.shippingAddress.fullName && (
                                                <p style={{ margin: "0 0 5px 0" }}>
                                                    <strong>{selectedOrder.shippingAddress.fullName}</strong>
                                                </p>
                                            )}
                                            {selectedOrder.shippingAddress.addressLine1 && (
                                                <p style={{ margin: "5px 0", color: "#666" }}>
                                                    {selectedOrder.shippingAddress.addressLine1}
                                                </p>
                                            )}
                                            {selectedOrder.shippingAddress.addressLine2 && (
                                                <p style={{ margin: "5px 0", color: "#666" }}>
                                                    {selectedOrder.shippingAddress.addressLine2}
                                                </p>
                                            )}
                                            {(selectedOrder.shippingAddress.city || selectedOrder.shippingAddress.state) && (
                                                <p style={{ margin: "5px 0", color: "#666" }}>
                                                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.pinCode}
                                                </p>
                                            )}
                                            {selectedOrder.shippingAddress.country && (
                                                <p style={{ margin: "5px 0", color: "#666" }}>
                                                    {selectedOrder.shippingAddress.country}
                                                </p>
                                            )}
                                            {selectedOrder.shippingAddress.phone && (
                                                <p style={{ margin: "5px 0", display: "flex", alignItems: "center", gap: "5px" }}>
                                                    <FaPhone /> {selectedOrder.shippingAddress.phone}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div style={{ marginTop: "20px", paddingTop: "15px", borderTop: "1px solid #e0e0e0", display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                                    <button
                                        onClick={closeModal}
                                        style={{
                                            padding: "10px 20px",
                                            background: "#6c757d",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "8px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Close
                                    </button>
                                    <Link
                                        to={`/order-confirmation/${selectedOrder._id}`}
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            padding: "10px 20px",
                                            background: "#722f7f",
                                            color: "white",
                                            textDecoration: "none",
                                            borderRadius: "8px"
                                        }}
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
            <style jsx="true">{`
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
                    .table-responsive {
                        overflow-x: auto;
                    }
                    .table-responsive table {
                        min-width: 600px;
                    }
                }
            `}</style>
        </>
    );
};

export default AllOrderplan;