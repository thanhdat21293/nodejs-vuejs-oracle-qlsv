const model = require('./model')

module.exports = {
  allsv: async ctx => {
    let allsv = await model.Allsv
    ctx.body = allsv
  }
}

