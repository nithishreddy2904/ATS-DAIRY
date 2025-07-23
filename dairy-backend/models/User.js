const bcrypt = require('bcryptjs');
const db = require('../config/database'); // promise pool

class User {
  static async create({ id, name, email, password, role }) {
    const password_hash = await bcrypt.hash(password, 12);
    await db.execute(
      'INSERT INTO users (id,name,email,password_hash,role) VALUES (?,?,?,?,?)',
      [id, name, email, password_hash, role]
    );
    return { id, name, email, role };
  }

  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async compare(pwd, hash) {
    return bcrypt.compare(pwd, hash);
  }
}

module.exports = User;
