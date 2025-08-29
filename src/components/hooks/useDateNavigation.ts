import { useState } from "react";
import moment, { Moment } from "moment";

const useDateNavigation = () => {
  const [currentDate, setCurrentDate] = useState<Moment>(moment());

  const goToNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, "month"));
  };

  const goToPreviousMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, "month"));
  };

  return {
    formattedDate: currentDate.format("YYYY-MM-DD"),
    goToNextMonth,
    goToPreviousMonth,
    setCurrentDate,
  };
};

export default useDateNavigation;
