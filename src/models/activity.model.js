const query = require('../configs/db.config');
const { multipleColumnSet } = require('../utils/common.util');

class ActivityModel {
    constructor() {
        this.tableName = 'activities';
        this.checkTable()
    }

    checkTable = async () => {
        let sql = `
            CREATE TABLE IF NOT EXISTS ${this.tableName} (
                id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
                email VARCHAR(250) NOT NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
                title VARCHAR(100) NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
                created_at TIMESTAMP NULL DEFAULT current_timestamp(),
                updated_at TIMESTAMP NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
                PRIMARY KEY (id) USING BTREE
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

    create = async ({ email, title }) => {
        const sql = `INSERT INTO ${this.tableName}
        (email, title) VALUES (?,?)`;

        const result = await query(sql, [email, title]);

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

module.exports = new ActivityModel;