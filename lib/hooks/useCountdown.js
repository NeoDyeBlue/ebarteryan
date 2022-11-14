import { useEffect, useState } from "react";
import useSocketStore from "../../store/useSocketStore";
import { compareAsc, intervalToDuration } from "date-fns";

/**
 * Custom hook for countdown
 * @param {*} targetDate
 * @see {@link https://blog.greenroots.info/how-to-create-a-countdown-timer-using-react-hooks}
 * @returns Array
 */

export default function useCountdown(targetDate) {
  const countDownDate = new Date(targetDate);
  const { socket } = useSocketStore();

  const [countDown, setCountDown] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.on("server-time", (timestamp) => {
        const ended =
          compareAsc(new Date(timestamp), countDownDate) == 1 ? true : false;
        if (!ended) {
          setCountDown(
            intervalToDuration({
              start: new Date(timestamp),
              end: countDownDate,
            })
          );
        } else {
          setCountDown({
            years: 0,
            months: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          });
          socket.off("server-time");
        }
      });

      return () => socket.off("server-time");
    }
  }, [socket]);

  return getReturnValues(countDown, countDownDate);
}

const getReturnValues = (countDown) => {
  // calculate time left
  if (countDown) {
    const totalDays = Math.floor(
      countDown.days + countDown.years * 365 + countDown.months * 30.417
    );
    const { years, months, days, ...filteredCountDown } = countDown;
    const ended = Object.values(filteredCountDown).every((value) =>
      value <= 0 ? true : false
    );
    return {
      days: totalDays,
      ...filteredCountDown,
      ended,
    };
  }
  return null;
};
