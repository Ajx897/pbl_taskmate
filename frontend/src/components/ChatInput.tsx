
import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, X, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onSendMessage?: (message: string, attachments?: File[]) => void;
  placeholder?: string;
  onTyping?: () => void;
  onStopTyping?: () => void;
}

export function ChatInput({ 
  onSendMessage, 
  placeholder = "Type a message...", 
  onTyping, 
  onStopTyping 
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Auto-resize the textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(120, textareaRef.current.scrollHeight)}px`;
    }
  }, [message]);

  // Handle typing indicators
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      onTyping?.();
    }
    
    // Reset the timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set a new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onStopTyping?.();
    }, 1500);
  };

  const handleSendMessage = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage?.(message, attachments.length > 0 ? attachments : undefined);
      setMessage("");
      setAttachments([]);
      
      // Reset typing state
      if (isTyping) {
        setIsTyping(false);
        onStopTyping?.();
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const addEmoji = (emoji: any) => {
    setMessage(prev => prev + emoji.native);
    textareaRef.current?.focus();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Check file size - 10MB limit per file
      const validFiles = Array.from(files).filter(file => file.size <= 10 * 1024 * 1024);
      
      if (validFiles.length !== files.length) {
        toast({
          title: "File too large",
          description: "Some files exceed the 10MB limit and were not added.",
          variant: "destructive"
        });
      }
      
      if (validFiles.length + attachments.length > 5) {
        toast({
          title: "Too many attachments",
          description: "You can only attach up to 5 files at once.",
          variant: "destructive"
        });
        
        setAttachments(prev => [...prev, ...validFiles.slice(0, 5 - prev.length)]);
      } else {
        setAttachments(prev => [...prev, ...validFiles]);
      }
    }
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const renderAttachmentPreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return (
        <div className="relative w-16 h-16 rounded overflow-hidden">
          <img 
            src={URL.createObjectURL(file)} 
            alt={file.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-white hover:text-white hover:bg-red-500/20"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeAttachment(attachments.indexOf(file));
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="relative bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded flex flex-col items-center justify-center p-1">
        <div className="text-xs text-center truncate w-full">{file.name.split('.').pop()}</div>
        <div className="text-[10px] text-gray-500 truncate w-full">{(file.size / 1024).toFixed(0)}KB</div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-0 right-0 h-5 w-5 text-gray-500"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            removeAttachment(attachments.indexOf(file));
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-xl w-full sticky bottom-0 left-0 right-0">
      {attachments.length > 0 && (
        <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
          {attachments.map((file, index) => (
            <div key={index}>
              {renderAttachmentPreview(file)}
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            multiple 
            className="hidden" 
            onChange={handleFileChange}
            ref={fileInputRef}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <button 
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
          </button>
          
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Smile className="h-5 w-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none" align="end">
              <Picker 
                data={data} 
                onEmojiSelect={addEmoji}
                theme={isMobile ? "light" : "auto"}
                previewPosition="none"
                skinTonePosition="none"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full min-h-[40px] max-h-[120px] px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-taskbuddy-blue/20 focus:border-taskbuddy-blue/40"
          />
        </div>
        
        <Button 
          size="icon"
          onClick={handleSendMessage}
          disabled={!message.trim() && attachments.length === 0}
          className={`rounded-full ${!message.trim() && attachments.length === 0 ? 'opacity-50' : ''}`}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
