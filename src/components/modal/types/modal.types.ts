import type { JSX, Accessor } from 'solid-js';

export interface ModalProps {
  /** The element that triggers the modal when clicked */
  trigger: JSX.Element;
  /** The content to display inside the modal */
  children: JSX.Element;
  /** Control of modal open state from parent */
  isOpen: Accessor<boolean>;
  /** Optional title for the modal header */
  title?: string;
  /** Size of the modal - affects max-width */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Whether clicking the backdrop closes the modal (default: true) */
  closeOnBackdrop?: boolean;
  /** Whether pressing Escape closes the modal (default: true) */
  closeOnEscape?: boolean;
  /** Whether to show the X close button (default: true) */
  showCloseButton?: boolean;
  /** Callback fired when modal opens */
  onOpen?: () => void;
  /** Callback fired when modal closes */
  onClose?: () => void;
}

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalState {
  isOpen: boolean;
}
