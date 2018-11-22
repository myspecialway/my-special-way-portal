import { Point } from './point.model';

export interface BlockedSection {
  blockedReason: string;
  fromPoint: Point;
  toPoint: Point;
}
