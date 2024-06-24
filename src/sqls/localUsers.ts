import squel from 'squel';
import { Database, QueryExecResult } from '@jlongster/sql.js';

export type ClientUser = { [key: string]: unknown };

export function localUsers(db: Database): QueryExecResult[] {
  return db.exec(
    `
    CREATE TABLE IF NOT EXISTS 'local_users'(
      'user_id' varchar(64),
      'nickname' varchar(255),
      'face_url' varchar(255),
      'create_time' integer,
      'app_manger_level' integer,
      'ex' varchar(1024),
      'attached_info' varchar(1024),
      'global_recv_msg_opt' integer,
      'phone_number' varchar(32),
      'gender' integer,
      'birth' integer,
      'email' varchar(32),
      'birth_str' varchar(32),
      'status' integer,
      'tenant_id' integer,
      'sub_tenant_id' integer,
      'user_center_id' integer,
      'yx_im_id' varchar(32),
      'position_id' varchar(32),
      'position_name' varchar(128),
      'hire_date' varchar(32),
      PRIMARY KEY ('user_id')
    )
    `
  );
}

export function getLoginUser(db: Database, userID: string): QueryExecResult[] {
  return db.exec(
    `
        select * from local_users where user_id = '${userID}'  limit 1;
    `
  );
}

export function insertLoginUser(
  db: Database,
  user: ClientUser
): QueryExecResult[] {
  const sql = squel.insert().into('local_users').setFields(user).toString();

  return db.exec(sql);
}

export function updateLoginUser(
  db: Database,
  user: ClientUser
): QueryExecResult[] {
  const sql = squel
    .update()
    .table('local_users')
    .setFields(user)
    .where(`user_id = '${user.user_id}'`)
    .toString();

  return db.exec(sql);
}
