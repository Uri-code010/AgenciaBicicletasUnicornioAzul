const driver = (process.env.DB_DRIVER || "mssql").toLowerCase();
const sql = driver === "msnodesqlv8"
    ? require("mssql/msnodesqlv8")
    : require("mssql");

function toBool(value, defaultValue = false) {
    if (value === undefined) return defaultValue;
    return String(value).toLowerCase() === "true";
}

const baseConfig = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        trustServerCertificate: toBool(process.env.DB_TRUST_SERVER_CERTIFICATE, true),
        encrypt: false
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

const dbConfig = driver === "msnodesqlv8"
    ? {
        connectionString: process.env.DB_CONNECTION_STRING
            || `Driver={${process.env.DB_ODBC_DRIVER || "ODBC Driver 17 for SQL Server"}};`
            + `Server=${process.env.DB_SERVER};`
            + `Database=${process.env.DB_DATABASE};`
            + "Trusted_Connection=Yes;"
            + `TrustServerCertificate=${toBool(process.env.DB_TRUST_SERVER_CERTIFICATE, true) ? "Yes" : "No"};`,
        pool: baseConfig.pool
    }
    : {
        ...baseConfig,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT) || 1433
    };
 
// Pool único y reutilizable: mssql recomienda un solo pool para toda la app,
// no abrir una conexión nueva por request.
let poolPromise;
 
function getPool() {
    if (!poolPromise) {
        poolPromise = sql.connect(dbConfig)
            .then((pool) => {
                console.log("✅ Conectado a SQL Server:", process.env.DB_DATABASE);
                return pool;
            })
            .catch((err) => {
                poolPromise = null; // permite reintentar en el siguiente request
                console.error("❌ Error al conectar a SQL Server:", err.message);
                throw err;
            });
    }
    return poolPromise;
}
 
module.exports = { sql, getPool };
 