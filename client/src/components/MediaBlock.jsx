import { useState } from 'react'

/**
 * Renders project/event media: image and/or video (URL or local path).
 * Supports YouTube, Vimeo, or direct video URLs (/uploads/xxx.mp4).
 */
export function isYouTube(url) {
  if (!url || typeof url !== 'string') return false
  return /youtube\.com|youtu\.be/.test(url)
}
export function isVimeo(url) {
  if (!url || typeof url !== 'string') return false
  return /vimeo\.com/.test(url)
}
function youTubeEmbed(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/)
  const id = match ? match[1] : null
  return id ? `https://www.youtube.com/embed/${id}` : null
}
function vimeoEmbed(url) {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  const id = match ? match[1] : null
  return id ? `https://player.vimeo.com/video/${id}` : null
}

function LocalVideoPlayer({ src, title, className }) {
  const [aspectRatio, setAspectRatio] = useState(null)

  const onLoadedMetadata = (e) => {
    const v = e.target
    if (v.videoWidth && v.videoHeight) {
      setAspectRatio(v.videoWidth / v.videoHeight)
    }
  }

  const style = aspectRatio
    ? { aspectRatio: `${aspectRatio}` }
    : { minHeight: '200px' }

  return (
    <div
      className={`mx-auto max-h-[70vh] w-full max-w-full overflow-hidden rounded-2xl bg-black ${className}`}
      style={style}
    >
      <video
        src={src}
        controls
        className="h-full w-full object-contain"
        playsInline
        onLoadedMetadata={onLoadedMetadata}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export default function MediaBlock({ image, video, title, className = '', imageClassName = '', videoClassName = '' }) {
  const hasImage = image && image.trim()
  const hasVideo = video && video.trim()
  const embedUrl = hasVideo && (isYouTube(video) ? youTubeEmbed(video) : isVimeo(video) ? vimeoEmbed(video) : null)
  const isLocalVideo = hasVideo && !embedUrl && (video.startsWith('/') || video.startsWith('http'))

  return (
    <div className={className}>
      {hasImage && (
        <img
          src={image.startsWith('http') ? image : image}
          alt={title || 'Media'}
          className={imageClassName || 'h-full w-full rounded-2xl object-cover'}
        />
      )}
      {hasVideo && (
        <div className={videoClassName || 'mt-3'}>
          {embedUrl ? (
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
              <iframe
                src={embedUrl}
                title={title || 'Video'}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : isLocalVideo ? (
            <LocalVideoPlayer
              src={video}
              title={title}
              className="mt-0"
            />
          ) : null}
        </div>
      )}
    </div>
  )
}
