'use client';

import React from 'react';

export interface OrderModalShellProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: React.ReactNode;
    confirmLabel?: string;
    confirmDisabled?: boolean;
}

export function OrderModalShell({
    isOpen,
    onClose,
    onConfirm,
    title,
    children,
    confirmLabel = 'Add',
    confirmDisabled = false,
}: OrderModalShellProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className={`fixed inset-x-0 bottom-0 z-50 bg-white shadow-xl transition-transform duration-500 ease-out
    ${isOpen ? 'translate-y-0' : 'translate-y-full'}
    rounded-t-3xl max-h-[80vh] flex flex-col
    md:rounded-2xl md:left-1/2 md:top-1/2 md:bottom-auto md:translate-x-[-50%] md:translate-y-[-50%]
    md:max-w-lg md:w-[90%] md:h-auto
  `}
        >
            <div className="p-4 border-b flex justify-between items-center border-brand">
                <h2 className="text-lg font-semibold text-foreground">
                    {title}
                </h2>
                <button
                    onClick={onClose}
                    className="transition text-secondary hover:text-foreground"
                    aria-label="Close modal"
                >
                    ✕
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 smooth-scroll">
                {children}
            </div>

            <div className="p-4 border-t border-brand flex justify-end gap-2">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl cursor-pointer transition bg-bg-light text-secondary hover:bg-gray-100"
                    type="button"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={confirmDisabled}
                    className={`px-4 py-2 rounded-xl cursor-pointer transition btn-brand-blue disabled:opacity-50 disabled:cursor-not-allowed`}
                    type="button"
                >
                    {confirmLabel}
                </button>
            </div>
        </div>
    );
}
