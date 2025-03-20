import { useState, useRef, useEffect } from "react";
import { ChatMessage as ImportedChatMessage } from "@/components/ChatMessage";
import { MenuOptions } from "@/components/MenuOptions";
import { contentData, menuStructure } from "@/lib/chatbot-data";
import { Bot, X } from "lucide-react";

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
      const { scrollHeight, clientHeight, scrollTop } = chatContainerRef.current;
      // Scroll to the bottom if content exceeds the visible height or is close to the bottom
      if (scrollHeight > clientHeight) {
        chatContainerRef.current.scrollTop = scrollHeight; // Direct assignment for full scroll
      }
    }
  };

  // Scroll to bottom when messages or chatHistory changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, chatHistory]);

  // Monitor container and content changes to scroll if content exceeds size
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const checkAndScroll = () => {
      const { scrollHeight, clientHeight } = chatContainer;
      if (scrollHeight > clientHeight) {
        chatContainer.scrollTop = scrollHeight; // Force scroll to bottom
      }
    };

    // Use MutationObserver to detect changes in content (e.g., existing message growing)
    const mutationObserver = new MutationObserver(checkAndScroll);
    mutationObserver.observe(chatContainer, {
      childList: true, // Detect new messages
      subtree: true,   // Detect changes in existing messages
      characterData: true, // Detect text changes
    });

    // Use ResizeObserver to detect container size changes
    const resizeObserver = new ResizeObserver(checkAndScroll);
    resizeObserver.observe(chatContainer);

    // Initial check
    checkAndScroll();

    // Cleanup observers on unmount
    return () => {
      mutationObserver.disconnect();
      resizeObserver.unobserve(chatContainer);
    };
  }, [isOpen]); // Re-run when chat opens/closes

  const addMessage = (content: string, isBot = true) => {
    setMessages((prev) => [...prev, { content, isBot }]);
    if (isBot) {
      setChatHistory((prev) => [...prev, { content, isBot }]);
    }
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setShowLanguageSelect(false);
    const welcome =
      lang === "en"
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
        addMessage(contentData.events_calendar[language]);
        break;
      case "8":
        addMessage(contentData.student_life[language]);
        break;
      case "9":
        setShowLanguageSelect(true);
        setLanguage(null);
        setMessages([]);
        setChatHistory([]);
        break;
      case "0": {
        const goodbye =
          language === "en"
            ? "Thank you for visiting Aditya Degree College! Have a great day! 👋"
            : "ఆదిత్య డిగ్రీ కళాశాలను సందర్శించినందుకు ధన్యవాదాలు! శుభ దినం! 👋";
        addMessage(goodbye);
        setTimeout(() => {
          setMessages([]);
          setChatHistory([]);
          setShowLanguageSelect(true);
          setLanguage(null);
          setIsOpen(false);
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
    setMessages([]);
    setChatHistory([]);
    setShowLanguageSelect(true);
    setLanguage(null);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: 'url("/IMG_3395.PNG")',
        backgroundColor: "rgba(255, 255, 255, 0.8)",
      }}
    >
      <button
        onClick={handleToggleChat}
        className="fixed left-6 bottom-6 p-4 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
        aria-label="Open chat assistant"
      >
        <Bot size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-2 sm:p-4">
          <div className="w-full max-w-5xl mx-auto h-[90vh] sm:h-[85vh] bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="px-4 sm:px-6 py-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Aditya College Assistant
                </h1>
                <p className="text-muted-foreground text-xs sm:text-sm">Your virtual guide to campus information</p>
              </div>
              <button
                onClick={handleCloseChat}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Close chat"
              >
                <X size={24} />
              </button>
            </header>

            {/* Chat Content */}
            <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
              {/* Menu Panel */}
              <div className="w-full sm:w-1/3 flex flex-col bg-gray-50 border-r border-b sm:border-b-0">
                <div className="p-4 border-b bg-white">
                  {showLanguageSelect ? (
                    <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                      <button
                        className="language-button py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
                        onClick={() => handleLanguageSelect("en")}
                      >
                        English
                      </button>
                      <button
                        className="language-button py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
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

              {/* Chat History Panel */}
              <div className="w-full sm:w-2/3 flex flex-col bg-white">
                <h2 className="font-semibold text-lg px-4 py-3 bg-gray-100 border-b">Your Conversation</h2>
                <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef}>
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
                        className="mb-4 break-words"
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}