interface User {
  email: string
  username: string
}

interface Track {
  _id: string
  title: string
  image: {
    url: string
  }
  audio: {
    duration: {
      formatted: string
    }
  }
  author: any
  price: {
    currency: string
    value: number
  }
  totalStreams: number
  totalLikes: number
  isLiked: boolean
}

enum ToastType {
  INFO,
  ERROR,
  SUCCESS,
}

interface Filter {
  component: VueElement
  btnCaption: string
  popoverTitle: string
}
