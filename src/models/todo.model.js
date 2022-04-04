const query = require('../configs/db.config');
const { multipleColumnSet } = require('../utils/common.util');

class TodoModel {
  constructor() {
    this.tableName = 'todos';
    this.checkTable()
  }

  checkTable = async () => {
    let sql = `
          CREATE TABLE IF NOT EXISTS ${this.tableName} (
            id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
            title VARCHAR(100) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
            activity_group_id INT(10) UNSIGNED NULL DEFAULT '0',
            is_active TINYINT(3) UNSIGNED NULL DEFAULT '1',
            priority ENUM('very-high','high','normal','low','very-low') NULL DEFAULT 'very-high' COLLATE 'latin1_swedish_ci',
            PRIMARY KEY (id) USING BTREE,
            INDEX activity_group_id (activity_group_id) USING BTREE
          )
          COLLATE='latin1_swedish_ci'
          ENGINE=MyISAM
      `;

    await query(sql);
  }

  find = async (params = {}) => {
    let sql = `SELECT * FROM ${this.tableName}`;

    if (!Object.keys(params).length) {
      return await query(sql + ' ORDER BY id DESC LIMIT 1000 OFFSET 0');
    }

    const { columnSet, values } = multipleColumnSet(params)
    sql += ` WHERE ${columnSet} ORDER BY id DESC LIMIT 1000 OFFSET 0`;

    return await query(sql, [...values]);
  }

  findOne = async (params) => {
    const { columnSet, values } = multipleColumnSet(params)

    const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

    const result = await query(sql, [...values]);

    // return back the first row
    return result[0];
  }

  create = async ({ activity_group_id, title, is_active, priority }) => {
    const sql = `INSERT INTO ${this.tableName}
        (activity_group_id, title, is_active, priority) VALUES (?,?,?,?)`;

    const result = await query(sql, [activity_group_id, title, is_active, priority]);

    return result;
  }

  update = async (params, id) => {
    const { columnSet, values } = multipleColumnSet(params)

    const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE id = ?`;

    const result = await query(sql, [...values, id]);

    return result;
  }

  delete = async (id) => {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;

    const result = await query(sql, [id]);

    return result;
  }
}

module.exports = new TodoModel;