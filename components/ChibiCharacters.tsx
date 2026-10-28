"use client";
import { motion } from "framer-motion";

// Chibi character SVG components - pastel watercolor style matching site aesthetic

export function XieLian({ className = "w-32 h-48" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 180" fill="none" className={className}>
      {/* Hair */}
      <path d="M40 30 Q30 10 50 5 Q70 10 80 30 Q85 50 80 70 L75 90 Q70 80 65 75 L55 75 Q50 80 45 90 L40 70 Q35 50 40 30Z" fill="#3D2B1F" opacity="0.9" />
      {/* Face */}
      <ellipse cx="60" cy="55" rx="18" ry="20" fill="#FAF7F2" />
      {/* Eyes */}
      <ellipse cx="52" cy="52" rx="3" ry="4" fill="#3D2B1F" />
      <ellipse cx="68" cy="52" rx="3" ry="4" fill="#3D2B1F" />
      <circle cx="53" cy="50" r="1" fill="#FAF7F2" />
      <circle cx="69" cy="50" r="1" fill="#FAF7F2" />
      {/* Mouth */}
      <path d="M56 62 Q60 66 64 62" stroke="#3D2B1F" strokeWidth="1" fill="none" />
      {/* Crown/nimbus */}
      <circle cx="60" cy="20" r="8" fill="#B89B5E" opacity="0.6" />
      <circle cx="60" cy="20" r="5" fill="#B89B5E" opacity="0.8" />
      {/* Hanfu body */}
      <path d="M42 75 Q35 90 38 120 Q40 150 45 170 L75 170 Q80 150 82 120 Q85 90 78 75 Z" fill="#FAF7F2" />
      <path d="M42 75 Q50 85 60 80 Q70 85 78 75" fill="#E8E0D5" />
      {/* Sleeves */}
      <path d="M42 75 Q30 90 25 110 Q28 105 35 95 L42 80Z" fill="#FAF7F2" />
      <path d="M78 75 Q90 90 95 110 Q92 105 85 95 L78 80Z" fill="#FAF7F2" />
      {/* Red accent (sash) */}
      <path d="M45 100 Q60 105 75 100 L75 105 Q60 110 45 105Z" fill="#E8B4B8" opacity="0.6" />
      {/* Legs */}
      <rect x="48" y="165" width="8" height="15" rx="4" fill="#FAF7F2" />
      <rect x="64" y="165" width="8" height="15" rx="4" fill="#FAF7F2" />
    </svg>
  );
}

export function HuaCheng({ className = "w-32 h-48" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 180" fill="none" className={className}>
      {/* Hair */}
      <path d="M35 35 Q25 15 45 8 Q65 5 80 15 Q90 30 88 55 L85 80 Q80 70 75 65 L65 65 Q60 70 55 80 L50 65 Q45 70 40 80 L35 55 Q30 35 35 35Z" fill="#3D2B1F" opacity="0.95" />
      {/* Eyepatch */}
      <rect x="48" y="48" width="24" height="12" rx="6" fill="#3D2B1F" />
      <path d="M48 54 Q60 58 72 54" stroke="#C41E3A" strokeWidth="1.5" fill="none" />
      {/* Visible eye */}
      <ellipse cx="72" cy="52" rx="3" ry="4" fill="#C41E3A" />
      <circle cx="73" cy="50" r="1" fill="#FAF7F2" />
      {/* Mouth */}
      <path d="M56 62 Q60 65 64 62" stroke="#3D2B1F" strokeWidth="1" fill="none" />
      {/* Red mark on forehead */}
      <circle cx="60" cy="38" r="3" fill="#C41E3A" opacity="0.7" />
      {/* Hanfu body - red */}
      <path d="M42 75 Q35 90 38 120 Q40 150 45 170 L75 170 Q80 150 82 120 Q85 90 78 75 Z" fill="#C41E3A" opacity="0.85" />
      <path d="M42 75 Q50 85 60 80 Q70 85 78 75" fill="#A01830" opacity="0.6" />
      {/* Sleeves */}
      <path d="M42 75 Q30 90 25 110 Q28 105 35 95 L42 80Z" fill="#C41E3A" opacity="0.85" />
      <path d="M78 75 Q90 90 95 110 Q92 105 85 95 L78 80Z" fill="#C41E3A" opacity="0.85" />
      {/* Gold accents */}
      <path d="M45 100 Q60 105 75 100 L75 105 Q60 110 45 105Z" fill="#B89B5E" opacity="0.6" />
      {/* Legs */}
      <rect x="48" y="165" width="8" height="15" rx="4" fill="#C41E3A" opacity="0.85" />
      <rect x="64" y="165" width="8" height="15" rx="4" fill="#C41E3A" opacity="0.85" />
    </svg>
  );
}

