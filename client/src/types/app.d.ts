interface User {
  _id: string
  email: string
  username: string
  createdAt: Date
  roles: string[]
  notificationRules: Record<string, Record<string, boolean>>
}

interface License {
  _id: string
  title: string
  shortDescription: string
  longDescription: string
}

type TrackType = 'beat' | 'sample' | 'drumkit' | 'loop' | 'all'

interface TrackComment {
  _id: string
  author: {
    username: string
    _id: string
    image: {
      url: string
    }
  }
  content: string
  totalLikes: number
  isLiked: boolean
  createdAt: Date
  updatedAt: Date
}

interface BaseTrack {
  _id: string
  title: string
  description: string
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
  license: License
  createdAt: Date
  comments: TrackComment[]
  verified: boolean
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
  playable?: boolean
  key?: string
  genre?: string
  bpm?: string
  instruments?: string[]
  mood?: string
}

interface BasePlayableTrack extends BaseTrack {
  playable: true
  audio: {
    url: string
    duration: {
      formatted: string
      seconds: number
    }
    waveform: {
      samples: number[]
    }
  }
  totalStreams: number
}

interface PopularTrack extends BasePlayableTrack {
  streamsInLast7Days: number
}

interface Beat extends BasePlayableTrack {
  type: TrackType = 'beat'
  key?: string
  genre?: string
  bpm?: string
}

interface Sample extends BasePlayableTrack {
  type: TrackType = 'sample'
  key?: string
  bpm?: string
}

interface Loop extends BasePlayableTrack {
  type: TrackType = 'loop'
  key?: string
  bpm?: string
}

interface Drumkit extends BaseTrack {
  type: TrackType = 'drumkit'
  playable: false
  //...
  //add directories
}

type Track = Beat | Sample | Drumkit | Loop

type PlayableTrack = Beat | Sample | Loop

type ToastType = 'info' | 'error' | 'success'

type Platform = 'facebook' | 'instagram' | 'soundcloud' | 'youtube' | 'twitter' | 'tiktok' | 'other'

interface SocialLink {
  platform: Platform
  url: string
}

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
  socialLinks: SocialLink[]
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
  unverified?: boolean
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
