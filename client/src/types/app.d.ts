interface User {
  _id: string
  email: string
  username: string
}

type TrackType = 'beat' | 'sample' | 'drumkit' | 'all'

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

interface BasePlayableTrack extends BaseTrack {
  audio: {
    url: string
    duration: {
      formatted: string
      seconds: number
    }
  }
  totalStreams: number
}

interface Beat extends BasePlayableTrack {
  type: TrackType = 'beat'
  playable: true
  key?: string
  genre?: string
  bpm?: string
}

interface Sample extends BasePlayableTrack {
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

type PlayableTrack = Beat | Sample

type ToastType = 'info' | 'error' | 'success'

interface Profile {
  createdAt: Date
  username: string
  _id: string
  isFollowed: boolean
  totalFollows: number
  totalUploads: number
  specification: string
  image: {
    url: string
  }
}

interface GetTracksFilters {
  bpm?: {
    min: string
    max: string
  }
  key?: string
  genre?: string
  authorId?: string
  phrase?: string
  liked?: boolean
}

// Define the filter interfaces
interface BaseFilter {
  id: string
  type: string
  label: string
}

interface RangeFilter extends BaseFilter {
  type: 'range'
  value: {
    min: string
    max: string
  }
}

interface ExactFilter extends BaseFilter {
  type: 'exact'
  value: string
}

interface SetFilter extends BaseFilter {
  type: 'set'
  values: [string, boolean][]
}

type Filter = RangeFilter | ExactFilter | SetFilter
