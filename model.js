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
var doquery_object = function (conn, cb) {
  conn.execute(
    "SELECT * FROM SYS.USERS",
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

const Allsv = new Promise(function(resolve, reject) {
  async.waterfall(
    [
      doconnect,
      doquery_object
    ],
    (err, result) => {
      if (err) { reject("In waterfall error cb: ==>", err, "<=="); }
      if (result) {
        resolve(result)
      }
    });
})

module.exports = { Allsv }