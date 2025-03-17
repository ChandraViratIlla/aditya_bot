// Index.tsx
import { useState, useRef, useEffect } from "react";
import { ChatMessage as ImportedChatMessage } from "@/components/ChatMessage";
import { MenuOptions } from "@/components/MenuOptions";
import { contentData, menuStructure } from "@/lib/chatbot-data";
import { Bot } from "lucide-react";

type Language = "en" | "te";

export default function Index() {
  const [messages, setMessages] = useState<Array<{ content: string; isBot: boolean }>>([]);
  const [language, setLanguage] = useState<Language | null>(null);
  const [showLanguageSelect, setShowLanguageSelect] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ content: string; isBot: boolean }>>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Scroll to bottom whenever chatHistory updates
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 0); // Delay to ensure DOM is updated
    return () => clearTimeout(timer); // Cleanup
  }, [chatHistory]);

  const addMessage = (content: string, isBot = true) => {
    setMessages(prev => [...prev, { content, isBot }]);
    if (isBot) {
      setChatHistory(prev => [...prev, { content, isBot }]);
    }
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setShowLanguageSelect(false);
    const welcome = lang === "en"
      ? "Welcome to Aditya Degree College!\nI'm your virtual assistant. How can I help you today?"
      : "ఆదిత్య డిగ్రీ కళాశాలకు స్వాగతం!\nనేను మీ వర్చువల్ అసిస్టెంట్. నేను మీకు ఎలా సహాయపడగలను?";
    addMessage(welcome);
  };

  const handleMenuSelect = (key: string) => {
    if (!language) return;

    const selection = menuStructure.main[language][key];
    addMessage(selection, false);

    switch (key) {
      case "1":
        addMessage(contentData.admission_info[language]);
        break;
      case "2":
        addMessage(contentData.courses_departments[language]);
        break;
      case "3":
        addMessage(contentData.facilities[language]);
        break;
      case "4":
        addMessage(contentData.fees_and_scholarships[language]);
        break;
      case "5":
        addMessage(contentData.placements[language]);
        break;
      case "6":
        addMessage(contentData.contact_info[language]);
        break;
      case "7":
        setShowLanguageSelect(true);
        setLanguage(null);
        setMessages([]);
        setChatHistory([]);
        break;
      case "8": {
        const goodbye = language === "en"
          ? "Thank you for visiting Aditya Degree College! Have a great day! 👋"
          : "ఆదిత్య డిగ్రీ కళాశాలను సందర్శించినందుకు ధన్యవాదాలు! శుభ దినం! 👋";
        addMessage(goodbye);
        setTimeout(() => {
          setMessages([]);
          setChatHistory([]);
          setShowLanguageSelect(true);
          setLanguage(null);
        }, 3000);
        break;
      }
    }
  };

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setShowLanguageSelect(true);
      setLanguage(null);
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
         style={{ 
           backgroundImage: 'url("/IMG_3395.PNG")',
           backgroundColor: '',
           backgroundBlendMode: 'overlay'
         }}>
      
      <button
        onClick={handleToggleChat}
        className="fixed left-6 bottom-6 p-4 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
      >
        <Bot size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300 flex items-center justify-center">
          <div 
            className="w-full max-w-4xl mx-auto h-[80vh] bg-background/95 backdrop-blur-sm rounded-2xl shadow-2xl border z-50 flex flex-col transition-all duration-300 relative"
          >
            <div className="p-4 md:p-6 flex-1 flex flex-col min-h-0">
              <header className="text-center mb-4 shrink-0">
                <h1 className="text-2xl md:text-3xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Aditya College Assistant
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">Your virtual guide to campus information</p>
              </header>

              <div className="flex-1 flex flex-row gap-4 bg-white/70 rounded-xl shadow-lg p-4 md:p-6 backdrop-blur-sm border overflow-hidden">
                <div className="w-1/3 flex flex-col min-h-0">
                  <div className="flex-1 overflow-y-auto">
                    {messages.map((msg, idx) => (
                      <ImportedChatMessage
                        key={idx}
                        content={msg.content}
                        isBot={msg.isBot}
                      />
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t shrink-0">
                    {showLanguageSelect ? (
                      <div className="grid grid-cols-1 gap-4">
                        <button
                          className="language-button py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          onClick={() => handleLanguageSelect("en")}
                        >
                          English
                        </button>
                        <button
                          className="language-button py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          onClick={() => handleLanguageSelect("te")}
                        >
                          తెలుగు
                        </button>
                      </div>
                    ) : language ? (
                      <MenuOptions
                        options={menuStructure.main[language]}
                        onSelect={handleMenuSelect}
                        className="grid grid-cols-1 gap-2"
                      />
                    ) : null}
                  </div>
                </div>

                <div 
                  className="w-2/3 flex flex-col min-h-0 bg-gray-50 rounded-lg p-4"
                >
                  <div 
                    className="flex-1 overflow-y-auto"
                    ref={chatContainerRef}
                  >
                    {chatHistory.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Select an option to see responses
                      </div>
                    ) : (
                      chatHistory.map((msg, idx) => (
                        <ImportedChatMessage
                          key={idx}
                          content={msg.content}
                          isBot={msg.isBot}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleCloseChat}
              className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}