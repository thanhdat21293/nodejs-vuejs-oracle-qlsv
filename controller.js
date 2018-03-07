const model = require('./model')

module.exports = {
  categoryPagination: async ctx => {
    const categoryPagination = await model.categoryPagination(ctx.request.query)
    ctx.body = categoryPagination
  }
}

