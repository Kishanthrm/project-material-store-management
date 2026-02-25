const requestApprovalTemplate = ({
  role,
  status,
  requestId,
  remarks,
  deliveryDate,
}) => {
  if (role === "staff" && status === "STAFF_APPROVED") {
    return `
      <h2>Request Approved by Staff </h2>
      <p>Your request ID: <b>${requestId}</b></p>
      <p><b>Remarks:</b> ${remarks}</p>
      <br/>
      <p>Please wait for Store Admin approval.</p>
    `;
  }

  if (role === "storeadmin" && status === "APPROVED") {
    return `
      <h2>Request Approved by Store Admin </h2>
      <p>Your request ID: <b>${requestId}</b></p>
      <p><b>Delivery Date:</b> ${deliveryDate}</p>
      <p><b>Remarks:</b> ${remarks}</p>
      <br/>
      <p>Your material will be delivered on the mentioned date.</p>
    `;
  }

  // ===== REJECTED (STAFF) =====
  if (role === "staff" && status === "REJECTED") {
    return `
      <h2>Request Rejected by Staff </h2>
      <p>Request ID: <b>${requestId}</b></p>
      <p><b>Remarks:</b> ${remarks}</p>
      <br/>
      <p>Please contact the lab incharge for more details.</p>
    `;
  }

  // ===== REJECTED (STORE ADMIN) =====
  if (role === "storeadmin" && status === "REJECTED") {
    return `
      <h2>Request Rejected by Store Admin </h2>
      <p>Request ID: <b>${requestId}</b></p>
      <p><b>Remarks:</b> ${remarks}</p>
      <br/>
      <p>Please contact the store for clarification.</p>
    `;
  }
};

module.exports = requestApprovalTemplate;