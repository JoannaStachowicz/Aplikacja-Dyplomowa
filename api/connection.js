import pg from 'pg';

export const db = new pg.Pool({
    user: "postgres", 
    host: "localhost", 
    database: "projekt",
    password: "1234",
    port: 5432,
})