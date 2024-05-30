export class LogPayload {
  id!: number;
  activity!: string;
  browser_type!: string;
  browser_version!: string;
  ip!: string;
  date!: string;
  time!: string;
  status!: string;
  availability!: string;
  // for user info
  user!: string;
  gender!: string;
  email!: string;
  role!: string;
}

/**
 *   first_column_title = 'ID';
  second_column_title = 'User';
  third_column_title = 'Gender';
  fourth_column_title = 'Email';
  fifth_column_title = 'Role';
  sixth_column_title = 'Activity';
  seventh_column_title = 'Date';
  eighth_column_title = 'Ip';
  ninth_column_title = 'Browser Name';
  tenth_column_title = 'Browser Version';
 */