export function WeiWuxian({ className = "w-32 h-48" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 180" fill="none" className={className}>
      {/* Hair */}
      <path d="M38 30 Q28 8 50 3 Q72 8 82 30 Q88 50 85 75 L80 95 Q75 80 70 72 L60 72 Q55 80 50 95 L45 75 Q40 80 35 95 L38 75 Q32 50 38 30Z" fill="#3D2B1F" opacity="0.9" />
      {/* Red ribbon */}
      <path d="M55 8 Q60 0 65 8" stroke="#C41E3A" strokeWidth="2" fill="none" />
      <path d="M60 3 Q62 0 64 3" stroke="#C41E3A" strokeWidth="1.5" fill="none" />
      {/* Face */}
      <ellipse cx="60" cy="55" rx="18" ry="20" fill="#FAF7F2" />
      {/* Eyes - playful */}
      <ellipse cx="52" cy="52" rx="3" ry="4" fill="#3D2B1F" />
      <ellipse cx="68" cy="52" rx="3" ry="4" fill="#3D2B1F" />
      <circle cx="53" cy="50" r="1" fill="#FAF7F2" />
      <circle cx="69" cy="50" r="1" fill="#FAF7F2" />
      {/* Smile */}
      <path d="M54 62 Q60 68 66 62" stroke="#3D2B1F" strokeWidth="1.2" fill="none" />
      {/* Robes - black/red */}
      <path d="M42 75 Q35 90 38 120 Q40 150 45 170 L75 170 Q80 150 82 120 Q85 90 78 75 Z" fill="#3D2B1F" opacity="0.9" />
      <path d="M42 75 Q50 85 60 80 Q70 85 78 75" fill="#C41E3A" opacity="0.4" />
      {/* Sleeves */}
      <path d="M42 75 Q30 90 25 110 Q28 105 35 95 L42 80Z" fill="#3D2B1F" opacity="0.9" />
      <path d="M78 75 Q90 90 95 110 Q92 105 85 95 L78 80Z" fill="#3D2B1F" opacity="0.9" />
      {/* Red ribbon belt */}
      <path d="M45 100 Q60 105 75 100 L75 108 Q60 113 45 108Z" fill="#C41E3A" opacity="0.7" />
      {/* Flute (Chenqing) */}
      <line x1="88" y1="90" x2="95" y2="120" stroke="#3D2B1F" strokeWidth="2" strokeLinecap="round" />
      <circle cx="90" cy="95" r="1.5" fill="#C41E3A" />
      <circle cx="92" cy="105" r="1.5" fill="#C41E3A" />
      {/* Legs */}
      <rect x="48" y="165" width="8" height="15" rx="4" fill="#3D2B1F" opacity="0.9" />
      <rect x="64" y="165" width="8" height="15" rx="4" fill="#3D2B1F" opacity="0.9" />
    </svg>
  );
}

export function LanWangji({ className = "w-32 h-48" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 180" fill="none" className={className}>
      {/* Hair */}
      <path d="M40 25 Q30 5 50 0 Q70 5 80 25 Q85 45 82 70 L78 90 Q73 78 68 72 L52 72 Q47 78 42 90 L40 70 Q35 45 40 25Z" fill="#3D2B1F" opacity="0.9" />
      {/* Forehead ribbon */}
      <rect x="42" y="38" width="36" height="4" rx="2" fill="#2E5C8A" opacity="0.8" />
      <path d="M78 40 Q85 38 90 42" stroke="#2E5C8A" strokeWidth="1.5" fill="none" />
      {/* Face */}
      <ellipse cx="60" cy="55" rx="18" ry="20" fill="#FAF7F2" />
      {/* Eyes - calm, half-lidded */}
      <ellipse cx="52" cy="53" rx="3" ry="2.5" fill="#3D2B1F" />
      <ellipse cx="68" cy="53" rx="3" ry="2.5" fill="#3D2B1F" />
      <circle cx="53" cy="52" r="0.8" fill="#FAF7F2" />
      <circle cx="69" cy="52" r="0.8" fill="#FAF7F2" />
      {/* Mouth - neutral */}
      <line x1="57" y1="63" x2="63" y2="63" stroke="#3D2B1F" strokeWidth="1" strokeLinecap="round" />
      {/* Robes - white */}
      <path d="M42 75 Q35 90 38 120 Q40 150 45 170 L75 170 Q80 150 82 120 Q85 90 78 75 Z" fill="#FAF7F2" />
      <path d="M42 75 Q50 85 60 80 Q70 85 78 75" fill="#E8E0D5" />
      {/* Sleeves */}
      <path d="M42 75 Q30 90 25 110 Q28 105 35 95 L42 80Z" fill="#FAF7F2" />
      <path d="M78 75 Q90 90 95 110 Q92 105 85 95 L78 80Z" fill="#FAF7F2" />
      {/* Blue accent */}
      <path d="M45 100 Q60 105 75 100 L75 105 Q60 110 45 105Z" fill="#2E5C8A" opacity="0.4" />
      {/* Guqin */}
      <rect x="8" y="110" width="30" height="8" rx="2" fill="#6B5B4F" transform="rotate(-15, 23, 114)" />
      <line x1="12" y1="112" x2="34" y2="106" stroke="#B89B5E" strokeWidth="0.5" />
      <line x1="12" y1="114" x2="34" y2="108" stroke="#B89B5E" strokeWidth="0.5" />
      {/* Legs */}
      <rect x="48" y="165" width="8" height="15" rx="4" fill="#FAF7F2" />
      <rect x="64" y="165" width="8" height="15" rx="4" fill="#FAF7F2" />
    </svg>
  );
}

