import Vue from 'vue'
import Router from 'vue-router'
import Categories from '@/components/Categories'
import Items from '@/components/Items'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/categories',
      name: 'Categories',
      component: Categories
    },
    {
      path: '/items',
      name: 'Items',
      component: Items
    }
  ]
})
