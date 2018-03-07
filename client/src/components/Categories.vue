<template>
  <div>
    <nav>
      <div class="nav-wrapper">
        <ul id="nav-mobile" class="center">
          <li><a href="/sinh-vien">Sinh viên</a></li>
          <li><a href="/lop">Lớp</a></li>
          <li><a href="/">../</a></li>
        </ul>
      </div>
    </nav>
    <h3>QUẢN LÝ LỚP</h3>
    <div class="container">
      <button class="waves-effect waves-light btn" style="background: #ce93d8;"><i class="material-icons left">add</i>Thêm</button>
      <table class="striped">
        <thead>
          <tr>
              <th>STT</th>
              <th>Tên lớp</th>
              <th width="300"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, stt) in categories" :key="stt">
            <td>{{ ((currentPage - 1) * perPage) + stt + 1 }}</td>
            <td>{{ item.NAME }}</td>
            <td>
              <button class="waves-effect waves-light btn" style="background: #ce93d8;"><i class="material-icons left">create</i>Sửa</button>
              <button class="waves-effect waves-light btn" style="background: #ef5350;"><i class="material-icons left">clear</i>Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
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
      categories: []
    }
  },
  created () {
    axios.get(`${SERVER}/category-pagination?currentPage=${this.currentPage}&perPage=${this.perPage}`)
      .then(res => {
        this.categories = res.data
      })
  }
}
</script>

<style lang="sass" scoped>
.nav-wrapper
  text-align: center

ul
  display: inline-block

h3
  text-align: center
  font-size: 50px
  margin: 30px 0
</style>
