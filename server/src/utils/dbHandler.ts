import sql, {
    config as SqlConfig,
    ISqlType,
    IResult,
    ISqlTypeFactoryWithNoParams,
    ISqlTypeFactoryWithLength,
    ISqlTypeFactoryWithScale,
    ISqlTypeFactoryWithPrecisionScale,
    ConnectionPool
  } from "mssql";
  import dotenv from "dotenv";
  
  dotenv.config();
  
  const { DB_SERVER, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

  if (!DB_SERVER || !DB_NAME || !DB_USER || !DB_PASSWORD) {
    throw new Error('Database environment variables (DB_SERVER, DB_NAME, DB_USER, DB_PASSWORD) must be defined.');
  }

  const config: SqlConfig = {
    server: DB_SERVER,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  };
  
   // Aceptar tanto instancias de tipo (ISqlType) como fábricas (sql.Int, sql.VarChar, etc.)
   type SqlParamType =
     | ISqlType
     | ISqlTypeFactoryWithNoParams
     | ISqlTypeFactoryWithLength
     | ISqlTypeFactoryWithScale
     | ISqlTypeFactoryWithPrecisionScale;
  
   interface InputParameter {
     name: string;
     type: SqlParamType;
     value: any;
   }
  
   interface OutputParameter {
     name: string;
     type: SqlParamType;
   }
  
  interface ExecuteRequestParams {
    query: string;
    inputs?: InputParameter[];
    outputs?: OutputParameter[];
    isStoredProcedure?: boolean;
  }
  
  let poolPromise: Promise<ConnectionPool> | null = null;
  
  function getPool(): Promise<ConnectionPool> {
    if (!poolPromise) {
      poolPromise = new sql.ConnectionPool(config)
        .connect()
        .then((pool) => {
          console.log("Conectado a la base de datos");
          return pool;
        })
        .catch((err: any) => {
          console.error("Error al conectar a la base de datos:", err);
          poolPromise = null; // Reset para permitir reintentos
          throw err;
        });
    }
    return poolPromise;
  }
  
  export async function executeRequest({
    query,
    inputs = [],
    outputs = [],
    isStoredProcedure = false,
  }: ExecuteRequestParams): Promise<IResult<any>> {
    //console.log("Parámetros enviados al SP:", inputs); <--  PARA VER QUE INPUTS ESTOY ENVIANDO
    try {
      const pool = await getPool();
      const request = pool.request();
  
      // Agregar parámetros de entrada
      inputs.forEach(({ name, type, value }) => {
        request.input(name, type, value);
      });
  
      // Agregar parámetros de salida
      outputs.forEach(({ name, type }) => {
        request.output(name, type);
      });
  
      const result = isStoredProcedure
        ? await request.execute(query)
        : await request.query(query);
  
      return result;
    } catch (error) {
      console.error("Error en executeRequest:", error);
      throw error;
    }
  }

// interface StoredProcedureParams {
//   [key: string]: string | number | boolean | null;
// }

// export const executeStoredProcedure = async (
//   procedureName: string,
//   params: StoredProcedureParams = {}
// ) => {
//   try {
//     const pool = await getPool();
//     const request = pool.request();

//     for (const key in params) {
//       if (Object.prototype.hasOwnProperty.call(params, key)) {
//         request.input(key, params[key]);
//       }
//     }
    
//     const result = await request.execute(procedureName);
//     return result.recordset;
//   } catch (error) {
//     console.error(`Error executing stored procedure ${procedureName}:`, error);
//     throw error;
//   }
// };
  
  export { sql };
  