import Report from '../models/Report.js'
import Track from '../models/Track.js'
import AppError from '../classes/AppError.js'
import User from '../models/User.js'

export const createReport = async (req, res) => {
  const { trackId, message } = req.body

  // Check if track exists
  const track = await Track.findById(trackId)
  if (!track) throw new AppError('Track not found', 404)

  // Prevent reporting own tracks
  if (track.author.equals(req.userId)) {
    throw new AppError('You cannot report your own track', 400)
  }

  // Check if user hasn't already reported this track
  const existingReport = await Report.findOne({
    track: trackId,
    reporter: req.userId,
    status: 'pending',
  })

  if (existingReport) {
    throw new AppError('You have already reported this track', 400)
  }

  // Create new report
  const report = new Report({
    track: trackId,
    reporter: req.userId,
    message,
  })

  await report.save()
  res.status(201).json({ message: 'Report submitted successfully' })
}

// For admin panel
export const getReports = async (req, res) => {
  const reports = await Report.find().populate('track', 'title').populate('reporter', 'username').sort('-createdAt').lean()

  // Handle deleted tracks
  reports.forEach(report => {
    if (!report.track) {
      report.track = {
        _id: 'deleted',
        title: '[Deleted Track]',
      }
    }
    if (!report.reporter) {
      report.reporter = {
        _id: 'deleted',
        username: '[Deleted User]',
      }
    }
  })

  res.json({ reports })
}

export const updateReportStatus = async (req, res) => {
  const { reportId } = req.params
  const { status } = req.body

  if (!['resolved', 'rejected'].includes(status)) {
    throw new AppError('Invalid status', 400)
  }

  const report = await Report.findByIdAndUpdate(reportId, { status }, { new: true }).populate('track', 'title').populate('reporter', 'username')

  if (!report) throw new AppError('Report not found', 404)

  res.json({ report })
}
