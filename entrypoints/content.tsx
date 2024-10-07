// Import necessary React hooks and ReactDOM
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css'

// Define types for messages and modal props
interface Message {
  type: 'prompt' | 'response';
  text: string;
}

interface ModalProps {
  onClose: () => void;
}

// Html Modal after icon is clicked
const Modal: React.FC<ModalProps> = ({ onClose }) => {
  // State hooks
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Refs for scrolling and modal
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect to scroll to bottom when messages change
  useEffect(scrollToBottom, [messages]);

  // Effect to handle clicking outside the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Function to handle generating a response
  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setMessages(prev => [...prev, { type: 'prompt', text: prompt }]);
    
    // Simulating API call with setTimeout
    setTimeout(() => {
      const response = "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";
      setMessages(prev => [...prev, { type: 'response', text: response }]);
      setPrompt('');
      setIsGenerating(false);
    }, 1000);
  }, [prompt]);

  // Function to insert the last response into the LinkedIn message box
  const handleInsert = useCallback(() => {
    const lastResponse = messages.filter(m => m.type === 'response').pop();
    if (lastResponse) {
      const messageInput = document.querySelector('.msg-form__contenteditable[contenteditable="true"]');
      if (messageInput instanceof HTMLElement) {
        const p = document.createElement('p');
        p.textContent = lastResponse.text;
        messageInput.innerHTML = '';
        messageInput.appendChild(p);
      }
    }
    onClose();
  }, [messages, onClose]);

  // Render the modal
  return (
    <div id="modal-overlay">
      <div id="custom-modal" ref={modalRef}>
        <div className="modal-content">
          {/* Messages container */}
          <div className="messages-container">
            {messages.map((message, index) => (
              <div key={index} className={`message-bubble ${message.type}`}>
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Prompt input */}
          <textarea
            id="prompt-input"
            placeholder="Your prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          {/* Button container */}
          <div id="button-container">
            {messages.length > 0 && (
              <button id="insert-button" onClick={handleInsert}>
                <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.1 12.3666V1.43331C6.1 1.05553 6.228 0.739087 6.484 0.483976C6.74 0.228865 7.05644 0.100864 7.43333 0.0999756C7.81111 0.0999756 8.128 0.227976 8.384 0.483976C8.64 0.739976 8.76756 1.05642 8.76667 1.43331V12.3666L12.6333 8.49998C12.8778 8.25553 13.1889 8.13331 13.5667 8.13331C13.9444 8.13331 14.2556 8.25553 14.5 8.49998C14.7444 8.74442 14.8667 9.05553 14.8667 9.43331C14.8667 9.81109 14.7444 10.1222 14.5 10.3666L8.36667 16.5C8.1 16.7666 7.78889 16.9 7.43333 16.9C7.07778 16.9 6.76667 16.7666 6.5 16.5L0.366666 10.3666C0.122222 10.1222 0 9.81109 0 9.43331C0 9.05553 0.122222 8.74442 0.366666 8.49998C0.611111 8.25553 0.922222 8.13331 1.3 8.13331C1.67778 8.13331 1.98889 8.25553 2.23333 8.49998L6.1 12.3666Z" fill="#666D80"/>
                </svg>
                Insert
              </button>
            )}
            <button 
              id="generate-button" 
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              <svg width="15" height="15" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.456 11.6075L2.45599 0.607504C2.28356 0.521271 2.08988 0.486719 1.89827 0.508009C1.70665 0.529299 1.52528 0.605523 1.37599 0.727504C1.23341 0.846997 1.12699 1.00389 1.0687 1.18055C1.0104 1.35721 1.00254 1.54662 1.04599 1.7275L4.00599 12.4975L1.00599 23.2375C0.965214 23.3886 0.960455 23.5471 0.992092 23.7003C1.02373 23.8535 1.09088 23.9972 1.18815 24.1198C1.28541 24.2423 1.41008 24.3403 1.55212 24.4059C1.69416 24.4715 1.84962 24.5029 2.00599 24.4975C2.16253 24.4966 2.31667 24.4589 2.45599 24.3875L24.456 13.3875C24.6198 13.3036 24.7573 13.1761 24.8532 13.0191C24.9492 12.862 25 12.6816 25 12.4975C25 12.3135 24.9492 12.133 24.8532 11.9759C24.7573 11.8189 24.6198 11.6914 24.456 11.6075Z" fill="white"/>
              </svg>
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Define interface for content script configuration
interface ContentScript {
  matches: string[];
  main: () => void | (() => void);
}

// Helper function to define content script
function defineContentScript(config: ContentScript) {
  return config;
}

// Export the content script configuration
export default defineContentScript({
  matches: ['*://*.linkedin.com/*'],
  main() {
    let modalRoot: HTMLDivElement | null = null;
    let reactRoot: any = null;

    // Function to render the modal
    function renderModal() {
      if (!modalRoot) {
        modalRoot = document.createElement('div');
        modalRoot.id = 'modal-root';
        document.body.appendChild(modalRoot);
        reactRoot = createRoot(modalRoot);
      }

      reactRoot.render(
        <Modal onClose={() => {
          if (modalRoot) {
            modalRoot.style.display = 'none';
          }
        }} />
      );

      if (modalRoot) {
        modalRoot.style.display = 'block';
      }
    }

    let isProcessingClick = false;

    // Function to add message icon to the LinkedIn message box
    function addMessageIcon(element: HTMLElement) {
      if (element.parentElement?.querySelector('.message-icon-container')) {
        return;
      }

      const iconContainer = document.createElement('div');
      iconContainer.className = 'message-icon-container';
      iconContainer.innerHTML = `
        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.4667 8.73332C15.4667 8.88655 15.4063 9.03351 15.2989 9.14187C15.1915 9.25022 15.0458 9.3111 14.8938 9.3111H13.7482V10.4667C13.7482 10.6199 13.6879 10.7668 13.5804 10.8752C13.473 10.9836 13.3273 11.0444 13.1754 11.0444C13.0235 11.0444 12.8778 10.9836 12.7703 10.8752C12.6629 10.7668 12.6026 10.6199 12.6026 10.4667V9.3111H11.4569C11.305 9.3111 11.1593 9.25022 11.0519 9.14187C10.9445 9.03351 10.8841 8.88655 10.8841 8.73332C10.8841 8.58008 10.9445 8.43312 11.0519 8.32477C11.1593 8.21641 11.305 8.15554 11.4569 8.15554H12.6026V6.99998C12.6026 6.84675 12.6629 6.69979 12.7703 6.59143C12.8778 6.48308 13.0235 6.42221 13.1754 6.42221C13.3273 6.42221 13.473 6.48308 13.5804 6.59143C13.6879 6.69979 13.7482 6.84675 13.7482 6.99998V8.15554H14.8938C15.0458 8.15554 15.1915 8.21641 15.2989 8.32477C15.4063 8.43312 15.4667 8.58008 15.4667 8.73332ZM1.719 2.95554H2.86464V4.11109C2.86464 4.26433 2.92499 4.41129 3.03241 4.51965C3.13984 4.628 3.28554 4.68887 3.43746 4.68887C3.58938 4.68887 3.73508 4.628 3.8425 4.51965C3.94993 4.41129 4.01028 4.26433 4.01028 4.11109V2.95554H5.15592C5.30784 2.95554 5.45354 2.89467 5.56096 2.78631C5.66839 2.67796 5.72874 2.531 5.72874 2.37776C5.72874 2.22453 5.66839 2.07757 5.56096 1.96921C5.45354 1.86086 5.30784 1.79998 5.15592 1.79998H4.01028V0.644428C4.01028 0.491192 3.94993 0.344232 3.8425 0.235878C3.73508 0.127523 3.58938 0.0666504 3.43746 0.0666504C3.28554 0.0666504 3.13984 0.127523 3.03241 0.235878C2.92499 0.344232 2.86464 0.491192 2.86464 0.644428V1.79998H1.719C1.56708 1.79998 1.42138 1.86086 1.31396 1.96921C1.20653 2.07757 1.14618 2.22453 1.14618 2.37776C1.14618 2.531 1.20653 2.67796 1.31396 2.78631C1.42138 2.89467 1.56708 2.95554 1.719 2.95554ZM10.8841 11.6222H10.3113V11.0444C10.3113 10.8912 10.2509 10.7442 10.1435 10.6359C10.0361 10.5275 9.89039 10.4667 9.73847 10.4667C9.58655 10.4667 9.44085 10.5275 9.33343 10.6359C9.226 10.7442 9.16565 10.8912 9.16565 11.0444V11.6222H8.59283C8.44091 11.6222 8.29521 11.6831 8.18779 11.7914C8.08036 11.8998 8.02001 12.0467 8.02001 12.2C8.02001 12.3532 8.08036 12.5002 8.18779 12.6085C8.29521 12.7169 8.44091 12.7778 8.59283 12.7778H9.16565V13.3555C9.16565 13.5088 9.226 13.6557 9.33343 13.7641C9.44085 13.8724 9.58655 13.9333 9.73847 13.9333C9.89039 13.9333 10.0361 13.8724 10.1435 13.7641C10.2509 13.6557 10.3113 13.5088 10.3113 13.3555V12.7778H10.8841C11.036 12.7778 11.1817 12.7169 11.2892 12.6085C11.3966 12.5002 11.4569 12.3532 11.4569 12.2C11.4569 12.0467 11.3966 11.8998 11.2892 11.7914C11.1817 11.6831 11.036 11.6222 10.8841 11.6222ZM13.4124 3.53332L3.43746 13.5946C3.22263 13.8111 2.93135 13.9328 2.62764 13.9328C2.32392 13.9328 2.03264 13.8111 1.81781 13.5946L0.335642 12.101C0.229232 11.9937 0.144822 11.8663 0.0872316 11.7261C0.0296415 11.5859 0 11.4356 0 11.2838C0 11.1321 0.0296415 10.9818 0.0872316 10.8416C0.144822 10.7014 0.229232 10.574 0.335642 10.4667L10.3113 0.405373C10.4177 0.298041 10.544 0.2129 10.683 0.154812C10.822 0.0967231 10.971 0.0668251 11.1215 0.0668251C11.2719 0.0668251 11.4209 0.0967231 11.5599 0.154812C11.699 0.2129 11.8253 0.298041 11.9317 0.405373L13.4124 1.89893C13.5188 2.00623 13.6032 2.13363 13.6608 2.27385C13.7184 2.41407 13.748 2.56435 13.748 2.71612C13.748 2.86789 13.7184 3.01818 13.6608 3.1584C13.6032 3.29861 13.5188 3.42601 13.4124 3.53332ZM12.6026 2.71648L11.1211 1.22221L8.82984 3.53332L10.3113 5.0276L12.6026 2.71648Z" fill="#2563EB"/>
</svg>

      `;
      
      // Add click event listener to the icon
      iconContainer.addEventListener('mousedown', (event) => {
        event.preventDefault();
        event.stopPropagation();
        isProcessingClick = true;
        
        setTimeout(() => {
          renderModal();
          setTimeout(() => {
            isProcessingClick = false;
          }, 100);
        }, 0);
      });

      element.parentElement?.appendChild(iconContainer);
    }

    // Function to remove the message icon
    function removeIcon(element: HTMLElement) {
      if (isProcessingClick) return;

      const iconContainer = element.parentElement?.querySelector('.message-icon-container');
      if (iconContainer) {
        iconContainer.remove();
      }
    }

    // Create a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.target instanceof HTMLElement) {
          const target = mutation.target;
          
          // Check if the target is the LinkedIn message input
          if (target.classList.contains('msg-form__contenteditable')) {
            const isFocused = target.getAttribute('data-artdeco-is-focused') === 'true';
            
            // Add or remove the icon based on focus state
            if (isFocused) {
              addMessageIcon(target);
            } else {
              removeIcon(target);
            }
          }
        }
      });
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-artdeco-is-focused'],
      subtree: true,
    });

    // Return a cleanup function to disconnect the observer when the script is unloaded
    return () => observer.disconnect();
  }
});