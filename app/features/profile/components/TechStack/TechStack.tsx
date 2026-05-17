"use client";

import type { SkillTag } from "../../../../lib/types";

function TerminalIcon() {
  return (
    <svg className="w-5 h-5 text-secondary" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zm-2-1h-6v-2h6v2zM7.5 17l-1.41-1.41L8.67 13l-2.59-2.59L7.5 9l4 4-4 4z" />
    </svg>
  );
}

function CloseSmall() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

function AddSmall() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

interface TechStackProps {
  skills: SkillTag[];
  isEditing: boolean;
  onToggleEdit: () => void;
  onRemove: (id: string) => void;
}

export function TechStack({ skills, isEditing, onToggleEdit, onRemove }: TechStackProps) {
  return (
    <section className="backdrop-blur-[20px] bg-surface/60 rounded-xl p-6 border border-white/40 shadow-[0_10px_30px_rgba(115,54,205,0.05)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-on-surface flex items-center gap-2">
          <TerminalIcon />
          Love Languages
        </h3>
        <button
          onClick={onToggleEdit}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isEditing
              ? "bg-primary text-on-primary shadow-md"
              : "bg-surface-container-high/60 text-on-surface-variant hover:bg-primary-container/30 hover:text-primary"
          }`}
        >
          {isEditing ? <CheckIcon /> : <EditIcon />}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="font-mono text-sm tracking-[0.02em] font-medium bg-secondary/10 text-secondary border border-secondary/20 rounded-lg px-3 py-1.5 flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: skill.color }} />
            {skill.label}
            {isEditing && (
              <button onClick={() => onRemove(skill.id)} className="ml-1 hover:text-error transition-colors cursor-pointer">
                <CloseSmall />
              </button>
            )}
          </div>
        ))}
        {isEditing && (
          <button className="font-mono text-sm tracking-[0.02em] font-medium bg-surface-container border border-dashed border-outline-variant text-on-surface-variant hover:bg-surface-container-high rounded-lg px-3 py-1.5 flex items-center gap-1 transition-colors cursor-pointer">
            <AddSmall /> Add
          </button>
        )}
      </div>
    </section>
  );
}
