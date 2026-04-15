import LoaderGif from '../assets/Loader.gif';

export default function Loader({ className = '', size = 'lg', message = '' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 p-8 ${className}`}>
      <img 
        src={LoaderGif} 
        alt="Loading"
        className={`${sizeClasses[size]} animate-bounce drop-shadow-lg`}
      />
      {message && (
        <p className="text-sm font-medium text-slate-600 tracking-wide animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
