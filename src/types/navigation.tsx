// types/navigation.ts
import { Birthday } from './Birthday';

export type RootStackParamList = {
  Home: { refresh?: boolean } | undefined;
  AddBirthday: undefined;
  EditBirthday: { birthday: Birthday };
  Settings: undefined;
};
