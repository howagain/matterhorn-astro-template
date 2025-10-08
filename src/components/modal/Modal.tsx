import { createSignal, Show, onMount, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';
import type { ModalProps } from './types/modal.types';

export default function Modal(props: ModalProps) {
  let modalRef: HTMLDivElement | undefined;

  const {
    size = 'md',
    closeOnBackdrop = true,
    closeOnEscape = true,
    showCloseButton = true,
    isOpen,
  } = props;

  const openModal = () => {
    props.onOpen?.();
  };

  const closeModal = () => {
    props.onClose?.();
  };

  // Handle escape key and body scroll
  onMount(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape' && isOpen()) {
        closeModal();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    onCleanup(() => {
      document.removeEventListener('keydown', handleEscape);
      // Restore body scroll on cleanup
      document.body.style.overflow = 'unset';
    });
  });

  // Handle body scroll prevention
  onMount(() => {
    const unsubscribe = () => {
      if (isOpen()) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    };
    
    // Initial check
    unsubscribe();
    
    // Watch for changes (this will re-run when isOpen changes)
    const interval = setInterval(unsubscribe, 100);
    
    onCleanup(() => {
      clearInterval(interval);
      document.body.style.overflow = 'unset';
    });
  });

  const handleBackdropClick = (e: MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      closeModal();
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      case 'full':
        return 'max-w-full mx-4';
      default:
        return 'max-w-md';
    }
  };

  return (
    <>
      {/* Trigger Element */}
      <div 
        onClick={openModal}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal();
          }
        }}
        class="cursor-pointer"
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={isOpen()}
      >
        {props.trigger}
      </div>

      {/* Modal Portal */}
      <Show when={isOpen()}>
        <Portal>
          <div
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={props.title ? 'modal-title' : undefined}
          >
            <div
              ref={modalRef}
              class={`
                relative w-full ${getSizeClasses()} 
                bg-white rounded-lg shadow-xl 
                transform transition-all duration-300 ease-out
                animate-in fade-in-0 zoom-in-95
                max-h-[90vh] overflow-hidden
                flex flex-col
              `}
              onClick={(e) => e.stopPropagation()}
              role="document"
            >
              {/* Modal Header */}
              <Show when={props.title || showCloseButton}>
                <div class="flex items-center justify-between p-4 border-b border-gray-200">
                  <Show when={props.title}>
                    <h2 id="modal-title" class="text-lg font-semibold text-gray-900">
                      {props.title}
                    </h2>
                  </Show>
                  <Show when={showCloseButton}>
                    <button
                      onClick={closeModal}
                      class="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                      aria-label="Close modal"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </Show>
                </div>
              </Show>

              {/* Modal Body */}
              <div class="flex-1 overflow-y-auto p-4">
                {props.children}
              </div>
            </div>
          </div>
        </Portal>
      </Show>
    </>
  );
}
