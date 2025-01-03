interface User {
  _id: string
  email: string
  username: string
}

type TrackType = 'beat' | 'sample' | 'drumkit'

interface BaseTrack {
  _id: string
  title: string
  image: {
    url: string
    averageColor: {
      hex: string
      hexa: string
      rgb: string
      rgba: string
      isDark: boolean
      isLight: boolean
    }
  }
  author: {
    username: string
    _id: string
  }
  price?: {
    currency: string
    value: number
  }
  totalLikes: number
  isLiked: boolean
  audio?: {
    url: string
    duration: {
      formatted: string
      seconds: number
    }
  }
  totalStreams?: number
  type: TrackType
  playable: boolean
  key?: string
  genre?: string
  bpm?: string
}

interface PlayableTrack extends BaseTrack {
  audio: {
    url: string
    duration: {
      formatted: string
      seconds: number
    }
  }
  totalStreams: number
}

interface Beat extends PlayableTrack {
  type: TrackType = 'beat'
  playable: true
  key?: string
  genre?: string
  bpm?: string
}

interface Sample extends PlayableTrack {
  type: TrackType = 'sample'
  playable: true
  key?: string
  bpm?: string
}

interface Drumkit extends BaseTrack {
  type: TrackType = 'drumkit'
  playable: false
  //...
  //add directories
}

type Track = Beat | Sample | Drumkit

interface Filter {
  component: VueElement
  btnCaption: string
  popoverTitle: string
}

type ToastType = 'info' | 'error' | 'success'
