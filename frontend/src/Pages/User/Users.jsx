import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  useTheme,
  Alert,
  Dialog,
  DialogTitle,
  DialogActions,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import SportsOutlinedIcon from "@mui/icons-material/SportsOutlined";
import DirectionsRunOutlinedIcon from "@mui/icons-material/DirectionsRunOutlined";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VerifiedIcon from "@mui/icons-material/Verified";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";
import Title from "../../components/Title";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, deleteUser } from "../../redux/usersSlice";
import { cardio } from "ldrs";
import { useTranslation } from "react-i18next";

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);
  const { userRole, _id: currentUserId } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const filteredUsers = users.filter((user) => {
    if (userRole === "Admin") {
      return user.role !== "Admin";
    }
    if (userRole === "Coach") {
      return user.role !== "Admin" && user.role !== "Coach";
    }
    return true;
  });

  const token =
    useSelector((state) => state.user.token) || localStorage.getItem("token");

  const columns = [
    {
      field: "name",
      headerName: t("name"),
      headerAlign: "center",
      flex: 0.75,
      cellClassName: "name-column--cell",
      headerClassName: "super-app-theme--header",
      renderCell: ({ row: { firstName, lastName } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            display="flex"
            justifyContent="center"
            borderRadius="4px"
          >
            {t(firstName)} {t(lastName)}
          </Box>
        );
      },
    },

    {
      field: "age",
      headerName: t("age"),
      flex: 0.5,
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",
      renderCell: ({ row: { dateOfBirth } }) => {
        const calculateAge = (dob) => {
          const birthDate = new Date(dob);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDifference = today.getMonth() - birthDate.getMonth();
          if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }
          return age;
        };

        return (
          <Typography>
            {dateOfBirth ? calculateAge(dateOfBirth) : t("notAvailable")}
          </Typography>
        );
      },
    },
    {
      field: "email",
      headerName: t("email"),
      flex: 1,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      align: "left",
      renderCell: (params) => {
        return (
          <Box
            display="flex"
            alignItems="center"
            gap="8px"
            justifyContent="flex-start"
            sx={{
              width: "100%",
              paddingLeft: "16px",
              ".MuiDataGrid-cell": {
                justifyContent: "flex-start",
              },
            }}
          >
            {params.row.isEmailVerified ? (
              <Tooltip title={t("emailVerified")} arrow>
                <VerifiedIcon sx={{ color: colors.status.success }} />
              </Tooltip>
            ) : (
              <Tooltip title={t("emailNotVerified")} arrow>
                <ErrorOutlineIcon sx={{ color: colors.status.error }} />
              </Tooltip>
            )}
            {params.row.email}
          </Box>
        );
      },
    },
    {
      field: "phone",
      headerAlign: "center",
      headerName: t("phone"),
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "role",
      headerName: t("accessLevel"),
      flex: 1,
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",
      renderCell: ({ row: { role } }) => {
        return (
          <Box
            width="80%"
            m="0 auto"
            p="8px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            color={colors.primary.main}
            backgroundColor={
              role === "Admin" ? colors.secondary.dark : colors.secondary.main
            }
            borderRadius="4px"
          >
            {role === "Admin" && <SecurityOutlinedIcon />}
            {role === "Family" && <Diversity3OutlinedIcon />}
            {role === "Athlete" && <DirectionsRunOutlinedIcon />}
            {role === "Coach" && <SportsOutlinedIcon />}
            <Typography color={colors.primary.main} sx={{ ml: 1 }}>
              {t(role)}
            </Typography>
          </Box>
        );
      },
    },
    ...(userRole === "Admin"
      ? [
          {
            field: "actions",
            headerName: t("actions"),
            width: 150,
            headerAlign: "center",
            align: "center",
            sortable: false,
            filterable: false,
            headerClassName: "super-app-theme--header",
            renderCell: (params) => {
              return (
                <Box display="flex" justifyContent="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ marginRight: 8 }}
                    onClick={() => handleEdit(params.row)}
                    startIcon={<EditIcon />}
                  ></Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => handleDelete(params.row._id)}
                    startIcon={<DeleteIcon />}
                  ></Button>
                </Box>
              );
            },
          },
        ]
      : []),
  ];

  useEffect(() => {
    dispatch(fetchUsers(token));
  }, [token]);

  cardio.register();
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

  const handleEdit = (rowData) => {
    // Here you can navigate to an edit page with rowData or open an edit modal/dialog
    navigate(`/profile/${rowData._id}`);
  };

  const handleDelete = (userId) => {
    setSelectedUserId(userId);
    setOpenDeleteModal(true);
  };

  const handleModalClose = (confirm) => {
    if (confirm && selectedUserId) {
      dispatch(deleteUser(selectedUserId));
    }
    setOpenDeleteModal(false);
    setSelectedUserId(null);
  };

  return (
    <Box m="20px">
      <Title title={t("users")} subtitle={t("manageUsers")} />
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
              backgroundColor: colors.primary.extraLight,
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
        {userRole === "Admin" && (
          <Box display="flex" justifyContent="start" mb="20px">
            <Button
              onClick={() => navigate("/user-form")}
              color="secondary"
              variant="contained"
            >
              {t("createNewUser")}
            </Button>
          </Box>
        )}
        <DataGrid
          rows={Array.isArray(filteredUsers) ? filteredUsers : []}
          columns={columns}
          getRowId={(row) => row._id}
          components={{ Toolbar: GridToolbar }}
        />
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
        <DialogTitle>{t("deleteUserConfirmation")}</DialogTitle>
        <DialogActions>
          <Button onClick={() => handleModalClose(false)} color="inherit">
            {t("cancel")}
          </Button>
          <Button onClick={() => handleModalClose(true)} color="secondary">
            {t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
