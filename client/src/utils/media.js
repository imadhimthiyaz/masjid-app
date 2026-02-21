/** Get images array from project or event (supports legacy single image) */
export function getImages(item) {
  return Array.isArray(item?.images) ? item.images : (item?.image ? [item.image] : [])
}

/** Get first image URL for cover/primary display */
export function getFirstImage(item) {
  const imgs = getImages(item)
  return imgs[0] || null
}
