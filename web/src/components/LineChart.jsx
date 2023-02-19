/** @format */
import { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import axios from "axios";

const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [cosdata, setcosData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://192.168.4.21:8000/v1/prescriptions"
        );
        const prescriptionData = response.data;
        const date = new Date(prescriptionData.date_prescribed);
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const formattedDate = `${year}-${month}`;
        const monthlyData = {};

        // Loop through the prescription data and get the price for each month
        prescriptionData.forEach((prescription) => {
          const date = new Date(prescription.date_prescribed);
          const day = date.getDate();
          const month = date.toLocaleString("default", { month: "short" });
          const year = date.getFullYear();

          const dateString = `${day} ${month} ${year}`;

          if (monthlyData[dateString] === undefined) {
            monthlyData[dateString] = {
              x: dateString,
              y: prescription.price,
            };
          } else {
            monthlyData[dateString].y += prescription.price;
          }
        });

        // Convert the monthly data object into an array
        const monthlyDataArray = Object.values(monthlyData);

        // Set the data for the LineChart
        setcosData([
          {
            data: monthlyDataArray.reverse(),
          },
        ]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  console.log(cosdata);
  const data = [
    {
      id: "line-1",
      color: tokens("dark").greenAccent[500],
      data:
        cosdata.length > 0 ? cosdata[0].data.map(({ x, y }) => ({ x, y })) : [], // use fetched data if available
    },
  ];

  // const data = [
  //   {
  //     id: "line-1",
  //     color: tokens("dark").greenAccent[500],
  //     data: [
  //       {
  //         x: "Jan",
  //         y: 21,
  //       },
  //       {
  //         x: "Feb",
  //         y: 75,
  //       },
  //       {
  //         x: "Mar",
  //         y: 36,
  //       },
  //       {
  //         x: "Apr",
  //         y: 216,
  //       },
  //       {
  //         x: "May",
  //         y: 35,
  //       },
  //       {
  //         x: "June",
  //         y: 236,
  //       },
  //     ],
  //   },
  // ];

  return (
    <ResponsiveLine
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }} // added
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "transportation", // added
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5, // added
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "count", // added
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;
