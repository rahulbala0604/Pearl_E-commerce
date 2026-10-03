import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false }) => {
  return (
    <div className={`flex justify-center items-center ${fullScreen ? 'min-h-[80vh]' : 'p-8'}`}>
      <Loader2 className="animate-spin text-primary-600" size={48} />
    </div>
  );
};

export default Loader;
