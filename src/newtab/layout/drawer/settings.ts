export const SETTINGS = [
  {
    key: 0,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.413-.587Q3 19.825 3 19v-6.6l3 3l4-4l4 4l4-4l3 3V19q0 .825-.587 1.413Q19.825 21 19 21ZM5 3h14q.825 0 1.413.587Q21 4.175 21 5v6.575l-3-3l-4 4l-4-4l-4 4l-3-3V5q0-.825.587-1.413Q4.175 3 5 3Z"/></svg>',
    component: defineAsyncComponent(() => import('./Bg.vue')),
  },
  {
    key: 1,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 18h2.1l1.1-3.05h4.8L15.5 18h2.1L13.05 6h-2.1Zm3.8-4.8l1.75-4.95h.1l1.75 4.95ZM4 22q-.825 0-1.412-.587Q2 20.825 2 20V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v16q0 .825-.587 1.413Q20.825 22 20 22Z"/></svg>',
    component: defineAsyncComponent(() => import('./Font.vue')),
  },
  {
    key: 2,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 18h2.1l1.1-3.05h4.8L15.5 18h2.1L13.05 6h-2.1Zm3.8-4.8l1.75-4.95h.1l1.75 4.95ZM4 22q-.825 0-1.412-.587Q2 20.825 2 20V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v16q0 .825-.587 1.413Q20.825 22 20 22Z"/></svg>',
    component: defineAsyncComponent(() => import('./Other.vue')),
  },
]
