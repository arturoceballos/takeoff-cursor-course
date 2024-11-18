import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function CursorChatPage() {
  return (
    <div className="flex flex-col h-screen bg-[#1E1F1F] text-white">
      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-3xl mb-8">What can I help with?</h1>
        
        {/* Chat input */}
        <div className="w-full max-w-2xl px-4">
          <div className="relative bg-[#2C2C2C] rounded-lg p-4">
            <input 
              type="text"
              placeholder="Message ChatGPT"
              className="w-full bg-transparent outline-none"
            />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <button className="p-1">📎</button>
              <button className="p-1">🌐</button>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mt-6 px-4 justify-center">
          <button className="px-4 py-2 bg-[#2C2C2C] rounded-full hover:bg-[#3C3C3C] flex items-center gap-2">
            <span>🎨</span> Create image
          </button>
          <button className="px-4 py-2 bg-[#2C2C2C] rounded-full hover:bg-[#3C3C3C] flex items-center gap-2">
            <span>✍️</span> Help me write
          </button>
          <button className="px-4 py-2 bg-[#2C2C2C] rounded-full hover:bg-[#3C3C3C] flex items-center gap-2">
            <span>📊</span> Analyze data
          </button>
          <button className="px-4 py-2 bg-[#2C2C2C] rounded-full hover:bg-[#3C3C3C] flex items-center gap-2">
            <span>🎁</span> Surprise me
          </button>
          <button className="px-4 py-2 bg-[#2C2C2C] rounded-full hover:bg-[#3C3C3C] flex items-center gap-2">
            <span>💻</span> Code
          </button>
          <Popover>
            <PopoverTrigger asChild>
              <button className="px-4 py-2 bg-[#2C2C2C] rounded-full hover:bg-[#3C3C3C]">
                More
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 bg-[#2C2C2C] border-[#3C3C3C] text-white">
              <div className="flex flex-col gap-2 p-2">
                <button className="px-3 py-2 hover:bg-[#3C3C3C] rounded-md text-left">
                  Share chat
                </button>
                <button className="px-3 py-2 hover:bg-[#3C3C3C] rounded-md text-left">
                  Copy link
                </button>
                <button className="px-3 py-2 hover:bg-[#3C3C3C] rounded-md text-left">
                  Settings
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Download prompt */}
      <div className="p-4 bg-[#2C2C2C] mx-4 mb-4 rounded-lg flex justify-between items-center">
        <div>
          <h3 className="font-medium">Download the latest iOS or Android app to try advanced voice mode</h3>
          <p className="text-gray-400 text-sm">Get more natural, real-time conversations with advanced voice. Senses and responds to humor, sarcasm, interruptions, and more.</p>
        </div>
        <div className="ml-4">
          {/* QR code placeholder */}
          <div className="w-20 h-20 bg-white rounded"></div>
        </div>
      </div>
    </div>
  );
}
