import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Heading1, Heading2, Heading3, Quote, Undo, Redo, Unlink } from "lucide-react";
import { useEffect, useCallback } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  onImageUpload?: () => Promise<string | null>;
  placeholder?: string;
}

const MenuButton = ({ onClick, active, children, title }: { onClick: () => void; active?: boolean; children: React.ReactNode; title: string }) => (
  <button type="button" onClick={onClick} title={title}
    className={`p-1.5 rounded-lg transition-colors ${active ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}>
    {children}
  </button>
);

const RichTextEditor = ({ content, onChange, onImageUpload, placeholder = "Skriv innholdet her…" }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-xl max-w-full my-4" } }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: "prose prose-sm dark:prose-invert max-w-none min-h-[200px] px-4 py-3 focus:outline-none" },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Lenke-URL:", prev || "https://");
    if (url === null) return;
    if (url === "") { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(async () => {
    if (!editor) return;
    if (onImageUpload) {
      const url = await onImageUpload();
      if (url) editor.chain().focus().setImage({ src: url }).run();
    } else {
      const url = window.prompt("Bilde-URL:");
      if (url) editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor, onImageUpload]);

  if (!editor) return null;

  return (
    <div className="rounded-xl border border-border/30 bg-muted/20 overflow-hidden">
      <div className="flex flex-wrap gap-0.5 p-1.5 border-b border-border/20 bg-muted/30">
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Overskrift 1"><Heading1 size={15} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Overskrift 2"><Heading2 size={15} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Overskrift 3"><Heading3 size={15} /></MenuButton>
        <div className="w-px bg-border/30 mx-1" />
        <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Fet"><Bold size={15} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Kursiv"><Italic size={15} /></MenuButton>
        <div className="w-px bg-border/30 mx-1" />
        <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Punktliste"><List size={15} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Nummerert liste"><ListOrdered size={15} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Sitat"><Quote size={15} /></MenuButton>
        <div className="w-px bg-border/30 mx-1" />
        <MenuButton onClick={setLink} active={editor.isActive("link")} title="Legg til lenke"><LinkIcon size={15} /></MenuButton>
        {editor.isActive("link") && (
          <MenuButton onClick={() => editor.chain().focus().unsetLink().run()} title="Fjern lenke"><Unlink size={15} /></MenuButton>
        )}
        <MenuButton onClick={addImage} title="Legg til bilde"><ImageIcon size={15} /></MenuButton>
        <div className="w-px bg-border/30 mx-1" />
        <MenuButton onClick={() => editor.chain().focus().undo().run()} title="Angre"><Undo size={15} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().redo().run()} title="Gjør om"><Redo size={15} /></MenuButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
