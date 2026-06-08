import React, { useState, useEffect } from "react";
import Card from "./Card";
import "./Cards.css";
import {
  UilUsdSquare,
  UilMoneyWithdrawal,
  UilClipboardAlt,
  UilCalendarAlt,
} from "@iconscout/react-unicons";
import axios from "axios";

const Cards = () => {
  const [patientCount, setPatientCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [scheduleCount, setScheduleCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const patientResponse = await axios.get(
          "https://midlink-backend.onrender.com/api/Allpatients/count",
        );
        const doctorResponse = await axios.get(
          "https://midlink-backend.onrender.com/api/admin/doctors/count",
        );
        const appointmentResponse = await axios.get(
          "https://midlink-backend.onrender.com/api/AdminPatientAppointments/count",
        );
        const scheduleResponse = await axios.get(
          "https://midlink-backend.onrender.com/api/schedules/count",
        );

        setPatientCount(patientResponse.data.count);
        setDoctorCount(doctorResponse.data.count);
        setAppointmentCount(appointmentResponse.data.count);
        setScheduleCount(scheduleResponse.data.count);
      } catch (error) {
        console.error("Error fetching counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const cardsData = [
    {
      title: "Patients",
      color: {
        backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
        boxShadow: "0px 10px 20px 0px #e0c6f5",
      },
      barValue: patientCount,
      value: loading ? "Loading..." : patientCount.toString(),
      png: UilUsdSquare,
      type: "patient",
    },
    {
      title: "Doctors",
      color: {
        backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
        boxShadow: "0px 10px 20px 0px #FDC0C7",
      },
      barValue: doctorCount,
      value: loading ? "Loading..." : doctorCount.toString(),
      png: UilMoneyWithdrawal,
      type: "doctor",
    },
    {
      title: "Appointments",
      color: {
        backGround: "linear-gradient(180deg, #81FBB8 0%, #28C76F 100%)",
        boxShadow: "0px 10px 20px 0px #b4e4d4",
      },
      barValue: appointmentCount,
      value: loading ? "Loading..." : appointmentCount.toString(),
      png: UilClipboardAlt,
      type: "appointment",
    },
    {
      title: "Schedules",
      color: {
        backGround: "linear-gradient(180deg, #FF9900 0%, #FFC266 100%)",
        boxShadow: "0px 10px 20px 0px #FFE5B4",
      },
      barValue: scheduleCount,
      value: loading ? "Loading..." : scheduleCount.toString(),
      png: UilCalendarAlt,
      type: "schedule",
    },
  ];

  return (
    <div className="Cards">
      {cardsData.map((card, id) => (
        <div className="parentContainer" key={id}>
          <Card
            title={card.title}
            color={card.color}
            barValue={card.barValue}
            value={card.value}
            png={card.png}
            type={card.type}
          />
        </div>
      ))}
    </div>
  );
};

export default Cards;
