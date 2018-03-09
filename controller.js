const model = require('./model')

module.exports = {
  categoryPagination: async ctx => {
    const categoryPagination = await model.categoryPagination(ctx.request.query)
    ctx.body = categoryPagination
  },
  categoryCount: async ctx => {
    const categoryPagination = await model.categoryCount()
    ctx.body = categoryPagination
  },
  categoryAdd: async ctx => {
    let name = ctx.request.body || ''
    
    if (name) {
      const data = await model.categoryCheckName(name)
      if (data.length > 0) {
        ctx.body = { msgErr: 'Tên môn học đã tồn tại' }
      } else {
        let a = await model.categoryAdd(name)
        ctx.body = { msg: a }
      }
    } else {
      ctx.body = { msgErr: 'Tên môn học không được bỏ trống' }
    }
  },
  categoryDelete: async ctx => {
    try {
      let id = ctx.params.id ? parseInt(ctx.params.id) : ''
      let a = await model.categoryDelete(id)
      ctx.body = { msg: a }
    } catch (err) {
      ctx.body = { msgErr: 'Lỗi' }
    }
  },
  categoryById: async ctx => {
    try {
      let id = ctx.query.id ? parseInt(ctx.query.id) : ''
      let category = await model.categoryById(id)
      if (category.msgErr) {
        ctx.body = { msgErr: category.msgErr }
      } else {
        ctx.body = { category }
      }
    } catch (err) {
      ctx.body = { msgErr: 'Lỗi' }
    }
  },
  categoryUpdate: async ctx => {
    try {
      let name = ctx.request.body.name ? ctx.request.body.name : '' 
      let id = ctx.params.id ? parseInt(ctx.params.id) : ''
      let a = await model.categoryUpdate({ id, name })
      ctx.body = a
    } catch (err) {
      ctx.body = { msgErr: 'Lỗi' }
    }
  }
}

