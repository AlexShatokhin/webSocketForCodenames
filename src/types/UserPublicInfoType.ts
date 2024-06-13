import { teamType } from './teamType';
import { roleType } from './roleType';

export type UserPublicInfoType = {
    id: string;
    name: string;
    room: number | undefined;
    team: teamType | undefined;
    role: roleType | undefined;
}