import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchedules, deleteSchedule } from "../../redux/scheduleSlice";
import {
  Box,
  Button,
  Typography,
  useTheme,
  Alert,
  Dialog,
  DialogTitle,
  DialogActions,
  useMediaQuery,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { tokens } from "../../theme";
import Title from "../../components/Title";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

const Schedules = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const { schedules, status, error } = useSelector((state) => state.schedule);
  const { userRole, _id: currentUserId } = useSelector((state) => state.user);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);

  useEffect(() => {
    dispatch(fetchSchedules());
  }, [dispatch]);

  const handleDelete = async (id) => {
    setSelectedScheduleId(id);
    setOpenDeleteModal(true);
  };

  const handleModalClose = async (confirm) => {
    if (confirm && selectedScheduleId) {
      try {
        await dispatch(deleteSchedule(selectedScheduleId)).unwrap();
      } catch (error) {
        console.error("Failed to delete schedule:", error);
      }
    }
    setOpenDeleteModal(false);
    setSelectedScheduleId(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return colors.status.success;
      case "Cancelled":
        return colors.status.error;
      default:
        return colors.status.default;
    }
  };

  const columns = [
    {
      field: "athlete",
      headerName: t("Athlete"),
      flex: 1,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: ({ row }) =>
        `${row.athlete?.firstName} ${row.athlete?.lastName}`,
    },
    {
      field: "category",
      headerName: t("category"),
      flex: 1,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: ({ row }) => row.category?.name || t("notAvailable"),
    },
    {
      field: "training",
      headerName: t("training"),
      flex: 1,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: ({ row }) => row.training?.name || t("notAvailable"),
    },
    {
      field: "date",
      headerName: t("date"),
      flex: 1,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: ({ value }) => moment(value).format("YYYY-MM-DD"),
    },
    {
      field: "status",
      headerName: t("status"),
      flex: 1,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: ({ value }) => (
        <Typography
          style={{
            borderRadius: "4px",
            border: `1px solid ${getStatusColor(value)}`,
            padding: "4px",
            width: "100%",
            margin: "0 auto",
            textAlign: "center",
            color: getStatusColor(value),
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
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Box display="flex" justifyContent="center">
          {(userRole === "Admin" || userRole === "Coach") && (
            <>
              <Button
                variant="contained"
                color="primary"
                size="small"
                style={{ marginRight: 8 }}
                onClick={() => navigate(`/schedules/edit/${params.row._id}`)}
                startIcon={<EditIcon />}
              />
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => handleDelete(params.row._id)}
              >
                <DeleteIcon />
              </Button>
            </>
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
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: `${colors.primary.default} !important`,
              color: colors.primary.main,
              fontWeight: "bold",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.primary.default,
              color: colors.secondary.main,
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary.tableBackground,
            },
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
            },
          },
          "& .super-app-theme--header": {
            backgroundColor: `${colors.primary.default} !important`,
            color: colors.secondary.main,
            fontWeight: "bold",
          },
        }}
      >
        <Box
          display="flex"
          flexDirection={isNonMobile ? "row" : "column"}
          justifyContent="space-between"
          margin="20px"
          gap={2} // Added gap between buttons
        >
          {(userRole === "Admin" || userRole === "Coach") && (
            <Box>
              <Button
                onClick={() => navigate("/schedule-form")}
                color="secondary"
                variant="contained"
                fullWidth={!isNonMobile}
              >
                {t("createNewSchedule")}
              </Button>
            </Box>
          )}
          <Box>
            <Button
              onClick={() => navigate("/calendar")}
              color="secondary"
              variant="contained"
              fullWidth={!isNonMobile}
            >
              <CalendarMonthOutlinedIcon sx={{ marginRight: "10px" }} />
              {t("calendar")}
            </Button>
          </Box>
        </Box>

        <Dialog
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          BackdropProps={{
            style: { backgroundColor: "rgba(0, 0, 0, 0.7)" },
          }}
          PaperProps={{
            style: { boxShadow: "none" },
          }}
        >
          <DialogTitle>{t("deleteConfirmation")}</DialogTitle>
          <DialogActions>
            <Button onClick={() => handleModalClose(false)} color="inherit">
              {t("cancel")}
            </Button>
            <Button onClick={() => handleModalClose(true)} color="secondary">
              {t("confirm")}
            </Button>
          </DialogActions>
        </Dialog>
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
