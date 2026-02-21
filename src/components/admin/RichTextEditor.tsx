import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Youtube from "@tiptap/extension-youtube";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered,
  Link as LinkIcon, Image as ImageIcon, Heading1, Heading2, Heading3, Heading4,
  Quote, Undo, Redo, Unlink, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Highlighter, Minus, Code, Youtube as YoutubeIcon, Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon, Palette, Type, Pilcrow, RemoveFormatting
} from "lucide-react";
import { useEffect, useCallback, useState } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  onImageUpload?: () => Promise<string | null>;
  placeholder?: string;
}

const MenuButton = ({
  onClick, active, children, title, disabled
}: {
  onClick: () => void; active?: boolean; disabled?: boolean;
  children: React.ReactNode; title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={`p-1.5 rounded-lg transition-colors ${
      active
        ? "bg-primary/20 text-primary"
        : disabled
        ? "text-muted-foreground/30 cursor-not-allowed"
        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
    }`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-6 bg-border/30 mx-0.5 self-center" />;

const COLORS = [
  "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff",
  "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff",
  "#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc",
];

const RichTextEditor = ({ content, onChange, onImageUpload, placeholder = "Skriv innholdet her…" }: RichTextEditorProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline cursor-pointer" } }),
      Image.configure({
        HTMLAttributes: { class: "rounded-xl max-w-full my-6 mx-auto block" },
        allowBase64: true,
      }),
      Placeholder.configure({ placeholder }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      Youtube.configure({
        HTMLAttributes: { class: "rounded-xl overflow-hidden my-6 w-full aspect-video" },
        width: 0,
        height: 0,
      }),
      Superscript,
      Subscript,
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-lg dark:prose-invert max-w-none min-h-[400px] px-6 py-5 focus:outline-none prose-headings:font-heading prose-img:rounded-xl prose-img:my-6 prose-blockquote:border-l-primary/40 prose-blockquote:bg-muted/20 prose-blockquote:rounded-r-xl prose-blockquote:py-2 prose-blockquote:px-6 prose-a:text-primary prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm",
      },
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

  const addYoutube = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("YouTube-URL:", "https://www.youtube.com/watch?v=");
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  }, [editor]);

  const clearFormatting = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="rounded-xl border border-border/30 bg-muted/10 overflow-hidden">
      {/* Toolbar Row 1 - Block types & Headings */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border/20 bg-muted/30">
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Overskrift 1"><Heading1 size={15} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Overskrift 2"><Heading2 size={15} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Overskrift 3"><Heading3 size={15} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} active={editor.isActive("heading", { level: 4 })} title="Overskrift 4"><Heading4 size={15} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive("paragraph")} title="Avsnitt"><Pilcrow size={15} /></MenuButton>

        <Divider />

        <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Fet"><Bold size={15} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Kursiv"><Italic size={15} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Understrek"><UnderlineIcon size={15} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Gjennomstrekning"><Strikethrough size={15} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive("superscript")} title="Hevet skrift"><SuperscriptIcon size={15} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive("subscript")} title="Senket skrift"><SubscriptIcon size={15} /></MenuButton>

        <Divider />

        {/* Text color */}
        <div className="relative">
          <MenuButton onClick={() => { setShowColorPicker(!showColorPicker); setShowHighlightPicker(false); }} title="Tekstfarge">
            <Palette size={15} />
          </MenuButton>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-background border border-border/30 rounded-xl shadow-xl z-50 grid grid-cols-10 gap-1 w-[220px]">
              {COLORS.map(c => (
                <button key={c} onClick={() => { editor.chain().focus().setColor(c).run(); setShowColorPicker(false); }}
                  className="w-5 h-5 rounded-md border border-border/20 hover:scale-125 transition-transform" style={{ backgroundColor: c }} />
              ))}
              <button onClick={() => { editor.chain().focus().unsetColor().run(); setShowColorPicker(false); }}
                className="col-span-10 text-[10px] text-muted-foreground mt-1 hover:text-foreground">Fjern farge</button>
            </div>
          )}
        </div>

        {/* Highlight */}
        <div className="relative">
          <MenuButton onClick={() => { setShowHighlightPicker(!showHighlightPicker); setShowColorPicker(false); }} active={editor.isActive("highlight")} title="Markering">
            <Highlighter size={15} />
          </MenuButton>
          {showHighlightPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-background border border-border/30 rounded-xl shadow-xl z-50 grid grid-cols-10 gap-1 w-[220px]">
              {COLORS.slice(20).map(c => (
                <button key={c} onClick={() => { editor.chain().focus().toggleHighlight({ color: c }).run(); setShowHighlightPicker(false); }}
                  className="w-5 h-5 rounded-md border border-border/20 hover:scale-125 transition-transform" style={{ backgroundColor: c }} />
              ))}
              <button onClick={() => { editor.chain().focus().unsetHighlight().run(); setShowHighlightPicker(false); }}
                className="col-span-10 text-[10px] text-muted-foreground mt-1 hover:text-foreground">Fjern markering</button>
            </div>
          )}
        </div>

        <MenuButton onClick={clearFormatting} title="Fjern formatering"><RemoveFormatting size={15} /></MenuButton>
      </div>

      {/* Toolbar Row 2 - Alignment, Lists, Media */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border/20 bg-muted/20">
        <MenuButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Venstrejuster"><AlignLeft size={15} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Midtstill"><AlignCenter size={15} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Høyrejuster"><AlignRight size={15} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Blokkjuster"><AlignJustify size={15} /></MenuButton>

        <Divider />

        <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Punktliste"><List size={15} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Nummerert liste"><ListOrdered size={15} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Sitat"><Quote size={15} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Kodeblokk"><Code size={15} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horisontal linje"><Minus size={15} /></MenuButton>

        <Divider />

        <MenuButton onClick={setLink} active={editor.isActive("link")} title="Legg til lenke"><LinkIcon size={15} /></MenuButton>
        {editor.isActive("link") && (
          <MenuButton onClick={() => editor.chain().focus().unsetLink().run()} title="Fjern lenke"><Unlink size={15} /></MenuButton>
        )}
        <MenuButton onClick={addImage} title="Legg til bilde"><ImageIcon size={15} /></MenuButton>
        <MenuButton onClick={addYoutube} title="YouTube-video"><YoutubeIcon size={15} /></MenuButton>

        <Divider />

        <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Angre"><Undo size={15} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Gjør om"><Redo size={15} /></MenuButton>

        <div className="ml-auto text-[10px] text-muted-foreground/40 pr-2">
          {editor.storage.characterCount?.characters?.() ?? editor.getText().length} tegn
        </div>
      </div>


      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