export function ShenQingqiu({ className = "w-32 h-48" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 180" fill="none" className={className}>
      {/* Hair */}
      <path d="M38 28 Q28 8 48 2 Q68 8 80 28 Q85 48 82 72 L78 92 Q73 78 68 70 L60 70 Q55 78 50 92 L45 72 Q40 78 35 92 L38 72 Q32 48 38 28Z" fill="#3D2B1F" opacity="0.9" />
      {/* Face */}
      <ellipse cx="60" cy="55" rx="18" ry="20" fill="#FAF7F2" />
      {/* Eyes - elegant, slightly closed */}
      <ellipse cx="52" cy="52" rx="3" ry="3" fill="#3D2B1F" />
      <ellipse cx="68" cy="52" rx="3" ry="3" fill="#3D2B1F" />
      <circle cx="53" cy="51" r="0.8" fill="#FAF7F2" />
      <circle cx="69" cy="51" r="0.8" fill="#FAF7F2" />
      {/* Lips */}
      <path d="M56 63 Q60 65 64 63" stroke="#C41E3A" strokeWidth="1" fill="none" />
      {/* Robes - green */}
      <path d="M42 75 Q35 90 38 120 Q40 150 45 170 L75 170 Q80 150 82 120 Q85 90 78 75 Z" fill="#6B8A5E" opacity="0.85" />
      <path d="M42 75 Q50 85 60 80 Q70 85 78 75" fill="#5A7A4E" opacity="0.6" />
      {/* Sleeves */}
      <path d="M42 75 Q30 90 25 110 Q28 105 35 95 L42 80Z" fill="#6B8A5E" opacity="0.85" />
      <path d="M78 75 Q90 90 95 110 Q92 105 85 95 L78 80Z" fill="#6B8A5E" opacity="0.85" />
      {/* Gold trim */}
      <path d="M45 100 Q60 105 75 100 L75 105 Q60 110 45 105Z" fill="#B89B5E" opacity="0.6" />
      {/* Fan */}
      <path d="M8 90 Q15 70 25 65 Q30 75 20 95 Q12 92 8 90Z" fill="#FAF7F2" stroke="#B89B5E" strokeWidth="1" />
      <line x1="15" y1="72" x2="18" y2="90" stroke="#B89B5E" strokeWidth="0.5" />
      <line x1="20" y1="68" x2="20" y2="88" stroke="#B89B5E" strokeWidth="0.5" />
      <line x1="25" y1="66" x2="22" y2="86" stroke="#B89B5E" strokeWidth="0.5" />
      {/* Legs */}
      <rect x="48" y="165" width="8" height="15" rx="4" fill="#6B8A5E" opacity="0.85" />
      <rect x="64" y="165" width="8" height="15" rx="4" fill="#6B8A5E" opacity="0.85" />
    </svg>
  );
}

