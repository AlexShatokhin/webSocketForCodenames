import { teamType } from './teamType';
import { roleType } from './roleType';

export type UserPublicInfoType = {
    id: string;
    name: string;
    room: string | null;
    team: teamType | null;
    role: roleType | null;
    isCreator: boolean
}