export interface Pet {
  id: string;
  name: string;
  breed: string;
  type: "dog" | "cat";
  age: string;
  gender: "Male" | "Female";
  location: string;
  city: string;
  state: string;
  price: number;
  offerPrice?: number; // Only visible to admin
  image: string;
  images?: string[];
  description: string;
  vaccination: string;
  quality: string;
  verified: boolean;
  status: "pending" | "approved" | "rejected";
  sellerId?: string;
  createdAt?: string;
}

export interface FilterState {
  petType: "dog" | "cat";
  breed: string;
  priceRange: [number, number];
  age: string;
  gender: string;
  state: string;
  city: string;
  purpose: "buying" | "adoption";
}

export const INDIAN_STATES = [
  "All States",
  "Andhra Pradesh", "Bihar", "Delhi", "Goa", "Gujarat", "Haryana",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Punjab",
  "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal",
];

export const DOG_BREEDS = [
  "All Breeds", "Labrador Retriever", "German Shepherd", "Golden Retriever",
  "Pug", "Beagle", "Rottweiler", "Doberman", "Shih Tzu",
  "Siberian Husky", "Pomeranian", "Great Dane", "Boxer",
  "Cocker Spaniel", "Dalmatian", "Indian Spitz",
];

export const CAT_BREEDS = [
  "All Breeds", "Persian", "Siamese", "Maine Coon", "British Shorthair",
  "Bengal", "Ragdoll", "Himalayan", "Indian Cat", "Bombay",
  "Scottish Fold", "Sphynx", "Russian Blue",
];

export const MOCK_PETS: Pet[] = [
  {
    id: "1", name: "Bruno", breed: "Labrador Retriever", type: "dog",
    age: "3 months", gender: "Male", location: "Mumbai, Maharashtra",
    city: "Mumbai", state: "Maharashtra", price: 18000,
    image: "", description: "Healthy, playful Labrador puppy with excellent lineage. Vaccinated and dewormed. Great family companion.",
    vaccination: "1st Dose Complete", quality: "Pet Quality", verified: true, status: "approved",
  },
  {
    id: "2", name: "Simba", breed: "Golden Retriever", type: "dog",
    age: "2 months", gender: "Male", location: "Delhi, Delhi",
    city: "Delhi", state: "Delhi", price: 25000,
    image: "", description: "Beautiful Golden Retriever puppy from champion bloodline. KCI registered parents.",
    vaccination: "Fully Vaccinated", quality: "Show Quality", verified: true, status: "approved",
  },
  {
    id: "3", name: "Cleo", breed: "Persian", type: "cat",
    age: "4 months", gender: "Female", location: "Bangalore, Karnataka",
    city: "Bangalore", state: "Karnataka", price: 15000,
    image: "", description: "Adorable Persian kitten, flat-faced, pure white coat. Very gentle and affectionate.",
    vaccination: "1st Dose Complete", quality: "Pet Quality", verified: true, status: "approved",
  },
  {
    id: "4", name: "Rocky", breed: "German Shepherd", type: "dog",
    age: "45 days", gender: "Male", location: "Pune, Maharashtra",
    city: "Pune", state: "Maharashtra", price: 22000,
    image: "", description: "Strong GSD puppy with double coat. Parents are imported lineage. Excellent guard dog potential.",
    vaccination: "Not Yet", quality: "Pet Quality", verified: false, status: "approved",
  },
  {
    id: "5", name: "Whiskers", breed: "Siamese", type: "cat",
    age: "3 months", gender: "Female", location: "Chennai, Tamil Nadu",
    city: "Chennai", state: "Tamil Nadu", price: 12000,
    image: "", description: "Playful Siamese kitten with striking blue eyes. Very vocal and social.",
    vaccination: "Fully Vaccinated", quality: "Pet Quality", verified: true, status: "approved",
  },
  {
    id: "6", name: "Max", breed: "Beagle", type: "dog",
    age: "2 months", gender: "Male", location: "Jaipur, Rajasthan",
    city: "Jaipur", state: "Rajasthan", price: 20000,
    image: "", description: "Tricolor Beagle puppy. Friendly, energetic, and great with children.",
    vaccination: "1st Dose Complete", quality: "Pet Quality", verified: true, status: "approved",
  },
  {
    id: "7", name: "Luna", breed: "Pomeranian", type: "dog",
    age: "3 months", gender: "Female", location: "Kolkata, West Bengal",
    city: "Kolkata", state: "West Bengal", price: 14000,
    image: "", description: "Fluffy Pomeranian with a beautiful orange coat. Very active and loving.",
    vaccination: "1st Dose Complete", quality: "Pet Quality", verified: true, status: "approved",
  },
  {
    id: "8", name: "Milo", breed: "Bengal", type: "cat",
    age: "5 months", gender: "Male", location: "Hyderabad, Telangana",
    city: "Hyderabad", state: "Telangana", price: 35000,
    image: "", description: "Exotic Bengal kitten with stunning rosette pattern. Very intelligent and active.",
    vaccination: "Fully Vaccinated", quality: "Show Quality", verified: true, status: "approved",
  },
  {
    id: "9", name: "Buddy", breed: "Shih Tzu", type: "dog",
    age: "2 months", gender: "Male", location: "Ahmedabad, Gujarat",
    city: "Ahmedabad", state: "Gujarat", price: 30000,
    image: "", description: "Adorable Shih Tzu puppy, tri-color coat. Hypoallergenic breed, perfect for apartments.",
    vaccination: "1st Dose Complete", quality: "Pet Quality", verified: true, status: "approved",
  },
];
