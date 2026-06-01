
import React from 'react';
import {
  Home,
  Compass,
  Video,
  User,
  Users,
  BookOpen,
  CheckSquare,
} from 'lucide-react';

import { NavLink } from 'react-router-dom';

export function Sidebar() {
  const navItems = [
  {
    path: '/',
    icon: <Home className="w-5 h-5" />,
    label: 'Dashboard',
  },
  {
    path: '/focus-desk',
    icon: <Compass className="w-5 h-5" />,
    label: 'Focus Desk',
  },
  {
    path: '/study-room',
    icon: <Video className="w-5 h-5" />,
    label: 'Study Rooms',
  },
  {
    path: '/friends',
    icon: <Users className="w-5 h-5" />,
    label: 'Friends',
  },
  {
    path: '/library',
    icon: <BookOpen className="w-5 h-5" />,
    label: 'E-Library',
  },
  {
    path: '/todos',
    icon: <CheckSquare className="w-5 h-5" />,
    label: 'To-Do List',
  },
  {
    path: '/profile',
    icon: <User className="w-5 h-5" />,
    label: 'Profile',
  },
];

  return (
    <aside
      className="w-64 flex flex-col h-full z-20 relative"
      style={{
        background: 'rgba(4, 4, 10, 0.82)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(192, 192, 220, 0.10)',
      }}
    >
      {/* Tiny star flecks */}
      <div
        className="absolute top-8 left-8 w-1 h-1 bg-white rounded-full opacity-50 animate-pulse"
        style={{ animationDelay: '0s' }}
      />
      <div
        className="absolute top-36 right-5 w-0.5 h-0.5 bg-white rounded-full opacity-40 animate-ping"
        style={{ animationDelay: '0.8s' }}
      />
      <div
        className="absolute top-72 left-14 w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
        style={{ animationDelay: '1.5s' }}
      />
      <div
        className="absolute bottom-40 right-8 w-0.5 h-0.5 bg-white rounded-full opacity-35 animate-ping"
        style={{ animationDelay: '2.2s' }}
      />

      {/* Brand Header */}
      <div
        className="p-6 flex flex-col gap-1"
        style={{
          borderBottom: '1px solid rgba(192, 192, 220, 0.08)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background:
                'radial-gradient(circle, #ffffff 0%, #c0c0d8 60%, #606080 100%)',
              boxShadow: '0 0 10px rgba(200,200,240,0.6)',
            }}
          />

          <h1 style={{ fontSize: '1.1rem' }}>
            Study Together
          </h1>
        </div>

        <p
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#555568',
            marginTop: '4px',
            fontWeight: 600,
          }}
        >
          Virtual Space
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 relative group ${
                    isActive
                      ? 'text-white bg-white/5 border-l-2 border-indigo-300'
                      : 'text-[#60607a] hover:text-[#c8c8e0] hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="transition-transform duration-300 group-hover:scale-110">
                      {item.icon}
                    </div>

                    <span className="text-sm tracking-wide">
                      {item.label}
                    </span>

                    {isActive && (
                      <span
                        className="absolute right-3 w-1.5 h-1.5 rounded-full"
                        style={{
                          background:
                            'radial-gradient(circle, #ffffff 0%, #a0a0c0 100%)',
                          boxShadow:
                            '0 0 7px rgba(200,200,240,0.9)',
                        }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Today's Focus */}
      <div
        className="p-4"
        style={{
          borderTop: '1px solid rgba(192,192,220,0.07)',
        }}
      >
        <div
          className="p-4 rounded-xl relative overflow-hidden"
          style={{
            background: 'rgba(10, 10, 22, 0.60)',
            border: '1px solid rgba(192,192,220,0.14)',
          }}
        >
          <p
            style={{
              fontSize: '0.7rem',
              color: '#55556a',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Today&apos;s Focus
          </p>

          <div className="flex items-baseline gap-1.5 mt-1.5">
            <p
              className="text-2xl font-bold"
              style={{ color: '#d8d8f0' }}
            >
              4h 32m
            </p>

            <span
              style={{
                fontSize: '0.7rem',
                color: '#80c090',
                fontWeight: 700,
              }}
            >
              +12%
            </span>
          </div>

          <div
            className="w-full rounded-full h-1 mt-3"
            style={{
              background: 'rgba(255,255,255,0.06)',
            }}
          >
            <div
              className="h-1 rounded-full"
              style={{
                width: '75%',
                background:
                  'linear-gradient(90deg, #a0a0c0 0%, #e0e0f8 100%)',
                boxShadow:
                  '0 0 8px rgba(200,200,240,0.4)',
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}