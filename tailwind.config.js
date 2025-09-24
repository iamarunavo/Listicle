/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.{html,js}",
    "./views/**/*.{html,js}",
    "./src/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        // Eco Harmony Core Palette
        'leaf-green': '#4CAF50',
        'soft-sage': '#A8D5BA',
        'warm-sand': '#F5E9DA',
        'river-blue': '#6EC1E4',
        'pure-white': '#FFFFFF',
        // Extended palette for variations
        'leaf-green-dark': '#388E3C',
        'leaf-green-light': '#81C784',
        'soft-sage-dark': '#8BC5A3',
        'soft-sage-light': '#C8E6C9',
        'warm-sand-dark': '#E8D5C4',
        'warm-sand-light': '#FDF7F0',
        'river-blue-dark': '#5DADE2',
        'river-blue-light': '#AED6F1'
      },
      fontFamily: {
        'heading': ['Nunito', 'sans-serif'],
        'body': ['Poppins', 'sans-serif']
      },
      fontSize: {
        'h1': ['42px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['26px', { lineHeight: '1.3', fontWeight: '500' }],
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '500' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'tiny': ['12px', { lineHeight: '1.4', fontWeight: '400' }]
      },
      spacing: {
        // 12px modular system
        '1.5': '6px',   // 0.5 * 12
        '3': '12px',    // 1 * 12
        '6': '24px',    // 2 * 12
        '9': '36px',    // 3 * 12
        '12': '48px',   // 4 * 12
        '15': '60px',   // 5 * 12
        '18': '72px',   // 6 * 12
        '21': '84px',   // 7 * 12
        '24': '96px',   // 8 * 12
        '30': '120px',  // 10 * 12
        '36': '144px',  // 12 * 12
        '48': '192px',  // 16 * 12
        '60': '240px',  // 20 * 12
      },
      borderRadius: {
        'organic': '16px',
        'leaf': '20px',
        'gentle': '12px',
        'soft': '8px'
      },
      boxShadow: {
        'gentle': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'hover': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'active': '0 2px 8px rgba(0, 0, 0, 0.16)',
        'leaf': '0 4px 20px rgba(76, 175, 80, 0.15)',
        'sage': '0 4px 20px rgba(168, 213, 186, 0.2)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-in-up': 'fadeInUp 0.3s ease-in-out',
        'gentle-bounce': 'gentleBounce 0.2s ease-in-out',
        'card-hover': 'cardHover 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'shimmer': 'shimmer 2s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        gentleBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' }
        },
        cardHover: {
          '0%': { transform: 'translateY(0) scale(1)', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)' },
          '100%': { transform: 'translateY(-4px) scale(1.02)', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      backgroundImage: {
        'gradient-organic': 'linear-gradient(135deg, #4CAF50 0%, #A8D5BA 100%)',
        'gradient-sage': 'linear-gradient(135deg, #A8D5BA 0%, #F5E9DA 100%)',
        'gradient-river': 'linear-gradient(135deg, #6EC1E4 0%, #A8D5BA 100%)',
        'gradient-warm': 'linear-gradient(135deg, #F5E9DA 0%, #FFFFFF 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
      },
      transitionTimingFunction: {
        'eco': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'gentle': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'organic': 'cubic-bezier(0.2, 0, 0.38, 0.9)'
      },
      transitionDuration: {
        '200': '200ms',
        '250': '250ms',
        '300': '300ms'
      }
    }
  },
  plugins: [
    function({ addUtilities, addComponents }) {
      addUtilities({
        '.text-gradient-organic': {
          'background': 'linear-gradient(135deg, #4CAF50 0%, #A8D5BA 100%)',
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          '-webkit-text-fill-color': 'transparent'
        },
        '.backdrop-organic': {
          'backdrop-filter': 'blur(12px) saturate(1.2)',
          'background': 'rgba(255, 255, 255, 0.8)'
        }
      });

      addComponents({
        '.card-organic': {
          '@apply bg-white rounded-leaf shadow-gentle border border-soft-sage/20 overflow-hidden transition-all duration-250 ease-eco hover:shadow-hover hover:-translate-y-1 hover:scale-[1.02]': {}
        },
        '.badge-leaf': {
          '@apply inline-flex items-center px-3 py-1.5 rounded-full text-tiny font-medium bg-gradient-organic text-white shadow-leaf': {}
        },
        '.btn-eco': {
          '@apply inline-flex items-center justify-center px-6 py-3 rounded-organic font-medium text-body transition-all duration-200 ease-eco focus:outline-none focus:ring-2 focus:ring-offset-2': {}
        },
        '.btn-primary': {
          '@apply btn-eco bg-gradient-organic text-white hover:shadow-hover focus:ring-leaf-green': {}
        },
        '.btn-secondary': {
          '@apply btn-eco bg-soft-sage text-leaf-green-dark hover:bg-soft-sage-dark focus:ring-soft-sage': {}
        },
        '.input-eco': {
          '@apply w-full px-4 py-3 rounded-gentle border border-soft-sage/30 bg-white/80 backdrop-blur-sm text-body placeholder-soft-sage focus:border-leaf-green focus:ring-2 focus:ring-leaf-green/20 focus:outline-none transition-all duration-200 ease-eco': {}
        }
      });
    }
  ]
}