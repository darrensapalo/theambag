import { Cause, Contributor } from "interfaces";

export type DBContributor = {
  amount?: number;
  name?: string;
  preferred_frequency?: string;
  preferred_reasons?: string[];
  cause?: DBCause;
  cause_id?: string;
};

export type DBCause = {
  id?: string;
  reason?: string;
  date?: string;
  recipient_name?: string;
  group_name?: string;
  gift?: string;
  visibility_setting?: string;
  contributors: DBContributor[];
};

export function MapDatabaseContributor(
  dbContributor: DBContributor
): Contributor {
  return {
    name: dbContributor.name,
  } as Contributor;
}

export function MapDatabaseCause(dbCause: DBCause): Cause {
  return {
    contributorGroupName: dbCause.group_name,
    contributors: dbCause.contributors.map(MapDatabaseContributor),
    date: new Date(Date.parse(dbCause.date)),
    gift: dbCause.gift,
    globalVisibilitySetting: dbCause.visibility_setting,
    id: dbCause.id,
    reason: dbCause.reason,
    recipientName: dbCause.recipient_name,
  } as Cause;
}
