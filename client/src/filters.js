import Vue from 'vue'

// Vue.filter('phoneFormat', (value) => {
//   if (value) {
//     let value1 = value.trim()
//     if (value1.length === 10) {
//       return value1.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
//     } else if (value1.length === 11) {
//       return value1.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')
//     } else {
//       return ''
//     }
//   } else {
//     return ''
//   }
// })

Vue.filter('dateFormat', (date) => {
  let d = new Date(date)
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()
  let year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [day, month, year].join('/')
})
