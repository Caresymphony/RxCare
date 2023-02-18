/** @format */
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import MedicationIcon from "@mui/icons-material/Medication";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import LineChart from "../../components/LineChart";
import axios from "axios";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [allPatients, setAllPatients] = useState([]);
  const [allprescriptions, setallprescriptions] = useState([]);
  const [medprediction, setmedprediction] = useState([]);
  const [totalprice, settotalprice] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);

  useEffect(() => {
    // Fetch the list of patients
    axios
      .get("http://192.168.4.21:8000/v1/patients")
      .then((response) => {
        setAllPatients(response.data);
        const numPatients = response.data.length;
        setTotalPatients(numPatients);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get("http://192.168.4.21:8000/v1/prescriptions")
      .then((response) => {
        setallprescriptions(response.data);
        const totalPrice = response.data.reduce(
          (acc, prescription) => acc + prescription.price,
          0
        );
        settotalprice(totalPrice);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get("http://192.168.4.21:2323/fetch-data")
      .then((response) => {
        setmedprediction(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to pharmacist dashboard" />
        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}>
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>
      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px">
        {/* ROW 1 */}
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center">
          <StatBox
            title={allprescriptions.length}
            subtitle="Prescriptions Filled"
            progress="0.9"
            increase="+14%"
            icon={
              <MedicationIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center">
          <StatBox
            title={"$" + totalprice}
            subtitle="Sales Obtained"
            progress="0.50"
            increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center">
          <StatBox
            title={totalPatients}
            subtitle="All Patients"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        {/* ROW 2 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}>
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center">
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}>
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}>
                {"$" + totalprice}
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px">
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {allprescriptions.map((allprescription) => (
            <Box
              key={allprescription.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px">
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600">
                  {allprescription.patient_id}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {allprescription.name}
                </Typography>
              </Box>
              {
                <Box color={colors.grey[100]}>
                  {allprescription.date_prescribed}
                </Box>
              }
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px">
                ${allprescription.price}
              </Box>
            </Box>
          ))}
        </Box>
        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px">
          <Typography variant="h5" fontWeight="600">
            Medication Prediction
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px">
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}>
              {medprediction.medication_with_max_sale_prediction}
            </Typography>
            <Typography>
              We calculated the total quantity and number of aspirin sold for
              each medication in the response data, and then calculates the sale
              prediction for each medication by dividing the total quantity by
              the number of aspirin sold. Finally, it returns the name of the
              medication with the highest sale prediction.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
