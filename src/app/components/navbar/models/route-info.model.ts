import {UserType} from '../../../models/user.model';

export interface RouteInfo {
    path: string;
    title: string;
    class: string;
    roles: UserType[];
  }
