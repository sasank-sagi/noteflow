"use server";

import { revalidatePath } from "next/cache";
import {
  createNote,
  updateNote,
  deleteNote,
  togglePin,
  type NoteInput,
} from "@/lib/db";

export async function createNoteAction(input: NoteInput) {
  if (!input.title.trim()) {
    return { error: "Title is required" };
  }
  const note = createNote(input);
  revalidatePath("/");
  return { note };
}

export async function updateNoteAction(id: number, input: Partial<NoteInput>) {
  if (input.title !== undefined && !input.title.trim()) {
    return { error: "Title cannot be empty" };
  }
  const note = updateNote(id, input);
  revalidatePath("/");
  return { note };
}

export async function deleteNoteAction(id: number) {
  deleteNote(id);
  revalidatePath("/");
  return { success: true };
}

export async function togglePinAction(id: number) {
  const note = togglePin(id);
  revalidatePath("/");
  return { note };
}
