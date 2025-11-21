'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Button } from './ui/Button';
import Link from 'next/link';

// Fix Leaflet icon issue in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

type User = {
  id: string;
  name: string;
  lat: number | null;
  lng: number | null;
  category_tags: string;
  profile_pic: string;
  bio: string;
};

export default function MapComponent({ users }: { users: User[] }) {
  const [isMounted, setIsMounted] = useState(false);
  const [center, setCenter] = useState<[number, number]>([19.0760, 72.8777]); // Default Mumbai

  useEffect(() => {
    setIsMounted(true);
    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCenter([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  }, []);

  if (!isMounted) return <div className="h-full w-full bg-slate-100 animate-pulse" />;

  return (
    <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://openstreetmap.org/{z}/{x}/{y}.png"
      />
      {users.map((user) => {
        if (!user.lat || !user.lng) return null;
        return (
          <Marker key={user.id} position={[user.lat, user.lng]} icon={icon}>
            <Popup>
              <div className="text-center">
                <div className="font-bold text-lg">{user.name}</div>
                <div className="text-sm text-slate-500 mb-2">{user.category_tags}</div>
                <Link href={`/profile/${user.id}`}>
                  <Button size="sm" className="w-full">View Profile</Button>
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
