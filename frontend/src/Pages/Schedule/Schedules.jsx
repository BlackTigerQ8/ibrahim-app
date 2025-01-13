import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchedules, deleteSchedule } from "../../redux/scheduleSlice";
import { Box, Button, Typography, useTheme, Alert } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { tokens } from "../../theme";
import Popconfirm from "antd/lib/popconfirm";
import Title from "../../components/Title";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Schedules = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { schedules, status, error } = useSelector((state) => state.schedule);
  const userRole = useSelector((state) => state.user.userRole);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchSchedules());
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteSchedule(id)).unwrap();
    } catch (error) {
      console.error("Failed to delete schedule:", error);
    }
  };

  const columns = [
    {
      field: "athlete",
      headerName: t("Athlete"),
      flex: 1,
      renderCell: ({ row }) =>
        `${row.athlete.firstName} ${row.athlete.lastName}`,
    },
    {
      field: "category",
      headerName: t("category"),
      flex: 1,
      renderCell: ({ row }) => row.category.name,
    },
    {
      field: "training",
      headerName: t("training"),
      flex: 1,
      renderCell: ({ row }) => row.training.name,
    },
    {
      field: "date",
      headerName: t("date"),
      flex: 1,
      renderCell: ({ value }) => moment(value).format("YYYY-MM-DD"),
    },
    {
      field: "status",
      headerName: t("status"),
      flex: 1,
      renderCell: ({ value }) => (
        <Typography
          style={{
            color:
              value === "Completed"
                ? "green"
                : value === "Pending"
                  ? "gold"
                  : "red",
          }}
        >
          {value}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: t("actions"),
      width: 150,
      renderCell: (params) => (
        <Box display="flex" justifyContent="center">
          {(userRole === "Admin" || userRole === "Coach") && (
            <Popconfirm
              title={t("deleteConfirmation")}
              onConfirm={() => handleDelete(params.row._id)}
            >
              <Button variant="contained" color="secondary" size="small">
                {t("delete")}
              </Button>
            </Popconfirm>
          )}
        </Box>
      ),
    },
  ];

  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <l-cardio
          size="70"
          speed="1.75"
          color={colors.secondary.main}
        ></l-cardio>
      </div>
    );
  }

  if (status === "failed") {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box m="20px">
      <Title title={t("schedules")} subtitle={t("manageSchedules")} />
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.primary.extraLight,
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary.extraLight,
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.primary.darkLight,
          },
        }}
      >
        {userRole === "Admin" && (
          <Box display="flex" justifyContent="start" mb="20px">
            <Button
              onClick={() => navigate("/schedule-form")}
              color="secondary"
              variant="contained"
            >
              {t("createNewSchedule")}
            </Button>
          </Box>
        )}
        <DataGrid
          rows={schedules}
          columns={columns}
          getRowId={(row) => row._id}
          components={{ Toolbar: GridToolbar }}
          sx={{
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
            },
            "& .MuiDataGrid-columnHeaders": {
              textAlign: "center",
              backgroundColor: colors.secondary.main,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Schedules;
