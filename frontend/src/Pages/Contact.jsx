import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import { cardio } from "ldrs";
import { setUser, submitContactForm } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Backdrop,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import Title from "../components/Title";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Contact = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const savedToken = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.user);
  const API_URL = process.env.REACT_APP_API_URL;

  const initialValues = {
    firstName: userInfo?.firstName || "",
    lastName: userInfo?.lastName || "",
    email: userInfo?.email || "",
    phone: userInfo?.phone || "",
    message: "",
  };

  const phoneRegExp = /^(?=([0-9\-\+])*?[0-9]{8,9}$)[\d\-\+]+$/;

  const contactSchema = yup.object().shape({
    firstName: yup.string().required(t("firstNameIsRequired")),
    lastName: yup.string().required(t("lastNameIsRequired")),
    email: yup.string().email(t("invalidEmail")).required(t("emailIsRequired")),
    phone: yup
      .string()
      .matches(phoneRegExp, t("invalidPhoneNumber"))
      .test("digit-count", t("phoneNumberLength"), (value) => {
        if (!value) return false;
        const digitCount = value.replace(/\D/g, "").length;
        return digitCount >= 8 && digitCount <= 9;
      })
      .required(t("phoneIsRequired")),
    message: yup.string().required(t("messageIsRequired")),
  });

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsSending(true);
    try {
      await dispatch(submitContactForm(values)).unwrap();
      resetForm();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      if (savedToken) {
        const savedUser = JSON.parse(localStorage.getItem("userInfo"));
        if (savedUser) {
          dispatch(setUser(savedUser));
        }
      }
      setIsLoading(false);
    };

    checkUser();
    cardio.register();
  }, [dispatch, savedToken]);

  const commonInputStyles = {
    "& .MuiInputLabel-root.Mui-focused": {
      color: "secondary.main",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "secondary.main",
    },
    "& .MuiFilledInput-root.Mui-focused": {
      borderColor: "secondary.main",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "secondary.main",
    },
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: "secondary.main",
    },
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100dvh",
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

  return (
    <Container>
      <Backdrop
        sx={{
          color: colors.secondary.main,
          zIndex: (theme) => theme.zIndex.modal + 1,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
        open={isSending}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <l-cardio
            size="50"
            stroke="4"
            speed="1.75"
            color={colors.secondary.main}
          />
          <Typography variant="h6" color="secondary">
            {t("sendingMessage")}
          </Typography>
        </Box>
      </Backdrop>

      <Box>
        <Title title={t("contactUsTitle")} subtitle={t("contactUsSubtitle")} />
      </Box>

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={contactSchema}
        enableReinitialize={true}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {["firstName", "lastName", "email", "phone"].map(
                (field, index) => (
                  <TextField
                    key={field}
                    fullWidth
                    variant="filled"
                    label={t(field)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values[field]}
                    name={field}
                    error={touched[field] && !!errors[field]}
                    helperText={touched[field] && errors[field]}
                    sx={{ gridColumn: "span 2", ...commonInputStyles }}
                    disabled={userInfo?.role !== "Admin"}
                    title={
                      userInfo?.role !== "Admin"
                        ? t("onlyAdminCanEdit")
                        : undefined
                    }
                  />
                )
              )}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label={t("message")}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.message}
                name="message"
                multiline
                rows={4}
                error={!!touched.message && !!errors.message}
                helperText={touched.message && errors.message}
                sx={{ gridColumn: "span 4", ...commonInputStyles }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={!values.message}
              >
                {t("sendMessage")}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default Contact;
