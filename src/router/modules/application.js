const applicationsRouter = [
  {
    name: 'ApplicationCreate',
    path: 'applications/create/',
    component: () => import('@/views/application/create/index')
    // meta: { title: 'Создать', icon: 'edit', activeMenu: 'applications' },
    // hidden: true
  },
  {
    name: 'ApplicationIndex',
    path: 'applications',
    component: () => import('@/views/application/index'),
    meta: { title: 'Изменить', noCache: true, activeMenu: 'applications' },
    hidden: true
  },
  {
    name: 'ApplicationCheck',
    path: 'applications/check',
    component: () => import('@/views/application/Check'),
    // meta: { title: 'Изменить', noCache: true, activeMenu: 'applications' },
    hidden: true
  },
  {
    name: 'ApplicationsShow',
    path: 'applications/:id(\d+)',
    component: () => import('@/views/application/show'),
    // meta: { title: 'Изменить', noCache: true, activeMenu: 'applications' },
    hidden: true
  }
]

export default applicationsRouter
