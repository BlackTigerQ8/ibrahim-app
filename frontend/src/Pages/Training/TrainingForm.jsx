import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { cardio } from "ldrs";
import { setUser } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Container,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { ErrorMessage, Formik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import Title from "../../components/Title";

const TrainingForm = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isLoading, setIsLoading] = useState(true);
  const savedToken = localStorage.getItem("token");
  const user = Boolean(savedToken);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { userInfo } = useSelector((state) => state.user);

  const initialValues = {
    name: "",
    description: "",
    rolnumberOfRepeatse: "",
    numberOfSets: "",
    restBetweenSets: "",
    restBetweenRepeats: "",
    category: "",
    role: "", // TO specify the role of the user
    image: "",
    createdAt: new Date(),
  };

  const userSchema = yup.object().shape({
    name: yup.string().required(t("nameIsRequired")),
    description: yup.string().required(t("descriptionIsRequired")),
    numberOfRepeats: yup.number().required(t("numberOfRepeatsIsRequired")),
    numberOfSets: yup.number().required(t("numberOfSetsIsRequired")),
    restBetweenSets: yup.number().required(t("restBetweenSetsIsRequired")),
    restBetweenRepeats: yup
      .number()
      .required(t("restBetweenRepeatsIsRequired")),
    category: yup.string().required(t("categoryIsRequired")),
    role: yup.string().required(t("roleIsRequired")),
    image: yup.mixed().test("fileType", t("onlyImageAllowed"), (value) => {
      if (!value) return true;
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      return allowedTypes.includes(value.type);
    }),
  });

  cardio.register();
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

  return <></>;
};

export default TrainingForm;
