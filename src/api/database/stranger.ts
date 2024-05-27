import {
  LocalStranger,
  getStrangerInfo as databaseGetStrangerInfo,
  insertStrangerInfo as databseInsertStrangerInfo,
  updateStrangerInfo as databaseUpdateStrangerInfo,
} from '@/sqls';
import { getInstance } from './instance';
import {
  converSqlExecResult,
  convertObjectField,
  convertToSnakeCaseObject,
  formatResponse,
} from '@/utils';
import { DatabaseErrorCode } from '@/constant';

export async function getStrangerInfo(userIDListStr: string): Promise<string> {
  try {
    const db = await getInstance();
    const execResult = databaseGetStrangerInfo(db, JSON.parse(userIDListStr));

    return formatResponse(
      converSqlExecResult(execResult[0], 'CamelCase', [], {
        name: 'nickname',
      })
    );
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export function setStrangerInfo(
  localStrangerInfoListStr: string
): Promise<string> {
  try {
    const localStrangerInfoList = (
      JSON.parse(localStrangerInfoListStr) as LocalStranger[]
    ).map(
      item =>
        convertToSnakeCaseObject(
          convertObjectField(item, {
            nickname: 'nickname',
          })
        ) as LocalStranger
    );
    localStrangerInfoList.map((localStrangerInfo: LocalStranger) =>
      setSingleStrangerInfo(localStrangerInfo)
    );

    return Promise.resolve(formatResponse(''));
  } catch (e) {
    console.error(e);

    return Promise.resolve(
      formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e))
    );
  }
}

export async function setSingleStrangerInfo(
  localStrangerInfo: LocalStranger
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetStrangerInfo(db, [localStrangerInfo.user_id]);
    const result = converSqlExecResult(execResult[0]);
    if (result.length) {
      databaseUpdateStrangerInfo(db, localStrangerInfo);
    } else {
      databseInsertStrangerInfo(db, localStrangerInfo);
    }
    return formatResponse('');
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}
