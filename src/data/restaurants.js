export const restaurants = [
  { id: 'rst-sigiriya-1', placeId: 'sigiriya', name: 'Chati Restaurant', cuisine: 'Sri Lankan', distance: '1.8 km', priceCategory: 'Mid-range', rating: 4.4 },
  { id: 'rst-sigiriya-2', placeId: 'sigiriya', name: 'Flavor Garden', cuisine: 'Rice & curry', distance: '2.4 km', priceCategory: 'Budget', rating: 4.2 },
  { id: 'rst-kandy-1', placeId: 'temple-of-the-tooth', name: 'The Empire Cafe', cuisine: 'Cafe / fusion', distance: '0.3 km', priceCategory: 'Mid-range', rating: 4.5 },
  { id: 'rst-kandy-2', placeId: 'kandy-lake', name: 'Slightly Chilled Lounge', cuisine: 'International', distance: '1.1 km', priceCategory: 'Premium', rating: 4.6 },
  { id: 'rst-ella-1', placeId: 'nine-arches-bridge', name: 'Cafe Chill', cuisine: 'Cafe', distance: '1.2 km', priceCategory: 'Budget', rating: 4.5 },
  { id: 'rst-ella-2', placeId: 'little-adams-peak', name: 'AK Ristoro', cuisine: 'Italian / Sri Lankan', distance: '0.8 km', priceCategory: 'Mid-range', rating: 4.7 },
  { id: 'rst-galle-1', placeId: 'galle-fort', name: 'Church Street Social', cuisine: 'Seafood', distance: '0.2 km', priceCategory: 'Premium', rating: 4.6 },
  { id: 'rst-galle-2', placeId: 'unawatuna-beach', name: 'Bedspace Kitchen', cuisine: 'Beach cafe', distance: '0.1 km', priceCategory: 'Mid-range', rating: 4.4 },
  { id: 'rst-ne-1', placeId: 'gregory-lake', name: 'The Hill Club Dining', cuisine: 'Colonial / European', distance: '1.3 km', priceCategory: 'Premium', rating: 4.5 },
  { id: 'rst-ne-2', placeId: 'victoria-park', name: 'De Silva Food Centre', cuisine: 'Sri Lankan bakery', distance: '0.4 km', priceCategory: 'Budget', rating: 4.3 },
  { id: 'rst-yala-1', placeId: 'yala-national-park', name: 'Tissa Lake Restaurant', cuisine: 'Seafood / local', distance: '20 km', priceCategory: 'Mid-range', rating: 4.2 },
  { id: 'rst-mirissa-1', placeId: 'mirissa-beach', name: 'Zephyr Restaurant', cuisine: 'Seafood', distance: '0.2 km', priceCategory: 'Mid-range', rating: 4.5 },
  { id: 'rst-colombo-1', placeId: 'gangaramaya-temple', name: 'Ministry of Crab', cuisine: 'Seafood', distance: '1.6 km', priceCategory: 'Premium', rating: 4.8 },
  { id: 'rst-dambulla-1', placeId: 'dambulla-cave-temple', name: 'Dambulla Heritage Cafe', cuisine: 'Sri Lankan', distance: '0.9 km', priceCategory: 'Budget', rating: 4.1 },
]

export function restaurantsForPlaces(placeIds) {
  const ids = new Set(placeIds)
  return restaurants.filter((item) => ids.has(item.placeId))
}