export function LuoBinghe({ className = "w-32 h-48" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 180" fill="none" className={className}>
      {/* Hair */}
      <path d="M35 30 Q25 8 48 2 Q72 8 85 30 Q90 50 88 75 L85 95 Q80 80 75 72 L60 72 Q55 80 50 95 L45 75 Q40 80 35 95 L35 75 Q30 50 35 30Z" fill="#3D2B1F" opacity="0.95" />
      {/* Red mark on forehead */}
      <path d="M55 35 Q60 30 65 35 Q60 40 55 35Z" fill="#C41E3A" opacity="0.9" />
      {/* Face */}
      <ellipse cx="60" cy="55" rx="18" ry="20" fill="#FAF7F2" />
      {/* Eyes */}
      <ellipse cx="52" cy="52" rx="3" ry="4" fill="#3D2B1F" />
      <ellipse cx="68" cy="52" rx="3" ry="4" fill="#3D2B1F" />
      <circle cx="53" cy="50" r="1" fill="#FAF7F2" />
      <circle cx="69" cy="50" r="1" fill="#FAF7F2" />
      {/* Mouth */}
      <path d="M56 62 Q60 66 64 62" stroke="#3D2B1F" strokeWidth="1" fill="none" />
      {/* Robes - black with red */}
      <path d="M42 75 Q35 90 38 120 Q40 150 45 170 L75 170 Q80 150 82 120 Q85 90 78 75 Z" fill="#3D2B1F" opacity="0.95" />
      <path d="M42 75 Q50 85 60 80 Q70 85 78 75" fill="#C41E3A" opacity="0.3" />
      {/* Sleeves */}
      <path d="M42 75 Q30 90 25 110 Q28 105 35 95 L42 80Z" fill="#3D2B1F" opacity="0.95" />
      <path d="M78 75 Q90 90 95 110 Q92 105 85 95 L78 80Z" fill="#3D2B1F" opacity="0.95" />
      {/* Red accent */}
      <path d="M45 100 Q60 105 75 100 L75 105 Q60 110 45 105Z" fill="#C41E3A" opacity="0.6" />
      {/* Sword */}
      <line x1="90" y1="80" x2="95" y2="130" stroke="#B89B5E" strokeWidth="2" strokeLinecap="round" />
      <path d="M88 78 L92 75 L96 78 L92 82Z" fill="#B89B5E" />
      {/* Legs */}
      <rect x="48" y="165" width="8" height="15" rx="4" fill="#3D2B1F" opacity="0.95" />
      <rect x="64" y="165" width="8" height="15" rx="4" fill="#3D2B1F" opacity="0.95" />
    </svg>
  );
}

// Hero composition: Xie Lian + Hua Cheng
export function HeroCharacters() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative">
        {/* Background: mountains, lake, pagoda, cherry blossoms */}
        <svg className="w-full h-full" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Sky gradient */}
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F5F0E8" />
              <stop offset="100%" stopColor="#E8E0D5" />
            </linearGradient>
          </defs>
          <rect width="500" height="400" fill="url(#skyGrad)" />
          {/* Sun/Moon */}
          <circle cx="400" cy="60" r="45" fill="#E8B4B8" opacity="0.4" />
          <circle cx="400" cy="60" r="30" fill="#E8B4B8" opacity="0.6" />
          {/* Mountains */}
          <path d="M0 280 L60 180 L120 240 L200 140 L280 200 L360 120 L440 180 L500 150 L500 400 L0 400 Z" fill="#7A9A6E" opacity="0.25" />
          <path d="M0 300 L80 200 L160 260 L240 160 L320 220 L400 140 L480 200 L500 170 L500 400 L0 400 Z" fill="#6B8A5E" opacity="0.35" />
          {/* Lake */}
          <ellipse cx="250" cy="340" rx="220" ry="40" fill="#D4A5A5" opacity="0.3" />
          {/* Pagoda */}
          <rect x="210" y="200" width="25" height="70" fill="#3D2B1F" opacity="0.5" />
          <path d="M200 200 L222.5 175 L245 200 Z" fill="#3D2B1F" opacity="0.5" />
          <path d="M205 175 L222.5 155 L240 175 Z" fill="#3D2B1F" opacity="0.4" />
          <path d="M210 155 L222.5 140 L235 155 Z" fill="#3D2B1F" opacity="0.3" />
          {/* Cherry blossoms - left */}
          <circle cx="80" cy="100" r="30" fill="#E8B4B8" opacity="0.35" />
          <circle cx="100" cy="80" r="25" fill="#E8B4B8" opacity="0.25" />
          <circle cx="60" cy="120" r="20" fill="#E8B4B8" opacity="0.3" />
          {/* Cherry blossoms - right */}
          <circle cx="420" cy="90" r="28" fill="#E8B4B8" opacity="0.3" />
          <circle cx="400" cy="70" r="22" fill="#E8B4B8" opacity="0.25" />
          {/* Falling petals */}
          <circle cx="150" cy="150" r="3" fill="#E8B4B8" opacity="0.6" />
          <circle cx="200" cy="180" r="2.5" fill="#E8B4B8" opacity="0.5" />
          <circle cx="300" cy="160" r="3" fill="#E8B4B8" opacity="0.6" />
          <circle cx="350" cy="200" r="2" fill="#E8B4B8" opacity="0.4" />
          <circle cx="120" cy="200" r="2.5" fill="#E8B4B8" opacity="0.5" />
          <circle cx="420" cy="170" r="3" fill="#E8B4B8" opacity="0.6" />
        </svg>

        {/* Characters - positioned over the illustration */}
        <div className="absolute bottom-0 left-1/4 transform -translate-x-1/2">
          <XieLian className="w-28 h-42" />
        </div>
        <div className="absolute bottom-0 right-1/4 transform translate-x-1/2">
          <HuaCheng className="w-28 h-42" />
        </div>
      </div>
    </div>
  );
}