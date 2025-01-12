"use client"
import React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Motion } from 'lucide-react';
import Link from 'next/link';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { SparklesCore } from '@/components/ui/sparkles';

const HomePage = () => {

  const [particleSettings, setParticleSettings] = useState({
    minSize: 1,
    maxSize: 1.5,
    particleDensity: 50
  });
  const sections = [
    {
      title: 'Quotes',
      timestamp: '01/12/2023 21:00',
      author: 'Liv',
      message: 'Hoe kan ik in mezelf busten',
      href: '/quotes',
      colors: [[39, 42, 242],[134, 39, 242]]
    },
    {
      title: 'Rizz',
      timestamp: '17/06/2024 12:02',
      author: 'Rose',
      message: 'Hey girl ik heb een lodge, Wil je met me intrekken??',
      href: '/rizz',
      colors: [[255, 0, 221],[174, 0, 255]]
    },
    {
      title: 'Insults',
      timestamp: '21/09/2024 22:13',
      author: 'Daan',
      message: 'je kan de tinteltyfus krijgen',
      href: '/insults',
      colors: [[237, 19, 19],[237, 19, 103]]
    }
  ];

  return (
    <div>
      <SparklesCore
        {...particleSettings}
        background="transparent"
        className="w-full h-full absolute"
        particleColor='#FFFFFF'
      />/
      <div className="min-h-scree p-8">
        <div className="max-w-screen-xl mx-auto flex items-center">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {sections.map((section) => (
              <CardSpotlight className='' colors={section.colors}>
                <div className='relative select-none'>
                  <Link href={section.href}>
                    <div className="flex items-center justify-between mb-4 ">
                      <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                      {section.icon}
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm">
                        {section.author} - {section.timestamp}
                      </p>
                      <p className="text-gray-300">{section.message}</p>
                    </div>
                  </Link>
                </div>
              </CardSpotlight>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;