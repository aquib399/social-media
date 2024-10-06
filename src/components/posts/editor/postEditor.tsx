"use client";
import { useSession } from "@/app/(main)/sessionProvider";
import { EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import UserAvatar from "@/components/userAvatar";
import { Button } from "@/components/ui/button";
import StarterKit from "@tiptap/starter-kit";
import { submitPost } from "./actions";
import "./styles.css";

export default function PostEditor() {
  const { user } = useSession();
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Write something here...",
      }),
    ],
    immediatelyRender: false,
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  async function onSubmit() {
    await submitPost(input).then(() => editor?.commands.clearContent());
  }
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar user={user} className="hidden sm:inline" />
        <EditorContent
          editor={editor}
          className="max-h-80 w-full overflow-y-auto rounded-2xl bg-background px-5 py-3"
        />
      </div>
      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={!input.trim()}
          className="min-w-20"
        >
          Post
        </Button>
      </div>
    </div>
  );
}
