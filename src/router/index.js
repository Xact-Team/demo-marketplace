import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home-page" */ '@/views/HomePage'),
    meta: {
      title: 'Homepage'
    }
  },
  {
    path: '/import',
    name: 'ImportAccount',
    component: () => import(/* webpackChunkName: "import-account" */ '@/views/ImportAccount'),
    meta: {
      title: 'Import your hedera account'
    }
  },
  {
    path: '/nft/create',
    name: 'NftCreate',
    component: () => import(/* webpackChunkName: "nft-create" */ '@/views/nft/NftCreate'),
    meta: {
      title: 'Create new NFT',
    }
  },
  {
    path: '/nft/:id',
    name: 'NftShow',
    component: () => import(/* webpackChunkName: "nft-show" */ '@/views/nft/NftShow'),
    meta: {
      title: 'Show NFT'
    }
  },
  {
    path: '/middleman',
    component: () => import(/* webpackChunkName: "middleman-layout" */ '@/layouts/LayoutMiddleman'),
    meta: {
      middleman: true
    },
    children: [
      {
        path: 'dashboard',
        name: 'MiddlemanDashboard',
        component: () => import(/* webpackChunkName: "middleman-dashboard" */ '@/views/middleman/Index'),
        meta: {
          title: 'Middleman Dashboard'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  let user = store.getters['user/user']

  document.title = `${to.meta.title} | Demo Marketplace`

  if (notAMiddlemanAccount(user) && to.meta.middleman) {
    next(from.path)
  } else {
    next()
  }
})

function notAMiddlemanAccount(user) {
  return process.env.VUE_APP_MIDDLEMAN_MAINNET_PRIVATE !== user.private_key
    || process.env.VUE_APP_MIDDLEMAN_TESTNET_PRIVATE !== user.private_key
}

export default router
