const moment = require('moment')
const model = require('./model')

module.exports = {
  /* *************************** CATEGORIES ********************************** */
  allCategories: async ctx => {
    const allCategories = await model.allCategories()
    ctx.body = { allCategories }
  },
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
        ctx.body = { msgErr: 'Tên lớp học đã tồn tại' }
      } else {
        let a = await model.categoryAdd(name)
        ctx.body = { msg: a }
      }
    } else {
      ctx.body = { msgErr: 'Tên lớp học không được bỏ trống' }
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
  },


  /* *************************** ITEMS ********************************** */
  itemsPagination: async ctx => {
    const itemsPagination = await model.itemsPagination(ctx.request.query)
    ctx.body = itemsPagination
  },
  itemsCount: async ctx => {
    const count = await model.itemsCount()
    ctx.body = count
  },
  itemAdd: async ctx => {
    let reqBody = ctx.request.body || {}
    reqBody.birthday = dateFormat(reqBody.birthday) || ''

    if (!reqBody.fullname) {
      ctx.body = { msgErr: 'Họ tên không được để trống.'}
    } else if (!reqBody.birthday) {
      ctx.body = { msgErr: 'Ngày sinh không được để trống.'}
    } else if (!reqBody.gender) {
      ctx.body = { msgErr: 'Giới tính không được để trống.'}
    } else {
      let a = await model.itemAdd(reqBody)
      ctx.body = { msg: a }
    }
  }

}

const dateFormat = (date) => {
  let d = new Date(date)
  return moment(d).format('D MMM YY')
  // let month = '' + (d.getMonth() + 1)
  // let day = '' + d.getDate()
  // let year = d.getFullYear()

  // if (month.length < 2) month = '0' + month
  // if (day.length < 2) day = '0' + day

  // return [day, month, year].join('-')
}


