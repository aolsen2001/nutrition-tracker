import { useEffect, useRef } from 'react';

interface ModalFormContainerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function ModalFormContainer({
  isOpen,
  onClose,
  children,
}: ModalFormContainerProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // prevents dialog from closing when the user hits enter, allowing them to submit the form instead
  function onKeyDown(e: React.KeyboardEvent<HTMLDialogElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  return (
    <>
      <dialog ref={dialogRef} onClose={onClose} onKeyDown={onKeyDown}>
        <button type='button' onClick={onClose}>
          Close
        </button>
        {children}
      </dialog>
    </>
  );
}

export default ModalFormContainer;
