import { ScheduleService } from './schedule.service';

describe('Schedule Service', () => {
    let scheduleService: ScheduleService;
    beforeEach(() => {
        scheduleService = new ScheduleService();
    });
    it('should be defined', () => {
        expect(scheduleService).toBeDefined();
    });
});
