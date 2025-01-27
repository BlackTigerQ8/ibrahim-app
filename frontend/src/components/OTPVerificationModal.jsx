import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const OTPVerificationModal = ({
  open,
  onClose,
  onVerify,
  email,
  onResendOTP,
}) => {
  const [otp, setOTP] = useState("");
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const { t } = useTranslation();

  const handleResend = async () => {
    try {
      setIsResending(true);
      await onResendOTP();
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("verifyEmail")}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t("otpSentTo")} {email}
          </Typography>
          <TextField
            fullWidth
            label={t("enterOTP")}
            value={otp}
            onChange={(e) => {
              setOTP(e.target.value);
              setError("");
            }}
            error={!!error}
            helperText={error}
            sx={{ mb: 2 }}
          />
          <Button
            variant="text"
            color="primary"
            onClick={handleResend}
            disabled={isResending}
            sx={{ mb: 2 }}
          >
            {isResending ? t("resendingOTP") : t("resendOTP")}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t("cancel")}
        </Button>
        <Button
          onClick={() => onVerify(otp)}
          color="secondary"
          variant="contained"
        >
          {t("verify")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OTPVerificationModal;
