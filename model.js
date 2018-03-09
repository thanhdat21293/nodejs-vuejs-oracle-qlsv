const oracledb = require('oracledb');
const async = require('async');
// oracledb.autoCommit = true;

var SimpleOracleDB = require('simple-oracledb');
SimpleOracleDB.extend(oracledb);

var doconnect = function(cb) {
  oracledb.getConnection(
    {
      user          : "SYSTEM",
      password      : "Abcd1234",
      connectString : "localhost:1523/orcl4"
    },
    cb);
};

var dorelease = function(conn) {
  conn.close(function (err) {
    if (err)
      console.error(err.message);
  });
};


/* *****************************************************CATEGORIES****************************************************************** */
var categoryPaginationModel = function (req, conn, cb) {
  req.currentPage = parseInt(req.currentPage) || 1
  req.perPage = parseInt(req.perPage) || 1
  req.offset = (req.currentPage - 1) * req.perPage || 0
  conn.execute(
    `SELECT * FROM SYS.categories ORDER BY name ASC OFFSET ${req.offset} ROWS FETCH NEXT ${req.perPage} ROWS ONLY`,
    {}, // A bind variable parameter is needed to disambiguate the following options parameter
    // otherwise you will get Error: ORA-01036: illegal variable name/number
    { outFormat: oracledb.OBJECT }, // outFormat can be OBJECT or ARRAY.  The default is ARRAY
    function(err, result)
    {
      if (err) {
        return cb(err, conn);
      } else {
        return cb(null, result.rows);
      }
    });
};
const categoryPagination = (req, cb) => {
  return new Promise(function(resolve, reject) {
    doconnect((err, conn) => {
      categoryPaginationModel(req, conn, (err, result) => {
        resolve(result)
      })
    })
  })
}


var categoryCountModel = function (req, conn, cb) {
  conn.execute(
    `SELECT count(*) as count FROM SYS.categories`,
    {}, // A bind variable parameter is needed to disambiguate the following options parameter
    // otherwise you will get Error: ORA-01036: illegal variable name/number
    { outFormat: oracledb.OBJECT }, // outFormat can be OBJECT or ARRAY.  The default is ARRAY
    function(err, result)
    {
      if (err) {
        return cb(err, conn);
      } else {
        return cb(null, result.rows);
      }
    });
};
const categoryCount = (req, cb) => {
  return new Promise(function(resolve, reject) {
    doconnect((err, conn) => {
      categoryCountModel(req, conn, (err, result) => {
        resolve(result)
      })
    })
  })
}


var categoryCheckNameModel = function (req, conn, cb) {
  conn.execute(
    `SELECT * FROM SYS.categories WHERE name = '${req.name}'`,
    {}, // A bind variable parameter is needed to disambiguate the following options parameter
    // otherwise you will get Error: ORA-01036: illegal variable name/number
    { outFormat: oracledb.OBJECT }, // outFormat can be OBJECT or ARRAY.  The default is ARRAY
    function(err, result)
    {
      if (err) {
        return cb(err, '');
      } else {
        return cb(null, result.rows);
      }
    });
};
const categoryCheckName = (req, cb) => {
  return new Promise(function(resolve, reject) {
    doconnect((err, conn) => {
      categoryCheckNameModel(req, conn, (err, result) => {
        if (err) {
          resolve({ msgErr: 'Lỗi'})
        }
        resolve(result)
      })
    })
  })
}


