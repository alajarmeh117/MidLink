import React, { useState, useEffect } from "react";
import Sidebar from "../AdminPages/sidebar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import moment from "moment-timezone";
import {
  Calendar as CalendarIcon,
  X,
  Clock,
  User,
  Stethoscope,
  CheckCircle,
  CircleDashed,
} from "lucide-react";

const SchedulesPage = () => {
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayEvents, setDayEvents] = useState([]);
  const [isLoadingDay, setIsLoadingDay] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(
        "https://midlink-backend.onrender.com/api/schedules",
      );
      const formattedEvents = response.data.map((schedule) => {
        const startDate = moment
          .utc(
            `${schedule.available_start_date}T${schedule.available_start_time}`,
          )
          .local();
        const endDate = moment
          .utc(
            `${schedule.available_end_date || schedule.available_start_date}T${schedule.available_end_time}`,
          )
          .local();

        return {
          title: `${schedule.staff_name} (${schedule.specialty})`,
          start: startDate.toDate(),
          end: endDate.toDate(),
          extendedProps: {
            staffId: schedule.staff_id,
            isBooked: schedule.is_booked,
            staffName: schedule.staff_name,
            specialty: schedule.specialty,
            startTime: startDate.format("HH:mm"),
            endTime: endDate.format("HH:mm"),
          },
        };
      });
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const handleDateClick = async (arg) => {
    const clickedDate = moment(arg.date).format("YYYY-MM-DD");
    setSelectedDate(arg.date);
    setOpenDialog(true);
    setIsLoadingDay(true);

    try {
      const response = await axios.get(
        `https://midlink-backend.onrender.com/api/schedules/date/${clickedDate}`,
      );
      const eventsOnDay = response.data.map((schedule) => {
        return {
          staffName: schedule.staff_name,
          specialty: schedule.specialty,
          startTime: schedule.available_start_time.slice(0, 5),
          endTime: schedule.available_end_time.slice(0, 5),
          isBooked: schedule.is_booked,
        };
      });

      setDayEvents(eventsOnDay);
    } catch (error) {
      console.error("Error fetching schedules for the selected date:", error);
    } finally {
      setIsLoadingDay(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-w-0 p-6 md:p-10 overflow-x-hidden animate-[fadeIn_0.4s_ease-in-out]">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#0f4c5c] flex items-center gap-3">
                <CalendarIcon className="text-[#2dd4bf]" size={32} />
                Platform Schedules Master
              </h1>
              <p className="text-slate-500 mt-2">
                Get a bird's-eye view of all doctor availabilities and bookings
                across the system.
              </p>
            </div>
          </div>

          {/* Calendar Container */}
          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100 overflow-x-auto custom-scrollbar">
            <div className="min-w-[800px]">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={events}
                dateClick={handleDateClick}
                height="750px"
                eventContent={(eventInfo) => (
                  <div className="flex flex-col px-1 py-0.5 overflow-hidden text-xs">
                    <b className="truncate text-[#0f4c5c]">
                      {eventInfo.timeText}
                    </b>
                    <i className="truncate text-slate-600 font-medium">
                      {eventInfo.event.title}
                    </i>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modern Day Details Modal */}
      {openDialog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-[fadeIn_0.2s_ease-in-out]">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="bg-[#0f4c5c] p-6 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                <CalendarIcon size={100} />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
                  <CalendarIcon className="text-[#2dd4bf]" size={24} />
                  Schedules for{" "}
                  {selectedDate && moment(selectedDate).format("MMMM D, YYYY")}
                </h2>
                <p className="text-teal-100 text-sm mt-1">
                  Detailed view of doctors available on this day.
                </p>
              </div>
              <button
                onClick={handleCloseDialog}
                className="text-white/70 hover:text-white transition-colors relative z-10 bg-white/10 p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50">
              {isLoadingDay ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2dd4bf]"></div>
                </div>
              ) : dayEvents.length > 0 ? (
                <div className="space-y-4">
                  {dayEvents.map((event, index) => (
                    <div
                      key={index}
                      className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-[#0f4c5c] shrink-0">
                          <User size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0f4c5c] text-lg">
                            {event.staffName}
                          </h4>
                          <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                            <Stethoscope size={14} className="text-[#2dd4bf]" />{" "}
                            {event.specialty}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                        <span className="bg-slate-50 px-3 py-1.5 rounded-lg text-sm font-bold text-slate-600 flex items-center gap-1.5">
                          <Clock size={14} className="text-slate-400" />
                          {event.startTime} - {event.endTime}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                            event.isBooked
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {event.isBooked ? (
                            <>
                              <CheckCircle size={14} /> Booked
                            </>
                          ) : (
                            <>
                              <CircleDashed size={14} /> Available
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-500">
                  <CalendarIcon
                    size={48}
                    className="mx-auto text-slate-300 mb-4"
                  />
                  <p className="text-lg font-medium text-[#0f4c5c]">
                    No schedules found for this date.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
              <button
                onClick={handleCloseDialog}
                className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #2dd4bf; }

        .fc { font-family: inherit !important; }
        .fc-theme-standard td, .fc-theme-standard th { border-color: #f1f5f9; }
        .fc-theme-standard .fc-scrollgrid { border-color: #e2e8f0; border-radius: 1rem; overflow: hidden; }
        .fc-col-header-cell-cushion { padding: 12px 8px !important; color: #64748b; font-weight: bold; text-transform: uppercase; font-size: 0.875rem; }
        
        .fc .fc-button-primary {
          background-color: #0f4c5c !important;
          border-color: #0f4c5c !important;
          border-radius: 0.5rem !important;
          font-weight: bold !important;
          text-transform: capitalize !important;
        }
        .fc .fc-button-primary:not(:disabled):active,
        .fc .fc-button-primary:not(:disabled).fc-button-active,
        .fc .fc-button-primary:hover {
          background-color: #2dd4bf !important;
          border-color: #2dd4bf !important;
          color: #0f4c5c !important;
        }

        .fc-h-event {
          background-color: #f0fdfa !important;
          border: 1px solid #ccfbf1 !important;
          border-radius: 0.25rem;
          margin-bottom: 2px;
          transition: transform 0.2s ease;
        }
        .fc-h-event:hover {
          transform: scale(1.02);
          z-index: 5;
          position: relative;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        
        .fc-daygrid-day.fc-day-today { background-color: #f8fafc !important; }
        .fc-daygrid-day-number { color: #0f4c5c; font-weight: bold; padding: 8px !important; }
      `}</style>
    </div>
  );
};

export default SchedulesPage;
