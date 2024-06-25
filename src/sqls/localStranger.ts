import { Database, QueryExecResult } from '@jlongster/sql.js';
import squel from 'squel';

export type LocalStranger = { [key: string]: any };

export function localStranger(db: Database): QueryExecResult[] {
  return db.exec(
    `
    CREATE TABLE IF NOT EXISTS 'local_stranger' (
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

export function getStrangerInfo(
  db: Database,
  userIDList: string[]
): QueryExecResult[] {
  const ids = userIDList.map(v => `'${v}'`);
  return db.exec(
    `
        select *
        from local_stranger
        WHERE user_id = (${ids.join(',')})
        `
  );
}

export function insertStrangerInfo(
  db: Database,
  localStranger: LocalStranger
): QueryExecResult[] {
  const sql = squel
    .insert()
    .into('local_stranger')
    .setFields(localStranger)
    .toString();

  return db.exec(sql);
}

export function updateStrangerInfo(
  db: Database,
  localStranger: LocalStranger
): QueryExecResult[] {
  const sql = squel
    .update()
    .table('local_stranger')
    .setFields(localStranger)
    .where(`user_id = '${localStranger.user_id}'`)
    .toString();

  return db.exec(sql);
}
