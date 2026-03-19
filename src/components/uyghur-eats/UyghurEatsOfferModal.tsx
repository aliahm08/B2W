import { type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight } from 'lucide-react';

interface UyghurEatsOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    isSubmitted: boolean;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function UyghurEatsOfferModal({
    isOpen,
    onClose,
    isSubmitted,
    onSubmit
}: UyghurEatsOfferModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/65 px-0 py-0 md:px-4 md:py-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="offer-modal-title"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="relative w-full h-full md:h-auto md:max-h-[90vh] max-w-2xl border-0 md:border md:border-neutral-200 bg-white md:shadow-2xl overflow-y-auto"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center border border-neutral-200 text-neutral-500 transition-colors hover:text-black"
                    aria-label="Close form"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="border-b border-neutral-200 px-6 py-5 md:px-8">
                    <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500 mb-3">
                        Letter of Intent
                    </p>
                    <h2 id="offer-modal-title" className="text-2xl font-medium tracking-tight">
                        Proposal Acceptance
                    </h2>
                </div>

                {!isSubmitted ? (
                    <form onSubmit={onSubmit} className="px-6 py-6 md:px-8 md:py-8">
                        <div className="grid gap-5 md:grid-cols-2">
                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-neutral-800">Client Name</span>
                                <input
                                    type="text"
                                    name="clientName"
                                    required
                                    className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                                    placeholder="Legal entity or name"
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-neutral-800">Authorized Representative</span>
                                <input
                                    type="text"
                                    name="representative"
                                    required
                                    className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                                    placeholder="Name of signee"
                                />
                            </label>

                            <label className="block md:col-span-2">
                                <span className="mb-2 block text-sm font-medium text-neutral-800">Email</span>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                                    placeholder="name@company.com"
                                />
                            </label>
                        </div>
                        
                        <div className="mt-6 p-5 border border-neutral-100 bg-neutral-50/50">
                            <p className="text-sm leading-relaxed text-neutral-600">
                                By signing below, Client acknowledges and accepts the scope of services, pricing, and assumptions described in this proposal for the following option listed above.
                            </p>
                            <p className="mt-3 text-xs leading-relaxed text-neutral-500 italic">
                                This proposal is not intended to replace the service contract, which will govern the Parties’ legal relationship. This section only serves as a non-binding letter of intent.
                            </p>
                        </div>

                        <label className="mt-5 block border-b border-neutral-300 pb-2">
                            <span className="mb-2 block text-sm font-medium text-neutral-800">Signature</span>
                            <input
                                type="text"
                                name="signature"
                                required
                                className="w-full font-serif italic text-lg outline-none transition-colors focus:border-black text-black"
                                placeholder="Type signature here..."
                            />
                        </label>

                        <label className="mt-5 block">
                            <span className="mb-2 block text-sm font-medium text-neutral-800">Comments (Optional)</span>
                            <textarea
                                name="comments"
                                rows={4}
                                className="w-full resize-y border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                                placeholder="Add any notes, requested edits, or context for the B2W team."
                            />
                        </label>

                        <div className="mt-6 flex flex-col gap-3 border-t border-neutral-200 pt-5 md:flex-row md:items-center md:justify-between">
                            <p className="text-xs leading-5 text-neutral-500">
                                All information is strictly confidential and private.
                            </p>
                            <div className="flex flex-col gap-3 md:flex-row">
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center gap-2 bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                                >
                                    Accept Non-Binding Proposal
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center gap-2 border border-neutral-300 px-5 py-3 text-sm font-medium text-black transition-colors hover:border-black hover:bg-neutral-50"
                                >
                                    Request Changes
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="px-6 py-8 md:px-8">
                        <div className="border border-neutral-200 bg-neutral-50 p-6">
                            <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500 mb-3">
                                Success
                            </p>
                            <h3 className="text-2xl font-medium tracking-tight mb-3">
                                Letter of Intent Received
                            </h3>
                            <p className="max-w-xl text-sm leading-6 text-neutral-600">
                                Your acceptance has been captured. B2W will forward the finalized service contract to govern the legal relationship shortly.
                            </p>
                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="inline-flex items-center justify-center border border-neutral-300 px-4 py-3 text-sm font-medium text-black transition-colors hover:border-black"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
