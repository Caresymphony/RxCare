/** @format */

import { Box, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, Route, Routes } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import PatientDetails from "../../components/PatientDetails";
import axios from "axios";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [patientData, setpatientData] = useState([]);
  const navigate = useNavigate();
  const handleRowClick = (params, event) => {
    // Get the ID of the clicked row
    const patientId = params.row.id;
    const patientFName = params.row.first_name;
    // Navigate to the new page with the patient ID in the URL
    console.log(
      `Navigating to next page with patientId=${patientId} and patientFName=${patientFName}`
    );

    navigate(`/team/${patientId}`, {
      state: { patientName: patientFName },
    });
  };
  useEffect(() => {
    axios
      .get("http://192.168.4.21:8000/v1/patients")
      .then((response) => {
        setpatientData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "first_name", headerName: "First Name", width: 130 },
    { field: "last_name", headerName: "Last Name", width: 130 },
    { field: "guardian", headerName: "Guardian", width: 130 },
    { field: "gender", headerName: "Gender", width: 90 },
    { field: "dob", headerName: "Date of Birth", width: 130 },
    { field: "street1", headerName: "Street 1", width: 130 },
    { field: "street2", headerName: "Street 2", width: 130 },
    { field: "city", headerName: "City", width: 130 },
    { field: "state", headerName: "State", width: 90 },
    { field: "country", headerName: "Country", width: 130 },
    { field: "zip", headerName: "ZIP", width: 90 },
    { field: "phone", headerName: "Phone", width: 130 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "language_preference", headerName: "Language", width: 130 },
    { field: "species", headerName: "Species", width: 130 },
  ];
  return (
    <Box m="20px">
      <Header title="PATIENTS" subtitle="Managing the Patients" />
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
            rows={patientData}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            onRowClick={handleRowClick}
          />
        </Box>
      }
    </Box>
  );
};

export default Team;
