import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import "./MaterialList.css";

/* ---------- Table Columns ---------- */
const columns = [
  { id: "name", label: "Material Name", minWidth: 170 },
  { id: "code", label: "Material Code", minWidth: 120 },
  { id: "quantity", label: "Quantity", minWidth: 100, align: "right" },
  { id: "category", label: "Category", minWidth: 150 },
];

/* ---------- Table Data ---------- */
const rows = [
  {
    name: "Arduino Uno",
    code: "ARD-001",
    quantity: 10,
    category: "Controller",
  },
  { name: "Servo Motor", code: "SRV-010", quantity: 25, category: "Motor" },
  { name: "Jumper Wires", code: "JMP-100", quantity: 200, category: "Wires" },
  {
    name: "Breadboard",
    code: "BRD-005",
    quantity: 15,
    category: "Prototyping",
  },
  { name: "Sensor Module", code: "SNS-020", quantity: 30, category: "Sensors" },
];

const MaterialListContent = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className="material-card">
      <Typography variant="h6" gutterBottom>
        List of Materials
      </Typography>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  style={{ minWidth: column.minWidth }}
                >
                  <strong>{column.label}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow hover key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align || "left"}>
                      {row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default MaterialListContent;
