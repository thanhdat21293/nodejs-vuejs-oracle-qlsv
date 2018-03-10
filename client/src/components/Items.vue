<template>
  <div>
    <nav class="nav nav-pills flex-column flex-sm-row">
      <a class="flex-sm-fill text-sm-center nav-link" href="/categories">Lớp học</a>
      <a class="flex-sm-fill text-sm-center nav-link active" href="/items">Sinh viên</a>
    </nav>
    <h3>QUẢN LÝ SINH VIÊN</h3>
    <div class="container">
      <button type="button" class="btn btn-outline-primary" data-toggle="modal" data-target="#exampleModalCenter" @click="showAdd">Thêm</button>
      <br><br>
      <div class="alert alert-danger" role="alert" v-if="msgErrDel">
        {{msgErrDel}}
      </div>
      <div class="alert alert-success" role="alert" v-if="msgDel">
        {{msgDel}}
      </div>
      <table class="table table-bordered table-hover">
        <thead>
          <tr>
              <th>STT</th>
              <th>Họ tên</th>
              <th>Ngày sinh</th>
              <th>Giới tính</th>
              <th>Địa chỉ</th>
              <th>Lớp học</th>
              <th>Ngày tạo</th>
              <th width="300"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, stt) in items" :key="stt">
            <td>{{ ((currentPage - 1) * perPage) + stt + 1 }}</td>
            <td>{{ item.FULLNAME }}</td>
            <td>{{ item.BIRTHDAY | dateFormat }}</td>
            <td v-if="item.GENDER === 'nam'">Nam</td>
            <td v-if="item.GENDER === 'nu'">Nữ</td>
            <td>{{ item.ADDRESS }}</td>
            <td>{{ item.NAME }}</td>
            <td>{{ item.CREATED_AT | dateFormat }}</td>
            <td>
              <button class="btn btn-outline-info" data-toggle="modal" data-target="#exampleModalCenter1" @click="showEdit(item.ID)">Sửa</button>
              <button class="btn btn-outline-danger" @click="del(item.ID)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li :class="'page-item' + [currentPage === 1 ? ' disabled' : '']" @click="getPagePrev">
            <a class="page-link" href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li v-for="i in totalPage" :key="i" :class="'page-item' + [currentPage === i ? ' active' : '']" @click="getPage(i)"><a class="page-link" href="#">{{ i }}</a></li>
          <li :class="'page-item' + [currentPage === totalPage ? ' disabled' : '']" @click="getPageNext">
            <a class="page-link" href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>

<!-- Modal them moi -->
<div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Thêm mới sinh viên</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="alert alert-danger" role="alert" v-if="msgErr">
          {{msgErr}}
        </div>
        <div class="alert alert-success" role="alert" v-if="msg">
          {{msg}}
        </div>
        Họ tên*
        <input type="text" class="form-control" v-model="fullname"> <br>
        Ngày sinh*
        <input type="date" class="form-control" v-model="birthday"> <br>
        Giới tính*
        <select class="form-control" v-model="gender">
          <option value=""></option>
          <option value="nam">Nam</option>
          <option value="nu">Nữ</option>
        </select> <br>
        Lớp học
        <select class="form-control" v-model="category">
          <option value=""></option>
          <option v-for="item in categories" :key="item.ID" :value="item.ID">{{ item.NAME }}</option>
        </select>
        <br>
        Địa chỉ
        <input type="text" class="form-control" v-model="address">

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" @click="add">Thêm mới</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal sua -->
<div class="modal fade" id="exampleModalCenter1" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content" v-if="category">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Sửa lớp</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="alert alert-danger" role="alert" v-if="msgErr">
          {{msgErr}}
        </div>
        <div class="alert alert-success" role="alert" v-if="msg">
          {{msg}}
        </div>
        Tên lớp
        <input type="text" class="form-control" v-model="name">

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" @click="update(category.ID)">Cập nhật</button>
      </div>
    </div>
  </div>
</div>

  </div>
</template>

<script>
import axios from 'axios'
const SERVER = process.env.SERVER

export default {
  data () {
    return {
      currentPage: 1,
      perPage: 1,
      items: [],
      count: 0,
      totalPage: 0,
      fullname: '',
      birthday: '',
      gender: '',
      address: '',
      msgErr: '',
      msg: '',
      msgErrDel: '',
      msgDel: '',
      item: {},
      categories: [],
      category: ''
    }
  },
  watch: {
    count () {
      this.totalPage = Math.ceil(this.count / this.perPage)
    },
    currentPage () {
      this.getData()
      this.getCount()
    },
    msg () {
      this.getCount()
      this.getData()
    },
    msgDel () {
      setTimeout(() => {
        this.msgDel = ''
      }, 2000)
    },
    msgErrDel () {
      setTimeout(() => {
        this.msgErrDel = ''
      }, 2000)
    }
  },
  created () {
    this.getData()
    this.getCount()
    axios.get(`${SERVER}/all-category`)
      .then(res => {
        this.categories = res.data.allCategories
      })
  },
  methods: {
    update (id) {
      axios.put(`${SERVER}/category/${id}`, { name: this.name })
        .then(res => {
          this.msg = res.data.msg || ''
          this.msgErr = res.data.msgErr || ''
          this.getData()
        })
    },
    showEdit (id) {
      this.msg = ''
      this.msgErr = ''
      axios.get(`${SERVER}/category?id=${id}`)
        .then(res => {
          if (res.data.msgErr) {
            this.msgErr = res.data.msgErr || ''
          } else {
            this.category = res.data.category[0] || {}
            this.name = this.category ? this.category.NAME : ''
          }
        })
    },
    del (id) {
      this.msgDel = ''
      this.msgErrDel = ''
      const confirm1 = confirm('Bạn có muốn xóa không?')
      if (confirm1) {
        axios.delete(`${SERVER}/category/${id}`)
          .then(res => {
            this.msgDel = res.data.msg || ''
            this.msgErrDel = res.data.msgErr || ''
          })
      }
    },
    getData () {
      axios.get(`${SERVER}/items-pagination?currentPage=${this.currentPage}&perPage=${this.perPage}`)
        .then(res => {
          this.items = res.data
        })
    },
    getCount () {
      axios.get(`${SERVER}/items-count`)
        .then(res => {
          this.count = parseInt(res.data[0].COUNT)
        })
    },
    showAdd () {
      this.msg = ''
      this.msgErr = ''
      this.name = ''
    },
    add () {
      if (!this.fullname) {
        this.msgErr = 'Họ tên không được để trống.'
      } else if (!this.birthday) {
        this.msgErr = 'Ngày sinh không được để trống.'
      } else if (!this.gender) {
        this.msgErr = 'Giới tính không được để trống.'
      } else {
        this.msgErr = ''
        this.msg = ''
        axios.post(`${SERVER}/item`, {
          fullname: this.fullname,
          birthday: this.birthday,
          gender: this.gender,
          category_id: this.category,
          address: this.address
        })
          .then(res => {
            this.msg = res.data.msg || ''
            this.msgErr = res.data.msgErr || ''
          })
      }
    },
    getPage (number) {
      this.currentPage = number
    },
    getPagePrev () {
      if (this.currentPage > 1) {
        this.currentPage--
      } else {
        this.currentPage = 1
      }
    },
    getPageNext () {
      if (this.currentPage < this.totalPage) {
        this.currentPage++
      } else {
        this.currentPage = this.totalPage
      }
    }
  }
}
</script>
<style lang="sass" scoped>
.nav-wrapper
  text-align: center

h3
  text-align: center
  font-size: 50px
  margin: 30px 0
</style>
