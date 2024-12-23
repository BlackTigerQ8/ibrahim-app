import React, { useEffect } from "react";
import { Typography, Box, Button, useTheme, Alert } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import SportsOutlinedIcon from "@mui/icons-material/SportsOutlined";
import DirectionsRunOutlinedIcon from "@mui/icons-material/DirectionsRunOutlined";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
  const filteredUsers = users.filter((user) => user.role !== "Admin");
  const { userRole } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const token =
    useSelector((state) => state.user.token) || localStorage.getItem("token");

  const columns = [
    {
      field: "name",
      headerName: t("name"),
      headerAlign: "center",
      flex: 0.75,
      cellClassName: "name-column--cell",
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
      field: "email",
      headerName: t("email"),
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "phone",
      headerAlign: "center",
      headerName: t("phone"),
      flex: 1,
    },
    {
      field: "role",
      headerName: t("accessLevel"),
      flex: 1,
      headerAlign: "center",
      align: "center",
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
    {
      field: "actions",
      headerName: t("actions"),
      width: 150,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
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
  ];

  useEffect(() => {
    //if (status === "succeeded") {
    dispatch(fetchUsers(token));
    //}
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

  const handleDelete = async (userId) => {
    try {
      dispatch(deleteUser(userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <Box m="20px">
      <Title title={t("users")} subtitle={t("manageUsers")} />
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
          "& .name-column--cell": {
            color: colors.neutral.main,
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

export default Users;
