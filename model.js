const oracledb = require('oracledb');
const async = require('async');

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

// Optional Object Output Format
var categoryPaginationModel = function (req, conn, cb) {
  req.currentPage = parseInt(req.currentPage) || 1
  req.perPage = parseInt(req.perPage) || 1
  req.offset = (req.currentPage - 1) * req.perPage || 0
  conn.execute(
    `SELECT * FROM SYS.categories OFFSET ${req.offset} ROWS FETCH NEXT ${req.perPage} ROWS ONLY`,
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
  // return new Promise(function(resolve, reject) {
  //   async.waterfall(
  //     [
  //       doconnect,
  //       categoryPaginationModel
  //     ],
  //     (err, result) => {
  //       if (err) { reject("In waterfall error cb: ==>", err, "<=="); }
  //       if (result) {
  //         resolve(result)
  //       }
  //     });
  // })
}

module.exports = {
  categoryPagination
}