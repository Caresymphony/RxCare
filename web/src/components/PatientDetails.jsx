/** @format */
import axios from "axios";
import { Typography, Box, useTheme } from "@mui/material";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import ReactPlayer from "react-player";
import CardMedia from "@mui/material/CardMedia";
import { useEffect, useState } from "react";
import * as React from "react";
import { tokens } from "../theme";
import { DataGrid, GridToolbar, valueGetter } from "@mui/x-data-grid";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "./Header";
import videolosartan from "../vids/PHT.webm";
import videometformin from "../vids/Metformin.webm";
import { useParams, useLocation, Link } from "react-router-dom";
const PatientDetails = (params) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const location = useLocation();
  const patientName = location.state?.patientName;
  const [medications, setMedications] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  // on the next page
  console.log(`Retrieved state object:`, { patientName });
  useEffect(() => {
    axios
      .get(`http://192.168.4.21:8000/v1/get_prescriptions/${id}`)
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
    { field: "name", headerName: "Medication Name", width: 130 },
    {
      field: "compound_id",
      headerName: "Compound ID",
      width: 130,
      renderCell: (params) => (
        <Link
          to={`https://go.drugbank.com/drugs/DB00${params.value}`}
          target="_blank"
          style={{ color: "white" }}>
          {params.value}
        </Link>
      ),
    },
    { field: "price", headerName: "Cost", width: 40 },
    { field: "date_prescribed", headerName: "Date Prescribed", width: 130 },
    { field: "quantity", headerName: "Quantity", width: 40 },
    { field: "refills_left", headerName: "Refills Left", width: 40 },
    { field: "refills_interval", headerName: "Refills Interval", width: 40 },
    {
      field: "Virtual_AI_Pharmacist",
      headerName: "Virtual AI Pharmacist",
      width: 200,
      renderCell: ({ row: { access } }) => {
        return (
          <Button onClick={handleOpen}>
            <Box
              width="100%"
              m="0 auto"
              p="5px"
              display="flex"
              justifyContent="center"
              backgroundColor={colors.greenAccent[600]}
              borderRadius="4px">
              <Typography color={colors.grey[100]} sx={{ ml: "2px" }}>
                Virtual_AI_Pharmacist
              </Typography>
            </Box>
          </Button>
        );
      },
    },
  ];
  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Team Members" />
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
          <Modal
            keepMounted
            open={open}
            onClose={handleClose}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description">
            <Box sx={style}>
              <Typography
                id="keep-mounted-modal-title"
                variant="h6"
                component="h2">
                Lisa!
              </Typography>
              <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                Welcome to the Walgreens AI Pharmacist!
              </Typography>
              {patientName === "Thomas" && (
                <video src={videolosartan} width="300" height="250" controls />
              )}
              {patientName === "Matt" && (
                <video src={videometformin} width="300" height="250" controls />
              )}
            </Box>
          </Modal>
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
