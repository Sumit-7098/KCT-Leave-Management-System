import cloudinary from '../utils/cloudinary.js'
import User from '../Models/user.model.js'

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Avatar file is required' })
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ message: 'Cloudinary is not configured on server' })
    }

    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`

    const uploadRes = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataUri,
        {
          folder: 'kct-leave-management/avatars',
          resource_type: 'image',
          transformation: [
            { width: 200, height: 200, crop: 'fill' },
            { quality: 'auto:best' }
          ]
        },
        (error, result) => {
          if (error) return reject(error)
          resolve(result)
        }
      )
    })


    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatarUrl: uploadRes.secure_url },
      { returnDocument: 'after' }
    )

    res.json({
      message: 'Avatar updated successfully',
      data: { avatarUrl: uploadRes.secure_url, userId: updatedUser?._id }
    })
  } catch (error) {
    console.error('Cloudinary avatar upload error:', error)

    const details = {
      message: error?.message,
      name: error?.name,
      http_code: error?.http_code,
      raw: error?.raw,
    }

    // Don’t leak secrets, but do return Cloudinary’s useful error metadata
    res.status(500).json({ message: 'Failed to upload avatar', details })
  }
}

export { uploadAvatar }


