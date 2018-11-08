import { BASE_REMINDER } from './../../../../models/reminder-time.model';
import * as _ from 'lodash';

export const getNewReminder = () => _.cloneDeep(BASE_REMINDER);
