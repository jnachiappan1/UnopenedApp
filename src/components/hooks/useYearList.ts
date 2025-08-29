import {useState} from 'react';

const useYearList = (initialRange: number) => {
  const currentYear = new Date().getFullYear();
  const [range, setRange] = useState(initialRange);
  const [startYear, setStartYear] = useState(currentYear);

  const generateYearList = (start: number, end: number) => {
    const years = [];
    for (let i = start; i < start + end; i++) {
      years.push(i);
    }
    return years;
  };

  const yearList = generateYearList(startYear, range);

  const goToNextYears = () => {
    setStartYear(prev => prev + range);
  };

  const goToPreviousYears = () => {
    setStartYear(prev => prev - range);
  };

  return {
    yearList,
    setRange,
    goToNextYears,
    goToPreviousYears,
  };
};

export default useYearList;
