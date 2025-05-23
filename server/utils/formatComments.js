import { generateSignedUrl } from '../s3.js'

const formatComments = async (comments, userId) => {
  const formattedComments = await Promise.all(
    comments.map(async comment => {
      const formattedComment = { ...comment._doc }

      //determine whter
      formattedComment.isLiked = !!comment.likes.find(el => el.equals(userId))

      // Delete votes array
      delete formattedComment.likes

      //if comment author has been deleted set information accordingly
      if (!formattedComment.author) {
        formattedComment.author = {
          _id: 'deleted',
          username: '[Deleted User]',
          image: { filename: 'rudimentary-image.png' },
        }
      }

      // Attach image URL
      if (formattedComment.author.image.filename) {
        formattedComment.author.image.url = await generateSignedUrl(formattedComment.author.image.filename)
      }

      return formattedComment
    })
  )

  return formattedComments
}

export default formatComments
