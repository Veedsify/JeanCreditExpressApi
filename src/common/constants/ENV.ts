import jetEnv, { num, str } from 'jet-env';
import { isEnumVal } from 'jet-validators';

import { NodeEnvs } from '.';


/******************************************************************************
                                 Setup
******************************************************************************/

const ENV = jetEnv({
  NodeEnv: isEnumVal(NodeEnvs),
  Port: num,
  MongoDbUrl: str,
  JwtSecretKey: str,
  JwtTokenExpiration: str,
});

/******************************************************************************
                            Export default
******************************************************************************/

export default ENV;
