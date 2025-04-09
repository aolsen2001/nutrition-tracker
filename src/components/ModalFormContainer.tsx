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

  return (
    <>
      <dialog ref={dialogRef}>{children}</dialog>
    </>
  );
}

export default ModalFormContainer;
