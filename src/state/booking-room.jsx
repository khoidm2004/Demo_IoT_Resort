import { create } from 'zustand';

export const roomStore = create((set) => ({
  rooms: ["A Lentäjän Poika 1", "B Lentäjän Poika 2", "C Henry Ford Cabin", "D Beach House"],
  
  bookings: [
    { 
      id: "100238", 
      room: "A Lentäjän Poika 1", 
      guest: "John", 
      checkIn: "27.05.2025", 
      checkOut: "30.05.2025", 
      status: "Available", 
      action: "Late check-out", 
      note: "--" 
    },
    { 
      id: "205332", 
      room: "B Lentäjän Poika 2", 
      guest: "Anna", 
      checkIn: "26.05.2025", 
      checkOut: "27.05.2025", 
      status: "Pending confirmation", 
      action: "Need cleaning", 
      note: "asdasd" 
    },
    { 
      id: "269797", 
      room: "B Lentäjän Poika 2", 
      guest: "John", 
      checkIn: "24.05.2025", 
      checkOut: "26.05.2025", 
      status: "Booked", 
      action: "30.01.2019", 
      note: "--" 
    },
    { 
      id: "387879", 
      room: "C Henry Ford Cabin", 
      guest: "Hannah", 
      checkIn: "23.05.2025", 
      checkOut: "--", 
      status: "Triggered the trigger", 
      action: "28.01.2019", 
      note: "--" 
    },
    { 
      id: "857293", 
      room: "D Beach House", 
      guest: "Jann", 
      checkIn: "22.05.2025", 
      checkOut: "23.05.2025", 
      status: "Cleaning", 
      action: "10.01.2019", 
      note: "asdadc" 
    }
  ],
  setBookings: (newBookings) => set({ bookings: newBookings }),  
}));
