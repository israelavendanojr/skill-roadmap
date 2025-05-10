import { CategoryType, MapPosition } from '../types';

// Fixed height for the map container
export const mapContainerStyle = {
  width: '100%',
  height: '405px', // Fixed height to match options section
  borderRadius: '12px',
};

export const initialCenter: MapPosition = {
  lat: 37.7749,
  lng: -122.4194,
};

export const categories: CategoryType[] = [
  { id: 'entertainment', label: 'Entertainment', icon: '🎭' },
  { id: 'food', label: 'Food', icon: '🍽️' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'explore', label: 'Explore', icon: '🧭' },
  { id: 'wellness', label: 'Wellness', icon: '💆' },
]; 