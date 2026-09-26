import { Sparkles } from 'lucide-react';

export default function DemoModeBanner() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/90 text-amber-950 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm border border-amber-400">
      <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-900" style={{ animationDuration: '3s' }} />
      <span>Demo Mode Active</span>
    </div>
  );
}