var categoryAddModel = function (req, conn, cb) {
  conn.execute(
    `INSERT INTO SYS.categories (NAME) VALUES(:name)`,
    // "INSERT INTO SYS.categories(NAME) VALUES(:0)",
    // `SELECT count(*) as count FROM SYS.categories`,
    {name: req.name}, // A bind variable parameter is needed to disambiguate the following options parameter
    // otherwise you will get Error: ORA-01036: illegal variable name/number
    { autoCommit: true },
    // {outFormat: oracledb.OBJECT, autoCommit:true},
    function(err, result)
    {
      if (err) {
        return cb(err, err.Error);
      } else {
        return cb(null, 'Thêm thành công');
      }
    });
};
const categoryAdd = (req, cb) => {
  return new Promise(function(resolve, reject) {
    doconnect((err, conn) => {
      categoryAddModel(req, conn, (err, result) => {
        if (err) {
          resolve({ msgErr: 'Không thể thêm'})
        }
        resolve(result)
      })
    })
  })
}


var categoryDeleteModel = function (req, conn, cb) {
  // console.log(req)
  conn.execute(
    `DELETE FROM SYS.categories WHERE id = :id`,
    // "INSERT INTO SYS.categories(NAME) VALUES(:0)",
    // `SELECT count(*) as count FROM SYS.categories`,
    {id: req}, // A bind variable parameter is needed to disambiguate the following options parameter
    // otherwise you will get Error: ORA-01036: illegal variable name/number
    { autoCommit: true },
    // {outFormat: oracledb.OBJECT, autoCommit:true},
    function(err, result)
    {
      if (err) {
        return cb(err, err.Error);
      } else {
        return cb(null, 'Xóa thành công');
      }
    });
};
const categoryDelete = (req, cb) => {
  return new Promise(function(resolve, reject) {
    doconnect((err, conn) => {
      categoryDeleteModel(req, conn, (err, result) => {
        if (err) {
          resolve({ msgErr: 'Không thể xóa'})
        }
        resolve(result)
      })
    })
  })
}


var categoryByIdModel = function (req, conn, cb) {
  // console.log(req)
  conn.execute(
    `SELECT * FROM SYS.categories WHERE id = :id`,
    // "INSERT INTO SYS.categories(NAME) VALUES(:0)",
    // `SELECT count(*) as count FROM SYS.categories`,
    {id: req}, // A bind variable parameter is needed to disambiguate the following options parameter
    // otherwise you will get Error: ORA-01036: illegal variable name/number
    // { autoCommit: true },
    {outFormat: oracledb.OBJECT, autoCommit:true},
    function(err, result)
    {
      if (err) {
        return cb(err, err.Error);
      } else {
        return cb(null, result.rows);
      }
    });
};
const categoryById = (req, cb) => {
  return new Promise(function(resolve, reject) {
    doconnect((err, conn) => {
      categoryByIdModel(req, conn, (err, result) => {
        if (err) {
          resolve({ msgErr: 'Không thể lấy dữ liệu'})
        }
        resolve(result)
      })
    })
  })
}


var categoryUpdateModel = function (req, conn, cb) {
  // console.log(req)
  conn.execute(
    `UPDATE SYS.categories SET name = :name  WHERE id = :id`,
    // "INSERT INTO SYS.categories(NAME) VALUES(:0)",
    // `SELECT count(*) as count FROM SYS.categories`,
    {id: req.id, name: req.name}, // A bind variable parameter is needed to disambiguate the following options parameter
    // otherwise you will get Error: ORA-01036: illegal variable name/number
    // { autoCommit: true },
    {outFormat: oracledb.OBJECT, autoCommit:true},
    function(err, result)
    {
      if (err) {
        return cb(err, err.Error);
      } else {
        return cb(null, { msg: 'Sửa thành công' });
      }
    });
};
const categoryUpdate = (req, cb) => {
  return new Promise(function(resolve, reject) {
    doconnect((err, conn) => {
      categoryUpdateModel(req, conn, (err, result) => {
        if (err) {
          resolve({ msgErr: 'Không thể cập nhật'})
        }
        resolve(result)
      })
    })
  })
}

module.exports = {
  // categories
  categoryPagination,
  categoryCount,
  categoryCheckName,
  categoryAdd,
  categoryDelete,
  categoryById,
  categoryUpdate

  // items

  // categories_items
}