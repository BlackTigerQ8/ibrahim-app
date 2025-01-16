import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { tokens } from "../../theme";
import Title from "../../components/Title";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Schedules = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { schedules, status, error } = useSelector((state) => state.schedule);
  const userRole = useSelector((state) => state.user.userRole);
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
      renderCell: ({ row }) => row.training?.name || t("notAvailable"),
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
