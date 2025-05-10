// Interface definitions
export interface CategoryType {
  id: string;
  label: string;
  icon: string;
}

export interface ChatMessage {
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
}

// Map types
export interface MapPosition {
  lat: number;
  lng: number;
} 