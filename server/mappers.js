export function mapUser(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    photoUrl: row.photo_url || '',
  }
}

export function mapPlace(row, nearbyPlaceIds = []) {
  return {
    id: row.id,
    name: row.name,
    district: row.district,
    province: row.province,
    category: row.category,
    description: row.description,
    shortDescription: row.short_description,
    image: row.image,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    entryType: row.entry_type,
    rating: Number(row.rating),
    openingHours: row.opening_hours,
    recommendedDuration: row.recommended_duration,
    bestTimeToVisit: row.best_time_to_visit,
    nearbyPlaceIds,
  }
}

export function mapStay(row) {
  return {
    id: row.id,
    placeId: row.place_id,
    name: row.name,
    type: row.type,
    distance: row.distance,
    rating: Number(row.rating),
    priceCategory: row.price_category,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
  }
}

export function mapFeedback(row) {
  return {
    id: row.id,
    placeId: row.place_id,
    userId: row.user_id,
    userName: row.user_name,
    rating: Number(row.rating),
    comment: row.comment,
    photoUrl: row.photo_url || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    adminResponse: row.response_message
      ? {
          message: row.response_message,
          respondedAt: row.responded_at,
          adminName: row.admin_name,
        }
      : null,
  }
}
