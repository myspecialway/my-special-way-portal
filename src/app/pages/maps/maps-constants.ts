import { IMapFloor } from './../../models/maps.model';
export const MAP_POINT_TYPES = ['רגיל', 'שירותים', 'מדרגות', 'ארון תרופות', 'חוץ', 'כניסה/יציאה', 'ראשי '];

export const MAP_FLOOR_MAPS: IMapFloor[] = [
  {
    index: -1,
    filename: 'Floor_BAEMENT_TOP_SHOT_MAP_V2',
    name: 'קומת מקלט',
  },
  {
    index: 0,
    filename: 'Floor_0_TOP_SHOT_MAP_V2',
    name: 'קומת קרקע',
  },
  {
    index: 1,
    filename: 'Floor_1_TOP_SHOT_MAP_V2',
    name: 'קומה ראשונה',
  },
  {
    index: 2,
    filename: 'Floor_2_TOP_SHOT_MAP_V2',
    name: 'קומה שנייה',
  },
];
