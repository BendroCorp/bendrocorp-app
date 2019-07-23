import { User } from "./user-models";

export class ILNewsStory {
  id?: number;
  title?: string;
  text?: string;
  created_by?: User;
  created_by_id?: number;
  updated_by?: User;
  updated_by_id?: number;
  public?: boolean;
  created_at?: Date;
  published?: boolean;
}