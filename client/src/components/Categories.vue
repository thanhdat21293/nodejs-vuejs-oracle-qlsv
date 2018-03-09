<template>
  <div>
    <ul class="nav">
      <li class="nav-item">
        <a class="nav-link active" href="/items">Sinh viên</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/categories">Môn học</a>
      </li>
    </ul>
    <h3>QUẢN LÝ MÔN HỌC</h3>
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
              <th>Tên môn học</th>
              <th width="300"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, stt) in categories" :key="stt">
            <td>{{ ((currentPage - 1) * perPage) + stt + 1 }}</td>
            <td>{{ item.NAME }}</td>
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
        <h5 class="modal-title" id="exampleModalLongTitle">Thêm lớp</h5>
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
      perPage: 2,
      categories: [],
      count: 0,
      totalPage: 0,
      name: '',
      msgErr: '',
      msg: '',
      msgErrDel: '',
      msgDel: '',
      category: {}
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
      axios.get(`${SERVER}/category-pagination?currentPage=${this.currentPage}&perPage=${this.perPage}`)
        .then(res => {
          this.categories = res.data
        })
    },
    getCount () {
      axios.get(`${SERVER}/category-count`)
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
      if (this.name.trim()) {
        this.msgErr = ''
        this.msg = ''
        axios.post(`${SERVER}/category`, {name: this.name})
          .then(res => {
            this.msg = res.data.msg || ''
            this.msgErr = res.data.msgErr || ''
          })
      } else {
        this.msgErr = 'Tên lớp không được để trống.'
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
