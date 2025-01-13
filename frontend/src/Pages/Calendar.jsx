import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchedules } from "../redux/scheduleSlice";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../theme";
import Title from "../components/Title";
import { useTranslation } from "react-i18next";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [currentEvents, setCurrentEvents] = useState([]);

  // Get schedules from Redux store
  const { schedules, status } = useSelector((state) => state.schedule);

  useEffect(() => {
    dispatch(fetchSchedules());
  }, [dispatch]);

  // Convert schedules to calendar events
  useEffect(() => {
    if (schedules.length > 0) {
      const events = schedules.map((schedule) => ({
        id: schedule._id,
        title: `${schedule.athlete.firstName} - ${schedule.training.name}`,
        start: new Date(schedule.date),
        end: new Date(new Date(schedule.date).getTime() + 60 * 60 * 1000), // Add 1 hour duration
        backgroundColor: getStatusColor(schedule.status),
        extendedProps: {
          status: schedule.status,
          category: schedule.category.name,
          athleteName: `${schedule.athlete.firstName} ${schedule.athlete.lastName}`,
          trainingName: schedule.training.name,
          notes: schedule.notes,
        },
      }));
      setCurrentEvents(events);
    }
  }, [schedules]);

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

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    const eventDetails = `
${t("athlete")}: ${event.extendedProps.athleteName}
${t("training")}: ${event.extendedProps.trainingName}
${t("category")}: ${event.extendedProps.category}
${t("status")}: ${event.extendedProps.status}
${event.extendedProps.notes ? `${t("notes")}: ${event.extendedProps.notes}` : ""}
    `;
    alert(eventDetails);
  };

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

  return (
    <Box m="20px">
      <Title title={t("calendar")} subtitle={t("scheduleCalendar")} />

      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          <Typography variant="h5">{t("upcomingSchedules")}</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: event.backgroundColor || colors.primary.main,
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {new Date(event.start).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={false}
            selectable={false}
            selectMirror={true}
            dayMaxEvents={true}
            events={currentEvents}
            eventClick={handleEventClick}
            eventContent={(eventInfo) => (
              <Box>
                <Typography variant="body2" style={{ fontSize: "0.8em" }}>
                  {eventInfo.event.extendedProps.athleteName}
                </Typography>
                <Typography variant="body2" style={{ fontSize: "0.8em" }}>
                  {eventInfo.event.extendedProps.trainingName}
                </Typography>
              </Box>
            )}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
