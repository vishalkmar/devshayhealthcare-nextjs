'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Quote, Heading1, Heading2, Heading3,
  RemoveFormatting, Undo, Redo, Minus, Subscript, Superscript,
  IndentDecrease, IndentIncrease, Type, Palette,
  ChevronDown, List, ListOrdered, Smile, Image as ImageIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';

const FONT_FAMILIES = [
  { label: 'Sans', value: 'Inter, system-ui, sans-serif' },
  { label: 'Serif', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Mono', value: '"JetBrains Mono", "Courier New", monospace' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Display', value: 'Poppins, Inter, sans-serif' },
];

const FONT_SIZES = ['12', '14', '16', '18', '20', '24', '32', '40', '48'].map((n) => ({
  label: n, value: `${n}px`,
}));

const FORMAT_BLOCKS = [
  { label: 'Paragraph', value: 'P' },
  { label: 'Heading 1', value: 'H1' },
  { label: 'Heading 2', value: 'H2' },
  { label: 'Heading 3', value: 'H3' },
  { label: 'Heading 4', value: 'H4' },
  { label: 'Quote', value: 'BLOCKQUOTE' },
  { label: 'Code block', value: 'PRE' },
];

const UL_STYLES = [
  { label: 'Bullet (•)', value: 'disc' },
  { label: 'Circle (◦)', value: 'circle' },
  { label: 'Square (▪)', value: 'square' },
  { label: 'No marker', value: 'none' },
];

const OL_STYLES = [
  { label: '1, 2, 3 …', value: 'decimal' },
  { label: '01, 02, 03 …', value: 'decimal-leading-zero' },
  { label: 'a, b, c …', value: 'lower-alpha' },
  { label: 'A, B, C …', value: 'upper-alpha' },
  { label: 'i, ii, iii …', value: 'lower-roman' },
];

const LINE_HEIGHTS = ['1', '1.15', '1.5', '2', '2.5', '3'].map((v) => ({ label: v, value: v }));

const PARAGRAPH_SPACING = [
  { label: 'None', value: '0' },
  { label: 'Small', value: '4px' },
  { label: 'Medium', value: '10px' },
  { label: 'Large', value: '18px' },
  { label: 'X-Large', value: '28px' },
];

const BLOCK_TAGS = new Set(['P', 'DIV', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'PRE', 'UL', 'OL', 'TD', 'TH']);

const ICON_PRESETS = [
  '✓', '✗', '★', '✦', '➤', '•', '❤', '⚕', '💊', '🩺',
  '🧪', '🔬', '🌡', '💉', '🩹', '🧬', '⚗', '🏥', '➕', '⚠',
];

