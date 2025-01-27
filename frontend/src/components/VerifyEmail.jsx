import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Paper } from "@mui/material";
import { CheckCircleOutline, ErrorOutline } from "@mui/icons-material";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Confetti from "react-confetti";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying");
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/verify-email/${token}`
        );

        if (response.data.status === "Success") {
          setStatus("success");
          toast.success(t("emailVerificationSuccess"), {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          });
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          setStatus("error");
          toast.error(t("emailVerificationFailed"), {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          });
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        toast.error(
          error.response?.data?.message || t("emailVerificationFailed")
        );
      }
    };

    verifyEmail();
  }, [token, navigate, t]);

  const shakeKeyframes = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="background.default"
    >
      {status === "success" && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          numberOfPieces={200}
          recycle={false}
          colors={["#00b894", "#00cec9", "#0984e3", "#6c5ce7", "#fd79a8"]}
        />
      )}
      <style>{shakeKeyframes}</style>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          maxWidth: 400,
          width: "90%",
          textAlign: "center",
          animation: status === "error" ? "shake 0.8s" : "none",
        }}
      >
        {status === "verifying" && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <CircularProgress color="secondary" size={60} thickness={4} />
            <Typography variant="h6" color="text.secondary">
              {t("verifyingEmail")}
            </Typography>
          </Box>
        )}

        {status === "success" && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <CheckCircleOutline color="success" sx={{ fontSize: 60 }} />
            <Typography variant="h6" color="success.main">
              {t("emailVerifiedSuccess")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("redirectingToLogin")}
            </Typography>
          </Box>
        )}

        {status === "error" && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <ErrorOutline color="error" sx={{ fontSize: 60 }} />
            <Typography variant="h6" color="error">
              {t("emailVerificationFailed")}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default VerifyEmail;
