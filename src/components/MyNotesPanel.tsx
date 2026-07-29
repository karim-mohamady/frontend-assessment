/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  X,
  Trash2,
  Edit3,
  Search,
  Check,
  Copy,
  ExternalLink,
  BookOpen,
  Download,
  Plus,
  Clock,
  Tag,
  Sparkles,
  StickyNote
} from 'lucide-react';
import { RevisionItem } from '../data/revisionData';

export interface QuestionNote {
  questionId: string;
  noteText: string;
  updatedAt: string; // ISO string
  questionTopic: string;
  questionTextEn: string;
  questionTextAr: string;
  category?: string;
}

interface MyNotesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Record<string, QuestionNote>;
  onSaveNote: (questionId: string, noteText: string, item?: RevisionItem) => void;
  onDeleteNote: (questionId: string) => void;
  onSelectQuestion: (questionId: string) => void;
  allRevisionItems: RevisionItem[];
  isArabic: boolean;
}

export const MyNotesPanel: React.FC<MyNotesPanelProps> = ({
  isOpen,
  onClose,
  notes,
  onSaveNote,
  onDeleteNote,
  onSelectQuestion,
  allRevisionItems,
  isArabic
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const notesList: QuestionNote[] = (Object.values(notes) as QuestionNote[]).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const filteredNotes = notesList.filter((note) => {
    const q = searchQuery.toLowerCase();
    return (
      note.noteText.toLowerCase().includes(q) ||
      note.questionTopic.toLowerCase().includes(q) ||
      note.questionTextEn.toLowerCase().includes(q) ||
      note.questionTextAr.toLowerCase().includes(q)
    );
  });

  const handleStartEdit = (note: QuestionNote) => {
    setEditingId(note.questionId);
    setEditingText(note.noteText);
  };

  const handleSaveEdit = (questionId: string) => {
    if (!editingText.trim()) {
      onDeleteNote(questionId);
    } else {
      const item = allRevisionItems.find((i) => i.id === questionId);
      onSaveNote(questionId, editingText, item);
    }
    setEditingId(null);
    setEditingText('');
  };

  const handleCopyNote = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportNotes = () => {
    const exportData = notesList.map((n) => ({
      Topic: n.questionTopic,
      Question: isArabic ? n.questionTextAr : n.questionTextEn,
      Note: n.noteText,
      LastUpdated: new Date(n.updatedAt).toLocaleString()
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_revision_notes_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex justify-end">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl relative"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <StickyNote className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-white">
                    {isArabic ? 'ملاحظاتي الشخصية' : 'My Study Notes'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                    {notesList.length}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {isArabic
                    ? 'الملخصات والتنبيهات الخاصة المحفوظة محلياً'
                    : 'Personal takeaways and custom reminders saved locally'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {notesList.length > 0 && (
                <button
                  onClick={handleExportNotes}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-bold flex items-center gap-1"
                  title={isArabic ? 'تصدير الملاحظات' : 'Export Notes'}
                >
                  <Download className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/40">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isArabic ? 'البحث في الملاحظات والمواضيع...' : 'Search notes or topics...'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 rtl:pr-10 pr-4 rtl:pl-4 py-2 text-xs font-medium text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <FileText className="w-12 h-12 text-slate-700 mx-auto" />
                <p className="text-sm font-bold text-slate-400">
                  {notesList.length === 0
                    ? isArabic
                      ? 'لا توجد ملاحظات محفوظة بعد'
                      : 'No notes saved yet'
                    : isArabic
                    ? 'لا توجد نتائج تطابق البحث'
                    : 'No notes match your search'}
                </p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {isArabic
                    ? 'اضغط على زر "ملاحظة" الموجود على أي بطاقة سؤال في قسم المراجعة لتدوين أفكارك.'
                    : 'Click the "Note" button on any question card during revision to log your key takeaways.'}
                </p>
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isEditing = editingId === note.questionId;

                return (
                  <div
                    key={note.questionId}
                    className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 space-y-3 transition-all"
                  >
                    {/* Header: Topic & Question snippet */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
                          {note.questionTopic}
                        </span>

                        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(note.updatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-slate-200 line-clamp-1 mt-1">
                        {isArabic ? note.questionTextAr : note.questionTextEn}
                      </p>
                    </div>

                    {/* Note Body or Editor */}
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          rows={3}
                          className="w-full bg-slate-900 border border-amber-500/50 rounded-xl p-3 text-xs text-amber-100 focus:outline-none focus:border-amber-400 resize-none font-sans"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-bold"
                          >
                            {isArabic ? 'إلغاء' : 'Cancel'}
                          </button>
                          <button
                            onClick={() => handleSaveEdit(note.questionId)}
                            className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs font-bold"
                          >
                            {isArabic ? 'حفظ' : 'Save'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-amber-200/90 leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 whitespace-pre-wrap font-sans">
                        {note.noteText}
                      </p>
                    )}

                    {/* Footer Actions */}
                    {!isEditing && (
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                        <button
                          onClick={() => {
                            onSelectQuestion(note.questionId);
                            onClose();
                          }}
                          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{isArabic ? 'الانتقال للسؤال' : 'Go to Question'}</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopyNote(note.noteText, note.questionId)}
                            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
                            title={isArabic ? 'نسخ الملاحظة' : 'Copy note'}
                          >
                            {copiedId === note.questionId ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => handleStartEdit(note)}
                            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
                            title={isArabic ? 'تعديل الملاحظة' : 'Edit note'}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onDeleteNote(note.questionId)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                            title={isArabic ? 'حذف الملاحظة' : 'Delete note'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MyNotesPanel;
