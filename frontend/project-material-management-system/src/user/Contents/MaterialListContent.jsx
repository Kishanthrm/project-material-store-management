import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { authFetch } from "../../authFetch";

import "./MaterialList.css";

/* ─── Table columns (unchanged) ─── */
const columns = [
  { id: "name", label: "Material Name", minWidth: 170 },
  { id: "code", label: "Material Code", minWidth: 120 },
  { id: "category", label: "Category", minWidth: 150 },
];

const MaterialListContent = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  /* ─── Fetch (unchanged) ─── */
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await authFetch("/material/list");
        if (!res) return;
        const data = await res.json();
        setMaterials(data);
      } catch (err) {
        console.error("Error fetching materials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="ml-page">
      <Paper className="material-card">
        {/* ── Header ── */}
        <h2 className="ml-title">List of Materials</h2>
        <p className="ml-subtitle">All available lab materials</p>
        <div className="ml-divider" />

        {loading ? (
          <div className="ml-loading">
            <CircularProgress size={22} />
            Loading materials…
          </div>
        ) : (
          <>
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
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {materials
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow hover key={row.id || index}>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align || "left"}
                          >
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
              count={materials.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
    </div>
  );
};

export default MaterialListContent;
