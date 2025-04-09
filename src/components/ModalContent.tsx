interface ModalContentProps {
  onClose: () => void;
}

function ModalContent({ onClose }: ModalContentProps) {
  return (
    <>
      <dialog>
        <div>I'm a modal dialog</div>
        <button onClick={onClose}>Close</button>
      </dialog>
    </>
  );
}

export default ModalContent;
