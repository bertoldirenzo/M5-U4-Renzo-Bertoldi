var pool = require('./bd');

async function getTrabajos() {
    var query = 'select * from trabajos';
    var rows = await pool.query(query);
    return rows;
}

async function getTrabajosById(id) {
    var query = 'select * from trabajos where id = ?';
    var rows = await pool.query(query, [id]);
    return rows[0];
}

async function modificarTrabajosById(obj,id) {
    try{
        var query = 'update trabajos set ? where id=?';
        var rows = await pool.query(query, [obj, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function insertTrabajos(obj) {
    try {
        var query = 'insert into trabajos set ?';
        var rows = await pool.query(query, [obj]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function deleteTrabajosById(id){
    var query = 'delete from trabajos where id = ?';
    var rows = await pool.query(query, [id]);
    return rows;
}



module.exports = { getTrabajos, getTrabajosById, modificarTrabajosById, insertTrabajos, deleteTrabajosById }