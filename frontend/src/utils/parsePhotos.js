function extractUrl(photo) {
  if (typeof photo === 'string') {
    return photo;
  }
  if (photo && typeof photo === 'object') {
    return photo.MediaURL || photo.url || photo.Uri || photo.PhotoURL || null;
  }
  return null;
}

export function getFirstPhotoUrl(lPhotos) {
  if (!lPhotos) {
    return null;
  }

  let parsed;
  try {
    parsed = typeof lPhotos === 'string' ? JSON.parse(lPhotos) : lPhotos;
  } catch {
    return null;
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    return null;
  }

  return extractUrl(parsed[0]);
}
