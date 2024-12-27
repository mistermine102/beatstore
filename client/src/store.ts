import { createStore, Store } from 'vuex'

interface State {
  user: User | null
  token: string | null
  currentlyPlaying: {
    track: Track | null
    isPaused: boolean
  }
  toast: {
    isOpen: boolean
    type: ToastType
    title: string
    message: string
  }
}

const store = createStore<State>({
  state() {
    return {
      user: null,
      token: null,
      currentlyPlaying: {
        track: null,
        isPaused: false,
      },
      toast: {
        isOpen: false,
        type: ToastType.INFO,
        title: '',
        message: '',
      },
    }
  },
  mutations: {
    toggleToast(state) {
      state.toast.isOpen = !state.toast.isOpen
    },
    setAlert(state, payload) {
      const { type, title, message } = payload

      state.toast = {
        ...state.toast,
        type,
        title,
        message,
      }
    },
    clearAlert(state) {
      state.toast = {
        ...state.toast,
        type: ToastType.INFO,
        title: 'test',
        message: 'test',
      }
    },
    setCurrentlyPlaying(state, payload: { track: Track; isPaused: boolean }) {
      if (payload.track && payload.track._id !== state.currentlyPlaying.track?._id) {
        state.currentlyPlaying.track = payload.track
      }
      state.currentlyPlaying.isPaused = payload.isPaused
    },
    setUser(state, user: User) {
      state.user = user
    },
    setToken(state, token: string) {
      state.token = token
    },
    clearUser(state) {
      state.user = null
    },
  },
  actions: {
    showAlert(ctx, payload: { type: ToastType; title: string; message: string }) {
      const { type = ToastType.INFO, title = 'title', message } = payload

      ctx.commit('setAlert', {
        type,
        title,
        message,
      })

      ctx.commit('toggleAlert')

      setTimeout(() => {
        ctx.commit('toggleAlert')
        ctx.commit('clearAlert')
      }, 3000)
    },
    login(ctx, payload: { user: User; token: string }) {
      ctx.commit('setUser', payload.user)
      ctx.commit('setToken', payload.token)

      localStorage.setItem('token', payload.token)

      router.push('/')
    },
    async getUser(ctx) {
      const token = localStorage.getItem('token')
      if (!token) return

      ctx.commit('setToken', token)
      const res = await appApi.get('/auth/' + token)

      if (res.data.message === 'TokenExpired') {
        return localStorage.removeItem('token')
      }

      const { user } = res.data

      ctx.commit('setUser', user)
    },
    logout(ctx) {
      ctx.commit('clearUser')
      ctx.commit('setToken', null)
      localStorage.removeItem('token')

      router.push('/')
    },
  },
})

export default store
