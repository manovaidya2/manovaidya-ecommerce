import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { getData, } from "../../services/FetchNodeServices";


const ConsultationList = () => {
  const [consultations, setConsultations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setIsLoading(true);
      const response = await getData("api/consultations/all");

      if (response?.success === true) {
        setConsultations(response?.data);
      } else {
        toast.error("Failed to load consultations");
      }
    } catch (error) {
      toast.error("Something went wrong while fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This consultation will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
       const response = await getData(`api/consultation/delete-consultation/${id}`);
        setConsultations(
          consultations.filter((item) => item._id !== id)
        );
        toast.success("Consultation deleted successfully");
      } catch (error) {
        toast.error("Failed to delete consultation");
      }
    }
  };

  return (
    <>
      <ToastContainer />

      {/* ===== HEADING (CHANGED) ===== */}
      <div className="bread">
        <div className="head">
          <h4>Consultation Requests</h4>
        </div>
      </div>

      {/* ===== TABLE (DESIGN SAME) ===== */}
      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>Sr.No.</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Age</th>
              <th>Concern</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : consultations.length > 0 ? (
              consultations.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.fullName}</td>
                  <td>{item.phoneNumber}</td>
                  <td>{item.email || "-"}</td>
                  <td>{item.age || "-"}</td>
                  <td>{item.primaryConcern}</td>
                  <td>{item.description || "-"}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bt delete"
                    >
                      Remove <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No consultation requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default ConsultationList;
