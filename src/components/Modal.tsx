import { ReactNode, useEffect } from 'react'

type Props = {
  open: boolean
  title?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function Modal({ open, title, onClose, children, footer, size = 'md' }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { 
      if (e.key === 'Escape') onClose() 
    }
    if (open) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = 'auto'
    }
  }, [open, onClose])

  if (!open) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className={`relative z-10 w-full ${sizeClasses[size]} animate-slide-up`}>
        <div className="card shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {title || 'Modal'}
            </h4>
            <button 
              onClick={onClose} 
              className="h-10 w-10 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
              aria-label="Close modal"
              title="Close"
            >
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
            {children}
          </div>
          
          {/* Footer */}
          {footer && (
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

