export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#041d3c] flex flex-col items-center justify-center overflow-hidden">
      
      {/* Ambient background glows for depth */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(26,132,255,0.08)_0%,_transparent_70%)] rounded-full animate-pulse [animation-duration:4s]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(212,175,55,0.05)_0%,_transparent_70%)] rounded-full animate-pulse [animation-duration:5s]" />
      
      <div className="relative flex flex-col items-center z-10">
        
        {/* Logo Container with floating and glowing animation */}
        <div className="relative w-32 h-32 mb-10 flex items-center justify-center">
          {/* Subtle spinning dashed rings */}
          <div className="absolute inset-0 rounded-full border border-dashed border-[#1a84ff]/20 animate-spin [animation-duration:12s]" />
          <div className="absolute inset-[-15px] rounded-full border border-[#D4AF37]/15 animate-spin [animation-duration:15s] [animation-direction:reverse]" />
          
          <div className="absolute inset-0 bg-[#1a84ff]/10 rounded-full blur-[20px]" />
          
          {/* Bird Logo - gently floating */}
          <div className="w-16 h-16 relative z-10" style={{ animation: 'float 3s ease-in-out infinite' }}>
             <img 
               src="/images/simplifly-bird-logo.svg" 
               alt="Simplifly" 
               className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] opacity-90"
             />
          </div>
        </div>

        {/* Minimalist Text */}
        <div className="flex flex-col items-center gap-5">
          <h2 className="text-white/90 text-[13px] font-black tracking-[0.3em] uppercase" style={{ animation: 'pulseOpacity 3s ease-in-out infinite' }}>
            Simplifly Finland
          </h2>
          
          {/* Sleek Luxury Loading Bar */}
          <div className="w-40 h-[2px] bg-white/10 relative overflow-hidden rounded-full">
            <div 
              className="absolute top-0 left-0 h-full w-[30%] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-full"
              style={{ animation: 'slideRight 2s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}
            />
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes slideRight {
          0% { transform: translateX(-150%); }
          50% { transform: translateX(300%); }
          100% { transform: translateX(-150%); }
        }
        @keyframes pulseOpacity {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}} />
    </div>
  );
}
