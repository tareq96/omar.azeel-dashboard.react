import dayjs from "dayjs";
import "dayjs/locale/ar";
import relativeTime from "dayjs/plugin/relativeTime";
import i18n from "i18next";

dayjs.extend(relativeTime);

dayjs.locale(i18n.language);
