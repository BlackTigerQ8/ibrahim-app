import { useState, useEffect, useMemo } from "react";
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
  const { userRole, _id: currentUserId } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchSchedules());
  }, [dispatch]);

  const filteredSchedules = useMemo(() => {
    if (userRole === "Admin") {
      return schedules;
    }
    if (userRole === "Coach") {
      return schedules.filter(
        (schedule) => schedule.athlete?.coach === currentUserId
      );
    }
    return schedules;
  }, [schedules, userRole, currentUserId]);

  // Convert schedules to calendar events
  useEffect(() => {
    if (filteredSchedules.length > 0) {
      const events = filteredSchedules.map((schedule) => ({
        id: schedule._id,
        title: `${schedule.athlete?.firstName} - ${schedule.training?.name || t("notAvailable")}`,
        // start: new Date(schedule.date),
        // end: new Date(new Date(schedule.date).getTime() + 60 * 60 * 1000), // Add 1 hour duration
        start: schedule.date,
        end: schedule.date,
        allDay: true,
        backgroundColor: getStatusColor(schedule.status),
        extendedProps: {
          status: schedule.status,
          category: schedule.category?.name || t("notAvailable"),
          athleteName: `${schedule.athlete?.firstName} ${schedule.athlete?.lastName}`,
          trainingName: schedule.training?.name || t("notAvailable"),
          notes: schedule?.notes,
        },
      }));
      setCurrentEvents(events);
    }
  }, [filteredSchedules, t]);

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
          backgroundColor={colors.primary.extraLight}
          color={colors.neutral.light}
          p="15px"
          borderRadius="4px"
        >
          <Typography variant="h5">{t("upcomingSchedules")}</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.primary.light,
                  margin: "10px 0",
                  borderRadius: "2px",
                  color: colors.secondary.main,
                  "&:hover": {
                    backgroundColor: colors.secondary.main,
                    color: colors.neutral.white,
                  },
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
                        // hour: "2-digit",
                        // minute: "2-digit",
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
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: ".8em",
                    fontWeight: "bold",
                    textAlign: "center",
                    color: colors.secondary.dark,
                    borderRadius: "2px",
                    padding: "5px",
                    "&:hover": {
                      color: colors.secondary.dark,
                    },
                  }}
                >
                  {eventInfo.event.extendedProps.athleteName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: ".8em",
                    color: colors.secondary.dark,
                    borderRadius: "2px",
                    padding: "5px",
                    textAlign: "center",
                  }}
                >
                  {eventInfo.event.extendedProps.trainingName}
                </Typography>
              </Box>
            )}
            eventClassNames="calendar-event"
            eventDidMount={(info) => {
              info.el.style.transition = "background-color 0.3s";
            }}
            listDayFormat={{
              month: "long",
              day: "2-digit",
              year: "numeric",
            }}
            listDaySideFormat={false}
            cssClass="custom-calendar"
            viewDidMount={(view) => {
              if (view.view.type === "listMonth") {
                const style = document.createElement("style");
                style.innerHTML = `
                  .fc-list-day-cushion {
                    background-color: ${colors.primary.extraLight} !important;
                    color: ${colors.neutral.light} !important;
                  }
                  .fc-list-event:hover td {
                    background-color: ${colors.primary.default} !important;
                    color: ${colors.neutral.text} !important;
                    cursor: pointer;
                  }
                  .fc-list-event:hover .fc-list-event-title,
                  .fc-list-event:hover .fc-list-event-time,
                  .fc-list-event:hover .fc-list-event-title a {
                    color: ${colors.neutral.text} !important;
                  }
                `;
                document.head.appendChild(style);
              }
              if (view.view.type === "dayGridMonth") {
                const style = document.createElement("style");
                style.innerHTML = `
                /* Popup styles */
                  .fc-popover {
                    background-color: ${colors.primary.extraLight} !important;
                    border-color: ${colors.primary.main} !important;
                  }
                  .fc-popover-header {
                    background-color: ${colors.primary.main} !important;
                    color: ${colors.secondary.main} !important;
                  }
                  .fc-popover-body {
                    color: ${colors.neutral.light} !important;
                  }
                  .fc-popover .fc-event {
                    background-color: ${colors.primary.light} !important;
                    border-color: ${colors.primary.main} !important;
                    margin: 2px 0 !important;
                    padding: 2px !important;
                  }
                  .fc-popover .fc-event:hover {
                    background-color: ${colors.primary.main} !important;
                    color: ${colors.secondary.main} !important;
                  }
                  .fc-popover .fc-event-title {
                    color: ${colors.neutral.text} !important;
                  }
                  .fc-popover .fc-event-time {
                    color: ${colors.neutral.text} !important;
                  }
                `;
                document.head.appendChild(style);
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
