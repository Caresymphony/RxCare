/** @format */
import axios from "axios";
import { Typography, Box, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { tokens } from "../theme";
import { DataGrid, GridToolbar, valueGetter } from "@mui/x-data-grid";
import Header from "./Header";
import { useParams, useLocation } from "react-router-dom";
const PatientDetails = (params) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const location = useLocation();
  const patientName = location.state?.patientName;
  const [medications, setMedications] = useState([]);
  // on the next page
  console.log(`Retrieved state object:`, { patientName });
  useEffect(() => {
    axios
      .get(`http://localhost:8000/v1/get_prescriptions/${id}`)
      .then((response) => {
        console.log(response.data); // log the response data to the console
        setMedications(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      valueGetter: (params) => id,
    },
    {
      field: "first_name",
      headerName: "First Name",
      width: 130,
      valueGetter: (params) => patientName,
    },
    { field: "date_prescribed", headerName: "Date Prescribed", width: 130 },
    { field: "quantity", headerName: "Quantity", width: 130 },
    { field: "refills_left", headerName: "Refills Left", width: 90 },
    { field: "refills_interval", headerName: "Refills Interval", width: 90 },
  ];
  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Team Members" />
      element=
      {
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
          }}>
          <DataGrid
            checkboxSelection
            rows={medications}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      }
    </Box>
  );
};

export default PatientDetails;
