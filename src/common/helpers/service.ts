import { calculateTimeOpenCloseService } from "@bcn/core/dist/utils/services";
import dayjs from "dayjs";
import { ScheduleType } from "@bcn/core";

export const tranformSchedules = props => {
  const { translate } = props;
  const caculateSchedule = calculateTimeOpenCloseService(
    props.schedules,
    props.closeSchedules
  );
  const { openSchedule, closedSchedule, nextOpenSchedule } = caculateSchedule;
  const today = new Date();
  const dayOfWeek = checkSpecificDays(dayjs(today).day());
  const nextDayOfWeek =
    dayjs(today).day() === 6
      ? checkSpecificDays(0)
      : checkSpecificDays(dayjs(today).day() + 1);
  const text = "";
  const isOpen = false;

  const fullDay =
    props.schedules &&
    props.schedules.length === 1 &&
    props.schedules[0].type === ScheduleType.FullDay;

  if (!!openSchedule && openSchedule.endTime && !fullDay) {
    const { endTime } = openSchedule;
    const lastEndTime = dayjs(endTime).format("h:mm A");
    return {
      text: `${translate("OPEN_STILL")} ${lastEndTime}`,
      isOpen: true
    };
  } else if (fullDay && !closedSchedule) {
    return {
      text: translate("OPEN_24H"),
      isOpen: true
    };
  } else if (fullDay && closedSchedule) {
    if (openSchedule) {
      const { day, endTime, period } = openSchedule;
      const isToday = dayOfWeek === day;
      const isTomorrow = nextDayOfWeek === day;
      const nextStartTime = dayjs(endTime).format("h:mm A");
      if (period) {
        const found = weekInMonth.find(w => w.name.toUpperCase() === period);
        return {
          text: `${translate("CLOSED_UNTIL")} ${found.secondName} ${translate(
            day
          )} ${nextStartTime}`,
          isOpen: false
        };
      }
      if (isToday) {
        return {
          text: `${translate("CLOSED_TILL")}  ${nextStartTime}`,
          isOpen: false
        };
      }

      if (isTomorrow) {
        return {
          text: `${translate("CLOSED_UNTIL")} ${nextStartTime} ${translate(
            "TOMORROW"
          )}`,
          isOpen: false
        };
      }
      return {
        text: `${translate("CLOSED_UNTIL")} ${translate(day)} ${nextStartTime}`,
        isOpen: false
      };
    } else {
      const { startTime, day } = closedSchedule;
      const lastEndTime = dayjs(startTime).format("h:mm A");
      return {
        text: `${translate("OPEN_STILL")} ${translate(day)} ${lastEndTime}`,
        isOpen: true
      };
    }
  }
  if (nextOpenSchedule && !fullDay) {
    const { day, startTime, period } = nextOpenSchedule;
    const isToday = dayOfWeek === day;
    const isTomorrow = nextDayOfWeek === day;
    const nextStartTime = dayjs(startTime).format("h:mm A");
    if (period) {
      const found = weekInMonth.find(w => w.name.toUpperCase() === period);
      return {
        text: `${translate("CLOSED_UNTIL")} ${found.secondName} ${translate(
          day
        )} ${nextStartTime}`,
        isOpen: false
      };
    }

    if (isToday) {
      const found = props.schedules.find(
        item => item.day === day && startTime > new Date()
      );
      if (found) {
        return {
          text: `${translate("CLOSED_TILL")} ${nextStartTime}`,
          isOpen: false
        };
      }

      return {
        text: `${translate("CLOSED_TILL_NEXT")} ${translate(
          day
        )} ${nextStartTime}`,
        isOpen: false
      };
    }

    if (isTomorrow) {
      return {
        text: `${translate("CLOSED_UNTIL")} ${nextStartTime} ${translate(
          "TOMORROW"
        )}`,
        isOpen: false
      };
    }
    return {
      text: `${translate("CLOSED_UNTIL")} ${translate(day)} ${nextStartTime}`,
      isOpen: false
    };
  }

  return {
    text,
    isOpen
  };
};

const checkSpecificDays = specificDays => {
  switch (specificDays) {
    case 0:
      return "SUNDAY";
    case 1:
      return "MONDAY";
    case 2:
      return "TUESDAY";
    case 3:
      return "WEDNESDAY";
    case 4:
      return "THURSDAY";
    case 5:
      return "FRIDAY";
    case 6:
      return "SATURDAY";
  }
};

export const weekInMonth = [
  {
    name: "First",
    secondName: "1st"
  },
  {
    name: "Second",
    secondName: "2nd"
  },
  {
    name: "Third",
    secondName: "3rd"
  },
  {
    name: "Fourth",
    secondName: "4th"
  },
  {
    name: "Fifth",
    secondName: "5th"
  },
  {
    name: "Last",
    secondName: "Last"
  }
];

export const parseSchedules = (schedules, translate) => {
  if (schedules && schedules.length) {
    return schedules.map((sche, idx) => ({
      key: idx,
      title: tranformType(sche, translate),
      date:
        sche.type !== ScheduleType.FullDay
          ? sche.startTime && sche.endTime
            ? `${sche.startTime} - ${sche.endTime}`
            : ""
          : ""
    }));
  }
  return [];
};

export const tranformType = (sche, translate) => {
  const { type, day, period, startDate, endDate } = sche;
  switch (type) {
    case ScheduleType.Weekly:
      return day;
    case ScheduleType.Monthly:
      return `${
        weekInMonth.find(
          week => week.name.toLocaleUpperCase() === period.toLocaleUpperCase()
        ).secondName
      } ${sortName[day.toLocaleUpperCase()]}`;
    case ScheduleType.DateRange:
      return `${dayjs(startDate).format("MM/DD")} - ${dayjs(endDate).format(
        "MM/DD"
      )}`;
    case ScheduleType.FullDay:
      return translate("OPEN_24H");
    case ScheduleType.PermanentlyClosed:
      return translate("PERMANENTLY_CLOSED");
  }
};

const sortName = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun"
};

///////////// search favorite

export const searchByName = (query: string, list) => {
  let updatedList = list;
  updatedList = updatedList.filter(
    ({ name, description }) =>
      name
        .concat(description)
        .toLowerCase()
        .search(query.toLowerCase()) !== -1
  );

  return updatedList;
};
