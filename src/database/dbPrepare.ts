import pkg from 'sqlite3';
const { Database } = pkg;

const db=new Database(':memory:');

export default db;