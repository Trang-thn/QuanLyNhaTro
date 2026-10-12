import 'dotenv/config'
import { pool } from '../config/database'

async function testDatabase() {
  try {
    const connection = await pool.getConnection()

    try {
      const [rows] = await connection.query('SELECT 1 AS connected')

      console.log('Kết nối MySQL thành công!')
      console.log(rows)
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Kết nối MySQL thất bại:', error)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

testDatabase()
