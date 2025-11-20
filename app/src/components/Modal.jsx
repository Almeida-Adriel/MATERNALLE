import React from 'react';
import { MdClose } from 'react-icons/md';

const Modal = ({ open, onClose, children, title }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl mx-auto bg-white rounded-2xl border border-brand-100 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 sticky top-0 bg-white z-20">
          <h3 className="text-lg font-semibold text-brand-800">{title}</h3>
          <button
            className="p-2 rounded-lg hover:bg-slate-50"
            onClick={onClose}
          >
            <MdClose />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
