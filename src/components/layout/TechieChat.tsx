import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send } from "lucide-react";
import { submitContact } from "@/lib/contact.functions";
import site from "@/data/site.json";
import coursesData from "@/data/courses.json";

type ChatMessage = {
  id: string;
  sender: "techie" | "user";
  text: string;
  isTyping?: boolean;
};

type Step = 
  | "name"
  | "phone"
  | "email"
  | "city"
  | "qualification"
  | "course"
  | "message"
  | "confirm"
  | "submitting"
  | "success"
  | "error";

export function TechieChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>("name");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasAutoOpened = useRef(false);

  // Auto-open logic
  useEffect(() => {
    if (hasAutoOpened.current) return;
    
    const techieOpened = sessionStorage.getItem("techieAutoOpened");
    if (techieOpened) {
      hasAutoOpened.current = true;
      return;
    }

    const startTimer = () => {
      const timer = setTimeout(() => {
        if (!hasAutoOpened.current) {
          setIsOpen(true);
          hasAutoOpened.current = true;
          sessionStorage.setItem("techieAutoOpened", "true");
        }
      }, 5000);
      return timer;
    };

    // If Landing page flagged that it's handling the sequence
    if (sessionStorage.getItem("techieWaitingForEnroll")) {
      let timer: NodeJS.Timeout;
      const handleTimer = () => {
        timer = startTimer();
      };
      window.addEventListener("start_techie_timer", handleTimer);
      return () => {
        window.removeEventListener("start_techie_timer", handleTimer);
        clearTimeout(timer);
      };
    } else {
      // Not on landing page or landing page already ran
      const timer = startTimer();
      return () => clearTimeout(timer);
    }
  }, []);

  // Mark as opened if user manually opens it before timer fires
  useEffect(() => {
    if (isOpen) {
      hasAutoOpened.current = true;
    }
  }, [isOpen]);

  // Initialize chat when opened for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addTechieMessage("Hey! I'm Techie 👋\nWelcome to Techogies. Let me know a few details and our team will get back to you.");
      setTimeout(() => {
        addTechieMessage("What should we call you?");
      }, 1000);
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const addTechieMessage = (text: string, delay: number = 0) => {
    if (delay > 0) {
      const id = Date.now().toString();
      setMessages((prev) => [...prev, { id, sender: "techie", text: "", isTyping: true }]);
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, text, isTyping: false } : m))
        );
      }, delay);
    } else {
      setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "techie", text }]);
    }
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text }]);
  };

  const validatePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleNextStep = async (value: string) => {
    if (currentStep === "name") {
      if (value.trim().length < 2) return;
      setFormData((prev) => ({ ...prev, name: value }));
      setCurrentStep("phone");
      addTechieMessage(`Nice to meet you, ${value}! What's your phone number?`, 600);
    } else if (currentStep === "phone") {
      if (!validatePhone(value)) {
        addTechieMessage("That phone number doesn't look quite right. Could you check it again?", 600);
        return;
      }
      setFormData((prev) => ({ ...prev, phone: value }));
      setCurrentStep("email");
      addTechieMessage("Got it. What's your email address?", 600);
    } else if (currentStep === "email") {
      if (!validateEmail(value)) {
        addTechieMessage("Hmm, that email doesn't seem valid. Could you try again?", 600);
        return;
      }
      setFormData((prev) => ({ ...prev, email: value }));
      setCurrentStep("city");
      addTechieMessage("Great! Where are you currently based (City)?", 600);
    } else if (currentStep === "city") {
      if (value.trim().length < 2) return;
      setFormData((prev) => ({ ...prev, city: value }));
      setCurrentStep("qualification");
      addTechieMessage("What is your highest qualification?", 600);
    } else if (currentStep === "qualification") {
      setFormData((prev) => ({ ...prev, qualification: value }));
      setCurrentStep("course");
      addTechieMessage("Which course are you interested in?", 600);
    } else if (currentStep === "course") {
      setFormData((prev) => ({ ...prev, course: value }));
      setCurrentStep("message");
      addTechieMessage("Any specific message or career goal you'd like to share? (Optional, press Send to skip)", 600);
    } else if (currentStep === "message" || currentStep === "error") {
      const finalData: Record<string, string> = { ...formData, message: currentStep === "message" ? value : formData.message };
      if (currentStep === "message") {
        setFormData(finalData);
        addTechieMessage(`Thanks, ${finalData.name}! Here's what I have:\n\nName: ${finalData.name}\nPhone: ${finalData.phone}\nEmail: ${finalData.email}\nCity: ${finalData.city}\nQualification: ${finalData.qualification}\nCourse: ${finalData.course}`, 800);
      }
      
      setCurrentStep("submitting");
      addTechieMessage("I'll share this with the Techogies team. Give me a moment to submit this...", currentStep === "message" ? 1500 : 500);

      try {
        const res = await submitContact({
          data: {
            name: finalData.name || "",
            phone: finalData.phone || "",
            email: finalData.email || "",
            city: finalData.city || "",
            qualification: finalData.qualification || "",
            course: finalData.course || "",
            message: finalData.message,
            source: "techie_live_chat"
          }
        });

        if (res.ok) {
          addTechieMessage("Your enquiry has been submitted successfully! 🚀 The team will get back to you soon.", 1000);
          setCurrentStep("success");
        } else {
          addTechieMessage("Something went wrong while sending your details. Please try again.", 1000);
          setCurrentStep("error");
        }
      } catch (err) {
        addTechieMessage("Something went wrong while sending your details. Please try again.", 1000);
        setCurrentStep("error");
      }
    }
  };

  const handleSend = () => {
    const val = inputValue.trim();
    if (currentStep !== "message" && !val && currentStep !== "qualification" && currentStep !== "course") return;
    
    if (val) {
      addUserMessage(val);
    } else if (currentStep === "message") {
      addUserMessage("Skipped");
    }
    
    setInputValue("");
    handleNextStep(val);
  };

  const handleOptionSelect = (option: string) => {
    addUserMessage(option);
    handleNextStep(option);
  };

  const retrySubmission = () => {
    setCurrentStep("error");
    handleNextStep("");
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open Techie Chat"
            className="fixed bottom-6 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[color:var(--brand)] text-white shadow-elegant"
          >
            <MessageSquare size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-4 right-4 z-50 flex h-[450px] max-h-[85vh] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-zinc-900 px-4 py-3 border-b border-border/50">
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--brand)] opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[color:var(--brand)]"></span>
                  </div>
                  Techie
                </span>
                <span className="text-xs text-muted-foreground">Your Techogies Career Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[color:var(--brand)] text-white rounded-tr-sm"
                        : "bg-secondary text-secondary-foreground rounded-tl-sm"
                    }`}
                  >
                    {msg.isTyping ? (
                      <div className="flex space-x-1.5 h-5 items-center px-1">
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-current rounded-full opacity-60" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-current rounded-full opacity-60" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-current rounded-full opacity-60" />
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Option Selectors */}
              {currentStep === "qualification" && !messages[messages.length - 1]?.isTyping && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 pt-2">
                  {["B.Tech / BE", "BCA", "MCA", "Diploma", "12th", "Graduate", "Post Graduate", "Other"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOptionSelect(opt)}
                      className="rounded-full border border-border/50 bg-secondary/50 px-3 py-1.5 text-xs font-medium text-secondary-foreground transition hover:bg-[color:var(--brand)] hover:text-white hover:border-[color:var(--brand)]"
                    >
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}

              {currentStep === "course" && !messages[messages.length - 1]?.isTyping && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2 pt-2">
                  {coursesData.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => handleOptionSelect(course.title)}
                      className="text-left rounded-xl border border-border/50 bg-secondary/50 px-4 py-2.5 text-sm font-medium text-secondary-foreground transition hover:bg-[color:var(--brand)] hover:text-white hover:border-[color:var(--brand)]"
                    >
                      {course.title}
                    </button>
                  ))}
                </motion.div>
              )}

              {currentStep === "error" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 pt-2">
                  <button
                    onClick={retrySubmission}
                    className="rounded-full bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {["name", "phone", "email", "city", "message", "submitting", "success"].includes(currentStep) && (
              <div className="border-t border-border/50 p-3 bg-background">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type={currentStep === "phone" ? "tel" : currentStep === "email" ? "email" : "text"}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={currentStep === "message" ? "Type your message... (Optional)" : "Type your answer..."}
                    className="flex-1 rounded-full border border-border/50 bg-secondary/30 px-3 py-2 text-sm text-foreground focus:border-[color:var(--brand)] focus:outline-none focus:ring-1 focus:ring-[color:var(--brand)] disabled:opacity-50"
                    disabled={currentStep === "submitting" || currentStep === "success"}
                  />
                  <button
                    type="submit"
                    disabled={(!inputValue.trim() && currentStep !== "message") || currentStep === "submitting" || currentStep === "success"}
                    className="grid h-9 w-9 place-items-center rounded-full bg-[color:var(--brand)] text-white transition hover:bg-orange-600 disabled:opacity-50"
                  >
                    <Send size={15} />
                  </button>
                </form>
              </div>
            )}
            
            {/* Footer with WhatsApp Link */}
            <div className="bg-zinc-900 border-t border-border/50 py-2 text-center flex items-center justify-center">
              <a 
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-muted-foreground hover:text-white transition-colors"
              >
                Prefer WhatsApp? Chat with us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