export default function RichTextEditor({ value = '', onChange, placeholder = 'Start typing…', minHeight = 200 }) {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (el.innerHTML !== (value || '')) el.innerHTML = value || '';
  }, [value]);

  const focusEditor = () => editorRef.current?.focus();
  const emit = () => onChange?.(editorRef.current?.innerHTML || '');

  const exec = useCallback((command, arg = null) => {
    focusEditor();
    document.execCommand(command, false, arg);
    emit();
  }, [onChange]); // eslint-disable-line react-hooks/exhaustive-deps

  const setBlock = (tag) => exec('formatBlock', tag);

  const wrapSelection = (styleProp, styleValue) => {
    focusEditor();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (range.collapsed) return;
    const span = document.createElement('span');
    span.style[styleProp] = styleValue;
    try {
      range.surroundContents(span);
    } catch {
      const frag = range.extractContents();
      span.appendChild(frag);
      range.insertNode(span);
    }
    sel.removeAllRanges();
    const r = document.createRange();
    r.selectNodeContents(span);
    sel.addRange(r);
    emit();
  };

  const setBlockStyle = (styleProp, styleValue) => {
    focusEditor();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const editor = editorRef.current;
    if (!editor) return;
    const candidates = editor.querySelectorAll('p, div, li, h1, h2, h3, h4, h5, h6, blockquote, pre, td, th');
    const blocks = [];
    candidates.forEach((el) => {
      try { if (range.intersectsNode(el)) blocks.push(el); } catch { /* skip */ }
    });
    if (blocks.length > 0) {
      blocks.forEach((b) => { b.style[styleProp] = styleValue; });
      emit();
      return;
    }
    let node = sel.anchorNode;
    if (node && node.nodeType === Node.TEXT_NODE) node = node.parentNode;
    while (node && node !== editor && !BLOCK_TAGS.has(node.tagName)) node = node.parentNode;
    if (node && node !== editor) { node.style[styleProp] = styleValue; emit(); return; }
    if (!range.collapsed) { wrapSelection(styleProp, styleValue); return; }
    editor.style[styleProp] = styleValue;
    emit();
  };

  const setListStyle = (kind, styleValue) => {
    focusEditor();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    let node = sel.anchorNode;
    if (node && node.nodeType === Node.TEXT_NODE) node = node.parentNode;
    while (node && node !== editorRef.current && node.tagName !== kind) node = node.parentNode;
    if (!node || node === editorRef.current) {
      exec(kind === 'UL' ? 'insertUnorderedList' : 'insertOrderedList');
      let again = window.getSelection().anchorNode;
      if (again && again.nodeType === Node.TEXT_NODE) again = again.parentNode;
      while (again && again !== editorRef.current && again.tagName !== kind) again = again.parentNode;
      if (again && again !== editorRef.current) again.style.listStyleType = styleValue;
    } else {
      node.style.listStyleType = styleValue;
    }
    emit();
  };

  const setLink = () => {
    const url = prompt('Enter URL (include https://)');
    if (!url) return;
    exec('createLink', url);
  };

  const insertHtml = (html) => {
    focusEditor();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      editorRef.current?.insertAdjacentHTML('beforeend', html);
      emit();
      return;
    }
    document.execCommand('insertHTML', false, html);
    emit();
  };

  const insertEmoji = (emoji) => insertHtml(`<span class="rte-icon">${emoji}</span>`);

  const uploadIconFile = async (file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const tId = toast.loading('Uploading icon…');
    try {
      const res = await fetch('/api/uploads', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Upload failed');
      insertHtml(`<img src="${json.data.url}" alt="" class="rte-custom-icon" />`);
      toast.success('Icon inserted', { id: tId });
    } catch (err) {
      toast.error(err.message || 'Upload failed', { id: tId });
    }
  };

  const onPaste = (e) => {
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    if (!text) return;
    e.preventDefault();
    document.execCommand('insertText', false, text);
  };

  return (
    <div className={`rounded-xl border bg-white overflow-hidden ${isFocused ? 'ring-2 ring-brand/30 border-brand' : 'border-line'}`}>
      <div className="flex flex-wrap items-center gap-1 border-b bg-cloud px-2 py-1.5">
        <Group>
          <IconBtn title="Undo" onClick={() => exec('undo')}><Undo size={15} /></IconBtn>
          <IconBtn title="Redo" onClick={() => exec('redo')}><Redo size={15} /></IconBtn>
        </Group>
        <Group>
          <Select title="Font" placeholder="Font" options={FONT_FAMILIES} onPick={(v) => wrapSelection('fontFamily', v)} width={80} />
          <Select title="Size" placeholder="Size" options={FONT_SIZES} onPick={(v) => wrapSelection('fontSize', v)} width={62} />
          <Select title="Format" placeholder="Format" options={FORMAT_BLOCKS} onPick={setBlock} width={96} />
          <Select title="Line spacing" placeholder="↕ Line" options={LINE_HEIGHTS} onPick={(v) => setBlockStyle('lineHeight', v)} width={80} />
          <Select title="Paragraph spacing" placeholder="¶ Space" options={PARAGRAPH_SPACING} onPick={(v) => { setBlockStyle('marginTop', v); setBlockStyle('marginBottom', v); }} width={92} />
        </Group>
        <Group>
          <IconBtn title="Bold" onClick={() => exec('bold')}><Bold size={15} /></IconBtn>
          <IconBtn title="Italic" onClick={() => exec('italic')}><Italic size={15} /></IconBtn>
          <IconBtn title="Underline" onClick={() => exec('underline')}><Underline size={15} /></IconBtn>
          <IconBtn title="Strikethrough" onClick={() => exec('strikeThrough')}><Strikethrough size={15} /></IconBtn>
          <IconBtn title="Subscript" onClick={() => exec('subscript')}><Subscript size={15} /></IconBtn>
          <IconBtn title="Superscript" onClick={() => exec('superscript')}><Superscript size={15} /></IconBtn>
        </Group>
        <Group>
          <ColorPicker title="Text color" icon={<Type size={15} />} onPick={(c) => exec('foreColor', c)} />
          <ColorPicker title="Highlight" icon={<Palette size={15} />} onPick={(c) => exec('hiliteColor', c)} defaultColor="#d9f3ff" />
        </Group>
        <Group>
          <IconBtn title="Heading 1" onClick={() => setBlock('H1')}><Heading1 size={15} /></IconBtn>
          <IconBtn title="Heading 2" onClick={() => setBlock('H2')}><Heading2 size={15} /></IconBtn>
          <IconBtn title="Heading 3" onClick={() => setBlock('H3')}><Heading3 size={15} /></IconBtn>
        </Group>
        <Group>
          <IconBtn title="Align left" onClick={() => exec('justifyLeft')}><AlignLeft size={15} /></IconBtn>
          <IconBtn title="Align center" onClick={() => exec('justifyCenter')}><AlignCenter size={15} /></IconBtn>
          <IconBtn title="Align right" onClick={() => exec('justifyRight')}><AlignRight size={15} /></IconBtn>
          <IconBtn title="Justify" onClick={() => exec('justifyFull')}><AlignJustify size={15} /></IconBtn>
        </Group>
        <Group>
          <SplitButton title="Bulleted list" icon={<List size={15} />} onMain={() => exec('insertUnorderedList')} options={UL_STYLES} onPick={(v) => setListStyle('UL', v)} />
          <SplitButton title="Numbered list" icon={<ListOrdered size={15} />} onMain={() => exec('insertOrderedList')} options={OL_STYLES} onPick={(v) => setListStyle('OL', v)} />
          <IconBtn title="Decrease indent" onClick={() => exec('outdent')}><IndentDecrease size={15} /></IconBtn>
          <IconBtn title="Increase indent" onClick={() => exec('indent')}><IndentIncrease size={15} /></IconBtn>
        </Group>
        <Group>
          <EmojiPicker title="Insert symbol" icon={<Smile size={15} />} options={ICON_PRESETS} onPick={insertEmoji} />
          <IconUploader title="Upload icon" icon={<ImageIcon size={15} />} onPick={uploadIconFile} />
        </Group>
        <Group last>
          <IconBtn title="Quote" onClick={() => setBlock('BLOCKQUOTE')}><Quote size={15} /></IconBtn>
          <IconBtn title="Insert link" onClick={setLink}><LinkIcon size={15} /></IconBtn>
          <IconBtn title="Horizontal rule" onClick={() => exec('insertHorizontalRule')}><Minus size={15} /></IconBtn>
          <IconBtn title="Clear formatting" onClick={() => exec('removeFormat')}><RemoveFormatting size={15} /></IconBtn>
        </Group>
      </div>

      <div
        ref={editorRef}
        className="rich-prose px-4 py-3 outline-none"
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onPaste={onPaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        data-placeholder={placeholder}
        style={{ minHeight }}
      />
    </div>
  );
}

function Group({ children, last }) {
  return <div className={`flex items-center gap-0.5 px-1 ${last ? '' : 'mr-1 border-r border-line'}`}>{children}</div>;
}

function IconBtn({ onClick, title, children }) {
  return (
    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={onClick} title={title}
      className="rounded p-1.5 text-slate-700 transition hover:bg-slate-200">
      {children}
    </button>
  );
}

function Select({ title, placeholder, options, onPick, width = 80 }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  return (
    <span ref={ref} className="relative" onMouseDown={(e) => e.preventDefault()}>
      <button type="button" title={title} onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between gap-1 rounded border border-line bg-white px-2 py-1 text-xs text-slate-700 hover:border-slate-400" style={{ width }}>
        <span className="truncate">{placeholder}</span>
        <ChevronDown size={12} className="shrink-0 opacity-60" />
      </button>
      {open && (
        <div className="absolute left-0 z-20 mt-1 max-h-60 min-w-[150px] overflow-y-auto rounded-lg border border-line bg-white shadow-lg">
          {options.map((opt) => (
            <button key={opt.value} type="button" onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onPick(opt.value); setOpen(false); }}
              className="block w-full px-3 py-1.5 text-left text-sm hover:bg-cloud">
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </span>
  );
}

function ColorPicker({ title, icon, onPick, defaultColor = '#0f1722' }) {
  return (
    <label title={title} className="relative inline-flex cursor-pointer items-center rounded p-1.5 text-slate-700 hover:bg-slate-200" onMouseDown={(e) => e.preventDefault()}>
      {icon}
      <input type="color" defaultValue={defaultColor} onChange={(e) => onPick(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" />
    </label>
  );
}

function EmojiPicker({ title, icon, options, onPick }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  return (
    <span ref={ref} className="relative" onMouseDown={(e) => e.preventDefault()}>
      <IconBtn title={title} onClick={() => setOpen((o) => !o)}>{icon}</IconBtn>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 grid w-[230px] grid-cols-10 gap-1 rounded-lg border border-line bg-white p-2 shadow-lg">
          {options.map((emoji) => (
            <button key={emoji} type="button" onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onPick(emoji); setOpen(false); }}
              className="flex h-7 w-7 items-center justify-center rounded text-base hover:bg-cloud">
              {emoji}
            </button>
          ))}
        </div>
      )}
    </span>
  );
}

function IconUploader({ title, icon, onPick }) {
  const inputRef = useRef(null);
  return (
    <span onMouseDown={(e) => e.preventDefault()} className="inline-flex">
      <IconBtn title={title} onClick={() => inputRef.current?.click()}>{icon}</IconBtn>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onPick(f); e.target.value = ''; }} />
    </span>
  );
}

function SplitButton({ title, icon, onMain, options, onPick }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  return (
    <span ref={ref} className="relative inline-flex items-center" onMouseDown={(e) => e.preventDefault()}>
      <IconBtn title={title} onClick={onMain}>{icon}</IconBtn>
      <button type="button" onClick={() => setOpen((o) => !o)} className="rounded p-1 text-slate-500 hover:bg-slate-200">
        <ChevronDown size={11} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 min-w-[160px] overflow-hidden rounded-lg border border-line bg-white shadow-lg">
          {options.map((opt) => (
            <button key={opt.value} type="button" onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onPick(opt.value); setOpen(false); }}
              className="block w-full px-3 py-1.5 text-left text-sm hover:bg-cloud">
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </span>
  );
}
