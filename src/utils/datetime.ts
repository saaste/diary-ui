import * as moment from "moment-timezone"
import { DATE_TIME_FORMAT, DATE_TIME_FORMAT_OPTIONS, LOCAL_TIMEZONE } from "../config";

const rtf = new Intl.DateTimeFormat(DATE_TIME_FORMAT, DATE_TIME_FORMAT_OPTIONS);

export const timestampToDateString = (timestamp: number): string => {
    return rtf.format(moment.tz(timestamp * 1000, LOCAL_TIMEZONE).toDate())
}
