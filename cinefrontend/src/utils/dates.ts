import dayjs from "dayjs";
import ruRu from 'dayjs/locale/ru';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(duration);
dayjs.extend(relativeTime);

dayjs.locale(ruRu);

export function getByDayId(dayId: number, year: number): dayjs.Dayjs {
    return dayjs(`${year}-01-${dayId}`);
}

export function getTimeFromSeconds(time: number): string {
    const duration = dayjs.duration(time, "seconds");
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
}

export function getCurrentDate(): dayjs.Dayjs {
    return dayjs();
}

export function formatDuration(seconds: number) {
    const units = [
        { label: ["день", "дня", "дней"], value: 86400 },
        { label: ["час", "часа", "часов"], value: 3600 },
        { label: ["минута", "минуты", "минут"], value: 60 },
        { label: ["секунда", "секунды", "секунд"], value: 1 }
    ];
    
    const result = [];

    for (const unit of units) {
        const count = Math.floor(seconds / unit.value);
        if (count > 0) {
            result.push(`${count} ${getPlural(count, unit.label)}`);
            seconds %= unit.value;
        }
    }

    return result.join(" ");
}

function getPlural(number: number, forms: string[]) {
    if (number % 10 === 1 && number % 100 !== 11) {
        return forms[0];
    } else if ([2, 3, 4].includes(number % 10) && ![12, 13, 14].includes(number % 100)) {
        return forms[1];
    } else {
        return forms[2];
    }
}

export {dayjs}